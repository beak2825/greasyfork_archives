// ==UserScript==
// @name        Qaptcha pass
// @namespace   https://greasyfork.org/fr/users/11667-hoax017
// @description Pass captcha
// @include     *
// @version     1.1.1
// @grant       none
// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/33097/Qaptcha%20pass.user.js
// @updateURL https://update.greasyfork.org/scripts/33097/Qaptcha%20pass.meta.js
// ==/UserScript==
$ = jQuery.noConflict(true);
$(document).ready(function($) {
    function success(data){
        $('div.QapTcha input[type="hidden"]').val('');
        $btn = $('div.QapTcha').parent().find('input[type="submit"]');
        if (!$btn) {
            throw "Submit button not found"
        }
        $btn.prop("disabled",false);
        $btn.click();
    };
	var name = $('div.QapTcha input[type="hidden"]').attr('name');
	if (name) {
		$.ajax({
				type:"POST",
				url:"/php/Qaptcha.jquery.php",
				data:"qaptcha_key="+name+"&action=qaptcha",
				cache:false,
				success:success
		});
	}
});