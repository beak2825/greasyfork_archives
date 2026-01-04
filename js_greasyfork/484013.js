// ==UserScript==
// @name         DongleSize2Metric
// @namespace    https://github.com/yossi99/DongleSize2Metric
// @version      v0.0.4-beta
// @description  Convert the toy size chart information from imperial to metric system from some famous adult toy makers
// @author       Yossi99
// @match        https://twintailcreations.com/products/*
// @match        https://bad-dragon.com/products/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bad-dragon.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484013/DongleSize2Metric.user.js
// @updateURL https://update.greasyfork.org/scripts/484013/DongleSize2Metric.meta.js
// ==/UserScript==


const SupportedDomains = Object.freeze({
    TwinTail: 'twintailcreations.com',
    BadDragon: 'bad-dragon.com'
});
const patchAttribute = 'patched';

(function() {
    const domain = window.location.host
    const supDomains = Object.values(SupportedDomains);
    if (!supDomains.find(i => i === domain)) {
        console.error('Domain not supported');
        return;
    }
    const domainMap = {
        [SupportedDomains.TwinTail]: PatchTwinTailSizeTable,
        [SupportedDomains.BadDragon]: PatchBadDragonSizeTable
    }
    const observer = new MutationObserver((event) => {
        domainMap[domain]();
    });
    observer.observe(document.querySelector('body'), {childList: true, subtree: true});
})();

function inches2CmFormated(string) { return `${(+string * 2.54).toFixed(2)} cm`;}

function PatchBadDragonSizeTable() {
    const toySizeTable = [".table.sizing-chart__table", "table.sizing-chart"]
      .map((i) => document.querySelector(i))
      .find((i) => i);
    if (!toySizeTable) {
        console.warn("Toy size table not found");
        return false;
    }
    const tableRows = toySizeTable.querySelectorAll('tbody tr')
    for (let row of tableRows) {
        const header = row.querySelector('th');
        (header ? patchHeader(header) : console.warn ('Header not found'));
        const rowData = [...row.querySelectorAll(`td:not([${patchAttribute}])`)]
        rowData.filter(i => !Number.isNaN(+i.textContent))
            ?.forEach(i => patchElement(i));
    }
    return true;

    function patchElement(element) {
        if (!(element instanceof Element)) {
            return;
        }
        element.textContent = inches2CmFormated(element.textContent);
        element.setAttribute(patchAttribute, true);
    }
    function patchHeader(header) {
        if (!(header instanceof Element)) {
            return;
        }
        const headerExp = /(?:\w+| )+ \([\w]+\)$/s;
        if (!headerExp.test(header.textContent)) {
            return;
        }
        header.textContent = header.textContent.replace(/\([\w]+\)$/s, '(cm)');
    }
}

function PatchTwinTailSizeTable() {
    const chartBtnSelector = [
        '.ProductForm__Label > button',
        '[data-action=open-modal].ProductForm__LabelLink'
    ].find(i => document.querySelector(i));
    if (!chartBtnSelector) {
        console.warn('chart button not found');
        return;
    }
    const chartBtn = document.querySelector(chartBtnSelector);
    const chartControlName = chartBtn.getAttribute('aria-controls');
    if (!chartControlName) {
        console.error('Chart control name not found');
        return false;
    }
    const toySizeTable = document.querySelector(`[id=${chartControlName}]`)?.querySelector('table');
    if (!toySizeTable) {
        console.warn('Toy size table not found!');
        return false;
    }
    const sizeRegExp = /((?:\d*\.)?\d+)(?:"|”)?(?:$|(?="|”))/s;
    // Get rows and skip header (toy name)
    const tableRows = [...(document.querySelectorAll('tr') ?? [])].slice(1);
    for (let row of tableRows) {
        // Skip category header
        const rowData = [...(row.querySelectorAll(`td:not([${patchAttribute}])`) ?? [])].slice(1);
        rowData.filter(i => sizeRegExp.test(i.textContent))
            ?.forEach(i => patchElement(i));
    }
    return true;

    function patchElement(element) {
        if (!(element instanceof Element)) {
            return;
        }
        const inches = +(sizeRegExp.exec(element.textContent)[1]);
        if (Number.isNaN(inches)) {
            console.error("Failed to extract size from: ", element);
            return;
        }
        element.textContent = element.textContent.replace(sizeRegExp, inches2CmFormated(inches));
        element.setAttribute(patchAttribute, true);
    }
}