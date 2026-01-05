// ==UserScript==
// @name         Wikipediaで他言語版のリンクをh1の隣に持ってくる
// @namespace    https://github.com/unarist/
// @version      0.1
// @description  Add link for InterWikis into h1 tag
// @match        https://*.wikipedia.org/wiki/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/26974/Wikipedia%E3%81%A7%E4%BB%96%E8%A8%80%E8%AA%9E%E7%89%88%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92h1%E3%81%AE%E9%9A%A3%E3%81%AB%E6%8C%81%E3%81%A3%E3%81%A6%E3%81%8F%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/26974/Wikipedia%E3%81%A7%E4%BB%96%E8%A8%80%E8%AA%9E%E7%89%88%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92h1%E3%81%AE%E9%9A%A3%E3%81%AB%E6%8C%81%E3%81%A3%E3%81%A6%E3%81%8F%E3%82%8B.meta.js
// ==/UserScript==

var langs = ['ja', 'en', 'it'];
var titleFilters = {
    ja: /^.+?: /
};

var currentLang = window.location.host.substr(0, 2);
var titleFilter = titleFilters[currentLang] || / [-–] .+?$/;

langs.map(function (lang) {
    if (lang === currentLang) return $();
    
    var link = $('.interwiki-' + lang + ' a');
    var elem, title;
    if(link.length > 0) {
        elem = link.clone();
        title = link.attr('title').replace(titleFilter, '');
    } else {
        elem = $('<span>');
        title = '-';
    }
    return elem.text(lang + ': ' + title);
}).forEach(function (elem) {
    elem.css({
        fontSize: 'small',
        marginLeft: '1em'
    })
    .appendTo('h1');
});