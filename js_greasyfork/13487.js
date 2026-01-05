// ==UserScript==
// @name			Freenode Web IRC 刷屏插件
// @namespace		xuyiming.open@outlook.com
// @description		在 Freenode Web IRC 聊天室中创造瀑布
// @author			依然独特
// @version			1.0.0
// @grant			none
// @run-at			document-end
// @include			http://webchat.freenode.net/*
// @match			http://webchat.freenode.net/*
// @license			Public Domain
// @homepageURL		https://gist.github.com/xymopen/e10ecd98485f97b7372b
// @downloadURL https://update.greasyfork.org/scripts/13487/Freenode%20Web%20IRC%20%E5%88%B7%E5%B1%8F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/13487/Freenode%20Web%20IRC%20%E5%88%B7%E5%B1%8F%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

"use strict";

( function() {
	var POST_INTERVAL = 250;

	function main() {
		var intervalID, post, e = document.querySelector( "div.dynamicpanel.qwebirc-qui.bottomboundpanel.widepanel.input" );

		intervalID = setInterval( function() {
			if ( e.style.display !== "none" ) {
				load();
				clearInterval( intervalID );
			}
		}, 1000 );

		post = ( function() {
			var queue = [ ],
				form = document.querySelector( "form.input" ),
				input = form.querySelector( "input.keyboard-input" );

			function next() {
				if ( queue.length > 0 ) {
					input.value = queue.shift();
					submit( form );
				}
			};

			function submit( form ) {
				var event = document.createEvent( "HTMLEvents" );
				event.initEvent( "submit", true, true );
				form.dispatchEvent( event );
			};

			form.addEventListener( "submit", function () {
				setTimeout( next, POST_INTERVAL );
			}, false );

			return function( message ) {
				queue = queue.concat( message.replace( /\t/g, "    " ).split( "\n" ).filter( function( line ) {
					// 去掉空行
					return !/^\s+$/.test( line );
				} ) );
				next();
			};
		} )();

		function load() {
			var textarea = document.createElement( "textarea" ),
				position = {
					self:		{ x: 0, y: 0 },				//元素相对基准点的位置
					viewport:	{ x: 0, y: 0 },				//基准点在页面中的位置
					cursor:		{ x: 0, y: 0 }				//光标相对元素的位置
				};

			function onkeydown( event ) {
				var value, selectionStart, selectionEnd, beforeSelected, selected, afterSelected;

				// Tab 添加缩进而不是切换焦点
				if ( event.keyCode === 9 ) {
					event.preventDefault();

					value = textarea.value;

					selectionStart = textarea.selectionStart;
					selectionEnd = textarea.selectionEnd;

					beforeSelected = value.slice( 0, selectionStart );
					selected = value.slice( selectionStart, selectionEnd );
					afterSelected = value.slice( selectionEnd );

					selected = selected.split( "\n" ).map( function( line ) {
						return "\t" + line;
					} ).join( "\n" );

					textarea.value = beforeSelected + selected + afterSelected;

					// 如果没有选定内容，则将光标移至制表符后
					if ( selectionStart === selectionEnd ) {
						textarea.selectionStart = textarea.selectionEnd = selectionEnd + 1;
					// 否则，选定制表符和原有选定内容
					} else {
						textarea.selectionStart = selectionStart;
						textarea.selectionEnd = selectionStart + selected.length;
					}
				// Ctrl + Enter 发送消息
				} else if ( event.ctrlKey && event.keyCode === 13 && textarea.value.replace( /\s/g, "" ) ) {
					event.preventDefault();
					post( textarea.value.trim() );
					textarea.value = "";
				}
			};

			function onmousedown( event ) {
				var x, y, style, rect;

				// 按住 Ctrl 和鼠标可以移动 <textarea>
				if ( event.ctrlKey ) {
					event.preventDefault();

					style = getComputedStyle( textarea );
					rect = ( textarea.offsetParent && textarea.offsetParent.getBoundingClientRect() ) || { top: 0, left: 0 };

					/*
					switch( style.position ) {
						case "absolute":
						case "fixed":
							position.self.x = textarea.offsetLeft - parseInt( style.marginLeft );
							position.self.y = textarea.offsetTop - parseInt( style.marginTop );
							break;
						case "relative":
							x = textarea.offsetLeft,
							y = textarea.offsetTop;
							textarea.style.top = "0px";
							textarea.style.left = "0px";
							position.self.x = x - textarea.offsetLeft;
							position.self.y = y - textarea.offsetTop;
							break;
						default:
							// static 定位元素无法拖动
							return;
					}
					*/

					/* */
					position.self.x = textarea.offsetLeft - parseInt( style.marginLeft, 10 );
					position.self.y = textarea.offsetTop - parseInt( style.marginTop, 10 );
					/* */

					position.viewport.x = rect.left;
					position.viewport.y = rect.top;
					position.cursor.x = event.pageX - position.viewport.x - position.self.x;
					position.cursor.y = event.pageY - position.viewport.y - position.self.y;

					textarea.style.top = position.self.y + "px";
					textarea.style.left = position.self.x + "px";
					textarea.style.bottom = "auto";
					textarea.style.right = "auto";

					document.addEventListener( "mousemove", onmousemove, false );
					document.addEventListener( "mouseup", onmouseup, false );
				}
			};

			function onmousemove( event ) {
				event.preventDefault();
				textarea.style.top = event.pageY - position.viewport.y - position.cursor.y + "px";
				textarea.style.left = event.pageX - position.viewport.x - position.cursor.x + "px";
			};

			function onmouseup( event ) {
				event.preventDefault();
				position = {
					self:		{ x: 0, y: 0 },
					viewport:	{ x: 0, y: 0 },
					cursor:		{ x: 0, y: 0 }
				};
				document.removeEventListener( "mousemove", onmousemove, false );
				document.removeEventListener( "mouseup", onmouseup, false );
			};

			textarea.style.border = "1px solid rgb( 195, 210, 224 )";
			textarea.style.width = "150px";
			textarea.style.height = "75px";
			textarea.style.top = "45px";
			textarea.style.right = "150px";
			textarea.style.position = "fixed";

			textarea.addEventListener( "keydown", onkeydown, false );
			textarea.addEventListener( "mousedown", onmousedown, false );

			document.body.appendChild( textarea );
		};
	};

	if ( document.readyState === "complete" ) {
		main();
	} else {
		// 因为需要等待样式表
		window.addEventListener( "load", main.bind( this ), false );
	}
} )();