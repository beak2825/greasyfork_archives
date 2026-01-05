// ==UserScript==
// @name        NinjaKiwi - Low Quality Flash
// @namespace   http://userscripts.org/users/23652
// @description Sets the flash player to low/med/high quality. You can choose the quality
// @include     http://ninjakiwi.com/Games/*/Play/*.html*
// @include     https://ninjakiwi.com/Games/*/Play/*.html*
// @include     http://staging.ninjakiwi.com/Games/*/Play/*.html*
// @include     https://staging.ninjakiwi.com/Games/*/Play/*.html*
// @copyright   JoeSimmons
// @version     1.0.2
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @require     https://greasyfork.org/scripts/1885-joesimmons-library/code/JoeSimmons'%20Library.js?version=7915
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/3606/NinjaKiwi%20-%20Low%20Quality%20Flash.user.js
// @updateURL https://update.greasyfork.org/scripts/3606/NinjaKiwi%20-%20Low%20Quality%20Flash.meta.js
// ==/UserScript==

(function () {

    function promptQuality() {
        var userQuality = prompt('Enter a quality - low/medium/high', GM_getValue('quality', 'low') );
        return (userQuality + '').toLowerCase().replace(/^\W*(\w+)[\W\w]*$/g, '$1');
    }

    function validQuality(quality) {
        return /low|medium|high/i.test(quality);
    }

    function setQuality() {
        var quality = promptQuality();
        if( validQuality(quality) ) {
            GM_setValue('quality', quality);
        }
    }

    // Make sure the page is not in a frame
    if (window.self !== window.top) { return; }

    JSL.runAt('end', function () {
        var game = JSL('#game'),
            e = JSL('#game param[name="quality"]'),
            wmode = JSL.create('param', {name : 'wmode', value : 'direct'}),
            quality;

        if (game.exists && e.exists) {
            quality = GM_getValue('quality', '')  || promptQuality();

            if ( !validQuality(quality) ) {
                alert('Invalid quality - "' + quality + '".\n\nPlease reload and enter a valid quality.');
            } else if ( quality !== e.attribute('value') ) {
                // set the quality
                e.attribute('value', quality);

                // append a wmode=direct param tag
                game.append(wmode);

                // save the quality you entered
                GM_setValue('quality', quality);

                // reload the game because the quality won't change otherwise
                game.attribute('data', game.attribute('data') );
            }
        }

        // add the change quality button
        JSL('html > body').append(
            JSL.create('input', {id : 'setquality', type : 'button', value : 'Set Flash Quality', style : 'position: fixed; bottom: 2px; right: 2px; font-size: 12pt; font-family: "myriad pro", sans-serif, "times new roman", arial; padding: 2px 10px;'})
        );
        JSL('input#setquality')[0].addEventListener('click', setQuality, false);
    });

}());