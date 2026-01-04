// ==UserScript==
// @name         AliExpress - Automatic Feedback
// @namespace    https://feedback.aliexpress.com/
// @version      1.3
// @description  prefill 5-star rating in aliexpress feedback and default message
// @author       Fernando Mendes Fonseca
// @match        https://feedback.aliexpress.com/management/leaveFeedback.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371394/AliExpress%20-%20Automatic%20Feedback.user.js
// @updateURL https://update.greasyfork.org/scripts/371394/AliExpress%20-%20Automatic%20Feedback.meta.js
// ==/UserScript==

/*
    Changelog:
    1.0.0 Created a default message
    1.2 Mensagem alterada para o número de dias aleatório
    1.2.1 Mensagem alterada para o número de dias aleatório (mínimo de 40 dias)
    1.3 Mensagem em todos os campos de descrição

Based on Aliexpress feedback from luckylooke (https://gist.github.com/luckylooke/e44bd8d44d51019d11c54c90cc94e09c)
    Changelog:
    2.0.0 'enter' feature from 1.1.o replaced by confirm popup
    1.1.0 Available to press 'enter' key for instant feedback submit
    1.0.0 Prefill all 5-star

*/
(function() {
    var defaultmesage = "Exactly as described. Great product, great seller!!\nDemorou "+ Math.floor(Math.random() * 90+40) +" dias para chegar ao Brasil." //&"\nTaxado em R$130 pela RFB + R$15 dos correios\nNão fui taxado."
    'use strict';

// setTimeout for page readiness
    setTimeout(function(){

// 5 estrelas em todos os itens
       var all = document.getElementsByClassName('star star-5');
       var l = all.length;

       for(var i=0; i<l; i++){
           all[i].click();
       };

// Descrição igual para todos os produtos
       all = document.getElementsByTagName("textarea");
       l = all.length;

       for(i=0; i<l; i++){
           all[i].value = defaultmesage;
       };
        //document.getElementsByTagName("textarea")[0].value = defaultmesage;

document.getElementById('j-anonymous-feedback').checked = true
/*
if (l > 0 && window.confirm("Do you want to submit 5-star feedback?")) {
document.getElementById('buyerLeavefb-submit-btn').click();
}
*/
    }, 300);
})();