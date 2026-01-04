// ==UserScript==
// @name        个性滚动条
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  网页滚动条美化
// @author       wuyupei
// @match         *://*/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430679/%E4%B8%AA%E6%80%A7%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/430679/%E4%B8%AA%E6%80%A7%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==
 
(function() {
const MyScrollBar = document.createElement('div')
MyScrollBar.innerHTML =
    `
       <style>
            ::-webkit-scrollbar {
                background-color: #fff;
                width: 6px;
                overflow: visible;
            }
            ::-webkit-scrollbar-thumb {
                background-color: #2474b5;
                border-radius: 0;
            }
            ::-webkit-scrollbar-button {
                background-color: #2474b5;
                width:16px;
                height:16px;
                border-radius:50%;
            }
            ::-webkit-scrollbar-corner {
                background-color: black;
            }
        </style>
     `
document.body.appendChild(MyScrollBar)
 
})(document);