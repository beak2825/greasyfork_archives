// ==UserScript==
// @name              Hide Outlook ads
// @name:zh-CN        隐藏Outlook广告
// @namespace         https://greasyfork.org/zh-CN/users/42351
// @version           1.9
// @description       Hide embedded ads in Outlook
// @description:zh-CN 隐藏Outlook网页端的各种内嵌广告
// @icon64            https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @icon              https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @author            Antecer
// @include           http*://outlook.live.com/*
// @run-at            document-body
// @grant             none
// @compatible        chrome 测试通过
// @compatible        firefox 测试通过
// @compatible        opera 未测试
// @compatible        safari 未测试
// @downloadURL https://update.greasyfork.org/scripts/29965/Hide%20Outlook%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/29965/Hide%20Outlook%20ads.meta.js
// ==/UserScript==
// outlook标准版广告屏蔽规则
var cssNomal = [
    '._n_h{display: none !important;}', //隐藏右侧广告
    '#primaryContainer > div{right: 0px !important; bottom:0 !important;}', //消除上一条广告的占位
    '._n_15{display: none !important;}', //隐藏"升级到 Premium"按钮
    '._n_05{bottom: 40px !important;}', //消除上一条广告的占位
    'div[style*="height: 40px"][style*="bottom: 0px"]{display: none !important;}', //隐藏底部的推荐Edge广告
    'div[style*="top: 40px"] > div > div { bottom:0 !important;}', //消除上一条广告的占位
    '[role=listbox]>div>div>div>[style] {display: none !important;}', //隐藏收件箱>其他选项卡的内嵌广告
].join("\r\n");
// outlook测试版广告屏蔽规则
var cssBeta = [
    '#app>div>div:last-child>div>div:first-child>div:last-child {display: none !important;}', //隐藏右侧广告
    '[data-focuszone-id=FocusZone8]~div:not([role]) {display: none !important;}', //隐藏订阅outlook广告
    '._1i5KvAsU83Sr-2zY9weMMY {display: none !important;}', //隐藏收件箱>其他选项卡的内嵌广告
].join("\r\n");
// 创建CSS规则节点
function addStyle(css) {
    var node = document.createElement('style');
    node.type = 'text/css';
    node.id = 'blockAD';
    node.appendChild(document.createTextNode(css));
    document.querySelector('body').appendChild(node);
}
// 注入CSS规则节点
if(window.location.pathname.indexOf('mail') === 1){
    addStyle(cssBeta);
}
else if(window.location.pathname.indexOf('owa') === 1){
    addStyle(cssNomal);
}
else{
    window.location.hash = '缺少该页面的广告过滤规则！';
}