// ==UserScript==
// @name        Youtube Subscriptions infinite
// @author      /r/defproc
// @namespace   https://www.reddit.com/r/GreaseMonkey/comments/3kvo24/request_infinate_scroll_for_youtube/?solution
// @description https://www.reddit.com/r/GreaseMonkey/comments/3kvo24/request_infinate_scroll_for_youtube/
// @include     https://www.youtube.com/feed/subscriptions
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12461/Youtube%20Subscriptions%20infinite.user.js
// @updateURL https://update.greasyfork.org/scripts/12461/Youtube%20Subscriptions%20infinite.meta.js
// ==/UserScript==

window.addEventListener("scroll", function(){
  var button = document.querySelectorAll('.browse-items-load-more-button');
  var getTop = function(el){
    return el.offsetParent ? el.offsetTop + getTop(el.offsetParent) : el.offsetTop;
  };
  if(button.length === 0) return;
  if(window.scrollY > (getTop(button[0]) - (window.innerHeight * 0.9))) {
    button[0].click();
  }
}, false);