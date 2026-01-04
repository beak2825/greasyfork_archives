// ==UserScript==
// @name         Animation Replayer
// @namespace    https://mnsy.dev
// @version      2024-09-14
// @description  Add option to replay hatch animations.
// @author       Moons
// @match        https://pokefarm.com/party
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokefarm.com
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/515554/Animation%20Replayer.user.js
// @updateURL https://update.greasyfork.org/scripts/515554/Animation%20Replayer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = unsafeWindow.jQuery;

    if (!$) {
        console.error('jQuery is not loaded.');
        return;
    }

    function updateToEgg(div, pid, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.pokefarm.com/getEggSprite?summary=${pid}`,
            onload: function(response) {
                const eggSpriteUrl = response.responseText.trim().replace(/^"|"$/g, '');

                $(div).find(".pokemon")
                    .removeClass("pokemon")
                    .addClass("egg")
                    .css("background-image", `url('https://static.pokefarm.com/img/pkmn/${eggSpriteUrl}')`);

                if (callback) callback();
            }
        });
    }

    function hatchEgg(div, pokemonSpriteUrl, type) {
        const targetDiv = $(div).find(".pkmn");
        targetDiv.closest(".menu").removeClass("menu");

        let shiny1 = "";
        let shiny2 = "";

        switch(type) {
            case "shiny":
                shiny1 = "/img/particles/shiny1.png";
                shiny2 = "/img/particles/shiny2.png";
                break;
            case "albino":
                shiny1 = "/img/particles/albino1.png";
                shiny2 = "/img/particles/albino2.png";
                break;
            case "melanistic":
                shiny1 = "/img/particles/melan1.png";
                shiny2 = "/img/particles/melan2.png";
                break;
            case "normal":
                shiny1 = null;
                shiny2 = null;
                break;
        }

        $.PFQanim.hatch(targetDiv, pokemonSpriteUrl, {
            cracks: "/img/pkmn/cracks.png",
            spark: "/img/particles/spark.png",
            ...(shiny1 && { shiny1 }),
            ...(shiny2 && { shiny2 })
        }, function() {
            if(type === "normal") {
                const newDiv = $('<div></div>')
                .css('background-image', `url('${pokemonSpriteUrl}')`)
                .addClass('pokemon');

                targetDiv.prepend(newDiv);
            }
        });
    }

    function getPokemonType(div) {
        const nameDiv = div.find('.name');

        if (nameDiv.find('img[title*="[ALBINO]"]').length > 0) {
            return 'albino';
        }
        if (nameDiv.find('img[title*="[SHINY]"]').length > 0) {
            return 'shiny';
        }
        if (nameDiv.find('img[title*="[MELANISTIC]"]').length > 0) {
            return 'melanistic';
        }

        return 'normal';
    }

    setTimeout(() => {
        $('.party [data-pid]').each(function() {
            const div = $(this);
            const menu = div.find('div.menu');
            const existingItem = menu.find('label[data-menu="hatch"]');

            if (existingItem.length === 0) {
                const pid = div.attr('data-pid');
                const pokemonSpriteUrl = div.find('.pokemon').css('background-image').replace(/url\((['"])?(.*?)\1\)/gi, '$2');

                const newMenuItem = $('<label>Replay Animation</label><hr>');
                menu.prepend(newMenuItem);

                newMenuItem.on('click', function() {
                    $(this).text('Refresh required').addClass('disabled');

                    updateToEgg(div, pid, function() {
                        hatchEgg(div, pokemonSpriteUrl, getPokemonType(div));
                    });
                });
            }
        });
    }, 500);
})();