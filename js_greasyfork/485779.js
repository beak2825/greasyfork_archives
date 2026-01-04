// ==UserScript==
// @name         [Neopets] Neolodge Book All Except
// @namespace    https://greasyfork.org/en/scripts/485779
// @version      v0.5
// @description  Books all pets, except for 1, at the neolodge. Used for setting a designated starver for the Daily Quests.
// @author       Piotr Kardovsky
// @match        https://www.neopets.com/neolodge.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485779/%5BNeopets%5D%20Neolodge%20Book%20All%20Except.user.js
// @updateURL https://update.greasyfork.org/scripts/485779/%5BNeopets%5D%20Neolodge%20Book%20All%20Except.meta.js
// ==/UserScript==
var $ = window.jQuery;

(function() {
    'use strict';

    // Set to true if you want to automatically select Cockroach Towers (5 NP) and 28 days
    const AUTO_CHEAP = false;

    $(document).ready( ()=> {
        let bkar = $('#book_all').parent();
        bkar.prop('colspan','3'); bkar.append(`<input id="stCkB" type="checkbox"></input><label for="stCkB">Book All Except Above</label>`);
        $('#content .content').append(`<div style="display:flex"><span class="stFb" style="margin:0 auto 12px;"></span></div>`);
        let hr = $('select[name="hotel_rate"]');
        let nt = $('select[name="nights"]');

        if (AUTO_CHEAP == true) { hr.val(5); nt.val(28); }

        let doSubmit = () => {
            let cb = $('#stCkB');
            if (cb.is(':checked') == false) {
                // Submit normally if not checked
                $('form[action="book_neolodge.phtml"]').submit();
            } else {
                let pn = $('select[name="pet_name"] option');
                let counter = 0;

                $('select[name="pet_name"]').prop('disabled',true); hr.prop('disabled',true); nt.prop('disabled',true);
                for (let i = 1; i < pn.length; i++) {
                    if (i != $('select[name="pet_name"] option:selected').index()) {
                        //console.log(pn[i].text, hr, nt);
                        setTimeout(() => {
                            $.post('https://www.neopets.com/book_neolodge.phtml',
                                   {'pet_name':pn[i].text,'hotel_rate': hr.val(),'nights': nt.val()},
                                   (r)=>{ counter++;
                                         $('.stFb').text(counter >= pn.length - 2 ? `Done booking ${counter} pets! Your designated starver is ${$('select[name="pet_name"] option:selected').val()}.` : `Booked ${counter} pets, including ${pn[i].text}.`);
                                         if (counter >= pn.length -2) { $('select[name="pet_name"]').prop('disabled',false); hr.prop('disabled',false); $('select[name="nights"]').prop('disabled',false); }
                                        });
                        },(i * 800 + Math.random() * 25));
                    }
                }
            }
        }

        // hijack the submit for nefarious purposes (lol)
        let submit = $('input[type="submit"][value="Complete Booking"]')
        submit.prop('type','button');
        submit.on('click',()=>{ doSubmit() });
    });

})();