// ==UserScript==
// @name         百度首页精简
// @version      1.01
// @description  百度首页精简，去无关组件
// @match        https://www.baidu.com/
// @grant        none
// @author       sunforbeeing
// @namespace https://greasyfork.org/users/20689
// @downloadURL https://update.greasyfork.org/scripts/40263/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/40263/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {	
  'use strict';
  $('.mnav,.s_bri').remove();//右上角
  $('#u_sp').css('right', '20px');//右上角  
  $('#s_mp area').removeAttr('href');//禁止logo跳转
  $('.s-mine-split').css('height', 'auto');//导航显示
  $('.s-bottom-ctner').css({'position':'static','padding-bottom':'30px'});//底部移动
  $('.s-menu-container').remove();//移除我的关注
  $("[id*='_feed']").remove();//移除右侧提示
 /*
  var CopyText = new String();  
  $('#form').after('<div class="jmp">Text</div>');
	$('.jmp').click(function() {
			window.open( CopyText + $('#kw').val());
		});  
  
  CopyText = "https://tieba.baidu.com/f?fr=wwwt&kw=";
  $('.bdjb').text("贴吧");
 */

  
})();