// ==UserScript==
// @name            Hack Forums - Profile Citation
// @namespace       Roger Waters
// @description     Cite Profiles while on Mobile Devices using this UserScript.
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @include         *hackforums.net/member.php?action=profile&uid=*
// @version         1.0.2
// @downloadURL https://update.greasyfork.org/scripts/11657/Hack%20Forums%20-%20Profile%20Citation.user.js
// @updateURL https://update.greasyfork.org/scripts/11657/Hack%20Forums%20-%20Profile%20Citation.meta.js
// ==/UserScript==

uid = window.location.href.replace(/[^0-9]/g, '');
username = $("span[class*='group']").text();

$("table[align='center']").find("td:first").prepend('<br /><table border="0" cellspacing="1" cellpadding="4" class="tborder"> \
<tbody><tr> \
<td colspan="2" class="thead"><strong>Profile Cite</strong></td> \
</tr> \
<tr> \
<td class="trow1"><strong>Quick Cite:</strong></td> \
<td class="trow1"><button class="button meep" style="text-align: left;">Cite</button></td> \
</tr> \
</tbody></table>');

$(".meep").on("click", function() {
    GM_setClipboard( "[url=http://www.hackforums.net/member.php?action=profile&uid=" + uid + "][color=#EFEFEF][b]" + username + "[/color][/b][/url]");
    $(".meep").text("Citation Copied to Clipboard!");;
});