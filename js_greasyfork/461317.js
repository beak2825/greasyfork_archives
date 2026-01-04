// ==UserScript==
// @name          Plurk 置頂或置底
// @version       1.0.1
// @description   預設：置頂 / 打勾：置底
// @author        Hayao-Gai
// @namespace     https://github.com/HayaoGai
// @icon          https://i.imgur.com/NobhW0E.png
// @match         https://www.plurk.com/p/*
// @grant         GM.getValue
// @grant         GM.setValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/461317/Plurk%20%E7%BD%AE%E9%A0%82%E6%88%96%E7%BD%AE%E5%BA%95.user.js
// @updateURL https://update.greasyfork.org/scripts/461317/Plurk%20%E7%BD%AE%E9%A0%82%E6%88%96%E7%BD%AE%E5%BA%95.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

( function () {

    'use strict'

    const STYLE = `
.fixed {
    position: fixed;
    left: 15px;
    bottom: 15px;
    width: 15px;
    height: 15px;
}`

    let checkbox

    function goTopOrBottom () {
        const pos = checkbox.checked ? document.body.scrollHeight : 0
        window.scrollTo( 0, pos )
    }

    async function addCheckBox () {
        checkbox = document.createElement( "input" )
        checkbox.type = "checkbox"
        const web = window.location.href.split( "/p/" )[ 1 ]
        const checked = await GM.getValue( web, true )
        checkbox.checked = !checked
        checkbox.classList.add( "fixed" )
        checkbox.addEventListener( "change", function () {
            goTopOrBottom()
            const web = window.location.href.split( "/p/" )[ 1 ]
            if ( this.checked ) {
                GM.setValue( web, false )
            } else {
                GM.setValue( web, true )
            }
        } )
        document.body.append( checkbox )
    }

    function css () {
        const style = document.createElement( "style" )
        style.type = "text/css"
        style.innerHTML = STYLE
        document.head.appendChild( style )
    }

    function main () {
        css()
        addCheckBox()
        for ( let i = 0; i < 3; i++ ) setTimeout( goTopOrBottom, 500 * i )
    }

    main()

})()
