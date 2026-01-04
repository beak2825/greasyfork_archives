// ==UserScript==
// @name         Neopets Lebron NC Values
// @version      1.0.0
// @description  Automatically label NC items with Lebron value.
// @author       friendly-trenchcoat (edited for lebron by sharkie)
// @match        *://*.neopets.com/inventory.phtml*
// @match        *://*.neopets.com/closet.phtml*
// @match        *://*.neopets.com/safetydeposit.phtml*
// @match        *://*.neopets.com/gallery/index.phtml*
// @match        *://*.jellyneo.net/*
// @match        *://*.jellyneo.net/?go=*
// @match        *://*impress.openneo.net/*
// @namespace https://greasyfork.org/en/users/1328493
// @downloadURL https://update.greasyfork.org/scripts/540477/Neopets%20Lebron%20NC%20Values.user.js
// @updateURL https://update.greasyfork.org/scripts/540477/Neopets%20Lebron%20NC%20Values.meta.js
// ==/UserScript==

/**
 * Lebron is part of the stylisher project on neopets, a community resource for all things neocash.
 * Lebron is the current host for our NC Value Guide, tracking the value of all tradeable NC items
 * based on trade data that we receive and process. If you see an asterisk next to a value, that indicates
 * that there is potential data instability detected in the reports we've received, and we advise you
 * to run a value check on that item.
 *
 * Credits:
 * Most of this script was pulled from the OWLS userscript and modified to support lebron values.
 * Big thank you to Kaye for supporting us and giving us permission to reuse the code.
 * I'm not entirely sure on the history of this script, but to my knowledge, I believe
 * the original author is friendly-trenchcoat, and it was edited for OWLs by rawbeee and Kaye.
 * I've modified it once again to support more items (unwearables/tokens) and lebron values.
 *
 */

(function () {
    'use strict';
    $.get( "https://lebron-values.netlify.app/item_values.json", function( data ) {

    if (data) {
        console.log('The goat is here.');
        console.log('The goat has spoken.');
        var lebronString = JSON.stringify(data);
        var lebron = JSON.parse(lebronString);
    }
        if (lebron) {
            createCSS();
            drawValues(lebron);
        }
});

    function drawValues(lebron) {
        // stealin this
        jQuery.fn.justtext = function () {
            return $(this).clone().children().remove().end().text();
        };

        if (document.URL.includes("neopets.com/inventory")) {
            if ($('#navnewsdropdown__2020').length) {
                // Beta Inventory
                $(document).ajaxSuccess(function () {
                    $('.item-subname:contains("Neocash"):not(:contains("no trade"))').each(function (i, el) {
                        let $parent = $(el).parent();
                        if (!$parent.find('.lebron').length) {
                            const name = $parent.find('.item-name').text();
                            const value = lebron[normalizeItemName(name)];
                            if(value) {
                                $parent.children().eq(0).after(`<div class="lebron"><div>${value}</div></div>`);
                            }
                        }
                    });
                });
            } else {
                // Classic Inventory
                $('td.wearable:contains(Neocash)').each(function (i, el) {
                    const name = $(el).justtext();
                    const value = lebron[normalizeItemName(name)] || '?';
                    $(el).append(`<div class="lebron"><div>${value}</div></div>`);
                });
            }
        }

        // Closet
        else if (document.URL.includes("neopets.com/closet")) {
            $('td>b:contains("Artifact - 500")').each(function (i, el) {
                const name = $(el).justtext();
                const value = lebron[normalizeItemName(name)] || '?';
                $(el).parent().prev().append(`<div class="lebron"><div>${value}</div></div>`);
            });
        }

        // SDB
        else if (document.URL.includes("neopets.com/safetydeposit")) {
            $('tr:contains(Neocash)').each(function (i, el) {
                const name = $(el).find('b').first().justtext();
                const value = lebron[normalizeItemName(name)];
                if(value) {
                    $(el).children().eq(0).append(`<div class="lebron"><div>${value}</div></div>`);
                }
            });
        }

        // Gallery
        else if (document.URL.includes("neopets.com/gallery")) {
            $('td>b.textcolor').each(function (i, el) {
                const name = $(el).text();
                const value = lebron[normalizeItemName(name)];
                if (value) $(el).before(`<div class="lebron"><div>${value}</div></div>`);
            });
        }

        // JNIDB
        else if (document.URL.includes("items.jellyneo.net")) {
            $('img.item-result-image.nc').each((i, el) => {
                const name = $(el).attr('title').split(' - r')[0];
                const value = lebron[normalizeItemName(name)];
                if(value) {
                    let $parent = $(el).parent();
                    let $next = $parent.next();
                    if ($next.is('br')) $next.remove();
                    $parent.after(`<div class="lebron"><div>${value}</div></div>`);
                }
            });
        }

        // JN Article
        else if (document.URL.includes("www.jellyneo.net")) {
            $('img[src*="/items/"]').each((i, el) => {
                const name = $(el).attr('title') || $(el).attr('alt');
                let value;
                if(name) {
                    value = lebron[normalizeItemName(name)];
                }
                if (value) {
                    let $parent = $(el).parent();
                    let $next = $parent.next();
                    if ($next.is('br')) $next.remove();
                    $parent.after(`<div class="lebron"><div>${value}</div></div>`);
                }
            });
        }

        // Classic DTI Customize
        else if (document.URL.includes("impress.openneo.net/wardrobe")) {
            $(document).ajaxSuccess(function (event, xhr, options) {
                if (options.url.includes('/items')) {
                    $('img.nc-icon').each((i, el) => {
                        let $parent = $(el).parent();
                        if (!$parent.find('.lebron').length) {
                            const name = $parent.text().match(/ (\S.*)  i /)[1];
                            const value = lebron[normalizeItemName(name)] || '?';
                            $parent.children().eq(0).after(`<div class="lebron"><div>${value}</div></div>`);
                        }
                    });
                }
            });
        }
        // Classic DTI User Profile
        else if (document.URL.includes("impress.openneo.net/user/")) {
            $('img.nc-icon').each((i, el) => {
                let $parent = $(el).parent();
                if (!$parent.find('.lebron').length) {
                    const name = $parent.find('span.name').text();
                    const value = lebron[normalizeItemName(name)] || '?';
                    $parent.children().eq(0).after(`<div class="lebron"><div>${value}</div></div>`);
                }
            });
        }
        // Classic DTI Item
        else if (document.URL.includes("impress.openneo.net/items")) {
            if ($('img.nc-icon').length) {
                const name = $("#item-name").text();
                const value = lebron[normalizeItemName(name)] || '?';
                $("#item-name").after(`<div class="lebron"><div>${value}</div></div>`);
            }
            //$('header#item-header>div').append($(`<a href="https://impress-2020.openneo.net/items/search/${encodeURIComponent(name)}" target="_blank">DTI 2020</a>`));
            $('header#item-header>div').append($(`<a href="https://impress-2020.openneo.net/items/${$('#item-preview-header > a').attr('href').split('=').pop()}" target="_blank">DTI 2020</a>`));
        }
    }

    function createCSS() {
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = `
            .lebron {
                display: flex;
            }
            .lebron div {
                font-family: "Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif;
                font-size: 12px;
                font-weight: bold;
                line-height: normal;
                text-align: center;
                color: #fff;
                background: #0072B2;
                border-radius: 10px;
                padding: 0.05em 0.5em;
                margin: 3px auto;
            }
        `;
        document.body.appendChild(css);
    }

    function normalizeItemName(name) {
        // Normalize spacing around colons
        name = name.trim().replace(/\s*:\s*/g, ': ');

        // Collapse multiple spaces
        name = name.replace(/\s{2,}/g, ' ');

        const lower = name.toLowerCase();

        return lower;
    }

})();