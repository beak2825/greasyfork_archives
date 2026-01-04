// ==UserScript==
// @name WoS Export Script
// @namespace WOSEXPORTSCRIPT
// @match http://apps.webofknowledge.com/*
// @match https://apps.webofknowledge.com/*
// @grant none
// @version 0.0.2
// @description Batch export references from Web of Science for HistCite Pro.
// @downloadURL https://update.greasyfork.org/scripts/377113/WoS%20Export%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/377113/WoS%20Export%20Script.meta.js
// ==/UserScript==

if (!localStorage.getItem('currentPage')) {
  localStorage.setItem('currentPage', "1");
}

if (!localStorage.getItem('exportUntil')) {
  localStorage.setItem('exportUntil', "2");
}

if (!localStorage.getItem('pageSize')) {
  localStorage.setItem('pageSize', "500");
}

if (!localStorage.getItem('exporting')) {
  localStorage.setItem('exporting', "false");
}

window.setTimeout(() => {
  console.log('[INFO] Start Loading WoS Toolbox!');

  let qS = document.querySelector.bind(document);
  let execing = false;

  const dispatchDOMEvent = (node, eventType) => {
    let clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(eventType, true, true);
    node.dispatchEvent(clickEvent);
  }

  document.fetchHistCite = (page, pageSize = 500) => {
      let $ModalTrigger = qS('#select2-saveToMenu-container');
      dispatchDOMEvent($ModalTrigger, 'mousedown');

      let $exportTypeItem = [...document.querySelectorAll('#select2-saveToMenu-results > li')].find((i) => i.textContent === 'Save to Other File Formats')
      dispatchDOMEvent($exportTypeItem, 'mouseup');

      let $recordRangeRadio = qS('#numberOfRecordsRange');
      let $recordFrom = qS('#markFrom');
      let $recordTo = qS('#markTo');
      let $recordContent = qS('#bib_fields');
      let $fileFormat = qS('#saveOptions');
      let $send = qS('#ui-id-9 > form > div.quickoutput-overlay-buttonset > span > button');

      $recordRangeRadio.click();
      $recordFrom.value = (page - 1) * pageSize + 1;
      $recordTo.value = page * pageSize;
      $recordContent.value = 'HIGHLY_CITED HOT_PAPER OPEN_ACCESS PMID USAGEIND AUTHORSIDENTIFIERS ACCESSION_NUM FUNDING SUBJECT_CATEGORY JCR_CATEGORY LANG IDS PAGEC SABBR CITREFC ISSN PUBINFO KEYWORDS CITTIMES ADDRS CONFERENCE_SPONSORS DOCTYPE CITREF ABSTRACT CONFERENCE_INFO SOURCE TITLE AUTHORS  ';
      $fileFormat.value = 'fieldtagged';


      $send.click();
  }

  window.setTimeout(() => {
    const onClickExport = () => {
      document.fetchHistCite(
        JSON.parse(localStorage.getItem('currentPage')),
        JSON.parse(localStorage.getItem('pageSize'))
      )

      localStorage.setItem('currentPage', JSON.stringify(JSON.parse($currentPage.value) + 1));
      localStorage.setItem('exporting', JSON.stringify(true));

      setTimeout(() => {
        location.reload();
      }, 20000);
    }
    
    const onClickExportOne = () => {
      document.fetchHistCite(
        JSON.parse(localStorage.getItem('currentPage')),
        JSON.parse(localStorage.getItem('pageSize'))
      )

      setTimeout(() => {
        location.reload();
      }, 20000);
    }

    const onInputChanged = (e) => {
      const elementId = e.target.id;
      
      if (elementId === 'losses-wos-fire_export') {
        localStorage.setItem(
          elementDict[elementId][1], 
          JSON.stringify(elementDict[elementId][0].checked)
        );

        console.log(`[INFO] ${elementId} changed its value to ${elementDict[elementId][0].checked}`);
        return 1;
      }

      console.log(`[INFO] ${elementId} changed its value to ${elementDict[elementId][0].value}`);
      localStorage.setItem(
        elementDict[elementId][1], 
        JSON.stringify(elementDict[elementId][0].value)
      );
    }
    
    let toolBox = document.createElement('DIV');
    toolBox.innerHTML = `
    <style>
      .wos_toolbox {bottom: 1em; right: 1em; padding: 0.5em 1em; position:fixed; background:rgba(255, 255, 255, 0.9);}
      .wos_toolbox>p {margin: 0.2em 0;}
      .wos_toolbox input {width: 7em;}
      .wos_toolbox button {margin: 0.2em;}
      .losses-wos-title {text-align: center; 0 0 0.6em !important; font-size: 1.2em}
      .losses-wos-label {width: 7em; display: inline-block;}
      .losses-wos-buttons {text-align: center; margin: 0.5em 0;}
    </style>
    <p class="losses-wos-title">WoS Export Tool</p>
    <p><label><span class="losses-wos-label">Current Page</span><input type="number" id="losses-wos-current_page"/></label></p>
    <p><label><span class="losses-wos-label">Export Until</span><input type="number" id="losses-wos-export_until"/></label></p>
    <p><label><span class="losses-wos-label">Page Size</span><input type="number" id="losses-wos-page_size"/></label></p>
    <p><label><input type="checkbox" id="losses-wos-exporting"/> Exporting</label></p>
    <p class="losses-wos-buttons"><button id="losses-wos-fire_export">Export</button><button id="losses-wos-fire_export_once">Export Once</button></div></p>
    `;
    toolBox.setAttribute('class', 'wos_toolbox');
    document.body.appendChild(toolBox);

    let $currentPage = qS('#losses-wos-current_page');
    let $exportUntil = qS('#losses-wos-export_until');
    let $pageSize = qS('#losses-wos-page_size');
    let $exporting = qS('#losses-wos-exporting');
    let $fileExport = qS('#losses-wos-fire_export');
    let $fileExportOnce = qS('#losses-wos-fire_export_once');

    $currentPage.value = JSON.parse(localStorage.getItem('currentPage'));
    $exportUntil.value = JSON.parse(localStorage.getItem('exportUntil'));
    $pageSize.value = JSON.parse(localStorage.getItem('pageSize'));
    $exporting.checked = JSON.parse(localStorage.getItem('exporting'));
    $fileExport.addEventListener('click', onClickExport);
    $fileExportOnce.addEventListener('click', onClickExportOne);

    let elementDict = {
      'losses-wos-current_page': [$currentPage, 'currentPage'],
      'losses-wos-export_until': [$exportUntil, 'exportUntil'],
      'losses-wos-page_size': [$pageSize, 'pageSize'],
      'losses-wos-exporting': [$exporting, 'exporting']
    }

    Object.values(elementDict).map((i) => {
      i[0].addEventListener('input', onInputChanged);
      i[0].addEventListener('click', onInputChanged);
    })

    console.log('[INFO] WoS Toolkit Initialized!');

    if (JSON.parse($currentPage.value) > JSON.parse($exportUntil.value)){
      console.log('[INFO] SSSSSSSSTTTTTTTTTTTOOOOOOOOOOOOOPPPPPPPPPPPPP!');
      localStorage.setItem('currentPage', "1");
      $currentPage.value = 1;

      localStorage.setItem('exporting', "false");
      $exporting.checked = false;
    }

    if ($exporting.checked) {
      console.log('[INFO] Continue Exporting!');
      onClickExport();
    }
  }, 200);

  console.log('[INFO] WoS Export Script Loaded!');
}, 500);