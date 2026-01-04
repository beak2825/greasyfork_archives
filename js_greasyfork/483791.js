// ==UserScript==
// @name         PTP - [User] Counting by pictures.... with a twist
// @description  Keeps count, lists valid counts up to last payout, and confirms when next post is valid.
// @version      2.3
// @author       BovBrew
// @license      MIT
// @namespace    BovBrewPTP
// @icon         https://www.google.com/s2/favicons?domain=passthepopcorn.me
// @match        http*://*passthepopcorn.me/forums.php?*threadid=28248*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483791/PTP%20-%20%5BUser%5D%20Counting%20by%20pictures%20with%20a%20twist.user.js
// @updateURL https://update.greasyfork.org/scripts/483791/PTP%20-%20%5BUser%5D%20Counting%20by%20pictures%20with%20a%20twist.meta.js
// ==/UserScript==

//NOTE: ON First Install or When Count is '?' User must go back pages until they reach a payout post to correct the count.

const resetUser       = 'thepineman';

const stickiesRemoval = true;     // true: will remove stickies if present from page
const stickyPosition  = 'bottom'; // Which Sticky to Remove, Options: 'top', 'bottom', or 'both'

const scrollToEnd     = false;   // true: On AutoFill Scroll to End
// Scroll To End Info
var setFocus          = document.getElementById("reply_box"),
    setFocusPosition  = 'end';

(function () {
    'use strict';

    var { posts, count, current_page, myUsername, currentCount } = setup();
    posts = removeSticky(posts);
    var playerListLink;

    for (var i = 0; i < posts.length; i++) {
        var p = posts[i];
        if (checkNotCounted(p)) continue;
        var { class1, username, postNum } = getPostDetails();
        var invalid = true;
        validatePost();
        p.setAttribute('style', 'position:relative;');
        var div = document.createElement('div');
        p.appendChild(div);
        div.setAttribute('style', 'position:absolute; top:5px; width:200px; right:-225px;');
        div.innerHTML = `Post Since Last Payout: ${count}<br>Current Count: ${currentCount}`;
        var nextCount = currentCount + 1;
        if (!invalid || (!posts[i + 1] && !document.getElementsByClassName("pagination__link--next")[0])) {
            addPlayerListLink();
            checkNextPostValid();
        };
    };

    function getPostDetails() {
        var u        = p.getElementsByTagName('strong')[0].textContent.split(' ('),
            postNum  = p.getElementsByClassName('forum-post__id')[0].textContent.replace(/#/g, ''),
            username = u[0].trim(),
            class1   = u[1].split(')')[0];

        return { class1, username, postNum };
    };

    function setup() {
        var clearButton             = document.createElement('button');
            clearButton.id          = 'btn_Clear_LocalStorage'
            clearButton.textContent = 'Clear Script Cache';
            clearButton.addEventListener('click', clearLocalStorage);
            clearButton.setAttribute('style', 'position: fixed; top: 10px; right: 10px; z-index: 999;');
        document.body.appendChild(clearButton);

        function clearLocalStorage() {
            Object.keys(localStorage).forEach(key => key.startsWith('CbC_post_') && localStorage.removeItem(key));
            alert('LocalStorage entries for "Counting by pictures.... with a twist." have been cleared!');
        };

        document.getElementById('content').setAttribute('style', 'overflow:visible;');

        var currentCount,
            current_page = parseInt(document.getElementsByClassName("pagination__current-page")[0].textContent),
            count        = window.localStorage['CbC_post_' + (current_page - 1)],
            myUsername   = document.getElementsByClassName('user-info-bar__link')[0].textContent;
        if (count) {
            currentCount = JSON.parse(count).currentCount;
            count        = JSON.parse(count).count;
        }
        else {
            if(current_page === 1){
                count        = '0';
                currentCount = '0';
            }
            else{
                count        = '?';
                currentCount = '?';
            };
        };
        var posts = document.getElementsByClassName('forum_post');
        return { posts, count, current_page, myUsername, currentCount };
    };

    function validatePost() {
        if (username === resetUser && invalid === true) {
            count        = 0;
            currentCount = Number(p.querySelector('.forum-post__bodyguard').textContent.trim().split(' ')[0].split('\n')[0].trim());
            invalid      = false;
        }
        else if (count !== "?" && invalid === true) {
            if (checkPrevious(username, current_page + i, count)) {
                count++;
                currentCount++;
                invalid = false;
            };
        };

        window.localStorage["CbC_post_" + (current_page + i)] = JSON.stringify({
            username: username,
            class: class1,
            count: count,
            invalid: invalid,
            postNum: postNum,
            currentCount: currentCount,
        });
    };

    function addPlayerListLink() {
        var postIndex   = current_page + i;
        var a           = document.createElement('a');
            a.innerHTML = "Copy players to post reply";
            a.href      = 'javascript:void(0);';
        var a1          = document.createElement('span');
            a1.id       = `PostInfo_${postIndex}`;
        if (count === 0) {
            a.addEventListener('click', copyPlayers.bind(undefined, postIndex - 1,  postIndex, nextCount));
        }
        else {
            a.addEventListener('click', copyPlayers.bind(undefined, postIndex,  postIndex, nextCount));
        };
        div.appendChild(document.createElement('br'));
        div.appendChild(a);
        div.appendChild(document.createElement('br'));
        div.appendChild(a1);

        playerListLink = a;
    };

    function checkNextPostValid() {
        if (!posts[i + 1] && !document.getElementsByClassName("pagination__link--next")[0]) {
            var span      = document.createElement('span');
            var tempCount = count + 1;
            if (checkPrevious(myUsername, current_page + i + 1, tempCount)) {
                span.innerHTML = "Your next post will be valid";
                span.setAttribute('style', 'color:green;font-weight:bold');
                if (scrollToEnd) scrollOnceLoaded(setFocus, setFocusPosition);
                if (currentCount !== '?') document.getElementById('quickpost').value = `${nextCount}\n[img][/img]`;
            }
            else {
                span.innerHTML = "Your next post will NOT be valid";
                span.setAttribute('style', 'color:red;font-weight:bold');
            };
            div.appendChild(document.createElement('br'));
            div.appendChild(span);
        };
    };
})();

function checkNotCounted(p) {
    var bs = p.getElementsByClassName('forum-post__bodyguard')[0].childNodes;
    for (var i = 0; i < bs.length; i++) {
        var b = bs[i];
        if (b.tagName === "BLOCKQUOTE") continue;
        if (b.textContent.indexOf('not counted') !== -1) return true;
    };
    return false;
};

function copyPlayers(index, postIndex, nextCount) {
    var players = getPlayers(index);
    document.getElementById('quickpost').value = `${nextCount}\n[img][/img]\n[hr]${players}`;
};

function getPlayers(index) {
    var players    = "[hide=Posts]",
        lastCount  = 0,
        postsIndex = lastResetPost(index);
    postsIndex++;
    while (postsIndex <= index) {
        var c = window.localStorage['CbC_post_' + (postsIndex)];
        postsIndex++;
        if (!c) continue;
        c = JSON.parse(c);
        if (c.count === lastCount) {
            if (c.username !== resetUser) {
                players += `[s]${c.currentCount} - `;
                if (c.postNum) players += `[url=https://passthepopcorn.me/forums.php?action=viewthread&threadid=28248&postid=${c.postNum}#post${c.postNum}]`;
                players += c.username;
                if (c.postNum) players += "[/url]";
                players += `[/s]\n`;
            };
            continue;
        };
        lastCount = c.count;
        players += `${c.currentCount} - `;
        if (c.postNum) players += `[url=https://passthepopcorn.me/forums.php?action=viewthread&threadid=28248&postid=${c.postNum}#post${c.postNum}]`;
        players += c.username;
        if (c.postNum) players += '[/url]';
        players += `\n`;
    };
    players += '[/hide]';
    return players;
};

function checkPrevious(username, index) {
    var counter = 0,
        i       = 1;

    while (counter < 3) {
        var c = window.localStorage['CbC_post_' + (index - i)];
        if (c) {
            c = JSON.parse(c);
            if (!c.invalid) {
                if (c.username === username) {
                    return false;
                }
                else if (c.username !== resetUser) {
                    counter++;
                };
            };
            i++;
        }
        else {
            return true;
        };
    };
    return true;
};

function lastResetPost(index) {
    var lastUser,
        postsIndex = index;
    do {
        var c = window.localStorage['CbC_post_' + (postsIndex)];
        if (!c) return;
        c = JSON.parse(c);
        postsIndex--;
        lastUser = c.username;
    } while (lastUser !== resetUser);
    return postsIndex;
};

function removeSticky(posts) {
    var returnPosts = [];
    for (var i = 0; i < posts.length; i++) {
        if (isSticky(posts[i])) continue;
        returnPosts.push(posts[i]);
    };
    if(stickiesRemoval)removeStickies(stickyPosition);
    return returnPosts;

    function isSticky(post) {
        var sticky = post.getElementsByClassName("sticky_post");
        if (sticky) if (sticky.length > 0) return true;
        return false;
    };
};

function removeStickies(position) {
    let stickies = document.querySelectorAll('.forum-post--sticky');
    if (stickies.length > 1) {
        switch (position) {
            case 'top':
                stickies[0].parentNode.removeChild(stickies[0]);
                break;
            case 'bottom':
                stickies[1].parentNode.removeChild(stickies[1]);
                break;
            case 'both':
                stickies[1].parentNode.removeChild(stickies[1]);
                stickies[0].parentNode.removeChild(stickies[0]);
                break;
            default:
                console.log(`${position} is not an option. Stickies removal Options: 'top', 'bottom, or 'both'.`);
        };
    }
    else {
        console.log(`Stickies are not present for removal.`);
    };
};

// Function to check if all images are loaded
function areAllImagesLoaded(){
    const images = document.querySelectorAll('img');
    for(const image of images){
        if(!image.complete) return false;
    };
    return true;
};

// Function to Scroll to Focus Element on Page
function scrollToFocus(focus, location) {
    // NOTE: block: 'start' puts the last post in focus at the top of your screen and block: 'end' puts the post in focus on the bottom of the screen.
    focus.scrollIntoView({ behavior: 'smooth', block: location, inline: 'nearest' });
};

// Scroll to Focus Element on Page Once All Images Have Loaded
function scrollOnceLoaded(focus, location) {
    const intervalId = setInterval(function(){
        if(areAllImagesLoaded()){
            clearInterval(intervalId);
            scrollToFocus(focus, location);
        }else{
            console.log('Images are still loading...');
        };
    }, 250);
};