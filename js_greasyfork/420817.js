// ==UserScript==
// @name         opt trans TP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://seller.tokopedia.com/myshop_order*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420817/opt%20trans%20TP.user.js
// @updateURL https://update.greasyfork.org/scripts/420817/opt%20trans%20TP.meta.js
// ==/UserScript==

(function() {
    'use strict';

var diva = document.createElement('div')
diva.style.position = 'absolute'
diva.style.left = '250px'
//diva.style.bottom = '800px'
diva.style.top = '100px'
//diva.style.top = '0px'
document.getElementsByTagName("BODY")[0].appendChild(diva)



var imput = document.createElement('input')
imput.style.borderColor = '#03AC0E'
imput.style.margin = '2px'

var imput1 = document.createElement('input')
imput.style.borderColor = '#03AC0E'
imput.style.margin = '2px'

var imput2 = document.createElement('input')
imput.style.borderColor = '#03AC0E'
imput.style.margin = '2px'



diva.appendChild(imput)
diva.appendChild(imput1)
diva.appendChild(imput2)




     imput.addEventListener ("keypress", function (e) {
             var key = e.which || e.keyCode;
             if (key === 13) { // 13 is enter

       window.location.href = 'https://seller.tokopedia.com/myshop_order?status=new_order&search='+imput.value
     }

   })
})();