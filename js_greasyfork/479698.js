// ==UserScript==
// @name         GGn Get Languages From Steam
// @version      8
// @description  Easily get languages from Steam. Edited from "GGn Steam Language BBCode quick copy".
// @author       lucianjp, ingts
// @match        https://gazellegames.net/torrents.php?action=editgroup*
// @match        https://gazellegames.net/torrents.php?id=*
// @match        https://gazellegames.net/upload.php*
// @match        https://store.steampowered.com/app/*
// @match        https://web.archive.org/*/store.steampowered.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @connect      store.steampowered.com
// @namespace https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/479698/GGn%20Get%20Languages%20From%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/479698/GGn%20Get%20Languages%20From%20Steam.meta.js
// ==/UserScript==

const text_only = true
const auto_get = true
const use_language_codes = false
const uppercase_language_codes = false
const bold_list = false
const delimiter = ', '

const globals = unsafeWindow.GetLanguagesFromSteam = {}
if (location.hostname === 'store.steampowered.com' || location.hostname === 'web.archive.org')
    steamButton()
if (location.href.endsWith('upload.php') && GM_getValue('steam', null))
    GM_deleteValue('steam')

if (auto_get && location.href.includes('torrents.php?id=')) {
    GM_deleteValue('steam')
    const steamLink = document.querySelector('a[title=Steam]')
    if (steamLink)
        GM_setValue('steam', /\d+/.exec(steamLink.href)[0])
}

const langSelect = document.getElementById('language')
if (location.href.includes('upload')) {
    ggn_upload()
}

function steamButton() {
    const $btn = document.createElement('a')
    const text = 'Copy BBCode'
    $btn.classList.add('btnv6_blue_hoverfade', 'btn_small')
    const $text = $btn.appendChild(document.createElement('span'))
    $text.innerHTML = `${text}<img src="https://ptpimg.me/sx226x.png">`
    $btn.addEventListener('click', function () {
        GM_setClipboard(globals.parseSteamLanguage(null), 'text')
        $text.childNodes[0].nodeValue = 'copied'
        setTimeout(function () {
            $text.childNodes[0].nodeValue = text
        }, 3000)
    })

    const $container = document.querySelector('table.game_language_options').closest('.block').querySelector('.block_title') || document.querySelector('#LanguagesHeader')
    $container.style = 'display: flex;justify-content: space-between;align-items: center;'
    $container.appendChild($btn)
}

function ggn_upload() {
    let fetchInput = document.createElement('input')
    fetchInput.type = 'text'
    fetchInput.placeholder = "Steam Link or ID"
    langSelect.after(fetchInput)
    fetchInput.onblur = () => {
        getSteamLanguages(/\d+/.exec(fetchInput.value)).catch(() => {
            fetchInput.value = 'Failed to get languages'
            fetchInput.style.color = 'red'
            fetchInput.disabled = true
        })
    }
    if (auto_get) {
        setTimeout(() => { // to support Reuploader script so it won't add languages again
            if (!document.getElementById('release_desc').value) {
                const savedID = GM_getValue('steam', null)
                if (savedID) {
                    fetchInput.value = savedID
                    fetchInput.dispatchEvent(new Event('blur'))
                    GM_deleteValue('steam')
                }
            }
        }, 500)
    }
}

function getSteamLanguages(steamId) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: "https://store.steampowered.com/api/appdetails?l=en&appids=" + steamId,
            method: 'GET',
            responseType: "json",
            onload: function (response) {
                if (response.status === 200 && response.response[steamId].success) {
                    resolve(globals.parseSteamLanguage(response.response[steamId].data.supported_languages))
                } else reject()
            }
        })
    })
}

globals.parseSteamLanguage = function (supported_languages) {
    const langCodes = new Map([
        ["Afrikaans", "af"],
        ["Albanian", "sq"],
        ["Amharic", "am"],
        ["Arabic", "ar"],
        ["Armenian", "hy"],
        ["Assamese", "as"],
        ["Azerbaijani", "az"],
        ["Bangla", "bn"],
        ["Basque", "eu"],
        ["Belarusian", "be"],
        ["Bulgarian", "bg"],
        ["Bosnian", "bs"],
        ["Simplified Chinese", "zh-cn"],
        ["Traditional Chinese", "zh-tw"],
        ["Catalan", "ca"],
        ["Croatian", "hr"],
        ["Czech", "cs"],
        ["Danish", "da"],
        ["Dutch", "nl"],
        ["English", "en"],
        ["Estonian", "et"],
        ["Filipino", "tl"],
        ["Farsi", "fa"],
        ["Finnish", "fi"],
        ["French", "fr"],
        ["German", "de"],
        ["Greek", "el"],
        ["Hebrew", "he"],
        ["Hausa", "ha"],
        ["Hindi", "hi"],
        ["Hungarian", "hu"],
        ["Icelandic", "is"],
        ["Igbo", "ig"],
        ["Indonesian", "id"],
        ["Irish", "ga"],
        ["Italian", "it"],
        ["Japanese", "ja"],
        ["Kannada", "kn"],
        ["Korean", "ko"],
        ["Kazakh", "kk"],
        ["Khmer", "km"],
        ["Kurdish", "ku"],
        ["Kinyarwanda", "rw"],
        ["Kyrgyz", "ky"],
        ["Latvian", "lv"],
        ["Lithuanian", "lt"],
        ["Luxembourgish", "lb"],
        ["Macedonian", "mk"],
        ["Malay", "ms"],
        ["Malayalam", "ml"],
        ["Maltese", "mt"],
        ["Mongolian", "mn"],
        ["Maori", "mi"],
        ["Nepali", "ne"],
        ["Odia", "or"],
        ["Norwegian", "no"],
        ["Persian", "fa"],
        ["Quechua", "qu"],
        ["Polish", "pl"],
        ["Portuguese - Brazil", "pt-br"],
        ["Portuguese", "pt"],
        ["Punjabi", "pa"],
        ["Scots", "gd"],
        ["Romanian", "ro"],
        ["Russian", "ru"],
        ["Serbian", "sr"],
        ["Slovak", "sk"],
        ["Slovenian", "sl"],
        ["Sorbian", "sb"],
        ["Sotho", "st"],
        ["Swahili", "sw"],
        ["Spanish - Spain", "es"],
        ["Spanish - Latin America", "es-la"],
        ["Swedish", "sv"],
        ["Thai", "th"],
        ["Tajik", "tg"],
        ["Tamil", "ta"],
        ["Tatar", "tt"],
        ["Telugu", "te"],
        ["Tsonga", "ts"],
        ["Tigrinya", "ti"],
        ["Tswana", "tn"],
        ["Turkmen", "tk"],
        ["Turkish", "tr"],
        ["Ukrainian", "ua"],
        ["Uyghur", "ug"],
        ["Urdu", "ur"],
        ["Uzbek", "uz"],
        ["Venda", "ve"],
        ["Vietnamese", "vi"],
        ["Welsh", "cy"],
        ["Wolof", "wo"],
        ["Xhosa", "xh"],
        ["Yoruba", "yo"],
        ["Yiddish", "ji"],
        ["Zulu", "zu"],
    ])

    const languages = {Subtitles: []}
    if (supported_languages) {
        for (const str of supported_languages.replace(/<br>.*$/, '').split(', ')) {
            const lang = str.replace("<strong>*<\/strong>", '')
            if (str.includes('*')) {
                if (!languages['Full Audio']) {
                    languages['Full Audio'] = []
                }
                languages['Full Audio'].push(lang)
            }
            languages['Subtitles'].push(lang)
        }
    } else {
        const table = document.querySelector('table.game_language_options')
        for (let r = 0; r < table.rows.length; r++) {
            for (let c = 0; c < table.rows[r].cells.length; c++) {
                const cell = table.rows[r].cells[c]
                if (cell.textContent.trim() === '✔' || cell.firstElementChild?.nodeName === 'IMG') {
                    let header = table.rows[0].cells[c].textContent.trim()
                    if (!languages[header]) {
                        languages[header] = []
                    }
                    languages[header].push(table.rows[r].cells[0].textContent.trim())
                }
            }
        }
    }

    if (text_only) delete languages['Full Audio']
    let textLanguages = languages['Subtitles']?.length > 0 ? languages['Subtitles'] : languages['Interface']
    let audioLanguages = languages['Full Audio']

    const textMulti = textLanguages.length > 1 ? 's' : ''
    const audioMulti = audioLanguages && audioLanguages.length > 1 ? 's' : ''

    let langSelectValue
    if (supported_languages) {
        const languageList = [
            'English',
            'German',
            'French',
            'Czech',
            'Italian',
            'Japanese',
            'Korean',
            'Polish',
            'Portuguese',
            'Russian',
            'Spanish',
        ]
        const inLangList = !textMulti && languageList.some(lang => textLanguages[0].includes(lang))
        langSelectValue = textMulti ? 'Multi-Language' : inLangList ? textLanguages[0] : 'Other'
    }

    if (use_language_codes) {
        textLanguages = textLanguages.map(l => {
            const code = langCodes.get(l)
            if (code) {
                return uppercase_language_codes ? code.toUpperCase() : code
            } else return l
        })
        if (audioLanguages) {
            audioLanguages = audioLanguages.map(l => {
                const code = langCodes.get(l)
                if (code) {
                    return uppercase_language_codes ? code.toUpperCase() : code
                } else return l
            })
        }
    }

    const joinedText = textLanguages.join(delimiter)
    const joinedAudio = audioLanguages && audioLanguages.join(delimiter)

    function bold(str) {
        const lines = str.split("\n")
        const result = []
        for (const line of lines) {
            const [category, list] = line.split(": ")
            result.push(bold_list ? `${category}: [b]${list}[/b]` : `[b]${category}[/b]: ${list}`)
        }
        return result.join("\n")
    }

    if (supported_languages) {
        let description
        if (!textMulti && (textLanguages[0].includes('Chinese') || textLanguages[0].includes('ZH'))) {
            langSelectValue = 'Chinese'
            if (audioLanguages && areSame(textLanguages, audioLanguages)) {
                description = bold(`Text and Audio Language${textMulti}: ${joinedText}`)
            } else {
                description = audioLanguages
                    ? bold(`Text Language: ${joinedAudio}\nAudio Language${audioMulti}: ${joinedAudio}`)
                    : bold(`Language: ${joinedText}`)
            }
        } else if (audioLanguages && areSame(textLanguages, audioLanguages)) {
            description = bold(`Text and Audio Language${textMulti}: ${joinedText}`)
        } else {
            const addText = textMulti ? `Languages: ${joinedText}` : '' // add nothing if there's only 1 language
            description = audioLanguages
                ? bold(`${addText ? 'Text ' + addText + '\n' : ''}Audio Language${audioMulti}: ${joinedAudio}`)
                : addText ? bold(addText) : ''
        }

        langSelect.value = langSelectValue
        document.getElementById('release_desc').value += description
        return
    }

    if (audioLanguages) {
        if (areSame(textLanguages, audioLanguages))
            return bold(`Text and Audio Language${textMulti}: ${joinedText}`)
        return bold(`Text Language${textMulti}: ${joinedText}\nAudio Language${audioMulti}: ${joinedAudio}`)
    }
    return bold(`Language${textMulti}: ${joinedText}`)
}

function areSame(array1, array2) {
    return array1.length === array2.length && array1.sort().every((value, index) => value === array2.sort()[index])
}