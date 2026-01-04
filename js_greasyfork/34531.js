// ==UserScript==
// @name         New Style
// @namespace    https://www.waze.com/*
// @version      1.5
// @description  new style for new Waze
// @author       sultan alrefaei
// @match        https://www.waze.com/editor/
// @match        https://www.waze.com/ar/editor/
// @match        https://www.waze.com/editor
// @match        https://www.waze.com/ar/editor
// @match        https://www.waze.com/editor/*
// @match        https://www.waze.com/ar/editor/*
// @match        https://www.waze.com/editor/*
// @match        https://www.waze.com/*
// @grant        none
// @copyright    2017 sultan alrefaei
// @downloadURL https://update.greasyfork.org/scripts/34531/New%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/34531/New%20Style.meta.js
// ==/UserScript==
addStyle();
window.onload = function(){
    setInterval(function(){
        var URL = window.location.href;
        if (URL.includes("editor")){
            var tit = document.getElementsByClassName("menu-title");
            for (i = 0; i < tit.length; i++){
                if (tit[i].innerText.includes("save") || tit[i].innerText.includes("حفظ")){
                    tit[i].style.color = "#09267b";
                }  
            }
        }
        if (document.getElementById("fasenas") != null){
            document.getElementById("fasenas").onmouseover = function(){
                sil[i].style.border = "2px solid #989494";
                sil[i].style.borderRadius = "5px;";
                sil[i].style.cursor = "pointer";
            }
        }
    },50);
    
}

function addStyle(){
    var style = document.createElement("link");
    style.href = "https://www.dropbox.com/s/gaii1r6m5602uqs/mynewstyle.css?raw=1";
    style.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(style);
}