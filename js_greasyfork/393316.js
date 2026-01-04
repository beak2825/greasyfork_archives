// ==UserScript==
// @name       block users - tumblr.com
// @namespace   Violentmonkey Scripts
// @match       https://www.tumblr.com/dashboard
// @grant       none
// @version     1.1
// @author      ghostplantss
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @description 12/4/2019, 5:35:28 AM
// @downloadURL https://update.greasyfork.org/scripts/393316/block%20users%20-%20tumblrcom.user.js
// @updateURL https://update.greasyfork.org/scripts/393316/block%20users%20-%20tumblrcom.meta.js
// ==/UserScript==


var count =0;
var blocked = ["ghostplantss"];
(
  function scroll (f) {
  window.addEventListener("scroll", (
    function fun() 
    {
      $("div.post").each(function() 
       {     
          if(!$(this).hasClass('checked'))
           {
              this.className += " checked";
 

             var postdata = $(this).data("json");
             var block = false;
             if(typeof postdata != 'undefined')
             {
                var divs = this.getElementsByClassName('reblog-tumblelog-name');
                var names = this.getElementsByClassName('post_info_link');

                for(var i = 0; i< blocked.length;i++)//checks if the post ought to be blocked 
                {
                   for(var j = 0; j<names.length;j++)
                    {
                      console.log($(names[i]).text());
                      if($(names[j]).text().includes(blocked[i]))
                        {
                          block = true;
                        }
                    }
                  
                  
                  if(!block)//2. checks if any of the added reblogs matches any of blocked names 
                    {
                      for (var j = 0; j < divs.length; j ++) 
                      {
                          if(divs[j].innerHTML.includes(blocked[i]))
                          {
                            block=true; 
                            //console.log(postdata["share_popover_data"].post_url);
                          }
                      }
                    }   
                }
            
                if(block ===true)//if it ought to be blocked, it hides the post + ought to like the third hidden post
                {  
                  $(this).css('display','none');
                  var like = this.getElementsByClassName('like');
                 // console.log(postdata.post_url);

                  if(!$(like[0]).hasClass("liked") )   //if the post is not yet liked
                  {
                    count++;
                  //  console.log(postdata.tumblelog+count);
                    if(count===3)
                    {
                        console.log("liked "+postdata["share_popover_data"].post_url);
                        count=0;//resets count
                        like[0].click();//it clicks the button!
                    }
                  }
                 }  
              }  
            }
          });
        }                
    ), false);
  }
)(window.jQuery);