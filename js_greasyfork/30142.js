// ==UserScript==
// @name         Amazon Routing Helper
// @namespace    https://greasyfork.org/users/4756
// @version      0.1.1.8
// @description  try to take over the world!
// @author       saibotshamtul (Michael Cimino)
// @match        https://vendorcentral.amazon.com/st/vendor/members/shipment-mgr/labeloption
// @match        https://vendorcentral.amazon.com/st/vendor/members/shipment-mgr/lnl
// @match        https://vendorcentral.amazon.com/st/vendor/members/shipment-mgr/summary*
// @match        https://vendorcentral.amazon.com/st/vendor/members/shipment-mgr/excel
// @match        https://vendorcentral.amazon.com/st/vendor/members/shipment-mgr/poselect*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30142/Amazon%20Routing%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/30142/Amazon%20Routing%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('document.querySelector("#vss-application-messages").style.width = "500px"');

    // Your code here...
    if (window.location.href.match("shipment-mgr/poselect")){
        setTimeout(function(){
            //set focus to the PO search input field
            document.querySelector('.grid-search-phrase').focus();
        },1000);
    }
    //if (window.location.href=="https://vendorcentral.amazon.com/st/vendor/members/shipment-mgr/labeloption"){
    if (window.location.href.match("shipment-mgr/labeloption")){
        //vendorWarehouseId.children[4].selected=true;
        //vendorPrintLabel.checked=true;
        setTimeout(function(){
            vendorPrintLabel.checked=true;
            //vendorWarehouseId.children[4].selected=true;
            for (var b=0;b<vendorWarehouseId.children.length;b++){
                if (vendorWarehouseId.children[b].textContent.slice(0,6)=="301 16"){
                    vendorWarehouseId.children[b].selected=true;
                }
                if (vendorWarehouseId.children[b].textContent.slice(19,25)=="301 16"){
                    vendorWarehouseId.children[b].selected=true;
                }
            }
            cartonCount.focus();
        },1000);
    }
    //if (window.location.href=="https://vendorcentral.amazon.com/st/vendor/members/shipment-mgr/lnl"){
    if (window.location.href.match("shipment-mgr/lnl")){
        setTimeout(function(){
            //no stacked pallets
            stackedPalletCount.value=0;

            //set tomorrow's date
            var today = new Date(),  offset = 1;
            // set "tomorrow" to be Monday if today is a Friday
            if (today.getDay()==5){offset=3;}
            var tomorrow = (today.getMonth()+1).toString()+"/"+(today.getDate()+offset).toString()+"/"+(today.getYear()+1900).toString();
            //tomorrow = "4/30/2018";
            freightReadyDate.value = tomorrow;

            unstackedPalletCount.focus();

            //find the freight class that includes class 100
            for (var b in freightClass.children){
                //if(freightClass.children[b].innerText.slice(0,3) == "100")
                try {
                    var c = freightClass.children[b].innerText.split("-");
                    if ((c[0]<=100) & (c[1]>=100))
                        freightClass.children[b].selected = true;
                } catch(e){}
            }
        },1000);
    }
    if (window.location.href.match("shipment-mgr/excel")){
        setTimeout(function(){
            stackedPalletCount.value=0;
            //freightClass.children[2].selected=true;
            for (var b in freightClass.children){
                //if(freightClass.children[b].innerText.slice(0,3) == "100")
                var c = freightClass.children[b].innerText.split("-");
                if ((c[0]<=100) & (c[1]>=100))
                    freightClass.children[b].selected = true;
            }
        },1000);
    }
    //if (window.location.href.match("https://vendorcentral.amazon.com/st/vendor/members/shipment-mgr/summary.ln=")){
    if (window.location.href.match("shipment-mgr/summary.ln=")||window.location.href.match("shipment-mgr/summary.arn=")){
        setTimeout(function(){
            var a = displayTable.children[0].children[0].children[0].children[1].innerText;
            //displayTable.children[0].children[0].children[0].children[1].innerHTML = a + "&nbsp;&nbsp;<span style=\"font-family:'Free 3 of 9';font-size:40px\">*"+a+"*</span>";
            displayTable.children[0].children[0].children[0].children[1].innerHTML = "<span style=\"font-family:'Free 3 of 9';font-size:40px\">*"+a+"*</span><br/>"+a;
            //
            var g = "";
            var h = displayTable.children[0].children[0].children[10].children[1].children.length-1;
            for (var f=0;f<h;f++){
                var d = displayTable.children[0].children[0].children[10].children[1].children[f].innerHTML;
                //var e = displayTable.children[0].children[0].children[10].children[1].innerHTML;
                g += "<span style=\"font-family:'Free 3 of 9';font-size:40px\">*"+d+"*</span><br/>";
                f++;
            }
            //displayTable.children[0].children[0].children[10].children[1].innerHTML = e + "<span style=\"font-family:'Free 3 of 9';font-size:40px\">*"+d+"*</span>";
            displayTable.children[0].children[0].children[10].children[1].innerHTML += g;
        },1000);
    }
    if (window.location.href.match("shipment-mgr/summary.ln=")){
    }

})();