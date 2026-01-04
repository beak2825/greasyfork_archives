// ==UserScript==
// @name          Arsenkin lemmatizator script
// @namespace     https://openuserjs.org/users/devgavi
// @description   Add button for copy only selected elements
// @version       0.2.0
// @copyright     2020, devgavi (https://github.com/devgavi/arsenkin-lemmatizator-script)
// @license       MIT
// @icon          https://arsenkin.ru/favicon.ico
// @include       https://arsenkin.ru/tools/lemma/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/398319/Arsenkin%20lemmatizator%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/398319/Arsenkin%20lemmatizator%20script.meta.js
// ==/UserScript==

'use strict';

function getAllRows() {
    return document.querySelectorAll('#target2 tbody tr');
}

function getInputList() {
    return document.querySelectorAll('#target2 tr input');
}

function addCheckbox() {
    const items = getAllRows();

    for (const i in items) {
        if (items.hasOwnProperty(i)) {
            const firstCell = items[i].querySelectorAll('td')[0];
            firstCell.prepend(createCheckbox());
        }
    }
}

function createCheckbox() {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'lemma';
    checkbox.value = '';
    checkbox.style.marginRight = '5px';

    return checkbox;
}

function addCopyButton() {
    const previousButton = document.querySelector('.btn.btn-info');
    previousButton.after(createButton());
}

function createButton() {
    const newButton = document.createElement('button');
    newButton.className = 'btn btn-info copy-selected';
    newButton.style.marginBottom = '10px';
    newButton.style.marginLeft = '10px';
    newButton.textContent = 'Скопировать выделенное';

    return newButton;
}

function collectSelectedRows() {
    const inputList = getInputList();
    const selected = [];

    for (const i in inputList) {
        if (inputList.hasOwnProperty(i)) {
            if (inputList[i].checked) {
                const parentRow = inputList[i].closest('tr');
                const childContent = parentRow.querySelectorAll('td');

                selected.push(childContent[0].textContent.trim());
            }
        }
    }

    if (selected.length) {
        copyToClipboard(selected.join('\n'));

        alert('Выбранные значения успешно скопированы!');
    } else {
        alert('Ничего не выбрано для копирования!');
    }
}

function copyToClipboard(data) {
    const textarea = document.createElement('textarea');

    textarea.value = data;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function highlightSelectedRow(event) {
    const parentNode = event.target.closest('tr');

    if (event.target.checked) {
        parentNode.style.backgroundColor = '#d9edf7';
    } else {
        parentNode.style.backgroundColor = '';
    }
}

// create an observer instance
const observer = new MutationObserver(function () {
    // create checkbox near the each element
    addCheckbox();

    // add button for copy only selected elements
    addCopyButton();

    const copyButton = document.querySelector('.copy-selected');

    copyButton.addEventListener('click', collectSelectedRows);

    // highlight selected elements
    const inputList = getInputList();

    inputList.forEach(function (item) {
        item.addEventListener('click', highlightSelectedRow);
    });

    // later, you can stop observing
    observer.disconnect();
});

const initObserver = function () {
    const container = document.querySelector('#container');

    observer.observe(container, {
        childList: true,
        attributes: false,
        characterData: false
    });
};

document.querySelector('#ok').addEventListener('click', initObserver);
