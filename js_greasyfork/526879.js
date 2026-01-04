// ==UserScript==
// @name         Pretix Participants Export
// @namespace    http://tampermonkey.net/
// @version      2025-01-20
// @description  Adds an export button to the participants tab
// @author       Kiki
// @match        https://pretix.eu/control/*/orders/
// @grant        none
// @icon         https://static.pretix.space/static/pretixbase/img/icons/favicon-32x32.877667e39b7c.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526879/Pretix%20Participants%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/526879/Pretix%20Participants%20Export.meta.js
// ==/UserScript==

(function() {
    'use strict';

  // dirty hack is required, because they handle all click events in body.onclick
  // and no click event ever reached out button - I still do not understand why though.
  document.addEventListener(`click`, e =>
  {
    const origin = e.target.closest('button');

    if (origin && origin.id == 'exportButton')
    {
      doExport();
    }
  });

  addExportButton();

})();

function doExport()
{
    var title = document.querySelector('span.context-name').innerText;
    var dt = document.querySelector('span.context-meta').innerText;

    var headline = 'Barriere-Check ' + title + ' am ' + dt;
    var mails = '';

    var tds = document.querySelectorAll('tbody :nth-child(3 of td)');
    var checkedOnly = false;
    tds.forEach(td =>
                {
        var isChecked = td.previousElementSibling.previousElementSibling.querySelector('input').checked;
        if(isChecked && !checkedOnly) // first checked item
        {
            mails = '';
            checkedOnly = true;
        }
        if(!checkedOnly || isChecked)
        {
            mails = mails + "\n" + td.innerText.split("\n")[0];
        }
    });

    alert(headline + "\n" + mails);
    return false;
}

function addExportButton()
{

  const newDiv = document.createElement("p");
  newDiv.innerHTML = `
  <button id="exportButton">
    <i class="fa fa-save fa-fw text-blue"></i>
    Exportieren
  </button>
  `;

  const parent = document.querySelector('div.panel-default');
  // insert after "parent"
  parent.parentElement.insertBefore(newDiv, parent.nextElementSibling);
  // add handler - not needed, we have aglobal click handler, see note above
  //const cb = document.querySelector('#exportButton');
  //cb.addEventListener("onclick", doExport);
}
