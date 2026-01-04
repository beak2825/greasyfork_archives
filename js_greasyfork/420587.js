// ==UserScript==
// @name         Sorteador Tamper
// @version      0.1
// @description  Modificador de resultado Sorteador.com
// @author       poyu1337
// @match        https://sorteador.com.br/sorteador/numeros
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/730611
// @downloadURL https://update.greasyfork.org/scripts/420587/Sorteador%20Tamper.user.js
// @updateURL https://update.greasyfork.org/scripts/420587/Sorteador%20Tamper.meta.js
// ==/UserScript==

(function() {
        setTimeout(function() {
        let my_div = document.getElementById("numero0");
        setTimeout(function(){
        let my_div2 = document.getElementById("numero1");

        my_div2.innerText = '30';


        }, 500)

        setTimeout(function(){
        let my_div3 = document.getElementById("numero2");


        my_div3.innerText = '30';


        }, 1000)






        setTimeout(function(){


        let my_div4 = document.getElementById("numero3");


        my_div4.innerText = '30';


        }, 1500)
        setTimeout(function(){


        let my_div5 = document.getElementById("numero4");


        my_div5.innerText = '30';


        }, 2000)
        setTimeout(function(){
        let my_div6 = document.getElementById("numero5");


        my_div6.innerText = '30';


        }, 2500)
        setTimeout(function(){


        let my_div7 = document.getElementById("numero6");


        my_div7.innerText = '30';


        }, 3000)


        my_div.innerText = '30';


        }, 500);
})();