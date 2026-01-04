// ==UserScript==
// @name         TV Tropes - No Forum Avatar Message
// @namespace    https://tvtropes.org
// @version      0.11
// @description  Super simple userscript to show a message if a user has no avatars.
// @author       SilverCrown <rocketmanexplorer@gmail.com>
// @match        https://tvtropes.org/pmwiki/forumite_icon_gallery.php?fortroper=*
// @icon         https://www.google.com/s2/favicons?domain=tvtropes.org
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438544/TV%20Tropes%20-%20No%20Forum%20Avatar%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/438544/TV%20Tropes%20-%20No%20Forum%20Avatar%20Message.meta.js
// ==/UserScript==

// Getting the linter to shut up
// (because it hates jQuery)
/* global $ */

(function() {
    'use strict';

    console.log('%c No Forum Avatar Message (v. 0.11) by SilverCrown', 'color: goldenrod');

    // Page has to be the gallery page
    console.log('Checking user avatar count.');

    // I had some fun with these.
    var randomMessages = [
        'Nobody here but us chickens!',
        'Alas, \'tis nothing here but the sound of tumbleweed. <br> Do you wish to seek another page?',
        'They\'re just camera shy.',
        '<a href="/pmwiki/pmwiki.php/Main/DefensiveWhat">What?</a> We ran out of film.',
        'You can hear the wind in the distance. <br> But it looks like there\'s nothing for you here.',
        'Perhaps you should seek another page. <br> All that\'s left here is the screams of damned Natterers.',
        '<a href="/pmwiki/pmwiki.php/Main/IceCreamKoan">If you listen closely, you can hear nothing.</a>',
        'Drifted off course? There\'s nothing here in the cold emptiness of the void.',
        'You\'ll need more than a lampshade to see these pictures. <br> <a href="/pmwiki/pmwiki.php/Main/SelfDeprecation">Because there aren\'t any.</a>',
        'We hit a roadblock. There\'s nothing here.',
        'Checking once... checking twice... nothing here, cap.',
        'There is nothing here. <a href="/pmwiki/pmwiki.php/Literature/HitchhikersGuideToTheGalaxy">Don\'t panic.</a>',
        'Nada. Zilch. Zero. Bupkis. Whatever you\'re looking for has long since gone.',
        'Even Tropey the Wonder Dog can\'t find what you\'re looking for! <a href="/pmwiki/pmwiki.php/Main/DontExplainTheJoke">It doesn\'t exist.</a>'
    ];

    //console.log(randomMessages.length); <-- debug

    // Display message when user has no avatars
    if (userAvatarCount() === 0)
    {
        console.log('User has no avatars. Displaying message.');

        // <https://stackoverflow.com/questions/5915096/get-a-random-item-from-a-javascript-array>
        var message = randomMessages[Math.floor(Math.random() * randomMessages.length)];

        // For no avatars we need to select a different html element
        $('.pagination-box').attr('style', 'text-transform: none;')
        $('.pagination-box').removeClass('button-group'); // HACK - since some answers link to wikipages using the a tag
        $('.pagination-box').html(message + '<br><br>(This troper has no avatars.)');
    }

    function userAvatarCount()
    {
        return $('span.img-wrapper').length;
    }
    
    // vvvvvvv DEPRECATED vvvvvvv

    // Yes, the pick-a-message function is above the actual make a message function.
    // You may quietly laugh now.
    /* function getRandomMessage()
    {
        var message = messages[Math.floor(Math.random * messages.length)];
        return message;
    } */

    /*
    // I hate using the backslash but it has to be done
    function makeMissingPicMessages()
    {
        var messages = [
            'Nobody here but us chickens!',
            'Alas, tis nothing here but the sound of tumbleweed. Do you wish to seek another page?',
            'They\'re just camera shy.',
            'We ran out of film.',
            'You can hear the wind in the distance. But it looks like there\'s nothing for you here.',
            'Perhaps you should seek another page. All that\'s left here is the screams of damned Natterers.',
            'If you listen closely, you can hear nothing.',
            'Drifted off course? There\'s nothing here in the cold emptiness of the void.',
            'You\'ll need more than a lampshade to see these pictures. Because there aren\'t any.',
            'We hit a roadblock. There\'s nothing here.',
            'Checking once... checking twice... nothing here, cap.',
            'There is nothing here. Don\'t panic.',
            'Nada. Zilch. Zero. Bupkis. Whatever you\'re looking for has long since gone.',
            'Even Tropey the Wonder Dog can\'t find what you\'re looking for! (whispers) It doesn\'t exist.'
        ]
        return messages;
    }
*/
})();