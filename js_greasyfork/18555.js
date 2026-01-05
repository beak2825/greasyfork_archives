// ==UserScript==
// @name         Hide HF logo
// @description  Hides the hackforums logo
// @namespace    hf_hide_logo
// @version      0.1
// @author       Remix
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @include      http://*.hackforums.net/*
// @include      http://hackforums.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/18555/Hide%20HF%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/18555/Hide%20HF%20logo.meta.js
// ==/UserScript==

hide = GM_getValue('hide', false);

if (hide) {
    $("img[src='http://hackforums.net/images/modern_bl/logo_bl.gif']").hide();
}

if (location.href.match(/usercp.php/i)) {
    $('select[name="daysprune"]').after('<br><input type="checkbox" id="hide_logo" name="hide_logo"><span class="smalltext"><label for="hide_logo">Hide logo</label></span>');
    
    var element = $('input[name="hide_logo"]');
    element.css('font-size', '9pt');
    element.css('margin-top', '10px');
    element.attr('checked', hide);

    $('input[name="regsubmit"]').on('click', function() {
        GM_setValue('hide', $('input[name="hide_logo"]').prop('checked'));
    });
}