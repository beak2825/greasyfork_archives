// ==UserScript==
// @name         ServiceNow - Compare page - Add MergeView buttons
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Improve usability of MergeView pages on ServiceNow.
// @author       Ricardo Constantino <ricardo.constantino@fruitionpartners.pt>
// @match        https://*.service-now.com/merge_form_current_version.do?*
// @match        https://*.service-now.com/merge_form_current_update.do?*
// @match        https://*.service-now.com/merge_form_select_version_ro.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411667/ServiceNow%20-%20Compare%20page%20-%20Add%20MergeView%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/411667/ServiceNow%20-%20Compare%20page%20-%20Add%20MergeView%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let btnContainer = document.querySelector('nav div.nav.navbar-right');
    if (window.location.pathname.startsWith('/merge_form_select_version_ro.do') && btnContainer) {
        let switchBtn = document.createElement('button');
        switchBtn.setAttribute('class', 'navbar-btn btn btn-primary');
        switchBtn.textContent = 'Switch Comparison Sides';
        switchBtn.setAttribute('onclick', 'return false;');
        switchBtn.addEventListener('click', () => {
            let {sysparm_version1, sysparm_version2} = document.URL.parseQuery();
            if (sysparm_version1 && sysparm_version2) {
                window.location.href = String(document.URL).replace(/(.+sysparm_version1=)(.+)(&sysparm_version2=)([^&]+)(.*)/gim, (_,a,b,c,d,e) => [a,d,c,b,e].join(''));
            }
            return false;
        });
        btnContainer.insertAdjacentElement('afterbegin', switchBtn);
    }

    let style = document.createElement('style')
    style.textContent = `
.CodeMirror-merge, .CodeMirror-merge .CodeMirror {
  height: 70vh !important;
  font-family: Fira Code, Consolas, Menlo, monospace;
  /*line-height: 1.6em;*/
  font-size: 96%;
}

#mergeviewbuttoncontainer {
  text-align: center;
  margin-bottom: 1em;
  margin-top: -4em;
}

#mergeviewbuttoncontainer button:nth-child(-n + 2) {
  color: #a11e22;
  font: 1.5em bold;
}
#mergeviewbuttoncontainer button:nth-last-child(-n + 2) {
  color: #37afa9;
  font: 1.5em bold;
}
`;
    document.head.append(style);

    function reinitMergeView(opts) {
        let mergeElement = document.querySelector('#merge_view');
        mergeElement.innerHTML = '';
        mergeView = CodeMirror.MergeView(mergeElement, Object.assign({}, mergeView.options, opts || {}))
    }

    function addMergeButtons() {
        let buttons = [
            {label: '▼', f: () => { mergeView.leftOriginal().execCommand('goNextDiff'); }},
            {label: '▲', f: () => { mergeView.leftOriginal().execCommand('goPrevDiff'); }},
            {label: 'Toggle Collapse', f: () => { reinitMergeView({collapseIdentical: mergeView.options.collapseIdentical ? !mergeView.options.collapseIdentical : 5}); }},
            {label: 'Switch views', f: () => { reinitMergeView({value: mergeView.options.origLeft, origLeft: mergeView.options.value}); }},
            {label: '▼', f: () => { mergeView.editor().execCommand('goNextDiff'); }},
            {label: '▲', f: () => { mergeView.editor().execCommand('goPrevDiff'); }},
        ];
        let anchorElement = document.querySelector('#merge_view').parentElement;
        let btnContainer = document.createElement('div');
        btnContainer.id = 'mergeviewbuttoncontainer';
        anchorElement.insertAdjacentElement('afterbegin', btnContainer);
        buttons.forEach(btn => {
            let btnElement = document.createElement('button');
            btnElement.textContent = btn.label;
            btnElement.addEventListener('click', btn.f);
            btnContainer.append(btnElement);
        });
    }

    new MutationObserver(mutationsList => {
        for (let mutation of mutationsList) {
            if (mutation.type !== 'childList') continue;
            if (!document.querySelector('#merge_view')) return;
            if (document.querySelector('div#mergeviewbuttoncontainer')) return;
            addMergeButtons();
        }
    }).observe(document.body, { childList: true });
})();