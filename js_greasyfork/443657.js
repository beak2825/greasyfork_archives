// ==UserScript==
// @name         NS IS ASSHOLE SCRIPT BY MONARCH HQ TORN CITY
// @namespace    http://torn.com
// @version      1.1
// @description  Display Asshole on NS members profile for easy hospitalisation, to increase prosperity of MONARCH HQ. 
// @author       Theferret
// @match        https://www.torn.com/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443657/NS%20IS%20ASSHOLE%20SCRIPT%20BY%20MONARCH%20HQ%20TORN%20CITY.user.js
// @updateURL https://update.greasyfork.org/scripts/443657/NS%20IS%20ASSHOLE%20SCRIPT%20BY%20MONARCH%20HQ%20TORN%20CITY.meta.js
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
                        if((!member.querySelector('.status').innerHTML.toLowerCase().includes('hospital')) || (!member.innerHTML.toLowerCase().includes('online-user'))) {
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