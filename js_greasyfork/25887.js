// ==UserScript==
// @name        GA feed & notifies
// @namespace   glav.su
// @description Быстрый доступ к ленте и уведомлениям без перехода на отдельную страницу. 
// @include     http://glav.su/*
// @include     https://glav.su/*
// @version     2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25887/GA%20feed%20%20notifies.user.js
// @updateURL https://update.greasyfork.org/scripts/25887/GA%20feed%20%20notifies.meta.js
// ==/UserScript==
//var bcapts = {feed: 'лента', notifies: 'уведомления', pm: 'сообщения'}, 
var bcapts = {feed: '', notifies: ''}, 
//	lUserPanel = '#lUserPanel',
	lUserPanel = '.l-up-f',
	$btn = {}, box_width = '1100px', box_height = '500px';
//HTML box	
$(".lUserPanelFloat").css({'z-index': "90"});
var $nfm_box = $('<div id="nfm_box">')
		.css({ 'border': "1px solid #aaa", 'border-radius': "5px", 'width': box_width, 'height': box_height,
			'background-color': "#ccc", 'position': "absolute", 'box-shadow': "3px 3px 10px #444",
			'overflow': "hidden", 'resize': "both", 'display': "none", })
		.append($('<div id="nfm_header">')
			.css({ 'text-align': "right", 'padding': "2px", 'height': "22px", 
				'background-color': "#0055e5", 'margin': "3px",	'border-radius': "3px 3px 0 0", })
			.append($('<a href="javascript:void(0);" id="nfm_close" title="Закрыть">&times;</a>')
				.css({ 'width': "22px", 'height': "20px", 'border-radius': "3px", 'background-color': "transparent",
					'text-align': "center", 'font-size': "24px", 'font-weight': "bold", 'text-decoration': "none", 
					'color': "#fff",  'display': "block", 'float': "right", 'padding-top': "2px", })
				.hover(function(){
						$(this).css({'background-color': "#e00"});
					}, function(){
						$(this).css({'background-color': "transparent"});
				})
				.click(function(){
					box_close();
				})
			)
			.append($('<span id="nfm_title">')
				.css({ 'display': "block", 'width': "100%", 'text-align': "center", })
			)
		)
		.append($nfm_scroller = $('<div id="nfm_scroller">')
			.css({ 'overflow-y': "scroll", 'position': "absolute", 'bottom': "16px", 'top': "32px", 'right': "3px", 
				'left': "3px", 'background-color': "#fff", 'border': "1px solid #bbb", })
			.scroll(function(){
				//$(lUserPanel+" div[id$=ViewContainer]:visible").hide();
			})
			.append($nfm_content = $('<div id="nfm_content">')
				.css({ 'color': "#000", 'height': "auto", 'padding': "10px", 'display': "block", })
			)
		)
		.appendTo( $(lUserPanel) );
var $sandbox = ((s=$("#sandbox")).length == 1)? 
		s : $('<div id="sandbox" style="display: none;">').appendTo( $(document.body) );//песочница
// Обновление кнопок "лента", "уведомление", "сообщение"	
function updateButton(bt, count){
	//var bc = ['redButton', 'blueButton'], sw = +(count > 0);
	var bc = ['c-b-r', 'c-b-b'], sw = +(count > 0);
	$btn[bt].removeClass(bc[sw]).addClass(bc[+(!sw)]).html( bcapts[bt] + (sw? '<span>' + count + '</span>' : '') );
}

function box_close(){
	//$(lUserPanel+" div[id$=ViewContainer]").remove();
	$nfm_box.hide();
}
// Ф-ии ajax-обновления
var update = {
// Лента
	feed: function(){
		$.getJSON(APP_URL + '/user/ajax/feedgrid/?isUnread=1&offset=0&limit=100&sortField=0&sortDir=0',
			function(result){
				$nfm_content.empty().html(result.body);
				$nfm_content.find("#gridTop").next("div")
					.empty()
					.css({'margin-bottom': "10px"})
					.append(
						$('<span class="cBlueButton">отметить все как прочитанное</span>')
							.click(function(){
								$.getJSON(APP_URL + '/user/ajax/feedmarkasread/',
									function(res){
										update.feed();
								});
							})
					);
				$nfm_content.find("#gridBottom").prev("div").empty();
				$("#nfm_content table.blueHeader.flex").css({'background-color': "#fff"});
				$("#nfm_content table.blueHeader.flex td")
					.css({ 'color': "#128", 'font-weight': "bold", 'padding': "0 10px", });
				$("#nfm_content table.blueHeader.flex a")
					.css({ 'color': "#128", 'text-decoration': "underline", 'font-weight': "bold", });
				if(result.total > 0){
					$("#nfm_content .frameBlock").hide();
				}
				$("#nfm_content .forumMessagesListMessageBody").hide();
				$("#nfm_content .fItem.forumMessagesListMessageVoteSwitch").closest("table").hide();
				$("#nfm_content .forumMessagesListMessage").each(function(mx, msg){
					var m_id = $(msg).attr("id").replace(/forumMessagesListMessage(\d+)/, "$1");
					if( window.myFollows ){
						window.myFollows.add_button(msg);
					}
					var $sh_button = $('<span class="cBlueButton" style="width: 60px; text-align: center;" m_id="'+m_id+'">Показать</span>')
							.click(function(){
								$(msg).closest("table").prev("div").toggle();
								var isVisible = $(msg).find(".forumMessagesListMessageBody").toggle().is(":visible");
								$(msg).find(".fItem.forumMessagesListMessageVoteSwitch").closest("table").toggle();
								$(this).html( ['Показать', 'Скрыть'][+isVisible] );
							});
					$(msg).find(".forumMessagesListMessageButtons table.cButtonsPanel").before($sh_button);
				});
				updateButton("feed", result.total);
				init_func();
			}
		);
	},
// Уведомления
	notifies: function(){
		$.getJSON(APP_URL + '/user/ajax/notifiesinboxgrid/?offset=0&limit=100&sortField=1&sortDir=0',
			function(result){
				$nfm_content.empty().html(result.body);
				$("#nfm_content td.vaTop.taRight").parent().each(function(trx, tr){
					$(tr).after( 
						$('<tr>').append( $mtd = $('<td class="vaTop" colspan="3">') ) 
					);
					$(tr).find("div[id$=ViewContainer]").detach().appendTo($mtd);
					$(tr).find(".userNotifiesInboxGridNotifyViewButton").closest("table")
						.detach()
						.appendTo( $(tr).find("td.vaTop.taRight") );
				});
				$("#nfm_content .userNotifiesInboxGridNotifyViewButton")
					.css({ width: "60px" })
					.html("Показать")
					.click(function(){
						var n_id = $(this).attr("id").replace(/userNotifiesInboxGridNotify(\d*?)ViewButton/, "$1"),
							$m_box = $("#userNotifiesInboxGridNotify" + n_id + "ViewContainer");
						if( $m_box.is(":visible") == true ){
							$m_box.hide();
							$(this).html("Показать");
							return;
						}
						$m_box.slideDown(200);
						$(this).html("Скрыть");
					}
				);
				$("#nfm_content .userNotifiesInboxGridNotifyMarkAsReadButton").hide().click(function(){
					var n_id = $(this).attr("id").replace(/userNotifiesInboxGridNotify(\d*?)MarkAsReadButton/, "$1");
					$.getJSON(APP_URL + '/user/ajax/markasreadnotify/?notifyId=' + n_id,
						function(res){
							update.notifies();
					});
				});
				$("#nfm_content .userNotifiesInboxGridNotifyDeleteButton").click(function(){
					var n_id = $(this).attr("id").replace(/userNotifiesInboxGridNotify(\d*?)DeleteButton/, "$1");
					$.getJSON(APP_URL + '/user/ajax/deletenotify/?notifyId=' + n_id,
						function(res){
							update.notifies();
					});
				});
				updateButton("notifies", result.total);
				init_func();
			}
		);
	},
// Cообщения
	pm: function(){
	//
	},
};
// Главный цикл - модификация кнопок в панели.
$(document).ready(function(){
    console.log('GA feed & notifies. Started.');
    $.each(bcapts, function(bname, bcaption){
    	$btn[bname] = $(lUserPanel+' a[href*="glav.su/user/'+bname+'/"]')
    		.attr("bhref", APP_URL+'/user/'+bname+'/')
    		.attr("btag", bname)
    		.attr("bcapt", bcaption)
    		.attr("href", 'javascript: void(0);')
    		.click(function(){
    			var btag = $(this).attr("btag");
    			if($nfm_box.is(":visible") == true){
    				box_close();
    				if( $nfm_box.bname == btag ){
    					return;
    				}
    			}
    			$("#nfm_title").empty().append(
    				$('<a href="'+APP_URL+'/user/'+bname+'/" style="color: #fff;" target="blank">'+bname+'</a>')
    					.mouseup(function(){
    						box_close();
    					})
    			);
    			$nfm_box.bname = btag;
    			$nfm_content.empty();
    			update[btag]();
    			$nfm_box.css({left: 400}).slideDown(200);
    		});
    });
});
// Недостающие функции работы с сообщениями на главной странице (спойлер, карма)
var init_func = function(){return}; // пустышка для остальных страниц.
if( location.href === APP_URL+'/forum/' ){
	// HTML форма для показа результатов голосования по карме
	var $vote_box = $('<div id="vote_box">')
			.css({ 'border': "1px solid #aaa", 'border-radius': "5px", 'width': '450px', 
				'height': '250px', 'background-color': "#fff", 'position': "absolute", 
				'box-shadow': "3px 3px 10px #555", 'overflow': "hidden", 'display': "none", })
			.append($('<div id="vote_header">')
				.css({ 'text-align': "right", 'padding': "2px", 'height': "20px", 'background-color': "#aaa", 
					'margin': "3px", 'border-radius': "3px 3px 0 0", })
				.append($vote_close = $('<a href="javascript:void(0);" id="vote_close" title="Закрыть">&times;</a>')
					.css({ 'width': "20px", 'height': "20px", 'border-radius': "3px", 
						'background-color': "transparent", 'text-align': "center", 
						'font-size': "20px", 'font-weight': "bold", 'text-decoration': "none", 
						'color': "#fff", 'display': "block", 'float': "right", })
				)
				.append($('<span id="vote_title">Экспертное голосование</span>')
					.css({ 'display': "block", 'width': "100%", 'text-align': "left", 'font-weight': "bold", })
				)
			)
			.append($('<div id="vote_scroller">')
				.css({ 'overflow-y': "auto", 'position': "absolute", 'bottom': "5px", 'top': "30px", 
					'right': "3px", 'left': "3px", 'background-color': "#fff", })
				.append($vote_content = $('<div id="vote_content">')
					.css({ 'color': "#000", 'height': "auto", 'padding': "5px", 'display': "block", })
				)
			)
			.appendTo( $(lUserPanel) );
	// Прибитие к кнопкам недостающих функций
	init_func = function(){
		// спойлер
		$(".cBlockSpoilerHeaderOff").click(function(){
			var bc = ['cBlockSpoilerHeaderOn', 'cBlockSpoilerHeaderOff'],
				isVisible = +( $(this).next("div").toggle().is(":visible") );
			$(this).removeClass(bc[isVisible]).addClass(bc[+(!isVisible)]);
		});
		// карма
		$("span[class^=forumMessagesListMessageVote]").click(function(){
			var match = $(this).attr("id").match(/forumMessagesListMessage(\d+)Vote(.+?)Button/),
				m_id = match[1], _this = this;
			if( match[2] === 'Info' ){
				$.get(APP_URL + '/forum/ajax/loadmessagevotehistory/', {
						messageId: m_id,
					}, function (res) {
						$vote_box.hide().detach();
						$vote_content.empty().html( (res.status)? res.info : 'Произошла ошибка при загрузке данных!' );
						$vote_box.appendTo($tb=$(_this).closest("table"))
							.css({ top: $tb.offset().top - window.scrollY + $nfm_scroller.scrollTop() - 317 })
							.show();
					}, 'json');
			}else{
				var sign = ({Positive: '+', Negative: '-'})[match[2]];
				$.post(APP_URL + '/forum/ajax/votemessage/', {
						messageId: m_id,
						sign: sign,
						csrftoken: CSRF_TOKEN,
					}, function (res) {
						if (res.status) {
							$('#forumMessagesListMessage'+m_id+'VoteNegativeButton').hide();
							$('#forumMessagesListMessage'+m_id+'VotePositiveButton').hide();
							$('#forumMessagesListMessage'+m_id+'VoteInfoButton').html(res.rating + ' / ' + res.votes);
						}
					}, 'json');
			}
			
		});
		$vote_close
			.hover(
				function(){ $(this).css({'background-color': "#e00"}); }, 
				function(){ $(this).css({'background-color': "transparent"}); }
			)
			.click(function(){
				$vote_box.hide();
			})
	};
}