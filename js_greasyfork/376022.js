// ==UserScript==
// @date			3.10.2023
// @name			CustomMediaPlayerVK
// @namespace		https://github.com/UTINKA/CustomMediaPlayerVK/
// @version			1.5
// @description		Изменённый плеер в верхнем меню для ВК
// @author			UTINKA
// @include			https://vk.com/*

// @icon
// @homepage		https://greasyfork.org/ru/scripts/376022-custommediaplayervk
// @supportURL		

// @grant			none
// @require			http://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require			https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js

// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/376022/CustomMediaPlayerVK.user.js
// @updateURL https://update.greasyfork.org/scripts/376022/CustomMediaPlayerVK.meta.js
// ==/UserScript==

(function()
{
	var 
		CMP = [],
		SettingsAdd = false,
		AnimTimerState = false,
		AnimTimer = undefined,
		CMPlayerVK = '0,0'
	;
	var main_box = $('#top_audio_player');
	


	function Start()
	{
		var mObserver = new MutationObserver(function(m) 
		{
			m.forEach(function(m) 
			{
				CMPUpdate();
				if(getMem('CMPlayerVK') == false)
				{
					setMem('CMPlayerVK','0,0');
					CMPlayerVK = CMPlayerVK.split(',');
				}
				else
				{
					CMPlayerVK = getMem('CMPlayerVK').split(',');
					if(CMPlayerVK[0] == 1)
					{
						CMPVKsetState(true);
					}
					else CMPVKsetState(false);
					//
					if(CMPlayerVK[1] == 1)
					{
						$('.top_audio_player').css('top','-50px');
					}
					else $('.top_audio_player').css('top','0');
				}
				if(AnimTimerState == false)
				{
					AnimTimerState = true;
					Animates();
				}					
				var sbox = $('.settings_panel');
				if(location.href.search(/settings/) > 1 && location.href.search(/act/) == -1)
				{
					if(SettingsAdd == false)
					{
						SettingsAdd = true;
						//
						var 
							Used, 
							Hided
						;
						if(CMPlayerVK[0] == 0) Used = '<input class="blind_label" type="checkbox" id="settings_cmpvk_state">';
						else if(CMPlayerVK[0] == 1) Used = '<input checked class="blind_label" type="checkbox" id="settings_cmpvk_state">';
					
						if(CMPlayerVK[1] == 0) Hided = '<input class="blind_label" type="checkbox" id="settings_cmpvk_player">';
						else if(CMPlayerVK[1] == 1) Hided = '<input checked class="blind_label" type="checkbox" id="settings_cmpvk_player">';
						//
						sbox.prepend('\
						<div class="settings_line">\
							<div class="settings_info_block">\
								<div class="settings_label">Custom Media Player</br>Настройки</div>\
								<div class="settings_labeled_text">\
									<!--div class="settings_menu_link"></div-->\
									<div class="settings_narrow_row">\
										' + Used + '\
										<label for="settings_cmpvk_state">Использовать плеер</label>\
									</div>\
									<div class="settings_narrow_row">\
										' + Hided + '\
										<label for="settings_cmpvk_player">Скрыть плеер</label>\
									</div>\
								</div>\
							</div>\
						</div>\
						');
						$('#settings_cmpvk_state').change(function(e)
						{
							var state = $(this).prop("checked");
							if(state == true)
							{
								CMPlayerVK[0] = 1;
								CMPVKsetState(true);
							}
							else 
							{

								CMPlayerVK[0] = 0;
								CMPVKsetState(false);
							}
							UpdateSettings();
						});
						$('#settings_cmpvk_player').change(function(e)
						{
							var state = $(this).prop("checked");
							if(state == true)
							{
								CMPlayerVK[1] = 1;
								$('.top_audio_player').css('top','-50px');
							}
							else 
							{
								CMPlayerVK[1] = 0;
								$('.top_audio_player').css('top','0');
							}
							UpdateSettings();
						});
					}
				}
				else
				{
					SettingsAdd = false;		
				}
			});
		});
		
		mObserver.observe(document.documentElement, 
		{
			attributes: true,
			characterData: true,
			childList: true,
			subtree: true,
			attributeOldValue: true,
			characterDataOldValue: true
		});
	}
	
	function CMPVKsetState(state)
	{
		if(state == false)
		{
			main_box.css({
				'width': 'unset',
				'padding': '0 20px 0 8px'
			});
			//
			main_box.find('.top_audio_player_img').css('display','none');
			// prev
			main_box.find('.top_audio_player_prev').css({
				'position': 'relative',
				'top': 'unset',
				'bottom': 'unset',
				'left': 'unset',
				'margin': '0',
				'filter': 'grayscale(0) brightness(100%)'
			});
			// play/pause
			main_box.find('.top_audio_player_play').css({
				'position': 'relative',
				'top': 'unset',
				'bottom': 'unset',
				'left': 'unset',
				'margin': '0',
				'filter': 'grayscale(0) brightness(100%)'
			});
			// next
			main_box.find('.top_audio_player_next').css({
				'position': 'relative',
				'top': 'unset',
				'bottom': 'unset',
				'left': 'unset',
				'margin': '0',
				'filter': 'grayscale(0) brightness(100%)'
			});
			//
			main_box.find('.top_audio_player_title_wrap').css({
				'position': 'relative',
				'top': 'unset',
				'left': 'unset',
				'right': 'unset',
				'bottom': 'unset',
				'height': '24px',
				'margin': '0'
			});
			main_box.find('.top_audio_player_title').css('display','inline-block');
			main_box.find('.top_audio_player_cmp_author').css('display','none');
			main_box.find('.top_audio_player_cmp_name').css('display','none');
			main_box.find('.top_audio_player_img_bg_cover').css('opacity', '0');
			main_box.find('.top_audio_player_img_bg').css('display','none').css('opacity', '0');
		}
		else
		{
			main_box.css({
				'width':'100%',
				'padding':'0'
			});
			//
			main_box.find('.top_audio_player_img').css('display','block');
			// prev
			main_box.find('.top_audio_player_prev').css({
				'position': 'absolute',
				'top': '0px',
				'bottom': '0px',
				'left': '60px',
				'filter': 'grayscale(1) brightness(1000%)',
				'z-index': '3'
			});
			// play/pause
			main_box.find('.top_audio_player_play').css({
				'position': 'absolute',
				'top': '0px',
				'bottom': '0px',
				'left': 'calc(60px + (60px / 2))',
				'filter': 'grayscale(1) brightness(1000%)',
				'z-index': '3'
			});
			// next
			main_box.find('.top_audio_player_next').css({
				'position': 'absolute',
				'top': '0px',
				'bottom': '0px',
				'left': 'calc(60px + 60px)',
				'filter': 'grayscale(1) brightness(1000%)',
				'z-index': '3'
			});
			//
			main_box.find('.top_audio_player_title_wrap').css({
				'position': 'absolute',
				'left': 'calc(24px*3 + 48px + 10px*3)',
				'top': '0',
				'right': '0',
				'bottom': '0',
				'height': '100%',
				'margin': '0'
			});
			main_box.find('.top_audio_player_title').css('display','none');
			main_box.find('.top_audio_player_cmp_author').css('display','unset');
			main_box.find('.top_audio_player_cmp_name').css('display','unset');
			main_box.find('.top_audio_player_img_bg_cover').css('opacity', '1');
			main_box.find('.top_audio_player_img_bg').css('display','block').css('opacity', '1');
		}
	}

	// css
	var CMP_CSS = '\
	<style>\
	\
	@import url(https://fonts.googleapis.com/css?family=Material+Icons);\
	\
	.top_audio_player.top_audio_player_enabled{\
		position: relative;\
		width: 100%;\
	}\
	\
	.top_audio_player_img{\
		display: block;\
		width: 48px;\
		height: 48px;\
		background-color: rgba(0,0,0,0);\
		background-image: url(/images/audio_row_placeholder.png);\
		background-repeat: no-repeat;\
		background-size: cover;\
		z-index: 2;\
		transition: 0.5s;\
	}\
	.top_audio_player_img_bg_cover{\
		display: block;\
		width: 100%;\
		height: 100%;\
		z-index: 1;\
		position: absolute;\
		background: rgb(0 0 0 / 10%);\
	}\
	.top_audio_player_img_bg{\
		background-image: url(/images/audio_row_placeholder.png);\
		background-size: cover;\
		background-position-x: 0px;\
		background-position-y: 0px;\
		display: block;\
		position: absolute;\
		width: 400px;\
		height: 160px;\
		z-index: 0;\
		filter: blur(15px);\
		transition: 3s;\
	}\
	.top_audio_player_cmp_author{\
		opacity: 0;\
		position: absolute;\
		top: calc(48px / 2 + 2px);\
		left: 5px;\
		right: 0;\
		bottom: 0;\
		overflow: hidden;\
		white-space: nowrap;\
		text-overflow: ellipsis;\
		cursor: pointer;\
		color: rgb(255 255 255);\
		font-weight: bold;\
		z-index: 2;\
		transition: 0.2s;\
	}\
	.top_audio_player_cmp_name{\
		opacity: 0;\
		position: absolute;\
		top: calc(48px / 2 - 15px);\
		left: 5px;\
		right: 0;\
		bottom: 0;\
		overflow: hidden;\
		white-space: nowrap;\
		text-overflow: ellipsis;\
		cursor: pointer;\
		color: rgb(255 255 255);\
		font-weight: bold;\
		z-index: 2;\
		transition: 0.2s;\
	}\
	.top_audio_player_download_state{\
		opacity: 1;\
		display: block;\
		position: absolute;\
		left: 0;\
		bottom: 0;\
		height: 4px;\
		width: 0%;\
		background: #2787f5;\
		transition: 0.5s;\
	}\
	.top_audio_player_download{\
		width: 48px;\
		height: 48px;\
		background: rgb(0 0 0 / 0%);\
		display: block;\
		transition: 0.5s;\
	}\
	.top_audio_player_download:hover{\
		width: 48px;\
		height: 48px;\
		background: rgb(0 0 0 / 50%);\
		display: block;\
	}\
	.top_audio_player_download i{\
		padding: 12px;\
		transform: scale(0);\
		transition: 0.5s;\
		user-select: none;\
		pointer-events: none;\
	}\
	.top_audio_player_download:hover i{\
		transform: scale(1);\
	}\
	</style>';
	
	window.addEventListener('load',function()
	{
		main_box.find('.top_audio_player_title_wrap').append('\
		<div class="top_audio_player_cmp_author"></div>\
		<div class="top_audio_player_cmp_name"></div>\
		');
		main_box.append('\
		<div class="top_audio_player_img">\
			<!--a class="top_audio_player_download"><i class="material-icons">play_for_work</i></a-->\
		</div>\
		<div class="top_audio_player_img_bg_cover"></div>\
		<div class="top_audio_player_img_bg"></div>\
			<div class="top_audio_player_download_state">\
		</div>\
		' + CMP_CSS);
		//
		Start();
	});
	
	CMP[1] = 0;
	CMP[2] = '';
	
	function Animates()
	{
		clearTimeout(AnimTimer);
		var X = RandXY(30, 20, 0, 100)[0];
		var Y = RandXY(20, 30, 0, 150)[1];

		CMP[0] = getAudioPlayer()._currentAudio;
		if(CMP[0] != false)
		{
			main_box.find('.top_audio_player_img_bg').css('background-position-x', X + 'px');
			main_box.find('.top_audio_player_img_bg').css('background-position-y', Y + 'px');
		}
		AnimTimer = setTimeout(function()
		{
			Animates();
		}, 2000);
	}
	
	function getMem(key)
	{
		var memory = localStorage.getItem(key);
		if(memory != null && memory != undefined && memory != 'null' && memory.length != 0) return memory;
		else return false;
	}
	function setMem(key, value)
	{
		return localStorage.setItem(key, value);
	}
	function UpdateSettings()
	{
		var settings = CMPlayerVK[0] + ',' + CMPlayerVK[1];
		setMem('CMPlayerVK', settings);
	}
	
	function RandXY(X, Y, Min, Max) 
	{
		var result = [0,0];
		var X = Math.floor(Math.random() * ((X - Max) - Min) ) + Min;
		var Y = Math.floor(Math.random() * ((Y - Max) - Min) ) + Min;
		if(X != Y) result = [X,Y];
		else result = [0,0];
		return result;
	}
	
	
	function CMPUpdate()
	{
		CMP[0] = getAudioPlayer()._currentAudio;
		if(CMP[0] != false)
		{
			var check_track = CMP[0][4] + '_' + CMP[0][3];
			if(CMP[2] == '' || CMP[2] != check_track)
			{
				main_box.find('.top_audio_player_cmp_author').css({
					'opacity': '0',
					'transform': 'translateY(-35px)'
				});
				main_box.find('.top_audio_player_cmp_name').css({
					'opacity': '0',
					'transform': 'translateY(-25px)'
				});
				//
				if(CMP[0][14].split(',')[1] != undefined)
				{
					main_box.find('.top_audio_player_img').css('background-image', 'url(' + CMP[0][14].split(',')[1] + ')');
					main_box.find('.top_audio_player_img_bg').css('background-image', 'url(' + CMP[0][14].split(',')[1] + ')');
				}
				else 
				{
					main_box.find('.top_audio_player_img').css('background-image', 'url(/images/audio_row_placeholder.png)');
					main_box.find('.top_audio_player_img_bg').css('background-image', 'url(/images/audio_row_placeholder.png)');
				}
				CMP[2] = check_track;
				//
				clearTimeout(CMP[3]);
				CMP[3] = setTimeout(function()
				{
					main_box.find('.top_audio_player_cmp_author').css({
						'opacity': '0',
						'transform': 'translateY(35px)'
					});
					main_box.find('.top_audio_player_cmp_name').css({
						'opacity': '0',
						'transform': 'translateY(25px)'
					});
					//
					clearTimeout(CMP[3]);
					CMP[3] = setTimeout(function()
					{
						main_box.find('.top_audio_player_cmp_author').html(CMP[0][4]); // author
						main_box.find('.top_audio_player_cmp_name').html(CMP[0][3]); // music name
						//
						var download_name = main_box.find('.top_audio_player_cmp_author').text() + ' - ' + main_box.find('.top_audio_player_cmp_name').text();
						main_box.find('.top_audio_player_download').attr('title','Скачать ' + download_name).attr('aName', download_name);
						//
						main_box.find('.top_audio_player_cmp_author').css({
							'opacity': '1',
							'transform': 'translateY(0px)'
						});
						main_box.find('.top_audio_player_cmp_name').css({
							'opacity': '1',
							'transform': 'translateY(0px)'
						});
					}, 100);
				}, 100);
			}
		}
	}
})();
