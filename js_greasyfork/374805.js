// ==UserScript==
// @name        JR Mturk Panda Crazy Helper Modified for Our Hit Stop
// @version     0.1.1-ourhitstop.com-c
// @namespace   https://greasyfork.org/users/6406
// @description A script add on for Panda Crazy sending commands to main script.
// @author      (JohnnyRS on mturkcrowd.com and mturkgrind.com) johnnyrs@allbyjohn.com
// @include     http*://worker.mturk.com/*
// @include    	http*://*mturkcrowd.com/threads/*
// @include		http*://*turkerhub.com/threads/*
// @include		http*://*mturkforum.com/showthread*
// @include		http*://*mturkforum.com/*threads/*
// @include		http*://*turkernation.com/showthread*
// @include     http*://*ourhitstop.com/forum/our-daily-hits-thread/*
// @include		http*://*hitnotifier.com/*
// @include		http*://www.reddit.com/r/HITsWorthTurkingFor*
// @exclude     http*://*mturk.com/mturk/findhits?*hit_scraper*
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/374805/JR%20Mturk%20Panda%20Crazy%20Helper%20Modified%20for%20Our%20Hit%20Stop.user.js
// @updateURL https://update.greasyfork.org/scripts/374805/JR%20Mturk%20Panda%20Crazy%20Helper%20Modified%20for%20Our%20Hit%20Stop.meta.js
// ==/UserScript==

var gScriptVersion = "0.3.9";
var gScriptName = "pandacrazy";
var gLocation = window.location.href, gNewSite=false, gHitNotifier;
var gConstantSearch = null;
var gJobDataDefault = {"requesterName":"","requesterId":"","groupId":"","pay":"","title":"","duration":"0","hitsAvailable":0,"timeLeft":"","totalSeconds":0,"hitId":"",
		"qual":"","continueURL":"","returnURL":"","durationParsed":{},"jobNumber":"-1","friendlyRName":"","friendlyTitle":"","assignedOn":"","description":"",
		"keywords":"","timeData":{},"assignmentID":"","hitSetID":"","secondsOff":-1,"goHam":false};

function createMessageData(command,data) { return {"time":(new Date().getTime()),"command":command,"data":data}; }
function sendCommandMessage(data) { localStorage.setItem("JR_message_" + gScriptName, JSON.stringify(data)); }
function createQueueData(length) { return {"queueLength":length}; }
function createProjectedData(earnings) { return {"projectedEarnings":earnings}; }
function createJobData(jobData) { return {"groupId":jobData.groupId,"title":jobData.title,"requesterName":jobData.requesterName,"requesterId":jobData.requesterId,
	"pay":jobData.pay,"duration":jobData.duration,"hitsAvailable":jobData.hitsAvailable}; }
function setAttributes(el, attrs) { for (var key in attrs) { el.setAttribute(key, attrs[key]); } }
function elementInit(theElement,theClass,theText,theStyle) {
	if (theClass) theElement.className = theClass; if (theText) theElement.textContent = theText; if (theStyle) theElement.style = theStyle; return theElement;
}
function createSpan(theClass,theText,theStyle) { var span = document.createElement("span"); return elementInit(span,theClass,theText,theStyle); }
function createSpanButton(toDo,theClass,theText,theBackgroundColor,theColor,theFontSize,addStyle) {
    var backgroundColor = (typeof theBackgroundColor != 'undefined') ? theBackgroundColor : "initial";
    var textColor = (typeof theColor != 'undefined') ? theColor : "initial", fontSize = (typeof theFontSize != 'undefined') ? theFontSize : "9px";
    var theButton = createSpan("nonselectable " + theClass,theText,"font-size:" + fontSize + "; padding:0px 2px; background-color:" + backgroundColor + "; color:" + textColor +
		"; border:2px groove darkgrey; cursor:default; margin:0px 1px;" + addStyle);
	if (toDo) theButton.addEventListener("click", function (e) { toDo(e); });
    return theButton;
}
function speakThisNow(thisText) {
    if('speechSynthesis' in window){
        var speech = new SpeechSynthesisUtterance(thisText);
        speech.lang = 'en-US';
        window.speechSynthesis.speak(speech);
    }
}
function locationForums() {
	if (gLocation.match(/.*(mturkcrowd|turkerhub|mturkforum|turkernation|ourhitstop|hitnotifier|reddit)\.com.*/)!==null) return true;
	else return false;
}
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
	returnString += formatTimeLeft(true,timeData.weeks,"week",false); returnString += formatTimeLeft(false,timeData.days,"day",timeData.weeks);
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
function convertToSeconds(milliseconds,fixed) { fixed = fixed || 2; var seconds = parseFloat((milliseconds/1000.0 * 100) / 100).toFixed(fixed) + ""; return seconds.replace(/\.0*$/,""); }
function convertToMilliseconds(seconds) { if (seconds) return seconds*1000 + ""; else return "0"; }

function sendMessageData(command,theData) {
	var messageData = createMessageData(command,theData);
	sendCommandMessage(messageData);
}
function sendQueueData(queueLength) { sendMessageData("queueData",createQueueData(queueLength)); }
function sendProjectedData(projectedEarnings) { sendMessageData("projectedEarnings",createProjectedData(projectedEarnings)); }
function sendJobData(jobData) { sendMessageData("addJob",createJobData(jobData)); }
function sendJobOnceData(jobData) { sendMessageData("addOnceJob",createJobData(jobData)); }
function sendJobSearchData(jobData) { sendMessageData("addSearchJob",createJobData(jobData)); }
function sendPingMessage() { localStorage.setItem("JR_message_ping_" + gScriptName, JSON.stringify({"command":"areYouThere","time":(new Date().getTime())})); }

function appendPandaButtons(element,jobData) {
	$(element).append($("<span>").css({"font-size":"9px"}).html("Add: ")
		.append($("<button>").html("Panda").css({"font-size":"10px","line-height":"10px","padding":"1px","color":"black"})
			.data("jobData",jobData).attr({"type":"button"})
			.click(function(e) { sendJobData($(e.target).data("jobData")); return false; }))
		.append($("<button>").html("Once").css({"font-size":"10px","line-height":"10px","padding":"1px","color":"black"})
			.data("jobData",jobData).attr({"type":"button"})
			.click(function(e) { sendJobOnceData($(e.target).data("jobData")); return false; }))
		.append($("<button>").html("Search").css({"font-size":"10px","line-height":"10px","padding":"1px","color":"black"})
			.data("jobData",jobData).attr({"type":"button"})
			.click(function(e) { sendJobSearchData($(e.target).data("jobData")); return false; }))
	);
}
function parseHitsInfo(reactInfo,finalUrl) {
	var jobData = jQuery.extend(true, {}, gJobDataDefault), projectData = ("project" in reactInfo) ? reactInfo.project : reactInfo;
        jobData.hitSetID = projectData.hit_set_id; jobData.hitsAvailable = projectData.assignable_hits_count;
        jobData.continueURL = ""; jobData.returnURL = ""; jobData.groupId = projectData.hit_set_id;
        jobData.requesterName = projectData.requester_name; jobData.requesterId = projectData.requester_id;
        jobData.totalSeconds = projectData.assignment_duration_in_seconds; jobData.timeData = convertSecondsToTimeData(jobData.totalSeconds);
        jobData.title = projectData.title; jobData.timeLeft = convertToTimeString(jobData.timeData);
        jobData.pay = parseFloat(projectData.monetary_reward.amount_in_dollars).toFixed(2);
        jobData.duration = jobData.timeLeft;
    return jobData;
}
function parseNewHitPageRequesters(projectDetailBar,finalUrl) {
	var jobData = jQuery.extend(true, {}, gJobDataDefault);
	var tempPrevDiv = projectDetailBar[0].getElementsByClassName("col-sm-4 col-xs-5");
	if (tempPrevDiv.length===0) tempPrevDiv = projectDetailBar[0].getElementsByClassName("col-md-6 col-xs-12"); // col-md-6 col-xs-12
	if (tempPrevDiv.length===0) tempPrevDiv = projectDetailBar[0].getElementsByClassName("col-xs-12"); // col-xs-12
	if (tempPrevDiv.length===0) tempPrevDiv = projectDetailBar[0].getElementsByClassName("p-l-xs");
	var reactInfo = (tempPrevDiv.length>0) ? tempPrevDiv[0].firstElementChild.dataset.reactProps : null;
	if (reactInfo) {
		reactInfo = JSON.parse(reactInfo).modalOptions;
		var contactRequesterUrl = reactInfo.contactRequesterUrl, contactVar = (contactRequesterUrl.indexOf("requester_id") != -1) ? "requester_id%5D=" : "requesterId=";
		jobData.hitsAvailable = reactInfo.assignableHitsCount; jobData.requesterName = reactInfo.requesterName; 
		jobData.groupId = finalUrl.split("/projects/")[1].split("/")[0]; jobData.hitSetID = jobData.groupId;
		if (finalUrl.indexOf("assignment_id")!=-1) {
			jobData.hitId = finalUrl.split("/tasks/")[1].split("?")[0]; jobData.assignmentId = finalUrl.split("assignment_id=")[1].split("&")[0];
			jobData.continueURL = finalUrl;
		} else { jobData.hitId = ""; jobData.assignmentId = ""; jobData.continueURL = ""; }
		jobData.returnURL = "";
		var tempContact = contactRequesterUrl.split(contactVar); if (tempContact.length) jobData.requesterId = contactRequesterUrl.split(contactVar)[1].split("&")[0];
		jobData.totalSeconds = reactInfo.assignmentDurationInSeconds; jobData.timeData = convertSecondsToTimeData(jobData.totalSeconds); jobData.title = reactInfo.projectTitle;
		jobData.timeLeft = convertToTimeString(jobData.timeData); jobData.pay = parseFloat(reactInfo.monetaryReward.amountInDollars).toFixed(2);
		jobData.duration = jobData.timeLeft;
	}
	return jobData;
}
function findProjectedEarnings() {
	// find if Projected Earnings scripts are installed and get info.
	var spanEarnings = null, earnings = "";
	if ( ($(".me-bar").length ) ) {
		spanEarnings = $(".me-bar:first").find("span:contains('Earnings:'):first");
		if (spanEarnings) earnings = $(spanEarnings).next("a").text();
		sendProjectedData(earnings.replace("$",""));
	}
}
function pcContainer(thisGroupId,thisRequesterName,thisRequesterId,thisTitle,thisReward) {
	var thisContainer = $(createSpan("PCSpanButtons","","")).append(document.createTextNode(" [PC] Add: "))
		.append($(createSpanButton(function(e) { window.open("https://worker.mturk.com/requesters/PandaCrazyAdd/projects?JRGID=" + thisGroupId + "&JRRName=" +
			thisRequesterName + "&JRRID=" + thisRequesterId + "&JRTitle=" + thisTitle + "&JRReward=" + thisReward, 
			"PandaCommand", "height=200,width=200"); },"","Panda", "lightgrey","red","11px")))
		.append($(createSpanButton(function(e) { window.open("https://worker.mturk.com/requesters/PandaCrazyOnce/projects?JRGID=" + thisGroupId + "&JRRName=" + 
			thisRequesterName + "&JRRID=" + thisRequesterId + "&JRTitle=" + thisTitle + "&JRReward=" + thisReward, 
			"PandaCommand", "height=200,width=200"); },"","Once", "lightgrey","red","11px")))
		.append($(createSpanButton(function(e) { window.open("https://worker.mturk.com/requesters/PandaCrazySearch/projects?JRGID=" + thisGroupId + "&JRRName=" + 
			thisRequesterName + "&JRRID=" + thisRequesterId + "&JRTitle=" + thisTitle + "&JRReward=" + thisReward, 
			"PandaCommand", "height=200,width=200"); },"","Requester", "lightgrey","red","11px")));
	return thisContainer;
}
function format1(foundUrl,thisNode) {
	var thisGroupId="", thisRequesterName="", thisRequesterId="", thisTitle="", thisReward="";
	var grabbedUrl = foundUrl.attr("href"); var newWorkerSite = (grabbedUrl.indexOf("worker.mturk.com") != -1) ? true : false;
	if (newWorkerSite) thisGroupId = grabbedUrl.split("/projects/")[1].split("/tasks")[0];
	else thisGroupId = grabbedUrl.split("groupId=")[1].split("&")[0];
	thisRequesterName = escape($(thisNode).find("b:contains('Requester:')").next("a").text().trim());
	thisRequesterId = ($(thisNode).find("b:contains('Requester:')").next("a")).get(0).nextSibling.nodeValue.trim();
	thisRequesterId = thisRequesterId.split("]")[0].replace("[","").replace("]","");
	var bTitle = $(thisNode).find("b:contains('Title:')");
	thisTitle = escape($(thisNode).find("b:contains('Title:')").next("a").text().trim());
	thisReward = escape($(thisNode).find("b:contains('Reward:')").next("span, font").text().trim().replace("$",""));
	if (thisReward==="") thisReward = escape($(thisNode).find("b:contains('Reward:')").get(0).nextSibling.nodeValue.trim().replace("$",""));
	return {"GID":thisGroupId,"RID":thisRequesterId,"RName":thisRequesterName,"Title":thisTitle,"Reward":thisReward};
}
function format2(foundUrl,thisNode) {
	var thisGroupId="", thisRequesterName="", thisRequesterId="", thisTitle="", thisReward="";
	thisGroupId = $(foundUrl).attr("href").split("/projects/")[1].split("/tasks/")[0];
	thisRequesterName = escape($(thisNode).find("a[href*='worker.mturk']:first").text().trim());
	thisRequesterId = $(thisNode).find("span:first").text().trim();
	thisRequesterId = thisRequesterId.split("]")[0].replace("[","").replace("]","");
	thisTitle = $(thisNode).find("i").text().trim();
	var rewardIndex = thisTitle.lastIndexOf("-");
	if (rewardIndex) thisReward = thisTitle.substr(rewardIndex+2).replace("$","").trim();
	if (rewardIndex) thisTitle = escape(thisTitle.substr(0, rewardIndex).trim());
	return {"GID":thisGroupId,"RID":thisRequesterId,"RName":thisRequesterName,"Title":thisTitle,"Reward":thisReward};
}
function format3(foundUrl,thisNode) {
	var thisGroupId="", thisRequesterName="", thisRequesterId="", thisTitle="", thisReward="";
	var turkerviewNode = $(thisNode).find("a[href*='/requesters/']");
	thisGroupId = $(foundUrl).attr("href").split("/projects/")[1].split("/tasks")[0];
	thisRequesterName = escape($(thisNode).find("a[href*='worker.mturk.com/requesters']").get(0).previousSibling.nodeValue.slice(0, -2).trim().replace("Requester: ",""));
	if (!thisRequesterName) thisRequesterName = $(turkerviewNode).text();
	thisRequesterId = $(turkerviewNode).attr("href").split("/requesters/")[1].split("/")[0];
	thisTitle = escape($(thisNode).find("a:first").text().trim());
	if (!thisTitle) thisTitle = escape($(thisNode).find("a:first").get(0).previousSibling.nodeValue.slice(0, -2).trim());
	thisReward = escape($(thisNode).find("b:contains('Reward:')").get(0).nextSibling.nodeValue.trim().replace("$",""));
	return {"GID":thisGroupId,"RID":thisRequesterId,"RName":thisRequesterName,"Title":thisTitle,"Reward":thisReward};
}
function addMessageButtons(thisMessage) {
	var myContainer=null, thisGroupId="", thisRequesterName="", thisRequesterId="", thisTitle="", thisReward="", jobData = null;
	var firstNode = $(thisMessage).find(".ctaBbcodeTableRowTransparent, table.cms_table, table.text_table");
	if (gLocation.indexOf("mturkforum.com") != -1) firstNode = $(thisMessage).find("table");
	if (firstNode.length) {
		$(firstNode).each( function() {
			var theAcceptUrl = $(this).find("a:contains('Accept')"), format=1, grabbedUrl = "";
			if (!theAcceptUrl.length) { format=2; theAcceptUrl = $(this).find("a:contains('PANDA')"); }
			if (theAcceptUrl.length) {
				jobData = format1(theAcceptUrl,this);
				myContainer = pcContainer(jobData.GID,jobData.RName,jobData.RID,jobData.Title,jobData.Reward);
				var newWorkerSite = ($(theAcceptUrl).attr("href").indexOf("worker.mturk.com") != -1) ? true : false;
				var contactLinkFound = ($(this).find("a:contains('Contact')").length) ? true : false;
				var requesterLinkFound = ($(this).find("a:contains('Requester')").length) ? true : false;
				if ($(this).find("a:contains('Req TV')").length) $(this).find("a:contains('Req TV'):first").next("b").after($(myContainer));
				else if ($(this).find("a[href*='turkerview.com/requesters/']").length) $(this).find("a:contains('Contact'):first").after($(myContainer));
				else if (requesterLinkFound) $(this).find("a:contains('Requester'):first").after($(myContainer));
				else if (contactLinkFound && newWorkerSite && format==1) $(this).find("a:contains('Contact'):first").after($(myContainer));
				else if (contactLinkFound && $(this).find("a[href*='turkopticon']").length) $(this).find("a[href*='turkopticon']:first").prev().before($(myContainer));
				else if ($(this).find("b:contains('TO Ratings:')").length) $(this).find("b:contains('TO Ratings:')").prev("br").before($(myContainer));
			}
		});
	} else if ($(thisMessage).find(".vw-div:first").length) {
		var vwDiv = $(thisMessage).find(".vw-div:first");
		if (vwDiv.length && $(thisMessage).find("a:contains('PANDA')").length) {
			jobData = format2($(thisMessage).find("a:contains('PANDA')"),thisMessage);
			myContainer = pcContainer(jobData.GID,jobData.RName,jobData.RID,jobData.Title,jobData.Reward);
			$(vwDiv).prev().append(myContainer);
		}
	} else if ($(thisMessage).find("a[href*='turkerview.com/requesters/']").length || $(thisMessage).find("b:contains('TurkerView:')").length) {
		var thisOne = $(thisMessage);
		if ($(thisMessage).find(".quoteContainer").length) thisOne = $(thisMessage).find(".quoteContainer");
		jobData = format3($(thisOne).find("a:first"),thisOne);
		myContainer = pcContainer(jobData.GID,jobData.RName,jobData.RID,jobData.Title,jobData.Reward);
		if ($(thisOne).find("a:contains('Req TV')").length) $(thisOne).find("a:contains('Req TV'):first b:first").after(myContainer);
		else if ($(thisOne).find("b:contains('TurkerView')").length) $(thisOne).find("b:contains('TurkerView'):first").prev().before(myContainer);
		else $(thisOne).find("a[href*='/requesters/']:first").prev().before(myContainer);
	}
	$(thisMessage).addClass("JRDoneButtonized");
}
function addPageButtons() {
	$("blockquote:not('.quoteContainer, .JRDoneButtonized'), .card:not('.col-10'), #hit, .text_table_:not(.JRDoneButtonized)").each( function() { addMessageButtons(this); });
}

function mainListener(e) {
	if ( e.key == 'JR_message_pong_' + gScriptName && e.newValue && gLocation == (JSON.parse(e.newValue).url)) {
		window.removeEventListener("storage", mainListener, false);
		var noHitsError = ($("td.error_title:contains('There are currently no HITs assigned to you.')").length > 0), buttonPosition=null;
		var noHitsAlert = ($("#alertboxHeader:contains('There are currently no HITs assigned to you.')").length > 0);
		var returnedAlert = ($("#alertboxHeader:contains('The HIT has been returned.')").length > 0);
		if ( gLocation.indexOf("worker.mturk.com") != -1 ) {
            var projectDetailBar = $(".project-detail-bar"), requestersInfo={};
            var mturkAlertDanger = $(".mturk-alert-danger");
            if (mturkAlertDanger.length && $(mturkAlertDanger).find(".mturk-alert-content:contains('There are no more of these HITs available')")) {
				var savedGID = GM_getValue("JRHoldGID"), savedRID = GM_getValue("JRHoldRID"), savedRName =  GM_getValue("JRHoldRName"),
					savedTitle =  GM_getValue("JRHoldTitle"), savedReward = GM_getValue("JRHoldReward");
				if (savedGID && savedGID!=="" &&
						$("button:contains('Accept'), button:contains('Return'), .mturk-alert-content:contains('This HIT requires Qualifications')").length === 0) {
					$(mturkAlertDanger).find(".p-b-0").append($("<span>").attr({"class":"JR_PandaCrazy"}).css({"font-size":"10px","margin-left":"10px"}).html("[PC] "));
					var thisJobData = jQuery.extend(true, {}, gJobDataDefault);
					thisJobData.groupId = savedGID; thisJobData.requesterId = savedRID || ""; thisJobData.requesterName = savedRName || "";
					thisJobData.title = savedTitle || ""; thisJobData.pay = savedReward || "";
					appendPandaButtons($(mturkAlertDanger).find(".JR_PandaCrazy:first"),thisJobData);
				}
			}
			GM_deleteValue("JRHoldGID"); GM_deleteValue("JRHoldRID"); GM_deleteValue("JRHoldRName"); GM_deleteValue("JRHoldTitle"); GM_deleteValue("JRHoldReward");
            if (projectDetailBar.length) {
				requestersInfo = parseNewHitPageRequesters(projectDetailBar,gLocation);
				buttonPosition = $(".task-project-title:first").parent().parent().parent();
				$(buttonPosition).append($("<span>").attr({"class":"JR_PandaCrazy"}).css({"font-size":"9px","margin-left":"10px"}).html("[PC] "));
				appendPandaButtons($(".JR_PandaCrazy:first"),requestersInfo);
            } else {
				var projectsControls = $(".row.projects-info-header, .row.task-queue-header");
				if (projectsControls.length) {
					var tempPrevDiv = $(projectsControls[0]).next().find(".col-xs-12:first");
					var reactInfo = tempPrevDiv.find("div:first").data("reactProps");
					reactInfo = reactInfo.bodyData;
					$(tempPrevDiv).find(".table-row").bind("DOMSubtreeModified", function() {
						if ($(this).find(".expanded-row").length) {
							if (!$(this).data("JR-expandedDesc")) {
								$(this).data({"JR-expandedDesc":"true"});
								var reactIDString = $(this).data("reactid");
								var reactID = reactIDString.split("$")[1];
								var thisJobData=parseHitsInfo(reactInfo[reactID]);
								$(this).find(".p-b-md,.task-info-column").append($("<div>").attr({"class":"JR_PandaCrazy"})
									.css({"font-size":"10px","margin-left":"10px"}).html("[PC] "));
								appendPandaButtons($(this).find(".JR_PandaCrazy:first"),thisJobData);
							}
						} else { $(this).removeData("JR-expandedDesc"); }
					});
				}
            }
			setTimeout( findProjectedEarnings,900 );
		}
	}
}
function fixJson(theNode) { // only used to fix hitscraper.
	$(theNode).find("a[href*='/projects/']").each( function() {
		$(this).attr("href",$(this).attr("href").replace(".json",""));
	});
}
function holdGIDLinks(theNode) {
	document.onclick = function(event) {
		if (event===undefined) event= window.event;
		var target= 'target' in event? event.target : event.srcElement, secondPart = "", jobData = null;
		if (target.tagName == "A" && target.href.indexOf("/projects/")) {
			if ($(target).closest("td.ctaBbcodeTableCellLeft").length) jobData = format1($(target),$(target).closest("td.ctaBbcodeTableCellLeft"));
			else if ($(target).closest("td.cms_table_td").length) jobData = format1($(target),$(target).closest("td.cms_table_td"));
			else if (gLocation.indexOf("mturkforum.com") != -1) jobData = format1($(target),$(target).closest("td"));
			else if ($(target).closest("blockquote.messageText").length) jobData = format2($(target),$(target).closest("blockquote.messageText"));
			else if ($(target).closest("a[href*='turkerview.com/requesters/']").length) jobData = format3($(target),$(target).closest("a[href*='turkerview.com/requesters/']"));
			else if ($(target).find("b:contains('TurkerView:')").length) jobData = format3($(target),$(target).find("b:contains('TurkerView:')"));
			else {
				secondPart = target.href.split("/projects/")[1]; var thisGID = (secondPart) ? secondPart.split("/")[0] : "";
				jobData = {"GID":thisGID,"RID":"","RName":"","Title":"","Reward":""};
			}
			if (jobData.GID!=="") {
				GM_setValue("JRHoldGID",jobData.GID);
				GM_setValue("JRHoldRID",jobData.RID);
				GM_setValue("JRHoldRName",unescape(jobData.RName));
				GM_setValue("JRHoldTitle",unescape(jobData.Title));
				GM_setValue("JRHoldReward",unescape(jobData.Reward));
			}
		}
	};
}
function setUpObserver(theNode,addButtons,jsonFix,hitnotifier) {
	var targetObserveNode = theNode;
	var config = { childList: true };
	var callback = function(mutations) {
		for (var index = 0,len=mutations.length; index < len; index++) {
			var thisMutationNode = mutations[index].addedNodes;
			for (var index2 = 0,len2=thisMutationNode.length; index2 < len2; index2++) {
				if (addButtons) addMessageButtons(thisMutationNode[index2]);
				if (jsonFix) fixJson(thisMutationNode[index2]);
			}
		}
		if (hitnotifier) addMessageButtons($("#hit"));
	};
	var observer = new MutationObserver(callback);
	observer.observe(targetObserveNode, config);
}
if (locationForums()) {
	setTimeout( function() { 
		holdGIDLinks($("body"));
		addPageButtons();
		if ($("#messageList").length) { // forums
			setUpObserver($("#messageList")[0],true,false,false);
		} else if (gLocation.indexOf("hitnotifier.com") != -1) { // hitnotifier
			setUpObserver($("#accordion")[0],true,false,true);
		} else if ($('#vb-page-body').length) { // ourhitstop
            setInterval(addPageButtons, 1000);
        }
	}, (gLocation.indexOf("hitnotifier.com") != -1) ? 1000 : 600);
} else {
	$(function() {
		if (gLocation.indexOf("worker.mturk.com") != -1) gNewSite = true;
		if (gLocation.indexOf("worker.mturk.com/requesters/PandaCrazy") != -1) {
			var sendFormat = (gLocation.indexOf("PandaCrazyAdd") != -1) ? 1 : (gLocation.indexOf("PandaCrazyOnce") != -1) ? 2 : (gLocation.indexOf("PandaCrazySearch") != -1) ? 3 : 0;
			if (sendFormat>0) {
				var jobData = jQuery.extend(true, {}, gJobDataDefault);
				if ( gLocation.indexOf("JRGID=") != -1) jobData.groupId = gLocation.split("JRGID=")[1].split("&")[0];
				if ( gLocation.indexOf("JRRID=") != -1) jobData.requesterId = gLocation.split("JRRID=")[1].split("&")[0];
				if ( gLocation.indexOf("JRRName=") != -1) jobData.requesterName = unescape(gLocation.split("JRRName=")[1].split("&")[0]);
				if ( gLocation.indexOf("JRTitle=") != -1) jobData.title = unescape(gLocation.split("JRTitle=")[1].split("&")[0]);
				if ( gLocation.indexOf("JRReward=") != -1) jobData.pay = unescape(gLocation.split("JRReward=")[1].split("&")[0]);
				if (sendFormat==1) sendJobData(jobData);
				else if (sendFormat==2) sendJobOnceData(jobData);
				else sendJobSearchData(jobData);
				setTimeout( function() { window.top.close(); },300);
			}
		} else if (gLocation.indexOf("mturk.com/") != -1) {
			holdGIDLinks($("body"));
			if ( !$(".navbar-sub-nav.navbar-nav:contains('Your HITs Queue')").length ) {
				$(".nav.navbar-nav.hidden-xs-down:not(:contains('HITs Queue'))").append('<li class="nav-item"><a class="nav-link" href="https://worker.mturk.com/tasks">HITs Queue</a></li>');
			}
			if ( gLocation.indexOf("/tasks") == -1 && $("button:contains('Return')").length ) {
				$(".col-xs-12.navbar-content a.navbar-brand:first").after("<div class='navbar-divider hidden-xs-down'></div><ul class='nav navbar-nav hidden-xs-down'><li class='nav-item'><a class='nav-link' style='color:white;' href='https://worker.mturk.com/tasks'>HITs Queue</a></li></ul>");
			}
			window.addEventListener("storage", mainListener, false);
			setTimeout( function() { sendPingMessage(); }, 500);
		}
	});
}