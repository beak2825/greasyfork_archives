// ==UserScript==
// @name			Orlygift Compact
// @namespace		MurkBRA
// @description		Orlygift Compact Giveaway page
// @author			MurkBRA
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAjCAYAAADizJiTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAU9SURBVHjavJhvTJVVHMc/F26EqFysQEsendFiwJatyCxfpDFWNmdu9iKbLmUyar2oN0ZNo5atiNjUzZTlalQbi1fGm9JFwlhZtmyaLrSANi/ChBw8OVT+3t58n3Y4Pc/lgd31287uOb/z+/N9zjm/3++cG0kkEsxEkUgEgDixecAuYDuwAhgGjgE1Du4ffrpxYoXAXuBJYCHwJ/AZ8L6DewMgFIawQAWyFXjUR+Rv4HEH97QFshT4Fsj20TkFlDm4I2EwpBGeagyQCeB3YETjbOBonNjtBshc4KgBckQ6HqqHtdKhKBTQOLE0oFLDSaDcwS0ElgPnxXeApjixtDixdKAJyNfcr8By6awDJsSviBOLhsEQaut7IzlLgH4NTzi4ZcZH3AP8DMTEelsLsEdjFyh1cLsMna+A9Rouy08Mx1O19TeN/uI4sQj/LqPbBTxvzL9hgATYboGMAHcG2E5JMJ0F7hPrY+BDYMgQe8sCDPC5zrZHtwEvGMeo08EtTnXUPw18SWrpWQe3OaVR7+C2aCUmUwBwEqhycJvDKkS0nWuUegqAO4BczaHt/Utn71ic2N3AJmAVkDlLgDeBn4AWB7cbKANq5XORkfoG5bMbOAl8bxtaIsA7dQbPSDGhVXgHWJqCFb1L2WHSsH9GPncCjwjLtBUNY3QTUAE8KN5vQDxsxBqUqXxbrPFp4BOd/b65fPFzQBfQogTt0Vqgw1iFubYO2fJonXx1yfeMFAUaZKxdZxcgHSgE7tUu7ACuzQHgNelGZKtQtpGvdsk1CEtgYDUCY0CVeEXAR6ouCZW+eiBL29czC5A90smSjQnxXfkoks8qYWgMOpq7gOvakgygDhgPcHpWdXwF0BsCZK9k86XrJzMunxnCcF2YplEBcAPYqC9uDeG8C8hTmhpNIjcqmTzpzGS3VRg2ClOBCbQBOKR+s4/yAHBY27JD17PzQJuKRk0SxzWSaZPOXtmoks0BHx2vEBwSNgDm6Wa0CNjio7QPWBBwprcC25R2+nx0+zS3TbJ+Z26BfNi6W4SpXxjZABxQ9NlbU20ZrQX2G1c0jAJQ7eOs2pJJRtU+Rytd2DYA7FY1KrcET/gY8+b2BxSGKUNmSrwg2qdbfweQ4911LQzlwrYbIY4q4myh2QD13kGezKkkIIstX6+Iby9WnbAdiAKXldNKDENjSr4A7yoKTXrMAPs1cFz9NkW41w8iV3XeS/ZX9dsu3xkalwjb5agSMcB8w9CA8hrA6z6O7lfzyAN6zuCd89F7QCmnU8FVoWdMk+bH5TvfwtQTBa4Yd0SPFlqrm5FkdcaMu+1Fg39RvCmN3wNeU/8lpZ4vfOyZvr1H4BWAZRocsc5HkfFVOWre3GGD59Xk9YruXrWlVnaIG/o/BHx0kYXhiPcATAMuafCdpVRpvMeH1TwaNXgTuv2UKueVqfUDDxm3r5OGfhDQSmvsYbpkMmMC5X3NmBEY5lYkdKnAWPEfgZXAyzpn4+qv1Nx8Je0X9QD0uxmtkk/P/4jxBP8P1VtLP2hc9cxj4DlarEh9RsFhJ/ytmmuXbBCtkS9Ttz5ZdcjWOyVhPUEadaPJUUks0dv9qiI+R28rG+iQ5o5Ldo90M8VfK9uTll53wP9V06jE5+uStaeAzUnmN0smrL1BK6cnpWLgQkjDB4FblBvtuU7NHQxp64LxngpNWcCbAVuaMG78n+pWtNrawknxIpKZSGJnSL6ykj0/ZqJbVYNXq2JEtT2/6OwNWK+EOvVfBT4w5vKAJ1SdcgW8V1nhG6W8/5Vq1VJK/wwAXCVTS5Ic+DAAAAAASUVORK5CYII=
// @run-at			document-start
// @version			2018.04.30.0
// @grant			unsafeWindow
// @require			https://code.jquery.com/jquery-3.2.1.min.js
// @include			/^https?:\/\/(www\.)?orlygift\.com\/(giveaway|add_to_queue)/
// @downloadURL https://update.greasyfork.org/scripts/14980/Orlygift%20Compact.user.js
// @updateURL https://update.greasyfork.org/scripts/14980/Orlygift%20Compact.meta.js
// ==/UserScript==
/*/
/ lets make the timer alive and reload automatically on round end by Tackyou
$(function(){
	$('div.callout.callout-info strong:nth-of-type(2)').addClass('tempo');
	$('div.callout.callout-info strong:nth-of-type(1)').remove();
	$('div.callout.callout-info p').html('This page auto reload in ' + $('<strong class="tempo">').append($('*', 'div.callout.callout-info p')).html());
	var timelem = $('.tempo');
	if(timelem.length>0){
		var fetchtime = timelem.text();
		var hours = +(fetchtime.split(':')[0]), mins = +(fetchtime.split(':')[1].split(' h')[0]), secs = (hours * 3600 + mins * 60 + 90), currentSeconds = 0, currentMinutes = 0, currentHours = 0, count = setInterval(function() {
			currentHours = Math.floor(secs / 60 / 60);
			if(currentHours <= 9) currentHours = '0' + currentHours;
			currentMinutes = Math.floor(secs / 60) % 60;
			if(currentMinutes <= 9) currentMinutes = '0' + currentMinutes;
			currentSeconds = secs % 60;
			if(currentSeconds <= 9) currentSeconds = '0' + currentSeconds;
			secs--;
			timelem.text(currentHours + 'h ' + currentMinutes + 'm ' + currentSeconds + 's');
			if(secs == -1){ clearInterval(count); location.reload(); }
	}, 1000);
	}
});
$(window).load(function() {
});*/

$("<style>").text([
	"/* Orlygift Compact*/",
	".showSweetAlert[data-animation=pop] {transform: scale(0.5) !important;-webkit-animation: inherit !important;animation: inherit !important;}",
	".col-md-offset-2.col-md-8 > br, .ng-scope > br, .sweet-overlay, .blocked-overlay, .alert-danger, #commander-cool-banner, #orlygift_tutorial, .showSweetAlert[data-animation=pop], .ad-container, #exit-intent-guest, #exit-intent-user, .modal-backdrop.fade.in, .box.box-dange, .slider.slick-initialized.slick-slider, footer, .row.headline-container.animated > div > h4, .row.headline-container.animated > div > h3, .row.headline-container.animated > div > p, .box.box-danger, .last_claimed, .product-img, .slider, .container.home-container > .row:not(.countdown-container):not(.animated), .content-perspective > .content > .content-inner > .row > col-md-12, .nav.navbar-nav.hidden-xs, .filter-open > li.claimed, .ad-container-responsive, div[id^=div-pg-ad], .callout.callout-success br, div[id*=div-gpt-ad], a.text-center[ng-hide='!claimKeyController.hide'], .sflayer-wrapper {visibility: hidden !important; display: none !important;}",
	".container-fluid.game_page_background.ng-scope {margin-bottom: 40px !important;}",
	".products-list .product-info {margin-left: 0px !important;}",
	".stop-scrolling {overflow: inherit !important; height: inherit !important;}",
	".modal-open {overflow: auto !important;}",
	"#main {padding-bottom: 0 !important;overflow: inherit !important;}",
	".content-inner, .form-control {background: rgba(0, 52, 72, 0.7) !important;}",
	".event input[type='radio']:checked ~ .content-perspective .content-inner p, .products-list .product-description, .content-inner {color: #FFF !important;}",
	".event.finished .content-inner h3, .cc_container, .form-control, .form-control-feedback {color: #000 !important;}",
	".btn-steam {color: #000 !important;background-color: #3E581B !important;}",
	".btn-steam:hover {color: #000 !important;background-color: #304515 !important;}",
	".cc_container {background: #003448 !important; border: #003448 !important;}",
	".form-control {border: 1px solid #4B4B4B !important;}",
	".form-control:focus {border: 1px solid #000 !important;}",
	".box, .products-list > .item {background: #00222F !important;}",
	".product-list-in-box > .item, .box-header.with-border {border-bottom: 1px solid #000 !important;}",
	".box-body {overflow: auto !important;max-height: 200px !important;}",
	".info-box {background: #00532D !important;}",
	".callout.callout-info {background: #1A6A82 !important;border-color: #004C5E !important;}",
	".callout.callout-warning {background: #EB9214 !important;border-color: #A06608 !important;}",
	".btn-info {background-color: #1A6A82 !important;}",
	".btn-info:hover {background-color: #16596D !important;}",
	"#raffle-enter-button {position: fixed !important;bottom: 0px !important;width: 100% !important;z-index: 99 !important;left: 0px !important;margin-bottom: 0px !important;}",
	".event label.arrow::after {background: #1a1a1a !important;}",
	".event input[type='radio']:checked ~ .thumb {box-shadow: 0px 0px 0px 8px #1A1A1A, 0px 1px 1px #000 !important;}",
	".callout.callout-success {border-color: #003A1F !important;background: #2A602A !important;}",
	".row.headline-container.animated {transform: scale(0.5);top: -30px;position: relative;}",
	".row.countdown-container {transform: scale(0.5);position: relative;top: -120px;}",
	".timeline {margin-bottom: -160px !important;top: -160px !important;padding: 0px 0px 0px !important;}",
	".popover {background-color: #003448 !important;}",
	".popover.top > .arrow::after {border-top-color: #003448 !important;}",
	".popover-title {background-color: #1A6A82 !important;border-bottom: 1px solid #000 !important;}",
	".btn-block + .btn-block {margin-top: 0px !important;}",
	".box-body {padding: 0px 10px !important;}",
	".box-header {padding: 3px !important;}",
	".products-list > .item {padding: 0px !important;}",
	".event:not(.finished) > .content-perspective > .content > .content-inner {padding: 1px 20px !important;}",
	".event:not(.finished):not(.desativado) > .content-perspective > .content > .content-inner h3:not(.popover-title) {padding: 0px 0px !important;}",
	".event:not(.finished):not(.desativado) > .content-perspective > .content > .content-inner::before {top: 13px !important;left: -26px !important;}",
	".content-inner::before {top: 6px !important;left: -26px !important;color: #4E5D6C !important; }",
	".content-inner {border-color: #4E5D6C !important;}",
	"@-moz-document url-prefix() {",
	".event:not(.finished):not(.desativado) > .content-perspective > .content > .content-inner::before {top: 16px !important;left: -36px !important;}",
	".content-inner::before {top: 9px !important;left: -36px !important;color: #4E5D6C !important; }",
	".content-inner {border-color: #4E5D6C !important;}",
	"}",
	".event input[type='radio']:checked ~ .content-perspective .content-inner::before {color: #E3000E !important;}",
	".event input[type='radio']:checked ~ .content-perspective .content-inner {border-color: #E3000E !important;}",
	".event {margin-bottom: 10px !important;}",
	".container {width: inherit !important;}",
	".btn-box-tool {padding: 0px !important;}",
	".box-tools.pull-right {top: 1px !important;}",
	".box {border-top: 3px solid #0842B5 !important;}",
	".nav-tabs-custom > .nav-tabs > li.active > a, .nav-tabs-custom > .nav-tabs > li.active:hover > a {background-color: rgba(15,19,45,0.5) !important;color: #fff !important;}",
	".nav-tabs-custom > .tab-content {background: rgba(15, 19, 45, 0.5) !important;}",
	".nav-tabs-custom {background-color: rgba(26, 29, 56, 0.5) !important;}",
	".nav-tabs-custom > .nav-tabs > li > a {color: #999 !important;}",
	".nav-tabs-custom > .nav-tabs > li > a:hover {color: #fff !important;}",
	".nav-tabs-custom > .nav-tabs {border-bottom-color: #000 !important;}",
	".event.desativado .thumb:before {width: 59px;top: 24px;}",
	".event.desativado .content-perspective:before {top: 35px;width: 38px;}",
	".event.desativado .content-inner {border-color: #1b2838 !important;}",
	".event.desativado .thumb {width: 50px;height: 50px;box-shadow: 0 0 0 4px #485563;background-size: 50px;left: 28px;top: 9px;}",
	".event.desativado input[type='radio'] + label:after {color: #1b2838;background: #5cb85c;}",
	".event.desativado label.arrow {top: 13px;}",
	".event.desativado .content-inner::before {color: #1b2838 !important;}",
	".sweet-alert {background-color: #232323 !important;}",
	".sweet-alert button.cancel:hover {background-color: #000 !important;}",
	".sweet-alert button.cancel {background-color: #111 !important;}",
	".sweet-alert button.confirm:hover {background-color: #001823 !important;}",
	".sweet-alert button.confirm {background-color: #001B27 !important;box-shadow: none !important;}",
	".navbar {background: rgba(51, 51, 51, 0.5) !important;background: linear-gradient(to bottom, rgba(78,93,108,0.5) 0%, rgba(56, 71, 85, 0.5) 100%) !important;background: -webkit-linear-gradient(top, rgba(78,93,108,0.5) 0%, rgba(56, 71, 85, 0.5) 100%) !important;}",
	".nav-tabs-custom > .nav-tabs > li.active > a {border-top-color: transparent !important;border-left-color: transparent !important;border-right-color: transparent !important;}",
	".products-list .product-info:not(.product-icon) .product-description {font-weight: bold !important;line-height: 1.1 !important;}",
	".users-list > li > a:hover, .users-list > li > a:hover .users-list-name {color: #999 !important;}",
	".users-list-name {color: #fff !important;}",
	".users-list-date {font-weight: bold !important;color: #aaa !important;}",
	".box-body > h4 {color: #fff;}",
	"body {padding-right: 0px !important;height: inherit !important;}",
	".callout.callout-success p {margin-bottom: 0px !important;}",
	".callout.callout-success .text-center {margin-top: 0px !important;margin-bottom: 0px !important;}",
	".headline-container {padding: 0 0 10px !important;}",
	".callout.callout-info.already {background: #2d2d2d !important;border-color: #1f1f1f !important;}",
	".callout-success .form-wizard input[type='email'] {background-color: #00532d !important; color: #000 !important;border: #004224 !important;}",
	".callout-success .form-wizard .form-control:focus {border: 1px solid #000 !important;}",
	"h2.text-center.ng-hide[ng-hide='claimKeyController.hide'] {display: inherit !important;}",
	".popover.left > .arrow:after {border-left-color: #003448 !important;}",
	"",
	""
].join("\n")).appendTo(document.documentElement);

var count0 = setInterval(function() {
	if ($(".callout.callout-info:contains('already own'):not(.already)").length > 0) {
        clearInterval(count0);
		$(".callout.callout-info").addClass("already");
	} if ($(".callout.callout-info.already").length > 0) {
		clearInterval(count0);
	}
}, 0);

$(function() {

	var count = setInterval(function() {
		if ($('#time_left_countdown canvas').length <= 0) {
			clearInterval(count);
			setInterval(function() {
				location.reload();
			}, 180000);
			console.log('recarregando em 180s...');
		} else {
			//console.log('checando...');
		}
	}, 1000);

	$('.event:not(.finished)').each(function() {
		if ($(this).has('.content-perspective.inactive').length > 0) {
			$(this).addClass('desativado');
			console.log('adicionando classe');
		}
	});

	/*var count1 = setInterval(function() {
		if ($('.showSweetAlert[data-animation="pop"]').has('.sa-icon.sa-custom[style*="adblocker"]').length) {
			$('.showSweetAlert[data-animation="pop"]').remove();
			console.log('Popup removida');
		} else {
			//console.log('Checando');
			if ($('.sweet-alert.showSweetAlert.visible.show').length) {
				clearInterval(count1);
				console.log('Mostrar popup');
			} else {
				$('.showSweetAlert[data-animation="pop"].visible').addClass('show');
			}
		}
	}, 0);*/

	/*var vezes = 0;
	var count3 = setInterval(function() {
		if (++vezes >= 600) {
			clearInterval(count1);
			clearInterval(count3);
		} else {
			console.log('Não encontrado ' + vezes);
		}
	}, 100);*/
});
var count4 = setInterval(function() {
	if ($(".callout.callout-success").length) {//win
		clearInterval(count4);
		$("link[rel*='icon']").attr("href",$("link[rel*='icon']").attr("href").replace(/.*/,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA+0lEQVQ4je2RMUoDYRCFv2oJ1ik8gngGi4V//t0QXLttPIMESWFpIxI8gHWwSbHozMCSM4iVhUewSGktKdYmK2h2A1pZ+OAVw5v5GGZgo7IiEWMpzjo6j6HisM3GFftiLKPxHo2nYsGQ74rOOHOaaFyIcRaN12LBcAN+DsZN7pxmThOUyRYgvedAnLUYy6hMo/Eixq0Y58FZRWUqzl3mNLky2gIAiHIkxpU4M3FmUbkMyqStg3IdHzj5OmTUot0uK5KyIunLRanJnKbPRc1eOmewq4fgrPqczhmUFcmuns5b/EjRyMR463K7QV+eK6PP///qBsrxP+AvAD4AUW1yM6A5WdEAAAAASUVORK5CYII="));
	} else if ($(".callout.callout-info h4:contains('participate')").length) {//participate
		clearInterval(count4);
		$("link[rel*='icon']").attr("href",$("link[rel*='icon']").attr("href").replace(/.*/,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA8UlEQVQ4je2RMUpDQRCGvyoE6xQeQTyDtQQRD2CVA8TMzgYt5YFI8ADWwSbFQ2cGQs4gVhYewSKltaR4Fs9EMHkptLHwh7/Y/Wc/ZmdgqaJsIT5DY4HGI2fl/io7L3frzN9Rf2I46bCmHEfkqEh+gXif5K8MJ51P8DPJb9A4JUeF2GAd0L/fQ2OB+IxsmeQvqN+SPCExr+/ijhwVat11AIDYAepXSIyQGKF2idhgdRa7Rh5Ovj3yKWKbXZSt+gsNudgUclSNLqY79MbtrTVIzBvdG7frDrbU/F7qhyR/2+hlB025Wvdr/z+agR3/A/4C4APZ15ea4uBPowAAAABJRU5ErkJggg=="));
	} else if ($("#raffle-enter-button").length) {//enter
		clearInterval(count4);
		$("link[rel*='icon']").attr("href",$("link[rel*='icon']").attr("href").replace(/.*/,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA+ElEQVQ4je2RMUoDQRSGt1qCpb43G7Ywb2bWIM4VrCWIeADPEIJYWNqIBA/gATxD2DOIlYVHsEhpLSk+i40Rkt2AVhb+8Bcz/5uPnzdZthQp5ajVaFzg4hO7+0erTK2PWo2LH7jwTDmUbF30wylagYvXqB+j8Y1yKEvwCxLuKQ4u0ArUJpuAPTtE4wK1GqmucPEVDQ8U4RLn582df2wAcbQBaKqGY9TfUoQpRZgi4Qa1yeqs/g7x5+uPZsig3SnlpJR35jKYZU2lDpflDma9bTMZzs87bdYjpXzbTOsufiRcdYL491Z/NejKNY6+//83O5Bw9g/4C4BPz0ysQytYkvwAAAAASUVORK5CYII="));
	} else if ($(".callout.callout-info:contains('already own')").length) {//already
		clearInterval(count4);
		$("link[rel*='icon']").attr("href",$("link[rel*='icon']").attr("href").replace(/.*/,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5klEQVQ4je2RMUpDQRRFf/UJ1ilcgrgGawkido977vxmql9JkBSWNiIhC3ABrkGyhpDKwiVYpLSWFLGZiJr/A1pZeOEWw7tz3rw3VVUUEbWkObAGFhFx/Kl2WGpvtpe2h9V3pZTOgI3ta0mXtl9sDwv4SdKsaZoEbIDxDsD2EbCWNJc0AZ4l3du+AlaSJrYfSpPRDqBATlJKt7antqeSboDx9gzcARdfLgGPkjodEXUZoTdTlZk63bbtQc55sC9TAas+55wHEVHvy3Tu4keSdCrptcvbF/TVbY8+/v83O5B0/g/4C4B3E1WE/7MFEggAAAAASUVORK5CYII="));
	} else if ($(".callout.callout-info:contains('game is over')").length) {//over
		clearInterval(count4);
		$("link[rel*='icon']").attr("href",$("link[rel*='icon']").attr("href").replace(/.*/,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAdVBMVEV+XwD/wQD/xQ//xxn/wgX/wQD/wgX/wQD/wgX/wgP/wgX/wwf/wgP/wgP/wwn/wgP/wgP/wgX/wgP/wgX/wgP/wwf/wgP/wgX/wgP/wgP/wgX/wgP/wgP/wgP/wgX/wgP/wgP/wgX/wgP/wgP/wgP/wgP/wgMkKpeYAAAAJnRSTlMABggKFBgoKjxGSEpMTlpsbnBydn6DhYeJlaGztcfJz9Pj5+/5++GI3uEAAABiSURBVHjavcw3EoAwDETRlck5Y4LJ4PsfkTF2w9DzGn2pEAAS1+QBjjhnG0okq2yzaelSmUNxL1GufbGXgwzx8BvO65zzNlHbqBGZgNQsZgK7xsgEPoLjwUjPENH7R/zP4QYX9BgNtNNVhQAAAABJRU5ErkJggg=="));
	}
}, 0);

var count2 = setInterval(function() {
	if ($('.container-fluid.game_page_background.ng-scope').attr('style') !== null) {
		clearInterval(count2);
		$('body').attr('style', $('.container-fluid.game_page_background.ng-scope').attr('style') + ';background-position: center 54px;background-repeat: no-repeat;');
		$('.container-fluid.game_page_background.ng-scope').attr('style','');
	}
}, 0);

//Verifica url (find by JoeSimmons)
String.prototype.find = function(s) {
	return (this.indexOf(s) != -1);
};

var url = window.location.href.toString();

if(url.find("add_to_queue") === true) window.location.replace(url.replace("add_to_queue", "giveaway"));
	else if(url.find("giveaway") === true) {
		for(var i=0,link; (link=document.links[i]); i++) {
			if(link.href.find("add_to_queue") === true) link.href = link.href.replace("add_to_queue", "giveaway");
		}
	}

unsafeWindow.alert=function() {};