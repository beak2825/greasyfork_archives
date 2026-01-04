// ==UserScript==
// @name         buff_auto_pricing
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  s
// @author       You
// @match        *.buff.163.com/market/steam_inventory*
// @exclude
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/481911/buff_auto_pricing.user.js
// @updateURL https://update.greasyfork.org/scripts/481911/buff_auto_pricing.meta.js
// ==/UserScript==

function rdy(sel) {
    var tweetbox2 = document.querySelector(sel);
    if (tweetbox2) {
        var n = document.querySelector(sel)
        if (!(n?.classList?.contains('nice'))) {
            if (! tweetbox2.weHaveProcessed) {
                cont(sel)
                // xhr_req()
            }
        }
    }
}
function cont(sel) {
    Document.prototype.createElementFromString = function (str) {
        const element = new DOMParser().parseFromString(str, 'text/html');
        const child = element.documentElement.querySelector('body').firstChild;
        return child;
    };
    var container = document.querySelector(sel)
    container.className += ' nice'
    console.log(container)
    var el1 = document.createElement('button')
    el1.className = 'cny_rate'
    el1.textContent = 'Cny'
    el1.onclick = () => {
        var el = document.querySelector('.custom_input').value
        localStorage.setItem('cny', el)
    }
    el1.style = "margin-left: 10px;"
    var el2 = document.createElement('input')
    el2.className = 'custom_input'
    el2.style = "width: 32px; margin-left: 2px"
    container.appendChild(el2)
    container.appendChild(el1)
    var elems = document.querySelectorAll('.assets-item')
    for (let i of elems) {
        var holder = i.querySelector('td:nth-child(5) > div.price-set')
        var wrapper = document.createElement('div')
        wrapper.className = 'cnY_wrapper'
        var new_el_1 = document.createElement('a')
        var new_el_2 = document.createElement('a')
        var new_el_3 = document.createElement('a')
        var new_el_4 = document.createElement('a')
        new_el_1.className = 'cnY p10'
        new_el_2.className = 'cnY p15'
        new_el_3.className = 'cnY p20'
        new_el_4.className = 'cnY p45'
        new_el_1.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                let copyText = event.target.textContent;
                navigator.clipboard.writeText(copyText);
            }
        });
        new_el_2.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                let copyText = event.target.textContent;
                navigator.clipboard.writeText(copyText);
            }
        });
        new_el_3.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                let copyText = event.target.textContent;
                navigator.clipboard.writeText(copyText);
            }
        });
        new_el_4.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                let copyText = event.target.textContent;
                navigator.clipboard.writeText(copyText);
            }
        });
/*         new_el_1.textContent = '0'
        new_el_2.textContent = '0'
        new_el_3.textContent = '0'
        new_el_4.textContent = '0' */
        wrapper.appendChild(new_el_1)
        wrapper.appendChild(new_el_2)
        wrapper.appendChild(new_el_3)
        wrapper.appendChild(new_el_4)
        holder.before(wrapper)
    }
}

var sel = 'div.popup-header'
setInterval(function() { rdy(sel) }, 20);

function rdy2(sel) {
    var tweetbox2 = document.querySelector(sel);
    if (tweetbox2) {
        var n = document.querySelector(sel)
        if (!(n?.classList?.contains('nice'))) {
            if (! tweetbox2.weHaveProcessed) {
                tweetbox2.className += ' nice'
                cont2(sel)
                // xhr_req()
            }
        }
    }
}
function cont2(sel) {
    var cny_rate = parseFloat(localStorage.cny)
    var total = 0
    var items = document.querySelectorAll('.assets-item')
    var container = document.querySelector(sel),
        split = container.id.split('-'),
        asset_id = split[5],
        stickers = document.querySelectorAll('.sticker-wrapper')
    for (let i of stickers) {
        var st_price = i.querySelector('.sticker-name > div > div > span')
        if (!st_price) continue
        if (st_price.innerText.substr(0, 18) != 'Sticker wear: 100%') continue
        var st_price_usd = st_price.innerText.substr(22).replace(/[^\d.]/g,'')
        // console.log(st_price_usd, total)
        // console.log(typeof(parseFloat(st_price_usd)), typeof(total))
        total += +parseFloat(st_price_usd).toFixed(2)
    }
    var p_10 = (cny_rate * total)*0.1
    var p_15 = (cny_rate * total)*0.15
    var p_20 = (cny_rate * total)*0.20
    var p_45 = (cny_rate * total)*0.35
    // console.log(p_10, cny_rate, total)
    for (let ii of items) {
        var item_id = ii.id.split('_')[1]
        // console.log('4', item_id, asset_id)
        if (item_id == asset_id) {
            var item_price_big = ii.querySelector('td:nth-child(4) > strong.f_Strong')?.innerText.replace(/[^\d.]/g,'')
            // var item_price_small = ii.querySelector('td:nth-child(4) > strong.f_Strong > small')?.innerText.replace(/[^\d.]/g,'')
            var item_price = parseFloat(item_price_big)
            // console.log(item_price_big, item_price_small, ii)
            // if (item_price_small) {
            //     item_price = parseFloat(item_price_big + item_price_small)
            // } else {
            //     item_price = parseFloat(item_price_big)
            // }
            // function add(i, p, e, s) {
            //     var el = document.createElement('p')
            //     el.textContent = (p + e).toFixed(2).toString()
            //     i.querySelector(`.${s}`).appendChild(el)
            // }
            // console.log(ii.querySelector('.p10'), item_price, p_10)
            // add(ii, item_price, p_10, 'p10')
            // add(ii, item_price, p_15, 'p15')
            // add(ii, item_price, p_20, 'p20')
            // add(ii, item_price, p_45, 'p45')
            ii.querySelector('.p10').innerText = (item_price + p_10).toFixed(2).toString()
            ii.querySelector('.p15').innerText = (item_price + p_15).toFixed(2).toString()
            ii.querySelector('.p20').innerText = (item_price + p_20).toFixed(2).toString()
            ii.querySelector('.p45').innerText = (item_price + p_45).toFixed(2).toString()
            break
        }
    }
}

var sel2 = 'div.tooltip-hover'
setInterval(function() { rdy2(sel2) }, 20);