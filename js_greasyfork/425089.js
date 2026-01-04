// ==UserScript==// @name Resize Forum-Auto
// @version 1.3
// @author Sly_North
// @description Restyle forum-auto.caradisiac.com
// @grant none
// @include https://forum-auto.caradisiac.com*
// @namespace https://forum-auto.caradisiac.com
// @license MIT
// @icon https://content-eu.invisioncic.com/m304542/monthly_2020_11/android-chrome-36x36.png
// @downloadURL https://update.greasyfork.org/scripts/425089/Resize%20Forum-Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/425089/Resize%20Forum-Auto.meta.js
// ==/UserScript==

console.log('ResizeForumAuto - Begin');

SetStyleByClass = function(name, style) {
  var elts = document.getElementsByClassName(name);
  if (elts.length > 0) {
    for (var i = 0; i < elts.length; ++i)
    elts[i].setAttribute('style', style);
  }
  else console.log('ResizeForumAuto - Element class not found: ' + name);
}

SetStyleById = function(name, style) {
  var elt = document.getElementById(name);
  if (elt) elt.setAttribute('style', style);
  else console.log('ResizeForumAuto - Element id not found: ' + name);
}

ResizeByClass = function(name) {
  SetStyleByClass(name, 'width: 100vw; max-width: 90vw; margin: 0px; margin-left: 2vw;');
}

ResizeAll = function() {
	ResizeByClass('main');
	ResizeByClass('ipsLayout_container');

  var hasSideBar = document.getElementsByClassName('ipsWidget').length > 1;
  if (hasSideBar) {
  	// Side bar
  	SetStyleByClass('ipsLayout_sidebar', 'padding-left: 10px;min-width: 250px;');
  } else {
  	SetStyleByClass('ipsLayout_sidebarright', 'display: none;');
  }

  // Messages
  SetStyleByClass('ipsComment', 'margin-bottom: 5px;');

  SetStyleById('ipsLayout_contentArea','background: rgb(220, 220, 220);');
  SetStyleByClass('ipsComment_author', 'padding: 0 !important;');
  SetStyleByClass('ipsComment_meta', 'padding: 0;');
  SetStyleByClass('ipsItemControls', 'padding: 0; min-height: 35px; height: 35px;'); // message controls
  SetStyleByClass('ipsPadding_vertical', 'padding: 0; max-height: 70px; overflow: hidden;'); // message signature
  
  // Quotes
  SetStyleByClass('ipsQuote_contents', 'font-size: 75%;');
  SetStyleByClass('ipsQuote_citation', 'max-height: 20px; padding: 0;');
}

setTimeout(100, ResizeAll());
setTimeout(500, ResizeAll());
setTimeout(5000, ResizeAll());
console.log('ResizeForumAuto - End');