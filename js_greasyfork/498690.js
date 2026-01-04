// ==UserScript==
// @name			 GGn Tag Helper
// @description		 Add tags more easily
// @version			 2.2.2
// @match			 *://gazellegames.net/upload.php*
// @match			 *://gazellegames.net/torrents.php?*action=advanced*
// @match			 *://gazellegames.net/torrents.php*id=*
// @exclude			 *://gazellegames.net/torrents.php*action=editgroup*
// @match			 *://gazellegames.net/requests.php*
// @match			 *://gazellegames.net/user.php*action=edit*
// @grant			 GM.setValue
// @grant			 GM.getValue
// @grant			 GM_setValue
// @grant			 GM_getValue
// @grant			 GM_addStyle
// @license			 MIT
// @author			 tweembp, ingts
// @namespace ggntagselector
// @downloadURL https://update.greasyfork.org/scripts/498690/GGn%20Tag%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/498690/GGn%20Tag%20Helper.meta.js
// ==/UserScript==
// noinspection CssUnresolvedCustomProperty,CssUnusedSymbol,DuplicatedCode

const locationhref = location.href
const isUploadPage = locationhref.includes('upload.php'),
    isGroupPage = locationhref.includes('torrents.php?id='),
    isSearchPage = locationhref.includes('action=advanced'),
    isRequestPage = locationhref.includes('requests.php') && !locationhref.includes('action=new'),
    isCreateRequestPage = locationhref.includes('action=new'),
    isUserPage = locationhref.includes('user.php')

const TAGSEPERATOR = ', '
let hotkeys = GM_getValue('hotkeys')
if (!hotkeys) {
    hotkeys = {
        "index": {
            "modifier": "Shift",
            "keys": ["1", "2", "3", "4", "5", "Q", "W", "E", "R", "T"]
        },
        "favorites": {
            "modifier": "Shift",
            "keys": ["1", "2", "3", "4", "5", "Q", "W", "E", "R", "T"]
        },
        "presets": {
            "modifier": "Alt",
            "keys": ["1", "2", "3", "4", "5", "Q", "W", "E", "R", "T"]
        }
    }

    GM_setValue('hotkeys', hotkeys)
}

const trailingCommaRegex = /(?:, *)+$/

function titlecase(s) {
    let out = s.split('.').map((e) => {
        if (!["and", "em"].includes(e)) {
            return e[0].toUpperCase() + e.slice(1)
        } else {
            return e
        }
    }).join(' ')
    return out[0].toUpperCase() + out.slice(1)
}

if (!isUserPage) {
    let modal,
        tagInput,
        currentUploadCategory = 'Games',
        favsList,
        presetsList,
        currentTagsList,
        removalCheckbox

    // language=CSS
    GM_addStyle(`
        #tag-helper {
            display: none;
            grid-template-columns: 200px 300px 200px;
            grid-template-rows: repeat(2, auto);
            gap: 15px;
            position: absolute;
            background-color: rgb(27, 48, 63);
            box-sizing: border-box;
            padding: .5em 1em 1em 1em;
            border: 3px solid var(--rowb);
            box-shadow: -3px 3px 5px var(--black);
            z-index: 99999;
            min-width: min-content;
            max-width: 800px;
            font-size: 13px;

            label input[type=checkbox] {
                margin: 0 5px 0 0;
            }

            section {
                div.spaced {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                div.list {
                    display: flex;
                    flex-direction: column;
                    max-height: 450px;
                    overflow: auto;
                }

                button {
                    margin-right: 10px;
                    word-break: break-word;
                }

                h1 {
                    font-weight: normal;
                    padding-bottom: 0;
                    font-size: 1.2em;
                    margin: 0.5em 0 0.5em 0;
                }

                div.tag-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 0.25em;
                }
            }

            .tag {
                height: fit-content;
                font-family: inherit;
                font-size: inherit;
                opacity: 1 !important;
                background: none !important;
                border: none;
                padding: 0 !important;
                color: var(--lightBlue);
                text-decoration: none;
                cursor: pointer;
                text-align: start;
            }
        }

        .th-tag-idx {
            color: yellow;
            float: right;
            display: none;
            font-family: monospace;
        }
    `)

    if (isGroupPage)
        document.getElementById('add_tags_link').click()


    modal = document.createElement('div')
    document.body.appendChild(modal)
    modal.id = 'tag-helper'
    modal.innerHTML =
        //language=HTML
        `
            <section style="grid-column: 1">
                <div class="spaced">
                    <h1>Favorites</h1>
                    <button type="button" id="th-add-fav">Add</button>
                </div>
                <div class="list" id="th-favs"></div>
            </section>
            <section style="grid-column: 2;">
                <div class="spaced">
                    <h1>Presets</h1>
                    <button type="button" id="th-add-preset">Add</button>
                </div>
                <div class="list" id="th-presets"></div>
            </section>
            <section style="grid-column: 3;">
                <h1>Current Tags</h1>
                <div class="list" id="th-currenttags"></div>
            </section>
            <label style="display:flex;align-items:center;font-size: 0.9em;grid-row: 2;grid-column: 1/3">
                <input type="checkbox" id="th-remove">
                Remove (click favorite or preset when checked)
            </label>
        `


    favsList = document.getElementById('th-favs')
    presetsList = document.getElementById('th-presets')
    currentTagsList = document.getElementById('th-currenttags')
    removalCheckbox = document.getElementById('th-remove')

    let currentFavoritesDict = (GM_getValue('favorites')) || {}
    let currentPresetsDict = (GM_getValue('presets')) || {}

    function init() {
        if (isUploadPage || isCreateRequestPage) {
            currentUploadCategory = document.querySelector('#categories').value
        } else if (isGroupPage) {
            const categoryHeaderText = document.querySelector('#group_nofo_bigdiv > div.head > strong').textContent

            if (categoryHeaderText.includes('Application')) {
                currentUploadCategory = 'Applications'
            } else if (categoryHeaderText.includes('OST')) {
                currentUploadCategory = 'OST'
            } else if (categoryHeaderText.includes('Book')) {
                currentUploadCategory = 'E-Books'
            } else if (categoryHeaderText.includes('Game')) {
                currentUploadCategory = 'Games'
            }
        } else if (isSearchPage || isRequestPage) {
            const checkedBoxes = document.querySelectorAll('input[type=checkbox][name^=filter_cat]:checked')
            if (checkedBoxes.length > 0) {
                const lastChecked = checkedBoxes[checkedBoxes.length - 1]
                currentUploadCategory = {
                    1: "Games",
                    2: "Applications",
                    3: "E-Books",
                    4: "OST",
                }[/\d/.exec(lastChecked.id)[0]]
            }
        }

        tagInput = isCreateRequestPage ? document.getElementById(`tags_${currentUploadCategory}`).firstElementChild :
            (document.getElementById('tags') || document.querySelector('[name=add_tags_input]') || document.querySelector('[name=tags]'))

        drawFavorites()
        drawPresets()
        drawCurrentTags()

        tagInput.addEventListener('keyup', () => {
            for (const span of suggestionIdxSpans) {
                span.style.display = 'none'
            }
            for (const span of favIdxSpans) {
                span.style.display = 'none'
            }
            for (const span of presetIdxSpans) {
                span.style.display = 'none'
            }
        })

        tagInput.addEventListener('blur', () => {
            tagInput.value = tagInput.value.replace(trailingCommaRegex, '')
        })

        tagInput.addEventListener('focus', () => {
            const tagInputRect = tagInput.getBoundingClientRect()
            modal.style.top = `${tagInputRect.top + window.scrollY + tagInputRect.height + 5}px`
            modal.style.left = `${tagInputRect.left + window.scrollX + 250}px`
            modal.style.display = 'grid'
            addCommaToEndAndDrawCurrent()
        })

        tagInput.addEventListener('change', () => {
            drawCurrentTags()
        })

        window.addEventListener('click', e => {
            if (!(e.target === tagInput || modal.contains(e.target) || e.target.className === 'tag'))
                modal.style.display = 'none'
        })

        window.addEventListener('keydown', ev => {
            if (ev.code === 'Escape') {
                modal.style.display = 'none'
            }
        })
    }

    init()

    if (isUploadPage) {
        tagInput.style.width = '100%'
        tagInput.size = 80

        document.getElementById('categories').addEventListener('change', () => {
            new MutationObserver(() => init())
                .observe(document.getElementById('dynamic_form'), {childList: true, subtree: true})
        })
    } else if (isSearchPage || isRequestPage) {
        document.querySelector('.cat_list').addEventListener('change', e => {
            if (!e.target.checked) return
            init()
        })
    } else if (isCreateRequestPage) { // it doesn't use dynamic form
        document.getElementById('categories').addEventListener('change', () => {
            init()
        })
    }

    /** @type {HTMLInputElement} */
    const autocompleteDiv = tagInput.nextElementSibling
    const addTagsButton = document.getElementById('add_tags_button')

    const groupTagDivs = document.getElementsByClassName('group_tag')

    const suggestionIdxSpans = autocompleteDiv.getElementsByClassName('th-tag-idx')
    const favIdxSpans = favsList.getElementsByClassName('th-tag-idx')
    const presetIdxSpans = presetsList.getElementsByClassName('th-tag-idx')
    const autocompleteItems = autocompleteDiv.getElementsByClassName('tag_autocomplete_items')

    // this is to prevent submission when accepting a suggestion using tab
    let acceptedSuggestion = false

    new MutationObserver(() => {
        // not using addedNodes because it's empty if a suggestion remains at the same position
        for (let idx = 0; idx < autocompleteItems.length; idx++) {
            const autocompleteItem = autocompleteItems[idx]

            autocompleteItem.addEventListener('click', () => {
                acceptedSuggestion = true
                addCommaToEndAndDrawCurrent()
            })

            if (idx > 0) {
                const span = document.createElement('span')
                autocompleteItem.append(span)
                span.textContent = hotkeys.index.keys?.[idx - 1] ?? ''
                span.className = 'th-tag-idx'
            }
        }
    }).observe(autocompleteDiv, {childList: true})

    /**
     * @param {KeyboardEvent} event
     * @param {string} hotkeyType
     */
    function isCorrectKeyModifier(event, hotkeyType) {
        const modifier = hotkeys[hotkeyType].modifier

        return (event.shiftKey && !isSearchPage && modifier === 'Shift')
            || (event.altKey && modifier === 'Alt')
            || (event.ctrlKey && modifier === 'Control')
            || (event.metaKey && modifier === 'Meta')
    }

    /**
     * @param {KeyboardEvent} ev
     * @param {string} hotkeyType
     * @param {HTMLCollectionOf<HTMLSpanElement>} spanList
     * @param {string} code
     * @param {HTMLElement} tagList
     * @param {boolean} [skip1]
     */
    function handleListIndexPress(ev, hotkeyType, spanList, code, tagList, skip1) {
        if (isCorrectKeyModifier(ev, hotkeyType)) {
            ev.preventDefault()
            for (const span of spanList) {
                span.style.display = 'inline'
            }

            const keyIndex = hotkeys.index.keys.indexOf(code)
            if (keyIndex !== -1) {
                const child = tagList.children[keyIndex + (skip1 ? 1 : 0)];
                (child.querySelector('button') || child).click()
            }
        }
    }

    tagInput.addEventListener('keydown', /** @param {KeyboardEvent} ev */ev => {
        const code = ev.code.replace('Digit', '').replace('Key', '')

        if (code === 'Space') {
            addCommaToEndAndDrawCurrent()
            tagInput.value = tagInput.value.replace(/ $/, '')
            return
        }

        const hasSuggestions = autocompleteDiv.children.length > 0
        if (hasSuggestions) { // add suggestion by index
            handleListIndexPress(ev, 'index', suggestionIdxSpans, code, autocompleteDiv, true)
        } else {
            handleListIndexPress(ev, 'favorites', favIdxSpans, code, favsList)
        }

        handleListIndexPress(ev, 'presets', presetIdxSpans, code, presetsList)

        // tab submit shortcut
        if (isGroupPage && tagInput.value && !hasSuggestions && !acceptedSuggestion && code === 'Tab') {
            ev.preventDefault()
            addTagsButton.click()
        }

        acceptedSuggestion = false
    })

    let originalTagColor

    function addTag(tag) {
        const groupTags = [...groupTagDivs].map(div => div.children[0])
        const existingTag = groupTags.find(t => t.textContent === tag)

        if (existingTag) {
            originalTagColor ??= window.getComputedStyle(existingTag).getPropertyValue('color')
            existingTag.style.color = '#69c364'
            setTimeout(() => existingTag.style.color = originalTagColor, 1000)
            return
        }

        if (!tagInput.value) {
            tagInput.value = tag
        } else {
            const tags = tagInput.value.replace(trailingCommaRegex, '').split(TAGSEPERATOR)

            if (!tags.includes(tag)) {
                tags.push(tag)
            }
            tagInput.value = tags.join(TAGSEPERATOR)
        }
        tagInput.focus()
        tagInput.setSelectionRange(-1, -1)

        addCommaToEndAndDrawCurrent()
        drawCurrentTags()
    }

    // region Favorites
    //
    //
    //
    //

    function drawFavorites() {
        let html = ''
        for (const [idx, tag] of getFavorites().entries()) {
            html += `<div class="spaced">
    <div class="tag-wrapper">${idx + 1}. <button type="button" class="tag" data-tag="${tag}">${titlecase(tag)}</button></div>
    <span class="th-tag-idx">${hotkeys.favorites.keys?.[idx] ?? ''}</span>
</div>`
        }

        favsList.innerHTML = html
        favsList.querySelectorAll('.tag').forEach(el => {
            el.addEventListener('click', event => {
                event.preventDefault()
                const tag = event.target.dataset.tag

                if (removalCheckbox.checked) {
                    removeFavorite(tag).then(() => {
                        drawFavorites()
                    })
                } else {
                    addTag(tag)
                }
            })
        })
    }

    async function removeFavorite(tag) {
        let _temp = []
        for (const fav of getFavorites()) {
            if (fav !== tag) {
                _temp.push(fav)
            }
        }
        currentFavoritesDict[currentUploadCategory] = _temp
        return GM.setValue('favorites', currentFavoritesDict)
    }

    document.getElementById('th-add-fav').onclick = async () => {
        const currentFavorites = getFavorites()
        const tags = parse_text_to_tag_list()
            .filter((value, index, array) => !array.some(value => currentFavorites.includes(value)))

        currentFavoritesDict[currentUploadCategory] = currentFavorites.concat(...tags)
        await GM.setValue('favorites', currentFavoritesDict)
        drawFavorites()
    }

    function getFavorites() {
        return currentFavoritesDict[currentUploadCategory] || []
    }

    //
    //
    //
    //
    // endregion


    //region Presets
    //
    //
    //
    //

    function drawPresets() {
        let html = ''

        for (const [idx, preset] of getPresets().entries()) {
            html += `<div class="spaced"> 
				<div class="tag-wrapper">${idx + 1}. <button type="button" class="tag" data-preset="${preset}">
									${preset.split(TAGSEPERATOR).map((tag) => titlecase(tag)).join(TAGSEPERATOR)}</button></div>
					<span class="th-tag-idx">${hotkeys.presets.keys?.[idx] ?? ''}</span>
				</div>`
        }

        presetsList.innerHTML = html
        presetsList.querySelectorAll('.tag').forEach((el) => {
            el.addEventListener('click', event => {
                event.preventDefault()
                const preset = event.target.dataset.preset
                if (removalCheckbox.checked) {
                    removePreset(preset).then(() => {
                        drawPresets()
                    })
                } else {
                    for (const tag of parse_text_to_tag_list(preset)) {
                        addTag(tag)
                    }
                }
            })
        })
    }

    function getPresets() {
        return currentPresetsDict[currentUploadCategory] || []
    }

    async function removePreset(preset) {
        let _temp = []
        for (const pres of getPresets()) {
            if (pres !== preset) {
                _temp.push(pres)
            }
        }
        currentPresetsDict[currentUploadCategory] = _temp
        return GM.setValue('presets', currentPresetsDict)
    }

    document.getElementById('th-add-preset').onclick = async () => {
        const str = parse_text_to_tag_list().join(TAGSEPERATOR)
        const currentPresets = getPresets()

        if (!currentPresets.includes(str)) {
            currentPresetsDict[currentUploadCategory] = currentPresets.concat(str)
            await GM.setValue('presets', currentPresetsDict)
            drawPresets()
        }
    }

    //
    //
    //
    //
    //endregion

    /** @returns {string[]} */
    function parse_text_to_tag_list(text = tagInput.value) {
        let tagList = []
        for (let tag of text.replaceAll(' ', '').split(TAGSEPERATOR.trim())) {
            tag.trim() && tagList.push(tag)
        }
        return tagList
    }

    function addCommaToEndAndDrawCurrent() {
        if (tagInput.value && !trailingCommaRegex.test(tagInput.value)) {
            tagInput.value += TAGSEPERATOR
        }
        drawCurrentTags()
    }

    function drawCurrentTags() {
        let html = ''
        const tags = parse_text_to_tag_list()

        for (const [idx, tag] of tags.entries()) {
            html += `<div class="tag-wrapper">${idx + 1}. <button type="button" class="tag" data-tag="${tag}">${titlecase(tag)}</button></div>`
        }

        currentTagsList.innerHTML = html
        for (const tagLink of currentTagsList.querySelectorAll('.tag')) {
            tagLink.onclick = event => {
                const currentTags = parse_text_to_tag_list()
                const clickedTag = event.target.getAttribute('data-tag')
                tagInput.value = currentTags.filter(t => t !== clickedTag).join(TAGSEPERATOR)
                tagInput.focus()
            }
        }
    }
} else {
    // language=CSS
    GM_addStyle(`
        #tag-helper {
            display: grid;
            flex-direction: column;
            gap: 10px;

            h1 {
                font-size: 1.1em;
                margin: 0;
            }

            input[type=text] {
                width: 50%;
            }
        }
    `)

    const colhead = document.createElement('tr')
    colhead.classList.add('colhead_dark')
    colhead.innerHTML = '<td colspan="2" ><strong>Tag Helper</strong></span>'
    const lastTr = document.querySelector('#userform > table > tbody > tr:last-child')
    lastTr.before(colhead)
    const hotkeyTr = document.createElement('tr')
    hotkeyTr.innerHTML = `<td class="label"><strong>Hotkeys</strong></td>`

    const td = document.createElement('td')
    td.id = 'tag-helper'
    hotkeyTr.append(td)

    for (const [name, obj] of Object.entries(hotkeys)) {
        // language=HTML
        td.innerHTML += `
            <h1>${titlecase(name)}</h1>
            <div>
                <select name="${name}-modifier">
                    <option value="Shift">shift</option>
                    <option value="Alt">alt</option>
                    <option value="Control">ctrl</option>
                    <option value="Meta">meta</option>
                </select>
                <input type="text" name="${name}-keys" value="${obj.keys.join(', ')}">
            </div>
        `

        const selects = td.querySelectorAll('select')
        selects[selects.length - 1].value = obj.modifier
    }

    const saveButton = document.createElement('button')
    td.append(saveButton)
    saveButton.textContent = 'Save'
    saveButton.style.width = 'max-content'
    saveButton.style.fontSize = 'larger'
    saveButton.type = 'button'

    saveButton.onclick = () => {
        for (const name of Object.keys(hotkeys)) {
            const modifierInput = td.querySelector(`select[name="${name}-modifier"]`)
            const keysInput = td.querySelector(`input[name="${name}-keys"]`)

            hotkeys[name].modifier = modifierInput.value
            hotkeys[name].keys = keysInput.value.split(', ')
        }
        GM_setValue('hotkeys', hotkeys)
        saveButton.textContent = 'Saved'
    }

    colhead.after(hotkeyTr)
}