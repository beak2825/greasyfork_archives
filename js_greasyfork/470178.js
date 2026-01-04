// ==UserScript==
// @name         Cek Status Data SPTJM & SR | Kampus Merdeka Batch 5 2023
// @namespace    javascript
// @version      1.0
// @description  Gunakan shortcut keyboard CTRL + SHIFT + J (Windows) / CMD + OPTION + J (macOS) pada browser untuk melihat status data anda
// @author       Okki Dwi | https://linktr.ee/okkidwi
// @match        https://kampusmerdeka.kemdikbud.go.id/*
// @icon         https://raw.githubusercontent.com/okkidwi/cek-status-data-sptjm-sr-kampus-merdeka/main/images/icon-kampus-merdeka.png
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470178/Cek%20Status%20Data%20SPTJM%20%20SR%20%7C%20Kampus%20Merdeka%20Batch%205%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/470178/Cek%20Status%20Data%20SPTJM%20%20SR%20%7C%20Kampus%20Merdeka%20Batch%205%202023.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const printErrorShouldLoginBefore = () => {
    console.log(
      '%cKESALAHAN, SKRIP GAGAL MENGURAI DATA ANDA',
      'font-size: 18px; color: #f00; background: #000;'
    );
    throw new Error('NOT_LOGGED_IN');
  };

  const printGenericError = (err) => {
    console.log(
      `%cError: ${err}`,
      'font-size: 18px; color: #f00; background: #000;'
    );
    throw err;
  };

  const currentCycle = 5;

  const userLocalKey = `@mkbm/manager/user`;
  const storageData = localStorage.getItem(userLocalKey);
  if (!storageData) {
    printErrorShouldLoginBefore();
  }
  const storageDataParsed = JSON.parse(storageData);
  if (!storageDataParsed) {
    printErrorShouldLoginBefore();
  }
  const token = storageDataParsed?.value?.token;
  if (!token) {
    printErrorShouldLoginBefore();
  }

  const abortController = new AbortController();

  const getActiveDocuments = async () => {
    const resp = await fetch(
      'https://api.kampusmerdeka.kemdikbud.go.id/v1alpha1/documents?type=SPTJM,SURAT_REKOMENDASI&programs=Magang',
      {
        signal: abortController.signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((resp) => resp.json());
    const docs = resp.data;
    const mapDocumentByType = {};
    docs.forEach((doc) => {
      if (!(doc.type in mapDocumentByType)) {
        mapDocumentByType[doc.type] = [];
      }

      doc.cycle_int = Number.parseInt(doc.cycle);
      mapDocumentByType[doc.type].push(doc);
    });

    return mapDocumentByType;
  };

  const getDocumentLatestCycle = (currentCycle, data) => {
    const sortedData = [...data].sort(
      (docA, docB) => docB.cycle_int - docA.cycle_int
    );
    return sortedData.find((doc) => doc.cycle_int <= currentCycle);
  };

  const getUserDocumentStatus = async (docId, docType) => {
    const resp = await fetch(
      `https://api.kampusmerdeka.kemdikbud.go.id/v1alpha1/documents/${docId}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((resp) => resp.json());

    const status = resp?.data?.status;
    if (!status) {
      return `DATA ${docType} TIDAK DAPAT DITEMUKAN`;
    }

    return status;
  };

  const getCurrentDateTimeWIB = () => {
    const date = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Asia/Jakarta',
    };
    return date.toLocaleString('id-ID', options);
  };

  const main = async () => {
    try {
      const documentMapped = await getActiveDocuments();
      const docsSPTJM = documentMapped['SPTJM'];
      const docsSR = documentMapped['SURAT_REKOMENDASI'];

      if (!docsSPTJM || !docsSR) {
        throw 'Data SPTJM atau SURAT REKOMENDASI tidak ditemukan';
      }

      const validDocSPTJM = getDocumentLatestCycle(currentCycle, docsSPTJM);
      const validDocsSR = getDocumentLatestCycle(currentCycle, docsSR);

      if (!validDocSPTJM || !validDocsSR) {
        throw 'Data SPTJM atau SURAT REKOMENDASI tidak ditemukan';
      }

      const sptjmId = validDocSPTJM.id;
      const srId = validDocsSR.id;
      const statusUserSptjm = await getUserDocumentStatus(sptjmId, 'SPTJM');
      const statusUserSr = await getUserDocumentStatus(srId, 'SURAT REKOMENDASI');

      const dateTimeWIB = getCurrentDateTimeWIB();

      console.log(
        `%c[${dateTimeWIB} WIB] Status SPTJM anda adalah %c${statusUserSptjm}`,
        'font-size: 24px; color: black; background: white;',
        `font-size: 30px; background: ${
          statusUserSptjm === 'VERIFIED'
            ? 'green'
            : statusUserSptjm === 'REJECTED'
            ? 'red'
            : 'blue'
        }; color: white;`
      );
      console.log(
        `%c[${dateTimeWIB} WIB] Status SURAT REKOMENDASI anda adalah %c${statusUserSr}`,
        'font-size: 24px; color: black; background: white;',
        `font-size: 30px; background: ${
          statusUserSr === 'VERIFIED'
            ? 'green'
            : statusUserSr === 'REJECTED'
            ? 'red'
            : 'blue'
        }; color: white;`
      );
    } catch (err) {
      printGenericError(err);
    }
  };

main();
})();