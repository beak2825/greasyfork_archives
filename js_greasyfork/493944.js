// ==UserScript==
// @name         Link To Prompt
// @namespace    https://greasyfork.org/en/users/1295854
// @version      1.0.01
// @description  Adds a button to generate a link to a specific prompt in a prompt meme
// @license     MIT
// @author       Jamez
// @match        *://*.archiveofourown.org/*
// @icon         http://archiveofourown.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493944/Link%20To%20Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/493944/Link%20To%20Prompt.meta.js
// ==/UserScript==

(function($) {
    $(document).ready(function() {
        if ( !$('body').hasClass('logged-in') ) { return; }

        var $base_url = "https://archiveofourown.org/collections/$COLLECTION$/prompts/$ID$";
        var $actions = $('.actions');
        $actions.each(function() {
            var promptLink = $(this).find('form.button_to').attr('action');
            if (promptLink) {
                var prompt_id = promptLink.match(/prompt_id=(\d+)/)[1];
                if (prompt_id) {
                    var collection = promptLink.split("/")[2];
                    var $thurl = $base_url.replace("$COLLECTION$", collection).replace("$ID$", prompt_id);
                    $(this).append('<a style="left: 0; position: relative; margin-left: 10px;" href="' + $thurl + '">Prompt Link</a>');
                }
            }
        });
    });
})(window.jQuery);

