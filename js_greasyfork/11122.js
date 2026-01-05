// ==UserScript==
// @name        tumblr img enlarger
// @namespace   tie
// @include     http://*.tumblr.com/post/*
// @include     https://*.tumblr.com/post/*
// @version     0.3.3
// @grant       none
//@require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description Replace images in tumblr post with 1280px version if exists
// @downloadURL https://update.greasyfork.org/scripts/11122/tumblr%20img%20enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/11122/tumblr%20img%20enlarger.meta.js
// ==/UserScript==

var $;

// Add jQuery
    (function(){
        if (typeof unsafeWindow.jQuery == 'undefined') {
            var GM_Head = document.getElementsByTagName('head')[0] || document.documentElement,
                GM_JQ = document.createElement('script');
    
            GM_JQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
            GM_JQ.type = 'text/javascript';
            GM_JQ.async = true;
    
            GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
        }
        GM_wait();
    })();

// Check if jQuery's loaded
    function GM_wait() {
        if (typeof unsafeWindow.jQuery == 'undefined') {
            window.setTimeout(GM_wait, 100);
        } else {
            $ = unsafeWindow.jQuery.noConflict(true);
            letsJQuery();
        }
    }

// All your GM code must be inside this function
    function letsJQuery() {
      /*begin*/
        $('img').each(function(){
          var src1 = $(this).attr("src");
          var img=$(this);
          var width1=img.width();
          if(src1.indexOf("_500")!=-1)
          {
            //alert('500 found at '+src1);
            src2 = src1.replace(/_500/g, '_1280');
            //alert("new url "+ src2);
            /*replace with big image url*/
            img.attr("src",src2);
            img.width(width1);  
          }
          var wrap = img.parent();
          if (wrap.is("a")) {
           img.unwrap();
          }
          img.wrap("<a href='" + img.attr('src') + "' target='_blank' id='ioioi'></a>");
        });
      /*end*/
    }