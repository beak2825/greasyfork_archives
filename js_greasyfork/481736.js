// ==UserScript==
// @name         SM_v1
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  fuckskinsmonkey
// @author       You
// @match        https://skinsmonkey.com/*
// @exclude
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/481736/SM_v1.user.js
// @updateURL https://update.greasyfork.org/scripts/481736/SM_v1.meta.js
// ==/UserScript==


function rdy(sel0, sel1, sel, sel2) {
    let tweetbox1 = document.querySelector(sel);
    let tweetbox2 = document.querySelector(sel2);
    if (tweetbox1 && !tweetbox1?.classList?.contains('nice')) {
        let c = document.querySelector(sel0)
        if (!c) return
        if (!c?.querySelector(sel1)) return
        console.log(c.querySelector(sel1))
        cont(sel)
        clearInterval(interval)
        console.log('111')
    } else if (tweetbox2 && !tweetbox2?.classList?.contains('nice')) {
        if (!document.querySelector(sel1)) return
        cont(sel2, true)
        clearInterval(interval)
        console.log('222')
    }
}
// document.querySelector('div.trade.main > div > div:nth-child(3) > div.inventory-grid').querySelector('.inventory-grid-row > div > div.item-card__body')
var selector0 = 'div.trade.main > div > div:nth-child(3) > div.inventory-grid'
var selector1 = '.inventory-grid-row > div > div.item-card__body'
var selector = '[data-inventory="SITE"] > div.inventory-toolbar > div.search-input > div > div.form-input__body > input'
var selector2 = '.form-switcher.trade__inventory-switch > .form-switcher__container'
var interval = setInterval(function() { rdy(selector0, selector1, selector, selector2) }, 20);

function cont(sel, mobile=false) {
    if (document.querySelector('#fuck_skinsmonkey')) return
    let add_class = document.querySelector(sel)?.className
    add_class += ' nice'
    if (mobile == true) {
        let switcher_wrapper = document.querySelector('.form-switcher.trade__inventory-switch')
        switcher_wrapper.style.height = '76px'
        switcher_wrapper.style.padding = '0px'
        let switcher = document.querySelector('.form-switcher__container')
        switcher.style.height = '35px'
    }
    let inp_new = document.createElement('input')
    inp_new.style.width = '125px'
    inp_new.style.height = '35px'
    inp_new.id = 'fuck_skinsmonkey'
    let inp_btn = document.createElement('button')
    inp_btn.style.width = '50px'
    inp_btn.style.height = '35px'
    inp_btn.textContent = 'get'
    inp_btn.onclick = () => {
        let e = document.querySelector('#fuck_skinsmonkey')
        if (!e) return
        if (!e.value) return
        let regex = /^\d+$/;
        let asset_id = e.value?.trim()
        if (regex.test(asset_id) == false) {alert('ERROR: asset_id should be numeric');return}
        if (asset_id.length != 11) {alert('ERROR: asset_id is wrong, the length should be 11');return}
        post(asset_id)
    }
    if (mobile == false) {
        let inp_holder = document.querySelector(sel)
        inp_holder.className += ' nice'
        inp_holder.style.width = '245px'
        inp_holder.after(inp_btn)
        inp_holder.after(inp_new)
    } else {
        let inp_holder = document.querySelector(sel)
        
        inp_holder.after(inp_btn)
        inp_holder.after(inp_new)
    }
}

function post(i) {
    var identificator = i
    var body = {"user":[],"site":[{"appId":730,"assetId":identificator}],"referralCode":null};
    var final = JSON.stringify(body);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            let r = xhr.responseText
            var res
            console.log(r);
            try {
                res = JSON.parse(r)
            } catch (error) {
                alert('UNKNOWN ERROR')
                return
            }
            console.log(res)
            if (res?.error) {
                alert(`ERROR: ${res.error.message}`)
            } else if (res?.order) {
                alert(`SUCCESS: status is ${res.status}`)
            }
        }
    }
    xhr.open('POST', 'https://skinsmonkey.com/api/order', true);
    xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;
    xhr.send(final)
}