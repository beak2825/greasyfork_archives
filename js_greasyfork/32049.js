// ==UserScript==
// @name            Show My Passwords
// @namespace       ShowMyPasswords
// @version         1.3
// @description     Show/Hide the contents of password fields by clicking on the eye icon or with hotkey
// @author          Elwyn  (wakeupneo33@gmail.com)
// @license         MIT
// @homepage        https://github.com/WakeupNeo33/ShowMyPasswords-userscript
// @supportURL      https://greasyfork.org/scripts/32049-show-my-passwords/feedback
// @iconURL         https://github.com/WakeupNeo33/ShowMyPasswords-userscript/raw/main/icon.png
// @name:es         Ver Mis Contraseñas
// @description:es  Muestra/Ocultar el contenido de los campos de contraseña haciendo clic en el icono o con conbinacion de teclas
// @include         http://*
// @include         https://*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           unsafeWindow
// @run-at          document-end
// @encoding        utf-8
// @downloadURL https://update.greasyfork.org/scripts/32049/Show%20My%20Passwords.user.js
// @updateURL https://update.greasyfork.org/scripts/32049/Show%20My%20Passwords.meta.js
// ==/UserScript==

// Note: We use Pure Javascript to prevent potential conflicts on some websites
// *******************************************************************************
(function() {
    'use strict';

	// USER SETTINGS
	//-----------------------------------------------------------------------------

	// ¿Use HotKeys to Show/Hide passwords on password fields?
	var useHotKeys = true;

    // HotKey to Show/Hide passwords on password fields
    var passwordHotkey = {
        useCtrlKey : true,
        useAltKey  : true,
        charKey    : 'S',
    };

    // HotKey to Show/Hide Eye Icon on passwords fields
     var iconHotkey = {
        useCtrlKey : true,
        useAltKey  : true,
        charKey    : 'P',
    };

	// Show Eye Icons on Scirpt Init
	var showEyeIcon = true;

	//-----------------------------------------------------------------------------
	// END OF USER SETTINGS

	try{
		showEyeIcon = GM_getValue('showEyeIcon', showEyeIcon);
	}catch(e){}

    var isVisible = false;
	var passwordKeyCode = (passwordHotkey.charKey.toLowerCase()).charCodeAt(0) - 32;
	var iconKeyCode = (iconHotkey.charKey.toLowerCase()).charCodeAt(0) - 32;

	// Function Helpers
	function getStyle(el, styleProp)
	{
		var val;
		if (el.currentStyle)
			val = el.currentStyle[styleProp];
		else if (window.getComputedStyle)
			val = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
		return val;
	}

	var toggleVisibility = function() {
		var fields = document.querySelectorAll( 'input[aria-eye="true"]' );
		for (var i = 0; i < fields.length; i++)
		{
			if( fields[i].type == 'password' )
			{
				fields[i].setAttribute( 'type', 'text' );
				fields[i].className += ' show-pass-warning';
			} else {
				fields[i].setAttribute( 'type', 'password' );
				fields[i].className = fields[i].className.replace(/\s*show-pass-warning/,'');
			}
		}
        isVisible = !isVisible;
	};

    var showPassword = function() {
        if ( isVisible ) return;
		var fields = document.querySelectorAll( 'input[aria-eye="true"]' );
		for (var i = 0; i < fields.length; i++)
		{
            fields[i].setAttribute( 'type', 'text' );
            fields[i].className += ' show-pass-warning';
		}
        isVisible = true;
	};

    var hidePassword = function() {
        if ( !isVisible ) return;
		var fields = document.querySelectorAll( 'input[aria-eye="true"]' );
		for (var i = 0; i < fields.length; i++)
		{
            fields[i].setAttribute( 'type', 'password' );
            fields[i].className = fields[i].className.replace(/\s*show-pass-warning/,'');
		}
        isVisible = false;
	};

	// Main Function
	var addEyeIcon = function(){

		var password_fields = document.querySelectorAll('input[type="password"]');

		if ( password_fields.length )
		{
			for (var i = 0; i < password_fields.length; i++)
			{
				var current_field = password_fields[i];

				// Check the initialization flag to prevent multiple initializations of the same field
				if ( current_field.getAttribute('aria-eye') == 'true' ) continue;

				// get the field style properties
				var field_height = parseInt( getStyle( current_field, 'height' ) );
				if ( field_height < 20 ) { field_height = 20; }
				var field_margin_top = parseInt( getStyle( current_field, 'margin-top' ) );
				var field_padding_left = parseInt( getStyle( current_field, 'padding-left' ) );
				var field_padding_right = parseInt( getStyle( current_field, 'padding-right' ) );

				// we use a container for the icon element for right position on the screen
				var icon_container = document.createElement( 'div' );
				var container_size = parseInt(getStyle( current_field, 'width'));
				icon_container.setAttribute('style','position:absolute; width:' + container_size + 'px;');

				var icon_button = document.createElement( 'span' );
				icon_button.className = 'eye-pass-icon';
				icon_button.setAttribute('aria-eye','true');
				icon_button.setAttribute('style','height:' + field_height + 'px!important; margin-top:' + field_margin_top + 'px !important; margin-right:' + ( field_padding_right ) + 'px !important;');
				icon_button.setAttribute('title','( ' + (iconHotkey.useCtrlKey ? 'Ctrl + ': '') + (iconHotkey.useCtrlKey ? 'Alt + ': '') + (iconHotkey.charKey.charAt(0)).toUpperCase() + ' ) Show/Hide Eye Icon');

				if ( showEyeIcon === false )
				{
					icon_button.setAttribute( 'aria-eye', 'false' );
					icon_button.className += ' hide-eye-icon';
				}

				// add a click event in every eye icon and YES, we show and hide the fields with any icon
				icon_button.addEventListener( 'click', function(){
					toggleVisibility();
				}, false);

				// We generate a flag in the field to prevent multiple initiations
				current_field.setAttribute('aria-eye','true');

				//We add the icon before the field for a correct positioning in the screen
				icon_container.appendChild( icon_button );
				current_field.parentNode.insertBefore( icon_container, current_field );

				icon_button.setAttribute('title', icon_button.getAttribute('title') + '\n( ' + (passwordHotkey.useCtrlKey ? 'Ctrl + ': '') + (passwordHotkey.useCtrlKey ? 'Alt + ': '') + (passwordHotkey.charKey.charAt(0)).toUpperCase() + ' ) Show/Hide Password');
            }
		}
	};

	var toggleIcon = function()
	{
		var icons = document.querySelectorAll( '.eye-pass-icon' );
		for (var i = 0; i < icons.length; i++)
		{
			if( icons[i].getAttribute('aria-eye') == 'true' )
			{
				icons[i].setAttribute( 'aria-eye', 'false' );
				icons[i].className = 'eye-pass-icon hide-eye-icon';
				try{
					GM_setValue('showEyeIcon', false);
				}catch(e){}
			} else {
				icons[i].setAttribute( 'aria-eye', 'true' );
				icons[i].className = 'eye-pass-icon';
				try{
					GM_setValue('showEyeIcon', true);
				}catch(e){}
			}
		}
	};

	// CSS Styles
	var css = [
		'.eye-pass-icon {',
		'position:absolute;',
		'display:block;',
		'top: 0;',
		'right: 0;',
		'margin:0 2px;',
		'border:0;',
		'padding: 1px 2px;',
		'width: 24px;',
		'height: 20px;',
		'line-height: 20px;',
		'text-align:center;',
		'background-image:url(data:image/png;base64,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);',
		'background-position: center center;',
		'background-repeat: no-repeat;',
		'background-size: 18px 18px;',
		'cursor: pointer;',
		'z-index: 100;',
		'opacity: 0.7;',
		'}',
		'.eye-pass-icon:hover {',
		'background-size: 20px 20px;',
		'opacity: 1;',
		'}',
		'.hide-eye-icon {',
		'display:none;',
		'}',
		'.show-pass-warning {',
		'border: 1px solid rgba(236, 81, 81, 0.7) !important;',
		'box-shadow: 0 0 5px rgba(236, 81, 81, 1) !important;',
		'}'
	];
	var style_obj = document.createElement('style');
	style_obj.innerText = css.join('');
	document.documentElement.appendChild(style_obj);

	// First Run
	setTimeout(addEyeIcon, 1000);

	// insertion-query v1.0.3 (2016-01-20)
	// license:MIT
	// Zbyszek Tenerowicz <naugtur@gmail.com> (http://naugtur.pl/)
	var insertionQ=function(){"use strict";function a(a,b){var d,e="insQ_"+g++,f=function(a){(a.animationName===e||a[i]===e)&&(c(a.target)||b(a.target))};d=document.createElement("style"),d.innerHTML="@"+j+"keyframes "+e+" {  from {  outline: 1px solid transparent  } to {  outline: 0px solid transparent }  }\n"+a+" { animation-duration: 0.001s; animation-name: "+e+"; "+j+"animation-duration: 0.001s; "+j+"animation-name: "+e+";  } ",document.head.appendChild(d);var h=setTimeout(function(){document.addEventListener("animationstart",f,!1),document.addEventListener("MSAnimationStart",f,!1),document.addEventListener("webkitAnimationStart",f,!1)},n.timeout);return{destroy:function(){clearTimeout(h),d&&(document.head.removeChild(d),d=null),document.removeEventListener("animationstart",f),document.removeEventListener("MSAnimationStart",f),document.removeEventListener("webkitAnimationStart",f)}}}function b(a){a.QinsQ=!0}function c(a){return n.strictlyNew&&a.QinsQ===!0}function d(a){return c(a.parentNode)?a:d(a.parentNode)}function e(a){for(b(a),a=a.firstChild;a;a=a.nextSibling)void 0!==a&&1===a.nodeType&&e(a)}function f(f,g){var h=[],i=function(){var a;return function(){clearTimeout(a),a=setTimeout(function(){h.forEach(e),g(h),h=[]},10)}}();return a(f,function(a){if(!c(a)){b(a);var e=d(a);h.indexOf(e)<0&&h.push(e),i()}})}var g=100,h=!1,i="animationName",j="",k="Webkit Moz O ms Khtml".split(" "),l="",m=document.createElement("div"),n={strictlyNew:!0,timeout:20};if(m.style.animationName&&(h=!0),h===!1)for(var o=0;o<k.length;o++)if(void 0!==m.style[k[o]+"AnimationName"]){l=k[o],i=l+"AnimationName",j="-"+l.toLowerCase()+"-",h=!0;break}var p=function(b){return h&&b.match(/[^{}]/)?(n.strictlyNew&&e(document.body),{every:function(c){return a(b,c)},summary:function(a){return f(b,a)}}):!1};return p.config=function(a){for(var b in a)a.hasOwnProperty(b)&&(n[b]=a[b])},p}();"undefined"!=typeof module&&"undefined"!=typeof module.exports&&(module.exports=insertionQ);

	// Alternative Run to contemplate possible future DOM insertion of password fields through events
	insertionQ('input[type="password"]').every(addEyeIcon);

    // Key Event to Show/Hide Eye Icon and Password
    document.addEventListener( 'keydown', function(e){
        // Ensure event is not null
        e = e || window.event;
        var key = e.which || e.keyCode || 0;
        if ( useHotKeys ) {
            if ( e.ctrlKey == passwordHotkey.useCtrlKey && e.altKey == passwordHotkey.useAltKey ) {
                if ( key == passwordKeyCode ) {
                    toggleVisibility();
                } else if ( passwordHotkey.charKey == '' && isVisible == false ) {
                    showPassword();
                }
            }
        }
        if ( e.ctrlKey == iconHotkey.useCtrlKey && e.altKey == iconHotkey.useAltKey ) {
            if ( key == iconKeyCode ) {
                toggleIcon();
            }
        }
    }, false);

    document.addEventListener( 'keyup', function(e){
        // Ensure event is not null
        e = e || window.event;
        if ( passwordHotkey.charKey == '' && isVisible == true ) {
            hidePassword();
        }
    }, false);


})();
