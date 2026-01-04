// ==UserScript==
// @name        Neopets - Submit pet page
// @namespace   nppetpage
// @description lets u submit a pet page without previewing
// @include     *.neopets.com/editpage.phtml*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35479/Neopets%20-%20Submit%20pet%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/35479/Neopets%20-%20Submit%20pet%20page.meta.js
// ==/UserScript==

//alert($('table').text());
$('form[action="/preview_homepage.phtml"]').attr("action", "process_editpage.phtml");
$('input[value="Preview Changes"]').attr("value", "Save Changes");