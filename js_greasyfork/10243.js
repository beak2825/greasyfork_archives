// ==UserScript==
// @name           bw-auto-monster
// @description    http://www.bloodyworld.com
// @include http://www.bloodyworld.com/*
// @exclude http://www.bloodyworld.com/xfn*
// @version 0.0.1.20150604003654
// @namespace https://greasyfork.org/users/12000
// @downloadURL https://update.greasyfork.org/scripts/10243/bw-auto-monster.user.js
// @updateURL https://update.greasyfork.org/scripts/10243/bw-auto-monster.meta.js
// ==/UserScript==
// (c) Anton Fedorov aka DataCompBoy, 2006-2007
// Clan <The Keepers of Balance>.
// improved by maxwell

kobamAntiMobComplect = 0; // Put fast-menu item count to re-wear complect
kobamHealerBottle = 0;	  // Put fast-menu item count to drink bottle

  if (document.location.href.match("http://www.bloodyworld.com/index.php\\?file=menu")) {
	kob_am_state = 0; // 0=off, 1=wait max, 2=fight, 3=rewear
	function kob_do_am(){
	  if (kob_am_state==0) { // Start automonster
		kob_am_state = 1;
	  } else {
		kob_am_state = 0;
	  }
	  kob_do_am_step();
	};

	function kob_do_am_step() {
	  if (kob_am_state==0) {
		kob_do_am_step0();
	  } else
	  if (kob_am_state==1) {
		kob_do_am_step1();
	  } else
	  if (kob_am_state==2) {
		kob_do_am_step2();
	  } else
	  { document.getElementById('kob_am_i').innerHTML = "bug"; }
	  return kob_am_state;
	};
	function kob_do_am_step0() {
	  document.getElementById('kob_am_i').innerHTML = "disabled";
	};
	function kob_do_am_step1() {
	  document.getElementById('kob_am_i').innerHTML = "wait for life";
	  if (parent.frames.main.realLife >= document.getElementById('kob_am_lb').value) {
		kob_am_state = 2;
		kob_do_am_step();
	  }
	};
	function kob_do_am_step2() {
	  document.getElementById('kob_am_i').innerHTML = "...fight...";
	  if (parent.frames.main.realLife <= document.getElementById('kob_am_lf').value) {
		kob_am_state = 1;
		kob_do_am_step();
	  } else {
		MoveTime = (3+Math.random()*7)*1000;
		setTimeout("parent.frames.main.openMenu();",MoveTime);
		if (kobamAntiMobComplect) {
		  MoveTime += (1+Math.random()*3)*1000;
		  setTimeout("parent.frames.main.RP_useSlot("+kobamAntiMobComplect+");",MoveTime);
		  MoveTime += (1+Math.random()*3)*1000;
		  setTimeout("parent.frames.main.RP_useSubmit();",MoveTime);
		}
		if (kobamHealerBottle) {
		  MoveTime += (1+Math.random()*3)*1000;
		  setTimeout("parent.frames.main.RP_useSlot("+kobamHealerBottle+");",MoveTime);
		  MoveTime += (1+Math.random()*3)*1000;
		  setTimeout("parent.frames.main.RP_useSubmit();",MoveTime);
		}
		MoveTime += (1+Math.random()*3)*1000;
		setTimeout("parent.frames.main.ShowH('confirmImg',null,'"+document.getElementById('kob_am_m').value+"');",MoveTime);
	  }
	};

	window.opera.addEventListener('AfterEvent.load',function(e){
	  if(e.event.target instanceof Document) {
		kobb = document.getElementById('kob_tbl');
		if (!kobb) { // Create special menu
		  var newdiv = document.createElement('div');
		  newdiv.setAttribute('id','kob_conf');
		  newdiv.innerHTML = '<hr><table border=1><tr id=kob_tbl><td>&nbsp;</td></tr></table>';
		  document.body.appendChild(newdiv);
		  kobb = document.getElementById('kob_tbl');
		}
		newtd=document.createElement('td');
		var plevel = parent.frames.main.document.body.innerHTML.match(/TD-HeroName-TXT[^\[]+[\[]([0-9?]+)[\]]/)[1];
		newtd.innerHTML = "<table border=0><tr>"
		+"<td>Auto-monster: <select id=kob_am_m>"
		+"<option value='traglodit' "+(plevel==1?"selected":"")+">Traglodit[1]</option>"
		+"<option value='skeleton' "+(plevel==2?"selected":"")+">Skeleton[2]</option>"
		+"<option value='centaur' "+(plevel==3?"selected":"")+">Centaur[3]</option>"
		+"<option value='golem' "+(plevel==4?"selected":"")+">Golem[4]</option>"
		+"<option value='harpy' "+(plevel==5?"selected":"")+">Harpy[5]</option>"
		+"<option value='gargoyle' "+(plevel==6?"selected":"")+">Gargoyle[6]</option>"
		+"<option value='troll' "+(plevel==7?"selected":"")+">Troll[7]</option>"
		+"<option value='dendroid' "+(plevel==8?"selected":"")+">Dendroid[8]</option>"
		+"<option value='unicorn' "+(plevel==9?"selected":"")+">Unicorn[9]</option>"
		+"<option value='wyvern' "+(plevel==10?"selected":"")+">Wyvern[10]</option>"
		+"<option value='griffin' "+(plevel==11?"selected":"")+">Griffin[11]</option>"
		+"<option value='cyclop' "+(plevel==12?"selected":"")+">Cyclop[12]</option>"
		+"<option value='rocthunderbird' "+(plevel==13?"selected":"")+">Rocthunderbird[13]</option>"
		+"</select><br>"
		+"Life to start: <input id=kob_am_lb cols=5 size=5 value="+parent.frames.main.maxLife+"><br>"
		+"Life to stop: <input id=kob_am_lf cols=5 size=5 value="+Math.round(parent.frames.main.maxLife*2/5)+"><br>"
		+"<td><input id=kob_am type=submit value='Fight' onclick='kob_do_am(); return false;'><br>"
		+"<span id=kob_am_i></span>"
		+"</table>"
		;
		kobb.appendChild(newtd);
	  }
	},false);
  } else {
	// Stand in portal
	if (document.location.href.match(/[?&]file=plato/) ||
		document.location.href.match(/[?&]file=declare_battlemonstr/)) {
	  var kob_am_started = 0;
	  window.opera.addEventListener('AfterEvent.load',function(e){
		if(e.event.target instanceof Document) {
		  if (parent.frames.menu.kob_am_state == 1) {
			parent.frames.menu.kob_do_am_step();
		  } else
		  if (parent.frames.menu.kob_am_state == 2 && !kob_am_started) {
			kob_am_started = 1;
			parent.frames.menu.kob_do_am_step();
		  }; // Add life timer
		}
	  },false);
	  window.opera.defineMagicFunction(
		'increaseLife',
		function(real, thisObject) {
		  var ret = real.apply( thisObject, arguments.slice(2) );
		  if (parent.frames.menu.kob_am_state == 1) {
			parent.frames.menu.kob_do_am_step();
		  } else
		  if (parent.frames.menu.kob_am_state == 2 && !kob_am_started) {
			kob_am_started = 1;
			parent.frames.menu.kob_do_am_step();
		  }
		  return ret;
		}
	  );
	}
	// Add fight-close
	if (parent.frames.menu.kob_am_state > 0) {
	  window.opera.addEventListener('AfterEvent.load',function(e){
		if(e.event.target instanceof Document) {
		  /* Step 1: find out popup */
		  var popup = document.getElementById('alertForm');
		  if (popup) {
			PressMsg('no');
		  }

		  var eb = document.body.innerHTML.match(/(index.php[?]file=endbattle[&][^"]+)"/);
		  if(eb) {
			MoveTime = (1+Math.random()*3)*1000;
			setTimeout("document.location='index.php?file=endbattle&cls=close';",MoveTime);
		  }
		}
	  }, false);
	}
  }
