// ==UserScript==
// @name 		播片源
// @namespace 		play
// @version 		0.0.37
// @author 		bengben
// @description 	自动播放片源网资源


// @include     http*://pianyuan.net/*
// @include     http*://pan.baidu.com/disk/home*
// @require 	https://code.jquery.com/jquery-2.1.4.min.js

// @grant 		GM_getValue
// @grant 		GM_setValue
// @grant 		GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/26777/%E6%92%AD%E7%89%87%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/26777/%E6%92%AD%E7%89%87%E6%BA%90.meta.js
// ==/UserScript==

// test script
// GM_setValue('GMTest1','hello kitty');
// alert(GM_getValue('GMTest1'));


//https://code.jquery.com/jquery-2.1.4.min.js
var url_baiduyun = 'https://pan.baidu.com/disk/home';

//首页

$.each($('table').find('.firstr,.odd,.even'),function(i,n){
	//增加th表头
	if(i===0){
		$(this).append('<th class="lasttd nobr center">操作</th>');
	}else{
		$(this).append('<th class="lasttd nobr center" aria-label="Left Align"><button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#playModal"><span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span>&nbsp;&nbsp;播放</button></th>');
	}
});

$('.tdown').append('<a href=":;" id="playBtn" class="btn btn-info btn-sm " aria-label="Left Align"><span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span>播放</a>');
magnet = $('.tdown').find('a').eq(1).attr('href');
$('#playBtn').click(function(){
	window.open(url_baiduyun);
});

// 详情页面
var magnet = GM_getValue('magnet');
console.log('magnet>>>>>>>',magnet);
console.log('magnet undefined1',magnet==undefined);
console.log('magnet undefined2',magnet=='undefined');

if(magnet=='undefined' || magnet == ''){
	GM_setValue('magnet', magnet);
}else{
	// if(null===magnet){
	document.querySelector('.g-button[data-button-id=b13]').click();
		setTimeout(function() {
			document.querySelector('#_disk_id_2').click();
			setTimeout(function() {
			  document.querySelector('#share-offline-link').value = magnet;
			  document.querySelector('.g-button[data-button-id=b65]').click();
			  GM_setValue('magnet', 'undefined');
			}, 1000);
		}, 3000);
	// }

}






