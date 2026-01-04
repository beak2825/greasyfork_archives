// ==UserScript==
// @name           nHentai English Filter (mobile friendly)
// @description    Adds quick English filter to nHentai pages.
// @author         longkidkoolstar
// @homepage       https://hen-tie.tumblr.com/
// @namespace      https://greasyfork.org/en/users/8336
// @icon           https://i.imgur.com/pGYy5SR.png
// @version        6.3
// @include        https://nhentai.net/parody/*
// @include        https://nhentai.net/favorites/*
// @include        https://nhentai.net/artist/*
// @include        https://nhentai.net/tag/*
// @include        https://nhentai.net/search/*
// @include        https://nhentai.net/group/*
// @include        https://nhentai.net/category/*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/494706/nHentai%20English%20Filter%20%28mobile%20friendly%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494706/nHentai%20English%20Filter%20%28mobile%20friendly%29.meta.js
// ==/UserScript==

var pathname = window.location.pathname;
var namespaceQuery = window.location.pathname.split('/')[2];
var searchQuery = window.location.search.split('=')[1] || '';
var namespaceSearchLink = '<div class="sort-type"><a href="https://nhentai.net/search/?q=' + namespaceQuery + '+English">English Only</a></div>';
var siteSearchLink = '<div class="sort-type"><a href="https://nhentai.net/search/?q=' + searchQuery + '+English">English Only</a></div>';
var favSearchBtn = '<a class="btn btn-primary" href="https://nhentai.net/favorites/?q=English+' + searchQuery + '"><i class="fa fa-flag"></i> ENG</a>';
var favPageBtn = '<a class="btn btn-primary" href="https://nhentai.net/favorites/?q=English+"><i class="fa fa-flag"></i> ENG</a>';

if (!/English/.test(searchQuery)) {
    if (/\/parody\//.test(pathname)) { // parody pages
        document.getElementsByClassName('sort')[0].innerHTML += namespaceSearchLink;
    } else if (/\/favorites\//.test(pathname)) { // favorites pages
        if (window.location.search.length) {
            document.getElementById('favorites-random-button').insertAdjacentHTML('afterend', favSearchBtn);
        } else {
            document.getElementById('favorites-random-button').insertAdjacentHTML('afterend', favPageBtn);
        }
    } else if (/\/artist\//.test(pathname)) { // artist pages
        document.getElementsByClassName('sort')[0].innerHTML += namespaceSearchLink;
    } else if (/\/tag\//.test(pathname)) { // tag pages
        document.getElementsByClassName('sort')[0].innerHTML += namespaceSearchLink;
    } else if (/\/group\//.test(pathname)) { // group pages
        document.getElementsByClassName('sort')[0].innerHTML += namespaceSearchLink;
    } else if (/\/category\//.test(pathname)) { // category pages
        document.getElementsByClassName('sort')[0].innerHTML += namespaceSearchLink;
    } else if (/\/search\//.test(pathname)) { // search pages
        document.getElementsByClassName('sort')[0].innerHTML += siteSearchLink;
    }
}