// ==UserScript==
// @name        yande.re清爽浏览
// @namespace   蒋晓楠
// @version     20240503
// @description 去除列表和详情页面与浏览无关的元素
// @author      蒋晓楠
// @license     MIT
// @match       https://yande.re/post?*
// @match       https://yande.re/post/show/*
// @icon        https://yande.re/favicon.ico
// @grant       GM_addStyle
// @grant       GM_addElement
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/478923/yandere%E6%B8%85%E7%88%BD%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/478923/yandere%E6%B8%85%E7%88%BD%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==
function InitPostCSS() {
    GM_addStyle('.sidebar,.directlink{display:none !important}#post-list .content{width:100%}#post-list-posts li,#post-list-posts li .inner{width:240px !important}#post-list-posts li{max-width:240px}#post-list-posts li .inner{height:240px !important}#post-list-posts img{width:235px;height:auto}');
}

function InitDetailCSS() {
    GM_addStyle('.content{width:100% !important;text-align:center}.JXNInfoHolder{display:flex;justify-content:space-evenly}');
    let InfoHolder = GM_addElement(document.body, "div", {class: "JXNInfoHolder"});
    document.querySelector("#right-col").prepend(InfoHolder);
    //显示上传时间
    let Time = new Date(document.querySelector("#stats li:nth-child(2) a").title);
    InfoHolder.append(GM_addElement(document.body, "span", {textContent: Time.getFullYear().toString() + "-" + (Time.getMonth() + 1).toString().padStart(2, "0") + "-" + Time.getDate().toString().padStart(2, "0")}));
    //移动来源
    let SourceBlock = document.querySelector("#stats li:nth-child(4)");
    if (SourceBlock.textContent.indexOf(GM_getValue("SourceTagWord","来源")) > -1) {
        let Link = SourceBlock.querySelector("a");
        if (Link === null) {
            InfoHolder.append(GM_addElement(document.body, "span", {textContent: SourceBlock.textContent.replace("Source: ", "")}));
        } else {
            InfoHolder.append(Link);
        }
    }
    //移动下载链接
    InfoHolder.append(document.querySelector("#highres"));
    let PngDownload = document.querySelector("#png");
    if (PngDownload !== null) {
        InfoHolder.append(PngDownload);
    }
    //移除左侧
    document.querySelector(".sidebar").remove();
    //移除一个换行
    document.querySelector(".JXNInfoHolder~br").remove();
}

function Run() {
    if (location.pathname === '/post') {
        InitPostCSS();
        GM_registerMenuCommand("来源标签检测文本",()=>{
            let Word=prompt("设置来源标签检测文本",GM_getValue("SourceTagWord","来源"));
            if(Word!==null){
                GM_setValue("SourceTagWord",Word);
            }
        });
    } else {
        InitDetailCSS();
    }
}

Run();