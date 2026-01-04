// ==UserScript==
// @name         班固米加一贴贴投票增加柱状图
// @version      0.1.1
// @description  自动识别贴贴投票，在主楼附上一个图。缺点是原理大概是无差别扫前五层，可能有错误识别。
// @match        https://bgm.tv/group/topic/*
// @match        https://bangumi.tv/group/topic/*
// @match        https://chii.in/group/topic/*
// @grant        none
// @namespace https://greasyfork.org/users/919437
// @downloadURL https://update.greasyfork.org/scripts/493589/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E5%8A%A0%E4%B8%80%E8%B4%B4%E8%B4%B4%E6%8A%95%E7%A5%A8%E5%A2%9E%E5%8A%A0%E6%9F%B1%E7%8A%B6%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/493589/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E5%8A%A0%E4%B8%80%E8%B4%B4%E8%B4%B4%E6%8A%95%E7%A5%A8%E5%A2%9E%E5%8A%A0%E6%9F%B1%E7%8A%B6%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const replyList = $('#comment_list>div');
  let title = '';
  let options = [];

  // 为了适配所有情况，这里用比较蠢的暴力遍历
  // 直接递归一层寻找前五层所有有 +1 贴贴数大于 2 的回复或者子回复提取成投票选项
  replyList.slice(0, 5).each(function () {
    // 扫首层回复
    const cnt1 = getReplyElementPlusOneCnt($(this));
    if (cnt1 >= 2) {
      const messageDiv = $(this).find('.message');
      const messageContent = messageDiv.text();
      const option = messageContent.trim();
      const optionPair = [option, parseInt(cnt1)];
      options.push(optionPair);
    }

    // 递归扫一层
    const subReplyDivs = $(this).find('.topic_sub_reply>.sub_reply_bg');
    subReplyDivs.each(function () {
      const subReplyMsg = $(this).find('.cmt_sub_content');
      const subContent = subReplyMsg.text();

      // 统计帖帖： 1. 只统计 +1 类型帖帖的数量，应该是选择 data-like-value=140就行
      const cnt2 = getReplyElementPlusOneCnt($(this));
      if (cnt2 >= 2) {
        const option = subContent.trim();
        const optionPair = [option, parseInt(cnt2)];
        options.push(optionPair);
      }
    });
  });

  // log titile and opts
  console.log(title, options)

  // 先在主楼提供一个可视化投票的组件和投票按钮

  const votingComponent = createVotingComponent(title, options);
  // Append the voting component to the .postTopic div
  $('.postTopic').append(votingComponent);

  // 最后再移除 {vote} 楼层

})();

function getReplyElementPlusOneCnt(element) {
  const replyId = element.attr('id').slice(-7);

  const plusOneReactionCntElement = element.find('.item').
    filter('[data-like-value="140"]').filter(`[data-like-related-id="${replyId}"]`).find('.num');

  const cnt = plusOneReactionCntElement.text() || '0';
  return parseInt(cnt);
}

function createVotingComponent(title, votingData) {
  const maxVotes = Math.max(...votingData.map(option => option[1]));

  let html = `
      <style>
        .voting-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
          color: #555;
        }
  
        .voting-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }
  
        .voting-bar {
          display: flex;
          align-items: center;
          width: 100%;
          margin-bottom: 8px;
        }
  
        .bar {
          position: relative;
          height: 30px;
          background-color: #e0e0e0;
          border-radius: 15px;
          overflow: hidden;
          width: 70%;
        }
  
        .bar-fill {
          height: 100%;
          background-color: #9ccc65;
          border-radius: 15px;
          transition: width 0.3s ease;
        }
  
        .option-text {
          margin-left: 10px;
          font-size: 14px;
          color: #333;
        }
  
        .vote-count {
          margin-left: 10px;
          font-size: 14px;
          font-weight: bold;
        }
      </style>
      <div class="voting-container">
        <div class="voting-title">${title}</div>
    `;

  votingData.forEach(option => {
    const [optionText, voteCount] = option;
    const barWidth = (voteCount / maxVotes) * 100;

    html += `
        <div class="voting-bar">
          <div class="bar">
            <div class="bar-fill" style="width: ${barWidth}%"></div>
          </div>
          <span class="option-text">${optionText}</span>
          <span class="vote-count">${voteCount} votes</span>
        </div>
      `;
  });

  html += '</div>';

  return html;
}


// --- note ---

// 之前想写一个完全封装功能的，但是后面没动力写了，也感觉不是很有写的必要
// 这版算是 fork 了一个泛用性更强的，还是 enhanced 导向的脚本受众更多一点

// 这个其实也是矛盾的，如果只是简单的识别规则，那还是注定办法完美识别投票

// todo
// - [ ] 小 bug，回复里有引用的话（在楼中楼回复了另一个回复），最好去掉。暂时还没去掉