// ==UserScript==
// @name RNT's css
// @namespace https:gist.github.com/iChickn/957071d79fbf5f8ee8af0b89ee7361a9/raw
// @version 0.0.1
// @description NA
// @author iChickn
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/469381/RNT%27s%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/469381/RNT%27s%20css.meta.js
// ==/UserScript==

(function() {
let css = `.position-relative {
  position: relative;
}

.position-relative .form-control {
    padding-right: 23px;
}

textarea {
  resize: none;
}

/* Replace box */
#replace-box {
  width: 250px;
  display: block;
  position: relative;
  padding: 0 15px 15px 15px;
  border-color: #e5e5e5 #eee #eee;
  border-style: solid;
  border-width: 1px 0;
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, .05);
  background-color: #2798A1;
  border-radius: 6px;
}

.main-box .row:not(:first-child) {
  margin-top: 5px;
}

.case-sensitive {
  position: absolute;
  right: 23px;
  top: 8px;
  cursor: pointer;
}

/* Setting box */
#setting-box {
  width: 390px;
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 15px 15px 15px;
  border-color: #e5e5e5 #eee #eee;
  border-style: solid;
  border-width: 1px 0;
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, .05);
  background-color: #2798A1;
  border-radius: 6px;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
