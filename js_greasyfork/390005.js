// ==UserScript==
// @name        FoxNews.com Cleanup
// @namespace   rfindley
// @description Stop videos from auto-playing on foxnews.com
// @version     7.1.2
// @include     https://static.foxnews.com/static/orion/html/video/iframe/vod.html*
// @copyright   2018+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/390005/FoxNewscom%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/390005/FoxNewscom%20Cleanup.meta.js
// ==/UserScript==

(function() {

    /* global $ */

    function install_css() {
        var css =
            '#player:hover .amp-vod > .amp-controls, '+
            '#player:hover .amp-vod > .amp-control '+
            '{'+
            '  opacity: 1; -webkit-transition: opacity 0s;'+
            '}'+

            '#player:hover .amp-pause-overlay {display:block;}'+
            '#player .amp-playing .amp-pause-overlay:before {content:"\\f04c";}'+
            '#player .amp-paused .amp-pause-overlay:before {content:"\\f04b";}'+

            '#player .amp-vod {cursor:pointer;}';

        var style = document.createElement('style');
        style.innerHTML = css;
        document.querySelector('head').append(style);
    }

    install_css();

    function stop_the_damned_video() {
        var videos = document.querySelectorAll('video');
        videos.forEach(function(video){
            video.autoplay = false;
            video.pause();
        });
    }

    var ignore_click = false;
    var stopper = undefined;
    function main() {
        stopper = setInterval(stop_the_damned_video, 100);
        console.log('PAUSING');
        $('#player').on('click', '.amp-vod,.amp-live', function(e) {
            if (stopper != undefined) {
                clearInterval(stopper);
                stopper = undefined;
            }
            if (!ignore_click && e.target.classList.contains('amp-interactive')) {
                ignore_click = true;
                setTimeout(function(){
                    ignore_click = false;
                }, 250);
                $('#player .amp-playpause').trigger('click');
            }
        });
    }

    //-------------------------------------------------------------------
    // Run main() upon load.
    //-------------------------------------------------------------------
    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener("load", main, false);
    }

})();