// ==UserScript==
// @name        キャラクターシートをCtrl+Sで保存
// @namespace   CharacterSheetSaveHotKey
// @match       https://charasheet.vampire-blood.net/*
// @grant       none
// @version     1.0
// @description キャラクターシート保管庫（https://charasheet.vampire-blood.net/）にて、Ctrl+Sキー押下をシートの上書き保存に割り当てます。
// @author      Saara
// @license     unlicensed
// @description 2024/6/4 23:35:27
// @downloadURL https://update.greasyfork.org/scripts/497043/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E3%82%B7%E3%83%BC%E3%83%88%E3%82%92Ctrl%2BS%E3%81%A7%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/497043/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E3%82%B7%E3%83%BC%E3%83%88%E3%82%92Ctrl%2BS%E3%81%A7%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==
(() => {
  document.documentElement.addEventListener('keydown', event => {
    if (event.ctrlKey && event.code === 'KeyS') {
      console.log(document);
      let save = document.querySelector('#MAKING button[onclick="return submitDataSave(0)"]')
      if (save){
        save.click();
        event.preventDefault();
      }
    }
  });
}
)()