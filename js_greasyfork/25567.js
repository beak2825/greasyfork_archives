// ==UserScript==
// @name       Image Recognition Co
// @author		jawz
// @version    1.0
// @description Doin stuff
// @match      https://image-recognition-hits.s3.amazonaws.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/25567/Image%20Recognition%20Co.user.js
// @updateURL https://update.greasyfork.org/scripts/25567/Image%20Recognition%20Co.meta.js
// ==/UserScript==

if ($('#general_instructions_header').length) {
    $('label[class="btn btn-danger"]').click();
}