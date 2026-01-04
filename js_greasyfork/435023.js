// ==UserScript==
// @name        能看查看到贴吧用户的高清图像 
// @author      有一份田,Sonico俺の嫁,YIU
// @description 该插件脚本能够看到贴吧用户上传的清楚图像
// @namespace   TieBaHDAvatar-youyifentian
// @icon        https://portrait.gitee.com/uploads/avatars/user/4/12217_youyifentian_1578914827.jpg!avatar200
// @license     GPL version 3
// @encoding    utf-8
// @date        09/12/2013
// @change      09/13/2020
// @include     *://tieba.baidu.com/p/*
// @include     *://tieba.baidu.com/f*
// @include     *://tieba.baidu.com/home/*
// @include     *://dq.tieba.com/p/*
// @include     *://jump2.bdimg.com/*
// @grant       unsafeWindow
// @run-at      document-end
// @version     1.0.8
// @downloadURL https://update.greasyfork.org/scripts/435023/%E8%83%BD%E7%9C%8B%E6%9F%A5%E7%9C%8B%E5%88%B0%E8%B4%B4%E5%90%A7%E7%94%A8%E6%88%B7%E7%9A%84%E9%AB%98%E6%B8%85%E5%9B%BE%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/435023/%E8%83%BD%E7%9C%8B%E6%9F%A5%E7%9C%8B%E5%88%B0%E8%B4%B4%E5%90%A7%E7%94%A8%E6%88%B7%E7%9A%84%E9%AB%98%E6%B8%85%E5%9B%BE%E5%83%8F.meta.js
// ==/UserScript==
 
 
 
/*
 * === 说明 ===
 *@作者:有一份田,Sonico俺の嫁,YIU
 *@官网:http://www.duoluohua.com/download/
 *@Email:youyifentian@gmail.com
 *@Git:http://git.oschina.net/youyifentian
 *@转载重用请保留此信息
 *
 *
 * */
 
 
(function(){
	var $ = unsafeWindow.$;
 
	var portraitCache = {};
	var addCss = `<style>
.nav2{ float: left; }
.nav2 ul > li:hover ul{
visibility: visible;
opacity: 1;
filter: alpha(opacity=100);
}
.nav2 li ul{
position: absolute;
left: 0;
z-index: 1;
visibility: hidden;
opacity: 0;
filter: alpha(opacity=0);
-webkit-transition: 200ms ease;
-moz-transition: 200ms ease;
-o-transition: 200ms ease;
transition: 200ms ease;
}
</style>`;
 
	$('head').append(addCss);
 
	//Remove modal style interference
	$('style:contains(".dialogJmodal")').remove();
 
	$('body').bind('DOMNodeInserted',function(e){
		var o = $(e.target).find('.interaction_wrap');
		if(o.length){
			createEleBtn(o);
		}
	});
 
	function createEleBtn(o){
		var tmpnav = $('<nav><ul><li>');
		var tmpul = $('<ul>');
		var tmpli = $('<li>');
		var tmpa = $('<a>').addClass("btn-encourage btn-small  user-visit-card-marriage-propose").html('\u9ad8\u6e05\u5934\u50cf');
 
		tmpnav.find('li').prepend(tmpa.clone());
		tmpli.append(tmpa);
 
		for(var i=1;i<3;i++)
		{
			var multiple = i;
			tmpli.find('a').html(`\u9ad8\u6e05x${++multiple}\u500d`);
 
			var ctmpli = tmpli.clone();
 
			ctmpli.click(function(){
				var uname = o.parents('.ui_card_content').find('a.userinfo_username').text();
				var uimgurl = $("#user_visit_card .interaction_wrap").parents('.ui_card_content').find('.j_avatar img')[0].src;
				var hexUID = getHexUid(o.parents('.ui_card_content').find(".interaction_wrap a[target='sixin']")[0].href.match(/\d+$/g));
 
				multiple = $(this).index();
				showHighAvatar(uname, hexUID, uimgurl, ++multiple);
			});
			tmpul.append(ctmpli);
		}
 
		tmpnav.find('li').append(tmpul);
		tmpnav.addClass('nav2');
 
		o.prepend(tmpnav);
	}
 
	function getHexUid(uid){
		var hexuid = FormatHex(parseInt(uid).toString(16));
		var reg = /[a-z\d]{2}/g;
		return hexuid.match(reg).reverse().toString().replace(/,/g,'');
	}
	function FormatHex( hex ){
		var zero = "00000000";
		var tmp = 8 - hex.length;
		return zero.substr(0, tmp) + hex;
	}
 
	function showHighAvatar(uname, hexuid, uimgurl, multiple){
 
		var hdImgMul = function(){
			return multiple<2 ? 'l' : 'h';
		}
 
		var hdImgUrl = function(){
			if(uimgurl.indexOf('portrait/') > 0)
			{
				return uimgurl.replace('portrait/',`portrait${hdImgMul()}/`);
			}
			else if(uimgurl.indexOf('hiphotos.') > 0 || uimgurl.indexOf('sign=') > 0)
			{
				return "http://imgsrc.baidu.com/forum/pic/item/" + uimgurl.substring(uimgurl.lastIndexOf('/') + 1);
			}
			else
			{
				return `https://gss0.baidu.com/7Ls0a8Sm2Q5IlBGlnYG/sys/portrait${hdImgMul()}/item/${hexuid}`;
			}
 
		},
			modal = new $.modal({show: true}),
			box = $('<div>').css({
				"left":"50%",
				"top":"50%",
				"position":"fixed",
				"min-height":"240px",
				"min-width":"240px",
				"z-index":$.getzIndex()
			}).appendTo("body"),
			dialogClose = function(){
				modal.remove();
				box.remove();
			},
			loadingImg = $('<img src="https://tb2.bdstatic.com/tb/static-ihome/img/loading.gif"/>').css({
				"height":"32px",
				"width":"32px",
				"margin-left":"-16px",
				"margin-top":"-16px"
			}).appendTo(box),
			loadImg = function(){
				var imgurl = hdImgUrl(),
					img = new Image();
				img.src = imgurl;
				img.onload = function(){
					var h = img.height,w = img.width;
					loadingImg.remove();
					$(img).css({
						"height":h+"px",
						"width":w+"px",
						"margin-left":"-"+w/2+"px",
						"margin-top":"-"+h/2+"px",
						"border-radius":"3px",
						"box-shadow":"0 0 15px rgba(127, 173, 220, 0.8), 0 0 15px #7FADDC inset",
						"cursor":"url(\"https://tb2.bdstatic.com/tb/img/frs/cur_zout.cur\"), pointer"
					}).attr('title',uname).appendTo(box);
				};
			};
 
		loadImg();
		box.click(dialogClose);
		modal.element.click(dialogClose);
	}
 
})();