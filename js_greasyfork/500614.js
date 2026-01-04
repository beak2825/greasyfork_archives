// ==UserScript==
// @name         添加GitHub、huggingface镜像下载链接
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  添加GitHub、huggingface镜像下载链接，可直接在Linux服务器粘贴使用
// @author       HuanZhi
// @match        https://github.com/*
// @match        https://huggingface.co/*
// @match        https://hf-mirror.com/*
// @grant        unsafewindow
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/500614/%E6%B7%BB%E5%8A%A0GitHub%E3%80%81huggingface%E9%95%9C%E5%83%8F%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/500614/%E6%B7%BB%E5%8A%A0GitHub%E3%80%81huggingface%E9%95%9C%E5%83%8F%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function(){

    // 基本变量设置
    var url = window.location.href;
    var GitMirror = "https://ghfast.top/";
    
    // 添加按钮显示
    if (url.includes("github")) {
        AddDownloadButton();
        AddUrlButton();
        download_btn.innerText = "git clone";
        url_btn.innerText = "镜像链接";
        // 使用匿名函数来传递参数
        // 使用箭头函数来传递参数: button.onclick = () => myFunction('Hello, World!');

        download_btn.onclick = function() {
            GitCloneLink(GitMirror);
        };
        
        url_btn.onclick = function() {
            GitMirrorLink(GitMirror);
        };
        
    } else if (url.includes("huggingface")) {
        AddDownloadButton();
        download_btn.innerText = "下载命令";
        download_btn.onclick = HFMirrorLink;
    } else if (url.includes("hf-mirror")) {
        AddDownloadButton();
        download_btn.innerText = "下载命令";
        download_btn.onclick = HFMirrorLink;
    }  
    if (url.includes("huggingface")) {
        AddWebButton();
        web_btn.innerText = "打开镜像";
        web_btn.onclick = OpenHFMirror;
    }
}
)();

// 下载按钮
function AddDownloadButton(){
    var download_btn = document.createElement("button");
    download_btn.setAttribute('style', "position:absolute; z-index:1000; right:15px; top:55px; height:28px; background-color:#3E8CD0; border:none; color:white; font-size:16px; cursor:pointer; border-radius:1em;");
    download_btn.setAttribute('id', "download_btn");
    document.body.appendChild(download_btn);
    download_btn.onmouseover = function() {
        this.style.backgroundColor="#e9686b";
    };
    download_btn.onmouseout = function() {
        this.style.backgroundColor="#3E8CD0";
    };
}

// 镜像链接按钮
function AddUrlButton(){
    var url_btn = document.createElement("button");
    url_btn.setAttribute('style', "position:absolute; z-index:1000; right:15px; top:85px; height:28px; background-color:#3E8CD0; border:none; color:white; font-size:16px; cursor:pointer; border-radius:1em;");
    url_btn.setAttribute('id', "url_btn");
    document.body.appendChild(url_btn);
    url_btn.onmouseover = function() {
        this.style.backgroundColor="#e9686b";
    };
    url_btn.onmouseout = function() {
        this.style.backgroundColor="#3E8CD0";
    };
}

// 打开镜像网站按钮
function AddWebButton(){
    var web_btn = document.createElement("button");
    web_btn.setAttribute('style', "position:absolute; z-index:1000; left:15px; top:55px; height:28px; background-color:#3E8CD0; border:none; color:white; font-size:16px; cursor:pointer; border-radius:1em;");
    web_btn.setAttribute('id', "web_btn");
    document.body.appendChild(web_btn);
    web_btn.onmouseover = function() {
        this.style.backgroundColor="#e9686b";
    };
    web_btn.onmouseout = function() {
        this.style.backgroundColor="#3E8CD0";
    };
}


function GitCloneLink(GitMirror){
    var home_url = `git clone ${GitMirror}${document.querySelector('meta[name="go-import"]').getAttribute('content').split(' ').slice(-1)}`;
    navigator.clipboard.writeText(home_url);
    download_btn.innerText = "已复制";
}

function GitMirrorLink(GitMirror){
    var home_url = `${GitMirror}${document.querySelector('meta[name="go-import"]').getAttribute('content').split(' ').slice(-1)}`;
    navigator.clipboard.writeText(home_url);
    url_btn.innerText = "已复制";
}

function HFMirrorLink(){
    var path = document.querySelector('a.break-words.font-mono.font-semibold.hover\\:text-blue-600').getAttribute('href').split("/")
    if (path[1] == 'datasets') {
        var home_url = `huggingface-cli download --resume-download ${path.slice(-2).join('/')} --local-dir ${path.slice(-1)} --repo-type dataset`;
        }
    else {
    var home_url = `huggingface-cli download --resume-download ${path.slice(-2).join('/')} --local-dir ${path.slice(-1)}`;
    }
    navigator.clipboard.writeText(home_url);
    download_btn.innerText = "已复制";
}

function OpenHFMirror(){
    var home_url = window.location.href.replace('https://huggingface.co', 'https://hf-mirror.com');
    // window.open(home_url);
    window.location.href = home_url;
}