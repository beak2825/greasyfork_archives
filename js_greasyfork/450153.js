// ==UserScript==
// @name         Make me company
// @namespace    http://tampermonkey.net/
// @version      0.18
// @supportURL   https://greasyfork.org/en/scripts/450153-make-me-company
// @description  На странице поиска организации добавляет кнопку, которая сразу делает тебя компаниеей nameYourCompany
// @author       Roman Novotochin
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eis24.me
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450153/Make%20me%20company.user.js
// @updateURL https://update.greasyfork.org/scripts/450153/Make%20me%20company.meta.js
// ==/UserScript==

// я не умею писать нормальные патерны для @match, поэтому у меня @match - *
let idCompany1 = '526234b3e0e34c4743822066'          // Главстрой
let icoCompany1 = 'https://i.ibb.co/RbFL4b7/ico.jpg' // Главстрой

let idCompany2 = '5e5513244157870012251929'             // сзрц
let icoCompany2 = 'https://i.ibb.co/yY6QZGg/Title2.jpg' // сзрц

let idCompany3 = '5c9346e443cf66002dd04daa'            // ркц
let icoCompany3 = 'https://i.ibb.co/fMZz04P/image.png' // ркц

//let icoCompanyN = 'https://i.ibb.co/89qGS7c/Login-rounded-up.png' // Дефолтная иконка

let timerId = setInterval(() => checkURL(idCompany1, idCompany2, idCompany3), 700);

function checkURL(id, ...theArgs) {
    let nowLink = window.location.href.split('#')
    if (nowLink[1] === '/providers/list') {
        let blockForButton = $('#breadcrumbs')
        if ($(`#makeComp${id}`).length === 0) {
            addButton1()
        }
    } else {
        $(`#makeComp${id}`).remove()
        theArgs.map(arg => {
             $(`#makeComp${arg}`).remove()
        })
    }
}

function addButton1() {
    setTimeout(createButton(idCompany1, icoCompany1), 200)
    //setTimeout(createButton(idCompany2, icoCompany2), 200)
    //setTimeout(createButton(idCompany3, icoCompany3), 200)
}

function createButton(id, ico) {
    let nowLink = window.location.href.split('#')
    let blockForButton = $('#breadcrumbs')
    blockForButton.append(`<button id='makeComp${id}' type='button' class=''></button>`)
    let button = $(`#makeComp${id}`)
    button.css('margin-left','20px')
    button.css('background-image',`url(${ico})`)
    button.css('width','16px')
    button.css('height','16px')
    button.css('padding','0')
    button.css('border','0')
    button.on('click', function() {
        fetch(`${nowLink[0]}api/v2/auth/proxy/provider/${id}/`)
        .then(res => {
            location.href = '/'
        })
        .catch(e => {
            console.log(' bad ', e)
        })
    })
}