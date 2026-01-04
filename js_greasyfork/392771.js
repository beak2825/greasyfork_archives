// ==UserScript==
// @name         Google Search Helper
// @author       Anton
// @namespace    google.com
// @description  Google Search Helper just for fun
// @license      Creative Commons Attribution License
// @version      1.007
// @include      http://www.google.*/search*
// @include      https://www.google.*/search*
// @include      https://www.google.*/*
// @include      https://encrypted.google.*/search*
// @include      https://encrypted.google.*/*
// @exclude      https://www.google.com/recaptcha/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/392771/Google%20Search%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/392771/Google%20Search%20Helper.meta.js
// ==/UserScript==

/*
 * This file is a Greasemonkey user script. To install it, you need
 * the Firefox plugin "Greasemonkey" (URL: http://greasemonkey.mozdev.org/)
 * After you installed the extension, restart Firefox and revisit
 * this script. Now you will see a new menu item "Install User Script"
 * in your tools menu.
 *
 * To uninstall this script, go to your "Tools" menu and select
 * "Manage User Scripts", then select this script from the list
 * and click uninstall :-)
 *
 * Creative Commons Attribution License (--> or Public Domain)
 * http://creativecommons.org/licenses/by/2.5/
*/

(function () {
    const css =
        '.gsh_block {position: absolute;' +
        'left: -30px;' +
        'padding: 10px;' +
        'border-radius: 20px;' +
        'width: 20px;' +
        'height: 20px;' +
        'text-align: center;' +
        'vertical-align: middle;}' +
        '.gsh_red {background-color: #FF9999;}';

    const Sites = {
        'litres.ru': {name: 'Litres', color: 'red'},
        '7books.ru': {name: 'Litres satellite', color: 'red'},
        'livelib.ru': {name: 'Litres satellite', color: 'red'},
        'litmir.biz': {name: 'Litres satellite', color: 'red'},
        'bookash.pro': {name: 'Litres satellite', color: 'red'},
        'aldebaran.ru': {name: 'Litres satellite', color: 'red'},
        'fictionbook.ru': {name: 'Litres satellite', color: 'red'},
        'avidreaders.ru': {name: 'Litres satellite', color: 'red'},
        'rosuchebnik.ru': {name: 'Rosuchebnik', color: 'red'},
        'drofa-ventana.ru': {name: 'Rosuchebnik satellite', color: 'red'}
    };

    const Helper = {
        extractHostname: function (url) {
            let hostname;
            //find & remove protocol (http, ftp, etc.) and get hostname

            if (url.indexOf("//") > -1) {
                hostname = url.split('/')[2];
            } else {
                hostname = url.split('/')[0];
            }

            // remove www
            if (hostname.indexOf("www.") === 0) hostname = hostname.substr(4);

            //find & remove port number
            hostname = hostname.split(':')[0];
            //find & remove "?"
            hostname = hostname.split('?')[0];

            return hostname;
        },
        append_stylesheet: function (css) {
            const styletag = document.createElement("style");
            styletag.setAttribute('type', 'text/css');
            styletag.setAttribute('media', 'screen');
            styletag.appendChild(document.createTextNode(css));

            document.getElementsByTagName('head')[0].appendChild(styletag);
        },
        init: function () {
            console.log("Google Search Helper is ONLINE");
            console.log("[Location]:", window.location.href);
            // modify the stylesheet
            Helper.append_stylesheet(css);
        }
    };

    Helper.init();

    if (typeof window['jQuery'] === "function") {
        const jQuery = window['jQuery'];

        const images = jQuery('.srg .g .rc .r a img');
        if (images.length) {
            for (let idx = 0; idx < images.length; idx++) {
                const image$ = jQuery(images[idx]);
                const alt = image$.attr('alt');

                const site = Helper.extractHostname(alt);
                const siteSettings = Sites[site];
                if (siteSettings) {
                    const $g = image$.closest('.g');
                    $g.prepend('<div class="gsh_block gsh_' + siteSettings.color + '" ' +
                               'title="' + siteSettings.name + '">' + siteSettings.name[0] + '</div>');
                    console.log(site + ': found');
                } else {
                    console.log(site);
                }
            }
        } else {
            const cites = jQuery('.srg .g .rc .r a[ping]:not(.fl)');
            for (let idx = 0; idx < cites.length; idx++) {
                const cite$ = jQuery(cites[idx]);
                const alt = cite$.attr('href');
                const site = Helper.extractHostname(alt);
                const siteSettings = Sites[site];
                if (siteSettings) {
                    const $g = cite$.closest('.g');
                    /*
                    opacity: 0.1;
                    background-color: rgba(255, 0, 0, 0.3);
                    border: 1px solid rgba(255, 0, 0, 0.3);
                    */
                    $g.css('opacity', '0.05');
                    $g.css('pointer-events', 'none');
                    console.log(site + ': found');
                } else {
                    console.log(site);
                }
            }
        }
    } else {
        console.log('JQUERY is ' + typeof window['jQuery'], window['jQuery'])
    }
})();