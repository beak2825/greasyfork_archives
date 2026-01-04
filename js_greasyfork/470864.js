// ==UserScript==
// @name         New Instance Button for Redlib
// @namespace    happyviking
// @version      1.60.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Adds a button to Redlib (previously Libreddit) instances to redirect to a new instance.
// @icon         https://gitlab.com/uploads/-/system/project/avatar/32545239/libreddit.png
// @author       HappyViking

// <<INSTANCES START HERE>>
// @match https://libreddit.diffraction.dev/*
// @match https://libreddit.privacydev.net/*
// @match https://red.artemislena.eu/*
// @match https://reddit.adminforge.de/*
// @match https://reddit.nerdvpn.de/*
// @match https://reddit.rtrace.io/*
// @match https://redlib.catsarch.com/*
// @match https://redlib.minihoot.site/*
// @match https://redlib.orangenet.cc/*
// @match https://redlib.perennialte.ch/*
// @match https://redlib.privacyredirect.com/*
// @match https://redlib.privadency.com/*
// @match https://redlib.r4fo.com/*
// @match https://redlib.thebunny.zone/*
// @match https://rl.blitzw.in/*
// @match https://safereddit.com/*
// @match https://red.ngn.tf/*
// @match https://redlib.scanash.xyz/*
// @match https://rl.bloat.cat/*
// @match https://redlib.4o1x5.dev/*
// @match https://eu.safereddit.com/*
// @match https://lr.ptr.moe/*
// @match https://redlib.nadeko.net/*
// @match https://redlib.tux.pizza/*
// @match https://l.opnxng.com/*
// @match https://libreddit.bus-hit.me/*
// @match https://libreddit.projectsegfau.lt/*
// @match https://lr.ggtyler.dev/*
// @match https://lr.n8pjl.ca/*
// @match https://r.darrennathanael.com/*
// @match https://red.arancia.click/*
// @match https://redlib.baczek.me/*
// @match https://redlib.ducks.party/*
// @match https://redlib.freedit.eu/*
// @match https://redlib.frontendfriendly.xyz/*
// @match https://redlib.incogniweb.net/*
// @match https://redlib.nirn.quest/*
// @match https://redlib.nohost.network/*
// @match https://redlib.privacy.com.de/*
// @match https://redlib.private.coffee/*
// @match https://redlib.reallyaweso.me/*
// @match https://redlib.seasi.dev/*
// @match https://redlib.vimmer.dev/*
// @match https://rl.rootdo.com/*
// @match https://lr.quitaxd.online/*
// @match https://redlib.nezumi.party/*
// @match https://redlib.kittywi.re/*
// @match https://reddit.idevicehacked.com/*
// @match https://redlib.privacy.deals/*
// @match https://reddit.owo.si/*
// @match https://redlib.dnfetheus.xyz/*
// @match https://libreddit.eu.org/*
// @match https://reddit.invak.id/*
// @match https://redlib.cow.rip/*
// @match https://redlib.xn--hackerhhle-kcb.org/*
// @match https://redlib.matthew.science/*
// @match https://libreddit.freedit.eu/*
// @match https://libreddit.hu/*
// @match https://libreddit.kylrth.com/*
// @match https://libreddit.lunar.icu/*
// @match https://libreddit.mha.fi/*
// @match https://libreddit.northboot.xyz/*
// @match https://libreddit.oxymagnesium.com/*
// @match https://libreddit.pussthecat.org/*
// @match https://libreddit.spike.codes/*
// @match https://libreddit.strongthany.cc/*
// @match https://libreddit.tiekoetter.com/*
// @match https://lr.4201337.xyz/*
// @match https://lr.aeong.one/*
// @match https://lr.artemislena.eu/*
// @match https://lr.slipfox.xyz/*
// @match https://r.walkx.fyi/*
// @match https://reddit.simo.sh/*
// @match https://reddit.smnz.de/*
// @match https://reddit.utsav2.dev/*
// @match https://snoo.habedieeh.re/*
// @match https://libreddit.kutay.dev/*
// @match https://libreddit.tux.pizza/*
// @match https://lr.vern.cc/*
// @match https://r.darklab.sh/*
// @match https://reddit.leptons.xyz/*
// @match https://discuss.whatever.social/*
// @match https://libreddit.kavin.rocks/*
// @match https://libreddit.cachyos.org/*
// @match https://libreddit.domain.glass/*
// @match https://libreddit.privacy.com.de/*
// @match https://reddit.baby/*
// <<INSTANCES END HERE>>

// @match https://oratrice.ptr.moe/*

// @downloadURL https://update.greasyfork.org/scripts/470864/New%20Instance%20Button%20for%20Redlib.user.js
// @updateURL https://update.greasyfork.org/scripts/470864/New%20Instance%20Button%20for%20Redlib.meta.js
// ==/UserScript==

function generateNewInstanceURL() {
    if (window.location.pathname.includes(".within.website")) {
        const urlObj = new URL(window.location.toString());
        const redir = urlObj.searchParams.get('redir');
        if (!redir) return false
        const decodedRedir = decodeURIComponent(redir);
        const redirUrl = new URL(decodedRedir);
        return 'https://farside.link/redlib/' + redirUrl.pathname + redirUrl.search
    }
    return 'https://farside.link/redlib/' + (window.location.pathname + window.location.search);
}

function isInAnubis() {
    return !!document.getElementById("anubis_version")
}

function main() {
    let parent = null
    if (isInAnubis()) {
        const mainSection = document.getElementsByTagName("main").item(0)
        if (!mainSection) return
        parent = mainSection
    } else {
        const navBar = document.querySelector('nav');
        if (!navBar) return
        const firstDivInNavBar = navBar.querySelector("div")
        parent = firstDivInNavBar
    }

    const newButton = document.createElement("button")
    parent.prepend(newButton)
    newButton.appendChild(document.createTextNode("New Instance"))
    newButton.onclick = () => {
        location.replace(generateNewInstanceURL());
    }

}

main()  