// ==UserScript==
// @name        qwq
// @namespace   https://github.com/ppzvpp
// @description The most naughtiest qwq that you have never ever seen before.
// @include     *://twitter.com/*
// @include     *://weibo.com/*
// @include     *://*.weibo.com/*
// @version     1
// @grant       none
// @run-at      document-idle
// @icon        https://github.com/ppzvpp/Userscript-qwq/raw/master/icon.png
// @downloadURL https://update.greasyfork.org/scripts/34230/qwq.user.js
// @updateURL https://update.greasyfork.org/scripts/34230/qwq.meta.js
// ==/UserScript==


/**
 * Created by makito on 2017/9/5. https://github.com/SumiMakito/Chrome-qwq
 * Version https://github.com/SumiMakito/Chrome-qwq/commit/12f38bec1e37f27991533258fcce73247d31ee55
 * Ported to userscript by ppzvpp on 2017/10/17. https://github.com/ppzvpp/Userscript-qwq
 * Tested with Greasemonkey on Firefox
 */

var QWQ = "<span> qwq</span>";
var scheduled = false;
var currentSite = -1;
var TWITTER = 0;
var WEIBO = 1;
var initRetries = 0;

if (/(^.*\.weibo\.com$|^weibo\.com$)/g.exec(window.location.host) !== null) {
    currentSite = WEIBO;
} else if (/(^twitter\.com$)/g.exec(window.location.host) !== null) {
    currentSite = TWITTER;
}

function qwqize() {
    if (currentSite === TWITTER) {
        var elements_tweet_text = document.getElementsByClassName("tweet-text");
        for (var i = 0; i < elements_tweet_text.length; i++) {
            var el = elements_tweet_text[i];
            if (el.getAttribute("qwq") === "true" ||
                el.innerHTML.endsWith(QWQ)) {
                continue;
            }
            el.innerHTML += QWQ;
            el.setAttribute("qwq", "true");
        }
        scheduled = false;
    }
    else if (currentSite === WEIBO) {
        var elements = document.getElementsByClassName("WB_text");
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (el.getAttribute("qwq") === "true") continue;
            if (el.getAttribute("node-type") === "feed_list_content") {
                if (el.innerHTML.endsWith(QWQ)) {
                    continue;
                }
                el.innerHTML = el.innerHTML.replace(/([^q][^w][^q])(\/\/<a)/g, "$1qwq//<a"); // literally insert a qwq if the string doesn't end with qwq
                el.innerHTML = el.innerHTML.replace(/([a-zA-z])(qwq\/\/<a)/g, "$1&nbsp;$2"); // avoid qwq being connected with alphabetic string
                el.innerHTML += QWQ;
                el.setAttribute("qwq", "true");
            } else if (el.getAttribute("node-type") === "feed_list_reason") {
                el.innerHTML += QWQ;
                el.setAttribute("qwq", "true");
            }
        }
        var buttons = document.getElementsByClassName("W_btn_a");
        for (var i = 0; i < buttons.length; i++) {
            var el = buttons[i];
            if (el.getAttribute("qwq") === "true") continue;
            if (el.getAttribute("node-type") === "submit") {
                if (el.innerHTML.endsWith(QWQ)) {
                    continue;
                }
                el.innerText = "卖萌";
                el.setAttribute("qwq", "true");
            }
        }
        var pf_intro = document.getElementsByClassName("pf_intro");
        if (pf_intro !== null && pf_intro.length >= 1) {
            var intro = pf_intro[0];
            if (intro.getAttribute("qwq") !== "true"){
                intro.innerHTML += "<br>賣萌博主";
                intro.setAttribute("qwq", "true");
            }
        }
        scheduled = false;
    }
}

function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(qwqize, 2000);
}

function init() {
    var done = false;
    if (currentSite === TWITTER) {
        var stream = document.getElementsByClassName("stream");
        if (stream !== null && stream.length >= 1) {
            document.getElementsByClassName("stream")[0].addEventListener("DOMNodeInserted", schedule, false);
            document.getElementById("global-new-tweet-button").innerHTML = '<span class="text">卖萌</span>';
            done = true;
        }
    }
    else if (currentSite === WEIBO) {
        var homefeed = document.getElementById("v6_pl_content_homefeed");
        var profilefeed = document.getElementById("Pl_Official_MyProfileFeed__22");
        if (homefeed !== null) {
            homefeed.addEventListener("DOMNodeInserted", schedule, false);
            done = true;
        } else if (profilefeed !== null) {
            profilefeed.addEventListener("DOMNodeInserted", schedule, false);
            done = true;
        }
        document.body.addEventListener("DOMNodeInserted", schedule, false);
    }
    if (!done) {
        if (initRetries++ < 10) {
            setTimeout(init, 1000);
        }
    } else {
        qwqize();
    }
}

init();
