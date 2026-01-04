// ==UserScript==
// @name         Netcup Replace My Hosting IDs
// @namespace    https://www.kanbon.io/
// @version      1.0.3
// @description  This helps you manage your very busy netcup account.
// @author       Simon Prast
// @match        https://www.customercontrolpanel.de/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434466/Netcup%20Replace%20My%20Hosting%20IDs.user.js
// @updateURL https://update.greasyfork.org/scripts/434466/Netcup%20Replace%20My%20Hosting%20IDs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

     /*
        NOTE:
            You can use \\* to match actual asterisks instead of using it as a wildcard!
            The examples below show a wildcard in use and a regular asterisk replacement.
    */

    var words = {
    ///////////////////////////////////////////////////////

        // Syntax: 'Search word' : 'Replace word',
        // Account Simon Prast
        'ae82b' : 'JAW',
        'ae82e' : 'VISIT360',
        'ae831' : 'KM Möbel',
        'a2e1c' : 'Camping Arneitz',
        'a2e16' : 'drohnenflug-kaernten.at / kanbon.drohne.io',
        'a2e22' : 'kanbon.at / Website-Agentur',
        'ae837' : 'spardaplus.at',
        'ae849' : 'beautypass.at',
        'ae83d' : 'MeaCoffee Barista Courses',
        'ae83a' : 'Kanbon.io',


    ///////////////////////////////////////////////////////
    '':''};

    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////
    function checkFlag() {
        if ($('body').hasClass('loadingoverlay')) {
            window.setTimeout(checkFlag, 30);
        } else {
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
        }
    }
    checkFlag();
})();