// ==UserScript==
// @name         webvpnQuickPortal
// @namespace    http://tampermonkey.net/
// @version      2024-08-11
// @description  use for hitwh
// @author       isyuah
// @match        https://webvpn.hitwh.edu.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitwh.edu.cn
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/503288/webvpnQuickPortal.user.js
// @updateURL https://update.greasyfork.org/scripts/503288/webvpnQuickPortal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.addEventListener("load", ()=> {
      unsafeWindow.quickPortal = function() {
        let uuurl = $("#quickLoadToYu")[0].value
        let urlDataset = new URL(uuurl)
        unsafeWindow.open(encrypUrl(urlDataset.protocol.split(":")[0], uuurl.replace(urlDataset.protocol + "//", "")))
      }
      let a = setInterval(function() {
          if ($('#history').length) {
            const newNode = $('<div id=yuToolBar_quickPortal><input placeholder="请输入完整链接(带http://的这种)" id="quickLoadToYu" /><button id="quickPortalBtn" onclick="quickPortal()">快速跳转</button></div>');
            newNode.insertBefore($('#history')[0]);
            clearInterval(a);
              GM_addStyle(`
              #yuToolBar_quickPortal {
                font-size: 14px;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 40px 40px 0 40px;
              }
            #quickLoadToYu {
              flex: 1;
              padding: 5px 10px;
              margin-right: 10px;
            }
            #quickPortalBtn {
              font-size: 14px;
              padding: 5px 10px;
              outline: none;
              background-color: #fff;
              cursor: pointer;
              border: 1px solid #61666D;
              transition: background-color .3s;
            }
            #quickPortalBtn:hover {background-color: #f2f3f5;}
            #history {
              padding-top: 20px;
            }
            `);
          }
      }, 100);
    })
})();