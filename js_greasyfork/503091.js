// ==UserScript==
// @name         SR Tools中文翻译
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Replace specific text on the SR Tools webpage
// @author       You
// @match        https://srtools.pages.dev/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503091/SR%20Tools%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/503091/SR%20Tools%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 替换配置按类别分组
    const config = {
        "命途": {
            "Destruction": "毁灭",
            "The Hunt": "巡猎",
            "Erudition": "智识",
            "Harmony": "同谐",
            "Nihility": "虚无",
            "Preservation": "存护",
            "Abundance": "丰饶"
        },

         "高优先级": {

         },

        "遗器": {
                 //外圈
                 //////////////////////////////////////////////////
                "Genius of Brilliant Stars": "繁星璀璨的天才",
                "Genius's Ultraremote Sensing Visor": "天才的超距遥感",
                "Genius's Frequency Catcher": "天才的频变捕手",
                "Genius's Metafield Suit": "天才的元域深潜",
                "Genius's Gravity Walker": "天才的引力漫步",
                "Increases Quantum DMG by 10%.": "量子属性伤害提高 10.0% 。",
                "When the wearer deals DMG to the target enemy, ignores 10% DEF. If the target enemy has Quantum Weakness, the wearer additionally ignores 10% DEF.": "当装备者对敌方目标造成伤害时，无视其 10.0% 的防御力。若目标拥有量子属性弱点，额外无视其 10.0% 的防御力。",
                 /////////////////////////////////////////////////
                "Champion of Streetwise Boxing": "街头出身的拳王",
                "Champion's Headgear": "拳王的冠军护头",
                "Champion's Heavy Gloves": "拳王的重炮拳套",
                "Champion's Chest Guard": "拳王的贴身护胸",
                "Champion's Fleetfoot Boots": "拳王的弧步战靴",
                "Increases Physical DMG by 10%.": "物理属性伤害提高 10.0% 。",
                "After the wearer attacks or is hit, their ATK increases by 5% for the rest of the battle. This effect can stack up to 5 time(s).": "当装备者施放攻击或受到攻击后，其在本场战斗中攻击力提高 5.0% ，最多叠加 5.0 层。",
                 ////////////////////////////////////////////////
                "Guard of Wuthering Snow": "戍卫风雪的铁卫",
                "Guard's Cast Iron Helmet": "铁卫的铸铁面盔",
                "Guard's Shining Gauntlets": "铁卫的银鳞手甲",
                "Guard's Uniform of Old": "铁卫的旧制军服",
                "Guard's Silver Greaves": "铁卫的白银护胫",
                "Reduces DMG taken by 8%.": "受到伤害降低 8.0% 。",
                "At the beginning of the turn, if the wearer's HP is equal to or less than 50%, restores HP equal to 8% of their Max HP and regenerates 5 Energy.": "回合开始时，如果装备者当前生命值百分比小于等于 50.0% ，则回复等同于自身生命上限 8.0% 的生命值，并恢复 5.0 点能量。",
                 //////////////////////////////////////////////
                "Firesmith of Lava-Forging": "熔岩锻铸的火匠",
                "Firesmith's Obsidian Goggles": "火匠的黑曜目镜",
                "Firesmith's Ring of Flame-Mastery": "火匠的御火戒指",
                "Firesmith's Fireproof Apron": "火匠的阻燃围裙",
                "Firesmith's Alloy Leg": "火匠的合金义肢",
                "Increases Fire DMG by 10%.": "火属性伤害提高 10.0% 。",
                "Increases DMG by the wearer's Skill by 12%. After unleashing Ultimate, increases the wearer's Fire DMG by 12% for the next attack.": "使装备者战技造成的伤害提高 12.0% ，并使施放终结技后的下一次攻击造成的火属性伤害提高 12.0% 。",
                 ////////////////////////////////////////////////
                "Hunter of Glacial Forest": "密林卧雪的猎人",
                "Hunter's Artaius Hood": "雪猎的荒神兜帽",
                "Hunter's Lizard Gloves": "雪猎的巨蜥手套",
                "Hunter's Ice Dragon Cloak": "雪猎的冰龙披风",
                "Hunter's Soft Elkskin Boots": "雪猎的鹿皮软靴",
                "Increases Ice DMG by 10%.": "冰属性伤害提高 10.0% 。",
                "After the wearer uses their Ultimate, their CRIT DMG increases by 25% for 2 turn(s).": "当装备者施放终结技时，暴击伤害提高 25.0% ，持续 2.0 回合。",
                 //////////////////////////////////////////////
                "Band of Sizzling Thunder": "激奏雷电的乐队",
                "Band's Polarized Sunglasses": "乐队的偏光墨镜",
                "Band's Touring Bracelet": "乐队的巡演手绳",
                "Band's Leather Jacket With Studs": "乐队的钉刺皮衣",
                "Band's Ankle Boots With Rivets": "乐队的铆钉短靴",
                "Increases Lightning DMG by 10%.": "雷属性伤害提高 10.0% 。",
                "When the wearer uses their Skill, increases the wearer's ATK by 20% for 1 turn(s).": "当装备者施放战技时，使装备者的攻击力提高 20.0% ，持续 1.0 回合。",
                 /////////////////////////////////////////////
                "Eagle of Twilight Line": "晨昏交界的翔鹰",
                "Eagle's Beaked Helmet": "翔鹰的长喙头盔",
                "Eagle's Soaring Ring": "翔鹰的鹰击指环",
                "Eagle's Winged Suit Harness": "翔鹰的翼装束带",
                "Eagle's Quilted Puttees": "翔鹰的绒羽绑带",
                "Increases Wind DMG by 10%.": "风属性伤害提高 10.0% 。",
                "After the wearer uses their Ultimate, their action is Advanced Forward by 25%.": "当装备者施放终结技后，使其行动提前 25.0% 。",
                 ///////////////////////////////////////////////
                "Thief of Shooting Meteor": "流星追迹的怪盗",
                "Thief's Myriad-Faced Mask": "怪盗的千人假面",
                "Thief's Gloves With Prints": "怪盗的绘纹手套",
                "Thief's Steel Grappling Hook": "怪盗的纤钢爪钩",
                "Thief's Meteor Boots": "怪盗的流星快靴",
                "Increases Break Effect by 16%.": "击破特攻提高 16.0% 。",
                "Increases the wearer's Break Effect by 16%. After the wearer inflicts Weakness Break on an enemy, regenerates 3 Energy.": "使装备者的击破特攻提高 16.0% 。当装备者击破敌方目标弱点后，恢复 3.0 点能量。",
                 /////////////////////////////////////////////////
                "Messenger Traversing Hackerspace": "骇域漫游的信使",
                "Messenger's Holovisor": "信使的全息目镜",
                "Messenger's Transformative Arm": "信使的百变义手",
                "Messenger's Secret Satchel": "信使的密信挎包",
                "Messenger's Par-kool Sneakers": "信使的酷跑板鞋",
                "Increases SPD by 6%.": "速度提高 6.0% 。",
                "When the wearer uses their Ultimate on an ally, SPD for all allies increases by 12% for 1 turn(s). This effect cannot be stacked.": "当装备者对我方目标施放终结技时，我方全体速度提高 12.0% ，持续 1.0 回合，该效果无法叠加。",
                /////////////////////////////////////////////////
                "Wastelander of Banditry Desert": "盗匪荒漠的废土客",
                "Wastelander's Breathing Mask": "废土客的呼吸面罩",
                "Wastelander's Desert Terminal": "废土客的荒漠终端",
                "Wastelander's Friar Robe": "废土客的修士长袍",
                "Wastelander's Powered Greaves": "废土客的动力腿甲",
                "Increases Imaginary DMG by 10%.": "虚数属性伤害提高 10.0% 。",
                "When attacking debuffed enemies, the wearer's CRIT Rate increases by 10%, and their CRIT DMG increases by 20% against Imprisoned enemies.": "装备者对陷入负面效果的敌方目标造成伤害时暴击率提高 10.0% ，对陷入禁锢状态的敌方目标造成伤害时暴击伤害提高 20.0% 。",
                 ///////////////////////////////////////////////////
                "Longevous Disciple": "宝命长存的莳者",
                "Disciple's Prosthetic Eye": "莳者的复明义眼",
                "Disciple's Ingenium Hand": "莳者的机巧木手",
                "Disciple's Dewy Feather Garb": "莳者的承露羽衣",
                "Disciple's Celestial Silk Sandals": "莳者的天人丝履",
                "Increases Max HP by 12%.": "生命上限提高 12.0% 。",
                "When the wearer is hit or has their HP consumed by an ally or themselves, their CRIT Rate increases by 8% for 2 turn(s) and up to 2 stacks.": "当装备者受到攻击或被我方目标消耗生命值后，暴击率提高 8.0% ，持续 2.0 回合，该效果最多叠加 2.0 层。",
                 //////////////////////////////////////////////////
                "Knight of Purity Palace": "净庭教宗的圣骑士",
                "Knight's Forgiving Casque": "圣骑的宽恕盔面",
                "Knight's Silent Oath Ring": "圣骑的沉默誓环",
                "Knight's Solemn Breastplate": "圣骑的肃穆胸甲",
                "Knight's Iron Boots of Order": "圣骑的秩序铁靴",
                "Increases DEF by 15%.": "防御力提高 15.0% 。",
                "Increases the max DMG that can be absorbed by the Shield created by the wearer by 20%.": "使装备者提供的护盾量提高 20.0% 。",
                //////////////////////////////////////////////////
                "Passerby of Wandering Cloud": "云无流迹的过客",
                "Passerby's Rejuvenated Wooden Hairstick": "过客的逢春木簪",
                "Passerby's Roaming Dragon Bracer": "过客的游龙臂鞲",
                "Passerby's Ragged Embroided Coat": "过客的残绣风衣",
                "Passerby's Stygian Hiking Boots": "过客的冥途游履",
                "Increases Outgoing Healing by 10%.": "治疗量提高 10.0% 。",
                "At the start of the battle, immediately regenerates 1 Skill Point.": "在战斗开始时，立即为我方恢复1个战技点。",
                ///////////////////////////////////////////////////
                "Musketeer of Wild Wheat": "野穗伴行的快枪手",
                "Musketeer's Wild Wheat Felt Hat": "快枪手的野穗毡帽",
                "Musketeer's Coarse Leather Gloves": "快枪手的粗革手套",
                "Musketeer's Wind-Hunting Shawl": "快枪手的猎风披肩",
                "Musketeer's Rivets Riding Boots": "快枪手的铆钉马靴",
                "Increases ATK by 12%.": "攻击力提高 12.0% 。",
                "The wearer's SPD increases by 6% and DMG dealt by Basic ATK increases by 10%.": "使装备者的速度提高 6.0% ，普攻造成的伤害提高 10.0% 。",
                 /////////////////////////////////////////////////
                "The Ashblazing Grand Duke": "毁烬焚骨的大公",
                "Grand Duke's Crown of Netherflame": "大公的冥焰冠冕",
                "Grand Duke's Gloves of Fieryfur": "大公的绒火指套",
                "Grand Duke's Robe of Grace": "大公的蒙恩长袍",
                "Grand Duke's Ceremonial Boots": "大公的绅雅礼靴",
                "Increases the DMG dealt by follow-up attack by 20%.": "追加攻击造成的伤害提高 20.0% 。",
                "When the wearer uses follow-up attacks, increases the wearer's ATK by 6% for every time the follow-up attack deals DMG. This effect can stack up to 8 time(s) and lasts for 3 turn(s). This effect is removed the next time the wearer uses a follow-up attack.":
                 "装备者施放追加攻击时，根据追加攻击造成伤害的次数，每次造成伤害时使装备者的攻击力提高 6.0% ，最多叠加 8.0 次，持续 3.0 回合。该效果在装备者下一次施放追加攻击时移除。",
                 //////////////////////////////////////////////////
                "Prisoner in Deep Confinement": "幽锁深牢的系囚",
                "Prisoner's Sealed Muzzle": "系囚的合啮拘笼",
                "Prisoner's Leadstone Shackles": "系囚的铅石梏铐",
                "Prisoner's Repressive Straitjacket": "系囚的幽闭缚束",
                "Prisoner's Restrictive Fetters": "系囚的绝足锁桎",
                "Increases ATK by 12%.": "攻击力提高 12.0% 。",
                "For every DoT the enemy target is afflicted with, the wearer will ignore 6% of its DEF when dealing DMG to it. This effect is valid for a max of 3 DoTs.": "敌方目标每承受1个持续伤害效果，装备者对其造成伤害时就无视其 6.0% 的防御力，最多计入 3.0 个持续伤害效果。",
                 //////////////////////////////////////////////////
                "Pioneer Diver of Dead Waters": "死水深潜的先驱",
                "Pioneer's Heatproof Shell": "先驱的绝热围壳",
                "Pioneer's Lacuna Compass": "先驱的虚极罗盘",
                "Pioneer's Sealed Lead Apron": "先驱的密合铅衣",
                "Pioneer's Starfaring Anchor": "先驱的泊星桩锚",
                "Increases DMG dealt to enemies with debuffs by 12%.": "对受负面状态影响的敌人造成的伤害提高 12.0% 。",
                "Increases CRIT Rate by 4%. The wearer deals 8%/12% increased CRIT DMG to enemies with at least 2/3 debuffs. After the wearer inflicts a debuff on enemy targets, the aforementioned effects increase by 100%, lasting for 1 turn(s).":
                 "暴击率提高 4.0% ，装备者对陷入不少于 2.0 / 3.0 个负面效果的敌方目标造成的暴击伤害提高 8.0% / 12.0% 。装备者对敌方目标施加负面效果后，上述效果提高 100% ，持续 1.0 回合。",
                ///////////////////////////////////////////////////
                "Watchmaker, Master of Dream Machinations": "机心戏梦的钟表匠",
                "Watchmaker's Telescoping Lens": "钟表匠的极目透镜",
                "Watchmaker's Fortuitous Wristwatch": "钟表匠的交运腕表",
                "Watchmaker's Illusory Formal Suit": "钟表匠的空幻礼服",
                "Watchmaker's Dream-Concealing Dress Shoes": "钟表匠的隐梦革履",
                "Increases Break Effect by 16%.": "击破特攻提高 16.0% 。",
                "When the wearer uses their Ultimate on an ally, all allies' Break Effect increases by 30% for 2 turn(s). This effect cannot be stacked.": "当装备者对我方目标施放终结技时，我方全体击破特攻提高 30.0% ，持续 2.0 回合，该效果无法叠加。",
                //////////////////////////////////////////////////
                "Iron Cavalry Against the Scourge": "荡除蠹灾的铁骑",
                "Iron Cavalry's Homing Helm": "铁骑的索敌战盔",
                "Iron Cavalry's Crushing Wristguard": "铁骑的摧坚铁腕",
                "Iron Cavalry's Silvery Armor": "铁骑的银影装甲",
                "Iron Cavalry's Skywalk Greaves": "铁骑的行空护胫",
                "Increases Break Effect by 16%.": "击破特攻提高 16.0% 。",
                "If the wearer's Break Effect is 150% or higher, the Break DMG dealt to the enemy target ignores 10% of their DEF. If the wearer's Break Effect is 250% or higher, the Super Break DMG dealt to the enemy target additionally ignores 15% of their DEF.":
                 "当装备者的击破特攻大于等于 150.0% 时，对敌方目标造成的击破伤害无视其 10.0% 的防御力。当装备者的击破特攻大于等于 250.0% 时，对敌方目标造成的超击破伤害额外无视其 15.0% 的防御力。",
                 /////////////////////////////////////////////////
                "The Wind-Soaring Valorous": "风举云飞的勇烈",
                "Valorous Mask of Northern Skies": "勇烈的玄枵面甲",
                "Valorous Bracelet of Grappling Hooks": "勇烈的钩爪腕甲",
                "Valorous Plate of Soaring Flight": "勇烈的飞翎瓷甲",
                "Valorous Greaves of Pursuing Hunt": "勇烈的逐猎腿甲",
                "Increases ATK by 12%.": "攻击力提高 12.0% 。",
                "Increases the wearer's CRIT Rate by 6%. After the wearer uses follow-up attack, increases DMG dealt by Ultimate by 36%, lasting for 1 turn(s).": "使装备者的暴击率提高 6.0% ，装备者施放追加攻击时，使终结技造成的伤害提高 36.0% ，持续 1.0 回合。",
                 ////////////////////////////////////////////////


                //内圈
                 //////////////////////////////////////////////
                "Pan-Cosmic Commercial Enterprise": "泛银河商业公司",
                "The IPC's Mega HQ": "公司的巨构总部",
                "The IPC's Trade Route": "公司的贸易航道",
                "Increases the wearer's Effect Hit Rate by 10%. Meanwhile, the wearer's ATK increases by an amount that is equal to 25% of the current Effect Hit Rate, up to a maximum of 25%.":
                 "使装备者的效果命中提高 10.0% 。同时提高装备者等同于当前效果命中 25.0% 的攻击力，最多提高 25.0% 。",
                 ////////////////////////////////////////////
                "Rutilant Arena": "繁星竞技场",
                "Taikiyan Laser Stadium": "泰科铵的镭射球场",
                "Taikiyan's Arclight Race Track": "泰科铵的弧光赛道",
                "Increases the wearer's CRIT Rate by 8%. When the wearer's current CRIT Rate reaches 70% or higher, DMG dealt by Basic ATK and Skill increases by 20%.": "使装备者的暴击率提高 8.0% 。当装备者的当前暴击率大于等于 70.0% 时，普攻和战技造成的伤害提高 20.0% 。",
                 //////////////////////////////////////////
                "Sprightly Vonwacq": "生命的瓮瓦克",
                "Vonwacq's Island of Birth": "翁瓦克的诞生之岛",
                "Vonwacq's Islandic Coast": "翁瓦克的环岛海岸",
                "Increases the wearer's Energy Regeneration Rate by 5%. When the wearer's SPD reaches 120 or higher, the wearer's action is Advanced Forward by 40% immediately upon entering battle.":
                 "使装备者的能量恢复效率提高 5.0% 。当装备者的速度大于等于 120.0 时，进入战斗时立刻使行动提前 40.0% 。",
                 ////////////////////////////////////////
                "Inert Salsotto": "停转的萨尔索图",
                "Salsotto's Moving City": "萨尔索图的移动城市",
                "Salsotto's Terminator Line": "萨尔索图的晨昏界线",
                "Increases the wearer's CRIT Rate by 8%. When the wearer's current CRIT Rate reaches 50% or higher, the DMG dealt by the wearer's Ultimate and follow-up attack increases by 15%.":
                 "使装备者的暴击率提高 8.0% 。当装备者当前暴击率大于等于 50.0% 时，终结技和追加攻击造成的伤害提高 15.0% 。",
                 ///////////////////////////////////////
                "Talia: Kingdom of Banditry": "盗贼公国的塔利亚",
                "Talia's Nailscrap Town": "塔利亚的钉壳小镇",
                "Talia's Exposed Electric Wire": "塔利亚的裸皮电线",
                "Increases the wearer's Break Effect by 16%. When the wearer's SPD reaches 145 or higher, the wearer's Break Effect increases by an extra 20%.": "使装备者的击破特攻提高 16.0% 。当装备者的速度大于等于 145.0 时，击破特攻额外提高 20.0% 。",
                 //////////////////////////////////////////
                "Celestial Differentiator": "星体差分机",
                "Planet Screwllum's Mechanical Sun": "螺丝星的机械烈阳",
                "Planet Screwllum's Ring System": "螺丝星的环星孔带",
                "Increases the wearer's CRIT DMG by 16%. When the wearer's current CRIT DMG reaches 120% or higher, after entering battle, the wearer's CRIT Rate increases by 60% until the end of their first attack.":
                 "使装备者的暴击伤害提高 16.0% 。当装备者的暴击伤害大于等于 120.0% 时，进入战斗后装备者的暴击率提高 60.0% ，持续到施放首次攻击后结束。",
                 //////////////////////////////////////////
                "Fleet of the Ageless": "不老的仙舟",
                "The Xianzhou Luofu's Celestial Ark": "罗浮仙舟的天外楼船",
                "The Xianzhou Luofu's Ambrosial Arbor Vines": "罗浮仙舟的建木枝蔓",
                "Increases the wearer's Max HP by 12%. When the wearer's SPD reaches 120 or higher, all allies' ATK increases by 8%.": "使装备者的生命上限提高 12.0% 。当装备者的速度大于等于 120.0 时，我方全体攻击力提高 8.0% 。",
                 /////////////////////////////////////////
                "Space Sealing Station": "太空封印站",
                "Herta's Space Station": "「黑塔」的空间站点",
                "Herta's Wandering Trek": "「黑塔」的漫历轨迹",
                "Increases the wearer's ATK by 12%. When the wearer's SPD reaches 120 or higher, the wearer's ATK increases by an extra 12%.": "使装备者的攻击力提高 12.0% 。当装备者的速度大于等于 120.0 时，攻击力额外提高 12.0% 。",
                 ////////////////////////////////////////
                "Broken Keel": "折断的龙骨",
                "Insumousu's Whalefall Ship": "伊须磨洲的残船鲸落",
                "Insumousu's Frayed Hawser": "伊须磨洲的坼裂缆索",
                "Increases the wearer's Effect RES by 10%. When the wearer's Effect RES is at 30% or higher, all allies' CRIT DMG increases by 10%.": "使装备者的效果抵抗提高 10.0% 。当装备者的效果抵抗大于等于 30.0% 时，我方全体暴击伤害提高 10.0% 。",
                 ///////////////////////////////////////
                "Firmament Frontline: Glamoth": "苍穹战线格拉默",
                "Glamoth's Iron Cavalry Regiment": "格拉默的铁骑兵团",
                "Glamoth's Silent Tombstone": "格拉默的寂静坟碑",
                "Increases the wearer's ATK by 12%. When the wearer's SPD is equal to or higher than 135/160, the wearer deals 12%/18% more DMG.": "使装备者的攻击力提高 12.0% 。当装备者的速度大于等于 135.0 / 160.0 时，使装备者造成的伤害提高 12.0% / 18.0% 。",
                 //////////////////////////////////////
                "Penacony, Land of the Dreams": "梦想之地匹诺康尼",
                "Penacony's Grand Hotel": "匹诺康尼的堂皇酒店",
                "Penacony's Dream-Seeking Tracks": "匹诺康尼的逐梦轨道",
                "Increases wearer's Energy Regeneration Rate by 5%. Increases DMG by 10% for all other allies that are of the same Type as the wearer.": "使装备者的能量恢复效率提高 5.0% 。使队伍中与装备者属性相同的我方其他角色造成的伤害提高 10.0% 。",
                 ////////////////////////////////////
                "Sigonia, the Unclaimed Desolation": "无主荒星茨冈尼亚",
                "Sigonia's Gaiathra Berth": "茨冈尼亚的母神卧榻",
                "Sigonia's Knot of Cyclicality": "茨冈尼亚的轮回纽结",
                "Increases the wearer's CRIT Rate by 4%. When an enemy target gets defeated, the wearer's CRIT DMG increases by 4%, stacking up to 10 time(s).": "使装备者的暴击率提高 4.0% 。当敌方目标被消灭时，装备者暴击伤害提高 4.0% ，最多叠加 10.0 层。",
                 ///////////////////////////////////
                "Izumo Gensei and Takama Divine Realm": "出云显世与高天神国",
                "Izumo's Magatsu no Morokami": "出云的祸津众神",
                "Izumo's Blades of Origin and End": "出云的终始一刀",
                "Increases the wearer's ATK by 12%. When entering battle, if at least one other ally follows the same Path as the wearer, then the wearer's CRIT Rate increases by 12%.":
                 "使装备者的攻击力提高 12.0% 。进入战斗时，若至少存在一名与装备者命途相同的队友，装备者的暴击率提高 12.0% 。",
                 /////////////////////////////////
                "Forge of the Kalpagni Lantern": "劫火莲灯铸炼宫",
                "Forge's Lotus Lantern Wick": "铸炼宫的莲华灯芯",
                "Forge's Heavenly Flamewheel Silk": "铸炼宫的焰轮天绸",
                "Increases the wearer's SPD by 6%. When the wearer hits an enemy target that has Fire Weakness, the wearer's Break Effect increases by 40%, lasting for 1 turn(s).": "使装备者的速度提高 6.0% 。当装备者击中拥有火属性弱点的敌方目标时，击破特攻提高 40.0% ，持续 1.0 回合。",
                 ////////////////////////////////
                "Duran, Dynasty of Running Wolves": "奔狼的都兰王朝",
                "Duran's Tent of Golden Sky": "都蓝的穹窿金帐",
                "Duran's Mechabeast Bridle": "都蓝的器兽缰辔",
                "When an ally uses follow-up attack, the wearer gains 1 stack of Merit, stacking up to 5 time(s). Each stack of Merit increases the DMG dealt by the wearer's follow-up attacks by 5%. When there are 5 stacks, additionally increases the wearer's CRIT DMG by 25%.":
                 "我方角色施放追加攻击时，装备者获得一层【功勋】，最多叠加 5.0 层，每层【功勋】使装备者追加攻击造成的伤害提高 5.0% ，叠满 5.0 层时，额外使装备者的暴击伤害提高 25.0% 。",
                 /////////////////////////////////////
                "Belobog of the Architects": "筑城者的贝洛伯格",
                "Belobog's Fortress of Preservation": "贝洛伯格的存护堡垒",
                "Belobog's Iron Defense": "贝洛伯格的铁卫防线",
                "Increases the wearer's DEF by 15%. When the wearer's Effect Hit Rate is 50% or higher, the wearer gains an extra 15% DEF.": "使装备者的防御力提高 15.0% 。当装备者的效果命中大于等于 50.0% 时，防御力额外提高 15.0% 。",
                 ////////////////////////////////////
                "Lushaka, the Sunken Seas": "沉陆海域露莎卡",
                "Lushaka's Waterscape": "露莎卡的水朽苍都",
                "Lushaka's Twinlanes": "露莎卡的双生航道",
                "Increases the wearer's Effect RES by 10%. If the wearer is not the first character in the team lineup, then increase the ATK of the first character in the team lineup by 16%.":
                 "使装备者的效果抵抗提高 10.0% ，如果装备者不是编队中的第一位角色，使编队中的第一位角色攻击力提高 16.0% 。",
                 ////////////////////////////////////
                "The Wondrous BananAmusement Park": "奇想蕉乐园",
                "BananAmusement Park's BananAxis Plaza": "蕉乐园的蕉芯广场",
                "BananAmusement Park's Memetic Cables": "蕉乐园的模因线缆",
                "Increases the wearer's CRIT DMG by 16%. When a target summoned by the wearer is on the field, CRIT DMG additionally increases by 28%.": "使装备者的暴击伤害提高 16.0% ，当存在装备者召唤的目标时，暴击伤害额外提高 28.0% 。",
                 ////////////////////////////////////
        },

        "光锥": {
            //毁灭光锥
            //三星
            //////////////////////////////////////////
            "Mutual Demise": "俱殁",
            "If the wearer's current HP is lower than 80%, CRIT Rate increases by": "装备者当前生命值百分比小于 80.0% 时，暴击率提高",
            ////////////////////////////////////////////
            "Shattered Home": "乐圮",
            "The wearer deals": "使装备者对当前生命值百分比大于 50.0% 的敌方目标造成的伤害提高",
            "more DMG to enemy targets whose HP percentage is greater than 50%.": "。",
            ///////////////////////////////////////////
            "Collapsing Sky": "天倾",
            "The wearer's Basic ATK and Skill deals": "使装备者普攻和战技造成的伤害提高",
            "The wearer's Basic ATK and Skill deal": "使装备者普攻和战技造成的伤害提高",
            "more DMG.": "。",//临时解决
            ////////////////////////////////////////////
            //四星
            ////////////////////////////////////////////
            "The Moles Welcome You": "鼹鼠党欢迎你",
            "When the wearer uses Basic ATK, Skill, or Ultimate to attack enemies, the wearer gains one stack of Mischievous. Each stack increases the wearer's ATK by": "装备者施放普攻、战技或终结技攻击敌方目标后，分别获取一层【淘气值】。每层使装备者的攻击力提高",
            ///////////////////////////////////////////
            "Under the Blue Sky": "在蓝天下",
            ". When the wearer defeats an enemy, the wearer's CRIT Rate increases by": " ，当装备者消灭敌方目标后，暴击率提高",
            "for 3 turn(s).": " ，持续 3.0 回合。",
            //////////////////////////////////////////
            "A Secret Vow": "秘密誓心",
            "Increases DMG dealt by the wearer by": "使装备者造成的伤害提高",
            ". The wearer also deals an extra": "，同时对当前生命值百分比大于等于装备者自身当前生命值百分比的敌方目标造成的伤害额外提高",
            "of DMG to enemies whose current HP percentage is equal to or higher than the wearer's current HP percentage.": "。",//临时解决
            /////////////////////////////////////////////
            "Woof! Walk Time!": "汪！散步时间！",
            ", and increases their DMG to enemies afflicted with Burn or Bleed by": "，对处于灼烧或裂伤状态的敌方目标造成的伤害提高",
            ". This also applies to DoT.": "，该效果对持续伤害也会生效。",
            /////////////////////////////////////////
            "Nowhere to Run": "无处可逃",
            ". Whenever the wearer defeats an enemy, they restore HP equal to": "。当装备者消灭敌方目标时，回复等同于自身",
            "of their ATK.": "攻击力的生命值。",
            /////////////////////////////////////////
            "Flames Afar": "在火的远处",
            "When the wearer's cumulative HP loss during one attack exceeds 25% of their Max HP, or if the amount of their own HP consumed at one time is greater than 25% of their Max HP, immediately heals the wearer for 15% of their Max HP, and at the same time, increases the DMG they deal by":
            "当装备者在单次受到攻击中累计损失的生命值超过最大生命值的 25.0% ，或单次消耗自身生命值超过最大生命值的 25.0% ，则立即回复等同于装备者生命上限 15.0% 的生命值，同时使装备者造成的伤害提高",
            "for 2 turn(s). This effect can only be triggered once every 3 turn(s).": " ，持续 2.0 回合。该效果每 3.0 回合只能触发1次。",
            ///////////////////////////////////////////
            "Indelible Promise": "铭记于心的约定",
            ". When the wearer uses their Ultimate, increases CRIT Rate by": "。当装备者施放终结技时，暴击率提高",
            ", lasting for 2 turn(s).": "，持续 2.0 回合。",
            ///////////////////////////////////////////
            //五星
            ///////////////////////////////////////////
            "I Shall Be My Own Sword": "此身为剑",
            "Increases the wearer's CRIT DMG by": "使装备者的暴击伤害提高",
            ". When an ally (excluding the wearer) gets attacked or loses HP, the wearer gains 1 stack of Eclipse, up to a max of 3 stack(s). Each stack of Eclipse increases the DMG of the wearer's next attack by":
            "。当队友受到攻击或消耗生命值后，装备者获得1层【月蚀】，最多叠加 3.0 层。每层【月蚀】使装备者下一次攻击造成的伤害提高",
            ". When 3 stack(s) are reached, additionally enables that attack to ignore": " 。叠满 3.0 层时，额外使该次攻击无视目标",
            "of the enemy's DEF. This effect will be removed after the wearer uses an attack.": "的防御力。该效果在装备者施放攻击后解除。",
            ///////////////////////////////////////////
            "Something Irreplaceable": "无可取代的东西",
            "Increases the wearer's ATK by": "使装备者的攻击力提高",
            ". When the wearer defeats an enemy or is hit, immediately restores HP equal to": " 。当装备者消灭敌方目标或受到攻击后，立即回复等同于装备者攻击力",
            "of the wearer's ATK. At the same time, the wearer's DMG is increased by": " 的生命值，同时造成的伤害提高",
            "until the end of their next turn. This effect cannot stack and can only trigger 1 time per turn.": " ，持续到自身下个回合结束。该效果不可叠加，每回合只可触发1次。",
            ////////////////////////////////////////////
            "The Unreachable Side": "到不了的彼岸",
            "Increases the wearer's CRIT rate by": "使装备者的暴击率提高",
            "and increases their Max HP by": " ，生命上限提高",
            ". When the wearer is attacked or consumes their own HP, their DMG increases by": "。当装备者受到攻击或装备者消耗自身生命值后，造成的伤害提高",
            ". This effect is removed after the wearer uses an attack.": "，该效果在装备者施放攻击后解除。",
            ///////////////////////////////////////////
            "On the Fall of an Aeon": "记一位星神的陨落",
            "When the wearer attacks, increases their ATK by": "当装备者施放攻击时，使装备者本场战斗中的攻击力提高",
            "in this battle. This effect can stack up to 4 time(s). After the wearer breaks an enemy's Weakness, increases DMG dealt by": " ，该效果最多叠加 4.0 层。当装备者击破敌方目标弱点后，造成的伤害提高",
            ", lasting for 2 turn(s).": " ，持续 2.0 回合。",
            //////////////////////////////////////////
            "Brighter Than the Sun": "比阳光更明亮的",
            ". When the wearer uses their Basic ATK, they will gain 1 stack of Dragon's Call, lasting for 2 turns. Each stack of Dragon's Call increases the wearer's ATK by": " 。当装备者施放普攻时，获得1层【龙吟】，持续 2.0 回合。每层【龙吟】使装备者的攻击力提高",
            "and Energy Regeneration Rate by": "，能量恢复效率提高",
            ". Dragon's Call can be stacked up to 2 times.": " 。【龙吟】最多叠加 2.0 层。",
            //////////////////////////////////////////
            "Whereabouts Should Dreams Rest": "梦应归于何处",
            "Increases the wearer's Break Effect by": "使装备者的击破特攻提高",
            ". When the wearer deals Break DMG to an enemy target, inflicts Routed on the enemy":" 。当装备者对敌方目标造成击破伤害时，使敌方陷入【溃败】状态",
            "Targets afflicted with Routed receive":" 【溃败】状态下目标受到装备者造成的击破伤害提高",
            "increased Break DMG from the wearer, and their SPD is lowered by 20%. Effects of the same type cannot be stacked.": " ，速度降低 20.0% ，同类效果无法叠加。",
            ///////////////////////////////////////////
            "Dance at Sunset": "落日时起舞",
            "Greatly increases the wearer's chance of getting attacked and increases CRIT DMG by": "使装备者受到攻击的概率大幅提高，暴击伤害提高",
            ". After the wearer uses Ultimate, receives 1 stack of Firedance, lasting for 2 turns and stacking up to 2 time(s). Each stack of Firedance increases the DMG dealt by the wearer's follow-up attack by ":
            "。当装备者施放终结技后，获得1层【火舞】，持续2回合，最多叠加 2.0 层。每层【火舞】使装备者追加攻击造成的伤害提高",
            /////////////////////////////////////////

            //巡猎光锥
            //三星
            /////////////////////////////////////////////////
            "Arrows": "锋镝",
            "At the start of the battle, the wearer's CRIT Rate increases by": "战斗开始时，使装备者的暴击率提高",
            /////////////////////////////////////////////////
            "Darting Arrow": "离弦",
            "When the wearer defeats an enemy, increases ATK by": "使装备者消灭敌方目标后，攻击力提高",
            ///////////////////////////////////////////////////
            "Adversarial": "相抗",
            "When the wearer defeats an enemy, increases SPD by": "使装备者在消灭敌方目标后，速度提高",
            /////////////////////////////////////////////////////
            //四星
            /////////////////////////////////////////////////
            "Swordplay": "论剑",
            "For each time the wearer hits the same target, DMG dealt increases by": "当装备者多次击中同一敌方目标时，每次造成的伤害提高",
            ", stacking up to 5 time(s). This effect will be dispelled when the wearer changes targets.": " ，该效果最多叠加 5.0 层。若攻击目标发生变化，立即解除当前的增益效果。",
            /////////////////////////////////////////////////
            "River Flows in Spring": "春水初生",
            "After entering battle, increases the wearer's SPD by": "进入战斗后，使装备者速度提高",
            "and DMG by": "，造成的伤害提高",
            ". When the wearer takes DMG, this effect will disappear. This effect will resume after the end of the wearer's next turn.": "。当装备者受到伤害后该效果失效，下个回合结束时该效果恢复。",
            /////////////////////////////////////////////////
            "Return to Darkness": "重返幽冥",
            ". After a CRIT Hit, there is a": "。暴击后有",
            "fixed chance to dispel 1 buff on the target enemy. This effect can only trigger 1 time per attack.": "的固定概率解除被攻击敌方目标所持有的1个增益效果，该效果每次攻击只可触发1次。",
            ////////////////////////////////////////////////
            "Only Silence Remains": "唯有沉默",
            ". If there are 2 or fewer enemies on the field, increases wearer's CRIT Rate by": " 。当场上的敌方目标数量小于等于2时，装备者的暴击率提高",
            ////////////////////////////////////////////////
            "Subscribe for More!": "点个关注吧！",
            "more DMG. This effect increases by an extra": "，当装备者的当前能量值等于其能量上限时，该效果额外提高",
            "when the wearer's current Energy reaches its max level.": "，当装备者的当前能量值等于其能量上限时，该效果额外提高",
            ////////////////////////////////////////////////
            "Final Victor": "最后的赢家",
            ". When the wearer lands a CRIT hit on enemies, gains 1 stack of Good Fortune. This can stack up to 4 time(s). Every stack of Good Fortune increases the wearer's CRIT DMG by":
            " 。当装备者对敌方目标造成暴击后获得一层【好运】，最多叠加 4.0 层。每层【好运】使装备者的暴击伤害提高",
            ". Good Fortune will be removed at the end of the wearer's turn.": "，【好运】在装备者的回合结束时移除。",
            ////////////////////////////////////////////
            "Shadowed by Night": "黑夜如影随行",
            ". Upon entering battle or dealing Break DMG, increases SPD by": "。进入战斗时或造成击破伤害后，速度提高",
            "This effect can only be triggered 1 time per turn.": "。",
            /////////////////////////////////////////////
            //五星
            ///////////////////////////////////////////
            "In the Night": "于夜色中",
            ". While the wearer is in battle, for every 10 SPD that exceeds 100, increases DMG dealt by Basic ATK and Skill by": " 。当装备者在战斗中速度大于 100 时，每超过 10.0 点，普攻和战技造成的伤害提高",
            ". At the same time, increases the CRIT DMG of Ultimate by": "，同时终结技的暴击伤害提高",
            ". This effect can stack up to 6 time(s).": " ，该效果可叠加 6.0 层。",
            //////////////////////////////////////////
            "Sleep Like the Dead": "如泥酣眠",
            ". When the wearer's Basic ATK or Skill DMG does not result in a CRIT Hit, increases their CRIT Rate by": " 。当装备者的普攻或战技伤害未造成暴击时，使自身暴击率提高",
            ", lasting for 1 turn(s). This effect can only trigger once every 3 turn(s).": "，持续 1.0 回合。该效果每 3.0 回合可以触发1次。",
            ////////////////////////////////////////////
            "Cruising in the Stellar Sea": "星海巡航",
            ", and increases their CRIT rate against enemies with HP less than or equal to 50% by an extra": " ，装备者对生命值百分比小于等于 50.0% 的敌方目标暴击率额外提高 ",
            ". When the wearer defeats an enemy, their ATK is increased by": " 。当装备者消灭敌方目标后，攻击力提高",
            "for 2 turn(s).": "，持续 2.0 回合。",
            /////////////////////////////////////////////
            "Worrisome, Blissful": "烦恼着，幸福着",
            "Increase the wearer's CRIT Rate by": "使装备者暴击率提高",
            "and increases DMG dealt by follow-up attack by": "，追加攻击造成的伤害提高",
            ". After the wearer uses a follow-up attack, inflicts the target with the Tame state, stacking up to 2 time(s). When allies hit enemy targets under the Tame state, each Tame stack increases the CRIT DMG dealt by":
            "。装备者施放追加攻击后，使目标陷入【温驯】状态，该效果最多叠加 2.0 层。我方目标击中【温驯】状态下的敌方目标时，每层【温驯】使造成的暴击伤害提高",
            ////////////////////////////////////////////
            "Baptism of Pure Thought": "纯粹思维的洗礼",
            ". For every debuff on the enemy target, the wearer's CRIT DMG dealt against this target additionally increases by": " 。敌方目标每承受1个负面效果，装备者对其造成的暴击伤害额外提高",
            ", stacking up to 3 times. When using Ultimate to attack the enemy target, the wearer receives the Disputation effect, which increases DMG dealt by": " ，最多叠加 3.0 层。施放终结技攻击敌方目标时，使装备者获得【论辩】效果，造成的伤害提高",
            "and enables their follow-up attacks to ignore": " ，追加攻击无视目标",
            "of the target's DEF. This effect lasts for 2 turns.": "的防御力，该效果持续 2.0 回合。",
            ///////////////////////////////////////////////
            "Sailing Towards a Second Life": "驶向第二次生命",
            ". The Break DMG dealt by the wearer ignores": " ，造成的击破伤害无视目标",
            "of the target's DEF. When the wearer's Break Effect in battle is at 150% or greater, increases their SPD by": "的防御力。当装备者在战斗中击破特攻大于等于 150.0% 时，速度提高",
            ////////////////////////////////////////////////
            "I Venture Forth to Hunt": "我将，巡征追猎",
            "Increases the wearer's CRIT Rate by": "使装备者的暴击率提高",
            ". When any single ally uses an attack, the wearer gains 1 stack of Luminflux to a max of 6 stack(s). Each stack of Luminflux enables the Ultimate DMG deal by the wearer to ignore ":
            "。我方任意单体目标施放攻击后，装备者获得1层【流光】，最多叠加 6.0 层。每层【流光】使装备者造成的终结技伤害无视目标",
            "of the target's DEF. This effect will be dispelled after the wearer uses their Ultimate.": "的防御力，该效果在装备者施放终结技后解除。",
            //////////////////////////////////////////////

            //智识光锥
            //三星
            //////////////////////////////////////////////
            "Sagacity": "睿见",
            "When the wearer uses their Ultimate, increases ATK by": "当装备者施放终结技时，攻击力提高",
            ///////////////////////////////////////////////
            "Data Bank": "智库",
            "Increases DMG dealt by the wearer's Ultimate by": "使装备者终结技造成的伤害提高",
            /////////////////////////////////////////////////
            "Passkey": "灵钥",
            "After the wearer uses their Skill, additionally regenerates": "使装备者施放战技后额外恢复",
            "Energy. This effect cannot be repeatedly triggered in a single turn.": "点能量，该效果单个回合内不可重复触发。",
            /////////////////////////////////////////////
            //四星
            ///////////////////////////////////////////////
            "The Birth of the Self": "「我」的诞生",
            "Increases DMG dealt by the wearer's follow-up attacks by": "使装备者追加攻击造成的伤害提高",
            ". If the current HP of the target enemy is below or equal to 50%, increases DMG dealt by follow-up attacks by an extra": "。若该敌方目标当前生命值百分比小于等于 50.0% ，则追加攻击造成的伤害额外提高",
            /////////////////////////////////////////////
            "Today Is Another Peaceful Day": "今日亦是和平的一日",
            "After entering battle, increases the wearer's DMG based on their Max Energy. Each point of Energy increases DMG by": "进入战斗后，根据装备者的能量上限，提高装备者造成的伤害：每点能量提高",
            ". A max of 160 Energy will be taken into account for this.": "，最多计入 160.0 点。",
            //////////////////////////////////////////////////////////
            "The Seriousness of Breakfast": "早餐的仪式感",
            "Increases the wearer's DMG by": "使装备者造成伤害提高",
            ". For every enemy defeated by the wearer, the wearer's ATK increases by": "。每消灭1个敌方目标，装备者的攻击力提高",
            ", stacking up to 3 time(s).": "，该效果最多叠加 3.0 层。",
            /////////////////////////////////////////////////////////
            "Geniuses' Repose": "天才们的休憩",
            ". When the wearer defeats an enemy, the wearer's CRIT DMG increases by": "，当装备者消灭敌方目标后，暴击伤害提高",
            /////////////////////////////////////////////////////////
            "Make the World Clamor": "别让世界静下来",
            "The wearer regenerates": "使装备者进入战斗时立即恢复",
            "Energy immediately upon entering battle, and increases DMG dealt by the wearer's Ultimate by": "点能量，同时使其终结技造成的伤害提高",
            //////////////////////////////////////////////////////////
            "The Day The Cosmos Fell": "银河沦陷日",
            ". When the wearer uses an attack and at least 2 attacked enemies have the corresponding Weakness, the wearer's CRIT DMG increases by": " 。装备者施放攻击后，若有不少于2个被攻击的敌方目标具有对应属性弱点，装备者的暴击伤害提高",
            //////////////////////////////////////////////////////////
            "After the Charmony Fall": "谐乐静默之后",
            ". After the wearer uses Ultimate, increases SPD by": "。装备者施放终结技后，速度提高",
            /////////////////////////////////////////////
            //五星
            ////////////////////////////////////////////////
            "Before Dawn": "拂晓之前",
            ". Increases DMG dealt by the wearer's Skill and Ultimate by": " 。使装备者战技和终结技造成的伤害提高",
            "After the wearer uses Skill or Ultimate, gains Somnus Corpus. Upon triggering a follow-up attack, consumes Somnus Corpus, ": "。当装备者施放战技或终结技后，获得【梦身】效果。触发追加攻击时，消耗【梦身】",
            /////////////////////////////////////////////////////
            "Eternal Calculus": "不息的演算",
            ". After using an attack, for each enemy target hit, additionally increases ATK by": "。施放攻击后，每击中一名敌方目标，使攻击力额外提高",
            ". This effect can stack up to 5 times and last until the next attack. If there are 3 or more enemy targets hit, this unit's SPD increases by": "，该效果最多叠加5次，持续至下次攻击后，若击中大于等于 3.0 名敌方目标，使自身速度提高",
            ", lasting for 1 turn(s).": "，持续 1.0 回合。",
            ///////////////////////////////////////////////////
            "Night on the Milky Way": "银河铁道之夜",
            "For every enemy on the field, increases the wearer's ATK by": "场上每有1个敌方目标，使装备者的攻击力提高",
            ", up to 5 stacks. When an enemy is inflicted with Weakness Break, the DMG dealt by the wearer increases by": " ，该效果最多叠加5层。当有敌方目标的弱点被击破时，装备者造成的伤害提高",
            " for 1 turn.": "，持续1回合。",
            /////////////////////////////////////////////////
            "An Instant Before A Gaze": "片刻，留在眼底",
            ". When the wearer uses Ultimate, increases DMG dealt by the wearer's Ultimate based on their Max Energy. Each point of Energy increases DMG dealt by Ultimate by": "。当装备者施放终结技时，根据装备者的能量上限，提高装备者终结技造成的伤害：每点能量提高",
            ". A max of 180 points of Energy will be taken into account for this.": " ，最多计入 180.0 点。",
            ///////////////////////////////////////////////
            "Yet Hope Is Priceless": "偏偏希望无价",
            ". While the wearer is in battle, for every 20% CRIT DMG that exceeds 120%, the DMG dealt by follow-up attack increases by": "。当装备者在战斗中暴击伤害大于 120.0% 时，每超过 20.0% ，追加攻击造成的伤害提高",
            ". This effect can stack up to 4 time(s). When the battle starts or after the wearer uses their Basic ATK, enables the DMG dealt by Ultimate or follow-up attack to ignore": "，该效果可叠加 4.0 层。战斗开始时和装备者施放普攻后，使终结技或追加攻击造成的伤害无视目标",
            "of the target's DEF": "的防御",
            ///////////////////////////////////////////////

            // 同谐光锥
            // 三星
           "Chorus": "齐颂",
           "Meshing Cogs": "轮契",
           "Mediation": "调和",
            // 四星
            "Carve the Moon, Weave the Clouds": "镂月裁云之意",
            "Dance! Dance! Dance!": "舞！舞！舞！",
            "Planetary Rendezvous": "与行星相会",
            "Past and Future": "过往未来",
            "Memories of the Past": "记忆中的模样",
            "For Tomorrow's Journey": "为了明日的旅途",
            "Dreamville Adventure": "美梦小镇大冒险",
            "Poised to Bloom": "芳华待灼",
            // 五星
            "But the Battle Isn't Over": "但战斗还未结束",
            "Flowing Nightglow": "夜色流光溢彩",
            "Earthly Escapade": "游戏尘寰",
            "Past Self in Mirror": "镜中故我",

            // 虚无光锥
            // 三星
            "Void": "幽邃",
            "Loop": "渊环",
            "Hidden Shadow": "匿影",
            // 四星
            "Eyes of the Prey": "猎物的视线",
            "Good Night and Sleep Well": "晚安与睡颜",
            "Resolution Shines As Pearls of Sweat": "决心如汗珠般闪耀",
            "We Will Meet Again": "后会有期",
            "Fermata": "延长记号",
            "It's Showtime": "好戏开演",
            "Boundless Choreo": "无边漫舞",
            "Before the Tutorial Mission Starts": "新手任务开始前",
            // 五星
            "In the Name of the World": "以世界之名",
            "Patience Is All You Need": "只需等待",
            "Incessant Rain": "雨一直下",
            "Reforged Remembrance": "重塑时光之忆",
            "Along the Passing Shore": "行于流逝的岸",
            "Solitary Healing": "孤独的疗愈",
            "Those Many Springs": "那无数个春天",

            // 存护光锥
            // 三星
            "Defense": "戍御",
            "Amber": "琥珀",
            "Pioneering": "开疆",
            // 四星
            "Destiny's Threads Forewoven": "织造命运之线",
            "Day One of My New Life": "余生的第一天",
            "Landau's Choice": "朗道的选择",
            "Concert for Two": "两个人的演唱会",
            "This Is Me!": "这就是我啦！",
            "Trend of the Universal Market": "宇宙市场趋势",
            "We Are Wildfire": "我们是地火",
            // 五星
            "Texture of Memories": "记忆的质料",
            "Moment of Victory": "制胜的瞬间",
            "She Already Shut Her Eyes": "她已闭上双眼",
            "Inherently Unjust Destiny": "命运从未公平",

            // 丰饶光锥
            // 三星
            "Cornucopia": "物穰",
            "Multiplication": "蕃息",
            "Fine Fruit": "嘉果",
            // 四星
            "Quid Pro Quo": "等价交换",
            "Shared Feeling": "同一种心情",
            "Perfect Timing": "此时恰好",
            "Warmth Shortens Cold Nights": "暖夜不会漫长",
            "Post-Op Conversation": "一场术后对话",
            "What Is Real?": "何物为真",
            "Perfect Timing": "此时恰好",
            "Hey, Over Here": "嘿，我在这儿",
            // 五星
            "Night of Fright": "惊魂夜",
           "Time Waits for No One": "时节不居",
            "Echoes of the Coffin": "棺的回响",
            "Scent Alone Stays True": "唯有香如故",

        },


                 "角色": {
                //物理
                "MC Physical": "开拓者（物理）",
                "Seele": "希儿",
                "Clara": "克拉拉",
                "Sushang": "素裳",
                 "Natasha": "娜塔莎",
                  "Luka": "卢卡",
                  "Hanya": "寒鸦",
                  "Argenti": "银枝",
                  "Robin": "知更鸟",
                  "Boothill": "波提欧",
                  "Yunli": "云璃",
                //火
                "MC Fire": "开拓者（火）",
                "Hook": "虎克",
                "Asta": "艾丝妲",
                "Topaz & Numby": "托帕&账账",
                "Guinaifen": "桂乃芬",
                "Himeko": "姬子",
                "Gallagher": "加拉赫",
                "Firefly": "流萤",
                "Jiaoqiu": "椒丘",
                "Lingsha": "灵砂",
                //虚数
                "MC Imaginary": "开拓者（虚数）",
                "March 7th": "三月七",
                "Luocha": "罗刹",
                "Dan Heng • Imbibitor Lunae": "丹恒·饮月",
                "Yukong": "驭空",
                "Welt": "瓦尔特",
                "Aventurine": "砂金",
                "Dr. Ratio": "真理医生",
                //风
                "Bronya": "布洛妮娅",
                 "Sampo": "桑博",
                "Dan Heng": "丹恒",
                "Blade": "刃",
                "Huohuo": "藿藿",
                "Black Swan": "黑天鹅",
                ////////////////////////////////////
                "Feixiao": "飞霄",
                "Skyward I Quell": "镇绥天钧",
                "Moonward I Wish": "礼辰祷月",
                "Starward I Bode": "景星出宿",
                "Stormward I Hear": "驱飓听冰",
                "Heavenward I Leap": "擢登霄汉",
                "Homeward I Near": "惟首正丘",
               ///////////////////////////////////////////
                //冰
                "Gepard": "杰帕德",
                "Herta": "黑塔",
                "Pela": "佩拉",
                "Yanqing": "彦卿",
                 "March 7th": "三月七",
                "Jingliu": "镜流",
                "Ruan Mei": "阮·梅",
                "Misha": "米沙",
                //雷
                "Serval": "希露瓦",
                "Kafka": "卡芙卡",
                "Tingyun": "停云",
                "Arlan": "阿兰",
                "Jing Yuan": "景元",
                "Bailu": "白露",
                "Acheron": "黄泉",
                "Moze": "貊泽",
                //量子
                "Fu Xuan": "符玄",
                "Silver Wolf": "银狼",
                "Qingque": "青雀",
                "Lynx": "玲可",
                "Xueyi": "雪衣",
                "Sparkle": "花火",
                "Jade": "翡翠",
        },
          "界面": {
            "Character Level": "角色等级",
            "Character Info": "角色信息",
            "Stats Summary:": "属性详情",
            "Create New Relic": "创建新遗器",
            "Show All": "显示全部",
            "Create New Lightcone": "创建新光锥",
            "Select Relic Set": "选择遗器套装",
            "Add Lightcone": "添加光锥",
            "Lightcone Name": "光锥名称",
            "Lightcone Level": "光锥",
            "Super Impostion": "叠影阶级",
            "Equipped: ": "已装备：",
            "Rarity": "星级",
            "Level": "等级",
            "Type": "部位",
            "HEAD": "头部",
            "Head": "头部",
            "HAND": "手部",
            "Hand": "手部",
            "BODY": "躯干",
            "Body": "躯干",
            "FOOT": "脚部",
            "Foot": "脚部",
            "NECK": "位面球",
            "Ball": "位面球",
            "OBJECT": "连结绳",
            "Rope": "连结绳",
            "Character": "角色",
            "Main Stat": "主属性",
            "Pick Mainstat": "选择主词条",
            "Pick Substat": "选择副词条",
            "pc bonus:": "件套效果",
            "Use Technique?": "使用秘技？",
            "Change Lightcone": "更改光锥",
            "Not Equipped": "没有装备",
            "Filter": "命途",
            "Skills": "技能",
            "Eidolons": "星魂",
            "Showcase Card": "展示卡",
            "Current Ultimate Energy": "当前终结技能量",
            "No Light Cone Equipped": "没有装备光锥",
            "Set Energy to 50%": "设置能量至50%",
            "Lightcone": "光锥",
            "Relics": "遗器"
        },
        "功能": {
            "Basic ATK": "普攻",
            "Skill": "战技",
            "Ultimate": "终结技",
            "Talent": "天赋",
            "Technique": "秘技"
        },
        "角色属性": {
            "HP": "生命值",
            "ATK": "攻击力",
            "DEF": "防御力",
            "SPD": "速度",
            "CRIT Rate": "暴击率",
            "CRIT DMG": "暴击伤害",
            "Break Effect": "击破特攻",
            "Effect RES": "效果抵抗",
            "Energy Regeneration Rate": "能量恢复效率",
            "Effect Hit Rate": "效果命中",
            "Outgoing Healing Boost": "治疗量提升",
            "Physical DMG Boost": "物理属性伤害提高",
            "Fire DMG Boost": "火属性伤害提高",
            "Ice DMG Boost": "冰属性伤害提高",
            "Lightning DMG Boost": "雷属性伤害提高",
            "Wind DMG Boost": "风属性伤害提高",
            "Quantum DMG Boost": "量子属性伤害提高",
            "Imaginary DMG Boost": "虚数属性伤害提高"
        },
     "低优先级":{

            "Pick": "选择",
     },
    };

    function replaceTextContent(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
            for (const category of Object.values(config)) {
                for (const [key, value] of Object.entries(category)) {
                    text = text.split(key).join(value);
                }
            }
            node.textContent = text;
        } else {
            node.childNodes.forEach(replaceTextContent);
        }
    }

    function observeMutations() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach((node) => {
                    replaceTextContent(node);
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
        });
    }

    function init() {
        // 初始文本替换
        replaceTextContent(document.body);

        // 观察 DOM 变化
        observeMutations();

        // 监听 URL 变化
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(replaceTextContent.bind(null, document.body), 50);
            }
        }).observe(document, {subtree: true, childList: true});

        // 定期检查内容（可选）
        setInterval(() => {
            replaceTextContent(document.body);
        }, 50);
    }

    // 确保页面完全加载后执行
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

})();
