// ==UserScript==
// @name         DM Silme
// @namespace   59761e192afd281cfb547695172dbb08
// @version      1.2.3
// @description  MesajlarÄ± daha kolay silmeniz iÃ§in size buton hazÄ±rladÄ±m.
// @author       Nebi GarcÄ±
// @match        https://twitter.com/*
// @grant        none
// @require http://code.jquery.com/jquery-2.1.0.min.js
// @icon        https://monkeyguts.com/icon/577.jpg
// @downloadURL https://update.greasyfork.org/scripts/30698/DM%20Silme.user.js
// @updateURL https://update.greasyfork.org/scripts/30698/DM%20Silme.meta.js
// ==/UserScript==

// dm silme butonlarÄ± tÃ¼m dm'ler //
$("#dm_dialog_conversation_list").find(".twttr-dialog-header > h3").after("<div class='tumunu_sil' style=' width: 175px; float: left; padding: 0px; margin: -5px 5px;'><input title='KaÃ§ mesaj atlansÄ±n?' value='0' class='input-small' style='width: 15px; margin:0px 3px' type='text' id='atla'/><input class='btn js-prompt-cancel small' type='button' id='tum_dm_start' title='AtladÄ±ÄŸÄ±nÄ±z hariÃ§ tÃ¼mÃ¼ silinecek' value='Temizle' style='margin:0px 3px'/><input title='Ä°ÅŸlem bitir' class='btn js-prompt-cancel small hidden' type='button' id='tum_dm_stop' value='Bitir' style='margin:0px 3px'/></div>")
$(".dm-toolbar >.mark-read >.btn.mark-all-read.js-mark-all-read.js-tooltip.small").click(function(){
$("#tum_dm_start, #atla").addClass("hidden");
});
	$(".dm-toolbar > .mark-read-confirm >.btn.js-prompt-cancel.small, .dm-toolbar > .mark-read-confirm >.btn.caution-btn.js-prompt-ok.js-initial-focus.small").click(function(){
	setTimeout(function(){
		$("#tum_dm_start, #atla").removeClass("hidden");
	},1000);
});
$("#tum_dm_start").click(function(){
		$("button.modal-btn.modal-close.js-close").click(function(){
			clearInterval(tum_dm_sil);
			$("#tum_dm_stop").addClass("hidden");
			$("#tum_dm_start, #tek_dm_start").removeClass("hidden");
		});
		$("#tum_dm_stop").removeClass("hidden");
		$("#tum_dm_start, #tek_dm_stop, #tek_dm_start").addClass("hidden");
		tum_dm_sil = setInterval(function(){
			var kac_mesaj_atla = $("#atla").val();
			$(".dm-thread.js-dm-thread.clearfix")[kac_mesaj_atla].click();
			if ($('.dm').length === 0){
				$("a.js-dm-header-title").click();
				$(".dm-thread.js-dm-thread.clearfix")[kac_mesaj_atla].click();
			}
			if ($('.dm-error.js-dm-error').css('display') === 'block') {
				clearInterval(tum_dm_sil);
				alert("Sunucu hatasÄ± aldÄ±nÄ±z. Ä°ÅŸlem durduruldu. MesajÄ± elle silmeyi deneyin, silinmiyorsa mesajÄ± atla deÄŸerini arttÄ±rÄ±n tekrar uygulayÄ±n.")
				$("#tum_dm_stop").addClass("hidden");
				$("#tum_dm_start, #tek_dm_start").removeClass("hidden");
			}
			if ($('.dm').length){
				$("div.dm-convo > .dm:first-child").addClass('marked-for-deletion');
				$('.t1-form.dm-tweetbox.tweet-form').addClass('dm-deleting');
				$("button.btn.caution-btn.js-prompt-ok.js-initial-focus").click();
			}
		},1500);
});
$("#tum_dm_stop").click(function(){
	clearInterval(tum_dm_sil);
	$("#tum_dm_stop").addClass("hidden");
	$("#tum_dm_start, #tek_dm_start").removeClass("hidden");
});
// dm silme butonlarÄ± tek dm //
$("#dm_dialog_conversation").find(".twttr-dialog-header > h3").after("<div class='tek_dm_sil' style=' width: 160px; float: left; padding: 0px; margin: -3px 5px;'><input title='Bu kiÅŸiyle olan tÃ¼m konuÅŸmalarÄ± siler' class='btn js-prompt-cancel small' type='button' id='tek_dm_start' value='TÃ¼mÃ¼nÃ¼ sil' style='margin:0px 3px'/><input class='btn js-prompt-cancel small follow-button hidden' type='button' id='tek_dm_stop' title='iÅŸlemi iptal eder' value='Ä°ptal' style='margin:0px 3px'/></div>")
$("#tek_dm_start").click(function(){
	$("button.modal-btn.modal-close.js-close").click(function(){
		clearInterval(tek_dm_sil);
		$("#tek_dm_start").removeClass("hidden");
		$("#tek_dm_stop").addClass("hidden");
	})
	$("#tek_dm_start").addClass("hidden");
	$("#tek_dm_stop").removeClass("hidden");
var kllnc = $("div").find(".dm-convo").attr('data-thread-id');
	tek_dm_sil = setInterval(function(){
	if (!$('.dm').length){
		clearInterval(tek_dm_sil);
		$("#tek_dm_start").removeClass("hidden");
		$("#tek_dm_stop").addClass("hidden");
		return false;
	}
	$("div.dm-convo> .dm:first-child").addClass('marked-for-deletion');
	$('#dm_dialog_conversation').find('.t1-form.dm-tweetbox.tweet-form').addClass('dm-deleting');
	$("button.btn.caution-btn.js-prompt-ok.js-initial-focus").click();
	},500);
});
$("#tek_dm_stop").click(function(){
	clearInterval(tek_dm_sil);
	$("#tek_dm_start").removeClass("hidden");
	$("#tek_dm_stop").addClass("hidden");
});



