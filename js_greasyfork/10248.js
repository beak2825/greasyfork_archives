// ==UserScript==
// @name           bw-fix-flashobject
// @description    http://www.bloodyworld.com
// @include http://www.bloodyworld.com/*
// @exclude http://www.bloodyworld.com/xfn/*
// @exclude http://www.bloodyworld.com/xfn2/*
// @version 0.0.1.20150604004150
// @namespace https://greasyfork.org/users/12000
// @downloadURL https://update.greasyfork.org/scripts/10248/bw-fix-flashobject.user.js
// @updateURL https://update.greasyfork.org/scripts/10248/bw-fix-flashobject.meta.js
// ==/UserScript==
// (c) Anton Fedorov aka DataCompBoy, 2006-2007
// Clan <The Keepers of Balance>.

  window.opera.defineMagicFunction(
	'getFlashMovieObject',
	function (real, thisObject, movieName) {
	  return document.embeds[movieName];
	}
  );
