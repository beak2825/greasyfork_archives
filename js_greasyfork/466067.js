// ==UserScript==
// @name         游戏时长汉化-rev
// @namespace   Violentmonkey Scripts
// @match       *://*.howlongtobeat.com/*
// @grant       none
// @version     0.3
// @author      -
// @description 汉化界面的部分菜单及内容
// @author       tiannu
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466067/%E6%B8%B8%E6%88%8F%E6%97%B6%E9%95%BF%E6%B1%89%E5%8C%96-rev.user.js
// @updateURL https://update.greasyfork.org/scripts/466067/%E6%B8%B8%E6%88%8F%E6%97%B6%E9%95%BF%E6%B1%89%E5%8C%96-rev.meta.js
// ==/UserScript==
// 参考 https://greasyfork.org/zh-CN/scripts/462490-openai-com%E6%B1%89%E5%8C%96





(function() {
    'use strict';

    const i18n = new Map([
        ['Platforms', '游戏平台'],
        ['Developer', '开发商'],
        ['Genres', '游戏类型'],
        ['Publisher', '发行商'],
        ['How Game Cards Work', '如何使用游戏卡'],
        ['Check the category that best matches your play style, this is our best estimate for how long it will take you to complete the game. You can also click on the games individually to really break down the stats.', '检查最符合您游戏风格的类别,这是我们对您完成游戏所需时间的最佳估计.您还可以单击游戏以详细了解统计信息.'],
        ['Main Story (Required)', '主要故事(必需)'],
        ['You complete the main objectives, just enough to see the credits roll.', '您完成主要目标,只需足够看到制作人员名单字幕滚动即可.'],
        ['Main Story and Additional Quests/Medals/Unlockables', '主要故事和其他任务/奖章/解锁'],
        ['You take your time, discover and complete additional tasks not required.', '您花费时间,发现并完成不必要的其他任务.'],
        ['Completionist (100%)', '完美主义者(100%)'],
        ['You strive for every achievement, every medal and conquer all that the game has to offer.', '您追求每个成就.每个奖章,并征服游戏所提供的所有内容.'],
        ['Combined', '综合'],
        ['All play styles considered during estimation.', '在估计过程中考虑所有游戏风格.'],
        ['Sample Card', '示例卡'],
        ['Use the accuracy guide so you know what times to trust.', '使用准确性指南.以便知道哪些时间可以信任.'],
        ['Accuracy Guide', '准确性指南'],
        ['Poor', '差'],
        ['Excellent', '极好'],
        ['Sides', '支线内容'],
		['Recent Backlogs', '最近搁置'],
		['Retirement', '弃坑报告'],
        ['Check out the latest discussion!', '查看最新的讨论！'],
        ['Select a category and we\'ll gather the stats!', '选择一个分类，我们将为您收集统计数据！'],
        ['Playthroughs', '通关游戏数'],
        ['Perspectives', '视角'],
        ['First-Person', '第一人称'],
        ['Isometric', '等距视角'],
        ['Side', '侧视角'],
        ['Text', '文字形式'],
        ['Third-Person', '第三人称'],
        ['Top-Down', '俯视角'],
        ['Virtual Reality', '虚拟现实'],
        ['Massively Multiplayer', '大型多人在线游戏'],
        ['Point-and-Click', '鼠标点击游戏'],
        ['Real-Time', '实时的'],
        ['Scrolling', '滚屏游戏'],
        ['Turn-Based', '回合制'],
        ['Flows', '游戏流程'],
        ['Latest Video Playthroughs', '最新视频播放'],
        ['First Playthrough?', '第一次通关？'],
        ['Submission Time Includes DLC?', '提交的时间包括dlc？'],
        ['All PlayStyles', '全部游戏内容'],
        ['Recent Gaming', '最近的游戏'],
        ['Recent Game Specific', '最近的具体游戏'],
        ['Recent Game Blogs', '最近的游戏播客'],
        ['Recent Off-Topic', '最近的题外话'],
        ['Recent Site Support', '最近的社区管理'],
        ['Members Online', '人在线'],
        ['Video game news, deals, impressions, reviews and more.', '视频游戏新闻、交易、印象、评论等'],
        ['Discuss specific games.', '讨论特定的游戏'],
        ['A gamer\'s journey.', '游戏玩家的旅程'],
        ['Everything else.', '其他一切'],
        ['Help and feedback for HowLongToBeat.', 'HowLongToBeat的帮助和反馈'],
        ['Review Scale', '评价分布'],
        ['Sorted By Date', '按日期排序'],
        ['Length By PlayStyle', '时长-按游戏方式'],
        ['Walkthrough Videos', '教学视频'],
        ['Completion Categories', '通关类型'],
        ['Select a category to view playthrough data.', '选择一个类别以查看数据。'],
        ['A game specific forum for ', '特定的游戏论坛for'],
        ['Backlogged', '搁置'],
        ['Single-Player', '单人游戏'],
        ['Multi-Player', '多人游戏'],
        ['Co-Op', '合作的'],
        ['Competitive', '竞争的'],
        ['Wiki Guides', '维基百科'],
        ['Login', '注册'],
        ['\Join', '登录'],
//        ['\Stats', '查看统计'],
        ['Forum', '论坛'],
        ['Submit', '提交数据'],
        ['Popular Games', '热门游戏'],
        ['Main Story', '仅主线故事'],
        ['Main', '主线'],
        ['Completionist', '完全探索'],
        ['All Styles', '综合考虑'],
        ['Google Stadia', 'Google云游戏'],
        ['View Interactive Map', '查看交互式地图'],
        ['Search Your Favorite Games...', '搜索您最喜爱的游戏...'],
        ['\NA:', '北美'],
        ['\EU:', '欧盟'],
        ['\JP:', '日本'],
        ['Most', '最多'],
        ['Releases By Year', '按发布年份'],
        ['Ratio', '比例'],
        ['Release Year', '发布年份'],
        ['Overall', '整体'],
        ['Breakdown', '概览'],
        ['Releases', '发布'],
        ['Avg Time', '平均时间'],
        ['Avg Rated', '好评率'],
        ['All Games', '全部游戏'],
        ['Best Rated', '最高好评率'],
        ['Worst Rated', '最低好评率'],
        ['Completed', '通关'],
        ['Shortest Games', '最短流程'],
        ['Longest Games', '最长流程'],
        ['Polled', '统计人数'],
        ['Fastest', '最快的'],
        ['\Overview', '概述'],
        ['\Lists', '分类'],
        ['Completions', '玩过的玩家'],
        ['Playing', '正在游玩'],
        ['Backlogs', '搁置'],
        ['Replays', '重复游玩'],
        ['Retired', '弃坑'],
        ['Rating', '好评'],
        ['Hours', '小时'],
        ['Alias', '别名'],
        ['Additional Content', '附加内容'],
        ['Rated', '好评'],
        ['Average', '平均数'],
        ['Median', '中位数'],
        ['Rushed', '快速通过'],
        ['Leisure', '悠闲游戏'],
        ['Speedruns', '速通'],
        ['Retirement', '弃坑率'],
		['\Slowest', '最慢的'],
        ['\Updated', '更新时间'],
        ['Check out the latest discussion!', '查看最新的讨论！'],
        ['Select a category and we\'ll gather the stats!', '选择一个分类，我们将为您收集统计数据！'],
        ['Playthroughs', '通关游戏数'],
        ['Perspectives', '视角'],
        ['First-Person', '第一人称'],
        ['Isometric', '等距视角'],
        ['Side', '侧视角'],
        ['Text', '文字形式'],
        ['Third-Person', '第三人称'],
        ['Top-Down', '俯视角'],
        ['Virtual Reality', '虚拟现实'],
        ['Massively Multiplayer', '大型多人在线游戏'],
        ['Point-and-Click', '鼠标点击游戏'],
        ['Real-Time', '实时的'],
        ['Scrolling', '滚屏游戏'],
        ['Turn-Based', '回合制'],
        ['Flows', '游戏流程'],
        ['Action', '动作游戏'],
        ['Adventure', '冒险游戏'],
        ['Arcade', '街机游戏'],
        ['Battle Arena', '对战游戏'],
        ['Beat em Up', '清版游戏'],
        ['Board Game', '桌游'],
        ['Breakout', '打砖块'],
        ['Card Game', '纸牌游戏'],
        ['City-Building', '建造游戏'],
        ['Compilation', '合集'],
        ['Educational', '教育游戏'],
        ['Fighting', '格斗游戏'],
        ['Fitness', '健身游戏'],
        ['Flight', '飞行模拟'],
        ['Full Motion Video (FMV)', '全动态视频'],
        ['Hack and Slash', '砍杀类游戏'],
        ['Hidden Object', '寻物类游戏'],
        ['Horror', '恐怖类游戏'],
        ['Interactive Art', '交互艺术游戏'],
        ['Management', '经营类游戏'],
        ['Music/Rhythm', '音游'],
        ['Open World', '开放世界游戏'],
        ['Party', '派对游戏'],
        ['Pinball', '弹珠类游戏'],
        ['Platform', '平台跳跃'],
        ['Puzzle', '解密游戏'],
        ['Racing/Driving', '赛车游戏'],
        ['Roguelike', 'roguelike游戏'],
        ['Role-Playing', '角色扮演游戏'],
        ['Sandbox', '沙盒游戏'],
        ['Shooter', '射击游戏'],
        ['Simulation', '模拟类游戏'],
        ['Social', '社交类游戏'],
        ['Sports', '体育类游戏'],
        ['Stealth', '隐蔽类游戏'],
        ['Strategy/Tactical', '策略游戏'],
        ['Survival', '生存游戏'],
        ['Tower Defense', '塔防游戏'],
        ['Trivia', '问答游戏'],
        ['Vehicular Combat', '车辆战斗'],
        ['Visual Novel', '视觉小说'],


//        ['\Reviews', '点评'],
    ])

    replaceText(document.body)
//   |

    const bodyObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(addedNode => replaceText(addedNode))
      })
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    function replaceText(node) {
      nodeForEach(node).forEach(htmlnode => {
        i18n.forEach((value, index) => {
          // includes可直接使用 === 以提高匹配精度
          const textReg = new RegExp(index, 'g')
          if (htmlnode.nodeType === Node.TEXT_NODE && htmlnode.wholeText.includes(index)){
			if (htmlnode.wholeText == htmlnode.nodeValue) {
			  htmlnode.nodeValue = htmlnode.wholeText.replace(textReg, value)
			} else {
			  if (htmlnode.parentNode){
                htmlnode.parentNode.textContent = htmlnode.wholeText.replace(textReg, value)
			  }
			}

		  }
          else if (htmlnode instanceof HTMLInputElement && htmlnode.value.includes(index))
            htmlnode.value = htmlnode.value.replace(textReg, value)
        })
      })
    }

    function nodeForEach(node) {
      const list = []
      if (node.childNodes.length === 0) list.push(node)
      else {
        node.childNodes.forEach(child => {
          if (child.childNodes.length === 0) list.push(child)
          else list.push(...nodeForEach(child))
        })
      }
      return list
    }
})();