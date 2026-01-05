// ==UserScript==
// @name	NYT Single-Page Format v1.3
// @version	1.3
// @namespace	http://www.greasyfork.org
// @description	Rewrites New York Times links to ask for single page format.  v1.3 imported from userscripts.org.  Derived from bodosom.net version.
// @include	http://*.nytimes.com/*
// @include	http://*nytimes.com/*
// @include	*nytimes.com*
// @downloadURL https://update.greasyfork.org/scripts/2636/NYT%20Single-Page%20Format%20v13.user.js
// @updateURL https://update.greasyfork.org/scripts/2636/NYT%20Single-Page%20Format%20v13.meta.js
// ==/UserScript==

(function()
{
  var xpath = "//a[contains(@href,'.html')]";
  var res = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  var i, link;

  for (i = 0; link = res.snapshotItem(i); i++)
  {
     var add;
     if (link.href.search(/javascript/) >= 0)
     {
       //do nothing
     }
     else if (link.href.search(/index/) >= 0)
     {
        //do nothing
     }
     else if (link.href.search(/pagewanted=print/) >= 0)
     {
        //do nothing
     }
     else if (link.href.search(/\?/) >= 0)
     {
       add = '&';
       link.href = link.href + add + 'pagewanted=all';
     }
     else
     {
       add = '?';
       link.href = link.href + add + 'pagewanted=all';
     }
   }
}
)();