// ==UserScript==
// @name        TradeCheck2
// @namespace   TradeSpread2
// @include     https://politicsandwar.com/nation/dossier/
// @include     https://politicsandwar.com/world/radiation/
// @version     2.02
// @grant       none
// @description:en used to check trade prices for every click in PnW and will redirect to the correct page of the price error
// @description used to check trade prices for every click in PnW and will redirect to the correct page of the price error
// @downloadURL https://update.greasyfork.org/scripts/25893/TradeCheck2.user.js
// @updateURL https://update.greasyfork.org/scripts/25893/TradeCheck2.meta.js
// ==/UserScript==

  //NOTE THIS ONLY WORKS ON DOSSIER AND/OR RADIATION SCREENS TO PREVENT ENDLESS LOOPS WHEN MULTIPLE BAD OFFERS ARE PRESENTED.

  var Res1 = "food";
  var Res2 = "gasoline";
  var Res3 = "oil";
  var Res4 = "coal";
  var Res5 = "uranium";
  var Res6 = "steel";
  var Res7 = "iron";
  var Res8 = "munitions";
  var Res9 = "lead";
  var Res10 = "aluminum";
  var Res11 = "bauxite";
  var Res12 = "credits";

  //if anyone wants to change what trade screen views to load just edit the LinkEnd to suit your needs. LinkStart shouldnt ever need changed
  var LinkStart = "https://politicsandwar.com/index.php?id=90&display=world&resource1=";
  var LinkEnd = "&buysell=sell&ob=price&od=ASC&maximum=15&minimum=0&search=Go";

  //im going to keep separate entities for each resource as loops cause asynchronous misbehavior. only a minor inconvenience with bloated lines and slight variable changes

  $.getJSON( "https://politicsandwar.com/api/tradeprice/resource=" + Res1)
    .done(function(data) {
    Sell = data.lowestbuy.price;
    Buy = data.highestbuy.price;
    Spread = Sell - Buy;

    if (Spread < 0){      
        alert (Res1 + " MISTAKE!!!\n" + "Selling for " + Sell + " and Buying for " + Buy);
        
        if (Buy > 500){
            w = window.open("https://politicsandwar.com/index.php?id=90&display=world&resource1=food&buysell=buy&ob=price&od=DESC&maximum=15&minimum=0");
        }
        
        if (Buy < 500){
            w = window.open(LinkStart + Res1 + LinkEnd);  
        }
        
        w.focus();
    }
  });


   $.getJSON( "https://politicsandwar.com/api/tradeprice/resource=" + Res2)
    .done(function(data) {
    Sell = data.lowestbuy.price;
    Buy = data.highestbuy.price;
    Spread = Sell - Buy;

    if (Spread < 0){      
        alert (Res2 + " MISTAKE!!!\n" + "Selling for " + Sell + " and Buying for " + Buy);
        w = window.open(LinkStart + Res2 + LinkEnd);      
        w.focus();
    }
  });

  $.getJSON( "https://politicsandwar.com/api/tradeprice/resource=" + Res3)
    .done(function(data) {
    Sell = data.lowestbuy.price;
    Buy = data.highestbuy.price;
    Spread = Sell - Buy;

    if (Spread < 0){      
        alert (Res3 + " MISTAKE!!!\n" + "Selling for " + Sell + " and Buying for " + Buy);
        w = window.open(LinkStart + Res3 + LinkEnd);      
        w.focus();
    }
  });

  $.getJSON( "https://politicsandwar.com/api/tradeprice/resource=" + Res4)
    .done(function(data) {
    Sell = data.lowestbuy.price;
    Buy = data.highestbuy.price;
    Spread = Sell - Buy;

    if (Spread < 0){      
        alert (Res4 + " MISTAKE!!!\n" + "Selling for " + Sell + " and Buying for " + Buy);
        w = window.open(LinkStart + Res4 + LinkEnd);      
        w.focus();
    }
  });

  $.getJSON( "https://politicsandwar.com/api/tradeprice/resource=" + Res5)
    .done(function(data) {
    Sell = data.lowestbuy.price;
    Buy = data.highestbuy.price;
    Spread = Sell - Buy;

    if (Spread < 0){      
        alert (Res5 + " MISTAKE!!!\n" + "Selling for " + Sell + " and Buying for " + Buy);
        w = window.open(LinkStart + Res5 + LinkEnd);      
        w.focus();
    }
  });

  $.getJSON( "https://politicsandwar.com/api/tradeprice/resource=" + Res6)
    .done(function(data) {
    Sell = data.lowestbuy.price;
    Buy = data.highestbuy.price;
    Spread = Sell - Buy;

    if (Spread < 0){      
        alert (Res6 + " MISTAKE!!!\n" + "Selling for " + Sell + " and Buying for " + Buy);
        w = window.open(LinkStart + Res6 + LinkEnd);      
        w.focus();
    }
  });

  $.getJSON( "https://politicsandwar.com/api/tradeprice/resource=" + Res7)
    .done(function(data) {
    Sell = data.lowestbuy.price;
    Buy = data.highestbuy.price;
    Spread = Sell - Buy;

    if (Spread < 0){      
        alert (Res7 + " MISTAKE!!!\n" + "Selling for " + Sell + " and Buying for " + Buy);
        w = window.open(LinkStart + Res7 + LinkEnd);      
        w.focus();
    }
  });

  $.getJSON( "https://politicsandwar.com/api/tradeprice/resource=" + Res8)
    .done(function(data) {
    Sell = data.lowestbuy.price;
    Buy = data.highestbuy.price;
    Spread = Sell - Buy;

    if (Spread < 0){      
        alert (Res8 + " MISTAKE!!!\n" + "Selling for " + Sell + " and Buying for " + Buy);
        w = window.open(LinkStart + Res8 + LinkEnd);      
        w.focus();
    }
  });

  $.getJSON( "https://politicsandwar.com/api/tradeprice/resource=" + Res9)
    .done(function(data) {
    Sell = data.lowestbuy.price;
    Buy = data.highestbuy.price;
    Spread = Sell - Buy;

    if (Spread < 0){      
        alert (Res9 + " MISTAKE!!!\n" + "Selling for " + Sell + " and Buying for " + Buy);
        w = window.open(LinkStart + Res9 + LinkEnd);      
        w.focus();
    }
  });

  $.getJSON( "https://politicsandwar.com/api/tradeprice/resource=" + Res10)
    .done(function(data) {
    Sell = data.lowestbuy.price;
    Buy = data.highestbuy.price;
    Spread = Sell - Buy;

    if (Spread < 0){      
        alert (Res10 + " MISTAKE!!!\n" + "Selling for " + Sell + " and Buying for " + Buy);
        w = window.open(LinkStart + Res10 + LinkEnd);      
        w.focus();
    }
  });

  $.getJSON( "https://politicsandwar.com/api/tradeprice/resource=" + Res11)
    .done(function(data) {
    Sell = data.lowestbuy.price;
    Buy = data.highestbuy.price;
    Spread = Sell - Buy;

    if (Spread < 0){      
        alert (Res11 + " MISTAKE!!!\n" + "Selling for " + Sell + " and Buying for " + Buy);
        w = window.open(LinkStart + Res11 + LinkEnd);      
        w.focus();
    }
  });

  $.getJSON( "https://politicsandwar.com/api/tradeprice/resource=" + Res12)
    .done(function(data) {
    Sell = data.lowestbuy.price;
    Buy = data.highestbuy.price;
    Spread = Sell - Buy;

    if (Spread < 0){      
        alert (Res12 + " MISTAKE!!!\n" + "Selling for " + Sell + " and Buying for " + Buy);
        w = window.open(LinkStart + Res12 + LinkEnd);      
        w.focus();
    }
  });