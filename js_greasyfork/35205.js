// ==UserScript==
// @name			Bilibili上下弹幕变字幕
// @namespace		https://space.bilibili.com/68391#!/
// @version			2.0
// @description		用于突出显示B站的顶部弹幕与底部弹幕，使其呈现Youtube字幕的效果。适用于一些有字幕弹幕的生肉视频。
// @author			剧情帝
// @match			*://www.bilibili.com/video/av*
// @match			*://www.bilibili.com/watchlater*
// @run-at			document-end
// @create			2017-11-16
// @lastmodified	2018-10-22
// @note			2017.11.24-V0.2 新增识别弹幕颜色，深色弹幕增加白色文字边框的功能
// @note			2017.11.27-V1.0 新增字幕样式设置，可更改字幕的大小、颜色，以及是否显示文字的黑色背景
// @note			2018.04.12-V1.1 修复插件
// @note			2018.10-22-V2.0 代码完全重构，同时支持新旧播放器，设置面板重新设计
// @grant			GM_addStyle
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_registerMenuCommand
// @require			http://code.jquery.com/jquery-1.7.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/35205/Bilibili%E4%B8%8A%E4%B8%8B%E5%BC%B9%E5%B9%95%E5%8F%98%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/35205/Bilibili%E4%B8%8A%E4%B8%8B%E5%BC%B9%E5%B9%95%E5%8F%98%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let style = GM_addStyle('');
	let $configPanel;
	SetCss();
	SetTextShadow();
	CreateConfigPanel();
	GM_registerMenuCommand('Bilibili字幕样式设置', ToggleConfigPanel);

	function SetCss() {
		if(style.sheet.cssRules.length > 0){
			style.sheet.deleteRule(0);
		}

		let css = `#bofqi .bilibili-player-video-danmaku .bilibili-danmaku:not([style*="transition"]) {
			${If_Html( GM_getValue('showBackground', true), `
			background-color: rgba(0,0,0,0.75);
			padding: 4px 10px;
			border-radius: 3px;`)}
			${If_Html( GM_getValue('fontsize', 25) !== 'original', `
			font-size:${ GM_getValue('fontsize', 25)}px !important;`)}
			${If_Html( GM_getValue('color', 'original') !== 'original', `
			color: ${ GM_getValue('color', 'original')} !important;`)}
			opacity: 1 !important;
		}`;
		style.sheet.insertRule(css);
	}

	function If_Html(statement, html1, html2 = '') {
		return statement ? html1: html2;
	}

	function CreateConfigPanel() {
		$configPanel = $(`<div style="display: none; position: fixed;top: 10px;right: 10px;z-index: 10000;background: #fff;padding: 20px 10px;border: 3px solid #00a1d6;font-size: 18px;">
			<div style="text-align: center;">
				<b>字幕设置</b>
				<p style="font-size: smaller;">（对所有顶端与底端弹幕生效）</p>
			</div>
			<div style="padding: 20px; padding-bottom:0">
				<div>
					<label>字体大小：</label>
					<select name="size" style="height: 30px;" >
						<option value="original">原大小</option>
						<option value="18">小</option>
						<option value="25">中</option>
						<option value="36">大</option>
					</select>
				</div>
				<br>
				<div>
					<label style="vertical-align: middle;">底板：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
					<input name="background" type="checkbox" style="width: 20px; height: 20px; vertical-align: middle;">
				</div>
				<br>
				<div>
					<label>文字颜色：</label>
					<select name="color" style="height: 30px;">
						<option value="original">原颜色</option>
						<option value="selected">自定义</option>
					</select>
					<div style="margin-top: 10px;display: flex;vertical-align: middle;-webkit-box-align: center;-ms-flex-align: center;align-items: center;-webkit-box-pack: start;-ms-flex-pack: start;justify-content: flex-start;" class="row-selection danmaku-color bui bui-color-picker bui-dark">
						<div class="bui-color-picker-wrap" style="width: 176px; position:relative">
							<div class="bui-color-picker-result">
								<span class="bui-color-picker-input bui bui-input" style="width: auto; flex: 1;">
									<div class="bui-input-wrap ">
										<input class="bui-input-input" type="text" value="" style="color: #000;border: 1px solid hsla(0, 0%, 0%, 0.2);">
									</div>
								</span>
								<span class="bui-color-picker-display" style="background: #FFFFFF; border: 1px solid hsla(0, 0%, 0%, 0.2);"></span>
							</div>
							<ul class="bui-color-picker-options" style=" margin-right: -10.666666666666666px;">
								<li class="bui-color-picker-option" style="background: #FE0302; margin-right: 10.666666666666666px;" data-value="#FE0302"></li>
								<li class="bui-color-picker-option" style="background: #FF7204; margin-right: 10.666666666666666px;" data-value="#FF7204"></li>
								<li class="bui-color-picker-option" style="background: #FFAA02; margin-right: 10.666666666666666px;" data-value="#FFAA02"></li>
								<li class="bui-color-picker-option" style="background: #FFD302; margin-right: 10.666666666666666px;" data-value="#FFD302"></li>
								<li class="bui-color-picker-option" style="background: #FFFF00; margin-right: 10.666666666666666px;" data-value="#FFFF00"></li>
								<li class="bui-color-picker-option" style="background: #A0EE00; margin-right: 10.666666666666666px;" data-value="#A0EE00"></li>
								<li class="bui-color-picker-option" style="background: #00CD00; margin-right: 10.666666666666666px;" data-value="#00CD00"></li>
								<li class="bui-color-picker-option" style="background: #019899; margin-right: 10.666666666666666px;" data-value="#019899"></li>
								<li class="bui-color-picker-option" style="background: #4266BE; margin-right: 10.666666666666666px;" data-value="#4266BE"></li>
								<li class="bui-color-picker-option" style="background: #89D5FF; margin-right: 10.666666666666666px;" data-value="#89D5FF"></li>
								<li class="bui-color-picker-option" style="background: #CC0273; margin-right: 10.666666666666666px;" data-value="#CC0273"></li>
								<li class="bui-color-picker-option" style="background: #222222; margin-right: 10.666666666666666px;" data-value="#222222"></li>
								<li class="bui-color-picker-option" style="background: #9B9B9B; margin-right: 10.666666666666666px;" data-value="#9B9B9B"></li>
								<li class="bui-color-picker-option bui-color-picker-option-active" style="background: #FFFFFF; margin-right: 10.666666666666666px;" data-value="#FFFFFF"></li>
							</ul>
							<div class="bui-color-picker-mask" style="display:none; position: absolute; width: 100%; height: 100%; top: 0; background-color: #0003; cursor:not-allowed"></div>
						</div>
					</div>
				</div>
			</div>
			<p class="close" style="position:absolute;top: 2px;right: 2px;color: #aaa;width: 20px;height: 20px;text-align: center;font-size: 15px;cursor: pointer;">✖</p>
		</div>`);

		if($(".has-stardust").length === 0){
			//旧版播放器，加入新播放器调色盘的css
			$configPanel.append(`<style type="text/css">
				.bui-input {
					display: -webkit-inline-box;
					display: -ms-inline-flexbox;
					display: inline-flex;
					position: relative;
					-webkit-box-pack: start;
					-ms-flex-pack: start;
					justify-content: flex-start;
					font-size: 0;
					height: 22px
				}
				.bui-input .bui-input-wrap {
					width: 100%;
					height: 100%;
					-webkit-box-sizing: border-box;
					box-sizing: border-box;
					position: relative
				}
				.bui-input .bui-input-input {
					border: 1px solid silver;
					border-radius: 2px;
					outline: none;
					-webkit-transition: all .3s;
					transition: all .3s;
					-webkit-transform: translateZ(0);
					transform: translateZ(0);
					padding: 4px 7px;
					resize: none;
					width: 100%;
					height: 100%;
					-webkit-box-sizing: border-box;
					box-sizing: border-box;
					font-size: 12px;
					-moz-appearance: textfield
				}
				.bui-input .bui-input-input::-webkit-inner-spin-button,.bui-input .bui-input-input::-webkit-outer-spin-button {
					-webkit-appearance: none
				}
				.bui-color-picker {
					-webkit-box-pack: start;
					-ms-flex-pack: start;
					justify-content: flex-start
				}
				.bui-color-picker.bui-dark .bui-input .bui-input-input {
					background-color: transparent;
					color: #fff;
					border: 1px solid hsla(0,0%,100%,.2)
				}
				.bui-color-picker.bui-dark .bui-color-picker-display {
					border: 1px solid hsla(0,0%,100%,.2)
				}
				.bui-color-picker.bui-dark .bui-color-picker-option[data-value="#222222"] {
					border-color: hsla(0,0%,100%,.1)
				}
				.bui-color-picker.bui-dark .bui-color-picker-option.bui-color-picker-option-active {
					border-color: #000
				}
				.bui-color-picker .bui-color-picker-result {
					margin-bottom: 6px;
					display: -webkit-box;
					display: -ms-flexbox;
					display: flex;
					vertical-align: middle
				}
				.bui-color-picker .bui-color-picker-input {
					margin-right: 6px;
					width: 98px
				}
				.bui-color-picker .bui-color-picker-display {
					display: inline-block;
					width: 50px;
					height: 22px;
					border: 1px solid rgba(0,0,0,.3);
					border-radius: 2px;
					vertical-align: middle;
					-webkit-box-sizing: border-box;
					box-sizing: border-box;
					-webkit-transition: background .2s;
					transition: background .2s;
					-webkit-transform: translateZ(0);
					transform: translateZ(0)
				}
				.bui-color-picker .bui-color-picker-options {
					padding: 0;
					margin: 0 -6px 0 0;
					list-style-type: none;
					white-space: normal;
					font-size: 0;
					line-height: 0
				}
				.bui-color-picker .bui-color-picker-option {
					width: 16px;
					height: 16px;
					border: 1px solid rgba(0,0,0,.3);
					-webkit-box-sizing: border-box;
					box-sizing: border-box;
					border-radius: 2px;
					margin-right: 6px;
					margin-bottom: 4px;
					cursor: pointer;
					display: inline-block
				}
				.bui-color-picker .bui-color-picker-option.bui-color-picker-option-active {
					-webkit-box-shadow: 0 0 1px 1px #fff;
					box-shadow: 0 0 1px 1px #fff
				}
			</style>`);
		}

		$("select[name=size]", $configPanel).val( GM_getValue('fontsize', 25)).change(e=>{
			GM_setValue('fontsize', e.target.value);
			SetCss();
		});
		$("input[name=background", $configPanel).prop('checked', GM_getValue('showBackground', true)).change(e=>{
			GM_setValue('showBackground', $(e.target).prop('checked'));
			SetCss();
		});

		SetColor( GM_getValue('color', 'original'), false); //初始化颜色选框与色盘
		$("select[name=color]", $configPanel).change(e=>{
			SetColor( e.target.value);
		});
		$(".bui-color-picker-option", $configPanel).click(e=>{
			SetColor( $(e.target).data('value'));
		});
		let $buiInputInput = $(".bui-input-input", $configPanel);
		$buiInputInput.on('input', e=>{
			if( /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test( $buiInputInput.val())){
				$buiInputInput.css('background-color', 'unset');
				SetColor( $buiInputInput.val());
			}
			else{
				$buiInputInput.css('background-color', 'hsla(0, 100%, 50%, 0.2)');
			}
		});

		$configPanel.click(e=>{
			e.stopPropagation();
		});
		$(".close", $configPanel).click(()=>{
			$configPanel.hide();
		});
		$('body').append( $configPanel).click(()=>{
			$configPanel.hide();
		});
	}

	function SetColor( color, setCss = true) {
		let $selectColor = $("select[name=color]", $configPanel);
		let $buiColorPickerMask = $(".bui-color-picker-mask", $configPanel); 
		let $buiInputInput = $(".bui-input-input", $configPanel);
		let $buiColorPickerDisplay = $(".bui-color-picker-display", $configPanel);
		if(color === 'original'){
			$selectColor.val('original');
			$buiColorPickerMask.show();
			$buiInputInput.val( '#').css('background-color', 'unset');
			$buiColorPickerDisplay.css('background', '#fff');
			if(setCss){
				GM_setValue('color', color);
				SetCss();
			}
		}
		else if(color === 'selected'){
			$selectColor.val('selected');
			$buiColorPickerMask.hide();
		}
		else{
			$selectColor.val('selected');
			$buiColorPickerMask.hide();
			$buiInputInput.val( color);
			$buiColorPickerDisplay.css('background', color);
			if(setCss){
				GM_setValue('color', color);
				SetCss();
			}
		}
	}

	function ToggleConfigPanel() {
		if($configPanel.css('display') === 'none'){
			$configPanel.show();
		}
		else{
			$configPanel.hide();
		}
	}

	function CalLight (rgb) {
		rgb = rgb.replace('rgb(', '');
		rgb = rgb.replace(')', '');
		rgb = rgb.split(', ');
		return ((parseInt(rgb[0]) * 0.3 + parseInt(rgb[1]) * 0.6 + parseInt(rgb[2]) * 0.1) / 255);
	}

	function SetTextShadow() {
		//监测弹幕变化
		let damnuObserver = new MutationObserver( records => {
			let $currentDanmu;
			records.map( record =>{
				for (let i = record.addedNodes.length - 1; i >= 0; i--) {
					if(record.addedNodes[i].nodeName === '#text'){
						$currentDanmu = $(record.addedNodes[i].parentNode);
					}
					else{
						$currentDanmu = $(record.addedNodes[i]);
					}
					if($currentDanmu.css('transform') == 'none' && CalLight($currentDanmu.css('color')) <= 0.5){ //不移动的弹幕，也就是顶端和底端弹幕
						$currentDanmu.css('text-shadow', '#fff 1px 0px 1px, #fff 0px 1px 1px, #fff 0px -1px 1px, #fff -1px 0px 1px');
					}
				}
			});
		});

		//等待弹幕图层的加载
		let damunContainerWaiter = new MutationObserver( records => {
			let $damunContainer = $('#bofqi .bilibili-player-video-danmaku');
			if($damunContainer.length > 0){ //弹幕图层加载完毕
				damunContainerWaiter.disconnect();
				damnuObserver.observe($damunContainer[0], {'childList':true, 'subtree':true});
			}
		});

		if($("#bofqi").length > 0){
			damunContainerWaiter.observe($("#bofqi")[0], {'childList':true, 'subtree':true});
		}
		else{
			//稍后再看页面一开始没有播放器，须等待
			let bofqiWaiter = new MutationObserver( records => {
				if($("#bofqi").length > 0){
					damunContainerWaiter.observe($("#bofqi")[0], {'childList':true, 'subtree':true});
					bofqiWaiter.disconnect();
				}
			});
			bofqiWaiter.observe( $("#viewlater-app .app-wrap .view-later-module")[0], {'childList':true, 'subtree':true});
		}
	}

})();