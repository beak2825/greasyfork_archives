// ==UserScript==
// @name         京东到家商家运营 - 活动页优化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        http://*.jddj.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388254/%E4%BA%AC%E4%B8%9C%E5%88%B0%E5%AE%B6%E5%95%86%E5%AE%B6%E8%BF%90%E8%90%A5%20-%20%E6%B4%BB%E5%8A%A8%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/388254/%E4%BA%AC%E4%B8%9C%E5%88%B0%E5%AE%B6%E5%95%86%E5%AE%B6%E8%BF%90%E8%90%A5%20-%20%E6%B4%BB%E5%8A%A8%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
	'use strict';


	// 添加优化配置按钮
	var addBtn1 = '<div style="position: fixed;bottom: 0;right: 0;z-index: 1000">' +
		'<button id="wei_open" class="btn btn-xs btn-info prevActButton">展开模式</button> ' +
		'<button id="wei_close" class="btn btn-xs btn-info prevActButton">收起模式</button>' +
		// '<button id="wei_cutout" class="btn btn-xs btn-info prevActButton">一键抠图(测试版)</button>' +
		'<input id="wei_orgGroup_inp" type="text" style="width: 200px; height: 30px; font-size: 12px; color: rgb(3, 169, 244);margin: 0 10px;border-radius: 5px!important;border: 1px solid #E91E63;" placeholder="设置全部组促销语">' +
		'</div>'
	$('.resTabNav').append(addBtn1);
	$('#wei_open').show();
	$('#wei_close').hide();
	$('#wei_cutout').hide();
	$('#wei_orgGroup_inp').hide();

	// 打开
	$('#wei_open').on('click', function () {
		$('#wei_open').hide();
		$('#wei_close').show();
		$('#wei_cutout').show();
		$('#wei_orgGroup_inp').show();

		// 展开样式
		$($($($('.container-fluid')[1]).children()[0]).children()[1]).css({
			'position': 'fixed',
			'right': '0',
			'top': '0',
			'height': '100%',
			'box-shadow': '0 0 5px #000',
			'background-color': '#fff',
			'z-index': '999',
		});
		$('#resListTab').css({'height': '800px', 'overflow': 'auto'});
		$('.condition-panel').css({'max-height': '800px'});
		// $('.orgRes').css({'max-height': '720px!important'});
		$('.orgBtnGroupNal').children().removeClass('orgRes');
		$('.orgStoreDiv').css({'max-height': 'max-content'});

		// 最后一组增高
		$('.orgGroup').css({'border-bottom': '5px solid #428bca'});
		$('.orgGroup:last-child').css({'margin-bottom': '100px'});

		$('.saveBtnDiv').css({'position': 'absolute', 'bottom': '0', 'z-index': '1000'});

		// 点击第几组自动跳转
		$('.orgGroupNoLabel').css({'cursor': 'pointer'});
		$('.orgGroupNoLabel').each(function (i) {
			$($('.orgGroupNoLabel')[i]).on('click', function () {
				$("#resListTab").animate({scrollTop: $("#resListTab").scrollTop() + $($('.orgGroup')[i]).offset().top - 150}, 0);
			})
		})

		// 组批量修改促销语
		$('.orgGroup').each(function (i) {
			var inp = '<input class="wei_orgGroup_inp" type="text" style="width: 200px; height: 24px; font-size: 12px; color: rgb(3, 169, 244);margin: 0 10px;border-radius: 5px!important;border: 1px solid #E91E63;" placeholder="设置组批量促销语">'
			$(this).find('div:first').append(inp);
		});
		$('.wei_orgGroup_inp').on('change', function (e) {
			$($('.skuIdsInputTr')[$('.wei_orgGroup_inp').index(this)]).find(":input[name='skuDesc']").val(e.target.value)
		});

		// 全局修改促销语
		$('#wei_orgGroup_inp').on('change', function (e) {
			$('.skuIdsInputTr').find(":input[name='skuDesc']").val(e.target.value)
		});

		// 滚动固定
		$('#resListTab').scroll(function() {
			$('.orgGroup').each(function (i) {
				if ($(this).offset().top < (50 + i * 32)) {
					$(this).find('div:first').css({
						'position': 'absolute',
						'top': i * 32,
						'width': '100%',
						'left': '0',
						'padding': '5px 5px 0 5px',
						'border-bottom': '1px solid #c5d0dc',
						'background-color': '#fff',
					})
				} else {
					$(this).find('div:first').css({
						'position': '',
						'top': '',
						'width': '',
						'left': '',
						'padding': '',
						'border-bottom': '',
						'background-color': '',
					})
				}
			})
			$('.cutoutShowBtn').each(function (i) {
				if ($(this).offset().top < (50 + i * 32)) {
					$(this).css({
						'position': 'absolute',
						'top': i * 32,
						'right': '0',
					})
				} else {
					$(this).css({
						'position': '',
						'top': '',
						'right': '',
					})
				}
			})
		});

		// 表格第一列缩小
		$('.orgStoreDiv').find('thead tr th:first').css({'width': '70px'})
		// $('.orgStoreDiv').find('tbody img').css({'width': '40px'})
		// $('.orgStoreDiv').find('tbody tr td:nth-child(2)').css({
		$(":input[name='skuDesc']").css({
			'height': '24px',
			'font-size': '12px',
			'color': '#03A9F4',
		});
		$(":input[name='skuTopDesc']").css({
			'height': '24px',
			'font-size': '12px',
			'color': '#03A9F4',
		});
		$(":input[name='skuName']").css({
			'height': '24px',
			'font-size': '12px',
			'color': '#03A9F4',
		});


		// 添加遮罩
		var mask = '<div id="awei_mask" style="position: fixed;left: 0;top: 0;width: 100%;height: 100vh;background: rgba(0,0,0,.2);z-index: 998;"></div>';
		$($('.container-fluid')[1]).append(mask);

		// 遮罩点击事件 - 关闭遮罩/恢复配置
		$('#awei_mask, #wei_close').on('click', function () {
			$('#wei_open').show();
			$('#wei_close').hide();
			$('#wei_cutout').hide();
			$('#wei_orgGroup_inp').hide();

			$($($($('.container-fluid')[1]).children()[0]).children()[1]).css({
				'position': 'initial',
				'right': '0px',
				'top': '0px',
				'height': 'auto',
				'box-shadow': 'none',
				'background-color': 'rgba(0,0,0,0)',
				'z-index': 'initial',
			});
			$('#awei_mask').remove();
			$('#resListTab').css({'height': '', 'overflow': ''});
			$('.condition-panel').css({'max-height': ''});
			// $('.orgRes').css({'max-height': ''});
			$('.orgBtnGroupNal').children().addClass('orgRes');
			$('.orgStoreDiv').css({'max-height': ''});

			$('.orgGroup').css({'border-bottom': ''});
			$('.orgGroup:last-child').css({'margin-bottom': ''});

			$('.saveBtnDiv').css({'position': '', 'bottom': '', 'z-index': ''});

			// 删除批量促销语
			$('.wei_orgGroup_inp').remove();

		});

	});

	// 抠图
	// var CutoutTime;
	// var Cutout = function (dom, i) {
	// 	setTimeout(() => {
	// 		console.log(dom, i);
	// 		$(dom).click();
	// 		CutoutTime && clearInterval(CutoutTime);
	// 		CutoutTime = setInterval(() => {
	// 			if ($('.cutoutModal').css('display') !== 'none') {
	// 				$('.cutoutModalOk').click();
	// 				console.log(i + 1 + '组已抠图');
	// 				CutoutTime && clearInterval(CutoutTime);
	// 			}
	// 		}, 100)
	// 	}, i * 5000)
	// }
	//
	// $('#wei_cutout').on('click', function () {
	// 	$('.cutoutShowBtn').each(function (i) {
	// 		Cutout(this, i);
	// 	})
	// });

	// 处理拖动宽度resList标签高度变高bug
	var resListInitTime;
	resListInitTime && clearInterval(resListInitTime);
	resListInitTime = setInterval(function () {
		if($('.resList')) {
			$('.resList').css({'height': ''});
		}
	}, 100)

})();
