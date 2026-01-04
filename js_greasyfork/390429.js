// ==UserScript==
// @name              蔚蓝BINGO翻译
// @namespace         https://github.com/kuailemario/Celeste_Trans.git
// @version           0.1.4
// @icon              http://www.mattmakesgames.com/images/games/Celeste1.png
// @description       2019-10-10 一键翻译脚本
// @author            zyowo, elderFish, DemoJameson, Hyun.
// @supportURL        https://github.com/kuailemario/Celeste_Trans/issues
// @match             *://www.bingosync.com/room/*
// @match             *://bingosync.com/room/*
// @run-at            document-end
// @grant             unsafeWindow
// @grant             GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/390429/%E8%94%9A%E8%93%9DBINGO%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/390429/%E8%94%9A%E8%93%9DBINGO%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

$(document).ready(function () {
  var targetDom = $('#bingo-chat').closest('.panel').children('.panel-heading');
  var trsBtn = '<span id="transBtn" class="btn btn-default btn-xs pull-right collapse-button" data-lang="cn">显示中文</span>';

  var rollTranslate = {
    // [新] 第9章 由其他任务修改而来
    "15 Berries in 4 Chapters":                          "第9章 踩8不同鱼",          // 9-2 一个人
    "Complete 5 B-Sides":                                "第9章 炸8不同鱼",          // 9-2 一个人
    "Use 10 Binoculars":                                 "第9章 消除8不同水母",      // 9-3 能源
    "All Collectibles in 3A":                            "9-3/能源 清除五门",        // 9-3 能源
    "All Berries in Awake (1)":                          "第9章 假心",              // 9-5 视界线
    "All Collectibles in 5A":                            "第9章 通过所有节奏面",      // 9-7 倔强
    "All Collectibles in 7A":                            "9-6/决心 踩5冰球",         // 9-6 决心（吹风面）
    "Get a 1-Up in 3 Chapters":                          "第9章 抓15不同位置鸟",     // 9-8 和谐（抓鸟面）
    "Use 5 Binoculars in B-Sides":                       "第9章 月莓",               // 9-9 再见
    "Use 6 Binoculars in B-Sides":                       "第9章 3望远镜",

 
    // [新] 杂项 由其他任务修改而来
    "Talk to Theo in Crossing":                         "2A 1冲刺到镜子对话",
    "Talk to Theo in Awake":                            "8B 抱Badeline",
    "75 Berries":                                       "5A 破坏7不同墙",
    "100 Berries":                                      "4A 破坏6不同墙",
    "Hit a Kevin block from all 4 sides":               "红泡泡内破坏5不同墙",
    "Grabless 5A":                                      "3金草莓",
    "Grabless 6A":                                      "5金草莓",
    "Visit the Bird's Nest in Epilogue":                "8A 踩10冰球",
    "Talk to Old Lady in Core":                         "8B 踩10冰球",
    "Use 8 Binoculars":                                 "6A 撞15不同位置Badeline",
    "Use 9 Binoculars":                                 "6B 撞10不同位置Badeline",
    "Use 3 Binoculars in 2 Chapters":                   "7B 通过0米+500米",
    "Use 2 Binoculars in 3 Chapters":                   "7B 通过1000米+1500米",
    "Use 2 Binoculars in 4 Chapters":                   "7B 通过2000米+2500米",

    // 其他杂项
    "Read the Poem in Awake":                           "2A-3/唤醒 读诗词",
    "Take hidden path before Cliff Face":               "在 4A-3/古道 最后一面走隐藏路线",
    "Don't skip final 4A Cutscene":                     "4A 不跳过结尾剧情",
    "No shortcut in 5A double bubble room":             "5A 用钥匙开第二扇门",
    "Get 1 Key in Search":                              "5A-4/搜寻 1钥匙",
    "Get 2 Keys in Search":                             "5A-4/搜寻 2钥匙",
    "Get 3 Keys in Search":                             "5A-4/搜寻 3钥匙",
    "Easteregg room in Reflection":                     "6A 进彩蛋房",
    "Reflection Cutscene in Hollows":                   "6-3/洞穴 支线对话",
    "Only top route in Hollows":                        "6-3/洞穴 全走上面",
    "Only bottom route in Hollows":                     "6-3/洞穴 全走下面",
    "All Flags in 3000M":                               "7A 3000米碰所有旗子",

    // 分检查点草莓
    "All Berries in Start of 1A (6)":                   "1A-1/开始 6草莓",
    "All Berries in Crossing (9)":                      "1A-2/十字路口 9草莓",
    "All Berries in Chasm (5)":                         "1A-3/峡谷 5草莓",
    //----------------------------------------------------------------
    "All Berries in Start of 2A (9)":                   "2A-1/开始 9草莓",
    "All Berries in Intervention (8)":                  "2A-2/干涉 8草莓",
    //----------------------------------------------------------------
    "All Berries in Start of 3A (11)":                  "3A-1/开始 11草莓",
    "All Berries in Huge Mess (7)":                     "3A-2/乱七八糟 7草莓",
    "All Berries in Elevator Shaft (4)":                "3A-3/电梯井 4草莓",
    "All Berries in Presidential Suite (3)":            "3A-4/总统套房 3草莓",
    //----------------------------------------------------------------
    "All Berries in Start of 4A (8)":                   "4A-1/开始 8草莓",
    "All Berries in Shrine (9)":                        "4A-2/神迹 9草莓",
    "All Berries in Old Trail (7)":                     "4A-3/古道 7草莓",
    "All Berries in Cliff Face (5)":                    "4A-4/悬崖峭壁 5草莓",
    //----------------------------------------------------------------
    "All Berries in Start of 5A (12)":                  "5A-1/开始 12草莓",
    "All Berries in Depths (11)":                       "5A-2/深渊 11草莓",
    "All Berries in Unraveling (1)":                    "5A-3/豁然开朗 1草莓",
    "All Berries in Search (6)":                        "5A-4/搜寻 6草莓",
    "All Berries in Rescue (1)":                        "5A-5/营救 1草莓",
    //----------------------------------------------------------------
    "All Berries in 0M (4)":                            "0米 4草莓",
    "All Berries in 500M (6)":                          "500米 6草莓",
    "All Berries in 1000M (6)":                         "1000米 6草莓",
    "All Berries in 1500M (8)":                         "1500米 8草莓",
    "All Berries in 2000M (8)":                         "2000米 8草莓",
    "All Berries in 2500M (8)":                         "2500米 8草莓",
    "All Berries in 3000M (7)":                         "3000米 7草莓",
    //----------------------------------------------------------------
    "All Berries in Into the Core (1)":                 "8A-2/深入腹地 1草莓",
    "All Berries in Hot and Cold (3)":                  "8A-3/冰火两重天 3草莓",
    "All Berries in Heart of the Mountain (1)":         "8A-4/山之心 1草莓",

    // 分章节草莓
    "10 Berries in 1A":                                 "1A 10草莓",
    "10 Berries in 2A":                                 "2A 10草莓",
    "15 Berries in 3A":                                 "3A 15草莓",
    "15 Berries in 4A":                                 "4A 15草莓",
    "20 Berries in 4A":                                 "4A 20草莓",
    "15 Berries in 5A":                                 "5A 15草莓",
    "20 Berries in 5A":                                 "5A 20草莓",
    "20 Berries in 7A":                                 "7A 20草莓",
    "35 Berries in 7A":                                 "7A 35草莓",

    // 多章节草莓
    "5 Berries in 4 Chapters":                          "四个章节 各5草莓",   // 20
    "5 Berries in 5 Chapters":                          "五个章节 各5草莓",   // 25
    "15 Berries in 2 Chapters":                         "两个章节 各15草莓",  // 30
    "10 Berries in 3 Chapters":                         "三个章节 各10草莓",  // 30
    "10 Berries in 4 Chapters":                         "四个章节 各10草莓",  // 40
    "15 Berries in 3 Chapters":                         "三个章节 各15草莓",  // 45
    "10 Berries in 5 Chapters":                         "五个章节 各10草莓",  // 50

    // 累计草莓
    "20 Berries":                                       "20草莓",
    "25 Berries":                                       "25草莓",
    "30 Berries":                                       "30草莓",
    "35 Berries":                                       "35草莓",
    "40 Berries":                                       "40草莓",
    "45 Berries":                                       "45草莓",
    "50 Berries":                                       "50草莓",
    "65 Berries":                                       "65草莓",
    //----------------------------------------------------------------
    "2 Winged Berries":                                 "2飞行草莓",
    "3 Winged Berries":                                 "3飞行草莓",
    "4 Winged Berries":                                 "4飞行草莓",
    "5 Winged Berries":                                 "5飞行草莓",
    "6 Winged Berries":                                 "6飞行草莓",
    "7 Winged Berries":                                 "7飞行草莓",
    //----------------------------------------------------------------
    "2 Seeded Berries":                                 "2种子草莓",
    "3 Seeded Berries":                                 "3种子草莓",
    "4 Seeded Berries":                                 "4种子草莓",

    // PICO-8
    "Complete PICO-8":                                  "PICO-8 Any%",
    "Reach Old Site in PICO-8":                         "PICO-8 跑到旧址",
    "Get the Orb in PICO-8":                            "PICO-8 拿到双冲",
    //----------------------------------------------------------------
    "Get 5 Berries in PICO-8":                          "PICO-8 5草莓",
    "Get 10 Berries in PICO-8":                         "PICO-8 10草莓",
    "Get 15 Berries in PICO-8":                         "PICO-8 15草莓",

    // 蓝心
    "Forsaken City Blue Heart":                         "1A 蓝心",
    "Old Site Blue Heart":                              "2A 蓝心",
    "Celestial Resort Blue Heart":                      "3A 蓝心",
    "Golden Ridge Blue Heart":                          "4A 蓝心",
    "Mirror Temple Blue Heart":                         "5A 蓝心",
    "Reflection Blue Heart":                            "6A 蓝心",
    "The Summit Blue Heart":                            "7A 蓝心",
    //----------------------------------------------------------------
    "1 Blue and 1 Red Heart":                           "1枚蓝心+1枚红心",
    "2 Blue and 2 Red Hearts":                          "2枚蓝心+2枚红心",
    "3 Blue and 3 Red Hearts":                          "3枚蓝心+3枚红心",
    //----------------------------------------------------------------
    "Blue and Red Heart in Forsaken City":              "第1章 蓝心+红心",
    "Blue and Red Heart in Old Site":                   "第2章 蓝心+红心",
    "Blue and Red Heart in Celestial Resort":           "第3章 蓝心+红心",
    "Blue and Red Heart in Golden Ridge":               "第4章 蓝心+红心",
    "Blue and Red Heart in Mirror Temple":              "第5章 蓝心+红心",
    "Blue and Red Heart in Reflection":                 "第6章 蓝心+红心",
    "Blue and Red Heart in The Summit":                 "第7章 蓝心+红心",

    // 磁带
    "Forsaken City Cassette":                           "1A 磁带",
    "Old Site Cassette":                                "2A 磁带",
    "Celestial Resort Cassette":                        "3A 磁带",
    "Golden Ridge Cassette":                            "4A 磁带",
    "Mirror Temple Cassette":                           "5A 磁带",
    "Reflection Cassette":                              "6A 磁带",
    "The Summit Cassette":                              "7A 磁带",
    //----------------------------------------------------------------
    "2 Cassettes":                                      "2张磁带",
    "3 Cassettes":                                      "3张磁带",
    "4 Cassettes":                                      "4张磁带",
    "5 Cassettes":                                      "5张磁带",
    
    // 水晶之心
    "2 Hearts":                                         "2水晶之心",
    "3 Hearts":                                         "3水晶之心",
    "4 Hearts":                                         "4水晶之心",
    "5 Hearts":                                         "5水晶之心",
    "6 Hearts":                                         "6水晶之心",
    "7 Hearts":                                         "7水晶之心",
    "2 Hearts and 2 Cassettes":                         "2水晶之心+2磁带",
    "3 Hearts and 3 Cassettes":                         "3水晶之心+3磁带",
    "4 Hearts and 4 Cassettes":                         "4水晶之心+4磁带",

    // 全收集
    "All Collectibles in 1A":                           "1A 全部收集品",
    "All Collectibles in 2A":                           "2A 全部收集品",
    "All Collectibles in 4A":                           "4A 全部收集品",
    "All Collectibles in 8A":                           "8A 全部收集品",

    // 通关
    "Forsaken City B-Side":                             "通关1B",
    "Old Site B-Side":                                  "通关2B",
    "Celestial Resort B-Side":                          "通关3B",
    "Golden Ridge B-Side":                              "通关4B",
    "Mirror Temple B-Side":                             "通关5B",
    "Reflection B-Side":                                "通关6B",
    "The Summit B-Side":                                "通关7B",
    "Clear Core":                                       "通关8A",
    "Talk to Theo in Elevator Shaft":                   "通关8C",   // 已经修改
    "Talk to Theo in Search":                           "通关7C",   // 已经修改

    // 累计通关
    "Complete 2 B-Sides":                               "2个B面",
    "Complete 3 B-Sides":                               "3个B面",
    "Complete 4 B-Sides":                               "4个B面",
    "Complete 2 A-Sides and 2 B-Sides":                 "2个A面+2个B面",
    "Complete 3 A-Sides and 3 B-Sides":                 "3个A面+3个B面",
    "Complete 5 A-Sides":                               "5个A面",
    "Find Letter and PICO-8 in Huge Mess":              "3个C面",       // 已经修改
    "Complete 1 B-Side":                                "5个C面",       // 已经修改

    // 望远镜
    "Use 2 Binoculars in 2 Chapters":                   "两个章节 各2望远镜",
    "Use 1 Binocular in 3 Chapters":                    "三个章节 各1望远镜",
    "Use 1 Binocular in 4 Chapters":                    "四个章节 各1望远镜",
    "Use 1 Binocular in 5 Chapters":                    "五个章节 各1望远镜",
    "Use all Binoculars in 4A (3)":                     "4A 3望远镜",
    //----------------------------------------------------------------
    "Use 5 Binoculars":                                 "5望远镜",
    "Use 6 Binoculars":                                 "6望远镜",
    "Use 7 Binoculars":                                 "7望远镜",
    //----------------------------------------------------------------
    "Use 3 Binoculars in B-Sides":                      "B面 3望远镜",
    "Use 4 Binoculars in B-Sides":                      "B面 4望远镜",

    // 无抓
    "Grabless 1A":                                      "1A 无抓",
    "Grabless 2A":                                      "2A 无抓",
    "Grabless 3A":                                      "3A 无抓",
    "Complete 2 Chapters Grabless":                     "两个章节 无抓",
    //----------------------------------------------------------------
    "Grabless Huge Mess (3A Checkpoint)":               "3A-2/乱七八糟 无抓通过",
    "Grabless Elevator Shaft (3A Checkpoint)":          "3A-3/电梯井 无抓通过",
    "Grabless Presidential Suite (3A Checkpoint)":      "3A-4/总统套房 无抓通过",
    "Grabless Cliff Face (4A Checkpoint)":              "4A-4/悬崖峭壁 无抓",
    "Grabless Depths (5A Checkpoint)":                  "5A-2/深渊 无抓通过",
    "Grabless Unraveling (5A Checkpoint)":              "5A-3/豁然开朗 无抓通过",
    "Grabless Search (5A Checkpoint)":                  "5A-4/搜寻 无抓通过",
    "Grabless Rescue (5A Checkpoint)":                  "5A-5/营救 无抓通过",
    "Grabless Lake (6A Checkpoint)":                    "6A-2/湖 无抓通过",
    "Grabless Hollows (6A Checkpoint)":                 "6A-3/洞穴 无抓通过",
    "Grabless Rock Bottom (6A Checkpoint)":             "6A-5/谷底 无抓通过",

    // 1-Up
    "Get a 1-Up in 1A":                                 "1A 1-Up",
    "Get a 1-Up in 2A":                                 "2A 1-Up",
    "Get a 1-Up in 4A":                                 "4A 1-Up",
    "Get a 1-Up in 5A":                                 "5A 1-Up",
    "Get a 1-Up in 2 Chapters":                         "两个章节 各1-Up",
    "Get two 1-Ups":                                    "两个 1-Up",
    "Get three 1-Ups":                                  "三个 1-Up",

    // 宝石
    "0M and 500M Gems":                                 "0米+500米宝石",
    "1000M and 1500M Gems":                             "1000米+1500米宝石",
    "2000M and 2500M Gems":                             "2000米+2500米宝石",
    //----------------------------------------------------------------
    "3 Gems in The Summit":                             "第7章 3宝石",
    "4 Gems in The Summit":                             "第7章 4宝石",
    "5 Gems in the Summit":                             "第7章 5宝石",

    // Oshiro
    "Stun Oshiro 10 times":                             "踩10次Oshiro",
    "Stun Oshiro 15 times":                             "踩5不同房间Oshiro",    // 已修改
    "Stun Oshiro 25 times":                             "踩8不同房间Oshiro",   // 已修改

    // 雪球
    "Jump on 8 Snowballs":                              "踩8雪球",
    "Jump on 15 Snowballs":                             "踩15雪球",
    "Jump on 20 Snowballs":                             "踩5不同房间雪球",      // 已修改

    // 新浪
    "Kill a Seeker":                                    "杀1新浪",
    "Kill 2 different Seekers":                         "杀2不同新浪",
    "Stun Seekers 10 times":                            "踩10新浪",
    "Stun Seekers 20 times":                            "踩至少3新浪共20次",    // 已修改 by云
    "Stun Seekers 30 times":                            "踩至少5新浪共30次",    // 已修改 by云

    // Theo 对话类只需要交互一下
    "2 optional Theo Cutscenes":                        "2个可不触发的Theo对话",
    "3 optional Theo Cutscenes":                        "3个可不触发的Theo对话",
    "All 4 optional Theo Cutscenes":                    "4个可不触发的Theo对话",

    // 无冲刺
    "Winged Golden Berry":                              "1A隐藏金",
    "Complete Crossing without dashing":                "1A-2/十字路口 无冲刺通过",
    "Complete Chasm without dashing":                   "1A-3/峡谷 无冲刺通过",
    "Complete Awake without dashing":                   "2A-3/唤醒 无冲刺通过",
    
    // 第三章：天空度假山庄
    "Huge Mess: Chest -&gt; Books -&gt; Towel":         "3A 柜子-书-毛巾",
    "Huge Mess: Books -&gt; Chest -&gt; Towel":         "3A 书-柜子-毛巾",
    "Huge Mess: Towel -&gt; Chest -&gt; Books":         "3A 毛巾-柜子-书",
    "Huge Mess: Chest -&gt; Towel -&gt; Books":         "3A 柜子-毛巾-书",
    "Huge Mess: Books -&gt; Towel -&gt; Chest":         "3A 书-毛巾-柜子",
    "Huge Mess: Towel -&gt; Books -&gt; Chest":         "3A 毛巾-书-柜子",
    //----------------------------------------------------------------
    "Read Diary in Elevator Shaft":                     "3A-3/电梯井 读日记",
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
    $('#transBtn').attr('data-inited', true)
    doTrans($('#transBtn').attr('data-lang'))
  }

  var targetLang;
  var transing = false;

  function doTrans(lang) {
    targetLang = lang;
    var arlang = targetLang == 'cn' ? 'en' : 'cn'
    $('#transBtn').html(targetLang == 'cn' ? '显示英文' : '显示中文')
    $(".text-container").each(function () {
      $(this).html($(this).attr('data-lang-' + targetLang))
    });
    $('#transBtn').attr('data-lang', arlang)

    transChat();
  }

  function resetTrsBtn(){
    $('#transBtn').attr('data-inited', 'false').attr('data-lang', 'cn').html('显示中文')
  }

  function transChat() {
    transing = true;
    $(".goal-name").each(function () {
      if(!$(this).attr('data-lang-en')){
          $(this).attr('data-lang-en', $(this).text());
      }

      if(targetLang == 'cn'){
          $(this).text(rollTranslate[$(this).text().replace(/>/g, "&gt;")]);
      } else {
          $(this).text($(this).attr('data-lang-en'));
      }
    });
    transing = false;
  }

  $('#transBtn').click(function () {
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

$('body').on('DOMNodeInserted', '.goal-entry', function(e) {
    if(transing){
        return;
    }
    transChat();
});

})