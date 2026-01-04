// ==UserScript==
// @name everyone is robespierre
// @namespace Violentmonkey Scripts
// @author ghostplantss
// @grant none
// @match *://www.tumblr.com/*
// @description turns everyone's avatars into robespierre
// @version 1.1
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393329/everyone%20is%20robespierre.user.js
// @updateURL https://update.greasyfork.org/scripts/393329/everyone%20is%20robespierre.meta.js
// ==/UserScript==
// 
// 

(
  function scroll (f) {
  var count = 0;
  window.addEventListener("scroll", ( //every time you scroll
  function fun() //it runs this function!
  {
    $('.post_avatar_link').each(function(i) {
    this.style.backgroundImage="url('http://1.bp.blogspot.com/-4hQikqwr-Z8/Ves0Kr8f6TI/AAAAAAAAB1A/MB9k7bzWDbc/s1600/robespierre.jpg')";
    });
    
          $("div.post").each(function() 
       { 
          if(!$(this).hasClass('checked'))
           {
             this.className += " checked";
             var names = this.getElementsByClassName('post_info_link');
              for(var i = 0; i<names.length;i++)
                {
                  $(names[i]).text("robespierre");
                }
              var imgs = this.getElementsByClassName('reblog-avatar-image-thumb');
              for(var i = 0; i<imgs.length;i++)
                {
                  if(typeof imgs[i]!=undefined)
                  {
                    $(imgs[i]).attr("src","http://1.bp.blogspot.com/-4hQikqwr-Z8/Ves0Kr8f6TI/AAAAAAAAB1A/MB9k7bzWDbc/s1600/robespierre.jpg"); 
                  }
                }
           }
          });
  }), false);
}

)(window.jQuery);
