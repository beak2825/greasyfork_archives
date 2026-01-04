// ==UserScript==
// @name         Avoid_source
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/375124/Avoid_source.user.js
// @updateURL https://update.greasyfork.org/scripts/375124/Avoid_source.meta.js
// ==/UserScript==

$(document).ready(function() {
	var data = [{
		"Name": "The Sun",
		"Url": "thesun.co.uk"
	},{
		"Name": "The Daily/Sunday Mail",
		"Url": "dailymail.co.uk"
	},{
		"Name": "The Daily/Sunday Mirror",
		"Url": "mirror.co.uk"
	},{
		"Name": "The Daily Star",
		"Url": "dailystar.co.uk"
	},{
		"Name": "The Daily Express",
		"Url": "express.co.uk"
	},{
		"Name": "Wikipedia",
		"Url": "wikipedia.org"
	},{
		"Name": "Investopedia",
		"Url": "investopedia.com"
	},{
		"Name": "Tutor 2 U",
		"Url": "tutor2u.net"
	},{
		"Name": "Quick MBA",
		"Url": "quickmba.com"
	}, {
		"Name": "MindTools",
		"Url": "mindtools.com"
	},{
		"Name": "Business Balls",
		"Url": "businessballs.com"
	},{
		"Name": "SlideShare",
		"Url": "slideshare.net"
	},{
		"Name": "UKEssays",
		"Url": "ukessays.com"
	},]

	for(var i = 0; i < data.length; i++) {
		if(window.location.href.indexOf(data[i]["Url"])!=-1) {
			console.log("-")
			$("body").css("padding-top","30px");
			$("body").append("<div id='AVoid_Source_TOP'>小心！-"+data[i]["Name"]+"不是一个可信的学术来源"+"</div>")
		}

	}
   $("#AVoid_Source_TOP").css("position","absolute")
   $("#AVoid_Source_TOP").css("top","0px")
   $("#AVoid_Source_TOP").css("font-size","1.5em")
   $("#AVoid_Source_TOP").css("width","100%")
   $("#AVoid_Source_TOP").css("height","30px")
   $("#AVoid_Source_TOP").css("z-index","99")
   $("#AVoid_Source_TOP").css("background-color","hotpink")
   $("#AVoid_Source_TOP").css("color","white")
    $("#AVoid_Source_TOP").css("text-align","center")
})