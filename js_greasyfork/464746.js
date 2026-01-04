// ==UserScript==
// @name         添加个性化按钮
// @namespace    TechXueXi
// @version      1.2
// @description  在百度页面添加一个个性化按钮
// @author       huang
// @match        https://www.baidu.com/*
// @grant        GM_addStyle
// @license  none
// @downloadURL https://update.greasyfork.org/scripts/464746/%E6%B7%BB%E5%8A%A0%E4%B8%AA%E6%80%A7%E5%8C%96%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/464746/%E6%B7%BB%E5%8A%A0%E4%B8%AA%E6%80%A7%E5%8C%96%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var study_css = ".egg_study_btn{	outline:0;	position:fixed;	padding:10px 20px;	border-radius:10px;	cursor:pointer;	background-color:#fff;color:#d90609;	font-size:18px;	font-weight:bold;	text-align:center;	box-shadow:0 0 9px #666777	}"
    GM_addStyle(study_css);
setBut1();
//setBut2();

//按键1
    function setBut1(){
        const button = document.createElement("button");
        button.innerHTML = "个性化按钮";
        // Add styles to the button
        /*
        button.style.borderRadius = "10px";
        button.style.padding = "10px";
        button.style.backgroundColor = "#4CAF50";
        button.style.color = "black";
        button.style.border = "2px solid #fffff";*/
        button.className = "egg_study_btn";
button.onclick = function(){
    confirm('俺是一个个性化按钮');
    return;
};

        const baiduContainer = document.querySelector("#s-top-left");
        baiduContainer.insertBefore(button, baiduContainer.endChild);
    }
//按键2
    function setBut2(){
        let button = document.createElement("button");
        button.innerText = "个性化按钮2";
        button.style.padding = "8px 12px";
        button.style.backgroundColor = "#000";
        button.style.color = "#fff";
        button.style.borderRadius = "4px";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.position = "absolute";
        button.style.top = "50px";
        button.style.right = "50px";
        button.className = "egg_study_btn egg_menu2";
        //document.body.appendChild(button);
        document.body.insertBefore(button, document.body.firstElementChild);
    }
})();
