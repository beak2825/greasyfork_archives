// ==UserScript==
// @name         PageWatcher
// @namespace    https://www.4chan.org/
// @version      1.0.0
// @description  Show the thread's page in the Thread Watcher
// @author       Wolvan
// @match        *://www.4chan.org/*
// @match        *://boards.4chan.org/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/16129/PageWatcher.user.js
// @updateURL https://update.greasyfork.org/scripts/16129/PageWatcher.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

this.$ = this.jQuery = jQuery.noConflict(true);

// Your code here...
function addCSS( code ) {
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = code;
    } else {
        style.innerHTML = code;
    }
    document.getElementsByTagName("head")[0].appendChild( style );
}

var cache = {};
function getThreadPages() {
    cache = {};
    var watched_threads = $("#thread-watcher #watched-threads div");
    var boards = {};
    watched_threads.each(function(index, thread) {
        var id = $(thread).data("full-i-d");
        var boardId = id.split(".")[0]; var threadId = id.split(".")[1];
        if (!boards[boardId]) {
            boards[boardId] = [threadId];
        } else {
            if (boards[boardId].indexOf(threadId) === -1) {
                boards[boardId].push(threadId);
            }
        }
    });
    $.each(boards, function(boardId, value) {
        $.getJSON("//a.4cdn.org/" + boardId + "/catalog.json", "", function (data) {
            value.forEach(function (threadId) {
                var threadCode = boardId + "." + threadId;
                var foundThreadId = false;
                data.forEach(function (pageObj) {
                    if (foundThreadId) { return; }
                    var page = pageObj.page;
                    pageObj.threads.forEach(function (thread) {
                        if (thread.no === parseInt(threadId)) {
                            cache[threadCode] = page;
                            var pageTxt = page;
                            if (page < 10) {
                                pageTxt = "0" + page;
                            }
                            var watcher_link = watched_threads.filter('[data-full-i-d="' + threadCode + '"]').find(".watcher-link");
                            if (watcher_link.find(".watcher-page").length) {
                                watcher_link.find(".watcher-page").text("[" + pageTxt + "]");
                            } else {
                                watcher_link.prepend("<span class='watcher-page'>[" + pageTxt + "]</span>");
                            }
                            if (page === 10) {
                                watcher_link.find(".watcher-page").addClass("page10");
                            } else {
                                watcher_link.find(".watcher-page").removeClass("page10");
                            }
                            foundThreadId = true;
                        }
                    });
                });
            });
        });
    });
}
function setFromCache() {
    mutObs_keepPages.disconnect();
    $.each(cache, function(threadCode, page) {
        var watched_threads = $("#thread-watcher #watched-threads div");
        var pageTxt = page;
        if (page < 10) {
            pageTxt = "0" + page;
        }
        var watcher_link = watched_threads.filter('[data-full-i-d="' + threadCode + '"]').find(".watcher-link");
        if (watcher_link.find(".watcher-page").length) {
            watcher_link.find(".watcher-page").text("[" + pageTxt + "]");
        } else {
            watcher_link.prepend("<span class='watcher-page'>[" + pageTxt + "]</span>");
        }
        if (page === 10) {
            watcher_link.find(".watcher-page").addClass("page10");
        } else {
            watcher_link.find(".watcher-page").removeClass("page10");
        }
    });
    mutObs_keepPages.observe($("#watched-threads")[0], {
        childList: true,
        subtree: true,
        characterData: true
    });
}

var mutObs_keepPages = new MutationObserver(function (mutations) {
    setFromCache();
});

var mutObs_refresh = new MutationObserver(function (mutations) {
    var mutationHandled = false;
    mutations.forEach(function (mutation) {
        if (mutationHandled) { return; }
        getThreadPages();
        mutationHandled = true;
    });
});
var mutObs_threadwatcherWait = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if(!mutation.addedNodes || mutation.addedNodes.length < 1) { return; }
        $.each(mutation.addedNodes, function(index, node) {
            if(node.id === "thread-watcher") {
                getThreadPages();
                mutObs_refresh.observe($(node).find(".refresh.fa.fa-refresh")[0], {
                    attributes: true
                });
                mutObs_keepPages.observe($("#watched-threads")[0], {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
                mutObs_threadwatcherWait.disconnect();
            } else {
                return;
            }
        });
    });
});

$(document).ready(function() {
    addCSS(".watcher-page { margin-right: 2px; }");
    addCSS(".watcher-page.page10 { color: red; }");
    if ($("#thread-watcher").length) {
        getThreadPages();
        mutObs_refresh.observe($("#thread-watcher").find(".refresh.fa.fa-refresh")[0], {
            attributes: true
        });
        mutObs_keepPages.observe($("#watched-threads")[0], {
            childList: true,
            subtree: true,
            characterData: true
        });
    } else {
        mutObs_threadwatcherWait.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});