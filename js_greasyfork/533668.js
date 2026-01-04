// ==UserScript==
// @name         Epic Fribbels E7 Hero Table 中文翻譯
// @namespace    https://github.com/tim01324/Epic_Fribbels_E7_Hero_Translation_CN
// @version      1.1
// @description  將 Epic Fribbels E7 Hero 網站表格標題與神器名稱翻譯成中文
// @author       tim01324
// @match        https://fribbels.github.io/e7/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533668/Epic%20Fribbels%20E7%20Hero%20Table%20%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AD%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/533668/Epic%20Fribbels%20E7%20Hero%20Table%20%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AD%AF.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const lists = {
    "#": "編號",
    "sets": "套裝",
    "gs": "總分",
    "bs": "基值",
    "atk": "攻擊",
    "def": "防禦",
    "hp": "生命",
    "spd": "速度",
    "cc": "爆率",
    "cd": "爆傷",
    "eff": "命中",
    "res": "抵抗",
    "ehp": "肉度",
    "hps": "回秒",
    "ehps": "肉秒",
    "dmg": "傷害",
    "dmgs": "傷秒",
    "mcd": "爆傷", // Note: mcd and cd are both 爆傷, keeping both for now
    "mcds": "爆秒",
    "dmgh": "治爆",
    "dmgd": "輸傷",
    // "arti": "神器", // Removed as it's handled by artifacts object now
    "date": "日期",
  };

  const artifacts = {
    "A Little Queen’s Huge Crown": "小女王的大皇冠",
    "A Symbol of Unity": "團結的象徵",
    "Abyssal Crown": "深淵皇冠",
    "Adamant Shield": "堅毅之盾",
    "Air-to-Surface Missile: MISHA": "空對地飛彈：米莎",
    "Alabastron": "白堊之石",
    "Alencinox’s Wrath": "亞雷克西諾斯的憤怒",
    "Alexa’s Basket": "亞歷莎的籃子",
    "Ambrote": "安布羅特",
    "Ancient Dragon’s Legacy": "上古龍的遺產",
    "Ancient Sheath": "上古劍鞘",
    "Andre’s Crossbow": "安德烈的弩",
    "Anti-Magic Mask": "抗魔面具",
    "Aqua Rose": "水之玫瑰",
    "Atma’s Portal": "阿特瑪之門",
    "Aurius": "亞烏利斯",
    "Azure Comet": "蒼藍彗星",
    "Barthez’s Orbuculum": "巴特茲的水晶球",
    "Bastion of Hope": "希望堡壘",
    "Bastion of Perlutia": "佩魯提亞的堡壘",
    "Benimaru’s Tachi": "紅丸的太刀",
    "Bird’s-Eye View": "鳥瞰視野",
    "Black Hand of the Goddess": "女神的黑手",
    "Blazing Full Moon Trophy": "烈焰滿月獎盃",
    "Bloodbead Dagger": "血珠匕首",
    "Bloodstone": "血石",
    "Bloody Rose": "血之玫瑰",
    "Border Coin": "邊境硬幣",
    "Brilliant Confidence": "閃耀自信",
    "Broken Will of the Priest": "祭司的破碎意志",
    "Butterfly Mandolin": "蝴蝶曼陀林",
    "Card of Small Miracles": "小奇蹟之卡",
    "Celestine": "天青石",
    "Champion’s Trophy": "冠軍獎盃",
    "Chatty": "查蒂",
    "Circus Fantasia": "幻想馬戲團",
    "Cradle of Life": "生命搖籃",
    "Creation and Destruction": "創造與毀滅",
    "Crimson Moon of Nightmares": "惡夢紅月",
    "Crimson Seed": "緋紅之種",
    "Crown of Glory": "榮耀之冠",
    "Cruel Mischief": "殘酷惡作劇",
    "Cursed Compass": "詛咒羅盤",
    "Daydream Joker": "白日夢小丑",
    "Days of Destiny": "命運之日",
    "Deadly Sword": "致命之劍",
    "Demon’s Pistol": "惡魔手槍",
    "Devil’s Brand": "惡魔印記",
    "Dignus Orb": "尊貴寶珠",
    "Doctor’s Bag": "醫生的包包",
    "Double-Edged Decrescent": "雙刃新月",
    "Draco Plate": "德拉克鎧甲",
    "Dream Scroll": "夢境卷軸",
    "Durandal": "杜蘭達爾",
    "Dust Devil": "沙塵惡魔",
    "Dux Noctis": "夜公爵",
    "Elbris Ritual Sword": "埃布利斯的寶劍",
    "Elyha’s Knife": "艾莉哈的小刀",
    "Etica’s Scepter": "艾蒂卡的權杖",
    "Exorcist’s Tonfa": "驅魔師的雙節棍",
    "Fairy Tale for a Nightmare": "惡夢童話",
    "Fairy’s Grimoire": "妖精魔導書",
    "Fan of Light and Dark": "光暗之扇",
    "Firm Shield": "堅固之盾",
    "Flawless Garments": "無瑕衣裳",
    "Flower Shower": "花雨",
    "Forest Totem": "森林圖騰",
    "Fullmetal’s Automail": "鋼之義肢",
    "Glo-Wings 21": "Glo之翼21",
    "Goblet of Oath": "誓言之杯",
    "Goblin’s Lamp": "哥布林燈",
    "Golden Cocoa Cookie": "黃金可可餅乾",
    "Golden Rose": "黃金玫瑰",
    "Grail of Blood": "血之聖杯",
    "Guardian Ice Crystals": "守護冰晶",
    "Guide to a Decision": "決斷指引",
    "Guiding Light": "引導之光",
    "Hell Cutter": "地獄切割者",
    "Hilag Lance": "希拉格長槍",
    "Holy Sacrifice": "神聖犧牲",
    "Idol’s Cheer": "偶像的應援",
    "Iela Violin": "艾拉小提琴",
    "Infinity Basket": "無限籃子",
    "Iron Fan": "鐵扇",
    "Jack-O’s Symbol": "傑克歐的象徵",
    "Junkyard Dog": "廢鐵場惡犬",
    "Justice for All": "眾生正義",
    "Kal’adra": "卡拉德拉",
    "Knowledge Seed": "知識之種",
    "Labyrinth Cube": "迷宮方塊",
    "Last Teatime": "最後的下午茶",
    "Love Potion": "愛情藥水",
    "Magaraha’s Tome": "馬加拉哈魔法書",
    "Magic Bubble Maker": "魔法泡泡機",
    "Magic for Friends": "朋友的魔法",
    "Manica of Control": "控制之袖",
    "Merciless Glutton": "無情暴食",
    "Midnight Bloom": "午夜綻放",
    "Mighty Yaksha": "強大夜叉",
    "Moonlight Dreamblade": "月光夢刃",
    "Moonlight’s Vestige": "月光遺跡",
    "Ms. Confille": "康菲爾女士",
    "Necro and Undine": "尼克羅與溫蒂妮",
    "New Year Cookies": "新年餅乾",
    "Noble Oath": "高貴誓約",
    "Nostalgic Music Box": "懷舊音樂盒",
    "Oath Key": "誓約之鑰",
    "Official Levulin Beach Volleyball": "官方勒伏林沙灘排球",
    "Old Gardening Shears": "舊園藝剪刀",
    "One Year of Gratitude": "一年感恩",
    "Otherworldly Machinery": "異界機械",
    "Pipette Lance": "吸管長槍",
    "Portrait of the Saviors": "救世主的畫像",
    "Prayer of Solitude": "孤獨祈禱",
    "Proof of Valor": "英勇的證明",
    "Prophetic Candlestick": "預言燭台",
    "Pure White Trust": "純白的信任",
    "Radiant Forever": "永恆光輝",
    "Rainbow Scale": "彩虹鱗片",
    "Ranon’s Memorandum": "拉農備忘錄",
    "Reingar’s Special Drink": "蕾茵加特特調",
    "Resolute Soldier Series": "堅定士兵系列",
    "Rhianna & Luciella": "莉安娜與露西艾拉",
    "Rise of a Monarch": "君主崛起",
    "Rocket Punch Gauntlet": "火箭拳護手",
    "Rod of Amaryllis": "孤挺花之杖",
    "Rosa Hargana": "哈爾加納玫瑰",
    "Ruyi Jingu Bang": "如意金箍棒",
    "Sacred Tree Branch": "神聖樹枝",
    "Samsara Prayer Beads": "輪迴念珠",
    "Santa Muerte": "聖死女神",
    "Sashe Ithanes": "莎謝伊薩尼斯",
    "Scroll of Shadows": "暗影卷軸",
    "Seal of Capture": "捕獲之印",
    "Secret Art – Storm Sword": "秘技－風暴劍",
    "Seductive Flower": "誘人之花",
    "Sepulcrum": "墳墓",
    "Severed Horn Wand": "斷角魔杖",
    "Sharpshooter’s Handgun": "神射手手槍",
    "Shepherd of the Hollow": "虛空牧羊人",
    "Shepherds of Chaos": "混沌牧羊人",
    "Shimadra Staff": "希瑪德拉法杖",
    "Sigurd Scythe": "西格德大鐮刀",
    "Silver Rain": "銀雨",
    "Sira-Ren": "希拉蓮",
    "Snow Crystal": "雪之結晶",
    "Sole Consolation": "唯一慰藉",
    "Song of Stars": "星之歌",
    "Spatiotemporal Fan": "時空扇",
    "Spear of a New Dawn": "新曙光之槍",
    "Spear of Purification": "淨化之槍",
    "Sphere of Inferno": "地獄之球",
    "Sphere of Sadism": "虐待之球",
    "Spirit’s Breath": "靈魂之息",
    "Spooky Solayu Stories": "蘇拉育的鬼故事",
    "Staff of Wisdom": "智慧法杖",
    "Star of the Deep Sea": "深海之星",
    "Steadfast Gatekeeper": "堅守門衛",
    "Stella Harpa": "星辰豎琴",
    "Strak Gauntlet": "斯特拉克護手",
    "Super Duper Water Gun Shooter": "超級水槍",
    "Sweet Miracle": "甜蜜奇蹟",
    "Sword of Autumn Eclipse": "秋蝕之劍",
    "Sword of Cycling Seasons": "四季之劍",
    "Sword of Ezera": "艾茲拉之劍",
    "Sword of Judgment": "審判之劍",
    "Sword of Summer Twilight": "夏暮之劍",
    "Sword of the Morning": "晨曦之劍",
    "Sword of the Sun": "太陽之劍",
    "Sword of Winter Shadow": "冬影之劍",
    "Tagehel’s Ancient Book": "塔蓋爾的古書",
    "Tear of the Desert": "沙漠之淚",
    "The Armament": "武裝",
    "The Guardian Star’s Blessing": "守護星的祝福",
    "Time Matter": "時間物質",
    "Timeless Anchor": "永恆錨",
    "To a New World": "前往新世界",
    "Torn Sleeve": "破袖",
    "Touch of Rekos": "瑞柯斯的觸摸",
    "Twilight Calamity": "黃昏災厄",
    "Tyrant’s Descent": "暴君降臨",
    "Uberius’s Tooth": "烏貝利烏斯的牙齒",
    "Umbral Keystones": "陰影基石",
    "Unfading Memories": "不滅的記憶",
    "Unseen Observer": "無形觀察者",
    "Upgraded Dragon Knuckles": "強化龍之指套",
    "Venus Orb": "金星寶珠",
    "Victorious Flag": "勝利之旗",
    "Violet Talisman": "紫羅蘭護符",
    "Wall of Order": "秩序之牆",
    "War Horn": "戰爭號角",
    "Water’s Origin": "水之源",
    "Wind Rider": "風之騎士",
    "Wings of Light and Shadow": "光與影之翼",
    "Wondrous Potion Vial": "神奇藥水瓶",
    "XIII. Death": "XIII. 死神",
    "XIV. Temperance": "XIV. 節制",
    "XIX. The Sun": "XIX. 太陽",
    "XVI. The Tower": "XVI. 高塔",
    "XVIII. The Moon": "XVIII. 月亮"
  };
  

  // first time page load
  const obsever = new MutationObserver((mutations, observe) => {
    mutations.forEach((mutation) => {
      // check which node is added
      // console.log(mutation);
      mutation.addedNodes.forEach((node) => {
        // go through all the nodes and find the one with the class name
        // after the website render the desired class name
        if (node.className === "ag-theme-balham-dark") {
          translate();
          observe.disconnect();
          afterDataRead();
          dataInsideTable();
        }
      });
    });
  })
  // Select this node for obsever
  const targetNode = document.querySelector(".bodyClass");
  const config = {
    childList: true,
  }
  obsever.observe(targetNode, config);

  // after the data readed
  const afterDataRead = () => {
    const obsever = new MutationObserver((mutations, observe) => {
      mutations.forEach((mutation) => {
        // check which node is added
        // console.log(mutation);
        // go through all the nodes and find the one with the class name
        // after the website render the desired class name
        mutation.addedNodes.forEach((node) => {
          if (node.className === "statPreviewRow artifactComboRow") {
            translate();
            observe.disconnect();
          } else {
            // console.log("NO READ DATA");
          }
        });
      });
    })
    // Select this node for obsever
    const targetNode = document.querySelector(".artifactCombos");
    const config = {
      childList: true,
    }
    obsever.observe(targetNode, config);
  };

  // check the data inside the table
  const dataInsideTable = () => {
    const obsever = new MutationObserver((mutations, observe) => {
      mutations.forEach((mutation) => {
        // check which node is added
        console.log(mutation);
        // go through all the nodes and find the one with the class name
        // after the website render the desired class name
        // row
        if (mutation.target.className === "ag-row-odd ag-row-no-focus") {
          console.log(1);
          translate();
        }

        if (mutation.type === "attributes") {
          console.log(2);
          translate();
        }

        // mutation.addedNodes.forEach((node) => {
        //   if (node.attributes === "role") {
        //     translate();
        //     observe.disconnect();
        //   } else {
        //     // console.log("NO READ DATA");
        //   }
        // });
      });
    })

    // Select this node for obsever
    // this is the table that we want to observe
    const targetNode = document.querySelector(".ag-center-cols-container");
    const config = {
      childList: true,
      attributes: true,
    }
    obsever.observe(targetNode, config);
  };

  function translate() {
    //  grab all the headers
    const headers = document.querySelectorAll('.ag-header-cell-text');
    //  replace header
    headers.forEach((text) => {
      // remove all the spaces
      var removeSpaceText = text.outerText.replace(/\s/g, "")
      //  match the text and replace it
      Object.keys(lists).forEach((key) => {
        if (removeSpaceText === key) {
          text.innerHTML = lists[key];
        }
      });
      // Also translate the "arti" header specifically if found
      if (removeSpaceText === "arti") {
          text.innerHTML = "神器";
      }
    });

    // grab all the artifact names in the rows
    const artsInTheRows = document.querySelectorAll('[col-id="artifactName"]');
    artsInTheRows.forEach((text) => {
      const originalArtifactName = text.outerText.trim(); // Get original artifact name
      if (artifacts[originalArtifactName]) { // Check if translation exists in artifacts object
        text.innerHTML = artifacts[originalArtifactName]; // Use translation from artifacts object
      }
    });

    // grab all the artifact names in the character infos
    const arts = document.querySelectorAll('.setArtifactRowRight');
    arts.forEach((text) => {
      const originalArtifactName = text.outerText.trim(); // Get original artifact name
      if (artifacts[originalArtifactName]) { // Check if translation exists in artifacts object
        text.innerHTML = artifacts[originalArtifactName]; // Use translation from artifacts object
      }
    });
  };

}());