// ==UserScript==
// @name              Make asmr.one download dialog bigger
// @name:zh-CN        放大 asmr.one 的下载对话框
// @name:ja-JP        asmr.one のダウンロード窓を拡大せよ
// @namespace         http://tampermonkey.net/
// @version           2.0.0-20241112
// @description:en    For further tuning, search for "look here" in script.
// @description:zh-CN 如需微调大小，搜索脚本中的 "look here"
// @description:ja-JP サイズを調整するには、スクリプトの「look here」をご参照ください
// @author            Homo Hamstern (仓猿)
// @match             https://asmr.one/work/*
// @match             https://*.asmr.one/work/*
// @grant             none
// @license           MIT
// @description Make asmr.one download dialog bigger.
// @downloadURL https://update.greasyfork.org/scripts/497603/Make%20asmrone%20download%20dialog%20bigger.user.js
// @updateURL https://update.greasyfork.org/scripts/497603/Make%20asmrone%20download%20dialog%20bigger.meta.js
// ==/UserScript==

(() => {
    "use strict";
    
    const width = "60vw"; // locok here
    const height = "55vh"; // locok here
    
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      .q-gutter-y-sm .q-scrollarea {
          height: ${height} !important;
      }

      .q-dialog-plugin {
          width: ${width} !important;
          max-width: ${width} !important;
      }
    `;
    document.head.appendChild(style);
})();
