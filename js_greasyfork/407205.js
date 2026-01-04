// ==UserScript==
// @name Mastodon 去除猫耳
// @namespace ca.o3o.mastodon-remove-cat-ears
// @version 1.0.0
// @description Add cat ears to user avatars
// @author O3O
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/407205/Mastodon%20%E5%8E%BB%E9%99%A4%E7%8C%AB%E8%80%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/407205/Mastodon%20%E5%8E%BB%E9%99%A4%E7%8C%AB%E8%80%B3.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `@-moz-document domain("o3o.ca"), domain("alive.bar"), domain("nebula.moe"), domain("slashine.onl"), domain("wxw.moe") {
    



/* 去除猫耳 */

.status__avatar::before {
  opacity: 0;
}

.status__avatar::after {
  opacity: 0;
}

.status__avatar:hover::before {
  opacity: 0;
}

.status__avatar:hover::after {
  opacity: 0;
}

.account__avatar {
  border-radius: 0%;
  z-index: 1;
}

}`;
if ((location.hostname === "o3o.ca" || location.hostname.endsWith(".o3o.ca")) || (location.hostname === "alive.bar" || location.hostname.endsWith(".alive.bar")) || (location.hostname === "nebula.moe" || location.hostname.endsWith(".nebula.moe")) || (location.hostname === "slashine.onl" || location.hostname.endsWith(".slashine.onl")) || (location.hostname === "wxw.moe" || location.hostname.endsWith(".wxw.moe"))) {
  css += `
      



  /* 去除猫耳 */

  .status__avatar::before {
    opacity: 0;
  }

  .status__avatar::after {
    opacity: 0;
  }

  .status__avatar:hover::before {
    opacity: 0;
  }

  .status__avatar:hover::after {
    opacity: 0;
  }

  .account__avatar {
    border-radius: 0%;
    z-index: 1;
  }

  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
