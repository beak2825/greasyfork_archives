// ==UserScript==
// @name         OWO
// @namespace    
// @version      1s
// @description  OWO?
// @author       Eutro
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401645/OWO.user.js
// @updateURL https://update.greasyfork.org/scripts/401645/OWO.meta.js
// ==/UserScript==

var node, walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);while(node = walker.nextNode()) node.nodeValue = node.nodeValue.replace(/[lr]/g, "w").replace(/[LR]/g, "W").replace(/(\w|^)s(\W|$)/g, "$1th$2").replace(/([nNmM])([ao])/g, "$1y$2").replace(/( |^)(\w)/g, function (g0, g1, g2) { return Math.random() < 0.15? g1+g2+"-"+g2 : g0 });