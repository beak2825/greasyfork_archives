// ==UserScript==
// @name          nfart
// @namespace     http:/penple.org/
// @description	  Turns all text on page to Fart 
// @include       *
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/19330/nfart.user.js
// @updateURL https://update.greasyfork.org/scripts/19330/nfart.meta.js
// ==/UserScript==

var words=['Fart ','fart ','FART! ','Fart! ','Fart. ','FaRt ','fart. ','f-fart? ','Fart? ','fart? ','FART?! '];function groot(node){if(node.nodeType===Node.TEXT_NODE){var text=node.textContent;var iam=text.replace(/\b(\w\S*\s?){1,3}/ig,function(){var idx=Math.floor(Math.random()*words.length);return words[idx];});node.textContent=iam;return;}else if(node.nodeType===Node.ELEMENT_NODE){for(var i=0;i<node.childNodes.length;++i){groot(node.childNodes[i]);}return;}else{return;}}groot(document.body);