// ==UserScript==
// @name         tiktok Jump to all orders
// @namespace    https://github.com/W-Dragoner/tiktokdemo
// @version      1.2
// @description  Automatically jump to all orders
// @author       You
// @match        https://dmall.jinritemai.com/ffa/morder/order/list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @license      AGPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485535/tiktok%20Jump%20to%20all%20orders.user.js
// @updateURL https://update.greasyfork.org/scripts/485535/tiktok%20Jump%20to%20all%20orders.meta.js
// ==/UserScript==
(function(){
    'use strict';
    var divs = document.getElementsByClassName("index_tabWrapper__-OQd7  ");
    var style = document.createElement("style");
    style.innerHTML = `
      #window {
        width: 200px;
        height: 200px;
        background-color: lightblue;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: move;
      }

      #button {
        width: 80px;
        height: 30px;
        background-color: yellow;
        margin: 10px auto;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    var draggableElement = document.createElement("div");
    draggableElement.id = "window";
    document.body.appendChild(draggableElement);

    var button = document.createElement("div");
    button.id = "button";
    button.innerText = "点击";
    draggableElement.appendChild(button);

    var offsetX, offsetY;

    draggableElement.addEventListener("mousedown", function(event) {
      offsetX = event.clientX - draggableElement.offsetLeft;
      offsetY = event.clientY - draggableElement.offsetTop;
    });

    document.addEventListener("mousemove", function(event) {
      if (offsetX !== undefined && offsetY !== undefined) {
        draggableElement.style.left = (event.clientX - offsetX) + "px";
        draggableElement.style.top = (event.clientY - offsetY) + "px";
      }
    });

    document.addEventListener("mouseup", function() {
      offsetX = undefined;
      offsetY = undefined;
    });

    button.addEventListener("click", function() {
      setTimeout(function() {
        var divs = document.getElementsByClassName("index_tabWrapper__-OQd7  ");
  
        // 点击第一个div
        divs[0].click();
      }, 2000);
    });

   
    // 点击第一个div
   
  })();