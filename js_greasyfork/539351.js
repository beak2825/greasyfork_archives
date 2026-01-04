// ==UserScript==
// @name         lol英雄名字替换
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动将中文英雄名、称号、昵称转换为英文，支持160+英雄别名（如“盲僧”→“Lee Sin”）
// @author       zq
// @match        https://runeforge.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=runeforge.dev
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539351/lol%E8%8B%B1%E9%9B%84%E5%90%8D%E5%AD%97%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/539351/lol%E8%8B%B1%E9%9B%84%E5%90%8D%E5%AD%97%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==//// ==UserScript==
// @name         lol英雄名字替换
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动将中文英雄名、称号、昵称转换为英文，支持160+英雄别名（如“盲僧”→“Lee Sin”）
// @author       You
// @match        https://runeforge.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=runeforge.dev
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // 中文到英文的映射表（这里以英雄联盟英雄名为例，可根据需要扩展）
    const translationMap = {
    // Aatrox
    '亚托克斯': 'Aatrox',
    '暗裔剑魔': 'Aatrox',

    // Ahri
    '阿狸': 'Ahri',
    '九尾妖狐': 'Ahri',

    // Akali
    '阿卡丽': 'Akali',
    '暗影之拳': 'Akali',

    // Alistar
    '阿利斯塔': 'Alistar',
    '牛头酋长': 'Alistar',

    // Amumu
    '阿木木': 'Amumu',
    '殇之木乃伊': 'Amumu',

    // Anivia
    '艾尼维亚': 'Anivia',
    '冰晶凤凰': 'Anivia',

    // Annie
    '安妮': 'Annie',
    '黑暗之女': 'Annie',

    // Ashe
    '艾希': 'Ashe',
    '寒冰射手': 'Ashe',

    // Aurelion Sol
    '奥瑞利安·索尔': 'Aurelion Sol',
    '铸星龙王': 'Aurelion Sol',

    // Azir
    '阿兹尔': 'Azir',
    '沙漠皇帝': 'Azir',

    // Bard
    '巴德': 'Bard',
    '星界游神': 'Bard',

    // Blitzcrank
    '布里茨': 'Blitzcrank',
    '蒸汽机器人': 'Blitzcrank',

    // Brand
    '布兰德': 'Brand',
    '复仇焰魂': 'Brand',

    // Braum
    '布隆': 'Braum',
    '弗雷尔卓德之心': 'Braum',

    // Camille
    '卡蜜尔': 'Camille',
    '青钢影': 'Camille',

    // Caitlyn
    '凯特琳': 'Caitlyn',
    '皮城女警': 'Caitlyn',

    // Cassiopeia
    '卡西奥佩娅': 'Cassiopeia',
    '魔蛇之拥': 'Cassiopeia',

    // Chogath
    '科加斯': 'Chogath',
    '虚空恐惧': 'Chogath',

    // Corki
    '库奇': 'Corki',
    '英勇投弹手': 'Corki',

    // Darius
    '德莱厄斯': 'Darius',
    '诺克萨斯之手': 'Darius',

    // Diana
    '戴安娜': 'Diana',
    '皎月女神': 'Diana',

    // Draven
    '德莱文': 'Draven',
    '荣耀行刑官': 'Draven',

    // Dr. Mundo
    '蒙多医生': 'Dr. Mundo',
    '祖安狂人': 'Dr. Mundo',

    // Ekko
    '艾克': 'Ekko',
    '时间刺客': 'Ekko',

    // Elise
    '伊莉丝': 'Elise',
    '蜘蛛女皇': 'Elise',

    // Evelynn
    '伊芙琳': 'Evelynn',
    '痛苦之拥': 'Evelynn',

    // Ezreal
    '伊泽瑞尔': 'Ezreal',
    '探险家': 'Ezreal',

    // Fiddlesticks
    '费德提克': 'Fiddlesticks',
    '末日使者': 'Fiddlesticks',

    // Fiora
    '菲奥娜': 'Fiora',
    '无双剑姬': 'Fiora',

    // Fizz
    '菲兹': 'Fizz',
    '潮汐海灵': 'Fizz',

    // Galio
    '加里奥': 'Galio',
    '正义巨像': 'Galio',

    // Gangplank
    '普朗克': 'Gangplank',
    '海洋之灾': 'Gangplank',

    // Garen
    '盖伦': 'Garen',
    '德玛西亚之力': 'Garen',

    // Gnar
    '纳尔': 'Gnar',
    '迷失之牙': 'Gnar',

    // Gragas
    '古拉加斯': 'Gragas',
    '酒桶': 'Gragas',

    // Graves
    '格雷福斯': 'Graves',
    '法外狂徒': 'Graves',

    // Hecarim
    '赫卡里姆': 'Hecarim',
    '战争之影': 'Hecarim',

    // Heimerdinger
    '黑默丁格': 'Heimerdinger',
    '大发明家': 'Heimerdinger',

    // Illaoi
    '俄洛伊': 'Illaoi',
    '海兽祭司': 'Illaoi',

    // Irelia
    '艾瑞莉娅': 'Irelia',
    '刀锋舞者': 'Irelia',

    // Ivern
    '艾翁': 'Ivern',
    '翠神': 'Ivern',

    // Janna
    '迦娜': 'Janna',
    '风暴之怒': 'Janna',

    // Jarvan IV
    '嘉文四世': 'Jarvan IV',
    '德玛西亚皇子': 'Jarvan IV',

    // Jax
    '贾克斯': 'Jax',
    '武器大师': 'Jax',

    // Jayce
    '杰斯': 'Jayce',
    '未来守护者': 'Jayce',

    // Jhin
    '烬': 'Jhin',
    '戏命师': 'Jhin',

    // Jinx
    '金克丝': 'Jinx',
    '暴走萝莉': 'Jinx',

    // Kaisa
    '卡莎': 'Kaisa',
    '虚空之女': 'Kaisa',

    // Kalista
    '卡莉丝塔': 'Kalista',
    '复仇之矛': 'Kalista',

    // Karma
    '卡尔玛': 'Karma',
    '天启者': 'Karma',

    // Kayle
    '凯尔': 'Kayle',
    '审判天使': 'Kayle',

    // Kayn
    '凯隐': 'Kayn',
    '影流之镰': 'Kayn',

    // Kennen
    '凯南': 'Kennen',
    '狂暴之心': 'Kennen',

    // Karthus
    '卡尔萨斯': 'Karthus',
    '死亡歌颂者': 'Karthus',

    // Kassadin
    '卡萨丁': 'Kassadin',
    '虚空行者': 'Kassadin',

    // Katarina
    '卡特琳娜': 'Katarina',
    '不祥之刃': 'Katarina',

    // Khazix
    '卡兹克': 'Khazix',
    '虚空掠夺者': 'Khazix',

    // Kindred
    '千珏': 'Kindred',
    '永猎双子': 'Kindred',

    // Kled
    '克烈': 'Kled',
    '暴怒骑士': 'Kled',

    // Kog'Maw
    '克格莫': 'KogMaw',
    '深渊巨口': 'KogMaw',
    '大嘴': 'KogMaw',


    // Leblanc
    '乐芙兰': 'Leblanc',
    '诡术妖姬': 'Leblanc',
    '妖姬': 'Leblanc',
    // Lee Sin
    '李青': 'Lee Sin',
    '盲僧': 'Lee Sin',
    '瞎子': 'Lee Sin',

    // Leona
    '蕾欧娜': 'Leona',
    '曙光女神': 'Leona',
    '日女': 'Leona',

    // Lissandra
    '丽桑卓': 'Lissandra',
    '冰霜女巫': 'Lissandra',
    '冰女': 'Lissandra',

    // Lucian
    '卢锡安': 'Lucian',
    '圣枪游侠': 'Lucian',

    // Lulu
    '璐璐': 'Lulu',
    '仙灵女巫': 'Lulu',

    // Lux
    '拉克丝': 'Lux',
    '光辉女郎': 'Lux',
    '光辉': 'Lux',

    // Malphite
    '墨菲特': 'Malphite',
    '熔岩巨兽': 'Malphite',
    '石头人': 'Malphite',

    // Malzahar
    '马尔扎哈': 'Malzahar',
    '虚空先知': 'Malzahar',
    '蚂蚱': 'Malzahar',

    // Maokai
    '茂凯': 'Maokai',
    '扭曲树精': 'Maokai',
    '大树': 'Maokai',

    // Master Yi
    '易': 'Master Yi',
    '易大师': 'Master Yi',
    '无极剑圣': 'Master Yi',
    '剑圣': 'Master Yi',

    // Miss Fortune
    '厄运小姐': 'Miss Fortune',
    '赏金猎人': 'Miss Fortune',
    '女枪': 'Miss Fortune',

    // Monkey King
    '孙悟空': 'Monkey King',
    '齐天大圣': 'Monkey King',
    '猴子': 'Monkey King',

    // Mordekaiser
    '莫德凯撒': 'Mordekaiser',
    '铁铠冥魂': 'Mordekaiser',
    '铁男': 'Mordekaiser',

    // Morgana
    '莫甘娜': 'Morgana',
    '堕落天使': 'Morgana',

    // Nami
    '娜美': 'Nami',
    '唤潮鲛姬': 'Nami',

    // Nasus
    '内瑟斯': 'Nasus',
    '沙漠死神': 'Nasus',
    '狗头': 'Nasus',

    // Nocturne
    '魔腾': 'Nocturne',
    '永恒梦魇': 'Nocturne',
    '梦魇': 'Nocturne',

    // Nautilus
    '诺提勒斯': 'Nautilus',
    '深海泰坦': 'Nautilus',
    '泰坦': 'Nautilus',

    // Nidalee
    '奈德丽': 'Nidalee',
    '狂野女猎手': 'Nidalee',
    '豹女': 'Nidalee',

    // Nunu
    '努努': 'Nunu',
    '雪人骑士': 'Nunu',

    // Olaf
    '奥拉夫': 'Olaf',
    '狂战士': 'Olaf',

    // Orianna
    '奥莉安娜': 'Orianna',
    '发条魔灵': 'Orianna',
    '发条': 'Orianna',

    // Ornn
    '奥恩': 'Ornn',
    '山隐之焰': 'Ornn',
    '山羊': 'Ornn',

    // Pantheon
    '潘森': 'Pantheon',
    '战争之王': 'Pantheon',

    // Poppy
    '波比': 'Poppy',
    '圣锤之毅': 'Poppy',

    // Pyke
    '派克': 'Pyke',
    '血港鬼影': 'Pyke',

    // Quinn
    '奎因': 'Quinn',
    '德玛西亚之翼': 'Quinn',

    // Rakan
    '洛': 'Rakan',
    '幻翎': 'Rakan',

    // Rammus
    '拉莫斯': 'Rammus',
    '披甲龙龟': 'Rammus',
    '龙龟': 'Rammus',

    // Rek'Sai
    '雷克赛': 'RekSai',
    '虚空遁地兽': 'RekSai',
    '挖掘机': 'RekSai',

    // Renekton
    '雷克顿': 'Renekton',
    '荒漠屠夫': 'Renekton',
    '鳄鱼': 'Renekton',

    // Rengar
    '雷恩加尔': 'Rengar',
    '傲之追猎者': 'Rengar',
    '狮子狗': 'Rengar',

    // Riven
    '锐雯': 'Riven',
    '放逐之刃': 'Riven',

    // Rumble
    '兰博': 'Rumble',
    '机械公敌': 'Rumble',

    // Ryze
    '瑞兹': 'Ryze',
    '符文法师': 'Ryze',

    // Sejuani
    '瑟庄妮': 'Sejuani',
    '北地之怒': 'Sejuani',
    '猪女': 'Sejuani',

    // Shaco
    '萨科': 'Shaco',
    '恶魔小丑': 'Shaco',
    '小丑': 'Shaco',

    // Shen
    '慎': 'Shen',
    '暮光之眼': 'Shen',

    // Shyvana
    '希瓦娜': 'Shyvana',
    '龙血武姬': 'Shyvana',
    '龙女': 'Shyvana',

    // Singed
    '辛吉德': 'Singed',
    '炼金术士': 'Singed',
    '炼金': 'Singed',

    // Sion
    '赛恩': 'Sion',
    '亡灵战神': 'Sion',

    // Sivir
    '希维尔': 'Sivir',
    '战争女神': 'Sivir',
    '轮子妈': 'Sivir',

    // Skarner
    '斯卡纳': 'Skarner',
    '水晶先锋': 'Skarner',
    '蝎子': 'Skarner',

    // Sona
    '索娜': 'Sona',
    '琴瑟仙女': 'Sona',
    '琴女': 'Sona',

    // Soraka
    '索拉卡': 'Soraka',
    '众星之子': 'Soraka',
    '奶妈': 'Soraka',

    // Swain
    '斯维因': 'Swain',
    '诺克萨斯统领': 'Swain',
    '乌鸦': 'Swain',

    // Syndra
    '辛德拉': 'Syndra',
    '暗黑元首': 'Syndra',
    '球女': 'Syndra',

    // Tahm Kench
    '塔姆': 'Tahm Kench',
    '河流之王': 'Tahm Kench',

    // Taliyah
    '塔莉垭': 'Taliyah',
    '岩雀': 'Taliyah',

    // Talon
    '泰隆': 'Talon',
    '刀锋之影': 'Talon',
    '男刀': 'Talon',

    // Taric
    '塔里克': 'Taric',
    '瓦罗兰之盾': 'Taric',

    // Teemo
    '提莫': 'Teemo',
    '迅捷斥候': 'Teemo',

    // Trundle
    '特朗德尔': 'Trundle',
    '巨魔之王': 'Trundle',
    '巨魔': 'Trundle',

    // Tryndamere
    '泰达米尔': 'Tryndamere',
    '蛮族之王': 'Tryndamere',
    '蛮王': 'Tryndamere',

    // Twisted Fate
    '崔斯特': 'Twisted Fate',
    '卡牌大师': 'Twisted Fate',
    '卡牌': 'Twisted Fate',

    // Tristana
    '崔丝塔娜': 'Tristana',
    '麦林炮手': 'Tristana',
    '小炮': 'Tristana',

    // Twitch
    '图奇': 'Twitch',
    '瘟疫之源': 'Twitch',
    '老鼠': 'Twitch',

    // Thresh
    '锤石': 'Thresh',
    '魂锁典狱长': 'Thresh',

    // Udyr
    '乌迪尔': 'Udyr',
    '兽灵行者': 'Udyr',

    // Urgot
    '厄加特': 'Urgot',
    '无畏战车': 'Urgot',

    // Varus
    '维鲁斯': 'Varus',
    '惩戒之箭': 'Varus',

    // Vayne
    '薇恩': 'Vayne',
    '暗夜猎手': 'Vayne',
    'vn': 'Vayne',

    // Vi
    '蔚': 'Vi',
    '皮城执法官': 'Vi',

    // Viktor
    '维克托': 'Viktor',
    '机械先驱': 'Viktor',

    // Veigar
    '维迦': 'Veigar',
    '邪恶小法师': 'Veigar',
    '小法': 'Veigar',

    // Velkoz
    '维克兹': 'Velkoz',
    '虚空之眼': 'Velkoz',
    '大眼': 'Velkoz',

    // Vladimir
    '弗拉基米尔': 'Vladimir',
    '猩红收割者': 'Vladimir',
    '吸血鬼': 'Vladimir',

    // Volibear
    '沃利贝尔': 'Volibear',
    '雷霆咆哮': 'Volibear',
    '狗熊': 'Volibear',

    // Warwick
    '沃里克': 'Warwick',
    '祖安怒兽': 'Warwick',
    '狼人': 'Warwick',

    // Xayah
    '霞': 'Xayah',
    '逆羽': 'Xayah',

    // Xerath
    '泽拉斯': 'Xerath',
    '远古巫灵': 'Xerath',

    // Xin Zhao
    '赵信': 'Xin Zhao',
    '德邦总管': 'Xin Zhao',

    // Yasuo
    '亚索': 'Yasuo',
    '疾风剑豪': 'Yasuo',

    // Yorick
    '约里克': 'Yorick',
    '牧魂人': 'Yorick',
    '掘墓': 'Yorick',

    // Zac
    '扎克': 'Zac',
    '生化魔人': 'Zac',

    // Zed
    '劫': 'Zed',
    '影流之主': 'Zed',

    // Ziggs
    '吉格斯': 'Ziggs',
    '爆破鬼才': 'Ziggs',
    '炸弹人': 'Ziggs',

    // Zilean
    '基兰': 'Zilean',
    '时光守护者': 'Zilean',
    '时光老人': 'Zilean',

    // Zoe
    '佐伊': 'Zoe',
    '暮光星灵': 'Zoe',

    // Zyra
    '婕拉': 'Zyra',
    '荆棘之兴': 'Zyra'
};

    // 获取搜索输入框
    const searchInput = document.getElementsByName('search')[0];
    if (!searchInput) return;

    // 存储原始的input事件处理函数（如果有的话）
    const originalInputHandler = searchInput.oninput;

    // 阻止原始的input事件处理
    searchInput.oninput = null;

    // 记录上次的输入值，用于判断是否需要触发搜索
    let lastInputValue = '';

    // 防抖函数，避免频繁触发搜索
    function debounce(func, delay) {
        let timer = null;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // 处理用户输入的函数
    const handleUserInput = debounce(function(e) {
        let inputValue = e.target.value;

        // 如果输入包含中文，尝试替换为英文
        if (/[\u4e00-\u9fa5]/.test(inputValue)) {
            let translatedValue = inputValue;

            // 遍历翻译映射表，替换所有匹配的中文
            Object.keys(translationMap).forEach(chinese => {
                const regex = new RegExp(chinese, 'g');
                translatedValue = translatedValue.replace(regex, translationMap[chinese]);
            });

            // 如果有替换，更新输入框的值
            if (translatedValue !== inputValue) {
                searchInput.value = translatedValue;
                inputValue = translatedValue;
            }
        }

        // 只有当值确实发生变化时才触发搜索
        if (inputValue !== lastInputValue) {
            lastInputValue = inputValue;

            // 创建并触发新的input事件
            const newInputEvent = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(newInputEvent);
        }
    }, 300); // 300ms防抖延迟

    // 监听用户输入事件
    searchInput.addEventListener('input', handleUserInput);

    // 如果需要保留原始的input事件处理函数，可以在自定义处理后调用它
    if (originalInputHandler) {
        searchInput.addEventListener('input', originalInputHandler);
    }
})();