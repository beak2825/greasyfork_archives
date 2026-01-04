// ==UserScript==
// @name         大字无红点宽带山kdsLife
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Custom CSS for any page under kdsLife.com
// @author       YourName
// @match        https://*kdslife.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526949/%E5%A4%A7%E5%AD%97%E6%97%A0%E7%BA%A2%E7%82%B9%E5%AE%BD%E5%B8%A6%E5%B1%B1kdsLife.user.js
// @updateURL https://update.greasyfork.org/scripts/526949/%E5%A4%A7%E5%AD%97%E6%97%A0%E7%BA%A2%E7%82%B9%E5%AE%BD%E5%B8%A6%E5%B1%B1kdsLife.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var style = document.createElement('style');
  style.innerHTML = `
    span.n3 { width: 550px; }
    span.n3 a { font-size: 22px; letter-spacing: -1px; }
    span.n6 { display: none; }
    span.n8 { display: none; }
    .main_List li.i2 { padding-top: 8px; padding-bottom: 8px; }
    .kds_main {}
    .detail-content p { font-size: 26px; line-height: 1.8; }
    body { background: #2a81be !important; }
    #login-btn16 a b, .showTH2 a span, .showTH a span {
      transition: .3s;
      opacity: 0;
    }
    #login-btn16 a b:hover, .showTH2:hover a span, .showTH a span:hover {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
})();