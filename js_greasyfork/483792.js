// ==UserScript==
// @name         PTP - [Admin] Counting by pictures.... with a twist.
// @description  Gets a list of valid posts since the last time Forum has posted.
// @version      3.2
// @author       BovBrew
// @license      MIT
// @namespace    BovBrewPTP
// @icon         https://www.google.com/s2/favicons?domain=passthepopcorn.me
// @match        http*://*passthepopcorn.me/forums.php?*threadid=28248*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483792/PTP%20-%20%5BAdmin%5D%20Counting%20by%20pictures%20with%20a%20twist.user.js
// @updateURL https://update.greasyfork.org/scripts/483792/PTP%20-%20%5BAdmin%5D%20Counting%20by%20pictures%20with%20a%20twist.meta.js
// ==/UserScript==

const resetUser          = 'thepineman';
const fullRewardPerPost  = 5000;
const partRewardPerPost  = 1000;
const maxPostsPerDay     = 5;
const fullIndicator      = '[size=6][b][color=#00FF00]·[/color][/b][/size]' // Color Dot, shown before Post Number in Details, for Full Payment Posts. Default: #00ff00 (GREEN)
const partIndicator      = '[size=6][b][color=#FFFF00]·[/color][/b][/size]' // Color Dot, shown before Post Number in Details, for Partial Payment Posts. Default: #ffff00 (Yellow)
const payoutPostStart    = '[color=#FF6600][[/color]';
const payoutPostEnd      = '[color=#FF6600]][/color]';
const dailyDetailsLegend = `${fullIndicator} - Full Payout | ${partIndicator} - Partial Payout | ${payoutPostStart}${payoutPostEnd} - Posts included in current payout`;
const dailyDetailsStart  = `[/pre][color=#7F7F7F][hide=Details][color=#FFFFFF]`;
const dailyDetailsEnd    =  `\n${dailyDetailsLegend}[/color][/hide][/color][pre]`;
const showPostDetails    = true;   // true: [ON] Shows Details of which posts where included in payouts and if Full or Partial Payments for posts
const scrollToEnd        = true;   // true: [ON] Scroll to Post Reply when autoFill is on
const scriptInfoDisplay  = true;   // true: [ON] Displays User Script Install Info on Payouts

const stickiesRemoval    = true;     // true: [ON] Will remove stickies if present from page
const stickyPosition     = 'bottom'; // Which Sticky to Remove, Options: 'top', 'bottom', or 'both'

const standByImage       = 'https://i.imgur.com/c6m7D75.png';

// Script Info Display Text
const scriptURL          = `https://greasyfork.org/en/scripts/483791-ptp-user-counting-by-pictures-with-a-twist/code`;
const scriptName         = `[Script] Counting by pictures.... with a twist. [v2.3]`;
var   scriptInfo         = `[hr]\n`;
      scriptInfo        += `[b][align=center][size=8][color=#FF6600]----------------------------------------------------------------\n`;
      scriptInfo        += `-- [url=${scriptURL}]${scriptName}[/url] --\n`;
      scriptInfo        += `----------------------------------------------------------------[/color][/size][/align][/b]\n`;
      scriptInfo        += `[hide=Script Purpose]`;
      scriptInfo        += `[*] Will Keep track of counts using https://passthepopcorn.me/user.php?id=104632 payout posts as an anchor. What ever number they post is interpreted as the correct count and counts from there.\n`;
      scriptInfo        += `[*] Will let the user know if the next post is valid or not to the right of the last post on the last page. User must wait for 3 valid posts before posting again. (Not including https://passthepopcorn.me/user.php?id=104632 posts).\n`;
      scriptInfo        += `[*] If your next post is valid the script will autofill the "Post reply" box with a template. The user can use this to hold their count while they collect a photo. User must add photo for count to be valid.\n`;
      scriptInfo        += `v2.2 Changelog:\n`;
      scriptInfo        += `[*] Removes Bottom Sticky Post from View\n`;
      scriptInfo        += `v2.3 Changelog:\n`;
      scriptInfo        += `[*] Code Optimization[/hide]\n`;
      scriptInfo        += `NOTE: On First Install or When Count is '?' User must go back pages until they reach a payout post to correct the count.`;
      scriptInfo        += `[hr]`;

// Scroll To End Info
var setFocus             = document.getElementById("reply_box"),
    setFocusPosition     = 'end';

(function () {
    'use strict';

    var { posts, count, current_page, myUsername, currentCount } = setup();
    posts = removeSticky(posts);
    var playerListLink;

    for (var i = 0; i < posts.length; i++) {
        var p = posts[i];
        if (checkNotCounted(p)) continue;
        var { class1, username, postNum, postDate} = getPostDetails();
        var invalid = true;
        validatePost();
        p.setAttribute('style', 'position:relative;');
        var div = document.createElement('div');
        p.appendChild(div);
        div.setAttribute('style', 'position:absolute; top:5px; width:200px; right:-225px;');
        div.innerHTML = `Post Since Last Payout: ${count}<br>Current Count: ${currentCount}`;
        var nextCount = currentCount + 1
        if (!invalid || (!posts[i + 1] && !document.getElementsByClassName("pagination__link--next")[0])) {
            addPlayerListLink();
            checkNextPostValid();
        };
    }

    function getPostDetails() {
        var u        = p.getElementsByTagName('strong')[0].textContent.split(' (');
        var postNum  = p.getElementsByClassName('forum-post__id')[0].textContent.replace(/#/g, '');
        var username = u[0].trim();
        var class1   = u[1].split(')')[0];

        var dateString = p.getElementsByClassName('time')[0].title;
        var dateObject = new Date(dateString);
        var month      = ('0' + (dateObject.getMonth() + 1)).slice(-2);
        var day        = ('0' + dateObject.getDate()).slice(-2);
        var year       = dateObject.getFullYear();
        var postDate   = `${year}${month}${day}`;

        return { class1, username, postNum, postDate };
    };

    function setup() {
        var clearButton             = document.createElement('button');
            clearButton.id          = 'btn_Clear_LocalStorage';
            clearButton.textContent = 'Clear localStorage';
            clearButton.addEventListener('click', clearLocalStorage);
            clearButton.setAttribute('style', 'position: fixed; top: 10px; right: 10px; z-index: 999;');
        document.body.appendChild(clearButton);

        function clearLocalStorage() {
            Object.keys(localStorage).forEach(key => key.startsWith('CbC_post_') && localStorage.removeItem(key));
            Object.keys(localStorage).forEach(key => key.startsWith('CBPWATDailyLimit_') && localStorage.removeItem(key));
            alert('LocalStorage entries for "Counting by pictures.... with a twist." have been cleared!');
        };

        document.getElementById('content').setAttribute('style', 'overflow:visible;');

        var current_page = parseInt(document.getElementsByClassName("pagination__current-page")[0].textContent);
        var count        = window.localStorage['CbC_post_' + (current_page - 1)];
        var myUsername   = document.getElementsByClassName('user-info-bar__link')[0].textContent;
        var currentCount;
        if (count) {
            currentCount = JSON.parse(count).currentCount;
            count = JSON.parse(count).count;
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
        var dailyPosts;
        var payValid      = false;

        if (username === resetUser && invalid === true) {
            count        = 0;
            currentCount = Number(p.querySelector('.forum-post__bodyguard').textContent.trim().split(' ')[0].split('\n')[0].trim());
            invalid      = false;
        } else if (count !== "?" && invalid === true) {
            if (checkPrevious(username, current_page + i)) {
                count++;
                currentCount++;
                invalid = false;
                saveUserPostCount();
            };
        };

        function saveUserPostCount() {
            var posts      = [];
            var dailyLimit = window.localStorage[`CBPWATDailyLimit_${postDate}`];
            var pC;

            if (dailyLimit) {
                dailyLimit = JSON.parse(dailyLimit);
                pC         = dailyLimit[username];

                if (pC) {
                    posts = pC.posts || [];
                    if(!posts.includes(postNum)) posts.push(postNum);
                } else {
                    posts.push(postNum);
                };

                dailyPosts = posts.length;
            };

            posts.sort(function (a, b) { return a - b });
            var postDailyCount = posts.indexOf(postNum) + 1;
            payValid = postDailyCount > maxPostsPerDay ? false : true;

            if (!dailyLimit) dailyLimit = {};

            dailyLimit[username] = {
                dailyPosts: dailyPosts,
                posts: posts
            };

            localStorage[`CBPWATDailyLimit_${postDate}`] = JSON.stringify(dailyLimit);
        }

        window.localStorage["CbC_post_" + (current_page + i)] = JSON.stringify({
            username: username,
            class: class1,
            count: count,
            invalid: invalid,
            postNum: postNum,
            postDate: postDate,
            dailyPosts: dailyPosts,
            payValid: payValid,
            currentCount: currentCount
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
            a.addEventListener('click', copyPlayers.bind(undefined, postIndex - 1, postIndex, nextCount));
        }
        else {
            a.addEventListener('click', copyPlayers.bind(undefined, postIndex, postIndex, nextCount));
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
            // Check if next post is Valid
            if (checkPrevious(myUsername, current_page + i + 1)) {
                span.innerHTML = "Your next post will be valid";
                span.setAttribute('style', 'color:green;font-weight:bold');
                if (scrollToEnd) document.getElementById('quickpost').focus();
                if(currentCount !== '?'){
                    myUsername == resetUser ? playerListLink.click() : document.getElementById('quickpost').value = `${currentCount+1}\n[img]${standByImage}[/img]`;
                    if (scrollToEnd) scrollOnceLoaded(setFocus, setFocusPosition);
                };
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

function copyPlayers(index,postIndex,nextCount) {
    var players      = getPlayers(index);
    var playersCount = getPlayersCount(index);
    var playersList  = playersCount[0].replace(/\[pre\]\n/g, "[pre]");
    var postText     = scriptInfoDisplay ? `${nextCount}\n[img]${standByImage}[/img]\n${scriptInfo}\n${playersList}\n\n${players}` : `${nextCount}\n[img]${standByImage}[/img]\n${playersList}\n${players}`;
    document.getElementById('quickpost').value                 = postText;
    document.getElementById(`PostInfo_${postIndex}`).innerHTML = playersCount[1];
    var createdHyperlinks = playersCount[2];
    for (var i = 0; i < createdHyperlinks.length; i++) {
        (function () {
            var linkID        = createdHyperlinks[i][0];
            var userName      = createdHyperlinks[i][1];
            var userPosts     = createdHyperlinks[i][2];
            var userBONReward = createdHyperlinks[i][3];
            var searchKey     = createdHyperlinks[i][4];

            var linkElement   = document.getElementById(linkID);

            linkElement.addEventListener('click', function (event) {
                console.log(`Link clicked for ${userName} who had ${userPosts} posts and will receive ${userBONReward} BON!`);
                linkElement.style.color = '#FF6600';
                linkElement.style.textDecoration = 'line-through';
            });
        })();
    };
};

function getPlayers(index) {
    var players    = "[hide=Count Posts]";
    var lastCount  = 0;
    var postsIndex = lastResetPost(index);
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
}

function getPlayersCount(index) {
    var playerCounts         = {};
    var playersFullPayout    = {};
    var playersPartPayout    = {};
    var lastCount            = 0;
    var postsIndex           = lastResetPost(index);
    var lastReset            = postsIndex;
    var lastResetPostNum     = JSON.parse(window.localStorage[`CbC_post_${lastReset}`]).postNum;
    var postRangeEnd         = JSON.parse(window.localStorage[`CbC_post_${index}`]).postNum;

    // PROCESS DAYS IN RANGE ----------------------------------------------------------------- //
    var lastResetDate  = JSON.parse(window.localStorage[`CbC_post_${lastReset}`]).postDate,
        lastPostDate   = JSON.parse(window.localStorage[`CbC_post_${index}`]).postDate;
    var lastResetYear  = parseInt(lastResetDate.substring(0, 4), 10),
        lastResetMonth = parseInt(lastResetDate.substring(4, 6), 10) - 1,
        lastResetDay   = parseInt(lastResetDate.substring(6, 8), 10);
    var lastPostYear   = parseInt(lastPostDate.substring(0, 4), 10),
        lastPostMonth  = parseInt(lastPostDate.substring(4, 6), 10) - 1,
        lastPostDay    = parseInt(lastPostDate.substring(6, 8), 10);
    lastResetDate      = new Date(lastResetYear, lastResetMonth, lastResetDay),
    lastPostDate       = new Date(lastPostYear, lastPostMonth, lastPostDay);
    var currentDate = new Date(lastResetDate);

    function formatDateAsYYYYMMDD(date) {
      const year  = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day   = String(date.getDate()).padStart(2, '0');

      return `${year}${month}${day}`;
    }
    // --------------------------------------------------------------------------------------- //

    postsIndex++;

    while (postsIndex <= index) {
        var c = window.localStorage['CbC_post_' + (postsIndex)];
        postsIndex++;

        if (!c) continue;

        c = JSON.parse(c);

        if (c.count === lastCount) continue;

        lastCount = c.count;

        // Update playerCounts object
        playerCounts[c.username] ? playerCounts[c.username]++ : playerCounts[c.username] = 1;

        if (c.payValid) {
            playersFullPayout[c.username] ? playersFullPayout[c.username]++ : playersFullPayout[c.username] = 1;
        } else {
            playersPartPayout[c.username] ? playersPartPayout[c.username]++ : playersPartPayout[c.username] = 1;
        };
    };

    // Figure out longest Username for uniformity
    var maxUserNameLen = 0
    for (var username in playerCounts) {
        if (username.length > maxUserNameLen) maxUserNameLen = username.length;
    };

    // Figure out longest BONReward for uniformity
    var maxBONRewardLen = 0
    for (username in playerCounts) {
        var userBONReward = playersFullPayout[username] * fullRewardPerPost;
        userBONReward     = numberWithCommas(userBONReward);
        if (userBONReward.length > maxBONRewardLen) maxBONRewardLen = userBONReward.length;
    };
    userBONReward             = ''
    var lineBar               = '-';
    var userDescription       = 'User'; userDescription = userDescription.padEnd(maxUserNameLen, ' ');
    var validPlayersList      = `Rewards Since Last Check [pre] \n${userDescription} - Posts - BON Reward\n`;
        validPlayersList     += `${lineBar.padEnd(maxUserNameLen, '-')}---------------------\n`;
    var validPlayersListHTML  = `Rewards Since Last Check:<br><br>`;
        validPlayersListHTML += `<table width="auto" style=line-height:2px;"><td><strong>User</strong></td><td style="padding:5px"><strong>Posts</strong></td><td style="padding:5px"><strong>BON Reward</strong></td>`;
    var userLinksArr          = [];
    for (username in playerCounts) {
        var fullPaymentCount  = !playersFullPayout[username] ? 0 : playersFullPayout[username];
        var partPaymentCount  = !playersPartPayout[username] ? 0 : playersPartPayout[username];
        var payment;
        if(fullPaymentCount !== 0 && partPaymentCount !== 0){
            payment = (fullPaymentCount * fullRewardPerPost) + (partPaymentCount * partRewardPerPost);
        }
        else if(fullPaymentCount !== 0 && partPaymentCount === 0){
            payment = fullPaymentCount * fullRewardPerPost;
        }
        else if(fullPaymentCount === 0 && partPaymentCount !== 0){
            payment = partPaymentCount * partRewardPerPost;
        };
        userBONReward         = numberWithCommas(payment);
        var userNameFiller    = ''; userNameFiller = userNameFiller.padEnd(maxUserNameLen - username.length, ' ');
        var validCountsFiller = ''; validCountsFiller = validCountsFiller.padEnd(3 - playerCounts[username].toString().length, ' ');
        var BONFiller         = ''; BONFiller = BONFiller.padEnd(maxBONRewardLen - userBONReward.toString().length, ' ');

        // ----------------------------------------------------------------------------------------------------//
        currentDate = new Date(lastResetDate);
        var dailyDetails = dailyDetailsStart;
        var startFound   = false;
        var endFound     = false;
        while (currentDate <= lastPostDate) {
            let formattedDate   = formatDateAsYYYYMMDD(currentDate);
            let dailyPayCount   = 0;
            let displayDate     = formattedDate.slice(0, 4) + '-' + formattedDate.slice(4, 6) + '-' + formattedDate.slice(6);
            let currentDetails  = JSON.parse(localStorage[`CBPWATDailyLimit_${formattedDate}`])[username];
            let currentPosts    = currentDetails ? currentDetails.posts || [] : [];
            let currentPostsLen = currentDetails ? currentDetails.dailyPosts || 0 : 0;
            if (currentPostsLen > 0){
                if (dailyDetails.length > 0 && dailyDetails !== dailyDetailsStart) (dailyDetails = dailyDetails.slice(0, -3), dailyDetails += '\n');
                dailyDetails += `${displayDate}: `;
                for (post in currentPosts) {
                    dailyPayCount++;
                    if (currentPosts[post] > lastResetPostNum && !startFound) (dailyDetails += payoutPostStart, startFound = true);
                    dailyDetails += (dailyPayCount > maxPostsPerDay) ? partIndicator : fullIndicator;
                    dailyDetails += `[url=https://passthepopcorn.me/forums.php?action=viewthread&threadid=28248&postid=${currentPosts[post]}#post${currentPosts[post]}]${currentPosts[post]}[/url]`;
                    if (currentPosts[(Number(post)+1)] > postRangeEnd && !endFound) (dailyDetails += payoutPostEnd, endFound = true);
                    console.log(`Current Post: ${currentPosts[post]}`);
                    console.log(`Next Post: ${post}`);
                    console.log(`Next Post: ${currentPosts[(Number(post)+1)]}`);
                    console.log(`End Post: ${postRangeEnd}`);
                    dailyDetails += `, `;
                };
                dailyDetails += `\n`;
            };
            currentDate.setDate(currentDate.getDate() + 1);
        };
        if (dailyDetails.length > 0 && dailyDetails !== dailyDetailsStart) {
            dailyDetails = dailyDetails.slice(0, -3);
            if (!endFound) dailyDetails += payoutPostEnd;
        };
        dailyDetails += dailyDetailsEnd;
        // ----------------------------------------------------------------------------------------------------//

        validPlayersList     += `${username}${userNameFiller} -  ${validCountsFiller}${playerCounts[username]}  - ${BONFiller}${userBONReward}`;
        validPlayersList     += showPostDetails ? ` ${dailyDetails}\n` : `\n`;
        var formatedDetails   = dailyDetails.replace("[/pre][color=#7F7F7F][hide=Details]", "[color=#FFFFFF][hide=Posts Details]");
            formatedDetails   = formatedDetails.replace("[/hide][/color][pre]","\n");
        var forumStartPostURL = `[url=https://passthepopcorn.me/forums.php?action=viewthread&threadid=28248&postid=${lastResetPostNum}#post${lastResetPostNum}]`;
        var forumEndPostURL   = `[url=https://passthepopcorn.me/forums.php?action=viewthread&threadid=28248&postid=${postRangeEnd}#post${postRangeEnd}]`;
        var forumURLEnd       = `[/url]`;
        var payoutMessage     = `${forumEndPostURL}Counting by pictures.... with a twist. **WIN POINTS**${forumURLEnd}\n`;
            payoutMessage    += `Reward Payout for Posts Range: ${forumStartPostURL}${lastResetPostNum}${forumURLEnd} to ${forumEndPostURL}${postRangeEnd}${forumURLEnd}\n\n`;
            payoutMessage    += `${formatedDetails}\n`;
            payoutMessage     = encodeURIComponent(payoutMessage);
        validPlayersListHTML += `<tr>`;
        validPlayersListHTML +=     `<td>${username}</td>`;
        validPlayersListHTML +=     `<td style="padding: 5px">${playerCounts[username]}</td>`;
        validPlayersListHTML +=     `<td style="padding: 5px">`;
        validPlayersListHTML +=         `<a `;
        validPlayersListHTML +=             `href="https://passthepopcorn.me/bonus.php?`;
        validPlayersListHTML +=                 `target=${username}&amount=${userBONReward}&`;
        validPlayersListHTML +=                 `message=${payoutMessage}" `;
        validPlayersListHTML +=             `id="${lastReset}${username}" `;
        validPlayersListHTML +=             `target="_blank" `;
        validPlayersListHTML +=             `rel="noopener noreferrer"`;
        validPlayersListHTML +=         `>`;
        validPlayersListHTML +=             `${userBONReward}`;
        validPlayersListHTML +=         `</a>`;
        validPlayersListHTML +=     `</td>`;
        validPlayersListHTML += `</tr>`;
        userLinksArr.push([`${lastReset}${username}`, username, playerCounts[username], userBONReward, `${username}${userNameFiller} -  ${validCountsFiller}${playerCounts[username]}  - ${BONFiller}${userBONReward}`]);
    };
    validPlayersList     += "[/pre]";
    validPlayersListHTML += "</table>";
    return [validPlayersList, validPlayersListHTML, userLinksArr];
};

function checkPrevious(username, index) {
    var counter = 0;
    var i = 1;

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
    var lastUser;
    var postsIndex = index;
    do {
        var c = window.localStorage['CbC_post_' + (postsIndex)];
        if (!c) return;
        c = JSON.parse(c);
        postsIndex--;
        lastUser = c.username;
    } while (lastUser !== resetUser)
    return postsIndex;
};

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)){
        x = x.replace(pattern, "$1,$2");
    };
    return x;
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