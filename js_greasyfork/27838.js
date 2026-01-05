// ==UserScript==
// @name          Anonkun Bug Fixes
// @namespace     Terrec
// @description   Fixes a few bugs
// @match         *://*.anonkun.com/*
// @match         *://*.fiction.live/*
// @version       1
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/27838/Anonkun%20Bug%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/27838/Anonkun%20Bug%20Fixes.meta.js
// ==/UserScript==

//callback for chatScrollFixes
function wheelCallback(e){
    var t = e.originalEvent.deltaY;
    if(e.originalEvent.deltaMode != 0)
        t *= 40;
    e.preventDefault();
    $(this).scrollTop(t + $(this).scrollTop());
}

//Fixes scrolling on macbook trackpads (and maybe on other things, too)
chatScrollFix();

function chatScrollFix(){
    ty.chat.directive("chat", function() {
        return {
            link: 
            function(e, n, i) {
                var r = n.find(".chatLog");
                i.scrollLock && r.bind('wheel', wheelCallback);
            }
        }
    });
    
    ty.threads.directive("threads", function() {
        return {
            link: 
            function(e, n, i) {
                var r = n.find(".chatLog");
                i.scrollLock && r.bind('wheel', wheelCallback);
            }
        }
    });
    
    ty.chat.directive("chatAutoScrollForChild", function() {
        return {
            link: 
            function(t, e, n) {
                $(e).bind("wheel", wheelCallback);
            }
        }
    });
    
}

//Keeps chat from autoscrolling if mouse is over it so stuff you're reading isn't moved out of view by new comments
//Disabled by default, because you people are here for fixes. Uncomment following line to enable.
//autoScrollTweak();

function autoScrollTweak(){
    ty.chat.directive("autoScroll", function(){
        return {
            link:
            function(t, e, n) {
                var scrollTop = -1;
                t.$watch("chatLog", function(n){
                    var i = e[0].scrollHeight - e[0].scrollTop - e[0].clientHeight;
                    600 > i && (scrollTop = e[0].scrollTop);
                }, !0);
                t.$on("chatAutoScroll", function(){
                    if(e.is(":hover") && scrollTop > -1){
                        e[0].scrollTop = scrollTop;
                    }
                    scrollTop = -1;
                });
            }
        }
    });
}


//Fixes top menu. Seriously, Kas, what's taking you so long?
angular.module('tydai').run(function($templateCache) {
    var tmpl = "/tmpl/anonkun/board/list";
    var tmplString = $templateCache.get(tmpl);
    if(typeof tmplString == 'string'){
        $templateCache.put(tmpl, tmplString.replace(/(<\/div>)(<script>.*?<\/script>)$/,'$2$1'));
    }
    tmpl = '/tmpl/anonkun/frontpage';
    tmplString = $templateCache.get(tmpl);
    if(typeof tmplString == 'string'){
        $templateCache.put(tmpl, tmplString.replace(/(<\/div>)(<script>.*?<\/script>)$/,'$2$1'));
    }
});

//Fixes timers counting up when they expire. 
angular.module("timer", []).directive("timer", ["$timeout", "$compile", function(t, e) {
        return {
            restrict: "E",
            replace: !0,
            scope: {
                interval: "@interval",
                countdownattr: "@countdown"
            },
            template: '<div><span ng-if="days">{{days}} days </span><span ng-if="hours || days">{{hours}}:</span><span ng-if="minutes || hours || days">{{minutes}}:</span><span>{{seconds}}</span></div>',
            controller: ["$scope", "$element", function(n, i) {
                function r(t) {
                    n.countdown = n.countdownattr && parseInt(n.countdownattr, 10) > 0 ? parseInt(n.countdownattr, 10) : void 0
                }

                function o() {
                    n.timeoutId && t.cancel(n.timeoutId)
                }
                0 === i.html().trim().length && i.append(e("<span>{{millis}}</span>")(n)), n.$watch("countdownattr", function() {
                    r()
                }), n.startTime = null, n.timeoutId = null, r(), n.isRunning = !1, n.$on("timer-start", function() {
                    n.start()
                }), n.$on("timer-resume", function() {
                    n.resume()
                }), n.$on("timer-stop", function() {
                    n.stop()
                }), n.start = i[0].start = function() {
                    n.startTime = new Date, o(), a()
                }, n.resume = i[0].resume = function() {
                    o(), n.startTime = new Date - (n.stoppedTime - n.startTime), a()
                }, n.stop = i[0].stop = function() {
                    n.stoppedTime = new Date, t.cancel(n.timeoutId), n.timeoutId = null
                }, i.bind("$destroy", function() {
                    t.cancel(n.timeoutId)
                }), n.$on("$destroy", function(){
                    t.cancel(n.timeoutID)
                });
                var a = function() {
                    n.countdown--, n.millis = new Date - n.startTime, n.countdown > -1 && (n.millis = 1e3 * n.countdown), n.seconds = Math.floor(n.millis / 1e3 % 60), n.minutes = Math.floor(n.millis / 6e4 % 60), n.hours = Math.floor(n.millis / 36e5 % 24), n.days = Math.floor(n.millis / 864e5), n.timeoutId = t(function() {
                        a()
                    }, parseInt(n.interval, 10)), n.$emit("timer-tick", {
                        timeoutId: n.timeoutId,
                        millis: n.millis
                    }), n.countdown <= 0 && i.closest('[ng-if="nextLiveSeconds()"]').remove() && n.stop();
                };
                n.start()
            }]
        }
}]);

//Fixes times showing as 0 AM instead of 12 AM and 12 AM instead of 12 PM
angular.module("timepicker", []).directive("timepicker", function() {
    return {
        controller: ["$scope", "$rootScope", function(t, e) {}],
        link: function(t, e, n, i, r) {
            var o = function() {
                var t = (new Date).getHours(),
                    e = (new Date).getMinutes(),
                    n = t >= 12 ? "PM" : "AM";
                t = t % 12 || 12;
                return t + ":" + e + n
            },
            a = {
                scrollDefaultNow: !0,
                showDuration: !0,
                minTime: o(),
                forceRoundTime: !1
            };
            e.timepicker(a)
        }
    }
});
//Ditto
ty.formatTime = function(t, e) {
    var n = new Date(t),
        i = n.getDate(),
        r = n.getHours(),
        o = n.getFullYear(),
        a = n.getMinutes(),
        s = "AM",
        l = [];
    return l[0] = "Jan", l[1] = "Feb", l[2] = "Mar", l[3] = "Apr", l[4] = "May", l[5] = "June", l[6] = "July", l[7] = "Aug", l[8] = "Sept", l[9] = "Oct", l[10] = "Nov", l[11] = "Dec", r >= 12 && (s = "PM"), r = r % 12 || 12, 10 > a && (a = "0" + a), e ? r + ":" + a + " " + s : l[n.getMonth()] + "  " + i + ",  " + o + " " + r + ":" + a + " " + s
};

//Fixes archives/topics breaking under certain (thankfully rare) circumstances. Seriously.
Boolean.prototype.substring = String.prototype.substring;