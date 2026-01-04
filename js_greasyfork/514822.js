// ==UserScript==
// @name         haojiegg or da
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Mag创作
// @description  填写商品id在框 输入循环时间即可自动点击商品
// @license      Mag
// @match        *://buyin.jinritemai.com/dashboard/live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514822/haojiegg%20or%20da.user.js
// @updateURL https://update.greasyfork.org/scripts/514822/haojiegg%20or%20da.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (document.getElementById("custom-script")) {
    console.log("脚本已存在，无需重复添加。");
    return;
  }
    console.log("1212121212121212121212121212121212121212121212121212121212121212121212121212121212121212");

  var scriptContainer = document.createElement("script");
  scriptContainer.id = "custom-script";
  scriptContainer.type = "text/javascript";

  function clickButton(button) {
    button.click();
  }

  var intervalId;

  var targetAttributeInput = document.createElement("input");
  targetAttributeInput.type = "text";
  targetAttributeInput.value = "3614805475645886576";

  var timesInput = document.createElement("input");
  timesInput.type = "number";
  timesInput.value = "8000";

  var startButton = document.createElement("button");
  startButton.textContent = "执行";

  var stopButton = document.createElement("button");
  stopButton.textContent = "终止";

  var buttonContainer = document.createElement("div");
  buttonContainer.style.position = "fixed";
  buttonContainer.style.top = "50%";
  buttonContainer.style.left = "20px";
  buttonContainer.style.transform = "translateY(-50%)";
  buttonContainer.style.zIndex = "9999";
  buttonContainer.appendChild(document.createTextNode("目标元素属性值："));
  buttonContainer.appendChild(targetAttributeInput);
  buttonContainer.appendChild(document.createElement("br"));
  buttonContainer.appendChild(document.createTextNode("时间间隔（毫秒）："));
  buttonContainer.appendChild(timesInput);
  buttonContainer.appendChild(document.createElement("br"));
  buttonContainer.appendChild(startButton);
  buttonContainer.appendChild(stopButton);

  document.body.appendChild(buttonContainer);

  var isDragging = false;
  var startPosX, startPosY;

  buttonContainer.addEventListener("mousedown", function(e) {
    isDragging = true;
    startPosX = e.clientX - buttonContainer.offsetLeft;
    startPosY = e.clientY - buttonContainer.offsetTop;
  });

  document.addEventListener("mousemove", function(e) {
    if (isDragging) {
      var offsetX = e.clientX - startPosX;
      var offsetY = e.clientY - startPosY;
      buttonContainer.style.left = offsetX + "px";
      buttonContainer.style.top = offsetY + "px";
    }
  });

  document.addEventListener("mouseup", function() {
    isDragging = false;
  });

  function startLoopClick() {
    var targetAttribute = targetAttributeInput.value;
    var times = parseInt(timesInput.value, 10);

    intervalId = setInterval(function() {
      var parentElement = document.querySelector('[data-rbd-draggable-id="' + targetAttribute + '"]');
      if (parentElement) {
        var buttons = parentElement.querySelectorAll('button');
        buttons.forEach(function(button) {
          if (button.textContent === "取消讲解") {
            clickButton(button);
          }
        });
      }
    }, times);

    setInterval(function() {
      var parentElement = document.querySelector('[data-rbd-draggable-id="' + targetAttribute + '"]');
      if (parentElement) {
        var buttons = parentElement.querySelectorAll('button');
        buttons.forEach(function(button) {
          if (button.textContent === "讲解") {
            clickButton(button);
          }
        });
      }
    }, 1000);
  }

  function stopLoopClick() {
    clearInterval(intervalId);
    scriptContainer.remove(); 
    startButton.disabled = false; 
  }

  startButton.addEventListener("click", function() {
    startLoopClick();
    startButton.disabled = true; 
  });
  stopButton.addEventListener("click", stopLoopClick);

  document.body.appendChild(scriptContainer);

})();