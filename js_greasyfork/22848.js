// ==UserScript==
// @name        Fancy Local Directories
// @namespace   tag:rokdun@yahoo.fr,2016-09-02:FancyDir
// @description Generate more useful file:// index, to have the base name as the title
// @include     file://*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22848/Fancy%20Local%20Directories.user.js
// @updateURL https://update.greasyfork.org/scripts/22848/Fancy%20Local%20Directories.meta.js
// ==/UserScript==

var oldTitle=document.title;

if (oldTitle.search(/^Index of file:\/\//) != -1) {
  var newTitle=oldTitle;
  newTitle=newTitle.replace(/\/+$/,"");
  newTitle=newTitle.replace(/^.*\//,"");
  oldTitle=oldTitle.replace(/^Index of file:\/\//,"");
  newTitle=newTitle + " DIR " + oldTitle;
  document.title=newTitle;
  
} else if (oldTitle.search(/^file:\/\//) != -1) {
  var newTitle=oldTitle;
  newTitle=newTitle.replace(/^.*\//,"");
  oldTitle=oldTitle.replace(/^file:\/\//,"");
  newTitle=newTitle + " FILE " + oldTitle;
  document.title=newTitle;
  
} else if (document.title=="") {
  var path=window.location.pathname;
  var newTitle=path;
  newTitle=newTitle.replace(/^.*\//,"");
  document.title=newTitle + " FILE " + path;
}