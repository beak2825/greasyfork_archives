// ==UserScript==
// @name         Speedtest测速网解锁节点&美化
// @namespace    speedtest.taozhiyu.github.io
// @version      0.4
// @description  测速网解锁部分app节点
// @author       涛之雨
// @match        https://www.speedtest.cn/*
// @icon         https://www.speedtest.cn/images/ico/favicon.ico
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448405/Speedtest%E6%B5%8B%E9%80%9F%E7%BD%91%E8%A7%A3%E9%94%81%E8%8A%82%E7%82%B9%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/448405/Speedtest%E6%B5%8B%E9%80%9F%E7%BD%91%E8%A7%A3%E9%94%81%E8%8A%82%E7%82%B9%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

!function() {
    "use strict";
    GM_addStyle(`#speedUpNotice,
.speed-top-ads,
.sus-window,
.index-advertising,
.speed-bottom-ads,
.wg,
.topDownload,
.speed-twoads-wrap,
#navbarSupportedContent,
.app-download-wrap,
.result-history > div:nth-child(1),
.advertising-upCaption,
.speedtest-recommend,
.shade,
.copyWriter {
    display:
    none!important;
}
.shareresultbox{
    padding-bottom: 44px;
}
.node-item {
    width: 100%!important;
}
.node-item >p{
    display:none
}
.node-item ul{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
}
.node-item ul li{
    white-space: nowrap;
}
.node-item ul li p:first-of-type {
    width: 200px!important;
}
.right-ads {
    display:none
}
.left-list {
    width:100%!important
}
.dialog-container-change{
    max-width: 600px!important;
    min-height:unset!important;
}`);
    const i=setInterval(()=>{
        if(!unsafeWindow.$)return;
        unsafeWindow.$.ajax_ = unsafeWindow.$.ajax_ || unsafeWindow.$.ajax;
        unsafeWindow.$.ajax = function(n) {
            if ("object" != typeof n || !n.url.includes(unsafeWindow.nodes_url)) return unsafeWindow.$.ajax_(n);
            const s = n.success;
            n.success = a=>{a.data.map(c => (c.cros = 1, c)); s(a)};
            if(n.url.includes("&page=1")){
                n.success=x=>{
                    n.url=n.url.replace(/page=(\d+)/,(a,b)=>a.replace(b,Number(b)+1));
                    n.success=a=>{
                        a.data=[...x.data,...a.data].map(c => (c.cros = 1, c)); s(a)};
                    unsafeWindow.$.ajax_(n);
                };
                return unsafeWindow.$.ajax_(n);
            }if(n.url.includes("&q=")){
                n.url=n.url.replace(/page=(\d+)/,(a,b)=>a.replace(b,Number(b)+1));
            }
            return unsafeWindow.$.ajax_(n);
        };
    },1000);
    setTimeout(()=>clearInterval(i),5000);
}();
