// ==UserScript==
// @name         班固米贴贴投票组件
// @version      0.1.2.1
// @description  可视化地进行贴贴投票
// @match        https://bgm.tv/group/topic/*
// @match        https://bangumi.tv/group/topic/*
// @match        https://chii.in/group/topic/*
// @grant        none
// @namespace https://greasyfork.org/users/919437
// @downloadURL https://update.greasyfork.org/scripts/492998/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E8%B4%B4%E8%B4%B4%E6%8A%95%E7%A5%A8%E7%BB%84%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/492998/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E8%B4%B4%E8%B4%B4%E6%8A%95%E7%A5%A8%E7%BB%84%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const replyList = $('#comment_list div');
    let title = '';
    let options = [];
    replyList.slice(0, 3).each(function () {
        const messageDiv = $(this).find('.message');
        const messageContent = messageDiv.text();
        if (messageContent.startsWith('{vote}')) {
            // get title
            title = messageContent.replace('{vote}', '').trim();
            title = title.replace(/\n/g, '');

            // find options
            const subReplyDivs = $(this).find('.sub_reply_bg>.inner');
            subReplyDivs.each(function () {
                const subReplyMsg = $(this).find('.cmt_sub_content');
                const subContent = subReplyMsg.text();
                if (subContent.startsWith('{opt}')) {
                    const option = subContent.replace('{opt}', '').trim();

                    // 统计帖帖： 1. 只统计 +1 类型帖帖的数量，应该是选择 data-like-value=140就行
                    const plusOneReactionCntString = $(this).find('.item').filter('[data-like-value="140"]').find('.num');
                    const cnt = plusOneReactionCntString.text() || '0';
                    const optionPair = [option, parseInt(cnt)];
                    options.push(optionPair);
                }
            });
            return false; // exit the each loop if '{vote}' is found
        }
    });

    // log titile and opts
    console.log(title, options)

    // 先在主楼提供一个可视化投票的组件和投票按钮

    const votingComponent = createVotingComponent(title, options);
    // Append the voting component to the .postTopic div
    $('.postTopic').append(votingComponent);

    // 最后再移除 {vote} 楼层

})();

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
