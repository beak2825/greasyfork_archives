// ==UserScript==
// @name       Download Soundgasm Links
// @description  show source mp4
// @match      https://soundgasm.net/u/*/*
// @version 0.0.1.20170312174406
// @namespace https://greasyfork.org/users/109501
// @downloadURL https://update.greasyfork.org/scripts/28095/Download%20Soundgasm%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/28095/Download%20Soundgasm%20Links.meta.js
// ==/UserScript==


var html = document.documentElement.innerHTML;
var searchstring = 'm4a: "';
var pos = html.indexOf(searchstring)+6;
var endpos = html.indexOf('"', pos);
var link = html.substr(pos, endpos-pos);

var linknode = document.createElement("a");
var linktext = document.createTextNode("DOWNLOAD!");
linknode.setAttribute('href',link);
linknode.appendChild(linktext);

var body = document.getElementsByTagName('body')[0];
body.appendChild(linknode);