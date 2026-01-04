// ==UserScript==
// @name         CARIFY Sales Tool
// @namespace    https://faety.ch
// @version      0.2
// @description  Give tools to the Sales team at CARIFY
// @author       Claudio Souto
// @match        https://www.carify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=carify.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473131/CARIFY%20Sales%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/473131/CARIFY%20Sales%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const carId = document.querySelector('meta[data-n-head="ssr"][data-hid="product:retailer_item_id"][property="product:retailer_item_id"]').getAttribute('content');;

    let durationNumber;
    let kmNumber;

    const selectElements = document.querySelectorAll('select');
    const minDuration = selectElements[1];
    const kmPackage = selectElements[2];

    const updateDuration = () => {
        let duration = minDuration.options[minDuration.selectedIndex].innerText;
        durationNumber = duration.match(/\d+/)[0];
    };

    const updateKM = () => {
        let km = 1750;
        if(kmPackage.selectedIndex == -1){
            setTimeout(() => {
                km = kmPackage.options[kmPackage.selectedIndex].innerText;
                kmNumber = km.match(/\d+/)[0];
            }, 1000);
        }else {
            km = kmPackage.options[kmPackage.selectedIndex].innerText;
            kmNumber = km.match(/\d+/)[0];
        }
    }

    updateDuration();

    updateKM();

    minDuration.addEventListener('change', updateDuration);
    kmPackage.addEventListener('change', updateKM);


    const carIdBtn = document.createElement('button');
    carIdBtn.textContent = 'Get Car ID';
    carIdBtn.className = 'btn crf-button full btn-secondary';

    const discountBtn = document.createElement('button');
    discountBtn.textContent = 'Calculate Discount';
    discountBtn.className = 'btn crf-button full btn-secondary';

    let existingElement = document.querySelector('.request-offer');

    if (existingElement) {
        existingElement.parentElement.insertBefore(carIdBtn, existingElement.nextSibling);
        carIdBtn.after(discountBtn);
    }

    carIdBtn.addEventListener('click', function() {
        alert(carId);
    });

    discountBtn.addEventListener('click', function() {
        window.open(`https://redash.carify.com/dashboards/75--sales-demand-?p_w1081_km=0.9&p_w1082_km_package=${kmNumber}&p_w1082_min_duration=%5B%22${durationNumber}%22%5D&p_w1082_vehicle_id=${carId}`);
    });
})();