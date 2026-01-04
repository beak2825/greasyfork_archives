// ==UserScript==
// @name         591租屋小幫手
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  隱藏物件、左右看圖
// @author       dbfoxtw
// @match        https://rent.591.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rent.591.com.tw
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/498654/591%E7%A7%9F%E5%B1%8B%E5%B0%8F%E5%B9%AB%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/498654/591%E7%A7%9F%E5%B1%8B%E5%B0%8F%E5%B9%AB%E6%89%8B.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

class Settings {
    getPostHiddenKey(postId) {
        return `post_hidden_${postId}`;
    }

    isPostHidden(postId) {
        var val = GM_getValue(this.getPostHiddenKey(postId));
        return typeof(val) == 'boolean' ? val : false;
    }

    setPostHidden(postId, hidden) {
        GM_setValue(this.getPostHiddenKey(postId), hidden);
        if (hidden) {
            GM_log(`hide ${postId}`);
        } else {
            GM_log(`show ${postId}`);
        }
    }
}

class ListPage {
    #listeners;

    constructor(settings) {
        this.settings = settings;
        this.#listeners = [];
    }

    static isUrlMatched(url) {
        return url == "https://rent.591.com.tw"
        || url == "https://rent.591.com.tw/"
        || url.startsWith("https://rent.591.com.tw/?");
    }

    start() {
        this.#appendCSS();

        var observer = new MutationObserver((mutations) => {
            this.updateList();
        });

        waitForElm('.vue-list-rent-content').then((elm) => {
            observer.observe(elm, {
                attributes: true
            });
            this.updateList();
        });
    }

    #appendCSS() {
        GM_addStyle(`
            .vue-list-rent-item .item-visibility {
                position: absolute;
                top: 28px;
                right: 42px;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
            }

            .vue-list-rent-item .item-visibility.on {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='%239A9A9A'%3E%3Cpath d='m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z'/%3E%3C/svg%3E");
                background-repeat: no-repeat no-repeat;
                background-position: center center;
                background-size: cover;
                top: 27px;
            }

            .vue-list-rent-item .item-visibility.off {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='%239A9A9A'%3E%3Cpath d='M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z'/%3E%3C/svg%3E");
                background-repeat: no-repeat no-repeat;
                background-position: center center;
                background-size: cover;
            }
        `);
    }

    updateList() {
        if ($(".vue-list-rent-content").hasClass("is-fetch")) {
            // List is fetching data, skip update
            return;
        }

        GM_log("Update items visibility");

        this.#clearSettingsListeners();
        $(".vue-list-rent-item").each((index, elm) => {
            var item = $(elm);
            this.#appendVisibilityButton(item);
            this.#updateItem(item, false);
            this.#addSettingsListener(item);
        });
    }

    #appendVisibilityButton(item) {
        var visButtonExist = item.find(".item-visibility").length;
        if (visButtonExist) {
            return;
        }

        $('<div>', {
            class: 'item-visibility',
        }).on("click", () => {
            var postId = Number(item.attr("data-bind"));
            var isHidden = this.settings.isPostHidden(postId);
            this.settings.setPostHidden(postId, !isHidden);
        }).appendTo(item);
    }

    #updateItem(item, animated) {
        var postId = Number(item.attr("data-bind"));
        var isHidden = this.settings.isPostHidden(postId);
        var visButton = item.find(".item-visibility");
        var duration = animated ? 200 : 0;

        if (isHidden) {
            item.fadeTo(duration, 0.2, () => {
                visButton.removeClass("on");
                visButton.addClass("off");
            });
        } else {
            item.fadeTo(duration, 1, () => {
                visButton.removeClass("off");
                visButton.addClass("on");
            });
        }
    }

    #clearSettingsListeners() {
        for(const listener of this.#listeners) {
            GM_removeValueChangeListener(listener);
        }
        this.#listeners = [];
    }

    #addSettingsListener(item) {
        var postId = Number(item.attr("data-bind"));
        var key = this.settings.getPostHiddenKey(postId);
        var listener = GM_addValueChangeListener(key, (key, oldValue, newValue, remote) => {
            this.#updateItem(item, true);
        });
        this.#listeners.push(listener);
    }
};


class DetailPage {
    constructor(settings) {
        this.settings = settings;
    }

    static isUrlMatched(url) {
        const regex = new RegExp('^https:\/\/rent.591.com.tw\/\\d{8}$');
        return regex.test(url);
    };

    start() {
        waitForElm('span[data-behavior-collect]').then((elm) => {
            this.#updateVisibilityButton();
            this.#addSettingsListener();
            this.#addViewerArrowKeyListener();
        });
    }

    #updateVisibilityButton() {
        $(".helper-visibility").remove();

        var postId = this.#getPostIdFromCurrentUrl();
        if (postId < 0) {
            GM_log("Can't get post id from current url");
            return;
        }

        var isHidden = this.settings.isPostHidden(postId);
        var collectButton = $('span[data-behavior-collect]');

        var visButtonHtml = '';
        if (isHidden) {
            visButtonHtml = '<span data-v-95ac2fa6="" class="text helper-visibility"><span data-v-95ac2fa6="" class="svg-icon" style="color: rgb(90, 90, 90); display: inline-block; height: 24px; line-height: 24px; width: 24px; text-align: center;"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5A5A5A"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg></span><b data-v-95ac2fa6="">顯示</b></span>';
        } else {
            visButtonHtml = '<span data-v-95ac2fa6="" class="text helper-visibility"><span data-v-95ac2fa6="" class="svg-icon" style="color: rgb(90, 90, 90); display: inline-block; height: 24px; line-height: 24px; width: 24px; text-align: center;"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5A5A5A"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"></path></svg></span><b data-v-95ac2fa6="">隱藏</b></span>';
        }

        $(visButtonHtml).on("click", () => {
            this.settings.setPostHidden(postId, !isHidden);
        }).insertAfter(collectButton);
    }

    #getPostIdFromCurrentUrl() {
        const currentUrl = window.location.href;
        const regex = new RegExp('^https:\/\/rent.591.com.tw\/(\\d{8})$');
        var found = currentUrl.match(regex);
        return found.length > 1 ? Number(found[1]) : -1;
    }

    #addSettingsListener() {
        var postId = this.#getPostIdFromCurrentUrl();
        if (postId < 0) {
            GM_log("Can't get post id from current url");
            return;
        }

        var key = this.settings.getPostHiddenKey(postId);
        var listenerId = GM_addValueChangeListener(key, (key, oldValue, newValue, remote) => {
            this.#updateVisibilityButton();
        });
    }

    #addViewerArrowKeyListener() {
        $(document).on( "keydown", function(event) {
            var isViewerOpened = $(".viewer-container").length;
            if (!isViewerOpened) return;

            if (event.which == 37) {
                // LEFT ARROW KEY
                $(".control-btn.prev").click();
            } else if (event.which == 39) {
                // RIGHT ARROW KEY
                $(".control-btn.next").click();
            } else if (event.which == 27) {
                // ESCAPE KEY
                $(".close-btn").click();
            }
        });
    }
}

(function() {
    'use strict';

    const currentUrl = window.location.href;
    const settings = new Settings();

    if (ListPage.isUrlMatched(currentUrl)) {
        GM_log("Detect 591 list page");
        const page = new ListPage(settings);
        page.start();
    } else if (DetailPage.isUrlMatched(currentUrl)) {
        GM_log("Detect 591 detail page");
        const page = new DetailPage(settings);
        page.start();
    }
})();

// credit: https://stackoverflow.com/a/61511955
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
