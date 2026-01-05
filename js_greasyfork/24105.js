// ==UserScript==
// @name        Anima charsheet fixer
// @namespace   @á••( á› )á•—
// @description adds labels and sheeit
// @include     https://app.roll20.net/editor/
// @version     1
// @grant       none
// run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/24105/Anima%20charsheet%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/24105/Anima%20charsheet%20fixer.meta.js
// ==/UserScript==


window.initialooze = function () {
    console.log('USERSCRIPT LOADEDED á••( á› )á•— á••( á› )á•— á••( á› )á•—');
    var addLabels = function () {
        jQuery('.charsheet.tab-pane .sheet-tab').before(function (ind) {
            var title = jQuery(this).attr('title');
            return '<label style=\'width:auto;display:inline-block;padding-left:20px;\' for=\'' + title + '\'>' + title + '</label>';
        }).css('width', 'auto');
        jQuery('.sheet-tab-content.sheet-tab1 .sheet-wrapper input.sheet-small_tab').before(function (ind) {
            var title = jQuery(this).attr('title');
            return '<label style=\'width:auto;display:inline-block;padding-right:3px;font-size:1em;\' for=\'' + title + '\'>' + title + '</label>';
        }).css({
            'width': 'auto',
                'margin-left': '0px'
        });
    };
    Campaign.characters.models.forEach(function (element, ind, arr) {
        var old = element.view.showDialog;
        element.view.showDialog = function () {
            var ret = old.apply(this, arguments);
            window.d20mine = window.d20;
            var sentinel = new MutationObserver(function () {
                addLabels();
            });
            var mutie = document.getElementsByClassName('sheetform') [0];
            var config = {
                attributes: true,
                childList: true,
                characterData: true
            };
            sentinel.observe(mutie, config); //sheetform shows up empty before showDialog ends
            return ret;
        };
    });
};
function waitForElement() {
    if (typeof Campaign !== 'undefined' && Campaign.gameFullyLoaded) {
        window.initialooze();
    } 
    else {
        setTimeout(function () {
            waitForElement();
        }, 1000);
    }
}
waitForElement();
