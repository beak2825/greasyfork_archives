// ==UserScript==
// @name         osc old page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.oschina.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410058/osc%20old%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/410058/osc%20old%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tweet = $('<iframe/>').attr('src','https://www.oschina.net/tweets')
        .css("width","550px").css("position","absolute").css("left","1260px").css("top","150px")
    .css('height','800px').attr('frameborder','0');
    $(".home-container").css('width',"1800px").css('padding','0');
    $(".body-box").css("width","1500px").append(tweet);
    // Your code here...
})();