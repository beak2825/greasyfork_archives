// ==UserScript==
// @name         Github mirror/cdn
// @namespace    dmsrs
// @version      1.0
// @description  在Github官网和镜像网站进行转换 
// @author       HuanZhi
// @match        https://github.com/*
// @grant        unsafewindow
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546242/Github%20mirrorcdn.user.js
// @updateURL https://update.greasyfork.org/scripts/546242/Github%20mirrorcdn.meta.js
// ==/UserScript==
(function(){
    function parseGitHubUrl(url) {
        if (typeof url !== 'string' || !url.trim()) return null;
        // 匹配 GitHub URL 的正则表达式
        const regex = /https?:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\/(?:tree|blob)\/([^\/]+)(?:\/(.*))?)?/;
        const match = url.match(regex);

        try {
            if (!match) return null;
        } catch (error) {
            console.error('Error parsing GitHub URL:', error);
            return null;
        }

        const repo = `${match[1]}/${match[2]}`;
        const branch = match[3] || (url.includes('github.com') ? 'main' : null);
        const file = match[4] || '';

        return { repo, branch, file };
    }

    var btn = document.createElement("button");
    btn.setAttribute('style', "position:absolute; z-index:1000; right:15px; top:55px; height:28px; background-color:#3E8CD0; border:none; color:white; font-size:16px; cursor:pointer; border-radius:1em;");
    btn.setAttribute('id', "btn");
    document.body.appendChild(btn);

    const URL_PREFIX = 'https://cdn.jsdelivr.net/gh'
    btn.onmouseover = function() {
        this.style.backgroundColor="#e9686b"
    };
    btn.onmouseout = function() {
        this.style.backgroundColor="#3E8CD0"
    };

    var url = window.location.href;
    if (url.includes("github")) {
        let { repo, branch, file }=parseGitHubUrl(window.location.href)
        let newUrl =`${URL_PREFIX}/${repo}@${branch}/${file}`;
        btn.innerText = "Goto jsdelivr";
        btn.title =newUrl
        btn.onclick=gotoJsdelivr
    } else if (url.includes("jsdelivr")) {
        btn.innerText = "当前镜像网站,别登录账号";
        btn.onclick=JumpToGitOrigin;
    }
    function gotoJsdelivr(){
        console.log(this.title)
        window.open(this.title)
    }
    function JumpToGitOrigin(){
        alert('Not Support,欢迎提交PR')
    }

}
)()
