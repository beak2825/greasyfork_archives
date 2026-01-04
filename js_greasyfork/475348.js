// ==UserScript==
// @name         goedge copy domains
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description get domains
// @author       sron
// @match        http://*/servers
// @match        http://*/servers/groups/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=129.169
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475348/goedge%20copy%20domains.user.js
// @updateURL https://update.greasyfork.org/scripts/475348/goedge%20copy%20domains.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelectorAll(".icon.expand.small")
        .forEach((e) => {e.addEventListener("click", click);})
})();

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function click()
{
    console.log("func: click")

    //delay(1000).then(() => console.log('ran after 1 second1 passed'));
    delay(1000).then(()=>getifram());
}

function getifram(){
    console.log("func: getifram")
    //debugger;

    let iframe = document.querySelector("iframe");

    if(iframe==null){
        delay(500).then(()=>getifram());
    }

    console.log(iframe)
    console.dir(iframe)
    delay(1000).then(()=>iframeLoad(iframe));
}

function iframeLoad(iframe){
    console.log("func: iframeLoad")
    let h3 = iframe.contentDocument.querySelector("h3");
    if(h3.outerText === "查看域名")
    {
        h3.textContent = '查看域名 點擊複製';
        h3.addEventListener("click", clickCpoy);
    }
}

function clickCpoy(e){
    console.log("func: clickCpoy")
    console.log(e);
    console.log(e);
    //debugger;
    let list =[];
    //document.querySelectorAll(".ui.label").forEach((s) => {console.log(s.outerText)})
    let ttt = e.view.document.querySelectorAll(".ui.label")
    .forEach((s) => {list.push(s.outerText)})

    //console.log(list.join("\n"));

    //debugger;
    //console.log(navigator.clipboard);
    //navigator.clipboard.writeText(list.join("\n"));
    GM_setClipboard (list.join("\n"));
    alert("Copied");
}