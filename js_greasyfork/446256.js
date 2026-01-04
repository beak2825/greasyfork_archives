// ==UserScript==
// @name         SnappFood-Costs
// @namespace    https://github.com/sadaffathali
// @version      0.4
// @description  Calculate the cost of buying food from the SnappFood
// @author       Sadaf-Fathali
// @match        https://snappfood.ir/?login=1&referrer=/profile/orders
// @icon         https://snappfood.ir/static/images/favicon/favicon-96x96.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446256/SnappFood-Costs.user.js
// @updateURL https://update.greasyfork.org/scripts/446256/SnappFood-Costs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const toEnDigit=n=>n.replace(/[٠-٩۰-۹]/g,n=>15&n.charCodeAt(0));
    let btn = document.createElement("button");
    btn.innerHTML = "محاسبه هزینه کلی";
    btn.type = "button";
    btn.id = "Sadaf";
    btn.style.position = 'fixed';
    btn.style.top = '100px';
    btn.style.right = '20px';
    document.body.appendChild(btn);

    document.getElementById("Sadaf").addEventListener("click", totalCosts);

     function totalCosts() {
        let costs = document.querySelectorAll('.sc-cidCJl.iImUXB .iDOvlP > span');
        let total = 0;
        costs.forEach( (v)=>{
            total += parseFloat(((toEnDigit(v.innerText.split('تومان')[0]))).trim().replace(',', ''))
        })
        alert(`هزینه ی کل خریدهای شما از اسنپ فود ${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان بوده!`);
    }

    // Your code here...
})();