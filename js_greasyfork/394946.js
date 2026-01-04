// ==UserScript==
// @name        nhentai_endless
// @name:ja        nhentai_endless
// @name:zh-TW         nhentai_endless
// @name:zh-CN        nhentai_endless
// @namespace   nhentai_endless
// @supportURL  https://github.com/zhuzemin
// @description:zh-CN nhentai automate next page
// @description:zh-TW  nhentai automate next page
// @description:ja nhentai automate next page
// @description nhentai automate next page
// @include     https://nhentai.net/*
// @include     https://en.nyahentai3.com/*
// @include     https://zh.nyahentai.co/*
// @include     https://ja.nyahentai.net/*
// @include     https://zh.nyahentai.pro/*
// @include     https://ja.nyahentai.org/*
// @include     https://zh.nyahentai4.com/*
// @version     1.15
// @grant       GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @run-at      document-start
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @connect-src zh.nyahentai4.com
// @connect-src ja.nyahentai.org
// @connect-src zh.nyahentai.pro
// @connect-src ja.nyahentai.net
// @connect-src zh.nyahentai.co
// @connect-src en.nyahentai3.com
// @connect-src nhentai.net
// @connect-src nyahentai.org
// @downloadURL https://update.greasyfork.org/scripts/394946/nhentai_endless.user.js
// @updateURL https://update.greasyfork.org/scripts/394946/nhentai_endless.meta.js
// ==/UserScript==
var config = {
    'debug': false
}
var debug = config.debug ? console.log.bind(console)  : function () {
};

var interval;
var lastUrl;
var old_scrollY = 0;
var request_pct = 0.05; // percentage of window height left on document to request next page, value must be between 0-1

var scroll_events = 0;
var event_type = "scroll"; // or "wheel"

function onScroll(e) {
    var y = window.scrollY;
    // if (scroll_events === 0) old_scrollY = y; // stops only if scroll position was on 2. page
    var delta = e.deltaY || y - old_scrollY; // NOTE: e.deltaY for "wheel" event
    if (delta > 0 && (window.innerHeight + y) >= (document.body.clientHeight - (window.innerHeight * request_pct))) {
        debug("scroll end");
        window.removeEventListener(event_type, onScroll, false);

        try {
            requestNextPage();
        } catch (err) {
            debug(err.name + ": " + err.message);
            // NOTE: recovery unnecessary, input event handles it with reset on new search
        }
    }
    old_scrollY = y;
    scroll_events += 1;
}


class Content{
    constructor(href) {
        this.method = 'GET';
        this.url = href;
        this.headers = {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': window.location.href,
        };
        this.charset = 'text/plain;charset=utf8';
    }
}


function requestNextPage() {
    var nextUrl;
    var parentNode;
    if(/nhentai\.net/.test(window.location.href)){

        var nexts = document.querySelectorAll("a.next");
        var a = nexts[nexts.length - 1];
        debug("href: " + a.href);
        nextUrl=a.href;
        parentNode=document.body;
    }
    else{
        //in main page or search page
        if(!/https:\/\/[^\/]*\/g\/\d*\/list\/\d*\//.test(window.location.href)) {

            var nexts = document.querySelectorAll("span.next");
            var next = nexts[nexts.length - 1];
            var a = next.querySelector("a");
            debug("href: " + a.href);
            nextUrl=a.href;
            parentNode=document.body;
        }
        //in content page
        else
        {
            var nextBtnList = document.querySelectorAll('a.changeSrc.next');
            nextUrl = nextBtnList[nextBtnList.length - 1].href;
            parentNode=document.querySelector('#content');
        }

    }
    debug('lastUrl: '+lastUrl)
    debug('nextUrl: '+nextUrl)
    if(lastUrl!=nextUrl){
        var content = new Content(nextUrl);
        request(content,parentNode);
        lastUrl=nextUrl;
    }
    else {
        //clearInterval(interval);
    }

}

var init = function () {
    interval=setInterval(function(){
        window.addEventListener(event_type, onScroll, false);
        window.addEventListener("beforeunload", function () {
            window.scrollTo(0, 0);
        }, false);
    }, 3000);
}


function request(object,parentNode) {
    GM_xmlhttpRequest({
        method: object.method,
        url: object.url,
        headers: object.headers,
        overrideMimeType: object.charset,
        //synchronous: true
        onload: function (responseDetails) {
            debug(responseDetails);
            var html = new DOMParser().parseFromString(responseDetails.responseText, "text/html");
            //debug(galleryHtml);
            //Dowork
            var content;
            var nextElement=null;
            if(!/\/g\/\d*\/list\/\d*\//.test(responseDetails.finalUrl)){
                content = html.querySelector('#content');
                nextElement=parentNode.querySelector('#footer');

            }
            else{
                content=html.querySelector('#page-container');
            }
            parentNode.insertBefore(content,nextElement);
        }
    });
}


window.addEventListener('DOMContentLoaded', init);
