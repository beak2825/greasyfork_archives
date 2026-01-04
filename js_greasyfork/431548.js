// ==UserScript==
// @name         USO - fix editor's page height
// @namespace    github.com/Procyon-b
// @version      0.9.5
// @description  Prevent the disappearance of the save button on userstyle.org edit page
// @author       Achernar
// @match        https://userstyles.org/d/styles/*/edit
// @match        https://userstyles.org/styles/update
// @match        https://userstyles.org/d/styles/new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431548/USO%20-%20fix%20editor%27s%20page%20height.user.js
// @updateURL https://update.greasyfork.org/scripts/431548/USO%20-%20fix%20editor%27s%20page%20height.meta.js
// ==/UserScript==

(function() {
"use strict";

if (window === top) return;

if (!document.head.children.length) return;

var TO=0, iframe;

parent.document.querySelectorAll('iframe').forEach(function(w) {if (w.contentWindow === window) iframe=w;});
if (!iframe) return;

function resizeIframe() {
  if (TO) {clearTimeout(TO); TO=0;}
  iframe.style.height=document.body.scrollHeight + 150 + 'px';
}

const obs = new ResizeObserver(function(e){
  if (TO) {clearTimeout(TO);}
  TO=setTimeout(resizeIframe,200);
  });

obs.observe(document.body);

})();