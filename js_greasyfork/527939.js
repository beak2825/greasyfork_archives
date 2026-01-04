// ==UserScript==
// @name         Genshin Impact Interactive World Map Enhancements
// @description  Makes everything markable, removes right sidebar & more
// @namespace    https://github.com/rainniel/tampermonkey-scripts
// @supportURL   https://github.com/rainniel/tampermonkey-scripts/issues
// @version      1.0
// @author       Rainniel
// @license      MIT
// @match        https://genshin-impact-map.appsample.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=genshin-impact-map.appsample.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/527939/Genshin%20Impact%20Interactive%20World%20Map%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/527939/Genshin%20Impact%20Interactive%20World%20Map%20Enhancements.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function () {
    'use strict';

    // Intercept & modify the marking data request and makes
    // everything markable except for Teleporters and Waverider waypoints
    (function (open) {
        XMLHttpRequest.prototype.open = function (method, url) {
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && this.status === 200) {

                    let jsonResponse = null;
                    try {
                        jsonResponse = JSON.parse(this.responseText);
                    } catch (e) { }

                    if (jsonResponse) {
                        const hasCode = 'code' in jsonResponse;
                        const hasData = 'data' in jsonResponse;
                        const hasHeaders = 'headers' in jsonResponse;
                        const hasTime = 'time' in jsonResponse;

                        if (hasCode && hasData && hasHeaders && hasTime) {
                            if (Array.isArray(jsonResponse.data)) {
                                const excludeList = ['o2', 'o3', 'o154', 'o190'];
                                jsonResponse.data.forEach(item => {
                                    if (Array.isArray(item) && item.length > 3) {
                                        if (!excludeList.includes(item[1]) && item[3] < 5) {
                                            item[3] = 5;
                                        }
                                    }
                                });
                            }
                            Object.defineProperty(this, 'responseText', { value: jsonResponse });
                        }
                    }
                }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    // Key elements
    const MapSidebarMenuClass = '.MapSidebarMenu';
    const HideFoundMarkersClass = '.css-108jljv';
    const PlacesFoundClass = '.css-1s9cync';
    const CommentImageClass = '.css-8ndowl';
    const RightBarClass = '.MapLayout_Rightbar';

    // Removes the map focus blue border
    $('head').append('<style>.gm-style iframe + div { border:none!important; }</style>');

    // Waits for element to appear then executes a function, has 20 seconds timeout
    function onElementReady(selector, action) {
        function checkElement() {
            return !!document.querySelector(selector);
        }

        if (checkElement()) {
            action(document.querySelector(selector));
        } else {
            const checkInterval = setInterval(function () {
                if (checkElement()) {
                    action(document.querySelector(selector));
                    clearInterval(checkInterval);
                }
            }, 100);

            setTimeout(function () {
                clearInterval(checkInterval);
            }, 20000);
        }
    }

    // Simulate mouse left click
    function clickElement(element) {
        if (element) {
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            });
            element.dispatchEvent(clickEvent);
        }
    }

    // Toggles 'Hide Found Markers' on/off in left sidebar Markers
    function toggleHideFoundMarkers() {
        const elements = document.querySelector(HideFoundMarkersClass);
        if (elements) {
            const checkbox = elements.querySelectorAll('.PrivateSwitchBase-input').item(0);
            clickElement(checkbox);
        }
    }

    // Waits for user data to load
    onElementReady(PlacesFoundClass, function () {
        const placesFoundElement = $(PlacesFoundClass);
        let lastText = placesFoundElement.text();

        const placesFoundInterval = setInterval(function () {
            if (lastText != placesFoundElement.text()) {
                clearInterval(placesFoundInterval);

                toggleHideFoundMarkers();

                // Adds 'Hide Found Markers' toggle button to sidebar menu
                const dividerElements = $(`${MapSidebarMenuClass} ul hr`);
                if (dividerElements.length > 0) {

                    // SVG credits to Google Fonts
                    dividerElements.first().after(`
                            <li class="li-toggle-hide-found-markers" style="padding:4px; display: none" tabindex="-1">
                                <button class="toggle-hide-found-markers btn btn-success" style="width:100%" title="Toggle Hide Found Markers">
                                    <svg viewBox="0 -960 960 960" fill="#fff">
                                        <path d="M482-160q-134 0-228-93t-94-227v-7l-64 64-56-56 160-160 160 160-56 56-64-64v7q0 100 70.5 170T482-240q26 0 51-6t49-18l60 60q-38 22-78 33t-82 11Zm278-161L600-481l56-56 64 64v-7q0-100-70.5-170T478-720q-26 0-51 6t-49 18l-60-60q38-22 78-33t82-11q134 0 228 93t94 227v7l64-64 56 56-160 160Z"/>
                                    </svg>
                                </button>
                            </li>
                        `);

                    $(document).on('click', '.toggle-hide-found-markers', toggleHideFoundMarkers);
                    $('.li-toggle-hide-found-markers').slideDown();
                }
            }
        }, 100);

        setTimeout(function () {
            clearInterval(placesFoundInterval);
        }, 20000);
    });

    // Removes the right sidebar
    onElementReady(RightBarClass, function () {
        $(RightBarClass).remove();
    });

    // Moves the comment image pop-up to the left side
    document.addEventListener('click', function (event) {
        const img = event.target.closest('img');
        if (img) {
            const imgWidth = $(`${CommentImageClass} img`).width();
            const iframeWidth = $(`${CommentImageClass} iframe`).width();
            let width = 0;

            if (imgWidth > 0) {
                width = imgWidth;
            } else if (iframeWidth > 0) {
                width = iframeWidth;
            }

            $(CommentImageClass).width(width + 40);
        }
    });
})();