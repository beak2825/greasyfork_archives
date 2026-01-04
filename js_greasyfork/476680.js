// ==UserScript==
// @name         1C distributives grouper
// @description  Groups distributive links into OS-specific containers
// @version      1.1
// @author       Akpaev E.A.
// @grant        none
// @namespace    https://github.com/akpaevj
// @license      MIT
// @match        https://releases.1c.ru/version_files?nick=Platform83*
// @downloadURL https://update.greasyfork.org/scripts/476680/1C%20distributives%20grouper.user.js
// @updateURL https://update.greasyfork.org/scripts/476680/1C%20distributives%20grouper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const container = document.createElement('div');
    container.className = 'container tabbale';

    const ul = document.createElement('ul');
    ul.className = 'nav nav-tabs';
    container.append(ul);

    const filesContainer = document.querySelector('.files-container');
    filesContainer.append(container);

    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    container.append(tabContent);

    function addTab(id, title, active = false) {
        const li = document.createElement('li');
        if (active) {
            li.className = 'active';
        }
        ul.append(li);

        const a = document.createElement('a');
        a.setAttribute('href', `#${id}`);
        a.dataset.toggle = 'tab';
        a.textContent = title;
        li.append(a);
    }

    function addPane(id, active = false, addSelectorRow = false) {
        const div = document.createElement('div');
        if (active) {
            div.className = 'tab-pane active';
        } else {
            div.className = 'tab-pane';
        }
        div.setAttribute('id', id);
        tabContent.append(div);

        if (addSelectorRow) {
            const row = document.createElement('div');
            row.className = 'row-fluid';
            div.append(row);
        }

        return div;
    }

    function addTabAndPane(id, title, active = false, addSelectorRow = false) {
        addTab(id, title, active);
        return addPane(id, active, addSelectorRow);
    }

    function showHideLink(e, id, value) {
        const filteredBy = new Set(JSON.parse(e.dataset.filteredBy));

        if (value === 'Все') {
            filteredBy.delete(id);
        } else if (id in e.dataset) {
            if (e.dataset[id] === value) {
                filteredBy.delete(id);
            } else {
                filteredBy.add(id);
            }
        } else {
            filteredBy.add(id);
        }

        if (filteredBy.size > 0) {
            e.style.display = "none";
        } else {
            e.style.display = "block";
        }

        e.dataset.filteredBy = JSON.stringify(Array.from(filteredBy));
    }

    function showHideLinks(pane, id, value) {
        pane.querySelectorAll('.formLine').forEach((e) => {
            showHideLink(e, id, value);
        });
    }

    function addOption(select, title) {
        const option = document.createElement('option');
        option.textContent = title;
        select.append(option);
    }

    function addSelector(pane, id, title, options) {
        const row = pane.querySelector('.row-fluid');

        const span = document.createElement('div');
        span.className = 'span3';
        if (row === null) {
            pane.append(span);
        } else {
            row.append(span);
        }

        const label = document.createElement('label');
        label.setAttribute('for', `${id}-select`);
        label.textContent = title;
        span.append(label);

        const select = document.createElement('select');
        select.setAttribute('id', `${id}-select`);
        span.append(select);

        options.forEach(elem => {
            addOption(select, elem);
        });

        select.onchange = _ => showHideLinks(pane, id, select.selectedOptions[0].textContent);

        return select;
    }

    function getAvailableFilters() {
        const filters = { appTypes: new Set(), arch: new Set(), packageManager: new Set() };
        filters.appTypes.add('Все');
        filters.packageManager.add('Все');
        filters.arch.add('Все');
        filters.arch.add('32-bit');

        document.querySelectorAll(".formLine").forEach((e) => {
            const a = e.querySelector('a');

            let appTypeMatch = a.innerText.match(/^([А-я]+\s+[А-я]+|[\wА-я]+)\s+1С:Предприяти.*/iu);
            if (appTypeMatch != null) {
                filters.appTypes.add(appTypeMatch[1].replace('C', 'С'));
                e.dataset.type = appTypeMatch[1].replace('C', 'С');
            }

            let archMatch = a.innerText.match(/^([А-я]+\s+[А-я]+|[\wА-я]+)\s+1С:Предприяти.*?\s+\((.*?)\).*/iu);
            if (archMatch != null && archMatch.length > 2) {
                filters.arch.add(archMatch[2]);
                e.dataset.arch = archMatch[2];
            } else {
                e.dataset.arch = '32-bit';
            }

            let packageManagerMatch = a.innerText.match(/.*1С:Предприяти.*?для.*?(\w+(?=-based))/iu);
            if (packageManagerMatch != null) {
                filters.packageManager.add(packageManagerMatch[1]);
                e.dataset.packageManager = packageManagerMatch[1];
            }
        });

        return filters;
    }

    let availableFilters = getAvailableFilters();

    function addArchSelector(pane) {
        addSelector(pane, 'arch', 'Архитектура', availableFilters.arch);
    }

    function addTypeSelector(pane) {
        addSelector(pane, 'type', 'Приложение', availableFilters.appTypes);
    }

    function addPackageManagerSelector(pane) {
        addSelector(pane, 'packageManager', 'Менеджер пакетов', availableFilters.packageManager);
    }

    const cCont = addTabAndPane('common', 'Общее', true, true);
    addArchSelector(cCont);

    const wCont = addTabAndPane('windows', 'Windows', false, true);
    addTypeSelector(wCont);
    addArchSelector(wCont);

    const lCont = addTabAndPane('linux', 'Linux', false, true);
    addTypeSelector(lCont);
    addArchSelector(lCont);
    addPackageManagerSelector(lCont);

    const mCont = addTabAndPane('mac', 'Mac');
    const oCont = addTabAndPane('other', 'Другое');

    document.querySelectorAll(".formLine").forEach((e) => {
        e.dataset.filteredBy = JSON.stringify([]);
        const a = e.querySelector('a');

        if (/.*Windows.*/i.test(a.innerText) && (/.*Linux.*/i.test(a.innerText) || /.*MacOS.*/i.test(a.innerText))) {
            cCont.append(e)
        } else if (/.*Windows.*/i.test(a.innerText)) {
            wCont.append(e)
        } else if (/.*Linux.*/i.test(a.innerText)) {
            lCont.append(e)
        } else if (/.*MacOS.*/i.test(a.innerText)) {
            mCont.append(e)
        } else {
            oCont.append(e)
        }
    });
})();