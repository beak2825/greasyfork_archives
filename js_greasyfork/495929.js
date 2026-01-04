// ==UserScript==
// @name        coze.com宽幅界面切换N
// @namespace   Violentmonkey Scripts
// @match       *://*.coze.com/*
// @grant       none
// @version     1.7
// @description Customize the layout of Coze's sidesheet-container. Now with a toggle switch.
// @downloadURL https://update.greasyfork.org/scripts/495929/cozecom%E5%AE%BD%E5%B9%85%E7%95%8C%E9%9D%A2%E5%88%87%E6%8D%A2N.user.js
// @updateURL https://update.greasyfork.org/scripts/495929/cozecom%E5%AE%BD%E5%B9%85%E7%95%8C%E9%9D%A2%E5%88%87%E6%8D%A2N.meta.js
// ==/UserScript==

let widescreenEnabled = false;
let isDragging = false;
let mouseX, mouseY, btnX, btnY;

// 创建一个按钮用来切换宽幅
let toggleButton = document.createElement('button');
toggleButton.innerHTML = '切换宽幅布局';
toggleButton.style.position = 'fixed';
toggleButton.style.top = '60px';
toggleButton.style.right = '10px';
toggleButton.style.zIndex = '9999';
toggleButton.onclick = function(event) {
    event.stopPropagation();
    widescreenEnabled = !widescreenEnabled;
    updateLayout();
};
toggleButton.onmousedown = function(event) {
    isDragging = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
}
window.onmouseup = function() {
    isDragging = false;
}
window.onmousemove = function(event) {
    if (isDragging) {
        let deltaX = event.clientX - mouseX;
        let deltaY = event.clientY - mouseY;
        toggleButton.style.right = (parseInt(toggleButton.style.right) - deltaX) + "px";
        toggleButton.style.top = (parseInt(toggleButton.style.top) + deltaY) + "px";
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
}

document.body.appendChild(toggleButton);

function updateLayout() {
    if (widescreenEnabled) {
        document.getElementsByClassName('sidesheet-container')[0].style['grid-template-columns'] = '0fr 14fr';
    } else {
        document.getElementsByClassName('sidesheet-container')[0].style.removeProperty('grid-template-columns');
    }
}

window.onload = function() {
  var checkExist = setInterval(function() {
    if (document.getElementsByClassName('sidesheet-container').length) {
        updateLayout();
        clearInterval(checkExist);
    }
  }, 100);
}