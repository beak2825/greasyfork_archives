// ==UserScript==
// @name        GA quick edit & auto-hide
// @namespace   glav.su
// @description Быстрая установка АУ/АС и быстрое редактирование сообщений на форуме ГА.
// @include     http://glav.su/*
// @include     https://glav.su/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25888/GA%20quick%20edit%20%20auto-hide.user.js
// @updateURL https://update.greasyfork.org/scripts/25888/GA%20quick%20edit%20%20auto-hide.meta.js
// ==/UserScript==
function addStyle(styleText) {
	var style = document.createElement('style');
	if (document.head) {
		document.head.appendChild(style);
		style.innerHTML = styleText;
	}
}
addStyle([
	'.qe_popup {',
		'cursor: pointer;',
		'display: none;',
		'border: 1px solid #aaa;',
		'padding: 5px 2px;',
		'white-space: nowrap;',
		'border-radius: 5px;',
		'position: absolute;', 
		'box-shadow: 3px 3px 10px #444;',
		'background-color: #fff;',
	'}',
	'.qe_option {',
		'display: block;',
		'text-decoration: none;',
		'color: #000;',
		'background-color: #fff;',
		'padding: 2px 12px;',
	'}',
	'.qe_option:hover {',
		'text-decoration: none;',
		'color: #fff;',
		'background-color: #369;',
	'}',
	'.qe_edit {',
		'display: block;',
		'color: #000;',
		'background-color: #fff;',
		'padding: 0px;',
		'position: absolute;',
	'}',
	'.qe_edit_content {',
		'margin: 2px 10px;',
		'resize: none;',
		'border: 1px solid #aaf;',
	'}',
	'.qe_quote {',
		'display: block;',
		'color: #000;',
		'background-color: #fff;',
		'padding: 0px;',
		'position: absolute;',
	'}',
	'.qe_quote_content {',
		'margin: 2px 10px;',
		'resize: none;',
		'border: 1px solid #aaf;',
	'}',
	'.icoLoading {',
		'background-image: url(/files/messages/e2c6fce4a064ddfa31b8b49380206c88.gif);',
	'}',
	'.icoQuickAUAS {',
		'background-image: url(/files/messages/2175f0127d70a9ed87c6f78a9b44ce98.gif);',
	'}',
	'.icoQuickEdit {',
		'background-image: url(/files/messages/62084ab537f806e01833d9a9d417384b.png);',
	'}',
	'.icoQuote {',
		'background-image: url(/files/messages/e482fdf83cd8dddd6712c23e9cc26e5a.png);',
	'}',
].join(''));
var $sandbox = ((s=$("#sandbox")).length == 1)? 
		s : $('<div id="sandbox" style="display: none;">').appendTo( $(document.body) );//песочница
var $auas_box = $('<div id="auas_box" class="qe_popup">')
		.mouseenter(function(){ $auas_box.under_mouse = true; })
		.mouseleave(function(){ $auas_box.under_mouse = false; });
$auas_box.under_mouse = false;
var $edit_box = $('<div id="edit_box" class="qe_edit">')
		.append($('<div style="heigth: 24px; padding: 3px 15px; font-size: 14px;">')
			.append($('<a id="qe_save" class="cBlueButton" href="javascript: void(0);">Сохранить</a>')
				.click(function(){
					var button = $("#forumMessagesListMessage" + $edit_box.m_id + "QuickEditButton")[0];
					toggleElClass(button, ['icoQuickEdit', 'icoLoading'], 1);
					$(button).attr('state', "1");
					$edit_box.hide();
					$edit_box.post_data['content'] = $("#edit_box_content").val();
					$.ajax({
						method: 'POST',
						url: $edit_box.edit_url,
						data: $edit_box.post_data,
						dataType: 'html',
						success: function(res){
							toggleElClass(button, ['icoQuickEdit', 'icoLoading'], 0);
							$(button).attr('state', "0");
							$edit_box.detach();
							var mess = res.replace(mess_rg($edit_box.m_id), '$1');
							$('#forumMessagesListMessage'+$edit_box.m_id+'Content').html(mess);
						}
					})
				})
			)
			.append($('<a id="qe_cancel" class="cBlueButton" style="margin-left: 2px;" href="javascript: void(0);">Отменить</a>')
				.click(function(){
					var button = $("#forumMessagesListMessage" + $edit_box.m_id + "QuickEditButton")[0];
					toggleElClass(button, ['icoQuickEdit', 'icoLoading'], 0);
					$edit_box.hide();
					$(button).attr('state', "0");
				})
			)
		)
		.append('<textarea id="edit_box_content" class="qe_edit_content">');
var $quote_box = $('<div id="quote_box" class="qe_quote">')
		.append($('<div style="heigth: 24px; padding: 3px 15px; font-size: 14px;">')
			.append($('<a id="qu_close" class="cBlueButton" style="margin-left: 2px;" href="javascript: void(0);">Закрыть</a>')
				.click(function(){
					var button = $("#forumMessagesListMessage" + $quote_box.m_id + "QuickQuoteButton")[0];
					toggleElClass(button, ['icoQuote', 'icoLoading'], 0);
					$quote_box.hide();
					$(button).attr('state', "0");
				})
			)
		)
		.append('<textarea id="quote_box_content" class="qe_quote_content">');
		
$(document.body).click(function(){
	if(!$auas_box.under_mouse){
		$auas_box.hide().closest("td").find("a.cBlueButton").attr('state', "0");
	} 
});

function toggleElClass(el, clss, val){
	val = +val;
	$(el).removeClass(clss[+(!val)]).addClass(clss[val]);
}

function mess_rg(m_id){
	return new RegExp('[\\s\\S]*<td id="forumMessagesListMessage'+m_id+'Content" class="fItem forumMessagesListMessageContent">([\\s\\S]+?)<\/td>[\n\r\\s\\t]*<\/tr>[\n\r\\s\\t]*<\/tbody>[\n\r\\s\\t]*<\/table>[\n\r\\s\\t]*<table class="f" width="100%">[\\s\\S]*', 'i');
}

$(".forumMessagesListMessageArchiveButton").each(function(bidx, b_archive){
	var m_id = $(b_archive).attr("id").replace(/forumMessagesListMessage(\d+)ArchiveButton/, '$1');
	if( $(b_archive).closest("tr").find(".forumMessagesListMessageEditButton").length === 1 ){
		var b_edit = $(b_archive).closest("tr").find(".forumMessagesListMessageEditButton")[0],
			edit_url = $(b_edit).find("a").attr("href");
		$(b_edit).closest("tr")
			.append($('<td class="fItem">')
				.append($('<a href="javascript: void(0);">&nbsp;</a>')
					.attr('id', "forumMessagesListMessage" + m_id + "AutoHideButton")
					.attr('title', "Изменить АУ/АС")
					.attr('class', "cBlueButton icoButton icoQuickAUAS")
					.attr('state', "0")
					.click(function(){
						if( $(this).attr('state') == '0' ){
							if( $auas_box.is(":visible") ){
								var d_button = $auas_box.hide().closest("td").find("a.cBlueButton").attr('state', "0");
								toggleElClass(d_button, ['icoQuickAUAS', 'icoLoading'], 0);
							}
							toggleElClass(this, ['icoQuickAUAS', 'icoLoading'], 1);
							$(this).attr('state', "1");
							var _this = this;
							$.ajax({
								url: edit_url,
								dataType: 'html',
								success: function(data){
									if( $(_this).attr('state') !== '1' ) return true;
									var rg = /[\s\S]*(<form[\s\S]*?<\/form>)[\s\S]*/i;
									$sandbox.empty().html( data.toString().replace(rg, '$1') );
									$auas_box.empty().detach();
									var form_data = {};
									$("#sandbox").find(":input").each(function(ix, inp){
										if(typeof (key = $(inp).attr("name")) !== 'undefined'){
											form_data[key] = $(inp).val();
										}
									})
									var hide_opts;
									if(typeof form_data['isHidden'] !== 'undefined'){
										hide_opts = [{val: 0}, {val: 0}];
										delete form_data['isHidden'];
									}else if(typeof form_data['autoHide'] !== 'undefined'){
										hide_opts = $("#sandbox").find("select[name=autoHide] option");
									}
									$.each(hide_opts, function(ix, op){
										if(ix == 0) return true;
										var ah_v = (typeof op.val !== 'undefined')? op.val : $(op).val();
										var caption = (ah_v == 0)? 
											'Не скрывать' :
											['Автоскрытие', 'Автоудаление'][+(ah_v<0)]+' через '+Math.abs(ah_v)+' ч.';
										$('<a class="qe_option" href="javascript: void(0);">'+caption+'</a>')
											.click(function(){
												toggleElClass(_this, ['icoQuickAUAS', 'icoLoading'], 1);
												$(_this).attr('state', "1");
												$auas_box.hide();
												var post_data = $.extend({}, form_data);
												post_data['autoHide'] = ah_v;
												$.ajax({
													method: 'POST',
													url: edit_url,
													data: post_data,
													dataType: 'html',
													success: function(res){
														toggleElClass(_this, ['icoQuickAUAS', 'icoLoading'], 0);
														$(_this).attr('state', "0");
														var mess = res.replace(mess_rg(m_id), '$1');
														$('#forumMessagesListMessage'+m_id+'Content').html(mess);
													}
												});
											})
											.appendTo($auas_box);
									});
									toggleElClass(_this, ['icoQuickAUAS', 'icoLoading'], 0);
									$(_this).attr('state', "2");
									$auas_box.appendTo($td=$(_this).closest("td"))
										.css({top: $td.offset().top + $td.outerHeight(), 
											left: $td.offset().left - $auas_box.outerWidth() + $td.outerWidth()})
										.slideDown(100);
								}
							});
						}else if( $(this).attr('state') == '2' ){
							$auas_box.hide();
							$(this).attr('state', "0");
						}
					})
					.mouseenter(function(){ $auas_box.under_mouse = true; })
					.mouseleave(function(){ $auas_box.under_mouse = false; })
				)
			)
			.append($('<td class="fItem">')
				.append($('<a href="javascript: void(0);">&nbsp;</a>')
					.attr('id', "forumMessagesListMessage" + m_id + "QuickEditButton")
					.attr('title', "Быстрое редактирование")
					.attr('class', "cBlueButton icoButton icoQuickEdit")
					.attr('state', "0")
					.click(function(){
						if( $(this).attr('state') == '0' ){
							if( $edit_box.is(":visible") ){
								var button = $("#forumMessagesListMessage" + $edit_box.m_id + "QuickEditButton")[0];
								toggleElClass(button, ['icoQuickEdit', 'icoLoading'], 0);
								$edit_box.hide();
								$(button).attr('state', "0");
							}
							toggleElClass(this, ['icoQuickEdit', 'icoLoading'], 1);
							$(this).attr('state', "1");
							var _this = this;
							$.ajax({
								url: edit_url,
								dataType: 'html',
								success: function(data){
									if( $(_this).attr('state') !== '1' ) return true;
									var rg = /[\s\S]*(<form[\s\S]*?<\/form>)[\s\S]*/i;
									$sandbox.empty().html( data.toString().replace(rg, '$1') );
									var form_data = {};
									$("#sandbox").find(":input").each(function(ix, inp){
										if(typeof (key = $(inp).attr("name")) !== 'undefined'){
											form_data[key] = $(inp).val();
										}
									})
									toggleElClass(_this, ['icoQuickEdit', 'icoLoading'], 0);
									$(_this).attr('state', "2");
									$edit_box.detach().appendTo($td=$('#forumMessagesListMessage'+m_id+'Content'))
										.css({top: $td.offset().top, left: $td.offset().left,
												width: $td.width(), height: $td.height()});
									$edit_box.m_id = m_id;
									$edit_box.edit_url = edit_url;
									$edit_box.post_data = $.extend({}, form_data);
									$("#edit_box_content")
										.css({height: $edit_box.height() - 44, width: $edit_box.width() - 20})
										.val($edit_box.post_data['content']);
									$edit_box.show();
								}
							});
						}else if( $(this).attr('state') == '2' ){
							$edit_box.hide();
							$(this).attr('state', "0");
						}
					
					})
				)
			);
	}
	var reply_url = $(b_archive).closest("td").prev("td").find("a").attr("href");
	$(b_archive).closest("tr")
		.append($('<td class="fItem">')
			.append($('<a href="javascript: void(0);">&nbsp;</a>')
				.attr('id', "forumMessagesListMessage" + m_id + "QuickQuoteButton")
				.attr('title', "Цитировать пост")
				.attr('class', "cBlueButton icoButton icoQuote")
				.attr('state', "0")
				.click(function(){
					if( $(this).attr('state') == '0' ){
						if( $quote_box.is(":visible") ){
							var button = $("#forumMessagesListMessage" + $quote_box.m_id + "QuickQuoteButton")[0];
							toggleElClass(button, ['icoQuote', 'icoLoading'], 0);
							$quote_box.hide();
							$(button).attr('state', "0");
						}
						toggleElClass(this, ['icoQuote', 'icoLoading'], 1);
						$(this).attr('state', "1");
						var _this = this;
						$.ajax({
							url: reply_url,
							dataType: 'html',
							success: function(data){
								if( $(_this).attr('state') !== '1' ) return true;
								var rg = /[\s\S]*(<form[\s\S]*?<\/form>)[\s\S]*/i;
								$sandbox.empty().html( data.toString().replace(rg, '$1') );
								var form_data = {};
								$("#sandbox").find(":input").each(function(ix, inp){
									if(typeof (key = $(inp).attr("name")) !== 'undefined'){
										form_data[key] = $(inp).val();
									}
								})
								toggleElClass(_this, ['icoQuote', 'icoLoading'], 0);
								$(_this).attr('state', "2");
								$quote_box.detach().appendTo($td=$('#forumMessagesListMessage'+m_id+'Content'))
									.css({top: $td.offset().top, left: $td.offset().left,
											width: $td.width(), height: $td.height()});
								$quote_box.m_id = m_id;
								$quote_box.reply_url = reply_url;
								$quote_box.post_data = $.extend({}, form_data);
								$("#quote_box_content")
									.css({height: $quote_box.height() - 44, width: $quote_box.width() - 20})
									.val($quote_box.post_data['content']);
								$quote_box.show();
							}
						});
					}else if( $(this).attr('state') == '2' ){
						$quote_box.hide();
						$(this).attr('state', "0");
					}
				
				})
			)
		);
});