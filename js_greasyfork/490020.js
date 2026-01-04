// ==UserScript==
// @name         小説家になろう デザイン調整スクリプト
// @namespace    https://github.com/todkuro/
// @author       todokuro
// @version      0.8
// @description  小説家になろうの表示の改善を目的としたTampermonkey/Violentmonkey用スクリプト
// @match        https://syosetu.com/*
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490020/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%20%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E8%AA%BF%E6%95%B4%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/490020/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%20%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E8%AA%BF%E6%95%B4%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = jQuery;

    // ブクマのしおり・最新話ボタンの調整
    const adjustBookmarkEpButtons = (node) => {
        const buttonCombo = node.closest(".p-up-bookmark-item__button-group");
        // 最初から読む or bookmark
        if(node.is(".p-up-bookmark-item__button-group a.c-button:nth-child(odd)")) {
            node.removeClass("c-button--primary");
            node.addClass("c-button--outline");
            if(node.find("[class*='--siori']").length >= 1) {
                buttonCombo.addClass("__has_shiori");
            } else {
                buttonCombo.addClass("__none_shiori");
            }
        }
        // 最新ep
        if(node.is(".p-up-bookmark-item__button-group a.c-button:nth-child(even)")) {
            const unread = buttonCombo.find("a.c-button:nth-child(even) .p-up-bookmark-item__unread,a.c-button:nth-child(even) .p-up-activity-item__unread");
            if(unread.length) {
                node.append(unread.remove());
                buttonCombo.addClass("___has_unread");
                const cnt = parseInt(unread.find(".p-up-bookmark-item__unread-num,.p-up-activity-item__unread-num").text() || "0");
                if (cnt == 1) {
                    buttonCombo.addClass("__unread_one");
                } else if (cnt >= 2) {
                    buttonCombo.addClass("__unread_many");
                }
            }
        }
    };

    // ブクマの設定ボタンのメニューを単純なリンクに
    const adjustBookmarkSettingButton = (node) => {
        node.contents().each((idx,elm) => {
            if(elm.nodeType !== Element.TEXT_NODE) return;
            elm.remove();
        });
        node.removeClass("c-up-dropdown");
        node.removeClass("c-up-dropdown--hover");
        const settingLink = node.find("li.c-up-dropdown__item:nth-child(odd) a").remove();
        node.find("ul").remove();
        node.append(settingLink);
    };

    // カテゴリ内をプルダウンじゃなくリンクボタンにする
    const replaceBookmarkCategory = (node) => {
        const newDiv = $("<div>").attr("class", "___narou_bookmark");
        const current = node.wrapInner(newDiv).children(0).unwrap();
        const hasSelected = current.children("option[value][selected]").length >= 1;
        current.children("option[value]").each((idx, elm) => {
            const selected = hasSelected ? $(elm).is("[selected]") : idx === 0;
            const link = $(elm).wrapInner($("<a>").attr("href", $(elm).val())).children(0).unwrap();
            if(selected) link.addClass("___selected");
        });
    };

    const forEachNodes = (mutation, target, mutationHandler) => {
        mutation.addedNodes.forEach((node) => {
            if (!$(node).is(target)) return;
            mutationHandler($(node));
        });
    };

    let status = false
    let bookmarkCategory = undefined;
    // MutationObserver
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type !== "childList") continue;
            if (mutation.target.className === "l-footer") {
                observer.disconnect();
            }
            if ($(mutation.target).is(".l-main .c-up-list-tools") && !isSmartPhone) {
                forEachNodes(mutation, ".p-up-bookmark-category", (elm) => {
                    bookmarkCategory = elm.remove();
                });
            }
            if (bookmarkCategory) {
                if ($(mutation.target).is(".l-container")) {
                    status = true;
                    forEachNodes(mutation, ".l-sidebar", (elm) => {
                        elm.append(bookmarkCategory);
                    });
                }
            }
            if ($(mutation.target).is(".c-form__group")) {
                forEachNodes(mutation, "select.js-bookmark_list_form_select", replaceBookmarkCategory);
            }
            if ($(mutation.target).is(".p-up-bookmark-item__button-group,.p-up-bookmark-item__header")) {
                forEachNodes(mutation, ".c-button", adjustBookmarkEpButtons);
                forEachNodes(mutation, ".p-up-bookmark-item__menu", adjustBookmarkSettingButton);
            }

            // 上とほぼ同じ処理。個別でなくbodyにまとめて入ってくることがある
            if ( !status && $(mutation.target).find(".l-main .c-up-list-tools").length >= 1 ) {
                const elm = $(mutation.target).find(".l-main .p-up-bookmark-category");
                bookmarkCategory = elm.remove();
                $(mutation.target).find(".l-container .l-sidebar").each((idx, elm) => {
                    $(elm).append(bookmarkCategory);
                });
                if ( !status.container && $(mutation.target).find(".l-container").length >= 1 ) {
                    forEachNodes(mutation, ".l-sidebar", (elm) => {
                        elm.append(bookmarkCategory);
                    });
                }
                if ($(mutation.target).find(".c-form__group").length >= 1) {
                    $(mutation.target).find(".c-form__group select.js-bookmark_list_form_select").each((idx,elm) => {
                        replaceBookmarkCategory($(elm));
                    });
                }

                const bookmarkItems = $(mutation.target).find(".p-up-bookmark-item");
                if (bookmarkItems.length >= 1) {
                    bookmarkItems.find(".c-button").each((idx,elm) => adjustBookmarkEpButtons($(elm)));
                    bookmarkItems.find(".p-up-bookmark-item__menu").each((idx,elm) => adjustBookmarkSettingButton($(elm)));
                }
            }
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    /*css*/
    const newCss = `
body {
    font-family: 'UD デジタル 教科書体 NP-B', 'Meiryo', 'MS PGothic', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', sans-serif;
}
.c-up-tab__label {
    padding: 3px 0 0;
}
a,
.p-up-bookmark-item__title>a,
.p-up-bookmark-item__name>a,
.___narou_bookmark a {
    color: #0033cc;
}
a.c-button--outline,
a.c-button--primary {
    color: #0033cc !important;
}
.___narou_bookmark a:hover {
    background: #dddddd !important;
}
.p-up-bookmark-item .__unread_one a:nth-child(even) {
    background-color: #bfe6aa;
}
.p-up-bookmark-item .__unread_many a:nth-child(even) {
    background-color: #ffe4c4;
}
.p-up-bookmark-item .__none_shiori a:nth-child(even) {
    background-color: #ffdddd;
}
.__unread_many .p-up-bookmark-item__unread {
    color: #ff0000 !important;
}

.l-container {
    flex-direction: row-reverse;
}

.c-form .c-form__label {
    position: relative;
}
.c-form .c-form__label span.p-up-bookmark-category__setting {
    position: absolute;
    right: 0;
}
.l-content .c-form .c-form__label span.p-up-bookmark-category__setting {
    top: -15px;
}

.l-content .c-form .___narou_bookmark {
    text-align: center;
    background: #ffffff;
    line-height: 0;
}
.l-content .c-form .___narou_bookmark a {
    display: inline-block;
    width: calc(100% / 3.2);
    line-height: 2.5;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 0.9em;
}
.l-sidebar .___narou_bookmark a {
    white-space: nowrap;
    line-height: 2em;
    display: block;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 5px 12px;
    margin-bottom: -1px;
    background: #ffffff;
}
.___narou_bookmark a.___selected {
    background: #f5f5dc;
}

div.l-page-title,
div.c-up-page-description {
    display: none;
}
h3.c-up-headline {
    line-height: 0.5;
}
.c-up-chk-item__content {
    width: 90%;
}
.c-up-pager {
    background-color: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.1);
}
.c-up-filter {
    display: flex;
    flex-flow: row-reverse nowrap;
    margin-bottom: 5px !important;
}
.c-up-filter__hit-number {
    flex: 2 1 auto;
}
.c-up-filter__hit-number .c-up-hit-number {
    display: flex;
    flex-flow: row wrap;
}
.c-up-filter__tools {
    flex: 1 2 auto;
    display: flex;
    flex-flow: row wrap;
    align-items: flex-end;
    justify-content: right;
}
.c-up-filter__tools > * {
    width: 11em;
}
.c-up-filter__tools div.c-up-filter__item {
    margin: 0;
}

.c-up-panel__list-item.p-up-bookmark-item {
    position: relative;
}
div.p-up-bookmark-item__menu {
    font-size: 0.8em;
    color: #1b8ef3;
}
span.p-up-bookmark-item__setting {
    position: absolute;
    top: -1px;
    right: 56px;
    text-align: right;
}
.c-up-panel__header.c-up-panel__header--toolbar {
    background: #f1f3f5;
    padding-top: 0;
    z-index: 4;
}
.c-up-panel__header.c-up-panel__header--toolbar button.c-up-panel__button {
    background: #ffffff;
}

.p-up-bookmark-item__title {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    white-space: nowrap;
    display: inline-block;
    vertical-align: middle;
}

.p-up-bookmark-item__info {
    display: flex;
}
.p-up-bookmark-item__author {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;
    vertical-align: middle;
    flex-grow: 1;
    width: 7.5em;
}
.p-up-bookmark-item__status {
    text-align: right;
    display: block;
}
`;
    /*!css*/

    const styleLink = $('<style>');
    styleLink.text(newCss);
    $("head").append(styleLink);

})();
