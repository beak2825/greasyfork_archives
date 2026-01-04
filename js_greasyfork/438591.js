// ==UserScript==
// @name         Faction attacking filter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fiter members who can be attacked
// @author       Jox [1714547]
// @match        https://www.torn.com/factions.php?step=profile*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/438591/Faction%20attacking%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/438591/Faction%20attacking%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle (`.-profile-mini-_userImageWrapper___2ZKEu{display: none !important;}`);
    GM_addStyle (`
                    .jox-hide{display: none !important;}
                    .jox-hide + div{display: none !important;}
    `);

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
                        if(!member.querySelector('.status').innerHTML.toLowerCase().includes('okay')){
                            member.classList.add('jox-hide');
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