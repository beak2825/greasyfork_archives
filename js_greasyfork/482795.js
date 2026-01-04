// ==UserScript==
// @name         吾爱破解悬赏楼层显示
// @namespace    http://tampermonkey.net/
// @version      2023-12-22.2
// @description  吾爱破解悬赏区，被采纳的帖子第一页将显示该页面顺序楼层
// @author       T4DNA
// @match        https://www.52pojie.cn/thread-*-*-*.html
// @match        https://www.52pojie.cn/forum.php?mod=viewthread&tid=*
// @icon         https://www.52pojie.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482795/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E6%82%AC%E8%B5%8F%E6%A5%BC%E5%B1%82%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/482795/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E6%82%AC%E8%B5%8F%E6%A5%BC%E5%B1%82%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var bestAnswer;
    function addIndex(docT, index){
        const piDiv = docT.getElementsByClassName('pi')[1];
        const aElement = piDiv.getElementsByTagName('a')[0];
        const spanElement = document.createElement('span');
        spanElement.style.color = 'red';
        spanElement.style.fontWeight = 'bold';
        var textContent = '原楼层：第'+index+'楼  '
        if (index=="10" && bestAnswer==docT){
            textContent = '原楼层：10楼(或第一页以后)  '
        }
        if (index>"10"){
            textContent = '原楼层大于10楼不在第一页  '
        }
        spanElement.textContent = textContent;
        aElement.insertBefore(spanElement, aElement.firstChild);
    };
    function getALLTABLE(){
        let tables = document.querySelectorAll('.plhin');
        tables = Array.from(tables).slice(1);
        bestAnswer = tables[0];
        let tablesWithIDNumbers = tables.map(table => {
            const tableID = table.id || "";
            const match = tableID.match(/pid(\d+)/);
            return {
                element: table,
                idNumber: match ? parseInt(match[1], 10) : null
            };
        });
        tablesWithIDNumbers = tablesWithIDNumbers.filter(item => item.idNumber !== null);
        tablesWithIDNumbers.sort((a, b) => a.idNumber - b.idNumber);
        return tablesWithIDNumbers
    };
    const parentDiv = document.querySelector('.rwd.cl');
    if (parentDiv) {
        const childDiv = parentDiv.querySelector('div');
        if (childDiv && childDiv.classList.contains('rusld')) {
            console.log('未完结悬赏');
        } else if (childDiv && childDiv.classList.contains('rsld')) {
            console.log('已完结悬赏');
            let newtables = getALLTABLE();
            newtables.forEach((item, index) => {
                addIndex(item.element, index + 2);
            });
        }
    }
})();