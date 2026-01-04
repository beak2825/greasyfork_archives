// ==UserScript==
// @name			HackForums Moderation Pack
// @namespace		Xerotic
// @description		Moderation pack to help Mentors/Staff/Admins on HF.
// @include			https://hackforums.net*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @version			1.0.1
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/38005/HackForums%20Moderation%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/38005/HackForums%20Moderation%20Pack.meta.js
// ==/UserScript==
 
 
(function() {
	var $j = jQuery.noConflict();
	
	pageTitle = location.href.toLowerCase();
	
	if(pageTitle.includes("showthread.php") && $j('form[id="moderator_options"]').length !== 0) {
		var openclose = ($j('input[name="modoptions[closethread]"]').attr('checked') == 'checked') ? 'closed' : 'open';
		
		$j('#content').find('div[class="float_right"]').has('a[href^="newreply.php"]').each(function() {
			var $junk_button = $j('<a href="javascript:void(0);" class="button new_reply_button xero_junk_thread"><span>Junk</span></a>');
			var $openclose_button = $j('<a href="javascript:void(0);" class="button new_reply_button xero_openclose_thread"><span>' + (openclose == 'open' ? 'Close' : 'Open') + '</span></a>');
			$junk_button.prependTo($j(this));
			$openclose_button.prependTo($j(this));
			$junk_button.before('&nbsp;');
		});
		
		$j('.xero_openclose_thread').click(function(e) {
			var form_post_key = $j('input[name="my_post_key"]').val();
			var form_tid = $j('input[name="tid"]').val();
			var openmessage = (openclose == 'open' ? 'close' : 'open');
			$.prompt('Do you want to ' + openmessage + ' this thread?', {
				buttons:[
						{title: 'Yes', value: true},
						{title: 'No', value: false}
				],
				submit: function(e,v,m,f){
					if(v === true) {
						var formData = {
							my_post_key: form_post_key,
							tid: form_tid,
							modtype: 'thread',
							action: 'openclosethread',
							url: 'misc.php',
							confirm: 1
						};
						$j.ajax({
							type: 'POST',
							url: 'moderation.php',
							data: formData,
							encode: true
						 }).done(function(data) {
							if(data.length > 100) {
								$.jGrowl('Sorry but there was an error trying to ' + openmessage + ' this thread. Please try again.', {theme:'jgrowl_error'});
							} else {
								location.reload();
							}
						});	
					}
				}
			});	
		});
		
		$j('.xero_junk_thread').click(function(e) {
			var form_post_key = $j('input[name="my_post_key"]').val();
			var form_tid = $j('input[name="tid"]').val();
			var fid = $j('div[class="navigation"]').find('a[href*="forumdisplay.php"]:last').attr('href').split('?fid=')[1];
			$.prompt('Do you want to JUNK this thread?', {
				buttons:[
						{title: 'Yes', value: true},
						{title: 'No', value: false}
				],
				submit: function(e,v,m,f){
					if(v === true) {
						var formData = {
							my_post_key: form_post_key,
							tid: form_tid,
							modtype: 'thread',
							action: 1,
							url: 'misc.php',
							confirm: 1
						};
						$j.ajax({
							type: 'POST',
							url: 'moderation.php',
							data: formData,
							encode: true
						 }).done(function(data) {
							if(data.length > 100) {
								$.jGrowl('Sorry but there was an error trying to Junk this thread. Please try again.', {theme:'jgrowl_error'});
							} else {
								window.location.assign('https://hackforums.net/forumdisplay.php?fid=' + fid);
							}
						});	
					}
				}
			});		
		});
		
		$j('div[class*="post_management_buttons"]').each(function() {
			var $ele = $j('<a href="javascript:void(0);" class="xero_mod_junk_split">Junk Split</a>');
			
			$ele.prependTo(this);

			$ele.click(function(e) {
				var $mod_check_box = $j(e.target).parent().parent().prev().find('input[name^="inlinemod_"]');
				var form_inline_name = $mod_check_box.attr('name');
				var form_post_key = $j('input[name="my_post_key"]').val();
				var form_tid = $j('input[name="tid"]').val();
				var post_pid = form_inline_name.split('inlinemod_')[1];

				$.prompt('Do you want to Junk Split this post?', {
					buttons:[
							{title: 'Yes', value: true},
							{title: 'No', value: false}
					],
					submit: function(e,v,m,f){
						if(v === true) {
							inlineModeration.clearChecked();
							
							if(!$mod_check_box.is(':checked')) {
								$mod_check_box.click();
							}

							var formData = {
								my_post_key: form_post_key,
								tid: form_tid,
								modtype: 'inlinepost',
								action: 2,
								url: 'misc.php',
								confirm: 1
							};
							 
							formData[form_inline_name] = 1;
							
							$j.ajax({
								type: 'POST',
								url: 'moderation.php',
								data: formData,
								encode: true
							 }).done(function(data) {
								if(data.length > 100) {
									$.jGrowl('Sorry but there was an error trying to Junk Split this post. Please try again.', {theme:'jgrowl_error'});
								} else {
									$j('div[id="post_' + post_pid + '"]').slideUp();
								}
							});
						}
					}
				});			
			});
		});
	}

})();