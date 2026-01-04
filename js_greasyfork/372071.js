// ==UserScript==
// @name     Sea of Thieves Game Status
// @namespace https://damien.deak.es
// @version  1.2
// @grant    GM_addStyle
// @author Damien Deakes
// @match https://www.seaofthieves.com/*
// @require https://cdnjs.cloudflare.com/ajax/libs/dompurify/1.0.8/purify.min.js
// @description Sea of Thieves in game clock, server status and current event
// @downloadURL https://update.greasyfork.org/scripts/372071/Sea%20of%20Thieves%20Game%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/372071/Sea%20of%20Thieves%20Game%20Status.meta.js
// ==/UserScript==


var link = window.document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://sotpirat.es/app.css';
document.getElementsByTagName("HEAD")[0].appendChild(link);

window.onload = function() {
	var lastKnownstatus = ("lastKnownstatus" in localStorage) ? localStorage.getItem("lastKnownstatus") : "";
	var x = document.getElementsByClassName("global-header-cta--preorder");
	var useNav = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? 0 : 1;
	//var currentVersion = chrome.runtime.getManifest().version;
	//localStorage.setItem("lastManifest", "0");

	var i;
	for (i = 0; i < x.length; i++) {
	    x[i].classList.add("statusContainer");
	    sanitizedHtml = '<div class="edgedbox"><div class="flexcontainer"><div class="left"><div id="dateandtime'+i+'" class="dateandtime"></div><div id="status'+i+'" class="faded"></div></div><div class="right"><div id="spinner"></div><div id="spinnerskull"></div><div class="iconspace" id="icon'+i+'" class="fadein"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" id="theicon'+i+'"></div></div></div><div class="bottom"><span id="divider'+i+'"><i></i></span><div class="extrainfo" id="extrainfo'+i+'"></div></div>';
	    x[i].innerHTML = DOMPurify.sanitize(sanitizedHtml);
	}


	function getStatus(day,hour) {
		var ingameday = String(day).replace(/\D/g,'');
		var ingamehour = String(hour).replace(/\D/g,'');
		var d = new Date();
		var currentHour = d.getHours();
		var lastingameCheck = ("lastingameCheck" in localStorage) ? localStorage.getItem("lastingameCheck") : 666;
		var lastrealCheck = ("lastrealCheck" in localStorage) ? localStorage.getItem("lastrealCheck") : 666;
		var lastManifest = ("lastManifest" in localStorage) ? localStorage.getItem("lastManifest") : 0;
		if (lastingameCheck === 666 || lastrealCheck === 666 ||  lastingameCheck !=  ingameday || lastrealCheck != currentHour) {
			console.log("Server Lookup");
			var statusUrl = "https://sotpirat.es/status/?ingamehour="+ingamehour+"&ingameday="+ingameday;
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('GET', statusUrl, true);
			xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
			    if(xmlhttp.status == 200) {
			        var obj = JSON.parse(xmlhttp.responseText);
			        localStorage.setItem("lastKnownstatus", JSON.stringify(obj));
			        updateStatus(obj.text,obj.link,obj.icon,obj.extrainfo);
			    } else {
				    var lastJson = JSON.parse(localStorage.getItem("lastKnownstatus"));
					updateStatus(lastJson.text,lastJson.link,lastJson.icon,lastJson.extrainfo);
			    }
			    localStorage.setItem("lastingameCheck", ingameday);
				localStorage.setItem("lastrealCheck", currentHour);
			}
			};
			xmlhttp.send(null);
		} else {
			var lastJson = JSON.parse(localStorage.getItem("lastKnownstatus"));
			updateStatus(lastJson.text,lastJson.link,lastJson.icon,lastJson.extrainfo);
		}

	}

	function updateStatus(text,link,icon,extra) {
		var testnewicon = icon.replace(/\W/g, '').substring(0, 50);
		var testoldicon = document.getElementById("theicon1").src.replace(/\W/g, '').substring(0, 50);
		var currentHtml = document.getElementById("status1").innerHTML;
		if(DOMPurify.sanitize(currentHtml) != DOMPurify.sanitize("<a href='"+link+"'>"+text+"</a>")) {
			sanitizedHtml = "<a href='"+link+"'>"+text+"</a>";
			document.getElementById("status1").innerHTML = DOMPurify.sanitize(sanitizedHtml);
		}
		if(DOMPurify.sanitize(icon) && DOMPurify.sanitize(testnewicon) != DOMPurify.sanitize(testoldicon)) {
			document.getElementById("theicon1").src = DOMPurify.sanitize(icon);
		}
		var currentExtra = document.getElementById("extrainfo1").innerHTML;
		if(currentExtra.replace(/\W/g, '') != extra.replace(/\W/g, '')) {
			document.getElementById("extrainfo1").innerHTML = DOMPurify.sanitize(extra);
			if(extra){
				document.getElementById("divider1").style.display = "block";
			} else {
				document.getElementById("divider1").style.display = "none";
			}
		}
	}



	function tickClock() {
		var d = new Date();
        var seconds = (d.getUTCHours() * 3600) + (d.getUTCMinutes() * 60) + d.getUTCSeconds();
        var day = Math.floor(seconds / 1440) % 30 + 1;
        var defaultOffset = 10;
        if("lastKnownstatus" in localStorage) {
	        var lastJson = JSON.parse(localStorage.getItem("lastKnownstatus"));
	        if(lastJson.dayoffset) {
		        var daysOffset = lastJson.dayoffset;
	        } else {
		        var daysOffset = defaultOffset;
	        }
        } else {
	        var daysOffset = defaultOffset;
        }
        day = (day + daysOffset);
        if (day > 30) {
            day -= 30;
        }
        switch (day) {
            case 1:
            case 21:
                day = day.toString() + 'st'
                break;
            case 2:
            case 22:
                day = day.toString() + 'nd'
                break;
            case 3:
            case 23:
                day = day.toString() + 'rd'
                break;
            default:
                day = day.toString() + 'th'
            }
            var hr = Math.floor((seconds % 1440) / 60);
            if (hr < 12) {
                if (hr == 0) {
                    hr = 12;
                }
                sanitizedHtml = hr + ':' + pad(seconds % 60) + 'am <span>('+day+' of Month)</span>';
                document.getElementById("dateandtime1").innerHTML = DOMPurify.sanitize(sanitizedHtml);
            }
            else {
                if (hr > 12) {
                    hr = hr - 12;
                }
                sanitizedHtml = hr + ':' + pad(seconds % 60) + 'pm <span>('+day+' of Month)</span>';
                document.getElementById("dateandtime1").innerHTML = DOMPurify.sanitize(sanitizedHtml);
            }
            getStatus(day,hr);
	};

	setInterval(tickClock,1000);

	function pad(n) {
        if (n < 10)
            return '0' + n.toString();
        else
            return n.toString();
    }

}