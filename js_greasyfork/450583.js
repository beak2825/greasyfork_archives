// ==UserScript==
// @name         Bike-Discount Extras
// @namespace    http://bike-discount.de/
// @version      0.5.5
// @description  Fügt mehr Funktionen und verbesserungen zu Bike-Discount.de zu
// @author       Raphael Kiupel
// @match        *://bike-discount.de/*
// @match        *://bike-discount.com/*
// @match        *://*.bike-discount.com/*
// @match        *://*.bike-discount.de/*
// @exclude      *://*.bike-discount.de/wpage.php*
// @exclude      *://*.bike-discount.de/custom/module*
// @license      MIT
// @icon         https://news.bike-discount.de/wp-content/uploads/2022/02/cropped-favicon-192x192.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/450583/Bike-Discount%20Extras.user.js
// @updateURL https://update.greasyfork.org/scripts/450583/Bike-Discount%20Extras.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Settings
    var BDSetting = ['bd-varianten','bd-prozente','bd-uvp','bd-media','bd-compact','bd-product-slider','bd-close'];


    // Create the Settings Menu for Frontend
    var menuRegEx = /https:\/\/www.bike-discount.de|https:\/\/bike-discount.de/;
    if (menuRegEx.test(window.location.href)) {
        var BDextras = document.createElement("div"),
            body = document.body;
        BDextras.id = "bd-extras";
        BDextras.innerHTML = '<ul id="bd-extras-options" class="bd-extras">' +
            '<li class="bd-headline"><img src="https://cd.bike-discount.de/media/vector/b7/ed/3b/Bike-Discount-Logo.svg"></li>' +
            '<li data-tooltip="Zeige immer die Varianten an, ohne mit der Maus über einen Artikel gehen zu müssen"><span class="bd-extras-desc">Varianten</span><label class="bd-switch"><input id="bd-varianten" type="checkbox"><span class="bd-slider bd-round"></span></label></li>' +
            '<li data-tooltip="Zeige den Rabatt in Prozent an"><span class="bd-extras-desc">Prozente</span><label class="bd-switch"><input id="bd-prozente" type="checkbox"><span class="bd-slider bd-round"></span></label></li>' +
            '<li data-tooltip="Unterscheide reduzierte und UVP Artikel auf einen Blick"><span class="bd-extras-desc">UVP</span><label class="bd-switch"><input id="bd-uvp" type="checkbox"><span class="bd-slider bd-round"></span></label></li>' +
            '<li data-tooltip="Eine kompakte Übersicht um alle Artikel auf dem Bildschirm zu haben ohne scrollen zu müssen"><span class="bd-extras-desc">Compact</span><label class="bd-switch"><input id="bd-compact" type="checkbox"><span class="bd-slider bd-round"></span></label></li>' +
            '<li data-tooltip="Zeigt alle Artikel eines Artikel-Slider auf einmal an"><span class="bd-extras-desc">Artikel-Slider</span><label class="bd-switch"><input id="bd-product-slider" type="checkbox"><span class="bd-slider bd-round"></span></label></li>' +
            '</ul>' +
            '<div id="css"></div>' +
            '<ul class="bd-close-button"><li><span class="bd-extras-desc">Schließen</span><label class="bd-switch"><input id="bd-close" type="checkbox"><span class="bd-slider bd-round"></span></label></li></ul>';
        body.appendChild(BDextras);
    }


    // Shopware backend
    if (window.location.href.indexOf("/backend/") > -1) {
        // Settings menu for shopware backend
        BDextras.innerHTML = '<ul id="bd-extras-options" class="bd-extras">' +
            '<li class="bd-headline"><img src="https://cd.bike-discount.de/media/vector/b7/ed/3b/Bike-Discount-Logo.svg"></li>' +
            '<li data-tooltip="Ermöglicht das Anpassen der Ordner-Spalte im Medienmanager"><span class="bd-extras-desc">Media</span><label class="bd-switch"><input id="bd-media" type="checkbox"><span class="bd-slider bd-round"></span></label></li>' +
            '<li data-tooltip="Passe die Breite der Ordner-Spalte im Medienmanager an"><div id="bd-media-slider-value"></div><input type="range" min="0" max="100" value="50" id="bd-media-slider"></li>' +
            '</ul>' +
            '<div id="css"></div>' +
            '<ul class="bd-close-button"><li><span class="bd-extras-desc">Schließen</span><label class="bd-switch"><input id="bd-close" type="checkbox"><span class="bd-slider bd-round"></span></label></li></ul>';
    }


    // main loop
    var root = document.documentElement;
    for (var i = 0; i < BDSetting.length; i++) {
        let SettingExists = document.getElementById(BDSetting[i]);
        // check if setting exists
        if (SettingExists) {
            SettingExists.addEventListener('click', BDSwitcher, false);
            SettingExists.myParam = BDSetting[i];
            // set saved states
            if (localStorage.getItem(BDSetting[i]) == 1) {
                root.classList.add(BDSetting[i]);
                SettingExists.checked = true;
            }
        }
    };


    // Main Function
    function BDSwitcher(evt) {
        if (localStorage.getItem(evt.currentTarget.myParam) === null) {
            root.classList.add(evt.currentTarget.myParam);
            localStorage.setItem(evt.currentTarget.myParam, 1);
            document.getElementById(evt.currentTarget.myParam).checked = true;

        } else {
            root.classList.remove(evt.currentTarget.myParam);
            localStorage.removeItem(evt.currentTarget.myParam);
            document.getElementById(evt.currentTarget.myParam).checked = false;
        }
    };


    // Shopware Mediamanager width slider
    var bdMediaWidth = 50;
    var bdMediaSlider = document.getElementById("bd-media-slider");

    if (bdMediaSlider) {
        // Set the slider value to the saved value
        bdMediaSlider.value = localStorage.getItem('bdMediaWidthStorage');
        bdMediaWidth = localStorage.getItem('bdMediaWidthStorage');

        var bdMediaSliderOutput = document.getElementById("bd-media-slider-value");
        bdMediaSliderOutput.innerHTML = bdMediaSlider.value;

        // When using the slider*
        bdMediaSlider.oninput = function() {
            // *output value
            bdMediaSliderOutput.innerHTML = this.value;
            // *change value to current slider value
            bdMediaWidth = this.value;
            // *save value
            localStorage.setItem("bdMediaWidthStorage", bdMediaWidth);

            // Reset
            document.getElementById('css').innerHTML = "";
            // Select all media-manager-windows and add style to it
            document.getElementById('css').innerHTML = '<style>.bd-media .x-media-manager-window div[id*="mediamanager-main-window"],.bd-media .x-media-manager-window div[id*="mediamanager-selection-window"] { grid-template-columns: ' + bdMediaWidth + '% 3fr; }</style>';
        }
    };


    // Special styling for the staging/test systems
    var stageingRegEx = /stage...|test./;
    if (stageingRegEx.test(window.location.href)) {

        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        link.href = 'https://cd.bike-discount.de/media/unknown/97/c7/b7/Stage-favicon.ico';
        document.getElementsByTagName('head')[0].appendChild(link);

        function addStyle(styleString) {
            const style = document.createElement('style');
            style.textContent = styleString;
            document.head.append(style);
        }
        addStyle(`
           .shopware-menu:after {
               content: 'STAGE';
               position: absolute;
               color: #fff;
               color: #0d6cba;
               font-family: 'Open Sans';
               font-size: 24px;
               font-weight: 700;
               line-height: 36px;
               right: 5rem;
               top: 1px;
               top: 0;
               text-shadow: 1px 1px 0px #3caaf7;
               z-index: 999;
           }

           .shopware-ce:after {
               content: 'STAGE';
               position: absolute;
               color: rgba(255,255,255,0.6);
               font-family: 'Open Sans';
               font-size: 200px;
               font-weight: 700;
               line-height: 1;
               right: 1rem;
               bottom: calc(40px + 1rem);
           }
        `)
    };

    // Remove Settings from etailer WYSIWYG Editor and add some specific style
    if (window.location.href.indexOf("/extern/fckeditor/") > -1) {
        let element = document.getElementById("bd-extras");
        element.remove();
        // Add CSS for the etailer HTML Editor
        function addStyle(styleString) {
            const style = document.createElement('style');
            style.textContent = styleString;
            document.head.append(style);
        }
        addStyle(`
              .contents {
                   position: absolute;
                   top: 0;
                   left: 0;
                   right: 0;
                   bottom: 0;
                   background-color: #f7f7f7;
                   overflow: hidden;
                   z-index: 1;
              }
        `)
    };

    // Remove Settings from Newsletter and add style to newsletter
    if (window.location.href.indexOf("/backend/newsletter/") > -1) {
        let element = document.getElementById("bd-extras");
        element.remove();
        // Add CSS for the Newsletter
        function addStyle(styleString) {
            const style = document.createElement('style');
            style.textContent = styleString;
            document.head.append(style);
        }
        addStyle(`
            body {
                counter-reset: my-sec-counter;
            }
            td[style*="padding: 0; margin: 0; width: 200px;"] {
                position: relative;
            }
            td[style*="padding: 0; margin: 0; width: 200px;"]:before {
                font-size: 10px;
                background: #fff;
                padding: 1px 5px;
                counter-increment: my-sec-counter;
                content: "# "counter(my-sec-counter);
                position: absolute;
                top: 0;
                left: 0;
            }
        `)
    };

    // Add Custom CSS Styling
    function BDaddStyle(styleString) {
        const style = document.createElement('style');
        style.textContent = styleString;
        document.head.append(style);
    };

    BDaddStyle(`
/*-----------------
BD Extras Menu
-----------------*/

#bd-extras {
    position: fixed;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: #fff;
    min-height: auto !important;
    top: 0;
    right: 0;
    padding: 0;
    z-index: 9999999999;
    transition: transform 0.5s;
}

.bd-close #bd-extras {
    padding: 0.5rem 1rem;
    background: rgb(0 0 0 / 80%);
    border-bottom-left-radius: 5px;
    backdrop-filter: blur(3px);
}

#bd-extras ul {
    padding: 0;
    margin: 0;
}

#bd-extras li {
    display: flex;
    position: relative;
    list-style: none;
    padding: 0;
    text-align: right;
    line-height: 0;
    align-items: center;
    justify-content: flex-end;
}

.bd-close #bd-extras li {
    padding: 0.375rem 0;
}

#bd-extras li.bd-headline {
    font-weight: 700;
    justify-content: flex-start;
    padding: 0.75rem 0 1rem 0;
    margin-bottom: 0.25rem;
    border-bottom: 1px solid #444;
}

#bd-extras li[data-tooltip]:hover::before {
    content: attr(data-tooltip);
    position: absolute;
    background: #f0f0f0;
    color: #000;
    white-space: inherit;
    padding: 0.5rem;
    width: max-content;
    max-width: calc(100vw - 100% - 4rem);
    border-radius: 3px;
    line-height: 1;
    right: calc(100% + 1.375rem);
}

#bd-extras li[data-tooltip]:hover::after {
    content: "";
    position: absolute;
    left: -1.375rem;
    border-top: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid #f0f0f0;
}

.bd-extras-desc {
    margin-right: 0.5rem;
}

.bd-close #bd-extras-options {
    display: inline-block;
    margin: 0 0 1rem 0;
}

.bd-close #bd-extras ul:last-child {
    border-top: 1px solid #555;
    padding-top: 0.25rem;
}

#bd-extras .bd-close-button .bd-extras-desc {
    display: none;
}

.bd-close #bd-extras .bd-close-button .bd-extras-desc {
    display: inline;
}

#bd-extras-options {
    display: none;
}

.bd-switch {
    position: relative;
    display: inline-block;
    width: 14px;
    height: 14px;
    padding: 0;
    line-height: 0;
    margin: 0;
}

.bd-close .bd-switch {
    width: 30px;
    height: 16px;
}

.bd-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.bd-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(0 0 0 / 80%);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg' fill='%23fff'%3E%3Crect x='3' y='3' width='8' height='1'/%3E%3Crect x='3' y='6' width='8' height='1'/%3E%3Crect x='3' y='9' width='8' height='1'/%3E%3C/svg%3E");
    border-bottom-left-radius: 2px;
}

.bd-close .bd-slider {
    background-image: none;
    background-color: #ccc;
    -webkit-transition: .25s;
    transition: .25s;
}

.bd-slider:before {
    position: absolute;
    content: "";
    height: 10px;
    width: 10px;
    left: 4px;
    top: 3px;
    background-color: white;
    -webkit-transition: .25s;
    transition: .25s;
}

input:checked + .bd-slider {
    background-color: #2196F3;
}

input:checked + .bd-slider:before {
    -webkit-transform: translateX(12px);
    -ms-transform: translateX(12px);
    transform: translateX(12px);
}

.bd-close .bd-slider.bd-round {
    border-radius: 100px;
}

.bd-slider.bd-round:before {
    display: none;
}

.bd-close .bd-slider.bd-round:before {
    display: inline-block;
    border-radius: 50%;
}

#bd-media-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100px;
    height: 4px;
    background: #2297f1;
    outline: none;
    border-radius: 50px;
}

#bd-media-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
}

#bd-media-slider::-moz-range-thumb {
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
}

#bd-media-slider-value {
    font-size: 11px;
    margin-right: 0.5rem;
}


/*-----------------
bd-varianten
-----------------*/

.bd-varianten .variant--hover--box {
    display: block;
    opacity: 1;
    right: -10px;
    left: -10px;
}
.bd-varianten a.onstock3,
.bd-varianten a.onstock4 {
    display: block;
    color: white;
}
.bd-varianten a.onstock4 {
    background: #427bcc;
    border: 1px solid #427bcc;
}
.bd-varianten a.onstock4:hover {
    background: #3269b7;
    border: 1px solid #3269b7;
}
.bd-varianten a.onstock3 {
    background: #c53f1f;
    border: 1px solid #c53f1f;
}
.bd-varianten a.onstock3:hover {
    background: #a52d11;
    border: 1px solid #a52d11;
}


/*-----------------
bd-prozente
-----------------*/

.bd-prozente .product--box .product--price .price--pseudo,
.bd-prozente span.price--discount-percentage {
    visibility: visible !important;
}

.product--details .product--buybox .price--discount .price--content {
    float: none;
}
.product--price br {
    display: none;
}


/*-----------------
bd-uvp
-----------------*/

.bd-uvp .is--ctl-listing .price--pseudo::before {
    content: '';
    background: linear-gradient(to top, #ffceca 0%, white 35%);
    outline: 2px solid #e42314;
    position: absolute;
    top: 0px;
    bottom: -1px;
    right: -10px;
    left: -10px;
    z-index: -1;
}
.bd-uvp .is--ctl-listing .price--default::before {
    content: '';
    background: linear-gradient(to top, #faffc5 0%, white 35%);
    outline: 2px solid #c3d216;
    position: absolute;
    top: 0px;
    bottom: -1px;
    right: -10px;
    left: -10px;
    z-index: -2;
}
.bd-uvp .product--box .product--price .price--pseudo {
    visibility: visible !important;
    display: inline;
}


/*-----------------
bd-product-slider
-----------------*/

.bd-product-slider .product-slider--container.is--horizontal {
    white-space: unset;
}
.bd-product-slider .product-slider--arrow {
    display: none !important;
}

/*-----------------
bd-media
-----------------*/

.bd-media .x-media-manager-window div[id*="mediamanager-main-window"],
.bd-media .x-media-manager-window div[id*="mediamanager-selection-window"] {
    display: grid;
    grid-template-columns: ${bdMediaWidth}% 3fr;
    gap: 1px;
}
.bd-media .x-media-manager-window div[id*="mediamanager-main-window"] div[id*="mediamanager-media-view"] .x-more-info {
    right: 0px !important;
    left: auto !important;
}
.bd-media .x-media-manager-window div[id*="mediamanager-main-window"] div[id*="mediamanager-media-view"] div[id*="mediamanager-media-grid"] {
    width: 100% !important;
}
.bd-media .x-media-manager-window div[id*="mediamanager-main-window"] div[id*="mediamanager-media-view"] > div.x-panel:first-child {
    width: calc(100% - 210px) !important;
}
.bd-media .x-media-manager-window div[id*="mediamanager-main-window"] div[id*="mediamanager-media-view"] > div.x-panel:first-child div[id*="panel"],
.bd-media .x-media-manager-window div[id*="mediamanager-main-window"] div[id*="mediamanager-media-view"] > div.x-panel:first-child .x-container {
    width: 100% !important;
}
.bd-media .x-media-manager-window div[id*="mediamanager-selection-window"] div[id*="mediamanager-media-view"] > div,
.bd-media .x-media-manager-window div[id*="mediamanager-selection-window"] div[id*="mediamanager-media-view"] > div > div,
.bd-media .x-media-manager-window div[id*="mediamanager-selection-window"] div[id*="mediamanager-media-view"] > div > div > div,
.bd-media .x-media-manager-window div[id*="mediamanager-selection-window"] div[id*="mediamanager-media-view"] > div > div > div:nth-child(2) > div,
.bd-media .x-media-manager-window div[id*="mediamanager-selection-window"] div[id*="mediamanager-media-view"] > div > div > div:nth-child(2) > div > div,
.bd-media .x-media-manager-window div[id*="mediamanager-selection-window"] div[id*="mediamanager-media-view"] > div > div > div:nth-child(2) > div > div > table {
    width: 100% !important;
}
.bd-media .x-media-manager-window div[id*="mediamanager-album-tree"] {
    position: relative !important;
    width: 100% !important;
}
.bd-media .x-media-manager-window div[id*="mediamanager-album-tree"] div.x-toolbar,
.bd-media .x-media-manager-window div[id*="mediamanager-album-tree"] .x-grid-header-ct,
.bd-media .x-media-manager-window div[id*="mediamanager-album-tree"] div[id*="headercontainer"],
.bd-media .x-media-manager-window div[id*="mediamanager-album-tree"] div[id*="treeview"],
.bd-media .x-media-manager-window div[id*="mediamanager-album-tree"] .x-grid-table {
    width: 100% !important;
}
.bd-media .x-media-manager-window div[id*="mediamanager-media-view"] {
    position: relative !important;
    left: 0 !important;
    width: 100% !important;
}
.bd-media .x-media-manager-window div[id*="mediamanager-media-view"] div.x-toolbar,
.bd-media .x-media-manager-window div[id*="mediamanager-media-view"] div[id*="pagingtoolbar"],
.bd-media .x-media-manager-window div[id*="mediamanager-media-view"] div[id*="toolbar"],
.bd-media .x-media-manager-window div[id*="mediamanager-media-view"] div[id*="gridview"],
.bd-media .x-media-manager-window div[id*="mediamanager-media-view"] div[id*="headercontainer"] {
    width: 100% !important;
}
.bd-media .x-media-manager-window div[id*="mediamanager-media-view"] .x-grid-table {
    width: 100% !important;
}
.bd-media .x-media-manager-window div[id*="mediamanager-media-view"] .searchfield {
    left: auto !important;
    right: 5px !important;
    width: 12% !important;
}
.bd-media .x-media-manager-window div[id*="mediamanager-media-view"] div[id*="pagingtoolbar"] .x-tbar-page-number {
    position: absolute !important;
    margin: 0 !important;
}
.bd-media .x-media-manager-window div[id*="mediamanager-media-view"] div[id*="pagingtoolbar"] > table {
    position: initial !important;
    float: right;
    margin: 4px !important;
}

/*-----------------
bd-compact
-----------------*/

.bd-compact .is--ctl-listing .content-main {
    max-width: 100%;
}
.bd-compact .is--ctl-listing .box--basic {
    width: calc(100% / 5);
    padding: 0;
}
@media only screen and (min-width: 600px) {
    .bd-compact .is--ctl-listing .box--basic {
        width: calc(100% / 5);
    }
}
@media only screen and (min-width: 900px) {
    .bd-compact .is--ctl-listing .box--basic {
        width: calc(100% / 8);
    }
}
@media only screen and (min-width: 1200px) {
    .bd-compact .is--ctl-listing .box--basic {
        width: calc(100% / 10);
    }
}
@media only screen and (min-width: 1400px) {
    .bd-compact .is--ctl-listing .box--basic {
        width: calc(100% / 12);
    }
}
.bd-compact .is--ctl-listing .product--box .box--content {
    margin: 0.25rem 0.75rem;
}
.bd-compact .is--ctl-listing .product--box .product--price .price--default {
    font-size: 0.725rem;
    line-height: 1;
    float: left;
}
.bd-compact .is--ctl-listing .product--box .product--title {
    font-size: 11px;
    height: 2.5rem;
    line-height: 1.2;
    overflow: hidden;
}
.bd-compact .is--ctl-listing .product--box .product--price .price--discount {
    font-size: 0.725rem;
    line-height: 1;
}
.bd-compact .is--ctl-listing .product--box .product--price .price--pseudo {
    line-height: 1;
}
.bd-compact .is--ctl-listing .product--box .product--price-info .price--unit {
    height: 1rem;
}
.bd-compact .is--ctl-listing .product--box .product--rating-container {
    height: 0.75rem;
}
.bd-compact .is--ctl-listing .variant--hover--box .variants-info-left {
    padding: 0 8px;
    bottom: 6.75rem;
}
.bd-compact .is--ctl-listing .variant--list a {
    padding: 1px;
    margin: 0 1px 1px 0;
    line-height: 1;
    font-size: 10px;
    min-height: auto;
}
.bd-compact .is--ctl-listing .bd-uvp .product--box .product--price .price--pseudo {
    display: flex;
}
.bd-compact .is--ctl-listing .box--basic .product--image {
    height: 8rem;
}
.bd-compact .is--ctl-listing .hero-unit.category--teaser {
    max-width: 1000px;
}


/*-----------------
Shopware changes
-----------------*/

/* Move the delete button of Shopping Worlds Elements to prevent accidental deletion  */
.x-emotion-element .x-emotion-element-options .x-emotion-element-delete {
    position: absolute;
    top: 3px;
    right: 3px;
}
.x-emotion-element .x-emotion-element-info {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.x-emotion-element .x-emotion-element-options .x-emotion-element-visibility {
    margin-right: 0;
}
/* Move the delete button of Shopping Worlds to prevent accidental deletion  */
.sprite-minus-circle, .sprite-picture--minus {
    float: right;
}
/* Make the Shopping Worlds overview hover more noticable */
.x-panel .x-grid-body .x-grid-row-over {
    background: #c6e8ff !important;
    color: #475c6a;
}
.x-panel .x-grid-body .x-grid-row-selected .x-grid-cell {
    background-color: #00a8ff !important;
    border-bottom-color: #cdd6dc;
    color: #ffffff;
}
.x-panel .x-grid-body .x-grid-row-selected .x-grid-cell a {
    color: #eaf8ff;
}
/* Moving the notifications (e.g. "saved successfully") to the very top so they don't block the close button */
.growl-msg-sticky-notification,
.growl-msg {
    top: 0 !important;
    right: 0 !important;
    left: auto !important;
    z-index: 999999 !important;
}

/* Always show all products in the newsletter product group element without scrolling and avoid jumping when moving a product */
div[id*=newsletter-settings-window] div[id*=gridview],
div[id*=newsletter-settings-window] div[id*=gridpanel] {
    height: 100% !important;
    min-height: 100px;
    top: 0 !important;
}
div[id*=newsletter-settings-window] .x-grid-table {
    width: 100% !important;
}
div[id*="newsletter-settings-window"] .x-grid-header-ct {
    position: relative !important;
}

/* Adds numbers to the newsletter product group element */
body.shopware-ce {
    counter-reset: nl-counter;
}
div[id*=newsletter-settings-window] div[style*="cursor: move;"] {
    display: none;
}
div[id*=newsletter-settings-window] .x-grid-cell-first:after {
    counter-increment: nl-counter;
    content: counter(nl-counter);
    border: 1px solid #cdd6dc;
    padding: 1px 5px;
    border-radius: 5px;
}
div[id*=newsletter-settings-window] .x-grid-cell-first {
    cursor: move;
    text-align: center;
    line-height: 6px;
}
/* Adds a line on every 3rd row of newsletter product group element to make it easier to arrage products*/
div[id*=newsletter-settings-window] .x-grid-row:nth-child(3n+1) .x-grid-cell {
    border-bottom: 2px solid #a4b5c0;
}
div[id*=newsletter-settings-window] .x-grid-row:last-child .x-grid-cell {
    border-bottom: 0px;
}

/* Display the brand Logo correctly in the brand options */
div[id*="supplier-main-edit"] img.x-component {
    width: auto !important;
    height: auto !important;
    max-height: 125px;
    max-width: 100%;
}


`);



// Add custom css to etailer
if (window.location.href.indexOf("live.bike-discount") > -1) {
    // Add CSS for the Newsletter
    function addStyle(styleString) {
        const style = document.createElement('style');
        style.textContent = styleString;
        document.head.append(style);
    }
    addStyle(`
    html#wysiwyg_dialog {
        overflow: hidden;
    }

    #wysiwyg_dialog iframe[style*="z-index: 110"] {
        width: 100% !important;
        height: 100% !important;
        left: 0 !important;
        top: 0 !important;
    }

    #wysiwyg_dialog #dialog-buttons {
        height: 45px;
        box-shadow: none;
        padding: 7px 10px 7px 10px;
    }
    #wysiwyg_dialog .mb-3,
    #wysiwyg_dialog .mt-3,
    #wysiwyg_dialog .my-3 {
        margin-bottom: 0 !important;
        margin-top: 0 !important;
    }

    #wysiwyg_dialog .mb-3 .btn,
    #wysiwyg_dialog .mt-3 .btn,
    #wysiwyg_dialog .my-3 .btn {
        height: 30px;
        padding: 0;
        font-size: 12px;
    }
    #wysiwyg_dialog .TB_Button_On,
    #wysiwyg_dialog .TB_Button_Off,
    #wysiwyg_dialog .TB_Button_On_Over,
    #wysiwyg_dialog .TB_Button_Off_Over,
    #wysiwyg_dialog .TB_Button_Disabled {
        width: 30px;
        text-align: center;
    }

    .TB_Toolbar:first-child {
        float: right !important;
        width: 140px;
        text-align: center;
    }

    #wysiwyg_dialog #xEditingArea {
        border: #ccc 1px solid;
    }

    body#content .content img {
        max-width: 100%;
        height: auto;
    }
    body#content img {
        max-width: 100%;
        height: auto;
    }

    #wysiwyg_dialog .TB_SideBorder {
        background-color: #ccc;
    }
    #wysiwyg_dialog #olk_TagSelector {
        border: #ccc 1px solid;
        background-color: #f7f7f7;
    }
    .PopupBody .contents {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .PopupBody #closeButton {
        background: transparent;
        border-left: 1px solid #cec6b5;
        border-bottom: 1px solid #cec6b5;
        text-align: center;
        line-height: 27px;
        height: 27px;
        width: 60px;
        margin-top: 0;
        margin-right: 0;
    }
    .PopupBody #closeButton:hover {
        background: #E81123;
        border-bottom: 0;
        height: 28px;
    }
    .PopupBody #closeButton:after {
        content: '×';
        font-family: serif;
        font-weight: 300;
        font-size: 26px;
    }
    .PopupBody #closeButton:hover::after {
        color: #fff;
    }

    .PopupButtons table {
        margin: auto;
    }
    .PopupButtons td:first-child {
        display: none;
    }
    #btnTest {
        display: none;
    }
    #btnOk,
    #btnTest,
    #btnCancel {
        width: 160px;
        height: 30px;
        transition: .2s;
    }
    #btnOk {
        color: #fff;
        background-color: #2383d8;
        border-color: #2383d8;
    }
    #btnCancel {
        color: #fff;
        background-color: #6c757d;
        border-color: #6c757d;
    }
    #btnOk:hover {
        cursor: pointer;
        background-color: #1c68ac;
        border-color: #1c68ac;
    }
    #btnCancel:hover {
        cursor: pointer;
        background-color: #5a6268;
        border-color: #5a6268;
    }
    table#imagePreview {
        width: 100%;
    }
    .TB_ToolbarSet {
        border-bottom: #efefde 0px outset;
    }
    #olk_TagSelector {
        border-top: 0;
    }

    #tinymce img {
        max-width: 100% !important;
        height: auto !important;
    }

    i.mdi.:before {
        content: '📦';
        font-style: normal;
    }

    i.mdi.o:before {
        content: '📰';
        font-style: normal;
    }

    i.mdi.Q:before {
        content: '📄';
        font-style: normal;
    }

    i.mdi.:before {
        content: '📙';
        font-style: normal;
    }

    .tab-header-wrapper .nav-item {
        color: #000;
        cursor: pointer;
    }

    .uk-offcanvas-page {
        position: relative !important;
    }
    .uk-offcanvas li {
        border-bottom: 1px solid #ddd;
    }
    .uk-offcanvas li:last-child {
        border-bottom: 0;
    }

    #wysiwyg_dialog div:nth-last-child(3),
    #wysiwyg_dialog div:nth-last-child(4) {
        min-height: calc(50% - 50px);
    }

    #inhalt1___Frame,
    #inhalt2___Frame {
        height: 100% !important;
        min-height: auto !important;
    }

    .theme-light .form-group {
        margin-bottom: 4px;
    }

    .theme-light table#productSelect {
        margin-bottom: 20px;
    }

    .theme-light #productSelect td:first-child {
        padding: 1px 10px;
    }

    .input-group-sm>.custom-select,
    .input-group-sm>.form-control,
    .input-group-sm>.input-group-append>.btn,
    .input-group-sm>.input-group-append>.input-group-text,
    .input-group-sm>.input-group-prepend>.btn,
    .input-group-sm>.input-group-prepend>.input-group-text {
        padding: 0.2rem 0.5rem;
    }

    .theme-light .container-dialog button[type="submit"] {
        margin-left: 0 !important;
        margin: 5px 0 10px 0;
        padding: 10px !important;
        height: auto !important;
        line-height: 1;
    }

    #copyArtikelTo {
        background: #1e6f14;
        color: #fff !important;
        border: 1px solid #1e6f14;
    }

    #moveArtikelTo {
        background: red;
        color: #fff !important;
        border: 1px solid red;
    }

    .theme-light .button.ui {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        border: 1px solid transparent;
        padding: .375rem .75rem;
    }

    .medium_preview {
        max-height: 100px;
        width: auto;
    }

    .theme-light ::-webkit-scrollbar {
        width: 14px;
        background: #fff;
    }

    .theme-light ::-webkit-scrollbar-button {
        background: transparent;
        height: 15px;
    }

    .theme-light ::-webkit-scrollbar-track {
        background: transparent;
    }

    .theme-light ::-webkit-scrollbar-thumb {
        background: #d1d1d1;
        border-radius: 50px;
        border: 4px solid #fff;
    }

    .theme-light .trafficlights {
        border-radius: 50px;
    }

    .theme-light .appheader_spacer {
        height: 40px;
    }

    .theme-light .dropdown-icon-right {
        top: 5px;
    }

    .theme-light hr {
        border: 0;
        border-bottom: 1px solid #cccccc;
    }

    .theme-light .module-medien hr {
        margin-top: .25rem;
        margin-bottom: .75rem;
    }

    .theme-light .module-medien hr {
        margin-top: .25rem;
        margin-bottom: .75rem;
    }

    .theme-light .bo-sidemenu .sub-menu li.hover a,
    .theme-light .bo-sidemenu .sub-menu li a:hover {
        border: 0;
    }

    #tabs-tpARTTexte .input-group {
        display: flex;
        resize: vertical;
        overflow: hidden;
    }

    .theme-light :is(.displayPos) .editorpreview {
        height: 31px !important;
    }

    .theme-light .editorpreview {
        padding: .75rem !important;
        background: #fff !important;
        height: 100% !important;
        min-height: auto !important;
    }

    .theme-light a:hover {
        text-decoration: none;
    }

    .theme-light .backoffice_topbar {
        height: 40px;
    }

    .theme-light .backoffice_toolbar__basics {
        margin-right: 20px;
    }

    .theme-light .tab-scroller {
        padding: 13px 7px 7px;
        background-color: #425471;
    }

    .theme-light .content-image-container img {
        height: auto;
    }

    .theme-light .tree-node__title > button {
        margin-right: 8px;
        padding: 0rem .5rem;
        visibility: hidden;
        display: none;
    }

    .theme-light .tree-node__title:before {
        content: "\\F24B";
        margin-right: 5px;
        font-size: 17px;
        line-height: 1;
        font-family: "Material Design Icons";
        font-weight: normal !important;
    }

    .theme-light .tree-node--active > .tree-node__title:before {
        content: "\\F76F";
    }

    .theme-light .tree-node--hasSubs > .tree-node__title > button {
        visibility: visible;
        display: inline;
    }

    .theme-light .tree-node--active > .tree-node__title {
        background: #dee2e6;
        margin: -5px 0;
        padding: 5px 0;
    }

    .theme-light .treeview__content {
        overflow: visible;
    }

    .theme-light .tree-node {
        border-bottom: 1px dotted #dfdfdf;
        padding-bottom: 5px;
    }

    .theme-light .table-active,
    .theme-light .table-active>td,
    .theme-light .table-active>th {
        background-color: rgb(44 145 236 / 50%);
    }

    .theme-light .tree-node--open > .tree-node__subnodes {
        border-left: 1px dotted #dfdfdf;
    }

    .theme-light .tree-node span {
        font-size: 12px;
        color: #777;
    }

    .theme-light .list-group-item {
        position: relative;
        display: block;
        padding: .25rem .25rem;
        margin-bottom: -1px;
        background-color: #000;
        border: 1px solid rgba(0, 0, 0, .125);
    }

    .theme-light #fielddiv_g_lp_content_left,
    .theme-light #fielddiv_g_lp_content_right {
        margin-left: 7.5px;
        margin-right: 7.5px;
    }

    .theme-light .pobject_autocomplete {
        padding-bottom: 1px;
    }

    .theme-light a.sidemenu_toggle {
        background: #fff;
        margin-top: 1px;
    }

    .theme-light .backoffice_toolbar {
        top: 40px;
        transition: none !important;
    }

    .theme-light .navbar .btn-light {
        min-height: 37px;
    }
    .theme-light .navbar .btn-light:hover {
        background: #2383d8;
        border-color: #2383d8;
        color: #fff;
    }
    .theme-light table.dbliste a:visited {
        color: #6698ca;
    }

    .theme-light .backoffice-thumbnail {
        height: auto;
        width: auto;
    }
    .theme-light .legend,
    .theme-light legend {
        font-size: 1rem;
        margin: 0 0 4px;
    }
    .theme-light pre code {
        font-size: inherit;
        color: #e83e8c;
        word-break: normal;
    }

    .ope-flash.uk-grid {
        padding-right: 25px;
        margin-right: -25px;
    }
    .ope-flash {
        -webkit-animation: ope-flash 1.5s ease-out infinite;
        animation: ope-flash 1.5s ease-out infinite;
    }
    @-webkit-keyframes ope-flash {
        0% {
            background-color: rgba(251, 248, 178, 0);
            outline: 2px solid #fbf8b2;
            opacity: 1;
            transform: scale(1);
        }
        50% {
            background-color: rgba(251, 248, 178, 0.99);
            outline: 5px solid yellow;
            opacity: .6;
            transform: scale(1.01);
        }
        100% {
            background-color: rgba(251, 248, 178, 0);
            outline: 2px solid #fbf8b2;
            opacity: 1;
            transform: scale(1);
        }
    }
    @keyframes ope-flash {
        0% {
            background-color: rgba(251, 248, 178, 0);
            outline: 2px solid #fbf8b2;
            opacity: 1;
            transform: scale(1);
        }
        50% {
            background-color: rgba(251, 248, 178, 0.99);
            outline: 5px solid yellow;
            opacity: .6;
            transform: scale(1.01);
        }
        100% {
            background-color: rgba(251, 248, 178, 0);
            outline: 2px solid #fbf8b2;
            opacity: 1;
            transform: scale(1);
        }
    }

    .theme-light .col-form-label {
        padding-top: calc(.25rem + 1px);
        padding-bottom: calc(.25rem + 1px);
        line-height: 1;
    }

    .theme-light #sidebar_menu .active {
        background: #2383d8;
    }

    .theme-light #sidebar_menu .active a {
        color: #fff;
    }

    .theme-light .btn-primary.disabled,
    .theme-light .btn-primary:disabled,
    .theme-light .btn.disabled,
    .theme-light .btn:disabled {
        opacity: .3;
    }

    .theme-light .tree-node:last-child {
        border-bottom: none;
    }

    .theme-light .btn-light.focus,
    .theme-light .btn-light:focus {
        box-shadow: none !important;
        border: 1px solid #2383d8;
    }

    .theme-light .nav-tabs .nav-link:focus,
    .nav-tabs .nav-link:hover {
        border-color: #2786dc;
        color: #fff;
        background: #2786dc;
    }

    .theme-light .nav-tabs .nav-link.active {
        color: #ffffff;
        background-color: #2c91ec;
    }

    .theme-light .nav-tabs .nav-item.show .nav-link,
    .theme-light .nav-tabs .nav-link.active {
        border-color: #2c91ec;
    }

    .theme-light .nav-tabs {
        background-color: #dee2e6!important;
    }

    .theme-light .tab-content {
        border-left: 2px solid #dee2e6;
        border-right: 2px solid #dee2e6;
        border-bottom: 2px solid #dee2e6;
    }

    .theme-light .btn-secondary:hover {
        color: #fff !important;
        background-color: #2c91ec;
        border-color: #2c91ec;
    }

    .theme-light .table {
        margin-bottom: 0;
    }

    .theme-light .table td,
    .table th {
        vertical-align: middle;
        line-height: 1.2;
    }

    .theme-light .input-group button.input-group-text:hover {
        color: #fff;
        background-color: #0f7afa;
        border-color: #0f7afa;
    }

    .theme-light .table thead th {
        border-width: 1px;
    }

    .theme-light .form-control {
        padding: .25rem .75rem;
        line-height: 1.2;
        min-height: 28px;
    }

    .theme-light select.form-control[multiple],
    select.form-control[size],
    textarea.form-control {
        max-height: 253px;
    }

    .theme-light .bo-sidemenu li a,
    .theme-light .bo-sidemenu li a.collapsed.active {
        padding: 5px 12px;
    }
    .theme-light .bo-sidemenu {
        top: 40px;
        transition: none;
    }

    .theme-light .bo-sidemenu li.hover a,
    .theme-light .bo-sidemenu li a:hover {
        background-color: #2383d8!important;
        color: #fff;
    }

    .theme-light .bo-sidemenu ul li .sub-menu li.hover a,
    .theme-light .bo-sidemenu ul li .sub-menu li a:hover {
        padding-left: 15px;
    }

    .theme-light .bo-sidemenu ul ul {
        border-left: 1px dotted #424242;
    }

    .theme-light .form-inline {
        word-break: break-all;
    }

    .theme-light #artwg_assigned {
        width: 100%;
    }

    .theme-light .jstree-default.jstree-focused {
        padding: 10px 0;
        background: #f7f7f7;
    }

    .theme-light .jstree a {
        height: 20px;
    }

    .theme-light .jstree a:hover {
        background: #5eaaed;
        color: #fff;
    }

    .theme-light .jstree-default .jstree-clicked {
        background: #2383d8;
        border: 1px solid #2383d8;
        color: #ffffff;
    }

    .theme-light .input-group-text {
        padding: 0rem .75rem;
    }

    .theme-light .page-item.disabled .page-link {
        height: 32px;
    }

    .theme-light #dropzonePreview {
        border: 1px solid #99c0e1;
        background-color: #e4f3ff;
        padding: 5px 5px 5px 5px;
        min-height: 70px;
    }

    .theme-light #dropzoneControls {
        border-bottom: 1px solid #2383d8;
    }

    .theme-light #dropzoneControls span[data-action] {
        font-weight: bold;
        cursor: pointer;
        padding: 4px 10px;
    }

    .theme-light input[type="checkbox"]:checked {
      outline: 2px solid #0075ff;
    }
    `)
};

})();