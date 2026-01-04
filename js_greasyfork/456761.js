// ==UserScript==
// @name         一键教评
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键教评1.0
// @author       bin
// @match     https://jw2.gdcvi.edu.cn/*
// @icon        https://jw2.gdcvi.edu.cn/*
// @grant        none
// @license       bin
// @foo
// @downloadURL https://update.greasyfork.org/scripts/456761/%E4%B8%80%E9%94%AE%E6%95%99%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/456761/%E4%B8%80%E9%94%AE%E6%95%99%E8%AF%84.meta.js
// ==/UserScript==

(function() {
  
    'use strict';
    // Your code here...
    let triple=document.createElement("button");
triple.innerText="一键教评";
triple.style.background="#757575";//颜色弄得差不多吧
triple.style.color="#fff";
triple.onclick=function (){
    for (var i=0;i<=9;i++){
            var element = document.querySelector('#DataGrid1_JS1_'+i);
            element.value="很满意"
            var Btn = document.querySelector('#Button1');
            Btn.click()
        }
}
    let share=document.querySelector('.search-btn');
    share.parentElement.insertBefore(triple,share);

})();