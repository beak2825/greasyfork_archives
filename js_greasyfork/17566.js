// ==UserScript==
// @name	TF2R - Admin Report Notifier
// @namespace	auhtwoo
// @description	Idle on raffles.html, get popup notifications about new reports (chrome version)
// @include	http://tf2r.com/raffles.html
// @include https://tf2r.com/raffles.html
// @grant	none
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/17566/TF2R%20-%20Admin%20Report%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/17566/TF2R%20-%20Admin%20Report%20Notifier.meta.js
// ==/UserScript==   

var timeout = 15000; //15 seconds default, lower for performance or raise for better report response time
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
	});	//ok chrome
 }
  
 function process(t){
	var ra = t.split('massdel').slice(1);
	rlen = ra.length;
	ulen = 0;
	rafreps = new Array();
	ureps = new Array();
	for (var i = 0; i < rlen; i++){
		rafreps[i] = new Array(ra[i].slice(1,ra[i].indexOf('">')),ra[i].split('nowrap').length -1)
		for (var j = 0; j < rafreps[i][1]; j++){
			var tmp = ra[i].split('nowrap><b>')[rafreps[i][1]-j];
			ureps[ulen] = new Array(rafreps[i][0], tmp.slice(0,tmp.indexOf('<td width="100%">')-12), tmp.slice(tmp.indexOf('<td width="100%">')+17,tmp.indexOf('page=tf2r_raffles&manage')-53))
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
	//console.log(changed);
	if (changed.length > 0){
		var i = 0;
		while (i < changed.length){
			notify(changed[i],changed[++i],changed[++i]);
			i++;
		}
	} else console.log("No new reports");
 }
 
 function notify(key,usr,msg) {
	var title = 'New report: http://tf2r.com/k'+key+'.html';
	var bodytxt = usr+' says: '+msg;
	var url = 'http://tf2r.com/k'+key+'.html';
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notifications");
  }

  else if (Notification.permission === "granted") {
    var notification = new Notification(title,{body:bodytxt});
	notification.onclick = function(event) {
		event.preventDefault();
		window.open(url, '_blank');
	}
  }

  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        var notification = new Notification(title,{body:bodytxt});
		notification.onclick = function(event) {
			event.preventDefault();
			window.open(url, '_blank');
		}
      }
    });
  }
}

//initiate
getReps();
firstRGet = false;
setInterval(main,(timeout<10000?10000:timeout));
