// ==UserScript==
// @name         Epey.com Favorilerim
// @namespace    https://github.com/ilyasbilgihan
// @version      1.0
// @description  Epey.com daki favori ürünlerinizi kategorize eder.
// @author       @ilyasbilgihan
// @match        https://www.epey.com/uye/favorilerim/*
// @match        http://www.epey.com/uye/favorilerim/*
// @icon         https://www.google.com/s2/favicons?domain=epey.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/419442/Epeycom%20Favorilerim.user.js
// @updateURL https://update.greasyfork.org/scripts/419442/Epeycom%20Favorilerim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var counts = {};
    var indirimde = 0;
    var items = document.querySelectorAll('#favorilerim li');
    var fbaslik = document.querySelector('#fbaslik h1');

    items.forEach((item)=>{
        var category = item.querySelector('a').getAttribute('href').split('/')[3];
        var degisim = item.querySelector('.degisim');
        if(!degisim.classList.contains('dusus')){ // Bu kontrol yapılmazsa tüm favori ürünler kategorilere ayrılır.
            counts[category] = counts[category] || document.createElement('ul');
            counts[category].append(item);
        }else { indirimde++; }

    });

    fbaslik.innerHTML = `Fiyatı Düşenler | <span class="count">(${indirimde} ürün)</span>`
    var cerceve = document.querySelector('.cerceve.cerceve');
    var favs = document.querySelector('#favorilerim');

    for (const [key, value] of Object.entries(counts)) {
        var h2 = document.createElement('div');
        h2.classList.add('cat-name');
        h2.innerHTML = `<h2>${ key.split('-').join(' ') } | <span class="count">(${ value.childElementCount } ürün)</span></h2> <span data-target="${ key }" class="btn-open">Göster / Gizle</span>`;


        value.classList.add('cat');
        value.classList.add('closed');
        value.classList.add(key);


        favs.append(h2);
        favs.append(value);
        setTimeout(function(){
            value.style.maxHeight = value.scrollHeight + "px"
        }, 1000);
    }

    var buttons = document.querySelectorAll('.btn-open');
    buttons.forEach((button)=>{
        button.addEventListener('click', (e)=>{
            var target = e.target.getAttribute('data-target');
            var targetElement = document.querySelector('.cat.'+target);
            targetElement.classList.toggle('closed');

        });
    });

    GM_addStyle(`
        #fbaslik h1{font-size: 25px;}
        .cerceve.cerceve{ width: auto; }
        #fbaslik h1 span.count{font-size: 16px; color: #2f9a30;}
        .btn-open { position: absolute; top: 0; right: 20px; cursor: pointer; user-select: none; }
        #favorilerim { min-height: 0; }

        .cat-name {
            margin: 20px 0 20px 10px;
            text-transform: Capitalize;
            min-width: 100%;
            float: left;
            position: relative;
        }

        .cat-name h2 span.count { font-size: 14px; color: red; }
        .cat { transition: .4s all; opacity: 1; overflow: hidden; float: left; min-height: 0; }
        .cat.closed { max-height: 0px!important; opacity: 0; transition: .4s all; }
    `);



})();