// ==UserScript==
// @name         Sea of Thieves Status
// @namespace    sotclock
// @version      0.3
// @description  Add in game clock and status and event messages to Sea of Thives website.
// @author       Damien Deakes
// @match        https://seaofthieves.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371806/Sea%20of%20Thieves%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/371806/Sea%20of%20Thieves%20Status.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lastKnownstatus = ("lastKnownstatus" in localStorage) ? localStorage.getItem("lastKnownstatus") : "";
	var x = document.getElementsByClassName("global-header-cta--preorder");
	var useNav = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? 0 : 1;
	var i;
	for (i = 0; i < x.length; i++) {
	    x[i].classList.add("statusContainer");
	    x[i].innerHTML = '<div class="edgedbox"><div class="flexcontainer"><div class="left"><div id="dateandtime'+i+'" class="dateandtime"></div><div id="status'+i+'" class="faded"></div></div><div class="right"><div id="spinner"></div><div id="spinnerskull"></div><div class="iconspace" id="icon'+i+'" class="fadein"></div></div></div><div class="bottom"><span id="divider'+i+'"><i></i></span><div class="extrainfo" id="extrainfo'+i+'"></div></div>';
	}

	function getStatus(day,hour) {
		var ingameday = String(day).replace(/\D/g,'');
		var ingamehour = String(hour).replace(/\D/g,'');
		var d = new Date();
		var currentHour = d.getHours();
		var lastingameCheck = ("lastingameCheck" in localStorage) ? localStorage.getItem("lastingameCheck") : 666;
		var lastrealCheck = ("lastrealCheck" in localStorage) ? localStorage.getItem("lastrealCheck") : 666;
		if (lastingameCheck === 666 || lastrealCheck === 666 ||  lastingameCheck !=  ingameday || lastrealCheck != currentHour) {
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
		var testoldicon = document.getElementById("icon1").innerHTML.replace(/\W/g, '').substring(0, 50);
		var currentHtml = document.getElementById("status1").innerHTML;
		if(currentHtml != "<a href='"+link+"'>"+text+"</a>") {
			document.getElementById("status1").innerHTML = "<a href='"+link+"'>"+text+"</a>";
		}
		if(icon && testnewicon != testoldicon) {
			document.getElementById("icon1").innerHTML = "<img src='"+icon+"'>";
		}
		var currentExtra = document.getElementById("extrainfo1").innerHTML;
		if(currentExtra != extra) {
			document.getElementById("extrainfo1").innerHTML = extra;
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
                document.getElementById("dateandtime1").innerHTML = hr + ':' + pad(seconds % 60) + 'am <span>('+day+' of Month)</span>';
            }
            else {
                if (hr > 12) {
                    hr = hr - 12;
                }
                document.getElementById("dateandtime1").innerHTML = hr + ':' + pad(seconds % 60) + 'pm <span>('+day+' of Month)</span>';
            }
            getStatus(day,hr);
	};

	setInterval(tickClock,1000);

	function pad(n) {
        if (n < 10){
            return '0' + n.toString();
        } else {
            return n.toString();
        }
    }
})();