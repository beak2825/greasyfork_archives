// ==UserScript==
// @name         aff
// @name: en         aff
// @namespace    aff.net
// @version      1.0
// @description  auto fill form!
// @author       vik
// @match        https://www.tampermonkey.net/scripts.php
// @license        https://www.tampermonkey.net/scripts.php
// @downloadURL https://update.greasyfork.org/scripts/526280/aff.user.js
// @updateURL https://update.greasyfork.org/scripts/526280/aff.meta.js
// ==/UserScript==

var vurl=window.location.href;
var d=new Date();
var dy=d.getFullYear();
var dm=d.getMonth()+1;
var dd=d.getDate();
var da=dy.toString()+dm.toString()+dd.toString();

var vnamef="John";
var vnamel="Davis";
var vfullname = "John Davis";
var vdateofbirth = "12/06/1995";
var vgender="Male";
var vtitle="Mr.";
var vposition="Manager";
var vdepartment="Sales";
var vcompany = "ANAX SPORTS";
var vwebsite="https://www.anaxsports.com";
var vindustry = "Sports";
var vmail = "lt@glmsu.com";
var vmobile = "2523251857";
var vphone = "2523251857";
var vfax = "2523251857";
var vwhatsapp = "2523251857";
var vaddress = "Green Town Moh";
var vcity="Sialkot";
var vstate="Sialkot";
var vzipcode="51310";
var vcountry = "Pakistan";
var vnationality = "Pakistan";
//var vsubject="Do you serve USA clients?";
var vsubject="Low cost and high quality Pakistan factory sports wear and fitness equipment available!";
//var vmessage = "Hi! Do you serve USA clients?";
var vmessage = "Hello! Do you want Pakistan factory low cost and high quality wear for fitness and casual, like Gym T-shirts, Polo T-shirts, hoodies; fitness and boxing gear like gloves, belts, guards, pads? We can supply. And we can print your logo on the products to grow your own brand. If you send me your demand product type, size, quantity and your zip code, we can quote you the best price. If you have any question, please feel free to reply me. Thanks!";

var vordernumber="1";
var vgradyear="2023";
var veventmdy="08/10/2023";
var veventmdy2="2023-08-10";
var vday="11";
var vmonth="12";
var vyear="2023";
var vyear0="1995";
var vbesttime="Morning";
var vtime="11:12";
var vsecond="12";
var vlanguage="English";
var vmail2 = "lt@glmsu.com";
var vconfirmmail="lt@glmsu.com";
var vphone0 = "(252) 325-1857";
var vphone0a = "252-325-1857";
var vphone01 = "+92";
var vphone1 = "252";
var vphone1a = "(252)";
var vphone2 = "325";
var vphone3 = "1857";
var vphone4 = "3251857";
var vphone5 = "325-1857";
var vstate2="Sialkot";
var vstate3="Sialkot";
var vcountry2 = "Pakistan";
var vemailtype = "Other";
var vhowfind="Internet Search";
var vhowfind2="Internet Search";
var vf_subject="6";
var vpreferredcontact="Email";

//if(da<20240126)
{

    { let b, c; b = vurl.indexOf("en.clitech.cn"); if (b != -1) { c = true; } if (c) { let a = document.querySelector('[class="form-control s_form-control s_input p_input"]'); if (a) { a.value = vmessage; } } }
    { let b, c; b = vurl.indexOf("en.clitech.cn"); if (b != -1) { c = true; } if (c) { let a = document.querySelector('[name="e_textarea-45"]'); if (a) { a.value = vmessage; } } }
    { let b, c; b = vurl.indexOf("en.clitech.cn"); if (b != -1) { c = true; } if (c) { let a = document.querySelector('[placeholder="Please enter message content"]'); if (a) { a.value = vmessage; } } }
    { let b, c; b = vurl.indexOf("en.clitech.cn"); if (b != -1) { c = true; } if (c) { let a = document.querySelector('[rows="3"]'); if (a) { a.value = vmessage; } } }
    { let b, c; b = vurl.indexOf("en.clitech.cn"); if (b != -1) { c = true; } if (c) { let a = document.querySelector('[type="text"]'); if (a) { a.value = vnamef; } } }
    { let b, c; b = vurl.indexOf("en.clitech.cn"); if (b != -1) { c = true; } if (c) { let a = document.querySelector('[name="name1710746914672"]'); if (a) { a.value = vnamef; } } }
    { let b, c; b = vurl.indexOf("en.clitech.cn"); if (b != -1) { c = true; } if (c) { let a = document.querySelector('[placeholder="Please enter your name"]'); if (a) { a.value = vnamef; } } }
    { let b, c; b = vurl.indexOf("en.clitech.cn"); if (b != -1) { c = true; } if (c) { let a = document.querySelector('[name="mobile1710746928200"]'); if (a) { a.value = vphone; } } }
    { let b, c; b = vurl.indexOf("en.clitech.cn"); if (b != -1) { c = true; } if (c) { let a = document.querySelector('[name="e_clueMobile-42"]'); if (a) { a.value = vphone; } } }
    { let b, c; b = vurl.indexOf("en.clitech.cn"); if (b != -1) { c = true; } if (c) { let a = document.querySelector('[placeholder="Please enter your phone number"]'); if (a) { a.value = vphone; } } }
    { let b, c; b = vurl.indexOf("en.clitech.cn"); if (b != -1) { c = true; } if (c) { let a = document.querySelector('[name="email1710746933313"]'); if (a) { a.value = vmail; } } }
    { let b, c; b = vurl.indexOf("en.clitech.cn"); if (b != -1) { c = true; } if (c) { let a = document.querySelector('[placeholder="Please enter your E-mail"]'); if (a) { a.value = vmail; } } }



}
