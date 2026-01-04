// ==UserScript==
// @name            Florr.io 汉化
// @namespace       A florr.io userjs
// @description     全面汉化 Florr.io
// @version         1.1.2
// @author          -lexiyvv, flo修仙传, Tinhone, squid233, Lucker
// @license         GPL-3.0
// @match           *://florr.io/*
// @grant           GM_setValue
// @grant           GM_getValue
// @compatible      firefox V50+
// @compatible      edge V50+
// @compatible      chrome V50+
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB2lBMVEUAAADTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbSvEbTvUbSvUbTvUbSvEbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbSvEbTvUbSvEbUvkfWwEjYwUnVv0fex03p0lXy21r331754V/y2lrp0lTdx03UvkbgyU/y21v95WL/6GP/52P95WHgyU7XwUns1Vfs1VbXwUjZwkrYwkn03mLm0mH85WLm0mL03mHfyU7742HYzZHU0cLhz2z/6GLj0m7W08TUyY3742DVvkfp1WHe28r8/f/Yz5f85GD85F/Rx4/8/P/j4NDu2WX85WHTvUb/6mTNu1erqqX7/P7c1rT332D13l6Ykm/n6Oru7ejl02/o0lTSvEbAr1A0MzBoaGp+eFvz3F/03WBUTzJPT1FvbmvHtlfx2lrOu1UsKyQaGx1eWDL54mFgWTQbHB4qKCLNu1T2313q1V1GQy0bHCCMgUH/6WSjlUhcVjPbx1j75WL03mDo0VT+6WT65GL+5mPdxk21pEaqmkL03V/75GLCsEuQgjj34GDjzliEeDNuYyuGeTSLfjZ2ay5zaC3Pu1D/6GT85mPgy1fDsUy+rErSvlL34WDr1Fb////IkFdGAAAAH3RSTlMAAAEHDAo0api0wQ9buO7+/j35BmjnefVpPua37Zf+dLW/BwAAAAFiS0dEnQa78rEAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfkAQgDJRPX3t0LAAACLUlEQVQ4y4VTB3cSQRC+pYYWDSkkgeQOkuMOCLdrLmAUxULU2Mt59t4LllhIuVQ1lth7y491mV1CAH3Oe/fm7cx3U78RhFWCbHaHw25Dwt8EIafL3eTxej1NbpcToQa3zx9oXiNK0agkrm0O+H21EGRrCQRjff1yXFHiaiIZCwZaVmdCrW3tqYG0hjGhgvE6eTDV3taKqv6OkD6kgZcJ1jLZUEcFgVBnaH2a1Ik8HOpkdSDU1a2ncT0Ay9nuLkAgXzg1xGwcxXUmFfahcgB/cEAD+4aNubLObdoMiFw+6KchkDMcYwm2bN22vUBIYWTHzl3wgzoadlKAK9LHAuzes3fffkIOHDx0+Aj8YSQjLgpwH+2Hp3ns+ImTpwg5febsufMFqOLCRTcF9IgyA1y6fOXqNYyv37h567YJMYtiDxLsHikOcPPO3Xv3xwgZe/Dw0WMGKEkeu+DwRhXW3PjE5JRFiDU1OTHOGlV0r6MKIGR6ZrYMmJ2Z5gYArKQgZG6e6fk5PjBIQYtUK3PGNYoXSdtMNCyCywK06YokDW7QnpSh1tNn7GkswqDoqNkgiPX8xUvLfLX0+k0lA4yaLmtQY5a3795/+Pjp8xcegC0L1p1hpq/fvv/4+eu3xV7LbN1AmCxPQizT5G6iSpwwQLlhub4DdYVyjLTZTA1pjWWpSlpO+7xqANnoZxTzNbTnhzOaTBRLilIqLiyKdYdTOb1eUdJ1SextPL3/H++/z/8P7nmbVKvpGgUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMTItMzFUMjA6MDg6NTMtMDg6MDCgb7H/AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTAxLTA4VDExOjM3OjE5LTA4OjAwqEgKbQAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/462298/Florrio%20%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/462298/Florrio%20%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (typeof (GM_getValue("customFont")) == "undefined") { //可在 储存 选项卡中更改字体与字重
        const defaultCustomFont = {
            fontFamily: 'Microsoft YaHei',
            fontWeight: '',
            fontSizeMin: 14
        }
        GM_setValue("customFont", defaultCustomFont)
    }
    const customFont = GM_getValue("customFont")
    if (typeof (GM_getValue("openCustomReloadAnimation")) == "undefined") { //可在 储存 选项卡中更改是否打开自定义再装填动画
        GM_setValue("openCustomReloadAnimation", true)
    }
    const openCustomReloadAnimation = GM_getValue("openCustomReloadAnimation")

    const size1 = 80;
    const size2 = 80;
    const size3 = (size2 - 30) / 2;
    const size4 = -(size2 - 30) / 2;
    const size1db2 = size1 / 2;
    const size2db2 = size2 / 2;
    const reloadMainImg = document.createElement('img');
    reloadMainImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAB8CAMAAAB+HD/1AAAAAXNSR0IArs4c6QAAAqZQTFRFAAAA///////////////M//8z//+2//////85/////+tO//////+q///f//AP//KG//////+////c//OX//////WF/+sU//+q/+5d///3//Bi//iV/+s8//Jz///g/+EA/+6A/+MG//q4/+9H/+QL/////+UQ/+AA//Bm//WH/+cd//GA/+gp//a3/+k1/+5o/+Y2//OA//MM///v/+tL//Bb//CD//QZ/+MA//////+Q/+9s//////af/+YP//CA//Sf//////GK/P8I/+pE/+IA//KG//rZ//Bv/+YK///9//WT/+QR/f8C//GB//jC//aa/+pE/+9s/+Yg//ad//SN/f8U/+1h/+UL//J7//Sk/+gx///s//////eN//B4/+5f/+9t//Wn/+QG/f8Q/+s9//e7//eW/+QZ//B5//iw/+EH/+kz//vW//F9/+UJ/+9F/+kr/P8A/+1K/+s///KL/+MD/+o7/+UV/+s0/+5k/+MA//ST/+k3/f8A/+ci//Nh/+kw/+o2/+gn/+ow/+1c/+o6/+QE/P9w/+YW/+tL/+ck/+o//+Ya/+QA//ul//GE/+ky/+cj/v9B/+QF/v8J/+xI/+ch/+s//+tH/+QE/+k0/+cg/+QA/+US/+xK/v9T/+YW/+QG/+YW+/8A/+ku/+ce//B1/+QG/+YW/f8E/+xT/+s+/+UP/+QA/+cf/+QG/+k1/+cV/+MF/+pA/+gs/+UK//Wj/+ci/+YW/+o2/+UP/+ku/+cU/+UE/f8E/+gr/+cj/+ch/+YW/+k2/+Yb/+YW/+MF//ho/f8A/+kv/+cf/+cm/+UT/+QG/v8C/+QE/+gk/+QI/+QA/+MD/f8A/+o9/+QC/+YW/+QC/+QF/+QA/+MB/f8A/vcA/vIA/+gA/+MAXQgXyQAAAN10Uk5TAAECBAUFBwgJCw0ODxARExQUFhYXGRkeHiAiJCYoKSssLi8vMDExMTIzNTg4OTo7PT4+P0FDRkhISUxOUFJTVlpcXmBhYmNlZWVmaGlqa21tbW9wcnJ0dHR2eHh5e3t7e3x9fYGBg4WGh4qKi46PkZOVlpibnJyfn6KjpKamp6erq66xs7W1tba2t7i6urq7u7u8vb2+v7/Bw8PG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';
    const reloadProcessBarImg = document.createElement("img");
    reloadProcessBarImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAABlJREFUKFNj/Puf4T8DEYBxVCG+UKJ+8AAABz4d2ZbeQwkAAAAASUVORK5CYII=';

    let timestampForDebug = performance.timeOrigin + performance.now();

    const translate = {
        //特殊判定
        'vvyixel': 'lexiyvv',
        'floxxz': 'flo修仙传',





        //用户界面-开始
        'florr.io': 'florr.io',
        'Ready': '开始',
        'Connecting...': '正在连接...',
        'Logging in...': '正在登录...',
        'Loading...': '加载中...',
        'Account': '账号',
        'Changelog': '更新日志',
        'Join our Discord community!': '加入我们的Discord社区!',
        '加入我们的QQ群!': '加入我们的QQ群!',





        //用户界面-设置
        'Settings': '设置',
        'Keyboard movement': '使用键盘操作',
        'Movement helper': '移动辅助箭头',
        'Show damage numbers': '显示伤害数值',
        'Chat': '聊天',
        'Hide common drops': '隐藏常见掉落',
        'Hide unusual drops': '隐藏少见掉落',
        'Screen shake': '画面抖动',

        'Credits': '荣誉墙',
        'Special Thanks': '特别鸣谢',
        'Made by Matheus Valadares': '制作: Matheus Valadares',
        'Some icons by Lorc & Skoll from game-': '部分图标: Lorc & Skoll 来自',
        'icons.net': 'game-icons.net',
        'Some icons from twemoji.twitter.com': '部分图标: twemoji.twitter.com',
        'Some tiles by kenney.nl': '部分纹理贴图: kenney.nl',

        'Privacy Policy': '隐私策略',

        'Terms of Service': '服务条款',





        //用户界面-商店
        'Shop': '商店',
        'Today\'s offers:': '今日售卖',
        'You gain stars as you watch ads, or you can': '您可以在看广告时获得星星，',
        'You gain stars as you watch ads as soon as you': '只要您获得第一个传奇花瓣，',
        'collect your first legendary petal, or you can': '您就可以在看广告时获得星星；',
        'buy some by clicking the number on the right.': '也可以点击右边的数字购买一些。',
        'I have too much money': '我有超级多的钱',
        'In case of any issues with your purchase,': '如果您的购买过程出现任何问题，',
        'please contact support@m28.io': '请联系 support@m28.io',

        'hour': '小时',
        'hours': '小时',
        'minute': '分钟',
        'minutes': '分钟',
        'second': '秒',
        'seconds': '秒',





        //用户界面-退出游戏
        'Abandon game': '退出游戏',
        'You were destroyed by:': '您被这个生物打败了',
        'A mysterious entity': '未知生物',
        'Continue': '继续',
        'GAME OVER': '游戏结束',





        //用户界面-消息栏
        'Press [ENTER] or click here to chat': '按 [ENTER] 键或点击这里聊天',
        'No one is around to hear you.': '抱歉，附近没有玩家能听到您说话',
        'You\'re doing that too much.': '您发消息的速度过于快了',





        //用户界面-挂机检查
        'AFK Check': '挂机检查',
        'Are you here?': '您还在这里吗？',
        'I\'m here': '我在',





        //用户界面-地图名称
        'Centralia': '中心之地',
        'Centralia Fields 1': '后花园 1 (石头)',
        'Centralia Fields 2': '后花园 2',
        'Centralia Fields 3': '后花园 3 (瓢虫)',
        'Centralia Fields 4': '后花园 4',
        'Centralia Fields 5': '后花园 5 (蜈蚣)',
        'Centralia Fields 6': '后花园 6 (黄蜂)',
        'Centralia Fields 7': '后花园 7 (蒲公英)',
        'Centralia Maze': '后花园迷宫',

        'Centralia Sewers 1': '后花园下水道 1 (飞蛾)',
        'Centralia Sewers 2': '后花园下水道 2 (蟑螂)',
        'Centralia Sewers 3': '后花园下水道 3 (苍蝇)',
        'Centralia Sewers 4': '后花园下水道 4 (蜘蛛)',

        'Centralia Beach': '后花园海滩',
        'East Waters 1': '东部水域 1',
        'East Waters 2': '东部水域 2',
        'East Waters 3': '东部水域 3',
        'East Waters 4': '东部水域 4 (贝壳)',
        'East Waters 6': '东部水域 6 (水蛭)',
        'Jellyfish Fields': '水母之地 (水母)',
        'Crab Kingdom': '螃蟹王国 (泡泡&螃蟹)',

        'South Desert 1': '南部沙漠 1 (沙尘暴)',
        'South Desert 2': '南部沙漠 2',
        'South Desert 3': '南部沙漠 3 (仙人掌)',
        'South Desert 4': '南部沙漠 4 (闪亮瓢虫)',
        'South Desert 5': '南部沙漠 5 (甲虫)',

        'Ant Hell 1': '火蚁地狱 (火蚁后)',
        'Ant Hell 2': '黑蚁地狱 (黑蚁后)',
        'Ant Hell 3': '白蚁地狱 (白蚁领主)',






        //用户界面-仓库
        'Inventory': '仓库',
        'Drag a petal to equip it': '把花瓣拖到装备栏上来使用它',
        'Stack': '按花瓣种类排序（默认按稀有度排序）',





        //花瓣详细介绍
        'Air': '空气',
        'It\'s literally nothing.': '空白，可占据卡槽。',



        'Antennae': '触角',
        'Allows your flower to sense foes farther away. Does not stack.': '让视野更宽广。此花瓣的效果不能叠加。',
        'Extra vision: ': '额外视野：',



        'Basic': '基本',
        'A nice petal, not too strong but not too weak.': '一个中庸花瓣，不是很强，也不是很弱。',
        'Damage: ': '伤害：',
        'Health: ': '血量：',



        'Basil': '罗勒',
        'Increases all healing received.': '增加所有治疗效果。',
        'Healing bonus: ': '治疗加成：',



        'Bone': '骨头',
        'Sturdy.': '硬骨头。',
        'Armor: ': '护甲：',



        'Bubble': '泡泡',
        'Physics are for the weak.': '加速推进，跑图利器。',



        'Bulb': '灯泡',
        'Light Bulb': '灯泡',
        'A shiny lightbulb. Draws aggro from mobs.': '吸引范围内敌对和中立生物。',
        'Radius: ': '半径：',



        'Cactus': '仙人掌',
        'Not very strong, but somehow increases your maximum health.': '花瓣本身强度不是很高，但可以增加本体血量上限。',
        'Flower Health: ': '本体血量：',



        'Carrot': '胡萝卜',
        'Sturdy and reliable. Can be shot and bounces off walls.': '牢固且可靠，发射后碰到墙壁会反弹。',



        'Claw': '爪子',
        'Deals extra damage if the victim is above 80% health.': '目标血量高于 80% 时，造成额外伤害。',
        '-50% damage vs other flowers.': '对其他玩家造成的伤害 -50%。',
        'Extra Damage: ': '额外伤害：',



        'Clover': '幸运草',
        'Increases your luck. Does not stack with itself.': '提高幸运值，单人不叠加，多人上限为 4.0 幸运值。',
        'Higher luck increases the chances of finding rarer mobs.': '更高的幸运值可以提高更稀有的生物出现的概率。',
        'Luck: ': '幸运：',



        'Corn': '玉米',
        'Takes a long time to spawn, but has a lot of health.': '冷却时间比较长，但是花瓣血量很高。',



        'Cotton': '棉花',
        'Absorbs damage taken by the flower.': '吸收玩家受到的伤害。（效果不明）',



        'Cutter': '齿轮',
        'A friend used to own this... now it\'s time for revenge.': '一位朋友曾经拥有这个，现在是时候为它报仇了。',
        'Increases body damage. Does not stack.': '增加体伤，不叠加。',
        'Body Damage: ': '体伤：',



        'Dahlia': '大丽花',
        'A small amount of heal but fairly consistent.': '回血量较少，但是有三份，回复过程比较平滑。',
        'Heal: ': '治疗：',



        'Dandelion': '蒲公英',
        'Its interesting properties inhibits healing effects on affected units.': '击中后可降低目标生物的治疗效果。',
        'Affected units have their healing reduced by 20%. Stacks with itself.': '目标生物治疗效果减少 20%，可叠加。',
        'Duration: ': '持续时间：',



        'Egg': '蛋',
        'Beetle Egg': '甲虫蛋',
        'Ant Egg': '蚂蚁蛋',
        'Something interesting might pop out of this.': '生成一只（或一些）生物。',
        'Contents: ': '孵化物：',



        'Fangs': '血牙',
        'Heals based on damage dealt by this petal.': '将该花瓣造成的伤害按比例获得治疗量。',
        'Damage Healed: ': '伤害吸血比例：',



        'Faster': '加速',
        'It\'s so light it makes your other petals spin faster.': '装备后可提高花瓣旋转速度。',
        'Rotation Speed:': '旋转速度增幅：',



        'Grapes': '葡萄',
        '4 in 1 deal. Now with a secret ingredient: poison.': '分为四份，造成伤害和毒伤，整个打出按一份算。',
        'Poison: ': '毒伤：',



        'Heavy': '重',
        'This thing is so heavy that nothing gets in the way.': '这个花瓣能推动生物。',
        'Slows down petal rotation speed when equipped.': '装备后且加载完成时，会减慢花瓣的旋转速度。',



        'Honey': '蜂蜜',
        'Mobs love this. Attracts them in a large radius.': '吸引范围内生物，丢出使用。',
        'Mobs will prioritize this over flowers.': '生物会优先追逐这个花瓣。',
        'Affected units develop immunity to its effects after some time.': '被影响的生物一段时间后效果解除。',
        'Max Mob Rarity: ': '最高生物稀有度：',



        'Iris': '鸢尾',
        'Very poisonous, but takes a little while to do its work.': '造成毒伤，毒伤不可叠加。',



        'Jelly': '果冻',
        'No one likes touching this.': '弹开其他生物。',
        'Knockback: ': '击退：',



        'Leaf': '叶子',
        'Gathers energy from the sun to heal your flower passively.': '从阳光中收集能量来持续回复血量，冷却期间亦生效。',
        'Can be eaten by friendly mobs to heal.': '也可以帮助除挖掘者外的友方生物回血。',
        'Mob Heal: ': '治疗生物：',



        'Light': '轻',
        'Weaker than most petals, but recharges very quickly.': '比大部分花瓣脆弱（伤害、血量），但是冷却时间短。',



        'Lightning': '闪电',
        'Strikes several nearby enemies.': '可以导电多个邻近的生物。',
        'Lightning: ': '闪电伤害：',
        'Bounces:': '导电数量：',



        'Lotus': '莲花',
        'Absorbs poison damage taken by the flower.': '可以吸收玩家受到的毒伤。',



        'Magnet': '磁铁',
        'Increases drop pickup range.': '扩大拾取掉落物的范围。',
        'Does not stack with itself.': '拾取效果不叠加。',
        'Pickup range: ': '拾取范围：',



        'Missile': '导弹',
        'You can actually shoot this one.': '您可以把这个花瓣发射出去。',



        'Orange': '橘子',
        'A sweet citrus fruit.': '站在此地，不要走动。',



        'Pearl': '珍珠',
        'Just drop it off somewhere and use your kinetic powers so you don\'t lose it.': '抛出去可以随时收回来，不收回来的话，可以推着走，也可以拖着走。',



        'Peas': '豌豆',
        '4 in 1 deal.': '分 4 份，整体打出算 1 份。',



        'Pincer': '毒螫',
        'Debilitates enemies temporarily, reducing their movement speed.': '可以短时间麻痹敌人，降低敌人的移动速度，对贝壳也有效。',



        'Plank': '木板',
        'Does 5x damage vs projectiles and petals.': '对花瓣和飞行道具造成 5 倍伤害。',



        'Pollen': '花粉',
        'Asthmatics beware.': '当心过敏。',



        'Poo': '便便',
        'Makes mobs less likely to want to attack you. Does not stack.': '减少生物发现你的范围，效果不叠加。',
        'Mob aggro range: ': '生物发现范围：',



        'Powder': '粉末',
        'Mysterious Powder': '神秘的粉末',
        'Increases movement speed. Does not stack.': '提高移动速度，效果不叠加。',
        'Movement Speed: ': '移动速度增幅：',



        'Relic': '遗物',
        'Mysterious Relic': '神秘的遗物',
        'A strange relic. Damage taken is spread among other wearers.': '奇怪的遗物，特定范围内同时佩戴它的玩家会共享部分伤害。',
        '% distributed: ': '受伤分摊比例：',



        'Rice': '米',
        'Spawns instantly, but not very strong.': '生成速度非常快，但是很脆弱。',



        'Rock': '石头',
        'Extremely durable, but takes a bit longer to recharge.': '非常耐用，稍微需要一些时间来装载。',



        'Rose': '玫瑰',
        'Its healing properties are amazing. Not so good at combat though.': '回血效果惊艳，但战斗过程中容易被损坏。',



        'Salt': '盐',
        'Reflects some of the damage you take back to the enemy that dealt it.': '以特定比例反弹敌方单位对我方造成的伤害。',
        'Reflected damage is reduced by 75% against flowers.': '伤害反弹效果对其他玩家 -75%。',
        'Damage Reflection: ': '伤害反弹比例：',



        'Sand': '沙子',
        'A bunch of sand particles.': '一团沙子(4 颗沙粒)。',



        'Shell': '贝壳',
        'Adds a temporary shield to yourself or allies.': '给自己和其他玩家施加缓慢衰减的临时护盾。',
        'Shield: ': '护盾：',



        'Soil': '土',
        'Increases health, but also increases flower size and decreases movement speed.': '增加本体血量上限，增大花朵，但是会减慢移动速度，效果均可叠加。',



        'Sponge': '海绵',
        'Spreads damage taken by the flower over a period of time.': '把玩家受到的伤害分摊到一段时间内缓慢扣除。',
        'If destroyed, deals remaining damage all at once.': '如果被打破了，储存的伤害将一次性结算。',
        'Period: ': '周期：',



        'Square': '方块',



        'Starfish': '海星',
        'Increases health regen while below 75% health.': '生命值低于75%时开始恢复血量，冷却期间亦生效。',



        'Stick': '树枝',
        'Mysterious Stick': '神秘的树枝',
        'A mysterious stick that summons the forces of the wind.': '这个神秘的树枝可以召唤风的力量来生成沙尘暴。',
        'Spawn: ': '生成：',



        'Stinger': '刺',
        'It really hurts, but it\'s very fragile.': '伤害非常高，但是也非常脆弱。',



        'Third Eye': '第三只眼',
        'Allows your flower to expand your petals further out.': '能使装备的花瓣进一步张开，攻击距离更远。',
        'Does not stack.': '花瓣效果不叠加。',
        'Extra range: ': '距离加成：',



        'Tomato': '番茄',
        'Gets stronger over time, but then spoils.': '成熟度越高伤害越高，但是容易腐烂。',



        'Uranium': '铀',
        'Periodically releases radiation in a large radius.': '周期性地释放辐射伤害，可叠加，但对自身的毒伤不叠加。',
        'Causes even the most passive mobs to become very aggressive.': '使所有可移动生物变为主动敌对生物。',
        'Stronger the closer the victim is to the source.': '生物离辐射源越近，受到的伤害越高。',
        '-75% damage versus other flowers.': '对其他玩家的伤害-75%。',



        'Web': '网',
        'It\'s really sticky.': '黏糊糊的，用于减速敌人。',



        'Wing': '翅膀',
        'It comes and goes.': '像回旋镖一样的翅膀。',



        'Yggdrasil': '世界树之叶',
        'A dried leaf from the Yggdrasil tree.': '从世界树上掉落的枯叶。',
        'Rumored to be able to bring the fallen back to life.': '据说能够让死亡的花朵复活。',
        'Revive Heal: ': '复活后血量：',



        'Yin Yang': '阴阳',
        'This mysterious petal affects the rotation of your petals in unpredictable ways.': '这个神秘的花瓣能以特殊的方式改变其它花瓣的转动方式或分布形态。',



        'Yucca': '丝兰',
        'Heals your flower but only while in the defensive position.': '花朵处于防守形态时才能产生治疗效果。',





        //用户界面-技能
        'Skills': '技能',
        'SP': '技能点',
        'Acquire more SP by ': '您可以通过',
        'absorbing': '吸收',
        ' petals to gain levels': '花瓣来提升等级，从而获得技能点',
        'HOLD to upgrade': '长按升级',
        'Reset': '重置技能',
        'This will refund all your SP points.': '将返还您全部技能点。',
        'WARNING:': '警告',
        'It will cost you 5 levels.': '这将使您降低5级。',
        'Cancel': '取消',





        //技能详细描述
        'Salvaging': '回收',

        'Petals destroyed during crafting will be absorbed for 1% of their XP.': '合成中消耗的花瓣会被吸收1%的经验。',

        'Increases the absorbed XP from petals destroyed during crafting from 1% to 2%.': '将合成中消耗花瓣被吸收经验的比例从1%提升到2%。',

        'Increases the absorbed XP from petals destroyed during crafting from 2% to 3%.': '将合成中消耗花瓣被吸收经验的比例从2%提升到3%。',

        'Increases the absorbed XP from petals destroyed during crafting from 3% to 4%.': '将合成中消耗花瓣被吸收经验的比例从3%提升到4%。',

        'Increases the absorbed XP from petals destroyed during crafting from 4% to 5%.': '将合成中消耗花瓣被吸收经验的比例从4%提升到5%。',



        'Skilled Crafting': '合成概率',

        'Increases ': '提高',
        ' to ': '→',

        ' crafting chance from 40% to 44%.': '的合成概率：40% → 44%',
        ' crafting chance from 30% to 33%.': '的合成概率：30% → 33%',
        ' crafting chance from 20% to 22%.': '的合成概率：20% → 22%',
        ' crafting chance from 10% to 11%.': '的合成概率：10% → 11%',
        ' crafting chance from 3% to 3.3%.': '的合成概率：3% → 3.3%',
        ' crafting chance from 2% to 2.2%.': '的合成概率：2% → 2.2%',
        ' crafting chance from 1% to 1.1%.': '的合成概率：1% → 1.1%',

        ' crafting chance 44% to 48%.': '的合成概率：44% → 48%',
        ' crafting chance 33% to 36%.': '的合成概率：33% → 36%',
        ' crafting chance 22% to 24%.': '的合成概率：22% → 24%',
        ' crafting chance 11% to 12%.': '的合成概率：11% → 12%',
        ' crafting chance 3.3% to 3.6%.': '的合成概率：3.3% → 3.6%',
        ' crafting chance 2.2% to 2.4%.': '的合成概率：2.2% → 2.4%',
        ' crafting chance 1.1% to 1.2%.': '的合成概率：1.1% → 1.2%',



        'Crafting': '合成能力',
        'Unlocks the ability to craft ': '解锁合成花瓣稀有度等级',
        ' petals.': '',



        'Loadout': '卡槽',

        'Enables a 6th loadout slot to equip petals.': '解锁第 6 个用于装备花瓣的卡槽',

        'Enables a 7th loadout slot to equip petals.': '解锁第 7 个用于装备花瓣的卡槽',

        'Enables a 8th loadout slot to equip petals.': '解锁第 8 个用于装备花瓣的卡槽',

        'Enables a 9th loadout slot to equip petals.': '解锁第 9 个用于装备花瓣的卡槽',

        'Enables a 10th loadout slot to equip petals.': '解锁第 10 个用于装备花瓣的卡槽',



        'Reload': '花瓣冷却',

        'Decreases the reload time for petals by -7%.': '降低花瓣冷却时间：-7%',
        'Decreases minimum reload time when swapping petals from 2.5s to 2.0s.': '花瓣切槽装载时间：2.5s → 2.0s',

        'Decreases the reload time for petals from -7% to -14%.': '降低花瓣冷却时间：-7% → -14%',
        'Decreases minimum reload time when swapping petals from 2.0s to 1.5s.': '花瓣切槽装载时间：2.0s → 1.5s',

        'Decreases the reload time for petals from -14% to -20%.': '降低花瓣冷却时间：-14% → -20%',
        'Decreases minimum reload time when swapping petals from 1.5s to 1.0s.': '花瓣切槽装载时间：1.5s → 1.0s',

        'Decreases the reload time for petals from -20% to -25%.': '降低花瓣冷却时间：-20% → -25%',
        'Decreases minimum reload time when swapping petals from 1.0s to 0.5s.': '花瓣切槽装载时间：1.0s → 0.5s',

        'Decreases the reload time for petals from -25% to -31%.': '降低花瓣冷却时间：-25% → -31%',
        'Decreases minimum reload time when swapping petals from 0.5s to 0.0s.': '花瓣切槽装载时间：0.5s → 0.0s',

        'Decreases the reload time for petals from -31% to -35%.': '降低花瓣冷却时间：-31% → -35%',

        'Decreases the reload time for petals from -35% to -40%.': '降低花瓣冷却时间：-35% → -40%',



        'Petal Rotation': '转速',

        'Increases petal ': '花瓣的',
        'Rotation Speed': '旋转速度',

        ' from 2.5 to 2.8 rad/s.': ' ：2.5 → 2.8 rad/s',

        ' from 2.8 to 3.1 rad/s.': ' ：2.8 → 3.1 rad/s',

        ' from 3.1 to 3.4 rad/s.': ' ：3.1 → 3.4 rad/s',

        ' from 3.4 to 3.7 rad/s.': ' ：3.4 → 3.7 rad/s',

        ' from 3.7 to 4 rad/s.': ' ：3.7 → 4.0 rad/s',



        'Health': '生命值',

        'Increases base ': '提高基础',
        'Flower Health': '本体血量',
        ' by 25%.': '：+25%',



        'Medic': '治疗增幅',

        'healing': '基础治疗效果',
        ' from your petals by 10%.': '：+10%',
        'Affects allies healed by your petals.': '治疗其他玩家时，此效果亦生效',



        'Summoner': '召唤物血量',

        ' of summoned mobs by 10%.': '：+10%，基于召唤物基础血量',



        'Sharp Edges': '体伤',

        'Body Damage': '体伤',
        ' by 20%.': '：+20%',





        //用户界面-吸收
        'Absorb': '吸收',
        'Switch': '切换',
        'Next level: +1 SP': '达到下一级：+1 技能点',
        'Absorb petals to gain XP': '吸收花瓣可获得XP',
        'WARNING: The petals will be destroyed in the process': '警告：此过程将摧毁花瓣',





        //用户界面-合成
        'Craft': '合成',
        'Combine 5 of the same petal to craft an upgrade': '合成高一级花瓣至少需要 5 个相同花瓣',
        'Failure will destroy 1-4 petals': '失败将随机摧毁 1~4 个花瓣',





        //用户界面-生物图鉴
        'Mob Gallery': '生物图鉴',





        //生物详细介绍
        'Ant Egg': '蚂蚁蛋',
        'Not yet an ant but perhaps soon': '在不久后会变成蚂蚁。',



        'Ant Hole': '蚂蚁洞',
        'Ants go in, and come out. Can\'t explain that.': '一窝蚂蚁。',



        'Baby Ant': '幼蚁',
        'Weak and defenseless, but big dreams.': '小小的蚂蚁，大大的梦想。',



        'Baby Fire Ant': '幼火蚁',
        'This ant is on fireeeeeeeeeeeeee': '这类蚂蚁脾气比较暴躁。',



        'Baby Termite': '幼白蚁',
        'These creatures appear to be connected somehow.': '这类蚂蚁似乎存在某种关联。',
        'Psyonic Connection': '命运共同体',



        'Bee': '蜜蜂',
        'It stings. Don\'t touch it.': '别碰，会蛰。',



        'Beetle': '甲虫',
        'It\'s hungry and flowers are its favorite meal.': '这种饿货最喜欢吃花花。',

        'Bubble': '泡泡',
        'Pop': '吹弹可破。',

        'Bumble Bee': '熊蜂',
        'GOTTA RUN.': '溜了溜了。',
        'Missile health: ': '自身刺血量：',
        'Missile damage: ': '自身刺伤害：',



        'Cactus': '仙人掌',
        'Avoid touching it, it hurts.': '撞上它真的很疼。',



        'Centipede': '蜈蚣',
        'It\'s just there doing its thing.': '花不犯它，它不犯花。',



        'Roach': '蟑螂',
        'Gotta go FAST... until they get tired.': '速度非常快，除非它们累了。',



        'Crab': '螃蟹',
        'Mr. Crab': 'Mr. Crab ♂',



        'Dandelion': '蒲公英',
        'Puffy': '蓬松的花伞。',



        'Desert Centipede': '沙漠蜈蚣',
        'Gotta go fast.': '身上粉尘多，俗称泥头车。',



        'Digger': '挖掘者',
        'Wrong game, bud': '似乎喜欢挖蚁穴？',



        'Evil Centipede': '邪恶蜈蚣',
        'This one loves flowers.': '这货喜欢（吃）花花。',



        'Fire Ant Burrow': '火蚁穴',
        'What could be in here?': '里面有什么呢？',



        'Fire Ant Egg': '火蚁蛋',
        'This ant is not yet on fire': '此时的火蚁尚未开始躁动。',



        'Fly': '苍蝇',
        'Hzzzzzzzzzzzz': '围着 M28 乱飞。',



        'Hornet': '黄蜂',
        'These aren\'t quite as nice as the little bees.': '这种生物可没有小蜜蜂那么友好。',



        'Jellyfish': '水母',
        'Makes the most delicious jam': '可制作最美味的jam。',



        'Ladybug': '瓢虫',
        'Shiny, cute and mostly harmless.': '长大后会去找世界树的闪亮瓢虫。',
        'Cute and harmless.': '可爱且无邪。',
        'Cute and harmless... if left unprovoked.': '可爱且无邪（无端',



        'Leech': '水蛭',
        'Slurp slurp': '嘬一口。',
        'Lifesteal: ': '吸血量：',



        'Moth': '飞蛾',
        'Easily scared, be nice.': '很容易受到惊吓。',



        'Queen Ant': '蚁后',
        'You must have done something really bad if she\'s chasing you.': '如果她追赶你，那一定是你干坏事惹到她了。',



        'Queen Fire Ant': '火蚁后',



        'Rock': '石头',
        'A rock. It doesn\'t do much.': '一块石头，里边没有猴子。',



        'Sandstorm': '沙尘暴',
        'Darude (1999)': '伤心 (1999)',



        'Scorpion': '蝎子',
        'IT STINGS': '它的螫带毒。',
        'Missile Poison: ': '发射的螫毒伤：',



        'Shell': '贝壳',
        'Not an advertisement': '自带吸铁石的珠宝批发商。',



        'Soldier Ant': '兵蚁',
        'It\'s got wings and it\'s ready to use them.': '翅膀硬了，随时准备搞事情。',



        'Soldier Fire Ant': '兵火蚁',



        'Soldier Termite': '兵白蚁',



        'Spider': '蜘蛛',
        'Spooky.': '阴森森的。',



        'Sponge': '海绵',
        'Bob': '不是 Pizza。',



        'Square': '方块',
        'This shape... it looks familiar...': '这个外形看着很熟悉...',



        'Starfish': '海星',
        'His name is Patrick': '它的名字叫派大星。',



        'Termite Overmind': '白蚁领主',
        'The one who sees all.': '原来这就是大大的梦想。',



        'Worker Ant': '工蚁',
        'It\'s a bit temperamental, probably from working all the time.': '有点喜怒无常，估计是因为一直搬砖干活。',



        'Worker Fire Ant': '工火蚁',



        'Worker Termite': '工白蚁',





        //稀有度
        'Common': '常见',
        'Unusual': '少见',
        'Rare': '稀有',
        'Epic': '史诗',
        'Legendary': '传奇',
        'Mythic': '神话',
        'Ultra': '究极',
        'Super': '至臻',

        ' (Common)': '（常见）',
        ' (Unusual)': '（少见）',
        ' (Rare)': '（稀有）',
        ' (Epic)': '（史诗）',
        ' (Legendary)': '（传奇）',
        ' (Mythic)': '（神话）',
        ' (Ultra)': '（究极）',
        ' (Super)': '（至臻）',
    }





    //获取翻译
    function getTranslate(text) {
        if (typeof (translate[text]) == 'string') { return translate[text] }
        switch (true) {
            //1.2% success chance
            case (/\S+% success chance/.test(text)): {
                const probability = text.match(/\S+(?=% success chance)/);
                return `成功率 ${probability}%`;
            }

            //Store will change in 10 hours.
            case (/Store will change in [0-9][0-9]?[0-9]? \w\w\w\w\w?\w?\w?\./.test(text)): {
                const timeNum = text.match(/(?<=Store will change in )[0-9]?[0-9]?[0-9]?(?=\s\w\w\w\w\w?\w?\w?\.)/);
                const timeUnit = text.match(/(?<=Store will change in [0-9]?[0-9]?[0-9]?\s)\w\w\w\w\w?\w?\w?(?=\.)/);
                return `货架将在 ${timeNum} ${getTranslate(timeUnit)}后刷新`;
            }

            //The Super Termite Overmind was defeated by you!
            case (/The \w\w\w\w\w?\w?\w?\w?\w? .+ was defeated by .+!/.test(text)): {
                const mobLevel = text.match(/(?<=The\s)\w\w\w\w\w?\w?\w?\w?\w?(?=\s)/);
                const mobName = text.match(/(?<=The\s\w\w\w\w\w?\w?\w?\w?\w?\s).+(?=\swas)/);
                const playerName = text.match(/(?<=was defeated by ).+(?=!)/);
                return `${getTranslate(mobLevel)} ${getTranslate(mobName)} 已被 ${playerName} 击败！`;
            }

            //A Super Termite Overmind has spawned!
            case (/An? \w\w\w\w\w .+ has spawned!/.test(text)): {
                const mobLevel = text.match(/(?<=An?\s)\w\w\w\w\w(?=\s)/);
                const mobName = text.match(/(?<=An?\s\w\w\w\w\w\s).+(?= has spawned!)/);
                return `${getTranslate(mobLevel)} ${getTranslate(mobName)} 已在地图中生成！`;
            }

            //A Super Termite Overmind has spawned somewhere!
            case (/An? \w\w\w\w\w .+ has spawned somewhere!/.test(text)): {
                const mobLevel = text.match(/(?<=An?\s)\w\w\w\w\w(?=\s)/);
                const mobName = text.match(/(?<=An?\s\w\w\w\w\w\s).+(?= has spawned somewhere!)/);
                return `${getTranslate(mobLevel)} ${getTranslate(mobName)} 已在某个地图中生成！`;
            }
        }
        return text;
    }


    //获取可操作的 Canvas，避免出现浏览器不兼容情况
    function getCompatibleCanvas() {
        if (typeof (OffscreenCanvasRenderingContext2D) == 'undefined') { return [CanvasRenderingContext2D] }
        return [OffscreenCanvasRenderingContext2D, CanvasRenderingContext2D];
    }


    //普通的日志输出，但加入了防止过快输出的措施
    function consoleTextInfoLog(string) {
        if ((performance.timeOrigin + performance.now()) - timestampForDebug >= 2333) {
            timestampForDebug = performance.timeOrigin + performance.now();
            console.log(string);
        }
    }


    //当被查找的字符串中含有目标字符串，弹出警告
    function alertTargetStr(searchStr, targetStr) {
        if (searchStr.search(targetStr) > -1) {
            alert(searchStr);
        }
    }


    //获取模糊化的字体大小 | 主要用来避免花瓣上小字的字体大小会在小幅度内变动的情况，让它好看一点
    function getBlurFontSize(str) {
        return ~~((~~(str.match(/(?<!.)[0-9][0-9]?[0-9]?[0-9]?/)) + 3.5) / 5) * 5 - 1; //正则表达式需要注意存在小数情况
    }


    //获取可应用的字体字符串
    function getApplicableFontStr(fontSize) {
        return `${customFont.fontWeight} ${(fontSize > customFont.fontSizeMin ? fontSize : customFont.fontSizeMin)}px ${customFont.fontFamily}`;
    }


    //初始化
    for (const { prototype } of getCompatibleCanvas()) {
        if (prototype.fyu8d71gf6kv == undefined) {
            if (openCustomReloadAnimation) { prototype.rewriteArc = prototype.arc }
            prototype.fyu8d71gf6kv = prototype.strokeText;
            prototype.fyu8d71gf6kf = prototype.fillText;
            prototype.fyu8d71gf6kt = prototype.measureText;
        }
        else { break }
    }


    //函数重写
    for (const { prototype } of getCompatibleCanvas()) {
        if (openCustomReloadAnimation) {
            //重写绘制圆弧路径函数 | 将花瓣再装填动画改为自定义，这里貌似是 Phigros 中的打击效果
            prototype.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
                if (x == 0 && y == -5 && radius == 120 && anticlockwise == false) {
                    y = y + 5;
                    const progress = ~~(Math.sqrt(startAngle / 35.81371) * 10000);
                    const size3tProgress = size3 * progress / 10000;
                    const size4tProgress = size4 * progress / 10000;
                    const XmSize2db2p15 = x - size2db2 + 15;
                    const XpSize2db2m15 = x + size2db2 - 15;
                    const YmSize2db2p11 = y - size1db2 + 11.25;
                    const YpSize2db2m11 = y + size1db2 - 11.25;
                    const originalGlobalAlpha = this.globalAlpha;
                    if (progress >= 9950) { this.globalAlpha = (50 - (progress - 9950)) / 50; } //最后的降低透明度动画 | 注意 js 小数运算精度问题
                    this.drawImage(reloadProcessBarImg, XmSize2db2p15, YmSize2db2p11, size3tProgress, 5);
                    this.drawImage(reloadProcessBarImg, XpSize2db2m15, YmSize2db2p11, size4tProgress, 5);
                    this.drawImage(reloadProcessBarImg, XmSize2db2p15, YpSize2db2m11, size3tProgress, -5);
                    this.drawImage(reloadProcessBarImg, XpSize2db2m15, YpSize2db2m11, size4tProgress, -5);
                    this.drawImage(reloadProcessBarImg, YmSize2db2p11, XmSize2db2p15, 5, size3tProgress);
                    this.drawImage(reloadProcessBarImg, YmSize2db2p11, XpSize2db2m15, 5, size4tProgress);
                    this.drawImage(reloadProcessBarImg, YpSize2db2m11, XmSize2db2p15, -5, size3tProgress);
                    this.drawImage(reloadProcessBarImg, YpSize2db2m11, XpSize2db2m15, -5, size4tProgress);
                    y = y - 5;

                    this.drawImage(reloadMainImg, x - size2db2, y - size1db2 + 5, size2, size1);
                    this.globalAlpha = originalGlobalAlpha
                    return;
                }
                return this.rewriteArc(x, y, radius, startAngle, endAngle, anticlockwise);
            }
        }

        //重写字符描边函数
        prototype.strokeText = function (text, x, y) {
            const newFontSize = getBlurFontSize(this.font);
            this.font = getApplicableFontStr(newFontSize);
            //alertTargetStr(text, "Flower Health");
            //consoleTextInfoLog(text, x, y);
            return this.fyu8d71gf6kv(getTranslate(text), x, y);
        }

        //重写字符填充函数 | 它会随着 strokeText 自适应填充，不需要更多设置
        prototype.fillText = function (text, x, y) {
            return this.fyu8d71gf6kf(getTranslate(text), x, y);
        }

        //重写字符尺寸度量函数
        prototype.measureText = function (text) {
            const newFontSize = getBlurFontSize(this.font);
            this.font = getApplicableFontStr(newFontSize);
            return this.fyu8d71gf6kt(getTranslate(text));
        }
    }
})();