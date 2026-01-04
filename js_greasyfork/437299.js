// ==UserScript==
// @name SearX Proxified Image Source
// @namespace -
// @version 1.0.0
// @description changes original href link to proxified.
// @author NotYou
// @include *searx.fmac.xyz/*
// @include *searx.be/*
// @include *serx.ml/*
// @include *searx.tiekoetter.com/*
// @include *paulgo.io/*
// @include *search.unlocked.link/*
// @include *search.sapti.me/*
// @include *search.rhscze.cf/*
// @include *priv.au/*
// @include *search.bus-hit.me/*
// @include *notsearch.uk/*
// @include *northboot.xyz/*
// @include *opnxng.com/*
// @include *searx.ebnar.xyz/*
// @include *searxng.nicfab.eu/*
// @include *searx.tuxcloud.net/*
// @include *search.rabbit-company.com/*
// @include *search.chemicals-in-the-water.eu/*
// @include *searx.namejeff.xyz/*
// @include *swag.pw/*
// @include *search.smnz.de/*
// @include *trydex.tk/*searxng/
// @include *searx.prvcy.eu/*
// @include *searx.oakleycord.dev/*
// @include *searx.mha.fi/*
// @include *sh0.it/*
// @include *metasearch.nl/*
// @include *search.mdosch.de/*
// @include *searx.ericaftereric.top/*
// @include *searxngsearch.com/*
// @include *search.drivet.xyz/*
// @include *de.xcxc.ml/*
// @include *searx.sev.monster/*
// @include *searx.baczek.me/*
// @include *search.rowie.at/*
// @include *search.cronobox.one/*
// @include *searx.fi/*
// @include *ooglester.com/*
// @include *xo.wtf/*
// @include *s.frlt.one/*
// @include *s.zhaocloud.net/*
// @include *www.gruble.de/*
// @include *search.projectsegfau.lt/*
// @include *search.gcomm.ch/*
// @include *searx.priv.pw/*
// @include *search.zzls.xyz/*
// @include *searx.chocoflan.net/*
// @include *searx.mistli.net/*
// @include *s.trung.fun/*
// @include *searxng.zackptg5.com/*
// @include *searx.rimkus.it/*
// @include *searx.org/*
// @include *search.mpx.wtf/*
// @include *search.disroot.org/*
// @include *search.privacyguides.net/*
// @include *searx.esmailelbob.xyz/*
// @include *search.vidhukant.xyz/*
// @include *searx.sethforprivacy.com/*
// @include *search.serginho.dev/*
// @include *search.affusio.com/*
// @include *searx.juancord.xyz/*
// @include *searxng.dupa.edu.pl/*
// @include *darmarit.org/*searx/
// @include *search.neet.works/*
// @include *searx.zcyph.cc/*
// @include *search.teamriverbubbles.com/*
// @include *jackgoss.xyz/*
// @include *etsi.me/*
// @include *soek.allesbeste.com/*
// @include *search.uspersec.com/*
// @include *saber.tk/*
// @include *search.kiwitalk.de/*
// @include *search.0relay.com/*
// @include *srx.cosmohub.io/*
// @include *privatus.live/*
// @include *searx.kujonello.cf/*
// @include *searx.becomesovran.com/*
// @include *searx.gnous.eu/*
// @include *searx.orion-hub.fr/*
// @include *searx.slipfox.xyz/*searx/
// @include *searx.ru/*
// @include *searx.webheberg.info/*
// @include *searx.mastodontech.de/*
// @include *searx.dresden.network/*
// @include *searx.sp-codes.de/*
// @include *searx.xyz/*
// @include *searx.win/*
// @include *searx.roflcopter.fr/*
// @include *searx.netzspielplatz.de/*
// @include *sx.catgirl.cloud/*
// @include *suche.tromdienste.de/*
// @include *search.trom.tf/*
// @include *searx.mxchange.org/*
// @include *searx.tyil.nl/*
// @include *search.stinpriza.org/*
// @include *salsa.debian.org/*debian/searx
// @include *searx.bissisoft.com/*
// @include *searx.stuehieyr.com/*
// @include *searx.gnu.style/*
// @include *searx.divided-by-zero.eu/*
// @include *dynabyte.ca/*
// @include *search.snopyta.org/*
// @include *searxng.ir/*
// @include *searx.run/*
// @include *searx.nakhan.net/*
// @include *searx.nixnet.services/*
// @include *timdor.noip.me/*searx/
// @include *search.ethibox.fr/*
// @include *searx.zapashcanon.fr/*
// @include *searx.vanwa.tech/*
// @include *spot.ecloud.global/*
// @include *jsearch.pw/*
// @include *www.webrats.xyz/*
// @grant none
// @run-at document-idle
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/437299/SearX%20Proxified%20Image%20Source.user.js
// @updateURL https://update.greasyfork.org/scripts/437299/SearX%20Proxified%20Image%20Source.meta.js
// ==/UserScript==

var not_jQuery = class {
    constructor(el, els) {
        this.el = el instanceof HTMLElement ? el : document.querySelector(el)
        this.els = el instanceof HTMLElement ? [el] : Array.from(document.querySelectorAll(el))
    }

    each(fn) {
        if(this.els) {
            for (let i = 0; i < this.els.length; i++) {
                fn(new not_jQuery(this.els[i]))
            }
        }
    }

    attr(name, value) {
        if(!value) {
            return this.el.getAttribute(name)
        }

        return this.el.setAttribute(name, value)
    }

    parent() {
        return new not_jQuery(this.el.parentNode)
    }
}

$('.img-thumbnail').each(e => {
    let src = e.attr('src')
    e.parent().attr('href', src)
})

$('.image-thumbnail').each(e => {
    let src = e.attr('src')
    e.parent().attr('href', src)
})

$('.image_thumbnail').each(e => {
    let src = e.attr('src')
    e.parent().attr('href', src)
})

function $(selector) {
    return new not_jQuery(selector)
}
