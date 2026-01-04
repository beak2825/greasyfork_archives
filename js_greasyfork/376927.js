// ==UserScript==
// @name         fix bugs in page and content
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://swordandgame.blogspot.com/*
// @grant        none
//
// @run-at       document-end
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376927/fix%20bugs%20in%20page%20and%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/376927/fix%20bugs%20in%20page%20and%20content.meta.js
// ==/UserScript==

var $ = window.jQuery;

function putNamesBeforeQuotes() {
    var elem = $(".post-body.entry-content")[0];
    var regex_from = /(.*)\((.*?)\)(<|"|\*)/gi;
    var regex_to = "$2. $1$3";
    console.log(elem);
    console.log(regex_from);
    console.log(regex_to);
    elem.innerHTML = elem.innerHTML.replace(regex_from, regex_to);
}

function fixNextLink() {
    var pb = $("div.post-body")[0];
    var anext = pb.children[pb.children.length-2].children[1];
    var insertanext = String(parseInt(document.location.pathname.replace(/.*-chapter-(\d+)\.html/ig, "$1"))+1);
    anext.href = anext.href.replace(/(.*-chapter-)(\d+)(\.html)/ig, "$1"+insertanext+"$3");
}

(function() {
    'use strict';

    putNamesBeforeQuotes();
    fixNextLink();
})();