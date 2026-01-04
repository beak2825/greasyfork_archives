// ==UserScript==
// @namespace    zhcn-link-of-pydocs.deuterium.wiki
// @name         python docs 简中切换
// @version      0.1.1
// @author       Deuterium.wiki
// @match        https://docs.python.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=python.org
// @grant        none
// @license BSD
// @description:zh-cn python docs 简体中文切换
// @description  python docs zh-cn切换
// @downloadURL https://update.greasyfork.org/scripts/520866/python%20docs%20%E7%AE%80%E4%B8%AD%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/520866/python%20docs%20%E7%AE%80%E4%B8%AD%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('running pydocs zh-cn link')
    const match = /https?:\/\/docs\.python\.org\/([a-z\-]+\/)?3\.?\d*\/library.+/
    let url = window.location.href
    const matchResult = url.match(match);
    if (!matchResult) return
    if (matchResult[1]==='zh-cn/')return;

    if (matchResult[1]) {
        url = url.replace(matchResult[1], 'zh-cn/') }
    else{
        url = url.replace('.org/', '.org/zh-cn/')
    }

    const button = document.createElement('button');
    button.textContent = '跳转到中文';
    button.id = 'fixedButton';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
    button.onclick = () => {window.location.href=url};
    document.body.appendChild(button);
})();