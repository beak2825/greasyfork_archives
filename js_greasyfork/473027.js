// ==UserScript==
// @name         GGn Forums Game Checker New
// @namespace    https://greasyfork.org/
// @version      0.31
// @license      MIT
// @description  Adds a link to check if you can post in a forum game thread
// @author       drlivog
// @match        https://gazellegames.net/forums.php?*action=viewforum*&forumid=55*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/473027/GGn%20Forums%20Game%20Checker%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/473027/GGn%20Forums%20Game%20Checker%20New.meta.js
// ==/UserScript==

/* globals $ */

const keepCache = true;
const cacheAliveTime = 60; //in minutes
const scrollToQuickBox = true;
let API_KEY = "";

const rate_limiter_requests = 5; //number of requests
const rate_limiter_timespan = 10000; //timespan of requests in ms

let queue=Array();
let cache;
let timeout=null;
let running=false;
let requestCount=0;

$(document).ready(function() {
    'use strict';
    $('div.linkbox:first').prepend('[<a id="checkgames" href="#0">Check Games</a>]&nbsp;');
    GM_registerMenuCommand("Clear Cache", function() { GM_deleteValue("GGn_GamesForumCheckerCache"); });
    GM_registerMenuCommand("Clear API Key", function() { GM_deleteValue("GGn_GamesForumCheckerAPIKey"); });
    cache = GM_getValue("GGn_GamesForumCheckerCache", {});
    for(let key in cache) {
        if (cache[key][1]+cacheAliveTime*60*1000 > Date.now()) {
            $('<span title="Click to re-check">⬤ </span>').insertBefore('a[href$="'+key+'"]:first').prop("id","check"+key).css("color", cache[key][0]).data("updated", cache[key][1]).click(function() {
                    processThread(key);});
        }
    }
    let replies = $('.forum_index tr:not(.colhead) td:nth-child(3)'); //skip column header
    for (let i=0; i<replies.length; i++) {
        let reply = $(replies[i]);
        if (reply.parent().children('td').first().prop('title').includes('Sticky')) { continue; } //Skip Sticky Posts
        let lastPage = reply.parent().find('td span.last_topic a').last().prop('href').replace(/page\=(\d+)/,"page=99999");
        reply.html(`<a href='${lastPage+"#quickpost"}'><button style="min-width: 60px;" title="Go to Last Page">${reply.text()}</button></a>`);
    }
    $('body').on("click","#checkgames", function(event) {checkGames(event);});
});

function checkGames(event) {
    checkAPI();
    queue.length = 0;
    if (timeout) {
        clearTimeout(timeout);
    }
    $('#content table.forum_index tr.participated span.last_topic strong a').each(function(i) {
        const threadid = this.href.match(/threadid=([0-9]+)/)[1];
        queue.push(threadid);
    });
    if (queue.length > 0) {
        $('body').on('click', "#checkgames", function(event) {event.preventDefault();});
        $('#checkgames').text(`Checking...[${queue.length}]`);
        queue.reverse(); //reverse queue so we can use pop off the end
        console.log(`Checking ${queue.length} threads in queue`);
        processQueue();
    }
    event.preventDefault();
}

function processQueue() {
    timeout=null;
    while (requestCount < rate_limiter_requests) {
        const work = queue.pop();
        if ($("#check"+work).length) {
            if ($("#check"+work).data("updated")+cacheAliveTime*60*1000 > Date.now()) {
                continue;
            }
        }
        processThread(work);
        requestCount++;
        $('#checkgames').text(`Checking...[${queue.length}]`);
        if (queue.length === 0) {
            break;
        }
    }
    if (queue.length>1) {
        timeout = setTimeout(processQueue, rate_limiter_timespan);
        requestCount=0;
    } else {
        $('#checkgames').prop("href","#0").text("Check Games");
        $('body').on("click","#checkgames", function(event) {checkGames(event);});
        console.log("Completing checking games");
    }
}

function processThread(id) {
    checkAPI();
    ajax(`https://gazellegames.net/api.php?request=forums&type=thread_info&key=${API_KEY}&id=${id}`, null, function(r) {
        r = JSON.parse(r.responseText);
        if (r.status === 'success' && r.response.canPost) {
            if ($("#check"+id).length) {
                $("#check"+id).css("color", "green").data("updated", Date.now());
                cache[id] = ["green", Date.now()];
            } else {
                $('<span>⬤ </span>').insertBefore('a[href$="'+id+'"]:first').css("color", "green").prop("id","check"+id).data("updated",Date.now()).click(function() {
                    processThread(id);});
                cache[id] = ["green", Date.now()];
            }
        } else {
            if ($("#check"+id).length) {
                $("#check"+id).css("color", "red").data("updated", Date.now());
                cache[id] = ["red", Date.now()];
            } else {
                $('<span>⬤ </span>').insertBefore('a[href$="'+id+'"]:first').css("color", "red").prop("id","check"+id).data("updated",Date.now()).click(function() {
                    processThread(id);});
                cache[id] = ["red", Date.now()];
            }
        }
        GM_setValue("GGn_GamesForumCheckerCache", cache);
    });
}

function checkAPI() {
    if (API_KEY === "") {
        if (!(API_KEY = GM_getValue("GGn_GamesForumCheckerAPIKey"))) {
            const API_KEY = window.prompt(`Please input your GGn API key.
If you don't have one, please generate one from your Edit Profile page: https://gazellegames.net/user.php?action=edit.
The API key must have "Forums" permission

Please disable this userscript until you have one as this prompt will continue to show until you enter one in.`).trim();
            if (/[a-f0-9]{64}/.test(API_KEY)) {
                console.log('API key is valid length, storing');
                GM_setValue("GGn_GamesForumCheckerAPIKey", API_KEY);
            } else {
                console.log('API key entered is not valid. It must be 64 hex characters 0-9a-f.');
                throw 'No API key found.';
            }
        }
    }
}

function ajax(url, data=null, returnCall=null) {
    let xhr = new XMLHttpRequest();
    xhr.open(data==null? 'GET':'POST', url);
    if (returnCall != null) {
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                returnCall(xhr);
            }
        };
    }
    if (data==null) {
        xhr.send();
    } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }
    return xhr;
}