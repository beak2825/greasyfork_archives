// ==UserScript==
// @name         ShowThecookie
// @name:zh-ja   ワンクリックでウェブサイトの Cookie を取得
// @namespace    https://www.techwb.cn/177.html
// @version      1.0.0
// @description  Get the cookie of the current web page with one click, and automatically release it and set it on the clipboard, which can be directly pasted and used (the get button is located in the lower left corner of the page).
// @description:ja     现在の Web ページの Cookie をワンクリックで取得でき、取得ボタンの位置は左下隅にあり、ボタンをクリックすると、现在のページの Cookie がクリップボードに置かれます.
// @author       szdamai
// @match        *://*/*
// @icon         https://www.techwb.cn/CK100.png
// @grant        GM_setClipboard
// @license  none
// @downloadURL https://update.greasyfork.org/scripts/506396/ShowThecookie.user.js
// @updateURL https://update.greasyfork.org/scripts/506396/ShowThecookie.meta.js
// ==/UserScript==

(function() {
    'use strict';

  // Your code here...

  let Container = document.createElement("div");
  Container.id = "getcookie";
  Container.style.position = "fixed";
  Container.style.color = "red";
  Container.style.left="5px"
  // Container.style.right="0px" // 默认靠左边，靠右请去掉注释;
  Container.style.top = "80%"; // 垂直方向位置，可自定义；
  Container.style["z-index"] = "999999";
  Container.innerHTML = `
<div style="padding: 0px; border: 1px solid #aaa; border-radius: 21px; float: right; background: #fff; position: relative; ">
<button id="getcookie"
 style="background-image:url(https://XXX.jpg);
 padding: 6px;
 width: auto;
 height: auto;
 background-repeat:no-repeat;
 background-size:62px;
 border:0;
 background-color:transparent;
 background:red;
 border-radius:21px;
 color:#fff;
 font-size:10px;
 text-align:center;">CK</button>

</div>
`;
  /* ---按钮上方提示---
<div style="position: absolute;
    width: 65px;
    text-align: center;
    top: -21px;
    left: 0px;
    color: #ff8000;
    font-weight: bold;
    font-size: 14px;
    text-shadow: #fff 1px 0 0, #fff 0 1px 0, #fff -1px 0 0, #fff 0 -1px 0;">获取网站(${btn.btname})
</div>
---/按钮上方提示---
*/

  document.body.appendChild(Container);
  var b;
  var current_cookies;
  b = document.getElementById("getcookie");
  b.onclick = function () {
      current_cookies = document.cookie;
      const rootDomain = getRootDomain(window.location.hostname);
      var json = current_cookies.split('; ').map(cookie => {
        const [name, value] = cookie.split('=');
        return {
            domain: `.${rootDomain}`,
            expirationDate: 1861920000,
            hostOnly: false,
            httpOnly: false,
            name: name,
            path: '/',
            sameSite: 'Lax', // Adjust as necessary
            secure: false,
            session: false,
            storeId: null,
            value: value
        };
      });
      var jsonStr = JSON.stringify(json, null, 2);
      document.title = "Cookie exported";
      document.body.innerHTML = `<div style="margin: 10px; text-align: center"><button id="ck-copy" style="background: green; color: white; font-size: 20px">Copy Cookie</button></div><textarea id="ck-area" style="user-select: auto;width: 90vw;height: 90vh; display: block; margin-left: auto; margin-right: auto">${jsonStr}</textarea>`;
      GM_setClipboard(jsonStr);
      document.getElementById("ck-copy").onclick = function () {
          document.getElementById('ck-area').select();
          document.getElementById('ck-area').setSelectionRange(0, 99999);
          navigator.clipboard.writeText(jsonStr)
      }
    return;
  };
    function getRootDomain(hostname) {
        const parts = hostname.split('.');
        if (parts.length > 2) {
            // Handle subdomains by returning the last two parts (e.g., "example.com")
            return parts.slice(-2).join('.');
        }
        return hostname; // No subdomain, return as is
    }
})();
