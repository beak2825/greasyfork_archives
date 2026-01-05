// ==UserScript==
// @name	TF2R - Admin Report Notifier
// @namespace	auhtwoo
// @description	Idle on raffles.html, get popup notifications about new reports (firefox version)
// @include	http://tf2r.com/raffles.html
// @include https://tf2r.com/raffles.html
// @require https://code.jquery.com/jquery-1.6.min.js
// @grant	none
// @version 1.3
// @downloadURL https://update.greasyfork.org/scripts/17570/TF2R%20-%20Admin%20Report%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/17570/TF2R%20-%20Admin%20Report%20Notifier.meta.js
// ==/UserScript==   

var timeout = 11000; //15 seconds default, lower for performance or raise for better report response time
//also, below 10 seconds will probably mess with stuff
var firstRGet = true;
var trafreps, tureps, changed;	//temp variables for comparison
var rafreps, rlen, ureps, ulen;		//working variables

function main(){
	trafreps = JSON.parse(JSON.stringify(rafreps));
	tureps = JSON.parse(JSON.stringify(ureps));
	getReps();
}

function getReps(){
	$.get("/admin/index.php?page=tf2r_raffles", function(data){
	  process(data);
	}) .fail(function(data){	//it sometimes returns 500 server error when it works for some reason
		console.log('why 500');
		process(data.responseText);
	  });
 }
  
 function process(t){
	var ra = t.split('massdel').slice(1);
	rlen = ra.length;
	ulen = 0;
	rafreps = new Array();
	ureps = new Array();
	for (var i = 0; i < rlen; i++){
		rafreps[i] = new Array(ra[i].slice(1,ra[i].indexOf('">')),ra[i].split('nowrap').length -1);
		for (var j = 0; j < rafreps[i][1]; j++){
			var tmp = ra[i].split('nowrap><b>')[rafreps[i][1]-j];
			ureps[ulen] = new Array(rafreps[i][0], tmp.slice(0,tmp.indexOf('<td width="100%">')-12), tmp.slice(tmp.indexOf('<td width="100%">')+17,tmp.indexOf('page=tf2r_raffles&manage')-53));
			ulen++;
		}
	}
	
	if (!firstRGet)
		analyze();
 }
 
 function analyze(){
	var aa = $.map(ureps, function(n){return n;});
	var ab = $.map(tureps, function(n){return n;});
	changed = $(aa).not(ab);
	console.log(changed+ " " + changed.length);
	if (changed.length > 0){
		if (changed.length == 3){
			notifyyy(changed[0],changed[1],changed[2],0);
		}
		else{
			notifyyy('','',(changed.length/3),1);
		}
	} else console.log("No new reportsb");
 }
 
 function notifyyy(key,usr,msg,flag) {
	 var title, bodytxt, url;
	 
	if (flag===0){
		title = 'New report: http://tf2r.com/k'+key+'.html';
		bodytxt = usr+' says: '+msg;
		url = 'http://tf2r.com/k'+key+'.html';
	}
	else {
		title = msg+' new Reports!';
		bodytxt = 'Click to view reports page';
		url = 'http://tf2r.com/admin/index.php?page=tf2r_raffles';
	}
	console.log(title+" "+bodytxt+" "+url+" ");
	
	if (!("Notification" in window)) {
		console.log("This browser does not support desktop notifications");
	}

	else if (Notification.permission === "granted") {
		var notification = new Notification(title,{body:bodytxt});
		notification.onclick = function(event) {
			event.preventDefault();
			window.open(url, '_blank');
		};
	}

	else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function (permission) {
			if (permission === "granted") {
				var notification = new Notification(title,{body:bodytxt});
				notification.onclick = function(event) {
					event.preventDefault();
					window.open(url, '_blank');
				};
			}
		});
	}
}

//initiate
getReps();
firstRGet = false;
setInterval(main,(timeout<10000?10000:timeout));
