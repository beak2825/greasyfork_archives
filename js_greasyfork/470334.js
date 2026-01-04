// ==UserScript==
// @name        Monitor Spoofer - webuntis.com
// @namespace   Violentmonkey Scripts
// @match       https://*.webuntis.com/WebUntis/monitor*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @version     1.0
// @author      -
// @description 2.2.2023, 10:00:16
// @downloadURL https://update.greasyfork.org/scripts/470334/Monitor%20Spoofer%20-%20webuntiscom.user.js
// @updateURL https://update.greasyfork.org/scripts/470334/Monitor%20Spoofer%20-%20webuntiscom.meta.js
// ==/UserScript==


// allows you to spoof settings as mentiond here
// https://help.untis.at/hc/de/articles/360014980240

var _open = XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function (method, URL) {
  var _onreadystatechange = this.onreadystatechange,
    _this = this;

  _this.onreadystatechange = function () {
    // catch only completed 'api/search/universal' requests
    console.log(URL);
    if (
      _this.readyState === 4 &&
      _this.status === 200 &&
      URL.includes("format")
    ) {
      try {
        //////////////////////////////////////
        // THIS IS ACTIONS FOR YOUR REQUEST //
        //             EXAMPLE:             //
        //////////////////////////////////////
        //var data = JSON.parse(_this.responseText);
        //
        //
        // let response = GM_getValue("response", _this.responseText);
        // GM_setValue("response", response);
        let json = `{
    "payload": {
        "customTitle": "",
        "dateOffset": 1,
        "departmentIds": [],
        "departmentElementType": -1,
        "fontSize": 16,
        "groupBy": 1,
        "height": 0,
        "hideCancelWithSubstitution": false,
        "mergeBlocks": true,
        "numberOfDays": 1,
        "pollingInterval": 300,
        "scrollType": "CONTINUOUS",
        "scrollingInterval": 12,
        "scrollSpeed": 3,
        "showAbsentElements": [],
        "showAffectedElements": [],
        "showBreakSupervisions": true,
        "showClass": true,
        "showHour": true,
        "showInfo": true,
        "showMessages": true,
        "showOnlyFutureSub": false,
        "showRoom": true,
        "showSubject": true,
        "showSubstText": true,
        "showTeacher": true,
        "showTicker": true,
        "showTime": true,
        "strikethrough": false,
        "tickerFontSize": 16,
        "hideAbsent": false,
        "rowHeaderEvenBackColor": "#f2f7fb",
        "rowHeaderOddBackColor": "#daecf8",
        "headerTitleForeColor": "#ff9900",
        "headerTitleBackColor": "#ffffff",
        "oddGroupBackColor": "#5b9df4",
        "evenGroupBackColor": "#a3c9fa",
        "teacherLabelid": 1,
        "enableSubstitutionFrom": false,
        "showSubstitutionFrom": 0,
        "showUnitTime": true,
        "showStudentgroup": true,
        "showTeacherOnEvent": true,
        "activityTypeIds": [],
        "showEvent": true,
        "showCancel": true,
        "showOnlyCancel": false,
        "showWithoutElem": true,
        "showSubstTypeColor": true,
        "mergeRegularFree": true,
        "showAbsentTeacher": false,
        "strikethroughAbsentTeacher": false,
        "showExamSupervision": true,
        "showUnheraldedExams": true
    }
}`;

        //Object.defineProperty(_this, 'responseText', {value: JSON.stringify(data)});

        Object.defineProperty(_this, "responseText", { value: json });
        console.log(data);
        // rewrite responseText
        /////////////// END //////////////////
      } catch (e) {}

      console.log("Caught! :)", method, URL /*, _this.responseText*/);
    }
    // call original callback
    if (_onreadystatechange) _onreadystatechange.apply(this, arguments);
  };

  // detect any onreadystatechange changing
  Object.defineProperty(this, "onreadystatechange", {
    get: function () {
      return _onreadystatechange;
    },
    set: function (value) {
      _onreadystatechange = value;
    },
  });

  return _open.apply(_this, arguments);
};
