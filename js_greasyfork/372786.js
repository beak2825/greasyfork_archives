// ==UserScript==
// @name         epicgames官網中文化
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  可以讓epicgames官網中文化的代碼!
// @author       蕃茄狼&犬嵐
// @match        *://*.epicgames.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/372786/epicgames%E5%AE%98%E7%B6%B2%E4%B8%AD%E6%96%87%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/372786/epicgames%E5%AE%98%E7%B6%B2%E4%B8%AD%E6%96%87%E5%8C%96.meta.js
// ==/UserScript==
'use strict'

const i18n = new Map([

        ['Play Free Now', '免費遊玩'],
        ['Android Beta', 'Android 測試'],
        ['Learn More', '了解更多'],
        ['Download', '下載'],
        ['Darkness', '黑暗'],
        ['Rises', '崛起'],
        ['How do you get the Battle Pass?', '如何拿到Battle Pass?'],
        ['Get Fortnite', '取得要塞英雄'],
        ['Now - Dec 6', '現在 - 12月6日'],
        ['100 tiers, 100 rewards. Still 950 V-Bucks!', '100等級, 100個獎勵. 只要 950V幣!'],
        ['Play Battle Royale. Level Up. Unlock Epic Loot.', '遊玩大逃殺、升級、解開傳說道具!'],
        ['Battle Pass', '通行證'],
        ['Darkness Rises in Season 6! The more you play, the more rewards you unlock. Level up faster by completing Weekly Challenges to unlock additional rewards like progressive outfits, Pets and exclusive cosmetics.', '在第六季，黑暗勢力崛起!玩得越多，獎勵越豐厚! 經由完成每週任務來解鎖額外的特別造型、寵物、特別裝扮!'],
        ['BUY IN-GAME FOR 950 V-BUCKS', '在遊戲內購買只要 950 V幣'],
        ['Battle Bundle', '通行證組合包'],
        ['Battle Pass + 25 Tiers', '通行證+ 額外25階級'],
        ['Includes access to the Battle Pass and instantly unlocks your next 25 tiers, all at a 40% discount.', '以6折的優惠價，購買一張通行證並且立即解鎖接下來的25個階級!'],
        ['BUY IN-GAME FOR 2,800 V-BUCKS', '在遊戲內購買只要 2,800 V幣'],
        ['Play to level up your Battle Pass, unlocking over 100 rewards worth over 25,000 V-Bucks (typically takes 75 to 150 hours of play).', '完成遊戲來升級的你的通行證，解鎖價值超過25,000 V-Bucks的獎勵!(遊玩時間大約花費75-150小時)'],
        ['Want it all faster? You can buy up to 100 tiers, each for 150 V-Bucks!', '想要贏人一步嗎? 你可以以每一階級150 V-Bucks 來快速解鎖至100階級'],
        ['New this Season: Pets!', '新一季:寵物!'],
        ['Level up your Battle Pass to unlock Bonesy, Scales, and Camo, new critters that will join you on your journey across the map. These passive companions are always by your side - reacting to different situations you find yourself in.', '升級你的通行證來獲得 Bonesy , Scales, and Camo! 這些寵物可以陪伴你寵盪地圖! 這些小夥伴會隨時待在你的身旁- 在不同的狀況下，會表現出不一樣的動作! '],
        ['Check out all the', '查看全部的'],
        ['Loot!', '戰利品'],
        ['Playing', '搭配'],
        ['with', ''],
        ['the', '通'],
        ['Battle', '行'],
        ['Pass', '證遊玩'],
        ['you', '你'],
        ['can', '可以'],
        ['earn:', '得到'],
        ['Unlock 25 additional tiers with purchase of the Battle Bundle', '購買通行證組合包可以立即解鎖額外的25階級!'],
        ['Instantly unlocks with purchase of the Battle Pass (Worth over 3,500 V-Bucks)', '馬上解鎖通關禮包來獲得額外25階級!(價值超過3500 V-bucks)'],
        ['Playing For Free', '現在免費'],
        ['Everyone Can Earn:', '全部人都可以獲得:'],
        ['Jump', '來'],
        ['In!', '吧!'],
        ['Jump into Fortnite Battle Royale and head to the Battle Pass tab. Use those shiny V-Bucks and boom, the spoils of victory await. Need More V-Bucks? Buy some from the STORE tab.', '加入要塞英雄大逃殺，點選通行證按鈕，用那些閃亮的 V-bucks! BOOM! 那些戰利品正在等著你! 需要更多的V-bucks? 前往商店頁面瞧一瞧吧! '],
        ['Check it out!', '展開更多!'],
        ['Click the video to see more!', '點影片看更多!'],
        ['FAQs', 'FAQs'],
        ['How do I buy the Battle Pass?', '我要怎麼買通行證?'],
        ['Launch Fortnite', '啟動要塞英雄'],
        ['Select Battle Royale', '選擇大逃殺'],
        ['Navigate to the Battle Pass Tab', '點選通行證'],
        ['Purchase ', '付款'],
        ['either', '選擇'],
        [' the Battle Pass or the Battle Bundle', '通行證或通行證組合包'],
        ['What if I buy the Battle Pass late in the season?', '如果我在很晚的時候才購買通行證怎麼辦?'],
        ['You will receive all of the rewards up to your current level, retroactively!', '會根據你現在的等級，給予你應得的獎勵!'],
        ['Do I keep my Battle Pass rewards after the Season ends?', '在這季結束以後，我還可以保留我的通行證獎勵嗎?'],
        ['Yes! You keep every Battle Pass cosmetic earned each season.', '可以!你可以永久保留任何一個通行證所獲得的獎勵!'],
['Free', '免費'],
['More Details Below', '更多細節如下'],
['Battle Royale', '大逃殺'],
['PvE Campaign', 'PVE 合作模式'],
['Standard Edition', '標準版'],
['Deluxe Edition', '豪華版'],
['Super Deluxe Edition', '超級豪華版'],
['Limited Edition', '限量版'],
['The Battle Is Building!', '建築就是戰鬥!'],
['Save the World not available on Nintendo Switch or Mobile devices.', '拯救世界在Nintendo Switch或手機裝置上不可使用'],
['Fortnite Battle Royale is the FREE 100-player PvP mode in Fortnite. One giant map. A battle bus. Fortnite building skills and destructible environments combined with intense PvP combat. The last one standing wins. Available on PC, PlayStation 4, Xbox One, Nintendo Switch, Android, iOS & Mac.', '要塞英雄-大逃殺模式是完全免費的100人PVP模式，一張巨型地圖，一輛公車。在要塞英雄中，利用你的建築技巧、蒐集周圍的物資來進行這場刺激的PVP對戰。最後活下來的獲勝! 可在 PC, PlayStation 4, Xbox One, Nintendo Switch, Android, iOS & Mac遊玩'],
['Play Free', '免費遊玩'],
['Pinata Packs', 'Pinata禮包'],
['Daily Loot Pinata Packs', '每日Pinata禮包'],
['Exclusive Founder’s Loot Pinata Packs', '限定贊助者Pinata禮包'],
['4 In-Game Banner Icons', '4 個遊戲內旗幟圖案'],
['Personalize your account with 4 exclusive banners to show off on your profile.', '客製化你的個人旗幟來向朋友炫耀!'],
['Take Back The World!', '奪回世界!'],
['Jump into the Early Access season today!', '現在加入早期登入版本!'],
['Buy Now', '現在購買'],
['Rare Starter Weapon Pack', '稀有的武器禮包'],
['Whether you’re fond of mowing down Husks at range or getting up close and personal, this pack has all the weapon schematics you’ll need to succeed.', '不管你是喜歡一次用近戰武器打倒成群的Husks，又或是在遠方用武器清除他們，這個禮包的設計圖紙可以輕鬆讓你完成任務'],
['Exclusive Founder’s Pistol', '限定的贊助者手槍!'],
['As an exclusive Founder’s benefit, you’ll receive the Revolt pistol schematic. It’s able to fire very rapidly with a large magazine and decent accuracy thanks to a laser sight. Everyone needs a trusty sidearm. ', '一把屬於贊助者才有的特別武器! 你可以獲得Revolt 手槍的設計圖紙，大容量的彈夾配、高速的射速配上雷射瞄準器提供優良的準度。大家都會需要一個可靠的助手'],
['Starter Hero Pack', '基礎英雄禮包'],
['Start off with eight powerful Heroes, two from each class to show the Husk that you mean business.', '一次擁有8位強力的英雄，每個職業包含2種不一樣的英雄，用來教訓那些Husks吧!'],
['Immediate Loot Pinata Packs', '可立即打開的Pinata包'],
['50 Extra \nVault Inventory Slots', '50格額外的儲物室'],
['10 In-Game Banner Icons', '10個遊戲內旗幟圖案'],
['Personalize your account with 10 exclusive banners to show off on your profile.', '客製化你的個人旗幟來向朋友炫耀'],
['10 Xp Boosts \nFor You', '10個 經驗加速器'],
['Build up your arsenal of powerful Heroes faster with these XP boosts.', '用這些經驗加速器，讓你的英雄快速升級，變得更加強大'],
['10 Xp Boosts \nTo Share', '10個 給朋友的經驗加速器'],
['Share the love with your friends with these giftable XP boosts.', '與你的朋友分享愛!把這些可送禮的經驗加速去分享給朋友'],
['15 In-Game Banner Icons', '15 個遊戲內旗幟圖案'],
['Personalize your account with 15 exclusive banners to show off on your profile.', '客製化你的個人旗幟來向朋友炫耀!'],
['20 Xp Boosts \nFor You', '20個 經驗加速器'],
['20 Xp Boosts \nTo Share', '20個 給朋友的經驗加速器'],
['Exclusive Legendary Hero Pack', '特選的傳說英雄禮包'],
['Pick your favorite class to receive a pack of two powerful Legendary Heroes and a Legendary weapon for that class.', '根據你喜歡的職業，選擇兩位傳說的英雄、還有傳說的武器給他們使用'],
['Troll Stash Llamas', '巨魔寶藏駱馬!'],
['200 Extra \nVault Inventory Slots', '200格額外的儲物室'],
['10 Extra Backpack \nInventory Slots', '10格額外的背包空間'],
['20 In-Game Banner Icons', '20 個遊戲內旗幟圖案'],
['Personalize your account with 20 exclusive banners to show off on your profile.', '客製化你的個人旗幟來向朋友炫耀!'],
['Sign Up for Fortnite News', '登入來看更多要塞英雄的新聞'],
['Exclusive Founder’s Loot Pinata Packs', '限定贊助者的Pinata禮包'],
['Rare Starter Hero Pack (8 Heroes)', '稀有的基礎英雄禮包'],
['5 Troll Stash Llamas', '5個巨魔寶藏駱馬'],
['2 Exclusive Legendary Heroes', '2個特選的英雄'],
['A $100.00 value!', '價值$100.00!'],
['A $180.00 value!', '價值$180.00!'],
['A $350.00 value!', '價值$350.00!'],
['includes', '包含'],
['Watch', '觀看'],
['News', '新聞'],
['Forums', '論壇'],
['Help', '幫助'],
['You may need to store Survivors, event tickets, and schematics between missions. Extra vault inventory slots will help you build up your arsenal faster.', '你會完成任務來收集一些倖存者、活動票券、還有武器圖紙。更多的金庫儲物空間可以幫助你更快速的建造你的軍火庫。'],
['100 Extra \nVault Inventory Slots', '100格額外的儲物室'],
['10 Troll Stash Llamas', '10個巨魔寶藏駱馬'],
['Take your backpack into the heat of battle knowing that you have 10 extra slots for guns or swords or traps or life-giving bacons.', '抓好你的背包，加入火熱的戰場中，擁有額外得10格背包空間可以讓你收藏武器或大劍，甚至是陷阱或是生命補血器!'],


    ])

    const alertbak = window.alert.bind(window)
window.alert = (message) => {
  if (i18n.has(message)) message = i18n.get(message)
  return alertbak(message)
}
const confirmbak = window.confirm.bind(window)
window.confirm = (message) => {
  if (i18n.has(message)) message = i18n.get(message)
  return confirmbak(message)
}
const promptbak = window.prompt.bind(window)
window.prompt = (message, _default) => {
  if (i18n.has(message)) message = i18n.get(message)
  return promptbak(message, _default)
}

replaceText(document.body)

const bodyObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(addedNode => replaceText(addedNode))
  })
})
bodyObserver.observe(document.body, { childList: true, subtree: true })

function replaceText(node) {
  nodeForEach(node).forEach(textNode => {
    if (textNode instanceof Text && i18n.has(textNode.nodeValue))
      textNode.nodeValue = i18n.get(textNode.nodeValue)
    else if (textNode instanceof HTMLInputElement) {
      if (textNode.type === 'button' && i18n.has(textNode.value))
        textNode.value = i18n.get(textNode.value)
      else if (textNode.type === 'text' && i18n.has(textNode.placeholder))
        textNode.placeholder = i18n.get(textNode.placeholder)
    }
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

    (function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
	console.log('font');
    addStyle('* {font-family :Microsoft JhengHei;}');
})();
  return list
}