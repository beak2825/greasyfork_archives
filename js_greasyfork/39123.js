// ==UserScript==
// @name         Проверка ТС Авторапорт
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Оптимизация процесса проверки
// @author       М
// @run-at       document-end
// @include      https://avtoraport.ru*
// @downloadURL https://update.greasyfork.org/scripts/39123/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%A2%D0%A1%20%D0%90%D0%B2%D1%82%D0%BE%D1%80%D0%B0%D0%BF%D0%BE%D1%80%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/39123/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%A2%D0%A1%20%D0%90%D0%B2%D1%82%D0%BE%D1%80%D0%B0%D0%BF%D0%BE%D1%80%D1%82.meta.js
// ==/UserScript==
$(function(){
    $("nav.head-nav").remove();
    $("div.grey-line").remove();
    $("div.percent-block").remove();
    $("div.smt-block").remove();
    $("div.last-check").remove();
    $("div.tr-block").remove();
    $("div.wrap.text-format.big-text-format.article-about").remove();
    $("div.auditory-block.overflow").remove();
    $("div.address-map").remove();
    $("footer.footer-bl").remove();
    $("div.auditory-block.overflow").remove();
    $("div#reg").remove();
    $("div#auth").remove();
    $("div#reportPay").remove();
    $("div#reportPackagePay").remove();
    $("div#searchHistory").remove();
    $("div#packagePay").remove();
    $("div#buy-options").remove();
    $("div.dvt-block.wfb").remove();
    $("div.wrap-ep-block.close").remove();
    $("ul.clear-ul.rc-list.three-row").remove();
});

jQuery(document).on('page:load', runChat);
jQuery(document).ready(function($) {runChat();});

jQuery(document).on('page:load', runChat);
jQuery(document).ready(function($) {runChat();});

// Chat online jivo
function runChat(){
	$('#jivo-iframe-container, .jivo_shadow, [src*="//code.jivosite"]').remove();

	delete(window.jivo_api);
	delete(window.jivo_config);
	window.jivo_magic_var = undefined;

	window.$jivosite = null;
	(function(d,s){
		var z = $jivosite=function(c){ z._.push(c) },
		    el_script = z.s = d.createElement(s),
		    e=d.getElementsByTagName(s)[0],
		    jivo_id = 'ID-MY-ACCOUNT';

		z.set=function(o){
			z.set._.push(o)
		};
		
		z._=[];
		z.set._=[];
		$.async = !0;
		el_script.setAttribute("charset","utf-8");
		
		el_script.src='//code.jivosite.com/script/widget/'+jivo_id;
		z.t=+new Date;
		el_script.type="text/javascript";
		e.parentNode.insertBefore(el_script,e)
	})(document,"script");
}