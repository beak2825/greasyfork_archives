// ==UserScript==
// @name            SeenChute
// @version         19.12.7
// @description     BitChute.com. Adds a "watched" bar to top of video cards.
// @license         MIT
// @author          S-Marty
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @namespace       https://github.com/s-marty/SeenChute
// @homepageURL     https://github.com/s-marty/SeenChute
// @icon            https://raw.githubusercontent.com/s-marty/SeenChute/master/images/seenChute.png
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QHFFSLZ7ENUQN&source=url
// @include         /^https?://www\.bitchute\.com/.*$/
// @run-at          document-end
// @grant           GM.getValue
// @grant           GM.setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/392374/SeenChute.user.js
// @updateURL https://update.greasyfork.org/scripts/392374/SeenChute.meta.js
// ==/UserScript==

/* greasyfork.org jshint syntax checking hacks */
/* jshint asi: true */
/* jshint boss: true */
/* jshint esversion: 6 */
/* jshint multistr: true */

/** **********************   Features   **********************
*** Adds a red metered bar over your watched videos by percent.
*** Videos which are watched not more than 1 % will be ignored.
*** Database size is auto-manageable.  Defaults to 2000 videos.
***     Set "var limit_database_To = " to any whole integer.
***     The oldest database records will be truncated first.
*** Bar colors may be edited as well.
*** See "Editable options" in source code below.
*** No extra @require files (jquery et.al.)

***  ***  Does not & will not work well with IE and IEdge  ***/


/* Editable options */
var limit_database_To = 2000;         /* 0 for unlimited. i.e. 5000 to save only the latest 5000 videos */
var bar_top_color     = "#CC3333";    /* A hexadecimal color specified as: #RRGGBB, where the RR (red), GG (green) and BB (blue)*/
var bar_middle_color  = "#F05555";    /* Hex integers specify the components of the color. Values must be between 00 and FF. */
var bar_bottom_color  = "#000000";    /* Edits made here will be lost during userscript updates. Database data survives updates */
/* End Editable options */


(function() {
    "use strict";

    var BC = {};
    var d = document;
    var videoId = '';
    var updater = null;
    var unloader = null;
    var videoViewedMax = 0;
    var listingsAllHeight = 0;
    var listingsPopHeight = 0;
    var channelVideoHeight = 0;

    function iHaveSeen(e) {

        BC.url          = window.location.href;
        BC.host         = window.location.hostname;
        BC.path         = window.location.pathname;
        BC.searchpage   = BC.url.indexOf('/search') !=-1;
        BC.watchpage    = BC.path.indexOf('/video') !=-1;
        BC.profilepage  = BC.path.indexOf('/profile/') !=-1;
        BC.channelpage  = BC.path.indexOf('/channel/') !=-1;
        BC.hashtagpage  = BC.path.indexOf('/hashtag/') !=-1;
        BC.categorypage = BC.path.indexOf('/category/') !=-1;
        BC.playlistpage = BC.path.indexOf('/playlist/') !=-1;
        BC.homepage     = BC.url == location.protocol +"//"+ BC.host +"/";

        if (!BC.loaded) {
            if (!BC.loader) {
                if (BC.loader = qs("#loader-container")) {
                    addListener(BC.loader, function(e) {
                        if (e.target.style.display == 'none') iHaveSeen(e);
                    },{ attributes: true, attributeFilter: ['style'] });
                }
            }

            let style = d.createElement("style");
            style.type = "text/css";
            style.innerText = '\
                    div.video-seen {height: 3px; margin: 0px; padding: 0px; background-color: '+ bar_middle_color +'; border: 0px; \
                    border-top: 1px solid '+ bar_top_color +'; border-bottom: 1px solid '+ bar_bottom_color +'; overflow: hidden;}';
            d.documentElement.appendChild(style);
            BC.loaded = 1;
        }
        else {
            if (BC.page == 'watchpage') {
                watchedlistAdd();
            }
        }

        if (BC.watchpage) {
            BC.page = 'watchpage';
            videoViewedMax = 0;
            videoId = BC.path.match( /video\/([a-z0-9_-]+)\//i )[1];

            if (! BC.api || ! updater) {
                apiUpdater()
            }
            if (! unloader) {
                window.addEventListener('beforeunload', function(e){ watchedlistAdd(e); }, false);
                unloader = true;
            }
            applySeenBars(3000);
            window.setTimeout(function() { showMoreListen(); }, 5000);
        }
        else if (BC.profilepage || BC.hashtagpage || BC.playlistpage) {
            BC.page = 'profilepage';
            applySeenBars();
        }
        else if (BC.channelpage) {
            BC.page = 'channelpage';
            let channelTabs = qs('#channel-tabs.seeing');
            let listingsChannel = qs('.channel-videos-list');
            if (!channelTabs) {
                addListener(listingsChannel, function(e) {
                    let newlistings = qs('.channel-videos-list');
                    let newlistingsHeight = Math.round(newlistings.getBoundingClientRect().height);
                    if (channelVideoHeight != newlistingsHeight) {
                        channelVideoHeight = newlistingsHeight;
                        applySeenBars();
                    }
                },{ childList: true });

                qs('#channel-tabs').classList.add('seeing');
            }

            applySeenBars();
        }
        else if (BC.homepage || BC.categorypage) {
            BC.page = 'homepage';
            let listingTabs = qs('#listing-tabs.seeing');
            let listingsAll = qs('#listing-all > div.row');
            let listingsPopular = qs('#listing-popular > div.row');

            if (!listingTabs) {
                qs("ul.nav-tabs-list li a[href='#listing-all']")
                  .addEventListener('click', function(e){ applySeenBars() }, false);
                qs("ul.nav-tabs-list li a[href='#listing-popular']")
                  .addEventListener('click', function(e){ applySeenBars() }, false);
                qs("ul.nav-tabs-list li a[href='#listing-subscribed']")
                  .addEventListener('click', function(e){ applySeenBars() }, false);
                qs("ul.nav-tabs-list li a[href='#listing-trending']")
                  .addEventListener('click', function(e){ applySeenBars(); trendingTabs() }, false);

                addListener(listingsAll, function(e) {
                    let newlistings = qs('#listing-all > div.row');
                    let newlistingsHeight = Math.round(newlistings.getBoundingClientRect().height);
                    if (listingsAllHeight != newlistingsHeight) {
                        listingsAllHeight = newlistingsHeight;
                        applySeenBars();
                    }
                },{ childList: true });

                addListener(listingsPopular, function(e) {
                    let newlistings = qs('#listing-popular > div.row');
                    let newlistingsHeight = Math.round(newlistings.getBoundingClientRect().height);
                    if (listingsPopHeight != newlistingsHeight) {
                        listingsPopHeight = newlistingsHeight;
                        applySeenBars();
                    }
                },{ childList: true });

                qs('#listing-tabs').classList.add('seeing');
            }
            listingsAllHeight = Math.round(listingsAll.getBoundingClientRect().height);
            listingsPopHeight = Math.round(listingsPopular.getBoundingClientRect().height);
            applySeenBars();
        }
        else return;
    }

    function trendingTabs(e) {
        qs("ul.nav.nav-tabs li a[href='#trending-day']")
          .addEventListener('click', function(e){ applySeenBars() }, false);
        qs("ul.nav.nav-tabs li a[href='#trending-week']")
          .addEventListener('click', function(e){ applySeenBars() }, false);
        qs("ul.nav.nav-tabs li a[href='#trending-month']")
          .addEventListener('click', function(e){ applySeenBars() }, false);
    }

    function apiUpdater() {
        if (BC.api = qs('video#player')) {
            if (! updater) {
                BC.api.addEventListener('timeupdate', function(e){ onPlayProgress(e); }, false);
                updater = true;
            }
        }
        else window.setTimeout(apiUpdater, 1000)
    }

    function onPlayProgress(e) {
        if (! BC.api) return;
        let active, liveBar, current, i;
        let duration = parseFloat(BC.api.duration);
        let valuenow = parseFloat(BC.api.currentTime);
        let completed = Math.ceil(valuenow / duration * 100);
        if (completed > videoViewedMax && completed <= 100) {
            videoViewedMax = completed;
            active = qsa('.video-card.active');
            if (active.length) {
                for (i = 0; i < active.length; i++) {
                    if (liveBar = active[i].querySelector('.video-seen')) {
                        current = parseInt(liveBar.style.width);
                        if (videoViewedMax > current) {
                            liveBar.title = videoViewedMax +'% Watched';
                            liveBar.style.width = videoViewedMax +'%';
                        }
                    }
                    else {
                        let card = active[i].querySelector('.video-card-image');
                        let bar = d.createElement("div");
                        bar.innerText = "&nbsp;";
                        bar.className = "video-seen";
                        bar.title = videoViewedMax +'% Watched';
                        bar.style.width = videoViewedMax +'%';
                        card.insertBefore(bar, card.firstChild);
                    }
                }
            }
        }
        if (completed == 100) {
            watchedlistAdd();
        }
    }

    function applySeenBars(ms = 2000) {
        window.setTimeout(_applySeenBars, ms);
    }

    function _applySeenBars(e) {
        let i, n,
            cards = [],
            selector = '',
            selectors = [
                '.video-card', 
                '.video-trending-image-container', 
                '.channel-videos-container', 
                '.image-container'
            ];

        selectors.some(function(item) {
            if (qs(item) !== null) {
                selector = item.split(',').join(':not([seen]), ') + ':not([seen])';
                if (cards.length) {
                    cards = cards.concat(Array.prototype.slice.call(qsa(selector)));
                }
                else {
                    cards = Array.prototype.slice.call(qsa(selector));
                }
            }
        });

        if (cards.length) {
            try {
                for (i = 0; i < cards.length; i++) {
                    let link = cards[i].querySelector('a');
                    let card = cards[i].querySelector('.video-card-image, .video-trending-image, .channel-videos-image, .image');
                    if (card) {
                        let href = link.getAttribute("href");
                        let video = href.match( /\/video\/([a-z0-9_-]+)\//i );
                        if (video) {
                            if (BC.watched.has(video[1])) {
                                let bar = d.createElement("div");
                                bar.innerText = "&nbsp;";
                                bar.className = "video-seen";
                                bar.title = BC.watched.get(video[1]) +'% Watched';
                                bar.style.width = BC.watched.get(video[1]) +'%';
                                card.insertBefore(bar, card.firstChild);
                            }
                        }
                    }
                    cards[i].setAttribute('seen', 'true')
                }
            } catch (e) {console.error('SeenChute: applyWatchedlist: '+ e);}
        }
    }

    function showMoreListen() {
        let showMore = qs('.show-more');
        if (showMore) {
            showMore.addEventListener('click', function(e) {
                setTimeout(function() {
                    applySeenBars();
                    showMoreListen();
            }, 2000)}, false)
        }
    }

    function watchedlistAdd(e) {
        if (BC.page != 'watchpage') return false;
        let n, update = false;
        if (videoId && videoViewedMax > 1) {
            if (BC.watched.has(videoId)) {
                if (BC.watched.get(videoId) < videoViewedMax) {
                    BC.watched.set(videoId, videoViewedMax)
                }
                update = true;
            }
            if (! update) {
                BC.watched.set(videoId, videoViewedMax);
                let limit = limit_database_To ? parseInt(limit_database_To) : 0;
                if (limit && BC.watched.size > limit) {
                    do {
                        BC.watched.delete(BC.watched.keys().next().value)
                    } while (BC.watched.size > limit)
                }
            }
            GM.setValue('watched', JSON.stringify(Array.from(BC.watched)))
        }

        videoId = '';
        BC.api = null;
        updater = null;
        videoViewedMax = 0;

        return false;
    }

    function qs(selector) { return document.querySelector(selector) }

    function qsa(selector) { return document.querySelectorAll(selector) }

    function addListener(target, fn, config) {
        // jshint ignore:start
        var cfg = {...{attributes:!1, childList:!1, characterData:!1, subtree:!1}, ...config};
        // jshint ignore:end
        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) { fn(mutation) })});
        observer.observe(target, cfg);
        return observer
    }

    function init(e) {
        GM.getValue('watched', "[]").then(function (value) {
            BC.watched = [];
            BC.page = '';
            BC.api = null;
            BC.url = null;
            BC.host = null;
            BC.path = null;
            BC.loaded = !1;
            BC.loader = null;

            if (value && value != '[]') {
                BC.watched = new Map(JSON.parse(value));
            }
            else {
                    /* Install Database */
                GM.setValue('watched', '[ ]');
                window.location.replace(window.location.href);
            }
        }).catch (error => {
            console.error('SeenChute: Error in promise loading watched list: '+ error)
        })
        window.setTimeout(iHaveSeen, 5000)
    }

      /* Not in Frames */
    if (window.self == window.top) init()

}) ();
