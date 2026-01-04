// ==UserScript==
// @name           Enable Swearing - Hackforums
// @namespace      Enable Swearing - Hackforums
// @description    Plugin lets you swear again :)
// @include        http://*
// @include        https://*
// @copyright      Who Soup
// @version        1.1.0

// @downloadURL https://update.greasyfork.org/scripts/403267/Enable%20Swearing%20-%20Hackforums.user.js
// @updateURL https://update.greasyfork.org/scripts/403267/Enable%20Swearing%20-%20Hackforums.meta.js
// ==/UserScript==
(function () {
    'use strict';


    var words = {

        'Clay Davis' : 'shit',
        'bullsnap' : 'bullshit',
        'kitten' : 'cunt',
        'mommyfugger' : 'motherfucker',
        'fugg' : 'fuck',

    '':''};

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;


    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }


    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words[''];




    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);


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


            replacements.push( words[word] );
        }
    }


    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index] );
            });
        }
    }

}());