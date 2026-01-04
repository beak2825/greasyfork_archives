// ==UserScript==
// @name           GC - Quickstock Gallery Shortener
// @copyright      JoeSimmons
// @description    replace long gallery names with shorter ones. I FOUND THIS ON GOOGLE I DID NOT MAKE IT LOL, i just edited a little for gc
// @match          https://www.grundos.cafe/quickstock/
// @version        1.1.0
// @namespace https://greasyfork.org/users/748951
// @downloadURL https://update.greasyfork.org/scripts/486219/GC%20-%20Quickstock%20Gallery%20Shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/486219/GC%20-%20Quickstock%20Gallery%20Shortener.meta.js
// ==/UserScript==

(function () {
    'use strict';




    var words = {
    ///////////////////////////////////////////////////////


        // Syntax: 'Full Gallery Name' : 'Short Name/Emoji',
        'felt emo, might delete' : '🖤',
        'Usuki Dreamhouse' : '🎎',
        'Pretty in Pink' : '🌸',
        'Keepsakes' : '🎁🍃',


    ///////////////////////////////////////////////////////
    '':''};

    /*
        NOTE ABOUT SPECIAL CHARACTERS:
            You can use \\* to match actual asterisks instead of using it as a wildcard!
            The examples below show a wildcard in use and a regular asterisk replacement.

        // Syntax: 'Search word' : 'Replace word',
        'your a' : 'you\'re a',
        'imo' : 'in my opinion',
        'im\\*o' : 'matching an asterisk, not a wildcard',
        '/\\bD\\b/g' : '[D]',
    */





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
