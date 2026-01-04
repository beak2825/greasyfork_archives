// ==UserScript==
// @name         [银河奶牛]莫库里换皮
// @name:en      MWI Moekuri Monsters
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  替换怪物图标为可爱的莫库里生物，并更改名字
// @description:en Replace monster textures with adorable Moekuri creatures and change their names.
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544243/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E8%8E%AB%E5%BA%93%E9%87%8C%E6%8D%A2%E7%9A%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/544243/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E8%8E%AB%E5%BA%93%E9%87%8C%E6%8D%A2%E7%9A%AE.meta.js
// ==/UserScript==
//感谢大佬VoltaX提供代码

(function () {
  'use strict';
  const css = `
    .monster-skin-invisible {
      display: none;
    }
    /* 战斗中敌方图标 */
    .replaced-monster-skin {
      transform-origin: bottom center;
      transform: scale(1.2);
    }
    /* 怪物预览图标 */
    .SkillActionDetail_combatMonsterIcon__UxDWF .replaced-monster-skin,
    .CombatMonsterTooltip_combatMonsterIcon__UxDWF .replaced-monster-skin {
      transform: scale(1.4) !important;
    }
    /* 对话框内部图标 */
    .Modal_modal__1Jiep .SkillActionDetail_combatMonsterIcon__UxDWF .replaced-monster-skin,
    .Modal_modal__1Jiep .CombatMonsterTooltip_combatMonsterIcon__UxDWF .replaced-monster-skin {
      transform: scale(1.1) !important;
    }
  `;
  const InsertStyleSheet = (style) => {
      const s = new CSSStyleSheet();
      s.replaceSync(style);
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, s];
  };
  InsertStyleSheet(css);

  const monsterImageMap = {
		'fly': 'https://tupian.li/images/2025/08/01/688c023fb4665.png',
		'rat': 'https://tupian.li/images/2025/08/01/688c04ce93ca7.png',
		'skunk': 'https://tupian.li/images/2025/08/01/688c0239acd52.png',
		'porcupine': 'https://tupian.li/images/2025/08/01/688c03ab8d748.png',
		'slimy': 'https://tupian.li/images/2025/08/01/688c11a85f281.png',
		'frog': 'https://tupian.li/images/2025/08/01/688c0297d4a10.png',
		'snake': 'https://tupian.li/images/2025/08/01/688c0469a0821.png',
		'swampy': 'https://tupian.li/images/2025/08/01/688c023f1db49.png',
		'alligator': 'https://tupian.li/images/2025/08/01/688c15401c256.png',
		'sea_snail': 'https://tupian.li/images/2025/08/01/688c11c814636.png',
		'crab': 'https://tupian.li/images/2025/08/01/688c11c45ed03.png',
		'aquahorse': 'https://tupian.li/images/2025/08/01/688c11c50fd9a.png',
		'nom_nom': 'https://tupian.li/images/2025/08/01/688c11e783ab1.png',
		'turtle': 'https://tupian.li/images/2025/08/01/688c11e6a1000.png',
		'jungle_sprite': 'https://tupian.li/images/2025/08/01/688c04486bddb.png',
		'myconid': 'https://tupian.li/images/2025/08/01/688c042d4a206.png',
		'treant': 'https://tupian.li/images/2025/08/01/688c042c142b7.png',
		'centaur_archer': 'https://tupian.li/images/2025/08/01/688c044a969a6.png',
		'gobo_stabby': 'https://tupian.li/images/2025/08/01/688c0273aa3fd.png',
		'gobo_slashy': 'https://tupian.li/images/2025/08/01/688c02bb78113.png',
		'gobo_smashy': 'https://tupian.li/images/2025/08/01/688c04ad46e0b.png',
		'gobo_shooty': 'https://tupian.li/images/2025/08/01/688c03e3ca8e2.png',
		'gobo_boomy': 'https://tupian.li/images/2025/08/01/688c02fa7152c.png',
		'eye': 'https://tupian.li/images/2025/08/01/688c03c068e38.png',
		'veyes': 'https://tupian.li/images/2025/08/01/688c03e47c2b7.png',
		'eyes': 'https://tupian.li/images/2025/08/01/688c03c775425.png',
		'novice_sorcerer': 'https://tupian.li/images/2025/08/01/688c034385f24.png',
		'ice_sorcerer': 'https://tupian.li/images/2025/08/01/688c035969929.png',
		'flame_sorcerer': 'https://tupian.li/images/2025/08/01/688c02f93bff3.png',
		'elementalist': 'https://tupian.li/images/2025/08/01/688c12210d2fa.png',
		'gummy_bear': 'https://tupian.li/images/2025/08/01/688c0468a58c7.png',
		'panda': 'https://tupian.li/images/2025/08/01/688c1201494e6.png',
		'black_bear': 'https://tupian.li/images/2025/08/01/688c05112b7b6.png',
		'grizzly_bear': 'https://tupian.li/images/2025/08/01/688c03310d9c0.png',
		'polar_bear': 'https://tupian.li/images/2025/08/01/688c04ba5e980.png',
		'granite_golem': 'https://tupian.li/images/2025/08/01/688c0497c6b97.png',
		'magnetic_golem': 'https://tupian.li/images/2025/08/01/688c04cc9ca48.png',
		'stalactite_golem': 'https://tupian.li/images/2025/08/01/688c04ae7e744.png',
		'zombie': 'https://tupian.li/images/2025/08/01/688c14fbef2ce.png',
		'vampire': 'https://tupian.li/images/2025/08/01/688c14c8e638b.png',
		'werewolf': 'https://tupian.li/images/2025/08/01/688c14fba46cb.png',
		'abyssal_imp': 'https://tupian.li/images/2025/08/01/688c02bea1ad9.png',
		'soul_hunter': 'https://tupian.li/images/2025/08/01/688c027581436.png',
		'infernal_warlock': 'https://tupian.li/images/2025/08/01/688c02f88df27.png',
		// boss
		'giant_shoebill': 'https://tupian.li/images/2025/08/01/688c02722492f.png',
		'marine_huntress': 'https://tupian.li/images/2025/08/01/688c11c4a2b16.png',
		'luna_empress': 'https://tupian.li/images/2025/08/01/688c044a5c9a8.png',
		'gobo_chieftain': 'https://tupian.li/images/2025/08/01/688c04ee3bb1e.png',
		'the_watcher': 'https://tupian.li/images/2025/08/01/688c0dff9b63a.png',
		'chronofrost_sorcerer': 'https://tupian.li/images/2025/08/01/688c037d63226.png',
		'red_panda': 'https://tupian.li/images/2025/08/01/688c0510d3e80.png',
		'crystal_colossus': 'https://tupian.li/images/2025/08/01/688c04ad2a710.png',
		'dusk_revenant': 'https://tupian.li/images/2025/08/01/688c051a36966.png',
		'demonic_overlord': 'https://tupian.li/images/2025/08/01/688c0332e06a3.png',
		//地下城1
		'butterjerry': 'https://tupian.li/images/2025/08/01/688c035b315d9.png',
		'jackalope': 'https://tupian.li/images/2025/08/01/688c04486bddb.png',
		'dodocamel': 'https://tupian.li/images/2025/08/01/688c0488a42ef.png',
		'manticore': 'https://tupian.li/images/2025/08/01/688c1518edda7.png',
		'griffin': 'https://tupian.li/images/2025/08/01/688c03e4dc2fa.png',
		//地下城2
		'rabid_rabbit': 'https://tupian.li/images/2025/08/01/688c037a959b9.png',
		'zombie_bear': 'https://tupian.li/images/2025/08/01/688c0510b349a.png',
		'acrobat': 'https://tupian.li/images/2025/08/01/688c035993c48.png',
		'juggler': 'https://tupian.li/images/2025/08/01/688c051aeea0c.png',
		'magician': 'https://tupian.li/images/2025/08/01/688c029007c4a.png',
		'deranged_jester': 'https://tupian.li/images/2025/08/01/688c150271ef2.png',
		//地下城3
		'enchanted_pawn': 'https://tupian.li/images/2025/08/01/688c04cd805be.png',
		'enchanted_knight': 'https://tupian.li/images/2025/08/01/688c123b2f4cc.png',
		'enchanted_bishop': 'https://tupian.li/images/2025/08/01/688c123b286a7.png',
		'enchanted_rook': 'https://tupian.li/images/2025/08/01/688c1201a0c41.png',
		'enchanted_queen': 'https://tupian.li/images/2025/08/01/688c1221846c2.png',
		'enchanted_king': 'https://tupian.li/images/2025/08/01/688c14ca6bd63.png',
		//地下城4
		'squawker': 'https://tupian.li/images/2025/08/01/688c03c8565fe.png',
		'anchor_shark': 'https://tupian.li/images/2025/08/01/688c04d7ba206.png',
		'brine_marksman': 'https://tupian.li/images/2025/08/01/688c11e8b99a9.png',
		'tidal_conjuror': 'https://tupian.li/images/2025/08/01/688c11ea14136.png',
		'captain_fishhook': 'https://tupian.li/images/2025/08/01/688c1205c1a33.png',
		'the_kraken': 'https://tupian.li/images/2025/08/01/688c12087736f.png',
        //地图
        'smelly_planet': 'https://tupian.li/images/2025/08/01/688c1dee9bdd4.png',
        'smelly_planet_elite': 'https://tupian.li/images/2025/08/01/688c1def3a705.png',
        'sinister_circus': 'https://tupian.li/images/2025/08/01/688c1b59c4159.png',
  };

  const monsterNameMap = new Map([
    ["苍蝇", "觉"],
    ["杰瑞", "小妖精"],
    ["臭鼬", "瓦尔基丽"],
    ["豪猪", "爱丽儿"],
    ["史莱姆", "弥弥子"],
    ["青蛙", "阿耳戈斯"],
    ["蛇", "野槌"],
    ["沼泽虫", "巴西利斯克"],
    ["夏洛克", "骷髅战士"],
    ["鲸头鹳", "米诺陶"],
    ["蜗牛", "摩伽罗"],
    ["螃蟹", "蛟"],
    ["水马", "凯尔派"],
    ["咬咬鱼", "威沛"],
    ["忍者龟", "克拉肯"],
    ["海洋猎手", "虹蛇"],
    ["丛林精灵", "莱西"],
    ["蘑菇人", "树宁芙"],
    ["树人", "树人"],
    ["半人马弓箭手", "希莫鸟"],
    ["月神之蝶", "夜叉"],
    ["刺刺", "昆沙门天"],
    ["砍砍", "史尔特尔"],
    ["锤锤", "乌利库梅"],
    ["咻咻", "盖因"],
    ["轰轰", "阿达"],
    ["哥布林酋长", "永恒之枪"],
    ["独眼", "镰鼬"],
    ["叠眼", "赫拉斯瓦尔格尔"],
    ["复眼", "志那都比古神"],
    ["观察者", "堤丰"],
    ["新手巫师", "克鲁波克鲁"],
    ["冰霜巫师", "冰柱女"],
    ["火焰巫师", "亚米"],
    ["元素法师", "智天使"],
    ["霜时巫师", "奥丁"],
    ["软糖熊", "青龙"],
    ["熊猫", "玄武"],
    ["黑熊", "白虎"],
    ["棕熊", "朱雀"],
    ["北极熊", "麒麟"],
    ["小熊猫", "建御雷"],
    ["磁力魔像", "兹帕纳"],
    ["钟乳石魔像", "拜恩"],
    ["花岗魔像", "埃癸斯"],
    ["花岗岩魔像", "埃癸斯"],
    ["水晶巨像", "康巴哈那"],
    ["僵尸", "古尔维格"],
    ["吸血鬼", "纳姆塔尔"],
    ["狼人", "阿里奥克"],
    ["黄昏亡灵", "雷谢夫"],
    ["深渊小鬼", "佩莉"],
    ["灵魂猎手", "阿耳忒弥斯"],
    ["地狱术士", "迦具土"],
    ["恶魔霸主", "凤凰"],
    //D1
    ["蝶鼠", "拉塔托斯克"],
    ["鹿角兔", "佛洛拉"],
    ["渡渡驼", "斯芬克斯"],
    ["狮蝎兽", "刻耳柏洛斯"],
    ["狮鹫", "狮鹫"],
    //D2
    ["疯魔兔", "克罗赛尔"],
    ["僵尸熊", "雷鸟"],
    ["杂技师", "海豹人"],
    ["杂耍者", "阿修罗"],
    ["魔术师", "乌科巴克"],
    ["小丑皇", "欧律诺墨"],
    ["秘法要塞", "圣光堡垒"],
    ["秘法士兵", "柯罗诺斯"],
    ["秘法骑士", "狱天使"],
    ["秘法主教", "阿斯克勒庇俄斯"],
    ["秘法堡垒", "莱拉"],
    ["秘法王后", "福尔图娜"],
    ["秘法国王", "密特拉"],
    //D3
    ["鹦鹉", "塞壬"],
    ["持锚鲨", "库亚塔"],
    ["海盐射手", "罔象女神"],
    ["潮汐召唤师", "安菲特里式"],
    ["鱼钩船长", "利维坦"],
    ["克拉肯", "巴哈姆特"],
    //maps
    ["臭臭星球", "萤火溪谷"],
    ["臭臭星球 (精英)", "萤火溪谷(精英)"],
	["沼泽星球", "雾隐沼泽"],
    ["沼泽星球 (精英)", "雾隐沼泽(精英)"],
    ["海洋星球", "寂灭之海"],
    ["海洋星球 (精英)", "寂灭之海(精英)"],
    ["丛林星球", "暗影密林"],
    ["丛林星球 (精英)", "暗影密林(精英)"],
    ["哥布林星球", "战魂裂谷"],
    ["哥布林星球 (精英)", "战魂裂谷(精英)"],
    ["眼球星球", "腐化之渊"],
    ["眼球星球 (精英)", "腐化之渊(精英)"],
    ["巫师之塔", "神罚之塔"],
    ["巫师之塔 (精英)", "神罚之塔(精英)"],
    ["熊熊星球", "碎月竹林"],
    ["熊熊星球 (精英)", "碎月竹林(精英)"],
    ["魔像洞穴", "钢铁回廊"],
    ["魔像洞穴 (精英)", "钢铁回廊(精英)"],
    ["暮光之地", "暗鸦墓园"],
    ["暮光之地 (精英)", "暗鸦墓园(精英)"],
    ["地狱深渊", "红莲战场"],
    ["地狱深渊 (精英)", "红莲战场(精英)"],
    ["地下城", "秘境回廊"],
    ["奇幻洞穴", "奇幻洞穴"],
	["阴森马戏团", "小行星带"],
    ["海盗基地", "归墟群岛"],
    //English
    ["Fly", "Satori"],
    ["Jerry", "Gremlin"],
    ["Skunk", "Valkyrie"],
    ["Porcupine", "Aerial"],
    ["Slimy", "Neneko"],
    ["Frogger", "Argos"],
    ["Snake", "Nozuchi"],
    ["Swampy", "Basilisk"],
    ["Alligator", "Skeleton"],
    ["Gary", "Makara"],
    ["I Pinch", "Mizuchi"],
    ["Aquahorse", "Kelpie"],
    ["Nom Nom", "Vepar"],
    ["Turuto", "Kraken"],
    ["Jungle Sprite", "Leshy"],
    ["Myconid", "Dryad"],
    ["Treant", "Ent"],
    ["Centaur Archer", "Simurgh"],
    ["Stabby", "Vaisravana"],
    ["Slashy", "Surtr"],
    ["Smashy", "Ullikummi"],
    ["Shooty", "Caim"],
    ["Boomy", "Atar"],
    ["Eye", "Kamaitachi"],
    ["Veyes", "Hraesvelgr"],
    ["Eyes", "Shinatsuhiko"],
    ["Novice Sorcerer", "Koropokkur"],
    ["Ice Sorcerer", "Icicle"],
    ["Flame Sorcerer", "Amy"],
    ["Elementalist", "Cherub"],
    ["Gummy Bear", "Seiryuu"],
    ["Panda", "Genbu"],
    ["Black Bear", "Byakko"],
    ["Grizzly Bear", "Suzaku"],
    ["Polar Bear", "Qilin"],
    ["Granite Golem", "Aegis"],
    ["Magnetic Golem", "Zipacna"],
    ["Stalactite Golem", "Vine"],
    ["Zombie", "Gullveig"],
    ["Vampire", "Namtar"],
    ["Werewolf", "Arioch"],
    ["Abyssal Imp", "Peri"],
    ["Soul Hunter", "Artemis"],
    ["Infernal Warlock", "Kagutsuchi"],
    ["Giant Shoebill", "Minotaur"],
    ["Marine Huntress", "Ungur"],
    ["Luna Empress", "Yaksha"],
    ["Gobo Chieftain", "Gungnir"],
    ["The Watcher", "Typhon"],
    ["Chronofrost Sorcerer", "Odin"],
    ["Red Panda", "Mikazuchi"],
    ["Crystal Colossus", "Kumbhakarna"],
    ["Dusk Revenant", "Resheph"],
    ["Demonic Overlord", "Phoenix"],
    ["Butterjerry", "Ratatoskr"],
    ["Jackalope", "Flora"],
    ["Dodocamel", "Sphinx"],
    ["Manticore", "Cerberus"],
    ["Griffin", "Griffin"],
    ["Rabid Rabbit", "Crocell"],
    ["Zombie Bear", "Thunderbird"],
    ["Acrobat", "Selkie"],
    ["Juggler", "Asura"],
    ["Magician", "Ukobach"],
    ["Deranged Jester", "Eurynome"],
    ["Enchanted Pawn", "Chronos"],
    ["Enchanted Knight", "Zabaniya"],
    ["Enchanted Bishop", "Asclepius"],
    ["Enchanted Rook", "Lailah"],
    ["Enchanted Queen", "Fortuna"],
    ["Enchanted King", "Mithra"],
    ["Squawker", "Siren"],
    ["Anchor Shark", "Kujata"],
    ["Brine Marksman", "Mizuhanome"],
    ["Tidal Conjuror", "Amphitrite"],
    ["Captain Fishhook", "Leviathan"],
    ["The Kraken", "Bahamut"],
    //maps
    ["Smelly Planet", "Firefly Valley"],
	["Swamp Planet", "Mistmire Swamp"],
	["Aqua Planet", "Abyssal Silence"],
	["Jungle Planet", "Umbral Grove"],
	["Gobo Planet", "Fallen Chasm"],
	["Planet Of The Eyes", "Corrupted Maw"],
	["Sorcerer's Tower", "Tower of Retribution"],
	["Bear With It", "Crescent Forest"],
	["Golem Cave", "Steel Corridor"],
	["Twilight Zone", "Ravenrest Graveyard"],
	["Infernal Abyss", "Crimson Arena"],
	["Smelly Planet (Elite)", "Firefly Valley (Elite)"],
	["Swamp Planet (Elite)", "Mistmire Swamp (Elite)"],
	["Aqua Planet (Elite)", "Abyssal Silence (Elite)"],
	["Jungle Planet (Elite)", "Umbral Grove (Elite)"],
	["Gobo Planet (Elite)", "Fallen Chasm (Elite)"],
	["Planet Of The Eyes (Elite)", "Corrupted Maw (Elite)"],
	["Sorcerer's Tower (Elite)", "Tower of Retribution (Elite)"],
	["Bear With It (Elite)", "Crescent Forest (Elite)"],
	["Golem Cave (Elite)", "Steel Corridor (Elite)"],
	["Twilight Zone (Elite)", "Ravenrest Graveyard (Elite)"],
	["Infernal Abyss (Elite)", "Crimson Arena (Elite)"],
	["Dungeons", "Mysterious Hallway"],
	["Chimerical Den", "Chimerical Den"],
	["Sinister Circus", "Asteroid Belt"],
	["Enchanted Fortress", "Holy Fortress"],
	["Pirate Cove", "Vanished Archipelago"]
  ]);

  const monsterNameRegex = new RegExp(`${[...monsterNameMap.keys()].map(key => `(?:${key})`).join("|")}`, "g");

  const CreateCustomIconElement = (imgsrc, svg, monsterId) => {
    const img = document.createElement('img');
    img.src = imgsrc;
    img.style.width = svg.getAttribute('width') || '100%';
    img.style.height = svg.getAttribute('height') || '100%';
    img.style.objectFit = 'contain';
    img.classList.add("replaced-monster-skin");
    img.setAttribute("data-monster-id", monsterId);
    return img;
  }

  // 负责修改在「交战#」一栏中出现的怪物名字和图标
  const ReplaceMonsterName = () => {
    document.querySelectorAll("div.CombatUnit_name__1SlO1").forEach(nameDiv => {
      const mappedName = monsterNameMap.get(nameDiv.textContent);
      if(mappedName) nameDiv.textContent = mappedName;
      const iconWrapper = nameDiv.parentElement.querySelector(":scope div.CombatUnit_monsterIcon__2g3AZ");
      if(!iconWrapper) return;
      if(iconWrapper.children[0].localName === "svg"){
        const svg = iconWrapper.children[0];
        const monsterId = svg.getAttribute("aria-label").split("/").at(-1);
        if(svg.nextElementSibling && svg.nextElementSibling.dataset.monsterId === monsterId) return;
        const imgsrc = monsterImageMap[monsterId];
        if(imgsrc){
          const img = CreateCustomIconElement(imgsrc, svg, monsterId);
          if(svg.nextElementSibling && svg.nextElementSibling.classList.contains("replaced-monster-skin")){
            svg.nextElementSibling.replaceWith(img);
          }
          else svg.insertAdjacentElement("afterend", img);
          svg.classList.add("monster-skin-invisible");
        }
      }
    });
  };

  // 负责修改出现在「战斗区域」一栏中的怪物名字和图标
  const replaceIcons = () => {
    // 处理SkillAction等区域的图标
    document.querySelectorAll('div.SkillAction_skillAction__1esCp:not([modified]), div.SkillActionDetail_regularComponent__3oCgr:not([modified]), div.CombatMonsterTooltip_combatMonsterTooltip__3TWKx:not([modified])').forEach(div => {
      const name = div.children[0].textContent;
      if(monsterNameMap.has(name)) div.children[0].textContent = monsterNameMap.get(name);
      else return;
      div.setAttribute("modified", "");
      for(const svg of [...div.querySelectorAll(":scope svg")]){
        const use = svg.children[0];
        const monsterId = use.href.baseVal.split("#").at(-1);
        const imgsrc = monsterImageMap[monsterId];
        if(imgsrc){
          const img = CreateCustomIconElement(imgsrc, svg, monsterId);
          svg.replaceWith(img);
        }
      }
    });

    // 专门处理SkillActionGrid中的SVG图标
    document.querySelectorAll('div.SkillActionGrid_skillActionGrid__1tJFk svg[role="img"][aria-label="action icon"]:not([data-replaced])').forEach(svg => {
      const use = svg.querySelector('use');
      if(!use) return;

      const monsterId = use.href.baseVal.split("#").at(-1);
      const imgsrc = monsterImageMap[monsterId];

      if(imgsrc){
        const img = CreateCustomIconElement(imgsrc, svg, monsterId);
        svg.setAttribute('data-replaced', 'true');
        svg.insertAdjacentElement('afterend', img);
        svg.classList.add("monster-skin-invisible");
      }
    });
  };

  const ReplaceTasks = () => {
    document.querySelectorAll("div.RandomTask_name__1hl1b:not([checked])").forEach(div => {
      div.setAttribute("checked", "");
      const svg = div.children[0];
      if(svg.getAttribute("aria-label") !== "Combat") return;
      const taskTitle = div.childNodes[1].textContent;
      const taskTitleComp = taskTitle.split("-");
      const possibleMonsterName = taskTitleComp.at(-1).trim();
      if(monsterNameMap.has(possibleMonsterName)){
        div.childNodes[1].textContent = `${taskTitleComp[0]} - ${monsterNameMap.get(possibleMonsterName)}`;
      }
    })
  };

  const ObserveHeader = () => {
    const header = document.querySelector("div.Header_displayName__1hN09:not([observing])");
    if(!header) return;
    header.setAttribute("observing", "");
    const ReplaceHeader = (mutlist, observer) => {
      observer.disconnect();
      const headerText = header.textContent;
      header.textContent = headerText.replaceAll(monsterNameRegex, (match) => monsterNameMap.get(match));
      observer.observe(header, {childList: true, subtree: true, characterData: true});
    };
    const observer = new MutationObserver(ReplaceHeader)
    observer.observe(header, {childList: true, subtree: true, characterData: true});
    ReplaceHeader(null, observer);
  };

  const ReplaceQueuedActions = () => {
    document.querySelectorAll("div.QueuedActions_text__3iRiY:not([modified])").forEach(div => {
      div.setAttribute("modified", "");
      div.childNodes.forEach(node => {
        if(node.nodeType !== Node.TEXT_NODE) return;
        node.textContent = node.textContent.replaceAll(monsterNameRegex, (match) => monsterNameMap.get(match));
      })
    });
  };

  const ReplaceTabNames = () => {
    document.querySelectorAll('button.MuiTab-root .MuiBadge-root:not([tab-modified])').forEach(tab => {
      const textNodes = Array.from(tab.childNodes).filter(node =>
        node.nodeType === Node.TEXT_NODE && node.textContent.trim()
      );

      const textNode = textNodes[textNodes.length - 1];
      if (!textNode) return;

      const originalName = textNode.textContent.trim();
      const mappedName = monsterNameMap.get(originalName);

      if (mappedName) {
        textNode.textContent = ` ${mappedName}`;
        tab.setAttribute('tab-modified', 'true');
      }
    });
  };

  // 启动监听器
  const observer = new MutationObserver((mutlist, observer) => {
    replaceIcons();
    ReplaceMonsterName();
    ReplaceTasks();
    ReplaceQueuedActions();
    ObserveHeader();
    ReplaceTabNames();
  });

  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

  // 初始延迟触发一次
  setTimeout(() => {
    replaceIcons();
    ReplaceTabNames();
  }, 500);
})();