// ==UserScript==
// @name         GGn Formatters
// @version      45
// @description  Formatters
// @author       ingts (some by ZeDoCaixao and letsclay)
// @match        https://gazellegames.net/
// ==/UserScript==

if (typeof RegExp.escape === 'undefined') { // temporary
    RegExp.escape = function (s) {
        return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
    }
}

let destructiveEditsEnabled = false
const isEditPage = location.href.includes("action=editgroup")

/**
 * @param {string} str
 * @param {string=} alias
 * @returns {string}
 */
function formatTitle(str, alias) {
    if (!str) return ''

    const japaneseLowercase = new Map([
        ["ga", ["が", "ガ"]],
        ["no", ["の", "ノ"]],
        ["wa", ["わ", "ワ"]],
        ["mo", ["も", "モ"]],
        ["kara", ["から", "カラ"]],
        ["made", ["まで", "マデ"]],
        ["to", ["と", "ト"]],
        ["yo", ["よ", "ヨ"]],
        ["ka", ["か", "カ"]],
        ["ya", ["や", "ヤ"]],
        ["de", ["で", "デ"]],
        ["ni", ["に", "ニ"]],
        ["so", ["そ", "ソ"]],
        ["na", ["な", "ナ"]],
        ["i", ["い", "イ"]],
        ["u", ["う", "ウ"]],
        ["e", ["え", "エ"]],
        ["o", ["お", "オ"]],
        ["wo", ["を", "ヲ"]],
        ["san", ["さん"]],
        ["sama", ["さま", "様"]],
        ["kun", ["くん"]],
        ["chan", ["ちゃん"]],
        ["de", ["で", "デ"]],
        ["ne", ["ね", "ネ"]],
        ["sa", ["さ", "サ"]],
        ["ba", ["ば", "バ"]],
        ["demo", ["でも", "デモ"]],
    ])

    const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i
    const alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/
    const wordSeparators = /([ :–—-]|[^a-zA-Z0-9'’])/
    const allUppercaseWords = ['RPG', 'FPS', 'TPS', 'RTS', 'TBS', 'MMO', 'MMORPG', 'ARPG', 'JRPG', 'PVP', 'PVE', 'NTR', 'NPC', 'OST', 'MILF', 'VR']
    const uppercaseRegex = new RegExp(`^[A-Z]{2}$|${allUppercaseWords.join('|')}`)
    return str
        .replace(/\s/g, ' ')
        .replace(/ -(.*)- /, ': $1 ')
        .replace('—', ' - ')
        .replace(/ ?~$/, '')
        .replace(/-$/, '')
        .replace(/^-/, '')
        .replace(/ ~ ?/, ': ')
        .replace(/ - ?/, ': ')
        .replace(/[™®©]/g, '')
        .replace(' : ', ': ')
        .trim()
        .split(wordSeparators)
        .map((current, index, array) => {
            const isSmallWord = smallWords.test(current)
            if ((uppercaseRegex.test(current) && !isSmallWord) || /\b([IVX])(X{0,3}I{0,3}|X{0,2}VI{0,3}|X{0,2}I?[VX])(?![A-Za-z'])\b/i.test(current)) {
                return current.toUpperCase()
            }

            // if the current word has an uppercase letter after 2 lowercase letters, assume it should just be like that
            if (!/\w[a-z]{2}[A-Z]/.test(current)) current = current.toLowerCase()

            const firstOrLastWord = index === 0 || index === array.length - 1

            if (alias && !firstOrLastWord) {
                const jpWords = japaneseLowercase.get(current)
                if (jpWords?.some(w => alias.includes(w))) return current
            }

            if (
                /* Check for small words */
                isSmallWord &&
                /* Ignore first and last word */
                !firstOrLastWord &&
                /* Ignore title end and subtitle start */
                array[index - 3] !== ':' &&
                array[index + 1] !== ':' &&
                /* Ignore small words that start a hyphenated phrase */
                (array[index + 1] !== '-' ||
                    (array[index - 1] === '-' && array[index + 1] === '-'))
            ) {
                return current
            }
            /* Capitalize the first letter */
            return current.replace(alphanumericPattern, match => match.toUpperCase())
        })
        .join('')
}

const headersMap = new Map([
    ["aboutGame", "[align=center][b][u]About the game[/u][/b][/align]\n"],
    ["features", "\n[align=center][b][u]Features[/u][/b][/align]"],
    ["sysReqs", "\n\n[quote][align=center][b][u]System Requirements[/u][/b][/align]\n"],
    ["minimumReqs", "\n[b]Minimum[/b]"],
    ["recommendedReqs", "\n[b]Recommended[/b]"],
    ["os", "\n[*][b]OS[/b]: "],
    ["processor", "\n[*][b]Processor[/b]: "],
    ["memory", "\n[*][b]Memory[/b]: "],
    ["storage", "\n[*][b]Storage[/b]: "],
    ["graphics", "\n[*][b]Graphics[/b]: "],
    ["soundcard", "\n[*][b]Sound Card[/b]: "],
    ["directX", "\n[*][b]DirectX[/b]: "],
    ["additionalnotes", "\n[*][b]Additional Notes[/b]: "],
    ["other", "\n[*][b]Other[/b]: "],
    ["network", "\n[*][b]Network[/b]: "],
    ["drive", "\n[*][b]Drive[/b]: "],
    ["controllers", "\n[*][b]Controllers[/b]: "],
])

/**
 * @param {string} str
 * @param {string=} gameTitle
 * @returns {string}
 */
function formatAbout(str, gameTitle) {
    if (!str) return ""

    const aboutHeader = headersMap.get("aboutGame")
    const aboutGameRegex = /^(\[size=3])?\n?(\[(b|u|i|align=center)]\n?){0,4}(About\sthe\sGame|About\sThis\sGame|What\sis\sThis\sGame\?|About|Description)\s*:?(\n*\[\/(b|u|i|align|size)]){0,4}(\s*:|:|)/i
    str = str.replace(aboutGameRegex, aboutHeader)

    let [_, about, reqs] = new RegExp(`(?:${RegExp.escape(aboutHeader)})?(.*?)(\\[quote].*|$)`, 's').exec(str)

    about = about.trim()
    about = about.replace(/^\[align=.*?](.*)\[\/align]$/s, '$1')
    about = about.replace(/\bdefence\b/g, 'defense')
    about = about.replace(/ *\/ */g, '/')

    // Replace different list symbols with [*]
    about = about.replace(/^\s*[-•◦■・★*]\s*/gm, '[*]')

    // If a line starts with [*] followed by a [u] or [i], replace them with [b]
    about = about.replace(/^\[\*]\[[ui]](.*?)\[\/[ui]]/gm, '[*][b]$1[/b]')

    if (destructiveEditsEnabled) {
        // If a line is all uppercase, title case it
        about = about.split('\n').map(line => line.toUpperCase() === line ? formatTitle(line) : line).join('\n')

        // Bold text before colon in list item, change -/— to :
        about = about.replace(/\[\*](?:\[b])?(.*?)(?:\[\/b])?(?:: *| +- *| *— *)(\w)/g,
            (match, p1, p2) =>
                /\d+/.test(p1) && /\d+/.test(p2) ? match : `[*][b]${p1}[/b]: ${p2.toUpperCase()}`) // check digits to avoid aspect ratio
    }

    // bold game title. replace [u] or [i] with bold
    if (gameTitle) {
        const boldTitleRegex = new RegExp(`((?:\\[[uib]])+)?(?:${RegExp.escape(gameTitle)}|${RegExp.escape(formatTitle(gameTitle))})(?:(?:\\[\\/[uib]])+)?`, 'i')
        about = about.replace(boldTitleRegex, (match, p1) => {
            if (p1 === '[b]') return match
            return `[b]${gameTitle}[/b]`
        })
    }

    /*
        // If a line starts with [u], [i], or [b] (:), there is no other text on that line, and it contains 'features', replace tags with [align=center][b][u]
        about = about.replace(/^(\[b]|\[u]|\[i])+(.*?)(\[\/b]|\[\/u]|\[\/i])+:$/gm,
            (match, p1, p2, p3) => (p1 && p3 && /features/i.test(p2)) ? `[align=center][b][u]${p2}[/u][/b][/align]` : match)
    */

    // If a line starts with [b]text[/b]: and it is not the only text on that line, add [*] at the start and replace tags with [b]
    about = about.replace(/^\[b](.*?]:)(.*)/gm, (match, p1, p2) => {
        if (p2.trim() === '') {
            return match
        }
        return p1 ? `[*][b]${removeBbcode(p1)}${p2}` : match
    })

    // If a line starts with [*], have only one new line until the next [*] and after the last one, have a double newline
    about = fixMultiLinesInLists(about)

    /*
        // Remove double newlines between [*] lines
        about = about.replace(/(\[\*][^\n]*)(\n{2,})(?=\[\*])/g, '$1\n')

        // Add a newline when next line doesn't start with [*]
        about = about.replace(/(\[\*][^\n]*\n)([^\[*\]\n])/g, '$1\n$2')
    */

    // If the line starts with [*] and the whole line until terminal punctuation is wrapped in [u], [i], or [b], remove the wrapping tags
    about = about.replace(/^\[\*]\[([bui])](.*?)\[\/([bui])]([.?!])$/gm, "[*]$2$4")

    // If a line ends with [/align] replace double newlines with one newline
    about = about.replace(/(\[\/align])\n\n/g, '$1\n')

    // Remove colons in [align=center]
    about = about.replace(/\[align=center].*?(?:\[\/\w]:|:)\[\/align]/g,
        match => match.replace(/:/g, ''))

    if (destructiveEditsEnabled) {
        // If a line starts with [u], [i], or [b] and has only new lines after the closing tag, make it a list item and remove the new lines
        about = about.replace(/\[[uib]]([^\[]+)\[\/[uib]]:?\n+/g,
            (_, p1) => `[*][b]${p1}[/b]: `)

        // Title case text inside [align=center][b][u] and remove extra tags
        about = about.replace(/\[align=center]\[([bu])]\[([bu])]([\s\S]*?)\[\/\2]\[\/\1]\[\/align]/g,
            (match, p1, p2, p3) => `[align=center][b][u]${formatTitle(removeBbcode(p3))}[/u][/b][/align]`)
    }

    about = about.replace(/\n*\s*\[\*]\s*/g, "\n[*]")

    const regFeatures = /\n(\[size=3])?\n?(?:\[\*])?(\[(b|u|i|align=center|size=2)]\n?){0,4}(the features|Key\sFeatures|Main\sFeatures|Game\sFeatures|Other\sFeatures|Features\sof\sthe\sGame|Features|Featuring|Feautures)\s*:?\s*(\n?\[\/(b|u|i|align|size)]){0,4}\s*:/i
    const featuresHeader = headersMap.get("features")
    about = about.replace(regFeatures, featuresHeader)

    // Add features header
    about = about.replace(/(.*?)\n((?:\[\*].*\n?){3,})/g, (match, lineBefore, list) => {
        if (!lineBefore.includes('[/align]')) {
            return (/^\s+$/.test(lineBefore) ? '' : lineBefore + '\n')
                + (about.includes(featuresHeader) ? '' : featuresHeader) + '\n' + list
        }
        return match
    })

    // Add a newline before lines with [align=center] if there isn't already a double newline before it. Here after adding features header
    about = about.replace(/(?<!\n\n)(\[align=center])/g, '\n$1')

    about = about.replace(/\[\/align]\n*/gi, "[/align]\n")

    about = about.replace(/\n{2,10}/g, "\n\n")

    return aboutHeader + about + (reqs ? `\n\n${reqs}` : '')

}

function fixMultiLinesInLists(str) {
    const lines = str.split('\n')
    const result = []
    let i = 0

    while (i < lines.length) {
        const line = lines[i]

        // If line starts with [*], we're in a list section
        if (line.startsWith('[*]')) {
            const listItems = []

            // Collect all consecutive [*] items (skipping empty lines between them)
            while (i < lines.length && (lines[i].startsWith('[*]') || lines[i].trim() === '')) {
                if (lines[i].startsWith('[*]')) {
                    listItems.push(lines[i])
                }
                i++
            }

            // Add list items with single newlines between them
            result.push(...listItems)

            // Add single empty line after the list section if there's more content
            if (i < lines.length) {
                result.push('') // This creates one empty line, which with the next line creates a double newline
            }
        } else {
            // Regular line, add it
            result.push(line)
            i++
        }
    }

    return result.join('\n')
}


/**
 * @param {string} str
 * @returns {string}
 */
function formatSysReqs(str) {
    if (!str) return ""
    const sysReqsHeader = headersMap.get("sysReqs")

    let reqs = new RegExp(`${RegExp.escape(sysReqsHeader)}(.*)\\[\\/quote]`, 's').exec(str)?.[1]
    if (!reqs) return str
    const original = reqs

    const osHeader = headersMap.get("os")
    // reqs = reqs.replace(/:\n/g, "\n")
    reqs = reqs.replace(/:\[\/b]\n/g, "[/b]\n")

    if (destructiveEditsEnabled) {
        // remove + after a number
        reqs = reqs.replace(/(\d)\+/g, '$1')
        reqs = reqs.replace(/\.x/g, '')
    }

    let platform = isEditPage &&
        (document.getElementById('nexusmodsuri') ? 'Windows'
            : (document.getElementById('itunesuri') && document.getElementById('epicgamesuri')) ? 'MacOS'
                        : document.getElementById('googleplayuri') ? 'Android'
                : (document.getElementById('itunesuri') && !document.getElementById('epicgamesuri')) ? 'iOS'
                    : '')
        || document.getElementById('platform')?.value

    if (platform === 'Linux')
        platform = ''

    const minimumHeader = headersMap.get("minimumReqs")
    const recommendedHeader = headersMap.get("recommendedReqs")

    //region Section labels formatting (mostly from Description Broom)

    // Minimum
    reqs = reqs.replace(/\n*(\[\*]\[([bi])]|((\s*|)\[\*])|\[([bi])]|\*|)(\s*|)(Minimum\sSpecifications|Minimum\sSystem\sRequirements|Minimum\sRequirements|Minimum)(\s|)(:\s\[\/([bi])]|:\[\/([bi])]|\[\/([bi])]:|\[\/([bi])]|:)(?:\n*(?!\S))?/gi, minimumHeader)

    // Recommended
    reqs = reqs.replace(/\n*(\[\*]\[([bi])]|((\s*|)\[\*])|\[([bi])]|\*|)(\s*|)(Recommended\sSpecifications|Recommended\sSystem\sRequirements|Re(c|cc)o(mm|m)ended)(\s|)(:\s\[\/([bi])]|:\[\/([bi])]|\[\/([bi])]:|\[\/([bi])]|:)(?:\n*(?!\S))?/gi, recommendedHeader)

    formatSectionLabel("Supported\\sOS|OS|Operating\\sSystems|Operating\\sSystem|Mac\\sOS|System|Mac", osHeader)
    formatSectionLabel("CPU\\sType|CPU\\sProcessor|CPU|Processor", headersMap.get("processor"))
    formatSectionLabel("System\\sRAM|RAM|System\\sMemory|Memory", headersMap.get("memory"))
    formatSectionLabel("Free\\sHard\\sDisk\\sSpace|Hard\\sDrive\\sSpace|Hard\\sDisk\\sSpace|Hard\\sDisk|Free\\sSpace|Hard\\sDrive|HDD\\sSpace|HDD|Storage|Disk\\sSpace|Free\\sDisk\\sSpace|Drive\\sSpace|Available\\sHard\\sDisk\\sSpace", headersMap.get("storage"))
    formatSectionLabel("VGA|Graphics|Graphic\\sCard|GPU|Video\\sCard|Video|GFX", headersMap.get("graphics"))
    formatSectionLabel("audio\\scard|Sound\\sCard|Sound", headersMap.get("soundcard"))
    formatSectionLabel("DirectX\\sVersion|DirectX|Direct\\sX|DX", headersMap.get("directX"))
    formatSectionLabel("Additional\\sNotes|Additional|Notice|Please\\snote|Notes", headersMap.get("additionalnotes"))
    formatSectionLabel("Other\\sRequirements|Other|Peripherals", headersMap.get("other"))
    formatSectionLabel("Network|Internet", headersMap.get("network"))
    formatSectionLabel("(CD\\sDrive\\sSpeed|Disc\\sDrive|CD-ROM|DVD\\sDrive)", headersMap.get("drive"))
    formatSectionLabel("Controllers|Supported\\sJoysticks|Input", headersMap.get("controllers"))

    //endregion
    // remove duplicate Additional Notes
    let notes
    reqs = reqs.replace(new RegExp(RegExp.escape(headersMap.get("additionalnotes")) + '.*?$', 'gms'), match => {
        if (!notes) {
            notes = match
            return match
        }
        return notes.toLowerCase() === match.toLowerCase() ? '' : match
    })

    reqs = reqs.replace(/\n(.*)\n?\[\*]Requires a 64-bit.*\n?(.*)/g, (_, header, nextLine) => {
        /*
        Remove the whole section when it's like
        [b]Recommended[/b]
        [*]Requires a 64-bit processor and operating system[/quote] */
        if (!nextLine) return ''
        return `\n${header ? `${header}\n` : ''}${nextLine}` + (nextLine.includes('OS') && !nextLine.includes('64') ? ' (64-bit)' : '')
    })

    reqs = reqs.replace(/intel/gi, 'Intel')
    reqs = reqs.replace(/amd/gi, 'AMD')
    if (destructiveEditsEnabled) {
        reqs = reqs.replace(/(?:\s*,\s*|\s+)x64/gi, " (64-bit)")
        reqs = reqs.replace(/\s+\(?64.?bit\)?/gi, " (64-bit)")
    }

    // has minimum but no recommended, replace the minimum with new line
    if (reqs.includes(minimumHeader) && !reqs.includes(recommendedHeader)) {
        reqs = reqs.replace(minimumHeader + '\n', "")
    }

    reqs = reqs.replace(/OS \*/g, 'OS')

    // uppercase unit and remove +
    reqs = reqs.replace(/(\d+)\s?([kmg]b)\+?/gi, (match, p1, p2) => `${p1} ${p2.toUpperCase()}`)

    // add space between at least 2 letters then a number
    reqs = reqs.replace(/([a-zA-Z]{2,})(\d)/g, '$1 $2')
    reqs = reqs.replace(/,? *(?:or|and) +(?:up|better|greater|higher|over|more|later|newer|above|faster|similar|equal|equivalent|comparable)/gi, '')
    reqs = reqs.replace(/ *\(\)/g, '') // leftover empty brackets from the above because it needs to handle (or better) or (3 GHz or greater / 6 cores or greater)
    reqs = reqs.replace(/ *以上/g, '')

    // convert to next unit if divisible by 1024
    reqs = reqs.replace(/(\d+)\s*([KM]B)/gi, (match, num, unit) => {
        const intNum = parseInt(num)

        if (intNum % 1024 === 0) {
            return unit === 'KB' ? `${intNum / 1024} MB` : unit === 'MB' ? `${intNum / 1024} GB` : match
        }
        return match
    })

    if (platform === 'Android' || platform === 'iOS') {
        // add the OS label if missing
        reqs = reqs.replace(/^(?:android|ios)? *(\d.*)/i,
            osHeader.replace('\n', '') + platform + ' ' + '$1')
    }

    formatSection('OS', match => {
        match = match.replace(/,? *\(?:?32.*64.?bit\)? ?/gi, '') // both bits written, remove all
        match = match.replace(/\s+\(32.?bit\)/gi, "")
        match = match.replace(/ *home/gi, '')
        match = match.replace(/^(\d|vista)/i, `${platform ? platform + ' ' : ''}$1`)
        match = match.replace(/^ *\(?64-bit\)?\s?(.*)/g, "$1 (64-bit)")
        match = match.replace(/(?:Microsoft\s?)?Win(?:dows)?/gi, 'Windows')
        match = match.replace(/macos/gi, "macOS")
        match = replaceWithSlash(match)
        match = match.replace(/ *\/ */g, '/')

        // Remove repeated OS names
        let name = ''
        match = match.replace(/[a-zA-Z]+ /g, match => {
            if (!name) {
                name = match
                return match
            }
            return match.toLowerCase() === name.toLowerCase() ? '' : match
        })

        return match
    })

    formatSection('Processor', match => {
        match = match.replace(/ryzen/gi, 'Ryzen')
        match = match.replace(/core/gi, 'Core')
        match = match.replace(/(?<!intel )pentium/gi, 'Intel Pentium')
        match = match.replace(/pentium(\w)/gi, 'Pentium $1')
        match = match.replace(/(?<!intel )celeron/gi, 'Intel Celeron')
        match = match.replace(/(?<!amd )(opteron|phenom|athlon|sempron|turion)/gi, (_, p1) => `AMD ${toSentenceCase(p1)}`)
        match = match.replace(/(.*?)-core/gi, '$1 Core')

        match = match.replace(/(\d\.?\d?)\s?(\w)hz/gi,
            (match, p1, p2) => `${p1} ${p2.toUpperCase()}Hz`)
        match = match.replace(/core with (.*)Hz/gi, 'Core $1Hz')

        if (destructiveEditsEnabled) {
            match = match.replace(/ *processor */gi, '')
            match = match.replace(/(?:intel )?core *2 *(Solo|Duo|Quad|Extreme)/gi, (match, p1) =>
                `Intel Core 2 ${toSentenceCase(p1)}`)

            match = match.replace(/(\w+-? *)Core ?(?:intel )?i(\d)/gi, (m, p1, p2) => {
                if (p1.toLowerCase().trim() !== 'intel') return `${p1} Core Intel Core i${p2}` // keep the cores quantifier e.g. Quad Core/4-Core
                return m
            })

            match = match.replace(/^(\d\.?\d? .Hz),? (.+ core)$/gi, (match, hz, cores) => cores + ' ' + hz)
            match = match.replace(/(?:intel )?(?:core *)?i(\d)(?: *- *(\d+)(\w)?)?/gi, // no space i(\d) so that Pentium II+ won't change
                (_, gen, model, suffix) => `Intel Core i${gen}${model ? `-${model}` : ''}${suffix ? suffix.toUpperCase() : ''}`)

            match = replaceWithSlash(match)

            // if all Hz are the same, put it after a comma at the end
            const hzRegex = / \d\.?\d? \wHz/g
            const hzMatches = [...match.matchAll(hzRegex)]
            if (hzMatches.length > 1 && hzMatches.every(arr => arr[0] === hzMatches[0][0])) {
                for (const hzMatch of hzMatches) {
                    match = match.replace(hzMatch[0], '')
                }
                match = match + `, ${hzMatches[0][0]}`
            }
        }

        match = match.replace(/(\d)\/([a-zA-Z])/g, '$1 / $2')

        return match
    })

    formatSection('Memory', match => {
        return match.replace(/([kmg])B(?: ?ram)?/i, '$1B RAM')
    })
    formatSection('Storage', match => {
        return match.replace(/hd(?!d)/i, 'HDD')
    })

    formatSection('Graphics', match => {
        match = match.replace(/(?<!V)RAM|memory/gi, 'VRAM')

        if (destructiveEditsEnabled) {
            match = match.replace(/(?<!nvidia )geforce/gi, 'Nvidia GeForce')
            match = match.replace(/(?:nvidia )?(?:geforce )?([rg]tx) ?(\d+)/gi,
                (_, tx, num) => `Nvidia GeForce ${tx.toUpperCase()} ${num}`)

            match = match.replace(/graphics card with (.*?)\s?(?:of)? V?RAM/gi, '$1 VRAM')
            match = match.replace(/(?:of )?(?:dedicated )?(?:(?<!intel hd )graphics |video )?/gi, '')
            match = match.replace(/^(\d+ [MG]B)$/, '$1 VRAM')
            match = match.replace(/(at least )?(\d+ [MG]B)(?! ?vram)/gi, (match, p1, p2) => {
                if (!p1 && p2.includes('GB')) return match
                return `${p2} VRAM`
            })
            match = replaceWithSlash(match)
            match = match.replace(/(?:series|video)?\s?cards? ?/gi, '')
            // match = match.replace(/^(\d+.*?VRAM)\s*(.*)/, '$2 ($1)')
        }

        match = match.replace(/d(?:irect)?x (\d)(?:\.0(?!\w))?/gi, 'DirectX $1')
        match = match.replace(/nvidia/gi, 'Nvidia')
        match = match.replace(/open ?gl/gi, 'OpenGL')
        match = match.replace(/(?:amd )?radeon/gi, 'AMD Radeon')
        match = match.replace(/(?:intel )?arc/gi, 'Intel Arc')
        match = match.replace(/(?:intel )?(?:iris )?\bxe\b/gi, 'Intel Iris Xe')
        match = match.replace(/gpu/gi, 'GPU')
        match = match.replace(/(\d) ?Ti/gi, '$1 Ti')
        match = match.replace(/(\w)\/(\w)/g, '$1 / $2')
        match = match.replace(
            /(OpenGL .*) hardware driver support required for WebGL acceleration.*\((AMD Catalyst .*? \/ Nvidia \d.*)\)/i, '$2; $1')
        return match
    })

    formatSection('DirectX', match => {
        match = match.replace(/DirectX\s?/gi, '')
        match = match.replace(/v(?:ersion)?\s?(\d)/gi, '$1')
        match = match.replace(/\.0(?!\w)/, '') // avoid 9.0c
        return match
    })

    reqs = reqs.replace(/(\S)\(/g, '$1 (')

    return str.replace(original, reqs)

    function formatSectionLabel(partialPattern, replacement) {
        reqs = reqs.replace(
            // colon only, colon preceded/followed by [/b], colon with space before [/b]
            new RegExp(`(\\n)?(?:\\[\\*]\\[b]|\\s*\\[\\*]|\\[b]|\\*)\\s*(?:${partialPattern})\\s*(?::\\s\\[\\/b]|:\\[\\/b]|\\[\\/b]:|:) *`, 'gi'),
            (_, newline) => newline ? replacement : replacement.replace('\n', ''))  // the check is to handle OS because there's no newline before it if there's no min/rec
    }

    /**
     * @param {string} sectionName
     * @param {(match: string) => string} func
     */
    function formatSection(sectionName, func) {
        const regExp = new RegExp(`(^\\[\\*]\\[b]${sectionName}\\[\\/b]: )(.*)`, 'gm')
        reqs = reqs.replace(regExp, (_, p1, p2) => `${p1}${func(p2)}`)
    }

    function replaceWithSlash(str) {
        return str.replace(/,* or |, */gi, ' / ')
    }
}

/**
 * @param {string} str
 * @returns {string}
 */
function formatDescCommon(str) {
    if (!str) return ""

    if (destructiveEditsEnabled) {
        // Convert full-width ASCII characters (！～) to half-width
        str = str.replace(/[\uFF01-\uFF5E]/g,
            match => String.fromCharCode(match.charCodeAt(0) - 0xFEE0)).replace(/\u3000/g, ' ');
    }

    // [^\S\r\n] is horizontal space
    str = str.replace(/\s*([.,?!:])[^\S\r\n]+/g, '$1 ')
    str = str.replace(/[™®©]/g, '')
    str = str.replace(/。/g, '.')
    str = str.replace(/？/g, '?')
    str = str.replace(/！/g, '!')
    str = str.replace(/ ?\((?:[RC]|TM)\)/gi, '')

    if (destructiveEditsEnabled) {
        str = str.replace(/([a-zA-Z]):(\w)/g, '$1: $2') // [a-zA-Z] to avoid aspect ratio
        str = str.replace(/([a-z0-9])([.,])(?![a-zA-Z]\.)(\w)/g, (match, p1, p2, p3) => { // try to avoid initialisms
            if (/\d/.test(p1) && /\d/.test(p3)) return match // dont add space for numbers, decimals
            return `${p1}${p2} ${p3}`
        })
    }

    // Move punctuation outside closing tags
    str = str.replace(/((?:\[[bui]])+)(.*?)([,.?!:])[^\S\r\n]*((?:\[\/[bui]])+)[^\S\r\n]*/g, '$1$2$4$3 ')

    str = str.replace(/\[u]\[b](.*?)\[\/b]\[\/u]/g, '[b][u]$1[/u][/b]')

    if (str.includes("[quote]") && !str.includes("[/quote]")) {
        str = str.replace("\n[/align]", "[/quote]")
        if (!str.includes("[/quote]")) {
            str = str + "[/quote]"
        }
    }

    str = str.replace(/\n{2,10}\[align=center]/g, "\n\n[align=center]")

    str = str.replace(/\n*\[quote]/g, "\n\n[quote]")

    str = str.replace(/\n*\[\/quote].*/gi, "[/quote]")

    // here so that formatAbout can find it
    const sysReqsHeader = headersMap.get("sysReqs")
    if (!str.includes(sysReqsHeader)) {
        str = str.replace(/\n?(\[size=3])?\n(\[(b|u|i|quote|align=center|align=left)]\n?){0,5}\s*(System\sRequirements|Game\sSystem\sRequirements|Requirements|GOG\sSystem\sRequirements|Minimum\sSystem\sRequirements|System\sRequierments)\s*([:.])?\s*(\n?\[\/(b|u|i|align|size)]){0,5}(\s*:|:|)\n*(\n\[align=(left|center)])?/i,
            sysReqsHeader)
    }

    //endregion

    str = str.replace(/[^\S\r\n]*\n/g, '\n')
    str = str.replace(/…/g, '...')
    return str
}

/**
 * @param {string} str
 * @param {string=} gameTitle
 * @returns {string}
 */
function formatAll(str, gameTitle) {
    str = formatDescCommon(str)
    str = formatAbout(str, gameTitle)
    str = formatSysReqs(str)
    return str
}

function removeBbcode(str) {
    return str.replace(/\[(\/?[^\]]+)]/g, '')
}

function toSentenceCase(str) {
    const pos = /]?\w/.exec(str)?.index // mainly to skip [*]
    if (pos === undefined) return

    let lowerStr = str.toLowerCase()
    const newStr = lowerStr.charAt(pos).toUpperCase() + lowerStr.slice(pos + 1)
    // Capitalise subsequent sentences
    return str.substring(0, pos) + newStr.replace(/([.?!\]]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase())
}

/**
 * @param {HTMLTextAreaElement} textarea
 * @param {string} unformattedDesc
 */
function createUnformattedArea(textarea, unformattedDesc) {
    let div = document.getElementById('unformatted-desc')
    if (div) return

    textarea.insertAdjacentHTML('beforebegin',
        `<div id="unformatted-desc">
    <button type="button" style="margin-bottom: 5px;"> Show unformatted description</button>
    <textarea cols="30" rows="15" style="filter: brightness(0.8); display:none; margin-bottom: 5px;margin-left: 0;width: 100%;" readonly>${unformattedDesc}</textarea>
</div>`)

    div = document.getElementById('unformatted-desc')
    const ta = div.querySelector('textarea')
    const btn = div.querySelector('button')
    btn.onclick = () => {
        if (ta.style.display === 'none') {
            ta.style.display = 'block'
            btn.textContent = 'Hide unformatted description'
        } else if (ta.style.display === 'block') {
            ta.style.display = 'none'
            btn.textContent = 'Show unformatted description'
        }
    }
}