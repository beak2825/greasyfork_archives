// ==UserScript==
// @name         Better BP rates
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Display more meaningful information in the "Your Bonus Points Rate" page
// @author       ryden
// @match        https://orpheus.network/bonus.php?action=bprates*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=orpheus.network
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459490/Better%20BP%20rates.user.js
// @updateURL https://update.greasyfork.org/scripts/459490/Better%20BP%20rates.meta.js
// ==/UserScript==

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

(function() {
    'use strict';

    const parseNumber = (x) => +x.replaceAll(',', '');
    const formatNumber = (x, precision) => x.toLocaleString('en', { minimumFractionDigits: precision, maximumFractionDigits: precision });
    const timeframes = [ 1, 24, 24*7, 24*365.256363004/12, 24*365.256363004 ];


    //-----------------------------------------------------------------------------------------
    const makeRateUpdater = (row, decimals) => (when) => {
        row.fields.each(function(i) { this.innerText = formatNumber(timeframes[i] * row.rates[when], decimals[i]); });
        row.fields.gbYear.innerText = formatNumber(row.values.gbYear * row.rates[when] / row.rates[4], decimals[5]);
    };


    //-----------------------------------------------------------------------------------------
    const processHeader = (table) => {
        const header = table.find('thead tr.colhead').eq(0);
        if (header.length === 0) return;

        const body = table.find('tbody tr').eq(0);
        if (body.length === 0) return;

        header.prepend(htmlToElement(`<td style="text-align: center; width: 1px;">When</td>`));
        body.prepend(htmlToElement(`<td style="text-align: center; width: 1px;">
          <select id="bp-selector" style="text-align: center">
            <option value="0" selected="selected">Now</option>
            <option value="1">In a day</option>
            <option value="2">In a week</option>
            <option value="3">In a month</option>
            <option value="4">In a year</option>
          </select>
        </td>`));

        return ({
            selector: body.find('#bp-selector'),
        });
    };


    //-----------------------------------------------------------------------------------------
    const parseTable = (table) => table
    .find('tbody > tr')
    .map(function() {
        return ({
            rateFields: $(this).find('td:gt(3):lt(8)'),
            bpGbYearField: $(this).find('td:eq(9)')[0],
        });
    })
    .map(function() {
        const fields = this.rateFields;
        const values = fields.map(function() { return parseNumber(this.innerText); }).toArray();
        const rates = timeframes.map((v, i) => values[i] / v);
        return ({
            fields: Object.assign(fields, { gbYear: this.bpGbYearField }),
            values: Object.assign(values, { gbYear: parseNumber(this.bpGbYearField.innerText) }),
            rates,
        });
    })
    .toArray();


    //-----------------------------------------------------------------------------------------
    const headerTable = $('#content table:first').eq(0);
    if (headerTable.length === 0) return;

    const header = processHeader(headerTable);
    if (!header) return;

    const torrentTable = $('#content table:last').eq(0);
    if (torrentTable === 0 || torrentTable == headerTable) return;

    const updaters = [
        { tbl: headerTable, decimals: [ 2, 2, 2, 2, 2, 2 ] },
        { tbl: torrentTable, decimals: [ 3, 3, 3, 2, 2, 2 ] },
    ]
    .flatMap(({ tbl, decimals }) => parseTable(tbl).map(row => ({ row, decimals })))
    .map(({ row, decimals }) => makeRateUpdater(row, decimals));

    const update = (n) => updaters.forEach((fn) => fn(n));
    header.selector.on('change', function() { update(+this.value); });
    update(0);
})();
