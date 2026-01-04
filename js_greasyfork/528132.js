// ==UserScript==
// @name         悪殺会
// @namespace    http://tampermonkey.net/
// @homepage     https://www1.x-feeder.info/furagame/
// @version      0.1
// @description  悪殺会最強！
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528132/%E6%82%AA%E6%AE%BA%E4%BC%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/528132/%E6%82%AA%E6%AE%BA%E4%BC%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function findBtnReply(){
        const elms = document.getElementsByTagName("ytd-button-renderer"),ar=[];
        for(let i = 0; i < elms.length; i++){
            const thisElm = elms[i];
            if(thisElm.classList.contains("style-text")) ar.push(thisElm.firstChild);
        }
        return ar;
    }
    function inputAll(str){
        const elms = document.getElementsByClassName("yt-formatted-string");
        for(let i = 0; i < elms.length; i++){
            const thisElm = elms[i];
            if(thisElm.getAttribute("contenteditable") === "true") {
                thisElm.innerHTML = str;
            }
        }
    }
    function findBtnSubmit(){
        const elms = document.getElementsByTagName("ytd-button-renderer"),ar=[];
        for(let i = 0; i < elms.length; i++){
            const thisElm = elms[i];
            if(thisElm.getAttribute("id") === "submit-button") {
                ar.push(thisElm);
                thisElm.removeAttribute("disabled");
            }
        }
        return ar;
    }
    function setCSS(elm,parm){
        for(let k in parm) elm.style[k] = parm[k];
        return elm;
    }
    const h = document.createElement("div");
    document.body.append(h);
    setCSS(h,{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999999,
    });
    const addBtn = (alies, func) => {
        var btn = document.createElement("button");
        btn.innerText = alies;
        btn.addEventListener("click",func);
        h.append(btn);
        return btn;
    };
    var inputForm;
    function open(){
        inputForm = document.createElement("textarea");
        h.append(inputForm);
        addBtn("全てに返信",submit);
        btnOpen.remove();
    }
    var btnOpen = addBtn("悪殺会悪殺会悪殺会",open);
    function submit(){
        var str = inputForm.value;
        if(!str) return alert("まず返信する文を入力しろ論破");
        findBtnReply().forEach(v=>v.click());
        inputAll(str);
        findBtnSubmit().forEach(v=>v.click());

    }
})();