// ==UserScript==
// @name               Uni_Auto sign
// @name:zh-CN         通用_自动签到
// @name:en-US         Uni_Auto sign
// @description        打开网页后自动或半自动完成签到，避免重复劳动。
// @version            4.1.3
// @author             LiuliPack
// @license            WTFPL
// @namespace          https://gitlab.com/LiuliPack/UserScript
// @match              *://*/*
// @grant              GM_addStyle
// @grant              GM_registerMenuCommand
// @grant              window.close
// @supportURL         https://gitlab.com/liulipack/UserScript
// @run-at             document-body
// @downloadURL https://update.greasyfork.org/scripts/458623/Uni_Auto%20sign.user.js
// @updateURL https://update.greasyfork.org/scripts/458623/Uni_Auto%20sign.meta.js
// ==/UserScript==

/* 配置示范
# 签到
{
    "remark": "通用 - 简述使用得扩展、主题或相似点",
    "remark": "通用(已知适配站点、已知适配站点、) - 简述使用得扩展、主题或相似点",
    "remark": "站点名",
    "remark": "站点名 - 子项",
    "link": /链接-正则匹配/,
    "link": "链接-网址匹配",
    "close": false, // 自动关闭
    "check": {
        "mode": "ele 元素存在、text 元素内文本、attr 元素属性",
        "ele": "",
        "data": "", // 元素内文本
        "data": { // 元素属性
            "key": "",
            "value": ""
        }
    },
    "sign": [
        {
            "remark": "点击元素",
            "mode": "clicker",
            "ele": "元素定位符",
            "delay": 0
        },
        {
            "remark": "写入文本",
            "mode": "writer",
            "ele": "元素定位符",
            "text": "",
            "delay": 0
        },
        {
            "remark": "自定义脚本",
            "mode": "scripter",
            "ele": () => {
                // 脚本写在这
            },
            "delay": 0
        }
    ]
}
#
{
    "remark": "站点名",
    "remark": "站点名 - 页面",
    "enable": true, # 启用即 true，禁用即 false
    "link": "https://bbs.acgrip.com/dsu_paulsign-sign.html"
},
*/

(function() {
    'use strict';

    // 定义配置( config )和快捷元素定位器( $(元素定位符) )变量和侦测元素初现( observer(元素定位符).then(() => { /*代码写在这*/ }) )和页面关闭者( closeer(页面关闭配置) )函数。
    let config = {
        // 签到配置。您也可以按照上方的「配置示范」自由删除或增加。
        "sign": [
            { "remark": "通用(Anime 字幕论坛、NeoACG) - Discuz DSU 每日签到插件", "link": /dsu_paulsign-sign.html$|plugin.php?id=dsu_paulsign:sign$/, "close": true, "check": { "mode": "ele", "ele": "#yl" }, "sign": [ { "remark": "选择心情", "mode": "clicker", "ele": "#yl", "delay": 0 }, { "remark": "勾选不填写留言", "mode": "clicker", "ele": "#qiandao > table.tfm > tbody > tr:nth-child(1) > td > label:nth-child(3) > input[type=radio]", "delay": 0 }, { "remark": "签到执行", "mode": "clicker", "ele": "#shuai_menu + table .tac a", "delay": 0 }, { "remark": "Anime 字幕论坛专有 - 浏览「Discuz 任务」页", "mode": "script", "data": () => { /*如果页面匹配就打开「Discuz 任务」页*/ if (URL.search(/bbs.acgrip.com/) !== -1) { $('#m_menu li:nth-child(9) a').click(); } }, "delay": 2500 } ] },
            { "remark": "萌幻之乡、芯幻 - WordPress INN AO 主题", "link": /https:\/\/(www.hmoeh.com|xhcyra.com)\/author\/\d+/, "close": true, "check": { "mode": "attr", "ele": "#inn-nav__point-sign-daily a", "data": { "key": "title", "value": "签到" } }, "sign": [ { "remark": "签到执行", "mode": "clicker", "ele": "#inn-nav__point-sign-daily a", "delay": 0 } ] },
            { "remark": "Anime 字幕论坛 - Discuz 任务", "link": "https://bbs.acgrip.com/home.php?mod=task", "close": true, "check": { "mode": "ele", "ele": "#ct a[href='home.php?mod=task&do=apply&id=1']" }, "sign": [ { "remark": "签到执行", "mode": "clicker", "ele": "#ct a[href='home.php?mod=task&do=apply&id=1']", "delay": 0 } ] },
            { "remark": "Anime 字幕论坛 - Discuz 任务完成", "link": "https://bbs.acgrip.com/home.php?mod=task&item=done", "close": true, "check": { "mode": "ele", "ele": "#mn_N462e a" }, "sign": [ { "remark": "签到执行", "mode": "clicker", "ele": "#mn_N462e a", "delay": 0 } ] },
            { "remark": "2DFun", "link": /https:\/\/2dfan.com\/(users\/\d+\/recheckin)?$/, "close": true, "check": { "mode": "ele", "ele": "#do_checkin" }, "sign": [ { "remark": "签到执行", "mode": "clicker", "ele": "#do_checkin" } ] },
            { "remark": "南+ - 申请任务", "link": "https://www.south-plus.net/plugin.php?H_name-tasks.html.html", "close": true, "check": { "mode": "ele", "ele": "#p_15 a" }, "sign": [ { "remark": "申请任务「日常」", "mode": "clicker", "ele": "#p_15 a", "delay": 0 }, { "remark": "申请任务「周常」", "mode": "clicker", "ele": "#p_14 a", "delay": 0 }, { "remark": "前往「完成任务」页", "mode": "clicker", "ele": "tr.tr3:nth-child(3) td a", "delay": 2000 } ] },
            { "remark": "南+ - 完成任务", "link": "https://www.south-plus.net/plugin.php?H_name-tasks-actions-newtasks.html.html", "close": true, "check": { "mode": "ele", "ele": "#both_15 a" }, "sign": [ { "remark": "完成任务「日常」", "mode": "clicker", "ele": "#both_15 a", "delay": 0 }, { "remark": "完成任务「周常」", "mode": "clicker", "ele": "#both_14 a", "delay": 0 } ] },
            { "remark": "绯月", "link": "https://bbs.kfpromax.com/kf_growup.php", "close": true, "check": { "mode": "ele", "ele": ".gro_divhui:nth-child(5) + div a:not(a[href='javascript:;'])" }, "sign": [ { "remark": "签到执行", "mode": "clicker", "ele": ".gro_divhui:nth-child(5) + div a", "delay": 0 } ] },
            { "remark": "绅士仓库", "link": "https://cangku.moe/", "close": true, "check": { "mode": "text", "ele": ".auth-info .footer li:nth-child(2) a", "data": "签到" }, "sign": [ { "remark": "签到执行", "mode": "clicker", "ele": ".auth-info .footer li:nth-child(2) a", "delay": 0 } ] },
            { "remark": "紳士の庭", "link": "https://gmgard.moe/", "close": true, "check": { "mode": "text", "ele": "#checkw", "data": "点此签到" }, "sign": [ { "remark": "签到执行", "mode": "clicker", "ele": "#checkin", "delay": 2000 } ] },
        ],
        //「打开签到页」配置。您可自行调整调整 enable 选项为 true 时启用 false 禁用，或者您也可以按照上方的「配置示范」自由删除或增加。
        "open": [
            { "remark": "Anime 字幕论坛 - Discuz 任务", "enable": false, "link": "https://bbs.acgrip.com/home.php?mod=task" },
            { "remark": "NeoACG", "enable": false, "link": "https://neoacg.com/dsu_paulsign-sign.html" },
            { "remark": "萌幻之乡", "enable": false, "link": "https://www.hmoeh.com/author/143569" },
            { "remark": "芯幻", "enable": false, "link": "https://xhcyra.com/author/1000001" },
            { "remark": "2DFun", "enable": false, "link": "https://2dfan.com/" },
            { "remark": "南+", "enable": false, "link": "https://www.south-plus.net/plugin.php?H_name-tasks.html.html" },
            { "remark": "绯月", "enable": false, "link": "https://bbs.kfpromax.com/kf_growup.php" },
            { "remark": "绅士仓库", "enable": false, "link": "https://cangku.moe/" },
            { "remark": "紳士の庭", "enable": false, "link": "https://gmgard.moe/" },
        ]
    },
        $ = (ele) => document.querySelector(ele),
        URL = location.href;

    function observer(ele) {
        return new Promise(resolve => {
            if ($(ele)) {
                return resolve($(ele));
            }

            const observer = new MutationObserver(mutations => {
                if ($(ele)) {
                    observer.disconnect();
                    resolve($(ele));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    function closeer(data) {
        // 等待20秒然后，如果配置得「关闭页面」启用且页面未浏览就关闭页面
        setTimeout(() => {
            if(data && document.hidden) {
                window.close();
            }
        }, 20000)
    }

    // 遍历签到配置
    config.sign.forEach(datas => {
        // 如果链接匹配
        if(typeof(datas.link) === "object" && URL.search(datas.link) !== -1 || typeof(datas.link) === "string" && datas.link === URL) {
            // 等待元素初现
            observer(datas.check.ele).then(ele => {
                // 如果没有签到
                if(datas.check.mode === "ele" || datas.check.mode === "text" && ele.textContent === datas.check.data || datas.check.mode === "attr" && ele.getAttribute(datas.check.data.key) === datas.check.data.value) {
                    // 遍历签到步骤
                    datas.sign.forEach(data => {
                        // 等待指定时间
                        setTimeout(() => {
                            // 签到执行
                            if(data.mode === "clicker" && $(data.ele)) {
                                $(data.ele).click();
                            }else if(data.mode === "writer" && $(data.ele)) {
                                $(data.ele).value = data.text;
                            }else if(data.mode === "scripter") {
                                data.data()
                            }
                        }, data.delay)
                    })
                    // 执行「页面关闭者」函数
                    closeer(datas.close);
                }
            });
            // 执行「页面关闭者」函数
            closeer(datas.close);
        }
    });

    // 创建「打开签到页」菜单命令
    GM_registerMenuCommand("打开签到页", () => {
        // 遍历「打开签到页」配置
        config.open.forEach(data => {
            // 更具配置打开签到页
            if(data.enable) {
                window.open(data.link);
            }
        })
    })

})();