// ==UserScript==
// @name         Kdocs batch download 金山文档批量下载
// @namespace    http://tampermonkey.net/
// @version      2024-03-20
// @description  Download a directory in kdocs. 金山文档批量下载。
// @author       yusanshi
// @match        https://www.kdocs.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kdocs.cn
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488123/Kdocs%20batch%20download%20%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/488123/Kdocs%20batch%20download%20%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

let zip;

async function dfs(folderID, paths) {
  // Recursively download all files in `folderID` to `paths`.
  await new Promise((r) => setTimeout(() => r(), 200));
  const groupID = window.location.pathname.split('/')[2];
  const response = await fetch(
    `https://drive.kdocs.cn/api/v5/groups/${groupID}/files?parentid=${folderID}&count=10000000`,
    { credentials: 'include' }
  ).then((response) => response.json());
  if (response.next_offset !== -1) {
    throw new Error('Error file count');
  }
  const files = response.files.map((e) => ({
    name: e.fname,
    id: e.id,
    type: e.ftype,
  }));

  for (const file of files) {
    await new Promise((r) => setTimeout(() => r(), 200));
    if (['file', 'sharefile'].includes(file.type)) {
      let url;
      try {
        const response = await fetch(
          `https://www.kdocs.cn/api/v3/office/file/${file.id}/download`
        ).then((response) => {
          if (!response.ok) {
            throw new Error(response.status);
          }
          return response.json();
        });
        url = response.url;
      } catch (error) {
        console.error(
          `Failed to download ${file.name} (${error.message}), skipped`
        );
        continue;
      }

      const filepath = [...paths, file.name].join('/');
      console.log(`Download ${filepath} at ${url}`);
      const blob = await fetch(url).then((response) => response.blob());
      zip.file(filepath, blob);
    } else if (['folder', 'linkfolder'].includes(file.type)) {
      await dfs(file.id, [...paths, file.name]);
    } else {
      console.error(`Unknown file type ${file.type}`);
    }
  }
}

window.downloadDirectory = async function () {
  document.querySelector('#downloadDirectory').innerText =
    'Downloading (see console for details)';
  zip = new JSZip();
  const folderID =
    new URLSearchParams(window.location.search).get('folderid') ||
    window.location.pathname.split('/')[3];
  if (!folderID) {
    throw new Error('Folder ID not found');
  }
  await dfs(folderID, []);
  zip.generateAsync({ type: 'blob' }).then(function (content) {
    const url = URL.createObjectURL(content);
    window.location.assign(url);
  });
  document.querySelector('#downloadDirectory').innerText = 'Download finished';
};

(function () {
  'use strict';

  document.body.insertAdjacentHTML(
    'beforeend',
    `<div style="
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 10;
    ">
    <button type="button" style="padding:8px;" id="downloadDirectory" onclick="downloadDirectory()">Download directory</button>
  </div>`
  );
})();
