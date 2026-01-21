// ==UserScript==
// @name         GGn Steam Uploady
// @namespace    https://gazellegames.net/
// @version      49
// @description  Fill upload form with Steam info
// @author       ingts
// @match        https://gazellegames.net/upload.php*
// @match        https://gazellegames.net/torrents.php?action=editgroup*
// @match        https://steamdb.info/app/*
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @connect      *
// @require      https://update.greasyfork.org/scripts/548332/1738389/GGn%20Uploady.js
// @require      https://update.greasyfork.org/scripts/540511/1737488/GGn%20Formatters.js
// @downloadURL https://update.greasyfork.org/scripts/479713/GGn%20Steam%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/479713/GGn%20Steam%20Uploady.meta.js
// ==/UserScript==

const allowedTags = new Set([
    // "Casual", allowed but too common
    // "Exploration", allowed but too common
    "2D",
    "2.5D",
    "3D",
    "Anime",
    "Adventure",
    "Aliens",
    "Alternate History",
    "Creature Collector",
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
    "Vehicular Combat",
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
    "Satire",
    "Gambling",
    "Fishing",
    "Auto Battler",
    "Solitaire",
    "Hunting",
    "Grand Strategy",
    "Space Sim",
    "Female Protagonist",
    "Quick-Time Events",
    "Time Travel",
    "Real-Time",
    "Surreal",
    "Procedural Generation",
    "Post-apocalyptic",
    "Martial Arts",
    "Otome",
    "Trains",
    "Dinosaurs",
    "Naval",
    "Villain Protagonist",
    "Boss Rush",
    "Pirates",
    "Tanks",
    "Hacking",
    "Sokoban",
    "Western",
    "Werewolves",
    "Mars",
    "Cats",
    "Dystopian",
    "Party",
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
    ["Party Game", ["party"]],
    ["Football (American)", ["american.football"]],
    ["Football (Soccer)", ["soccer"]],
    ["Top-Down Shooter", ["top.down", "shooter"]],
    ["Twin Stick Shooter", ["twin.stick", "shooter"]],
    ["Cyberpunk", ["cyberpunk", "dystopian"]],
    ["LGBTQ+", ["lgbtq.characters"]],
    ["Political", ["politics"]],
    ["Political Sim", ["politics", "simulation"]],
    ["Open World Survival Craft", ["open.world", "survival", "crafting"]],
    ["Hex Grid", ["hexagonal.grid"]],
    ["Ninja", ["ninjas"]],
    ["Minigames", ["mini.games"]],
    ["Naval Combat", ["naval", "vehicular.combat"]],
    ["On-Rails Shooter", ["rail.shooter"]],
    ["Turn-Based Combat", ["turn.based"]],
    ["Real Time Tactics", ["real.time, tactics"]],
])

const settings = loadSettings({
    get_languages: true,
    extra_info: 'steamdb'
})

let platform = ''
const coverInput = document.querySelector("input[name='image']")

if (location.hostname === "steamdb.info"
    && GM_getValue('checking_steamdb', false)
    && document.getElementById('info')
) {
    const aliasesEls = document.evaluate("//td[contains(text(),'name_localized')]/following-sibling::td[1]/table/tbody/tr/td[2]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
    const aliases = []
    for (let i = 0; i < aliasesEls.snapshotLength; i++) {
        aliases.push(aliasesEls.snapshotItem(i).textContent)
    }

    GM_setValue('steamdb_info', {
        aliases: aliases,
        cover2x: document.querySelector('a[href*="library_capsule_2x.jpg"]')?.href,
        name: document.querySelector('h1').textContent
    })
}

if (location.href.includes('upload.php')) {
    document.querySelector("#groupinfo a[href*='forums.php']").textContent = "Steam URL or ID"
    const steamIdInput = document.getElementById('steamid')
    steamIdInput.type = 'text'
    steamIdInput.size = 20
    steamIdInput.removeAttribute('min')
    steamIdInput.insertAdjacentHTML('afterend',
        '<a href="javascript:;" id="fill_win">Win</a> <a href="javascript:;" id="fill_lin">Lin</a> <a href="javascript:;" id="fill_mac">Mac</a>')

    const platformInput = document.getElementById('platform')
    document.getElementById('fill_win').onclick = () => {
        platformInput.value = "Windows"
        platformClick()
    }
    document.getElementById('fill_lin').onclick = () => {
        platformInput.value = "Linux"
        platformClick()
    }
    document.getElementById('fill_mac').onclick = () => {
        platformInput.value = "Mac"
        platformClick()
    }

    function platformClick() {
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

        getExtraInfo(appid).then(({aliases, cover2x}) => {
            document.querySelector('input[name=aliases]').value = joinAliases(aliases)
            if (cover2x)
                coverInput.value = cover2x
        })

        GM.xmlHttpRequest({
            url: `https://store.steampowered.com/app/${steamIdInput.value}`,
            headers: {'Cookie': 'wants_mature_content=1; birthtime=-63140399; lastagecheckage=1-January-1968',},
        }).then(res => {
            const doc = res.responseXML
            const uploadTags = new Set()

            for (const steamTag of doc.querySelectorAll('.glance_tags a')) {
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

            if (doc.evaluate("//h2[text()='AI Generated Content Disclosure']", doc.body,
                null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
                uploadTags.add('ai.generated.art')
            }

            if (uploadTags.has('roguelite'))
                uploadTags.delete('roguelike')

            document.querySelector('input[name="tags"]').value = Array.from(uploadTags).join(', ')
            if (uploadTags.has('adult'))
                document.getElementById('Rating').value = 9
        })
    }
} else {
    platform = document.getElementById('user_script_data').dataset.platform

    createFiller('steamuri', /\d+/, async (id) =>
        ({...await getAppDetails(id), ...await getExtraInfo(id)}), {
        getAliases: r => r.aliases,
        getYear: getYear,
        getAgeRating: r => getAgeRating(r)?.value,
        getDescription: r => getDesc(r, true),
        getScreenshots: getScreenshots,
        getTitle: r => r.name,
        getCover: r => r.cover2x ?? getCover(r).then(res => res.url),
        getTrailer: getTrailer
    })
}

function cleanAliases(name, aliases) {
    if (aliases?.length < 1) return []
    const nameRegexp = new RegExp(`${RegExp.escape(name)}`, 'i')
    return aliases
        .map(a => a.replace(nameRegexp, '')
            .trim()
            .replace(/[()]|^-\s*/g, ''))
        .filter(Boolean)
}

async function getExtraInfo(appid) {
    if (settings.extra_info === null) return {}
    const usingSteamdb = settings.extra_info === 'steamdb'

    return (usingSteamdb ? new Promise(resolve => {
        GM_deleteValue('steamdb_info')
        GM_setValue('checking_steamdb', 1)

        const tab = GM_openInTab(`https://steamdb.info/app/${appid}/info`)
        const listener = GM_addValueChangeListener('steamdb_info', (key, oldValue, newValue) => {
            GM_removeValueChangeListener(listener)
            tab.close()
            GM_deleteValue('checking_steamdb')
            resolve(newValue)
        })
    }) : GM.xmlHttpRequest({
        url: settings.extra_info + appid,
        responseType: "json"
    })).then(res => {
        const {name, aliases, cover2x} = (usingSteamdb ? res : res.response) ?? {}
        return {
            aliases: cleanAliases(name, aliases),
            cover2x: cover2x
        }
    })
}

/** @param {SteamAppDetails} data */
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
    if (parseSteamLanguage && settings.get_languages && !document.getElementById('empty_group').checked) {
        parseSteamLanguage(data.supported_languages)
    }

    $("#title").val(data.name)
    $("#gameswebsiteuri").val(data.website)

    if (!coverInput.value) {
        setTimeout(() => getCover(data).then(cover => {
            if (coverInput.value) return
            coverInput.value = cover.url
            if (!cover.isBig && settings.extra_info === null) { // the cover from extra info should have been set by now and if not, it doesn't exist so don't show the warning
                coverInput.insertAdjacentHTML('afterend', `<span style="color:yellow;">Big cover could not be found. Until a way to retrieve it for newer games is found, take the <a href=https://steamdb.info/app/${data.steam_appid}/info target="_blank">library_capsule_2x link</a></span>`)
            }
        }), 2500)
    }

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

function loadSettings(defaults) {
    for (const [key, value] of Object.entries(defaults)) {
        let gmValue = GM_getValue(key)
        if (typeof gmValue === 'undefined') {
            GM_setValue(key, value)
            continue
        }
        defaults[key] = gmValue
    }
    return defaults
}