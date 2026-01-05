// ==UserScript==
// @name       God-to-GabeN
// @namespace  /u/alien_from_Europa 
// @version    3.3
// @description  Replaces God with GabeN :) based on /u/killeri404's Console-to-Potato script 
// @copyright  /r/pcmasterrace
// @include *
// @downloadURL https://update.greasyfork.org/scripts/2432/God-to-GabeN.user.js
// @updateURL https://update.greasyfork.org/scripts/2432/God-to-GabeN.meta.js
// ==/UserScript==
(function() {
var replacements, regex, key, textnodes, node, s;
textnodes = document.evaluate( "//body//text()", document, null,
XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = 0; i < textnodes.snapshotLength; i++) {
node = textnodes.snapshotItem(i);
if(node != null && node.nodeName == '#text' && /\S/.test(node.nodeValue))
{

s = node.data;

s = s.replace( /\bgod\b/g, "GabeN");
s = s.replace( /\bGod\b/g, "GabeN");
s = s.replace( /\bgods\b/g, "GabeNs");
s = s.replace( /\bGods\b/g, "GabeNs");
node.data = s;

}} })();