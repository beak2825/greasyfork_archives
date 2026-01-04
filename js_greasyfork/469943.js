// ==UserScript==
// @name         Twitter hide elements
// @version      2.1
// @author       karrdozo
// @match        https://twitter.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @namespace    https://greasyfork.org/users/1115413
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @license      MIT
// @description  Remove annoying elements from Twitter
// @downloadURL https://update.greasyfork.org/scripts/469943/Twitter%20hide%20elements.user.js
// @updateURL https://update.greasyfork.org/scripts/469943/Twitter%20hide%20elements.meta.js
// ==/UserScript==

/* eslint-env jquery */

function gtfo() {

    var list = [
        $( "aside:contains('Obter verificação')" ).parent(),
        $( "span:contains('Ouça ao vivo em Espaços')" ).parent().parent().parent().parent(),
        $( "span:contains('Quem seguir')" ).parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide()
    ];

    let ret = 0;
    for (let i = 0; i < list.length; i ++ ){
        if (list[i].length ) {
            list[i].hide();
        } else {
            return;
        }
    }
    clearInterval(timer);
}

var timer = setInterval(() => {
    gtfo();
}, 1000)

/*
//Repeat on Scroll - Thanks Ganymed_ for suggestion
$( window ).scroll(function() {
gtfo_dyn();
});
*/