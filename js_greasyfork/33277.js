// ==UserScript==
// @name         Uncensored bitcoin url link fixer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  make link-like things actually links.
// @author       It's not lupus. Go away.
// @match        https://www.reddit.com/r/noncensored_bitcoin/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/findAndReplaceDOMText/0.4.5/findAndReplaceDOMText.min.js
// @downloadURL https://update.greasyfork.org/scripts/33277/Uncensored%20bitcoin%20url%20link%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/33277/Uncensored%20bitcoin%20url%20link%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var subs = [
        "bitcoin", "btc", "cryptocurrency", // currently active on subreddit
        "bitcoinmarkets", "buttcoin", "ethereum", // not active, but it ain't hurting nobody
        "ethtrader", "bitcoin_uncensored", "bitcoinall",
        "bitcoin_unlimited", "bitcoinbeginners", "bitcoincash",
        "coinbase", "bitcoinmining", "jobs4bitcoin", "openbazaar",
        "bitmarket", "blockstreams", "bitcoinxt", "mtgoxinsolvency",
        "bitcoinserious", "bitcoinnews", "kraken", "redditnotes" ]; // digging deep

    var findRegexp = new RegExp("(?:(?:[a-z]+\.)?reddit\.com)?\\/r\\/ ("+subs.join("|")+")\\S+", "gi");
    var replaceRegexp = new RegExp("r\\/ ("+subs.join("|")+")", "i");

    var fixLinks = _.debounce(function() {
        // regexps are fuzzy. this will probably work, until it doesn't. adjust as needed.
        // this is hardcoded to only work with "/r/ Bitcoin" links. revisit if it needs to match more.
        findAndReplaceDOMText(document.body, {
            find: findRegexp,
            replace: function(portion, matches) {
                var link = matches[0].replace(/^(?:[a-z]+\.)?reddit\.com/i,'').replace(replaceRegexp, 'r\/$1');
                return $("<A>").attr("href", link).text(link)[0];
            }
        });
        // let's make reddit usernames into links too.
        findAndReplaceDOMText(document.body, {
            find: /((?:post|comment) by )(\S+)/gi,
            replace: function (portion, matches) {
                if (portion.text != matches[0]) { // only replace full matches, or we'll end up replacing ourselves.
                    return portion.node.cloneNode();
                }
                var before = matches[1];
                var username = matches[2];
                return $("<span>").text(before).append($("<A>").attr("href", "/u/"+username).text(username))[0];
            }
        });
    }, 250);

    (new MutationObserver(fixLinks)).observe(document.body, {
        childList: true,
        subTree: true
    });
    fixLinks();
})();