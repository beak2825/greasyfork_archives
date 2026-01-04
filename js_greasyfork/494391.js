// ==UserScript==
// @name         Reddit Check for Subscribed User/Subreddit
// @namespace    http://tampermonkey.net/
// @version      2024-10-03
// @description  Determines whether you're subscribed to a user or a subreddit, and alters their name accordingly.
// @author       You
// @match        https://*.reddit.com/*
// @exclude      https://*.reddit.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/494391/Reddit%20Check%20for%20Subscribed%20UserSubreddit.user.js
// @updateURL https://update.greasyfork.org/scripts/494391/Reddit%20Check%20for%20Subscribed%20UserSubreddit.meta.js
// ==/UserScript==

var subListUrl = "https://www.reddit.com/subreddits/mine/subscriber.json?limit=100";
var scriptID = "RedditCheckforSubscribedUser";

var checkedSession = getCookie(scriptID);
if(checkedSession == null) {
    checkedSession = uuidv4();
    // Use cookies so that different reddit accounts in different sessions don't clobber subscriber lists
    setCookie(scriptID,checkedSession,1);
}

console.log("SessionID: "+checkedSession);

var checkedID = scriptID+"-lastChecked-"+checkedSession;
var subbedID = scriptID+"-subbedUsers-"+checkedSession;
var followID = scriptID+"-followedSubreddits-"+checkedSession;

var lastChecked = GM_getValue(checkedID, 0);
var subbedUsers = new Map(Object.entries(GM_getValue(subbedID, new Map())));
console.log(subbedUsers);
var followedSubreddits = new Map(Object.entries(GM_getValue(followID, new Map())));
console.log(followedSubreddits);

function applyNameFormattingSidebar() {
    var sidebar = document.querySelector('.side .usertext-body');

    if(sidebar) {
        for(const [sub,val] of followedSubreddits) {
            let els = sidebar.querySelectorAll('[href*="r/'+sub+'" i]:not([style*="chartreuse"])');
            for(const el of els) {
                applyColourChange(el,true);
            }
        }

        for(const [sub,val] of subbedUsers) {
            let els = sidebar.querySelectorAll('[href*="user/'+sub+'" i]:not([style*="chartreuse"])');
            for(const el of els) {
                applyColourChange(el,true);
            }
        }
    }
}

function removeEntries(isUser, subscribed) {
    if (isUser) {
        for (const [key, value] of subbedUsers) {
            if (value == subscribed) {
                subbedUsers.delete(key);
            }
        }
    } else {
        for (const [key, value] of followedSubreddits) {
            if (value == subscribed) {
                followedSubreddits.delete(key);
            }
        }
    }
}

function applyColourChange(element, subscribed) {
    if(subscribed) {
        element.style.color = "chartreuse";
    } else {
        element.style.removeProperty('color');
    }
}

function removeColours() {
    let elements = document.querySelectorAll('[style*="chartreuse"]');
    for(var i = 0; i < elements.length; i++) {
        applyColourChange(elements[i], false);
    }
}

function applyColourChangeToName(isUser,user, subscribed) {
    let elements
    if(isUser) {
        elements = document.querySelectorAll('[href*="user/'+user+'" i][class*="author" i]');
    } else {
        elements = document.querySelectorAll('[href*="r/'+user+'" i][class*="subreddit" i]');
    }
    for(var i = 0; i < elements.length; i++) {
        applyColourChange(elements[i], subscribed);
    }
}

function setSubscribedStatus(isUser,user,subscribed) {
    console.log("Subscriber Status update for " + user + " which is " + (isUser ? "User" : "Subreddit") + " to colour " + (subscribed ? "Green" : "Unset"));
    if(isUser) {
        subbedUsers.set(user,subscribed);
        GM_setValue(subbedID, Object.fromEntries(subbedUsers));
    } else {
        followedSubreddits.set(user,subscribed);
        GM_setValue(subbedID, Object.fromEntries(followedSubreddits));
    }
    applyColourChangeToName(isUser, user, subscribed);
}

function changeCursor(wait) {
    if(wait) {
        document.body.style.cursor = 'wait';
    } else {
        document.body.style.cursor = "unset";
    }
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/;domain=reddit.com";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=reddit.com';
}
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
                                                          (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
                                                         );
}

(function() {
    'use strict';

    if(window.location.href.includes("www.reddit") || window.location.href.includes("old.reddit")) {
        // Applies formatting to any names within the subscribed list
        applyNameFormatting(true);
        applyNameFormatting(false);

        // Periodically fetches the subscribers list from the reddit page and populates a tampermonkey storage with it for name formatting
        updateSubscribersList();

        // Globally apply colouring for names which are in one of the lists... Might render the other apply calls pointless if I can be bothered to implement removal also.
        applyNameFormattingSidebar();

        var button = document.createElement('BUTTON');
        var span = document.createElement('SPAN');
        span.classList.add("separator");
        span.innerHTML = "|";
        button.innerHTML = 'ReCheck Subbed Highlights';
        button.id = "resetSubbedList";
        button.style.fontSize = "xx-small";
        var userSelection = document.querySelector('#header-bottom-right>.user');
        userSelection.append(span);
        userSelection.append(button);

        document.querySelector("#resetSubbedList").addEventListener("click", function(thing) {
            changeCursor(true);
            lastChecked = 0;
        });
    } else {
        // Handle 'new' reddit highlighting on search page
        applyNameFormattingNewReddit(true);
        applyNameFormattingNewReddit(false);
    }
})();

function applyNameFormattingNewReddit(isUser) {
    let elements
    if(isUser) {
        elements = document.querySelectorAll('faceplate-tracker[noun*="people"]>div');
    } else {
        elements = document.querySelectorAll('faceplate-tracker[noun*="subreddit"]>div');
    }
    let names = Array.from(elements).map(function(thing) {let stuff = thing.children[0].children[0].href.split("/").filter(x => x!= ""); return stuff[stuff.length-1]})

    if(isUser){
        // If the length is different, we've loaded a new page
        // Apply colour changes for all the checked users if they're subscribed
        for(const [key, value] of subbedUsers){
            for(let i = 0; i < elements.length; i++) {
                if(value && names[i] == key) {
                    elements[i].style.backgroundColor = "darkred";
                } else {
                    elements[i].style.removeProperty('backgroundColor');
                }
            }
        }

    } else {
        // Apply colour changes for all the checked subreddits if they're followed
        for(const [key, value] of followedSubreddits){
            for(let i = 0; i < elements.length; i++) {
                if(value && names[i] == key) {
                    elements[i].style.backgroundColor = "darkred";
                } else {
                    elements[i].style.removeProperty('backgroundColor');
                }
            }
        }
    }

    setTimeout(x => {applyNameFormattingNewReddit(isUser)}, 1000);
}

function applyNameFormatting(isUser) {
    let names
    if (isUser) {
        names = document.querySelectorAll('[class*="author"]');
    } else {
        names = document.querySelectorAll('[class*="subreddit"]');
    }
    names = Array.from(names);
    names = names.map(function (thing) { return thing.innerText; });
    // Remove duplicates (and 'undefined' user, whoever that is)
    names = [...new Set(names)];
    names = names.filter(x => x != "undefined");

    if(isUser){
        // If the length is different, we've loaded a new page
        // Apply colour changes for all the checked users if they're subscribed
        for(const [key, value] of subbedUsers){
            applyColourChangeToName(isUser,key,value);
        }

    } else {
        // Apply colour changes for all the checked subreddits if they're followed
        for(const [key, value] of followedSubreddits){
            applyColourChangeToName(isUser,key,value);
        }

    }
    setTimeout(x => {applyNameFormatting(isUser)},1000);
}

async function updateSubscribersList() {
    if(window.location.href.includes("www.reddit")) {
        // If it's been longer than 6 hours
        if(new Date().getTime() - lastChecked > 21600000) {
            changeCursor(true);
            lastChecked = new Date().getTime();
            GM_setValue(checkedID, lastChecked);

            // Wipe existing entries list
            removeEntries(true);
            removeColours();

            var response = await fetch(subListUrl, {
                method: "GET",
                mode: "same-origin",
                credentials: "include"});
            var json = await response.json();
            var fetch_after = json.data.after;
            var fetch_data = json.data.children.map(x => x.data.display_name_prefixed);

            var checkMore = (fetch_after == null ? false : true);
            while(checkMore) {
                await new Promise(r => setTimeout(r, 100));
                response = await fetch(subListUrl+"&after="+fetch_after, {
                    method: "GET",
                    mode: "same-origin",
                    credentials: "include"});
                json = await response.json();
                fetch_after = json.data.after;
                fetch_data.push( ...(json.data.children.map(x => x.data.display_name_prefixed)) );

                checkMore = (fetch_after == null ? false : true);
            }

            subbedUsers = new Map(fetch_data.filter(x => x.startsWith("u/")).map(x => {return [x.split('/')[1], true];}));
            GM_setValue(subbedID, Object.fromEntries(subbedUsers));
            followedSubreddits = new Map(fetch_data.filter(x => x.startsWith("r/")).map(x => {return [x.split('/')[1], true];}));
            GM_setValue(followID, Object.fromEntries(followedSubreddits));

            changeCursor(false);
            for(const [key, value] of subbedUsers){
                applyColourChangeToName(true,key,value);
            }
            for(const [key, value] of followedSubreddits){
                applyColourChangeToName(false,key,value);
            }

            lastChecked = new Date().getTime();
            GM_setValue(checkedID, lastChecked);

        }
    }
    setTimeout(updateSubscribersList, 1000);
}

// Little section on hijacking the xhr requests that reddit enhancement suite sends when you toggle following a user so we can see if/when reddit responds with an error, since RES doesn't handle it really
// Also a good way to workaround having to re-read the entire subscribed list!
// https://stackoverflow.com/questions/36336486/intercepting-xmlhttprequest-in-greasemonkey-while-using-grant-the-right-way
var postXhrInject = function(xhr) {
    if(xhr.responseURL.includes("api/subscribe")) {
        let recentUser = unsafeWindow.recentUserTampermonkeyScriptVar;
        if(xhr.status != 200) {
            alert("Failed to toggle "+ recentUser +" subscribed status \n" + xhr.status +":"+ xhr.statusText + ((xhr.status == "429") ? "Rate Limited" : ""));
        } else {
            if(recentUser) {
                if(subbedUsers.get(recentUser)) {
                    setSubscribedStatus(true,recentUser,false);
                } else {
                    setSubscribedStatus(true,recentUser,true);
                }
            } else {
                console.log("Failed to capture value for recentUser:  "+ recentUser);
            }
        }
    }
}

function hijackAjax(postProcess) {
    if(typeof postProcess != "function") {
        postProcess = function(e){ console.log(e); };
    }
    window.addEventListener("hijack_ajax", function(event) {
        postProcess(event.detail);
    }, false);
    function injection() {
        var open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("load", function() {
                window.dispatchEvent(new CustomEvent("hijack_ajax", {detail: this}));
            }, false);

            console.log(open);

            if(arguments[1].includes("about.json")) {
                window.recentUserTampermonkeyScriptVar = arguments[1].split("/")[2];
                console.log("Set recentUser to " + window.recentUserTampermonkeyScriptVar);
            }

            open.apply(this, arguments);
        };
    }
    window.setTimeout("(" + injection.toString() + ")()", 0);
}
hijackAjax(postXhrInject);