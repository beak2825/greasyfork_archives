// ==UserScript==
// @name         ServiceNow - Open BG Iframe
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Open a casual Background Script frame in current List/Form
// @author       Ricardo Constantino <ricardo.constantino@convevo.com>
// @license      MIT
// @match        https://*.service-now.com/*.do?*
// @exclude      https://*.service-now.com/sys.scripts.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414543/ServiceNow%20-%20Open%20BG%20Iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/414543/ServiceNow%20-%20Open%20BG%20Iframe.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isForm = typeof g_form !== 'undefined';
    let isList = typeof GlideList2 !== 'undefined' && document.querySelector('#sys_target') != null && GlideList2.get(document.querySelector('#sys_target').value) != null;
    if (!isForm && !isList) return;

    let scriptPreset = '';
    calculateScriptPreset();

    const style = document.createElement('style');
    style.innerText = `
#bg_iframe {
height: 96vh;
top: 3em;
position: fixed;
right: 0;
width: 30%;
z-index: 45;
min-width: 400px;
}

#bg_toggle {
position: fixed;
top: 0;
right: 50%;
z-index: 50;
}

#bg_refresh {
position: fixed;
top: 3em;
right: 0;
z-index: 50;
background: #eee;
}
`;

    document.head.appendChild(style);

    const iframe = document.createElement('iframe');
    iframe.id = 'bg_iframe';
    iframe.setAttribute('src', '/sys.scripts.do');
    iframe.addEventListener('load', () => {
        iframe.contentDocument.querySelector('#runscript').value = scriptPreset + '\n\n';
    });
    const button2 = document.createElement('button');
    button2.id = 'bg_refresh';
    button2.title = 'Refresh Checked rows filter';
    button2.textContent = '↻';
    button2.addEventListener('click', () => {
        let iframeElement = document.querySelector('#bg_iframe');
        if (iframeElement) {
            calculateScriptPreset();
            let currentBG = iframeElement.contentDocument.querySelector('#runscript').value.split(/\r?\n/).slice(4).join('\n');
            iframeElement.contentDocument.querySelector('#runscript').value = scriptPreset.split(/\r?\n/).slice(0,5).join('\n') + currentBG;
        }
    });

    const button = document.createElement('button');
    button.id = 'bg_toggle';
    button.textContent = 'Open BG frame';
    button.addEventListener('click', () => {
        let iframeElement = document.querySelector('#bg_iframe');
        if (iframeElement) {
            iframeElement.toggle('display');
            document.querySelector('#bg_refresh').toggle('display');
        } else {
            document.body.appendChild(iframe);
            if (isList) document.body.appendChild(button2);
        }
    });
    document.body.appendChild(button);

    function calculateScriptPreset() {
        if (isForm) {
            let _filter = 'sys_id=' + g_form.getUniqueValue();
            scriptPreset = `
var table = ${JSON.stringify(g_form.getTableName())}, recID,
    filter = ${JSON.stringify(_filter)};

var gr = new GlideRecord(table); gr.addEncodedQuery(filter); gr.query();

while (gr.next()) {
    recID = gr.getUniqueValue();
    // new GlideUpdateManager2().saveRecord(gr)

}
`.trim();
        } else if (isList) {
            let g_list = GlideList2.get(document.querySelector('#sys_target').value);
            let _filter = g_list.getQuery({all:true}).split('^');
            if (!g_list.orderBySet) {
                _filter.push('ORDERBY' + (g_list.sortDir === 'ASC' ? '' : 'DESC') + g_list.sortBy);
            }
            let checked = (g_list.getChecked() != '' ? 'sys_idIN'+g_list.getChecked()+'^' : '');

            scriptPreset = `
var table = ${JSON.stringify(g_list.getTableName())}, recID,
    filter = ${JSON.stringify(_filter.join('^'))};
    filter = ${JSON.stringify(checked)} + filter; // checked rows filter
var gr = new GlideRecord(table); gr.addEncodedQuery(filter); gr.query();

while (gr.next()) {
    recID = gr.getUniqueValue();
    // new GlideUpdateManager2().saveRecord(gr)

}
`.trim();
        }
    }
})();