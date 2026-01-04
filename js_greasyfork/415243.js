// ==UserScript==
// @name         Pendoria: Market easyBuy
// @version      1.1.2
// @description  For example u buy rhodium: You want to spend 1t,
// @description  u typ in 1t, and u get the output on how many you can buy
// @author       Pinbo
// @match        https://pendoria.net/game
// @include      /^https?:\/\/(?:.+\.)?pendoria\.net\/?(?:.+)?$/

// @namespace https://xpuls3.github.io/
// @downloadURL https://update.greasyfork.org/scripts/415243/Pendoria%3A%20Market%20easyBuy.user.js
// @updateURL https://update.greasyfork.org/scripts/415243/Pendoria%3A%20Market%20easyBuy.meta.js
// ==/UserScript==
function getTabs(){
    let tabItems = $('div#market-div > ul > li > a');
        return tabItems;

}
function getCells(){
      var allCollumns = [];
       allCollumns = document.getElementsByTagName('td');

       for(var i = 0; i < allCollumns.length; i++){
              if( i % 4 == 0){

                  allCollumns[i+1].addEventListener('click', function(){
                      var priceClicked = this.innerText.split(',').join("");
                      var priceBillion = prompt("For how much do you want to buy? (100 = 100b)");
                      var totalPrice = priceBillion * 1000000000;

                      var buyable = Math.round(totalPrice / priceClicked);

                      alert(`Can be bought: ${buyable} at this price`);

                       });
              }
       }
}




function getDataFromMarketOnClick(){
    var promise = new Promise((resolve,reject) => {
       resolve(inputOutput());

 })

    }

async function inputOutput(){

    setTimeout(function(){
        getCells();
        var dataCells = getTabs();
        for(let i = 0; i< dataCells.length;i++){
            dataCells[i].addEventListener('click', function(){
                 setTimeout(function(){
                     getCells();
                 },1000)
            })
        }
    },1000);




}


function init(){
   $('#market-button').click(function(){
       getDataFromMarketOnClick();
   });




}


init();

   
  