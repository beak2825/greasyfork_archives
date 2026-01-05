// ==UserScript==
// @name           bw-fix-battle
// @description    http://www.bloodyworld.com
// @include http://www.bloodyworld.com/*
// @exclude http://www.bloodyworld.com/xfn/*
// @exclude http://www.bloodyworld.com/xfn2/*
// @version 0.0.1.20150604004031
// @namespace https://greasyfork.org/users/12000
// @downloadURL https://update.greasyfork.org/scripts/10247/bw-fix-battle.user.js
// @updateURL https://update.greasyfork.org/scripts/10247/bw-fix-battle.meta.js
// ==/UserScript==



  window.opera.defineMagicVariable(
	'TotalDEF',
	function(x) {
	  bDEF = document.getElementsByName('shit[]');
	  tot = 0;
	  for (i=0; i<bDEF.length; i++) {
		  if (bDEF[i].checked)
			  tot ++;
	  }
	  return tot;
	},
	null
  );

  window.opera.defineMagicFunction(
	'AddShitDEF',
	function(x) {
	  if  (TotalDEF<=MaxTotalDEF) { return 1; }
	  else
	  {
		alert('Maximum '+MaxTotalDEF+' defend points');
		return 0;
	  }
	}
  );

  window.opera.defineMagicVariable(
	'TotalATK',
	function(x) {
	  tot = 0;
	  bATK = document.getElementsByName('fire');
	  for (i=0; i<bATK.length; i++) {
		  if (bATK[i].checked)
			  tot ++;
	  }
	  bATK = document.getElementsByName('fire[]');
	  for (i=0; i<bATK.length; i++) {
		  if (bATK[i].checked)
			  tot ++;
	  }
	  return tot;
	},
	null
  );

  window.opera.defineMagicFunction(
	'AddShitATK',
	function(x) {
	  if  (TotalATK<=MaxTotalATK) { return 1; }
	  else
	  {
		alert('Maximum '+MaxTotalATK+' attack points');
		return 0;
	  }
	}
  );
