// ==UserScript==
// @name         RS: Wikia to Wiki
// @version      1.0.0
// @description  Redirects from RS Fandom to RS Wiki
// @author       nysos3
// @match        *://runescape.fandom.com/wiki/*
// @match        *://www.google.com/search*
// @namespace https://greasyfork.org/users/316895
// @downloadURL https://update.greasyfork.org/scripts/406641/RS%3A%20Wikia%20to%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/406641/RS%3A%20Wikia%20to%20Wiki.meta.js
// ==/UserScript==
var url = window.location.href;
if (url.indexOf('://runescape.fandom.com/wiki/') > 0) {
    var article = url.substr(url.indexOf('/wiki/') + 6);
    window.location.href = 'https://runescape.wiki/w/' + article;
} else if (url.indexOf('://www.google.com/search') > 0) {
    var anhorTags = document.getElementsByTagName('a');
    Array.prototype.forEach.call(anhorTags, function (el) {
        var href = el.href;
        if (href.indexOf('://runescape.fandom.com/wiki') < 0) {
            return
        }
        if (href.indexOf('webcache.google') >= 0) {
            return
        }
        var article = href.substr(href.indexOf('/wiki/') + 6);
        el.href = 'https://runescape.wiki/w/' + article;
    });
}