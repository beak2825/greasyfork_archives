// ==UserScript==
// @name          hwm_armory_batch_arts_management
// @namespace     https://github.com/bonArt0/hwm_scripts
// @version       1.3.4
// @description   Движение артов пачкой
// @author        bonArt
// @license       GPL-3.0-only
// @icon          https://dcdn.heroeswm.ru/i/btns/job_fl_btn_warehouse.png
// @match         https://*.heroeswm.ru/sklad_info.php?*
// @match         https://178.248.235.15/sklad_info.php?*
// @match         https://www.lordswm.com/sklad_info.php?*
// @match         https://my.lordswm.com/sklad_info.php?*
// @require       https://greasyfork.org/scripts/457946-hwm-armory-framework/code/hwm_armory_framework.js?version=1239339
// @supportURL    https://www.heroeswm.ru/sms-create.php?mailto_id=117282
// @downloadURL https://update.greasyfork.org/scripts/458012/hwm_armory_batch_arts_management.user.js
// @updateURL https://update.greasyfork.org/scripts/458012/hwm_armory_batch_arts_management.meta.js
// ==/UserScript==

/**
 * @todo refactor
 * @todo add errors debug button (not checking error in debug console)
 */

const LocalClassNames = {
    ARTS_PLACE_FORM: 'abam_arts_place_form',
    ARTS_PLACE_COUNTER: 'abam_arts_place_counter',
};

const framework = ArmoryFramework.init();

if (framework?.isManagementMode()) {
    if (initControls()) { // framework
        console.info('HWM Armory Batch Arts Management initiated');
    } else {
        console.warn('HWM Armory Batch Arts Management failed');
    }
}

function initControls() {
    if (!framework.armory.management.body.puts.isDisabled()) {
        initArtsPutsBox();
    }

    if (framework.activeTab !== ArmoryTab.TAB_DESCRIPTION) {
        initArtsTakesBox();
    }

    return true;
}

function initArtsPutsBox() {
    const artsPutsHeader = framework.armory.management.header.puts;
    const artsPutsBody = framework.armory.management.body.puts;

    artsPutsBody.hideForm();
    const artsToPut = artsPutsBody.getArtsList();

    artsPutsBody.box.parentNode.append(buildNewPutsBox(artsToPut));
    artsPutsHeader.box.innerHTML = artsPutsHeader.box.innerHTML
        .replace('артефакт', 'артефакты');
    artsPutsHeader.box.append(buildArtsPutsSubmitButton());
    artsPutsHeader.box.prepend(buildArtsPutsCounterLabel(artsToPut.length));
}

function initArtsTakesBox() {
    if (framework.activeTab === ArmoryTab.TAB_UNAVAILABLE) {
        prepareUnavailableTabRows();
    } else {
        prepareLeaseTabRows();
    }

    updateExistingTakesBoxControls();
}

/*  <editor-fold desc="arts place box"> */

/**
 * @returns {HTMLButtonElement}
 */
function buildArtsPutsSubmitButton() {
    const button = document.createElement('button');
    button.style.position = 'relative';
    button.style.left = '22%';
    button.innerHTML = 'Поместить';
    button.onclick = () => handleArtsPutsSubmit();

    return button;
}

/**
 * @param {number} artsToPutCount
 * @returns {HTMLLabelElement}
 */
function buildArtsPutsCounterLabel(artsToPutCount) {
    const label = document.createElement('label');
    label.style.position = 'relative';
    label.style.left = '-32%';
    label.style.width = '0';
    label.style.whiteSpace = 'nowrap';
    label.dataset.current = '0';
    label.dataset.total = artsToPutCount + '';
    label.classList.add(LocalClassNames.ARTS_PLACE_COUNTER);
    label.recalculate = () => {
        label.innerHTML = `Выбрано: ${label.dataset.current} из ${label.dataset.total}`;
        label.style.display = +label.dataset.current ? 'inline-block' : 'none';
    }
    label.recalculate();

    return label;
}

function getArtsPutsCounterLabel() {
    const counter = document.getElementsByClassName(LocalClassNames.ARTS_PLACE_COUNTER).item(0);
    if (!counter) {
        console.error('Arts puts counter not found');
        return null;
    }

    return counter;
}

async function handleArtsPutsSubmit() {
    const infoBox = framework.armory.overview.info;
    const artsPutsBox = framework.armory.management.body.puts;

    const armory_id = artsPutsBox.getArmoryId();
    let sign = artsPutsBox.getArtsPutSign();

    for (const artBox of getArtsPutsBoxes() ?? []) {
        const currentCapacity = infoBox.getCurrentCapacity();
        const TotalCapacity = infoBox.getTotalCapacity();
        if (currentCapacity === TotalCapacity) {
            break;
        }

        const checkbox = artBox?.children?.item(0);
        if (!checkbox?.checked) {
            continue;
        }

        const url = new URL('sklad_info.php', window.location.origin);
        url.searchParams.append('id', `${armory_id}`);
        url.searchParams.append('sign', sign);
        url.searchParams.append('p_art_id', checkbox.name);

        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8');
        request.setRequestHeader('Upgrade-Insecure-Requests', '1');
        request.onload = () => {
            infoBox.innerHTML = infoBox.box.innerHTML
                .replace(`<b>${currentCapacity}</b>`, `<b>${+currentCapacity + 1}</b>`);
            checkbox.checked = false;
            handleArtsPutsCheckboxChange(checkbox.checked);
        };
        request.onerror = (ev) => console.error(ev);

        request.send();

        await new Promise((executor) => setTimeout(executor, 1000));
    }

    window.location.reload();
}

/**
 * @returns {HTMLCollection|null}
 */
function getArtsPutsBoxes() {
    const artsBoxes = document.getElementsByClassName(LocalClassNames.ARTS_PLACE_FORM).item(0).children;
    if (!artsBoxes) {
        console.error('Updated arts place form not found');
        return null;
    }

    return artsBoxes;
}

/**
 * @param {(number|string)[][]} artsList
 * @returns {HTMLDivElement}
 */
function buildNewPutsBox(artsList) {
    const newPutsBox = document.createElement('div');
    newPutsBox.style.maxHeight = '150px';
    newPutsBox.style.overflowY = 'scroll';
    newPutsBox.style.display = 'flex';
    newPutsBox.style.flexDirection = 'column';
    newPutsBox.style.paddingLeft = '20px';
    newPutsBox.classList.add(LocalClassNames.ARTS_PLACE_FORM);

    let art_id, art_name;
    for ([art_id, art_name] of artsList) {
        const box = framework.buildCheckboxLabel(art_id, art_name);
        box.children.item(0).onchange = (ev) => handleArtsPutsCheckboxChange(ev.target.checked);
        newPutsBox.append(box);
    }

    return newPutsBox;
}

function handleArtsPutsCheckboxChange(checked) {
    const counter = getArtsPutsCounterLabel();
    const mod = checked ? 1 : -1;
    counter.dataset.current = +counter.dataset.current + mod + '';
    counter.recalculate();
    return true;
}

/* </editor-fold> */

/**
 * Preparing for adding Withdraw buttons
 */
function prepareUnavailableTabRows() {
    const header = framework.armory.arts.list.header.box;
    const footer = framework.armory.arts.list.footer?.box;

    const headerButtonsCellColspan = Array.from(header.children).pop().colSpan;
    const footerCells = Array.from(footer?.children ?? []);
    footerCells.pop().colSpan -= headerButtonsCellColspan - 1; // footer has one less cell
    const footerButtonsCell = document.createElement('td');
    footerButtonsCell.colSpan = headerButtonsCellColspan;

    footer?.append(footerButtonsCell);
}

/**
 * Preparing for adding Withdraw buttons
 */
function prepareLeaseTabRows() {
    const footerButtonsCell1 = document.createElement('td');
    footerButtonsCell1.colSpan = framework.activeTab === ArmoryTab.TAB_ON_LEASE ? 7 : 6;
    const footerButtonsCell2 = document.createElement('td');

    const footer = document.createElement('tr');
    footer.append(footerButtonsCell1, footerButtonsCell2);
    footer.classList.add(FrameworkClassNames.ARTS_FOOTER_BOX);
    framework.armory.arts.list.box.append(footer);

    framework.armory.arts.list.header.box.prepend(document.createElement('td'));
    footer.prepend(document.createElement('td'));
    for (const row of framework.armory.arts.list.rows) {
        row.box.prepend(document.createElement('td'));
    }
}

function updateExistingTakesBoxControls() {
    Array.from(framework.armory.arts.list.header.box.children)
        .pop()
        .append(buildArtsTakeSubmitButton());

    Array.from(document.getElementsByClassName(FrameworkClassNames.ARTS_FOOTER_BOX).item(0)?.children)
        ?.pop()
        ?.append(buildArtsTakeSubmitButton());

    for (const row of framework.armory.arts.list.rows) {
        const checkboxCell = row.box.children.item(0);
        if (Array.from(checkboxCell.children).shift()?.type !== 'checkbox') {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkboxCell.append(checkbox);
        }
    }
}

/**
 * @returns {HTMLButtonElement}
 */
function buildArtsTakeSubmitButton() {
    const button = document.createElement('button');
    button.innerHTML = 'Взять выбранное';
    button.onclick = () => handleArtsTakeSubmit();

    return button;
}

async function handleArtsTakeSubmit() {
    for (const row of framework.armory.arts.list.rows) {
        const checkbox = Array.from(row.box.children)
            .shift()
            .children.item(0);
        const takeForm = Array.from(row.box.getElementsByTagName('form'))
            .pop();

        if (!checkbox?.checked) {
            continue;
        }

        const url = new URL(takeForm.attributes.action.value, window.location.origin);
        for (const param of takeForm.getElementsByTagName('input')) {
            if (param.type !== 'hidden') {
                continue;
            }

            url.searchParams.append(param.name, param.value);
        }

        const request = new XMLHttpRequest();
        request.open(takeForm.method, url, true);
        request.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8');
        request.setRequestHeader('Upgrade-Insecure-Requests', '1');
        request.onerror = (ev) => console.error(ev);

        request.send();

        await new Promise((executor) => setTimeout(executor, 1000));
    }

    window.location.reload();
}
