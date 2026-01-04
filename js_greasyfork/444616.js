// ==UserScript==
// @name         记录账号和密码
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  记录账号和密码,ctrl+x让窗口显示，可以把自己经常用的密码和账号写进去。应该只适用于测试或者开发测试系统的时候使用
// @match        *://*/*
// @author       xiaoxiami
// @grant        GM_addStyle
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444616/%E8%AE%B0%E5%BD%95%E8%B4%A6%E5%8F%B7%E5%92%8C%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/444616/%E8%AE%B0%E5%BD%95%E8%B4%A6%E5%8F%B7%E5%92%8C%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //创建一个div
	var div = document.createElement("textarea");
    div.innerText="账号:admin 密码:111"
	//为div创建属性class = "jizhuUserNameAndPassword"
	var divattr = document.createAttribute("class");
	divattr.value = "jizhuUserNameAndPassword";
	//把属性class = "jizhuUserNameAndPassword"添加到div
    div.setAttributeNode(divattr);
    document.body.appendChild(div);


    unsafeWindow.onkeydown = function (e) {
        if (e.ctrlKey && e.key == "x") {
            if (div.style.display == "block") {
            div.style.display = "none";
            } else {
            div.style.display = "block";
            }
        }
    };


})();
GM_addStyle(`
  .jizhuUserNameAndPassword {
       display:none;
       position: absolute;
       top: 0vh;
       right: 10vw;
       background: skyblue;
       width: 220px;
       height: 200px;
       z-index:999;
  }
`)