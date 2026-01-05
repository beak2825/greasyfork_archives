// ==UserScript==
// @author          Jack_mustang
// @version         5.0
// @name            ExtendYouPorn
// @description     Remove ads, enlarges video, stops autoplay keeping buffering, fixes the overhaul style & block pop-ups
// @date            2017 October 3
// @include         *youporn.com/*
// @include         *youporngay.com/*
// @run-at          document-start
// @grant           none
// @license         Public Domain
// @icon            https://gmgmla.dm2301.livefilestore.com/y2pYluU8jK3EnLV1U8D92pYCC9wU5O04Il4j64Ft_pjKGpUG_I5L0fUHrsLpUB4oDCLIJdWp9Bwmr0RPMdhJhl5Bo362RwjatCFUpNjEdMosGA/EYP-logo.jpg
// @namespace       14fac5d83892686b90beea51d35d1d7dbcfe49b6
// @downloadURL https://update.greasyfork.org/scripts/2105/ExtendYouPorn.user.js
// @updateURL https://update.greasyfork.org/scripts/2105/ExtendYouPorn.meta.js
// ==/UserScript==

// Block popups fallback
function NoOpen() { return 1; }
parent.open = NoOpen;
this.open = NoOpen;
window.open = NoOpen;
open = NoOpen;
window.open = function () { return; };
open = function () { return; };
this.open = function () { return; };
parent.open = function () { return; };

function fnull() {
    return null;
}

// Block ads
Object.defineProperty(window, "adDelivery", {
    get: fnull,
    set: fnull
});
Object.defineProperty(window, "tj_ads", {
    get: fnull,
    set: fnull
});
Object.defineProperty(window, "tj_channels", {
    get: fnull,
    set: fnull
});

// stop autoplay
Object.defineProperty(window, "MHP1138", {
    set: function (e) {
        if (!!e.players.videoContainer) {
            e.players.videoContainer.autoplay = false;
            e.players.videoContainer.autoPlayVideo.enabled = false;
            e.players.videoContainer.flashSettings.autoplay = false;
        }
        window.MHP1138a = e;
    },
    get: function () {
        return window.MHP1138a;
    }
});

// YouPorn overrides this function, we need to to auto-centre
window.scrollVid = window.scrollTo;

(function addStyle() {
    // While <head> is not loaded we keep trying
    if (!document.querySelector("head")) {
        return setTimeout(addStyle, 50);
    }

    // We create an object and start including its content to include in DOM at the end
    var eypcss =
    // Hide ads while we can't remove them
    "iframe,\
    figure,\
    aside,\
    .ad-links-text,\
    .channelSideAd,\
    .sixteen-column.channel-header," +
    // Ad block message
    "#adblock_1," +
    // Change pause button
    "#pb_template > :not(.mhp1138_playerStateIcon)," +
    // Pornstars page, pornstars in one line
    ".nine-column .porn-star-list:last-child {\
        display: none !important;\
    }" +
    // vids in one line, on pornstars page
    ".column-flex,\
    div.eight-column:not(.title-select),\
    div.eight-column .row,\
    .pornstars-list .nine-column,\
    .pornstars-list .nine-column .row {\
        width: 100% !important;\
    }";

    // Inject created CSS
    var eypnode = document.createElement("style");
    eypnode.type = "text/css";
    eypnode.id = "EYP-style";
    eypnode.appendChild(document.createTextNode(eypcss));
    document.head.appendChild(eypnode);
}());

(function ExtendYouPorn(){
    function videoStuff() {
        // Scroll video to middle of page
        function scrollthere() {
            var player = document.getElementById('videoContainer');
            var vh = player.offsetHeight;
            var vd = ((document.querySelector("#network-bar").offsetHeight > 0) ? 0 : 25) + ((player.parentNode.offsetTop == 0)? ((document.querySelector('#studioCanvas'))? document.querySelector('.grid_8.alpha').offsetTop : document.querySelector('.watchWrapper').offsetTop+document.querySelector('#videoCanvas').offsetTop ) : player.parentNode.offsetTop);
            var fh = window.innerHeight;
            sc = vd - ((fh - vh) / 2);
            scrollVid(0, sc);
            // console.info("** ExtendYouPorn **\ntop: " + vd + ", height: " + vh + ", scrolled: " + sc + ", window: " + fh);
        }
        // Inject this function to page
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = scrollthere.toString();
        script.id = "EYP-scrollVid";
        document.body.appendChild(script);
        scrollthere();

        // Keyboard Shortcut for centring
        window.addEventListener('keyup', function (e) {
            if (e.ctrlKey && e.altKey && (e.code === "KeyC" || (e.code === undefined && e.keyCode === 67))) {
                scrollthere();
            }
        }, false);

        // Include button in right corner to center video on screen
        var node = document.createElement("div");
        node.setAttribute("style","position: fixed;" +
                                  "bottom: 0;" +
                                  "right: 0;" +
                                  "cursor: pointer;" +
                                  "color: #fff;" +
                                  "background: #ec567c;" +
                                  "border-top-left-radius: 3px;" +
                                  "text-align: center;" +
                                  "font-size: 12px;" +
                                  "padding: 7px;" +
                                  "z-index: 999999;");
        node.setAttribute("onclick", "scrollthere();");
        node.setAttribute("title", "Use the keyboard shortcut Ctrl+Alt+C (For other keyboard layouts use the key where C should be on the QWERTY layout)");
        node.innerHTML = "Centre";
        node.id = "EYP-scroll";
        document.body.appendChild(node);
    }

    var observer = new MutationObserver(function (changes) {
        changes.forEach(function (chg) {
            if (!!chg.target.className) {
                // remove ad spaces
                if (!!chg.target.className.match(/responsiveIframe/)) {
                    var node = chg.target.parentNode;
                    if (node.parentNode.children.length === 1 && !node.parentNode.className.match(/column/)) {
                        node = node.parentNode.parentNode;
                    }
                    node.parentNode.removeChild(node);
                    return;
                }
                // wide player
                if (!!chg.target.className.match(/playWrapper/)) {
                    chg.target.className = "playWrapper sixteen-column";
                    return;
                }
                // update wide player button
                if (!!chg.target.className.match(/mhp1138_front/)) {
                    chg.target.childNodes.forEach(function (node) {
                        if (!!node.className.match(/mhp1138_cinema/)) {
                            node.className = "mhp1138_cinema mhp1138_cinemaState";
                            return;
                        }
                    });
                    return;
                }
                // centre video
                if (chg.target.id === "videoContainer") {
                    chg.addedNodes.forEach(function (element) {
                        if (!!element && element.id === "pb_template") {
                            console.log(element);
                            var node = document.createElement("div");
                            node.className = "mhp1138_playerStateIcon";
                            node.setAttribute("style", "opacity: 1");
                            node.innerHTML =
                                    "<div class='mhp1138_play' style='display: block'>" +
                                    "    <div class='mhp1138_icon mhp1138_icon-play'></div>" +
                                    "</div>" +
                                    "<div class='mhp1138_background'></div>";
                            element.appendChild(node);

                            videoStuff();
                            return;
                        }
                    });
                }
                return;
            }
        });
    });

    observer.observe(document, {childList: true, subtree: true});
}());
