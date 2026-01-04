// ==UserScript==
// @name         Open in PlayMB
// @namespace    http://rokoucha.net/
// @version      1.0.1
// @description  MusicBrainz の recording を PlayMB で開くリンクを追加
// @author       rokoucha
// @license      MIT
// @match        https://musicbrainz.org/recording/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=musicbrainz.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456933/Open%20in%20PlayMB.user.js
// @updateURL https://update.greasyfork.org/scripts/456933/Open%20in%20PlayMB.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const target = document.querySelector('.subheader')
    if(!target) return

    const [[_, mbid]] = [...document.location.pathname.matchAll('/recording/([^/]+)')]

    const openPlayMBLink = document.createElement('a')
    openPlayMBLink.textContent = 'Open in PlayMB'
    openPlayMBLink.href = `https://playmb.rinsuki.net/recording/${mbid}`
    openPlayMBLink.target = '_blank'

    target.after(openPlayMBLink)
})()
