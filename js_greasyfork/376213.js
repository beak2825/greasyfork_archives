// ==UserScript==
// @name U2编辑框增强
// @version 1.0.1
// @description 给U2的编辑框加上点按钮儿
// @namespace Violentmonkey Scripts
// @match https://u2.dmhy.org/upload.php*
// @match https://u2.dmhy.org/edit.php?id=*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/376213/U2%E7%BC%96%E8%BE%91%E6%A1%86%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/376213/U2%E7%BC%96%E8%BE%91%E6%A1%86%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(() => {
    const editArea = document.querySelector('#descr');
    const createButton = (buttonName) => {
        const btnContainer = document.createElement('td');
        const btnInput = document.createElement('input');
        btnContainer.className = 'embedded';
        btnInput.value = buttonName.toUpperCase();
        btnInput.style.fontSize = '11px';
        btnInput.style.marginRight = '3px';
        btnInput.className = 'codebuttons';
        btnInput.type = 'button';
        btnContainer.appendChild(btnInput);
        btnInput.addEventListener('click', (e) => {
            e.preventDefault();
            insertTag(editArea, [`[${buttonName}]`, `[/${buttonName}]`]);
        });
        return btnContainer;
    }
    const insertTag = (element, tag) => {
        const start = element.selectionStart;
        const end = element.selectionEnd;
        element.value = element.value.slice(0, start) + tag[0] + element.value.slice(start, end) + tag[1] + element.value.slice(end);
    }
    
    
    const lastTableDataCell = 
        location.href.includes('edit.php') 
        ? document.querySelector('#compose > table > tbody > tr:nth-child(7) > td.rowfollow > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(6)')
        : document.querySelector('#compose > table > tbody > tr:nth-child(35) > td.rowfollow > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(6)');

    const spoilerBtnContainer = createButton('spoiler');
    lastTableDataCell.parentNode.insertBefore(
        spoilerBtnContainer,
        lastTableDataCell.nextSibling
    );
    const mediaInfoBtnContainer = createButton('mediainfo');
    spoilerBtnContainer.parentNode.insertBefore(
        mediaInfoBtnContainer,
        spoilerBtnContainer.nextSibling
    );
})()