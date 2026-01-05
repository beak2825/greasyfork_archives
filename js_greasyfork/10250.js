// ==UserScript==
// @name           bw-menu-multitalker.user
// @description    http://www.bloodyworld.com
// @include http://www.bloodyworld.com/index.php?file=menu
// @version 0.0.1.20150604004451
// @namespace https://greasyfork.org/users/12000
// @downloadURL https://update.greasyfork.org/scripts/10250/bw-menu-multitalkeruser.user.js
// @updateURL https://update.greasyfork.org/scripts/10250/bw-menu-multitalkeruser.meta.js
// ==/UserScript==



(function(){

var Talkers = 0;

/******************************************************************************/

  var kob_mtalker_stop_f;
  var kob_mtalker_time = new Array();
  function kob_mtick(tick) {
	var rest = document.getElementById('kob_mtalk'+tick+'rest');
	var restval = document.getElementById('kob_mtalk'+tick+'rest').value;
	if (restval>1) {
	  rest.value = restval-1;
	  kob_mtalker_time[tick]=setTimeout(function(tick){ return function(){ kob_mtick(tick); } }(tick), 1000);
	} else {
	  kob_mtalker(tick);
	}
  };
  function kob_mtalker(tick){
	var int = document.getElementById('kob_mtalk'+tick+'int');
	var rest = document.getElementById('kob_mtalk'+tick+'rest');
	var run = document.getElementById('kob_mtalk'+tick+'run');
	var talk = document.getElementById('kob_mtalk'+tick+'talk');
	var chan = document.getElementById('kob_mtalk'+tick+'chan');
	rest.value=int.value;
	run.value="stop";

	lines=talk.value.split("\n");
	var msgText="";
	for(i=0; i<10 && msgText==""; i++) {
	  line = Math.round(Math.random()*(lines.length-1));
	  msgText = lines[line];
	  msgText = msgText.replace("\n","");
	  msgText = msgText.replace("\r","");
	};
	var vtop = top;
	if (vtop.wrappedJSObject) vtop = vtop.wrappedJSObject;
	msgText=vtop.fr_send.censured(msgText);
	msgText=vtop.fr_send.filtrSmiles(msgText);
	msgText=vtop.fr_send.replaceAll(msgText,'\\','_znakk_');
	msgText=vtop.fr_send.replaceAll(msgText,'#','_znakresh_');
	msgText=vtop.fr_send.replaceAll(msgText,'%','_znakprocent_');
	msgText=vtop.fr_send.replaceAll(msgText,'+','_znakplus_');
	msgText=vtop.fr_send.replaceAll(msgText,'&','_znakam_');
	msgText=vtop.fr_send.replaceAll(msgText,';','_znaktzpt_');
	vtop.fr_send.document.forms.sndForm.v.value=msgText;
	vtop.fr_send.document.forms.sndForm.f.value=chan.value;
	vtop.fr_send.document.forms.sndForm.submit();
	kob_mtalker_time[tick]=setTimeout( function(tick){ return function(){ kob_mtick(tick); } }(tick), 1000);
  };
  function kob_mtalker_stop(tick){
	var rest = document.getElementById('kob_mtalk'+tick+'rest');
	var run = document.getElementById('kob_mtalk'+tick+'run');
	clearTimeout(kob_mtalker_time[tick])
	rest.value="";
	run.value="start";
	clearTimeout(kob_mtalker_time[tick]);
	kob_mtalker_time[tick]=undefined;
  }
  kob_mtalker_stop_f = kob_mtalker_stop;

  function kob_new_mtalker()
  {
	var div = document.body;
	var newdiv = document.createElement('div');
	i = Talkers++;
	newdiv.innerHTML +=
		'<form id=kob_mtalk'+i+' onsubmit="javascript:return false;">'+
		  'Talk '+i+':<textarea wrap=off cols=30 rows=3 name=talk id=kob_mtalk'+i+'talk></textarea>'+
		  '*<select name=int id=kob_mtalk'+i+'int><option value="60">1:00<option value="180">3:00<option value="300">5:00<option value="600">10:00<option value="1200">20:00<option value="1500">25:00<option value=1800>30:00</select>'+
		  '-&gt;<select name=chan id=kob_mtalk'+i+'chan><option value="s">global<option value="sk">clan</select>'+
		  '<input name=rest size=7 disabled id=kob_mtalk'+i+'rest>'+
		  '<input name=run type=submit id=kob_mtalk'+i+'run value="start">'+
		'</form>';
	div.appendChild(newdiv);
	var run = document.getElementById('kob_mtalk'+i+'run');
	run.addEventListener('click', function(run,i){ return function(){ if(run.value=='stop'){ kob_mtalker_stop(i); } else { kob_mtalker(i); } return false; } }(run,i), false);
  };

  {
	top.document.getElementsByTagName('frame')[0].scrolling = 'vertical';
	kobb = document.getElementById('kob_tbl');
	if (!kobb) {
	  /* Create special menu */
	  var newdiv = document.createElement('div');
	  newdiv.innerHTML = '<hr><table border=1><tr id=kob_tbl><td>&nbsp;</td></tr></table>';
	  document.body.appendChild(newdiv);
	  kobb = document.getElementById('kob_tbl');
	}
	/* Create special menu */
	var newtd = document.createElement('td');
	newtd.setAttribute('id','kob_mt');
	var but = document.createElement('button');
	but.innerHTML = 'new talker';
	but.addEventListener('click', kob_new_mtalker, false);
	newtd.appendChild(but);
	kobb.appendChild(newtd);
  }

})();