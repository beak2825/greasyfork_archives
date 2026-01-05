// ==UserScript==
// @name         Gab.ai Endlessly Scrollable Content
// @namespace    http://gab.ai/Jeremy20_9
// @version      0.3
// @description  Automatically loads more Gab.ai content when you scroll to the ended of the loaded content.
// @author       Jeremiah 20:9
// @match        https://gab.ai
// @match        https://gab.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22616/Gabai%20Endlessly%20Scrollable%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/22616/Gabai%20Endlessly%20Scrollable%20Content.meta.js
// ==/UserScript==

var itvwait = -1;
var clicked = false;
$(document).ready(function(){
    $(window).scroll(function(){
        if(clicked)
            return;
        
        var posts = $("post");
        if(posts.length < 2)
            return;
        
        var elem = $("a.post-list__load-more:last")[0];
        if(elem !== undefined && elementInViewport(elem))
        {
            // http://stackoverflow.com/a/27761213/2381712
            var evt = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: 20
            });
            var ele = $("a.post-list__load-more")[0];
            ele.dispatchEvent(evt);
            clicked = true;
            itvwait = setTimeout(function(){clicked = false;}, 3000);
        }
    });
});

// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
function elementInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top >= window.pageYOffset &&
    left >= window.pageXOffset &&
    (top + height) <= (window.pageYOffset + window.innerHeight) &&
    (left + width) <= (window.pageXOffset + window.innerWidth)
  );
}