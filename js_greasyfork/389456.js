// ==UserScript==
// @name         datadog-traceId
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  onclick to view logs of a trace id
// @author       greatbody
// @include      https://app.datadoghq.com/logs*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/389456/datadog-traceId.user.js
// @updateURL https://update.greasyfork.org/scripts/389456/datadog-traceId.meta.js
// ==/UserScript==

// 2019年08月28日15:28:57 update author info, and use include
// 2019年09月10日15:04:16 use Datetime at very top that every log has as a backup source of timestamp

const baseURL = 'https://app.datadoghq.com';

function buildURL(baseURL, params) {
    const paramArr = [];
    Object.keys(params).forEach((key) => {
        paramArr.push(`${key}=${encodeURIComponent(params[key])}`);
    });
    return `${baseURL}?${paramArr.join('&')}`;
}

function buildAttrbutes() {
    const rows = document.querySelectorAll('.log_raw-json tr');
    const attrs = {};
    for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        const cells = row.innerText.split(/\s+/ig);
        if (cells.length === 2) {
            attrs[cells[0]] = {
                row: row,
                value: cells[1]
            };
        }
    }
    return attrs;
}

function clearExistButton() {
    const btn = document.querySelector('#btnOpenTraceIdView');
    if (btn) btn.remove();
}

function findTraceId() {
    const attributes = buildAttrbutes();
    const traceIdObj = attributes['traceId'];
    let timestampObj = attributes['@timestamp'];

    if (!timestampObj) {
        const dom = document.querySelector('.log_event-panel_status-date__date span.absolute');
        timestampObj = {
            row: null,
            value: dom.innerHTML.replace('at', '')
        };
    }

    if (!traceIdObj || !traceIdObj.row) {
        return;
    }

    const timestamp = timestampObj.value;
    const traceId = traceIdObj.value;
    const traceIdRow = traceIdObj.row;
    if (traceIdRow.lastTraceId != traceId) {
        clearExistButton();
        const button = document.createElement('button');
        const divBox = document.querySelector('.ui_layout_expandable-block__content');
        const boxPreClass = divBox.childNodes[0];
        button.innerHTML = 'Open Logs of traceId<div class="ui_form_button__icon-wrapper"><svg class="ui_icons_icon ui_icons_icon--md ui_icons_icon--is-scaled-down ui_form_button__icon--position-right"><title></title><use xlink:href="#ui_icons_export" fill=""></use></svg></div>';
        button.id = 'btnOpenTraceIdView';
        button.onclick = () => {
            const startMilliSec = new Date(timestamp).getTime() - 10 * 60 * 1000;
            const destMilliSec = new Date(timestamp).getTime() + 10 * 60 * 1000;
            const url = buildURL(`${baseURL}/logs`, {
                cols: 'core_host,core_service',
                from_ts: startMilliSec,
                index: 'main',
                live: 'false',
                messageDisplay: 'inline',
                query: `@traceId:${traceId}`,
                stream_sort: 'desc',
                to_ts: destMilliSec
            });
            // eslint-disable-next-line no-undef
            unsafeWindow.open(url, '_blank');
        };
        button.className = 'ui_form_button ui_form_button--md ui_form_button--default log_export-dropdown ui_dialogs_popover167 ui_dialogs_popover__handle';

        button.style.marginBottom = '5px';
        button.style.backgroundColor = '#28a745';
        button.style.color = 'white';

        divBox.insertBefore(button, boxPreClass);

        traceIdRow.lastTraceId = traceId;
    }
}

(function () {
    'use strict';

    setInterval(() => {
        findTraceId();
    }, 1000);
})();
