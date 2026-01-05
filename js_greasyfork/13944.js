// ==UserScript==
// @name         Easier Old Dominion Pickup Request (Autofill)
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.2.3
// @description  auto-fills some fields
// @match        http*://www.odfl.com/Pickup/pickup.faces
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13944/Easier%20Old%20Dominion%20Pickup%20Request%20%28Autofill%29.user.js
// @updateURL https://update.greasyfork.org/scripts/13944/Easier%20Old%20Dominion%20Pickup%20Request%20%28Autofill%29.meta.js
// ==/UserScript==

gei=function(x){return document.getElementById("pickupForm:"+x);};
gei("sname").value="Michael Cimino";
gei("shipperPhone").value="2017927000";
gei("shipperExt").value="278";
gei("scompany").value="Outerstuff c/o Statco Warehouse";
gei("saddress1").value="301 16th Street";

gei("saddress2").focus();
gei("saddress2").blur();

gei("dockCloseTime").value="4:00";
gei("shipperConfEmail1").value="outerstuff1@statcowhse.com";
//gei("shipperConfEmail2").value="larry@statcowhse.com"
gei("cdescription").value="Wearing Apparel";


gei("szip").value="07310";
gei("callCheck").checked=true;

gei("loadnum1type").children[4].selected=true;

gei("cspecialInstructions").value="First Come, First Serve. Closed for lunch 12PM-1PM.";