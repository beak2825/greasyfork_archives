// ==UserScript==
// @name       jawz Rate channels according to our instructions
// @version    1.00
// @author	   jawz
// @description  nada
// @match      https://s3.amazonaws.com/mturk_bulk/hits/*
// @match      https://www.google.com/evaluation/endor/mturk*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/14739/jawz%20Rate%20channels%20according%20to%20our%20instructions.user.js
// @updateURL https://update.greasyfork.org/scripts/14739/jawz%20Rate%20channels%20according%20to%20our%20instructions.meta.js
// ==/UserScript==

$('input[value="Not Trashy"]').prop('checked', true);

$('textarea').text('Not trashy.');
$('textarea').last().text('');
$('table').eq(0).hide();
$('table').eq(1).hide();
$('table').eq(2).hide();