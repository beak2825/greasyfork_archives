// ==UserScript==
// @name        Facebook last post scroller
// @namespace   https://github.com/soufianesakhi/facebook-last-post-scroller
// @description Automatically scroll to the last viewed or marked Facebook story
// @author      https://github.com/soufianesakhi
// @copyright   2016-2017, Soufiane Sakhi
// @license     MIT; https://opensource.org/licenses/MIT
// @homepage    https://github.com/soufianesakhi/facebook-last-post-scroller
// @supportURL  https://github.com/soufianesakhi/facebook-last-post-scroller/issues
// @icon        https://cdn3.iconfinder.com/data/icons/watchify-v1-0-80px/80/arrow-down-80px-128.png
// @require     http://code.jquery.com/jquery.min.js
// @require     https://greasyfork.org/scripts/19857-node-creation-observer/code/node-creation-observer.js?version=174436
// @include     https://www.facebook.com/*
// @include     https://web.facebook.com/*
// @version     1.3.1
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/18033/Facebook%20last%20post%20scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/18033/Facebook%20last%20post%20scroller.meta.js
// ==/UserScript==

/// <reference path="../typings/index.d.ts" />

var storySelector = "[id^='hyperfeed_story_id']";
var subStorySelector = ".userContentWrapper";
var scrollerBtnPredecessorSelector = "#pagelet_composer";
var storyLinkSelector = "div._5pcp span > span > a._5pcq[target]";
var lastPostButtonAppendSelector = "div._5pcp";
var blueBarId = "pagelet_bluebar";
var timestampAttribute = "data-timestamp";
var loadedStoryByPage = 10;
var fbUrlPatterns = [
    new RegExp("https?:\/\/(web|www)\.facebook\.com\/\\?sk\=h_chr", "i"),
    new RegExp("https?:\/\/(web|www)\.facebook\.com\/?$", "i"),
    new RegExp("https?:\/\/(web|www)\.facebook\.com\/\\?ref\=logo", "i")];

var lastPostIconLink = "https://cdn3.iconfinder.com/data/icons/watchify-v1-0-80px/80/arrow-down-80px-128.png";
var iconStyle = "vertical-align: middle; height: 20px; width: 20px; cursor: pointer;";

var lastPostSeparatorTitle = "End of new posts";
var scriptId = "FBLastPost";
var menuId = "FBLastPostMenu";
var lastPostSeparatorId = scriptId + "Separator";
var lastPostURIKey = scriptId + "URI";
var lastPostTimestampKey = scriptId + "Timestamp";
var lastPostScrollerId = getId("Scroller");
var reverseSortLoaderId = getId("ReverseSortLoader");

var lastPostURI = GM_getValue(lastPostURIKey, null);
var lastPostTimestamp = GM_getValue(lastPostTimestampKey, 0);
var storyCount = 0;

/** @type {MutationObserver[]} */
var storyLoadObservers = [];
/** @type {Element[]} */
var loadedStories = [];
/** @type {Element[]} */
var checkedStories = [];
/** @type {Number} */
var previousScrollHeight;
var stopped = false;
var isMostRecentMode = false;
var isHome = false;
var currentURL = null;
/** @type {JQuery} */
var loadingToolbar;
/** @type {JQuery} */
var loadingProgress;
/** @type {Number} */
var timeSinceLastpost;

$(document).ready(function () {
    initLastPostButtonObserver();
    initButtons();
});

function initLastPostButtonObserver() {
    NodeCreationObserver.onCreation(lastPostButtonAppendSelector, function (storyDetailsElement) {
        checkURLChange();
        if (!isHomeMostRecent()) {
            return;
        }
        var storyElement = $(storyDetailsElement).closest(storySelector);
        var storyId = storyElement.attr('id');
        var lastPostIconId = getId(storyId);
        $(storyDetailsElement).append('<span id="' + lastPostIconId + '" > <abbr title="Set as last post"><img src="' + lastPostIconLink + '" style="' + iconStyle + '" /></abbr></span>');
        $("#" + lastPostIconId).click(function () {
            if (confirm("Set this post as the last ?")) {
                var storyElement = $(this).closest(storySelector);
                setLastPost(storyElement);
            }
        });
    });
}

function initLoadingToolbar() {
    timeSinceLastpost = Math.floor(Date.now() / 1000) - lastPostTimestamp;
    console.log('timeSinceLastpost: ' + timeSinceLastpost);
    loadingToolbar = $("<div>", {
        id: getId("LoadingToolbar"),
        style: "position: fixed; top: 50px; left: 300px; width: 400px; z-index: 9999; background-color: beige; padding: 10px; border: 1px solid grey; border-radius: 2px;"
    }).insertAfter(scrollerBtnPredecessorSelector);
    $("<img>", {
        src: lastPostIconLink,
        style: "position: absolute; top: 5px; right: 10px; height: 30px; width: 30px; "
    }).appendTo(loadingToolbar);
    var stopLoadingBtn = $("<button>", {
        id: getId("StopLoading"),
        type: "submit",
        style: "cursor: pointer; color: buttontext; background-color: buttonface;"
    }).text("Stop loading & scrolling").appendTo(loadingToolbar);
    loadingProgress = $("<progress>", {
        value: 0,
        max: 100,
        style: "margin-left: 40px;"
    }).appendTo(loadingToolbar);
    stopLoadingBtn.click(stopLoading);
}

function updateProgress(currentTimestamp) {
    var progress = 100 - 100 * (currentTimestamp - lastPostTimestamp) / timeSinceLastpost;
    loadingProgress.attr("value", progress);
}

function getButton(id, title) {
    return '<button id="' + id
        + '" type="submit" style="margin-left: 2%; cursor: pointer;"><img src="'
        + lastPostIconLink + '" style="' + iconStyle + '" />' + title
        + '</button>';
}

function getMenu(children) {
    return '<div id="' + menuId + '" style="text-align: center;" >' + children + '</div>';
}

function initButtons() {
    NodeCreationObserver.onCreation(scrollerBtnPredecessorSelector, function (predecessor) {
        checkURLChange();
        if (!isHomeMostRecent()) {
            return;
        }
        var children = getButton(lastPostScrollerId, "Scroll to last post");
        children += getButton(reverseSortLoaderId, "Load last post and revese sort stories");
        $(predecessor).after(getMenu(children));
        $("#" + lastPostScrollerId).click(startLoading);
        $("#" + reverseSortLoaderId).click(startLoading);
    });
}

/**
 * @param {JQueryEventObject} eventObject 
 */
function startLoading(eventObject) {
    var reverseSort = eventObject.target.id === reverseSortLoaderId;
    $("#" + menuId).hide();
    initLoadingToolbar();
    NodeCreationObserver.onCreation(storySelector, function (element) {
        if (stopped) {
            return;
        }
        storyCount++;
        if (loadedStories.indexOf(element) == -1) {
            loadedStories.push(element);
        }
        if (storyCount % loadedStoryByPage == 0) {
            waitForStoriesToLoad(element.id, storyCount, reverseSort);
            return;
        }
        if (storyCount == 1) {
            if (lastPostURI == null) {
                NodeCreationObserver.remove(storySelector);
                stopped = true;
                return;
            }
            searchForStory(reverseSort);
        } else if (storyCount == 2) {
            searchForStory(reverseSort);
            scrollToBottom();
            storyCount = 10;
        }
    });
}

function checkURLChange() {
    var url = document.URL;
    if (url !== currentURL) {
        currentURL = url;
        isHome = matchesFBHomeURL();
        if (isHome) {
            checkMostRecentMode();
        }
    }
}

function isHomeMostRecent() {
    return isHome && isMostRecentMode;
}

function checkMostRecentMode() {
    var element = $("#stream_pagelet a[href^='/?sk=h_nor']");
    var elementExist = element.length == 1;
    isMostRecentMode = elementExist && element.is(':visible');
}

function matchesFBHomeURL() {
    var isHome = false;
    fbUrlPatterns.forEach(function (pattern) {
        if (pattern.test(currentURL)) {
            isHome = true;
        }
    });
    return isHome;
}

function setLastPost(storyElement) {
    var uri = getStoryURI(storyElement);
    var timestamp = getStoryTimestamp(storyElement);
    GM_setValue(lastPostURIKey, uri);
    GM_setValue(lastPostTimestampKey, timestamp);
    console.log("Setting last post: " + uri + " (timestamp: " + timestamp + ")");
}

function getId(elementId) {
    return scriptId + "-" + elementId;
}

/**
 * @param {string} id 
 * @param {number} count 
 * @param {boolean} reverseSort 
 */
function waitForStoriesToLoad(id, count, reverseSort) {
    var mutationObserver = new MutationObserver(function (elements, observer) {
        var loadedStories = storyCount - count;
        if (stopped) {
            observer.disconnect();
            return;
        }
        if (loadedStories > loadedStoryByPage - 1) {
            observer.disconnect();
            storyLoadObservers = removeFromArray(storyLoadObservers, observer);
            searchForStory(reverseSort);
        } else {
            scrollToBottom();
        }
    });
    storyLoadObservers.push(mutationObserver);
    mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

/**
 * @param {boolean} reverseSort 
 */
function searchForStory(reverseSort) {
    loadedStories.forEach(function (element) {
        if (!stopped && checkedStories.indexOf(element) == -1) {
            var uri = getStoryURI(element);
            if (uri != null) {
                checkedStories.push(element);
                var ts = getStoryTimestamp(element);
                updateProgress(ts);
                var notSuggested = notSuggestedStory(element);
                if (uri === lastPostURI) {
                    stopSearching(element.id, reverseSort);
                } else if (ts < lastPostTimestamp && notSuggested) {
                    stopSearching(element.id, reverseSort);
                    console.log("The last post was not found: " + lastPostURI + " (" + lastPostTimestamp + ")");
                    console.log("Stopped at the story: " + uri + " (" + ts + ")" + (notSuggested ? "" : " (suggested story)"));
                }
            }
        }
    });
}

function notSuggestedStory(storyElement) {
    if ($(storyElement).find("img[alt=explore]").length > 0) {
        return false;
    }
    var div = $(storyElement).find("._5g-l");
    var notSuggested = div.length == 0 || div.find(".profileLink").length > 0;
    if (notSuggested) {
        notSuggested = $(storyElement).find("span:not([class]) > span[class]:not(:has(*))").length == 0;
    }
    return notSuggested;
}

function getStoryTimestamp(storyElement) {
    return Number($(storyElement).attr(timestampAttribute));
}

function getStoryURI(storyElement) {
    var aLink = $(storyElement).find(storyLinkSelector);
    if (aLink != null) {
        return aLink.attr("href");
    }
    return null;
}

function stopLoading() {
    loadingToolbar.hide();
    stopped = true;
    NodeCreationObserver.remove(storySelector);
    storyLoadObservers.forEach(function (observer) {
        observer.disconnect();
    });
    storyLoadObservers = [];
}

/**
 * @param {string} id 
 * @param {boolean} reverseSort 
 */
function stopSearching(id, reverseSort) {
    setLastPost(checkedStories[0]);
    stopLoading();
    var lastPostSeparator = $("<div>", {
        id: lastPostSeparatorId,
        style: 'margin-bottom: 10px; text-align: center;'
    }).text(lastPostSeparatorTitle);
    $("#" + id).before(lastPostSeparator);
    if (reverseSort) {
        window.scrollTo(0, 0);
        var timestamps = [];
        var parent = $(checkedStories[0]).parent();
        for (var i = 1; i < checkedStories.length - 1; i++) {
            timestamps.push(getStoryTimestamp(checkedStories[i]));
            $(checkedStories[i]).detach().prependTo(parent);
        }
    } else {
        var offsetHeight = document.getElementById(blueBarId).offsetHeight;
        var height = lastPostSeparator[0].offsetTop;
        var y = height - offsetHeight;
        window.scrollTo(0, y > 0 ? y : 0);
    }
}

function removeFromArray(array, element) {
    var index = array.indexOf(element);
    if (index > -1) {
        return array.splice(index, 1);
    }
    return array;
}

function scrollToBottom() {
    var currentScrollHeight = document.body.scrollHeight;
    if (previousScrollHeight !== currentScrollHeight) {
        previousScrollHeight = currentScrollHeight;
        window.scrollTo(0, currentScrollHeight);
    }
}
