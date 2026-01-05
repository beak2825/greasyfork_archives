// ==UserScript==
// @name Dark mTurk Pages
// @author you
// @version    3.17
// @description  inverts mturk page color
// @match https://www.mturk.com/*
// @match https://www.mturk.com/mturk*
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/4909/Dark%20mTurk%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/4909/Dark%20mTurk%20Pages.meta.js
// ==/UserScript==

 javascript: (
 function () { 
 // the css we are going to inject
 var css = 'html {-webkit-filter: invert(100%);' +
 '-moz-filter: invert(100%);' + 
 '-o-filter: invert(100%);' + 
 '-ms-filter: invert(100%); }',
  
  head = document.getElementsByTagName('head')[0],
 style = document.createElement('style');
 
 // a hack, so you can "invert back" clicking the bookmarklet again
 if (!window.counter) { window.counter = 1;} else  { window.counter ++;
 if (window.counter % 2 == 0) { var css ='html {-webkit-filter: invert(0%); -moz-filter:    invert(0%); -o-filter: invert(0%); -ms-filter: invert(0%); }'}
  };
 
 style.type = 'text/css';
 if (style.styleSheet){
 style.styleSheet.cssText = css;
 } else {
 style.appendChild(document.createTextNode(css));
 }
 
 //injecting the css to the head
 head.appendChild(style);
 }());
