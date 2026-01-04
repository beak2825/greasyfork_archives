// ==UserScript==
// @name         SoftCobra / Nin10News Decoder
// @version      1.0
// @author       Chris Barlow <cdbarlow+softcobra@gmail.com>
// @locale       en_US
// @description  Automatically convert all SoftCobra.com link codes into clickable links which automatically redirect to the link code's decoded link.
// @namespace    softcobra_nin10news
// @license      MIT
// @match        *://softcobra.com/*
// @match        *://www.softcobra.com/*
// @match        *://nin10news.com/decode*
// @match        *://www.nin10news.com/decode*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=softcobra.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/465406/SoftCobra%20%20Nin10News%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/465406/SoftCobra%20%20Nin10News%20Decoder.meta.js
// ==/UserScript==

(function() {
///////////////////////////////////////////////////////////////////////////////////////////////

const safeInterval = (fn, ms) => {
    return setInterval(()=>{
        if (!document.hasFocus()) return
        fn()
    }, ms)
}

const init = () => {
    // softcobra.com
    if (location.host.endsWith('softcobra.com')) {
        safeInterval(() => {
            $('article > .entry-content-wrapper > .entry-content tr > td:not(.cdb)')
                .filter((i,o) => {
                    let hash = o.innerText.trim()
                    return hash.length > 40 && !hash.includes(' ')
                })
                .each((i,o) => {
                    $(o).replaceWith($(`
                        <td class="cdb">
                            <a href="https://nin10news.com/decode/#hash=${escape(o.innerText)}')">${o.innerText}</a>
                        </td>
                    `))
                })
        }, 1000)
    }

    // nin10news.com
    else if (location.host.endsWith('nin10news.com')) {
        let url = '/wp-content/themes/twentysixteen/inc/decode.php'
        let hash = unescape(location.hash.replace('#hash=', ''))
        $.post(url, {data: hash}, (res) => {
            let url = atob(res)
            if (!url.startsWith('http')) return
            location = url
        })
    }
}
init();

////////////////////////////////////////////////////////////////////////////////////////////////////
})();
