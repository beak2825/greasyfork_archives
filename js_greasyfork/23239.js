// ==UserScript==
// @name        JR Mturk Panda Crazy Queue Helper
// @version     0.3.10
// @namespace   https://greasyfork.org/users/6406
// @description A script add on for Panda Crazy for displaying queue and sorting queue after submitting hits.
// @author      (JohnnyRS on mturkcrowd.com and mturkgrind.com) johnnyrs@allbyjohn.com
// @include     http*://worker.mturk.com/*
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant 		GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/23239/JR%20Mturk%20Panda%20Crazy%20Queue%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/23239/JR%20Mturk%20Panda%20Crazy%20Queue%20Helper.meta.js
// ==/UserScript==

var gScriptVersion="0.3.10", gQueueHelperFormat2 = true, gFromQueue = false;
var gScriptName="pandacrazy", gScriptID="PQ35";
var gLocation=window.location.href, gPrevHit="", gPrevTitle="";
var gPandaCrazyLives=false, gHitExternalNextLink="", gHitExternalNextAcceptLink="", gTitle="", gNewSite=true;
var gPandaCrazyVersion=-1, gHitReturnLink="", gThisJob=null, gNoHits=false, gButtonSet=false, gRequesterName="";
var gQueueData=[], gPE=0, gTabTextMode=0, gTabTextTimer=0, gOriginalTitle=document.title, gCurrentPostion = 0, gQueueNextHit=null;
var gSubmitHitID="", gReturnedHitID="", gGroupId=""; // previous hitID submitted or returned just to be sure it doesn't get redone.
var gCorrectVersion=false, gFirstChange=false, gQueueSessOptions=null, gSubmitButton=null, gHitId="", gIdNum=-1, gTabHitIds={}, gAssignmentId = "";
var gThisTarget=""; // target ID from the time to distinguish different scripts and tabs.
var gTabTarget={"tabId":Math.floor(new Date().getTime() / 100), "scriptID":gScriptID}; // target ID from the time to distinguish different scripts and tabs.
var gThisId=-1; // ID number to represent the id in the Panda Crazy external data number ID just for separating messages.
var gQueueSessOptionsDef={"nextPosition":"--","nextIsLast":false,"nextIsSame":false,"tabNum":-1,"nextMonitor":false};
var gQueueLocalOptionsDef={"displayTabTitleQ":true,"displayTabTitleTime":true,"displayTabTitleName":true,"displayTabTitleToggle":false,"toggleTime":4000};
var gJobDataDefault = {"requesterName":"","requesterId":"","groupId":"","pay":"","title":"","duration":"0","hitsAvailable":0,"timeLeft":"","totalSeconds":0,"hitId":"",
		"qual":"","continueURL":"","returnURL":"","durationParsed":{},"jobNumber":"-1","friendlyRName":"","friendlyTitle":"","assignedOn":"","description":"",
		"keywords":"","timeData":{},"assignmentID":"","hitSetID":"","secondsOff":-1,"goHam":false};

function speakThisNow(thisText) {
    if('speechSynthesis' in window){
        var speech = new SpeechSynthesisUtterance(thisText);
        speech.lang = 'en-US';
        window.speechSynthesis.speak(speech);
    }
}
function formatAMPM(theFormat,theDate,theTimeZone) {
    var d = (theDate) ? theDate : new Date();
    if (theTimeZone == "mturk") {
        var mturkTZOffset = -8, today = new Date(); if (today.dst()) mturkTZOffset++;
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000), MturkTime = utc + (3600000 * mturkTZOffset);
        d = new Date(MturkTime);
    }
    var minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
        hours = d.getHours(), ampm = hours >= 12 ? 'pm' : 'am',
        months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	hours = (hours>= 12) ? (hours-12) : hours;
	hours = (hours.toString().length == 1) ? '0'+hours : hours;
    if (theFormat=="short") return ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + '-' + d.getFullYear() + '(' + hours + ':' + minutes + ampm + ')';
    else if (theFormat=="dayandtime") return days[d.getDay()] + ' ' + hours + ':' + minutes + ampm;
    else if (theFormat=="onlydate") return ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + '-' + d.getFullYear();
    else return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm;
}
function formatTimeZone(theFormat,theDate,theTimeZone) { return formatAMPM(theFormat,theDate,theTimeZone); }
function getTimeLeft(theTime) {
    if (theTime!==null && theTime!=="") {
        var tempArray = (theTime.indexOf("second") != -1) ? theTime.split("second")[0].trim().split(" ") : null;
		var seconds = (tempArray) ? parseInt(tempArray[tempArray.length-1]) : 0;
		tempArray = (theTime.indexOf("minute") != -1) ? theTime.split("minute")[0].trim().split(" ") : null;
		var minutes = (tempArray) ? parseInt(tempArray[tempArray.length-1]) : 0;
		tempArray = (theTime.indexOf("hour") != -1) ? theTime.split("hour")[0].trim().split(" ") : null;
		var hours = (tempArray) ? parseInt(tempArray[tempArray.length-1]) : 0;
		tempArray = (theTime.indexOf("day") != -1) ? theTime.split("day")[0].trim().split(" ") : null;
		var days = (tempArray) ? parseInt(tempArray[tempArray.length-1]) : 0;
		tempArray = (theTime.indexOf("week") != -1) ? theTime.split("week")[0].trim().split(" ") : null;
		var weeks = (tempArray) ? parseInt(tempArray[tempArray.length-1]) : 0;
		return( {"weeks":weeks,"days":days,"hours":hours,"minutes":minutes,"seconds":seconds} );
    } else return null;
}
function formatTimeLeft(resetNow,thisDigit,timeString,lastDigit) {
	formatTimeLeft.timeFill = formatTimeLeft.timeFill || 0;
	if (resetNow) formatTimeLeft.timeFill = 0;
	var missingDigit = (lastDigit!="0" && thisDigit=="0") ? true : false;
	if (( thisDigit!="0" || missingDigit) && formatTimeLeft.timeFill<2) {
		formatTimeLeft.timeFill++;
		if (missingDigit) { return "00 " + timeString + "s"; }
		else {
			var addZero = (thisDigit<10) ? ((formatTimeLeft.timeFill==1) ? false : true) : false, plural = (thisDigit==1) ? false : true;
			return ((addZero) ? "0" : "") + thisDigit + " " + ((plural) ? (timeString+"s") : timeString) + " ";
		}
	} else return "";
}
function convertToTimeString(timeData) {
	var returnString = "";
	returnString += formatTimeLeft(true,timeData.weeks,"week","0"); returnString += formatTimeLeft(false,timeData.days,"day",timeData.weeks);
	returnString += formatTimeLeft(false,timeData.hours,"hour",timeData.days); returnString += formatTimeLeft(false,timeData.minutes,"minute",timeData.hours);
	returnString += formatTimeLeft(false,timeData.seconds,"second",timeData.minutes);
	return returnString.trim();
}
function convertTimeToSeconds(timeData) {
	var totalSeconds = timeData.seconds + ((timeData.minutes) ? (timeData.minutes*60) : 0) + ((timeData.hours) ? (timeData.hours*3600) : 0) +
			((timeData.days) ? (timeData.days*86400) : 0) + ((timeData.weeks) ? (timeData.weeks*604800) : 0);
	return totalSeconds;
}
function convertSecondsToTimeData(seconds) {
	var timeData = {};
	timeData.weeks = Math.floor(seconds/604800); seconds = seconds - (timeData.weeks*604800);
	timeData.days = Math.floor(seconds/86400); seconds = seconds - (timeData.days*86400);
	timeData.hours = Math.floor(seconds/3600); seconds = seconds - (timeData.hours*3600);
	timeData.minutes = Math.floor(seconds/60); seconds = seconds - (timeData.minutes*60);
	timeData.seconds = seconds;
	return timeData;
}
function continueLink(theHitId) { return "https://www.mturk.com/mturk/continue?hitId=" + theHitId; }
function returnLink(theHitId) { return "https://www.mturk.com/mturk/return?hitId=" + theHitId + "&inPipeline=false"; }
function convertToSeconds(milliseconds,fixed) { fixed = fixed || 2; var seconds = parseFloat((milliseconds/1000.0 * 100) / 100).toFixed(fixed) + ""; return seconds.replace(/\.0*$/,""); }
function convertToMilliseconds(seconds) { if (seconds) return seconds*1000 + ""; else return "0"; }
function createDiv(theHtml) { var inner = (theHtml) ? theHtml : ""; return $('<div>').html(inner); }
function createSpan(theHtml) { var inner = (theHtml) ? theHtml : ""; return $('<span>').html(inner); }
function createButton(theText) { var inner = (theText) ? theText : ""; return $('<button>').html(inner); }
function createSelect(theId,theOptions) {
	var theSelect = $('<select>').attr({"id":theId});
	for (var i=0,len=theOptions.length; i<len; i++) { theSelect.append("<option value='" + theOptions[i] + "'>" + theOptions[i] + "</option>"); }
	return theSelect;
}
function createSelectNumbers(theId,first,min,max) {
	var buildArray = [first];
	for (var i=min; i<=max; i++) { buildArray.push(i); }
	return createSelect(theId,buildArray);
}
function parseVersionString (str) {
    var x = str.split('.');
    var maj = parseInt(x[0]) || 0; var min = parseInt(x[1]) || 0; var pat = parseInt(x[2]) || 0;
    return {"major": maj, "minor": min, "patch": pat};
}
(function($){ $.fn.disableSelection = function() { return this.attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false); }; })(jQuery);
function saveSessionData() { sessionStorage.setItem("JR_PC_QueueHelper",JSON.stringify(gQueueSessOptions)); }
function errorRequest(response) {
	if (response && response.error) { console.log("error: " + response.error); }
}
function requestUrl(theUrl, theFunction, theResponseType, acceptText) {
    theResponseType = theResponseType || ""; acceptText = acceptText || "text/html";
    GM_xmlhttpRequest({
        method: "GET",
        url: theUrl,
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "User-Agent": "Mozilla/5.0", "Accept": acceptText },
        responseType: theResponseType,
        onload: function(response) { if (typeof theFunction == 'function') theFunction(response); },
        onerror: function(response) { errorRequest(response); }
    });
}
function getLocalStorage() { // JR_TabTargetID | JR_PC_QReturnedHitId | JR_PC_QPrevHitId | JR_PC_QPrevTitle || JR_PC_QPrevMode
	var savedTabTarget = JSON.parse(sessionStorage.getItem('JR_TabTargetID')) || null;
	if (!savedTabTarget || gLocation.indexOf("&newSession=yes") != -1) sessionStorage.setItem('JR_TabTargetID',JSON.stringify(gTabTarget));
	else gTabTarget = savedTabTarget;
	gThisTarget = gTabTarget.tabId + "_" + gScriptID;
	gReturnedHitID = sessionStorage.getItem("JR_PC_QReturnedHitId") || ""; gPrevHit = sessionStorage.getItem('JR_PC_QPrevHitId') || "";
	gPrevTitle = sessionStorage.getItem('JR_PC_QPrevTitle') || ""; gPrevMode = sessionStorage.getItem('JR_PC_QPrevMode') || "";
    sessionStorage.removeItem('JR_PC_QPrevHitId'); sessionStorage.removeItem('JR_PC_QPrevTitle');
	sessionStorage.removeItem("JR_PC_QReturnedHitId"); sessionStorage.removeItem("JR_PC_QPrevMode");
	gQueueSessOptions = JSON.parse(sessionStorage.getItem('JR_PC_QueueHelper')) || null;
}
function loadAllData() {
	var timeNow = Math.floor(new Date().getTime() / 1000), storageKeys = Object.keys(localStorage);
	for (i = 0; i < storageKeys.length; i++)   {
		if ( storageKeys[i].substring(0,9) == 'JR_QTabs_' ) {
			storageValue = JSON.parse(localStorage.getItem(storageKeys[i],null));
			if (storageValue) {
				if ( (timeNow - storageValue.seconds) > 8) localStorage.removeItem(storageKeys[i]); // Remove any tab info that is older than 8 seconds.
				else gTabHitIds[storageValue.tabId] = {"key":storageKeys[i], "groupId": storageValue.groupId, "hitId":storageValue.hitId, "assignmentId":storageValue.assignmentId};
			}
		}
	}
	gQueueNextHit = JSON.parse(sessionStorage.getItem('JR_queueOrder_hitID',null));
	if (!gQueueSessOptions) {
		sessionStorage.setItem("JR_PC_QueueHelper",JSON.stringify(gQueueSessOptionsDef));
		gQueueSessOptions = JSON.parse(sessionStorage.getItem('JR_PC_QueueHelper'));
	}
	doYourQueue();
	sessionStorage.removeItem("JR_queueOrder_hitID");
}
function checkNewMode() {
    var checkModeVar = "";
	if (gLocation.match(/mturk\.com\/projects\/.*\/tasks\/.*assignment_id.*$/) !== null) { checkModeVar = "hitPage"; } // found Hit page.
	else if (gLocation.match(/\/tasks.*JRPC\=nexthit.*/) !== null) { checkModeVar = "queuePageNextStart"; } // wants to go to next hit in queue.
	else if (gLocation.match(/\/tasks.*JRPC\=gohit[0-9]*/) !== null) { checkModeVar = "goToNum"; } // wants to go to a specific nummber in queue.
	else if (gLocation.match(/\/tasks.*JRPC\=lasthit.*/) !== null) { checkModeVar = "goLastHit"; } // wants to go to last hit in queue.
	else if (gLocation.match(/\/tasks.*JRPC\=monitornext.*/) !== null) { checkModeVar = "monitorQueue"; } // monitor queue data and go to first one accepted.
	else if (gLocation.match(/\/tasks.*JRPC\=openhits[0-9]/) !== null) { checkModeVar = "openHits"; } // wants to open first # hits in tabs if necessary.
	if (gLocation.match(/\/tasks.*from\_queue\=true.*/) !== null) { gFromQueue = true }
    if (checkModeVar!=="") return checkModeVar; else return null;
}
function getTimeLeft(theTime) {
    if (theTime) {
        var tempArray = (theTime.indexOf("second") != -1) ? theTime.split("second")[0].trim().split(" ") : null;
		var seconds = (tempArray) ? tempArray[tempArray.length-1] : "0";
		tempArray = (theTime.indexOf("minute") != -1) ? theTime.split("minute")[0].trim().split(" ") : null;
		var minutes = (tempArray) ? tempArray[tempArray.length-1] : "0";
		tempArray = (theTime.indexOf("hour") != -1) ? theTime.split("hour")[0].trim().split(" ") : null;
		var hours = (tempArray) ? tempArray[tempArray.length-1] : "0";
		tempArray = (theTime.indexOf("day") != -1) ? theTime.split("day")[0].trim().split(" ") : null;
		var days = (tempArray) ? tempArray[tempArray.length-1] : "0";
		tempArray = (theTime.indexOf("week") != -1) ? theTime.split("week")[0].trim().split(" ") : null;
		var weeks = (tempArray) ? tempArray[tempArray.length-1] : "0";
		return( {"weeks":weeks,"days":days,"hours":hours,"minutes":minutes,"seconds":seconds} );
    } else return null;
}
function clearOldTabMessages() {
	var storageKeys = Object.keys(localStorage);
	for (i = 0; i < storageKeys.length; i++)   {
		if (storageKeys[i].substring(0,14) == 'JR_message_TAB' &&  storageKeys[i].substr(storageKeys[i].length - gScriptName.length) == gScriptName) {
			localStorage.removeItem(storageKeys[i]);
		}
	}
}
function createMessageData(command,data,target,idNum,tabNum) { return {"time":(new Date().getTime()),"command":command,"data":data,"theTarget":target,"idNum":idNum,"tabNum":tabNum}; }
function createHitData(targetHit,idNum,prevId) { return {"targetHit":targetHit,"idNum":idNum,"prevId":prevId}; }

function setQueueHitMessage(target,idNum,targetHit,prevId) {
		sessionStorage.setItem("JR_queueOrder_hitID", JSON.stringify(createHitData(targetHit,idNum,prevId))); }
function sendSubmittedMessage(target,thisHitID,idNum) { localStorage.setItem("JR_message_" + gScriptName,
		JSON.stringify(createMessageData("submitted",{"hitId":thisHitID},target,idNum,null))); }
function sendReturnedMessage(target,thisHitID,idNum) { localStorage.setItem("JR_message_" + gScriptName,
		JSON.stringify(createMessageData("returned",{"hitId":thisHitID},target,idNum,null))); }
function setSessionData() {
	if ($("#JRPCQAdvSel").length) gQueueSessOptions.nextPosition = $("#JRPCQAdvSel").val();
	if ($("#JRPCQEasySel").val()=="Last") gQueueSessOptions.nextIsLast = true; else gQueueSessOptions.nextIsLast = false;
	if ($("#JRPCQSameSel").val()=="No") gQueueSessOptions.nextIsSame = false; else gQueueSessOptions.nextIsSame = true;
	if ($("#JRPCQMonitor").val()=="No") gQueueSessOptions.nextMonitor = false; else gQueueSessOptions.nextMonitor = true;
	saveSessionData();
}
function setupOptionsMenu() {
	var insideContent = $("#JR_QueueOptionsMenu");
	createDiv("Queue Options Window").css({"font-size":"22px","text-align":"center","margin":"8px 0"}).appendTo(insideContent);
	var optionsArea = createDiv("").css({"font-size":"14px","text-align":"left","padding":"0 10px","margin-top":"20px"}).appendTo(insideContent);
	createDiv(createSpan("Go to the ").append(createSelect("JRPCQEasySel",["First","Last","--"])).append(createSpan(" hit in the queue."))).appendTo(optionsArea);
	createDiv(createSpan("Go to the next hit at position ").css({}).append(createSelectNumbers("JRPCQAdvSel","--",1,24)).append(createSpan(" in the queue."))).appendTo(optionsArea);
	createDiv(createSpan("Go to the next hit with same description? ").css({}).append(createSelect("JRPCQSameSel",["No","Yes"]))).appendTo(optionsArea);
	createDiv(createSpan("Monitor Next at end of Queue? ").css({}).append(createSelect("JRPCQMonitor",["No","Yes"]))).appendTo(optionsArea);
	createButton("OK").css({"margin-top":"40px","margin-left":"10px"}).click(function() { toggleOptionsMenu(); }).appendTo(optionsArea);
	$("#JRPCQEasySel").val((gQueueSessOptions.nextPosition!="--") ? "--" : ((gQueueSessOptions.nextIsLast) ? "Last" : "First"));
	$("#JRPCQAdvSel").val(gQueueSessOptions.nextPosition);
	$("#JRPCQSameSel").val((gQueueSessOptions.nextIsSame) ? "Yes" : "No");
	$("#JRPCQMonitor").val((gQueueSessOptions.nextMonitor) ? "Yes" : "No");
	$("#JRPCQEasySel").change(function() { if ($(this).val()!="--") $("#JRPCQAdvSel").val("--"); else $("#JRPCQAdvSel").val("1"); setSessionData(); });
	$("#JRPCQAdvSel").change(function() { if ($(this).val()!="--") $("#JRPCQEasySel").val("--"); else $("#JRPCQEasySel").val("First"); setSessionData(); });
	$("#JRPCQSameSel").change(function() { setSessionData(); });
	$("#JRPCQMonitor").change(function() { setSessionData(); });
}
function toggleOptionsMenu() {
	toggleOptionsMenu.display = toggleOptionsMenu.display || false;
	toggleOptionsMenu.display = !toggleOptionsMenu.display;
	if (toggleOptionsMenu.display) $("#JR_QueueOptionsMenu").show();
	else $("#JR_QueueOptionsMenu").hide();
}
function doResultsJSON(theData) {
	var jobData = {}, jobDatas = [], projectData = {}, theResults = null;
	if ("tasks" in theData) {
		theResults = theData.tasks;
		for (var i=0,len=theResults.length; i<len; i++) {
			projectData = theResults[i].project;
			jobData = jQuery.extend(true, {}, gJobDataDefault);
			jobData.requesterName=projectData.requester_name; jobData.title=projectData.title; jobData.requesterId=projectData.requester_id;
			jobData.hitId=theResults[i].task_id; jobData.totalSeconds=projectData.assignment_duration_in_seconds; jobData.description=projectData.description;
			jobData.assignmentId=theResults[i].assignment_id; jobData.durationParsed=convertSecondsToTimeData(jobData.totalSeconds);
			jobData.duration=convertToTimeString(jobData.durationParsed); jobData.timeData=convertSecondsToTimeData(theResults[i].time_to_deadline_in_seconds);
			jobData.timeLeft=convertToTimeString(jobData.timeData); jobData.hitsAvailable=projectData.assignable_hits_count;
			jobData.pay=parseFloat(projectData.monetary_reward.amount_in_dollars).toFixed(2);
			jobData.continueURL="https://worker.mturk.com" + theResults[i].task_url; jobData.returnURL = ""; jobData.groupId=projectData.hit_set_id;
			jobDatas.push(jobData); jobData={};
		}
	}
	return jobDatas;
}
function setQueueGlobals() {
	gCurrentPostion = 0;
	if (gQueueData) {
		for (j=0,len=gQueueData.length;j<len;j++) {
			if (gQueueData[j].hitId == gHitId) gCurrentPostion = j+1; // find the currenthit position
		}
	}
}
function parseQueuePage(theResult,theNumber) {
	var theData = null, jsonReceived = (theResult.responseHeaders.indexOf("application/json") != -1) ? true : false;
	if (!jsonReceived) {
	} else {
		theData = theResult.response;
		gQueueData = doResultsJSON(theData);
		if (gScriptMode == "hitPage") {
			setQueueGlobals();
			document.title = "( " + gCurrentPostion + "/" + gQueueData.length + " ) " + gRequesterName + " :: " + gOriginalTitle; // Change title constantly for changes.
		}
	}
}
function doYourQueue() {
	while(gQueueData.length > 0) { gQueueData.pop(); }
	var queueStoreData = JSON.parse(localStorage.getItem("JR_QUEUE_StoreData")), returnValue=false;
	if (queueStoreData) { gQueueData = queueStoreData.queue; setQueueGlobals(); returnValue=true; }
	else requestUrl("https://worker.mturk.com/tasks?format=json", parseQueuePage, "json", "application/json" );
	return returnValue;
}
function inOtherTabs(hitId) {
	var lFoundIt=false;
	var checkForHit = function(key,value) {
		if (value.hitId == hitId && key != gTabTarget.tabId) lFoundIt = true;
	};
	$.each(gTabHitIds, checkForHit);
	return lFoundIt;
}
function findNextHitQueue(currentHitID,sameTitle,countCurrent) {
	if (!gQueueData || currentHitID === "") return null;
    sameTitle = sameTitle || "";
	var i=-1, skip=false, targetHit=null, lastHit=null, counter=0, nextPosition = (gQueueSessOptions.nextPosition=="--") ? -2 : parseInt(gQueueSessOptions.nextPosition);
	var getLast = (gQueueSessOptions.nextIsLast) ? true : ((nextPosition>gQueueData.length-1) ? true : false);
	for (j=0,len=gQueueData.length;j<len;j++) {
		if (gQueueData[j].hitId==currentHitID) gCurrentPostion = j+1; // find the currenthit position
		if (!targetHit) {
			if ( (countCurrent || gQueueData[j].hitId!=currentHitID) && gQueueData[j].hitId!=gSubmitHitID && gQueueData[j].hitId!=gReturnedHitID ) {
				counter++; lastHit = gQueueData[j];
				if ( !getLast && (sameTitle==="" || gQueueData[j].title==sameTitle) && (nextPosition==-2 || nextPosition==counter) ) { targetHit = gQueueData[j]; }
			}
		}
	}
	if (!targetHit && gQueueData.length>1 && (getLast || nextPosition>counter)) targetHit = lastHit;
	return targetHit;
}
function findTheNexthit(theQueue,queuePage) {
    var foundNextOne = null, theHitId = ""; // initialize variable to represent not found so stay on current hit.
	for (j=0,len=theQueue.length;j<len && !foundNextOne;j++) { // go through array of hits one by one.
        theHitId = (queuePage) ? theQueue[j].task_id : theQueue[j].hitId;
        if (!inOtherTabs(theHitId)) foundNextOne=theQueue[j]; // if not in other tabs then set up variable to next hit.
    }
    if (foundNextOne) { // was next hit found and not current hit?
        if (gScriptMode=="monitorQueue") speakThisNow("Hits in Queue. Going to first."); // alert user to a hit found.
        if (queuePage) window.location.replace("https://worker.mturk.com" + foundNextOne.task_url.replace("&ref=w_pl_prvw","&from_queue=true"));
        else window.location.replace(foundNextOne.continueURL.replace("&ref=w_pl_prvw","&from_queue=true"));
    } else {
        $("body").children("div,table").css("opacity","1"); // next hit not found or it's the current hit so just undim.
        if (gScriptMode=="monitorQueue") setTimeout( monitorQueue,(gPandaCrazyLives) ? 900 : 3000); // use a timer for interval and lessen chance of pre's if too fast.
    }
}
function queuePageNewStart() {
	var jobData = jQuery.extend(true, {}, gJobDataDefault);
    var queueDataDiv = $(".task-queue-header:first").next().find("div"); // look for the queue header div and put in variable.
    var reactInfoList = queueDataDiv[1].dataset.reactProps; // grab the list of hits in queue
	if (reactInfoList) { // was list found?
		var queueData = JSON.parse(reactInfoList).bodyData; // convert the list of hits into an array of objects.
        findTheNexthit(queueData, true);
	}
}
function setNextHit() {
	if (gSubmitButton && gSubmitButton.length===0) return;
	var targetHit = findNextHitQueue(gHitId, (gQueueSessOptions.nextIsSame) ? gTitle : "",false);
	if (!targetHit && gQueueSessOptions.nextIsSame) targetHit = findNextHitQueue(gHitId, "",false);
	if (targetHit && (gQueueSessOptions.nextIsSame || gQueueSessOptions.nextPosition!="--" || gQueueSessOptions.nextIsLast) ) { setQueueHitMessage(gThisTarget,gIdNum,targetHit,gHitId); }
}
function monitorQueue() {
    gPandaCrazyLives = doYourQueue();
	if (gQueueData!==null && gQueueData.length>0) { // found a hit in the queue.
        findTheNexthit(gQueueData, false);
	} else {
		setTimeout( monitorQueue,(gPandaCrazyLives) ? 900 : 3000); // use a timer for interval and lessen chance of pre's if too fast.
	}
}

if (gLocation.indexOf("worker.mturk.com") != -1) {
	getLocalStorage();
	if (gReturnedHitID !== "") {
		sendReturnedMessage(gThisTarget,gReturnedHitID,gIdNum); // Tell Panda Crazy that hit has been returned.
	}
	if (gPrevHit !== "" && $(".mturk-alert-content:contains('The HIT has been successfully submitted.')").length) { // Check if a hit was submitted.
		gSubmitHitID = gPrevHit; // set global submitted variable for use in getting next hit.
		sendSubmittedMessage(gThisTarget,gPrevHit,gIdNum); // send submitted message to Panda Crazy.
	}
	gScriptMode = checkNewMode();
	if (gScriptMode) {
		clearOldTabMessages(); loadAllData();
		window.onbeforeunload = function() {
			localStorage.removeItem("JR_QTabs_" + gThisTarget);
		};
		if (gScriptMode=="hitPage") {
			gPandaCrazyLives = doYourQueue();
			if ($(".btn-secondary:contains('Return')").length) { // only hit pages accepted will have a return button.
				$(".navbar-brand:first").after("<span style='margin-left:10px; font-size:11px;'>[ <a href='https://worker.mturk.com/tasks' style='color:cyan;'>Your HITs Queue</a> ]</span>");
				gGroupId = gLocation.split("/projects/")[1].split("/")[0]; // grab the current group id.
				gHitId = gLocation.split("/tasks/")[1].split("?")[0]; // grab the current hit id.
				gAssignmentId = gLocation.split("assignment_id=")[1].split("&")[0]; // grab the current session id.
				var returnDetect = function() {
					var returnCancelled = function() { sessionStorage.removeItem("JR_PC_QReturnedHitId"); };
					sessionStorage.setItem("JR_PC_QReturnedHitId",gHitId);
					setTimeout(returnCancelled ,800);
				};
				$(".btn-secondary:contains('Return')").closest("form").submit( returnDetect );
				if (gQueueNextHit && gPrevHit!=gHitId) {
					$("body").children("div,table").css("opacity","0.1");
					window.location.replace(gQueueNextHit.targetHit.continueURL.replace("&ref=w_pl_prvw","&from_queue=true"));
				} else {
					var nextTargetHit = null;
					if (inOtherTabs(gHitId)) {
						for (j=0,len=gQueueData.length;j<len && !nextTargetHit;j++) { // go through array of hits one by one.
							if (!inOtherTabs(gQueueData[j].hitId) && gQueueData[j].hitId != gPrevHit && Object.keys(gTabHitIds).length>0) nextTargetHit=gQueueData[j];
							// if not in other tabs then set up variable to next hit.
						}
						if (gFromQueue && nextTargetHit) {
							if (nextTargetHit.hitId != gHitId) window.location.replace(nextTargetHit.continueURL.replace("&ref=w_pl_prvw","&from_queue=true"));
						} else if (gQueueSessOptions && gQueueSessOptions.nextMonitor) {
                            window.location.replace("https://worker.mturk.com/tasks?JRPC=monitornext");
						} else window.location.replace("https://worker.mturk.com/tasks");
					} else {
						var projectDetailBar = $(".project-detail-bar"); // set variable to the detail bar to grab details.
						if (projectDetailBar.length) { // if found detail bar.
							var tempPrevDiv = projectDetailBar[0].getElementsByClassName("col-sm-4 col-xs-5");
							if (tempPrevDiv.length===0) tempPrevDiv = projectDetailBar[0].getElementsByClassName("col-md-6 col-xs-12");
							if (tempPrevDiv.length===0) tempPrevDiv = projectDetailBar[0].getElementsByClassName("col-xs-12");
							if (tempPrevDiv.length===0) tempPrevDiv = projectDetailBar[0].getElementsByClassName("p-l-xs");
							var reactInfo = (tempPrevDiv.length>0) ? tempPrevDiv[0].firstElementChild.dataset.reactProps : null;
							if (reactInfo) { reactInfo = JSON.parse(reactInfo).modalOptions; gRequesterName = reactInfo.requesterName; gTitle = reactInfo.projectTitle; }
						}
						sessionStorage.setItem("JR_PC_QPrevHitId",gHitId); sessionStorage.setItem("JR_PC_QPrevTitle",gTitle); // set local variables for previous hit and title
						localStorage.setItem("JR_QTabs_" + gThisTarget, JSON.stringify({"groupId": gGroupId, "hitId": gHitId,
							"assignmentId": gAssignmentId, "tabId": gTabTarget.tabId, "seconds": Math.floor(new Date().getTime() / 1000)}) );
						if (!gButtonSet) {
							gButtonSet = true;
							createDiv("Q").css({"position":"fixed","width":"10px","text-align":"right","height":"20px","top":"82px","right":"2px","float":"right","box-sizing":"content-box",
								"padding":"0px 3px","background-color":"black","color":"white","opacity": "0.3","cursor":"pointer","font-size":"11px","line-height":"13px",
								"font-family":"verdana, arial, sans-serif"}).disableSelection().click( toggleOptionsMenu ).appendTo("body");
							createDiv("").css({"position":"fixed","width":"400px","height":"200px","top":"90px","right":"20px","float":"right","background-color":"#eceadf",
								"border":"3px solid #000","line-height":"13px"}).attr({"id":"JR_QueueOptionsMenu"}).hide().appendTo("body");
							setupOptionsMenu();
						}
						var doQtabsSet = function() {
							gPandaCrazyLives = doYourQueue();
							if (gQueueData!==null) { // Has Queue Data been found?
								setQueueGlobals();
								document.title = "( " + gCurrentPostion + "/" + gQueueData.length + " ) " + gRequesterName + " :: " + gOriginalTitle; // Change title constantly for changes.
								localStorage.setItem("JR_QTabs_" + gThisTarget, JSON.stringify({"groupId": gGroupId, "hitId": gHitId,
									"assignmentId": gAssignmentId, "tabId": gTabTarget.tabId, "seconds": Math.floor(new Date().getTime() / 1000)}) );
								setNextHit();
							}
							setTimeout( doQtabsSet,(gPandaCrazyLives) ? 1000 : 3000);
						};
						setTimeout( doQtabsSet,(gPandaCrazyLives) ? 1000 : 3000);
					}
				}
			}
		} else if ( $(".no-result-row").length && gScriptMode != "monitorQueue") {

		} else if ( (gScriptMode=="queuePageNextStart" || gScriptMode=="monitorQueue") &&
				!$(".no-result-row").length) { // If not an empty queue and looking for next hit or monitoring queue.
			$("body").children("div,table").css("opacity","0.1"); // dim page and set to looking for next hit.
			gQueueSessOptions.nextPosition="--"; gQueueSessOptions.nextIsLast=false; gQueueSessOptions.nextIsSame=false; saveSessionData(); // reset options.
			queuePageNewStart();
		} else if (gScriptMode=="monitorQueue") { // wants to monitor empty queue for any new hits.
			$("h1:contains('Your HITs Queue'):first").append($("<span>").attr("class","1supportive-label").css({"font-size":"11px"}).html(" (Monitoring queue for a hit to open.)"));
			setTimeout( monitorQueue,(gPandaCrazyLives) ? 1000 : 3000); // use a timer for interval and lessen chance of pre's if too fast.
		} else if (gScriptMode=="goToNum" || gScriptMode=="goLastHit" || gScriptMode=="openHits") { // user looking for a specific hit in queue or the last one.
			$("body").children("div,table").css("opacity","0.1");
			var queueDataDiv = $(".task-queue-header:first").next().find("div"); // set variable to queue header div to find queue list.
			var reactInfoList = queueDataDiv[1].dataset.reactProps, positionNum = 1; // set queue list variable
			if (reactInfoList) {
				queueData = JSON.parse(reactInfoList).bodyData; // convert the list to an array of objects.
				if (gScriptMode=="openHits") {
					var numOpenHitsFirst = gLocation.split("JRPC=openhits")[1]; // find the open hits command to split it from the number.
					if (numOpenHitsFirst) numOpenHits = numOpenHitsFirst.match(/\d+/)[0]; // match the first number found and set variable to it.
					if (numOpenHits>1 && numOpenHits<=15) { // make sure the hit numbers is 2 to 15.
						var hitPosition = 2;
						var nowOpenHits = function() {
							window.open("https://worker.mturk.com" + queueData[hitPosition-1].task_url.replace("&ref=w_pl_prvw","&from_queue=true") + "&newSession=yes","_blank");
							hitPosition++; numOpenHits--;
							if (numOpenHits>1 && numOpenHits<queueData.length) setTimeout(nowOpenHits, 1870);
							else { window.location.replace("https://worker.mturk.com" + queueData[0].task_url.replace("&ref=w_pl_prvw","&from_queue=true")); window.focus(); }
						}
						nowOpenHits();
						positionNum = 0;
					}
				}
				if (gScriptMode=="goToNum") { // if looking for a specific position.
					var positionNumFirst = gLocation.split("JRPC=gohit")[1]; // find the go hit command to split it from the number.
					if (positionNumFirst) positionNum = positionNumFirst.match(/\d+/)[0]; // match the first number found and set variable to it.
					if (positionNum>0 && positionNum<26 && positionNum<=queueData.length) { // make sure the number is 1 to 25 and less than queue length.
						gQueueSessOptions.nextPosition = positionNum; gQueueSessOptions.nextIsLast=false; gQueueSessOptions.nextIsSame=false; // reset options to look for next position.
					} else gScriptMode="goLastHit";
				}
				if (gScriptMode=="goLastHit") { // if looking for last hit.
					positionNum = queueData.length; // set position number to the last hit in queue.
				    gQueueSessOptions.nextPosition="--"; gQueueSessOptions.nextIsLast=true; gQueueSessOptions.nextIsSame=false; // reset options to look for last hit.
				}
				saveSessionData(); // save the options for the next hit.
				if (positionNum>0)
					window.location.replace("https://worker.mturk.com" + queueData[positionNum-1].task_url.replace("&ref=w_pl_prvw","&from_queue=true")); // go to the hit at the position set.
			}
		}
    } else if (gLocation=="https://worker.mturk.com/" && gQueueSessOptions && gQueueSessOptions.nextMonitor) {
        window.location.replace("https://worker.mturk.com/tasks?JRPC=monitornext");
	} else {
		sessionStorage.setItem("JR_PC_QueueHelper",JSON.stringify(gQueueSessOptionsDef));
		sessionStorage.removeItem("JR_queueOrder_hitID");
	}
}
