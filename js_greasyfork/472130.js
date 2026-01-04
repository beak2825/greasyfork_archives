// ==UserScript==
// @name         [Neopets] Fishing Vortex Pet Switcher II
// @namespace    https://greasyfork.org/en/scripts/472130
// @version      0.4
// @description  Makes a bunch of buttons at the top of the page to quickly switch pets. New and improved!*
// @author       Piotr Kardovsky
// @match        https://www.neopets.com/water/fishing.phtml
// @match        https://neopets.com/water/fishing.phtml
// @icon         http://www.neopets.com/favicon.ico
// @grant        GM.addStyle
// @license      MIT
// @require      http://code.jquery.com/jquery-latest.min.js
// @run-at       document-start
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/472130/%5BNeopets%5D%20Fishing%20Vortex%20Pet%20Switcher%20II.user.js
// @updateURL https://update.greasyfork.org/scripts/472130/%5BNeopets%5D%20Fishing%20Vortex%20Pet%20Switcher%20II.meta.js
// ==/UserScript==
var $ = window.jQuery;

(function() {
    'use strict';
    // Feel free to change the colors of the buttons.
    GM.addStyle(`
        .fbtn { display: inline-block; background-color: #ffaa33; color: #333; margin: 4px; padding: 4px; border: #333 2px solid; border-radius: 10px; cursor: pointer; height: auto; min-width: 45px;}
        .fbtn:hover { background-color: #aaff33; }
        .acp, .acp:hover { background-color: #333; color: #fff !important; cursor:default; pointer-events:none; }
    `);

    const CHJ_URL = '/np-templates/ajax/changepet.php';
    const FSH_URL = '/water/fishing.phtml';

    let petList = GM.getValue('fpl',[]).then( (fpl) => {petList = fpl} );
    let petListArr = [];

    let fishBtn = (i, n) => {
        let data = {'_ref_ck':i,'new_active_pet':n};
        parent.$.post(CHJ_URL, data, (chr) => {
            let resp = JSON.parse(chr);
            if (resp.status == 'success') {
                let f = $('<form>', { action: FSH_URL, method: 'post' });
                $('<input>').attr({ type: "hidden", name: 'go_fish', value: '1'}).appendTo(f);
                f.appendTo('body').submit();
            }
        });
    };

    window.addEventListener('load', () => {
        let username = $('.nav-profile-dropdown-text a[href^="/userlookup.phtml"]').text();
        let active = $('a.profile-dropdown-link').text();
        let gap = `https://www.neopets.com/amfphp/json.php/PetService.getAllPets/${username}`;
        let ck = $('.navsub-left__2020 script').text().match(/\"_ref_ck\":'([a-zA-Z0-9]+)'/)[1]; // if anything ever breaks, it's probably this, as it's required for pet switching.
        if (document.querySelector('.fishing-img')) {
            parent.$.post(gap, {}, (r) => {
                let apts = JSON.parse(r);
                apts.forEach((g) => {
                    petListArr.push(g.name);
                    //console.log(petListArr);
                    petList = GM.setValue('fpl', petListArr);
                    let chpl = $('<a>').addClass('np-text__2020 fbtn').text(g.name).appendTo('#container__2020 p:first');
                    if (active == g.name) { chpl.addClass('acp'); }
                    chpl.on('click', () => { fishBtn(ck, g.name); });
                });
            });
        } else { // Use pre-fetched to speed up actual fishing and prevent dead loads
            petList = GM.getValue('fpl',[]).then( (fpl) => {
                petList = fpl;
                //console.log('aaa',petList);
                petList.forEach((ptb) => {
                    let chpl = $('<a>').addClass('np-text__2020 fbtn').text(ptb).appendTo('#container__2020 p:first');
                    if (active == ptb) { chpl.addClass('acp'); }
                    chpl.on('click', () => { fishBtn(ck, ptb); });
                });
            });
        }
    });
})();