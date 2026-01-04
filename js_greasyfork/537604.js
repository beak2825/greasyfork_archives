// ==UserScript==
// @name         V2ex Random Floor
// @namespace    http://tampermonkey.net/
// @version      2025-05-28
// @description  祝你好运
// @author       You
// @match        https://www.v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537604/V2ex%20Random%20Floor.user.js
// @updateURL https://update.greasyfork.org/scripts/537604/V2ex%20Random%20Floor.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const V2exMaxPageSize = 20

  // ==UserScript菜单==
  if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('启动抽奖', async function() {
      const urlTopicId = window.location.pathname.match(/\/t\/(\d+)/)[1];
      const topicId = prompt('请输入主题ID:', urlTopicId || '');
      if (!topicId) return alert('主题ID不能为空');

      const defaultToken = window.localStorage.getItem('v2ex-random-floor-token') || '';
      const userToken = prompt('请输入用户Token，在设置 - Tokens 中生成:', defaultToken);
      if (!userToken) return alert('用户Token不能为空');
      window.localStorage.setItem('v2ex-random-floor-token', userToken);

      const luckyCount = parseInt(prompt('请输入抽奖人数:', '1'), 10) || 1;
      if (isNaN(luckyCount) || luckyCount < 1) return alert('抽奖人数必须大于0');

      const isUnique = confirm('是否用户去重? (确定=是, 取消=否)');
      const today = new Date();
      const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
      const deadline = prompt('请输入截止时间(可留空, 格式: yyyy-mm-dd HH:MM):', `${endTime.toISOString().slice(0, 10)} 24:00`);

      if (new Date(deadline).getTime() < 0) return alert('截止时间格式不正确');

      const maxUserCount = parseInt(prompt('请输入最大参与人次(可留空):', '0'), 10) || 0;
      if (isNaN(maxUserCount) || maxUserCount < 0) return alert('最大参与人次必须大于等于0');
      if (maxUserCount && maxUserCount < luckyCount) return alert('最大参与人次必须大于等于抽奖人数');

      const randomSeed = prompt('请输入随机种子，如总楼层数，可引入外部随机变量保证公平性:', '');
      const options = { topicId, luckyCount, isUnique, deadline, randomSeed, userToken, maxUserCount };


      const rf = new RandomFloor(options);
      try {
        console.log(`开始抽奖: 主题ID=${rf.topicId}, 抽奖人数=${rf.luckyCount}, 用户去重=${rf.isUnique}, 截止时间=${rf.deadline}, 最大参与人次=${rf.maxUserCount}`);
        await rf.run();
        alert('抽奖执行完毕, 结果请查看控制台日志');
      } catch (e) {
        alert('抽奖出错: ' + e.message);
      }
    });
  }

  class RandomFloor {
    constructor(options) {
      // 主题 ID
      this.topicId = options.topicId
      // 随机种子
      this.nextRandomSeed = new Math.seedrandom(options.randomSeed || Math.random())
      // 抽奖人数
      this.luckyCount = options.luckyCount || 1
      // 是否用户去重
      this.isUnique = options.isUnique || false
      // 截止时间
      this.deadline = options.deadline || 0
      // 最多参与人次
      this.maxUserCount = options.maxUserCount || 0
      // 回帖列表
      this.replies = []
      // token
      this.token = options.userToken || ''
    }

    async run() {
      const replies = await this.getReplyList(this.topicId)
      const validateList = this.filterReplies(replies)
      this.addLog(`累计 ${replies.length} 条回帖，去重后 ${validateList.length} 条`)
      if (validateList.length < this.luckyCount) {
        this.addLog(`回帖数量不足，无法抽奖`)
        return
      }
      this.addLog(`开始抽奖...`)
      const nextId = this.nextRandomSeed
      const luckyList = []
      const luckySet = new Set()
      while (luckyList.length < this.luckyCount) {
        const index = Math.floor(nextId() * validateList.length)
        const item = validateList[index]
        if (this.isUnique && luckySet.has(item.userId)) {
          continue
        }
        luckySet.add(item.userId)
        luckyList.push(item)
      }
      this.addLog(`抽奖完成，中奖名单如下：`)

      let messageText = `抽奖完成，中奖名单如下：\n`
      luckyList.forEach(item => {
        messageText += `第${item.index}楼 @${item.userName} (${item.userId})\n`
      })
      this.addLog(messageText)
      this.addLog(`抽奖结束`)
    }

    get deadlineStamp() {
      if (typeof this.deadline === 'number') {
        return this.deadline
      }
      if (typeof this.deadline === 'string') {
        return new Date(this.deadline).getTime()
      }
      if (this.deadline instanceof Date) {
        return this.deadline.getTime()
      }
      return 0
    }

    filterReplies(replies) {
      const { isUnique, deadlineStamp, maxUserCount } = this
      const userIds = new Set()
      const items = replies.filter(item => {
        if (isUnique && userIds.has(item.userId)) {
          return false
        }
        if (deadlineStamp && item.created > deadlineStamp) {
          return false
        }
        userIds.add(item.userId)
        return true
      })
      return maxUserCount > 0 ? items.slice(0, maxUserCount) : items
    }

    async getReplyList(topicId, page = 1) {
      this.addLog(`获取楼层列表: 第${page}页 获取中...`)
      const replies = await fetch(`/api/v2/topics/${topicId}/replies?p=${page}`, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + this.token }
      }).then(res => {
        if (res.status !== 200) {
          throw new Error(`获取楼层列表失败: ${res.status} ${res.statusText}`)
        }
        return res.json()
      })
      if (!replies.success) {
        throw new Error(`获取楼层列表失败: ${replies.message}`)
      }
      if (!replies.result.length) {
        return this.replies
      }
      const dataList = replies.result.map((item, index) => {
        return {
          index: this.replies.length + index + 1,
          userId: item.member.id,
          userName: item.member.username,
          created: item.created * 1000,
        }
      })
      this.replies.push(...dataList)
      this.addLog(`获取楼层列表: 第${page}页 获取到 ${dataList.length} 条`)
      if (dataList.length < V2exMaxPageSize) {
        this.addLog(`获取楼层列表: 第${page}页 获取完毕`)
        return this.replies
      }
      return this.getReplyList(topicId, page + 1)
    }

    addLog(message) {
      console.info(`[v2ex RandomFloor] ${message}`)
    }
  }

})();