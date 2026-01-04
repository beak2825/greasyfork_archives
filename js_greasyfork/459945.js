// ==UserScript==
// @name        关闭当前标签页
// @description   点击按钮或者鼠标后退键关闭标签页
// @description:en Click the button or mouse back button to close the tab
// @version       0.0.5
// @author       chancoki
// @include      /.*:.*/
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license     MIT
// @namespace   https://greasyfork.org/users/754467
// @downloadURL https://update.greasyfork.org/scripts/459945/%E5%85%B3%E9%97%AD%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/459945/%E5%85%B3%E9%97%AD%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const body = document.body;
  const div = document.createElement("div");
  const p = document.createElement("p");

  body.appendChild(div);
  body.appendChild(p);
  div.className = "cc-close";
  div.innerHTML = `<svg t="1675903488815" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3459" data-darkreader-inline-fill="" width="12" height="12"><path d="M155.252 943.825c-19.213 0-38.429-7.332-53.089-21.988-29.317-29.321-29.317-76.855 0-106.175l713.494-713.494c29.317-29.321 76.853-29.321 106.175 0 29.317 29.317 29.317 76.855 0 106.175l-713.494 713.494c-14.66 14.66-33.874 21.988-53.089 21.988z" fill="" p-id="3460"></path><path d="M868.749 943.824c-19.213 0-38.428-7.332-53.089-21.988l-713.494-713.493c-29.317-29.317-29.317-76.857 0-106.175 29.316-29.317 76.855-29.321 106.174 0l713.494 713.492c29.317 29.321 29.317 76.855 0 106.175-14.657 14.661-33.871 21.993-53.087 21.993z" fill="" p-id="3461"></path></svg>`
      div.addEventListener('click', closeWebPage)
      p.innerHTML = `
    <style>
  .cc-close {
    position: fixed;
    top: 100px;
    left: 10px;
    width: 26px;
    height: 26px;
    z-index: 99999999999;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    background-color: rgba(235, 235, 235, 0.3);
    backdrop-filter: saturate(180%) blur(20px);
    cursor: pointer;
    padding: 0;
    margin: 0;
    transition: all .3s;
   opacity: .4;
  }
   .cc-close:hover {
    width: 70px;
    opacity: 1;
  }
</style>
  `
      const length = history.length

      function closeWebPage () {
        if (navigator.userAgent.indexOf("MSIE") > 0) {
          if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null;
          } else {
            window.open('', '_top');
          }
        } else if (navigator.userAgent.indexOf("Firefox") > 0 || navigator.userAgent.indexOf("Chrome") > 0) {
          window.location.href = window.location.href;
        } else {
          window.opener = null;
          window.open('', '_self');
        }


        window.close();
      }


      document.onmousedown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        // 设置获取的值
        if (e.button === 3 && length === 1) {
          e.preventDefault(); //阻止默认事件
          setTimeout(closeWebPage,200)

        }

      }
      // Your code here...
    })();