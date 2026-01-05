// ==UserScript==
// @name        M4V Script
// @namespace   https://m4v.me/748
// @description Extend all emoticons to quick reply form, quick quote(s), quick capture post, max zoom, custom resize image
// @author      theheroofvn
// @include     https://m4v.me/*
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
// @version     7.1.7
// @icon        https://m4v.me/favicon.ico
// @credit      http://m4v.me/p_titsilveral1479/262598
// @downloadURL https://update.greasyfork.org/scripts/14507/M4V%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/14507/M4V%20Script.meta.js
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
                    console.log("#Tit: Đăng nhập đã mẹ ơi ._.");
                    $(".tborder:has(input[name='vb_login_username'])").before("<div id='nologin-message'>#Tit: Chưa đăng nhập thì xài không có được -___-</div>");
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
function MaxZoom() {
    GM_addStyle('.page{width:100%!important;max-width:none}.plk_smilebox.quick{height:130px!important}');
}
var myLocalStorage, get_settings, settings_list, maxwidthSaved, window_width, rainbowSaved;
myLocalStorage = new localStorage_bg();
get_settings = myLocalStorage.get("settings");
if (!get_settings) {
    settings_list = [];
    myLocalStorage.set("settings", JSON.stringify(settings_list));
} else settings_list = JSON.parse(get_settings);
if (isInArray("settings_option_bb", settings_list)) MaxZoom();
maxwidthSaved = myLocalStorage.get("maxwidthSaved");
window_width = $(window).width() - 56;
if (!maxwidthSaved) maxwidthSaved = "853";
rainbowSaved = myLocalStorage.get("rainbowSaved");
if (!rainbowSaved) rainbowSaved = "Rainbow";
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
    function MaxWidthResizeImage(maxwidthSaved) {
        $("#resize_choices").prop("disabled", false);
        var handler = function(maxwidth) {
            return "NcodeImageResizer.MAXWIDTH = " + maxwidth + ";";
        };
        if (maxwidthSaved == "Full") {
            GM_addStyle('.voz-post-message > img{max-width:' + window_width + 'px;height:auto;}');
            loadExternalScript(handler(window_width));
        } else {
            GM_addStyle('.voz-post-message > img{max-width:' + maxwidthSaved + 'px;height:auto;}');
            loadExternalScript(handler(parseInt(maxwidthSaved)));
        }
    }
    function DetectImage() {
        var detect_link = /(?=[^ ])(h *t *t *p *: *\/ *\/ *)?(([a-zA-Z0-9-\.]+\.)?[a-zA-Z0-9-]{3,}\.(com|net|org|us|ru|info|vn|gl|ly|com\.vn|net\.vn|gov\.vn|edu|edu\.vn)(\/)?([^\s\[]+)?)(?=\s|$|\[)/gi;
        $("[id^='post_message_']").each(function() {
            var node, nodes, replaceTextWithLink, i, len;
            nodes = $(this).contents();
            replaceTextWithLink = function(node) {
                if (detect_link.test($(node).text())) {
                    var replacement = $(node).text().replace(detect_link, "<a data-type='linkdetected' href='https://$2' target='_blank'>$2</a>");
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
    }
    function Emo(xlocalStorage) {
        var EmoStorage = xlocalStorage;
        function smilieList() {
            varlist = [{text:":adore:",src:"/images/smileys/user/big/adore.png",stt:1},{text:":after_boom:",src:"/images/smileys/user/big/after_boom.png",stt:2},{text:":ah:",src:"/images/smileys/user/big/ah.png",stt:3},{text:":amazed:",src:"/images/smileys/user/big/amazed.png",stt:4},{text:":angry:",src:"/images/smileys/user/big/angry.png",stt:5},{text:":bad_smelly:",src:"/images/smileys/user/big/bad_smelly.png",stt:6},{text:":baffle:",src:"/images/smileys/user/big/baffle.png",stt:7},{text:":beat_brick:",src:"/images/smileys/user/big/beat_brick.png",stt:8},{text:":beat_plaster:",src:"/images/smileys/user/big/beat_plaster.png",stt:9},{text:":beat_shot:",src:"/images/smileys/user/big/beat_shot.png",stt:10},{text:":beated:",src:"/images/smileys/user/big/beated.png",stt:11},{text:":beauty:",src:"/images/smileys/user/big/beauty.png",stt:12},{text:":big_smile:",src:"/images/smileys/user/big/big_smile.png",stt:13},{text:":boss:",src:"/images/smileys/user/big/boss.png",stt:14},{text:":burn_joss_stick:",src:"/images/smileys/user/big/burn_joss_stick.png",stt:15},{text:":byebye:",src:"/images/smileys/user/big/byebye.png",stt:16},{text:":canny:",src:"/images/smileys/user/big/canny.png",stt:17},{text:":choler:",src:"/images/smileys/user/big/choler.png",stt:18},{text:":cold:",src:"/images/smileys/user/big/cold.png",stt:19},{text:":confident:",src:"/images/smileys/user/big/confident.png",stt:20},{text:"confuse",src:"/images/smileys/user/big/confuse.png",stt:21},{text:":cool:",src:"/images/smileys/user/big/cool.png",stt:22},{text:":cry",src:"/images/smileys/user/big/cry.png",stt:23},{text:":doubt:",src:"/images/smileys/user/big/doubt.png",stt:24},{text:":dribble:",src:"/images/smileys/user/big/dribble.png",stt:25},{text:':embarrassed:',src:"/images/smileys/user/big/embarrassed.png",stt:26},{text:":extreme_sexy_girl:",src:"/images/smileys/user/big/extreme_sexy_girl.png",stt:27},{text:":feel_good:",src:"/images/smileys/user/big/feel_good.png",stt:28},{text:":go:",src:"/images/smileys/user/big/go.png",stt:29},{text:":haha:",src:"/images/smileys/user/big/haha.png",stt:30},{text:":hell_boy:",src:"/images/smileys/user/big/hell_boy.png",stt:31},{text:":hungry:",src:"/images/smileys/user/big/hungry.png",stt:32},{text:":look_down:",src:"/images/smileys/user/big/look_down.png",stt:33},{text:":matrix:",src:"/images/smileys/user/big/matrix.png",stt:34},{text:":misdoubt:",src:"/images/smileys/user/big/misdoubt.png",stt:35},{text:":nosebleed:",src:"/images/smileys/user/big/nosebleed.png",stt:36},{text:":oh:",src:"/images/smileys/user/big/oh.png",stt:37},{text:":ops:",src:"/images/smileys/user/big/ops.png",stt:38},{text:":pudency:",src:"/images/smileys/user/big/pudency.png",stt:39},{text:":sad:",src:"/images/smileys/user/big/sad.png",stt:40},{text:":sexy_girl:",src:"/images/smileys/user/big/sexy_girl.png",stt:41},{text:":smile:",src:"/images/smileys/user/big/smile.png",stt:42},{text:":spiderman:",src:"/images/smileys/user/big/spiderman.png",stt:43},{text:":still_dreaming:",src:"/images/smileys/user/big/still_dreaming.png",stt:44},{text:":sure:",src:"/images/smileys/user/big/sure.png",stt:45},{text:":surrender:",src:"/images/smileys/user/big/surrender.png",stt:46},{text:":sweat:",src:"/images/smileys/user/big/sweat.png",stt:47},{text:":sweet_kiss:",src:"/images/smileys/user/big/sweet_kiss.png",stt:48},{text:":tire:",src:"/images/smileys/user/big/tire.png",stt:49},{text:":too_sad:",src:"/images/smileys/user/big/too_sad.png",stt:50},{text:":waaaht:",src:"/images/smileys/user/big/waaaht.png",stt:51},{text:":what:",src:"/images/smileys/user/big/what.png",stt:52}];
            for (var i = 0; i < list.length; i++) {
                var smilie = list[i];
                if (smilie.src.indexOf("https") === 0) continue;
                if (smilie.src.charAt(0) != "/") {
                    smilie.src = "/" + smilie.src;
                }
                smilie.src = "https://m4v.me" + smilie.src;
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
            $("[src='https://vozforums.com/images/buttons/multiquote_on.gif']").attr("src", "https://vozforums.com/images/buttons/multiquote_off.gif");
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
                loadQ_tooltip = $("<div class='wrap_popover'><div class='popover'><h3 class='popover_title'>Chèn các trích dẫn đã đánh dấu</h3><div class='popover_content'><p>Để thực hiện trích dẫn nhiều bài cùng lúc: Click vào nút <img src='https://vozforums.com/images/buttons/multiquote_off.gif'/>" + " ở bên dưới-phải của mỗi bài viết cần trích dẫn.</p><p>Những bài viết nào đã được đánh dấu icon sẽ chuyển sang <img src='https://vozforums.com/images/buttons/multiquote_on.gif' /></p></div></div></div>");
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
    function show_f17_link() {
        var f17 = '<div class="navbar"><a href="748"><strong>M4V CENTRAIL</strong></a> </div><div class="navbar"><a href="p_titsilveral1479/262598"><strong>Đẹp trai thì mới có nhèo gái theo</strong></a> </div>';
        $(".page > div > table:first-of-type").before(f17);
        /*var bongda = '<div class="navbar"><a href="https://m4v.me/1074/forum/5725251/p/1"><strong>M4V TOÀN THƯ</strong></a> (Mọi thắc mắc chui vô đây)</div>';
        $(".page > div > table:first-of-type").before(bongda);*/
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
            settings_options: [{"id": "settings_option_sl", "name": "Smile List"}, {"id": "settings_option_qq", "name": "Fast Quote"}, {"id": "settings_option_fpp", "name": "Capture"}, {"id": "settings_option_rs", "name": "Auto resize picture  <span id='wrap_resize_choices' data-bind='stopBinding: true'></span>"}, {"id": "settings_option_rb", "name": "Rainbow Text <span id='wrap_rainbow_choices' data-bind='stopBinding: true'></span>"}, {"id": "settings_option_bb", "name": "Max Zoom<span id='settings_option_bb_img' class='inlineimg'></span>"}, {"id": "settings_option_help", "name": "<a href='javascript:;' title='Click to download' id='download_help'>Download file hướng dẫn chức năng</a>"}],
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

        $("#settings_option_help").remove();
        $("#download_help").on("click", function(e) {
            e.preventDefault();
            location.href = "http://upnhanh.mobi/get/05Hejo";
        });

        var main = function(callback) {
            if (/\/showthread\.php/.test(location.href)) {
                show_f17_link();
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
                }, true);
                return;
            }
            if (/\/showpost\.php/.test(location.href)) {
                $("td[id^='td_post_']").waitUntilExists(function() {
                    if (isInArray("settings_option_rs", settings_list)) MaxWidthResizeImage(maxwidthSaved);
                    DetectImage();
                    if (isInArray("settings_option_fpp", settings_list)) Capture();
                }, true);
            } else if (/^https:\/\/vozforums\.com\/(newreply|editpost|newthread|private\.php\?do).*$/.test(location.href)) {
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
            if (f17_flag) show_f17_link();
            var new_featured = "Hàng xách tay có sửa chữa từ các bô lão theheroofvn\n- Xin chân thành cảm ơn\n- #Tit-M4V",
                featured = $.cookie('VozLove_newfeatured');
            if (_.isUndefined(featured)) {
                alert(new_featured);
            } else {
                if (featured != new_featured) {
                    alert(new_featured);
                }
            }
            $.cookie('VozLove_newfeatured', new_featured, { expires: 365 });
        };
        main(all_page);
    })();
});
