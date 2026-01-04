// ==UserScript==
// @name          Twitch Confirm Message Send
// @namespace     http://userstyles.org
// @description   Confirms Twitch Chat Messages
// @author        636597
// @include       *://*.twitch.tv/*
// @run-at        document-start
// @version       0.3
// @downloadURL https://update.greasyfork.org/scripts/373464/Twitch%20Confirm%20Message%20Send.user.js
// @updateURL https://update.greasyfork.org/scripts/373464/Twitch%20Confirm%20Message%20Send.meta.js
// ==/UserScript==


// https://www.cssscript.com/simple-plain-popup-box-vanilla-javascript-smile-alert/
// (function () {
//     window.CustomConfirm = CustomConfirm;
//     window.C2 = CustomConfirm;

//     var template;
//     var showing = false;

//     function CustomConfirm(config, callback) {
//         if (! arguments.length) {
//             throw 'CustomConfirm: No arguments were passed';
//         }

//         if (typeof config === 'function') {
//             callback = config;
//         }

//         config = getFinalConfig(config);

//         if (config.targets) {
//             var limit = config.targets.length;

//             if (limit > 0) {
//                 var dialog = new Dialog(config, callback);

//                 for (var i = 0; i < limit; i++) {
//                     setupEvents(config.targets[i], dialog);
//                 }
//             }
//         } else {
//             var dialog = new Dialog(config, callback);
//             dialog.show();
//         }
//     }

//     function Dialog(settings, callback) {
//         var _this = this;
//         var modal = getTemplate();

//         var title = modal.querySelector('.c2_title');
//         var close = modal.querySelector('.c2_btn-close');
//         var yes = modal.querySelector('.c2_btn-yes');
//         var no = modal.querySelector('.c2_btn-no');
//         var body = modal.querySelector('.c2_body');

//         title.innerHTML = settings.title;
//         body.innerHTML = settings.body;
//         close.innerHTML = settings.btn_close;
//         yes.innerHTML = settings.btn_yes;
//         no.innerHTML = settings.btn_no;

//         close.addEventListener('click', cancel);
//         no.addEventListener('click', cancel);
//         yes.addEventListener('click', confirm);

//         if (settings.has_overlay) {
//             var overlay = document.createElement('DIV');

//             modal.appendChild(overlay);
//             overlay.className = 'c2_overlay';
//             overlay.addEventListener('click', cancel);
//         }

//         function cancel(event) {
//             event.preventDefault();
//             _this.hide();

//             if (typeof callback === 'function') {
//                 callback(false, _this.context);
//             }

//             _this.setContext(undefined);
//         }

//         function confirm(event) {
//             event.preventDefault();
//             _this.hide();

//             if (typeof callback === 'function') {
//                 callback(true, _this.context);
//             }

//             _this.setContext(undefined);
//         }

//         _this.modal = modal;
//     }

//     Dialog.prototype.setContext = function (context) {
//         this.context = context;
//     };

//     Dialog.prototype.show = function () {
//         if (showing) {
//             $warn('CustomConfir: There\'s already a confirm showing');
//             return;
//         }

//         showing = true;
//         document.body.appendChild(this.modal);
//     };

//     Dialog.prototype.hide = function () {
//         showing = false;
//         this.modal.remove();
//     };

//     function getFinalConfig(config) {
//         var _defaults = {
//             title: 'Confirm dialog',
//             body: 'Are you sure ?',
//             btn_yes: 'confirm',
//             btn_no: 'cancel',
//             btn_close: '',
//             has_overlay: true
//         };

//         if (typeof config === 'string') {
//             _defaults.targets = config;
//         } else if (typeof config === 'object') {
//             Object.assign(_defaults, config)
//         }

//         if (typeof _defaults.targets === 'string') {
//             _defaults.targets = document.querySelectorAll(_defaults.targets);
//         } else if (typeof _defaults.targets === 'object' && ! _defaults.targets.length) {
//             _defaults.targets = [_defaults.targets];
//         }

//         return _defaults;
//     }

//     function setupEvents(el, dialog) {
//         el.addEventListener('click', function (event) {
//             event.preventDefault();
//             dialog.setContext(el);
//             dialog.show();
//         }, false);
//     }

//     function getTemplate() {
//         if (! template) {
//             template = document.createElement('DIV');
//             template.className = 'c2';
//             template.innerHTML = '<div class="c2_content"> <header class="c2_header"> <h2 class="c2_title"></h2> <button class="c2_btn-close"></button> </header> <div class="c2_body"> </div><footer class="c2_footer"> <button class="c2_btn-no"></button> <button class="c2_btn-yes"></button> </footer>';
//         }

//         return template.cloneNode(true);
//     }

//     function $warn() {
//         if (typeof window.console === 'object' && typeof console.warn === 'function') {
//             console.warn.apply(console, arguments);
//         }
//     }

// })();

var custom_confirm_css_rules = [
	".c2{position:fixed;z-index:1000;top:0;left:0;right:0;bottom:0;font-family:arial, sans-serif}" ,
	".c2_content{max-width:300px;margin:50px auto 0;padding:10px;background:#fff;border-radius:4px;-webkit-box-shadow:0 0 10px rgba(0, 0, 0, 0.4);box-shadow:0 0 10px rgba(0, 0, 0, 0.4)}" ,
	".c2_header{position:relative;display:flex;justify-content:space-between}" ,
	".c2_title{margin:0;flex:1;font-size:24px;text-align:center}" ,
	".c2_body{margin:10px;font-size:16px;text-align:center}" ,
	".c2_btn-close{position:absolute;top:0;right:0;width:20px;height:20px;padding:0;font-size:12px;font-weight:700;text-align:center;background:none;border:1px solid #000;border-radius:50%;cursor:pointer;transition:all 0.4s}" ,
	".c2_btn-close:hover{opacity:0.4}" ,
	".c2_btn-close:before{content:'X'}" ,
	".c2_footer{margin-top:20px;text-align:center}" ,
	".c2_btn-no{margin:0 5px;padding:4px 14px;font-size:18px;border-radius:20px;border:1px solid #000;cursor:pointer;transition:all 0.4s}" ,
	".c2_btn-yes{margin:0 5px;padding:4px 14px;font-size:18px;border-radius:20px;border:1px solid #000;cursor:pointer;transition:all 0.4s}" ,
	".c2_btn-no{background:#000;color:#fff}" ,
	".c2_btn-yes{background:#fff;color:#000}" ,
	".c2_btn-no:hover{color:#000;border-color:transparent;background:rgba(0, 0, 0, 0.1)}" ,
	".c2_btn-yes:hover{color:#000;border-color:transparent;background:rgba(0, 0, 0, 0.1)}" ,
	".c2_overlay{position:absolute;z-index:-1;top:0;left:0;right:0;bottom:0;background:rgba(0, 0, 0, 0.5)}"
];

function add_confirm_styles() {
	var sheet = window.document.styleSheets[ 0 ];
	for ( var i = 0; i < custom_confirm_css_rules.length; ++i ){
		sheet.insertRule( custom_confirm_css_rules[ i ]	, sheet.cssRules.length );
	}
}

var chat_box_send_button_query_selector = '[data-a-target="chat-send-button"]';
var chat_box_send_button_element = null;
var chat_box_element_query_selector = '[data-a-target="chat-input"]';
var chat_box_element = null;
var chat_box_observer = null;
var observerConfig = {
	attributes: true,
	childList: true,
	characterData: true
};

function sending_exec( event , value ) {
	event.target.dispatchEvent( event );
}

function confirm_send( event ) {
	CustomConfirm( function ( confirmed , element ) {
		if ( confirmed ) {
			console.log( "passing" );
			sending_exec( event );
			return true;
		}
		else {
			console.log( "Prevented !!!" );
			return false;
		}
	});
}

function loadObserver() {

	// chat_box_element.addEventListener( "keydown" , function( event ) {
	// 	if ( event.key === "Enter" ) {
	// 		event.stopImmediatePropagation();
	// 		event.stopPropagation();
	// 		event.preventDefault();
	// 		confirm_send( event );
	// 	}
	// } , false );

	chat_box_element.addEventListener( "keydown" , function( event ) {
		if ( event.key === "Enter" ) {
			if ( confirm( "Do you want to post message?" ) === true ) {
				console.log( "passing" );
			} else {
				event.stopImmediatePropagation();
				event.stopPropagation();
				event.preventDefault();
				return false;
			}
		}
	});


	chat_box_send_button_element.addEventListener( "click" , function( event ) {
		if ( confirm( "Do you want to post message?" ) === true ) {
			console.log( "passing" );
		} else {
			event.stopImmediatePropagation();
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
	});

	// setTimeout( function() {
	// 	add_confirm_styles();
	// } , 2000 );

	console.log( "Twitch Message Confirm Loaded" );
}


(function() {
	var ready = setInterval(function(){
		var x1 = document.querySelectorAll( chat_box_element_query_selector );
		if ( x1 ) { if ( x1[ 0 ] ) {
			chat_box_element = x1[0];
			var x2 = document.querySelectorAll( chat_box_send_button_query_selector );
			if ( x2 ) { if ( x2[ 0 ] ) {
				chat_box_send_button_element = x2[ 0 ];
				clearInterval( ready );
				loadObserver();
			}}
		}}
	} , 2 );
	setTimeout( function() { clearInterval( ready ); } , 20000 );
})();