// ==UserScript==
// @name         Warframe掉率表
// @namespace    https://www.warframe.com/zh-hans/droptables
// @version      1.0
// @description  Warframe掉率表汉化
// @author       endfish
// @match        https://www.warframe.com/zh-hans/droptables
// @license MIT
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473255/Warframe%E6%8E%89%E7%8E%87%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/473255/Warframe%E6%8E%89%E7%8E%87%E8%A1%A8.meta.js
// ==/UserScript==

'use strict'


document.title = 'Warframe PC 掉率表';

const i18n = new Map([

["Last Update:","上次更新"],
["Disclaimer:","免责声明:"],
["Table of Contents:","目录:"],

["Missions","任务"],
["Missions:","任务:"],
["Relics","遗物"],
["Keys","关键"],
["Keys:","关键:"],
["Dynamic Location Rewards","动态场景奖励"],
["Dynamic Location Rewards:","动态场景奖励:"],
["Arbitrations","仲裁"],
["Derelict Vault","遗迹宝库"],
["Phorid Assassination","Phorid刺杀"],
["Nightmare Mode Rewards","噩梦模式奖励"],
["Fomorian Sabotage","破坏巨人战舰"],
["Razorback","利刃豺狼"],
["Kuva Siphon","赤毒虹吸器"],
["Kuva Flood","赤毒洪潮"],
["Hallowed Flame Mission Caches","万圣之焰"],
["Hallowed Flame Endurance Caches","万圣之焰·永恒"],
["Granum Void","格拉努虚空"],
["Extended Granum Void","格拉努虚空·扩展"],
["Nightmare Granum Void","格拉努虚空·噩梦"],
["Void Storm (Earth)","虚空风暴（地球）"],
["Void Storm (Venus)","虚空风暴（金星比邻星域）"],
["Void Storm (Saturn)","虚空风暴（土星比邻星域）"],
["Void Storm (Pluto)","虚空风暴（冥王星比邻星域）"],
["Void Storm (Neptune)","虚空风暴（海王星比邻星域）"],
["Void Storm (Veil Proxima)","虚空风暴（面纱）"],
["Duviri Full Experience","双衍历程"],
["Duviri Circuit","无尽回廊"],
["Sorties","突击"],
["Sorties:","突击:"],
["Sortie","突击"],
["Cetus Bounty Rewards","希图斯赏金奖励"],
["Orb Vallis Bounty Rewards","奥布山谷赏金奖励"],
["Cambion Drift Bounty Rewards","魔胎之境赏金奖励"],
["Zariman Bounty Rewards","扎里曼号赏金奖励"],
["Cetus Bounty Rewards:","希图斯赏金奖励:"],
["Orb Vallis Bounty Rewards:","奥布山谷赏金奖励:"],
["Cambion Drift Bounty Rewards:","魔胎之境赏金奖励:"],
["Zariman Bounty Rewards:","扎里曼号赏金奖励:"],
["Mod Drops by Source","Mod按来源分类"],
["Mod Drops by Source:","Mod按来源分类:"],
["Mod Drops by Mod","Mod按Mod分类"],
["Mod Drops by Mod:","Mod按Mod分类:"],
["Blueprint/Part Drops by Source","蓝图/部件按来源分类"],
["Blueprint/Part Drops by Item","蓝图/部件按物品分类"],
["Resource Drops by Resource","资源按资源分类"],
["Resource Drops by Resource:","资源按资源分类:"],
["Resource Drops by Source","资源按来源分类"],
["Resource Drops by Source:","资源按来源分类:"],
["Sigil Drops by Source","纹章按来源分类"],
["Sigil Drops by Source:","纹章按来源分类:"],
["Additional Item Drops by Source","杂物按来源分类"],
["Additional Item Drops by Source:","杂物按来源分类:"],
//项目
["Source","来源"],
["Mod Drop Chance","Mod掉率"],
["Resource Drop Chance","资源掉率"],
["Chance","几率"],
["Blueprint/Item Drop Chance","蓝图/物品掉率"],

["Enter Nihil's Oubliette","Nihil的密牢"],
["Kullervo's Hold","Kullervo的牢房"],

["Equinox Night Aspect Blueprint","Equinox黑夜面蓝图"],
["Equinox Night Chassis Blueprint","Equinox黑夜面机体蓝图"],
["Equinox Night Neuroptics Blueprint","Equinox黑夜面头部神经光元蓝图"],
["Equinox Night Systems Blueprint","Equinox黑夜面系统蓝图"],

["Equinox Day Aspect Blueprint","Equinox白昼面蓝图"],
["Equinox Day Chassis Blueprint","Equinox白昼面机体蓝图"],
["Equinox Day Neuroptics Blueprint","Equinox白昼面头部神经光元蓝图"],
["Equinox Day Systems Blueprint","Equinox白昼面系统蓝图"],

["Cobra & Crane Prime Blade","眼镜蛇&鹤Prime刀刃"],
["Cobra & Crane Prime Guard","眼镜蛇&鹤Prime护手"],
["Cobra & Crane Prime Blueprint","眼镜蛇&鹤Prime蓝图"],
["Cobra & Crane Prime Hilt","眼镜蛇&鹤Prime握柄"],

["Silva & Aegis Prime Blade","席瓦&神盾Prime刀刃"],
["Silva & Aegis Prime Guard","席瓦&神盾Prime护手"],
["Silva & Aegis Prime Blueprint","席瓦&神盾Prime蓝图"],
["Silva & Aegis Prime Hilt","席瓦&神盾Prime握柄"],

["Survival Storage Container","生存储存容器"],
["Dusty Storage Container","遗落的储存容器"],
["Dusty Storage Crate","遗落的储存箱"],
["Storage Container","储存容器"],
["Polished Storage Container","打磨过的存储容器"],
["Polished Storage Crate","打磨过的储存箱"],
["Forgotten Grineer Storage Container","遗落的Grineer储存容器"],
["Abandoned Storage Container","废弃的存储容器"],
["Reinforced Grineer Storage Container","强化Grineer存储容器"],
["Reinforced Corpus Storage Container","强化Corpus存储容器"],
["Reinforced Orokin Storage Container","强化Orokin存储容器"],
["Uncommon Orokin Storage Container","罕见Orokin存储容器"],
["Uncommon Corpus Storage Container","罕见Corpus存储容器"],
["Uncommon Grineer Storage Container","罕见Grineer存储容器"],
["Rare Grineer Storage Container","稀有Grineer存储容器"],
["Rare Corpus Storage Container","稀有Corpus存储容器"],
["Rare Orokin Storage Container","稀有Orokin存储容器"],
["Common Orokin Storage Container","Orokin存储容器"],
["Common Grineer Storage Container","常见Grineer存储容器"],
["Common Corpus Storage Container","常见Corpus存储容器"],
["Orokin Storage Container","Orokin存储容器"],
["Ancient Molted Cask","远古虚蜕木桶"],
//mod
["Amalgam Daikyu Target Acquired","并合大久和弓锁定目标"],
["Amalgam Argonak Metal Auger","并合氩格纳克合金钻头"],
["Amalgam Furax Body Count","并合弗拉克斯杀伤计数"],
["Amalgam Javlok Magazine Warp","并合燃焰标枪弹匣增幅"],
["Amalgam Ripkas True Steel","并合锐卡斯斩铁"],

["Necramech Augur","殁世机甲预言"],
["Necramech Aviator","殁世机甲飞行员"],
["Necramech Blitz","殁世机甲闪击"],
["Necramech Continuity","殁世机甲持久力"],
["Necramech Deflection","殁世机甲充能"],
["Necramech Drift","殁世机甲窜升"],
["Necramech Efficiency","殁世机甲增效"],
["Necramech Enemy Sense","殁世机甲敌人感应"],
["Necramech Flow","殁世机甲川流不息"],
["Necramech Friction","殁世机甲摩擦"],
["Necramech Fury","殁世机甲狂暴"],
["Necramech Hydraulics","殁世机甲液压"],
["Necramech Intensify","殁世机甲聚精会神"],
["Necramech Pressure Point","殁世机甲压迫点"],
["Necramech Rage","殁世机甲狂暴化"],
["Necramech Reach","殁世机甲剑风"],
["Necramech Rebuke","殁世机甲训戒"],
["Necramech Redirection","殁世机甲蓄能重划"],
["Necramech Refuel","殁世机甲燃料补给"],
["Necramech Repair","殁世机甲修复"],
["Necramech Seismic Wave","殁世机甲震波"],
["Necramech Slipstream","殁世机甲滑流"],
["Necramech Steel Fiber","殁世机甲钢铁纤维"],
["Necramech Streamline","殁世机甲简化"],
["Necramech Stretch","殁世机甲延伸"],
["Necramech Thrusters","殁世机甲推进器"],
["Necramech Vitality","殁世机甲生命力"],

["Jahu","JAHU(安魂Mod)"],
["Khra","KHRA(安魂Mod)"],
["Lohk","LOHK(安魂Mod)"],
["Xata","XATA(安魂Mod)"],
["Vome","VOME(安魂Mod)"],
["Ris","RIS(安魂Mod)"],
["Fass","FASS(安魂Mod)"],
["Netra","NETRA(安魂Mod)"],
["Oull","OULL(安魂Mod)"],

["Streamlined Form","流线外形"],
["Parry","格挡"],
["Steel Fiber","钢铁纤维"],
["Serration","膛线"],
["Incendiary Coat","燃烧外壳"],
["Hornet Strike","黄蜂螫刺"],
["Intensify","聚精会神"],
["Arrow Mutation","箭矢转换"],
["Rifle Ammo Mutation","步枪弹药转换"],
["Sniper Ammo Mutation","狙击枪弹药转换"],
["Shotgun Ammo Mutation","霰弹枪弹药转换"],
["Pistol Ammo Mutation","手枪弹药转换"],
["Cleanse Grineer","净化Grineer"],
["Magazine Warp","弹匣增幅"],
["Trick Mag","戏法增幅"],
["Pressure Point","压迫点"],
["Ammo Drum","弹鼓"],
["Reflex Coil","增幅线圈"],
["Cryo Rounds","低温弹头"],
["Hell's Chamber","地狱弹膛"],
["Shocking Touch","电击触点"],
["Metal Auger","合金钻头"],
["Ravage","破灭"],
["Continuity","持久力"],
["Master Thief","盗贼大师"],
["Vitality","生命力"],
["Fast Deflection","快速充能"],
["Shell Rush","填弹加速"],
["Fast Hands","爆发装填"],
["Quickdraw","持续火力"],
["North Wind","北风"],
["Shocking Touch","电击触点"],
["Molten Impact","熔岩冲击"],
["Stretch","延伸"],
["Morphic Transformer","非晶变压器"],
["Automatic Trigger","自动扳机"],
["Extend","延展"],
["Speed Trigger","灵敏扳机"],
["Target Cracker","弱点专精"],
["No Return","有去无回"],
["Deep Freeze","深层冷冻"],
["Reflection","充能反弹"],
["Reflex Guard","反射防御"],
["Master Key","万能钥匙"],
["Heavy Impact","震地冲击"],
["Volcanic Edge","爆裂刀刃"],
["Vicious Frost","蚀骨寒霜"],
["Natural Talent","天赋"],
["Tether","束缚力场"],
["Particle Ram","粒子冲撞"],
["Shatter Burst","碎裂爆破"],
["Internal Bleeding","内部出血"],
["Hemorrhage","失血"],
["Votive Onslaught","埋首猛击"],
["Power Drain","力量汲取"],
["Swift Mercy","迅捷怜悯"],
["Firewall","防火墙"],
["Malicious Code","恶毒指令"],
["Hard Reset","硬重启"],
["True Punishment","真实惩罚"],
["Quickening","加速"],
["Point Strike","致命一击"],
["Vital Sense","弱点感应"],
["Piercing Hit","穿甲伤害"],
["Pistol Gambit","手枪精通"],
["Blunderbuss","雷筒"],
["Point Blank","抵近射击"],
["Hellfire","地狱火"],
["Heated Charge","火焰装填"],
["Barrel Diffusion","弹头扩散"],
["Streamline","简化"],
["Thunderbolt","雷火"],
["Enduring Strike","不朽打击"],
["Life Strike","生命打击"],
["Bite","咬碎"],
["Link Armor","护甲连结"],
["Link Health","生命值连结"],
["Link Shields","护盾连结"],
["Maul","捶击"],
["Hastened Deflection","急速偏斜"],
["Polar Magazine","极地弹仓"],
["Superior Defenses","卓越防御"],
["Meteor Crash","流星撞击"],
["Nebula Bore","星云钻孔"],
["Astral Slash","星体切砍"],
["Comet Blast","彗星爆发"],
["Quasar Drill","类星钻体"],
["Zodiac Shred","黄道碎裂"],
["Provoked","激怒"],
["Charged Shell","充电弹头"],
["Proton Pulse","质子脉动"],
["Motus Signal","跃动信号"],
["Aero Periphery","空飞边际"],
["Proton Jet","质子喷射"],
["Motus Impact","跃动冲击"],
["Aero Vantage","空飞俯瞰"],
["Proton Snap","质子猛扑"],
["Motus Setup","跃动设局"],
["Aero Agility","空飞灵巧"],
["Live Wire","火线电击"],
["Stormbringer","暴风使者"],
["Rime Rounds","白霜弹头"],
["Scattering Inferno","炼狱轰击"],
["Cleanse Corpus","净化Corpus"],
["Glacial Edge","冰冷刃缘"],
["Conductive Blade","通电刀刃"],
["Tempered Blade","强化刀片"],
["Countermeasures","反制系统"],
["Munitions Vortex","弹药漩涡"],
["Blackout Pulse","熄扰脉冲"],
["Sudden Impact","瞬间冲击"],
["Poisonous Sting","剧毒螫刺"],
["Furor","狂怒"],
["Cutting Edge","切割刃缘"],
["System Reroute","系统重划"],
["Efficient Transferral","高效传输"],
["Blazing Steel","炽烈坚刃"],
["Blind Shot","盲目射击"],
["Hydraulic Barrel","液压枪管"],
["Lucky Shot","幸运射击"],
["Hydraulic Gauge","液压弹药"],
["Hydraulic Chamber","液压枪膛"],
["Expel Corrupted","驱逐堕落者"],
["Smite Corrupted","毁灭堕落者"],
["Cleanse Corrupted","净化堕落者"],
["Bane Of Corrupted","灭亡堕落者"],
["Handspring","翻筋斗"],
["Convulsion","痉挛"],
["Split Chamber","分裂膛室"],
["Flow","川流不息"],
["Stabilizer","稳定"],
["Cleanse Infested","净化Infested"],
["Battering Maneuver","机动冲撞"],
["Mobilize","全面驱动"],
["Piercing Step","穿刺步伐"],
["Rending Turn","撕裂翻转"],
["Patagium","翼膜"],
["Lightning Dash","电光冲刺"],
["Firewalker","火焰行者"],
["Ice Spring","冰冷跃动"],
["Toxic Flight","剧毒飞腾"],
["Steady Hands","稳定枪手"],
["Power Throw","奋力一掷"],
["Auto Breach","自动破解"],
["Scorch","灼痕焦点"],
["Thermite Rounds","铝热焊弹"],
["Frostbite","结霜侵蚀"],
["Frigid Blast","冰冷疾风"],
["Covert Lethality","致命匿杀"],
["Rubedo-Lined Barrel","红晶枪管"],
["No Return","有去无回"],
["Thief's Wit","盗贼天赋"],
["Precision Munition","精准弹药"],
["Venomous Clip","恶毒弹匣"],
["Parallax Scope","视差瞄具"],
["Combustion Rounds","燃烧弹头"],
["Dual Rounds","双重弹头"],
["Hollowed Bullets","中空子弹"],
["Magazine Extension","扩充弹匣"],
["Modified Munitions","弹药改良"],
["Bleeding Edge","血色刃缘"],
["Argon Plating","氩晶装甲"],
["Electrified Barrel","带电枪管"],
["Energy Inversion","能量转化"],
["Contagious Spread","传染蔓延"],
["Pathogen Rounds","病原弹头"],
["Infected Clip","污染弹匣"],
["Fever Strike","热病打击"],
["Enemy Sense","敌人感应"],
["High Voltage","高压电流"],
["Shell Shock","电冲弹药"],
["Firestorm","烈焰风暴"],
["Crimson Dervish","赤红狂舞"],
["Astral Twilight","星界微光"],
["Blind Justice","无明制裁"],
["Tempo Royale","皇家节奏"],
["Vengeful Revenant","复仇亡灵"],
["Pointed Wind","尖锐之风"],
["High Noon","正午"],
["Four Riders","天启异象"],
["Tranquil Cleave","秋风落叶"],
["Crushing Ruin","月落乌啼"],
["Final Harbinger","最终先驱"],
["Vermillion Storm","朱红暴风"],
["Stalking Fan","缠旋风切"],
["Decisive Judgement","果断裁决"],
["Bullet Dance","刀锋弹舞"],
["Hydraulic Crosshairs","液压准心"],
["Blood Rush","急进猛突"],
["Shrapnel Shot","破片射击"],
["Gnashing Payara","狼鱼咬咬"],
["Focused Defense","重点防御"],
["Catalyzer Link","触媒连动"],
["Failsafe","失效保险"],
["Coiling Viper","毒蛇螺旋"],
["Cleaving Whirlwind","弧刃回天"],
["Cyclone Kraken","飓风海怪"],
["Untraceable","无迹可寻"],
["Runtime","溜之大吉"],
["Peculiar Bloom","花开怪奇"],
["Peculiar Growth","生长怪奇"],

["Seeker Volley","追踪齐射"],
["Phoenix Blaze","凤凰烈焰"],
["Void Hole","虚空虹洞"],
["Galeforce Dawn","狂风压境"],
["Combat Discipline","战斗教条"],
["Shepherd","牧羊人"],
["Aerodynamic","空气动力"],
["Adaptation","适应"],
["Melee Guidance","近战指引"],
["Swift Momentum","迅敏动量"],
["Corrupt Charge","邪恶蓄力"],
["Hollow Point","空尖弹"],
["Spoiled Strike","腐坏打击"],
["Magnum Force","重装火力"],
["Tainted Clip","感染弹匣"],
["Critical Delay","关键延迟"],
["Heavy Caliber","重口径"],
["Tainted Mag","腐败弹匣"],
["Vile Precision","极恶精准"],
["Narrow Minded","心志偏狭"],
["Fleeting Expertise","弹指瞬技"],
["Blind Rage","盲怒"],
["Overextended","过度延展"],
["Tainted Shell","污秽弹药"],
["Vicious Spread","恶性扩散"],
["Burdened Magazine","过载弹匣"],
["Anemic Agility","乏能迅敏"],
["Vile Acceleration","卑劣加速"],
["Frail Momentum","虚弱动能"],
["Critical Deceleration","降速暴击"],
["Creeping Bullseye","匍匐靶心"],
["Transient Fortitude","瞬时坚毅"],
["Depleted Reload","耗竭装填"],

["Ice Storm","冰风暴"],
["Stunning Speed","慑人神速"],
["Hammer Shot","重锤射击"],
["Wildfire","野火"],
["Accelerated Blast","加速冲击"],
["Blaze","烈焰"],
["Chilling Reload","激冷装填"],
["Drifting Contact","漂移接触"],
["Seeking Fury","狂暴追猎"],
["Armored Agility","灵活装甲"],
["Shred","撕裂"],
["Rending Strike","撕裂打击"],
["Fortitude","不屈不挠"],
["Animal Instinct","动物本能"],
["Lethal Torrent","致命洪流"],
["Focus Energy","聚焦能量"],
["Constitution","百折不挠"],
["Hypothermic Shell","低温外壳"],
["Charged Bullets","带电子弹"],
["Contamination Casing","毒染套管"],
["Cryo Coating","冷冻包覆"],
["Ion Infusion","离子注入"],
["Infectious Injection","传染性注射"],
["Piercing Caliber","穿甲口径"],
["Breach Loader","破裂填装"],
["Auger Strike","螺钻打击"],
["Magma Chamber","熔岩弹膛"],
["Searing Steel","炽燃钢铁"],
["Redirection","蓄能重划"],
["Charged Chamber","蓄力装填"],
["Burning Wasp","炙热黄蜂"],
["Reaping Spiral","收割螺旋"],
["Enhanced Durability","耐久强化"],
["Grim Fury","冷面狂怒"],

["Augur Pact","预言契约"],
["Augur Seeker","预言探求"],
["Augur Accord","预言协约"],
["Augur Message","预言启示"],
["Augur Reach","预言通灵"],
["Augur Secrets","预言神密"],
["Gladiator Aegis","角斗士圣盾"],
["Gladiator Finesse","角斗士灵巧"],
["Gladiator Resolve","角斗士决心"],
["Gladiator Might","角斗士威猛"],
["Gladiator Rush","角斗士猛突"],
["Gladiator Vice","角斗士钳制"],
["Vigilante Pursuit","私法追踪"],
["Vigilante Vigor","私法活力"],
["Vigilante Supplies","私法补给"],
["Vigilante Armaments","私法军备"],
["Vigilante Offense","私法进攻"],
["Vigilante Fervor","私法热诚"],

["Amar's Anguish","欺谋狼主之苦"],
["Amar's Hatred","欺谋狼主之恨"],
["Amar's Contempt","欺谋狼主之鄙"],
["Boreal's Anguish","诡文枭主之苦"],
["Boreal's Hatred","诡文枭主之恨"],
["Boreal's Contempt","诡文枭主之鄙"],
["Nira's Anguish","混沌蛇主之苦"],
["Nira's Hatred","混沌蛇主之恨"],
["Nira's Contempt","混沌蛇主之鄙"],

["Hunter Adrenaline","猎人肾上腺素"],
["Hunter Munitions","猎人战备"],
["Hunter Command","猎人命令"],
["Hunter Recovery","猎人复元"],
["Hunter Synergy","猎人协力"],
["Hunter Track","猎人追踪"],
["Synth Charge","合成充能"],
["Synth Deconstruct","合成解构"],
["Synth Fiber","合成纤维"],
["Synth Reflex","合成反射"],
["Tek Assault","技法猛袭"],
["Tek Collateral","技法连带"],
["Tek Enhance","技法强化"],
["Tek Gravity","技法引力"],
["Mecha Empowered","机甲强化"],
["Mecha Overdrive","机甲超载"],
["Mecha Pulse","机甲脉冲"],
["Mecha Recharge","机甲充能"],
["Strain Consume","菌株吸收"],
["Strain Eruption","菌株爆裂"],
["Strain Fever","菌株热毒"],
["Strain Infection","菌株感染"],
["Carving Mantis","雕斩螳螂"],
["Swooping Falcon","猎鹰俯击"],
["Twirling Spire","回转尖峰"],
["Quick Reload","快速装填"],
["Deadly Efficiency","致命效率"],
["Resolute Focus","坚决专注"],
["Archgun Ace","Archwing枪械行家"],
["Marked Target","标记目标"],
["Sabot Rounds","覆壳弹药"],
["Critical Focus","关键焦点"],
["Ammo Chain","弹链"],
["Weeping Wounds","创口溃烂"],
["Embedded Catalyzer","内置触媒"],
["Nano-Applicator","纳米涂覆"],
["Sharpened Bullets","尖锐子弹"],
["Maiming Strike","致残突击"],
["Bladed Rounds","尖刃弹头"],
["Body Count","杀伤计数"],
["Spring-Loaded Chamber","簧压膛室"],
["Body Count","杀伤计数"],
["Repeater Clip","转轮弹匣"],
["Pressurized Magazine","增压弹匣"],
["Saxum Carapace","重岩者壳甲"],
["Saxum Spittle","重岩者唾液"],
["Saxum Thorax","重岩者胸腔"],
["Jugulus Carapace","喉骨刃者壳甲"],
["Jugulus Spines","喉骨刃者脊刺"],
["Jugulus Barbs","喉骨刃者倒刺"],
["Carnis Carapace","肉碾虫壳甲"],
["Carnis Stinger","肉碾虫针刺"],
["Carnis Mandible","肉碾虫巨颚"],
["Laser Sight","雷射瞄具"],
["Argon Scope","氩晶瞄具"],
["Guided Ordnance","制导弹药"],
["Targeting Subsystem","定位辅助"],
["Narrow Barrel","狭窄枪膛"],
["Silent Battery","寂静炮组"],
["Wise Razor","慧黠斩剃"],

["Vigor","活力"],
["Fury","狂暴"],
["Rush","冲刺"],
["Bore","枪膛"],

["Corrosive Projection","腐蚀投射"],
["Brief Respite","快速休整"],
["Emp Aura","电磁脉冲场"],
["Empowered Blades","强化刀锋"],
["Growing Power","成长之力"],
["Pistol Amp","手枪增幅"],
["Shotgun Amp","霰弹枪增幅"],
["Stand United","团结一致"],
["Energy Siphon","能量虹吸"],
["Enemy Radar","侦敌雷达"],
["Infested Impedance","感染者阻抗"],
["Loot Detector","战利品探测器"],
["Physique","体魄"],
["Pistol Scavenger","手枪弹药搜集者"],
["Rejuvenation","返老还童"],
["Rifle Amp","步枪增幅"],
["Rifle Scavenger","步枪弹药搜集者"],
["Shotgun Ammo Mutation","霰弹枪弹药转换"],
["Sniper Scavenger","狙击枪弹药搜集者"],
["Sprint Boost","冲刺提升"],
["Steel Charge","钢铁充能"],
["Shotgun Scavenger","霰弹枪弹药搜集者"],
["Holster Amp","切换增幅"],
["Toxin Resistance","毒素抵抗"],
["Antitoxin","毒抗"],
["Diamond Skin","钻石皮肤"],
["Equilibrium","均衡点"],
["Maglev","磁浮"],
["Concussion Rounds","震荡弹头"],
["Expel Corpus","驱逐Corpus"],
["Expel Grineer","驱逐Grineer"],
["Expel Infested","驱逐Infested"],
["Gunslinger","神枪手"],
["Lethal Momentum","致命动量"],
["Razor Shot","剃刀射击"],
["Ruinous Extension","毁灭扩展"],
["Sure Shot","准确射手"],
["Bane Of Corpus","灭亡Corpus"],
["Bane Of Grineer","灭亡Corpus"],
["Bane Of Infested","灭亡Corpus"],
["Rifle Aptitude","步枪才能"],
["Sinister Reach","凶恶延伸"],
["Terminal Velocity","极限速度"],
["Ammo Stock","霰弹扩充"],
["Chilling Grasp","急冻控场"],
["Fatal Acceleration","致死加速"],
["Shell Compression","压缩弹药"],
["Shotgun Savvy","通晓霰弹枪"],
["Shotgun Barrage","霰弹弹幕"],
["Tactical Pump","战术上膛"],
["Harkonar Scope","哈库那瞄准镜"],
["Dispatch Overdrive","超速击杀"],
["Enduring Affliction","长时苦难"],
["Finishing Touch","画龙点睛"],
["Killing Blow","一击必杀"],
["Relentless Combination","残酷组合"],
["Seismic Wave","震波"],
["Smite Corpus","毁灭Corpus"],
["Smite Grineer","毁灭Grineer"],
["Smite Infested","毁灭Infested"],
["Sundering Strike","破甲"],
["Clashing Forest","巨林冲击"],
["Eleventh Storm","终焉风暴"],
["Fracturing Wind","破碎之风"],
["Shimmering Blight","飞光荒疫"],
["Sundering Weave","分裂编织"],
["Swirling Tiger","旋风虎击"],
["Quick Thinking","随机应变"],
["Rage","狂暴化"],
["Rapid Resilience","极速复元"],
["Undying Will","不朽意志"],
["Shock Absorbers","减震器"],
["Gale Kick","狂风猛踢"],
["Kavat's Grace","库娃的优雅"],
["Retribution","惩戒"],
["Pain Threshold","痛苦阈值"],
["Sure Footed","顶天立地"],
["Concealed Explosives","内置炸药"],
["Fulmination","猛烈爆发"],
["Seeker","弹头导引"],
["Adhesive Blast","凝胶爆破"],
["Combustion Beam","灼热光束"],
["Lock And Load","填弹上膛"],
["Seeking Force","穿透力"],
["Target Acquired","锁定目标"],
["Berserker Fury","嗜血狂暴"],
["Condition Overload","异况超量"],
["Energy Channel","能量导引"],
["Guardian Derision","奚落守护"],
["Healing Return","治愈归复"],
["Spring-Loaded Blade","簧压刀刃"],
["Whirlwind","旋风"],
["Brutal Tide","残暴浪潮"],
["Iron Phoenix","钢铁凤凰"],
["Spinning Needle","旋压刺针"],
["Crowd Dispersion","人群驱散"],
["Gleaming Talon","微光利爪"],
["Jagged Edge","锯刃"],
["Melee Prowess","非凡技巧"],
["Shredder","粉碎器"],
["Revenge","复仇"],
["Enhanced Vitality","构造强化"],
["Metal Fiber","金属纤维"],
["Assault Mode","突击模式"],
["Reach","剑风"],
["Gaia's Tragedy","母神悲歌"],
["Vulpine Mask","狡狐诈面"],
["Hawk Eye","隼目"],
["Sinking Talon","沉没之爪"],
["Vaporize","汽化"],
["Self Destruct","自爆"],
["Energy Amplifier","能量扩散"],
["Organ Shatter","肢解"],
["Atlantis Vulcan","深渊之火"],
["Kinetic Diversion","动力转移"],
["Stinging Thorn","螫刺狂棘"],
["Lasting Sting","未完之刺"],
["Perpetual Agony","永恒苦痛"],
["Fetch","取回"],
["Volatile Quick Return","易爆速返"],
["Volatile Rebound","易爆反弹"],
["Defiled Snapdragon","积秽骁龙"],
["Air Recon","空中侦察"],
["Overview","综观全局"],
["Broad Eye","广域之视"],
["Strafing Slide","滑行扫射"],
["Eject Magazine","弹匣置换"],
["Gun Glide","恒稳枪杆"],
["Tactical Reload","机动装填"],
["Shield Charger","护盾充能"],
["Static Discharge","静电释放"],
["Flux Overdrive","通量步枪超载"],
["Tether Grenades","系绳榴弹"],
["Thermagnetic Shells","热磁弹药"],
["Kinetic Ricochet","动力回弹"],
["Medi-Pet Kit","宠物治疗套件"],
["Regen","重生"],
["Rupture","破裂"],
["Calculated Redirection","精算蓄能"],
["Intruder","入侵者"],
["Spare Parts","残余"],
["Flailing Branch","多流抽击"],
["Scavenge","搜集"],
["Loyal Companion","忠实搭档"],
["Pack Leader","领袖"],
["Shelter","庇护"],
["Hunt","狩猎"],
["Stalk","隐密追踪"],
["Dig","挖掘"],
["Howl","嚎声"],
["Protect","保护"],
["Unleashed","释放"],
["Savagery","野蛮压制"],
["Ferocity","凶恶终结"],
["Crossing Snakes","双蛇牙突"],
["Disruptor Drone","破坏型无人机"],
["Lingering Torment","恒久折磨"],
["Insulation","隔热"],
["Rending Crane","撕裂鹤击"],
["True Steel","斩铁"],
["Warm Coat","保温服"],
["Sovereign Outcast","至尊浪人"],
["Heavy Trauma","重创"],
["Flechette","箭型弹头"],
["Disruptor","冲击干扰"],
["Sawtooth Clip","锯齿弹链"],
["Accelerated Deflection","加速充能"],
["Flame Repellent","火焰防护"],
["Ghost","幽灵"],
["Sharpened Claws","磨锋之爪"],
["Swipe","挥击"],
["Charm","招福"],
["Reflect","反射"],
["Aviator","飞行员"],
["Continuous Misery","无尽苦难"],
["Spry Sights","迅敏视觉"],
["Agile Aim","机动瞄准"],
["Snap Shot","速射"],
["Reflex Draw","反射拔枪"],
["Twitch","迅速抽换"],
["Soft Hands","精湛快手"],
["Spring-Loaded Broadhead","簧压猎箭"],
["Double-Barrel Drift","游离双管"],
["Collision Force","冲击巨力"],
["Pummel","强力猛击"],
["Crash Course","连续冲击"],
["Full Contact","全面接触"],
["Buzz Kill","败兴虐杀"],
["Maim","致残枪弹"],
["Fanged Fusillade","尖牙连射"],
["Sweeping Serration","扫荡锯齿"],
["Slip Magazine","串联弹匣"],
["Homing Fang","连牙追袭"],
["Blood For Energy","血易能量"],
["Guardian","守护者"],
["Auxiliary Power","辅助动力"],
["Hyperion Thrusters","超越推进"],
["Quick Return","快速收回"],
["Suppress","消音"],
["Fired Up","过热射击"],
["Ammo Case","弹药储转箱"],
["Thumper","重击者"],
["Fatal Attraction","致命诱惑"],
["Gemini Cross","纵横双子"],
["Bleeding Willow","血色万柳"],
["Territorial Aggression","侵略领土"],
["Cat's Eye","猫眼"],
["Mischief","顽皮"],
["Pounce","猛扑"],
["Sense Danger","危机感知"],
["Malicious Raptor","恶毒猛禽"],
["Lightning Rod","避雷针"],
["Slicing Feathers","割裂羽翼"],
["Rebound","弹跳"],
["Shattering Storm","云暴山碎"],
["Overloader","超量载弹"],
["Ripload","撕裂装填"],
["Hyperstrike","超量打击"],
["Ironclad Matrix","铁甲矩阵"],
["Warhead","湮灭弹头"],
["Protective Shots","防护射击"],
["Crimson Fugue","猩红逐击"],
["Hit And Run","脚底抹油"],
["Seismic Palm","震撼冲拳"],
["Medi-Ray","医疗射线"],
["Electromagnetic Shielding","电磁屏障"],
["Vulcan Blitz","火神闪击"],
["Hunter's Bonesaw","猎人骨锯"],
["Nightwatch Napalm","夜巡燃烧弹"],
["Rift Strike","裂缝打击"],
["Fomorian Accelerant","巨人促进剂"],
["Acid Shells","酸性弹药"],
["Out Of Sight","视野之外"],
["Coolant Leak","冷却液外泄"],
["Blood For Ammo","血易弹药"],
["Shattering Impact","碎裂冲击"],
["Hush","消音器"],
["Blood For Life","血易生命"],
["Virulent Scourge","剧毒灾害"],
["Pistol Pestilence","瘟疫手枪"],
["Malignant Force","致命火力"],
["Toxic Barrage","毒素弹幕"],
["Fire Suppression","火势抑制"],
["Scourging Warheads","苦痛弹头"],
["Raider Matrix","劫袭矩阵"],
["Granum's Nemesis","格拉努之劲敌"],
["Forward Artillery","前装光能炮"],
["Ion Burn","离子燃烧"],
["Cruising Speed","巡航速度"],
["Breach Quanta","封隙量子"],
["Orgone Tuning Matrix","能量调谐矩阵"],
["Flow Burn","热流涌动"],
["Defensive Fire","防御火力"],
["Artillery Cheap Shot","高效光能炮"],
["Ordnance Cheap Shot","高效火炮"],
["Battle Forge","战斗锻造"],
["Form Up","列阵归队"],
["Intruder Stasis","侵入停滞"],
["Battle Stations","战位"],
["Fortifying Fire","固盾火力"],
["Quicklock","快速锁定"],
["Void Cloak","虚空隐匿"],
["Section Density","截面密度"],
["Onslaught Matrix","强攻矩阵"],
["Indomitable Matrix","不屈矩阵"],
["Revo Reducer","节流降耗"],
["Squad Renew","小队治愈"],
["Predator","捕食者"],
["Sentient Scalpel","Sentient解剖刀"],
["Conic Nozzle","锥型推进器"],
["Waveband Disruptor","波段干扰"],
["Worm's Torment","蠕虫熬煎"],
["Astral Autopsy","星界剖解"],
["Ballista Measure","弩炮测距"],
["Death Blossom","死亡绽放"],
["Ordnance Velocity","火炮速度"],
["Turret Velocity","炮台速度"],
["Venom Teeth","牙齿毒液"],
["Flame Gland","火焰腺体"],
["Frost Jaw","冰冻双颚"],
["Shock Collar","电击项圈"],
["Odomedic","气息疗愈"],
["Anti-Grav Array","反重力阵列"],
["Comet Shard","冰陨碎弹"],

//PVP
["Feathered Arrows","轻羽箭"],
["Heightened Reflexes","加剧反射"],
["Hastened Steps","紧凑步伐"],
["Adrenaline Boost","肾上腺激素"],
["Vital Systems Bypass","再生分流"],
["Secondary Wind","回气再起"],
["Deft Tempo","灵快节拍"],
["Plan B","应急备案"],
["Kill Switch","屠戮换弹"],
["Gorgon Frenzy","蛇发女妖的狂热"],
["Grinloked","精准火枪"],
["Double Tap","双重连击"],
["Triple Tap","三重连击"],
["Final Tap","最终一击"],
["Directed Convergence","定向汇聚"],
["Sudden Justice","骤然正义"],
["Focused Acceleration","聚焦加速"],
["Measured Burst","精准爆发"],
["Heavy Warhead","重型弹头"],
["Final Act","搏命反扑"],
["Tactical Retreat","战术性撤退"],
["Mortal Conduct","垂死挣扎"],
["Soaring Strike","上升打击"],
["Emergent Aftermath","紧急后果"],
["Static Alacrity","活泼静电"],
["Thundermiter","雷电米特尔"],
["Shrapnel Rounds","破片弹头"],
["Ambush Optics","伏击光子"],
["Skull Shots","头颅射击"],
["Brain Storm","头脑风暴"],
["Draining Gloom","幽暗枯竭"],
//PVP

//道具
["Vapor Specter Blueprint","幻雾魅影蓝图"],
["Phase Specter Blueprint","相位魅影蓝图"],
["Force Specter Blueprint","原力魅影蓝图"],
["Cosmic Specter Blueprint","无极魅影蓝图"],
["Health Restore (Large)","生命补给(大型)"],
["Omni Ammo Box","综合弹药箱"],

["Arcane Tempo","节奏赋能"],
["Arcane Consequence","结果赋能"],
["Arcane Momentum","动量赋能"],
["Arcane Ice","冰冷赋能"],
["Arcane Nullifier","消磁赋能"],
["Arcane Warmth","温暖赋能"],
["Arcane Resistance","抗毒赋能"],
["Arcane Victory","胜利赋能"],
["Arcane Strike","速攻赋能"],
["Arcane Acceleration","加速赋能"],
["Arcane Aegis","神盾赋能"],
["Arcane Precision","精确赋能"],
["Arcane Pulse","生机赋能"],
["Primary Plated Round","主要镀金弹头"],
["Secondary Kinship","次要手足"],
["Secondary Encumber","次要妨害"],
["Arcane Double Back","回返赋能"],
["Arcane Steadfast","坚定赋能"],
["Arcane Healing","复原赋能"],
["Arcane Awakening","觉醒赋能"],
["Arcane Guardian","保卫者赋能"],
["Arcane Trickery","诡计赋能"],
["Arcane Ultimatum","通牒赋能"],
["Arcane Rage","愤怒赋能"],
["Arcane Fury","狂怒赋能"],
["Arcane Deflection","偏折赋能"],
["Arcane Phantasm","幻象赋能"],
["Arcane Eruption","爆发赋能"],
["Arcane Velocity","迅速赋能"],
["Arcane Agility","灵敏赋能"],
["Arcane Avenger","复仇者赋能"],
["Arcane Arachne","蜘蛛赋能"],
["Conjunction Voltage","联结电压"],
["Arcane Rise","崛起赋能"],
["Arcane Blessing","赐福赋能"],
["Primary Frostbite","主要霜冻"],
["Arcane Grace","优雅赋能"],
["Arcane Energize","充沛赋能"],
["Arcane Barrier","壁垒赋能"],
["Arcane Blade Charger","刀刃充能赋能"],
["Arcane Pistoleer","枪炮赋能"],
["Arcane Primary Charger","主武充能赋能"],
["Arcane Tanker","坦克赋能"],
["Arcane Bodyguard","卫士赋能"],
["Residual Viremia","残差毒血"],
["Residual Malodor","残差恶嗅"],
["Residual Boils","残差燃沸"],
["Residual Shock","残差电击"],
["Theorem Contagion","定理触染"],
["Theorem Demulcent","定理缓和"],
["Theorem Infection","定理感染"],
["Arcane Intention","心相赋能"],
["Shotgun Vendetta","霰弹仇杀"],
["Primary Exhilarate","主要激昂"],
["Primary Obstruct","主要滞阻"],
["Magus Aggress","魔导侵略"],
["Arcane Power Ramp","力升赋能"],
["Akimbo Slip Shot","双枪滑射"],
["Secondary Outburst","次要爆发"],
["Primary Blight","主要毒侵"],
["Arcane Reaper","收割赋能"],
["Secondary Shiver","次要冷颤"],
["Longbow Sharpshot","弓箭利矢"],
["Fractalized Reset","分形重置"],
["Eternal Eradicate","永恒湮灭"],
["Eternal Onslaught","永恒猛攻"],
["Eternal Logistics","永恒流转"],
["Cascadia Accuracy","瀑流精准"],
["Cascadia Flare","瀑流耀炎"],
["Molt Vigor","蜕化活力"],
["Molt Augmented","蜕化升腾"],
["Molt Reconstruct","蜕化重塑"],
["Emergence Savior","始现救世"],
["Cascadia Empowered","瀑流强化"],
["Molt Efficiency","蜕化效能"],
["Emergence Renewed","始现新生"],
["Emergence Dissipate","始现消散"],
["Cascadia Overcharge","瀑流溢能"],
["Primary Deadhead","主要死首"],
["Primary Dexterity","主要熟练"],
["Primary Merciless","主要无情"],
["Secondary Deadhead","次要死首"],
["Secondary Dexterity","次要熟练"],
["Secondary Merciless","次要无情"],

["Primary Arcane Adapter","主要武器赋能槽连接器"],
["Secondary Arcane Adapter","次要武器赋能槽连接器"],
["Damaged Necramech Casing","损坏的殁世机甲 外壳"],
["Damaged Necramech Engine","损坏的殁世机甲 引擎"],
["Damaged Necramech Pod","损坏的殁世机甲 机舱"],
["Damaged Necramech Weapon Barrel","损坏的殁世机甲武器枪管"],
["Damaged Necramech Weapon Pod","损坏的殁世机甲 武器舱"],
["Damaged Necramech Weapon Receiver","损坏的殁世机甲武器枪机"],
["Damaged Necramech Weapon Stock","损坏的殁世机甲武器枪托"],

["Furax Wraith Left Gauntlet","弗拉克斯亡魂左拳套"],
["Furax Wraith Right Gauntlet","弗拉克斯亡魂右拳套"],
["Furax Wraith Blueprint","弗拉克斯亡魂蓝图"],
["The Xoris","驱魔之刃"],

["Kitgun Riven Mod","组合枪裂罅MOD"],
["Melee Riven Mod","近战裂罅MOD"],
["Pistol Riven Mod","手枪裂罅MOD"],
["Rifle Riven Mod","步枪裂罅MOD"],
["Riven Mod","裂罅MOD"],
["Riven Mods","裂罅MOD"],
["Shotgun Riven Mod","霰弹枪裂罅MOD"],
["Zaw Riven Mod","Zaw裂罅Mod"],

["Ancient Healer Specter Blueprint","远古治愈者魅影蓝图"],
["Charger Specter Blueprint","疾冲者魅影蓝图"],
["Corpus Ship Orbital Cannon Scene","Corpus 船舰追踪炮场景"],

["Freezing Step Ephemera Blueprint","急冻步伐幻纹蓝图"],
["Shocking Step Ephemera Blueprint","震荡步伐幻纹蓝图"],
["Smoking Body Ephemera Blueprint","烟雾之躯幻纹蓝图"],
["Hate Blueprint","憎恨蓝图"],
["Despair Blueprint","绝望蓝图"],
["Dread Blueprint","恐惧蓝图"],

["Twin Gremlins Blueprint","双子小精灵蓝图"],
["Twin Kohmak Blueprint","双子寇恩霰机枪蓝图"],
["Eidolon Lens Blueprint","夜灵晶体蓝图"],
["Cyath Blueprint","西亚什 蓝图"],

["Help Clem Retrieve The Relic","帮Clen找回圣物"],
["Saturn Six Mask","土星六号面具"],
["Elixis Latron Chest Plate","镀铜拉特昂胸甲"],
["Elixis Latron Leg Plate","镀铜拉特昂护腿"],
["Elixis Latron Shoulder Plate","镀铜拉特昂肩甲"],
["Nauseous Void Shade","呕吐虚空之影"],
//资源
["Region Resource","当地资源"],
["Morphics","非晶态合金"],
["Gallium","镓"],
["Neurodes","神经元"],
["Argon Crystal","氩结晶"],
["Tellurium","碲"],
["Nitain Extract","泥炭萃取物"],
["Rune Marrow","密印髓质"],
["Spectral Debris","魅影残粒"],
["Sharrac Teeth","鲨客牙齿"],
["Ticor Plate","钛核甲片"],
["Isos","修复凝液"],

["Voidplume Crest","虚空冠翎"],
["Voidplume Down","虚空绒翎"],
["Voidplume Pinion","虚空羽翎"],
["Voidplume Quill","虚空刺翎"],
["Voidplume Vane","虚空翼翎"],

["Iradite Formation","伊莱体构造"],
["Thermal Sludge Canister","热能软泥罐"],

["Zenith Granum Crown","顶级格拉努硬币"],
["Exemplar Granum Crown","范本格拉努硬币"],
["Granum Crown","格拉努硬币"],
["Pulsating Tubercles","脉动节瘤"],
["Infected Palpators","感染触肢"],
["Chitinous Husk","几丁质外壳"],
["Severed Bile Sac","胆囊块"],
["Auron","金辉"],
["Coprun","亚铜"],
["Ferros","铁岩"],
["Pyrol","炎晶"],
["Azurite","蓝铜矿石"],
["Crimzian","绯红石"],
["Devar","兄弟之石"],
["Nyth","灵息石"],
["Sentirum","心智晶核"],
["Veridos","翠萤石"],
["Seram Beetle Shell","瑟拉姆甲虫外壳"],
["Norg Brain","诺格鱼脑"],
["Longwinder Lathe Coagulant","长型环绕者车床凝聚剂"],
["Charamote Sagan Module","重筑虾萨根模块"],
["Tromyzon Entroplasma","多目鳗熵离子体"],
["Synathid Ecosynth Analyzer","海龙环境合成分析器"],
["Zodian","黄道宝石"],
["Thyst","赤色水晶"],
["Travoride","铁镍矿"],
["Axidite","酸化矿物"],
["Venerol","启明矿石"],
["Hesperon","长庚矿石"],
["Phasmin","翡斯敏石"],
["Noctrul","夜石"],
["Goblite","填充细石"],
["Amarast","紫苋石"],
["Lamentus","哀灵精华"],
["Murkray Liver","阴暗鳐肝脏"],
["Mortuus Shoulder Guard","亡者护肩"],
["Noggle Statue - Inaros Sarcophagus","Inaros 石棺摇头娃娃"],
["Inaros Osiris Helmet","Inaros 欧西里斯头盔"],

["Operation: Orphix Venom","行动代号：奥影之毒"],
["Murex Raid","骨螺战舰突袭"],
["Mutalist Alad V Assassinate","异融Alad V刺杀"],
["Molted Cask","虚蜕木桶"],
["Orphid Husks","兰花外皮"],
["Vay Hek Frequency Triangulator","Vay Hek座标频率三角仪"],
["Vay Hek Terra Frame","Vay Hek地球外装战甲"],
["Baro Void-Signal","Baro 虚空信号"],
["Powercell","能量电池"],
["Exceptional Sentient Core","卓越的Sentient核心"],
["Flawless Sentient Core","无瑕的Sentient核心"],
["Intact Sentient Core","完整的Sentient核心"],
["Sentient Cores","Sentient核心"],
["Omnipak","补给箱"],
["Pathocyst Blade","病囊飞刃刀刃"],
["Pathocyst Subcortex","病囊飞刃下皮层"],

["Encrypted Journal Fragment","加密的日记碎片"],
["Zenith Granum Crown Decoration ","顶级格拉努硬币装饰"],
["Exemplar Granum Crown Decoration","范本格拉努硬币装饰"],
["Granum Crown Decoration","格拉努硬币装饰"],
["Exemplar Granum Crown Cache","范本格拉努硬币储藏箱"],
["Granum Crown Cache","格拉努硬币储藏箱"],
["Zenith Granum Crown Cache","顶级格拉努硬币储藏箱"],

["Orb Vallis - Enrichment Labs Enemies","奥布山谷升华实验室的敌人"],
["Orb Vallis - Spaceport Enemies","奥布山谷航天站的敌人"],
["Orb Vallis - Temple of Profit Enemies","奥布山谷润盈寺的敌人"],

//怪物
["Amalgam Alkonost","并合翠莺"],
["Amalgam Arca Heqet","并合弧电灵蛙"],
["Amalgam Arca Kucumatz","并合弧电羽蛇"],
["Amalgam Cinder Machinist","并合熔渣机械师"],
["Amalgam Heqet","并合灵蛙"],
["Amalgam Kucumatz","并合羽蛇"],
["Amalgam Machinist","并合机械师"],
["Amalgam Moa","并合恐鸟"],
["Amalgam Osprey","并合鱼鹰"],
["Amalgam Phase Moa","并合相位恐鸟"],
["Amalgam Satyr","并合半羊兽"],
["Amalgam Swarm Satyr","并合群集半羊兽"],
["Dax Gladius","禁卫剑士"],
["Dax Herald","禁卫使徒"],
["Dax Malleus","禁卫重锤者"],
["Dax Arcus","禁卫弓箭手"],
["Dax Equitem","禁卫随从"],
["Demolisher Charger","爆破型疾冲者"],
["Demolisher Thrasher","爆破型奔跳者"],
["Demolisher Juggernaut","爆破型巨兽"],
["Demolisher Boiler","爆破型痈裂者"],
["Demolisher Devourer","爆破型吞噬者"],
["Demolisher Expired","爆破型除役尸鬼"],
["Demolisher Heavy Gunner","爆破型重型机枪手"],
["Demolisher Bailiff","爆破型执法员"],
["Demolisher Machinist","爆破型机械师"],
["Demolisher Bursa","爆破型金流恐鸟"],
["Demolisher Hyena","爆破型鬣狗"],
["Demolisher Anti Moa","爆破型逆进恐鸟"],
["Demolisher Nox","爆破型毒化者"],
["Demolisher Kuva Guardian","爆破型赤毒守卫者"],
["Demolyst Machinist","爆破使机械师"],
["Demolyst Osprey","爆破使鱼鹰"],
["Demolyst Satyr","爆破使半羊兽"],
["Demolyst Moa","爆破使恐鸟"],
["Demolyst Heqet","爆破使灵蛙"],
["Detron Crewman","德特昂船员"],
["Elite Arid Lancer","精英沙漠枪兵"],
["Elite Axio Basilisk","精英艾汐蛇妖战机"],
["Elite Axio Harpi","精英艾汐鹰掠战机"],
["Elite Axio Weaver","精英艾汐旋织战机"],
["Elite Crewman","精英船员"],
["Elite Exo Cutter","精英邃域切割战机"],
["Elite Exo Flak","精英邃域高炮战机"],
["Elite Exo Outrider","精英邃域先驱战机"],
["Elite Exo Taktis","精英邃域战术战机"],
["Elite Exo Gokstad Crewship","精英邃域高克斯塔战舰"],
["Elite Frontier Lancer","精英前线枪兵"],
["Elite Gyre Cutter","精英回旋切割战机"],
["Elite Gyre Flak","精英回旋高炮战机"],
["Elite Gyre Outrider","精英回旋先驱战机"],
["Elite Gyre Taktis","精英回旋战术战机"],
["Elite Kosma Cutter","精英深空切割战机"],
["Elite Kosma Flak","精英深空高炮战机"],
["Elite Kosma Outrider","精英深空先驱战机"],
["Elite Kosma Taktis","精英深空战术战机"],
["Elite Lancer","精英枪兵"],
["Elite Orm Basilisk","精英奥穆蛇妖战机"],
["Elite Orm Harpi","精英奥穆鹰掠战机"],
["Elite Orm Weaver","精英奥穆旋织战机"],
["Elite Shield Lancer","精英盾枪兵"],
["Elite Taro Basilisk","精英泰洛蛇妖战机"],
["Elite Taro Harpi","精英泰洛鹰掠战机"],
["Elite Taro Weaver","精英泰洛旋织战机"],
["Elite Vorac Basilisk","精英沃拉蛇妖战机"],
["Elite Vorac Harpi","精英沃拉鹰掠战机"],
["Elite Vorac Weaver","精英沃拉旋织战机"],
["Eviscerator","开膛者"],
["Executioner Dhurnam","行刑者Dhurnam"],
["Executioner Dok Thul","行刑者Dok Thul"],
["Executioner Garesh","行刑者Garesh"],
["Executioner Gorth","行刑者Gorth"],
["Executioner Harkonar","行刑者Harkonar"],
["Executioner Nok","行刑者Nok"],
["Executioner Reth","行刑者Reth"],
["Executioner Vay Molta","行刑者Vay Molta"],
["Executioner Zura","行刑者Zura"],
["Exo Butcher","邃域屠夫"],
["Exo Cutter","邃域切割战机"],
["Exo Elite Lancer","邃域精英枪兵"],
["Exo Eviscerator","邃域开膛者"],
["Exo Flak","邃域高炮战机"],
["Exo Gokstad Crewship","邃域高克斯塔战舰"],
["Exo Gokstad Officer","邃域高克斯塔军官"],
["Exo Gokstad Pilot","邃域高克斯塔飞行员"],
["Exo Outrider","邃域先驱战机"],
["Exo Raider Carver","邃域强袭切割者"],
["Exo Raider Eviscerator","邃域强袭开膛者"],
["Exo Roller Sentry","邃域滚子哨兵"],
["Exo Skold Crewship","邃域斯考尔德战舰"],
["Exo Supressor","邃域怒焚镇压者"],
["Exo Taktis","邃域战术战机"],
["Arcane Boiler","秘奥痈裂者"],
["Archon Amar","执刑官欺谋狼主"],
["Archon Boreal","执刑官诡文枭主"],
["Archon Nira","执刑官混沌蛇主"],
["Arid Butcher","沙漠屠夫"],
["Arid Eviscerator","沙漠开膛者"],
["Arid Heavy Gunner","沙漠重型机枪手"],
["Arid Hellion","沙漠恶徒"],
["Arid Lancer","沙漠枪兵"],
["Arid Seeker","沙漠追踪者"],
["Arid Trooper","沙漠骑兵"],
["Armaments Director","军备主管"],
["Armored Roller","重装滚子"],
["Artificer","技工"],
["Attack Drone","无人机"],
["Attack Multalist","发射感染孢子"],
["Aurax Actinic","傲金光化者"],
["Aurax Altoc Raknoid","傲金锁战蛛形机"],
["Aurax Baculus","傲金杖兵"],
["Aurax Culveri Moa","傲金重火恐鸟"],
["Aurax Polaris Moa","傲金极冻恐鸟"],
["Aurax Vertec","傲金终极者"],
["Axio Basilisk","艾汐蛇妖战机"],
["Axio Crewman","艾汐船员"],
["Axio Crewship","艾汐战舰"],
["Axio Detron Crewman","艾汐德特昂船员"],
["Axio Disc Moa","艾汐圆盘恐鸟"],
["Axio Elite Crewman","艾汐精英船员"],
["Axio Engineer","艾汐工程师"],
["Axio Gox","艾汐神锋战机"],
["Axio Harpi","艾汐鹰掠战机"],
["Axio Moa","艾汐恐鸟"],
["Axio Nullifier Crewman","艾汐虚能船员"],
["Axio Numon","艾汐撕裂者"],
["Axio Pilot","艾汐飞行员"],
["Axio Railgun Moa","艾汐磁轨炮恐鸟"],
["Axio Ranger Crewman","艾汐突击船员"],
["Axio Secura Osprey","艾汐保障鱼鹰"],
["Axio Shield Osprey","艾汐护盾鱼鹰"],
["Axio Shockwave Moa","艾汐震荡恐鸟"],
["Axio Stropha Crewman","艾汐诡计之刃船员"],
["Axio Tech","艾汐技工"],
["Axio Vambac","艾汐威击者"],
["Axio Weaver","艾汐旋织战机"],
["Axio Zerca","艾汐狂暴者"],
["Basal Diploid Rex","基底二倍体之王"],
["Basal Diploid","基底二倍体"],
["Anu Mantalyst","安努劫持使"],
["Anu Mantalysts","安努劫持使"],
["Anu Pyrolyst","安努烈焰使"],
["Anu Pyrolysts","安努烈焰使"],
["Anti Moa","逆进恐鸟"],
["Apex Membroid","老年囊"],
["Angst","焦虑"],
["Aerolyst","空飞使"],
["Aerial Commander","空中指挥官"],
["Ancient Disruptor","远古干扰者"],
["Ancient Healer","远古治愈者"],
["Ancient Infested","Lephantis远古头"],
["Arbitration Shield Drone","仲裁者神盾无人机"],
["Bailiff Defector","叛逃执法员"],
["Bailiff","执法员"],
["Ballista","弩炮"],
["Battalyst","武装使"],
["Blite Captain","Blite舰长"],
["Boiler","痈裂者"],
["Bombard","轰击者"],
["Brachiolyst","狂战使"],
["Brood Mother","病变虫母"],
["Butcher","屠夫"],
["Butcher's Revelry","屠戮盛宴"],
["Cannon Battery","加农炮台"],
["Captain Vor","Vor上尉"],
["Carabus","自爆虫"],
["Carrion Charger","腐肉疾冲者"],
["Carrypod","随身舱"],
["Charger","疾冲者"],
["Cinderthresh Hyena","炉渣翻打鬣狗"],
["Coastal Mergoo","沿海秋沙鸟"],
["Coildrive","线圈滚轮"],
["Commander","指挥官（敌人）"],
["Conculyst","震荡使"],
["Coolant Raknoid","冷却蛛形机"],
["Corpus Cestra Target","Corpus锡斯特目标"],
["Corpus Power Carrier","Corpus能量运送者"],
["Corpus Ramsled","Corpus冲锋艇"],
["Corpus Sniper Target","Corpus狙击手目标"],
["Corpus Supra Target","Corpus苏普拉目标"],
["Corpus Tech","Corpus技师"],
["Corpus Trencher Target","Corpus掘沟者目标"],
["Corpus Warden","Corpus典狱长"],
["Corrupted Ancient","远古堕落者"],
["Corrupted Bombard","堕落轰击者"],
["Corrupted Butcher","堕落屠夫"],
["Corrupted Crewman","堕落船员"],
["Corrupted Drahk Master","堕落爪喀驯兽师"],
["Corrupted Drahk","堕落爪喀"],
["Corrupted Drone","堕落无人机"],
["Corrupted Heavy Gunner","堕落重型机枪手"],
["Corrupted Holokey","堕落全息密钥"],
["Corrupted Lancer","堕落枪兵"],
["Corrupted Moa","堕落恐鸟"],
["Corrupted Mods","堕落MOD"],
["Corrupted Nullifier","堕落虚能者"],
["Corrupted Vor","堕落的Vor"],
["Corrupted Warden","堕落典狱长"],
["Corvette","护卫舰"],
["Councilor Vay Hek","Vay Hek委员"],
["Courier","运输船"],
["Crawler","爬行者"],
["Crewman","船员"],
["Cuthol Tendrils","克苏尔卷须"],
["Darek Draga","疏浚兵长"],
["Dargyn","轻型艇"],
["Dargyn Pilot","轻型艇飞行员"],
["Datalyst","资料师"],
["Decaying Battalyst","腐朽武装使"],
["Decaying Conculyst","腐坏震荡使"],
["Denial Bursa","守护金流恐鸟"],
["Draga","疏浚兵"],
["Drahk Master","爪喀驯兽师"],
["Drahk","爪喀"],
["Dreg","无人机（Grineer空战）"],
["Drekar Ballista","龙舰弩炮"],
["Drekar Blunt","龙舰便携掩体"],
["Drekar Butcher","龙舰屠夫"],
["Drekar Elite Lancer","龙舰精英枪兵"],
["Drekar Eviscerator","龙舰开膛者"],
["Drekar Heavy Gunner","龙舰重型机枪手"],
["Drekar Hellion","龙舰恶徒"],
["Drekar Lancer","龙舰枪兵"],
["Drekar Manic Bombard","龙舰狂躁轰击者"],
["Drekar Manic","龙舰狂躁者"],
["Drekar Scorpion","龙舰天蝎"],
["Drekar Seeker","龙舰追踪者"],
["Drekar Trooper","龙舰骑兵"],
["Drover Bursa","驱引金流恐鸟"],
["Eagle Eye","鹰眼"],
["Eidolon Gantulyst","夜灵巨力使"],
["Eidolon Hydrolyst","夜灵水力使"],
["Eidolon Teralyst","夜灵兆力使"],
["Eidolon Vomvalyst","夜灵轰击使"],
["Electric Crawler","电击爬行者"],
["Emperor Condroc","帝王秃鹰"],
["Exploiter Orb","剥削者圆蛛"],
["Feral Diploid Rex","凶猛二倍体之王"],
["Feral Diploid","凶猛二倍体"],
["Feyarch Specter","精灵之王魅影"],
["Flameblade","烈焰刀客"],
["Fog Comba","迷雾驱逐员"],
["Fog Scrambus","迷雾扰敌员"],
["Frigate","驱逐舰"],
["Frontier Bailiff","前线执法员"],
["Frontier Butcher","前线屠夫"],
["Frontier Eviscerator","前线开膛者"],
["Frontier Heavy Gunner","前线重型机枪手"],
["Frontier Hellion","前线恶徒"],
["Frontier Lancer","前线枪兵"],
["Frontier Regulator","前线调整者"],
["Frontier Seeker","前线追踪者"],
["Frontier Trooper","前线骑兵"],
["Ghoul Auger Alpha","钻孔尸鬼首领"],
["Ghoul Auger","钻孔尸鬼"],
["Ghoul Devourer","吞噬者尸鬼"],
["Ghoul Expired Deserter","除役尸鬼逃兵"],
["Ghoul Expired","除役尸鬼"],
["Ghoul Purge","尸鬼净化"],
["Ghoul Rictus Alpha","裂嘴尸鬼头领"],
["Ghoul Rictus","裂嘴尸鬼"],
["Ghoul Target","尸鬼目标"],
["Ghoul","尸鬼"],
["Gyre Automaton Helmet","Gyre姬械头盔"],
["Gyre Butcher","回旋屠夫"],
["Gyre Cutter","回旋切割战机"],
["Gyre Elite Lancer","回旋精英枪兵"],
["Gyre Eviscerator","回旋开膛者"],
["Gyre Flak","回旋高炮战机"],
["Gyre Gokstad Crewship","回旋高克斯塔战舰"],
["Gyre Gokstad Officer","回旋高克斯塔军官"],
["Gyre Gokstad Pilot","回旋高克斯塔飞行员"],
["Gyre Hyena","回旋鬣狗"],
["Gyre Outrider","回旋先驱战机"],
["Gyre Raider Carver","回旋强袭切割者"],
["Gyre Raider Eviscerator","回旋强袭开膛者"],
["Gyre Raider","回旋强袭者"],
["Gyre Ramsled","回旋冲锋艇"],
["Gyre Supressor","回旋怒焚镇压者"],
["Gyre Taktis","回旋战术战机"],
["Hyekka Master","鬣猫驯兽师"],
["Hyekka","鬣猫"],
["Hyena LN2","鬣狗液氮"],
["Hyena Ng","鬣狗硝酸"],
["Hyena Pack","鬣狗群"],
["Hyena Pb","鬣狗铅"],
["Hyena Th","鬣狗钍"],
["Hellion Dargyn","恶徒轻型艇"],
["Hellion Power Carrier","核心搬运恶徒"],
["Hellion","恶徒"],
["Infested Corpus","Lephantis（Corpus头）"],
["Infested Grineer","Lephantis（Grineer头）"],
["Juno Crewman","朱诺船员"],
["Juno Dera Moa","朱诺德拉恐鸟"],
["Juno Disc Moa","朱诺圆盘恐鸟"],
["Juno Elite Crewman","朱诺精英船员"],
["Juno Fog Comba","朱诺迷雾驱逐员"],
["Juno Geminex Moa","朱诺双子炮恐鸟"],
["Juno Glaxion Moa","朱诺冷冻光束步枪恐鸟"],
["Juno Jactus Osprey","朱诺延爆鱼鹰"],
["Juno Malleus Machinist","朱诺锤骨机械师"],
["Juno Nul Comba","朱诺虚无驱逐员"],
["Juno Nullifier Crewman","朱诺虚能船员"],
["Juno Oxium Osprey","朱诺奥席金属鱼鹰"],
["Juno Sap Comba","朱诺衰竭驱逐员"],
["Juno Shield Osprey","朱诺护盾鱼鹰"],
["Juno Slo Comba","朱诺滞缓驱逐员"],
["Juno Sniper Crewman","朱诺狙击手船员"],
["Juno Tech","朱诺技工"],
["Kosma Butcher","深空屠夫"],
["Kosma Cutter","深空切割战机"],
["Kosma Elite Lancer","深空精英枪兵"],
["Kosma Eviscerator","深空开膛者"],
["Kosma Flak","深空高炮战机"],
["Kosma Gokstad Crewship","深空高克斯塔战舰"],
["Kosma Gokstad Officer","深空高克斯塔军官"],
["Kosma Gokstad Pilot ","深空高克斯塔飞行员"],
["Kosma Gokstad Pilot","深空高克斯塔飞行员"],
["Kosma Outrider","深空先驱战机"],
["Kosma Raider Carver","深空强袭切割者"],
["Kosma Raider Eviscerator","深空强袭开膛者"],
["Kosma Raider","深空强袭者"],
["Kosma Ramsled","深空冲锋艇"],
["Kosma Roller Sentry","深空滚子哨兵"],
["Kosma Supressor","深空怒焚镇压者"],
["Kosma Taktis","深空战术战机"],
["Mutalist Alad V","异融Alad V"],
["Mutalist Lightning Carrier","异融电击运送者"],
["Mutalist Osprey Carrier","异融运输者鱼鹰"],
["Mutalist Osprey","剧毒无人机"],
["Mutalist Toxic Carrier","异融剧毒运送者"],
["Narmer Ballista","合一众弩炮"],
["Narmer Bolkor","合一众博寇"],
["Narmer Bombard","合一众轰击者"],
["Narmer Commander","合一众指挥官"],
["Narmer Crewman","合一众船员"],
["Narmer Dera Moa","合一众德拉恐鸟"],
["Narmer Detron Crewman","合一众德特昂船员"],
["Narmer Disc Moa","合一众圆盘恐鸟"],
["Narmer Dropship","合一众空投挺"],
["Narmer Firbolg","合一众博格"],
["Narmer Flameblade","合一众烈焰刀客"],
["Narmer Geminex Moa","合一众双子炮恐鸟"],
["Narmer Glaxion Moa","合一众冷冻光束步枪恐鸟"],
["Narmer Heavy Gunner","合一众重型机枪手"],
["Narmer Hellion","合一众恶徒"],
["Narmer Isoplast","合一众塑讯块"],
["Narmer Jailer","合一众狱吏"],
["Narmer Lancer","合一众枪兵"],
["Narmer Leech Osprey","合一众吸血鱼鹰"],
["Narmer Mine Osprey","合一众地雷鱼鹰"],
["Narmer Mite","合一众微螨"],
["Narmer Napalm","合一众火焰轰击者"],
["Narmer Nullifier Crewman","合一众虚能船员"],
["Narmer Powerfist","合一众重击手"],
["Narmer Prod Crewman","合一众监工船员"],
["Narmer Raknoid","合一众蛛形机"],
["Narmer Sapping Osprey","合一众基蚀鱼鹰"],
["Narmer Oxium Osprey","合一众奥席金属鱼鹰"],
["Narmer Disc Moa","合一众圆盘恐鸟"],
["Narmer Scorch","合一众怒焚者"],
["Narmer Scorpion","合一众天蝎"],
["Narmer Shield Lancer","合一众盾枪兵"],
["Narmer Shield Osprey","合一众护盾鱼鹰"],
["Narmer Sniper Crewman","合一众狙击手船员"],
["Narmer Tech","合一众Corpus技师"],
["Narmer Thumper Doma","合一众重击者朵玛"],
["Narmer Trooper","合一众骑兵"],
["Nightwatch Bailiff","夜巡执法员"],
["Nightwatch Bombard","夜巡轰击者"],
["Nightwatch Brunt Lancer","夜巡者盾枪兵"],
["Nightwatch Carrier ","夜巡搬运者"],
["Nightwatch Flameblade","夜巡者烈焰刀客"],
["Nightwatch Hyekka Master","夜巡者鬣猫驯兽师"],
["Nightwatch Lancer","夜巡者枪兵"],
["Nightwatch Lancers","夜巡者枪兵"],
["Nightwatch Manic","夜巡狂躁者"],
["Nightwatch Powerclaw","夜巡者猛力爪兵"],
["Nightwatch Reaver","夜巡掠夺者"],
["Nightwatch Seeker","夜巡追踪者"],
["Orm Basilisk","奥穆蛇妖战机"],
["Orm Crewman","奥穆船员"],
["Orm Crewship","奥穆战舰"],
["Orm Detron Crewman","奥穆德特昂船员"],
["Orm Disc Moa","奥穆圆盘恐鸟"],
["Orm Elite Crewman","奥穆精英船员"],
["Orm Engineer","奥穆工程师"],
["Orm Gox","奥穆神锋战机"],
["Orm Harpi","奥穆鹰掠战机"],
["Orm Moa","奥穆恐鸟"],
["Orm Disc Moa","奥穆圆盘恐鸟"],
["Orm Nullifier Crewman","奥穆虚能船员"],
["Orm Numon","奥穆撕裂者"],
["Orm Pilot","奥穆飞行员"],
["Orm Railgun Moa","奥穆磁轨炮恐鸟"],
["Orm Ranger Crewman","奥穆突击船员"],
["Orm Secura Osprey","奥穆保障鱼鹰"],
["Orm Shield Osprey","奥穆护盾鱼鹰"],
["Orm Shockwave Moa","奥穆震荡恐鸟"],
["Orm Stropha Crewman","奥穆诡计之刃船员"],
["Orm Tech","奥穆技工"],
["Orm Vambac","奥穆威击者"],
["Orm Weaver","奥穆旋织战机"],
["Orm Zerca","奥穆狂暴者"],
["Raptor Mt","猛禽Mt"],
["Raptor Ns","猛禽Ns"],
["Raptor Rv ","猛禽Rv"],
["Raptor Rv","猛禽RV"],
["Raptor RX","猛禽RX"],
["Raptor","猛禽"],
["Shield Dargyn","护盾轻型艇"],
["Shield Drones","护盾无人机"],
["Shield Lancer","盾枪兵"],
["Shield Osprey","护盾鱼鹰"],
["Shield-Hellion Dargyn","护盾恶徒轻型艇"],
["Shock Draga","电击疏浚兵"],
["Shockwave Moa","震荡恐鸟"],
["Taro Basilisk","泰洛蛇妖战机"],
["Taro Crewman","泰洛船员"],
["Taro Crewship","泰洛战舰"],
["Taro Detron Crewman","泰洛德特昂船员"],
["Taro Disc Moa","泰洛圆盘恐鸟"],
["Taro Elite Crewman","泰洛精英船员"],
["Taro Engineer","泰洛工程师"],
["Taro Gox","泰洛神锋战机"],
["Taro Harpi","泰洛鹰掠战机"],
["Taro Moa","泰洛恐鸟"],
["Taro Nullifier Crewman","泰洛虚能船员"],
["Taro Numon","泰洛撕裂者"],
["Taro Pilot","泰洛飞行员"],
["Taro Railgun Moa","泰洛磁轨炮恐鸟"],
["Taro Ranger Crewman","泰洛突击船员"],
["Taro Secura Osprey","泰洛保障鱼鹰"],
["Taro Shield Osprey","泰洛护盾鱼鹰"],
["Taro Shockwave Moa","泰洛震荡恐鸟"],
["Taro Stropha Crewman","泰洛诡计之刃船员"],
["Taro Tech","泰洛技工"],
["Taro Disc Moa","泰洛圆盘恐鸟"],
["Taro Vambac","泰洛威击者"],
["Taro Weaver","泰洛旋织战机"],
["Taro Zerca","泰洛狂暴者"],
["Terra Ambulas","大地Ambulas"],
["Terra Anti Moa","大地逆进恐鸟"],
["Terra Attack Drone","大地攻击型无人机"],
["Terra Auto Turret","大地炮台"],
["Terra Crewman","大地船员"],
["Terra Elite Crewman","大地精英船员"],
["Terra Elite Embattor Moa","大地精英布阵恐鸟"],
["Terra Elite Overtaker","大地精英掷弹者"],
["Terra Elite Provisor","大地精英采办者"],
["Terra Elite Raptor Sx","大地精英猛禽Sx"],
["Terra Elite Trencher","大地精英掘沟者"],
["Terra Embattor Moa","大地布阵恐鸟"],
["Terra Jackal","大地豺狼"],
["Terra Jailer","大地狱吏"],
["Terra Oxium Osprey","大地奥席金属鱼鹰"],
["Terra Turret Osprey","大地炮塔鱼鹰"],
["Terra Cestra Manker","大地锡斯特残害者"],
["Terra Detron Crewman","大地德特昂船员"],
["Terra Nullifier Crewman","大地虚能船员"],
["Terra Research","大地研究船员"],
["Terra Manker","大地残害者"],
["Terra Moa","大地恐鸟"],
["Terra Overtaker","大地掷弹者"],
["Terra Plasmor Crewman","大地离子枪船员"],
["Terra Provisor","大地采办者"],
["Terra Railgun Moa","大地磁轨炮恐鸟"],
["Terra Raptor Sx","大地猛禽Sx"],
["Terra Rocket Turret","大地火箭炮台"],
["Terra Shield Osprey","大地护盾鱼鹰"],
["Terra Shockwave Moa","大地震荡恐鸟"],
["Terra Sniper Crewman","大地狙击手船员"],
["Terra Trencher","大地掘沟者"],
["Tusk Ballista","巨牙弩炮"],
["Tusk Bolkor","巨牙博寇"],
["Tusk Bombard","巨牙轰击者"],
["Tusk Butcher","巨牙屠夫"],
["Tusk Carabus","巨牙甲虫"],
["Tusk Command Dargyn","巨牙指挥轻型艇"],
["Tusk Dargyn","巨牙轻型艇"],
["Tusk Drahk Master","巨牙爪喀驯兽师"],
["Tusk Drudge","巨牙苦工"],
["Tusk Elite Lancer","巨牙精英枪兵"],
["Tusk Eviscerator","巨牙开膛者"],
["Tusk Firbolg","巨牙博格"],
["Tusk Flameblade","巨牙烈焰刀客"],
["Tusk Grattler","巨牙葛拉特勒"],
["Tusk Heavy Gunner","巨牙重型机枪手"],
["Tusk Hellion Carrier","巨牙恶徒运输者"],
["Tusk Hellion","巨牙恶徒"],
["Tusk Hyekka Master","巨牙鬣猫驯兽师"],
["Tusk Lancer","巨牙枪兵"],
["Tusk Mortar Bombard","巨牙迫击炮轰击者"],
["Tusk Napalm","巨牙火焰轰击者"],
["Tusk Ogma","巨牙欧格玛"],
["Tusk Power Carrier","巨牙能量运送者"],
["Tusk Powerclaw","巨牙猛力爪兵"],
["Tusk Predator","巨牙掠食者"],
["Tusk Reaver","巨牙掠夺者"],
["Tusk Roller","巨牙滚子"],
["Tusk Scorch","巨牙怒焚者"],
["Tusk Scorpion","巨牙天竭"],
["Tusk Seeker Drone","巨牙追踪者无人机"],
["Tusk Seeker","巨牙追踪者"],
["Tusk Shield Dargyn","巨牙护盾轻型艇"],
["Tusk Shield Lancer","巨牙盾枪兵"],
["Tusk Thumper Bull","巨牙重击者公牛"],
["Tusk Thumper Doma","巨牙重击者朵玛"],
["Tusk Thumper","巨牙重击者"],
["Tusk Trooper","巨牙骑兵"],
["Vapos Anti Moa","气雾逆进恐鸟"],
["Vapos Aquila","气雾天鹰"],
["Vapos Bioengineer","气雾生物工程师"],
["Vapos Crewman","气雾船员"],
["Vapos Detron Ranger","气雾德特昂突击队员"],
["Vapos Elite Crewman","气雾精英船员"],
["Vapos Elite Ranger","气雾精英突击队员"],
["Vapos Fusion Moa","气雾融合恐鸟"],
["Vapos Moa","气雾恐鸟"],
["Vapos Nullifier Ranger","气雾虚能突击队员"],
["Vapos Nullifier","气雾虚能船员"],
["Vapos Oxium Osprey","气雾奥席金属鱼鹰"],
["Vapos Detron Crewman","气雾德特昂船员"],
["Vapos Prod Crewman","气雾监工船员"],
["Vapos Railgun Moa","气雾磁轨炮恐鸟"],
["Vapos Sapping Osprey","气雾基蚀鱼鹰"],
["Vapos Shield Osprey","气雾护盾鱼鹰"],
["Vapos Shockwave Moa","气雾震荡恐鸟"],
["Vapos Sniper Crewman","气雾狙击手船员"],
["Vapos Sniper Ranger","气雾狙击手突击队员"],
["Vapos Tech Ranger","气雾技师突击队员"],
["Vapos Tech","气雾技师"],
["Vorac Basilisk","沃拉蛇妖战机"],
["Vorac Crewman","沃拉船员"],
["Vorac Crewship","沃拉战舰"],
["Vorac Detron Crewman","沃拉德特昂船员"],
["Vorac Disc Moa","沃拉圆盘恐鸟"],
["Vorac Elite Crewman","沃拉精英船员"],
["Vorac Engineer","沃拉工程师"],
["Vorac Gox","沃拉神锋战机"],
["Vorac Harpi","沃拉鹰掠战机"],
["Vorac Moa","沃拉恐鸟"],
["Vorac Nullifier Crewman","沃拉虚能船员"],
["Vorac Numon","沃拉撕裂者"],
["Vorac Pilot","沃拉飞行员"],
["Vorac Railgun Moa","沃拉磁轨炮恐鸟"],
["Vorac Ranger Crewman","沃拉突击船员"],
["Vorac Secura Osprey","沃拉保障鱼鹰"],
["Vorac Shield Osprey","沃拉护盾鱼鹰"],
["Vorac Shockwave Moa","沃拉震荡恐鸟"],
["Vorac Stropha Crewman","沃拉诡计之刃船员"],
["Vorac Tech","沃拉技工"],
["Vorac Vambac","沃拉威击者"],
["Vorac Weaver","沃拉旋织战机"],
["Vorac Zerca","沃拉狂暴者"],
["Optio","永冻副官"],
["Fusion Moa","熔岩恐鸟"],
["Minima Moa","微型恐鸟"],
["Moa","恐鸟"],
["Orphid Specter","兰花魅影"],
["Orokin Drone","Orokin无人机"],
["Orokin Spectator","Orokin观察使"],
["Ogma","欧格玛"],
["Garv","加弗"],
["General Sargas Ruk","Sargas Ruk将军"],
["Ghost Kuaka","幽灵库阿卡"],
["Gox","神锋战机"],
["Grineer Manic","狂躁Grineer"],
["Grineer Power Carrier","Grineer能量运送者"],
["Grineer Warden","Grineer典狱长"],
["Guardsman","禁卫军"],
["Gyrix","螺旋战机"],
["Heavy Gunner","重型机枪手"],
["Hemocyte","免疫血胞体"],
["Icemire Hyena","冰沼鬣狗"],
["Ionyx","离子战机"],
["Isolator Bursa","隔离金流恐鸟"],
["Jack O'Naut","杰克南瓜"],
["Jackal","豺狼"],
["Jordas Golem","Jordas魔像"],
["Juggernaut Behemoth","重装巨兽"],
["Juggernaut","巨兽"],
["Juvenile Membroid","幼年囊"],
["Karkina Antenna","卡其那触须"],
["Kavat","库娃"],
["Knave Specter","无赖魅影"],
["Kubrow","库狛"],
["Kyta Raknoid","凯塔蛛形机"],
["Lancer Dreg","无人机枪兵"],
["Lancer Survivor","枪兵幸存者"],
["Lancer","枪兵"],
["Latcher","粘子"],
["Latrox Une","拉托罗恩"],
["Leaper","奔跳者"],
["Leaping Thrasher","鞭击奔跳者"],
["Leech Osprey","吸血鱼鹰"],
["Lektro Commander","Lektro指挥官"],
["Lephantis","雷凡魔像"],
["Lobber Crawler","喷吐爬行者"],
["Locust Drone","蝗虫无人机"],
["Lt Lech Kril","Lech Kril中尉"],
["Lynx","山猫"],
["Machinist","机械师"],
["Torment","折磨"],
["Malice","怨恨"],
["Mania","躁狂"],
["Angst","焦虑"],
["Misery","苦难"],
["Violence","暴力"],
["Manic Bombard","狂躁轰击者"],
["Mature Membroid","成年囊"],
["Mimic","拟态者"],
["Mine Osprey","地雷鱼鹰"],
["Mite Raknoid","微螨蛛型机"],
["Napalm","火焰轰击者"],
["Nascent Membroid","初生囊"],
["Nauseous Crawler","呕心爬行者"],
["Nav Coordinate","遗迹船导航坐标"],
["Necramech","殁世机甲"],
["Nemes","自爆机"],
["Nox","毒化者"],
["Nul Comba","虚无驱逐员"],
["Nul Scrambus","虚无扰敌员"],
["Nullifier Crewman","虚能船员"],
["Ortholyst","直垂使"],
["Penta Ranger","潘塔突击队员"],
["Plains Commander","平野指挥官"],
["Plains Kuaka","平野库阿卡"],
["Polyp-Hog Juggernaut","寻息巨兽"],
["Powerfist","重击手"],
["Prod Crewman","监工船员"],
["Profit-Taker","利润收割者"],
["Pyr Captain","Pyr舰长"],
["Quanta Ranger","量子切割器突击队员"],
["Rabbleback Hyena","烈背鬣狗"],
["Railgun Moa","磁轨炮恐鸟"],
["Ranger","突击队员"],
["Ratel","蜜獾"],
["Rathuum Broadcaster","Rathuum直播者"],
["Recon Commander","侦查指挥官"],
["Regulator","调整者"],
["Reinforced Carrypod","加强型随身舱"],
["Remech Osprey","再启动鱼鹰"],
["Rogg-417","罗格-417"],
["Rogue Condroc","游荡秃鹰"],
["Roller Sentry","滚子哨兵"],
["Roller","滚子"],
["Sap Comba","衰竭驱逐员"],
["Sap Scrambus","衰竭扰敌员"],
["Sapping Osprey","基蚀鱼鹰"],
["Scavenger Drone","清道夫无人机"],
["Scorpion","天蝎"],
["Scyto Raknoid","赛托蛛形机"],
["Sensor Regulator","感应调整者"],
["Sentient Research Director","Sentient 研究主管"],
["Sikula","水雷无人机"],
["Slo Comba","滞缓驱逐员"],
["Slo Scrambus","滞缓扰敌员"],
["Sniper Crewman","狙击手船员"],
["Special Duty Coildrive","特殊型线圈滚轮"],
["Splendid Mergoo","璀璨秋沙鸟"],
["Splintrix","芒刺冲锋艇"],
["Sprag","斯普拉"],
["Summulyst","召唤使"],
["Swarm Mutalist Moa","异融胞群恐鸟"],
["Symbilyst","共生使"],
["Tar Mutalist Moa","异融焦油恐鸟"],
["Tarask Bursa","穷凶金流恐鸟"],
["Temporal Dreg","滞缓无人机"],
["Tenno Specter","Tenno魅影"],
["Test Moa","测试恐鸟"],
["The Sergeant","海军陆战队中士"],
["Thermic Raknoid","热力蛛型机"],
["Thrax Centurion","凶魂百夫长"],
["Thrax Legatus","凶魂副将"],
["Toxic Ancient","远古剧毒者"],
["Toxic Crawler","剧毒爬行者"],
["Trooper","骑兵"],
["Turret","炮塔"],
["Typholyst","巨锤使"],
["Tyro Battalyst","初级武装使"],
["Tyro Conculyst","初级震荡使"],
["Undying Flyer","不死飞行者"],
["Venin Mutalist","蛇毒异融体"],
["Ven'Kra Tel","文克拉·泰尔"],
["Verd-Ie","植被与环境监管无人机"],
["Vivisect Director","活体解剖主管"],
["Volatile Runner","爆炸奔跑者"],
["Vomvalyst","夜灵轰击使"],
["Woodland Mergoo","林地秋沙鸟"],
["Zanuka Hunter","Zanuka猎犬"],
["Zealoid Prelate","狂热主教"],
["Zealot Baptizer","狂热施洗者"],
["Zealot Herald","狂热传令者"],
["Zealot Proselytizer","狂热劝导者"],
["Zeplen","齐柏伦飞船"],
["Deimos Ancient Healer","惊惧远古治愈者"],
["Deimos Brood Mother","惊惧病变虫母"],
["Deimos Carnis Rex","惊惧肉碾王虫"],
["Deimos Carnis","惊惧肉碾虫"],
["Deimos Charger","惊惧疾冲者"],
["Deimos Claw Skin","德莫斯爪外观"],
["Deimos Genetrix","惊惧母艇"],
["Deimos Juggernaut","惊惧巨兽"],
["Deimos Jugulus Rex","惊惧喉骨刃王者"],
["Deimos Jugulus","惊惧喉骨刃者"],
["Deimos Leaper","惊惧奔跳者"],
["Deimos Leaping Thrasher","惊惧鞭击奔跳者"],
["Deimos Mutalist Osprey Carrier","惊惧异融运输者鱼鹰"],
["Deimos Runner","惊惧奔跑者"],
["Deimos Saxum Rex","惊惧重岩王者"],
["Deimos Saxum","惊惧重岩者"],
["Deimos Tendril Drone","惊惧卷须无人机"],
["Deimos Therid","惊惧古壳蛛"],
["Deimos Venin Mutalist","惊惧蛇毒异融体"],
["Kuva Ballista","赤毒弩炮"],
["Kuva Bombard","赤毒轰击者"],
["Kuva Butcher","赤毒屠夫"],
["Kuva Dargyn","赤毒轻型艇"],
["Kuva Drahk Master","赤毒爪喀驯兽师"],
["Kuva Drahk","赤毒爪喀"],
["Kuva Elite Lancer","赤毒精英枪兵"],
["Kuva Eviscerator","赤毒开膛者"],
["Kuva Flameblade","赤毒烈焰刀客"],
["Kuva Heavy Gunner","赤毒重型机枪手"],
["Kuva Hellion","赤毒恶徒"],
["Kuva Hellion Carrier","赤毒恶徒运输者"],
["Kuva Hyekka Master","赤毒鬣猫驯兽师"],
["Kuva Hyekka","赤毒鬣猫"],
["Kuva Jester","赤毒小丑"],
["Kuva Lancer","赤毒枪兵"],
["Kuva Larvling","赤毒幼体"],
["Kuva Napalm","赤毒火焰轰击者"],
["Kuva Powerclaw","赤毒猛力爪兵"],
["Kuva Roller","赤毒滚子"],
["Kuva Scorch","赤毒怒焚者"],
["Kuva Scorpion","赤毒天蝎"],
["Kuva Seeker","赤毒追踪者"],
["Kuva Shield Lancer","赤毒盾枪兵"],
["Kuva Trokarian","赤毒锐兵"],
["Kuva Trooper","赤毒骑兵"],
["Kuva Power Carrier","赤毒能量运送者"],
["Kuva Guardian","赤毒守卫者"],
["Ashen Kuaka","灰白库阿卡"],
["Juno Oxium Osprey","朱诺奥席金属鱼鹰"],
["Juno Disc Moa","朱诺圆盘恐鸟"],
["Breacher Moa","突破者恐鸟"],
["Striker Moa","前锋恐鸟"],
["Vorac Disc Moa","沃拉圆盘恐鸟"],
["Oxium Osprey","奥席金属鱼鹰"],
["Narmer Butcher","合一众屠夫"],
["Narmer Cache","合一众资源储藏容器"],
["Narmer Coildrive","合一众线圈滚轮"],
["Narmer Corpus Tech","合一众Corpus技师"],
["Narmer Crewman Warden","合一众船员典狱长"],
["Narmer Demolisher Bailiff","合一众爆破型执法员"],
["Narmer Demolisher Expired","合一众爆破型除役尸鬼"],
["Narmer Demolisher Gunner","合一众爆破型枪手"],
["Narmer Detron Ranger","合一众德特昂突击队员"],
["Narmer Elite Crewman","合一众精英船员"],
["Narmer Elite Lancer","合一众精英枪兵"],
["Narmer Elite Ranger","合一众精英突击队员"],
["Narmer Gunner Warden","合一众枪手典狱长"],
["Narmer Machinist","合一众机械师"],
["Narmer Nullifier Ranger","合一众虚能突击队员"],
["Narmer Observation Drone","合一众观测无人机"],
["Narmer Osprey","合一众鱼鹰"],
["Narmer Power Carrier","合一众能量运送者"],
["Narmer Regulator","合一众调整者"],
["Narmer Scavenger Drone","合一众清道夫无人机"],
["Narmer Scyto Raknoid","合一众赛托蛛形机"],
["Narmer Seeker","合一众追踪者"],
["Narmer Sensolyst Drone","合一众Sensolyst无人机"],
["Narmer Shockwave Moa","合一众震荡恐鸟"],
["Narmer Sniper Ranger","合一众狙击手突击队员"],
["Narmer Tech Ranger","合一众技师突击队员"],
["Narmer Thumper Bull","合一众重击者公牛"],
["Saturn Six Fugitive","土星六号逃犯"],
["Ravenous Void Angel","贪婪虚空天使"],
["Void Angel","虚空天使"],
["Void Shade","虚空之影"],
["Wolf Of Saturn Six","土星六号之狼"],
["Infested Mesa","异融Mesa"],
["Hyena Ln2","鬣狗液氮"],
["J3 Jordas Golem","Jordas魔像"],
["Corrupted Jackal","堕落豺狼"],
["Corrupted Power Carrier","堕落能量运送者"],
["Nightwatch Gunner","夜巡机枪兵"],
["Observation Drone","观测无人机"],
["Vallis Surveillance Drone","山谷监视无人机"],
["Trooper Survivor","骑兵"],
["Primm","Primm环管-独立机"],
["Sunkiller","弑日者"],
["Specter Particles","魅影颗粒"],
["Narmer Thumper","合一众重击者"],
["Anu Brachiolyst","安努狂战使"],
["Anu Symbilyst","安努共生使"],
["Terra Research Crewman","大地科研船员"],
["Deimos Swarm Mutalist Moa","惊惧异融胞群恐鸟"],
["Raptor Rx","猛禽RX(指数之场)"],
["002-Er","002-Er(指数之场)"],
["Dru Pesfor","Dru Pesfor(指数之场)"],
["Auditor","Auditor(指数之场)"],
["Jad Teran","Jad Teran(指数之场)"],
["Armis Ulta","Armis Ulta(指数之场)"],
["Jen Dro","Jen Dro(指数之场)"],
["Pelna Cade","Pelna Cade(指数之场)"],
["Azoth","Azoth(指数之场)"],
["M-W.A.M.","M-W.A.M.(指数之场)"],
["Nako Xol","Nako Xol(指数之场)"],
["Derim Zahn","Derim Zahn(指数之场)"],
["Lockjaw & Sol","Lockjaw & Sol(指数之场)"],
["Rana Del","Rana Del(指数之场)"],
["Tia Mayn","Tia Mayn(指数之场)"],
["Ved Xol","Ved Xol(指数之场)"],
["Glacik Commander","Glacik指挥官"],
["Derivator Crewman","引能船员"],
["Nightwatch Carrier","夜巡搬运者"],
["Carrier","搬运者"],
["Attack Mutalist","攻击型异融体"],
["Aurax Atloc Raknoid","傲金锁战蛛形机"],
["Erra","Erra(系列任务Boss)"],
["Exo Raider","邃域强袭者"],
["Gox Scavenger","神锋战机清道夫"],
["Hunhow","Hunhow(系列任务人物)"],
["Leekter","三霸Leekter"],
["Shik Tal","三霸Shik Tal"],
["Vem Tabook","三霸Vem Tabook"],
["Shadow Stalker","大黑Shadow Stalker"],
["Shield Drone","神盾无人机"],

//模式
["Apex Membroid (Level 0 - 50)","老年囊(等级 0 - 50)"],
["Apex Membroid (Level 51 - 75)","老年囊(等级 51 - 75)"],
["Apex Membroid (Level 76 - 100)","老年囊(等级 76 - 100)"],
["Juvenile Membroid (Level 0 - 50)","幼年囊(等级 0 - 50)"],
["Juvenile Membroid (Level 51 - 75)","幼年囊(等级 51 - 75)"],
["Juvenile Membroid (Level 76 - 100)","幼年囊(等级 76 - 100)"],
["Mature Membroid (Level 0 - 50)","成年囊(等级 0 - 50)"],
["Mature Membroid (Level 51 - 75)","成年囊(等级 51 - 75)"],
["Mature Membroid (Level 76 - 100)","成年囊(等级 76 - 100)"],
["Nascent Membroid (Level 0 - 50)","初生囊(等级 0 - 50)"],
["Nascent Membroid (Level 51 - 75)","初生囊(等级 51 - 75)"],
["Nascent Membroid (Level 76 - 100)","初生囊(等级 76 - 100)"],
["Forgotten Grineer Storage Container (Level 0 - 100)","遗落的Grineer储存容器(等级 0 - 100)"],
["Eidolon Gantulyst (Special)","夜灵巨力使(特殊)"],
["Eidolon Hydrolyst (Special)","夜灵水力使(特殊)"],
["Eidolon Teralyst (Special)","夜灵兆力使(特殊)"],
["Orokin Storage Container (Level 0 - 50)","Orokin存储容器(等级 0 - 50)"],
["Orokin Storage Container (Level 51 - 75)","Orokin存储容器(等级 51 - 75)"],
["Orokin Storage Container (Level 76 - 100)","Orokin存储容器(等级 76 - 100)"],
["Reinforced Orokin Storage Container (Level 0 - 50)","强化Orokin存储容器(等级 0 - 50)"],
["Reinforced Orokin Storage Container (Level 51 - 75)","强化Orokin存储容器(等级 51 - 75)"],
["Reinforced Orokin Storage Container (Level 76 - 100)","强化Orokin存储容器(等级 76 - 100)"],
["Rare Orokin Storage Container (Level 0 - 50)","稀有Orokin存储容器(等级 0 - 50)"],
["Rare Orokin Storage Container (Level 51 - 75)","稀有Orokin存储容器(等级 51 - 75)"],
["Rare Orokin Storage Container (Level 76 - 100)","稀有Orokin存储容器(等级 76 - 100)"],
["Kuva Lich Agor Rok","赤毒玄骸幼体"],
["Jordas Golem Assassinate","Jordas魔像刺杀"],
["Kuva Lich Agor Rok (Level 0 - 69)","赤毒玄骸幼体(等级 0 - 69)"],
["Kuva Lich Agor Rok (Level 70 - 79)","赤毒玄骸幼体(等级 70 - 79)"],
["Kuva Lich Agor Rok (Level 80 - 100)","赤毒玄骸幼体(等级 80 - 100)"],
["Angst (Level 0 - 100)","焦虑(等级 0 - 100)"],
["Malice (Level 0 - 100)","怨恨(等级 0 - 100)"],
["Mania (Level 0 - 100)","躁狂(等级 0 - 100)"],
["Misery (Level 0 - 100)","苦难(等级 0 - 100)"],
["Torment (Level 0 - 100)","折磨(等级 0 - 100)"],
["Violence (Level 0 - 100)","暴力(等级 0 - 100)"],
["Level 10 - 30 Cetus Bounty","等级 10 - 30 希图斯赏金"],
["Level 10 - 30 Orb Vallis Bounty","等级 10 - 30 奥布山谷赏金"],
["Level 100 - 100 Cambion Drift Bounty","等级 100 - 100 魔胎之境赏金"],
["Level 100 - 100 Cetus Bounty","等级 100 - 100 希图斯赏金"],
["Level 100 - 100 Orb Vallis Bounty","等级 100 - 100 奥布山谷赏金"],
["Level 110 - 115 Zariman Bounty","等级 110 - 115 扎里曼号 赏金"],
["Level 15 - 25 Cambion Drift Bounty","等级 15 - 25 魔胎之境赏金"],
["Level 15 - 25 Ghoul Bounty","等级 15 - 25 尸鬼赏金"],
["Level 15 - 25 Plague Star","等级 15 - 25 瘟疫之星"],
["Level 20 - 40 Cetus Bounty","等级 20 - 40 希图斯赏金"],
["Level 20 - 40 Orb Vallis Bounty","等级 20 - 40 奥布山谷赏金"],
["Level 25 - 30 Cambion Drift Bounty","等级 25 - 30 魔胎之境赏金"],
["Level 30 - 40 Arcana Isolation Vault","等级 30 - 40 奥秘隔离库"],
["Level 30 - 40 Cambion Drift Bounty","等级 30 - 40 魔胎之境赏金"],
["Level 30 - 40 Isolation Vault","等级 30 - 40 隔离库"],
["Level 30 - 50 Cetus Bounty","等级 30 - 50 希图斯赏金"],
["Level 30 - 50 Orb Vallis Bounty","等级 30 - 50 奥布山谷赏金"],
["Level 40 - 50 Arcana Isolation Vault","等级 40 - 50 奥秘隔离库"],
["Level 40 - 50 Ghoul Bounty","等级 40 - 50 尸鬼赏金"],
["Level 40 - 50 Isolation Vault","等级 40 - 50 隔离库"],
["Level 40 - 60 Cambion Drift Bounty","等级 40 - 60 魔胎之境赏金"],
["Level 40 - 60 Cetus Bounty","等级 40 - 60 希图斯赏金"],
["Level 40 - 60 Orb Vallis Bounty","等级 40 - 60 奥布山谷赏金"],
["Level 40 - 60 PROFIT-TAKER - PHASE 1","等级 40 - 60 利润收割者 - 阶段 1"],
["Level 40 - 60 PROFIT-TAKER - PHASE 2","等级 40 - 60 利润收割者 - 阶段 2"],
["Level 40 - 60 PROFIT-TAKER - PHASE 3","等级 40 - 60 利润收割者 - 阶段 3"],
["Level 5 - 15 Cambion Drift Bounty","等级 5 - 15 魔胎之境赏金"],
["Level 5 - 15 Cetus Bounty","等级 5 - 15 希图斯赏金"],
["Level 5 - 15 Orb Vallis Bounty","等级 5 - 15 奥布山谷赏金"],
["Level 50 - 55 Zariman Bounty","等级 50 - 55 扎里曼号 赏金"],
["Level 50 - 60 Arcana Isolation Vault","等级 50 - 60 奥秘隔离库"],
["Level 50 - 60 PROFIT-TAKER - PHASE 4","等级 50 - 60 利润收割者 - 阶段 4"],
["Level 50 - 60 Isolation Vault","等级 50 - 60 隔离库"],
["Level 50 - 70 Cetus Bounty","等级 50 - 70 希图斯赏金"],
["Level 50 - 70 Orb Vallis Bounty","等级 50 - 70 奥布山谷赏金"],
["Level 60 - 65 Zariman Bounty","等级 60 - 65 扎里曼号赏金"],
["Level 70 - 75 Zariman Bounty","等级 70 - 75 扎里曼号 赏金"],
["Level 90 - 95 Zariman Bounty","等级 90 - 95 扎里曼号 赏金"],
["Recall: Ten-Zero Week 1","追忆:10-0周1"],
["Recall: Ten-Zero Week 2","追忆:10-0周2"],
["Recall: Ten-Zero Week 3","追忆:10-0周3"],
["Recall: Ten-Zero Week 4","追忆:10-0周4"],
["Recall: Ten-Zero Week 5","追忆:10-0周5"],
["Necramech (Tier 1)","殁世机甲(阶段1)"],
["Necramech (Tier 2)","殁世机甲(阶段2)"],
["Necramech (Tier 3)","殁世机甲(阶段3)"],

["Eximus Enemy (Hard Mode)","卓越者敌人(困难模式)"],
["Sentient Eidolons (Hard Mode)","Sentient敌人(困难模式)"],
["Beyond Legendary (Under Review) (0.00%)","超越传奇(审查中) (0.00%)"],

["Final stage","最终阶段"],
["First Completion","首次完成"],
["Subsequent Completions","后续完成"],
["Recover The Orokin Archive","取回Orokin文件"],
["Void Fissure Corrupted Enemy","虚空裂缝堕落的敌人"],
["Ground Assault","地面进攻"],
["Acquire The Incubator Segment","获取孵化模块"],

["Another Betrayer","(未知)Another Betrayer"],
["Brachiolyst Disperser","(未知)Brachiolyst Disperser"],
["Family Reunion","(未知)Family Reunion"],
["Hot Mess","(未知)Hot Mess"],
["Nervo","(未知)Nervo"],
["Table For Two","(未知)Table For Two"],
["The Aftermath","(未知)The Aftermath"],
["Time's Up","(未知)Time's Up"],
//全局模式A

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
  return list
}

document.body.innerHTML = document.body.innerHTML

.replace(/January,/g, ', 一月,')
.replace(/February,/g, ', 二月,')
.replace(/March,/g, ', 三月,')
.replace(/April,/g, ', 四月,')
.replace(/May,/g, ', 五月,')
.replace(/June,/g, ', 六月,')
.replace(/July,/g, ', 七月,')
.replace(/August,/g, ', 八月,')
.replace(/September,/g, ', 九月,')
.replace(/October,/g, ', 十月,')
.replace(/November,/g, ', 十一月,')
.replace(/December,/g, ', 十二月,')

//项目表
.replace(/>Rotation A/g, ' style="background-color:#dcdade">轮次 A')
.replace(/>Rotation B/g, ' style="background-color:#bbb9bd">轮次 B')
.replace(/>Rotation C/g, ' style="background-color:#a4a2a6">轮次 C')

.replace(/Very Common/g, '<span style="color:#5cb85c">普通</span>')
.replace(/>Common/g, '><span style="color:#5cb8b0">常见</span>')
.replace(/Uncommon/g, '<span style="color:#f0ad4e;">罕见</span>')
.replace(/Ultra Rare/g, '<span style="color:#9575CD;">超稀有</span>')
.replace(/Rare/g, '<span style="color:#d9534f;">稀有</span>')
.replace(/Legendary/g, '<span style="background-color:#f0ad4e;color: #FFFFFF"">传说</span>')

.replace(/>Stage 1/g, ' style="background-color:#dcdade">阶段1')
.replace(/>Stage 2, Stage 3 of 4, and Stage 3 of 5/g, ' style="background-color:#dcdade">阶段2,阶段3-4,阶段3-5')
.replace(/>Stage 4 of 5/g, ' style="background-color:#dcdade">阶段4-5')
.replace(/>Final Stage/g, ' style="background-color:#dcdade">最终阶段')

//遗物
.replace(/Lith /g, '古纪 ')
.replace(/Meso /g, '前纪 ')
.replace(/Neo /g, '中纪 ')
.replace(/Axi /g, '后纪 ')
.replace(/Requiem/g, '安魂')
.replace(/Relics/g, '遗物')
.replace(/Relic/g, '遗物')
//.replace(/Intact/g, '<span style="background-color:#6456FA">完整</span>')
.replace(/Intact/g, '完整')
.replace(/Exceptional/g, '优良')
.replace(/Flawless/g, '无暇')
.replace(/Radiant/g, '光辉')

//材料
.replace(/ Endo/g, ' 内融核心')
.replace(/ Credits Cache/g, ' 现金')
.replace(/Credits/g, '现金')
.replace(/Argon Crystal/g, '氩结晶')
.replace(/Polymer Bundle/g, '聚合物束')
.replace(/Circuits/g, '电路')
.replace(/Alloy Plate/g, '合金板')
.replace(/Morphics/g, '非晶态合金')
.replace(/Gallium/g, '镓')
.replace(/Neurodes/g, '神经元')
.replace(/Rubedo/g, '红化结晶')
.replace(/Cubic Diodes/g, '立方二极管')
.replace(/Titanium/g, '钛')
.replace(/ Isos/g, ' 修复凝液')
.replace(/Asterite/g, '晶状彗星碎片')
.replace(/Aucrux Capacitors/g, '奥克斯电容器')
.replace(/Nullstones/g, '虚无碎片')
.replace(/Riven Sliver/g, '裂罅碎块')
.replace(/Carbides/g, '碳化物')
.replace(/Gallos Rods/g, '反物质燃料棒')
.replace(/Komms/g, '科姆斯通讯仪')
.replace(/Ferrite/g, '铁氧体')
.replace(/Detonite Ampule/g, '爆燃安瓿')
.replace(/Kubrow Egg/g, '库狛蛋')
.replace(/Hexenon/g, '六醇燃剂')
.replace(/Universal Medallion/g, '万用勋章')
.replace(/Plastids/g, '生物质')
.replace(/Orokin Cell/g, 'Orokin电池')
.replace(/Cryotic/g, '永冻晶矿')
.replace(/Nano Spores/g, '纳米孢子')
.replace(/Salvage/g, '回收金属')
.replace(/Control Module/g, '控制模块')
.replace(/Neural Sensors/g, '神经传感器')
.replace(/Nistlepod/g, '尼蒐荚')
.replace(/Pyrotic Alloy/g, '炎晶合金')
.replace(/Kuaka Spinal Claw/g, '库阿卡脊爪')
.replace(/Mawfish Bones/g, '喉鱼骨骼')
.replace(/Condroc Wing/g, '秃鹰翅膀')
.replace(/Khut-Khut Venom Sac/g, '库特-库特毒囊')
.replace(/Iradite/g, '伊莱体')
.replace(/Fish Scales/g, '鱼鳞')
.replace(/Grokdrul/g, '葛克度')
.replace(/Coprite Alloy/g, '亚铜合金')
.replace(/Maprico/g, '马利可')
.replace(/Fersteel Alloy/g, '钢化铁岩')
.replace(/Cetus Wisp/g, '希图斯幽魂')
.replace(/Breath Of The Eidolon/g, '夜灵之息')
.replace(/Tear Azurite/g, '泪滴形石青')
.replace(/Pyrotic Alloy/g, '炎晶合金')
.replace(/Esher Devar/g, '伊舍兄弟之石')
.replace(/Marquise Veridos/g, '女侯爵翠萤石')
.replace(/Yogwun Stomach/g, '约格温鱼胃')
.replace(/Charc Electroplax/g, '查克放电腺体')
.replace(/Goopolla Spleen/g, '古泊拉脾脏')
.replace(/Tralok Eyes/g, '塔洛鱼眼')
.replace(/Mortus Horn/g, '摩图斯角')
.replace(/Auroxium Alloy/g, '金辉合金')
.replace(/Oxium/g, '奥席金属')
.replace(/Mutagen Sample/g, '样本突变原')
.replace(/Somatic Fibers/g, '活体纤维')
.replace(/Thrax Plasm/g, '凶魂浆质')
.replace(/Mutalist Alad V Nav Coordinate/g, '异融 Alad V 导航坐标')
.replace(/Synthetic Eidolon Shard/g, '合成的夜灵碎片')
.replace(/Kuva/g, '赤毒')
.replace(/Rush Repair Drone/g, '加速修复无人机')
.replace(/Voidgel Orb/g, '虚空胶丸')
.replace(/Entrati Lanthorn/g, '英择谛灯笼')
.replace(/ Lens/g, '专精晶体')
.replace(/Exilus Weapon Adapter/g, '武器特殊功能槽连接器')
.replace(/Exilus Warframe Adapter/g, '特殊功能槽连接器')
.replace(/Ayatan Amber Star/g, '阿耶檀识琥珀星')
.replace(/Ayatan Cyan Star/g, '阿耶檀识青蓝星')
.replace(/Catalyst/g, '催化剂')
.replace(/Affinity Booster/g, '经验值加成')
.replace(/Credit Booster/g, '现金加成')
.replace(/Resource Booster/g, '资源数量加成')
.replace(/Resource Drop Chance Booster/g, '资源掉落几率加成')
.replace(/Mod Drop Chance Booster/g, 'Mod掉落几率加成')
.replace(/Narmer Isoplast/g, '合一众塑讯块')
.replace(/Journal Fragment/g, '日志碎片')
.replace(/Mytocardia Spore/g, '心肌菌孢子')
.replace(/Tepa Nodule/g, '缇帕瘤')
.replace(/Training Debt-Bond/g, '培训债务债券')
.replace(/Shelter Debt-Bond/g, '庇护债务债券')
.replace(/Medical Debt-Bond/g, '医疗债务债券')
.replace(/Advances Debt-Bond/g, '预支债务债券')
.replace(/Familial Debt-Bond/g, '家族债务债券')
.replace(/Thermal Sludge/g, '热能软泥')
.replace(/Gorgaricus Spore/g, '葛嘉里菌孢子')
.replace(/Fieldron/g, '电磁力场装置')
.replace(/Detonite Injector/g, '爆燃喷射器')
.replace(/Gyromag Systems/g, '陀螺磁抵系统')
.replace(/Atmo Systems/g, '大气系统')
.replace(/Repeller Systems/g, '斥极系统')
.replace(/Yao Shrub/g, '瑶丛')
.replace(/Connla Sprout/g, '慧泉嫩芽')
.replace(/Eevani/g, '延凡草')
.replace(/Dracroot/g, '龙旋根')
.replace(/Kovnik/g, '福烁草')
.replace(/Saggen Pearl/g, '慧珠')
.replace(/Aggristone/g, '龙涎石')
.replace(/Ueymag/g, '肉麦')
.replace(/Kullervo's Bane/g, 'Kullervo的灾刃')
.replace(/Vega Toroid/g, '维加环型装置')
.replace(/Sola Toroid/g, '索拉环型装置')
.replace(/Calda Toroid/g, '告达环型装置')
.replace(/Gravimag/g, '重力磁抵器')
.replace(/Ganglion/g, '神经节囊')
.replace(/Scintillant/g, '闪烁体')
.replace(/Pustulite/g, '脓刃爪疱')
.replace(/Lucent Teroglobe/g, '泰罗光球')
.replace(/Fass Residue/g, 'Fass残留物')
.replace(/Vome Residue/g, 'Vome残留物')
//.replace(/Damaged /g, '损坏的')
//.replace(/ Weapon /g, '武器')

.replace(/ Orientation Matrix/g, '定向矩阵装置')
.replace(/ Ballistics Matrix/g, '弹道矩阵装置')
.replace(/ Animus Matrix/g, '战意矩阵装置')

.replace(/Clem Clone/g, 'Clem克隆人')
.replace(/Archon Amar's Shard/g, '深红执刑官源力石')
.replace(/Archon Boreal's Shard/g, '蔚蓝执刑官源力石')
.replace(/Archon Nira's Shard/g, '琥珀执刑官源力石')

.replace(/Ayatan Anasa Sculpture/g, '阿耶檀识Anasa塑像')
.replace(/Ayatan Valana Sculpture/g, '阿耶檀识Valana塑像')
.replace(/Ayatan Sah Sculpture/g, '阿耶檀识Sah塑像')
.replace(/Ayatan Ayr Sculpture/g, '阿耶檀识Ayr塑像')
.replace(/Ayatan Vaya Sculpture/g, '阿耶檀识Vaya塑像')
.replace(/Ayatan Piv Sculpture/g, '阿耶檀识Piv塑像')
.replace(/Ayatan Orta Sculpture/g, '阿耶檀识Orta塑像')
.replace(/Seeding Step Ephemera/g, '种生步伐幻纹')
.replace(/Vitus Essence/g, '生息精华')
.replace(/Aura Forma/g, '光环Forma')
.replace(/Norg/g, '诺格')
.replace(/Boot/g, '靴子')
.replace(/ Sigil/g, ' 纹章')
.replace(/Kavat Genetic Code/g, '库娃遗传密码')
.replace(/Pherliac Pods/g, '费洛髂荚囊')
.replace(/Mutagen Mass/g, '突变原聚合物')
.replace(/Void Traces/g, '虚空光体')
.replace(/Steel Essence/g, '钢铁精华')

.replace(/Decoration/g, '装饰')
.replace(/Scene/g, '摄像棚')
.replace(/Corrupted Holokey/g, '堕落全息密钥')
.replace(/Shoulder Guard/g, '护肩')
.replace(/ Resource Bundle/g, '资源包')

.replace(/Void Storm/g, '虚空风暴')
.replace(/Void Armageddon/g, '虚空决战')
.replace(/Void Cascade/g, '虚空覆涌')
.replace(/Void Flood/g, '虚空洪流')
//星球
.replace(/Earth/g, '地球')
.replace(/Eris/g, '阋神星')
.replace(/Europa/g, '欧罗巴')
.replace(/Planet/g, '星球')
.replace(/Jupiter/g, '木星')
.replace(/Mars/g, '火星')
.replace(/Mercury/g, '水星')
.replace(/Neptune/g, '海王星')
.replace(/Orokin Derelict/g, '被遗弃的Orokin船只')
.replace(/Orokin Void/g, 'Orokin虚空')
.replace(/Phobos/g, '火卫一')
.replace(/Deimos/g, '火卫二')
.replace(/Planets/g, '星球')
.replace(/Pluto/g, '冥王星')
.replace(/Saturn/g, '土星')
.replace(/Sedna/g, '赛德娜')
.replace(/Uranus/g, '天王星')
.replace(/Venus/g, '金星')
.replace(/Void/g, '虚空')
.replace(/Lua/g, '月球')
.replace(/Ceres/g, '谷神星')
.replace(/Kuva Fortress/g, '赤毒要塞')
.replace(/Veil Proxima/g, '面纱')
.replace(/Veil/g, '面纱')
.replace(/Zariman/g, '扎里曼号')
.replace(/Duviri/g, '双衍王境')

//节点
.replace(/Oro Works/g, '奥金工场')
.replace(/Everview Arc/g, '永视弧域')
.replace(/Halako Perimeter/g,'哈拉科防线')
.replace(/Tuvul Commons/g,'涂沃主厅')
.replace(/The Greenway/g,'翠径')

//游戏模式
.replace(/Isolation Vault/g, '隔离库')
.replace(/Elite Sanctuary Onslaught/g, '精英圣殿突袭')
.replace(/Sanctuary Onslaught/g, '圣殿突袭')
.replace(/Sanctuary/g, '圣殿')
.replace(/Extra/g, '补充')
.replace(/Team Annihilation/g, '团队歼夺')
.replace(/Cephalon Capture/g, '夺取中枢')
.replace(/Variant/g, '变体')
.replace(/Mobile Defense/g, '移动防御')
.replace(/Survival/g, '生存')
.replace(/Defense/g, '防御')
.replace(/Rescue/g, '救援')
.replace(/Hive/g, '清巢')
.replace(/Annihilation/g, '歼夺')
.replace(/Pursuit/g, '追击')
.replace(/Assassination/g, '刺杀')
.replace(/Assassinate/g, '刺杀')
.replace(/Capture/g, '捕获')
.replace(/Caches/g, '资源储藏舱')
.replace(/Excavation/g, '挖掘')
.replace(/Exterminate/g, '歼灭')
.replace(/Hijack/g, '劫持')
.replace(/Interception/g, '拦截')
.replace(/Sabotage/g, '破坏')
.replace(/Disruption/g, '中断')
.replace(/Spy/g, '间谍')
.replace(/Skirmish/g, '前哨战')
.replace(/Conclave/g, '武形秘仪')
.replace(/Defection/g, '叛逃')
.replace(/Arena/g, '竞技场')

.replace(/Return/g, '返还现金')
.replace(/The Index/g, '指数之场')
.replace(/Low Risk/g, '低风险')
.replace(/Medium Risk/g, '中等风险')
.replace(/High Risk/g, '高风险')
.replace(/Event:/g, '活动:')
.replace(/Normal/g, '普通')
.replace(/Hard/g, '困难')

.replace(/Tier /g, '阶段')
.replace(/Endless:/g, '无尽:')
.replace(/Repeated Rewards/g, '重复奖励')
.replace(/ Front /g, '前线')

.replace(/Additional Item Drop Chance/g, '杂物掉率')
.replace(/Item Drop Chance/g, ' 物品掉率')
.replace(/Item Drops by Source/g, ' 物品按来源分类')
.replace(/Item Drops by Blueprint/g, ' 物品按蓝图分类')
.replace(/Mod Drop Chance/g, 'Mod掉率')
.replace(/Resource Drop Chance/g, '资源掉率')
.replace(/Sigil Drop Chance/g, '纹章掉率')
.replace(/ Drop Chance/g, '掉率')
.replace(/ Drops by Source/g, '按来源分类')




//战甲外号
// .replace(/Ash/g, '阿屎')
// .replace(/Atlas/g, '土甲')
// .replace(/Banshee/g, '音妈')
// .replace(/Baruuk/g, '拳师')
// .replace(/Chroma/g, '龙甲')
// .replace(/Ember/g, '火鸡')
// .replace(/Equinox/g, '扶她')
// .replace(/Excalibur/g, '咖喱')
// .replace(/Frost/g, '冰男')
// .replace(/Gara/g, '玻璃')
// .replace(/Garuda/g, '血妈')
// .replace(/Harrow/g, '主教')
// .replace(/Hildryn/g, '母牛')
// .replace(/Hydroid/g, '水男')
// .replace(/Inaros/g, '沙甲')
// .replace(/Ivara/g, '弓妹')
// .replace(/Khora/g, '猫甲')
// .replace(/Limbo/g, '小明')
// .replace(/Loki/g, '洛基')
// .replace(/Mag /g, '磁妹 ')
// .replace(/Mesa/g, '女枪')
// .replace(/Mirage/g, '小丑')
// .replace(/Nekros/g, '摸尸')
// .replace(/Nezha/g, '哪吒')
// .replace(/Nidus/g, '蛆甲')
// .replace(/Nova/g, '诺娃')
// .replace(/Nyx/g, '脑溢血')
// .replace(/Oberon/g, '奶爸')
// .replace(/Octavia/g, '音乐甲')
// .replace(/Revenant/g, '夜灵甲')
// .replace(/Rhino/g, '牛甲')
// .replace(/Saryn/g, '毒妈')
// .replace(/Titania/g, '蝶妹')
// .replace(/Trinity/g, '奶妈')
// .replace(/Valkyr/g, '瓦喵')
// .replace(/Vauban/g, '工程甲')
// .replace(/Volt/g, '电男')
// .replace(/Wukong/g, '猴子')
// .replace(/Zephyr/g, '鸟姐')
// .replace(/Odonata/g, '翅膀')

// .replace(/Naramon/g, '①')
// .replace(/Vazarin/g, '②')
// .replace(/Madurai/g, '③')
// .replace(/Unairu/g, '④')
// .replace(/Zenurik/g, '⑤')

.replace(/Forma/g, '<span style="background-color:#f0ad4e;color: #FFFFFF"">Forma</span>')
.replace(/Reactor/g, '反应堆')
.replace(/Plating/g, '装甲')
.replace(/Engines/g, '引擎')
.replace(/Shield Array/g,'护盾阵列')
.replace(/Photor/g, '光子聚熔炮')
.replace(/Apoc/g, '天启炮台')
.replace(/Cryophon/g, '急冻粒子炮')
.replace(/Carcinnox/g, '毒液穿甲炮')
.replace(/Pulsar/g, '脉冲星')
.replace(/Vort/g, '威电炮台')
.replace(/Glazio/g, '冰导炮台')
.replace(/Talyn/g, '锐透穿甲炮')
.replace(/Laith/g, '裂撕削甲炮')
//武器
.replace(/Burston/g, '伯斯顿')
.replace(/Hind/g, '雌鹿')
.replace(/Latron/g, '拉特昂')
.replace(/Karak/g, '卡拉克')
.replace(/Boar/g, '野猪')
.replace(/Boltor/g, '螺钉步枪')
.replace(/Vectis/g, '守望者')
.replace(/Bronco/g, '野马')
.replace(/Furis/g, '盗贼')
.replace(/Kraken/g, '北海巨妖')
.replace(/Akbronco/g, '野马双枪')
.replace(/Ballistica/g, '布里斯提卡')
.replace(/Gammacor/g, '咖玛腕甲枪')
.replace(/Hikou/g, '飞扬')
.replace(/Kunai/g, '苦无')
.replace(/Sonicor/g, '超音波冲击枪')
.replace(/Stug/g, '史特克')
.replace(/Cronus/g, '克洛诺斯')
.replace(/Dual Skana/g, '空刃双刀')
.replace(/Fang/g, '狼牙')
.replace(/Kestrel/g, '红隼')
.replace(/Magistar/g, '执法者')
.replace(/Ankyros/g, '甲龙双拳')
.replace(/Dual Zoren/g, '佐伦双斧')
.replace(/Fragor/g, '重击巨锤')
.replace(/Gram/g, '格拉姆')
.replace(/Kogake/g, '科加基')
.replace(/Orthos/g, '欧特鲁斯')
.replace(/Scindo/g, '分裂斩斧')
.replace(/Athodai/g, '阿索代')
.replace(/Ambassador/g, '使节')
.replace(/Phaedra/g, '菲德菈')
.replace(/Acceltra/g, '迅发电浆炮')
.replace(/Aeolak/g, '风鸣')
.replace(/Afuris/g, '盗贼双枪')
.replace(/Akarius/g, '阿利乌双枪')
.replace(/Akbolto/g, '螺钉双枪')
.replace(/Akjagara/g, '觉醒双枪')
.replace(/Aklex/g, '雷克斯双枪')
.replace(/Aksomati/g, '轻灵月神双枪')
.replace(/Akstiletto/g, '史提托双枪')
.replace(/Akvasto/g, '瓦斯托双枪')
.replace(/Alternox/g, '电幻步枪')
.replace(/Arum Spinosa/g, '疆南星刺')
.replace(/Astilla /g, '碎裂者 ')
.replace(/Baza /g, '苍鹰 ')
.replace(/Bo /g, '玻之武杖 ')
.replace(/Brakk/g, '布拉克')
.replace(/Braton Vandal/g, '布莱顿破坏者')
.replace(/Braton/g, '布莱顿')
.replace(/Broken War/g, '破碎的战争之剑')
.replace(/Carmine Penta/g, '嫣红潘塔')
.replace(/Carrier /g, '搬运者 ')
.replace(/Cedo/g, '塞多')
.replace(/Cernos/g, '西诺斯')
.replace(/Corinth/g, '科林斯')
.replace(/Corufell/g, '闪劫')
.replace(/Corvas/g, '黑鸦')
.replace(/Dakra/g, '达克拉')
.replace(/Destreza/g, '技巧之剑')
.replace(/Dethcube/g, '死亡魔方')
.replace(/Detron/g, '德特昂')
.replace(/Dual Kamas/g, '双短柄战镰')
.replace(/Dual Keres/g, '凯瑞斯双刀')
.replace(/Wolf Sledge/g, '恶狼战锤')
.replace(/Blazing Step Ephemera/g, '炽烈步伐幻纹')
.replace(/Parallax/g, '星察')
.replace(/Wyrm/g, '蛟龙')
.replace(/Xoris/g, '驱魔之刃')
.replace(/Zakti/g, '毒芽')
.replace(/War /g, '战争之剑 ')
.replace(/Zhuge/g, '诸葛连弩')
.replace(/Volnus/g, '创伤')
.replace(/Korumm/g, '雷霆暴君')
.replace(/Verdilac/g, '蝰首骨妖')
.replace(/Nepheri/g, '赤炎流星')
.replace(/Sarofang/g, '沙罗之牙')
.replace(/Perigale/g, '月面狂风')
.replace(/Knell/g, '丧钟')
.replace(/Scourge/g, '祸根')
.replace(/Karyst/g, '凯洛斯特')
.replace(/Kavasa/g, '喀婆萨')
.replace(/Kogake/g, '科加基')
.replace(/Kronen/g, '皇家拐刃')
.replace(/Vasto/g, '瓦斯托')
.replace(/Venka/g, '凯旋之爪')
.replace(/Velox/g, '逐电')
.replace(/Tigris/g, '猛虎')
.replace(/Tipedo/g, '提佩多')
.replace(/Tiberon/g, '狂鲨')
.replace(/Tenora/g, '双簧管')
.replace(/Strun/g, '斯特朗')
.replace(/Tatsu/g, '龙辰')
.replace(/Tekko/g, '铁钩手甲')
.replace(/Sybaris/g, '席芭莉丝')
.replace(/Stubba/g, '史度巴')
.replace(/Quartakk/g, '夸塔克')
.replace(/Pyrana/g, '食人鱼')
.replace(/Phantasma/g, '幻离子')
.replace(/Phaedra/g, '菲德菈')
.replace(/Pangolin Prime/g, '鲮鲤剑Prime')
.replace(/Pangolin Sword/g, '鲮鲤剑')
.replace(/Panthera/g, '猎豹')
.replace(/Paris/g, '帕里斯')
.replace(/Pandero/g, '手鼓')
.replace(/Pathocyst/g, '病囊飞刃')
.replace(/Orvius/g, '灵枢')
.replace(/Quassus/g, '威震武扇')
.replace(/Quellor/g, '压制者')
.replace(/Pennant/g, '尖幡')
.replace(/Reaper /g, '收割者 ')
.replace(/Redeemer /g, '救赎者 ')
.replace(/Rubico /g, '绝路 ')
.replace(/Seer /g, '预言者 ')
.replace(/Shade /g, '阴影 ')
.replace(/Shedu/g, '舍杜')
.replace(/Sicarus /g, '暗杀者 ')

.replace(/Soma /g, '月神 ')
.replace(/Spectra Vandal/g, '光谱切割器破坏者')
.replace(/Sporothrix/g, '孢丝感染枪')
.replace(/Stahlta/g, '钢刃步枪')
.replace(/Stropha/g, '诡计之刃')
.replace(/Nautilus/g, '鹦鹉螺')
.replace(/Ignis Wraith/g, '伊格尼斯亡魂')
.replace(/Nami Skyla/g, '海波斯库拉对剑')
.replace(/Ninkondi/g, '降灵追猎者')
.replace(/Nikana /g, '侍刃 ')
.replace(/Spira /g, '旋刃飞刀 ')
.replace(/Steflos/g, '石晶之花')
.replace(/Stradavar/g, '斯特拉迪瓦')
.replace(/Nagantaka /g, '噬蛇弩 ')
.replace(/Miter/g, '米特尔')
.replace(/Magnus /g, '麦格努斯 ')
.replace(/Greater /g, '高级')
.replace(/Larkspur /g, '翠雀 ')
.replace(/Lato Vandal/g, '拉托破坏者')
.replace(/Euphona /g, '悦音 ')
.replace(/Epitaph/g, '葬铭')
.replace(/Fulmin /g, '雷霆 ')
.replace(/Galatine /g, '迦伦提恩 ')
.replace(/Glaive /g, '战刃 ')
.replace(/Gorgon/g, '蛇发女妖')
.replace(/Guandao /g, '关刀 ')
.replace(/Gunsen /g, '军扇 ')
.replace(/Helios /g, '赫利俄斯 ')
.replace(/Hespar/g, '暮斩')
.replace(/Imperator Vandal/g, '凯旋将军破坏者')
.replace(/Hystrix /g, '豪猪 ')
.replace(/Lex /g, '雷克斯 ')
.replace(/Korrudo /g, '库鲁多 ')
.replace(/Lavos Cordatus Helmet /g, 'Lavos明智头盔')
.replace(/Kavat Incubator Upgrade Segment /g, '库娃孵化器升级模块')

.replace(/ Wraith/g, '亡魂')

.replace(/Balla/g, '宝拉')
.replace(/Dehtat/g, '德塔特')
.replace(/Mewan/g, '密丸')
.replace(/Ooltha/g, '乌尔萨')
.replace(/Kronsh/g, '客隆什')
.replace(/Jayap/g, '查亚普')
.replace(/Kroostra/g, '克鲁斯查')
.replace(/Laka/g, '拉卡')
.replace(/Seekalla/g, '斯卡拉')
.replace(/Kwath/g, '库阿斯')
.replace(/Peye/g, '佩耶')
.replace(/Vargeet/g, '瓦吉特')
.replace(/Ekwana/g, '伊克瓦纳')
.replace(/Ii Ruhang/g, 'II 如杭')
.replace(/Ruhang Ii/g, '如杭 II')
.replace(/Ruhang/g, '如杭')
.replace(/Ii Jai/g, 'II 翟')
.replace(/Jai Ii/g, '翟 II')
.replace(/Jai/g, '翟')

.replace(/ Handle/g, ' 握柄')
.replace(/ Hilt/g, ' 握柄')
.replace(/ Pouch/g, ' 镖袋')
.replace(/ Stars/g, ' 星镖')
.replace(/ Ornament/g, ' 饰物')
.replace(/ Blades/g, ' 刀刃')
.replace(/ Blade/g, ' 刀刃')
.replace(/ Head/g, ' 锤头')
.replace(/ Disc/g, ' 圆盘')
.replace(/ Gauntlet/g, ' 拳套')
.replace(/ Guard/g, ' 护手')
.replace(/ Upper Limb/g, ' 上弓臂')
.replace(/ Lower Limb/g, ' 下弓臂')
.replace(/ Grip/g, ' 弓身')
.replace(/ String/g, ' 弓弦')
.replace(/ Chain/g, ' 链条')
.replace(/ Band/g, ' 项圈带')
.replace(/ Buckle/g, ' 项圈扣')
.replace(/ Kubrow Collar /g, ' 项圈')
.replace(/Prime Link/g, 'Prime 连接器')
.replace(/Prime Boot/g, 'Prime 靴子')
.replace(/ Core/g, ' 核心')
.replace(/ Rivet/g, ' 铆钉')
.replace(/ Systems Blueprint/g, ' 系统蓝图')
.replace(/ Chassis Blueprint/g, ' 机体蓝图')
.replace(/ Neuroptics Blueprint/g, ' 头部神经光元蓝图')
.replace(/ Harness/g, ' 外甲')
.replace(/ Wings/g, ' 机翼')
.replace(/ Cerebrum/g, ' 头部')
.replace(/ Carapace/g, ' 外壳')
.replace(/ Chassis/g, ' 机体')
.replace(/ Systems/g, ' 系统')
.replace(/ Neuroptics/g, ' 头部神经光元')
.replace(/ Fuselage/g, ' 机身')
.replace(/ Avionics /g, ' 飞航系统 ')
.replace(/ Blueprint/g, ' 蓝图')
.replace(/ Barrel/g, ' 枪管')
.replace(/ Receiver/g, ' 枪机')
.replace(/ Stock/g, ' 枪托')
.replace(/ Motor/g, ' 马达')
.replace(/ Blades/g, ' 爪刃')
//错误补充
.replace(/Aya/g, '阿耶精华')
.replace(/ Day /g, '天')
.replace(/Blueprint/g, ' 蓝图')
.replace(/Level /g, ' 等级 ')
.replace(/ Iii /g, ' III ')
.replace(/ Ii /g, ' II ')
.replace(/ Iv /g, ' IV ')
.replace("古纪 (","Lith (")
.replace("战争之剑 (", "War  (")
//部分已汉化节点
.replace(/Sover Strait/g, '深眠峡道')
.replace(/Iota Temple/g, '虚无神殿')
.replace(/Ogal Cluster/g, '奥加尔星团')
.replace(/Korm's Belt/g, '克姆地带')
.replace(/Bendar Cluster/g, '本达尔星团')
.replace(/Bifrost Echo/g, '虹桥回声')
.replace(/Beacon Shield Ring/g, '卫标星环')
.replace(/Orvin-Haarc/g, '欧文－哈克')
.replace(/Vesper Strait/g, '维斯珀峡道')
.replace(/Luckless Expanse/g, '无垠华盖')
.replace(/Falling Glory/g, '落没之耀')
.replace(/Mordo Cluster/g, '魔多星团')
.replace(/Kasio's Rest/g, '卡希欧安息处')
.replace(/Nodo Gap/g, '诺朵星峡')
.replace(/Lupal Pass/g, '卢帕星道')
.replace(/Vand Cluster/g, '水域星团')
.replace(/Arva Vector/g, '时空坐标')
.replace(/Nu-gua Mines/g, '女娲之矿')
.replace(/Enkidu Ice Drifts/g, '初裔冰渍区')
.replace(/Mammon's Prospect/g, '诱惑之景')
.replace(/Sovereign Grasp/g, '星主之握')
.replace(/Brom Cluster/g, '薄暮星团')
.replace(/Khufu Envoy/g, '胡夫之遣')
.replace(/Seven Sirens/g, '七魅之息')
.replace(/Obol Crossing/g, '冥渡')
.replace(/Fenton's Field/g, '芬顿之地')
.replace(/Profit Margin/g, '利益外缘')
.replace(/Peregrine Axis/g, '外域星轴')
.replace(/Flexa/g, '弗雷沙')
.replace(/H-2 Cloud/g, 'H-2 星云')
.replace(/R-9 Cloud/g, 'R-9 星云')
.replace(/Nsu Grid/g, '恩斯尤区格')
.replace(/Calabash/g, '蒲芦')
.replace(/Numina/g, '努秘')
.replace(/Arc Silver/g, '曲银之地')
.replace(/Erato/g, '深情之域')
.replace(/Lu-yan/g, '鹿岩')
.replace(/Sabmir Cloud/g, '萨米尔星云')
