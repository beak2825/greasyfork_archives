// @require      http://code.jquery.com/jquery-3.x-git.min.js
/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name         库存小助手
// @namespace    https://greasyfork.org/zh-CN/scripts/483332-%E5%BA%93%E5%AD%98%E5%B0%8F%E5%8A%A9%E6%89%8B
// @version      1.0
// @description  这是“一起搬砖不辛苦”群的专用BUFF市场插件的配套组件，有库存功能及其它。
// @author       chinapok
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license         AGPL-3.0
// @copyright       2024, chinapok
// @require         https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.js
// @require         https://cdn.jsdelivr.net/npm/xlsx-core@1.0.3/xlsx.core.min.js
// @match           https://buff.163.com/market/steam_inventory*
// @match           https://buff.163.com/market/sell_order*
// @match           https://buff.163.com/market/sell_order/on_sale*
// @run-at          document-body
// @grant           unsafeWindow
// @grant           GM_info
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_openInTab
// @grant           GM_listValues
// @grant           GM_deleteValue
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @connect         steamcommunity.com
// @connect         www.buffgoods.com
// @connect         steam.jijidui.cn
// @connect         myip.ipip.net
// @connect         api.myip.la
// @connect         nordvpn.com
// @connect         ip-api.com
// @downloadURL https://update.greasyfork.org/scripts/483332/%E5%BA%93%E5%AD%98%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/483332/%E5%BA%93%E5%AD%98%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 防止重复安装冲突
    if ($(".logo").hasClass("buffHelperLoaded")) { return; }
    $(".logo").addClass("buffHelperLoaded");

	/*//双击关闭页面
	$("body").dblclick(function (){
        clw();
	});*/
    //showMessage("通知信息", "这里是测试通知信息", "info",false,'bottom-center');
    // 全局（插件环境）异常捕获
    window.onerror = function (e) {
        try {
            // e.returnValue = false;       值为false时不会触发console.error事件
            if (!e.error) { return; }// 通常是浏览器内各种原因导致的报错
            let scriptName = undefined;
            // let errorType = undefined;   也许可以用来区分scriptManager，但是现在用不上
            let renderingEngine = window.navigator.userAgent.match(/(Chrome|Firefox)\/([^ ]*)/);
            let lineno = e.lineno;
            switch (renderingEngine && renderingEngine[1]) {
                case "Chrome":
                    // chrome+TamperMonkey在这个脚本内报错的情况下会需要两次decode
                    scriptName = decodeURIComponent(decodeURIComponent(e.filename.match(/([^\/=]*)\.user\.js/)[1]));
                    lineno -= 534;
                    // errorType = e.message.match(/^Uncaught ([a-zA-Z]*): /)[1];
                    break;
                case "Firefox":
                    scriptName = decodeURIComponent(e.error.stack.match(/\/([^\/]*)\.user\.js/)[1]).trim();
                    lineno -= 1;
                    // errorType = e.message.match(/^([a-zA-Z]*): /)[1];
                    break;
                default:
                    //return;
            }
            if (scriptName == "一起搬砖不辛苦插件") {
                let colno = e.colno;
                let errorMsg = e.error.message;
                let msgBody = `内核：${renderingEngine[0]}<br/>版本：${GM_info.script.version}<br/>区域：${helper_config.steamCurrency} ${steamConnection ? 200 : steamConnection == undefined ? "Unknow" : 404}<br/>位置：${lineno}:${colno}<br/>信息：${errorMsg}<br/>路径：${location.pathname}<br/>哈希：${location.hash}`;
                let msgHtml = `恭喜！你可能发现了一个bug<hr/>${msgBody}<hr/>点击下面的链接可以直接进行反馈<br/><a href='mailto:chinap@88.com?subject=【${GM_info.script.version}】${lineno}:${colno} ${errorMsg}&body=${encodeURIComponent(msgBody.replaceAll("<br/>", "\r\n"))}'>邮件反馈</a><hr/>这种错误绝大部分是网络问题<hr/>请先自查一下使用的节点情况`;
                showMessage("出现了意料之外的错误", msgHtml, "error", false);
            } else {
                console.log(`插件名称：${scriptName}\n代码位置：${e.lineno}:${e.colno}\n错误信息：${e.message}`);
            }
        } catch {
            console.warn("unhandled 捕获了一个错误：", e);
        }
    }

})();