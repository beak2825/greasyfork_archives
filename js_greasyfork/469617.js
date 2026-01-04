// ==UserScript==
// @name         LeetCode Problem Copyer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  复制Leetcode的题目的文本或HTML
// @author       You
// @match        https://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469617/LeetCode%20Problem%20Copyer.user.js
// @updateURL https://update.greasyfork.org/scripts/469617/LeetCode%20Problem%20Copyer.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  var x = 100;
  var y = 20;
  var id = "dsafaafdsfss2112";

  function info(message) {
    let p = document.createElement("p");
    p.style.padding = "10px 20px";
    p.style.fontSize = "12px";
    p.style.display = "block";
    p.style.position = "absolute";
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.border = "1px solid black";
    p.style.borderRadius = "3px";
    p.style.backgroundColor = "#FFF";
    p.innerText = message;
    document.body.appendChild(p);
    setTimeout(function () {
      document.body.removeChild(p);
    }, 1000);
  }

  function fnCopy(copyText) {
    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        info("Copy Ok!");
      })
      .catch(() => {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.setAttribute("value", copyText);
        input.select();
        if (document.execCommand("copy")) {
          document.execCommand("copy");
        }
        document.body.removeChild(input);
        info("Copy Ok!");
      });
  }

  var createBtn = function (title, cb) {
    let mbtn = document.createElement("button");
    //mbtn.style.width = "40px";
    mbtn.classList.add("css-nabodd-Button");
    mbtn.style.height = "20px";
    mbtn.innerText = title;
    mbtn.style.padding='3px 5px';
    mbtn.style.border = "1px solid rgb(89, 89, 89)";
    mbtn.style.borderRadius = "3px";
    mbtn.style.zIndex = 999;
    mbtn.style.marginRight = "5px";
    mbtn.addEventListener("click", cb);
    return mbtn;
  };
  var createDiv = function () {
    let div = document.createElement("div");
    const htmlBtn = createBtn("CopyHtml", function (e) {
      x = e.clientX + 10;
      y = e.clientY + 10;
      fnCopy(
        document.querySelector('div[data-key="description-content"]').innerHTML
      );
    });
    const textBtn = createBtn("CopyText", function (e) {
      x = e.clientX + 10;
      y = e.clientY + 10;
      fnCopy(
        document.querySelector('div[data-key="description-content"]').innerText
      );
    });
    div.style.display='flex';
    div.appendChild(htmlBtn);
    div.appendChild(textBtn);
    div.id = id;
    return div;
  };

  function task() {
    if (document.getElementById(id)) {
      return true;
    }
    var _parent = document.querySelector('div[data-key="description-content"]').firstChild.firstChild.lastChild;
    if (_parent) {
      let div = createDiv();
      _parent.appendChild(div);
      return true;
    }
    return false;
  }

  var onceTask = setInterval(function () {
    try {
      task();
    } catch (e) {
      console.log("try..");
    }
  }, 1000);

})();
