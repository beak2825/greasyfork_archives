// ==UserScript==
// @name       jawz Peter Burke
// @version    1.0
// @description  something useful
// @match      https://www.google.com/evaluation/endor/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/11285/jawz%20Peter%20Burke.user.js
// @updateURL https://update.greasyfork.org/scripts/11285/jawz%20Peter%20Burke.meta.js
// ==/UserScript==

$('textarea').hide();
for (i = 0; i < 10; i++) {
$('input[name=relevance_' + i + '][value="1"]').prop('checked', true);
$("input[name=relevanceq_" + i + "][value=1]").prop('checked', true);
}