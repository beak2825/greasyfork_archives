// ==UserScript==
// @name         显示github编辑按钮按钮
// @icon         https://github.com/favicons/favicon-codespaces.svg
// @namespace    https://github.com/gclm
// @version      1.0.2
// @description  在 Github 网站顶部分别显示 github1s.com 和github.dev按钮，支持项目进行在线编辑
// @author       gclm
// @match        https://github.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.slim.min.js
// @license.     
// @downloadURL https://update.greasyfork.org/scripts/438859/%E6%98%BE%E7%A4%BAgithub%E7%BC%96%E8%BE%91%E6%8C%89%E9%92%AE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/438859/%E6%98%BE%E7%A4%BAgithub%E7%BC%96%E8%BE%91%E6%8C%89%E9%92%AE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    createButton();
    $(document).on("pjax:end", ()=>{
        createButton();
    });
})();
 
/**
 * 创建 Github.dev 按钮
 */
function createButton() {
    const github1sButton = document.querySelector("#github1sButton");
    const githubDevButton = document.querySelector("#githubDevButton");
 
    if (github1sButton !== null || githubDevButton != null) {
        return;
    }
    
    const githubd1sUrl = `https://github1s.com${location.pathname}`;
    const githubdevUrl = `https://github.dev${location.pathname}`;
  
    const githubd1sElement = '<li id="github1sButton"> <a target="_blank" class="btn btn-sm" href="' + githubd1sUrl + '"> <img class="icon octicon octicon-heart text-pink" src="https://github.com/favicons/favicon-codespaces.svg" /> Github1s </a> </li>';
    const githubdevElement = '<li id="githubDevButton"> <a target="_blank" class="btn btn-sm" href="' + githubdevUrl + '"> <img class="icon octicon octicon-heart text-pink" src="https://github.com/favicons/favicon-codespaces.svg" /> GithubDev </a> </li>';
  
    const node = document.querySelector('.pagehead-actions.flex-shrink-0.d-none.d-md-inline');
    if(node !== null){
        node.insertAdjacentHTML('afterBegin', githubd1sElement);
        node.insertAdjacentHTML('afterBegin', githubdevElement);
    }
}