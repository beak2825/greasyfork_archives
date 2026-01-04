// ==UserScript==
// @name         csdn 复制功能
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  csdn 免登录复制
// @author      smartpro
// @match      *://*.csdn.net/*
// @grant        GM_addStyle
// @license      MIT License
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/466839/csdn%20%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/466839/csdn%20%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
(function () {
const btn = document.createElement('button');
btn.innerText = '选中复制'
btn.id = 'fkcsdn'
GM_addStyle(`
#fkcsdn {
    position: fixed;
    top: 80px;
    left: 40px;
    display: inline-block;
    border: none;
    padding: 1rem 2rem;
    text-decoration: none;
    background: #0069ed;
    color: #ffffff;
    font-family: sans-serif;
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
    transition: all 0.3s ease,
    transform 0.3s ease;
    border-radius: 8px;
}

#fkcsdn:hover,
#fkcsdn:focus {
    background: #0053ba;
}        
`);
document.body.appendChild(btn);
btn.addEventListener('click', () => {
    console.log(window.getSelection().toString());
    navigator.clipboard.writeText(window.getSelection().toString());
});
})();