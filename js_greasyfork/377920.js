// ==UserScript==
// @name              空洞骑士BINGO助手
// @namespace         https://github.com/Magaius/HKBingoAss.git
// @version           0.0.7
// @icon              https://greasyfork.org/system/screenshots/screenshots/000/014/163/thumb/images.png
// @description       2019-02-20 一键翻译脚本
// @author            elderFish
// @supportURL        https://github.com/Magaius/HKBingoAss/issues
// @match             *://www.bingosync.com/room/*
// @match             *://bingosync.com/room/*
// @run-at            document-end
// @grant             unsafeWindow
// @grant             GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/377920/%E7%A9%BA%E6%B4%9E%E9%AA%91%E5%A3%ABBINGO%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/377920/%E7%A9%BA%E6%B4%9E%E9%AA%91%E5%A3%ABBINGO%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


$(document).ready(function () {
  var targetDom = $('#bingo-chat').closest('.panel').children('.panel-heading');
  var trsBtn = '<span id="hkbingoAssBtn" class="btn btn-default btn-xs pull-right collapse-button" data-lang="cn">显示中文</span>';

  var rollTranslate = {
    "Abyss Shriek": "黑吼",
    "All Grubs: Greenpath (4) + Fungal (2)": "虫子：苍绿4+真菌2",
    "Break the 420 geo rock in Kingdom's Edge": "王国边境420大钱堆",
    "Broken Vessel": "残破容器",
    "Buy 6 maps": "买6地图",
    "Buy 7 map pins from Iselda (All but one)": "买7地图图标",
    "Collect 1 Arcane Egg": "1个黑蛋",
    "Collect 3 King's Idols": "3个国王雕像",
    "Collect 500 essence": "500精华",
    "Collector": "收藏家",
    "Colosseum 1": "竞技场1",
    "Colosseum 2": "竞技场2",
    "Complete 3 full dream trees": "砍3棵梦树",
    "Crystal Guardian 1": "激光哥1",
    "Crystal Heart": "超冲",
    "Cyclone Slash": "旋风斩",
    "Dash Slash": "冲刺斩",
    "Deep Focus + Quick Focus": "深度聚集+快速聚集",
    "Defeat Colosseum Zote": "打败竞技场左特",
    "Descending Dark": "黑砸",
    "Desolate Dive": "白砸",
    "Dream Gate": "梦门",
    "Dream Nail": "梦钉",
    "Dream Wielder": "舞梦",
    "Dung Defender": "芬达",
    "Elder Hu": "胡长老",
    "Failed Champion": "失败冠军",
    "False Knight + Brooding Mawlek": "假骑士+电饭煲",
    "Flukemarm": "虫母",
    "Flukenest": "喷子",
    "Fragile Heart, Greed, and Strength": "易碎3件套",
    "Galien": "加利安",
    "Give Flower to Elderbug": "送花给村长",
    "Glowing Womb + Grimmchild": "子宫+格林之子",
    "Goam and Garpede Journal Entries": "十字路伸缩虫+深巢大蜈蚣图鉴",
    "Gorb": "戈布",
    "Great Slash": "蓄力斩",
    "Grimm": "格林",
    "Grubsong": "虫歌",
    "Have 1500 geo in the bank": "银行存1500不取出来",
    "Have 2 Pale Ore": "持有2矿石",
    "Have 4 Rancid Eggs": "持有4臭蛋",
    "Have 5 Hallownest Seals": "持有5印章",
    "Have 5 Wanderer's Journals": "持有5日记",
    "Heavy Blow + Steady Body": "沉重之击+稳定之体",
    "Herrah": "野兽",
    "Hiveblood": "蜂巢血",
    "Hornet 2": "小姐姐2",
    "Howling Wraiths": "白吼",
    "Interact with 5 Cornifer locations": "绘图师/磁带5处对话",
    "Isma's Tear": "酸泪",
    "Kill 2 Soul Warriors": "杀2魂守",
    "Kill 4 Mimics": "杀4假虫",
    "Kill 6 different Stalking Devouts": "杀6不同镰刀虫",
    "Kill Myla": "杀米拉",
    "Kill your shade in Jiji's Hut": "杀吉吉招回来的魂",
    "Lifeblood Heart + Joni's Blessing": "生命血之心+乔尼的祝福",
    "Longnail + MoP": "长钉+骄傲",
    "Lost Kin": "失落近亲",
    "Lumafly Lantern": "买灯",
    "Lurien": "守望者",
    "Mantis Lords": "3螳螂",
    "Markoth": "马库斯",
    "Marmu": "皮球",
    "Mask Shard  in the Hive": "蜂巢的面具碎片",
    "Monomon": "教师",
    "Nail 2": "升两次骨钉",
    "Nail 3": "升三次骨钉",
    "No Eyes": "无眼",
    "Nosk": "诺斯克",
    "Obtain 1 extra mask": "1血量",
    "Obtain 1 extra soul vessel": "1魔法",
    "Obtain 2 extra masks": "2血量",
    "Obtain 3 extra notches": "3槽",
    "Obtain fountain vessel fragment": "喷泉碎片",
    "Parry Revek 3 times without dying (Glade of Hope Guard)": "墓地保安拼刀3次不死",
    "Pay for 6 tolls": "6个收费机",
    "Pick up the Love Key": "拿起爱之匙",
    "Quick Slash": "快劈",
    "Rescue Bretta + Sly": "救迷妹和斯莱",
    "Save 15 grubs": "救15虫",
    "Save 20 grubs": "救20虫",
    "Save the 3 grubs in Queen's Garden": "花园3虫",
    "Save the 3 grubs in Waterways": "下水道3虫",
    "Save the 5 grubs in CoT": "泪城5虫",
    "Save the 5 grubs in Deepnest": "深巢5虫",
    "Save the 7 grubs in Crystal Peaks": "水晶山7虫",
    "Shade Cloak": "黑冲",
    "Shade Soul": "黑波",
    "Shape of Unn": "乌恩",
    "Sharp Shadow": "锋利之影",
    "Soul Master": "灵魂大师",
    "Soul Tyrant": "灵魂暴君",
    "Spell Twister + Shaman Stone": "扭曲+萨满",
    "Spend 3000 geo": "花3000",
    "Spend 4000 geo": "花4000",
    "Spend 5000 geo": "花5000",
    "Sprintmaster + Dashmaster": "飞毛腿+冲刺大师",
    "Stag Nest vessel fragment": "鹿角虫巢穴碎片",
    "Take a bath in all 4 Hot Springs": "4温泉泡澡",
    "Talk to Emilitia (shortcut out of sewers)": "泪城贵妇对话",
    "Talk to Hornet at CoT Statue + Herrah": "泪城雕像和岳母面前跟小姐姐对话",
    "Talk to Lemm with Crest Equipped": "带臭屁跟古董商对话",
    "Talk to Mask Maker": "面具师对话",
    "Talk to Midwife": "助产士对话",
    "Thorns of agony + Baldur Shell + Spore Shroom": "荆棘+巴德尔+孢子",
    "Traitor Lord": "叛徒领主",
    "Tram Pass + Visit all 5 Tram Stations": "车票+过5电车站",
    "Unlock Deepnest Stag": "解锁深巢车站",
    "Unlock Hidden Stag Station": "解锁隐藏鹿角站",
    "Unlock Queen's Garden Stag": "解锁花园鹿角站",
    "Unlock Queen's Stag + King's Stag Stations": "解锁国王驿站+王后驿站",
    "Upgrade Grimmchild once": "升级一次格林之子",
    "Use 2 Simple Keys": "使用2个简单钥匙",
    "Use City Crest + Ride both CoT large elevators": "使用城市纹章和泪城2大电梯",
    "Uumuu": "水母",
    "Vengefly King + Massive Moss Charger": "大蚊子+大草丛冲锋者",
    "Void Tendrils Journal Entry": "虚空之形图鉴",
    "Watch Cloth Die": "看阿布死",
    "Watcher Knights": "劲舞团",
    "Weaversong": "编织者之歌",
    "Xero": "泽若",
    "Rescue Zote in Deepnest": "深巢救左特",
    "Monarch Wings": "二段跳",
    "Crystal Guardian 2": "激光哥2",
    "All Grubs: Xroads (5) + Fog Canyon (1)": "十字路5虫+雾谷1虫",
    "Buy 6 map pins from Iselda (All but two)": "买6个地图图针",
    "Hive Knight": "蜜蜂骑士",
    "Talk to the Fluke Hermit": "跟吸虫隐士对话",
    "Complete 4 full dream trees": "砍完4梦树",
    "Buy 8 map pins from Iselda (All)": "买8个地图图针（全部）",
    "Pale Lurker": "竞技场有钥匙的小忍者",
    "Talk to Bardoon": "跟巴冬对话"
  };
  targetDom.append(trsBtn);

  function initLang() {
    $(".text-container").each(function () {
      var enStr = $(this).html();
      // console.log(enStr)
      $(this).attr('data-lang-en', enStr)
      if (rollTranslate[enStr]) {
        $(this).attr('data-lang-cn', rollTranslate[enStr])
      } else {
        $(this).attr('data-lang-cn', enStr)
      }
    });
    $('#hkbingoAssBtn').attr('data-inited', true)
    doTrans($('#hkbingoAssBtn').attr('data-lang'))
  }

  function doTrans(lang) {
    var targetLang = lang;
    var arlang = targetLang == 'cn' ? 'en' : 'cn'
    $('#hkbingoAssBtn').html(targetLang == 'cn' ? '显示英文' : '显示中文')
    $(".text-container").each(function () {
      $(this).html($(this).attr('data-lang-' + targetLang))
    });
    $('#hkbingoAssBtn').attr('data-lang', arlang)
  }
  function resetTrsBtn(){
    $('#hkbingoAssBtn').attr('data-inited', 'false').attr('data-lang', 'cn').html('显示中文')
  }

  $('#hkbingoAssBtn').click(function () {
    if ($(this).attr('data-inited') != 'true') {
      initLang()
    } else {
      doTrans($(this).attr('data-lang'))
    }
  })

  $(document).ajaxComplete(function (event, xhr, settings) {
    if (settings.url.indexOf('room-settings') >= 0) {
      console.log('card rebuild!')
      resetTrsBtn()
    }
  });

})