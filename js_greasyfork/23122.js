// ==UserScript==
// @name         YouTube Preview
// @author       sooqua
// @namespace    https://github.com/sooqua/
// @version      0.9
// @description  A userscript to play youtube videos by hovering over their thumbnails.
// @match        *://*.youtube.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23122/YouTube%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/23122/YouTube%20Preview.meta.js
// ==/UserScript==

var APIready = new Promise(function(resolve) {
    window.onYouTubeIframeAPIReady = resolve;
});

(function() {
    'use strict';

    function init() {
        // requesting api
        var scriptTag = document.createElement('script');
        scriptTag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);

        addGlobalStyle(
            ".watch-sidebar-section { " +
            "z-index: auto !important; " +
            "} " +

            ".yt-lockup-thumbnail:not(.yt-pl-thumb),.thumb-wrapper { " +
            "-webkit-transition: all 200ms ease-in !important; " +
            "-webkit-transform: scale(1) !important; " +
            "-moz-transition: all 200ms ease-in !important; " +
            "-moz-transform: scale(1) !important; " +
            "transition: all 200ms ease-in !important; " +
            "transform: scale(1) !important; " +
            "} " +

            ".yt-lockup-thumbnail:not(.yt-pl-thumb):hover,.thumb-wrapper:hover { " +
            "z-index: 9999999999 !important; " +
            "box-shadow: 0px 0px 100px #000000 !important; " +
            "-webkit-transition: all 200ms ease-in !important; " +
            "-webkit-transform: scale(2.0) !important; " +
            "-moz-transition: all 200ms ease-in !important; " +
            "-moz-transform: scale(2.0) !important; " +
            "transition: all 200ms ease-in !important; " +
            "transform: scale(2.0) !important; " +
            "} " +

            ".yt-thumb.video-thumb, .yt-uix-simple-thumb-wrap.yt-uix-simple-thumb-related { " +
            "background-color: black !important; " +
            "} " +

            ".xspinner { " +
            "pointer-events: none; " +
            "position: absolute; " +
            "top: 0; " +
            "right: 0; " +
            "bottom: 0; " +
            "left: 0; " +
            "background: rgba(255,255,255,0.5); " +
            "font-size: 14px; " +
            "text-align: center; " +
            "line-height: 2; " +
            "color: rgb(0,0,0); " +
            "font-weight: bold; " +
            "} ");

        initOn(document);
        var mo = new MutationObserver(function(muts) {
            muts.forEach(function(mut) {
                [].forEach.call(mut.addedNodes, function(node) {
                    if (node instanceof HTMLElement) {
                        initOn(node);
                    }
                });
            });
        });
        mo.observe(document.body, {childList: true, subtree: true});
    }

    function initOn(base) {
        [].forEach.call(base.querySelectorAll('.yt-lockup-thumbnail:not(.yt-pl-thumb) a[href^="/watch"], .thumb-wrapper a[href^="/watch"]'), function(thumbnail) {

            thumbnail.parentNode.addEventListener('mouseover', function() {
                if(thumbnail.overlocker) return;
                thumbnail.overlocker = new Promise(function (unlock) {
                    var rect = thumbnail.parentElement.getBoundingClientRect();
                    var farRight = (rect.right + thumbnail.parentElement.clientWidth/2.0) > window.innerWidth;
                    var farDown = (rect.bottom + thumbnail.parentElement.clientHeight/2.0) > window.innerHeight;
                    var farLeft = (rect.left - thumbnail.parentElement.clientWidth/2.0) < 0;
                    var farUp = (rect.top - thumbnail.parentElement.clientHeight/2.0) < 0;
                    if(farRight || farDown || farLeft || farUp) {
                        var transformOrig = (farRight ? 'right ':'') + (farDown ? 'bottom ':'') + (farLeft ? 'left ':'') + (farUp ? 'top ':'');
                        thumbnail.parentElement.style.webkitTransformOrigin = transformOrig;
                        thumbnail.parentElement.style.mozTransformOrigin = transformOrig;
                        thumbnail.parentElement.style.transformOrigin = transformOrig;
                    }

                    var spinner = document.createElement('div');
                    spinner.className = 'xspinner';
                    spinner.textContent = 'Loading...';

                    var childThumb = thumbnail.querySelector('.yt-thumb.video-thumb, .yt-uix-simple-thumb-wrap.yt-uix-simple-thumb-related');
                    childThumb.appendChild(spinner);

                    thumbnail.watchedContainer = [];
                    for (var el = thumbnail; el; el = el.parentElement) {
                        if (el.classList.contains('watched')) {
                            thumbnail.watchedContainer.push(el);
                            el.classList.remove('watched');
                        }
                    }
                    thumbnail.watchedBadgeContainer = [];
                    [].forEach.call(thumbnail.parentNode.querySelectorAll('.watched-badge'), function (watchedBadge) {
                        thumbnail.watchedBadgeContainer.push(watchedBadge);
                        watchedBadge.style.display = 'none';
                    });
                    thumbnail.imageContainer = [];
                    [].forEach.call(thumbnail.getElementsByTagName('img'), function(img) {
                        thumbnail.imageContainer.push(img);
                        img.style.opacity = 0;
                    });

                    var vidId = thumbnail.href.split('v=')[1];
                    thumbnail.PPlayer = new Promise(function (resolve) {
                        var playerTag = document.createElement('div');
                        playerTag.id = vidId;
                        playerTag.style.pointerEvents = 'none';
                        playerTag.style.position = 'absolute';
                        childThumb.insertBefore(playerTag, childThumb.firstChild);
                        APIready.then(function () {
                            var pplayer = new YT.Player(playerTag.id, {
                                width: childThumb.offsetWidth,
                                height: childThumb.offsetHeight,
                                videoId: vidId,
                                playerVars: {
                                    'enablejsapi': 1, 'autoplay': 1, 'showinfo': 0, 'controls': 0,
                                    'modestbranding': 1, 'ps': 'docs', 'iv_load_policy': 3, 'rel': 0,
                                    'vq': 'medium'
                                },
                                events: {
                                    'onReady': function() { resolve(pplayer); }
                                }
                            });
                        });
                    });
                    thumbnail.PPlayer.then(function () {
                        childThumb.removeChild(spinner);
                        unlock();
                    });
                });
            });

            thumbnail.parentNode.addEventListener('mousemove', function(evt) {
                if (thumbnail.spinner) return;

                if(thumbnail.lastX !== evt.screenX) {
                    var offsetX = evt.offsetX || evt.layerX - thumbnail.offsetLeft;

                    if(thumbnail.PPlayer) {
                        thumbnail.PPlayer.then(function (PPlayer) {
                            try {
                                PPlayer.seekTo(PPlayer.getDuration() * offsetX / thumbnail.parentElement.offsetWidth, true);
                            } catch (e){}
                        });
                    }
                }
                thumbnail.lastX = evt.screenX;
            });

            thumbnail.parentNode.addEventListener('mouseout', function(evt) {
                if(!thumbnail.overlocker) return;
                thumbnail.overlocker.then(function () {
                    if(evt.relatedTarget) {
                        if (thumbnail.parentElement.contains(evt.relatedTarget)) return;
                        if (evt.relatedTarget.className.indexOf('yt-uix-tooltip-tip') !== -1) return;
                    }

                    if(thumbnail.watchedContainer) {
                        for (var i = 0; i < thumbnail.watchedContainer.length; i++)
                            thumbnail.watchedContainer[i].classList.add('watched');
                        thumbnail.watchedContainer = null;
                    }
                    if(thumbnail.watchedBadgeContainer) {
                        for (var i = 0; i < thumbnail.watchedBadgeContainer.length; i++)
                            thumbnail.watchedBadgeContainer[i].style.display = null;
                        thumbnail.watchedBadgeContainer = null;
                    }
                    if(thumbnail.imageContainer) {
                        for (var i = 0; i < thumbnail.imageContainer.length; i++)
                            thumbnail.imageContainer[i].style.opacity = null;
                        thumbnail.imageContainer = null;
                    }

                    if(thumbnail.PPlayer) {
                        thumbnail.PPlayer.then(function(PPlayer) {
                            if(PPlayer.a.parentNode)
                                PPlayer.a.parentNode.removeChild(PPlayer.a);
                            thumbnail.PPlayer = null;
                            thumbnail.overlocker = null;
                        });
                    }
                    else {
                        thumbnail.overlocker = null;
                    }
                });
            });

        });
    }

    function addGlobalStyle(css) {
        var head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    init();
})();
