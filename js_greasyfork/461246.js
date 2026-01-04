// ==UserScript==
// @name                Plurk 夜間模式
// @version             1.0.7
// @description         夜間模式
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://i.imgur.com/NobhW0E.png
// @match               https://www.plurk.com/anonymous
// @match               https://www.plurk.com/p/*
// @match               https://www.plurk.com/search?*
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/461246/Plurk%20%E5%A4%9C%E9%96%93%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/461246/Plurk%20%E5%A4%9C%E9%96%93%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    "use strict"

    const DARK1 = "#1a1a1a"
    const DARK2 = "#2c2e2e"
    const NAME1 = "#ec75ed"
    const NAME2 = "#000000"
    const TEXT = "#a7a7a7"
    const LINK = "#406dff"
    let isAnonymous = false

    function main () {
        checkAnonymous()
        darkBackground()
        observeNewComment()
        for ( let i = 0; i < 10; i++ ) {
            setTimeout( darkArticle, 500 * i )
            setTimeout( darkBigPlurk, 500 * i )
        }
    }

    function update () {
        darkBackground()
        darkArticle()
    }

    function checkAnonymous () {
        isAnonymous = !!document.querySelector( ".q_whispers" )
    }

    function darkBackground () {
        const background1 = document.querySelector( "#layout_body" )
        const background2 = document.querySelector( ".bar-color" )
        const background3 = document.querySelector( "footer" )
        const background4 = document.querySelector( "#timeline_holder" )
        const background5 = document.querySelector( "#front-content" )
        const background6 = document.querySelector( ".search-holder" )
        const background7 = document.querySelector( "#search-date" )
        const background8 = document.querySelector( "#search-term" )
        !!background1 && ( background1.style.background = DARK1 )
        !!background2 && ( background2.style.background = DARK1 )
        !!background3 && ( background3.style.background = DARK1 )
        !!background4 && ( background4.style.background = DARK1 )
        !!background5 && ( background5.style.background = DARK1 )
        !!background6 && ( background6.style.background = DARK1 )
        !!background7 && ( background7.style.background = DARK2 )
        !!background8 && ( background8.style.color = TEXT )
    }

    function darkArticle () {
        const article = document.querySelector( "article" )
        if ( !article ) return
        const article1 = article.querySelector( ".bigplurk" )
        const article2 = article.querySelector( "#plurk_responses" )
        !!article1 && ( article1.style.backgroundColor = DARK2 )
        !!article2 && ( article2.style.backgroundColor = DARK2 )
        if ( !!article2 ) {
            const plurks = article2.querySelectorAll( ".plurk" )
            plurks.forEach( p => { p.style.background = DARK2 } )
        }
        darkText( article )
    }

    function darkText ( article ) {
        article.querySelectorAll( ".empty" ).forEach( empty => { empty.style.color = TEXT } )
        article.querySelectorAll( ".text_holder" ).forEach( text => { text.style.color = TEXT } )
        article.querySelectorAll( ".ex_link" ).forEach( link => { link.style.color = LINK } )
        article.querySelectorAll( ".char_updater" ).forEach( char => { char.style.color = TEXT } )
        !!isAnonymous && article.querySelectorAll( ".name" ).forEach( name => { name.style.color = NAME1 } )
        !isAnonymous && article.querySelectorAll( ".name" ).forEach( name => {
            const style = getComputedStyle( name )
            if ( style.color === "rgb(17, 17, 17)" ) name.style.color = NAME2
        } )
    }

    function darkBigPlurk () {
        const plurks = document.querySelectorAll( ".bigplurk" )
        plurks.forEach( plurk => {
            plurk.style.backgroundColor = DARK2
            plurk.querySelectorAll( ".text_holder" ).forEach( text => { text.style.color = TEXT } )
        } )
    }

    function observerSystem ( target ) {
        const Mutation = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
        const config = { attributes: true, childList: true, characterData: true }
        const observer = new Mutation( update )
        observer.observe( target, config )
    }

    function observeNewComment () {
        const list = document.querySelector( ".list" )
        !!list && observerSystem( list )
    }

    main()

})();
