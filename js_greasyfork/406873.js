// ==UserScript==
// @name         Скачать ЦБК
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Скачать договор ЦБК1
// @author       iku
// @include      https://platform.pay.travel/crm/paymentContract/partner/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406873/%D0%A1%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C%20%D0%A6%D0%91%D0%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/406873/%D0%A1%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C%20%D0%A6%D0%91%D0%9A.meta.js
// ==/UserScript==

// https://platform.pay.travel/partnerGroup/124615956/participants

//cursor: pointer; position: fixed; top: 0px; left: 0px; font-size: 12.8px; border: 1.5px outset black; opacity: 0.9; z-index: 1100; padding: 0px; display: grid; grid-template-columns: 1fr;
//прошлый стиль `top: 100%; cursor: pointer; position: fixed; top: 0; left: 0; font-size: 12.8px; border: 1.5px outset black; opacity: 0.9; z-index: 1100; padding: 0px 0px;`
var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="tm1_SearchBttn" type="button"> Скачать ЦБК </button>';
zNode.setAttribute ('id', 'tm1_btnContainer');
zNode.style.cssText = `cursor: pointer; position: fixed; top: 120px; left: 0px; font-size: 12.8px; border: 1.5px outset black; opacity: 0.9; z-index: 1100; padding: 0px; display: grid; grid-template-columns: 1fr;`
document.body.appendChild (zNode);
let srchBtn = document.getElementById ("tm1_SearchBttn")
srchBtn.addEventListener ("click", ButtonClickAction);
    let a = new Date
    let c = a.getMonth()+1
    let b = 11
    let d = c !== b

function ButtonClickAction (zEvent)
{
    //if (d) {console.log(); return}
    openframe()
    //document.querySelector('#partnerPaymentContracts > div:nth-child(3) > div > table > tbody') "div#partnerPaymentContracts tr:nth-child(1) > td:nth-child(1)"
    let a = document.querySelector("div#partnerPaymentContracts tbody").childElementCount
    let an = a
    for (;a<=an;a--) {
        let b = document.querySelector(`div#partnerPaymentContracts tbody > tr:nth-child(${a})`).textContent.includes('ООО «Центр бронирования на Кольской»')
        console.log(b)
        if (b) {
            let c = document.querySelector(`tr:nth-child(${a}) > td:nth-child(6) > ul`).childElementCount
            console.log(c)
            for (let i=0;i<=c;i++) {
                document.querySelector(`div#partnerPaymentContracts tr:nth-child(${a}) > td:nth-child(6) > ul`).children[i].children[0].click()
            }
        }
    }
}

let ab = zNode.insertAdjacentHTML('beforeend','<button id="wtm2_SearchBttn" type="button"> Скачать ПП </button>');
let w2 = document.getElementById ("wtm2_SearchBttn");
w2.addEventListener ("click", ButtonClickAction2);

function ButtonClickAction2 (zEvent)
{
    let a = document.querySelector("div#partnerPaymentContracts tbody").childElementCount //document.querySelector('#partnerPaymentContracts > div:nth-child(3) > div > table > tbody').childElementCount
    let an = a
    for (;a<=an;a--) {
        let b = document.querySelector(`div#partnerPaymentContracts tbody > tr:nth-child(${a})`).textContent.includes('ООО "ПремиумПлат"')
        console.log(b)
        if (b)
        {
            let c = document.querySelector(`tr:nth-child(${a}) > td:nth-child(6) > ul`).childElementCount
            console.log(c)
            for (let i=0;i<=c;i++)

            {
                document.querySelector(`div#partnerPaymentContracts tr:nth-child(${a}) > td:nth-child(6) > ul`).children[i].children[0].click()
            }
        }
    }
}


//let ab1 = zNode.insertAdjacentHTML('beforeend','<button id="wtm3_SearchBttn" type="button"> Добавить ТА в группу СБП </button>');
//let w21 = document.getElementById ("wtm3_SearchBttn");
//w21.addEventListener ("click", join);

async function join() {

    let href = location.href
    let partnercode = location.href.split("/").pop()

    await fetch("https://platform.pay.travel/api/partnerGroup/124615956/join", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": href, //https://platform.pay.travel/partnerGroup
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": `{\"partnerCode\":\"${partnercode}\"}`,
        "method": "PUT",
        "mode": "cors",
        "credentials": "include"
    });

    alert(partnercode+' ТА Добавлено в СБП')
}

//Добавить ТО в СБП

//let ab3 = zNode.insertAdjacentHTML('beforeend','<button id="wtm5_SearchBttn" type="button"> Добавить ТО в группу СБП </button>');
//let w23 = document.getElementById ("wtm5_SearchBttn");
//w23.addEventListener ("click", join_TO);

async function join_TO() {

    let href = location.href
    let partnercode = location.href.split("/").pop()

    await fetch("https://platform.pay.travel/api/partnerGroup/125293092/join", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": href, //https://platform.pay.travel/partnerGroup
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": `{\"partnerCode\":\"${partnercode}\"}`,
        "method": "PUT",
        "mode": "cors",
        "credentials": "include"
    });

    alert(partnercode+' ТО Добавлен в СБП')
}

let ab4 = zNode.insertAdjacentHTML('beforeend','<button id="wtm6_SearchBttn" type="button"> Добавить в СБП </button>');
let w24 = document.getElementById ("wtm6_SearchBttn");
w24.addEventListener ("click", knowTAorTO);

let typeTSP
async function knowTAorTO() {

    let href = location.href
    let partnercode = location.href.split("/").pop()

    let a = await fetch(`https://platform.pay.travel/api/partner/${partnercode}`, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": `https://platform.pay.travel/partner/${partnercode}`,
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    let b = await a.json()
    typeTSP = b.type
    console.log(typeTSP)

    if (typeTSP == 'operator') {
        join_TO()
        //openframe()
    }
    if (typeTSP == 'agency') {
        join()
        //openframe()}
    }}

let ab2 = zNode.insertAdjacentHTML('beforeend','<button id="wtm4_SearchBttn" type="button"> Создать текст письма </button>');
let w22 = document.getElementById ("wtm4_SearchBttn");
w22.addEventListener ("click", openframe);

//let c = document.querySelector("div#wrap h1")
//c.addEventListener('click', openframe)
function openframe() {
    console.log(typeTSP)

    let href = location.href
    let partnercode = location.href.split("/").pop()
    knowTAorTO()
    async function knowTAorTO() {

        //let href = location.href
        //let partnercode = location.href.split("/").pop()

        let a = await fetch(`https://platform.pay.travel/api/partner/${partnercode}`, {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json; charset=UTF-8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": `https://platform.pay.travel/partner/${partnercode}`,
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        let b = await a.json()
        let inn = b.essentials.inn
        let legalForm = b.essentials.legalForm
        if (legalForm == 'ltd') {legalForm = 'ООО'}
        if (legalForm == 'entrepreneur') {legalForm ='ИП'}
        let legalName = b.essentials.legalName
        let typeTSP = b.type
        let illt = 'ИНН: '+inn+'\n'+typeTSP+': '+legalForm+' '+legalName+'\nПодключен способ оплаты СБП.'

        let bik = b.accountEssentials[0].bik
        let bankName = b.accountEssentials[0].bankName
        let correspondingAccount = b.accountEssentials[0].correspondingAccount
        let currentAccount = b.accountEssentials[0].currentAccount
        let bbcc = '\nБИК: '+bik+'\nНазвание банка: '+bankName+'\nКорреспондентский счет: '+correspondingAccount+'\nРасчетный счет:'+currentAccount


    let a1 = document.querySelector("div#partnerPaymentContracts tbody").childElementCount //document.querySelector('#partnerPaymentContracts > div:nth-child(3) > div > table > tbody').childElementCount
    let an = a1
    for (;a1>0;a1--) {
        console.log(a1)
        let b1 = document.querySelector(`div#partnerPaymentContracts tbody > tr:nth-child(${a1})`).textContent.includes('ООО «Центр бронирования на Кольской»')
        if (b1) {
            let c = document.querySelector(`tr:nth-child(${a1}) > td:nth-child(6) > ul`).childElementCount
            console.log(c)
            let dognum = document.querySelector(`div#partnerPaymentContracts tr:nth-child(${a1}) > td:nth-child(2)`).outerText
            let dat = document.querySelector(`div#partnerPaymentContracts tr:nth-child(${a1}) > td:nth-child(3)`).outerText


            zNode.insertAdjacentHTML('beforeend',`<textarea id="textArea" style="margin: 0px; height: 100px; width: 257px; readonly">${illt+'\nДоговор № '+dognum+' от '+dat+'\n'+bbcc}</textarea>`);
            }
        }
        }
    }



/*
let ab1 = zNode.insertAdjacentHTML('beforeend','<button id="wtm3_SearchBttn" type="button"> search </button>');
let w21 = document.getElementById ("wtm3_SearchBttn");
w21.addEventListener ("click", bca_1);

function bca_1 (zEvent) {
    let a = document.querySelector('#content > div > div > div > table > tbody').childElementCount
    let an = a
    for (;a<=an;a--) {
        let b = document.querySelector(`#content > div > div > div > table > tbody > tr:nth-child(${a})`).insertAdjacentHTML('beforeend','<button id="wtm2_SearchBttn" type="button"> Открыть ПД ТСП </button>')
        if (b) {
        b.addEventListener ("click", bca__1);
        }
        let c = document.querySelector(`#content > div > div > div > table > tbody > tr:nth-child(${a}) > td:nth-child(1) > a`).outerText
        console.log(b)
    }

    function bca__1 (zEvent) {
        document.querySelector(`div#partnerPaymentContracts tr:nth-child(${a}) > td:nth-child(6) > ul`).click()
    }
}


*/

async function partnerData() {
    let a = await fetch(`https://platform.pay.travel/api/partner/anekstur2`, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://platform.pay.travel/partner/turisticheskoeagenstvogeografiya",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    let b = await a.json()
    console.log(b)

    let inn = b.essentials.inn
    let legalForm = b.essentials.legalForm
    let legalName = b.essentials.legalName
    let type = b.type
    let illt = 'ИНН: '+inn+'\n'+type+': '+legalForm+' '+legalName+'\nПодключен способ оплаты СБП.'+'\nДоговор № '+dognum+' от '+dat

    let bik = b.accountEssentials[0].bik
    let bankName = b.accountEssentials[0].bankName
    let correspondingAccount = b.accountEssentials[0].correspondingAccount
    let currentAccount = b.accountEssentials[0].currentAccount
    let bbcc = 'БИК: '+bik+'\n'+bankName+'\nКорреспондентский счет: '+correspondingAccount+'\nРасчетный счет:'+currentAccount
    }