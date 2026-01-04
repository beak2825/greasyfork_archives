// ==UserScript==
// @name         Gemini Quick Buy
// @namespace    www.geministation.com
// @include      https://www.geministation.com/*/store.php*
// @version      3.0
// @description  Auto-fills the input fields on the buy and sell pages.
// @author       SkyeFlyer
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/396673/Gemini%20Quick%20Buy.user.js
// @updateURL https://update.greasyfork.org/scripts/396673/Gemini%20Quick%20Buy.meta.js
// ==/UserScript==

function toNum(num)
{
    return parseInt(num.replace("$", "").replace("Cargo:", "").replace(/,/g, ""));
}

var notch = $(".notch_container");
let cash = notch.find("span:contains($)")[0].innerHTML;
cash = toNum(cash);
let cargo = notch.find("span:contains(argo)")[0].innerHTML.split("/");
cargo = toNum(cargo[1]) - toNum(cargo[0]);

$("#myTabContent").children().each(function(tindex, child){
    child = $(child);
    if(child.find("table").length)
    {
        let table = $(child.find("tbody")[0]);
        console.log(table);
        console.log(tindex);
        table.children().each(function(index, tr){
            tr = $(tr);
            if(index>1)
            {
                if(tindex == 2) {
                    let stock = toNum(tr.children()[3].innerHTML);
                    tr.find("input").eq(0).val(stock);
                } else {
                    let price = Math.floor(cash/toNum(tr.find("td:contains($)")[0].innerHTML));
                    let stock = toNum(tr.children()[4].innerHTML);
                    let max = Math.min(price, stock, cargo);
                    if(!isNaN(max))
                        tr.find("input").eq(0).val(max);
                }
            }
        });
    }
});