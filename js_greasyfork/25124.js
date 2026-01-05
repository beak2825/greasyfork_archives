// ==UserScript==
// @name add rel=noreferrer noopener to voat
// @description:en add rel=noreferrer noopener to voat links
// @namespace https://voat.co/u/pembo210
// @author pembo210
// @match https://*.voat.co/*
// @match https://voat.co/*
// @grant none
// @version 0.2
// @description add rel=noreferrer noopener to voat links
// @downloadURL https://update.greasyfork.org/scripts/25124/add%20rel%3Dnoreferrer%20noopener%20to%20voat.user.js
// @updateURL https://update.greasyfork.org/scripts/25124/add%20rel%3Dnoreferrer%20noopener%20to%20voat.meta.js
// ==/UserScript==

var a_col = document.getElementsByTagName('a');
for(var i = 0; i < a_col.length; i++) {
    a = a_col[i];
    var att = document.createAttribute("rel");
    att.value = "noreferrer noopener nofollow";
    a.setAttributeNode(att);
}