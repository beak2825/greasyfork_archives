// ==UserScript==
// @name           mrFARTY is GASSY
// @description:en    no one likes mrFARTY
// @namespace      mrfarty.gassy
// @include        http://www.liveleak.com/*
// @include        https://www.liveleak.com/*
// @copyright      PutinXuilo
// @version        1.2.1
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @description no one likes mrFARTY
// @downloadURL https://update.greasyfork.org/scripts/17480/mrFARTY%20is%20GASSY.user.js
// @updateURL https://update.greasyfork.org/scripts/17480/mrFARTY%20is%20GASSY.meta.js
// ==/UserScript==
(function () {
    'use strict';


    /*
        NOTE: 
            You can use \\* to match actual asterisks instead of using it as a wildcard!
            The examples below show a wildcard in use and a regular asterisk replacement.
    */

    var words = {
    ///////////////////////////////////////////////////////
        'mrARTY' : 'mrFARTY',
        'ethicon' : 'methhead',
        'Countess Bathory' : 'Countless Buttholey',
        'krak.en' : 'poop.ing',
    ///////////////////////////////////////////////////////
    '':''};

    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA', 'A'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
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

  jQuery('img[title="mrARTY"]').attr('src', 'http://cdn.shopify.com/s/files/1/1123/4252/products/MR_FARTY_copy_large.jpg');
    jQuery('img[title="ethicon"]').attr('src', 'https://s-media-cache-ak0.pinimg.com/236x/3e/2d/65/3e2d65d3e719ed8f88ce630316ebd240.jpg');
    jQuery('img[title="Countess Bathory"]').attr('src', 'https://33.media.tumblr.com/avatar_12d8a334bf89_96.png');
    jQuery('img[title="krak.en"]').attr('src', 'http://paolosworld.weebly.com/uploads/2/4/3/2/24321932/9819820.png');
    

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        regexs.forEach(function (value, index) {
            text.data = text.data.replace( value, replacements[index] );
        });

    }

}());