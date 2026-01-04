// ==UserScript==
// @name         empornium find variations
// @namespace    http://empornium.is
// @version      0.2.1
// @description  Look up and insert a list of variations of the torrent currently being viewed
// @author       ephraim
// @match        https://www.empornium.is/torrents.php?id=*
// @match        https://www.empornium.me/torrents.php?id=*
// @match        https://www.empornium.sx/torrents.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511407/empornium%20find%20variations.user.js
// @updateURL https://update.greasyfork.org/scripts/511407/empornium%20find%20variations.meta.js
// ==/UserScript==

const variationRegexes = [
    // VR
    /(?:desktop|gearvr|gear|smartphone|mobile|oculus\/?(?:vive)(?: rift)?|oculus\/?(?: ?go)?|go \dk|vive|PlayStationVR PS4|playstation|psvr)(?: ?vr)?/ig,
    // resolutions
    /\d+ ?px|\d+p(?:\d+)?|sd(?!\w)|hd(?!\w|\W)|\[hd\]|4kuhd| 4k|uhd|fullhd|ultrahd|standard|\b[1-9]{1}k(?!\w)|\d+p?\s?x\s?\d+p?\s?(?:px)?|480lp|480|360|720|1080|2160|(?:\d+ ?MP)/ig,
    // bitrate
    /(?:\d+(?:\.\d+)?\s?(?:k|m)?bps)|mobile-(?:high|medium|low)|mobile|(?:low|medium|high|higher) ?bitrate/ig,
    // extras
    /bts|(hq )*image *set|images|(?:with )?picset|\+?pictures|\+?photoset|pics|pic set|\bx\d+|uhq|\d+\s?pics|(first|second) (camera|cam)|best cut|split scenes/ig,
    // framerate
    /\d+(?:\.\d+)?\s?fps/ig,
    // encoding
    /h\.?265|x\.?265|hevc|hvec|avc|h\.?264|x\.?264|SVT-AV1|AV1|reencoded|rencoded|reencode|re-encode|lower bitrate|lq|hq|\boriginal|10bit/ig,
    // filetype
    /mpeg4|3gp|mp4|wmv|mkv|blu-ray/ig,
    // reported torrents
    / \/ Reported/i
];

function extractVariation(title) {
    let cleanTitle = title;
    const variations = [];
    for (const re of variationRegexes) {
        const matches = cleanTitle.match(re);
        if (!matches) continue;
        const token = matches.join(' ');
        variations.push(token);
        for (const match of matches) {
            cleanTitle = cleanTitle.replace(match, '');
        }
    }

    const replacementRegs = [
        /\!+|\/$|\[[\s\W]*\]|\([\s\W]*\)/g, // extra !, /, whitespace and non-word characters in [], empty ()
        /[\(\{\[]+(?:\s*|.)[\)\]\}]+/g, // brackets with one character or only whitespace, can be nested [[]]
        /\s(?=\s)/g, // more than one whitespace in a row
        / \.|( \-|in|freeleech|\[req\])$/i // trailing dot and dash and some words
    ]
    replacementRegs.forEach(re => {
        cleanTitle = cleanTitle.replace(re, '').trim();
    })
    if (variations.length < 1) variations.push('other');
    return { variation: '[' + variations.join(', ') + ']', cleanTitle: cleanTitle };
}


async function findVariations(e) {
    var title = document.getSelection().toString() || e.target.dataset.cleanTitle
    e.target.onclick = ''
    var r = await fetch(`/torrents.php?title=${title.replaceAll(/\s/g, '+')}`, { credentials: 'same-origin' })
    var t = await r.text()

    var parser = new DOMParser();
    var doc = parser.parseFromString(t, "text/html");
    var resultTable = doc.querySelector('#torrent_table')
    var torrents = resultTable.querySelectorAll('.torrent')
    // only keep the first results since the search results could have other torrents
    var firstTorrents = [...torrents].slice(0, 10)
    torrents.forEach(t => t.remove())
    var resultBody = resultTable.querySelector('tbody')
    firstTorrents.forEach(t => { console.log(t); resultBody.append(t) })
    resultTable.querySelectorAll('script, .colhead, .tags').forEach(e => e.remove())
    resultTable.querySelectorAll('a[onmouseover]').forEach(a => { a.removeAttribute('onmouseover'); a.removeAttribute('onmouseout') })

    var middle = document.querySelector('.middle_column')
    var ttable = middle.querySelector('.torrent_table')
    middle.insertBefore(resultTable, ttable)
}

var title = document.querySelector('#details_top .torrent_table strong')
var variation = extractVariation(title.textContent)
var cleanTitle = variation.cleanTitle.replace(/ \/\B/, '') // trailing slash when freeleach
if (variation.variation == '[other]')
    return

var findButton = document.createElement('button')
findButton.textContent = `🔎 Find variations`
findButton.className = 'button infoButton'
findButton.style.width = '13em'
findButton.style.height = '3em'
findButton.dataset.cleanTitle = cleanTitle
findButton.onclick = findVariations
var middleCol = document.querySelector('.middle_column')
middleCol.prepend(findButton)

