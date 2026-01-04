// ==UserScript==
// @name        bs redeem（语音版）
// @namespace   steam
// @author      伟大鱼塘
// @description 激活bs key
// @include     https://www.bundlestars.com/en/orders/
// @match       https://www.bundlestars.com/en/orders/*
// @version     0.0.2
// @require     https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/32947/bs%20redeem%EF%BC%88%E8%AF%AD%E9%9F%B3%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/32947/bs%20redeem%EF%BC%88%E8%AF%AD%E9%9F%B3%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
	(function($) {

		//添加样式
		{
			const modalstyle = '.redeem-moadal {visibility:hidden;opacity:0;transition: all .4s ease-out 0s;position:fixed;width:300px;height:245px;left:50%;top:50%;transform: translate(-50%,-50%);-webkit-transform: translate(-50%,-50%);background:#fff;z-index:5000;border-radius:15px;text-align:center;} .redeem-moadal p {line-height:1.8;color:#666;letter-spacing:0.5px;} .redeem-moadal p i{font-style:normal;color:#ccc;} #closemodal {visibility;hidden;opacity:0;border: 1px solid rgba(0, 0, 0, 0.3);padding:5px;color:#666;width:100%;}';
			const bgstyle = '.blackbg {visibility:hidden;opacity:0;transition: all .4s ease-out 0s;position:fixed;left:0;top:0;height:100%;width:100%;background:rgba(0,0,0,.5);z-index:4000;}  .redeem-moadal.open,.blackbg.open,#closemodal.open {visibility:visible;opacity:1;}';
			const gameStyle = '.card {transition: all .4s ease-out 0s;} .act {background-color:rgba(89, 204, 103,.2) !important;} .failed {background-color:rgba(229, 68, 90,.4) !important;} button {transition: all .4s ease-out 0s;} .redeemsteamkey:hover,.getsessionid:hover {color:#fff !important;background-color:rgba(0, 0, 0, 0.3) !important;border-color:rgba(0, 0, 0, 0.3) !important;} #redeemselectedsteamkey:hover {background:rgba(155, 89, 182,1) !important;} #redeemallsteamkey:hover {background:rgba(88, 94, 100,1) !important;}';
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

		//添加相关dom组件
		{
			$.each($('input.form-control.ng-pristine.ng-untouched.ng-valid'), (i, e) => {
				const btn = '<span class="input-group-btn"><button class="redeemsteamkey btn btn-primary ng-isolate-scope type="button" class="btn btn-primary ng-isolate-scope">激活</button></span>';
				$(e).after(btn);
			});
			const mulbtn = '<button id="redeemselectedsteamkey" style="display:block;color:#fff;background:rgba(155, 89, 182,0.7);text-align:center;padding:10px;width:60%;margin:auto;border-radius:10px;border: none;">激活选中游戏</button>';
			const allbtn = '<button id="redeemallsteamkey" style="display:block;color:#fff;background:rgba(88, 94, 100,0.7);text-align:center;padding:10px;width:60%;margin:auto;margin-top:20px;margin-bottom:20px;border-radius:10px;border: none;">激活全部游戏</button>';

			const sessioninput = '<div id="sessioninputdiv" style="background-color: #303030;margin-bottom: 10px;border-radius: 0;outline: 0 !important;box-sizing: border-box;"><div><table class="order-table"><tbody><tr><td style="width: 150px;" class="hidden-xs"></td><td class="title ng-binding">你的Session ID</td><td class="key-container hidden-sm hidden-xs"><div class="key-reveal-copy ng-scope"><div class="input-group"><input id="g_sessionID" class="form-control ng-pristine ng-valid ng-touched" type="text"><span class="input-group-btn"><button type="button" class="getsessionid btn btn-primary ng-isolate-scope">获取sessionid</button></span></div></div></td></tr></tbody></table></div></div>';
			$('h4.ng-binding.ng-hide').after(sessioninput);
			$('.bundle.ng-binding').after(mulbtn, allbtn);

			$('#sessioninputdiv').nextAll().on('click', function() {
				let that = $(this);
				$(this).removeClass('failed');
				if (!that.hasClass('act')) {
					that.addClass('act');
				} else {
					that.removeClass('act');
				}
			});
		}


		//获取session id

		let sessionid = null;
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
		//全部
		$('#redeemallsteamkey').on('click', function() {
			redeem('m', null, $('#sessioninputdiv').nextAll());
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
					let key = $(e).find('input.form-control.ng-pristine.ng-untouched.ng-valid').val();
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
				let key = that.parent().prev().val();
				let posi = that.parents('.card.ng-scope').index();
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
					onload: response => {
						result = JSON.parse(response.responseText);
						if (result.success == 1) {
							mark.successful += 1;
							$('#rs').html(mark.successful);
						} else {
							mark.failed += 1;
							$('#rf').html(mark.failed);
							if (p || p === 0) {
								$('#sessioninputdiv').parent().children().eq(p).addClass('failed');
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
					redeem('m', null, $('#sessioninputdiv').nextAll());
				}
			});
			recog.onerror = (e) => {
				console.log(e);
			};
		}

	})(jQuery);
});