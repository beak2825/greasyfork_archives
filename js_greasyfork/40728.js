// ==UserScript==
// @name         食品伙伴网
// @namespace    http://greasyfork.org/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://down.foodmate.net/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/40728/%E9%A3%9F%E5%93%81%E4%BC%99%E4%BC%B4%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/40728/%E9%A3%9F%E5%93%81%E4%BC%99%E4%BC%B4%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';



  $(".bzmc a").each(function(){
      var urls=this.href.split("/").pop().replace(".html","");
      var titles=this.title.replace("/","_");
      $(this).parents().next(".bzrq").text(titles);

  $(this).attr('href',"http://down.foodmate.net/standard/down.php?auth="+urls);



  });

    // Your code here...
})();