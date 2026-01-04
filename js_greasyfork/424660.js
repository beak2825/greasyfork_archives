// ==UserScript==
// @name         Twitter Reply Count
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display the number of replies to tweets on Twitter
// @author       Dylan Baker <dylan@simulacrum.party>
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424660/Twitter%20Reply%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/424660/Twitter%20Reply%20Count.meta.js
// ==/UserScript==

let CSRF_TOKEN = null;
let BEARER_TOKEN = null;
let ready = false;

// Twitter sends a bunch of XHR requests when you open the page We can override
// XHR's setRequestHeader method to snoop on the auth tokens they're using so
// that we can use them for our own purposes.
XMLHttpRequest.prototype.originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
XMLHttpRequest.prototype.setRequestHeader = function () {
    if (arguments[0] === 'authorization') {
        BEARER_TOKEN = arguments[1];
        ready = true;
    } else if (arguments[0] === 'x-csrf-token') {
        CSRF_TOKEN = arguments[1];
        ready = true;
    }
    this.originalSetRequestHeader(...arguments);
};

// We'll also override pushState so that we can detect navigation and refire the
// reply count fetcher as you click around to different tweets
window.history.realPushState = window.history.pushState;
window.history.pushState = function () {
    const event = new Event('pushState');
    window.dispatchEvent(event);
    return window.history.realPushState(...arguments);
}

window.addEventListener('pushState', function (e) {
    fetchReplyCount();
});

const interval = setInterval(() => {
    const url = window.location.href;

    if (ready) {
        if (window.location.href.match('https://twitter.com/.*/status/[0-9]+')) {
            fetchReplyCount();
        }

        clearInterval(interval);
    }
}, 100);

const fetchReplyCount = async () => {
    const url = window.location.href;
    if (!url.match('https://twitter.com/.*/status/[0-9]+')) return;

    const urlSegments = url.split('/');
    const id = urlSegments[urlSegments.length - 1];

    const resp = await fetch(`https://twitter.com/i/api/2/timeline/conversation/${id}.json?include_reply_count=1`, {
        "credentials": "include",
        "headers": {
            "x-twitter-auth-type": "OAuth2Session",
            "x-twitter-client-language": "en",
            "x-twitter-active-user": "yes",
            "x-csrf-token": CSRF_TOKEN,
            "authorization": BEARER_TOKEN
        },
        "method": "GET",
        "mode": "cors"
    });

    const data = await resp.json();
    const tweet = data.globalObjects.tweets[id];
    const replyCount = tweet.reply_count;

    setTimeout(() => {
        // this is the `x Likes y Retweets` bar
        const container = document.querySelector('.css-1dbjc4n.r-1kfrmmb.r-1efd50x.r-5kkj8d.r-13awgt0.r-18u37iz.r-tzz3ar.r-s1qlax.r-1yzf0co');

        // The container just doesn't exist sometimes, probably because of that
        // ridiculous gibberish selector. If it doesn't exist, wait a bit and try
        // again
        if (!container) {
            return setTimeout(fetchReplyCount, 500);
        }

        const newElement = document.createElement('div');

        newElement.classList = 'css-1dbjc4n r-1mf7evn';
        newElement.style.marginRight = '20px';

        // I really did try to make this prettier but Twitter really wants to
        // literally render any whitespace so it was easier to do it like this
        newElement.innerHTML = `<div class="css-1dbjc4n"><a href="#" dir="auto" role="link" style="cursor: auto" class="css-4rbku5 css-18t94o4 css-901oao r-jwli3a r-1loqt21 r-1qd0xha r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"><div class="css-1dbjc4n r-xoduu5 r-1udh08x"><span class="css-901oao css-16my406 r-poiln3 r-b88u0q r-bcqeeo r-d3hbe1 r-qvutc0" style="transition-duration: 0.3s; transition-property: transform;"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">${replyCount}</span></span></div> <span class="css-901oao css-16my406 r-111h2gw r-poiln3 r-bcqeeo r-qvutc0"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Replies</span></span></a></div>`;

        container.prepend(newElement)
    }, 500);
};