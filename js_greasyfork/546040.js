// ==UserScript==
// @name         Convert Price to Bangladeshi Taka Words (Uppercase) – Fixed Load
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Works even if page elements load dynamically
// @author       You
// @match        https://salsabeelcars.site/index.php/sales_manager/car_view*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546040/Convert%20Price%20to%20Bangladeshi%20Taka%20Words%20%28Uppercase%29%20%E2%80%93%20Fixed%20Load.user.js
// @updateURL https://update.greasyfork.org/scripts/546040/Convert%20Price%20to%20Bangladeshi%20Taka%20Words%20%28Uppercase%29%20%E2%80%93%20Fixed%20Load.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertToWords(num) {
        const ones = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine'];
        const teens = ['Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
        const tens = ['Ten','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

        function convertChunk(n){
            if(n<10) return ones[n];
            else if(n<20) return n===10?'Ten':teens[n-11];
            else if(n<100) return tens[Math.floor(n/10)-1]+(n%10!==0?'-'+ones[n%10]:'');
            else if(n<1000){ let r=n%100; return ones[Math.floor(n/100)]+' Hundred'+(r!==0?' '+convertChunk(r):''); }
            return '';
        }

        function addUnit(word, unit){ return word?word+' '+unit:''; }

        let crore=Math.floor(num/10000000); num%=10000000;
        let lakh=Math.floor(num/100000); num%=100000;
        let thousand=Math.floor(num/1000); num%=1000;
        let hundred=Math.floor(num/100); num%=100;

        let chunks=[];
        if(crore) chunks.push(addUnit(convertChunk(crore),'Crore'));
        if(lakh) chunks.push(addUnit(convertChunk(lakh),'Lakh'));
        if(thousand) chunks.push(addUnit(convertChunk(thousand),'Thousand'));
        if(hundred) chunks.push(addUnit(convertChunk(hundred),'Hundred'));
        if(num) chunks.push(convertChunk(num));
        if(!chunks.length) chunks.push('Zero');

        return chunks.join(' ').trim()+' Only';
    }

    function updatePriceWords(autoInput=true){
        const sourceInput = document.querySelector('body > div.wrapper > div > section > div > form:nth-child(4) > div:nth-child(12) > div > input');
        const priceInput = document.evaluate('/html/body/div[1]/div/section/div/form[2]/div[5]/div/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const inWordInput = document.evaluate('/html/body/div[1]/div/section/div/form[2]/div[6]/div/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if(!priceInput||!inWordInput) return false; // Not ready yet

        if(autoInput && sourceInput) priceInput.value = sourceInput.value;

        const priceValue = parseInt(priceInput.value,10);
        inWordInput.value = !isNaN(priceValue)?convertToWords(priceValue).toUpperCase():'';
        return true;
    }

    // Wait for elements to exist
    const interval = setInterval(()=>{
        if(updatePriceWords(true)){
            // Add listeners once ready
            const sourceInput = document.querySelector('body > div.wrapper > div > section > div > form:nth-child(4) > div:nth-child(12) > div > input');
            const priceInput = document.evaluate('/html/body/div[1]/div/section/div/form[2]/div[5]/div/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if(sourceInput) sourceInput.addEventListener('input',()=>updatePriceWords(true));
            if(priceInput) priceInput.addEventListener('input',()=>updatePriceWords(false));

            clearInterval(interval); // Stop polling once ready
        }
    }, 300); // Check every 300ms
})();
