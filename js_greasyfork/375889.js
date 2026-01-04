// ==UserScript==
// @name         Forza图库图片批量下载
// @namespace    https://space.bilibili.com/68391#!/
// @version      1.0
// @description  批量下载Forza玩家图库的图片
// @author       剧情帝
// @match        https://www.forzamotorsport.net/*/gallery/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant		 GM_addStyle
// @grant		 GM_notification
// @downloadURL https://update.greasyfork.org/scripts/375889/Forza%E5%9B%BE%E5%BA%93%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/375889/Forza%E5%9B%BE%E5%BA%93%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let $photoArr, $photos, $selectModeBtn, $selectAllBtn, $downloadBtn, $resetBtn;
	let selectMode = false, downloading = false;
	let total_selected = 0;
	GM_registerMenuCommand('选择并下载图片', InitSelect);

	function InitSelect(){
		$photos = $("#photos").addClass('select_mode');
		$photoArr = $(".photo", $photos);
		if($photoArr.length === 0){
			alert('请在图片列表加载完毕后重试');
			return;
		}

		selectMode = true;

		GM_addStyle((`
			.photo .media_element {
				display: flex;
			}
			.photos.select_mode .photo .media_element a {
				/*pointer-events: none;*/
			}
			.photo .image {
				position: relative;
			}
			.photo .selectbox{
				display: none;
			}
			.photos.select_mode .photo .selectbox {
				display: flex;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				text-align: center;
				font-size: 20px;
				justify-content: center;
				align-items: center;
				background-color: rgba(0, 0, 0, 0.3);
				color: #fff;
			}
			.photos.select_mode .photo .selectbox:hover{
				background-color: unset;
				font-size: 0;
			}
			.photos.select_mode .photo .selectbox.selected{
				font-size: 0;
				background-color: unset;
				border: 5px solid #00a1d6;
			}
			.photos.select_mode .photo .selectbox.downloading{
				font-size: 20px;
				background-color: rgba(0, 0, 0, 0.3);
				border: 5px solid #ff0;
			}
			.photos.select_mode .photo .selectbox.downloaded{
				font-size: 20px;
				background-color: rgba(0, 0, 0, 0.3);
				border: 5px solid #0f0;
			}
			.photos.select_mode .photo .selectbox.failed{
				font-size: 20px;
				background-color: rgba(0, 0, 0, 0.3);
				border: 5px solid #f00;
			}
			.tool_box{
				position:fixed;
				right: 10px;
				top:40%;
				background-color: #cf4335;
				padding: 10px;
				border-radius: 3px;
				max-width: 100px;
			}
			.tool_box #mode, .tool_box label{
				vertical-align: middle;
			}
			.tool_box input[type="button"]{
				display: block;
				width: 70px;
				margin: 10px auto auto auto;
			}
			.tool_box p{
				width: 100%;
				text-align: center;
				margin-top: 10px;
			}
			`));

		let $toolBox = $(`<div class="tool_box">
				<input id="mode" type="checkbox" checked="checked"><label for="mode">选择模式</label>
				<input id="select_all" type="button" value="选择全部">
				<input id="download" type="button" value="下载">
				<input id="reset" type="button" value="重置" disabled="disabled">
				<p>在选择模式下，直接左键点击图片来选择，中键单击可以在新标签页查看图像</p>
			</div>
			`);
		$selectModeBtn = $("#mode", $toolBox);
		$selectAllBtn = $("#select_all", $toolBox);
		$downloadBtn = $("#download", $toolBox);
		$resetBtn = $("#reset", $toolBox);
		$("body").append($toolBox);

		$photoArr.each((index, photo)=>{
			let $photo = $(photo);
			let $select = $('<div class="selectbox">未选择</div>');
			$("a", $photo).click(()=>{
				return !selectMode; //图片选择模式下阻止点击图片的默认行为
			});
			$select.click( SelectPic);
			$('.image', $photo).append($select);
		});

		//“选择模式”按钮功能
		$selectModeBtn.change(()=>{
			selectMode = !selectMode;
			if(selectMode){
				$photos.addClass('select_mode');
				$selectAllBtn.prop('disabled', false);
				$downloadBtn.prop('disabled', false);
			}
			else{
				$photos.removeClass('select_mode');
				$selectAllBtn.prop('disabled', true);
				$downloadBtn.prop('disabled', true);
			}
		});

		//全选按钮功能
		$selectAllBtn.click(()=>{
			if($selectAllBtn.val() === '选择全部'){
				$(".selectbox", $photoArr).addClass('selected');
				total_selected = $photoArr.length;
			}
			else if($selectAllBtn.val() === '取消全选'){
				$(".selectbox", $photoArr).removeClass('selected');
				total_selected = 0;
			}
			AlterSelectAllButton();
		});

		//下载按钮功能
		$downloadBtn.click(DownloadImgs);

		//重置按钮功能
		$resetBtn.click(()=>{
			downloading = false;
			$selectModeBtn.prop('disabled', false);
			$selectAllBtn.prop('disabled', false).val('选择全部');
			$downloadBtn.prop('disabled', false);
			$resetBtn.prop('disabled', true);
			total_selected = 0;
			$(".selectbox.selected", $photos).removeClass('selected downloading downloaded failed').text('未选择');
		});
	}

	function SelectPic() {
		if(downloading)
			return;

		let $selectBox = $(this);
		// $selectBox.toggleClass('selected');
		if(!$selectBox.hasClass('selected')){
			$selectBox.addClass('selected');
			total_selected++;
		}
		else{
			$selectBox.removeClass('selected');
			total_selected--;
		}
		AlterSelectAllButton();
	}

	function AlterSelectAllButton() {
		$selectAllBtn.val( (total_selected === $photoArr.length) ? '取消全选' : '选择全部' );
	}

	function DownloadImgs() {
		if(total_selected === 0){
			alert('您没有选中任何图片！');
			return;
		}

		let choose = confirm(`注意：请不要在浏览器下载设置中选中 “下载前询问每个文件的保存位置” !!!否则会弹出多个对话框。\n\n已选中 ${total_selected} 张图片，点击“是”开始下载`);
		if(choose === false)
			return;

		$selectModeBtn.prop('disabled', true);
		$selectAllBtn.prop('disabled', true);
		$downloadBtn.prop('disabled', true);
		downloading = true;

		let index = 0;
		let $selectedBoxs = $(".selectbox.selected", $photos);
		let total_downloaded = 0, total_failed = 0;
		DownloadImg( index);

		//递归下载
		function DownloadImg( index) {
			if(index >= total_selected){
				//下载全部结束
				GM_notification( (total_downloaded === total_selected) ? '所有图片下载成功！' : `下载结束，成功下载${total_downloaded}张图片，${total_failed}张失败` );
				console.log( (total_downloaded === total_selected) ? '所有图片下载成功！' : `下载结束，成功下载${total_downloaded}张图片，${total_failed}张失败` );
				$resetBtn.prop('disabled', false);
				return;
			}

			let $selectedBox = $selectedBoxs.eq(index);
			let $img = $selectedBox.prev('img');
			let imgSrc = $img.attr('src').replace('/thumbnail', '');
			let imgName = `${$img.attr('title')} ${imgSrc.split('/').pop()}.jpg`;
			console.log(`第${index+1}张图片${imgName}开始下载`);
			$selectedBox.addClass('downloading').text('正在下载');
			GM_download({
				url: imgSrc,
				name: imgName,
				onload: () => {
					console.info(`第${index+1}张图片${imgName}下载成功`);
					$selectedBox.removeClass('downloading').addClass('downloaded').text('下载完成');
					total_downloaded++;
					setTimeout(() => {
						DownloadImg(index + 1);
					}, 3000);
				},
				onerror: () => {
					console.error(`第${index+1}张图片${imgName}下载失败`);
					$selectedBox.removeClass('downloading').addClass('failed').text('下载失败');
					total_failed++;
					setTimeout(() => {
						DownloadImg(index + 1);
					}, 3000);
				},
				ontimeout: () => {
					console.error(`第${index+1}张图片${imgName}下载超时`);
					$selectedBox.removeClass('downloading').addClass('failed').text('下载超时');
					total_failed++;
					setTimeout(() => {
						DownloadImg(index + 1);
					}, 3000);
				}
			});
		}
	}

})();