// ==UserScript==
// @name         PTP - TUG O WAR
// @description  Keeps the count on the PTP TEAM A VS TEAM B--TUG O WAR game.
// @version      1.0
// @author       BovBrew
// @license      MIT
// @namespace    BovBrewPTP
// @icon         https://www.google.com/s2/favicons?domain=passthepopcorn.me
// @match        http*://*passthepopcorn.me/forums.php?*threadid=25848*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506870/PTP%20-%20TUG%20O%20WAR.user.js
// @updateURL https://update.greasyfork.org/scripts/506870/PTP%20-%20TUG%20O%20WAR.meta.js
// ==/UserScript==

// Retrieve Settings from Local Storage if Saved or Defaults to "OFF"
var { skipToEnd } = setLocalSettings();
// Global Variable, Determines if Settings have Changed
var settingsChange = false;
// Creates the Settings Menu
createSettingsMenu('TUG Settingsᅠ⚙️');

// GOTO LAST PAGE
var pageProcessed = false;
var prevPageElem = document.querySelector(".pagination__link--previous");
var nextPageElem = document.querySelector(".pagination__link--next");
var lastPageElem = document.querySelector(".pagination__link--last");
var elementToClick = nextPageElem;
if (elementToClick && skipToEnd) nextPage('Activate');
if (!elementToClick && skipToEnd) document.getElementById('skipToEndToggle').click()

var postsToPrint = 60;

var staff_classes = ["Producer", "Administrator", "Developer", "Moderator", "First Line Support", "Legend", "VIP"];
var teamA = ['B', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', '0', '1', '2', '3', '4'];
var teamB = ['A', 'C', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '5', '6', '7', '8', '9'];

(function () {
    'use strict';

    var { posts, count, current_page, myUsername, myTeam } = setup();
    posts = removeSticky(posts);
    // # of Posts
    var postsNum = posts.length;

    for (var i = 0; i < posts.length; i++) {
        var p = posts[i];
        if (checkNotCounted(p)) {
            continue;
        }
        var { class1, username, postNum, team } = getPostDetails();
        var valid = true;
        var countIncrease;
        if (staff_classes.indexOf(class1) !== -1) {
            checkRed();
        }
        validatePost();
        p.setAttribute('style', 'position:relative;');
        var div = document.createElement('div');
        p.appendChild(div);
        div.setAttribute('style', 'position:absolute; top:5px; width:200px; right:-225px;');
        div.innerHTML = "Count: " + count;
        if (count == '?') addStartLink(current_page,i,username,class1, count, valid, postNum, team, countIncrease);
        var nextCount;
        if (myTeam == 'A') nextCount = count + 1;
        if (myTeam == 'B') nextCount = count - 1;
        if (nextCount === 41 || nextCount === -41 || nextCount === '41' || nextCount === '-41' || count === -40 || count === 40 || count === '-40' || count === '40') nextCount = 0;
        if ((count === -40 && !valid) || (count === 40 && !valid) || (!posts[i + 1] && !document.getElementsByClassName("pagination__link--next")[0])) {
            addPlayerListLink();
            checkNextPostValid(nextCount);
        };

        if (i === postsNum - 1 && lastPageElem && skipToEnd) nextPage('Check');
    }

    function setup() {
        document.getElementById('content').setAttribute('style', 'overflow:visible;');

        var current_page = parseInt(document.getElementsByClassName("pagination__current-page")[0].textContent);
        var count = window.localStorage['TOWpost_' + (current_page - 1)];
        var myUsername = document.getElementsByClassName('user-info-bar__link')[0].textContent;
        var myFirstLetter = myUsername.charAt(0).toUpperCase();
        var myTeam;
        var isInTeamA = teamA.includes(myFirstLetter);
        var isInTeamB = teamB.includes(myFirstLetter);
        if (isInTeamA) {
            myTeam = 'A';
        } else if (isInTeamB) {
            myTeam = 'B';
        } else {
            myTeam = 'ERR';
        };
        if (count) {
            count = JSON.parse(count).count;
        }
        else {
            count = '?';
        }
        var posts = document.getElementsByClassName('forum_post');
        return { posts, count, current_page, myUsername, myTeam };
    }

    function getPostDetails() {
        var u = p.getElementsByTagName('strong')[0].textContent.split(' (');
        var postNum = p.getElementsByClassName('forum-post__id')[0].textContent.replace(/#/g, '');
        var username = u[0].trim();
        var class1 = u[1].split(')')[0];
        var firstLetter = username.charAt(0).toUpperCase();
        var team;
        var isInTeamA = teamA.includes(firstLetter);
        var isInTeamB = teamB.includes(firstLetter);
        if (isInTeamA) {
            team = 'A';
        } else if (isInTeamB) {
            team = 'B';
        } else {
            team = 'ERR';
        };
        if (class1 === "VIP") team = 'B';
        return { class1, username, postNum, team };
    }

    function validatePost(forceValidate=false) {
        var lastReset = window.localStorage['TOWpost_' + (lastResetPost(current_page + i - count))];
        if (staff_classes.indexOf(class1) !== -1 && valid) {
            if (count !== '?') {
                if (count === -40 || count === 40) {
                    count = 0;
                    valid = false;
                } else {
                    if (count > 22 || count < -22) {
                        switch (team) {
                            case 'A':
                                countIncrease = '+1';
                                count++;
                                valid = false;
                                break;
                            case 'B':
                                countIncrease = '-1';
                                count--;
                                valid = false;
                                break;
                        };
                    } else {
                        team = 'Staff';
                        var staffPostNum = parseInt(postNum);
                        var lastDigit = staffPostNum % 10;
                        if (class1 === 'VIP') {
                            countIncrease = '-5';
                            count -= 5;
                            valid = false;
                        } else {
                            switch (lastDigit % 2) {
                                case 0: // If even
                                    countIncrease = '+5';
                                    count += 5;
                                    valid = false;
                                    break;
                                case 1: // If odd
                                    countIncrease = '-5';
                                    count -= 5;
                                    valid = false;
                                    break;
                            }
                        };
                    }
                }
            }
        }
        else if (count !== "?" && valid) {
            if (count === -40 || count === 40) {
                count = 0;
                valid = false;
            } else {
                if (checkPrevious(username, current_page + i)) {
                    switch (team) {
                        case 'A':
                            countIncrease = '+1';
                            count++;
                            valid = false;
                            break;
                        case 'B':
                            countIncrease = '-1';
                            count--;
                            valid = false;
                            break;
                        case 'ERR':
                            countIncrease = '';
                            break;
                    };
                }
            }
        }
        if (lastReset === undefined && count === "?") {
            const startPost = window.localStorage.TOWStartpost ? JSON.parse(window.localStorage.TOWStartpost) : window.localStorage.TOWStartpost;
            if (startPost) {
                const startPosition = startPost.StartingLocation;
                if (startPosition == current_page + i){
                    count = 0;
                };
            };
        };
        window.localStorage['TOWpost_' + (current_page + i)] = JSON.stringify({ username: username, class: class1, count: count, valid: valid, postNum: postNum, team: team, countIncrease: countIncrease });
        return lastReset;
    }

    function addPlayerListLink() {
        var a = document.createElement('a');
        a.innerHTML = `Copy last ${postsToPrint} players to post reply`;
        a.href = 'javascript:void(0);';
        if (count === -40 || count === 40) {
            a.innerHTML = "Copy Round Stats to post reply";
            a.addEventListener('click', copyPlayers.bind(undefined, current_page + i - 1));
        }
        else {
            a.addEventListener('click', copyPlayers.bind(undefined, current_page + i));
        }
        div.appendChild(document.createElement('br'));
        div.appendChild(a);
    }

    function addStartLink() {
        var a = document.createElement('a');
        a.innerHTML = "Start Count Here";
        a.href = 'javascript:void(0);';
        a.addEventListener('click', startLink.bind(undefined, current_page, i, username, class1, count, valid, postNum, team, countIncrease));
        div.appendChild(document.createElement('br'));
        div.appendChild(a);
    }

    function checkNextPostValid(nextCount) {
        if (!posts[i + 1] && !document.getElementsByClassName("pagination__link--next")[0]) {
            var span = document.createElement('span');
            var tempCount = count + 1;
            if (tempCount > 60) {
                tempCount = 1;
            }
            // Check if next post is Valid
            // Staff
            if (isStaff(myUsername, current_page + i)) {
                var lastReset = window.localStorage['TOWpost_' + (lastResetPost(current_page + i))];
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
            else if (checkPrevious(myUsername, current_page + i + 1)) {
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

    // If the count gets messed up, the moderator will post in BOLD RED numbers the current count.
    // Checking for Red number within post.
    function checkRed() {
        var spans = p.getElementsByClassName('forum-post__bodyguard')[0].getElementsByTagName('span');
        for (var x = 0; x < spans.length; x++) {
            console.log("Checking to see if red...");
            console.log(spans[x].style.color);
            if (spans[x].style.color === "rgb(204, 0, 0)" || spans[x].style.color === "rgb(255, 0, 0)" || spans[x].style.color === "rgb(255, 102, 0)" || spans[x].style.color === "red") {
                console.log("Red!");
                console.log("Checking to see if " + spans[x].innerText + " is an integer...");
                if (!isNaN(spans[x].innerText)) {
                    console.log("Integer!");
                    count = parseInt(spans[x].innerText);
                    valid = false;
                }
            }
        }
    }
})();

// Checks if the string 'not counted' is located in the post. If found the post is skipped and not counted.
// if a post with 'not counted' is quoted then it will be inside "BLOCKQUOTE" tag and skips before checking for 'not counted'
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

function startLink(current_page,i,username,class1, count, valid, postNum, team, countIncrease) {
    console.log('startLink Pressed');
    console.log(`TOWpost_${(current_page + i)}:`,JSON.stringify({ username: username, class: class1, count: 0, valid: valid, postNum: postNum, team: team, countIncrease: countIncrease }));
    window.localStorage.TOWStartpost = JSON.stringify({ StartingLocation: current_page + i, username: username, class: class1, count: 0, valid: valid, postNum: postNum, team: team, countIncrease: (team == "A" ? "+00" : "-00") });
    window.localStorage['TOWpost_' + (current_page + i)] = JSON.stringify({ username: username, class: class1, count: 0, valid: valid, postNum: postNum, team: team, countIncrease: (team == "A" ? "+00" : "-00") });
    location.reload();
}

function copyPlayers(index) {
    var players = getPlayers(index);
    document.getElementById('quickpost').value = players;
}

function getPlayers(index) {
    let winningLog = false;
    let players = "[hide=Corrected Count]";
    let lastCount = 0;
    let winningteam;
    let losingteam;
    const rawpost = window.localStorage['TOWpost_' + (index + 1)];
    const currentPost = rawpost ? JSON.parse(rawpost) : JSON.parse(window.localStorage['TOWpost_' + (index)]);
    let postsIndex;

    // Check if the game has ended
    if (currentPost.count === 40 || currentPost.count === -40) {
        winningLog = true;
        winningteam = currentPost.team;
        losingteam = winningteam === "A" ? "B" : "A";
        players = "[hide=Final Count]";
        postsToPrint = 10000;
    }

    postsIndex = lastResetPost(index) + 2;

    let winningTeam = [];
    let winningInfo = {};
    let losingTeam = [];
    let losingInfo = {};

    while (postsIndex <= index + 1) {
        let c = window.localStorage['TOWpost_' + postsIndex];
        postsIndex++;
        if (!c) continue;

        c = JSON.parse(c);
        console.log('c:',c)
        const countIncrease = c.countIncrease === undefined ? '00' : c.countIncrease
        const cI = `[code]${countIncrease}[/code]`;
        const formattedCount = `[code]${(c.count >= 0 ? "+" : "-") + ("00" + Math.abs(c.count)).slice(-2)}[/code]`;

        if (c.count === lastCount && c.count !== 0) {
            players += formatPlayerLine(c, cI, formattedCount, true);
            continue;
        }

        if (winningLog) {
            c.countIncrease = c.countIncrease === undefined ? (c.team == 'A' ? '+1' : '-1') : c.countIncrease
            updateTeamInfo(winningteam, c.countIncrease, c.username, winningTeam, losingTeam, winningInfo, losingInfo);
        }

        lastCount = c.count;
        players += formatPlayerLine(c, cI, formattedCount, false);
    }

    players += "[/hide]";

    if (winningLog) {
        // Sort team information before displaying
        players += displaySortedTeams(winningteam, losingteam, winningTeam, losingTeam, winningInfo, losingInfo);
    }

    return players;
}

function formatPlayerLine(c, cI, formattedCount, isStrikethrough) {
    let playerLine = `${isStrikethrough ? "[s]" : ""}${cI} | ${formattedCount} | `;
    if (c.postNum) {
        playerLine += `[url=https://passthepopcorn.me/forums.php?action=viewthread&threadid=25848&postid=${c.postNum}#post${c.postNum}]`;
    }
    playerLine += c.username;
    if (c.postNum) {
        playerLine += "[/url]";
    }
    playerLine += isStrikethrough ? "[/s]\n" : "\n";
    return playerLine;
}

function updateTeamInfo(winningteam, countIncrease, username, winningTeam, losingTeam, winningInfo, losingInfo) {
    const isWinningAction = (winningteam === "A" && countIncrease === "+1") || (winningteam === "B" && countIncrease === "-1");

    const team = isWinningAction ? winningTeam : losingTeam;
    const info = isWinningAction ? winningInfo : losingInfo;

    if (!team.includes(username)) {
        team.push(username);
        info[username] = 1;
    } else {
        info[username] += 1;
    }
}

function displaySortedTeams(winningteam, losingteam, winningTeam, losingTeam, winningInfo, losingInfo) {
    const sortedWinningInfo = Object.entries(winningInfo).sort(([, a], [, b]) => b - a);
    const sortedLosingInfo = Object.entries(losingInfo).sort(([, a], [, b]) => b - a);

    let output = "\n\n[hide=Winning Team]";
    output += `Team ${winningteam}\n\n`;
    for (let [username, count] of sortedWinningInfo) {
        output += `Posts: ${formatCount(count)} | ${username}\n`;
    }
    output += "[/hide]";

    output += "\n\n[hide=Challengers]";
    output += `Team ${losingteam}\n\n`;
    for (let [username, count] of sortedLosingInfo) {
        output += `Posts: ${formatCount(count)} | ${username}\n`;
    }
    output += "[/hide]";

    return output;
}

function formatCount(count) {
    return count > 99 ? count : (count > 9 ? '0' + count : '00' + count);
}

function checkPrevious(username, index) {
    var counter = 0;
    var i = 1;

    while (counter < 3) {
        var c = window.localStorage['TOWpost_' + (index - i)];
        if (c) {
            c = JSON.parse(c);
            if (c.count === -40 || c.count === 40) {
                return true;
            }
            if (!c.valid) {
                if (c.username === username) {
                    return false;
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
    var postschecked = 0;
    do {
        postschecked++;
        var c = window.localStorage['TOWpost_' + (postsIndex)];
        if (!c) {
            return;
        }
        c = JSON.parse(c);
        postsIndex--;
        lastCount = c.count;
    } while ((lastCount < 40 && lastCount > -40 && lastCount != '?') && postschecked < postsToPrint+1)
    return postsIndex;
}

function isStaff(username, index) {
    var postsIndex = index;
    do {
        var c = window.localStorage['TOWpost_' + (postsIndex)];
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

// Retrieve Settings from Local Storage or Set to Defaults if Not Found
function setLocalSettings() {
    // Default Settings if No Settings are Initially Found
    var skipToEnd = false;

    // Get Current Settings in Local Storage
    const storedSettingsJSON = window.localStorage.TOW_Settings;
    // To Prevent Errors, Only Parse JSON if They Exist
    const storedSettings = storedSettingsJSON ? JSON.parse(storedSettingsJSON) : {};

    // Checks if storedSettings Exists
    if (storedSettings) {
        /* If storedSettings are located it will set the variable OR '||'
           If storedSettings are found but the specific settings is not then it defaults as set above */
        skipToEnd = storedSettings.skipToEnd || skipToEnd;
    };

    // Save Settings to Local Storage
    window.localStorage.TOW_Settings = JSON.stringify({ skipToEnd });

    return { skipToEnd };
};

// Updates Settings in Local Storage
function updateSettings(setting, status) {
    // Get Current Settings in Local Storage
    const storedSettings = JSON.parse(window.localStorage.TOW_Settings);

    // If StoredSettings Retrieved, Select Settings to Update
    if (storedSettings) {
        switch (setting) {
            case 'skipToEnd':
                storedSettings.skipToEnd = status;
                break;
        };
        // Update Settings in Local Storage
        window.localStorage.TOW_Settings = JSON.stringify(storedSettings);
    };
};

function resetKey(key) {
    if (localStorage.getItem(key)) localStorage.removeItem(key);
};

function checkKey(key) {
    if (localStorage.getItem(key)) return true;
    return false;
};

function nextPage(mode) {
    const key = 'TUG_Settings_SkipToEnd';
    if (mode === 'Activate') activateNextPage();
    if (mode === 'Deactivate') deactivateNextPage();
    if (mode === 'Check') checkNextPage();

    function activateNextPage() {
        const nowTime = new Date();
        resetKey(key);
        localStorage.setItem(key, nowTime.toString());
    };

    function deactivateNextPage() {
        resetKey(key);
    };

    function checkNextPage() {
        const checkReadyNextPage = () => {
            if (checkKey(key)) {
                const nowTime = new Date();
                const activatedTime = localStorage.getItem(key);
                const lastActivated = new Date(activatedTime);
                const timeDifference = (nowTime - lastActivated) / (1000);
                if (timeDifference >= 3) {
                    deactivateNextPage();
                    elementToClick.click();
                };
            }
        };
        const countdownInterval = setInterval(checkReadyNextPage, 1000);
    };
};

function clearLocalStorage() {
    for (var key in localStorage) {
        if (key.startsWith('TOWpost_')) {
            localStorage.removeItem(key);
        }
    }
    resetKey('TOWStartpost');
    alert('LocalStorage entries for TEAM A VS TEAM B Script have been cleared!');
}

// Create Settings Menu
function createSettingsMenu(menuTitle) {
    const logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAPCAYAAABqQqYpAAAAAXNSR0IArs4c6QAABTFJREFUSEutlGlsVFUUx/9vuXfezJu97Ws7QMESqKyhrAliDYiF0qYSQRuRJRqMAaNBC5Ka8IWY2CAYRAU+1BgSSYBgCJEiAcRUXKgIVlmKtAVkKW1pme3NezPvvsVMEVNJCTHxfLk3OTnn/7v/e8/l8P+FIFD6rGWgCiDTAjIUt0S1rj6jmRCjnjHW8jApLpuglE7web0rNV3frOv6jf/I5aOS9LqRttfnKjS4Yq4f88t8KC3xQrJsNLUksGZrH9pupt4E2MeD9eYopRN52L+J1KWpaioIgD0KghAymVlCBQSuCqI9HbrD15YV4v1X8kAK3YDoAPkWkJtdXXDaNZTXdOD42dg6wN78YH8uGAzsTybii2Sv70gikax4CEBQoO55lmFVgBPLIyP4wjkjPVg5NYhvzxnI6QjijZV5QF4C5k0bFgN4D8BHAM7lgB/lAnI4VC+9hK+aemsBfDhQh1MUpamnp6csHAyuuRuLfTQw6fO5Smxb2pVKpWeMnyChfIoHlSUBzCr0gSoE6BOQ+toFqCL4STHQfAZb58FnhTkHZpSHbQEC50AsoUAxMP3lFpy+zK8CU3fe1+JCIf8Rm9kH46q6YyCAy+WqMhi/RySGfGzraDw1KQg4BLjlAN0ZABZun5JhdVMIPguBySm4wzYg2HCSIrQuAlpggPotwKIw+yyICgXLZyit/QMX2lkVoDVmNblQKFQnCPxYVY3vSqdNfzgcLOXgLLYta3Q0nuJfWz4UO+tGAicySKsceGKAuh3cafYgflOEEhRhCTakaXG4ghbsq17YV2RoaYbgTAPgXTh4MooJpRaKAyIQ9qC1O4Fln1w0U4K790a3vaV/OmRJquNEvooKRNczmtd2+I2ESMPVjL79zLYSTC4IADd4rGi4ihfHFGB+UQFwxQZyRBz/swsJLoPnFriBaxLutBK81d6GJaPCGOny4MfbKt795Rp2PV+E8koZrDMDEpFxoVtFzbbzuNRJT/VDDB7uEwtmSrMb15YC53ms2tuBnReuonrYUDwe8EAVGCIeCZ9d7sTasUOweuIION0Oqlt+x6H2W8jzy1AzJvRM9uqADePGYOOyIkC5A4hulG1sxcn29KuA1jAoRE5OzsK+vr4Dp16YiRlDFCzefxZf3rgOj+wGAw+mZwDbvMfOcTgwZyoWFg9H/bkLqDvVikDA/6tuWseJSMIwM6265Xh8AtnYPHsKSqr9+Ob8RVQ09P7AtNis/haDukDp4WXFuRWflo5F2ZEzaInG4rLPs13kuescx48XRXqOsXSbZSFP5Z36Y9NLRsyNKPDuPQZJGXKLsPTWeDz+mEQlLRqPr+vXoHR3ERGWHJ49FVvb29BwJV4DQ983KIQkSU+mmfHdrGEKbic1dCT0ZhfPbyCElBAi1KZ1zdTTbDyAez57/V/sGJf/UlHAj8qjLT8VFuY2msx8r7e3D8FQaGk0Gt19/6A8pfW2ydaH/IGr0Vis+J8RfdCJAiVvfyx2d5HJkazT+1g6XRPwyZsMxtYxZiAYyn2nt7f3g/t1bq930VBi75cFHm2muJxyXEE0Gt2kKHlHe3ruzBvE6WJKKTUM49KgEB6PZxrPOT9nk45jd6W0TCS7jUSUpu6unjJZljOm5RRrmtY5sLns8x1KJZOVipK3XVVTn5ssc5oQEneQHqNpuP3wx//3s/r3DylvsUzzbUIIOIdrjCWTVdl8bm74e13TngAnpGzbflrX9eaBdYFAoMZkmT22bYPjxUpJos+oyeQaye3ekUioqx8F8RcSiyygpD0yuAAAAABJRU5ErkJggg==';
    const logoImg = `<img src="${logo}" alt="Icon" style="vertical-align: middle; margin-right: 8px;">`;
    // Create Menu Button
    const button = document.createElement('button');
    button.id = 'scriptSettingsButton';
    button.textContent = menuTitle;
    button.innerHTML = `${logoImg} ${menuTitle}`;

    // Create Dropdown Menu
    const dropdown = document.createElement('div');
    dropdown.id = 'settingsDropdown';
    dropdown.style.display = 'none';

    // Create checkboxes and labels
    const skipToEndToggle = createCheckbox('skipToEndToggle', 'Skip To End');

    const spacer1 = document.createElement('div');
    spacer1.className = 'menuSuperSpacer';

    const spacer2 = document.createElement('div');
    spacer2.className = 'menuSpacer';

    const resetHistoryBtn = createButton('resetHistoryBtn','Reset History');
    resetHistoryBtn.addEventListener('click', clearLocalStorage);

    // Create toolTips
    skipToEndToggle.appendChild(createTooltip('Go To Next Page until Last Page is Found. Deactivates at the end.'));

    // Append Menu Button and Dropdown to the body
    document.body.appendChild(button);
    document.body.appendChild(dropdown);

    // Append Checkboxes and Labels to Dropdown
    dropdown.appendChild(skipToEndToggle);
    dropdown.appendChild(spacer1);
    dropdown.appendChild(spacer2);
    dropdown.appendChild(resetHistoryBtn);

    // Initialize Checkboxes with Current Settings
    skipToEndToggle.firstElementChild.checked = skipToEnd;

    // Add Event Listeners for Menu Button and Dropdown
    button.addEventListener('mouseover', () => {
        dropdown.style.display = 'block';
    });
    button.addEventListener('mouseout', () => {
        dropdown.style.display = 'none';
    });
    dropdown.addEventListener('mouseover', () => {
        dropdown.style.display = 'block';
    });
    dropdown.addEventListener('mouseout', () => {
        dropdown.style.display = 'none';
        // Refreshes Page if Settings Have Changed and Dropdown is Closed
        if (settingsChange) {
            settingsChange = false;
            refreshPage();
        };
    });

    // Add Event Listeners for Mouse Over Tool Tips
    skipToEndToggle.addEventListener('mouseover', function () {
        this.timeout = setTimeout(() => {
            const tooltip = skipToEndToggle.querySelector('.tooltip');
            tooltip.style.display = 'inline-block';
            tooltip.style.width = 'auto';
        }, 250);
    });
    skipToEndToggle.addEventListener('mouseout', function () {
        clearTimeout(this.timeout);
        const tooltip = skipToEndToggle.querySelector('.tooltip');
        tooltip.style.display = 'none';
    });

    // Add Event Listeners for Setting CheckBoxes: Update Settings in Local Storage on Change
    skipToEndToggle.firstElementChild.addEventListener('change', function () {
        skipToEnd = this.checked;
        updateSettings('skipToEnd', skipToEnd);
        settingsChange = true;
    });

    // Set Settings Menu CSS
    setSettingsMenuCSS();

    function createCheckbox(id, labelText) {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + labelText));
        return label;
    };

    function createLabel(id, labelText) {
        const label = document.createElement('label');
        label.id = id;
        label.innerHTML = `<strong>${labelText}</strong>`;;
        return label;
    };

    function createButton(id, buttonText) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = buttonText;
        return button;
    };

    function createTooltip(text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        return tooltip;
    };

    // Sets the Settings Menu CSS and Appends it to Document
    function setSettingsMenuCSS() {
        var settingsMenuCSS = `
                                #scriptSettingsButton {
                                    position: fixed;
                                    top: 10px;
                                    right: 10px;
                                    background-color: rgba(0, 0, 0, 0.5);
                                    color: white;
                                    border: none;
                                    padding: 10px;
                                    cursor: pointer;
                                    z-index: 1000;
                                }

                                #settingsDropdown {
                                    display: none;
                                    position: fixed;
                                    width: 170px;
                                    top: 48px;
                                    right: 10px;
                                    background-color: rgba(0, 0, 0, 0.5);
                                    color: white;
                                    border: none;
                                    padding: 10px;
                                    z-index: 1000;
                                }

                                #settingsDropdown label {
                                    display: block;
                                    margin-bottom: 5px;
                                }

                                #skipToEndToggle{
                                    margin-bottom: 30px;
                                }

                                #resetHistoryBtn {
                                    margin: 0 0 0 34px;
                                    background: black;
                                    color: white;
                                    border-radius: 5px;
                                }

                                .menuSuperSpacer {
                                    margin-bottom: 12px; /* Adjust the spacing as needed */
                                }

                                .menuSpacer {
                                    margin-bottom: 12px; /* Adjust the spacing as needed */
                                }

                                .tooltip {
                                    display: none;
                                    flex-wrap: nowrap;
                                    position: absolute;
                                    top: 26%;
                                    left: 0%;
                                    width: auto;
                                    background-color: rgba(0, 0, 0, 0.8);
                                    color: white;
                                    padding: 5px;
                                    border-radius: 3px;
                                    z-index: 1001;
                                    pointer-events: none;
                                }`;
        var settingsMenuStyleSheet = document.createElement("style");
        settingsMenuStyleSheet.innerText = settingsMenuCSS;
        document.head.appendChild(settingsMenuStyleSheet);
    };
};

// Function to refresh the page
function refreshPage() {
    location.reload(true);
};