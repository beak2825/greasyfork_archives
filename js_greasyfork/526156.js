// ==UserScript==
// @name         AO3: just my languages
// @namespace    https://greasyfork.org/en/users/757649-certifieddiplodocus
// @version      1.2.3
// @description  Reduce language options to your preferences
// @author       CertifiedDiplodocus
// @match        http*://archiveofourown.org/*
// @exclude      /^https?:\/\/archiveofourown\.org(?!\/search$|(.*\/(works|bookmarks)(?![^\/?])))/
// @exclude      /.org/(works|bookmarks)$/
// @exclude      /(works|bookmarks)\/search[?](?!.*edit_search=true)/
// @exclude      /\/works\/[0-9]+(?![0-9]*\/edit)/
// @exclude      /\/bookmarks\/[0-9]+
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>𒈾</text></svg>
// @grant        GM_addStyle
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/526156/AO3%3A%20just%20my%20languages.user.js
// @updateURL https://update.greasyfork.org/scripts/526156/AO3%3A%20just%20my%20languages.meta.js
// ==/UserScript==

/* PURPOSE: Simplify language search options on AO3. Choose any combination of the following:
    1 - Show only your chosen languages in the dropdown list (when filtering and/or creating or editing a work)
    2 - Bold some languages in the dropdown (can be chosen independently from option 1)
    3 - Autofill:
            - Monolingual: automatically set the dropdown to your preferred language
            - Multilingual: add a query to each search to show fic in multiple languages at once (e.g. English AND Spanish AND Thai)
    4 - Manual multilingual search: click the 𒈾 button to add/remove multilingual filters. Also works with autofill.

When creating, importing or editing a work, you can:
    5 - Show only your chosen languages in the dropdown
    6 - Set a default language (⚠ use with caution ⚠)

TIP: add all languages close to yours (e.g. if you read English you can read Scots, if you read Spanish
you have a fair shot at Galego and Asturianu, etc)
---------------------------------------------------------------------------------------------------------------------- */
(function () {
    'use strict'
    const $ = document.querySelector.bind(document) // shorthand for readability
    const $$ = document.querySelectorAll.bind(document)

    /* ======================== 𒈾 USER SETTINGS (save to plaintext file in case of script updates) 𒈾 ==============================

    LANGUAGE CODES are listed at the end of this script. (AO3 appears to use a mix of 2 and 3-character codes.)
    Leave blank for the AO3 default appearance.

    OPTIONAL: autofill new searches to your chosen language(s). Filters can still be changed by hand.
    This carries a small risk of hiding mistagged fics, so is disabled by default (filtering.autofill: 0).
        0 - AO3 default (blank dropdown)
        1 - MONOLINGUAL autofill (fills the dropdown with your preferred language)
        2 - MULTILINGUAL autofill (adds a search query to show fic in all your preferred languages at once)
               * note: may be slower / have more impact on the servers. If noticeable, try reducing the number of languages. */

    const languages = {
        dropdown: ['en', 'es', 'fr', 'ptBR', 'ptPT', 'sux'],
        bolded: ['en', 'es', 'fr'],
        multilingualSearch: ['ptBR', 'ptPT', 'sux'],
    }
    const filtering = {
        modifyDropdown: true,
        autofill: 0,
        defaultLanguage: 'es',
    }
    const editing = {
        modifyDropdown: true,
        defaultLanguage: 'en', // OPTIONAL: add a language to autofill on new works
    }

    // ===============================================================================================================================

    // Check that settings make sense
    const errPrefix = '[AO3: just my languages - userscript] \n⚠ Error: '
    if (!languages.dropdown.some(Boolean) && (filtering.modifyDropdown || editing.modifyDropdown)) {
        throw errPrefix + 'To modify the dropdown you must add some languages first!'
    }
    if (filtering.autofill === 1 && !filtering.defaultLanguage) { throw errPrefix + 'To autofill the dropdown, add a default language first!' }
    if (filtering.autofill === 2 && !(languages.multilingualSearch || languages.dropdown)) { throw errPrefix + 'To autofill a multilingual search, add some languages first!' }

    const pageURL = window.location.href
    const changeEvent = new Event('change')
    let dropdown, searchbox

    // CSS
    GM_addStyle (`
    .babel-button {
        cursor: copy;
    }
    span.babel-normal-align {
        vertical-align: inherit;
    }
    span.babel-button-filter-on {
        color: mintcream;
        background-color: darkgreen;
        border-color: darkgreen;
    }
    .just-my-langs > option {
        display: none;
        &[value=''], /* always include the default option (blank) */
        &.jml__show {
            display: initial;
        }
        &.jml__bold {
            font-weight: bold;
        }
    }`)

    // -------------------------------------------------------------------------------------------------------------------------------

    // Show only selected languages when creating/editing works
    if ((/\/works\/(new.*|([0-9]+\/edit))/gi).test(pageURL)) {
        const dropdowns = $$('select[id$="language_id"') // handle language selection in new?imported page, including parent work (IDs are different but all end in "language_id")
        for (dropdown of dropdowns) {
            verifyLanguageCodes()
            if (editing.modifyDropdown) { reduceDropdownLangs(); boldDropdownLangs() }
            if (pageURL.includes('/works/new')) { autofillBlankDropdown(editing.defaultLanguage) }
        }
        return
    }

    // -------------------------------------------------------------------------------------------------------------------------------

    // select the right elements for the page
    if (pageURL.includes('/bookmarks')) {
        dropdown = $('#bookmark_search_language_id')
        searchbox = $('#bookmark_search_bookmarkable_query')
    } else {
        dropdown = $('#work_search_language_id')
        searchbox = $('#work_search_query')
    }
    verifyLanguageCodes()

    // show only my languages (and the default 'blank' value) in the dropdown
    if (filtering.modifyDropdown) { reduceDropdownLangs(); boldDropdownLangs() }

    // Set filter for searching multiple languages. (If user didn't fill in multiLanguages, use languages.dropdown instead.)
    const languageFilters = 'language_id:' + (languages.multilingualSearch || languages.dropdown).join(' OR language_id:')

    /* Autofill (if the dropdown/searchbox are blank)
        1 - MONOLINGUAL AUTOFILL: set dropdown to the default language.
        2 - MULTILINGUAL AUTOFILL: insert search string into "Search within results / Any field": "language_id:egy OR language_id:sux"   */

    switch (filtering.autofill) {
        case 1:
            autofillBlankDropdown(filtering.defaultLanguage)
            break
        case 2:
            if (searchbox.value.trim().length === 0) { searchbox.value = languageFilters }
    }

    // Add (𒈾) button for multilingual searches next to "Languages" label.
    const dropdownLabel = dropdown.parentElement.previousElementSibling
    const babelButton = createNewElement('a', 'question')
    const span = createNewElement('span', 'symbol question babel-button', '𒈾')
    babelButton.append(span)
    dropdownLabel.append(babelButton)

    // On click of (𒈾), add OR remove language filters from the "all fields" searchbox (after the current query)
    babelButton.addEventListener('click', function (e) {
        const searchboxContent = searchbox.value.trim()
        if (searchboxContent.length === 0) {
            searchbox.value = languageFilters
        } else if (!searchboxContent.includes(languageFilters)) {
            searchbox.value = searchboxContent + ' ' + languageFilters // toggle on
        } else {
            searchbox.value = searchboxContent.replace(languageFilters, '').trim() // toggle off
        }
        searchbox.dispatchEvent(changeEvent)
    })

    // Conditional CSS: alignment + colour (on search pages, 𒈾 should use the default page style to match the neighbouring "?")
    span.classList.toggle('babel-normal-align', !pageURL.includes('/search'))
    searchbox.addEventListener('change', indicateBabelStatus)
    indicateBabelStatus()

    // -------- FUNCTIONS ------------------------------------------------------------------------------------------------------------

    // Colour 𒈾 green as long as the search box contains the filter (check with different site skins). Set the tooltip.
    function indicateBabelStatus() {
        const languageFiltersOn = searchbox.value.includes(languageFilters)
        span.classList.toggle('babel-button-filter-on', languageFiltersOn)
        babelButton.setAttribute(
            'title', `${languageFiltersOn ? 'Searching' : 'Search'} multiple languages:\n${languages.multilingualSearch.join(', ')}`
        )
    }

    // Show only your chosen languages (+ blank option) in the dropdown (filter or editing)
    function reduceDropdownLangs() {
        dropdown.classList.add('just-my-langs')
        for (const userLang of languages.dropdown) {
            dropdown.querySelector(`[lang="${userLang}"]`).classList.add('jml__show')
        }
    }

    // Bold languages in the dropdown
    function boldDropdownLangs() {
        if (!languages.bolded.some(Boolean)) { return }
        for (let userLang of languages.bolded) {
            dropdown.querySelector(`[lang="${userLang}"]`).classList.add('jml__bold')
        }
    }

    // Autofill the dropdown if it is empty and the user selected a default language
    function autofillBlankDropdown(defaultLang) {
        if (!defaultLang || dropdown.value) { return }
        dropdown.querySelector(`[lang="${defaultLang}"]`).setAttribute('selected', 'selected')
    }

    // Check that all user languages exist (run after the dropdown is set)
    function verifyLanguageCodes() {
        if (!dropdown.length) { throw errPrefix + 'No dropdown found!' }
        const allUserLanguages = new Set( // no duplicates
            [...languages.dropdown, ...languages.bolded, ...languages.multilingualSearch, 
                filtering.defaultLanguage, editing.defaultLanguage]
                .filter(x => x) // no empty values
        )
        const ao3LangList = new Set(
            [...dropdown.children].map(el => el.getAttribute('lang'))
        )
        const invalidLanguageCodes = allUserLanguages.difference(ao3LangList)
        if (invalidLanguageCodes.size === 0) { return true }
        console.error(errPrefix + 'Could not find these language codes: "' + [...invalidLanguageCodes].join(', ') + '"\n'
            + 'Please check your settings for typos.\n\n'
            + 'User-selected languages: ' + [...allUserLanguages].join(', '))
        return false
    }

    function createNewElement(elementType, className, textContent) {
        const el = document.createElement(elementType)
        el.className = className
        el.textContent = textContent
        return el
    }

    /* --------- LANGUAGE CODES ON AO3 ------------------------------------------------------------------------------------------------

so:  af Soomaali
afr: Afrikaans
ain: Aynu itak | アイヌ イタㇰ
ar:  العربية
amh: አማርኛ
egy: 𓂋𓏺𓈖 𓆎𓅓𓏏𓊖
arc: ܐܪܡܝܐ | ארמיא
hy:  հայերեն
ase: American Sign Language
ast: asturianu
id:  Bahasa Indonesia
ms:  Bahasa Malaysia
bg:  Български
bn:  বাংলা
jv:  Basa Jawa
ba:  Башҡорт теле
be:  беларуская
bos: Bosanski
br:  Brezhoneg
ca:  Català
ceb: Cebuano
cs:  Čeština
chn: Chinuk Wawa
crh: къырымтатар тили | qırımtatar tili
cy:  Cymraeg
da:  Dansk
de:  Deutsch
et:  eesti keel
el:  Ελληνικά
sux: 𒅴𒂠
en:  English
ang: Eald Englisċ
es:  Español
eo:  Esperanto
eu:  Euskara
fa:  فارسی
fil: Filipino
fr:  Français
frr: Friisk
fur: Furlan
ga:  Gaeilge
gd:  Gàidhlig
gl:  Galego
got: 𐌲𐌿𐍄𐌹𐍃𐌺𐌰
gyn: Creolese
hak: 中文-客家话
ko:  한국어
hau: Hausa | هَرْشَن هَوْسَ
hi:  हिन्दी
hr:  Hrvatski
haw: ʻŌlelo Hawaiʻi
ia:  Interlingua
zu:  isiZulu
is:  Íslenska
it:  Italiano
he:  עברית
kal: Kalaallisut
kan: ಕನ್ನಡ
kat: ქართული
cor: Kernewek
khm: ភាសាខ្មែរ
qkz: Khuzdul
sw:  Kiswahili
ht:  kreyòl ayisyen
ku:  Kurdî | کوردی
kir: Кыргызча
fcs: Langue des signes québécoise
lv:  Latviešu valoda
lb:  Lëtzebuergesch
lt:  Lietuvių kalba
la:  Lingua latina
hu:  Magyar
mk:  македонски
ml:  മലയാളം
mt:  Malti
mnc: ᠮᠠᠨᠵᡠ ᡤᡳᠰᡠᠨ
qmd: Mando&#39;a
mr:  मराठी
mik: Mikisúkî
mon: ᠮᠣᠩᠭᠣᠯ ᠪᠢᠴᠢᠭ᠌ | Монгол Кирилл үсэг
my:  မြန်မာဘာသာ
myv: Эрзянь кель
nah: Nāhuatl
nan: 中文-闽南话 臺語
ppl: Nawat
nl:  Nederlands
ja:  日本語
no:  Norsk
azj: Азәрбајҹан дили | آذربایجان دیلی
ce:  Нохчийн мотт
ood: ‘O’odham Ñiok
ota: لسان عثمانى
ps:  پښتو
nds: Plattdüütsch
pl:  Polski
ptBR:  Português brasileiro
ptPT:  Português europeu
pa:  ਪੰਜਾਬੀ
kaz: qazaqşa | қазақша
qlq: Uncategorized Constructed Languages
qya: Quenya
ro:  Română
ru:  Русский
sco: Scots
sq:  Shqip
sjn: Sindarin
si:  සිංහල
sk:  Slovenčina
slv: Slovenščina
gem: Sprēkō Þiudiskō
sr:  Српски
fi:  suomi
sv:  Svenska
ta:  தமிழ்
tat: татар теле
mri: te reo Māori
tel: తెలుగు
th:  ไทย
tqx: Thermian
bod: བོད་སྐད་
vi:  Tiếng Việt
cop: ϯⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ
tlh: tlhIngan-Hol
tok: toki pona
trf: Trinidadian Creole
tsd: τσακώνικα
chr: ᏣᎳᎩ ᎦᏬᏂᎯᏍᏗ
tr:  Türkçe
uk:  Українська
urd: اُردُو
uig: ئۇيغۇر تىلى
vol: Volapük
wuu: 中文-吴语
yi:  יידיש
yua: maayaʼ tʼàan
yue: 中文-广东话 粵語
zh:  中文-普通话 國語


Userscript should activate only on URLs with language filtering.
If it doesn't activate on a page, and it should, let me know.
(Quick & dirty fix: delete the @exclude lines at the start of the script to enable the script on all of AO3.)

Include: all URLS with /works or /bookmarks; new/edit work; the exact url "https://archiveofourown.org/search"
Exclude: individual works/bookmarks, advanced search results (no tag filtering = no filter sidebar)

INCLUDE EXAMPLES
users/singlecrow/pseuds/raven/works?fandom_id=47992099
collections/SomeCollection/bookmarks
collections/SomeCollection/works?work_search%5...
languages/uig/works
bookmarks?bookmark_search%5Bsort_column%5D=cre...
bookmarks/search
works?work_search
works/new
works/new?import=true
works/123456/edit
works/123456/edit_tags
(works|bookmarks)/search?.*edit_search=true
search?commit=Search&edit_search=true

EXCLUDE EXAMPLES
works/search?commit=Search&work_search%5Bquery...       (no filter bar)
works/search?work_search%5Bquery%5D=&work_search...
works/search.*(?!edit_search=true)
works/123456
bookmarks/123456/edit
collections/Suggested_Good_Reads/works/18356108
.org/works
.org/bookmarks

TAMPERMONKEY REGEX ISSUE: the line
@exclude      /\/works\/[0-9]+(?![0-9]*\/edit)/
should also block /works/123/comments/edit, but doesn't. See https://stackoverflow.com/questions/68826178/exclude-in-userscript-not-working-as-expected
for another script where the regex fails in Tampermonkey, but not Violentmonkey
*/

})()
