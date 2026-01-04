// ==UserScript==
// @name         csdn_plus
// @namespace    https://github.com/qgning/tampermonkey_csdn_plus
// @version      0.0.5
// @author       gning
// @description  CSDN免登录,保持文本原有格式复制,展开折叠的代码,展开需要关注博主阅读全文的内容
// @license      BSD
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACoElEQVRYR+2UT2hcVRTGf99LTEGki/x5nRmrjTNDpqaUQoKO4kYQQcRFCzaLWIWKhYLYRRctdNNk1xYRSopYFFxokVriJhaLiN2kQgJuQiN2nBknEH3JpCmUYrWYeV950xRsKd1JN++uDufce853fvfcKx7x0iOuTyogJZASSAmkBO4hcHlwsOvGzTgXmKy9dr2ri5WhanXl//yu2wJ+ym/d3hGzFxgFb/pvwXLjioqZzKDxfsslwQ7gcSACmrInLJ1dP7NkWMBcaK3FpxeuXo2K3d0bvaHzPGIjpgfoNsxJPlP7c2VCM/mtbyj2aUMO+F5mzvIlSU9gb36+UTlWyIaXgW2Gc5hf2slgs3Af1reID23GEUXBc8AAMC8HI2tws0Px78A/hsnAumW5fDefZraUvkbsBn9VblRGH4Q7nw1XdUf5uQCmgo7Wj5XF1T+SvYVs30nQAcOeetQ8k/jymXBM4ijWKan1uQl+Fvq1Gi0/m8SLmd6XreBiYmumv+TEiPH4i43K2AMFZPpel7QT2AX0AteNPq5Hy0cK2fCbxN+K9UJjeXnmvgIXbE9IOg/8UIuar94X/1uzz5SmbV7CfFFeuPLOwwaumMn0Qbzb4l1gWPaIpcOJfaujq2dxcfHaHSphgrwf+YAddAp/JJisRs031+NJI4nwec1uKb1l8WUbB9SM5rCrEqWWg/E9/65+QEw3YskmksgDb7eF2nuRjgNhewbwkNAwIpdcVz1qjuRz4SmZ98Gf1aKVfW0C2U3vGX9qe6r9CmafHnjFgZIXUAblDdcEC491tnaO/HXjoB33Iw0BTyF+w8zbVOpLzbFCNpwGnmx3DA1ww+hsPWp+st7td8BrmBO1pWZCi0IuPIQ5Dj6Z/oQpgZRASiAlkBK4DZtvGMy5535NAAAAAElFTkSuQmCC
// @supportURL   https://github.com/qgning/tampermonkey_csdn_plus
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/471520/csdn_plus.user.js
// @updateURL https://update.greasyfork.org/scripts/471520/csdn_plus.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  async function main() {
    var _a, _b, _c, _d;
    function style_selectable(selector) {
      return selector + " {    -webkit-touch-callout: auto;    -webkit-user-select: auto;    -khtml-user-select: auto;    -moz-user-select: auto;    -ms-user-select: auto;    user-select: auto;    !important;  }";
    }
    _GM_addStyle(
      style_selectable("#content_views") + style_selectable("#content_views pre") + style_selectable("#content_views pre code")
    );
    let contentEl = document.querySelector("main .blog-content-box");
    (_a = contentEl == null ? void 0 : contentEl.parentNode) == null ? void 0 : _a.replaceChild(contentEl.cloneNode(true), contentEl);
    (_b = document.querySelectorAll(".pre-numbering")) == null ? void 0 : _b.forEach((e) => e.removeAttribute("style"));
    document.querySelectorAll(".set-code-hide").forEach((e) => e.classList.replace("set-code-hide", "set-code-show"));
    document.querySelectorAll(".hide-preCode-box").forEach((e) => e.remove());
    let copy_buttons = document.getElementsByClassName("hljs-button");
    for (let i = 0; i < copy_buttons.length; i++) {
      copy_buttons[i].setAttribute("data-title", "Copy code");
      copy_buttons[i].removeAttribute("onclick");
      let timerid = void 0;
      copy_buttons[i].addEventListener("click", (event) => {
        let button = copy_buttons[i];
        clearTimeout(timerid);
        event.stopPropagation();
        _GM_setClipboard(button.parentNode.innerText, "text");
        button.setAttribute("data-title", "Copied!");
        timerid = setTimeout(() => {
          button.setAttribute("data-title", "Copy code");
        }, 1e3);
      });
    }
    (_c = document.getElementById("article_content")) == null ? void 0 : _c.removeAttribute("style");
    (_d = document.getElementsByClassName("hide-article-box")[0]) == null ? void 0 : _d.remove();
  }
  main().catch((err) => {
    console.error(err);
  });

})();
