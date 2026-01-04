// ==UserScript==
// @name        慕课，自动互评 - icourse163.org
// @match       https://www.icourse163.org/learn/*
// @namespace   zhufn.fun
// @grant       none
// @version     1.3
// @author      zhuufn
// @description 2022/3/19 21:09:54
// @license gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/441757/%E6%85%95%E8%AF%BE%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84%20-%20icourse163org.user.js
// @updateURL https://update.greasyfork.org/scripts/441757/%E6%85%95%E8%AF%BE%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84%20-%20icourse163org.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.pingfen = function() {
        alert("即将互评当前页面打开的某人的作业！")
        var a = document.getElementsByClassName('s')
        for (let i = 0; i < a.length; ++i)
        {
            a[i].children[a[i].children.length-1].children[0].checked = true
        }
        var b = document.getElementsByTagName("textarea")
        for (let i = 0; i < b.length; ++i) {
            b[i].value = "好"
        }
    }

    function fuck() {
        let tmp = document.createElement("a")
        tmp.innerHTML="自动互评"
        tmp.onclick=window.pingfen
        tmp.style="font-size: 60px;"
        document.getElementById("j-courseTabList").appendChild(tmp)
    }

    function runWhenReady(readySelector, callback) {
      var numAttempts = 0;
      var tryNow = function() {
          var elem = document.querySelector(readySelector);
          if (elem) {
              callback(elem);
          } else {
              numAttempts++;
              if (numAttempts >= 34) {
                  console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
              } else {
                  setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
              }
          }
      };
      tryNow();
    }

    runWhenReady("#j-courseTabList", fuck)
    // Your code here...
})();