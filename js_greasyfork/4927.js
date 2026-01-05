// ==UserScript==
// @name       pageNote 网页笔记
// @namespace  
// @version v1.4.1
// @require 	http://code.jquery.com/jquery-2.1.1.js
// @description 在你感兴趣的网页上添加便笺或笔记 按 "shift+鼠标左键"" 添加笔记//Press "shift + left key" to add sticky notes in any webpage wherever you like
// @description  For more imformation or copyright problems,please email me at wang0xinzhe@gmail.com. 
// @include      /^https?://*/
// @exclude      http://pan.baidu.com/*
// @exclude      http://play.baidu.com/*
// @exclude      http://www.baidu.com/*
// @exclude      /^https?://www\.google\./
// @exclude      /^https?://\.bing\./
// @exclude     http://tieba.baidu.com
// @encoding    utf-8
// @grant       GM_registerMenuCommand
// @license      MIT license
// @run-at document-end
// @copyright  2014,04,18 __By Wang Hsin-che   
// @downloadURL https://update.greasyfork.org/scripts/4927/pageNote%20%E7%BD%91%E9%A1%B5%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/4927/pageNote%20%E7%BD%91%E9%A1%B5%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// my custom jquery draggable plugin//////////////////////////////////////////////////////////////////////////////
// by Wang Hsin-che @ 2014.07 
// version : 0.2
(function($) {
	$.fn.draggable = function(options) {
		var settings = $.extend({
			handle: undefined,
			msg: {},
			callfunction: function() {}
		}, options);
		var _eleFunc = function() {
			var x0, y0,
				ele = $(this),
				handle;
			handle = (settings.handle === undefined ? ele : ele.find(settings.handle).eq(0) === undefined ? ele : ele.find(settings.handle).eq(0));
			ele.css({
				position: "absolute"
			}); //make sure that the "postion" is "absolute"
			handle.bind('mousedown', function(e0) {
				handle.css({
					cursor: "move"
				}); //set the appearance of cursor 
				x0 = ele.offset().left - e0.pageX; //*1
				y0 = ele.offset().top - e0.pageY; //*1
				$(document).bind('mousemove', function(e1) { //bind the mousemove event, caution:this event must be bind to "document"
					ele.css({
						left: x0 + e1.pageX,
						top: y0 + e1.pageY
					}); //this expression and the expression of *1 equal to "ele.origin_offset+mouse.current_offset-mouse.origin_offset"
				});
				$(document).one('mouseup', settings.msg, function(e) { //when the mouse up,unbind the mousemove event,bind only once
					settings.callfunction(e); //callback function
					$(document).unbind('mousemove');
					handle.css({
						cursor: "auto"
					});
				});
			});

			// 從這裡開始
		};
		return this.each(_eleFunc);
	};
})(jQuery);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

var pNote = (function($) {


	function setCSS() {
		var css = '	<style type="text/css">\
	.wxz-noteDiv{\
	z-index:99;\
	box-shadow:0 0 9px rgba(0,0,0,.9);\
	background:#FFCC00;\
	width:200px;\
	position:absolute;\
	outline:0 none;\
}\
.wxz-noteDiv-head{\
	background:#FFCC00;\
	outline:0 none;\
	text-align:center;\
	 width:200px;\
	 line-height: initial;\
	 font:13px/1.5 "微软雅黑",arial,serif;\
}\
.wxz-noteDiv-head-title{\
	text-align:center;\
}\
.wxz-noteDiv-head-close{\
	cursor:pointer;\
	position:absolute;\
	right:5px;\
}\
.wxz-noteDiv-content{\
	background:#FFFF66 ;\
	padding:5px 9px;\
	font:13px/1.5 "微软雅黑",arial,serif;\
	word-wrap:break-word;\
	min-height:200px;\
	outline:0 none;\
	text-align:left;\
}\
	</style>';
		$('head:first').append(css);
	}

	function getSTO() {
		//import localStorage.mysto to stotage
		var sto;
		if (localStorage.getItem('wxz-sto') !== null) {
			sto = JSON.parse(localStorage.getItem('wxz-sto'));
		} else {
			sto = {};
		}
		return sto;
	}

	function upDateSTO(storage) {

		localStorage.setItem('wxz-sto', JSON.stringify(storage)); //update localStorage.mysto with storage

	}

	function addNoteToStorage(keyName, x, y, text) {
		var path = {},
			temp = {},
			storage = getSTO(); //just call for add notes  not for update or delete
		temp.keyName = keyName;
		temp.x = x;
		temp.y = y;
		temp.text = text;
		if (storage[location.pathname] !== undefined) {
			path = storage[location.pathname];
		}
		path[temp.keyName] = temp; //save notes to path
		storage[location.pathname] = path;
		upDateSTO(storage); //update local storage

		path = null;
		temp = null;
		storage = null;
	}

	function removeNoteFromStorage(keyName) {

		var path = {},
			storage = getSTO();
		path = storage[location.pathname];
		if (path !== undefined) {
			delete path[keyName];
			if (Object.keys(path).length === 0) {
				delete storage[location.pathname];
			} else {
				storage[location.pathname] = path;
			}
			//update the localStorage.pathname
			upDateSTO(storage);
		}
		path = null;
		storage = null;
	}

	function save(keyName) {
		var
			x, y, text,
			selector = "div[keyName='" + keyName + "']";
		x = $(selector).css('left');
		y = $(selector).css('top');
		text = $(selector).find('.wxz-noteDiv-content').html();
		addNoteToStorage(keyName, x, y, text);
		$(selector).find('.wxz-noteDiv-head-flag').text('');
	}

	function del(keyName) {
		if (confirm("Do you like to delete the note？")) {
			var selector = "div[keyName='" + keyName + "']";
			$(selector).remove();
			removeNoteFromStorage(keyName);
		}
	}

	function show(keyName, x, y, text) {
		var
			html = '<div class="wxz-noteDiv" >\
<div class="wxz-noteDiv-head">\
<nobr class="wxz-noteDiv-head-flag">*</nobr><nobr class="wxz-noteDiv-head-title"></nobr><nobr class="wxz-noteDiv-head-close">X</nobr>\
</div>\
<div class="wxz-noteDiv-content" contenteditable="true"></div>\
</div>',
			thisNote,
			tempTime = new Date(parseInt(keyName, 10));
		thisNote = $(html);
		thisNote.appendTo('body:first');
		thisNote.attr('keyName', keyName);
		thisNote.find('.wxz-noteDiv-head-title').html(tempTime.toDateString());
		//set the coordinate
		thisNote.css({
			position: 'absolute',
			top: y,
			left: x
		});
		//write text to content
		thisNote.find('.wxz-noteDiv-content').html(text);
		// draggable;
		thisNote.draggable({
				handle: '.wxz-noteDiv-head',
				msg: {
					msg: keyName
				},
				callfunction: function(e) {
					save(e.data.msg);
				}
			}
		);
		//bind click event
		thisNote.find('.wxz-noteDiv-head-close').bind('click', {
			msg: keyName
		}, function(e) {
			del(e.data.msg);
		});
		//save when it lost focus
		thisNote.focusout({
			msg: keyName
		}, function(e) {
			save(e.data.msg);
		});
		thisNote.focusin(function() {
			thisNote.find('.wxz-noteDiv-head-flag').text('*');
		});

	}

	function loadNotes() {
		var
			noteList,
			storage = getSTO();
		if (storage[location.pathname] !== undefined) {
			noteList = storage[location.pathname];
			$.each(noteList, function(i, e) {
				show(e.keyName, e.x, e.y, e.text);
			});
			$('.wxz-noteDiv-head-flag').text('');
		}
		console.log('load notes successfully');
	}

	// function showNotes() {
	// 	$("wxz-noteDiv").css({
	// 		'display': 'inline'
	// 	});
	// }

	// function closeNotes() {
	// 	$("wxz-noteDiv").css({
	// 		'display': 'none'
	// 	});
	// }

	return {

		init: function() {
			// GM_registerMenuCommand("显示全部笔记...", showNotes, "s");
			// GM_registerMenuCommand("关闭笔记...", closeNotes, "c");
			setCSS();
			loadNotes();
			$("body").mousedown(function(e) {
				if (e.shiftKey) {
					var
						x = e.pageX,
						y = e.pageY,
						keyName = (new Date()).getTime();
					// keyName = e.timeStamp;//a bug in firefox since 2004
					e.preventDefault();
					show(keyName, x, y, '');
					console.log('new note');
				}
			});
			console.log('initialized successfully');
		}

	};

})(jQuery);

pNote.init();