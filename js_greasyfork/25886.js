// ==UserScript==
// @name        GA follow
// @namespace   glav.su
// @description Быстрое управление подпиской в ленту. Кнопка "Читать/Отписаться" в поле информации об авторах постов.
// @include     http://glav.su/forum/*
// @include     https://glav.su/forum/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25886/GA%20follow.user.js
// @updateURL https://update.greasyfork.org/scripts/25886/GA%20follow.meta.js
// ==/UserScript==
function addStyle(styleText) {
	var style = document.createElement('style');
	if (document.head) {
		document.head.appendChild(style);
		style.innerHTML = styleText;
	}
}
addStyle([
	'.readButton, .unreadButton {',
		'cursor: pointer;',
		'display: inline-block;',
		'height: 20px;',
		'line-height: 20px;',
		'padding: 2px 6px;',
		'white-space: nowrap;',
		'width: 75px;',
		'text-align: center;',
		'border-radius: 5px;',
		'margin: 10px;',
	'}',
	'.readButton {',
		'color: #000;',
		'background-color: #fff;',
		'border: 1px solid #999;',
	'}',
	'.readButton:hover {',
		'background-color: #036;',
		'color: #fff;',
	'}',
	'.unreadButton {',
		'color: #fff;',
		'background-color: #369;',
		'border: 1px solid #036;',
	'}',
	'.unreadButton:hover {',
		'background-color: #900;',
	'}',
].join(''));

var myUID = $(".lUserPanelUserItemProfile").find('a[href^="'+APP_URL+'/members/"]')
		.attr('href').replace(/.*?\/members\/(\d+).*/, '$1');
		
var $sandbox = ( (s=$("#sandbox")).length == 1 )? 
		s : $('<div id="sandbox" style="display: none;">').appendTo( $(document.body) );//песочница
		
window.myFollows = ({
		list: {},
		update: function(callback){
			var _this = this;
			$.ajax({
				url: APP_URL + '/members/' + myUID + '/follows/',
				dataType: 'html',
				success: function(data){
					var dt = data.toString().replace(/[\n\r]/mg, '');
					$sandbox.empty()
						.html( dt.replace(/^.*(<div id="jsUF">.*?<\/table>\s*?<\/div>).*$/, '$1') );
					$sandbox.find('a').each(function(ax, a){
						_this.list[$(a).attr('href').replace(/.*?\/members\/(\d+).*/, '$1')] = 
							{ name: $(a).text(), };
					});
					$sandbox.empty();
					if( typeof callback == 'function' ){
						callback();
					}
				}
			});
			return this;
		},
		add_button: function(msg){
			var userUID = (nm_a = $(msg).find("td.fItem.forumMessagesListMessageAuthorName a")).length > 0 ?
					$(nm_a).attr('href').replace(/.*?\/members\/(\d+).*/, '$1') : '';
			if( userUID == myUID || userUID == ''){
				return true;
			}
			var messID = $(msg).attr("id").replace(/forumMessagesListMessage(\d+)/, "$1");
			var ifollow = +(typeof this.list[userUID] !== 'undefined');
			$(msg).find("td#forumMessagesListMessage" + messID + "AuthorInfo div.cBlock")
				.after($('<span class="' + ['readButton', 'unreadButton'][ifollow] + '" fw="' + ifollow + '">')
					.html( ['Читать', 'Читаю'][ifollow] )
					.hover(function(){
							$(this).html(['Читать', 'Отменить'][+($(this).attr('fw') == "1")]);
						},
						function(){
							$(this).html(['Читать', 'Читаю'][+($(this).attr('fw') == "1")]);
					})
					.click(function(){
						var _this = this;
						$.get(APP_URL + '/user/ajax/followmember/', {
								memberId: userUID,
							}, function (res) {
								if( res.status == 1 ){
									var fw = +(res.follower !== null);
									$(_this)
										.html( ['Читать', 'Читаю'][fw] )
										.attr( 'class', ['readButton', 'unreadButton'][fw] )
										.attr( 'fw', fw );
									if( fw == 0 ){
										delete window.myFollows.list[userUID];
									}else if( typeof window.myFollows.list[userUID] == 'undefined' ){
										window.myFollows.list[userUID] = res.follower;
									}
								}
							}, 'json');
					})
				);
		},
	}).update(function(){
		$("#forumMessagesList .forumMessagesListMessage").each(function(midx, msg){
			window.myFollows.add_button(msg);		
		});
	});
