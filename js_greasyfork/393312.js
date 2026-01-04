// ==UserScript==
// @name         NewWhirlpoolSchool Fixed
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replace ze/hir/apache with real words
// @author       tibarion
// @match        http://www.newwhirlingschool.com/lessons/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393312/NewWhirlpoolSchool%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/393312/NewWhirlpoolSchool%20Fixed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var classname = document.getElementsByClassName("lessonlink");

    var myFunction = function() {
        var replacedStr = document.getElementById('commentcontent').innerHTML.replace(/ ze /ig, function(match) {
            if (match === ' ze ') {
                return ' he ';
            }
            else if (match === ' Ze ') {
                return ' He ';
            }
        })
        .replace(/ ze's /ig, function(match) {
            if (match === ' ze\'s ') {
                return ' he\'s ';
            }
            else if (match === ' Ze\'s ') {
                return ' He\'s ';
            }
        }).replace(/ hir /ig, function(match) {
            if (match === ' hir ') {
                return ' his ';
            }
            else if (match === ' Hir ') {
                return ' His ';
            }
        }).replace(/ his in /ig, ' him in ');
        document.getElementById('commentcontent').innerHTML = replacedStr;
    };

    for (var i = 0; i < classname.length; i++) {
        classname[i].addEventListener('click', myFunction, false);
    }
})();