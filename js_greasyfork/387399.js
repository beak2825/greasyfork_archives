// ==UserScript==
// @name         FGO Better Event Planner
// @version      0.2.3
// @description  Lets you save and restore shop planner fields.
// @author       Rukako
// @namespace    rukako
// @match        https://grandorder.gamepress.gg/*-event-calculators
// @match        https://grandorder.gamepress.gg/*-event-shop*planner*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.14/lodash.js
// @downloadURL https://update.greasyfork.org/scripts/387399/FGO%20Better%20Event%20Planner.user.js
// @updateURL https://update.greasyfork.org/scripts/387399/FGO%20Better%20Event%20Planner.meta.js
// ==/UserScript==

/* globals _ */

(function() {
    'use strict';

    const key = 'FGO_GP_EVENT_SHOPS';
    const storedJSON = localStorage[key] || '{}';
    const stored = JSON.parse(storedJSON);
    const data = stored[window.location.pathname] || {};
    const save = _.debounce(() => {
        console.log('Saving planner fields...');
        stored[window.location.pathname] = data;
        localStorage[key] = JSON.stringify(stored);
    }, 200, {leading: true, trailing: true});

    const conversions = {
        'form[name="Calcultor"] input': 'form#form1 input'
    };
    let changed = false;
    Object.entries(conversions).forEach(([from, to]) => {
        if (data[from]) {
            data[to] = data[from];
            changed = true;
        }
        delete data[from];
    });
    if (changed) save();

    const elQueries = ['table input[onkeyup="updateVals(this)"]', 'form#form1 input', '#inputCE input'];

    function update(query, i, value) {
        if (!data[query]) data[query] = {};
        data[query][i] = value;
        save();
    }

    const valueKeys = {
        'checkbox': 'checked'
    };

    console.log('Restoring planner fields...');
    elQueries.forEach(query => {
        document.querySelectorAll(query).forEach((el, i) => {
            const val = (data[query] || {})[i];
            const valKey = valueKeys[el.type] || 'value';
            if (val) {
                el[valKey] = val;
                el.dispatchEvent(new Event('change')); // GP's onchange will fix any out of bound values.
            }
            el.addEventListener('input', () => update(query, i, el[valKey]));
        });
    });

    console.log('Applying styles...');
    const css = `
.event-shop-icons img { width: unset; height: 25px !important; margin-right: 5px; }
.event-shop-icons br { display: none; }
.event-shop-icons a { margin-left: 5px; display: flex; align-items: center; }
#shop-table tbody td { padding: 0; }
#shop-table input { padding: 0.3em; margin: 0; }
`;
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // fixes pressing tab between shop planner fields.
    document.querySelectorAll('.event-shop-icons a').forEach(el => el.setAttribute('tabindex',-1))
})();