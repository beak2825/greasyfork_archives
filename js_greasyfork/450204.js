// ==UserScript==
// @name        GuguTown ThemePack Manager
// @name:zh-CN  咕咕镇主题包管理器
// @name:zh-TW  咕咕鎮主題包管理器
// @name:ja     咕咕镇テーマパックマネージャー
// @namespace   https://github.com/HazukiKaguya/GuguTown_ThemePack
// @homepage    https://github.com/HazukiKaguya/GuguTown_ThemePack
// @version     3.10.2
// @description WebGame GuguTown ThemePack Manager.
// @description:zh-CN 气人页游 咕咕镇 主题包管理器。
// @description:zh-TW 氣人頁遊 咕咕鎮 主題包管理器。
// @description:ja オンラインゲーム 咕咕镇 テーマパック マネージャー
// @icon        https://sticker.inari.site/favicon.ico
// @author      Hazuki Kaguya
// @copyright   2022- Hazukikaguya
// @match       https://*.guguzhen.com/*
// @match       https://*.momozhen.com/*
// @run-at      document-end
// @require     https://greasyfork.org/scripts/450822-spine-webgl/code/spine-webgl.js?version=1098282
// @require     https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.js
// @require     https://cdn.jsdelivr.net/npm/lzma@2.3.2/src/lzma_worker.js
// @license     MIT License
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/450204/GuguTown%20ThemePack%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/450204/GuguTown%20ThemePack%20Manager.meta.js
// ==/UserScript==
/* eslint-env jquery */
'use strict';
let unlogfix=document.getElementsByClassName("row").length;
if(window.location.href.indexOf('php') == -1){console.log("This is a static resource."); return;}
else if(unlogfix==0){console.log("Invalid login status or Game Server is currently under maintenance,Themepack Manager Loading stopped.");return;};
/*日间&夜间模式切换*/
console.log(window.matchMedia('(prefers-color-scheme: dark)').matches);
window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
  if (event.matches) {
    /*夜间模式*/
  } else {
    /*日间模式*/
  }
});

/**
 * Settings.
 */
let timeCheck=new Date().getTime();
const defaultConf = {
    "language":"zh",
    "ThemePack":"classic",
    "iconSize":"50px",
    "kanbansize":"100",
    "useOldNames":false,"useThemeName":false,"nightmode":false,
    "showKanban":false,"showCG":false,"voiceO":false,"ver":false,
    "yourcard":"舞"
}
,level=["普通","幸运","稀有","史诗","传奇"]
,Language = {
    "zh": {
        "initUFG":"此自定义主题包立绘功能不可用！",
        "initUVO":"此自定义主题包语音功能不可用！",
        "initUSP":"此自定义主题包Spine看板娘功能不可用！",
        "initUOT":"自定义主题包数据非JSON格式，请及时更新！主题包未启用！",
        "initUNU":"自定义主题包数据不存在，主题包未启用！",
        "cuuid":"生成引继码",
        "vuuid":"输入引继码",
        "puuid":"请复制引继码，或者自行输入8位小写字母+数字后按确定",
        "menuTheme":"主题包",
        "menuUser":"写入自定义主题",
        "menuIcon":"图标大小",
        "menuKanban":"看板大小",
        "menuOldEQ":"旧版装备名",
        "menuThemeEQ":"主题装备名",
        "menuSCG":"立绘功能",
        "menuSVO":"语音功能",
        "menuSKB":"看板功能",
        "themeSW":"按【确定】选择主题包，按【取消】恢复默认主题包。",
        "themeSA":"输入1使用【测试用主题包】；输入2使用【自定义主题包】；\n输入0不启用主题更改；输入其他使用【旧版风格主题包】；\n【测试用主题包】中的主题装备名称版权归Cygames所有。",
        "themeDF":"按【确定】恢复默认主题包，按【取消】则不操作。",
        "iconUA":"请输入图标大小,格式应为32-128间的数字+px\n示例：50px",
        "kanbanUA":"请输入看板大小,数字为百分比。",
        "menuUA":"请输入自定义主题包的json数据,访问以下链接以查看完整的json格式。",
        "cloudPass":"请 输入/设置 云同步密码",
        "dessertlevel":["稀有","史诗","传奇"],
        "dessertname":["星铜苹果护身符","蓝银葡萄护身符","紫晶樱桃护身符"],
        "itemsname":["体能刺激药水","锻造材料箱","灵魂药水","随机装备箱","宝石原石","光环天赋石","苹果核","蓝锻造石","绿锻造石","金锻造石"],
        "equip":["探险者之剑","探险者短弓","探险者短杖","狂信者的荣誉之刃","反叛者的刺杀弓","幽梦匕首","光辉法杖","荆棘盾剑","荆棘剑盾","陨铁重剑","饮血魔剑","饮血长枪","探险者手环","探险者手套","命师的传承手环","秃鹫手环",
                "秃鹫手套","探险者铁甲","探险者皮甲","探险者布甲","旅法师的灵光袍","战线支撑者的荆棘重甲","复苏战衣","复苏木甲","挑战斗篷","探险者耳环","探险者头巾","占星师的耳饰","占星师的发饰","萌爪耳钉","天使缎带","海星戒指","噬魔戒指","彩金长剑","猎魔耳环"]
    },
    "zht":{
        "initUFG":"此自定義主題包立繪功能不可用！",
        "initUVO":"此自定義主題包語音功能不可用！",
        "initUSP":"此自定義主題包Spine看板娘功能不可用！",
        "initUOT":"自定義主題包數據非JSON格式，請及時更新！主題包未啟用！",
        "initUNU":"自定義主題包數據不存在，主題包未啟用！",
        "cuuid":"生成引繼碼",
        "vuuid":"輸入引繼碼",
        "puuid":"請復製引繼碼，或者自行輸入8位小寫字母+數字後按確定",
        "menuTheme":"主題包",
        "menuUser":"寫入自定義主題",
        "menuIcon":"圖標大小",
        "menuKanban":"看板大小",
        "menuOldEQ":"舊的裝備名",
        "menuThemeEQ":"主題裝備名",
        "menuSCG":"立繪機能",
        "menuSVO":"語音機能",
        "menuSKB":"看板機能",
        "themeSW":"按【確定】選擇主題包，按【取消】恢複默認主題包。",
        "themeSA":"輸入1使用【測試用主題包】；輸入2使用【自定義主題包】；\n輸入0不啟用主題更改；輸入其他使用【舊版風格主題包】；\n【測試用主題包】中的主題裝備名稱版權歸Cygames所有。",
        "themeDF":"按【確定】恢複默認主題包，按【取消】則不操作。",
        "iconUA":"請輸入圖標大小,格式應為32-128間的數字+px\n示例：50px",
        "kanbanUA":"請輸入看板大小,數字為百分比。",
        "menuUA":"請輸入自定義主題包的json數據,訪問以下連結以查看完整的json格式。",
        "cloudPass":"請 輸入/设置 云同步密码",
        "dessertlevel":["稀有","史詩","傳奇"],
        "dessertname":["星銅蘋果護身符","藍銀葡萄護身符","紫晶櫻桃護身符"],
        "itemsname":["體能刺激藥水","鍛造材料箱","靈魂藥水","隨機裝備箱","寶石原石","光環天賦石","蘋果核","藍鍛造石","綠鍛造石","金鍛造石"],
        "equip":["探險者之劍","探險者短弓","探險者短杖","狂信者的榮譽之刃","反叛者的刺殺弓","幽夢匕首","光輝法杖","荊棘盾劍","荊棘劍盾","隕鐵重劍","飲血魔劍","飲血長槍","探險者手環","探險者手套","命師的傳承手環","禿鹫手環",
                 "禿鹫手套","探險者鐵甲","探險者皮甲","探險者布甲","旅法師的靈光袍","戰線支撐者的荊棘重甲","複蘇戰衣","複蘇木甲","挑戰鬥篷","探險者耳環","探險者頭巾","占星師的耳飾","占星師的發飾","萌爪耳釘","天使緞帶","海星戒指","噬魔戒指","彩金長劍","猎魔耳環"]
    },
    "ja": {
        "initUFG":"このユーザー テーマパックの立ち絵機能は使用できません！",
        "initUVO":"このユーザー テーマパックのボイス機能は使用できません！",
        "initUSP":"このユーザー テーマパックのSpine看板娘機能は使用できません！",
        "initUOT":"このユーザー テーマパックの形式はJSONではありません！このテーマパックをできるだけ早く更新してください！テーマパックが有効になっていません！",
        "initUNU":"このユーザー テーマパックのDataは存在しません！テーマパックが有効になっていません！",
        "cuuid":"引継号作成",
        "vuuid":"引継号入力",
        "puuid":"引継号をコピーしてください、または、自分で8つの小文字の英字または数字を入力して、[OK]を押します",
        "menuTheme":"テーマパック",
        "menuUser":"テーマ入力",
        "menuIcon":"アイコン大小",
        "menuKanban":"看板大小",
        "menuOldEQ":"旧装備名",
        "menuThemeEQ":"テーマ装備名",
        "menuSCG":"立ち絵",
        "menuSVO":"ボイス",
        "menuSKB":"看板娘",
        "themeSW":"【OK】をクリックしてテーマパックを切り替えます； \n【キャンセル】をクリックするとデフォルトのテーマパックが使用されます。",
        "themeSA":"1 を入力して【テスト テーマパック】を使用；2 を入力して【ユーザー テーマパック】を使用；\n0 を入力して【オリジナル テーマパック】を使用；その他のテキストを入力して【クラシック テーマパック】を使用；\n【テスト テーマパック】テーマ装備名の著作権は cygames に帰属します。",
        "themeDF":"【OK】をクリックして【クラシック テーマパック】を使用します；\nキャンセルする場合は【キャンセル】をクリックしてください。",
        "iconUA":"アイコンのサイズを入力してください。32 ～ 128 の数値で px を使用する必要があります。\n 例： 50px",
        "kanbanUA":"看板のサイズを入力してください。％を除いた数値である必要があります。\n 例： 100",
        "menuUA":"カスタマイズ テーマパックの JSON データを入力してください。完全な JSON 形式を表示するには、以下のリンクにアクセスしてください。",
        "cloudPass":"クラウド同期用のパスワードを入力/設定してください",
        "dessertlevel":["レア","大作","伝説"],
        "dessertname":["星銅林檎お守り","藍銀葡萄お守り","紫水晶桜ん坊お守り"],
        "itemsname":["身体刺激剤","鍛造用材料箱","魂の薬","ランダム装備箱","宝石原石","光輪天賦石","リンゴ核","青鍛造石","緑鍛造石","金鍛造石"],
        "equip":["探検家の剣","探検家の弓","探検家の杖","狂信者の栄光刃","反逆者の暗殺弓","ダークドリーム匕首","輝く杖","いばら盾剣","いばら剣盾","流星鉄のエペの剣","血に飢えた魔剣","血に飢えた槍","探検家の腕輪","探検家の手袋",
                 "命の師匠の継承腕輪","ハゲタカ腕輪","ハゲタカ手袋","探検家の鎧","探検家の革","探検家の衣","旅法師のローブ","フロントサポーターのトゲアーマー","蘇るスーツ","蘇るウッドアーマー","挑戦者のマント",
                 "探検家のイヤリング","探検家のマフラー","占星術師のイヤリング","占星術師の髪飾り","萌え猫爪のイヤリング","天使のリボン","海星指輪","デビル・デバウラー指輪","彩金長剣","猎魔耳環"]
    },
    "en": {
        "initUFG":"The CG Function in this User ThemePack is unavailable!",
        "initUVO":"The Voice Function in this User ThemePack is unavailable!",
        "initUOT":"The Data of this User ThemePack is not JSON! Please Update This ThemePack ASAP! ThemePack not activated!",
        "initUNU":"The Data of this User ThemePack is non-existent! ThemePack not activated!",
        "cuuid":"Create Code",
        "vuuid":"Input Code",
        "puuid":"Please Copy The Code, or self input 8 length [a-z]+[0-9],then press ok",
        "menuTheme":"ThemePack",
        "menuUser":"UserTheme",
        "menuIcon":"IconSize",
        "menuKanban":"KanbanSize",
        "menuOldEQ":"Old EqName",
        "menuThemeEQ":"Theme EqName",
        "menuSCG":"CGimg",
        "menuSVO":"Voice",
        "menuSKB":"Kanban",
        "themeSW":"click【ok】 to switch ThemePack; click【cancel】 to use default ThemePack.",
        "themeSA":"input 1 to use 【Test ThemePack】;\ninput 2 to use【User ThemePack】;\ninput 0 to use 【origin ThemePack】;\ninput any other text to use 【classic ThemePack】;\nThe copyright of ThemeEquipName in 【Test ThemePack】 belongs to cygames.",
        "themeDF":"click【ok】to use 【origin ThemePack】; click【cancel】to cancel.",
        "iconUA":"Please input the size of Icons, it should be a num in 32-128 with px\n example: 50px",
        "kanbanUA":"Please input the size of kanban, it should be a num without %\n example: 100",
        "menuUA":"Please input The JSON data of UserThemePack,\n Access the link below to see the complete JSON format.",
        "cloudPass":"Please input/set cloud sync password",
        "dessertlevel":["Rare   ","Epic   ","Legend "],
        "dessertname":["star copper apple amulet","blue silver grape amulet","amethyst cherry amulet"],
        "itemsname":["Stamina Stimulant Potion","Forge Material Box","Soul potion","Random Equipment Chest","Original Gem Stone","Halo Talent Stone","Fruit Core","Blue Forge Stone","Green Forge Stone","Gold Forge Stone"],
        "equip":["Explorer's Sword","Explorer's Bow","Explorer's Staff","Honor Blade of crazy believer","Rebel's assassination Bow","Faint Dream Dagger","Shining Staff","Thorny shield Sword","Thorny sword Shield","Meteoric iron Epee Sword","Bloodthirsty demon Sword",
                "Bloodthirsty Lance","Explorer's Bracelet","Explorer's Glove","命's Bracelet from her Shifu","Vulture Bracelet","Vulture Glove","Explorer's Armor","Explorer's Leather","Explorer's Cloth","Magician's aura Robe","Thorny Armor of the front supporter",
                "Recovery suit","Revived wood armour","Challenger's Cloak","Explorer's Earrings","Explorer's Scarf","Astrologer's Earrings","Astrologer's hair ornament","Neko Claw Earrings","Angel's Ribbon","Starfish Ring","Devil Devourer Ring","Lottery Gold Sword","Hunt Devil Earrings"]
    }
}
,sampleTheme ={
    "url":"ys/icon/",
    "iurl":"ys/icon/",
    "old":"1","ext":".gif",
    "background":"normal",
    "kanbanbg":"https://sticker.inari.site/api/null.gif",
    "backsize":"background-size:80% 80%;",
    "wqbacksize":"background-size:100% 100%;",
    "nofgimg":false,"nospine":false,"novoice":false,
    "nothemeEqName":false,"nothemeAmName":false,"nothemeItName":false,
	"equip-zh":["探险者之剑","探险者短弓","探险者短杖","狂信者的荣誉之刃","反叛者的刺杀弓","幽梦匕首","光辉法杖","荆棘盾剑","荆棘剑盾","陨铁重剑","饮血魔剑","饮血长枪","探险者手环","探险者手套","命师的传承手环","秃鹫手环",
     "秃鹫手套","探险者铁甲","探险者皮甲","探险者布甲","旅法师的灵光袍","战线支撑者的荆棘重甲","复苏战衣","复苏木甲","挑战斗篷","探险者耳环","探险者头巾","占星师的耳饰","占星师的发饰","萌爪耳钉","天使缎带","海星戒指","噬魔戒指","猎魔耳环"],
	"equip-zht":["探險者之劍","探險者短弓","探險者短杖","狂信者的榮譽之刃","反叛者的刺殺弓","幽夢匕首","光輝法杖","荊棘盾劍","荊棘劍盾","隕鐵重劍","飲血魔劍","飲血長槍","探險者手環","探險者手套","命師的傳承手環","禿鹫手環",
     "禿鹫手套","探險者鐵甲","探險者皮甲","探險者布甲","旅法師的靈光袍","戰線支撐者的荊棘重甲","複蘇戰衣","複蘇木甲","挑戰鬥篷","探險者耳環","探險者頭巾","占星師的耳飾","占星師的發飾","萌爪耳釘","天使緞帶","海星戒指","噬魔戒指","猎魔耳环"],
	"equip-ja":["探検家の剣","探検家の弓","探検家の杖","狂信者の栄光刃","反逆者の暗殺弓","ダークドリーム匕首","輝く杖","いばら盾剣","いばら剣盾","流星鉄のエペの剣","血に飢えた魔剣","血に飢えた槍","探検家の腕輪","探検家の手袋",
    "命の師匠の継承腕輪","ハゲタカ腕輪","ハゲタカ手袋","探検家の鎧","探検家の革","探検家の衣","旅法師のローブ","フロントサポーターのトゲアーマー","蘇るスーツ","蘇るウッドアーマー","挑戦者のマント",
    "探検家のイヤリング","探検家のマフラー","占星術師のイヤリング","占星術師の髪飾り","萌え猫爪のイヤリング","天使のリボン","海星指輪","デビル・デバウラー指輪","猎魔耳飾り"],
	"equip-en":["Explorer's Sword","Explorer's Bow","Explorer's Staff","Honor Blade of crazy believer","Rebel's assassination Bow","Faint Dream Dagger","Shining Staff","Thorny shield Sword","Thorny sword Shield","Meteoric iron Epee Sword","Bloodthirsty demon Sword",
    "Bloodthirsty Lance","Explorer's Bracelet","Explorer's Glove","命's Bracelet from her Shifu","Vulture Bracelet","Vulture Glove","Explorer's Armor","Explorer's Leather","Explorer's Cloth","Magician's aura Robe","Thorny Armor of the front supporter",
    "Recovery suit","Revived wood armour","Challenger's Cloak","Explorer's Earrings","Explorer's Scarf","Astrologer's Earrings","Astrologer's hair ornament","Neko Claw Earrings","Angel's Ribbon","Starfish Ring","Devil Devourer Ring","Heaven Hell Earrings"],
    "dessertlevel-zh":["稀有","史诗","传奇"],
    "dessertlevel-zht":["稀有","史詩","傳奇"],
    "dessertlevel-ja":["レア","大作","伝説"],
    "dessertlevel-en":["Rare   ","Epic   ","Legend "],
    "dessertname-zh":["苹果护身符","葡萄护身符","樱桃护身符"],
    "dessertname-zht":["蘋果護身符","葡萄護身符","櫻桃護身符"],
    "dessertname-ja":["林檎お守り","葡萄お守り","桜ん坊お守り"],
    "dessertname-en":["apple amulet","grape amulet","cherry amulet"],
    "itemsname-zh":["体能刺激药水","锻造材料箱","灵魂药水","随机装备箱","宝石原石","光环天赋石","苹果核","蓝锻造石","绿锻造石","金锻造石"],
    "itemsname-zht":["體能刺激藥水","鍛造材料箱","靈魂藥水","隨機裝備箱","寶石原石","光環天賦石","蘋果核","藍鍛造石","綠鍛造石","金鍛造石"],
    "itemsname-ja":["身体刺激剤","鍛造用材料箱","魂の薬","ランダム装備箱","宝石原石","光輪天賦石","リンゴ核","青鍛造石","緑鍛造石","金鍛造石"],
    "itemsname-en":["Stamina Stimulant Potion","Forge Material Box","Soul potion","Random Equipment Chest","Original Gem Stone","Halo Talent Stone","Fruit Core","Blue Forge Stone","Green Forge Stone","Gold Forge Stone"],
    "dessert":["z/z903","z/z902","z/z901"],
    "items":["i/it001","i/it002","i/it003","i/it004","/i/it005","i/it310","i/it309","i/it301","i/it302","i/it303"],
    "魔灯之灵（野怪":"https://sticker.inari.site/null.gif",
    "六眼飞鱼（野怪":"https://sticker.inari.site/null.gif",
    "铁皮木人（野怪":"https://sticker.inari.site/null.gif",
    "迅捷魔蛛（野怪":"https://sticker.inari.site/null.gif",
    "食铁兽（野怪"  :"https://sticker.inari.site/null.gif",
    "晶刺豪猪（野怪":"https://sticker.inari.site/null.gif",
    "六边形战士（野怪":"https://sticker.inari.site/null.gif",
    "舞":["3000","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif"],
    "默":["3001","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif"],
    "琳":["3002","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif"],
    "艾":["3003","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif"],
    "梦":["3004","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif"],
    "薇":["3005","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif"],
    "伊":["3006","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif"],
    "冥":["3007","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif"],
    "命":["3008","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif"],
    "希":["3009","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif"],
    "霞":["3010","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif","https://sticker.inari.site/null.gif"],
    "voice":["on.mp3","off.mp3"],
    "舞voice":["/vo/",".mp3"],
    "默voice":["/vo/",".mp3"],
    "琳voice":["/vo/",".mp3"],
    "艾voice":["/vo/",".mp3"],
    "梦voice":["/vo/",".mp3"],
    "薇voice":["/vo/",".mp3"],
    "伊voice":["/vo/",".mp3"],
    "冥voice":["/vo/",".mp3"],
    "命voice":["/vo/",".mp3"],
    "希voice":["/vo/",".mp3"],
    "spinert":["https://","https://"],
    "舞spine":{"name":"/unit/wuu/","type":"6","hasRarity6":true,"wi":-330,"hi":-42,"re":0.8},
    "默spine":{"name":"/unit/mo/","type":"7","hasRarity6":true,"wi":-350,"hi":-42,"re":0.8},
    "琳spine":{"name":"/unit/lin/","type":"5","hasRarity6":true,"wi":-330,"hi":-42,"re":0.8},
    "艾spine":{"name":"/unit/ai/","type":"8","hasRarity6":true,"wi":-320,"hi":-64,"re":0.8},
    "梦spine":{"name":"/unit/meng/","type":"4","hasRarity6":false,"wi":-320,"hi":-42,"re":0.8},
    "薇spine":{"name":"/unit/wei/","type":"1","hasRarity6":true,"wi":-360,"hi":-42,"re":0.8},
    "伊spine":{"name":"/unit/yi/","type":"8","hasRarity6":false,"wi":-380,"hi":-92,"re":0.8},
    "冥spine":{"name":"/unit/min/","type":"3","hasRarity6":true,"wi":-350,"hi":-48,"re":0.8},
    "命spine":{"name":"/unit/life/","type":"1","hasRarity6":false,"wi":-360,"hi":-36,"re":1.0},
    "希spine":{"name":"/unit/xii/","type":"10","hasRarity6":false,"wi":-370,"hi":-64,"re":0.8},
    "霞spine":{"name":"/unit/xia/","type":"7","hasRarity6":false,"wi":-370,"hi":-64,"re":0.8},
    "a1":["z2101","z1","探险者之剑","探险者之剑","z/z2101_"],
    "a2":["z2102","z2","探险者短弓","探险者短弓","z/z2102_"],
    "a3":["z2103","z3","探险者短杖","探险者短杖","z/z2103_"],
    "a4":["z2104","z4","狂信者的荣誉之刃","狂信者的荣誉之刃","z/z2104_"],
    "a5":["z2105","z2","反叛者的刺杀弓","反叛者的刺杀弓","z/z2105_"],
    "a6":["z2106","z4","幽梦匕首","幽梦匕首","z/z2106_"],
    "a7":["z2107","z3","光辉法杖","光辉法杖","z/z2107_"],
    "a8":["z2108","z1","荆棘盾剑","荆棘盾剑","z/z2108_"],
    "ao8":["z2108","z1","荆棘剑盾","荆棘剑盾","z/z2108_"],
    "a9":["z2109","z1","陨铁重剑","陨铁重剑","z/z2109_"],
    "a10":["z2110","z2110","饮血魔剑","饮血魔剑","z/z2110_"],
    "ao10":["z2110","z2110","饮血长枪","饮血长枪","z/z2110_"],
    "a11":["z2111","z2111","彩金长剑","彩金长剑","z/z2111_"],
    "w1":["z2201","z5","探险者手环","探险者手环","z/z2201_"],
    "wo1":["z2201","z5","探险者手套","探险者手套","z/z2201_"],
    "w2":["z2202","z8","命师的传承手环","命师的传承手环","z/z2202_"],
    "w3":["z2203","z5","秃鹫手环","秃鹫手环","z/z2203_"],
    "wo3":["z2203","z5","秃鹫手套","秃鹫手套","z/z2203_"],
    "w4":["z2204","z2204","海星戒指","海星戒指","z/z2204_"],
    "w5":["z2205","z2205","噬魔戒指","噬魔戒指","z/z2205_"],
    "c1":["z2301","z9","探险者铁甲","探险者铁甲","z/z2301_"],
    "c2":["z2302","z10","探险者皮甲","探险者皮甲","z/z2302_"],
    "c3":["z2303","z10","探险者布甲","探险者布甲","z/z2303_"],
    "c4":["z2304","z11","旅法师的灵光袍","旅法师的灵光袍","z/z2304_"],
    "c5":["z2305","z9","战线支撑者的荆棘重甲","战线支撑者的荆棘重甲","z/z2305_"],
    "c6":["z2306","z2306","复苏战衣","复苏战衣","z/z2306_"],
    "co6":["z2306","z2306","复苏木甲","复苏木甲","z/z2306_"],
    "c7":["z2307","z2307","挑战斗篷","挑战斗篷","z/z2307_"],
    "h1":["z2401","z7","探险者耳环","探险者耳环","z/z2401_"],
    "ho1":["z2401","z7","探险者头巾","探险者头巾","z/z2401_"],
    "h2":["z2402","z7","占星师的耳饰","占星师的耳饰","z/z2402_"],
    "ho2":["z2402","z7","占星师的发饰","占星师的发饰","z/z2402_"],
    "h3":["z2403","z7","萌爪耳钉","萌爪耳钉","z/z2403_"],
    "ho3":["z2403","z7","天使缎带","天使缎带","z/z2403_"],
    "h4":["z2404","z7","猎魔耳环","猎魔耳环","z/z2404_"]
}
,originTheme = {
    "url":"ys/icon/",
    "iurl":"ys/icon/",
    "old":"1","ext":".gif",
    "background":"normal",
    "kanbanbg":"https://sticker.inari.site/api/null.gif",
    "backsize":"background-size:80% 80%;",
    "wqbacksize":"background-size:100% 100%;",
    "dessert":["z/z903","z/z902","z/z901"],
    "items":["i/it001","i/it002","i/it003","i/it004","/i/it005","i/it310","i/it309","i/it301","i/it302","i/it303"],
    "nothemeAmName":true,"nothemeEqName":true,"nothemeItName":true,
    "nofgimg":true,"novoice":true,"nospine":true,
    "a1":["z2101","z1","探险者之剑","探险者之剑","z/z2101_"],
    "a2":["z2102","z2","探险者短弓","探险者短弓","z/z2102_"],
    "a3":["z2103","z3","探险者短杖","探险者短杖","z/z2103_"],
    "a4":["z2104","z4","狂信者的荣誉之刃","狂信者的荣誉之刃","z/z2104_"],
    "a5":["z2105","z2","反叛者的刺杀弓","反叛者的刺杀弓","z/z2105_"],
    "a6":["z2106","z4","幽梦匕首","幽梦匕首","z/z2106_"],
    "a7":["z2107","z3","光辉法杖","光辉法杖","z/z2107_"],
    "a8":["z2108","z1","荆棘盾剑","荆棘盾剑","z/z2108_"],
    "ao8":["z2108","z1","荆棘剑盾","荆棘剑盾","z/z2108_"],
    "a9":["z2109","z1","陨铁重剑","陨铁重剑","z/z2109_"],
    "a10":["z2110","z2110","饮血魔剑","饮血魔剑","z/z2110_"],
    "ao10":["z2110","z2110","饮血长枪","饮血长枪","z/z2110_"],
    "a11":["z2111","z2111","彩金长剑","彩金长剑","z/z2111_"],
    "w1":["z2201","z5","探险者手环","探险者手环","z/z2201_"],
    "wo1":["z2201","z5","探险者手套","探险者手套","z/z2201_"],
    "w2":["z2202","z8","命师的传承手环","命师的传承手环","z/z2202_"],
    "w3":["z2203","z5","秃鹫手环","秃鹫手环","z/z2203_"],
    "wo3":["z2203","z5","秃鹫手套","秃鹫手套","z/z2203_"],
    "w4":["z2204","z2204","海星戒指","海星戒指","z/z2204_"],
    "w5":["z2205","z2205","噬魔戒指","噬魔戒指","z/z2205_"],
    "c1":["z2301","z9","探险者铁甲","探险者铁甲","z/z2301_"],
    "c2":["z2302","z10","探险者皮甲","探险者皮甲","z/z2302_"],
    "c3":["z2303","z10","探险者布甲","探险者布甲","z/z2303_"],
    "c4":["z2304","z11","旅法师的灵光袍","旅法师的灵光袍","z/z2304_"],
    "c5":["z2305","z9","战线支撑者的荆棘重甲","战线支撑者的荆棘重甲","z/z2305_"],
    "c6":["z2306","z2306","复苏战衣","复苏战衣","z/z2306_"],
    "co6":["z2306","z2306","复苏木甲","复苏木甲","z/z2306_"],
    "c7":["z2307","z2307","挑战斗篷","挑战斗篷","z/z2307_"],
    "h1":["z2401","z7","探险者耳环","探险者耳环","z/z2401_"],
    "ho1":["z2401","z7","探险者头巾","探险者头巾","z/z2401_"],
    "h2":["z2402","z7","占星师的耳饰","占星师的耳饰","z/z2402_"],
    "ho2":["z2402","z7","占星师的发饰","占星师的发饰","z/z2402_"],
    "h3":["z2403","z7","萌爪耳钉","萌爪耳钉","z/z2403_"],
    "ho3":["z2403","z7","天使缎带","天使缎带","z/z2403_"],
    "h4":["z2404","z7","猎魔耳环","猎魔耳环","z/z2404_"]
}
,classicTheme = {
    "url":"https://p.inari.site/guguicons/old/",
    "iurl":"https://p.inari.site/guguicons/old/",
    "old":"", "ext":".gif",
    "background":"overlay",
    "backsize":"background-size:80% 80%;",
    "wqbacksize":"background-size:80% 80%;",
    "nofgimg":true,"novoice":true,"nospine":true,
    "nothemeEqName":true,"nothemeAmName":false,"nothemeItName":true,
    "dessertlevel-zh":["稀有","史诗","传奇"],
    "dessertlevel-zht":["稀有","史詩","傳奇"],
    "dessertlevel-ja":["レア","大作","伝説"],
    "dessertlevel-en":["Rare   ","Epic   ","Legend "],
    "dessertname-zh":["苹果护身符","葡萄护身符","樱桃护身符"],
    "dessertname-zht":["蘋果護身符","葡萄護身符","櫻桃護身符"],
    "dessertname-ja":["林檎お守り","葡萄お守り","桜ん坊お守り"],
    "dessertname-en":["apple amulet","grape amulet","cherry amulet"],
    "dessert":["apple","grape","cherry"],
    "items":["powerdrug","forgebox","soul","eqchest","gem","halo","fruitcore","loforge","miforge","hiforge"],
    "a1":["z2101","z1","探险者之剑","探险者之剑","sword_"],
    "a2":["z2102","z2","探险者短弓","探险者短弓","bow_"],
    "a3":["z2103","z3","探险者短杖","探险者短杖","staff_"],
    "a4":["z2104","z4","狂信者的荣誉之刃","狂信者的荣誉之刃","knife_"],
    "a5":["z2105","z2","反叛者的刺杀弓","反叛者的刺杀弓","bow_"],
    "a6":["z2106","z4","幽梦匕首","幽梦匕首","knife_"],
    "a7":["z2107","z3","光辉法杖","光辉法杖","staff_"],
    "a8":["z2108","z1","荆棘盾剑","荆棘盾剑","sword_"],
    "ao8":["z2108","z1","荆棘剑盾","荆棘剑盾","sword_"],
    "a9":["z2109","z1","陨铁重剑","陨铁重剑","sword_"],
    "a10":["z2110","z2110","饮血魔剑","饮血魔剑","sword_"],
    "ao10":["z2110","z2110","饮血长枪","饮血长枪","spear_"],
    "a11":["z2111","z2111","彩金长剑","彩金长剑","sword_"],
    "w1":["z2201","z5","探险者手环","探险者手环","bracelet_"],
    "wo1":["z2201","z5","探险者手套","探险者手套","gloves_"],
    "w2":["z2202","z8","命师的传承手环","命师的传承手环","bracelet_"],
    "w3":["z2203","z5","秃鹫手环","秃鹫手环","bracelet_"],
    "wo3":["z2203","z5","秃鹫手套","秃鹫手套","gloves_"],
    "w4":["z2204","z2204","海星戒指","海星戒指","bracelet_"],
    "w5":["z2205","z2205","噬魔戒指","噬魔戒指","bracelet_"],
    "c1":["z2301","z9","探险者铁甲","探险者铁甲","armour_"],
    "c2":["z2302","z10","探险者皮甲","探险者皮甲","clothes_"],
    "c3":["z2303","z10","探险者布甲","探险者布甲","clothes_"],
    "c4":["z2304","z11","旅法师的灵光袍","旅法师的灵光袍","gown_"],
    "c5":["z2305","z9","战线支撑者的荆棘重甲","战线支撑者的荆棘重甲","armour_"],
    "c6":["z2306","z2306","复苏战衣","复苏战衣","gown_"],
    "co6":["z2306","z2306","复苏木甲","复苏木甲","gown_"],
    "c7":["z2307","z2307","挑战斗篷","挑战斗篷","clothes_"],
    "h1":["z2401","z7","探险者耳环","探险者耳环","earring_"],
    "ho1":["z2401","z7","探险者头巾","探险者头巾","swirl_"],
    "h2":["z2402","z7","占星师的耳饰","占星师的耳饰","earring_"],
    "ho2":["z2402","z7","占星师的发饰","占星师的发饰","swirl_"],
    "h3":["z2403","z7","萌爪耳钉","萌爪耳钉","neko_"],
    "ho3":["z2403","z7","天使缎带","天使缎带","swirl_"],
    "h4":["z2404","z7","猎魔耳环","猎魔耳环","earring_"]
}
,testTheme = {
    "url":"https://p.inari.site/guguicons/test/eq/",
    "iurl":"https://p.inari.site/guguicons/test/eq/",
    "old":"0",
    "ext":".gif",
    "background":"normal",
    "kanbanbg":"https://sticker.inari.site/api/bg.jpg",
    "backsize":"background-size:100% 100%;",
    "wqbacksize":"background-size:100% 100%;",
    "level":["普通","幸运","稀有","史诗","传奇"],
    "nofgimg":false,"nospine":false,"novoice":false,
    "nothemeEqName":false,"nothemeAmName":false,"nothemeItName":false,
    "equip-zh":["旅人剑","猎人弓","香木法杖","妖刀血鸦","深渊之弓","黑曜石天黑剑","棒棒糖手杖","盖亚之斧","盖亚之斧","勇气星核剑","混沌之刃","毁灭之伤冥神枪","旅者手镯","旅者拳套","睿智手镯","朋克手镯","深红爪","重金属护甲","皮革工作服","旅者长袍",
                "魔导师的长袍","霸王树之棘针铠","翠绿灵衣","翠绿灵衣","黑玛瑙之祈装衣","旅者耳环","旅者头巾","海神耳饰","桜花の月夜簪","精灵王护石","细冰姬的蝴蝶结","永恒绿戒","深结晶变异水晶","辉光剑征服者","狱天耳环"],
    "equip-zht":["旅人劍","獵人弓","檀香之杖","妖刀血鴉","深淵之弓","天黑劍奧比修斯","棒棒糖手杖","蓋亞之斧","蓋亞之斧","星核劍艾爾茲修奈德","渾沌之劍","冥神槍毀滅苦痛","旅者手镯","旅者拳套","睿智手镯","龐克棘刺手環","深紅之爪","重金屬盔甲","皮革工作服",
                 "旅行長袍","魔導師的長袍","霸王樹之棘針鎧","翠綠靈衣","翠綠靈衣","黑瑪瑙祈裝衣","旅者耳環","旅者頭巾","海神耳飾","櫻花月夜簪","精靈王護石","細冰姬的蝴蝶結","常青之綠戒","深結晶變異水晶","輝光劍雅德瑪斯","獄天耳飾"],
    "equip-ja":["旅立ちの剣","狩人の弓","香木の杖","妖刀血鴉","アビスボウ","天黒剣オブシウス","ロリポップステッキ","ガイアアクス","ガイアアクス","星核剣エルツシュナイド","カオスブレード","冥神槍ドゥームペイン","旅立ちのミサンガ","旅立ちのパンチ",
                "ソフォスブレスレット","パンクニードルバングル","クリムゾンクロー","ヘビーメタルアーマー","革のサロペット","旅立ちのローブ","魔導師のローブ","覇王樹の棘針鎧","翠緑の霊衣","翠緑の霊衣","黒瑪瑙の祈装衣","旅立ちの耳環","旅立ちの頭巾",
                "海神の耳飾り","桜花の月夜簪","精霊王の護石","細氷姫の結び紐","常盤の緑環","深結晶ゼノクリスタル","輝光剣アダマス","獄天の耳飾り"],
    "equip-en":["Iron Blade","Hunter's Bow","Fragrant Wood Wand","Blood Raven Demon Blade","Abyss Bow","Heavenly Black Obsidian Sword","Lolipop Stick","Gaia Axe","Gaia Axe","Star Core Sword - Erst Schneide","Chaos Blade","Nether God Spear, Doom Pain",
                "Journey Bracelet","Journey Punches","Sophos Bracelet","Punk Bangle","Crimson Claw","Heavy Metal Armor","Leather Overalls","Journey Robe","Magician's Robe","Thorn of the Great Tree Armor","Viridian Spiritual Dress","Viridian Spiritual Dress",
                "Black Agate Prayer Dress","Journey Earrings","Journey Hood","Ocean God's Earrings","Moonlight Blossom Hairpin","Fairy King's Guardian Stone","Ice Princess Ribbon","Evergreen Ring","Deep Crystalized Xenocrystal","Brilliant Sword - Adamas","Heaven Hell Earrings"],
    "dessert":["apple","grape","melon"],
    "dessertlevel-zh":["普通的","成熟的","优质的"],
    "dessertlevel-zht":["普通的","成熟的","優質的"],
    "dessertlevel-ja":["普通の","熟した","上質な"],
    "dessertlevel-en":["Common   ","Mature   ","Superior "],
    "dessertname-zh":["苹果","葡萄","西瓜"],
    "dessertname-zht":["蘋果","葡萄","西瓜"],
    "dessertname-ja":["林檎","ぶどう","スイカ"],
    "dessertname-en":["Apple","Grape","Watermelon"],
    "items":["powerdrug","forgebox","souldrug","eqchest","gemchest","halostone","fruitcore","loforge","miforge","hiforge"],
    "itemsname-zh":["体力药剂","自选锻造材料","经验药水","随机装备箱","自选概率宝石箱","光环天赋石","玛娜","低级锻造石","中级锻造石","高级锻造石"],
    "itemsname-zht":["體力藥劑","自選鍛造材料","經驗藥水","隨機裝備箱","自選概率寶石箱","光環天賦石","瑪娜","低級鍛造石","中級鍛造石","高級鍛造石"],
    "itemsname-ja":["体力薬剤","自選鍛造材料","経験薬","ランダム装備箱","自選確率宝石箱","光輪の天賦向上","マナ","下級鍛造石","中級鍛造石","上級鍛造石"],
    "itemsname-en":["Stamina Potion","Optional Forging Material","Experience potion","Random Equipment Chest","Optional Probability Gem Chest","Halo Talent Stone","Mana","Primary Forge Stone","Intermediate Forge Stone","Superior Forge Stone"],
    "魔灯之灵（野怪":"https://p.inari.site/guguicons/test/mob/deng.png",
    "六眼飞鱼（野怪":"https://p.inari.site/guguicons/test/mob/fish.png",
    "铁皮木人（野怪":"https://p.inari.site/guguicons/test/mob/mu.png",
    "迅捷魔蛛（野怪":"https://p.inari.site/guguicons/test/mob/zhu.png",
    "食铁兽（野怪"  :"https://p.inari.site/guguicons/test/mob/shou.png",
    "晶刺豪猪（野怪":"https://p.inari.site/guguicons/test/mob/nzhu.png",
    "六边形战士（野怪":"https://p.inari.site/guguicons/test/mob/liu.png",
    "舞":["3000","https://p.inari.site/guguicons/test/cg/wuu/1.png","https://p.inari.site/guguicons/test/cg/wuu/2.png","https://p.inari.site/guguicons/test/cg/wuu/3.png","https://p.inari.site/guguicons/test/cg/wuu/4.png",
         "https://p.inari.site/guguicons/test/cg/wuu/5.png","https://p.inari.site/guguicons/test/cg/wuu/3.png","https://p.inari.site/guguicons/test/cg/wuu/0.png","https://p.inari.site/guguicons/test/cg/wuu/0.png"],
    "默":["3001","https://p.inari.site/guguicons/test/cg/mo/1.png","https://p.inari.site/guguicons/test/cg/mo/2.png","https://p.inari.site/guguicons/test/cg/mo/3.png","https://p.inari.site/guguicons/test/cg/mo/4.png",
         "https://p.inari.site/guguicons/test/cg/mo/5.png","https://p.inari.site/guguicons/test/cg/mo/3.png","https://p.inari.site/guguicons/test/cg/mo/0.png","https://p.inari.site/guguicons/test/cg/mo/0.png"],
    "琳":["3002","https://p.inari.site/guguicons/test/cg/lin/1.png","https://p.inari.site/guguicons/test/cg/lin/2.png","https://p.inari.site/guguicons/test/cg/lin/3.png","https://p.inari.site/guguicons/test/cg/lin/4.png",
         "https://p.inari.site/guguicons/test/cg/lin/5.png","https://p.inari.site/guguicons/test/cg/lin/3.png","https://p.inari.site/guguicons/test/cg/lin/0.png","https://p.inari.site/guguicons/test/cg/lin/0.png"],
    "艾":["3003","https://p.inari.site/guguicons/test/cg/ai/1.png","https://p.inari.site/guguicons/test/cg/ai/2.png","https://p.inari.site/guguicons/test/cg/ai/3.png","https://p.inari.site/guguicons/test/cg/ai/4.png",
         "https://p.inari.site/guguicons/test/cg/ai/5.png","https://p.inari.site/guguicons/test/cg/ai/3.png","https://p.inari.site/guguicons/test/cg/ai/0.png","https://p.inari.site/guguicons/test/cg/ai/0.png"],
    "梦":["3004","https://p.inari.site/guguicons/test/cg/meng/1.png","https://p.inari.site/guguicons/test/cg/meng/2.png","https://p.inari.site/guguicons/test/cg/meng/3.png","https://p.inari.site/guguicons/test/cg/meng/4.png",
         "https://p.inari.site/guguicons/test/cg/meng/5.png","https://p.inari.site/guguicons/test/cg/meng/3.png","https://p.inari.site/guguicons/test/cg/meng/0.png","https://p.inari.site/guguicons/test/cg/meng/0.png"],
    "薇":["3005","https://p.inari.site/guguicons/test/cg/wei/1.png","https://p.inari.site/guguicons/test/cg/wei/2.png","https://p.inari.site/guguicons/test/cg/wei/3.png","https://p.inari.site/guguicons/test/cg/wei/4.png",
         "https://p.inari.site/guguicons/test/cg/wei/5.png","https://p.inari.site/guguicons/test/cg/wei/3.png","https://p.inari.site/guguicons/test/cg/wei/0.png","https://p.inari.site/guguicons/test/cg/wei/0.png"],
    "伊":["3006","https://p.inari.site/guguicons/test/cg/yi/1.png","https://p.inari.site/guguicons/test/cg/yi/2.png","https://p.inari.site/guguicons/test/cg/yi/3.png","https://p.inari.site/guguicons/test/cg/yi/4.png",
         "https://p.inari.site/guguicons/test/cg/yi/5.png","https://p.inari.site/guguicons/test/cg/yi/3.png","https://p.inari.site/guguicons/test/cg/yi/0.png","https://p.inari.site/guguicons/test/cg/yi/0.png"],
    "冥":["3007","https://p.inari.site/guguicons/test/cg/ming/1.png","https://p.inari.site/guguicons/test/cg/ming/2.png","https://p.inari.site/guguicons/test/cg/ming/3.png","https://p.inari.site/guguicons/test/cg/ming/4.png",
         "https://p.inari.site/guguicons/test/cg/ming/5.png","https://p.inari.site/guguicons/test/cg/ming/3.png","https://p.inari.site/guguicons/test/cg/ming/0.png","https://p.inari.site/guguicons/test/cg/ming/0.png"],
    "命":["3008","https://p.inari.site/guguicons/test/cg/life/1.png","https://p.inari.site/guguicons/test/cg/life/2.png","https://p.inari.site/guguicons/test/cg/life/3.png","https://p.inari.site/guguicons/test/cg/life/4.png",
         "https://p.inari.site/guguicons/test/cg/life/5.png","https://p.inari.site/guguicons/test/cg/life/3.png","https://p.inari.site/guguicons/test/cg/life/0.png","https://p.inari.site/guguicons/test/cg/life/0.png"],
    "希":["3009","https://p.inari.site/guguicons/test/cg/xii/1.png","https://p.inari.site/guguicons/test/cg/xii/2.png","https://p.inari.site/guguicons/test/cg/xii/3.png","https://p.inari.site/guguicons/test/cg/xii/4.png",
         "https://p.inari.site/guguicons/test/cg/xii/5.png","https://p.inari.site/guguicons/test/cg/xii/3.png","https://p.inari.site/guguicons/test/cg/xii/0.png","https://p.inari.site/guguicons/test/cg/xii/0.png"],
    "霞":["3010","https://p.inari.site/guguicons/test/cg/xia/1.png","https://p.inari.site/guguicons/test/cg/xia/2.png","https://p.inari.site/guguicons/test/cg/xia/3.png","https://p.inari.site/guguicons/test/cg/xia/4.png",
         "https://p.inari.site/guguicons/test/cg/xia/5.png","https://p.inari.site/guguicons/test/cg/xia/3.png","https://p.inari.site/guguicons/test/cg/xia/0.png","https://p.inari.site/guguicons/test/cg/xia/0.png"],
    "voice":["https://p.inari.site/guguicons/test/vo/on.mp3","https://p.inari.site/guguicons/test/vo/off.mp3"],
    "舞voice":["https://p.inari.site/guguicons/test/vo/wuu/",".mp3"],
    "默voice":["https://p.inari.site/guguicons/test/vo/mo/",".mp3"],
    "琳voice":["https://p.inari.site/guguicons/test/vo/lin/",".mp3"],
    "艾voice":["https://p.inari.site/guguicons/test/vo/ai/",".mp3"],
    "梦voice":["https://p.inari.site/guguicons/test/vo/meng/",".mp3"],
    "薇voice":["https://p.inari.site/guguicons/test/vo/wei/",".mp3"],
    "伊voice":["https://p.inari.site/guguicons/test/vo/yi/",".mp3"],
    "冥voice":["https://p.inari.site/guguicons/test/vo/ming/",".mp3"],
    "命voice":["https://p.inari.site/guguicons/test/vo/life/",".mp3"],
    "希voice":["https://p.inari.site/guguicons/test/vo/xii/",".mp3"],
    "霞voice":["https://p.inari.site/guguicons/test/vo/xia/",".mp3"],
    "spinert":["https://sticker.inari.site/api/common/","https://"],
    "舞spine":{"name":"sticker.inari.site/api/unit/wuu/","type":"6","hasRarity6":true,"wi":-330,"hi":-42,"re":0.8},
    "默spine":{"name":"sticker.inari.site/api/unit/mo/","type":"7","hasRarity6":true,"wi":-350,"hi":-42,"re":0.8},
    "琳spine":{"name":"sticker.inari.site/api/unit/lin/","type":"5","hasRarity6":true,"wi":-330,"hi":-42,"re":0.8},
    "艾spine":{"name":"sticker.inari.site/api/unit/ai/","type":"8","hasRarity6":true,"wi":-320,"hi":-64,"re":0.8},
    "梦spine":{"name":"sticker.inari.site/api/unit/meng/","type":"4","hasRarity6":false,"wi":-320,"hi":-42,"re":0.8},
    "薇spine":{"name":"sticker.inari.site/api/unit/wei/","type":"1","hasRarity6":true,"wi":-360,"hi":-42,"re":0.8},
    "伊spine":{"name":"sticker.inari.site/api/unit/yi/","type":"8","hasRarity6":false,"wi":-380,"hi":-92,"re":0.8},
    "冥spine":{"name":"sticker.inari.site/api/unit/min/","type":"3","hasRarity6":true,"wi":-350,"hi":-48,"re":0.8},
    "命spine":{"name":"sticker.inari.site/api/unit/life/","type":"1","hasRarity6":false,"wi":-360,"hi":-36,"re":1.0},
    "希spine":{"name":"sticker.inari.site/api/unit/xii/","type":"10","hasRarity6":false,"wi":-370,"hi":-64,"re":0.8},
    "霞spine":{"name":"sticker.inari.site/api/unit/xia/","type":"7","hasRarity6":false,"wi":-370,"hi":-64,"re":0.8},
    "a1":["z2101","z1","探险者之剑","旅人剑","探险者之剑/"],
    "a2":["z2102","z2","探险者短弓","猎人弓","探险者短弓/"],
    "a3":["z2103","z3","探险者短杖","香木法杖","探险者短杖/"],
    "a4":["z2104","z4","狂信者的荣誉之刃","妖刀血鸦","狂信者的荣誉之刃/"],
    "a5":["z2105","z2","反叛者的刺杀弓","深渊之弓","反叛者的刺杀弓/"],
    "a6":["z2106","z4","幽梦匕首","黑曜石天黑剑","幽梦匕首/"],
    "a7":["z2107","z3","光辉法杖","棒棒糖手杖","光辉法杖/"],
    "a8":["z2108","z1","荆棘盾剑","盖亚之斧","荆棘盾剑/"],
    "ao8":["z2108","z1","荆棘剑盾","盖亚之斧","荆棘盾剑/"],
    "a9":["z2109","z1","陨铁重剑","勇气星核剑","陨铁重剑/"],
    "a10":["z2110","z2110","饮血魔剑","混沌之刃","饮血魔剑/"],
    "ao10":["z2110","z2110","饮血长枪","毁灭之伤冥神枪","饮血长枪/"],
    "a11":["z2111","z2111","彩金长剑","辉光剑雅德玛斯","彩金长剑/"],
    "w1":["z2201","z5","探险者手环","旅者手镯","探险者手环/"],
    "wo1":["z2201","z5","探险者手套","旅者拳套","探险者手套/"],
    "w2":["z2202","z8","命师的传承手环","睿智手镯","命师的传承手环/"],
    "w3":["z2203","z5","秃鹫手环","朋克手镯","秃鹫手环/"],
    "wo3":["z2203","z5","秃鹫手套","深红爪","秃鹫手套/"],
    "w4":["z2204","z2204","海星戒指","永恒绿戒","海星戒指/"],
    "w5":["z2205","z2205","噬魔戒指","深结晶变异水晶","噬魔戒指/"],
    "c1":["z2301","z9","探险者铁甲","重金属护甲","探险者铁甲/"],
    "c2":["z2302","z10","探险者皮甲","皮革工作服","探险者皮甲/"],
    "c3":["z2303","z10","探险者布甲","旅者长袍","探险者布甲/"],
    "c4":["z2304","z11","旅法师的灵光袍","魔导师的长袍","旅法师的灵光袍/"],
    "c5":["z2305","z9","战线支撑者的荆棘重甲","霸王树之棘针铠","战线支撑者的荆棘重甲/"],
    "c6":["z2306","z2306","复苏战衣","翠绿灵衣","复苏战衣/"],
    "co6":["z2306","z2306","复苏木甲","翠绿灵衣","复苏战衣/"],
    "c7":["z2307","z2307","挑战斗篷","黑玛瑙之祈装衣","挑战斗篷/"],
    "h1":["z2401","z7","探险者耳环","旅者耳环","探险者耳环/"],
    "ho1":["z2401","z7","探险者头巾","旅者头巾","探险者头巾/"],
    "h2":["z2402","z7","占星师的耳饰","海神耳饰","占星师的耳饰/"],
    "ho2":["z2402","z7","占星师的发饰","樱花的月夜簪","占星师的发饰/"],
    "h3":["z2403","z7","萌爪耳钉","精灵王护石","萌爪耳钉/"],
    "ho3":["z2403","z7","天使缎带","细冰姬的蝴蝶结","天使缎带/"],
    "h4":["z2404","z7","猎魔耳环","狱天耳环","猎魔耳环/"]
}
,ygcheck = ["魔灯之灵（野怪","六眼飞鱼（野怪","铁皮木人（野怪","迅捷魔蛛（野怪","食铁兽（野怪","晶刺豪猪（野怪","六边形战士（野怪"]
,nullimg = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
,api='https://api.inari.site/?s=App.User_User.'
,cards=['舞','默','琳','艾','梦','薇','伊','冥','命','希',"霞"];
let ww=window.innerWidth||document.body.clientWidth,wh=window.innerHeight||document.body.clientHeight,momoConf={},
User=$("button[class*='btn btn-lg'][onclick*='fyg_index.php']")[0].innerText,momoUser = "momo_"+User,uuid,nowTheme
,custom,tempca,tpkanban,kanban,kanbanimg,ext='.gif',old,purl,iurl,dessert,items,dessertlevel,dessertname,itemsname,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,w1,w2,w3,w4,w5,c1,c2,c3,c4,c5,c6,c7,h1,h2,h3,h4,spinert,spineJson,tch,yourcard,cardvo,iconsize,equipName,kbw,kbh,shapes
,canvas,gl,shader,batcher,skeletonRenderer,loadingSkeleton,currentSkeletonBuffer,animationState,forceNoLoop,currentTexture,soundonce=0,sucheck=0,facheck=0,battlecheck=0,collecheck=0,pagetype=24,speedFactor=1,tempvo=false,ccard=false,loading = false
,timeout = null,useOldNamesCheck='',useThemeNameCheck='',Multilingual='',tpkanbanHTML='',showCGCheck='',voiceOCheck='',kanbanCheck='',activeSkeleton="",pendingAnimation='',generalAdditionAnimations={},userTheme={},generalBattleSkeletonData={},lang="zh"
,animationQueue=[],currentClass='1',imgmove=[0,0.6],lastFrameTime=Date.now()/1000,bgColor=[0,0,0,0],additionAnimations=['DEAR','NO_WEAPON','POSING','RACE','RUN_JUMP','SMILE'],currentClassAnimData={type:0,data:{}},currentCharaAnimData={id:0,data:{}}
,nowEquip = localStorage.nowEquip || "0",mvp=new spine.webgl.Matrix4();


/**
 * Functions.
 */
/* Core */
function initConf(){
if (localStorage.ThemePackConf) {
    custom = JSON.parse(localStorage.ThemePackConf);
}
else{
    custom =defaultConf; localStorage.setItem('ThemePackConf',JSON.stringify(defaultConf));
};
if (!custom.yourcard ) { custom.yourcard="舞"; update();};
if (!custom.kanbansize){ custom.kanbansize=defaultConf.kanbansize;update();};
if (!custom.language ) { custom.language=defaultConf.language;update();};lang=Language[custom.language];
if (custom.showCG == true) { showCGCheck = 'checked'; };
if (custom.voiceO == true) { voiceOCheck = 'checked'; };
if (custom.useThemeName==true){ useThemeNameCheck='checked';};
if(custom.ThemePack=="classic"){ nowTheme=classicTheme;sessionStorage.setItem('ThemePack', JSON.stringify(nowTheme));}
else if(custom.ThemePack=="test"||custom.ThemePack=="pcr"){ nowTheme=testTheme;sessionStorage.setItem('ThemePack', JSON.stringify(nowTheme));}
else if(custom.ThemePack=="user"){
    if(localStorage.userTheme&&custom.ver!="ver1.0"){ usTheme(localStorage.userTheme,true); }
    else{
        if(localStorage.userTheme&&custom.ver=="ver1.0"){ nowTheme=JSON.parse(localStorage.userTheme); }
        else{ custom.ThemePack="classic"; nowTheme=classicTheme; alert('code:init-004\n'+lang.initUNU); };
        sessionStorage.setItem('ThemePack',JSON.stringify(nowTheme));
    };
}
else{ nowTheme=originTheme; sessionStorage.setItem('ThemePack', JSON.stringify(nowTheme)); };

yourcard=custom.yourcard; cardvo=nowTheme[yourcard+"voice"]; iconsize=custom.iconSize; kanbanimg=nullimg;

if(custom.showKanban==true){ kanbanCheck='checked'; };
Multilingual='checked'; equipName=Language[custom.language].equip;
if(custom.useOldNames&&!custom.useThemeName){
    nowTheme.dessertlevel=classicTheme["dessertlevel-"+custom.language];
    nowTheme.dessertname=classicTheme["dessertname-"+custom.language];
    nowTheme.itemsname=Language[custom.language].itemsname;
}
else if(custom.useThemeName&&!nowTheme.nothemeAmName&&!nowTheme.nothemeItName){
    nowTheme.dessertlevel=nowTheme["dessertlevel-"+custom.language];
    nowTheme.dessertname=nowTheme["dessertname-"+custom.language];
    nowTheme.itemsname=nowTheme["itemsname-"+custom.language];
}
else if(custom.useThemeName&&!nowTheme.nothemeAmName&&nowTheme.nothemeItName){
    nowTheme.dessertlevel=nowTheme["dessertlevel-"+custom.language];
    nowTheme.dessertname=nowTheme["dessertname-"+custom.language];
    nowTheme.itemsname =Language[custom.language].itemsname;
}
else{
    nowTheme.dessertlevel=Language[custom.language].dessertlevel;
    nowTheme.dessertname =Language[custom.language].dessertname;
    nowTheme.itemsname =Language[custom.language].itemsname;
};
if(!nowTheme.nothemeEqName&&custom.useThemeName){ equipName=nowTheme["equip-"+custom.language]; };

nowTheme.a1[3]=equipName[0];nowTheme.a2[3]=equipName[1];nowTheme.a3[3]=equipName[2];nowTheme.a4[3]=equipName[3];nowTheme.a5[3]=equipName[4];nowTheme.a6[3]=equipName[5];
nowTheme.a7[3]=equipName[6];nowTheme.a8[3]=equipName[7];nowTheme.ao8[3]=equipName[8];nowTheme.a9[3]=equipName[9];nowTheme.a10[3]=equipName[10];nowTheme.ao10[3]=equipName[11];
nowTheme.a11[3]=equipName[33];
nowTheme.w1[3]=equipName[12];nowTheme.wo1[3]=equipName[13];nowTheme.w2[3]=equipName[14];nowTheme.w3[3]=equipName[15];nowTheme.wo3[3]=equipName[16];nowTheme.w4[3]=equipName[31];nowTheme.w5[3]=equipName[32];
nowTheme.c1[3]=equipName[17];nowTheme.c2[3]=equipName[18];nowTheme.c3[3]=equipName[19];nowTheme.c4[3]=equipName[20];nowTheme.c5[3]=equipName[21];nowTheme.c6[3]=equipName[22];nowTheme.co6[3]=equipName[23];nowTheme.c7[3]=equipName[24];
nowTheme.h1[3]=equipName[25];nowTheme.ho1[3]=equipName[26];nowTheme.h2[3]=equipName[27];nowTheme.ho2[3]=equipName[28];nowTheme.h3[3]=equipName[29];nowTheme.ho3[3]=equipName[30];nowTheme.h4[3]=equipName[34];
sessionStorage.setItem('ThemePack', JSON.stringify(nowTheme));

ext=nowTheme.ext;purl=nowTheme.url;iurl=nowTheme.iurl;dessert=nowTheme.dessert;items=nowTheme.items;old=nowTheme.old;dessertlevel=nowTheme.dessertlevel;dessertname=nowTheme.dessertname;itemsname=nowTheme.itemsname;
a1=nowTheme.a1;a2=nowTheme.a2;a3=nowTheme.a3;a4=nowTheme.a4;a5=nowTheme.a5;a6=nowTheme.a6;a7=nowTheme.a7;a8=nowTheme.a8;a9=nowTheme.a9;a10=nowTheme.a10;a11=nowTheme.a11;
w1=nowTheme.w1;w2=nowTheme.w2;w3=nowTheme.w3;w4=nowTheme.w4;w5=nowTheme.w5;
c1=nowTheme.c1;c2=nowTheme.c2;c3=nowTheme.c3;c4=nowTheme.c4;c5=nowTheme.c5;c6=nowTheme.c6;c7=nowTheme.c7;
h1=nowTheme.h1;h2=nowTheme.h2;h3=nowTheme.h3;h4=nowTheme.h4;

if(custom.useOldNames==true){ useOldNamesCheck='checked'; a8=nowTheme.ao8;a10=nowTheme.ao10;w1=nowTheme.wo1;w3=nowTheme.wo3;c6=nowTheme.co6;h1=nowTheme.ho1;h2=nowTheme.ho2;h3=nowTheme.ho3; };
nowEquip = localStorage.nowEquip || "0";
if (window.location.href.indexOf('pk.php') > -1||window.location.href.indexOf('equip.php') > -1) { pagetype=nowEquip; };
};
function insertHTML(){
    if($('.themepack-ls').length==0){
    let TheMenuHtml=`<p></p><span><b>${lang.vuuid}:</b> <input type="text" class="themepack-uuid" style="width:65px" value="">
    <input type="button" class="themepack-cuuid" value="${lang.cuuid}">
    <input type="button" class="themepack-ls" value="${lang.menuTheme}">
    <input type="button" class="themepack-usr" value="${lang.menuUser}">
    <input type="button" class="icons-size" value="${lang.menuIcon}">
    <input type="button" class="kanban-size" value="${lang.menuKanban}">
    <input type="checkbox" class="iconpack-switch" ${useOldNamesCheck}><span class="thememenu">${lang.menuOldEQ}</span>
    <input type="checkbox" class="themepack-equip" ${useThemeNameCheck}><span class="thememenu">${lang.menuThemeEQ}</span>
    <input type="checkbox" class="themepack-showCG" ${showCGCheck}><span class="thememenu">${lang.menuSCG}</span>
    <input type="checkbox" class="themepack-voiceO" ${voiceOCheck}><span class="thememenu">${lang.menuSVO}</span>
    <input type="checkbox" class="themepack-showKB" ${kanbanCheck}><span class="thememenu">${lang.menuSKB}</span>
    <input type="button" class="themelang" value="文A">
    <input type="checkbox" class="themepack-switch" ${Multilingual} style="display:none">
    <audio id="themeSoundPlay" controls src="${nullimg}" type="audio/mp3" style="display:none"></audio>
    </span>`;
    if($("button[class*='btn btn-lg'][onclick*='fyg_']").length==7){ $(TheMenuHtml).insertAfter($("button[class*='btn btn-lg'][onclick*='fyg_shop']"));}
    else if($("button[class*='btn btn-lg'][onclick*='fyg_']").length==6) { $(TheMenuHtml).insertAfter($("button[class*='btn btn-lg'][onclick*='fyg_gem']"));}
    else {$(TheMenuHtml).insertBefore($("button[class*='btn btn-lg'][onclick*='fyg_']")[0]);};}
};
function addCSS(){
$('head').append(`<style>
    div[style='width:1200px;margin: 0 auto;'] { width: 80% !important;max-width:1200px;}
    .btn.fyg_mp3 { width: ${Math.floor(parseInt(iconsize))}px !important; height: ${Math.floor(parseInt(iconsize))}px !important;line-height: ${Math.floor(parseInt(iconsize)*3.1/5)-1}px;${nowTheme.backsize}}
    .btn.fyg_tr.fyg_mp3{ width: 263px !important; height: 40px !important;}
    .btn.fyg_tl.fyg_mp3{ width: 263px !important; height: 40px !important;}
    .btn.fyg_tc.fyg_mp3{ width: 536px !important; height: 40px !important;}
    .btn.fyg_colpzbg.fyg_mp3 { width: ${Math.floor(parseInt(iconsize))}px !important; height: ${Math.floor(parseInt(iconsize))}px !important; ${nowTheme.wqbacksize}}
    .img-rounded { width: 50px; height:50px;}
    .btn.fyg_colpzbg.fyg_colpz01.fyg_mp3.fyg_tc,.btn.fyg_colpzbg.fyg_colpz02.fyg_mp3.fyg_tc,.btn.fyg_colpzbg.fyg_colpz03.fyg_mp3.fyg_tc,.btn.fyg_colpzbg.fyg_colpz04.fyg_mp3.fyg_tc,.btn.fyg_colpzbg.fyg_colpz05.fyg_mp3.fyg_tc { width: 60px !important; height: 100px !important;line-height:24px;}
    .smallcardimg {height:50px;width:50px;}
    .tool {position: fixed;top: 0;width: 100%;z-index: 1;cursor: default}
    .themepack-uuid,input[type='button'] { border: 1px solid #e5e5e5;color:#3280fc;display: inline-block; text-align: center; margin: 0px;}
    input[type='button']{ cursor: pointer; }
	.tool>span {white-space: nowrap}
</style>`);
if(nowTheme.spinert){$('head').append(`<style>#divkanban:hover{background:url(${nowTheme.kanbanbg});background-size:cover;}</style>`);};
if(navigator.userAgent.indexOf('Android') > -1||navigator.userAgent.indexOf('Phone') > -1){
    $('head').append(`<style>
    select,body,h4,h5,i,.fyg_f14,h3,button,input,span,.panel-body,.col-sm-8 {font-size:28px !important;}
    h2,.panel-heading,.fyg_f18,.col-sm-2.fyg_lh60{font-size:32px !important;}
    .col-sm-2.fyg_lh60[style='text-align: left;']{width:180px;white-space: pre-wrap;}
    .text-info.fyg_f24.fyg_lh60>span,.text-info.fyg_f24,.col-sm-2.fyg_lh60[style='text-align: left;']>span{font-size:48px !important;}
    .progress{height:24px !important;}
    div[class*='progress-bar']{font-size:26px !important;line-height:24px;}
    p{font-size:26px !important;}
    div[class='btn'],div[class='btn btn-primary'],.with-padding.bg-special.fyg_f14,.icon.icon-diamond{font-size:24px !important;}
    .btn.btn-block.dropdown-toggle.fyg_lh30{font-size:18px !important;}
    button[onclick*='b_forcbs(']{white-space: pre-wrap;}
    .img-rounded,.smallcardimg {height:100px;width:100px;}
    .btn.fyg_mp3{width:${Math.floor(parseInt(iconsize)*2)}px !important;height: ${Math.floor(parseInt(iconsize)*2)}px !important;line-height: ${Math.floor(parseInt(iconsize)*1.2)-1}px;}
    .btn.fyg_colpzbg.fyg_mp3{width:${Math.floor(parseInt(iconsize)*2)}px !important;height: ${Math.floor(parseInt(iconsize)*2)}px !important;}
    .fyg_tc>.btn.fyg_colpzbg.fyg_mp3.fyg_tc{width:120px !important;height: 160px !important;line-height:42px;}
    .btn.btn-primary.btn-group.dropup {height:160px !important;}
</style>`);};
};
function finalInit(){
    initConf(); insertHTML(); addCSS();
    let loadTime=new Date().getTime()-timeCheck;
    console.log("Load Finish! Takes "+loadTime+"ms");
    showKanban();
    if(localStorage.reload=="true"){localStorage.removeItem('reload');update();};
    if(window.location.href.indexOf('fyg_index.php') > -1){console.log("hi"); };
};
function update(){
    localStorage.setItem('ThemePackConf', JSON.stringify(custom));
    beforeCloud("Gupdater");
};

/* Theme Core */
function usTheme(UserJSON,act){
    if(isJSON(UserJSON)){
        let tempTheme=JSON.parse(UserJSON);userTheme = {};
        if(!custom.ver){ update00(); }
        /*
        else if(custom.ver=="ver1.0"){ update10();}
        /*
        else if(custom.ver=="ver1.1"){ update11(); }
        else if(custom.ver=="ver1.2"){ update12(); }
        */
        else{ update00(); };

        function update00(){
            if(tempTheme.url){ userTheme.url=tempTheme.url; }else{ userTheme.url=sampleTheme.url; };
            if(tempTheme.old){ userTheme.old=tempTheme.old; }else{ userTheme.old=sampleTheme.old; };
            if(tempTheme.ext){ userTheme.ext=tempTheme.ext; }else{ userTheme.ext=sampleTheme.ext; };
            if(tempTheme.background){ userTheme.background=tempTheme.background; }else{ userTheme.background=sampleTheme.background; };
            if(tempTheme.kanbanbg){ userTheme.kanbanbg=tempTheme.kanbanbg; }else{ userTheme.kanbanbg=sampleTheme.kanbanbg; };
            if(tempTheme.backsize){ userTheme.backsize=tempTheme.backsize; }else{ userTheme.backsize=sampleTheme.backsize; };
            if(tempTheme.wqbacksize){ userTheme.wqbacksize=tempTheme.wqbacksize; }else{ userTheme.wqbacksize=sampleTheme.wqbacksize; };
            if(tempTheme.iurl&&tempTheme.dessert&&tempTheme.items){
                userTheme.iurl=tempTheme.iurl;userTheme.dessert=tempTheme.dessert;userTheme.items=tempTheme.items;
            }else{
                userTheme.iurl=sampleTheme.iurl;userTheme.dessert=sampleTheme.dessert;userTheme.items=sampleTheme.items;
            };
            if(tempTheme.nothemeAmName){ userTheme.nothemeAmName=true; }else{
                if(tempTheme['dessertlevel-zh']||tempTheme['dessertlevel-zht']||tempTheme['dessertlevel-ja']||tempTheme['dessertlevel-en']||
                   tempTheme['dessertname-zh']||tempTheme['dessertname-zht']||tempTheme['dessertname-ja']||tempTheme['dessertname-en']||
                   tempTheme['itemsname-zh']||tempTheme['itemsname-zht']||tempTheme['itemsname-ja']||tempTheme['itemsname-en']){
                    if(tempTheme['dessertlevel-zh']){ userTheme['dessertlevel-zh']=tempTheme.dessertlevel-zh; }else{ userTheme['dessertlevel-zh']=Language.zh.dessertlevel; };
                    if(tempTheme['dessertlevel-zht']){ userTheme['dessertlevel-zht']=tempTheme['dessertlevel-zht']; }else{ userTheme['dessertlevel-zht']=Language.zht.dessertlevel; };
                    if(tempTheme['dessertlevel-ja']){ userTheme['dessertlevel-ja']=tempTheme['dessertlevel-ja']; }else{ userTheme['dessertlevel-ja']=Language.ja.dessertlevel; };
                    if(tempTheme['dessertlevel-en']){ userTheme['dessertlevel-en']=tempTheme['dessertlevel-en']; }else{ userTheme['dessertlevel-en']=Language.en.dessertlevel; };
                    if(tempTheme['dessertname-zh']){ userTheme['dessertname-zh']=tempTheme['dessertname-zh']; }else{ userTheme['dessertname-zh']=Language.zh.dessertname; };
                    if(tempTheme['dessertname-zht']){ userTheme['dessertname-zht']=tempTheme['dessertname-zht']; }else{ userTheme['dessertname-zht']=Language.zht.dessertname; };
                    if(tempTheme['dessertname-ja']){ userTheme['dessertname-ja']=tempTheme['dessertname-ja']; }else{ userTheme['dessertname-ja']=Language.ja.dessertname; };
                    if(tempTheme['dessertname-en']){ userTheme['dessertname-en']=tempTheme['dessertname-en']; }else{ userTheme['dessertname-en']=Language.en.dessertname; };
                    userTheme.nothemeAmName=false;
                }else{ userTheme.nothemeAmName=true; };
            };
            if(tempTheme.nofgimg){ userTheme.nofgimg=true; alert('code:userTheme-001\n'+lang.initUFG); custom.showCG=false; }else{
                if(tempTheme.舞||tempTheme.默||tempTheme.琳||tempTheme.艾||tempTheme.梦||tempTheme.薇||tempTheme.伊||tempTheme.冥||tempTheme.命||tempTheme.希||tempTheme.霞){
                    if(tempTheme.舞){ userTheme.舞=tempTheme.舞; }else{ userTheme.舞=sampleTheme.舞; };
                    if(tempTheme.默){ userTheme.默=tempTheme.默; }else{ userTheme.默=sampleTheme.默; };
                    if(tempTheme.琳){ userTheme.琳=tempTheme.琳; }else{ userTheme.琳=sampleTheme.琳; };
                    if(tempTheme.艾){ userTheme.艾=tempTheme.艾; }else{ userTheme.艾=sampleTheme.艾; };
                    if(tempTheme.梦){ userTheme.梦=tempTheme.梦; }else{ userTheme.梦=sampleTheme.梦; };
                    if(tempTheme.薇){ userTheme.薇=tempTheme.薇; }else{ userTheme.薇=sampleTheme.薇; };
                    if(tempTheme.伊){ userTheme.伊=tempTheme.伊; }else{ userTheme.伊=sampleTheme.伊; };
                    if(tempTheme.冥){ userTheme.冥=tempTheme.冥; }else{ userTheme.冥=sampleTheme.冥; };
                    if(tempTheme.命){ userTheme.命=tempTheme.命; }else{ userTheme.命=sampleTheme.命; };
                    if(tempTheme.希){ userTheme.希=tempTheme.希; }else{ userTheme.希=sampleTheme.希; };
                    if(tempTheme.霞){ userTheme.霞=tempTheme.霞; }else{ userTheme.霞=sampleTheme.霞; };
                    if(tempTheme['魔灯之灵（野怪']){ userTheme['魔灯之灵（野怪']=tempTheme['魔灯之灵（野怪']; }else{ userTheme['魔灯之灵（野怪']=sampleTheme['魔灯之灵（野怪']; };
                    if(tempTheme['六眼飞鱼（野怪']){ userTheme['六眼飞鱼（野怪']=tempTheme['六眼飞鱼（野怪']; }else{ userTheme['六眼飞鱼（野怪']=sampleTheme['六眼飞鱼（野怪']; };
                    if(tempTheme['铁皮木人（野怪']){ userTheme['铁皮木人（野怪']=tempTheme['铁皮木人（野怪']; }else{ userTheme['铁皮木人（野怪']=sampleTheme['铁皮木人（野怪']; };
                    if(tempTheme['迅捷魔蛛（野怪']){ userTheme['迅捷魔蛛（野怪']=tempTheme['迅捷魔蛛（野怪']; }else{ userTheme['迅捷魔蛛（野怪']=sampleTheme['迅捷魔蛛（野怪']; };
                    if(tempTheme['晶刺豪猪（野怪']){ userTheme['晶刺豪猪（野怪']=tempTheme['晶刺豪猪（野怪']; }else{ userTheme['晶刺豪猪（野怪']=sampleTheme['晶刺豪猪（野怪']; };
                    if(tempTheme['食铁兽（野怪']){ userTheme['食铁兽（野怪']=tempTheme['食铁兽（野怪']; }else{ userTheme['食铁兽（野怪']=sampleTheme['食铁兽（野怪']; };
                    if(tempTheme['六边形战士（野怪']){ userTheme['六边形战士（野怪']=tempTheme['六边形战士（野怪']; }else{ userTheme['六边形战士（野怪']=sampleTheme['六边形战士（野怪']; };
                    userTheme.nofgimg=false;
                }else{ userTheme.nofgimg=true; alert('code:updt-001\n'+lang.initUFG);custom.showKanban=false; };
            };
            if(tempTheme.nospine){ userTheme.nospine=true; alert('code:userTheme-002\n'+lang.initUSP); }else{
                let thespine;thespine=tempTheme.舞spine||tempTheme.默spine||tempTheme.琳spine||tempTheme.艾spine||tempTheme.梦spine||tempTheme.薇spine||tempTheme.伊spine||tempTheme.冥spine||tempTheme.命spine||tempTheme.希spine||false;
                if(tempTheme.spinert&&thespine!=false){
                    if(tempTheme.舞spine){ userTheme.舞spine=tempTheme.舞spine; }else{ userTheme.舞spine=thespine; };
                    if(tempTheme.默spine){ userTheme.默spine=tempTheme.默spine; }else{ userTheme.默spine=thespine; };
                    if(tempTheme.琳spine){ userTheme.琳spine=tempTheme.琳spine; }else{ userTheme.琳spine=thespine; };
                    if(tempTheme.艾spine){ userTheme.艾spine=tempTheme.艾spine; }else{ userTheme.艾spine=thespine; };
                    if(tempTheme.梦spine){ userTheme.梦spine=tempTheme.梦spine; }else{ userTheme.梦spine=thespine; };
                    if(tempTheme.薇spine){ userTheme.薇spine=tempTheme.薇spine; }else{ userTheme.薇spine=thespine; };
                    if(tempTheme.伊spine){ userTheme.伊spine=tempTheme.伊spine; }else{ userTheme.伊spine=thespine; };
                    if(tempTheme.冥spine){ userTheme.冥spine=tempTheme.冥spine; }else{ userTheme.冥spine=thespine; };
                    if(tempTheme.命spine){ userTheme.命spine=tempTheme.命spine; }else{ userTheme.命spine=thespine; };
                    if(tempTheme.希spine){ userTheme.希spine=tempTheme.希spine; }else{ userTheme.希spine=thespine; };
                    if(tempTheme.霞spine){ userTheme.霞spine=tempTheme.霞spine; }else{ userTheme.霞spine=thespine; };
                    userTheme.nospine=false;
                }
                else{ userTheme.nospine=true; alert('code:updt-002\n'+lang.initUSP); };
            };
            if(userTheme.nofgimg&&userTheme.nospine){ custom.showKanban=false; };
            if(tempTheme.novoice){ userTheme.novoice=true; alert('code:userTheme-003\n'+lang.initUVO);custom.voiceO=false; }else{
                let thevoice;thevoice=tempTheme.舞voice||tempTheme.默voice||tempTheme.琳voice||tempTheme.艾voice||tempTheme.梦voice||tempTheme.薇voice||tempTheme.伊voice||tempTheme.冥voice||tempTheme.命voice||tempTheme.希voice||false;
                if(tempTheme.voice&&thevoice!=false){
                    if(tempTheme.舞voice){ userTheme.舞voice=tempTheme.舞voice; }else{ userTheme.舞voice=thevoice; };
                    if(tempTheme.默voice){ userTheme.默voice=tempTheme.默voice; }else{ userTheme.默voice=thevoice; };
                    if(tempTheme.琳voice){ userTheme.琳voice=tempTheme.琳voice; }else{ userTheme.琳voice=thevoice; };
                    if(tempTheme.艾voice){ userTheme.艾voice=tempTheme.艾voice; }else{ userTheme.艾voice=thevoice; };
                    if(tempTheme.梦voice){ userTheme.梦voice=tempTheme.梦voice; }else{ userTheme.梦voice=thevoice; };
                    if(tempTheme.薇voice){ userTheme.薇voice=tempTheme.薇voice; }else{ userTheme.薇voice=thevoice; };
                    if(tempTheme.伊voice){ userTheme.伊voice=tempTheme.伊voice; }else{ userTheme.伊voice=thevoice; };
                    if(tempTheme.冥voice){ userTheme.冥voice=tempTheme.冥voice; }else{ userTheme.冥voice=thevoice; };
                    if(tempTheme.命voice){ userTheme.命voice=tempTheme.命voice; }else{ userTheme.命voice=thevoice; };
                    if(tempTheme.希voice){ userTheme.希voice=tempTheme.希voice; }else{ userTheme.希voice=thevoice; };
                    if(tempTheme.霞voice){ userTheme.霞voice=tempTheme.霞voice; }else{ userTheme.霞voice=thevoice; };
                    userTheme.novoice=false;
                }
                else{ userTheme.novoice=true; }
            };
            if(tempTheme.nothemeEqName){ userTheme.nothemeEqName=true; }else{
                if(tempTheme['equip-zh']||tempTheme['equip-zht']||tempTheme['equip-ja']||tempTheme['equip-en']){
                    if(tempTheme['equip-zh']){ userTheme['equip-zh']=tempTheme['equip-zh']; }else{ userTheme['equip-zh']=Language.zh.equip; };
                    if(tempTheme['equip-zht']){ userTheme['equip-zht']=tempTheme['equip-zht']; }else{ userTheme['equip-zht']=Language.zht.equip; };
                    if(tempTheme['equip-ja']){ userTheme['equip-ja']=tempTheme['equip-ja']; }else{ userTheme['equip-ja']=Language.ja.equip; };
                    if(tempTheme['equip-en']){ userTheme['equip-en']=tempTheme['equip-en']; }else{ userTheme['equip-en']=Language.en.equip; };
                    userTheme.nothemeEqName=false;
                }else{ userTheme.nothemeEqName=true; };
            };
            if(tempTheme.a1){ userTheme.a1=tempTheme.a1; }else{ userTheme.a1=sampleTheme.a1; };
            if(tempTheme.a2){ userTheme.a2=tempTheme.a2; }else{ userTheme.a2=sampleTheme.a2; };
            if(tempTheme.a3){ userTheme.a3=tempTheme.a3; }else{ userTheme.a3=sampleTheme.a3; };
            if(tempTheme.a4){ userTheme.a4=tempTheme.a4; }else{ userTheme.a4=sampleTheme.a4; };
            if(tempTheme.a5){ userTheme.a5=tempTheme.a5; }else{ userTheme.a5=sampleTheme.a5; };
            if(tempTheme.a6){ userTheme.a6=tempTheme.a6; }else{ userTheme.a6=sampleTheme.a6; };
            if(tempTheme.a7){ userTheme.a7=tempTheme.a7; }else{ userTheme.a7=sampleTheme.a7; };
            if(tempTheme.a8){ userTheme.a8=tempTheme.a8; }else{ userTheme.a8=sampleTheme.a8; };
            if(tempTheme.a9){ userTheme.a9=tempTheme.a9; }else{ userTheme.a9=sampleTheme.a9; };
            if(tempTheme.a10){ userTheme.a10=tempTheme.a10; }else{ userTheme.a10=sampleTheme.a10; };
            if(tempTheme.a11){ userTheme.a11=tempTheme.a11; }else{ userTheme.a11=sampleTheme.a11; };
            if(tempTheme.ao8){ userTheme.ao8=tempTheme.ao8; }else{
                if(tempTheme.a8){ userTheme.ao8=tempTheme.a8; }else{ userTheme.ao8=sampleTheme.ao8; };
            };
            if(tempTheme.ao10){ userTheme.a=tempTheme.ao10; }else{
                if(tempTheme.ao10){ userTheme.ao10=tempTheme.a10; }else{ userTheme.ao10=sampleTheme.ao10; };
            };
            if(tempTheme.w1){ userTheme.w1=tempTheme.w1; }else{ userTheme.w1=sampleTheme.w1; };
            if(tempTheme.w2){ userTheme.w2=tempTheme.w2; }else{ userTheme.w2=sampleTheme.w2; };
            if(tempTheme.w3){ userTheme.w3=tempTheme.w3; }else{ userTheme.w3=sampleTheme.w3; };
            if(tempTheme.w4){ userTheme.w4=tempTheme.w4; }else{ userTheme.w4=sampleTheme.w4; };
            if(tempTheme.w5){ userTheme.w5=tempTheme.w5; }else{ userTheme.w5=sampleTheme.w5; };
            if(tempTheme.wo1){ userTheme.wo1=tempTheme.wo1; }else{
                if(tempTheme.w1){ userTheme.wo1=tempTheme.w1; }else{ userTheme.wo1=sampleTheme.wo1; };
            };
            if(tempTheme.wo3){ userTheme.wo3=tempTheme.wo3; }else{
                if(tempTheme.w3){ userTheme.wo3=tempTheme.w3; }else{ userTheme.wo3=sampleTheme.wo3; };
            };
            if(tempTheme.c1){ userTheme.c1=tempTheme.c1; }else{ userTheme.c1=sampleTheme.c1; };
            if(tempTheme.c2){ userTheme.c2=tempTheme.c2; }else{ userTheme.c2=sampleTheme.c2; };
            if(tempTheme.c3){ userTheme.c3=tempTheme.c3; }else{ userTheme.c3=sampleTheme.c3; };
            if(tempTheme.c4){ userTheme.c4=tempTheme.c4; }else{ userTheme.c4=sampleTheme.c4; };
            if(tempTheme.c5){ userTheme.c5=tempTheme.c5; }else{ userTheme.c5=sampleTheme.c5; };
            if(tempTheme.c6){ userTheme.c6=tempTheme.c6; }else{ userTheme.c6=sampleTheme.c6; };
            if(tempTheme.c7){ userTheme.c7=tempTheme.c7; }else{ userTheme.c7=sampleTheme.c7; };
            if(tempTheme.co6){ userTheme.co6=tempTheme.co6; }else{
                if(tempTheme.c6){ userTheme.co6=tempTheme.c6; }else{ userTheme.co6=sampleTheme.co6; };
            };
            if(tempTheme.h1){ userTheme.h1=tempTheme.h1; }else{ userTheme.h1=sampleTheme.h1; };
            if(tempTheme.h2){ userTheme.h2=tempTheme.h2; }else{ userTheme.h2=sampleTheme.h2; };
            if(tempTheme.h3){ userTheme.h3=tempTheme.h3; }else{ userTheme.h3=sampleTheme.h3; };
            if(tempTheme.h4){ userTheme.h4=tempTheme.h4; }else{ userTheme.h4=sampleTheme.h4; };
            if(tempTheme.ho1){ userTheme.ho1=tempTheme.ho1; }else{
                if(tempTheme.h1){ userTheme.ho1=tempTheme.h1; }else{ userTheme.ho1=sampleTheme.ho1; };
            };
            if(tempTheme.ho2){ userTheme.ho2=tempTheme.ho2; }else{
                if(tempTheme.h2){ userTheme.ho2=tempTheme.h2; }else{ userTheme.ho2=sampleTheme.ho2; };
            };
            if(tempTheme.ho3){ userTheme.ho3=tempTheme.ho3; }else{
                if(tempTheme.h3){ userTheme.ho3=tempTheme.h3; }else{ userTheme.ho3=sampleTheme.ho3; };
            };
            userTheme.nothemeItName=true;
            sessionStorage.setItem('userTheme', JSON.stringify(userTheme)); custom.ver="ver1.1"; update();
            if(act){ nowTheme=userTheme; sessionStorage.setItem('ThemePack', JSON.stringify(nowTheme)); };
        };
        function update10(){
            if(tempTheme.nothemeAmName){ userTheme.nothemeAmName=true; }else{
                if(tempTheme['itemsname-zh']||tempTheme['itemsname-zht']||tempTheme['itemsname-ja']||tempTheme['itemsname-en']){
                    if(tempTheme['itemsname-zh']&&tempTheme['itemsname-zh'].length==9){ userTheme['itemsname-zh']=tempTheme['itemsname-zh']; }
                     else if(tempTheme['itemsname-zh']&&tempTheme['itemsname-zh'].length!=9){
                         //userTheme['itemsname-zh']=tempTheme['itemsname-zh'];
                    }else{ userTheme['itemsname-zh']=Language.zh.itemsname; };
                    if(tempTheme['itemsname-zht']&&tempTheme['itemsname-zht'].length==9){ userTheme['itemsname-zht']=tempTheme['itemsname-zht']; }
                    else if(tempTheme['itemsname-zht']&&tempTheme['itemsname-zht'].length!=9){
                        //userTheme['itemsname-zht']=tempTheme['itemsname-zht'];
                    }else{ userTheme['itemsname-zht']=Language.zht.itemsname; };
                    if(tempTheme['itemsname-ja']&&tempTheme['itemsname-ja'].length==9){ userTheme['itemsname-ja']=tempTheme['itemsname-ja']; }
                    else if(tempTheme['itemsname-ja']&&tempTheme['itemsname-ja'].length!=9){
                        //userTheme['itemsname-ja']=tempTheme['itemsname-ja'];
                    }else{ userTheme['itemsname-ja']=Language.ja.itemsname; };
                    if(tempTheme['itemsname-en']&&tempTheme['itemsname-en'].length==9){ userTheme['itemsname-en']=tempTheme['itemsname-en']; }
                    else if(tempTheme['itemsname-en']&&tempTheme['itemsname-en'].length==9){
                        //userTheme['itemsname-en']=tempTheme['itemsname-en'];
                    }else{ userTheme['itemsname-en']=Language.en.itemsname; };
                    userTheme.nothemeAmName=false;
                }else{ userTheme.nothemeAmName=true; };
            };
            if(!tempTheme.nofgimg){
                if(tempTheme.霞){
                    if(tempTheme.霞){ userTheme.霞=tempTheme.霞; }else{ userTheme.霞=sampleTheme.霞; };
                    if(tempTheme['六边形战士（野怪']){ userTheme['六边形战士（野怪']=tempTheme['六边形战士（野怪']; }else{ userTheme['六边形战士（野怪']=sampleTheme['六边形战士（野怪']; };
                };
            };
            if(tempTheme.nospine){ userTheme.nospine=true; alert('code:userTheme-002\n'+lang.initUSP); }else{
                let thespine;thespine=tempTheme.舞spine||tempTheme.默spine||tempTheme.琳spine||tempTheme.艾spine||tempTheme.梦spine||tempTheme.薇spine||tempTheme.伊spine||tempTheme.冥spine||tempTheme.命spine||tempTheme.希spine||false;
                if(tempTheme.spinert&&thespine!=false){
                    if(tempTheme.舞spine){ userTheme.舞spine=tempTheme.舞spine; }else{ userTheme.舞spine=thespine; };
                    if(tempTheme.默spine){ userTheme.默spine=tempTheme.默spine; }else{ userTheme.默spine=thespine; };
                    if(tempTheme.琳spine){ userTheme.琳spine=tempTheme.琳spine; }else{ userTheme.琳spine=thespine; };
                    if(tempTheme.艾spine){ userTheme.艾spine=tempTheme.艾spine; }else{ userTheme.艾spine=thespine; };
                    if(tempTheme.梦spine){ userTheme.梦spine=tempTheme.梦spine; }else{ userTheme.梦spine=thespine; };
                    if(tempTheme.薇spine){ userTheme.薇spine=tempTheme.薇spine; }else{ userTheme.薇spine=thespine; };
                    if(tempTheme.伊spine){ userTheme.伊spine=tempTheme.伊spine; }else{ userTheme.伊spine=thespine; };
                    if(tempTheme.冥spine){ userTheme.冥spine=tempTheme.冥spine; }else{ userTheme.冥spine=thespine; };
                    if(tempTheme.命spine){ userTheme.命spine=tempTheme.命spine; }else{ userTheme.命spine=thespine; };
                    if(tempTheme.希spine){ userTheme.希spine=tempTheme.希spine; }else{ userTheme.希spine=thespine; };
                    if(tempTheme.霞spine){ userTheme.霞spine=tempTheme.霞spine; }else{ userTheme.霞spine=thespine; };
                    userTheme.nospine=false;
                }
                else{ userTheme.nospine=true; alert('code:updt-002\n'+lang.initUSP); };
            };
            if(userTheme.nofgimg&&userTheme.nospine){ custom.showKanban=false; };
            if(tempTheme.novoice){ userTheme.novoice=true; alert('code:userTheme-003\n'+lang.initUVO);custom.voiceO=false; }else{
                let thevoice;thevoice=tempTheme.舞voice||tempTheme.默voice||tempTheme.琳voice||tempTheme.艾voice||tempTheme.梦voice||tempTheme.薇voice||tempTheme.伊voice||tempTheme.冥voice||tempTheme.命voice||tempTheme.希voice||false;
                if(tempTheme.voice&&thevoice!=false){
                    if(tempTheme.舞voice){ userTheme.舞voice=tempTheme.舞voice; }else{ userTheme.舞voice=thevoice; };
                    if(tempTheme.默voice){ userTheme.默voice=tempTheme.默voice; }else{ userTheme.默voice=thevoice; };
                    if(tempTheme.琳voice){ userTheme.琳voice=tempTheme.琳voice; }else{ userTheme.琳voice=thevoice; };
                    if(tempTheme.艾voice){ userTheme.艾voice=tempTheme.艾voice; }else{ userTheme.艾voice=thevoice; };
                    if(tempTheme.梦voice){ userTheme.梦voice=tempTheme.梦voice; }else{ userTheme.梦voice=thevoice; };
                    if(tempTheme.薇voice){ userTheme.薇voice=tempTheme.薇voice; }else{ userTheme.薇voice=thevoice; };
                    if(tempTheme.伊voice){ userTheme.伊voice=tempTheme.伊voice; }else{ userTheme.伊voice=thevoice; };
                    if(tempTheme.冥voice){ userTheme.冥voice=tempTheme.冥voice; }else{ userTheme.冥voice=thevoice; };
                    if(tempTheme.命voice){ userTheme.命voice=tempTheme.命voice; }else{ userTheme.命voice=thevoice; };
                    if(tempTheme.希voice){ userTheme.希voice=tempTheme.希voice; }else{ userTheme.希voice=thevoice; };
                    if(tempTheme.霞voice){ userTheme.霞voice=tempTheme.霞voice; }else{ userTheme.霞voice=thevoice; };
                    userTheme.novoice=false;
                }
                else{ userTheme.novoice=true; }
            };
            if(tempTheme.nothemeEqName){ userTheme.nothemeEqName=true; }else{
                if(tempTheme['equip-zh']||tempTheme['equip-zht']||tempTheme['equip-ja']||tempTheme['equip-en']){
                    if(tempTheme['equip-zh']){ userTheme['equip-zh']=tempTheme['equip-zh']; }else{ userTheme['equip-zh']=Language.zh.equip; };
                    if(tempTheme['equip-zht']){ userTheme['equip-zht']=tempTheme['equip-zht']; }else{ userTheme['equip-zht']=Language.zht.equip; };
                    if(tempTheme['equip-ja']){ userTheme['equip-ja']=tempTheme['equip-ja']; }else{ userTheme['equip-ja']=Language.ja.equip; };
                    if(tempTheme['equip-en']){ userTheme['equip-en']=tempTheme['equip-en']; }else{ userTheme['equip-en']=Language.en.equip; };
                    userTheme.nothemeEqName=false;
                }else{ userTheme.nothemeEqName=true; };
            };
            if(tempTheme.a1){ userTheme.a1=tempTheme.a1; }else{ userTheme.a1=sampleTheme.a1; };
            if(tempTheme.a2){ userTheme.a2=tempTheme.a2; }else{ userTheme.a2=sampleTheme.a2; };
            if(tempTheme.a3){ userTheme.a3=tempTheme.a3; }else{ userTheme.a3=sampleTheme.a3; };
            if(tempTheme.a4){ userTheme.a4=tempTheme.a4; }else{ userTheme.a4=sampleTheme.a4; };
            if(tempTheme.a5){ userTheme.a5=tempTheme.a5; }else{ userTheme.a5=sampleTheme.a5; };
            if(tempTheme.a6){ userTheme.a6=tempTheme.a6; }else{ userTheme.a6=sampleTheme.a6; };
            if(tempTheme.a7){ userTheme.a7=tempTheme.a7; }else{ userTheme.a7=sampleTheme.a7; };
            if(tempTheme.a8){ userTheme.a8=tempTheme.a8; }else{ userTheme.a8=sampleTheme.a8; };
            if(tempTheme.a9){ userTheme.a9=tempTheme.a9; }else{ userTheme.a9=sampleTheme.a9; };
            if(tempTheme.a10){ userTheme.a10=tempTheme.a10; }else{ userTheme.a10=sampleTheme.a10; };
            if(tempTheme.a11){ userTheme.a11=tempTheme.a11; }else{ userTheme.a11=sampleTheme.a11; };
            if(tempTheme.ao8){ userTheme.ao8=tempTheme.ao8; }else{
                if(tempTheme.a8){ userTheme.ao8=tempTheme.a8; }else{ userTheme.ao8=sampleTheme.ao8; };
            };
            if(tempTheme.ao10){ userTheme.a=tempTheme.ao10; }else{
                if(tempTheme.ao10){ userTheme.ao10=tempTheme.a10; }else{ userTheme.ao10=sampleTheme.ao10; };
            };
            if(tempTheme.w1){ userTheme.w1=tempTheme.w1; }else{ userTheme.w1=sampleTheme.w1; };
            if(tempTheme.w2){ userTheme.w2=tempTheme.w2; }else{ userTheme.w2=sampleTheme.w2; };
            if(tempTheme.w3){ userTheme.w3=tempTheme.w3; }else{ userTheme.w3=sampleTheme.w3; };
            if(tempTheme.w4){ userTheme.w4=tempTheme.w4; }else{ userTheme.w4=sampleTheme.w4; };
            if(tempTheme.w5){ userTheme.w5=tempTheme.w5; }else{ userTheme.w5=sampleTheme.w5; };
            if(tempTheme.wo1){ userTheme.wo1=tempTheme.wo1; }else{
                if(tempTheme.w1){ userTheme.wo1=tempTheme.w1; }else{ userTheme.wo1=sampleTheme.wo1; };
            };
            if(tempTheme.wo3){ userTheme.wo3=tempTheme.wo3; }else{
                if(tempTheme.w3){ userTheme.wo3=tempTheme.w3; }else{ userTheme.wo3=sampleTheme.wo3; };
            };
            if(tempTheme.c1){ userTheme.c1=tempTheme.c1; }else{ userTheme.c1=sampleTheme.c1; };
            if(tempTheme.c2){ userTheme.c2=tempTheme.c2; }else{ userTheme.c2=sampleTheme.c2; };
            if(tempTheme.c3){ userTheme.c3=tempTheme.c3; }else{ userTheme.c3=sampleTheme.c3; };
            if(tempTheme.c4){ userTheme.c4=tempTheme.c4; }else{ userTheme.c4=sampleTheme.c4; };
            if(tempTheme.c5){ userTheme.c5=tempTheme.c5; }else{ userTheme.c5=sampleTheme.c5; };
            if(tempTheme.c6){ userTheme.c6=tempTheme.c6; }else{ userTheme.c6=sampleTheme.c6; };
            if(tempTheme.c7){ userTheme.c7=tempTheme.c7; }else{ userTheme.c7=sampleTheme.c7; };
            if(tempTheme.co6){ userTheme.co6=tempTheme.co6; }else{
                if(tempTheme.c6){ userTheme.co6=tempTheme.c6; }else{ userTheme.co6=sampleTheme.co6; };
            };
            if(tempTheme.h1){ userTheme.h1=tempTheme.h1; }else{ userTheme.h1=sampleTheme.h1; };
            if(tempTheme.h2){ userTheme.h2=tempTheme.h2; }else{ userTheme.h2=sampleTheme.h2; };
            if(tempTheme.h3){ userTheme.h3=tempTheme.h3; }else{ userTheme.h3=sampleTheme.h3; };
            if(tempTheme.h4){ userTheme.h4=tempTheme.h4; }else{ userTheme.h4=sampleTheme.h4; };
            if(tempTheme.ho1){ userTheme.ho1=tempTheme.ho1; }else{
                if(tempTheme.h1){ userTheme.ho1=tempTheme.h1; }else{ userTheme.ho1=sampleTheme.ho1; };
            };
            if(tempTheme.ho2){ userTheme.ho2=tempTheme.ho2; }else{
                if(tempTheme.h2){ userTheme.ho2=tempTheme.h2; }else{ userTheme.ho2=sampleTheme.ho2; };
            };
            if(tempTheme.ho3){ userTheme.ho3=tempTheme.ho3; }else{
                if(tempTheme.h3){ userTheme.ho3=tempTheme.h3; }else{ userTheme.ho3=sampleTheme.ho3; };
            };
            sessionStorage.setItem('userTheme', JSON.stringify(userTheme)); custom.ver="ver1.1"; update();
            if(act){ nowTheme=userTheme; sessionStorage.setItem('ThemePack', JSON.stringify(nowTheme)); };
            tempTheme.ver11=""; update11();
        };
        /*
        function update11(){ tempTheme.ver12=""; update12(); };
        function update12(){ tempTheme.ver13=""; sessionStorage.setItem('userTheme', JSON.stringify(tempTheme)); custom.ver="ver1.3"; update();};
        */
    }
    else{ alert('code:init-008\n'+lang.initUOT); };
};
function theEqName(action){
    let eqn=Language.zh.equip,dnn=Language.zh.dessertname,itn=Language.zh.itemsname;
    /*
    let eqn=[],dnn=[];
    if(!action){
        eqn=Language.zh.equip;dnn=Language.zh.dessertname;
    }
    else if(action=="old"){
    }
    else if(action=="new"){
    }
    else if(action=="oldtheme"){
    }
    else if(action=="newtheme"){
    };
    */
    $("button[data-original-title]").attr("data-original-title",function(n,v){
        n= v.replace(new RegExp(eqn[0],'g'),a1[3]).replace(new RegExp(eqn[1],'g'),a2[3]).replace(new RegExp(eqn[2],'g'),a3[3]).replace(new RegExp(eqn[3],'g'),a4[3]).replace(new RegExp(eqn[4],'g'),a5[3])
            .replace(new RegExp(eqn[5],'g'),a6[3]).replace(new RegExp(eqn[6],'g'),a7[3]).replace(new RegExp(eqn[7],'g'),a8[3]).replace(new RegExp(eqn[9],'g'),a9[3]).replace(new RegExp(eqn[10],'g'),a10[3])
            .replace(new RegExp(eqn[33],'g'),a11[3])
            .replace(new RegExp(eqn[12],'g'),w1[3]).replace(new RegExp(eqn[14],'g'),w2[3]).replace(new RegExp(eqn[15],'g'),w3[3]).replace(new RegExp(eqn[31],'g'),w4[3]).replace(new RegExp(eqn[32],'g'),w5[3])
            .replace(new RegExp(eqn[17],'g'),c1[3]).replace(new RegExp(eqn[18],'g'),c2[3]).replace(new RegExp(eqn[19],'g'),c3[3]).replace(new RegExp(eqn[20],'g'),c4[3]).replace(new RegExp(eqn[21],'g'),c5[3])
            .replace(new RegExp(eqn[22],'g'),c6[3]).replace(new RegExp(eqn[24],'g'),c7[3])
            .replace(new RegExp(eqn[25],'g'),h1[3]).replace(new RegExp(eqn[27],'g'),h2[3]).replace(new RegExp(eqn[29],'g'),h3[3]).replace(new RegExp(eqn[34],'g'),h4[3])
            .replace(new RegExp(dnn[2],'g'),dessertname[2]).replace(new RegExp(dnn[1],'g'),dessertname[1]).replace(new RegExp(dnn[0],'g'),dessertname[0])
            .replace(new RegExp(itn[0],'g'),itemsname[0]).replace(new RegExp(itn[1],'g'),itemsname[1]).replace(new RegExp(itn[2],'g'),itemsname[2]).replace(new RegExp(itn[3],'g'),itemsname[3]).replace(new RegExp(itn[4],'g'),itemsname[4])
            .replace(new RegExp(itn[5],'g'),itemsname[5]).replace(new RegExp(itn[6],'g'),itemsname[6]).replace(new RegExp(itn[7],'g'),itemsname[7]).replace(new RegExp(itn[8],'g'),itemsname[8]).replace(new RegExp(itn[9],'g'),itemsname[9]);
        return n;
    });
    $(".modal-body.fyg_f14").html(function(n,v){
        n= v.replace(new RegExp(eqn[0],'g'),a1[3]).replace(new RegExp(eqn[1],'g'),a2[3]).replace(new RegExp(eqn[2],'g'),a3[3]).replace(new RegExp(eqn[3],'g'),a4[3]).replace(new RegExp(eqn[4],'g'),a5[3])
            .replace(new RegExp(eqn[5],'g'),a6[3]).replace(new RegExp(eqn[6],'g'),a7[3]).replace(new RegExp(eqn[7],'g'),a8[3]).replace(new RegExp(eqn[9],'g'),a9[3]).replace(new RegExp(eqn[10],'g'),a10[3])
            .replace(new RegExp(eqn[33],'g'),a11[3])
            .replace(new RegExp(eqn[12],'g'),w1[3]).replace(new RegExp(eqn[14],'g'),w2[3]).replace(new RegExp(eqn[15],'g'),w3[3]).replace(new RegExp(eqn[31],'g'),w4[3]).replace(new RegExp(eqn[32],'g'),w5[3])
            .replace(new RegExp(eqn[17],'g'),c1[3]).replace(new RegExp(eqn[18],'g'),c2[3]).replace(new RegExp(eqn[19],'g'),c3[3]).replace(new RegExp(eqn[20],'g'),c4[3]).replace(new RegExp(eqn[21],'g'),c5[3])
            .replace(new RegExp(eqn[22],'g'),c6[3]).replace(new RegExp(eqn[24],'g'),c7[3])
            .replace(new RegExp(eqn[25],'g'),h1[3]).replace(new RegExp(eqn[27],'g'),h2[3]).replace(new RegExp(eqn[29],'g'),h3[3]).replace(new RegExp(eqn[34],'g'),h4[3]);
        return n;
    });
    $(".with-padding").html(function(n,v){
        n= v.replace(new RegExp(eqn[0],'g'),a1[3]).replace(new RegExp(eqn[1],'g'),a2[3]).replace(new RegExp(eqn[2],'g'),a3[3]).replace(new RegExp(eqn[3],'g'),a4[3]).replace(new RegExp(eqn[4],'g'),a5[3])
            .replace(new RegExp(eqn[5],'g'),a6[3]).replace(new RegExp(eqn[6],'g'),a7[3]).replace(new RegExp(eqn[7],'g'),a8[3]).replace(new RegExp(eqn[9],'g'),a9[3]).replace(new RegExp(eqn[10],'g'),a10[3])
            .replace(new RegExp(eqn[33],'g'),a11[3])
            .replace(new RegExp(eqn[12],'g'),w1[3]).replace(new RegExp(eqn[14],'g'),w2[3]).replace(new RegExp(eqn[15],'g'),w3[3]).replace(new RegExp(eqn[31],'g'),w4[3]).replace(new RegExp(eqn[32],'g'),w5[3])
            .replace(new RegExp(eqn[17],'g'),c1[3]).replace(new RegExp(eqn[18],'g'),c2[3]).replace(new RegExp(eqn[19],'g'),c3[3]).replace(new RegExp(eqn[20],'g'),c4[3]).replace(new RegExp(eqn[21],'g'),c5[3])
            .replace(new RegExp(eqn[22],'g'),c6[3]).replace(new RegExp(eqn[24],'g'),c7[3])
            .replace(new RegExp(eqn[25],'g'),h1[3]).replace(new RegExp(eqn[27],'g'),h2[3]).replace(new RegExp(eqn[29],'g'),h3[3]).replace(new RegExp(eqn[34],'g'),h4[3])
            .replace(new RegExp(dnn[2],'g'),dessertname[2]).replace(new RegExp(dnn[1],'g'),dessertname[1]).replace(new RegExp(dnn[0],'g'),dessertname[0])
            .replace(new RegExp(itn[0],'g'),itemsname[0]).replace(new RegExp(itn[1],'g'),itemsname[1]).replace(new RegExp(itn[2],'g'),itemsname[2]).replace(new RegExp(itn[3],'g'),itemsname[3]).replace(new RegExp(itn[4],'g'),itemsname[4])
            .replace(new RegExp(itn[5],'g'),itemsname[5]).replace(new RegExp(itn[6],'g'),itemsname[6]).replace(new RegExp(itn[7],'g'),itemsname[7]).replace(new RegExp(itn[8],'g'),itemsname[8]).replace(new RegExp(itn[9],'g'),itemsname[9]);
        return n;
    });
};
function themeIcon(){
    $("button[style*='ys/icon/z']").attr("style",function(n,v){
        n= v;
        if(nowTheme.background=="overlay"){
            if(v.indexOf('_1')>-1)n=n.replace(/und-im/g,`und-blend-mode:overlay;background-color:#C0C0C0;background-im`).replace(/_1./g,'_.');
            if(v.indexOf('_2')>-1)n=n.replace(/und-im/g,`und-blend-mode:overlay;background-color:#03B7CD;background-im`).replace(/_2./g,'_.');
            if(v.indexOf('_3')>-1)n=n.replace(/und-im/g,`und-blend-mode:overlay;background-color:#38B03F;background-im`).replace(/_3./g,'_.');
            if(v.indexOf('_4')>-1)n=n.replace(/und-im/g,`und-blend-mode:overlay;background-color:#F1A325;background-im`).replace(/_4./g,'_.');
            if(v.indexOf('_5')>-1)n=n.replace(/und-im/g,`und-blend-mode:overlay;background-color:#EA644A;background-im`).replace(/_5./g,'_.');
        };
        if(ext!=".gif")n=n.replace(/.gif/g,ext);
        return n;
    });
    $("button[data-original-title*='稀有']").attr("data-original-title",function(n,v){ n= v.replace(/稀有/g, dessertlevel[0]);return n; })
        .attr("style",function(n,v){ n=v.replace(/background-image/g,`background-blend-mode: ${nowTheme.background};background-color:#38B03F;background-image`);return n; });
    $("button[data-original-title*='史诗']").attr("data-original-title",function(n,v){ n= v.replace(/史诗/g, dessertlevel[1]);return n; })
        .attr("style",function(n,v){ n=v.replace(/background-image/g,`background-blend-mode: ${nowTheme.background};background-color:#F1A325;background-image`);return n; });
    $("button[data-original-title*='传奇']").attr("data-original-title",function(n,v){ n= v.replace(/传奇/g, dessertlevel[2]);return n; })
        .attr("style",function(n,v){ n=v.replace(/background-image/g,`background-blend-mode: ${nowTheme.background};background-color:#EA644A;background-image`);return n;});

    $("button[style*='ys/icon/z/z21']").attr("style",function(n,v){
        n= v.replace(/ys\/icon\/z\/z2101_/g, purl+a1[4]).replace(/ys\/icon\/z\/z2102_/g, purl+a2[4]).replace(/ys\/icon\/z\/z2103_/g, purl+a3[4]).replace(/ys\/icon\/z\/z2104_/g, purl+a4[4])
            .replace(/ys\/icon\/z\/z2105_/g, purl+a5[4]).replace(/ys\/icon\/z\/z2106_/g, purl+a6[4]).replace(/ys\/icon\/z\/z2107_/g, purl+a7[4]).replace(/ys\/icon\/z\/z2108_/g, purl+a8[4])
            .replace(/ys\/icon\/z\/z2109_/g, purl+a9[4]).replace(/ys\/icon\/z\/z2110_/g,purl+a10[4]).replace(/ys\/icon\/z\/z2111_/g,purl+a11[4]);
        return n;
    });
    $("button[style*='ys/icon/z/z22']").attr("style",function(n,v){
        n= v.replace(/ys\/icon\/z\/z2201_/g, purl+w1[4]).replace(/ys\/icon\/z\/z2202_/g, purl+w2[4]).replace(/ys\/icon\/z\/z2203_/g, purl+w3[4]).replace(/ys\/icon\/z\/z2204_/g, purl+w4[4])
            .replace(/ys\/icon\/z\/z2205_/g, purl+w5[4]);
        return n;
    });
    $("button[style*='ys/icon/z/z23']").attr("style",function(n,v){
        n= v.replace(/ys\/icon\/z\/z2301_/g, purl+c1[4]).replace(/ys\/icon\/z\/z2302_/g, purl+c2[4]).replace(/ys\/icon\/z\/z2303_/g, purl+c3[4]).replace(/ys\/icon\/z\/z2304_/g, purl+c4[4])
            .replace(/ys\/icon\/z\/z2305_/g, purl+c5[4]).replace(/ys\/icon\/z\/z2306_/g, purl+c6[4]).replace(/ys\/icon\/z\/z2307_/g, purl+c7[4]);
        return n;
    });
    $("button[style*='ys/icon/z/z24']").attr("style",function(n,v){
        n= v.replace(/ys\/icon\/z\/z2401_/g, purl+h1[4]).replace(/ys\/icon\/z\/z2402_/g, purl+h2[4]).replace(/ys\/icon\/z\/z2403_/g, purl+h3[4]).replace(/ys\/icon\/z\/z2404_/g, purl+h4[4]);
        return n;
    });
    $("button[style*='ys/icon/z/z9']").attr("style",function(n,v){
        n= v.replace(/ys\/icon\/z\/z901/g, iurl+dessert[2]).replace(/ys\/icon\/z\/z902/g, iurl+dessert[1]).replace(/ys\/icon\/z\/z903/g, iurl+dessert[0]);
        return n;
    });
    $("button[style*='ys/icon/i/it']").attr("style",function(n,v){
        n= v.replace(/ys\/icon\/i\/it001/g, iurl+items[0]).replace(/ys\/icon\/i\/it002/g, iurl+items[1]).replace(/ys\/icon\/i\/it003/g, iurl+items[2]).replace(/ys\/icon\/i\/it004/g, iurl+items[3]).replace(/ys\/icon\/i\/it005/g, iurl+items[4])
        .replace(/ys\/icon\/i\/it310/g, iurl+items[5]).replace(/ys\/icon\/i\/it309/g, iurl+items[6]).replace(/ys\/icon\/i\/it301/g, iurl+items[7]).replace(/ys\/icon\/i\/it302/g, iurl+items[8]).replace(/ys\/icon\/i\/it303/g, iurl+items[9]);
        return n;
    });

    $(".fyg_tc>img[src*='ys/icon/z/z21']").attr("src",function(n,v){
        if(v.indexOf('01')>-1)nowEquip=4;if(v.indexOf('02')>-1)nowEquip=8;if(v.indexOf('03')>-1)nowEquip=7;if(v.indexOf('04')>-1)nowEquip=2;if(v.indexOf('08')>-1)nowEquip=4;
        if(v.indexOf('06')>-1)nowEquip=9;if(v.indexOf('07')>-1)nowEquip=7;if(v.indexOf('08')>-1)nowEquip=3;if(v.indexOf('09')>-1)nowEquip=5;
        if(v.indexOf('10')>-1)custom.useOldNames?nowEquip=6:nowEquip=10;
        n= v.replace(/ys\/icon\/z\/z2101_/g, purl+a1[4]).replace(/ys\/icon\/z\/z2102_/g, purl+a2[4]).replace(/ys\/icon\/z\/z2103_/g, purl+a3[4]).replace(/ys\/icon\/z\/z2104_/g, purl+a4[4])
            .replace(/ys\/icon\/z\/z2105_/g, purl+a5[4]).replace(/ys\/icon\/z\/z2106_/g, purl+a6[4]).replace(/ys\/icon\/z\/z2107_/g, purl+a7[4]).replace(/ys\/icon\/z\/z2108_/g, purl+a8[4])
            .replace(/ys\/icon\/z\/z2109_/g, purl+a9[4]).replace(/ys\/icon\/z\/z2110_/g, purl+a10[4]).replace(/ys\/icon\/z\/z2111_/g,purl+a11[4]);
        loading = false; pagetype=nowEquip;
        return n;
    });
    $(".fyg_tc>img[src*='ys/icon/z/z22']").attr("src",function(n,v){
        if(v.indexOf('01')>-1||v.indexOf('03')>-1){
            if(custom.useOldNames){
                loading=false; nowEquip=1; pagetype=nowEquip;
            };
        };
        n= v.replace(/ys\/icon\/z\/z2201_/g, purl+w1[4]).replace(/ys\/icon\/z\/z2202_/g, purl+w2[4]).replace(/ys\/icon\/z\/z2203_/g, purl+w3[4]).replace(/ys\/icon\/z\/z2204_/g, purl+w4[4])
            .replace(/ys\/icon\/z\/z2205_/g, purl+w5[4]);
        return n;
    });
    $(".fyg_tc>img[src*='ys/icon/z/z23']").attr("src",function(n,v){
        n= v.replace(/ys\/icon\/z\/z2301_/g, purl+c1[4]).replace(/ys\/icon\/z\/z2302_/g, purl+c2[4]).replace(/ys\/icon\/z\/z2303_/g, purl+c3[4]).replace(/ys\/icon\/z\/z2304_/g, purl+c4[4])
        .replace(/ys\/icon\/z\/z2305_/g, purl+c5[4]).replace(/ys\/icon\/z\/z2306_/g, purl+c6[4]).replace(/ys\/icon\/z\/z2307_/g, purl+c7[4]);
        return n;
    });
    $(".fyg_tc>img[src*='ys/icon/z/z24']").attr("src",function(n,v){
        n= v.replace(/ys\/icon\/z\/z2401_/g, purl+h1[4]).replace(/ys\/icon\/z\/z2402_/g, purl+h2[4]).replace(/ys\/icon\/z\/z2403_/g, purl+h3[4]).replace(/ys\/icon\/z\/z2404_/g, purl+h4[4]);
        return n;
    });

    localStorage.setItem('nowEquip', nowEquip);
    theEqName();
};
function themePKimg(){
    if(custom.showCG == true&&!nowTheme.nofgimg){
        let imgpanel,cardname;
        if($(".col-md-6>.alert.alert-danger").length>0){
            for(let i=0;i<$(".col-md-7.fyg_tr").length;i++){
                imgpanel = $('.col-md-7.fyg_tr')[i];
                cardname=imgpanel.children[0].innerText;
                if(cardname[7]==" "){
                    cardname=cardname[8];
                    imgpanel.style.backgroundImage=`url("${nowTheme[cardname][4]}")`;
                    imgpanel.style.backgroundSize="contain";
                    imgpanel.style.backgroundPosition="left top";
                    imgpanel.style.backgroundRepeat="no-repeat";
                };
            };
        };
        if($(".col-md-6>.alert.alert-info").length>0){
            for(let i=0;i<$(".col-md-7.fyg_tl").length;i++){
                imgpanel = document.getElementsByClassName('col-md-7 fyg_tl')[i];
                cardname=imgpanel.children[0].innerText;
                let isyg=false;
                for(let j=0;j<ygcheck.length;j++){
                    if(cardname.indexOf(ygcheck[j])>-1){
                        let ygtcheck=ygcheck[j];
                        imgpanel.style.backgroundImage=`url("${nowTheme[ygtcheck]}")`;
                        imgpanel.style.backgroundSize="contain";
                        imgpanel.style.backgroundPosition="right top";
                        imgpanel.style.backgroundRepeat="no-repeat";
                        isyg = true;
                    };
                };
                if(cardname[7]!=" "&&isyg==false){
                    cardname=cardname[cardname.length-9];
                    imgpanel.style.backgroundImage=`url("${nowTheme[cardname][5]}")`;
                    imgpanel.style.backgroundSize="contain";
                    imgpanel.style.backgroundPosition="right top";
                    imgpanel.style.backgroundRepeat="no-repeat";
                };
            };
        };
    };
};
function getCardName(){
    let imgpanel,cardname; yourcard=custom.yourcard; tempca=false; tempvo=false;
    if($(".text-info.fyg_f24.fyg_lh60").length==1){
        imgpanel = document.getElementsByClassName('text-info fyg_f24 fyg_lh60')[0];
        cardname=imgpanel.children[0].innerText;
        if(cardname.length==1){
            for(let i=0;i<cards.length;i++){ if(cardname.indexOf(cards[i])>-1){ yourcard=cardname; i=999; }; };
            if(custom.showCG&&!nowTheme.nofgimg){
                if(nowTheme[yourcard][2]!="https://sticker.inari.site/null.gif"&&imgpanel.children.length==2){
                    $(`<p id="middlecardimg1"></p><img id="middlecardimg" src="${nowTheme[yourcard][2]}" style="cursor: pointer;"><p id="middlecardimg2"></p>`).insertAfter(imgpanel.children[1]);
                };
            };
        }
        else{ yourcard="舞"; };
        cardvo=nowTheme[yourcard+"voice"];
        spineJson=nowTheme[yourcard+"spine"];
        if(custom.yourcard!=yourcard){ custom.yourcard=yourcard; update(); };
    };
    if($("#eqli2.active").length==1){
        if($("#bigcardimg").length==0&&custom.showCG&&!nowTheme.nofgimg){ $(`<p id="bigcardimg1"></p><img id="bigcardimg" src="https://sticker.inari.site/null.gif">`).insertBefore("#backpacks"); };
        if($(".text-info.fyg_f24").length!=2&&custom.showCG&&!nowTheme.nofgimg){
            imgpanel = document.getElementsByClassName('text-info fyg_f24 fyg_lh60')[0];
            if(imgpanel){
                cardname=imgpanel.children[0].innerText;
                if(cardname.length!=0){ $("#bigcardimg").attr('src',nowTheme[yourcard][3]); }
                else{ $("#bigcardimg").attr('src',"https://sticker.inari.site/null.gif"); };
            };
        };
        if($(".text-info.fyg_f24").length==2){
            cardname = document.getElementsByClassName('text-info fyg_f24')[1].innerText;
            for(let i=0;i<cards.length;i++){ if(cardname.indexOf(cards[i])>-1){ tempca=cardname; i=999; }; };
            cardname=tempca;
            if(custom.showCG&&!nowTheme.nofgimg){ $("#bigcardimg").attr('src',nowTheme[cardname][3]); };
            themeVoice("click",cardname); themeKanban(cardname);
        }
        else{ themeKanban(); };

        if($(".col-sm-2.fyg_lh60").length>0){
            for(let i=0;i<$(".col-sm-2.fyg_lh60").length;i++){
                imgpanel = document.getElementsByClassName('col-sm-2 fyg_lh60')[i];
                cardname=imgpanel.children[0].innerText;
                if(cardname.length==1&&custom.showCG&&!nowTheme.nofgimg){
                    imgpanel.style.textAlign="left";
                    if(nowTheme[cardname]==null){return;}
                    $(`<img class="smallcardimg" id="smallcardimg${i}" src="${nowTheme[cardname][1]}" style="vertical-align:top !important;"><span id="smallcardimg1${i}">&nbsp;&nbsp;</span>`).insertBefore(imgpanel.children[0]);
                };
            };
        };
    }
    else if($("#eqli2.active").length!=1){
        if($("#bigcardimg").length!=0){ $("#bigcardimg").attr('src',"https://sticker.inari.site/null.gif"); };
        themeKanban();
    };
};
function themeKanban(cardname){
    if(custom.showKanban&&!nowTheme.nospine){
        pagetype=nowEquip;
        if(!cardname){
            spineload(spineJson.name,pagetype);
        }
        else{
            loading=false;
            spineload(nowTheme[cardname+"spine"].name,nowTheme[cardname+"spine"].type);
        }
    }
    else if(custom.showKanban&&!nowTheme.nofgimg&&cardname){
        kanbanimg=nowTheme[cardname][2];
        $(".tpkanban").attr('src', kanbanimg);
    };
};
function showKanban(){
    if(!custom.showKanban){
        if($(".spinetool").length>0){ $(".spinetool").remove(); };
        if($("#divkanban").length>0){ $("#divkanban").remove(); };
    }
    else if(!nowTheme.nospine){
        spineJson=nowTheme[yourcard+"spine"];
        spinert=nowTheme.spinert;
        if(localStorage.imgmove != null){ imgmove = JSON.parse(localStorage.imgmove);};
        if(imgmove[0]*ww>ww-3.6*Math.floor(custom.kanbansize )){kbw=ww-3.6*Math.floor(custom.kanbansize )}else{kbw=imgmove[0]*ww};
        if(imgmove[1]*wh>wh-3*Math.floor(custom.kanbansize )){kbh=wh-3*Math.floor(custom.kanbansize )}else{kbh=imgmove[1]*wh};
        tpkanbanHTML =$( `<div class="spinetool" style ="display:none;">
        <span> 动画:</span><select id="animationList"></select><input id="setAnimation" type="button" value="播放"></div>
        <div id = "divkanban" style = "position:fixed;left:${kbw}px;top:${kbh}px;z-index:88;cursor:pointer;" >
        <canvas id="tpkanban" ></canvas></div>`).insertBefore('body');
        if(navigator.userAgent.indexOf('Android') > -1||navigator.userAgent.indexOf('Phone') > -1){
            $('head').append(`<style>
            .divkanban { width:725px ; height:605px ;}
            #tpkanban { width:720px ; height:600px ; }
            </style>`);
        }
        else{
            $('head').append(`<style>
            .divkanban { width:${365*Math.floor(custom.kanbansize )/100}px ; height:${305*Math.floor(custom.kanbansize )/100}px ;}
            #tpkanban { width:360px ; height:300px ; }
            </style>`);
        };
        kanban = document.getElementById("divkanban"); dragfunc(kanban);
        spineinit(true);
    }
    else if(!nowTheme.nofgimg){
        kanbanimg=nowTheme[yourcard][2];
        if(localStorage.imgmove != null){ imgmove = JSON.parse(localStorage.imgmove); };
        if(imgmove[0]*ww>ww-3.6*Math.floor(custom.kanbansize )){kbw=ww-3.6*Math.floor(custom.kanbansize )}else{kbw=imgmove[0]*ww};
        if(imgmove[1]*wh>wh-3*Math.floor(custom.kanbansize )){kbh=wh-3*Math.floor(custom.kanbansize )}else{kbh=imgmove[1]*wh};
        tpkanbanHTML =$( `<div id = "divkanban" style = "position:fixed;left:${kbw}px;top:${kbh}px;z-index:88;cursor:pointer;width:${365*Math.floor(custom.kanbansize )/100}px; height=${305*Math.floor(custom.kanbansize )/100}px;" >
        <img class="tpkanban" src = ${kanbanimg} width =${Math.floor(custom.kanbansize ) + "%"} height =${Math.floor(custom.kanbansize ) + "%"}></div>`).insertBefore('body');
        kanban = document.getElementById("divkanban"); dragfunc(kanban);
    };
};
function themeVoice(type,cardname){

    if(custom&&custom.voiceO&&!nowTheme.novoice){
        let playvo=cardvo;
        if(cardname){ tempvo=nowTheme[cardname+"voice"]; playvo=tempvo; };
        if(type=="on")$("#themeSoundPlay").attr('src',nowTheme.voice[0]);
        if(type=="click")$("#themeSoundPlay").attr('src',playvo[0]+Math.ceil(Math.random()*4-1)+playvo[1]);
        if(type=="levelup"||type=="colle"||type=="change"||type=="power"||type=="win"||type=="lose"||type=="reset"||type=="exp"||type=="battle"){
            $("#themeSoundPlay").attr('src',playvo[0]+type+playvo[1]);
        };
        if(type=="win"||type=="lose"){
            $("#themeSoundPlay")[0].addEventListener('ended', function(){ $("#themeSoundPlay")[0].play(); });
        }
        else if(!ccard){
            $("#themeSoundPlay")[0].play();
        };
    }
    else if(type=="off"&&!nowTheme.novoice){ $("#themeSoundPlay").attr('src',nowTheme.voice[1]); $("#themeSoundPlay")[0].play(); };
};
function themeBattle(){
    if(soundonce%2==0&&battlecheck<1&&$(".alert.with-icon.fyg_tc").length>0){
        if($(".alert.with-icon.fyg_tc").length!=1){
            if($(".alert.alert-danger.with-icon.fyg_tc").length>sucheck){ battleCG("win"); themeVoice("win"); };
            if($(".alert.alert-info.with-icon.fyg_tc").length>facheck){ battleCG("lose"); themeVoice("lose"); };
        }
        else{
            if($(".alert.alert-danger.with-icon.fyg_tc").length>0){ battleCG("win"); themeVoice("win"); };
            if($(".alert.alert-info.with-icon.fyg_tc").length>0){ battleCG("lose"); themeVoice("lose"); };
        };
        ccard=false;++battlecheck;
    };
    if($("button[class*='fyg_colpz05bg'][style*='b4.gif']").length>0&&collecheck<1){
        let expcard=$("button[class*='fyg_colpz05bg'][style*='b4.gif']+.fyg_f18")[0].innerText;
        ++collecheck; themeVoice("levelup",expcard[5]);
    };
};
function battleCG(type){
    if(custom.showKanban&&nowTheme.nospine&&!nowTheme.nofgimg){
        if(type=="win"){ $(".tpkanban").attr('src',nowTheme[yourcard][6]); }
        else if(type=="lose"){ $(".tpkanban").attr('src',nowTheme[yourcard][7]); }
        setTimeout(()=>{$(".tpkanban").attr('src', kanbanimg);},3000);
    }
    else if(custom.showKanban&&!nowTheme.nospine){
        if(type=="win"){ let spjoy=$("option[value*=joyResult]")[0].value.split(','); playAnimation([spjoy[0]]); }
        else if(type=="lose"){ playAnimation(['damage','die','landing']); };
    };
};
function dragfunc(obj){
    ww = window.innerWidth || document.body.clientWidth; wh = window.innerHeight || document.body.clientHeight;
    let l,t,i,s;
    obj.onmousedown = function (event) {
        obj.setCapture && obj.setCapture(); event = event || window.event;
        l = obj.style.left;t = obj.style.top; let ol = event.clientX - obj.offsetLeft, ot = event.clientY - obj.offsetTop;let dragrun=true;
        document.onmousemove = function (event) { event = event || window.event; obj.style.left = event.clientX - ol + "px"; obj.style.top = event.clientY - ot + "px"; if(dragrun){playAnimation(['run']);dragrun=false;};};
        document.onmouseup = function () {
            document.onmousemove = null; document.onmouseup = null;
            obj.releaseCapture && obj.releaseCapture(); i = obj.style.left; s = obj.style.top;
            if (l == i && t == s) {
                if(tempca){ themeVoice("click",tempca); }else{ themeVoice("click"); };
                playAnimation(['000000_dear_smile','idle']);
            }
            else {
                if (parseInt(i) < 0) { obj.style.left = '0px'; i = 0;}
                else if (parseInt(i) > ww-3.6*Math.floor(custom.kanbansize)) { i = 0.8; obj.style.left = ww-3.6*Math.floor(custom.kanbansize) + 'px';}
                else if (parseInt(i) < ww-3.6*Math.floor(custom.kanbansize)) { i = parseInt(i) / ww;};
                if (parseInt(s) < 0) { obj.style.top ='0px'; s = 0;}
                else if (parseInt(s) > wh-3*Math.floor(custom.kanbansize)) { s = 0.68; obj.style.top = wh-3*Math.floor(custom.kanbansize) + 'px';}
                else if (parseInt(s) < wh-3*Math.floor(custom.kanbansize)) { s = parseInt(s) / wh;};
                localStorage.setItem('imgmove', JSON.stringify([i, s]));
                playAnimation(['idle']);
            };
        }; return false;
    };
    obj.addEventListener('touchmove', function (event) {
        event.preventDefault();
        if (event.targetTouches.length == 1) {
            let touch = event.targetTouches[0];
            if (touch.clientX >= 0) {
                if (touch.clientX < ww - 3.6*Math.floor(custom.kanbansize )) { obj.style.left = touch.clientX + 'px'; l = touch.clientX / ww }
                else { obj.style.left = ww-3.6*Math.floor(custom.kanbansize ) + 'px'; l = 0.8 }
            } else if (touch.clientX < 0) { obj.style.left = '0px'; l = 0 };
            if (touch.clientY >= 0) {
                if (touch.clientY < wh-3*Math.floor(custom.kanbansize )) { obj.style.top = touch.clientY + 'px'; t = touch.clientY / wh }
                else { obj.style.top = wh-3*Math.floor(custom.kanbansize ) + 'px'; t = 0.68 }
            } else if (touch.clientY < 0) { obj.style.top = '0px'; t = 0 };
            localStorage.setItem('imgmove', JSON.stringify([l, t]));
        }
    },{ passive: false }); return false;
};
window.onresize = function(){
    if(custom.showKanban&&nowTheme.nospine&&!nowTheme.nofgimg){
        let temp = $('#divkanban');
        ww = window.innerWidth || document.body.clientWidth;
        wh = window.innerHeight|| document.body.clientHeight;
        if(localStorage.imgmove){ imgmove=JSON.parse(localStorage.imgmove); };
        if(imgmove[0]*ww>ww-3.6*Math.floor(custom.kanbansize )){ kbw=ww-3.6*Math.floor(custom.kanbansize ); }else{ kbw=imgmove[0]*ww; };
        if(imgmove[1]*wh>wh-3*Math.floor(custom.kanbansize )){ kbh=wh-3*Math.floor(custom.kanbansize ); }else{ kbh=imgmove[1]*wh; };
        temp[0].style.left=kbw+'px';
        temp[0].style.top =kbh+'px';
    };
};

/* Spine */
window.skeleton = {};
function _(e, t, n) {
    let r = null;
    if ("text" === e){return document.createTextNode(t);};
    r = document.createElement(e);
    for (let l in t){
        if ("style" === l){for (let a in t.style) r.style[a] = t.style[a];}
        else if ("className" === l){r.className = t[l];}
        else if ("event" === l){for (let a in t[l]) r.addEventListener(a, t[l][a]);}
        else {r.setAttribute(l, t[l]);};
    };
    if (n) for (let s = 0; s < n.length; s++)null != n[s] && r.appendChild(n[s]);
    return r;
};
function getClass(i){
    return (i < 10 ? '0' : '') + i;
};
function loadData(url, cb, loadType, progress) {
    let xhr = new XMLHttpRequest; xhr.open('GET', url, true);
    if (loadType) xhr.responseType = loadType; if (progress) xhr.onprogress = progress;
    xhr.onload = function () { if (xhr.status == 200){cb(true, xhr.response);}else{ cb(false);};};
    xhr.onerror = function () {cb(false); }; xhr.send();
};
function sliceCyspAnimation(buf) {
    let view = new DataView(buf), count = view.getInt32(12, true); return { count: count, data: buf.slice((count + 1) * 32)};
};
function spineinit(act) {
    canvas = document.getElementById("tpkanban"); let config = { alpha: true ,backgroundColor: "#000000"};
    gl = canvas.getContext("webgl", config) || canvas.getContext("experimental-webgl", config);
    if (!gl) { alert('code:spine-001\n'+'WebGL is unavailable.');return; };
    shader = spine.webgl.Shader.newTwoColoredTextured(gl); batcher = new spine.webgl.PolygonBatcher(gl);
    mvp.ortho2d(0, 0, 512 - 1, 512 - 1); skeletonRenderer = new spine.webgl.SkeletonRenderer(gl); shapes = new spine.webgl.ShapeRenderer(gl);
    if(!nowTheme.nospine)spineJson=nowTheme[yourcard+"spine"];
    spineload(spineJson.name, pagetype,act);
};
function spineload(name, type,act) {
    if (!custom.showKanban||nowTheme.nospine||loading) return; loading = true;
    if (activeSkeleton == name && currentClass == type&&!act) return; currentClass = type;
    let baseUnitId = name | "wuu"; loadingSkeleton = { id: name , info: spineJson, baseId: '000000' };
    if (loadingSkeleton.info.hasSpecialBase){loadingSkeleton.baseId = baseUnitId; currentClass = baseUnitId;}; let baseId = loadingSkeleton.baseId;
    if (!generalBattleSkeletonData[baseId]){
        console.log( '加载共用骨架 (1/6)');
        loadData(spinert[0] + baseId + '_CHARA_BASE.cysp', function (success, data) {
            if (!success || data === null) return;loading = true; generalBattleSkeletonData[baseId] = data; loadAdditionAnimation();
        }, 'arraybuffer');}
    else {loadAdditionAnimation();};
};
function loadAdditionAnimation() {
    let doneCount = 0, abort = false,baseId = loadingSkeleton.baseId;
    generalAdditionAnimations[baseId] = generalAdditionAnimations[baseId] || {};
    additionAnimations.forEach(function (i) {
        if (generalAdditionAnimations[baseId][i]) return doneCount++;
        loadData(spinert[0] + baseId + '_' + i + '.cysp', function (success, data) {
            if (!success || data == null){ console.log( '加载共用骨架失败');loading = false;abort = true;return abort;};if (abort) return;
            generalAdditionAnimations[baseId][i] = sliceCyspAnimation(data);
            if (++doneCount == additionAnimations.length) return loadClassAnimation();console.log('加载额外动画 (2/6) [' + doneCount + '/6]') ;
        }, 'arraybuffer');
    });
    if (doneCount == additionAnimations.length) return loadClassAnimation();console.log('加载额外动画 (2/6) [' + doneCount + '/6]');
};
function loadClassAnimation() {
    if (currentClassAnimData.type == currentClass){ loadCharaSkillAnimation(); }
    else{
        console.log('加载职介动画 (3/6)');
        loadData( spinert[0] + getClass(currentClass) + '_COMMON_BATTLE.cysp', function (success, data) {
            if (!success || data === null) {console.log('加载职介动画失败');loading = false;return loading;};
            currentClassAnimData = { type: currentClass, data: sliceCyspAnimation(data) };loadCharaSkillAnimation();
        }, 'arraybuffer');
    };
};
function loadCharaSkillAnimation() {
    let baseUnitId = loadingSkeleton.id;
    if (currentCharaAnimData.id == baseUnitId){ loadTexture();}
    else{
        console.log('加载技能动画 (4/6)');loadData(spinert[1] + baseUnitId + 'BATTLE.cysp', function (success, data) {
            if (!success || data === null) { console.log('加载技能动画失败');loading = false;return loading;};
            currentCharaAnimData = { id: baseUnitId, data: sliceCyspAnimation(data)};loadTexture();
        }, 'arraybuffer');
    }
};
function loadTexture() {
    console.log('加载材质位置 (5/6)');
    loadData(spinert[1] + loadingSkeleton.id + 'texture.atlas', function (success, atlasText) {
        if (!success) {console.log('加载材质位置失败');loading = false;return loading;}else{console.log('加载材质图片 (6/6)');};
        loadData(spinert[1] + loadingSkeleton.id + 'texture.png', function (success, blob) {
            if (!success) {console.log('加载材质图片失败');loading = false;return loading; };
            let img = new Image();
            img.onload = function () {
                let created = !!window.skeleton.skeleton;
                if (created) { window.skeleton.state.clearTracks(); window.skeleton.state.clearListeners(); gl.deleteTexture(currentTexture.texture);};
                let imgTexture = new spine.webgl.GLTexture(gl, img); URL.revokeObjectURL(img.src);
                let atlas = new spine.TextureAtlas(atlasText, function (path) { return imgTexture; });
                currentTexture = imgTexture; let atlasLoader = new spine.AtlasAttachmentLoader(atlas);
                let baseId = loadingSkeleton.baseId,additionAnimations = Object.values(generalAdditionAnimations[baseId]),animationCount = 0,classAnimCount = currentClassAnimData.data.count;
                animationCount += classAnimCount; let unitAnimCount = currentCharaAnimData.data.count; animationCount += unitAnimCount;
                additionAnimations.forEach(function (i) { animationCount += i.count; });
                let newBuffSize = generalBattleSkeletonData[baseId].byteLength - 64 + 1 + currentClassAnimData.data.data.byteLength + currentCharaAnimData.data.data.byteLength;
                additionAnimations.forEach(function (i) { newBuffSize += i.data.byteLength;});
                let newBuff = new Uint8Array(newBuffSize), offset = 0;
                newBuff.set(new Uint8Array(generalBattleSkeletonData[baseId].slice(64)), 0);
                offset += generalBattleSkeletonData[baseId].byteLength - 64;
                newBuff[offset] = animationCount; offset++;
                newBuff.set(new Uint8Array(currentClassAnimData.data.data), offset);
                offset += currentClassAnimData.data.data.byteLength;
                newBuff.set(new Uint8Array(currentCharaAnimData.data.data), offset);
                offset += currentCharaAnimData.data.data.byteLength;
                additionAnimations.forEach(function (i) { newBuff.set(new Uint8Array(i.data), offset);offset += i.data.byteLength;})
                let skeletonBinary = new spine.SkeletonBinary(atlasLoader),skeletonData = skeletonBinary.readSkeletonData(newBuff.buffer),skeleton = new spine.Skeleton(skeletonData);
                skeleton.setSkinByName('default'); let bounds = calculateBounds(skeleton);
                let animationStateData = new spine.AnimationStateData(skeleton.data);
                animationState = new spine.AnimationState(animationStateData);
                animationState.setAnimation(0, getClass(currentClass) + '_idle', true);
                animationState.addListener({
                    complete: function tick(track) {
                        if (animationQueue.length) {
                            let nextAnim = animationQueue.shift(); if (nextAnim == 'stop') return; if (nextAnim == 'hold') return setTimeout(tick, 1e3);
                            if (nextAnim.substr(0, 1) != '1') nextAnim = getClass(currentClass) + '_' + nextAnim; console.log(nextAnim);
                            animationState.setAnimation(0, nextAnim, !animationQueue.length);
                        }
                    },
                });
                window.skeleton = { skeleton: skeleton, state: animationState, bounds: bounds, premultipliedAlpha: true };
                loading = false;(window.updateUI || setupUI)();
                if (!created) { canvas.style.width = '99%'; requestAnimationFrame(render); setTimeout(function () { canvas.style.width = ''; }, 0); };
                activeSkeleton = loadingSkeleton.id; currentSkeletonBuffer = newBuff.buffer;
            }
            img.src = URL.createObjectURL(blob); }, 'blob', function (e) { let perc = e.loaded / e.total * 40 + 60; });
    })
};
function playAnimation(animation){
  if(custom&&custom.showKanban==true&&!nowTheme.nospine){
    animationState = skeleton.state;forceNoLoop = false;animationQueue = animation;
    if (animationQueue[0] == 'multi_standBy') { animationQueue.push('multi_idle_standBy');}
    else if (['multi_idle_standBy', 'multi_idle_noWeapon', 'idle', 'walk', 'run', 'run_gamestart'].indexOf(animationQueue[0]) == -1) { animationQueue.push('idle'); };
    console.log(animationQueue); let nextAnim = animationQueue.shift();
    if (!/^\d{6}/.test(nextAnim)) nextAnim = getClass(currentClassAnimData.type) + '_' + nextAnim;
    console.log(nextAnim); animationState.setAnimation(0, nextAnim, !animationQueue.length && !forceNoLoop);
  };
};
function calculateBounds(skeleton) {
    skeleton.setToSetupPose();skeleton.updateWorldTransform();
    let offset = new spine.Vector2(),size = new spine.Vector2();
    skeleton.getBounds(offset, size, []);offset.y = 0; return { offset: offset, size: size };
};
function setupUI() {
    let setupAnimationUI = function () {
        let animationList = $("#animationList");animationList.empty();
        let skeleton = window.skeleton.skeleton,state = window.skeleton.state,activeAnimation = state.tracks[0].animation.name;
        [
            ['闲置', 'idle'],
            ['准备', 'standBy'],
            ['走', 'walk'],
            ['跑', 'run'],
            ['跑（入场）', 'run_gamestart'],
            ['落地', 'landing'],
            ['攻击', 'attack'],
            ['攻击（扫荡）', 'attack_skipQuest'],
            ['庆祝-短', 'joy_short,hold,joy_short_return'],
            ['庆祝-长', 'joy_long,hold,joy_long_return'],
            ['受伤', 'damage'],
            ['死亡', 'die,stop'],
            ['合作-准备', 'multi_standBy'],
            ['合作-闲置', 'multi_idle_standBy'],
            ['合作-闲置（无武器）', 'multi_idle_noWeapon']
        ].forEach(function (i) { animationList[0].appendChild(_('option', { value: i[1] }, [_('text', i[0])]));});
        animationList[0].appendChild(_('option', { disabled: '' }, [_('text', '---')]));
        skeleton.data.animations.forEach(function (i) {
            i = i.name;if (!/^\d{6}_/.test(i)) return; let val = i;if (!/skill/.test(i))val = i + ',stop';
            animationList[0].appendChild(_('option', { value: val }, [ _('text', i.replace(/\d{6}_skill(.+)/, '技能$1').replace(/\d{6}_joyResult/, '庆祝-角色特有')) ]));
        })
    }
    window.updateUI = function () { setupAnimationUI();};setupAnimationUI();
};
function render() {
    let now = Date.now() / 1000,delta = now - lastFrameTime; lastFrameTime = now; delta *= speedFactor;
    resize(); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    let state = window.skeleton.state,skeleton = window.skeleton.skeleton,bounds = window.skeleton.bounds,premultipliedAlpha = window.skeleton.premultipliedAlpha;
    state.update(delta); state.apply(skeleton); skeleton.updateWorldTransform();
    shader.bind(); shader.setUniformi(spine.webgl.Shader.SAMPLER, 0); shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, mvp.values);
    batcher.begin(shader); skeletonRenderer.premultipliedAlpha = premultipliedAlpha; skeletonRenderer.draw(batcher, skeleton); batcher.end(); shader.unbind(); requestAnimationFrame(render);
};
function resize() {
    let useBig = screen.width * devicePixelRatio > 1280,w = canvas.clientWidth * devicePixelRatio,h = canvas.clientHeight * devicePixelRatio,bounds = window.skeleton.bounds;
    if (canvas.width != w || canvas.height != h){ canvas.width = w;canvas.height = h;};
    /* magic */
    let centerX = bounds.offset.x + bounds.size.x / 2,centerY = bounds.offset.y + bounds.size.y / 2,scaleX = bounds.size.x / canvas.width,scaleY = bounds.size.y / canvas.height,scale = Math.max(scaleX, scaleY) * 1.2;
    if(navigator.userAgent.indexOf('Android') > -1||navigator.userAgent.indexOf('Phone') > -1){
        if (scale < 1) scale = 1;let width = 512 * scale,height = 512 * scale;
        mvp.ortho2d(spineJson.wi,spineJson.hi*2, width, height); gl.viewport(0, 0, 512*spineJson.re*2, 512*spineJson.re*2);
    }
    else{
        if (scale < 1) scale = 1;let width = 256 * scale,height = 256 * scale;
    mvp.ortho2d(spineJson.wi,spineJson.hi, width, height); gl.viewport(0, 0, 512*spineJson.re, 512*spineJson.re);
    };
};

/* Cloud Core */
function login(username,act,way) {
    $.ajax({ url: api+'Login&username=' + username + '&password=momoTown', type: 'POST', dataType: 'json' })
        .done(data => {
        if (data.ret == 200) {
            let temp = data.data;
            if (temp.is_login == true) {
                console.log('login');
                temp=JSON.stringify([temp.user_id, temp.token]);
                localStorage.setItem('Cloud_'+User, temp);
                localStorage.setItem('momo_Cloud', temp);
                if(act=="lgn"){
                    download('Guhelper');
                }
                else if(act=="ctl"){ download(way); }
                else if(act=="ltc"){ upload(way); };
            }
            else if (temp.is_login == false) { alert('code:login-001\nOops!');return;}
        }
        else if(data.ret == 400) { beforeCloud('Gupdater'); register(username); }
        else{ alert('code:login-002\nOops!' + data.ret + data.msg);return; }
    })
        .fail(data => { console.log(data);return; });
};
function register(username) {
    $.ajax({ url: api+'Register&username=' + username + '&password=momoTown', type: 'POST', dataType: 'json' })
        .done(data => { if (data.ret == 200) { login(username,"ltc",'Gupdate');
                                             } else { alert('code:reg-001\nOops！' + data.ret + data.msg) }; })
        .fail(data => { console.log(data) });
};
function upload(way) {
    console.log(way+" Uploading...");
    let text=beforeCloud(way),user_id,token,test=false;
    if(localStorage.momo_Cloud){
        let cupd=JSON.parse(localStorage.momo_Cloud);
        user_id=cupd[0];token=cupd[1];
    }
    else{ login(momoUser,"ltc",way);return;};
    if(way=="test"){way="Cardupdate";test=true;};
    let formData={
        "user_id":user_id,
        "token":token,
        "texts":text
    }
    $.ajax({ url:api+way,data: formData, type: 'POST', dataType: 'json' })
        .done(data => {
        if (data.ret == 200) {
            if(test)way="test";
            console.log(way+" uploading...");
            if(data.data==null){ alert('code:upload-001\n'+way+' Date Length Too Long!'); return; }
            else if(data.data.ret!=200){ console.log(data);alert('code:upload-002\n'+data.data.ret+' Error! '+data.data.msg); return; }
            else{console.log(way+' successed!');};
            if(test){ download("test"); };
            if(way=="Gupdate"){localStorage.setItem('momoConf_'+User, JSON.stringify(momoConf));};
        }
        else { alert('code:upload-003\n'+data.msg + data.ret);localStorage.removeItem('momo_Cloud');localStorage.removeItem('Cloud_'+User);return; }
    })
        .fail(data => { console.log(data);localStorage.removeItem('momo_Cloud');localStorage.removeItem('Cloud_'+User);return; });
};
function download(way) {
    let user_id,token,test=false;
    if(localStorage.momo_Cloud){
        let cupd=JSON.parse(localStorage.momo_Cloud);
        user_id=cupd[0];token=cupd[1];
    }
    else{ login(momoUser,"ctl",way);return;};
    if(way=="test"){way="Cardbind";test=true;uuid="testfunc";};
    let formData={
        "user_id":user_id,
        "token":token,
    }
    $.ajax({ url:api+way,data: formData, type: 'POST', dataType: 'json' })
        .done(data => {
        if(data!=null){
            if (data.ret == 200) {
                let tdt=data.data; tdt=tdt[way];
                if(tdt==null){return;};
                if(way!="Guhelper"||test){ if(test)way="test"; console.log(way+" Downloading..."); tdt=tdt.replace(/ /g, "+");console.log("Decrypting "+way+" Data..."); tdt=dec(tdt); console.log(way+" Data Decrypted!"); }
                else{ console.log(way+" Downloading..."); };
                console.log("Unzipping "+way+" Data...");tdt=unzip(tdt); console.log(way+" Data Unzipped!");
                afterCloud(way,tdt);
            }
            else { alert('code:dl-001\n'+data.msg + data.ret);localStorage.removeItem('momo_Cloud');localStorage.removeItem('Cloud_'+User);return; };
        }
        else{alert('code:dl-002\nDate Error!');localStorage.removeItem('momo_Cloud');localStorage.removeItem('Cloud_'+User);return;}
    })
        .fail(data => { console.log(data);return;});
};
function beforeCloud(way){
    let encs;
    if(way!="Gupdater"){
        console.log("Start Data Processing...");
        console.log("Getting "+way+" Raw Data...");
    };
    if(way=="Gupdater"){
        momoConf.ThemePackConf={};
        momoConf.BeachConf={};
        momoConf.guDAQConf={};
        momoConf.PKConf={};

        if(localStorage.ThemePackConf){momoConf.ThemePackConf=JSON.parse(localStorage.ThemePackConf);};
        if(localStorage.userTheme){ momoConf.userTheme=localStorage.userTheme;};
        if(localStorage.maxap) { momoConf.PKConf.maxap =localStorage.maxap; };
        if(localStorage.showSM){ momoConf.PKConf.showSM=localStorage.showSM;};
        if(localStorage.maxrank){ momoConf.PKConf.maxrank=localStorage.maxrank; };
        if(localStorage.g_gemid){ momoConf.PKConf.g_gemid=localStorage.g_gemid; };
        if(localStorage.mainHost){ momoConf.PKConf.mainHost=localStorage.mainHost; };
        if(localStorage.g_ismake){ momoConf.PKConf.g_ismake=localStorage.g_ismake; };
        if(localStorage.flashtime) { momoConf.PKConf.flashtime =localStorage.flashtime; };
        if(localStorage.showcharlv){ momoConf.PKConf.showcharlv=localStorage.showcharlv;};
        if(localStorage.g_ismanualmake){ momoConf.PKConf.g_ismanualmake = localStorage.g_ismanualmake;};

        if(localStorage.getItem('autoBeach_'+User)) { momoConf.BeachConf=JSON.parse(localStorage.getItem('autoBeach_'+User));};

        if(localStorage.over) { momoConf.guDAQConf.over =localStorage.over; };
        if(localStorage.title){ momoConf.guDAQConf.title=localStorage.title;};
        if(localStorage.halo_max) { momoConf.guDAQConf.halo_max =localStorage.halo_max; };
        if(localStorage.cardName) { momoConf.guDAQConf.cardName =localStorage.cardName; };
        if(localStorage.keepcheck){ momoConf.guDAQConf.keepcheck=localStorage.keepcheck;};
        if(localStorage.attribute){ momoConf.guDAQConf.attribute=localStorage.attribute;};
        if(localStorage.beachcheck) { momoConf.guDAQConf.beachcheck=localStorage.beachcheck; };
        if(localStorage.dataReward) { momoConf.guDAQConf.dataReward=localStorage.dataReward; };
        if(localStorage.getItem(User+'_beach_BG') ) { momoConf.guDAQConf.beach_BG = localStorage.getItem(User+'_beach_BG') ; };
        if(localStorage.getItem(User+'_forgeAuto')) { momoConf.guDAQConf.forgeAuto =localStorage.getItem(User+'_forgeAuto'); };
        if(localStorage.getItem(User+'_indexRally')){ momoConf.guDAQConf.indexRally=localStorage.getItem(User+'_indexRally');};
        if(localStorage.getItem(User+'_equipment_BG')) { momoConf.guDAQConf.equipment_BG =localStorage.getItem(User+'_equipment_BG'); };
        if(localStorage.getItem(User+'_keepPkRecord')) { momoConf.guDAQConf.keepPkRecord =localStorage.getItem(User+'_keepPkRecord'); };
        if(localStorage.getItem(User+'_stoneOperation')) { momoConf.guDAQConf.stoneOperation =localStorage.getItem(User+'_stoneOperation'); };
        if(localStorage.getItem(User+'_autoTaskEnabled')){ momoConf.guDAQConf.autoTaskEnabled=localStorage.getItem(User+'_autoTaskEnabled');};
        if(localStorage.getItem(User+'_equipment_Expand')) { momoConf.guDAQConf.equipment_Expand =localStorage.getItem(User+'_equipment_Expand'); };
        if(localStorage.getItem(User+'_beach_forceExpand')){ momoConf.guDAQConf.beach_forceExpand=localStorage.getItem(User+'_beach_forceExpand');};
        if(localStorage.getItem(User+'_equipment_StoreExpand')) { momoConf.guDAQConf.equipment_StoreExpand= localStorage.getItem(User+'_equipment_StoreExpand'); };
        if(localStorage.getItem(User+'_stone_ProgressEquipTip')){ momoConf.guDAQConf.stone_ProgressEquipTip=localStorage.getItem(User+'_stone_ProgressEquipTip');};
        if(localStorage.getItem(User+'_stone_ProgressCardTip')) { momoConf.guDAQConf.stone_ProgressCardTip= localStorage.getItem(User+'_stone_ProgressCardTip'); };
        if(localStorage.getItem(User+'_stone_ProgressHaloTip')) { momoConf.guDAQConf.stone_ProgressHaloTip= localStorage.getItem(User+'_stone_ProgressHaloTip'); };
        if(localStorage.getItem(User+'_ignoreWishpoolExpiration') ) { momoConf.guDAQConf.ignoreWishpoolExpiration = localStorage.getItem(User+'_ignoreWishpoolExpiration') ; };
        if(localStorage.getItem(User+'_beach_ignoreStoreMysEquip')) { momoConf.guDAQConf.beach_ignoreStoreMysEquip =localStorage.getItem(User+'_beach_ignoreStoreMysEquip'); };
        if(localStorage.getItem(User+'_autoTaskCheckStoneProgress')){ momoConf.guDAQConf.autoTaskCheckStoneProgress=localStorage.getItem(User+'_autoTaskCheckStoneProgress');};
        if(localStorage.getItem(User)){
            let daqt=JSON.parse(localStorage.getItem(User));
            if(daqt.config) { momoConf.guDAQConf.config =daqt.config; };
            if(daqt.dataBeachSift) { momoConf.guDAQConf.dataBeachSift =daqt.dataBeachSift; };
            if(daqt.calculatorTemplatePVE) { momoConf.guDAQConf.calculatorTemplatePVE =daqt.calculatorTemplatePVE; };
        };
        if(JSON.stringify(momoConf)!=localStorage.getItem('momoConf_'+User)){
            if(localStorage.momo_Cloud){ upload('Gupdate'); }
            else{ localStorage.setItem('momoConf_'+User, JSON.stringify(momoConf)); };
            return;
        }; return;
    }
    else if(way=="Gupdate"){
        encs = JSON.stringify(momoConf);
    }
    else if(way=="Cardupdate"){
        let cardTemp={},daqt={};
        if(localStorage.getItem(User)){ daqt=JSON.parse(localStorage.getItem(User)); };
        if(daqt.dataIndex&&daqt.dataIndex!={}){ cardTemp.dataIndex=daqt.dataIndex; };
        if(daqt.dataBind&&daqt.dataBind!={}){ cardTemp.dataBind=daqt.dataBind; };
        encs = JSON.stringify(cardTemp);
    }
    else if(way=="Hufupdate"){
        encs = localStorage.getItem(User+'_amulet_groups')||"";
    }
    else if(way=="Pkupdate"){
        encs = localStorage.getItem("log_"+User)||"";
    }
    else if(way=="test"){
        encs = localStorage.userTheme;
    };
    if (encs==""){ console.log('Null Data');return;};
    let before=encs.length;
    console.log(way+" Raw Data Acquired!");
    console.log("Zipping "+way+" Data....")
    encs=zip(encs);
    console.log(way+" Data Zipped! Compression rate: "+(encs.length*100/before).toFixed(2)+"%");
    if(way!="Gupdate"){
        console.log("["+uuid+"] as Key, Encrypting "+way+" Data...");
        encs=enc(encs);
        console.log(way+" Data Encrypted! Compression rate: "+(encs.length*100/before).toFixed(2)+"%");
    }
    console.log("Data Processing completed!");
    return encs;
};
function afterCloud(way,texts){
    if(way=="Guhelper"){
        console.log("Start Restoring Config Data...");
        momoConf=JSON.parse(texts);
        if(momoConf.ThemePackConf&&momoConf.ThemePackConf!={}){
            localStorage.setItem('ThemePackConf',JSON.stringify(momoConf.ThemePackConf));
            console.log("ThemePack Manager Configs Restored!");
        };
        if(momoConf.userTheme){
            localStorage.setItem('userTheme',momoConf.userTheme);
            console.log("UserTheme JSON Data Restored!");
        };

        if(momoConf.BeachConf&&momoConf.BeachConf!={}){
            localStorage.setItem('autoBeach_'+User,JSON.stringify(momoConf.BeachConf));
            console.log("Auto Beach Configs Restored!");
        };

        if(momoConf.PKConf&&momoConf.PKConf!={}){
            let PKConf=momoConf.PKConf;
            if(PKConf.maxap) { localStorage.setItem('maxap', PKConf.maxap); };
            if(PKConf.showSM){ localStorage.setItem('showSM',PKConf.showSM);};
            if(PKConf.maxrank) { localStorage.setItem('maxrank' , PKConf.maxrank); };
            if(PKConf.g_gemid) { localStorage.setItem('g_gemid' , PKConf.g_gemid); };
            if(PKConf.mainHost){ localStorage.setItem('mainHost' ,PKConf.mainHost);};
            if(PKConf.g_ismake){ localStorage.setItem('g_ismake' ,PKConf.g_ismake);};
            if(PKConf.flashtime){ localStorage.setItem('flashtime' ,PKConf.flashtime); };
            if(PKConf.showcharlv){localStorage.setItem('showcharlv',PKConf.showcharlv);};
            if(PKConf.g_ismanualmake) { localStorage.setItem('g_ismanualmake',PKConf.g_ismanualmake); };
            console.log("Auto Claw Configs Restored!");
        };

        if(momoConf.guDAQConf&&momoConf.guDAQConf!={}){
            let DAQConf=momoConf.guDAQConf,daqt={};
            if(localStorage.getItem(User)){ daqt=JSON.parse(localStorage.getItem(User)); };
            if(DAQConf.config) { daqt.config =DAQConf.config; };
            if(DAQConf.dataBeachSift) { daqt.dataBeachSift = DAQConf.dataBeachSift; };
            if(DAQConf.calculatorTemplatePVE) { daqt.calculatorTemplatePVE =DAQConf.calculatorTemplatePVE; };
            localStorage.setItem(User, JSON.stringify(daqt));
            if(DAQConf.over) { localStorage.setItem('over', DAQConf.over); };
            if(DAQConf.title){ localStorage.setItem('title',DAQConf.title);};
            if(DAQConf.halo_max) { localStorage.setItem('halo_max',DAQConf.halo_max); };
            if(DAQConf.cardName) { localStorage.setItem('cardName',DAQConf.cardName); };
            if(DAQConf.attribute) { localStorage.setItem('attribute', DAQConf.attribute); };
            if(DAQConf.keepcheck) { localStorage.setItem('keepcheck', DAQConf.keepcheck); };
            if(DAQConf.beachcheck){ localStorage.setItem('beachcheck',DAQConf.beachcheck);};
            if(DAQConf.dataReward){ localStorage.setItem('dataReward',DAQConf.dataReward);};
            if(DAQConf.beach_BG) { localStorage.setItem(User+'_beach_BG', DAQConf.beach_BG); };
            if(DAQConf.forgeAuto){ localStorage.setItem(User+'_forgeAuto',DAQConf.forgeAuto);};
            if(DAQConf.indexRally ) { localStorage.setItem(User+'_indexRally' , DAQConf.indexRally ); };
            if(DAQConf.equipment_BG){ localStorage.setItem(User+'_equipment_BG',DAQConf.equipment_BG);};
            if(DAQConf.keepPkRecord){ localStorage.setItem(User+'_keepPkRecord',DAQConf.keepPkRecord);};
            if(DAQConf.stoneOperation) { localStorage.setItem(User+'_stoneOperation' ,DAQConf.stoneOperation); };
            if(DAQConf.autoTaskEnabled){ localStorage.setItem(User+'_autoTaskEnabled',DAQConf.autoTaskEnabled);};
            if(DAQConf.beach_forceExpand) { localStorage.setItem(User+'_beach_forceExpand',DAQConf.beach_forceExpand); };
            if(DAQConf.equipment_StoreExpand) { localStorage.setItem(User+'_equipment_StoreExpand', DAQConf.equipment_StoreExpand); };
            if(DAQConf.stone_ProgressEquipTip){ localStorage.setItem(User+'_stone_ProgressEquipTip',DAQConf.stone_ProgressEquipTip);};
            if(DAQConf.stone_ProgressCardTip) { localStorage.setItem(User+'_stone_ProgressCardTip', DAQConf.stone_ProgressCardTip); };
            if(DAQConf.stone_ProgressHaloTip) { localStorage.setItem(User+'_stone_ProgressHaloTip', DAQConf.stone_ProgressHaloTip); };
            if(DAQConf.ignoreWishpoolExpiration ) { localStorage.setItem(User+'_ignoreWishpoolExpiration' , DAQConf.ignoreWishpoolExpiration) ; };
            if(DAQConf.beach_ignoreStoreMysEquip) { localStorage.setItem(User+'_beach_ignoreStoreMysEquip', DAQConf.beach_ignoreStoreMysEquip); };
            if(DAQConf.autoTaskCheckStoneProgress){ localStorage.setItem(User+'_autoTaskCheckStoneProgress',DAQConf.autoTaskCheckStoneProgress);};
            console.log("GuguTown DAQ Configs Restored!");
        };
        console.log("All Config Data Restored!");
        finalInit();
    }
    else if(way=="Cardbind"){
        let cardTemp=JSON.parse(texts),daqt={};
        if(localStorage.getItem(User)){ daqt=JSON.parse(localStorage.getItem(User)); };
        if(cardTemp.dataIndex&&cardTemp.dataIndex!={}){ daqt.dataIndex=cardTemp.dataIndex; console.log("Feats Data Restored!"); };
        if(cardTemp.dataBind&&cardTemp.dataBind!={}){ daqt.dataBind=cardTemp.dataBind; console.log("Cardbind Data Restored!"); };
        localStorage.setItem(User,JSON.stringify(cardTemp));
    }
    else if(way=="Hufugroup"){
        if(texts&&texts!={}){ localStorage.setItem(User+'_amulet_groups',texts); console.log("Amulet_Groups Data Restored!"); };
    }
    else if(way=="Pkdate"){
        if(texts&&texts!={}){ localStorage.setItem('log_'+User,texts); console.log("Battle History Data Restored!"); };
    }
    else if(way=="test"){
        let encs=texts;
        if(encs==localStorage.userTheme){
            console.log("Test Passed!");
        }
        else{
            console.log("Test Completed,but the Current-Data is different from the Raw-Data!");
            console.log(encs);
            console.log(localStorage.userTheme);
        };
        console.log('Please Undo Changes In Cardbind!');
        console.log("\n\n\n\n=== Test Finish! ===\n\n\n");
        $('.themepack-uuid')[0].value="Finish!";
    };
};

/* Zip&Unzip&Enc&Dec&Others */
function zip(str) {
    str=LZMA.compress(str,2);
    str=byte2str(str);
    return str;
};
function unzip(str) {
    str=str2byte(str);
    str=LZMA.decompress(str);
    return str;
};
function enc(message){
    let encrypt = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(uuid), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
    return encrypt;
};
function dec(encrypt){
    let decrypt = CryptoJS.AES.decrypt(encrypt, CryptoJS.enc.Utf8.parse(uuid), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    //转成数字类型
    return decrypt;
};
function byte2str(byte) {
    let hex_str = "",
        i,
        len,
        tmp_hex;

    len = byte.length;

    for (i = 0; i < len; ++i) {
        if (byte[i] < 0) {
            byte[i] = byte[i] + 256;
        }
        tmp_hex = byte[i].toString(16);

        /// Add leading zero.
        if (tmp_hex.length === 1) {
            tmp_hex = "0" + tmp_hex;
        }

        hex_str += tmp_hex;
    }

    return hex_str.trim();
};
function str2byte(str) {
    let count = 0, hex_arr, hex_data = [], hex_len, i;
    if (str.trim() === "") { return []; };
    if (/[^0-9a-fA-F\s]/.test(str)) { return false; };
    hex_arr = mySplit(str,2);
    hex_len = hex_arr.length;
    for (i = 0; i < hex_len; ++i) {
        if (hex_arr[i].trim() === "") { continue; };
        hex_data[count++] = parseInt(hex_arr[i], 16);
    }
    return hex_data;
};
function mySplit(str,leng){
    let arr = [];
    let index = 0;
    while(index<str.length){
        arr.push(str.slice(index,index +=leng));
    }
    return arr;
};
function uuidfunc(){
    uuid=new Date().getTime().toString(36);
    upload('Cardupdate');
    upload('Hufupdate');
    let tst=/^[a-z0-9]*$/g,temp=prompt(lang.puuid, uuid);
    if(temp){
        if(tst.test(temp)&&temp.length==8){
            uuid=temp;
            upload('Cardupdate');
            upload('Hufupdate');
            $('.themepack-uuid')[0].value="Finish!";
        };
    };
    $('.themepack-uuid')[0].value="Finish!";
};
function testfunc(){
    console.log("\n\n\n\n=== Test Start ===\n\n\n\n");
    uuid="testfunc";
    upload("test");
};
function isJSON(str) {
	if (typeof str == 'string') {
	    try {
	        var obj=JSON.parse(str);
	        if(typeof obj == 'object' && obj ){
	            return true;
	        }else{
	            return false;
	        }
	    } catch(e) {
	        console.log('error：'+str+'!!!'+e);
	        return false;
	    }
	}
    else{ return false;};
};


/**
 * Events.
 */
function changeact(cardname){ ccard=false; themeVoice("change",cardname); playAnimation(['standBy']); };
function clickact(cardname) { ccard=false; themeVoice("click", cardname); playAnimation(['standBy']); };
function poweract(cardname) { ccard=false; themeVoice("power", cardname); playAnimation(['000000_eat_normal']); };
function colleact(cardname) { ccard=false; themeVoice("colle", cardname); playAnimation(['joy_short','joy_short_return']); };
$("button[onclick*='fyg_index.php']").attr("onclick","window.location.href='fyg_index.php#'");
$(document).on('blur', "#btnAutoTask", function(){ playAnimation(['joy_long', 'hold','joy_long_return']); themeVoice("colle"); })
.on('change', ".themepack-uuid", function(e){
    let temp=e.target.value,tst=/^[a-z0-9]*$/g;
    if(tst.test(temp)&&temp.length==8){
        uuid=temp;
        download('Cardbind');
        download('Hufugroup');
        e.target.value="Done!"
    }
    else if(temp=="test"){ e.target.value="Testing...";testfunc(); }
    else { e.target.value="Error!"; };
})
.on('click',"button",function(){ccard=false;})
.on('click',"button[style*='float: right;']",function(e){ if(e.target.innerText=="装备"){ playAnimation(['000000_eat_normal']); }; })
.on('click',"[onclick*='gx_cxjd(']",function(){ ccard=true; playAnimation(['standBy']); themeVoice("reset"); })
.on('click',"[class*='g_colpz0'][onclick*='puto(']",function(){ playAnimation(['000000_eat_normal']); })
.on('click',"#bigcardimg", function(){ if(!tempca)tempca=yourcard; themeVoice("click",tempca); })
.on('click',"[onclick*='eqlip(1),eqbp(1)']", function(){ loading=false; ccard=true; changeact();})
.on('click',"[onclick*='eqlip(2),eqbp(2)']", function(){ loading=false; ccard=true; clickact(); })
.on('click',"[onclick*='eqlip(3),eqbp(3)']", function(){ loading=false; ccard=true; changeact();})
.on('click',"[onclick*='eqlip(4),eqbp(4)']", function(){ loading=false; ccard=true; colleact(); })
.on('click',"[onclick*='gox(']",function(){ colleact(); collecheck=0;battlecheck=1; })
.on('click',"[onclick*='updstat(']",function(){ ccard=true; changeact(); })
.on('click',"[onclick*='xxcard(']", function(){ ccard=false; })
.on('click',"[onclick*='vippay()']",function(){ themeVoice("power"); })
.on('click',"[onclick*='payok()']",function(){ themeVoice("levelup"); })
.on('click',"#binding_popup_link",function(){ changeact(tempca); })
.on('click',"[onclick*='puton(']",function(){ changeact(); })
.on('click',"[onclick*='osave(']",function(){ changeact(); })
.on('click',"[onclick*='x_sxds']",function(){ poweract(); })
.on('click',"[onclick*='stdel(']",function(){ themeVoice("reset"); })
.on('click',"[onclick*='g_nz(']",function(){ colleact(); })
.on('click',"[onclick*='stpick(']",function(){ colleact(); })
.on('click',"[onclick*='cgamd(']",function(){ colleact(); })
.on('click',"[onclick*='zshop(']",function(){ colleact(); })
.on('click',"[onclick*='xyre(']" ,function(){ colleact(); })
.on('click',"[onclick*='\'29\'\,\'29\'\,\'5\'']",function(){ colleact(); })
.on('click',"[onclick*='xy_n(\'18']",function(){ colleact(); })
.on('click',"[onclick*='\'4\'\,\'3']",function(){ colleact(); })
.on('click',"[onclick*='sttz(']",function(){ colleact(); })
.on('click',"[onclick*='gx_sxst(']",function(){ colleact(); })
.on('click',"[onclick*='gx_gt(']",function(){ colleact(); })
.on('click',"[onclick*='giftop']",function(){ colleact(); })
.on('click',"[onclick*='xyck(']" ,function(){ colleact(); })
.on('click',"[onclick*='forge(']",function(){ colleact(); })
.on('click',"[onclick*='forca(']",function(){ colleact(); })
.on('click',"[onclick*='orcbs(']",function(){ colleact(); })
.on('click',"#equip_one_key_link",function(){ clickact(); })
.on('click',"[onclick*='xpcard(']",function(){
    let spjoy=$("option[value*=joyResult]")[0].value.split(','); spjoy=spjoy[0]; playAnimation([spjoy]);
    ccard=true; themeVoice("exp",tempca);
})
.on('click',"[onclick*='cmaxup(']",function(){
    let spjoy=$("option[value*=joyResult]")[0].value.split(',');spjoy=spjoy[0];playAnimation([spjoy]);
    ccard=true; themeVoice("levelup",tempca);
})
.on('click',"[onclick*='upcard(']",function(){
    ccard=true; yourcard=tempca; custom.yourcard=yourcard; update();
    cardvo=nowTheme[yourcard+"voice"]; kanbanimg=nowTheme[yourcard][2]; themeVoice("click");
    if(!nowTheme.nospine){ spineJson=nowTheme[yourcard+"spine"]; };
    loading = false; spineload(spineJson.name, pagetype); playAnimation(['standBy']);
    if(custom.showKanban==true&&nowTheme.nospine){ $(".tpkanban").attr('src', kanbanimg); };
})
.on('click',"[onclick*='jgjg(']" , function(){
    battlecheck=0; themeVoice("battle"); playAnimation(['attack','idle']);
    sucheck=$(".alert.alert-danger.with-icon.fyg_tc").length;
    facheck=$(".alert.alert-info.with-icon.fyg_tc").length;
})
.on('click',"#middlecardimg",function(){
    if($('#eqli2.active').length==1&&tempvo!=cardvo){ xxcard(nowTheme[yourcard][0]);}
    else{ themeVoice("click",tempca); };
})
.on('click',"#setAnimation", function(){
    animationState = skeleton.state; forceNoLoop = false;
    animationQueue = $("#animationList")[0].value.split(',');
    if (animationQueue[0] == 'multi_standBy'){ animationQueue.push('multi_idle_standBy'); }
    else if (['multi_idle_standBy', 'multi_idle_noWeapon', 'idle', 'walk', 'run', 'run_gamestart'].indexOf(animationQueue[0]) == -1){ animationQueue.push('idle'); };
    console.log(animationQueue);
    let nextAnim = animationQueue.shift();
    if (!/^\d{6}/.test(nextAnim)) nextAnim = getClass(currentClassAnimData.type) + '_' + nextAnim;
    console.log(nextAnim);
    animationState.setAnimation(0, nextAnim, !animationQueue.length && !forceNoLoop);
})
.on('click',".themepack-ls", function(){
    localStorage.setItem('reload',"true");
    if (confirm(lang.themeSW)) {
        let ThemePack = prompt(lang.themeSA, "1");
        if (ThemePack) {
            if(ThemePack=="0"){ console.log('off');custom.ThemePack="off"; update();location.reload();}
            else if(ThemePack=="1"){ console.log('test');custom.ThemePack="test"; update();location.reload(); }
            else if(ThemePack=="2"){
                if(localStorage.userTheme){
                    if(custom.ver=="ver1.0"){
                        let tempcheck=JSON.parse(localStorage.userTheme);
                        if(tempcheck.nofgimg){ alert('code:usertheme-001\n'+lang.initUFG); };
                        if(tempcheck.novoice){ alert('code:usertheme-002\n'+lang.initUVO); };
                        if(tempcheck.nospine){ alert('code:usertheme-003\n'+lang.initUSP); };

                        console.log('user');custom.ThemePack="test"; update();location.reload();
                    }
                    else{
                        console.log('user');custom.ThemePack="test"; update();location.reload();
                    };
                }
                else{ alert('code:init-001\n'+lang.initUNU); };
            }
            else{ console.log('classic');custom.ThemePack="classic";update();location.reload();};
        };
    }
    else{
        if(confirm(lang.themeDF)){
            console.log('classic');custom.ThemePack="classic"; update();location.reload();
        };
    };
})
.on('click',".themepack-usr",function(){
    let userTheme = prompt(lang.menuUA+'\nhttps://kf.miaola.work/read.php?tid=809121&sf=141&page=21',`${localStorage.userTheme}`);
    if (userTheme&&isJSON(userTheme)){ usTheme(userTheme,false); }
    else if(userTheme){ alert('code:init-002\n'+lang.initUOT); }
    else{ alert('code:init-003\n'+lang.initUNU); };
})
.on('click',".themelang" , function(){
    let ThemeLang = prompt('输入 zh 使用【简体中文】；\n輸入 zht 使用【繁體中文】；\nja を入力 表示言語【日本語】；\nInput en To show in 【English】.', "zh");
    if (ThemeLang) {
        localStorage.setItem('reload',"true");
        if(ThemeLang=="zh"){ custom.language="zh"; update();location.reload();}
        else if(ThemeLang=="zht"){ custom.language="zht"; update();location.reload();}
        else if(ThemeLang=="ja"){ custom.language="ja"; update();location.reload();}
        else if(ThemeLang=="en"){ custom.language="en"; update();location.reload();}
        else{ custom.language="zh"; update();location.reload();};
    };
})
.on('click',".icons-size", function(){
    let IconSize = prompt(lang.iconUA, "50px");
    if (IconSize) { custom.iconSize = IconSize; localStorage.setItem('reload',"true");update();location.reload();};
})
.on('click',".kanban-size",function(){
    let KanbanSize = prompt(lang.kanbanUA, "100");
    if (KanbanSize) { custom.kanbansize = KanbanSize; localStorage.setItem('reload',"true");update();location.reload();};
})
.on('click',".iconpack-switch", function(e){
    custom.useOldNames = e.target.checked;
    localStorage.setItem('reload',"true");update(); location.reload();
})
.on('click',".themepack-equip", function(e){
    custom.useThemeName = e.target.checked;
    localStorage.setItem('reload',"true");update(); location.reload();
})
.on('click',".themepack-showCG",function(e){
    custom.showCG = e.target.checked;
    localStorage.setItem('reload',"true");update();
    if(custom.showCG&&window.location.href.indexOf('fyg_equip.php')>-1){ getCardName();}
    else{
        if($('#bigcardimg').length>0){ $('#bigcardimg').remove(); $('#bigcardimg1').remove(); };
        if($('#middlecardimg').length>0){ $('#middlecardimg').remove(); $('#middlecardimg1').remove(); $('#middlecardimg2').remove(); };
        if($('#smallcardimg0').length>0){
            for(let i=0;i<$(".col-sm-2.fyg_lh60").length;i++){
                $(`#smallcardimg${i}`).remove(); $(`#smallcardimg1${i}`).remove();
            };
        };
    };
})
.on('click',".themepack-showKB",function(e){
    custom.showKanban = e.target.checked; localStorage.setItem('reload',"true");update(); showKanban();
})
.on('click',".themepack-voiceO",function(e){
    custom.voiceO = e.target.checked; update();
    if(custom.voiceO){ themeVoice("on"); }else{ themeVoice("off"); };
})
.on('click',".themepack-cuuid",function(){ uuidfunc(); })
.on('click',".detaillogitem" , function(){ themeIcon(); themePKimg(); })
.ajaxSuccess(function(e,x){
    if(window.location.href.indexOf('fyg_index.php') != -1||window.location.href.indexOf('fyg_index.php#') == -1){
        if(!x.responseJSON){
            ++soundonce;
            if(window.location.href.indexOf('fyg_pk.php')>-1){ themePKimg(); themeIcon();
                if($("a[href*='fyg_index.php']").length>0){
                    $("a[href*='fyg_index.php']")[0].href="fyg_index.php#";
                };
            }
            else if(window.location.href.indexOf('fyg_equip.php')>-1){themeIcon(); getCardName();
                if($("a[href*='fyg_index.php']").length>0){
                    $("a[href*='fyg_index.php']")[0].href="fyg_index.php#";
                };
            }
            else if(window.location.href.indexOf('fyg_beach.php')>-1){ themeIcon(); }
            else if(window.location.href.indexOf('fyg_index.php')>-1&&$(".modal-open").length>0){ theEqName(); };
        };
    }
});

/* Other Update Event */
$(document).on('change', ".stone-operation-options", function(){ beforeCloud("Gupdater"); })
.on('click',"#indexRallyCheckbox", function() { beforeCloud("Gupdater"); })
.on('click',"#keepPkRecordCheckbox", function() { beforeCloud("Gupdater"); })
.on('click',"#autoTaskEnabledCheckbox", function() { beforeCloud("Gupdater"); })
.on('click',".goxtip.smalldiv>input[type*='checkbox']", function() { beforeCloud("Gupdater"); })
.on('change',".goxtip.smalldiv>select", function() { beforeCloud("Gupdater"); })
.on('change',"#goxtipinfo>input[type*='text']", function() { beforeCloud("Gupdater"); })
.on('click',"#goxtipinfo>input[type*='checkbox']", function() { beforeCloud("Gupdater"); })
.on('change',"#timetogoxcheckbox", function() { beforeCloud("Gupdater"); })
.on('change',"#timetogoxtime", function() { beforeCloud("Gupdater"); })
.on('click',"#goxtiptext", function() { localStorage.setItem('reload',"true");})
.on('click',"#equipment_StoreExpand", function() { beforeCloud("Gupdater"); })
.on('click',"#equipment_Expand", function() { beforeCloud("Gupdater"); })
.on('click',"#equipment_BG", function() { beforeCloud("Gupdater"); })
.on('click',"#beach_BG", function() { beforeCloud("Gupdater"); })
.on('click',"#forceExpand", function() { beforeCloud("Gupdater"); })
.on('click',"#generic-popup-foot-button-container>button", function() { beforeCloud("Gupdater"); localStorage.setItem('reload',"true");})
.on('change',"input[oninput*='value=value.replace']", function() { beforeCloud("Gupdater"); });


/**
 * init.
 */
if(!localStorage.getItem('Cloud_'+User)){
    login(momoUser,"lgn");
}
else{
    localStorage.setItem('momo_Cloud', localStorage.getItem('Cloud_'+User));
};
if(window.location.href.indexOf('fyg_index.php') > -1&&window.location.href.indexOf('#') == -1){
    console.log("first");
    nowTheme=originTheme;
    custom={ "useOldNames":false, "language":"zh" };
    download('Guhelper');
}
else{ finalInit(); };
