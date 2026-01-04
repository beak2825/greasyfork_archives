// ==UserScript==
// @name         Grepolis boerendorpen alarm JohnLatijn v1.0
// @namespace    written by KapteniZ
// @version      1.0
// @description  Gives an alarm after X seconds based on the period your claiming for.
// @author       KapteniZ
// @match        https://*.grepolis.com/game/*
// @downloadURL https://update.greasyfork.org/scripts/416720/Grepolis%20boerendorpen%20alarm%20JohnLatijn%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/416720/Grepolis%20boerendorpen%20alarm%20JohnLatijn%20v10.meta.js
// ==/UserScript==

!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function o(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function t(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(c," ")),u.json?JSON.parse(e):e}catch(n){}}function r(n,o){var i=u.raw?n:t(n);return e.isFunction(o)?o(i):i}var c=/\+/g,u=e.cookie=function(t,c,s){if(arguments.length>1&&!e.isFunction(c)){if(s=e.extend({},u.defaults,s),"number"==typeof s.expires){var a=s.expires,d=s.expires=new Date;d.setMilliseconds(d.getMilliseconds()+864e5*a)}return document.cookie=[n(t),"=",i(c),s.expires?"; expires="+s.expires.toUTCString():"",s.path?"; path="+s.path:"",s.domain?"; domain="+s.domain:"",s.secure?"; secure":""].join("")}for(var f=t?void 0:{},p=document.cookie?document.cookie.split("; "):[],l=0,m=p.length;m>l;l++){var x=p[l].split("="),g=o(x.shift()),j=x.join("=");if(t===g){f=r(j,c);break}t||void 0===(j=r(j))||(f[g]=j)}return f};u.defaults={},e.removeCookie=function(n,o){return e.cookie(n,"",e.extend({},o,{expires:-1})),!e.cookie(n)}});
const AAID = 0;
const APID = 1425360;
const APID2= 1245487;
const G_AID = Game.alliance_id;
var claimTimeout = false;
var claimAudio = new Audio( 'https://proxy.notificationsounds.com/notification-sounds/coins-497/download/file-sounds-869-coins.mp3' );
var urlParams = new URLSearchParams(window.location.search);
var URL_PID = urlParams.get('p');

$.cookie( 'BDA-PID', URL_PID);
$.cookie( 'BDA-AID', G_AID);
console.log("URL_PID = " + URL_PID + " ; G_AID = " + G_AID);


claimAudio.addEventListener( 'ended', function() {
    this.currentTime = 0;
}, false );

function QueueSound() {

    if( claimTimeout ) {
        claimAudio.pause();
        claimAudio.currentTime = 0;
        window.clearTimeout( claimTimeout );
    }
    console.log("In function: QueueSound()");

    claimTimeout = setTimeout( function() {
        $( '.ui_quickbar .left .container' ).fadeOut( function() {
            $( '.ui_quickbar .left' ).prepend( '<div class="claimResources">Boerendorpen zijn klaar</div>' );
        } );
        claimAudio.play();
        setTimeout(() => { claimAudio.pause(); }, 2000);
        let r_ok = confirm("Boerendorpen klaar!");
        if (r_ok == true) {
            javascript:Layout.wnd.Create(Layout.wnd.TYPE_FARM_TOWN_OVERVIEWS,"Farming Town Overview");void(0)

        } else {
        }
    }, parseInt( $.cookie( 'BDA-CLR' ) ) - parseInt( jQuery.now() ) );

}

if((G_AID == AAID) || URL_PID == APID || URL_PID == APID2){
    console.log("Player " + Game.player_name + " [" + Game.player_id + "] approved");
    $( document ).ready( function() {

        $( 'head' ).append( $( '<style>.ui_quickbar .claimResources { font-weight: bold; color: red; position: absolute; top: 0; left: 47px; right: 93px; text-align: center; width: 50%; height: 22px; }</style>' ) );

        if( parseInt( $.cookie( 'BDA-CLR' ) ) ) {
            QueueSound();
        }

        $( 'body' ).on( 'click', '#fto_claim_button', function() {
            console.log("Resources claimed");
            //switch between quickbar and warning
            $( '.claimResources' ).remove();
            $( '.ui_quickbar .left .container' ).fadeIn();


            setTimeout(() => {
                let str = $(".unlock_time").text().split(" ");
                let hms = str[2].split(":");
                let nxt_clm = new Date();
                nxt_clm.setHours(hms[0],hms[1],hms[2]);
                console.log("Next claim: " + str[2]);

                $.cookie( 'BDA-CLR', (nxt_clm.getTime()));

                QueueSound();
            }, 15000);

        } );

    } );
}
else{
    console.log("Player " + Game.player_name + " [" + Game.player_id + "] not supported");
    alert(Game.player_name + " is not allowed to use this script.");
}