// ==UserScript==
// @name         Easier UPSF Pickup Request (Autofill)
// @namespace    https://greasyfork.org/users/4756
// @version      0.1.1.4
// @author       saibotshamtul (Michael Cimino)
// @description  auto-fills some fields
// @match        http://ltl.upsfreight.com/shipping/pickuprequest/pickup.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18395/Easier%20UPSF%20Pickup%20Request%20%28Autofill%29.user.js
// @updateURL https://update.greasyfork.org/scripts/18395/Easier%20UPSF%20Pickup%20Request%20%28Autofill%29.meta.js
// ==/UserScript==
/* jshint -W097 */
//'use strict';

// Your code here...

_Date = (new window.Date()).constructor;
function Date(){
    var now = new _Date();
    console.log('Actual now',now);
    now.setHours(now.getHours()-2);
    console.log('   New now',now);
	return now;
}
window.Date = Date;

/*
_CallServer = CallServer;
function CallServer(arg, context){
    console.log('CallServer',arg,context);
    _CallServer(arg, context);
}
window.CallServer = CallServer;
*/

function wrapper(func){
    console.log(func.name,func.arguments);
    return func(func.arguments);
}
window.checkPickupDate = function(){return wrapper(window.checkPickupDate);};

function outerstuffFillOutForm(){

    app_cpu_ReqContact.value = "Michael Cimino";
    app_cpu_ReqEmail.value = "outerstuff1@statcowhse.com";
    app_cpu_ReqCompanyName.value = "Outerstuff/Statco";
    app_cpu_ReqPNbr.value = "201-792-7000";
    app_cpu_txtReqExt.value = "209";
    if (app_cpu_ckThrdParty.checked === false){
        app_cpu_ckThrdParty.click();
    }

    app_cpu_PickStreet1.value = "301 16th Street";
    app_cpu_PickCity.value = "Jersey City";
    app_cpu_PickState.children[32].selected = true;
    app_cpu_PickPostalCode.value = "07310";
    app_cpu_POHour.value = "09"; app_cpu_PCHour.value="04";
    //app_cpu_Handling.value = "First come, first served. Closed for lunch 12:00 - 1:00.";
    app_cpu_Handling.value = "First come, first served. Closed for lunch 12-1. Close @ 4PM";
}

window.outerstuffFillOutForm = outerstuffFillOutForm;
outerstuffFillOutForm();