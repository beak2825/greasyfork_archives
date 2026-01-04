// ==UserScript==
// @name         FFXIV Hunts Path Finder Chinese
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Chinese translation for FFXIV Hunts Path Finder
// @author       asterocclu@gmail.com
// @match        http://www.ffxivhuntspath.com/shb/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393457/FFXIV%20Hunts%20Path%20Finder%20Chinese.user.js
// @updateURL https://update.greasyfork.org/scripts/393457/FFXIV%20Hunts%20Path%20Finder%20Chinese.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isCN = document.cookie && document.cookie.indexOf('glang=zh') > 0;
    if (!isCN) return;

    document.addEventListener('DOMContentLoaded',function(){
        document.querySelectorAll('.mob-items .tag').forEach(function(el) {
            if (MobMap[el.innerText]) {
                el.innerText = MobMap[el.innerText];
            }
        });
        document.querySelectorAll('.nav-pills a').forEach(function(el) {
            var zone = el.childNodes[0].data.trim();
            if (ZoneMap[zone]) {
                el.childNodes[0].data = ZoneMap[zone] + " ";
            }
        });
        var printStepsBak = window.printSteps;
        window.printSteps = function(dataZone) {
            printStepsBak(dataZone);
            var regx = /(.+)\((.+)\)/;
            document.querySelectorAll('.list-group .name-tag').forEach(function(el) {
                if (MobMap[el.innerText]) {
                    el.innerText = MobMap[el.innerText];
                }
            });
            document.querySelectorAll('.mob-result-item b').forEach(function(el) {
                var rest = regx.exec(el.innerText);
                if (rest && rest.length === 3) {
                    var telEN = rest[1].trim();
                    var teleport = TeleportMap[telEN] || telEN;
                    var zone = ZoneMap[rest[2]] || rest[2];
                    el.innerText = teleport + " (" + zone + ")";
                }
            });
        };
    });


    var ZoneMap = {
        "Lakeland": "雷克兰德",
        "Kholusia": "珂露西亚岛",
        "Amh Araeng": "安穆·艾兰",
        "Il Mheg": "伊尔美格",
        "The Rak'tika Greatwood": "拉凯提卡大森林",
        "The Tempest": "黑风海",
    };

    var TeleportMap = {
        "Fort Jobb": "乔布要塞",
        "The Ostall Imperative": "奥斯塔尔严命城",
        "Stilltide": "滞潮村",
        "Wright": "工匠村",
        "Tomra": "图姆拉村",
        "Mord Souq": "鼹灵集市",
        "The Inn At Journey's Head": "上路客店",
        "Twine": "络尾聚落",
        "Lydha Lran": "群花馆",
        "Wolekdorf": "云村",
        "Slitherbough": "蛇行枝",
        "Fanow": "法诺村",
        "The Ondo Cups": "鳍人潮池",
        "The Macarenses Angle": "马克连萨斯广场",
    };

    var MobMap = {
        "Chiliad Cama":"千年卡玛",
        "Coelurosaur":"虚骨龙",
        "Elven Knight":"菁灵骑士",
        "Giant Iguana":"巨型鬣蜥",
        "Gnole":"异豺",
        "Grey Draco":"灰蜥龙",
        "Hoptrap":"阱蛇麻",
        "Irrlicht":"迷光",
        "Lake Anemone":"湖畔风花",
        "Lake Viper":"湖畔蝰蛇",
        "Proterosuchus":"古鳄",
        "Silkmoth":"丝蛾",
        "Smilodon":"斯剑虎",
        "Violet Triffid":"紫罗兰三尖树",
        "Wetland Warg":"湿地座狼",
        "White Gremlin":"白色格雷姆林",
        "Wolverine":"貂熊",
        "Ya-te-veo":"食人花",
        "Zonure":"缠尾蛟",
        "Big Claw":"大螯陆蟹",
        "Calx":"石灰灵",
        "Cliffkite":"壁崖飞鸢",
        "Cliffmole":"壁崖鼹鼠",
        "Defective Talos":"次品塔罗斯",
        "Germinant":"发芽大口花",
        "Gulg Knocker":"格鲁格敲石虫",
        "Gulgnu":"格鲁格角马",
        "Highland Hyssop":"高地海索草",
        "Hobgoblin":"大哥布林",
        "Hobgoblin Guard":"大哥布林守卫",
        "Huldu":"爆岩怪",
        "Ironbeard":"矮人自走人偶",
        "Island Rail":"岛屿秧鸡",
        "Island Wolf":"岛屿黑狼",
        "Kholusian Bison":"珂露西亚野牛",
        "Kholusian Iguana":"珂露西亚鬣蜥",
        "Lowland Hyssop":"低地海索草",
        "Maultasche":"饭袋猩猩",
        "Saichania":"美甲兽",
        "Scree Gnome":"碎石诺姆",
        "Sulfur Byrgen":"硫磺坟灵",
        "Toucalibri":"巨喙蜂鸟",
        "Tragopan":"角雉",
        "Whiptail":"鞭尾跳蜥",
        "Wood Eyes":"林眼树精",
        "Amber Iguana":"琥珀鬣蜥",
        "Ancient Lizard":"古代蜥蜴",
        "Debitage":"废片",
        "Desert Armadillo":"荒漠犰狳",
        "Desert Coyote":"郊狼",
        "Dryspine Gigantender":"干刺巨人掌",
        "Evil Weapon":"恶魔兵装",
        "Flame Zonure":"火焰缠尾蛟",
        "Ghilman":"古拉姆",
        "Gigantender":"巨人掌",
        "Gnome":"诺姆",
        "Harvester":"收割蟹",
        "Long-tailed Armadillo":"长尾犰狳",
        "Masterless Talos":"无主塔罗斯",
        "Megalobat":"大型蝙蝠",
        "Molamander":"摩拉曼达",
        "Ngozi":"恩戈齐",
        "Ovim Billy":"公力山羊",
        "Phorusrhacos":"恐鹤",
        "Sand Mole":"沙鼹鼠",
        "Sandsucker":"噬沙蠕虫",
        "Scissorjaws":"铰颌蚁",
        "Shorttail Sibilus":"短尾蛇蜥蜴",
        "Sibilus":"蛇蜥蜴",
        "Thistle Mole":"棘刺鼹鼠",
        "Tolba":"托儿巴龟",
        "Blood Morpho":"血闪蝶",
        "Echevore":"石莲猬",
        "Etainmoth":"爱蒂恩蛾",
        "Flower Basket":"花束篮筐",
        "Garden Anemone":"庭园风花",
        "Garden Crocota":"庭园犬狮",
        "Garden Porxie":"庭园仙子猪",
        "Green Glider":"绿飘龙",
        "Hawker":"鹰蜓",
        "Killer Bee":"杀人蜂",
        "Moss Fungus":"苔菇",
        "Nu Mou Fungimancer":"恩莫菌菇术士",
        "Nu Mou Potter":"恩莫闲人",
        "Phooka":"普卡精",
        "Psammead":"赛米德",
        "Purple Morpho":"紫闪蝶",
        "Rabbit's Tail":"兔尾",
        "Rainbow Lorikeet":"彩虹鹦鹉",
        "Rosebear":"玫瑰熊",
        "Tot Aevis":"幼体龙鸟",
        "Undine":"温蒂尼",
        "Werewood":"变种树",
        "Witchweed":"独脚金",
        "Atrociraptor":"野蛮盗龙",
        "Blue Deer Doe":"雌蓝鹿",
        "Blue Deer Stag":"雄蓝鹿",
        "Caracal":"狞猫",
        "Cracked Ronkan Doll":"破裂的隆卡人偶",
        "Cracked Ronkan Thorn":"破裂的隆卡石蒺藜",
        "Cracked Ronkan Vessel":"破裂的隆卡器皿",
        "Dart of the Everlasting Dark":"永暗枪术师",
        "Djinn":"镇尼",
        "Doomsayer of the Everlasting Dark":"永暗咒术师",
        "Dreamer of the Everlasting Dark":"永暗梦术师",
        "Floor Mandrill":"地山魈",
        "Forest Echo":"回声",
        "Forest Flamingo":"丛林红鹳",
        "Gizamaluk":"基札玛路克",
        "Greatwood Rail":"大森林秧鸡",
        "Helm Beetle":"盔甲虫",
        "Hoarmite":"霜蛛蝎",
        "Snapweed":"捕捉草",
        "Tarichuk":"塔里丘魔鸟",
        "Tomatl":"酸浆果",
        "Vampire Cup":"吸血草杯",
        "Vampire Vine":"吸血藤树",
        "Wild Swine":"狂野豚猪",
        "Woodbat":"森林蝙蝠",
        "Amphisbaena":"双向海龙",
        "Blue Swimmer":"泳蟹",
        "Clionid":"冰海天使",
        "Cubus":"卡部斯",
        "Dagon":"大衮",
        "Danbania":"刺枪鱼",
        "Hydrozoan":"水螅虫",
        "Mantis Shrimp":"螳螂虾",
        "Mnyiri":"触手鮟",
        "Morgawr":"莫高海怪",
        "Nauplius":"无节幼体",
        "Sea Anemone":"海风花",
        "Sea Gelatin":"海胶螺",
        "Stingray":"刺魟",
        "Tempest Swallow":"黑风海燕",
        "Trilobite":"三叶虫",
        "Urchinfish":"海胆"
};
})();