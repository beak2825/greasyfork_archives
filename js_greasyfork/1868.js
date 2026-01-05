// ==UserScript==
// @name           Reddit highlight newest comments
// @description    Highlights new comments in a thread since your last visit 
// @namespace      https://greasyfork.org/users/98-jonnyrobbie
// @author         JonnyRobbie
// @include        /https?:\/\/((www|pay|[a-z]{2})\.)?reddit\.com\/r\/[a-zA-Z0-9_-]+\/comments\/.*/
// @version        1.5.7
// @downloadURL https://update.greasyfork.org/scripts/1868/Reddit%20highlight%20newest%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/1868/Reddit%20highlight%20newest%20comments.meta.js
// ==/UserScript==

/*-----settings-----*/
highlightBGColorB = 'AECDFF'; //background color of a highlighted newest comment
highlightBGColorA = 'E5EFFF'; //background color of a highlighted older comment
highlightHalf = 2 //[hours]; when the algorithm should interpolate exactly 0.5 between A and B
highlightBGBorder = '1px solid #CDDAF3'; //border style of a highlighted new comment
expiration = 432000000; //expiraton time in millisesonds; default is 5 days (432000000ms)
highlihhtBetterChild = true; //highlight child comment if it has better karma than its parent
highlightNegative = true;
    betterChildStyle = '3px solid'; //border of said comment
    betterChildStyleGradientA = '99AAEE';
    betterChildStyleGradientB = 'F55220';
	betterChildStyleGradientC = 'ad3429';
/*-----settings-----*/

/*
Changelog:
1.5.7
-expand subreddit names
1.5.6
-fix double UI when viewing thread as a mod
1.5.5
-now works on subdomains
-now works in subreddits with alphanumeric characters
-some minor style changes
1.5.4
-fixed not working
1.5.3
-fixed a bog which has caused the script to hkald when the comment was too young to display score
1.5.2
-some more fugs resulting from reddit changes
1.5.1
-fixed reddit changes
1.4.2
-tweaked some colors and timing
1.4.1
-added highlighting comment with negative karma
-added color shading dependent on the new comment age
-added an option to manually edit the time of the last thread visit
1.3.1
-Added expiration for localstorage, defaulted to 14 days. It won't grow indefinately now.
-Reduced the amount of console.log clutter
*/

haveGold = false; //inicialization

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function getThread() {
    console.log("Logging reddit comment highlight.");
    console.log("Fetching thread ID...");
    if (document.querySelector('[rel="shorturl"]') === null) {
        console.log("Not a comment thread. Aborting userscript...");
        return;
    }
	haveGold = hasClass(document.getElementsByTagName("body")[0], "gold") || hasClass(document.getElementsByTagName("body")[0], "moderatord");
	console.log("hasgold or is a mod: " + haveGold);
	purgeOldStorage(expiration);
    var threadID = "redd_id_" + document.querySelector('[rel="shorturl"]').href.substr(-6);
    console.log("Thread id: " + threadID);
    var lastVisit = localStorage.getItem(threadID);
    if (lastVisit === null) {
        console.log("Thread has not been visited yet. Creating localStorage...");
        localStorage.setItem(threadID, Date.parse(Date()));
    }
	else {
		var postMenu;
		postMenu = document.getElementById("siteTable").getElementsByClassName("flat-list")[0];
		if (!haveGold) {
			var timeDiff = Date.parse(Date()) - lastVisit;
			var goldBox = document.createElement("div");
				goldBox.className = "rounded gold-accent comment-visits-box";
				goldBox.style.marginLeft = "10px";
			var goldBoxTitle = document.createElement("div");
				goldBoxTitle.className = "title";
			var goldBoxLabel = document.createElement("span");
				goldBoxLabel.innerHTML = "Highlight comments posted since previous visit [hh:mm] ago:";
			var goldBoxInput = document.createElement("input");
				goldBoxInput.type = "text";
				goldBoxInput.style.margin = "auto 5px";
				goldBoxInput.style.width = "64px";
				goldBoxInput.id = "timeInput"
				goldBoxInput.value = padToTwo(Math.floor(timeDiff/(1000*3600))) + ":" + padToTwo(Math.floor(60*(timeDiff/(1000*3600) - Math.floor(timeDiff/(1000*3600)))));
			var goldBoxOK = document.createElement("input");
				goldBoxOK.type = "button";
				goldBoxOK.value = "OK";
				goldBoxOK.addEventListener("click", function(){timeSetBack(threadID, goldBoxInput);}, false)
				goldBox.appendChild(goldBoxTitle);
				goldBoxTitle.appendChild(goldBoxLabel);
				goldBoxTitle.appendChild(goldBoxInput);
				goldBoxTitle.appendChild(goldBoxOK);
			insertNodeAfter(goldBox, document.getElementsByClassName("commentarea")[0].getElementsByClassName("usertext")[0]);
		}
	}
	commentReg = /^https?:\/\/(www\.)reddit\.com\/r\/[a-zA-Z0-9_-]+\/comments\/[0-9a-z]+\/[0-9a-z_]+\/$/;
	isCommentPage = commentReg.test(document.URL);
    highlightComments(lastVisit, isCommentPage);
	console.log("Match for full comment page(" + document.URL + "): " + isCommentPage);
	if (isCommentPage == true) {
		console.log("Setting localStorage to now...");
		localStorage.setItem(threadID, Date.parse(Date()));
	} else
	{
		console.log("not a comment page")
	}
	permalinkReg = /^(https?:\/\/(www\.)reddit\.com\/r\/[a-zA-Z0-9_-]+\/comments\/[0-9a-z]+\/[0-9a-z_]+\/[0-9a-z]+)((\?context=([0-9])+)|\/)?$/;
	ispermalinkPage = permalinkReg.test(document.URL);
	if (ispermalinkPage == true) {
		var context = permalinkReg.exec(document.URL)[5];
		var nocontext = permalinkReg.exec(document.URL)[1];
		console.log("perma RegEx: " + nocontext)
		if (typeof context == 'undefined') {
			console.log("context not set");
			context = 0;
		}
		if (context > 5) {
			console.log("context greater than 5");
			context = 5;
		}
		console.log("permalink page...context " + context);
		addContext(context, permalinkReg.exec(document.URL)[1]);
	} else
	{
		console.log("not a permalink page");
	}
}

function addContext(context, nocontext) {
	var newSelect = document.createElement("select");
	var infobar = document.getElementsByClassName("commentarea")[0].getElementsByClassName("infobar")[0];
	newSelect.addEventListener("change", function(){window.location=nocontext + '?context=' + this.selectedIndex;}, false);
	var newOption;
	for (var c=0; c<=5; c++) {
		var newOption = document.createElement("option");
		if (c == context) {
			newOption.selected = "selected";
		}
		newOption.value = nocontext + "?context=" + c;
		newOption.innerHTML = "Context: " + c;
		newSelect.appendChild(newOption);
	}
	infobar.appendChild(newSelect);
}

function padToTwo(number) {
  if (number<=99) { number = ("0"+number).slice(-2); }
  return number;
}


function timeSetBack(threadID, textbox){
	console.log("setting time back");
	var timeBackArray = textbox.value.split(":")
	if (timeBackArray.length > 2) {
		alert("You have not entered a valid time");
		console.log("too many colons");
		return
	}
	var timeBack = parseInt(timeBackArray[0], 10) + (parseInt(timeBackArray[1], 10)/60)
	if (timeBack != null && isNumber(timeBack) == true) {
		var lastVisit = Date.parse(Date())-timeBack*3600000;
		if (lastVisit > localStorage.getItem(threadID)) alert("The time has been set lower than it was before. Please, refresh the page to properly display the changes.");
		localStorage.setItem(threadID, lastVisit);
		console.log("Setting localStorage " + threadID + " " + timeBack*3600000 + " ms back");
		highlightComments(lastVisit, true);
	}
}

function purgeOldStorage(difference) {
	var thisTime = Date.parse(Date());
	var total=0;
    for (var i=0;i<localStorage.length;i++) {
	    if (localStorage.key(i).substr(0,8)=="redd_id_" && parseInt(localStorage.getItem(localStorage.key(i)))+difference<thisTime) {
		    localStorage.removeItem(localStorage.key(i));
			total++;
			i=0;
		}
	}
	console.log(total + " localStorage older than " + difference + "ms has been removed");
}

function isProperThread() {
	return true;
}

function insertNodeAfter(node, sibling) {
	sibling.parentNode.insertBefore(node, sibling.nextSibling);
}

function highlightComments(lastVisit, isCommentPage) {
    console.log("Thread last visited in: " + lastVisit);
    comments = document.getElementsByClassName('comment');
    console.log("Comment count: " + comments.length);
	nowtime = Date.parse(Date());
	highlightHalf = Math.pow(0.5, (1/(-highlightHalf)));
    for(i=0; i<comments.length; i++) {
		if ((' ' + comments[i].className + ' ').indexOf(' deleted ') > -1) {continue;} //if the comment contains class 'deleted', skip this iteration
        var ctime = Date.parse(comments[i].childNodes[2].childNodes[0].getElementsByTagName('time')[0].getAttribute('title'));
		var scoreTag = comments[i].getElementsByClassName("tagline")[0].getElementsByClassName("unvoted");
		if (scoreTag.length > 0) {
		    scorechild = parseInt(scoreTag[0].innerHTML);
		} else {
		    scorechild = 0;
		}
		var scoreTag = comments[i].parentNode.parentNode.parentNode.getElementsByClassName("tagline")[0].getElementsByClassName("unvoted");
		if (scoreTag.length > 0) {
		    scoreparent = parseInt(scoreTag[0].innerHTML);
		} else {
		    scoreparent = 0;
		}
		var voted = comments[i].getElementsByClassName("midcol")[0].className;
		if (voted == "midcol likes") {
			scorechild++;
		} else if (voted == "midcol dislikes") {
			scorechild--;
		}
		var voted = comments[i].parentNode.parentNode.parentNode.getElementsByClassName("midcol")[0].className
		if (voted == "midcol likes") {
			scoreparent++;
		} else if (voted == "midcol dislikes") {
			scoreparent--;
		}
        if (parseInt(ctime) > parseInt(lastVisit) && haveGold == false) {
			usertextBody = comments[i].getElementsByClassName("usertext-body")[0];
			console.log("comment(" + i + "," + 0 + "): gradient(" + nowtime + "," + ctime + ") = " + getGradient(nowtime-ctime));
			usertextBody.style.backgroundColor = interpolateColor(highlightBGColorA, highlightBGColorB, getGradient(nowtime-ctime));
			usertextBody.style.sborder = highlightBGBorder;
        }
		
		
        if (scoreparent < scorechild && highlihhtBetterChild == true && comments[i].parentNode.parentNode.parentNode.className != "content") {
            comments[i].style.setProperty('border-left',betterChildStyle + " #" + betterChildStyleGradientA, 'important');
        }
		if (scorechild < 0 && highlightNegative == true) {
            comments[i].style.setProperty('border-left','1px solid #' + betterChildStyleGradientC, 'important');
        }
    }
	if (haveGold == true && isCommentPage == true) {highlightNew();}
	var goldSelect = document.getElementById("comment-visits");
	if (goldSelect != null) goldSelect.addEventListener("change", function(){console.log("changed highlighting");highlightNew();}, false);
	window.addEventListener("load", function(){console.log("window loaded, highlighting");highlightNew();}, false);
}

function highlightNew(){
	comments = document.getElementsByClassName("new-comment");
	console.log("gold " + comments.length + " new comments");
	nowtime = Date.parse(Date());
	highlightHalf = Math.pow(0.5, (1/(-highlightHalf)));
	for(i=0; i<comments.length; i++) {
		var titleDate;
		titleDate = comments[i].childNodes[2].childNodes[0].getElementsByTagName('time')[0].getAttribute('datetime')
		var ctime = Date.parse(titleDate);
		usertextBody = comments[i].getElementsByClassName("usertext-body")[0];
		console.log("comment(" + i + "," + 0 + "): gradient(" + nowtime + "," + ctime + ") = " + getGradient(nowtime-ctime));
		usertextBody.style.backgroundColor = interpolateColor(highlightBGColorA, highlightBGColorB, getGradient(nowtime-ctime));
		usertextBody.style.sborder = highlightBGBorder;
	}
}

function finalBGColor(ctime) {
	nowtime = Date.parse(Date());
	
}

function getGradient(time) {
	return Math.pow(highlightHalf, -(time/3600000));
}

function interpolateColor(minColor,maxColor,depth){
    function d2h(d) {return d.toString(16);}
    function h2d(h) {return parseInt(h,16);}
    if(depth == 0){
        return minColor;
    }
    if(depth == 1){
        return maxColor;
    }
    var color = "#";
        for(var i=0; i < 6; i+=2){
        var minVal = new Number(h2d(minColor.substr(i,2)));
        var maxVal = new Number(h2d(maxColor.substr(i,2)));
        var nVal = minVal + (maxVal-minVal) * depth;
        var val = d2h(Math.floor(nVal));
        while(val.length < 2){
            val = "0"+val;
        }
        color += val;
    }
    return color;
}

function formatDate(unixtime) {
    var t = new Date(unixtime);
    //return t.toString();
    return t.getDate() + "." + (t.getMonth()+1) + "." + t.getFullYear() + " " + (t.getUTCHours()+UTCDifference) + ":" + pad2(t.getMinutes()) + ":" + pad2(t.getSeconds()) + " " + timeZoneDesc;
}
function dateDifference(unixtime) {
    var diff = new Date();
    var unixtime2 = new Date(unixtime);
    var secDiff = (diff.getSeconds() - unixtime2.getSeconds());
    var minDiff = (diff.getMinutes() - unixtime2.getMinutes());
    var hourDiff = (diff.getHours() - unixtime2.getHours());
    var dayDiff = (diff.getDate() - unixtime2.getDate());
    var monthDiff = (diff.getMonth() - unixtime2.getMonth());
    var yearDiff = (diff.getFullYear() - unixtime2.getFullYear());
    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (secDiff < 0) {
        minDiff--;
        secDiff += 60;
    }
    if (minDiff < 0) {
        hourDiff--;
        minDiff += 60;
    }
    if (hourDiff < 0) {
        dayDiff--;
        hourDiff += 24;
    }
    if (dayDiff < 0) {
        monthDiff--;
        dayDiff += months[diff.getMonth()-2]; // -2 as the months array is zero-indexed too
    }
    if (monthDiff < 0) {
        yearDiff--;
        monthDiff += 12;
    }
    //console.log(yearDiff+' years, '+monthDiff+' months, '+dayDiff+' days');
    return (yearDiff == 0 ? "" : yearDiff + " years ") + (monthDiff == 0 ? "" : monthDiff + " months ") + (dayDiff == 0 ? "" : dayDiff + " days ") + (hourDiff == 0 ? "" : hourDiff + " hours ") + (minDiff == 0 ? "" : minDiff + " minutes ") + (secDiff == 0 ? "" : secDiff + " seconds");
    //return yearDiff + " years " + monthDiff + " months " + dayDiff + " days " + hourDiff + " hours " + minDiff + " minutes " + secDiff + " seconds";
}
function addCss(cssCode) {
//thanks for the function from this blog http://www.tomhoppe.com/index.php/2008/03/dynamically-adding-css-through-javascript/
    var styleElement = document.createElement("style");
    styleElement.type = "text/css";
    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = cssCode;
    } else {
        styleElement.appendChild(document.createTextNode(cssCode));
    }
    document.getElementsByTagName("head")[0].appendChild(styleElement);
}
function pad2(number) {
     return (number < 10 ? '0' : '') + number
}
getThread();