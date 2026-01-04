// ==UserScript==
// @name         Torn: Poker Improvements
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make poker better & less ugly
// @author       Untouchable [1360035]
// @match        https://www.torn.com/loader.php?sid=holdemFull
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/413119/Torn%3A%20Poker%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/413119/Torn%3A%20Poker%20Improvements.meta.js
// ==/UserScript==

/*


*/

(function() {
    'use strict';

    let tableBB;

    setTimeout(() => {

        tableBB = getTableBB();
        newBackground();
        newTable();
        newCards();
        lighterFolded();
        //moneyAsBB(tableBB);

    },1000)



})();


// Change the poker background to custom image
function newBackground() {
    $('body').attr("style","background-image: url(https://expo.casino/wp-content/uploads/2013/04/Gray-Patterns.jpg) !important;");
    GM_addStyle ( `
        .wrapper___T1KuJ {
          background-image: none !important;
        }
    ` );
}

//////////////////////////////////////////////////////////////////////////////////////////

// Change the poker table to custom image
function newTable() {
    GM_addStyle ( `
        .table___2ep17 {
          background-image: url("https://www.pngjoy.com/pngl/189/3740312_poker-table-poker-table-online-transparent-png.png") !important;
        }
        .bg-decore___qeKOo {
          display:none !important;
        }
    ` );
}

//////////////////////////////////////////////////////////////////////////////////////////

// Change the poker table to custom image
function newCards() {

    let suits = ['spades-','clubs-','diamonds-','hearts-']
    let cards = ['2','3','4','5','6','7','8','9','10','A','K','Q','J']
    let cardCss = '';

    suits.forEach((suit) => {
        cards.forEach((card) => {
            cardCss = cardCss +
                `
                  div[class*="${suit}${card}"].cardSize___D7Mk5,  div[class*="${suit}${card}"].cardSize___1cMup  {
                    background: url("https://torn-poker-cards.s3.us-east-2.amazonaws.com/${suit}${card}.png") 100% no-repeat !important;
                  }
                  div[class*="${suit}${card}"].cardSize___21n2w {
                    background: url("https://torn-poker-cards.s3.us-east-2.amazonaws.com/small-${suit}${card}.png") 100% no-repeat !important;
                  }
                `
        });
    });

    GM_addStyle ( `

          .back___3vz4i, .back___3kpTw {
            background: url("https://torn-poker-cards.s3.us-east-2.amazonaws.com/back.png") 100% no-repeat !important;
          }
          .back___HrKps {
            background: url("https://torn-poker-cards.s3.us-east-2.amazonaws.com/small-back.png") 100% no-repeat !important;
          }

    ` + cardCss);
}


//////////////////////////////////////////////////////////////////////////////////////////

// Player who folded are greyed out more, come back on hover
function lighterFolded() {
    GM_addStyle ( `
        div[class*="folded"] {
           opacity: .2;
        }
        div[class*="folded"]:hover {
           opacity: 1;
        }
    ` );
}

//////////////////////////////////////////////////////////////////////////////////////////

function moneyAsBB(tableBB) {

    let found = false;
    waitForKeyElements('[class*="money_"]',() => {

        if(!found) {
            found = true;
            let moneys = $('[class*="money_"]');
            Object.values(moneys).forEach(x => {

                let val = x.innerText.replace(/,/g, '').replace('$','');
                val = parseInt(val);
                //console.log(val);
                x.innerText = (val / tableBB).toPrecision(5) + ' BB';

            })

            //
        }
        return;

    });


}

//////////////////////////////////////////////////////////////////////////////////////////

function getTableBB() {
    console.log('table',$('#table')[0].style.backgroundImage);
    if($('#table')[0].style.backgroundImage.includes('cats_chance')){
        return 2500000;
    }

}

//////////////////////////////////////////////////////////////////////////////////////////

function GM_addStyle (cssStr) {
    var D = document;
    var newNode = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}

//////////////////////////////////////////////////////////////////////////////////////////

    GM_addStyle ( `
        body, .back {
          color:white !important;
        }
    ` );

//////////////////////////////////////////////////////////////////////////////////////////
