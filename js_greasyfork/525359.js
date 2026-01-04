// ==UserScript==
// @name         BLACK LOGS | Тёмная тема
// @namespace    http://tampermonkey.net/
// @version      2025-01-29
// @description  Тёмная тема для логов black russia
// @author       mr_hares
// @match        https://logs.blackrussia.online/gslogs/*
// @icon         http://blackrussia.online/favicon.ico
// @license MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525359/BLACK%20LOGS%20%7C%20%D0%A2%D1%91%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/525359/BLACK%20LOGS%20%7C%20%D0%A2%D1%91%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function() {
    function GM_addStyle (cssStr) {
        var D = document;
        var newNode = D.createElement('style');
        newNode.textContent = cssStr;
        var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
        targ.appendChild(newNode);
    }
    GM_addStyle ( `
      #game-logs-app {
	     background-color: #2d3238;
      }
      #log-table-heading {
	     color: white;
      }

      #log-table[data-v-2d76ca92] .first-row[data-v-2d76ca92]{
	     background-color: #484d56;
	     color: white;
      }

      #log-table[data-v-2d76ca92] .second-row[data-v-2d76ca92]{
	     background-color: #383c42;
	     color: white;
      }

      #log-table[data-v-2d76ca92] thead[data-v-2d76ca92] {
	     background-color: rgb(33,37,41);
	     color: white;
      }

      #log-filter-section[data-v-2d76ca92] {
         background-color: #42464d;
      }

      #log-filter[data-v-2d76ca92] .form-label[data-v-2d76ca92] {
         color: white;
      }

      .multiselect-search {
         background-color: #383c42
      }

      .autoComplete_wrapper>input {
         background-color: #383c42
      }

      .form-control {
         background-color: #383c42;
         color: white;
      }

      .dropdown-menu {
         background-color: #6c757d;
         color: white;
      }

      .dropdown-item {
         filter: invert(100%);
      }

      #log-filter[data-v-2d76ca92] .input-group-text[data-v-2d76ca92] {
         background-color: rgb(51, 56, 61);
         color: white;
      }

      .dp__theme_light {
         --dp-background-color: #383c42;
         --dp-text-color: white;
         --dp-hover-color: #42464d;
         --dp-hover-text-color: white;
         --dp-disabled-color: #383c42;
      }

      .dp__button:hover {
         background: #42464d;
         color: white;
      }
      .td-category[data-v-2d76ca92] a[data-v-2d76ca92] {
         color: rgb(85, 85, 251);
      }

      #loading-overlay[data-v-173ec149] {
         background-color: rgba(45, 50, 56, .925);
      }

      #loading-overlay-heading[data-v-173ec149] {
         color: white;
      }

      #loading-overlay[data-v-173ec149] .spinner[data-v-173ec149] {
         color: white
      }

      #log-filter-heading[data-v-2d76ca92] {
         color: white;
      }
      .form-control:focus {
         background-color: #434951;
         color: white;
         outline: 0
      }

      .multiselect-dropdown {
         background-color: #383c42;
      }
    ` );
})();