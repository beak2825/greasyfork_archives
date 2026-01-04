// ==UserScript==
// @name         Custom emoji for scboy.cc
// @namespace    http://tampermonkey.net/
// @version      1.44
// @description  Add custom external emoji to comments
// @author       tianyi
// @include      https://www.scboy.cc/*
// @downloadURL https://update.greasyfork.org/scripts/388081/Custom%20emoji%20for%20scboycc.user.js
// @updateURL https://update.greasyfork.org/scripts/388081/Custom%20emoji%20for%20scboycc.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let ueDocument;

	let styles = `
	<style>
	.custom-images-picker {
		padding: 0 10px;
	}
	.custom-images-picker ul {
		padding: 0;
		margin: 0;
	}
	.custom-images-picker ul li {
		display: inline-block;
		margin-right: 5px;
		cursor: pointer;
		width: 50px;
		height: 50px;
		background-size: 50px 50px;
	}

	#edui116_body {
		position: fixed;
		top: 0;
	}

	#edui116_body .edui-dialog-foot {
		position: relative;
		display: inline-block;
		height: auto;
	}

	#edui116_body .edui-dialog-foot #edui116_buttons {
		position: relative;
		float: right;
		padding-bottom: 10px;
	}
	</style>`;

	let urlData = [
		{
			name: '无语',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505554696.png'
		},
		{
			name: '怒了',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505426854.png'
		},
		{
			name: '柯南',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505579132.png'
		},
		{
			name: '应援',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505664684.png'
		},
		{
			name: '小智',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505945565.png'
		},
		{
			name: '前排',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505813493.png'
		},
		{
			name: '吃包',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505271198.png'
		},
		{
			name: '问号',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505132748.png'
		},
		{
			name: '月亮',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505541900.png'
		},
		{
			name: '可以',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505384449.png'
		},
		{
			name: '掀桌',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505979386.png'
		},
		{
			name: '爱心',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505656131.png'
		},
		{
			name: '药丸',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505318635.png'
		},
		{
			name: '滑稽',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505899430.png'
		},
		{
			name: '哈哈',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505907695.png'
		},
		{
			name: '阴阳',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505234646.png'
		},
		{
			name: '捂脸',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505788848.png'
		},
		{
			name: '心心',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505890454.png'
		},
		{
			name: '捏脸',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505409521.png'
		},
		{
			name: 'GJ',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505900748.png'
		},
		{
			name: '吃瓜',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505202912.png'
		},
		{
			name: '害羞',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505310306.png'
		},
		{
			name: '嘲讽',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505144935.png'
		},
		{
			name: '柠檬',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505575841.png'
		},
		{
			name: '庆祝',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505243673.png'
		},
		{
			name: '！？',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505883169.png'
		},
		{
			name: '啊这',
			url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357505282477.png'
		}
	];

	let urlData2 = [
	{
		name: 'AWSL',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810287499.png'
	},
	{
		name: '吹爆',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810624823.png'
	},
	{
		name: '打卡',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810436348.png'
	},
	{
		name: '酸了',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810729832.png'
	},
	{
		name: '可以',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810138658.png'
	},
	{
		name: '我全都要',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810137094.png'
	},
	{
		name: '真香',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810767904.png'
	},
	{
		name: '不愧是你',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357809852596.png'
	},
	{
		name: '妙',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357809599929.png'
	},
	{
		name: '秀',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810648699.png'
	},
	{
		name: '拳头',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810135197.png'
	},
	{
		name: '镇站之宝',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810534915.png'
	},
	{
		name: '我太难了',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810361983.png'
	},
	{
		name: '知识盲区',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810190919.png'
	},
	{
		name: '下次一定',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810808254.png'
	},
	{
		name: '知识增加',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810602829.png'
	},
	{
		name: '？？？',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810556814.png'
	},
	{
		name: '危',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357809542512.png'
	},
	{
		name: '泪目',
		url: 'https://www.scboy.cc/upload/attach/202009/9102_1600357810791815.png'
	},
	{
		name: '乌龟打枪',
		url: 'https://www.scboy.cc/upload/attach/202205/9102_1652672238552816.png'
	},
	{
		name: '扫描',
		url: 'https://www.scboy.cc/upload/attach/202205/9102_1652777261509728.png'
	},
	{
		name: '向日葵',
		url: 'https://www.scboy.cc/upload/attach/202212/9102_1672244120975968.gif'
	}
	];

	$(styles).appendTo($('head'));

	$('#edui120_body').click(function() {
		setTimeout(function() {
			ueDocument = document.getElementById('edui116_iframe').contentWindow.document;

			let url = ueDocument.getElementById('url');
			let width = ueDocument.getElementById('width');
			let height = ueDocument.getElementById('height');
			let $wrapper = $('<div class="custom-images-picker"></div>');
			$('#edui116_buttons').before($wrapper);

			// tianyi
			let $ul = $('<ul></ul>').appendTo($wrapper);
			urlData.forEach(function(elem) {
				createItems(elem, $ul);
			});
			$ul.children('li').click(onClick);

			// hot meme
			let $ul2 = $('<ul></ul>').appendTo($wrapper);
			urlData2.forEach(function(elem) {
				createItems(elem, $ul2);
			});
			$ul2.children('li').click(onClick);

			function onClick() {
				let $this = $(this);
				$(width).val('50');
				$(height).val('50');
				$(url).val($this.data('url'));

				const ke = new KeyboardEvent("keyup", {
					bubbles: true, cancelable: true, keyCode: 13
				});
				url.dispatchEvent(ke);
			}

			function createItems(elem, $ul) {
				let $li = $('<li data-url="' + elem.url + '" title="' + elem.name + '"></li>').css('background-image', 'url(\"' + elem.url + '\"');
				$ul.append($li);
			}
		}, 1000);
	});
})();