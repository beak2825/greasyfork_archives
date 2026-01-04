// ==UserScript==
// @name Faviconize SearX
// @namespace -
// @version 1.3.0
// @description Add favicons to SearX/SearXNG
// @author NotYou
// @match *://searx.be/search*
// @match *://search.rhscz.eu/search*
// @match *://searxng.site/search*
// @match *://search.bus-hit.me/search*
// @match *://priv.au/search*
// @match *://search.hbubli.cc/search*
// @match *://search.inetol.net/search*
// @match *://searxng.ca/search*
// @match *://searx.rhscz.eu/search*
// @match *://s.mble.dk/search*
// @match *://search.im-in.space/search*
// @match *://opnxng.com/search*
// @match *://search.mdosch.de/search*
// @match *://www.gruble.de/search*
// @match *://search.sapti.me/search*
// @match *://xo.wtf/search*
// @match *://search.rowie.at/search*
// @match *://searx.catfluori.de/search*
// @match *://searx.dresden.network/search*
// @match *://searx.techsaviours.org/search*
// @match *://search.projectsegfau.lt/search*
// @match *://searx.si/search*
// @match *://twinkpad.pl/search*
// @match *://vanderwilhelm.me/search*
// @match *://searxng.online/search*
// @match *://baresearch.org/search*
// @match *://searx.foss.family/search*
// @match *://searx.tuxcloud.net/search*
// @match *://searx.daetalytica.io/search*
// @match *://searx.ari.lt/search*
// @match *://search.privacyredirect.com/search*
// @match *://copp.gg/search*
// @match *://searxng.ch/search*
// @match *://searx.perennialte.ch/search*
// @match *://search.leptons.xyz/search*
// @match *://ooglester.com/search*
// @match *://searx.aleteoryx.me/search*
// @match *://sx.thatxtreme.dev/search*
// @match *://searx.ee/search*
// @match *://sxng.violets-purgatory.dev/search*
// @match *://search.nadeko.net/search*
// @match *://search.ngn.tf/search*
// @match *://s.trung.fun/search*
// @match *://search.in.projectsegfau.lt/search*
// @match *://searx.sev.monster/search*
// @match *://darmarit.org/searx/search*
// @match *://searxng.brihx.fr/search*
// @match *://www.jabber-germany.de/searx/search*
// @match *://searx.namejeff.xyz/search*
// @match *://searx.lunar.icu/search*
// @match *://search.colbster937.dev/search*
// @match *://searx.oakleycord.dev/search*
// @match *://nyc1.sx.ggtyler.dev/search*
// @match *://search.starless.one/search*
// @match *://searx.juancord.xyz/search*
// @match *://etsi.me/search*
// @match *://freesearch.club/search*
// @match *://searx.zhenyapav.com/search*
// @match *://search.datura.network/search*
// @match *://search.demoniak.ch/search*
// @match *://search.ononoki.org/search*
// @match *://search.einfachzocken.eu/search*
// @match *://searx.work/search*
// @match *://search.smnz.de/search*
// @match *://sx.catgirl.cloud/search*
// @match *://northboot.xyz/search*
// @match *://paulgo.io/search*
// @match *://search.gcomm.ch/search*
// @match *://searx.ankha.ac/search*
// @match *://searx.headpat.exchange/search*
// @match *://searx.ox2.fr/search*
// @match *://searx.nobulart.com/search*
// @match *://sex.finaltek.net/search*
// @match *://searx.baczek.me/search*
// @run-at document-end
// @license GPL-3.0-or-later
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/444453/Faviconize%20SearX.user.js
// @updateURL https://update.greasyfork.org/scripts/444453/Faviconize%20SearX.meta.js
// ==/UserScript==

class Styles {
    static addStyle(css) {
        const styleNode = document.createElement('style')

        document.head.appendChild((styleNode.textContent = css,styleNode))
    }

    static init() {
        this.addStyle(`
        .js-favicon {
            padding: 0 3px 5px 2px !important;
            width: 20px !important;
            height: 20px !important;
        }`)
    }
}

class DuckDuckGo {
    static getFavicon(host) {
        return `https://icons.duckduckgo.com/ip3/${host}.ico`
    }
}

class Google {
    static getFavicon(host) {
        return 'https://www.google.com/s2/favicons?domain=' + host
    }
}

class Statvoo {
    static getFavicon(host) {
        return 'https://api.statvoo.com/favicon/' + host
    }
}

class Faviconize {
    static init() {
        document.querySelectorAll('.result > .url_wrapper, .result > .result_header').forEach(el => {
            if (el.querySelector('.js-favicon')) {
                return
            }

            const link = el.href || el.querySelector('a').href
            const host = new URL(link).host
            const icon = document.createElement('img')

            icon.className = 'js-favicon'
            icon.alt = host
            icon.src = DuckDuckGo.getFavicon(host)
            icon.setAttribute('onerror', `this.setAttribute('onerror', 'this.src = "${Statvoo.getFavicon(host)}"'); this.src = "${Google.getFavicon(host)}"`)

            el.prepend(icon)
        })
    }
}

class Main {
    static init() {
        Styles.init()
        Faviconize.init()

        const obs = new MutationObserver(() => {
            Faviconize.init()
        })

        obs.observe(document.body, {
            childList: true,
            subtree: true
        })
    }
}

Main.init()