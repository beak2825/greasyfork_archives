// ==UserScript==
// @name         ITÜ Uzaktan Eğitim Videoları
// @version      1
// @description  Uzaktan eğitim videolarının pencere boyutunu büyütür. Ekranın yarısına dersi açıp diğer yarısında not alırken iyi oluyor.
// @author       nc297
// @match        https://ninova.itu.edu.tr/Sinif/*/UzaktanEgitim
// @match        https://ninova.itu.edu.tr/members/ogrenci.sinif.adobezoom.toplanti.listele.aspx?eId=*&sinifId=*&dersId=*
// @run-at       idle
// @grant        none

// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
/* global $ */
// @namespace https://greasyfork.org/users/713869
// @downloadURL https://update.greasyfork.org/scripts/418192/IT%C3%9C%20Uzaktan%20E%C4%9Fitim%20Videolar%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/418192/IT%C3%9C%20Uzaktan%20E%C4%9Fitim%20Videolar%C4%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

	$('#vimeoModal').css('padding-top','20px');
	$('#vimeoModal .modal-content').css('height','670px').css('width','940px');
	$('#vimeoModal .modal-content > div').css('margin-left','-20px');
	$('#vimeoIframe').attr('width', '980px').attr('height', '680px');

})();