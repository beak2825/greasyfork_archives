// ==UserScript==
// @name         ANTIZERT: NO ADS FOR ZERTALIOUS CHEATS (krunker, 1v1.lol, shell shockers, + MORE!)
// @description  BYPASSES ads from ANY CHEAT created by "ZERTALIOUS". install this WITH a "zertalious" cheat, and this will BYPASS THE ADS!. works on krunker.io, 1v1.lol, shellshock.io, ev.io, digdig.io, surviv.io, voxiom.io, & paperio!
// @icon         https://i.imgur.com/ORAaPzD.png
// @version      9

// @author       VillainsRule
// @namespace    https://villainsrule.xyz

// @grant        unsafeWindow
// @grant        GM_cookie
// @run-at       document-start

// @match        *://*.zertalious.xyz/*

// @match        *://shellshock.io/*
// @match        *://algebra.best/*
// @match        *://algebra.vip/*
// @match        *://biologyclass.club/*
// @match        *://deadlyegg.com/*
// @match        *://deathegg.world/*
// @match        *://eggcombat.com/*
// @match        *://egg.dance/*
// @match        *://eggfacts.fun/*
// @match        *://egghead.institute/*
// @match        *://eggisthenewblack.com/*
// @match        *://eggsarecool.com/*
// @match        *://geometry.best/*
// @match        *://geometry.monster/*
// @match        *://geometry.pw/*
// @match        *://geometry.report/*
// @match        *://hardboiled.life/*
// @match        *://hardshell.life/*
// @match        *://humanorganising.org/*
// @match        *://mathdrills.info/*
// @match        *://mathfun.rocks/*
// @match        *://mathgames.world/*
// @match        *://math.international/*
// @match        *://mathlete.fun/*
// @match        *://mathlete.pro/*
// @match        *://overeasy.club/*
// @match        *://scrambled.best/*
// @match        *://scrambled.tech/*
// @match        *://scrambled.today/*
// @match        *://scrambled.us/*
// @match        *://scrambled.world/*
// @match        *://shellshockers.club/*
// @match        *://shellshockers.site/*
// @match        *://shellshockers.us/*
// @match        *://shellshockers.world/*
// @match        *://softboiled.club/*
// @match        *://violentegg.club/*
// @match        *://violentegg.fun/*
// @match        *://yolk.best/*
// @match        *://yolk.life/*
// @match        *://yolk.rocks/*
// @match        *://yolk.tech/*
// @match        *://zygote.cafe/*

// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*

// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*

// @match        *://1v1.lol/*
// @match        *://1v1.school/*

// @match        *://ev.io/*
// @match        *://digdig.io/*
// @match        *://voxiom.io/*
// @match        *://paper-io.com/*
// @downloadURL https://update.greasyfork.org/scripts/524543/ANTIZERT%3A%20NO%20ADS%20FOR%20ZERTALIOUS%20CHEATS%20%28krunker%2C%201v1lol%2C%20shell%20shockers%2C%20%2B%20MORE%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524543/ANTIZERT%3A%20NO%20ADS%20FOR%20ZERTALIOUS%20CHEATS%20%28krunker%2C%201v1lol%2C%20shell%20shockers%2C%20%2B%20MORE%21%29.meta.js
// ==/UserScript==

/* eslint-disable */

if (!location.host.includes('zertalious')) {
    let url = new URL(unsafeWindow.location.href);
    let params = new URLSearchParams(url.search);

    if (!params.get('showAd')) {
        params.append('showAd', (Date.now() - 5 * 60 * 1000).toString(16));
        url.search = params.toString();
        location.href = url.toString();
    }
} else {
    let url = new URL(unsafeWindow.location.href);
    let params = new URLSearchParams(url.search);

    if (params.get('ref')) {
        const array = params.get('ref').split(',').map((x) => parseInt(x));
        const url = new TextDecoder().decode(new Uint8Array(array));
        location.href = url;
    } else GM_cookie.list({ name: 'ref' }, (cookies) => {
        if (cookies && cookies[0] && cookies[0].value) {
            const array = decodeURIComponent(cookies[0].value).split(',').map((x) => parseInt(x));
            const url = new TextDecoder().decode(new Uint8Array(array));
            location.href = url;
        } else alert('[antizert] could not detect a URL. go to the feedback on greasyfork and open a post with console logs.')
    })
}
