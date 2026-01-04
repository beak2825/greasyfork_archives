// ==UserScript==
// @name         Greasy Fork hide elements
// @version      2.1.5
// @author       karrdozo
// @match        https://greasyfork.org*
// @grant        none
// @run-at	     document-start
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @namespace    https://greasyfork.org/users/1115413
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      MIT
// @description  Remove annoying elements from greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/469944/Greasy%20Fork%20hide%20elements.user.js
// @updateURL https://update.greasyfork.org/scripts/469944/Greasy%20Fork%20hide%20elements.meta.js
// ==/UserScript==

/* eslint-env jquery */

function gtfo() {

    var list = [
        $( "[class|='ad']" ).parent()
        //$( "span:contains('Ouça ao vivo em Espaços')" ).parent().parent().parent().parent(),
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
}, 200)

setTimeout(function() {
    clearInterval(timer);
}, 2000);

/*
//Repeat on Scroll - Thanks Ganymed_ for suggestion
$( window ).scroll(function() {
gtfo_dyn();
});
*/