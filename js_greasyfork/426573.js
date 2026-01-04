// ==UserScript==
// @name         Friendly Fire
// @namespace    http://www.browserscripts.blogger.com
// @version      0.11
// @description  Checks for friendly factions
// @author       PsycWard
// @noframes
// @include      *torn.com/profiles.php*
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/426573/Friendly%20Fire.user.js
// @updateURL https://update.greasyfork.org/scripts/426573/Friendly%20Fire.meta.js
// ==/UserScript==
/* global $ */

(function() {
    'use strict';
    var list=[41419,6731,8400,28349,26154,25001,8151,11428,9517,12912];
    var start=addX();


    function addX (){
        if ($("a.profile-button").length>0){
            $(list).each(function(x){
                if($("div.user-info-value a").attr("href")=="/factions.php?step=profile&ID="+list[x]){
                    $('<svg xmlns="http://www.w3.org/2000/svg" class="default___25YWq " filter="" fill="rgba(217, 54, 0, 0.5)" stroke="#d4d4d4" stroke-width="0" width="46" height="46" viewBox="551.393 356 44 44"><path d="M556.393,363l12.061,14-12.061,14,1,1,14-11.94,14,11.94,1-1-12.06-14,12.06-14-1-1-14,11.94-14-11.94Z"></path></svg>').replaceAll("a.profile-button-attack svg");

                }})
        }
        else {setTimeout(function (){addX()},500);}
    }

    })();