
/*

Following code belongs to Pawoo+.
Copyright (C) 2018 Jackson Tan
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

*/

// ==UserScript==
// @id             PawooPlus
// @name           Pawoo+
// @namespace      pawoo.plus
// @version        0.1.2
// @description    Enhance your Pawoo experience with features from Google+
// @author         Jackson Tan
// @match          https://pawoo.net/*
// @include        https://pawoo.net/*
// @require        https://greasyfork.org/scripts/22406-moment-js/code/Momentjs.js?version=142481
// @run-at         document-end
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/373188/Pawoo%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/373188/Pawoo%2B.meta.js
// ==/UserScript==

'use strict';

GM_addStyle = function (css) {
    var head = document.getElementsByTagName('head')[0], style = document.createElement('style');
    if (!head) { return }
    style.type = 'text/css';
    try { style.innerHTML = css } catch (x) { style.innerText = css }
    head.appendChild(style);
}

var styles = '.detailed-comments-container {padding-top: 12px} .detailed-comments a {color: rgba(255,255,255,0.6); text-decoration: none; font-weight: bold;} .status__action-bar-button {display: flex;} .detailed-status__favorites, .detailed-status__reblogs, .detailed-status__replies {display: inline-block;font-weight: 500;font-size: 16px;margin-left: 6px;} .status .icon-button {width: 36.67147px!important;}';

function onLoad() {
    var host = 'https://pawoo.net';
    var statusApi = '/api/v1/statuses/';
    var contextApi = '/context';
    var favoriteApi = '/favourite';
    var unfavoriteApi = '/unfavourite';
    var reblogApi = '/reblog';
    var unreblogApi = '/unreblog';
    var authentication = JSON.parse(document.getElementById('initial-state').innerHTML).meta.access_token;

    var streamColClass = "item-list";
    var streamColSelector = ".item-list";
    var postTagName = 'ARTICLE';
    var dataIdAttr = 'data-id';
    var statusContentSelector = ".status__content";

    var autoLoadIntervalVal = 30000;

    moment.locale(document.documentElement.lang);

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            var nodes = Array.prototype.slice.call(mutation.addedNodes);
            nodes.forEach(function (node) {
                if (node.parentElement && node.parentElement.className === streamColClass) {
                    batchReplace(node);
                } else if (node.parentElement && node.parentElement.tagName === postTagName){
                    batchReplace(node.parentNode);
                }
            });
        });
    });
    observer.observe(document.body.querySelectorAll(streamColSelector)[0], {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
    });

    var autoLoadInterval = setInterval(function () {
        document.getElementsByClassName(streamColClass)[0].childNodes.forEach(function (item) {
            batchReplace(item);
        })
    }, autoLoadIntervalVal);

    GM_addStyle(styles);

    function batchReplace(node) {
        if (node) {
            var dataId = node.getAttribute(dataIdAttr);
            getPostStatus(dataId, function (reblogs, favorites) {
                if (reblogs !== null && node.querySelector('.fa-retweet')) {
                    if (node.querySelector('.detailed-status__reblogs__count')) {
                        var elem = node.querySelector('.detailed-status__reblogs__count');
                        removeElement(elem);
                    }
                    var element = document.createElement('div');
                    element.setAttribute('class', 'detailed-status__reblogs__count');
                    element.innerHTML = '<span class="detailed-status__reblogs"><span>' + reblogs + '</span></span>';
                    node.querySelector('.status__prepend') ? node.querySelectorAll('.fa-retweet')[1].parentNode.appendChild(element) : node.querySelector('.fa-retweet').parentNode.appendChild(element);
                }
                if (favorites !== null && node.querySelector('.fa-star')) {
                    if (node.querySelector('.detailed-status__favorites__count')) {
                        var elem2 = node.querySelector('.detailed-status__favorites__count');
                        removeElement(elem2);
                    }
                    var element2 = document.createElement('div');
                    element2.setAttribute('class', 'detailed-status__favorites__count');
                    element2.innerHTML = '<span class="detailed-status__favorites"><span>' + favorites + '</span></span>';
                    node.querySelector('.fa-star').parentNode.appendChild(element2);
                }
            }, function (replies) {
                if (replies !== null && (node.querySelector('.fa-reply') || node.querySelector('.fa-reply-all'))) {
                    if (node.querySelector('.detailed-status__replies__count')) {
                        var elem = node.querySelector('.detailed-status__replies__count');
                        removeElement(elem);
                    }
                    var element = document.createElement('div');
                    element.setAttribute('class', 'detailed-status__replies__count');
                    element.innerHTML = '<span class="detailed-status__replies"><span>' + replies + '</span></span>';
                    node.querySelector('.fa-reply') ? node.querySelector('.fa-reply').parentNode.appendChild(element) : node.querySelector('.fa-reply-all').parentNode.appendChild(element);
                }
            }, function (posts) {
                if (posts) {
                    var html = '<div class="detailed-comments">';
                    posts.forEach(function (item, index) {
                        var favoriteCountHTML = item.favourites_count > 0 ? '<div style="padding-left: 16px;"><span style="color: #db4437;font-weight: bold;">+' + item.favourites_count + '</span></div>' : '';
                        var postUrl = item.url;
                        var commentTimeHTML = '<div style="padding-left: 16px;display: flex;flex-direction: column;justify-content: center;"><span style="color: #606984;"><a href=' + postUrl + '>' + moment(item.created_at).fromNow(true) + '</a></span></div>';
                        var element = document.createElement('div');
                        element.innerHTML = item.content;
                        var contentHTML = processDeleteLine(element.childNodes[0], true);
                        var postId = item.id;
                        var favorited = item.favourited;
                        var favoriteHTML = favorited ? '<div class="detailed-comment-unfavorite-button" style="padding-left: 16px; cursor: pointer;"><span style="color: #db4437;font-weight: bold;">+1</span></div>' : '<div class="detailed-comment-favorite-button" style="padding-left: 16px; cursor: pointer;"><span style="color: rgba(255,255,255,0.6);font-weight: bold;">+1</span></div>';
                        var reblogged = item.reblogged;
                        var reblogHTML = reblogged ? '<div class="detailed-comment-unreblog-button" style="padding-left: 16px; cursor: pointer;"><span style="color: #2b90d9;font-weight: bold;">Reshared</span></div>' : '<div class="detailed-comment-reblog-button" style="padding-left: 16px; cursor: pointer;"><span style="color: rgba(255,255,255,0.6);font-weight: bold;">Reshare</span></div>';
                        html += '<div class="detailed-comment" data-id="' + postId + '"><div style="display: flex;"><div><img src="' + item.account.avatar + '" height=24 width=24 style="border-radius: 50%;"></div><div style="display: flex;flex-direction: row;justify-content: center;padding-left: 6px;"><span style="display: flex;flex-direction: column;justify-content: center;"><a href="' + item.account.url + '">' + item.account.display_name + '</a></span><span class="detailed-comment-username" style="display: flex;flex-direction: column;justify-content: center;color: #606984;padding-left: 4px;">@' + item.account.username + '</span>' + commentTimeHTML + '</div></div><div style="padding-left: 28px;display:flex;"><div>' + contentHTML + '</div>' + favoriteCountHTML + '</div><div style="display: flex; padding-top: 2px;"><span class="reply_inline_comment_button" style="cursor: pointer; padding-left: 28px; color: rgba(255,255,255,0.6);">Reply</span>' + reblogHTML + favoriteHTML + '</div><div class="reply_inline_comment_edit_content" style="display: none; padding-left: 28px; flex-direction: column;"><textarea class="reply_inline_comment_textarea" style="resize: none; background: transparent; color: #FFF;" placeholder="コメントを追加..." aria-label="コメントを追加..." role="textbox"></textarea><div style="display: flex; flex-direction: row;"><div class="reply_inline_comment_submit_button" style="padding: 8px; cursor: pointer;">Submit</div><div class="reply_inline_comment_cancel_button" style="padding: 8px; cursor: pointer;">Cancel</div></div></div></div>'
                    })
                    html += '</div>'
                    if (node.querySelector('.status')) {
                        if (node.querySelector('.detailed-comments-container')) {
                            var elem = node.querySelector('.detailed-comments-container');
                            removeElement(elem);
                        }
                        var element = document.createElement('div');
                        element.setAttribute('class', 'detailed-comments-container');
                        element.innerHTML = html;
                        element.querySelectorAll('.detailed-comment') !== null && element.querySelectorAll('.detailed-comment').forEach(function (item, index) {
                            item.querySelector('.reply_inline_comment_button') !== null && item.querySelector('.reply_inline_comment_button').addEventListener('click', function (e) {
                                var username = e.target.parentNode.parentNode.querySelector('.detailed-comment-username') !== null ? e.target.parentNode.parentNode.querySelector('.detailed-comment-username').textContent + ' ' : '';
                                if (e.target.parentNode.parentNode.querySelector('.reply_inline_comment_textarea') !== null) {
                                    e.target.parentNode.parentNode.querySelector('.reply_inline_comment_textarea').value = username;
                                }
                                clearInterval(autoLoadInterval);
                                if (e.target.parentNode.parentNode.querySelector('.reply_inline_comment_edit_content') !== null) {
                                    e.target.parentNode.parentNode.querySelector('.reply_inline_comment_edit_content').style.display = 'flex';
                                }
                            })
                            item.querySelector('.reply_inline_comment_submit_button') !== null && item.querySelector('.reply_inline_comment_submit_button').addEventListener('click', function (e) {
                                var status = e.target.parentNode.parentNode.querySelector('.reply_inline_comment_textarea').value;
                                var replyToId = e.target.parentNode.parentNode.parentNode.getAttribute('data-id');
                                if (status.trim() !== '') {
                                    replyPost(status, replyToId, batchReplace, node);
                                    if (e.target.parentNode.parentNode.querySelector('.reply_inline_comment_textarea') !== null) {
                                        e.target.parentNode.parentNode.querySelector('.reply_inline_comment_textarea').value = '';
                                    }
                                    if (e.target.parentNode.parentNode.parentNode.querySelector('.reply_inline_comment_edit_content') !== null) {
                                        e.target.parentNode.parentNode.parentNode.querySelector('.reply_inline_comment_edit_content').style.display = 'none';
                                    }
                                    setNewInterval();
                                }
                            })
                            item.querySelector('.reply_inline_comment_cancel_button') !== null && item.querySelector('.reply_inline_comment_cancel_button').addEventListener('click', function (e) {
                                if (e.target.parentNode.parentNode.querySelector('.reply_inline_comment_textarea') !== null) {
                                    e.target.parentNode.parentNode.querySelector('.reply_inline_comment_textarea').value = '';
                                }
                                if (e.target.parentNode.parentNode.parentNode.querySelector('.reply_inline_comment_edit_content') !== null) {
                                    e.target.parentNode.parentNode.parentNode.querySelector('.reply_inline_comment_edit_content').style.display = 'none';
                                }
                                setNewInterval();
                            })
                            item.querySelector('.detailed-comment-favorite-button') !== null && item.querySelector('.detailed-comment-favorite-button').addEventListener('click', function (e) {
                                var replyToId = e.target.parentNode.parentNode.parentNode.getAttribute('data-id');
                                favoritePost(replyToId, batchReplace, node);
                            })
                            item.querySelector('.detailed-comment-unfavorite-button') !== null && item.querySelector('.detailed-comment-unfavorite-button').addEventListener('click', function (e) {
                                var replyToId = e.target.parentNode.parentNode.parentNode.getAttribute('data-id');
                                unfavoritePost(replyToId, batchReplace, node);
                            })
                            item.querySelector('.detailed-comment-reblog-button') !== null && item.querySelector('.detailed-comment-reblog-button').addEventListener('click', function (e) {
                                var replyToId = e.target.parentNode.parentNode.parentNode.getAttribute('data-id');
                                reblogPost(replyToId, batchReplace, node);
                            })
                            item.querySelector('.detailed-comment-unreblog-button') !== null && item.querySelector('.detailed-comment-unreblog-button').addEventListener('click', function (e) {
                                var replyToId = e.target.parentNode.parentNode.parentNode.getAttribute('data-id');
                                unreblogPost(replyToId, batchReplace, node);
                            })
                        })
                        node.querySelector('.status').appendChild(element);
                    }
                }
            })
            processDeleteLine(node, false);
        }
    }

    function processDeleteLine(node, isComment) {
        var stack = [];
        var result = [];
        var commentHTML = '';
        var textNode = isComment ? node.childNodes : (node.querySelector(statusContentSelector) !== null ? node.querySelector(statusContentSelector).childNodes : null);
        textNode !== null && textNode.forEach(function (item, index) {
            var matches = item.textContent.match(/(-)/mgi);
            if (matches && matches.length > 1) {
                var indicies = charLocations('-', item.textContent);
                if (indicies.length > 1) {
                    var newText = item.textContent;
                    var charsToReplace = indicies.length % 2 === 0 ? indicies.length : indicies.length - 1;
                    for (var i = 0; i < charsToReplace; i++) {
                        newText = i % 2 === 0 ? newText.replace('-', '<del>') : newText.replace('-', '</del>');
                    }
                    var element = document.createElement('span');
                    element.innerHTML = newText;
                    if (isComment) {
                        commentHTML += newText;
                    } else {
                        item.parentNode.insertBefore(element, item);
                        removeElement(item);
                    }
                }
            }
            else {
                if (item.nodeType === 3 && node.textContent.match('-') !== null) {
                    if (stack.length > 0) {
                        var start = stack.pop();
                        result.push({ start, end: index });
                    } else {
                        stack.push(index)
                    }
                }
                if (item.tagName === 'BR') {
                    stack = [];
                } else if (isComment) {
                    commentHTML += item.outerHTML ? item.outerHTML : item.textContent
                }
            }
        })

        result.length > 0 && result.forEach(function (item, index) {
            var startIndex = item.start;
            var endIndex = item.end;
            for (var i = startIndex; i <= endIndex; i++) {
                var currentNode = isComment ? node.childNodes[i] : node.querySelector(statusContentSelector).childNodes[i];
                if (currentNode.nodeType === 3) {
                    var element = document.createElement('span');
                    var newText;
                    if (i === endIndex) {
                        newText = currentNode.textContent.replace('-', '</del>');
                        element.innerHTML = '<del>' + newText;
                    } else {
                        newText = currentNode.textContent.replace('-', '<del>');
                        element.innerHTML = newText + '</del>';
                    }
                    if (isComment) {
                        commentHTML += newText;
                    } else {
                        currentNode.parentNode.insertBefore(element, currentNode);
                        removeElement(currentNode);
                    }
                } else {
                    var element2 = document.createElement('span');
                    element2.innerHTML = '<del>' + currentNode.innerHTML + '</del>';
                    if (isComment) {
                        commentHTML += newText;
                    } else {
                        currentNode.parentNode.insertBefore(element2, currentNode);
                        removeElement(currentNode);
                    }
                }
            }
        })
        if (isComment) {
            return commentHTML !== '' ? commentHTML : node.innerHTML;
        }
    }

    function charLocations(substring, string) {
        var a = [], i = -1;
        while ((i = string.indexOf(substring, i + 1)) >= 0) a.push(i);
        return a;
    }

    function removeElement(element) {
        element.parentNode.removeChild(element);
    }

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function setNewInterval() {
        autoLoadInterval = setInterval(function () {
            document.getElementsByClassName(streamColClass)[0].childNodes.forEach(function (item) {
                batchReplace(item);
            })
        }, autoLoadIntervalVal);
    }

    function getPostStatus(id, statsProcessor0, statsProcessor1, postProcessor) {
        GM_xmlhttpRequest({
            method: "GET",
            url: host + statusApi + id,
            headers: { "Accept": "application/json" },
            onload: function (response) {
                var data = JSON.parse(response.responseText);
                var reblogs = data.reblogs_count ? data.reblogs_count : 0;
                var favorites = data.favourites_count ? data.favourites_count : 0;
                statsProcessor0(reblogs, favorites);
            },
        });
        GM_xmlhttpRequest({
            method: "GET",
            url: host + statusApi + id + contextApi,
            headers: { "Accept": "application/json" },
            onload: function (response) {
                var data = JSON.parse(response.responseText);
                var replies = data.descendants ? data.descendants.length : 0;
                var posts = data.descendants;
                statsProcessor1(replies);
                postProcessor(posts);
            },
        });
    }

    function replyPost(status, replyToId, cb, node) {
        var statusData = new FormData();
        statusData.append("status", status);
        statusData.append("in_reply_to_id", replyToId);
        statusData.append("media_ids", []);
        statusData.append("sensitive", false);
        statusData.append("spoiler_text", "");
        statusData.append("visibility", "public");

        GM_xmlhttpRequest({
            method: "POST",
            data: statusData,
            url: host + statusApi,
            headers: { "idempotency-key": uuidv4, "authorization": "Bearer " + authentication },
            onload: function (res) {
                cb(node);
            }
        });
    }

    function favoritePost(postId, cb, node) {
        GM_xmlhttpRequest({
            method: "POST",
            url: host + statusApi + postId + favoriteApi,
            headers: { "authorization": "Bearer " + authentication },
            onload: function (res) {
                cb(node);
            }
        });
    }

    function unfavoritePost(postId, cb, node) {
        GM_xmlhttpRequest({
            method: "POST",
            url: host + statusApi + postId + unfavoriteApi,
            headers: { "authorization": "Bearer " + authentication },
            onload: function (res) {
                cb(node);
            }
        });
    }

    function reblogPost(postId, cb, node) {
        GM_xmlhttpRequest({
            method: "POST",
            url: host + statusApi + postId + reblogApi,
            headers: { "authorization": "Bearer " + authentication },
            onload: function (res) {
                cb(node);
            }
        });
    }

    function unreblogPost(postId, cb, node) {
        GM_xmlhttpRequest({
            method: "POST",
            url: host + statusApi + postId + unreblogApi,
            headers: { "authorization": "Bearer " + authentication },
            onload: function (res) {
                cb(node);
            }
        });
    }
    window.onpopstate = history.onpushstate = function(e) {
        observer.observe(document.body.querySelectorAll(streamColSelector)[0], {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });
    }
}

window.addEventListener('load', onLoad, false);