// ==UserScript==
// @name        Steam Market Agreement Autocomplete
// @description Automatically remember your User Agreement choice across pages/sessions.
// @license     GPLv3
// @namespace   StupidWeasel/SteamCommunityMarket/SteamMarketAgreementAutocomplete
// @include     /^https?://steamcommunity\.com/.*$/
// @version     1.05
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2109/Steam%20Market%20Agreement%20Autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/2109/Steam%20Market%20Agreement%20Autocomplete.meta.js
// ==/UserScript==

/*
    Steam Market Agreement Autocomplete - A GreaseMonkey script for the Steam Market
    Copyright (C) 2015 Alex "StupidWeasel" Bolton

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function byID(id){
  return document.getElementById(id);  
}
if (byID("market_buyorder_dialog_accept_ssa") || byID("market_sell_dialog_accept_ssa")){ 
  
    var foundLabel = ( byID("market_sell_dialog_accept_ssa") ? "market_sell_dialog_accept_ssa" : "market_buyorder_dialog_accept_ssa" )

    /*  Annoyingly can no longer use Date.parse here - as the date format has changed.
        should not really be an issue unless Valve updates the agreement at exactly the same date each year.
    */
    var dateString = byID(foundLabel + "_label").innerHTML.match(/updated (.*)\.\)/)[1];
    var storedString = (document.cookie.match(/^(?:.*;)?DammitValveIAgree=([^;]+)(?:.*)?$/)||[,null])[1];
    
    if ( dateString == storedString ){
        byID(foundLabel).checked = true;
    }else{
        byID(foundLabel).onclick=function(){
            if(byID(foundLabel).checked){
              var d = new Date();
              d.setTime(d.getTime() + 31536e6);
              document.cookie = 'DammitValveIAgree=' + dateString + '; expires=' + d.toUTCString() + 'path=/';
            } else {
              var epochparty = "Thu, 01 Jan 1970 00:00:01 GMT";
              document.cookie = 'DammitValveIAgree=ByeBye; expires=' + epochparty + 'path=/';
              storedString = null;
            }
        };
    }
}