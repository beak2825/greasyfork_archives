// ==UserScript==
// @name         cianfull
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Выгружает предложение на кв без цены и с ценой до 200к в консоль
// @author       You
// @include      https://www.cian.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433248/cianfull.user.js
// @updateURL https://update.greasyfork.org/scripts/433248/cianfull.meta.js
// ==/UserScript==

//Условие: Москва, все районы в пределах МКАД, 10 мин до метро, без апартаментов
// https://www.cian.ru/cat.php?deal_type=sale&district%5B0%5D=1&district%5B1%5D=4&district%5B2%5D=5&district%5B3%5D=6&district%5B4%5D=7&district%5B5%5D=8&district%5B6%5D=9&district%5B7%5D=10&district%5B8%5D=11&engine_version=2&foot_min=10&offer_type=flat&only_flat=1&only_foot=2&room1=1

let Qdate = new Date
let day = Qdate.getDate()
let month = Qdate.getMonth()+1
let year = Qdate.getFullYear()
if (month.toLocaleString().length == 1) {
    month = '0'+month
}
let hour = Qdate.getHours()
let min = Qdate.getMinutes()

let fd = hour+':'+min+' '+day+'.'+month+'.'+year
console.log(Qdate)

let flat_studio_p
let flat_1k_p
let flat_2k_p
let flat_3k_p
let flat_studio200_p
let flat_1k200_p
let flat_2k200_p
let flat_3k200_p

var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="tm1_SearchBttn" type="button"> Скачать ЦИАН </button>';
zNode.setAttribute ('id', 'tm1_btnContainer');
zNode.style.cssText = `cursor: pointer; position: fixed; top: 120px; left: 0px; font-size: 12.8px; border: 1.5px outset black; opacity: 0.9; z-index: 1100; padding: 0px; display: grid; grid-template-columns: 1fr;`
document.body.appendChild (zNode);
let srchBtn = document.getElementById ("tm1_SearchBttn")
srchBtn.addEventListener ("click", flat_studio);


//flat_studio()
async function flat_studio() {
let a = await fetch("https://www.cian.ru/cian-api/site/v1/offers/search/meta/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
        },
  "referrer": "https://www.cian.ru/cat.php?deal_type=sale&district%5B0%5D=1&district%5B1%5D=4&district%5B2%5D=5&district%5B3%5D=6&district%5B4%5D=7&district%5B5%5D=8&district%5B6%5D=9&district%5B7%5D=10&district%5B8%5D=11&engine_version=2&foot_min=10&offer_type=flat&only_flat=1&only_foot=2&room1=1",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"region\":{\"type\":\"terms\",\"value\":[1]},\"_type\":\"flatsale\",\"engine_version\":{\"type\":\"term\",\"value\":2},\"room\":{\"type\":\"terms\",\"value\":[9]},\"geo\":{\"type\":\"geo\",\"value\":[{\"id\":1,\"type\":\"district\"},{\"id\":5,\"type\":\"district\"},{\"id\":6,\"type\":\"district\"},{\"id\":11,\"type\":\"district\"},{\"id\":4,\"type\":\"district\"},{\"id\":7,\"type\":\"district\"},{\"id\":10,\"type\":\"district\"},{\"id\":9,\"type\":\"district\"},{\"id\":8,\"type\":\"district\"}]},\"only_foot\":{\"type\":\"term\",\"value\":\"2\"},\"foot_min\":{\"type\":\"range\",\"value\":{\"lte\":10}},\"only_flat\":{\"type\":\"term\",\"value\":true}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
let b = await a.json()
let c = b.data.count
console.log('flat_studio() '+c)
    flat_studio_p = c
flat_1k()
}


async function flat_1k() {
let a = await fetch("https://www.cian.ru/cian-api/site/v1/offers/search/meta/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.cian.ru/cat.php?deal_type=sale&district%5B0%5D=1&district%5B1%5D=4&district%5B2%5D=5&district%5B3%5D=6&district%5B4%5D=7&district%5B5%5D=8&district%5B6%5D=9&district%5B7%5D=10&district%5B8%5D=11&engine_version=2&foot_min=10&offer_type=flat&only_flat=1&only_foot=2&room1=1",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"region\":{\"type\":\"terms\",\"value\":[1]},\"_type\":\"flatsale\",\"engine_version\":{\"type\":\"term\",\"value\":2},\"room\":{\"type\":\"terms\",\"value\":[1]},\"geo\":{\"type\":\"geo\",\"value\":[{\"id\":1,\"type\":\"district\"},{\"id\":5,\"type\":\"district\"},{\"id\":6,\"type\":\"district\"},{\"id\":11,\"type\":\"district\"},{\"id\":4,\"type\":\"district\"},{\"id\":7,\"type\":\"district\"},{\"id\":10,\"type\":\"district\"},{\"id\":9,\"type\":\"district\"},{\"id\":8,\"type\":\"district\"}]},\"only_foot\":{\"type\":\"term\",\"value\":\"2\"},\"foot_min\":{\"type\":\"range\",\"value\":{\"lte\":10}},\"only_flat\":{\"type\":\"term\",\"value\":true}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
let b = await a.json()
let c = b.data.count
console.log('flat_1k() '+c)
    flat_2k()
    flat_1k_p = c
}


async function flat_2k() {
let a = await fetch("https://www.cian.ru/cian-api/site/v1/offers/search/meta/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.cian.ru/cat.php?deal_type=sale&district%5B0%5D=1&district%5B1%5D=4&district%5B2%5D=5&district%5B3%5D=6&district%5B4%5D=7&district%5B5%5D=8&district%5B6%5D=9&district%5B7%5D=10&district%5B8%5D=11&engine_version=2&foot_min=10&offer_type=flat&only_flat=1&only_foot=2&room1=1",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"region\":{\"type\":\"terms\",\"value\":[1]},\"_type\":\"flatsale\",\"engine_version\":{\"type\":\"term\",\"value\":2},\"room\":{\"type\":\"terms\",\"value\":[2]},\"geo\":{\"type\":\"geo\",\"value\":[{\"id\":1,\"type\":\"district\"},{\"id\":5,\"type\":\"district\"},{\"id\":6,\"type\":\"district\"},{\"id\":11,\"type\":\"district\"},{\"id\":4,\"type\":\"district\"},{\"id\":7,\"type\":\"district\"},{\"id\":10,\"type\":\"district\"},{\"id\":9,\"type\":\"district\"},{\"id\":8,\"type\":\"district\"}]},\"only_foot\":{\"type\":\"term\",\"value\":\"2\"},\"foot_min\":{\"type\":\"range\",\"value\":{\"lte\":10}},\"only_flat\":{\"type\":\"term\",\"value\":true}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
let b = await a.json()
let c = b.data.count
console.log('flat_2k() '+c)
    flat_3k()
    flat_2k_p = c
}


async function flat_3k() {
let a = await fetch("https://www.cian.ru/cian-api/site/v1/offers/search/meta/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.cian.ru/cat.php?deal_type=sale&district%5B0%5D=1&district%5B1%5D=4&district%5B2%5D=5&district%5B3%5D=6&district%5B4%5D=7&district%5B5%5D=8&district%5B6%5D=9&district%5B7%5D=10&district%5B8%5D=11&engine_version=2&foot_min=10&offer_type=flat&only_flat=1&only_foot=2&room1=1",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"region\":{\"type\":\"terms\",\"value\":[1]},\"_type\":\"flatsale\",\"engine_version\":{\"type\":\"term\",\"value\":2},\"room\":{\"type\":\"terms\",\"value\":[3]},\"geo\":{\"type\":\"geo\",\"value\":[{\"id\":1,\"type\":\"district\"},{\"id\":5,\"type\":\"district\"},{\"id\":6,\"type\":\"district\"},{\"id\":11,\"type\":\"district\"},{\"id\":4,\"type\":\"district\"},{\"id\":7,\"type\":\"district\"},{\"id\":10,\"type\":\"district\"},{\"id\":9,\"type\":\"district\"},{\"id\":8,\"type\":\"district\"}]},\"only_foot\":{\"type\":\"term\",\"value\":\"2\"},\"foot_min\":{\"type\":\"range\",\"value\":{\"lte\":10}},\"only_flat\":{\"type\":\"term\",\"value\":true}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
let b = await a.json()
let c = b.data.count
console.log('flat_3k() '+c)
    flat_studio200()
    flat_3k_p = c
}

/////////////
///WITH PRICE 200.000///
/////////////




async function flat_studio200() {
let a = await fetch("https://www.cian.ru/cian-api/site/v1/offers/search/meta/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.cian.ru/cat.php?deal_type=sale&district%5B0%5D=1&district%5B1%5D=4&district%5B2%5D=5&district%5B3%5D=6&district%5B4%5D=7&district%5B5%5D=8&district%5B6%5D=9&district%5B7%5D=10&district%5B8%5D=11&engine_version=2&foot_min=10&offer_type=flat&only_flat=1&only_foot=2&room1=1",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"region\":{\"type\":\"terms\",\"value\":[1]},\"_type\":\"flatsale\",\"engine_version\":{\"type\":\"term\",\"value\":2},\"room\":{\"type\":\"terms\",\"value\":[9]},\"geo\":{\"type\":\"geo\",\"value\":[{\"id\":1,\"type\":\"district\"},{\"id\":5,\"type\":\"district\"},{\"id\":6,\"type\":\"district\"},{\"id\":11,\"type\":\"district\"},{\"id\":4,\"type\":\"district\"},{\"id\":7,\"type\":\"district\"},{\"id\":10,\"type\":\"district\"},{\"id\":9,\"type\":\"district\"},{\"id\":8,\"type\":\"district\"}]},\"only_foot\":{\"type\":\"term\",\"value\":\"2\"},\"foot_min\":{\"type\":\"range\",\"value\":{\"lte\":10}},\"only_flat\":{\"type\":\"term\",\"value\":true},\"price\":{\"type\":\"range\",\"value\":{\"lte\":200000}},\"price_sm\":{\"type\":\"term\",\"value\":true}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
let b = await a.json()
let c = b.data.count
console.log('flat_studio()200 '+c)
    flat_1k200()
    flat_studio200_p = c
}


async function flat_1k200() {
let a = await fetch("https://www.cian.ru/cian-api/site/v1/offers/search/meta/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.cian.ru/cat.php?deal_type=sale&district%5B0%5D=1&district%5B1%5D=4&district%5B2%5D=5&district%5B3%5D=6&district%5B4%5D=7&district%5B5%5D=8&district%5B6%5D=9&district%5B7%5D=10&district%5B8%5D=11&engine_version=2&foot_min=10&offer_type=flat&only_flat=1&only_foot=2&room1=1",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"region\":{\"type\":\"terms\",\"value\":[1]},\"_type\":\"flatsale\",\"engine_version\":{\"type\":\"term\",\"value\":2},\"room\":{\"type\":\"terms\",\"value\":[1]},\"geo\":{\"type\":\"geo\",\"value\":[{\"id\":1,\"type\":\"district\"},{\"id\":5,\"type\":\"district\"},{\"id\":6,\"type\":\"district\"},{\"id\":11,\"type\":\"district\"},{\"id\":4,\"type\":\"district\"},{\"id\":7,\"type\":\"district\"},{\"id\":10,\"type\":\"district\"},{\"id\":9,\"type\":\"district\"},{\"id\":8,\"type\":\"district\"}]},\"only_foot\":{\"type\":\"term\",\"value\":\"2\"},\"foot_min\":{\"type\":\"range\",\"value\":{\"lte\":10}},\"only_flat\":{\"type\":\"term\",\"value\":true},\"price\":{\"type\":\"range\",\"value\":{\"lte\":200000}},\"price_sm\":{\"type\":\"term\",\"value\":true}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
let b = await a.json()
let c = b.data.count
console.log('flat_1k()200 '+c)
    flat_2k200()
    flat_1k200_p = c
}


async function flat_2k200() {
let a = await fetch("https://www.cian.ru/cian-api/site/v1/offers/search/meta/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.cian.ru/cat.php?deal_type=sale&district%5B0%5D=1&district%5B1%5D=4&district%5B2%5D=5&district%5B3%5D=6&district%5B4%5D=7&district%5B5%5D=8&district%5B6%5D=9&district%5B7%5D=10&district%5B8%5D=11&engine_version=2&foot_min=10&offer_type=flat&only_flat=1&only_foot=2&room1=1",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"region\":{\"type\":\"terms\",\"value\":[1]},\"_type\":\"flatsale\",\"engine_version\":{\"type\":\"term\",\"value\":2},\"room\":{\"type\":\"terms\",\"value\":[2]},\"geo\":{\"type\":\"geo\",\"value\":[{\"id\":1,\"type\":\"district\"},{\"id\":5,\"type\":\"district\"},{\"id\":6,\"type\":\"district\"},{\"id\":11,\"type\":\"district\"},{\"id\":4,\"type\":\"district\"},{\"id\":7,\"type\":\"district\"},{\"id\":10,\"type\":\"district\"},{\"id\":9,\"type\":\"district\"},{\"id\":8,\"type\":\"district\"}]},\"only_foot\":{\"type\":\"term\",\"value\":\"2\"},\"foot_min\":{\"type\":\"range\",\"value\":{\"lte\":10}},\"only_flat\":{\"type\":\"term\",\"value\":true},\"price\":{\"type\":\"range\",\"value\":{\"lte\":200000}},\"price_sm\":{\"type\":\"term\",\"value\":true}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
let b = await a.json()
let c = b.data.count
console.log('flat_2k()200 '+c)
    flat_3k200()
    flat_2k200_p = c
}


async function flat_3k200() {
let a = await fetch("https://www.cian.ru/cian-api/site/v1/offers/search/meta/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.cian.ru/cat.php?deal_type=sale&district%5B0%5D=1&district%5B1%5D=4&district%5B2%5D=5&district%5B3%5D=6&district%5B4%5D=7&district%5B5%5D=8&district%5B6%5D=9&district%5B7%5D=10&district%5B8%5D=11&engine_version=2&foot_min=10&offer_type=flat&only_flat=1&only_foot=2&room1=1",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"region\":{\"type\":\"terms\",\"value\":[1]},\"_type\":\"flatsale\",\"engine_version\":{\"type\":\"term\",\"value\":2},\"room\":{\"type\":\"terms\",\"value\":[3]},\"geo\":{\"type\":\"geo\",\"value\":[{\"id\":1,\"type\":\"district\"},{\"id\":5,\"type\":\"district\"},{\"id\":6,\"type\":\"district\"},{\"id\":11,\"type\":\"district\"},{\"id\":4,\"type\":\"district\"},{\"id\":7,\"type\":\"district\"},{\"id\":10,\"type\":\"district\"},{\"id\":9,\"type\":\"district\"},{\"id\":8,\"type\":\"district\"}]},\"only_foot\":{\"type\":\"term\",\"value\":\"2\"},\"foot_min\":{\"type\":\"range\",\"value\":{\"lte\":10}},\"only_flat\":{\"type\":\"term\",\"value\":true},\"price\":{\"type\":\"range\",\"value\":{\"lte\":200000}},\"price_sm\":{\"type\":\"term\",\"value\":true}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
let b = await a.json()
let c = b.data.count
console.log('flat_3k200() '+c)
    flat_3k200_p = c
    setTimeout (conc, 1000)
}


function conc() {
    let all = '\nStudio '+flat_studio_p+' \nOne '+flat_1k_p+' \nTwo '+flat_2k_p+' \nThree '+flat_3k_p+' \nStudio200 '+flat_studio200_p+' \nOne200 '+flat_1k200_p+' \nTwo200 '+flat_2k200_p+' \nThree200 '+flat_3k200_p
    console.log('cian\n'+fd,' ',all)
//localStorage.setItem(`${fd}`, all)
}

/*
async function aw() {
let a = await fetch ("https://api.cian.ru/search-offers/v2/search-offers-desktop/", {
  "headers": {
    "accept": "",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "text/plain;charset=UTF-8",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://www.cian.ru/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"jsonQuery\":{\"region\":{\"type\":\"terms\",\"value\":[1]},\"_type\":\"flatsale\",\"engine_version\":{\"type\":\"term\",\"value\":2},\"room\":{\"type\":\"terms\",\"value\":[1]},\"geo\":{\"type\":\"geo\",\"value\":[{\"id\":1,\"type\":\"district\"},{\"id\":5,\"type\":\"district\"},{\"id\":6,\"type\":\"district\"},{\"id\":11,\"type\":\"district\"},{\"id\":4,\"type\":\"district\"},{\"id\":7,\"type\":\"district\"},{\"id\":10,\"type\":\"district\"},{\"id\":9,\"type\":\"district\"},{\"id\":8,\"type\":\"district\"}]},\"only_foot\":{\"type\":\"term\",\"value\":\"2\"},\"foot_min\":{\"type\":\"range\",\"value\":{\"lte\":10}},\"only_flat\":{\"type\":\"term\",\"value\":true}}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
let b = await a.json()
console.log(b.data.offerCount)
}
*/