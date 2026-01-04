// ==UserScript==
// @name         yandex eda cart copy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  copy cart data from yandex food delivery service if you need to share
// @author       coder42
// @match        https://eda.yandex.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412304/yandex%20eda%20cart%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/412304/yandex%20eda%20cart%20copy.meta.js
// ==/UserScript==

(function() {
    
    'use strict';

    function log (val, name, fn=null) {
        let prefix = (fn ? fn + ' : ' : '') + (name ? name + ' = ' : '');
        console.log(prefix + '%o [' + typeof val + ']', val);
    }

    const aurRoot = document.createElement('div');
    aurRoot.setAttribute('id', 'aur-root');
    aurRoot.className = 'aur-root';
    aurRoot.style = [
        'padding: 15px',
    ].join('; ');

    const msgBox = document.createElement('div');
    msgBox.setAttribute('id', 'aur-msg-box');
    msgBox.style = [
        'font-size: 11px',
        'margin-top: 5px',
    ].join('; ');

    const dataStoreTag = document.createElement('textarea');
    dataStoreTag.setAttribute('id', 'aur-data');
    dataStoreTag.setAttribute('style', [
        'width: 100%',
        'height: 150px',
        'font-size: 14px',
        'height: 1px',
        'width: 1px',
        'padding: 0',
        'border: none',
    ].join('; '));

    const copyCartBtn = document.createElement('button');
    copyCartBtn.className = [
        'aur-copy-cart-btn',
    ].join(' ');
    copyCartBtn.innerHTML = 'Скопировать';
    copyCartBtn.style = [
        'padding: 10px',
        'border: none',
        'border-radius: 4px',
        'background: rgb(252, 224, 0)',
    ].join('; ');
    copyCartBtn.addEventListener('click', event => {
        copyCart();
    });
    
    aurRoot.appendChild(copyCartBtn);
    aurRoot.appendChild(dataStoreTag);
    aurRoot.appendChild(msgBox);
    
    function init (timeout) {
        
        console.group('aur.copyCart.init');
        
        let cartRoot = document.querySelector('.AppCart_content');
        let aurRootFound = document.getElementById('aur-root');
        
        if (cartRoot && !aurRootFound) {
            cartRoot.appendChild(aurRoot);
        }
        
        console.groupEnd();
        
        if (timeout) {
            setTimeout(() => {
                init(timeout);
            }, timeout);
        }
    }
    
    function copyCart () {
        
        console.group('aur.copyCart');
        
        msgBox.innerHTML = '';

        let cartItems = document.querySelectorAll('.AppCart_item');
        //log(cartItems, 'cartItems');

        let out = [location.href, ''];
        let totalPrice = 0;
        let currency = '₽'
        let i = 1;

        cartItems.forEach(item => {

            let name = item.querySelector('.AppCartItem_name').innerHTML;
            let count = item.querySelector('.AppCartItem_quantity').innerHTML;
            
            let price = item.querySelector('.AppCartItem_price > span');
            price = price ? price.innerHTML : '';

            let priceNumber = price ? parseFloat(price.split(' ')[0]) : 0;

            if (priceNumber > 0) {
                
                let string = `${i}. ${name} x${count} // ${priceNumber} x ${count} = ${priceNumber * count} ${currency}`;
                out.push(string);

                totalPrice += priceNumber * count;
                
            }

            i++;

        });

        out.push('');
        out.push(`Итого: ${totalPrice} ${currency}`);

        //log(out, 'out');

        let dataStoreTag = document.querySelector('#aur-data');
        if (dataStoreTag) {
            dataStoreTag.innerHTML = out.join("\n");
            dataStoreTag.select();
            document.execCommand('copy');
        }
        
        msgBox.innerHTML = 'Скопировано!';
        
        setTimeout(() => {
            msgBox.innerHTML = '';
        }, 2500);

        console.groupEnd();
    }
        
    init(2500);
    
})();