// ==UserScript==
// @name     Great Course
// @description Hide readed article
// @include    https://www.thegreatcoursesplus.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @version 0.0.1.20161031142838
// @namespace https://greasyfork.org/users/38384
// @downloadURL https://update.greasyfork.org/scripts/382032/Great%20Course.user.js
// @updateURL https://update.greasyfork.org/scripts/382032/Great%20Course.meta.js
// ==/UserScript==

 $(function() {
  debugger;
   var s = $("video").attr("src");
   var x = $(".lecture-top h1");
   
   x.append("<a href='" + s +"'>Save</a>");
   
  });