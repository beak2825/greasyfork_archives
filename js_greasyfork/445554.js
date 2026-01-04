
// ==UserScript==
// @name        Aetna Clinical Policy Script
// @namespace   policyreporter-userscripts
// @description This is a userscript.
// @match       https://www.aetna.com/health-care-professionals/clinical-policy-bulletins/medical-clinical-policy-bulletins*
// @version     1.0.1
// @author      Policy Reporter
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/445554/Aetna%20Clinical%20Policy%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/445554/Aetna%20Clinical%20Policy%20Script.meta.js
// ==/UserScript==

(function () {
'use strict';

const alphabeticalOrder = async () => {
  console.log('Running alphabeticalOrder');
  let rows = [];

  async function getChar(char) {
    const response = await fetch('https://www.aetna.com/etc/designs/aethfe/services/xmlfilter?source=%2Fcontent%2Faetna%2Fen%2Fhealth-care-professionals%2Fxml%2Fmcpb-alpha.xml&returnBy=link&filterBy=listing&filterBy=type&filterValues=Alpha%20listing&filterValues=' + char + '&additionalValues=&additionalValues=&sortBy=link', {
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest'
      },
      referrer: 'https://www.aetna.com/health-care-professionals/clinical-policy-bulletins/medical-clinical-policy-bulletins.html',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    });
    const text = await response.text();

    if (text[0] == '<') {
      //ran into Incapsula. Dump to output so Bee detects forbidden by CDN
      rows.push(text);
      return;
    }

    const body = JSON.parse(text);
    rows = rows.concat(body.map(e => e['link']));
  }

  const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  for (const char of alphabets) {
    await getChar(char);
  }

  rows.sort();
  document.open();
  rows.forEach(e => {
    document.write(e);
  });
  console.log('Done alphabeticalOrder');
};

const changes = async () => {
  console.log('Running changes');
  let rows = [];
  const statusResp = await fetch('https://www.aetna.com/etc/designs/aethfe/services/xmlfilter?source=%2Fcontent%2Faetna%2Fen%2Fhealth-care-professionals%2Fxml%2Fmcpb-changes.xml&returnBy=status&sortBy=status', {
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-requested-with': 'XMLHttpRequest'
    },
    referrer: 'https://www.aetna.com/health-care-professionals/clinical-policy-bulletins/medical-clinical-policy-bulletins.html',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  });
  const statusText = await statusResp.text();

  if (statusText[0] == '<') {
    rows.push(statusText);
    throw 'forbidden by CDN status';
  }

  const statusBody = JSON.parse(statusText);
  const statuses = statusBody.map(e => e['status']);

  for (const status of statuses) {
    const monthResp = await fetch('https://www.aetna.com/etc/designs/aethfe/services/xmlfilter?source=%2Fcontent%2Faetna%2Fen%2Fhealth-care-professionals%2Fxml%2Fmcpb-changes.xml&returnBy=month&filterBy=status&filterValues=' + status + '&additionalValues=&sortBy=month', {
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest'
      },
      referrer: 'https://www.aetna.com/health-care-professionals/clinical-policy-bulletins/medical-clinical-policy-bulletins.html',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    });
    const monthText = await monthResp.text();

    if (monthText[0] == '<') {
      rows.push(monthText);
      throw 'forbidden by CDN month';
    }

    const monthBody = JSON.parse(monthText);
    const months = monthBody.map(e => e['month']);

    for (const month of months) {
      const dateResp = await fetch('https://www.aetna.com/etc/designs/aethfe/services/xmlfilter?source=%2Fcontent%2Faetna%2Fen%2Fhealth-care-professionals%2Fxml%2Fmcpb-changes.xml&returnBy=date&filterBy=status&filterBy=month&filterValues=' + status + '&filterValues=' + month + '&additionalValues=&additionalValues=&sortBy=date', {
        headers: {
          accept: 'application/json, text/javascript, */*; q=0.01',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-requested-with': 'XMLHttpRequest'
        },
        referrer: 'https://www.aetna.com/health-care-professionals/clinical-policy-bulletins/medical-clinical-policy-bulletins.html',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
      });
      const dateText = await dateResp.text();

      if (dateText[0] == '<') {
        rows.push(dateText);
        throw 'forbidden by CDN date' + month;
      }

      const dateBody = JSON.parse(dateText);
      const dates = dateBody.map(e => e['date']);

      for (const date of dates) {
        const resp = await fetch('https://www.aetna.com/etc/designs/aethfe/services/xmlfilter?source=%2Fcontent%2Faetna%2Fen%2Fhealth-care-professionals%2Fxml%2Fmcpb-changes.xml&returnBy=date&returnBy=link&filterBy=status&filterBy=month&filterBy=date&filterValues=' + status + '&filterValues=' + month + '&filterValues=' + date + '&additionalValues=&additionalValues=&additionalValues=&sortBy=link', {
          headers: {
            accept: 'application/json, text/javascript, */*; q=0.01',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
            Referer: 'https://www.aetna.com/health-care-professionals/clinical-policy-bulletins/medical-clinical-policy-bulletins.html',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
          },
          body: null,
          method: 'GET'
        });
        const text = await resp.text();

        if (text[0] == '<') {
          rows.push(text);
          throw 'forbidden by CDN resp' + date;
        }

        const body = JSON.parse(text);
        rows = rows.concat(body.map(e => e['link']));
      }
    }
  }

  rows.sort();
  document.open();
  rows.forEach(e => {
    document.write(e);
  });
  console.log('Done changes');
};

const periodicReview = async () => {
  console.log('Running periodicReview');
  let rows = [];
  const monthResp = await fetch('https://www.aetna.com/etc/designs/aethfe/services/xmlfilter?source=%2Fcontent%2Faetna%2Fen%2Fhealth-care-professionals%2Fxml%2Fmcpb-review.xml&returnBy=month&sortBy=month', {
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-requested-with': 'XMLHttpRequest'
    },
    referrer: 'https://www.aetna.com/health-care-professionals/clinical-policy-bulletins/medical-clinical-policy-bulletins.html',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  });
  const monthText = await monthResp.text();

  if (monthText[0] == '<') {
    rows.push(monthText);
    throw 'forbidden by CDN month';
  }

  const monthBody = JSON.parse(monthText);
  const months = monthBody.map(e => e['month']);

  for (const month of months) {
    const dateResp = await fetch('https://www.aetna.com/etc/designs/aethfe/services/xmlfilter?source=%2Fcontent%2Faetna%2Fen%2Fhealth-care-professionals%2Fxml%2Fmcpb-review.xml&returnBy=date&filterBy=month&filterValues=' + month + '&additionalValues=&sortBy=date', {
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest'
      },
      referrer: 'https://www.aetna.com/health-care-professionals/clinical-policy-bulletins/medical-clinical-policy-bulletins.html',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    });
    const dateText = await dateResp.text();

    if (dateText[0] == '<') {
      rows.push(dateText);
      throw 'forbidden by CDN date' + month;
    }

    const dateBody = JSON.parse(dateText);
    const dates = dateBody.map(e => e['date']);

    for (const date of dates) {
      const resp = await fetch('https://www.aetna.com/etc/designs/aethfe/services/xmlfilter?source=%2Fcontent%2Faetna%2Fen%2Fhealth-care-professionals%2Fxml%2Fmcpb-review.xml&returnBy=cpb&filterBy=month&filterBy=date&filterValues=' + month + '&filterValues=' + date + '&additionalValues=&additionalValues=&sortBy=cpb', {
        headers: {
          accept: 'application/json, text/javascript, */*; q=0.01',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-requested-with': 'XMLHttpRequest'
        },
        referrer: 'https://www.aetna.com/health-care-professionals/clinical-policy-bulletins/medical-clinical-policy-bulletins.html',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
      });
      const text = await resp.text();

      if (text[0] == '<') {
        rows.push(text);
        throw 'forbidden by CDN resp' + date;
      }

      const body = JSON.parse(text);
      rows = rows.concat(body.map(e => '<p>' + e['cpb'] + '</p>'));
    }
  }

  rows.sort();
  document.open();
  rows.forEach(e => {
    document.write(e);
  });
  console.log('Done periodicReview');
};

GM_registerMenuCommand('Alphabetical Order', alphabeticalOrder, 'a');
GM_registerMenuCommand('Changes', changes, 'a');
GM_registerMenuCommand('Periodic Review', periodicReview, 'a');

})();
