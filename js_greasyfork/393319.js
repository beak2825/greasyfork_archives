// ==UserScript==
// @name        autoliker
// @namespace   Violentmonkey Scripts
// @match       *://www.tumblr.com/dashboard
// @grant       none
// @version     1.0
// @author      ghostplantss
// @description 12/4/2019, 1:00:36 AM
// @downloadURL https://update.greasyfork.org/scripts/393319/autoliker.user.js
// @updateURL https://update.greasyfork.org/scripts/393319/autoliker.meta.js
// ==/UserScript==

(
  function scroll (f) {
  var count = 0;
  window.addEventListener("scroll", ( //every time you scroll
  function fun() //it runs this function!
  {
    count++;
    $("div.like").each(function() //it finds the like button
    { 
      if(!$(this).hasClass("liked") )   //if the post is not yet liked
      {
        this.click();//it clicks the button!
      }                                  
    });
  }), false);//the end
}

)(window.jQuery);