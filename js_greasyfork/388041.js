// ==UserScript==
// @name         auto_download_Unsplash_image
// @name:zh-TW   自動下載 Unsplash 的照片
// @version      3.0
// @description  while you open Unspladh photo web , will download this photo.
// @description:zh-tw  當你打開 Unsplash 網站的照片網址時，這個腳本會自動下載圖片到你的電腦。
// @author       we684123@github
// @namespace    https://github.com/we684123/auto_download_Unsplash_image
// @match        https://unsplash.com/photos/*
// @connect      unsplash.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/388041/auto_download_Unsplash_image.user.js
// @updateURL https://update.greasyfork.org/scripts/388041/auto_download_Unsplash_image.meta.js
// ==/UserScript==

(function () {
  //基礎定義
  const image_download_butter = document.querySelector("a.untracked");
  try {
    image_download_butter.click();
    var magic = [
      "  ∧＿∧\n",
      "（｡･ω･｡)つ━☆・*。\n",
      "⊂　　 ノ 　　　・゜+.\n",
      "しーＪ　　　°。+ *´¨)\n",
      "　　       　　.· ´¸.·*´¨) ¸.·*¨)\n",
      "　　     　(¸.·´ (¸.·’*"
    ]
    console.log(magic.join(""));
    console.log("====== download done. ======");
  } catch (e) {
    console.log("error:");
    console.log(e);
  } finally {
    console.log("====== end ======");
  }
})();
