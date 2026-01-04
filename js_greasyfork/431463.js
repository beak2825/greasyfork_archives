// ==UserScript==
// @name         显示 Github.dev 按钮
// @icon         https://github.com/favicons/favicon-codespaces.svg
// @namespace    https://github.com/akkuman
// @version      1.0.0
// @description  在 Github 网站顶部显示 Github.dev 按钮，Github.dev 是一个利用 VsCode Online 浏览代码的项目
// @author       Akkuman
// @match        https://github.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.slim.min.js
// @reference    https://greasyfork.org/zh-CN/scripts/421631-%E6%98%BE%E7%A4%BA-github1s-%E6%8C%89%E9%92%AE
// @downloadURL https://update.greasyfork.org/scripts/431463/%E6%98%BE%E7%A4%BA%20Githubdev%20%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/431463/%E6%98%BE%E7%A4%BA%20Githubdev%20%E6%8C%89%E9%92%AE.meta.js
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
    const preSelectorButton = document
        .querySelector("#githubdevButton");

    if (preSelectorButton !== null) {
        return;
    }

    const githubdevUrl = `https://Github.dev${location.pathname}`;
    const element = '<li id="githubdevButton"> <a target="_blank" class="btn btn-sm" href="' + githubdevUrl + '"> <img class="icon octicon octicon-heart text-pink" src="https://github.com/favicons/favicon-codespaces.svg" /> Github.dev </a> </li>';
    const node = document.querySelector('.pagehead-actions.flex-shrink-0.d-none.d-md-inline');
    if(node !== null){
        node.insertAdjacentHTML('afterBegin', element);
    }
}