// ==UserScript==
// @name         Chat Mfweb Beautify
// @namespace    https://gist.github.com/Nyaasu66/9cfffb9431b4e5440f4b92a0ae9ef4bd
// @version      0.1.3
// @description  为 chat.mfweb.top 提供美化样式的脚本
// @author       Nyaasu66
// @match        https://chat.mfweb.top/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mfweb.top
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/487672/Chat%20Mfweb%20Beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/487672/Chat%20Mfweb%20Beautify.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // add some style to class css-1i6ejgd
  const style = document.createElement("style");
  style.innerHTML = `
  .MuiTypography-root.MuiTypography-body2.MuiTypography-noWrap.MuiListItemText-primary,
  .MuiTypography-root.MuiTypography-body2.MuiListItemText-secondary {
      font-size: 12px;
    }
    .MuiCard-root {
      transform: scale(0.85);
    }
    .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular {
      min-height: 40px;
    }
    .MuiDrawer-root > .MuiDrawer-paper {
      margin-top: 40px;
      height: calc(100% - 40px);
    }
    header.MuiPaper-root {
      background-color: #202123;
    }
    .MuiList-root::-webkit-scrollbar-thumb {
      background-color: #ececf1;
      border-radius: 30px;
    }
    .MuiList-root::-webkit-scrollbar-track {
      background-color: transparent;
    }
    #root > .MuiStack-root > .MuiDrawer-docked > .MuiPaper-root > .MuiList-root {
      overflow: hidden;
    }
    .MuiStack-root {
      font-size: 14px;
    }
    .MuiFormControl-root.MuiFormControl-fullWidth {
      width: 60%;
      margin: 0 auto;
    }
  `;
  document.head.appendChild(style);

  window.onload = function () {
    document.querySelector(".MuiTypography-h6").innerHTML = "ChatGPT";
    const elem = document.querySelector(".MuiList-root");
    elem.addEventListener("mouseenter", () => {
      elem.style.overflow = "auto";
    });
    elem.addEventListener("mouseleave", () => {
      elem.style.overflow = "hidden";
    });

    document.title = "ChatGPT";
  };
})();
