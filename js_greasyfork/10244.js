// ==UserScript==
// @name           bw-auto-walk
// @description    http://www.bloodyworld.com
// @include http://www.bloodyworld.com/*
// @version 0.0.1.20150604003758
// @namespace https://greasyfork.org/users/12000
// @downloadURL https://update.greasyfork.org/scripts/10244/bw-auto-walk.user.js
// @updateURL https://update.greasyfork.org/scripts/10244/bw-auto-walk.meta.js
// ==/UserScript==



  if (document.location.href.match("http://www.bloodyworld.com/index.php\\?file=menu")) {
	window.opera.addEventListener('AfterEvent.load',function(e){
	  if(e.event.target instanceof Document) {
		kobb = document.getElementById('kob_tbl');
		if (!kobb) {
		  /* Create special menu */
		  var newdiv = document.createElement('div');
		  newdiv.setAttribute('id','kob_conf');
		  newdiv.innerHTML = '<hr><table border=1><tr id=kob_tbl><td>&nbsp;</td></tr></table>';
		  document.body.appendChild(newdiv);
		  kobb = document.getElementById('kob_tbl');
		}
		newtd=document.createElement('td');
		newtd.innerHTML = "<input type=checkbox id=kob_autowalk>Auto-walk";
		kobb.appendChild(newtd);
	  }
	},false);
  } else {
	if ((document.location.href.match(/[?&]file=cave[&]backurl=file_equal_go/) ||
		 document.location.href.match(/[?&]file=depot[&]backurl=file_equal_go/)) &&
		top.menu.document.getElementById('kob_autowalk').checked) {
	  window.opera.addEventListener('AfterEvent.load',function(e){
		if( e.event.target instanceof Document ) {
		  MoveTime = (5+Math.random()*25)*1000;
		  setTimeout("GoUrl('index.php?file=go&go=2')",MoveTime);
		  SendSay("Will go for puzzle in "+(MoveTime/1000)+" seconds");
		}
	  },false);
	}
	window.opera.addEventListener('AfterEvent.load',function(e){
	  if( e.event.target instanceof Document && document.body.innerHTML.match(/xcode=/) ) {
		var timeres=document.body.innerHTML.match(/MM=([0-9]+)&(?:amp;)?SS=([0-9]+)/);
		if (timeres) {
		  var waittime = timeres[1]*60+timeres[2]*1;
		  SendSay("Will refresh in "+waittime+" seconds");
		  setTimeout("if(SubUrl==0){refresh_page()}",waittime*1000+100);
		}
	  }
	}, false);
  }
