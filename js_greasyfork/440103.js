// ==UserScript==
// @name         AO3 clone "mark for later" button at bottom of fic
// @namespace    https://greasyfork.org/en/users/876643-elli-lili-lunch
// @version      0.0
// @description  Recreates marked for later button at end of works so you can mark work as read (note this is included in my AO3 Re-read Savior script)
// @author       elli-lili-lunch, based on script by scriptfairy
// @include      /https?://archiveofourown\.org/works/\d+/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440103/AO3%20clone%20%22mark%20for%20later%22%20button%20at%20bottom%20of%20fic.user.js
// @updateURL https://update.greasyfork.org/scripts/440103/AO3%20clone%20%22mark%20for%20later%22%20button%20at%20bottom%20of%20fic.meta.js
// ==/UserScript==

(function($) {
    $(document).ready(function() {
        var mfl = $('li.mark').clone();
        $('#new_kudo').parent().after(mfl);
    });
})(window.jQuery);