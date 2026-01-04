// ==UserScript==
// @name daddifier
// @namespace Violentmonkey Scripts
// @author ghostplantss
// @grant none
// @match *://www.tumblr.com/dashboard
// @description replaces "the state" with "daddy"
// @version 1.1
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393321/daddifier.user.js
// @updateURL https://update.greasyfork.org/scripts/393321/daddifier.meta.js
// ==/UserScript==
// 
// 

var state = ["the state", "the nation","France","society","the patrie","the republic","the people","Patria"];
(
  function scroll (f) {
  window.addEventListener("scroll", ( //every time you scroll
  function fun() //it runs this function!
  {
    $("div.post").each(function() //for each post
    { 
      if(!$(this).hasClass('daddifier'))//if it has not already checked the post
       {
         this.className += " daddifier";
          var divs = this.getElementsByTagName('p');
         for(var i = 0; i< divs.length;i++)//it iterates through all paragraphs 
         {
            for(var j = 0; j< state.length;j++)//and iterates through array of synonyms of state
            {
              divs[i].innerHTML= divs[i].innerHTML.replace(state[j], "Daddy");//it replaces all synonyms of state w/ "Daddy"
            }
          }
       }
    });
  }), false);//you're welcome
}

)(window.jQuery);
