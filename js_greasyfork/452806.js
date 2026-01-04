// ==UserScript==
// @name         qidian anti map
// @namespace    https://greasyfork.org/zh-CN/scripts/452806-qidian-anti-map
// @version      0.0.4
// @description  anti map used for qidian
// @author       initdc
// @license      MPL-2.0
// @homepageURL  https://github.com/initdc/qidian-anti-map
// @supportURL   https://github.com/initdc/qidian-anti-map/issues/new
// @match        https://www.lqzw.org/du/67324/25645342.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.qidian.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452806/qidian%20anti%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/452806/qidian%20anti%20map.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  function replaceDOM(d, pairs) {
    if (d) {
      const origin = d.innerHTML;
      const len = origin.length;
      const pLen = pairs.length;

      let ptr = 1;
      let lastPtr = 0;
      let index = 0;
      let wrapper = "";
      let content = "";

      for (ptr; ptr < len; ptr++) {
        if (index >= pLen) {
          ptr = len;
          continue;
        }
        wrapper = origin.slice(lastPtr, ptr);
        const pair = pairs[index];
        const copyWord = pair[0];
        if (wrapper.includes(copyWord)) {
          const word = pair[1];
          console.log(copyWord, "->", word);
          const newWrapper = wrapper.replace(copyWord, word);
          // if (newWrapper === wrapper) {
          //   console.error(copyWord, "->", word, "replace fault");
          // }
          content += newWrapper;
          lastPtr = ptr;
          index += 1;
        }
        wrapper = "";
      }
      wrapper = origin.slice(lastPtr);
      content += wrapper;
      d.innerHTML = content;
    }
  }

  const map_url =
    "https://raw.githubusercontent.com/initdc/qidian-anti-map/feat/last/dist/111.json";
  let fetchRes = await fetch(map_url);
  let resp = await fetchRes.json();
  //console.log(resp);

  const ID_Map = ["txt"];
  const classMap = [];

  ID_Map.forEach((id) => {
    const d = document.getElementById(id);
    replaceDOM(d, resp);
  });

  classMap.forEach((c) => {
    const d = document.getElementsByClassName(c)[0];
    replaceDOM(d, resp);
  });
})();
