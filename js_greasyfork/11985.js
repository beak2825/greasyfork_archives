// ==UserScript==
// @name         Howrse smiley:3
// @namespace    http://your.homepage/
// @version      0.7
// @description  old smileys
// @author       Xavier
// @include      http://gaia.equideow.com/*
// @include      http://ouranos.equideow.com/*
// @include 	 http://wwww.howrse.de/*
// @include      http://wwww.howrse.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11985/Howrse%20smiley%3A3.user.js
// @updateURL https://update.greasyfork.org/scripts/11985/Howrse%20smiley%3A3.meta.js
// ==/UserScript==

function main(){
	var inter = setInterval(modifying,5000);
}

function modifying(){
	var x = 0;
	var textarea;
	console.log("Starting");
	textarea = document.getElementsByTagName("textarea");
	for (x=0;x<textarea.length;x++){
		textarea[x].relatedtextarea=textarea[x];
		textarea[x].onkeyup=myFunc(textarea[x])
	}
	return 1;
}

function myFunc(input){
	return function(){
		var possibleSmiley, match, i, myregex, text, place, smiley, cursor, curend, oldtext;
		i = 0;
		console.log("Changing to smiley");
		cursor = input.selectionStart;
		curend = input.selectionStart;
		possibleSmiley = ["(xd)","(o_O)","(bis)","(grr)","(zzz)","(D8)","(omg)","(ninja)","(8D)","(snif)","(lol)","(8P)","(euh)","(up)","(bad)","(8)","(ker)","(bg)","(8)","(h)","(blink)","(ski)","(mur)","(mmm)","(smoke)","(yeah)"];
		smileyregex = /\(\w{1,5}\)/g;
		imageregex = /((?:https?:\/\/|www\.)((\w|\/|\.|\:)+?\.(jpg|png|gif|bmp))\/?)/i;
		urlregex = /(?:https?:\/{2}|www\.)[\S]+?\.(?:\w{0,3}|[0-9])(?=([^\s\]\.]*))\1(?:\.php|\.html|\.asp|(?!\.))(?=([^\s\]]*))\2(?!([\]\[]))/i;
		smiley = "";
		text = input.value;
		match = text.match(smileyregex);
		if (match != null){
			console.log(match);
			for (i=0;i<match.length;i++){
				if(possibleSmiley.indexOf(match[i]) != -1){
					smiley = match[i].substr(1,match[i].length-2);
					cursor -= (smiley.length+2);
					smiley = "[img]http://smileys.alwaysdata.net/smileys/" + smiley + ".gif[/img]";
					cursor += smiley.length;
					place = smileyregex.exec(text);
					text = text.substr(0,place.index) + smiley + text.substr(place.index+1 + match[i].length-1, text.length-1);
					curend = cursor;
				}
			}
		}

		match = urlregex.exec(text);
		while(match != null){
			console.log(match);
			url = match[0].substr(0,match[0].length);
			cursor += 6;
			text = text.substr(0,match.index) + "[url=" + url + "][/url]" + text.substr(match.index+match[i].length, text.length-1);
			matchi = imageregex.exec(url);
			if(matchi != null){
				console.log(matchi);
				img = matchi[0].substr(0,matchi[0].length);
				text = text.substr(0,match.index) + "[img]" + img + "[/img]" + text.substr(match.index+url.length+12, text.length-1);
				cursor += 5;
			}
			curend = cursor;
			match = urlregex.exec(text);
		}
		

		input.value = text;
		input.selectionStart = cursor;
		input.selectionEnd = curend;
	}
}

main();