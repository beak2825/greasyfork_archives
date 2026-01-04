// ==UserScript==
// @name        фикс высоты рекламы
// @namespace   Violentmonkey Scripts
// @match       https://mail.yandex.ru/lite/*
// @grant       GM.addStyle
// @version     1.0
// @author      yyko
// @description не даёт блоку рекламы изменяться в размерах после загрузки
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/519121/%D1%84%D0%B8%D0%BA%D1%81%20%D0%B2%D1%8B%D1%81%D0%BE%D1%82%D1%8B%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519121/%D1%84%D0%B8%D0%BA%D1%81%20%D0%B2%D1%8B%D1%81%D0%BE%D1%82%D1%8B%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B.meta.js
// ==/UserScript==
GM.addStyle(`
.b-direct-stripe {
  max-height: 22px;
  overflow-y: hidden;
}
`);