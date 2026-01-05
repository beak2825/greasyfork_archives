// ==UserScript==
// @id             terrhq-admin
// @name           Terrhq-admin login redirector
// @version        1.0
// @namespace      terrhq.ru
// @author         i.polyakov
// @description    Script halps to redirect to page, that you have been opened after login when session expired.
// @include        http://*.terrhq.ru/admin/*
// @include        http://l.s2.jugger.mail.ru/admin/*
// @run-at         document-end

// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js

// @history        2011-12-27 - v0.1 - i.polyakov - First version. Changing form action url when logging in.
// @downloadURL https://update.greasyfork.org/scripts/3540/Terrhq-admin%20login%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/3540/Terrhq-admin%20login%20redirector.meta.js
// ==/UserScript==


(function () {

if ($('h5').eq(0).text() == 'Вход' && $('input[name="form[login]"]').length) {
	$('form').attr('action', '');
}

})();
