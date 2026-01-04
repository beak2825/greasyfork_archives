// ==UserScript==
// @name         Neopets OWLS Pricer
// @version      3.13
// @description  Automatically label NC items with OWLS value.
// @author       friendly-trenchcoat (edited for OWLS by rawbeee and Kaye)
// @match        ://*.neopets.com/inventory.phtml*
// @match        ://*.neopets.com/closet.phtml*
// @match        ://*.neopets.com/safetydeposit.phtml*
// @match        ://*.neopets.com/gallery/index.phtml*
// @match        ://*.items.jellyneo.net/*
// @match        ://*.jellyneo.net/?go=*
// @match        ://*.impress.openneo.net/*
// @namespace https://greasyfork.org/users/946095
// @downloadURL https://update.greasyfork.org/scripts/449538/Neopets%20OWLS%20Pricer.user.js
// @updateURL https://update.greasyfork.org/scripts/449538/Neopets%20OWLS%20Pricer.meta.js
// ==/UserScript==

/**
 * OWLS is a community resource that tracks the approximate value of NC items, based on real-world trades.
 *
 * The OWLS Team aims to maintain the accuracy of the guide as fully as possible, but please remember values are
 * often changing and with certain difficult-to-find or popular items it doesn't hurt to make a value check!
 *
 */

(function () {
    'use strict';
    $.get( "https://neo-owls.herokuapp.com/itemdata/owls_script/", function( data ) {

    if (data) {
        console.log('OWLS Pricer');
        console.log('OWLS values updated.');
        var OWLSString = JSON.stringify(data);
        var OWLS = JSON.parse(OWLSString);
    }
        if (OWLS) {
            createCSS();
            drawValues(OWLS);
        }
});

    function drawValues(OWLS) {
        // stealin this
        jQuery.fn.justtext = function () {
            return $(this).clone().children().remove().end().text();
        };

        if (document.URL.includes("neopets.com/inventory")) {
            if ($('#navnewsdropdown__2020').length) {
                // Beta Inventory
                $(document).ajaxSuccess(function () {
                    $('.item-subname:contains("wearable"):contains("Neocash"):not(:contains("no trade"))').each(function (i, el) {
                        let $parent = $(el).parent();
                        if (!$parent.find('.OWLS').length) {
                            const name = $parent.find('.item-name').text();
                            const value = OWLS[name] || '?';
                            $parent.children().eq(0).after(`<div class="OWLS"><div>${value}</div></div>`);
                        }
                    });
                });
            } else {
                // Classic Inventory
                $('td.wearable:contains(Neocash)').each(function (i, el) {
                    const name = $(el).justtext();
                    const value = OWLS[name] || '?';
                    $(el).append(`<div class="OWLS"><div>${value}</div></div>`);
                });
            }
        }

        // Closet
        else if (document.URL.includes("neopets.com/closet")) {
            $('td>b:contains("Artifact - 500")').each(function (i, el) {
                const name = $(el).justtext();
                const value = OWLS[name] || '?';
                $(el).parent().prev().append(`<div class="OWLS"><div>${value}</div></div>`);
            });
        }

        // SDB
        else if (document.URL.includes("neopets.com/safetydeposit")) {
            $('tr[bgcolor="#DFEAF7"]:contains(Neocash)').each(function (i, el) {
                const name = $(el).find('b').first().justtext();
                const value = OWLS[name] || '?';
                $(el).children().eq(0).append(`<div class="OWLS"><div>${value}</div></div>`);
            });
        }

        // Gallery
        else if (document.URL.includes("neopets.com/gallery")) {
            $('td>b.textcolor').each(function (i, el) {
                const name = $(el).text();
                const value = OWLS[name];
                if (value) $(el).before(`<div class="OWLS"><div>${value}</div></div>`);
            });
        }

        // JNIDB
        else if (document.URL.includes("items.jellyneo.net")) {
            $('img.item-result-image.nc').each((i, el) => {
                const name = $(el).attr('title').split(' - r')[0];
                const value = OWLS[name] || '?';
                let $parent = $(el).parent();
                let $next = $parent.next();
                if ($next.is('br')) $next.remove();
                $parent.after(`<div class="OWLS"><div>${value}</div></div>`);
            });
        }

        // JN Article
        else if (document.URL.includes("www.jellyneo.net")) {
            $('img[src*="/items/"]').each((i, el) => {
                const name = $(el).attr('title') || $(el).attr('alt');
                const value = OWLS[name];
                if (value) {
                    let $parent = $(el).parent();
                    let $next = $parent.next();
                    if ($next.is('br')) $next.remove();
                    $parent.after(`<div class="OWLS"><div>${value}</div></div>`);
                }
            });
        }

        // Classic DTI Customize
        else if (document.URL.includes("impress.openneo.net/wardrobe")) {
            $(document).ajaxSuccess(function (event, xhr, options) {
                if (options.url.includes('/items')) {
                    $('img.nc-icon').each((i, el) => {
                        let $parent = $(el).parent();
                        if (!$parent.find('.OWLS').length) {
                            const name = $parent.text().match(/ (\S.*)  i /)[1];
                            const value = OWLS[name] || '?';
                            $parent.children().eq(0).after(`<div class="OWLS"><div>${value}</div></div>`);
                        }
                    });
                }
            });
        }
        // Classic DTI User Profile
        else if (document.URL.includes("impress.openneo.net/user/")) {
            $('img.nc-icon').each((i, el) => {
                let $parent = $(el).parent();
                if (!$parent.find('.OWLS').length) {
                    const name = $parent.find('span.name').text();
                    const value = OWLS[name] || '?';
                    $parent.children().eq(0).after(`<div class="OWLS"><div>${value}</div></div>`);
                }
            });
        }
        // Classic DTI Item
        else if (document.URL.includes("impress.openneo.net/items")) {
            if ($('img.nc-icon').length) {
                const name = $("#item-name").text();
                const value = OWLS[name] || '?';
                $("#item-name").after(`<div class="OWLS"><div>${value}</div></div>`);
            }
            //$('header#item-header>div').append($(`<a href="https://impress-2020.openneo.net/items/search/${encodeURIComponent(name)}" target="_blank">DTI 2020</a>`));
            $('header#item-header>div').append($(`<a href="https://impress-2020.openneo.net/items/${$('#item-preview-header > a').attr('href').split('=').pop()}" target="_blank">DTI 2020</a>`));
        }
    }

    function createCSS() {
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = `
            .OWLS {
                display: flex;
            }
            .OWLS div {
                font-family: "Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif;
                font-size: 12px;
                font-weight: bold;
                line-height: normal;
                text-align: center;
                color: #fff;
                background: #8A68AD;
                border-radius: 10px;
                padding: 0.05em 0.5em;
                margin: 3px auto;
            }
        `;
        document.body.appendChild(css);
    }
})();