// ==UserScript==
// @name         前往GreasyFork
// @namespace    mimiko/greasyfork
// @version      0.0.4
// @description  吧啦吧啦
// @author       Mimiko
// @license      MIT
// @include      *
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/436753/%E5%89%8D%E5%BE%80GreasyFork.user.js
// @updateURL https://update.greasyfork.org/scripts/436753/%E5%89%8D%E5%BE%80GreasyFork.meta.js
// ==/UserScript==
// https://greasyfork.org/zh-CN/scripts/436753-%E5%89%8D%E5%BE%80greasyfork
"use strict";
(() => {
  if (window.top !== window.self) return;
  // function
  const insertHtml = () => {
    const $el = document.createElement("a");
    const href = `https://greasyfork.org/zh-CN/scripts/by-site/${window.location.host
      .split(".")
      .slice(-2)
      .join(".")}?filter_locale=0`;
    const listAttr = [
      ["href", href],
      ["id", "btn-jump-greasyfork"],
      ["rel", "noopener noreferrer"],
      ["target", "_blank"],
    ];
    listAttr.forEach((group) => $el.setAttribute(...group));
    document.body.appendChild($el);
  };
  const insertCss = () => {
    GM.addStyle(`
      #btn-jump-greasyfork {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 65535;
        width: 32px;
        height: 32px;
        background-color: rgb(153, 0, 0);
        border-radius: 0 32px 0 0;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0;
        transform-origin: left bottom;
        transform: scale(0.5);
      }
      #btn-jump-greasyfork:hover {
        opacity: 1;
        transform: scale(1);
      }
    `);
  };
  const main = () => {
    insertCss();
    insertHtml();
  };
  // execute
  main();
})();
