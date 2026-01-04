// ==UserScript==
// @name         阴阳师鉴宝屋油猴脚本
// @namespace    https://github.com/JellyL/jbwGreasyfork
// @icon         https://yys.jellyl.com/img/wu.8dccb370.svg
// @version      2.1
// @description  在阴阳师藏宝阁页面左侧自动显示鉴宝屋结果页
// @author       Jelly L
// @match        https://yys.cbg.163.com/*
// @match        https://yys-xiaomi.cbg.163.com/*
// @match        https://yys-huawei.cbg.163.com/*
// @match        https://yys-oppo.cbg.163.com/*
// @exclude      https://yys.cbg.163.com/cgi/mweb/yuhun-collocation*
// @grant        window.onurlchange
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/417052/%E9%98%B4%E9%98%B3%E5%B8%88%E9%89%B4%E5%AE%9D%E5%B1%8B%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/417052/%E9%98%B4%E9%98%B3%E5%B8%88%E9%89%B4%E5%AE%9D%E5%B1%8B%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

//全局藏宝阁宽度变量，如果你想藏宝阁宽度更窄，只需要更改以下变量值即可
//maxWidth取值范围为0~750，越小界面宽度越小
//zoomSize取值范围为0~1，越小界面整体缩放越小
var maxWidth = 550;
var zoomSize = 1;

//变小藏宝阁最大宽度
var cssCompile = `
       body{max-width: ${maxWidth}px;}
      .page-app{zoom:${zoomSize};}
      .site-navbar-fixed{max-width: ${maxWidth}px !important;}
      .site-footbar{max-width: ${maxWidth}px;}
      .page-prod-role-list .role-list-tabs{max-width: ${maxWidth}px;}
      .page-role-detail .preview{max-width: ${maxWidth}px;}
      .c-popup{max-width: ${maxWidth}px;}
      .page-tabs .tabs{max-width: 500px;}
      .page-search .search-header{max-width: ${maxWidth}px;}
      .c-popup-open{max-width: ${maxWidth}px;}
      .index-popup-ad{max-width: ${maxWidth}px;}
      .role-list-tabs{max-width: ${maxWidth}px !important;}
      .footer{max-width: ${maxWidth}px !important;}
      .activity-filter{max-width: ${maxWidth}px !important;}
      .tabs{max-width: ${maxWidth}px !important;}
      .root_YcRdK{max-width: ${maxWidth}px !important;}
      .noListFilter{max-width: ${maxWidth}px !important;}
     `;
GM_addStyle(cssCompile);
//初始化变量
var pageHeight = window.innerHeight;
var pageWidth = (window.innerWidth - maxWidth - 30) / 2;
var pagePath = location.pathname;
//初始化iframe
var pageFrame = document.createElement("iframe");
pageFrame.setAttribute("id", "yysjbw-iframe-tag");
pageFrame.src = "https://yys.jellyl.com" + pagePath;
pageFrame.frameBorder = 0;
pageFrame.width = pageWidth + "px";
pageFrame.height = pageHeight + "px";
//初始化div容器
var containerDiv = document.createElement("div");
containerDiv.setAttribute("style", "position:fixed;top:0%;right:0%;");
//载入iframe
document.body.appendChild(containerDiv);
containerDiv.appendChild(pageFrame);

//更换页面时同步更新
var initial = function () {
    "use strict";

    var pageFrameNew = document.createElement("iframe");
    pageFrameNew.setAttribute("id", "yysjbw-iframe-tag");
    var pagePathNew = location.pathname;
    pageFrameNew.src = "https://yys.jellyl.com" + pagePathNew;
    pageFrameNew.frameBorder = 0;
    pageFrameNew.width = pageWidth + "px";
    pageFrameNew.height = pageHeight + "px";
    var theFrame = document.getElementById("yysjbw-iframe-tag");
    containerDiv.replaceChild(pageFrameNew, theFrame);
};

//根据浏览器大小变化响应

function resizing() {
    var iframeObj = containerDiv.childNodes;
    iframeObj[0].setAttribute(
        "style",
        `width:${(window.innerWidth - maxWidth - 30) / 2}px;height:${window.innerHeight
        }px`
    );
}

window.onresize = function () {
    resizing();
};
//劫持
(function (open) {

    let _open = XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", function () {
            if (this.responseURL.startsWith("https://yys.cbg.163.com/cgi/api/get_equip_detail")) {

                const prefab = JSON.parse(JSON.parse(this.response).equip.equip_desc).prefab_team;


                // 如果你的脚本需要添加此阵容名，请添加id为no-jbw-team-name的任一元素，以防止UI冲突
                !document.getElementById('no-jbw-team-name') && !window.NoJbwTeamName && setInterval(function () {
                    if (!document.URL.startsWith("https://yys.cbg.163.com/cgi/mweb/equip")) {
                        return;
                    }
                    if (document.getElementsByClassName('content-team').length && !document.getElementsByClassName('jbw_name').length) {
                        const dom = document.getElementsByClassName('team-module')
                        for (let i = 0; i < dom.length; i += 1) {
                            var name = document.createElement("a");
                            name.setAttribute("style", "position:absolute;transform: translateX(40px);color: black;");
                            name.setAttribute("class", "jbw_name");
                            name.innerText = prefab[i].name

                            dom[i].parentNode.insertBefore(name, dom[i])
                        }
                    }
                }, 500);
            }
        }, false);
        open.apply(this, arguments);
    };
})(window.XMLHttpRequest.prototype.open);

//劫持结束


//油猴单页应用onurlchange检测
if (window.onurlchange === null) {
    window.addEventListener("urlchange", (info) => {
        initial();
        resizing();
    });
}
