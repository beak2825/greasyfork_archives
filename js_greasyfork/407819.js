// ==UserScript==
// @name         helper ZEIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Accept banner-accept
// @author       LYNX
// @match        https://www.zeit.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407819/helper%20ZEIT.user.js
// @updateURL https://update.greasyfork.org/scripts/407819/helper%20ZEIT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        var banner = document.querySelector('button.box__button.box__button--btncons');
        if( banner ) banner.click();
    },1000);
})();


/*

window.Helper = {
    cookieCreate: function( name, value, days, domain, secure, samesite ) {
        var expires = '',
            cookietext = '';

        domain = domain ? domain : 'zeit.de'; // this.cookieFallbackDomain;

        if ( days ) {
            var date = new Date();
            date.setTime( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
            expires = '; expires=' + date.toUTCString();
        }

        cookietext = name + '=' + value + expires + '; path=/; domain=' + domain;

        if (typeof samesite === 'string') {
            cookietext += ';samesite=' + samesite;
        }

        if ( secure ) {
            cookietext += ';secure';
        }

        document.cookie = cookietext;
    },
    cookieRead: function( name ) {
        return ( document.cookie.match( '(?:^|;) ?' + name + '\\s*=\\s*([^;]*)' ) || 0 )[ 1 ];
    }
}


window.Helper.cookieCreate('zon_cookietest', 'works', 1);
if (window.Helper.cookieRead('zon_cookietest') !== 'works') {
    document.querySelector( '.box-wrapper' ).innerHTML = '<article class="box"><p>Um zeit.de nutzen zu können, müssen Cookies in Ihrem Browser aktiviert sein.</p></article>';
} else {
    window.Helper.cookieCreate('zon_cookietest', 'works', -1);
    setTimeout(function(){
        var buttonSP = document.querySelector( '[id^="sp_message_"]' );

        // if SP not reachable
        if( !buttonSP ){
            var button = '<button class="box__button box__button--btncons">Einverstanden</button>',
                buttonBox = document.querySelector(".box__accbtn");
            buttonBox.innerHTML = button;

            buttonBox.addEventListener( 'click', function() {
                var name = 'zonconsent',
                    date = new Date(),
                    timestamp = date.toISOString(),
                    days = 7,
                    secure = window.Helper.toggles.get( 'https' ),
                    destination = window.Helper.consentUtils.getRedirectDestination();
                // record consent
                window.Helper.cookieCreate( name, timestamp, days, null, secure, 'lax' );

                // track to webtrekk
                if ( window.wt && typeof window.wt.sendinfo === 'function' ) {
                    var trackingInfo = {
                        linkId: '#decision_consent',
                        customClickParameter: {
                            4: window.Helper.breakpoint.getTrackingBreakpoint(),
                            5: 'consent_button',
                            9: 'fallback_button'
                        },
                        sendOnUnload: 1
                    };
                    window.wt.sendinfo( trackingInfo );
                }

                // redirect if applicable
                window.location.replace( destination );
            });
        }

        document.querySelector( '.box--loading' ).classList.remove("box--loading");
    }, 600);
}

*/
