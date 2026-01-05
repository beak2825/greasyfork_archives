// ==UserScript==
// @name           Green SSL Password Fields
// @namespace      http://khopis.com/scripts
// @description    Colors the passwd field green if secure, red if not
// @include        *
// @icon           http://img402.imageshack.us/img402/3606/securecubegreen.png
// @author         Adam Katz <scriptsATkhopiscom>
// @version        0.3+20120322
// @copyright      2010-2012 by Adam Katz
// @license        AGPL v3+
// @licstart       The following is the entire license notice for this script.
/* 
 * Copyright (C) 2010-2012  Adam Katz
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.  This program is distributed in the hope that
 * it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License at <http://www.gnu.org/licenses>.
 */ 
// @licend         The above is the entire license notice for this script.
// @downloadURL https://update.greasyfork.org/scripts/1883/Green%20SSL%20Password%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/1883/Green%20SSL%20Password%20Fields.meta.js
// ==/UserScript==

var ssl_bg   = "#cfb";  // green background for SSL-protected password fields
var plain_bg = "#fcb";  // red background for non-SSL-protected password fields

var rel_ssl = rel_plain = '';
var pw_field = 'input[type="password"]';

var forms = document.getElementsByTagName("form");

// For each form, on each password field, note the domain it submits to
// (unless it's the same domain as the current page).  TODO: strip subdomains
for (var f=0, fl=forms.length; f < fl; f++) {
  var submitDom = forms[f].action.match(/^https?:..([^\/]+)/i);

  var pws = document.evaluate("//input[@type='password']", forms[f], null,
                       XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

  if (!pws || !submitDom || !submitDom[1] || submitDom[1] == location.host)
    { continue; }

  for (var p=0, pl=pws.snapshotLength; p < pl; p++) {
    pws.snapshotItem(p).title = "Form submits to '" + submitDom[1] + "' "
                                  + pws.snapshotItem(p).title;
  }
}

function cssbg(sel, bgcolor) {
  return sel + pw_field
             + ' { color:#000; background:' + bgcolor + '!important; }\n';
}

if (location.protocol == "https:") { rel_ssl   = pw_field + ", "; }
else                               { rel_plain = pw_field + ", "; }

var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(
  cssbg(rel_ssl   + 'form[action^="https://"] ', ssl_bg) +
  cssbg(rel_plain + 'form[action^="http://"] ', plain_bg)
));
var head = document.getElementsByTagName("head");
head && head[0] ? head = head[0] : head = document.body;
head.appendChild(style);
