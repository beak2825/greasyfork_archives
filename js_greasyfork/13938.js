// ==UserScript==
// @name         Easier FedEx Freight Pickup Scheduler
// @namespace    https://greasyfork.org/users/4756
// @version      0.1
// @description  Auto-fills fields for FedEx Freight for Michael
// @author       saibotshamtul (Michael Cimino)
// @match        https://www.fedex.com/PickupApp/scheduleFreightPickup.do?method=doInit&locale=en_us
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13938/Easier%20FedEx%20Freight%20Pickup%20Scheduler.user.js
// @updateURL https://update.greasyfork.org/scripts/13938/Easier%20FedEx%20Freight%20Pickup%20Scheduler.meta.js
// ==/UserScript==

document.getElementById("address.alternate.company.ns").value="Outerstuff/Statco";
document.getElementById("address.alternate.contactName.ns").value="Michael Cimino";
document.getElementById("address.accountAddressOne.field1").value="301 16th Street";
document.getElementById("address.alternate.city1").value="Jersey City";
document.getElementById("address.accountStateProvince.field1").options[31].selected=true; //NJ
document.getElementById("address.alternate.zipPostal").value="07310-1024";
document.getElementById("address.alternate.phoneNumber").value="2017927000";
document.getElementById("address.alt.phoneExt").value="209";
document.getElementById("pickupInfo.specialServices.stack").checked=true; //do not stack
document.getElementById("freightPickupInfo.readyTime").value=1000;
document.getElementById("freightPickupInfo.closeTime").value=1600;