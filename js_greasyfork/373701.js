// ==UserScript==
// @name         Scyzoryk_Clerk
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Tooltip dla Clerka OB
// @author       NOWARATN
// @match      *://*/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/373701/Scyzoryk_Clerk.user.js
// @updateURL https://update.greasyfork.org/scripts/373701/Scyzoryk_Clerk.meta.js
// ==/UserScript==

var $ = window.jQuery;

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = ".menu-btn2 {    display: block;    width: 50px;    height: 50px;    background-color: #fff;    border-radius: 50%;    position: relative; opacity: 0.3;  }  .menu-btn2 span,  .menu-btn2 span::before,  .menu-btn2 span::after {    position: absolute;    top: 50%; margin-top: -1px;    left: 50%; margin-left: -10px;    width: 20px;    height: 2px;    background-color: #222;  }  .menu-btn2 span::before,  .menu-btn2 span::after {    content: '';    display: block;    transition: 0.2s;  }  .menu-btn2 span::before {    transform: translateY(-5px);  }  .menu-btn2 span::after {    transform: translateY(5px);  }    .menu-btn2_active span:before {    transform: rotate(-35deg);    width: 10px;    transform-origin: left bottom;  }  .menu-btn2_active span:after {    transform: rotate(35deg);    width: 10px;    transform-origin: left top;  }  .menu-block {    position: fixed;    display: flex;    justify-content: center;    left: 50%;    top: 94%;   }  .menu-nav a {    text-decoration: none; font-size:14px;    color: #222;    text-transform: uppercase;    font-weight: 100;    display: inline-block;    margin-right: 5px; } .menu-nav a:link { color:0080ff; } .menu-nav a:visited { color: 0080ff; } .menu-nav a:hover { color: white; }  .menu-nav {    transition: 0.2s;    transform: scaleX(0) translateX(0%);    transform-origin: right center;    opacity: 1;    visibility: hidden;    height: 50px;    line-height: 50px;    background-color: #b3b3b3;     padding-right: 0px;    padding-left: 0px;    margin-right: 0px;    border-top-left-radius: 50px;    border-bottom-left-radius: 50px;  }  .menu-nav_active {    transform: scaleX(1) translateX(0%);    opacity: 1 !important;    visibility: visible;  }";
document.getElementsByTagName('head')[0].appendChild(style);

var zNode = document.createElement ('div');
zNode.innerHTML = '<div class="section">'+
    '<div class="menu-block">'+
    '<nav class="menu-nav">&nbsp;&nbsp;&nbsp;' +
    '<a href="https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob" target="_blank">  SSP</a> | ' +
    '<a href="https://trans-logistics-eu.amazon.com/fmc/execution/cvOI " target="_blank">FMC</a> | ' +
    '<a href="https://trans-logistics-eu.amazon.com/yms/shipclerk/#/preCheckIn" target="_blank">Pre Check</a> | ' +
    '<a href="https://trans-logistics-eu.amazon.com/yms/shipclerk/#/yard" target="_blank">Yard</a> | ' +
    '<a href="https://trans-logistics-eu.amazon.com/yms/shipclerk/#/eventReport?yard=KTW1&fromDate=1509750000000&toDate=159441839999" target="_blank">Event Rep.</a> | ' +
    '<a href="https://trans-logistics-eu.amazon.com/tcms/dashboard" target="_blank">CASE</a> | ' +
    '<a href="https://tiny.amazon.com/w4kscziy/rodeamazKTW1ExSD" target="_blank">RODEO</a> | ' +
    '<a href="https://tiny.amazon.com/oxehtkcc/AWSYP" target="_blank">AWS YP</a> | ' +
    '<a href="https://trans-logistics-eu.amazon.com/sortcenter/tt" target="_blank">Trouble Tool</a> | ' +
    '<a href="https://atrops-web-eu.amazon.com/schedules/skeds_fc_view?commit=submit&default=yes&utf8=%E2%9C%93&warehouse_id=KTW1#fc_schedules_calendar_view" target="_blank">ATROPS</a> | ' +
//    '<a href=" " target="_blank">OFT</a>' +
    '<a href="http://scadahv-ktw1-01.ktw1.amazon.com/bgfusion/" target="_blank">SCADA</a> | ' +
    '<a href="http://fcmenu-dub-regionalized.corp.amazon.com/KTW1/laborTrackingKiosk" target="_blank">SKANER</a>' +
    '</nav>' +
    '<a href="#" class="menu-btn2"><span></span></a></div></div>';

$(document).on('click', '.menu-btn2', function (e) {
        console.log("test");
  e.preventDefault();
  $(this).toggleClass('menu-btn2_active');
  $('.menu-nav').toggleClass('menu-nav_active');
});

document.body.appendChild(zNode);


