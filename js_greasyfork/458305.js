// ==UserScript==
// @name         GC - Rainbow Pool Missing Lists
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Show what species or colors are missing from certain paint brushes or species
// @author       wibreth
// @match        https://www.grundos.cafe/rainbowpool/neopetcolours/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/458305/GC%20-%20Rainbow%20Pool%20Missing%20Lists.user.js
// @updateURL https://update.greasyfork.org/scripts/458305/GC%20-%20Rainbow%20Pool%20Missing%20Lists.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const speciesList = ['Acara','Aisha','Blumaroo','Bori','Bruce','Buzz','Chia','Chomby','Cybunny','Draik','Elephante','Eyrie','Flotsam','Gelert','Gnorbu','Grarrl','Grundo','Hissi','Ixi','Jetsam','JubJub','Kacheek','Kau','Kiko','Koi','Korbat','Kougra','Krawk','Kyrii','Lenny','Lupe','Lutari','Meerca','Moehog','Mynci','Nimmo','Ogrin','Peophin','Poogle','Pteri','Quiggle','Ruki','Scorchio','Shoyru','Skeith','Techo','Tonu','Tuskaninny','Uni','Usul','Wocky','Xweetok','Yurble','Zafara'];
    const colorList = ['Alien', 'Apple', 'Asparagus', 'Aubergine', 'Avocado', 'Baby', 'Birthday', 'Biscuit', 'Blue', 'Blueberry', 'Botanical', 'Brown', 'Camouflage', 'Carrot', 'Checkered', 'Cherry', 'Chocolate', 'Chokato', 'Christmas', 'Clay', 'Cloud', 'Coconut', 'Corn', 'Custard', 'Darigan', 'Desert', 'Disco', 'Dragonfruit', 'Durian', 'Edgy', 'Electric', 'Faerie', 'Fire', 'Garlic', 'Ghost', 'Glass', 'Glowing', 'Gold', 'Gooseberry', 'Grape', 'Green', 'Grey', 'Halloween', 'Ice', 'Invisible', 'Island', 'Jelly', 'Lemon', 'Lime', 'Mallow', 'Maraquan', 'Msp', 'Mutant', 'Nugget', 'Orange', 'Pea', 'Peach', 'Pear', 'Pepper', 'Pineapple', 'Pink', 'Pirate', 'Plum', 'Plushie', 'Purple', 'Quigukiboy', 'Quigukigirl', 'Rainbow', 'Red', 'Robot', 'Royalboy', 'Royalgirl', 'Shadow', 'Silver', 'Sketch', 'Skunk', 'Snot', 'Snow', 'Speckled', 'Split', 'Sponge', 'Spotted', 'Starry', 'Stone', 'Strawberry', 'Striped', 'Thornberry', 'Tomato', 'Tyrannian', 'Usukiboy', 'Usukigirl', 'Valentine', 'White', 'Yellow'];
    const exclusions = ['Apple', 'Asparagus', 'Aubergine', 'Avocado', 'Blueberry', 'Carrot', 'Cherry', 'Chokato', 'Coconut', 'Corn', 'Dragonfruit', 'Durian', 'Garlic', 'Gooseberry', 'Grape', 'Lemon', 'Lime', 'Mallow', 'Pea', 'Peach', 'Pear', 'Pepper', 'Pineapple', 'Plum', 'Quigukiboy', 'Quigukigirl', 'Thornberry', 'Tomato', 'Usukiboy', 'Usukigirl'];

    let isToggleOn = await GM.getValue('toggle', false);
    let menuCommandId = null;

    function compareList(target, exclusions) {
        $('.missing-list').remove();
        let existing = [];
        $('.flex-column span').each(function() {
            existing.push($(this).text().trim());
        });
        let missing = target.filter(x => !existing.includes(x));
        missing = missing.join(', ');
        $('main > div.center').append($(`<p class="missing-list">These color/species combos don't exist yet: ${missing}</p>`));
    }

    function generateList() {
        if (menuCommandId !== null) GM_unregisterMenuCommand(menuCommandId);
        menuCommandId = GM_registerMenuCommand(isToggleOn ? 'Use longer color list' : 'Use shorter color list', () => {
            isToggleOn = !isToggleOn;
            GM.setValue('toggle', isToggleOn);
            generateList();
        }, 'l');

        if (window.location.href.includes('colour=')) {
            if (window.location.href.includes('species='))
                return;
            compareList(speciesList);
        }
        else if (window.location.href.includes('species='))  {
            isToggleOn ? compareList(colorList.filter(x => !exclusions.includes(x))) : compareList(colorList);
        }
    }
    generateList();

})();