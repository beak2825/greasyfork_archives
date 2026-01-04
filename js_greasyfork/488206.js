// ==UserScript==
// @name         Youtube - Revert Layout
// @namespace    https://greasyfork.org/en/scripts/488206-youtube-revert-layout
// @version      1.0
// @description  This script will (hopefully) revert the current gross UI/layout Youtube has implemented (for some reason) back to something that resembles the old layout. Also, if something breaks, good ol' F5 might help. PLEASE NOTE: I'm updating this for my own use on Youtube and am sharing it as is. I will not be taking feature requests. There will be bugs and things will break and I may at any time choose to stop updating it entirely.
// @author       Threeskimo
// @match        *.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488206/Youtube%20-%20Revert%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/488206/Youtube%20-%20Revert%20Layout.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer;

    function removeElementByXPath(xpath) {
        var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    function moveElementById(sourceId, targetId) {
        var sourceElement = document.getElementById(sourceId);
        var targetElement = document.getElementById(targetId);
        if (sourceElement && targetElement) {
            targetElement.appendChild(sourceElement);
        }
    }

    function removeAvatarLinks() {
        var avatarLinks = document.querySelectorAll('a#avatar-link');
        avatarLinks.forEach(function(link) {
            link.parentNode.removeChild(link);
        });
    }

    function modifyThumbnailDivs() {
        var thumbnailDivs = document.querySelectorAll('div#thumbnail');
        thumbnailDivs.forEach(function(div) {

            div.removeAttribute("class");

            div.setAttribute("style", "width:167px;position:absolute;");
        });
    }

    function modifyDetailsDivs() {
        var detailsDivs = document.querySelectorAll('div#details');
        detailsDivs.forEach(function(div) {

            div.setAttribute("style", "padding-left:173px;margin-top:-10px;");
        });
    }

    function modifyContentDivs() {
        var contentDivs = document.querySelectorAll('div#content');
        contentDivs.forEach(function(div) {

        });
    }

    function modifyMarginTopByXPath(xpath, marginTopValue) {
        var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) {
            element.setAttribute("style", "margin-top: " + marginTopValue);
        }
    }

    function removeParagraphsWithNew() {
        var paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(function(paragraph) {
            if (paragraph.textContent.trim() === 'New') {
                paragraph.parentNode.removeChild(paragraph);
            }
        });
    }

    function clickExpandButton() {
        var expandButton = document.evaluate("/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-grid/div[5]/div[2]/div/ytd-playlist-panel-renderer/div/div[1]/div/div[1]/yt-icon-button/button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (expandButton && expandButton.getAttribute("aria-label") === "Expand") {
            expandButton.click();
        }
    }

    function modifyPageElements() {
        if (window.location.href.includes("youtube.com/watch")) {
            removeElementByXPath("/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-grid/div[5]/div[1]/div/div[2]/div/ytd-watch-next-secondary-results-renderer/div[2]/ytd-rich-grid-renderer/div[1]");
            moveElementById("secondary-inner", "bottom-grid");
            removeAvatarLinks();
            modifyThumbnailDivs();
            modifyDetailsDivs();
            modifyContentDivs();
            removeParagraphsWithNew();
            modifyMarginTopByXPath("/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-grid/div[5]/div[2]/ytd-watch-next-secondary-results-renderer/div[2]/ytd-rich-grid-renderer/div[5]", "-20px");

            var bottomRow = document.getElementById("bottom-row");
            if (bottomRow) {
                bottomRow.setAttribute("style", "margin-top: -10px; padding-bottom: 5px;");
                var descriptionInner = document.getElementById("description-inner");
                if (descriptionInner) {
                    descriptionInner.insertBefore(bottomRow, descriptionInner.firstChild);
                }
            }

            var aboveTheFold = document.getElementById("above-the-fold");
            if (aboveTheFold) {
                aboveTheFold.setAttribute("style", "padding-top: 10px;");
            }

            var secondaryInner = document.getElementById("secondary-inner");
            if (secondaryInner) {
                secondaryInner.removeAttribute("class");
            }

            var sourceElement = document.evaluate("/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-grid/div[5]/div[1]/div/div[2]/div/ytd-watch-next-secondary-results-renderer", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            var targetElement = document.evaluate("/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-grid/div[5]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (sourceElement && targetElement) {
                targetElement.appendChild(sourceElement);
            }

            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('list') && urlParams.get('list') === 'WL') {

                removeElementByXPath("/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-grid/div[5]/div[2]/ytd-watch-next-secondary-results-renderer/div[2]/ytd-rich-grid-renderer/div[5]");

                clickExpandButton();
            }

            var channelNameTags = document.querySelectorAll('ytd-channel-name#channel-name');
            channelNameTags.forEach(function(tag) {
                tag.style.zIndex = "1";
            });
        }
    }

    function stopTimer() {
        clearInterval(timer);
    }

    timer = setInterval(modifyPageElements, 1000);

    setTimeout(function() {
        document.addEventListener('click', stopTimer);
    }, 5000);
})();
