// ==UserScript==
// @name         arXiv paper homepage tranverse
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在arixv的pdf和abstract反复横跳 Generate a button to trans between arixv homepage and pdf
// @author       holo
// @match        https://arxiv.org/pdf/*
// @match        https://arxiv.org/abs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402879/arXiv%20paper%20homepage%20tranverse.user.js
// @updateURL https://update.greasyfork.org/scripts/402879/arXiv%20paper%20homepage%20tranverse.meta.js
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
        btn.innerText = "arivx";
        btn.onclick=arixv;

    }else{
        btn.innerText = "pdf";
        btn.onclick=pdf;
    }
//    btn.innerText = url.slice(-3)
}
)()


function arixv(){
    var home_url = window.location.href.slice(0, -4).replace('pdf', 'abs');
    window.open(home_url);
}

function pdf(){
    var home_url = window.location.href.replace('abs', 'pdf') + ".pdf";
    window.open(home_url);
}
