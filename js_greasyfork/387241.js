// ==UserScript==
// @name         VrapiLogger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Log submission data.
// @author      Andy
// @include     https://app.hostcompliance.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require     https://unpkg.com/papaparse@5.0.0/papaparse.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/387241/VrapiLogger.user.js
// @updateURL https://update.greasyfork.org/scripts/387241/VrapiLogger.meta.js
// ==/UserScript==

  const retrieveData = function(){
    //Retreieve storage or create one if it doesn't exist.
    let storedData = JSON.parse(GM_getValue("storedData", null));
    if (!Array.isArray(storedData)){
      storedData = [];
    }
    return storedData;
  };