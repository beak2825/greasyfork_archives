
// ==UserScript==
// @name         FAH Timeout Display (Chrome, Tampermonkey)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Display timeout and other WU related information
// @author       Kaden Baker
// @match        http://folding.stanford.edu/nacl/
// @compatible   chrome
// @compatible   tampermonkey
// @grant        none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/372632/FAH%20Timeout%20Display%20%28Chrome%2C%20Tampermonkey%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372632/FAH%20Timeout%20Display%20%28Chrome%2C%20Tampermonkey%29.meta.js
// ==/UserScript==

var myConsole = null;
const fahInfoBox = "_fahExtInfoBox";
const fahTimeField = "_fahExtTimeField";
var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

var month = new Array(12);
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

(function() {
    'use strict';

    //We take over console.log, which is used by FAH, so we can catch log entries of interest.
    if (myConsole === null)
    {
        //Easier to make a copy of the whole console object
        myConsole = window.console;

        //Now replace the original log method with ours
        window.console.log = function()
        {
            //This is only supposed to be called once, but we have to check it here
            //because at the time this script is called there is nobody.onLoad yet
            if (document.getElementById("panel"))
            {
                if (document.getElementById(fahInfoBox) === null ||document.getElementById(fahInfoBox) === undefined )
                {
                    var iField = document.createElement('div');
                    iField.id = fahInfoBox;
                    document.getElementById("panel").appendChild(iField);

                    var timeField = document.createElement("div");
                    timeField.id = fahTimeField;
                    document.getElementById(fahInfoBox).appendChild(timeField);
                }
            }

            //Send the original data on its way, so the log doesn't get disturbed
            console.info.apply(myConsole, arguments);

            var infoLine = arguments[0];
            //We only need the client id data block
            if (infoLine.indexOf('DEBUG: WU: {"client_id":"') != -1)
            {
                //As I understand it, this huge line is a JSon object/array:
                //Parsing probably takes time - but it ensures we get the right info
                var WUData = JSON.parse(infoLine.substr(10, infoLine.length));
                var wu_ts = new Date(WUData.wu_ts);
                var wu_dl = new Date(WUData.deadline);
                var wu_to = new Date(WUData.timeout);

                var wu_maxtime = (wu_to - wu_ts) / 1000;
                var wu_maxmin = wu_maxtime / 60;

                var wuTimeMessage = document.createElement("span");
                wuTimeMessage.innerHTML = "Start of WU: " + wu_ts.getHours() + ":" + wu_ts.getMinutes()+ " "  + weekday[wu_ts.getDay()] + " " + month[wu_ts.getMonth()] + " " + wu_ts.getFullYear();
                wuTimeMessage.innerHTML += "<br />";                
                wuTimeMessage.innerHTML += "Timeout: " + wu_to.getHours() + ":" + wu_to.getMinutes() + " " +  weekday[wu_to.getDay()] + " " + month[wu_to.getMonth()] + " " + wu_to.getFullYear();
                wuTimeMessage.innerHTML += "<br />";
                wuTimeMessage.innerHTML += "Minutes from start to timeout:" + wu_maxmin;

                var tmpTimeField = document.getElementById(fahTimeField);
                while (tmpTimeField.firstChild)
                    tmpTimeField.removeChild(tmpTimeField.firstChild);

                tmpTimeField.appendChild(wuTimeMessage);
            }

        };
    }
})();