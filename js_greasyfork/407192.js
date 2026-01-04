// ==UserScript==
// @name Mastodon 猫耳
// @namespace ca.o3o.mastodon-cat-ears
// @version 1.0.0
// @description Add cat ears to user avatars
// @author Unknown
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/407192/Mastodon%20%E7%8C%AB%E8%80%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/407192/Mastodon%20%E7%8C%AB%E8%80%B3.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `@-moz-document domain("o3o.ca"), domain("m.cmx.im") {
    



/* 猫耳 */

.notification .status__avatar::before,
.notification .status__avatar::after {
  display: none !important;
}

.status__wrapper .status:first-child .status__avatar::before,
.status__wrapper .status:first-child .status__avatar::after {
  content: "";
  display: inline-block;
  border: 4px solid;
  box-sizing: border-box;
  width: 50%;
  height: 50%;
  background-color: inherit;
  border-color: inherit;
  position: absolute;
  z-index: 0;
}

.status__avatar::before {
  border-radius: 75% 0 75% 75%;
  transform: rotate(-37.6deg) skew(-30deg);
  top: 0;
  bottom: 0;
  right: 0;
}

.status__avatar::after {
  border-radius: 0 75% 75%;
  transform: rotate(37.6deg) skew(30deg);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.account__avatar {
  border-radius: 100%;
  z-index: 1;
}

.status__avatar:hover::before {
  animation: earwiggleright 1s infinite;
}

.status__avatar:hover::after {
  animation: earwiggleleft 1s infinite;
}

@keyframes earwiggleleft {
  from { transform: rotate(37.6deg) skew(30deg); }
  25% { transform: rotate(10deg) skew(30deg); }
  50% { transform: rotate(20deg) skew(30deg); }
  75% { transform: rotate(0deg) skew(30deg); }
  to { transform: rotate(37.6deg) skew(30deg); }
}

@keyframes earwiggleright {
  from { transform: rotate(-37.6deg) skew(-30deg); }
  30% { transform: rotate(-10deg) skew(-30deg); }
  55% { transform: rotate(-20deg) skew(-30deg); }
  75% { transform: rotate(-0deg) skew(-30deg); }
  to { transform: rotate(-37.6deg) skew(-30deg); }
}




}`;
if ((location.hostname === "o3o.ca" || location.hostname.endsWith(".o3o.ca")) || (location.hostname === "m.cmx.im" || location.hostname.endsWith(".m.cmx.im"))) {
  css += `
      



  /* 猫耳 */

  .notification .status__avatar::before,
  .notification .status__avatar::after {
    display: none !important;
  }

  .status__wrapper .status:first-child .status__avatar::before,
  .status__wrapper .status:first-child .status__avatar::after {
    content: "";
    display: inline-block;
    border: 4px solid;
    box-sizing: border-box;
    width: 50%;
    height: 50%;
    background-color: inherit;
    border-color: inherit;
    position: absolute;
    z-index: 0;
  }

  .status__avatar::before {
    border-radius: 75% 0 75% 75%;
    transform: rotate(-37.6deg) skew(-30deg);
    top: 0;
    bottom: 0;
    right: 0;
  }

  .status__avatar::after {
    border-radius: 0 75% 75%;
    transform: rotate(37.6deg) skew(30deg);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .account__avatar {
    border-radius: 100%;
    z-index: 1;
  }

  .status__avatar:hover::before {
    animation: earwiggleright 1s infinite;
  }

  .status__avatar:hover::after {
    animation: earwiggleleft 1s infinite;
  }

  @keyframes earwiggleleft {
    from { transform: rotate(37.6deg) skew(30deg); }
    25% { transform: rotate(10deg) skew(30deg); }
    50% { transform: rotate(20deg) skew(30deg); }
    75% { transform: rotate(0deg) skew(30deg); }
    to { transform: rotate(37.6deg) skew(30deg); }
  }

  @keyframes earwiggleright {
    from { transform: rotate(-37.6deg) skew(-30deg); }
    30% { transform: rotate(-10deg) skew(-30deg); }
    55% { transform: rotate(-20deg) skew(-30deg); }
    75% { transform: rotate(-0deg) skew(-30deg); }
    to { transform: rotate(-37.6deg) skew(-30deg); }
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
