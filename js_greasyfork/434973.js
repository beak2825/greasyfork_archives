// ==UserScript==
// @name         长缆 mdm 系统增强操作
// @version      1.3
// @description  在物料管理页面，功能增强，显示当前行的物料需要维护哪些视图，同时突出 oa状态异常和 sap 状态异常的数据（数据行太长了非常不方便
// @match        http://192.168.10.235:8090/pmp-web/**
// @match        http://192.168.10.236:8090/**
// @run-at       document-end
// @icon         https://img1.baidu.com/it/u=3613361968,4235410620&fm=26&fmt=auto
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @namespace    https://greasyfork.org/users/823922
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/434973/%E9%95%BF%E7%BC%86%20mdm%20%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/434973/%E9%95%BF%E7%BC%86%20mdm%20%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==
{
    let $ = unsafeWindow.$;
    let config = {
        "id": "ff80808172799e38017279a98ef4000f",
        "title": "物料信息管理",
        "close": true,
        "url": "cgAutoListController.do?list&id=mdm_basics",
        "urlType": "relative"
    };
    if (unsafeWindow.self != unsafeWindow.top) { // 只在最上层的 window 起效
        console.log('not top window');
        return false;
    }
    // 左上角的 logo 快速打开 物料信息管理页面
    $('.logo').click(function() {
        unsafeWindow.addTabs(config)
        $(this).attr('title', '物料信息管理');
    });
    GM.registerMenuCommand('同步视图配置', tryFindAndSyncViewConfig, '同步视图配置');
    GM.registerMenuCommand('同步 sap 全部视图', sendAllDateToSapByPromptMsg);

    function sendAllDateToSapByPromptMsg() {
        let ids = prompt('请输入 JSON 格式的 数组 数据', '示例：["1", "2"]');
        if (ids != null) {
            ids = JSON.parse(ids);
            unsafeWindow.sendAllDateToSap(ids);
        }
    }
    // 判断是否需要自动点击登陆按钮
    {
        // auto load system
        if (typeof loadAgileSystemNotice == 'undefined') {
            let uname = 'admin';
            let pwd = unsafeWindow.location.hostname == '192.168.10.236' ? '654321' : 'pmpadmin123456';
            $('[name="userName"]').val(uname)
            $('[name="password"]').val(pwd)
            $('#but_login').click();
        } else {
            $('.logo').click();
        }
    };

    // 返回对应的子 iframe
    function getPageIframe(tabName) {
        let pageId = $(`.page_tab_title:contains("${tabName}")`).parent().attr('data-pageid');
        return pageId != undefined ? $(`#iframe_${pageId}`).contents() : null;
    }

    function tryFindAndSyncViewConfig() {
        let $page = getPageIframe('视图配置');
        if ($page == null) {
            alert('同步视图配置时需要先打开这个选项卡')
        } else {
            updateViewConfig($page);
            alert('数据同步成功！')
        }
    }
    // 尝试从打开的视图数据维护页面中提取出对应的必填视图数据
    function updateViewConfig($page) {
        let viewConfigs = {};
        // ['物料类型','质量是否必填','财务是否必填','仓库是否必填','生产是否必填','采购是否必填','营销是否必填','MRP是否必填']
        let attrs = ["mdm_basics_type", "mdm_is_qm", "mdm_is_fi", "mdm_is_wm", "mdm_is_pp", "mdm_is_pa", "mdm_is_sd", "mdm_is_mrp"];
        let set = new Set(attrs);
        $page.find('.datagrid-view2 .datagrid-btable tr').each(function() {
            let key;
            $(this).find('td').each(function() {
                let t = $(this).text(),
                    f = $(this).attr('field');
                if (f == attrs[0]) {
                    key = t.toLowerCase();
                    viewConfigs[key] = [];
                } else if (set.has(f)) {
                    if (t == '是') {
                        viewConfigs[key].push(f.replace('is_', ''));
                    }
                }
            })
        })
        console.log(viewConfigs)
        unsafeWindow.localStorage.pmpViewConfig = JSON.stringify(viewConfigs);
    }
    // 功能强化
    // ----------------  数据截取处理  -------------------
    unsafeWindow.mdmSplitByEnter = function(str) {
        return str.split('\n').filter(n => n != '').map(n => "'" + n + "'").join(',');
    }
    unsafeWindow.sendBasicsViewToSap = function(str) { // 发送基本视图到 sap
        let arr = str.split('\n').filter(n => n != '');
        let err = [];

        call();

        function call() {
            if (arr.length == 0) {
                console.log('处理失败的id', err)
                return false;
            }
            let id = arr.pop();
            fetch("http://192.168.10.235:8090/pmp-web/interSapController.do?sendAllSAP", {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "cache-control": "no-cache",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "pragma": "no-cache",
                        "x-requested-with": "XMLHttpRequest"
                    },
                    "referrer": "http://192.168.10.235:8090/pmp-web/cgAutoListController.do?list&id=mdm_basics",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": `ids=${id}`,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                }).then(r => r.json())
                .then(d => {
                    if (d.success == true && d.msg == '操作成功') {
                        // console.log('test ok')
                    } else {
                        err.push(id);
                    }
                    console.log(id, d)
                    call();
                });
        }
    }
    unsafeWindow.sendAllDateToSap = function(str) { // 发送全部数据到 SAP
        //debugger
        let arr = [];
        if (typeof str == 'string') {
            arr = str.split('\n').filter(n => n != '');
        } else {
            arr = str;
        }
        arr = split2Arr(arr, 10);
        let err = [];

        call();

        function call() {
            if (arr.length == 0) {
                console.log('处理失败的id', err)
                alert(err)
                return false;
            }
            let ids = arr.pop().join('%2C');
            fetch("http://192.168.10.235:8090/pmp-web/interSapNewController.do?sendSapData", {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "x-requested-with": "XMLHttpRequest"
                    },
                    "referrer": "http://192.168.10.235:8090/pmp-web/cgAutoListController.do?list&id=mdm_basics",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": `ids=${ids}`,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                }).then(r => r.json())
                .then(d => {
                    if (d.success == true && d.msg == '已经成功同步到sap系统!') {
                        // console.log('test ok')
                    } else {
                        err.push(ids);
                    }
                    console.log(ids, d)
                    call();
                });
        }

        function split2Arr(arr, len = 10) {
            let arrs = [],
                p1 = len;
            arr.forEach(n => {
                if (p1++ >= len) {
                    arrs.push(new Array());
                    p1 = 1;
                }
                arrs[arrs.length - 1].push(n);
            })
            return arrs;
        }
    }
    unsafeWindow.queryDB = function(sql, callback = (d) => console.log(d)) {
        let body = {
            sql: sql
        }
        fetch(`http://localhost/sql/query`, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "zh-CN,zh;q=0.9",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1"
            },
            "referrer": "http://192.168.10.235:8090/",
            "body": JSON.stringify(body),
            "method": "POST",
            "mode": "cors",
        }).then(r => r.json()).then(callback);
    }
    unsafeWindow.execDB = function(sql, callback = () => {}) {
        let body = {
            sql: sql
        }
        fetch(`http://localhost/sql/exec`, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "zh-CN,zh;q=0.9",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1"
            },
            "referrer": "http://192.168.10.235:8090/",
            "body": JSON.stringify(body),
            "method": "POST",
            "mode": "cors",
        }).then(r => r.json()).then(callback);
    }
    // 添加简易导航栏
    function TabInfo(id = '', title = '', url = '', count = 0) {
        return {
            "id": id,
            "title": title,
            "close": true,
            "url": url,
            "urlType": "relative",
            count: count
        }
    }
    let tabInfos = JSON.parse(unsafeWindow.top.localStorage.tabInfos || '{}'); //object
    {
        let old = unsafeWindow.addTabs;
        unsafeWindow.addTabs = function(options) {
            let {
                id: id,
                title: title,
                url: url
            } = options;
            let currTab = tabInfos[title] || new TabInfo(id, title, url);
            currTab.count += 1;
            tabInfos[title] = currTab;
            unsafeWindow.top.localStorage.tabInfos = JSON.stringify(tabInfos);
            old(options);
        };
    }

    {
        // add html
        let css = `
        <style>
            ._title_item {
                display: inline-block;
                /* border: 1px solid red; */
                position: absolute;
                left: 0;
                top: 60px;
                z-index: 999;
                padding: 5px;
                background: #fff3;
                border-radius: 10px;
            }

            ._title_item>div {
                padding: 5px 10px;
                margin: 5px;
                background: #fff;
                border-radius: 4px;
                cursor: pointer;
                overflow: hidden;
                max-width: 40px;
                text-overflow: clip;
                white-space: pre;
                opacity:0.5;
            }

            ._title_item>div:hover {
                color: #fff;
                background: #03aa;
            }

            ._title_item>div:active {
                font-weight: bold;
                color: #fff;
                background: #03a9;
            }

            ._title_item:hover>div {
                max-width: 120px;
                opacity:1;
            }
        </style>
        `
        $('head', unsafeWindow.document).append(css);
        let html = '';
        Object.values(tabInfos).sort((a, b) => b.count - a.count).slice(0, 10).forEach(tab => html += `<div>${tab.title}</div>`)
        $('body', unsafeWindow.document).append(`<div class="_title_item">${html}</div>`);
        $('._title_item>div', unsafeWindow.document).click(function() {
            unsafeWindow.addTabs(tabInfos[$(this).text()]);
        })
    }
}
