// ==UserScript==
// @name         Easyyy Emoticon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  easy way to add emoticons to your text with / commands
// @author       minnieo
// @match        https://kbin.social/*
// @match        https://fedia.io/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/2/24/Lenny_face.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469465/Easyyy%20Emoticon.user.js
// @updateURL https://update.greasyfork.org/scripts/469465/Easyyy%20Emoticon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userInput = document.getElementById('entry_comment_body');
    const userInputDM = document.getElementById('message_body');
    const userInputCSSBox = document.getElementById('magazine_theme_customCss');
    const userInputAbout = document.getElementById('user_basic_about');
    /* const userInputAbout = document.getElementById('user_basic_about'); */

    const emoticons = ['¯\\_(ツ)_/¯', '( ͡° ͜ʖ ͡°)', '¯\\_( ͡° ͜ʖ ͡°)_/¯ ',
        '( ͡° ͜ʖ ͡°)╭∩╮', '( ͡~ ͜ʖ ͡°)', 'ツ', '(͠≖ ͜ʖ͠≖)', '(╯°□°)╯︵ ┻━┻', '┬─┬ノ( º _ ºノ)'];
    const emoticonsCute = ['ʕ •ᴥ•ʔ', 'ʕっ• ᴥ • ʔっ', '(♡ヮ♡)', '╰(´꒳`)╯',
        '૮ ˙Ⱉ˙ ა', '( ⸝⸝´꒳`⸝⸝)', '(o/////o " )', '⁄(⁄ ⁄•⁄-⁄•⁄ ⁄)⁄', '( ˶ˆ꒳ˆ˵ )'];

    userInput.addEventListener('input', function() {
        emoticonMake(userInput);
        console.log('working');
    });

    userInputAbout.addEventListener('input', function() {
        emoticonMake(userInputAbout);
        console.log('working');
    });

    userInputDM.addEventListener('input', function() {
        emoticonMake(userInputDM);
    });

    userInputCSSBox.addEventListener('input', function() {
        emoticonMake(userInputCSSBox);
        console.log('working');
    });


    function emoticonMake(param) {
        let text = param.value;
        text = text
            .replace(/\/shrug/, `${emoticons[0]} `)
            .replace(/\/lemmy/, `${emoticons[1]} `)
            .replace(/\/lemshrug/, `${emoticons[2]} `)
            .replace(/\/flipoff/, `${emoticons[3]} `)
            .replace(/\/lemwink/, `${emoticons[4]} `)
            .replace(/\/welp/, `${emoticons[5]} `)
            .replace(/\/lemsexy/, `${emoticons[6]} `)
            .replace(/\/tableflip/, `${emoticons[7]} `)
            .replace(/\/tableback/, `${emoticons[8]} `);

        // cute emoticons
        text = text
            .replace(/\/bear/, `${emoticonsCute[0]} `)
            .replace(/\/bearhug/, `${emoticonsCute[1]} `)
            .replace(/\/hearteyes/, `${emoticonsCute[2]} `)
            .replace(/\/happy/, `${emoticonsCute[3]} `)
            .replace(/\/rawr/, `${emoticonsCute[4]} `)
            .replace(/\/blush/, `${emoticonsCute[5]} `)
            .replace(/\/blush1/, `${emoticonsCute[6]} `)
            .replace(/\/blush2/, `${emoticonsCute[7]} `)
            .replace(/\/happy1/, `${emoticonsCute[8]} `);

        param.value = text;
    }



})();
