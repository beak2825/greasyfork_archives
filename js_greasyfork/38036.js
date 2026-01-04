// ==UserScript==
// @name         Penny-Arcade Forums Twitter Load Scroll-Fix
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @author       delmain
// @version      0.2.0
// @description  Scroll back to the intended post when Twitter posts load
// @match        https://forums.penny-arcade.com/discussion/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38036/Penny-Arcade%20Forums%20Twitter%20Load%20Scroll-Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/38036/Penny-Arcade%20Forums%20Twitter%20Load%20Scroll-Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var location = window.location.hash;

    $(document).ready(function() {
        if(location) {
            var postsNode = document.getElementById('Content');
            var config = { attributes: true, subtree: true };
            var callback = function(mutationsList) {
                mutationsList.some(function(mutation) {
                    if(mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.className.includes('js-twitterCardLoaded')) {
                        $('html, body').stop(true, true);
                        $("html, body").animate({ scrollTop: $(location).offset().top }, 100);

                        var loadable = $('.js-twitterCardPreload').length;
                        var loaded = $('.js-twitterCardLoaded').length;
                        console.log('twitter card loaded, ' + loaded + ' of ' + loadable + ' complete.');

                        if(loaded == loadable)
                        {
                            observer.disconnect();
                        }
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                });
            };
            var observer = new MutationObserver(callback);
            observer.observe(postsNode, config);
        }
    });
})();