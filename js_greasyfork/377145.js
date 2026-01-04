// ==UserScript==
// @name         番组计划主页观看进度中文标题
// @namespace    https://github.com/machsix
// @version      1.1
// @description  Bangumi番组计划 主页观看进度 中文标题
// @author       machsix
// @icon         http://bgm.tv/img/favicon.ico
// @include      *://bgm.tv/
// @include      *://bangumi.tv/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/377145/%E7%95%AA%E7%BB%84%E8%AE%A1%E5%88%92%E4%B8%BB%E9%A1%B5%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6%E4%B8%AD%E6%96%87%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/377145/%E7%95%AA%E7%BB%84%E8%AE%A1%E5%88%92%E4%B8%BB%E9%A1%B5%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6%E4%B8%AD%E6%96%87%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

const epGrids = document.querySelectorAll('.infoWrapper_tv .epGird');
epGrids.forEach((item) => {
    const node = item.children[0].children[1];
    const a = node.getAttribute('data-subject-name-cn');
    if (a) node.innerText = a;
});

const grid2 = document.querySelectorAll('#prgSubjectList .clearit');
grid2.forEach((item) => {
    const rootNode = item.getElementsByClassName('title')[0];
    const titleNode = rootNode.getElementsByTagName('span')[0];
    const cnTitle = rootNode.getAttribute('data-subject-name-cn');
    if (cnTitle) titleNode.innerText = cnTitle;
});