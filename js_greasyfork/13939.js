// ==UserScript==
// @name         Easier Footlocker New Routing
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.2
// @description  Creates shortcuts for faster DTS and DC routing; jumps back to the PO field when the enter button is clicked.
// @match        https://routing.footlocker.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13939/Easier%20Footlocker%20New%20Routing.user.js
// @updateURL https://update.greasyfork.org/scripts/13939/Easier%20Footlocker%20New%20Routing.meta.js
// ==/UserScript==

PickupHours.value='9-4'

// automatically go back to the PO field when enter is triggered
Enter.onclick=function(){PurchaseOrder.focus()}

// ==================================================
// create and add shortcut for DTS
// ==================================================
function ChooseDTS(){
    // choose Direct To Store
    Destination_listbox.children[3].click();
    // choose PaymentType Colledt
    PaymentType_listbox.children[1].click()
    // choose Direct To Store
    RoutingRequestType_listbox.children[1].click();
    // choose Ground
    ShipVia_listbox.children[1].click()
    PurchaseOrder.focus()
}
window.wrappedJSObject.ChooseDTS = ChooseDTS;
a = document.createElement('span')
a.innerHTML=' <a class="noprint" onclick="ChooseDTS()">(DTS)</a>';
// Request Information
rih = document.querySelector('#main > section > div.wrapper > div:nth-child(2) > div > h3')
rih.appendChild(a);

// ==================================================
// create and add shortcut for DC
// ==================================================
function ChooseDC(){
    // choose Direct To Store
    Destination_listbox.children[6].click();
    // choose PaymentType Colledt
    PaymentType_listbox.children[1].click()
    // choose Direct To Store
    RoutingRequestType_listbox.children[7].click();
    PurchaseOrder.focus()
}
window.wrappedJSObject.ChooseDC = ChooseDC;
a = document.createElement('span')
a.innerHTML=' <a class="noprint" onclick="ChooseDC()">(DC)</a>';
// Request Information
rih = document.querySelector('#main > section > div.wrapper > div:nth-child(2) > div > h3')
rih.appendChild(a);

// ==================================================
// create non-printing css
// ==================================================
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = "@media print {\
.noprint{display:none;}\
}";
//#header{visibility:hidden;height:0px;overflow:hidden;float:left;}\
//#Table1{visibility:hidden;height:0px;overflow:hidden;float:left;}\
//#stubborn{visibility:hidden;height:0px;overflow:hidden;float:left;}\
//#Table3{visibility:hidden;height:0px;overflow:hidden;float:left;}\
document.body.appendChild(css);
