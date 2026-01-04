// ==UserScript==
// @name         Facepunch LMAO Pics Shortcut
// @namespace    https://forum.facepunch.com
// @version      1.0
// @description  Adds a shortcut to the latest LMAO Pics thread from the forum front page.
// @author       Annoyed Grunt
// @match        https://forum.facepunch.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374376/Facepunch%20LMAO%20Pics%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/374376/Facepunch%20LMAO%20Pics%20Shortcut.meta.js
// ==/UserScript==

var queryUrl = "https://forum.facepunch.com/search/?type=Thread&q=lmao+pics"
var mainPageUrl = RegExp("^(?:https:\\/\\/forum.facepunch.com(?:/*(?:f|forum)?/*))$");
var parameterName = "lmaoJumpLast";

function makeNewForumBlock(titleLabel, subtitleLabel, iconUrl, url) {
    var blockClass = "forumpanel forumblock";
    var linkClass = "bglink";
    var titleClass = "forumtitle";
    var subtitleClass = "forumsubtitle";
    var elementsToDelete = ["forumlastpost", "threadcount", "postcount"];

    var genericForumBlock = document.getElementsByClassName(blockClass)[0];
    var newForumBlock = genericForumBlock.cloneNode(true);

    //Customizing the new forum block
    //Deleting unnecessary elements
    for (let className of elementsToDelete) {
        for (let element of newForumBlock.getElementsByClassName(className)) {
            element.parentNode.removeChild(element);
        }
    }

    //Setting the title and subtitle
    var title = newForumBlock.getElementsByClassName(titleClass)[0];
    title.innerHTML = titleLabel;
    var subtitle = newForumBlock.getElementsByClassName(subtitleClass)[0];
    subtitle.innerHTML = subtitleLabel;

    //Customizing links
    for (let element of newForumBlock.getElementsByClassName(linkClass)) {
        element.href = url;
        element.title = subtitleLabel;

        //Replacing the image
        if (element.nextElementSibling.tagName == "IMG") {
            element.nextElementSibling.src = iconUrl;
        }
    }

    //We're done.
    genericForumBlock.parentNode.insertBefore(newForumBlock, genericForumBlock.nextSibling);
    return newForumBlock;
}

function goToLatestThread() {
    var classToFind = "searchheader";
    var threadUrl = document.getElementsByClassName(classToFind)[0].childNodes[0].href;
    threadUrl += "?" + parameterName + "=true";
    threadUrl += "#unseen";
    window.location.replace(threadUrl);
}

function styleMainPage() {
    var titleLabel = "LMAO Pics."
    var subtitleLabel = "Where all memes go to die.";
    var iconUrl = "https://files.facepunch.com/garry/ce43a86c-03ad-4b03-8b8b-73ad8d713136.svg";

    makeNewForumBlock(titleLabel, subtitleLabel, iconUrl, queryUrl);
}

function shouldJumpToLastPage() {
    var classToFind = "page nextpage";
    var currentUrl = new URL(document.URL);

    if (currentUrl.searchParams.get(parameterName) == "true") {
        if (document.getElementsByClassName(classToFind).length > 0) {
            return true;
        }
    }
    return false;
}

function jumpToLastPage() {
    var classToFind = "page is-last";
    var lastPageUrl = document.getElementsByClassName(classToFind)[0].href;
    lastPageUrl += "#unseen";
    window.location.replace(lastPageUrl);
}

(function() {
    'use strict';

    if (document.URL == queryUrl) {
        goToLatestThread();
    }
    else if (mainPageUrl.test(document.URL)) {
            styleMainPage();
    } else {
        if (shouldJumpToLastPage()) {
            jumpToLastPage();
        }
    }
})();