// ==UserScript==
// @name         Twitch, Display sidebar on theater mode
// @name:ja      Twitch, シアターモードでサイドバー表示
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Display sidebar when mouseover player on theater mode
// @description:ja  シアターモードでプレイヤーへマウスオーバーしたときサイドバーを表示する
// @author       You
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        GM.addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/457632/Twitch%2C%20Display%20sidebar%20on%20theater%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/457632/Twitch%2C%20Display%20sidebar%20on%20theater%20mode.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var selectors = {
        theaterMode: ".channel-root__scroll-area--theatre-mode",
        clickHandler: ".click-handler,#root",
        sideNav: ".side-nav",
        topNav: ".top-bar",
    }

    var classes = {
        displaySidebar: "display-sidebar-on-theater-mode",
    }

    function isTheaterMode () {
        return !!document.querySelector(selectors.theaterMode);
    }

    function setVisibilityClass(visible) {
        document.body.classList.toggle(classes.displaySidebar, visible);
    }

    var timer = -1;

    function active(enabled) {
        if (enabled) {
            timer = clearTimeout(timer);
            setVisibilityClass(true);
            timer = setTimeout(() => {
                timer = clearTimeout(timer);
                setVisibilityClass(false);
            }, 5000);
        } else {
            timer = clearTimeout(timer);
            setVisibilityClass(false);
        }
    }

    window.addEventListener("load", () => {
        function onActive(ev) {
            if (!ev.target || !ev.target.closest) return;
            if (ev.target.closest(`${selectors.clickHandler},${selectors.sideNav},${selectors.topNav}`)) {
                active(isTheaterMode());
            }
        }

        function onInactive(ev) {
            if (!ev.target || !ev.target.closest) return;
            if (ev.target.closest(`${selectors.clickHandler},${selectors.sideNav},${selectors.topNav}`)) {
                active(false);
            }
        }

        document.addEventListener("mouseenter", onActive);
        document.addEventListener("mousemove", onActive);
        document.addEventListener("mouseout", onInactive);
    });

    GM.addStyle(`
.${classes.displaySidebar} [data-test-selector="side-nav"] {
    position: relative;
    z-index: 10000;
}
.${classes.displaySidebar} [data-a-target="top-nav-container"] {
    height: 0 !important;
}
.${classes.displaySidebar} .tw-card {
    margin-left: 5em;
}
.${classes.displaySidebar} #channel-player {
    padding-left: 5em;
}
.side-nav-card__avatar:not(.side-nav-card__avatar--offline) .tw-image-avatar {
    border: dotted 2px red;
    box-sizing: content-box;
    transform: translate(-2px, -2px);
}
.side-nav-card__avatar.side-nav-card__avatar--offline {
    filter: none;
}
.side-nav-card__link--offline .side-nav-card__live-status {
    display: none;
}
    `);
})();
