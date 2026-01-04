// ==UserScript==
// @name         FR Hoard Item Counter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Gnorbu
// @match        https://www1.flightrising.com/hoard/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413974/FR%20Hoard%20Item%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/413974/FR%20Hoard%20Item%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setTimeout(initGUI, 1000);

    var sheet = window.document.styleSheets[0];
    sheet.insertRule('.guiContainer { margin-left: 14px; }', sheet.cssRules.length);
})();

let itemObj = {};

function initGUI(){
    let skybanner = document.querySelector('#skybanner');

    let guiContainer = document.createElement('div');
    guiContainer.className = 'guiContainer';
    guiContainer.style.paddingLeft = '10px';
    guiContainer.style.paddingTop = '10px';
    guiContainer.style.float = 'left';

    let textarea = document.createElement('textarea');
    textarea.style.marginTop = '20px';
    textarea.style.marginBottom = '10px';
    textarea.className = 'textarea';
    textarea.rows = '10';
    textarea.cols= '17';

    let br = document.createElement('br');

    let btn = document.createElement('button');
    btn.onclick = startCounting;
    btn.innerHTML = "Start Counting";
    btn.style.float = 'left';
    btn.style.marginBottom = '20px';

    guiContainer.appendChild(textarea);
    guiContainer.appendChild(br);
    guiContainer.appendChild(btn);

    skybanner.insertAdjacentElement("beforebegin", guiContainer);

}

async function startCounting(category){

    await countItems();

    let nextButton = document.querySelector('.common-pagination-arrow-next');
    let disabledBtn = document.querySelector('.common-ui-button-disabled.common-pagination-arrow-next');

    let disable = !nextButton || disabledBtn ? true : false;

    while(!disable){

        let newNextBtn = document.querySelector('.common-pagination-arrow-next');
        let newDisabledBtn = document.querySelector('.common-ui-button-disabled.common-pagination-arrow-next');

        if(!newNextBtn || newDisabledBtn){
            break;
        }

        newNextBtn.click();
        await sleep(1100);
        await countItems();
    }

    console.log("DONE!");

}

async function countItems(){
    let textarea = document.querySelector('.textarea');
    let itemContainer = document.querySelectorAll('.hoard-result-item');

    if (!itemContainer){
        return;
    }

    for (let i = 0; i < itemContainer.length; i++){

        let item = itemContainer[i].querySelector('.itemicon.hoard-result-item-icon').getAttribute('data-name');
        let itemCount = parseInt(itemContainer[i].getAttribute('data-quantity'));

        if(itemObj[item]){
            let currentAmount = itemObj[item];
            itemObj[item] = currentAmount + itemCount;
        } else {
            itemObj[item] = itemCount;
        }

        //console.log(`${item} -> ${itemObj[item]}`);
        let regexItem = new RegExp(`^${item} ; \\d+`, "m");

        if(regexItem.test(textarea.value)){
            textarea.value = textarea.value.replace(textarea.value.match(regexItem), `${item} ; ${itemObj[item]}`);
        } else {
            textarea.value += `${item} ; ${itemObj[item]}\n`;
        }

        textarea.scrollTo(0,textarea.scrollHeight);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
