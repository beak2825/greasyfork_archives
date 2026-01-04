// ==UserScript==
// @name         美化文件目录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       fcz
// @match        http://chinanet.mirrors.ustc.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401266/%E7%BE%8E%E5%8C%96%E6%96%87%E4%BB%B6%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/401266/%E7%BE%8E%E5%8C%96%E6%96%87%E4%BB%B6%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addHomeBtn(){
        var body = document.getElementsByTagName('body')[0];
        if(document.getElementById('mainFrame')) return;

        var btn = document.createElement('div');
        btn.innerText = 'Home';
        btn.classList.add('btnhome');
        btn.onclick = function(e){
            var root = top.location.origin;
            // top.location.href + '//' + top.location.hostname + ':' + top.location.
            top.location.assign(root);
        }
        body.appendChild(btn);
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`
pre>a{
    display: inline-block;
    font-size: 1.2rem;
    padding: 8px;
    text-decoration: none;
    font-family: '微软雅黑';
    color: #5698c3;
    border-radius: 5px;
    transition: all 0.4s;
}
pre>a:hover{
    background-color: #e2e1e4;
    box-shadow:0px 15px 10px -15px #000;
}
div.btnhome{
    padding: 8px;
    cursor: pointer;
    background-color: #e2e1e4;
    border-radius: 5px;
    position: fixed;
    right: 8px;
    top: 8px;
    z-index: 1000;
}`);
    addHomeBtn()
})();