// ==UserScript==
// @name         Moveable Toolbar for Workplace
// @namespace    http://your.namespace.com
// @version      2.1
// @description  Adds a moveable toolbar to old Workplace with various functions.
// @author       Rob Clayton
// @match        *workplace.plus.net/customers/customerdetails*
// @match        https://workplace.plus.net/apps/housemove/edit/*
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/489413/Moveable%20Toolbar%20for%20Workplace.user.js
// @updateURL https://update.greasyfork.org/scripts/489413/Moveable%20Toolbar%20for%20Workplace.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // Function to extract UK postcodes from the current page
    function extractPostcode() {
        var postcodeRegex = /\b[A-Z]{1,2}[0-9R][0-9A-Z]?(?:\s?)[0-9][ABD-HJLNP-UW-Z]{2}\b/gi;
        var matches = document.body.innerText.match(postcodeRegex);
        return matches && matches.length > 0 ? matches[0].replace(/\s/g, '') : null;
    }

    // Function to extract the service ID from the URL
    function extractServiceId() {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('service_id');
    }

    // Function to create and style a button
    function createButton(label, url) {
        var anchor = $('<a>');
        anchor.text(label);
        anchor.attr('href', url);
        anchor.attr('target', '_blank');
        anchor.css({
            'background-color': '#870051',
            'color': 'white',
            'padding': '5px 10px',
            'border-radius': '5px',
            'display': 'block',
            'border': '1px solid black',
            'white-space': 'nowrap'
        });
        return anchor[0];
    }

    // Create the dropdown toolbar
    var dropdownToolbar = $('<div>').attr('id', 'compact-dropdown-toolbar').css({
        'position': 'absolute',
        'top': localStorage.getItem('toolbarTop') || '50px',
        'left': localStorage.getItem('toolbarLeft') || '50px',
        'z-index': '9999',
        'cursor': 'move'
    });

    // Add title
    var title = $('<div>').html('Tools').css({
        'font-weight': 'bold',
        'background-color': '#870051',
        'color': 'white',
        'padding': '5px 10px',
        'border-radius': '5px',
        'border': '1px solid black'
    });

    dropdownToolbar.append(title);

    // Create the dropdown menu
    var dropdownMenu = $('<ul>').css({
        'list-style-type': 'none',
        'padding': '0',
        'margin': '0',
        'display': 'none',
        'position': 'absolute',
        'top': '100%',
        'left': '0',
        'background-color': '#fff',
        'box-shadow': '0 0 5px rgba(0,0,0,0.3)',
        'border-radius': '5px'
    });

    // Add buttons to the dropdown menu
    dropdownMenu.append(createButton('Check MiFi Coverage', 'https://ee.co.uk/help/mobile-coverage-checker/results?postcode=' + extractPostcode()));
    dropdownMenu.append(createButton('MiFi Request Form', 'https://apps.powerapps.com/play/e/default-a7f35688-9c00-4d5e-ba41-29f146377ab0/a/88f06c4f-3070-4001-abbb-2f8bd6e6ba7f?tenantId=a7f35688-9c00-4d5e-ba41-29f146377ab0&hidenavbar=true'));
    dropdownMenu.append(createButton('MSO Lookup', 'https://rabit.intra.bt.com/auth/testarea/CandISearch.cfm'));
    dropdownMenu.append(createButton('MGS Generator', 'https://apps.powerapps.com/play/e/default-a7f35688-9c00-4d5e-ba41-29f146377ab0/a/8a4a4ca1-5bc5-4ab1-954f-42be8a03b8db?tenantId=a7f35688-9c00-4d5e-ba41-29f146377ab0&hint=9fe40c17-781e-4063-bade-be24ccde2d5b&sourcetime=1699292842677&hidenavbar=true'));
    dropdownMenu.append(createButton('Secret Radius', 'https://workplace.plus.net/RADIUS/RadiusReporting_replicated/cli_search.html'));
    dropdownMenu.append(createButton('EBAC', 'https://bbactotl.btwholesale.com/bbac-ui/totl/totlSearch/#/ADSL'));
    dropdownMenu.append(createButton('Ellacoya', 'http://master.netops.servers.plus.net/tools/'));

    // Add Install Diary button with Service ID
    var serviceId = extractServiceId();
    if (serviceId) {
        dropdownMenu.append(createButton('Install diary', 'https://workplace.plus.net/adsl/adsl_process.html?usiServiceId=' + serviceId));
    } else {
        console.log("Service ID not found in the URL.");
    }

    dropdownToolbar.append(dropdownMenu);

    // Append dropdown toolbar to the body
    $('body').append(dropdownToolbar);

    // Make the dropdown toolbar draggable
    dropdownToolbar.draggable({
        start: function() {
            $(this).css('cursor', 'grabbing');
        },
        stop: function() {
            $(this).css('cursor', 'move');
            localStorage.setItem('toolbarTop', $(this).css('top'));
            localStorage.setItem('toolbarLeft', $(this).css('left'));
        }
    });

    // Toggle dropdown menu visibility on title click
    title.click(function() {
        dropdownMenu.toggle();
    });

    // Close dropdown menu when mouse moves away
    $(document).on('mousemove', function(e) {
        if (!dropdownToolbar.is(e.target) && dropdownToolbar.has(e.target).length === 0 && !dropdownMenu.is(e.target) && dropdownMenu.has(e.target).length === 0) {
            dropdownMenu.hide();
        }
    });

    // Toasty! Easter Egg
    var toastyDiv = $('<div>').attr('id', 'toasty-popup').css({
        'position': 'fixed',
        'bottom': '10px',
        'right': '10px',
        'z-index': '1000',
        'display': 'none'
    });

    var toastyImg = $('<img>').attr('src', 'https://community.plus.net/t5/image/serverpage/image-id/8711i368DFFDC8881B618/image-dimensions/2500?v=v2&px=-1').css({
        'width': '250px',
        'height': 'auto'
    });

    toastyDiv.append(toastyImg);
    $('body').append(toastyDiv);

    var audio = new Audio('https://www.myinstants.com/media/sounds/toasty_tfCWsU6.mp3');

    var konamiCode = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    var currentKeyIndex = 0;

    function showToasty() {
        toastyDiv.show();
        audio.play();
        setTimeout(function() {
            toastyDiv.hide();
        }, 3000);
    }

    function handleKeyPress(event) {
        if (event.key === konamiCode[currentKeyIndex]) {
            currentKeyIndex++;
            if (currentKeyIndex === konamiCode.length) {
                showToasty();
                currentKeyIndex = 0;
            }
        } else {
            currentKeyIndex = 0;
        }
    }

    $(window).on('keydown', handleKeyPress);
})(jQuery);
