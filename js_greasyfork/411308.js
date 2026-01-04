// ==UserScript==
// @name         Captcha Load Login Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto Nagar Adda
// @author       You
// @match        https://onlinebooking.sand.telangana.gov.in/Masters/Home.aspx
// @match        https://onlinebooking.sand.telangana.gov.in/MASTERS/HOME.ASPX
// @match        https://onlinebooking.sand.telangana.gov.in/Masters/HOME.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411308/Captcha%20Load%20Login%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/411308/Captcha%20Load%20Login%20Page.meta.js
// ==/UserScript==
var cpl = document.evaluate('//BODY/FORM/TABLE/TBODY/TR[3]/TD/TABLE[2]/TBODY/TR/TD[1]/TABLE/TBODY/TR[1]/TD[2]/TABLE/TBODY/TR[4]/TD[2]/IMG',
document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,
null).singleNodeValue.id;
    var x = document.getElementById(cpl).src;
var autonagar = '<img src="' + x + '" alt="Auto Nagar Adda" style="padding:0.5rem; background:#0E082D; width:10.5rem; margin: 0rem 24rem; position: absolute;"/>';
            document.getElementById(cpl).innerHTML += autonagar;
            $("#tblLogIn").before(autonagar);
cpl.focus();