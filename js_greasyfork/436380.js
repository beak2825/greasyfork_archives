// ==UserScript==
// @name        I'm not interested in this fucking YouTube video!
// @namespace   http://www.iamnotinterestedinthisfuckingyoutubevideo.com
// @version     1.0
// @description I'm not interested in this fucking YouTube video! Fuck you!!!!!!! Fuck you to death!!!!
// @match       *://www.youtube.com/*
// @run-at      document-end
// @license     FuckYou
// @require     https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/436380/I%27m%20not%20interested%20in%20this%20fucking%20YouTube%20video%21.user.js
// @updateURL https://update.greasyfork.org/scripts/436380/I%27m%20not%20interested%20in%20this%20fucking%20YouTube%20video%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (/youtube\.com\/?$/.test(location.href)) {
        console.log("Youtube home page detected!");

        setInterval((function () {
            let cells = $("ytd-rich-item-renderer.style-scope.ytd-rich-grid-row:not(.fucked)");
            if(cells.length == 0) {
                console.log("Can't find any cells to check");
            }
            cells.each(function(){
                let cell = $(this);
                let temp = cell.find("ytd-thumbnail");
                temp.hover(function(e){
                    if(e.ctrlKey) {
                        $(this).closest("ytd-rich-item-renderer").find("button.style-scope.yt-icon-button").click();
                        setTimeout(function(){
                            $("yt-formatted-string:contains('Not interested')").click();
                        }, 50);
                    }
                    else if(e.altKey) {
                        $(this).closest("ytd-rich-item-renderer").find("button.style-scope.yt-icon-button").click();
                        setTimeout(function(){
                            $(`yt-formatted-string:contains("Don't recommend channel")`).click();
                        }, 50);
                    }
                });
            });
            cells.addClass("fucked");
        }), 2000);
    }

    if (/youtube\.com\/watch/.test(location.href)) {
        setInterval((function () {
            let cells = $("ytd-compact-video-renderer.style-scope.ytd-item-section-renderer:not(.fucked)");
            cells.each(function(){
                let cell = $(this);
                let temp = cell.find("ytd-thumbnail");
                temp.hover(function(e){
                    if(e.ctrlKey) {
                        $(this).closest("ytd-compact-video-renderer").find("button.style-scope.yt-icon-button").click();
                        setTimeout(function(){
                            $("yt-formatted-string:contains('Not interested')").click();
                        }, 50);
                    }
                    else if(e.altKey) {
                        $(this).closest("ytd-compact-video-renderer").find("button.style-scope.yt-icon-button").click();
                        setTimeout(function(){
                            $(`yt-formatted-string:contains("Don't recommend channel")`).click();
                        }, 50);
                    }
                });
            });
            cells.addClass("fucked");
        }), 2000);
    }
})();