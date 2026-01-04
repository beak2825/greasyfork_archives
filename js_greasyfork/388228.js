// ==UserScript==
// @name           TreZzoR keep anonymous
// @version        1.0
// @author         Anakunda
// @namespace      https://greasyfork.org/cs/users/321857-anakunda
// @include        http://tracker.czech-server.com/comment.php?*
// @include        https://tracker.czech-server.com/comment.php?*
// @run-at         document-end
// @description    keep anonymous
// @downloadURL https://update.greasyfork.org/scripts/388228/TreZzoR%20keep%20anonymous.user.js
// @updateURL https://update.greasyfork.org/scripts/388228/TreZzoR%20keep%20anonymous.meta.js
// ==/UserScript==

for (var i of document.getElementsByName("anonymnyprisp")) { if (i.value == '1') i.checked = true; }
