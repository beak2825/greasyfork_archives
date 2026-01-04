// ==UserScript==
// @name         Проверка ТС Автокод
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Оптимизация процесса проверки
// @author       М
// @run-at       document-body
// @include      https://avtocod.ru*
// @downloadURL https://update.greasyfork.org/scripts/39124/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%A2%D0%A1%20%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D0%BE%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/39124/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%A2%D0%A1%20%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D0%BE%D0%B4.meta.js
// ==/UserScript==
$(function(){
    $("div.header-line").remove();
    $("div.header-nav").remove();
    $("div.section-mobile").remove();
    $("div.section-icon").remove();
    $("div.section-sr").remove();
    $("div.section-phone").remove();
    $("div.section-sp").remove();
    $("div.section-info").remove();
    $("footer.footer").remove();
    $("div#order-delivery-modal").remove();
    $("div#order-payment-modal").remove();
    $("div.form-buy").remove();
    $("div.spr-block").remove();
    $("div.search-block__helper-tooltip").remove();
    $("a.re-link").remove();
    $("nav.st-nav").remove();
    $("div.md-block__right").remove();
    $("div.ac-lists").remove();
    $("div.promo-price").remove();
    $("div.js-refresh__load2").remove();
     $("div#report-panel-top").remove();
     $("div.slide-list.js-float-block").remove();
     $("div#summary").remove();
    $("div#identifiers").remove();
    $("div#registration-actions").remove();
    $("div#mileages").remove();
    $("div#accidents").remove();
    $("div#vin-checksum-validation").remove();
    $("div#restrictions").remove();
    $("div#stealings").remove();
    $("div#taxi").remove();
    $("div#utilizations").remove();
    $("div#pledges").remove();
    $("div#osago").remove();
    $("div#diagnostic-cards").remove();
    $("div#calculate").remove();
    $("div#customs").remove();
    $("div#fines").remove();
    $("div#my-order").remove();
    $("div#recomendations").remove();
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