// ==UserScript==
// @name         Eink-NGAAuto
// @namespace    https://greasyfork.org/users/169007
// @version      1.0.6
// @description  Automatically click next button when page reaches bottom
// @author       ZZYSonny
// @match        https://bbs.nga.cn/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/434756/Eink-NGAAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/434756/Eink-NGAAuto.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let resolveError = () => setTimeout(()=>{
        const tipTitle = document.getElementsByClassName("tip_title")[0];
        if(tipTitle!=null) {
            const tipParent = tipTitle.parentElement;
            if(tipParent.children[1].children[0].textContent.includes("ERROR")){
                console.log("Error Occured");
                tipTitle.children[0].click();
            }
        }
    },3000);

    resolveError();

    var lastHeight = 0;
    document.addEventListener('scroll', function(event){
        const btn = document.querySelector('[title="加载下一页"]');
        if(btn!=null){
            const rect = btn.getBoundingClientRect();
            if (window.scrollY+rect.top>lastHeight && rect.top < window.innerHeight + 100){
                lastHeight=window.scrollY+rect.top;
                btn.click();
                resolveError();
                console.log("Scroll",lastHeight)
            }
        }
    });

})();