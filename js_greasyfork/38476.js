// ==UserScript==
// @name         斗鱼自动领鱼丸
// @version      1.2.1
// @description  实现斗鱼自动领鱼丸
// @author       消失的旅人
// @match        https://www.douyu.com/*
// @grant        none
// @namespace https://greasyfork.org/users/170855
// @downloadURL https://update.greasyfork.org/scripts/38476/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E9%A2%86%E9%B1%BC%E4%B8%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/38476/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E9%A2%86%E9%B1%BC%E4%B8%B8.meta.js
// ==/UserScript==

window.setInterval(function() {
    var nodes = [
      ['yw-countdown', 'may-btn'],
      ['RewardModule-countdown', 'RewardM-text enable']
    ]
    
    for (i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var time = document.getElementsByClassName(node[0])[0];
      var isClickedRewardNode = document.getElementsByClassName('v3-sign-wrap').length > 0;
      if (!isClickedRewardNode && time && time.textContent.replace(/\s/g, '') === '领取') {
        time.click();
        var rewardNode = document.getElementsByClassName(node[1])[0];
        rewardNode && rewardNode.click();
      }
    }
}, 10000);
