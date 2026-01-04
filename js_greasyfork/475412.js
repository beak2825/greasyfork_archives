// ==UserScript==
// @name         Bluesky Tweaks - Companion Userscript
// @namespace    https://bsky.app/
// @version      3.0
// @description  Companion Userscript for Bluesky Tweaks to enable Banner As Background and better support Stars over Hearts. Might need optimization?
// @author       @wolfdo.gg, @robins.one
// @match        https://bsky.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bsky.app
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/475412/Bluesky%20Tweaks%20-%20Companion%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/475412/Bluesky%20Tweaks%20-%20Companion%20Userscript.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function bannerChange(url, img) {
        if (url == "placeholder") {
            document.body.style.setProperty("--user-banner-image", '');
            document.body.style.setProperty("--placeholder-opacity", 1);
        } else {
            document.body.style.setProperty("--user-banner-image", 'url(' + url + ')');
            document.body.style.setProperty("--placeholder-opacity", 0);
        }
    }

    function likeMutation(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'characterData') {
                var newTextContent = lastLikeElement.textContent;
                lastExpandedElement.setAttribute('data-current-likes', newTextContent);
                console.log(newTextContent);
            }
        }
    }

    let lastLikeElement = null;
    let lastExpandedElement = null;
    let likeObserver = new MutationObserver(likeMutation);

    function handleMutation(evts) {
        evts.forEach((e) => {
            if (e.target.hasAttribute("testid")) {
                if (e.target.getAttribute("testid") == "userBannerImage") {
                    let newUrl = e.target.src;
                    bannerChange(newUrl, e);
                }
            } else if (e.target.hasAttribute("data-testid")) {
                let attr = e.target.getAttribute("data-testid")
                if (attr == "userBannerFallback") {
                    bannerChange("placeholder", null);
                } else if (attr == "likeCount") {
                    console.log("Found likes")
                    var textInside = e.target.textContent;
                    var postThreadItem = e.target.closest('[data-testid*="postThreadItem"]')
                    if (postThreadItem) {
                        var likeCount = postThreadItem.querySelector('[data-testid*="likeCount-expanded"]')
                        if (likeCount) {
                            likeCount.setAttribute('data-current-likes', textInside);
                            console.log(textInside);
                            lastLikeElement = e.target;
                            lastExpandedElement = likeCount
                            likeObserver.disconnect();
                            likeObserver.observe(e.target, { characterData: true, attributes: false, childList: true, subtree: true });
                        }
                    }
                } else if (attr.includes("feedItem")) { // Notification item
                    if (e.target.closest('[data-testid*="notificationsScreen"]')){
                        var involvedText = e.target.querySelector('.css-146c3p1[aria-label]:not(.bsky-tweaks-conjunction)')
                        if (involvedText) {
                            involvedText.style.setProperty('--textColor', involvedText.style.color);
                            var observer = new MutationObserver(function(mutations) {
                                mutations.forEach(function(mutationRecord) {
                                    involvedText.style.setProperty('--textColor', involvedText.style.color);
                                });
                            });
                            observer.observe(involvedText, { attributes : true, attributeFilter : ['style'] });


                            var iter = document.createNodeIterator(involvedText, NodeFilter.SHOW_TEXT),
                                textnode;
                            while (textnode = iter.nextNode()) {
                                if (!textnode.parentNode.closest('.bsky-tweaks-conjunction')) {
                                    if (textnode.textContent == " and ") {
                                        let newSpan = document.createElement('span');
                                        newSpan.appendChild(document.createTextNode(textnode.nodeValue));
                                        newSpan.classList.add("bsky-tweaks-conjunction");
                                        newSpan.setAttribute('style', involvedText.style.cssText)
                                        newSpan.style.removeProperty('color');
                                        newSpan.style.removeProperty('--textColor');
                                        textnode.replaceWith(newSpan);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        this.disconnect();
    }

    // Intercept all requests to create an element
    let realCreateElement = document.createElement;
    document.createElement = function(tagname) {
        if (tagname == "img") {
            let el = realCreateElement.bind(this)(tagname);
            let mutationObserver = new MutationObserver(handleMutation);
            mutationObserver.observe(el, {
                attributeFilter: ["testid"],
                attributeOldValue: true,
            });

            setTimeout(() => {
                mutationObserver.disconnect();
            }, 4000); //disconnect after four seconds in case literally nothing happens
            return el;
        } else if (tagname == "div") { //test for banner placeholders
            let el = realCreateElement.bind(this)(tagname);
            let mutationObserver = new MutationObserver(handleMutation);
            mutationObserver.observe(el, {
                attributeFilter: ["data-testid"],
                attributeOldValue: true,
            });

            setTimeout(() => {
                mutationObserver.disconnect();
            }, 2000); //disconnect after two seconds in case literally nothing happens
            return el;
        } else {
            return realCreateElement.bind(this)(tagname);
        }
    }
})();