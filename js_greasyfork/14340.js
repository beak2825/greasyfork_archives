// ==UserScript==
// @name        XamVL Love
// @namespace   https://greasyfork.org/en/users/21499-tungtien
// @description Subscribed threads Monitor, quote notifications, extend all emoticons to quick reply form, quick quote(s), remove redirect, detect links, quick capture post, quick ignore link, banh bim, custom resize image
// @author      theheroofvn, tungtien
// @include     http://xamvl.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/knockout.mapping/2.4.1/knockout.mapping.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/intercom.js/0.1.4/intercom.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/taffydb/2.7.2/taffy-min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery_lazyload/1.9.5/jquery.lazyload.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery.selection/1.0.1/jquery.selection.min.js
// @require     http://cdn.jsdelivr.net/jquery.inview/0.2/jquery.inview.min.js
// @resource    settings_bar http://i.imgur.com/7IyqBeF.png
// @run-at      document-start
// @grant       GM_addStyle
// @grant       GM_getResourceURL
// @grant       unsafeWindow
// @version     1.0.0.2
// @icon        http://xamvl.com/favicon.ico
// @credit      http://xamvl.com/showthread.php?t=2846050
// @downloadURL https://update.greasyfork.org/scripts/14340/XamVL%20Love.user.js
// @updateURL https://update.greasyfork.org/scripts/14340/XamVL%20Love.meta.js
// ==/UserScript==
if (frameElement) return;
this.$ = this.jQuery = jQuery.noConflict(true);
/*
Library
 */
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != "undefined" ? args[number] : match;
        });
    };
}
function isInArray(value, array) {
    return array.indexOf(value) > -1;
}
var intervals = {}, count = {};
var removeListener = function(selector) {
    if (intervals[selector]) {
        window.clearInterval(intervals[selector]);
        intervals[selector] = null;
    }
};
var found = "waitUntilExists.found";
$.fn.waitUntilExists = function(handler, shouldRunHandlerOnce, isChild) {
    var selector = this.selector;
    var $this = $(selector);
    var $elements = $this.not(function() {
        return $(this).data(found);
    });
    //console.log("waitUntilExists: " + selector);
    count[selector] = typeof count[selector] !== 'undefined' ? count[selector] : 1;
    if (handler === "remove") removeListener(selector);
    else {
        if (shouldRunHandlerOnce && $this.length || count[selector] == 10) {
            removeListener(selector);
            $elements.each(handler).data(found, true);
        } else if (!isChild) {
            $elements.each(handler).data(found, true);
            intervals[selector] = window.setInterval(function() {
                $this.waitUntilExists(handler, shouldRunHandlerOnce, true);
            }, 500);
        }
    }
    count[selector]++;
    return $this;
};
ko.templateSources.stringTemplate = function(template, templates) {
    this.templateName = template;
    this.templates = templates;
};
ko.utils.extend(ko.templateSources.stringTemplate.prototype, {
    data: function(key, value) {
        this.templates._data = this.templates._data || {};
        this.templates._data[this.templateName] = this.templates._data[this.templateName] || {};
        if (arguments.length === 1) {
            return this.templates._data[this.templateName][key];
        }
        this.templates._data[this.templateName][key] = value;
    },
    text: function(value) {
        if (arguments.length === 0) {
            return this.templates[this.templateName];
        }
        this.templates[this.templateName] = value;
    }
});
ko.bindingHandlers.stopBinding = {
    init: function() {
        return { controlsDescendantBindings: true };
    }
};
function createStringTemplateEngine(templateEngine, templates) {
    templateEngine.makeTemplateSource = function(template) {
        return new ko.templateSources.stringTemplate(template, templates);
    };
    return templateEngine;
}
function localStorage_bg() {
    this.get = function(item) {
        return localStorage.getItem(item);
    };
    this.set = function(item, value) {
        return localStorage.setItem(item, value);
    };
    this.getNDefault = function(item, defaultValue) {
        var value = localStorage.getItem(item);
        if(!value){
            localStorage.setItem(item, defaultValue);
            return localStorage.getItem(item);
        }
        return value;
    };
}
/*
Utils
 */
function removeImageAjax(html) {
    html = html.replace(/<img\b[^>]*>/ig, '');
    return html;
}
$.fn.clicktoggle = function(a, b) {
    return this.each(function() {
        var clicked = false;
        $(this).click(function() {
            if (clicked) {
                clicked = false;
                return b.apply(this, arguments);
            }
            clicked = true;
            return a.apply(this, arguments);
        });
    });
};
function postHelper($html) {
    return {
        getThreadId:function(){
            var thread_id, t_id1;
            t_id1 = location.href.match(/t=(\d+)/);
            if (t_id1 !== null && t_id1.length > 0) thread_id = t_id1[1];
            else {
                try {
                    thread_id = unsafeWindow.threadid.toString();
                } catch (e) {
                    /*var t_id2 = $("a:contains('Previous Thread')");
                    if (t_id2.length > 0) thread_id = t_id2.attr("href").match(/t=(\d+)/)[1];
                    else {
                        var t_id3 = $(".pagenav a.smallfont:first-child");
                        if (t_id3.length > 0) thread_id = t_id3.attr("href").match(/t=(\d+)/)[1];
                        else thread_id = -1;
                    }*/
                }
            }
            return thread_id;
        },
        getPage: function () {
            var page, $pageNav;
            $pageNav = $html.find(".pagenav");
            if ($pageNav.length === 0) {
                page = 1;
            } else {
                page = $pageNav.eq(0).find("tbody td.alt2 strong").text();
            }
            return page;
        },
        getLatestPost: function () {
            var id, lastpost, post;
            lastpost = $html.find("table[id^='post']:last");
            id = lastpost.attr("id").match(/(\d+)/)[1];
            post = $html.find("table[id^='post']").length -1;
            return {
                post: post,
                id: id
            };
        },
        getPostId: function (num) {
            var id, post;
            post = $html.find("table[id^='post']").eq(num);
            id = post.attr("id").match(/(\d+)/)[1];
            return id;
        }
    };
}
function checkLogin() {
    var isLogged = false, hasRun = false;
    function run() {
        if (hasRun) return;
        if (!_.isUndefined($.cookie('isLogin'))) isLogged = true;
        else {
            $("strong:contains('Welcome')").waitUntilExists(function() {
                var username = $(this).eq(0).text();
                if (username === "") {
                    isLogged = false;
                    console.log("Thím chưa đăng nhập.");
                    $(".tborder:has(input[name='vb_login_username'])").before("<div id='nologin-message'>Chức năng Subscribed threads Monitor hoặc Quote Notifications không hoạt động được do thím chưa đăng nhập.</div>");
                } else {
                    isLogged = true;
                    $.cookie('isLogin', 'yes');
                }
            }, true);
        }
        hasRun = true;
    }
    return {
        run: run,
        isLogged: function() {
            run();
            return isLogged;
        }
    };
}
function uuid() {
    var _global = this;
    var _rng;
    if (typeof _global.require == "function") {
        try {
            var _rb = _global.require("crypto").randomBytes;
            _rng = _rb && function() {
                return _rb(16);
            };
        } catch (e) {}
    }
    if (!_rng && _global.crypto && crypto.getRandomValues) {
        var _rnds8 = new Uint8Array(16);
        _rng = function whatwgRNG() {
            crypto.getRandomValues(_rnds8);
            return _rnds8;
        };
    }
    if (!_rng) {
        var _rnds = new Array(16);
        _rng = function() {
            for (var i = 0, r; i < 16; i++) {
                if ((i & 3) === 0) r = Math.random() * 4294967296;
                _rnds[i] = r >>> ((i & 3) << 3) & 255;
            }
            return _rnds;
        };
    }
    var BufferClass = typeof _global.Buffer == "function" ? _global.Buffer : Array;
    var _byteToHex = [];
    var _hexToByte = {};
    for (var i = 0; i < 256; i++) {
        _byteToHex[i] = (i + 256).toString(16).substr(1);
        _hexToByte[_byteToHex[i]] = i;
    }
    function parse(s, buf, offset) {
        var i = buf && offset || 0, ii = 0;
        buf = buf || [];
        s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
            if (ii < 16) {
                buf[i + ii++] = _hexToByte[oct];
            }
        });
        while (ii < 16) {
            buf[i + ii++] = 0;
        }
        return buf;
    }
    function unparse(buf, offset) {
        var i = offset || 0, bth = _byteToHex;
        return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]];
    }
    var _seedBytes = _rng();
    var _nodeId = [ _seedBytes[0] | 1, _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5] ];
    var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 16383;
    var _lastMSecs = 0, _lastNSecs = 0;
    function v1(options, buf, offset) {
        var i = buf && offset || 0;
        var b = buf || [];
        options = options || {};
        var clockseq = options.clockseq !== null ? options.clockseq : _clockseq;
        var msecs = options.msecs !== null ? options.msecs : new Date().getTime();
        var nsecs = options.nsecs !== null ? options.nsecs : _lastNSecs + 1;
        var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
        if (dt < 0 && options.clockseq === null) {
            clockseq = clockseq + 1 & 16383;
        }
        if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === null) {
            nsecs = 0;
        }
        if (nsecs >= 1e4) {
            throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
        }
        _lastMSecs = msecs;
        _lastNSecs = nsecs;
        _clockseq = clockseq;
        msecs += 122192928e5;
        var tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
        b[i++] = tl >>> 24 & 255;
        b[i++] = tl >>> 16 & 255;
        b[i++] = tl >>> 8 & 255;
        b[i++] = tl & 255;
        var tmh = msecs / 4294967296 * 1e4 & 268435455;
        b[i++] = tmh >>> 8 & 255;
        b[i++] = tmh & 255;
        b[i++] = tmh >>> 24 & 15 | 16;
        b[i++] = tmh >>> 16 & 255;
        b[i++] = clockseq >>> 8 | 128;
        b[i++] = clockseq & 255;
        var node = options.node || _nodeId;
        for (var n = 0; n < 6; n++) {
            b[i + n] = node[n];
        }
        return buf ? buf : unparse(b);
    }
    function v4(options, buf, offset) {
        var i = buf && offset || 0;
        if (typeof options == "string") {
            buf = options == "binary" ? new BufferClass(16) : null;
            options = null;
        }
        options = options || {};
        var rnds = options.random || (options.rng || _rng)();
        rnds[6] = rnds[6] & 15 | 64;
        rnds[8] = rnds[8] & 63 | 128;
        if (buf) {
            for (var ii = 0; ii < 16; ii++) {
                buf[i + ii] = rnds[ii];
            }
        }
        return buf || unparse(rnds);
    }
    var _uuid = v4;
    _uuid.v1 = v1;
    _uuid.v4 = v4;
    _uuid.parse = parse;
    _uuid.unparse = unparse;
    _uuid.BufferClass = BufferClass;
    return _uuid;
}
function JobStack() {
    var _JobStack = {
        Job: function(opts) {
            var that = this;
            that._stack = null;
            if (typeof opts.async != "undefined") that.stack = opts.stack;
            this.guid = uuid().v4();
            that.isQueued = true;
            that.isDoing = false;
            that.isDone = false;
            that.endTime = -1;
            that.async = false;
            if (typeof opts.async == "boolean") that.async = opts.async;
            that.runnow = false;
            if (typeof opts.runnow == "boolean") that.async = opts.runnow;
            that.onDone = function() {};
            if (typeof opts.onDone != "undefined") that.onDone = opts.onDone;
            that.onStart = function() {};
            if (typeof opts.onStart != "undefined") that.onStart = opts.onStart;
            that._run = opts.run;
            that.run = function() {
                if (that._stack === null) {
                    console.log("This job is not belong to any stack!");
                    return false;
                }
                if (that.isDone === true) {
                    that.done();
                }
                that.isDoing = true;
                that.startTime = new Date();
                that._run.call(that);
                if (that.async === false) {
                    that.done();
                }
            };
            that.done = function() {
                that.isDone = true;
                that.endTime = new Date();
                that.isDoing = false;
                that._stack.oneJobDone(that);
            };
            if (that.runnow) that.run();
        },
        Stack: function(opts) {
            var that = this;
            that.jobs = [];
            that.maxJobDoing = 2;
            if (typeof opts.maxJobDoing != "undefined") that.maxJobDoing = opts.maxJobDoing;
            that.callback = function() {};
            if (typeof opts.callback != "undefined") that.callback = opts.callback;
            that.add = function(job) {
                job._stack = that;
                that.jobs.push(job);
            };
            that.addJob = function(opts) {
                var job = new jobstack.Job(opts);
                that.add(job);

            };
            that.addAsyncJob = function(opts) {
                if (typeof opts == "function") {
                    var newOpts = {
                        async: true,
                        run: opts
                    };
                    that.addJob(newOpts);
                } else {
                    opts.async = true;
                    that.addJob(opts);
                }
            };
            that.getAvailableJobs = function() {
                var jobs = [];
                for (var i = 0; i < that.jobs.length; i++) {
                    var j = that.jobs[i];
                    if (j.isDone === false && j.isDoing === false && j.isQueued === true) {
                        jobs.push(j);
                    }
                }
                return jobs;
            };
            that.getNextAvailableJob = function() {
                var jobs = that.getAvailableJobs();
                if (jobs.length === 0) return false;
                return jobs[0];
            };
            that.getDoingJobs = function() {
                var jobs = [];
                for (var i = 0; i < that.jobs.length; i++) {
                    var j = that.jobs[i];
                    if (j.isDone === false && j.isDoing === true && j.isQueued === true) {
                        jobs.push(j);
                    }
                }
                return jobs;
            };
            that.getDoneJobs = function() {
                var jobs = [];
                for (var i = 0; i < that.jobs.length; i++) {
                    var j = that.jobs[i];
                    if (j.isDone === true && j.isDoing === false && j.isQueued === true) {
                        jobs.push(j);
                    }
                }
                return jobs;
            };
            that.run = function() {
                for (var i = 0; i < that.maxJobDoing; i++) {
                    var j = that.getNextAvailableJob();
                    if (j !== false) j.run();
                }
            };
            that.oneJobDone = function(job) {
                var newJob = that.getNextAvailableJob();
                if (newJob !== false) {
                    if (that.getDoingJobs().length < that.maxJobDoing) {
                        newJob.run();
                    } else {}
                } else {
                    that.checkDone();
                }
            };
            that.checkDone = function() {
                if (that.getAvailableJobs().length === 0 && that.getDoingJobs().length === 0) {
                    that.allJobDone();
                    return true;
                }
                return false;
            };
            that.allJobDone = function() {
                that.callback.call();
            };
        }
    };
    return _JobStack;
}
/*
Function
 */
function FollowThread_bg() {
    var timeoutId = null, timeout = 6e4, storageHelper = null, db = null, link = {subscribedThreads: "http://xamvl.com/subscription.php?do=viewsubscription"};
    window.getDB = function() {
        return db;
    };
    function init() {
        var ls = storageHelper.get("taffy_followThreads_data");
        if (ls === null) {
            storageHelper.set("taffy_followThreads_data", "[]");
        }
        db = TAFFY();
        db.store("followThreads_data");
    }
    function getSubscribedThreads(callback) {
        function process(html) {
            var $html, form, result = [], subRows, newResult = [], oldResult = [], needAdds;
            $html = $(html);
            form = $html.find("form[action*='subscription.php?do=dostuff']");
            if (form.length === 0) {
                if ($html.find("*:contains('You are not logged in or you do not have permission to access this page')").length > 0) {}
                return false;
            }
            subRows = form.find("table tr:not(:has(td.thead,td.tfoot,td.tcat,td[align='center']))");
            if (subRows.length > 20) return [];
            if (subRows.length > 0) {
                subRows.each(function() {
                    var $this = $(this);
                    var thread = {};
                    thread.id = function getThreadId(t) {
                        var a = t.find("a[href*='showthread.php?t=']").eq(0).attr("href").match(/\?t=(\d+)/)[1];
                        return a;
                    }($this);
                    thread.title = function(t) {
                        return t.find("a[id^='thread_title']").text();
                    }($this);
                    thread.lastPage = function(t) {
                        var nextTitle = t.find("a[id^='thread_title']").next();
                        if (nextTitle.length > 0) {
                            var lastPageLink = nextTitle.find("a:last");
                            return lastPageLink.attr("href").match(/page=(\d+)/)[1];
                        } else {
                            return 1;
                        }
                    }($this);
                    result.push(thread);
                });
            }
            db().each(function(record) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].id == record.id) {
                        oldResult.push(result[i]);
                        db(record).update(result[i]);
                        break;
                    }
                }
                if (i == result.length) {
                    db(record).remove();
                }
            });
            needAdds = _.difference(result, oldResult);
            db.insert(needAdds);
            return newResult;
        }
        $.ajax({
            url: link.subscribedThreads + "&t=" + new Date().getTime(),
            success: function(html) {
                html = removeImageAjax(html);
                var data = process(html);
                callback.call(this, data);
            },
            error: function() {
                console.error("request getSubscribedThreads failed");
                recall();
            }
        });
    }
    function recall() {
        timeoutId = setTimeout(_run, timeout);
    }
    function update_latestPost(_thread, _latestPost) {
        db(_thread).update({
            latestPost: _latestPost
        });
        intercom.emit('followedThreadUpdated', {message: 'update_latestPost'});
    }
    function _run() {
        var stack = new jobstack.Stack({
            maxJobDoing: 1,
            callback: recall
        });
        var callback = function() {
            db().each(function(record) {
                if (typeof record.lastViewPos == "undefined") {
                    initJob(record);
                }
                updateJob(record);
            });
            stack.run();
            //console.info("getSubscribedThreads successfully");
        };
        function initJob(thread) {
            stack.addAsyncJob(function() {
                var job = this;
                $.ajax({
                    url: "http://xamvl.com/showthread.php?t={0}&goto=newpost".format(thread.id),
                    success: function(html) {
                        html = removeImageAjax(html);
                        var $html = $(html);
                        var posthelp = postHelper($html);
                        var lastViewPos = {
                            page: posthelp.getPage(),
                            post: posthelp.getLatestPost().post,
                            id: posthelp.getLatestPost().id
                        };
                        db(thread).update({
                            lastViewPos: lastViewPos
                        });
                        job.done();
                    },
                    error: function() {
                        console.error("Error while init job");
                        job.done();
                    }
                });
            });
        }
        function updateJob(thread) {
            stack.addAsyncJob(function() {
                var job = this;
                $.ajax({
                    url: "http://xamvl.com/showthread.php?t={0}&page={1}".format(thread.id, thread.lastPage),
                    success: function(html) {
                        html = removeImageAjax(html);
                        var $html = $(html);
                        var hasChanged = false;
                        var posthelp = postHelper($html);
                        var latestPost = {
                            page: posthelp.getPage(),
                            post: posthelp.getLatestPost().post,
                            id: posthelp.getLatestPost().id
                        };
                        if (thread.latestPost) {
                            if (_.isEqual(latestPost, thread.latestPost) === false) {
                                console.log("Latest post changed of topic", thread.title);
                                hasChanged = true;
                            }
                        } else {
                            console.log("Init latest post ", latestPost, " of topic ", thread.title);
                            hasChanged = true;
                        }
                        if (hasChanged) intercom.emit('update_latestPost', {thread: thread, latestPost: latestPost});
                        job.done();
                    },
                    error: function() {
                        console.error("Error while update job");
                        job.done();
                    }
                });
            });
        }
        if (tab_index === 0) getSubscribedThreads(callback);
        intercom.on("bg_unload", function(data) {
            if (data.message >= 0 && data.message < tab_index) {
                tab_index--;
                console.info("TabIndexChange: " + tab_index);
                if (tab_index === 0) getSubscribedThreads(callback);
            }
        });
        intercom.on("updateReadPost", function(data) {
            updateReadPost(data.thread_id, data.post_num, data.post_id, data.page);
        });
        intercom.on("update_latestPost", function(data) {
            update_latestPost(data.thread, data.latestPost);
        });
    }
    function getSubscribedData() {
        return {
            threads: JSON.parse(db().order("title").stringify())
        };
    }
    function updateReadPost(thread_id, post_num, post_id, page) {
        db({
            id: thread_id
        }).update({
            lastViewPos: {
                id: post_id,
                post: post_num,
                page: page
            }
        });
        intercom.emit('followedThreadUpdated', {message: 'updateReadPost'});
    }
    var run = function(xlocalStorage) {
        storageHelper = xlocalStorage;
        init();
        _run();
    };
    return {
        run: run,
        getSubscribedData: getSubscribedData
    };
}
function QuoteNoti_bg() {
    var timeoutId = null, timeout = 6e4, url = "http://xamvl.com/search.php", localStorage = null, formData;
    formData = {
        "do": "process",
        quicksearch: 1,
        childforums: 1,
        exactname: 1,
        securitytoken: null,
        query: null,
        showposts: 1
    };
    function setUnT(username, token, u_id) {
        localStorage.set("username", username);
        localStorage.set("securitytoken", token);
        localStorage.set("u_id", u_id);
    }
    function getQuotes() {
        var quotes = localStorage.get("noti5_quotes");
        if (quotes === null) quotes = "[]";
        quotes = JSON.parse(quotes);
        var data = {
            quotes: quotes,
            length: quotes.length
        };
        return data;
    }
    function updateQuotes(quotes) {
        var stQuotes = JSON.parse(localStorage.get("noti5_quotes"));
        for (var i = 0; i < quotes.length; i++) {
            for (var j = 0; j < stQuotes.length; j++) {
                if (stQuotes[j].post.id == quotes[i].post.id) {
                    stQuotes[j] = $.extend(true, {}, stQuotes[j], quotes[i]);
                    break;
                }
            }
        }
        
        if (stQuotes === null) stQuotes = [];
        
        localStorage.set("noti5_quotes", JSON.stringify(stQuotes));
        return stQuotes.length;
    }
    function checksave(data) {
        var hasChanged = false;
        var oldQuotes = JSON.parse(localStorage.get("noti5_quotes"));
        if (oldQuotes !== null) {
            for (var i = 0; i < data.length; i++) {
                var quote = data[i];
                for (var j = 0; j < oldQuotes.length; j++) {
                    var oldQuote = oldQuotes[j];
                    if (quote.post.id == oldQuote.post.id) {
                        data[i] = $.extend({}, oldQuote);
                        break;
                    }
                }
                if (j == oldQuotes.length) hasChanged = true;
            }
        } else hasChanged = true;
        if (hasChanged) {
            console.log("Quotes have changed");
            localStorage.set("noti5_quotes", JSON.stringify(data));
            intercom.emit("updateQuotes", {getQuotes: getQuotes()});
        }
    }
    /*function longestWord(string) {
        var string_array = null;
        if (string.indexOf(" ") !== -1) string_array = string.split(" ");
        else if (string.indexOf(".") !== -1) string_array = string.split(".");
        else return string;
        return string_array.reduce(function(x, y) {
            return x.length > y.length ? x : y;
        });
    }*/
    function process(html, username0) {
        if (localStorage.get("noti5_quotes") == "false") {
            localStorage.set("noti5_quotes", "[]");
        }
        var $html, $threads_link, data;
        $html = $(html);
        data = [];
        $threads_link = $html.find("td > div > a[href^='showthread']");
        if ($threads_link.length === 0) {
            return data;
        }
        $threads_link.each(function() {
            var $pexcerpt, $post_link, $this, $user_a, datemod, dateoffset, datestr, datetime, now, pDateTime, pPost, pUser, pWhere, pexcerpt, pid, ptitle, sDatetime, sDatetime_es, tid, ttitle, uid, username;
            try {
                $this = $(this);
                $user_a = $this.parents("td:eq(0)").find(" > div > a[href^='member'] ");
                username = $user_a.text();
                if (username_special && username == username0) return true;
                tid = $this.attr("href").match(/t=(\d+)/)[1];
                ttitle = $this.text();
                $post_link = $this.parents("td:eq(0)").find(" > div > div  a[href^='showthread'][href*='p=']");
                pid = $post_link.attr("href").match(/p=(\d+)/)[1];
                ptitle = $post_link.text();

                $pexcerpt = $post_link.parent();
                $post_link.remove();
                pexcerpt = $pexcerpt.text().trim();
                if (!username_special) {
                    if (ptitle.indexOf(username0) !== -1 || ptitle.indexOf(username0.toLowerCase()) !== -1) return true;
                    if (pexcerpt.indexOf(username0) !== -1 || pexcerpt.indexOf(username0.toLowerCase()) !== -1) return true;
                }
                uid = $user_a.attr("href").match(/u=(\d+)/)[1];
                sDatetime = $this.parents("tbody:eq(0)").find(" > tr:eq(0) td").contents().last().text().trim();
                sDatetime_es = sDatetime.split(/[-,:]/);
                if (sDatetime_es.length === 3) {
                    datestr = [ "today", "yesterday" ];
                    dateoffset = datestr.indexOf(sDatetime_es[0].toLowerCase());
                    if (dateoffset > -1) {
                        now = new Date();
                        datemod = now.getDate() - dateoffset;
                        datetime = new Date(parseInt(now.getFullYear()), now.getMonth(), datemod, parseInt(sDatetime_es[1]), parseInt(sDatetime_es[2]), 0);
                    }
                } else {
                    datetime = new Date(parseInt(sDatetime_es[2]), parseInt(sDatetime_es[1] - 1), parseInt(sDatetime_es[0]), parseInt(sDatetime_es[3]), parseInt(sDatetime_es[4]), 0);
                }
                data.push({
                    author: {
                        username: username,
                        userid: uid
                    },
                    thread: {
                        title: ttitle,
                        id: tid
                    },
                    post: {
                        title: ptitle,
                        id: pid,
                        content: pexcerpt,
                        datetime: datetime
                    },
                    hasRead: false,
                    hasSeen: false
                });
            } catch (e) {
            }
        });
        return data;
    }
    function recall() {
        timeoutId = setTimeout(_run, timeout);
    }
    function _run() {
        var username = localStorage.get("username"),
            u_id = localStorage.get("u_id"),
            token = localStorage.get("securitytoken");
        if (username !== null && token !== null) {
            var cpFD = $.extend({}, formData);
            cpFD.securitytoken = token;
            if (!username_special)
                cpFD.query = username;
            else
                cpFD.query = u_id;
            $.ajax({
                url: url,
                type: "POST",
                data: cpFD,
                success: function(html) {
                    /*var data;
                    if (!username_special) {
                        var longest_word = longestWord(username);
                        data = process(html, longest_word);
                    } else {
                        data = process(html, username);
                    }*/
                    var data = process(html, username);
                    checksave(data);
                    recall();
                    console.info("getQuotes successfully");
                },
                error: function() {
                    console.error("request quotes failed");
                    recall();
                }
            });
        } else {
            recall();
        }
    }
    var run = function(xlocalStorage) {
        localStorage = xlocalStorage;
        if (tab_index2 === 0) _run();
        intercom.on("bg_unload", function(data) {
            if (data.message >= 0 && data.message < tab_index2) {
                tab_index2--;
                if (!st) {
                    tab_index--;
                    console.info("TabIndexChange: " + tab_index2);
                }
                if (tab_index2 === 0) _run();
            }
        });
    };
    return {
        run: run,
        getQuotes: getQuotes,
        updateQuotes: updateQuotes,
        setUsernameAndSToken: setUnT
    };
}
function BanhBim() {
    GM_addStyle('.page{width:100%!important;max-width:none}.plk_smilebox.quick{height:130px!important}');
}
function HideSettings() {
    GM_addStyle('#plk_contentbar:not(:hover){opacity:0}');
}
var myLocalStorage, get_settings, settings_list, maxwidthSaved, window_width, rainbowSaved;
myLocalStorage = new localStorage_bg();
get_settings = myLocalStorage.get("settings");
if (!get_settings) {
    settings_list = [];
    myLocalStorage.set("settings", JSON.stringify(settings_list));
} else settings_list = JSON.parse(get_settings);
if (isInArray("settings_option_bb", settings_list)) BanhBim();
if (isInArray("settings_option_hs", settings_list)) HideSettings();
maxwidthSaved = myLocalStorage.get("maxwidthSaved");
window_width = $(window).width() - 56;
if (!maxwidthSaved) maxwidthSaved = "853";
rainbowSaved = myLocalStorage.get("rainbowSaved");
if (!rainbowSaved) rainbowSaved = "Rainbow";
var st = isInArray("settings_option_st", settings_list), qn = isInArray("settings_option_qn", settings_list), username_special = false;
if (qn) {
    var username_check = myLocalStorage.get("username");
    /*if (username_check) {
        if (!/^[a-zA-Z0-9_-]{3,30}$/.test(username_check)) {
            settings_list.splice(settings_list.indexOf("settings_option_qn"), 1);
            myLocalStorage.set("settings", JSON.stringify(settings_list));
            username_special = true;
        }
    }*/
    var except_list = ['ones'];
    if (username_check && (!/^[a-zA-Z0-9_-]{4,30}$/.test(username_check)) || $.inArray(username_check, except_list) > -1) {
        username_special = true;
    }
}
if (st || qn) {
    var intercom = Intercom.getInstance(), checklogin = new checkLogin(), tab_index = null, tab_index2 = null, tabs_count = null, tabs_check = false;
    tab_index = tab_index2 = $.cookie('tabs_count', Number);
    if (typeof tab_index == "undefined") tab_index = tab_index2 = 0;
    tabs_count = tab_index + 1;
    $.cookie('tabs_count', tabs_count);
    console.info("TabIndex: " + tab_index);
    intercom.on("tabs_check", function(data) {
        if (data.message - tab_index === 1)
            intercom.emit("tabs_check_reply");
    });
    intercom.on("tabs_check_reply", function() {
        tabs_check = true;
    });
    var checkTabsCount = function() {
        if (tab_index > 0) {
            intercom.emit("tabs_check", {message: tab_index});
            setTimeout(function() {
                if (tab_index > 0 && !tabs_check) {
                    tabs_count = $.cookie('tabs_count', Number);
                    if (typeof tabs_count == "undefined") tabs_count = 1;
                    if (tabs_count > 0) tabs_count--;
                    $.cookie('tabs_count', tabs_count);
                    tab_index--;
                    console.info("TabIndexChange: " + tab_index);
                    tab_index2--;
                    checkTabsCount();
                } else console.info("Correct tabs_count!");
            }, 3000);
        }
    };
    checkTabsCount();
    window.onbeforeunload = function() {
        tabs_count = $.cookie('tabs_count', Number);
        if (typeof tabs_count == "undefined") tabs_count = 1;
        if (tabs_count > 0) tabs_count--;
        $.cookie('tabs_count', tabs_count);
        intercom.emit("bg_unload", {message: tab_index});
    };
    if (st) {
        var jobstack = new JobStack(), followthread_bg = new FollowThread_bg();
        followthread_bg.run(myLocalStorage);
    }
    if (qn) {
        var quotenoti_bg = new QuoteNoti_bg();
        quotenoti_bg.run(myLocalStorage);
    }
}
/*window.addEventListener('error', function(e) {
    window.location.reload();
}, true);*/
GM_addStyle(".alt2 a[style*=wrap] > strong{margin-right:150px}.animated{-webkit-animation-duration:.5s;-moz-animation-duration:.5s;-o-animation-duration:.5s;animation-duration:.5s;-webkit-animation-fill-mode:both;-moz-animation-fill-mode:both;-o-animation-fill-mode:both;animation-fill-mode:both}.animated.fadeInLeft{-webkit-animation-name:fadeInLeft;-moz-animation-name:fadeInLeft;-o-animation-name:fadeInLeft;animation-name:fadeInLeft}@-webkit-keyframes fadeInLeft{0%{opacity:0;-webkit-transform:translateX(-20px)}100%{opacity:1;-webkit-transform:translateX(0)}}@-moz-keyframes fadeInLeft{0%{opacity:0;-moz-transform:translateX(-20px)}100%{opacity:1;-moz-transform:translateX(0)}}@-o-keyframes fadeInLeft{0%{opacity:0;-o-transform:translateX(-20px)}100%{opacity:1;-o-transform:translateX(0)}}@keyframes fadeInLeft{0%{opacity:0;-webkit-transform:translateX(-20px);-moz-transform:translateX(-20px);-o-transform:translateX(-20px);transform:translateX(-20px)}100%{opacity:1;-webkit-transform:translateX(0);-moz-transform:translateX(0);-o-transform:translateX(0);transform:translateX(0)}}::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);background:rgba(255,255,255,0.8);border-radius:0}::-webkit-scrollbar-thumb{border-radius:0;background:rgba(35,73,124,0.8);-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.5)}::-webkit-scrollbar-thumb:window-inactive{background:rgba(35,73,124,0.4)}.capture{background:url(data:image/gif;base64,R0lGODlhBAASAPcAAHiY0HqVxP///yozeIKOoZOds+np7bS2uZGr2aKru3SLs2d8oL3AynaDoamzyFxsieTm8g0akry+wlxxlUxhhYWRqpmmvWl1hFlky4Kdy42s4WyCpqyts4up3Wl9oeTl62R5nfj4+j1SdXWVzJqhrc7R20lZmLzA2t/h5TpOcOnq9YyaswoUaGB1mYmVq4Og0nmOskVafjRJbSs4sp26656qwl55qHmWyeHi53GGqiczjpSivIadx8PEzHaLr32Ko3WOunSSxcnJ0cXJzHOSynF2koWj2FltkZey5Imk08zP1IKJltXa5IiQmc3Q1tzd4aOnrEFWenqSu4aRpdjZ3nuFmiY1z9HT2Uleghcp0HqRuWl6mRgmrHyRtl90mG+EqLC4ylJhe1Vul1Rkghov96uxutHS1vb292WCs2uGtoCe0ufp9MHBxlFlilVpjp2ksHyazThDiLe6v8vN2hskbwkTefHy9IiRopakvXOAn8jK1WV/qtLW3u3u+IqYsPf4+VpqnGN0lJCu4tTV3GR4mUddhKGotW6Fvvz8/PT198nMz+3t75iz5XuSuKCltYim2neUxsrN0rm9yVlogxQeePDx8oagzfr6+4SWtHiGo22Mw3GIsXGPwlhngpWZo/Pz/RAfrxIbaWaEuGWArV92nVpij1ZohWyErm99lm6Dp26BowYPWllxmmZ4l/Hx++fo6Y+Wn3+XwH2UunWRv36Jm0NWdwUPZmuApPT0/mN4nOvs987S4JSiu3SIq5yowM3O0kpRg1p0nmZsmKutur/H14CMp9fY3pOftiY486C972F+sH+Yw01co0xcirO2wJigrHWBjkhZekVMe01abg4dwI2cuLfAz3d/iszM1Gd+qMzL0unp8neMsOzs9t7g66SuwEJQil1wkEVfi+/w+khQiFZmmV1jll1lm2h0kHqUwJSw33uTvBUhgjNCuWp/o9HS3NXU2pKhu5GhvUxhlIyXr/P09fTz9lNluF57r3KHq0NPhY+VqZCZrWiCrlhxnfX1/yH5BAEAAP8ALAAAAAAEABIAAAhDAC0ItACgIIBHCDvAUaPmRboAENNJTLdOyrp1jbo0ytilI4yPMHyI9JGvZL4vKFPdWnnL3a0NGxbIXEChJgUXFXIGBAA7) repeat-x;color:white;font-weight:bold;display:inline-block;vertical-align:5px;cursor:pointer;border-radius:6px;font-size:11px;padding:0 8px 1px;line-height:17px}.plk_smilebox_img{cursor:pointer;padding:2px;-webkit-transition:all .2s linear;-moz-transition:all .2s linear;-o-transition:all .2s linear;transition:all .2s linear}.plk_smilebox_img:hover{-moz-transform:scale(1.2);-webkit-transform:scale(1.2);-o-transform:scale(1.2);-ms-transform:scale(1.2);transform:scale(1.2)}.plk_smilebox.quick{height:170px;overflow:auto}#vB_Editor_001_smiliebox .plk_smilebox{width:auto!important;height:255px;overflow:auto}form[name='vbform'] .panel>div,#message_form .panel>div>div{width:auto!important;max-width:none!important}form[name='vbform'] .panel>div>table{width:100%}#vB_Editor_001_textarea{width:99%!important}#vB_Editor_001 .controlbar:last-child{width:30%}.controlbar.cmnw{margin-top:10px}.cmnw{position:relative}.cmnw .btn{display:inline-block;padding:4px 12px;margin-bottom:0;font-size:14px;line-height:20px;cursor:pointer;color:#333;text-shadow:rgba(255,255,255,0.74902) 0 1px 1px;background-color:#f5f5f5;background-image:-webkit-gradient(linear,left top,left bottom,from(#fff),to(#e6e6e6));background-image:-webkit-linear-gradient(#fff,#e6e6e6);background-image:-moz-linear-gradient(#fff,#e6e6e6);background-image:-o-linear-gradient(#fff,#e6e6e6);background-image:linear-gradient(#fff,#e6e6e6);background-repeat:repeat-x;border:1px solid #aaa;border-radius:4px;-webkit-box-shadow:rgba(255,255,255,0.2) 0 1px 0 inset,rgba(0,0,0,0.0470588) 0 1px 2px;box-shadow:rgba(255,255,255,0.2) 0 1px 0 inset,rgba(0,0,0,0.0470588) 0 1px 2px}.cmnw .btn:hover{color:#333;text-decoration:none;background-position:0 -15px;background-color:#e6e6e6}.wrap_popover{display:none;position:absolute;top:120%;z-index:999;max-width:276px;text-align:justify;background:white;-o-background-clip:padding-box;background-clip:padding-box;border:1px solid rgba(0,0,0,0.2);border-radius:6px;-webkit-box-shadow:rgba(0,0,0,0.2) 0 5px 10px;box-shadow:rgba(0,0,0,0.2) 0 5px 10px}.popover{position:relative}.popover:after{content:'';width:0;height:0;position:absolute;border:10px solid transparent;border-bottom:10px solid white;top:-20px;left:50px}.popover_title{margin:0;padding:8px 0;text-align:center;font-size:14px;font-weight:normal;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-radius:5px 5px 0 0}.popover_content p{margin:10px}.popover_content img{vertical-align:middle}h6{font-size:1em;margin:0}.label-primary{display:inline-block;padding:2px 5px;margin:4px 0;border-radius:3px;font-weight:bold;background:#32476c}.quote_count{color:white;background:red;padding:0 3px;border-radius:3px;line-height:normal;font-size:9px;top:5px;right:0;position:absolute}.plk_backdrop{width:100%;height:100%;position:fixed;top:0;left:0;z-index:5;background:black;opacity:.5}.plk_contentbar{position:fixed;z-index:9999;top:0;left:0;width:auto;height:auto;background-color:#39527f}.bar-item-wrapper{float:left;width:40px;height:40px;position:relative}.bar-item-wrapper.active{background-color:#5780c9}.bar-item-wrapper>a.handler{line-height:40px;text-align:center;display:block;width:40px;height:40px;position:absolute;top:0;left:0;z-index:100}#setting_bar>a.handler{background-position:8px center}#followthread_bar>a.handler{background-position:-62px center}#quoteNotification_bar>a.handler{background-position:-25px center}.bar-item-container{display:none;width:30%;min-width:400px;max-height:400px;overflow-x:hidden;overflow-y:auto;background:#5780c9;color:white;-webkit-box-shadow:black 2px 2px 3px;box-shadow:black 2px 2px 3px;position:absolute;top:40px;left:0;z-index:99;-webkit-transition:all .5s;-moz-transition:all .5s;-o-transition:all .5s;transition:all .5s}.bar-item-wrapper.active>.bar-item-container{opacity:1;display:block}#setting_bar>.bar-item-container{max-height:none}.data-list .data-item{color:white;border-bottom:2px solid #39527f;padding:8px}.SubscriptionItem--unhighlight{background-color:#39527f}.data-list .data-item a{color:white}.setting_bar_input{float:right}#settings_option_bb{margin-top:0;margin-bottom:0;height:40px}#settings_option_bb_img{display:inline-block;width:45px;height:40px;background-position:-100px center!important}.settingContent{display:inline-block;max-width:350px;line-height:1.5em}.quoteContent{line-height:1.5em}.page{min-width:768px}.rainbow-full{cursor:default;padding:1px}.rainbow-full:hover{padding:0;border:1px solid #316ac5;background:#c1d2ee}.wrap_popover_rainbow{left:200px}.preview_container{display:none}.preview_container.active{display:block}.active > .preview_inner{margin-top:10px;padding:10px;border:1px solid #c6c6c6;max-height:300px;overflow:auto}");
GM_addStyle('.plk_contentbar .bar-item-wrapper a.handler, #settings_option_bb_img{background:url(' + GM_getResourceURL("settings_bar") +') no-repeat}');

$(function() {
    function loadExternalScript(handler) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = handler;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    function ContentBar() {
        var htmlTemplate, $backDrop, $bar = null, bd, exports;
        htmlTemplate = "" + "<div id='plk_contentbar' class='cmnw plk_contentbar'>" + "<div data-bind='foreach: BarItems'>" + "<div class='bar-item-wrapper' data-bind='attr:{id:id},css:{active:_state.open}'>" + "<a href='javascript:;' class='handler animated'  data-bind='template:{name:barButton.template,data:container.data},click:barButtonClick'></a>" + "<div class='bar-item-container animated' data-bind='template: {name:container.template,data:container.data},css:{fadeInLeft:_state.open}'></div>" + "</div>" + "</div>" + "</div>";
        $backDrop = $("<div id='plk_contentbar_bd' class='plk_backdrop' data-bind='" + "visible:showBD" + "'></div>");
        function init() {
            $bar = $("#plk_contentbar");
            if ($bar.length === 0) {
                $bar = $(htmlTemplate);
                $bar.appendTo(document.body);
                $backDrop.appendTo(document.body);
                ko.setTemplateEngine(createStringTemplateEngine(new ko.nativeTemplateEngine(), getData().templates));
                ko.applyBindings(getData(), $bar[0]);
                ko.applyBindings(getData(), $backDrop[0]);
            }
        }
        function getData() {
            if (_.isUndefined(window.ContentBar)) {
                window.ContentBar = {
                    BarItems: ko.observableArray([]),
                    templates: {},
                    closeAll: function() {
                        var baritems = this.BarItems();
                        for (var i = 0; i < baritems.length; i++) {
                            baritems[i].closePanel();
                        }
                    }
                };
                window.ContentBar.showBD = ko.computed(function() {
                    var baritems = window.ContentBar.BarItems();
                    for (var i = 0; i < baritems.length; i++) {
                        if (baritems[i]._state.open() === true) {
                            return true;
                        }
                    }
                    return false;
                });
            }
            return window.ContentBar;
        }
        function updateDate(data) {
            window.ContentBar = data;
        }
        $backDrop.on("click", function() {
            getData().closeAll();
        });
        bd = {
            open: function() {
                $backDrop.show();
            },
            close: function() {
                $backDrop.hide();
            }
        };
        function BarItemDefault() {
            this.$bar = {};
            this.event = {
                init: function() {},
                open: function() {},
                close: function() {}
            };
            this.flash = function() {
                if (this._state.flashing === false) {
                    this.$barButton.removeClass("flash").addClass("flash");
                    this._state.flashing = true;
                    var that = this;
                    setTimeout(function() {
                        that._state.flashing = false;
                    }, 1e3);
                }
            };
            this._state = {
                open: ko.observable(false),
                flashing: ko.observable(false)
            };
            this.closePanel = function() {
                this.event.close.call(this);
                this._state.open(false);
            };
            this.openPanel = function() {
                window.ContentBar.closeAll();
                this.event.open.call(this);
                this._state.open(true);
            };
            this.barButtonClick = function(barItem) {
                if (this._state.open() === false) {
                    this.openPanel();
                } else {
                    this.closePanel();
                }
            };
        }
        exports = {
            run: function() {
                init();
                this.addBarItem({
                    id: "setting_bar",
                    barButton: {
                        template: "setting_barButton"
                    },
                    templates: {
                        setting_barButton: "",
                        setting_container: "<div id='wrap_SettingsList' class='data-list' data-bind='stopBinding: true'></div>"
                    },
                    container: {
                        template: "setting_container",
                        data: {}
                    }/*,
                    barButtonClick: function() {
                        return true;
                    }*/
                });
            },
            addBarItem: function(barItem) {
                barItem = $.extend(true, {}, new BarItemDefault(), barItem);

                var data = getData();
                barItem.$bar = function() {
                    return $("#" + barItem.id);
                };

                for (var tmpl in barItem.templates) {
                    if (barItem.templates.hasOwnProperty(tmpl)) {
                        data.templates[tmpl] = barItem.templates[tmpl];
                    }
                }
                data.BarItems.push(barItem);
                updateDate(data);
                return barItem;
            }
        };
        return exports;
    }
    function FollowThread() {
        function SubscribedThreadVM(data) {
            var self = this;
            self.id = ko.observable("");
            self.lastViewPos = {
                id: ko.observable("0"),
                page: ko.observable("0"),
                post: ko.observable("0")
            };
            self.latestPost = {
                id: ko.observable("0"),
                page: ko.observable("0"),
                post: ko.observable("0")
            };
            ko.mapping.fromJS(data, {}, self);
            self.test = ko.computed(function() {
                return true;
            });
            self.href = ko.computed(function() {
                return "/showthread.php?t={0}&page={1}#post{2}".format(self.id(), self.lastViewPos.page(), self.lastViewPos.id());
            });
            self.unreadPost = ko.computed(function() {
                var result = (parseInt(self.latestPost.page()) - parseInt(self.lastViewPos.page())) * 10 + (parseInt(self.latestPost.post()) - parseInt(self.lastViewPos.post()));
                return result < 0 ? 0 : result;
            });
            self.unhighlight = ko.computed(function() {
                return self.unreadPost() === 0 ? "SubscriptionItem--unhighlight" : "";
            });
        }
        function SubscriptionListVM(data) {
            var self = this;
            var mappingOption = {
                threads: {
                    create: function(options) {
                        return new SubscribedThreadVM(options.data);
                    }
                }
            };
            self.update = function(data) {
                ko.mapping.fromJS(data, mappingOption, self);
            };
            if (data) {
                self.update(data);
            }
        }
        var containerTpl, barButtonTemplate, quoteItemTemplate, barItem = null, viewmodel, timeout_update = 0, timeout_updatePostRead = 0;
        containerTpl = "<div id='SubscriptionList' class='data-list' " + 'data-bind=\'template:{name:"followthread_item",foreach:threads,as:"thread"}\'></div>';
        barButtonTemplate = "<span class='quote_count' data-bind='text: totalUnread'></span>";
        quoteItemTemplate = "<div class='SubscriptionItem data-item' data-bind='css:thread.unhighlight'>" + "<strong>" + "<a data-bind='attr:{href:thread.href}'><span data-bind='text:thread.title'></span></a></strong>" + "<br/>(Có <span data-bind='text:thread.unreadPost'></span> bài mới)" + "</div>";
        viewmodel = new SubscriptionListVM({
            threads: [{title: "test"}]
        });
        viewmodel.totalUnread = ko.computed(function() {
            var count = 0, result = "", threads0 = viewmodel.threads();
            for (var i = 0; i < threads0.length; i++)
                count = count + threads0[i].unreadPost();
            if (count <= 0) result = ""; else if (count >= 100) result = "99+"; else result = count;
            return result;
        });
        function updateData(callback) {
            var data = followthread_bg.getSubscribedData();
            viewmodel.update(data);
            callback.call();
        }
        function monitorPostRead() {
            if (!/\/showthread\.php/.test(location.href)) return;
            var thread_id = postHelper($(document.body)).getThreadId();
            //console.log(thread_id);
            if (thread_id == -1 || thread_id === undefined) return;
            _.each(viewmodel.threads(), function(thread, k, l) {
                if (thread_id == thread.id()) {
                    var page = postHelper($(document.body)).getPage();
                    if (parseInt(page) < parseInt(thread.lastViewPos.page())) return;
                    var postsPerPage = $("table[id^='post']"), postsInview = null;
                    if (parseInt(page) > parseInt(thread.lastViewPos.page())) postsInview = postsPerPage;
                    else {
                        postsInview = [];
                        var lastViewPosPage = parseInt(thread.lastViewPos.post());
                        for (var i = 0; i < postsPerPage.length; i++) {
                            var post = $("table[id^='post']").index(postsPerPage[i]);
                            if (parseInt(post) > lastViewPosPage) postsInview.push(postsPerPage[i]);
                        }
                    }
                    $(postsInview).bind("inview", function(e, isInView, X, Y) {
                        var $this = $(this), post_id, post;
                        post_id = $this.attr("id").match(/(\d+)/)[1];
                        post = $(postsPerPage).index($this);
                        if (isInView) {
                            clearTimeout(timeout_updatePostRead);
                            timeout_updatePostRead = setTimeout(function() {
                                intercom.emit('updateReadPost', {thread_id: thread_id, post_num: post, post_id: post_id, page: page});
                            }, 100);
                            $this.unbind("inview");
                        }
                    });
                    return;
                }
            });
        }
        return {
            init: function() {
                updateData(function() {
                    monitorPostRead();
                });
                return true;
            },
            run: function() {
                if (checklogin.isLogged() === false) return false;
                barItem = contentBar.addBarItem({
                    id: "followthread_bar",
                    barButton: {
                        template: "followthread_barButton"
                    },
                    templates: {
                        followthread_container: containerTpl,
                        followthread_item: quoteItemTemplate,
                        followthread_barButton: barButtonTemplate
                    },
                    container: {
                        template: "followthread_container",
                        data: viewmodel
                    }
                });
                intercom.on('followedThreadUpdated', function(data) {
                    clearTimeout(timeout_update);
                    timeout_update = setTimeout(updateData, 100);
                });
            }
        };
    }
    function QuoteNoti() {
        var barButton, containerTpl, barButtonTemplate, quoteItemTemplate, barItem = null, q0;
        barButton = "<div data-bind='template:{name:\"quoteNotification_barButton\"}'></div>";
        containerTpl = "<div class='Noti5-QuoteList data-list' data-bind='template:{name:\"quoteNotification_item\",foreach:quotes, as: \"quote\"}'>" + "</div>";
        barButtonTemplate = "<span class='icon-comment'></span>" + "<span class='quote_count' data-bind='text: unseenCount'></span>";
        quoteItemTemplate = "<div class='Noti5-QuoteItem data-item' data-bind='css{Noti5_QuoteItem_hasRead:quote.hasRead}'>" + "<h6><a data-bind='attr:{href:\"showthread.php?t=\"+thread.id}'><i class='icon-th-list icon-white'></i><span data-bind='text:thread.title'></span></a></h6><div class='smallfont'>Posted By <a data-bind='attr:{href:\"member.php?u=\"+author.userid}'><i class='icon-user icon-white'></i><span class='label-primary' data-bind='text: author.username'></span></a></div><div class='smallfont quoteContent'><em><a data-bind='text: post.content,attr:{href:\"showthread.php?p={0}#post{0}\".format(post.id)}'></a></em></div></div>";
        qO = {
            quotes: ko.observableArray([])
        };
        qO.unseenCount = ko.computed(function() {
            var count = 0, qs = qO.quotes();
            for (var i = 0; i < qs.length; i++) {
                if (qs[i].hasSeen() === false) count++;
            }
            if (count !== 0) return count; else return "";
        });
        function updateQuotes(qo) {
            qO.quotes.removeAll();
            for (var i = 0; i < qo.quotes.length; i++) {
                var quote = qo.quotes[i];
                quote.hasSeen = ko.observable(quote.hasSeen);
                quote.hasRead = ko.observable(quote.hasRead);
                qO.quotes.push(quote);
            }
            return i;
        }
        function updateQuotesToStorage() {
            var updates = [], quotes = qO.quotes();
            for (var i = 0; i < quotes.length; i++) {
                var quote = quotes[i];
                var update = {
                    post: {
                        id: quote.post.id
                    },
                    hasSeen: quote.hasSeen(),
                    hasRead: quote.hasRead()
                };
                updates.push(update);
            }
            //bgHelper.callFunction("updateQuotes", [ updates ]);
            quotenoti_bg.updateQuotes(updates);
        }
        return {
            init: function() {
                if (checklogin.isLogged() === false) return false;
                var user = $("strong:contains('Welcome') > a[href*='member.php?u']").eq(0);
                    username = user.text(),
                    u_id = '#' + user.attr('href').match(/u=(\d+)/)[1],
                    token = unsafeWindow.SECURITYTOKEN;
                quotenoti_bg.setUsernameAndSToken(username, token, u_id);
                if (username_special && u_id !== null) {
                    $("form[name='vbform']").submit(function(event) {
                        var editor = $(this).find('#vB_Editor_QR_textarea, #vB_Editor_001_textarea');
                        if (editor.val().length >= 10 && editor.val().indexOf(u_id) === -1) {
                            editor.val(editor.val() + ' [COLOR="#F5F5FF"]' + u_id  + '[/COLOR]');
                        }
                    });
                }
                return true;
            },
            run: function() {
                if (checklogin.isLogged() === false) return false;
                barItem = contentBar.addBarItem({
                    id: "quoteNotification_bar",
                    barButton: {
                        template: "quoteNotification_barButton"
                    },
                    templates: {
                        quoteNotification_container: containerTpl,
                        quoteNotification_item: quoteItemTemplate,
                        quoteNotification_barButton: barButtonTemplate
                    },
                    container: {
                        template: "quoteNotification_container",
                        data: qO
                    },
                    event: {
                        init: function() {},
                        open: function() {
                            intercom.emit("quotesOpen", {message: "quotesOpenSend"});
                        },
                        close: function() {}
                    }
                });
                intercom.on("updateQuotes", function(data) {
                    updateQuotes(data.getQuotes);
                });
                intercom.on("quotesOpen", function(data) {
                    var qs = qO.quotes();
                    for (var i = 0; i < qs.length; i++) {
                        qs[i].hasSeen(true);
                    }
                    updateQuotesToStorage();
                });
                var data = quotenoti_bg.getQuotes();
                updateQuotes(data);
            }
        };
    }
    function GoToNewPostLast() {
        $("#threadslist").waitUntilExists(function() {
            var f35          = $("#f35"),
                threadslist  = $(this),
                gotonew      = threadslist.find("a[id^='thread_gotonew']"),
                threadsTitle = threadslist.find('[id^="td_threadtitle"]'),
                preview_box  =
                "<div class='preview_container cmnw' data-bind='css:{active:isActive}'>" +
                    "<div class='preview_inner'>" +
                        "<div data-bind='visible:isLoading'>Loading...</div>" +
                            "<div data-bind='html:content'></div>" +
                    "</div>" +
                "</div>",
                previewMaxWidth = $(threadsTitle).first().children('div:first-child').width(),
                ThreadListVM = {},
                ThreadVM = function (id) {
                    var self       = this;
                    self.id        = id;
                    self.isActive  = ko.observable(false);
                    self.isLoading = ko.observable(false);
                    self.isLoaded  = ko.observable(false);
                    self.href      = ko.observable("http://xamvl.com/showthread.php?t=" + self.id);
                    self.content   = ko.observable("");
                    self.curAjax   = null;
                    self.activeClick = function (t) {
                        if (self.isActive()) {
                            self.isActive(false);
                        } else {
                            self.isActive(true);
                            load();
                        }
                    };
                    function load() {
                        if (self.isLoaded()) {
                            self.isLoading(false);
                        } else {
                            self.isLoading(true);
                            self.curAjax = $.get(self.href(), function(data) {
                                var post = $(data).find("[id^='post_message']:first").html();
                                self.content(post);
                                self.isLoading(false);
                                self.isLoaded(true);
                            }, 'html')
                            .fail(function() {
                                alert('Lỗi xảy ra khi get dữ liệu!');
                                self.isActive(false);
                            });
                        }
                    }
                };
            if (f35.length > 0) {
                var f33 = "<tbody><tr align='center' style='height: 50px;'><td class='alt1Active' colspan='2' align='left' id='f33'><table cellpadding='0' cellspacing='0' border='0'><tbody><tr><td><img src='images/statusicon/forum_new.gif' alt='' border='0' id='forum_statusicon_33'></td><td><img src='clear.gif' alt='' width='9' height='1' border='0'></td><td><div><a href='forumdisplay.php?f=33'><strong>Điểm báo</strong></a></div></td></tr></tbody></table></td><td class='alt2'></td><td class='alt1'></td><td class='alt2'></td></tr></tbody>";
                f35.closest("tbody").after(f33);
            }
            for (var i = gotonew.length - 1; i >= 0; i--) {
                var parent = gotonew[i].parentNode;
                $(parent).append("<a href='#' title='Xem trước thớt' data-bind='css:{active:isActive},click:activeClick' class='icon-bolt preview_active_area'>(Preview)</a>&nbsp;&nbsp;");
                parent.appendChild(gotonew[i]);
            }
            $(threadsTitle).each(function() {
                var $this     = $(this),
                    thread_id = $this.attr("id").match(/\d+/)[0],
                    tVM       = new ThreadVM(thread_id);
                $(this).append(preview_box);
                $this.addClass("thread").attr("data-bind", "with: t" + thread_id);
                ThreadListVM["t" + thread_id] = tVM;
            });
            $(".preview_container").css('max-width', previewMaxWidth + 'px');
            ko.applyBindings(ThreadListVM, $("#threadslist")[0]);
            if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) return;
            threadslist.on("click", "a[id^='thread_gotonew']", function(event) {
                event.preventDefault();
                var a = document.createElement("a");
                a.href = $(this).attr('href');
                var evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, false, 0, null);
                a.dispatchEvent(evt);
                return false;
            });
        }, true);
    }
    function MaxWidthResizeImage(maxwidthSaved) {
        $("#resize_choices").prop("disabled", false);
        var handler = function(maxwidth) {
            return "NcodeImageResizer.MAXWIDTH = " + maxwidth + ";";
        };
        if (maxwidthSaved == "Full") {
            GM_addStyle('.xamvl-post-message > img{max-width:' + window_width + 'px;height:auto;}');
            loadExternalScript(handler(window_width));
        } else {
            GM_addStyle('.xamvl-post-message > img{max-width:' + maxwidthSaved + 'px;height:auto;}');
            loadExternalScript(handler(parseInt(maxwidthSaved)));
        }
    }
    function AddToIgnore() {
        $(".vbmenu_popup[id^='postmenu_']").each(function() {
            var uid = $(this).find("a[href*='member.php']").attr("href").match(/\?u=(\d+)/)[1];
            var ignoreRow = $("<tr>" + "<td class='vbmenu_option vbmenu_option_alink'>" + "<a target='_blank' href='http://xamvl.com/profile.php?do=addlist&userlist=ignore&u=" + uid + "' title='Mở trong tab mới'>Add to ignore list</a>" + "</td>" + "</tr>");
            $(this).find("table tbody").append(ignoreRow);
        });
    }
    function DetectImage() {
        var detect_link = /(?=[^ ])(h *t *t *p *: *\/ *\/ *)?(([a-zA-Z0-9-\.]+\.)?[a-zA-Z0-9-]{3,}\.(com|net|org|us|ru|info|vn|gl|ly|com\.vn|net\.vn|gov\.vn|edu|edu\.vn)(\/)?([^\s\[]+)?)(?=\s|$|\[)/gi;
        $("[id^='post_message_']").each(function() {
            var node, nodes, replaceTextWithLink, i, len;
            nodes = $(this).contents();
            replaceTextWithLink = function(node) {
                if (detect_link.test($(node).text())) {
                    var replacement = $(node).text().replace(detect_link, "<a data-type='linkdetected' href='http://$2' target='_blank'>$2</a>");
                    $(node).before(replacement);
                    node.nodeValue = "";
                }
                return;
            };
            for (i = 0, len = nodes.length; i < len; i++) {
                node = nodes[i];
                if (node.nodeType === 3) {
                    replaceTextWithLink(node);
                }
            }
        });
        $("a[href*='redirect/index.php']").each(function() {
            try {
                var url = $(this).attr("href").match(/\?link=(.*)/)[1];
                var decoded = decodeURIComponent(url);
                $(this).attr("href", decoded);

            } catch (e) {
            }
        });
        $("[id^='post_message_'] a:not(:has(img))").each(function() {
            var href = $(this).attr("href");
            if (/\.(jpg|jpeg|png|gif|bmp)$/.test(href)) {
                $(this).attr("data-smartlink", "image");
                var button = $("<button class='showimage'>Hiện hình</button>");
                button.attr('image_link', href);
                $(this).after(button);
            } else if (/\.(mp4|webm|ogg)$/.test(href)) {
                var video = $('<div class="video_container"><video controls preload="metadata">Your browser does not support the <code>video</code> element.</video></div>');
                video.children().attr("src", href);
                $(this).after(video);
            }
        });
        $(".showimage").clicktoggle(function() {
            $(this).text('Ẩn hình');
            var href = $(this).attr('image_link');
            var img = $("<div><a href='" + href + "' target='_blank'><img src='" + href + "' title='Vui lòng nhấn vào đây để tới link ảnh gốc'/></a></div>");
            $(this).after(img);
        }, function() {
            $(this).text('Hiện hình');
            $(this).next().remove();
        });
        var videos = $(".video_container > video");
        GM_addStyle('.video_container > video{max-width:' + window_width + 'px;height:auto;}');
        $(window).resize(function() {
            window_width = $(this).width() - 56;
            GM_addStyle('img[onload^="NcodeImageResizer"], .video_container > video{max-width:' + window_width + 'px;height:auto;}');
        });
        if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
            videos.click(function() {
                if ($(this)[0].paused)
                    $(this)[0].play();
                else $(this)[0].pause();
            });
        }
        if (isInArray("settings_option_da", settings_list)) {
            videos.attr({
                "autoplay": true,
                "loop": true
            });
        }
    }
    function Capture() {
        $("[id^='td_post_']").each(function() {
            var id, printBtn, controls;
            id = $(this).attr("id").match(/\d+/)[0];
            printBtn = $("<span class='capture'>Capture</span>");
            printBtn.attr('data', id);
            controls = $(this).find(">div:last");
            if (controls.length > 0) {
                controls.prepend(printBtn);
            }
        });

        $(".capture").click(function() {
            var post_id = "#post" + $(this).attr("data"), post = $(post_id);
            html2canvas(post, {
                onrendered: function(canvas) {
                    var myImage = canvas.toDataURL("image/png");
                    window.open(myImage);
                }
            });
        });
    }
    function Emo(xlocalStorage) {
        var EmoStorage = xlocalStorage;
        function smilieList() {
            var list = [{text:":xamvl1:",src:"/images/smilies/XamVL/xamvl1.gif",stt:1},  {text:":xamvl2:",src:"/images/smilies/XamVL/xamvl2.gif",stt:2},  {text:":xamvl3:",src:"/images/smilies/XamVL/xamvl3.gif",stt:3},  {text:":xamvl4:",src:"/images/smilies/XamVL/xamvl4.gif",stt:4},  {text:":xamvl5:",src:"/images/smilies/XamVL/xamvl5.gif",stt:5},  {text:":xamvl6:",src:"/images/smilies/XamVL/xamvl6.gif",stt:6},  {text:":xamvl7:",src:"/images/smilies/XamVL/xamvl7.gif",stt:7},  {text:":xamvl8:",src:"/images/smilies/XamVL/xamvl8.gif",stt:8},  {text:":xamvl9:",src:"/images/smilies/XamVL/xamvl9.gif",stt:9},  {text:":xamvl10:",src:"/images/smilies/XamVL/xamvl10.gif",stt:10},  {text:":xamvl11:",src:"/images/smilies/XamVL/xamvl11.gif",stt:11},  {text:":xamvl12:",src:"/images/smilies/XamVL/xamvl12.gif",stt:12},  {text:":xamvl13:",src:"/images/smilies/XamVL/xamvl13.gif",stt:13},  {text:":xamvl14:",src:"/images/smilies/XamVL/xamvl14.gif",stt:14},  {text:":xamvl15:",src:"/images/smilies/XamVL/xamvl15.gif",stt:15},  {text:":xamvl16:",src:"/images/smilies/XamVL/xamvl16.gif",stt:16},  {text:":xamvl17:",src:"/images/smilies/XamVL/xamvl17.gif",stt:17},  {text:":xamvl18:",src:"/images/smilies/XamVL/xamvl18.gif",stt:18},  {text:":xamvl19:",src:"/images/smilies/XamVL/xamvl19.gif",stt:19},  {text:":xamvl20:",src:"/images/smilies/XamVL/xamvl20.gif",stt:20},  {text:":xamvl21:",src:"/images/smilies/XamVL/xamvl21.gif",stt:21},  {text:":xamvl22:",src:"/images/smilies/XamVL/xamvl22.gif",stt:22},  {text:":xamvl23:",src:"/images/smilies/XamVL/xamvl23.gif",stt:23},  {text:":xamvl24:",src:"/images/smilies/XamVL/xamvl24.gif",stt:24},  {text:":xamvl25:",src:"/images/smilies/XamVL/xamvl25.gif",stt:25},  {text:":xamvl26:",src:"/images/smilies/XamVL/xamvl26.gif",stt:26},  {text:":xamvl27:",src:"/images/smilies/XamVL/xamvl27.gif",stt:27},  {text:":xamvl28:",src:"/images/smilies/XamVL/xamvl28.gif",stt:28},  {text:":sexy:",src:"/images/smilies/Popo/sexy_girl.gif",stt:29}, {text:":byebye:",src:"/images/smilies/Popo/byebye.gif",stt:30}, {text:":look_down:",src:"/images/smilies/Popo/look_down.gif",stt:31}, {text:":stick:",src:"/images/smilies/Popo/burn_joss_stick.gif",stt:32}, {text:":adore:",src:"/images/smilies/Popo/adore.gif",stt:33}, {text:":nosebleed:",src:"/images/smilies/Popo/nosebleed.gif",stt:34}, {text:":beauty:",src:"/images/smilies/Popo/beauty.gif",stt:35}, {text:":gach:",src:"/images/smilies/Popo/brick.png",stt:36}, {text:':">',src:"/images/smilies/Popo/embarrassed.gif",stt:37}, {text:":surrender:",src:"/images/smilies/Popo/surrender.gif",stt:38}, {text:":pudency:",src:"/images/smilies/Popo/pudency.gif",stt:39}, {text:":sosad:",src:"/images/smilies/Popo/too_sad.gif",stt:40}, {text:":go:",src:"/images/smilies/Popo/go.gif",stt:41}, {text:":sweat:",src:"/images/smilies/Popo/sweat.gif",stt:42}, {text:":canny:",src:"/images/smilies/Popo/canny.gif",stt:43}, {text:":sogood:",src:"/images/smilies/Popo/feel_good.gif",stt:44}, {text:":shame:",src:"/images/smilies/Popo/shame.gif",stt:45}, {text:":hungry:",src:"/images/smilies/Popo/hungry.gif",stt:46}, {text:":shot:",src:"/images/smilies/Popo/beat_shot.gif",stt:47}, {text:":rap:",src:"/images/smilies/Popo/rap.gif",stt:48}, {text:":hang:",src:"/images/smilies/Popo/hang.gif",stt:49}, {text:":*",src:"/images/smilies/Popo/sweet_kiss.gif",stt:50}, {text:":ops:",src:"/images/smilies/Popo/ops.gif",stt:51}, {text:":)",src:"/images/smilies/Popo/smile.gif",stt:52}, {text:":plaster:",src:"/images/smilies/Popo/beat_plaster.gif",stt:53}, {text:":tire:",src:"/images/smilies/Popo/tire.gif",stt:54}, {text:":brick:",src:"/images/smilies/Popo/beat_brick.gif",stt:55}, {text:":badsmell:",src:"/images/smilies/Popo/bad_smelly.gif",stt:56}, {text:":hell_boy:",src:"/images/smilies/Popo/hell_boy.gif",stt:57}, {text:":kool:",src:"/images/smilies/Popo/cool.gif",stt:58}, {text:":dribble:",src:"/images/smilies/Popo/dribble.gif",stt:59}, {text:":waaaht:",src:"/images/smilies/Popo/waaaht.gif",stt:60}, {text:":oh:",src:"/images/smilies/Popo/oh.gif",stt:61}, {text:":((",src:"/images/smilies/Popo/cry.gif",stt:62}, {text:"^:)^",src:"/images/smilies/Popo/lay.gif",stt:63}, {text:":aboom:",src:"/images/smilies/Popo/after_boom.gif",stt:64}, {text:":sad:",src:"/images/smilies/Popo/sad.gif",stt:65}, {text:":misdoubt:",src:"/images/smilies/Popo/misdoubt.gif",stt:66}, {text:":sure:",src:"/images/smilies/Popo/sure.gif",stt:67}, {text:":amazed:",src:"/images/smilies/Popo/amazed.gif",stt:68}, {text:":shitty:",src:"/images/smilies/Popo/shit.gif",stt:69}, {text:":what:",src:"/images/smilies/Popo/what.gif",stt:70}, {text:":bye:",src:"/images/smilies/Popo/bye.gif",stt:71}, {text:"-_-",src:"/images/smilies/Popo/sleep.gif",stt:72}, {text:":lol:",src:"/images/smilies/Popo/lol.gif",stt:73}, {text:":ah:",src:"/images/smilies/Popo/ah.gif",stt:74}, {text:":rofl:",src:"/images/smilies/Popo/rofl.gif",stt:75}, {text:":baffle:",src:"/images/smilies/Popo/baffle.gif",stt:76}, {text:":choler:",src:"/images/smilies/Popo/choler.gif",stt:77}, {text:":doubt:",src:"/images/smilies/Popo/doubt.gif",stt:78}, {text:":shoot1:",src:"/images/smilies/Popo/shoot1.gif",stt:79}, {text:":confident:",src:"/images/smilies/Popo/confident.gif",stt:80}, {text:":lmao:",src:"/images/smilies/Popo/lmao.gif",stt:81}, {text:":matrix:",src:"/images/smilies/Popo/matrix.gif",stt:82}, {text:":haha:",src:"/images/smilies/Popo/haha.gif",stt:83}, {text:":hehe:",src:"/images/smilies/Popo/hehe.gif",stt:84}, {text:":smoke:",src:"/images/smilies/Popo/smoke.gif",stt:85}, {text:":D",src:"/images/smilies/Popo/big_smile.gif",stt:86}, {text:":angry:",src:"/images/smilies/Popo/angry.gif",stt:87}, {text:":sos:",src:"/images/smilies/Popo/sos.gif",stt:88}, {text:":spiderman:",src:"/images/smilies/Popo/spiderman.gif",stt:89}, {text:":boss:",src:"/images/smilies/Popo/boss.gif",stt:90}, {text:":dreaming:",src:"/images/smilies/Popo/still_dreaming.gif",stt:91}, {text:":-s",src:"/images/smilies/Popo/confuse.gif",stt:92}, {text:":flame:",src:"/images/smilies/Popo/flame.gif",stt:93}, {text:":hug:",src:"/images/smilies/Popo/hug.gif",stt:94}, {text:":mage:",src:"/images/smilies/Popo/mage.gif",stt:95}, {text:":cheers:",src:"/images/smilies/Popo/cheers.gif",stt:96}, {text:":phone:",src:"/images/smilies/Popo/phone.gif",stt:97}, {text:":theft:",src:"/images/smilies/Popo/theft.gif",stt:98}, {text:":ot:",src:"/images/smilies/Popo/ot.gif",stt:99}, {text:":bike:",src:"/images/smilies/Popo/bike.gif",stt:100}, {text:":bang:",src:"/images/smilies/Popo/bang.gif",stt:101}, {text:":fix:",src:"/images/smilies/Popo/fix.gif",stt:102}, {text:":stupid:",src:"/images/smilies/Popo/stupid.gif",stt:103}, {text:":ban:",src:"/images/smilies/Popo/bann.gif",stt:104}, {text:":doublegun:",src:"/images/smilies/Popo/doublegun.gif",stt:105}, {text:":boom:",src:"/images/smilies/Popo/boom.gif",stt:106}, {text:":spam:",src:"/images/smilies/Popo/spam.gif",stt:107}, {text:":welcome:",src:"/images/smilies/Popo/welcome.gif",stt:108}, {text:":please:",src:"/images/smilies/Popo/please.gif",stt:109}, {text:":puke:",src:"/images/smilies/Popo/puke.gif",stt:110}, {text:":shit:",src:"/images/smilies/Popo/shit.gif",stt:111}, {text:":lovemachine:",src:"/images/smilies/Popo/lovemachine.gif",stt:112}, {text:":runrun:",src:"/images/smilies/Popo/runrun.gif",stt:113}, {text:":loveyou:",src:"/images/smilies/Popo/loveyou.gif",stt:114}, {text:":Birthday:",src:"/images/smilies/Popo/birthday.gif",stt:115}, {text:":no:",src:"/images/smilies/Popo/no.gif",stt:116}, {text:":yes:",src:"/images/smilies/Popo/yes.gif",stt:117}, {text:":capture:",src:"/images/smilies/Popo/capture.gif",stt:118}, {text:":winner:",src:"/images/smilies/Popo/winner.gif",stt:119}, {text:":band:",src:"/images/smilies/Popo/band.gif",stt:120}, {text:":+1:",src:"http://i.imgur.com/JfLvYp5.png",stt:121}, {text:":grin:",src:"/images/smilies/biggrin.gif",stt:122}, {text:":frown:",src:"/images/smilies/frown.gif",stt:123}, {text:":mad:",src:"/images/smilies/mad.gif",stt:124}, {text:":p",src:"/images/smilies/tongue.gif",stt:125}, {text:":embrass:",src:"/images/smilies/redface.gif",stt:126}, {text:":confused:",src:"/images/smilies/confused.gif",stt:127}, {text:";)",src:"/images/smilies/wink.gif",stt:128}, {text:":rolleyes:",src:"/images/smilies/rolleyes.gif",stt:129}, {text:":cool:",src:"/images/smilies/cool.gif",stt:130}, {text:":eek:",src:"/images/smilies/eek.gif",stt:131}];
            
            for (var i = 0; i < list.length; i++) {
                var smilie = list[i];
                if (smilie.src.indexOf("http") === 0) continue;
                if (smilie.src.charAt(0) != "/") {
                    smilie.src = "/" + smilie.src;
                }
                smilie.src = "http://xamvl.com" + smilie.src;
                smilie.clickNum = 0;
            }
            return list;
        }
        return {
            run: function() {
                var editorFull, editorQuick, editor, smileCont, smileBox, default_smilieList, _smilieList, data;
                editorFull = $("#vB_Editor_001_textarea");
                editorQuick = $("#vB_Editor_QR_textarea");
                editor = null;
                smileCont = $("#vB_Editor_001_smiliebox");
                smileBox = $("<div id='smilebox' class='plk_smilebox' data-bind='foreach: smilies'>" + "<img class='plk_smilebox_img' data-bind='attr:{src:src,alt:text},click:$root.Select'/>" + "</div>");
                if (editorFull.length > 0) {
                    editor = editorFull;
                    if (smileCont.length === 0) {
                        return;
                    }
                    smileCont.find("table").remove();
                } else if (editorQuick.length > 0) {
                    editor = editorQuick;
                    smileCont = editorQuick.parents("#vB_Editor_QR").eq(0);
                    smileBox.addClass("controlbar quick");
                } else {
                    alert("Failed to load Smile lists");
                    return;
                }
                smileCont.append(smileBox);
                default_smilieList = smilieList();
                _smilieList = smilieList();
                function _exec() {
                    var _smiles = _smilieList.sort(function(a, b) {
                        if (a.clickNum < b.clickNum) {
                            return 1;
                        } else if (a.clickNum > b.clickNum) {
                            return -1;
                        } else {
                            if (a.stt < b.stt) return -1;
                            else if (a.stt > b.stt) return 1;
                        }
                    });
                    var SmilieVM = {
                        smilies: _smiles,
                        Select: function(smilie) {
                            var smilieText = smilie.text;
                            var v = editor.val();
                            var selStart = editor.prop("selectionStart");
                            var selEnd = editor.prop("selectionEnd");
                            var textBefore = v.substring(0, selStart);
                            var textAfter = v.substring(selEnd, v.length);
                            editor.val(textBefore + smilieText + textAfter);
                            editor[0].setSelectionRange(selStart + smilieText.length, selStart + smilieText.length);
                            if (typeof smilie.clickNum != "undefined") {
                                smilie.clickNum++;
                            } else {
                                smilie.clickNum = 1;
                            }
                            var smile = _.findWhere(default_smilieList, {
                                text: smilie.text
                            });
                            smile.clickNum = smilie.clickNum;
                            var clickList = [];
                            for (var i = 0; i < default_smilieList.length; i++) {
                                clickList.push({
                                    click: default_smilieList[i].clickNum
                                });
                            }
                            editor.focus();
                            EmoStorage.set("iconUsage", JSON.stringify(clickList));
                        }
                    };
                    ko.applyBindings(SmilieVM, smileBox[0]);
                }
                data = EmoStorage.get("iconUsage");
                if (data) {
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            var d = data[i];
                            if (typeof d.click != "undefined" && _smilieList[i]) {
                                _smilieList[i].clickNum = d.click;
                                default_smilieList[i].clickNum = d.click;
                            }
                        }
                    }
                }
                _exec();
                $("form[name='vbform'], form#message_form").submit(function(event) {
                    if (editor.val().length >= 10) editor.val(editor.val().replace(/:\+1:/g, " [IMG]http://i.imgur.com/JfLvYp5.png[/IMG]"));
                });
            }
        };
    }
    function LoadQuickQuote() {
        function clearChecked() {
            $.cookie("vbulletin_multiquote", "");
            $("[src='http://xamvl.com/images/buttons/multiquote_on.gif']").attr("src", "http://xamvl.com/images/buttons/multiquote_off.gif");
        }
        return {
            run: function() {
                var editorQuick, editorWrap, $Toolbar, $btnLoadQ, $btnClearQ, loadQ_tooltip;
                editorQuick = $("#vB_Editor_QR_textarea");
                editorWrap = editorQuick.parents("#vB_Editor_QR").eq(0);
                $Toolbar = $("<div class='controlbar cmnw'></div>");
                editorWrap.append($Toolbar);
                $btnLoadQ = $("<a href='javascript:;' class='btn'>Load Quotes</a>");
                $btnClearQ = $("<a href='javascript:;' class='btn' title='Xóa các trích dẫn đã đánh dấu'>Del Quotes</a>");
                loadQ_tooltip = $("<div class='wrap_popover'><div class='popover'><h3 class='popover_title'>Chèn các trích dẫn đã đánh dấu</h3><div class='popover_content'><p>Để thực hiện trích dẫn nhiều bài cùng lúc: Click vào nút <img src='http://xamvl.com/images/buttons/multiquote_off.gif'/>" + " ở bên dưới-phải của mỗi bài viết cần trích dẫn.</p><p>Những bài viết nào đã được đánh dấu icon sẽ chuyển sang <img src='http://xamvl.com/images/buttons/multiquote_on.gif' /></p></div></div></div>");
                $Toolbar.append($btnLoadQ);
                $Toolbar.append($btnClearQ);
                $Toolbar.append(loadQ_tooltip);
                $btnClearQ.on("click", function() {
                    clearChecked();
                });
                $btnLoadQ.on("click", function() {
                    var href = $("a:has(>img[src*='images/buttons/reply.gif'])")[0].href, v = editorQuick.val();
                    editorQuick.val("Đang xử lý..." + v);
                    $.ajax({
                        url: href,
                        success: function(html) {
                            html = removeImageAjax(html);
                            var text = $(html).find("#vB_Editor_001_textarea").val();
                            editorQuick.val(text + v);
                        },
                        error: function() {
                            editorQuick.val(v);
                        },
                        complete: function() {
                            editorQuick.focus();
                        }
                    });
                });
                $btnLoadQ.hover(function() {
                    loadQ_tooltip.fadeIn();
                }, function() {
                    loadQ_tooltip.hide();
                });
                $("a[id^='qr_']").on("click", function(event) {
                    var href = $(this).attr('href'), v = editorQuick.val();
                    editorQuick.val("Đang xử lý..." + v);
                    $.ajax({
                        url: href,
                        success: function(html) {
                            html = removeImageAjax(html);
                            var text = $(html).find("#vB_Editor_001_textarea").val();
                            editorQuick.val(text + v);
                        },
                        error: function() {
                            editorQuick.val(v);
                        }
                    });
                });
                $("#qrform").submit(function(event) {
                    if (editorQuick.val().length >= 10) clearChecked();
                    return true;
                });
            }
        };
    }
    function RainbowText(rainbowSaved, type) {
        $("#rainbow_choices").prop("disabled", false);
        type = (typeof type !== 'undefined') ? type : 'quick';
        var random_char = [], random_length = 0;
        var $Toolbar, btnRainbow, btnUnRainbow, editor;
        function rgbToHex(R, G, B) {
            return toHex(R) + toHex(G) + toHex(B);
        }
        function toHex(n) {
            n = parseInt(n, 10);
            if (isNaN(n)) return "00";
            n = Math.max(0, Math.min(n, 255));
            return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
        }
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        function randomize_colors(input_text_length) {
            for (var a = 0; a < input_text_length; a += 1) {
                random_char[a] = rgbToHex(getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255));
            }
            random_length = input_text_length;
        }
        function unRainbow(input_text) {
            return input_text.replace(/\[\/?((color(="?#.{6}"?)?)|[bB])\]/g, '');
        }
        return {
            run: function() {
                if (type === 'quick') {
                    editor = $("#vB_Editor_QR_textarea");
                    if ($(".controlbar.cmnw").length === 0) {
                        var editorWrap = editor.parents("#vB_Editor_QR").eq(0);
                        $Toolbar = $("<div class='controlbar cmnw'></div>");
                        editorWrap.append($Toolbar);
                    } else {
                        $Toolbar = $(".controlbar.cmnw");
                    }
                    btnRainbow = $('<a href="javascript:;" class="btn">Rainbow</a>');
                    btnUnRainbow = $('<a href="javascript:;" class="btn">UnRainbow</a>');
                    var Rainbow_tooltip = $('<div class="wrap_popover wrap_popover_rainbow"><div class=popover><h3 class=popover_title>Tạo Rainbow Text</h3><div class=popover_content><p>Bôi đen đoạn text và click nút Rainbow</p></div></div></div> ');
                    $(btnRainbow).hover(function() {
                        Rainbow_tooltip.fadeIn();
                    }, function() {
                        Rainbow_tooltip.hide();
                    });
                    $Toolbar.append(Rainbow_tooltip);

                } else if (type === 'full') {
                    editor = $("#vB_Editor_001_textarea");
                    $Toolbar = $("#vB_Editor_001_controls > table:last-child > tbody > tr");
                    $($Toolbar).append('<td><img src="images/editor/separator.gif" width="6" height="20" alt=""></td>');
                    btnRainbow = $('<td class="rainbow-full">Rainbow</td>');
                    btnUnRainbow = $('<td class="rainbow-full">UnRainbow</td>');
                }
                var input_text_backup = '';
                $(btnRainbow).on('click', function(event) {
                    var i = 0, a = 0, ccol,
                        str_bbcode = '', str_html = '',
                        input_text, selection = $(editor).selection();
                    if (selection === '') {
                        alert('Chưa bôi đen đoạn text!');
                        $(editor).select();
                        return;
                    }
                    if (input_text_backup === unRainbow(selection)) {
                        input_text = input_text_backup;
                    } else {
                        input_text = input_text_backup = selection;
                    }
                    if (rainbowSaved === 'Rainbow') {
                        var s = 1 / 6, p;
                        for (a = 0; a < input_text.length; a++) {
                            i = a / input_text.length;
                            p = (i % s) / s;
                            if (i >= s * 0) ccol = rgbToHex(204, 204 * p, 0);
                            if (i >= s * 1) ccol = rgbToHex(204 * (1 - p), 204, 0);
                            if (i >= s * 2) ccol = rgbToHex(0, 204, 204 * p);
                            if (i >= s * 3) ccol = rgbToHex(0, 204 * (1 - p), 204);
                            if (i >= s * 4) ccol = rgbToHex(255 * p, 0, 255);
                            if (i >= s * 5) ccol = rgbToHex(255, 0, 255 * (1 - p));
                            if (input_text.charAt(a) == " ") {
                                str_html += " ";
                                str_bbcode += " ";
                            } else {
                                str_html += "<font color='#" + ccol + "'>" + input_text.charAt(a) + "</font>";
                                str_bbcode += '[color=#' + ccol + ']' + input_text.charAt(a) + "[/color]";
                            }
                        }
                    }
                    else if (rainbowSaved == 'Word by word') {
                        randomize_colors(input_text.length);
                        for (a = 0; a <= input_text.length; a++) {
                            ccol = random_char[i];
                            if (input_text.charAt(a) == " ") i++;
                            if (a >= random_length) {
                                str_html += input_text.charAt(a);
                                str_bbcode += input_text.charAt(a);
                            } else {
                                if ((a === 0 || input_text.charAt(a - 1) == " ") && a === input_text.length - 1) {
                                    str_html += "<font color='#" + ccol + "'>" + input_text.charAt(a) + "</font>";
                                    str_bbcode += '[color=#' + ccol + ']' + input_text.charAt(a) + '[/color]';
                                } else if (a === 0 || input_text.charAt(a - 1) == " ") {
                                    str_html += "<font color='#" + ccol + "'>" + input_text.charAt(a);
                                    str_bbcode += '[color=#' + ccol + ']' + input_text.charAt(a);
                                } else if (a === input_text.length - 1 || input_text.charAt(a) == " ") {
                                    str_html += input_text.charAt(a) + "</font>";
                                    str_bbcode += input_text.charAt(a) + '[/color]';
                                } else {
                                    str_html += input_text.charAt(a);
                                    str_bbcode += input_text.charAt(a);
                                }
                            }
                        }
                    }
                    $("#rainbow-preview").html('<b>' + str_html + '</b>');
                    $(editor).selection('replace', {text: '[B]' + str_bbcode + '[/B]'});
                });
                $(btnUnRainbow).on('click', function(event) {
                    $(editor).val(unRainbow($(editor).val()));
                });
                $($Toolbar).append(btnRainbow);
                $($Toolbar).append(btnUnRainbow);
                $(".vBulletin_editor").prepend('<div id="rainbow-preview"></div>');
            }
        };
    }
    function show_others_link() {
        var f17 = '<div class="navbar"><a href="forumdisplay.php?f=4"><strong>U Gờ™</strong></a> (Quick link XamlVL Love)</div><div class="navbar"><a href="forumdisplay.php?f=3"><strong>Cục chăn nuôi™</strong></a> (Quick link XamVL Love)</div>';
        $(".page > div > table:first-of-type").before(f17);
    }

    /*
    Main
     */
    var contentBar, settingsHTML, settings_VM, resize_choices, resize_choices_VM, rainbow_choices, rainbow_choices_VM;
    contentBar = new ContentBar();
    contentBar.run();
    (function() {
        settingsHTML = $('<div id="SettingsList" data-bind="foreach: settings_options"><div class="settings_option data-item"><strong><span class="settingContent" data-bind="html: name"></span></strong><input class="setting_bar_input" type="checkbox" data-bind="attr: {id: id, value: id}, checked: $root.check, click: $root.click" /></div></div>');
        settingsHTML.appendTo("#wrap_SettingsList");
        settings_VM = {
            settings_options: [{"id": "settings_option_st", "name": "Theo dõi các thread được subscribed (≤ 20)"}, {"id": "settings_option_qn", "name": "Nhận thông báo khi post được quote"}, {"id": "settings_option_sl", "name": "Smile list (Hiện tất cả icon smile của XamVL)"}, {"id": "settings_option_qq", "name": "Quote nhanh 1 hay nhiều post"}, {"id": "settings_option_fpp", "name": "Nút 'Capture' để chụp nhanh 1 post"}, {"id": "settings_option_qil", "name": "Hiện link ignore khi click vào username"}, {"id": "settings_option_np", "name": "Chuyển nút 'Go to new post' về cuối (forumdisplay)"}, {"id": "settings_option_rs", "name": "Size ảnh sau khi resize (lazy load) <span id='wrap_resize_choices' data-bind='stopBinding: true'></span>"}, {"id": "settings_option_hs", "name": "Chỉ hiện thanh setting khi rê chuột vào"}, {"id": "settings_option_da", "name": "Enable autoplay và loop video HTML5"}, {"id": "settings_option_rb", "name": "Tạo chữ với hiệu ứng Rainbow <span id='wrap_rainbow_choices' data-bind='stopBinding: true'></span>"}, {"id": "settings_option_bb", "name": "Banh bím<span id='settings_option_bb_img' class='inlineimg'></span>"}],
            check: ko.observableArray(settings_list),
            click: function(data, event) {
                myLocalStorage.set("settings", JSON.stringify(settings_list));
                if (data.id == "settings_option_rs") {
                    if (isInArray("settings_option_rs", settings_list)) $("#resize_choices").prop("disabled", false);
                    else $("#resize_choices").prop("disabled", true);
                } else if (data.id == "settings_option_rb") {
                    if (isInArray("settings_option_rb", settings_list)) $("#rainbow_choices").prop("disabled", false);
                    else $("#rainbow_choices").prop("disabled", true);
                }
                return true;
            }
        };
        ko.applyBindings(settings_VM, settingsHTML[0]);
        resize_choices = $('<select id="resize_choices" data-bind="options: choices, value: selectedChoice" disabled="disabled"></select>');
        resize_choices.appendTo('#wrap_resize_choices');
        resize_choices_VM = {
            choices: ["Full", "853", "1066", "1280"],
            selectedChoice: ko.observable(maxwidthSaved)
        };
        resize_choices_VM.selectedChoice.subscribe(function(newValue) {
            myLocalStorage.set("maxwidthSaved", newValue);
        });
        ko.applyBindings(resize_choices_VM, resize_choices[0]);

        rainbow_choices = $('<select id="rainbow_choices" data-bind="options: choices, value: selectedChoice" disabled="disabled"></select>');
        rainbow_choices.appendTo('#wrap_rainbow_choices');
        rainbow_choices_VM = {
            choices: ["Rainbow", "Word by word"],
            selectedChoice: ko.observable(rainbowSaved)
        };
        rainbow_choices_VM.selectedChoice.subscribe(function(newValue) {
            myLocalStorage.set("rainbowSaved", newValue);
        });
        ko.applyBindings(rainbow_choices_VM, rainbow_choices[0]);

        //$("#settings_option_help").remove();
        // $("#download_help").on("click", function(e) {
        //     e.preventDefault();
        //     location.href = "https://drive.google.com/uc?export=download&id=0BwL8ZS9stSPIRDVoTXZ0T0tnMk0";
        // });

        var main = function(callback) {
            if (/\/showthread\.php/.test(location.href)) {
                //show_f17_link();
                show_others_link();
                $("#vB_Editor_QR_textarea").waitUntilExists(function() {
                    callback(false);
                    if (isInArray("settings_option_rs", settings_list)) {
                        MaxWidthResizeImage(maxwidthSaved);
                        var imagesOnPost = $("img[onload^='Ncode']");
                        imagesOnPost.each(function() {
                            var src = $(this).attr("src");
                            $(this).removeAttr("src");
                            $(this).attr("data-original", src);
                            $(this).wrap("<a href='" + src + "' target='_blank'></a>");
                        });
                        imagesOnPost.lazyload({
                            skip_invisible : false,
                            threshold : 200,
                            effect: "fadeIn"
                        });
                    }

                    if (isInArray("settings_option_sl", settings_list)) {
                        var emo = new Emo(myLocalStorage);
                        emo.run();
                    }
                    if (isInArray("settings_option_qq", settings_list)) {
                        var loadquickquote = new LoadQuickQuote();
                        loadquickquote.run();
                    }
                    if (isInArray("settings_option_rb", settings_list)) {
                        var rainbow = new RainbowText(rainbowSaved);
                        rainbow.run();
                    }
                    DetectImage();
                    if (isInArray("settings_option_fpp", settings_list)) Capture();
                    if (isInArray("settings_option_qil", settings_list)) AddToIgnore();
                }, true);
                return;
            }
            if (/\/showpost\.php/.test(location.href)) {
                $("td[id^='td_post_']").waitUntilExists(function() {
                    if (isInArray("settings_option_rs", settings_list)) MaxWidthResizeImage(maxwidthSaved);
                    DetectImage();
                    if (isInArray("settings_option_fpp", settings_list)) Capture();
                    if (isInArray("settings_option_qil", settings_list)) AddToIgnore();
                }, true);
            } else if (/^http:\/\/xamvl\.com\/forumdisplay\.php.*$/.test(location.href)) {
                if (isInArray("settings_option_np", settings_list)) GoToNewPostLast();
            } else if (/^http:\/\/xamvl\.com\/(newreply|editpost|newthread|private\.php\?do).*$/.test(location.href)) {
                $(".vBulletin_editor").waitUntilExists(function() {
                    if (isInArray("settings_option_sl", settings_list)) {
                        var emo = new Emo(myLocalStorage);
                        emo.run();
                    }
                    if (isInArray("settings_option_rb", settings_list)) {
                        var rainbow = new RainbowText(rainbowSaved, 'full');
                        rainbow.run();
                    }
                    DetectImage();
                }, true);
            }
            callback();
        };
        var all_page = function(f17_flag) {
            f17_flag = typeof f17_flag === 'undefined' ? true : f17_flag;
            //if (f17_flag) show_f17_link();
            if (f17_flag) show_others_link();
            if (st || qn) {
                loadExternalScript('function log_out(){return true}');
                $("a[href^='login.php?do=logout']").on('click', function() {
                    var A = document.getElementsByTagName('html')[0];
                    A.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)';
                    if (confirm('Thím có chắc là muốn lóc ao không?')) $.removeCookie('isLogin');
                    else {
                        A.style.filter = '';
                        return false;
                    }
                });
                if (st) {
                    var followthread = new FollowThread();
                    followthread.init();
                    followthread.run();
                }
                if (qn) {
                    var quotenoti = new QuoteNoti();
                    quotenoti.init();
                    quotenoti.run();
                }
            }
            var new_featured = "XamlVL Love Update:\n- Cải thiện nhận thông báo quote.\n- Nếu username của bạn có khoảng trắng, có kí tự đặc biệt hoặc ngắn dưới 5 kí tự thì mỗi post bạn comment sẽ được thêm 1 đoạn userid (#xxx...) để trợ giúp cho việc tìm quote chính xác.\n- Mới chạy lại code khác nên mới update có thể sẽ xuất hiện mấy quote cũ nhé, sau đó sẽ bình thường lại.",
                featured = $.cookie('XamVLLove_newfeatured');
            if (_.isUndefined(featured)) {
                alert(new_featured);
            } else {
                if (featured != new_featured) {
                    alert(new_featured);
                }
            }
            $.cookie('XamVLLove_newfeatured', new_featured, { expires: 365 });
        };
        main(all_page);
    })();
});