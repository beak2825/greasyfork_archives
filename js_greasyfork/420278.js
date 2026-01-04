// ==UserScript==
// @name         Chain breaker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fiter members online out of hosp
// @author       You
// @match        https://www.torn.com/factions.php?step=profile*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/420278/Chain%20breaker.user.js
// @updateURL https://update.greasyfork.org/scripts/420278/Chain%20breaker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle (`.-profile-mini-_userImageWrapper___2ZKEu{display: none !important;}`);

    var hideFactionBanner = true;
    var hideFactionPage = true;

    if(hideFactionBanner){
        document.querySelector('.faction-info').style.display = 'none';
    }

    if(hideFactionPage){
        document.querySelector('.faction-description').style.display = 'none';
    }

    //var memberList = document.querySelector('.member-list');
    var memberList = document.querySelector('.table-body');
    var factionMembers = memberList.childNodes

    var inactives = memberList.querySelectorAll('div.member.icons ul#iconTray li[id^=icon2]');

    for(var member of factionMembers){
        if(member.nodeType == 1){
            if(member.querySelector('div.member.icons ul#iconTray li[id^=icon15]')){
                member.style.display = 'none';
            }

            else if(member.querySelector('div.member.icons ul#iconTray li[id^=icon2]')){
                member.style.display = 'none';
            }
            else if(member.querySelector('div.member.icons ul#iconTray li[id^=icon71]')){
                member.style.display = 'none';
            }
            else{
                if(member.querySelector('.status').innerHTML.toLowerCase().includes('hospital')){
                    member.style.display = 'none';
                }
            }
        }
    }
})();