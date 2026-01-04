// ==UserScript==
// @name         Trumphider
// @namespace    http://tampermonkey.net/
// @version      2025-05-23
// @description  HIDE all mentions of Trump and related MAGA terms with black/red boxes.
// @author       R
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537023/Trumphider.user.js
// @updateURL https://update.greasyfork.org/scripts/537023/Trumphider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
var col='red';



    var hide = function (x){

        $(':contains(' + x +'):not(:has("*"))').css('background-color', col).css('color', col).hover(
    function(){
  $(this).css("color", "white");
    }, function(){
  $(this).css("color", col);
});

    }

    hide("Trump");


    hide("Elon");
    hide("Musk");
    hide("MAGA");
    hide("Marjorie");

})();