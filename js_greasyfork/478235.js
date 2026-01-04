// ==UserScript==
// @name         Delete All ChatGPT ChatTree🌳 History
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Delete ChatGPT ChatTree IndexedDB database. Please think twice before enabling this script
// @author       cuizhenzhi
// @match        https://chat.openai.com/*
// @grant        none
// @license GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/478235/Delete%20All%20ChatGPT%20ChatTree%F0%9F%8C%B3%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/478235/Delete%20All%20ChatGPT%20ChatTree%F0%9F%8C%B3%20History.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const DB_NAME = 'ChatTreeDB';
    console.log('try to delete:');

  var req = indexedDB.deleteDatabase(DB_NAME);
  req.onsuccess = function () {
    console.log("Deleted database successfully");
  };
  req.onerror = function () {
    console.log("Couldn't delete database");
  };
   req.onblocked = function () {
    console.log("Couldn't delete database due to the operation being blocked");
  };
})();
