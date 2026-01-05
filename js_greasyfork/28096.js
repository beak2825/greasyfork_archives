// ==UserScript==
// @name       Download Soundgasm Links
// @description  show source mp4
// @match      https://soundgasm.net/u/*/*
// @version 0.4
// @namespace https://greasyfork.org/users/13662
// @downloadURL https://update.greasyfork.org/scripts/28096/Download%20Soundgasm%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/28096/Download%20Soundgasm%20Links.meta.js
// ==/UserScript==

//NAME
var url = window.location.href;
var urla = url.indexOf('/u/')+3;
var urlb = url.indexOf('/',urla);
var filename = url.substr(urla,urlb-urla) +" - "; 
//var filename = document.getElementsByTagName('a')[5].innerHTML + " - ";

//TITLE
filename += document.getElementsByClassName('jp-title')[0].firstElementChild.firstElementChild.innerHTML;
filename = filename.substr(0,140)+".m4a";


//LINK
var html = document.documentElement.innerHTML;
var searchstring = 'm4a: "';
var pos = html.indexOf(searchstring)+6;
var endpos = html.indexOf('"', pos);
var link = html.substr(pos, endpos-pos);

var linknode = document.createElement("a");
var linktext = document.createTextNode("download "+filename);
linknode.setAttribute('href',link);
linknode.setAttribute('download',filename);
linknode.appendChild(linktext);

var body = document.getElementsByTagName('body')[0];
body.appendChild(linknode);