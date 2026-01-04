// ==UserScript==
// @name         泰坦神器汉化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.sacro.tw/tt2/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421672/%E6%B3%B0%E5%9D%A6%E7%A5%9E%E5%99%A8%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/421672/%E6%B3%B0%E5%9D%A6%E7%A5%9E%E5%99%A8%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
   const mapData = {
       '闇影之書': '暗影之书',
       '復仇誓言': '复仇誓言',
       '瓦魯涅斯之石': '瓦如恩之石',
       '富足寶箱': '满足宝箱',
       '英雄護盾': '英勇之盾',
       '預言之書': '预言之书',
       '克里索斯之碗': '点金之碗',
       '札金索斯的金幣': '扎金索斯银币',
       '偉大精靈徽章': '崇高仙子徽章',
       '招財貓雕塑': '招财猫像',
       '惠比壽的金幣': '财神金币',
       '古銅色羅盤': '金币罗盘',
       '歷戰牌堆': '历战牌堆',
       '獨奏者長笛': '独奏长笛',
       '神聖之劍': '天堂之剑',
       '神之制裁': '神圣报应',
       '醉酒之錘': '醉汉榔头',
       '薩摩賽克之劍': '萨摩赛克之剑',
       '復仇者': '复仇者',
       '斯特夫的安定': '宁静之剑',
       '英雄之刃': '英雄之刃',
       '風暴之劍': '风暴之剑',
       '復仇女神之弓': '复仇女神之弓',
       '遠古護身符': '古代护身符',
       '迷你世界樹': '泰坦树苗',
       '埃爾密斯頭盔': '飞毛头盔',
       '伊甸之果': '伊甸之果',
       '權勢藥水': '感化灵药',
       '奧萊恩護身符': '星辰吊链',
       '風暴之心': '风暴之心',
       '阿波羅寶珠': '太阳神之石',
       '黏黏果實': '黏黏果实',
       '冥王寶珠': '冥王宝珠',
       '波爾塔拉的耳環': '圣殿耳环',
       '猛禽羽毛': '仙鸟之羽',
       '汙染符文之心': '腐化符文之心',
       '迪朗達爾之劍': '迪朗达尔之剑',
       '冥界遺骸': '冥界头骨',
       '誓言的重擔': '永守誓言',
       '星座之冠': '群星王冠',
       '妖精王后之杖': '仙后法杖',
       '費金的護手': '蛊惑手套',
       '卡利斯托指環': '卡利斯托之戒',
       '達摩克勒斯之刃': '达摩克利斯之戒',
       '瘋狂頭盔': '疯狂头盔',
       '鈦金裝甲': '钛钢镀饰',
       '月光手鍊': '月光手镯',
       '紫晶之杖': '紫晶之杖',
       '皇家聖劍': '皇家圣剑',
       '精神守夜者': '精神守夜者',
       '鈷藍鎧甲': '钴蓝铠甲',
       '審判印記': '审判印记',
       '守護者的葉子': '守护者的叶子',
       '侵略者號角': '入侵者的海姆达尔之角',
       '泰坦面具': '巨人面具',
       '皇家毒藥': '皇家毒物',
       '工人吊飾': '工人垂饰',
       '諸神黃昏執行者': '诸神黄昏使者',
       '遠見文稿': '预知羊皮纸',
       '伊甸靈藥': '伊甸灵药',
       '急速沙漏': '急躁沙漏',
       '幽靈鐘錶': '幻影时钟',
       '禁忌卷軸': '禁忌卷轴',
       '忠誠之戒': '效忠指环',
       '冰河之斧': '冰川之斧',
       '神盾': '神盾',
       '沼澤臂鎧': '沼泽手套',
       '無限鐘擺': '无限摆锤',
       '熊掌手套': '大熊手套',
       '泰坦長矛': '巨人之矛',
       '橡木之杖': '橡木杖',
       '奧秘斗篷': '奥秘斗篷',
       '獵人藥膏': '猎人药膏',
       '眾神靈藥': '仙馔密酒',
       '神秘法杖': '神秘权杖',
       '仙豆': '仙人魔豆',
       '幸運之蛋': '幸运之卵',
       '神聖酒杯': '圣杯',
       '入侵者之盾': '入侵者之盾',
       '死亡之斧': '死亡之斧',
       '神狐精華': '仙狐精华',
       '赫耳墨斯之靴': '飞毛靴子',
       '無限手套': '释能护手',
       '精靈王的垂飾': '仙王项链',
       '幸運的兔子腳': '幸运兔脚',
       '失落的王者面具': '亡君面具',
       '光芒之杖': '光辉之杖',
       '莫格萊之劍': '重剑无锋',
       '打磨砥石': '打磨砥石',
       '歷史鵝毛筆': '',
       '老國王的印鑑': '老国王的印鉴',
       '大師之劍': '大师之剑',
       '宏觀宇宙儀': '能量倍增',
       '弗格斯的財寶': '金币倍增',
       '白矮星之槌': '矮人重锤',
       '阿拉姆之矛': '亚兰之矛',
       '黑暗守衛': '暗黑守卫',
   }


   // 列表
   const artifacts = document.querySelector('#artifacts')
   const spans = artifacts.querySelectorAll('label span.d-sm-block')
   for (const index in spans) {
       const text = spans[index].innerHTML
       if (!text || !mapData[text]) continue
       spans[index].innerHTML = mapData[text]
   }


   // 圣物计算
    const generateRelicUpdates = document.querySelector('#generateRelicUpdates')
    console.log(generateRelicUpdates)
    generateRelicUpdates.addEventListener('click', function() {
        setTimeout(function() {
            const suggestions = document.querySelector('#suggestions')
            const lis = suggestions.querySelectorAll('li.mb-2>span:first-child')
            for (const index in lis) {
                const text = lis[index].innerHTML
                if (!text || !mapData[text]) continue
                lis[index].innerHTML = mapData[text]
            }
        }, 300)
    })

})();
