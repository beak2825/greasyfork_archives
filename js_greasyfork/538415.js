// ==UserScript==
// @name         东南大学医学院PBL一键满分
// @namespace    http://tampermonkey.net/
// @version      2025-06-05
// @description  满昏！
// @author       You
// @match        http://10.194.0.6/Evaluate/EditCourseEvaluate*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538415/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E5%8C%BB%E5%AD%A6%E9%99%A2PBL%E4%B8%80%E9%94%AE%E6%BB%A1%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/538415/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E5%8C%BB%E5%AD%A6%E9%99%A2PBL%E4%B8%80%E9%94%AE%E6%BB%A1%E5%88%86.meta.js
// ==/UserScript==

const b = document.createElement('button');
b.textContent='一键满分';
b.addEventListener('click', () => {
    document.querySelectorAll('a[title="10"]').forEach(a => a.click());
    document.querySelector('textarea').value = "好";
    document.querySelectorAll('.btn-primary')[1].click();
});
document.querySelector('h3').append(b);