// ==UserScript==
// @name         Темное выделение информации водителя
// @version      0.2
// @description  ...
// @author       Gusev
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/376207/%D0%A2%D0%B5%D0%BC%D0%BD%D0%BE%D0%B5%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D0%B8%20%D0%B2%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/376207/%D0%A2%D0%B5%D0%BC%D0%BD%D0%BE%D0%B5%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D0%B8%20%D0%B2%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D1%8F.meta.js
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