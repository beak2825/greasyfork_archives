// ==UserScript==
// @name         冒险岛N宇宙 MSU 网页汉化
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  汉化 msu.io 等相关页面.
// @author       B站-放肆到底丶
// @homepageURL  https://space.bilibili.com/430674
// @icon         https://globalstatic.xangle.io/explorer/nexon/logo/logo_mainnet_mobile.png
// @match        https://msu.io/*
// @match        https://static.msu.io/inspection
// @match        https://msu-explorer.xangle.io/
// @match        https://docs.maplestoryn.io/*
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536276/%E5%86%92%E9%99%A9%E5%B2%9BN%E5%AE%87%E5%AE%99%20MSU%20%E7%BD%91%E9%A1%B5%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/536276/%E5%86%92%E9%99%A9%E5%B2%9BN%E5%AE%87%E5%AE%99%20MSU%20%E7%BD%91%E9%A1%B5%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 翻译状态控制
    let isTranslationEnabled = localStorage.getItem('msu-translation-enabled') !== 'false';

    // 保存翻译状态到localStorage
    function saveTranslationState(enabled) {
        localStorage.setItem('msu-translation-enabled', enabled);
    }

    // Helper function to normalize text for dictionary lookups
    function normalizeTextForLookup(text) {
        if (typeof text !== 'string') return '';
        return text.toLowerCase()
                   .replace(/[’']/g, "'")   // Normalize apostrophes
                   .replace(/（/g, '(')   // Normalize full-width open parenthesis
                   .replace(/）/g, ')');  // Normalize full-width close parenthesis
    }


    // 自定义翻译词典（用户可在此添加/修改翻译条目）
    const CUSTOM_DICT = {
        // https://msu.io/maplestoryn/
        'MapleStory N': '冒险岛N',
        'MapleStory N Web': '冒险岛N 网页',
        'MapleStory N Game Client': '冒险岛N 游戏客户端',
        'Will start soon!': '即将开始！',
        'Please wait for a moment.': '请稍等.',
        'Do not show again today': '今天不再显示',
        'News': '新闻',
        'New': '新',
        'notices': '公告',
        'Articles': '文章',
        'update': '更新',
        'Event': '活动',
        'Back to List': '返回列表',
        'Prev': '上一页',
        'Next': '下一页',
        'Previous': '上一页',
        'The post URL has been copied.': '链接已复制！',
        'Guide': '指南',
        'Classes & Jobs': '职业 & 转职‌',
        'Main Stat': '主要属性',
        'Weapons Used': '主要武器',
        'Read more': '了解更多',
        'All': '全部',
        'Explorer': '冒险家',
        'Warrior': '战士',
        'Hero': '英雄',
        'Paladin': '圣骑士',
        'Dark Knight': '黑骑士',
        'magician': '法师',
        'Arch Mage': '魔导师',
        'Fire/Poison': '火/毒',
        'Arch Mage F/P': '魔导师（火/毒）',
        'Arch Mage F/P | Magician': '魔导师（火/毒） | 法师',
        'Arch Mage (Fire / Poison)': '魔导师（火/毒）',
        'Ice/Lightning': '冰/雷',
        'Arch Mage I/L | Magician': '魔导师（冰/雷） | 法师',
        'Arch Mage I/L': '魔导师（冰/雷）',
        'Arch Mage (Ice / Lightning)': '魔导师（冰/雷）',
        'Bishop': '主教',
        'Bishop | Magician': '主教 | 法师',
        'bowman': '弓箭手',
        'Bowmaster': '神射手',
        'Marksman': '箭神',
        'Thief': '飞侠',
        'Night Lord': '隐士',
        'Shadower': '侠盗',
        'pirate': '海盗',
        'Buccaneer': '冲锋队长',
        'Corsair': '船长',
        'Job Advancement': '职业转职',
        'Beginner': '新手',
        '1st Job': '一转',
        '2nd Job': '二转',
        '3rd Job': '三转',
        '4th Job': '四转',
        'Beginner’s Guide': '新手上路',
        'Download Guide': '下载中心',
        'Game Status': '游戏状态',
        'Ranking': '排名',
        'PLAYER RANKING': '玩家排名',
        'View More': '查看更多',
        'Track your standing among fellow maplers and see who’s claimed the top spots.': '跟踪你在同服玩家中的排名，看看谁占据了顶尖位置。',
        'Dynamic Pricing': '动态定价',
        'Probability': '概率',
        'Probability Info': '概率信息',
        'Probability Information': '概率信息',
        'All random outcomes for items and functions display clear probabilities, rounded to six decimal places.': '所有物品和功能的随机结果都显示明确的概率，四舍五入到小数点后六位。',
        'Bonus Stat': '额外属性',
        'Rank Increase Probability': '等级提升概率',
        'Sort': '排序',
        'Rank 1': '等级1',
        'Rank 2': '等级2',
        'Rank 3': '等级3',
        'Rank 4': '等级4',
        'Rank 5': '等级5',
        'Powerful Rebirth Flame': '强大的涅槃火焰\nPowerful Rebirth Flame',
        'Eternal Rebirth Flame': '永远的涅槃火焰\nEternal Rebirth Flame',
        'Black Rebirth Flame': '宿命黑暗的涅槃火焰\nBlack Rebirth Flame',
        '* Boss equipment\'s final rank will be with a +2 rank bonus, and treated as rank 3 - 7.': '* BOSS装备的最终等级将带有+2等级加成，并视为3-7级。',
        'Number of Options': '选项数量',
        // Boss相关
        'Boss Content': 'Boss内容',
        'Available Boss Content': '可用的Boss内容',
        'Boss Name': 'Boss名称',
        'Difficulty': '难度',
        'Available Practice Mode': '可用的练习模式',
        // Boss名称
        'Balrog': '蝙蝠怪',
        'Hilla': '希拉',
        'Horntail': '暗黑龙王',
        'Pierre': '皮埃尔',
        'Von bon': '半半',
        'Bloody Queen': '血腥女王',
        'Vellum': '贝伦',
        'Von Leon': '班·雷昂',
        'Arkarium': '阿卡伊勒',
        'OMNI-CLN': '卡雄',
        'Pink Bean': '品克滨',
        'Magnus': '麦格纳斯',
        'Papulatus': '帕普拉图斯',
        'Cygnus': '希纳斯',
        'Zakum': '扎昆',
        'Lotus': '斯乌',
        'Damien': '戴米安',
        // https://msu.io/maplestoryn/gamestatus/probabilityitems
        'Equipment Category': '装备分类',
        'Stat': '属性',
        'STR': '力量',
        'STR (Strength)': 'STR (力量)',
        'DEX': '敏捷',
        'DEX (Dexterity)': 'DEX (敏捷)',
        'INT': '智力',
        'INT (Intelligence)': 'INT (智力)',
        'LUK': '幸运',
        'LUK (Luck)': 'LUK (幸运)',
        'STR+DEX': '力量+敏捷',
        'STR+INT': '力量+智力',
        'STR+LUK': '力量+幸运',
        'DEX+INT': '敏捷+智力',
        'DEX+LUK': '敏捷+幸运',
        'INT+LUK': '智力+幸运',
        'Max HP +%': '最大HP +%',
        'Max MP +%': '最大MP +%',
        'Max HP': '最大HP',
        'Max MP': '最大MP',
        'Reduced Level Requirement': '降低等级要求',
        'DEF': '防御',
        'ATT': '攻击力',
        'Magic ATT': '魔力',
        'DEF Ignored': '无视防御',
        'Damage': '伤害',
        'All Stats': '全部属性',
        'Other Equipment': '其他装备',
        'Movement Speed': '移动速度',
        'Jump': '跳跃力',
        'Marketplace': '市场',
        // https://msu.io/marketplace
        'Connect your wallet and use the marketplace!': '连接你的钱包并使用市场！',
        'Recommended Items': '推荐物品',
        'Accessories Make the Build. Make Yours Count.': '饰品搭配，打造你的特色！',
        'Fortify Your Journey with Unchained Armors!': '强化你的旅程，解放系列防具！',
        'Accelerate Your Adventure with Unchained Weapons!': '使用 解放系列武器 加速你的冒险！',
        'Your NFT Collection Grows With Every Step.': '你的 NFT 收藏随着每一步的进展而增长。',
        'FT Trading’s Heating Up. Don’t Miss the Signal.': 'FT 交易正升温。不要错过信号！',
        'Seeking a competitive edge? Fill your NFT collection!': '寻求竞争优势？充实您的 NFT 收藏！',
        'Get the perfect pet to power up your adventures!': '让完美的宠物为您的冒险提供动力！',
        'Got Your Sub Weapon Ready?': '你的副武器准备好了吗？',
        'RECOMMENDED': '推荐',
        'ITEMS': '物品',
        'Hey!': '嗨！',
        'How about this?': '试试这个？',
        'Past 30 Days': '过去30天',
        'Total Listings': '总列表',
        'Total Active Wallets': '总活跃钱包',
        'Total Sales': '总销售额',
        'Total Trading volume': '总交易量',
        'Sales': '销售额',
        'Recent': '最近',
        'Listings': '列表',
        'Traders': '交易者',
        'Type': '类型',
        'Skill': '技能',
        'Popular Searches': '热门搜索',
        'MSU Marketplace Guide': 'MSU 市场指南',
        'Need help with trading? This guide will get you started!': '需要帮助进行交易吗？这篇指南将为你提供帮助！',
        // https://msu.io/marketplace/nft
        'NFT Item': 'NFT 物品',
        'No items owned.': '没有拥有的物品。',
        'Game Play': '玩游戏',
        'Due to the high volume of search results, only a portion is displayed.': '由于搜索结果过多，只显示部分。',
        'Price: Low to High': '价格: 低到高',
        'Price: High to Low': '价格: 高到低',
        'Time: Ending Soon': '时间: 即将结束',
        'Time: Newly Listed': '时间: 最新发布',
        'Offer': '报价',
        'Make an Offer': '提出报价',
        'Received Offers': '收到报价',
        'Offer Price': '报价价格',
        'Make offer': '提出报价',
        'An offered price that isn\'t in the top five is not being shown.': '不在前五位的报价不会显示',
        'The user receiving offers will only see the top 5 highest offers, and if an offer that is canceled/expired/accepted is in the top 5, the next offer will show up at the top.': '接收报价的用户只能看到最高报价的前 5 位，如果前 5 位中有被取消/过期/接受的报价，下一个报价将显示在前面。',
        'Hide': '隐藏',
        'See More': '查看更多',
        'Cancel': '取消',
        'Cancel Offer': '取消报价',
        'Would you like to cancel the offer?': '你确定要取消报价吗？',
        'Change Owner': '拥有者变更',
        'Offers Received': '报价接收',
        'Highest Offer': '最高报价',
        'Offer(s)': '报价(个)',
        'See Offers': '查看报价',
        'Accept Offer': '接受报价',
        'Offers Sent': '报价发送',
        'View recent offers on your listings. Only the 5 highest offers are displayed, with updates if an offer is canceled, expires, or is accepted.': '查看你的列表中最近的报价。只显示前5个报价，报价取消、过期或接受时更新。',
        'View all items you’ve placed offers on.': '查看你已发送报价的物品。',
        'There is no price offer history yet.': '没有交易历史。',
        'Price': '价格',
        'Price must be greater than or equal to 0.000001 NESO.': '价格必须大于或等于 0.000001 NESO。',
        'Expiration': '到期时间',
        'From': '来自',
        'Price Range': '价格范围',
        'Unique Number': '唯一编号',
        'Item Type': '物品类型',
        'List for sale': '列入清单',
        'Listing': '清单',
        'Lowest Listed Price': '最低报价',
        'Last Traded  Price': '上次交易价格',
        '14-Day Price Range': '14天价格范围',
        'No trade history': '没有交易历史',
        'Duration': '持续时间',
        'Description': '描述',
        'In Progress': '进行中',
        'Rejected': '已拒绝',
        'The link has been copied!': '链接已复制！',
        'Notifications': '通知',
        'Account': '账号',
        'Delete Individually': '逐个删除',
        'Delete All': '全部删除',
        // NFT 物品词缀
        'Weapon Type': '武器类型',
        'Equipment Type': '装备类型',
        'Required Level': '所需等级',
        'Requirements': '要求/条件',
        'Detail stat': '详细属性',
        'REQ Jobs': '要求职业',
        'REQ LEV': '所需等级',
        'REQ STR': '需 力量',
        'REQ INT': '需 智力',
        'REQ DEX': '需 敏捷',
        'REQ LUK': '需 幸运',
        'Stat Info': '属性信息',
        'Set Info': '套装信息',
        'Attack Speed': '攻击速度',
        'Fast(5)': '快(5)',
        'Normal(6)': '普通(6)',
        'Slow(8)': '慢(8)',
        'Buff Duration': 'Buff持续时间',
        'Honor EXP': '荣誉经验',
        'Abnormal Status Resistance': '异常状态抗性',
        'Final Damage': '最终伤害',
        'Critical Damage': '暴击伤害',
        'Knockback Resistance': '击退抗性',
        'ATT & Magic ATT': '攻击力/魔力',
        'Attack Power and Magic ATT': '攻击力/魔力',
        'Damage Against Normal Monsters': '对普通怪物的伤害',
        'MaxHP / MaxMP': '最大HP/最大MP',
        'Knockback Chance': '直接攻击时击退几率',
        'Boss Damage': '攻击首领怪时，伤害',
        'Boss Monster Damage': '攻击首领怪时的伤害',
        '+20% Damage when attacking Von Leon': '攻击班·雷昂时，+20%伤害',
        '5% chance to apply Lv.2 Freeze when attacking.': '攻击时，有5%的概率造成2级冰冻效果',
        'Cannot Star Force Enhance': '无法进行星之力强化',
        'Cannot Set/Reset Potential': '无法设置/重置潜能',
        'Cannot Set/Reset Bonus Stats': '无法设置/重置属性',
        'Hyper Stats': '超属性',
        'Intelligence': '智力',
        'Equipped': '已装备',
        'Set Bonus': '套装属性',
        '2 Set Effect': '2套装效果',
        '3 Set Effect': '3套装效果',
        '4 Set Effect': '4套装效果',
        '5 Set Effect': '5套装效果',
        '6 Set Effect': '6套装效果',
        '7 Set Effect': '7套装效果',
        '9 Set Effect': '9套装效果',
        // 套装
        'Royal Von Leon Bowman Set': '皇家班·雷昂套装',
        // NFT 物品词缀 // NFT 物品词缀
        'Weapon': '武器',
        '(Weapon)': '(武器)',
        'One handed Weapon': '单手武器',
        'One handed Sword': '单手剑',
        'One handed Axe': '单手斧',
        'One handed Blunt Weapon': '单手钝器',
        'One-handed Weapon': '单手武器',
        'One-handed Sword': '单手剑',
        'One-handed Axe': '单手斧',
        'One-handed Blunt Weapon': '单手钝器',
        'Dagger': '短刀',
        'Wand': '短仗',
        'Staff': '长杖',
        'Staff, Wand': '长杖, 短仗',
        'Two handed Weapon': '双手武器',
        'Two handed Sword': '双手剑',
        'Two handed Axe': '双手斧',
        'Two handed Blunt': '双手钝器',
        'Two-handed Weapon': '双手武器',
        'Two-handed Sword': '双手剑',
        'Two-handed Axe': '双手斧',
        'Two-handed Blunt': '双手钝器',
        'Spear': '枪',
        'Polearm': '矛',
        'Bow': '弓',
        'Crossbow': '弩',
        'Claw': '拳套',
        'Knuckle': '指节',
        'Gun': '短枪',
        'One or Two Handed Swords or Axes': '单手剑, 双手剑, 单手斧, 双手斧',
        'One or Two Handed Swords or Blunt Weapons': '单手剑, 双手剑, 单手钝器, 双手钝器',
        'Spear, Polearm': '枪, 矛',
        'Throwing Stars, Claw': '飞镖, 拳套',
        'Secondary Weapon': '辅助装备',
        'Medal': '吊坠',
        'Can Equip Hero': '英雄职业群可穿戴装备',
        'Rosary': '念珠',
        'Can Equip Paladin': '圣骑士职业群可穿戴装备',
        'Iron Chain': '铁链',
        'Can Equip Dark Knight': '黑骑士职业群可穿戴装备',
        'Magic Book': '魔道书',
        'Can Equip Bishop': '主教职业群可穿戴装备',
        'Can Equip Arch Mage F/P': '火毒系列魔法师可穿戴装备',
        'Can Equip Arch Mage I/L': '冰雷系列魔法师可穿戴装备',
        'Arrow Fletching': '箭羽',
        'Can Equip Bowmaster': '神射手职业群可穿戴装备',
        'Bow Thimble': '扳指',
        'Can Equip Marksman': '箭神职业群可穿戴装备',
        'Dagger Scabbard': '短剑剑鞘',
        'Can Equip Shadower': '侠盗职业群可穿戴装备',
        'Charm': '护身符',
        'Can Equip Night Lord': '隐士职业群可穿戴装备',
        'Wrist Band': '手腕护带',
        'Can Equip Buccaneer': '冲锋队长职业群可穿戴装备',
        'Far Sight': '瞄准器',
        'Can Equip Corsair': '船长职业群可穿戴装备',
        'EQUIP': '装备',
        'DEC.': '时装',
        'Armor': '防具',
        '(Hat)': '(帽子)',
        '(Top)': '(上衣)',
        '(Outfit)': '(套装)',
        '(Bottom)': '(下装)',
        '(Shoes)': '(鞋子)',
        '(Gloves)': '(手套)',
        '(Cape)': '(披风)',
        'Hat': '帽子',
        'Top': '上衣',
        'Outfit': '套装',
        'Bottom': '下装',
        'Shoes': '鞋子',
        'Gloves': '手套',
        'Cape': '披风',
        'Accessory': '饰品',
        'FACE ACC': '脸饰',
        'EYE ACC': '眼饰',
        'EAR ACC': '耳环',
        'SHOULDER': '肩饰',
        'SUB WEAPON': '副武器',
        '(Face Accessory)': '(脸饰)',
        '(Eye Accessory)': '(眼饰)',
        '(Earrings)': '(耳环)',
        '(Ring)': '(戒指)',
        '(Pendant)': '(吊坠)',
        '(Belt)': '(腰带)',
        '(Shoulder)': '(肩饰)',
        '(Pocket Item)': '(口袋物品)',
        '(Badge)': '(徽章)',
        'Face Accessory': '脸饰',
        'Eye Accessory': '眼饰',
        'Earrings': '耳环',
        'Ring': '戒指',
        'Pendant': '吊坠',
        'Belt': '腰带',
        'Shoulder Accessory': '肩饰',
        'POCKET': '口袋',
        'Pocket Item': '口袋物品',
        'Badge': '徽章',
        'Emblem': '纹章',
        'Decoration': '装饰',
        'PET ACC': '宠物饰品',
        'Pet Equipment': '宠物装备',
        'Beauty': '美容',
        'Face': '脸部',
        'Hair': '头发',
        'Skin': '皮肤',
        'Color': '颜色',
        'Select Color': '选择颜色',
        'Utility': '实用',
        'Pet': '宠物',
        'Expanded Auto Move': '扩大移动范围',
        'Expanded Auto Move Skill': '扩大移动范围技能',
        'Magnet Effect': '磁力效果',
        'Magnet Effect Skill': '磁力效果技能',
        'Auto Buff': '自动使用Buff',
        'Auto Buff Skill': '自动使用Buff技能',
        'Auto Move': '自动拾取',
        'Auto Move Skill': '自动拾取技能',
        'Fatten Up Skill': '增强技能',
        'Pet Training Skill': '宠物训练技能',
        'Minted': '铸造',
        'Multi Pet(Can use up to 3 pets at once)': '多宠物（一次最多使用3个）',
        'Level 1, Closeness 1': '等级1，亲密度1',
        // 宠物技能汉化
        'Item Pouch': '捡取道具',
        'NESO Magnet': '捡NESO',
        'Fatten Up': '增强技能',
        'Auto HP Potion Pouch': '自动服用 HP药水',
        'Auto MP Potion Pouch': '自动服用 MP药水',
        'Set-up': '配置',
        'Chair': '椅子',
        'Mount': '坐骑',
        'Damage Skin': '伤害皮肤',
        'Arrow, Throwing Stars, and Bullets': '箭, 飞镖和子弹',
        'Arrow for Bow': '弓用箭矢',
        'Arrow for Crossbow': '弩用箭矢',
        'Throwing Stars': '飞镖',
        'Bullets': '子弹',
        'Class': '基础职业',
        'Job': '职业',
        'JOB DETAILS': '职业详情',
        'Potential': '潜能',
        'Bonus Potential': '额外潜能',
        'None': '无',
        'Rare': '稀有',
        'Epic': '史诗',
        'Unique': '罕见',
        'Legendary' : '传说',
        'Item)': '物品)',
        'Level Range': '等级范围',
        'Star Force Enhancement': '星级强化',
        'Search': '搜索',
        'No items match your search.': '没有匹配的物品。',
        'See All Items': '查看所有物品',
        'Recently Searched Items': '最近搜索的物品',
        'Reset': '重置',
        'Save Filter': '保存筛选',
        'Select the saved filter': '选择已保存的筛选',
        'Done': '完成',
        'The filter condition has been saved.': '筛选条件已保存。',
        'Preview': '预览',
        'Return to item image': '返回物品图片',
        'History': '历史',
        'See All History': '查看所有历史',
        'There is no history to display.': '没有可显示的历史。',
        'Name': '名称',
        'Character': '角色',
        'Date': '日期',
        'Details': '详情',
        'Navigator': '导航',
        'Circulating Supply': '流通供应量',
        'Max Supply': '最大供应量',
        'Token Standard': '代币标准',
        'Day(s)': ' 天',
        // https://msu.io/marketplace/ft
        'FT Item': 'FT 物品',
        'Umushroom Coupon (100-Day)': '蘑菇卷 Umushroom Coupon (100天)',
        'Red Florin': '红色弗林 Red Florin',
        'Blue Florin': '蓝色弗林 Blue Florin',
        'Green Florin': '绿色弗林 Green Florin',
        'Purified Chaos Yggdrasil Energy': '净化混沌尤格多西亚能量 Purified Chaos Yggdrasil Energy',
        'Mystic EXP Coupon Box': '神秘经验券盒 Mystic EXP Coupon Box',
        'Mystic Honor Coupon Box': '神秘荣誉券盒 Mystic Honor Coupon Box',
        'Vol.': '成交量',
        // https://msu.io/marketplace/character
        'Exchange Currency': '交换货币',
        'Voucher': '兑换券',
        'By Highest Trading Volume': '按最高交易量排序',
        'By Lowest Price': '按最低价格',
        'By Highest Price': '按最高价格',
        'By Highest Increase': '按最高涨幅排序',
        'By Lowest Increase': '按最低涨幅排序',
        'View My Items Only': '只查看我的物品',
        'Easy': '简单',
        'Normal': '普通',
        'Hard': '困难',
        'Chaos': '混沌',
        'Easy / Normal': '简单 / 普通',
        'Normal / Hard': '普通 / 困难',
        'Normal / Chaos': '普通 / 混沌',
        'Easy / Normal / Hard': '简单 / 普通 / 困难',
        'Easy / Normal / Chaos': '简单 / 普通 / 混沌',
        'Your holdings': '你的持有',
        'Floor price': '地板价格',
        'Prev Day Avg Price': '昨日平均价',
        '24h Volume': '24小时交易量',
        '24h Volume(NESO)': '24小时交易量 (NESO)',
        'Available Listings': '可用列表',
        'There are no listings.': '没有列表。',
        'Price (NESO)': '价格 (NESO)',
        'Quantity': '数量',
        'Buy': '购买',
        'Buy Now': '立即购买',
        'Available': '可用',
        'The purchase quantity has changed due to the listing status.': '由于列表状态的变化，购买数量已更改。',
        'Expected Price': '预期价格',
        'Automaticallymatches youwithlistings thatcanbepurchased atthelowest price,afterpriceper itemandfees.Calculations exclude items you\'ve listed.': '自动为您匹配在扣除每件物品价格和手续费后可按最低价格购买的列表。计算时排除您已列出的物品。',
        'Average Price per Item': '平均价格/件',
        'You will pay': '你将支付',
        'Sell': '出售',
        'Sale': '销售',
        'Last Sale': '最近成交价',
        'Confirm Sale': '确认销售',
        'Enter Price per Item': '输入价格/件',
        'Fee': '手续费',
        'You will get': '你将获得',
        'Trade History': '交易历史',
        'Current Item Trade History': '当前物品交易历史',
        'All Item Trade History': '所有物品交易历史',
        'Highest Price': '最高价格',
        'Lowest Price': '最低价格',
        'Average Price': '平均价格',
        'Trading Volume': '交易量',
        'Time': '时间',
        'Price History': '价格历史',
        '- Highest Price': '- 最高价格',
        '- Lowest Price': '- 最低价格',
        '- Average Price': '- 平均价格',
        '- Trading Volume': '- 交易量',
        '3Day': '3天',
        '3 Day': '3天',
        '5Day': '5天',
        '5 Day': '5天',
        '7Day': '7天',
        '7 Day': '7天',
        '14Day': '14天',
        '14 Day': '14天',
        '30Day': '30天',
        '30 Day': '30天',
        'Trading Volume(NESO)': '交易量 (NESO)',
        'Average Price(NESO)': '平均价格 (NESO)',
        'No trade history to display': '没有交易历史可显示',
        'My Listings': '我的列表',
        'All Items': '所有物品',
        'Current Item': '当前物品',
        'Log in to check your listings': '登录以查看您的列表。',
        'There is no active listings.': '没有活跃列表。',
        'Characters': '角色',
        // https://msu.io/marketplace/bid
        'Ability': '内在能力',
        'Buff skill duration': 'Buff技能持续时间',
        'The character\'s values may change due to character adjustments, balance patches, or other changes that may affect character stats.': '由于角色调整、平衡补丁或其他可能影响角色统计的变化，角色的值可能会发生变化。',
        'Advanced Search': '高级搜索',
        'No more can be added.': '无法添加更多。',
        'Used In-game': '游戏内使用',
        'Fame': '人气',
        'Nesolet': 'Neso铸造量',
        'Level Ranking': '等级排名',
        'Job Ranking': '职业排名',
        'Select': '选择',
        'Bid': '投标',
        // https://msu.io/marketplace/bid
        'Watching': '关注',
        'Bid Size: Large to Small': '投标大小: 从大到小',
        'Bid Price: High to Low': '投标价格: 从高到低',
        'Total Number of Bids': '总投标数',
        'Highest Bid': '最高投标',
        'All Bids': '所有投标',
        'Place Bid': '投标',
        'Bidder': '投标人',
        'Price per Items': '价格/件',
        'My Order': '我的订单',
        'There is no active order.': '没有活跃订单。',
        'Total Bids': '总投标数',
        'Lowest': '最低',
        'Highest': '最高',
        'Order': '订购',

        'Connect': '连接',
        'Connect Wallet': '连接钱包',
        'Connect your wallet to use MapleStory Universe!': '连接钱包即可使用 冒险岛宇宙！',
        'Continue with': '继续使用',
        'Inventory': '背包',
        'Insufficient Balance': '余额不足',
        'Logout': '登出',
        // https://msu.io/marketplace/inventory/
        'Owned': '拥有',
        'On sale': '出售中',
        'Cancellisting': '取消清单',
        'Would you like to cancel the listing?': '您想取消列表吗？',
        'No': '否',
        'Yes': '是',
        'Bookmark': '收藏夹',
        'No items bookmarked yet.': '暂无收藏项目。',
        'Explore Now': '立即探索',
        'Activity': '活动',
        // https://msu.io/
        'My Page': '我的页面',
        'Overview': '概览',
        'Account Status': '账户状态',
        'Verification': '验证',
        'Today\'s withdrawal limit': '今日提现限额',
        'Complete': '完成',
        'ID verified': 'ID已验证',
        'ID verification': 'ID验证',
        'Withdrawal Limit': '提现限额',
        'Social Account': '社交账号',
        'Unlinked': '未绑定',
        'Last Login': '最后登录',
        'View All': '查看全部',
        'Total Item Minted': '总铸造物品数量',
        'Total NESO Minted': '总铸造 NESO 数量',
        'Total Trading volume (NESO)': '总交易量 (NESO)',
        'Data may differ from actual data depending on the time accessed.': '数据可能会因访问时间的不同而有所不同。',
        'Asset Status': '资产状态',
        'Total NXPC Value': '总 NXPC 价值',
        'No NXPC owned.': '没有拥有的 NXPC。',
        'Bring with Swap&Warp': '携带 Swap&Warp',
        'Total NESO Value': '总 NESO 价值',
        'Setting': '设置',
        'Profile': '简介',
        'Nickname': '昵称',
        'Change': '修改',
        'Profile Image': '个人头像',
        'Email Address': '电子邮件地址',
        'Socials': '社交',
        'Link': '链接',
        'Service Restricted Location': '服务限制区域',
        'MapleStory Universe is not yet available in your current location.': 'MapleStory 宇宙目前不可在您的当前位置使用。/n 请检查网络,加速器等',
        'Confirm': '确认',
        'Allow MSU Asset Access Permission': '允许 MSU 资产访问权限',
        'Allowed': '允许',
        'Delete Account': '删除账户',
        // https://msu.io/swapnwarp
        'Swap': '兑换',
        'Warp': '传送',
        'Transactions': '交易',
        // https://static.msu.io/inspection
        'Server Under Maintenance': '服务器维护中',
        'We are currently undergoing scheduled maintenance to improve our services.We apologize for the inconvenience and appreciate your patience.Don\'t forget to keep up with our official channels for the latest updates.We hope to see you again soon!': '我们目前正在进行计划维护以改进我们的服务。\n对于造成的不便我们深表歉意，感谢您的耐心等待。\n请关注我们的官方渠道获取最新消息。\n期待很快与您再见！',
        'MapleStory Universe is currently undergoing scheduled maintenance to improve our services.We apologize for the inconvenience and appreciate your patience.Don\'t forget to keep up with our official channels for the latest updates.We\'re excited to see you in MapleStory Universe: The Genesis soon!': '冒险岛N 目前正在进行计划维护以改进我们的服务。\n对于造成的不便我们深表歉意，感谢您的耐心等待。\n请关注我们的官方渠道获取最新消息。\n我们期待在《冒险岛宇宙：起源》中与您相见！',
        'MapleStory Universe is not yet available in your location': '冒险岛N 目前不可在您的位置使用。\n请检查网络,加速器 \n并重启浏览器',
        'We are working hard to expand our reach beyond the currently serviced regions. We thank you for your patience and your support.': '我们正在努力扩大我们的服务范围，以满足更多地区的需求。\n感谢您的耐心和支持。',
        // https://docs.maplestoryn.io/
        'Welcome to MapleStory N': '欢迎来到冒险岛N',
        'Announcement': '通告',
        'MapleStory N Official Launch': '《MapleStory N 正式发布》',
        'Maintenance': '维护',
        'After Maintenance Ends': '维护结束后',
        // 'Link Skills': '链接技能',
        'Link Skills': 'Link技能',
        'What Are Link Skills?': '什么是Link技能？',
        'When the linked character reaches Level 120, the Skill effect will be enhanced to Level 2.  ': '当Link角色达到120级时，Link技能效果将提升至2级。',
        'If you have multiple characters of the same class within the same world, you can stack their Link Skills up to 3 times.': '如果您在同一世界中拥有多个相同职业的角色，您可以叠加他们的Link技能最多3次。',
        'For example, if you have 3 Adventurer Warrior characters, you can stack their Link Skills by transferring them to the same character.': '例如，如果您有3个冒险者战士角色，您可以通过将它们转移到同一个角色上来叠加他们的Link技能。。',
        'Skill Icon and Name': '技能图标和名称',
        'Bowman Link Skill Icon': '弓箭手Link技能',
        'Critical Rate': '暴击率',
        'Magician Link Skill Icon': '法师Link技能',
        'When attacking, has a 15% chance to identify the weakness of the enemy with the highest Max HP among those struck, granting you the following bonuses against them:': '当攻击敌人时，有15%的几率获得生命值最高的怪物的知识，给予以下效果：',
        'When attacking, has a 17% chance to identify the weakness of the enemy with the highest Max HP among those struck, granting you the following bonuses against them:': '当攻击敌人时，有17%的几率获得生命值最高的怪物的知识，给予以下效果：',
        'When attacking, has a 19% chance to identify the weakness of the enemy with the highest Max HP among those struck, granting you the following bonuses against them:': '当攻击敌人时，有19%的几率获得生命值最高的怪物的知识，给予以下效果：',
        'When attacking, has a 21% chance to identify the weakness of the enemy with the highest Max HP among those struck, granting you the following bonuses against them:': '当攻击敌人时，有21%的几率获得生命值最高的怪物的知识，给予以下效果：',
        'When attacking, has a 23% chance to identify the weakness of the enemy with the highest Max HP among those struck, granting you the following bonuses against them:': '当攻击敌人时，有23%的几率获得生命值最高的怪物的知识，给予以下效果：',
        'When attacking, has a 25% chance to identify the weakness of the enemy with the highest Max HP among those struck, granting you the following bonuses against them:': '当攻击敌人时，有25%的几率获得生命值最高的怪物的知识，给予以下效果：',
        'Damage per Stack': '每叠造成伤害',
        'Enemy DEF Ignored per Stack': '每叠造成敌人防御无视',
        'Effect Duration: 10 sec': '效果持续时间：10秒',
        'Stacks up to 3 times': '最多叠加3次',
        'Pirate Link Skill Icon': '海盗Link技能',
        'Damage Taken': '受到的伤害',
        'Thief Link Skill Icon': '飞侠Link技能',
        'Upon debuffing an enemy': '对敌人造成debuff时',
        'Cooldown: 20 sec': '冷却时间：20秒',
        'Warrior Link Skill Icon': '战士Link技能',
        'Automatically activates when your health falls to 15% of Max HP or below': '当你的生命值低于最大生命值的15%或以下时自动激活',
        // https://msu.io/navigator
        'Unique Active Wallets': '独特的活跃钱包',
        'MSU Marketplace Volume': 'MSU 市场交易量',
        'MapleStory Universe': '冒险岛宇宙',
        'Explore MSU\'s real-time on-chain and off-chain data freely on MSU Navigator.': '探索 MSU 的实时链上和链外数据在 MSU Navigator 上自由访问。',
        'Highest Price Equipment Item': '最高价格\n装备物品', 
        'Highest Price Decoration Item': '最高价格\n时装物品',
        'Character Rankings': '角色排名',
        'Information': '信息',
        'Play Rewards': '游戏奖励',
        'Max. Supply': '最大供应量',
        'Total': '总计',
        'Lootable': '可拾取',
        'Refers to an item that has not been looted yet in the MSU dApp and is the amount that the player can loot via gameplay.': '指尚未在 MSU dApp 中拾取的物品，是玩家通过游戏玩法可以拾取的数量。',
        'Close Price': '收盘价',
        'NESO Price': 'NESO 价格',
        'Enhancement Count': '强化次数',
        'Transaction Info': '交易信息',
        'More': '更多',
        // 'Link Skills': '链接技能',
        // https://msu.io/maplestoryn/launch-promotion
        'Share': '分享',
        'Mint your new story': '铸就你的新故事',
        'SCROLL': '滚动',
        'EVENT': '活动',
        'EVENT 0': '活动 0',
        'Character Minting': '角色铸造',
        'View Detail': '查看详情',
        'Step Up Mission': '升级任务',
        'HOW TO PARTICIPATE': '如何参与',
        'STEP': '步骤 ',
        'Daily Gift': '每日礼包',
        // 杂项
        'UPDATED': '已更新',
        'COMPLETED': '已完成',
        'KNOWN ISSUE': '已知问题',
        'Resolved': '已解决',
        'No Maintenance': '无需维护',
        'Important Note': '重要提示',
        'Important Note': '重要提示',
        'Improvement Details': '改进详情',
        'Maintenance Schedule': '维护时间表',
        'Maintenance Area': '维护区域',
        'Maintenance Details': '维护详情',
        'MapleStory N Patch': '冒险岛N 补丁',
        'NESO X EXP Drops Event Update': 'NESO X 经验掉落事件更新',
        'Server Check': '服务器检查',
        'Additional NESO Drop': '额外的 NESO 掉落',
        'System Improvements and Bug Fixes': '系统改进和 Bug 修复',
        'Events': '活动',
        'MapleStory N Web': '冒险岛N 网页',
        'System Improvements': '系统改进',
        'Bug Fixes': 'Bug修复',
        'Event Period': '活动期间',
        'Event Schedule': '活动时间表',
        'Event Objective': '活动目标',
        'Event Rewards': '活动奖励',
        'Official Channels': '官方频道',
        'MapleStory Universe Official Website': '冒险岛宇宙 官方网站',
        'MapleStory N Official Website': '冒险岛N 官方网站',
        'Community': '社区',
        'Official Links': '官方链接',
        'Official Discord': '官方 Discord',
        'Official X': '官方 X',
        'Official YouTube': '官方 YouTube',
        'Official Medium': '官方 Medium',
        'Official Telegram': '官方 Telegram',
        'Official Support': '官方支持',
        'Last updated': '最后更新',
    };

    /**
     * 在导航栏中“新手上路”和“下载中心”之间添加自定义链接。
     * 仅在 https://msu.io/maplestoryn/* 页面生效。
     * @function addCustomLinkToNav
     */
     const BOSS_URLS = {
        'Balrog': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=361260',
        'Hilla': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=360786',
        'Horntail': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=361276',
        'Pierre': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=353701',
        'Von bon': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=351256',
        'Bloody Queen': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=353712',
        'Vellum': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=353682',
        'Von Leon': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=361013',
        'Arkarium': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=361017',
        'OMNI-CLN': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=361274',
        'Pink Bean': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=361005',
        'Magnus': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=353692',
        'Papulatus': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=353697',
        'Cygnus': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=360783',
        'Zakum': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=361265',
        'Lotus': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=353707',
        'Damien': 'https://mxd.web.sdo.com/wiki/#/article?ArticleID=353685'
    };

    /**
     * @function addCustomLinkToNav
     * @description Adds a custom navigation link to the MSU page header.
     * The link is inserted after the "游戏状态" (Game Status) link.
     */
    function addCustomLinkToNav() {
            // 检查当前 URL 是否匹配 https://msu.io 主机并且路径以 /maplestoryn 开头
        if (!(window.location.hostname === 'msu.io' && window.location.pathname.startsWith('/maplestoryn'))) {
            return;
        }

        // 防止重复添加 (checks for the LI element's ID)
        if (document.getElementById('custom-msu-nav-li')) {
            return;
        }

        // 查找“游戏状态”链接元素，作为插入自定义链接的参照点
        const gameStatusLinkAnchor = document.querySelector('a[data-link="gnb-link"][href="/maplestoryn/gamestatus/ranking"]');

        if (gameStatusLinkAnchor) {
            const gameStatusLi = gameStatusLinkAnchor.closest('li._componentlinkContainer__list_2gwfu_89');

            if (gameStatusLi && gameStatusLi.parentElement) {
                // --- 自定义下拉菜单开始 ---
                const customLi = document.createElement('li');
                customLi.id = 'custom-msu-nav-li';
                customLi.className = '_componentlinkContainer__list_2gwfu_89'; // 匹配同级 li 的类名

                const dropdownContainer = document.createElement('div');
                dropdownContainer.className = '_dropdown_1nc4m_27'; // 下拉容器类名

                // 主触发链接 (MSN工具箱)
                const triggerLink = document.createElement('a');
                triggerLink.id = 'custom-msu-nav-link';
                triggerLink.href = 'javascript:void(0);'; // 通常下拉触发器不直接导航
                triggerLink.setAttribute('data-link', 'gnb-link');
                triggerLink.setAttribute('aria-haspopup', 'listbox');
                triggerLink.setAttribute('aria-expanded', 'false'); // 初始状态为折叠
                triggerLink.textContent = '次元站';

                // 下拉箭头图标
                const triggerIcon = document.createElement('i');
                triggerIcon.className = '_icon_keacv_5 _medium_keacv_24'; // 匹配游戏状态下拉图标类名
                triggerIcon.style.transform = 'translateY(0px)';
                triggerIcon.style.transition = '0.24s ease-out';
                triggerIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M16.585 10.6508L12.7592 15.1142C12.3601 15.5798 11.6398 15.5798 11.2407 15.1142L7.41489 10.6508C6.85888 10.0021 7.31979 9 8.17415 9L15.8257 9C16.6801 9 17.141 10.0021 16.585 10.6508Z" fill="currentColor"></path></svg>';
                triggerLink.appendChild(document.createTextNode(' ')); // 在文字和图标间加空格
                triggerLink.appendChild(triggerIcon);

                // 下拉菜单本身
                const dropdownMenu = document.createElement('div');
                dropdownMenu.className = '_dropdown__default_pos_1nc4m_68 _dropdown__menu_1nc4m_81'; // 匹配游戏状态下拉菜单类名
                dropdownMenu.setAttribute('role', 'listbox');
                dropdownMenu.style.minWidth = '180px'; // 与游戏状态菜单宽度一致
                dropdownMenu.style.display = 'none'; // 初始隐藏

                // 下拉菜单顶部的三角指示器
                // Create the SVG arrow using a string and insertAdjacentHTML for direct parsing by the browser.
                // This ensures the structure matches the user-provided working example as closely as possible.
                const svgArrowHTML = '<svg width="14" height="7" viewBox="0 0 14 7" fill="none" xmlns=" \`http://www.w3.org/2000/svg\`  " class="_dropdown__tri_1nc4m_61"><path d="M7 0.814411L1.02232 8.5H12.9777L7 0.814411Z" fill="white" stroke="#121619"></path></svg>';
                dropdownMenu.insertAdjacentHTML('afterbegin', svgArrowHTML);

                // 下拉菜单内部容器
                const innerDropdown = document.createElement('div');
                innerDropdown.className = '_inner_dropdown_1nc4m_126'; // 匹配游戏状态下拉菜单内部容器类名
                // 根据子链接数量调整高度，每个约40px
                const subLinkHeight = 40;
                const numberOfSubLinks = 4; // 您将有3个子链接
                innerDropdown.style.position = 'relative';
                innerDropdown.style.height = (subLinkHeight * numberOfSubLinks) + 'px';
                innerDropdown.style.width = '100%';
                innerDropdown.style.overflow = 'auto'; // 如果内容超出则显示滚动条

                const itemListDiv = document.createElement('div');
                itemListDiv.style.height = (subLinkHeight * numberOfSubLinks) + 'px';
                itemListDiv.style.width = '100%';

                // 定义子链接 (用户可在此修改)
                // 每个对象包含: text (显示文本), url (链接地址), target (可选, e.g., '_blank' 在新标签页打开)
                const subLinks = [
                    { text: "职业介绍", url: "https://mxd.web.sdo.com/wiki/#/Classes", target: "_blank" },
                    { text: "BOSS介绍", url: "https://mxd.web.sdo.com/wiki/#/catalog?index=set3", target: "_blank" },
                    { text: "Link技能", url: "https://bbs.gjfmxd.com/thread-583.htm", target: "_blank" },
                    { text: "任务攻略(自行搜索)", url: "https://mxd.web.sdo.com/wiki/#/search", target: "_blank" }
                ];

                subLinks.forEach((linkInfo, index) => {
                    const subLink = document.createElement('a');
                    subLink.className = '_dropdown__item_1nc4m_104 _dropdown__list_1nc4m_101'; // 匹配游戏状态子链接类名
                    subLink.href = linkInfo.url;
                    subLink.textContent = linkInfo.text;
                    if (linkInfo.target) {
                        subLink.target = linkInfo.target;
                    }
                    subLink.setAttribute('role', 'option');
                    subLink.style.position = 'absolute';
                    subLink.style.left = '0px';
                    subLink.style.top = (index * subLinkHeight) + 'px';
                    subLink.style.height = subLinkHeight + 'px';
                    subLink.style.width = '100%';
                    itemListDiv.appendChild(subLink);
                });

                innerDropdown.appendChild(itemListDiv);
                dropdownMenu.appendChild(innerDropdown);

                // 组装结构
                dropdownContainer.appendChild(triggerLink);
                dropdownContainer.appendChild(dropdownMenu);
                customLi.appendChild(dropdownContainer);

                // 事件处理：鼠标悬停显示/隐藏菜单
                dropdownContainer.addEventListener('mouseenter', () => {
                    dropdownMenu.style.display = 'block';
                    triggerLink.setAttribute('aria-expanded', 'true');
                    // 菜单打开时，箭头向上
                    triggerIcon.style.transform = 'translateY(-2px)';
                    const pathElement = triggerIcon.querySelector('svg path');
                    if (pathElement) {
                        pathElement.setAttribute('d', 'M7.41504 13.3492L11.2408 8.8858C11.6399 8.42019 12.3602 8.42019 12.7593 8.8858L16.5851 13.3492C17.1411 13.9979 16.6802 15 15.8259 15H8.1743C7.31994 15 6.85903 13.9979 7.41504 13.3492Z'); // 向上箭头路径
                    }
                });
                dropdownContainer.addEventListener('mouseleave', () => {
                    dropdownMenu.style.display = 'none';
                    triggerLink.setAttribute('aria-expanded', 'false');
                    // 菜单关闭时，箭头向下并恢复位置
                    triggerIcon.style.transform = 'translateY(0px)';
                    const pathElement = triggerIcon.querySelector('svg path');
                    if (pathElement) {
                        pathElement.setAttribute('d', 'M16.585 10.6508L12.7592 15.1142C12.3601 15.5798 11.6398 15.5798 11.2407 15.1142L7.41489 10.6508C6.85888 10.0021 7.31979 9 8.17415 9L15.8257 9C16.6801 9 17.141 10.0021 16.585 10.6508Z'); // 向下箭头路径
                    }
                });

                // 将新的 <li> 插入到“游戏状态”链接的 <li> 之后
                gameStatusLi.parentElement.insertBefore(customLi, gameStatusLi.nextSibling);
                // --- 自定义下拉菜单结束 ---

            } else {
                // console.warn('MSU Translation: "游戏状态" link\'s LI container not found or has no parent. Cannot add custom link.');
            }
        } else {
            // console.warn('MSU Translation: "游戏状态" anchor link not found. Cannot add custom link.');
        }
    }

function createFloatingButton() {
        const button = document.createElement('button');
        button.id = 'msu-translation-toggle';
        button.className = 'msu-translation-button';

        // 尝试从localStorage加载按钮位置
        const savedBottom = localStorage.getItem('msu-button-bottom');
        const savedRight = localStorage.getItem('msu-button-right');

        // 按钮基础样式
        button.style.position = 'fixed';
        button.style.bottom = savedBottom || '30px'; // 使用保存的位置或默认值
        button.style.right = savedRight || '30px';  // 使用保存的位置或默认值
        button.style.zIndex = '10000';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.borderRadius = '50%';
        button.style.border = 'none';
        button.style.cursor = 'grab'; // 初始光标为抓取
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        button.style.transition = 'transform 0.2s ease, background 0.3s ease';
        button.style.display = 'block'; // 允许子元素绝对定位
        button.style.backgroundImage = `url('https://globalstatic.xangle.io/explorer/nexon/logo/logo_mainnet_mobile.png')`;
        button.style.backgroundSize = 'contain';
        button.style.backgroundRepeat = 'no-repeat';
        button.style.backgroundPosition = 'center';
        button.style.backgroundColor = 'transparent';


        // 创建文本元素
        const textSpan = document.createElement('span');
        textSpan.id = 'msu-translation-text';
        textSpan.textContent = isTranslationEnabled ? '汉' : '英'; // 设置初始文本
        // 设置文本元素的样式，使其位于按钮右下角
        textSpan.style.position = 'absolute';
        textSpan.style.bottom = '-2px'; // 距离底部2px
        textSpan.style.right = '2px'; // 距离右侧2px
        textSpan.style.fontSize = '12px'; // 调整字体大小
        textSpan.style.fontWeight = 'bold'; // 加粗字体
        textSpan.style.color = '#000'; // 设置文字颜色为黑色
        textSpan.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // 添加半透明背景
        textSpan.style.borderRadius = '3px'; // 圆角
        textSpan.style.padding = '0 2px'; // 内边距
        button.appendChild(textSpan); // 将文本添加到按钮中

        if (!isTranslationEnabled) {
            button.style.filter = 'grayscale(100%)';
        }

        // 拖动功能实现
        let isDragging = false;
        let offsetX, offsetY;

        button.addEventListener('mousedown', (e) => {
            // 阻止点击事件的默认行为，防止与拖动冲突
            // e.preventDefault();
            isDragging = true;
            button.style.cursor = 'grabbing'; // 拖动时光标变为抓紧
            // 计算鼠标点击位置相对于按钮左上角的偏移
            offsetX = e.clientX - button.getBoundingClientRect().left;
            offsetY = e.clientY - button.getBoundingClientRect().top;

            // 移除可能的文本选择，提升拖动体验
            window.getSelection().removeAllRanges();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            // 计算按钮新的 right 和 bottom 值
            // window.innerWidth - e.clientX 是鼠标相对于窗口右边的距离
            // button.offsetWidth - offsetX 是鼠标点击点相对于按钮右边的距离
            // 新的 right = (鼠标相对于窗口右边的距离) - (鼠标点击点相对于按钮右边的距离)
            let newRight = window.innerWidth - e.clientX - (button.offsetWidth - offsetX);
            let newBottom = window.innerHeight - e.clientY - (button.offsetHeight - offsetY);

            // 边界检查，将按钮限制在右下角区域
            const minRight = 0; // 按钮右边缘不能超出屏幕右边缘
            const maxRightOverall = window.innerWidth - button.offsetWidth; // 按钮左边缘不能超出屏幕左边缘
            const minBottom = 0; // 按钮下边缘不能超出屏幕下边缘
            const maxBottomOverall = window.innerHeight - button.offsetHeight; // 按钮上边缘不能超出屏幕上边缘

            // 右下角四分之一区域限制


            // 应用X轴（左右）边界限制，限制在右侧四分之一区域
            newRight = Math.max(0, Math.min(newRight, (window.innerWidth * 0.25) - button.offsetWidth));

            // 应用Y轴（上下）边界限制，限制在底部四分之一区域
            newBottom = Math.max(0, Math.min(newBottom, (window.innerHeight * 0.25) - button.offsetHeight));

            button.style.right = `${newRight}px`;
            button.style.bottom = `${newBottom}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                button.style.cursor = 'grab'; // 拖动结束，光标恢复
                // 保存按钮位置到localStorage
                localStorage.setItem('msu-button-bottom', button.style.bottom);
                localStorage.setItem('msu-button-right', button.style.right);
            }
        });

        // 鼠标悬停效果 (在拖动逻辑之后，避免冲突)
        button.addEventListener('mouseenter', () => {
            if (!isDragging) { // 仅在非拖动状态下应用悬停效果
                button.style.transform = 'scale(1.1)';
                button.style.opacity = '0.9';
            }
        });
        button.addEventListener('mouseleave', () => {
            if (!isDragging) {
                button.style.transform = 'scale(1)';
                button.style.opacity = '1';
            }
        });

        // 点击事件 (需要处理与拖动的区分)
        let clickTimestamp = 0;
        button.addEventListener('mousedown', () => {
            clickTimestamp = Date.now(); // 记录按下时间
        });

        button.addEventListener('click', (e) => {
            // 如果 mousedown 和 click 事件之间的时间差很小，且没有发生拖动，则视为点击
            // isDragging 状态会在 mouseup 时重置，所以这里用时间差辅助判断
            if (Date.now() - clickTimestamp < 200 ) { // 200ms 内视为点击
                isTranslationEnabled = !isTranslationEnabled;

                if (isTranslationEnabled) {
                    button.style.filter = 'none';
                } else {
                    button.style.filter = 'grayscale(100%)';
                }
                saveTranslationState(isTranslationEnabled);

                // 更新按钮文本
                const textSpan = document.getElementById('msu-translation-text');
                if (textSpan) {
                    textSpan.textContent = isTranslationEnabled ? '汉' : '英';
                }

                if (isTranslationEnabled) {
                    translateElement(document.body);
                } else {
                    location.reload();
                }
            }
        });

        document.body.appendChild(button);
    }

    /**
     * 遍历元素并应用翻译
     * @param {Element} element - 要处理的DOM元素
     */
    function translateElement(element) {
        // 如果翻译已禁用则跳过
        if (!isTranslationEnabled) return;

        // 跳过脚本, 样式等非文本元素
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return;

        // 新增：检查是否为正在消失的悬浮窗 (tooltip)
        // 函数：检查并跳过正在消失的悬浮窗的翻译
        // 描述：如果元素是悬浮窗 (通过特定类名判断) 并且其 visibility 为 hidden 或 opacity 接近0，
        //       则不对此悬浮窗及其子内容进行翻译，以避免干扰其消失动画。
        if (element.nodeType === Node.ELEMENT_NODE && 
            (element.classList.contains('_tooltipContent_iqzgi_16') || element.getAttribute('role') === 'tooltip')) {
            const styles = window.getComputedStyle(element);
            if (styles.visibility === 'hidden' || parseFloat(styles.opacity) < 0.1) {
                return; // 如果悬浮窗不可见或透明度很低，则跳过翻译
            }
        }

        // 处理文本节点
        if (element.nodeType === Node.TEXT_NODE) {
            const originalTextContent = element.textContent.trim();
            if (!originalTextContent) return; // Skip empty text nodes
            const normalizedOriginalText = normalizeTextForLookup(originalTextContent);

            // --- BEGIN BOSS HYPERLINK LOGIC ---
            // 函数：处理BOSS名称的超链接
            // 描述：如果文本节点内容匹配 BOSS_URLS 中的某个BOSS名称 (可能带有括号内的难度)，
            //       则将BOSS名称部分替换为一个指向对应BOSS详情页面的超链接。
            //       括号内的难度文本（如果存在）会被翻译并作为普通文本附加在超链接之后。
            //       此功能优先于其他文本翻译规则。
            if (typeof BOSS_URLS !== 'undefined' && typeof CUSTOM_DICT !== 'undefined') { // Check if BOSS_URLS and CUSTOM_DICT are defined
                const bossWithDifficultyRegex = /^(.*?)\s*\(([^)]+)\)$/;
                const difficultyMatch = originalTextContent.match(bossWithDifficultyRegex);
                let potentialBossNameEng = originalTextContent;
                let difficultyEng = null;
                let hasDifficulty = false;

                if (difficultyMatch) {
                    potentialBossNameEng = difficultyMatch[1].trim();
                    difficultyEng = difficultyMatch[2].trim();
                    hasDifficulty = true;
                }

                if (BOSS_URLS.hasOwnProperty(potentialBossNameEng)) {
                    const parent = element.parentNode;
                    if (!parent || parent.nodeType !== Node.ELEMENT_NODE) {
                        // If parent is not suitable, skip.
                    } else {
                        const link = document.createElement('a');
                        link.href = BOSS_URLS[potentialBossNameEng];
                        link.textContent = CUSTOM_DICT[potentialBossNameEng] || potentialBossNameEng; // Translate Boss name
                        link.target = '_blank'; // Open in new tab
                        link.style.color = 'inherit'; // Inherit color from parent
                        link.style.textDecoration = 'underline'; // Add underline for clarity

                        parent.insertBefore(link, element);

                        if (hasDifficulty && difficultyEng) {
                            const translatedDifficulty = CUSTOM_DICT[difficultyEng] || difficultyEng;
                            const difficultyTextNode = document.createTextNode(` (${translatedDifficulty})`);
                            if (link.nextSibling) {
                                parent.insertBefore(difficultyTextNode, link.nextSibling);
                            } else {
                                parent.appendChild(difficultyTextNode);
                            }
                        }
                        parent.removeChild(element);
                        return; // Processed this node, skip further translation attempts for it
                    }
                }
            }
            // --- END BOSS HYPERLINK LOGIC ---

            // 新增：处理日期时间范围，例如 "May 17, 2025 11:00 ~ May 30, 2025 23:59 (UTC+0) (2 Hours)"
            const dateTimeRangeRegex = /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4}),?\s+(.*?)\s+~\s+([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4}),?\s+(\d{2}:\d{2})\s*(\([^)]+\))?\s*(\(\s*(\d+(\.\d+)?)\s*(Hour|Hours|Minute|Minutes|Day|Days|Day\(s\))\s*\))?$/i;


            const dateTimeRangeMatch = originalTextContent.match(dateTimeRangeRegex);

            if (dateTimeRangeMatch) {
                // 捕获组索引更新：
                // 1: Start Month
                // 2: Start Day
                // 3: Start Year
                // 4: Start Time/Text (e.g., "11:00" or "After Maintenance Ends")
                // 5: End Month
                // 6: End Day
                // 7: End Year
                // 8: End Time
                // 9: Timezone (optional)
                // 10: Duration group (optional)
                // 11: Duration value (optional)
                // 13: Duration unit (optional)

                const monthMap = {
                    "january": "1月", "jan": "1月",
                    "february": "2月", "feb": "2月",
                    "march": "3月", "mar": "3月",
                    "april": "4月", "apr": "4月",
                    "may": "5月",
                    "june": "6月", "jun": "6月",
                    "july": "7月", "jul": "7月",
                    "august": "8月", "aug": "8月",
                    "september": "9月", "sep": "9月", "sept": "9月",
                    "october": "10月", "oct": "10月",
                    "november": "11月", "nov": "11月",
                    "december": "12月", "dec": "12月"
                };

                const timeUnitMap = {
                    "hour": "小时", "hours": "小时",
                    "minute": "分钟", "minutes": "分钟",
                    "day": "天", "days": "天",
                    "day(s)": "天" // 新增对 Day(s) 的处理
                };

                const formatDateTimePart = (monthStr, day, year, timeOrText) => {
                    const monthChinese = monthMap[monthStr.toLowerCase()] || monthStr;
                    // 检查 timeOrText 是否在字典中，如果在则翻译，否则保留原文
                    const translatedTimeOrText = CUSTOM_DICT[timeOrText] || timeOrText;
                    return `${year}年${monthChinese}${day}日 ${translatedTimeOrText}`;
                };

                const startDateStr = formatDateTimePart(dateTimeRangeMatch[1], dateTimeRangeMatch[2], dateTimeRangeMatch[3], dateTimeRangeMatch[4]);

                const endDateStr = formatDateTimePart(dateTimeRangeMatch[5], dateTimeRangeMatch[6], dateTimeRangeMatch[7], dateTimeRangeMatch[8]);
                const timezone = dateTimeRangeMatch[9] ? ` ${dateTimeRangeMatch[9]}` : '';
                let remainingText = '';

                if (dateTimeRangeMatch[10]) { // 检查是否有时间单位部分
                    const timeValue = parseFloat(dateTimeRangeMatch[11]); // 使用 parseFloat 处理浮点数
                    const timeUnit = dateTimeRangeMatch[13].toLowerCase(); // 调整捕获组索引
                    const translatedTimeUnit = timeUnitMap[timeUnit] || timeUnit;
                    remainingText = ` (${timeValue} ${translatedTimeUnit})`;
                }

                element.textContent = `${startDateStr} ~ ${endDateStr}${timezone}${remainingText}`;
                return; // 已处理，提前返回
            }

            // 查找不区分大小写的匹配项，支持复数形式
            // 处理带日期的特殊文本


            // 查找不区分大小写的匹配项，支持复数形式
            // 处理带日期的特殊文本
            // 注意：originalTextContent 已经在前面定义和使用了，这里用 originalTextContent 替换 originalText
            if (originalTextContent.startsWith('Sale ends on ')) {
                const datePart = originalTextContent.substring('Sale ends on '.length);
                if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(datePart)) {
                    element.textContent = '销售截止于 ' + datePart;
                    return;
                }
            }

            // 新增：处理 “There is a new highest offer for [物品名称].”
            const offerMatch = originalTextContent.match(/^There is a new highest offer for (.*)\.$/i);
            if (offerMatch) {
                const itemName = offerMatch[1].trim();
                const translatedItemName = CUSTOM_DICT[itemName] || itemName;
                element.textContent = `${translatedItemName} 有一个新的最高报价。`;
                return;
            }

            // 新增：处理时间格式文本，例如 "X sec ago", "X min ago", "X hours ago", "X day ago", "X days ago"
            const timeAgoMatch = originalTextContent.match(/^(\d+)\s+(sec|secs|min|mins|hour|hours|Today|Todays|day|days|day\(s\)|month|months)\s+ago$/i); // 在正则表达式中添加 day(s)
            if (timeAgoMatch) {
                const value = parseInt(timeAgoMatch[1], 10);
                const unit = timeAgoMatch[2].toLowerCase();
                let translatedText = '';

                if (unit === 'min' || unit === 'mins') {
                    translatedText = `${value} 分钟前`;
                } else if (unit === 'hour' || unit === 'hours') {
                    translatedText = `${value} 小时前`;
                } else if (unit === 'day' || unit === 'days' || unit === 'day(s)') { // 在条件中添加 day(s)
                    translatedText = `${value} 天前`;
                } else if (unit === 'sec' || unit === 'secs') {
                    translatedText = `${value} 秒前`;
                } else if (unit === 'month' || unit === 'months') {
                    translatedText = `${value} 月前`;
                }

                if (translatedText) {
                    element.textContent = translatedText;
                    return; // 已处理，提前返回
                }
            }

            // 新增：处理宠物技能组合翻译
            // 检查文本是否包含逗号，并且第一个技能是 'Item Pouch' (宠物技能组合通常以此开头)
            if (originalTextContent.includes(',') && originalTextContent.startsWith('Item Pouch')) {
                const skills = originalTextContent.split(',').map(skill => skill.trim());
                const translatedSkills = skills.map(skill => {
                    // 查找单个技能的翻译
                    const matchedSkillKey = Object.keys(CUSTOM_DICT).find(
                        key => key.toLowerCase().replace(/[’']/g, "'") === skill.toLowerCase().replace(/[’']/g, "'")
                    );
                    return matchedSkillKey ? CUSTOM_DICT[matchedSkillKey] : skill; // 如果找到翻译则使用，否则保留原文本
                });
                // 重新组合翻译后的技能名称并添加数量
                element.textContent = translatedSkills.join(', ') + ` (${translatedSkills.length})`;
                return; // 已处理，提前返回
            }

            // 特殊处理'Top'与'Traders'同时出现的情况
            if (originalTextContent === 'Top' && element.parentElement &&
                Array.from(element.parentElement.children).some(child =>
                    child.textContent.includes('Traders')
                )) {
                element.textContent = 'Top榜';
                return;
            }

            // 新增：特殊处理 'Record-' 和 'breaking' 的组合
            // 例如：<span>Record-</span><br><span>breaking</span>
            if (originalTextContent === 'Record-' && element.parentNode && element.parentNode.tagName === 'SPAN') {
                let currentSibling = element.parentNode.nextSibling;
                let breakingSpan = null;
                // 遍历兄弟节点，寻找 'breaking' 所在的 SPAN，可以跳过 BR 标签
                while (currentSibling) {
                    if (currentSibling.nodeType === Node.ELEMENT_NODE) { // 只处理元素节点
                        if (currentSibling.tagName === 'SPAN' && currentSibling.textContent.trim().toLowerCase() === 'breaking') {
                            breakingSpan = currentSibling;
                            break; // 找到了目标 SPAN
                        } else if (currentSibling.tagName !== 'BR') {
                            // 如果遇到非 BR 的其他元素，则停止搜索，说明结构不匹配
                            break;
                        }
                    }
                    currentSibling = currentSibling.nextSibling;
                }
                if (breakingSpan) {
                    element.textContent = ''; // 清空 "Record-" 所在的文本节点
                    breakingSpan.textContent = '历史新高';    // 翻译 "breaking" SPAN 的内容
                    return; // 已处理此特殊组合，提前返回
                }
            }

            // 新增：处理 "[词语] 文本" 格式，例如 "[UPDATED] NESO X EXP Drops Event"
            // 函数：处理方括号词语前缀的文本
            // 描述：识别并翻译 "[词语] 文本" 格式的文本。提取方括号内的 "词语"，查找其翻译，
            //       如果找到，则将原文中的该部分替换为翻译后的版本，同时保留方括号和后面的文本。
            const bracketWordPrefixMatch = originalTextContent.match(/^\s*\[(.*?)\]\s*(.*)$/);
            if (bracketWordPrefixMatch) {
                const wordInBrackets = bracketWordPrefixMatch[1].trim();
                const remainingText = bracketWordPrefixMatch[2].trim();
                // 尝试直接查找，或者查找不区分大小写的版本
                let translatedWordInBrackets = CUSTOM_DICT[wordInBrackets];
                if (!translatedWordInBrackets) {
                    const lowerCaseWord = wordInBrackets.toLowerCase();
                    const dictKey = Object.keys(CUSTOM_DICT).find(key => key.toLowerCase() === lowerCaseWord);
                    if (dictKey) {
                        translatedWordInBrackets = CUSTOM_DICT[dictKey];
                    }
                }

                if (translatedWordInBrackets) {
                    element.textContent = `[${translatedWordInBrackets}] ${remainingText}`;
                    return; // 已处理，提前返回
                }
            }


            // 函数：处理带特殊符号前缀的文本
            // 描述：识别以特定特殊符号（如 '■', '⚠️'）开头的文本。
            //       如果找到，则分离此前缀，仅翻译符号后的文本部分。
            //       翻译成功后，将原始前缀与翻译结果重新组合。
            const specialPrefixes = ['■', '⚠️']; // 可根据需要扩展列表
            // 正则表达式匹配一个或多个特殊符号 (已转义)，后跟可选空格，然后捕获剩余文本。'i'标志使匹配不区分大小写。
            const prefixRegex = new RegExp(`^\s*(${specialPrefixes.map(p => p.replace(/[.*+?^${}()|[\\]\]/g, '\\$&')).join('|')})\s*(.*)$`, 'i');
            const prefixMatch = originalTextContent.match(prefixRegex);

            if (prefixMatch) {
                const detectedPrefix = prefixMatch[1]; // 捕获到的特殊符号前缀 (例如 '■' 或 '⚠️')
                const textAfterPrefix = prefixMatch[2].trim(); // 前缀后的文本内容, 已去除两端空格

                if (textAfterPrefix) { // 确保前缀后有文本才进行翻译
                    // 尝试翻译去除前缀后的文本 (优先精确匹配，然后不区分大小写匹配)
                    let translatedTextAfterPrefix = CUSTOM_DICT[textAfterPrefix]; 
                    if (!translatedTextAfterPrefix) {
                        const lowerCaseText = textAfterPrefix.toLowerCase();
                        const dictKey = Object.keys(CUSTOM_DICT).find(
                            key => key.toLowerCase().replace(/[’']/g, "'") === lowerCaseText.replace(/[’']/g, "'")
                        );
                        if (dictKey) {
                            translatedTextAfterPrefix = CUSTOM_DICT[dictKey];
                        }
                    }

                    if (translatedTextAfterPrefix) {
                        // 使用捕获到的原始前缀 (detectedPrefix) 和翻译后的文本组合
                        // 在前缀和翻译文本之间加一个空格，以确保格式正确
                        element.textContent = `${detectedPrefix} ${translatedTextAfterPrefix}`;
                        return; // 已处理，提前返回
                    }
                }
            }

            // 优先检查是否在字典中有完全匹配的条目
            const exactMatchKey = Object.keys(CUSTOM_DICT).find(
                key => normalizeTextForLookup(key) === normalizedOriginalText
            );
            if (exactMatchKey) {
                element.textContent = CUSTOM_DICT[exactMatchKey];
                return; // 已处理，提前返回
            }

            // 新增：处理 "文本 (词语)" 格式，例如 "Unchained Set (Thief)" 或 "Hilla (普通)"
            // 函数：处理带括号词语的文本
            // 描述：识别并翻译 "文本 (词语)" 格式的文本。提取括号外的文本和括号内的 "词语"，
            //       分别查找翻译，如果找到则使用翻译，否则保留原文，然后重新组合。
            const textWithParenthesesMatch = originalTextContent.match(/^(.*)\s*\(([^)]+)\)$/);
            if (textWithParenthesesMatch) {
                // 在拆分前，先检查原始完整字符串（规范化后）是否在字典中
                const fullStringKeyInDict = Object.keys(CUSTOM_DICT).find(
                    k => normalizeTextForLookup(k) === normalizedOriginalText
                );
                if (fullStringKeyInDict) {
                    element.textContent = CUSTOM_DICT[fullStringKeyInDict];
                    return; // 使用完整翻译并返回
                }

                // 如果完整字符串不在字典中，才进行拆分翻译
                const prefixText = textWithParenthesesMatch[1].trim();
                const wordInParentheses = textWithParenthesesMatch[2].trim();

                const normalizedPrefixText = normalizeTextForLookup(prefixText);
                const normalizedWordInParentheses = normalizeTextForLookup(wordInParentheses);

                const translatedPrefixKey = Object.keys(CUSTOM_DICT).find(k => normalizeTextForLookup(k) === normalizedPrefixText);
                const translatedWordInParenthesesKey = Object.keys(CUSTOM_DICT).find(k => normalizeTextForLookup(k) === normalizedWordInParentheses);

                const finalPrefix = translatedPrefixKey ? CUSTOM_DICT[translatedPrefixKey] : prefixText;
                const finalWord = translatedWordInParenthesesKey ? CUSTOM_DICT[translatedWordInParenthesesKey] : wordInParentheses;

                element.textContent = `${finalPrefix} (${finalWord})`;
                return; // 已处理，提前返回
            }

            // 新增：处理 "KEY: VALUE" 格式的文本
            // 函数：处理KeyValue格式文本
            // 描述：识别并翻译 "KEY: VALUE" 格式的文本，例如 "DEF: +100" 翻译为 "防御: +100"
            const keyValueMatch = originalTextContent.match(/^([^:]+):\s*(.*)$/);
            if (keyValueMatch) {
                const key = keyValueMatch[1].trim();
                const value = keyValueMatch[2].trim();
                const translatedKey = CUSTOM_DICT[key];
                if (translatedKey) {
                    element.textContent = `${translatedKey}: ${value}`;
                    return; // 已处理，提前返回
                }
            }

            // 如果不是数字，再尝试匹配字典 (处理复数形式或无空格匹配)
            const matchedKey = Object.keys(CUSTOM_DICT).find(
                key => {
                    // 标准化键名和文本，处理特殊字符
                    const normalizedKey = key.toLowerCase().replace(/[’']/g, "'");
                    const normalizedText = originalTextContent.toLowerCase().replace(/[’']/g, "'");
                    const keyWithoutSpaces = normalizedKey.replace(/\s+/g, '');
                    const textWithoutSpaces = normalizedText.replace(/\s+/g, '');
                    // 复数形式匹配(以s结尾)或无空格匹配
                    return (normalizedText.endsWith('s') && normalizedKey === normalizedText.slice(0, -1)) ||
                           keyWithoutSpaces === textWithoutSpaces;
                }
            );
            if (matchedKey) {
                element.textContent = element.textContent.replace(originalTextContent, CUSTOM_DICT[matchedKey]);
            }
        }

        // 递归处理子元素
        for (const child of element.childNodes) {
            translateElement(child);
        }
    }

    // 页面加载完成后触发翻译
    window.addEventListener('load', () => {
        createFloatingButton();
    addCustomLinkToNav(); // 添加自定义导航链接
        if (isTranslationEnabled) {
            translateElement(document.body);
        }

        // 监听DOM变化（处理动态加载内容和按钮移除）
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // 检查移除的节点
                mutation.removedNodes.forEach((node) => {
                    if (node.id === 'msu-translation-toggle') {
                        createFloatingButton();
    addCustomLinkToNav(); // 添加自定义导航链接
                    }
                });

                // 处理新增节点和文本变化
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                        translateElement(node);
                    }
                });

                // 处理属性变化
                if (mutation.type === 'attributes') {
                    translateElement(mutation.target);
                }
            });
        });

        // 监听整个文档的交互事件
        document.addEventListener('click', (event) => {
            // 延迟执行以确保DOM更新完成
            setTimeout(() => {
                if (isTranslationEnabled) {
                    translateElement(document.body);
                }
            }, 100);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            characterDataOldValue: true,
            attributes: true,
            attributeOldValue: true
        });
    });
})();