// ==UserScript==
// @name			斗鱼小工具
// @namespace		http://tampermonkey.net/
// @version			0.0.3
// @icon			http://www.douyutv.com/favicon.ico
// @description		斗鱼批量取关
// @author			H2P
// @compatible		chrome
// @match           https://www.douyu.com/directory/myFollow
// @note			2020.04.28-V0.0.3 删除对 jQuery 的依赖
// @downloadURL https://update.greasyfork.org/scripts/393471/%E6%96%97%E9%B1%BC%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/393471/%E6%96%97%E9%B1%BC%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(()=>{
    'use strict';

    const isFollowList = window.location.href.startsWith('https://www.douyu.com/directory/myFollow');

    const $H2P = function (xpath, one = true) {
        if (one) { return document.querySelector(xpath); }
        else { return document.querySelectorAll(xpath); }
    }

    if (isFollowList){
        let anchorsSelected = [];

    	let INVL_AddBtnCancelFollow = setInterval(() => {
			if ($H2P('div#filter-tab-expandable-wrapper') && !$H2P('a#a-cancelFollow')){
				window.clearInterval(INVL_AddBtnCancelFollow);
				INVL_AddBtnCancelFollow = null;

				new Promise((resolve, reject) => {
					let btn_cancelFollow = document.createElement('a');
					btn_cancelFollow.id = 'a-cancelFollow';
					btn_cancelFollow.className = 'layout-Module-label';
					btn_cancelFollow.innerHTML = `
						<strong>取消关注</strong>
					`;
					$H2P('div#filter-tab-expandable-wrapper').append(btn_cancelFollow);
					resolve();
				})
				.then(() => {
					$H2P('a#a-cancelFollow').addEventListener('click', () => {
						let anchorSelected = Array.from($H2P('li.layout-Cover-item div.DyLiveCover-selectArea.is-active', false));
						anchorSelected.forEach(anchor => {
							let anchorHref = anchor.nextSibling.href;
							if (!anchorHref || anchorHref.length == 0){
								anchorHref = anchor.parentNode.href;
							}
							let anchorId = anchorHref.split('/').pop();
							anchorsSelected.push(anchorId);
						});
						console.log(anchorsSelected);
						Set_TO_CancelFollow();
					});
				})
				.catch((error) => { console.log(error); })
			}
		}, 500);
		
		function Set_TO_CancelFollow () {
			if (anchorsSelected && anchorsSelected.length > 0) {
				for (let i = 0; i < anchorsSelected.length; i++) {
					let anchorId = anchorsSelected[i];
					setTimeout(() => {
						cancelFollow(anchorId);
					}, (i + 1) * 1000);
				}
			}
		}

		function cancelFollow(anchorId){
			fetch(`https://www.douyu.com/room/follow/cancel_confuse/${anchorId}`, {
				method: 'POST'
			})
			.then(res => res.json())
			.then((res) => {
				if (res && 'error' in res && res.error === 0) {
					console.log(`成功取消关注主播：${anchorId}`);
					let parentEle = $H2P(`a[href="/${anchorId}"]`).parentNode;
					// 从主播 id 找到主播信息所在 ele 的根节点
					while (!parentEle.classList.contains('layout-Cover-item') && parentEle.tagName.toLowerCase() !== 'body') {
						parentEle = parentEle.parentNode;
					}
					if (parentEle.classList.contains('layout-Cover-item') && parentEle.tagName.toLowerCase() !== 'body') {
						parentEle.remove();
					}
				} else {
					console.log(`取消关注主播：${anchorId} 失败`);
				}
			});
		}
    }
})();