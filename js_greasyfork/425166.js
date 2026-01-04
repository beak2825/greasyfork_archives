// ==UserScript==
// @name				elegant alert()库
// @name:zh-CN			优雅的 alert()库，基于Evan Tseng修改，权利归原作者所有，作者链接https://greasyfork.org/zh-CN/scripts/391736-elegant-alert
// @namespace			https://greasyfork.org/zh-TW/users/393133-evan-tseng
// @author				Evan Tseng
// @version				1.07
// @include				*://*
// @run-at				document-start
// @grant				none
// ==/UserScript==


	var alertWrap = null;
	const ElegantAlertBox = function(msg){
		const boxFont = '400 14pt sans-serif',
			  boxFontColor = '#220',
			  boxColor = 'rgba(240,240,210,.85)',
			  boxHoverColor = 'rgba(255,255,255,.85)',
			  popFontColor = '#8FF',
			  popBgColor = '#b00',
			  countdownColor = 'rgba(0,0,255,.1)',
			  duration = '6100';

		if(!alertWrap) {
			const css = '@media screen and (max-width: 600pt) { .elegantAlertBoxWrapper>div { max-width:75vw } }'+
				  '@media screen and (min-width: 600pt) { .elegantAlertBoxWrapper>div { max-width:450pt } }'+
				  '.elegantAlertBoxWrapper { position:fixed; top:3mm; right:2mm; padding:5mm; max-height:calc(100vh - 13mm); z-index:2147483647; -webkit-user-select:none; user-select:none; }'+
				  '.elegantAlertBoxWrapper>div { position:relative; float:right; clear:right; font:'+ boxFont +'; line-height:1.25; color:'+ popFontColor +'; background:'+ popBgColor +'; min-height:1.25em; padding:2px 2mm; margin-bottom:1.5mm; overflow:auto; border-radius:5px; opacity:0; cursor:pointer; box-shadow:inset 0 0 0 1px rgba(255,255,255,.8), 0 1px 2mm rgba(0,0,0,.7); backdrop-filter:blur(2px); -webkit-backdrop-filter:blur(2px); }'+
				  '.elegantAlertBoxWrapper>div>.eaBar { position: absolute; left:0; top:0; width:100%; height:100%; background:'+ countdownColor +'; border-radius: 3px }'+
				  '.elegantAlertBoxWrapper>.pop { color:'+ boxFontColor +'; background:'+ boxColor +'; opacity:1; max-height:10em; animation: pulse1 .3s 1 }'+
				  '.elegantAlertBoxWrapper>.eaNormal { color:'+ boxFontColor +'; background:'+ boxColor +'; opacity:1; max-height:10em; }'+
				  '.elegantAlertBoxWrapper>.eaNormal>.eaBar, .elegantAlertBoxWrapper>.eaClose>.eaBar { width:0; transition:' + duration + 'ms linear}'+
				  '.elegantAlertBoxWrapper>.eaClose { background:'+ boxColor +'; opacity:0; min-height:0; max-height:0; padding:0 2mm; margin:0; transition: .6s linear }'+
				  '.elegantAlertBoxWrapper>.eaNormal:hover { font-weight:600; background:'+ boxHoverColor +'; z-index:2; box-shadow:inset 0 0 0 1px rgba(255,255,255,.8), 0 1px 2mm rgba(0,0,0,.8); animation: pulse2 .2s 1 }'+
				  '.elegantAlertBoxWrapper>.eaNormal:active { box-shadow:0 0 0 1px #777, inset 0 1px 2px #555; transform:scale(0.97); transition: .1s }'+
				  '@keyframes pulse1 { 0% { opacity:0.5 } 12% { color: ' + popFontColor + '; background: ' + popBgColor + '; transform: scale(1.1) } 50% { transform: scale(1.02) } 100% { opacity:1; } }'+
				  '@keyframes pulse2 { 0% { } 30% { left: -2px; } 70% { left: 1px } 100% { } }',

				  cssStyle = document.createElement('style');
			if(cssStyle.styleSheet)	cssStyle.styleSheet.cssText = css;
			else	cssStyle.appendChild(document.createTextNode(css));
			document.querySelector('head').appendChild(cssStyle);

			alertWrap = document.createElement('div');
			alertWrap.setAttribute("class", "elegantAlertBoxWrapper");
			document.body.appendChild(alertWrap);
		}

		this.exist = true;
		this.createBox = function(text){
			var box = this,
				alBox = document.createElement('div');
			alertWrap.appendChild(alBox);
			alBox.innerHTML = '<div class="eaBar"></div>' + text;
			alBox.setAttribute("class", "pop");
			alBox.onclick = function(){
				let tmp = document.createElement('textArea');
				tmp.value = text;
				document.body.appendChild(tmp);
				tmp.select();
				document.execCommand('copy');
				tmp.remove();
				box.close();
			};
			return alBox;
		};
		this.show = function(){
			var box = this;
			setTimeout(function(){
				box.elm.setAttribute("class", "eaNormal");
				setTimeout(function(){
					if(box.exist)	box.close();
				}, duration);
			}, 500);
		};
		this.close = function(){
			var box = this;
			box.elm.setAttribute("class", "eaClose");
			setTimeout(function(){
				if(box.exist) {
					box.elm.remove();
					if(!alertWrap.hasChildNodes()) {
						alertWrap.remove();
						alertWrap = null
					}
					box.elm = null;
					box.exist = false;
				}
			}, 1000);
		};
		this.elm = this.createBox(msg);
		this.show();
	};