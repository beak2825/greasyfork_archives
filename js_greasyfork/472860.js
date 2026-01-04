// ==UserScript==
// @name         LztStreamerMode
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Режим стримера для Lolzteam
// @author       vuchaev2015
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/472860/LztStreamerMode.user.js
// @updateURL https://update.greasyfork.org/scripts/472860/LztStreamerMode.meta.js
// ==/UserScript==

let badWords = ['негр'] // список запрещенных слов

window.onload = function() {
    var newLi = document.createElement('li');
    newLi.style.cssText = 'display: flex; align-items: center; justify-content: center';

    var newInput = document.createElement('input');
    Object.assign(newInput, { type: 'checkbox', name: 'hide_banner', value: '1', id: 'ctrl_streamer_mode' });

    var newLabel = document.createElement('label');
    Object.assign(newLabel, { htmlFor: 'ctrl_streamer_mode', textContent: 'LZT Streamer Mode' });

    newLi.append(newInput, newLabel);

    var accountMenu = document.querySelector('#AccountMenu > ul > li:nth-child(1) > a');

    if (accountMenu) {
        var separator = document.createElement('div');
        separator.classList.add('account-menu-sep');
        accountMenu.parentNode.insertBefore(separator, accountMenu.nextSibling);

        accountMenu.parentNode.insertBefore(newLi, separator.nextSibling);

        var savedValue = GM_getValue('lztstreamermode');
        if (savedValue === undefined) {
            GM_setValue('lztstreamermode', false);
            savedValue = false;
        }
        newInput.checked = savedValue;

        newInput.addEventListener('change', function() {
            GM_setValue('lztstreamermode', this.checked);
            location.reload();
        });
    }
}

var lztStreamerMode = GM_getValue('lztstreamermode');
console.log(`Текущее значение lztstreamermode: ${lztStreamerMode}`)

if (lztStreamerMode !== undefined && lztStreamerMode !== false) {
    const selectors = [
        "#ConversationListItems",
        "#AlertPanels",
        "#AccountMenu > ul > li.Popup.PopupInPopup.DisableHover > a > span.left",
    ];

    const applyBlur = (selector, trigger = 'hover', ignoredSelectors = []) => {
        const elements = document.querySelectorAll(selector);

        const changeVisibility = (el, visible) => {
            el.style.visibility = visible ? "visible" : "hidden";
        };

        const toggleBlur = (el) => {
            el.style.filter = el.style.filter.includes("blur") ? "none" : "blur(5px)";
        };

        elements.forEach((el) => {
            if (el.classList.contains("blurred")) return;

            if (trigger === 'hidden') {
                changeVisibility(el, false);
                return;
            }

            el.style.filter = "blur(5px)";
            el.classList.add("blurred");

            const isIgnored = (target) =>
            ignoredSelectors.some((selector) => target.matches(selector));

            if (trigger === 'click') {
                el.addEventListener("click", () => {
                    if (!isIgnored(event.target)) toggleBlur(el);
                });
            } else {
                el.addEventListener("mouseover", () => {
                    if (!isIgnored(event.target)) el.style.filter = "none";
                });
                el.addEventListener("mouseout", () => {
                    if (!isIgnored(event.target)) el.style.filter = "blur(5px)";
                });
            }
        });
    };

    function TextCensor(text_list) {
        var regexList = text_list.map(word => new RegExp(word, 'gi'));

        document.querySelectorAll('*').forEach(element => {
            Array.from(element.childNodes).forEach(node => {
                if (node.nodeType === 3) {
                    var replacedText = node.nodeValue;

                    regexList.forEach(regex => {
                        replacedText = replacedText.replace(regex, match => '*'.repeat(match.length));
                    });

                    if (replacedText !== node.nodeValue) {
                        element.replaceChild(document.createTextNode(replacedText), node);
                    }
                }
            });
        });
    }


    function applyBlurIfMatchesUrl(url, selector, trigger) {
        if (window.location.href.startsWith(url)) {
            applyBlur(selector, trigger);
        }
    }

    function changeInputType(selector) {
        var inputElements = document.querySelectorAll(selector);
        for (var i = 0; i < inputElements.length; i++) {
            inputElements[i].type = 'password';
        }
    }

    function applyBlurToBBCodeHide(selector, trigger) {
        const elements = document.querySelectorAll(selector);

        elements.forEach((el) => {
            if (el.classList.contains("blurred")) return;

            const quote = el.querySelector("div.quote");
            const quoteContainer = el.querySelector(
                "blockquote.quoteContainer.hideContainer"
            );
            const attribution = el.querySelector("aside > div.attribution.type");

            if (quote && quoteContainer && attribution) {
                quote.style.filter = "blur(5px)";
                el.classList.add("blurred");

                if (trigger === 'click') {
                    quoteContainer.addEventListener("click", function (event) {
                        if (event.target === quoteContainer) {
                            quote.style.filter = quote.style.filter.includes("blur")
                                ? "none"
                            : "blur(5px)";
                        }
                    });

                    quote.addEventListener("click", function (event) {
                        if (event.target === quote) {
                            quote.style.filter = quote.style.filter.includes("blur")
                                ? "none"
                            : "blur(5px)";
                        }
                    });
                } else {
                    quoteContainer.addEventListener("mouseenter", () => { quote.style.filter = "none"; });
                    quoteContainer.addEventListener("mouseleave", () => { quote.style.filter = "blur(5px)"; });
                }
            }
        });
    }

    const applyBlurToAllSelectors = () =>
    selectors.forEach((selector) => {
        if (selector === ".bbCodeHide") {
            applyBlurToBBCodeHide(selector, "click");
        } else {
            applyBlur(selector);
        }
    });

    const hideInboxElement = () => {
        const selectors = ['.thread_view input.InlineModCheck.item', '.thread_view .modLink.navLink'];
        selectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('hidden');
            }
        });
    };

    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const affectedNodes = Array.from(mutation.addedNodes).concat(Array.from(mutation.removedNodes));
                if (affectedNodes.some(node => node.matches && node.matches(selectors.join(', ')))) {
                    hideInboxElement();
                    break;
                }
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    function initialize() {
        applyBlurToAllSelectors();
        applyBlurIfMatchesUrl("https://zelenka.guru/account/security", "#ctrl_email", "click");
        applyBlurIfMatchesUrl("https://zelenka.guru/account/alerts", ".alertGroup ol", "hover");

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    changeInputType('input[name="secret_answer"]');
                    applyBlurToBBCodeHide('.bbCodeHide', "click");
                    applyBlur('[id^="imn-XenForoUniq"] span.message');
                    applyBlur('.liveAlert.listItemText li[id^="alert"]');
                    applyBlur('.scrollable.scrollable-vertical.lztng-lgi902:not(:has(.userAc-inner.lztng-1rks6og))', "click", [".chat2-tag.lztng-1hpx4rn", ".scrollable-y.lztng-lgi902"]);
                    applyBlur('#ConversationsMenu > div.scroll-wrapper.listPlaceholder.Scrollbar.scrollbar-macosx.scrollbar-dynamic');
                    TextCensor(badWords)
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    if (document.readyState !== 'loading') {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize);
    }

};