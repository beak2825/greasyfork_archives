// ==UserScript==
// @name         Twitch掉宝自动领取/全自动领取/Twitch全自动掉宝/Twitch Claim/SUZIE/长期可用/有问题及时反馈！
// @version      1.3.2
// @description  自动领取掉宝库存页面奖励（此脚本由其他作者开源）
// @author       小黑盒：SUZIE 抖音：SUZIE 企鹅1群：901830179 企鹅2群：558768230
// @match        https://www.twitch.tv/drops/inventory*
// @icon         https://imgheybox.max-c.com/avatar/2021/11/09/f93babd9c2e98dadd71849435f90cb51.jpeg
// @run-at       document-end
// @namespace    https://xiaoheihe.cn/community/7216/list/83188884
// @downloadURL https://update.greasyfork.org/scripts/446594/Twitch%E6%8E%89%E5%AE%9D%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E5%85%A8%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96Twitch%E5%85%A8%E8%87%AA%E5%8A%A8%E6%8E%89%E5%AE%9DTwitch%20ClaimSUZIE%E9%95%BF%E6%9C%9F%E5%8F%AF%E7%94%A8%E6%9C%89%E9%97%AE%E9%A2%98%E5%8F%8A%E6%97%B6%E5%8F%8D%E9%A6%88%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/446594/Twitch%E6%8E%89%E5%AE%9D%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E5%85%A8%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96Twitch%E5%85%A8%E8%87%AA%E5%8A%A8%E6%8E%89%E5%AE%9DTwitch%20ClaimSUZIE%E9%95%BF%E6%9C%9F%E5%8F%AF%E7%94%A8%E6%9C%89%E9%97%AE%E9%A2%98%E5%8F%8A%E6%97%B6%E5%8F%8D%E9%A6%88%EF%BC%81.meta.js
// ==/UserScript==

const claimButton = '[class="ScCoreButton-sc-ocjdkq-0 ScCoreButtonPrimary-sc-ocjdkq-1 caieTg eHSNkH"]';
var onMutate = function(mutationsList) {
	mutationsList.forEach(mutation => {
		if(document.querySelector(claimButton)) document.querySelector(claimButton).click();
	})
}
var observer = new MutationObserver(onMutate);
observer.observe(document.body, {childList: true, subtree: true});

setInterval(function() {
                  window.location.reload();
                }, 1*60000);
