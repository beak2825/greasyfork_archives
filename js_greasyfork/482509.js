// ==UserScript==
// @name        Deku Deals - Better Filter Menu
// @namespace   NooScripts
// @match       https://www.dekudeals.com/*
// @grant       none
// @version     1.1
// @author      NooScripts
// @description Adds buttons to each search filter group to collapse them for easier viewing
// @license MIT
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/482509/Deku%20Deals%20-%20Better%20Filter%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/482509/Deku%20Deals%20-%20Better%20Filter%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to collapse or expand all card-bodies
    function toggleAllCardBodies(collapseAll) {
        $('.search-facet').each(function() {
            var $searchFacet = $(this);
            var $cardBodies = $searchFacet.find('.card-body');

            $cardBodies.each(function() {
                var $thisCardBody = $(this);
                $thisCardBody.toggleClass('collapsed', collapseAll);
                if (collapseAll) {
                    $thisCardBody.css('display', 'none');
                } else {
                    $thisCardBody.css('display', '');
                }
            });
        });

        $('#toggle-button-all').text(collapseAll ? 'Expand All' : 'Collapse All');

    }

    // Find the first .search-facet element
    var $firstSearchFacet = $('.search-facet').first();

    // Add Collapse All button above the first .search-facet
    var $collapseAllButton = $('<button/>', {
        text: 'Expand All',
        id: 'toggle-button-all',
        class: 'toggle-button-all',
        click: function() {
            var collapseAll = $(this).text() === 'Collapse All';
            toggleAllCardBodies(collapseAll);
        }
    });

    $collapseAllButton.insertBefore($firstSearchFacet);

    // Add toggle buttons for each card-body
    $('.search-facet').each(function(index) {
        var $searchFacet = $(this);
        var $cardHeader = $searchFacet.find('.card-header');

        $cardHeader.each(function(i) {
            var $thisCardHeader = $(this);

            // Create toggle button with plus/minus
            var $toggleButton = $('<button/>', {
                text: '+/-',
                id: 'toggle-button-' + index + '+/-' + i,
                class: 'toggle-button',
                click: function() {
                    var $thisCardBody = $thisCardHeader.next('.card-body');
                    $thisCardBody.toggleClass('collapsed');
                    if ($thisCardBody.hasClass('collapsed')) {
                        $thisCardBody.css('display', 'none');
                        $(this).text('+/-');
                    } else {
                        $thisCardBody.css('display', '');
                        $(this).text('+/-');
                    }
                }
            });

            // Position toggle button on top of card-header
            $toggleButton.appendTo($thisCardHeader).addClass('absolute-position');
        });

        // Collapse all card-bodies initially except for the Collapse/Expand All button
        var $cardBodies = $searchFacet.find('.card-body').not($collapseAllButton.next('.card-body'));
        $cardBodies.addClass('collapsed').css('display', 'none');
        var $toggleButtons = $searchFacet.find('.toggle-button').not('#toggle-button-all');
    });

    // Styles for buttons and hover effects
    var style = `
        .toggle-button {
            padding: 3px 3px;
            margin-right: 0px;
            background-color: #0000;
            color: #fff;
            border: 1px solid #ffffff24;
            border-radius: 0px 4px 0px 0px;
            cursor: pointer;
            transition: background-color 0.3s;
            position: absolute;
            top: 8px;
            right: 7px;
        }

        .toggle-button:hover {
            background-color: #fff;
            color: #000;
        }

        .toggle-button-all {
            padding: 5px;
            margin-right: 10px;
            background-color: #0000;
            color: #fff;
            border: 1px solid #ffffff24;
            border-radius: 0px;
            cursor: pointer;
            transition: background-color 0.3s;
         }

        .toggle-button-all:hover {
            background-color: #fff;
            color: #000;
        }
    `;

    // Create style element and append to head
    var styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);

    // Initially set all individual toggle buttons to display '+/-'
    $('.toggle-button').text('+/-');
})();