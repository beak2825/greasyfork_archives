// ==UserScript==
// @name                Shopee: Remove Ad
// @namespace           https://github.com/HayaoGai
// @version             0.0.9
// @description         移除蝦皮搜尋結果最上層的廣告
// @author              Hayao-Gai
// @match               https://shopee.tw/*
// @icon                https://shopee.tw/pcmall-assets/assets/icon_favicon_1_96.png
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/476750/Shopee%3A%20Remove%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/476750/Shopee%3A%20Remove%20Ad.meta.js
// ==/UserScript==

( function () {

    "use strict"

    function removeShop ( condition ) {

        const shop = document.querySelector( condition )

        if ( !!shop && !shop.classList.contains( "remove" ) ) {

            shop.classList.add( "remove" )
            shop.style.display = "none"

        }

    }

    function removeItem ( condition ) {

        document.querySelectorAll( condition ).forEach( item => {

            if ( item.classList.contains( "remove" ) ) return
            item.classList.add( "remove" )
            const target = item.closest( "li" ) || item.closest( "[data-sqe='item']" )
            if ( !target ) return
            target.style.display = "none"

        } )

    }

    function main () {

        for ( let i = 0; i < 100; i++ ) {

            setTimeout( () => {

                removeShop( "[aria-label='label_a11y_search_shop_ads']" )
                removeShop( ".tUBDks" )
                removeItem( "[data-sqe='ad']" )

            }, 33 * i )

        }

    }

    function listenUrl () {

        window.addEventListener( "locationchange", main )

    }

    listenUrl()

    main()

} ) ()
