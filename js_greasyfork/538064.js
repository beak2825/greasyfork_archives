// ==UserScript==
// @name         AO3 BetterShip
// @namespace    viasyla
// @version      1
// @description  save include/exclude tags for fast search; hide non-top-tag works
// @author       viasyla
// @match        *://archiveofourown.org/*
// @match        *://www.archiveofourown.org/*
// @icon         https://archiveofourown.org/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538064/AO3%20BetterShip.user.js
// @updateURL https://update.greasyfork.org/scripts/538064/AO3%20BetterShip.meta.js
// ==/UserScript==


/* START CONFIG */
const relpad = 3;
const charpad = 5;
/* END CONFIG */

const relationships = [];
const characters = [];

(function () {
    const style = document.createElement("style");
    style.textContent = `
        .workhide {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8em;
            margin: 0.15em 0;
            width: 100%;
        }
        [data-ospp-visibility="false"] > :not(.header),
        [data-ospp-visibility="false"] > .header > :not(h4) { display: none!important; }
        [data-ospp-visibility="false"] > div.workhide { display: flex!important; }
        [data-ospp-visibility="false"] > .header,
        [data-ospp-visibility="false"] > .header > h4 {
            margin: 0!important; min-height: auto; font-size: .9em; font-style: italic; }
        [data-ospp-visibility="false"] { opacity: .6; }

        .saved-filters-collapser { cursor: pointer; user-select: none; }
        .saved-filters, .saved-filters > div { margin-bottom: 0.6em; }
        .saved-filters { border-style: solid; border-width: 1px; padding: 0.6em; }
        .saved-filters textarea { min-height: 5em; width: 100%; margin-bottom: .3em;}
        .saved-filters div label { padding-left: 3px; }
        .prev-search span { color: #000; }
        .prev-search .temp { background: #ACEA72; }
        .prev-search .global { background: #93D2ED; }
        .prev-search .fandom { background: #B9AAED; }
        .sf-label { display: block; margin-top: .5em; }

        .ao3-saved-filters-section .sf-row {
            display: flex;
            align-items: center;
            gap: 0em;
            margin-bottom: 0.2em;
            width: 100%;
            box-sizing: border-box;
        }
        .ao3-saved-filters-section .checkbox {
            display: inline-flex;
            align-items: center;
            margin: 0;
        }

        .ao3-saved-filters-section .indicator {
            margin-right: 0.18em;
            padding: 0;
        }
        .ao3-saved-filters-section .sf-title {
            font-weight: normal;
            font-size: 1em;
            white-space: nowrap;
        }
        .ao3-saved-filters-section .action.js-save-filter {
            margin-left: auto;
            flex-shrink: 0;
        }
        .ao3-filter-shortcut-btn {
            width: 100% !important;
            box-sizing: border-box;
            margin: 0 0 0.7em 0;
            min-height: 1.286em;
            font-size: 100%;
            text-align: center;
        }
    `;
    document.head.appendChild(style);

    const fandomLinkElement = document.querySelector("h2.heading a");
    if (!fandomLinkElement) return;

    const fandomLink = fandomLinkElement.href;
    const tagName = fandomLinkElement.innerText;
    const isCharacterTag = !(tagName.includes("/") || tagName.includes("&"));

    if (isCharacterTag) {
        characters.push(tagName);
    } else if (!isCharacterTag) {
        relationships.push(tagName);
    }

    fetchFandomData(fandomLink.slice(fandomLink.indexOf("tags")), isCharacterTag)
    .then(fandomDataAvailable => {
        if (!fandomDataAvailable) return;
        insertFilterCheckboxes();

        document.getElementById('ospp-relationship-filter').addEventListener('change', applyTagFilter);
        document.getElementById('ospp-character-filter').addEventListener('change', applyTagFilter);

        applyTagFilter();
    });


    const isCharacterSearch = isCharacterTag;
    const isRelationshipSearch = !isCharacterTag;

    function insertFilterCheckboxes() {
        if (document.getElementById('ospp-relationship-filter')) return;
        const actions = document.querySelector('dd.submit.actions');
        if (!actions) return;
        const parent = actions.parentNode;
        const dd = document.createElement('dd');
        dd.style.marginBottom = '0.6em';

        // Relationship
        const relLabel = document.createElement('label');
        relLabel.setAttribute('for', 'ospp-relationship-filter');
        const relCheckbox = document.createElement('input');
        relCheckbox.type = 'checkbox';
        relCheckbox.id = 'ospp-relationship-filter';
        relCheckbox.disabled = !isRelationshipSearch;
        relCheckbox.checked = true && isRelationshipSearch;
        const relIndicator = document.createElement('span');
        relIndicator.className = 'indicator';
        relIndicator.setAttribute('aria-hidden', 'true');
        const relText = document.createElement('span');
        relText.textContent = 'Top Relationship';
        relText.style.fontWeight = "normal";

        relLabel.appendChild(relCheckbox);
        relLabel.appendChild(relIndicator);
        relLabel.appendChild(relText);

        // Character
        const charLabel = document.createElement('label');
        charLabel.setAttribute('for', 'ospp-character-filter');
        const charCheckbox = document.createElement('input');
        charCheckbox.type = 'checkbox';
        charCheckbox.id = 'ospp-character-filter';
        charCheckbox.disabled = !isCharacterSearch;
        charCheckbox.checked = true && isCharacterSearch;
        const charIndicator = document.createElement('span');
        charIndicator.className = 'indicator';
        charIndicator.setAttribute('aria-hidden', 'true');
        const charText = document.createElement('span');
        charText.textContent = 'Top Character';
        charText.style.fontWeight = "normal";

        charLabel.appendChild(charCheckbox);
        charLabel.appendChild(charIndicator);
        charLabel.appendChild(charText);

        relLabel.style.marginRight = "1.5em";
        relLabel.style.display = 'block';
        relLabel.style.marginBottom = '-1em';

        dd.appendChild(relLabel);
        dd.appendChild(document.createElement("br"));
        dd.appendChild(charLabel);

        parent.insertBefore(dd, actions);
    }


    function applyTagFilter() {
        const relChecked = document.getElementById('ospp-relationship-filter').checked && isRelationshipSearch;
        const charChecked = document.getElementById('ospp-character-filter').checked && isCharacterSearch;
        document.querySelectorAll(".index .blurb").forEach((blurb) => {
            const tags = blurb.querySelector("ul.tags");
            if (!tags) return;
            const relTags = Array.from(tags.querySelectorAll(".relationships")).slice(0, relpad).map(el => el.innerText);
            const charTags = Array.from(tags.querySelectorAll(".characters")).slice(0, charpad).map(el => el.innerText);
            let visible = true;
            if (relChecked) {
                visible = relTags.some(tag => relationships.includes(tag));
            }
            if (charChecked) {
                visible = visible && charTags.some(tag => characters.includes(tag));
            }

            blurb.setAttribute("data-ospp-visibility", visible ? "true" : "false");
            if (!visible && !blurb.querySelector('.workhide')) {
                const buttonDiv = document.createElement("div");
                buttonDiv.className = "workhide";
                buttonDiv.innerHTML = `
                <div class="left">Your preferred tag is not prioritised in this work.</div>
                <div class="right"><button type="button" class="showwork">Show Work</button></div>
            `;
                blurb.insertAdjacentElement("beforeend", buttonDiv);
            }
            if (visible && blurb.querySelector('.workhide')) {
                blurb.querySelector('.workhide').remove();
            }
        });
    }

    document.addEventListener("click", (event) => {
        if (event.target.matches(".showwork")) {
            const blurb = event.target.closest(".blurb");
            const button = event.target;
            const isHidden = blurb.getAttribute("data-ospp-visibility") === "false";
            blurb.setAttribute("data-ospp-visibility", isHidden ? "true" : "false");
            button.textContent = isHidden ? "Hide Work" : "Show Work";
        }
    });

    async function fetchFandomData(link, isCharacterTag) {
        try {
            const response = await fetch("/" + link + " .parent");
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const pElements = doc.querySelectorAll("p");
            if ((pElements[2] && pElements[2].textContent.includes("Additional Tags Category")) ||
                (pElements[3] && pElements[3].textContent.includes("Additional Tags Category"))) {
                return false;
            }
            const synonymSources = doc.querySelectorAll("ul.tags.commas.index.group, ul.tags.tree.index");
            synonymSources.forEach((ul, index) => {
                if (index === 0) return;
                ul.querySelectorAll(":scope > li").forEach(li => {
                    processListItem(li, isCharacterTag);
                });
            });
            return true;
        } catch (error) {
            console.error('Error fetching fandom data:', error);
            return false;
        }
    }
    function processListItem(li, isCharacterTag) {
        const a = li.querySelector('a');
        if (!a) return;
        const synonym = a.textContent.trim();
        if (isCharacterTag) {
            if (!characters.includes(synonym)) characters.push(synonym);
        } else {
            if (!relationships.includes(synonym)) relationships.push(synonym);
        }
        const nestedUL = li.querySelector(':scope > ul');
        if (nestedUL) {
            for (const nested of nestedUL.children) {
                processListItem(nested, isCharacterTag);
            }
        }
    }


    const TAG_OWNERSHIP_PERCENT = 70;
    const works = document.querySelector('#main.works-index');
    const form = document.querySelector('form#work-filters');
    if (!works || !form) return;
    function getFandomName() {
        const fandomLabel = document.querySelector('#include_fandom_tags label');
        const heading = works.querySelector('.heading');
        if (!fandomLabel || !heading) return null;
        const fandom = fandomLabel.textContent;
        const fandomCount = parseInt(fandom.substring(fandom.lastIndexOf('(') + 1, fandom.lastIndexOf(')')));
        let tagCount = heading.textContent;
        tagCount = tagCount.substring(0, tagCount.indexOf(' Works'));
        tagCount = parseInt(tagCount.substring(tagCount.lastIndexOf(' ') + 1));
        const fandomName = fandom.substring(0, fandom.lastIndexOf('(')).trim();
        if (!fandomName || !fandomCount || !tagCount) return null;
        return (fandomCount / tagCount * 100 > TAG_OWNERSHIP_PERCENT) ? fandomName : null;
    }
    const fandomName = getFandomName();
    const tempKey = 'temp-filter';
    const tempGlobalKey = 'temp-global-filter';
    const tempFandomKey = 'temp-fandom-filter';
    const tempExcludeGlobalKey = 'temp-exclude-global-filter';
    const tempExcludeFandomKey = 'temp-exclude-fandom-filter';
    const globalKey = 'global-filter';
    const fandomKey = fandomName ? 'filter-' + fandomName : '';
    const excludeGlobalKey = 'exclude-global-filter';
    const excludeFandomKey = fandomName ? 'exclude-filter-' + fandomName : '';
    const prevGlobal = localStorage[globalKey] || '';
    const prevFandom = fandomKey ? localStorage[fandomKey] || '' : '';
    const prevExcludeGlobal = localStorage[excludeGlobalKey] || '';
    const prevExcludeFandom = excludeFandomKey ? localStorage[excludeFandomKey] || '' : '';

    const search = document.querySelector('#work_search_query');
    if (!search) return;
    const dd = search.closest('dd');
    const dt = dd && dd.previousElementSibling && dd.previousElementSibling.tagName === 'DT'
        ? dd.previousElementSibling
        : null;
    const realSearch = document.createElement('textarea');
    realSearch.style.display = 'none';
    realSearch.name = search.name;
    search.removeAttribute('name');
    search.insertAdjacentElement('afterend', realSearch);

    const container = document.createElement('div');
    container.className = 'saved-filters';

    function makeFilterSection(opts) {
        const div = document.createElement('div');
        div.className = opts.className + ' ao3-saved-filters-section';

        const textarea = document.createElement('textarea');
        textarea.value = opts.value;
        textarea.id = opts.id;
        textarea.placeholder = opts.placeholder || "tag11;tag12,tag13\ntag21;tag22";
        textarea.style.boxSizing = "border-box";
        textarea.style.marginTop = ".3em";
        textarea.style.width = "100%";

        const row = document.createElement('div');
        row.className = 'sf-row';
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '0em';
        row.style.marginBottom = '.2em';

        const typeClass = opts.type === 'exclude' ? ' exclude' : '';
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'checkbox' + typeClass;
        checkboxLabel.style.position = 'relative';
        checkboxLabel.style.margin = '0';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'js-enabled-checkbox';
        checkbox.checked = (localStorage[opts.enabledKey] !== 'false');

        const indicator = document.createElement('span');
        indicator.className = 'indicator';
        indicator.setAttribute('aria-hidden', 'true');

        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(indicator);

        const titleSpan = document.createElement('span');
        titleSpan.className = 'sf-title';
        titleSpan.textContent = opts.label;
        titleSpan.style.fontWeight = 'normal';

        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.className = 'action js-save-filter';
        saveBtn.textContent = 'Save';
        saveBtn.style.marginLeft = 'auto';
        saveBtn.addEventListener('click', function () {
            localStorage[opts.storeKey] = textarea.value;
            localStorage[opts.enabledKey] = checkbox.checked + '';
        });

        row.appendChild(checkboxLabel);
        row.appendChild(titleSpan);
        row.appendChild(saveBtn);

        div.appendChild(row);
        div.appendChild(textarea);

        return div;
    }

    // global include
    container.appendChild(makeFilterSection({
        label: 'Global', className: 'global-filter',
        value: prevGlobal, enabledKey: globalKey + '-on', storeKey: globalKey, id: 'sf-global-include', type: 'include'
    }));
    // fandom include
    if (fandomKey) {
        container.appendChild(makeFilterSection({
            label: 'Fandom', className: 'fandom-filter',
            value: prevFandom, enabledKey: fandomKey + '-on', storeKey: fandomKey, id: 'sf-fandom-include', type: 'include'
        }));
    }
    // global exclude
    container.appendChild(makeFilterSection({
        label: 'Global', className: 'exclude-global-filter',
        value: prevExcludeGlobal, enabledKey: excludeGlobalKey + '-on', storeKey: excludeGlobalKey, id: 'sf-global-exclude', type: 'exclude'
    }));
    // fandom exclude
    if (excludeFandomKey) {
        container.appendChild(makeFilterSection({
            label: 'Fandom', className: 'exclude-fandom-filter',
            value: prevExcludeFandom, enabledKey: excludeFandomKey + '-on', storeKey: excludeFandomKey, id: 'sf-fandom-exclude', type: 'exclude'
        }));
    }

    const collapser = document.createElement('dt');
    collapser.className = 'saved-filters-collapser filter-toggle collapsed';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'expander';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'saved_filters_panel');
    btn.textContent = 'Saved Filters';

    collapser.appendChild(btn);

    container.id = 'saved_filters_panel';
    container.classList.add('expandable', 'hidden');

    if (dt && dt.parentNode) {
        dt.parentNode.insertBefore(collapser, dt);
        dt.parentNode.insertBefore(container, dt);
    }

    btn.addEventListener('click', function () {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    collapser.classList.toggle('expanded', !expanded);
    collapser.classList.toggle('collapsed', expanded);
    container.classList.toggle('hidden', expanded);
    });

    function insertPrevSearch() {
        const heading = works.querySelector('.heading');
        if (!heading) return;
        const url = decodeURIComponent(window.location.href);
        const m = url.match(/work_search_query=([^&]*)/);
        if (!m) return;
        let ps = m[1].replace(/\+/g, ' ');
        let html = 'Your filter was: ';
        html += ps + '.';
        const div = document.createElement('div');
        div.className = 'prev-search';
        div.innerHTML = html;
        heading.insertAdjacentElement('afterend', div);
    }
    insertPrevSearch();

    function parseTags(str) {
        if (!str) return [];
        return str.split(/[\n;,]+/).map(s => s.trim()).filter(Boolean);
    }
    function quoted(tag) {
        if (!tag) return '';
        tag = tag.trim();
        if (/^".*"$/.test(tag)) return tag;
        return `"${tag.replace(/^"+|"+$/g, '')}"`;
    }
    function assembleFilters() {
        let val = search.value || '';
        let includeFilters = [];
        let excludeFilters = [];
        container.querySelectorAll('.ao3-saved-filters-section').forEach(section => {
            const textarea = section.querySelector('textarea');
            const enabled = section.querySelector('.js-enabled-checkbox').checked;
            const className = section.className;
            if (!enabled || !textarea.value.trim()) return;
            if (className.includes('exclude-global-filter')) {
                excludeFilters = excludeFilters.concat(parseTags(textarea.value));
            } else if (className.includes('exclude-fandom-filter')) {
                excludeFilters = excludeFilters.concat(parseTags(textarea.value));
            } else if (className.includes('global-filter')) {
                includeFilters = includeFilters.concat(parseTags(textarea.value));
            } else if (className.includes('fandom-filter')) {
                includeFilters = includeFilters.concat(parseTags(textarea.value));
            }
        });
        // include
        if (includeFilters.length) {
            includeFilters.forEach(tag => {
                let qtag = quoted(tag);
                if (qtag && !val.includes(qtag)) val += ' ' + qtag;
            });
        }
        // exclude
        if (excludeFilters.length) {
            excludeFilters.forEach(tag => {
                let qtag = quoted(tag);
                if (qtag && !val.includes('-' + qtag)) val += ' -' + qtag;
            });
        }
        return val.trim();
    }

    form.addEventListener('submit', function (e) {
        const savedFiltersPanel = document.getElementById('saved_filters_panel');
        const isExpanded = !savedFiltersPanel.classList.contains('hidden');
        if (isExpanded) {
            realSearch.value = assembleFilters();
        } else {
            realSearch.value = search.value;
        }
    });

    const actionsDd = document.querySelector('dd.submit.actions');
    if (actionsDd) {
        const sortBtn = actionsDd.querySelector('input[type="submit"][value="Sort and Filter"]');
        if (sortBtn) {
            const filterBtn = document.createElement('input');
            filterBtn.type = 'button';
            filterBtn.value = '🔍 Apply Saved Filters';
            filterBtn.className = sortBtn.className;
            filterBtn.name = '';
            filterBtn.classList.add('ao3-filter-shortcut-btn');

            actionsDd.insertBefore(filterBtn, sortBtn);

            filterBtn.addEventListener('click', function() {
                realSearch.value = assembleFilters();
                form.submit();
            });
        }
    }

    document.querySelectorAll('input[type="submit"][value="Sort and Filter"]').forEach(btn => {
        btn.value = '🔍 Sort and Filter';
    });


})();
