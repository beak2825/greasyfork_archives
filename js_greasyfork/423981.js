// ==UserScript==
// @name         Tracker status
// @version      0.1.1
// @namespace    https://github.com/lancerer314/tracker_status
// @description  display tracker status  from TrackerStatus API.
// @include      https://*redacted.ch/*
// @grant        GM.xmlHttpRequest
// @grant    		 GM.getValue
// @grant    		 GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/423981/Tracker%20status.user.js
// @updateURL https://update.greasyfork.org/scripts/423981/Tracker%20status.meta.js
// ==/UserScript==
// inspired from https://greasyfork.org/en/scripts/395736-is-it-down




function eventHandler(event) {
  if(event.target.id!=DomNodeId){return;}
  switch(event.type) {
    case "mouseover":
      let rect = document.getElementById(DomNodeId).getBoundingClientRect();
      messageDiv.style.top=rect.bottom+"px";
      messageDiv.style.left=rect.left+"px";
      messageDiv.style.display="block";
      break;
    case "mouseout":
      messageDiv.style.display="none";
      break;
    case "click":
      var newtab = window.open("https://red.trackerstatus.info/", '_blank');
      newtab.focus();
      break
  } 
}

//uncomment for tests
/* 
let mockResponse=`{
    "Website": {
        "Status": "1",
        "Latency": "16ms",
        "CurrentUptime": "19955",
        "UptimeRecord": "121077",
        "CurrentDowntime": "0"
    },
    "TrackerHTTP": {
        "Status": "1",
        "Latency": "30ms",
        "CurrentUptime": "29197",
        "UptimeRecord": "83546",
        "CurrentDowntime": "0"
    },
    "TrackerHTTPS": {
        "Status": "0",
        "Latency": "16ms",
        "CurrentUptime": "136",
        "UptimeRecord": "73539",
        "CurrentDowntime": "0"
    },
    "IRC": {
        "Status": "1",
        "Latency": "23ms",
        "CurrentUptime": "29208",
        "UptimeRecord": "369746",
        "CurrentDowntime": "0"
    },
    "IRCTorrentAnnouncer": {
        "Status": "1",
        "Latency": "online",
        "CurrentUptime": "419",
        "UptimeRecord": "59089",
        "CurrentDowntime": "0"
    },
    "IRCUserIdentifier": {
        "Status": "1",
        "Latency": "online",
        "CurrentUptime": "427",
        "UptimeRecord": "306740",
        "CurrentDowntime": "0"
    },
    "tweet": {
        "date": "27th of March 2019",
        "unix": "1553728335",
        "message": "As of 6 hours ago main site and tracker services have been restored."
    }
}`;*/


function parseResponse(responseText){
  let overallOk=true;
  let htmlMessage = "<ul>";
  let response = JSON.parse(responseText);
  Object.entries(response).forEach(service => {
      if(service[1].Status === "0"){
        overallOk=false;
        htmlMessage+=`<li style=\"color:red\">${service[0]}: Down</li>`;
      } else {
        if(service[1].Latency){
          if(service[1].Latency.endsWith('ms')){
            htmlMessage+=`<li style=\"color:green\">${service[0]}: Up Latency:${service[1].Latency}</li>`;
          } else {
            htmlMessage+=`<li style=\"color:green\">${service[0]}:${service[1].Latency}</li>`;
          }
        }
      }
    })
    stats_container.style.color=overallOk?'green':'red';
    stats_container.innerHTML=`Services: <span class="stat">${overallOk?'Ok':'Ko'}</span>`
    messageDiv.innerHTML=htmlMessage+"</ul>";
}


function callApi(){
  //console.log("call Api");
  GM.xmlHttpRequest({
    method: "POST",
    url: 'https://red.trackerstatus.info/api/all/',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    onload: function(res) { 
  		//console.log("received api response");
      GM.setValue("responseText", res.responseText);
      GM.setValue("callTimestamp",Date.now());
      parseResponse(res.responseText)
    }
	});
}

const API_QUERY_PERIOD_MS =  60000; //query API at most every minute
const UPDATE_PERIOD_MS = 1200000;// update the data every 30 min if the user stay on the home page

function checkDataUpdate(){
  //console.log("check data ");
  GM.getValue("callTimestamp").then((callTimestamp) => {
    if((typeof callTimestamp === 'undefined')|| Number(callTimestamp)< Date.now()- API_QUERY_PERIOD_MS){
      callApi();
    } else {
      GM.getValue("responseText").then((value) => {parseResponse(value);});
    }
    setTimeout(checkDataUpdate, UPDATE_PERIOD_MS);
  });
}

const structure_msg = "Redacted site structure not recognized by tracker_status user script, please update it or notify dev.";
const stats_ul = document.getElementById('userinfo_stats');
if(!stats_ul){
  console.log(structure_msg);
}
const DomNodeId = "stats_services"
let response = null;
var messageDiv =  document.createElement("DIV");
messageDiv.setAttribute("id", "services_detail_container");
messageDiv.style.cssText=`display:none;position:absolute;width:200px;overflow: auto;z-index:200;background-color:black`;
document.body.prepend(messageDiv);

  
//sometimes the DOM node has already been set
let stats_container = document.getElementById("stats_services");
if(stats_container){
  if(stats_ul.contains(stats_container)){
    stats_ul.removeChild(stats_container);
  } else {
    console.log(structure_msg);
  }
} else {
  stats_container =  document.createElement("li");
}
stats_container.setAttribute("id", "stats_services");
stats_container.setAttribute("class", "tooltip");
stats_container.style.cursor="pointer";
stats_container.innerHTML='Services:<span class="stat">-</span>'
stats_ul.prepend(stats_container);
stats_container.addEventListener('mouseover', eventHandler, false);
stats_container.addEventListener('mouseout', eventHandler, false);
stats_container.addEventListener('click', eventHandler, false);
  
checkDataUpdate();
