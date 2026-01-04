// ==UserScript==
// @name         HV - 战斗日志汉化
// @namespace    Aloxaf_hentai
// @version      0.5.0
// @description  汉化 HV 战斗日志
// @notice       原作者@qp_xe，物品汉化文本由HV物品装备汉化提供
// @author       qp_xe & indefined & 1235789gzy1 & mbbdzz
// @include      *://hentaiverse.org/*
// @include      *://alt.hentaiverse.org/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/445520/HV%20-%20%E6%88%98%E6%96%97%E6%97%A5%E5%BF%97%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/445520/HV%20-%20%E6%88%98%E6%96%97%E6%97%A5%E5%BF%97%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

// 隐藏原先的战斗 log
GM_addStyle('#textlog { display: none }');

let words = {
  //可在此自行增加翻译，注意格式
    //示例
    //'原始文本1': '<span style=\"background:#字体背景色\" >自定义文本1</span>',
    //'原始文本2': '<span style=\"color:字体颜色\" >自定义文本2</span>',
    //颜色请使用html颜色代码,注意添加逗号

  // 恢复
  'Refreshment' : '灵力长效药',
  'Regeneration' : '生命长效药',
  'Replenishment' : '魔力长效药',
  'Kicking Ass': '海扁',
  'Sleeper Imprint' : '沉睡烙印',

  // BUFF 效果
  'Regen' : '细胞活化',
  'Protection' : '守护',
  'Spirit Shield' : '灵力盾',
  'Hastened' : '急速',
  'Shadow Veil' : '影纱',
  'Absorbing Ward' : '吸收结界',
  'Spark of Life' : '生命火花',
  'Cloak of the Fallen' : '陨落斗篷',
  'Heartseeker' : '觅心者',
  'Arcane Focus' : '奥术集中',
  'Channeling' : '引导',
  'Fleeing' : '逃跑',
  'Blessing of the RiddleMaster' : '御谜士的祝福',

  // 怪物 DEBUFF 效果
  'Vital Theft' : '生命汲取',
  'Ether Theft' : '魔力汲取',
  'Spirit Theft' : '灵力汲取',
  'Confused' : '混乱',
  'Hastened' : '急速',
  'Absorbing Ward' : '吸收结界',
  'Slowed' : '缓慢',
  'Weakened' : '虚弱',
  'Imperiled' : '陷危',
  'Blinded' : '盲目',
  'Asleep' : '沉眠',
  'Silenced' : '沉默',
  'Magically Snared' : '魔磁网',
  'Vital Theft' : '生命汲取',

  //战斗风格
  'Overwhelming Strikes': '压制打击',
  'Coalesced Mana': '魔力合流',
  'Ether Tap' : '魔力回流',

  // 物品
  'drops a Health Gem powerup!' : '掉落了一颗生命宝石',
  'drops a Mana Gem powerup!' : '掉落了一颗魔力宝石',
  'drops a Spirit Gem powerup!' : '掉落了一颗灵力宝石',
  'drops a Mystic Gem powerup!' : '掉落了一颗神秘宝石',
  'Health Gem' : '生命宝石',
  'Mana Gem' : '魔力宝石',
  'Spirit Gem' : '灵力宝石',
  'Mystic Gem' : '神秘宝石',
  'Health Potion' : '体力药水',
  'Health Draught' : '体力长效药',
  'Health Elixir' : '体力秘药',
  'Mana Potion' : '法力药水',
  'Mana Draught' : '法力长效药',
  'Mana Elixir' : '法力秘药',
  'Spirit Potion' : '灵力药水',
  'Spirit Draught' : '灵力长效药',
  'Spirit Elixir' : '灵力秘药',
  'Last Elixir' : '终极秘药',
  'Energy Drink' : '能量饮料',
  'Caffeinated Candy' : '咖啡因糖果',
  'Soul Stone' : '灵魂石',
  'Flower Vase' : '花瓶',
  'Bubble-Gum' : '泡泡糖',
  'Infusion of Darkness' : '黑暗魔药',
  'Infusion of Divinity' : '神圣魔药',
  'Infusion of Storms' : '风暴魔药',
  'Infusion of Lightning' : '闪电魔药',
  'Infusion of Frost' : '冰冷魔药',
  'Infusion of Flames' : '火焰魔药',
  'Infusion of Gaia' : '盖亚魔药',
  'Scroll of Swiftness' : '加速卷轴',
  'Scroll of the Avatar' : '化身卷轴',
  'Scroll of Shadows' : '幻影卷轴',
  'Scroll of Absorption' : '吸收卷轴',
  'Scroll of Life' : '生命卷轴',
  'Scroll of Protection' : '保护卷轴',
  'Scroll of 守护' : '保护卷轴',
  'Scroll of the Gods' : '神之卷轴',
  'Soul Fragments':'灵魂碎片',

  //攻击咒语效果
  'Searing Skin' : '焦灼皮肤',
  'Freezing Limbs' : '冰封肢体',
  'explodes' : '爆裂',
  'Turbulent Air' : '空气湍流',
  'Deep Burns' : '深层烧伤',
  'Breached Defense' : '防御崩溃',
  'Blunted Attack' : '攻击钝化',

  // 技能
  'Flee' : '逃跑',
  'Scan' : '扫描',
  'FUS RO DAH' : '龙吼',
  'Orbital Friendship Cannon' : '<font color="#FF0000">友</font><font color="#CC0033">谊</font><font color="#990066">小</font><font color="#660099">马</font><font color="#3300CC">炮</font>',
  'Concussive Strike' : '震荡打击',
  'Skyward Sword' : '天空之剑',
  'Frenzied Blows' : '狂乱百裂斩',
  'Iris Strike' : '虹膜打击',
  'Backstab' : '背刺',
  'Shatter Strike' : '粉碎打击',
  'Rending Blow' : '撕裂打击',
  'Great Cleave' : '大劈砍',
  'Merciful Blow' : '最后的慈悲',
  'Shield Bash' : '盾击',
  'Vital Strike' : '致命打击',
  'Arcane Blow' : '奥术冲击',


  'Fiery Blast' : '炎爆术(Ⅰ)',
  'Inferno' : '地狱火(Ⅱ)',
  'Flames of Loki' : '邪神之火(Ⅲ)',
  'Freeze' : '冰冻(Ⅰ)',
  'Blizzard' : '暴风雪(Ⅱ)',
  'Fimbulvetr' : '芬布尔之冬(Ⅲ)',
  'Shockblast' : '电能爆破(Ⅰ)',
  'Chained Lightning' : '连锁闪电(Ⅱ)',
  'Wrath of Thor' : '雷神之怒(Ⅲ)',
  'Gale' : '烈风(Ⅰ)',
  'Downburst' : '下击暴流(Ⅱ)',
  'Storms of Njord' : '尼奥尔德风暴(Ⅲ)',
  'Smite' : '惩戒(Ⅰ)',
  'Banishment' : '放逐(Ⅱ)',
  'Paradise Lost' : '失乐园(Ⅲ)',
  'Corruption' : '腐化(Ⅰ)',
  'Disintegrate' : '瓦解(Ⅱ)',
  'Ragnarok' : '诸神黄昏(Ⅲ)',

  'Drain' : '枯竭',
  'Slow' : '缓慢',
  'Weaken' : '虚弱',
  'Silence' : '沉默',
  'Sleep' : '沉眠',
  'Confuse' : '混乱',
  'Imperil' : '陷危',
  'Blind' : '致盲',
  'MagNet' : '魔磁网',

  'Regen' : '细胞活化',
  'Full-Cure' : '完全治疗术',
  'Cure' : '治疗术',
  'Haste' : '急速',
  'Protection' : '守护',
  'Shadow Veil' : '影纱',
  'Absorb' : '吸收',
  'Spark of Life' : '生命火花',
  'Arcane Focus' : '奥术集中',
  'Heartseeker' : '觅心者',
  '[sS]pirit [sS]hield' : '灵力盾',

  //武器效果
  'Penetrated Armor' : '破甲',
  'Stunned' : '眩晕',
  'Bleeding Wound' : '流血',
  'Void Strike':'虚空打击',
  'Fire Strike':'火焰打击',
  'Cold Strike':'冰霜打击',
  'Elec Strike':'闪电打击',
  'Wind Strike':'狂风打击',
  'Holy Strike':'神圣打击',
  'Dark Strike':'黑暗打击',
  'spike shield': '刺盾',

  // 动作
  'Magic Points' : '点<span style=\"color:#639AD4\" > 魔力 </span>',
  'evades your attack': '<span style=\"color:#1E90FF\" >闪避了你的攻击</span>',
  'evades your spell': '<span style=\"color:#1E90FF\" >闪避了你的法术</span>',
  'Your offhand': '<span style=\"color:#1E90FF\" >你的副手攻击</span>',
  'casts?': '<span style=\"background:#7CFC00\" >咏唱了</span>',
  'uses': '<span style=\"background:#ADFF2F\" >使用了</span>',
  'and hits': '<span style=\"color:#FF00FF\" >并击中了</span>',
  'hits': '<span style=\"color:#FF00FF\" >击中了</span>',
  'and crits': '<span style=\"background:#FF0000;color:#FFFFFF\" >并暴击了</span>',
  'crits': '<span style=\"background:#FF0000;color:#FFFFFF\" >暴击了</span>',
  'and blasts': '<span style=\"background:#FF0000;color:#FFFFFF\" >并暴击了</span>',
  'blasts': '<span style=\"background:#FF0000;color:#FFFFFF\" >暴击了</span>',
  'restores' : '<span style=\"color:#006400\" >恢复了你</span>',
  'Recovered' : '<span style=\"color:#006400\" >恢复了你</span>',
  'You use': '<span style=\"background:#ADFF2F\" >你使用了</span>',
  'The effect (.+) was dispelled\.' : '效果 $1 已被替换',
  'gains? the effect': '<span style=\"background:#ADFF2F" >获得了状态</span>',
  'You crit': '<span style=\"color:#1E90FF\" >你</span><span style=\"background:#FF0000;color:#FFFFFF\" >暴击了</span>',
  'You hit': '<span style=\"color:#1E90FF\" >你</span><span style=\"color:#FF00FF\" >击中了</span>',
  'You are healed for (.*) Health Points': '你获得<span style=\"color:#006400\" > $1 点生命</span>的治疗',
  'You evade the attack from (.*)\.': '<span style=\"color:#696969\" >你闪避了 $1 的攻击.</span>',
  'You block the attack from (.*)\.': '<span style=\"color:#696969\" >你格挡了 $1 的攻击</span>',
  'You parry the attack from (.*)\.': '<span style=\"color:#696969\" >你招架了 $1 的攻击</span>',
  'You evade the attack': '<span style=\"color:#696969\" >你闪避了这次攻击</span>',
  'You block the attack': '<span style=\"color:#696969\" >你格挡了这次攻击</span>',
  'You parry the attack': '<span style=\"color:#696969\" >你招架了这次攻击</span>',
  'Your (.*) absorbs (.*) from the attack into': '你的 $1 吸收了 $2 并转化为 ',
  'The effect (.*) on (.*) has expired': '<span style=\"color:	#b06161\" >$2 身上的状态 $1 已失效</span>',
  'The effect (.*) has expired': '<span style=\"background:#FB6901\" >状态 $1 已失效</span>',
  'Cooldown expired for (.*)': '<span style=\"color:#000000\" >$1</span> <span style=\"background:#97ffb2\" >已结束冷却</span>',
  'counter (.*) for (.*)': '<span style=\"background:#FFFF00\" >反击</span> $1 <span style=\"color:#e21a1a\" >造成 $2</span>',
  'healing (.*) for (.*) points of health': '治疗 $1 <span style=\"color:#006400\" > $2 点生命</span>',
  'You drain (.*) points of health from (.*)' : '你从 $2 身上吸取<span style=\"color:#006400\" > $1 点生命</span>',
  'but is absorbed': '但被吸收了',
  'resisted\\)': '被抵抗)',
  'from the brink of defeat': '<span style=\"background:#2E6F15\;color:#FFFFFF" >从死亡的边缘复活了</span>',


  
  // 怪物动作
  'misses the attack against' : '攻击没有命中',
  'but misses the attack.' : '但这次攻击没有命中',
  'parries your attack': '<span style=\"background:	#00FFFF\" >招架了你的攻击</span>',
  'The effect (.*) on (.*) has expired': '<span style=\"color:	#b06161\" >$2 身上的状态 $1 已失效</span>',
  'resists your spell' : '<span style=\"background:#81f7f3\" >抵抗了你的魔法</span>',
  'got knocked out of confuse' : '从混乱中脱离',
  
  //战斗系统文本
  'Spawned Monster': '生成怪物',
  'Initializing random encounter' : '正在初始化随机遭遇战',
  'Initializing arena challenge' : '正在初始化竞技场战斗',
  'Initializing Item World' : '正在初始化道具界战斗',
  'Initializing Grindfest' : '正在初始化压榨界战斗',
  'Initializing The Tower' : '正在初始化塔楼战斗',
  '(.*) has been defeated': '<span style=\"background:#b3b3b3\" >打败了 $1</span>',
  'With the light of a new dawn, [yY]our experience in all things increases' : '随着新的黎明的到来，你在所有事情上的经验都增加了',
  'have escaped from the battle': '从战斗中脱离了',
  'Time Bonus:' : '快速回答奖励:',
  'The Riddlemaster listens to your answer, tries to keep a pensive face, then breaks into a wide grin' : '谜语大师听了你的回答，努力保持沉思的表情，然后咧嘴大笑',
  'The Riddlemaster listens to your answer and winks at you' : '谜语大师听了你的回答，向你眨眼',
  'The Riddlemaster listens to your answer and cackles hysterically.' : '谜语大师听了你的回答，歇斯底里地笑了起来',
  'The Riddlemaster listens to your answer and grins mischievously.' : '谜语大师听了你的回答，顽皮地笑了起来',
  'The Riddlemaster listens to your answer and shows no reaction whatsoever.' : '谜语大师听了你的回答，没有任何反应',
  'The Riddlemaster listens to your answer and snorts ambiguously.' : '谜语大师听了你的回答，含糊地哼了一声',
  'Insufficient overcharge or spirit for Spirit Stance.' : '灵力或斗气值不足，无法开启灵动架势',
  'Insufficient overcharge to use' : '斗气值不足，无法使用',
  'have been defeated' : '被击败了',
  'Spirit Stance Engaged': '<span style=\"background:#e21a4e\" >灵动架势开启</span>',
  'Spirit Stance Exhausted': '<span style=\"background:#f5b3c4\" >灵动架势关闭</span>',
  'Spirit Stance Disabled': '<span style=\"background:#f5b3c4\" >灵动架势无法维持</span>',
  'You are Victorious!': '你胜利了',
  'You gain': '你获得了',
  'You obtained': '你获得了',
  'fails due to insufficient Spirit' : '由于灵力不足，没有生效',
  'Stop kicking the dead horse' : '别鞭尸啦',
  'You gain no EXP due to exhaustion' : '由于你已精疲力竭，因此无法获得经验',
  'Warning: Reached equipment inventory limit' : '警告，装备库存已满',
  'Invalid target' : '非法目标',
  'Item does not exist' : '道具不存在',
  'Inventory slot is empty' : '物品栏是空的',
  'You do not have a powerup gem' : '宝石不存在',

  
  //结算时各项经验的翻译文本
  'one-handed weapon proficiency' : '单手武器的熟练度',
  'two-handed weapon proficiency' : '双手武器的熟练度',
  'one-handed proficiency' : '单手熟练度',
  'two-handed proficiency' : '双手熟练度',
  'dual wielding proficiency' : '双持熟练度',
  'staff proficiency' : '法杖熟练度',
  'cloth armor proficiency' : '布甲熟练度',
  'light armor proficiency' : '轻甲熟练度',
  'heavy armor proficiency' : '重甲熟练度',
  'elemental magic proficiency' : '元素魔法熟练度',
  'divine magic proficiency' : '神圣魔法熟练度',
  'forbidden magic proficiency' : '黑暗魔法熟练度',
  'deprecating magic proficiency' : '减益魔法熟练度',
  'supportive magic proficiency' : '增益魔法熟练度',

  'A traveling salesmoogle gives':'自动出售后给予了',
  'for it':'',
  'A traveling salesmoogle salvages it into':'自动分解后给予了',
  'Arena Token Bonus!':'获得竞技场令牌奖励!',
  'Battle Clear Bonus!':'获得战斗胜利奖励!',


  'Capacitor Level':'电容器（魔力+2%/级） 等级',
  'Juggernaut Level':'勇士（生命+2%/级） 等级',
  'Butcher Level':'屠夫（武器攻击伤害+2%/级） 等级',
  'Fatality Level':'致命（攻击暴击伤害+2%/级） 等级',
  'Overpower Level':'压制（反招架率+4%/级） 等级',
  'Swift Strike Level':'迅捷打击（攻速+1.92%/级） 等级',
  'Annihilator Level':'毁灭者（魔法暴击伤害+2%/级） 等级',
  'Archmage Level':'大法师（武器魔法伤害+2%/级） 等级',
  'Economizer Level':'节约者（魔力消耗减免+5%/级） 等级',
  'Penetrator Level':'穿透者（反抵抗率+4%/级） 等级',
  'Spellweaver Level':'织法者（施法速度+1.5%/级） 等级',
  'Hollowforged':'虚空升华',
  'Coldproof Level':'抗寒（冰冷抗性+4%/级） 等级',
  'Darkproof Level':'驱暗（黑暗抗性+4%/级） 等级',
  'Elecproof Level':'绝缘（闪电抗性+4%/级） 等级',
  'Fireproof Level':'耐热（火焰抗性+4%/级） 等级',
  'Holyproof Level':'驱圣（神圣抗性+4%/级） 等级',
  'Windproof Level':'防风（疾风抗性+4%/级） 等级',

  'Unlocked':'解锁',
  'innate':'内在',
  'potential:':'潜能:',
  'potential has increased by':'潜经验提升了',
  'points!':'点',



  'have reached Level' : '<span style=\"background:#00FF00\" >升级至</span>',
  'dropped':'掉落了',

  'for (\\d+)': '<span style=\"color:#e21a1a\" >造成 $1</span>',
  '[yY]our': '<span style=\"color:#1E90FF\" >你的</span>',
  '[yY]ou': '<span style=\"color:#1E90FF\" >你</span>',


  // 伤害
  'fire damage': '<span style=\"background:#f97c7c\" >火焰伤害</span>',
  'cold damage': '<span style=\"background:#94c2f5\" >冰冷伤害</span>',
  'void damage': '<span style=\"background:#ffffff\;color:#5c5a5a\" >虚空伤害</span>',
  'elec damage': '<span style=\"background:#f4f375\" >闪电伤害</span>',
  'wind damage': '<span style=\"background:#7ff97c\" >疾风伤害</span>',
  'dark damage': '<span style=\"background:#000000\;color:#ffffff\" >黑暗伤害</span>',
  'holy damage': '<span style=\"background:#ffffff\;color:#000000\" >神圣伤害</span>',
  'spirit damage': '<span style=\"color:#a2042c\" >灵力值伤害</span>',

  'crushing damage': '<span style=\"background:#000000\;color:#F6F504\" >打击伤害</span>',
  'slashing damage': '<span style=\"background:#000000\;color:#F6F504\" >斩击伤害</span>',
  'piercing damage': '<span style=\"background:#000000\;color:#F6F504\" >刺击伤害</span>',
  'damage': '伤害',

  'points of': '点',
  'health': '<span style=\"color:#006400\" >生命</span>',
  'magic': '<span style=\"color:#639AD4\" >魔力</span>',
  'spirit': '<span style=\"color:#D4637A\" >灵力</span>',
};

let items_words = {
  //以下内容来自HV装备物品汉化
        'Crystal of Vigor' : '力量水晶',
        'Crystal of Finesse' : '灵巧水晶',
        'Crystal of Swiftness' : '敏捷水晶',
        'Crystal of Fortitude' : '体质水晶',
        'Crystal of Cunning' : '智力水晶',
        'Crystal of Knowledge' : '智慧水晶',
        'Crystal of Flames' : '火焰水晶',
        'Crystal of Frost' : '冰冻水晶',
        'Crystal of Lightning' : '闪电水晶',
        'Crystal of Tempest' : '疾风水晶',
        'Crystal of Devotion' : '神圣水晶',
        'Crystal of Corruption' : '暗黑水晶',
        'Crystal of Quintessence' : '灵魂水晶',
        'Crystal of Corruption' : '腐化水晶',

        'Monster Edibles' : '怪物食品',
        'Monster Chow' : '怪物口粮',
        'Monster Cuisine' : '怪物料理',
        'Happy Pills' : '快乐药丸',

        'Wispy Catalyst' : '纤细 催化剂',
        'Diluted Catalyst' : '稀释 催化剂',
        'Regular Catalyst' : '平凡 催化剂',
        'Robust Catalyst' : '稳健 催化剂',
        'Vibrant Catalyst' : '活力 催化剂',
        'Coruscating Catalyst' : '闪耀 催化剂',
        'Low-Grade Cloth': '低级布料',
        'Mid-Grade Cloth': '中级布料',
        'High-Grade Cloth': '高级布料',
        'Low-Grade Leather': '低级皮革',
        'Mid-Grade Leather': '中级皮革',
        'High-Grade Leather': '高级皮革',
        'Low-Grade Metals': '低级金属',
        'Mid-Grade Metals': '中级金属',
        'High-Grade Metals': '高级金属',
        'Low-Grade Wood': '低级木头',
        'Mid-Grade Wood': '中级木头',
        'High-Grade Wood': '高级木头',
        'Scrap Metal' : '金属废料',
        'Scrap Leather' : '皮革废料',
        'Scrap Wood' : '木材废料',
        'Scrap Cloth' : '废布料',
        'Energy Cell' : '能量元',
        'Defense Matrix Modulator' : '力场碎片(盾)',
        'Repurposed Actuator' : '动力碎片(重)',
        'Shade Fragment' : '暗影碎片(轻)',
        'Crystallized Phazon' : '相位碎片(布)',
        'Legendary Weapon Core' : '传奇武器核心',
        'Peerless Weapon Core' : '无双武器核心',
        'Legendary Staff Core' : '传奇法杖核心',
        'Peerless Staff Core' : '无双法杖核心',
        'Legendary Armor Core' : '传奇护甲核心',
        'Peerless Armor Core' : '无双护甲核心',
        'Voidseeker Shard' : '虚空碎片',
        'Featherweight Shard' : '羽毛碎片',
        'Aether Shard' : '以太碎片',
        'Amnesia Shard' : '重铸碎片',
        'Soul Fragment' : '灵魂碎片',
        'Blood Token' : '鲜血令牌',
        'Token of Blood' : '鲜血令牌',
        'Chaos Token' : '混沌令牌',

        'Precursor Artifact' : '古遗物',
        'ManBearPig Tail' : '人熊猪的尾巴(等级2)',
        'Mithra\'s Flower' : '猫人族的花(等级2)',
        'Holy Hand Grenade of Antioch' : '安提阿的神圣手榴弹(等级2)',
        'Dalek Voicebox' : '戴立克音箱(等级2)',
        'Lock of Blue Hair' : '一绺蓝发(等级2)',
        'Bunny-Girl Costume' : '兔女郎装(等级3)',
        'Hinamatsuri Doll' : '雏人形(等级3)',
        'Broken Glasses' : '破碎的眼镜(等级3)',
        'Sapling' : '树苗(等级4)',
        'Black T-Shirt' : '黑色Ｔ恤(等级4)',
        'Unicorn Horn' : '独角兽的角(等级5)',
        'Noodly Appendage' : '面条般的附肢(等级6)',
        'Festival Coupon' : '节日礼券(等级7)', //2020起收获节（中秋）

        'Abstract Art of Fire Hydrants': '抽象艺术消防栓',
        'Abstract Art of Staircases': '抽象艺术楼梯',
        'Abstract Art of Bridges': '抽象艺术桥梁',
        'Abstract Art of Traffic Lights': '抽象艺术红绿灯',
        'Abstract Art of Bicycles': '抽象艺术自行车',
        'Abstract Art of Tractors': '抽象艺术拖拉机',
        'Abstract Art of Busses': '抽象艺术公交车',
        'Abstract Art of Motorcycles': '抽象艺术摩托车',
        'Abstract Art of Crosswalks': '抽象艺术人行道',

///////////////////////////////////////////武器种类
        // 单手武器类
        'Dagger':'*匕首（单）',
        'Sword Chucks' : '*锁链双剑（单）',
        'Shortsword':'短剑（单）',
        'Wakizashi':'脇差（单）',
        'Axe':'斧（单）',
        'Club':'棍（单）',
        'Rapier':'<span style=\"background:#ffa500\" >西洋剑</span>（单）',
        //双手
        'Scythe':'*镰刀（双）',
        'Longsword':'长剑（双）',
        'Katana':'日本刀（双）',
        'Mace':'锤矛（双）',
        'Estoc':'刺剑（双）',
        //法杖
        'Staff':'法杖（双）',
        //布甲
        'Cap ':'兜帽 ',
        'Cap':'兜帽 ',
        'Cap$':'兜帽',
        'Cap<':'兜帽<',
        'Robe':'长袍',
        'Gloves':'手套',
        'Pants':'短裤',
        'Shoes':'鞋',
        //轻甲
        'Helmet':'头盔',
        'Breastplate':'护胸',
        'Gauntlets':'手甲',
        'Leggings':'绑腿',
        //重甲
        'Cuirass':'胸甲',
        'Armor':'盔甲',
        'Sabatons':'铁靴',
        'Boots':'马靴',
        'Greaves':'护胫',
        //锁子甲
        'Coif' : '头巾',
        'Mitons' : '护手',
        'Hauberk' : '装甲',
        'Chausses' : '裤',

        /////////////////////////////盾或者材料,武器不会出现这个
        'Buckler':'圆盾',
        'Kite Shield':'鸢盾',
        'Tower Shield':'*塔盾',
        'Force Shield':'<span style=\"background:#ffa500\" >力场盾</span>',

        ////////////////////////材质前缀////////////////////////
        //布甲
        'Cotton':'棉质<span style=\"background:#FFFFFF;color:#000000\" >(布)</span>',
        'Gossamer':'*薄纱<span style=\"background:#FFFFFF;color:#000000\" >(布)</span>',
        'Silk' : '*丝绸<span style=\"background:#FFFFFF;color:#000000\" >(布)</span>',
        'Phase':'<span style=\"background:#ffa500\" >相位</span><span style=\"background:#FFFFFF;color:#000000\" >(布)</span>',
        //轻甲
        'Leather':'皮革<span style=\"background:#666666;color:#FFFFFF\" >(轻)</span>',
        'Kevlar':'*凯夫拉<span style=\"background:#666666;color:#FFFFFF\" >(轻)</span>',
        'Dragon Hide' : '*龙皮<span style=\"background:#666666;color:#FFFFFF\" >(轻)</span>',
        'Shade':'<span style=\"background:#ffa500\" >暗影</span><span style=\"background:#666666;color:#FFFFFF\" >(轻)</span>',
        //重甲
        'Chainmail' : '*锁子甲<span style=\"background:#000000;color:#FFFFFF\" >(重)</span>',
        'Plate':'板甲<span style=\"background:#000000;color:#FFFFFF\" >(重)</span>',
        'Power':'<span style=\"background:#ffa500\" >动力</span><span style=\"background:#000000;color:#FFFFFF\" >(重)</span>',
        //法杖
        'Ebony':'*乌木',
        'Redwood':'红木',
        'Willow':'<span style=\"background:#ffa500\" >柳木</span>',
        'Oak':'橡木',
        'Katalox':'铁木',

        ///////////////////////////////////////////防具后缀////////////////////////////////////////////
        'of Negation':'否定(抵抗+)',
        'of the Shadowdancer':'影武者(闪避/攻暴+)',
        'of the Arcanist':'秘法(智力/智慧/魔命+)',
        'of the Fleet':'迅捷(闪避+)',
        'of the Fire-eater':'噬火者',
        'of the Thunder-child':'雷之子',
        'of the Wind-waker':'风之杖',
        'of the Frost-born':'冰人',
        'of the Spirit-ward':'灵魂护佑',
        'of the Thrice-blessed':'三重祝福',
        'of the Stone-skinned':'硬皮',
        'of Dampening':'抑制(打减伤+)',
        'of Stoneskin':'石肤(斩减伤+)',
        'of Deflection':'偏转(刺减伤+)',
        'of the Nimble':'灵活(招架+)',
        'of the Barrier':'屏障(格挡+)',
        'of Protection':'保护(物减伤+)',
        'of Warding':'护佑(魔减伤+)',

        ////////////////////////////////////////////////////武器后缀/////////////////////////////////
        'of Slaughter':'<span style=\"background:#FF0000;color:#FFFFFF\" >杀戮(攻击+)</span>',
        'of Swiftness':'迅捷(攻速+)',
        'of Balance':'平衡(攻命攻暴+)',
        'of the Battlecaster':'战法师(魔耗-魔命+)',
        'of the Banshee':'女妖(+吸灵)',
        'of the Illithid':'汲灵(+吸魔)',
        'of the Vampire':'吸血鬼(+吸血)',
        'of Destruction':'<span style=\"background:#9400d3;color:#FFFFFF\" >毁灭(法伤+)</span>',
        'of Surtr':'<span style=\"background:#f97c7c\" >苏尔特（火伤+）</span>',
        'of Niflheim':'<span style=\"background:#94c2f5\" >尼芙菲姆（冰伤+）</span>',
        'of Mjolnir':'<span style=\"background:#f4f375\" >姆乔尔尼尔（雷伤+）</span>',
        'of Freyr':'<span style=\"background:#7ff97c\" >弗瑞尔（风伤+）</span>',
        'of Heimdall':'<span style=\"background:#ffffff\;color:#000000\" >海姆达（圣伤+）</span>',
        'of Fenrir':'<span style=\"background:#000000\;color:#ffffff" >芬里尔（暗伤+）</span>',
        'of Focus':'专注(法暴法命+魔耗-)',
        'of the Elementalist':'元素使(元素熟练+)',
        'of the Heaven-sent':'天堂(神圣熟练+)',
        'of the Demon-fiend':'恶魔(黑暗熟练+)',
        'of the Earth-walker':'地行者(增益熟练+)',
        'of the Priestess':'牧师',
        'of the Curse-weaver':'织咒者(减益熟练+)',

        ///////////////武器或者防具属性/////////////////
        'Radiant':'<span style=\"background:#ffffff\;color:#000000" >✪魔光的✪(法伤+)</span>',
        'Mystic':'神秘的(法爆伤+)',
        'Charged':'<span style=\"color:red\" >充能的(施速+)</span>',
        'Amber':'<span style=\"background:#ffff00\;color:#9f9f16" >琥珀的(电抗+)</span>',
        'Mithril':'<span style=\"color:red\" >秘银的(负重-20%)</span>',
        'Agile':'俊敏的(攻速+)',
        'Zircon':'<span style=\"background:#ffffff\;color:#5c5a5a" >锆石的(圣抗+)</span>',
        'Frugal':'<span style=\"color:red\" >节能的(魔耗-)</span>',
        'Jade':'<span style=\"background:#b1f9b1\" >翡翠的(风抗+)</span>',
        'Cobalt':'<span style=\"background:#a0f4f4\" >钴石的(冰抗+)</span>',
        'Ruby':'<span style=\"background:#ffa6a6\" 红宝石(火抗+)</span>',
        'Onyx':'<span style=\"background:#cccccc\" >缟玛瑙(暗抗+)</span>',
        'Savage':'<span style=\"color:red\" >残暴的(攻暴伤+)</span>',
        'Reinforced':'加固的(斩打刺减伤+)',
        'Shielding':'盾化的(格挡+)',
        'Arctic':'<span style=\"background:#94c2f5\" >极寒之(冰法伤+)</span>',
        'Fiery':'<span style=\"background:#f97c7c\" >灼热之(火法伤+)</span>',
        'Shocking':'<span style=\"background:#f4f375\" >闪电之(电法伤+)</span>',
        'Tempestuous':'<span style=\"background:#7ff97c\" >风暴之(风法伤+)</span>',
        'Hallowed':'<span style=\"background:#ffffff\;color:#000000" >神圣之(圣法伤+)</span>',
        'Demonic':'<span style=\"background:#000000\;color:#ffffff" >恶魔之(暗法伤+)</span>',
        'Ethereal':'<span style=\"background:#ffffff\;color:#5c5a5a" >虚空之(无负重/干涉)</span>',


        /////////////////品质//////////
        'Flimsy' : '<span style=\"background:#848482\" >脆弱</span>  ',
        'Crude':'<span style=\"background:#acacac\" >劣质</span> ',
        'Fair':'<span style=\"background:#c1c1c1\" >一般</span> ',
        'Average':'<span style=\"background:#dfdfdf\" >中等</span> ',
        'Superior':'<span style=\"background:#fbf9f9\" >上等</span> ',
        'Fine':'<span style=\"background:#b9ffb9\" >优质</span> ',
        'Exquisite':'<span style=\"background:#d7e698\" >✧精良✧</span>',
        'Magnificent':'<span style=\"background:#a6daf6\" >☆史诗☆</span>',
        'Legendary':'<span style=\"background:#ffbbff\" >✪传奇✪</span>',
        'Peerless':'<span style=\"background:#ffd760\" >☯无双☯</span>',

        /////////////////个人补充翻译//////////



}

let regexs = [], chinese = [];

for (const [key, value] of Object.entries(words)) {
  regexs.push(new RegExp(`(?<=[ ,.\\[]|^)${key}(?=[ ,.\\]]|$)`, 'g'));
  chinese.push(value);
}

let regexs_items = [], chinese_items = [];
for (const [key, value] of Object.entries(items_words)) {
  regexs_items.push(new RegExp(`(?<=[ ,.\\[]|^)${key}(?=[ ,.\\]]|$)`, 'g'));
  chinese_items.push(value);
}

unsafeWindow.trans_regexs  = regexs;
unsafeWindow.trans_chinese = chinese;

function trans(text) {
  let regexs  = unsafeWindow.trans_regexs  || regexs;
  let chinese = unsafeWindow.trans_chinese || chinese;
  if (text.match(/(\[.+\])/)) {
    // 如果内容包含掉落物则翻译物品装备，否则不翻译
    let item = RegExp.$1, itemorg = RegExp.$1;
    for (const [idx, regex] of Object.entries(regexs_items)) {
        item = item.replace(regex, chinese_items[idx]);
    }
    text = text.replace(itemorg, item);
  }
  for (const [idx, regex] of Object.entries(regexs)) {
    text = text.replace(regex, chinese[idx]);
  }
  return text;
}

function observe_node(node, config, callback) {
    const observer = new MutationObserver(callback);
    observer.observe(node, config);
    return observer;
}

function add_to_log(text) {
  let tr = document.createElement('tr');
  let td = document.createElement('td');
  if (text == '') {
    td.classList.add('tls');
  }
  else {
    td.classList.add('tl');
    td.innerHTML = trans(text);
  }
  tr.appendChild(td);
  let log = document.querySelector('#translog');

  // 添加新日志之前检查日志数量
  if (log.children.length >= 100) {
    // 如果超过100条，删除最旧的日志
    log.lastChild.remove();
  }

  log.insertBefore(tr, log.firstChild);
}

function handle_log(mutations, _observer) {
  for (const mutation of mutations) {
    if (mutation.type !== 'childList') {
      continue;
    }
    for (const node of mutation.addedNodes) {
      if (node.nodeName !== 'TR') {
        continue;
      }
      let text = [];
      node.childNodes.forEach(n => text.push(n.innerHTML));
      add_to_log(text.join(' '));
      // console.log(trans(node.textContent));
    }
  }
}

function start_observe() {
  if (document.getElementById('translog')) return;
  // 在原日志的后面增加一个新的元素存放翻译后的日志，避免对其他插件造成可能存在的干扰
  let table = document.createElement('table');
  let tbody = document.createElement('tbody');
  table.id = 'translog';
  table.appendChild(tbody);

  let textlog = document.querySelector('#pane_log');
  textlog.appendChild(table);

  // 添加一下已存在的日志
  let texts = [];
  for (const log of document.querySelectorAll('#textlog > tbody > tr > td')) {
    texts.push(log.innerHTML);
  }
  for (const text of texts.reverse()) {
    add_to_log(text);
  }

  return observe_node(document.querySelector('#textlog').firstChild, {childList: true}, handle_log);
}


if (document.querySelector('#battle_main') !== null) {
  // 新回合开始时会刷新 battle_main，导致原本的监听失效，必须在刷新时重新监听一次
  observe_node(document.querySelector('#battle_main'), { childList: true }, () => {
    start_observe();
  });
  observe_node(document.querySelector('body'), { childList: true }, () => {
    start_observe();
  });
  start_observe();
}
