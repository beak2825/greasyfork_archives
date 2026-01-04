// ==UserScript==
// @name         Тёмное выделение
// @version      0.1
// @description  ...
// @author       Martynova
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=branding
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=branding
// @grant        none
// @namespace    https://greasyfork.org/ru/users/445721
// @downloadURL https://update.greasyfork.org/scripts/403398/%D0%A2%D1%91%D0%BC%D0%BD%D0%BE%D0%B5%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/403398/%D0%A2%D1%91%D0%BC%D0%BD%D0%BE%D0%B5%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5.meta.js
// ==/UserScript==

(function() {

    document.querySelectorAll('.form-control').forEach((el)=>{
        el.style.backgroundColor = '#555'
        el.style.color = '#ccc'
    })

    document.querySelectorAll('.datagrid .datagrid-body').forEach((el)=>{
        el.style.backgroundColor = '#555'
    })

    document.querySelectorAll('.btn').forEach((el)=>{
        el.style.color = '#ccc'
    })

    document.getElementById('info').style.backgroundColor = 'rgba(37, 37, 37, 0.58)'
    document.getElementById('info').style.color = '#ccc'

    document.querySelectorAll('.modal-content').forEach((el)=>{
        el.style.backgroundColor = '#555'
    })

    document.getElementById('btn-block').addEventListener('click', () => {
        document.querySelectorAll('.list-group > li').forEach((el)=>{
            el.style.backgroundColor = '#ccc'
        })

        const inputAll = document.querySelector('input[type="checkbox"]'),
              parent = inputAll.closest('div')

        parent.addEventListener('click', () => {
            if (inputAll.checked) {
                document.querySelectorAll('.list-group > li').forEach((el)=>{
                    el.style.backgroundColor = '#ccc'
                })
            }
        })
    })

    document.getElementById('btn-blacklist').addEventListener('click', () => {
        document.querySelectorAll('.list-group > li').forEach((el)=>{
            el.style.backgroundColor = '#ccc'
        })

        const inputAll = document.querySelector('input[type="checkbox"]'),
              parent = inputAll.closest('div')

        parent.addEventListener('click', () => {
            if (inputAll.checked) {
                document.querySelectorAll('.list-group > li').forEach((el)=>{
                    el.style.backgroundColor = '#ccc'
                })
            }
        })
    })

//$('#info').css('backgroundColor','rgba(37, 37, 37, 0.58)');

})();