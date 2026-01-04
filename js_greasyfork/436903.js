// ==UserScript==
// @name        SystemReqs - FPS Color Grading
// @namespace   https://greasyfork.org/en/scripts/436903-systemreqs-fps-color-grading
// @version     1.1.0
// @author      CML99
// @description Restores the expected FPS cell colors.
// @license     CC-BY-NC-SA-4.0
// @homepageURL https://greasyfork.org/en/scripts/436903-systemreqs-fps-color-grading
// @supportURL  https://greasyfork.org/en/scripts/436903-systemreqs-fps-color-grading/feedback
// @match       https://gamesystemrequirements.com/*
// @match       https://gepigeny.hu/*
// @match       https://systemanforderungen.com/*
// @match       https://systemreqs.com/*
// @icon        https://gepig.com/favicons/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/436903/SystemReqs%20-%20FPS%20Color%20Grading.user.js
// @updateURL https://update.greasyfork.org/scripts/436903/SystemReqs%20-%20FPS%20Color%20Grading.meta.js
// ==/UserScript==

$( ".srbr_cell:contains('60+ fps')" ).css( "background-color", "#050" );
$( ".srbr_cell:contains('60 fps')" ).css( "background-color", "#051" );
$( ".srbr_cell:contains('55 fps')" ).css( "background-color", "#052" );
$( ".srbr_cell:contains('50 fps')" ).css( "background-color", "#041" );
$( ".srbr_cell:contains('45 fps')" ).css( "background-color", "#041" );
$( ".srbr_cell:contains('40 fps')" ).css( "background-color", "#240" );
$( ".srbr_cell:contains('35 fps')" ).css( "background-color", "#230" );
$( ".srbr_cell:contains('30 fps')" ).css( "background-color", "#330" );
$( ".srbr_cell:contains('25 fps')" ).css( "background-color", "#430" );
$( ".srbr_cell:contains('20 fps')" ).css( "background-color", "#520" );
$( ".srbr_cell:contains('15 fps')" ).css( "background-color", "#510" );
$( ".srbr_cell:contains('-')" ).css( "background-color", "#400" );

(function () {
    'use strict';
    var words = {
        'rejtett' : 'private',
    '':''};

    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////
 
    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;
 
    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }
 
    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }
 
    delete words['']; // so the user can add each entry ending with a comma,
                      // I put an extra empty key/value pair in the object.
                      // so we need to remove it before continuing
 
    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);
 
            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }
 
            // add the replacement
            replacements.push( words[word] );
        }
    }
 
    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index] );
            });
        }
    }
 
}());