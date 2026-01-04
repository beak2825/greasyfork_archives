// ==UserScript==
// @name            Epic Games Unreal Engine Free Collector
// @name:en         Epic Games Unreal Engine Free Collector
// @namespace       http://tampermonkey.net/
// @version         1.0.0.1
// @description     Автоматическое нажатие кнопок на сайте Unreal Engine в разделе Market Free
// @description:en  Automatic button clicks on the Unreal Engine website in the Market Free section
// @author          VolodinAS
// @match           *://*.unrealengine.com/marketplace/en-US/free*
// @icon            data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant           none
// @require         https://code.jquery.com/jquery-3.6.4.min.js
// @run-at		    document-end
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/465532/Epic%20Games%20Unreal%20Engine%20Free%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/465532/Epic%20Games%20Unreal%20Engine%20Free%20Collector.meta.js
// ==/UserScript==

let BUTTONS_ADD_TO_CART;
let CLASS_ADD;
let CLASS_IN_CART;
let TOTAL_FOUNDS_TRY;
let URL;


(function() {
    'use strict';

    setTimeout(function()
    {
        CLASS_ADD = 'add'
        CLASS_IN_CART = 'in-cart'
        TOTAL_FOUNDS_TRY = 5
        URL = 'https://www.unrealengine.com/marketplace/en-US/free?'
        
        initScript()
    }, 2000)
})();

function initScript()
{
    BUTTONS_ADD_TO_CART = $('span > i.add')

    if (BUTTONS_ADD_TO_CART.length > 0)
    {
        console.log(`Found ${BUTTONS_ADD_TO_CART.length} items on page...`);
        BUTTONS_ADD_TO_CART.each(function()
        {
            let BUTTON_ADD_TO_CART = $(this)
            console.log(BUTTON_ADD_TO_CART);
            let current_class = BUTTON_ADD_TO_CART.attr("class")
            console.log(current_class);
            if (current_class == CLASS_ADD)
            {
                BUTTON_ADD_TO_CART.click()
                let while_counter = 100
                while (true)
                {
                    BUTTON_ADD_TO_CART = $(this)
                    let new_class = BUTTON_ADD_TO_CART.attr("class")
                    if (new_class != CLASS_ADD) break
                    if (while_counter > 0)
                        while_counter--
                    else break
                }
                console.log(`Counter: ${while_counter}`);
            }
        })
        setTimeout(function()
        {
            initScript()
        }, 500)
    } else
    {
        console.log('Items not found... Reload...');
        if (TOTAL_FOUNDS_TRY > 0)
        {
            TOTAL_FOUNDS_TRY--
            setTimeout(function()
            {
                initScript()
            }, 1000)
        } else
        {
            TOTAL_FOUNDS_TRY = 5;
            let BUTTON_NEXT_PAGE = $('li.rc-pagination-next > a')
            if (BUTTON_NEXT_PAGE.length > 0)
            {   
                if (BUTTON_NEXT_PAGE.attr("disabled") !== undefined)
                {
                    console.log('This is last page. Script down');
                } else
                {
                    let start = getUrlParameter('start');
                    start = parseInt(start)
                    start += 100
                    let count = getUrlParameter('count');
                    let sortBy = getUrlParameter('sortBy');
                    let sortDir = getUrlParameter('sortDir');
                    let query = {
                        'count': count, 
                        'sortBy': sortBy, 
                        'sortDir': sortDir,
                        'start': start
                    };
                    let url = URL + $.param(query);
                    console.log('Loading next page...');
                    window.location.href = url
                }
            } else
            {
                console.log('Next button not found..');
            }
        }
        
    }
}

const getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};