// ==UserScript==
// @name           bw-every-timer.user
// @description    http://www.bloodyworld.com
// @include http://www.bloodyworld.com/*
// @version 0.0.1.20150604003944
// @namespace https://greasyfork.org/users/12000
// @downloadURL https://update.greasyfork.org/scripts/10246/bw-every-timeruser.user.js
// @updateURL https://update.greasyfork.org/scripts/10246/bw-every-timeruser.meta.js
// ==/UserScript==



if (!getElementsByClass) {
	function getElementsByClass(searchClass,node,tag) {
		var classElements = new Array();
		if ( node == null )
			node = document;
		if ( tag == null )
			tag = '*';
		var els = node.getElementsByTagName(tag);
		var elsLen = els.length;
		var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
		for (i = 0, j = 0; i < elsLen; i++) {
			if ( pattern.test(els[i].className) ) {
				classElements[j] = els[i];
				j++;
			}
		}
		return classElements;
	}
}

if (!bw_pt_timeouts) {
  var bw_pt_timeouts = new Array();
  function bw_pt_tick(i,tiourl) {
	bw_pt_timeouts[i] -= 1;
	if (bw_pt_timeouts[i]>=0) {
	  var h = Math.floor(bw_pt_timeouts[i] / 60 / 60);
	  var m = Math.floor((bw_pt_timeouts[i]-h*60*60) / 60);
	  var s = bw_pt_timeouts[i] - h*60*60 - m*60;
	  if (h==0) h = ""; else if (h<10) h = "0"+h+":"; else h=h+":";
	  if (m<10) m = "0"+m;
	  if (s<10) s = "0"+s;
	  document.getElementById('time'+i).innerHTML = h+m+":"+s;
	} else {
	  document.getElementById('time'+i).innerHTML = "-out-";
	  if (tiourl) {
		document.location.href = tiourl;
	  }
	  killInterval(bw_pt_timeouts[i]);
	}
  }
}

var els = getElementsByClass("distinguished", document.body, "b");
if (els.length > 0) {
  for(var i = 0; i<els.length; i++) {
	if (tm = els[i].innerHTML.match(/([0-9]{2}):([0-9]{2})/)) {
	  els[i].setAttribute('id', 'time'+i);
	  bw_pt_timeouts[i+1] = setInterval('bw_pt_tick('+i+')', 1000);
	  bw_pt_timeouts[i] = tm[1]*60+tm[2]*1;
	}
  }
}

if (rooms == 'fish' || rooms == 'forest') {
  var els = getElementsByClass("TD-MF-ContentBold", document.body, "td");
  if (els.length == 1) {
	var lefts = els[0].innerHTML.match(/([0-9]+)[ ]?(...)/g);
	bw_pt_timeouts[1] = 0;
	for(var i = 0; i<lefts.length; i++) {
	  var left = lefts[i].match(/([0-9]+)[ ]?(...)/);
	  //alert(left[2].charCodeAt(0)+left[2].charCodeAt(1)+left[2].charCodeAt(2));
	  if ( left[2].charCodeAt(0)+left[2].charCodeAt(1)+left[2].charCodeAt(2) == 3256 ) // hour
	  {
		bw_pt_timeouts[1] += left[1]*1*60*60;
	  } else
	  if ( left[2].charCodeAt(0)+left[2].charCodeAt(1)+left[2].charCodeAt(2) == 3249 ) // min
	  {
		bw_pt_timeouts[1] += left[1]*1*60;
	  } else { // sec
		bw_pt_timeouts[1] += left[1]*1;
	  }
	}
	bw_pt_timeouts[1] -= 1;
	els[0].innerHTML = els[0].innerHTML.replace(/(([0-9]+[ ]?[^ ]+[ ]?)+)/, "<span id='time1'>:$1:</span>");
	bw_pt_timeouts[2] = setInterval('bw_pt_tick(1)', 1000);
  }
}
