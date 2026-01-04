// ==UserScript==
// @name         Dizilab remove all ads
// @namespace    chai.agency
// @version      0.6
// @description  İlk girdiğinizde reklamları göreceksiniz, 1 kez yenileyin tümü gidecek.
// @author       webknight
// @match        dizilab.net/*
// @match        dizilab.me/*
// @match        dizilab.com/*
// @require 	https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require 	https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.0.4/js.cookie.min.js
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       PRO_addStyle
// @grant       addStyle
// @downloadURL https://update.greasyfork.org/scripts/33810/Dizilab%20remove%20all%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/33810/Dizilab%20remove%20all%20ads.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$( document ).ready(function() {
$("body").css({'background-image': 'url(http://dizilab.net/template/assets/images/body-bg.png)'});
});

for (i = 0; i < 50; i++) {
    var datads = "ads" + [i];
    var date = new Date(), rekapat = datads;
	date.setTime(date.getTime() + (3600 * 60 * 60 * 1000));
	Cookies.get('di_'+rekapat, 'value', {expires: date, path: '/' });
	$(this).parent().parent().remove();
	if(rekapat=="ads17") {
		$("li.date").removeAttr("style");
	}
}
date.setTime(date.getTime() + (3600 * 60 * 60 * 1000));
Cookies.get('new_popalbet', 'value', {expires: date, path: '/' });
Cookies.get('ppu_main_141698d9c1958de03e5b51c146b9f99f', 'value', {expires: date, path: '/' });
Cookies.get('ppu_sub_141698d9c1958de03e5b51c146b9f99f', 'value', {expires: date, path: '/' });
Cookies.get('ppu_delay_141698d9c1958de03e5b51c146b9f99f', 'value', {expires: date, path: '/' });
