// ==UserScript==
// @name           HF - Swearing Enabled
// @namespace      HF - Swearing Enabled
// @description    A plugin that lets you swear again :)
// @include        https://hackforums.net/*
// @author         Who Soup
// @version        1.1.5
// #######################################################
//                    Update History
// #######################################################
// Version 1.1.0: Original Launch
// Version 1.1.1: Modified so script works on HF only
// Version 1.1.2: Updated "shit" word replacement 
// Version 1.1.3: Replaces word "_error_" to "error"
// Version 1.1.4: Re added "Clay Davis" to support posts that previously used it as the filter word 
// Version 1.1.5: Replaces filter words in quoted posts
// @downloadURL https://update.greasyfork.org/scripts/403269/HF%20-%20Swearing%20Enabled.user.js
// @updateURL https://update.greasyfork.org/scripts/403269/HF%20-%20Swearing%20Enabled.meta.js
// ==/UserScript==
(function () {
    'use strict';


    var words = {

        'something that like is sorta but not yet poop' : 'shit',
        'bullsnap' : 'bullshit',
        'kitten' : 'cunt',
        'mommyfugger' : 'motherfucker',
        'fugg' : 'fuck',
        '_error_' : 'error',
        'clay davis' : 'shit',
        'Clay Davis' : 'shit',

    '':''};

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
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