// ==UserScript==
// @name         Imgur Comment Images as Links
// @namespace    imgur
// @version      0.3
// @description  Reverts Imgur's new garbage "image links are automatically shown" feature
// @author       Virtia, adapted from @PleaseStopApplyingTheWordPornToEverythingAndAlsoStopReposting
// @include      /http.*://.*imgur.com/.*/
// @grant        GM_addStyle
// @grant        GM_log
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/369644/Imgur%20Comment%20Images%20as%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/369644/Imgur%20Comment%20Images%20as%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`.CommentReaction-imageContainer {display: block !important;}`);

    var MutationObserver = window.MutationObserver;
    var myObserver = new MutationObserver (mutationHandler);
    var obsConfig = {
        childList: true, attributes: true,
        subtree: true, attributeFilter: ['class']
    };
    myObserver.observe (document, obsConfig);

    function mutationHandler (mutationRecords) {
        mutationRecords.forEach(function(mutation) {
            var embedded_images = mutation.target.getElementsByClassName("CommentReaction-imageContainer");

            for (var i = 0; i < embedded_images.length; i++) {
                    var img = embedded_images[i].getElementsByTagName("img")[0];
                    var video = embedded_images[i].getElementsByTagName("video")[0];
                    if (img) {
                        img.outerHTML = "<a href='" + img.src + "'>" + img.src + "</a>";
                    }
                    if (video) {
                        var source = video.getElementsByTagName("source")[0];
                        if(source) {
                            video.outerHTML = "<a href='" + source.src + "'>" + source.src + "</a>";
                        } else {
                            var src = $(video).data("url");
                            video.outerHTML = "<a href='" + src + "'>" + src + "</a>";
                        }
                    }
            }
        });
    }
})();