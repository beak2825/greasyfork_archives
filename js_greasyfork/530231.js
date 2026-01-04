// ==UserScript==
// @name         ChatGPTメモ帳(モバイル用)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Execute UserScript
// @author       Your Name
// @match        https://chatgpt.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530231/ChatGPT%E3%83%A1%E3%83%A2%E5%B8%B3%28%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530231/ChatGPT%E3%83%A1%E3%83%A2%E5%B8%B3%28%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.top = '15px';
    button.style.left = '50px';
    button.style.width = '25px';
    button.style.height = '25px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '10000';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';

    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.style.width = '20px';
        line.style.height = '3px';
        line.style.backgroundColor = 'white';
        line.style.margin = '2px 0';
        button.appendChild(line);
    }

    button.addEventListener('click', () => {
javascript:(function(){
  var winId = 'myMemoWindow';
  var storageKey = 'bookmarkMemoText';
  var savedFlagKey = 'bookmarkMemoSaved';
  var existing = document.getElementById(winId);
  if(existing) {
    existing.parentNode.removeChild(existing);
  }

  var container = document.createElement('div');
  container.id = winId;
  container.style.cssText = 'position:fixed;top:20px;left:20px;width:300px;height:250px;background:#FFFACD;color:#00008B;border:2px solid #DAA520;box-shadow:0 0 10px rgba(0,0,0,0.5);z-index:9999;padding:10px;display:flex;flex-direction:column;border-radius:8px;resize:both;overflow:auto;';


  container.style.position = "fixed";
  container.style.cursor = "move";

  var isDragging = false;
  var offsetX, offsetY;

  container.addEventListener("mousedown", function(e) {
    if (e.target === container) {
      isDragging = true;
      offsetX = e.clientX - container.getBoundingClientRect().left;
      offsetY = e.clientY - container.getBoundingClientRect().top;
      container.style.userSelect = "none";
    }
  });

  document.addEventListener("mousemove", function(e) {
    if (isDragging) {
      container.style.left = (e.clientX - offsetX) + "px";
      container.style.top = (e.clientY - offsetY) + "px";
    }
  });

  document.addEventListener("mouseup", function() {
    isDragging = false;
    container.style.userSelect = "";
  });

  var closeBtn = document.createElement('button');
  closeBtn.textContent = '☒';
  closeBtn.style.cssText = 'position:absolute;top:5px;right:5px;border:none;background:#FFA07A;color:#8B0000;font-size:16px;cursor:pointer;padding:2px 6px;border-radius:4px;';
  closeBtn.onclick = function(){
    container.style.display = 'none';
  };
  container.appendChild(closeBtn);

  var ta = document.createElement('textarea');
  ta.style.cssText = 'flex:1;width:100%;resize:none;margin-top:25px;background:#FAFAD2;color:#00008B;border:1px solid #DAA520;padding:5px;font-size:14px;border-radius:4px;';

  if(localStorage.getItem(savedFlagKey)){
    var saved = localStorage.getItem(storageKey);
    if(saved){ ta.value = saved; }
  }
  container.appendChild(ta);

  var btnContainer = document.createElement('div');
  btnContainer.style.cssText = 'text-align:center;margin-top:5px;';

  function createButton(text, color, bgColor, onClick) {
    var btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `margin:2px;padding:5px 10px;border:none;border-radius:4px;background:${bgColor};color:${color};cursor:pointer;font-size:14px;`;
    btn.onclick = onClick;
    return btn;
  }

  btnContainer.appendChild(createButton('クリア', '#8B4513', '#FFD700', function(){ ta.value = ''; }));

  btnContainer.appendChild(createButton('コピー', '#006400', '#98FB98', function(){
    ta.select();
    try {
      document.execCommand('copy');
    } catch(e) {}
  }));

  btnContainer.appendChild(createButton('保存', '#483D8B', '#87CEFA', function(){
    localStorage.setItem(storageKey, ta.value);
    localStorage.setItem(savedFlagKey, 'true');
  }));

  btnContainer.appendChild(createButton('保存をクリア', '#8B0000', '#FFA500', function(){
    localStorage.removeItem(storageKey);
    localStorage.removeItem(savedFlagKey);
    ta.value = '';
  }));

  container.appendChild(btnContainer);


  var resizers = ["nw", "ne", "sw", "se", "n", "e", "s", "w"];

  resizers.forEach(function(dir) {
    var resizer = document.createElement('div');
    resizer.className = 'resizer ' + dir;
    resizer.style.position = "absolute";
    resizer.style.width = (dir === "n" || dir === "s") ? "100%" : "10px";
    resizer.style.height = (dir === "e" || dir === "w") ? "100%" : "10px";
    resizer.style.background = "rgba(0,0,0,0.2)";
    resizer.style.cursor = dir + "-resize";

    switch (dir) {
      case "nw":
        resizer.style.top = "0";
        resizer.style.left = "0";
        break;
      case "ne":
        resizer.style.top = "0";
        resizer.style.right = "0";
        break;
      case "sw":
        resizer.style.bottom = "0";
        resizer.style.left = "0";
        break;
      case "se":
        resizer.style.bottom = "0";
        resizer.style.right = "0";
        break;
      case "n":
        resizer.style.top = "0";
        resizer.style.left = "0";
        break;
      case "s":
        resizer.style.bottom = "0";
        resizer.style.left = "0";
        break;
      case "e":
        resizer.style.right = "0";
        resizer.style.top = "0";
        break;
      case "w":
        resizer.style.left = "0";
        resizer.style.top = "0";
        break;
    }

    container.appendChild(resizer);

    resizer.addEventListener("mousedown", function(e) {
      e.preventDefault();
      var startX = e.clientX;
      var startY = e.clientY;
      var startWidth = parseInt(document.defaultView.getComputedStyle(container).width, 10);
      var startHeight = parseInt(document.defaultView.getComputedStyle(container).height, 10);
      var startLeft = container.offsetLeft;
      var startTop = container.offsetTop;

      function doResize(e) {
        if (dir.includes("e")) {
          container.style.width = startWidth + (e.clientX - startX) + "px";
        }
        if (dir.includes("s")) {
          container.style.height = startHeight + (e.clientY - startY) + "px";
        }
        if (dir.includes("w")) {
          container.style.width = startWidth - (e.clientX - startX) + "px";
          container.style.left = startLeft + (e.clientX - startX) + "px";
        }
        if (dir.includes("n")) {
          container.style.height = startHeight - (e.clientY - startY) + "px";
          container.style.top = startTop + (e.clientY - startY) + "px";
        }
      }

      function stopResize() {
        document.removeEventListener("mousemove", doResize);
        document.removeEventListener("mouseup", stopResize);
      }

      document.addEventListener("mousemove", doResize);
      document.addEventListener("mouseup", stopResize);
    });
  });

  document.body.appendChild(container);
})();
    });

    document.body.appendChild(button);
})();