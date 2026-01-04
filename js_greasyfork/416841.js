// ==UserScript==
// @name         Перенос стикеров(галочки)
// @version      0.0.1
// @description  ///ДКБ
// @author       ya
// @include       https://taximeter-admin.taxi.yandex-team.ru/qc?exam=branding
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/416841/%D0%9F%D0%B5%D1%80%D0%B5%D0%BD%D0%BE%D1%81%20%D1%81%D1%82%D0%B8%D0%BA%D0%B5%D1%80%D0%BE%D0%B2%28%D0%B3%D0%B0%D0%BB%D0%BE%D1%87%D0%BA%D0%B8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416841/%D0%9F%D0%B5%D1%80%D0%B5%D0%BD%D0%BE%D1%81%20%D1%81%D1%82%D0%B8%D0%BA%D0%B5%D1%80%D0%BE%D0%B2%28%D0%B3%D0%B0%D0%BB%D0%BE%D1%87%D0%BA%D0%B8%29.meta.js
// ==/UserScript==

let url = document.location.href

if (url.includes('qc?exam=branding')) {
    const labelAllStockers = document.getElementById('btn-lightbox').closest('.check-thumb-number'),
          info = document.getElementById('info').closest('.check-thumb-number')
    info.append(labelAllStockers)
    labelAllStockers.style.position = 'static'
}