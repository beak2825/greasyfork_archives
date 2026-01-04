// ==UserScript==
// @name         JSON Formatter
// @namespace    https://greasyfork.org/users/649
// @version      1.0.1
// @description  auto format JSON files
// @author       Adrien Pyke
// @include      /^.*\.json(\?.*)?$/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/gh/kufii/My-UserScripts@c7f613292672252995cb02a0cab3b6acb18ccac5/libs/gm_config.js
// @downloadURL https://update.greasyfork.org/scripts/407804/JSON%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/407804/JSON%20Formatter.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const Config = GM_config([
    { key: 'tabSize', label: 'Tab Size', type: 'number', min: 0, default: 2 },
    { key: 'wordWrap', label: 'Word Wrap', type: 'bool', default: true }
  ]);
  GM_registerMenuCommand('JSON Formatter: Config', Config.setup);

  const format = ({ tabSize, wordWrap }) => {
    const formatted = JSON.stringify(
      JSON.parse(document.body.textContent),
      null,
      Number(tabSize)
    );
    document.body.innerHTML = `<code><pre style="${
      wordWrap ? 'white-space:pre-wrap;word-break:break-word' : ''
    }" id="jsonArea"></pre></code>`;
    document.getElementById('jsonArea').textContent = formatted;
  };
  format(Config.load());
  Config.onsave = format;
})();
