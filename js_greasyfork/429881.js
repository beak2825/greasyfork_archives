// ==UserScript==
// @name         二维码快速生成 FastQrcode
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description fast qrcode 选中文字快速生成二维码
// @author       UndCover
// @include      *:*
// @require      https://cdn.staticfile.org/jquery/1.10.0/jquery.min.js
// @require      https://cdn.staticfile.org/jquery.qrcode/1.0/jquery.qrcode.min.js
// @downloadURL https://update.greasyfork.org/scripts/429881/%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%BF%AB%E9%80%9F%E7%94%9F%E6%88%90%20FastQrcode.user.js
// @updateURL https://update.greasyfork.org/scripts/429881/%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%BF%AB%E9%80%9F%E7%94%9F%E6%88%90%20FastQrcode.meta.js
// ==/UserScript==
(function() {
	'use strict';
	function utf16to8(str) {
		var out, i, len, c;
		out = "";
		len = str.length;
		for (i = 0; i < len; i++) {
			c = str.charCodeAt(i);
			if ((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i);
			} else if (c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
				out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			} else {
				out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			}
		}
		return out;
	}
	var code = {
		addElement: function() {
			var tooltip = jQuery('<div id="UndCover_Tooltip" style="display:none;width:auto; height:auto; padding:10px;background:orange no-repeat left top;"><a id="UndCover_Show">显示</a> <a id="UndCover_Current">网址</a> <a id="UndCover_Close">关闭</a></div>');
			var qrcode = jQuery('<div id="UndCover_Qrcode" style="display:none;z-index:999; display:block; position:fixed; left:300px; top:100px; margin:0; width:auto; height:auto;"></div>');
			jQuery('body').append(tooltip);
			jQuery('body').append(qrcode);
			// $(".UndCoverIcon").css({
			// 	"width": "30px",
			// 	"height": "30px",
			// 	"fill": "#80808080",
			// 	"overflow": "hidden"
			// });
		},
		eventHandle: function() {
			var selection = "";
			var clickable = true;
			var $qrcode = $("#UndCover_Qrcode");
			/* 绑定鼠标左键按住事件 */
			$qrcode.bind("mousedown",
			function(event) {
				clickable = true;
				/* 获取需要拖动节点的坐标 */
				var offset_x = $(this)[0].offsetLeft; //x坐标
				var offset_y = $(this)[0].offsetTop; //y坐标
				/* 获取当前鼠标的坐标 */
				var mouse_x = event.pageX;
				var mouse_y = event.pageY;
				/* 绑定拖动事件 */
				/* 由于拖动时，可能鼠标会移出元素，所以应该使用全局（document）元素 */
				$(document).bind("mousemove",
				function(ev) {
					clickable = false;
					/* 计算鼠标移动了的位置 */
					var _x = ev.pageX - mouse_x;
					var _y = ev.pageY - mouse_y;
					/* 设置移动后的元素坐标 */
					var now_x = (offset_x + _x) + "px";
					var now_y = (offset_y + _y) + "px";
					/* 改变目标元素的位置 */
					$qrcode.css({
						top: now_y,
						left: now_x
					});
				});
			});
			/* 当鼠标左键松开，接触事件绑定 */
			$(document).bind("mouseup",
			function() {
				$(this).unbind("mousemove");
			});

			$("body").mouseup(function(e) {
				$("#UndCover_Tooltip").hide();
				var x = 10;
				var y = 10;
				var r = "";
				if (document.selection) {
					r = document.selection.createRange().text;
				} else if (window.getSelection()) {
					r = window.getSelection();
				}
				if (r != "") {
					selection = r.toString();
					$("#UndCover_Tooltip").css({
						"top": (e.pageY + y) + "px",
						"left": (e.pageX + x) + "px",
						"position": "absolute"
					}).show("fast");
					$("#UndCover_Tooltip").show();
				}
			});
			$("#UndCover_Show").click(function() {
				$('#UndCover_Qrcode').empty();
				$('#UndCover_Qrcode').qrcode(utf16to8(selection));
				$('#UndCover_Qrcode').show();
			});
			$("#UndCover_Current").click(function() {
				$('#UndCover_Qrcode').empty();
				$('#UndCover_Qrcode').qrcode(window.location.href);
				$('#UndCover_Qrcode').show();
			});
			$("#UndCover_Close").click(function() {
				$("#UndCover_Tooltip").hide();
			});
			$("#UndCover_Qrcode").click(function() {
				if (clickable) $("#UndCover_Qrcode").hide();
			});
		}
	}
	code.addElement();
	code.eventHandle();
})();