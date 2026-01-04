// ==UserScript==
// @name          CSS: meteoblue.com
// @description   Corrections to UI of meteoblue.com
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://www.meteoblue.com/*
// @icon          https://www.meteoblue.com/favicon.ico
// @version       1.5.7
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/419280/CSS%3A%20meteobluecom.user.js
// @updateURL https://update.greasyfork.org/scripts/419280/CSS%3A%20meteobluecom.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //Workaround: This document requires 'TrustedHTML' assignment
  if (window.trustedTypes && trustedTypes.createPolicy) {
    if (!trustedTypes.defaultPolicy) {
      const passThroughFn = (x) => x;
      trustedTypes.createPolicy('default', {
        createHTML: passThroughFn,
        createScriptURL: passThroughFn,
        createScript: passThroughFn,
      });
    }
  }

  //CSS for any mode
  var cssUniversal = `
  /*Menu*/
  .nav a {
    padding-top: 7px !important;
    padding-bottom: 7px !important;
  }
  not(.menu-mobile) .nav .section-end::after {
    margin-top: 15px !important;
    margin-bottom: 15px !important;
  }
  .menu-mobile-container .menu-mobile .nav > li > a {
    min-height: 30px !important;
  }
  .menu-mobile-container .menu-mobile .nav > li.section-end + li {
    margin-top: -10px !important;
  }
  .menu-mobile-container .menu-mobile .nav > li {
    height: unset !important;
  }

  /*Position of cloud icons*/
  .picto .weekday.alt {
    line-height: unset !important;
  }

  /*Font size of temperature*/
  .tab-content .tab-temp-max, .tab-content .tab-temp-min {
    line-height: 24.5px !important;
    font-size: 17.5px !important;
  }

  /*Position of time headers*/
  .picto .time time {
    left: 0% !important;
  }
  /*Position and background of meteo condition icons in hourly forecast table*/
  .hourly-forecast .hourlywind .pictoicon {
    top: 0px !important;
    position: relative !important;
    width: unset !important;
  }
  tr.pictos-1h .picon {
    border-radius: 0px !important;
  }
  tr.pictos-1h > td > div > img[src$='_day.svg'] {
    background-color: #88b7df !important;
  }
  tr.pictos-1h > td > div > img[src$='_night.svg'] {
    background-color: #193f57 !important;
  }
  /*tr.pictos-1h > td {
    background-color: #88b7df !important;
  }*/

  /*Position of precipitation data in hourly forecast table*/
  .hourly-forecast .hourlywind .precip td span {
    position: unset !important;
  }
  .glyph.rain1h {
    margin-top: -49px !important;
  }
  .hourly-forecast .hourlywind .precip th span:not(.glyph.rain1h)/*:not([style^='margin-top'])*/ {
    position: unset !important;
  }
  /*No precipitation expected*/
  tr.precip > td[colspan="24"] {
    border-top: 1px solid #000 !important;
    border-bottom: 1px solid #000 !important;
    border-right: 1px solid #000 !important;
  }
  tr.precip > td[colspan="24"] > p {
    margin: 10px !important;
    line-height: 0.1em !important;
  }

  /*Dividers between cloud icons on 3 hours table*/
  .hourly-forecast .hourlywind tr.pictos_3h td {
    padding: 0 !important;
    border-right-color: gray !important;
    border-right-style: solid !important;
    border-right-width: thin !important;
  }

  /*Headers*/
  h2, h3 {
    font-size: 150% !important;
  }

  /*Font family and size of 14-days weather table*/
  .forecast-table td {
    font-family: Calibri, Roboto, Arial, sans-serif !important;
    font-size: 120% !important;
    padding-left: 3px !important;
    padding-right: 3px !important;
  }
  .forecast-table > tbody > tr:nth-child(2) > td { /*date*/
    font-size: 90% !important;
  }
  .forecast-table > tbody > tr:nth-child(8) > td, /*predictability*/
  .forecast-table > tbody > tr:nth-child(14) > td { /*precipitation probability*/
    font-size: 105% !important;
  }
  .forecast-table {
    padding-bottom: 5px !important;
  }
  .bloo table a {
    padding-left: unset !important;
    padding-right: unset !important;
  }

  /*Predictability bar height*/
  .fdw-svg {
    stroke: #D0D0D0 !important;
    stroke-width: 15 !important;
  }
  line[class^="predictability"] {
    stroke-width: 15 !important;
  }

  /*Color of precipitation probability*/
  .precipitation-1 {
    color:#6FBBDF !important;
  }
  .precipitation-2 {
    color:#518CCE !important;
  }
  .precipitation-3 {
    color:#3472B9 !important;
  }

  /*Adblock warning*/
  /*div[filter] {
    filter: none !important;
  }*/
  .page-header, .wrapper-main, .wrapper-sda, .navigation-scroll-container, .footer, .footer-quick {
    filter: none !important;
  }
  .unblock-div {
    display: none !important;
  }
  body.unblock {
    overflow: visible !important;
    margin-right: 0px !important;
  }

  /*Ad*/
  div.ad1-box, div.ad2, div#fixity, div#display_mobile_ad_in_header {
    display: none !important;
  }
  `;

  //CSS for light mode only
  var cssLight = `
  /*Active tab colour*/
  .tab.active:not(.foo) {
    background: #fffeefff !important;
    /*background: #ffffff !important;*/
  }
  /*Tab colour*/
  .tab {
    background: #e7ecf0 !important;
    /*background: #eaeaea !important;*/
  }
  /*Predictability meter background*/
  .tab_content .tab_predictability .meter_outer {
    background-color: hsl(0, 0%, 96.9%) !important;
  }

  /*Font color of precipitation probability in hourly forecast table*/
  tr.precip-prop > td > span {
    color: rgb(0, 64, 128) !important;
  }
  /*Font color of precipitation data in hourly forecast table*/
  .hourly-forecast .hourlywind .precip td span {
    color: rgb(0, 64, 128) !important;
  }
  `;

  const bodyMode = document.querySelector("body.dark");
  var css;
  if (bodyMode != null) {
    css = cssUniversal;
  } else {
    css = cssUniversal + cssLight;
  }

  if (typeof GM_addStyle != 'undefined') {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != 'undefined') {
    PRO_addStyle(css);
  } else if (typeof addStyle != 'undefined') {
    addStyle(css);
  } else {
    var node = document.createElement('style');
    node.type = 'text/css';
    node.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(node);
  }

  //Change body class to remove adblock warning
  const rootCallback = function (mutationsList, observer) {
    var body = document.querySelector("body");
    if (body != null) {
      if (body.getAttribute("class").indexOf("unblock") > -1) {
        if (body.getAttribute("class").indexOf("dark") > -1) {
          body.setAttribute("class", "                         dark");
        } else {
          body.setAttribute("class", "                    ");
        }
      }
    }
  }

  const config = {childList: true, subtree: true};
  const rootNode = document.querySelector("body");
  if (rootNode != null) {
    const rootObserver = new MutationObserver(rootCallback);
    rootObserver.observe(rootNode, config);
  }

  //Change body class to remove adblock warning
  /*var body;
  let waitForUnblock = setInterval(function() { //Check page content constantly
    body = document.querySelector("body");
    if (body != null) {
      if (body.getAttribute("class").indexOf("unblock") > -1) {
        if (body.getAttribute("class").indexOf("dark") > -1) {
          body.setAttribute("class", "                         dark");
        } else {
          body.setAttribute("class", "                    ");
        }
      }
    }
  }, 500); //Interval to check page content*/

})();
