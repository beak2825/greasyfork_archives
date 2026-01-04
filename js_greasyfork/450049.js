// ==UserScript==
// @name         流浪商人汉化
// @version      0.16
// @author       酷月（QQ:116179904）
// @match        https://lostmerchants.com/*
// @connect      lostmerchants.com
// @grant        none
// @description  失落的方舟流浪商人汉化
// @license           LGPLv3
// @namespace https://greasyfork.org/users/949427
// @downloadURL https://update.greasyfork.org/scripts/450049/%E6%B5%81%E6%B5%AA%E5%95%86%E4%BA%BA%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/450049/%E6%B5%81%E6%B5%AA%E5%95%86%E4%BA%BA%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

function getChineseEnglish(q){
    var a="";
    q = q[0]
    if(q == "feiton"){
        a = "佩顿"
    }else if(q == "rethramis"){
        a = "阿尔忒弥斯"
    }else if(q == "west luterra"){
        a = "卢特兰西部"
    }else if(q == "east luterra"){
        a = "卢特兰东部"
    }else if(q == "tortoyk"){
        a = "托托克"
    }else if(q == "arthetine"){
        a = "阿尔泰因"
    }else if(q == "north vern"){
        a = "伯尔尼北部"
    }else if(q == "rohendel"){
        a = "罗享达尔"
    }else if(q == "yorn"){
        a = "约拿"
    }else if(q == "punika"){
        a = "帕普尼卡"
    }else if(q == "south vern"){
        a = "伯尔尼南部"
    }else if(q == "yudia"){
        a = "尤迪亚"
    }else if(q == "anikka"){
        a = "安忆谷"
    }else if(q == "shushire"){
        a = "休沙瑞"
    }else if(q == "rethramis border"){
        a = "阿尔忒弥斯边境"
    }else if(q == "bilbrin forest"){
        a = "比尔布林森林"
    }else if(q == "saland hill"){
        a = "萨兰德丘陵"
    }else if(q == "dyorika plain"){
        a = "迪奥利卡平原"
    }else if(q == "prisma valley"){
        a = "镜谷"
    }else if(q == "icewing heights"){
        a = "冰蝶悬崖"
    }else if(q == "seaswept woods"){
        a = "海香森林"
    }else if(q == "kalaja"){
        a = "卡拉扎村"
    }else if(q == "leyar terrace"){
        a = "拉伊亚阶地"
    }else if(q == "scraplands"){
        a = "分裂之地"
    }else if(q == "medrick monastery"){
        a = "梅德里克修道院"
    }else if(q == "battlebound plains"){
        a = "激战平原"
    }else if(q == "mount zagoras"){
        a = "扎格拉斯山"
    }else if(q == "lakebar"){
        a = "雷科巴"
    }else if(q == "blackrose chapel"){
        a = "黑玫瑰教堂"
    }else if(q == "borea's domain"){
        a = "博伦亚领地"
    }else if(q == "croconys seashore"){
        a = "鳄鱼海岸"
    }else if(q == "forest of giants"){
        a = "巨人之森"
    }else if(q == "skyreach steppe"){
        a = "天际草原"
    }else if(q == "sweetwater forest"){
        a = "甜蜜森林"
    }else if(q == "ankumo mountain"){
        a = "安格莫斯山麓"
    }else if(q == "loghill"){
        a = "罗格希尔"
    }else if(q == "balankar mountains"){
        a = "巴兰卡山脉"
    }else if(q == "fesnar highland"){
        a = "佩斯纳尔高原"
    }else if(q == "parna forest"){
        a = "帕尔纳森林"
    }else if(q == "port krona"){
        a = "克罗纳港"
    }else if(q == "vernese forest"){
        a = "维尔尼尔森林"
    }else if(q == "black anvil mine"){
        a = "黑铁砧车间"
    }else if(q == "hall of promise"){
        a = "约定之地"
    }else if(q == "iron hammer mine"){
        a = "铁锤车间"
    }else if(q == "unfinished garden"){
        a = "未完成的花园"
    }else if(q == "yorn's cradle"){
        a = "起始之地"
    }else if(q == "candaria territory"){
        a = "坎达利亚领地"
    }else if(q == "bellion ruins"){
        a = "贝尔利温遗迹"
    }else if(q == "ozhorn hill"){
        a = "奥兹霍恩丘陵"
    }else if(q == "saland hill"){
        a = "萨兰德丘陵"
    }else if(q == "flowering orchard"){
        a = "梨树栖息地"
    }else if(q == "sunbright hill"){
        a = "圆虹之丘"
    }else if(q == "delphi township"){
        a = "武县"
    }else if(q == "melody forest"){
        a = "旋律森林"
    }else if(q == "rattan hill"){
        a = "藤丘"
    }else if(q == "twilight mists"){
        a = "暮光之雾"
    }else if(q == "arid path"){
        a = "贫瘠通道"
    }else if(q == "nebelhorn"){
        a = "内伯尔霍伦"
    }else if(q == "riza falls"){
        a = "里奇瀑布"
    }else if(q == "totrich"){
        a = "托特里奇"
    }else if(q == "windbringer hills"){
        a = "清风丘陵"
    }else if(q == "frozen sea"){
        a = "冰封之海"
    }else if(q == "bitterwind hill"){
        a = "风刃之丘"
    }else if(q == "iceblood plateau"){
        a = "霜狱高原"
    }else if(q == "lake eternity"){
        a = "永恒湖"
    }else if(q == "elzowin's shade"){
        a = "埃尔佐温的树荫"
    }else if(q == "breezesome brae"){
        a = "风香之丘"
    }else if(q == "glass lotus lake"){
        a = "琉璃莲花湖"
    }else if(q == "lake shiverwave"){
        a = "银波湖"
    }else if(q == "xeneela ruins"){
        a = "荒废的泽纳尔"
    }else if(q == "tideshelf path"){
        a = "浅海之路"
    }else if(q == "starsand beach"){
        a = "星星沙滩"
    }else if(q == "tikatika colony"){
        a = "蒂卡蒂卡群落地"
    }else if(q == "secret forest"){
        a = "秘密森林"
    }else if(q == "rowen"){
        a = "洛温"
    }else if(q == "fang river"){
        a = "盘牙河"
    }else if(q == "the wolflands"){
        a = "卧狼之地"
    }else if(q == "elgacia"){
        a = "埃尔加西亚"
    }else if(q == "hestera garden"){
        a = "海丝特拉花园"
    }else if(q == "mount phylantos"){
        a = "菲兰托斯山"
    }

    return a;
}

var timer;
timer = setInterval((function() {
    'use strict';
    //汉化岛屿地图
    var u =document.querySelectorAll("tr")
    var re2 = /(?<=\()(.*)(?=\))/;
    for(let o=1;u.length>o;o=o+2){
        var q = u[o].querySelectorAll("td");
        var y = re2.exec(q[0].innerText.toLowerCase())
        if(y != null){
            q[0].innerText=getChineseEnglish(y);
         }
        }
//汉化卡片和礼物
    var s = document.querySelectorAll("span");
    for(let o=0;s.length>o;o++){
        q = s[o].innerText
        if(q == "Nox"){
            s[o].innerText = "诺克斯"
        }else if(q == "Berhart"){
            s[o].innerText = "贝尔哈特"
        }else if(q == "Cadogan"){
            s[o].innerText = "卡多甘"
        }else if(q == "Cassleford"){
            s[o].innerText = "哈瑟林克"
        }else if(q == "Black Rose"){
            s[o].innerText = "黑玫瑰"
        }else if(q == "Lakebar Tomato Juice"){
            s[o].innerText = "雷科巴西红柿汁"
        }else if(q == "Stalwart Cage"){
            s[o].innerText = "坚固的鸟笼"
        }else if(q == "Chain War Chronicles"){
            s[o].innerText = "铁链战争实录"
        }else if(q == "Seria"){
            s[o].innerText = "赛利亚"
        }else if(q == "Thunderwings"){
            s[o].innerText = "雷之翼"
        }else if(q == "Azenaporium Brooch"){
            s[o].innerText = "阿塞纳佛利姆胸针"
        }else if(q == "Dyorika Straw Hat"){
            s[o].innerText = "迪奥利卡草帽"
        }else if(q == "Model of Luterra's Sword"){
            s[o].innerText = "卢特兰之剑仿造品"
        }else if(q == "Egg of Creation"){
            s[o].innerText = "创造之蛋"
        }else if(q == "Eolh"){
            s[o].innerText = "守护者爱奥尔"
        }else if(q == "Mokamoka"){
            s[o].innerText = "摩卡摩卡"
        }else if(q == "Mokoko Carrot"){
            s[o].innerText = "莫可可胡萝卜"
        }else if(q == "Oversized Ladybug Doll"){
            s[o].innerText = "特大瓢虫娃娃"
        }else if(q == "Round Glass Piece"){
            s[o].innerText = "圆圆的玻璃碎片"
        }else if(q == "Shy Wind Flower Pollen"){
            s[o].innerText = "羞涩的风花粉"
        }else if(q == "Siera"){
            s[o].innerText = "希拉"
        }else if(q == "Prideholme Neria"){
            s[o].innerText = "莱昂哈特涅利亚"
        }else if(q == "Varut"){
            s[o].innerText = "巴鲁图"
        }else if(q == "Fancier Bouquet"){
            s[o].innerText = "豪华华丽的花束"
        }else if(q == "Prideholme Potato"){
            s[o].innerText = "莱昂哈特土豆"
        }else if(q == "Rethramis Holy Water"){
            s[o].innerText = "阿尔忒弥斯圣水"
        }else if(q == "Pit-a-Pat Chest"){
            s[o].innerText = "扑通扑通箱"
        }else if(q == "Gideon"){
            s[o].innerText = "吉迪恩"
        }else if(q == "Payla"){
            s[o].innerText = "佩林"
        }else if(q == "Thar"){
            s[o].innerText = "拉哈特"
        }else if(q == "Crystallized Magick"){
            s[o].innerText = "魔力结晶"
        }else if(q == "Exquisite Music Box"){
            s[o].innerText = "华丽的音乐盒"
        }else if(q == "Goblin Yam"){
            s[o].innerText = "哥布林地瓜"
        }else if(q == "Magick Cloth"){
            s[o].innerText = "魔法布料"
        }else if(q == "Queen's Knights Application"){
            s[o].innerText = "骑士团入团申请书"
        }else if(q == "Vern's Founding Coin"){
            s[o].innerText = "伯尔尼建国纪念币"
        }else if(q == "Great Castle Neria"){
            s[o].innerText = "伟大的城堡涅利亚"
        }else if(q == "Piyer"){
            s[o].innerText = "皮埃尔"
        }else if(q == "Kaysarr"){
            s[o].innerText = "凯撒尔"
        }else if(q == "Piyer's Secret Textbook"){
            s[o].innerText = "皮埃尔的秘籍"
        }else if(q == "Fargar's Beer"){
            s[o].innerText = "帕胡图尔啤酒"
        }else if(q == "Killian"){
            s[o].innerText = "基里恩"
        }else if(q == "Satra"){
            s[o].innerText = "萨特拉"
        }else if(q == "Lujean"){
            s[o].innerText = "鲁吉内"
        }else if(q == "Vern Zenlord"){
            s[o].innerText = "伯尔尼森罗德"
        }else if(q == "Xereon"){
            s[o].innerText = "杰雷温"
        }else if(q == "Feather Fan"){
            s[o].innerText = "羽毛扇"
        }else if(q == "Febre Potion"){
            s[o].innerText = "法布里药水"
        }else if(q == "Mockup Firefly"){
            s[o].innerText = "模型萤火虫"
        }else if(q == "Necromancer's Records"){
            s[o].innerText = "死灵法师的日志"
        }else if(q == "Giant Worm"){
            s[o].innerText = "巨型蠕虫"
        }else if(q == "Morina"){
            s[o].innerText = "莫丽纳"
        }else if(q == "Thunder"){
            s[o].innerText = "天动"
        }else if(q == "Yudia Natural Salt"){
            s[o].innerText = "尤迪亚天然盐"
        }else if(q == "Yudia Spellbook"){
            s[o].innerText = "尤迪亚的咒术书"
        }else if(q == "Sky Reflection Oil"){
            s[o].innerText = "照亮天空的油"
        }else if(q == "Brinewt"){
            s[o].innerText = "普论战士布里纽"
        }else if(q == "Morpheo"){
            s[o].innerText = "莫尔贝奥"
        }else if(q == "Meehan"){
            s[o].innerText = "米汉"
        }else if(q == "Madam Moonscent"){
            s[o].innerText = "月香仙人"
        }else if(q == "Sir Druden"){
            s[o].innerText = "绘画仙人"
        }else if(q == "Sir Valleylead"){
            s[o].innerText = "大师傅仙人"
        }else if(q == "Wei"){
            s[o].innerText = "维"
        }else if(q == "Tournament Entrance Stamp"){
            s[o].innerText = "比武大会参赛证"
        }else if(q == "Angler's Fishing Pole"){
            s[o].innerText = "姜太公的鱼竿"
        }else if(q == "Morpheo"){
            s[o].innerText = "莫尔贝奥"
        }else if(q == "Bergstrom"){
            s[o].innerText = "阿伊曼"
        }else if(q == "Stern Neria"){
            s[o].innerText = "涅利亚(休特伦)"
        }else if(q == "Krause"){
            s[o].innerText = "凯恩"
        }else if(q == "Energy X7 Capsule"){
            s[o].innerText = "X7能量胶囊"
        }else if(q == "Fine Gramophone"){
            s[o].innerText = "高级留声机"
        }else if(q == "Javern"){
            s[o].innerText = "贾伯恩"
        }else if(q == "Sian"){
            s[o].innerText = "希安"
        }else if(q == "Bergstrom"){
            s[o].innerText = "阿伊曼"
        }else if(q == "Madnick"){
            s[o].innerText = "金·马德尼克"
        }else if(q == "Shimmering Essence"){
            s[o].innerText = "闪耀的精华"
        }else if(q == "Sirius's Holy Book"){
            s[o].innerText = "赛尔斯圣经"
        }else if(q == "Alifer"){
            s[o].innerText = "阿利弗尔"
        }else if(q == "Lenora"){
            s[o].innerText = "艾莉诺亚"
        }else if(q == "Gnosis"){
            s[o].innerText = "古诺西斯"
        }else if(q == "Danube's Earrings"){
            s[o].innerText = "丹尼斯布的耳环"
        }else if(q == "Elemental's Feather"){
            s[o].innerText = "精灵羽毛"
        }else if(q == "Soundstone of Dawn"){
            s[o].innerText = "黎明魔石"
        }else if(q == "Sylvain Queens' Blessing"){
            s[o].innerText = "西琳女王的祝福"
        }else if(q == "Cicerra"){
            s[o].innerText = "基凯撒"
        }else if(q == "Seto"){
            s[o].innerText = "塞特"
        }else if(q == "Stella"){
            s[o].innerText = "斯特拉"
        }else if(q == "Albion"){
            s[o].innerText = "阿尔比恩"
        }else if(q == "Hollowfruit"){
            s[o].innerText = "伯顿库尔果实"
        }else if(q == "Pinata Crafting Set"){
            s[o].innerText = "皮纳塔制作工具包"
        }else if(q == "Rainbow Tikatika Flower"){
            s[o].innerText = "彩虹蒂卡蒂卡花"
        }else if(q == "Oreha Viewing Stone"){
            s[o].innerText = "奥雷哈水石"
        }else if(q == "Goulding"){
            s[o].innerText = "古尔丁"
        }else if(q == "Levi"){
            s[o].innerText = "维奥莱"
        }else if(q == "Kaldor"){
            s[o].innerText = "卡尔多尔"
        }else if(q == "Book of Survival"){
            s[o].innerText = "生存之书"
        }else if(q == "Broken Dagger"){
            s[o].innerText = "折断的短剑"
        }else if(q == "Desiccated Wooden Statue"){
            s[o].innerText = "干巴巴的木像"
        }else if(q == "Red Moon Tears"){
            s[o].innerText = "红月眼泪"
        }else if(q == "Warm Earmuffs"){
            s[o].innerText = "保暖耳塞"
        }else if(q == "Enya Balm"){
            s[o].innerText = "安雅卡香油"
        }else if(q == "Top Quality Beef Jerky"){
            s[o].innerText = "优质牛肉干"
        }else if(q == "Wolf Fang Necklace"){
            s[o].innerText = "狼牙项链"
        }else if(q == "Myun Hidaka"){
            s[o].innerText = "大汗·希达卡"
        }else if(q == "Danika"){
            s[o].innerText = "达西"
        }else if(q == "Osphere"){
            s[o].innerText = "奥斯皮尔"
        }else if(q == "Sylus"){
            s[o].innerText = "塞拉斯"
        }else if(q == "Baskia"){
            s[o].innerText = "巴斯基亚"
        }else if(q == "Piela"){
            s[o].innerText = "皮埃拉"
        }else if(q == "Hanun"){
            s[o].innerText = "哈农"
        }else if(q == "Arno"){
            s[o].innerText = "阿诺"
        }else if(q == "Wilhelm"){
            s[o].innerText = "威廉姆"
        }else if(q == "Revellos"){
            s[o].innerText = "雷韦洛斯"
        }else if(q == "Rowen Zenlord"){
            s[o].innerText = "洛温森罗德"
        }else if(q == "Anke"){
            s[o].innerText = "安科"
        }else if(q == "Marinna"){
            s[o].innerText = "玛丽亚"
        }else if(q == "Ark of Eternity Kayangel"){
            s[o].innerText = "永恒方舟卡扬格尔"
        }else if(q == "Lauriel"){
            s[o].innerText = "劳里尔"
        }else if(q == "Vairgrys"){
            s[o].innerText = "艾伯格雷斯"
        }else if(q == "Lucky Starflower"){
            s[o].innerText = "吉祥灯花"
        }else if(q == "Light-infused Wine"){
            s[o].innerText = "发光的果酒"
        }else if(q == "Great Celestial Serpent Skin"){
            s[o].innerText = "星座大蛇的皮"
        }else if(q == "Credoff's Glass Magnifier"){
            s[o].innerText = "克里多夫玻璃镜"
        }else if(q == "Cahni"){
            s[o].innerText = "卡尼"
        }else if(q == "Sky Whale"){
            s[o].innerText = "天鲸"
        }else if(q == "Euclid"){
            s[o].innerText = "欧基里德"
        }else if(q == "Great Celestial Serpent"){
            s[o].innerText = "星座大蛇"
        }else if(q == "Kirke"){
            s[o].innerText = "基尔克"
        }else if(q == "Azakiel"){
            s[o].innerText = "阿扎基尔"
        }else if(q == "Belomet"){
            s[o].innerText = "贝洛梅特"
        }else if(q == "Diogenes"){
            s[o].innerText = "迪欧根尼"
        }else if(q == "Prunya"){
            s[o].innerText = "普鲁尼亚"
        }else if(q == "Tienis"){
            s[o].innerText = "蒂恩"
        }else if(q == "Dyna"){
            s[o].innerText = "巨鲸"
        }else if(q == "Balthorr"){
            s[o].innerText = "巴亨图尔"
        }else if(q == "Delain Armen"){
            s[o].innerText = "达伦阿曼"
        }
    }
}),500);