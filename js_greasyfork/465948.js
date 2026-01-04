// ==UserScript==
// @name         Proxy Redirect
// @author       Schimon Jehudah, Adv.
// @collaborator hacker09
// @collaborator Konf
// @homepageURL  https://greasyfork.org/scripts/465936-proxy-redirect
// @supportURL   https://greasyfork.org/scripts/465936-proxy-redirect/feedback
// @copyright    2023 - 2025, Schimon Jehudah (http://schimon.i2p)
// @license      AGPL-3.0-only; https://www.gnu.org/licenses/agpl-3.0.en.html
// @namespace    i2p.schimon.proxy-redirect
// @description  Redirect to privacy respecting proxy frontends
// @tag          proxy
// @run-at       document-start
// @version      25.12.03
// @grant        GM.getValue
// @grant        GM.notification
// @grant        GM.registerMenuCommand
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @match        file:///*
// @match        *://*/*
// @connect      0011.lt
// @connect      076.ne.jp
// @connect      0ut0f.space
// @connect      1search.i2p
// @connect      1d4.us
// @connect      2syis2nnyytz6jnusnjurva4swlaizlnleiks5mjp46phuwjbdjqwgqd.onion
// @connect      40two.app
// @connect      42l.fr
// @connect      absturztau.be
// @connect      actionsack.com
// @connect      adminforge.de
// @connect      albony.xyz
// @connect      arancia.click
// @connect      artemislena.eu
// @connect      asynchronousexchange.com
// @connect      batsense.net
// @connect      bibliogram.art
// @connect      btdig.i2p
// @connect      btdig.com
// @connect      btdigggink2pdqzqrik3blmqemsbntpzwxottujilcdjfz56jumzfsyd.onion
// @connect      bus-hit.me
// @connect      cadence.moe
// @connect      catsarch.i2p
// @connect      catfluori.de
// @connect      cblgh.org
// @connect      censors.us
// @connect      chauvet.pro
// @connect      citizen4.eu
// @connect      cowfee.moe
// @connect      creller.net
// @connect      crewz.me
// @connect      cn.i2p
// @connect      datatunnel.xyz
// @connect      dc09.ru
// @connect      dcs0.hu
// @connect      domain.glass
// @connect      datura.network
// @connect      duckdns.org
// @connect      ducks.party
// @connect      dynabyte.ca
// @connect      ebnar.xyz
// @connect      envs.net
// @connect      esmail5pdn24shtvieloeedh7ehz3nrwcdivnfhfcedl7gf4kwddhkqd.onion
// @connect      etsi.me
// @connect      exarius.org
// @connect      facilmap.org
// @connect      farside.link
// @connect      fdn.fr
// @connect      flokinet.to
// @connect      flux.industries
// @connect      fmac.xyz
// @connect      froth.zone
// @connect      gatti.ninja
// @connect      ggc-project.de
// @connect      ggtyler.dev
// @connect      gnu.style
// @connect      go.metastem.su
// @connect      grimneko.de
// @connect      hostux.net
// @connect      hxvy0.gq
// @connect      hyperborea.cloud
// @connect      iket.me
// @connect      il.ax
// @connect      incogniweb.net
// @connect      incogsnoo.com
// @connect      invak.id
// @connect      jamiethalacker.dev
// @connect      jeikobu.net
// @connect      jewtube.i2p
// @connect      jing.rocks
// @connect      josias.dev
// @connect      jpope.org
// @connect      k62ptris7p72aborr4zoanee7xai6wguucveptwgxs5vbgt7qzpq.b32.i2p
// @connect      kavin.rocks
// @connect      kittywi.re
// @connect      kylrth.com
// @connect      ledditqo2mxfvlgobxnlhrkq4dh34jss6evfkdkb2thlvy6dn4f4gpyd.onion
// @connect      libredd.it
// @connect      libreddit.de
// @connect      libreddit.eu.org
// @connect      libreddit.hu
// @connect      libreddit.nl
// @connect      lingva.ml
// @connect      lqs5fjmajyp7rvp4qvyubwofzi6d4imua7vs237rkc4m5qogitqwrgyd.onion
// @connect      lr.n8pjl.ca
// @connect      lunar.icu
// @connect      melmac.space
// @connect      mint.lgbt
// @connect      moeyy.cn
// @connect      moomoo.me
// @connect      mywire.org
// @connect      mdosch.de
// @connect      monocles.de
// @connect      nadeko.net
// @connect      neet.works
// @connect      nerdvpn.de
// @connect      netlify.app
// @connect      neuters.de
// @connect      ngn.tf
// @connect      nitter.hu
// @connect      nitter.it
// @connect      nitter.net
// @connect      nitter.one
// @connect      nixnet.services
// @connect      no-logs.com
// @connect      nogoo.me
// @connect      northboot.xyz
// @connect      nttr.stream
// @connect      oakleycord.dev
// @connect      ononoki.org
// @connect      ooguy.com
// @connect      openstreetmap.org
// @connect      osi.kr
// @connect      oversold.host
// @connect      owacon.moe
// @connect      owo.si
// @connect      pabloferreiro.es
// @connect      paulgo.io
// @connect      pavot.ca
// @connect      perditum.com
// @connect      phreedom.club
// @connect      piped.video
// @connect      poketube.fun
// @connect      priv.au
// @connect      privacy.com.de
// @connect      privadency.com
// @connect      private.coffee
// @connect      projectsegfau.lt
// @connect      procurx.pt
// @connect      prvcy.eu
// @connect      puffyan.us
// @connect      pussthecat.org
// @connect      qwik.i2p
// @connect      qwikxx2erhx6qrymued6ox2qkf2yeogjwypqvzoif4fqkljixasr6oid.onion
// @connect      r.nf
// @connect      r4fo.com
// @connect      rabbit-company.com
// @connect      rasp.fr
// @connect      reallyaweso.me
// @connect      resrv.org
// @connect      revvy.de
// @connect      riverside.rocks
// @connect      rtrace.io
// @connect      scribe.rip
// @connect      search.cdev.nexus
// @connect      search.im-in.space
// @connect      search.zdechov.net
// @connect      searx.ankha.ac
// @connect      searx.be
// @connect      searx.ee
// @connect      searx.fi
// @connect      searx.ninja
// @connect      searx.ru
// @connect      sethforprivacy.com
// @connect      simplifiedprivacy.com
// @connect      simplytranslate.org
// @connect      smnz.de
// @connect      snopyta.org
// @connect      sny.sh
// @connect      some-things.org
// @connect      sp-codes.de
// @connect      spike.codes
// @connect      spjmllawtheisznfs7uryhxumin26ssv2draj7oope3ok3wuhy43eoyd.onion
// @connect      strongthany.cc
// @connect      stuehieyr.com
// @connect      sugoma.tk
// @connect      syncpundit.com
// @connect      teddit.i2p
// @connect      teddit.net
// @connect      tedditfyn6idalzso5wam5qd3kdtxoljjhbrbbx34q2xkcisvshuytad.onion
// @connect      theanonymouse.xyz
// @connect      tinfoil-hat.net
// @connect      tiekoetter.com
// @connect      tm4rwkeysv3zz3q5yacyr4rlmca2c4etkdobfvuqzt6vsfsu4weq.b32.i2p
// @connect      totaldarkness.net
// @connect      trom.tf
// @connect      tromdienste.de
// @connect      tux.land
// @connect      tux.pizza
// @connect      tuxcloud.net
// @connect      tyil.nl
// @connect      unixfox.eu
// @connect      unofficialbird.com
// @connect      userscripts-mirror.org
// @connect      vernapl3lpo3huqdx3pjzxqgdgavxjlmdskbvejh2gfqgmjuyvxq.b32.i2p
// @connect      vernaqj2qr2pijpgvf3od6ssc3ulz3nv52gwr3hba5l6humuzmgq.b32.i2p
// @connect      vernmzgraj6aaoafmehupvtkkynpaa67rxcdj2kinwiy6konn6rq.b32.i2p
// @connect      vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion
// @connect      vern.cc
// @connect      vern.i2p
// @connect      voidnet.tech
// @connect      vojkovic.xyz
// @connect      voring.me
// @connect      walkx.org
// @connect      webheberg.info
// @connect      weblibre.org
// @connect      whatever.social
// @connect      whatevertinfoil.de
// @connect      wikiless.i2p
// @connect      wikiless.org
// @connect      winscloud.net
// @connect      xcancel.com
// @connect      yewtu.be
// @connect      yonalee.eu
// @connect      ytmous.i2p
// @connect      xanny.family
// @connect      yacy.iko.soy
// @connect      zackptg5.com
// @connect      zhaocloud.net
// @connect      zzls.i2p
// @connect      zzls.xyz
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjRtbSIgaGVpZ2h0PSI2NG1tIiB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRleHQgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgc3R5bGU9ImZvbnQtd2VpZ2h0OjQwMDtmb250LXNpemU6MTkycHg7bGluZS1oZWlnaHQ6MDt0ZXh0LWluZGVudDowO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1kZWNvcmF0aW9uLXN0eWxlOnNvbGlkO3RleHQtZGVjb3JhdGlvbi1jb2xvcjojMDAwO3dyaXRpbmctbW9kZTpsci10YjtkaXJlY3Rpb246bHRyO3RleHQtb3JpZW50YXRpb246bWl4ZWQ7ZG9taW5hbnQtYmFzZWxpbmU6YXV0bztiYXNlbGluZS1zaGlmdDpiYXNlbGluZTt0ZXh0LWFuY2hvcjpzdGFydDtzaGFwZS1wYWRkaW5nOjA7c2hhcGUtbWFyZ2luOjA7aW5saW5lLXNpemU6MDtvcGFjaXR5OjE7ZmlsbDojMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZS13aWR0aDoxLjI3OTgyO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwMDtzdG9wLW9wYWNpdHk6MSIgeD0iMTcuMDA1MjQ1IiB5PSIzMS42NTg0MDUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00LjQzNjg1NjQgNDAuODk0OTQpIHNjYWxlKC4yNjQ1OCkiPjx0c3BhbiB4PSIxNy4wMDUyNDUiIHk9IjMxLjY1ODQwNSIgc3R5bGU9ImZvbnQtc2l6ZToxOTJweCI+8J+luDwvdHNwYW4+PC90ZXh0Pjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/465936/Proxy%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/465936/Proxy%20Redirect.meta.js
// ==/UserScript==

//TODO

// Display bar at top to enable redirection for current page when all instances are not enabled.

// Add https://www.qwant.com/maps/#map=9.00/XXX/YYY

//Rebrand: Open Redirect, Proxy Redirect
//Rebrand: Freelink, LibreProxy, Libreproxy, Open Link, Proxy Direct, Proxy Link, Proxy Redirect

/*

FIXME"

Read settings from function pickURL

if (await GM.getValue('libreddit')) {
  proxyArray.push(proxy.libreddit)
}
if (await GM.getValue('teddit')) {
  proxyArray.push(proxy.teddit)
}
proxyArray = [proxy.libreddit, proxy.teddit];

urlArray = []
if (await GM.getValue('libred')) {
  urlArray.concat(proxy.libred)
}

NOTE
This program was inspired by Farside project from Ben Busby
For more information: https://farside.link

TODO

Add RDX https://rdx.overdevs.com/

Brand
FreeDirector, Free Direct, FreeDirect.js
Open Redirector, Open Redirect, Open Direct, OpenDirect.js
Redirect.js, Redirect.user.js, Redirector.js
UserDirect, UserRedirect

FIXME
// @match       *://*.imgur.com/*
// @exclude     *://i.*.imgur.com/*

FIXME RegEx
// @exclude     /*.medium\.com\/*\/(c|fit|v2)\/.*$/

*/

// https://github.com/makyen
// https://github.com/greasemonkey/greasemonkey/issues/3160#issuecomment-1456758080
const gmXmlhttpRequest = typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : GM.xmlHttpRequest;

var gmGetValue,
    gmNotification,
    gmRegisterMenuCommand,
    gmSetValue;

// Check availability of Greasemonkey API

if (typeof GM !== "undefined" && typeof GM.registerMenuCommand === "function") {
  gmRegisterMenuCommand = true;
} else {
  gmRegisterMenuCommand = false;
  console.warn("Greasemonkey API GM.registerMenuCommand does not seem to be available.");
}

if (typeof GM !== "undefined" && typeof GM.notification === "function") {
  gmNotification = true;
} else {
  gmNotification = false;
  console.warn("Greasemonkey API GM.notification does not seem to be available.");
}

if (typeof GM !== "undefined" && typeof GM.getValue === "function") {
  gmGetValue = true;
} else {
  gmGetValue = false;
  console.warn("Greasemonkey API GM.getValue does not seem to be available.");
}

if (typeof GM !== "undefined" && typeof GM.setValue === "function") {
  gmSetValue = true;
} else {
  gmSetValue = false;
  console.warn("Greasemonkey API GM.setValue does not seem to be available.");
}

//const url = location.href;

const urlsMatchers = {
    'exclude' : [
        {
            'addr' : 'gist.github.com',
            'host' : 'gist.github.com',
            'path' : [],
            'text' : ['View on GitHub'],
        },
        {
            'addr' : 'github.com',
            'host' : 'github.com',
            // not-href -> perhaps starts with, ends with and inclusive
            'path' : [
                'actions', 'archive', 'blame', 'blob', 'codespaces', 'collections',
                'commit', 'compare', 'contribute', 'customer-stories', 'delete',
                'discussions', 'edit', 'enterprise', 'events', 'features', 'files',
                'graphs', 'issues', 'labels', 'login', 'marketplace', 'milestones',
                'notifications', 'orgs', 'password_reset', 'pricing', 'projects', 'pull', 'pulse',
                'releases', 'security', 'sessions', 'settings', 'signup', 'solutions',
                'sponsors', 'tags', 'team/', 'topics', 'tree', 'trending', 'wiki'
            ],
            'text' : ['View on GitHub'],
        },
        {
            'addr' : 'gitlab.com',
            'host' : 'gitlab.com',
            'path' : [
                'activity', 'artifacts', 'boards', 'cadences', 'compare', 'commits', 'jobs',
                'labels', 'merge_requests', 'network', 'path_locks', 'pipeline_schedules',
                'pipelines', 'project_members', 'requirements_management', 'sign_in',
                'starrers', 'subgroups', 'successful_verification', 'tags', 'test_cases',
                'tree', 'uploads', 'wikis'
            ],
        },
        {
            'addr' : 'imdb.com',
            'host' : 'imdb.com',
            'path' : ['reviews'],
        },
        {
            'addr' : 'medium.com',
            'host' : 'medium.com',
            'path' : ['feed/', 'c/', 'fit/', 'format:', 'resize:fit:', 'v2/'],
        },
        {
            'addr' : 'safereddit.com',
            'host' : 'safereddit.com',
            'path' : [''],
        },
        {
            'addr' : 'stackoverflow.com/questions/',
            'host' : 'stackoverflow.com',
            'path' : ['tagged', 'users'], // /questions/tagged
        },
        {
            'addr' : 'tiktok.com',
            'host' : 'tiktok.com',
            'path' : ['discover', 'playlist'],
        },
        {
            'addr' : 'www.torrentdownload.info',
            'host' : 'torrentdownload.info',
            'path' : ['feed_latest', 'search?q='],
        },
        {
            'addr' : 'torrentz.eu',
            'host' : 'torrentz.eu',
            'path' : ['search?f='],
        },
        {
            'addr' : 'torrentz.me',
            'host' : 'torrentz.me',
            'path' : ['search?f='],
        },
        {
            'addr' : 'torrentz2.eu',
            'host' : 'torrentz2.eu',
            'path' : ['search?f='],
        },
        {
            'addr' : 'torrentz2.is',
            'host' : 'torrentz2.is',
            'path' : ['search?f='],
        },
//        {
//            'addr' : 'youtube.com',
//            'host' : 'youtube.com',
//            'path' : ['users'],
//            'text' : ['Watch on YouTube'],
//        }
    ], // hosts, paths and texts to exclude

    'includeByHostname' : [
        {
            'addr' : 'bandcamp.com',
            'host' : 'bandcamp.com',
        },
        {
            'addr' : 'bilibili.com',
            'host' : 'bilibili.com',
        },
        {
            'addr' : 'fandom.com',
            'host' : 'fandom.com',
        },
        {
            'addr' : 'gist.github.com',
            'host' : 'gist.github.com',
        },
        {
            'addr' : 'github.com',
            'host' : 'github.com',
        },
        {
            'addr' : 'gitlab.com',
            'host' : 'gitlab.com',
        },
        {
            'addr' : 'goodreads.com',
            'host' : 'goodreads.com',
        },
        {
            'addr' : 'imdb.com',
            'host' : 'imdb.com',
        },
        {
            'addr' : 'imgur.com',
            'host' : 'imgur.com',
        },
        {
            'addr' : 'instructables.com',
            'host' : 'instructables.com',
        },
        {
            'addr' : 'instagram.com',
            'host' : 'instagram.com',
        },
        {
            'addr' : 'invidious-invidious.invidious.svc.cluster.local:3000',
            'host' : 'invidious-invidious.invidious.svc.cluster.local:3000',
        },
        {
            'addr' : 'medium.com',
            'host' : 'medium.com',
        },
        {
            'addr' : 'moovitapp.com',
            'host' : 'moovitapp.com',
        },
        {
            'addr' : 'odysee.com',
            'host' : 'odysee.com',
        },
        {
            'addr' : 'reddit.com',
            'host' : 'reddit.com',
        },
        {
            'addr' : 'old.reddit.com',
            'host' : 'old.reddit.com',
        },
        {
            'addr' : 'quora.com',
            'host' : 'quora.com',
        },
        {
            'addr' : 'reuters.com',
            'host' : 'reuters.com',
        },
        {
            'addr' : 'tiktok.com',
            'host' : 'tiktok.com',
        },
        {
            'addr' : 'www.torrentdownload.info',
            'host' : 'torrentdownload.info',
        },
        {
            'addr' : 'torrentz.eu',
            'host' : 'torrentz.eu',
        },
        {
            'addr' : 'torrentz.me',
            'host' : 'torrentz.me',
        },
        {
            'addr' : 'torrentz2.eu',
            'host' : 'torrentz2.eu',
        },
        {
            'addr' : 'torrentz2.is',
            'host' : 'torrentz2.is',
        },
        {
            'addr' : 'twitter.com',
            'host' : 'twitter.com',
        },
        {
            'addr' : 'urbandictionary.com',
            'host' : 'urbandictionary.com',
        },
        {
            'addr' : 'userscripts.org',
            'host' : 'userscripts.org',
        },
        {
            'addr' : 'wikimap.toolforge.org',
            'host' : 'wikimap.toolforge.org',
        },
        {
            'addr' : 'search.yahoo.co.jp',
            'host' : 'yahoo.co.jp',
        },
        {
            'addr' : 'youtu.be',
            'host' : 'youtu.be',
        },
        {
            'addr' : 'youtube.com',
            'host' : 'youtube.com',
        },
        {
            'addr' : 'm.youtube.com',
            'host' : 'm.youtube.com',
        },
        {
            'addr' : 'x.com',
            'host' : 'x.com',
        }
    ], // hosts to include

    'includeBySLD' : [
        {
            'addr' : 'bandcamp.com',
            'host' : 'bandcamp.com',
        },
        {
            'addr' : 'medium.com',
            'host' : 'medium.com',
        },
        {
            'addr' : 'reddit.com', // old.reddit.com
            'host' : 'reddit',
        },
        {
            'addr' : 'tumblr.com',
            'host' : 'tumblr',
        },
        {
            'addr' : 'wikipedia.org',
            'host' : 'wikipedia',
        },
        {
            'addr' : 'x.com',
            'host' : 'x.com',
        }
    ], // hosts to include by second-level-domain

    'includeByPathnameAndSLD' : [
        {
            'addr' : 'google.com',
            'host' : 'google',
            'path' : ['search'],
        }
    ], // hosts to include by pathname and second-level-domain

    'includeByPathname' : [
        {
            'addr' : 'bt4g.org/magnet/',
            'host' : 'bt4g.org',
            'path' : ['magnet'],
        },
        {
            'addr' : 'bt4gprx.com/magnet/',
            'host' : 'bt4gprx.com',
            'path' : ['magnet'],
        },
        {
            'addr' : 'bing.com/(maps|search)',
            'host' : 'bing.com',
            'path' : ['maps', 'search'],
        },
        {
            'addr' : 'fandom.com/wiki',
            'host' : 'fandom.com',
            'path' : ['wiki'],
        },
        {
            'addr' : 'google.com/maps',
            'host' : 'google.com',
            'path' : ['maps'],
        },
//      {
//          'addr' : 'google.com/sorry',
//          'host' : 'google.com',
//          'path' : ['sorry'],
//      },
        {
            'addr' : 'stackoverflow.com/questions/',
            'host' : 'stackoverflow.com',
            'path' : ['questions'],
        },
        {
            'addr' : 'yahoo.com/search',
            'host' : 'yahoo.com',
            'path' : ['search'],
        },
        {
            'addr' : '(www|ul).waze.com/(live-map|ul)',
            'host' : 'waze.com',
            'path' : ['live-map', 'ul'],
        },
        {
            'addr' : 'yandex.com/(maps|search)',
            'host' : 'yandex.com',
            'path' : ['maps', 'search'],
        },
//        { // THIS PART OF CODE BELONGS TO FJYT
//            'addr' : 'youtube-nocookie.com',
//            'host' : 'youtube-nocookie.com',
//            'path' : ['@', 'channel', 'watch'],
//        },
//        { // THIS PART OF CODE BELONGS TO FJYT
//            'addr' : 'youtube.com',
//            'host' : 'youtube.com',
//            'path' : ['@', 'channel', 'watch'],
//        }
    ], // hosts to include by pathname

};

const proxy = {
    "4get": {
        "clearnet": [
            "https://4g.dc09.ru",
            "https://4get.ca",
            "https://4get.hbubli.cc",
            "https://4get.nadeko.net",
            "https://4get.plunked.party",
            "https://4get.sijh.net",
            "https://4get.silly.computer",
            "https://4get.zzls.xyz",
            "https://search.mint.lgbt",
        ],
        "i2p": [],
        "loki": [],
        "tor": [
            "http://4get.zzlsghu6mvvwyy75mvga6gaf4znbp3erk5xwfzedb4gg6qqh2j6rlvid.onion",
            "http://4getus.zzls2vhse6jeahgdz5snle37dnngmbeh4jgug5xvsdpmlchaw3ieonid.onion",
            "http://4get.zzlsghu6mvvwyy75mvga6gaf4znbp3erk5xwfzedb4gg6qqh2j6rlvid.onion",
            "http://d6imk74yn4crbqnni3kwioogwpqrfi4kay6ci7nghl363ogy4atctiid.onion",
            "http://4getwebfrq5zr4sxugk6htxvawqehxtdgjrbcn2oslllcol2vepa23yd.onion"
        ],
        "yggdrasil": []
    },
    "anonymousoverflow": {
        "clearnet": [
            "https://anonymousoverflow.privacyredirect.com",
            "https://anonymousoverflow.vern.cc",
            "https://ao.bloat.cat",
            "https://ao.ngn.tf",
            "https://ao.owo.si",
            "https://ao.phreedom.club",
//          "https://ao.rootdo.com",  // CURRENTLY OFFLINE - WILL BE BACK SOON - NO ETA
            "https://ao.vern.cc",
            "https://code.whatever.social",
            "https://overflow.adminforge.de",
            "https://overflow.ducks.party",
            "https://overflow.hostux.net",
            "https://overflow.lunar.icu",
            "https://overflow.perennialte.ch",
            "https://overflow.projectsegfau.lt",
            "https://overflow.reallyaweso.me",
            "https://stackoverflow.vern.cc",
        ],
        "i2p": [
            "http://vernmzgraj6aaoafmehupvtkkynpaa67rxcdj2kinwiy6konn6rq.b32.i2p"
        ],
        "loki": [],
        "tor": [
            "http://anonymousoverflow.esmail5pdn24shtvieloeedh7ehz3nrwcdivnfhfcedl7gf4kwddhkqd.onion",
            "http://ao.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion"
        ],
        "yggdrasil": [
            "http://[301:f69c:2017:b6b8::8]"
        ]
    },
    "bibliogram": {
        "clearnet": [],
        "i2p": [],
        "loki": [],
        "tor": [
            "http://qsuiaf4jio2yaxdbj6ljte3jmr6m7g333rujoilbtipjeawnou26frad.onion",
            "http://rlp5gt4d7dtkok3yaogocbcvrs2tdligjrxipsamztjq4wwpxzjeuxqd.onion"
        ],
        "yggdrasil": []
    },
    "biblioreads": {
        "clearnet": [
            "https://biblioreads.eu.org",
            "https://biblioreads.ducks.party",
            "https://biblioreads.lunar.icu",
            "https://biblioreads.netlify.app",
            "https://bl.vern.cc",
            "https://biblioreads.privacyredirect.com"
        ],
        "i2p": [
            "http://vernapl3lpo3huqdx3pjzxqgdgavxjlmdskbvejh2gfqgmjuyvxq.b32.i2p"
        ],
        "loki": [],
        "tor": [
            "http://biblioreads.esmail5pdn24shtvieloeedh7ehz3nrwcdivnfhfcedl7gf4kwddhkqd.onion",
            "http://bl.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion"
        ],
        "yggdrasil": []
    },
    "binternet": {
        "clearnet": [
            "https://binternet.ducks.party",
            "https://bn.bloat.cat",
            "https://bn.opnxng.com",
        ],
        "i2p": [
            "http://revznkqdwy7nmlzql66x226g3qnapiooss3rg2uajbj4rypxjnba.b32.i2p",
            "http://5cv2aw6jhe6la444vpn3jvo46442ls3ccgp3difx5ddlv5yf4hlq.b32.i2p"
        ],
        "loki": [],
        "tor": [
            "http://binternet.revvybrr6pvbx4n3j4475h4ghw4elqr4t5xo2vtd3gfpu2nrsnhh57id.onion",
            "http://binternet.skunky7dhv7nohsoalpwe3sxfz3fbkad7r3wk632riye25vqm3meqead.onion"
        ],
        "yggdrasil": []
    },
    "breezewiki": {
        "clearnet": [
            "https://antifandom.com",
            "https://bw.artemislena.eu",
            "https://breezewiki.pussthecat.org",
            "https://bw.projectsegfau.lt",
            "https://breeze.hostux.net",
            "https://breeze.nohost.network",
            "https://breezewiki.hyperreal.coffee",
            "https://breezewiki.nadeko.net",
            "https://bw.hamstro.dev",
            "https://fan.blitzw.in",
            "https://fandom.reallyaweso.me",
            "https://breezewiki.catsarch.com",
            "https://breeze.mint.lgbt",
            "https://z.opnxng.com"
        ],
        "i2p": [
            "http://bw.vern.i2p"
        ],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "btdigg": {
        "clearnet": [
            "https://btdig.com"
        ],
        "i2p": [
            "http://btdig.i2p"
        ],
        "loki": [],
        "tor": [
            "http://btdigggink2pdqzqrik3blmqemsbntpzwxottujilcdjfz56jumzfsyd.onion"
        ],
        "yggdrasil": []
    },
    "cloudtube": {
        "clearnet": [
            "https://tube.cadence.moe",
            "https://tube.mint.lgbt",
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "destructables": {
        "clearnet": [
            "https://ds.vern.cc"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "dumb": {
        "clearnet": [
            "https://dumb.privacydev.net",
            "https://dumb.ducks.party",
            "https://dm.vern.cc",
            "https://dumb.reallyaweso.me",
            "https://dumb.lunar.icu",
        ],
        "i2p": [
            "http://vernxpcpqi2y4uhu7to4rnjmyjjgzh3x3qxyzpmkhykefchkmleq.b32.i2p"
        ],
        "loki": [],
        "tor": [
            "http://dumb.g4c3eya4clenolymqbpgwz3q3tawoxw56yhzk4vugqrl6dtu3ejvhjid.onion",
            "http://dm.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion",
            "http://dm.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion"
        ],
        "yggdrasil": []
    },
    "facilmap": {
        "clearnet": [
            "https://facilmap.org"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "gothub": {
        "clearnet": [
            "https://gothub.lunar.icu",
            "https://gothub.dev.projectsegfau.lt",
            "https://gothub.ducks.party",
            "https://gh.phreedom.club",
            "https://gothub.projectsegfau.lt",
            "https://gh.owo.si",
            "https://gothub.r4fo.com",
            "https://g.opnxng.com",
            "https://gothub.private.coffee",
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    //"imgin": {
    //    "clearnet": [],
    //    "i2p": [],
    //    "loki": [],
    //    "tor": [],
    //    "yggdrasil": []
    //},
    "indestructables": {
        "clearnet": [
            "https://indestructables.private.coffee"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "alltube": {
        "clearnet": [
            "https://alltube.private.coffee"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "invidious": {
        "clearnet": [
            "https://inv.perditum.com",
            "https://inv.nadeko.net",
            "https://inv1.nadeko.net",
            "https://inv2.nadeko.net",
            "https://inv3.nadeko.net",
            "https://inv4.nadeko.net",
            "https://inv5.nadeko.net",
            "https://incogtube.com",
            "https://vid.puffyan.us",
            "https://yt.artemislena.eu",
            "https://iteroni.com",
            "https://yewtu.be",
//          "https://invidious.kavin.rocks",
            "https://invidious.reallyaweso.me",
            "https://monocles.live",
            "https://inv.riverside.rocks",
            "https://invidious.lunar.icu",
            "https://y.com.sb",
            "https://inv.bp.projectsegfau.lt",
            "https://invidious.privacyredirect.com",
            "https://invidious.flokinet.to",
            "https://invidious.sethforprivacy.com",
            "https://ytb.trom.tf",
            "https://invidious.domain.glass",
//          "https://tube.cthd.icu",
            "https://inv.vern.cc",
            "https://invidious.garudalinux.org",
            "https://youtube.owacon.moe",
            "https://invidious.tinfoil-hat.net",
            "https://iv.melmac.space",
            "https://invidious.tiekoetter.com",
            "https://invidious.baczek.me",
            "https://invidious.no-logs.com",
            "https://invidious.incogniweb.net",
            "https://invidious.0011.lt",
            "https://yt.funami.tech",
            "https://inv.tux.pizza",
            "https://vid.priv.au",
            "https://not-ytb.blocus.ch",
            "https://inv.creller.net",
            "https://inv.zzls.xyz",
            "https://yt.floss.media",
            "https://par1.iv.ggtyler.dev",
            "https://inv.citw.lgbt",
            "https://invidious.io.lol",
            "https://yt.oelrichsgarcia.de",
            "https://iv.nboeck.de",
            "https://invidious.protokolla.fi",
            "https://invidious.fi",
            "https://onion.tube",
            "https://inv.in.projectsegfau.lt",
            "https://invidious.privacydev.net",
            "https://invidious.takebackourtech.org",
            "https://qc1.iv.ggtyler.dev",
            "https://anontube.lvkaszus.pl",
            "https://invidious.asir.dev",
            "https://invidious.fdn.fr",
            "https://iv.datura.network",
            "https://invidious.private.coffee",
            "https://inv.pistasjis.net",
            "https://invidious.pavot.ca",
            "https://yt.cdaut.de",
            "https://yt.drgnz.club",
            "https://invidious.perennialte.ch",
            "https://yt.chaotic.ninja",
            "https://yt.omada.cafe",
            "https://super8.absturztau.be",
            "https://i.redsnake.io",
            "https://watch.supernets.org",
            "https://invidious.qwik.space",
            "https://invidious.nerdvpn.de",
            "https://invidious.projectsegfau.lt",
            "https://invidious.weblibre.org",
            "https://iv.ggtyler.dev",
//          "https://watch.thekitty.zone",
            "https://inv.us.projectsegfau.lt",
            "https://invidious.drgns.space",
            "https://invidious.kalli.st"
        ],
        "i2p": [
            "http://tube.i2p",
            "http://inv.cn.i2p",
            "http://jewtube.i2p",
            "http://ytmous.i2p",
            "http://pa7eextqat4wg35onzs4cnlhqa3gvzen243bcbrng67zyla4fqya.b32.i2p",
            "http://inv.vern.i2p",
            "http://inv.zzls.i2p",
            "http://invidious.qwik.i2p",
            "http://verni6dr4qxjgjumnvesxerh5rvhv6oy5ddeibaqy5d7tgbiiyfa.b32.i2p"
        ],
        "loki": [],
        "tor": [
            "http://tuberyps2pn6dor6h47brof3w2asmauahhk4ei42krugybzzzo55klad.onion",
            "http://qwikxxeiw4kgmml6vjw2bsxtviuwjce735dunai2djhu6q7qbacq73id.onion",
            "http://qwikxxt6jvggxzxe2v2fuzro5j7ibgphxmblmri6wkj5vpicdbo2kwad.onion",
            "http://inv.nadekonw7plitnjuawu6ytjsl7jlglk2t6pyq6eftptmiv3dvqndwvyd.onion",
            "http://inv1.nadekonw7plitnjuawu6ytjsl7jlglk2t6pyq6eftptmiv3dvqndwvyd.onion",
            "http://inv2.nadekonw7plitnjuawu6ytjsl7jlglk2t6pyq6eftptmiv3dvqndwvyd.onion",
            "http://inv3.nadekonw7plitnjuawu6ytjsl7jlglk2t6pyq6eftptmiv3dvqndwvyd.onion",
            "http://inv4.nadekonw7plitnjuawu6ytjsl7jlglk2t6pyq6eftptmiv3dvqndwvyd.onion",
            "http://inv5.nadekonw7plitnjuawu6ytjsl7jlglk2t6pyq6eftptmiv3dvqndwvyd.onion",
            "http://c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid.onion",
            "http://grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad.onion",
            "http://invidious.esmail5pdn24shtvieloeedh7ehz3nrwcdivnfhfcedl7gf4kwddhkqd.onion",
            "http://euxxcnhsynwmfidvhjf6uzptsmh4dipkmgdmcmxxuo7tunp3ad2jrwyd.onion",
            "http://invidious.g4c3eya4clenolymqbpgwz3q3tawoxw56yhzk4vugqrl6dtu3ejvhjid.onion",
            "http://iv.odysfvr23q5wgt7i456o5t3trw2cw5dgn56vbjfbq2m7xsc5vqbqpcyd.onion",
            "http://kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad.onion",
            "http://ng27owmagn5amdm7l5s3rsqxwscl5ynppnis5dqcasogkyxcfqn7psid.onion",
            "http://osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd.onion",
            "http://u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad.onion",
            "http://w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd.onion"
        ],
        "yggdrasil": [
            "http://[200:168a:c80a:b258:1dfe:f920:4414:6897]"
        ]
    },
    "kddit": {
        "clearnet": [
            "https://kddit.kalli.st"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "minisearch": {
        "clearnet": [
//          "https://minisearch.r4fo.com"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "laboratory": {
        "clearnet": [
            "https://lab.vern.cc",
//          "https://laboratory.vitali64.duckdns.org"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "libmedium": {
        "clearnet": [
            "https://medium.hostux.net",
            "https://libmedium.batsense.net",
            "https://med.ngn.tf",
            "https://md.vern.cc"
        ],
        "i2p": [
            "http://vernaqj2qr2pijpgvf3od6ssc3ulz3nv52gwr3hba5l6humuzmgq.b32.i2p"
        ],
        "loki": [],
        "tor": [
            "http://md.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion"
        ],
        "yggdrasil": []
    },
    "librarian": {
        "clearnet": [
            "https://librarian.pussthecat.org",
            "https://odysee.076.ne.jp",
            "https://lbry.projectsegfau.lt",
            "https://lbry.mywire.org",
            "https://lbry.vern.cc",
            "https://lbry.ooguy.com",
            "https://lbn.frail.duckdns.org",
            "https://odysee.owacon.moe",
            "https://lbry.bcow.xyz"
        ],
        "i2p": [],
        "loki": [],
        "tor": [
            "http://librarian.esmail5pdn24shtvieloeedh7ehz3nrwcdivnfhfcedl7gf4kwddhkqd.onion",
            "http://lbry.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion",
            "http://5znbzx2xcymhddzekfjib3isgqq4ilcyxa2bsq6vqmnvbtgu4f776lqd.onion",
            "http://bxewpsswttslepw27w2hhxhlizwm7l7y54x3jw5cfrb64hb6lgc557ad.onion"
        ],
        "yggdrasil": []
    },
    "libreddit": {
        "clearnet": [
            "https://libreddit.spike.codes",
            "https://libreddit.nl",
            "https://libreddit.strongthany.cc",
            "https://libreddit.40two.app",
            "https://libreddit.albony.xyz",
            "https://libreddit.privacydev.net",
            "https://libreddit.kavin.rocks",
            "https://libreddit.privacy.com.de",
//          "https://libreddit.no-logs.com",
            "https://lr.creller.net",
            "https://libreddit.dcs0.hu",
            "https://libreddit.tux.pizza",
            "https://snoo.habedieeh.re",
            "https://lr.4201337.xyz",
            "https://lr.artemislena.eu",
            "https://libreddit.qwik.space",
            "https://de.leddit.xyz",
            "https://leddit.xyz",
            "https://libreddit.autarkic.org",
            "https://libreddit.crewz.me",
            "https://libreddit.de",
            "https://libreddit.dothq.co",
            "https://libreddit.drivet.xyz",
//          "https://libreddit.igna.rocks",
            "https://libredd.it",
            "https://libreddit.jamiethalacker.dev",
            "https://libreddit.kylrth.com",
            "https://libreddit.lunar.icu",
//          "https://libreddit.northboot.xyz",
            "https://libreddit.pussthecat.org",
            "https://libreddit.silkky.cloud",
            "https://libreddit.sugoma.tk",
            "https://libreddit.winscloud.net",
            "https://libreddit.yonalee.eu",
            "https://lr.cowfee.moe",
//          "https://lr.mint.lgbt",
            "https://lr.oversold.host",
            "https://lr.stilic.ml",
            "https://r.nf",
            "https://r.walkx.org",
            "https://reddit.artemislena.eu",
            "https://reddit.phii.me",
            "https://reddit.rtrace.io",
            "https://reddit.stuehieyr.com",
            "https://libreddit.nohost.network",
            "https://reddit.simo.sh"
        ],
        "i2p": [
            "http://woo5ugmoomzbtaq6z46q4wgei5mqmc6jkafqfi5c37zni7xc4ymq.b32.i2p"
        ],
        "loki": [],
        "tor": [
            "http://spjmllawtheisznfs7uryhxumin26ssv2draj7oope3ok3wuhy43eoyd.onion",
            "http://qwikxxeiw4kgmml6vjw2bsxtviuwjce735dunai2djhu6q7qbacq73id.onion",
            "http://qwikxx4xqvhdyyazkrw7pwdpdppfnmn7j2n6cvq5zecm4atbppaslzad.onion",
            "http://ecue64ybzvn6vjzl37kcsnwt4ycmbsyf74nbttyg7rkc3t3qwnj7mcyd.onion",
            "http://fwhhsbrbltmrct5hshrnqlqygqvcgmnek3cnka55zj4y7nuus5muwyyd.onion",
            "http://inytumdgnri7xsqtvpntjevaelxtgbjqkuqhtf6txxhwbll2fwqtakqd.onion",
            "http://kphht2jcflojtqte4b4kyx7p2ahagv4debjj32nre67dxz7y57seqwyd.onion",
            "http://kzhfp3nvb4qp575vy23ccbrgfocezjtl5dx66uthgrhu7nscu6rcwjyd.onion",
            "http://lbrdtjaj7567ptdd4rv74lv27qhxfkraabnyphgcvptl64ijx2tijwid.onion",
            "http://libreddit.2syis2nnyytz6jnusnjurva4swlaizlnleiks5mjp46phuwjbdjqwgqd.onion",
            "http://ledditqo2mxfvlgobxnlhrkq4dh34jss6evfkdkb2thlvy6dn4f4gpyd.onion",
            "http://libreddit.lqs5fjmajyp7rvp4qvyubwofzi6d4imua7vs237rkc4m5qogitqwrgyd.onion",
            "http://libredoxhxwnmsb6dvzzd35hmgzmawsq5i764es7witwhddvpc2razid.onion",
            "http://ol5begilptoou34emq2sshf3may3hlblvipdjtybbovpb7c7zodxmtqd.onion",
            "http://liredejj74h5xjqr2dylnl5howb2bpikfowqoveub55ru27x43357iid.onion"
        ],
        "yggdrasil": []
    },
    "libremdb": {
        "clearnet": [
            "https://libremdb.iket.me",
            "https://lmdb.ngn.tf",
            "https://ld.vern.cc",
            "https://binge.whatever.social",
            "https://libremdb.ducks.party",
            "https://libremdb.lunar.icu",
            "https://libremdbeu.herokuapp.com",
            "https://libremdb.pussthecat.org",
            "https://libremdb.jeikobu.net",
            "https://lmdb.hostux.net",
            "https://libremdb.catsarch.com",
//          "https://libremdb.fascinated.cc"
        ],
        "i2p": [
            "http://vernz3ubrntql4wrgyrssd6u3qzi36zrhz2agbo6vibzbs5olk2q.b32.i2p"
        ],
        "loki": [],
        "tor": [
            "http://ld.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion",
            "http://libremdb.esmail5pdn24shtvieloeedh7ehz3nrwcdivnfhfcedl7gf4kwddhkqd.onion"
        ],
        "yggdrasil": []
    },
    "librex": {
        "clearnet": [
            "https://search.pabloferreiro.es",
            "https://search.funami.tech",
            "https://librex.retro-hax.net",
            "https://librex.zzls.xyz",
            "https://librex.nohost.network",
            "https://librex.baczek.me",
            "https://buscar.weblibre.org",
            "https://librex.mikata.ru",
            "https://librex.myroware.eu",
            "https://librex.pufe.org",
            "https://librex.revvy.de",
            "https://lx.vern.cc",
            "https://search.femboy.hu",
            "https://search.madreyk.xyz",
            "https://search.milivojevic.in.rs",
            "https://search.sesu.cc",
            "https://search.tildevarsh.in",
            "https://librex.ratakor.com",
            "https://lx.drain.win"
        ],
        "i2p": [
            "http://libremdb.catsarch.i2p",
            "http://7huurwog32tny663wkglrhozfoyqyqmsuxjbd7dtudccx44awjda.b32.i2p",
            "http://lqbchqljxiwl3bbjt4vqe76luovk5ly6khqhg7mt5qcqfn6e4sbq.b32.i2p",
            "http://revekebotog64xrrammtsmjwtwlg3vqyzwdurzt2pu6botg4bejq.b32.i2p",
            "http://vernziqfqvweijfaacmwazohgpdo2bt2ib2jlupt2pwwu27bhgxq.b32.i2p"
        ],
        "loki": [],
        "tor": [
            "http://fcnfg6avz45hqzwbneekq57u2mqbnwa7veyvjcc4dndqbatvkjlaj7yd.onion",
            "http://f7ssz7l3biu4fugwctfpcx4txg5yq4gqhrt473ledsuc3ivtd3omniid.onion",
            "http://librex.revvybrr6pvbx4n3j4475h4ghw4elqr4t5xo2vtd3gfpu2nrsnhh57id.onion",
            "http://librex.zzlsghu6mvvwyy75mvga6gaf4znbp3erk5xwfzedb4gg6qqh2j6rlvid.onion",
            "http://lx.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion",
            "http://search.cepyxplublbyw2f4axy4pyztfbxmf63lrt2c7uwv6wl4iixz53czload.onion",
            "http://search.swxoebbpeqiiixyhbuh3vbw53pdrmtbiaj2sqveol6kkn5rpapfi4aad.onion"
        ],
        "yggdrasil": []
    },
    "librey": {
        "clearnet": [
            "https://search.pabloferreiro.es",
            "https://search.funami.tech",
            "https://librex.retro-hax.net",
            "https://search.davidovski.xyz",
            "https://search.zeroish.xyz",
            "https://search.seitan-ayoub.lol",
            "https://lx.benike.me",
            "https://librey.baczek.me",
            "https://librex.yogeshlamichhane.com.np",
            "https://librex.nohost.network",
            "https://librex.ix.tc",
            "https://librex.uk.to",
            "https://librex.supernets.org",
            "https://librey.org",
            "https://librey.danyaal.xyz",
            "https://ly.owo.si",
            "https://search.ratakor.com",
            "https://ahwx.org",
        ],
        "i2p": [
            "http://d4vi3tvfui2rfzsxr33tin4a6542heulf4mhkokdpbhbcejlg3la.b32.i2p",
            "http://libreyqmoa2iuihoyyscolhaymrxxgdrmkgmiufnyaukwub2c7ya.b32.i2p"
        ],
        "loki": [],
        "tor": [
            "http://ly.pk47sgwhncn5cgidm7bofngmh7lc7ukjdpk5bjwfemmyp27ovl25ikyd.onion",
            "http://libreytvcxak42f3p7nxh3filsp2pjqesjii5f5e4eivs2gpcn77tdid.onion",
            "http://hyy7rcvknwb22v4nnoar635wntiwr4uwzhiuyimemyl4fz6k7tahj5id.onion",
            "http://wn5jl6fxlzzfenlyu3lc4q7jpw2saplrywxvxtvqbguotwd4y5cjeuqd.onion",
            "http://jxhkfulu6wpdl4apuy4dyivuowmpprvsd7e3el2z73crq7fmyv7rjkyd.onion",
            "http://ouosr2fq3lktngcvbz4r4op2lab5hbiz5y6g6toorsgieb7elet76jad.onion"
        ],
        "yggdrasil": []
    },
    "lieu": {
        "clearnet": [
            "https://lieu.cblgh.org"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "lingva": {
        "clearnet": [
            "https://lingva.reallyaweso.me",
            "https://translate.libtar.de",
            "https://lingva.retiolus.net",
            "https://translate.plausibility.cloud",
            "https://lingva.lunar.icu",
            "https://lingva.dialectapp.org"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "materialious": {
        "clearnet": [
            "https://materialious.nadeko.net"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "metastem": {
        "clearnet": [
            "https://go.metastem.su"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "metastemwiki": {
        "clearnet": [
            "https://wiki.metastem.su"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "mikuinvidious": {
        "clearnet": [
            "https://mi.resrv.org",
            "https://mikuinv-gs.vern.cc",
            "https://mikuinv.resrv.org",
            "https://moeyy.cn/mikuinvidious"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "mozhi": {
        "clearnet": [
            "https://mozhi.pussthecat.org",
            "https://mzh.dc09.ru",
            "https://translate.bus-hit.me",
            "https://translate.perennialte.ch"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "neuters": {
        "clearnet": [
            "https://neuters.de",
            "https://neuters.vern.cc",
            "https://nu.vern.cc",
            "https://reuters.vern.cc",
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "nitter": {
        "clearnet": [
            "https://nitter.hu",
            "https://nitter.actionsack.com",
            "https://nitter.net",
            "https://nitter.1d4.us",
            "https://nitter.nixnet.services",
            "https://nitter.unixfox.eu",
            "https://nitter.sethforprivacy.com",
            "https://nitter.pussthecat.org",
            "https://xcancel.com",
            "https://nitter.it",
            "https://nitter.moomoo.me",
            "https://tw.artemislena.eu",
            "https://nitter.snopyta.org",
            "https://birdsite.xanny.family",
            "https://nitter.domain.glass",
//          "https://read.whatever.social",
//          "https://nitter.lacontrevoie.fr",
            "https://bird.trom.tf",
            "https://nitter.hostux.net",
            "https://nitter.sneed.network",
            "https://twitter.owacon.moe",
            "https://nitter.ggc-project.de",
            "https://unofficialbird.com",
            "https://nitter.fdn.fr",
            "https://nitter.no-logs.com",
            "https://nitter.one",
            "https://nitter.ungovernable.men",
            "https://nitter.private.coffee",
//          "https://nitter.soopy.moe",
            "https://nitter.oksocial.net",
            "https://n.sneed.network",
            "https://nitter.qwik.space",
            "https://nitter.nohost.network",
            "https://de.nttr.stream",
            "https://nitter.42l.fr",
            "https://nitter.bus-hit.me",
//          "https://nitter.ca",
//          "https://nitter.eu",
            "https://nitter.grimneko.de",
            "https://nitter.kavin.rocks",
            "https://nitter.koyu.space",
            "https://nttr.stream",
            "https://twitter.076.ne.jp",
            "https://twitter.censors.us",
            "https://n.hyperborea.cloud",
            "https://n.biendeo.com",
//          "https://n.opnxng.com",
            "https://nitter.adminforge.de",
            "https://nitter.catsarch.com",
            "https://nitter.cz",
            "https://nitter.in.projectsegfau.lt",
            "https://nitter.io.lol",
            "https://nitter.ktachibana.party",
            "https://nitter.kylrth.com",
            "https://nitter.poast.org",
            "https://nitter.privacydev.net",
            "https://nitter.salastil.com",
            "https://nitter.woodland.cafe",
            "https://nitter.dcs0.hu"
        ],
        "i2p": [
            "http://tm4rwkeysv3zz3q5yacyr4rlmca2c4etkdobfvuqzt6vsfsu4weq.b32.i2p"
        ],
        "loki": [],
        "tor": [
            "http://qwikxxeiw4kgmml6vjw2bsxtviuwjce735dunai2djhu6q7qbacq73id.onion",
            "http://qwikxx2erhx6qrymued6ox2qkf2yeogjwypqvzoif4fqkljixasr6oid.onion",
            "http://n.sneed4fmhevap3ci4xhf4wgkf72lwk275lcgomnfgwniwmqvaxyluuid.onion"
        ],
        "yggdrasil": []
    },
    "openstreetmap": {
        "clearnet": [
            "https://www.openstreetmap.org"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "tubo": {
        "clearnet": [
            "https://tubo.media",
            "https://tubo.reallyaweso.me"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "twineo": {
        "clearnet": [
            "https://twineo.reallyaweso.me"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "pipedmaterial": {
        "clearnet": [
            "https://piped-material.xn--17b.net"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "piped": {
        "clearnet": [
            "https://pv.dc09.ru",
            "https://piped.kavin.rocks",
            "https://piped.mint.lgbt",
            "https://piped.video",
            "https://watch.whatevertinfoil.de",
            "https://piped.ducks.party",
            "https://watch.whatever.social",
            "https://piped.reallyaweso.me",
            "https://piped.hostux.net",
            "https://piped.no-logs.com",
            "https://piped.qdi.fi",
            "https://piped.ngn.tf",
            "https://il.ax",
            "https://piped.projectsegfau.lt",
            "https://pd.vern.cc",
            "https://piped.privacydev.net",
            "https://piped.chauvet.pro",
            "https://piped.smnz.de",
            "https://piped.adminforge.de",
            "https://srv.piped.video",
            "https://piped.lunar.icu",
            "https://piped.garudalinux.org",
            "https://piped.in.projectsegfau.lt",
            "https://piped.mha.fi",
            "https://piped.privacy.com.de",
            "https://piped.us.projectsegfau.lt",
            "https://watch.leptons.xyz",
            "https://piped.palveluntarjoaja.eu"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "priviblur": {
        "clearnet": [
            "https://tb.opnxng.com",
//          "https://pb.bloat.cat"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "pixivfe": {
        "clearnet": [
            "https://pixiv.ducks.party",
            "https://pixiv.perennialte.ch",
            "https://pixivfe.ducks.party",
            "https://pixivfe.exozy.me"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "poketube": {
        "clearnet": [
            "https://poketube.fun",
//          "https://pt.zzls.xyz"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "proxigram": {
        "clearnet": [
            "https://ig.opnxng.com",
            "https://proxigram.lunar.icu",
            "https://proxigram.ducks.party",
//          "https://ig.vern.cc/",
//          "https://proxigram.vern.cc",
//          "https://instagram.vern.cc",
//          "https://proxigram.privacyredirect.com",
//          "https://proxigram.kyun.li"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "proxitok": {
        "clearnet": [
            "https://proxitok.lunar.icu",
            "https://tik.hostux.net",
            "https://proxitok.pabloferreiro.es",
            "https://proxitok.privacy.com.de",
            "https://tok.adminforge.de",
            "https://tok.habedieeh.re",
            "https://proxitok.pussthecat.org",
            "https://cringe.whatever.social",
            "https://proxitok.privacydev.net",
            "https://proxitok.pufe.org",
            "https://cringe.datura.network",
            "https://tok.artemislena.eu",
//          "https://tok.thekitty.zone",
            "https://proxitok.privacyredirect.com",
            "https://tiktok.chauvet.pro",
//          "https://proxitok.r4fo.com",
            "https://tt.vern.cc",
            "https://tiktok.vern.cc",
            "https://proxitok.vern.cc"
        ],
        "i2p": [
            "http://qr.vern.i2p"
        ],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "quetre": {
        "clearnet": [
            "https://quetre.privacydev.net",
            "https://quetre.pufe.org",
            "https://que.wilbvr.me",
            "https://quetre.iket.me",
            "https://quetre.pussthecat.org",
            "https://quetre.ducks.party",
            "https://quetre.perennialte.ch",
            "https://quetre.projectsegfau.lt",
            "https://quetre.marcopisco.com",
            "https://quetre.blackdrgn.nl",
            "https://quetre.lunar.icu",
            "https://quora.femboy.hu",
            "https://quora.vern.cc",
//          "https://quetre.fascinated.cc",
            "https://quetre.rootdo.com"
        ],
        "i2p": [],
        "loki": [],
        "tor": [
            "http://ask.habeehrhadazsw3izbrbilqajalfyqqln54mrja3iwpqxgcuxnus7eid.onion",
            "http://qr.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion",
            "http://quetre.esmail5pdn24shtvieloeedh7ehz3nrwcdivnfhfcedl7gf4kwddhkqd.onion",
            "http://quetre.g4c3eya4clenolymqbpgwz3q3tawoxw56yhzk4vugqrl6dtu3ejvhjid.onion",
            "http://quora.cepyxplublbyw2f4axy4pyztfbxmf63lrt2c7uwv6wl4iixz53czload.onion"
        ],
        "yggdrasil": []
    },
    "redlib": {
        "clearnet": [
            "https://redlib.privadency.com",
            "https://redlib.tiekoetter.com",
            "https://redlib.nadeko.net",
            "https://redlib.incogniweb.net",
            "https://discuss.whatever.social",
            "https://libreddit.bus-hit.me",
            "https://eu.safereddit.com",
            "https://l.opnxng.com",
            "https://red.arancia.click",
            "https://redlib.orangenet.cc",
            "https://red.ngn.tf",
            "https://redlib.mint.lgbt",
            "https://reddit.invak.id",
            "https://r.darrennathanael.com",
            "https://red.artemislena.eu",
            "https://reddit.owo.si",
            "https://safereddit.com",
            "https://lr.n8pjl.ca",
            "https://libreddit.projectsegfau.lt",
            "https://redlib.kittywi.re",
            "https://redlib.privacyredirect.com",
//          "https://redlib.vimmer.dev",
            "https://redlib.catsarch.com",
            "https://redlib.matthew.science",
            "https://redlib.pussthecat.org/",
            "https://redlib.tux.pizza",
            "https://reddit.idevicehacked.com",
            "https://redlib.private.coffee",
            "https://redlib.ducks.party",
            "https://redlib.reallyaweso.me",
            "https://redlib.perennialte.ch",
            "https://redlib.nohost.network",
            "https://rl.bloat.cat"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "rimgo": {
        "clearnet": [
            "https://ri.nadeko.net",
            "https://rimgo.bus-hit.me",
            "https://rimgo.pussthecat.org",
            "https://rimgo.totaldarkness.net",
            "https://rimgo.perennialte.ch",
            "https://img.riverside.rocks",
            "https://rimgo.reallyaweso.me",
            "https://i.bcow.xyz",
            "https://rimgo.hostux.net",
            "https://rimgo.privacyredirect.com",
            "https://ri.zzls.xyz",
            "https://i.habedieeh.re",
            "https://rimgo.ducks.party",
            "https://rimgo.vern.cc",
            "https://rimgo.nohost.network",
            "https://imgur.artemislena.eu",
            "https://rimgo.lunar.icu",
            "https://rimgo.kling.gg",
            "https://rimgo.projectsegfau.lt",
            "https://rimgo.catsarch.com",
//          "https://rimgo.fascinated.cc"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "ruraldictionary": {
        "clearnet": [
            "https://rd.vern.cc",
            "https://isdoingyour.mom",
        ],
        "i2p": [
            "http://vern5cxiaufqvhv4hu5ypkvw3tiwvuinae4evdbqzrioql6s2sha.b32.i2p"
        ],
        "loki": [],
        "tor": [
            "http://ruraldictionary.esmail5pdn24shtvieloeedh7ehz3nrwcdivnfhfcedl7gf4kwddhkqd.onion",
            "http://rd.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion"
        ],
        "yggdrasil": []
    },
    "safetwitch": {
        "clearnet": [
            "https://safetwitch.drgns.space",
            "https://st.ngn.tf",
            "https://safetwitch.ducks.party",
            "https://safetwitch.privacyredirect.com/"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "scribe": {
        "clearnet": [
            "https://scribe.nixnet.services",
            "https://scribe.ducks.party",
            "https://scribe.rip",
            "https://scribe.citizen4.eu",
            "https://scribe.reallyaweso.me",
            "https://scribe.privacyredirect.com",
            "https://scribe.bus-hit.me",
            "https://scribe.perennialte.ch",
            "https://sc.vern.cc",
            "https://scribe.manasiwibi.com",
            "https://m.opnxng.com"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "searx": {
        "clearnet": [
            "https://s.dc09.ru",
            "https://searx.dc09.ru",
            "https://sx.klein.ruhr",
            "https://searx.namejeff.xyz",
            "https://search.einfachzocken.eu",
            "https://searx.foss.family",
            "https://search.0ut0f.space",
            "https://searx.oakleycord.dev",
            "https://searxng.deliberate.world",
//          "https://searx.zaggy.nl",
            "https://search.reallyaweso.me",
            "https://search.incogniweb.net",
            "https://seeks.hsbp.org",
            "https://putin.agency",
            "http://search.homecomputing.fr",
            "https://seeks.okhin.fr",
            "https://searx.arancia.click",
            "https://s3arch.eu",
            "https://search.nerdvpn.de",
            "https://quackquackgo.nl",
            "https://baresearch.org",
            "https://searx.coding4schoki.org",
            "https://searx.netzspielplatz.de",
            "https://searx.perennialte.ch",
            "https://searx.laquadrature.net",
            "https://sx.thatxtreme.dev",
            "https://vibrisse.gatti.ninja",
            "https://search.smnz.de",
            "https://search.sapti.me",
            "https://twinkpad.pl",
            "https://search.demoniak.ch",
            "https://search.rhscz.eu",
            "https://search.nadeko.net",
            "https://searx.oe5tpo.com",
            "https://search.trashserver.net",
            "https://searxng.shreven.org",
            "https://vanderwilhelm.me",
            "https://nogoo.me",
            "https://xo.wtf",
//          "https://search.r4fo.com",
            "https://searx.brihx.fr",
            "https://search.kujiu.org",
            "https://searx.new-admin.net",
            "https://posativ.org/search",
            "https://searx.crazypotato.tk",
            "https://searx.32bitflo.at",
            "https://el-hoyo.net/searx",
            "https://www.privatesearch.io",
            "https://search.jpope.org",
            "https://search.casperlefantom.net",
            "https://search.freezetux.net",
            "https://framabee.org",
            "https://searx.info",
            "https://search.koehn.com",
            "https://searx.fossencdi.org",
            "https://search.jollausers.de",
            "https://blackholeroutercondition.com",
            "https://some.shady.website/search",
            "https://matrix.ac/searx",
            "https://searx.jeanphilippemorvan.info",
            "https://searx.potato.hu",
            "https://www.searx.de",
            "https://searx.me",
            "http://suche.linuxundich.de",
            "https://search.blackit.de",
            "https://suche.elaon.de",
            "https://search.homecomputing.fr",
            "https://trouvons.org",
            "https://tontonroger.org",
            "https://searx.volcanis.me",
            "https://quackquackgo.nl/search",
            "https://search.notoriousdev.com",
            "https://www.ready.pm",
            "https://searx.nulltime.net",
            "https://searx.schrodinger.io",
            "https://searx.drakonix.net",
            "https://searx.aquilenet.fr",
            "https://searx.4ray.co",
            "https://search.azkware.net",
            "https://schrodinger.io",
//          "https://heraut.eu/search",
            "https://searx.ch",
//          "https://rathorian.fr",
            "https://search.biboumail.fr",
            "https://searx.xyz",
            "https://searx.ru",
            "https://searx.dk",
            "https://suche.ftp.sh",
            "https://searx.nogafa.org",
            "https://www.gruble.de",
            "https://search.disroot.org",
            "https://searx.cc",
            "https://www.search404.io",
            "https://searx.org",
            "https://searx.site",
            "https://searx.foo.li",
            "https://searx.mxchange.org",
            "https://searx.darklun.ch",
            "https://searx.blackspot.me",
            "https://searx.decatec.de",
            "https://searx.prvcy.eu",
            "https://searx-anon.duckdns.org",
            "https://searx.sunless.cloud",
            "https://searx.fmac.xyz",
            "https://search.gougeul.org",
            "https://spot.ecloud.global",
            "https://searx.ninja",
            "https://searx.ca",
            "https://searx.bar",
            "https://searx.everdot.org",
            "https://searx.ir",
            "https://searx.be",
            "https://searx.aleteoryx.me",
            "https://searx.tunkki.xyz/searx",
            "https://searx.tuxcloud.net",
            "https://searx.underworld.fr",
            "https://xeek.com",
            "https://serx.cf",
            "https://searxng.ch",
            "https://search.st8.at",
            "https://searx.roughs.ru",
            "https://search.datura.network",
            "https://searxng.online",
            "https://search.im-in.space",
            "https://search.zdechov.net",
            "https://searx.ankha.ac",
            "https://search.ngn.tf",
            "https://searx.feneas.org",
            "https://dynabyte.ca",
            "https://search.in.projectsegfau.lt",
            "https://searx.rasp.fr",
            "https://searx.xkek.net",
            "https://engo.mint.lgbt",
            "https://timdor.noip.me/searx",
            "https://trovu.komun.org",
            "https://haku.ahmia.fi",
            "https://searx.lavatech.top",
            "https://searx.slash-dev.de",
            "https://www.webrats.xyz",
            "https://searx.tiekoetter.com",
            "https://paulgo.io",
            "https://searx.hummel-web.at",
            "https://searx.webheberg.info",
            "https://searx.tux.land",
            "https://searx.gnous.eu",
            "https://jsearch.pw",
            "https://search.antonkling.se",
            "https://searx.tk",
            "https://searx.openhoofd.nl",
            "https://searx.nixnet.services",
            "https://searx.zapashcanon.fr",
            "https://search.ethibox.fr",
            "https://searx.theanonymouse.xyz",
            "https://northboot.xyz",
            "https://swag.pw",
            "https://search.mdosch.de",
            "https://sx.fedi.tech",
            "https://s.zhaocloud.net",
            "https://searx.zackptg5.com",
            "https://searx.mha.fi",
            "https://searx.divided-by-zero.eu",
            "https://metasearch.nl",
            "https://search.snopyta.org",
            "https://searx.roflcopter.fr",
            "https://sx.catgirl.cloud",
            "https://searx.mastodontech.de",
            "https://searx.dresden.network",
            "https://darmarit.org/searx",
            "https://suche.uferwerk.org",
            "https://suche.dasnetzundich.de",
            "https://anon.sx",
            "https://nibblehole.com",
            "https://opengo.nl",
            "https://privatesearch.app",
            "https://procurx.pt",
            "https://recherche.catmargue.org",
            "https://search.076.ne.jp",
            "https://search.anonymize.com",
            "https://search.asynchronousexchange.com",
            "https://search.fedi.life",
            "https://search.stinpriza.org",
            "https://search.trom.tf",
            "https://searx.bissisoft.com",
            "https://searxzh.cn",
            "https://searx.sk",
            "https://searx.nevrlands.de",
            "https://searx.akusov.xyz",
            "https://a.searx.space",
            "https://searx.hardwired.link",
            "https://searx.stuehieyr.com",
            "https://searx.sp-codes.de",
            "https://searx.solusar.de",
            "https://searx.tyil.nl",
            "https://searx.vitanetworks.link",
            "https://searx.zecircle.xyz",
            "https://searx.semipvt.com",
            "https://searx.se",
            "https://searx.sadblog.xyz",
            "https://searx.s1gm4.eu",
            "https://searx.run",
            "https://searx.operationtulip.com",
            "https://searx.pwoss.org",
            "https://searx.gnu.style",
            "https://search.bluelock.org",
            "https://search.jigsaw-security.com",
            "https://www.searxs.eu",
            "https://www.perfectpixel.de/searx",
            "https://wtf.roflcopter.fr/searx",
            "https://searx.thegreenwebfoundation.org",
            "https://search.privacytools.io",
            "https://search.blou.xyz",
            "https://search.kling.gg",
            "https://search.activemail.de",
            "https://searx.al-f.net",
            "https://searx.hsbp.org",
            "https://search.ononoki.org",
            "https://monocles.de",
            "https://search.bka.li",
            "https://searx.puffyan.us",
            "https://searx.pussthecat.org",
            "https://search.bus-hit.me",
            "https://searx.thegpm.org",
            "https://etsi.me",
            "https://search.zzls.xyz",
            "https://opnxng.com",
            "https://searxng.tordenskjold.de",
            "https://searx.alloca.dev",
//          "https://cthd.icu",
//          "https://searx.cthd.icu",
            "https://search.neet.works",
            "https://search.rabbit-company.com",
            "https://searxng.zackptg5.com",
            "https://searx.catfluori.de",
            "https://www.higgssearch.com",
            "https://search.projectsegfau.lt",
            "https://searx.domain.glass",
            "https://recherche.facil.services",
            "https://searx.stemy.me",
            "https://searxng.no-logs.com",
            "https://search.exarius.org",
            "https://priv.au",
            "https://searx.work",
            "https://searx.fi",
            "https://searxng.pavot.ca",
            "https://searx.envs.net",
            "https://searx.simplifiedprivacy.com",
            "https://searx.absturztau.be",
            "https://search.vojkovic.xyz",
            "https://searx.ebnar.xyz",
            "https://searx.jaska.cc",
            "https://search.rootdo.com",
            "https://copp.gg",
            "https://s.mble.dk",
            "https://s.trung.fun",
            "https://search.gcomm.ch",
            "https://search.laksith.dev",
            "https://search.leptons.xyz",
            "https://search.modalogi.com",
            "https://search.rowie.at",
            "https://searx.daetalytica.io",
            "https://searx.zhenyapav.com",
            "https://apps.disroot.org",
            "https://searx.danksquad.org",
            "https://search.privacyredirect.com"
        ],
        "i2p": [
            "http://mqamk4cfykdvhw5kjez2gnvse56gmnqxn7vkvvbuor4k4j2lbbnq.b32.i2p",
            "http://ransack.i2p"
        ],
        "loki": [],
        "tor": [
            "http://eb6w5ctgodhchf3p.onion/searx",
            "http://searchb5a7tmimez.onion",
            "http://7jwxg5rakyfvikpi.onion",
            "http://ulrn6sryqaifefld.onion",
            "http://eb6w5ctgodhchf3p.onion",
            "http://tp7nwuggtryzbla7.onion/searx",
            "http://htk2rvtgj6vv3ppj.onion",
            "http://searx7hcqiogbrhk.onion",
            "http://searx.bsbvtqi5oq2cqzn32zt4cr2f2z2rwots3dq7gmdcnlyqoxko2wx6reqd.onion",
            "http://3afisqjw2rxm6z7mmstyt5rx75qfqrgxnkzftknbp2vhipr2nrmrjdyd.onion",
            "http://searxbgetrkiwxhdwi6svpgh7eotopqyxhbqiokrwzg7dcte44t36kyd.onion",
            "http://suche.xyzco456vwisukfg.onion",
            "http://w5rl6wsd7mzj4bdkbuqvzidet5osdsm5jhg2f7nvfidakfq5exda5wid.onion",
            "http://z34ambyi6makk6ta7ksog2sljly2ctt2sa3apekb7wkllk72sxecdtad.onion",
            "http://search.4bkxscubgtxwvhpe.onion",
            "http://juy4e6eicawzdrz7.onion",
            "http://z5vawdol25vrmorm4yydmohsd4u6rdoj2sylvoi3e3nqvxkvpqul7bqd.onion",
            "http://zbuc3bbzbfdqqo2x46repx2ddajbha6fpsjeeptjhhhhzji3zopxdqyd.onion",
            "http://4n53nafyi77iplnbrpmxnp3x4exbswwxigujaxy3b37fvr7bvlopxeyd.onion",
            "http://f4qfqajszpx5b7itzxt6mb7kj4ktpgbdq7lq6xaiqyqx6a7de3epptad.onion",
            "http://searx.cwuzdtzlubq5uual.onion",
            "http://searx3aolosaf3urwnhpynlhuokqsgz47si4pzz5hvb7uuzyjncl2tid.onion",
            "http://rq2w52kyrif3xpfihkgjnhqm3a5aqhoikpv72z3drpjglfzc2wr5z4yd.onion",
            "http://yra4tke2pwcnatxjkufpw6kvebu3h3ti2jca2lcdpgx3mpwol326lzid.onion"
        ],
        "yggdrasil": []
    },
    "shoelace": {
        "clearnet": [
            "https://shoelace.mint.lgbt",
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "simplytranslate": {
        "clearnet": [
            "https://trap.her.st",
            "https://manerakai.asuscomm.com:447",
            "https://simplytranslate.org",
            "https://simplytranslate.reallyaweso.me",
            "https://translate.northboot.xyz",
            "https://simplytranslate.leemoon.network",
            "https://st.privacydev.net",
            "https://tl.vern.cc",
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "libretranslate": {
        "clearnet": [
            "https://translate.reallyaweso.me"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "spot": {
        "clearnet": [
            "https://nibblespot.com/",
            "https://search.ggc-project.de"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "teddit": {
        "clearnet": [
            "https://incogsnoo.com",
            "https://i.opnxng.com",
            "https://teddit.projectsegfau.lt",
        ],
        "i2p": [
            "http://k62ptris7p72aborr4zoanee7xai6wguucveptwgxs5vbgt7qzpq.b32.i2p",
            "http://teddit.i2p"
        ],
        "loki": [],
        "tor": [
            "http://t.sneed4fmhevap3ci4xhf4wgkf72lwk275lcgomnfgwniwmqvaxyluuid.onion",
            "http://tedditfyn6idalzso5wam5qd3kdtxoljjhbrbbx34q2xkcisvshuytad.onion"
        ],
        "yggdrasil": [
            "http://[200:5e4b:515c:e42b:3e73:6fbf:2f11:779d]"
        ]
    },
    "tent": {
        "clearnet": [
            "https://tent.sny.sh",
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "translite": {
        "clearnet": [
            "https://tl.dc09.ru",
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "uso": {
        "clearnet": [
            "https://userscripts-mirror.org"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "wayback-classic": {
        "clearnet": [
            "https://wayback-classic.net",
        ],
        "i2p": [],
        "loki": [],
        "tor": [
            "http://waybackclassic.esmail5pdn24shtvieloeedh7ehz3nrwcdivnfhfcedl7gf4kwddhkqd.onion"
        ],
        "yggdrasil": []
    },
    "whoogle": {
        "clearnet": [
            "https://search.sethforprivacy.com",
            "https://wg.vern.cc",
        ],
        "i2p": [
            "http://verneks7rfjptpz5fpii7n7nrxilsidi2qxepeuuf66c3tsf4nhq.b32.i2p"
        ],
        "loki": [],
        "tor": [
            "http://nuifgsnbb2mcyza74o7illtqmuaqbwu4flam3cdmsrnudwcmkqur37qd.onion",
            "http://whoglqjdkgt2an4tdepberwqz3hk7tjo4kqgdnuj77rt7nshw2xqhqad.onion",
            "http://whoogle.g4c3eya4clenolymqbpgwz3q3tawoxw56yhzk4vugqrl6dtu3ejvhjid.onion",
            "http://whoogle.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion"
        ],
        "yggdrasil": []
    },
    "wikiless": {
        "clearnet": [
            "https://wikiless.org",
            "https://wikiless.tiekoetter.com",
            "https://wiki.adminforge.de",
            "https://wl.vern.cc",
            "https://w.sneed.network",
            "https://wiki.froth.zone",
            "https://wikiless.lunar.icu",
            "https://wikiless.northboot.xyz",
//          "https://wikiless.rootdo.com",
        ],
        "i2p": [
            "http://wikiless.i2p"
        ],
        "loki": [],
        "tor": [
            "http://dj2tbh2nqfxyfmvq33cjmhuw7nb6am7thzd3zsjvizeqf374fixbrxyd.onion",
            "http://w.sneed4fmhevap3ci4xhf4wgkf72lwk275lcgomnfgwniwmqvaxyluuid.onion"
        ],
        "yggdrasil": []
    },
    "wikiless-dark": {
        "clearnet": [
            "https://wikiless.reallyaweso.me",
            "https://wiki.owo.si",
            "https://wikiless.privacyredirect.com",
            "https://wikiless.funami.tech"
        ],
        "i2p": [
            "http://wikiless.i2p"
        ],
        "loki": [],
        "tor": [
            "http://dj2tbh2nqfxyfmvq33cjmhuw7nb6am7thzd3zsjvizeqf374fixbrxyd.onion",
            "http://w.sneed4fmhevap3ci4xhf4wgkf72lwk275lcgomnfgwniwmqvaxyluuid.onion"
        ],
        "yggdrasil": []
    },
    "everybodywiki": {
        "clearnet": [
            "https://everybodywiki.com"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "wikimore": {
        "clearnet": [
            "https://wp.dc09.ru"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "wikiwand": {
        "clearnet": [
            "https://www.wikiwand.com"
        ],
        "i2p": [],
        "loki": [],
        "tor": [],
        "yggdrasil": []
    },
    "yacy": {
        "clearnet": [],
        "i2p": [
            "http://1search.i2p"
        ],
        "loki": [],
        "tor": [
            "http://yacy.bsbvtqi5oq2cqzn32zt4cr2f2z2rwots3dq7gmdcnlyqoxko2wx6reqd.onion"
        ],
        "yggdrasil": []
    }
};

// TODO Set menu items to enable.
sessionDisableProxyRedirect = sessionStorage.getItem('disableProxyRedirect');
if (sessionDisableProxyRedirect == 'true') {
  console.info("Proxy Redirect is disabled for this page. Please refer to menu to enable it.");
  return; // Stop software.
};

function pageLoader(newUrl) {
//window.onprogress = (event) => {
  notification("Seeking a responsive host.", "🔍");
  if (confirm("Redirect to a privacy front-end?")) {
    location = newUrl;
  } else {
    sessionStorage.setItem('disableProxyRedirect', 'true');
    //location.reload();
  }
}

function noRespond(url, newUrl) {
  notification("No respond from host. Redirecting with Farside.", "🚧");
}

// FIXME
// /questions/1397329/how-to-remove-the-hash-from-window-location-url-with-javascript-without-page-r
function disable() {
  window.location.href =
  window.location.href.substr(
    0,
    window.location.href.indexOf('#'))
  + '#noredirect';
}

/*
loop = setInterval(function() {
  //modifyURL(location.href);
  window.open(newURL,'_self');
  //location.href = newURL;
  console.info('Redirecting to ' + newURL);
  clearInterval(loop);
}, 1000);
*/

/*
function modifyURL() {
  inst = pickURL();
  // make function synchronous
  // /questions/8778267/synchronous-gm-xmlhttprequest-acting-asynchronously
  stat = statRES(inst);
  if (stat.match(200)) {
    newURL = settURL();
  } else {
    pickURL(url);
  }
  return newURL;
}
*/

//(window.onload = alert()

// TODO Nested elements (i.e. element "a" inside another element)
// See "else if e.target.hasChildNodes()"

(function addEventListeners() {
  document.addEventListener("DOMContentLoaded",
    function() {
      for (linkElement of document.links) {
        // mouseover works with keyboard too
        linkElement.addEventListener("mouseover",
          async function(e) {
            if (e.target && e.target.nodeName == "A") {
              hyperLink = e.target;
              await xhrHyperLink(hyperLink);
            } // else if e.target.hasChildNodes()
          },
          {
            once: true
          }
        );
      }
    }
  );
})();

function linkOnError() {
  notification("Proxy state check was not possible; Please. Refresh, and try again, in case the offered service is offline.", "🛑");
}

function linkOnFail() {
  notification("No proxy service was found. Utilizing Farside to intermediate proxy.", "🚧");
}

function linkOnProgress() {
  notification("Looking up for an online proxy service... Please wait.", "🔭");
}

function linkOnSuccess() {
  notification("A proxy service was found!", "🧭");
}

function isValid(url, node) {
  try {
    url = new URL(url);
  } catch (err) {
    return;
  }
  let hostName = url.hostname;
  let pathName = url.pathname;
  // check by excluded
  for (let i = 0; i < urlsMatchers.exclude.length; i++) {
    //if (hostName.endsWith(urlsMatchers.exclude[i].host)) {
    //if (hostName.match(urlsMatchers.exclude[i].host)) {
    if (hostName == urlsMatchers.exclude[i].host ||
        hostName == 'www.' + urlsMatchers.exclude[i].host) {
      for (let j = 0; j < urlsMatchers.exclude[i].path.length; j++) {
        if (pathName.includes('/' + urlsMatchers.exclude[i].path[j])) {
          return 0; // exit further check
        }
      }
      if (node) {
        let text = node.outerText;
        if (urlsMatchers.exclude[i].text) {
          for (let j = 0; j < urlsMatchers.exclude[i].text.length; j++) {
            if (text.match(urlsMatchers.exclude[i].text[j])) {
              return 0; // exit further check
            }
          }
        }
      }
    }
  }
  // continue to includeByHostname
  for (let i = 0; i < urlsMatchers.includeByHostname.length; i++) {
    // perhaps use 'match' and create a new object.array for domains with multiple subdomains
    if (hostName == urlsMatchers.includeByHostname[i].host ||
        hostName == 'www.' + urlsMatchers.includeByHostname[i].host) {
    //if (hostName.endsWith(urlsMatchers.includeByHostname[i].host)) {
      return 1;
    }
  }
  // continue to specific
  for (let i = 0; i < urlsMatchers.includeByPathname.length; i++) {
    if (hostName.endsWith(urlsMatchers.includeByPathname[i].host)) {
      for (let j = 0; j < urlsMatchers.includeByPathname[i].path.length; j++) {
        if (pathName.startsWith('/' + urlsMatchers.includeByPathname[i].path[j])) {
          return 1;
        }
      }
    }
  }
  // continue to second-level-domain
  for (let i = 0; i < urlsMatchers.includeBySLD.length; i++) {
    partedHost = hostName.split('.');
    partedHost.shift();
    if (partedHost.join('.').match(urlsMatchers.includeBySLD[i].host)) {
    //if (partedHost[partedHost.length-2].match(urlsMatchers.includeBySLD[i].host)) {
      return 1;
    }
  }
  // continue to second-level-domain and path
  for (let i = 0; i < urlsMatchers.includeByPathnameAndSLD.length; i++) {
    partedHost = hostName.split('.');
    // TODO Test
    if (partedHost[partedHost.length-2].match(urlsMatchers.includeByPathnameAndSLD[i].host)) {
      for (let j = 0; j < urlsMatchers.includeByPathnameAndSLD[i].path.length; j++) {
        if (pathName.startsWith('/' + urlsMatchers.includeByPathnameAndSLD[i].path[j])) {
          return 1;
        }
      }
    }
  }
}

// var caller = (function xhr() {
async function xhrHyperLink(node) {
  let url = node.href;
  let valid = isValid(url, node);
  if (!valid) {return;}
  //let url = node.href;
  //if (!url) {return;}
  let instanceSelect = await pickInstance(url);
  let result = await pickURL(instanceSelect);
  if (!result) {return;}
  let instanceName = result.name;
  let instanceType = result.type;
  let instanceUrl = result.url;
  if (!url) {return;}
  let newPath = modifyPathname(instanceName, url);
  let newUrl = new URL(instanceUrl + newPath);
  let counter = 0;

  console.info(`🥸 Proxy Redirect: ${instanceName}`);
  console.info(`🥸 Proxy Redirect: ${newUrl}`);
  console.info(`🥸 Proxy Redirect: ${url}`);
  console.info(`🥸 Proxy Redirect: ${instanceUrl}`);
  console.info(`🥸 Proxy Redirect: ${newPath}`);

  try {
    gmXmlhttpRequest({
      method: 'GET',
      url: instanceUrl,
      synchronous: true,
      onprogress: linkOnProgress(),
      onload: async function(response) {
        if (response.finalUrl.startsWith(instanceUrl) && response.status == 200) {
          newPath = modifyPathname(instanceName, url);
          newUrl = new URL(instanceUrl + newPath);
          linkOnSuccess();
        } else {
          instanceUrlPrint = instanceUrl.slice(instanceUrl.lastIndexOf('/')+1);
          instanceUrlPrint = instanceUrlPrint.replace(/\./g,'-');
          console.warn('🥸 Instance URL ' + instanceUrl + ' might be out of service. URL has changed. Please report this to the developer.');
          if (maxAttempts(instanceName, instanceType, counter)) {
            instanceUrl = farSide(instanceName, instanceUrl);
            if (!instanceUrl) {
              instanceObj = await pickURL(instanceName);
              instanceUrl = instanceObj.url;
            }
            newPath = modifyPathname(instanceName, url);
            linkOnFail();
            return;
          }
          maxAttempts(instanceName, instanceType, counter);
          xhr();
        }
      },
      onerror: async function(response) {
          instanceUrlPrint = instanceUrl.slice(instanceUrl.lastIndexOf('/')+1);
          instanceUrlPrint = instanceUrlPrint.replace(/\./g,'-');
          console.warn('🥸 Instance URL ' + instanceUrl + ' might be offline. Status error: ' + response.status + '. Please report this to the developer.');
          instanceUrl = farSide(instanceName, instanceUrl);
          if (!instanceUrl) {
            instanceObj = await pickURL(instanceName);
            instanceUrl = instanceObj.url;
          }
          newPath = modifyPathname(instanceName, url);
          linkOnError();
          if (maxAttempts(instanceName, instanceType, counter)) {
            instanceUrl = farSide(instanceName, instanceUrl);
            if (!instanceUrl) {
              instanceObj = await pickURL(instanceName);
              instanceUrl = instanceObj.url;
            }
            newPath = modifyPathname(instanceName, url);
            linkOnFail();
            return;
          }
          maxAttempts(instanceName, instanceType, counter);
          xhr();
      }
    });
  } catch (err) {
    console.warn(err);
    notification("API GM.xmlHttpRequest does not seem to be available. Defaulting to Farside.link. Contribute your help in C++ to improve Greasemonkey for Falkon https://bugs.kde.org/show_bug.cgi?id=466533", "🖥");
    //pickURL();
    instanceUrl = farSide(instanceName, instanceUrl);
    if (!instanceUrl) {
      instanceObj = await pickURL(instanceName);
      instanceUrl = instanceObj.url;
    }
    //if ((proxy[instanceName].clearnet).filter(str => str.includes('farside.link')).length) {
    //  instanceUrl = (proxy[instanceName].clearnet).filter(str => str.includes('farside.link'))[0];
    //}
    newPath = modifyPathname(instanceName, url);
    node.href = new URL(instanceUrl + newPath);
  }
}

// var caller = (function xhr() {
var init = (async function xhrAddressBar() {
  let url = document.location.href;
  if (!url) {return;}
  let valid = isValid(url);
  if (!valid) {return;}
  let instanceSelect = await pickInstance(url);
  let result = await pickURL(instanceSelect);
  if (!result) {return;}
  let instanceName = result.name;
  let instanceType = result.type;
  let instanceUrl = result.url;
  if (!url) {return;}
  let newPath = modifyPathname(instanceName, url);
  let newUrl = new URL(instanceUrl + newPath);
  let counter = 0;

  console.info(`🥸 Proxy Redirect: ${instanceName}`);
  console.info(`🥸 Proxy Redirect: ${newUrl}`);
  console.info(`🥸 Proxy Redirect: ${url}`);
  console.info(`🥸 Proxy Redirect: ${instanceUrl}`);
  console.info(`🥸 Proxy Redirect: ${newPath}`);

  try {
    gmXmlhttpRequest({
      method: 'GET',
      url: instanceUrl,
      synchronous: true,
      onprogress: pageLoader(newUrl),
      onload: async function(response) {
        // FIXME wiki.slipfox.xyz and wikiless.bloatcat.tk are selected albeit none should be selected.
        if (response.finalUrl.startsWith(instanceUrl) && response.status == 200) {
          newPath = modifyPathname(instanceName, url);
          newUrl = new URL(instanceUrl + newPath);
          await wait(3);
          location.href = newUrl;
        } else {
          instanceUrl = instanceUrl.slice(instanceUrl.lastIndexOf('/')+1);
          instanceUrl = instanceUrl.replace(/\./g,'-');
          console.warn('🥸 Instance URL ' + instanceUrl + ' might be out of service. URL has changed. Please report this to the developer.');
          if (maxAttempts(instanceName, instanceType, counter)) {
            instanceUrl = farSide(instanceName, instanceUrl);
            if (!instanceUrl) {
              instanceObj = await pickURL(instanceName);
              instanceUrl = instanceObj.url;
            }
            newPath = modifyPathname(instanceName, url);
            newUrl = new URL(instanceUrl + newPath);
            noRespond(url, newUrl);
            await wait(5);
            location.href = newUrl;
          }
          maxAttempts(instanceName, instanceType, counter);
          xhr();
        }
      },
      onerror: async function(response) {
          instanceUrl = instanceUrl.slice(instanceUrl.lastIndexOf('/')+1);
          instanceUrl = instanceUrl.replace(/\./g,'-');
          console.warn('🥸 Instance URL ' + instanceUrl + ' might be offline. Status error: ' + response.status + '. Please report this to the developer.');
          if (maxAttempts(instanceName, instanceType, counter)) {
            instanceUrl = farSide(instanceName, instanceUrl);
            if (!instanceUrl) {
              instanceObj = await pickURL(instanceName);
              instanceUrl = instanceObj.url;
            }
            newPath = modifyPathname(instanceName, url);
            newUrl = new URL(instanceUrl + newPath);
            noRespond(url, newUrl);
            await wait(5);
            location.href = newUrl;
          }
          maxAttempts(instanceName, instanceType, counter);
          xhr();
      }
    });
  } catch (err) {
    console.warn(err);
    notification("API GM.xmlHttpRequest does not seem to be available. Defaulting to Farside.link. Contribute your help in C++ to improve Greasemonkey for Falkon https://bugs.kde.org/show_bug.cgi?id=466533", "🖥");
    //pickURL();
    instanceUrl = farSide(instanceName, instanceUrl);
    if (!instanceUrl) {
      instanceObj = await pickURL(instanceName);
      instanceUrl = instanceObj.url;
    }
    //if ((proxy[instanceName].clearnet).filter(str => str.includes('farside.link')).length) {
    //  instanceUrl = (proxy[instanceName].clearnet).filter(str => str.includes('farside.link'))[0];
    //}
    newPath = modifyPathname(instanceName, url);
    newUrl = new URL(instanceUrl + newPath);
    await wait(3);
    location.href = newUrl;
  }
})();

function farSide(instanceName, instanceUrl) {
  switch (instanceName) {
    case '4get':
      instanceUrl = 'https://farside.link/4get';
      break;
    case 'anonymousoverflow':
      instanceUrl = 'https://farside.link/anonymousoverflow';
      break;
    case 'bibliogram':
      instanceUrl = 'https://farside.link/bibliogram';
      break;
    case 'breezewiki':
      instanceUrl = 'https://farside.link/breezewiki';
      break;
    case 'dumb':
      instanceUrl = 'https://farside.link/dumb';
      break;
    case 'gothub':
      instanceUrl = 'https://farside.link/gothub';
      break;
    case 'invidious':
      instanceUrl = 'https://farside.link/invidious';
      break;
    case 'librarian':
      instanceUrl = 'https://farside.link/librarian';
      break;
    case 'libreddit':
      instanceUrl = 'https://farside.link/libreddit';
      break;
    case 'libremdb':
      instanceUrl = 'https://farside.link/libremdb';
      break;
    case 'librex':
      instanceUrl = 'https://farside.link/librex';
      break;
    case 'librey':
      instanceUrl = 'https://farside.link/librey';
      break;
    case 'lingva':
      instanceUrl = 'https://farside.link/lingva';
      break;
    case 'nitter':
      instanceUrl = 'https://farside.link/nitter';
      break;
    case 'piped':
      instanceUrl = 'https://farside.link/piped';
      break;
    case 'proxigram':
      instanceUrl = 'https://farside.link/proxigram';
      break;
    case 'proxitok':
      instanceUrl = 'https://farside.link/proxitok';
      break;
    case 'quetre':
      instanceUrl = 'https://farside.link/quetre';
      break;
    case 'redlib':
      instanceUrl = 'https://farside.link/redlib';
      break;
    case 'rimgo':
      instanceUrl = 'https://farside.link/rimgo';
      break;
    case 'scribe':
      instanceUrl = 'https://farside.link/scribe';
      break;
    case 'searx':
      instanceUrl = 'https://farside.link/searxng';
      break;
    case 'simplytranslate':
      instanceUrl = 'https://farside.link/simplytranslate';
      break;
    case 'teddit':
      instanceUrl = 'https://farside.link/teddit';
      break;
    case 'whoogle':
      instanceUrl = 'https://farside.link/whoogle';
      break;
    case 'wikiless':
      instanceUrl = 'https://farside.link/wikiless';
      break;
    //case 'yacy':
    //  instanceUrl = 'https://farside.link/yacy';
    //  break;
    default:
      instanceUrl = 0;
  }
  return instanceUrl;
}

function maxAttempts(instanceName, instanceType, counter) {
  counter = counter + 1;
  if (counter == proxy[instanceName][instanceType].length) {
    return true;
  } else {
    return counter;
  }
}

function setValue(para, sourceURL) {
  if (sourceURL.searchParams.get(para)) {
    para = [para];
    return pickParameters(para, sourceURL);
  } else {
    return 'auto';
  }
}

function pickParameters(para, sourceURL) {
  for (let i = 0; i < para.length; i++) {
    if (sourceURL.searchParams.get(para[i])) {
      para = sourceURL.searchParams.get(para[i]);
      sourceURL.searchParams.delete(para[i]);
      return para;
    }
  }
}

/*

FIXME Check whether instance is enabled.
TODO Do not add instance is is disabled,
     so that the redirector will not halt
     when a disabled instance is chosen.

*/

async function pickInstance(url) {

  let sourceURL = new URL(url);
  let paras = ['continue', 'retpath'];

  for (let i = 0; i < paras.length; i++) {
    if (sourceURL.searchParams.get(paras[i])) {
      //sourceURL = pickParameters(paras[i], sourceURL);
      sourceURL = sourceURL.searchParams.get(paras[i]);
      sourceURL = new URL(sourceURL);
    }
  }

  let hostname = sourceURL.hostname;
  let pathname = sourceURL.pathname;
  let instanceName;
  let instanceNameArray = [];

  switch (true) {

    case hostname == 'bandcamp.com':
    case hostname == 'www.bandcamp.com':
    case hostname.endsWith('.bandcamp.com'):
      instanceName = 'tent';
      break;

    case hostname == 'bilibili.com':
    case hostname == 'www.bilibili.com':
    case hostname.endsWith('.bilibili.com'):
      instanceName = 'mikuinvidious';
      break;

    //case pathname.startsWith('/magnet/') && (hostname == 'bt4g.org' || hostname == 'www.bt4g.org'):
    //case pathname.startsWith('/magnet/') && hostname == 'bt4gprx.com' || hostname == 'www.bt4gprx.com':
    case pathname.startsWith('/hash/') && hostname == 'downloadtorrentfile.com' || hostname == 'www.downloadtorrentfile.com':
    case hostname == 'torrentdownload.info':
    case hostname == 'www.torrentdownload.info':
    case hostname == 'torrentz.eu':
    case hostname == 'www.torrentz.eu':
    case hostname == 'torrentz.me':
    case hostname == 'www.torrentz.me':
    case hostname == 'torrentz2.is':
    case hostname == 'www.torrentz2.is':
      instanceName = 'btdigg';
      break;

    //case hostname == 'fandom.com':
    //case hostname == 'www.fandom.com':
    case hostname.endsWith('.fandom.com'):
      instanceName = 'breezewiki';
      break;

    case hostname == 'github.com':
    case hostname == 'www.github.com':
    case hostname.endsWith('.github.com'):
      instanceName = 'gothub';
      break;

    case hostname == 'gitlab.com':
    case hostname == 'www.gitlab.com':
      instanceName = 'laboratory';
      break;

    case hostname == 'goodreads.com':
    case hostname == 'www.goodreads.com':
      instanceName = 'biblioreads';
      break;

    // TODO quadkey (mapquest)
    // NOTE quadkeyToTile(quadkey) See /mapbox/tilebelt
    case hostname.endsWith('wikimap.toolforge.org'):
    case (hostname.endsWith('moovitapp.com') &&
          sourceURL.search.includes('tll')):
    case (hostname.endsWith('bing.com') &&
          pathname.startsWith('/maps')):
    case (hostname.includes('google.') &&
          pathname.startsWith('/maps')):
    case (hostname.includes('waze.com') &&
          pathname.startsWith('/live-map')):
    case (hostname.includes('waze.com') &&
          pathname.startsWith('/ul')):
    case (hostname.includes('yandex.') &&
          pathname.startsWith('/maps')):
      instanceNameArray.push('facilmap');
      instanceNameArray.push('openstreetmap');
      break;

    case hostname == 'imdb.com':
    case hostname == 'www.imdb.com':
      instanceName = 'libremdb';
      break;

    case hostname == 'imgur.com':
    case hostname == 'www.imgur.com':
      //instanceNameArray.push('imgin');
      instanceNameArray.push('rimgo');
      break;

    case hostname == 'instructables.com':
    case hostname == 'www.instructables.com':
      instanceNameArray.push('destructables');
      instanceNameArray.push('indestructables');
      break;

    case hostname == 'instagram.com':
    case hostname == 'www.instagram.com':
      //instanceNameArray.push('bibliogram');
      instanceNameArray.push('proxigram');
      break;

    //case hostname == 'medium.com':
    //case hostname == 'www.medium.com':
    case hostname == 'medium.com':
    case hostname == 'www.medium.com':
    case hostname.endsWith('.medium.com'):
      instanceNameArray.push('libmedium');
      instanceNameArray.push('scribe');
      break;

    case hostname == 'odysee.com':
    case hostname == 'www.odysee.com':
      instanceName = 'librarian';
      break;

    case hostname == 'quora.com':
    case hostname == 'www.quora.com':
      instanceName = 'quetre';
      break;

    case hostname == 'reddit.com':
    case hostname == 'old.reddit.com':
    case hostname == 'www.reddit.com':
    case hostname == 'preview.redd.it':
      instanceNameArray.push('libreddit');
      instanceNameArray.push('redlib');
      instanceNameArray.push('teddit');
      break;

    case hostname == 'reuters.com':
    case hostname == 'www.reuters.com':
      instanceName = 'neuters';
      break;

    // FIXME
    case (hostname.startsWith('search.yahoo.')):
    //case (pathname.startsWith('/search')):
    case (hostname.includes('yandex.') &&
          pathname.startsWith('/search')):
    case (hostname.includes('yahoo.') &&
          pathname.startsWith('/search')):
    case (hostname.includes('bing.') &&
          pathname.startsWith('/search')):
    case (hostname.includes('google.') &&
          pathname.startsWith('/search')):
      instanceNameArray.push('4get');
      instanceNameArray.push('librex');
      instanceNameArray.push('librey');
      instanceNameArray.push('lieu');
      instanceNameArray.push('metastem');
      instanceNameArray.push('searx');
      instanceNameArray.push('spot');
      instanceNameArray.push('whoogle');
      break;

    case hostname == 'stackoverflow.com':
    case hostname == 'www.stackoverflow.com':
      instanceName = 'anonymousoverflow';
      break;

    case hostname == 'tiktok.com':
    case hostname == 'www.tiktok.com':
      instanceName = 'proxitok';
      break;

    case (hostname.endsWith('translate.yandex.com')):
          // FIXME website blocks us from redirecting
          // function setTimeout() seems to not work
          // consider different approach/way
    case (hostname.endsWith('translate.google.com')):
      instanceNameArray.push('lingva');
      instanceNameArray.push('simplytranslate');
      break;

    case (hostname.endsWith('.tumblr.com')):
      instanceName = 'priviblur';
      break;

    case hostname == 'twitter.com':
    case hostname == 'www.twitter.com':
    case hostname == 'x.com':
    case hostname == 'www.x.com':
      instanceName = 'nitter';
      break;

    case hostname == 'urbandictionary.com':
    case hostname == 'www.urbandictionary.com':
      instanceName = 'ruraldictionary';
      break;

    case hostname == 'userscripts.org':
    case hostname == 'www.userscripts.org':
      instanceName = 'uso';
      break;

    //case hostname == 'wikipedia.org':
    //case hostname == 'www.wikipedia.org':
    case hostname.endsWith('.wikipedia.org'):
//    instanceNameArray.push('everybodywiki');
//    instanceNameArray.push('metastemwiki');
      instanceNameArray.push('wikiless');
//    instanceNameArray.push('wikiwand');
      break;

    case hostname == 'youtu.be':
    case hostname == 'www.youtu.be':
    case hostname == 'youtube.com':
    case hostname == 'm.youtube.com':
    case hostname == 'www.youtube.com':
    case hostname == 'youtube-nocookie.com':
    case hostname == 'm.youtube-nocookie.com':
    case hostname == 'www.youtube-nocookie.com':
    //case hostname.endsWith('invidious-invidious.invidious.svc.cluster.local:3000'):
      instanceNameArray.push('alltube');
      instanceNameArray.push('cloudtube');
      instanceNameArray.push('invidious');
      instanceNameArray.push('materialious');
      instanceNameArray.push('piped');
//      //instanceNameArray.push('pipedmaterial');
      instanceNameArray.push('poketube');
      instanceNameArray.push('tubo');
      break;

    //default:
    //  return target;

  }

  // proxy select
  if (instanceNameArray.length) {
    instanceName = instanceNameArray[Math.floor(Math.random()*instanceNameArray.length)];
    //urlArray = proxyArray[Math.floor(Math.random()*proxyArray.length)];
  }

  return instanceName;

}

function removeParameters(sourceURL) {

  switch (sourceURL.hostname) {
    case 'youtube.com':
    case 'm.youtube.com':
    case 'www.youtube.com':
    case 'youtube-nocookie.com':
    case 'm.youtube-nocookie.com':
    case 'www.youtube-nocookie.com':
      sourceURL.searchParams.delete('app')
      break;
  }

  return sourceURL;

}

// TODO
// Settle hostname
function modifyHostname(instanceName, url) {
  let lang, partedHost;
  let sourceURL = new URL(url);
  let hostname = sourceURL.hostname;

  switch (instanceName) {

    case 'everybodywiki':
      // extract language code
      partedHost = hostname.split('.');
      if (partedHost.length === 3 || partedHost.length === 4) {
        lang = partedHost[0];
      }
      newHostname = `${lang}.everybodywiki.com`;
      sourceURL.hostname = newHostname;
      break;

  }

  return sourceURL;

}

// Settle pathname
function modifyPathname(instanceName, url) {
  let brand, lang, name, newPath, para, partedHost;
  let sourceURL = new URL(url);
  //url = removeParameters(sourceURL);
  let pathname = sourceURL.pathname;
  let hostname = sourceURL.hostname;
  //let parameter = sourceURL.searchParams;

  switch (instanceName) {

    // NOTE This "case" is not required albeit it makes the URL more clear
    case 'alltube':
      cleansedUrl = removeParameters(sourceURL);
      newPath = `/info?url=${cleansedUrl}`;
      break;

    // consider function setTimeout()
    case 'bibliogram':
      if (!pathname.includes('accounts/login')) {
        newPath = `/u/${para}`;
      } else {
        if (sourceURL.searchParams.get('next')) {
          para = ['next'];
          para = pickParameters(para, sourceURL);
          newPath = `/u/${para}`;
        }
      }
      break;

    case 'breezewiki':
      // extract wiki name
      partedHost = hostname.split('.');
      if (partedHost.length === 3 || partedHost.length === 4) {
        brand = partedHost[0];
      }
      newPath = `/${brand}${pathname}`;
      break;

    case 'btdigg':
      // extract sha1sum
      //hash = pathname.split('/')[2];
      let hash = pathname.split('/');
      for (let i = 0; i < hash.length; i++) {
        if (hash[i].length === 40 || hash[i].length === 33) {
          hash = hash[i];
          break;
        }
      }
      newPath = `/${hash}`;
      break;

    case 'cloudtube':
    case 'invidious':
    case 'piped':
    case 'pipedmaterial':
    case 'poketube':
      if (sourceURL.searchParams.get('v')) {
        para = ['v'];
        para = pickParameters(para, sourceURL);
        newPath = `/watch?v=${para}`;
      }
      break;

    case 'libreddit':
    case 'redlib':
    case 'teddit':
      let newPathPart;
      if (instanceName == 'teddit') {
          newPathPart = '/pics/w:null_';
      } else {
          newPathPart = '/img/';
      }
      if (hostname == 'preview.redd.it') {
        newPath = `${newPathPart}${pathname}`;
      } else
      if (hostname.endsWith('reddit.com') && pathname == '/media' && sourceURL.searchParams.get('url')) {
        let extractedURL = new URL(sourceURL.searchParams.get('url'))
        if (extractedURL.hostname == 'preview.redd.it') {
          extractedPathname = extractedURL.pathname.split('-').pop();
          extractedPathname = extractedPathname.replace('/','');
          newPath = `${newPathPart}${extractedPathname}`;
        }
      }
      break;

    case 'gothub':
      if (hostname.endsWith('gist.github.com')) {
        newPath = `/gist${pathname}`;
      }
      break;

    case 'laboratory':
      newPath = '/' + hostname + pathname;
      break;

//    case 'libmedium':
      //partedHost = hostname.split('.');
      //if (partedHost.length === 3 || partedHost.length === 4) {
      //  name = partedHost[0];
      //}
      //newPath = `/@${name}${pathname}`;
//      newPath = pathname;
//      break;

    case 'librex':
    case 'metastem':
    case 'spot':
      // extract search parameter
      para = ['q', 'text', 'p'];
      para = pickParameters(para, sourceURL);
      newPath = `/search.php?q=${para}`;
      break;

    case 'lingva':
      // extract text parameter
      let paras = ['sl', 'tl', 'text'];

      for (let i = 0; i < paras.length; i++) {
        paras[i] = setValue(paras[i], sourceURL);
      }

      //if (paras[2] === 'auto') { paras[2] = ''; }

      if ((paras[0] == 'auto') && (paras[1] == 'auto')) {
        newPath = `/${paras[2]}`;
      } else {
        newPath = `/${paras[0]}/${paras[1]}/${paras[2]}`;
      }
      break;

    case 'facilmap':
    case 'openstreetmap':
      // extract coordinations
      /*
      if (pathname.includes('@')) {
        cord = pathname.split('/')[2].split('&')[0].slice(1);
        cord = cord.split(',');
      }
      newPath = '/#map=' + cord[2].slice(0, 1) +
             '/' + cord[0] + '/' + cord[1];
      */
      let cord, lat, lon, zoom;
      // extract coordinations
      if (sourceURL.search.includes('%7E')) { // %7E is ~
        para = ['cp'];
        cord = pickParameters(para, sourceURL);
        cord = cord.split('~');
        para = ['lvl'];
        zoom = pickParameters(para, sourceURL);
        lat = cord[0];
        lon = cord[1];
      } else
      if (sourceURL.search.includes('to')) {
        para = ['to'];
        cord = pickParameters(para, sourceURL);
        cord = cord.slice(3).split(',');
        lat = cord[0];
        lon = cord[1];
      } else
      if (pathname.includes('ul') &&
          sourceURL.search.includes('ll')) {
        para = ['ll'];
        cord = pickParameters(para, sourceURL);
        cord = cord.split(',');
        para = ['zoom'];
        zoom = pickParameters(para, sourceURL);
        lat = cord[0];
        lon = cord[1];
      } else
      if (sourceURL.search.includes('ll')) {
        para = ['ll'];
        cord = pickParameters(para, sourceURL);
        cord = cord.split(',');
        para = ['z'];
        zoom = pickParameters(para, sourceURL);
        lat = cord[0];
        lon = cord[1];
      } else
      if (sourceURL.search.includes('tll')) {
        para = ['tll'];
        cord = pickParameters(para, sourceURL);
        cord = cord.split('_');
        lat = cord[0];
        lon = cord[1];
      } else
      if (pathname.includes('@')) {
        partedPath = pathname.split('/')
        for (let i = 0; i < partedPath.length; i++) {
          if (partedPath[i].startsWith('@')) {
            cord = partedPath[i].split(',');
          }
        }
        lat = cord[0].slice(1);
        lon = cord[1];
        zoom = cord[2];
        //newPath = `/#map=${cord[2].slice(0, 2)}/${cord[0].slice(1)}/${cord[1]}`;
        //newPath = `/#map=${cord[2]}/${cord[0].slice(1)}/${cord[1]}`;
        //newPath = `/#${cord[2]}/${cord[0].slice(1)}/${cord[1]}/`;
      }

      if (lat && lon && zoom) {
        switch (instanceName) {
          case 'facilmap':
            newPath = `/#${zoom}/${lat}/${lon}/Mpnk`;
            break;
          case 'openstreetmap':
            newPath = `/#map=${zoom}/${lat}/${lon}/`;
            break;
        }
      } else
      if (lat && lon && !zoom) {
        switch (instanceName) {
          case 'facilmap':
            newPath = `/#17/${lat}/${lon}/Mpnk`;
            break;
          case 'openstreetmap':
            newPath = `/#map=17/${lat}/${lon}/`;
            break;
        }
      }

      if (!newPath && sourceURL.searchParams.get('q')) {
        para = ['q'];
        para = pickParameters(para, sourceURL);
        newPath = `/search?query=${para}`;
        instanceUrl = 'https://www.openstreetmap.org'; // TODO Check why this line exist
      }
      break;

    case 'lieu':
    case 'searx':
    case 'whoogle':
      // extract search parameter
      para = ['q', 'text', 'p'];
      para = pickParameters(para, sourceURL);
      newPath = `/search?q=${para}`;
      break;

    case 'metastemwiki':
      // extract language code
      partedHost = hostname.split('.');
      if (partedHost.length === 3 || partedHost.length === 4) {
        lang = partedHost[0];
      }
      newPath = `/#${pathname}/${lang}`;
      break;

    case 'mikuinvidious':
      if (!hostname.startsWith('www.')) {
        partedHost = hostname.split('.');
        if (partedHost.length === 3 || partedHost.length === 4) {
          name = partedHost[0];
        }
        newPath = `/${name}${pathname}`;
      }
      break;

    case 'priviblur':
      if (hostname == '64.media.tumblr.com') {
        newPath = `/tblr/media/64${pathname}`;
      } else {
        partedHost = hostname.split('.');
        if (partedHost.length === 3 || partedHost.length === 4) {
          subname = partedHost[0];
        }
        pathname = pathname.replace('/image/', '/post/');
        if (pathname == '/library') {pathname = '';}
        if (subname == 'www') {subname = '';}
        newPath = `/${subname}${pathname}`;
      }
      break;

    case 'tent':
      partedHost = hostname.split('.');
      if (partedHost.length === 3 || partedHost.length === 4) {
        artist = partedHost[0];
      }
      partedPath = pathname.split('/');
      type = partedPath[1];
      name = partedPath[2];
      if (name) {
        newPath = `/release.php?artist=${artist}&type=${type}&name=${name}`;
      } else {
        newPath = `/release.php?artist=${artist}&type=${type}`;
      }
      break;

    case 'wikiless':
      // extract language code
      partedHost = hostname.split('.');
      if (partedHost.length === 3 || partedHost.length === 4) {
        lang = partedHost[0];
      }
      newPath = `${pathname}?lang=${lang}`;
      break;

    case 'wikiwand':
      // extract language code
      partedHost = hostname.split('.');
      if (partedHost.length === 3 || partedHost.length === 4) {
        lang = partedHost[0];
      }
      partedPath = pathname.split('/');
      pathname = partedPath[2];
      newPath = `/${lang}/${pathname}`;
      break;

    case 'yacy':
      // extract search parameter
      para = ['q', 'text', 'p'];
      //pickParameters(para, sourceURL); // works even when just calling the function?
      para = pickParameters(para, sourceURL);
      newPath = `/yacysearch.html?query=${para}`;
      break;

  }

  if (!newPath || newPath == '/') {
    newPath = pathname + sourceURL.search + sourceURL.hash;
  }

  return newPath;

}

(async function registerMenuCommand(){
  if (gmRegisterMenuCommand) {
    for (let key in proxy) {
      let keyValue = await GM.getValue(key, true);
      let icon, status, value;
      if (keyValue) {
        icon = '🔀'
        status = 'on';
        value = false;
      } else {
        icon = '🔁'
        status = 'off';
        value = true;
      }
      await GM.registerMenuCommand(`${icon} ${key} [${status}]`.toUpperCase(), () => toggleStatus(key, value, status));
    }
    for (let key of ['dhttp', 'i2p', 'loki', 'tor', 'veilid', 'yggdrasil']) {
      let keyValue = await GM.getValue(key, false);
      let icon, status, value;
      if (keyValue) {
        icon = '🔒'
        status = 'on';
        value = false;
      } else {
        icon = '🔓'
        status = 'off';
        value = true;
      }
      await GM.registerMenuCommand(`${icon} ${key} system [${status}]`.toUpperCase(), () => toggleStatus(key, value, status), key[0]);
    }
  }
})();

async function toggleStatus(key, value, status) {
  await GM.setValue(key, value);
  //alert(`${key} is now ${status}d`)
  //location.reload();
}

(function instanceSwitcher(){
  document.addEventListener("DOMContentLoaded",
    async function() {
      let instanceSelect = isInstance();
      if (instanceSelect) {
        //proxyButton(instanceSelect);
        infoBar(instanceSelect);
        await GM.registerMenuCommand(`🎲️ Switch Instance`,
          () => xhrInstanceSwitcher(instanceSelect), 'S'); // ↻ ↯ ↫
      }
    });
})();

// Check whether current page is a proxy instance
// If it is, create a menu command and a top bar to switch with another instance.
function isInstance(){
  for (i in proxy) {
    for (j in proxy[i]) {
      for (k in proxy[i][j]) {
        let url
        url = proxy[i][j][k];
        url = new URL(url);
        if (location.hostname == url.hostname) {
          instanceName = i;
          return instanceName;
        }
      }
    }
  }
}

function proxyButton(instanceSelect) {
  let namespace = 'i2p-schimon-proxy-button';
  let bttn = document.createElement(namespace);
  bttn.id = namespace;
  document.body.append(bttn);
  let icon = document.createElement(namespace);
  bttn.append(icon)
  let text = document.createElement(namespace);
  bttn.append(text)
  text.textContent = `Switch ${instanceSelect} instance`;
  // set color
  //text.style.borderWidth = '5px';
  //text.style.borderRadius = '5px';
  //text.style.borderColor = 'red';
  //text.style.background = 'black';
  //text.style.color = 'whitesmoke';
  // set position
  text.style.display = 'none';
  text.style.position = 'fixed';
  text.style.bottom = 0;
  text.style.right = 0;
  text.style.marginTop = '100px';
  text.style.marginRight = '60px';
  text.style.minHeight = '40px';
  // set font
  text.style.fontFamily = 'system-ui';
  text.style.fontSize = '20px';
  text.style.fontStyle = 'italic';
  text.style.fontWeight = 'bold';
  //icon.title = `🥸 Switch ${instanceSelect} instance`;
  // set content
  icon.textContent = '🥸';
  icon.style.all = 'unset';
  // set font
  icon.style.fontFamily = 'system-ui';
  icon.style.fontSize = '20px';
  icon.style.fontWeight = 'bold';
  // set position
  icon.style.position = 'fixed';
  icon.style.bottom = 0;
  icon.style.right = 0;
  // set appearance
  icon.style.marginTop = '100px';
  icon.style.marginRight = '10px';
  icon.style.minWidth = '50px';
  icon.style.minHeight = '50px';
  icon.style.zIndex = 10000;
  icon.style.opacity = 0.5;
  //icon.style.transition = 'all .5s ease .5s';
  // center character
  icon.style.justifyContent = 'center';
  icon.style.alignItems = 'center';
  icon.style.display = 'flex';
  // disable selection marks
  icon.style.outline = 'none';
  bttn.style.userSelect = 'none';
  bttn.style.cursor = 'default';
  bttn.onmouseover = () => {
    //bttn.textContent = `Switch ${instanceSelect} instance 🥸`;
    icon.style.opacity = 'unset';
    text.style.display = 'unset';
  };
  bttn.onmouseleave = () => {
    icon.textContent = `🥸`;
    icon.style.opacity = 0.8;
    text.style.display = 'none';
  };
  bttn.onclick = async () => {
     await xhrInstanceSwitcher(instanceSelect);
  };
}

function getOriginalLink(instanceSelect) {
  let lang, originalLink, originalPath, splitPathname;
  let sourceURL = new URL(location.href);
  let pathname = sourceURL.pathname;
  pathname = pathname.replace('//', '/');
  //let hostname = sourceURL.hostname;
  switch (instanceSelect) {
    case 'alltube':
      originalLink = sourceURL.searchParams.get('url').replace('/www.','/');
      break;
    case 'anonymousoverflow':
      // NOTE Not good due to I2P and onion not having HTTP(S)
      //sourceURL.hostname = 'stackoverflow.com';
      //originalLink = sourceURL;
      originalLink = `https://stackoverflow.com${pathname}`;
      break;
    case 'biblioreads':
      originalLink = `https://goodreads.com${pathname}`;
      break;
    case 'breezewiki':
      splitPathname = pathname.split('/');
      splitPathname.shift();
      let brand = splitPathname.shift();
      originalPath = splitPathname.join('/');
      originalLink = `https://${brand}.fandom.com/${originalPath}`;
      break;
    case 'btdigg':
      if (location.href.includes('/search?')) {
        originalLink = sourceURL;
      } else {
        hash = pathname.split('/')[1];
        originalLink = `magnet:?xt=urn:btih:${hash}`;
      }
      break;
    case 'cloudtube':
    case 'invidious':
    case 'materialious':
    case 'piped':
    case 'pipedmaterial':
    case 'poketube':
      let pageId;
      if (pathname.includes('/embed/') || instanceSelect == 'materialious') {
        pageId = pathname.split('/')[2];
      } else {
        pageId = sourceURL.searchParams.get('v');
      }
      originalLink = `https://youtube.com/watch?v=${pageId}`;
      break;
    case 'destructables':
    case 'indestructables':
      originalLink = `https://instructables.com${pathname}`;
      break;
    case 'gothub':
      originalLink = `https://github.com${pathname}`;
      break;
    case 'laboratory':
      originalLink = `https://${pathname}`;
      break;
    case 'libmedium':
      splitPathname = pathname.split('/');
      //let handler = splitPathname[1].substring(1);
      let handler = splitPathname[1];
      originalPath = splitPathname[2];
      originalLink = `https://${handler}.medium.com/${originalPath}`;
      break;
    case 'libremdb':
      originalLink = `https://imdb.com${pathname}`;
      break;
    case 'librarian':
      originalLink = `https://odysee.com${pathname}`;
      break;
    case 'nitter':
      originalLink = `https://twitter.com${pathname}`;
      break;
    case 'neuters':
      originalLink = `https://reuters.com${pathname}`;
      break;
    case 'proxitok':
      originalLink = `https://tiktok.com${pathname}`;
      break;
    case 'quetre':
      originalLink = `https://quora.com${pathname}`;
      break;
    case 'libreddit':
    case 'redlib':
    case 'teddit':
      if (pathname.includes('/img/')) {
        filename = pathname.split('/')[2];
        originalLink = `https://preview.redd.it/${filename}`;
      } else
      if (pathname.includes('/pics/')) {
        filename = pathname.split('/')[2].replace('w:null_', '');
        originalLink = `https://preview.redd.it/${filename}`;
      } else {
        originalLink = `https://reddit.com${pathname}`;
      }
      break;
    case 'metastemwiki':
      splitHash = sourceURL.hash.split('/')
      lang = splitHash[3];
      pathname = splitHash[2];
      originalLink = `https://${lang}.wikipedia.org/wiki/${pathname}`;
      break;
    case 'imgin':
    case 'rimgo':
      originalLink = `https://imgur.com${pathname}`;
      break;
    case 'scribe':
      originalLink = `https://medium.medium.com${pathname}`;
      break;
    case 'tent':
      let artist = sourceURL.searchParams.get('artist');
      let name = sourceURL.searchParams.get('name');
      let type = sourceURL.searchParams.get('type');
      if (type) {
        originalLink = `https://${artist}.bandcamp.com/${type}/${name}`;
      } else {
        originalLink = `https://${artist}.bandcamp.com/`;
      }
      break;
    case 'wikiless':
      lang = sourceURL.searchParams.get('lang');
      if (!lang) {
        lang = document.querySelector('html').lang;
      }
      originalLink = `https://${lang}.wikipedia.org${pathname}`;
      break;
    case 'wikiwand':
      splitPathname = pathname.split('/')
      lang = splitPathname[1];
      pathname = splitPathname[2];
      originalLink = `https://${lang}.wikipedia.org/wiki/${pathname}`;
      break;
    default:
      originalLink = ``;
  }
  return originalLink;
}

function replaceOrigin(newUrl) {
  let url = new URL(location.href);
  let pathname = url.pathname + url.search;
  location.href = newUrl + pathname;
  //url.origin = newUrl;
  //location.href = url
}

async function pickURL(instanceName) {
  // instance select
  let urlArray, telecomSystem;
  if (instanceName && await GM.getValue(instanceName, true)) {
    for (let key of ['dhttp', 'i2p', 'loki', 'tor', 'veilid', 'yggdrasil']) {
      if (await GM.getValue(key, false) &&
          proxy[instanceName][key].length) {
          urlArray = proxy[instanceName][key];
          telecomSystem = key;
          break;
      }
    }
    if (!urlArray) {
      urlArray = proxy[instanceName].clearnet;
      telecomSystem = 'clearnet';
    }
    let urlSelect = urlArray[Math.floor(Math.random()*urlArray.length)];
    return {name : instanceName, url : urlSelect, type : telecomSystem};
  }
}

async function xhrInstanceSwitcher(instanceSelect) {
  let url = location.href;
  let result = await pickURL(instanceSelect);
  if (!result) {return;}
  let instanceName = result.name;
  let instanceType = result.type;
  let instanceUrl = result.url;
  if (!url) {return;}
  let newPath = location.pathname + location.search;
  let newUrl = new URL(instanceUrl + newPath);
  let counter = 0;

  console.info(`🥸 Proxy Redirect: ${instanceName}`);
  console.info(`🥸 Proxy Redirect: ${newUrl}`);
  console.info(`🥸 Proxy Redirect: ${url}`);
  console.info(`🥸 Proxy Redirect: ${instanceUrl}`);
  console.info(`🥸 Proxy Redirect: ${newPath}`);

  try {
    gmXmlhttpRequest({
      method: 'GET',
      url: instanceUrl,
      synchronous: true,
      onprogress: pageLoader(newUrl),
      onload: async function(response) {
        if (response.finalUrl.startsWith(instanceUrl) && response.status == 200) {
          newUrl = new URL(instanceUrl + newPath);
          await wait(3);
          location.href = newUrl;
        } else {
          instanceUrl = instanceUrl.slice(instanceUrl.lastIndexOf('/')+1);
          instanceUrl = instanceUrl.replace(/\./g,'-');
          console.warn('🥸 Instance URL ' + instanceUrl + ' might be out of service. URL has changed. Please report this to the developer.');
          if (maxAttempts(instanceName, instanceType, counter)) {
            instanceUrl = farSide(instanceName, instanceUrl);
            if (!instanceUrl) {
              instanceObj = await pickURL(instanceName);
              instanceUrl = instanceObj.url;
            }
            newPath = modifyPathname(instanceName, url);
            newUrl = new URL(instanceUrl + newPath);
            noRespond(url, newUrl);
            await wait(5);
            location.href = newUrl;
          }
          maxAttempts(instanceName, instanceType, counter);
          xhr();
        }
      },
      onerror: async function(response) {
          instanceUrl = instanceUrl.slice(instanceUrl.lastIndexOf('/')+1);
          instanceUrl = instanceUrl.replace(/\./g,'-');
          console.warn('🥸 Instance URL ' + instanceUrl + ' might be offline. Status error: ' + response.status + '. Please report this to the developer.');
          if (maxAttempts(instanceName, instanceType, counter)) {
            instanceUrl = farSide(instanceName, instanceUrl);
            if (!instanceUrl) {
              instanceObj = await pickURL(instanceName);
              instanceUrl = instanceObj.url;
            }
            newPath = modifyPathname(instanceName, url);
            newUrl = new URL(instanceUrl + newPath);
            noRespond(url, newUrl);
            await wait(5);
            location.href = newUrl;
          }
          maxAttempts(instanceName, instanceType, counter);
          xhr();
      }
    });
  } catch (err) {
    console.warn(err);
    notification("API GM.xmlHttpRequest does not seem to be available. Defaulting to Farside.link. Contribute your help in C++ to improve Greasemonkey for Falkon https://bugs.kde.org/show_bug.cgi?id=466533", "🖥");
    //pickURL();
    instanceUrl = farSide(instanceName, instanceUrl);
    if (!instanceUrl) {
      instanceObj = await pickURL(instanceName);
      instanceUrl = instanceObj.url;
    }
    //if ((proxy[instanceName].clearnet).filter(str => str.includes('farside.link')).length) {
    //  instanceUrl = (proxy[instanceName].clearnet).filter(str => str.includes('farside.link'))[0];
    //}
    newUrl = new URL(instanceUrl + newPath);
    await wait(3);
    location.href = newUrl;
  }
}

async function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function infoBar(instanceSelect) {
  let originalLink = getOriginalLink(instanceSelect);
  let namespace = 'i2p-schimon-proxy-bar';
  let bar = document.createElement(namespace);
  document.body.prepend(bar);
  bar.id = namespace;
  instanceSelectCapitalized = instanceSelect[0].toUpperCase() + instanceSelect.substring(1);
  //bar.title = 'Click to switch to another instance';
  bar.style.all = 'unset';
  bar.style.direction = 'ltr';
  bar.style.backgroundColor = '#000';
  bar.style.color = '#fff';
  bar.style.borderTop = 'ridge';
  bar.style.fontFamily = 'system-ui';
  bar.style.fontSize = '0.8em'
  //bar.style.fontSize = 'larger';
  bar.style.right = 0;
  bar.style.left = 0;
  bar.style.bottom = 0;
  bar.style.zIndex = 10000000000;
  //bar.style.padding = '6px';
  bar.style.position = 'fixed';
  //bar.style.textAlign = 'center';
  bar.style.userSelect = 'none';
  bar.style.opacity = 0.5;
  //bar.onmouseleave = () => { // onmouseout
  //  bar.style.opacity = 0.8;
  //};
  bar.onmouseover = () => { // mouseenter
    bar.style.opacity = 'unset';
  };
  bar.style.display = 'block';
  //bar.style.lineHeight = '40px';
  document.body.style.marginBottom = '40px';
  // TODO Hide when screen is too narrow to hold all elements in one line
  let spanTitle = document.createElement('span');
  spanTitle.textContent = 'URL';
  spanTitle.title = `${instanceSelectCapitalized}`;
  spanTitle.style.margin = '5px';
  spanTitle.style.fontWeight = 'bold';
  bar.append(spanTitle);
  let text = document.createElement('input');
  bar.append(text);
  text.value = originalLink;
  text.style.all = 'unset';
  text.style.margin = '3px';
  text.style.width = '30%';
  text.style.background = '#888';
  text.style.borderRadius = '5px';
  text.style.borderStyle = 'inset';
  text.style.borderColor = '-internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133))';
  let spanSelect = document.createElement('span');
  bar.append(spanSelect);
  spanSelect.textContent = 'Select';
  spanSelect.title = 'Select an instance';
  spanSelect.style.margin = '5px';
  spanSelect.style.fontWeight = 'bold';
  let select = document.createElement('select');
  select.style.all = 'unset';
  select.style.textAlign = 'left';
  select.style.margin = '3px';
  select.style.width = '30%';
  select.style.background = '#888';
  select.style.borderRadius = '5px';
  select.style.borderStyle = 'inset';
  select.style.borderColor = '-internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133))';
  select.oninput = async () => {replaceOrigin(select.value);};
  bar.append(select);
  for (i in proxy[instanceSelect]) {
    for (j of proxy[instanceSelect][i]) {
      let option = document.createElement('option');
      option.textContent = j;
      option.value = j;
      select.append(option);
    }
  }
  let buttons = document.createElement('span');
  buttons.style.float = 'right';
  let buttonSwitch = document.createElement('button');
  buttonSwitch.textContent = '🎲️ Random';
  buttonSwitch.title = 'Switch instance randomly';
  buttonSwitch.style.all = 'unset';
  buttonSwitch.style.margin = '3px';
  //buttonSwitch.style.marginLeft = '1em';
  buttonSwitch.onclick = async () => {await xhrInstanceSwitcher(instanceSelect);};
  buttons.append(buttonSwitch);
  let buttonReturn = document.createElement('button');
  buttonReturn.textContent = '🏠️ Return';
  buttonReturn.title = 'Return to origin page (click twice)';
  buttonReturn.style.all = 'unset';
  buttonReturn.style.margin = '3px';
  buttonReturn.style.marginLeft = '1em';
  buttonReturn.ondblclick = async () => {location.href = originalLink;};
  buttons.append(buttonReturn);
  let buttonClose = document.createElement('button');
  buttonClose.textContent = "❌";
  buttonClose.title = 'Close this bar';
  buttonClose.style.all = 'unset';
  //buttonClose.style.fontWeight = 'bold';
  buttonClose.style.margin = '3px';
  buttonClose.style.marginLeft = '1em';
  buttonClose.style.marginRight = '1em';
  buttonClose.onclick = async () => {bar.remove();};
  buttons.append(buttonClose);
  bar.append(buttons);
  //let span = document.createElement('span');
  //span.textContent = 'Proxy Redirect';
  ////span.style.fontWeight = 'normal';
  ////span.style.fontStyle = 'italic';
  //span.style.margin = '3px';
  //bar.append(span);
  
}

function characterAsSvgDataUri(character) {
  // An SVG string with a character.
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <text y=".9em" font-size="90">${character}</text>
    </svg>
  `;
  // Encode the SVG string to base64.
  const base64Svg = btoa(unescape(encodeURIComponent(svgString)));
  // Return a data URL.
  return `data:image/svg+xml;base64,${base64Svg}`;
}

function notification(message, graphics) {
  console.info("🥸 Proxy Redirect: " + message)
  if (gmNotification) {
    GM.notification(message, "🥸 Proxy Redirect", characterAsSvgDataUri(graphics));
  }
}

