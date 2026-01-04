// ==UserScript==
// @author          TheButt
// @description     None
// @grant           GM_deleteValue
// @grant           GM_getValue
// @grant           GM_setValue
// @include         http://www.neopets.com/neoboards/*
// @name            Neopets - NeoBoards History Tracker
// @version         1.1.1
// @namespace https://greasyfork.org/users/313594
// @downloadURL https://update.greasyfork.org/scripts/386904/Neopets%20-%20NeoBoards%20History%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/386904/Neopets%20-%20NeoBoards%20History%20Tracker.meta.js
// ==/UserScript==

var VisitedLinkColor = "purple";

/*
2019-06-24 - Modified by Odd

- Changed visted link colors to specified value
2019-01-03 - Modified by Odd

- Added notification for previously unseen topics
- Added notification for threads with replies that we haven't seen
- Added support for marking a topic as read when its replies are clicked
- Replaced mail icon with themed-specific exclamation and mail icons
*/

if (typeof $ == "undefined") $ = unsafeWindow.$;

$(document.body).append("<style>.status { display: inline-block; height: 18px; margin: 0 6px 4px 4px; vertical-align: middle; width: 18px; } .status img { height: auto; width: 18px; }</style>");

var a = document.createElement("a");
var boardHistory = {};
var boardNames = [];
var currentBoard;
var currentPage = window.location.href;
var newTopics = {};
var regex = /\d+/;
var themeUrl = ("http://images.neopets.com/" + $("link[href*='/css/themes/']").attr("href").match(/\/css\/([^\.]+)/i)[1] + "/events/"); //Retrieve the user's current theme
var username = $(".user a")[0].textContent.trim();

//create the clear history link
a.setAttribute("href", "");
a.setAttribute("class", "clear-history");
a.innerHTML = "<strong>Clear Neoboard History</strong>";
$("div.medText a[href='/wallofshame.phtml']").after("<text> | </text>" + a.outerHTML);

if (currentPage === "http://www.neopets.com/neoboards/index.phtml") {
    $("tr:has([href^=boardlist])", "div[align=center]").each(function (index, value) {
        boardNames.push($(value).find(".indexTitle strong")[0].innerText.replace("» ", "").trim());
    });

    //clear the history of the main boards when clicking "Clear Neoboard History"
    $(".clear-history").on("click", function() {
        var i = boardNames.length;

        while (i--) {
            GM_deleteValue(boardNames[i]);
        }
    });
}
else if (currentPage === "http://www.neopets.com/neoboards/premium.phtml") {
    $("tr:has([href^=boardlist])", "td[class=content]").each(function (index, value) {
        var boardName = $(value).find(".indexTitle strong")[0].innerText.replace("» ", "").trim();

        if (boardName === "Help") {
            boardName = "Premium Help";
        }

        boardNames.push(boardName);
    });

    //clear the history of the premium boards when clicking "Clear Neoboard History"
    $(".clear-history").on("click", function() {
        var i = boardNames.length;

        while (i--) {
            GM_deleteValue(boardNames[i]);
        }
    });
}
else {
    currentBoard = $('[href^=boardlist]')[0].text.trim();

    //check if the page is the premium help board
    if (currentPage.match(/28/)) {
        currentBoard = "Premium Help";
    }

    boardHistory = GM_getValue(currentBoard, {});

    $("td.content").find("tr:has(td.blistSmall)").each(function(index, value) {
        var topicObj = {};
        var currentTopic = value.children[0].children[0];
        var boardTopic;
        var isUsersNewTopic;

        topicObj.id = regex.exec(currentTopic.getAttribute("href"))[0].toString();
        topicObj.repliesRead = 0;
        topicObj.newMessages = parseInt(value.children[1].textContent);
        topicObj.read = false;
        topicObj.author = value.children[0].children[2].textContent.trim();

        boardTopic = boardHistory[topicObj.id];

        if (boardTopic && boardTopic.read && boardTopic.repliesRead < topicObj.newMessages) {
            boardTopic.newMessages = topicObj.newMessages - boardTopic.repliesRead;
            boardHistory[boardTopic.id] = boardTopic;

            value.children[1].textContent = topicObj.newMessages + " (" + boardTopic.newMessages + ")";
            value.children[0].insertBefore
            (

                $(document.createElement("div"))
                    .addClass("status")
                    .html("<img src=\"" + (themeUrl + "neomail.png") + "\">")[0],
                currentTopic
            ); //Add the envelope img to the beginning of the topic link since there are unread replies
        }
        else if (boardTopic && boardTopic.read && boardTopic.repliesRead >= topicObj.newMessages) {
            value.children[0].children[0].style.color = VisitedLinkColor;
            value.children[1].textContent = topicObj.newMessages + " (" + boardTopic.newMessages + ")";
        }
        else if (!boardTopic && !topicObj.newMessages) {

            boardHistory[topicObj.id] = topicObj;

            value.children[0].insertBefore
            (

                $(document.createElement("div"))
                    .addClass("status")
                    .html("<img src=\"" + (themeUrl + "warning.png") + "\">")[0],
                currentTopic
            ); //Add the exclamation img to the beginning of the topic link since there are unread replies
        }
        else if (username === topicObj.author && topicObj.newMessages === 0) {
            value.children[0].children[0].style.color = VisitedLinkColor;
            value.children[1].textContent = topicObj.newMessages + " (" + topicObj.newMessages + ")";
        }
        else {
            boardHistory[topicObj.id] = topicObj;

            value.children[1].textContent = value.children[1].textContent + " (" + topicObj.newMessages + ")";
            value.children[0].insertBefore($(document.createElement("div"))
                    .addClass("status")
                    .html("<img src=\"" + (themeUrl + "neomail.png") + "\">")[0], currentTopic); //Add the envelope img to the beginning of the topic link since topic is unread
        }
    });

    GM_setValue(currentBoard, boardHistory);

    if ((location.pathname || "").match(/\/boardlist\.phtml$/i)) { //Mark topics as read if the topic's title or replies are clicked

        //set click event listener for when a topic is clicked
        $("a[href^='topic.phtml' i]").on("click", function(e) {
            var topicLink = this.getAttribute("href");
            var topicKey = regex.exec(topicLink)[0].toString();
            var topicSelected = boardHistory[topicKey];
            var messagesLink = Math.floor(topicSelected.repliesRead/20) * 20 + 1;
            var newTopicLink = topicLink + "&next=" + messagesLink;

            topicSelected.read = true;
            topicSelected.repliesRead = topicSelected.repliesRead + topicSelected.newMessages;
            topicSelected.newMessages = 0;
            boardHistory[topicKey] = topicSelected;

            GM_setValue(currentBoard, boardHistory);

            this.setAttribute("href", newTopicLink); //sets the topic link to the page with the earliest unread message
        });
    }

    //clear the history of the current board when clicking "Clear Neoboard History"
    $(".clear-history").on("click", function() {
        GM_deleteValue(currentBoard);
    });
}