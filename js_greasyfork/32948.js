// ==UserScript==
// @name        hb redeem（语音版）
// @namespace   steam
// @author      伟大鱼塘
// @description 激活hb key
// @include     https://www.humblebundle.com/home/keys
// @match       https://www.humblebundle.com/home/keys
// @version     0.0.2
// @require     https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/32948/hb%20redeem%EF%BC%88%E8%AF%AD%E9%9F%B3%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/32948/hb%20redeem%EF%BC%88%E8%AF%AD%E9%9F%B3%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
	(function($) {

		//添加相关dom组件，因为HB分页的问题做一下处理

		const mulbtn = '<button id="redeemselectedsteamkey" style="border:none;display:block;color:#fff;background:rgba(155, 89, 182,0.8);text-align:center;padding:10px;width:60%;margin:auto;margin-top:20px;border-radius:10px;">激活选中游戏</button>';
		const allbtn = '<button id="redeemallsteamkey" style="border:none;display:block;color:#fff;background:rgba(52, 73, 94,0.75);text-align:center;padding:10px;width:60%;margin:auto;margin-top:20px;margin-bottom:20px;border-radius:10px;">激活全部游戏</button>';
		$('.table-rounder').prepend(mulbtn, allbtn);
		let sessionid = null;

		function redeemFun() {

			//添加样式
			{
				const modalstyle = '.redeem-moadal {visibility:hidden;opacity:0;transition: all .4s ease-out 0s;position:fixed;width:300px;height:270px;left:50%;top:50%;transform: translate(-50%,-50%);-webkit-transform: translate(-50%,-50%);background:#fff;z-index:5000;border-radius:15px;text-align:center;} .redeem-moadal p {line-height:1.8;color:#666;letter-spacing:0.5px;} .redeem-moadal p i{font-style:normal;color:#ccc;} #closemodal {visibility;hidden;opacity:0;border: 1px solid rgba(0, 0, 0, 0.3);padding:5px;width:100%;}';
				const bgstyle = '.blackbg {visibility:hidden;opacity:0;transition: all .4s ease-out 0s;position:fixed;left:0;top:0;height:100%;width:100%;background:rgba(0,0,0,.5);z-index:4000;}  .redeem-moadal.open,.blackbg.open,#closemodal.open {visibility:visible;opacity:1;}';
				const gameStyle = 'tr {transition: all .4s ease-out 0s;} .act {background-color:rgba(89, 204, 103,.2) !important;} .failed {background-color:rgba(229, 68, 90,.4) !important;} button {transition: all .4s ease-out 0s;}.redeemsteamkey:hover,.getsessionid:hover {color:#fff !important;background-color:#7A981C !important;} #redeemselectedsteamkey:hover {background:rgba(155, 89, 182,1) !important;} #redeemallsteamkey:hover {background:rgba(88, 94, 100,1) !important;} .unredeemed-keys-table td.redeemer-cell {padding-right:0 !important;}';
				GM_addStyle(modalstyle + bgstyle + gameStyle);
			}

			//添加状态框
			{
				const modal = '<div class="redeem-moadal"><div style="padding-top:30px;"><p>激活总数：<i id="ra">0</i></p><p>激活成功数：<i id="rs" style="color:#80CF35;">0</i></p><p>激活失败数：<i id="rf" style="color:#DD4141;">0</i></p><p class="rdone"><p></div><div style="padding:15px"><button id="closemodal" type="button">关闭窗口</button></div></div>';
				const bg = '<div class="blackbg"></div>';
				$('body').append(modal, bg);

				$('#closemodal').on('click', function() {
					$('.redeem-moadal,.blackbg').removeClass('open');
					$(this).removeClass('open');
				});
			}

			const sessioninput = '<tr id="sessionidtr"><td class="platform"><i class="hb hb-key hb-steam" title="Steam"></i></td><td><h4 title="你的Session ID">你的Session ID</h4></td><td class="js-redeemer-cell redeemer-cell"><div class="key-redeemer"><div class="container"><div class="keyfield redeemed"><input id="g_sessionID" type="text" style="width:100%;background: #E9EEE4;border:none;color: #7A981C;font-size:16px;text-align:center;"></div></div></div></td><td style="padding:0;text-align:center;"><button class="getsessionid" style="padding:8px 16px;border:1px solid #7A981C;color:#7A981C;background: #E9EEE4;">获取</button></td></tr>';
			$('.unredeemed-keys-table tbody').prepend(sessioninput);

			$('#sessionidtr').nextAll().on('click', function() {
				let that = $(this);
				$(this).removeClass('failed');
				if (!that.hasClass('act')) {
					that.addClass('act');
				} else {
					that.removeClass('act');
				}
			});
			$.each($('#sessionidtr').nextAll(), (i, e) => {
				const btn = '<td style="padding:0;text-align:center;"><button class="redeemsteamkey" style="padding:8px 16px;border:1px solid #7A981C;color:#7A981C;background: #E9EEE4;">激活</button></td>';
				$(e).append(btn);
			});

			$('#g_sessionID').on('input', function() {
				sessionid = $(this).val();
			});
			$('.getsessionid').off().on('click', function() {
				getSessionID();
			});
			getSessionID();

			//单激活

			$('.redeemsteamkey').on('click', function() {
				let that = $(this);
				redeem('s', that);
			});


			//批量激活

			$('#redeemselectedsteamkey').on('click', function() {
				redeem('m', null, $('.act'));

			});
			//全部激活
			$('#redeemallsteamkey').on('click', function() {
				redeem('m', null, $('#sessionidtr').nextAll());
			});

			//激活
			function redeem(type, that, selector) {
				let mark = {
					ifsuccess: 0, //异步成功标识
					successful: 0, //成功数
					failed: 0 //失败数
				};
				//type参数为判断是否是批量激活，m为多激活，s为单激活
				if (type == "m") {
					let keys = [];
					let position = [];
					let i = 1; //循环定时器以及position数组，从1开始，第0次直接执行不通过loop函数
					let all = selector.length;
					$.each(selector, (i, e) => {
						let key = $(e).find('.keyfield').attr('title');
						let posi = $(e).index();
						position.push(posi);
						keys.push(key);
					});
					if (!sessionid) {
						alert('请输入你的Session ID！');
					} else if (keys.length) {
						$('.rdone').html('');
						$('#rs,#rf').html(0);
						$('.redeem-moadal,.blackbg').addClass('open');
						$('#ra').html(all);
						redeemResquest(keys[0], sessionid, mark, all, position[0]);
						loopRequest(keys, sessionid, mark, all, position, i);
					} else {
						alert('请先选择要激活的游戏！');
					}
				} else {
					let key = that.find('.keyfield').attr('title');
					let posi = that.parents('tr').index();
					if (!sessionid) {
						return alert('请输入你的Session ID！');
					}
					redeemResquest(key, sessionid, mark, 1, posi).then((mark) => {
						if (mark.successful)
							alert('激活成功！');
						else
							alert('激活失败！');
					}).catch((error) => {
						alert(`出错了！错误原因：${error}`);
					});
				}
			}

			//多激活延迟
			function loopRequest(keys, sessionid, mark, all, p, i) {
				setTimeout(function() {
					if (i > (keys.length - 1)) {
						return;
					}
					redeemResquest(keys[i], sessionid, mark, all, p[i]);
					i++;
					loopRequest(keys, sessionid, mark, all, p, i);
				}, 10000);
			}

			//激活请求 all参数用来保存请求总数 p参数用来确定哪一个div.game-key-string激活失败并加failed类
			function redeemResquest(key, sessionid, mark, all, p) {
				return new Promise((resolve, reject) => {
					GM_xmlhttpRequest({
						method: 'GET',
						url: `https://store.steampowered.com/account/ajaxregisterkey/?product_key=${key}&sessionid=${sessionid}`,
						data: `product_key=${key}&sessionid=${sessionid}`,
						onload: response => {
							result = JSON.parse(response.responseText);
							if (result.success == 1) {
								mark.successful += 1;
								$('#rs').html(mark.successful);
							} else {
								mark.failed += 1;
								$('#rf').html(mark.failed);
								if (p || p === 0) {
									$('.unredeemed-keys-table').find('tbody tr').eq(p).addClass('failed');
								}
							}
							mark.ifsuccess += 1;
							if (mark.ifsuccess == all) {
								$('#closemodal').addClass('open');
								$('.rdone').html('激活完成！');
							}
							resolve(mark);
						},
						onerror: () => {
							reject(error);
						}
					});
				});
			}

			//获取session ID
			function getSessionID() {
				$('#g_sessionID').val('');
				$('.getsessionid').html('正在获取...');
				GM_xmlhttpRequest({
					method: 'GET',
					url: 'https://store.steampowered.com',
					onload: response => {
						let res = response.responseText;
						let ifss = res.includes('g_sessionID');
						if (ifss) {
							let start = res.indexOf('g_sessionID') + 15;
							let end = start + 24;
							let ssid = res.substring(start, end);
							sessionid = ssid;
							$('#g_sessionID').val(ssid);
							$('.getsessionid').html('获取成功!');
							$('.getsessionid').hover(function() {
								$(this).html('重新获取');
							});
						}
					},
					onerror: () => {
						alert('获取出错！');
						$('.getsessionid').html('重新获取');
					}
				});
			}
			//获取session ID
			function getSessionID() {
				$('#g_sessionID').val('');
				$('.getsessionid').html('正在获取...');
				GM_xmlhttpRequest({
					method: 'GET',
					url: 'https://store.steampowered.com',
					onload: response => {
						let res = response.responseText;
						let ifss = res.includes('g_sessionID');
						if (ifss) {
							let start = res.indexOf('g_sessionID') + 15;
							let end = start + 24;
							let ssid = res.substring(start, end);
							sessionid = ssid;
							$('#g_sessionID').val(ssid);
							$('.getsessionid').html('获取成功!');
							$('.getsessionid').hover(function() {
								$(this).html('重新获取');
							});
						}
					},
					onerror: () => {
						alert('获取出错！');
						$('.getsessionid').html('重新获取');
					}
				});
			}

			//语音识别
			if (webkitSpeechRecognition) {
				let recog = new webkitSpeechRecognition();
				recog.continuous = true;
				recog.interimResults = true;
				recog.start();
				$(recog).on('result', (e) => {
					let resultsLength = e.originalEvent.results.length - 1;
					let ArrayLength = e.originalEvent.results[resultsLength].length - 1;
					let word = e.originalEvent.results[resultsLength][ArrayLength].transcript;
					let val = $('#g_sessionID').val();
					if (word.includes('激活') && val) {
						$(recog).off();
						console.log(e);
						redeem('m', null, $('#sessionidtr').nextAll());
					}
				});
				recog.onerror = (e) => {
					console.log(e);
				};
			}
		}

		redeemFun();

		$('.js-key-manager-holder').on('click', '.jump-to-page', () => {
			redeemFun();
		});

	})(jQuery);
});