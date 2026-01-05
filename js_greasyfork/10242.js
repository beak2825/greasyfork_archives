// ==UserScript==
// @name           bw-auto-forest
// @description    http://www.bloodyworld.com
// @include http://www.bloodyworld.com/*
// @exclude http://www.bloodyworld.com/xfn/*
// @exclude http://www.bloodyworld.com/xfn2/*
// @version 0.0.1.20150604003543
// @namespace https://greasyfork.org/users/12000
// @downloadURL https://update.greasyfork.org/scripts/10242/bw-auto-forest.user.js
// @updateURL https://update.greasyfork.org/scripts/10242/bw-auto-forest.meta.js
// ==/UserScript==



  if (location.href.match(/[?&]file=forest/) || location.href.match(/[^?]+$/)) {
	window.opera.addEventListener('AfterEvent.load',function(e){
	  if( e.event.target instanceof Document ) {
		if (!document.body.innerHTML.match(/ex-forest-begin.swf/)) {
		  /* Step 0: init timer */
		  var rest = "";
		  var obshrest=document.body.innerHTML.match(/MM=([0-9]+)&SS=([0-9]+)/);
		  if (obshrest) {
			var resttime = obshrest[1]*60+obshrest[2]*1;
			rest = " / left "+obshrest[1]+":"+obshrest[2]+" ("+resttime+" seconds)";
		  }
		  var timeres=document.body.innerHTML.match(/FM=([0-9]+)&FS=([0-9]+)/);
		  if (timeres) {
			var waittime = timeres[1]*60+timeres[2]*1;
			SendSay("Will refresh in "+waittime+" seconds"+rest);
			setTimeout("if(SubUrl==0){refresh_page()}",waittime*1000);
		  }
		}
	  }
	},false);
  }

  if (location.href.match(/[?&]file=forest/)) {
	window.opera.addEventListener('AfterEvent.load',function(e){
	  if( e.event.target instanceof Document ) {

		/* Step 1: find out popup */
		var popup = document.getElementById('alertForm');
		if (popup) {
		  PressMsg('no');
		}

		/* Step 2: find or move */
		var d = document.getElementsByTagName("A");
		var x = 0;
		for (var i = d.length-1; i > -1; i--) {
		  if (d[i].getAttribute('onClick').match(/[?]file=forest[&]find=1/)) {
			if (d[i].parentElement.style.visibility != 'hidden') {
			  x = 1;
			}
			break;
		  }
		}
		if (x==0) {
		  for (var i = d.length-1; i > -1; i--) {
			if (d[i].getAttribute('onClick').match(/[?]file=forest[&]go=1/)) {
			  x = 2;
			  break;
			}
			if (d[i].getAttribute('onClick').match(/[?]file=forest[&]id=1/)) {
			  x = 3;
			  break;
			}
		  }
		}
		if (x!=0) {
		  if (x==1) {
			GoUrl('index.php?file=forest&find=1');
		  } else
		  if (x==2) {
			GoUrl('index.php?file=forest&go=1');
		  } else
		  if (x==3) {
			GoUrl('index.php?file=forest&id=1');
		  }
		}
	  }
	},false);
  }
