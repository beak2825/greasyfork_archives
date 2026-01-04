// ==UserScript==
// @name         Replace Twitter Blue Button with Lists Button
// @namespace    remove_twitter_blue_ad_and_put_lists_back
// @license      GNU GPLv3
// @version      1
// @description  Undoes the change where a Twitter Blue sign-up link replace the Lists button in the sidebar
// @author       Suyooo
// @match        https://twitter.com/
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/459445/Replace%20Twitter%20Blue%20Button%20with%20Lists%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/459445/Replace%20Twitter%20Blue%20Button%20with%20Lists%20Button.meta.js
// ==/UserScript==

const PROFILE_LINK_LABEL = "Profile";

(function() {
    'use strict';

    let listButton, link, lastState;
    const observer = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            $(`header a[href="/i/twitter_blue_sign_up"]`, mutation.target).each((i,e) => {
                listButton = $(e).clone(false).addClass("replacement-button");
                link = $(`header a:has(span:contains("${PROFILE_LINK_LABEL}"))`).attr("href") + "/lists";

                $("svg", listButton).html(`<g><path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z"></path></g>`);
                $("span", listButton).text("Lists");
                $(listButton).attr("href", link);
                $(e).replaceWith(listButton);

                setInterval(() => {
                    if (window.location.href.endsWith(link) || window.location.href.indexOf("/i/lists/") !== -1) {
                        if (!lastState) {
                            listButton.addClass("replacement-button-active");
                            $("svg", listButton).html(`<g><path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15z"></path><path d="M16 10H8V8h8v2zm-8 2h8v2H8v-2z" fill="white"></path></g>`);
                            lastState = true;
                        }
                    } else {
                        if (lastState) {
                            listButton.removeClass("replacement-button-active");
                            $("svg", listButton).html(`<g><path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z"></path></g>`);
                            lastState = false;
                        }
                    }
                }, 500);
                observer.disconnect();
            });
        }
    });

    GM_addStyle("a.replacement-button:not(:hover) > div { background-color: rgba(15, 20, 25, 0); }");
    GM_addStyle("a.replacement-button:hover > div { background-color: rgba(15, 20, 25, 0.1); }");
    GM_addStyle("a.replacement-button-active > div > div:last-child { font-weight: 700; }");

    observer.observe($("body")[0], {childList:true});
})();