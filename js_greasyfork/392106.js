// ==UserScript==
// @name         Автокод b2b fix
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Оптимизация интерфейса выбора отчета
// @author       SL
// @run-at       document-body
// @include      https://b2b.avtocod.ru/reports*
// @downloadURL https://update.greasyfork.org/scripts/397037/%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D0%BE%D0%B4%20b2b%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/397037/%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D0%BE%D0%B4%20b2b%20fix.meta.js
// ==/UserScript==

document.querySelector('[name="reportType"]').value = 'yandex_project_check_auto_report@yandex_project'

document.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('.btn-success')
    btns.forEach(function(btn){
        btn.dataset.toggle = 'none'
        //console.log(btn.href)
        btn.addEventListener('click', (event) => {
            event.preventDefault()
            window.location.href = `${btn.href}/html`;
        })
    })
})