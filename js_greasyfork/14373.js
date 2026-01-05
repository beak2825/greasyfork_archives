// ==UserScript==
// @name        WaniKani Recent Topics Filter
// @namespace   ajpazder
// @description Hides activity from certain boards in the recent topics list
// @version     1.0.1
// @author      Johnathon Pazder
// @copyright   2015+, Johnathon Pazder
// @license     MIT; http://opensource.org/licenses/MIT
// @include     http://www.wanikani.com/
// @include     https://www.wanikani.com/
// @include     http://www.wanikani.com/dashboard
// @include     https://www.wanikani.com/dashboard
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14373/WaniKani%20Recent%20Topics%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/14373/WaniKani%20Recent%20Topics%20Filter.meta.js
// ==/UserScript==

$(function () {
    // To exlcude topics from a specific board, set "shouldBeIgnored" to true
    // for the desired board(s) below.  Recent posts from these boards will no
    // longer be shown in the "Recent Community Chat Topics" list.
    var boards = [
        {
            title: "API And Third-Party Apps",
            homepageUrl: "/chat/api-and-third-party-apps",
            shouldBeIgnored: false
        },
        {
            title: "Kanji And Japanese",
            homepageUrl: "/chat/kanji-and-japanese",
            shouldBeIgnored: false
        },
        {
            title: "WaniKani",
            homepageUrl: "/chat/wanikani",
            shouldBeIgnored: false
        },
        {
            title: "Campfire",
            homepageUrl: "/chat/campfire",
            shouldBeIgnored: false
        },
        {
            title: "Japanese Only",
            homepageUrl: "/chat/japanese-only",
            shouldBeIgnored: false
        }
    ];
    
    // Leave the rest of this alone, unless you know what you're doing.
    //-----------------------------------------------------------------//
    
    indicateFilteringStarted();
    
    var mostRecentTopicsFromAllBoards = [];
    var getBoardRequests = [];
    boards.forEach(function (board) {
        if (board.shouldBeIgnored) 
            return;
        
        getBoardRequests.push($.get(board.homepageUrl, function (html) {
            var mostRecentTopics = getTopFiveMostRecentTopicsFromBoard(html);
            mostRecentTopics.forEach(function (topic) {
                topic.board = board;
            });
            mostRecentTopicsFromAllBoards = mostRecentTopicsFromAllBoards.concat(mostRecentTopics);
        }));
    });
    
    $.when.apply($, getBoardRequests).done(function () {
        var numberOfTopicsShownInRecentTopicsList = 5;
        var topicsToShowOnDashboard = mostRecentTopicsFromAllBoards
            .sort(sortByLastPostNewestFirst)
            .slice(0, numberOfTopicsShownInRecentTopicsList);
        
        updateMostRecentTopicsList(topicsToShowOnDashboard);
        indicateFilteringStopped();
    });
});

function indicateFilteringStarted() {
    $(".forum-topics-list h3").append('<span id="waitingForFilterLabel">(filtering...)</span>');
}

function indicateFilteringStopped() {
    $("#waitingForFilterLabel").remove();
}

function getTopFiveMostRecentTopicsFromBoard(boardIndexHtml) {
    var topicTableRows = $(boardIndexHtml).find(".forum-topics-list tr");
    var numberOfUnpinnedTopicsSeen = 0;
    var desiredNumberOfUnpinnedTopics = 5;
    var topics = [];
    topicTableRows.each(function () {
        if (numberOfUnpinnedTopicsSeen === desiredNumberOfUnpinnedTopics)
            return false; // Stop iterating.

        var currentRow = $(this);
        if (isHeaderRow(currentRow)) 
            return; // Skip this row.

        var topic = createTopicObjectFromTableRow(currentRow);
        topics.push(topic);
        if (!topic.isPinned)
            numberOfUnpinnedTopicsSeen++;
    });

    return takeMostRecentTopics(topics, 5);
}

function isHeaderRow(row) {
    return row.find("th").length > 1;
}

function createTopicObjectFromTableRow(topicRow) {
    var isPinned = topicRow.find(".icon-pushpin").length > 0;
    var topicTitle = topicRow.find(".topic-title").first().text();
    var lastPostAuthor = topicRow.children("td:last-child").find('a[href*="community/people"]').first().text();
    var linkToTopic = topicRow.find("a").first().attr("href");
    var timeElement = topicRow.find("time").first();
    var lastPostTime = new Date(timeElement.attr("datetime"));
    
    return {
        isPinned: isPinned,
        title: topicTitle,
        url: linkToTopic,
        lastPost: {
            author: lastPostAuthor,
            time: lastPostTime
        }
    };
}

function takeMostRecentTopics(topics, amount) {
    var topicsByPostDate = topics.sort(sortByLastPostNewestFirst);
    var mostRecentTopics = topics.slice(0, amount);
    
    return mostRecentTopics;
}

function sortByLastPostNewestFirst(a, b) {
  return ((a.lastPost.time > b.lastPost.time) ? -1 : ((a.lastPost.time < b.lastPost.time) ? 1 : 0));
}

function updateMostRecentTopicsList(topics) {
    var topicIndex = 0;
    $(".forum-topics-list tr").each(function() {
        if (isSeparator(this))
            return;
        
        var topic = topics[topicIndex];
        $(this).replaceWith(createTopicInfoRow(topic));
        
        topicIndex++;
    });
    
    // Get fuzzy dates on our updated topic list.
    DateTime.activateFuzzyDate();
}

function isSeparator(tableRow) {
    return $(tableRow).find("td").length === 1;
}

function createTopicInfoRow(topic) {
    var lastPostDateTime = topic.lastPost.time.toISOString();
    return '<tr>' +
             '<td class="description">' +
               '<a href="' + topic.url + '" class="topic-title">' + topic.title + '</a><br>@ <a href="' + topic.board.homepageUrl + '">' + topic.board.title + '</a>' +
             '</td>' +
             '<td>' +
               '<a href="' + topic.url + '"><time class="timeago" datetime="' + lastPostDateTime + '" title="' + topic.lastPost.time.toString() + '">' + lastPostDateTime + '</time></a>' +
               '<br>by <a href="/community/people/' + topic.lastPost.author + '" target="_blank">' + topic.lastPost.author + '</a>' +
             '</td>' +
           '</tr>';
}