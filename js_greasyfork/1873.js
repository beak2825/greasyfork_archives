// ==UserScript==
// @name       YouTube Mark As Watched
// @namespace  http://www.youtube.com/
// @version    1.0
// @description  readds seen/watched functionality to youtube subscriptions
// @match      http://www.youtube.com/feed/subscriptions
// @match      https://www.youtube.com/feed/subscriptions
// @copyright  2013+, panni / Fixed by TheVirus
// @nocompat Chrome
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/1873/YouTube%20Mark%20As%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/1873/YouTube%20Mark%20As%20Watched.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    var jq, jQueryLoaded, main, script, store;
    // fire on jquery load
    jQueryLoaded = function (event) {
        jq = unsafeWindow.jQuery.noConflict();
        
        if (jq !== undefined && jq !== null) {
            main(jq);
        }
    };
    
    main = function ($) {
        var seen, clicked, reflect, addBtn, $btn = $('<img src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif" class="yt-channel-title-icon-verified" alt="" title="click to unwatch" style="cursor:pointer;" />');
        
        // append stylesheet
        $('head').append('<style id="dynamicStylesheet"></style>');
        $('#dynamicStylesheet').text(".seen { opacity: 0.3; }");
        
        // allow caching of our dynamically loaded scripts
        $.ajaxSetup({
            cache: true
        });
        
        // get totalStorage and continue
        $.getScript(location.protocol+"//nigl.it/static/jquery.total-storage.min.js", function() {
            store = $.totalStorage;
            seen = (store("seen") || []);
            
            // limit to 100 seen IDs
            if (seen.length > 100) {
                seen = seen.slice(seen.length - 100);
            }
            
            // item has been clicked, handle
            clicked = function(e) {
                var $this = $(e.target), feedParent, vidID;
                
                // not left or middle mouse? (new tab)
                if (e.button > 1) {
                    return;
                }
                vidID = $this.parents(".yt-lockup-video");
                vidID = vidID.find('.addto-watch-later-button').attr('data-video-ids');
                feedParent = $this.parents(".feed-item-dismissable").addClass("seen");
                if ($.inArray(vidID, seen) === -1) {
                    seen.push(vidID);
                    store("seen", seen);
                }
                
                // add an unwatch button
                addBtn(feedParent, vidID);
            };
            
            addBtn = function(feedParent, vidID) {
                var btn, fpPosition = feedParent.position();
                btn = $btn.clone().on("click", function(e) {
                    feedParent.removeClass("seen");
                    
                    // remove item from storage
                    seen.splice(seen.indexOf(vidID), 1);
                    store("seen", seen);
                    
                    // remove the button
                    $(this).remove();
                    
                    e.stopPropagation();
                    return false;
                }).css({position: "absolute", right: -1, top: fpPosition.top - 1});
                btn.insertAfter(feedParent);
            };
            
            // reflect seen statuses in the DOM
            reflect = function(els) {
                els.each(function(k, el) {
                    var $this = $(el), feedParent;
					var vidID = $this.find('.addto-watch-later-button').attr('data-video-ids');
                    if ($.inArray(vidID, seen) !== -1) {
                        feedParent = $this.parents(".feed-item-dismissable").addClass("seen");
                        
                        // add an unwatch button
                        addBtn(feedParent, vidID);
                    }
                });
            };
            
            // bind all current and future video links to clicked handler
            $(document).on("mousedown", '#content .yt-lockup-title .yt-uix-sessionlink, #content .yt-lockup-thumbnail .yt-uix-sessionlink', function(e) {
                return clicked(e);
            });
            
            // collect all newly added videos after endlessscroll and set their seen statuses
            $('#browse-items-primary').on("DOMNodeInserted", function(e) {
                var item = e.target;
                if ($(item).hasClass('feed-item-container')) {
                    if (!$(item).hasClass('handled')) {
                        var $this = $(item);
                        reflect($this.find(".yt-lockup-video"));
                        $this.addClass("handled");
                    }
                }
            });
            // collect all current videos before endlessscroll and set their seen statuses
            $('#feed .browse-items-primary').not('.handled').each(function(k, el) {
                var $this = $(this);
                reflect($this.find(".yt-lockup-video"));
                $this.addClass("handled");
            });
        });
    };
    
    
    // add jQuery
    script = document.createElement('script');
    script.src = '//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js';
    script.addEventListener('load', jQueryLoaded, false);
    document.body.appendChild(script);
}());