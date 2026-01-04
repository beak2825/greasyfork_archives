// ==UserScript==
// @name         Superbuy Sale Info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  More info... for your saleling pleasure
// @author       You
// @match        https://www.superbuy.com/en/page/goodsdetail/?id=*nTag=enagt-subject-20915
// @icon         https://www.google.com/s2/favicons?sz=64&domain=superbuy.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453374/Superbuy%20Sale%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/453374/Superbuy%20Sale%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let re = /id=([0-9]{12})/;
    let matches = window.location.href.match(re);
    let productId = matches[1];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let productJson = JSON.parse(this.response);
            if(productJson.data.purchaseLink) {
                let itemLinkContainer = document.createElement('div');
                let itemLink = document.createElement('a');
                itemLink.setAttribute('href', productJson.data.purchaseLink);
                itemLink.setAttribute('target', '_blank');
                const t = document.createTextNode('Item link');
                itemLink.appendChild(t);
                itemLinkContainer.appendChild(itemLink);
                const heading = document.getElementsByClassName("goods-name")[0];
                heading.parentNode.insertBefore(itemLink, heading.nextSibling);
            }
        }
    };
    xhttp.open('GET', `https://front.superbuy.com/goods/detail/${productId}`, true);
    xhttp.send();
})();