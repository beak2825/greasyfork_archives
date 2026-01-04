// ==UserScript==
// @name         WeChatAI
// @name:zh-CN   微信公众号AI
// @author       Antecer
// @namespace    https://greasyfork.org/zh-CN/users/42351
// @version      0.6
// @description  智能化应答用户消息,消息加入收藏,定时发布文章等等功能
// @icon64       https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @icon         https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        window.close
// @run-at       document-end
// @compatible   chrome
// @include      https://mp.weixin.qq.com/*/*
// @downloadURL https://update.greasyfork.org/scripts/386878/WeChatAI.user.js
// @updateURL https://update.greasyfork.org/scripts/386878/WeChatAI.meta.js
// ==/UserScript==
"use strict";

GM_setValue('上次运行日期', Date());
console.log(`[公众号AI] 上次运行日期:`, GM_getValue('上次运行日期'));

// 创建sleep方法(用于async/await的延时处理)
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
// 验证网址是否包含某字符串
function UrlExp(textStr) {
	return RegExp(textStr).test(window.location.href);
}

/**
 * 回复用户消息函数 {Rich:图文, Text:文字, Image:图片, Voice:语音, Video:视频}
 */
const ReplyMsg = {
	Rich: (userUrl, appmsgid) => {
		let replyMsg = [
			userUrl.match(/tofakeid=[^&#]+/)[0],
			userUrl.match(/quickReplyId=[^&#]+/)[0],
			userUrl.match(/token=[^&#]+/)[0],
			userUrl.match(/lang=[^&#]+/)[0],
			`f=json`,
			`ajax=1`,
			`smart_product=0`,
			`type=10`,
			`isMulti=1`,
			`appmsgid=${appmsgid}`,
			`imgcode=`
		].join('&');
		return fetch('https://mp.weixin.qq.com/cgi-bin/singlesend', {
			body: replyMsg,
			credentials: 'include',
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			})
		}).then(res => res.json()).then(data => {
			if (data.base_resp.ret == 0) {
				console.log('[公众号AI] 图文消息发送成功', data);
			} else {
				console.log('[公众号AI] 图文消息发送失败', data);
			}
		}).catch(err => {
			console.log('[公众号AI] 图文消息发送失败', err);
		});
	},
	Text: (userUrl, textMsg) => {
		let replyMsg = [
			userUrl.match(/tofakeid=[^&#]+/)[0],
			userUrl.match(/quickReplyId=[^&#]+/)[0],
			userUrl.match(/token=[^&#]+/)[0],
			userUrl.match(/lang=[^&#]+/)[0],
			`f=json`,
			`ajax=1`,
			`type=1`,
			`content=${encodeURI(textMsg)}`,
			`imgcode=`
		].join('&');
		return fetch('https://mp.weixin.qq.com/cgi-bin/singlesend', {
			body: replyMsg,
			credentials: 'include',
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			})
		}).then(res => res.json()).then(data => {
			if (data.base_resp.ret == 0) {
				console.log('[公众号AI] 文字消息发送成功', data);
			} else {
				console.log('[公众号AI] 文字消息发送失败', data);
			}
		}).catch(err => {
			console.log('[公众号AI] 文字消息发送失败', err);
		});
	},
	Image: (userUrl, textMsg) => {

	},
	Voice: (userUrl, vioceMsg) => {

	},
	Video: (userUrl, videoMsg) => {

	}
}

/**
 * 检查公众号来信消息 (需传入用于参考的消息Id)
 */
function HasNewMsg(lastMsgId) {
	let postData = [
		window.location.search.match(/token=[^&]+/)[0],
		window.location.search.match(/lang=[^&]+/)[0],
		`f=json`,
		`ajax=1`,
	].join('&');
	return fetch(`https://mp.weixin.qq.com/cgi-bin/getnewmsgnum?t=ajax-getmsgnum&filterivrmsg=0&filterspammsg=1&lastmsgid=${lastMsgId}`, {
		body: postData,
		credentials: 'include',
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		})
	}).then(res => res.json()).then(data => {
		return parseInt(data.newTotalMsgCount);
	}).catch(err => {
		console.log('[公众号AI] 检查新消息失败:', err);
		return -1;
	});
}

// 消息管理
if (window.location.href.indexOf('https://mp.weixin.qq.com/cgi-bin/message') == 0) {
	// 暂时不理会收藏页
	if (window.location.href.indexOf('action=star') > 0) return;
	console.log(`[公众号AI] 已启动消息监听`);
	(async () => {
		// 循环任务,监听新消息
		while (true) {
			// 默认不勾选"隐藏关键词消息"
			if (document.querySelector('.js_hide_keyword.selected')) {
				document.querySelector('.js_hide_keyword.selected').click();
				console.log(`[公众号AI] 已取消"隐藏关键词消息"`);
			}
			// 获取当前页面的消息列表
			var messageList = document.querySelectorAll('.message_item');
			var autoReply = GM_getValue("智能回复");
			if (messageList.length > 0 && autoReply) {
				// 用户消息自动回复处理
				for (let i = messageList.length; i--;) {
					let userItem = messageList[i];
					if (userItem.className.match(/replyed/) || userItem.querySelector('a[starred="1"]')) continue; // 跳过已回复或已星标的消息
					let userMsg = userItem.querySelector('.wxMsg').innerHTML;
					for (let n = 0, len = autoReply.length; n < len; n++) {
						let replyItem = autoReply[n];
						if (replyItem.regex.trim() && userMsg.match(replyItem.regex)) {
							console.log(`[公众号AI] 发现关键字:`, replyItem.regex);
							userItem.className += ` replyed`; // 标注消息"已回复"
							if (replyItem.reply.trim()) {
								let replyUrl = userItem.querySelector('.remark_name').href;
								await ReplyMsg[replyItem.mode](replyUrl, replyItem.reply);
							}
							let starIcon = userItem.querySelector('a[starred=""]');
							if (replyItem.star && starIcon) {
								console.log(`[公众号AI] 已星标消息:`, userMsg);
								starIcon.click();
							}
							break;
						}
					}
				}
				// 检查消息页是否为第一页
                if (document.querySelector('.page_num>label').innerText == 1){
                    // 默认选择"今天"的消息显示(注:最近5天可能刷不出新消息)
                    if (document.querySelector('#dayselect .jsBtLabel') &&document.querySelector('#dayselect .jsBtLabel').innerText != '今天'){
                        document.querySelector('a[data-name="今天"]').click();
                        console.log(`[公众号AI] 已选择显示"今天"的消息`);
                    }
                    // 检查新消息
                    var newMsgCount = await HasNewMsg(messageList[0].getAttribute("data-id"));
                    console.log(`[公众号AI] 发现 ${newMsgCount} 条新消息!`);
                    if (newMsgCount > 0) {
                        window.location.reload(); // 刷新页面
                    }
                }
			}
			await sleep(1000); // 消息监听循环,间隔1000ms
		}
	})();
}

// 插件菜单
GM_registerMenuCommand(`设置脚本`, () => {
	alert('功能开发中!');
});