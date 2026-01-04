// ==UserScript==
// @name         ArXiv paper homepage tranverse
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Generate a button to transverse between ArXiv homepage and pdf
// @author       HuanZhi
// @match        https://arxiv.org/pdf/*
// @match        https://arxiv.org/abs/*
// @match        https://arxiv.org/html/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541096/ArXiv%20paper%20homepage%20tranverse.user.js
// @updateURL https://update.greasyfork.org/scripts/541096/ArXiv%20paper%20homepage%20tranverse.meta.js
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
    if(url.includes("pdf")){
        btn.innerText = "arxiv";
        btn.onclick=arxiv;

    }
    if(url.includes("abs")){
        btn.innerText = "pdf";
        btn.onclick=pdf;
    }
    if(url.includes("html")){
    btn.innerText = "arxiv";
    btn.onclick=arxiv;
    }
    
//    btn.innerText = url.slice(-3)
}
)()


function arxiv(){
    if (window.location.href.includes("pdf")){
        var home_url = window.location.href.replace('pdf', 'abs');
    }
    if (window.location.href.includes("html")){
    var home_url = window.location.href.replace('html', 'abs');
    }
    
    window.open(home_url);
}

function pdf(){
    var home_url = window.location.href.replace('abs', 'pdf');
    window.open(home_url);
}
