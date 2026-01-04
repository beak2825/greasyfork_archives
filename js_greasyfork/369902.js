// ==UserScript==
// @name         Munzee Specials
// @namespace    https://greasyfork.org/users/156194
// @version      0.44
// @description  Show icons in front of the name of your own creatures at https://www.munzee.com/specials/
// @author       rabe85
// @match        https://www.munzee.com/specials
// @match        https://www.munzee.com/specials/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=munzee.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/369902/Munzee%20Specials.user.js
// @updateURL https://update.greasyfork.org/scripts/369902/Munzee%20Specials.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function munzee_specials() {


        // Einstellungen laden
        var munzee_setting_specials_url = GM_getValue('munzee_setting_specials_url', 'v4');


        // Einstellungen speichern - v3 Pins
        function save_settings_v3pins() {
            GM_setValue('munzee_setting_specials_url', 'v3');
            location.reload();
        }


        // Einstellungen speichern - v4 Pins
        function save_settings_v4pins() {
            GM_setValue('munzee_setting_specials_url', 'v4');
            location.reload();
        }


        // Einstellung ändern
        var specials_url_link = "";
        var own_specials_map = document.getElementsByClassName('map-wrap')[1];
        var own_creatures_count = 0;
        var own_creatures_div = document.getElementsByClassName('alert alert-info')[0];
        if(own_creatures_div) {
            own_creatures_count = own_creatures_div.innerHTML.split('Your ').length - 1;
        }
        if(munzee_setting_specials_url == 'v3') {
            specials_url_link = '<div style="font-family: Ubuntu,sans-serif; font-weight: 400; font-style: italic; font-size: 23px; color: #999; border-bottom: 1px solid #999; margin-bottom: 10px; padding-bottom: 30px;"><span style="float:left;">' + own_creatures_count + ' Own Creatures</span> <span style="float:right; cursor: pointer; font-size: small; margin-top: 10px;" id="save_settings_v4pins">Show v4 Pins</span></div>';
            if(own_specials_map) {
                own_specials_map.insertAdjacentHTML('beforebegin', specials_url_link);
                document.getElementById('save_settings_v4pins').addEventListener("click", save_settings_v4pins, false);
            }
        } else {
            specials_url_link = '<div style="font-family: Ubuntu,sans-serif; font-weight: 400; font-style: italic; font-size: 23px; color: #999; border-bottom: 1px solid #999; margin-bottom: 10px; padding-bottom: 30px;"><span style="float:left;">' + own_creatures_count + ' Own Creatures</span> <span style="float:right; cursor: pointer; font-size: small; margin-top: 10px;" id="save_settings_v3pins">Show v3 Pins</span></div>';
            if(own_specials_map) {
                own_specials_map.insertAdjacentHTML('beforebegin', specials_url_link);
                document.getElementById('save_settings_v3pins').addEventListener("click", save_settings_v3pins, false);
            }
        }


        // URL zuweisen
        var url = "";
        if(munzee_setting_specials_url == "v3") {
            url = "https://www.otb-server.de/munzee/v3pins/";
        } else {
            url = "https://munzee.global.ssl.fastly.net/images/pins/";
        }


        // Alle URLs ersetzen:
        var icon_urls = document.querySelectorAll("img[src^='https://munzee.global.ssl.fastly.net/images/'], img[src^='https://munzee.freetls.fastly.net/images/']");
        for(var iu = 0, icon_url; !!(icon_url=icon_urls[iu]); iu++) {
            var icon_old = icon_url.getAttribute('src');
            var icon_new = "";
            if(munzee_setting_specials_url == "v3") {
                icon_new = icon_old.replace("https://munzee.global.ssl.fastly.net/images/pins/", url);
                icon_new = icon_new.replace("https://munzee.freetls.fastly.net/images/pins/", url);
                if(icon_new !== null && icon_new != icon_old) {
                    icon_url.setAttribute('src', icon_new);
                }
            }
        }


        // "title" und "alt" bei Filtericons hinzufügen
        var filter_icon0 = document.getElementsByClassName('icon-btn');
        for(var fi = 0, filter_icon; !!(filter_icon=filter_icon0[fi]); fi++) {
            var filter_icon_src = filter_icon.getElementsByTagName('img')[0].getAttribute('src').split('/');
            var filter_icon_filename = filter_icon_src[filter_icon_src.length - 1].split('.')[0];
            filter_icon.getElementsByTagName('img')[0].setAttribute('title', filter_icon_filename.charAt(0).toUpperCase() + filter_icon_filename.slice(1));
            filter_icon.getElementsByTagName('img')[0].setAttribute('alt', filter_icon_filename.charAt(0).toUpperCase() + filter_icon_filename.slice(1));
        }


        // "title" und "alt" bei Legendenicons hinzufügen
        var legende_captures_icon0 = document.getElementsByClassName('captures-grid-rows')[0].getElementsByClassName('grid-row');
        for(var lci = 0, legende_captures_icon; !!(legende_captures_icon=legende_captures_icon0[lci]); lci++) {
            var legende_icon_src = legende_captures_icon.getElementsByTagName('img')[0].getAttribute('src').split('/');
            var legende_icon_filename = legende_icon_src[legende_icon_src.length - 1].split('.')[0];
            legende_captures_icon.getElementsByTagName('img')[0].setAttribute('title', legende_icon_filename.charAt(0).toUpperCase() + legende_icon_filename.slice(1));
            legende_captures_icon.getElementsByTagName('img')[0].setAttribute('alt', legende_icon_filename.charAt(0).toUpperCase() + legende_icon_filename.slice(1));

        }


        // Eigene Specials - Icon hinzufügen
        if(own_creatures_div) {
            var own_creatures0 = own_creatures_div.querySelectorAll('a');
            for(var oc = 0, own_creatures; !!(own_creatures=own_creatures0[oc]); oc++) {
                if(own_creatures.innerHTML.indexOf(' #') != -1) { // Nur Links mit # im Namen
                    if(own_creatures.innerHTML.indexOf('Battle Unicorn') != -1) { // Mythological - Unicorn Variant
                        own_creatures.innerHTML = '<img src="' + url + 'battleunicorn.png" title="Battle Unicorn" alt="Battle Unicorn" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Hippocamp Unicorn') != -1) { // Mythological - Unicorn Variant
                        own_creatures.innerHTML = '<img src="' + url + 'hippocampunicorn.png" title="Hippocamp Unicorn" alt="Hippocamp Unicorn" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Trojan Unicorn') != -1) { // Clan Wars Reward - since 06/2020
                        own_creatures.innerHTML = '<img src="' + url + 'trojanunicorn.png" title="Trojan Unicorn" alt="Trojan Unicorn" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Rainbow Unicorn') != -1) { // MHQ Myth
                        own_creatures.innerHTML = '<img src="' + url + 'rainbowunicorn.png" title="Rainbow Unicorn" alt="Rainbow Unicorn" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Candy Corn Unicorn') != -1) { // Mythological - Unicorn Variant (Halloween Special 2021)
                        own_creatures.innerHTML = '<img src="' + url + 'candycornunicorn.png" title="Candy Corn Unicorn" alt="Candy Corn Unicorn" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Unicorn') != -1) { // Mythological - Unicorn
                        own_creatures.innerHTML = '<img src="' + url + 'theunicorn.png" title="Unicorn" alt="Unicorn" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Goblin Leprechaun') != -1) { // Mythological - Leprechaun Variant
                        own_creatures.innerHTML = '<img src="' + url + 'goblinleprechaun.png" title="Goblin Leprechaun" alt="Goblin Leprechaun" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Dwarf Leprechaun') != -1) { // Mythological - Leprechaun Variant
                        own_creatures.innerHTML = '<img src="' + url + 'dwarfleprechaun.png" title="Dwarf Leprechaun" alt="Dwarf Leprechaun" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Leprechaun') != -1) { // Mythological - Leprechaun
                        own_creatures.innerHTML = '<img src="' + url + 'leprechaun.png" title="Leprechaun" alt="Leprechaun" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('LepreCorn') != -1) { // Mythological - Leprechaun Variant (Halloween Special 2021)
                        own_creatures.innerHTML = '<img src="' + url + 'leprecorn.png" title="LepreCorn" alt="LepreCorn" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Chinese Dragon') != -1) { // Mythological - Dragon Variant
                        own_creatures.innerHTML = '<img src="' + url + 'chinesedragon.png" title="Chinese Dragon" alt="Chinese Dragon" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Wyvern Dragon') != -1) { // Mythological - Dragon Variant
                        own_creatures.innerHTML = '<img src="' + url + 'wyverndragon.png" title="Wyvern Dragon" alt="Wyvern Dragon" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Ice Dragon') != -1) { // MHQ Myth
                        own_creatures.innerHTML = '<img src="' + url + 'icedragon.png" title="Ice Dragon" alt="Ice Dragon" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Midnight Dragon') != -1) { // Mythological - Dragon Variant (Halloween Special 2021)
                        own_creatures.innerHTML = '<img src="' + url + 'midnightdragon.png" title="Midnight Dragon" alt="Midnight Dragon" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Dragon') != -1) { // Mythological - Dragon
                        own_creatures.innerHTML = '<img src="' + url + 'dragon.png" title="Dragon" alt="Dragon" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Lycanthrope Yeti') != -1) { // Mythological - Yeti Variant
                        own_creatures.innerHTML = '<img src="' + url + 'lycanthropeyeti.png" title="Lycanthrope Yeti" alt="Lycanthrope Yeti" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Reptoid Yeti') != -1) { // Mythological - Yeti Variant
                        own_creatures.innerHTML = '<img src="' + url + 'reptoidyeti.png" title="Reptoid Yeti" alt="Reptoid Yeti" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Monster Yeti') != -1) { // Mythological - Yeti Variant (Halloween Special 2021)
                        own_creatures.innerHTML = '<img src="' + url + 'monsteryeti.png" title="Monster Yeti" alt="Monster Yeti" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Yeti') != -1) { // Mythological - Yeti
                        own_creatures.innerHTML = '<img src="' + url + 'yeti.png" title="Yeti" alt="Yeti" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Centaur Faun') != -1) { // Mythological - Faun Variant
                        own_creatures.innerHTML = '<img src="' + url + 'centaurfaun.png" title="Centaur Faun" alt="Centaur Faun" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Krampus Faun') != -1) { // Mythological - Faun Variant
                        own_creatures.innerHTML = '<img src="' + url + 'krampusfaun.png" title="Krampus Faun" alt="Krampus Faun" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Faun') != -1) { // Mythological - Faun
                        own_creatures.innerHTML = '<img src="' + url + 'faun.png" title="Faun" alt="Faun" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Cerberus Hydra') != -1) { // Mythological - Hydra Variant
                        own_creatures.innerHTML = '<img src="' + url + 'cerberushydra.png" title="Cerberus Hydra" alt="Cerberus Hydra" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Cthulhu Hydra') != -1) { // Mythological - Hydra Variant
                        own_creatures.innerHTML = '<img src="' + url + 'cthulhuhydra.png" title="Cthulhu Hydra" alt="Cthulhu Hydra" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Hydra') != -1) { // Mythological - Hydra
                        own_creatures.innerHTML = '<img src="' + url + 'hydra.png" title="Hydra" alt="Hydra" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Griffin Pegasus') != -1) { // Mythological - Pegasus Variant
                        own_creatures.innerHTML = '<img src="' + url + 'griffinpegasus.png" title="Griffin Pegasus" alt="Griffin Pegasus" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Alicorn Pegasus') != -1) { // Mythological - Pegasus Variant
                        own_creatures.innerHTML = '<img src="' + url + 'alicornpegasus.png" title="Alicorn Pegasus" alt="Alicorn Pegasus" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Fire Pegasus') != -1) { // MHQ Myth
                        own_creatures.innerHTML = '<img src="' + url + 'firepegasus.png" title="Fire Pegasus" alt="Fire Pegasus" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Nightmare Pegasus') != -1) { // Mythological - Pegasus Variant (Halloween Special 2021)
                        own_creatures.innerHTML = '<img src="' + url + 'nightmarepegasus.png" title="Nightmare Pegasus" alt="Nightmare Pegasus" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Pegasus') != -1) { // Mythological - Pegasus
                        own_creatures.innerHTML = '<img src="' + url + 'pegasus.png" title="Pegasus" alt="Pegasus" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Minotaur Cyclops') != -1) { // Mythological - Cyclops Variant
                        own_creatures.innerHTML = '<img src="' + url + 'minotaurcyclops.png" title="Minotaur Cyclops" alt="Minotaur Cyclops" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Balor Cyclops') != -1) { // Mythological - Cyclops Variant
                        own_creatures.innerHTML = '<img src="' + url + 'balorcyclops.png" title="Balor Cyclops" alt="Balor Cyclops" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Cyclops') != -1) { // Mythological - Cyclops
                        own_creatures.innerHTML = '<img src="' + url + 'cyclops.png" title="Cyclops" alt="Cyclops" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Tuliferno') != -1) { // Fire Pouch Creature - Level 3
                        own_creatures.innerHTML = '<img src="' + url + 'tuliferno.png" title="Tuliferno" alt="Tuliferno" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Tulimber') != -1) { // Fire Pouch Creature - Level 2
                        own_creatures.innerHTML = '<img src="' + url + 'tulimber.png" title="Tulimber" alt="Tulimber" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Tuli') != -1) { // Fire Pouch Creature - Level 1
                        own_creatures.innerHTML = '<img src="' + url + 'tuli.png" title="Tuli" alt="Tuli" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Vesisaur') != -1) { // Water Pouch Creature - Level 3
                        own_creatures.innerHTML = '<img src="' + url + 'vesisaur.png" title="Vesisaur" alt="Vesisaur" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Vesial') != -1) { // Water Pouch Creature - Level 2
                        own_creatures.innerHTML = '<img src="' + url + 'vesial.png" title="Vesial" alt="Vesial" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Vesi') != -1) { // Water Pouch Creature - Level 1
                        own_creatures.innerHTML = '<img src="' + url + 'vesi.png" title="Vesi" alt="Vesi" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Hot Spring Mermaid') != -1) { // Mythological - Mermaid Variant
                        own_creatures.innerHTML = '<img src="' + url + 'hotspringmermaid.png" title="Hot Spring Mermaid" alt="Hot Spring Mermaid" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Melusine Mermaid') != -1) { // Mythological - Mermaid Variant
                        own_creatures.innerHTML = '<img src="' + url + 'melusinemermaid.png" title="Melusine Mermaid" alt="Melusine Mermaid" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Merry Mermaid') != -1) { // Mythological - Mermaid Variant (Event QRates christmas 2021)
                        own_creatures.innerHTML = '<img src="' + url + 'merrymermaid.png" title="Merry Mermaid" alt="Merry Mermaid" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Mermaid') != -1) { // Mythological - Mermaid
                        own_creatures.innerHTML = '<img src="' + url + 'mermaid.png" title="Mermaid" alt="Mermaid" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Dryad Fairy') != -1) { // Mythological - Fairy Variant
                        own_creatures.innerHTML = '<img src="' + url + 'dryadfairy.png" title="Dryad Fairy" alt="Dryad Fairy" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Sugar Plum Fairy') != -1) { // Mythological - Fairy Variant (Christmas skin 2021)
                        own_creatures.innerHTML = '<img src="' + url + 'sugarplumfairy.png" title="Sugar Plum Fairy" alt="Sugar Plum Fairy" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Fairy Godmother') != -1) { // MHQ Myth
                        own_creatures.innerHTML = '<img src="' + url + 'fairygodmother.png" title="Fairy Godmother" alt="Fairy Godmother" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Wildfire Fairy') != -1) { // Mythological - Fairy Variant
                        own_creatures.innerHTML = '<img src="' + url + 'wildfirefairy.png" title="Wildfire Fairy" alt="Wildfire Fairy" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Fairy') != -1) { // Mythological - Fairy
                        own_creatures.innerHTML = '<img src="' + url + 'fairy.png" title="Fairy" alt="Fairy" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Murutain') != -1) { // Earth Pouch Creature - Level 3
                        own_creatures.innerHTML = '<img src="' + url + 'murutain.png" title="Murutain" alt="Murutain" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Muruchi') != -1) { // Earth Pouch Creature - Level 2
                        own_creatures.innerHTML = '<img src="' + url + 'muruchi.png" title="Muruchi" alt="Muruchi" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Muru') != -1) { // Earth Pouch Creature - Level 1
                        own_creatures.innerHTML = '<img src="' + url + 'muru.png" title="Muru" alt="Muru" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Cold Flat Rob') != -1) { // Fancy Flat Rob - Cold Flat Rob
                        own_creatures.innerHTML = '<img src="' + url + 'coldflatrob.png" title="Cold Flat Rob" alt="Cold Flat Rob" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Beach Flat Rob') != -1) { // Fancy Flat Rob - Beach Flat Rob
                        own_creatures.innerHTML = '<img src="' + url + 'beachflatrob.png" title="Beach Flat Rob" alt="Beach Flat Rob" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Tux Flat Rob') != -1) { // Fancy Flat Rob - Tux Flat Rob
                        own_creatures.innerHTML = '<img src="' + url + 'tuxflatrob.png" title="Tux Flat Rob" alt="Tux Flat Rob" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Mitmegu') != -1) { // Mitmegu Pouch Creature
                        own_creatures.innerHTML = '<img src="' + url + 'mitmegu.png" title="Mitmegu" alt="Mitmegu" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Jootmegu') != -1) { // Mitmegu Pouch Creature - Jootmegu
                        own_creatures.innerHTML = '<img src="' + url + 'jootmegu.png" title="Jootmegu" alt="Jootmegu" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Rohimegu') != -1) { // Mitmegu Pouch Creature - Rohimegu
                        own_creatures.innerHTML = '<img src="' + url + 'rohimegu.png" title="Rohimegu" alt="Rohimegu" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Lokemegu') != -1) { // Mitmegu Pouch Creature - Lokemegu
                        own_creatures.innerHTML = '<img src="' + url + 'lokemegu.png" title="Lokemegu" alt="Lokemegu" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Harpy Banshee') != -1) { // Mythological - Banshee Variant
                        own_creatures.innerHTML = '<img src="' + url + 'harpybanshee.png" title="Harpy Banshee" alt="Harpy Banshee" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Witch Banshee') != -1) { // Mythological - Banshee Variant
                        own_creatures.innerHTML = '<img src="' + url + 'witchbanshee.png" title="Witch Banshee" alt="Witch Banshee" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Ghost of Christmas Future') != -1) { // Mythological - Banshee Variant (Christmas skin 2021)
                        own_creatures.innerHTML = '<img src="' + url + 'ghostofchristmasfuture.png" title="Ghost of Christmas Future" alt="Ghost of Christmas Future" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Banshee') != -1) { // Mythological - Banshee
                        own_creatures.innerHTML = '<img src="' + url + 'banshee.png" title="Banshee" alt="Banshee" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Pimedus') != -1) { // Pouch Creature - Pimedus
                        own_creatures.innerHTML = '<img src="' + url + 'pimedus.png" title="Pimedus" alt="Pimedus" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Matt’er Up Flat Matt') != -1) { // Fancy Flat Matt - Matt’er Up Flat Matt
                        own_creatures.innerHTML = '<img src="' + url + 'matt\'erupflatmatt.png" title="Matt’er Up Flat Matt" alt="Matt’er Up Flat Matt" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Face-Off Flat Matt') != -1) { // Fancy Flat Matt - Face-Off Flat Matt
                        own_creatures.innerHTML = '<img src="' + url + 'face-offflatmatt.png" title="Face-Off Flat Matt" alt="Face-Off Flat Matt" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Footy Flat Matt') != -1) { // Fancy Flat Matt - Footy Flat Matt
                        own_creatures.innerHTML = '<img src="' + url + 'footyflatmatt.png" title="Footy Flat Matt" alt="Footy Flat Matt" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Vampire Nymph') != -1) { // Mythological - Nymph Variant
                        own_creatures.innerHTML = '<img src="' + url + 'vampirenymph.png" title="Vampire Nymph" alt="Vampire Nymph" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Elf Nymph') != -1) { // Mythological - Nymph Variant
                        own_creatures.innerHTML = '<img src="' + url + 'elfnymph.png" title="Elf Nymph" alt="Elf Nymph" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Snow Queen Nymph') != -1) { // Mythological - Nymph Variant (Rob's list christmas 2021)
                        own_creatures.innerHTML = '<img src="' + url + 'snowqueennymph.png" title="Snow Queen Nymph" alt="Snow Queen Nymph" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Nymph') != -1) { // Mythological - Nymph
                        own_creatures.innerHTML = '<img src="' + url + 'nymph.png" title="Nymph" alt="Nymph" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Puflawn') != -1) { // Air Pouch Creature - Level 3
                        own_creatures.innerHTML = '<img src="' + url + 'puflawn.png" title="Puflawn" alt="Puflawn" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Pufrain') != -1) { // Air Pouch Creature - Level 2
                        own_creatures.innerHTML = '<img src="' + url + 'pufrain.png" title="Pufrain" alt="Pufrain" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Puffle') != -1) { // Air Pouch Creature - Level 1
                        own_creatures.innerHTML = '<img src="' + url + 'puffle.png" title="Puffle" alt="Puffle" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Magnetus') != -1) { // Pouch Creature - Magnetus
                        own_creatures.innerHTML = '<img src="' + url + 'magnetus.png" title="Magnetus" alt="Magnetus" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Ametust') != -1) { // Funfinity Stones Pouch Creature - Ametust
                        own_creatures.innerHTML = '<img src="' + url + 'ametust.png" title="Ametust" alt="Ametust" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Topaas') != -1) { // Funfinity Stones Pouch Creature - Topaas
                        own_creatures.innerHTML = '<img src="' + url + 'topaas.png" title="Topaas" alt="Topaas" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Oniks') != -1) { // Funfinity Stones Pouch Creature - Oniks
                        own_creatures.innerHTML = '<img src="' + url + 'oniks.png" title="Oniks" alt="Oniks" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Elektrivool') != -1) { // Electric Pouch Creature - Level 3
                        own_creatures.innerHTML = '<img src="' + url + 'elektrivool.png" title="Elektrivool" alt="Elektrivool" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Elekjoud') != -1) { // Electric Pouch Creature - Level 2
                        own_creatures.innerHTML = '<img src="' + url + 'elekjoud.png" title="Elekjoud" alt="Elekjoud" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Elekter') != -1) { // Electric Pouch Creature - Level 1
                        own_creatures.innerHTML = '<img src="' + url + 'elekter.png" title="Elekter" alt="Elekter" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Teemant') != -1) { // Funfinity Stones Pouch Creature - Teemant
                        own_creatures.innerHTML = '<img src="' + url + 'teemant.png" title="Teemant" alt="Teemant" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Smaragd') != -1) { // Funfinity Stones Pouch Creature - Smaragd
                        own_creatures.innerHTML = '<img src="' + url + 'smaragd.png" title="Smaragd" alt="Smaragd" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Poseidon') != -1) { // Modern Myth - Poseidon
                        own_creatures.innerHTML = '<img src="' + url + 'poseidon.png" title="Poseidon" alt="Poseidon" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Akvamariin') != -1) { // Funfinity Stones Pouch Creature - Akvamariin
                        own_creatures.innerHTML = '<img src="' + url + 'akvamariin.png" title="Akvamariin" alt="Akvamariin" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Rubiin') != -1) { // Funfinity Stones Pouch Creature - Rubiin
                        own_creatures.innerHTML = '<img src="' + url + 'rubiin.png" title="Rubiin" alt="Rubiin" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Aphrodite') != -1) { // Modern Myth - Aphrodite
                        own_creatures.innerHTML = '<img src="' + url + 'aphrodite.png" title="Aphrodite" alt="Aphrodite" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Safiir') != -1) { // Funfinity Stones Pouch Creature - Safiir
                        own_creatures.innerHTML = '<img src="' + url + 'safiir.png" title="Safiir" alt="Safiir" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Roosa') != -1) { // Funfinity Stones Pouch Creature - Roosa (Pink Diamond)
                        own_creatures.innerHTML = '<img src="' + url + 'roosa.png" title="Roosa" alt="Roosa" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Spyderbot') != -1) { // ZeeOps Reward - since 10/2020
                        own_creatures.innerHTML = '<img src="' + url + 'spyderbot.png" title="Spyderbot" alt="Spyderbot" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('InternationElles Flat Lou') != -1) { // Fancy Flat Lou - InternationElles Flat Lou
                        own_creatures.innerHTML = '<img src="' + url + 'internationellesflatlou.png" title="InternationElles Flat Lou" alt="InternationElles Flat Lou" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Team GB Flat Lou') != -1) { // Fancy Flat Lou - Team GB Flat Lou
                        own_creatures.innerHTML = '<img src="' + url + 'teamgbflatlou.png" title="Team GB Flat Lou" alt="Team GB Flat Lou" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Polka Dot Flat Lou') != -1) { // Fancy Flat Lou - Polka Dot Flat Lou
                        own_creatures.innerHTML = '<img src="' + url + 'polkadotflatlou.png" title="Polka Dot Flat Lou" alt="Polka Dot Flat Lou" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Hades') != -1) { // Modern Myth - Hades
                        own_creatures.innerHTML = '<img src="' + url + 'hades.png" title="Hades" alt="Hades" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Tsitriin') != -1) { // Funfinity Stones Pouch Creature - Tsitriin
                        own_creatures.innerHTML = '<img src="' + url + 'tsitriin.png" title="Tsitriin" alt="Tsitriin" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Golden LASER Shark') != -1) { // Secret ZeeOps - Operation: Green Thumb - 03/2021
                        own_creatures.innerHTML = '<img src="' + url + 'goldenlasershark.png" title="Golden L.A.S.E.R. Shark" alt="Golden L.A.S.E.R. Shark" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Arctic LASER Shark') != -1) { // Secret ZeeOps - Operation: Lady Luck - 05/2021
                        own_creatures.innerHTML = '<img src="' + url + 'arcticlasershark.png" title="Arctic L.A.S.E.R. Shark" alt="Arctic L.A.S.E.R. Shark" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('LASER Shark') != -1) { // Secret ZeeOps - Operation: ZEEcret Admirer - 02/2021
                        own_creatures.innerHTML = '<img src="' + url + 'lasershark.png" title="L.A.S.E.R. Shark" alt="L.A.S.E.R. Shark" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Kangaroo') != -1) { // Temporary Aussie Animal (16.01.2020 - 30.04.2020)
                        own_creatures.innerHTML = '<img src="' + url + 'kangarooaussieanimal.png" title="Kangaroo" alt="Kangaroo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Koala') != -1) { // Temporary Aussie Animal (16.01.2020 - 30.04.2020)
                        own_creatures.innerHTML = '<img src="' + url + 'koalaaussieanimal.png" title="Koala" alt="Koala" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Hedgehog') != -1) { // Temporary Baby Animal (01.05.2020 - 30.06.2020) - May Physical MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'hedgehog.png" title="Hedgehog" alt="Hedgehog" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Owlet') != -1) { // Temporary Baby Animal (01.05.2020 - 30.06.2020) - May Virtual MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'owlet.png" title="Owlet" alt="Owlet" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Polar Bear') != -1) { // Temporary Baby Animal (01.05.2020 - 30.06.2020) - May Hybrid MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'polarbear.png" title="Polar Bear" alt="Polar Bear" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Moose') != -1) { // Temporary Baby Camp Critters (01.08.2020 - 30.09.2020) - August Physical MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'babymoose.png" title="Moose" alt="Moose" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Fox') != -1) { // Temporary Baby Camp Critters (01.08.2020 - 30.09.2020) - August Virtual MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'babyfox.png" title="Fox" alt="Fox" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Squirrel') != -1) { // Temporary Baby Camp Critters (01.08.2020 - 30.09.2020) - August Hybrid MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'babysquirrel.png" title="Squirrel" alt="Squirrel" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Hippo') != -1) { // Temporary Baby Christmas Critters (01.11.2020 - 31.12.2020) - November Physical MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'babyhippo.png" title="Hippo" alt="Hippo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Alpaca') != -1) { // Temporary Baby Christmas Critters (01.11.2020 - 31.12.2020) - November Virtual MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'babyalpaca.png" title="Alpaca" alt="Alpaca" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Reindeer') != -1) { // Temporary Baby Christmas Critters (01.11.2020 - 31.12.2020) - November Hybrid MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'babyreindeer.png" title="Reindeer" alt="Reindeer" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Cybersaurus Rex') != -1) { // Temporary Cybersaurus Rex (30.11.2020 - 31.12.2020) - Cyber Munzday
                        own_creatures.innerHTML = '<img src="' + url + 'cybersaurusrex.png" title="Cybersaurus Rex" alt="Cybersaurus Rex" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Cyborg Santa') != -1) { // Temporary Cyborg Santa (01.12.2020 - 31.12.2020) - Holiday Card Collectors Club
                        own_creatures.innerHTML = '<img src="' + url + 'cyborgsanta.png" title="Cyborg Santa" alt="Cyborg Santa" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('GingerMech Man') != -1) { // Temporary GingerMech Man (13.12.2020 - 5 caps) - Holiday Card Collectors Club (Tier 3 gift)
                        own_creatures.innerHTML = '<img src="' + url + 'gingermechman.png" title="GingerMech Man" alt="GingerMech Man" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('31F') != -1) { // MHQ 31F (14.12.2020) - Holiday Card Collectors Club
                        own_creatures.innerHTML = '<img src="' + url + '31f.png" title="31F" alt="31F" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('ReinDroid') != -1) { // Temporary ReinDroid (15.12.2020 - 10 caps) - Holiday Card Collectors Club
                        own_creatures.innerHTML = '<img src="' + url + 'reindroid.png" title="ReinDroid" alt="ReinDroid" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('RUD01PH') != -1) { // Temporary RUD01PH (15.12.2020 - 10 caps) - Holiday Card Collectors Club
                        own_creatures.innerHTML = '<img src="' + url + 'rud01ph.png" title="RUD01PH" alt="RUD01PH" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('KrampBot') != -1) { // Temporary KrampBot (16.12.2020 - 5 caps) - Holiday Card Collectors Club
                        own_creatures.innerHTML = '<img src="' + url + 'krampbot.png" title="KrampBot" alt="KrampBot" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Fr057y') != -1) { // Temporary Fr057y (17.12.2020 - 02.02.2021) - Holiday Card Collectors Club (Reseller)
                        own_creatures.innerHTML = '<img src="' + url + 'fr057y.png" title="Fr057y" alt="Fr057y" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Ice Hockey Garden Gnome') != -1) { // Temporary Ice Hockey Garden Gnome (04.01.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'icehockeygardengnome.png" title="Ice Hockey Garden Gnome" alt="Ice Hockey Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Archery Garden Gnome') != -1) { // Temporary Archery Garden Gnome (01.02.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'archerygardengnome.png" title="Archery Garden Gnome" alt="Archery Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Basketball Garden Gnome') != -1) { // Temporary Basketball Garden Gnome (01.03.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'basketballgardengnome.png" title="Basketball Garden Gnome" alt="Basketball Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Aussie Explorer Garden Gnome') != -1) { // Temporary Reseller Garden Gnome - GEOLoggers (04.03.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'aussieexplorergardengnome.png" title="Aussie Explorer Garden Gnome" alt="Aussie Explorer Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Gold Miner Garden Gnome') != -1) { // Temporary Reseller Garden Gnome - Gold'n Coins (04.03.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'goldminergardengnome.png" title="Gold Miner Garden Gnome" alt="Gold Miner Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Queen’s Guardsman Garden Gnome') != -1) { // Temporary Reseller Garden Gnome - NE Geocaching Supplies UK (04.03.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'queen\'sguardsmangardengnome.png" title="Queen’s Guardsman Garden Gnome" alt="Queen’s Guardsman Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Astronaut Garden Gnome') != -1) { // Temporary Reseller Garden Gnome - Space Coast Geocaching Store (04.03.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'astronautgardengnome.png" title="Astronaut Garden Gnome" alt="Astronaut Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Running Garden Gnome') != -1) { // Temporary Running Garden Gnome (01.04.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'runninggardengnome.png" title="Running Garden Gnome" alt="Running Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Soccer Garden Gnome') != -1) { // Temporary Garden Gnome (01.05.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'soccergardengnome.png" title="Soccer Garden Gnome" alt="Soccer Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Skateboarding Garden Gnome') != -1) { // Temporary Garden Gnome (01.06.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'skateboardinggardengnome.png" title="Skateboarding Garden Gnome" alt="Skateboarding Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Baseball Garden Gnome') != -1) { // Temporary Garden Gnome (01.07.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'baseballgardengnome.png" title="Baseball Garden Gnome" alt="Baseball Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Award Show Garden Gnome') != -1) { // Temporary Garden Gnome - 10th Birthday Mailbox (01.07.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'awardshowgardengnome.png" title="Award Show Garden Gnome" alt="Award Show Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Cricket Garden Gnome') != -1) { // Temporary Garden Gnome (01.08.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'cricketgardengnome.png" title="Cricket Garden Gnome" alt="Cricket Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Football Garden Gnome') != -1) { // Temporary Garden Gnome (01.09.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'footballgardengnome.png" title="Football Garden Gnome" alt="Football Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Cycling Garden Gnome') != -1) { // Temporary Garden Gnome (01.10.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'cyclinggardengnome.png" title="Cycling Garden Gnome" alt="Cycling Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('eSports Garden Gnome') != -1) { // Temporary Garden Gnome (01.11.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'esportsgardengnome.png" title="eSports Garden Gnome" alt="eSports Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Skiing Garden Gnome') != -1) { // Temporary Garden Gnome (01.12.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'skiinggardengnome.png" title="Skiing Garden Gnome" alt="Skiing Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Stone Garden Gnome') != -1) { // Permanent Garden Gnome (01.01.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'stonegardengnome.png" title="Stone Garden Gnome" alt="Stone Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('New Years Eve Garden Gnome') != -1) { // Permanent Garden Gnome Skin (01.01.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'newyearsevegardengnome.png" title="New Years Eve Garden Gnome" alt="New Years Eve Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Garden Gnome') != -1) { // Temporary Garden Gnome (04.01.2021 - 31.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'gardengnome.png" title="Garden Gnome" alt="Garden Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Hamilton Hamzee') != -1) { // Temporary Hamilton Hamzee (21.01.2021 - 16.03.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'hamiltonhamzee.png" title="Hamilton Hamzee" alt="Hamilton Hamzee" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Special Delivery Cupid') != -1) { // Temporary Special Delivery Cupid (01.02.2021 - 28.02.2021) - Valentines Card Collectors Club
                        own_creatures.innerHTML = '<img src="' + url + 'specialdeliverycupid.png" title="Special Delivery Cupid" alt="Special Delivery Cupid" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Courier Owl') != -1) { // Temporary Baby Courier Critters (01.02.2021 - 31.03.2021) - February Physical MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'courierowl.png" title="Owl" alt="Owl" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Courier Pigeon') != -1) { // Temporary Baby Courier Critters (01.02.2021 - 31.03.2021) - February Virtual MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'courierpigeon.png" title="Pigeon" alt="Pigeon" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Courier Stork') != -1) { // Temporary Baby Courier Critters (01.02.2021 - 31.03.2021) - February Hybrid MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'courierstork.png" title="Stork" alt="Stork" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Jack In Zee Box') != -1) { // Temporary Jack In Zee Box (31.03.2021 - 11.05.2021 or 41 caps) - April Fools Special
                        own_creatures.innerHTML = '<img src="' + url + 'jackinzeebox.png" title="Jack In Zee Box" alt="Jack In Zee Box" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Doge Pup') != -1) { // Temporary Baby Courier Critters (01.04.2021 - 31.05.2021) - April Physical MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'dogepup.png" title="Doge Pup" alt="Doge Pup" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Itty Bitty Kitty') != -1) { // Temporary Baby Courier Critters (01.04.2021 - 31.05.2021) - April Virtual MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'ittybittykitty.png" title="Itty Bitty Kitty" alt="Itty Bitty Kitty" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Baby Monkey') != -1) { // Temporary Baby Courier Critters (01.04.2021 - 31.05.2021) - April Hybrid MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'babymonkey.png" title="Baby Monkey" alt="Baby Monkey" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Baby Panda') != -1) { // Temporary Baby WWF (21.05.2021 - 20.07.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'babypanda.png" title="Baby Panda" alt="Baby Panda" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Albino Baby Panda') != -1) { // Temporary Baby WWF (21.05.2021 - 20.07.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'albinobabypanda.png" title="Albino Baby Panda" alt="Albino Baby Panda" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('GeoLoggers RUMbot') != -1) { // Temporary Reseller RUMbot - GEOLoggers (16.06.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'geologgersrumbot.png" title="GeoLoggers RUMbot" alt="GeoLoggers RUMbot" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Gold\'n Coins RUMbot') != -1) { // Temporary Reseller RUMbot - Gold’n Coins (16.06.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'goldncoinsrumbot.png" title="Gold’n Coins RUMbot" alt="Gold’n Coins RUMbot" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('NEGS RUMbot') != -1) { // Temporary Reseller RUMbot - NEGS (16.06.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'negsrumbot.png" title="NEGS RUMbot" alt="NEGS RUMbot" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('SCGS RUMbot') != -1) { // Temporary Reseller RUMbot - SCGS (16.06.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'scgsrumbot.png" title="SCGS RUMbot" alt="SCGS RUMbot" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('S4RC0PH4GUS') != -1) { // Secret ZeeOps - Operation: QRypt Capper - 07/2021
                        own_creatures.innerHTML = '<img src="' + url + 's4rc0ph4gus.png" title="S4RC0PH4GUS" alt="S4RC0PH4GUS" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('MUMM33') != -1) { // Secret ZeeOps - Operation: QRypt Capper - 07/2021
                        own_creatures.innerHTML = '<img src="' + url + 'mumm33.png" title="MUMM33" alt="MUMM33" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Blue Baby Elephant') != -1) { // Temporary Baby Courier Critters (01.08.2021 - 30.09.2021) - August Physical MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'bluebabyelephant.png" title="Blue Baby Elephant" alt="Blue Baby Elephant" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Pink Baby Elephant') != -1) { // Temporary Baby Courier Critters (01.08.2021 - 30.09.2021) - August Virtual MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'pinkbabyelephant.png" title="Pink Baby Elephant" alt="Pink Baby Elephant" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Gray Baby Elephant') != -1) { // Temporary Baby Courier Critters (01.08.2021 - 30.09.2021) - August Hybrid MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'graybabyelephant.png" title="Gray Baby Elephant" alt="Gray Baby Elephant" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('MONK3Y') != -1) { // Secret ZeeOps - Operation: Jungle Jammer - 09/2021
                        own_creatures.innerHTML = '<img src="' + url + 'monk3y.png" title="MONK3Y" alt="MONK3Y" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('PriM8') != -1) { // Secret ZeeOps - Operation: Jungle Jammer - 09/2021
                        own_creatures.innerHTML = '<img src="' + url + 'prim8.png" title="PriM8" alt="PriM8" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('KiNG C0G') != -1) { // Secret ZeeOps - Operation: Jungle Jammer - 09/2021
                        own_creatures.innerHTML = '<img src="' + url + 'kingc0g.png" title="KiNG C0G" alt="KiNG C0G" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('SteinBot') != -1) { // Temporary Mechs - Oktoberfest (23.09.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'steinbot.png" title="SteinBot" alt="SteinBot" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('CarafeBorg') != -1) { // Temporary Mechs - Oktoberfest (23.09.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'carafeborg.png" title="CarafeBorg" alt="CarafeBorg" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('H3ADL3SS H0RS3MAN') != -1) { // Temporary Mechs - Halloween (04.10.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'h3adl3ssh0rs3man.png" title="H3ADL3SS H0RS3MAN" alt="H3ADL3SS H0RS3MAN" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Ohkmegu') != -1) { // Mitmegu Evolution (04.10.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'ohkmegu.png" title="Ohkmegu" alt="Ohkmegu" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Murinmegu') != -1) { // Mitmegu Evolution (04.10.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'murinmegu.png" title="Murinmegu" alt="Murinmegu" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Urgasmegu') != -1) { // Mitmegu Evolution (04.10.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'urgasmegu.png" title="Urgasmegu" alt="Urgasmegu" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Koobas') != -1) { // Void Pouch Creature - Level 1 (14.10.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'koobas.png" title="Koobas" alt="Koobas" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Kartus') != -1) { // Void Pouch Creature - Level 2 (14.10.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'kartus.png" title="Kartus" alt="Kartus" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Kabuhirm') != -1) { // Void Pouch Creature - Level 3 (14.10.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'kabuhirm.png" title="Kabuhirm" alt="Kabuhirm" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Baby Raccoon') != -1) { // Temporary Baby Courier Critters (01.11.2021 - 31.12.2021) - November Physical MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'raccoon.png" title="Baby Raccoon" alt="Baby Raccoon" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Giraffe Calf') != -1) { // Temporary Baby Courier Critters (01.11.2021 - 31.12.2021) - November Virtual MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'giraffecalf.png" title="Giraffe Calf" alt="Giraffe Calf" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Foal') != -1) { // Temporary Baby Courier Critters (01.11.2021 - 31.12.2021) - November Hybrid MunzPak
                        own_creatures.innerHTML = '<img src="' + url + 'foal.png" title="Foal" alt="Foal" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Zeus') != -1) { // Modern Myth - Zeus
                        own_creatures.innerHTML = '<img src="' + url + 'zeus.png" title="Zeus" alt="Zeus" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('TR33 T0PP3R') != -1) { // Temporary Mechs - Christmas Combat (01.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'tr33t0pp3r.png" title="TR33 T0PP3R" alt="TR33 T0PP3R" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('LOC04LMOTIVE') != -1) { // Temporary Mechs - Christmas Combat (08.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'loc04lmotive.png" title="LOC04LMOTIVE" alt="LOC04LMOTIVE" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('GWRENCH') != -1) { // Temporary Mechs - Christmas Combat (13.12.2021)
                        own_creatures.innerHTML = '<img src="' + url + 'gwrench.png" title="GWRENCH" alt="GWRENCH" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('New Year Garden Flamingo') != -1) { // New Year Garden Flamingo (01.02.2022 - 31.12.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'newyeargardenflamingo.png" title="New Year Garden Flamingo" alt="New Year Garden Flamingo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Lovely Garden Flamingo') != -1) { // Garden Flamingo (01.03.2022 - 31.12.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'lovelygardenflamingo.png" title="Lovely Garden Flamingo" alt="Lovely Garden Flamingo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Garden Flamingo') != -1) { // Garden Flamingo (01.04.2022 - 31.12.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'gardenflamingo.png" title="Garden Flamingo" alt="Garden Flamingo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Garden Flamingo') != -1) { // Garden Flamingo (01.05.2022 - 31.12.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'gardenflamingo.png" title="Garden Flamingo" alt="Garden Flamingo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Garden Flamingo') != -1) { // Garden Flamingo (01.06.2022 - 31.12.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'gardenflamingo.png" title="Garden Flamingo" alt="Garden Flamingo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Garden Flamingo') != -1) { // Garden Flamingo (01.07.2022 - 31.12.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'gardenflamingo.png" title="Garden Flamingo" alt="Garden Flamingo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Garden Flamingo') != -1) { // Garden Flamingo (01.08.2022 - 31.12.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'gardenflamingo.png" title="Garden Flamingo" alt="Garden Flamingo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Garden Flamingo') != -1) { // Garden Flamingo (01.09.2022 - 31.12.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'gardenflamingo.png" title="Garden Flamingo" alt="Garden Flamingo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Garden Flamingo') != -1) { // Garden Flamingo (01.10.2022 - 31.12.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'gardenflamingo.png" title="Garden Flamingo" alt="Garden Flamingo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Garden Flamingo') != -1) { // Garden Flamingo (01.11.2022 - 31.12.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'gardenflamingo.png" title="Garden Flamingo" alt="Garden Flamingo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Garden Flamingo') != -1) { // Garden Flamingo (01.12.2022 - 31.12.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'gardenflamingo.png" title="Garden Flamingo" alt="Garden Flamingo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Garden Flamingo') != -1) { // Garden Flamingo (01.01.2022 - 31.12.2022)
                        own_creatures.innerHTML = '<img src="' + url + 'gardenflamingo.png" title="Garden Flamingo" alt="Garden Flamingo" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Abominable SN0W Machine') != -1) { // Secret ZeeOps - Operation: ICEolation - 01/2022
                        own_creatures.innerHTML = '<img src="' + url + 'abominablesn0wmachine.png" title="Abominable SN0W Machine" alt="Abominable SN0W Machine" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('BreadBot') != -1) { // Munzpack Mech - 02/2022
                        own_creatures.innerHTML = '<img src="' + url + 'breadbot.png" title="BreadBot" alt="BreadBot" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Eros 404') != -1) { // Valentines Card Collectors Club - 02/2022
                        own_creatures.innerHTML = '<img src="' + url + 'eros404.png" title="Eros 404" alt="Eros 404" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('X Bot') != -1) { // Valentines Day 2022
                        own_creatures.innerHTML = '<img src="' + url + 'xbot.png" title="X Bot" alt="X Bot" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('O Bot') != -1) { // Valentines Day 2022
                        own_creatures.innerHTML = '<img src="' + url + 'obot.png" title="O Bot" alt="O Bot" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Gnome') != -1) { // MHQ Myth
                        own_creatures.innerHTML = '<img src="' + url + 'gnomeleprechaun.png" title="Gnome" alt="Gnome" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Sasquatch') != -1) { // MHQ Myth
                        own_creatures.innerHTML = '<img src="' + url + 'sasquatchyeti.png" title="Sasquatch" alt="Sasquatch" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Cherub') != -1) { // MHQ Myth
                        own_creatures.innerHTML = '<img src="' + url + 'cherub.png" title="Cherub" alt="Cherub" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Ogre') != -1) { // MHQ Myth
                        own_creatures.innerHTML = '<img src="' + url + 'ogre.png" title="Ogre" alt="Ogre" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Chimera') != -1) { // MHQ Myth
                        own_creatures.innerHTML = '<img src="' + url + 'chimera.png" title="Chimera" alt="Chimera" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Siren') != -1) { // MHQ Myth
                        own_creatures.innerHTML = '<img src="' + url + 'siren.png" title="Siren" alt="Siren" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Hadavale') != -1) { // MHQ Pouch
                        own_creatures.innerHTML = '<img src="' + url + 'hadavale.png" title="Hadavale" alt="Hadavale" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Gorgon') != -1) { // MHQ Myth
                        own_creatures.innerHTML = '<img src="' + url + 'gorgon.png" title="Gorgon" alt="Gorgon" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Mother Earth') != -1) { // MHQ Myth
                        own_creatures.innerHTML = '<img src="' + url + 'motherearth.png" title="Mother Earth" alt="Mother Earth" style="max-height: 32px;">' + own_creatures.innerHTML;
                    } else if(own_creatures.innerHTML.indexOf('Vikerkaar') != -1) { // MHQ Pouch
                        own_creatures.innerHTML = '<img src="' + url + 'vikerkaar.png" title="Vikerkaar" alt="Vikerkaar" style="max-height: 32px;">' + own_creatures.innerHTML;
                    }
                    if(own_creatures.innerHTML.indexOf('Your') != -1) { // 'Your' aus Link von Wartenden entfernen
                        own_creatures.innerHTML = own_creatures.innerHTML.replace("Your ","");
                        own_creatures.outerHTML = 'Your ' + own_creatures.outerHTML;
                    }
                }
            }
        }

    }

    // Auf Element der Seite warten
    function daten_gefunden() {
        waitForElm('button.icon-btn').then((elm) => {
            munzee_specials();
        });
    }

    // Daten nachgeladen?
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        daten_gefunden();
    } else {
        document.addEventListener('DOMContentLoaded', daten_gefunden, false);
    }

})();