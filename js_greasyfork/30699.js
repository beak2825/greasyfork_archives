// ==UserScript==
// @name         Toplu Takipet Takip bırak
// @namespace   a227c7ce767b71176c5c72e696e35bd1
// @version      1.1.1
// @description  Profil menüsüne takip etme ve takipten çıkma bağlantıları ekler
// @author       You
// @match        https://twitter.com/*
// @grant        none
// @require http://code.jquery.com/jquery-2.1.0.min.js
// @icon        https://monkeyguts.com/icon/585.jpg
// @downloadURL https://update.greasyfork.org/scripts/30699/Toplu%20Takipet%20Takip%20b%C4%B1rak.user.js
// @updateURL https://update.greasyfork.org/scripts/30699/Toplu%20Takipet%20Takip%20b%C4%B1rak.meta.js
// ==/UserScript==
$(".pull-right").find(".current-user").after("<li class='dropdown-divider' role='presentation'></li><li class='not-blocked' role='presentation'><button class='dropdown-link' id='liteyi_takip_et'>Listeyi takip et</button></li><li role='presentation'><button type='button' class='dropdown-link' title='Geri takip yapmayanlar takipten çıkılacak' id='takipten_cik'>Takipten çık</button></li>")
$("#liteyi_takip_et").click(function(){
	$("#user-dropdown").removeClass("open");
	$("#takibi_durdur").removeClass("visuallyhidden");
	$('#takibi_durdur').attr('id', 'takip_etmeyi_durdur');
	takip_yap = setInterval(function(){
	$(".ProfileCard-bio.u-dir:empty, .ProfileCard-bio.u-dir[dir='rtl']").parents(".Grid-cell.u-size1of2.u-lg-size1of3.u-mb10").remove();
	$('div.not-following:not(.protected) > button.js-follow-btn').each(function(){
	        $(this).click();
			$(".message-text > a").each(function(){
				if ($('.alert-messages').css('top') === '46px') {
					$('#takip_etmeyi_durdur').attr('id', 'takibi_durdur');
                    $("#takibi_durdur").addClass("visuallyhidden");
					clearInterval(takip_yap);
					clearInterval(yu);
					clearInterval(as);
					alert("Takip limitiniz doldu. Bugün daha fazla takip yapamazsınız.")
				}
			 })
	    });
		setTimeout(function() {
			$(".Grid.Grid--withGutter[data-component-term='user'], ProfileClusterFollow").remove();	
		},1000);
	},2000); 
	var yu = setInterval(function() {
		window.scrollTo(0,document.body.scrollHeight);
	},1000);
	var as = setInterval(function() {
		window.scrollTo(0,document.body.scrollBottom);
	},2020);
	$("#takip_etmeyi_durdur").click(function(){
		clearInterval(takip_yap);
		clearInterval(yu);
		clearInterval(as);
	$('#takip_etmeyi_durdur').attr('id', 'takibi_durdur');
	$("#takibi_durdur").addClass("visuallyhidden");
		});
 });

