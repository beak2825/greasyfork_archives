// ==UserScript==
// @name         Github mirror homepage tranverse
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  在Github官网和镜像网站进行转换 Generate a button to trans between GitHub homepage and mirror
// @author       HuanZhi
// @match        https://github.com/*
// @match        https://hub.fgit.cf/*
// @match        https://huggingface.co/*
// @match        https://hf-mirror.com/*
// @grant        unsafewindow
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/485497/Github%20mirror%20homepage%20tranverse.user.js
// @updateURL https://update.greasyfork.org/scripts/485497/Github%20mirror%20homepage%20tranverse.meta.js
// ==/UserScript==
(function(){
    var btn = document.createElement("button");
    btn.setAttribute('style', "position:absolute; z-index:1000; right:15px; top:55px; height:28px; background-color:#3E8CD0; border:none; color:white; font-size:16px; cursor:pointer; border-radius:1em;");
    btn.setAttribute('id', "btn");
    document.body.appendChild(btn);
    btn.onmouseover = function() {
        this.style.backgroundColor="#e9686b"
    };
    btn.onmouseout = function() {
        this.style.backgroundColor="#3E8CD0"
    };
    
    var url = window.location.href;
    if (url.includes("github")) {
        btn.innerText = "当前原始网站";
        btn.onclick=JumpToGitMirror;
    } else if (url.includes("hub.fgit.cf")) {
        btn.innerText = "当前镜像网站,别登录账号";
        btn.onclick=JumpToGitOrigin;
    } else if (url.includes("huggingface")) {
        btn.innerText = "当前原始网站";
        btn.onclick=JumpToHugMirror;
    } else if (url.includes("hf-mirror")) {
        btn.innerText = "当前镜像网站,别登录账号";
        btn.onclick=JumpToHugOrigin;
    }
}
)()

function JumpToGitMirror(){
    var home_url = window.location.href.replace('https://github.com', 'https://hub.fgit.cf');
    window.open(home_url);
}

function JumpToGitOrigin(){
    var home_url = window.location.href.replace('https://hub.fgit.cf', 'https://github.com');
    window.open(home_url);
}

function JumpToHugMirror(){
    var home_url = window.location.href.replace('https://huggingface.co', 'https://hf-mirror.com');
    window.open(home_url);
}

function JumpToHugOrigin(){
    var home_url = window.location.href.replace('https://hf-mirror.com', 'https://huggingface.co');
    window.open(home_url);
}