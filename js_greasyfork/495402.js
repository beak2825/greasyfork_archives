// ==UserScript==
// @name         Tourney Machine - Pitch Count
// @namespace    https://tourneymachine.com/
// @version      2024-05-20
// @description  Put pitcher jersey numbers before name, and sort in order of jersey number.
// @author       Eric Caron
// @license MIT
// @match        https://tourneymachine.com/Customer/postpitchcount.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tourneymachine.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495402/Tourney%20Machine%20-%20Pitch%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/495402/Tourney%20Machine%20-%20Pitch%20Count.meta.js
// ==/UserScript==

/* globals jQuery */
(function() {
    'use strict';
    function addbits(s) {
        return (s.replace(/\s/g, '').match(/[+\-]?([0-9\.]+)/g) || []).reduce(function(sum, value) {
            return parseFloat(sum) + parseFloat(value);
        });
    }
    jQuery('input').each(function(){
        const $self = jQuery(this);
        const id = $self.attr('id');
        if (id.indexOf('PitchCount_TextBox')) {
            $self.css({width:'60px'}).on('blur', function(){
                if ($self.val()) $self.val(addbits($self.val()));
            });
        }
    });

    jQuery('select').each(function(){
        const $self = jQuery(this);
        const id = $self.attr('id');
        if (id.indexOf('Athlete_DropDownList')) {
            $self.find('option').each(function(){
                const optionText = jQuery(this).text().match(/^([\s\S]+?) (\d+)$/);
                if (optionText) {
                    jQuery(this).text(optionText[2] + ' - ' + optionText[1]);
                }
            })
            $self.html($self.find('option').sort(function (a, b) {
                const firstJersey = parseInt(a.text, 10);
                const secondJersey = parseInt(b.text, 10);
                return firstJersey == secondJersey ? 0 : firstJersey < secondJersey ? -1 : 1;
            }));
        }
    });
})();