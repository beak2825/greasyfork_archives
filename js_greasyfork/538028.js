// ==UserScript==
// @name         Torn City: Skip Roulette Animation
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Skip the roulette wheel spin entirely and reload the page so you can bet again immediately
// @match        https://www.torn.com/page.php?sid=roulette
// @grant        none
// @run-at       document-idle
// @author       aquagloop
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538028/Torn%20City%3A%20Skip%20Roulette%20Animation.user.js
// @updateURL https://update.greasyfork.org/scripts/538028/Torn%20City%3A%20Skip%20Roulette%20Animation.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    function displayInfo(message, color) {
        $('#infoSpotText').html(message);
        $('#infoSpot').removeClass('red green');
        if (color) {
            $('#infoSpot').addClass(color);
        }
    }
    window.addEventListener('load', function() {
        const tornGetAction = window.getAction;
        window.getAction = function(options) {
            if (options?.data?.sid === 'rouletteData' && options.data.step === 'processStakes') {
                $('#rouletteCanvas').hide();
                options.success = function(response) {
                    const title = response.won ? `You won \$${response.won}!` : 'You lost...';
                    const message = ' The ball landed on ' + response.number;
                    displayInfo(title + message, response.won ? 'green' : 'red');
                    setTimeout(() => {
                        window.location.reload();
                    }, 200);
                };
                return tornGetAction(options);
            }
            return tornGetAction.apply(this, arguments);
        };
    }, false);
})(jQuery);
