// ==UserScript==
// @name         MHXX Online Web Sim Translate Script
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  Hackishly translate Japanese text on the MHXX.wiki-db armor sim
// @author       Laxaria
// @match        http://mhxx.wiki-db.com/sim/?hl=en*
// @match        http://mhxx.wiki-db.com/sim/show/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372640/MHXX%20Online%20Web%20Sim%20Translate%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/372640/MHXX%20Online%20Web%20Sim%20Translate%20Script.meta.js
// ==/UserScript==

const regexpTranslateDictSuffix = {
    "忍の面": "Shinobi Mask",
    "忍の装束": "Shinobi Suit",
    "忍の篭手": "Shinobi Kote",
    "忍の帯": "Shinobi Belt",
    "忍の足袋": "Shinobi Boots",
    "ユクモノハカマ": "Yukumo Kasa",
    "ユクモノドウギ": "Yukumo Dogi",
    "ユクモノコテ": "Yukumo Kote",
    "ユクモノオビ": "Yukumo Obi",
    "ユクモノハカマ": "Yukumo Hakasa",
    "飛竜ノ覆面": "Hiryu Mask",
    "飛竜ノ装束": "Hiryu Suit",
    "飛竜ノ帯": "Hiryu Belt",
    "飛竜ノ足袋": "Hiryu Boots",
    "飛竜ノ篭手": "Hiryu Kote",
    "フェイス": "Face",
    "スキン": "Skin",
    "フィスト": "Fist",
    "スケイル": "Scale",
    "レグス": "Legs",
    "面隠": "Mask",
    "装束": "Garb",
    "篭手": "Braces",
    "帯": "Belt",
    "足袋": "Tabi",
    "ヘルム": "Helm",
    "アーム": "Arms",
    "メイル": "Mail",
    "フォールド": "Tassets",
    "グリーヴ": "Greaves",
    "キャップ": "Cap",
    "レジスト": "Vest",
    "ガード": "Guards",
    "コート": "Coat",
    "チキル": "Leggings",
    "レギンス": "Leggings",
    "【冠】": "Crown",
    "【衣】": "Robe",
    "【袂】": "Sleeves",
    "【帯】": "Obi",
    "【袴】": "Hakama",
    "コイル": "Coil",
    "【鉢金】": "Crown",
    "【胸当て】": "Chest",
    "【篭手】": "Gauntlets",
    "【腰当て】": "Tassets",
    "【袴】": "Hakama",
    "【面隠】": "Turban",
    "【胴巻】": "Girdle",
    "【手甲】": "Gauntlets",
    "【弾帯】": "Belt",
    "【足袋】": "Espadrilles",
    "【具足】": "Feet",
    "ジャケット": "Jersey",
    "ブーツ": "Metal Boots",
    "ヘッド": "Head",
    "ハイド": "Hide",
    "クロウ": "Claws",
    "スパイン": "Spine",
    "フット": "Feet",
    "アンク": "Glare",
    "ディール": "Cista",
    "ハトゥー": "Grip",
    "アンダ": "Cocoon",
    "ペイル": "Crus",
    "スーラ": "Snarl",
    "バダル": "Vise",
    "マカーン": "Embrace",
    "アドミ": "Wind Wrap",
    "ハディ": "Shank",
    "の髪留め": "Hat",
    "の腕当て": "Braces",
    "のベルト": "Belt",
    "の靴": "Boots",
    "篭手": "Gauntlets",
    "臑当": "Shinguards",
    "のフード": "Hood",
    "のグローブ": "Gloves",
    "のバンド": "Band",
    "のブーツ": "Leggings",
    "ベスト": "Suit",
    "具足": "Feet",
};
const regexpTranslateDictPrefix = {
    "和楽・極": "DUMMY",
    "三葵": "Mitsuaoi",
    "修羅": "Carnage",
    "屍装甲": "Decayed",
    "心滅ノ": "Crusher",
    "曙丸亜流": "Genesis R",
    "曙丸戦流": "Genesis XR",
    "曙丸": "Genesis",
    "活火・極": "DUMMY",
    "艶亜流": "Glyph R",
    "艶戦流": "Glyph XR",
    "艶": "Glyph",
    "蒼天": "Grand Welkin",
    "蒼天戦流": "Grand Welkin XR",
    "大雪主": "Snowbaron",
    "天眼": "Divinesight",
    "宝纏": "Crystalbeard",
    "岩穿": "Drilltusk",
    "朧隠": "Nightcloak",
    "燼滅刃": "Hellblade",
    "白疾風": "Silverwind",
    "矛砕": "Stonefist",
    "紅兜": "Redhelm",
    "紫毒姫": "Dreadqueen",
    "荒鉤爪": "Grimclaw",
    "金雷公": "Thunderlord",
    "銀嶺": "Elderfrost",
    "鎧裂": "Rustrazor",
    "鏖魔": "Bloodbath",
    "隻眼": "Deadeye",
    "青電主": "Boltreaver",
    "黒炎王": "Dreadking",
    "アカムト": "Akantor",
    "アスリスタ": "Astral",
    "ウカムル": "Ukanlos",
    "エスカドラ": "Escadora",
    "カイザー": "Kaiser",
    "クシャナ": "Kushala",
    "グリード": "Esurient",
    "ドラゴン": "Dragon",
    "ネセト": "Neset",
    "ハイリア": "Hylian",
    "ブラキウム": "Brachydium",
    "ミヅハ真【丸帯】": "Grand Mizuha",
    "ミラバル": "Crimson Fatalis",
    "ミラルーツ": "White Fatalis",
    "凛亜流": "Borealis R",
    "凛戦流": "Borealis XR",
    "凛": "Borealis",
    "和歌・極": "DUMMY",
    "怒天ノ": "(Furious Rajang) Grand Divine",
    "暁丸亜流": "Auroros R",
    "暁丸戦流": "Auroros XR",
    "暁丸": "Auroros",
    "烈火・極": "DUMMY",
    "荒天": "Tempest",
    "荒天戦流": "Tempest XR",
    "骸装甲": "Skeletal",
    "黄金騎士": "Garo",
    "Ｇ・ルナ": "G. Rathian",
    "Ｓ・ソル": "S. Los",
    "アグナ": "Agnaktor",
    "アーク": "Arc",
    "ウィズダム": "Wisdom",
    "エース": "Ace",
    "カイゼリン": "Kaiserin",
    "ガムート": "Gammoth",
    "ガーディアン": "Guardian",
    "キリン": "Kirin",
    "クイーン": "Sororal",
    "クロオビ": "Black",
    "グラビド": "Gravios",
    "ケイオス": "Chaos",
    "ゴア": "Gore",
    "シャルマン": "Barmaid's",
    "ジンオウ": "Zinogre",
    "セルタス": "Seltas",
    "セレネ": "Selene",
    "セーリオ": "Bartender's",
    "ゼクス": "Astalos",
    "ダマスク": "Damascus",
    "チアフル": "Cheerful",
    "ディアブロ": "Diablos",
    "ディノ": "Glavenus",
    "ドボル": "Duramboros",
    "ネフィリム": "Nephilim",
    "バルク": "Valstrax",
    "バンギス": "Vangis",
    "フィリア": "Storge",
    "ブラキ": "Brachydios",
    "ブラック": "Black",
    "ヘリオス": "Helios",
    "ヘルパー": "Helper",
    "ベリオ": "Barioth",
    "マスター": "Master's",
    "ミツネ": "Mizutsune",
    "ラギア": "Lagiacrus",
    "リチェルカ": "Researcher's",
    "レウス": "Rathalos",
    "レギオス": "Regios",
    "レックス": "Tigrex",
    "城塞特攻隊": "Citadel",
    "夜叉": "Yaksha",
    "桐花": "Toka",
    "犯人": "Criminal",
    "龍歴士": "Ancient",
    "どんぐり": "Acorn",
    "アシラ": "Arzuros",
    "アロイ": "Alloy",
    "アーティア": "Artian",
    "インゴット": "Ingot",
    "イーオス": "Ioprey",
    "イーオスーツ": "Ioprey",
    "ウルク": "Lagombi",
    "エコール": "Lecturer's",
    "エーデル": "Edel",
    "オウビート": "Obituary",
    "カブラ": "Tetsucabra",
    "ガノス": "Plesioth",
    "ガブラスー": "Remobra",
    "ガブラス": "Remobra",
    "ガブラスーツ": "Remobra",
    "ガララ": "Najarala",
    "ガルルガ": "Garuga",
    "ガレオス": "Cephalos",
    "ガンキン": "Uragaan",
    "ギアノス": "Giaprey",
    "ギアノスーツ": "Giaprey",
    "ギザミ": "Ceanataur",
    "クック": "Kut-Ku",
    "クロムメタル": "Chrome",
    "クンチュウ": "Konchu",
    "グルニャン": "Gourmew",
    "ケチャ": "Kecha",
    "ゲネポスー": "Genprey",
    "ゲネポス": "Genprey",
    "ゲリョス": "Gypceros",
    "コトル": "Uroktor",
    "コンガ": "Conga",
    "ゴン": "DUMMY",
    "サージュ": "Scholarly",
    "ザザミ": "Hermitaur",
    "ザボア": "Zamtrios",
    "ジャギィ": "Jaggi",
    "スカラー": "Scholar's",
    "スカルダ": "Skalda",
    "スキュラ": "Nerscylla",
    "スパイオ": "Spio",
    "ズワロ": "Slagtoth",
    "セイラー": "Sailor",
    "タロス": "Hornetaur",
    "ダークメタル": "Dark Metal",
    "チェーン": "Chainmail",
    "デスギア": "Death",
    "ドロス": "Droth",
    "ドーベル": "Dober",
    "ナルガ": "Nargacuga",
    "ハプル": "Nibelsnarf",
    "ハンター": "Hunter's",
    "ハント": "Hunting",
    "バサル": "Basarios",
    "バトル": "Battle",
    "パティシエ": "Patissier's",
    "パピメル": "Butterfly",
    "ビストロ": "Bistro",
    "ピンクメタル": "Pink",
    "ファルメル": "Rhopessa",
    "ファンゴ": "Bulldrome",
    "フルフル": "Khezu",
    "ブナハ": "Bnahabra",
    "ブランゴ": "Blangonga",
    "ブレイブ": "Derring",
    "ベルダー": "Bherna",
    "ホロロ": "Malfestio",
    "ホーク": "Hawkhat",
    "ボロス": "Barroth",
    "ボーン": "Bone",
    "マカルパ": "Makluva",
    "マギュル": "Mosgharl",
    "マッカォ": "Maccao",
    "マフモフ": "Mafumofu",
    "マリネロ": "Mariner",
    "ムーファ": "Moofah",
    "メイド": "Maiden's",
    "メルホア": "Melahoa",
    "ラングロ": "Volvidon",
    "ランゴ": "Vespoid",
    "ランポス": "Velociprey",
    "ラヴァ": "Lavasioth",
    "リノプロ": "Rhenoplos",
    "ルドロス": "Ludroth",
    "レイア": "Rathian",
    "レザー": "Leather",
    "ロワーガ": "Aelucanth",
    "ヴァイク": "Vaik",
    "撫子・雅": "Dianthus",
    "狗竜の革": "Jaggi",
    "狩人の革": "Trapper",
    "異形": "Strange",
    "跳狗竜の革": "Maccao",
    "Ｋ・ロブスタ": "Lobster",
    "Ｓ・メタル": "Silver Metal",
    "城塞隠密隊": "Deadeye's",
    "活火・覇": "DUMMY",
    "ハイメタ": "High Metal",
    "龍彗のピアス": "Comet Earring",
    "水狐のピアス": "Water Earring",
    "巨氷のピアス": "Ice Earring",
    "雷電のピアス": "Shock Earring",
    "斬炎のピアス": "Flame Earring",
    "青い服": "Hylian Blue Tunic",
    "青い衣": "Hylian Blue Jerkin",
    "・極地": " Land Goku",
    "・極天": " Sky Goku",
    "・地": " Land",
    "・天": " Sky",
    "混沌のヅァン": "Chaos Diadem",
    "混沌のイー": "Chaos Brigandine",
    "混沌のパオ": "Chaoshroom",
    "混沌のカイ": "Chaos Plate",
    "ホクシン": "Kita Star",
    "ココット・アルベロ": "Verdant Kotoko",
    "ベルナ・フィオーレ": "Blooming Bherna",
    "ポッケ・ネーヴェ": "Snowy Pokke",
    "ユクモ・テルメ": "Thermal Yukumo",
    "仙師ノ": "Hermit",
    "スターロード": "Lodestar",
    "切望のピアス": "Desire Earring",
    "プライベート": "French Maid",
    "トヨタマ": "Cham",
    "トヨタマ真": "Grand Cham"

};
const translateDictSkills = {
    "飛行酒場の心": "Flying Pub Soul",
    "お守りマニア": "Pack Rat",
    "軽業師": "Acrobat",
    "食欲": "PowerEater",
    "グルメ": "Alloy Stomach",
    "挑戦者の納刀": "Challenge Sheathe",
    "刃鱗磨き": "Bladescale Hone",
    "痛恨会心": "Bitter Affinity",
    "龍気活性": "Dragonheart",
    "龍識船の心": "Soaratorium Soul",
    "薬草超強化": "Pro Herbology",
    "キープラン": "Endurance Runner",
    "居合術【力】": "Sheath Control",
    "舞闘家": "Fleet Feet",
    "属物強化": "Elementality",
    "増収": "Bounty Hunter",
    "霞皮の護り": "Haze-skin Vest",
    "炎鱗の護り": "Fiery Defense",
    "トラップマスター": "Explosive Trapper",
    "痛打": "Crushing Blow",
    "祝福": "Benediction",
    "暗躍": "Clandestine",
    "真打": "Honed Blade",
    "心剣一体": "Edge Lore",
    "鋼殻の護り": "Steelshell Talisman",
    "護法": "Wellness",
    "虎視眈々": "Chance Seizer",
    "ＳＰ時間延長": "Prolong SP",
    "逆鱗": "Wrath Awoken",
    "鉄壁": "Iron Wall",
    "剛弾": "Silver Bullet",
    "無慈悲": "Ruthlessness",
    "盾使い": "Shield Bearer",
    "真・紅兜の魂": "RedHelm Soul X",
    "真・大雪主の魂": "Snowbaron Soul X",
    "真・矛砕の魂": "Stonefist Soul X",
    "真・岩穿の魂": "Drilltusk Soul X",
    "真・紫毒姫の魂": "D.queen Soul X",
    "真・天眼の魂": "Soulseer Soul X",
    "真・白疾風の魂": "Silverwind Soul X",
    "真・金雷公の魂": "Thunderlord Soul X",
    "真・隻眼の魂": "Deadeye Soul X",
    "真・宝纏の魂": "C.beard Soul X",
    "真・黒炎王の魂": "Dreadking Soul X",
    "真・荒鉤爪の魂": "Grimclaw Soul X",
    "真・燼滅刃の魂": "Hellblade Soul X",
    "真・朧隠の魂": "Nightcloak Soul X",
    "真・鎧裂の魂": "Rustrazor Soul X",
    "真・青電主の魂": "Boltreaver Soul X",
    "真・銀嶺の魂": "Elderfrost Soul X",
    "真・鏖魔の魂": "Bloodbath Soul X",
    "天眼の魂": "Soulseer Soul",
    "朧隠の魂": "Nightcloak Soul",
    "鏖魔の魂": "Bloodbath Soul",
    "鎧裂の魂": "Rustrazor Soul",
    "青電主の魂": "Boltreaver Soul",
    "銀嶺の魂": "Elderfrost Soul",
};

var cachedDict = {};

(function() {
    'use strict';
    window.addEventListener('load', () => {
        console.log(location.pathname);
        if ( location.pathname.match(/show/) ) {
            replaceAll();
        } else {
            addButton('Translate Entries', replaceAll);
            [].forEach.call(document.querySelectorAll('span.borderwhenchecked'), (e) => {
                if (Object.keys(translateDictSkills).includes(e.innerText)) {
                    e.innerText = translateDictSkills[e.innerText];
                };
            });
        };
    });

    let regexpStringPrefix = new RegExp(Object.keys(regexpTranslateDictPrefix).join('|'), 'i');
    let regexpStringSuffix = new RegExp(Object.keys(regexpTranslateDictSuffix).join('|'), 'i');
    let regexpSkill = new RegExp(Object.keys(translateDictSkills).join('|'), 'i');

    function addButton(text, onclick, cssObj) {
        cssObj = {width: '120px', 'font-size': '12px'};
        let button = document.createElement('button'), btnStyle = button.style;
        let docDiv = document.getElementById('resetbutton');
        docDiv.insertAdjacentElement('afterend', button);
        button.innerHTML = text;
        button.onclick = onclick;
        button.style.width = '200px';
        button.style.fontSize = '13px';
        return button;
    };

    function translateText (innerText) {
        if (Object.keys(cachedDict).includes(innerText)) {
            return cachedDict[innerText];
        } else {
            let engString = innerText;
            engString = engString.replace(/GX|EX/g, (match) => {
                return match + " "
            });
            if (engString.match(/・真/g)) {
                engString = engString.replace("・真", "");
                engString = "Grand " + engString;
            };
            engString = engString.replace(regexpSkill, (match) => {
                return translateDictSkills[match];
            });
            engString = engString.replace(regexpStringPrefix, (match) => {
                return regexpTranslateDictPrefix[match] + ' ';
            });
            engString = engString.replace(regexpStringSuffix, (match) => {
                return ' ' + regexpTranslateDictSuffix[match];
            });
            cachedDict[innerText] = engString;
            return engString
        };
    };

    function replaceAll() {
        // let startTime = new Date().getTime();
        let selectors = ['a', '.equipmentitem']
        for (let i = 0; i < selectors.length; i++) {
            console.log(selectors[i]);
            [].forEach.call(document.querySelectorAll(selectors[i]), (e) => {
                e.innerText = translateText(e.innerText);
                console.log("replaced")
            });
        };
        // console.log(cachedDict);
        // let endTime = new Date().getTime();
        // console.log(endTime - startTime);
    };
})();