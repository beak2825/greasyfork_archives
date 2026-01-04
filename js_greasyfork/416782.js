// ==UserScript==
// @name          No Signature in Specific Forums
// @namespace     קנאפער ידען
// @description   Removes Post Signature in Bais HaMedrash and News Forums
// @match        *.ivelt.com/forum/posting.php*
// @version       1
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/416782/No%20Signature%20in%20Specific%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/416782/No%20Signature%20in%20Specific%20Forums.meta.js
// ==/UserScript==

var $ = window.jQuery;
if ($('#page-header > div.navbar:contains("בית המדרש דקהלתינו"), div.navbar:contains("אידישע און וועלטליכע נייעס")').length > 0) {
    $("input[name='attach_sig']:checkbox").prop('checked',false);
}