// ==UserScript==
// @name         Textsheet survery remover
// @namespace    kek
// @version      0.1
// @description  Removes the survey and the blur/dim effect
// @author       Sam
// @match       https://www.textsheet.com/retort
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/378333/Textsheet%20survery%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/378333/Textsheet%20survery%20remover.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = window.jQuery;

    setTimeout(function () {
        $("div").removeClass("blurring")
        $("div").removeClass("dimmer")
        $("div").removeClass("dimmed")
        $("div").removeClass("dimmable")
        $("#question-button").parent().remove();
    }, 1000);

})();