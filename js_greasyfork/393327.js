// ==UserScript==
// @name search dashboard
// @namespace Violentmonkey Scripts
// @author ghostplantss
// @grant none
// @match *://www.tumblr.com/*
// @description shows only posts w specific word(s)
// @version 1.1
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393327/search%20dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/393327/search%20dashboard.meta.js
// ==/UserScript==
// 
// 

var words = ["society"];
(
  function scroll (f) {
  var count = 0;
  window.addEventListener("scroll", ( //every time you scroll
  function fun() //it runs this function!
  {
    $("div.post").each(function() //for each post
    { 
      if(!$(this).hasClass('search'))//if it hasn't been checked already
       {
         count++;
         var boo=true;
         this.className += " search";
          var divs = this.getElementsByTagName('p');
         for(var i = 0; i< divs.length;i++)//it iterates through all paragraphs in the post 
          {
            for(var j = 0; j< words.length;j++)//iterates through the words you want to find
            {
              if(divs[i].innerHTML.indexOf(words[j]) !== -1){boo=false;}//if the word is in the post, you display it
              
             }
          }
         if(boo&&count>1)//make sure word is in post + there's still a post on the dashboard
           {
             $(this).css('display','none');//if the word isn't in the post you hide it 
           }
       }
    });
  }), false);//the end
}

)(window.jQuery);
