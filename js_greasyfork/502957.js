// ==UserScript==
// @name         Amazon Description Checker with Snoopy
// @namespace    http://tampermonkey.net/
// @version      3.00
// @description  Checks Amazon product descriptions for prohibited words and formatting errors
// @author       Snoopy
// @match        https://www.amazon.com/*
// @match        https://www.amazon.cn/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.com.au/*
// @match        https://www.amazon.com.br/*
// @match        https://www.amazon.in/*
// @match        https://www.amazon.com.mx/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502957/Amazon%20Description%20Checker%20with%20Snoopy.user.js
// @updateURL https://update.greasyfork.org/scripts/502957/Amazon%20Description%20Checker%20with%20Snoopy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const prohibitedWords = [
        'NA', 'Warranty', 'Free', 'Gift', 'eco-friendly', 'environmentally friendly',
        'ecologically friendly', 'anti-microbial', 'anti-bacterial', 'Made from Bamboo',
        'contains Bamboo', 'Made from Soy', 'contains Soy', 'Full refund', 'If not satisfied, send it back',
        'Unconditional guarantee with no limit', 'Drugs', 'narcotics', 'Drugs Tools', 'Anesthesia tranquilizers',
        'Psychotropic Drugs', 'Addictive drug', 'Natural drugs', 'Opium', 'morphine', 'heroin', 'marijuana',
        'Synthetic drugs', 'ephedrine', '4-methylenedioxyphenyl-2-propanone', '1-phenyl-2-propanone',
        'Heliotropin', 'Safrole', 'Isosafrole', 'Acetic oxide', 'Rubik', 'Steroid', 'Ephedra',
        'Hydroxy imine', 'Phenylacetate', 'chloroform', 'methenyl trichloride', 'trichlormethane',
        'diethyl ether', 'aether', 'Piperidine', 'Toluene', 'acetone', 'methyl ethyl ketone',
        'potassium permanganate', 'sulphuric acid', 'hydrochloric acid', 'chlorhydric acid',
        'Marijuana grow lights', 'Explosive', 'radiation', 'emission', 'Fluorine', 'Fireworks', 'Firecracker',
        'ignition', 'Terrorist organizations', 'Racial Discrimination', 'porn', 'porno', 'pornographic',
        'Obscene', 'harlot', 'Birth certificates', 'passports', 'visas', 'driver\'s license', 'ID card',
        'bug', 'listening-in device', 'tapping device', 'Hidden Listener', 'Pinhole camera', 'drug',
        'medicine', 'medicament', 'remedy', 'chinese medicine', 'Oral diet pills', 'Diet pills',
        'Medical Devices', 'Beauty Equipment', 'Cosmetic acupuncture', 'lottery ticket', 'Human organ',
        'Visceral', 'haslet', 'Animal fur', 'Bear bile', 'Cat and dog fur', 'Signal jammers',
        'Slot machine', 'Satellite signal receiving device', 'TV Stick', 'Tobacco', 'Cigar', 'Cigarette',
        'electronic cigarette', 'Electronic cigarette liquid', 'Cigarette paper', 'Filter tips',
        'Cigarette tow', 'Smoke oil', 'Liquid smoke', 'Currency', 'monetary', 'Precious Metals',
        'Cultural relic', 'historical relic', 'Bitcoin', 'Pilot Uniforms', 'Airport ground staff uniforms',
        'Train or subway staff uniforms', 'Public transportation safety manual', 'Unlock Tool',
        'Synthetic Urine', 'Health Food', 'wine', 'liquor', 'spirits', 'alcohol', 'guzzle', 'food',
        'foodstuff', 'grocery', 'provisions', 'paint', 'oil colour', 'cover with paint', 'lead-and-oil',
        'oil paint', 'drikold', 'dry ice', 'lithium cell', 'lithium battery', 'storage battery',
        'accumulator', 'jar', 'compressed gas', 'Magnetic materials', 'Ivory', 'Artwork', 'Coin',
        'fake stamps', 'Credit card', 'TV decoder', 'Radar Scanner', 'ticket', 'Unlocking device',
        'Coupon', 'Contact lenses', 'Pacemaker', 'Surgical Instruments', 'Insecticide', 'Stamp',
        'Plant', 'vegetation', 'baton', 'truncheon', 'Body armor', 'Stun Gun', 'Ultrasonic testing equipment',
        'Fire extinguisher', 'Fuse', 'Smokescreen', 'Mercury', 'Freon', 'Louis Vuitton', 'Hermes',
        'Gucci', 'Chanel', 'Hennessy', 'Rolex', 'Moet & Chandon', 'Cartier', 'Fendi', 'Tiffany & Co.',
        'DIOR', 'Prada', 'happy birthday', 'durable', 'operation', 'gun', 'firearm', 'rifle', 'spear',
        'ammunition', 'Bomb', 'bullet', 'pellet', 'shot', 'Arms', 'weapon', 'Air gun', 'air rifle',
        'Starting gun', 'BB gun', 'Paintball gun', 'Gun Accessories', 'Spear gun', 'Fish fork',
        'Electric shock equipment', 'Pepper Spray', 'crossbow', 'bow', 'financial securities',
        'Spring knife', 'Ultra-long knife', 'knife', 'Fighting Knife', 'Military Knife', 'Dagger',
        'poniard', 'Bayonet', 'Moat Swords', 'entrenchment Swords', 'Boots knife', 'Switchblade',
        'Butterfly knife', 'Gravity knife', 'Tri Tool', 'Belt buckle knife', 'sword cane', 'Darts',
        'Delta Dart', 'Hand thorn', 'Cuba rattan', 'Claw cutter', 'Long knife', 'blood reservoir',
        'Folding knife', 'nunchakus', 'Key stick', 'Knuckleduster', 'Baton', 'ASP', 'Mace',
        'wolf fang club', 'Rogues fork', 'boomerang', 'Nazi', 'police uniform', 'Police Badge',
        'Police equipment and products', 'handcuffs', 'manacle', 'cuff', 'darby', 'gyve'
    ];

    function checkDescriptions() {
        const listItems = document.querySelectorAll('.a-unordered-list.a-vertical.a-spacing-small .a-list-item');

        listItems.forEach((item, index) => {
            const text = item.textContent.trim();
            let errorMsg = "";

            // Check for prohibited words
            for (const word of prohibitedWords) {
                if (text.includes(word)) {
                    errorMsg += `包含禁止词汇: ${word}; `;
                }
            }

            // Check for invalid character length
            const length = text.length;
            if (length < 10 || length > 255) {
                errorMsg += `字符长度无效: ${length} (预期在 10 到 255 之间); `;
            }

            // Check for capitalization
            if (text && text[0] !== text[0].toUpperCase()) {
                errorMsg += `未以大写字母开头; `;
            }

            // Check for ending punctuation
            if (text.endsWith('.') || text.endsWith(',') || text.endsWith(';') || text.endsWith('!') || text.endsWith('?')) {
                errorMsg += `以禁止的标点符号结尾; `;
            }

            // Add error message if any
            if (errorMsg) {
                item.innerHTML += `<span style="background-color: yellow;">检测到错误: ${errorMsg.slice(0, -2)}</span>`;
            }
        });
    }

    // Run the check function on page load
    window.addEventListener('load', checkDescriptions);
})();
