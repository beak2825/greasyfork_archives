// ==UserScript==
// @name        auto-perk-legacy
// @namespace   https://pablob.eu/
// @match       *://rivalregions.com/
// @author      pablo
// @description Subite los stats bobo
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.0.6
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/auto-perk/auto-perk-legacy.user.js
// ==/UserScript==

/**
 * v0.0.3 - added perk and url menu
 */

/**
 * ONLY WORKS WITH ENGLISH INTERFACE
 *
 * Perk:
 * 1 = strength
 * 2 = education
 * 3 = endurance
 *
 * Url:
 * 1 = money
 * 2 = gold
 *
 *
 */

 const firstTime = GM_getValue('first-time', true);

 if (firstTime) {
     GM_setValue('perk', 2); // perk
     GM_setValue('url', 1); // url
 }
 
 $(document).ready(function () {
     window.addEventListener('popstate', listener);
 
     const pushUrl = (href) => {
         history.pushState({}, '', href);
         window.dispatchEvent(new Event('popstate'));
     };
 
     listener();
 });
 
 function listener() {
     if (location.href.includes('#overview')) {
         mainPage();
     }
 }
 
 function mainPage() {
     if (firstTime) {
         GM_setValue('first-time', false);
     }
     var waitInterval = setInterval(() => {
         if ($('#index_perks_list').length) {
             addMenu();
             clearInterval(waitInterval);
             // to check if any perk is already active
             const countdownAmount = $(
                 '#index_perks_list>div>div[perk]>.hasCountdown'
             ).length;
             if (countdownAmount === 0) {
                 setTimeout(() => {
                     upgradePerk();
                 }, 1000);
             } else {
                 console.log('perk already active');
 
                 setUpgradeTimeout();
             }
         }
     }, 1000);
 }
 
 function upgradePerk() {
     const perk = $('#myperk').val(); // GM_getValue('perk');
     const url = $('#myurl').val(); // GM_getValue('url');
     // console.log(perk, url)
     $.ajax({
         url: '/perks/up/' + perk + '/' + url,
         data: { c: c_html },
         type: 'POST',
         success: function (data) {
             console.log('perk upgraded', new Date().toLocaleString());
             // console.log(data);
             // ajax_action('main/content');
 
             location.reload();
         },
     });
 }
 
 function setUpgradeTimeout() {
     let nextPerkText = $('.ib_border>div>.tc>.small')
         .first()
         .text()
         .replace('New skill level: ', '');
 
     if (nextPerkText.includes('tomorrow')) {
         let tomorrow = new Date();
         tomorrow.setDate(tomorrow.getDate() + 1);
         const date = tomorrow.toLocaleDateString();
         const time = nextPerkText.replace('tomorrow ', '');
 
         nextPerkText = `${date} ${time}`;
     } else if (nextPerkText.includes('today')) {
         const date = new Date().toLocaleDateString();
         const time = nextPerkText.replace('today ', '');
 
         nextPerkText = `${date} ${time}`;
     }
 
     const nextPerk = Date.parse(nextPerkText);
 
     const timeout = nextPerk - c();
 
     addDiv(nextPerkText);
 
     setTimeout(() => {
         upgradePerk();
     }, timeout + 60000);
 }
 
 function addDiv(nextPerkDate) {
     if ($('#my-div').length <= 0){
         const perks = ['Stregth', 'Education', 'Endurance'];
         const urls = ['Money', 'Gold'];
     
         const div = `   <div id="my-div" class="perk_item ib_border hov pointer">
                             <div class="tc small">Next Perk: ${nextPerkDate}</div>
                             <div class="tc small">${GM_info.script.name} v${GM_info.script.version} by ${GM_info.script.author}</div>
                             <div class="tc small">
                                 <a target="blank_" href="https://github.com/pbl0/rr-scripts">More scripts</a>
                             </div>
                         </div>`;
     
         if (window.location.href.includes('#overview')) {
             $('#index_perks_list').append(div);
         }
     }
 
 }
 
 function addMenu() {
     if ($('#mymenu').length <= 0) {
         const perk = Number(GM_getValue('perk'));
 
         const url = Number(GM_getValue('url'));
 
         // console.log(perk, url)
 
         const input = `<div id="mymenu" class="perk_item ib_border hov pointer">
                             
                             <select id="myurl">
                                 <option ${
                                     url == 1 ? 'selected' : ''
                                 } value="1">Money</option>
                                 <option ${
                                     url == 2 ? 'selected' : ''
                                 } value="2">Gold</option>
                             </select>
                             <select id="myperk">
                                 <option ${
                                     perk == 1 ? 'selected' : ''
                                 } value="1">Stregth</option>
                                 <option ${
                                     perk == 2 ? 'selected' : ''
                                 } value="2">Education</option>
                                 <option ${
                                     perk == 3 ? 'selected' : ''
                                 } value="3">Endurance</option>
                             </select>
     
                         </div>`;
         $('#index_perks_list').append(input);
 
         $('#myurl').change(function () {
             GM_setValue('url', $(this).val());
         });
         $('#myperk').change(function () {
             GM_setValue('perk', $(this).val());
         });
     }
 }
 
