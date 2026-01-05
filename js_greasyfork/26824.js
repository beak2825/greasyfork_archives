// ==UserScript==
// @name         音乐查询复制歌曲名
// @namespace    https://music.liuli.lol/
// @version      1.0.1
// @description  音乐查询复制歌曲名!
// @author       Abinnz
// @match        https://music.liuli.lol/music/*
// @match        https://music.liuli.lol/xiami/*
// @match        https://music.liuli.lol/kugou/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26824/%E9%9F%B3%E4%B9%90%E6%9F%A5%E8%AF%A2%E5%A4%8D%E5%88%B6%E6%AD%8C%E6%9B%B2%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/26824/%E9%9F%B3%E4%B9%90%E6%9F%A5%E8%AF%A2%E5%A4%8D%E5%88%B6%E6%AD%8C%E6%9B%B2%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $panel = $('.panel-body');
	var $link = $('#dow').next('a');
 	if($panel == undefined){
		return;
	}
	var $name = $panel.find('h2');
	var $singer = $name.next('p');
	var href = window.location.href;
	if($name == undefined || $singer == undefined || $link == undefined){
		return;
	}
	if(href.match(/.+\/(kugou|xiami)\/.+/ig)){
		$singer = $singer.next('p');
	}
	// var songName = $name.text() + ' - ' + $singer.text() + '.mp3';
	var songName = $singer.text() + ' - ' + $name.text() + '.mp3';
	$link.after('<span id="message" style="margin-left:5px;"></span>');
	$link.after('<input type="text" style="position:absolute;top:-99999px;margin-left:5px;" id="songName" value="' + songName + '"/>');
	$link.after('<a class="btn btn-info btn-sm" style="margin-left:5px;" id="btnCopy">复制歌曲名</a>');
	
	$('#btnCopy').on('click',function(){
		var isSuccess;
		$('#songName').focus();
		$('#songName').select();
		isSuccess = document.execCommand('copy');
		if(isSuccess){
			$('#message').text('复制成功！');
		}
		
	});
	
})();

