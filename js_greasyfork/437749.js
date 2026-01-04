// ==UserScript==
// @name         Edem launchpad bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Тут должно было быть описание
// @author       0xDeadOS
// @match        https://magiceden.io/launchpad
// @match        http://magiceden.io/launchpad
// @icon         https://www.google.com/s2/favicons?domain=magiceden.io
// @run-at       document-onload
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437749/Edem%20launchpad%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/437749/Edem%20launchpad%20bot.meta.js
// ==/UserScript==

(function() {

    var buttonBuyNFT = null;

    var StartBuy = function(){
        var ButtonBuy = document.getElementById("battonNFT");
        ButtonBuy.style.background = '#00CC00';
        ButtonBuy.innerText = 'Скрипт запущен';
        ButtonBuy.disabled = true;


        (function Buying(){

            if(buttonBuyNFT.disabled != true){

                buttonBuyNFT.click();
                ButtonBuy.style.background = '#006363';
                ButtonBuy.innerText = 'Скрипт завершен';
                console.log('BUY!!!!!!');
                return 0;
            }
            console.log("Buying")
            setTimeout(Buying,5)
        })();

    }

    var FindDisabledButtonBuy = function (){
        var elements = document.getElementsByTagName("button");
        for (let index = 0; index < elements.length; index++) {
            if(elements[index].disabled == true && elements[index].id != "battonNFT"){
                buttonBuyNFT = elements[index];
                return 0;
            }
            console.log(index + "Disabled");
        }
    }

    var CreateBut = function(){
        FindDisabledButtonBuy()
        var butB = document.createElement('button');
        butB.innerHTML = "Старт скрипта";
        butB.id = "battonNFT";
        butB.style.background = '#FFD700';
        buttonBuyNFT.insertAdjacentHTML('afterEnd', butB.outerHTML);
        document.getElementById('battonNFT').onclick = StartBuy;
        return;
    }
    setTimeout(CreateBut,5000)
})();