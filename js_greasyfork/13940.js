// ==UserScript==
// @name         Easier Forman Mills Routing
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.1.1.1
// @description  Function m clicks "more fields" 20 times;
//               used to set TotalUnitsShipped onfocus to auto-calculate
// @match        http://www.formanmills.com/form_new.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13940/Easier%20Forman%20Mills%20Routing.user.js
// @updateURL https://update.greasyfork.org/scripts/13940/Easier%20Forman%20Mills%20Routing.meta.js
// ==/UserScript==

//console.log('m = document.querySelector("#moreFields");for (i=0;i<20;i++){m.click()}');
function m(x){
    t = document.querySelector("#moreFields");
    for (i=0;i<x;i++){
        t.click();
    }
}
window.m = m;
console.log(m.toString());
//console.log("for (i=1;i<20;i++){TotalUnitsShipped[i].onfocus=eval('(function(){return function(){this.value=String(NumofCartons['+i+'].value*QntyPerCarton['+i+'].value);TotalUnitsOrdered['+i+'].value=TotalUnitsShipped['+i+'].value;}})()')}");

dq = function(x){return document.querySelector("[name="+x+"]");};
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
