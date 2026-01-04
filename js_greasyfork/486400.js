// ==UserScript==
// @name         IMVU Creator Tiers Infos CSS
// @namespace    http://tampermonkey.net/
// @version      2024-04-07
// @description  Add CSS to Creator Tiers Statistics page (Creators only)
// @author       Evehne
// @match        https://*.imvu.com/catalog/developer_report.php?reporttype=tiersinfo
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imvu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486400/IMVU%20Creator%20Tiers%20Infos%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/486400/IMVU%20Creator%20Tiers%20Infos%20CSS.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var e = document.querySelector('.tier');
    e.innerHTML += `<style>
      .tier table:first-child
      {
        margin-top: 32px;
      }
      .tier table{
        margin-bottom: 16px;
        border: 1px solid black;
        border-spacing: 1px;
        border-collapse: collapse;
      }

      .tier .headercell{
        font-weight: bold;
        font-size: 12pt;
        color: #efefef;
        background-color: #212;
        padding: 8px 4px;
      }

      .tier th{
        font-weight: bold;
        font-size: 10pt;
        padding: 4px 2px;
      }

      .tier td{
        padding: 2px;
        margin: 1px;
      }

      .tier tr.accent-row{
        background-color: #efefef;
        border-top: 1px solid #324;
        border-bottom: 1px solid #324;
      }

      .tier tr:not(.accent-row){
        background-color: #efefef;
      }

      .tier td:first-child{
        width: 260px;
      }

      .tier th:nth-child(2),
      .tier th:nth-child(3),
      .tier th:nth-child(4),
      .tier th:nth-child(5),
      .tier td:nth-child(2),
      .tier td:nth-child(3),
      .tier td:nth-child(4),
      .tier td:nth-child(5)
      {
        width: 140px;
        text-align: center;
      }
      .tier td:last-child
      {
        font-weight: bold;
      }

      .tier tr:last-child td{
        font-weight: bold;
        font-size: 11pt;
        color: #efefef;
        background-color: #324;
        padding: 8px 2px;
      }
      .tier > h3{
        font-weight: bold;
        font-size: 16pt;
      }
    </style>`;
})();