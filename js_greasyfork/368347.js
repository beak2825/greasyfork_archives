// ==UserScript==
// @name         Easier Forman Mills Routing 2018
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.2
// @description  Function m clicks "more fields" 20 times;
//               used to set TotalUnitsShipped onfocus to auto-calculate
// @match		 http://formanmills.com/asn-form/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368347/Easier%20Forman%20Mills%20Routing%202018.user.js
// @updateURL https://update.greasyfork.org/scripts/368347/Easier%20Forman%20Mills%20Routing%202018.meta.js
// ==/UserScript==

//console.log('m = document.querySelector("#moreFields");for (i=0;i<20;i++){m.click()}');
function m(x){
    //t = document.querySelector("#moreFields");
    var t = document.querySelector(".add_list_item");
    for (i=0;i<x;i++){
        t.click();
    }
}
window.m = m;
console.log(m.toString());
//console.log("for (i=1;i<20;i++){TotalUnitsShipped[i].onfocus=eval('(function(){return function(){this.value=String(NumofCartons['+i+'].value*QntyPerCarton['+i+'].value);TotalUnitsOrdered['+i+'].value=TotalUnitsShipped['+i+'].value;}})()')}");

dq = function(x){return document.querySelector("[name="+x+"]");};
dq("input_5").value = "Outerstuff/Statco";
dq("'input_8.1'").value= "301 16th Street";
dq("'input_8.3'").value = "Jersey City";
dq("'input_8.4'").children[31].selected=true;
dq("'input_8.5'").value = "07310";
dq("input_9").value = "Michael Cimino";
dq("input_11").value = "michaelc@statcowhse.com";
dq("input_11_2").value = "micahelc@statcowhse.com";
dq("input_12").value = "201-792-7023";
dq("input_13").value = "201-792-7000 x209";

//no buyer number
dq("input_15").children[38].selected=true;

/*
dq("VendorName").value = "Outerstuff/Statco";
dq("WarehouseAddress").value= "301 16th Street";
dq("City").value = "Jersey City";
dq("State").value = "NJ";
dq("Zip").value = "07310";
dq("ContactName").value = "Michael Cimino";
dq("EmailAddress").value = "outerstuff1@statcowhse.com";
dq("txtCEmailAddress").value = "outerstuff1@statcowhse.com";
dq("WarehouseFax").value = "201-792-7023";
dq("Phone").value = "201-792-7000 x209";
*/