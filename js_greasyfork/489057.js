// ==UserScript==
// @name         MyJBLS
// @namespace    https://jbls.ide-soft.com
// @version      2024-03-01
// @description  tampermonkey magic script  for jetbrains, generate activation code for jetbrains plugin,use tampermonkey https://chromewebstore.google.com/detail/%E7%AF%A1%E6%94%B9%E7%8C%B4/dhdgffkkebhmkfjojejmpbldmpobfkfo to install this script
// @author       anonymous
// @match        https://plugins.jetbrains.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jetbrains.com
// @match        https://plugins.jetbrains.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        window.onurlchange
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489057/MyJBLS.user.js
// @updateURL https://update.greasyfork.org/scripts/489057/MyJBLS.meta.js
// ==/UserScript==
(function() {
  const maxAttempts = 50;
  const retryInterval = 100;
  const backendBaseUrl = 'https://jbls.ide-soft.com';
  const codes = ["YTD", "QDGO", "MF", "DG", "PS", "QA", "IIE", "YTWE", "FLS", "DLE", "RFU", "PPS", "PCWMP", "II", "TCC", "RSU", "PCC", "RC", "PCE", "FLIJ", "TBA", "DL", "SPP", "QDCLD", "SPA", "DMCLP", "PSW", "GW", "PSI", "IIU", "DMU", "PWS", "HB", "WS", "PCP", "KT", "DCCLT", "RSCLT", "WRS", "RSC", "RRD", "TC", "IIC", "QDPY", "DPK", "DC", "PDB", "DPPS", "QDPHP", "GO", "HCC", "RDCPPP", "QDJVMC", "CL", "DM", "CWML", "FLL", "RR", "QDJS", "RS", "RM", "DS", "MPS", "DPN", "US", "CLN", "DPCLT", "RSV", "MPSIIP", "DB", "QDANDC", "AC", "QDJVM", "PRB", "RD", "CWMR", "SP", "RS0", "DP", "RSF", "PGO", "QDPYC", "PPC", "PC", "EHS", "RSCHB", "FL", "QDNET", "JCD"];

  async function findElementWithRetry(cssSelector, timeout = 5000) {
    const maxAttempts = timeout / retryInterval;
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      const element = document.querySelector(cssSelector);
      if (element) {
        return element;
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
    throw new Error(`Element with selector '${cssSelector}' not found after ${maxAttempts} attempts.`);
  }

  async function addButton() {
    console.log('JetBra is running');
    'use strict';
    GM_addStyle(`
        .jetbra-button {
            background-color: #04AA6D;
            border: none;
            color: white;
            padding: 7.5px 15px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            border-radius: 16px;
            transition-duration: 0.4s;
        }

        .jetbra-button:hover {
            background-color: #00ce82;
            color: white;
        }

        .jetbra-button:active {
            background-color: #04AA6D;
            color: white;
        }

    `);

      const url = window.location.href;
      if (!url.startsWith('https://plugins.jetbrains.com/plugin/')) {
        return;
      }

      const pluginId = url.split('/')[4].split('-')[0];
      console.log('pluginId: ' + pluginId);

      const pluginDetail = await fetch(`https://plugins.jetbrains.com/api/plugins/${pluginId}`).then(r => r.json());

      const parentElement = await findElementWithRetry('.plugin-header__controls-panel > div:first-child');

      if (parentElement.querySelector('.show-form-button')) {
        return;
      }
      const newElement = document.createElement('div');
      newElement.classList.toggle('wt-col-inline');
      newElement.innerHTML = `<button class="show-form-button jetbra-button" type="button">生成注册码</button>`;
      parentElement.appendChild(newElement);

      newElement.addEventListener('click', async () => {
        let ls=window.localStorage
        let licenseeName=ls.getItem('licenseeName')
        if(!licenseeName){
          licenseeName=window.prompt('请输入证书授权人名称:')||'SuperMan'
          ls.setItem("licenseeName",licenseeName)
        }

        if (!pluginDetail.purchaseInfo) {
          window.alert('这不是付费插件');
          return;
        }

        codes.push(pluginDetail.purchaseInfo.productCode);
        const currentDate = new Date();
        const fallbackDate = currentDate.toISOString().slice(0, 10);
        currentDate.setFullYear(currentDate.getFullYear() + 10);
        const paidUpTo = currentDate.toISOString().slice(0, 10);
        const products = codes.map(code => ({
          code,
          fallbackDate: fallbackDate,
          paidUpTo: paidUpTo,
          extended: true,
        }));

        const data = {
          licenseeName,
          products
        };
        console.log(data)
        try {
          GM_xmlhttpRequest({
            method: 'POST',
            url: backendBaseUrl + '/generateLicense',
            headers: {
              'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            onload: function (response) {
              let license = JSON.parse(response.responseText).license
              GM_setClipboard(license, 'text');
              window.alert('注册码已复制');
            }
          });
        } catch (error) {
          console.error('Error generating license:', error);
          window.alert('出错了.');
        }
      });
    }

  addButton();

  if (!window.onurlchange) {
    window.addEventListener('urlchange', () => {
      addButton();
    });
  }
})();
