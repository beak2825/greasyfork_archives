// ==UserScript==
// @name         Autofill b2c options
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Заполняет поля согласно п.2 инструкции: https://confluence.ticketplan.info/pages/viewpage.action?pageId=6979711#
// @author       iku
// @match        https://b2c.appex.ru/billing/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407442/Autofill%20b2c%20options.user.js
// @updateURL https://update.greasyfork.org/scripts/407442/Autofill%20b2c%20options.meta.js
// ==/UserScript==

var $ = window.jQuery;

var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="tm1_SearchBttn" type="button"> Настроить биллинг b2c </button>';
zNode.setAttribute ('id', 'tm1_btnContainer');
zNode.style.cssText=`top: 100%; cursor: pointer; position: fixed; top: 0; left: 0; font-size: 12.8px; border: 1.5px outset black; opacity: 0.9; z-index: 1100; padding: 0px 0px;`
document.body.appendChild (zNode);

zNode.addEventListener('click', Part_search)

function Part_search() {

    alert('Ссылка на инструкцию: https://confluence.ticketplan.info/pages/viewpage.action?pageId=6979711#')

    if (document.querySelector('#isActive').checked == false) {
        document.querySelector('#isActive').click()
        document.querySelector('#isActive').parentElement.style.cssText='background-color: yellow'
    }
    if (document.querySelector('input#sendRegistries').checked == false) {
        document.querySelector('input#sendRegistries').click()
        document.querySelector('input#sendRegistries').parentElement.style.cssText='background-color: yellow'
    }
    if (document.querySelector('input#autoOutPayment').checked == false) {
        document.querySelector('input#autoOutPayment').click()
        document.querySelector('input#autoOutPayment').parentElement.style.cssText='background-color: yellow'
    }
    $('#billing > div > div.col-md-12.form-horizontal > fieldset > div:nth-child(7) > div > select').val('value').change().css('background-color', 'yellow')
    $('#billing > div > div.col-md-12.form-horizontal > fieldset > div:nth-child(8) > div > select').val('hold').change().css('background-color', 'yellow')
    if (document.querySelector('div#billing div:nth-child(10) > div > input#surplusToOperator') == false) {
        document.querySelector('div#billing div:nth-child(10) > div > input#surplusToOperator').click()
        document.querySelector('div#billing div:nth-child(10) > div > input#surplusToOperator').parentElement.style.cssText='background-color: yellow'
    }
    $('input#maxPaymentPart').val('500000').change().css('background-color', 'yellow')
    $('input#minimumPartialPaymentPercent').val('1').change().css('background-color', 'yellow')
    $('#billing > div > div.col-md-12.form-horizontal > fieldset > div:nth-child(38) > div:nth-child(1) > div > select').val('virtualsafe').change().css('background-color', 'yellow')
    $('#billing > div > div.col-md-12.form-horizontal > fieldset > div:nth-child(38) > div:nth-child(2) > div > select').val('virtualsafe').change().css('background-color', 'yellow')
    if (document.querySelector('#npsProvider').value == "") {
        alert('Не указан номер НПС!')
    }
    else {
    document.querySelector('div#billing div.row > div > div:nth-child(1) > button').click()
    }
}