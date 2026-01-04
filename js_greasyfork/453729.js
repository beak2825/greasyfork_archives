// ==UserScript==
// @name         YT - Bring back the old 'Up next autoplay' section.
// @version      0.5
// @description  This userscript removes the new autoplay toggle button and replaced it with the old 'Up next autoplay' section on top of related videos.
// @author       Magma_Craft
// @license MIT
// @match        *://www.youtube.com/*
// @namespace    https://greasyfork.org/en/users/933798
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/453729/YT%20-%20Bring%20back%20the%20old%20%27Up%20next%20autoplay%27%20section.user.js
// @updateURL https://update.greasyfork.org/scripts/453729/YT%20-%20Bring%20back%20the%20old%20%27Up%20next%20autoplay%27%20section.meta.js
// ==/UserScript==

(function() {
    var globalCvrRef = null;
    var isrStrat = false; // itemsectionrenderer needs hacking
    var recoms;

    function injectStyles() {
        document.head.insertAdjacentHTML('beforeend',
            `
            <style>
            yt-related-chip-cloud-renderer, ytd-item-section-renderer.style-scope.ytd-watch-next-secondary-results-renderer > div#contents.style-scope.ytd-item-section-renderer > ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer, ytd-reel-shelf-renderer.ytd-structured-description-content-renderer, ytd-watch-flexy ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer, div.ytp-autonav-toggle-button-container{display:none!important;}

                ytd-compact-autoplay-renderer {
                    display: block;
                    padding-bottom: 8px;
                    border-bottom: 1px solid var(--yt-spec-10-percent-layer);
                    margin-bottom: 16px;
                }

                ytd-compact-autoplay-renderer[hide-autonav-keyline] {
                    padding-bottom: 0;
                    border-bottom: none;
                    margin-bottom: 0;
                }

                ytd-compact-autoplay-renderer[mask-as-video] {
                    padding-bottom: 0;
                    border-bottom: none;
                    margin-bottom: 0;
                }

                ytd-compact-autoplay-renderer[mask-as-video] #head.ytd-compact-autoplay-renderer {
                    display: none;
                }

                ytd-compact-autoplay-renderer[fixie] {
                    margin-bottom: 12px;
                }

                ytd-compact-autoplay-renderer:not([queue-is-empty]) {
                    border-bottom: none;
                    padding-bottom: 0;
                    margin-bottom: 0;
                }

                #head.ytd-compact-autoplay-renderer {
                    margin-bottom: 12px;
                    display: -ms-flexbox;
                    display: -webkit-flex;
                    display: flex;
                    -ms-flex-direction: row;
                    -webkit-flex-direction: row;
                    flex-direction: row;
                    -ms-flex-align: center;
                    -webkit-align-items: center;
                    align-items: center;
                }

                ytd-compact-autoplay-renderer[fixie] #head.ytd-compact-autoplay-renderer {
                    margin-bottom: 16px;
                }

                ytd-compact-autoplay-renderer[hide-autonav-headline] #head.ytd-compact-autoplay-renderer {
                    position: absolute;
                    opacity: 0;
                }

                ytd-compact-autoplay-renderer[hide-autonav-headline] #autoplay.ytd-compact-autoplay-renderer,
                ytd-compact-autoplay-renderer[hide-autonav-headline] #toggle.ytd-compact-autoplay-renderer,
                ytd-compact-autoplay-renderer[hide-autonav-headline] #tooltip.ytd-compact-autoplay-renderer {
                    display: none;
                }

                #upnext.ytd-compact-autoplay-renderer {
                    color: var(--yt-spec-text-primary);
                    font-size: 1.6rem;
                    font-weight: var(--ytd-subheadline_-_font-weight);
                    line-height: var(--ytd-subheadline_-_line-height);
                    letter-spacing: var(--ytd-subheadline_-_letter-spacing);
                    -ms-flex: 1 1 1e-9px;
                    -webkit-flex: 1;
                    flex: 1;
                    -webkit-flex-basis: 1e-9px;
                    flex-basis: 1e-9px;
                }

                #autoplay.ytd-compact-autoplay-renderer {
                    color: var(--yt-spec-text-secondary);
                    font-size: 1.3rem;
                    font-weight: 500;
                    letter-spacing: 0.007px;
                    text-transform: uppercase;
                }

                ytd-compact-autoplay-renderer[player-move-autonav-toggle] #autoplay.ytd-compact-autoplay-renderer,
                ytd-compact-autoplay-renderer[player-move-autonav-toggle] #toggle.ytd-compact-autoplay-renderer {
                    display: none;
                }

                tp-yt-paper-toggle-button.ytd-compact-autoplay-renderer {
                    margin-left: 8px;
                }

                ytd-compact-autoplay-renderer[watch-feed-big-thumbs] paper-toggle-button.ytd-compact-autoplay-renderer,
                ytd-compact-autoplay-renderer[fixie] paper-toggle-button.ytd-compact-autoplay-renderer {
                    --paper-toggle-button-label-spacing: 0;
                }

                ytd-compact-autoplay-renderer[watch-feed-big-thumbs] ytd-compact-video-renderer.ytd-compact-autoplay-renderer {
                    padding-bottom: 0;
                }

                ytd-compact-video-renderer.ytd-compact-autoplay-renderer {
                    padding-bottom: 8px;
                }

                ytd-compact-video-renderer.ytd-compact-autoplay-renderer[expansion=collapsed] {
                    padding-bottom: 0;
                }

                ytd-compact-video-renderer.ytd-compact-autoplay-renderer[expansion=expanded] {
                    margin-bottom: 0;
                }

                ytd-compact-autoplay-renderer[fixie] ytd-compact-video-renderer.ytd-compact-autoplay-renderer {
                    padding-bottom: 4px;
                }

                #tooltip.ytd-compact-autoplay-renderer {
                    font-size: var(--ytd-user-comment_-_font-size);
                    font-weight: var(--ytd-user-comment_-_font-weight);
                    line-height: var(--ytd-user-comment_-_line-height);
                    letter-spacing: var(--ytd-user-comment_-_letter-spacing);
                }

                ytd-compact-autoplay-renderer[player-move-autonav-toggle] #tooltip.ytd-compact-autoplay-renderer {
                    display: none;
                }

                ytd-compact-autoplay-renderer[watch-feed-big-thumbs]:not([is-two-columns]):not([mask-as-video]) {
                    border-bottom: none;
                    margin-bottom: 0;
                }

                ytd-compact-autoplay-renderer[watch-feed-big-thumbs]:not([is-two-columns]):not([mask-as-video]) ytd-compact-video-renderer.ytd-compact-autoplay-renderer {
                    padding-top: 34px;
                }

                ytd-compact-autoplay-renderer[watch-feed-big-thumbs]:not([is-two-columns]):not([mask-as-video]) #head.ytd-compact-autoplay-renderer {
                    position: absolute;
                    left: 0;
                    width: calc(100% - 48px);
                    margin-left: 24px;
                }
            </style>
            `
        );
    }

    function hasPlaylist() {
        var a;
        if (a=document.querySelector('#secondary ytd-playlist-panel-renderer')) {
            if (a.hidden && a.hidden == true) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    function getAutoplay() {
        var ap;
        if (ap=document.querySelector('ytd-compact-autoplay-renderer')) {
            return ap;
        } else {
            return false;
        }
    }

    function shouldAutoplay() {
        if (!hasPlaylist()) return true;
        return false;
    }

    function getCookies() {
        var c = document.cookie.split(';'), o = {};
        for (var i = 0, j = c.length; i < j; i++) {
            var s = c[i].split('=');
            var n = s[0].replace(' ', '');
            s.splice(0, 1);
            s = s.join('=');
            o[n] = s;
        }
        return o;
    }

    function parsePref(pref) {
        var a = pref.split('&'), o = {};
        for (var i = 0, j = a.length; i < j; i++) {
            var b = a[i].split('=');
            o[b[0]] = b[1];
        }
        return o;
    }

    function autoplayState() {
        var cookies = getCookies();
        if (cookies.PREF) {
            var pref = parsePref(cookies.PREF);
            if (pref.f5) {
                return !(pref.f5 & 8192)
            } else {
                return true; //default
            }
        } else {
            return true;
        }
    }

    async function waitForElement(query, timeout = 500)
    {
        var hasTimedOut = false;

        setTimeout(function() {
            hasTimedOut = true;
        }, timeout);

        while (null == document.querySelector(query) && !hasTimedOut)
        {
            await new Promise(r => requestAnimationFrame(r));
        }

        var a;
        if (a = document.querySelector(query))
        {
            return a;
        }
        else
        {
            return null;
        }
    }

    function getFirstCvr(timeout = 500) {
        var base = document.querySelector('ytd-watch-next-secondary-results-renderer');
        var cvr, i = 0;
        console.log(base);
        return new Promise(function(r, e){
            var mo = new MutationObserver(function(){
                if (base.querySelector('#contents.ytd-item-section-renderer') != null) {
                    recoms = base.querySelector('#contents.ytd-item-section-renderer');
                    isrStrat = true;
                } else if (base.querySelector('#items')) {
                    recoms = base.querySelector('#items');
                    isrStrat = false;
                } else {
                    recoms = false;
                }
                for (i = 0; i < recoms.children.length; i++) {
                    if (!recoms) break;
                    if (isrStrat) {
                        if (recoms.children[i].tagName == 'YTD-COMPACT-VIDEO-RENDERER') {
                            mo.disconnect();
                            r(recoms.children[i]);
                        }
                    } else {
                        var data = base.data;
                        for (var k = 0, j = data.results.length; k < j; k++) {
                            if (data.results[k].compactVideoRenderer && recoms.children[i].tagName == 'YTD-COMPACT-VIDEO-RENDERER') {
                                if (data.results[k].compactVideoRenderer.videoId == recoms.children[i].data.videoId) {
                                    r(recoms.children[i]);
                                }
                            }
                        }
                    }
                }
            });
            mo.observe(base, {'childList': true, 'subtree': true});
        });
    }

    var autoplayRecheck;
    var recheckcb;

    function clickAutoplay() {
        var player = document.querySelector('#movie_player');
        // try player mode 1
        var a;
        if (a = player.querySelector(".ytp-autonav-toggle-button-container")) {
            a.parentNode.click();
        } else {
            var settings = player.querySelector('.ytp-settings-button');
            settings.click();settings.click();
            var item = player.querySelector('.ytp-menuitem[role="menuitemcheckbox"]');
            item.click();
        }
        recheckcb();
    }

    async function buildAutoplay() {
        const strs = {
            UP_NEXT: 'Up next',
            AUTOPLAY: 'Autoplay'
        };
        const autoplayStub = `<ytd-compact-autoplay-renderer queue-is-empty="">
            <div id="head" class="ytd-compact-autoplay-renderer style-scope">
                <div id="upnext" class="ytd-compact-autoplay-renderer style-scope">
                </div>
                <div id="autoplay" class="ytd-compact-autoplay-renderer style-scope">
                </div>
                <tp-yt-paper-toggle-button class="ytd-compact-autoplay-renderer style-scope" id="toggle" noink="" role="button" toggles="" checked="" tabindex="0"></tp-yt-paper-toggle-button>
            </div>
            <div id="contents" class="ytd-compact-autoplay-renderer style-scope"></div>
        </ytd-compact-autoplay-renderer>`;
        var ap = getAutoplay();
        var sr = document.querySelector('ytd-watch-next-secondary-results-renderer');
        var isr = sr.querySelector('ytd-item-section-renderer');
        if (isr == null) isr = sr.querySelector('#items');
        if (!ap && shouldAutoplay()) {

            var cvr = await getFirstCvr();

            var state = autoplayState();
            isr.insertAdjacentHTML(isrStrat ? 'beforebegin' : 'afterbegin', state ? autoplayStub : autoplayStub.replace('checked=""', ''));
            var html = sr.querySelector('ytd-compact-autoplay-renderer');
            var un = html.querySelector("#upnext"),
                apText = html.querySelector("#autoplay"),
                toggle = html.querySelector('#toggle'),
                contents = html.querySelector('#contents');
            un.innerText = strs.UP_NEXT;
            apText.innerText = strs.AUTOPLAY;
            contents.appendChild(cvr);
            globalCvrRef = cvr;
            recheckcb = function(){
                if (autoplayState()) {
                    toggle.setAttribute('checked', '');
                } else {
                    toggle.removeAttribute('checked');
                }
            };
            autoplayRecheck = setInterval(recheckcb, 100);
            toggle.addEventListener('click', clickAutoplay);

            if (isrStrat) {
                recoms.insertAdjacentHTML('afterbegin', '<div id="autoplay-fix-hack" style="display:none"></div>');
            }
        } else if (ap && !shouldAutoplay()) {
            recoms.insertAdjacentElement('afterbegin', globalCvrRef);
            globalCvrRef = null;
            clearInterval(autoplayRecheck);
            ap.remove();
            var fixhack;
            if (fixhack = document.getElementById('autoplay-fix-hack')) {
                fixhack.remove();
            }
        } else if (isrStrat) {
            var cvr = await getFirstCvr();
            recoms.insertAdjacentElement('afterbegin', globalCvrRef);
            console.log(recoms);
            if (!isrStrat) recoms.insertAdjacentHTML('afterbegin', '<div id="autoplay-fix-hack" style="display:none"></div>');
            var contents = ap.querySelector('#contents');
            contents.appendChild(cvr);
            globalCvrRef = cvr;
        } else {
            console.log('fuck');
            recoms.insertAdjacentElement('afterbegin', globalCvrRef);
            globalCvrRef = null;
            var cvr = await getFirstCvr();
            var contents = ap.querySelector('#contents');
            contents.appendChild(cvr);
            globalCvrRef = cvr;
        }
    }

    function dataUpdated(e) {
        if (e.detail.pageType == 'watch') buildAutoplay();
    }

    document.addEventListener('yt-page-data-updated', dataUpdated);

    document.addEventListener('DOMContentLoaded', function _() {
        injectStyles();
        document.removeEventListener('DOMContentLoaded', _);
    });
})();