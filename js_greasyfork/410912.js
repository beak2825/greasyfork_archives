// ==UserScript==
// @name         BeanGG Highlight Forum Games.
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Highlight legal forum posts by 3post rule!
// @author       BeanGG
// @match        https://gazellegames.net/forums.php?*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/410912/BeanGG%20Highlight%20Forum%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/410912/BeanGG%20Highlight%20Forum%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if(/threadid\=/.test(window.location.search)){
        var currentThreadID = getThreadID();
        var nextPost = calculateNextPost();
        var postArray = {'thread':currentThreadID, 'next':nextPost};
        saveForumArray(postArray);
    }
    else if(/forumid\=55/.test(window.location.search)){
        var loadArray = loadForumArray();
        matchThreads(loadArray);
    }

    // Arrays
    function initArrays() {
        console.log('initiating forum script!');
        GM_deleteValue("forumArray");
        var newArray = [];
        GM_setValue("forumArray", JSON.stringify(newArray));
    }
    function loadForumArray() {
        var currentArray = GM_getValue ("forumArray");
        if(currentArray) {
            return JSON.parse(currentArray);
        }
        else {initArrays()}
    }
    function saveForumArray(newdata) {
        var loadArray = loadForumArray();
        if (loadArray.length == 0) {
         loadArray.push(newdata);
        }
        else {
            for (var i = loadArray.length -1; i >= 0 ; i--) {
                if (loadArray[i].thread == newdata.thread && loadArray[i].next == newdata.next) {
                    loadArray.splice(i,1);
                }
                else if (loadArray[i].thread == newdata.thread && loadArray[i].next != newdata.next) {
                    loadArray.splice(i,1);
                }
            }
            loadArray.push(newdata);
        }
        GM_setValue("forumArray", JSON.stringify(loadArray));

    }

    // Posts
    function calculatePostTotal(){
     var postTotal = document.getElementsByClassName("linkbox_top")[0].getElementsByTagName("strong");
        var lastPost = postTotal.length - 1;
        postTotal = postTotal[lastPost].innerText;
        postTotal = /-(.+)/.exec(postTotal)[1];
        postTotal = parseInt(postTotal);
        return postTotal;
    }
    function calculateNextPost(postTotal=1) {
        postTotal = calculatePostTotal();
        var userName = document.querySelector(".username").innerHTML;
        var postList = document.getElementsByClassName("forum_post");
        var posterList = [];
        var stickyPost = 0;
        var postEdits = 0;
        stickyPost = document.getElementsByClassName("sticky_post").length;

        for (var i=0; i < postList.length; ++i) {
           posterList.push(postList[i].querySelectorAll(".username")[0].innerText);
        }
        posterList.pop();
        if (stickyPost > 0) {
            posterList.pop();
            posterList.shift();
        }
        var userLastPost = posterList.lastIndexOf(userName);
        userLastPost = posterList.length - userLastPost - 1;

        if (userLastPost <3) {
            var nextPost = 2 - userLastPost + postTotal;
            if (document.getElementsByClassName("sticky_post_label").length > 0) {
                nextPost++;
            }
            return nextPost;
        }
        else { return postTotal };
    }
    function getThreadID(){
        var urlStr = window.location.search + '&';
        return urlStr.match (/[\?\&]threadid=([^\&\#]+)[\&\#]/i)[1];
    }

    // Forum Games
    function matchThreads(postArray) {
        if(postArray) {
            fixBadCounts();
            var threadsList = threadList();
            compareLists(threadsList,postArray);
        }
        else {console.log('Failed to load saved forum posts.')}
    }
    function fixBadCounts() {
        var fixList = [{'thread': 11889,'adjustment':124},{'thread': 4698,'adjustment':103},{'thread': 1973,'adjustment':60},{'thread': 10313,'adjustment':72},{'thread': 12782,'adjustment':34},{'thread': 2005,'adjustment':77},{'thread': 10318,'adjustment':65},{'thread': 13362,'adjustment':28},{'thread': 11546,'adjustment':72},{'thread': 5813,'adjustment':170}];
        var threadsList = document.getElementsByClassName("forum_index");
        threadsList = threadsList[0].children[0].querySelectorAll("tr");
        for (var ii=0; ii < fixList.length; ++ii) {
            for (var i=1; i < threadsList.length; ++i) {
                var selectThreadID = threadsList[i].querySelectorAll("a")[0];
                selectThreadID = threadURL(selectThreadID.href);
                if (fixList[ii].thread == selectThreadID) {
                    var threadCount = threadsList[i].querySelectorAll("td")[2].innerText;
                    threadCount = threadCount.replace(/\D/g,'');
                    threadCount = parseInt(threadCount, 10);
                    threadCount = threadCount - fixList[ii].adjustment;
                    threadsList[i].querySelectorAll("td")[2].innerText = threadCount;
                }
            }
        }
    }
    function threadList() {
        var threadsList = document.getElementsByClassName("forum_index");
        var threadArray = [];
        threadsList = threadsList[0].children[0].querySelectorAll("tr");
        for (var i=1; i < threadsList.length; ++i) {
            var threadID = threadsList[i].querySelectorAll("a")[0];
            var threadCount = threadsList[i].querySelectorAll("td")[2].innerText;
            threadCount = threadCount.replace(/\D/g,'');
            threadCount = parseInt(threadCount, 10);
            threadID = threadURL(threadID.href);
            var threadObj = {'thread':threadID, 'next':threadCount};
            threadArray.push(threadObj);
        }
        return threadArray;
    }
    function threadURL(threadURL) {
        var threadID = String(threadURL + "&");
        threadID = threadID.match (/[\?\&]threadid=([^\&\#]+)[\&\#]/i)[1];
        return threadID;
    }
    function compareLists(threadsList,postArray) {
        if (threadsList && postArray) {
            for (var i=0; i < threadsList.length; ++i) {
                var threadID = threadsList[i].thread;
                var threadCount = threadsList[i].next;
                if (threadID) {
                    for (var ii=0; ii < postArray.length; ++ii) {
                        if(threadID == postArray[ii].thread && threadCount < postArray[ii].next) {
                            highlightThread(threadID, 'yellow');
                            break;
                        }
                        else if(threadID == postArray[ii].thread && threadCount >= postArray[ii].next) {
                            highlightThread(threadID, 'green');
                            break;
                        }
                        else if(ii == postArray.length - 1) {
                            highlightThread(threadID, 'green');
                            break;
                        }
                    }
                }
            }
        }
    }
    function highlightThread(threadID, color){
        var bgColor = 'white';
        switch (color) {
            case "yellow":
                bgColor = "#d1de67";
                break;
            case "green":
                bgColor = "#67de88";
                break;
        }
        var threadsList = document.getElementsByClassName("forum_index");
        threadsList = threadsList[0].children[0].querySelectorAll("tr");
        for (var i=1; i < threadsList.length; ++i) {
            var selectThreadID = threadsList[i].querySelectorAll("a")[0];
            selectThreadID = threadURL(selectThreadID.href);
            if (threadID == selectThreadID) {
                if(color == "green"){
                    var threadLastLink = threadsList[i].querySelectorAll("td")[1];
                    var threadCount =threadsList[i].querySelectorAll("td")[2].innerText;
                    threadLastLink = threadLastLink.querySelectorAll("a");
                    threadLastLink = threadLastLink[0].href + "&page=90000#reply_box";
                    threadsList[i].querySelectorAll("td")[2].innerHTML = "<b><a href='"+threadLastLink+"' target='_blank'>"+threadCount+"</a></b>";
                }
                threadsList[i].querySelectorAll("td")[2].style.backgroundColor = bgColor;
                threadsList[i].querySelectorAll("td")[0].style.backgroundColor = bgColor;
            }
        }
    }
})();