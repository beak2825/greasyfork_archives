// ==UserScript==
// @name         TwitterStats Unfollow All
// @version      0.3
// @description  Unfollow All!
// @author       @cigarro_amargo
// @match        https://unfollowerstats.com/nonfollowbacks*
// @grant        none
// @require      //code.jquery.com/jquery-1.12.4.min.js
// @namespace https://greasyfork.org/users/207748
// @downloadURL https://update.greasyfork.org/scripts/371537/TwitterStats%20Unfollow%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/371537/TwitterStats%20Unfollow%20All.meta.js
// ==/UserScript==

var $ = window.jQuery;

(function() {
    $("body").append("<button id='unfollow-all-btn' style='position: fixed;bottom: 0;right: 0;font-size: 30px;color: white;height: 50px;width: 144px;z-index: 5000;background-color: #8cc152;'>Unfollow</button>");
})();

$("#unfollow-all-btn").on('click', function() {
    var divs = $('.btn-success.followingButton');
    var followcounter = 0;
    (function addFollow() {
        setTimeout(function() {
            if (followcounter++ < divs.length) {
                divs[followcounter].click();
                addFollow();
            }
        }, 10);
    })();
});
