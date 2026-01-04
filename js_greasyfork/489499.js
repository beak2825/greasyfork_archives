// ==UserScript==
// @name         ServiceNow - WF - Context add info
// @version      0.0.2
// @description  Additional information in workflow context
// @author       Matteo Lecca
// @match        *.service-now.com/context_workflow.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=service-now.com
// @grant        none
// @license MIT
// @namespace    https://greasyfork.org/users/1246673
// @downloadURL https://update.greasyfork.org/scripts/489499/ServiceNow%20-%20WF%20-%20Context%20add%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/489499/ServiceNow%20-%20WF%20-%20Context%20add%20info.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let navBarRight = document.querySelector('div.navbar-right');

    if(!navBarRight) {
        return;
    }

    let updateViewButton = document.createElement('button');
    updateViewButton.title = '[WK - SN] Update view';
    updateViewButton.classList.add('btn', 'btn-icon', 'navbar-btn', 'icon', 'icon-info');
    updateViewButton.onclick = addActionsInfo;

    navBarRight.append(updateViewButton);

    function addActionsInfo() {

        let timeSpans = document.querySelectorAll('span.wk-wf-time-span');
        if(timeSpans.length > 0) {
            timeSpans.forEach(timeSpan => {
                timeSpan.style.display = (timeSpan.style.display === 'block') ? 'none' : 'block';
            });
            return;
        }

        let selector = 'div.drag_section_part';
        let wfDragAreas = document.querySelectorAll(selector);

        wfDragAreas.forEach(wfDragArea => {
            let hoverArea = wfDragArea.getElementsByClassName('hidden-but-read')[0];
            let actionStart = hoverArea.innerHTML.match(/<br>(Started.*?)<br>/).pop();
            let actionEnd = hoverArea.innerHTML.match(/<br>(Ended.*?)<br>/).pop();

            let tableRef = wfDragArea.querySelector('table.wf_condition').getElementsByTagName('tbody')[0];

            // Start label
            let rowStart = tableRef.insertRow(-1);
            let cellStart = rowStart.insertCell(0);

            rowStart.style.backgroundColor = '#e6e9eb';

            let timeSpan = document.createElement('span');
            timeSpan.title = '[WK - SN] Start/End date time';
            timeSpan.innerText = actionStart + '\n' + actionEnd;
            timeSpan.style.fontSize = '8pt';
            timeSpan.style.display = 'block';
            //timeSpan.style.padding = '3px';
            timeSpan.classList.add('wk-wf-time-span');

            cellStart.appendChild(timeSpan);
        });
    }

})();