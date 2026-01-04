// ==UserScript==
// @name         EDIT CSS
// @namespace    http://shikimori.me/
// @match        *://*/*
// @description  CSS EDITOR
// @version      1.9
// @author       pirate-
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486879/EDIT%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/486879/EDIT%20CSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

function addElementIfNotExists(selector, element) {
    const existingElement = document.querySelector(selector);
    if (!existingElement) {
        document.body.insertAdjacentElement('beforeend', element);
    }
}

var useEditorButton = document.createElement('span');
useEditorButton.classList.add('use-editor');
useEditorButton.textContent = 'CSS';
useEditorButton.style.background = 'white';
useEditorButton.style.borderRadius = '4px 0 0 4px';
useEditorButton.style.display = 'inline';
useEditorButton.style.position = 'fixed';
useEditorButton.style.right = '0';
useEditorButton.style.top = '70px';
useEditorButton.style.padding = '6px';
useEditorButton.style.cursor = 'pointer';

var styleBlock = document.createElement('style');
var cssEditor = document.createElement('div');
var dragHandle = document.createElement('div');
var resizeHandle = document.createElement('div');
var cssEditorTextArea = document.createElement('div');
var closeButton = document.createElement('span');

cssEditor.classList.add('my-css');
cssEditor.style.position = 'fixed';
cssEditor.style.top = '10em';
cssEditor.style.left = '25em';
cssEditor.style.padding = '10px';
cssEditor.style.border = '1px solid rgb(204, 204, 204)';
cssEditor.style.width = '288px';
cssEditor.style.height = '220px';
cssEditor.style.overflow = 'auto';
cssEditor.style.zIndex = '9999';
cssEditor.style.display = 'none';
cssEditor.style.background = 'white';
cssEditor.style.fontFamily = 'var(--font-code)';
cssEditor.style.fontSize = '11px';
cssEditor.style.color = 'black';
cssEditor.style.gridAutoColumns = '1fr 24px 1fr';
cssEditor.style.gridAutoRows = 'auto 1fr';

dragHandle.classList.add('drag-handle');
dragHandle.style.width = '20px';
dragHandle.style.height = '20px';
dragHandle.style.cursor = 'move';
dragHandle.style.background = '#bdb5b5';
dragHandle.style.gridArea = '1 / 1 / 2 / 2';

resizeHandle.classList.add('resize-handle');
resizeHandle.style.width = '20px';
resizeHandle.style.height = '20px';
resizeHandle.style.cursor = 'se-resize';
resizeHandle.style.background = '#adcedc';
resizeHandle.style.gridArea = '1 / 3 / 2 / 4';
resizeHandle.style.justifySelf = 'end';

cssEditorTextArea.setAttribute('contenteditable', true);
cssEditorTextArea.setAttribute('spellcheck', false);
cssEditorTextArea.style.border = '1px solid #edecec';
cssEditorTextArea.style.marginTop = '10px';
cssEditorTextArea.style.minHeight = '100px';
cssEditorTextArea.style.overflow = 'auto';
cssEditorTextArea.style.gridArea = '2 / 1 / 3 / 4';
cssEditorTextArea.style.padding = '5px';
cssEditorTextArea.style.outline = 'none';

closeButton.classList.add('my-close');
closeButton.textContent = '✖';

cssEditor.appendChild(dragHandle);
cssEditor.appendChild(resizeHandle);
cssEditor.appendChild(cssEditorTextArea);
cssEditor.appendChild(closeButton);

function checkElementsPeriodically() {
    addElementIfNotExists('.use-editor', useEditorButton);

    var myCssBlock = document.querySelector('.my-css');
    if (!myCssBlock) {
        document.body.appendChild(cssEditor);
        document.body.appendChild(styleBlock);
    }
}

setInterval(checkElementsPeriodically, 1000);

var isDragging = false;
var dragOffsetX, dragOffsetY;

dragHandle.addEventListener('mousedown', function(event) {
    isDragging = true;
    dragOffsetX = event.clientX - cssEditor.getBoundingClientRect().left;
    dragOffsetY = event.clientY - cssEditor.getBoundingClientRect().top;
});

document.addEventListener('mousemove', function(event) {
    if (isDragging) {
        cssEditor.style.left = event.clientX - dragOffsetX + 'px';
        cssEditor.style.top = event.clientY - dragOffsetY + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

dragHandle.addEventListener('touchstart', function(event) {
    isDragging = true;
    dragOffsetX = event.touches[0].clientX - cssEditor.getBoundingClientRect().left;
    dragOffsetY = event.touches[0].clientY - cssEditor.getBoundingClientRect().top;
});

document.addEventListener('touchmove', function(event) {
    if (isDragging) {
        cssEditor.style.left = event.touches[0].clientX - dragOffsetX + 'px';
        cssEditor.style.top = event.touches[0].clientY - dragOffsetY + 'px';
    }
});

document.addEventListener('touchend', function() {
    isDragging = false;
});

var isResizing = false;
var resizeStartX, resizeStartY, startWidth, startHeight;

resizeHandle.addEventListener('mousedown', function(event) {
    isResizing = true;
    resizeStartX = event.clientX;
    resizeStartY = event.clientY;
    startWidth = cssEditor.offsetWidth;
    startHeight = cssEditor.offsetHeight;
    event.preventDefault();
});

document.addEventListener('mousemove', function(event) {
    if (isResizing) {
        var newWidth = startWidth + (event.clientX - resizeStartX);
        var newHeight = startHeight + (event.clientY - resizeStartY);
        cssEditor.style.width = newWidth + 'px';
        cssEditor.style.height = newHeight + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isResizing = false;
});

resizeHandle.addEventListener('touchstart', function(event) {
    isResizing = true;
    var touch = event.touches[0];
    resizeStartX = touch.clientX;
    resizeStartY = touch.clientY;
    startWidth = cssEditor.offsetWidth;
    startHeight = cssEditor.offsetHeight;
    event.preventDefault();
});

document.addEventListener('touchmove', function(event) {
    if (isResizing) {
        var touch = event.touches[0];
        var newWidth = startWidth + (touch.clientX - resizeStartX);
        var newHeight = startHeight + (touch.clientY - resizeStartY);
        cssEditor.style.width = newWidth + 'px';
        cssEditor.style.height = newHeight + 'px';
    }
});

document.addEventListener('touchend', function() {
    isResizing = false;
});

function saveContent() {
    localStorage.setItem('cssEditorContent', cssEditorTextArea.textContent);
}

function restoreContent() {
    var savedContent = localStorage.getItem('cssEditorContent');
    if (savedContent) {
        cssEditorTextArea.textContent = savedContent;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    restoreContent();
});

cssEditorTextArea.addEventListener('input', function() {
    styleBlock.textContent = cssEditorTextArea.textContent;
    saveContent();
});

var styleNode = document.createElement('style');
styleNode.textContent = '.o_n { box-shadow: rgb(164, 164, 164) 0px 0px 5px 2px inset; } .my-close { grid-area: 1 / 2 / 2 / 3; cursor: pointer; color: red; font-size: 16px; text-align: center; background: whitesmoke;} .use-editor {z-index:999; color:black;} ';
document.head.appendChild(styleNode);

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('use-editor')) {
        cssEditor.style.display = 'grid';
        useEditorButton.classList.add('o_n');
    }
    if (event.target.classList.contains('my-close')) {
        cssEditor.style.display = 'none';
        useEditorButton.classList.remove('o_n');
    }
});
})();