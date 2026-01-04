// ==UserScript==
// @name        显示所有驱动版本
// @namespace   Violentmonkey Scripts
// @match       https://www.nvidia.cn/geforce/drivers/*
// @grant       none
// @version     1.0
// @author      moon
// @description 2024/3/19 12:38:58
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490241/%E6%98%BE%E7%A4%BA%E6%89%80%E6%9C%89%E9%A9%B1%E5%8A%A8%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/490241/%E6%98%BE%E7%A4%BA%E6%89%80%E6%9C%89%E9%A9%B1%E5%8A%A8%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==
(function(){
  window.onload = function() {
    SystemScanner.prototype.DriverSearch = function(psid, pfid, osID, langCode, whql, beta, dltype, numresults) {
      numresults = 100;
      this.scannerStatusUpdate(GFE_SERVER_CONNECTING);
      theScanner.scannedDevice.downloadInfo = new Object();
      var parameters = 'psid=' + psid;
      parameters += '&pfid=' + pfid;
      parameters += '&osID=' + osID;
      parameters += '&languageCode=' + langCode;
      parameters += '&beta=' + beta;
      parameters += '&isWHQL=' + whql;
      parameters += "&dltype=" + dltype;
      parameters += "&sort1=0";
      parameters += "&numberOfResults=" + numresults;
      var requestUrl = this.driverManualLookupUrl + parameters;
      this.driversLogUIEvent("warn", "SUID:" + this.tracker.scanID + " BEGIN DriverSearch requestUrl:" + requestUrl);
      this.debugTrace(requestUrl);
      jQuery.ajax({
        url: requestUrl,
        async: false,
        type: 'get',
        success: function(response) {
          try {
            theScanner.debugTrace("The Driver Lookup Service Returned:\n\n(" + response + ")");
            if (response.length > 0) {
              theScanner.resetResults();
              var driverLookupJsonObj = '(' + response + ')';
              theScanner.resultsList = new Object();
              theScanner.resultsList = eval(driverLookupJsonObj)
            }
            if (theScanner.resultsList.Success == 0) {
              theScanner.scannerStatus = "No driver available"
            } else {
              theScanner.scannerStatus = "Results Ready"
            }
          } catch (e) {
            this.driversLogUIEvent("error", " FAIL catch DriverSearch");
            theScanner.resetResults();
            theScanner.scannerStatus = "No driver available"
          }
        },
        error: function(response) {
          theScanner.resetResults();
          theScanner.scannerStatus = "AJAX Call failed"
        }
      });
      this.driversLogUIEvent("warn", "SUID:" + this.tracker.scanID + " END DriverSearch requestUrl:" + requestUrl);
    }
  }
})()