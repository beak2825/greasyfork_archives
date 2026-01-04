// ==UserScript==
// @name        CVPR paper homepage tranverse
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在cvpr的pdf和abstract反复横跳 Generate a button to trans between cvpr homepage and pdf
// @author       gusongen
// @match        https://openaccess.thecvf.com/content/*/html/*
// @match       https://openaccess.thecvf.com/content/*/papers/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459121/CVPR%20paper%20homepage%20tranverse.user.js
// @updateURL https://update.greasyfork.org/scripts/459121/CVPR%20paper%20homepage%20tranverse.meta.js
// ==/UserScript==
(function(){
    // download by clicking on the button
    var btn = document.createElement("button");
    btn.setAttribute('style', "position:absolute;z-index:1000; right: 50px; top: 50px; height: 28px; background-color: #424649; border: none; color: white; font-size: 16px; cursor: pointer;");
    btn.setAttribute('id', "btn");
    document.body.appendChild(btn);
    btn.onmouseover = function() {
        this.style.backgroundColor="#424649"
    };
    btn.onmouseout = function() {
        this.style.backgroundColor="#323639"
    };
    var url = window.location.href
    if(url.slice(-3) == "pdf"){
        btn.innerText = "cvpr";
        btn.onclick=cvpr;

    }else{
        btn.innerText = "pdf";
        btn.onclick=pdf;
    }
//    btn.innerText = url.slice(-3)
}
)()


function cvpr(){
    var home_url = window.location.href.slice(0, -4).replace('papers', 'html');
    window.open(home_url);
}

function pdf(){
    var home_url = window.location.href.replace('.html', '').replace('html', 'papers') + ".pdf";
    window.open(home_url);
}
