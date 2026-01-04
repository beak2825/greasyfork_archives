// ==UserScript==
// @name        New script - mobx.js.org
// @namespace   Violentmonkey Scripts
// @match       https://mobx.js.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 9/7/2020, 3:28:31 PM
// @downloadURL https://update.greasyfork.org/scripts/410963/New%20script%20-%20mobxjsorg.user.js
// @updateURL https://update.greasyfork.org/scripts/410963/New%20script%20-%20mobxjsorg.meta.js
// ==/UserScript==

const style = document.createElement("style");

style.innerText = `nav.slidingNav::before{
  content: "All Black Lives Matter"
}`;

document.documentElement.append(style);