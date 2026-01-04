// ==UserScript==
// @name         GGn Game Description Formatter
// @namespace    none
// @version      1.7.0.001
// @description  Buttons to format description
// @author       ingts
// @grant        GM_addStyle
// @match        https://gazellegames.net/upload.php*
// @match        https://gazellegames.net/torrents.php?action=editgroup&groupid=*
// @require      https://update.greasyfork.org/scripts/540511/1727368/GGn%20Formatters.js
// @downloadURL https://update.greasyfork.org/scripts/542737/GGn%20Game%20Description%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/542737/GGn%20Game%20Description%20Formatter.meta.js
// ==/UserScript==
// noinspection CssUnusedSymbol

destructiveEditsEnabled = true

//language=css
GM_addStyle(`
    #description-formatter {
        display: flex;
        gap: 3%;
        align-items: center;
        margin: 5px 0;
        padding: 0 10px;

        > div > button {
            height: auto;
            white-space: nowrap;
            padding: 5px;
        }

        button {
            transition-property: background-color;
            transition-duration: 1s;
        }

        button:active {
            background-color: gainsboro;
            transition-duration: 0s;
        }

        section {
            display: grid;
            grid-template-columns: 1fr 3fr;
            column-gap: 15px;
            row-gap: 8px;
        }

        .formatter-buttons-row {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }
    }
`)

class UndoRedo {
    constructor(textarea) {
        this.textarea = textarea
        this.stack = [{text: '', start: 0, end: 0}]
        this.currentIndex = 0
    }

    record(start, end) {
        if (this.currentIndex < this.stack.length - 1) {
            // Clear any redo history when recording after an undo
            this.stack.length = this.currentIndex + 1
        }
        this.stack.push({
            text: this.textarea.value,
            start: start ?? this.textarea.selectionStart,
            end: end ?? this.textarea.selectionEnd
        })
        this.currentIndex++
    }

    undo(readOnly) {
        if (this.currentIndex > 0) {
            if (readOnly !== true) {
                this.currentIndex--
                this.restore()
                return this.stack[this.currentIndex]
            } else {
                return this.stack[this.currentIndex - 1]
            }
        }
        return this.stack[this.currentIndex]
    }

    redo(readOnly) {
        if (this.currentIndex < this.stack.length - 1) {
            if (readOnly !== true) {
                this.currentIndex++
                this.restore()
                return this.stack[this.currentIndex]
            } else {
                return this.stack[this.currentIndex + 1]
            }
        }
        return this.stack[this.currentIndex]
    }

    restore() {
        const state = this.stack[this.currentIndex]
        this.textarea.value = state.text
        this.textarea.focus()
        this.textarea.setSelectionRange(state.start, state.end)
    }

    current(data, start, end) {
        if (data) {
            this.stack[this.currentIndex] = {
                text: this.textarea.value,
                start: start ?? this.textarea.selectionStart,
                end: end ?? this.textarea.selectionEnd
            }
        }
        return this.stack[this.currentIndex]
    }
}

/** @type {HTMLTextAreaElement} */
const descInput = isEditPage ? document.querySelector("textarea[name='body']") : document.getElementById('album_desc')

const history = new UndoRedo(descInput)

function isPcGroup(platform) {
    return ["Windows", "Mac", "Linux", "Android", 'iOS'].some(p => platform === p)
}

const forPcOnly = !isEditPage || isEditPage
    && isPcGroup(document.getElementById('user_script_data').dataset.platform)

// language=HTML
descInput.insertAdjacentHTML('afterend',
    `
        <section id="description-formatter">
            <div style="display:flex;flex-direction:column;gap: 8px;width: fit-content;">
                <button type="button">Format All</button>
                ${forPcOnly ? `<button type="button" id="gdf-format-about">Format About</button>` : ''}
                ${forPcOnly ? `<button type="button" id="gdf-format-sr">Format SR</button>` : ''}
            </div>
            <section>
                <div>
                    <strong>Casing</strong>
                    <div class="formatter-buttons-row"></div>
                </div>
                <div>
                    <strong>Functions</strong>
                    <div class="formatter-buttons-row"></div>
                </div>
                <div>
                    <strong>Headers</strong>
                    <div class="formatter-buttons-row"></div>
                </div>
                ${forPcOnly ? `<div id="gdf-sr">
                    <strong>System Requirements</strong>
                    <div class="formatter-buttons-row"></div>
                    <div class="formatter-buttons-row" style="margin-top: 3px;"></div>
                </div>` : ''}
            </section>
        </section>`)

if (!isEditPage) {
    const platformInput = document.getElementById('platform')
    const srDiv = document.getElementById('gdf-sr')
    const formatAbout = document.getElementById('gdf-format-about')
    const formatSr = document.getElementById('gdf-format-sr')

    platformInput.addEventListener('change', () => {
        const display = isPcGroup(platformInput.value) ? 'block' : 'none'

        srDiv.style.display = display
        formatAbout.style.display = display
        formatSr.style.display = display
    })
}

const main = document.getElementById('description-formatter')
const mainButtons = main.querySelectorAll(':scope > div button')

const title = isEditPage ? document.querySelector("#content > div > h2 > a").textContent : document.getElementById('title').value

mainButtons[0].onclick = () => mainButtonClick(desc => formatAll(desc, title))

if (forPcOnly) {
    mainButtons[1].onclick = () => mainButtonClick(desc => {
        const common = formatDescCommon(desc)
        return formatAbout(common, title)
    })
    mainButtons[2].onclick = () => mainButtonClick(desc => {
        const common = formatDescCommon(desc)
        return formatSysReqs(common)
    })
}

function mainButtonClick(func) {
    history.record()
    descInput.value = func(descInput.value)
    history.record()
    descInput.focus()
}

descInput.addEventListener('keydown', e => {
    if (e.ctrlKey && e.altKey && e.key === 'z') {
        e.preventDefault()
        history.undo()
    }
    if (e.ctrlKey && e.altKey && e.key === 'y') {
        e.preventDefault()
        history.redo()
    }
})

/**
 * @param {ButtonProp[]} buttonProps
 * @param {Element} appendTo
 * @param {boolean?} replaceTextOnly
 * @param {boolean?} insertText
 * @param {boolean?} textAsTooltip
 */
function addButtons({
                        buttonProps,
                        appendTo,
                        replaceTextOnly,
                        insertText,
                        textAsTooltip
                    }) {
    for (const buttonProp of buttonProps) {
        const button = document.createElement('button')
        button.textContent = buttonProp.label
        button.type = 'button'

        const tooltip = textAsTooltip ? buttonProp.text : buttonProp.tooltip

        if (tooltip) {
            $(button).tooltipster({
                // content: `<pre style="width: 100%;margin: 0;">${tooltip}</pre>`,
                content: tooltip.replace(/\n/g, '<br>'),
                contentAsHTML: true,
                maxWidth: 450,
            })
        }

        appendTo.append(button)

        button.onclick = () => {
            const selectionStart = descInput.selectionStart
            const selectionEnd = descInput.selectionEnd
            history.record(selectionStart, selectionEnd)
            const currentText = descInput.value

            if (insertText) {
                const textToInsert = buttonProp.text
                const insertAtStart = buttonProp?.insertPosition === 'start'
                const insertAtEnd = buttonProp?.insertPosition === 'end'
                let newValue, newCaretPos
                if (insertAtStart || insertAtEnd) {
                    newValue = insertAtStart
                        ? textToInsert + currentText
                        : currentText + textToInsert
                    newCaretPos = insertAtStart ? textToInsert.length : newValue.length
                } else {
                    const selectionStart = descInput.selectionStart
                    const before = currentText.substring(0, selectionStart)
                    const after = currentText.substring(selectionEnd)
                    newValue = before + textToInsert + after
                    newCaretPos = selectionStart + textToInsert.length
                }
                descInput.value = newValue
                descInput.selectionStart = newCaretPos
                descInput.selectionEnd = newCaretPos
            } else {
                if (buttonProp.selectionFunc && selectionStart !== descInput.selectionEnd) { // use selection
                    const selectedText = currentText.substring(selectionStart, descInput.selectionEnd)
                    const before = currentText.substring(0, selectionStart)
                    const after = currentText.substring(descInput.selectionEnd)
                    const replacement = buttonProp.selectionFunc(selectedText)

                    descInput.value = before + replacement + after
                    descInput.selectionStart = selectionStart
                    descInput.selectionEnd = selectionStart
                } else { // use caret
                    if (!buttonProp.func) return
                    const result = getBBCodeOrLineAtCaret(replaceTextOnly, buttonProp.includeNewLines)
                    const replacement = buttonProp.func(buttonProp.returnTextOnly ? result.textOnly : result.text, result.nextLine ?? '')
                    const caretOffset = replacement.length - (result.end - result.start)
                    const newCaretPos = selectionStart + caretOffset +
                        ((replaceTextOnly ? result.textOnly.length : result.text.length - result.openingTagsLength) - replacement.length)
                    descInput.value = result.replace(replacement)
                    descInput.selectionStart = newCaretPos
                    descInput.selectionEnd = newCaretPos

                }
            }

            descInput.focus()
            history.record()
        }
    }
}

/**
 @typedef {{
  label: string,
  tooltip?: string,
  func?: (str: string, nextLine: string) => string,
  selectionFunc?: (str: string) => string,
  text?: string,
  insertPosition?: 'start' | 'end',
  includeNewLines?: boolean,
  returnTextOnly?: boolean,
  }} ButtonProp
 */

/** @type {ButtonProp[]} */
const casingButtons = [
    {
        label: "Sentence case",
        func: toSentenceCase,
        selectionFunc: (str) => caseConvertSelection(str, toSentenceCase),
        returnTextOnly: true,
        tooltip: "Sentence cases the selection. If the selection contains [*][b]text[/b], only the bold text will be converted",
    },
    {
        label: "Title Case",
        func: formatTitle,
        selectionFunc: (str) => caseConvertSelection(str, formatTitle),
        returnTextOnly: true,
        tooltip: "Title cases the selection. If the selection contains [*][b]text[/b], only the bold text will be converted",
    },
    {
        label: "Lowercase",
        func: (str) => str.toLowerCase(),
        selectionFunc: (str) => str.toLowerCase(),
        returnTextOnly: true,
    },
]

function caseConvertSelection(str, convertFunc) {
    const listItemsReplaced = str.replace(/\[\*]\[b](.*?)\[\/b]/g, (match, p1) => `[*][b]${convertFunc(p1)}[/b]`)

    return str !== listItemsReplaced ? listItemsReplaced : convertFunc(str)
}

function headerToListItem(str) {
    str = toSentenceCase(removeBbcode(str))
    return str.replace(/(.+?)([:.?!])?$/, (match, p1, p2) => `[*][b]${str.replace(p2, '')}[/b]${p2 ? p2 : ':'} `)
}

function hasTerminalPunctuation(str) {
    return /[.?!,"]$/.test(str) // , and " are just so Join works with partial sentences
}

function joinLinesToPreviousListItem(str) {
    const lines = str.split('\n')
    const result = []

    for (let line of lines) {
        if (!line.trim()) continue

        if (line.startsWith('[*]')) {
            result.push(line)
        } else {
            if (result.length < 1) continue
            const prevIndex = result.length - 1
            const endsWithColonSpace = result[prevIndex].endsWith(': ')

            if (!endsWithColonSpace && !hasTerminalPunctuation(result[prevIndex]))
                result[prevIndex] += '.'

            result[prevIndex] += (endsWithColonSpace ? '' : ' ') + line
        }
    }

    const joined = result.join('\n')
    return hasTerminalPunctuation(joined) ? joined : joined + '.'
}

function addFullStop(str, nextLine) {
    return hasTerminalPunctuation(str) || /^[a-z]/.test(nextLine) ? ' ' : '. '
}

/** @type {ButtonProp[]} */
const bbCodeButtons = [
    {
        func: str => headerToListItem(str),
        selectionFunc: str => {
            let s = str
                .replaceAll('[*]', '')
                // .replace(/^\[\*]\[b].*?\[\/b](?:: )?/gm, '')  forgot the reason for this
                .replace(/\[align=center](.*?)\[\/align]\n/g, (_, p1) => headerToListItem(p1))
                .replace(/\[b](.*?)\[\/b](?:: )?\n/g, (_, p1) => headerToListItem(p1))
                .replace(/(^.+[^.?!\s])\s*\n/g, (match, p1) =>
                    (p1.startsWith('[') || match.split(' ') > 10) ? match : headerToListItem(p1))

            const fixedMulti = fixMultiLinesInLists(s)
            return joinLinesToPreviousListItem(fixedMulti)
        },
        label: "Header to List Item",
        includeNewLines: true,
        returnTextOnly: true,
        tooltip: `Unwraps then convert to "[*][b]{text}[b]: ". Also sentence cases, removes colons and the new line. With selection, lines like "[align=center]...[/align]" and "[b]...[/b]" will be converted first, then lines without terminal punctuation and shorter than 10 words. Also only with selection, [*]s are removed and non list item lines are joined to the converted list item. Empty lines are removed`
    },
    {
        func: (str, nextLine) => {
            str = str.trim()
            return str + addFullStop(str, nextLine)
        },
        selectionFunc: str => {
            str = str.replaceAll('[*]', '').trim()
            const lines = str.split('\n')
            let result = lines[0]

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim()
                if (!line) continue
                const lastCharIndex = str.indexOf(line) + line.length - 1

                const nextLine = lines[i + countLeadingEmptyLines(str.substring(lastCharIndex))]
                result += addFullStop(result, nextLine) + line
            }

            return result.replace(/\s+$/, '') + (hasTerminalPunctuation(result) ? '' : '.')
        },
        label: "Join",
        includeNewLines: true,
        tooltip: `Joins the next line to the current line and adds a full stop if needed. In selection, removes all [*] then joins lines to the first line`,
    },
    {
        func: str => str,
        selectionFunc: removeBbcode,
        label: "Unwrap",
        returnTextOnly: true,
        tooltip: "Unwraps all BBCode at caret or removes tags in the selection"
    },
    {
        func: str => `[*]${str}`,
        selectionFunc: (str) => str.split('\n').filter(line => line.trim() !== '')
            .map(line => line.startsWith('[*]') ? line : '[*]' + line).join('\n'),
        label: "To List Item",
        tooltip: `Unwraps then convert to "[*]{text}". Every line in the selection will be converted and empty lines are removed`
    },
    {
        func: str => `[b]${str}[/b]`,
        label: "Bold",
        returnTextOnly: true,
        tooltip: `Unwraps then wraps with [b]`,
    },
]


/** @type {ButtonProp[]} */
const headerButtons = [
    {
        label: "About the game",
        text: headersMap.get("aboutGame"),
        insertPosition: 'start'
    },
    {
        label: "Features",
        text: headersMap.get("features"),
    },
    {
        label: "Gameplay",
        text: "\n[align=center][b][u]Gameplay[/u][/b][/align]",
    },
    {
        label: "Story",
        text: "\n[align=center][b][u]Story[/u][/b][/align]",
    },
    {
        label: "Characters",
        text: "\n[align=center][b][u]Characters[/u][/b][/align]",
    },
]

/** @type {ButtonProp[]} */
const sysReqsButtons = [
    {
        label: "Regular",
        text: `${headersMap.get("sysReqs")}
[b]Minimum[/b]${headersMap.get("os")}${headersMap.get("processor")}${headersMap.get("memory")}${headersMap.get("graphics")}${headersMap.get("storage")}
[b]Recommended[/b]${headersMap.get("os")}${headersMap.get("processor")}${headersMap.get("memory")}${headersMap.get("graphics")}${headersMap.get("storage")}[/quote]`,
        insertPosition: 'end',
    },
    {
        label: "None",
        text: `${headersMap.get("sysReqs")}None provided[/quote]`,
        insertPosition: 'end',
    },
    {
        label: "Empty",
        text: `${headersMap.get("sysReqs")}[/quote]`,
        insertPosition: 'end',
    },
    {
        label: "Minimum",
        text: `${headersMap.get("minimumReqs")}`
    },
    {
        label: "Recommended",
        text: `${headersMap.get("recommendedReqs")}`
    },
]

/** @type {ButtonProp[]} */
const sysReqsLineButtons = [
    {
        label: "OS",
        text: `${headersMap.get("os")}`
    },
    {
        label: "Processor",
        text: `${headersMap.get("processor")}`
    },
    {
        label: "Memory",
        text: `${headersMap.get("memory")}`
    },
    {
        label: "Storage",
        text: `${headersMap.get("storage")}`
    },
    {
        label: "Graphics",
        text: `${headersMap.get("graphics")}`
    },
    {
        label: "Sound Card",
        text: `${headersMap.get("soundcard")}`
    },
    {
        label: "DirectX",
        text: `${headersMap.get("directX")}`
    },
    {
        label: "Additional Notes",
        text: `${headersMap.get("additionalnotes")}`
    },
    {
        label: "Other",
        text: `${headersMap.get("other")}`
    },
    {
        label: "Network",
        text: `${headersMap.get("network")}`
    },
    {
        label: "Drive",
        text: `${headersMap.get("drive")}`
    },
    {
        label: "Controllers",
        text: `${headersMap.get("controllers")}`
    },
]

const buttonDivs = main.querySelectorAll('.formatter-buttons-row')

addButtons({
    buttonProps: casingButtons,
    appendTo: buttonDivs[0],
    replaceTextOnly: true,
})
addButtons({
    buttonProps: bbCodeButtons,
    appendTo: buttonDivs[1],
})
addButtons({
    buttonProps: headerButtons,
    appendTo: buttonDivs[2],
    insertText: true,
    textAsTooltip: true,
})
addButtons({
    buttonProps: sysReqsButtons,
    appendTo: buttonDivs[3],
    insertText: true,
    textAsTooltip: true,
})
addButtons({
    buttonProps: sysReqsLineButtons,
    appendTo: buttonDivs[4],
    insertText: true,
    textAsTooltip: true,
})

// button to convert align to [*][b]
/**
 * @param {boolean} textOnly
 * @param {boolean?} includeNewLines
 * @returns {{
 * text: string,
 * start: number,
 * end: number,
 * textOnly: string,
 * openingTagsLength: number,
 * nextLine?: string,
 * replace: (str: string) => string
 * }}
 */
function getBBCodeOrLineAtCaret(textOnly, includeNewLines) {
    const text = descInput.value
    const caretPos = descInput.selectionStart
    // Find the current line boundaries
    const beforeCaret = text.substring(0, caretPos)
    const afterCaret = text.substring(caretPos)

    const lastNewlineBefore = beforeCaret.lastIndexOf('\n')
    const nextNewlineAfter = afterCaret.indexOf('\n')

    const lineStart = lastNewlineBefore === -1 ? 0 : lastNewlineBefore + 1
    const lineEnd = nextNewlineAfter === -1 ? text.length : caretPos + nextNewlineAfter

    const currentLine = text.substring(lineStart, lineEnd)
    const caretPosInLine = caretPos - lineStart

    // BBCode tag pattern - matches opening and closing tags
    const tagPattern = /\[(\/?[^\]]+)]/g
    const tags = []

    // Find all tags in the current line
    for (const match of currentLine.matchAll(tagPattern)) {
        const match1 = match[1]
        if (match1 === '*' || match1 === '#') {
            continue
        }

        tags.push({
            tag: match1,
            fullTag: match[0],
            start: match.index,
            end: match.index + match[0].length,
            isClosing: match1.startsWith('/')
        })
    }

    // Build a stack to track nested tags
    const tagStack = []
    const tagPairs = []

    for (const tag of tags) {
        if (tag.isClosing) {
            // Find matching opening tag
            const tagName = tag.tag.substring(1) // Remove the '/' prefix
            for (let i = tagStack.length - 1; i >= 0; i--) {
                // Extract base tag name (before any = or space)
                const openingTagName = tagStack[i].tag.split(/[=\s]/)[0]
                if (openingTagName === tagName) {
                    tagPairs.push({
                        opening: tagStack[i],
                        closing: tag
                    })
                    tagStack.splice(i, 1)
                    break
                }
            }
        } else {
            tagStack.push(tag)
        }
    }

    // Find all tag pairs that contain the caret, sorted by nesting level
    const containingPairs = []

    for (const pair of tagPairs) {
        const contentStart = pair.opening.end
        const contentEnd = pair.closing.start

        // Check if caret is within the content of this tag pair
        if (caretPosInLine >= contentStart && caretPosInLine <= contentEnd) {
            containingPairs.push({
                ...pair,
                range: contentEnd - contentStart
            })
        }
    }

    if (containingPairs.length === 0) {
        // No BBCode found, return the whole line
        const afterText = getAfterText(lineEnd, includeNewLines)
        return {
            text: currentLine,
            textOnly: currentLine,
            nextLine: /.*/.exec(afterText)[0],
            start: lineStart,
            end: lineEnd,
            openingTagsLength: 0,
            replace: function (newText) {
                const before = text.substring(0, lineStart)
                return before + newText + afterText
            }
        }
    }

    // Sort by range (innermost first)
    containingPairs.sort((a, b) => a.range - b.range)

    // Find the outermost pair (contains all others)
    const outermostPair = containingPairs[containingPairs.length - 1]
    const innermostPair = containingPairs[0]

    const targetPair = textOnly ? containingPairs[0] : outermostPair

    const absoluteStart = textOnly ?
        lineStart + targetPair.opening.end :
        lineStart + outermostPair.opening.start

    const onlyHasBbCode = /^\[(?!\*]).*\[\/.*]$/.test(currentLine)
    const absoluteEnd = (textOnly ?
        lineStart + targetPair.closing.start :
        lineStart + outermostPair.closing.end)

    const fullBBCode = currentLine.substring(outermostPair.opening.start, outermostPair.closing.end)
    const textContent = currentLine.substring(innermostPair.opening.end, innermostPair.closing.start)

    return {
        text: fullBBCode,
        textOnly: textContent,
        start: absoluteStart,
        end: absoluteEnd,
        openingTagsLength: containingPairs.reduce((length, pair) => length + pair.opening.fullTag.length, 0),
        replace: function (newText) {
            const before = text.substring(0, absoluteStart)
            return before + newText + getAfterText(absoluteEnd, includeNewLines && onlyHasBbCode)
        }
    }

    function getAfterText(endPos, condition) {
        const after = text.substring(endPos)
        if (!condition) return after

        return text.substring(endPos + countLeadingEmptyLines(after))
    }
}

function countLeadingEmptyLines(substr) {
    const lines = substr.split('\n')
    let newlinesUntilNotEmpty = 0
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '') {
            newlinesUntilNotEmpty++
        } else {
            break
        }
    }
    return newlinesUntilNotEmpty
}