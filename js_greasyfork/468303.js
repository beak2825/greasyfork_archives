// ==UserScript==
// @name         武汉大学学生自动评教
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a floating button to execute custom JS on ugsqs.whu.edu.cn
// @author       Texiwustion
// @match        https://ugsqs.whu.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468303/%E6%AD%A6%E6%B1%89%E5%A4%A7%E5%AD%A6%E5%AD%A6%E7%94%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/468303/%E6%AD%A6%E6%B1%89%E5%A4%A7%E5%AD%A6%E5%AD%A6%E7%94%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
  'use strict';
  createFloatingButton();
})();

function createFloatingButton() {
  var props = {
    moved: false,
    checkCursor: true
  };

  const button = _createButton();
  document.body.appendChild(button);
  // Hover to changeCursor
  button.addEventListener('mousemove', (event)=>{
    //防止移动过程中出事
    if (!props.checkCursor) {
      return
    }
    const rect = button.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const mouseX = event.clientX - rect.left;

    if (mouseX < halfWidth) {
      button.style.cursor = 'move';
      props.moved = true;
    } else {
      button.style.cursor = 'default';
      props.moved = false;
    }
  });
  // Make the button draggable
  button.onmousedown = (event)=>{
    // Change position to absolute
    button.style.position = 'absolute';
    let shiftX = event.clientX - button.getBoundingClientRect().left;
    let shiftY = event.clientY - button.getBoundingClientRect().top;
    //console.log(shiftX, shiftY);
    function moveAt(pageX, pageY) {
      button.style.cursor = 'move';
      button.style.left = pageX - shiftX + 'px';
      button.style.top = pageY - shiftY + 'px';
    }
    function onMouseMove(event) {
      if (props.moved) {
        moveAt(event.pageX, event.pageY);
        props.checkCursor = false;
      }
    }
    document.addEventListener('mousemove', onMouseMove);
    button.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      button.onmouseup = null;
      // Change position back to fixed
      button.style.position = 'fixed';
      //checkCursor
      props.checkCursor = true;
    };
  };
  button.ondragstart = () => false;
  // Add two div elements for the left and right halves of the button
  const leftHalf = _createLelfHalfButton();
  const rightHalf = _createRightHalfButton();
  rightHalf.addEventListener('click', executeCustomJS);
  button.appendChild(leftHalf);
  button.appendChild(rightHalf);
}

function executeCustomJS() {
  let counter = 0;

  document.querySelectorAll('.controls').forEach(control => {
    const radios = control.querySelectorAll('input[type="radio"]');
    if (counter === 14 && radios[1]) {
      radios[1].checked = true;
    } else if (radios[0]) {
      radios[0].checked = true;
    }
    counter++;
  });

  document.querySelectorAll('[data-yjzb="开放型问题"]').forEach(element => {
    const textarea = element.querySelector('textarea');
    if (textarea) {
      textarea.value += '\nnull';
    }
  });
  //提交
  document.getElementById("pjsubmit").click();
}

function _createButton() {
  const button = document.createElement('button');
  button.style.position = 'fixed';
  button.style.width = '50px';
  button.style.height = '50px';
  button.style.right = '20vh';
  button.style.top = '20vh';
  button.style.zIndex = '100000';
  button.style.borderRadius = '50%';
  button.style.backgroundColor = '#ffffff';
  button.style.border = '3px solid #ccc';
  button.style.cursor = 'move';
  return button;
}
function _createLelfHalfButton() {
  const leftHalf = document.createElement('div');
  leftHalf.style.width = '50%';
  leftHalf.style.height = '100%';
  leftHalf.style.backgroundColor = 'black';
  leftHalf.style.position = 'absolute';
  leftHalf.style.left = '0';
  leftHalf.style.top = '0';
  return leftHalf;
}
function _createRightHalfButton() {
  const rightHalf = document.createElement('div');
  rightHalf.style.width = '50%';
  rightHalf.style.height = '100%';
  rightHalf.style.backgroundColor = 'white';
  rightHalf.style.position = 'absolute';
  rightHalf.style.right = '0';
  rightHalf.style.top = '0';
  return rightHalf;
}