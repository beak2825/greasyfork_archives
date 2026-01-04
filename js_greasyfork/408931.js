// ==UserScript==
// @name               Chain Breaker
// @namespace    http://tampermonkey.net/
// @version           2.5
// @description    Hide faction description and anyone in hosp, add an attack link & show chain timer
// @author            Untouchable [1360035]
// @match            https://www.torn.com/factions.php*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/408931/Chain%20Breaker.user.js
// @updateURL https://update.greasyfork.org/scripts/408931/Chain%20Breaker.meta.js
// ==/UserScript==

$(document).ready(function(){
    'use strict';

    $('.faction-title').hide();
    $('.faction-description').hide();
    $('.t-red').parent().parent().hide();
    $('[title*="Offline"]').parent().parent().parent().hide();

    const API_KEY = "API KEY HERE";

    let url = "https://api.torn.com/faction/" + window.location.href.replace('https://www.torn.com/factions.php?step=profile&ID=','').replace('#/','') + "?selections=chain&key=" + API_KEY;

    if(API_KEY != "API KEY HERE"){
       $.get(url, function( data ) {
          $('#skip-to-content').append(' | Chain: ' +  data.chain.current + ' | Timer: ' + Math.floor(data.chain.timeout / 60) + ' minutes ' + Math.floor(data.chain.timeout - (Math.floor(data.chain.timeout / 60)) * 60) + 'seconds' );
       });
     }


    let mems = $('.member-list')[0].children;

    console.log(mems);

    let index = 0;

    for(let mem of mems){

        mem.children[2].children[1].children[1].children[1].innerHTML = `<a href="` + mem.children[0].children[2].children[0].href.replace('https://www.torn.com/profiles.php?XID=','https://www.torn.com/loader.php?sid=attack&user2ID=') + `">Attack</a>`;

        index++;

    }

})();