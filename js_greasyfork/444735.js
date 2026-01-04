// ==UserScript==
// @name         bangumi 快速收藏
// @namespace    https://github.com/bangumi/scripts/tree/master/liaune
// @version      0.1
// @description  在列表中点击收藏图标，快速将条目标为看过
// @author       Liaune
// @license      MIT
// @include      /^https?:\/\/(bgm\.tv|chii\.in|bangumi\.tv)\/.*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/444735/bangumi%20%E5%BF%AB%E9%80%9F%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/444735/bangumi%20%E5%BF%AB%E9%80%9F%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==
GM_addStyle(`
	.subject_collect{
		position: relative;
		left: -15px;
		top: -20px;
		font-size: 14px;
	}
`);

function add_collect(){
	let securitycode = $('#badgeUserPanel a[href*="logout"]').length? $('#badgeUserPanel a[href*="logout"]')[0].href.split('/logout/')[1].toString(): '';
	let itemsList = document.querySelectorAll('#browserItemList li.item');
	itemsList.forEach((elem) => {
		if(elem.querySelectorAll('.collectModify').length || elem.querySelectorAll('.subject_collect').length){
			return;
		}
		let subject_id = elem.querySelector('a.subjectCover').href.split('/subject/')[1];
		let showBtn = document.createElement('a'); showBtn.className = 'l'; showBtn.href='javascript:;'; showBtn.textContent = '❤';
		showBtn.classList.add("subject_collect"); $(showBtn).css({"color":"grey"});
		let flag = 0;
		showBtn.addEventListener('click', function(){
			flag = flag==1?0:1;
			if(flag){
				let data = {interest: 2};
				$.post(`/subject/${subject_id}/interest/update?gh=${securitycode}`, data);
				$(showBtn).css({"color":"#ff6699"});
			}
			else{
				$.post(`/subject/${subject_id}/remove?gh=${securitycode}`);
				$(showBtn).css({"color":"grey"});
			}
		});
		let collectBlock = elem.querySelector('.collectBlock');
		$(collectBlock).append(showBtn);
	});
}

function launchObserver({
	parentNode,
	selector,
	failCallback = null,
	successCallback = null,
	stopWhenSuccess = true,
	config = {'childList': true, 'subtree': true},
}) {
	// if parent node does not exist, return
	if(!parentNode) return;
	const observeFunc = mutationList => {
		if(!document.querySelector(selector)) {
			if(failCallback) failCallback();
			return;
		}
		if(stopWhenSuccess) observer.disconnect();
		if(successCallback) successCallback();
	}
	let observer = new MutationObserver(observeFunc);
	observer.observe(parentNode, config);
}

(function() {
	launchObserver({
		parentNode: document.body,
		selector: '#browserItemList',
		successCallback: () => {
			add_collect();
		},
		stopWhenSuccess: false,
	});
})();
