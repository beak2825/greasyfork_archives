// ==UserScript==
// @name         请求服务器连接
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  请求服务器不要中断
// @author       rick
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.3/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454455/%E8%AF%B7%E6%B1%82%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%BF%9E%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/454455/%E8%AF%B7%E6%B1%82%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%BF%9E%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
   $(function () {
        setTimeout(() => {
          getClick();
        }, 5000);
        function getClick() {
          let addStr = `<div id="app">
        <div class="box">
          <label for="trigger-select">选择机子号码：</label>
          <select name="trigger" id="trigger-select">
            <option value="1">1号机</option>
            <option value="2">2号机</option>
            <option value="3">3号机</option>
          </select>
        </div>
        <div class="box">
          <label for="time-select">请选择间隔时间：</label>
          <select name="timer" id="time-select">
            <option value="5">5s</option>
            <option value="10">10s</option>
            <option value="15">15s</option>
          </select>
        </div>
        <button id="btn">确定</button>
      </div>
          `;
          let btn = document.querySelector("#btn");
          let warp = document.querySelector(".content-wrap");
          let ele = document.createElement("div");
          ele.innerHTML = addStr;
          warp.append(ele);
          btn.onclick = function () {
            let trigger = parseInt(
                document.querySelector("#trigger-select").value
              ),
              time =
                parseInt(document.querySelector("#time-select").value) * 1000;
          };
          function autoClick(trigger, time) {
            if (trigger == 1) {
              trigger == 0;
            }
            if (trigger == 2) {
              trigger == 3;
            }
            if (trigger == 3) {
              trigger == 6;
            }
            console.log(trigger, time);
            let dom =
              document.getElementsByClassName("operation-text")[trigger];
            setInterval(() => {
              if (dom.innerText == "运行") {
                dom.click();
              }
            }, time);
          }
        }
      });
})();