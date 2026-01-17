// ==UserScript==
// @name         GGn VNDB uploady new
// @namespace    none
// @version      10
// @description  input game title or vndb id (anything with v(digits)) and click vndb to fill
// @author       ingts
// @match        https://gazellegames.net/upload.php*
// @match        https://gazellegames.net/torrents.php?action=editgroup*
// @connect      api.vndb.org
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://update.greasyfork.org/scripts/548332/1727369/GGn%20Uploady.js
// @downloadURL https://update.greasyfork.org/scripts/472193/GGn%20VNDB%20uploady%20new.user.js
// @updateURL https://update.greasyfork.org/scripts/472193/GGn%20VNDB%20uploady%20new.meta.js
// ==/UserScript==
if (typeof GM_getValue('auto_search_trailer') === 'undefined')
    GM_setValue('auto_search_trailer', false)

const tagsDictionary = {
    'romance': ["Love", "Polyamory", "Polygamy", "Swinging", "Romance"],
    'horror': ["Horror", "Graphic Violence"],
    'science.fiction': ["Science Fiction", "AI"],
    'drama': ["Drama", "Suicide", "Suicidal", "Desperation"],
    'crime': ["Crime", "Slave"],
    'mystery': ["Mystery", "Amnesia", "Disappearance", "Secret Identity"],
    'comedy': ["Comedy", "Slapstick", "Comedic"],
    'fantasy': ["Fantasy", "Magic", "Mahou", "Superpowers"]
}

function removeLastBracket(str) {
    if (!str) return ''
    if (!str.endsWith(']')) return str

    let i = str.length - 1
    let bracketCounter = 0
    for (; i >= 0; i--) {
        if (str[i] === ']') {
            bracketCounter++
        } else if (str[i] === '[') {
            bracketCounter--
            if (bracketCounter === 0) {
                break
            }
        }
    }
    return str.substring(0, i).trim()
}

let platform = ''

/** @type {HTMLInputElement} */
const gameTitleInput = document.getElementById('title')

/**
 * @typedef Result
 * @property {VisualNovel} vn
 * @property {Release[]} releases
 */

/**
 * @param {Result} result
 */
function fillUpload(result) {
    Platform()
    const vn = result.vn

    const englishTitle = vn.titles.find(a => a.lang === 'en')
    gameTitleInput.value = getTitle(result, englishTitle)

    if (GM_getValue('auto_search_trailer'))
        window.open(`https://www.youtube.com/results?search_query=${gameTitleInput.value} trailer`, '_blank').focus()

    const aliasInput = document.getElementById('aliases')
    aliasInput.value = getAliases(result, englishTitle)

    const foundTags = new Set()

    const noRomance = vn.tags.some(tag => tag.name === "No Romance Plot")
    for (const [ggnTag, vndbTagsArr] of Object.entries(tagsDictionary)) {
        if (ggnTag === 'romance' && noRomance) continue
        for (const resultTag of vn.tags) {
            if (vndbTagsArr.some(word => resultTag.name.includes(word)))
                foundTags.add(ggnTag)
        }
    }

    document.querySelector('input[name="tags"]').value =
        `visual.novel${foundTags.size > 0 ? ', ' + Array.from(foundTags).join(', ') : ''}`
        + (result.releases.some(r => r.has_ero) ? ', adult' : '')

    document.getElementById('year').value = getYear(result)

    document.getElementById('image').value = vn.image.url

    document.getElementById('album_desc').value = getDescription(result)

    insertScreenshots(vn.screenshots.map(s => s.url), true)
}

const idRegExp = /v(\d+)/

if (location.href.includes('upload.php')) {
    gameTitleInput.insertAdjacentHTML("afterend", '<a href="javascript:" id="fill_vndb">vndb</a>')
    const fill_vndb = document.getElementById('fill_vndb')
    fill_vndb.onclick = () => {
        if (!gameTitleInput.value) return

        platform = document.getElementById('platform').value
        if (!platform) {
            alert('Platform must be selected')
            return
        }

        const idMatch = idRegExp.exec(gameTitleInput.value)?.[0]
        if (!idMatch) return
        document.getElementById('vndburi').value = `https://vndb.org/${idMatch}`
        req(idMatch).then(fillUpload)
    }
} else {
    platform = document.getElementById('user_script_data').dataset.platform

    createFiller('vndburi', idRegExp, req, {
        getAliases: r => getAliases(r),
        getCover: r => r.vn.image.url,
        getAgeRating: getAgeRating,
        getDescription: getDescription,
        getScreenshots: result => result.vn.screenshots.map(s => s.url),
        getYear: getYear,
        getTitle: getTitle,
    })
}

/** @returns {Promise<Result>} */
async function req(id) {
    /** @type {Result} */
    const result = {}
    await GM.xmlHttpRequest({
        url: 'https://api.vndb.org/kana/vn',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify({
            "filters": id ? ["id", "=", id] : ["search", "=", `${gameTitleInput.value}`],
            "fields": "alttitle, titles.title, title, aliases, description, image.url, screenshots.url, released, titles.lang, tags.name, platforms",
            "results": 1
        }),
        responseType: "json",
        onload: response => result.vn = response.response.results[0]
    })

    await GM.xmlHttpRequest({
        url: 'https://api.vndb.org/kana/release',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify({
            "filters": ["and", ["vn", "=", ["id", "=", result.vn.id]], ["official", "=", 1], ["platform", "=", `${ggnToVndbPlatform.get(platform)}`]],
            "fields": "minage, has_ero, extlinks.id",
            "results": 100
        }),
        responseType: "json",
        onload: response => result.releases = response.response.results
    })

    return result
}

/** @param {Result} result
 * @param {VndbTitle?} englishTitle
 */
function getTitle(result, englishTitle) {
    englishTitle ??= result.vn.titles.find(a => a.lang === 'en')
    return englishTitle ? englishTitle.title : result.vn.title
}

/** @param {Result} result */
function getYear(result) {
    return result.vn.released === 'TBA' ? new Date().getFullYear() + 1 : result.vn.released.split('-')[0]
}

/** @param {Result} result */
function getDescription(result) {
    const isConsole = !["Windows", "Mac", "Linux"].some(p => platform === p)
    return createDescription(removeLastBracket(result.vn.description),
        isConsole ? '' : `[*][b]OS[/b]: 
[*][b]Processor[/b]: 
[*][b]Memory[/b]: 
[*][b]Graphics[/b]: 
[*][b]DirectX[/b]: 
[*][b]Storage[/b]: `)
}

/** @param {Result} result */
function getAgeRating(result) {
    let rating
    const highestMinAge = Math.max(...result.releases.map(result => result.minage))
    if (highestMinAge === 12 || highestMinAge === 13) rating = 5
    else if (highestMinAge === 16 || highestMinAge === 17) rating = 7
    else if (highestMinAge >= 18) rating = 9
    else rating = 13
    return rating
}

/**
 * @param {Result} result
 * @param {VndbTitle?} englishTitle
 * @returns {string}
 */
function getAliases(result, englishTitle) {
    const vn = result.vn
    englishTitle ??= vn.titles.find(a => a.lang === 'en')
    const aliases = [vn.alttitle, vn.aliases.join(", "), englishTitle ? vn.title : null].filter(Boolean)

    for (const externalLink of result.releases.flatMap(release => release.extlinks)) {
        if (/[A-Z]{2}\d{4,}/.test(externalLink.id))
            aliases.push(externalLink.id)
    }

    return joinAliases([...new Set(aliases)])
}

// noinspection DuplicatedCode
const ggnToVndbPlatform = new Map([
    ["Windows", "win"],
    ["Linux", "lin"],
    ["Mac", "mac"],
    ["3DO", "tdo"],
    ["iOS", "ios"],
    ["Android", "and"],
    ["DOS", "dos"],
    ["Dreamcast", "drc"],
    ["NES", "nes"],
    ["SNES", "sfc"],
    ["Game Boy Advance", "gba"],
    ["Game Boy Color", "gbc"],
    ["MSX", "msx"],
    ["Nintendo DS", "nds"],
    ["Switch", "swi"],
    ["Wii", "wii"],
    ["Wii U", "wiu"],
    ["Nintendo 3DS", "n3d"],
    ["NEC PC-98", "p98"],
    ["NEC TurboGrafx-16", "pce"],
    ["NEC PC-FX", "pcf"],
    ["PlayStation Portable", "psp"],
    ["PlayStation 1", "ps1"],
    ["PlayStation 2", "ps2"],
    ["PlayStation 3", "ps3"],
    ["PlayStation 4", "ps4"],
    ["PlayStation 5", "ps5"],
    ["PlayStation Vita", "psv"],
    ["Mega Drive", "smd"],
    ["Saturn", "sat"],
    ["Sharp X1", "x1s"],
    ["Sharp X68000", "x68"],
    ["Xbox", "xb1"],
    ["Xbox 360", "xb3"],
])