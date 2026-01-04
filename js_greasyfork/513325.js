// ==UserScript==
// @name         [GC] 🎸 Missing Instruments
// @namespace    https://www.grundos.cafe/
// @version      2.3
// @description  Lists all the instruments you need to play with your pet.
// @match        https://www.grundos.cafe/instruments/?pet_name=*
// @license      MIT
// @author       AshyAsh
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513325/%5BGC%5D%20%F0%9F%8E%B8%20Missing%20Instruments.user.js
// @updateURL https://update.greasyfork.org/scripts/513325/%5BGC%5D%20%F0%9F%8E%B8%20Missing%20Instruments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of instruments with images and links
    const instrumentData = {
"Accordion": ["https://grundoscafe.b-cdn.net/items/mus_accordian.gif", "/search/items/?item_name=A Smatter of Mayo"],
"Afoxé": ["https://grundoscafe.b-cdn.net/items/mus_afoxe.gif", "/search/items/?item_name=Accordion"],
"Agogô": ["https://grundoscafe.b-cdn.net/items/mus_agogo.gif", "/search/items/?item_name=Afoxé"],
"Air Faerie Guitar": ["https://grundoscafe.b-cdn.net/items/inst_guitar_faerie.gif", "/search/items/?item_name=Agogô"],
"A Smatter of Mayo": ["https://grundoscafe.b-cdn.net/items/foo_smattering_mayo.gif", "/search/items/?item_name=Air Faerie Guitar"],
"Baby Drum": ["https://grundoscafe.b-cdn.net/items/inst_baby_drum.gif", "/search/items/?item_name=Baby Drum"],
"Baby Whistle": ["https://grundoscafe.b-cdn.net/items/inst_baby_whistle.gif", "/search/items/?item_name=Baby Whistle"],
"Bagpipes": ["https://grundoscafe.b-cdn.net/items/inst_bagpipes.gif", "/search/items/?item_name=Bagpipes"],
"Basic 12 Hole Ocarina": ["https://grundoscafe.b-cdn.net/items/basic_12_hole_ocarina.gif", "/search/items/?item_name=Basic 12 Hole Ocarina"],
"Bass Guitar": ["https://grundoscafe.b-cdn.net/items/mus_bass.gif", "/search/items/?item_name=Bass Guitar"],
"Berimbau": ["https://grundoscafe.b-cdn.net/items/mus_berimbau.gif", "/search/items/?item_name=Berimbau"],
"Berrante": ["https://grundoscafe.b-cdn.net/items/mus_berro.gif", "/search/items/?item_name=Berrante"],
"Blueberry Jelly Bass": ["https://grundoscafe.b-cdn.net/items/inst_jelly_bass.gif", "/search/items/?item_name=Blue Kazoo"],
"Blue Kazoo": ["https://grundoscafe.b-cdn.net/items/inst_kazoo_blue.gif", "/search/items/?item_name=Blue Moehawk Guitar"],
"Blue Moehawk Guitar": ["https://grundoscafe.b-cdn.net/items/moehawk_guitar2.gif", "/search/items/?item_name=Blueberry Jelly Bass"],
"Bongo Drums": ["https://grundoscafe.b-cdn.net/items/toy_bongo.gif", "/search/items/?item_name=Bongo Drums"],
"Bruce Maracas": ["https://grundoscafe.b-cdn.net/items/inst_bruce_maracas.gif", "/search/items/?item_name=Bruce Maracas"],
"Castanets": ["https://grundoscafe.b-cdn.net/items/imus_castanets.gif", "/search/items/?item_name=Castanets"],
"Cavaquinho": ["https://grundoscafe.b-cdn.net/items/mus_cavaco.gif", "/search/items/?item_name=Cavaquinho"],
"Cello": ["https://grundoscafe.b-cdn.net/items/mus_cello.gif", "/search/items/?item_name=Cello"],
"Clarinet": ["https://grundoscafe.b-cdn.net/items/toy_clarinet.gif", "/search/items/?item_name=Clarinet"],
"Colourful Xylophone": ["https://grundoscafe.b-cdn.net/items/toy_xylophone.gif", "/search/items/?item_name=Colourful Xylophone"],
"Double Neck Guitar": ["https://grundoscafe.b-cdn.net/items/inst_doubleneck_guitar.gif", "/search/items/?item_name=Double Neck Guitar"],
"Drum Kit": ["https://grundoscafe.b-cdn.net/items/toy_drumkit.gif", "/search/items/?item_name=Drum Kit"],
"Earth Faerie Recorder": ["https://grundoscafe.b-cdn.net/items/inst_recorder_faerie.gif", "/search/items/?item_name=Earth Faerie Recorder"],
"Electric Guitar": ["https://grundoscafe.b-cdn.net/items/mus_vguitar.gif", "/search/items/?item_name=Electric Guitar"],
"Faerie Ocarina": ["https://grundoscafe.b-cdn.net/items/faerie_ocarina.gif", "/search/items/?item_name=Faerie Ocarina"],
"Faerie Saxophone": ["https://grundoscafe.b-cdn.net/items/inst_saxaphone_faerie.gif", "/search/items/?item_name=Faerie Saxophone"],
"Fire Bass": ["https://grundoscafe.b-cdn.net/items/mus_fire_bass.gif", "/search/items/?item_name=Fire Bass"],
"Fire Tambourine": ["https://grundoscafe.b-cdn.net/items/fire_tambourine.gif", "/search/items/?item_name=Fire Tambourine"],
"Fire Violin": ["https://grundoscafe.b-cdn.net/items/fire_violin.gif", "/search/items/?item_name=Fire Violin"],
"Flower Bass": ["https://grundoscafe.b-cdn.net/items/inst_flowerbass.gif", "/search/items/?item_name=Flower Bass"],
"Flower Cello": ["https://grundoscafe.b-cdn.net/items/inst_flower_cello.gif", "/search/items/?item_name=Flower Cello"],
"Flower Trumpet": ["https://grundoscafe.b-cdn.net/items/inst_flowertrumpet.gif", "/search/items/?item_name=Flower Trumpet"],
"Flute": ["https://grundoscafe.b-cdn.net/items/toy_flute.gif", "/search/items/?item_name=Flute"],
"French Horn": ["https://grundoscafe.b-cdn.net/items/mus_frenchhorn.gif", "/search/items/?item_name=French Horn"],
"Ghostkerchief Banjo": ["https://grundoscafe.b-cdn.net/items/inst_ghostkerchief_banjo.gif", "/search/items/?item_name=Ghostkerchief Banjo"],
"Gloomy Drums": ["https://grundoscafe.b-cdn.net/items/inst_gloomy_drums.gif", "/search/items/?item_name=Gloomy Drums"],
"Gloomy Guitar": ["https://grundoscafe.b-cdn.net/items/inst_gloomy_guitar.gif", "/search/items/?item_name=Gloomy Guitar"],
"Gloomy Harp": ["https://grundoscafe.b-cdn.net/items/inst_gloomy_harp.gif", "/search/items/?item_name=Gloomy Harp"],
"Grand Piano": ["https://grundoscafe.b-cdn.net/items/mus_grandpiano.gif", "/search/items/?item_name=Grand Piano"],
"Grape Jelly Bongos": ["https://grundoscafe.b-cdn.net/items/inst_jelly_bongos.gif", "/search/items/?item_name=Grape Jelly Bongos"],
"Gruundo Guitar": ["https://grundoscafe.b-cdn.net/items/gif_band_guitar.gif", "/search/items/?item_name=Gruundo Guitar"],
"Guitarra Portuguesa": ["https://grundoscafe.b-cdn.net/items/mus_guitarralisboa.gif", "/search/items/?item_name=Guitarra Portuguesa"],
"Harmonica": ["https://grundoscafe.b-cdn.net/items/toy_harmonica.gif", "/search/items/?item_name=Harmonica"],
"Harp": ["https://grundoscafe.b-cdn.net/items/mus_harp.gif", "/search/items/?item_name=Harp"],
"Heart Drums": ["https://grundoscafe.b-cdn.net/items/inst_valentinedrums.gif", "/search/items/?item_name=Heart Drums"],
"Ice Accordion": ["https://grundoscafe.b-cdn.net/items/ice_accordion.gif", "/search/items/?item_name=Ice Accordion"],
"Ice Harp": ["https://grundoscafe.b-cdn.net/items/ice_harp.gif", "/search/items/?item_name=Ice Harp"],
"Jelly Triangle": ["https://grundoscafe.b-cdn.net/items/inst_jelly_triangle.gif", "/search/items/?item_name=Jelly Triangle"],
"Jelly Xylophone": ["https://grundoscafe.b-cdn.net/items/inst_jelly_xylophone.gif", "/search/items/?item_name=Jelly Xylophone"],
"Kau Bell": ["https://grundoscafe.b-cdn.net/items/imus_cowbell.gif", "/search/items/?item_name=Kau Bell"],
"Kougras Paw Ocarina": ["https://grundoscafe.b-cdn.net/items/kougras_paw_ocarina.gif", "/search/items/?item_name=Kougras Paw Ocarina"],
"Light Faerie Harp": ["https://grundoscafe.b-cdn.net/items/inst_harp_faerie.gif", "/search/items/?item_name=Light Faerie Harp"],
"Maccy Synth": ["https://grundoscafe.b-cdn.net/items/toy_synth.gif", "/search/items/?item_name=Maccy Synth"],
"Mandolin": ["https://grundoscafe.b-cdn.net/items/inst_mandolin.gif", "/search/items/?item_name=Mandolin"],
"Mystery Island Drum": ["https://grundoscafe.b-cdn.net/items/tiki_native_drum.gif", "/search/items/?item_name=Mystery Island Drum"],
"Mystic Guitar": ["https://grundoscafe.b-cdn.net/items/inst_acoustic_guit.gif", "/search/items/?item_name=Mystic Guitar"],
"Oboe": ["https://grundoscafe.b-cdn.net/items/toy_oboe.gif", "/search/items/?item_name=Oboe"],
"Orange Jelly Guitar": ["https://grundoscafe.b-cdn.net/items/inst_jelly_guitar.gif", "/search/items/?item_name=Orange Jelly Guitar"],
"Organ": ["https://grundoscafe.b-cdn.net/items/mus_organ.gif", "/search/items/?item_name=Organ"],
"Pan Pipes": ["https://grundoscafe.b-cdn.net/items/imus_panflute.gif", "/search/items/?item_name=Pan Pipes"],
"Piano": ["https://grundoscafe.b-cdn.net/items/toy_piano.gif", "/search/items/?item_name=Piano"],
"Pink Ukulele": ["https://grundoscafe.b-cdn.net/items/pink_ukulele.gif", "/search/items/?item_name=Pink Ukulele"],
"Pink Violin": ["https://grundoscafe.b-cdn.net/items/inst_pink_violin.gif", "/search/items/?item_name=Pink Violin"],
"Plushie Banjo": ["https://grundoscafe.b-cdn.net/items/inst_banjo_plushie.gif", "/search/items/?item_name=Plushie Banjo"],
"Plushie Drum": ["https://grundoscafe.b-cdn.net/items/inst_drum_plushie.gif", "/search/items/?item_name=Plushie Drum"],
"Plushie Trumpet": ["https://grundoscafe.b-cdn.net/items/inst_trumpet_plushie.gif", "/search/items/?item_name=Plushie Trumpet"],
"Pyramid Tambourine": ["https://grundoscafe.b-cdn.net/items/mus_pyramid_tambourine.gif", "/search/items/?item_name=Pyramid Tambourine"],
"Rainbow Guitar": ["https://grundoscafe.b-cdn.net/items/inst_rainbow_guitar.gif", "/search/items/?item_name=Rainbow Guitar"],
"Recorder": ["https://grundoscafe.b-cdn.net/items/toy_recorder.gif", "/search/items/?item_name=Recorder"],
"Red Moehawk Guitar": ["https://grundoscafe.b-cdn.net/items/moehawk_guitar1.gif", "/search/items/?item_name=Red Moehawk Guitar"],
"Saxophone": ["https://grundoscafe.b-cdn.net/items/toy_saxaphone.gif", "/search/items/?item_name=Saxophone"],
"Selket Castanets": ["https://grundoscafe.b-cdn.net/items/mus_selket_castanetas.gif", "/search/items/?item_name=Selket Castanets"],
"Silver Triangle": ["https://grundoscafe.b-cdn.net/items/toy_triangle.gif", "/search/items/?item_name=Silver Triangle"],
"Spirited Fiddle": ["https://grundoscafe.b-cdn.net/items/mus_fiddle.gif", "/search/items/?item_name=Spirited Fiddle"],
"Stone Trumpet": ["https://grundoscafe.b-cdn.net/items/inst_stone_trumpet.gif", "/search/items/?item_name=Stone Trumpet"],
"String Bass": ["https://grundoscafe.b-cdn.net/items/mus_stringbass.gif", "/search/items/?item_name=String Bass"],
"Teenie Tiny Baby Ocarina": ["https://grundoscafe.b-cdn.net/items/teenie_tiny_baby_ocarina.gif", "/search/items/?item_name=Teenie Tiny Baby Ocarina"],
"Timpani": ["https://grundoscafe.b-cdn.net/items/mus_timpani.gif", "/search/items/?item_name=Timpani"],
"Trombone": ["https://grundoscafe.b-cdn.net/items/toy_trombone.gif", "/search/items/?item_name=Trombone"],
"Trumpet": ["https://grundoscafe.b-cdn.net/items/toy_trumpet.gif", "/search/items/?item_name=Trumpet"],
"Valentine Guitar": ["https://grundoscafe.b-cdn.net/items/inst_valentineguitar.gif", "/search/items/?item_name=Valentine Guitar"],
"Valentine Kazoo": ["https://grundoscafe.b-cdn.net/items/inst_valentinekazoo.gif", "/search/items/?item_name=Valentine Kazoo"],
"Valentine Piano": ["https://grundoscafe.b-cdn.net/items/inst_valentinepiano.gif", "/search/items/?item_name=Valentine Piano"],
"Viola Caipira": ["https://grundoscafe.b-cdn.net/items/mus_violacaipira.gif", "/search/items/?item_name=Viola Caipira"],
"Violin": ["https://grundoscafe.b-cdn.net/items/toy_violin.gif", "/search/items/?item_name=Violin"],
"Wadjet Saxophone": ["https://grundoscafe.b-cdn.net/items/mus_wadjet_saxophone.gif", "/search/items/?item_name=Wadjet Saxophone"],
"Wock Til You Drop Guitar": ["https://grundoscafe.b-cdn.net/items/special_wock_guitar.gif", "/search/items/?item_name=Wock Til You Drop Guitar"],
"Wooden Washboard": ["https://grundoscafe.b-cdn.net/items/mus_washboard.gif", "/search/items/?item_name=Wooden Washboard"],
}


    // Find all displayed instruments and missing instruments
    const displayedInstruments = Array.from(document.querySelectorAll('.instrument-name')).map(el => el.textContent.trim());
    const missingInstruments = Object.keys(instrumentData).filter(instrument => !displayedInstruments.includes(instrument));

    // Highlight completed instruments
    document.querySelectorAll('.instrument-item').forEach(item => {
        const skillLevelElement = item.querySelector('.instrument-skill-level');
        if (skillLevelElement && skillLevelElement.textContent.trim() === 'Skill Level: 100%') {
            item.style.border = '3px solid #32CD32'; // Apply LimeGreen border
        }
    });

    // Add search links for needed instruments
    document.querySelectorAll('.instrument-item').forEach(item => {
        const nameElement = item.querySelector('.instrument-name');
        const instrumentName = nameElement?.textContent.trim();

        const isNeeded = !item.classList.contains('completed');

        if (isNeeded && instrumentName) {
            const linksHTML = `
                <div id="${instrumentName.replace(/\s+/g, '-')}-links" class="searchhelp" style="display: block; unicode-bidi: isolate;">
                    <a href="/market/wizard/?query=${encodeURIComponent(instrumentName)}&amp;submit" title="Search the Shop Wizard" target="_blank">
                        <img title="Search the Shop Wizard" alt="Shop Wizard Search" class="search-helper-sw" src="https://grundoscafe.b-cdn.net/searchicons/wiz.png">
                    </a>
                    <a href="/safetydeposit/?page=1&amp;query=${encodeURIComponent(instrumentName)}&amp;exact=1" target="_blank">
                        <img class="search-helper-sdb" title="Search Safety Deposit Box" src="https://grundoscafe.b-cdn.net/searchicons/sdb.png">
                    </a>
                    <a href="/island/tradingpost/browse/?query=${encodeURIComponent(instrumentName)}" title="Search Trading Post" target="_blank">
                        <img class="search-helper-trading-post" src="https://grundoscafe.b-cdn.net/searchicons/trade.png">
                    </a>
                    <a href="/wishlist/search/?query=${encodeURIComponent(instrumentName)}" title="Search Wishlists" target="_blank">
                        <img class="search-helper-wish-witch" src="https://grundoscafe.b-cdn.net/searchicons/wish.png">
                    </a>
                    <a href="/auctions/genie/?type=process_genie&amp;query=${encodeURIComponent(instrumentName)}&amp;criteria=exact" title="Search Auctions" target="_blank">
                        <img class="search-helper-auctions" src="https://grundoscafe.b-cdn.net/searchicons/auction.png">
                    </a>
                    <a href="javascript:void(0);" title="Add Item To Wishlist" onclick="submitWish('${instrumentName}');">
                        <img class="search-helper-wish-witch-add" src="https://grundoscafe.b-cdn.net/searchicons/wish_add_green.png">
                    </a>
                    <a href="/search/items/?item_name=${encodeURIComponent(instrumentName)}" title="View Item Details in Item Search" target="_blank">
                        <img class="search-helper-item-search" src="https://grundoscafe.b-cdn.net/searchicons/search.png">
                    </a>
                    <a href="/viewshop/?shop_id=84" title="Check Shop" target="_blank">
                        <img class="search-helper-shop sh-shop-84" src="https://grundoscafe.b-cdn.net/searchicons/shop.png">
                    </a>
                    <a href="https://virtupets.net/search?q=${encodeURIComponent(instrumentName)}" target="_blank">
                        <img src="https://virtupets.net/assets/images/vp.png" alt="Virtupets" style="width: 20px;">
                    </a>
                </div>
            `;

            nameElement.insertAdjacentHTML('afterend', linksHTML);
        }
    });

    // Display missing instruments
    if (missingInstruments.length > 0) {
        const missingContainer = document.createElement('div');
        missingContainer.className = 'missing-instruments-grid';
        missingContainer.style.display = 'grid';
        missingContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
        missingContainer.style.gap = '8px';
        missingContainer.style.marginTop = '20px';
        missingContainer.style.padding = '15px';
        missingContainer.style.backgroundColor = '#f9f9f9';
        missingContainer.style.border = '1px solid #ccc';
        missingContainer.style.borderRadius = '8px';

        const title = document.createElement('h2');
        title.textContent = "Missing Instruments";
        title.style.textAlign = 'center';
        title.style.gridColumn = 'span 4';
        missingContainer.appendChild(title);

        missingInstruments.forEach(instrument => {
            const cardLink = document.createElement('a');
            cardLink.href = instrumentData[instrument][1];
            cardLink.target = "_blank";
            cardLink.style.textDecoration = 'none';
            cardLink.style.color = 'inherit';

            const card = document.createElement('div');
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.alignItems = 'center';
            card.style.textAlign = 'center';
            card.style.padding = '10px';
            card.style.border = '1px solid #ccc';
            card.style.borderRadius = '8px';
            card.style.backgroundColor = '#fff';

            const image = document.createElement('img');
            image.src = instrumentData[instrument][0];
            image.alt = instrument;
            image.style.width = '60px';
            image.style.height = '60px';
            image.style.marginBottom = '20px';

            const name = document.createElement('div');
            name.textContent = instrument;
            name.style.fontWeight = 'bold';
            name.style.paddingBottom = '5px';

            const links = document.createElement('div');
            links.id = `${instrument.replace(/\s+/g, '-')}-links`;
            links.className = 'searchhelp';
            links.style.display = 'block';
            links.style.unicodeBidi = 'isolate';
            links.innerHTML = `
                <a href="/market/wizard/?query=${encodeURIComponent(instrument)}&amp;submit" title="Search the Shop Wizard" target="_blank">
                    <img title="Search the Shop Wizard" alt="Shop Wizard Search" class="search-helper-sw" src="https://grundoscafe.b-cdn.net/searchicons/wiz.png">
                </a>
                <a href="/safetydeposit/?page=1&amp;query=${encodeURIComponent(instrument)}&amp;exact=1" target="_blank">
                    <img class="search-helper-sdb" title="Search Safety Deposit Box" src="https://grundoscafe.b-cdn.net/searchicons/sdb.png">
                </a>
                <a href="/island/tradingpost/browse/?query=${encodeURIComponent(instrument)}" title="Search Trading Post" target="_blank">
                    <img class="search-helper-trading-post" src="https://grundoscafe.b-cdn.net/searchicons/trade.png">
                </a>
                <a href="/wishlist/search/?query=${encodeURIComponent(instrument)}" title="Search Wishlists" target="_blank">
                    <img class="search-helper-wish-witch" src="https://grundoscafe.b-cdn.net/searchicons/wish.png">
                </a>
                <a href="/auctions/genie/?type=process_genie&amp;query=${encodeURIComponent(instrument)}&amp;criteria=exact" title="Search Auctions" target="_blank">
                    <img class="search-helper-auctions" src="https://grundoscafe.b-cdn.net/searchicons/auction.png">
                </a>
                <a href="javascript:void(0);" title="Add Item To Wishlist" onclick="submitWish('${instrument}');">
                    <img class="search-helper-wish-witch-add" src="https://grundoscafe.b-cdn.net/searchicons/wish_add_green.png">
                </a>
                <a href="/search/items/?item_name=${encodeURIComponent(instrument)}" title="View Item Details in Item Search" target="_blank">
                    <img class="search-helper-item-search" src="https://grundoscafe.b-cdn.net/searchicons/search.png">
                </a>
                <a href="/viewshop/?shop_id=84" title="Check Shop" target="_blank">
                    <img class="search-helper-shop sh-shop-84" src="https://grundoscafe.b-cdn.net/searchicons/shop.png">
                </a>
                <a href="https://virtupets.net/search?q=${encodeURIComponent(instrument)}" target="_blank">
                    <img src="https://virtupets.net/assets/images/vp.png" alt="Virtupets" style="width: 20px;">
                </a>
            `;

            card.appendChild(image);
            card.appendChild(name);
            card.appendChild(links);
            cardLink.appendChild(card);
            missingContainer.appendChild(cardLink);
        });

        const instrumentsGrid = document.querySelector('.instruments-grid');
        if (instrumentsGrid) {
            instrumentsGrid.parentNode.insertBefore(missingContainer, instrumentsGrid.nextSibling);
        }
    }
})();
