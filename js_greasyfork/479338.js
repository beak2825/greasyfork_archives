// ==UserScript==
// @name         Travel landing exact landing time
// @namespace    heasley.travel_landing_time
// @version      1.0
// @description  See when someone lands if they are on your friendslist via chat data
// @author       Heasley
// @match        https://www.torn.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479338/Travel%20landing%20exact%20landing%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/479338/Travel%20landing%20exact%20landing%20time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function interceptFetch(url,q, callback) {
    var originalFetch = fetch;
    fetch = function() {
        return originalFetch.apply(this, arguments).then(function(data) {
            let dataurl = data.url.toString();
            if (dataurl.includes(url) && dataurl.includes(q)) {
               const clone = data.clone();
               clone.json().then((response) => callback(response, data.url));
            }
            return data;
        });
    };
}

    interceptFetch("torn.com","userlist.php", (response, url) => {
     console.log("Found a fetch from: " + url);
     console.log(response);

        if (response?.list) {
            const list = response.list;
            const now = Date.now();
            var travel_list = "";
            for (const [key, value] of Object.entries(list)) {
                const traveltimeStr = value?.traveltime;
                const name = value?.playername;
                const uid = value?.userID;

                if (traveltimeStr) {
                    const traveltime = parseInt(traveltimeStr);

                    if (now < (traveltime * 1000)) {
                        const seconds_left = Math.abs((now/1000) - (traveltime));
                        const time = secondsToHmsShort(seconds_left);

                        travel_list += name + " ["+uid+"] lands in " + time + "\n";
                    }
                }
            }

            if (travel_list) {
                alert(travel_list);
            }
            console.log(travel_list);
        }
    });
})();

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function secondsToHmsShort(d) {
  d = Number(d);
  var days = Math.floor(d / 86400);
  var h = Math.floor(d % 86400 / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var dayDisplay = days > 0 ? days + (days == 1 ? "d " : "d ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";

  if (days > 1) {
    return days + " days";
  }

  return dayDisplay + hDisplay + mDisplay + sDisplay;
}