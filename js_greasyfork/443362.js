// ==UserScript==
// @author            ymzhao
// @name              mini滚动条
// @description       简单的mini滚动条
// @version           0.0.2
// @include           *
// @grant             GM_addStyle
// @run-at            document-start
// @namespace https://greasyfork.org/users/703945
// @downloadURL https://update.greasyfork.org/scripts/443362/mini%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/443362/mini%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==

;
(function () {
  'use strict'
 
  const css = `
    ::-webkit-scrollbar-track-piece {background: #efefef;}
    
    ::-webkit-scrollbar{
      width: 10px !important;
      height: 10px !important;
      background:transparent;
    }
    ::-webkit-scrollbar:hover {background: rgba(128, 128, 128, 0.2);}
    ::-webkit-scrollbar-thumb {
      border: 1px solid rgba(255, 255, 255, 0.4) !important;
      background-color: rgba(144,147,153,.3) !important;
      z-index: 2147483647;
      border-radius: 12px;
      -webkit-border-radius: 12px;
      background-clip: content-box;
      transition: .3s background-color;
      cursor: pointer;
    }
    ::-webkit-scrollbar-corner {
      background: rgba(255, 255, 255, 0.3);
      border: 1px solid transparent
    }
    ::-webkit-scrollbar-thumb:hover {background-color: rgba(144,147,153,.5) !important;}
    ::-webkit-scrollbar-thumb:active {background-color: rgba(144,147,153,.4) !important}
    ::-webkit-scrollbar-corner {background-color: rgba(144,147,153,.15) !important;}
    `
  GM_addStyle(css)
})();