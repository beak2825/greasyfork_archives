// ==UserScript==
// @name         路线编辑器
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  confluence路线编辑器优化
// @author       You
// @match        http://cf.myhexin.com/pages/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myhexin.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479854/%E8%B7%AF%E7%BA%BF%E7%BC%96%E8%BE%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/479854/%E8%B7%AF%E7%BA%BF%E7%BC%96%E8%BE%91%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Your code here...
    function createFloatMenu ({onClick, text}) {
    const id = 'ff-' + Math.floor(Math.random() * 10);
    var div = document.createElement('div');
    div.id = id;
    div.classList.add('ff-container');
    div.innerHTML = `
        <style>
            .ff-container {
              position: absolute;
              z-index: 3999;
              left: 10px;
              top: 10px;
              background-color: #f1f1f1;
              text-align: center;
              border-radius: 2px;
              font-size: 12px;
              overflow: hidden;
              box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
            }
            .ff-header {
              padding: 0 4px;
              cursor: move;
              z-index: 4999;
              background-color: #2196F3;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
            }
            .ff-action {
            	padding:3px 5px;
                background:white;
                cursor:pointer;
            }
        </style>
        <div id="${id}header" class="ff-header">: :</div>
        <div class="ff-action">${text}</div>
    `;
    document.body.appendChild(div);
    div.querySelector('.ff-action').addEventListener('click', onClick);
    dragElement(div);

    function dragElement(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
      } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
      }
      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }
      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
          console.log('drag', elmnt.style.top, elmnt.style.left)
      }

      function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
}
  function onClick() {
    sortAndChangeColor('vertical-line', 'roadmap-lane')
    const verticalLineList = Array.from(document.getElementsByClassName('vertical-line'));
    const height = parseInt(verticalLineList[0].style.height);
    verticalLineList.forEach((item, index) => {
      item.style.height = `${height + index * 30}px`;
    });
    Array.from(document.getElementsByClassName('marker-title-wrapper')).forEach(item => {
      item.style.position = 'initial';
      item.style.width = '300px';
    });
    Array.from(document.getElementsByClassName('marker-title')).forEach(item => {
      item.style.display = 'inline-block';
      item.style.width = '100%';
    });
  }
   function sortAndChangeColor(className, panelClass) {
  // 将 竖条 转换为数组
  var verticalArray = Array.from(document.getElementsByClassName(className));
  // 获取横条元素
  var panelArray = Array.from(document.getElementsByClassName(panelClass));

  verticalArray.forEach((item, index) => {
    const color = panelArray[index] ? panelArray[index].children[0].style.backgroundColor : panelArray[panelArray.length - 1].children[0].style.backgroundColor
    const title = panelArray[index] ? panelArray[index].children[0].title : ''
    // 给竖条加颜色
    item.style.backgroundColor = color
    // 给文字加颜色
    item.children[1].children[0].style.color = color
    item.children[1].children[0].innerHTML = `${title}:${item.children[1].children[0].innerHTML}`
  });

  // 使用数组的sort方法，根据元素的'left'属性值进行排序
  verticalArray.sort(function (a, b) {
    // 获取元素的'left'属性值（假设是以px为单位的字符串）
    var leftA = parseInt(a.style.left || '0', 10);
    var leftB = parseInt(b.style.left || '0', 10);
    // 根据'left'属性值进行比较
    return leftA - leftB;
  });

  // 将排序后的元素重新添加到其父元素中，以改变它们在文档中的顺序
  var parentElement = verticalArray[0].parentNode;
  verticalArray.forEach(function (element) {
    parentElement.appendChild(element);
  });
}
createFloatMenu({onClick: onClick, text: 'dialog重叠'})
})();
