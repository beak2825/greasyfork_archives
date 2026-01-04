// ==UserScript==
// @name Open-Source Alternative Redirector (no Search Engine Redirect)
// @namespace -
// @version 1.0.0
// @description Redirects you from some proprietary web-services to ethical alternatives(front-end). This is NotYou's script without redirecting from Google, Yahoo and Bing. Also I have changed the invidious instance.
// @author minhtienth15
// @include *youtube.com/*
// @include *reddit.com/*
// @include *twitter.com/*
// @include *instagram.com/*
// @include *wikipedia.org/*
// @include *medium.com/*
// @include *i.imgur.com/*
// @include *i.stack.imgur.com/*
// @include *odysee.com/*
// @include *tiktok.com/*
// @run-at document-start
// @license GPL-3.0-or-later
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/446753/Open-Source%20Alternative%20Redirector%20%28no%20Search%20Engine%20Redirect%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446753/Open-Source%20Alternative%20Redirector%20%28no%20Search%20Engine%20Redirect%29.meta.js
// ==/UserScript==

/*

*/

var url = new URL(location.href),

// INSTANCES //
invidious = 'invidious.snopyta.org',
libreddit = 'reddit.invak.id',
nitter = 'nitter.snopyta.org',
bibliogram = 'bibliogram.pussthecat.org',
wikiless = 'wikiless.org',
lingva = 'lingva.ml',
scribe = 'scribe.rip',
rimgo = 'rimgo.pussthecat.org',
librarian = 'librarian.pussthecat.org',
proxitok = 'proxitok.herokuapp.com'

// YouTube | Invidious //
if(location.host.indexOf('youtube.com') != -1){
    location.replace('https://' + invidious + location.pathname + location.search)
}

// Reddit | Libreddit //
if(location.host.indexOf('reddit.com') != -1){
    location.replace('https://' + libreddit + location.pathname + location.search)
}

// Twitter | Nitter //
if(location.host.indexOf('twitter.com') != -1){
    location.replace('https://' + nitter + location.pathname + location.search)
}

// Instagram | Bibliogram //
if(location.host.indexOf('instagram.com') != -1){
    if(location.pathname === '/accounts/login/') {
        let path = '/u' + location.search.split('?next=').at(1)
        location.replace('https://' + bibliogram + path)
    } else {
        location.replace('https://' + bibliogram + location.pathname + location.search)
    }
}

// Wikipedia | Wikiless //
if(location.host.indexOf('wikipedia.org') != -1){
    location.replace('https://' + wikiless + location.pathname + '?lang=' + url.hostname.split('.')[0])
}

// Medium | Scribe //
if(location.host.indexOf('medium.com') != -1){
    location.replace('https://' + scribe + location.pathname + location.search)
}

// i.Imgur | Rimgo //
if(location.host.indexOf('i.imgur.com') != -1){
    location.replace('https://' + rimgo + location.pathname + location.search)
}

// Odysee | Librarinan //
if(location.host.indexOf('odysee.com') != -1){
    location.replace('https://' + librarian + location.pathname + location.search)
}

// TikTok | ProxiTok //
if(location.host.indexOf('tiktok.com') != -1||location.host.indexOf('www.tiktok.com') != -1){
    location.replace('https://' + proxitok + location.pathname + location.search)
}
























