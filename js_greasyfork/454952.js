// ==UserScript==
// @name         Grepo Market trade (beta)
// @namespace    Grepo trade (beta)
// @version      0.0.4
// @author       Doggerip
// @homepage
// @updateURL
// @downloadURL
// @description  description
// @match      http://*.grepolis.com/game/*
// @match      https://*.grepolis.com/game/*
// @match        https://fr114.grepolis.com/game/*
// @exclude
// @icon
// @copyright
// @grant        none
// @license     GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/454952/Grepo%20Market%20trade%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/454952/Grepo%20Market%20trade%20%28beta%29.meta.js
// ==/UserScript==
//>

//appel de la fonction
openmarket()

function openmarket() {
      // Create button
    const marketCreateoffert = document.querySelector('#devtools')

   const divnewbutton = document.createElement('div');
    marketCreateoffert.appendChild(divnewbutton);
    divnewbutton.classList.add('button_new', 'btn_submit_offer');
    divnewbutton.style.position ='absolute';
    divnewbutton.style.top ='6px';
    divnewbutton.style.right ='680px';
    divnewbutton.style.zIndex ='1001';

    const divnewbuttonleft = document.createElement('div');
    divnewbuttonleft.classList.add('left');

    divnewbutton.appendChild(divnewbuttonleft);

    const divnewbuttonright = document.createElement('div');
    divnewbuttonright.classList.add('right');
    divnewbutton.appendChild(divnewbuttonright);

    const divnewbuttoncaption = document.createElement('div');
    divnewbuttoncaption.classList.add('caption', 'js-caption');
    divnewbuttoncaption.innerText = 'Full ressources';
    divnewbutton.appendChild(divnewbuttoncaption);
    markeCreatebutton()
}

function markeCreatebutton() {
const buttonaddclick = document.querySelector('#devtools > .button_new.btn_submit_offer')

    /*********************************
    // Click function start
    *********************************/
    buttonaddclick.addEventListener('click', () => {
        // function open market Grepolis
        MarketWindowFactory.openWindow();
        document.querySelectorAll('.js-tabs_container.tabs_container > div')[0].click()
        fctaddclick()
        function fctaddclick() {
        if(document.querySelectorAll('#dd_res_offer > div').length != 1){
            setTimeout(()=> fctaddclick(), 500)
        }
            else
            {
        // New menu icon option
        const ressourcesoffer = document.querySelectorAll('#dd_res_offer > div')[0].classList;
        const ressourcesdemand = document.querySelectorAll('#dd_res_demand > div')[0].classList;

        //button arrow up ressources
        const buttontradingofferup = document.querySelector('.section.even.market_offer > div > .spinner.sp_trading_offer > .button_up');
        const buttontradingdemandup = document.querySelector('.section.even.market_offer > div > .spinner.sp_trading_demand > .button_up');

        //list selected  demands ressource icons
        const listdemandWood = document.querySelector('#dd_res_demand_list .item-list .option.wood');

        //list selected  offers ressource icons
        const listofferStone = document.querySelector('#dd_res_offer_list .item-list .option.stone');

         for (let i = 0; i < 20; i++) {
           if(document.querySelector('.spinner.sp_trading_offer .body > input').value != '10000'){
            buttontradingofferup.click();
           }
        }
         for (let i = 0; i < 20; i++) {
            if(document.querySelector('.spinner.sp_trading_demand .body > input').value != '10000'){
            buttontradingdemandup.click();
             }
         }

        listofferStone.click();
        listdemandWood.click();

      // Time for market trade
      for (let i = 0; i < 9; i++) {
      if(document.querySelectorAll('.spinner.sp_trading_lifetime > div input')[0].value != '05:00:00')
          {
           document.querySelector('.tbl_offer_settings .button_up').click()
          }
      }
        // select Tous sauf les ennemis
        document.querySelector('.section.even.market_offer > div > table > tbody > tr.row2 > td > div > div:nth-child(4) > div').click();
         const activatebutton = document.querySelectorAll('.section.odd.centered > div')[0].classList;

         // activate button submit offer
        if (activatebutton.contains('disabled')) {
            activatebutton.remove('disabled');
            activatebutton.remove('active');
        };
        }

        /*********************************
       // Click function end
       *********************************/
}
    } );


}




