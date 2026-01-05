// ==UserScript==
// @name         SteamGifts GA input
// @description  Adds input on top menu where you can enter 5characters of GA id and it will open the GA page for you.
// @author       Bladito
// @version      1.0.0
// @homepageURL  https://greasyfork.org/en/users/55159-bladito
// @match        https://www.steamgifts.com/*
// @namespace    Bladito/sg-ga-input
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28537/SteamGifts%20GA%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/28537/SteamGifts%20GA%20input.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    var $input = $('<input id="bsg-ga-input">');
    $input.on('input', function(event) {
        var value = event.target.value;
        if (value.length === 5) {
            var url = 'https://www.steamgifts.com/giveaway/' + value + '/';
            $.get(url, function(data) {
                if ($(data).find('.sidebar__navigation__item__name').text().indexOf('Entries') > -1) { // it is a giveaway page
                    window.open(url, '_blank');
                    $('#bsg-ga-input').removeClass('bsg-invalid');
                } else {
                    $('#bsg-ga-input').addClass('bsg-invalid');
                }
            });
        }
    });
    $('.nav__left-container').append($input);

    addStyles();

    //---------------------------------------------------------------------------------

    function addStyles() {
        GM_addStyle('#bsg-ga-input { ' +
                    'width: 100px;' +
                    'color: white;' +
                    'background-color: #3d434f;' +
                    'border: 1px solid #6e7788;' +
                    '}');
        GM_addStyle('#bsg-ga-input:focus { ' +
                    'color: black;' +
                    'background-color: white;' +
                    '}');
        GM_addStyle('#bsg-ga-input.bsg-invalid { ' +
                    'border: 1px solid red;' +
                    '}');
        GM_addStyle('#bsg-ga-input.bsg-invalid:focus { ' +
                    'background-color: #ffd2d2;' +
                    'border: 1px solid red;' +
                    '}');
    }

})(jQuery);
