// ==UserScript==
// @name         GGn Steam Uploady (edited)
// @namespace    https://gazellegames.net/
// @version      47.001
// @description  Fill upload form with Steam info. Edited from "GGn New Uploady"
// @author       NeutronNoir, ZeDoCaixao, ingts
// @match        https://gazellegames.net/upload.php*
// @match        https://gazellegames.net/torrents.php?action=editgroup*
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      store.steampowered.com
// @connect      steamcdn-a.akamaihd.net
// @require      https://update.greasyfork.org/scripts/548332/1727369/GGn%20Uploady.js
// @require      https://update.greasyfork.org/scripts/540511/1727368/GGn%20Formatters.js
// @downloadURL https://update.greasyfork.org/scripts/479713/GGn%20Steam%20Uploady%20%28edited%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479713/GGn%20Steam%20Uploady%20%28edited%29.meta.js
// ==/UserScript==

if (typeof GM_getValue('get_languages') === 'undefined')
    GM_setValue('get_languages', true)

const allowedTags = new Set([
    // "Casual", allowed but too common
    // "Exploration", allowed but too common
    "2D",
    "2.5D",
    "3D",
    "Anime",
    "Adventure",
    "Aliens",
    "Base Building",
    "City Builder",
    "Simulation",
    "Strategy",
    "RPG",
    "Puzzle",
    "Fantasy",
    "Shooter",
    "Platformer",
    "Horror",
    "Visual Novel",
    "Open World",
    "Survival",
    "Sports",
    "Comedy",
    "Mystery",
    "Sandbox",
    "Fighting",
    "Racing",
    "Shoot 'Em Up",
    "Point & Click",
    "Building",
    "Management",
    "Drama",
    "Romance",
    "Interactive Fiction",
    "Hidden Object",
    "Hack and Slash",
    "Education",
    "Bullet Hell",
    "Dungeon Crawler",
    "Dating Sim",
    "Historical",
    "Walking Simulator",
    "Card Game",
    "Life Sim",
    "Clicker",
    "Metroidvania",
    "Board Game",
    "Driving",
    "Tower Defense",
    "Time Management",
    "City Builder",
    "Thriller",
    "Wargame",
    "Beat 'em up",
    "Runner",
    "Roguelite",
    "Stealth",
    "Trivia",
    "Typing",
    "Minigames",
    "4X",
    "Cooking",
    "Match 3",
    "Rhythm",
    "Cricket",
    "Rugby",
    "Mahjong",
    "Snowboarding",
    "Hockey",
    "Bowling",
    "Skateboarding",
    "Tennis",
    "Cycling",
    "Wrestling",
    "Basketball",
    "Golf",
    "Chess",
    "Boxing",
    "Gambling",
    "Fishing",
    "Auto Battler",
    "Solitaire",
    "Hunting",
    "Grand Strategy",
    "Space Sim",
    "Female Protagonist",
])

const tagMap = new Map([
    ["Roguelike Deckbuilder", ["roguelike, card.game"]],
    ["Roguevania", ["roguelike, metroidvania"]],
    ["Action Roguelike", ["action, roguelike"]],
    ["Pixel Graphics", ["pixel.art"]],
    ["Survival Horror", ["survival, horror"]],
    ["RTS", ["real.time, strategy"]],
    ["Turn-Based Strategy", ["turn.based, strategy"]],
    ["FPS", ["first.person, shooter"]],
    ["Third-Person Shooter", ["third.person, shooter"]],
    ["Sci-fi", ["science.fiction"]],
    ["NSFW", ["adult"]],
    ["Hentai", ["adult"]],
    ["Traditional Roguelike", ["roguelike"]],
    ["Text-Based", ["text.adventure"]],
    ["Flight", ["flight.simulation"]],
    ["Party", ["party"]],
    ["Party Game", ["party"]],
    ["Football (American)", ["american.football"]],
    ["Football (Soccer)", ["soccer"]],
])

let platform = ''

if (location.href.includes('upload.php')) {
    document.querySelector("#groupinfo a[href*='forums.php']").textContent = "Steam URL or ID"
    const steamIdInput = document.getElementById('steamid')
    steamIdInput.type = 'text'
    steamIdInput.size = 20
    steamIdInput.removeAttribute('min')
    steamIdInput.insertAdjacentHTML('afterend',
        '<a href="javascript:;" id="fill_win">Win</a> <a href="javascript:;" id="fill_lin">Lin</a> <a href="javascript:;" id="fill_mac">Mac</a>')

    const platformInput = document.getElementById('platform')
    document.getElementById('fill_win').onclick = () => platformInput.value = "Windows"
    document.getElementById('fill_lin').onclick = () => platformInput.value = "Linux"
    document.getElementById('fill_mac').onclick = () => platformInput.value = "Mac"

    steamIdInput.onblur = () => {
        const inputValue = steamIdInput.value
        if (!inputValue) return
        const appid = /\d+/.exec(inputValue)?.[0]
        if (!appid) return

        const weblinkInput = document.getElementById('steamuri')

        if (inputValue.startsWith(appid)) {
            weblinkInput.value = `https://store.steampowered.com/app/${appid}`
        } else {
            weblinkInput.value = /steamdb/i.test(inputValue)
                ? `https://store.steampowered.com/app/${appid}`
                : /.*\d+\/.*?\//.exec(inputValue)?.[0] ?? inputValue

            steamIdInput.value = /\d+/.exec(inputValue)[0]
        }

        getAppDetails(steamIdInput.value).then(data => {
            if (!platformInput.value) platformInput.value = 'Windows'
            platform = platformInput.value
            Platform()
            fillUpload(data)
        })

        GM.xmlHttpRequest({
            url: `https://store.steampowered.com/app/${steamIdInput.value}`,
        }).then(res => {
            const page = new DOMParser().parseFromString(res.responseText, "text/html")
            let uploadTags = new Set()

            for (const steamTag of page.querySelectorAll('.glance_tags a')) {
                const text = steamTag.textContent.trim()
                if (allowedTags.has(text)) {
                    uploadTags.add(text.toLowerCase()
                        .replace('platformer', "platform")
                        .replace('rpg', "role.playing.game")
                        .replace(/sim(?!\w)|simulator/, "simulation")
                        .replace("builder", "building")
                        .replace(/'/g, '')
                        .replace(/&/g, 'and')
                        .replace(/-/g, ' ')
                        .replace(/(?<!,) /g, '.'))
                    continue
                }
                const mapped = tagMap.get(text)
                if (mapped) {
                    mapped.forEach(tag => uploadTags.add(tag))
                }
            }
            document.querySelector('input[name="tags"]').value = Array.from(uploadTags).join(', ')
            if (uploadTags.has('adult'))
                document.getElementById('Rating').value = 9
        })
    }
} else {
    platform = document.getElementById('nexusmodsuri') ? 'Windows'
        : document.getElementById('itunesuri') ? 'Mac'
            : 'Linux'

    createFiller('steamuri', /\d+/, getAppDetails, {
        getYear: getYear,
        getAgeRating: r => getAgeRating(r)?.value,
        getDescription: r => getDesc(r, true),
        getScreenshots: getScreenshots,
        getTitle: r => r.name,
        getCover: r => getCover(r).then(res => res.url),
        getTrailer: getTrailer
    })
}


/**
 * @param {SteamAppDetails} data
 */
function fillUpload(data) {
    const desc = getDesc(data, false)

    const descField = isEditPage ? document.querySelector("textarea[name='body']") : document.getElementById('album_desc')
    createUnformattedArea(descField, desc)
    descField.value = formatAll(desc, data.name)

    document.getElementById('year').value = getYear(data)

    insertScreenshots(getScreenshots(data))

    const rating = getAgeRating(data)
    const ratingInput = document.getElementById('Rating')

    if (rating) {
        ratingInput.value = rating.value
        ratingInput.closest('tr').firstElementChild
            .insertAdjacentHTML('beforeend', `<span style="color: #d6c9b6;display: block;">Source: ${rating.board}</span>`)
    } else {
        ratingInput.value = 13
    }

    const parseSteamLanguage = unsafeWindow?.GetLanguagesFromSteam?.parseSteamLanguage // from Get Languages From Steam script
    if (parseSteamLanguage && GM_getValue('get_languages') && !document.getElementById('empty_group').checked) {
        parseSteamLanguage(data.supported_languages)
    }

    $("#title").val(data.name)
    $("#gameswebsiteuri").val(data.website)

    const coverInput = document.querySelector("input[name='image']")
    getCover(data).then(cover => {
        coverInput.value = cover.url
        if (!cover.isBig) {
            coverInput.insertAdjacentHTML('afterend', `<span style="color:yellow;">Big cover could not be found. Until a way to retrieve it for newer games is found, take the <a href=https://steamdb.info/app/${data.steam_appid}/info target="_blank">library_capsule_2x link</a></span>`)
        }
    })

    if (data.metacritic) {
        $("#meta").val(data.metacritic.score)
        $("#metauri").val(data.metacritic.url.split("?")[0] + "/critic-reviews")
    }

    $("#trailer").val(getTrailer(data))
}

/**
 * @param {string} id
 * @return {Promise<SteamAppDetails>} result
 */
async function getAppDetails(id) {
    return (await GM.xmlHttpRequest({
        method: "GET",
        url: "https://store.steampowered.com/api/appdetails?l=en&appids=" + id,
        responseType: "json",
    })).response[id].data
}

function getTrailer(data) {
    return data.movies?.find(m => m.dash_av1)?.dash_av1.split("?")[0] ?? ""
}

/** @returns {Promise<{url: string, isBig: boolean}>} */
async function getCover(data) {
    return GM.xmlHttpRequest({
        method: "GET",
        url: "https://steamcdn-a.akamaihd.net/steam/apps/" + data.steam_appid + "/library_600x900_2x.jpg",
        responseType: "json",
    }).then(res => {
        return res.status === 200
            ? {url: res.finalUrl, isBig: true}
            : {url: data.header_image.split("?")[0], isBig: false}
    })
}

function getDesc(data, shouldFormat) {
    const lowerCase = platform.toLowerCase()
    const key = (lowerCase === 'windows' ? 'pc' : lowerCase) + '_requirements'
    let srObj = data[key]
    if (!srObj) srObj = data.pc_requirements
    const desc = html2bb(createDescription(data.about_the_game,
        srObj.minimum + (srObj.recommended ? '\n' + srObj.recommended : '')))

    return shouldFormat ? formatAll(desc, data.name) : desc
}

function getYear(data) {
    return data.release_date.date.split(", ").pop()
}

function getScreenshots(data) {
    return data.screenshots.map(s => s.path_full.split("?")[0])
}

/**
 * @param {SteamAppDetails} data
 * @returns {{value: number, board: string}|null}
 */
function getAgeRating(data) {
    const ratings = data.ratings
    if (!ratings) return null

    const ratingMap = new Map([
        ['pegi', new Map([
            ['3', 1],
            ['7', 3],
            ['12', 5],
            ['16', 7],
            ['18', 9],
        ])],
        ['esrb', new Map([
            ['e', 1],
            ['e10', 3],
            ['t', 5],
            ['m', 7],
            ['ao', 9],
        ])],
        ['nzoflc', new Map([
            ['g', 1],
            ['r13', 7],
            ['r16', 7],
            ['r18', 9],
        ])],
        ['cero', new Map([
            ['a', 1],
            ['b', 3],
            ['c', 5],
            ['d', 7],
            ['z', 9],
        ])],
        ['csrr', new Map([ // gsrr?
            ['g', 1],
            ['p', 3],
            ['pg12', 5],
            ['pg15', 7],
            ['r', 9],
        ])],
        ['usk', new Map([
            ['0', 1],
            ['6', 3],
            ['12', 5],
            ['16', 7],
            ['18', 9],
        ])],
        ['steam_germany', new Map([
            ['0', 1],
            ['6', 3],
            ['10', 5],
            ['12', 5],
            ['16', 7],
            ['18', 9],
        ])],
    ])

    for (const [board, map] of ratingMap) {
        if (Object.hasOwn(ratings, board)) {
            return {value: map.get(ratings[board].rating), board}
        }
    }
}

function html2bb(str) {
    if (!str) return ""
    str = str.replace(/<video[^>]*>.*?<\/video>/g, "")
    str = str.replace(/<picture>.*?<\/picture>/g, "")
    str = str.replace(/<(.*?) class="bb_img_ctn">.*?<\/\1>/g, "")
    str = str.replace(/<h2[^>]*> *<strong>(.*?)<\/strong> *<\/h2>/g, "<h2>$1</h2>")
    str = str.replace(/<li><p class="bb_paragraph">/g, "\n[*]")
    str = str.replace(/<p[^>]*><strong>/g, "\n[b]")
    str = str.replace(/<\/div>/g, "")
    str = str.replace(/<div[^>]*>/g, "")
    str = str.replace(/< *br *\/*>/g, "\n\n")
    str = str.replace(/< *b *>/g, "[b]")
    str = str.replace(/< *\/ *b *>/g, "[/b]")
    str = str.replace(/< *u *>/g, "[u]")
    str = str.replace(/< *\/ *u *>/g, "[/u]")
    str = str.replace(/< *i *>/g, "[i]")
    str = str.replace(/< *\/ *i *>/g, "[/i]")
    str = str.replace(/<strong><\/strong>/g, " ")
    str = str.replace(/< *strong *>/g, "[b]")
    str = str.replace(/< *\/ *strong *>/g, "[/b]")
    str = str.replace(/< *em *>/g, "[i]")
    str = str.replace(/< *\/ *em *>/g, "[/i]")
    str = str.replace(/< *\/ *li *>/g, "")
    str = str.replace(/< *ul *class=\\*"bb_ul\\*" *>/g, "")
    str = str.replace(/< *\/ *ul *>/g, "")
    str = str.replace(/< *h2 *class="bb_tag".*?>/g, "\n[align=center][b][u]")
    str = str.replace(/< *h[12] *>/g, "\n[align=center][b][u]")
    str = str.replace(/< *\/ *h[12] *>/g, "[/u][/b][/align]\n")
    str = str.replace(/&quot;/g, "\"")
    str = str.replace(/&amp;/g, "&")
    str = str.replace(/< *a [^>]*>/g, "")
    str = str.replace(/<p[^>]*><\/p>/g, '\n\n')
    str = str.replace(/<p[^>]*>/g, '\n')
    str = str.replace(/< *li *>/g, "[*]")
    str = str.replace(/(?<!\n)\[\*]\n(.*?)/g, "\n[*]$1")
    str = str.replace(/< *\/ *a *>/g, "")
    str = str.replace(/< *p *>/g, "\n\n")
    str = str.replace(/<\/p>/g, "")
    str = str.replace(//g, "\"")
    str = str.replace(//g, "\"")
    str = str.replace(/  +/g, " ")
    str = str.replace(/< *img.*?>/g, "\n")
    str = str.replace(/\n +/g, "\n")
    str = str.replace(/\[\/b]\[\/u]\[\/align]\n\n/g, "[/b][/u][/align]\n")
    str = str.replace(/\n\n\n+/gm, "\n\n")
    str = str.replace(/\n\n\[\*]/g, "\n[*]")
    str = str.replace(/.*]\[u]\s?\[\/u]\[.*/g, "") // remove empty tags
    return str.trim()
}
