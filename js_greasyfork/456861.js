// ==UserScript==
// @name         New Tab for Hacker News
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  new tab for hacker news.when you click a news title, it will open a new tab, instead of the origin tab.
// @author       aaaafei
// @match        https://news.ycombinator.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456861/New%20Tab%20for%20Hacker%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/456861/New%20Tab%20for%20Hacker%20News.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var links = $('.titleline > a');
    for (var i=0;i<links.length;i++){
      var item = links[i];
      $(item).attr('target','_blank');
    }
})();