
// ==UserScript==
// @name         rmReactAid
// @author       gyk
// @description  去除https://react.dev/顶部的乌克兰援助
// @match        https://react.dev/
// @grant        none
// @license MIT
// @version 0.0.1.20231001013950
// @namespace https://greasyfork.org/users/302901
// @downloadURL https://update.greasyfork.org/scripts/476468/rmReactAid.user.js
// @updateURL https://update.greasyfork.org/scripts/476468/rmReactAid.meta.js
// ==/UserScript==


// 去除https://react.dev/顶部的乌克兰援助
document.getElementById("__next").firstChild.style.display="none"