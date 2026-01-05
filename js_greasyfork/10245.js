// ==UserScript==
// @name           bw-battle-time
// @description    http://www.bloodyworld.com
// @include http://www.bloodyworld.com/*
// @version 0.0.1.20150604003849
// @namespace https://greasyfork.org/users/12000
// @downloadURL https://update.greasyfork.org/scripts/10245/bw-battle-time.user.js
// @updateURL https://update.greasyfork.org/scripts/10245/bw-battle-time.meta.js
// ==/UserScript==



if(!document.location.href.match("http://www.bloodyworld.com/xfn")) {
  if (document.location.href.match("http://www.bloodyworld.com/index.php\\?file=menu")) {
	window.opera.addEventListener('AfterEvent.load',function(e){
	  if( e.event.target instanceof Document) {
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
		newtd.setAttribute('id', 'kob_bt');
		newtd.innerHTML = "Battle timers";
		kobb.appendChild(newtd);
	  }
	},false);

	var bwbt_timers = new Array();
	var bwbt_places = 0;

	function bwbt_place(inh,ocl)
	{
	  if (!bwbt_places) {
		var tbl = document.createElement('table');
		tbl.setAttribute('border', 1);
		var r1 = document.createElement('tr'); r1.setAttribute('id', 'bwbt_r1');
		var r2 = document.createElement('tr'); r2.setAttribute('id', 'bwbt_r2');
		var r3 = document.createElement('tr'); r3.setAttribute('id', 'bwbt_r3');
		tbl.appendChild(r1); tbl.appendChild(r2); tbl.appendChild(r3);
		var t = document.getElementById('kob_bt');
		t.innerHTML = '';
		t.appendChild(tbl);
		//var td=document.createElement('td'); td.innerHTML="Battle timers"; r1.appendChild(td); bwbt_places ++;
	  }
	  var td = document.createElement('td');
	  td.onclick = ocl;
	  td.appendChild(inh);
	  var r = ((bwbt_places++)%3+1)
	  document.getElementById('bwbt_r'+r).appendChild(td);
	};

	function bwbt_settimer(nick)
	{
	  var timer = document.getElementById('bwbt_t_'+nick);
	  if (!timer) {
		timer = document.createElement('span');
		timer.setAttribute('id','bwbt_t_'+bwbt_places);
		timer.style = "white-space: nowrap;";
		var tn = document.createElement('span');
		tn.style = "float: left;";
		tn.innerHTML = nick;
		timer.appendChild(tn);
		var tmr = document.createElement('span');
		tmr.setAttribute('id', 'bwbt_tmr_'+bwbt_places);
		tmr.style = "float: right; border: 1px dashed black;";
		timer.appendChild(tmr);
		bwbt_place(timer, function(nick,pl){ return function(){ bwbt_reset_timer(nick,pl); }}(nick,bwbt_places) );
		bwbt_reset_timer(nick, bwbt_places-1);
	  }
	};

	function bwbt_clear()
	{
	  document.getElementById('kob_bt').innerHTML = "Battle timers";
	  bwbt_places = 0;
	  bwbt_timers = new Array();
	};

	function bwbt_reset_timer(nick, place)
	{
	  var t = bwbt_timers[nick];
	  if (t) {
		clearTimeout(t['timer']);
	  } else {
		bwbt_timers[nick] = new Array();
		t = bwbt_timers[nick];
	  }
	  t['min'] = 0;
	  t['pl'] = place;
	  t['sec'] = 0;
	  t['timer'] = setTimeout(function(nick){ return function(){ bwbt_mtick(nick); } }(nick), 1000);
	  var tm = document.getElementById('bwbt_tmr_'+t['pl']);
	  tm.innerHTML = t['min'] + ':' + (t['sec']<10 ? '0' : '') + t['sec'];
	};

	function bwbt_syncnicks(nicks)
	{
	  var used = new Array();
	  for (i=0; i<nicks.length; i++) {
		used[nicks[i]]++;
		if (!bwbt_timers[nicks[i]]) {
		  bwbt_settimer(nicks[i]);
		}
	  }
	  for (var n in bwbt_timers) {
		if (!(n in used)) {
		  var t = bwbt_timers[n];
		  clearTimeout(t['timer']);
		  var tm = document.getElementById('bwbt_tmr_'+t['pl']);
		  tm.innerHTML = 'x';
		}
	  }
	};

	function bwbt_mtick(nick) {
	  var t = bwbt_timers[nick];
	  if (t) {
		t['sec']++;
		if (t['sec']>=60) {
		  t['min']++;
		  t['sec'] = 0;
		}
		t['timer'] = setTimeout(function(nick){ return function(){ bwbt_mtick(nick); } }(nick), 1000);
		var tm = document.getElementById('bwbt_tmr_'+t['pl']);
		tm.innerHTML = t['min'] + ':' + (t['sec']<10 ? '0' : '') + t['sec'];
	  }
	};
  } else {
	// add function to catch form post

	window.opera.addEventListener('AfterEvent.load',function(e){
	  if( e.event.target instanceof Document ) {
		var eb = document.body.innerHTML.match(/file=endbattle&(?:amp;)?cls=/g);
		if (eb && eb.length == 1) {
		  top.menu.bwbt_clear();
		} else {
		  // extract and set up timers
		  var rul = document.body.innerHTML.match(/Lu\('team([12])'/);
		  if (rul) {
			var alts;
			if (rul[1] == '1') {
			  alts = document.body.innerHTML.match(/Lu\('team2'[^{]+{[^{]+{'n':'[^']+'/g);
			} else {
			  alts = document.body.innerHTML.match(/Lu\('team1'[^{]+{[^{]+{'n':'[^']+'/g);
			}
			var nicks = new Array;
			for(var i=0; i<alts.length; i++) {
			  var r = alts[i].match(/'l':'([?0-9]+)'[^)]+'n':'([^']+)'/);
			  nicks[i] = r[2]+'['+r[1]+']';
			}
			top.menu.bwbt_syncnicks(nicks);
		  }
		}
	  }
	},false);
  }
}
