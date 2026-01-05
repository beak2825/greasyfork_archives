// ==UserScript==
// @name         Namecheap.com domain-buyer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  I made it because they won't give us API access! And it was about time after buying 10000+ domains by hand!
// @author       acdarekar
// @match        https://www.namecheap.com/domains/registration/results.aspx*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/21909/Namecheapcom%20domain-buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/21909/Namecheapcom%20domain-buyer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Script will start running in 3 seconds...');
    var domains_list_container = 0 , domains = 0, unavailables = 0, eligibles = 0, premiums = 0;
    var checkagainst = '$<span class="domain-dollar-value">0.88/year</span>';
    window.setTimeout(function() {
        var clicker = $('<input id="pmnco-namecheap-domain-clicker" type="button" value="Add next 3 domains"/>');
        $(clicker).css('float', 'left');
        $(clicker).css('z-index', '999999');
        $(clicker).css('position', 'fixed');
        $(clicker).css('bottom', '12px');
        $(clicker).css('right', '12px');
        $("body").append(clicker);
        // find domains list container
        domains_list_container = $('.sr-tabs-content > .selected').find('.sr-list');
        if (domains_list_container) {
            console.log('domains list acquired.');

            // make all domain list visible
            var domains_list_next_btn = domains_list_container.find('p#moreTldsBtn');
            do {
                domains_list_next_btn.click();
                domains_list_next_btn = domains_list_container.find('p#moreTldsBtn');
            } while (domains_list_next_btn.length > 0);

            // get all domains.
            setTimeout(function() {

                domains = domains_list_container.find('li');
                console.log('Domains found: ' + domains.length);

                eligibles = domains_list_container.find('li.has-promo.register');
                console.log('Eligible Domains found: ' + eligibles.length);

                unavailables = domains_list_container.find('li.unavailable');
                console.log('Unavailable Domains Found: ' + unavailables.length);

                for(var i = 0; i < 3; i++) {
                    if ($(eligibles[i]).find('span.price').html() == checkagainst) {
                        // console.log(eligibles[i]);
                    }
                }

                /*
                do {
                    for(i = 0; i < 4; i++) {
                        if ($(eligibles[i]).find('span.price').html() == checkagainst) {
                            $(eligibles[i]).find('.btn.cart-add').click();
                        }
                    }
                    eligibles = domains_list_container.find('li.has-promo.register');
                    console.log('Remaining domains: ' + eligibles);
                } while (eligibles > 0);
                */
            }, 3000);
        }
        else {
            console.log('domains list not found!!!');
        }
    }, 3000);

})();