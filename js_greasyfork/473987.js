// ==UserScript==
// @name         5ch char count
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Counts how many characters has been read on 5ch
// @author       Kaanium
// @match        https://*.5ch.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=5ch.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473987/5ch%20char%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/473987/5ch%20char%20count.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanText(text) {
        const withoutLinks = text.replace(/https?:\/\/\S+/g, '');
        const regex = /[^\u3040-\u30FF\u31F0-\u31FF\u4E00-\u9FFF]+/g;
        const cleanedText = withoutLinks.replace(regex, '');
        return cleanedText;
    }

    function countChars(content, scrollPositions) {
        var position = window.pageYOffset;
        let readChars = 0;
        var lastValue = 0;
        for (var i = 0; scrollPositions[i] < position; ++i) {
            readChars += cleanText(content[i].textContent).length;
        }
        return readChars;
    }

    function setCharCountCookie(value) {
        document.cookie = `charCount=${value}; expires=Thu, 01 Jan 2100 00:00:00 UTC; path=/; domain=5ch.net`;
    }

    function getCharCountFromCookie() {
        const cookieName = 'charCount=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieParts = decodedCookie.split(';');
        for (let i = 0; i < cookieParts.length; i++) {
            let part = cookieParts[i];
            while (part.charAt(0) === ' ') {
                part = part.substring(1);
            }
            if (part.indexOf(cookieName) === 0) {
                return parseInt(part.substring(cookieName.length), 10);
            }
        }
        return 0;
    }

    function initializeCharCounter() {
        let posts = document.querySelectorAll(".post-content, dd, .threadview_response_body");
        let postScrollPositions = [];
        for (var i = 0; i < posts.length; ++i) {
            postScrollPositions.push(posts[i].getBoundingClientRect().y + window.pageYOffset);
            //postScrollPositions.push(posts[i].offsetTop);
        }

        const threadList = document.querySelector('#thread');

        if (threadList) {
            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        posts = document.querySelectorAll(".threadview_response_body");
                        postScrollPositions = [];
                        for (var i = 0; i < posts.length; ++i) {
                            postScrollPositions.push(posts[i].getBoundingClientRect().y + window.pageYOffset);
                        }
                        previousScrollPosition = window.pageYOffset
                    }
                }
            });

            const config = {
                childList: true,
            };

            observer.observe(threadList, config);
        }

        var previousCookieCount = getCharCountFromCookie();
        var initialPageLoadCount = countChars(posts, postScrollPositions);

        const charCountInput = document.createElement("input");
        charCountInput.type = "text";
        charCountInput.id = "charCount";
        charCountInput.value = previousCookieCount
        charCountInput.style.width = "100px";
        charCountInput.style.marginRight = "10px";
        charCountInput.addEventListener("input", function(e) {
            var inputText = e.target.value;
            setCharCountCookie(inputText);
            previousCookieCount = inputText;
            initialPageLoadCount = countChars(posts, postScrollPositions);
        })
        var isResetting = false;

        const resetButton = document.createElement("button");
        resetButton.textContent = "Reset";
        resetButton.addEventListener("click", function () {
            initialPageLoadCount = countChars(posts, postScrollPositions);
            charCountInput.value = "0";
            setCharCountCookie(0);
            isResetting = true;
        });
        resetButton.addEventListener("touchend", function () {
            initialPageLoadCount = countChars(posts, postScrollPositions);
            charCountInput.value = "0";
            setCharCountCookie(0);
            isResetting = true;
        });

        const charCountContainer = document.createElement("div");
        charCountContainer.style.position = "fixed";
        charCountContainer.style.right = "10px";
        charCountContainer.style.zIndex = "1";
        charCountContainer.appendChild(charCountInput);
        charCountContainer.appendChild(resetButton);
        var header = document.querySelector("#followheader > div") || document.querySelector("body");
        if (header !== document.body) {
            const headerHeight = header.clientHeight;
            charCountContainer.style.top = `${headerHeight + 10}px`;
        }
        header.insertBefore(charCountContainer, header.firstChild);
        var previousScrollPosition = 0;

        function scrollEvent() {
            var currentScrollPosition = window.pageYOffset;

            var mHeader = document.querySelector("#header")
            var mBread = document.querySelector(".breadcrumb")
            if (mHeader && mBread) {
                if(!document.querySelector("body > ul").classList.contains("hidden")) {
                                        console.log(mBread)
                    var headerHeights = mHeader.clientHeight + mBread.clientHeight;
                    charCountContainer.style.top = `${headerHeights + 10}px`
                }
                else {
                    charCountContainer.style.top = "0px"
                }
            }

            if (currentScrollPosition > previousScrollPosition) {
                let readChars = previousCookieCount + countChars(posts, postScrollPositions) - initialPageLoadCount;
                var cookieCount = getCharCountFromCookie();
                if (isResetting) {
                    previousCookieCount = cookieCount;
                    initialPageLoadCount = countChars(posts, postScrollPositions);
                    readChars = 0;
                    isResetting = false;
                } else if (cookieCount > readChars) {
                    previousCookieCount = cookieCount;
                    initialPageLoadCount = countChars(posts, postScrollPositions);
                    readChars = previousCookieCount;
                } else if (readChars > cookieCount + 700) {
                    previousCookieCount = cookieCount;
                    initialPageLoadCount = countChars(posts, postScrollPositions);
                    readChars = cookieCount;
                }
                charCountInput.value = readChars.toString();
                setCharCountCookie(readChars);
                previousScrollPosition = currentScrollPosition;
            }
        }

        window.addEventListener("scroll", scrollEvent);
        window.addEventListener("touchmove", scrollEvent);

    }

    function waitForDocumentComplete(callback) {
        if (document.readyState === "complete") {
            callback();
        } else {
            setTimeout(function() {
                waitForDocumentComplete(callback);
            }, 50);
        }
    }

    waitForDocumentComplete(initializeCharCounter);
})();