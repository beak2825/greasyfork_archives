// ==UserScript==
// @name        Washington Post
// @namespace   yvan.dubois
// @include     https://www.washingtonpost.com/*
// @version     1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description Remove the subscription from the Washington Post
// @downloadURL https://update.greasyfork.org/scripts/28805/Washington%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/28805/Washington%20Post.meta.js
// ==/UserScript==

(function(){
  
  $(document).ready(function() {
    
    setTimeout(function(){
    
        $('IFRAME').remove()
        $('.wp_signin').remove()
        $('#wp_Signin').remove()
        $('body').css('overflow-y', '')
    
    }, 1000)
    
  })
  
})()