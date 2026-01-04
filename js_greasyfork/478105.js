// ==UserScript==
// @name          Steam 自動跳過年齡確認
// @namespace     https://github.com/HayaoGai
// @version       0.0.1
// @description   自動跳過年齡確認
// @author        Hayao-Gai
// @match         https://store.steampowered.com/*
// @icon          https://store.steampowered.com/favicon.ico
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/478105/Steam%20%E8%87%AA%E5%8B%95%E8%B7%B3%E9%81%8E%E5%B9%B4%E9%BD%A1%E7%A2%BA%E8%AA%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/478105/Steam%20%E8%87%AA%E5%8B%95%E8%B7%B3%E9%81%8E%E5%B9%B4%E9%BD%A1%E7%A2%BA%E8%AA%8D.meta.js
// ==/UserScript==

(function() {

    'use strict'

    function replaceUrl () {

        if ( !window.location.href.includes( "agecheck" ) ) return
        window.location.href = window.location.href.replace( "agecheck/", "" )

    }

    function listenUrl () {

        window.addEventListener( "locationchange", replaceUrl )

    }

    function main () {

        listenUrl()
        replaceUrl()

    }

    main()

})()
