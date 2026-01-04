// ==UserScript==
// @name         WK Anti-burnout
// @namespace    https://www.wanikani.com/users/finnra
// @version      0.0.5c
// @description  This script limits your lessons to avoid burnout, and displays some information at the top of the lessons page.
// @author       finnra
// @match        https://www.wanikani.com/lesson
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        none
// @run-at       document-end
// @license      CC0; https://creativecommons.org/publicdomain/zero/1.0/
// @downloadURL https://update.greasyfork.org/scripts/32173/WK%20Anti-burnout.user.js
// @updateURL https://update.greasyfork.org/scripts/32173/WK%20Anti-burnout.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';

    // Options menu
    GM_config.init(
        {
            'id': 'WKAntiBurnoutConfig',
            'title': 'WK Anti-burnout settings',
            'fields':
            {
                'spicyAPIKey':
                {
                    'label': 'API v2 Key (?)',
                    'type': 'text',
                    'title': 'You can find this on your settings page under "Account"',
                    'default': ''
                },
                'spicySpiciness':
                {
                    'label': 'Spiciness (?)',
                    'type': 'int',
                    'min': 0,
                    'max': 250,
                    'title': 'How spicy do you like it? 100? recommended for as a starting point',
                    'default': 100
                },
                'spicyItemsperlesson':
                {
                    'label': 'Items per lesson (?)',
                    'type': 'select',
                    'title': 'This value should correspond to the value set in the field "Lesson batch sizing" on your settings page. I suggest 3.',
                    'options': ['3', '4', '5', '6', '7', '8', '9', '10'],
                    'default': '3'
                }
            },
            'events':
            {
                'save': function() {
                    GM_config.close();
                    location.reload();
                },
            }
        });

    // User settings
    const apikey = GM_config.get('spicyAPIKey');
    const spiciness = GM_config.get('spicySpiciness');
    const itemsperlesson = GM_config.get('spicyItemsperlesson');
    // End user settings

    // Diverse settings
    const danger = [6, 3, 1.04, 0.51, 0.14, 0.07, 0.03, 0.01];
    const urls = [];
    // Generates urls with url(num) appended.
    for (let url = 1; url <= 8; url++) {
        urls.push('https://www.wanikani.com/api/v2/assignments?srs_stages=' + url);
    }
    const colors = ['0093DD', '294DDB', '593DBD', '882D9E', '9D229B', 'B31799', 'C80B96', 'DD0093'];
    const headers = {'Authorization': 'Token token={' + apikey + '}'};
    const options = {'headers': headers, 'Cache-Control': 'max-age=0, must-revalidate'};
    const startbutton = document.getElementById('start-session').firstElementChild;

    // WK App Store hook
    try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}

    // Core loop

    // If the user hasn't entered any API key in settings, open the settings menu.
    if (GM_config.get('spicyAPIKey') === '') {
        openSettings();
    }

    // Get all the urls, make it all into JSON, find the total_count and then calculate scores.
    Promise.all(urls.map(url =>
                         fetch(url, options).then(resp => resp.json())
                        )).then(srs_info => {
        let calculated_scores = srs_info.map((srs_element, index) => {
            if(typeof srs_element.total_count !== 'undefined') {
                return (srs_element.total_count * danger[index])/2;
            } else {
                return 0;
            }
        });
        // Calculate the total score
        let totalscore = 0;
        calculated_scores.forEach((current) => {
            totalscore += roundToTwo(current);
        });
        printResults(srs_info, calculated_scores.reverse(), totalscore);

        hideStartbutton(roundToTwo(totalscore));

        if (totalscore < (spiciness - (itemsperlesson * 3)))
        {
            reshowStartbutton(totalscore);
        }
        
        printAmountOfSessions(totalscore);

    });

    // Nasty but neccessary DOM functions.

    function printResults(i, x, y) {
        var containingdiv = document.createElement("div");
        containingdiv.style.cssText = "margin: auto auto 1em auto; text-align: center; color: #FFFFFF; font-family: 'Source Sans Pro', sans-serif; font-weight: 400;";
        document.getElementsByTagName("BODY")[0].insertAdjacentElement('afterbegin', containingdiv);
        i.reverse().forEach((amount, index) => {
            if(typeof amount.total_count !== 'undefined') {
                containingdiv.insertAdjacentHTML('afterbegin',
                                                 '<span style="box-shadow: 3px 3px 0 #e1e1e1; text-align: center; display: inline-block; width: 10%; background: #' +
                                                 colors[index] +
                                                 '">' +
                                                 roundToTwo(amount.total_count) +
                                                 ' (' +
                                                 roundToTwo(x[index]) +
                                                 ')' +
                                                 '</span>'
                                                );
            }
        });
        containingdiv.insertAdjacentHTML('beforeend', '<span style="box-shadow: 3px 3px 0 #e1e1e1; text-align: center; display: inline-block; width: 10%; background: black;">全額: ' +
                                         roundToTwo(y) +
                                         '</span>');
        containingdiv.insertAdjacentHTML('beforeend', '<button id="spicysettings" style="padding: 0 2px; margin: 0; border: 0;">設定</button>');
        document.getElementById("spicysettings").addEventListener ("click", openSettings, false);


    }

    function hideStartbutton(y) {
        if (startbutton) {
            startbutton.style.display = 'none';
            document.getElementById('lesson-queue-count').style.borderRadius = "3px";
        }}

    function reshowStartbutton(totalscore) {
        startbutton.style.display = 'inline-block';
        document.getElementById('lesson-queue-count').style.borderRadius = "0 3px 3px 0";
    }
    
    function printAmountOfSessions(totalscore) {
                let amountofsessions = roundToTwo((spiciness-totalscore)/(itemsperlesson*3));
                document.getElementById('start-session').insertAdjacentHTML('beforeend', '<span title="This is the amount of batches of ' +
                                                                    itemsperlesson +
                                                                    ' lessons you can do without exceeding max spice' +
                                                                    '"' +
                                                                    'style="' +
                                                                    'display: inline-block; padding: 0 1em; height: 3em; background-color: black; color: #fff; border-radius: 3px;' +
                                                                    'line-height: 3em;' +
                                                                    '">' +
                                                                    amountofsessions +
                                                                    '回</span>')
                if (amountofsessions < 1) {
                 document.getElementById('start-session').lastChild.style.background = "darkred";
                    document.getElementById('start-session').lastChild.setAttribute("title", "Lessons button disabled because you can do less than one session before exceeding max spice.");
                }
    }

    // Misc functions
    function roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
    }

    function openSettings() {
        GM_config.open();
    }

})();