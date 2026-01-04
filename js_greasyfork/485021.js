// ==UserScript==
// @name        PTCG-SIM汉化
// @match       *://*ptcgsim.online/*
// @grant       none
// @version     1.3.5
// @author      akatsukikyoko
// @description 宝可梦卡牌模拟器PTCG-SIM（https://ptcgsim.online）的简单汉化工具
// @license MIT
// @namespace Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/485021/PTCG-SIM%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/485021/PTCG-SIM%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

  var allNodes = document.body.querySelectorAll('*')

  var allNodeArr = Array.from(allNodes)

  var textObj = {

    //功能
    "Attack": "招式",
    "Pass": "跳过",
    "Set Up": "开始",
    "Reset": "重开",
    "Set Up Both": "双方开始",
    "Reset Both": "双方重开",
    "+Turn":"+回合",
    "Coin":"硬币",
    "Options":"设置",
    "Online Multiplayer Mode":"在线多人模式",
    "Generate":"建房",
    " Join Room ":"加入房间",
    "Import":"导入",
    "Settings":"设置",
    "Dark mode":"深色模式",
    "Hide containers":"隐藏分区",
    "Watch Tutorial":"查看教程",
    "Upload File":"文件上传",
    "Change Card Back":"更换卡背",
    //介绍文本
    "Welcome to PTCG-sim!":"欢迎来到PTCG-sim！",
    //说明
    "Move card...":"移动卡牌",
    "to Hand ":"到手牌",
    "to Discard ":"到弃牌区",
    "to Bench ":"到备战区",
    "to Active ":"到战斗场",
    "to Stadium ":"到竞技场",
    "to Lost Zone ":"到放逐区",
    "to Prizes ":"到奖赏卡区",
    "to Board ":"到展示区",
    "to Deck (top) ":"到牌库（顶端）",
    "to Deck (bottom) ":"到牌库（底）",
    "to Deck (switch) ":"到牌库（任意）",
    "to Deck (shuffle)":"到牌库（洗牌）",
    "Shuffle deck":"洗切牌库",
    "View top card(s)":"看牌库顶",
    "View bottom card(s)":"看牌库底",
    "View":"查看",
    "Hand":"手牌",
    "Discard hand":"丢弃手牌",
    "Shuffle hand into deck ":"洗回牌库",
    "Shuffle hand to bottom ":"洗切手牌并放到牌库底",
    "Playboard":"玩家展示区",
    "Discard all":"丢弃全部",
    "Move all to hand":"全部加入手牌",
    "Shuffle all into deck":"全部洗回牌库",
    "Card actions":"卡牌操作",
    "Attach ":"附加",
    "Evolve ":"进化",
    "View ":"查看",
    "Toggle ability/Use stadium":"发动特性/使用竞技场",
    "Damage counter":"伤害指示物",
    "Increase ":"增加",
    "Decrease ":"减少",
    "Remove ":"移除",
    "Special condition":"特殊状态",
    "Add/Toggle":"增加/标记",
    "Remoce":"移除",
    "Rotate card(s)":"旋转卡片",
    "Rotate Pokémon BREAK ":"旋转宝可梦BREAK",
    "Look/cover card (only yourself)":"查看/覆盖卡牌（只有自己）",
    "Hide card (both players)":"覆盖卡牌（双方都看不到）",
    "Reveal card (both players)":"翻开卡牌（双方）",
    "Put face-down card in active":"将卡牌反面朝上移入战斗场",
    "Change type...":"改变类型",
    "to Tool ":"为道具",
    "to Energy ":"为能量",
    "to Pokémon ":"为宝可梦",
    "General ":"通用",
    "Set up ":"开始",
    "Reset ":"重开",
    "Start turn ":"回合开始",
    "Flip coin ":"硬币",
    "Flip board ":"换向",
    "Announce mulligan ":"重抽（开始阶段无基础）",
    "Close popups ":"关闭弹窗",
    "Toggle ability/effect":"使用特性/效果",
    "Reveal/hide card":"翻开/盖住卡牌",
    //二级菜单
    "Clear battle log":"清理战斗记录",
    "Export battle log":"导出战斗记录",
    "Confirm":"确认",
    "Undo":"撤销",
    "Cancel":"取消",
    "Save":"保存",
    "Shuffle deck":"洗牌",
    "Draw card(s)":"摸牌（复数）",
    "View top card(s)":"查看牌库顶的牌（复数）",
    "View bottom card(s)":"查看牌库底的牌（复数）",
    "Move card... ":"移动卡牌...",
    "to Hand":"到手牌",
    "to Discard":"到弃牌区",
    "to Bench":"到备战区",
    "to Active":"到战斗场",
    "to Stadium":"到竞技场",
    "to Lost Zone":"到放逐区",
    "to Prizes":"到奖赏卡区",
    "to Board":"到展示区",
    "to Deck (top)":"到牌库（顶端）",
    "to Deck (bottom)":"到牌库（底）",
    "to Deck (switch)":"到牌库（任意）",
    "to Deck (shuffle)":"到牌库（洗牌）",
    "Change type...\n":"改变类型",
    "to Energy":"能量",
    "to Tool":"道具",
    "to Pokémon":"宝可梦",
    "Hand":"手牌",
    "Prizes":"奖赏卡",
    "Deck":"牌库",
    "Playboard":"展示区",
    "Toggle ability/effect":"标记特性/效果使用",
    "Damage counter":"伤害指示物",
    "Shuffle prizes":"洗切奖赏卡",
    "Reveal/hide prizes":"展示/隐藏奖赏卡",
    "Look/cover prizes":"查看/盖上奖赏卡（自己）",
    "Move card...":"移动卡牌...",
    "Discard hand":"丢弃手牌",
    "Shuffle hand into deck":"手牌洗入牌库",
    "Shuffle hand to bottom":"手牌洗入牌堆底",
    "Reveal/hide hand":"展示/隐藏手牌",
    "Reveal/hide random card":"展示/隐藏随机卡牌",
    "Special condition":"特殊状态",
    "Add/Toggle ":"增加标记",
    "Rotate BREAK ":"旋转BREAK",
    "Undo ":"撤销",


    //Other
    "Shuffle":"洗牌",
    "Close":"关闭",
    "Shuffle all to Deck":"全部洗回牌库",
    "Sort":"排序",
    "Discard all":"全部丢弃",
    "Shuffle all":"全部洗回牌库",
    "Lost Zone all":"全部放逐",
    'Shuffle to bottom':'洗入牌堆底',
    "To Hand":"加入手牌",
    "Leave in play":"退出",
    "Looking at cards...":"查看卡牌",
    "Move attached cards":"移动附上的卡牌",
    "Alt (1P only)":"单人模式对手卡组",
    "Main":"主卡组",
    "Spectator mode":"观战模式",
    "Hide opponent's hand (1P mode)":"隐藏1p玩家手牌（1p模式）",

  }

  let chatboxContent;
  let chatboxContent_group;
  let intervalId = setInterval(function() {
    try{
    chatboxContent_group = document.querySelectorAll('p.self-text, p.announcement, p.opp-text');
    //console.log(chatboxContent_group);
    for (let i=0;i<chatboxContent_group.length;i++){
      if(i>chatboxContent_group.length-15){
        chatboxContent=chatboxContent_group[i].innerText;
        //简介
        chatboxContent = chatboxContent.replace('PTCG-sim is an', ' PTCG-sim是一个');
        chatboxContent = chatboxContent.replace('open-source', '开源');
        chatboxContent = chatboxContent.replace(' tool to simulate card games. It supports single player and online multiplayer.', '的卡牌游戏模拟工具，它支持单人模式或双人在线模式');
        chatboxContent = chatboxContent.replace('Import your decklist by clicking the “Import” tab above, then press “Set Up” to start a game.', '用 导入 菜单导入你的卡组，然后按 开始 来开始游戏');
        chatboxContent = chatboxContent.replace('Drag or use keybinds (hold ', ' 长按');
        chatboxContent = chatboxContent.replace(') to move cards. Happy testing!', '确认移动卡牌的快捷键，祝您测试愉快');

        //翻译
        chatboxContent = chatboxContent.replace(/ put/g, ' 将');
        chatboxContent = chatboxContent.replace(/ lost-zoned/g, ' 放逐了');
        chatboxContent = chatboxContent.replace(/ moved/g, ' 移动');
        chatboxContent = chatboxContent.replace(/ move/g, '  移动');
        chatboxContent = chatboxContent.replace(/ tails/g, ' 反面');
        chatboxContent = chatboxContent.replace(/ heads/g, ' 正面');
        chatboxContent = chatboxContent.replace(/ flipped/g, ' 投出了');
        chatboxContent = chatboxContent.replace(/ attacked/g, ' 使用招式');
        chatboxContent = chatboxContent.replace(/ passed/g, ' 回合结束');
        chatboxContent = chatboxContent.replace(/ deck/g, ' 牌库');
        chatboxContent = chatboxContent.replace(/ discard/g, ' 弃牌区');
        chatboxContent = chatboxContent.replace(/ stadium/g, ' 竞技场');
        chatboxContent = chatboxContent.replace(/ hand/g, ' 手牌');
        chatboxContent = chatboxContent.replace(/ in to/g, ' 到');
        chatboxContent = chatboxContent.replace(/ card(s)/g, ' 卡牌');
        chatboxContent = chatboxContent.replace(/ stopped/g, ' 停止');
        chatboxContent = chatboxContent.replace(/ card/g, ' 卡牌');
        chatboxContent = chatboxContent.replace(/ shuffled /g, ' 洗切');
        chatboxContent = chatboxContent.replace(/ lost zone/g, ' 放逐区');
        chatboxContent = chatboxContent.replace(/ prizes/g, ' 奖赏卡');
        chatboxContent = chatboxContent.replace(/ bench/g, ' 备战区');
        chatboxContent = chatboxContent.replace(/ board/g, ' 展示区');
        chatboxContent = chatboxContent.replace(/ drew for turn/g, ' 回合开始抽牌');
        chatboxContent = chatboxContent.replace(/ attached/g, ' 附上');
        chatboxContent = chatboxContent.replace(/ looked at /g, ' 查看了');
        chatboxContent = chatboxContent.replace(/ of /g, '');
        chatboxContent = chatboxContent.replace(/ card /g, ' 卡牌');
        chatboxContent = chatboxContent.replace(/ top /g, ' 在上方的');
        chatboxContent = chatboxContent.replace(/ in to /g, ' 加入');
        chatboxContent = chatboxContent.replace(/ setup/g, ' 开始');
        chatboxContent = chatboxContent.replace(/ hid /g, ' 隐藏了');
        chatboxContent = chatboxContent.replace(/ evolved/g, ' 进化');
        chatboxContent = chatboxContent.replace(/ drew/g, ' 抽');
        chatboxContent = chatboxContent.replace(/ bottom/g, ' 底下');
        chatboxContent = chatboxContent.replace(/ and/g, ' 并');
        chatboxContent = chatboxContent.replace(/ their/g, ' 他的');
        chatboxContent = chatboxContent.replace(/ used/g, ' 使用了');
        chatboxContent = chatboxContent.replace(/ ability/g, ' 特性');
        chatboxContent = chatboxContent.replace(/ into/g, ' 到');
        chatboxContent = chatboxContent.replace(/ revealed /g, ' 翻开');
        chatboxContent = chatboxContent.replace(/ in /g, ' 在');
        chatboxContent = chatboxContent.replace(/Blue /g, '蓝色方 ');
        chatboxContent = chatboxContent.replace(/Red /g, '红色方 ');
        chatboxContent = chatboxContent.replace(/ active/g, ' 战斗场');
        chatboxContent = chatboxContent.replace(/ to /g, '->');
        chatboxContent = chatboxContent.replace(/ took back /g, ' 撤回了 ');
        chatboxContent = chatboxContent.replace(/ last /g, ' 最后的 ');
        chatboxContent = chatboxContent.replace(/ imported/g, ' 导入了');
        chatboxContent = chatboxContent.replace(/ has no more /g, ' 没有更多的');
        chatboxContent = chatboxContent.replace(/ has an invalid /g, ' 无效');
        chatboxContent = chatboxContent.replace(/ is looking through/g, ' 在查看');
        chatboxContent = chatboxContent.replace(/ looking at/g, ' 查看');
        chatboxContent = chatboxContent.replace('from', ' | ');


        //二次润色
        chatboxContent = chatboxContent.replace(' 卡牌(s)', ' 张卡牌');
        chatboxContent = chatboxContent.replace(' 弃牌区ed', ' 丢弃了');
        chatboxContent = chatboxContent.replace('卡牌牌库', ' 牌库中的卡牌');
        chatboxContent = chatboxContent.replace('Blue的', '蓝色方的');
        chatboxContent = chatboxContent.replace('Red的', '红色方的');
        chatboxContent = chatboxContent.replace(' starting', ' 起始的');
        chatboxContent = chatboxContent.replace(' set', ' 设置');
        chatboxContent = chatboxContent.replace('底下牌库', '牌库底');
        chatboxContent = chatboxContent.replace('top ', '顶端的 ');
        chatboxContent = chatboxContent.replace('bottom ', '底端的 ');
        chatboxContent = chatboxContent.replace("'s", ' 的');
        chatboxContent = chatboxContent.replace('附上 张卡牌', '张附加的卡片');
        chatboxContent = chatboxContent.replace('洗切prizes', '洗切奖赏卡');

        chatboxContent_group[i].innerText = chatboxContent;
        }
    }
    }catch (error) {
         console.error('Error occurred while monitoring chatbox content:', error);
    }
  }, 2000); // 每2秒执行一次

  var excutNode = ['IMG','BR','HR','FORM','SELECT','OPTION','INPUT','SCRIPT','STYLE','ts']

  console.time('translate')
  allNodeArr.forEach(item=>{
      if (item.childNodes && !excutNode.includes(item.nodeName)) {
          item.childNodes.forEach(item => {
              if(item.nodeName === '#text'){
                  var text = textObj[item.data]
                  if(text){
                      item.data = text
                  }

              }
          })
      }
  })
console.timeEnd('translate');
try{
const settingsTogglesElement = document.getElementById('settingsToggles');
const linkElement = document.createElement('a');
linkElement.href = 'http://himesakazone.cc:4600/deck';
linkElement.textContent = '一键导入繁中、日版卡组'; // 你可以自定义这里的文本
// 将超链接添加到settingsTogglesElement中
settingsTogglesElement.appendChild(linkElement);
}catch{
}