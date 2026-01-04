// ==UserScript==
// @name        skyscrapercity rewrite link to newpost 
// @description skyscrapercity rewrite link to newpost in subscribed posts, and on click open link in new tab (in background)
// @author      Arti
// @include     *://www.skyscrapercity.com/usercp.php*
// @include     *://www.skyscrapercity.com/subscription.php*
// @include     *://www.skyscrapercity.com/forumdisplay.php*
// @version     1.0
// @grant       GM_openInTab
// @namespace https://greasyfork.org/users/101643
// @downloadURL https://update.greasyfork.org/scripts/33498/skyscrapercity%20rewrite%20link%20to%20newpost.user.js
// @updateURL https://update.greasyfork.org/scripts/33498/skyscrapercity%20rewrite%20link%20to%20newpost.meta.js
// ==/UserScript==



// Let's go for some cross-browser compatibility instead of catering only to GreaseMonkey
var openWindow;

if(typeof GM_openInTab != 'undefined') {
   openWindow = GM_openInTab;
} else {
   openWindow = window.open;
}


function openWindows(urls) {
   for (i=0;i<urls.length;i++) {
        GM_openInTab(urls[i],true,false);
        console.log(urls[i])
      }
    return(false);
}


var myNodeList = document.querySelectorAll('a[id^=thread_title_]');
for(var i = 0; i < myNodeList.length; ++i) {
    myNodeList[i].href += '&goto=newpost';
    if(myNodeList.length != 1) {
          var newhref = myNodeList[i].href;
          // comment both to disable newWindow on click
          myNodeList[i].addEventListener('click', function(){openWindows([this.href]); return false;}, false);
          myNodeList[i].setAttribute('onclick', 'return false;');
    }
}

