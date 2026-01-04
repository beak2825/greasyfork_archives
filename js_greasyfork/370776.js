// ==UserScript==
// @name           Gobland Clan Enhancer
// @namespace      GCEnhancer
// @description    Replaces part of informations in game to make more visible information related to clan's players, allies, and ennemies.
// @include        http://games.gobland.fr
// @include        https://games.gobland.fr
// @copyright      lordslair
// @license        https://creativecommons.org/licenses/by-sa/4.0/
// @version        0.0.6
// @downloadURL https://update.greasyfork.org/scripts/370776/Gobland%20Clan%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/370776/Gobland%20Clan%20Enhancer.meta.js
// ==/UserScript==
// Heavily inspired by http://userscripts-mirror.org/scripts/show/41369

(function () {
    'use strict';

    var words = {
        '((347|348|349|350|351|352|353|354|355|356|357))' : '✅', // Clan
//      '((93))'                                          : '💛', // Alliés
//      '((214))'                                         : '🆘', // Ennemis
    };

    /////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // Escaping regex pattern
    function prepareRegex(string) {
        return string.replace(/(\({2}|([\[\]\^\&\$\.\?\/\\\+\{\}])|\)$)/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }
    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(new RegExp(userRegexp[1], 'g'));
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }
            replacements.push( '($1) ' + words[word]);
        }
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( tagsWhitelist.indexOf(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index] );
            });
        }
    }

}());
