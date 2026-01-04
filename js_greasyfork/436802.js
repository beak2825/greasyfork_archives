// ==UserScript==
// @name         animixplay Bingewatcher+
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      1.4
// @description  Auto-fullscreen, auto-starts, skip intros, jump to next episode
// @include      https://animixplay.to/*
// @include      https://v.vvid.cc/*
// @include      https://plyr.link/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon         https://animixplay.to/icon.png
// @downloadURL https://update.greasyfork.org/scripts/436802/animixplay%20Bingewatcher%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/436802/animixplay%20Bingewatcher%2B.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
var $ = window.$;

(function($){

    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(changes, observer) {

        if($('video')) {
            observer.disconnect();
            $('body').click();
            $("video")[0].play();
            $("#videocontainer > div > div.plyr__controls > button:nth-child(8)").click();
            $('#videocontainer > div').focus();

            var newYearCountdown = setInterval(function(){
                var player = $('video')[0];
                var duration = player.duration;
                var current = player.currentTime;

                window.addEventListener("keydown", function(event) {
                    var x = event.key;

                    if (x == 'v') { // V key skip 89s
                        player.currentTime = current + 89;
                    }

                    if (x == 'n') { // V key skip end
                        player.currentTime = duration;
                    }
                });
            }, 1000);
        }
    }
})(jQuery);