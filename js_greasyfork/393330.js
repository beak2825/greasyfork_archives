// ==UserScript==
// @name everyone's you 
// @namespace Violentmonkey Scripts
// @author ghostplantss
// @grant none
// @match *://www.tumblr.com/*
// @description turns everyone's avatars and names into yours
// @version 1.1
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393330/everyone%27s%20you.user.js
// @updateURL https://update.greasyfork.org/scripts/393330/everyone%27s%20you.meta.js
// ==/UserScript==
// 
// 

var count = 0;
var img;
var name;
(
  function scroll (f) {
  window.addEventListener("scroll", ( //every time you scroll
  function fun() //it runs this function!
  {
    $('.post_avatar_link').each(function(i) {
      if(count<1)
       {
          img = this.style.backgroundImage;
          name = $(this).attr("data-peepr");
         name= name.substring(14,name.length-2)
     //    console.log(name);
          count++;
       }
      else
        {
          this.style.backgroundImage=img;   
        }
    });

    
          $("div.post").each(function() 
       { 
          if(!$(this).hasClass('you'))
           {
             this.className += " you";
             var names = this.getElementsByClassName('post_info_link');
              for(var i = 0; i<names.length;i++)
                {
                  $(names[i]).text(name);
                }
              var imgs = this.getElementsByClassName('reblog-avatar-image-thumb');
              for(var i = 0; i<imgs.length;i++)
                {
                  if(typeof imgs[i]!=undefined)
                  {
                    $(imgs[i]).attr("src",img.substring(5,img.length-2)); 
                  }
                }
           }
          });
  }), false);
}

)(window.jQuery);
