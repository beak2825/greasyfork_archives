// ==UserScript==
// @name         Bitrix24 Stage Selector
// @namespace    https://crm.globaldrive.ru/
// @version      2024-02-22
// @description  Better Tasks Stage Selector
// @author       Dzorogh
// @match        https://crm.globaldrive.ru/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/488000/Bitrix24%20Stage%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/488000/Bitrix24%20Stage%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
div#tasksStagesWrap {
  height: auto;
}

div#tasksStages {
  height: auto;
  flex-direction: column;
  position: inherit;
  background-color: transparent !important;
}

div#tasksStages .task-section-status-step {
  font-size: 12px;
  padding: 0.5em 1em;
  border: 0 !important;
  border-radius: 0 !important;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #000 !important;
}

div#tasksStages .task-section-status-step:hover {
  font-weight: bold;
}
    `;

    GM_addStyle(css);

    console.log('Bitirix24 Stage Selector: Done');

})();
