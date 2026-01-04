// ==UserScript==
// @name         RPGMV 存档导出/导入
// @namespace    Aloxaf
// @version      0.2.2
// @description  对网页版 RPGMV 游戏的存档进行导入、导出
// @author       Aloxaf
// @license      GPLv3
// @match        https://*.loli.dating/
// @grant        unsafeWindow
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.9.1/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/443462/RPGMV%20%E5%AD%98%E6%A1%A3%E5%AF%BC%E5%87%BA%E5%AF%BC%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/443462/RPGMV%20%E5%AD%98%E6%A1%A3%E5%AF%BC%E5%87%BA%E5%AF%BC%E5%85%A5.meta.js
// ==/UserScript==

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function import_save(files) {
  for (let file of files) {
    let reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = event => {
      if (unsafeWindow.localforage) {
        let name = unsafeWindow.StorageManager.forageKey(file.name.split('.')[0]);
        let content = event.target.result;
        unsafeWindow.localforage.setItem(name, content)
      } else {
        let prefix = unsafeWindow.StorageManager.webStorageKey('').replace(/[^ ]+$/, '');
        let name = prefix + capitalize(file.name.split('.')[0]);
        let content = event.target.result;
        unsafeWindow.localStorage[name] = content;
      }
    };
  }
}


function export_save() {
  let zip = new JSZip();

  if (unsafeWindow.localforage) {
    unsafeWindow.localforage.iterate((v, k) => {
      let filename = k.replace(/(rmmzsave).\d+.(.*)/, '$2.$1')
      zip.file(filename, v);
    }).then(_ => {
      zip.generateAsync({type: "blob"})
        .then(content => {
        saveAs(content, "save.zip");
      });
    });
  } else {
    for (let [key, value] of Object.entries(window.localStorage)) {
      let t = key.split(' ');
      let filename = t[t.length - 1].toLowerCase();
      zip.file(`${filename}.rpgsave`, value);
    }
    zip.generateAsync({type: "blob"})
      .then(content => {
      saveAs(content, "save.zip");
    });
  }
}

const BUTTONS = `
<button onclick="export_save();">导出存档</button>
<button onclick="document.getElementById('file-input').click();">导入存档</button>
<input id="file-input" type="file" name="name" style="display: none;" onchange="import_save(this.files);" multiple="multiple"/>

<style>
button {
  z-index: 10;
  position: relative;
}
</style>
`;

(function() {
  'use strict';

  unsafeWindow.import_save = import_save;
  unsafeWindow.export_save = export_save;
  document.querySelector('body > script').insertAdjacentHTML('afterend', BUTTONS);
})();
