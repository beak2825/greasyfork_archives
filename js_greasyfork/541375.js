// ==UserScript==
// @name         AO3: Prioritise My Faves
// @namespace    https://greasyfork.org/en/users/757649-certifieddiplodocus
// @version      2.0.0
// @description  Hide work if chosen tags are late in sequence, or if blacklisted tags are early
// @author       CertifiedDiplodocus
// @match        http*://archiveofourown.org/works*
// @match        http*://archiveofourown.org/tags*
// @exclude      /\/works\/[0-9].*/
// @exclude      /^https?:\/\/archiveofourown\.org(?!.*\/works)/
// @icon         https://raw.githubusercontent.com/EmeraldBoa/Userscripts-by-a-Certified-Diplodocus/refs/heads/main/images/icons/ao3-logo-by-bingeling-GPL.svg
// @license      GPL-3.0-or-later
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValues
// @grant        GM_deleteValues
// @downloadURL https://update.greasyfork.org/scripts/541375/AO3%3A%20Prioritise%20My%20Faves.user.js
// @updateURL https://update.greasyfork.org/scripts/541375/AO3%3A%20Prioritise%20My%20Faves.meta.js
// ==/UserScript==

/* global GM_getValues, GM_deleteValues */

/* AO3 logo designed by bingeling. Licensed under GNU 2+ https://commons.wikimedia.org/wiki/File:Archive_of_Our_Own_logo.png

Currently active on works/* and tags/* pages. To also enable on user pages, add the following line in the header:
    // @match        http*://archiveofourown.org/users*

'------------------------------------------------------------------------------------------------------------------ */
(function () {
    'use strict'
    const $ = document.querySelector.bind(document) // shorthand for readability
    const $$ = document.querySelectorAll.bind(document)

    // get settings from script storage (default values if not)
    const stored = GM_getValues({
        menuIsExpanded: false,
        filterIsOn: true,
        characters: null,
        relationships: null,
        excludedCharacters: null,
        excludedRelationships: null,
        format: 'wildcard',
        ao3SaviorIsInstalled: true,
        debugMode: false,
    })
    let noFilterYet = true
    let debugModeOn = stored.debugMode

    // get AO3 elements; validate
    const works = $$('.work.blurb')
    const workslistContainer = $('ol.work')
    const ao3FilterSidebar = $('#work-filters')

    const sidebarHTML = `<h3 class="landmark heading">Tag priority</h3>    
    <fieldset class="pmf__ui pmf__sidebar">
        <legend>Tag priority:</legend> <!--is this redundant?-->
        <dl>
            <dt class="pmf__sidebar-head collapsed">
                <button type="button" class="expander" aria-expanded="false" aria-controls="pmf__sidebar-content">
                    Tag priority
                </button>
                <button type="button" id="pmf__filter-toggle" class="current" aria-pressed="true">On</button>
            </dt>
            <dd id="pmf__sidebar-content" class="expandable">
                <section class="pmf__wrap" aria-describedby="pmf__header-include">
                    <div class="pmf__head">
                        <h4 id="pmf__header-include">Include</h4> (at least one)
                        <button type="button" class="question" aria-label="help">?</button>
                    </div>
                    <section class="pmf__tag-block include characters">
                        <label id="pmf__include-chars">
                            <input type="checkbox">
                            <span class="indicator" aria-hidden="true"></span>
                            <span id="block-include-chars"><span class="landmark">Include </span>Characters</span>
                        </label>
                        <textarea class="pmf__tag-list" rows="3" autocomplete="off" autocapitalize="off"
                            spellcheck="false" placeholder="Gilgamesh, Enkidu" readonly></textarea>
                        <label class="pmf__within">...within the first <input type="text" class="pmf__tag-lim" readonly>
                            tags</label>
                    </section>
                    <section class="pmf__tag-block include relationships">
                        <label>
                            <input type="checkbox">
                            <span class="indicator" aria-hidden="true"></span>
                            <span><span class="landmark">Include </span>Relationships</span>
                        </label>
                        <textarea class="pmf__tag-list" rows="3" autocomplete="off" autocapitalize="off"
                            spellcheck="false" placeholder="Gilgamesh*Enkidu, Enkidu*Gilgamesh" readonly></textarea>
                        <label class="pmf__within">...within the first <input type="text" class="pmf__tag-lim" readonly>
                            tags</label>
                    </section>
                </section>
                <section class="pmf__wrap" aria-describedby="pmf__header-exclude">
                    <div class="pmf__head">
                        <h4 id="pmf__header-exclude">Exclude</h4>
                        <button type="button" class="question" aria-label="help">?</button>
                    </div>
                    <section class="pmf__tag-block exclude characters">
                        <label>
                            <input type="checkbox">
                            <span class="indicator" aria-hidden="true"></span>
                            <span><span class="landmark">Exclude </span>Characters</span>
                        </label>
                        <textarea class="pmf__tag-list" rows="3" autocomplete="off" autocapitalize="off"
                            spellcheck="false" readonly></textarea>
                        <label class="pmf__within">...within the first <input type="text" class="pmf__tag-lim" readonly>
                            tags</label>
                    </section>
                    <section class="pmf__tag-block exclude relationships">
                        <label>
                            <input type="checkbox">
                            <span class="indicator" aria-hidden="true"></span>
                            <span><span class="landmark">Exclude </span>Relationships</span>
                        </label>
                        <textarea class="pmf__tag-list" rows="3" autocomplete="off" autocapitalize="off"
                            spellcheck="false" readonly></textarea>
                        <label class="pmf__within">...within the first <input type="text" class="pmf__tag-lim" readonly>
                            tags</label>
                    </section>
                </section>
                <section class="pmf__syntax" aria-describedby="pmf__syntax-header">
                    <h3 id="pmf__syntax-header" class="landmark">Format</h3>
                    <fieldset>
                        <legend>Format</legend>
                        <label>
                            <input type="radio" name="format" id="pmf__opt-wildcard" value="wildcard" form=""
                                checked><!--omit from parent form-->
                            <span class="indicator" aria-hidden="true"></span>
                            <span>wildcards (*)</span>
                        </label>
                        <label>
                            <input type="radio" name="format" id="pmf__opt-regex" value="regex"
                                form=""><!--omit from parent form-->
                            <span class="indicator" aria-hidden="true"></span>
                            <span>regex</span>
                        </label>
                        <button type="button" class="question" aria-label="help">?</button>
                    </fieldset>
                </section>
                <section class="actions" aria-describedby="pmf__header-submit">
                    <h3 id="pmf__header-submit" class="landmark">
                        Submit
                    </h3><button class="pmf__apply" type="button">Apply filters</button>
                </section>
                <dl>
                    <dt class="pmf__config-head collapsed">
                        <button type="button" class="expander" aria-expanded="false" aria-controls="pmf__config"
                            aria-label="Settings">⚙️ Settings</button>
                        <p class="footnote">
                            <a href="#work-filters">Clear Filters</a>
                        </p>
                    </dt>
                    <dd id="pmf__config" class="expandable">
                        <div></div>
                        <label>
                            <input id="pmf__setting-AO3-sav" type="checkbox">
                            <span class="indicator" aria-hidden="true"></span>
                            <span>AO3 Savior is installed</span>
                            <span class="pmf__explanatory-text">(prevent conflict on load)</span>
                        </label>
                        <label>
                            <input id="pmf__setting-debug" type="checkbox">
                            <span class="indicator" aria-hidden="true"></span>
                            <span>Debug mode</span>
                            <span class="pmf__explanatory-text">(may require a reload)</span>
                        </label>
                    </dd>
                </dl>
            </dd>
        </dl>
    </fieldset>`
    const infoModalHTML = `<div class="pmf__ui popup">
        <details class="pmf__info-section">
            <summary>Basics</summary>
            <p>The script cannot use AO3's tag system, but instead <strong>matches
                    the literal tag text</strong>. <br>
                Add synonyms where necessary
                (e.g. <span class="search-term">Naruto Uzumaki, Uzumaki Naruto</span>).
                When searching for a specific relationship, you MUST include both permutations:
                <span class="search-term">A/B</span> and <span class="search-term">B/A</span>.
            </p>
            <ul>
                <li>Only character and relationship tags are checked.</li>
                <li>Comma = OR
                    <table class="pmf__matching-basics">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">search term(s)</th>
                                <th scope="col">N</th>
                                <th scope="col">result</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>include characters</td>
                                <td>enkidu, gilgamesh</td>
                                <td>4</td>
                                <td>SHOW fics with "Enkidu" OR "Gilgamesh" within the first 4 character tags</td>
                            </tr>
                            <tr>
                                <td>exclude characters</td>
                                <td>enkidu, gilgamesh</td>
                                <td>4</td>
                                <td>HIDE fics with "Enkidu" OR "Gilgamesh" within the first 4 character tags</td>
                            </tr>
                        </tbody>
                    </table>
                </li>
                <li>
                    Search is case-insensitive and ignores diacritics (a = á, ä, ā), line breaks and extra spaces.
                    (Characters like ñ, ł, æ, ø, are letters, not diacritics: searching <span
                        class="search-term">Inigo</span> will match "<span class="str-match">Ín</span>igo" but not
                    "<span class="str-match">Íñ</span>igo")
                </li>
            </ul>
            <p>⚠ If you need a permanent blacklist, use <a href="https://greasyfork.org/en/scripts/3579-ao3-savior">AO3 savior</a>.</p>
        </details>
        <details class="pmf__info-section">
            <summary>How to filter</summary>
            <p>Choose between <strong>*wildcards</strong> (default) or <strong>regex</strong> (more flexible, for
                advanced users). <br>
                Wildcards are enough for most purposes:</p>
            <ul>
                <li>
                    <span class="search-term">uzumaki</span> ➜ matches "Naruto <span class="str-match">Uzumaki</span>",
                    "<span class="str-match">Uzumaki</span> Kushina"
                    but NOT "Uzumaki<span class="str-match">s</span>"
                </li>
                <li>
                    <span class="search-term">shika*</span> ➜ matches "<span class="str-match">Shika</span>ku" and
                    "<span class="str-match">Shika</span>maru Nara" but NOT "<span class="str-match">I</span>shikawa"
                </li>
            </ul>
            <p>Regex grants finer control, for example...</p>
            <ul>
                <li>alternate spellings: <span class="search-term">[RL]i[zs]a</span> ➜ Riza/Risa/Liza/Lisa
                </li>
                <li>limiting options: <span class="search-term">(Arnold|Ace).*Rimmer</span> ➜ don't match John or
                    Harold
                    Rimmer</li>
                <li>exclusions: <span class="search-term">[^(]doctor</span> ➜ match "The&nbsp;Doctor" but NOT
                    "The&nbsp;Master&nbsp;(Doctor&nbsp;Who)"
                </li>
            </ul>
            <details class="pmf__rx-cheatsheet">
                <summary>Regex cheatsheet</summary>
                <h4>Characters</h4>
                <dl>
                    <dt>.</dt>
                    <dd>any character</dd>
                    <dt>[abc]</dt>
                    <dd>any of a, b, or c</dd>
                    <dt>[^abc]</dt>
                    <dd>not a, b, or c</dd>
                    <dt>[a-g]</dt>
                    <dd>character between a &amp; g</dd>
                </dl>
                <h4>Operators</h4>
                <dl>
                    <dt>a* a+ a?</dt>
                    <dd>0 or more, 1 or more, 0 or 1 (.* = 0 or more of any character)</dd>
                    <dt>^abc$</dt>
                    <dd>start / end of the string (matches the exact tag "abc")</dd>
                    <dt>ab|cd</dt>
                    <dd>match ab OR cd</dd>
                    <dt>(abc)</dt>
                    <dd>group - e.g. (ab|cd)xy matches abxy or cdxy</dd>
                </dl>
                <h4>Special characters</h4>
                <dl>
                    <dt>. + * ? <br>^ $ | &#92; <br>{ } ( ) [ ]</dt>
                    <dd>
                        <p>can be:</p>
                        <ul>
                            <li>replaced with "." (=match any character)</li>
                            <li>escaped with &#92; ➜ &#92;? </li>
                            <li>enclosed in [] ➜ [?]</li>
                        </ul>
                    </dd>
                </dl>
                <p>See <a href="https://regexr.com/">https://regexr.com/</a> for more. Do note that the filter uses
                    javascript, which does not support all regex options.</p>
            </details>
        </details>
        <details class="pmf__info-section">
            <summary>Examples</summary>
            <h5>Example 1</h5>
            <table class="pmf__matching-examples">
                <thead>
                    <tr>
                        <th scope="col">We want…</th>
                        <th scope="col">setting</th>
                        <th scope="col">search term(s)</th>
                        <th scope="col">N</th>
                        <th scope="col">matches</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Fics with Leia in the first 3 character tags</td>
                        <td>Include Characters</td>
                        <td>leia</td>
                        <td>3</td>
                        <td>Leia, Leia Organa, Leia Skywalker</td>
                    </tr>
                    <tr>
                        <td>…that don't have Luke or Han as the main characters (it's fine if they're in second
                            place)
                        </td>
                        <td>Exclude Characters</td>
                        <td>luke skywalker, han solo</td>
                        <td>2</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <h5>Example 2:<br></h5>
            <table class="pmf__matching-examples">
                <thead>
                    <tr>
                        <th scope="col">We want…</th>
                        <th scope="col">setting</th>
                        <th scope="col">search term(s)</th>
                        <th scope="col">N</th>
                        <th scope="col">matches</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>relationships with Avon</td>
                        <td>Include Rels.</td>
                        <td>avon</td>
                        <td>1</td>
                        <td>Jarvik / Kerr Avon, Avon &amp; Servalan...</td>
                    </tr>
                </tbody>
            </table>
            <h5>Example 3 (with *wildcards):<br></h5>
            <table class="pmf__matching-examples">
                <thead>
                    <tr>
                        <th scope="col">We want…</th>
                        <th scope="col">setting</th>
                        <th scope="col">search term(s)</th>
                        <th scope="col">N</th>
                        <th scope="col">matches</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><em>platonic</em> relationships with Avon</td>
                        <td>Include Rels.</td>
                        <td>avon</td>
                        <td>1</td>
                        <td>Jarvik / Kerr Avon, Avon &amp; Servalan...</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Exclude Rels.</td>
                        <td>/*avon, avon*/</td>
                        <td>1</td>
                        <td>relationships containing "Avon" but not "/"</td>
                    </tr>
                </tbody>
            </table>
            <h5>Example 4 (with regex): <br>
                you don't want to read fics focusing on original
                characters, but don't mind if they're part of the story.</h5>
            <table class="pmf__matching-examples">
                <thead>
                    <tr>
                        <th scope="col">We want…</th>
                        <th scope="col">setting</th>
                        <th scope="col">search term(s)</th>
                        <th scope="col">N</th>
                        <th scope="col">matches</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>to HIDE fics with OCs in first or second place</td>
                        <td>Exclude Characters</td>
                        <td>original.*character, O[FM]?C</td>
                        <td>1</td>
                        <td>Original Characters, Original Female Character, OC, OMC…</td>
                    </tr>
                </tbody>
            </table>
            <h5>Example 5a (with *wildcards)</h5>
            <table class="pmf__matching-examples">
                <thead>
                    <tr>
                        <th scope="col">We want…</th>
                        <th scope="col">setting</th>
                        <th scope="col">search term(s)</th>
                        <th scope="col">N</th>
                        <th scope="col">matches</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Katara/... as the first ship</td>
                        <td>Include Rels.</td>
                        <td>/*katara, katara*/</td>
                        <td>1</td>
                        <td>Aang / Katara, Katara / Toph, Katara / Zuko...</td>
                    </tr>
                    <tr>
                        <td>...EXCEPT Katara/Aang (okay in the background)</td>
                        <td>Exclude Rels.</td>
                        <td>aang/katara, katara/aang</td>
                        <td>2</td>
                        <td>Aang / Katara, Katara / Aang</td>
                    </tr>
                </tbody>
            </table>
            <p>Wait! In some fandoms this would work, but Avatar
                uses "Kataang", "Zutara", etc. <span class="search-term">"kat*, *ara"</span> would match those but
                also,
                e.g., "<span class="str-match">Kat</span>ara &amp; Sokka". <br>
                We could list them all, or...
            </p>
            <h5>Example 5b (with regex)</h5>
            <table class="pmf__matching-examples">
                <thead>
                    <tr>
                        <th scope="col">We want…</th>
                        <th scope="col">setting</th>
                        <th scope="col">search term(s)</th>
                        <th scope="col">N</th>
                        <th scope="col">matches</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Katara/... as the first ship </td>
                        <td>Include Rels.</td>
                        <td>/.*katara, katara.*/, ^kat[a-z]+$, ^[a-z]+tara$</td>
                        <td>1</td>
                        <td>as in 5a + "Kat..." followed by any letters without spaces + "...tara".</td>
                    </tr>
                    <tr>
                        <td>...EXCEPT Katara/Aang (fine if it's in the background)</td>
                        <td>Exclude Rels.</td>
                        <td>aang / katara, katara / aang</td>
                        <td>2</td>
                        <td>as in 5a</td>
                    </tr>
                </tbody>
            </table>
        </details>
    </div>`

    // add collapsible menu directly above AO3's filter sidebar. Get DOM objects.
    if (!ao3FilterSidebar) { return }
    ao3FilterSidebar.insertAdjacentHTML('afterbegin', sidebarHTML)
    const filterMenu = {
        container: $('.pmf__sidebar-head'),
        expander: $('.pmf__sidebar-head .expander'),
        toggle: $('#pmf__filter-toggle'),
    }
    const settingsMenu = {
        container: $('.pmf__config-head'),
        expander: $('.pmf__config-head .expander'),
        AO3sav: $('#pmf__setting-AO3-sav'),
        debugMode: $('#pmf__setting-debug'),
    }
    const textFields = $$('.pmf__tag-block :is(input[type="text"], textarea)'),
        checkboxFields = $$('.pmf__tag-block input[type="checkbox"]')

    // DEFINE FILTER FIELDS + GETTERS
    class tagBlock { // set elements, get values. If the checkbox is unselected, disable the other fields.
        constructor(includeOrExclude, tagType, storedVals) {
            const tagBlock = $(`.pmf__tag-block.${includeOrExclude}.${tagType}`)
            this.defaultMatchResult = (includeOrExclude === 'include') // match = true for includes, match = false for excludes
            this.checkboxField = tagBlock.querySelector('input[type=checkbox]')
            this.textareaField = tagBlock.querySelector('.pmf__tag-list')
            this.tagLimitField = tagBlock.querySelector('.pmf__within input')
            this.checkboxField.addEventListener('change', () => {
                const tagBlockEnabled = this.checkboxField.checked
                this.textareaField.readOnly = !tagBlockEnabled
                this.tagLimitField.readOnly = !tagBlockEnabled
            })

            if (!storedVals) { return }
            this.checkboxField.checked = storedVals.check
            this.textareaField.value = storedVals.pattern
            this.tagLimitField.value = storedVals.tagLim
            this.checkboxField.dispatchEvent(new Event('change')) // apply formatting
        }
    }

    class currentFilter { // store the filter values at the time the object is created
        constructor(tagBlock) {
            this.check = tagBlock.checkboxField.checked
            this.pattern = tagBlock.textareaField.value.split(',').map(s => removeDiacriticsAndExtraSpaces(s))
            this.tagLim = tagBlock.tagLimitField.value.trim()
            this.isValid = (this.pattern.length > 0 && this.tagLim.length > 0) // ok to save
            this.checkTags = (this.check && this.isValid) // ok to commit
            this.defaultMatchResult = tagBlock.defaultMatchResult
        }
    }

    // SET INITIAL VALUES ------------------------------------------------------------
    // Menu
    settingsMenu.AO3sav.checked = stored.ao3SaviorIsInstalled
    settingsMenu.debugMode.checked = stored.debugMode
    toggleExpand(filterMenu, stored.menuIsExpanded)
    let filterIsOn = stored.filterIsOn
    setFilterStatus()

    // Define & populate filter fields
    const characterBlock = new tagBlock('include', 'characters', stored.characters),
        relationshipBlock = new tagBlock('include', 'relationships', stored.relationships),
        excludedCharacterBlock = new tagBlock('exclude', 'characters', stored.excludedCharacters),
        excludedRelationshipBlock = new tagBlock('exclude', 'relationships', stored.excludedRelationships)
    $(`.pmf__syntax input[value=${stored.format}]`).checked = true

    // Filter on load: add 20ms delay to prevent conflicts with AO3 savior (which runs after a 15ms delay)
    if (filterIsOn) {
        const delay = stored.ao3SaviorIsInstalled ? 20 : 0
        setTimeout(applyFilters, delay)
    }

    // ADD EVENT LISTENERS ----------------------------------------------------------
    // (expand controls, toggle filters off/on, apply/clear filters ... and save)

    filterMenu.expander.addEventListener('click', () => {
        const isExpanded = toggleExpand(filterMenu)
        GM_setValue('isExpanded', isExpanded)
    })
    settingsMenu.expander.addEventListener('click', () => { toggleExpand(settingsMenu) }) // collapsed by deafult
    filterMenu.toggle.addEventListener('click', toggleFilterStatus)
    settingsMenu.AO3sav.addEventListener('change', function () { GM_setValue('ao3SaviorIsInstalled', this.checked) })
    settingsMenu.debugMode.addEventListener('change', function () {
        debugModeOn = this.checked
        GM_setValue('debugMode', debugModeOn)
    })

    // BUTTON: info/help popup
    for (const infoButton of $$('.pmf__ui .question')) {
        infoButton.addEventListener('click', openAo3Modal)
    }

    // BUTTON: Apply filters. If filters are off, turn them on.
    $('.pmf__apply').addEventListener('click', () => {
        if (!filterIsOn) { toggleFilterStatus() }
        const thisFilter = applyFilters()
        saveFilterFields(...thisFilter)
    })

    // BUTTON: Clear filters
    $('.pmf__ui .footnote a').addEventListener('click', () => {
        for (const field of textFields) { field.value = field.defaultValue }
        for (const field of checkboxFields) {
            field.checked = false
            field.dispatchEvent(new Event('change'))
        }
        showAllWorks()
        GM_deleteValues(['characters', 'relationships', 'excludedCharacters', 'excludedRelationships'])
    })

    // ------------------------------------------------------------------------------------
    // collapse/expand controls
    function toggleExpand(target, ...forceExpand) {
        const expanded = target.container.classList.toggle('expanded', forceExpand[0])
        target.container.classList.toggle('collapsed', !expanded)
        target.expander.setAttribute('aria-expanded', expanded)
        return expanded
    }

    // toggle filters off/on
    function toggleFilterStatus() {
        if (noFilterYet) { applyFilters() }
        filterIsOn = !filterIsOn
        setFilterStatus()
    }
    function setFilterStatus() {
        GM_setValue('filterIsOn', filterIsOn) // store value
        workslistContainer.classList.toggle('show-priority-filters', filterIsOn) // disable the CSS which hides stories

        // format the toggle button
        filterMenu.toggle.setAttribute('aria-pressed', filterIsOn)
        filterMenu.toggle.classList.toggle('current', filterIsOn)
        filterMenu.toggle.textContent = filterIsOn ? 'On' : 'Off'
    }

    function showAllWorks() {
        for (let i = 0; i < works.length; i++) {
            works[i].classList.toggle('pmf__work', false)
        }
    }

    function saveFilterFields(chars, rels, xChars, xRels) {
        [
            ['characters', chars], ['relationships', rels], ['excludedCharacters', xChars], ['excludedRelationships', xRels],
        ].forEach(([settingName, tagSet]) => {
            GM_setValue(settingName, { check: tagSet.check, pattern: tagSet.pattern, tagLim: tagSet.tagLim })
        })
        GM_setValue('format', $('.pmf__syntax input[name="format"]:checked').value)
    }

    // Hide works which don't prioritise your characters/relationships. Return the values of the current filter for saving.
    function applyFilters() {

        noFilterYet = false

        // Retrieve filter values
        const format = $('.pmf__syntax input[name="format"]:checked').value,
            characters = new currentFilter(characterBlock),
            relationships = new currentFilter(relationshipBlock),
            excludedCharacters = new currentFilter(excludedCharacterBlock),
            excludedRelationships = new currentFilter(excludedRelationshipBlock)
        const thisFilter = [characters, relationships, excludedCharacters, excludedRelationships]
        debugLog(`thisFilter = ${JSON.stringify(thisFilter)}`)

        // If no valid characters/relationships are found, exit early (and reveal all)
        if (!characters.checkTags && !relationships.checkTags && !excludedCharacters.checkTags && !excludedRelationships.checkTags) {
            showAllWorks()
            debugLog('No valid filters found!')
            return thisFilter
        }

        // iterate through works
        for (let i = 0; i < works.length; i++) {

            // Get first n relationships/characters and check if any are in the user settings
            const firstNchars = getFirstNTags(works[i], '.characters', characters, excludedCharacters),
                firstNrels = getFirstNTags(works[i], '.relationships', relationships, excludedRelationships),
                charMatch = matchTags(characters, firstNchars, format),
                relMatch = matchTags(relationships, firstNrels, format),
                xCharMatch = matchTags(excludedCharacters, firstNchars, format),
                xRelMatch = matchTags(excludedRelationships, firstNrels, format)

            // Show work if it prioritises your tags and none of the blacklisted tags. Otherwise, hide it.
            const workIsValid = relMatch && charMatch && !xRelMatch && !xCharMatch
            debugLog(`firstNchars = ${firstNchars && firstNchars.join(', ')} || firstNrels = ${firstNrels && firstNrels.join(', ')}
    workIsValid = ${workIsValid}:
    relMatch = ${relMatch}, charMatch = ${charMatch}, xRelMatch = ${xRelMatch}, xCharMatch = ${xCharMatch}`)
            works[i].classList.toggle('pmf__work', !workIsValid)
            if (workIsValid) { continue }

            // If AO3 savior hid the work, add warning <span> to its fold element, then continue to the next work.
            if (stored.ao3SaviorIsInstalled && works[i].classList.contains('ao3-savior-work')) {
                if (!works[i].querySelector('.pmf__reason-for-ao3-sav')) {
                    const pmfReason = '<span class = "pmf__reason-for-ao3-sav">; does not prioritise your tags</span>'
                    const ao3savBlockedTag = works[i].querySelector('.ao3-savior-reason strong')
                    ao3savBlockedTag.insertAdjacentHTML('afterend', pmfReason)
                }
                continue
            }

            // Add explanation and "show work" button, if it does not already exist. If it does, hide by default.
            let fold = { container: works[i].querySelector('.pmf__fold'), get btn() { return fold.container?.querySelector('.pmf__fold-btn') } }
            if (!fold.container) { fold = createFold(works[i]) }
            toggleHideWork(fold, true)
        }
        return thisFilter
    }

    // Get the first N tags (where N = largest of the two tag limits). Remove diacritics.
    function getFirstNTags(work, tagClassSelector, includedTagSet, excludedTagSet) {
        const checkTags = (includedTagSet.checkTags || excludedTagSet.checkTags)
        return checkTags && [...work.querySelectorAll(tagClassSelector)]
            .slice(0, Math.max(includedTagSet.tagLim, excludedTagSet.tagLim))
            .map(tag => removeDiacriticsAndExtraSpaces(tag.textContent))
    }

    // Check if the selected tags match the given filter
    function matchTags(tagSet, tagsToCheck, format) {
        if (!tagSet.checkTags) { return tagSet.defaultMatchResult } // show work (TRUE) for included tags, hide (FALSE) for excluded
        tagsToCheck = tagsToCheck.slice(0, tagSet.tagLim)
        for (const userTag of tagSet.pattern) {
            let pattern = removeDiacriticsAndExtraSpaces(userTag)
            pattern = (format === 'wildcard') ? wildcardPattern(userTag) : userTag // FIX magic string
            const rx = RegExp(pattern, 'gi')
            for (const workTag of tagsToCheck) {
                if (rx.test(workTag)) { return true }
            }
        }
        return false
    }

    // Format wildcard * search pattern (escaping all other special characters)
    function wildcardPattern(pattern) {
        return '\\b'
            + pattern.replaceAll(/[.+?^=!:${}()|[\]/\\]/g, '\\$&').replaceAll('*', '.*')
            + '\\b'
    }

    // Remove diacritics (this will not affect actual letters like ñ) and extra spaces
    // https://www.davidbcalhoun.com/2019/matching-accented-strings-in-javascript/
    function removeDiacriticsAndExtraSpaces(str) {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/gi, '')
            .replace(/[\s\n]{2,}/g, ' ')
            .trim()
    }

    // Mimic AO3 savior fold (not an exact copy: AO3 savior wraps the work blurb in a div)
    function createFold(thisWork) {
        const fold = {
            container: createNewElement('div', 'pmf__fold'),
            note: createNewElement('span', 'pmf__fold-note', 'This work does not prioritise your preferred tags.'),
            reason: createNewElement('span', 'pmf__hide-reason'),
            btn: createNewElement('button', 'pmf__fold-btn', 'Show'),
        }

        fold.container.append(fold.note, fold.reason, fold.btn)
        thisWork.prepend(fold.container)
        fold.btn.addEventListener('click', () => { toggleHideWork(fold) })
        return fold
    }

    function toggleHideWork(fold, forceToggle) {
        const isHidden = fold.container.classList.toggle('pmf__hidden', forceToggle)
        fold.btn.textContent = isHidden ? 'Show' : 'Hide'
    }

    // AO3 help/info modal: manually replicate the open event, allow AO3 to handle closing
    const ao3Modal = {
        bg: $('#modal-bg'),
        loading: $('#modal-bg .loading'),
        wrapper: $('#modal-wrap'),
        window: $('#modal'),
        content: $('#modal .userstuff'),
        closeBtn: $('#modal .action.modal-closer'),
    }

    function openAo3Modal() {
        debugLog('attempting to open modal...')
        ao3Modal.content.insertAdjacentHTML('afterbegin', infoModalHTML) // add content
        ao3Modal.window.querySelector('.title').textContent = 'Tag priority filters' // select each time: I think AO3 rebuilds this element on close
        window.addEventListener('keydown', closeAo3Modal)

        // CSS: replicate AO3's inline styles. The default close event clears them.
        const scrollbarWidth = `${window.innerWidth - document.body.clientWidth}px`
        for (const [el, ruleset] of [ // eslint-disable-next-line @stylistic/quote-props
            [document.body, { 'margin-right': scrollbarWidth, overflow: 'hidden', height: '100vh' }], // prevent scrolling!
            [ao3Modal.bg, { display: 'block', opacity: 0, transition: 'opacity 150ms ease-in' }],
            [ao3Modal.wrapper, { display: 'block', opacity: 0, transition: 'opacity 150ms ease-in', top: `${window.scrollY}px` }], // position on page
        ]) {
            Object.assign(el.style, ruleset)
        }
        ao3Modal.loading.style.display = 'none'

        setTimeout(() => {
            for (const el of [ao3Modal.bg, ao3Modal.wrapper, ao3Modal.window]) { el.style.opacity = 1 }
            ao3Modal.window.classList.add('tall')
        }, 0)
        setTimeout(() => {
            for (const el of [ao3Modal.bg, ao3Modal.wrapper]) {
                el.style.removeProperty('transition')
                el.style.removeProperty('opacity')
            }
        }, 300)
    }

    function closeAo3Modal(e) { // and remove event listener if the modal is hidden. Bit of a // HACK.
        const modalIsOpen = (ao3Modal.bg.style.display != 'none')
        if (!modalIsOpen || e.key === 'Escape') { window.removeEventListener('keydown', closeAo3Modal) }
        if (modalIsOpen && e.key === 'Escape') { ao3Modal.closeBtn.click() }
    }

    function createNewElement(elementType, className, textContent) {
        const el = document.createElement(elementType)
        el.className = className
        el.textContent = textContent
        return el
    }

    const hiderCss = `
    .pmf__fold, .ao3-sav-pmf__reason {
        display: none
    }
    .pmf__work {
        & > .pmf__fold {
            align-items: center;
            display: flex;
            justify-content: flex-start;
            & .pmf__fold-btn { margin-left: auto; }
        }
        & > .ao3-sav-pmf__reason { /* span inserted in AO3 savior text */
            display: inherit
        }
        & > .pmf__hidden ~ * { 
            display: none;
        }
        & > .pmf__fold:not(.pmf__hidden) {
            border-bottom: 1px dashed;
            margin-bottom: 15px;
            padding-bottom: 5px;
        }
    }
    ol.work:not(.show-priority-filters) > .pmf__work > * {
        display: inherit;
        &.pmf__fold { display: none }
    }`

    GM_addStyle(hiderCss + `.pmf__ui {
    font-size: 0.9em;

    & h3, h4, dt, dd {
        margin: unset;
    }
    & button {
        margin: 0.15em 0;
    }

    /* SIDEBAR */

    &.pmf__sidebar {
        background-color: antiquewhite;
        padding: 0.643em;
    }
    & .pmf__sidebar-head {
        display: flex;
        justify-content: space-between;
        & .expander {
            font-size: 1.2em;
        }
        & #pmf__filter-toggle {
            width:2.5em;
            &.current {
                font-weight: 700;
            }
            &:hover, &:focus-visible {
                color: #900;
                border-top: 1px solid #999;
                border-left: 1px solid #999;
                box-shadow: inset 2px 2px 2px #bbb;
            }
        }
    }

    & .pmf__wrap {
        margin-top: 1.3em;
        & > .pmf__head {
            padding: 0.1em;
            border-bottom: solid 2px firebrick;
        }
    }        
    & .pmf__tag-block, & .pmf__wrap .pmf__head {
        margin-bottom: 0.4em;
    }
    & .pmf__syntax {
        margin-top: 2em;
    }
    & .pmf__apply {
        margin: 1em 0;
        &::before { content: "🡆\\00a0" } /*00a0 for nbsp, slash escaped*/
    }
    & .pmf__config-head {
        display: flex;
        justify-content: space-between;
        & .expander {
            font-size: 1.1em;
        }
        & .footnote {
            min-width: fit-content;
        }
        & + .expandable {
            background-color: #FCF5EB;
            box-shadow: inset 0px 7px 7px -7px #999;
            padding: 1em 0.5em;
            box-sizing: border-box;
            display: grid;
            row-gap: 0.5em;
            & #pmf__setting-debug + span + span::before { content: "🐞"; margin-right: 0.3em; }
            & .save::before { content: "💾" ; float:left }
            & .load::before { content: "🠋" ; text-decoration: underline; float:left}
            & .actions { margin-top: 0.5em;}
        }
    }

    /* MENU ELEMENTS */

    & dt.collapsed + dd.expandable {
        display: none;        
    }
    & textarea:read-only, input[type=text]:read-only {
        background-color: #FCF5EB;
        color: #525252;
    }
    & .pmf__tag-list {
        resize: vertical;
        width: 100%;
        box-sizing: border-box;
        min-height: unset;
        margin: 0.25em 0 0.35em 0;
        padding: 0.3em;
        font-family: monospace;
    }
    & .pmf__within {
        display: block;
        text-align: right;
        & .pmf__tag-lim {
            width: 1.3em;
            height: 1.3em;
	        text-align: center;
        }
    }
    & fieldset {
        margin: 0 0 0.6em 0;
        box-sizing: border-box;
        width: 100%;
        box-shadow: inset 0 1px 2px #ccc; /*mimic AO3 textboxes*/
        background-color: #FCF5EB;
        & .question {
            width: unset;
            font-size: 1em;
            vertical-align:text-top;
            float: right;
        }
    }
    & label {
        white-space: nowrap;
        margin-right: unset;
    }
    & .pmf__explanatory-text {
        display: block;
        font-size: 0.8em;
        margin-left: 2em;
        line-height: 1.1em;
        color: #525252;
    }
    & .actions button {
        box-sizing: border-box;
        width: 100%;
        height: auto;
    }
    & .question {
        padding:0 0.55em;
        margin: 0 1px;
        background: #d1e1ef;
        color: #2a547c;
        border: 1px solid #2a547c;
        border-radius: 0.75em;
        box-shadow: -1px -1px 2px rgba(0,0,0,0.25);
        font: bold 0.75em Georgia, serif;
        vertical-align: super;
        cursor: help;
    }
    & .footnote {
        padding-right: unset;
    }

    /* MODAL POPUP */

    &.popup {
        font-size: 1em;
        & .pmf__search-term {
            font-family: 'Courier New', Courier, monospace;
        }
        & .pmf__str-match {
            text-decoration: underline;
        }
        & > details {
            margin: 0.9em 0;
            & > :last-child {
                margin-bottom: 2em; /*collapsible spacing*/
            }
            & > summary {
                border-bottom: solid 2px firebrick;
                font-family: Georgia, serif;
                font-size: 1.15em;
                line-height: 1.5em;
                font-weight: 700;
            }
        }
        & summary {
            cursor: default;
        }
        & .pmf__rx-cheatsheet {
            padding-left: 1.5em;
            border-left: solid #dadada 4px;
            & summary {
                margin-left: -1.5em;
                background-color: #dadada;
                padding: 0.2em;
            }
            & h4 {
                margin-top: 1em;
            }
            & dl {
                display: grid;
                grid-template-columns: 6.5em 1fr;
                padding-left: 1em;
                align-items: center;
                & dt {
                    background-color: #FCF5EB;
                    font-weight: 700;
                    font-family: 'Courier New', Courier, monospace;
                    padding-left: 0.4em;
                    margin-right: 1em;
                }
            }
            & p, ul, li {
                margin: 0;
                padding: unset inherit;
            }
        }
        & li > table {
            margin: 0.5em 0; /*spacing around table*/
        }
        & table {
            table-layout: fixed;
            width: 100%;
            border-collapse: collapse;
            font-size: 0.8em;
            background-color:floralwhite;
            & th, td {
                padding: 0.4em;
            }
            &.pmf__matching-basics {
                border: 1px solid cadetblue;
                thead {
                    background-color: lightblue;
                    & th:nth-child(-n + 2) { width: 8em; } /* first two cols. N starts at 0, so -n+2: 0+2, -1+2 */
                    & th:nth-child(3) { width: 1em; }
                }
                & th:nth-child(-n + 3) { text-align: center; }
                & td:nth-child(-n + 3) { text-align: center; font: 1.1em 'Courier New', Courier, monospace; }
            }
            &.pmf__matching-examples {
                border: 1px solid firebrick;
                & th + th, td + td {
                    border-left: 1px solid palevioletred;
                }
                & thead {
                    background-color: lightpink;
                    & th:nth-child(2) { width: 7em; }
                    & th:nth-child(4) { width: 1em; }
                }
                & td:nth-child(2), td:nth-child(3), td:nth-child(4) { font: 1.1em 'Courier New', Courier, monospace; }
                & td:nth-child(4) { text-align: center; }
            }
        }
    }

}`)

    function debugLog(input) {
        if (settingsMenu.debugMode.checked) { console.log(input) }
    }

})()
