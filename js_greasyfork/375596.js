// ==UserScript==
// @name         Faction reviving filter
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Fiter members who need to be revied
// @author       You
// @match        https://www.torn.com/factions.php?step=profile*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375596/Faction%20reviving%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/375596/Faction%20reviving%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle (`.-profile-mini-_userImageWrapper___2ZKEu{display: none !important;}`);

    var hideFactionBanner = true;
    var hideFactionPage = true;

    if(hideFactionBanner){
        //document.querySelector('.faction-info').style.display = 'none';
        GM_addStyle (`
                    .faction-info{display: none !important;}
    `);
    }

    if(hideFactionPage){
        //document.querySelector('.faction-description').style.display = 'none';
        GM_addStyle (`
                    .faction-description{display: none !important;}
    `);
    }


    hide()

    function hide(){
        //var memberList = document.querySelector('.member-list');
        var memberList = document.querySelector('.table-body');

        if(memberList){
            var factionMembers = memberList.childNodes

            if(factionMembers){

                //var inactives = memberList.querySelectorAll('div.member.icons ul#iconTray li[id^=icon2]');

                for(var member of factionMembers){
                    if(member.nodeType == 1){
                        if(!member.querySelector('.status').innerHTML.toLowerCase().includes('hospital')){
                            member.style.display = 'none';
                        }
                    }
                }
            }
            else{
                setTimeout(hide, 100);
            }
        }
        else{
            setTimeout(hide, 100);
        }
    }
})();