// ==UserScript==
// @name         Copy settings
// @version      1.01
// @description  Add buttons to Lightspeed backoffice to copy settings into another shop. Works while you are on the same page, e.g. /
// @author       Ruben Van Hee
// @changelog    created
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-end
// @match        https://*.webshopapp.com/admin/*
// @match        https://*.shoplightspeed.com/admin/*
// @namespace https://greasyfork.org/users/428438
// @downloadURL https://update.greasyfork.org/scripts/423923/Copy%20settings.user.js
// @updateURL https://update.greasyfork.org/scripts/423923/Copy%20settings.meta.js
// ==/UserScript==
(function() {
	'use strict';
    settingscopier();
    function settingscopier(){
// ------------------- set buttons & styles
		$('#content .PageHeader h1').append('<a class="LabelLetterSpacing LabelPadding LineHeightMedium Rounded BorderNone Uppercase Bold VAlignMiddle Ml-half Text-xxs tc Label-default" id="copys">Copy</a> <a class="LabelLetterSpacing LabelPadding LineHeightMedium Rounded BorderNone Uppercase Bold VAlignMiddle Ml-half Text-xxs tc Label-default" id="pastes">Paste</a>');
// ------------------- get vars & selectors
		let shopdomain = location.hostname.split(".")[location.hostname.split(".").length-2]+'.'+location.hostname.split(".")[location.hostname.split(".").length-1];
		let $copybutton = document.getElementById('copys');
		let $pastebutton = document.getElementById('pastes');
		let $form = $('form[id]')[0];
		let $input = $($form).serialize() || 'no input';
		let form_id = 'form#'+$form.id;
		let d = new Date();d.setTime(d.getTime() + (30*1000));
		let ed = d.toUTCString();
// ------------------- copy first shop and set as cookie
		$copybutton.addEventListener('click',function(e){
			/**/console.log($input);
			document.cookie = `shopset=${$input}; domain=${shopdomain}; expires=${ed};`;
			checkmark('copys');
		});
// ------------------- paste function
		$pastebutton.addEventListener('click',function(e){
			function getCookie(coname) {
				coname = coname + "=";
				let decodedCookie = document.cookie;
				let ca = decodedCookie.split(';');
				for(var i = 0; i <ca.length; i++) {
					let c = ca[i];
					while (c.charAt(0) == ' ') {
						c = c.substring(1);
					}
					if (c.indexOf(coname) == 0) {
						return c.substring(coname.length, c.length);
					}
				}
				return c;
			}
			let data = getCookie('shopset'); //get cookie with settings from copied shop
			let arr = data.split('&');
			$.each(arr, function(i,item){
				item.match('authenticity_token')?arr[i]="authenticity_token="+$form.authenticity_token.value:'';
			})
			data = arr.join('&');
			/**/console.log(data);
			jQuery.post(jQuery(form_id).attr('action'), data, function(d){console.log(d);}).fail(function(xhr, status, error){/**/console.log('FAILED', xhr, status, error);});
			setTimeout(1500, location.reload);
		});
// -------------------
		function checkmark(button_id){
			body.append('<style>#copys:after, #pastes:after{content:"yes";}</style>');
		}
	}
// ------------------- second init, because tampermonkey
	document.addEventListener("page:load", function() {
		settingscopier();
	});
})();