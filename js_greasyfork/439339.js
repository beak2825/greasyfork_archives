// ==UserScript==
// @name         Add Block Button to Streamate User Details Pages
// @namespace    https://greasyfork.org/en/users/870933
// @version      0.4
// @description  Makes it much more convenient to block members when they are no longer in your room! Blocks from both chat and messages at once.
// @author       LintillaTaylor
// @match        https://*.streamatemodels.com/smm/userdetails.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439339/Add%20Block%20Button%20to%20Streamate%20User%20Details%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/439339/Add%20Block%20Button%20to%20Streamate%20User%20Details%20Pages.meta.js
// ==/UserScript==

var userid = (location.search.split('userid=')[1]||'').split('&')[0]

var txt = '<div style="clear:both; text-align:right;"><form method="POST" action="https://streamatemodels.com/smblock.php?" style="margin:0;"><input type="hidden" name="oldrelation[' + userid + ']" value="1028"><input type="hidden" name="blocked[' + userid + '][]" value="2" checked="1"><input type="hidden" name="blocked[' + userid + '][]" value="1024" checked="1"><button class="btn btn-danger button_short" type="submit" value="submit"><span>Block</span></button></form><br /></div>'

$('#page_body').append(txt);