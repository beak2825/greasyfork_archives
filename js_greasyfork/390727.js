// ==UserScript==
// @name         Tweetdeck: Tweaks
// @version      1.0.1
// @description  Exactly what it says on the tin.
// @author       twitter.com/Automalix
// @namespace    https://greasyfork.org/users/322117
// @match        http://*tweetdeck.twitter.com/*
// @match        https://*tweetdeck.twitter.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/390727/Tweetdeck%3A%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/390727/Tweetdeck%3A%20Tweaks.meta.js
// ==/UserScript==

(function(){
    'use strict';

    const waitForElement = selector => {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            let observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    let nodeArr = [...mutation.addedNodes];
                    for (let node of nodeArr) {
                        if (node.matches && node.matches(selector)) {
                            observer.disconnect();
                            resolve(node);
                            return;
                        }
                    };
                });
            });
            observer.observe(document.documentElement, {childList: true, subtree: true});
        });
    }
    const addCSS = css => {
        let head = document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    const qs = element => document.querySelector(element);
    waitForElement('.js-app-content')
        .then(() => {
        addCSS(`
            @media only screen and (max-width: 1200px) {
                .is-wide-columns .column, section.js-column {
                    width:100% !important;
                }
            }
            @media only screen and (min-width: 1200px) {
                .is-wide-columns .column, section.js-column {
                    width:50% !important;
                }
            }
            @media only screen and (min-width: 1400px) {
                .is-wide-columns .column, section.js-column {
                    width:33% !important;
                }
            }
            .media-item, .media-item {
                background-size: cover;
                background-position: 50% 0;
            }
            .btd-on [data-btdtheme] .js-media[data-key] .js-media-image-link {
                background-color: #38393b;
            }
            .is-wide-columns .media-size-medium {
                height:200px;
            }
            div.nav-user-info.cf.margin-h--4.txt-size--14 {
                left: -9px !important;
            }
            html.btd-on [data-btdtheme="dark"].btd__minimal_mode .dropdown-menu, html.btd-on [data-btdtheme="dark"].btd__minimal_mode .typeahead {
                background-color: none !important;
            }
            html.dark .is-wide-columns .app-columns {
                padding-left: 1px
            }
            .app-nav-tab-text, .js-column-nav-menu-flyover, .column-nav-flyout {
                margin-left: -18px;
            }
            .is-condensed .column-nav-link::after {
                margin-right: -6px;
            }
        `);
        qs('.js-column-nav-scroller').style.cssText = "left: -11px; width: 50px;";
        qs('.app-navigator').style.cssText = "left: -10px; width: 50px;";

        qs('#column-navigator').style.cssText = "right: -12px; bottom: -17px;";

        qs('button.js-show-drawer').style.cssText = "left: -8px; height: 34px; width: 34px";

        qs('.app-header.is-condensed').style.cssText = "width: 42px";
        qs('.app-header-inner').style.cssText = "min-width: 42px";
        qs('.is-condensed .app-content').style.cssText = "left: 42px";
        qs('.js-logo').style.cssText = "width: 42px";

        qs('button.js-header-action').style.cssText = "left: -9px";
    });
    waitForElement('.js-hide-drawer')
        .then(() => {
            qs('.js-hide-drawer').style.cssText = "margin-left:-9px; margin-right: 0"; // button that opened the new tweet drawer
        })
    //waitForElement('.drawer')
    //    .then(() => {
    //        console.log('hi');
    //        document.querySelector('drawer').style.left = "-288px";
    //        document.querySelector('.attach-compose-buttons').style.cssText = "margin-left:-8px; margin-right: 0"
    //        document.querySelector('.js-hide-drawer').style.cssText = "margin-left:-8px; margin-right: 0";
    //        addCSS('.js-hide-drawer {margin-left:-10px !important; left:-10px !important}');
    // });


})();