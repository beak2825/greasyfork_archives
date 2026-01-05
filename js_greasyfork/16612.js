// ==UserScript==
// Andikamizer
// version 0.3
// 2016-01-29
// Copyright 2016, row_well_and_live
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details:
// <http://www.gnu.org/licenses/gpl.txt>
//
// Revision history:
// 0.1  2016-01-29: original based on
//      http://userscripts.org/scripts/show/5625
// 0.2, 0.3: added new usernames
//
// ==UserScript==
// @name          Andikamizer
// @namespace    http://tampermonkey.net/
// @description   Replace all known usernames Andika uses on wisconsin.247sports.com with REALLY_ANDIKA_IGNORE!
// @include http://wisconsin.247sports.com*
// @grant         none
// @version 0.3
// @downloadURL https://update.greasyfork.org/scripts/16612/Andikamizer.user.js
// @updateURL https://update.greasyfork.org/scripts/16612/Andikamizer.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var replacements, regex, key, textnodes, node, s;

replacements = {
	"badger99jr": "REALLY_ANDIKA_IGNORE!",
	"balancefootball": "REALLY_ANDIKA_IGNORE!",
	"instateclass": "REALLY_ANDIKA_IGNORE!",
	"uwhealth": "REALLY_ANDIKA_IGNORE!",
};

regex = {};
for (key in replacements) {
    regex[key] = new RegExp(key, 'g');
}

textnodes = document.evaluate(
    "//text()",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

for (var i = 0; i < textnodes.snapshotLength; i++) {
	
	node = textnodes.snapshotItem(i);
	s = node.data;
	
	for (key in replacements) {
		s = s.replace(regex[key], replacements[key]);
	}

	node.data = s;

} // for