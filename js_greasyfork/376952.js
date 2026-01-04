// ==UserScript==
// @name         ABS Wifi Registration
// @namespace    http://tampermonkey.net/
// @version      0.7.6
// @description  Auto Fill Guest Registration
// @author       You
// @match        https://*.albertsons.com/guest/*
// @downloadURL https://update.greasyfork.org/scripts/376952/ABS%20Wifi%20Registration.user.js
// @updateURL https://update.greasyfork.org/scripts/376952/ABS%20Wifi%20Registration.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Shortcut to querySelector
    var qs = function (selector) { return document.querySelector(selector) };

    // Remove background
    setTimeout(() => {
        document.querySelector('img').src = "";
        $.backstretch('destroy');
        qs('body').setAttribute('style','background-color: white !important');
        qs('h2').innerText = "";
    }, 50);

    // Perform actions based on URL
    if (window.location.href.indexOf('sponsorguest.php') > -1) {
        // Wait for 2 seconds before submitting
        setTimeout(() => {              // Start setTimeout
            console.log("Typing in details...");

            qs('input[name=sponsor_email]').value = "JedChristian.Buenaventura@safeway.com";
            qs('input[name=visitor_name]').value = "Jed";
            qs('input[name=email]').value = "dhyed.o04@gmail.com";
            qs('input[name=visitor_phone]').value = "+639171234567";
            qs('input[name=creator_accept_terms]').checked = true;
            // Submit after 1 second
            setTimeout(() => {
                if (window.location.href.indexOf('#autosubmit') > -1) {
                    console.log('Submitting Form...');
                    qs('input[type=submit]').click();
                }
            }, 500);
        }, 1500);                      // End setTimeout
    }
    else if (window.location.href.indexOf('sponsorguest_receipt.php') > -1) {
        setTimeout(() => {
            console.log('Clicking Connect');
            qs('input[type=submit][value=Connect]').click();
        }, 1000);
    }
    else if (window.location.href.indexOf('guest_register_confirm.php') > -1) {
        setTimeout(() => {
            if (qs('#root').innerText.indexOf('Account has already been enabled') > -1) {
                console.log('Account has already been enabled. Skipping approval...');
                setTimeout(() => {
                    window.location.href = "https://safeway.service-now.com/navpage.do";
                }, 1000);
            }
            else {
                if (window.location.href.indexOf('#autosubmit') > -1) {
                    console.log('Account is still disabled. Performing approval...');
                    qs('button[id*=register_confirm_submit]').click();
                }
                else {
                    window.location.href = "https://safeway.service-now.com/navpage.do";
                }
            }
        }, 1000);
    }
})();


