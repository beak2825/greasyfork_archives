// ==UserScript==
// @name         Перенос повышенных тарифов
// @version      0.1
// @description  ...
// @author       yandex
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @namespace https://greasyfork.org/users/395826
// @downloadURL https://update.greasyfork.org/scripts/398434/%D0%9F%D0%B5%D1%80%D0%B5%D0%BD%D0%BE%D1%81%20%D0%BF%D0%BE%D0%B2%D1%8B%D1%88%D0%B5%D0%BD%D0%BD%D1%8B%D1%85%20%D1%82%D0%B0%D1%80%D0%B8%D1%84%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/398434/%D0%9F%D0%B5%D1%80%D0%B5%D0%BD%D0%BE%D1%81%20%D0%BF%D0%BE%D0%B2%D1%8B%D1%88%D0%B5%D0%BD%D0%BD%D1%8B%D1%85%20%D1%82%D0%B0%D1%80%D0%B8%D1%84%D0%BE%D0%B2.meta.js
// ==/UserScript==

const labelCity = document.querySelector('optgroup[label="Повышенные тарифы"]'),
      labelGroup = document.querySelector('optgroup[label="По группам"]')

labelGroup.before(labelCity)