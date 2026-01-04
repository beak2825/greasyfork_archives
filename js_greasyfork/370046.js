// ==UserScript==
// @name         钉钉web版审批链接改正
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  修改钉钉web版消息中错误的审批链接,默认情况下钉钉在待办消息和个人聊天中给出的三种形式的审批链接是错误的，无法直接点击打开，需要到工作台中审批中找待审批列表，才能打开。此脚本自动检查并修正这些链接。
// @author       easyt
// @match        https://im.dingtalk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370046/%E9%92%89%E9%92%89web%E7%89%88%E5%AE%A1%E6%89%B9%E9%93%BE%E6%8E%A5%E6%94%B9%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/370046/%E9%92%89%E9%92%89web%E7%89%88%E5%AE%A1%E6%89%B9%E9%93%BE%E6%8E%A5%E6%94%B9%E6%AD%A3.meta.js
// ==/UserScript==

$(document).on("mouseover", 'div.msg-action.ng-binding' , function (event) {
    event.preventDefault(); //阻止默认动作
    event.stopPropagation(); // 阻止事件冒泡
    this.parentElement.href=this.parentElement.href.replace("%2Fmobile%2Fhomepage","%2Fpc%2Fquery%2Fpchomepage");
    //alert(this.parentElement.href);
});

$(document).on("mouseover", 'a.ng-binding' , function (event) {
    event.preventDefault(); //阻止默认动作
    event.stopPropagation(); // 阻止事件冒泡
    this.href=this.href.replace("%2Fmobile%2Fhomepage","%2Fpc%2Fquery%2Fpchomepage");
    //alert(this.href);
});

$(document).on("mouseover", 'div.markdown-content.ng-binding blockquote a' , function (event) {
    event.preventDefault(); //阻止默认动作
    event.stopPropagation(); // 阻止事件冒泡
    if(this.href.substr(0,4) == "http") {
        this.href= "dingtalk://dingtalkclient/action/openapp?redirect_url=" + encodeURIComponent(this.href.replace("/mobile/homepage","/pc/query/pchomepage")) + "&slide_panel_option=%7B%22width%22%3Anull%2C%22showAppPage%22%3Atrue%7D";
        //alert(this.href);
    }
});