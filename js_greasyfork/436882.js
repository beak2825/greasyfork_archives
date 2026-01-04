// ==UserScript==
// @name         Toshl enhancements
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  expand menu, compact form, hide few fields
// @author       ppapousek@gmail.com
// @match        https://toshl.com/app/
// @icon         https://www.google.com/s2/favicons?domain=toshl.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436882/Toshl%20enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/436882/Toshl%20enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';
    new MutationObserver(function (mutations, me) {
        let $showLess = $("#addent button.addent_more_button").first()
        if ($showLess.length) {
            let $form = $("form[name=addEntry]");
            $form.find("button.addent_more_button").click()//.remove();
            $form.find("#add_entry_photos, div.addent_reminder , div.addent_repeat").remove();
            $form.find(".margin-top-32").removeClass("margin-top-32").addClass("margin-top-12");
            $showLess.remove();
            $form.find("div.addent_date").click();
            $form.find("i.icon-arrow-left-l").click();
            let $amount = $form.find("#addent_amount");
            $amount.on('keypress', function(event) {
                console.log(event)
                if (event.key == ".") {
                    $amount.val($amount.val() + ",")
                    return false;
                };
            });
        }
    }).observe(document, {
        childList: true,
        subtree: true
    });
})();