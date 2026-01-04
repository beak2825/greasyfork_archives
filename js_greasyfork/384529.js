
// ==UserScript==
// @name         EveAppreisals Lexxprice
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prints the price lexx would pay
// @author       Lexx Akart
// @copyright    2019, Lexxes anfrbo@gmail.com
// @license      MIT
// @match        https://evepraisal.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384529/EveAppreisals%20Lexxprice.user.js
// @updateURL https://update.greasyfork.org/scripts/384529/EveAppreisals%20Lexxprice.meta.js
// ==/UserScript==

function formatMoney(n, c, d, t) {
    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d == undefined ? "." : d;
    t = t == undefined ? "," : t;
    var s = n < 0 ? "-" : "";
    var i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
    var j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};


var PlaceToAddValues = document.getElementsByClassName("col-lg-8")[0].getElementsByTagName("div")[3].getElementsByTagName("div")[0].getElementsByTagName("h5")[0];

var values = "";
var TotalOrders = 0
 var SuggestedValues;
if (document.getElementsByTagName("tfoot")[0].getElementsByTagName("a")[0]){
    TotalOrders = document.getElementsByTagName("tfoot")[0].getElementsByTagName("a")[0].getElementsByTagName("strong")[0].innerText;
    values = document.getElementsByTagName("tfoot")[0].getElementsByTagName("td")[3].innerHTML;
    values = values.replaceAll("<br>","|");
    values = values.replaceAll("\n","");
    values = values.replaceAll(" ","");
    values = values.replaceAll(",","");
    SuggestedValues= values.split("|");
}else{
    TotalOrders = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr").length;
    values = document.getElementsByTagName("tfoot")[0].getElementsByTagName("td")[2].innerHTML;
    values = values.replaceAll("<br>","|");
    values = values.replaceAll("\n","");
    values = values.replaceAll(" ","");
    values = values.replaceAll(",","");
    SuggestedValues = values.split("|");
}


var TotalMaxSellBeforeTax = Math.floor(SuggestedValues[1]);
var TotalBuyPrice = Math.abs(SuggestedValues[2]);
var Difference = TotalMaxSellBeforeTax - TotalBuyPrice
var LexxesTax = (TotalMaxSellBeforeTax * 0.05).toFixed(2);
var LexxesAdjustmentCost = TotalOrders * 10 * 100;

var LexxesMaxProfit = TotalMaxSellBeforeTax - TotalBuyPrice - LexxesTax - LexxesAdjustmentCost ;
var CostumerBonus = Math.abs(LexxesMaxProfit * 0.5);

var percentProfit = LexxesMaxProfit;
var LexxBuyPrice = TotalBuyPrice;
var LexxOffer = CostumerBonus + TotalBuyPrice;

var mLexxesTax = formatMoney(LexxesTax);
var mLexxesAdjustmentCost = formatMoney(LexxesAdjustmentCost);
var mLexxesMaxProfit = formatMoney(LexxesMaxProfit);
var mLexxOffer = formatMoney(LexxOffer);
var mLexxOfferProfit = formatMoney(CostumerBonus);

var scheiss = document.getElementsByClassName("col-lg-8")[0].getElementsByTagName("div")[3].getElementsByTagName("span")[1];
scheiss.innerHTML = scheiss.innerHTML + "<br><br>";

PlaceToAddValues.innerHTML = PlaceToAddValues.innerHTML + "<br><br>";

var Taxes = document.createElement("span");
Taxes.classList.add("nowrap");
Taxes.innerHTML = mLexxesTax + " isk <small> Station Taxes (5%)</small><br><br>";
PlaceToAddValues.appendChild(Taxes);

var Adjustmentcost = document.createElement("span");
Adjustmentcost.classList.add("nowrap");
Adjustmentcost.innerHTML = "" + TotalOrders + " x 10 = " +mLexxesAdjustmentCost + " isk <small>adjustment Cost est.</small><br><br>";
PlaceToAddValues.appendChild(Adjustmentcost);

if ( LexxesMaxProfit < 0 ) {
       var bullshit = document.createElement("span");
    bullshit.classList.add("nowrap");
    bullshit.innerHTML = "<small><u style='color:Red;'>Your get more if you sell directly to Jita</small><br><br>";
    PlaceToAddValues.appendChild(bullshit);

}else{
    var MaxPossible = document.createElement("span");
    MaxPossible.classList.add("nowrap");
    MaxPossible.innerHTML = mLexxesMaxProfit + " isk <small>Max. Possible Profit:</small><br><br>";
    PlaceToAddValues.appendChild(MaxPossible);

    var BuyPrice = document.createElement("span");
    BuyPrice.classList.add("nowrap");
    BuyPrice.innerHTML = "<u style='color:MediumSeaGreen;'>" + mLexxOffer + " isk</u><small> Offer by Lexx Akart</small><br><br>";
    PlaceToAddValues.appendChild(BuyPrice);

    var BuyPriceprofit = document.createElement("span");
    BuyPriceprofit.classList.add("nowrap");
    BuyPriceprofit.innerHTML = "<u style='color:MediumSeaGreen;'>" + mLexxOfferProfit + " isk</u><small> Profit compared to Jita Buy</small><br><br> ";
    PlaceToAddValues.appendChild(BuyPriceprofit);
}


var PlaceToAdd = document.getElementsByClassName("col-lg-8")[0].getElementsByTagName("div")[3];
var header2 = document.createElement("p");
header2.innerHTML = "Contract <b>Lexx Akart</b> if you wanna accept the offer";
PlaceToAdd.appendChild(header2);

