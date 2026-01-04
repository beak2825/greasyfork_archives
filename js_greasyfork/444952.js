// ==UserScript==
// @name         Copy Result
// @description  copy result to clipboad
// @version      0.2
// @author       harurun
// @match        https://wandbox.org/*
// @grant        none
// @license MIT
// @namespace Wandbox
// @downloadURL https://update.greasyfork.org/scripts/444952/Copy%20Result.user.js
// @updateURL https://update.greasyfork.org/scripts/444952/Copy%20Result.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function copy(){
        let target=document.getElementsByClassName("wb-result-stdout")[0];
        if(navigator.clipboard){
            try{
                navigator.clipboard.writeText(target.textContent);
            }catch(e){
                console.log(e);
                alert("stdout is empty.");
            }
        }else{
            console.log("navigator is not exist.");
        }
    }
    // https://greasyfork.org/ja/scripts/434033-atcoder-title-copy/code ここから拝借してきました
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function notifyCopied(a) {
        a=this.name;
        a.textContent = "Copied!";
        await sleep(1500);
        a.textContent = "Copy";
    };
    async function create_btn(){
        await sleep(1500);
        let pars=document.getElementsByClassName("btn btn-primary");
        //console.log(pars,pars.length);
        let par=pars[pars.length-1].parentElement;
        let a=document.createElement("a");
        a.textContent="Copy";
        a.setAttribute("class","btn btn-primary");
        par.appendChild(a);
        a.addEventListener('click',copy,false);
        a.addEventListener('click',{name:a,handleEvent:notifyCopied});
    }
    create_btn();
})();