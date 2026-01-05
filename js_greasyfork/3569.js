// ==UserScript==
// @name          Shift + Scroll = HScroll
// @namespace     http://userscripts.org/users/303112
// @description   Scroll horizontally using < SHIFT + scroll > (useful in Firefox)
// @version       1.2
// @include       *
// @author        Cezar Derevlean - www.dcezar.com - contact@dcezar.com
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/3569/Shift%20%2B%20Scroll%20%3D%20HScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/3569/Shift%20%2B%20Scroll%20%3D%20HScroll.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

// BEGIN plugins

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
 
/*
**  Possible Additional Configuration:
**    If, when you hold shift, you scroll through previous pages / history
**      Go to about:config page in firefox and set the variable mousewheel.with_shift.action to 0
**      If it still doesn't work and you are using a linux distribution go to linux's settings > windows > modifier for modified click actions (something like that) and change it to something other than shift
**    Also if alt click to save isn't working on linux
**      Go to about:config and set browser.altClickSave to true
**      You may have to go in to linux window setting again to change alt key's action
**
**  I've been in this situation before so I added this comment
**  I did not write any of the script myself
**    Alkazaar, 23/07/2014
*/

;(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery);

// END plugins



// BEGIN main

$(document).ready(function() { 
  var pressed = false;

  $(document).keydown(function (e) {
      if (e.keyCode == 16) {
        pressed = true;
      }
  });
  $(document).keyup(function(event){
     pressed = false;
  });

  $('html, body, *').mousewheel(function(e, delta) {
    if (pressed) {
      this.scrollLeft -= (delta * 40);
      e.preventDefault();
    }
  });

});

// END main
