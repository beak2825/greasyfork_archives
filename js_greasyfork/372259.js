// ==UserScript==
// @name         Hacker News Slick
// @namespace    userscripts.org
// @version      1.1.0
// @description  Companion userscript for the Hacker News Slick userstyle.
// @author       Elias Fotinis <efotinis@gmail.com>
// @include      https://news.ycombinator.com/*
// @downloadURL https://update.greasyfork.org/scripts/372259/Hacker%20News%20Slick.user.js
// @updateURL https://update.greasyfork.org/scripts/372259/Hacker%20News%20Slick.meta.js
// ==/UserScript==

(function(){

  // Array of XPath results snapshot.
  function snapArr(xpRes) {
    const ret = Array(xpRes.snapshotLength)
	  for (let i = 0; i < xpRes.snapshotLength; ++i) {
      ret[i] = xpRes.snapshotItem(i);
    }
    return ret;
  }

  // ---- add marker class to thread-starting comments ----

  // get <TR> elements representing top thread items in flat comment table
  const topRows = snapArr(document.evaluate(
    '//td[@class="ind"][img[@width="0"]]/ancestor::table[position()=1]/ancestor::tr[position()=1]',
    document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
  for (const x of topRows) {
    x.classList.add('threadtop')
  }
  
  // ---- move black mourning bar below header ----
  // ---- this is done to preserve node ordering so that other styles keep working ----

  const blackBar = snapArr(document.evaluate(
    '//table[@id="hnmain"]//td[@bgcolor="#000000"]/ancestor::tr', 
    document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null))[0];
  if (blackBar) {
    blackBar.remove();
    const spacerBar = snapArr(document.evaluate(
    	'//table[@id="hnmain"]/tbody/tr[position()=2]', 
    	document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null))[0];
     	if (spacerBar) {
        spacerBar.innerHTML = '<td style="background-color:#000000"></td>';
      }
  }

}())
