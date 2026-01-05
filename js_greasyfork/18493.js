// ==UserScript==
// @name blogmasker
// @version 1.01
// @namespace http://www.justmyimagination.com
// @description Shows visitors a black void
// @include http://user.adme.in/blog/browse/u/*
// @include http://user.adme.in/*
// @copyright � JustMyImagination 2015
// @downloadURL https://update.greasyfork.org/scripts/18493/blogmasker.user.js
// @updateURL https://update.greasyfork.org/scripts/18493/blogmasker.meta.js
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];
var cssNode = document.createElement('style');
cssNode.type = 'text/css';
cssNode.innerHTML ='body { display: inline;}';
headID.appendChild(cssNode);