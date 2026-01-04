// ==UserScript==
// @name Humble Bundle Key Downloader
// @description Download keys from all open Humble Bundle gift pages
// @namespace Mattwmaster58 Scripts
// @match https://www.humblebundle.com/downloads?key=*
// @grant GM_registerMenuCommand
// @version 0.0.1.20191009172607
// @downloadURL https://update.greasyfork.org/scripts/390942/Humble%20Bundle%20Key%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/390942/Humble%20Bundle%20Key%20Downloader.meta.js
// ==/UserScript==

const store = window.localStorage;
const pageID = location.search.replace(/^.*?=/, '');
GM_registerMenuCommand('Download all open pages', download);
main();

function main() {
  let name, key;
  console.log('downloader: running main()');
  const obsvr = new MutationObserver((event) => {
    console.log(event);
    event.forEach((record) => {
      if (record.addedNodes) {
        record.addedNodes.forEach((node) => {
            if ('querySelector' in node) {
              const revealedKey = node.querySelector('.js-keyfield.keyfield.redeemed.enabled');
              const revealedName = node.querySelector('.heading-text');
              if (revealedKey) {
                console.log(`downloader: revealed key: ${revealedKey.title}`);
                key = revealedKey.title;
              }
              if (revealedName) {
                console.log(`downloader: revealed name: ${revealedName.innerText}`);
                name = revealedName.innerText;
              }
            }
            if (name && key) {
              console.log(`downloader: name and key both set`);
              setPageData(name, key);
              obsvr.disconnect();
            }
          }
        );
      }
    })
  });
  const config = {attributes: true, childList: true, subtree: true};
  obsvr.observe(document.querySelector('.key-container'), config);
}

function setPageData(name, key) {
  let pages = registeredPages();
  let encoded_data = `"${name}","${key}"\n`;
  console.log(pages);
  if (pages[pageID] === encoded_data) {
    console.log(`downloader: encoded data for page ${pageID} already entered: ${encoded_data}`);
  } else {
    console.log(`downloader: setting page data for page ${pageID}:${encoded_data}`);
    pages[pageID] = encoded_data;
    store.setItem('registeredPages', JSON.stringify(pages));
    window.addEventListener('beforeunload', () => {
      unregisterPage();
    });
  }
}

function registeredPages() {
  let pages = JSON.parse(store.getItem('registeredPages'));
  if (pages == null) {
    store.setItem('registeredPages', JSON.stringify({}))
  }
  return pages || {};
}

function unregisterPage() {
  console.log(`downloader: unregistering page ${pageID}`);
  let pages = JSON.parse(store.getItem('registeredPages'));
  if (pages != null) {
    delete pages[pageID];
    store.setItem('registeredPages', JSON.stringify(pages));
  }
}

function download() {
  const pages = JSON.parse(store.getItem('registeredPages'));
  let master_data = '"Game","Key"\n';
  Object.values(pages).forEach((entry) => {
    master_data += entry;
  });
  console.log(`downloader: master data:\n${master_data}`);
  let a = document.createElement('a');
  a.href = 'data:application/csv;charset=utf-8,' + encodeURIComponent(master_data);
  a.download = 'humble_bundle_data.csv';
  document.getElementsByTagName('body')[0].appendChild(a);
  a.click();
}
