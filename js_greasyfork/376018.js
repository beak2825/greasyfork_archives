// ==UserScript==
// @name          Google Knowledge Panel Permanent Opacity 
// @namespace      
// @description   Set Google Search Knowledge Panel to be constantly opaque 
// @include        /^https?:\/\/www\.google\.com\/search\?.*q=.*$/
// @version 0.0.1.20181227105018
// @downloadURL https://update.greasyfork.org/scripts/376018/Google%20Knowledge%20Panel%20Permanent%20Opacity.user.js
// @updateURL https://update.greasyfork.org/scripts/376018/Google%20Knowledge%20Panel%20Permanent%20Opacity.meta.js
// ==/UserScript==

e=document.querySelector("div.g.rhsvw")
e.style.opacity=100