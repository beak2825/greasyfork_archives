// ==UserScript==
// @name Cool Button
// @namespace https://greasyfork.org/users/664021
// @version 0.0.1.20200706153523
// @description This is a cool button style I made! Enjoy!
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/406605/Cool%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/406605/Cool%20Button.meta.js
// ==/UserScript==

(function() {
let css = `.button2 {
    background: none repeat scroll 0 0 rgba(255, 165, 0, 0.7);
    transition: background 0.8s ease 0s;
	border: 0 none;
    color: #fff;
    cursor: pointer;
    font: 300 15px/39px "Open Sans",Helvetica,Arial,sans-serif;
    height: 39px;
    margin: 10px 0 0 20px;
    outline: medium none;
    overflow: hidden;
    padding: 0 25px;
    position: relative;
	display: block;
	float: right;
    text-decoration: none;
}
.button2:hover{
	background: none repeat scroll 0 0 rgba(255, 165, 0, 1);
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
