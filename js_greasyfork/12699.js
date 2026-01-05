// ==UserScript==
// @name         ban keyword & remove Ad & Upgrade  | inoreader.com
// @namespace    
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://inoreader.com/*
// @match        https://inoreader.com/*
// @match        http://www.inoreader.com/*
// @match        https://www.inoreader.com/*
// @run-at       document-end
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12699/ban%20keyword%20%20remove%20Ad%20%20Upgrade%20%20%7C%20inoreadercom.user.js
// @updateURL https://update.greasyfork.org/scripts/12699/ban%20keyword%20%20remove%20Ad%20%20Upgrade%20%20%7C%20inoreadercom.meta.js
// ==/UserScript==

$('#reader_pane').on('DOMSubtreeModified', function(){

	// ban keyword
	if(!$('#inpBanKeyword').length){
		$('#sb_rp_tools').prepend($('<div style="float:left;position:relative;"></div>')
			.append('<label for="inpBanKeyword" style="position:absolute;pointer-events:none;color:rgba(255,255,255,.5);font-size:12px;font-weight:lighter;padding:9px;">Ban keyword</label>')
			.append($('<input type="text" id="inpBanKeyword" title="Ban keyword" style="font-size:12px;height:24px;margin:8px 0 0 0;padding:0 25px 0 5px;border:0 none;border-radius:3px;width:200px;background-color:#2E415C;color:#F2F6FA;box-shadow:inset 0px 1px 0px 0px #000, inset 0px -1px 0px 0px #667180;">')
				.on('focus', function(){
					$('label[for="inpBanKeyword"]').css('z-index', -1);
				})
				.on('blur', function(){
					if(!$('#inpBanKeyword').val()){
						$('label[for="inpBanKeyword"]').css('z-index', '');
					}
				})
				.on('keydown', function(){
					$('.article_header_title').parents('[data-read]').css('display', 'block');
					$('.article_header_title:contains('+$('#inpBanKeyword').val()+')').parents('[data-read]').css('display', 'none');
				})
			)
		);
	}

	if($('#inpBanKeyword').val()){
		$('.article_header_title:contains('+$('#inpBanKeyword').val()+')').parents('[data-read]').css('display', 'none');
	}


	// remove ad
	$('.block_article_ad, .ad_title').remove();

	// remove upgrade
	$('#sb_rp_upgrade').remove();
});