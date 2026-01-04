// ==UserScript==
// @name         SVG Download
// @namespace    http://tampermonkey.net/
// @description  给字统提供下载 SVG 按钮
// @author       Basic 低手
// @license      MIT
// @version      3.1
// @match        https://zi.tools/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zi.tools
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488703/SVG%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/488703/SVG%20Download.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
waitForElm('.links').then((Links) => {
    var c=document.title.split(":")[0];
    var s="⿰⿲⿱⿳⿸⿺⿹⿽⿵⿷⿶⿼⿴⿻⿾⿿㇯";
    console.log(s.indexOf(c[0]));
    if(s.indexOf(c[0])>=0){
        var pcOnly=document.getElementsByClassName("pc-only")[0];
        var SVG=pcOnly.getElementsByTagName("svg")[0].cloneNode(true);
        SVG.style="";
        SVG.setAttribute("width", "200");
        SVG.setAttribute("height", "200");
        SVG.setAttribute("viewBox", "");
        var dash=SVG.children[0];
        SVG.removeChild(dash);
        var btnDown=document.createElement("button");
        btnDown.innerText="下载 SVG 文件";
        btnDown.onclick=function(){
            // 定义触发事件的DOM
            var text=SVG.outerHTML;
            var filename=pcOnly.innerText.replace(":","：")+".svg";
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }

        Links.appendChild(btnDown);
    }
//}
//},false);
});

