// ==UserScript==
// @name         5297425eb19c0d4a7a5930a9f8dc8767
// @namespace    DS
// @version      1.1.4
// @description  DS 测试
// @author       DS
// @match        http://cpquery.cnipa.gov.cn/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_addStyle
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425506/5297425eb19c0d4a7a5930a9f8dc8767.user.js
// @updateURL https://update.greasyfork.org/scripts/425506/5297425eb19c0d4a7a5930a9f8dc8767.meta.js
// ==/UserScript==

function getOrgId() {
    return localStorage.getItem("ORG_ID") || "暂停";
}

const org_id = getOrgId();
const uuid = "5297425eb19c0d4a7a5930a9f8dc8767";
const key = "SQH_" + org_id;// 代执行 list 缓存
const flag = "AUTO_" + org_id;// 1 开始 0 停止 缓存
const params_key = "PARAMS_" + org_id;// 返回值 缓存

const baseUrl = "http://cpquery.cnipa.gov.cn";
const feeUrl = baseUrl + "/txnQueryFeeData.do?select-key:shenqingh=${shenqingh}";// 费用页面
const statusUrl = baseUrl + "/txnQueryBibliographicData.do?select-key:shenqingh=${shenqingh}";// 申请信息页面
const queryUrl = baseUrl + "/txnPantentInfoList.do";// 查询页面

const org_api = {
    test: "http://192.168.3.12:8081",
    11724: "http://47.94.3.51",
    11212: "http://39.105.12.11",
    11572: "http://39.107.158.245",
    11496: "http://ip.joinbull.com",
    31390: "http://zhuanli.qiyelushang.com",
    11984: "http://xzy.ipgogo.com",
    33402: "http://8.131.50.74"
};

const callback_api = org_api[org_id] + "/data/callback.do";
const list_api = org_api[org_id] + "/data/getList.do";
const remove_api = org_api[org_id] + "/data/remove.do";

const org_name = {
    test: "欢迎您，北京成实知识产权代理有限公司",
    11724: "欢迎您，北京成实知识产权代理有限公司",
    11212: "欢迎您，北京轻创知识产权代理有限公司",
    11572: "欢迎您，北京卓特专利代理事务所（普通合伙）",
    11496: "欢迎您，北京君泊知识产权代理有限公司",
    31390: "欢迎您，上海大为知卫知识产权代理事务所（普通合伙）",
    11984: "欢迎您，北京鑫知翼知识产权代理事务所（普通合伙）",
    33402: "欢迎您，杭州高盟专利代理事务所（普通合伙）"
}

/**
 * 重写等待元素加载方法
 * @param func
 * @param times
 * @param interval
 * @returns {Window.jQuery}
 */
jQuery.fn.wait = function (func, times, interval) {
    var _times = times || 100, //100次
        _interval = interval || 20, //20毫秒每次
        _self = this,
        _selector = this.selector, //选择器
        _iIntervalID; //定时器id
    if (this.length) { //如果已经获取到了，就直接执行函数
        func && func.call(_self);
    } else {
        _iIntervalID = setInterval(function () {
            if (!_times) { //是0就退出
                window.location.reload();
                clearInterval(_iIntervalID);
            }
            _times <= 0 || _times--; //如果是正数就 --
            _self = $(_selector); //再次选择
            if (_self.length) { //判断是否取到
                func && func.call(_self);
                clearInterval(_iIntervalID);
            }
        }, _interval);
    }
    return this;
}

function getShenqinghData() {
    const sh = GM_getValue(key);
    if (!sh || sh.length === 0) {
        retrieveURL(list_api);
    }
}

function GM_getValue(key) {
    let res = localStorage.getItem(key);
    return JSON.parse(res)
}

function GM_setValue(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function GM_removeValue(value, removeValue) {
    const arr2 = value.filter(function (item) {
        return item.shenqingh && (removeValue !== item.shenqingh)
    });
    localStorage.setItem(key, JSON.stringify(arr2))
}

function start() {
    GM_setValue(flag, "1");
    window.location.reload();
}

function stop() {
    GM_setValue(flag, "0");
    window.location.replace(baseUrl);
}

/**
 * 获取待查询的申请号
 * @param url
 */
function retrieveURL(url) {
    let xhr = new XMLHttpRequest();
    xhr.open("get", url + "?key=" + uuid, false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            const data = JSON.parse(xhr.responseText);
            if (data.gridModel && data.gridModel.length > 0) {
                GM_setValue(key, data.gridModel);
                start();
            } else {
                stop();
            }
        } else {
            // stop();
            window.location.reload();
        }
    }
    xhr.send(null);
}

/**
 * 根据 地址栏 url 获取申请号
 * @param key
 * @returns {string}
 */
function getSearchData(key) {
    const data = window.location.search.substring(1).split("&");
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const params = item.split("=");
        if (params[0] === key) {
            return params[1];
        }
    }
}

/**
 * 保存状态和费用数据
 */
function saveStatus() {
    const params = GM_getValue(params_key) || {};
    GM_setValue(params_key, {});// 清理返回值
    if (params.shenqingh) {
        const dataList = GM_getValue(key);
        $.ajax({
            url: callback_api
            , data: {jsonData: JSON.stringify(params), key: uuid}
            , async: false
            , type: 'post'
            , success: function (data) {
                GM_removeValue(dataList, params.shenqingh);// 删除已处理的
                if (dataList && dataList.length > 1) {
                    // 执行下一条
                    reloadStatusPage(dataList[1]["shenqingh"]);
                } else {
                    // 重新获取数据
                    window.location.replace(queryUrl);
                }
            }
            , error: function (res) {
                reloadStatusPage(dataList[0]["shenqingh"]);
            }
        })
    }
}

/**
 * 获取 html 页面数据
 * @param id
 * @returns {[]}
 */
function getTableData(id) {
    let list = [];
    $("#" + id).wait((e) => {
        const _$ = $("#" + id).find("tr");
        for (let i = 1; i < _$.length; i++) {
            const td = $(_$[i]).find("td");
            const data = {index: i};
            for (let d = 0; d < td.length; d++) {
                const sp = $($(td[d]).find("span")[0]);
                const name = sp.attr("name").split(":")[1];
                data[name] = sp.attr("title");
            }
            list.push(data);
        }
    })
    return list;
}

/**
 * 根据申请号 重新加载专利信息页面
 * @param shenqingh
 */
function reloadStatusPage(shenqingh) {
    window.location.replace(statusUrl.replace("${shenqingh}", shenqingh));
}

/**
 * 发生转移或者找不到数据的处理
 * @param shenqingh
 */
function changeSave(shenqingh) {
    const list = GM_getValue(key) || [];
    // if (!shenqingh) {
    //     GM_removeValue(list, shenqingh);
    //     return;
    // }

    // GM_removeValue(list, shenqingh);
    // if (list.length > 1) {
    //     reloadStatusPage(list[1]["shenqingh"]);
    // } else {
    //     window.location.replace(queryUrl);
    // }

    $.ajax({
        url: remove_api
        , data: {shenqingh: shenqingh, key: uuid}
        , async: false
        , type: 'post'
        , success: function (data) {
            GM_removeValue(list, shenqingh);
            if (list.length > 1) {
                reloadStatusPage(list[1]["shenqingh"]);
            } else {
                window.location.replace(queryUrl);
            }
        }
        , error: function (res) {
            reloadStatusPage(shenqingh);
        }
    });
}

/**
 * 检查是否是需要监控的代理机构
 * @returns {boolean}
 */
function checkOrg() {
    var name = $("#header1 .hr").find("li")[0].title;
    if (!name) {
        return false;
    }
    return name === org_name[org_id];
}

function setPageHtml() {
    const div = document.createElement("div");
    div.innerHTML =
        "<style>\n" +
        "    .float-box {\n" +
        "        top: 0;\n" +
        "        left: 0;\n" +
        "        z-index: 999;\n" +
        "        width: 200px;\n" +
        "        height: 100px;\n" +
        "        background: red;\n" +
        "        position: fixed;\n" +
        "        color: #f3f3f3;\n" +
        "        padding: 10px;\n" +
        "        border-radius: 5px;\n" +
        "    }\n" +
        "\n" +
        "    .float-box .current-org {\n" +
        "        height: 50px;\n" +
        "    }\n" +
        "\n" +
        "    .float-box .current-org #org_id {\n" +
        "        font-size: 20px;\n" +
        "        font-weight: bold;\n" +
        "    }\n" +
        "\n" +
        "    .float-box .change-button {\n" +
        "        text-align: center;\n" +
        "    }\n" +
        "</style>\n" +
        "<div class=\"float-box\">\n" +
        "    <div class=\"current-org\">\n" +
        "        当前状态：<span id=\"org_id\">停止</span>\n" +
        "    </div>\n" +
        "    <div class=\"change-button\">\n" +
        "        <button id=\"changeOrg\">切换机构</button>\n" +
        "    </div>\n" +
        "</div>\n";
    $("body").append(div);

    const changeOrg = document.getElementById("changeOrg");

    changeOrg.addEventListener('click', e => {
        var orgId = window.prompt("请输入机构代码，其他任意字符停止");
        if (!orgId) {
            return;
        }
        if (!org_name[orgId]) {
            showMsg("您输入的机构代码暂未实现！");
        }
        document.getElementById("org_id").innerText = orgId;
        localStorage.setItem("ORG_ID", orgId);
        window.location.reload();
    });

    document.getElementById("org_id").innerText = org_id;
}

(function () {
    'use strict';
    $(document).ready(function () {

        setPageHtml();// 设置页面显示

        if (!org_id || !org_name[org_id]) {
            return;
        }

        if (!checkOrg()) {
            showMsg("无法启动脚本，代理机构登录错误，请登录[" + org_id + "],如不需要启动，请忽略！");
            return;
        }

        getShenqinghData();// 获取需要查询的申请号

        const pathName = window.location.pathname;
        const shenqingh = getSearchData("select-key:shenqingh");
        const hisParam = GM_getValue(params_key) || {};
        // 费用信息
        if (pathName.indexOf("txnQueryFeeData") >= 0) {
            let data = {};
            data.djfidList = getTableData("djfid");// 代缴费
            data.yjfidList = getTableData("yjfid");// 应缴费
            GM_setValue(params_key, {...hisParam, ...data});
            saveStatus();// 保存信息
        } else if (pathName.indexOf("txnQueryBibliographicData") >= 0) {
            // 申请信息
            $("span[name='record_zlx:shenqingh']").wait((e) => {
                const anjianywzt = $("span[name='record_zlx:anjianywzt']")[0].title;// 案件状态
                const shenqingr = $("span[name='record_zlx:shenqingr']")[0].title;// 申请日
                const fenantijr = $("span[name='record_zlx:fenantjr']")[0].title;// 分案提交日
                const zhufenlh = $("span[name='record_zlx:zhufenlh']")[0].title;// 主分类号
                const famingmc = $("#zlxid .imfor_box2").find("td")[1].innerText;
                if (anjianywzt && shenqingh && famingmc) {
                    const data = {anjianywzt, shenqingh, famingmc, shenqingr, fenantijr, zhufenlh};
                    data.sqrList = getTableData("sqrid");// 申请人信息
                    GM_setValue(params_key, {...hisParam, ...data});
                    $("#fyxx").click();// 点击费用信息
                } else {
                    // 当前申请号可能已转移代理所
                    changeSave(shenqingh);
                }
            })
        } else if (pathName.indexOf("txnPantentInfoList") >= 0) {
            GM_setValue(params_key, {});
            const list = GM_getValue(key);
            if (list && list.length > 0) {
                reloadStatusPage(list[0]["shenqingh"]);
            }
        }
    });
})();
