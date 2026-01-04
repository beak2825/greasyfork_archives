// ==UserScript==
// @name         Munzee Convert
// @namespace    https://greasyfork.org/users/156194
// @version      0.7
// @description  Show the name of each type at the convert page
// @author       rabe85
// @match        https://www.munzee.com/m/*/*/admin/convert
// @icon         https://www.google.com/s2/favicons?sz=64&domain=munzee.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373424/Munzee%20Convert.user.js
// @updateURL https://update.greasyfork.org/scripts/373424/Munzee%20Convert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function munzee_convert() {

        var type = document.getElementsByClassName('munzee-info')[0].getElementsByTagName('img')[0];
        if(type) {

            // Show the credits in convert page title (only virtuals)
            var type_src = type.getAttribute('src');
            if(type_src.split('/')[type_src.split('/').length - 1] == 'virtual.png') {
                var credits = document.getElementsByClassName('convert-count')[0];
                if(credits) {
                    var credits_count = document.getElementsByClassName('convert-count')[0].innerHTML;
                    document.getElementsByClassName('page-title')[0].getElementsByTagName('p')[0].innerHTML += ' - Credits: ' + credits_count;
                }
            }

            // Add title + alt tag to current pin
            var current_pin_name = type_src.split('/')[type_src.split('/').length - 1].replace(/_/g,' ');
            var current_pin_name_formatted = current_pin_name.substr(0, current_pin_name.length-4).charAt(0).toUpperCase() + current_pin_name.substr(0, current_pin_name.length-4).slice(1);
            if(current_pin_name_formatted == 'Virtual') current_pin_name_formatted += ' white'; // add 'white' to uncolored virtuals
            type.setAttribute('title', current_pin_name_formatted);
            type.setAttribute('alt', current_pin_name_formatted);

            // Add names, remove credits for virtual colors
            var colors0 = document.getElementsByClassName('pin-grid');
            for(var c = 0, colors; !!(colors=colors0[c]); c++) {
                colors.setAttribute('style', 'flex-basis: 16.66% !important;max-width: 16.66% !important;');
                var color_name = colors.getElementsByTagName('img')[0].getAttribute('aria-label');
                if(color_name !== null) {
                    var color_name_formatted_array = color_name.split(' ');
                    for(var cns = 0, color_name_split; !!(color_name_split=color_name_formatted_array[cns]); cns++) {
                        color_name_formatted_array[cns] = color_name_formatted_array[cns][0].toUpperCase() + color_name_formatted_array[cns].slice(1);
                    }
                    var color_name_formatted_string = '';
                    var credit_text = '';
                    if(color_name_formatted_array[0] == 'Virtual') color_name_formatted_string = color_name_formatted_array.slice(1).join(' ');
                    else color_name_formatted_string = color_name_formatted_array.join(' ');
                    colors.getElementsByTagName('img')[0].setAttribute('style', 'width: 75px;');
                    if(colors.getElementsByTagName('p')[0].innerHTML == '1') credit_text = '(1 credit)';
                    else credit_text = '(' + colors.getElementsByTagName('p')[0].innerHTML + ' credits)';
                    if(color_name_formatted_array[0] != 'Virtual' || color_name_formatted_array.includes('Trail')) colors.getElementsByTagName('p')[0].innerHTML = color_name_formatted_string + '<br>' + credit_text;
                    else colors.getElementsByTagName('p')[0].innerHTML = color_name_formatted_string;
                    colors.getElementsByTagName('p')[0].setAttribute('title', color_name_formatted_string);
                }
            }
        }

    }

    // Auf Element der Seite warten
    function daten_gefunden() {
        waitForElm('div.pin-grid').then((elm) => {
            munzee_convert();
        });
    }

    // Daten nachgeladen?
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        daten_gefunden();
    } else {
        document.addEventListener('DOMContentLoaded', daten_gefunden, false);
    }

})();