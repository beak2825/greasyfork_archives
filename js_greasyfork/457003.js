// ==UserScript==
// @name          OpsTechIT Local Change
// @description   OpsTechIT Local Change Script by Carlo Gatti
// @namespace     https://greasyfork.org/users/1001323
// @icon          https://drive-render.corp.amazon.com/view/carlogtt%40/tt.jpeg
// @author        carlogtt@
// @connect       0s62bmu3aj.execute-api.us-east-1.amazonaws.com
// @connect       s3-us-west-2.amazonaws.com
// @connect       maxis-service-prod-iad.amazon.com
// @include       https://t.corp.amazon.com/*
// @include       https://maxis-service-prod-iad.amazon.com/*
// @include       *://sim-ticketing-fleet-pdx.pdx.proxy.amazon.com/*
// @include       *://sim-ticketing-fleet-iad.iad.proxy.amazon.com/*
// @require       https://code.jquery.com/jquery-3.3.1.min.js
// @grant         GM_xmlhttpRequest
// @grant         GM.xmlHttpRequest
// @grant         GM_info
// @version       1.16
// @downloadURL https://update.greasyfork.org/scripts/457003/OpsTechIT%20Local%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/457003/OpsTechIT%20Local%20Change.meta.js
// ==/UserScript==



//Global Variables
var version = GM_info.script.version;

// SIM API url
var simApiUrl = "https://maxis-service-prod-iad.amazon.com/";


//Check for status to verify it is a ticket page
//once verified run this script
// Script is delayed using waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs)
(function() {
    waitForElementToDisplay(".issue-static-container", function(){
        addTimeSIM();
    },500, 5000);
})();

// Create an event listener for when the user clicks on something on the page.
window.onclick = e => {
    addTimeSIM();
}

// Push time spent to the ticket using sim api.
function pushTime(time){
    var ticketId = document.getElementsByClassName("ticket-id")[0].dataset.id;
    var uuid = "cad1f105-0024-4c5f-a024-c281015ba2df"; // unique identifier for time spent. Not sure if this needs to be generated and truly unique but for now I will use this id.
    var date = new Date().toJSON(); // UTC time. Does not affect time spent, it is only used as an attribute for the json payload.
    var login = document.querySelector('.sim-navDropdown--user').innerText.slice((document.querySelector('.sim-navDropdown--user').innerText.lastIndexOf('(')+1), (document.querySelector('.sim-navDropdown--user').innerText.lastIndexOf(')')));
    var loginIdentity = "kerberos:" + login + "@ANT.AMAZON.COM"; // TODO: This could be problematic. I am unsure if all users are using Kerberos auth. This isnt an ideal way of doing things but will probably work for 95% of people using this script. Hopefully.
    var index = -1;
    var timePayload;
    httpGetReq(ticketId, (function callback(getResponse){
        if(getResponse.status == 200){
            var ticket = JSON.parse(getResponse.responseText);
            if(ticket.extensions.effort.hasOwnProperty("actualEffortLog")){
                index = ticket.extensions.effort.actualEffortLog.time.length;
                // actualEffortLog exists. Append time to that.
                timePayload = {
                    "pathEdits":
                    [
                        {
                            "editAction": "PUT",
                            "path": `/extensions/effort/actualEffortLog/time/${index}`,
                            "data": {
                                "authorIdentity": loginIdentity,
                                "id": uuid,
                                "effortLoggedDate": date,
                                "value": time
                            }
                        }
                    ]
                }
                httpPostReq(ticketId, timePayload, (function callback(postResponse){
                    if(postResponse.status == 201){
                        console.log("Successfully logged time");
                    }else{
                        console.log("Non 201 response on POST request! Request returned: " + postResponse.status + ". Failed to log time.");
                        console.log(postResponse);
                    }
                }));
            }else{
                index = 0;
                // Time information hasnt been logged yet. Create a new actualEffortLog entry.
                timePayload = {
                    "pathEdits":
                    [
                        {
                            "editAction": "PUT",
                            "path": `/extensions/effort`,
                            "data": {
                                "actualEffortLog": {
                                    "time": [
                                        {
                                            "authorIdentity": loginIdentity,
                                            "id": uuid,
                                            "effortLoggedDate": date,
                                            "value": time
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
                httpPostReq(ticketId, timePayload, (function callback(postResponse){
                    if(postResponse.status == 201){
                        console.log("Successfully logged time");
                    }else{
                        console.log("Non 201 response on POST request! Request returned: " + postResponse.status + ". Failed to log time.");
                        console.log(postResponse);
                    }
                }));
            }
        }else{
            console.log("Non 200 response on GET request! Request returned: " + getResponse.status + ". Failed to log time.");
            console.log(getResponse);
        }
    }));
}//pushTime


// Create a time spent section at the top of the ticket and record time when "add" is pressed.
function addTimeSIM(){
  var login = document.querySelector('.sim-navDropdown--user').innerText.slice((document.querySelector('.sim-navDropdown--user').innerText.lastIndexOf('(') + 1), (document.querySelector('.sim-navDropdown--user').innerText.lastIndexOf(')')));
  var loginIdentity = "kerberos:" + login + "@ANT.AMAZON.COM"; // TODO: This could be problematic. I am unsure if all users are using Kerberos auth. This isnt an ideal way of doing things but will probably work for 95% of people using this script. Hopefully
    if(document.querySelector("#TRQTimeDiv") == null){
        waitForElementToDisplay(".issue-static-container", function(){
            var topContainer = document.querySelector(".issue-static-container");
            var newTimeDiv = document.createElement("div");
            newTimeDiv.id = "TRQTimeDiv";
            newTimeDiv.innerHTML = `
            <table class="date-table">
                <tbody>
                    <tr>
                        <th style="color:#ec7211">Local Change Tools</th>
                    </tr>
                    <tr class="time-spent">
                        <td class="time-picker-cell">
                            Time Spent
                            <select id="TRQHrsVal" style="width: 50px;">
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                            </select>
                            Hours
                            <select id="TRQMinVal" style="width: 50px;">
                                <option value="0">0</option>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                            </select>
                            Minutes
                            <awsui-button initialized="true">
                                <button class="awsui-button awsui-button-variant-normal awsui-hover-child-icons" type="submit" override-focus="" id="TRQAddTimeBtn">
                                    <span awsui-button-region="text">
                                    <span><span>Add Time</span></span></span>
                                </button>
                            </awsui-button>
                        </td>
                    </tr>
                    <tr class="time-spent">
                        <td class="awsui-button awsui-button-variant-normal awsui-hover-child-icons">
                            <awsui-button initialized="true">
                                <button class="awsui-button awsui-button-variant-normal awsui-hover-child-icons" type="submit" override-focus="" id="TRQAddTagBtn">
                                    <span awsui-button-region="text">
                                    <span><span>Mark as Local Change</span></span></span>
                                </button>
                            </awsui-button>
                        </td>
                    </tr>
                </tbody>
            </table><br>
            `
            topContainer.insertBefore(newTimeDiv, topContainer.firstChild);
            document.getElementById("TRQAddTimeBtn").onclick = function() {
                var hours = document.getElementById("TRQHrsVal");
                var minutes = document.getElementById("TRQMinVal");
                if(minutes.value == '' || minutes.value < 0){
                    minutes.value = 0;
                }
                var time = parseInt(minutes.value) + parseInt(hours.value*60);
                if(time > 0){
                    pushTime(time);
                    hours.value = 0;
                    minutes.value = 0;
                    hours.style.backgroundColor = "rgb(0,255,0)";
                    minutes.style.backgroundColor = "rgb(0,255,0)";
                    for(var i=0; i<=255; i++){
                        setTimeout(function(i){
                            hours.style.backgroundColor = "rgba("+i+", 255, "+i+")";
                            minutes.style.backgroundColor = "rgba("+i+", 255, "+i+")";
                        }, 1000, i);
                    }
                }else{
                    hours.style.backgroundColor = "rgb(255,0,0)";
                    minutes.style.backgroundColor = "rgb(255,0,0)";
                    for(var f=0; f<=255; f++){
                        setTimeout(function(f){
                            hours.style.backgroundColor = "rgba(255, "+f+", "+f+")";
                            minutes.style.backgroundColor = "rgba(255, "+f+", "+f+")";
                        }, 1000, f);
                    }
                }
                hours.value = 0;
                minutes.value = 0;
                addSIMMetrics("1", time);
            };

            document.getElementById("TRQAddTagBtn").onclick = function() {
                updateTicket(["UKFPT-Local-Change.Script"])
                var hours = document.getElementById("TRQHrsVal");
                var minutes = document.getElementById("TRQMinVal");
                hours.style.backgroundColor = "rgb(0,255,0)";
                minutes.style.backgroundColor = "rgb(0,255,0)";
                for(var i=0; i<=255; i++){
                    setTimeout(function(i){
                        hours.style.backgroundColor = "rgba("+i+", 255, "+i+")";
                        minutes.style.backgroundColor = "rgba("+i+", 255, "+i+")";
                    }, 1000, i);
                }
                addSIMMetrics("2", null);
            };
        },200, 2000);
    }
}//addTimeSIM


function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs){
          return;
        }
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}//waitForElementToDisplay


// GET request. Returns the json response text in the callback function
function httpGetReq(ticketId, callback){
         GM.xmlHttpRequest({
            method: "GET",
            url: simApiUrl + "issues/" + ticketId,
            onload: function (response) {
                callback(response);
            },
            onerror: function (response) {
                console.log('Failed GET!');
                console.log(response);
            }
        });
}//httpGetReq


// POST request. Returns response in the callback function.
function httpPostReq(ticketId, jsonText, callback){
         GM.xmlHttpRequest({
            method: "POST",
            url: simApiUrl + "issues/" + ticketId + "/edits",
             headers: {
              "Content-Type": "application/json",
                 "Origin": "https://t.corp.amazon.com"
             },
             data: JSON.stringify(jsonText),
            onload: function (response) {
                callback(response);
            },
            onerror: function (response) {
                console.log('Failed POST!');
                console.log(response);
            }
        });
}//httpPostReq


// This function is what creates the API body that is fed into the ticket to update all attributes.
function updateTicket(tags) {
  var ticketId = document.getElementsByClassName("ticket-id")[0].dataset.id;
  var login = document.querySelector('.sim-navDropdown--user').innerText.slice((document.querySelector('.sim-navDropdown--user').innerText.lastIndexOf('(') + 1), (document.querySelector('.sim-navDropdown--user').innerText.lastIndexOf(')')));
  var loginIdentity = "kerberos:" + login + "@ANT.AMAZON.COM"; // TODO: This could be problematic. I am unsure if all users are using Kerberos auth. This isnt an ideal way of doing things but will probably work for 95% of people using this script. Hopefully
  var edits;
  var pathEdits = [];
  httpGetReq(ticketId, (function callback(getResponse) {
    if (getResponse.status == 200) {
      var ticketJSON = JSON.parse(getResponse.responseText);
      console.log(ticketJSON);

      var tagsJSON = [];
      if (tags != null && tags.length != 0) {
        var index = ticketJSON.tags.length;
        for (var i = 0; i < tags.length; i++) {
          var tmpTag = {
            "path": `/tags/${index}`,
            "editAction": "PUT",
            "data": {
              "id": tags[i]
            }
          };
          pathEdits.push(tmpTag);
          index++;
        }
      }

      edits = { "pathEdits": pathEdits };
      console.log(edits);

      httpPostReq(ticketId, edits, (function callback(postResponse) {
        if (postResponse.status == 201) {
          console.log("Updated ticket successfully. Refresh to see changes.");
        } else if (postResponse.status == 200) {
          console.log("Updated ticket, API returned with status code 200.");
        } else {
          console.log("Non 200/201 response on POST request! Request returned: " + postResponse.status + ". Failed to update ticket.");
          console.log(postResponse);
        }
      }));
    } else {
      console.log("Non 200 response on GET request! Request returned: " + getResponse.status + ". Failed to update ticket.");
      console.log(getResponse);
    }
  }));
}


// Usage analytics provided by how-many.sales.aws.a2z.com
// SIM usage analytics
async function addSIMMetrics(buttonpress, timerec){
    var userName = document.querySelector('.sim-navDropdown--user').innerText.slice((document.querySelector('.sim-navDropdown--user').innerText.lastIndexOf('(')+1), (document.querySelector('.sim-navDropdown--user').innerText.lastIndexOf(')')));
    var SIMID = document.getElementsByClassName("ticket-id")[0].dataset.id;
    var attributes = "&login=" + userName + "&version=" + version + "&caseID=" + SIMID + "&buttonpress=" + buttonpress + "&timerec=" + timerec;
            // Due to CSP, this needs to be done in a get request now.
    return new Promise(res => {
        GM.xmlHttpRequest({
            method: "GET",
            url: "https://0s62bmu3aj.execute-api.us-east-1.amazonaws.com/PROD/pixel/tracker?PixelID=ee11c784-06a4-d0b9-6a91-41506f09c9b4" + attributes,
            headers: {
                "Content-Type": "application/json",
                "Origin": "https://t.corp.amazon.com"
            },
            onload: function (response) {
                console.log("Successfully pinged metric point.");
                res();
            },
            onerror: function (response) {
                console.log('Failed to ping metric point.');
                console.log(response);
                res();
            }
        });
    })
}