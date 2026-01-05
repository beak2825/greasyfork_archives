// ==UserScript==
// @name        WaniKani Real Times
// @namespace   wanikani.amillerchip
// @description	Replaces WaniKani times with more exact times.
// @include     https://www.wanikani.com/*
// @exclude		https://www.wanikani.com/review*
// @exclude		https://www.wanikani.com/lesson*
// @exclude		https://www.wanikani.com/community/people/*
// @exclude		https://www.wanikani.com/account
// @exclude		https://www.wanikani.com/login
// @version     1.5
// @run-at		document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23342/WaniKani%20Real%20Times.user.js
// @updateURL https://update.greasyfork.org/scripts/23342/WaniKani%20Real%20Times.meta.js
// ==/UserScript==
// NOTE from amillerchip: I edited the below to force display of datestamps instead of relative time
// NOTE from rfindley:  This is someone else's old script, to which I've added a
// minor fix for burned items, and removed some greasemonkey dependencies.
// It's not my code, nor have I looked at most of it, so you are getting it 'as-is'.
// Please see original WaniKani thread:
// https://www.wanikani.com/chat/api-and-third-party-apps/1121

function main(){

	var css =
        'time1 {cursor:help; font-family:Ubuntu,Helvetica,Arial,sans-serif;}'+
        'time2 {cursor:help; font-family:Ubuntu,Helvetica,Arial,sans-serif;}'+
	    'time3 {cursor:help; font-family:Ubuntu,Helvetica,Arial,sans-serif;}'+
	    'time4 {cursor:help; font-family:Ubuntu,Helvetica,Arial,sans-serif;}'+
	    '.dashboard section.review-status time1 {display:block; margin-bottom:0.5em; font-size:36px; font-weight:bold; line-height:1em;}'+
	    'time2 {color:rgb(153,153,153); text-shadow:0px 1px 0px rgb(255,255,255);}'+
	    '.dashboard section.system-alert time4 {margin-left:1em; color:rgb(119,0,79); font-weight:600; text-shadow:0px 1px 0px rgba(255,255,255,0.3); opacity:0.45;}';

    $('head').append('<style type="text/css">'+css+'</style>');

	var timeElements = document.getElementsByClassName("timeago");
	var currentTime = new Date().valueOf();

	for(var i=0;i<timeElements.length;i){
        var title, children, parent, newNode, j;

		if(timeElements[i].parentNode.parentNode.parentNode.className.indexOf("review-status") != -1){

			var reviewTimeHolder = timeElements[i];
			var reviewTime = new Date(reviewTimeHolder.getAttribute("datetime")*1000);
			title = reviewTimeHolder.getAttribute("title");
			children = reviewTimeHolder.childNodes;
			parent = reviewTimeHolder.parentNode;
			newNode = document.createElement("time1");
			newNode.setAttribute("title", title);
			newNode.setAttribute("datetime", reviewTime.valueOf());

			for(j=0;j<children.length;j++){
				newNode.appendChild(children[j]);
			}

            parent.replaceChild(newNode,reviewTimeHolder);

		}else if(timeElements[i].parentNode.parentNode.className.indexOf("system-alert") != -1){

			var alertTimeHolder = timeElements[i];
			var alertTime = new Date(alertTimeHolder.getAttribute("datetime").valueOf());
			title = alertTimeHolder.getAttribute("title");
			children = alertTimeHolder.childNodes;
			parent = alertTimeHolder.parentNode;
			newNode = document.createElement("time4");
			newNode.setAttribute("title", title);
			newNode.setAttribute("datetime", alertTime.valueOf());

			for(j=0;j<children.length;j++){
				newNode.appendChild(children[j]);
			}

			parent.replaceChild(newNode,alertTimeHolder);

		}else{

            if ($('.srs .burned').is(':visible')) return;
			var theTime = new Date(timeElements[i].getAttribute("datetime")).valueOf();

			if(theTime){

				var upCountHolder = timeElements[i];
				var upCountTime = new Date(upCountHolder.getAttribute("datetime")).valueOf();
				title = upCountHolder.getAttribute("title");
				children = upCountHolder.childNodes;
				parent = upCountHolder.parentNode;
				newNode = document.createElement("time3");
				newNode.setAttribute("title", upCountHolder.getAttribute("title"));
				newNode.setAttribute("datetime", upCountTime.valueOf());

				for(j=0;j<children.length;j++){
					newNode.appendChild(children[j]);
				}

				parent.replaceChild(newNode,upCountHolder);

            }else{

                var downCountHolder = timeElements[i];
				var downCountTime = new Date(downCountHolder.getAttribute("datetime")*1000);
				title = downCountHolder.getAttribute("title");
				children = downCountHolder.childNodes;
				parent = downCountHolder.parentNode;
				newNode = document.createElement("time2");
				newNode.setAttribute("title", downCountHolder.getAttribute("title"));
				newNode.setAttribute("datetime", downCountTime.valueOf());

                for(j=0;j<children.length;j++){
					newNode.appendChild(children[j]);
				}

                parent.replaceChild(newNode,downCountHolder);
			}
		}
	}

	alertCount = document.getElementsByTagName("time4");
	reviewCount = document.getElementsByTagName("time1");

	downCounters = document.getElementsByTagName("time2");
	upCounters = document.getElementsByTagName("time3");

	function newTimes(){
		updateUpCounters(upCounters);
		updateUpCounters(alertCount);
		updateDownCounters(downCounters);
		updateDownCounters(reviewCount);
	}

	newTimes();
	window.setInterval(newTimes,30000);

}

window.addEventListener("load", main, false);

function updateUpCounters(up){
	var currentTime = new Date();

	for(var i=0;i<up.length;i++){

		var stamp = up[i].getAttribute("datetime");
    var date = new Date(parseInt(stamp));
		
		var localeDate = date.toLocaleDateString();
		var localeTime = date.toLocaleTimeString();
		
		var output = "";

		if(currentTime - stamp < 86400000){
			output = localeTime;
		} else{
			output = localeDate + " " + localeTime;
		}

		up[i].innerHTML = output;
	}
}


function updateDownCounters(down){
	var currentTime = new Date();

	for(var i=0;i<down.length;i++){

		var stamp = down[i].getAttribute("datetime");
		var diff = stamp - currentTime;

		var output = "";

		if(diff < 0 || (window.location.href.indexOf("dashboard") != -1 && document.getElementsByClassName("reviews")[0].getElementsByTagName("span")[0].innerHTML != "0")){
			output = "Available Now";
		}else{
      var date = new Date(parseInt(stamp));
			output = date.toLocaleTimeString();
		}

		down[i].innerHTML = output;
	}
}