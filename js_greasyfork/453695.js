// ==UserScript==
// @name        piptopip3
// @description Replaces the pip install module with pip3 install module. Works best on pypi.org
// @match       *://pypi.org/*
// @version 0.0.1.20221025084410
// @namespace https://greasyfork.org/users/974963
// @downloadURL https://update.greasyfork.org/scripts/453695/piptopip3.user.js
// @updateURL https://update.greasyfork.org/scripts/453695/piptopip3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var words = {
        'pip' : 'pip3',
        'Developed and maintained by the Python community, for the Python community.' : 'Made by MikusDev',
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