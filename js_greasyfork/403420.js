// ==UserScript==
// @name         Torn: Color Picker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add tooltips to colors on forums
// @author       Untouchable [1360035]
// @match        https://www.torn.com/forums.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403420/Torn%3A%20Color%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/403420/Torn%3A%20Color%20Picker.meta.js
// ==/UserScript==

(function() {
    'use strict';


    setTimeout(() => {

        $('.icon-text-color').click(() => {
            let colours = $('#bbc-editor > div.actions.no-select > ul > li.icon.icon-text-color.divider-right.mobile-hidden.modal.active > div > ul')[0].children;
            colours[0].title = "Red";
            colours[1].title = "Fuchsia";
            colours[2].title = "Violet";
            colours[3].title = "Dark blue";
            colours[4].title = "Blue";
            colours[5].title = "Turquoise";
            colours[6].title = "Dark green";
            colours[7].title = "Green";
            colours[8].title = "Light green";
            colours[9].title = "Yellow";
            colours[10].title = "Orange";
            colours[11].title = "Black";
            colours[12].title = "Deep grey";
            colours[13].title = "Medium grey";
            colours[14].title = "Light grey";
            colours[15].title = "Purple";
        });


    },1500);

})();