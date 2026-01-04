// ==UserScript==
// @name         Grepolis boerendorpen alarm v1.0 beta
// @namespace    written by KapteniZ for Staatwaarde
// @version      1.0 beta
// @description  Gives an alarm after X seconds based on the period your claiming for.
// @author       KapteniZ
// @match        https://*.grepolis.com/game/*
// @downloadURL https://update.greasyfork.org/scripts/416460/Grepolis%20boerendorpen%20alarm%20v10%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/416460/Grepolis%20boerendorpen%20alarm%20v10%20beta.meta.js
// ==/UserScript==

!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function o(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function t(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(c," ")),u.json?JSON.parse(e):e}catch(n){}}function r(n,o){var i=u.raw?n:t(n);return e.isFunction(o)?o(i):i}var c=/\+/g,u=e.cookie=function(t,c,s){if(arguments.length>1&&!e.isFunction(c)){if(s=e.extend({},u.defaults,s),"number"==typeof s.expires){var a=s.expires,d=s.expires=new Date;d.setMilliseconds(d.getMilliseconds()+864e5*a)}return document.cookie=[n(t),"=",i(c),s.expires?"; expires="+s.expires.toUTCString():"",s.path?"; path="+s.path:"",s.domain?"; domain="+s.domain:"",s.secure?"; secure":""].join("")}for(var f=t?void 0:{},p=document.cookie?document.cookie.split("; "):[],l=0,m=p.length;m>l;l++){var x=p[l].split("="),g=o(x.shift()),j=x.join("=");if(t===g){f=r(j,c);break}t||void 0===(j=r(j))||(f[g]=j)}return f};u.defaults={},e.removeCookie=function(n,o){return e.cookie(n,"",e.extend({},o,{expires:-1})),!e.cookie(n)}});
const staatwaarde = 1121874;
const kapteniZ = 1425360;
var claimTimeout = false;
var claimAudio = new Audio( 'https://proxy.notificationsounds.com/notification-sounds/coins-497/download/file-sounds-869-coins.mp3' );
var urlParams = new URLSearchParams(window.location.search);
var pid = urlParams.get('p');

$.cookie( 'BDA-PID', pid);
console.log("pid = " + pid);


claimAudio.addEventListener( 'ended', function() {
    this.currentTime = 0;
}, false );





function QueueSound() {

    if( claimTimeout ) {
        claimAudio.pause();
        claimAudio.currentTime = 0;
        window.clearTimeout( claimTimeout );
    }

    claimTimeout = setTimeout( function() {
        $( '.ui_quickbar .left .container' ).fadeOut( function() {
            $( '.ui_quickbar .left' ).prepend( '<div class="claimResources">Boerendorpen zijn klaar</div>' );
        } );
        claimAudio.play();
        setTimeout(() => { claimAudio.pause(); }, 2000);
        var r = confirm("Boerendorpen klaar!");
        if (r == true) {
            javascript:Layout.wnd.Create(Layout.wnd.TYPE_FARM_TOWN_OVERVIEWS,"Farming Town Overview");void(0)

        } else {
        }
    }, parseInt( $.cookie( 'grepolis-claim-ready' ) ) - parseInt( jQuery.now() ) );

}

if((pid == staatwaarde) || pid == kapteniZ ){
    alert("Player approved");
    $( document ).ready( function() {

        $( 'head' ).append( $( '<style>.ui_quickbar .claimResources { font-weight: bold; color: red; position: absolute; top: 0; left: 47px; right: 93px; text-align: center; width: 50%; height: 22px; }</style>' ) );

        if( parseInt( $.cookie( 'BDA-CLR' ) ) ) {
            QueueSound();
        }

        $( 'body' ).on( 'click', '#fto_claim_button', function() {
            //switch between quickbar and warning
            $( '.claimResources' ).remove();
            $( '.ui_quickbar .left .container' ).fadeIn();


            setTimeout(() => {
                alert("button pressed");

                /*var time = $( '#time_options_wrapper .fto_time_checkbox.active' ).attr( 'data-option' );
               if($( '#time_options_wrapper .time_options_loyalty .fto_time_checkbox.active' ).attr( 'data-option' )>time){
                   time = $( '#time_options_wrapper .time_options_loyalty .fto_time_checkbox.active' ).attr( 'data-option'    );
               }*/

                var res = $(".unlock_time").text().split(" ");
                var det = res[2].split(":");
                var tdy = new Date();
                tdy.setHours(det[0],det[1],det[2]);
                console.log(tdy);


                //$.cookie( 'grepolis-claim-ready', ( parseInt( jQuery.now() ) ) + ( parseInt( time ) * 1000) );
                $.cookie( 'BDA-CLR', (tdy.getTime()));

                QueueSound();
            }, 30000);

        } );

    } );
}