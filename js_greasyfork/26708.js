// ==UserScript==
// @name 		播片源
// @namespace 		play
// @version 		0.0.17
// @author 		bengben
// @description 	自动播放片源网资源


// @include     http*://pianyuan.net/*

// @include     http*://pan.baidu.com/disk/home*
// @require 	https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/26708/%E6%92%AD%E7%89%87%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/26708/%E6%92%AD%E7%89%87%E6%BA%90.meta.js
// ==/UserScript==

var url_baiduyun = 'https://pan.baidu.com/disk/home';
var magnet = null;

//首页

$.each($('table').find('.firstr,.odd,.even'),function(i,n){

	//增加th表头
	if(i===0){
		$(this).append('<th class="lasttd nobr center">操作</th>');
	}else{
		$(this).append('<th class="lasttd nobr center" aria-label="Left Align"><button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#playModal"><span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span>&nbsp;&nbsp;播放</button></th>');
	}
});


// 详情页面
magnet = $('.tdown').find('a').eq(1).attr('href');
console.log('>>>>>>>>>magnet>>>>>>>>',magnet);
$('.tdown').append('<a href=":;" id="playBtn" class="btn btn-info btn-sm " aria-label="Left Align"><span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span>播放</a>');
$('#playBtn').click(function(){
	console.log(url_baiduyun);
	window.open(url_baiduyun);
});


//baiduyun
// $('a[data-button-id="b13"]').click(function(){
// 	$('#_disk_id_2').click(function(){
// 		$('#share-offline-link').val(magnet);
// 	})
// });
// 
setTimeout(function(){
	$('a[data-button-id="b13"]').trigger("click");
},5000);





//播放modal
// var playModalHTML = ' <div class="modal fade" id="playModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
//   <div class="modal-dialog" role="document">
//     <div class="modal-content">
//       <div class="modal-header">
//         <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//         <h4 class="modal-title" id="myModalLabel">Modal title</h4>
//       </div>
//       <div class="modal-body">
//         ...
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
//         <button type="button" class="btn btn-primary">Save changes</button>
//       </div>
//     </div>
//   </div>
// </div>'
