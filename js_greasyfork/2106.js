// ==UserScript==
// @author          Jack_mustang
// @version         6.0
// @name            ExtendRedTube
// @description     Remove ads, enlarge video, add video download links, block popups and stops autoplay keeping buffering
// @date            2017 October 3
// @include         *redtube.com*
// @include         *redtube.org*
// @include         *redtube.cz*
// @include         *redtube.es*
// @include         *redtube.fr*
// @include         *redtube.it*
// @include         *redtube.kr*
// @include         *redtube.pl*
// @include         *redtube.si*
// @exclude         *blog.redtube.com*
// @exclude         *api.redtube.com*
// @run-at          document-start
// @grant           none
// @license         Public Domain
// @icon            https://gmgmla.dm2301.livefilestore.com/y2phTdvWAn7a3fxjda6GWNCiS1ERegalgwxn5z-65SPxhpws5ISHa-Z8CHpmq18FPUOBm-3QJtCfOYFaiyM0Kji1MwBUy6mkxBLJtc5THpPtEU/ERT-logo.png
// @namespace       44db8537bb6ac3d112dd3b5ec7b6b33b84aa5765
// @downloadURL https://update.greasyfork.org/scripts/2106/ExtendRedTube.user.js
// @updateURL https://update.greasyfork.org/scripts/2106/ExtendRedTube.meta.js
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
        if (!!e.players.redtube_flv_player) {
            e.players.redtube_flv_player.autoplay = false;
            e.players.redtube_flv_player.autoPlayVideo.enabled = false;
            e.players.redtube_flv_player.flashSettings.autoplay = false;
        }
        window.MHP1138a = e;
    },
    get: function () {
        return window.MHP1138a;
    }
});

// Inject CSS
(function addStuff() {
    // While <head> is not loaded we keep trying
    if (!document.querySelector("head")) {
        return setTimeout(addStuff, 50);
    }

    // We create an object and start including its content to include in DOM at the end.
    var ertcss =
    // Hide ads while we can't remove them
    ".tja,\
    .tj_ads_remove,\
    #slidePanelContainerAB,\
    .footerAd,\
    .bvq,\
    .bvq-caption {\
        display: none !important;\
        visibility: hidden !important;\
        opacity: 0 !important;\
        height: 0 !important;\
        overflow: hidden !important;\
        width: 0 !important;\
    }" +
    // Prevent background ad
    "body {\
        background-color: #000 !important;\
    }" +
    // Make thumbs have 4 in every row
    "#home_page_section_c,\
    #community_section_b {\
        display: none;\
    }\
    ul.video-listing.two-in-row {\
        width: 100% !important;\
    }\
    ul.video-listing.two-in-row .first-in-row:nth-child(3) {\
        clear: none;\
        margin-left: 25px;\
    }" +
    // Porstar page
    ".pornstar-small-info,\
    .close-button,\
    .show-less-link {\
        display: none !important\
    }\
    .pornstar-highlight {\
        background: none !important;\
        margin-bottom: -390px !important;\
        width: auto !important;\
        z-index: 2;\
    }\
    .pornstar-details-subscribe {\
        margin-right: 0 !important;\
        padding-left: 235px\
    }\
    .pornstar-all-info {\
        float: right !important;\
        width: 485px !important;\
    }\
    .pornstar-highlight-more {\
        display: block !important\
    }" +
    // PornStars page
    "ul.pornStarsThumbs.four-in-row {\
        width: 100% !important\
    }\
    .pornStarsThumbs.four-in-row > li {\
        clear: none !important;\
        margin: 0 8px 20px 0 !important\
    }\
    .pornStarsThumbs.four-in-row > li:last-child {\
        margin-right: 0 !important;\
    }" +
    // Gallery
    ".gallery-listing.three-in-row .first-in-row {\
        clear: none !important;\
        margin-left: 24px !important;\
    }\
    .galleriesTable .pages {\
        padding: 45px 0 125px 100px;\
    }\
    .gallery-listing.three-in-row li:last-child {\
        position: absolute;\
        bottom: 135px;\
        margin-left: 0 !important;\
    }" +
    // Video Page
    // Enlarge player
    ".video-wrap,\
    .watch,\
    .videoPlayer {\
        width: 100% !important;\
    }\
    .videoPlayer {\
        height: auto !important;\
    }\
    .mhp1138_container .mhp1138_videoWrapper,\
    .mhp1138_container .mhp1138_videoWrapper video {\
        height: auto !important;\
        position: static !important;\
    }" +
    // Change pause button
    "#pb_template > :not(.mhp1138_playerStateIcon) {\
        display: none;\
    }";

    // Inject created CSS
    var ertnode = document.createElement("style");
    ertnode.type = "text/css";
    ertnode.id = "ERT-style";
    ertnode.appendChild(document.createTextNode(ertcss));
    document.head.appendChild(ertnode);
}());

(function ExtendRedTube() {
    function videoStuff() {
        // Scroll video to middle of page
        function scrollthere() {
            var vid = document.querySelector(".watch");
            var vh  = vid.offsetHeight;
            var vd  = vid.offsetTop + document.querySelector("#contentHolder").offsetTop;
            var fh  = window.innerHeight;
            var sc  = vd - ((fh - vh) / 2);
            console.log(vd);
            scrollTo(0, sc);
        }
        // Now inject this function
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = scrollthere.toString();
        script.id = ("ERT-scrollVid");
        document.head.appendChild(script);
        window.setTimeout(scrollthere, 500);

        // Keyboard Shortcut for centring
        window.addEventListener("keyup", function (e) {
            if (e.ctrlKey && e.altKey && (e.code === "KeyC" || (e.code === undefined && e.keyCode === 67))) {
                scrollthere();
            }
        }, false);

        // Include button in right corner to center video on screen;
        var node = document.createElement("div");
        node.setAttribute("style", "position: fixed;" +
                                   "bottom: 0;" +
                                   "right: 0;" +
                                   "top: auto !important;" +
                                   "height: 15px;" +
                                   "cursor: pointer;" +
                                   "background: #121212;" +
                                   "padding: 5px 10px;" +
                                   "border: 1px solid #202020;" +
                                   "z-index: 10000");
        node.setAttribute("onclick", "scrollthere();");
        node.setAttribute("title", "Use the keyboard shortcut Ctrl+Alt+C (For other keyboard layouts use the key where C should be on the QWERTY layout)");
        node.innerHTML = "Centre";
        document.body.appendChild(node);

        // Download withouth being logged
        if (!!document.querySelector("#download-link-hd")) {
            node = document.querySelector("#download-link-hd");
            node.parentNode.appendChild(node.cloneNode());
            node.parentNode.lastElementChild.innerText = node.innerText.match(/[^\n]+/)[0];
            node.parentNode.removeChild(node);
        }
        if (!!document.querySelector("#download-link-480p")) {
            node = document.querySelector("#download-link-480p");
            node.parentNode.appendChild(node.cloneNode());
            node.parentNode.lastElementChild.innerText = node.innerText.match(/[^\n]+/)[0];
            node.parentNode.removeChild(node);
        }
        if (!!document.querySelector("#download-link-mobile")) {
            node = document.querySelector("#download-link-mobile");
            node.parentNode.appendChild(node.cloneNode());
            node.parentNode.lastElementChild.innerText = node.innerText.match(/[^\n]+/)[0];
            node.parentNode.removeChild(node);
        }

        // Thumbnail tabs
        var remtab = document.querySelector(".fakeLinkTabber[rel=related-premium-videos]").parentNode;
        if (!remtab) {
            document.querySelector(".tabsElements").removeChild(remtab);
        }
    }

    var observer = new MutationObserver(function (changes) {
        changes.forEach(function (chg) {
            if (chg.target.id === "redtube_flv_player") {
                chg.addedNodes.forEach(function (element) {
                    if (!!element && element.id === "pb_template") {
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
                    }
                });
            }
        });
    });

    // starts the mutation observer
    observer.observe(document, {childList: true, subtree: true});
}());
