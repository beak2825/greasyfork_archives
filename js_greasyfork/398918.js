// ==UserScript==
// @name         BunPro Training Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a training mode to BunPro after a lesson and before a quizz
// @author       Luc Pitipuis
// @match        https://bunpro.jp/*
// @match        http://bunpro.jp/*
// @match        https://www.bunpro.jp/*
// @match        http://www.bunpro.jp/*
// @grant        GM.openInTab
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/398918/BunPro%20Training%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/398918/BunPro%20Training%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.pathname == "/learn") {
        var exercices_button = $('<div class="study-popup-btn" id="training">Some training first</div>')
        exercices_button.insertAfter($("#start-quiz"))
        exercices_button.on("click", function() {
            window.localStorage.setItem('grammar-ids', JSON.stringify($(".temp_grammar_ids").data("grammar-ids")))
            GM.openInTab(window.location.origin + "/cram")
        })
    }
})();

(function() {
    'use strict';
    // if we are in cram mode and there are some points to train
    if(window.location.pathname == "/cram" && window.localStorage.getItem('grammar-ids')) {
        // select custom grammar
        var t = $(".add-selected-grammar--cram")
        t.click()
        // select each grammar point
        JSON.parse(window.localStorage.getItem('grammar-ids')).forEach(id => $("#grammar-point-id-"+ id).click())
        // cleanup
        window.localStorage.removeItem('grammar-ids')
        // start session
        $(".start-cram-session-btn").click()

        // in training mode, we show the grammar
        $('.setsumei-structure').insertBefore($('.study-question-japanese'))
    }

})();
