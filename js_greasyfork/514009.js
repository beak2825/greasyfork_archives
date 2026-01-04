// ==UserScript==
// @name         Realism in IdleMMO
// @namespace    http://tampermonkey.net/
// @version      2024-10-25
// @description  Replaces some text to add more realism to the game.
// @author       Mase
// @match        https://www.tampermonkey.net/index.php?version=5.3.1&ext=dhdg&updated=true
// @icon         https://cdn.idle-mmo.com/cdn-cgi/image/height=250,width=250/global/helmet-solo.png
// @grant        none
// @copyright    Mase and JoeSimmions
// @license      http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @downloadURL https://update.greasyfork.org/scripts/514009/Realism%20in%20IdleMMO.user.js
// @updateURL https://update.greasyfork.org/scripts/514009/Realism%20in%20IdleMMO.meta.js
// ==/UserScript==

//Replacement logic is almost all from this script by JoeSimmions: https://greasyfork.org/en/scripts/10976-replace-text-on-webpages/code
//Added retries in case a portion loads slower than expected.  And to make that cleaner, moved a portion of his script into a function

(function() {
    'use strict';
    /*
        NOTE:
            You can use \\* to match actual asterisks instead of using it as a wildcard!
            The examples below show a wildcard in use and a regular asterisk replacement.
    */
    var words = {
    ///////////////////////////////////////////////////////
        // Syntax: 'Search word' : 'Replace word',
        'Mercury' : 'Mythril',
        'Lead ' : 'Ladamantine ',
        'Uranium' : 'Urichalcum',
        'Forging' : 'Crafting',
        'Forge' : 'Craft',
        'Steel Ore' : 'High-Quality Iron Ore',
        '':''};
    ///////////////////////////////////////////////////////


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

    // Moved JoeSimmions logic into this function so it can be called by the retries easier
    function doReplace(tag) {
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

    let retries = 100;

    const intervalID = setInterval(_ => {
        doReplace();
        retries--;
        if(retries == 0) clearInterval(intervalID);
    }, 100);

})();