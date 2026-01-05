// ==UserScript==
// @name         pxls.space template
// @namespace    http://tampermonkey.net/
// @version      0.6.12
// @description  try to take over the world!
// @include      http://pxls.space/*
// @include      https://pxls.space/*
// @author       You
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28837/pxlsspace%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/28837/pxlsspace%20template.meta.js
// ==/UserScript==

/**
 * Created by Abupidr on 07-Apr-17.
 * Modified by KakoytoHui on 19-Apr-17.
 */



(function () {
    'use strict';
	
	var getQuery = function (a) {
		for (var b = window.location.search.substring(1).split('&'), d = 0; d < b.length; d++) {
			var g = b[d].split('=');
			if (decodeURIComponent(g[0]) === a) return decodeURIComponent(g[1])
		}
	};
	
	const inf = document.querySelector('.info');
	if(inf) {
		Object.assign(inf.style, {zIndex : 1});
		inf.classList.remove('open');
	}
	
	var ImgPath = getQuery('template');
	if(!ImgPath) return;
	
	var AutoUpdate = getQuery('autoupdate') ? true : false;
	var TemplateParent = document.querySelector('.board-mover');
	var template;
	
	var TemplateUpdate = function() {
		var newimage = new Image();
		newimage.src = ImgPath+'?'+Math.random();
		newimage.addEventListener('load', function(){
			template.src = newimage.src;
		});
	};
	
	var intervalset =  function() {
		setInterval(TemplateUpdate, 150000); //150000 - 2.5 minutes
		this.removeEventListener('load', intervalset);
	};
	
	var TemplateAdded = function() {
		Object.assign(template.style, {pointerEvents: 'none', opacity: 0.5});
		if(AutoUpdate) template.addEventListener('load', intervalset);
		template.addEventListener('error', function(){
			TemplateError.style.display = 'block';
		});
	};
	
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			template = document.querySelector('.board-template');
			if(template) {
				TemplateAdded();
				observer.disconnect();
			}
		});    
	});
	observer.observe(TemplateParent, {attributes: false, childList: true, characterData: true});
	
	
	var SliderBlock = document.createElement('div');
	SliderBlock.setAttribute('style', 'position:absolute; top:10px; right:20px; white-space:nowrap; padding:0; line-height: 25px; text-align:right;');
	
	var OIcon = document.createElement('div');
	OIcon.setAttribute('style', 'color:red; float:right; wont-weight:bold; width:20px; line-height:20px; text-align:center; border: 1px solid red; border-radius:5px; background:#fff; box-shadow: 0 0 1px #000, 0 0 2px #000; cursor:pointer;');
	OIcon.setAttribute('title', 'Toggle template.');
    OIcon.innerHTML = 'O';
	
	var GIcon = document.createElement('div');
	GIcon.setAttribute('style', 'color:red; float:right; wont-weight:bold; width:20px; line-height:20px; text-align:center; border: 1px solid red; border-radius:5px; background:#fff; box-shadow: 0 0 1px #000, 0 0 2px #000; cursor:pointer; margin-right:5px; opacity: 0.5;');
	GIcon.setAttribute('title', 'Toggle grid.');
    GIcon.innerHTML = 'G';
	
	var AutoupdateDiv = document.createElement('div');
	AutoupdateDiv.setAttribute('style', 'float:right; color:#fff; wont-weight:bold; font-size:12px; user-select:none; -moz-user-select:none; text-shadow: 0 0 1px #000, 0 0 2px #000; cursor:default; margin-right:5px;');
	AutoupdateDiv.setAttribute('title', 'Template overlay auto updated every 2.5 minutes.');
	AutoupdateDiv.innerHTML = 'Autoupdate';
	
	var TemplateError = document.createElement('div');
	TemplateError.setAttribute('style', 'clear:both; color:#ff4040; wont-weight:bold; font-size:12px; user-select:none; -moz-user-select:none; text-shadow: 0 0 1px #000, 0 0 2px #000; cursor:default; display:none;');
	TemplateError.setAttribute('title', 'File ' + ImgPath + ' not found!');
	TemplateError.innerHTML = 'Template loading error!';
	
    var slider = document.createElement('input');
    //slider.setAttribute('id', 'slider-control');
    slider.setAttribute('type', 'range');
    slider.setAttribute('min', '0');
    slider.setAttribute('max', '1');
    slider.setAttribute('step', '0.05');
    slider.setAttribute('value', '0.5');
	slider.setAttribute('style', 'width:130px; outline: none; padding:0; margin:0 0 5px 0; vertical-align:middle; display:block;');
   
	SliderBlock.appendChild(slider);
	SliderBlock.appendChild(OIcon);
	SliderBlock.appendChild(GIcon);
	if(AutoUpdate) SliderBlock.appendChild(AutoupdateDiv);
	SliderBlock.appendChild(TemplateError);
	
	const cb = document.querySelector('div#ui');
    cb.appendChild(SliderBlock);
	
	var OverlayOn = true;
	var OverlayToggle = function() {
		if(OverlayOn) {
			template.style.opacity = 0;
			Object.assign(OIcon.style, {opacity: 0.5});
			OverlayOn = false;
		} else {
			template.style.opacity = slider.value;
			Object.assign(OIcon.style, {opacity: 1});
			OverlayOn = true;
		}
	};
	
	var GridButtonToggle = function() {
		if(GIcon.style.opacity < 1)
			Object.assign(GIcon.style, {opacity: 1});
		else
			Object.assign(GIcon.style, {opacity: 0.5});
	}
	
	var GridToggle = function(a) {
		var gr = document.querySelector('.grid');
		if(gr.style.display == 'none')
			gr.style.display = '';
		else
			gr.style.display = 'none';
		GridButtonToggle();
	}
	
    var handleSliderEvent = function (event) {
        template.style.opacity = event.target.value;
		Object.assign(OIcon.style, {opacity: 1});
		OverlayOn = true;
    };
	
	var handleKeyBind = function (event) {
		if(event.keyCode==79)
			OverlayToggle();
		else if (event.keyCode==71)
			GridButtonToggle();
    };
	
	
    slider.addEventListener('change', handleSliderEvent);
    slider.addEventListener('input', handleSliderEvent);
    window.addEventListener('keydown', handleKeyBind);
	GIcon.addEventListener('click', GridToggle);
	OIcon.addEventListener('click', OverlayToggle);
		
	//console.log('/r/place template added');

})();
