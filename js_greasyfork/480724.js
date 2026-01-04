// ==UserScript==
// @name LightboxModern CSS
// @namespace yu
// @version 1.0
// @description Styling LightboxModern
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/480724/LightboxModern%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/480724/LightboxModern%20CSS.meta.js
// ==/UserScript==

(function() {
let css = `.LightboxModern {
  position: fixed;
  top: 0;
  left: 0;
  background-color: antiquewhite;
  width: 100%;
  height: 100%;
}

.LightboxModern .Progress {
  width: 0%;
  height: 12px;
  background-color: aquamarine;
}

.LightboxModern .ImageWrapper{
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0%;
  transition: opacity .5s ease;
}

.LightboxModern .ImageWrapper.FadeIn {
  opacity: 100%;
}

.LightboxModern .ImageWrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.LightboxModern .ImageWrapper .ImagePadding {
  padding: 20em;
  position: absolute;
  z-index: 10;
} 

.LightboxModern .Swiper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
