// ==UserScript==
// @name         魔电官网文档中文化脚本
// @description  协助名单：在在在、唔喵王
// @copyright    2019 黑本
// @version      0.6.4
// @author       黑本
// @license      MIT
// @homepageURL  https://space.bilibili.com/12221554
// @match        https://docs.median-xl.com/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/301775
// @downloadURL https://update.greasyfork.org/scripts/383113/%E9%AD%94%E7%94%B5%E5%AE%98%E7%BD%91%E6%96%87%E6%A1%A3%E4%B8%AD%E6%96%87%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/383113/%E9%AD%94%E7%94%B5%E5%AE%98%E7%BD%91%E6%96%87%E6%A1%A3%E4%B8%AD%E6%96%87%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.body.innerHTML = document.body.innerHTML
//大段文字
    .replace(/\r\n/g, '')
    .replace(/\n/g, '')
    .replace(/					/g, '')
    .replace(/				/g, '')
    .replace(/			/g, '')
    .replace(/			/g, '')
    .replace("These three runes are very rare and can only be found in the Fauztinville uberlevel	on Destruction difficulty.",
             '这三个稀有高级符文仅掉落于 【弗兹坦维尔 Fauztinville】。')
    .replace(", these are very rare and can only be found in the Toraja in Destruction difficulty.",
        '，这三个稀有高级符文仅掉落于 【托拉加 Toraja】。')
    .replace("Median XL contains the standard Diablo II gems with new bonuses, but also 5 new gem types and 30 new runes.",
             '魔电 XL 里的宝石属性跟原版的都不一样，并且我们额外增加了 5 种全新的宝石和 30 枚符文。')
    .replace("On Destruction difficulty, in the Teganze uberlevel, you can come by",
        '只有在【特纲泽 Teganze】，才会掉落')
    .replace(/>Elemental Essences</g, '>元素精华<')
    .replace(/>Runestones</g, '>空白符文石<')
    .replace(/You can cube them to get the/g, '你可以合成它们，从而获得')
    .replace(/Elemental Essence \+ Runestone → Elemental Rune/g, '元素精华 + 空白符文石 → 元素符文')
    .replace(/\(all 6 different\) \+ Runestone/g, 'X6 (6种不同) + 空白符文石')
    .replace(/LIST OF GEMS/g, '宝石图鉴')
    .replace(/LIST OF RUNES/g, '符文图鉴')
    .replace("There are no low level sets. All set items are sacred and drop only from mid-Nightmare difficulty onwards - with the exception of some items from the 2 Yshari Uberquest sets, which drop only there (bosses and guards). Sets in Median XL are advanced equipment for high level heroes.",
             '魔电的套装只有神圣版本，它们从噩梦中期开始掉落，仅有两套高级套装的部分散件需要在特定的区域击杀守卫或者BOSS获得。<br>成套的套装加成十分强力，只有少数人才能集齐它们。')


    .replace("There are over 45 sets in Median XL, containing over 180 set items.", '魔电拥有45套绿装，包含了超过180个套装散件。')
    .replace("Each regular item has one unique version that can drop anywhere in the game. The stats of each unique depend on the tier of the base item: higher tier versions of the same unique are improved in all aspects, but have higher requirements.",
             '每件装备都有它的暗金版本，品级暗金装备为世界掉落。它们的属性值基于装备品级，更高的品级有更好的属性和更高的等级和任人物属性需求。')
    .replace("page for details on item tiers.", '这个页面来查看关于物品品级的更多细节。')
    .replace("All unique items come with the maximum allowed number of sockets for the item type. Lower tier items have less sockets.",
             '所有暗金装备拥有对应品级基础装备的最大孔数。')
    .replace("All unique items come with the maximum allowed number of sockets for the item type.",
             '所有神圣暗金装备拥有对应基础装备的最大孔数。')
    .replace("All set items come with the maximum allowed number of sockets for the item type.",
             '所有神圣套装拥有对应基础装备的最大孔数。')
    .replace("If an item has a skill bonus with no character class requirement", '如果装备拥有无职业限制的技能')
    .replace("All sacred uniques aside from jewelry come in 2 or 3 different variations.", '')
    .replace("Their position within the table dictates what variation they come as \(SU is leftmost, SSU is center \(rightmost in a 2 column arrangement\), ", '')
    .replace("and SSSU is rightmost \(in a 3 column arrangement\), jewelry not included\).", '')
    .replace("The SU variants are typically found beginning at Area Levels of 104 and beyond, SSU variants begin dropping in Area Level 119 areas, and SSSUs start dropping in Area Level 130 areas.",
             '除了珠宝以外，所有神圣暗金装备都有2-3种的变体，下表中从左到右分别被称为SU，SSU，SSSU。<br>104+地图掉落SU，119+地图掉落SSU，130+地图掉落SSSU。')
    .replace("The Flamen staves are an exception to this rule, the ending staff being SSU.",
             '<br>德鲁伊专属双手杖是一个例外，它的第二、三个变体都属于SSU，也就是没有SSSU版本。')
    .replace("then the bonus is an 'oskill', giving this skill to any class for free.", '这个技能就叫做装备技能（oskill），任何职业都可以使用它。')
    .replace("The Sacred tier of items has, on average, two unique versions that are different from the tiered unique. Some items don't have a sacred variant. Sacred uniques can only drop in Hell difficulty. The best rings, amulets, jewels and quivers are also marked as sacred uniques.",
        '神圣的暗金装备独立于品级之外，平均下来，每件拥有两个形态，当然，也有些神圣装备没有暗金形态。<br>神圣暗金装备无法被制造，只能在地狱以后掉落。<br>虽然没有在游戏中被标注，但最屌的首饰、珠宝还有箭袋也属于神圣暗金。')
//物品文字

    .replace("Median XL features the familiar item types from classic LoD, as well as many new exotic class-specific items.",
             '魔电XL和原版暗黑2有着类似的装备体系，额外增加了一些特殊的专属装备种类。')
    .replace(/b>Item tiers/g, 'b style="color:#fff;">装备品级')
    .replace("Each item has 4 \'tiers\' or quality levels. Higher tiers of the same item have better stats but higher requirements. The tier number of an item is displayed in brackets behind the item name. You may be able to find even more powerful \'Sacred\' items...",
             '魔电的的装备没有扩展和精华的概念，每件装备都拥有4个品级和品质等级（QLv）。同一装备的高品级版本拥有更高的属性和更高的佩戴需求。<br>判断装备的品级为几阶，需要看装备名称后面括号里的数字，比如“短剑（1）”就是品级为一阶的短剑。<br>在游戏后期，还有脱离品级的更强装备，它们被标注为（神圣）。')
    .replace("Some class-specific weapons come with their own built-in attack modifier, adding an extra effect to your attacks. There are 4 attack modifiers in the game:",
             '部分角色专属武器有用特殊的攻击手段，这些武器的普通攻击会触发额外的效果。魔电里一共有4中特殊攻击')
    .replace("All tiered and sacred items have a 25-50% chance to spawn with a random number of sockets \(0 to item max\). Uniques, sets, crafted and honorific items spawn with max sockets.",
             '所有品级和神圣装备掉落时都有 25-50% 的机会随机打孔（0 -最大）。暗金，套装，手工和荣耀装备天生拥有最大孔数。')
    .replace("Mage characters \(druids, necromancers, sorceresses\) cast their spells faster when using a staff. The cast animation has 25% fewer frames when a staff is used. This bonus is multiplicative with faster cast rate items.",
             '法术角色（法师，德鲁伊，死灵法师）在使用双手法杖时可以获得额外 25% 的施法速度加成，这个加成在计算 FCR 时是相乘而不是相加。')
    .replace("Boots of all qualities \(magic, rare, unique, etc..\) roll between 0-40% movement speed.",
             '所有类型的鞋子，不管是魔法，黄金，暗金还是套装等等，移速都不固定，它的变量在 0-40% 之间生成。')
//合成公式
    .replace("Far from being the interesting magical gimmick you may be used to, the Median XL cube is a powerful weapon of war.", '跟原版里无足轻重的公式不同，赫拉迪克宝箱在魔电里起到了极为重要的作用。')
    .replace("These reagents can be found by killing the appropriate monster:", '获取方式')
    .replace("Catalyst of Disenchantment: kill Andariel on Normal difficulty", '分解催化剂：普通难度下消灭安达利亚（A1 关底Boss）')
    .replace("Catalyst of Learning: kill the Summoner on Nightmare difficulty", '学习催化剂：噩梦难度下消灭召唤者（A2 神秘避难所）')
    .replace(/>Oils</g, '>油剂<')
    .replace('These reagents can be bought from a vendor in each town, except Oil of Conjuration which must be found.', '每一关的有特定商人出售：<br>Act1 基德 Gheed<br>Act2 卓格南 Drognan<br>Act3 艾柯 Alkor<br>Act4 哈尔布 Halbu<br>Act5 拉祖克 Larzuk')
    .replace(/>Arcane Shards</g, '>奥术碎片<')
    .replace('This reagent is obtained by disenchanting unique items.', '由分解暗金装备获取')
    .replace(/>Arcane Crystal</g, '>奥术水晶<')
    .replace(/This reagent is created by cubing Arcane Shards in sets of five./g, '由奥术碎片X5合成')
    .replace(/>Arcane Cluster</g, '>奥术簇群<')
    .replace('This reagent is created by cubing an Arcane Crystal with an Oil of Craft.', '由奥术水晶加锻造油合成（用于堆叠大量奥术水晶）')
    .replace(/>Mystic Orbs</g, '>通灵宝珠（神秘之球） Mystic Orbs<')
    .replace('These reagents can be bought from any magic items vendor. Note that the strongest Mystic Orbs are not for sale...', '仍由上面的特定商人处出售，每颗15000，用于和装备合成，提升属性。<br>每合成1颗，装备需求等级+4，每件物品同一神秘之球最多合成5颗（通常叫做一组，增加需求等级20）。')
    .replace(/>Shrines</g, '>圣坛 Shrines<')
    .replace('Orange crucifixes that drop in late Nightmare and in Hell difficulty. They enable you to create and bless items, see below.', '噩梦后期开始掉落，用于制作圣坛手工装备')
    .replace(/>Mark of Infusion</g, '>注入标记 Mark of Infusion<')
    .replace('This reagent is obtained by killing Shenk, the Overseer on any difficulty.', '消灭任意难度的督军山克（Act5 第一个小站往回走）')
    .replace('DISASSEMBLE ITEMS INTO RESOURCES', '将无用的装备分解成战略物资')
    .replace('Arcane Shards, Crystals and Clusters', '奥术碎片/水晶和簇群')
    .replace('Destroy up to 10 spare unique items to create Arcane Shards and combine those into Arcane Crystals, which are required for other cube recipes.', '')
    .replace('Any unique item \+ Catalyst of Disenchantment \→ Arcane Shards \+ Catalyst of Disenchantment', '暗金装备 + 分解催化剂 → 奥术碎片 + 分解催化剂（一次最多放10件装备）')
    .replace('Arcane Shards x5 \→ Arcane Crystal', '奥术碎片 x5 → 奥术水晶')
    .replace('You can also create an Arcane Cluster for easier Arcane Crystal safekeeping', '使用下列公式制造奥术簇群来储存大量的奥术水晶')
    .replace('Arcane Crystal \+ Oil of Craft \→ Arcane Cluster', '奥术水晶 + 锻造油 → 奥术簇群（1）</div></p><p><div class="reagent" style="max-width: 750px">奥术簇群（n） + 奥术水晶 x X → 奥术簇群（n + X）</div></p>')

    .replace('Arcane Cluster can be right-clicked to collect all Arcane Crystals from the inventory, cube and stash.', '通过鼠标右击奥术簇群可以将所有奥术水晶收集起来（背包、宝盒和仓库）')
    .replace(/>Signets of Learning</g, '>学识图章<')
    .replace('Destroy up to 25 spare sacred unique or set items to create Signets of Learning. Click the signet to gain 1 attribute point permanently.', '分解神圣暗金或者套装装备来获得学识图章，一次最多放25件<br>右击学识图章可以得到永久的额外属性点。')
    .replace('Any sacred unique\/set item \+ Catalyst of Learning \→ Signet of Learning \+ Catalyst of Learning', '神圣 暗金/套装 物品 + 学习催化剂 → 学识图章 + 学习催化剂')
    .replace('Each character can use a maximum of 400 Signets of Learning.', '每个角色通过学识图章获得的额外属性点最多为400。')
    .replace('>ITEM QUALITY RECIPES', '装备品质更改公式')
    .replace('CHANGE THE QUALITY LEVEL OF YOUR ITEMS', '')
    .replace('Upgrade to Non-magical Item', '非魔法装备（白色/灰色带孔）')
    .replace('Upgrade any item to regular quality or a regular item to superior. This also rerolls the socket count on the item.',
             '重置任何品质装备为非魔法装备，并随机打孔（0 - 最大），用于制作神符之语底材以及利用A1铁匠任务奖励升级黄金。')
    .replace('Low quality weapon\/armor \+ Oil of Enhancement \→ reroll item as regular', '低品质 武器/护具 + 强化油 → 重置物品为 普通')
    .replace('Any quality weapon\/armor \+ Oil of Renewal \→ reroll item as superior', '任意品质 武器/护具 + 翻新油 → 重置物品为 超强')
    .replace('Upgrade to Magical Item', '魔法物品（蓝色）')
    .replace('Upgrade a plain superior item \(white or grey\) to a basic magical item.', '')
    .replace('Superior weapon\/armor \+ Oil of Enhancement \→ reroll item as magic', '白/灰 武器/护具 + 强化油 → 升级物品为 魔法物品')
    .replace('Reroll Magic to Honorific', '荣耀物品（绿色）')
    .replace('Honorific items are blank items that receive a double bonus from Mystic Orbs. This enables you to create your own custom items from scratch, provided you have some money to spend on the ingredients and the Mystic Orbs.',
        '')
    .replace('Magic weapon\/armor \+ Mark of Infusion \→ return item as honorific', '蓝色武器/护具 + 注入标记 → 升级物品为 荣耀物品')
    .replace('Honorific items have no modifiers, but have maximum sockets and receive a double bonus from Mystic Orbs.',
             '荣耀物品是一件没有词缀的装备，它强大的地方在于可以获得通灵宝珠的双倍加成和对应装备品阶的最大孔数。')
    .replace('Reroll any Item to Unique', '暗金装备')
    .replace('This powerful recipe uses the reagents obtained by disenchanting other uniques to turn any tiered item of your choosing into a unique. But choose wisely, because the crystals are precious and costly to replace.',
             '暗金装备属性词条拥有变量，可以通过多次重置来达到最佳变量，建议用在使用周期最长的品阶4物品上。')
    .replace('Any non-sacred item \+ Oil of Enhancement \+ Arcane Crystal x2 \→ reroll item as unique', '任意非神圣物品 + 强化油 + 奥术水晶 x2 → 重置物品为暗金')
    .replace(/Reroll Modifiers/g, '属性重置')
    .replace('These recipes reroll the properties and socket count on any superior item. This is useful to try and get better the superior bonuses on your item before making a runeword.',
             '该公式重置超强物品（白/灰）的词条属性和孔数。<br>通过反复使用该公式，达到想要的ED数值/最大孔/0孔，配合成功应用幸运油，真香，啪，真贵！<br>用于制作强大的神符之语底材。')
    .replace('Superior item \+ Oil of Renewal \→ reroll item', '超强的 武器/护具 + 翻新油 → 刷新属性')
    .replace("This recipe keeps the item level the same - unless it's over 99, in which case it reduces it to 99.", '该公式保持原有物品等级（iLv），但是iLv超过99级的话会降低到99。')
    .replace(/Rare Downlevel/g, '黄金物品降级')
    .replace('This recipe allows you to create yourself some baseline items. These items can be helpful to craft low-level items with space for Mystic Orbs.',
             '初期时为物品降级，为通灵珠宝留下更多等级空间，用途不大。')
    .replace("Rare weapon\/armor \+ rare amulet \+ rare ring \→ reroll item as level 1 rare item",
             '黄金武器/护具 + 黄金项链 + 黄金戒指 → 重置物品等级为 1')
    .replace("UPTIER RECIPE", '品级升级公式')
    .replace("UPGRADE ITEMS TO THE NEXT HIGHER TIER", '提升装备品级至更高一阶')
    .replace(/item tiers./g, '装备品级。')
    .replace("Uptiering an item increases its base statistics and maximum sockets but also increases requirements. These recipes cannot create Sacred items.",
             '提升装备的品阶和最大孔数，同时装备穿戴需求也会增加。这个公式无法创造神圣物品')
    .replace("This recipe works for tiered items of all qualities. If the item is unique, its stats will be upgraded to match the next tier on the",
             '该公式作用于所有品级装备，包括暗金，在暗金装备升阶时，各条属性同样会得到提升，可以参考')
    .replace(/\<\/a> page./g, '</a> 这个页面。')
    .replace("Non-sacred weapon\/armor \+ Arcane Crystal \→ reroll as next higher tier", '任意非神圣 武器/护具 + 奥术水晶 → 品级升阶')
    .replace(/AFFIX RECIPES/g, '物品词条配方')
    .replace("ENHANCE YOUR ITEMS WITH EXTRA MAGICAL BONUSES", '给装备添加大量魔法属性')
    .replace("Mystic Orbs add a magical bonus to an item at the cost of a higher required level to use the item. There are many known types sold by vendors, but rumours persist of lost ancient orbs with miraculous powers...",
             '商人处出售的通灵宝珠可以增加装备的固定属性，代价是提升的装备的等级需求，另外世界还会掉落一些商人处无法购买的强大宝珠。')
    .replace("Any equippable item \+ regular Mystic Orb \→ add orb bonus and \+4 required level",
             '任意可装备物品 + 通灵宝珠 → 装备附加宝珠词条且需求等级+4')
    .replace("You can only apply up to 5 of the same type of regular Mystic Orb to your item.", '同一属性宝珠在一件装备上最多可以使用 5 次。')
    .replace("The level requirement penalty is applied after taking into account both the base item required level and the level of any socket fillers. ",
             '通灵宝珠对装备的等级提升是基于装备的需求的等级，包括镶嵌物。<br>')
    .replace("This means for example if you have a belt with required level 20, add five orbs \(level penalty \+20\) and socket a Rha rune \(required level 100\), you get a belt with required level 100\+20 \= 120. ",
             '举个例子，你的腰带等级需求是20，然后MO了5颗通灵宝珠（等级要求增加20），然后又镶嵌了一枚Rha符文（需要等级100），那么腰带的等级要求为 100 + 20 = 120级。<br>')
    .replace("For that reason, to avoid going over required level 140 on accident, always add the socket fillers before adding orbs.",
             '这就意味着，你在MO装备时得计算好镶嵌之后的等级。')
    .replace(/Socket Punch/g, '打孔公式')
    .replace("Use this recipe to add extra sockets to an item. The more jewels you feed this recipe, the more sockets it will create.", '')
    .replace("Non-socketed item \+ jewel x\[1-6\] \→ returns item with \[1-6\] sockets",
             '无孔装备 + 珠宝 [ 1 - 6 ] → 装备 [ 1 - 6 孔 ]')
    .replace(/>Warning! </g, '>警告！ <')
    .replace("This recipe will not go over the max natural sockets an item can have. Lower tier items have a lower socket count. Excess jewels are wasted. You also cannot add more sockets to an item that already has some.",
             '装备根据类型和品级，最大孔数不同，投入超出最大孔数的珠宝，并不能打出更多的孔，并且多出的珠宝不会返还。<br>你无法在已经有孔的装备上使用这个公式。')
    .replace(/>Lucky Bonus/g, ' id="luckyb">幸运加成')
    .replace("This recipe grants one chance to add a minor extra bonus to an item. Any item that has been transmuted with this recipe will show up as",
             '该公式可以为装备增加一个额外的词条。<br>任何使用过该公式的装备会增加一个')
    .replace(/ class\=\"brightgreen\"\>Already upgraded\!\</g, ' style="color:#02c109;"> 已升级！<')
    .replace(/. Items marked as such cannot be used for this recipe./g, '的词条，被标记的装备无法再次使用同类升级公式。')
    .replace("Any item \+ Oil of Luck \→ returns item, may add bonuses", '任意装备 + 幸运油 → 装备附加词条')
    .replace("This recipe has 20% chance to add any of the following bonuses:", '该公式只有20%的成功几率，附加词条如下（and/or 的意思是多词条可能同时存在，也可能只有一条）：')
    .replace(/Magical Bonus/g, '魔法加成')
    .replace("In some of the more powerful areas, you might find the Oil of Conjuration, which is a concoction highly sought after by many mages. Any item that has been transmuted with this recipe will show up as",
             '在一些危险的区域，你会发现一种戏法之油 Oil of Conjuration，它是法师们的最爱。<br>任何使用过该公式的装备会增加一个')
    .replace("Any weapon \+ Oil of Conjuration \→ returns item, may add bonus", '任意武器 + 戏法之油 → 装备附加词条')
    .replace("This recipe has 40% chance to add the following bonus:", '该公式只有40%的成功几率，附加词条如下：')
    .replace("Adventurers say they have heard of powerful evil monsters creating these in locations such as the Icy Cellar, Abaddon, Pit of Acheron and Infernal Pit.",
             '危险区域：Icy Cellar（冰窖）, Abaddon（阿巴顿）, Pit of Acheron（阿切尔龙穴） 和 Infernal Pit（炼狱洞穴）。')
    .replace(/Lottery Bonus/g, '超级加成')
    .replace("This recipe works exactly like the lucky upgrade one, but it has only a 3% chance of adding the bonus. Any item that has been transmuted with this recipe will show up as",
             '跟上面两个公式一样，不过它更加强大，更加难得，需要与BOSS掉落的护符合成。<br>任何使用过该公式的装备会增加一个')
    .replace("Any Unique\/Set Weapon \+ Legacy of Blood", '暗金或套装武器 + 血之遗产')
    .replace("Any Unique\/Set Armor \+ Idol of Vanity", '暗金或套装护甲 + 虚荣雕像')
    .replace("Any Unique Amulet \+ Moon of the Spider", '暗金项链 + 蜘蛛之月')
    .replace("Any Unique Ring \+ Spirit Trance Herb", '暗金戒指 + 灵魂出窍药草')
    .replace("Any Unique Quiver \+ Azmodan's Heart", '暗金箭袋 + 阿兹莫丹之心')
    .replace("Any Unique Jewel \+ Sunstone of the Gods", '暗金珠宝 + 诸神的太阳石')
    .replace("returns item, may add bonuses", '装备附加词条')
    .replace("This recipe has 3% chance to add any of the following bonuses:", '该公式只有3%的成功几率，附加词条如下：')
    .replace("SHRINES AND CRAFTING", '圣坛和手工')
    .replace("CALL ON DIVINE FORCES TO CRAFT YOUR OWN ITEMS", '为自己创造独一无二的物品')
    .replace("In Nightmare and Hell difficulty, you may find blessed relics from the ancient labyrinth beneath Tristram, stolen before its collapse.",
             '')
    .replace("During those dark days the holy shrines in the cathedral's catacombs offered salvation to some adventurers and damnation to others; removed from their sockets, the enchanted crosses cannot permanently affect humans anymore, but their divine powers can",
             '')
    .replace("be applied to items.", '')
    .replace("There are 16 types of shrines with eldritch names. Beware, results may vary depending on divine will.", '总共有16种不同的圣坛，它们提供了不同的属性加成')
    .replace(/The following shrines exist:/g, '圣坛图鉴：')
	.replace(/Abandoned Shrine/g, '废弃圣坛 Abandoned Shrine ')
	.replace(/Creepy Shrine/g, '惊悚圣坛 Creepy Shrine')
	.replace(/Eerie Shrine/g, '可怖圣坛 Eerie Shrine')
	.replace(/Enchanted Shrine/g, '强化圣坛 Enchanted Shrine')
	.replace(/Fascinating Shrine/g, '迷人圣坛 Fascinating Shrine')
	.replace(/Hidden Shrine/g, '隐藏圣坛 Hidden Shrine')
	.replace(/Intimidating Shrine/g, '威吓圣坛 Intimidating Shrine')
	.replace(/Magical Shrine/g, '魔法圣坛 Magical Shrine')
	.replace(/Ornate Shrine/g, '华丽圣坛 Ornate Shrine')
	.replace(/Quiet Shrine/g, '静谧圣坛 Quiet Shrine')
	.replace(/Sacred Shrine/g, '神圣圣坛 Sacred Shrine')
	.replace(/Shimmering Shrine/g, '微光圣坛 Shimmering Shrine')
	.replace(/Spiritual Shrine/g, '精神圣坛 Spiritual Shrine')
	.replace(/Tainted Shrine/g, '污秽圣坛 Tainted Shrine')
	.replace(/Trinity Shrine/g, '三位一体圣坛 Trinity Shrine')
	.replace(/Weird Shrine/g, '怪异圣坛 Weird Shrine')
    .replace("Each shrine comes with 10 charges. Each use in the cube will drain one charge. When you use up the last charge, it disappears.",
             '每个圣坛掉落时都有10点能量，每次合成消耗一点，消耗完毕时，该圣坛便会消失。')
    .replace("Experiment, learn and create some of the most powerful items in all of Sanctuary.", '')
    .replace("Shrine Vessels can be right-clicked to collect all Shrines of the same type from the inventory, cube and stash.",
             '通过鼠标右击圣坛容器可以将所有相同类型的圣坛收集起来（背包、宝盒和仓库）')
    .replace(/Shrine Vessels/g, '圣坛容器')
    .replace("Carrying many holy relics can be a burden. Store your full shrines into a corresponding holy vessel that can hold up to 1000 shrines:",
             '使用下列公式将相同容器堆叠，以免占用太多仓库容量，最高堆叠上限：1000')
    .replace("Shrine \(10\) \+ Oil of Craft \→ Shrine Vessel", '圣坛（10）+ 锻造油 → 圣坛容器')
    .replace("Shrine Vessel \+ any amount of Shrines \(10\) \→ Shrine Vessel \(adds shrines\)", '圣坛容器（n） + 圣坛（10）x X → 圣坛容器（n + X）')
    .replace("Shrine Vessel \→ Shrine Vessel \(-1\) \+ Shrine", '圣坛容器（ X ） → 圣坛容器（X - 1）+ 圣坛（10）')
    .replace("Shrine Crafting", '圣坛手工')
    .replace("Use a shrine to turn any sacred item into a powerful crafted item. The crafted item comes with several random rare modifiers and additional preset modifiers based on shrine type. The preset modifiers may stack with the rare modifiers, creating some very powerful items.",
             '使用圣坛创造的手工物品，拥有随机添加的词条（基于物品iLv）和圣坛固定的词条加成，因为随机的性质，它可能会变得非常强大。')
    .replace("Rare\/Crafted Sacred item \+ Shrine \→ reroll item as crafted \+ Shrine \(-1 charge\)",
        '黄金/手工 神圣装备 + 圣坛（n） → 重置手工装备属性 + 圣坛（n - 1）')
    .replace("Crafted items always have maximum sockets.", '手工装备拥有装备最大孔数。')
    .replace(/Shrine Blessing/g, '圣坛洗礼')
    .replace("A variant of shrine crafting, this recipe allows you to impart the blessings of the shrine unto an existing sacred item. This adds to the item the same preset shrine modifiers as the shrine crafting recipe and also subtracts 1 charge. You can only use this recipe once per item, so choose your shrine wisely.",
             '除了制作手工神圣物品，圣坛还可以给神圣物品祝福，将圣坛的固定词条添加到装备上，装备只能使用一次圣坛祝福。')
    .replace("Rare\/Crafted\/Honorific Sacred item \+ Shrine \+ 2x Arcane Crystal \→ add shrine bonuses \+ Shrine \(-1 charge\)",
        '黄金/手工/荣耀 神圣装备 + 圣坛 + 奥术水晶 x2 → 装备增加圣坛词条 + 圣坛（次数 -1）')
    .replace("JEWELCRAFTING", '手工珠宝')
    .replace("CREATE YOUR OWN JEWELS", '')
    .replace("Jewelcrafting", '')
    .replace("You can craft jewels as well, for an even higher degree of customizing your items.", '手工珠宝可以通过符文增加固定词条，从而更好的定制你的装备属性。<br>')
    .replace("The crafted jewel comes with a few random rare modifiers and always gets all preset modifiers based on the used rune.", '除了符文带来的固定词条外，还会增加随机词条，这将可能造就非常鬼酷的属性。<br>')
    .replace("The preset modifiers may stack with the rare modifiers, creating some very powerful jewels.", '不像圣坛装备，做手工珠宝使用的符文不会被消耗掉，另外，镶嵌前别忘了使用对它使用<a href="#luckyb">幸运油</a>。')
    .replace("Jewel \+ Rune \+ Oil of Craft \+ Arcane Crystal\/Shards \→", '珠宝 + 符文 + 锻造油 + 奥术碎片/水晶 →')
    .replace("Rune \+ Arcane Shards \(-1\) \+ Crafted Jewel with added bonuses", '符文 + 奥术碎片（-1）+ 手工珠宝')
    .replace("Every time you craft a Jewel, its item level is reduced by 5%, rounded up and capped at 1 and 99.", '每洗一次属性,珠宝的iLv会降低 5%，由于词条和iLv有关，所以洗几次没有好属性，就可以换珠宝了。')
    .replace("The preset modifiers on the jewel depend on the rune used, as follows:", '符文带来的固定词条属性如下：')
    .replace("MISCELLANEOUS RECIPES", '其他配方')
    .replace("EVERYTHING ELSE", '')
    .replace("Gem Upgrade", '宝石升级')
    .replace("You can upgrade gems to the higher quality levels. Note that unlike classic Diablo II, this recipe only requires two gems, not three.",
             '你可以将宝石升级到更高一级。跟原版不一样的是，只需要两颗相同等级的即可升级，而不用三颗。')
    .replace("Same gem x2 \→ next higher gem quality", '相同宝石 x2 → 更高一级的宝石')
    .replace("Rune Upgrade\/Downgrade", '符文升级和降级')
    .replace("You can upgrade or downgrade runes to the next higher or lower rune. This is useful when you need a certain exact rune to create a runeword.",
             '符文可以升级和降级,这个公式便于你得到你需要的。')
    .replace("Same rune x2 \→ rune one level higher", '相同的符文 x2 → 符文升级')
    .replace("Same rune x4 \→ rune two levels higher", '相同的符文 x4 → 符文升2级')
    .replace("Same rune x2 \+ rune one level higher \→ rune two levels higher", '相同的符文 x2 + 更高一级的符文 → 符文升2级')
    .replace("Rune \→ rune one level lower", '符文 → 符文降级')
    .replace("These recipes do not allow you to obtain or downgrade:", '你无法将此配方应用于下列符文上（超过50号）：')
    .replace(/Great Runes/g, '超强符文')
    .replace(/Elemental Runes/g, '元素符文')
    .replace(/Unsocket Recipe/g, '取出镶嵌物')
    .replace("These recipes separate the socket fillers \(gems, jewels, runes\) from an item and return both the item and the socket fillers.",
             '该公式允许玩家取出装备中的镶嵌物（珠宝、宝石和符文），并保留装备。')
    .replace("Magical, Rare, Set, Unique, Crafted or Honorific:", '魔法，黄金，套装，暗金，手工或者荣耀装备：')
    .replace("Socketed item \+ Oil of Disjunction \→ separate item and socket fillers", '已镶嵌装备 + 分离油 → 未镶嵌装备 + 镶嵌物')
    .replace("Non-magical:", '灰色装备：')
    .replace("Socketed item \+ Oil of Disjunction \+ perfect gem x3 \→ separate item and socket fillers", '已镶嵌装备 + 分离油 → 未镶嵌装备 + 镶嵌物')
    .replace("Non-magical socketed items are grey, and therefore include runewords. The price is higher for these items to prevent unhealthy amounts of runeword rerolling.",
             '灰色物品通常用于神符之语，所以增加了宝石需求，使重置神符之语变量的难度提高。')
    .replace(/R.I.P. Recipe/g, 'R.I.P. 配方（杀死怪物恢复平静）')
    .replace("If you went wild with reanimate items and now you can\'t see the forest for the reanimated Ents, this recipe can help. It adds the \'R.I.P.\' modifier to an item, causing your kills to stay dead instead of rising up to get in your way. This should help out players with slower computers.",
             '使用该公式，将不会复生任何怪物，关爱老旧电脑，人人有责。')
    .replace("Any item \+ Oil of Renewal \+ Arcane Crystal \→ returns item with R.I.P. modifier",
             '任意装备 + 翻新油 + 奥术水晶 → 装备增加 R.I.P.词条')
    .replace("This recipe adds the following bonus:", 'R.I.P.词条的含义是：')
    .replace(/Slain Monsters Rest in Peace/g, '杀死怪物恢复平静（超度尸体，无法使用复生、尸爆等技能）')
    .replace("Do not forget the Arcane Crystal or you will destroy more than you bargained for.", '<span style="color:red;">千万别忘了放奥术水晶，否则你会直接将装备重置为非魔法（引起舒适）</span>。')
    .replace(/Cow Level Portal/g, '秘密奶牛关卡')
    .replace("Moo! You need to stand in the Rogue Encampment in Hell difficulty to use this recipe. Be careful, the cows have been beefed up compared to the regular Diablo II.",
             '哞哞哞！在地狱难度下的罗格营地使用该配方。<br>注意！这里的牛都经过了强化。')
    .replace("Wirt's Leg \→ Cow Level portal", '维特之腿 → 奶牛关红门')
    .replace("Killing the Cow King does not disable this recipe.", '奶牛之王随便杀，不影响你开门。')
    .replace("Want to show the common rabble in your game how rich and powerful you are\? This recipe consumes some of the rarest trophies in the game and returns a completely useless item that grants you a glowing red aura. Show it to friends and strangers so they know that you are strong, powerful and wealthy enough to waste trophies on a worthless item.",
             '这个公式消耗了几件极难获得的奖杯来制造一个没有任何属性的物品，带着这件物品会使你发出红色的光芒，去别人的房间里展示吧，你这个超级肝帝！')
    .replace("See the Uberquests section for more information.", '')
    .replace("Yshari Sanctum Trophy \+ Void Trophy \+ Uldyssian Trophy \+ Vial of Elder Blood \→ I Am Rich Gem",
             'Yshari Sanctum的奖杯 + Void的奖杯 + 乌迪贤的奖杯 + 长老之血 → 我他妈贼有钱之石')
    .replace("I Am Rich", '马云公式')
    .replace("This recipe is inspired by the \$1000 iPhone application that does nothing.", '灵感来源于价值1000美元屁用都没的APP。')


//任务
    //等级挑战
    .replace("After killing the Infernal Contraption in Normal difficulty, enter the portal to access Tran Athulua, here begins Level Challenge 1.", '普通难度下杀死炼狱装置（Act 5 巴尔前最后一波怪），开启红门后进入阿苏拉城（妹子岛 伪）。 ')
    .replace("Find and defeat the three Priestesses. Each will drop a shard of her respective element.", '找到并杀死三个祭司，分别会掉落火焰、冰冷和闪电碎片。')
    .replace("Cube all three shards below level 60 to create the Sunstone.", '将三枚元素碎片合成得到太阳石（60级以内）')
    .replace("Sunstone of the Twin Seas", 'Sunstone of the Twin Seas<br>双子海的太阳石')
    .replace("Although the level can be accessed at level 45, you cannot cube the shards together until at least level 50.", '该场景最低进入等级为45级，但合成需要等级为50级。')
    .replace("If you are past level 59, you can still do the challenge, but with the added penalty of 2 Arcane Crystals per 10 levels.", '<br>如果你已经超过了59级，虽然可以继续挑战并合成，但每超过10级，合成时就需要花费额外2枚奥术水晶。')
    //恩奈德挑战
    .replace("MINIMUM LEVEL 80", '挑战需要等级 80')
    .replace("Access this challenge through killing Mephisto in Nightmare Difficulty, and kill an Ennead Necromancer boss to obtain a", '噩梦难度下杀死 Act3 Boss 墨菲斯托，开启红门后进入库拉斯特3000BA（k3k 伪），杀死任意一个恩奈德死灵法师（分别在地图中3个边缘处）会掉落一个')
    .replace("Heroic Torch", '英雄火炬')
    .replace("Place this torch in the Horadric Cube and transmute to receive your class charm.", '将火炬单独合成，将得到你的角色护身符')
    .replace("Your class charm adds the following bonuses depending on your class:", '各职业角色护符属性如下：')
    .replace(/Unlocks your Ennead Skill/g, '解锁你的恩奈德技能')
    .replace("Your free bonus skill", '解锁你的新技能')
    .replace(/Keep in Inventory to Gain Bonus/g, '护符 - 放入背包生效')
    .replace(/<\/u>: uses /g, '专属<\/u>: ')
    .replace("Sacred Sunstone", '神圣太阳石 Sacred Sunstone')
    .replace("Shadow Vortex", '暗影涡流 Shadow Vortex')
    .replace("Worldstone Orb", '世界之石之球 Worldstone Orb')
    .replace("Caoi Dulra Fruit", '草杜拉的水果 Caoi Dulra Fruit')
    .replace("Soulstone Shard", '灵魂石碎片 Soulstone Shard')
    .replace("Eye of Divinity", '圣力之眼 Eye of Divinity')
    .replace("Nexus Crystal", '枢纽水晶 Nexus Crystal')
    .replace("This skill can be found at the top right of your first skill tab. When you complete this uber, keep the charm in your inventory. This allows you to put skill points into the skill.", '')
    .replace("This skill can be found at the top left of your first skill tab. When you", '该技能位于技能书奖励标签的左上角。')
    .replace("complete the Ennead Challenge and receive your class charm and keep it in your", '完成挑战并将得到的角色护符放在背包内，')
    .replace("inventory. This allows you to put skill points into the skill.", '即可解锁技能。')
    .replace("Ennead Challenge", '恩奈德挑战')
    .replace("SPELLBIND", '法术缠绕<br>SpellBind')
    .replace("The basilisk snake of Skartara is a devious creature whose bite turns flesh to stone. A skilled amazon warrior may carry a few to the battlefield in a leather bag for an unexpected surprise.", '诅咒 - 扔出使敌人石化的蛇群')
    .replace("Effect: throws snakes that turn enemies to stone", '--- 你们都是石头人，不许说话不许动。')
    .replace("PRISMATIC CLOAK", '棱镜斗篷<br>Prismatic Cloak')
    .replace("Dancing on the edge of shadow and playing with the light allows the assassin to weave a protective magical cloak.", '被动 - 获得魔法和物理伤害抵抗（Flat Mr/Dr），并且给天赋技能浴血提供部分抵抗效果')
    .replace("physical damage", 'physical Damage')
    .replace("Passive effect: increases magical and physical Damage reduction, and provides similar bonuses to Bloodbath", '--- 出自黑暗，匿于光明，你们谁都看不见我。')
    .replace("Passive effect: avoids damage", 'Passive effect: avoids Damage')
    .replace("IMMORTAL", '不朽<br>Immortal')
    .replace("Passive effect: avoids Damage when standing still and improves hit recovery", '--- 来啊，正面刚啊，谁动谁就是孙子。')
    .replace("Running away is for the weak. A barbarian warrior who runs is easy prey. One who stands his ground in the face", '被动 - 当你站着不动的时候，获得更高的闪避和击中回复')
    .replace("of death may survive, for he is the one the ancestral spirits will favour.", '')
    .replace("LIFESHIELD", '生命之盾<br>Lifeshield')
    .replace("The fruits of the Glor-An-Fhaidha, the mystical tree of life, can bring back mortals from the brink of", '被动 - 增加大量的生命值和防御')
    .replace("death. Aside from their healing effect on humans and other animals, the juice of the Glor-An-Fhaidha's", '')
    .replace("fruits can be applied to armour, making it as hard as the bark of a thousand year tree.", '')
    .replace("Passive effect: provides a bonus to maximum life and defense", '--- 安静的做一棵大树。')
    .replace("TALON'S HOLD", '利刃之握<br>talon\'s hold')
    .replace("Fallen enemies of the Cult may see the error of their ways when they stand before the Dragon God on the plane of the dead. Trag’Oul sometimes grants the gift of unlife to his new converts..."
             , '被动效果 - 减速怪物，并有几率将其复活为 拉马斯祭司')
    .replace("Passive effect: slows targets and reanimates the dead as Rathma Priests", '--- 是的，怪物也不许动！')
    .replace("DIVINE APPARITION", '神圣显现<br>Divine Apparition')
    .replace("Like a deus ex machina, the paladin of Zakarum descends upon the battlefield, his mere appearance chilling his", '效果 - 瞬移并冻结目标附近怪物')
    .replace("heathen enemies to the bone.", '')
    .replace("Effect: teleport to target location and freeze enemies", '--- 我没动，我用的瞬移。')
    .replace("SYMBOL OF ESU", '艾苏的符号<br>Symbol of Esu')
    .replace("The symbol of the ancient witch queen is a specially crafted conductive adamantine moon crescent that", '效果 - 使用红蓝药合成的月牙符号，在使用时立即恢复')
    .replace("accumulates ambient energy from the magic in the environment, releasing it as a healing pulse when broken.", '')
    .replace("Effect: create a symbol in the cube that instantly heals life and mana", '--- 吃块饼干看楼上的傻子们。')
    .replace("Reward:", '奖励：')
    .replace("Level Challenge ", '等级挑战')
    .replace("MINIMUM LEVEL 45", '挑战需要等级 45')
    .replace("Veteran Tokens", '角色护符的提升')
    .replace(/In </g, '在<')
    .replace(/Nightmare and Hell/g, '噩梦和地狱')
    .replace(" difficulties, you can find <b>veteran monsters<\/b> near the end of each Act. There", '难度，你能在每关靠近关底的随机地点寻找到一种名字是绿色的怪物，每关一种，一共5种。')
    .replace("are 5 types of veteran monsters, one for each Act.", '')
    .replace("Kill them and receive an 'Evil Eye' token.", '杀死它们以获得它们的眼球。')
    .replace("Veterans", '它们分别是<br>')
    .replace("Clawstorm Terror", 'Act1 - 利爪风暴<br><img src="https://forum.median-xl.com/images/monsters/ClawstormTerror.png"><br>位置：监牢第一层至关底<br>')
    .replace("Fairy Witch", 'Act2 - 精灵巫师<br><img src="https://forum.median-xl.com/images/monsters/FairyWitch.png"><br>位置：推荐刷术士峡谷<br>')
    .replace("lowing Blob", 'Act3 - 光斑<br><img src="https://forum.median-xl.com/images/monsters/LowingBlob.png"><br>位置：推荐刷崔凡克<br>')
    .replace("Landmass", 'Act4 - 地皮<br><img src="https://forum.median-xl.com/images/monsters/Landmass.png"><br>位置：火焰之河至关底<br>')
    .replace("Bane Hunter", 'Act5 - 灾厄猎人<br><img src="https://forum.median-xl.com/images/monsters/BaneHunter.png"><br>位置：亚瑞特巅峰杀完3爹进门后搜寻至关底')
    .replace("\[Class Charm\] \+ each of the 5 tokens → returns \[Class Charm\] with added bonuses", '角色护符 + 5种不同的眼球 → 角色护符升级版')
    .replace(/This upgrade recipe adds the following bonuses:/g, '升级后会增加下列属性：')
    .replace(/to \[Your class\] Skill Levels/g, '[你的职业]技能等级')
//Boss战

    .replace("Dungeons are quest-like zones which usually consist of defeating a boss for a unique charm reward.",
             'Boss挑战通常是在一个特定的区域进行，每个BOSS都会掉落独特的暗金护符作为奖励')
    .replace("Certain bosses may also drop a trophy fragment for additional upgrades, but they are rare."
, '一些Boss还会掉落额外的奖杯，可以与护符合成获得额外属性，但是掉落几率很低。')
    .replace("smallbonus", 'small bonus')
    .replace(/chance to drop a trophy fragment on Hell difficulty./g, '的机会掉落一个奖杯 。')
    .replace(/Maximum Skill Level Increased by/g, '技能等级上限提高')
    .replace("4>Horror Under Tristram", '4>崔斯特姆地下的恐惧')
    .replace("Butcher's Lair \(Act 1: Tristram\)", '屠夫的巢穴 ( Act1 ➤ 石块旷野 ➤ 崔斯特瑞姆 ➤ 西北角的屋子内，无红门，鼠标移动到屋子内可见入口 )<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44318356/">av44318356</a>')
    .replace("A bloated and grotesque creature, the Butcher was a sadistic being that relished in the torture and pain of others. It hunted endlessly for fresh meat.", '')
    .replace("Although retellings of the Darkening of Tristram describe how the Butcher was defeated deep within the Labyrinth, the horrific culling of the city in recent times, following the Dark Wanderer's wake, seems to have stirred this malevolent spirit back to evil once more.", '略')
    .replace("The Butcher is a strong melee fighter. His tainted cleaver hits hard and just like in the Tristram Cathedral, he will hunt you down.", '屠夫是一个强大的狂战士，使用他的杀猪刀摧毁面前的一切事物。')
    .replace("Upon striking you or a minion, he has a chance to incite a Bloodlust which fuels Sacrificial Shrines into emitting heavily damaging shockwaves.", '屠夫每次击中都有机会给四周的祭坛充能，被充能的祭坛则会射出一道破坏性的冲击波。')
    .replace("And to boot, he also is considerably tanky.", '充能成功时，屠夫也会变的更硬。')
    .replace("Defeat the Butcher on Hell difficulty to get", '击败屠夫可获得')
    .replace("The Butcher's Tooth<\/span>.<\/p>", '屠夫的牙齿</span>.</p>')
    .replace("The Butcher's Tooth", '屠夫的牙齿<br>The Butcher\'s Tooth')
    .replace(">Infernal Machine", '>炼狱生成器')
    .replace("Infernal Cave \(Act 1: The Pit\)", '狱火洞穴  ( Act1 ➤ 泰摩高地 ➤ 洞穴 ➤ 狱火洞穴 )<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44318356/?p=2">av44318356</a>')
    .replace("Who knew the fallen clans were technologically adept? This rickety contraption contains wooden clockwork", '')
    .replace("mechanisms and the necessary runes to open a gateway to any location in the Burning Hells and protect", '')
    .replace("itself against any attackers. This enables it to summon hellish creatures at a rapid rate and strike", '')
    .replace("enemies down with powerful rune magic upon being attacked. Move quickly, because time is against you.", '略')
    .replace("The tower summons a selection of dangerous elite monsters. Try to reach it as quickly as possible, avoiding", '这家伙会不停召唤精英级别的怪物，你必须快速接近并杀死它。')
    .replace("or teleporting past elites. Beware the elites with a slowing attack: Marbled Frog and Basilisk", '小心那些带控制的怪物：绿蛤蟆、BUG蛇和突脸人马，还有伤害巨高的大型化身火球怪。')
    .replace("Defeat the Infernal Machine on Hell difficulty to get the", '击败炼狱生成器可获得')
    .replace("Optical Detector<\/span>.<\/p>", '光学检测器</span>.</p>')
    .replace("Optical Detector", '光学检测器<br>Optical Detector')
    .replace(">Death Projector", '>死亡发射器')
    .replace("The Proving Grounds \(Swampy Pit - Flayer Jungle\)", '试验场 (Act3 ➤ 剥皮丛林 ➤ 沼泽地洞 ➤ 试验场)<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44318356/?p=3">av44318356</a>')
    .replace("The Swampy Pit serves as testing grounds for Mephisto\'s latest siege weapon. The Death Projector", '')
    .replace("slowly rotates, firing a devastating energy beam in a full circle, annihilating anything in its path.", '略')
    .replace("The siege tower is tended to by trained Zakarumite techpriests. Its magitech shield is impenetrable", '由一群专业萨卡兰姆技术人员维护的机器，会顺时针发射毁灭性的射线。')
    .replace("to all weapons, but when it senses a Mechanic nearby, it lowers its shield to enable maintenance. In", '机器本身免疫武器伤害，但是当技术人员在附近时，它会卸下护盾以便于维护。')
    .replace("this state, the Death Projector can be damaged, though its fortified outer shell still harmlessly deflects", '')
    .replace("a percentage of all incoming attacks. The Mechanics themselves carry portable gap generators and are", '')
    .replace("impossible to hit or kill. Damage the Death Projector while avoiding Mechanics until the devilish device", '这帮技工随身携带了光学偏转装置，使得他们无法被选中。')
    .replace("finally falls.", '<br>绕圈躲避死亡射线，保持萨卡兰姆在机器附近，然后利用你的输出技能在躲避伤害的同时对机器造成伤害。')
    .replace("Defeat the Death Projector on Hell difficulty to get the", '击败死亡发射器可获得')
    .replace("Laser Focus Crystal<\/span>.<\/p>", '激光对焦水晶</span>.</p>')
    .replace("Laser Focus Crystal", '激光对焦水晶<br>Laser Focus Crystal')
    .replace(">Assault on Mount Arreat", '>亚瑞特圣峰之战')
    .replace("Arreat Summit \(Act 5: Arreat Summit\)", 'Act5 ➤ 远古之路 ➤ 亚瑞特山脉之巅')
    .replace("In ages past, Diablo himself attempted to invade Mount Arreat to destroy the Worldstone and was repelled", '')
    .replace("by the Bear tribe defenders and their king, the shaman Koth. This is a reenaction of that battle", '')
    .replace("on the peak of Mount Arreat, with you as Diablo.", '略')
    .replace("<i>Kill Narthal to open a portal to the old Arreat Summit.</i>", '杀死3爹的守卫 那骚儿（Narthal）开启红门去回顾那一场远古的战役<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44420526">av44420526</a>')
    .replace("The Bear Shamans wield the Hawk Talons ability, a trap which releases axes, the ability to cast a Guard Tower, as well as throwing axes at the player. Thanks to their connection to the primal forces, all shamans have an innate 50% resistance to all.",
             '<br>野熊萨满们会用飞斧击晕你，还会释放警戒塔。你需要逐个击败这些强大的敌人，他们拥有50%的所有抗性。<br>Boss科什大王，挥舞着双剑，除了飞斧之外，还会释放警戒塔的群体版本（堡垒）。如果没有足够的打击恢复能力，可能会比较难打。')

    .replace("King Koth, on the other hand who wields dual swords, can also cast Hawk Talons, but instead of Guard Tower, he casts Fortress.", '')
    .replace("In many aspects this is the physical version of the Tal Rasha fight.", '')
    .replace("Defeat King Koth on Hell difficulty to get the", '击败科什大王可获得')
    .replace("Sacred Worldstone Key<\/span>.<\/p>", '神圣世界之石钥匙</span>.</p>')
    .replace("Sacred Worldstone Key", '神圣世界之石钥匙<br>Sacred Worldstone Key')
    .replace(">The Binding of Baal", '>巴尔的束缚')
    .replace("Act 2: Tal Rasha's Tomb", 'Act2 ➤ 都瑞尔的房间外')
    .replace("Kill Zoltun Kulle to open a Portal to the old Canyon of the Magi.", '杀死佐顿库勒开启红门去回顾塔拉夏与巴尔的战斗<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44420526/?p=2">av44420526</a>')
    .replace("Reenact the capture and imprisonment of Baal by Tal Rasha and his Horadrim, with you playing the", '')
    .replace("role of Baal. To protect their leader, the Horadrim weave warding spells that make Tal Rasha immortal", '')
    .replace("until the last of his soldiers has died and their spirits have faded.", '略')
    .replace("During this uberquest, you morph into Baal when you are near Tal Rasha. The archmage himself is immune", '玩家扮演巴尔与塔拉夏率领的赫拉蒂姆法师们战斗。')
    .replace("to all damage until you get rid of all Horadric Mages. Even then, Tal Rasha has a phasing spell that", '古老的法师们会施放闪电和火焰法术，并拥有50%的伤害免疫，')
    .replace("negates a percentage of incoming attacks and their elemental affinity grants all mages 50% resistance", '当赫拉蒂姆法师存在时，塔拉夏处于无敌状态。')
    .replace("to all. Being magical in nature, the shield aura is vulnerable to resistance breaking spells, offering", '杀死所有的法师，然后再去刚塔拉夏。')
    .replace("the hero another way to deal with Tal Rasha. Beware the Horadrim's fire and lightning spells, empowered", '')
    .replace("with ancient metamagic to bypass up to 30% of your resistances, Tal Rasha able to bypass 40%.", '')
    .replace("Defeat Tal Rasha on Hell difficulty to get the", '击败塔拉夏可获得')
    .replace("Scroll of Kings<\/span>.<\/p>", '王者卷轴</span>.</p>')
    .replace("Scroll of Kings", '王者卷轴<br>Scroll of Kings')
    .replace("4>Akarat", '4>阿卡拉特')
    .replace(/<br>Torajan Jungles/g, '<br>托拉然丛林（Act3 ➤ 营地内东南方铁匠下面红门 ➤ 托拉然丛林）<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44420526/?p=3">av44420526</a>')
    .replace("Akarat the Prophet is the name of the ascetic who founded the religion and customs of the Zakarum Church. ", '')
    .replace("It is said that he did so after the visit of Archangel Yaerius in his dreams. Moved by what he\'d seen, Akarat set out", '')
    .replace("on a grand journey to the cities of Kehjistan, intent on enlightening his fellow men about the divine Light he claimed", '')
    .replace("existed within everyone. However the prophet\'s legacy is clouded with uncertainties and it is said that one day he simply", '')
    .replace("disappeared in the jungles of Kehjistan. While his teachings had left their mark, they would flounder in obscurity for a millennium.", '略')
    .replace("The corrupted spirit of Akarat is protected by heavenly invulnerability and is impossible to attack", '')
    .replace("directly. Remember that a religion is nothing without followers, therefore strike down his surrounding apostles first.", '')
    .replace("The death of one of his apostles unleashes a wave of holy energy, reducing all resistances of other", '')
    .replace("apostles to -100% and breaking the immunity shield of Akarat himself, reducing all resistances to", '')
    .replace("0% for a few precious seconds. This does however enrage them and they will attack you with renewed", '')
    .replace("vigour. Killing an apostle may be difficult due to the mass healing spell they cast when low on health,", '')
    .replace("as well as the storm of magical hammers with which they pummel you from a distance and their ability", '')
    .replace("to heal when they slay a minion or hero. Akarat himself is blessed in another way as well: the spirits of the", '')
    .replace("Light repel a percentage of all incoming attacks.", '在丛林的最东方，阿卡拉特带领他的信徒们驻扎于此，他有一个无敌BUFF，杀死他的白衣教众可以短暂的破除他的BUFF，你必须在几秒内杀死他，否则他会再次无敌并释放治疗法术快速恢复，如果伤害不够，可以试着雇佣Act 3的瘟疫法师协助你完成这个任务。')
    .replace("Defeat Akarat on Hell difficulty to get the", '击败阿卡拉特可获得')
    .replace("Visions of Akarat", '阿卡拉特的视界')
    .replace("4>Lord Aldric Jitan", '4>领主艾德瑞克·吉坦')
    .replace("Driven mad by nightmares, the Western aristocrat Lord Aldric Jitan hopes to summon a terrible demon", '')
    .replace("and plunge the land into darkness. Stop him before he succeeds.", '略')
    .replace("The guardsmen are tougher than anything that came before and will inflict tri-elemental"
, '现在这群佣兵比以往任何时候都要强大，他们造成三系元素伤害。<br>')
    .replace("The demonic powers guiding his actions imbue him and his guardsmen", '')
    .replace("with 50% all resistances and the ability to harmlessly deflect a percentage of incoming attacks.", '')
    .replace("The guardsmen are tougher than anything that came before and will heal themselves, inflict tri-elemental", '')
    .replace("damage and summon guard towers that will pummel the living daylights out of you if you stand still", '')
    .replace("for too long. Keep moving and the towers will vanish behind you.", '在丛林的中上位置，领主吉坦带着一群流浪的佣兵驻扎于此，这些敌人会施放箭塔技能，无数的箭塔可以造成巨量伤害，你可以选择逐步清理过去或者通过走位将小兵甩在身后，只是需要耗费一些时间。')
    .replace("Defeat Lord Aldric Jitan on Hell difficulty to get the", '击败吉坦领主可获得')
    .replace("Moon of the Spider<\/span>.<\/p>", '蜘蛛之月</span>.</p>')
    .replace('unique">Moon of the Spider', 'unique">蜘蛛之月<br>Moon of the Spider<br>（奖杯：增强武器伤害 25%）')
    .replace("4>Horazon\'s Sanctum", '4>霍拉松的圣所')
    .replace("Dimensional Sanctum \(Act 3: Caldeum\)", '次元圣殿 (Act 3 ➤ 库拉斯特下层门口杀死狗头怪头目 Vizier ➤ 红门进卡尔蒂姆(记得点开小站) ➤ 次元圣殿(东南角))<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44420526/?p=4">av44420526</a>')
    .replace("Horazon the Summoner, in his arcane sanctuary, summoned a mighty demon lord imbued by a power so strong that it was quickly able to overwhelm the sorcerer. ", '')
    .replace("Horazon, unable to defeat the demon without paying with his life, managed to trap the creature in the farthest reach of his sanctuary and split off the prison zone from the rest of the structure banishing it under the earth where it now sits in a containment dimension. Breaking in and defeating the demon may yield great rewards.", '略')
    .replace("Kill the Vizier in the Lower Kurast entrance and open a Portal to Caldeum", '')
    .replace("Heed the familiar\'s holographic warning. The Creature of Flame, although not very strong on its own, has the ability to open", '')
    .replace("Dimensional Rifts, summoning demons from the depths of hell. If unprepared, the player can become overwhelmed.", '')
    .replace("Not only can it open rifts, but can defend itself with a mortar attack and Lava Pit.", '霍拉松在此地囚禁了一只火焰生物（冒着白色雾气的BOSS）,挺简单的，就是跑来跑去有点烦，另外还会施放次元之门召唤精英怪物，没什么提示，干就完了。')
    .replace("Defeat the Creature of Flame on Hell difficulty to get", '击败火焰生物可获得')
    .replace("Horazon\'s Focus<\/span>.<\/p>", '霍拉松的瞩目</span>.</p>')
    .replace("Horazon\'s Focus", '霍拉松的瞩目<br>Horazon\'s Focus')
    .replace("4>Black Road", '4>黑暗之路')
    .replace("Church of Dien-Ap-Sten \(Act 1: Bramwell - Rogue Encampment\)", '迪纳普斯登教堂（Act 1 ➤ 瓦瑞夫旁边大车进布兰威尔 ➤ 迪纳普斯登教堂 Church of Dien-Ap-Sten）<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44511477">av44511477</a>')
    .replace("The now former acolyte of the Zakarum-priesthood Buyard Cholik, facing the limits of his own mortality, slowly", '')
    .replace("started despising the so called \"Religion of the Light\", regretting all the years he faithfully devoted to the Zakarum", '')
    .replace("order which was now exposing all of its frailty while confronting the wicked intents and machinations of the Lord of Hatred", '')
    .replace("himself.	Buyard Cholik, fueled by an evergrowing thirst for knowledge related to the pursuit of eternal life, eventually,", '')
    .replace("came to know about the powerful and mighty demon Kabraxis. Inebriated by the promise of immortality, the former Zakarum", '')
    .replace("priest joined forced with Kabraxis the Thief of Hope, becoming an anchor for the banished demon between his prison realm", '')
    .replace("and the mortal plane. Thus Buyard Cholik started preparing Sanctuary for the demon's coming establishing a new cult", '')
    .replace("dedicated to the prophet Dien-Ap-Sten, Kabraxis in disguise, wearing the new title of \"Wayfinder\" for his followers", '')
    .replace("and creating the first church of the Way of Dreams in the ancient city of Bramwell, from where he plan to extend", '')
    .replace("his foul influence on the whole region.", '略')
    .replace("Buyard is a primarily fire based caster whose Ultimate skill is the ability to summon a horde of possessed cultists to swarm you. ", '')
    .replace("To damage Buyard, he must be in the fire circle in the middle of his room, but beware of one of his attacks that makes that circle treacherous to enter.", '邪恶主教拜耶德.邱力克会使用火焰法术和召唤邪教徒，只有在房间中央的火圈内他才会受到伤害。')
    .replace("Killing Buyard Cholik gives you", '击败拜耶德.邱力克可获得')
    .replace("The Black Road<\/span> ", '《黑暗之路》</span>')
    .replace("charm which allows you to unlock your Black Road skill.", '，这个护符解锁了你的黑暗之路技能（技能树奖励页面右上角技能）')
    .replace("The Black Road", '《黑暗之路》<br>The Black Road')
    .replace("Unlocks your Black Road Skill", '解锁黑暗之路技能')
    .replace("4>Legacy of Blood", '4>血之遗产')
    .replace("Chamber of Blood \(Torajan Jungles\)", ' (Act3 ➤ 托拉然丛林小站 ➤ 往西走，位于丛林中下部 ➤ 鲜血之厅（入口是个地窖）)<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44790105">av44790105</a>')
    .replace("Bartuc, the Warlord of Blood, was once Horazon\'s brother in the Vizjerei mage clan. Whereas Horazon", '')
    .replace("wanted to summon demons to enslave them, Bartuc chose to worship them and traded his soul for demonic", '')
    .replace("power. Their conflict eventually led to a civil war that shattered the mage clan. Although Bartuc", '')
    .replace("was eventually destroyed by the very powers he sought to control, his soul and power have been claimed", '')
    .replace("by the forces of Hell. It may be possible to find Bartuc\'s spirit in the crypt where his cursed", '')
    .replace("armour was buried...", '略')
    .replace("Bartuc and his summoned Blood Golems have ranged attacks and can hurt a lot in this tiny room. Protected", '')
    .replace("by the power of his cursed armour, Bartuc and his golems are invulnerable to damage. However, his", '')
    .replace("Wychwind blade throw requires him to concentrate on the spell and drop his resistances for a brief", '')
    .replace("time, and his dimwitted golems may briefly forget to shield themselves when they successfully hit", '')
    .replace("you and are distracted by your suffering.", '在这个狭小的空间内，巴图克和他召唤的鲜血石磨们会对你输出巨量伤害，通常他们是无敌的，但在击中你时会偶尔进入忘我状态从而暴露弱点，在巴图克非无敌状态时迅速杀死他，不然死的就是你，注意，进入房间20秒后就会锁定关卡，如果你死了，需要建立新的游戏才能再次进入。')
    .replace("Defeat Bartuc on Hell difficulty to get the", '击败巴图克可获得')
    .replace("Legacy of Blood<\/span>.<\/p>", '血之遗产</span>.</p>')
    .replace('unique">Legacy of Blood', 'unique">血之遗产<br>Legacy of Blood<br>（奖杯：角色整体防御增加 15%）')
    .replace("4>Bull Prince Rodeo", '4>公牛王子罗迪欧')
    .replace("Corral of Corruption \(The Secret Cow Level\)", ' 腐化牛栏(秘密奶牛关卡 ➤ 击杀母牛王掉落另一条腿 ➤ 在奶牛关中将腿合成)<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44511477/?p=2">av44511477</a>、<a target="_blank" href="https://www.bilibili.com/video/av54119549">av54119549</a>')
    .replace("Defeat Bull Prince Rodeo on Hell difficulty to get the", '击败罗迪欧可获得')
    .replace("Fool\'s Gold<\/span>.<\/p>", '愚者金币</span>.</p>')
    .replace("Fool\'s Gold", '愚者金币<br>Fool\'s Gold')
    .replace("The moolicious heir to the Cow King\'s throne, Bull Prince Rodeo is out to exact his indiscriminate", '')
    .replace("revenge for all the cattle killed by humans.", '略')
    .replace("Rodeo is very aggressive and has a stunning Hoof Stomp and the Blink spell, making it difficult to put", '')
    .replace("some distance between you and him. He can also summon more cows or call upon a Stampeding Herd of exploding", '')
    .replace("cows that ploughs across the screen, trampling all in their path. This ability is unblockable, unresistable", '')
    .replace("and will destroy you if you don\'t get out of the way in time. But his most common spell, in cooperation", '')
    .replace("with another victim of cruel farming practices, is a wave of chickens that will pursue their victim relentlessly,", '')
    .replace("inflicting devastating hurt with their beaks if they connect. The chickens can be dodged by staying mobile.", '这个罗迪欧王子的牛栏，真是一个鸡飞狗跳可以形容，他自身会瞬移骑脸砍，施放全体击退僵直的冲击波，四处飞啄的鸡，犁过全屏的爆炸牛群。<br>好在他这个地方死了还可以再进来，那就说一个需要注意的地方，请在牛场红门旁边用另一只腿开启腐化牛栏的红门，这样你挂了后可更快的回来。')
    .replace("Killing Rodeo does <b>not<\/b> prevent you from entering the Cow Level again.", '击杀母牛王和罗迪欧不会影响你开启秘密奶牛关的红门。')
    .replace("4>Rathma Square", '4>拉斯玛广场')
    .replace("Act 3: Caldeum", ' (Act3 ➤ 卡尔蒂姆 ➤ 拉斯玛广场（小站北面）)<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44511477/?p=3">av44511477</a>')
    .replace("On Hell difficulty, Primus drops the", '击败普莱姆斯可获得')
    .replace("Spirit Trance Herb<\/span>.<\/p>", '灵魂出窍药草</span>.</p>')
    .replace('unique">Spirit Trance Herb', 'unique">灵魂出窍药草<br>Spirit Trance Herb<br>（奖杯：10% 不间断攻击（UA））')
    .replace("Back in the days when Kurast was the centre of civilisation and black magic was not yet frowned upon,", '')
    .replace("this was where the priests of Rathma - the necromancers - practiced their art. The place was abandoned", '')
    .replace("when the religion of Zakarum took over the city and banned pagan magic, making it the perfect hiding", '')
    .replace("place for an ancient evil bent on taking out the Church from within. Primus, son of Mephisto, was the", '')
    .replace("leader of the Cult of the Triune in ages past before its destruction. His efforts to rebuild the Triune", '')
    .replace("were shut down by the crusaders of Zakarum, but he remains a formidable foe, doubly so in the home city", '略')
    .replace("of the Zakarum", '')
    .replace("Primus himself is not particularly hard, despite his powerful ranged Bladestorm attack. The blades track", '')
    .replace("your position, but do less damage than his normal attack and can be avoided, blocked and dodged. His", '')
    .replace("guard dogs are the real challenge. After several millennia in and around Rathma Square, his Gore Crawlers", '')
    .replace("can raise themselves from the dead. Shattering the corpse does not stop this, but the resurrection takes", '')
    .replace("10 seconds, during which you can attempt to run away and ditch them.", '首先说一下，这个地图不锁定，BOSS普莱姆斯不回血，可以拖尸体过。<br>真正恐怖的不是BOSS，而是大量的爬行者，这些爬行者死后会点亮一个火把，10秒后原地复活，杀死怪物回复平静或者毁掉他们的尸体都无法阻止他们复活，所以你一定要快，快速的找到普莱姆斯，杀死他，捡起战利品，退出，否则你将被狗群淹没。')

    .replace("4>The Veiled Prophet", '4>蒙面先知')
    .replace("Cathedral of Vanity \(Library of Fate\)", ' ( Act4 ➤ 绝望平原击杀衣卒尔开启金刚大门 ➤ 银城（记得点亮小站） ➤ 命运图书馆 ➤ 虚荣大教堂 )<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44878164">av44878164</a>')
    .replace("Defeat Inarius on Hell difficulty to get the", '击败伊纳瑞斯可获得')
    .replace("Idol of Vanity<\/span>.<\/p>", '虚荣雕像</span>.</p>')
    .replace('unique">Idol of Vanity', 'unique">虚荣雕像<br>Idol of Vanity<br>（奖杯：+10% 召唤物生命和伤害）')
    .replace("According to religious myth, the mortal plane Sanctuary was created by the fallen angel Inarius and", '')
    .replace("the demon Lilith to serve as a refuge from the Eternal War. The two created a race of servants from the", '')
    .replace("earth which were to worship them for all eternity. However, humanity broke free from its shackles when", '')
    .replace("a small group of farmers rediscovered their birthright and ancient powers inherited from their supernatural", '')
    .replace("parents. As the edyrem army grew, Inarius descended into megalomanic madness and was eventually destroyed", '')
    .replace("along with his golden cathedral of vanity. It is whispered that the ghosts of Inarius and his closest", '')
    .replace("worshippers still roam the cathedral.", '略')
    .replace("The Crystal Ball is the last of the cathedral\’s magical defences. The tower exudes a holy invulnerability", '')
    .replace("shield to protect nearby revelers and casts searing beams of angelic lightning that destroys anything", '')
    .replace("it touches. Destroy the Crystal Ball to dispel the immortality from the other enemies.", '')

    .replace("4>Heart of Sin", '4>罪恶之心')
    .replace("Realm of Sin \(Act 4: Chaos Sanctuary\)", ' (Act4 ➤ 混沌避难所 ➤ 击杀冈姆掉落钥匙 ➤ 右键点击钥匙打开通向罪恶之境的红门)<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44902066">av44902066</a>')
    .replace("Kill Ghom to obtain a Key of Sin, right click it to open a portal to the Realm of Sin.", '')
    .replace("The Lord of Sin walks the earth. In his weakened state, he hides in the catacombs of Kurast, where his mere presence turned the surrounding area into a hellish landscape, feasting", '')
    .replace("on the dark rituals of Mephisto\'s chosen. Destroy him before he becomes a threat.", '略')
    .replace("High maximum fire resistance will help against these threats, but not as much as against Azmodan himself."
, '')
    .replace("Azmodan is accompanied by a legion of Balrogs that cast Fire Fountain and Ravening Beasts which unleash molten boulders.", '')
    .replace("High maximum fire resistance will help against these threats, but not as much as against Azmodan himself. ", '')
    .replace("Though he uses Flamestrike, it is very strong even against high fire resistance. And as for an attack that\'s not fire damage based, he will cast Fortress", '')
    .replace("which can subdue his ranged attackers. Movement here is key.", '远离阿兹莫丹施放的堡垒，随时注意地面标记，他施放的烈焰一击足以秒杀任何人，附近还潜伏着隐形的火球怪，躲避他们的伤害，提高你的最大火焰抗性，最后忠告：使用你的最强技能回城是最好的方法。')
    .replace("Defeat Azmodan on Hell difficulty to get", '击败阿兹莫丹可获得')
    .replace("Azmodan's Heart</span>.</p>", '阿兹莫丹之心</span>.</p>')
    .replace('unique">Azmodan\'s Heart', 'unique">阿兹莫丹之心<br>Azmodan\'s Heart<br>（奖杯：+150 生命和法力）')

    .replace("4>Twin Seas", '4>双子海')
    .replace(/Both areas contain a waypoint/g, '该区域有传送站')
    .replace("Island of Skartara (Tran Athulua)", 'Act2 ➤ 死亡神殿底层 ➤ 击杀科斯莱 ➤ 斯卡达拉岛（阿苏拉城）')
    .replace("Kill Kethryes in the Halls of the Dead to open a portal to Tran Athulua and navigate to the Island.", '击杀位于死亡之殿的科斯莱以开启通往阿苏拉城的传送门，斯卡达拉岛坐落于城池的东方。')
    .replace("Once at the island, use an Askari Scroll dropped by one of the Priestesses in Tran Athulua to summon her in the centerof the island.", '一旦到达岛屿，使用亚马逊祭祀掉落的召唤卷轴，在岛屿的中心召唤阿苏拉。<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av44904057">av44904057</a>、<a target="_blank" href="https://www.bilibili.com/video/av49770397">av49770397</a>')
    .replace("Athulua is the prime deity of the Amazon people. With her consort, Kethryes, she rules over the seasonsand the weather. The Amazon capital, Tran Athulua, is named so in her honour. Athulua is responsiblefor some of the most mysterious powers in an Amazon's arsenal. When a warrior has proven her devotionto Athulua through her brave deeds and exceptional skill in battle, the Goddess shows her favour by grantinga spiritual emissary to aid the Amazon. These emissaries of Athulua are called Valkyrie, and they arethe spirits of the greatest heroes from the Amazon people. The power to summon a Valkyrie is the greatesthonour that an Amazon warrior can receive. It is believed this gift is a sign that your place besidethe Goddess is assured when you pass from this world-perhaps even as a Valkyrie.",
             '阿苏拉是亚马逊人的主神。和配偶科斯莱一起，她控制着季节和天气。亚马逊的首都阿苏拉城就是以她的名称命名。阿苏拉拥有在亚马逊种族武装中最为神秘的力量。当一位战士通过她勇敢的行为和精湛的战斗技巧来证明她对阿苏拉的忠诚时，女神会授予一位精神使者来帮助亚马逊战士，并借此来展现女神的青睐。这些阿苏拉的使者们被称之为瓦尔基里或女武神，而她们是亚马逊人中最伟大的英雄的精神信仰。召唤女武神的力量是亚马逊战士能够获得的最伟大的荣誉。据说这份赠礼标志着，当你穿过这个世界，你在女神阿苏拉旁的位置是有保证的，甚至是自己成为女武神。')
    .replace("You can find the Amazon Goddess at the heart of the ruins. Her bow attacks deal heavy physical Damage- make sure to avoid her Tantrum ability up close and her stunning Guided Arrows or you will become trappedin her kill zone. She will summon killable rat minions, which chase you down and cast Tremor on death.Kill them from a distance so as to not get hit by this spell, which reduces your life significantly.Her other attack is Sky Siege. This teleports her to your location creating a large dust cloud, whichdeals heavy physical damage over time. Be sure to leave its area of effect as soon as you can.",
             '在竞技场废墟中央的祭坛处召唤出亚马逊女神。<br>她的射击带有极强的物理伤害，确保你能躲避她的暴怒技能以及附带晕眩并可以多次穿透的导引箭，否则你将马上被她困杀（打击恢复、格挡、闪避可以起到作用）。<br>小心她召唤的的鼠怪，这些老鼠会追逐你并在死亡时释放战栗。保持距离击杀它们来避免你受到战栗法术的影响，因为这种法术会大幅度地降低你的生命。<br>阿苏拉的另一个攻击技能是天空围杀，这个技能让她传送到你身边并创造一个巨大的灰尘之云，随着时间造成极强的物理伤害。请确保你能尽快离开这片区域。')
    .replace("Defeat Athulua, the Amazonian Godess on Hell difficulty to get the", '击败阿苏拉可获得')
    .replace("Weather Control</span>", '天气控制器</span>')
    .replace("Weather Control", '天气控制器<br>Weather Control')
    .replace("Additionally, Athuluahas a 20% chance to spawn", '另外，阿苏拉还有 20% 的概率掉落')
    .replace("Deity's Bow + 6x Emblems → Valkyrie's Prime", '神性之弓 + <img src="http://mxl.vn.cz/doc/docs_XVc_2.94_test/MXLU_vXVc_Doc_v2.94/images/cube/token_pain.png"> 苦痛 + <img src="http://mxl.vn.cz/doc/docs_XVc_2.94_test/MXLU_vXVc_Doc_v2.94/images/cube/token_suffering.png">  苦难 + <img src="http://mxl.vn.cz/doc/docs_XVc_2.94_test/MXLU_vXVc_Doc_v2.94/images/cube/token_terror.png">  恐惧 + <img src="http://mxl.vn.cz/doc/docs_XVc_2.94_test/MXLU_vXVc_Doc_v2.94/images/cube/token_hatred.png">  憎恨 + <img src="http://mxl.vn.cz/doc/docs_XVc_2.94_test/MXLU_vXVc_Doc_v2.94/images/cube/token_destruction.png">  毁灭 + <img src="http://mxl.vn.cz/doc/docs_XVc_2.94_test/MXLU_vXVc_Doc_v2.94/images/cube/token_lies.png">  谎言 6 种纹章 → Valkyrie\'s Prime')
    .replace(/Deity\'s Bow/g, '神性之弓')
    .replace("Deity\'sBow", '神性之弓')
    .replace("The use of the", '')
    .replace("is to possibly assemble it into a mightybow", '可以升级成更加强大的')
    .replace("This process is very difficult because of all therare emblems required to craft the bow. You will need all 6 of them, which can drop from regularmonsters.",
             '这个过程非常艰难，因为需要集齐全部6种纹章（世界掉落）。')
    .replace("Deity'sBow + 6x Emblems → Valkyrie's Prime", '')
    .replace("It assembles the mighty Amazon bow invested with powers from Athulua herself.", '阿苏拉在重铸这把弓时为它注入了自己的神力（<span style="color:#02c109;">感觉阿苏拉上网给自己充了个Amazon Prime会员，是金钱的Power！</span>）')
    .replace("100% Chance to Cast level 1 Athulua's Wrath when you Die", '当你死亡时将施放女神的震怒')
    .replace("when you Kill an Enemy", '当你杀死怪物')
    .replace(/to Sky Siege/g, '天空围杀')
    .replace("Sacred Bow", '神圣弓<br><img src="http://mxl.vn.cz/doc/docs_XVc_2.94_test/MXLU_vXVc_Doc_v2.94/images/baseitems/deitys_bow.png">')
    .replace("4>Eve of Destruction", '4>毁灭的前夕')
    .replace('Act 5: The Worldstone Chamber', 'Act 5 ➤ 世界之石大殿')
    .replace("Much is known about Tor'Baalos, more commonly referred to as Baal, the Lord of Destruction: his battles during the Great Conflict, his bloodlust during the Sin Wars and his incinerating lust for revenge following the Dark Exile. Now all of the strife, devastation and horror he had wrought through the ages has been channeled into the Shard of Destruction. He seeks to fuse it with the Worldstone and reveal Sanctuary to the full onslaught of Hell once and for all. You must stop him before it is too late.",
             '著名的特巴罗，也就是大家熟知的毁灭之王 巴尔。他以大冲突时期的战斗，原罪之战中的嗜血以及流放之后燃烧的复仇欲望而令众人惊惧。他多年来所经历的冲突、毁灭和恐怖都被注入在毁灭之刃中。现在，他试图融合世界之石并发起对避难所的全面猛攻以取得永远的胜利。你必须在成功之前阻止他。')
    .replace('The Lord of Destruction prefers fighting in close quarters where his spells will be harder to dodge. Heroes which attempt to flee',
             '毁灭之王巴尔更喜欢在狭窄的地方战斗，这样他的法术就更难被躲开。英雄们会因试图逃跑或躲在墙后面的懦弱而受到惩罚。“亵渎”是他最为危险的技能，这个技能用涌动的黑暗标记地上的一片区域，短暂延迟后降下多段打击的黑暗力量，造成非常强力的魔法伤害。巴尔也会经常使用他的技能“狱火”来吸干你的英雄的魔法，因此你需要提升一下快速回复魔法的能力。在战斗中，巴尔会召唤他的仆从来帮助他，这些仆从会给予他们的主人巴尔强力的增益效果，因此要快速击杀他们。巴尔也会使用“恶魔幻象”来干扰你的英雄，抑制你的奈非天之力，从而使你无法伤害到巴尔。尽快击杀这些恶魔幻象，不然你可能会疯掉。能站的住才有机会击败巴尔，但是请注意，你的队伍越庞大，他召唤的仆从就会越多。')
    .replace("or hide behind walls will be punished for their cowardice. \"Defile\", his most dangerous ability, marks an area on the ground in pulsating"
, '')
    .replace("darkness which explodes after a few seconds dealing heavy magic damage. Also Baal will often incinerate all mana from your hero with his"
, '')
    .replace("\"Inferno\"; so having a way to recover it quickly is recommended. The Lord of Destruction may call on his minions to aid him in battle,"
, '')
    .replace("which buff their master and so must be killed quickly. He may also rarely haunt your hero with \"Visions of Evil\" which inhibit your"
, '')
    .replace("Nephalem powers and thus render him untouchable; free yourself of these evils as fast as you can, lest you be overwhelmed into madness."
, '')
    .replace("Your best chance of defeating Baal lies in staying on your feet; but beware, the larger your party the more horrors will rise up to defend their master."
, '')
    .replace(' Defeat Baal on Hell difficulty to get the <span class="unique">Spirit of Creation</span> charm.</p>',
             '击败巴尔将获得 <span class="unique">创造之魂</span>。')
    .replace(/Bonus quest/g, '进阶挑战')

    .replace("4>Quov Tsin", '4>阔夫•琴')
    .replace('Vizjerei Temple (Caldeum)', 'Act 3 ➤ 卡尔蒂姆 ➤ 维兹杰雷神庙')
    .replace("Hungry for power and misled by Diablo, the irritable Vizjerei mage Quov Tsin set out to find Ureh, the fabled ancient city that had supposedly ascended up to the Heavens. Aided by Kentril Dumon and his mercenary company, which included Gorst the infamous barbarian, they succeeded in their task. However what they discovered within the deepest ruins of the grand city was no portal to Heaven, but a twisted nightmare of horrors - the Kingdom of Shadow. They were never seen again. It is rumoured that their spirits still clings to realityin a place they once called home, and that the ancient Vizjerei lies in waiting for a suitable mortal vessel that will allow him to rise once more.",
             '因渴望力量，加上迪亚波罗的误导，暴躁的维兹杰雷法师阔夫•琴开始寻找乌雷城，一座传说中可以通向天堂的古城。阔夫•琴受到肯特尔•杜蒙和他的雇佣兵队伍的帮助，其中包括臭名远扬的野蛮人哥斯特。当他们成功的抵达时，却他妈的发现乌雷城的废墟深处压根没有天堂之门，这里是阴影之国，遍布着扭曲的恐怖梦魇。至此，再也没有人见过阔夫•琴等人。据传言，他们的灵魂仍然坚守在曾被其称为家的地方，远古的维兹杰雷法师长眠此地，等待着一具合适的凡躯容器助他东山再起。')
    .replace(' As a former Vizjerei in life, Quov Tsin wields the elements. His most devastating attack is a streaming',
             '生前作为维兹杰雷法师的阔夫•琴拥有操纵元素的力量。他会施放混合冰、火、电三种元素的法术通道，这个强大的技能可以瞬间毁灭任何英雄。他的迷锁诅咒能够降低你的元素抗性。他在近身时还会施放白骨新星。你需要为这场战斗准备增加元素抗性和吸收的装备，来降低受到的伤害。阔夫•琴受到伤害时会释放法术来传送到随机位置，借此来保护自身的安全。保持适中的距离，防止他给你一个骑脸杀。')
    .replace("blast of fire, cold and lightning bolts powerful enough to annihilate any hero in a moment. He may cast the curse, Mythal,"
, '')
    .replace("to reduce your resistances. He also uses a bone nova at a distance."
, '')
    .replace("Prepare for this battle by equipping resistance items, and try to find some absorb items to further cut the damage."
, '')
    .replace("His contingency spells protect him by teleporting him to safety when struck by any attack. Stay near cover in case he appears too close for comfort."
, '')
    .replace('Defeat Quov Tsin on Hell difficulty to get the <span class="unique">Silver Seal of Ureh</span>.',
             '击败阔夫•琴可获得 <span class="unique">乌雷的银印</span>。')
    .replace('unique">Silver Seal of Ureh', 'unique">乌雷的银印<br>Silver Seal of Ureh<br>（奖杯：+8% 至所有法术伤害）')

    .replace("4>Judgement Day", '4>审判日')
    .replace('Crystal Arch (Act 4: Silver Spire Level 2)', '水晶穹顶（Act 4 ➤ 银色尖塔第二层）')
    .replace('Halls of Valor (Imperius)', '勇气大厅（英普瑞斯）')
    .replace('Pools of Wisdom (Malthael)', '智慧之池（马萨伊尔）')
    .replace("Kill Izual to open a Portal to the Diamond Gates and find your way to the Silver City. Therein lies the entrance tothe first level of the Silver Spire.",
             '击杀衣卒尔来开启通往金刚大门的传送点，并找到去往银色之城的路。在这里你可以找到通往银色尖塔第一层的传送点（铁匠旁边）。<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av46195763">av46195763</a>')
    .replace("When Uldyssian sacrificed his life at the Cathedral of Vanity in the battle between angels anddemons, his soul was thought to be blown to the far reaches of the universe. But a maliciousspirit in the High Heavens, watching over the battle from afar, snatched Uldyssian and his edyremon their way to oblivion. Imperius, archangel and high warlord of the Crystal Arch, had his ownopinions about Sanctuary and the human vermin inhabiting it. This taint on creation had to beeradicated. But his side of the argument, despite the support of Malthael, lost out in the AngirisCouncil due to the intervention of Tyrael, and the ensuing blood pact with Mephisto preventedhim from intervening on the mortal plane at all. A puppet had to be found, and Uldyssian wasjust what he sought. After a thorough brainwashing, Imperius sent his harbinger Dark Uldyssianto Sanctuary with the mission to exact divine justice and destroy the world...",
             '当乌迪西安在虚空大教堂那场正邪之战中牺牲时，他的灵魂飘散到遥远的宇宙深处。但在至高天，一股邪恶精神遥视着这场战斗，并在这条灵魂遗忘之路上捕获了乌迪西安和他的族人（被称作艾迪伦）们。<br>英普瑞斯，作为水晶穹顶的高阶天使和军官，对庇护所和人类的生存有着自己的看法，他认为必须消灭这种污点。然而，尽管拥有马萨伊尔的支持，随着天使泰瑞尔的介入，他的观点还是遭到了英格里斯议会的反对。接下来，与墨菲斯托签订的血之契约阻止了英普瑞斯介入凡人的位面。他必须找到一个傀儡、木偶，而乌迪西安恰好就是他所追求的人选。在经历了彻底的洗脑之后，英普瑞斯将黑暗乌迪西安送入了庇护所，以完成神圣审判和摧毁世界的任务……')
    .replace('Once in the Crystal Arch, both locations to find Imperius and Malthael are created. Both Avatars can throw alchemical holy hand grenades packing the power of creationitself, summon homing magical bolts and summon more Fallen Edyrem at a rapid rate.',
             '当你抵达水晶穹顶时，神秘人在消散的同时会创造两个分别通向勇气大厅（英普瑞斯）和智慧之池（马萨伊尔）的传送门。这两位天使有着强大的创造之力，可以召唤充满毒素的神圣爆炸冲击、自动追踪的魔法飞弹以及越来越多的堕落艾迪伦们。引走艾迪伦们，躲开技能，并快速接近BOSS，利用最强的攻击手段，迅速击杀他们是你唯一的机会。')
    .replace('Defeat Imperius or Malthael on Hell difficulty to get the <span class="unique">Crystalline Flame Medallion</span>.',
             '击败英普瑞斯或马萨伊尔可获得 <span class="unique">水晶烈焰勋章</span>。')
    .replace('unique">Crystalline Flame Medallion', 'unique">水晶烈焰勋章<br>Crystalline Flame Medallion<br>（奖杯：+5% 所有属性）')
    .replace("If you are exceptionally daring or suicidal, destroy them both within 60 seconds, then transmutethe Medallion in the cube to upgrade it.",
             '击杀任一BOSS会给一个持续60秒的光环，两个光环同时存在时，在赫拉迪克方块中合成水晶烈焰勋章（仅需一枚）来升级它。')
    .replace("Crystalline Flame Medallion → Crystalline Flame Medallion with added bonuses",
             '水晶烈焰勋章 → 水晶烈焰勋章（增加属性）')

    .replace("4>Banisher of Light", '4>光之放逐者')
    .replace("The Path to Enlightenment (Bramwell", '启蒙之路（Act1 ➤ 瓦瑞夫旁边大车进布兰威尔）')
    .replace('Church of Dien-Ap-Sten)', '迪纳普斯登 Dien-Ap-Sten 教堂）<br><br><b>参考视频: </b><a target="_blank" href="https://www.bilibili.com/video/av46218302">av46218302</a>')
    .replace('Kill Buyard Cholik and open a portal to the Path to Enlightenment.', '击杀拜耶德邱立克以开启通往启蒙之路的传送门')
    .replace("The Thief of Hope and the Banisher of Light is a demon lord summoned long ago by a very powerful Vizjerei magi. He used his intelligence and power to form his cult and rule the lands. People followed his philosophy; 'walked' the Black Road he created, and soon his power grew so much that even the Prime Evils feared him. Thus they imprisoned him within the portal he came from, between the Sanctuary and the Burning Hells. It is whispered, among his remaining followers, that there is a way to release him from his centuries-long prison...",
             '很久以前，一位拥有强大力量的维兹杰雷法师，召唤出了一只恶魔领主。这只恶魔被称为希望窃贼•光之放逐者，他就是卡布拉西斯。他用他的智慧和力量组建了邪教，并统治了这片大地，人们遵循他的教义：“走过”他创造的黑暗之路，很快，卡布拉西斯力量暴增的速度连恶魔巨头们都感到恐惧。因此，他们将他关押在他来的地方——介于庇护所和燃烧地狱之间的裂隙。然而，一个可以将卡布拉西斯从长期的关押中释放出来的方法，在他的残余的追随者间悄声流传……')
    .replace('The Pillar of Skulls seals Kabraxis. Once you kill it, Kabraxis will be released. He will pounce onyou with various attacks, summon his skeleton army of followersand cast broadside or teleport when hit. Your best hope is to keep running and killing theskeletons as fast as you can, and not stand close to Kabraxis all the time.',
             '骷髅巨柱封印着卡布拉西斯，一旦你击碎巨柱，卡布拉西斯将被释放出来。他会使用多种攻击方式突袭你，召唤他的骷髅大军的追随者，随时瞬移到你的身侧释放大范围的毒素攻击，以及旋转的大范围天谴。你最大的希望在于不断的保持移动并尽快击杀骷髅，控制好范围，永远不要过于接近或远离卡布拉西斯。')
    .replace('Defeat Kabraxis, Thief of Hope on Hell difficulty to get the <span class="unique">Soul of Kabraxis</span>.',
             '击败希望之窃贼•卡布拉西斯可获得 <span class="unique">卡布拉西斯之魂</span>。')
    .replace('unique">Soul of Kabraxis', 'unique">卡布拉西斯之魂<br>Soul of Kabraxis<br>（奖杯：2% 复活为: 随机怪物 (包括精英)）')
    .replace("If you're feeling like releasing more powerful beings, there are also 5 orb seals which used toseal Kabraxis once. Each seal is for one element: Fire, Cold, Lightning, Magic and Physical. When oneis destroyed, it will unseal an Ultra Elemental, along with some normal elementals. The Ultra Elementalspawns new elementals, fires a powerful spell and takes damage only from it's own element - so beprepared to have a source of damage for every one of the elements. Once defeated, each Ultra Elementalwill drop a Great Gem. Transmute all 5 Gems with <span class=\"unique\">The Black Road</span> obtained from Buyard Cholik to get additional bonuses.",
             "如果你想释放更为强大的力量，这里也有5个曾经用来封印卡布拉西斯的封印球体。每个封印对应一种元素：火、冰、电、魔法和物理。当封印被打碎时会解封一个超级元素，以及一些普通元素。超级元素会召唤新的普通元素，释放强力的法术并且只承受自己的元素类型的伤害。所以请准备好每种不同的元素伤害来源来针对它们。每个超级元素死亡时会掉落一个巨大宝石。将5种巨大宝石与拜耶德邱立克掉落的<span class=\"unique\">黑暗之路</span>合成以获取额外的奖励。")
    .replace("The Black Road + 5x Great Gems → The Black Road with added bonuses",
             '黑暗之路 + 5 种巨大宝石 → 黑暗之路（增加属性）')
    .replace("Cube with Rune to Open Time Rift", '与符文合成开启时间裂隙（Lv.125 浮兹坦维尔入口）')

    .replace("4>Kingdom of Shadow", '4>阴影王国')
    .replace("Ruins of Ureh (Vizjerei Temple - Caldeum)", '卡尔蒂姆 ➤ 维兹杰雷神庙（阔夫•琴） ➤ 乌雷废墟')
    .replace("The mythical city of Ureh, where Diablo took the form of an angel and deceived the city wizards,tricking them into casting a spell that doomed the city. Ureh and everyone within are now trappedbetween the mortal plane and the Burning Hells, appearing in this world only once every two thousandyears, when the shadow of Mount Nymyr falls upon the ruins. Be there.",
             '乌雷城，这座传说中的城市，迪亚布罗曾经在这里以伪装成天使的方式欺骗了城中的巫师们，并诱导他们释放了毁灭城市的法术。如今的乌雷城，以及城中每个人都被困在凡人与燃烧地狱的位面之间。每隔两千年，当尼米尔山的阴影笼罩着废墟的时候，它就会出现在我们的世界。去吧，勇士。')
    .replace('The ghostly citizens are impossible to kill, but they are more than capable of killing you. Keepmoving at all costs to avoid the undead hordes.',
             '鬼魂一般的城镇居民无法被击杀，而他们却能够杀死你。花费一切代价保持移动来避免这群不死之人。<br>堆高你的格挡几率、格挡速度、快速打击恢复以及移动速度，带上足够的血瓶。')
    .replace("The plazas of Ureh are huge, the lighting is very dim and the mad King JurisKhan is located at the end of a precarious bridge to oblivion. Please run around like a damsel ina zombie film until you find the narrow ledge leading to the king. Juris Khan brings more minionsfrom beyond the grave, finish him quickly.",
             '乌雷城十分巨大，光线十分阴暗，愤怒的乌雷国王居里斯可汗位于摇摇欲坠的遗忘之桥尽头。像僵尸电影里的妹子一样，跑吧，直到你找到了通向乌雷国王的狭窄桥梁。居里斯可汗会从坟墓中召唤更多的爪牙，他不难杀，这个关卡的难点在于躲避爪牙的攻击并引开他们。')
    .replace('Defeat Juris Khan on Hell difficulty to get the <span class="unique">Eternal Bone Pile</span>.',
             '击败居里斯可汗可获得 <span class="unique">永恒骨堆</span>。')
    .replace('unique">Eternal Bone Pile', 'unique">永恒骨堆<br>Eternal Bone Pile<br>（奖杯：2% 复活为: 随机怪物 (包括精英)）')
    .replace("If you're feeling like releasing more powerful beings, there are also 5 orb seals which used toseal Kabraxis once. Each seal is for one element: Fire, Cold, Lightning, Magic and Physical. When oneis destroyed, it will unseal an Ultra Elemental, along with some normal elementals. The Ultra Elementalspawns new elementals, fires a powerful spell and takes damage only from it's own element - so beprepared to have a source of damage for every one of the elements. Once defeated, each Ultra Elementalwill drop a Great Gem. Transmute all 5 Gems with <span class=\"unique\">The Black Road</span> obtained from Buyard Cholik to get additional bonuses.",
             "如果你想释放更为强大的力量，这里也有5个曾经用来封印卡布拉西斯的封印球体。每个封印对应一种元素：火、冰、电、魔法和物理。当封印被打碎时会解封一个超级元素，以及一些普通元素。超级元素会召唤新的普通元素，释放强力的法术并且只承受自己的元素类型的伤害。所以请准备好每种不同的元素伤害来源来针对它们。每个超级元素死亡时会掉落一个巨大宝石。将5种巨大宝石与拜耶德邱立克掉落的<span class=\"unique\">黑暗之路</span>合成以获取额外的奖励。")
    .replace("The Black Road + 5x Great Gems → The Black Road with added bonuses",
             '黑暗之路 + 5 种巨大宝石 → 黑暗之路（增加属性）')
    .replace("Cube with Rune to Open Time Rift", '与符文合成开启时间裂隙（Lv.125 浮兹坦维尔入口）')


    .replace(/4>LORD OF LIES/i, '4>谎言之王')
    .replace("Realm of Lies (Act 4: Chaos Sanctuary)", '谎言之境（Act4: 混沌避难所）')
    .replace("Kill Maghda to obtain a Key of Lies, right click it to open a portal to the Realm of Lies.",
             '击杀玛格妲掉落谎言之钥，右击后开启红门可以抵达谎言之境')
    .replace('After his defeat in the civil war in Hell, the Lord of Lies and infernal King of Rats was banished toSanctuary where he plots his return. The icy caves under Harrogath offered him both proximity to thepowerful Worldstone and a dark moist breeding ground for his rodent servants.',
             '在燃烧地狱的那场内战中失败后，谎言之王和炼狱鼠王被驱逐到避难所，他窝在这里策划着如何重返地狱。这个位于哈洛加斯地下的冰穴，既靠近世界之石，同时拥有黑暗潮湿的环境，这让他的啮齿类爪牙们得以疯狂繁殖。')
    .replace("As the Lord of Lies, Belial prefers to cheat in battle. His main offence consists of his clones which will keep him safe as he cowardly hides. Belial will use a powerful Comet spell, and continue to confuse you by summoning new copies. You will need fast killing speed or you will be overwhelmed by his minions.",
             '作为谎言之王，彼列在战斗中从不按常理出牌。他懦弱的隐藏在数个分身中以避免在战斗中受到伤害。他在召唤高速彗星撞击你的同时，仍旧不忘记弄出分身来迷惑你。你必须拥有快速击杀他的能力，否则会被他烦死。')
    .replace('Defeat Belial on Hell difficulty to get the <span class="unique">Book of Lies</span>.',
             '击败彼列可获得 <span class="unique">谎言之书</span>。')
    .replace('unique">Book of Lies', 'unique">谎言之书<br>Book of Lies')




    //亚马逊
    .replace(/SUN STRIKE/g, 'SUNSTRIKe<br>炎阳击')
    .replace(/Effect: shoots a piercing fire arrow that leaves a trail behind/g, '投射物 - 射出一只可穿透的火箭并留下火焰')
    .replace(/BARRAGE/g, 'BARRAGe<br>弹幕')
    .replace(/Effect: shoots arrows in random directions/g, '投射物 - 密集箭矢的旋转射击')
    .replace(/PHALANX/g, 'PHALANx<br>方阵')
    .replace(/Effect: summons a line of spirit archers/g, '投射物 - 召唤一排弓箭手射向下方')
    .replace(/DRAGONLORE/g, 'DRAGONLORe<br>巨龙传说')
    .replace(/Passive devotion effect: adds elemental damage and magic damage if you have elemental and magic items/g, '被动 - 强化你的冰火电伤害')

    //补充

    .replace(/ Totems/g, ' Totem')
    .replace(/Herald of Pestilence/g, 'Herald of pestilence')
    .replace(/\+2% Kraken Stance Damage per Base Level in the Honor Tree/g, '神圣系的每点基础技能为 Kraken Stance 提供 2% 的伤害加成')
    .replace(/to Maximum Forked Lightning Projectiles/g, '更多投射物至 Forked Lightning')
    .replace(/If You Have any Points in the Fire, Cold or Poison Trees/g, '如果你在火、冰、毒系技能树里有投入')
    .replace(/All Lightning Tree Spells/g, '所有电系技能')
    .replace(/33% less Mana Drained when Hit/g, '法力受损量降低 33%')


  //技能
    .replace(/ Summon Edyrem/g, ' 召唤艾迪伦')
		.replace(/ Mana Shield/g, 'hb1 法力护盾hb5（Mana Shield）<br>Buff - 15% 受到的伤害由法力值代替hb4')
		.replace(/ Scattershot/g, 'hb1 裂帛击 hb2"https://vignette.wikia.nocookie.net/median-xl/images/7/72/Scattershot.gif/revision/latest?cb=20180317194321"hb3Scattershot<br>弓弩技能-范围打击-40%武器伤害hb4')
		.replace(/ Wolf Stance/g, 'hb1 狼姿态 hb5Wolf Stance<br>姿态技能：增加攻击力，击回，战斗速度（除了施法速度）hb4')
		.replace(/ Mark of the Wild/g, 'hb1 野性印记hb2"https://vignette.wikia.nocookie.net/median-xl/images/7/71/Mark_of_the_Wild.gif/revision/latest?cb=20180122022532"hb3（Mark of the Wild）<br>Buff - 增强自身或目标的攻速、物理攻击和元素法术攻击hb4')
		.replace(/ Gift of the Wild/g, 'hb1 旷野之赠hb2"https://vignette.wikia.nocookie.net/median-xl/images/1/1a/Gift_of_the_Wild.gif/revision/latest?cb=20180721220928"hb3（Gift of the Wild）<br>Buff - 增强全体的攻速、物理攻击和元素法术攻击hb4')
		.replace(/ to Hamstring/g, 'Hamstring（断筋 -近战、晕眩）')
		.replace(/ to Mana Sweep/g, 'Mana Sweep（法力扫荡 -吸法、伤害）')
		.replace(/ to Mana Tide Totem/g, 'Mana Tide Totem（法力潮汐图腾）')
		.replace(/ Bloodlust/g, 'hb1 嗜血hb2"https://vignette.wikia.nocookie.net/median-xl/images/9/97/Bloodlust.gif/revision/latest?cb=20171030123459"hb3（Bloodlust）Buff - 增强你的所有伤害hb4')
		.replace(/ Banish /g, 'Banish（放逐，诅咒 -减敌最大生命）')
		.replace(/ Frog Prince/g, 'Frog Prince（青蛙王子 -施放冰环）')
		.replace(/ Shower of Rocks/g, 'hb1 落石hb2"https://vignette.wikia.nocookie.net/median-xl/images/c/c2/Shower_of_Rocks.gif/revision/latest?cb=20180123022550"hb3（Shower of Rocks）从天而降的岩石伤害并降低敌人的防御和攻速hb4')
		.replace(/ Spike Nova/g, 'hb1 尖刺新星hb5（Spike Nova）射出一支飞行中不断施放尖刺新星的标枪hb4')
		.replace(/ to Wyrd/g, 'Wyrd（环形冲击波）')
		.replace(/ Iron Spiral/g, 'hb1 铁螺旋hb2"https://vignette.wikia.nocookie.net/median-xl/images/9/96/Iron_Spiral.gif/revision/latest?cb=20180131194553"hb3（Iron Spiral）<br>攻击时施放剑刃旋涡，造成物理和闪电混合伤害hb4')
		.replace(/ Winter Avatar/g, 'hb1 凛冬化身hb2"https://vignette.wikia.nocookie.net/median-xl/images/7/70/Winter_Avatar.gif/revision/latest?cb=20190218213457"hb3（Winter Avatar）<br>短暂召唤可以施放冰霜新星的化身hb4')
		.replace(/ Plague Avatar/g, 'hb1 瘟疫化身hb2"https://vignette.wikia.nocookie.net/median-xl/images/2/27/Plague_Avatar.gif/revision/latest?cb=20180206025306"hb3（Plague Avatar）<br>短暂召唤可以施放剧毒雾气的化身hb4')
		.replace(/ to Deathgaze/g, 'Deathgaze（死亡凝视）')
		.replace(/ Glacial Nova/g, 'hb1 冰川新星hb2"https://vignette.wikia.nocookie.net/median-xl/images/7/77/Glacial_Nova.gif/revision/latest?cb=20171012171406"hb3（Glacial Nova）冰伤 - 施放一个超大范围冰封2秒的寒冰新星hb4')
		.replace(/ Lifeblood/g, 'Lifeblood（命脉 -生命回复）')
		.replace(/ Gamma Field/g, 'Gamma Field（毒伤）')
		.replace(/ Noctule/g, 'hb1 山蝠hb2"https://vignette.wikia.nocookie.net/median-xl/images/2/21/Noctule.gif/revision/latest?cb=20180322021404"hb3（Noctule）<br>攻击时召唤蝙蝠撕咬敌人hb4')
		.replace(/ to Dragon Wyrms/g, 'Dragon Wyrms（翼龙 -陷阱）')
		.replace(/ to Hammertime/g, 'Hammertime（锤子时间）')
		.replace(/ Nightmare/g, 'Nightmare（噩梦 -诅咒，减速）')
		.replace(/ to Wild and Free/g, 'Wild and Free（自由自在，被动加防）')
		.replace(/ Shatterblade/g, 'hb1 裂刀hb5（Shatterblade）<br>攻击时发出分裂的刀片hb4')
		.replace(/ Spellbind/g, 'hb1 法术缠绕hb5（Spellbind）诅咒 - 扔出使敌人石化的蛇群 - 减速度/物抗/攻击/防御hb4')
		.replace(/ Punisher Barrage/g, 'hb1 天谴弹幕hb5（Punisher Barrage）<br>天谴的弹幕版本？hb4')
		.replace(/ Punisher/g, 'hb1 天谴hb2"https://vignette.wikia.nocookie.net/median-xl/images/e/e7/Punisher.gif/revision/latest?cb=20171015153834"hb3（Punisher）<br>毒伤 - 施放移动缓慢但致命的金属刺球hb4')
		.replace(/ Charged Strike/g, 'hb1 充能一击hb2"https://vignette.wikia.nocookie.net/median-xl/images/9/94/Charged_Strike.gif/revision/latest?cb=20190218213456"hb3（Charged Strike）武器伤害 - 近战攻击时施放强力的电火花hb4')
		.replace(/ Squall Wave/g, 'hb1 飓风波hb5（Squall Wave）射出多个可以造成巨大冲击波的箭矢hb4')
		.replace(/ Blade Spirits/g, 'hb1 刀刃之灵hb2"https://vignette.wikia.nocookie.net/median-xl/images/3/3b/Blade_Spirit.png/revision/latest?cb=20180206023602"hb3（Blade Spirits）召唤刀刃之灵 - 该召唤物受到法师所有元素系被动的加成hb4')
		.replace(/ Pentagram/g, 'hb1 五角星hb2"https://vignette.wikia.nocookie.net/median-xl/images/7/73/Pentagram.gif/revision/latest?cb=20171015150140"hb3（Pentagram）火伤 - 从脚底扩散的火焰五角星hb4')
		.replace(/ Shuriken Flurry/g, 'Shuriken Flurry（手里剑乱舞）')
		.replace(/ Blizzard/g, 'hb1 暴风雪hb2"https://vignette.wikia.nocookie.net/diablo/images/2/28/IceRain.jpg/revision/latest/scale-to-width-down/200?cb=20150802101915"hb3（Blizzard ）<br>原版法术 - 目标区域内降下暴雪，造成大量冰冷伤害hb4')
		.replace(/ Fire Splash/g, 'Fire Splash（火花飞溅）')
		.replace(/ Venomous Spirit/g, 'Venomous Spirit（剧毒之灵 -法术）')
		.replace(/ Abyss/g, 'Abyss（深渊 -法师冰法术）')
		.replace(/ Frozen Crown/g, 'Frozen Crown（冰冻王冠 -法术）')
		.replace(/ to Vanquish/g, 'Vanquish（征服 -3秒增伤BUFF）')
		.replace(/ Crucify/g, 'hb1 处刑hb2"https://vignette.wikia.nocookie.net/median-xl/images/f/fd/Crucify.gif/revision/latest?cb=20180207033326"hb3（Crucify）<br> 近战时施放快速回击的尖刺hb4')
		.replace(/ Charm/g, 'Charm（魅惑）')
		.replace(/ Celerity/g, 'Celerity（迅捷 -加速）')
		.replace(/ Mind Flay/g, 'hb1 精神鞭笞hb2"https://vignette.wikia.nocookie.net/median-xl/images/f/f5/Mind_Flay.gif/revision/latest?cb=20180129022446"hb3（Mind Flay）<br>精神力化作闪电枪，撞击敌人是造成范围性的多段打击hb4')
		.replace(/ Blink/g, 'Blink（闪烁 -瞬移，晕眩）')
		.replace(/ Arrow Swarm/g, 'Arrow Swarm（箭群 -多重射击）')
		.replace(/ Wraith Arrow/g, 'Wraith Arrow（幽灵箭 -箭术 ）')
		.replace(/ Frozen Soul/g, 'Frozen Soul（冰冻之魂）')
		.replace(/ Bloodspeaker's Mark/g, 'Bloodspeaker\'s Mark（鲜血议长的标记 -短时召唤）')
		.replace(/ While Tantrum is Active/g, '当 Tantrum 激活时')
		.replace(/ Tantrum/g, 'hb1 暴怒hb2"https://vignette.wikia.nocookie.net/median-xl/images/f/fa/Tantrum.gif/revision/latest?cb=20171016154456"hb3（Tantrum）<br>将弹药投射在玩家周围造成多段伤害<br>需要弓和十字弓hb4')
		.replace(/ Meteor Shower/g, 'hb1 陨石雨hb2"https://vignette.wikia.nocookie.net/median-xl/images/a/a9/Meteor_Shower.gif/revision/latest?cb=20171015144223"hb3（Meteor Shower）<br>在目标区域降下大范围的陨石雨hb4')
		.replace(/ Rune of Fire/g, 'Rune of Fire（火焰符文 -原地放置）')
		.replace(/ Rune of Ice/g, 'Rune of Ice（冰冻符文 -原地放置）')
		.replace(/ Singularity/g, 'hb1 奇点hb2"https://vignette.wikia.nocookie.net/median-xl/images/5/5b/Singularity.gif/revision/latest?cb=20180208043132"hb3（Singularity）<br>法术 - 创造一个黑洞旋涡对敌人造成伤害hb4')
		.replace(/ to Silver Dart/g, 'Silver Dart（银镖 -追踪穿透）')
		.replace(/ Thunderstone/g, 'hb1 雷电石hb2"https://vignette.wikia.nocookie.net/median-xl/images/3/39/Thunderstone.gif/revision/latest?cb=20180206211131"hb3（Thunderstone）<br>法术 - 投掷一块带电的石头，在撞击时发射出电火花hb4')
		.replace(/ Terror Strike/g, 'hb1 恐怖打击hb2"https://vignette.wikia.nocookie.net/median-xl/images/a/a2/Terror_Strike.gif/revision/latest?cb=20180129021139"hb3（Terror Strike）<br>攻击后段时间内提升防御、法术伤害和准确率hb4')
		.replace(/ Searing Glow/g, 'Searing Glow（灼热辉光）')
		.replace(/ Amatoxin/g, 'hb1 菇毒hb5（Amatoxin）<br>被动 - 武器增加毒素伤害hb4')
		.replace(/ Countdown/g, 'Countdown（法术 -大范围冰伤）')
		.replace(/ Arachnomancy/g, 'hb1 蛛卜术hb2"https://vignette.wikia.nocookie.net/median-xl/images/d/d0/Arachnomancy.gif/revision/latest?cb=20180206205357"hb3（Arachnomancy）<br>法术 - 一大群有毒的蜘蛛从目标身上迸发出来hb4')
		.replace(/ Lightning Shield/g, 'Lightning Shield（闪电护盾）')
		.replace(/ Supernova/g, 'hb1 超新星hb2"https://vignette.wikia.nocookie.net/median-xl/images/b/b9/Supernova.gif/revision/latest?cb=20180217022254"hb3（Supernova）电伤 - 施放一个超大范围多次打击的闪电新星hb4')
		.replace(/ Lightning Wall/g, 'Lightning Wall（闪电墙 -晕眩）')
		.replace(/ Lionheart/g, 'Lionheart（狮心 -增益 丐版的龙之心）')
		.replace(/ to Bloodstar/g, 'Bloodstar（血星 -缓慢移动的火伤）')
		.replace(/ Rapture/g, 'Rapture（狂喜 -增益，加全速）')
		.replace(/ to Shatter the Flesh/g, 'Shatter the Flesh（撕碎血肉 -尸爆冷冻）')
		.replace(/ Cataclysm/g, 'hb1 浩劫hb2"https://vignette.wikia.nocookie.net/median-xl/images/2/24/Cataclysm.gif/revision/latest?cb=20180402183704"hb3（Cataclysm）火伤 - 施放一个超大范围的火弹新星hb4')
		.replace(/ to Summon Avalanche/g, 'Summon Avalanche（召唤雪怪 -冰伤并增加召唤物法伤）')
		.replace(/ to Forked Lightning/g, ' Forked Lightning（分叉闪电）')
		.replace(/ to Magic Missiles/g, ' Magic Missiles（魔法飞弹）')
		.replace(/ Kraken Stance/g, 'hb1 海妖姿态hb5（Kraken Stance）<br>增加冰、电、火伤害，并基于姿态系技能投入减少敌人这三系的抗性hb4')
		.replace(/ Stampede/g, 'Stampede（涌动 -多重投掷）')
		.replace(/ Lorenado/g, 'hb1 知识旋风hb2"https://vignette.wikia.nocookie.net/median-xl/images/5/55/Lorenado.gif/revision/latest?cb=20180206211126"hb3（Lorenado）<br>召唤多道扭曲前行的小型旋风造成毒伤hb4')
		.replace(/ Sacrifices/g, 'hb1 活祭品hb2"https://vignette.wikia.nocookie.net/median-xl/images/8/8b/Sacrifices.gif/revision/latest?cb=20180131195910"hb3（Sacrifices）<br>召唤手无寸铁的祭品，立刻处死以获得尸体hb4')
		.replace(/ Fairy Ring/g, 'hb1 精灵之环hb2"https://vignette.wikia.nocookie.net/median-xl/images/9/9d/Fairy_Ring.gif/revision/latest?cb=20180716020438"hb3（Fairy Ring）<br>法术 - 将尸体变成一圈射击敌人的骨制雕像hb4')
		.replace(/ to Summon Shadows/g, ' Summon Shadows（召唤影子）')
		.replace(/ Earthquake/g, 'hb1 地震hb2"https://vignette.wikia.nocookie.net/median-xl/images/a/ad/Earthquake.gif/revision/latest?cb=20180123021229"hb3（Earthquake）近战攻击时施放一个造成80%武器伤害的冲击波hb4')
		.replace(/ Time Wave/g, 'hb1 时空潮汐hb2"https://vignette.wikia.nocookie.net/median-xl/images/6/6d/Time_Wave.gif/revision/latest?cb=20171016160117"hb3（Time Wave）延时打击群体版 - 附近的每个敌人都会受到延时打击hb4')
		.replace(/ Timefield/g, 'hb1 时间力场hb2"https://vignette.wikia.nocookie.net/median-xl/images/3/36/Timefield.gif/revision/latest?cb=20180516195253"hb3（Timefield）诅咒 - 降低敌人 61% 的速度hb4')
		.replace(/ Time Strike/g, 'hb1 延时打击hb2"https://vignette.wikia.nocookie.net/median-xl/images/a/a5/Time_Strike.gif/revision/latest?cb=20180330002255"hb3（Time Strike）近战攻击随后是第二次延迟打击hb4')
		.replace(/ Veil King Plague Grasp/g, 'hb1 帷幕之王的瘟疫之握hb5（Veil King Plague Grasp）造成小范围的AOE毒伤hb4')
		.replace(/ Stormlord/g, 'hb1 风暴领主hb2"https://vignette.wikia.nocookie.net/median-xl/images/0/04/Wearing_Vasily%27s_Following.gif/revision/latest/scale-to-width-down/185?cb=20180722001826"hb3（Stormlord）被动 - 增加你的四围（力敏体精）hb4')
		.replace(/ Rotting Flesh/g, 'hb1 腐烂血肉hb2"https://vignette.wikia.nocookie.net/median-xl/images/3/3c/Rotting_Flesh.gif/revision/latest?cb=20180128005657"hb3（Rotting Flesh）施放一个四射毒素的腐烂之云hb4')
		.replace(/ Pagan Rites/g, 'hb1 异教徒仪式hb2"https://vignette.wikia.nocookie.net/median-xl/images/5/5d/Pagan_Rites.gif/revision/latest?cb=20180123042032"hb3（Pagan Rites）净化尸体并立即恢复一部分生命值hb4')
		.replace(/ Ancients' Hand/g, 'hb1 先祖之手hb2"https://vignette.wikia.nocookie.net/median-xl/images/2/23/Ancients%27_Hand.gif/revision/latest?cb=20180328222228"hb3（Ancients\' Hand）攻击时施放先祖之手造成多段的火焰伤害hb4')
		.replace(/ \/Elemental Projectile/g, 'hb1 和元素击hb2"https://vignette.wikia.nocookie.net/median-xl/images/e/e5/Elemental.gif/revision/latest?cb=20180131213345"hb3（Elemental）<br>法术 - 发射直线奔跑并在撞击敌人时爆炸的火元素hb4 的投射物')
		.replace(/ Mythal/g, 'hb1 迷锁hb2"https://vignette.wikia.nocookie.net/median-xl/images/b/b9/Mythal.gif/revision/latest?cb=20180206025718"hb3（Mythal）<br>诅咒 - 降低法术范围内敌人20%的元素抗性hb4')
		.replace(/ Frozen Orb/g, 'hb1 冰封球hb2"https://vignette.wikia.nocookie.net/diablo/images/d/d3/Frostix.jpg/revision/latest/scale-to-width-down/200?cb=20150802172358"hb3（Frozen Orb）<br>原版法术 - 发射一颗不停旋转喷射冰弹的冰封球体hb4')
		.replace(/ Poison Flash/g, 'hb1 毒素闪烁hb2"https://vignette.wikia.nocookie.net/median-xl/images/6/64/Poison_Flash.gif/revision/latest?cb=20180124024842"hb3（Poison Flash）<br>对身旁小范围敌人造成基于力量加成的毒素伤害hb4')
		.replace(/ Bear Claw/g, 'hb1 熊爪hb2"https://vignette.wikia.nocookie.net/median-xl/images/8/8b/Bear_Claw.gif/revision/latest?cb=20180131030324"hb3（Bear Claw）<br>投掷基于武器伤害的飞斧，穿透敌人同时造成击晕和击退效果，hb4')
		.replace(/ Claw Tornado/g, 'hb1 爪击旋风hb2"https://vignette.wikia.nocookie.net/median-xl/images/d/d5/Claw_Tornado.gif/revision/latest?cb=20180319042627"hb3（Claw Tornado）<br>施放扭曲前行，基于武器伤害的小型旋风hb4')
		.replace(/ Jinn/g, 'hb1 魔灵hb2"https://vignette.wikia.nocookie.net/median-xl/images/d/d7/Jinn.png/revision/latest?cb=20180131204338"hb3（Jinn）<br>召唤 - 拥有地狱火光环的魔灵，光环降低敌人的火抗，提升队友的最大火抗，并施放火山爆发技能hb4')
		.replace(/ Idol of Scosglen/g, 'hb1 索格伦之像hb2"https://vignette.wikia.nocookie.net/median-xl/images/d/d5/Idol_of_Scosglen.gif/revision/latest?cb=20180124030422"hb3（Idol of Scosglen）变身 - 4秒的石像状态，增加物理抗性，防御，移速，并释放4波基于武器伤害的环形冲击波<br>hb4')
		.replace(/ This Fire Damage is Increased by 15\% per Wildfire Base Level/g, '该火焰伤害受到 Wildfire 的等级加成<br>每投入1的基础技能点增加 15% ')
		.replace(/ Wildfire/g, 'hb1 野火hb2"https://vignette.wikia.nocookie.net/median-xl/images/6/65/Wildfire.gif/revision/latest?cb=20180124030430"hb3（Wildfire）<br>近战攻击时发出扭曲的火焰燃烧面前的敌人hb4')
		.replace(/ Snake Stance/g, 'hb1 蛇姿态hb5（Snake Stance）<br>光环 - 增加毒素伤害并减慢敌人hb4')
		.replace(/ Whirlwind/g, 'hb1 旋风斩hb2"https://vignette.wikia.nocookie.net/diablo/images/2/29/SpinningBarb.jpg/revision/latest/scale-to-width-down/320?cb=20160108123546"hb3（Whirlwind）<br>原版技能 - 爱的魔力转圈圈hb4')
		.replace(/ Phalanx/g, 'hb1 方阵hb2"https://vignette.wikia.nocookie.net/median-xl/images/3/37/Phalanx.gif/revision/latest?cb=20180716020441"hb3（Phalanx）<br>临时召唤亚马逊小队进行箭阵攻击hb4')
		.replace(/ Balance/g, 'hb1 平衡hb5（Balance）<br>被动 - 增加防御hb4')
		.replace(/ Lava Pit/g, 'hb1 熔岩坑hb5（Lava Pit）<br>法术 - 撕碎目标脚下的地面，迸射的熔岩燃烧敌人hb4')
		.replace(/ Magnetic Field/g, 'hb1 磁场hb2"https://vignette.wikia.nocookie.net/median-xl/images/5/57/Magnetic_Field.gif/revision/latest?cb=20180716020440"hb3（Magnetic Field）<br>法术 - 在你的周围施放闪电破坏场hb4')
		.replace(/ Thundercrack/g, 'hb1 雷暴hb2"https://vignette.wikia.nocookie.net/median-xl/images/1/1c/Thundercrack.gif/revision/latest?cb=20180716020444"hb3（Thundercrack）<br>打击时迸射出多道闪电穿透敌人hb4')
		.replace(/ Javelin Nova/g, ' 标枪新星')
		.replace(/ Trinity Beam/g, 'hb1 元素之光hb5（Trinity Beam）<br>发射造成冰火电三种元素伤害的光束hb4')
		.replace(/ Burning Veil/g, 'hb1 燃烧帷幕hb2"https://vignette.wikia.nocookie.net/median-xl/images/6/62/Burning_Veil.gif/revision/latest?cb=20180207023515"hb3（Burning Veil）<br>创造一道可以强化队友的结界，穿过时增加物理和法术伤害hb4')
		.replace(/ Flurry of Javelins/g, 'hb1 标枪乱射hb5（FLURRY OF JAVELINS）<br>沿着随机方向释放一连串标枪hb4')
		.replace(/ APF-20 'Maelstrom' MkI/g, ' “旋涡”型一式飞弹 ')
		.replace(/ Rust Storm/g, 'hb1 腐蚀风暴hb5（Rust Storm）<br>诅咒 - 降低敌人的防御和战斗速度hb4')
		.replace(/ Fortress/g, 'hb1 堡垒hb2"https://vignette.wikia.nocookie.net/median-xl/images/0/0c/Fortress.gif/revision/latest?cb=20180131194526"hb3（Fortress）<br>临时召唤一圈箭塔攻击敌人hb4')
		.replace(/ Guard Tower/g, 'hb1 警戒塔hb2"https://vignette.wikia.nocookie.net/median-xl/images/2/2d/Guard_Tower.gif/revision/latest?cb=20180402010851"hb3（Guard Tower）<br>临时召唤一个箭塔攻击敌人，堡垒技能的弱化版hb4')
		.replace(/ Great Hunt/g, 'hb1 伟大之猎hb2"https://vignette.wikia.nocookie.net/median-xl/images/d/df/Great_Hunt.gif/revision/latest?cb=20180716020438"hb3（Great Hunt）<br>攻击时施放扭曲前行的灵魂波动造成100%武器伤害的魔法伤害hb4')
		.replace(/ Nova Charge/g, 'hb1 新星充能hb2"https://vignette.wikia.nocookie.net/median-xl/images/5/51/Nova_Charge.gif/revision/latest?cb=20180206211129"hb3（Nova Charge）<br>Buff - 以雷电之力充满自身，周期性溢出的电荷在附近敌人的脚下爆发出电能新星hb4')
		.replace(/ Starfire/g, 'hb1 星火hb5（Starfire）<br>释放出能量乱流，减少敌人的抗性hb4')
		.replace(/ Pestilence/g, 'hb1 疫病hb2"https://vignette.wikia.nocookie.net/median-xl/images/d/dc/Pestilence.gif/revision/latest?cb=20180128012135"hb3（Pestilence）<br>召唤一个持续15秒的剧毒风暴围绕自身hb4')
		.replace(/ Vessel of Justice/g, 'hb1 正义化身hb5（Vessel of Justice）<br>中立骑士Buff - 定期攻击附近的敌人hb4')
		.replace(/ Vessel of Retribution/g, 'hb1 惩戒化身hb5（Vessel of Retribution）<br>中立骑士Buff - 定期攻击附近的敌人hb4')
		.replace(/ Blessed Life/g, 'hb1 祝福生命hb5（Blessed Life）<br>被动 - 减免物伤、增加物抗并提高苹果效率hb4')
		.replace(/ Death Blossom/g, 'hb1 死亡绽放hb2"https://vignette.wikia.nocookie.net/median-xl/images/1/10/Death_Blossom.gif/revision/latest?cb=20171009182129"hb3（Death Blossom）<br>在近战攻击中加入灼热的冲击波hb4')
		.replace(/ 50% less Storm Crow Knives Lost When Hit/g, '被击中时 Storm Crow 飞刀丢失数量减少50%')
		.replace(/ Storm Crow/g, 'hb1 暴风乌鸦hb2"https://vignette.wikia.nocookie.net/median-xl/images/1/1b/Storm_Crows.gif/revision/latest?cb=20180208043132"hb3（Storm Crow）<br>射出一排自动返回的飞刀hb4')
		.replace(/ Knife Throw/g, 'hb1 扔飞刀hb5（Knife Throw）<br>就是扔飞刀呀hb4')
		.replace(/ Flamestrike/g, 'hb1 烈焰一击hb2"https://vignette.wikia.nocookie.net/median-xl/images/f/fa/Flamestrike.gif/revision/latest?cb=20180206205359"hb3（Flamestrike）<br>标记处召唤从天而降的火柱燃烧地面hb4')
		.replace(/ Stampede/g, 'hb1 涌动hb2"https://vignette.wikia.nocookie.net/median-xl/images/d/d4/Stampede.gif/revision/latest?cb=20180131032018"hb3（Stampede）<br>完成一次多重投掷hb4')
		.replace(/ Bear Claw Nova/g, 'hb1 熊爪新星hb2"https://vignette.wikia.nocookie.net/median-xl/images/b/be/Bear_Claw_Nova.gif/revision/latest?cb=20190302180716"hb3（Bear Claw Nova）<br>以新星形式投射出大量可造成击退和晕眩的熊爪hb4')
		.replace(/ Demon Blood Aura/g, 'hb1 恶魔之血光环hb2"https://vignette.wikia.nocookie.net/median-xl/images/5/56/Skeletal_Flayer.png/revision/latest?cb=20180131202726"hb3（Demon Blood Aura）<br>光环 - 增加最大生命值和元素法术伤害hb4')
		.replace(/ Nephalem Aura/g, 'hb1 奈非天光环hb2"https://vignette.wikia.nocookie.net/median-xl/images/f/fc/Nephalem_Spirit.png/revision/latest?cb=20180122021143"hb3（Nephalem Aura）<br>光环 - 基于力敏体增加你的冰火电3系伤害hb4')
		.replace(/ Slayer/g, 'hb1 杀戮hb2"https://vignette.wikia.nocookie.net/median-xl/images/6/6e/Slayer.png/revision/latest?cb=20180129022109"hb3（Slayer）<br>在目标处召唤向的敌人射击魔法射线的幽灵。hb4')
		.replace(/ Stormfront/g, 'hb1 风暴前线hb2"https://vignette.wikia.nocookie.net/median-xl/images/3/30/Stormfront.gif/revision/latest?cb=20190218213457"hb3（Stormfront）<br>施放闪电长矛，在击中敌人是爆发，形成多次打击的电能场<br>每25级增加一根闪电长矛hb4')
		.replace(/ Avalanche/g, 'hb1 冰霜奔袭hb2"https://vignette.wikia.nocookie.net/median-xl/images/0/00/Avalanche.gif/revision/latest?cb=20171012142622"hb3（Avalanche）<br>施放两道平行的冰霜通道hb4')
		.replace(/ Mana Sweep/g, 'hb1 法力扫荡hb2"https://vignette.wikia.nocookie.net/median-xl/images/0/0f/Mana_Sweep.gif/revision/latest?cb=20180206211127"hb3（Mana Sweep）<br>基于失去的法力，伤害附近的敌人并汲取法力hb4')
		.replace(/ Jitan's Gate/g, 'hb1 吉坦之门hb2"https://vignette.wikia.nocookie.net/median-xl/images/0/09/Jitan%27s_Gate.gif/revision/latest?cb=20180402183705"hb3（Jitan\'s Gate）<br>传送到目标位置并在短时间内增加防御hb4')
		.replace(/ Vizjerei Rage/g, 'hb1 维兹杰雷狂怒hb5（Vizjerei Rage）<br>大范围的伤害技能hb4')
		.replace(/ Ice Lance/g, 'hb1 冰枪hb5（Ice Lance）<br>发射可以穿透敌人的冰枪hb4')
		.replace(/ Stormblast/g, 'hb1 暴风爆hb2"https://vignette.wikia.nocookie.net/median-xl/images/1/1f/Stormblast.gif/revision/latest?cb=20180131200240"hb3（Stormblast）攻击时对前面一条线上的敌人造成闪电伤害<br>hb4')
		.replace(/ Thunder Hammer Nova/g, 'hb1 雷锤新星hb5（Thunder Hammer Nova）<br>未确定，盲猜是射出一圈闪电伤害的锤子hb4')
		.replace(/ Thunder Hammer/g, 'hb1 雷锤hb5（Thunder Hammer）<br>未确定，盲猜是射出闪电伤害的锤子hb4')
		.replace(/ Sun Strike/g, 'hb1 炎阳击hb2"https://vignette.wikia.nocookie.net/median-xl/images/7/76/Sun_Strike.gif/revision/latest?cb=20180716020442"hb3（Sun Strike）<br>射出留下灼热火焰的箭矢hb4')
		.replace(/ Spore Shot/g, 'hb1 孢子击hb5（Spore Shot）<br>射出不断分裂的箭矢hb4')
		.replace(/ Cascade/g, 'hb1 群射hb5（Cascade）<br>射击范围内的所有目标hb4')
		.replace(/ Drakemaw/g, 'hb1 龙颚击hb2"https://vignette.wikia.nocookie.net/median-xl/images/9/9b/Drakemaw.gif/revision/latest?cb=20180409215557"hb3（Drakemaw）<br>施放穿刺地面前进的爪击对敌人造成魔法伤害hb4')
		.replace(/ Flamefront/g, 'hb1 烈焰前线hb2"https://vignette.wikia.nocookie.net/median-xl/images/0/03/Flamefront.gif/revision/latest?cb=20180206205359"hb3（Flamefront）<br>向前投射出爆炸的火箭hb4')
		.replace(/ Barrage/g, 'hb1 弹幕hb2"https://vignette.wikia.nocookie.net/median-xl/images/a/a1/Barrage.gif/revision/latest?cb=20180716020436"hb3（Barrage）<br>在你的周围射出一圈圈箭矢hb4')
		.replace(/ Spiral Dance/g, 'hb1 幽灵之舞hb2"https://vignette.wikia.nocookie.net/median-xl/images/5/5c/Spiral_Dance.gif/revision/latest?cb=20180318023358"hb3（Spiral Dance）<br>近战攻击释放出旋转的幽灵，在短暂延迟后造成伤害hb4')
		.replace(/ Familiar/g, 'hb1 魔仆hb2"https://vignette.wikia.nocookie.net/median-xl/images/9/97/Familiar_%28Skill%29.png/revision/latest?cb=20180206024152"hb3（Familiar）<br>召唤 - 小黑豹，为队伍提供增加精力、施法速度和技能等级的光环b4')
		.replace(/ Dragonlore/g, 'hb1 巨龙传说hb5（Dragonlore）<br>被动 - 增强你的火焰，寒冷，闪电和魔法伤害hb4')
		.replace(/ Ecstatic Frenzy/g, 'hb1 狂喜之怒hb2"https://vignette.wikia.nocookie.net/median-xl/images/e/e4/Ecstatic_Frenzy.gif/revision/latest?cb=20180122014142"hb3（Ecstatic Frenzy）<br>Buff - 增加攻速、移速和魔法伤害，但是防御变成0hb4')
		.replace(/ Rapid Wyrmshot/g, 'hb1 迅捷翼龙击hb2"https://vignette.wikia.nocookie.net/median-xl/images/1/1a/Rapid_Wyrmshot.gif/revision/latest?cb=20190302180716"hb3（Rapid Wyrmshot）<br>射出口吐尖刺伤害附近敌人的飞龙hb4')
		.replace(/ Superbeast/g, 'hb1 超级野兽hb5（Superbeast）<br>Buff - 变身成影兽，增加法术伤害hb4')
		.replace(/ Amplify Damage/g, 'hb1 伤害加深hb5（Amplify Damage）<br>诅咒 - 增加敌人受到的伤害hb4')
		.replace(/ Rain of Fire/g, 'hb1 火雨hb2"https://vignette.wikia.nocookie.net/median-xl/images/3/3a/Rain_of_Fire.gif/revision/latest?cb=20180206025706"hb3（Rain of Fire）<br>法术 - 将敌人作为目标，短暂延迟后降下扩散的火雨hb4')
		.replace(/ Hailstorm/g, 'hb1 冰雹暴风hb2"https://vignette.wikia.nocookie.net/median-xl/images/d/df/Hailstorm.gif/revision/latest?cb=20171009183123"hb3（Hailstorm）<br>法术 - 将敌人作为目标，短暂延迟后降下冰霜尖刺hb4')
		.replace(/ Main Queen of Blades Projectiles/g, '刀锋女王的投射物')
		.replace(/ 刀锋女王/g, 'hb1 刀锋女王hb2"https://vignette.wikia.nocookie.net/median-xl/images/e/e3/Queen_of_Blades.gif/revision/latest?cb=20180207033329"hb3（Queen of Blades）<br>Buff - 定期向附近的敌人发射弹跳刀片hb4')
		.replace(/ Lightning Arena/g, 'hb1 闪电场hb2"https://vignette.wikia.nocookie.net/median-xl/images/8/89/Lightning_Arena.gif/revision/latest?cb=20171015141548"hb3（Lightning Arena）<br>Buff - 定期施放一个圆形的闪电场，伤害并击晕穿过的敌人hb4')
		.replace(/ Broadside/g, 'hb1 侧击炮hb2"https://vignette.wikia.nocookie.net/median-xl/images/b/b1/Broadside.gif/revision/latest?cb=20180207033325"hb3（Broadside）<br>临时召唤一个可以连发刀片的机械hb4')
		.replace(/ Dragonfire Oil/g, 'hb1 龙焰燃油hb5（Dragonfire Oil）<br>被动 - 武器增加火焰伤害hb4')
		.replace(/ Daedalus/g, 'hb1 代达罗斯hb5（Daedalus）<br>被动 - 增加你的生命、攻击准确和闪电伤害hb4')
		.replace(/ Way of the Phoenix/g, 'hb1 凤凰之道hb5（Way of the Phoenix）<br>被动 - 增加火焰法术伤害以及武器火焰伤害hb4')
		.replace(/ Way of the Gryphon/g, 'hb1 狮鹫之道hb5（Way of the Gryphon）<br>被动 - 增加闪电法术伤害以及武器闪电伤害hb4')
		.replace(/ Pounce/g, 'hb1 突袭hb2"https://vignette.wikia.nocookie.net/median-xl/images/f/fe/Pounce.gif/revision/latest?cb=20180716020441"hb3（Pounce）<br>瞬移到目标位置，打击范围内的敌人hb4')
		.replace(/ Mountain King/g, 'hb1 山岳之王hb5（Mountain King）<br>被动 - 按百分比增加所有属性hb4')
		.replace(/ Wolf Companion/g, 'hb1 白狼伙伴hb2"https://vignette.wikia.nocookie.net/median-xl/images/d/d0/Wolf_Companion.png/revision/latest?cb=20180122020719"hb3（Wolf Companion）<br>召唤一只无法被选中的白狼，它可以伤害并标记敌人，被标记的敌人受到更多物理伤害hb4')
		.replace(/ Windform/g, 'hb1 塑风hb2"https://vignette.wikia.nocookie.net/median-xl/images/4/4a/Windform.gif/revision/latest?cb=20180131200842"hb3（Windform）<br>在死亡之舞中与风成为一体，施放时增加防御，毒伤，击回hb4')
		.replace(/ Gift of Inner Fire/g, 'hb1 内燃之礼hb2"https://vignette.wikia.nocookie.net/median-xl/images/a/aa/Inner_Fire.gif/revision/latest?cb=20171009184343"hb3（Gift of Inner Fire）<br>用火的力量进行群体治疗hb4')
		.replace(/ Inner Fire/g, 'hb1 内燃hb2"https://vignette.wikia.nocookie.net/median-xl/images/a/aa/Inner_Fire.gif/revision/latest?cb=20171009184343"hb3（Inner Fire）<br>用火的力量对目标进行治疗hb4')
		.replace(/ Thunder Slam/g, 'hb1 摔雷hb2"https://vignette.wikia.nocookie.net/median-xl/images/6/6b/Thunder_Slam.gif/revision/latest?cb=20180123023503"hb3（Thunder Slam）<br>施放向外扩散的大范围雷暴伤害并击晕敌人hb4')
		.replace(/ Crane Stance/g, 'hb1 仙鹤姿态hb5（Crane Stance）<br>姿态 - 增加物理伤害和闪避hb4')
		.replace(/ Fire Elementals/g, 'hb1 火元素hb2"https://vignette.wikia.nocookie.net/median-xl/images/b/b1/Fire_Elemental_Skill.png/revision/latest?cb=20180122020424"hb3（Fire Elementals）<br>召唤 - 使用火焰法术，治疗友方，伤害敌人的火元素hb4')
		.replace(/ Ice Elementals/g, 'hb1 冰元素hb2"https://vignette.wikia.nocookie.net/median-xl/images/3/35/Ice_Elemental.png/revision/latest?cb=20180206024205"hb3（Ice Elementals）<br>召唤 - 可以施放冰霜新星的冰元素，并携带光环，增加冰抗、最大冰抗和宠物伤害hb4')
		.replace(/ Guardian Spirits/g, 'Guardian Spirit')
		.replace(/ Guardian Spirit/g, 'hb1 守卫者英灵（投掷）hb2"https://vignette.wikia.nocookie.net/median-xl/images/e/e2/Guardian_Spirit.png/revision/latest?cb=20180122020944"hb3（Guardian Spirit）<br>召唤使用双手投掷武器打击敌人的英灵hb4')
		.replace(/ Thundergod Nova/g, 'hb1 雷神新星hb2"https://vignette.wikia.nocookie.net/median-xl/images/4/49/Thundergod.gif/revision/latest?cb=20180122045316"hb3（Thundergod Nova）<br>雷神Buff生效时，发出的使敌人昏迷的雷神新星hb4')
		.replace(/ Thundergod/g, 'hb1 雷神hb2"https://vignette.wikia.nocookie.net/median-xl/images/4/49/Thundergod.gif/revision/latest?cb=20180122045316"hb3（Thundergod）<br>Buff - 提升25武器伤害，攻击造成昏迷，并发出使敌人昏迷的雷神新星hb4')
		.replace(/ Lightning Shield adds 15 - 25 Lightning Damage to Weapon per Skill Level/g, '每级 Lightning Shield 增加 15 - 25 的闪电伤害至武器')
		.replace(/ Lightning Shield/g, 'hb1 闪电护盾hb2"https://vignette.wikia.nocookie.net/median-xl/images/5/5d/Lightning_Shield.gif/revision/latest?cb=20180219195943"hb3（Lightning Shield）<br>Buff - 给附近成员套上闪电护盾，对攻击者造成闪电伤害hb4')
		.replace(/ Iceburst/g, 'hb1 寒冰爆发hb2"https://vignette.wikia.nocookie.net/median-xl/images/0/05/Iceburst.gif/revision/latest?cb=20180123025439"hb3（Iceburst）<br>攻击时施放极地风霜，造成冰冷伤害，降低敌人的移速和冰冷抗性hb4')
		.replace(/ Nephalem Spirit/g, 'hb1 奈非天之灵hb2"https://vignette.wikia.nocookie.net/median-xl/images/f/fc/Nephalem_Spirit.png/revision/latest?cb=20180122021143"hb3（Nephalem Spirit）<br>召唤奈非天之灵，基于你的力、敏、体给与团队成员增加元素伤害hb4')
		.replace(/ Thorn Strike/g, 'hb1 荆棘击hb2"https://vignette.wikia.nocookie.net/median-xl/images/f/f1/Thorn_Strike.gif/revision/latest?cb=20180124024928"hb3（Thorn Strike）<br>投射物 - 在面前射出一排刺穿地面的尖刺攻击敌人hb4')
		.replace(/ Laughing Ghost/g, 'hb1 尖笑鬼魂hb2"https://vignette.wikia.nocookie.net/median-xl/images/b/b6/Laughing_Ghost.gif/revision/latest?cb=20180320044040"hb3（Laughing Ghost）<br>投射物 - 射出一个向前跳跃并爆炸的骨头，爆炸中心的敌人会受到多次伤害hb4')
		.replace(/ Level 20 Eagle Stance/g, '等级 20 Eagle Stance')
		.replace(/ Eagle Stance/g, 'hb1 鹰姿态hb5（Eagle Stance）<br>姿态 - 增加生命偷取、恢复，法力恢复，但是降低你的攻速hb4')
		.replace(/ Hunting Banshee/g, 'hb1 狩猎恶灵hb2"https://vignette.wikia.nocookie.net/median-xl/images/0/0d/Hunting_Banshee.gif/revision/latest?cb=20180131213335"hb3（HuntingBanshee）<br>法术 - 发射自动追踪敌人并在终点施放冰环的恶灵hb4')
		.replace(/ Spike Rush/g, 'hb1 突突矛hb5（Spike Rush）<br>钢铁傀儡攻击技能hb4')
		.replace(/ Quill Storm/g, 'hb1 脊刺风暴hb2"https://vignette.wikia.nocookie.net/median-xl/images/8/83/Quill_Storm.gif/revision/latest?cb=20180124024909"hb3（Quill Storm）<br>投射物 - 发出大量尖刺自动射击附近的敌人hb4')
		.replace(/ Ravenous Flames/g, 'hb1 掠夺之火hb2"https://vignette.wikia.nocookie.net/median-xl/images/0/06/Ravenous_Flames.PNG/revision/latest?cb=20190302180716"hb3（Ravenous Flames）<br>光环 - 提供基础的范围燃烧、武器火伤、物抗以及生命回复<br>【燃烧伤害】<br>+1% / 6 体力<br>-1% / 10 精力<br>【燃烧范围】<br>+1% / 13 精力<br>-1% / 20 敏捷<br>【武器火伤】<br>1.5 / 1 敏捷<br>-1 / 1 力量<br>【物理抗性】<br>+%1 / 60 力量<br>-1% / 120 体力<br>【生命恢复】+1 / 6 体力hb4')
		.replace(/ Boneyard/g, 'hb1 坟场hb2"https://vignette.wikia.nocookie.net/median-xl/images/7/75/Boneyard.gif/revision/latest?cb=20180128010122"hb3（Boneyard）<br>法术 - 召唤一个穿透的幽灵长矛，在撞击时爆炸，造成物理魔法混合伤害hb4')
		.replace(/ Blood Skeleton/g, 'hb1 鲜血骷髅hb5（BloodSkeleton）<br>召唤带有狰狞面容光环的骷髅为你而战<br>光环 - 增加队伍物理攻击和压碎性打击（CB）hb4')
		.replace(/ Grim Vision Aura/g, 'hb1 狰狞面容光环hb5（Grim Vision Aura）<br>光环 - 增加队伍物理攻击和压碎性打击（CB）hb4')
		.replace(/ Improved Soulbond Effect/g, '增强 Soulbond 的效果')
		.replace(/ Soulbond/g, 'hb1 灵魂纽带hb2"https://docs.median-xl.com/images/skillicons/necromancer/HowlingTotem.gif"hb3（Soulbond）<br>被动 - 增加图腾的伤害，当所有元素图腾存在时，增加角色的击杀回血（LAEK）hb4')
		.replace(/ Bend the Shadows/g, 'hb1 扭曲阴影hb2"https://vignette.wikia.nocookie.net/median-xl/images/d/d7/Bend_the_Shadows.gif/revision/latest?cb=20180207023514"hb3（Bend the Shadows）<br>传送至目标仆从位置hb4')
		.replace(/ Carnage/g, 'hb1 残杀hb2"https://vignette.wikia.nocookie.net/median-xl/images/2/26/Carnage.gif/revision/latest?cb=20180207023515"hb3（Carnage）<br>攻击 - 通过你的武器引导一个火热的冲击波，造成物理、火焰混合伤害hb4')
		.replace(/ Parasite Gains 12 Additional Targets/g, 'Parasite 增加 12 个弹射目标')
		.replace(/ Parasite/g, 'hb1 寄生hb2"https://vignette.wikia.nocookie.net/median-xl/images/8/8a/Parasite.gif/revision/latest?cb=20180131201857"hb3（Parasite）<br>攻击 - 释放一个在多个目标之间跳跃的血食者，造成物理、魔法混合伤害hb4')
		.replace(/ Flametail Shot/g, 'hb1 焰尾击hb2"https://vignette.wikia.nocookie.net/median-xl/images/b/b4/Flametail_Shot.gif/revision/latest?cb=20180322015015"hb3（Flametail Shot）<br>抛射物 - 发射始终刺穿的炼金术火箭，增加命中并造成物理伤害hb4')
		.replace(/ Death Shards/g, 'hb1 死亡碎片hb2"https://vignette.wikia.nocookie.net/median-xl/images/0/0e/Death_Shards.gif/revision/latest?cb=20180322015015"hb3（Death Shards）<br>投射物 - 将尸体爆炸发出多个致命的箭矢，造成物理伤害hb4')
		.replace(/ Widowmaker/g, 'hb1 寡妇制造者hb2"https://vignette.wikia.nocookie.net/median-xl/images/b/b1/Widowmaker.gif/revision/latest?cb=20180322015016"hb3（Widowmaker）<br>投射物 - 在目标出施放大量箭矢造成多段物理伤害hb4')
		.replace(/ Apocalypse/g, 'hb1 天启hb2"https://vignette.wikia.nocookie.net/median-xl/images/7/70/Apocalypse.gif/revision/latest?cb=20171009160027"hb3（Apocalypse）<br>使附近的敌人受到火焰伤害hb4')
		.replace(/ Funeral Pyre/g, 'hb1 火葬堆hb2"https://vignette.wikia.nocookie.net/median-xl/images/3/33/Funeral_Pyre.gif/revision/latest?cb=20180128011315"hb3（Funeral Pyre）<br>在目标怪物周围区域造成火焰伤害，持续时间为5秒hb4')
		.replace(/ Immersion/g, 'hb1 洗礼hb2"https://vignette.wikia.nocookie.net/median-xl/images/6/6e/Immersion.gif/revision/latest?cb=20180206211126"hb3（Immersion）<br>法术 - 基于失去的法术力造成伤害的能量波hb4')
		.replace(/ Venomcloud Totem/g, 'hb1 剧毒之云图腾hb5（Venomcloud Totem）<br>尸体图腾 - 向附近的敌人施放剧毒气体hb4')
		.replace(/ Night Hawks/g, 'hb1 夜鹰hb5（Night Hawks）<br>召唤 - 发起自杀性袭击的仆从hb4')
		.replace(/ Fireheart Totem/g, 'hb1 火焰之心图腾hb5（Fireheart Totem）<br>尸体图腾 - 向附近的敌人施放爆炸性火球hb4')
		.replace(/ 's Eruption/g, '施放 hb1火山爆发hb5（Eruption）<br>法术 - 对敌人造成火焰伤害hb4 时')
		.replace(/ Veil King/g, 'hb1 帷幕之王hb2"https://vignette.wikia.nocookie.net/median-xl/images/d/d3/Veil_King.png/revision/latest?cb=20180131203919"hb3（Veil King）<br>召唤 - 强大的帷幕之王<br>范围攻击<br>5% 的几率致命毒素攻击<br>50% 复活为：帷幕恐惧<br><span class="hbred">警告：死亡时会变成敌对状态</span>hb4')
		.replace(/ Holy: Plague/g, '神圣系：hb1瘟疫hb5（Plague）<br>被动 - 为武器增加毒素伤害hb4')
		.replace(/ Blood Thorns/g, 'hb1 血棘hb2"https://vignette.wikia.nocookie.net/median-xl/images/f/f2/Blood_Thorns.gif/revision/latest?cb=20180129021956"hb3（Blood Thorns）<br>在一个地区发出灼烧荆棘的攻击hb4')
		.replace(/ Hymn/g, 'hb1 赞歌hb5（Hymn）<br>Buff - 增加队伍的击中回复生命hb4')
		.replace(/ Graveyard/g, 'hb1 墓场hb2"https://vignette.wikia.nocookie.net/median-xl/images/6/63/Graveyard.gif/revision/latest?cb=20180207023516"hb3（Graveyard）<br>Buff - 定期向附近敌人施放天谴技能hb4')
		.replace(/ Symphony of Destruction/g, 'hb1 毁灭交响曲hb2"https://vignette.wikia.nocookie.net/median-xl/images/b/be/Symphony_of_Destruction.gif/revision/latest?cb=20180129022949"hb3（Symphony of Destruction）<br>Buff - 间断性的对附近的敌人造成毒素伤害。hb4')
		.replace(/ Lemures/g, 'hb1 夜游魂hb2"https://vignette.wikia.nocookie.net/median-xl/images/9/9a/Lemures.gif/revision/latest?cb=20180129021612"hb3（Lemures）<br>攻击时会发出多个造成冰冷伤害的幽灵hb4')
		.replace(/ Shunpo/g, 'hb1 瞬步hb5（Shunpo）<br>传送到敌人身上，并造成范围伤害 hb4')
		.replace(/ Pyroblast/g, 'hb1 炎爆术hb2"https://vignette.wikia.nocookie.net/median-xl/images/0/05/Pyroblast.gif/revision/latest?cb=20180318024158"hb3（Pyroblast）<br>发出缓慢移动的燃烧石块，撞击时爆炸hb4')
		.replace(/ Living Flame/g, 'hb1 灵焰hb5（Living Flame）<br>被动 - 增加最大生命值和生命恢复速度hb4')
		.replace(/ Fire Cannonade/g, 'hb1 火焰连发hb5（Fire Cannonade）<br>向同一个方向一次性射出大量火球hb4')
		.replace(/ Emerald Prison/g, 'hb1 翡翠牢笼hb2"https://vignette.wikia.nocookie.net/median-xl/images/d/d1/Emerald_Prison.gif/revision/latest?cb=20171009182734"hb3（Emerald Prison）<br>在目标敌人周围制造一圈装满毒药的水晶球，触碰式爆炸hb4')
		.replace(/ Forked Lightning/g, 'hb1 分叉闪电hb2"https://vignette.wikia.nocookie.net/median-xl/images/6/68/Forked_Lightning.gif/revision/latest?cb=20180206205400"hb3（Forked Lightning）<br>投射多个闪电箭来烧焦你的敌人hb4')
		.replace(/ Psicrown/g, 'hb1 通灵环hb2"https://vignette.wikia.nocookie.net/median-xl/images/c/ce/Psicrown.gif/revision/latest?cb=20171015152149"hb3（Psicrown）<br>发出一圈可以追踪敌人的球体，基于法力值造成伤害hb4')
		.replace(/ Force Blast/g, 'hb1 原力爆hb5（Force Blast）<br>击退，并降低敌人的法术伤害和施法速度hb4')
		.replace(/ Firedance/g, 'hb1 烈焰舞步hb2"https://vignette.wikia.nocookie.net/median-xl/images/7/7f/Firedance.gif/revision/latest?cb=20180318023650"hb3（Firedance）<br>在自身周围形成一圈火焰，站在圈内的友方单位都会受物理伤害和元素法术伤害的加成hb4')
		.replace(/ Magic Missiles/g, 'hb1 魔法飞弹hb2"https://vignette.wikia.nocookie.net/median-xl/images/f/f9/Magic_Missiles.gif/revision/latest?cb=20180716020439"hb3（Magic Missiles）<br>法术 - 发射中距离追踪的魔法飞弹<br>每 5 级增加投射物（最多15弹）hb4')
		.replace(/ ATMG Sentry/g, 'hb1 机枪岗哨hb2"https://vignette.wikia.nocookie.net/median-xl/images/d/d3/ATMG.gif/revision/latest?cb=20171009161529"hb3（ATMG Sentry）<br>陷进 - 丢下一个自动射击的机枪岗哨hb4')
		.replace(/ Cluster Bomb/g, 'hb1 子母弹hb2"https://vignette.wikia.nocookie.net/median-xl/images/f/f9/Cluster_Bomb.gif/revision/latest?cb=20180408015144"hb3（Cluster Bomb）<br>扔出一枚炸弹，落地后炸开并散落一地的火焰碎片hb4')
		.replace(/ Powder Keg/g, 'hb1 火药桶hb2"https://vignette.wikia.nocookie.net/median-xl/images/f/f3/Powder_Keg.gif/revision/latest?cb=20180328222229"hb3（Powder Keg）<br>抛出一个火药桶，稍后点燃引信爆炸。hb4')
		.replace(/ Scepter Mastery/g, 'hb1 权杖支配hb5（Scepter Mastery）<br>被动 - 增加权杖类武器的伤害和命中hb4')
		.replace(/ Scorpion Blade/g, 'hb1 蝎刀hb2"https://vignette.wikia.nocookie.net/median-xl/images/1/1b/Scorpion_Blade.gif/revision/latest?cb=20180208043130"hb3（Scorpion Blade）<br>投射多个剧毒的飞刀hb4')






    //怪物
    //普通
    .replace(" Random monster", ' 随机怪物')
    .replace(/ Knight of Famine/g, '<span style="color:gray;"> 饥荒骑士（Knight of Famine）</span>')
    .replace(/ Blur/g, '<span style="color:gray;"> 小恶魔（Blur）</span>')
    .replace(/ Parrot \(Critter\)/g, '<span style="color:gray;"> 性感鹦鹉在线卖萌</span>')
    .replace(/ Fallen Shaman/g, '<span style="color:gray;"> 沉沦魔萨满（Fallen Shaman）</span>')
    .replace(/ Flesh Clan/g, '<span style="color:gray;">  羊头人战士（Flesh Clan）</span>')
    .replace(/ Venom Fiend/g, '<span style="color:gray;"> 毒魔（Venom Fiend）</span>')
    .replace(/ Condemned/g, '<span style="color:gray;"> 火人（Condemned）</span>')
    .replace(/ Moon Knight/g, '<span style="color:gray;"> 月亮骑士（Moon Knight）</span>')
    .replace(/ Banshee/g, '<span style="color:gray;"> 女妖（Banshee）</span>')
    .replace(/ Horror Arche/g, '<span style="color:gray;"> 恐怖射手（Horror Arche）</span>')
    .replace(/ Burning Dead Archer/g, '<span style="color:gray;"> 燃烧射手（Burning Dead Archer）</span>')
    .replace(/ Bone Archer/g, '<span style="color:gray;"> 骷髅射手（Bone Archer）</span>')
    .replace(/ Acid Beast/g, '<span style="color:gray;"> 酸液兽（Acid Beast）</span>')
    .replace(/ Zombie/g, '<span style="color:gray;"> 僵尸（Zombie）</span>')
    .replace(/ Infernal Lord/g, '<span style="color:gray;"> 炼狱领主（Infernal Lord）</span>')
    .replace(/ Crystal Lord/g, '<span style="color:gray;"> 水晶领主（Crystal Lord）</span>')
    .replace(/ Frozen Lord/g, '<span style="color:gray;"> 寒冰领主（Frozen Lord）</span>')
    .replace(/ Skeleton/g, '<span style="color:gray;"> 骷髅（Skeleton）</span>')
    .replace(/ Obsidian Lord/g, '<span style="color:gray;"> 黑曜石领主（Obsidian Lord）</span>')


    //未分类
    .replace(/ Veil Terror/g, ' 恐惧帷幕（Veil Terror）')
    .replace(/ Asatruar/g, ' 阿萨特鲁信徒（Asatruar）')


    //精英
    .replace(/Sleeping Cave Snapper/g, '<span style="color:yellow;">钱包怪（Sleeping Cave Snapper）</span>')
    .replace(/ Void Archon/g, '<span style="color:yellow;">  虚空执政官（Void Archon）</span>')
    .replace(/ Buzzsaw/g, '<span style="color:yellow;">  把子骚（Buzzsaw）</span>')
    .replace(/ Serafiend/g, '<span style="color:yellow;">  恶魔统领（Serafiend）</span>')
    .replace(/ Silverbolt/g, '<span style="color:yellow;">  银弹（Silverbolt）</span>')

    //Uber
    .replace(/ Slain Soul/g, '<span style="color:#c70000;"> 失魂者（ Slain Soul）</span>')
    .replace(/ Umbaru Spirit/g, '<span style="color:#c70000;"> 部族巫师（Umbaru Spirit）</span>')
    .replace(/ Necrobot/g, '<span style="color:#c70000;"> 死灵机器人（Necrobot）</span>')
    .replace(/ Dark Templar/g, '<span style="color:#c70000;"> 黑暗圣堂（Dark Templar）</span>')
    .replace(/ Goliath/g, '<span style="color:#c70000;"> 巨人（Goliath）</span>')
    .replace(/ Horadric Mage/g, '<span style="color:#c70000;"> 赫拉迪克法师（Horadric Mage）</span>')
    .replace(/ Philios, Priestess of Hefaetrus/g, '<span style="color:#c70000;"> 菲力奥斯, 赫法崔斯祭司</span>')
    .replace(/ Lycander, Priestess of Zerae/g, '<span style="color:#c70000;"> 莱姗德, 泽瑞伊祭司</span>')
    .replace(/ Skovos, Priestess of Karcheus/g, '<span style="color:#c70000;"> 斯科沃斯, 卡丘斯祭司</span>')
    .replace(/ Ratfink/g, '<span style="color:#c70000;"> 芬克鼠（Ratfink）</span>')
    .replace(/ Death Projector/g, '<span style="color:#c70000;"> 死亡发射器（Death Projector）</span>')
    .replace(/ Mazi's Eidolon/g, '<span style="color:#c70000;"> 大巫师幻象（Mazi\'s Eidolon）</span>')
    .replace(/ RC-2 Heavy Drone/g, '<span style="color:#c70000;"> RC-2 重型机甲（RC-2 Heavy Drone）</span>')
    .replace(/ RC-1 Light Drone/g, '<span style="color:#c70000;"> RC-1 轻型机甲（RC-1 Light Drone）</span>')
    .replace(/ Magineer/g, '<span style="color:#c70000;"> 魔法机甲（Magineer）</span>')
    .replace(/ AC-1 Hammer Bot/g, '<span style="color:#c70000;"> AC-1 猛锤机器人（AC-1 Hammer Bot）</span>')
    .replace(/ AC-2 Rivet Bot/g, '<span style="color:#c70000;"> AC-2 精工机器人（AC-2 Rivet Bot）</span>')
    .replace(/ Henchman/g, '<span style="color:#c70000;"> 鼠人追随者（Henchman）</span>')


//其他
    .replace(/Set Bonus with 2 or more set items:/g, '装备2件以上时额外加成：')
    .replace(/Set Bonus with 3 or more set items:/g, '装备3件以上时额外加成：')
    .replace(/Set Bonus with 4 or more set items:/g, '装备4件以上时额外加成：')
    .replace(/Set Bonus with complete set:/g, '装备全套时额外加成：')
    .replace(/of Minion Damage Increases Added as/g, '的增强仆从伤害加成至')
    .replace(/of Minion Life Increases Added as Total Character Defense/g, '的增强仆从生命加成至角色整体防御')
    .replace(/Your Attacks Ignore the Physical Resistance of the Undead/g, '忽视不死生物的防御')
    .replace(/Grants 1% Deadly Strike Per Base Level/g, '每基础等级额外增加 1% 的 Deadly Strike')
    .replace(/has Twice as Many Firebolts/g, '双份不加价')
    .replace(/Deal No Elemental or Magic Damage/g, '不再造成元素和魔法伤害')
    .replace(/Deal No Fire, Lightning or Cold Damage/g, '不再造成火焰、闪电和冰冷伤害')
    .replace(/Unholy: /g, '不洁系：')
    .replace(/ \+50% Total Vessel Damage Bonus from Passives/g, '化身来自被动的伤害加成提高 50%')
    .replace(/Neutrality:/g, '中立系：')
    .replace(/Deal 40%/g, '造成 40%')
    .replace(/adds Deadly Strike Instead of Spell Damage/g, '增加法术伤害改为 Deadly Strike')
    .replace(/Jinn Inherit Iron Golem's Regeneration/g, '魔灵继承钢铁石魔的恢复力')
    .replace(/When You Have All Four Totem/g, '当场上 4 种图腾都在时')
    .replace(/Total Defense Reduced by/g, '角色整体防御降低')
    .replace(/Only Gains 1 Projectile per 7 Base Levels/g, '每 7 点基础技能增加投射物降低为 1')
    .replace(/ Extra Totem/g, ' 额外的图腾')
    .replace(/This Fire Damage Increases by 10% For Each Base Level in the Crossbow Tree/g, '每 1 投入点十字弓系的技能点，增加上述火焰伤害 10%')
    .replace(/Life Leech to/g, '生命偷取至')
    .replace(/Enhanced Stance Radius/g, '增加姿态半径')
    .replace(/When Iron Golem Consumes This Item/g, '当该装备转化为钢铁傀儡时灰色词条生效')
    .replace(/Adds 1 - 3 Fire, Cold and Lightning Damage to Weapon per 1 Strength Factor/g, '每点力量因子为武器增加 1 - 3 的火焰、冰冷和闪电伤害')
    .replace(/Deathlord Morph/g, '皮肤 - 死亡领主形态')
    .replace(/Treewarden Morph/g, '皮肤 - 树人守卫形态')
    .replace(/If You Have no Points in the Stance Tree/g, '灰色词条在姿态系技能投入为0时生效')
    .replace(/Inherit 100% of Your Deadly Strike/g, '继承角色的致命一击（DS）')
    .replace(/Damage Leeched as Life/g, '造成的伤害转化为生命')
    .replace(/Targets to/g, '额外的目标至')
    .replace(/While Dual Wielding This Weapon/g, '持有两件该装备时')
    .replace(/Does Not Reduce Your/g, '不再降低你的')
    .replace(/If You Have at Least 1000 Strength, Knockback Enemies/g, '力量≥1000时，攻击附带击退效果')
    .replace(/Adds 100% of Your Fire Spell Damage as Bonus Weapon Physical Damage/g, '100% 的火焰法术伤害 加成至 武器物理伤害')
    .replace(/Adds 100% of Your Physical\/Magic Spell Damage as Bonus Weapon Physical Damage/g, '100%的物理/魔法法术伤害 加成至 武器物理伤害')
    .replace(/ Shoots 1 Projectile/g, ' 仅射出一支')
    .replace(/Gives the following stats per each socketed Great Rune, and 0.7 per Elemental Rune./g, '镶嵌的符文作用于灰色属性，高级符文100%，元素符文70%')
    .replace(/Life after each Demon Kill/g, '生命于杀死恶魔型怪物时')
    .replace(/ Cooldown Cannot be Reduced Below/g, ' 的冷却时间无法低于')
    .replace(/Based on Character Level/g, '基于角色等级')
    .replace(/Based on/g, '基于')
    .replace(/ Skill Levels/g, ' 技能等级')
    .replace(/Maximum Skill Level increased by 1/g, '技能等级上限 +1')
    .replace(/Jitan\'s Gate Cooldown reduced by 1 second/g, '吉坦之门的冷却时间缩短 1 秒')
    .replace(/ Skill Level/g, ' 的等级')
    .replace(/ Strength as/g, '力量作为')
    .replace(/ Dexerity as/g, '敏捷作为')
    .replace(/ Vitality as/g, '体力作为')
    .replace(/ Energy as/g, '精力作为')
    .replace(/Otherwise,/g, '其他情况，')
    .replace(/If Wielded by a Mercenary,/g, '佣兵装备时，')
    .replace(/Only Affects You/g, '仅对你生效')
    .replace(/Until Level /g, '等级不到 Lv.')
    .replace(/After Level /g, '等级超过 Lv.')
    .replace(/of Vitality Added as Cold Damage to Weapon/g, '基于体力值的冰冷伤害加成至武器')
    .replace(/Deal no Fire, Lightning, Poison or Magic Damage/g, '火焰、闪电、毒素和魔法伤害无效化')
    .replace(/second Cooldown to/g, '秒的冷却时间至')
    .replace('Single rune runewords', '<span class="genflat">一枚符文的神符之语</span>')
    .replace('Grey items only!', '<span class="genflat">只能用于灰色装备！</span>')
    .replace('Many runewords contain only one rune, but you can fill up the sockets <u>before</u> the rune with jewels. To make a runeword in an item with 4 sockets, for example, <span class="item-red">you must</span> insert 3 jewels + 1 rune.</p>',
             '许多神符之语仅需要一枚符文，但是你需要在镶嵌这枚符文之前，用珠宝填满前面的孔。<br>举个栗子，有一件装备有4个孔，你必须在<span class="item-red">镶嵌 3 枚珠宝之后，在最后一个孔里镶嵌入对应符文</span>。')
    .replace("Some people do not seem to know this. You can only make runewords in nonmagical socketed \(grey\) items!", '很多人看来不知道，你只能在普通带孔装备（灰色）上装备神符之语！')

    .replace('Advanced runes', '<span class="genflat">高级符文</span>')
    .replace('Some runes drop only in certain levels, while others are made using a recipe.',
             '高级符文只出产于高级场景，还有一些需要用到合成公式。')
    .replace(/ contains 537 all-new runewords./g, ' 包含了 537 个全新的神符之语')
    .replace(/LIST OF RUNEWORDS/g, '神符之语图鉴')
    .replace(/RUNEWORDS/g, '神符之语')
    .replace(/except /g, '除了 ')
    .replace(/Cannot be Unsocketed/g, '无法取出镶嵌物')
    .replace(/Leeches no Mana/g, '不再汲取法力')


  //装备属性词条
    .replace(/ of Your Total Character Defense Bonus Added as Vitality/g, ' 的角色总防御加成到体力')
    .replace(/ Weapon Physical Damage if Wielding a/g, ' 增加武器物理伤害当使用')
    .replace(/Freezes Target/g, '冻结目标')
    .replace(/Ethereal \(Cannot be Repaired\)/g, '无形（无法修复）')
    .replace(/Pierce Chance to/g, '穿刺几率至')
    .replace(/ Physical Resist/g, ' 物理抗性')
    .replace(/Slower Stamina Drain/g, '降低耐力消耗')
    .replace(/ Cooldown Reduced by/g, ' 冷却时间缩短')
    .replace(/ Weapon Damage Added/g, ' 武器伤害加成')
    .replace(/ Converted to Physical/g, ' 转换为 物理伤害')
    .replace(/ Bonus Lightning Damage /g, ' 闪电伤害加成 ')
    .replace(/ as Bonus Physical Damage/g, ' 作为物理伤害')
    .replace(/0 Attributes/g, '0点属性')
    .replace(/While Using/g, '当使用')
    .replace(/ Second Cooldown to /g, ' 秒的冷却时间至 ')
    .replace(/Magic Damage to/g, '魔法伤害至')
    .replace(/of Crushing Blow added as Fire and Cold Spell Damage/g, '的压碎性打击（CB）加成至火焰和冰冷法术伤害')
    .replace(/Area Effect Attack/g, '范围攻击')
    .replace(/100% Chance to Cast on Attack<br>/g, '')
    .replace(/100% Chance to Cast on Attack:/g, '')
    .replace(/Deals 100% normal attack damage in a radius of 5 yards./g, '攻击时在 5 码范围内造成 100% 的普通伤害')
    .replace(/Thunderfury/g, '雷霆之怒')
    .replace(/50% Chance to Cast on Attack<br>/g, '攻击时有 50% 的机会施放 充能弹<br>')
    .replace(/50% Chance to Cast on Attack:/g, '攻击时有 50% 的机会施放 充能弹:')
    .replace(/Emits charged bolts that do 75% normal attack damage as lightning./g, '充能弹为闪电伤害，伤害值是普通攻击的 75%')
    .replace(/25% Chance to Cast on Attack<br>/g, '攻击时有 25% 的机会施放<br>')
    .replace(/5% Chance to Cast on Attack<br>/g, '攻击时有 5% 的机会施放<br>')
    .replace(/25% Chance to Cast on Attack:/g, '攻击时有 25% 的机会施放:')
    .replace(/5% Chance to Cast on Attack:/g, '攻击时有 5% 的机会施放:')
    .replace(/Grants 100% damage avoidance for 1.6 seconds./g, '躲避所有伤害 1.6 秒')
    .replace(/Reduces target physical resistance by -25% for 2 seconds./g, '降低目标物抗 2 秒')
    .replace(/Amazing Grace/g, '奇异恩典')
    .replace(/Mega Impact/g, '百万冲击')
    .replace(/Less Gold from Monsters/g, '减少金币掉落')
    .replace(/ Bonus Elemental Damage to/g, ' 增加元素伤害至')
    .replace(/Drains 2% Life per Second/g, '每秒流失2%的生命')
    .replace(/ second Cooldown to Blade Spirits/g, ' 秒刀刃之灵冷却时间')
    .replace(/ over 2 seconds/g, '2秒内')
    .replace(/ Increased Mana Pulse Duration/g, ' 提升法力波动持续时间')
    .replace(/ Chance to cast level /g, ' 的机会施展等级 ')
    .replace(/ Hit Recovery/g, ' 快速打击恢复（FHR）')
    .replace(/ Block Speed/g, ' 格挡速度（FBR）')
    .replace(/ on Kill/g, ' 当杀死怪物')
    .replace(/ Enhanced Damage/g, ' 增强伤害（ED）')
    .replace(/ Enhanced damage/g, ' 增强伤害（ED）')
    .replace(/ Enhanced Weapon Damage/g, '增强武器伤害（EWD）')
    .replace(/ Bonus to Attack Rating/g, ' 额外准确率（AR）')
    .replace(/ Bonus to All Attributes /g, ' 所有属性')
    .replace(/ to All Attributes/g, ' 所有属性')
    .replace(/ Gold Find/g, ' 更多金币')
    .replace(/ to Light Radius/g, ' 照亮范围')
    .replace(/ Bonus Damage to/g, ' 更多伤害至')
    .replace(/ Increased Attack Speed/g, ' 增加攻速（IAS）')
    .replace(/ Attack Speed/g, ' 增加攻速（IAS）')
    .replace(/Adds /g, '增加 ')
    .replace(/ cold damage/g, ' 的冰冷伤害')
    .replace(/ poison damage/g, ' 的毒素伤害')
    .replace(/ fire damage/g, ' 的火焰伤害')
    .replace(/ lightning damage/g, ' 的闪电伤害')
    .replace(/ magic damage/g, ' 的魔法伤害')
    .replace(/ Magic Damage/g, ' 魔法伤害')
    .replace(/ to Maximum Damage/g, ' 最大伤害')
    .replace(/Based on Character Level/g, '基于角色等级')
    .replace(/ to all Attributes/g, ' 至所有属性')
    .replace(/ on Melee Attack/g, ' 当近战攻击时')
    .replace(/ to All Skills/g, ' 所有技能')
    .replace(/ to Minimum Damage/g, ' 最小伤害')
    .replace(/ Damage Reflected/g, ' 伤害反弹')
    .replace(/Stun Attack/g, '晕眩攻击')
    .replace(/ Bonus to Summoned Minion Life/g, ' 召唤物生命')
    .replace(/ to Summoned Minion Life/g, ' 召唤物生命')
    .replace(/ Bonus to Energy Factor/g, ' 增加精力因子')
    .replace(/ Reanimate as/g, ' 复活为')
    .replace(/ Cast Speed/g, ' 快速施法（FCR）')
    .replace(/ Faster Cast Rate/g, ' 快速施法（FCR）')
    .replace(/ Life stolen per Hit/g, ' 生命偷取（LL）')
    .replace(/ Mana stolen per Hit/g, ' 法力偷取（LM）')
    .replace(/Maximum Fire Resist/g, '最大火焰抗性')
    .replace(/Maximum Cold Resist/g, '最大冰冷抗性')
    .replace(/Maximum Lightning Resist/g, '最大闪电抗性')
    .replace(/Maximum Poison Resist/g, '最大毒素抗性')
    .replace(/Maximum Fire Damage/g, '最大火焰伤害 ')
    .replace(/Maximum Cold Damage/g, '最大冰冷伤害 ')
    .replace(/Maximum Lightning Damage/g, '最大闪电伤害 ')
    .replace(/Maximum Poison Damage/g, '最大毒素伤害 ')
    .replace(/Enemy Fire Resistance/g, '敌人火焰抗性')
    .replace(/Enemy Cold Resistance/g, '敌人冰冷抗性')
    .replace(/Enemy Lightning Resistance/g, '敌人闪电抗性')
    .replace(/Enemy Poison Resistance/g, '敌人毒素抗性')
    .replace(/Enemy Fire Resist/g, '敌人火焰抗性')
    .replace(/Enemy Cold Resist/g, '敌人冰冷抗性')
    .replace(/Enemy Lightning Resist/g, '敌人闪电抗性')
    .replace(/Enemy Poison Resist/g, '敌人毒素抗性')
    .replace(/Enemy Fire and Lightning Resistsance/g, '敌人火焰和闪电抗性')
    .replace(/Enemy Fire and Lightning Resists/g, '敌人火焰和闪电抗性')
    .replace(/Fire Resist /g, '火焰抗性 ')
    .replace(/Slow Target /g, '减慢目标 ')
    .replace(/Cold Resist /g, '冰冷抗性 ')
    .replace(/Lightning Resist /g, '闪电抗性 ')
    .replace(/Poison Resist /g, '毒素抗性 ')
    .replace(/Elemental\/Magic Damage Reduced by /g, '受到元素/魔法伤害降低 ')
    .replace(/Damage Reduced by /g, '受到物理伤害降低（dr） ')
    .replace(/Physical Resist /g, '物理抗性 ')
    .replace(/Physical Damage Reduced by /g, '受到物理伤害降低（dr） ')
    .replace(/ Poison Spell Damage/g, ' 毒素法术伤害')
    .replace(/ Lightning Spell Damage/g, ' 闪电法术伤害')
    .replace(/ Cold Spell Damage/g, ' 冰冷法术伤害')
    .replace(/ Fire Spell Damage/g, ' 火焰法术伤害')
    .replace(/ Physical\/Magic Spell Damage/g, ' 物理/魔法伤害')
    .replace(/ Strength Factor to Spell Damage/g, ' 力量因子至法术伤害')
    .replace(/ Energy Factor to Spell Damage/g, ' 法力因子至法术伤害')
    .replace(/ to Spell Damage/g, ' 至所有法术伤害')
    .replace(/ Chance of Crushing Blow/g, ' 压碎性打击（CB）')
    .replace(/ Crushing Blow/g, ' 压碎性打击（CB）')
    .replace(/ Charges/g, ' 聚气')
    .replace(/ Combat Speeds/g, ' 所有战斗速度')
    .replace(/ Increased Healing Rate from Apples/g, '增加食用苹果的恢复效率')
    .replace(/ Chance of Uninterruptable Attack/g, ' 不间断攻击（UA）')
    .replace(/Total Character Defense Plus/g, '角色整体防御增加 ')
    .replace(/Total Character Defense /g, '角色整体防御 ')
    .replace(/ to Enemy Cold Resistance/g, ' 敌人冰冷抗性')
    .replace(/ to Enemy Poison Resistance/g, ' 敌人毒素抗性')
    .replace(/ to Enemy Fire Resistance/g, ' 敌人火焰抗性')
    .replace(/ to Enemy Lightning Resistance/g, ' 敌人冰冷抗性')
    .replace(/Increase Maximum Life and Mana /g, '增加最大生命和法力值 ')
    .replace(/Requirements /g, '需求 ')
    .replace(/ Damage to Demons/g, ' 对恶魔的伤害（DTD）')
    .replace(/ Life Regenerated per Second/g, ' 每秒生命恢复')
    .replace(/ Life on Striking/g, ' 击中时恢复生命')
    .replace(/ Mana on Striking/g, ' 击中时恢复法力')
    .replace(/ Life on Attack/g, ' 打击时恢复生命')
    .replace(/ Mana on Attack/g, ' 打击时恢复法力')
    .replace(/ Life after each Kill/g, ' 杀死怪物获取生命（LAEK）')
    .replace(/ Life After Each Kill/g, ' 杀死怪物获取生命（LAEK）')
    .replace(/ Mana after each Kill/g, ' 杀死怪物获取法力（MAEK）')
    .replace(/Target Takes Additional Damage of /g, '目标受到额外伤害 ')
    .replace(/Indestructible/g, '无法破坏')
    .replace(/ Movement Speed/g, ' 移动速度')
    .replace(/ Better Chance of Getting Magic Items/g, ' 更高几率获取魔法物品（MF）')
    .replace(/ Magic Find/g, ' 更高几率获取魔法物品（MF）')
    .replace(/Enhanced Weapon Damage /g, '增强武器伤害 ')
    .replace(/Hit Causes Monster to Flee /g, '击中使怪物逃跑')
    .replace(/Attacker Flees after Striking /g, '受到打击时恐吓怪物')
    .replace(/Half Freeze Duration/g, '冰冻时间减半')
    .replace(/Cannot Be Frozen/g, '无法冰冻')
    .replace(/Maximum Mana /g, '最大法力值 ')
    .replace(/Increase Maximum Life /g, '增加生命值 ')
    .replace(/Decrease Maximum Life /g, '减少最大生命值 ')
    .replace(/Maximum Life /g, '最大生命值 ')
    .replace(/Regenerate Mana /g, '法力恢复速度 ')
    .replace(/ Bonus to Buff\/Debuff\/Cold Skill Duration/g, '延长Buff/诅咒/冰冻技能的效果时间')
    .replace(/ Energy Factor to Spell Damage/g, ' 精力因子至法术伤害')
    .replace(/ to Enemy Elemental Resistances/g, ' 敌人元素抗性')
    .replace(/ to All Maximum Resistances/g, ' 最大元素抗性')
    .replace(/Maximum Elemental Resists/g, '最大元素抗性')
    .replace(/ to all vendor prices/g, ' 所有商品价格')
    .replace(/All Resists /g, '元素抗性 ')
    .replace(/Elemental Resists /g, '元素抗性 ')
    .replace(/ Deadly Strike/g, ' 致命一击（DS）')
    .replace(/ to Summoned Minion Resistances/g, ' 召唤物抗性')
    .replace(/ Bonus to Summoned Minion Damage/g, ' 召唤物伤害')
    .replace(/ to Summoned Minion Damage/g, ' 召唤物伤害')
    .replace(/ to Summoned Minion Attack Rating/g, ' 召唤物准确率')
    .replace(/ to Maximum Barbarian Minions/g, ' 野蛮人召唤物数量')
    .replace(/ to Maximum Necromancer Minions/g, ' 死灵法师召唤物数量')
    .replace(/ Damage to Undead/g, ' 对不死生物的伤害（DTU）')
    .replace(/ Defense vs. Missile/g, ' 对飞弹的防御')
    .replace(/Ignore Target's Defense/g, '忽视目标防御')
    .replace(/ over 1 seconds/g, '在1秒内')
    .replace(/ to Experience Gained/g, ' 经验获取')
    .replace(/ Life when Struck by an Enemy/g, '生命受打击时')
    .replace(/Mana when Struck by an Enemy/g, '法力受打击时')
    .replace(/ on Striking/g, ' 在打击时')
    .replace(/ when Struck/g, ' 受到打击时')
    .replace(/ when Attacked/g, ' 当击中时')
    .replace(/ on Death Blow/g, ' 当最后一击')
    .replace(/ when you Level-Up/g, ' 当升级时')
    .replace(/Slows Attacker by /g, ' 减慢攻击者 ')
    .replace(/Slows Ranged Attacker by /g, '减慢远程攻击者 ')
    .replace(/Slows Melee Target by /g, '减慢近战目标 ')
    .replace(/ Damage to The Zakarum/g, ' 对萨卡兰姆的伤害（DTZ）')
    .replace(/Attacker Takes Cold Damage of /g, '攻击者受到冰冷伤害 ')
    .replace(/Attacker Takes Fire Damage of /g, '攻击者受到火焰伤害')
    .replace(/You may Only use Melee, Summon and Support Skills/g, '仅可使用近战，召唤和支援技能')
    .replace(/ Base Block Chance/g, ' 基础格挡值')
    .replace(/Chance to Block/g, '基础格挡值')
    .replace(/class%/g, '鼠标来%')
    .replace(/ Bonus to Poison Skill Duration/g, ' 增加毒素技能持续时间')
    .replace(/Poison Length Reduced by /g, ' 中毒时间减少 ')
    .replace(/Lion Stance Damage Bonus /g, ' 狮子姿态伤害增加 ')
    .replace(/ Slower Block Rate/g, ' 降低格挡速度')
    .replace(/Cold Absorb /g, ' 冰冷吸收')
    .replace(/Fire Absorb /g, ' 火焰吸收')
    .replace(/Lightning Absorb /g, ' 闪电吸收')
    .replace(/Poison Absorb /g, ' 毒素吸收')
    .replace(/ Poison Damage to/g, ' 毒素伤害至')
    .replace(/ Fire Damage to/g, ' 火焰伤害至')
    .replace(/ Lightning Damage to/g, ' 闪电伤害至')
    .replace(/ Cold Damage to/g, ' 冰冷伤害至')
    .replace(/ Poison Damage/g, ' 毒素伤害')
    .replace(/ Fire Damage/g, ' 火焰伤害')
    .replace(/ Lightning Damage/g, ' 闪电伤害')
    .replace(/ Cold Damage/g, ' 冰冷伤害')
    .replace(/ Fire and Lightning Spell Damage/g, ' 火焰和闪电法术伤害')
    .replace(/ Chance to Avoid Damage/g, ' 躲避伤害')
    .replace(/Druid Morph/g, '德鲁伊形态')
    .replace(/Based on Blessed Life Skill Level/g, '基于 Blessed Life 的等级')
    .replace(/ when using an Apple/g, ' 当食用苹果时')
    .replace(/ Damage Taken Goes To Mana/g, ' 受到伤害转化为法力')
    .replace(/Attacker Takes Elemental Damage of /g, '攻击者受到元素伤害 ')
    .replace(/One-Hand Damage/g, '单手伤害')
    .replace(/Two-Hand Damage/g, '双手伤害')
    .replace(/Throw Damage/g, '投掷伤害')
    .replace(/Required Level/g, '需要等级')
    .replace(/Required Strength/g, '需要力量')
    .replace(/Required Dexterity/g, '需要敏捷')
    .replace(/Strength Damage Bonus/g, '力量伤害加成')
    .replace(/Dexterity Damage Bonus/g, '敏捷伤害加成')
    .replace(/ Duration Bonus to/g, ' 持续时间加成至')
    .replace(/Damage Bonus: /g, '伤害加成: ')
    .replace(/Bonus /g, '加成')
    .replace(/ per Strength/g, ' 每点力量')
    .replace(/ per Dexterity/g, ' 每点敏捷')
    .replace(/Orb Effects Applied to this Item are Quadrupled/g, '四倍通灵宝珠奖励')
    .replace(/Orb Effects Applied to this Item are Doubled/g, '双倍通灵宝珠奖励')
    .replace(/ Life regenerated per second/g, ' 每秒生命恢复')
    .replace(/ Curse Length Reduction/g, ' 减少诅咒时间')
    .replace(/ to Defense per Socketed Rune/g, ' 每颗已镶嵌的符文增强防御')
    .replace(/Life Stolen per Hit/g, '击中偷取生命')
    .replace(/Mana Stolen per Hit/g, '击中偷取法力')
    .replace(/Fire Spell Damage/g, '火焰法术伤害')
    .replace(/Lighting Spell Damage/g, '闪电法术伤害')
    .replace(/Poison Spell Damage/g, '毒素法术伤害')
    .replace(/Cold Spell Damage/g, '冰冷法术伤害')
    .replace(/Fire Pierce/g, '火焰穿透')
    .replace(/Lighting Pierce/g, '闪电穿透')
    .replace(/Poison Pierce/g, '毒素穿透')
    .replace(/Cold Pierce/g, '冰冷穿透')
    .replace(/no Longer Freezes Enemies/g, '不再冰冻敌人')
    .replace(/ Total Damage/g, ' 总伤害')


//套装名称
    .replace(/AMAZON SETS/g, '亚马逊套装图鉴')
    .replace(/ASSASSIN SETS/g, '刺客套装图鉴')
    .replace(/BARBARIAN SETS/g, '野蛮人套装图鉴')
    .replace(/DRUID SETS/g, '德鲁伊套装图鉴')
    .replace(/NECROMANCER SETS/g, '死灵法师套装图鉴')
    .replace(/PALADIN SETS/g, '圣骑士套装图鉴')
    .replace(/SORCERESS SETS/g, '法师套装图鉴')
    .replace(/OTHER SETS/g, '特殊套装图鉴')
    .replace(/Amazon Bow Set/g, '弓马套')
    .replace(/Pantheon/g, '众神 Pantheon')
    .replace(/Amazon Javelin Set/g, '标马套')
    .replace(/Amazon Blood Set/g, '血马套')
    .replace(/Amazon Storm Set/g, '电马套')
    .replace(/Amazon Spear Set/g, '矛马套')
    .replace(/Assassin Bomb Set/g, '炸弹套')
    .replace(/Assassin Psychic Set/g, '物法套')
    .replace(/Assassin Throwing Set/g, '飞刀套')
    .replace(/Assassin Elemental Set/g, '近战元素套')
    .replace(/Assassin Combat Set/g, '近战薙刀套')
    .replace(/Barbarian Gladiator Set/g, '近战触发套')
    .replace(/Barbarian Throwing Set/g, '飞斧套')
    .replace(/Barbarian Shaman Set/g, '召唤套')
    .replace(/Barbarian Two-Handed Set/g, '近战双手斧套')
    .replace(/Barbarian Berserker Set/g, '近战触发套（冰川套）')
    .replace(/Druid Bow Set/g, '弓德套')
    .replace(/Druid Elemental Set/g, '元素施法套')
    .replace(/Druid Treewarden Set/g, '树德套')
    .replace(/Druid Trap Rat Set/g, '鼠德套')
    .replace(/Druid Werewolf Set/g, '狼德套')
    .replace(/Necromancer Malice Set/g, '巫术套')
    .replace(/Necromancer Summoner Set/g, '召唤套')
    .replace(/Necromancer Crossbow Set/g, '十字弓套')
    .replace(/Necromancer Melee Set/g, '近战镰刀套')
    .replace(/Necromancer Totemic Set/g, '图腾套')
    .replace(/Paladin Neutral Set/g, '中立套')
    .replace(/Paladin Unholy Melee Set/g, '暗战套')
    .replace(/Paladin Holy Caster Set/g, '圣法套')
    .replace(/Paladin Unholy Caster Set/g, '暗法套')
    .replace(/Paladin Holy Melee Set/g, '圣战套')
    .replace(/Sorceress Melee Set/g, '战法套')
    .replace(/Sorceress Fire Set/g, '火法套')
    .replace(/Sorceress Lightning Set/g, '电法套')
    .replace(/Sorceress Cold Set/g, '冰法套')
    .replace(/Sorceress Poison Set/g, '毒法套')
    .replace(/Elemental Set/g, '超级元素套')
    .replace(/Fire Set/g, '超级火焰套')



//菜单及基础单词
    .replace("CUBE RECIPES", '合成公式')
    .replace('e">Cube Recipes', 'e">hb0d 合成公式')
    .replace("GEMS AND RUNES", '宝石和符文')
    .replace(">Gems and Runes", '>hb0d 宝石和符文')
    .replace(">Base Items", '>hb0d 基础装备')
    .replace("BASE ITEMS", '基础装备')
    .replace(">Items ", '>hb0i 物品  ')
    .replace(">Runewords", '>hb0i 神符之语')
    .replace("Patch Notes", 'hb0n 更新说明')
    .replace(">Characters <", '>hb0n 角色资料 <')
    .replace(">Mercenaries<", '>雇佣兵<')
    .replace(">Character Builder<", '>技能分配器（不好用）<')
    .replace("SETS", '绿色套装')
    .replace(">Sets", '>hb0i 绿色套装')
    .replace(">Tiered Uniques", '>hb0i 品级暗金装备')
    .replace(">Sacred Uniques", '>hb0i 神圣暗金装备')
    .replace("TIERED UNIQUES", '品级暗金装备')
    .replace("SACRED UNIQUES", '神圣暗金装备')
    .replace("FULL ITEM LIST", '装备图鉴')
    .replace("WEAPONS LIST", '武器图鉴')
    .replace("ARMOR LIST", '防具图鉴')
    .replace('e">Quests', 'e">hb0i 新增任务')
    .replace(">Challenges", '>hb0d 前期挑战')
    .replace(">Dungeons</p>", '>Boss挑战</p><p>本页面挑战都在地狱难度下进行</p>')
    .replace(">Rifts", '>hb0i Farm地图')
    .replace(">Dungeons", '>hb0i Boss挑战')
    .replace(" Skills<br>", '技能<br>')
    .replace(/Tier 1/g, '品级 1 阶')
    .replace(/Tier 2/g, '品级 2 阶')
    .replace(/Tier 3/g, '品级 3 阶')
    .replace(/Tier 4/g, '品级 4 阶')
    .replace(/b>Attack Modifiers/g, 'b style="color:#fff;">特殊攻击')
    .replace(/<p>See <a/g, '<p>点击 <a')
    .replace(/>THIS PAGE</g, '>这个页面<')
    .replace(/> for more information about /g, '> 查看更多信息关于 ')
    .replace(/Socketed /g, '孔数 ')
    .replace(/ to Mana/g, ' 法力值')
    .replace(/Speed: /g, '基础攻速: ')
    .replace(/Range: /g, '攻击距离: ')
    .replace(/Sockets \(/g, '最大孔数 (')
    .replace(/b>Sockets</g, 'b style="color:#fff;">孔数<')
    .replace(/b>Channelling</g, 'b style="color:#fff;">快速施法<')
    .replace(/Quality level: /g, 'QLv: ')
    .replace(/ Enhanced Defense/g, ' 增强防御')
    .replace(/ Defense vs. Melee/g, ' 对投射物的防御')
    .replace(/ Defense/g, ' 防御值')
    .replace(/Defense:/g, '防御: ')
    .replace(/ Skill Levels/g, '技能等级')
    .replace(/>REQUIRED LEVEL/g, '>需求等级')
    .replace(/>DIFFICULTY/g, '>挑战难度')
    .replace(/>VERY EASY/g, '>C 级')
    .replace(/>EASY/g, '>B 级')
    .replace(/>MODERATE/g, '>A 级')
    .replace(/>HARD/g, '>S 级')
    .replace(/>VERY HARD/g, '>SS 级')
    .replace(/>EXTREME/g, '>SSS 级')
    .replace(/>IMPOSSIBLE/g, '>SSSSSSSSSSSSSS 级')
    .replace(/>LOCKDOWN/g, '>关卡锁定')
    .replace(/0 seconds/g, '0 秒')
    .replace(/ minutes/g, ' 分钟')
    .replace(/>Locations/g, '>位置')
    .replace(/>Location/g, '>位置')
    .replace(/>Lore/g, '>背景故事')
    .replace(/>Strategy/g, '>关卡特性')
    .replace(/>Reward/g, '>挑战奖励')
    .replace(/>Reagents</g, '>基础原料<')
    .replace(/>Catalysts</g, '>催化剂<')
    .replace(/>DISENCHANTING/g, '>分解配方')
    .replace(/Unique\/Set Weapon/g, '暗金或套装武器')
    .replace(/Unique\/Set Armour/g, '暗金或套装护甲')
    .replace(/Unique Amulet/g, '暗金项链')
    .replace(/Unique Ring/g, '暗金戒指')
    .replace(/Unique Quiver/g, '暗金箭袋')
    .replace(/Unique Jewel/g, '暗金珠宝')
    .replace(/>Weapon:/g, '>武器：')
    .replace(/>Elemental Weapon:/g, '>元素武器：')
    .replace(/>Armour:/g, '>防具：')
    .replace(/>Amulet:/g, '>项链：')
    .replace(/>Ring:/g, '>戒指：')
    .replace(/>Quiver:/g, '>箭袋：')
    .replace(/>Jewel:/g, '>珠宝：')
    .replace(/maximum sockets.</g, '最大孔数。<')
    .replace(/See \<a/g, '<a')
    .replace(/ preset shrine modifiers./g, '<span style="color:#c3841b">圣坛固定词条</span>。')
    .replace(/ random rare modifiers \(affixes\)./g, '<span style="color:#f5e83a">随机词条</span>。')
    .replace(/ and </g, ' 以及 <')
    .replace(/See the /g, '查阅 ')
        .replace(/<th>Name<\/th>/g, '<th>神符之语</th>')
.replace(/<th>Level<\/th>/g, '<th>等级</th>')
.replace(/<th>Images<\/th>/g, '<th>图示</th>')
.replace(/<th>Runes<\/th>/g, '<th>符文</th>')
.replace(/<th>Base Items<\/th>/g, '<th>底材</th>')
.replace(/<th>Stats<\/th>/g, '<th>属性加成</th>')

    .replace(/>Weapons:</g, '>武器：<')
    .replace(/>Armor:</g, '>防具：<')
    .replace(/>Shields:</g, '>盾牌：<')
    .replace(/Amber</g, '琥珀<')
    .replace(/Amethyst</g, '紫宝石<')
    .replace(/Bloodstone</g, '血石<')
    .replace(/Diamond</g, '钻石<')
    .replace(/Emerald</g, '翡翠<')
    .replace(/Onyx</g, '玛瑙<')
    .replace(/Ruby</g, '红宝石<')
    .replace(/Sapphire</g, '蓝宝石<')
    .replace(/Topaz</g, '黄宝石<')
    .replace(/Turquoise</g, '绿松石<')
    .replace(/Rainbow Stone</g, '彩虹石<')
    .replace(/Skull</g, '骷髅<')
    .replace(/Flawless /g, '无瑕的')
    .replace(/Perfect /g, '完美的')





    .replace(/b>Oskills/g, 'b style="color:#fff;">装备技能 Oskills')
    .replace(/b>Sacred Sets Only!/g, 'b style="color:#fff;">没有普通套装，只有神圣套装！')
    .replace(/b>Variations/g, 'b style="color:#fff;">SU、SSU 和 SSSU')

    .replace(/ per Base Level in the Bow Tree/g, '（基于投入弓系的技能点）')
    .replace(/ per Base Level/g, ' 每基础等级')
    .replace(/ per /g, ' 每 ')
    .replace(/ Base Level/g, ' 基础等级')
    .replace(/\% of/g, '%的')
    //.replace(/ seconds/g, ' 秒')
    .replace(/Additional /g, '额外')
    .replace(/Reduces /g, '降低 ')
    .replace(/Deals /g, '造成 ')
    .replace(/ to Strength/g, ' 力量')
    .replace(/ to Dexterity/g, ' 敏捷')
    .replace(/ to Vitality/g, ' 体力')
    .replace(/ to Energy/g, ' 精力')
    .replace(/ Life/g, ' 生命值')

//格式化
    .replace(/% More /g, '% 更多')
    .replace(/ Arrow 在/g, 'hb1 箭hb5（Arrow）<br>就是射出去一支箭hb4 在')
    .replace(/ Bolt 在/g, 'hb1 飞弹hb5（Bolt）<br>就是射出去一颗飞弹hb4 在')
    .replace(/ Javelin 在/g, 'hb1 标枪hb5（Javelin）<br>就是射出去一支标枪hb4 在')
    .replace(/ Stormpike 在/g, 'hb1 电枪hb5（Stormpike）<br>就是射出去一支电枪hb4 在')
    .replace(/2 Elemental Projectiles/g, '2hb1 元素击hb2"https://vignette.wikia.nocookie.net/median-xl/images/e/e5/Elemental.gif/revision/latest?cb=20180131213345"hb3（Elemental）<br>法术 - 发射直线奔跑并在撞击敌人时爆炸的火元素hb4 Projectiles')
    .replace(/Projectiles/g, 'Projectile')
    .replace(/Projectile to/g, '投射物至')
    .replace(/ Projectile/g, ' 的投射物')
    .replace(/ Duration to/g, ' 的持续时间至')
    .replace(/ Bane/g, 'hb1 祸根hb2"https://vignette.wikia.nocookie.net/median-xl/images/8/88/Bane.gif/revision/latest?cb=20180131203445"hb3（Bane）<br>诅咒 - 降低目标仆从附近敌人的物抗hb4')
    .replace(/ Doom/g, 'hb1 末日hb2"https://vignette.wikia.nocookie.net/median-xl/images/8/81/Doom.gif/revision/latest?cb=20180207033326"hb3（Doom）<br>诅咒 - 降低敌人的魔法抗性，并增加其每一击受到的物理伤害hb4')
    .replace(/to Elemental/g, 'hb1至 元素击hb2"https://vignette.wikia.nocookie.net/median-xl/images/e/e5/Elemental.gif/revision/latest?cb=20180131213345"hb3（Elemental）<br>法术 - 发射直线奔跑并在撞击敌人时爆炸的火元素hb4')
    .replace(/60 Elemental/g, '60hb1 元素击hb2"https://vignette.wikia.nocookie.net/median-xl/images/e/e5/Elemental.gif/revision/latest?cb=20180131213345"hb3（Elemental）<br>法术 - 发射直线奔跑并在撞击敌人时爆炸的火元素hb4')
    .replace(/2 Elemental Projectiles/g, '2hb1 元素击hb2"https://vignette.wikia.nocookie.net/median-xl/images/e/e5/Elemental.gif/revision/latest?cb=20180131213345"hb3（Elemental）<br>法术 - 发射直线奔跑并在撞击敌人时爆炸的火元素hb4 Projectiles')
    .replace(/Elemental Nullified/g, 'hb1 元素击hb2"https://vignette.wikia.nocookie.net/median-xl/images/e/e5/Elemental.gif/revision/latest?cb=20180131213345"hb3（Elemental）<br>法术 - 发射直线奔跑并在撞击敌人时爆炸的火元素hb4 无效')

    .replace(/ Nullified/g, ' 无效')
    .replace(/ Extra /g, ' 额外的 ')
   // .replace(/ Nova/g, 'hb1 闪电新星hb2"https://vignette.wikia.nocookie.net/diablo/images/6/65/D2nova.jpg/revision/latest/scale-to-width-down/320?cb=20150728184705"hb3（Nova）<br>原版法术 - 向外扩散并造成闪电伤害的中型圆环hb4')
    .replace(/hb1/g, '<span class="dropup"><span class="dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">')
    .replace(/hb2/g, ' <svg t="1561182996835" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12935" width="17" height="17"><path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32z m-40 632H136v-39.9l138.5-164.3 150.1 178L658.1 489 888 761.6V792z m0-129.8L664.2 396.8c-3.2-3.8-9-3.8-12.2 0L424.6 666.4l-144-170.7c-3.2-3.8-9-3.8-12.2 0L136 652.7V232h752v430.2z" p-id="12936" fill="#c1b59d"></path><path d="M304 456c48.6 0 88-39.4 88-88s-39.4-88-88-88-88 39.4-88 88 39.4 88 88 88z m0-116c15.5 0 28 12.5 28 28s-12.5 28-28 28-28-12.5-28-28 12.5-28 28-28z" p-id="12937" fill="#c1b59d"></path></svg></span><ul class="dropdown-menu"><li><img src=')
    .replace(/hb3/g, '></li><li>')
    .replace(/hb4/g, '</li></ul></span>')
    .replace(/hb5/g, ' <svg t="1561183488357" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13636" width="17" height="17"><path d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3C422 175.1 373.9 161 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3 0.8 2.8 1.3 4.3 1.3s3-0.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32zM324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3 6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39z m563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5 48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888v488z" p-id="13637" fill="#c1b59d"></path><path d="M396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0.1-4.1-3.1-7.5-7-7.5zM620 368.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7.1-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5zM396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0.1-4.1-3.1-7.5-7-7.5zM812.9 501H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0.1-4.1-3.1-7.5-7-7.5z" p-id="13638" fill="#c1b59d"></path></svg></span><ul class="dropdown-menu"><li>')


    .replace(/hb0n/g, '<svg t="1561182891914" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12705" width="17" height="17"><path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 0.3L512 465.6l-99.3-118.4-66.1-0.3c-4.4 0-8 3.5-8 8 0 1.9 0.7 3.7 1.9 5.2l130.1 155L340.5 670c-1.2 1.5-1.9 3.3-1.9 5.2 0 4.4 3.6 8 8 8l66.1-0.3L512 564.4l99.3 118.4 66 0.3c4.4 0 8-3.5 8-8 0-1.9-0.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z" p-id="12706" fill="#e6e6e6"></path><path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" p-id="12707" fill="#e6e6e6"></path></svg>')
    .replace(/hb0i/g, '<svg t="1561181403683" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10360" width="17" height="17"><path d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27c40.9 17.3 77.7 42.1 109.3 73.8 9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47c-5.3 4.1-3.5 12.5 3 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l0.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8c-0.1 4.5 3.5 8.2 8 8.2h60c4.4 0 7.9-3.5 8-7.8zM924 512h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4S687 811.7 646 829c-42.4 17.9-87.4 27-133.9 27s-91.5-9.1-133.9-27c-40.9-17.3-77.7-42.1-109.3-73.8-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47c5.3-4.1 3.5-12.5-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-0.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8 0.1-4.5-3.5-8.2-8-8.2z" p-id="10361" fill="#f4ea2a"></path></svg>')
    .replace(/hb0d/g, '<svg t="1561181248012" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9924" width="17" height="17"><path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8c12.7 17.7 39 17.7 51.7 0l210.6-292c3.9-5.3 0.1-12.7-6.4-12.7z" p-id="9925" fill="#1afa29"></path><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" p-id="9926" fill="#1afa29"></path></svg>')



.replace(/[0-9]\d* *to *[0-9]\d*/g , handleNumber)
    .replace(/\) *to *\(/g , handleNumber)
    .replace(/ *to *[\u4e00-\u9fa5]+/g,handleHanzi)
   .replace(/ *to *[<,>]/g,handleHanzi)


;
var replaceArry = [

      [/Short Sword/i, '短剑'],
      [/Scimitar/i, '弯刀'],
      [/Saber/i, '军刀'],
      [/Falchion/i, '弯型大刀'],
      [/Broad Sword/i, '阔剑'],
      [/Long Sword/i, '长剑'],
      [/War Sword/i, '巨战之剑'],
      [/Two-Handed Swords/i, '双手剑'],
      [/Two-Handed Sword/i, '双手剑'],
      [/Claymore/i, '双刃大刀'],
      [/Giant Sword/i, '大剑'],
      [/Bastard Sword/i, '巨剑'],
      [/Flamberge/i, '双手饰剑'],
      [/Great Sword/i, '卓越之剑'],
      [/Hand Axe/i, '手斧'],
      [/Double Axe/i, '双刃斧'],
      [/Military Pick/i, '军用锹'],
      [/War Axe/i, '巨战斧'],
      [/Large Axe/i, '巨斧'],
      [/Broad Axe/i, '阔斧'],
      [/Battle Axe/i, '战斗斧'],
      [/Great Axe/i, '卓越之斧'],
      [/Giant Axe/i, '大斧'],
      [/Spiked Club/i, '狼牙棒'],
      [/Morning Star/i, '流星锤'],
      [/Flail/i, '链枷'],
      [/War Hammer/i, '巨战铁槌'],
      [/Great Maul/i, '卓越大头锤'],
      [/Maul/i, '大头锤'],
      [/Grand Scepter/i, '雄伟权杖'],
      [/War Scepter/i, '巨战权杖'],
      [/Pilum/i, '短标枪'],
      [/Short Spear/i, '短矛'],
      [/Glaive/i, '大长刀'],
      [/Throwing Spear/i, '飞矛'],
      [/Trident/i, '三叉戟'],
      [/Brandistock/i, '叉'],
      [/Spetum/i, '大战戟'],
      [/Dirk/i, '长匕首'],
      [/Kriss/i, '波形刀'],
      [/Throwing Knife/i, '飞刀 Throwing Knife'],
      [/Flying Knife/i, '飞刀 Flying Knife'],
      [/Balanced Knife/i, '平衡小刀'],
  [/Throwing Axes/i, '飞斧'],
      [/Throwing Axe/i, '飞斧'],
      [/Balanced Axe/i, '平衡斧'],
      [/Short Staff/i, '短法杖'],
      [/Long Staff/i, '长法杖'],
      [/Gnarled Staff/i, '多节法杖'],
      [/Battle Staff/i, '战斗法杖'],
      [/War Staff/i, '巨战法杖'],
      [/Short Bow/i, '短弓'],
      [/Hunter's Bow/i, '猎弓'],
      [/Long Bow/i, '长弓'],
      [/Composite Bow/i, '复合弓'],
      [/Short Battle Bow/i, '短战斗弓'],
      [/Long Battle Bow/i, '长战斗弓'],
      [/Short War Bow/i, '短巨战弓'],
      [/Long War Bow/i, '长巨战弓'],
      [/Light Crossbow/i, '轻弩'],
      [/Heavy Crossbow/i, '重弩'],
      [/Repeating Crossbow/i, '连弩'],
      [/Stag Bow/i, '男性之弓'],
      [/Reflex Bow/i, '反射之弓'],
      [/Maiden Spear/i, '女士之矛'],
      [/Maiden Pike/i, '女士长矛'],
      [/Maiden Javelin/i, '女士标枪'],
      [/Scissors Katar/i, '剪咬刀'],
      [/Katar/i, '拳剑'],
      [/Wrist Blade/i, '腕刃'],
      [/Hatchet Hands/i, '斧手'],
      [/Cestus/i, '腰刀'],
      [/Blade Talons/i, '刃爪'],
      [/Naginatas/i, '薙刀'],
      [/Naginata/i, '薙刀'],
      [/Spatha/i, '佩剑'],
      [/Backsword/i, '单刃剑'],
      [/Ida/i, '约鲁巴剑'],
      [/Bronze Sword/i, '青铜剑'],
      [/Kriegsmesser/i, '日耳曼战刀'],
      [/Mammen Axe/i, '马门斧'],
      [/Hammerhead Axe/i, '锤头斧'],
      [/Ono/i, '东瀛斧'],
      [/Valaska/i, '放牧斧'],
      [/Labrys/i, '双刃重斧'],
      [/Compound Bow/i, '合成弓'],
      [/Serpent Bow/i, '蟒蛇弓'],
      [/Maple Bow/i, '枫木弓'],
      [/Viper Bow/i, '蝰蛇弓'],
      [/Recurve Bow/i, '反曲弓'],
      [/Flamen Staff/i, '祭祀法杖'],
      [/Marrow Staff/i, '骨髓法杖'],
      [/Hexblade/i, '诅咒之刃'],
      [/Spirit Edge/i, '灵魂利刃'],
      [/Bonesplitter/i, '裂骨者'],
      [/Needle Crossbow/i, '针弩'],
      [/Dart Thrower/i, '掷镖器'],
      [/Stinger Crossbow/i, '蛰弩'],
      [/Trebuchet/i, '投石机'],
      [/Yew Wand/i, '紫衫之杖'],
      [/Bone Wand/i, '骨杖'],
      [/Grim Wand/i, '残酷魔杖'],
      [/Bonebreaker/i, '碎骨者'],
      [/Goedendag/i, '尖刺钉锤'],
      [/Angel Star/i, '天使之星'],
      [/Hand of God/i, '神之手'],
      [/Holy Lance/i, '圣枪'],
      [/Tepoztopilli/i, '阿兹特克长矛'],
      [/Sorceress Orbs/i, '法师法球'],
      [/Eagle Orb/i, '鹰眼法珠'],
      [/Sacred Globe/i, '神圣天球'],
      [/Smoked Sphere/i, '拢烟之球'],
      [/Clasped Orb/i, '握扣法珠'],
      [/Jared's Stone/i, '贾里德之石'],
      [/Warp Blade/i, '扭曲之刃'],
      [/Quilted Armor/i, '布甲'],
      [/Hard Leather Armor/i, '硬皮甲'],
      [/Leather Armor/i, '皮甲'],
      [/Studded Leather/i, '镶嵌甲'],
      [/Ring Mail/i, '锁环甲'],
      [/Scale Mail/i, '鳞甲'],
      [/Chain Mail/i, '锁子甲'],
      [/Breast Plate/i, '胸甲'],
      [/Splint Mail/i, '板甲'],
      [/Field Plate/i, '实战铠甲'],
      [/Gothic Plate/i, '歌德战甲'],
      [/Full Plate Mail/i, '高级战甲'],
      [/Plate Mail/i, '铠甲'],
      [/Ancient Armor/i, '古代装甲'],
      [/Skull Cap/i, '骷髅帽'],
      [/Full Helm/i, '高级头盔'],
      [/Great Helm/i, '卓越头盔'],
  [/Circlets/i, '头环'],
      [/Circlet/i, '头环'],
      [/Coronet/i, '宝冠'],
      [/Tiara/i, '三重冠'],
      [/Diadem/i, '权冠'],
      [/Special Helms/i, '特殊头盔'],
      [/Bone Helm/i, '白骨头盔'],
      [/Buckler/i, '圆盾'],
      [/Small Shield/i, '小盾牌'],
      [/Large Shield/i, '大盾牌'],
      [/Kite Shield/i, '鸢盾'],
      [/Tower Shield/i, '塔盾'],
      [/Gothic Shield/i, '歌德盾牌'],
      [/Special Shields/i, '特殊盾牌'],
      [/Bone Shield/i, '白骨盾牌'],
      [/Spiked Shield/i, '尖刺盾牌'],
      [/Sash/i, '裹腰'],
      [/Light Belt/i, '轻腰带'],
      [/Heavy Belt/i, '重腰带'],
      [/Plated Belt/i, '金属腰带'],
      [/Leather Gloves/i, '皮手套'],
      [/Heavy Gloves/i, '重手套'],
      [/Chain Gloves/i, '锁链手套'],
      [/Light Gauntlets/i, '轻型铁手套'],
      [/Gauntlets/i, '铁手套'],
      [/Heavy Boots/i, '重靴'],
      [/Chain Boots/i, '锁链靴'],
      [/Light Plated Boots/i, '轻型金属靴'],
      [/Greaves/i, '护胫'],
      [/Morion/i, '高顶头盔'],
      [/Cervelliere/i, '贴面骷髅帽'],
      [/Einherjar Helm/i, '英灵盔'],
      [/Spangenhelm/i, '施潘根头盔'],
      [/Athulua's Hand/i, '阿苏拉之手'],
      [/Phoenix Shield/i, '凤凰盾'],
      [/Setzschild/i, '骑兵盾'],
      [/Parma/i, '帕尔玛盾'],
      [/Aspis/i, '蝰蛇盾'],
      [/Totem Shield/i, '图腾盾'],
      [/Bladed Shield/i, '刀刃护盾'],
      [/Bull Shield/i, '牛头盾'],
      [/Bronze Shield/i, '铜盾'],
      [/Gilded Shield/i, '镀金盾'],
      [/Jawbone Cap/i, '颚骨帽'],
      [/Fanged Helm/i, '尖牙盔'],
      [/Horned Helm/i, '角盔'],
      [/Assault Helmet/i, '突击盔'],
      [/Avenger Guard/i, '复仇者之盔'],
      [/Wolf Head/i, '狼头'],
      [/Hawk Helm/i, '飞鹰头盔'],
      [/Antlers/i, '鹿角'],
      [/Falcon Mask/i, '猎鹰面具'],
      [/Spirit Mask/i, '灵魂面具'],
      [/Preserved Head/i, '防腐之首'],
      [/Zombie Head/i, '僵尸之首'],
      [/Unraveller Head/i, '揭露者之首'],
      [/Gargoyle Head/i, '石像鬼之首'],
      [/Demon Head/i, '恶魔之首'],
      [/Hundsgugel/i, '骑士遮罩'],
      [/Blackguard Helm/i, '黑守卫头盔'],
      [/Targe/i, '小盾'],
      [/Rondache/i, '装饰盾牌'],
      [/Heraldic Shield/i, '纹章盾'],
      [/Aerin Shield/i, '艾尔之盾'],
      [/Crown Shield/i, '皇冠之盾'],
      [/Gambeson/i, '紧身软甲'],
      [/Kazarghand/i, '卡扎甘战甲'],
      [/Lamellar Armor/i, '札甲'],
      [/Banded Plate/i, '板条甲'],
      [/Ceremonial Armor/i, '纪念装甲'],
  [/Throwing Knives/i, '飞刀'],
  [/Amazon Javelins/i, '亚马逊专属标枪'],
  [/Necromancer Wands/i, '死灵法师手杖'],
  [/Paladin Clubs/i, '圣骑士专属棍棒'],
  [/Paladin Hammers/i, '圣骑士专属锤'],
  [/Paladin Spears/i, '圣骑士专属矛'],
  [/Necromancer Scythes/i, '死灵法师专属镰刀'],
  [/Amazon Spears/i, '亚马逊专属矛'],
  [/Paladin Spears/i, '圣骑士专属矛'],
  [/Paladin Clubs, Paladin Maces, Paladin Hammers/i, '圣骑士专属钝器'],
  [/Sorceress Orbs/i, '法师单手法球'],
  [/Sorceress Crystal Swords/i, '法师专属水晶剑'],
  [/Sorceress Body Armor/i, '法师专属盔甲'],
  [/Paladin Shields/i, '圣骑士专属盾'],
  [/Paladin Auric Shields/i, '圣骑士专属盾'],
  [/Barbarian Shields/i, '野蛮人专属盾'],
  [/Assassin Shields/i, '刺客专属盾'],
  [/Necromancer Shields/i, '死灵法师专属盾'],
  [/Necromancer Voodoo Heads/i, '死灵法师专属盾'],
  [/Amazon Shields/i, '亚马逊专属盾'],
  [/Raptor Scythe/i, '猛禽镰刀'],
  [/Scythes/i, '镰刀'],
  [/Scythe/i, '镰刀'],
  [/Sceptres/i, '权杖'],
  [/One-Handed Swords/i, '单手剑'],
  [/One-Handed Axes/i, '单手斧'],
  [/Paladin Helms/i, '圣骑士专属头盔'],
  [/Paladin Clubs, Paladin Maces, Paladin Hammers/i, '圣骑士专属钝器'],
  [/Paladin Blunt Weapons/i, '圣骑士专属钝器'],
  [/Barbarian Swords/i, '野蛮人专属剑'],
  [/Barbarian One-Handed Axes/i, '野蛮人单手斧'],
  [/Barbarian Two-Handed Axes/i, '野蛮人双手斧'],
  [/Necromancer Wands/i, '死灵法师单手短杖'],
  [/Necromancer Staves/i, '死灵法师双手长杖'],
  [/Necromancer Daggers/i, '死灵法师专属匕首'],
  [/Necromancer Crossbows/i, '死灵法师专属十字弓'],
  [/Druid Staves/i, '德鲁伊专属法杖'],
  [/Druid Helms/i, '德鲁伊专属头盔'],
  [/Druid Pelts/i, '德鲁伊专属头盔'],
  [/Maces/i, '钉锤'],
  [/Hammers/i, '锤子'],
  [/Amazon Javelins/i, '亚马逊专属标枪'],
  [/Javelins/i, '标枪'],
  [/Barbarian Helms/i, '野蛮人专属头盔'],
  [/Barbarian Primal Helms/i, '野蛮人专属头盔'],
  [/Barbarian Weapons/i, '野蛮人专属武器'],
  [/Staves/i, '长柄法杖'],
  [/Crossbows/i, '十字弓'],
  [/Druid Bows/i, '德鲁伊专属弓'],
  [/Amazon Bows/i, '亚马逊专属弓'],
  [/Amazon Helms/i, '亚马逊专属头盔'],
  [/Bows/i, '弓'],
  [/Daggers/i, '匕首'],
  [/Assassin Claws/i, '刺客爪'],
  [/Assassin Naginatas/i, '眉间刀（刺客）'],
  [/Body Armor/i, '盔甲'],
  [/Special Shields/i, '特殊盾牌'],
  [/Shields/i, '盾牌'],
  [/Belts/i, '腰带'],
  [/Special Helms/i, '特殊头盔'],
  [/Helms/i, '头盔'],
  [/Gloves/i, '手套'],
  [/Crystal Swords/i, '水晶剑'],
  [/Two-Handed Axes/i, '双手斧'],
  [/Amulets/i, '项链'],
  [/Rings/i, '戒指'],
  [/Jewels/i, '珠宝'],
  [/Arrow Quivers/i, '箭袋'],
  [/Crossbow Quivers/i, '十字箭袋'],
  [/Axe/i, '斧'],
  [/\(Sacred\)/i, '（神圣）'],
      [/Pike/i, '矛'],
      [/Club/i, '棍棒'],
  [/Spears/i, '长矛'],
      [/Spear/i, '长矛 '],
      [/Scepter/i, '权杖'],
      [/Javelin/i, '标枪'],
      [/Blade/i, '短刀'],
      [/Claws/i, '爪'],
      [/Dagger/i, '匕首'],
      [/Crossbow/i, '十字弓'],
      [/Wand/i, '手杖'],
  [/Weapons/i, '武器'],
      [/Crystal Swords/i, '水晶剑'],
      [/Crystal Sword/i, '水晶剑'],
      [/Cap/i, '帽子'],
      [/Helm/i, '头盔'],
      [/Boots/i, '靴子'],
      [/Belt/i, '腰带'],
      [/Light Plate/i, '轻型装甲'],
      [/Mask/i, '面具'],
      [/Crown/i, '皇冠'],
      [/Mace/i, '钉头锤'],
    //角色名

    [/ to Druid/i, ' 德鲁伊'],
    [/ to Assassin/i, ' 刺客'],
    [/ to Barbarian/i, ' 野蛮人'],
    [/ to Amazon/i, ' 亚马逊'],
    [/ to Sorceress/i, ' 法师'],
    [/ to Necromancer/i, ' 死灵法师'],
    [/ to Paladin/i, ' 圣骑士'],
    [/Amazon Only/i, '限亚马逊'],
    [/Druid Only/i, '限德鲁伊'],
    [/Assassin Only/i, '限刺客'],
    [/Barbarian Only/i, '限野蛮人'],
    [/Sorceress Only/i, '限法师'],
    [/Necromancer Only/i, '限死灵法师'],
    [/Paladin Only/i, '限圣骑士'],
    [/\[AMZ\]/i, '亚马逊'],
    [/\[ASN\]/i, '刺客'],
    [/\[BAR\]/i, '野蛮人'],
    [/\[DRU\]/i, '德鲁伊'],
    [/\[NEC\]/i, '死灵法师'],
    [/\[PAL\]/i, '圣骑士'],
    [/\[SOR\]/i, '法师'],
    [/Amazon/i, '亚马逊'],
    [/Assassin/i, '刺客'],
    [/Barbarian/i, '野蛮人'],
    [/Druid/i, '德鲁伊'],
    [/Necromancer/i, '死灵法师'],
    [/Paladin/i, '圣骑士'],
    [/Sorceress/i, '法师'],
    [/Damage to/i, '的伤害至'],
    [/Like the /i, '类似于'],
    [/Gematria	/i, '字数对应法'],
    //符文
[/El Rune/i, '1# El'],
[/Eld Rune/i, '2# Eld'],
[/Tir Rune/i, '3# Tir'],
[/Nef Rune/i, '4# Nef'],
[/Eth Rune/i, '5# Eth'],
[/Ith Rune/i, '6# Ith'],
[/Tal Rune/i, '7# Tal'],
[/Ral Rune/i, '8# Ral'],
[/Ort Rune/i, '9# Ort'],
[/Thul Rune/i, '10# Thul'],
[/Amn Rune/i, '11# Amn'],
[/Sol Rune/i, '12# Sol'],
[/Shael Rune/i, '13# Shael'],
[/Dol Rune/i, '14# Dol'],
[/Hel Rune/i, '15# Hel'],
[/Io Rune/i, '16# Io'],
[/Lum Rune/i, '17# Lum'],
[/Ko Rune/i, '18# Ko'],
[/Fal Rune/i, '19# Fal'],
[/Lem Rune/i, '20# Lem'],
[/Pul Rune/i, '21# Pul'],
[/Um Rune/i, '22# Um'],
[/Mal Rune/i, '23# Mal'],
[/Ist Rune/i, '24# Ist'],
[/Gul Rune/i, '25# Gul'],
[/Vex Rune/i, '26# Vex'],
[/Ohm Rune/i, '27# Ohm'],
[/Lo Rune/i, '28# Lo'],
[/Sur Rune/i, '29# Sur'],
[/Ber Rune/i, '30# Ber'],
[/Jah Rune/i, '31# Jah'],
[/Cham Rune/i, '32# Cham'],
[/Zod Rune/i, '33# Zod'],
[/Sha Rune/i, '34# Sha'],
[/Lah Rune/i, '35# Lah'],
[/Kur Rune/i, '36# Kur'],
[/Ix Rune/i, '37# Ix'],
[/Thur Rune/i, '38# Thur'],
[/Nas Rune/i, '39# Nas'],
[/Ath Rune/i, '40# Ath'],
[/Kra Rune/i, '41# Kra'],
[/Vith Rune/i, '42# Vith'],
[/No Rune/i, '43# No'],
[/Yul Rune/i, '44# Yul'],
[/Thai Rune/i, '45# Thai'],
[/Rha Rune/i, '46# Rha'],
[/Xar Rune/i, '47# Xar'],
[/Nih Rune/i, '48# Nih'],
[/Lai Rune/i, '49# Lai'],
[/On Rune/i, '50# On'],
[/Taha Rune/i, '51# Taha'],
[/Ghal Rune/i, '52# Ghal'],
[/Qor Rune/i, '53# Qor'],
[/Krys Rune/i, '54# Krys'],
[/Auhe Rune/i, '55# Auhe'],
[/Shaad Rune/i, '56# Shaad'],
[/Ma Rune/i, '魔法'],
[/Po Rune/i, '毒素'],
[/Fi Rune/i, '火焰'],
[/Ea Rune/i, '大地'],
[/Co Rune/i, '寒冰'],
[/Li Rune/i, '闪电'],
[/Xis Rune/i, '卡布'],
    //属性词条
[/Repairs 1 Durability in 25 Seconds/i, '每 25 秒恢复 1 点装备耐久'],
[/Xis Rune/i, '卡布'],
[/damage/i, '伤害'],
[/Deal No/i, '不再造成'],
];

var numTerms= replaceArry.length;
var txtWalker= document.createTreeWalker (
    document.body,
    NodeFilter.SHOW_TEXT,
    {acceptNode: function (node) {
            //-- Skip whitespace-only nodes
            if (node.nodeValue.trim() )
                return NodeFilter.FILTER_ACCEPT;

            return NodeFilter.FILTER_SKIP;
        }
    },
    false
);




var txtNode = null;

while (txtNode = txtWalker.nextNode () ) {
    var oldTxt = txtNode.nodeValue;

    for (var J = 0; J < numTerms; J++) {
        oldTxt = oldTxt.replace (replaceArry[J][0], replaceArry[J][1]);
    }
    txtNode.nodeValue = oldTxt;
}
;

    for (var i = 0; i < 31; i++) {

    document.getElementsByClassName('lore')[i].innerHTML=""
}
    document.getElementsByClassName('brc')[0].innerHTML="";


    function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

addGlobalStyle('svg{margin-bottom: -3px;}.hbred{color:red;}');

function handleNumber($1){
    return $1.replace("to"," - ");
  }
  function handleHanzi($1){
    return $1.replace("to","");
  }



})

();
