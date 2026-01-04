// ==UserScript==
// @name         Easy Property Rent Extension
// @namespace    easy.property.rent.extension
// @version      v2.3.0
// @description  Easily extend the rental property based on the previous rental agreement from your activity log
// @author       IceBlueFire [776]
// @license      MIT
// @match        https://www.torn.com/properties.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-1.8.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/524340/Easy%20Property%20Rent%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/524340/Easy%20Property%20Rent%20Extension.meta.js
// ==/UserScript==

/******************** CONFIG SETTINGS ********************/
const apikey = "#######"; // Full access API key required to pull historical activity log data.
const days_remaining = 3; // Number of days remaining or less to be included in reminders.
const default_days = 7; // Default number of days to extend the lease if data can't be found.
const default_cost = 5600000; // Default cost of lease extension if data can't be found.
const properties = [13]; // Array of property types allowed for renting. Ex: [12, 13] for Castles and Private Islands. Reference property IDs below as necessary.
const hex_color = "#8ABEEF"; // Hexcode to apply to the box.
const debug = 0; // Leave alone unless you want console logs.
/****************** END CONFIG SETTINGS *******************/

/* Property IDs
 * 1 = Trailer;
 * 2 = Apartment;
 * 3 = Semi-Detached House;
 * 4 = Detached House;
 * 5 = Beach House;
 * 6 = Chalet;
 * 7 = Villa;
 * 8 = Penthouse;
 * 9 = Mansion;
 * 10 = Ranch;
 * 11 = Palace;
 * 12 = Castle;
 * 13 = Private Island;
*/



/******************** DO NOT TOUCH ANYTHING BELOW THIS ********************/
$(document).ready(function() {
    log("Ready");
    let debounceTimeout;
    let rentalHistoryCache = null;
    let propertyListCache = null;
    let current_page = null;
    let property_details = null;
    let hex_darker = "#53728f";
    let player_id = $('#sidebarroot a[href*="profiles.php?XID="]').attr('href')?.match(/XID=(\d+)/)?.[1];

    function drawNavigation() {
        let valid_properties = [];
        let total_properties = 0;

        const navigation_div = `
    <div id="icey-container" style="display:none;">
    <div id="icey-property-rentals" class="m-top10">
    <div class="icey-head">
        <span class="icey-title">Easy Rental Extensions</span>
    </div>
    <div class="icey-content">
    <a id="previous-button" class="torn-btn">Previous</a>
    <div id="info-div" class="center-info"><p><strong>Rental Property Information</strong></p>
    <p><span class="rentals-count">0</span> / <span class="total-count">0</span> properties requiring attention.</p>
    <p class="viewing-rental"><span class="current-index">0</span> / <span class="rentals-count"></p>
    </div>
    <a id="next-button" class="torn-btn">Next</a>

    </div>
    <hr class="page-head-delimiter m-top10 m-bottom10">
    </div>
    </div>
    `;
        if ($('#icey-property-rentals').length === 0) {
            log('Insert navigation div');
            $('#properties-page-wrap .content-title.m-bottom10').after(navigation_div);
            const propertyList = propertyListCache ? Promise.resolve(propertyListCache) : getPropertyList();
            propertyList.then(function(result) {
                if (!propertyListCache) {
                    propertyListCache = result;
                }
                $.each(result.properties, function(key, value) {
                    if (value.owner_id == player_id && properties.includes(value.property_type)) {
                        total_properties++;
                        if((key != result.property_id && !value.rented) || (value.rented && value.rented.days_left <= days_remaining)) {
                            valid_properties.push(key);
                        }
                    }
                });

                // Get the current property ID from the URL
                const current_property_id = getParam('ID');

                if(current_property_id) {
                    property_details = result.properties[current_property_id];
                    injectOptionIntoEmptySlot('property-option-info', 'Happy: '+property_details.happy);
                }

                let current_index = valid_properties.indexOf(current_property_id);
                let tab = 'offerExtension';

                if (current_index > 0) {
                    const previous_property_id = valid_properties[current_index - 1];
                    if(result.properties[previous_property_id].rented) {
                        tab = 'offerExtension';
                    } else {
                        tab = 'lease';
                    }
                    $('#previous-button').attr('href', `#/p=options&ID=${previous_property_id}&tab=${tab}`);
                } else {
                    $('#previous-button').attr('href', '#').addClass('disabled'); // Disable if no previous
                }

                // Handle the "Next" button
                if (current_index < valid_properties.length - 1) {
                    const next_property_id = valid_properties[current_index === -1 ? 0 : current_index + 1];
                    if(result.properties[next_property_id].rented) {
                        tab = 'offerExtension';
                    } else {
                        tab = 'lease';
                    }
                    $('#next-button').attr('href', `#/p=options&ID=${next_property_id}&tab=${tab}`);
                } else {
                    $('#next-button').attr('href', '#').addClass('disabled'); // Disable if no next
                }
                $('#icey-container .total-count').html(total_properties);
                $('#icey-container .rentals-count').html(valid_properties.length);
                if(current_index === -1 || current_page == 'properties') {
                    $('#icey-container .viewing-rental').hide();
                } else {
                    $('#icey-container .viewing-rental').show();
                    $('#icey-container .current-index').html(current_index + 1);
                }
                setDynamicGradient();
                $('.icey-head').css('background', `linear-gradient(180deg, ${hex_color}, ${hex_darker})`);
                $('#icey-container').show();
            });
        }
    }



    function checkTabAndRunScript() {
        // Do the stuff!
        var page = getParam('tab');
        if (page === 'offerExtension') {
            drawNavigation();
            let current_renter = null;
            let link = $('.offerExtension-form').find('a.h.t-blue');
            if (link.length > 0) {
                current_renter = link.attr('href')?.match(/XID=(\d+)/)?.[1] || null;
                log("Renter: " + current_renter);
                getPreviousValues(current_renter);
            } else {
                log("No renter found.");
            }
        } else if(page === 'lease') {
            drawNavigation();
            log("Add to rental market");
            setDefaultLeaseFields();
        } else if(page == null) {
            drawNavigation();
        } else {
            log("Wrong properties tab.");
        }
    }

    function setDefaultLeaseFields()
    {
        const checkVisibility = setInterval(function() {
            const marketDiv = $('#market');
            if (marketDiv.is(':visible')) {
                // Access the input field and set its value
                $('#market').find('input.lease.input-money[data-name="money"]').val(default_cost);
                $('#market').find('input.lease.input-money[data-name="days"]').val(default_days);

                clearInterval(checkVisibility); // Stop the interval once the value is set
            }
        }, 100); // Check every 100 milliseconds

        $('#market input[type="submit"]').prop('disabled', false);
    }

    function getPreviousValues(current_renter) {
        // Look for previous rental agreements and auto-fill input boxes
        var duration = default_days || 0;
        var cost = default_cost || 0;
        const property_id = getParam('ID');
        const activity = rentalHistoryCache ? Promise.resolve(rentalHistoryCache) : getRentalHistory();
        activity.then(function(result) {
            // Cache the result if not already cached
            if (!rentalHistoryCache) {
                rentalHistoryCache = result;
            }

            $.each(result.log, function(key, value) {
                if(value.data.property_id == property_id && value.data.renter == current_renter) {
                    duration = value.data.days;
                    cost = value.data.rent;
                    return false;
                }
            });
            
            // Target the input fields
            let costInput = $('.offerExtension.input-money[data-name="offercost"]');
            let daysInput = $('.offerExtension.input-money[data-name="days"]');

            // Set the values
            costInput.val(cost);
            daysInput.val(duration);
            // costInput.tornInputMoney({buttonElement: null, skipBlurCheck: true});

            // Trigger events to mimic manual input
            // costInput.trigger('input').trigger('change').trigger('keyup'); // Attempt to simulate input event for Torn
            // daysInput.trigger('input').trigger('change').trigger('keyup'); // Attempt to simulate input event for Torn

            $('.offerExtension-form input[type="submit"]').prop('disabled', false);
        });
    }

    async function getRentalHistory() {
        // Get the activity log for both rental extensions and new rental agreements
        return new Promise(resolve => {
            const request_url = `https://api.torn.com/user/?selections=log&key=`+apikey+`&log=5943,5937&comment=EasyRentalExtensions`;
            GM_xmlhttpRequest ({
                method:     "GET",
                url:        request_url,
                headers:    {
                    "Content-Type": "application/json"
                },
                onload: response => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if(!data) {
                            log('No response from Torn API');
                        } else {
                            log('Log data fetched.');
                            return resolve(data);
                        }
                    }
                    catch (e) {
                        console.error(e);
                    }

                },
                onerror: (e) => {
                    console.error(e);
                }
            })
        });
    }

    async function getPropertyList() {
        // Get the activity log for both rental extensions and new rental agreements
        return new Promise(resolve => {
            const request_url = `https://api.torn.com/user/?selections=profile,properties&key=`+apikey+`&comment=EasyRentalExtensions`;
            GM_xmlhttpRequest ({
                method:     "GET",
                url:        request_url,
                headers:    {
                    "Content-Type": "application/json"
                },
                onload: response => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if(!data) {
                            log('No response from Torn API');
                        } else {
                            log('Property data fetched.');
                            return resolve(data);
                        }
                    }
                    catch (e) {
                        console.error(e);
                    }

                },
                onerror: (e) => {
                    console.error(e);
                }
            })
        });
    }

    function injectOptionIntoEmptySlot(iconClass, text) {
        log("Adding details to property", text);
        const emptySlot = $('ul.options-list.left li.empty').first();
        if (emptySlot.length) {
            emptySlot.removeClass('empty').addClass('custom-extension');
            emptySlot.find('.p-icon').html(`<i class="${iconClass}"></i>`);
            emptySlot.find('.desc').text(text);
        }
    }

    function getParam(name) {

       // Extract the part of the URL after the #
        const fragment = window.location.href.split('#')[1];
        if (!fragment) return null; // No fragment present

        // Treat the fragment like a query string
        const results = new RegExp(name + '=([^&#]*)').exec(fragment);
        return results ? decodeURIComponent(results[1]) : null; // Decode and return the value, or null if not found
    }

    function log(message) {
        if(debug){
            console.log("[RentExtension] "+message);
        }
    }

    function setDynamicGradient() {
        // Convert base hex to RGB
        const baseRgb = hexToRgb(hex_color);

        // Create a darker shade by reducing brightness
        const darkerRgb = darkenRgb(baseRgb, 0.7); // 0.7 is the factor for darkening

        // Convert the darker RGB back to hex
        hex_darker = rgbToHex(darkerRgb.r, darkerRgb.g, darkerRgb.b);
    }

    // Helper: Convert hex to RGB
    function hexToRgb(hex) {
        const bigint = parseInt(hex.replace('#', ''), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    }

    // Helper: Darken an RGB color
    function darkenRgb(rgb, factor) {
        return {
            r: Math.max(0, Math.min(255, Math.floor(rgb.r * factor))),
            g: Math.max(0, Math.min(255, Math.floor(rgb.g * factor))),
            b: Math.max(0, Math.min(255, Math.floor(rgb.b * factor))),
        };
    }

    // Helper: Convert RGB to hex
    function rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    // Create an observer for the properties page to watch for page changes
    // Select the target node
    const targetNode = document.getElementById('properties-page-wrap');

    if (targetNode) {
        // Create a MutationObserver to watch for changes
        const observer = new MutationObserver((mutationsList) => {
            clearTimeout(debounceTimeout); // Reset the debounce timeout on every change
            debounceTimeout = setTimeout(() => {
                log("Content changed in #properties-page-wrap");
                current_page = getParam('p');
                checkTabAndRunScript(); // Run your script when content settles
            }, 500); // Debounce for 500ms
        });

        // Start observing the target node for configured mutations
        observer.observe(targetNode, {
            childList: true, // Watch for added/removed child nodes
            subtree: true,  // Watch the entire subtree of the target node
        });

        //console.log("MutationObserver is set up with debouncing.");
    } else {
        console.error("Target node #properties-page-wrap not found.");
    }

    // Run the script initially in case the page is already on the correct tab
    checkTabAndRunScript();


});
GM_addStyle(`
#icey-container {
    width: 100%;
}
.icey-head {
    border-radius: 5px 5px 0 0;
    height: 30px;
    line-height: 30px;
    width: 100%;
    background: linear-gradient(180deg, #8ABEEF, #53728f);
    color: white;
}
.icey-title {
    width: 100%;
    font-size: 13px;
    letter-spacing: 1px;
    font-weight: 700;
    line-height: 16px;
    flex-grow: 2;
    padding: 5px;
    margin: 5px;
    text-transform: capitalize;
    text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
}
body.dark-mode .icey-content {
    background: #333333;
}
body.dark-mode .icey-content td {
    color: #c0c0c0;
}
.icey-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    background: #f2f2f2;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 1px 3px #06060680;
}
.icey-content .torn-btn {
    flex: 0 0 auto;
}

.center-info {
    flex: 1 1 auto;
    text-align: center;
}

`);