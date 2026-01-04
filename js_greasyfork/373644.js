// ==UserScript==
// @name         Scyzoryk_Lead
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  Tooltip dla Leada OB
// @author       NOWARATN
// @match      *://*/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/373644/Scyzoryk_Lead.user.js
// @updateURL https://update.greasyfork.org/scripts/373644/Scyzoryk_Lead.meta.js
// ==/UserScript==

var $ = window.jQuery;

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = ".menu-btn2 {    display: block;    width: 50px;    height: 50px;    background-color: #fff;    border-radius: 50%;    position: relative; opacity: 0.3;  }  .menu-btn2 span,  .menu-btn2 span::before,  .menu-btn2 span::after {    position: absolute;    top: 50%; margin-top: -1px;    left: 50%; margin-left: -10px;    width: 20px;    height: 2px;    background-color: #222;  }  .menu-btn2 span::before,  .menu-btn2 span::after {    content: '';    display: block;    transition: 0.2s;  }  .menu-btn2 span::before {    transform: translateY(-5px);  }  .menu-btn2 span::after {    transform: translateY(5px);  }    .menu-btn2_active span:before {    transform: rotate(-35deg);    width: 10px;    transform-origin: left bottom;  }  .menu-btn2_active span:after {    transform: rotate(35deg);    width: 10px;    transform-origin: left top;  }  .menu-block {    position: fixed;    display: flex;    justify-content: center;    left: 76%;    top: 94%;   }  .menu-nav a {    text-decoration: none; font-size:14px;    color: black !important;    text-transform: uppercase;     display: inline-block;    margin-right: 5px; } .menu-nav a:link { color:0080ff; } .menu-nav a:visited { color: 0080ff; } .menu-nav a:hover { color: white !important; }  .menu-nav {    transition: 0.2s;    transform: scaleX(0) translateX(0%);    transform-origin: right center;    opacity: 1;    visibility: hidden;    height: 50px;    line-height: 50px;    background-color: #b3b3b3;  font-family: \"Amazon Ember\",Arial,sans-serif;     padding-right: 0px;    padding-left: 0px;    margin-right: 0px;    border-top-left-radius: 50px;    border-bottom-left-radius: 50px;  }  .menu-nav_active {    transform: scaleX(1) translateX(0%);    opacity: 1 !important;    visibility: visible;  }";
document.getElementsByTagName('head')[0].appendChild(style);

var zNode = document.createElement ('div');
zNode.innerHTML = '<div class="section">'+
    '<div class="menu-block">'+
    '<nav class="menu-nav">&nbsp;&nbsp;&nbsp;' +
    '<a href="https://outboundflow-dub.amazon.com/KTW1/planner" target="_blank">OFT</a> | ' +
    '<a href="https://fclm-portal.amazon.com/reports/processPathRollup?reportFormat=HTML&warehouseId=KTW1&maxIntradayDays=1&spanType=Intraday&startDateIntraday=2018%2F10%2F25&startHourIntraday=18&startMinuteIntraday=30&endDateIntraday=2018%2F10%2F26&endHourIntraday=5&endMinuteIntraday=0&_adjustPlanHours=on&_hideEmptyLineItems=on&employmentType=AllEmployees" target="_blank">Rate</a> | ' +
    '<a href="https://fclm-portal.amazon.com/reports/timeOnTask?reportFormat=HTML&warehouseId=KTW1&maxIntradayDays=30&spanType=Intraday&startDateIntraday=2018%2F10%2F25&startHourIntraday=18&startMinuteIntraday=30&endDateIntraday=2018%2F10%2F26&endHourIntraday=5&endMinuteIntraday=0" target="_blank">Task</a> | ' +
//    '<a href=" " target="_blank">OFT</a>' +
    '<a href="https://ktw1-portal.amazon.com/gp/picking/processpaths-new.html" target="_blank">Ścieżki</a> | ' +
    '<a href="https://fclm-portal.amazon.com/?warehouseId=KTW1" target="_blank">FCLM</a> | ' +
    '<a href="http://scadahv-ktw1-01.ktw1.amazon.com/bgfusion/" target="_blank">SCADA</a> | ' +
    '<a href="http://fcmenu-dub-regionalized.corp.amazon.com/KTW1/laborTrackingKiosk" target="_blank">SKANER</a>&nbsp;&nbsp;' +
    '</nav>' +
    '<a href="#" class="menu-btn2"><span></span></a></div></div>';

$(document).on('click', '.menu-btn2', function (e) {
        console.log("test");
  e.preventDefault();
  $(this).toggleClass('menu-btn2_active');
  $('.menu-nav').toggleClass('menu-nav_active');
});

document.body.appendChild(zNode);


