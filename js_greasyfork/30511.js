/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */

// ==UserScript==

// @name        Elo-Rang
// @namespace   fussball
// @include     https://fussballcup.de/*
// @version    	0.1.5
// @description show current ELO Rang in profile
// @author 	Philipp, edited by mot33 / 2017
// @connect <value>
// @downloadURL https://update.greasyfork.org/scripts/30511/Elo-Rang.user.js
// @updateURL https://update.greasyfork.org/scripts/30511/Elo-Rang.meta.js
// ==/UserScript==

var timeout = 5000;

/**
* Simply creates async html request with url theURL; calls back callback with result string as first parameter and args as second parameter
*
* Case of error; null is returned as result String
*/
function httpGetAsync(theUrl, callback, args){
	var xmlHttp = new XMLHttpRequest();

   	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			callback(xmlHttp.responseText, args);
		}
	}

    	xmlHttp.open("GET", theUrl, true); // true for asynchronous 
   	xmlHttp.send(null);

	// handle timeout
	window.setTimeout(function(){
		if (xmlHttp.readyState != 4 || xmlHttp.status != 200){
			// something went wrong
			// cancel
			xmlHttp.abort();
			// call callback with error
			callback(null, args);
		}
	}, timeout);
}

/**
* 	really (like really really) simple logger :)
*/
function logError(msg){
	console.log("ELO-rank show script: " + msg);
}

// make sure changes() isn't executed twice the same time
var lock=false;
// do not search for same name twice (if once failed, will probably fail again; performance!)
var lastName="";
function checkForSearchNameOrReturnNull(){
	// and that's just lots of text to make sure, this script isn't executed more than necesarry

	// make sure this function isn't executed twice at the same time
	if(lock){
		return null;
	}

	// make sure, rank must be added (= profil show page)
	var url = window.location.href;
	if(!(/module=([^&]+)/.exec(url)[1]=='profile')){
		return null;
	}
	if(!(/action=([^&]+)/.exec(url)[1]=='show')){
		return null;
	}

	// make sure rank isn't allready sucessfully added
	if(document.getElementById('rankshow')!=null){
		return null;
	}

	// make sure, profile-show exists
	var profile_show = document.getElementById('profile-show');
	if(profile_show == null || profile_show.firstChild == null){
		// log something strange happend; actually profile page should have profile-show element
		logError("Something strange happended! Recognized profile page but no profile-show element to extract name from!");
		return null;
	}

	// extract profile name name
	// substring(11): String is "Profil von (...)". Extract (...) 
	var name = profile_show.firstChild.textContent.substring(11);
	
	// do not execute script for same name twice
	if(lastName == name){
		lock=false;
		return null;
	}
	lastName = name;

	// finally return result
	return name;
}

/**
* 	Takes rank as attribute
*	Creates html elements and addes rank information to info box
*/
function appendRank(rank){
	// create html frame
	  var s ='<br><li><strong id="rankshow" class="player-preview">Elo-Rang:&nbsp';
	s+="";{
        s+=rank = " <font color='yellow'>"+ String(rank) + "&nbsp&nbsp</font></strong></b>";
            }
	var div = document.createElement('div');
	div.innerHTML = s;

	// insert
	var elementsProfileBox = document.getElementsByClassName('profile-box-squad');
	if(elementsProfileBox.length==0){
		// okay, that's strange
		logError("Strange error while adding rank information: No Element of class 'profile-box-squad' found! Don't know where to add information!");
	}else{
		elementsProfileBox[0].appendChild(div);
	}

	// unlock
	lock=false;
}


/**
*	gets resulst String
*	parses and extracts ELO rank
* 	checks, if it is ELO rank for args['name']
*	calls args['call'] with first parameter: rank
*/
function fetchELOResults(requestResult, args){
	// check for valid result
	if(requestResult == null){
		args['call']('error');
		logError("Error html request!");
		return;
	}

	// parse result
	try{
		var parser = document.createElement('html');
		parser.innerHTML = JSON.parse(requestResult).content;

		// get right fieled
		var results = parser.getElementsByClassName(' odd');

		if(results.length == 0){
		// okay, no problem! Just no rank found: probably user doesn't have a rank
                       	args['call']('/');
			return;
		}
		results = results[0];

		// check if name is right
		if(results.children[2].children[1].innerHTML!=args['name']){
			// okay, no problem! Just not right user found: problably user doesn't have a rank
                      	args['call']('/');
			return;
               	}

		// call callback with rank to handle everything else
		args['call'](results.firstChild.innerHTML);

	}catch(e){
		args['call']('error');
		logError("Error parsing resulst String of ELO-rank request! Error: " + e);
		return;
	}
}


/**
*   searches ELO rang
*   will call back toCall with first paramter elo rang of player with name "name"
*/
function searchELORang(name, toCall){
	// wrap parameters in set
    	params={};
    	params['name'] = name;
	params['call'] = toCall;

	// schedule html requst
	httpGetAsync('http://fussballcup.de/index.php?club=' + name + '&_qf__form=&module=rating&action=index&area=user&league=&path=index.php&layout=none', fetchELOResults , params);
}


/**
*	Main function! Will check, if script execution is necessar; will lookup ELO rank and will append rank to profile
*/
function changes(){
	// get name; will catch all cases where nothing has to be done
	var name = checkForSearchNameOrReturnNull();

	if(name == null){
		// nothing to do
		return;
	}
	
	// set lock
	lock=true;

	// Real script execution!!!
	searchELORang(name, appendRank);
}

window.setTimeout(function() { changes() }, 2500);
window.setInterval(function() { changes() }, 5000);
