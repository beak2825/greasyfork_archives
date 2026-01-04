// ==UserScript==
// @name         巨量百应自动循环讲解
// @namespace    http://tampermonkey.net/
// @version      0.5
// @author       Mag
// @description  填写商品id在框 输入循环时间即可自动点击商品
// @license      Mag
// @match        https://buyin.jinritemai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472691/%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E8%87%AA%E5%8A%A8%E5%BE%AA%E7%8E%AF%E8%AE%B2%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/472691/%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E8%87%AA%E5%8A%A8%E5%BE%AA%E7%8E%AF%E8%AE%B2%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (document.getElementById("custom-script")) {
    console.log("脚本已存在，无需重复添加。");
    return;
  }

  var scriptContainer = document.createElement("script");
  scriptContainer.id = "custom-script";
  scriptContainer.type = "text/javascript";

  function clickButton(button) {
    button.click();
  }

  var intervalId;

  var targetAttributeInput = document.createElement("input");
  targetAttributeInput.type = "text";
  targetAttributeInput.value = "粘贴商品id到这里";

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