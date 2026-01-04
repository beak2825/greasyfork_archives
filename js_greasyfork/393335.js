// ==UserScript==
// @name        cockades
// @namespace   Violentmonkey Scripts
// @match       https://www.tumblr.com/dashboard
// @grant       none
// @version     1.1
// @author      ghostplantss
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @description 12/4/2019, 5:35:28 AM
// @downloadURL https://update.greasyfork.org/scripts/393335/cockades.user.js
// @updateURL https://update.greasyfork.org/scripts/393335/cockades.meta.js
// ==/UserScript==


var count =0;
var names = ["ghostplantss"];
(
  function scroll (f) {
  window.addEventListener("scroll", (
    function fun() 
    {
      $(".post_avatar_wrapper").each(function() 
       {     
          if(!$(this).hasClass('cockades'))
          {
            this.className += " cockades";
            var a = $(this).find(".post_avatar_link");
            for(var i =0;i<names.length;i++)
            {
              if($(a).attr("data-peepr").includes(names[i]))
              {
                
                var div = document.createElement("div");
                div.style.width = "20px";
                div.style.height = "20px";
                div.style.backgroundImage = "url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Tricolour_Cockade.svg/1024px-Tricolour_Cockade.svg.png')";
                div.style.backgroundSize= "20px";

              //  div.style.background = "red";
                div.style.bottom="0px";
                div.style.right="0px";
                div.style.padding="0px"; 
                this.appendChild(div);
                div.style.position="absolute"; 
                console.log(a);
              }
            }
          }  
        });
      }                
    ), false);
  }
)(window.jQuery);