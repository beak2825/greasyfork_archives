// ==UserScript==
// @name         PTP - Count to 60 Tracker
// @description  Keeps the count on the PTP count to 60 game, and gives the players
// @version      1.1
// @author       MidnightLion
// @license      MIT
// @namespace    MidnightLionPTP
// @icon         https://www.google.com/s2/favicons?domain=passthepopcorn.me
// @match        http*://*passthepopcorn.me/forums.php?*threadid=25066*
// @source       https://greasyfork.org/scripts/377837-count-to-60-tracker
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377837/PTP%20-%20Count%20to%2060%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/377837/PTP%20-%20Count%20to%2060%20Tracker.meta.js
// ==/UserScript==
 
var staff_classes = ["Producer", "Administrator", "Developer", "Moderator", "First Line Support", "Legend", "VIP"];
 
(function () {
    'use strict';
 
    var { posts, count, current_page, myUsername } = setup();
    posts = removeSticky(posts);
 
    for (var i = 0; i < posts.length; i++) {
        var p = posts[i];
        if (checkNotCounted(p)) {
            continue;
        }
        var { class1, username, postNum } = getPostDetails();
        var valid = true;
 
        if (staff_classes.indexOf(class1) !== -1) {
            checkRed();
        }
        validatePost();
        p.setAttribute('style', 'position:relative;');
        var div = document.createElement('div');
        p.appendChild(div);
        div.setAttribute('style', 'position:absolute; top:5px; width:200px; right:-225px;');
        div.innerHTML = "Count: " + count;
        if ((count === 60 && !valid) || count === 0 || (!posts[i + 1] && !document.getElementsByClassName("pagination__link--next")[0])) {
            addPlayerListLink();
            addWinnerLink();
            checkNextPostValid();
        }
    }
 
    function getPostDetails() {
        var u = p.getElementsByTagName('strong')[0].textContent.split(' (');
        var postNum = p.getElementsByClassName('forum-post__id')[0].textContent.replace(/#/g, '');
        var username = u[0].trim();
        var class1 = u[1].split(')')[0];
        return { class1, username, postNum };
    }
 
    function setup() {
        document.getElementById('content').setAttribute('style', 'overflow:visible;');
 
        var current_page = parseInt(document.getElementsByClassName("pagination__current-page")[0].textContent);
        var count = window.localStorage['post_' + (current_page - 1)];
        var myUsername = document.getElementsByClassName('user-info-bar__link')[0].textContent;
        if (count) {
            count = JSON.parse(count).count;
        }
        else {
            count = '?';
        }
        var posts = document.getElementsByClassName('forum_post');
        return { posts, count, current_page, myUsername };
    }
 
    function validatePost() {
        if (staff_classes.indexOf(class1) !== -1 && valid) {
            if (count !== '?') {
                var lastReset = window.localStorage['post_' + (lastResetPost(current_page + i - count))];
                if (lastReset) {
                    if (username === JSON.parse(lastReset).username.trim()) {
                        if (checkPrevious(username, current_page + i, count)) {
                            count++;
                            valid = false;
                        }
                    }
                    else {
                        count = 0;
                    }
                }
                else {
                    count = 0;
                }
            }
            else {
                count = 0;
            }
        }
        else if (count !== "?" && valid) {
            if (count === 60) {
                count = 0;
            }
            if (checkPrevious(username, current_page + i, count)) {
                count++;
                valid = false;
            }
        }
        window.localStorage['post_' + (current_page + i)] = JSON.stringify({ username: username, class: class1, count: count, valid: valid, postNum: postNum });
        return lastReset;
    }
 
    function addPlayerListLink() {
        var a = document.createElement('a');
        a.innerHTML = "Copy players to post reply";
        a.href = 'javascript:void(0);';
        if (count === 0) {
            a.addEventListener('click', copyPlayers.bind(undefined, current_page + i - 1));
        }
        else {
            a.addEventListener('click', copyPlayers.bind(undefined, current_page + i));
        }
        div.appendChild(document.createElement('br'));
        div.appendChild(a);
    }
 
    function addWinnerLink() {
        if (count === 60 & !valid) {
            var a = document.createElement('a');
            a.innerHTML = "Choose a winner!";
            a.href = 'javascript:void(0);';
            a.addEventListener('click', chooseWinner.bind(undefined, current_page + i));
            div.appendChild(document.createElement('br'));
            div.appendChild(a);
        }
    }
 
    function checkNextPostValid() {
        if (!posts[i + 1] && !document.getElementsByClassName("pagination__link--next")[0]) {
            var span = document.createElement('span');
            var tempCount = count + 1;
            if (tempCount > 60) {
                tempCount = 1;
            }
            // Check if next post is Valid
            // Staff
            if (isStaff(myUsername, current_page + i)) {
                var lastReset = window.localStorage['post_' + (lastResetPost(current_page + i))];
                console.log('You are Staff');
                if ((JSON.parse(lastReset).username.trim() === myUsername || username === myUsername) && valid) {
                    span.innerHTML = "Your next post will NOT be valid";
                    span.setAttribute('style', 'color:red;font-weight:bold');
                }
                else {
                    span.innerHTML = "Your next post will be valid";
                    span.setAttribute('style', 'color:green;font-weight:bold');
                }
            }
 
 
            // Users
            else if (checkPrevious(myUsername, current_page + i + 1, tempCount)) {
                span.innerHTML = "Your next post will be valid";
                span.setAttribute('style', 'color:green;font-weight:bold');
            }
            else {
                span.innerHTML = "Your next post will NOT be valid";
                span.setAttribute('style', 'color:red;font-weight:bold');
            }
            div.appendChild(document.createElement('br'));
            div.appendChild(span);
        }
    }
 
    function checkRed() {
        var spans = p.getElementsByClassName('forum-post__bodyguard')[0].getElementsByTagName('span');
        for (var x = 0; x < spans.length; x++) {
            console.log("Checking to see if red...");
            console.log(spans[x].style.color);
            if (spans[x].style.color === "rgb(204, 0, 0)" || spans[x].style.color === "rgb(255, 0, 0)" || spans[x].style.color === "red") {
                console.log("Red!");
                console.log("Checking to see if " + spans[x].innerHTML + " is an integer...");
                if (!isNaN(spans[x].innerHTML)) {
                    console.log("Integer!");
                    count = parseInt(spans[x].innerHTML);
                    valid = false;
                }
            }
        }
    }
})();
 
function checkNotCounted(p) {
    var bs = p.getElementsByClassName('forum-post__bodyguard')[0].childNodes;
    for (var i = 0; i < bs.length; i++) {
        var b = bs[i];
        if (b.tagName === "BLOCKQUOTE") {
            continue;
        }
        if (b.textContent.indexOf('not counted') !== -1) {
            return true;
        }
    }
    return false;
}
 
function chooseWinner(index) {
    var players = getPlayers(index);
 
    var winnerID = Math.floor(Math.random() * 60) + 1;
    console.log("Winner ID: " + winnerID);
    var postsIndex = lastResetPost(index);
    postsIndex += winnerID;
    var c = window.localStorage['post_' + (postsIndex)];
    c = JSON.parse(c);
    console.log("Winner count: " + c.count);
    var winnerUser = c.username;
    console.log("Winner: " + winnerUser);
 
    var winnerText = "The winner is #" + winnerID + " " + winnerUser + "!";
 
 
    document.getElementById('quickpost').value = players + "\n" + winnerText;
}
 
function copyPlayers(index) {
    var players = getPlayers(index);
    document.getElementById('quickpost').value = players;
}
 
function getPlayers(index) {
    var players = "[hide=Posts]";
    var lastCount = 0;
    var postsIndex = lastResetPost(index);
    postsIndex++;
    while (postsIndex <= index) {
        var c = window.localStorage['post_' + (postsIndex)];
        postsIndex++;
        if (!c) {
            continue;
        }
        c = JSON.parse(c);
        if (c.count === lastCount) {
            if (c.count !== 0) {
                players += "[s]" + ("00" + (c.count + 1)).slice(-2) + " - ";
                if (c.postNum) {
                    players += "[url=https://passthepopcorn.me/forums.php?action=viewthread&threadid=25066&postid=" + (c.postNum) + "#post" + (c.postNum) + "]";
                }
                players += c.username;
                if (c.postNum) {
                    players += "[/url]";
                }
                players += "[/s]\n";
            }
            continue;
        }
        lastCount = c.count;
        players += ("00" + c.count).slice(-2) + " - ";
        if (c.postNum) {
            players += "[url=https://passthepopcorn.me/forums.php?action=viewthread&threadid=25066&postid=" + (c.postNum) + "#post" + (c.postNum) + "]";
        }
        players += c.username;
        if (c.postNum) {
            players += "[/url]";
        }
        players += "\n";
    }
    players += "[/hide]";
    return players;
}
 
function checkPrevious(username, index, count) {
    var counter = 0;
    var i = 1;
 
    while (counter < 3 && counter < count) {
        var c = window.localStorage['post_' + (index - i)];
        if (c) {
            c = JSON.parse(c);
            if (c.count === 0 || c.count === 60) {
                return true;
            }
            if (!c.valid) {
                if (c.username === username) {
                    return false;
                }
                else if (c.count === 1) {
                    return true;
                }
                else {
                    counter++;
                }
            }
            i++;
        }
        else {
            return true;
        }
    }
    return true;
}
 
function lastResetPost(index) {
    var lastCount;
    var postsIndex = index;
    do {
        var c = window.localStorage['post_' + (postsIndex)];
        if (!c) {
            return;
        }
        c = JSON.parse(c);
        postsIndex--;
        lastCount = c.count;
    } while (lastCount > 1)
    return postsIndex;
}
 
function isStaff(username, index) {
    //var myUsername=document.getElementsByClassName('user-info-bar__link')[0].textContent;
    var postsIndex = index;
    do {
        var c = window.localStorage['post_' + (postsIndex)];
        if (!c) {
            return false;
        }
        c = JSON.parse(c);
        if (username.trim() === c.username.trim()) {
            if (!c.class) {
                return false;
            }
            else if (staff_classes.indexOf(c.class) !== -1) {
                return true;
            }
            else {
                return false;
            }
        }
        postsIndex--;
    } while (c);
    return false;
}

function removeSticky(posts) {
    var returnPosts = [];
    for (var i = 0; i < posts.length; i++) {
        if (isSticky(posts[i])) {
            continue;
        }
        returnPosts.push(posts[i]);
    }
    return returnPosts;

    function isSticky(post) {
        var sticky = post.getElementsByClassName("sticky_post");
        if (sticky) {
            if (sticky.length > 0) {
                return true;
            }
        }
        return false;
    }
}