// ==UserScript==
// @name           bw-show-flash.user
// @description    http://www.bloodyworld.com
// @include http://www.bloodyworld.com/*
// @exclude http://www.bloodyworld.com/xfn/*
// @exclude http://www.bloodyworld.com/xfn2/*
// @version 0.0.1.20150604004538
// @namespace https://greasyfork.org/users/12000
// @downloadURL https://update.greasyfork.org/scripts/10251/bw-show-flashuser.user.js
// @updateURL https://update.greasyfork.org/scripts/10251/bw-show-flashuser.meta.js
// ==/UserScript==
// (c) Anton Fedorov aka DataCompBoy, 2006-2007
// Clan <The Keepers of Balance>.

{
  var w = window.wrappedJSObject ? window.wrappedJSObject : window;
  if (w.flashShow) w.flashShow();
}
