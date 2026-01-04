// ==UserScript==
// @name         위메프 수동완성
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  wemake
// @author       You
// @match        https://mescrow.wemakeprice.com/order/cartOrderForm?*
// @icon         https://www.google.com/s2/favicons?domain=wemakeprice.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433466/%EC%9C%84%EB%A9%94%ED%94%84%20%EC%88%98%EB%8F%99%EC%99%84%EC%84%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/433466/%EC%9C%84%EB%A9%94%ED%94%84%20%EC%88%98%EB%8F%99%EC%99%84%EC%84%B1.meta.js
// ==/UserScript==


(function() {
    var macro = setInterval(function() {
        if($('.m_wrap>.dimmed').css('display') == 'none'){
            $( 'span:contains("카드 선택")' ).trigger('click');
            setTimeout(function() {
                $( 'span:contains("신한카드")' ).trigger('click');
                $( '#app' ).trigger('click');
                var e = jQuery.Event( "keydown", { keyCode: 35 } );
                $(this).trigger( e );

                $( '.captcha .input' ).focus();
            }, 100);
            clearInterval(macro);
        }
    }, 50);
    var macro2 = setInterval(function() {
        if( $( 'button:contains("인증완료")' ).length>0){
            $( 'button:contains("원 결제하기")' ).trigger('click');
            clearInterval(macro2);
        }
    }, 50);



})();
