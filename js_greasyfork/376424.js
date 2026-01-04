// ==UserScript==
// @name     JAVBUS JUMPER
// @version  1
// @grant    none
// @include  https://www.javbus.us/*
// @exclude  https://www.javbus.us/
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description Add a link to go to avgle based on jav code.
// @namespace https://greasyfork.org/users/237812
// @downloadURL https://update.greasyfork.org/scripts/376424/JAVBUS%20JUMPER.user.js
// @updateURL https://update.greasyfork.org/scripts/376424/JAVBUS%20JUMPER.meta.js
// ==/UserScript==
(function() {
    'use strict';

     $(document).ready(function() {
     var movie_code = document.URL.replace("https://www.javbus.us/","");
     var a = $("<a></a>").attr("href","https://avgle.com/search/videos?search_query=".concat(movie_code)).text("Go to avgle");
     $("span[style*='color:#CC0000']").after(a);
  });
})();