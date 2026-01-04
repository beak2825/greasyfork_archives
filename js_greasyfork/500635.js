// ==UserScript==
// @name         MWITools
// @namespace    http://tampermonkey.net/
// @version      21.4
// @description  Tools for MilkyWayIdle. Shows total action time. Shows market prices. Shows action number quick inputs. Shows how many actions are needed to reach certain skill level. Shows skill exp percentages. Shows total networth. Shows combat summary. Shows combat maps index. Shows item level on item icons. Shows how many ability books are needed to reach certain level. Shows market equipment filters.
// @author       bot7420
// @license      CC-BY-NC-SA-4.0
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://amvoidguy.github.io/MWICombatSimulatorTest/*
// @match        https://shykai.github.io/mwisim.github.io/*
// @match        https://shykai.github.io/MWICombatSimulatorTest/dist/*
// @match        https://mooneycalc.netlify.app/*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      raw.githubusercontent.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.2/math.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0/dist/chartjs-plugin-datalabels.min.js
// @downloadURL https://update.greasyfork.org/scripts/500635/MWITools.user.js
// @updateURL https://update.greasyfork.org/scripts/500635/MWITools.meta.js
// ==/UserScript==

/*
    Steam客户端玩家还需要额外安装兼容插件。

    MilkyWayIdle Steam game client players should also install this script:
    https://raw.githubusercontent.com/YangLeda/Userscripts-For-MilkyWayIdle/refs/heads/main/MWITools%20addon%20for%20Steam%20version.js
*/

/*
    【遇到MWITools插件有问题时的解决方法】

    请先务必排查以下问题：
    1. 你的MWITools插件已更新至最新版（greasyfork网站有可能被墙，请开梯子更新；或者到QQ群文件里下载后手动导入或复制粘贴代码）；
    2. 你没有重复安装插件（有的人装了新版本插件，但还有个旧版本的没有删除，在同时运行；或者有的人在同一个浏览器里装了两个油猴类浏览器插件）；
    3. 安装或更新完插件后，以及在游戏设置里切换过语言后，必须刷新游戏网页；
    4. 请在电脑上、使用最新版本Chrome浏览器、使用最新版本TamperMonkey（油猴）插件尝试（作者精力有限，做不到逐个适配各种环境、为每个人定位环境问题，
       遇到问题时请优先使用上述主流环境。如果你一定要使用旧版本或其它品牌的浏览器或油猴插件，遇到问题请优先自行摸索如何解决，作者很可能无法解决你的问题。
       手机使用问题很多，作者不定位手机上问题。问问群友用什么浏览器好使，多换几个浏览器试试。苹果手机建议尝试focus浏览器。）。

    如果仍有问题，请私聊作者具体问题是什么、复现问题的具体步骤、最好附带截图；
    与网络有关的问题，右上角红字显示无法从API更新市场数据时，点击红字查看错误信息，截图发给作者；
    报错日志是定位问题的快速甚至唯一方法，请打开浏览器开发者工具查看终端，刷新游戏网页，复现遇到的问题，截图发给作者。
*/

(() => {
    "use strict";

    const THOUSAND_SEPERATOR = new Intl.NumberFormat().format(1111).replaceAll("1", "").at(0) || "";
    const DECIMAL_SEPERATOR = new Intl.NumberFormat().format(1.1).replaceAll("1", "").at(0);

    const isZHInGameSetting = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh"); // 获取游戏内设置语言
    let isZH = isZHInGameSetting; // MWITools 本身显示的语言默认由游戏内设置语言决定

    /* 自定义插件字体颜色 */
    /* 找颜色自行网上搜索"CSS颜色" */
    /* 可以是颜色名称，比如"red"；也可以是颜色Hex，比如"#ED694D" */
    // Customization
    let SCRIPT_COLOR_MAIN = "green"; // 脚本主要字体颜色
    let SCRIPT_COLOR_TOOLTIP = "darkgreen"; // 物品悬浮窗的字体颜色
    const SCRIPT_COLOR_ALERT = "red"; // 警告字体颜色

    const MARKET_API_URL = "https://raw.githubusercontent.com/holychikenz/MWIApi/main/medianmarket.json";

    let settingsMap = {
        useOrangeAsMainColor: {
            id: "useOrangeAsMainColor",
            desc: isZH ? "使用橙色字体" : "Use orange as the main color for the script.",
            isTrue: true,
        },
        totalActionTime: {
            id: "totalActionTime",
            desc: isZH
                ? "左上角显示：当前动作预计总耗时、预计何时完成"
                : "Top left: Estimated total time of the current action, estimated complete time.",
            isTrue: true,
        },
        actionPanel_totalTime: {
            id: "actionPanel_totalTime",
            desc: isZH
                ? "动作面板显示：动作预计总耗时、到多少级还需做多少次、每小时经验"
                : "Action panel: Estimated total time of the action, times needed to reach a target skill level, exp/hour.",
            isTrue: true,
        },
        actionPanel_totalTime_quickInputs: {
            id: "actionPanel_totalTime_quickInputs",
            desc: isZH ? "动作面板显示：快速输入次数 [依赖上一项]" : "Action panel: Quick input numbers. [Depends on the previous selection]",
            isTrue: true,
        },
        actionPanel_foragingTotal: {
            id: "actionPanel_foragingTotal",
            desc: isZH
                ? "动作面板显示：采摘综合图显示综合收益 [依赖上一项]"
                : "Action panel: Overall profit of the foraging maps with multiple outcomes. [Depends on the previous selection]",
            isTrue: true,
        },
        networth: {
            id: "networth",
            desc: isZH
                ? "右上角显示：流动资产(+2及以上物品按强化模拟成本计算)"
                : "Top right: Current assets (Items with at least 2 enhancement levels are valued by enchancing simulator).",
            isTrue: true,
        },
        invWorth: {
            id: "invWorth",
            desc: isZH
                ? "仓库搜索栏下方显示：仓库和战力总结 [依赖上一项]"
                : "Below inventory search bar: Inventory and character summery. [Depends on the previous selection]",
            isTrue: true,
        },
        invSort: {
            id: "invSort",
            desc: isZH ? "仓库显示：仓库物品排序 [依赖上一项]" : "Inventory: Sort inventory items. [Depends on the previous selection]",
            isTrue: true,
        },
        profileBuildScore: {
            id: "profileBuildScore",
            desc: isZH ? "人物面板显示：战力分" : "Profile panel: Build score.",
            isTrue: true,
        },
        itemTooltip_prices: {
            id: "itemTooltip_prices",
            desc: isZH ? "物品悬浮窗显示：24小时市场均价" : "Item tooltip: 24 hours average market price.",
            isTrue: true,
        },
        itemTooltip_profit: {
            id: "itemTooltip_profit",
            desc: isZH
                ? "物品悬浮窗显示：生产成本和利润计算 [依赖上一项]"
                : "Item tooltip: Production cost and profit. [Depends on the previous selection]",
            isTrue: true,
        },
        showConsumTips: {
            id: "showConsumTips",
            desc: isZH
                ? "物品悬浮窗显示：消耗品回血回魔速度、回复性价比、每天最多消耗数量"
                : "Item tooltip: HP/MP consumables restore speed, cost performance, max cost per day.",
            isTrue: true,
        },
        networkAlert: {
            id: "networkAlert",
            desc: isZH ? "右上角显示：无法联网更新市场数据时，红字警告" : "Top right: Alert message when market price data can not be fetched.",
            isTrue: true,
        },
        expPercentage: {
            id: "expPercentage",
            desc: isZH ? "左侧栏显示：技能经验百分比" : "Left sidebar: Percentages of exp of the skill levels.",
            isTrue: true,
        },
        battlePanel: {
            id: "battlePanel",
            desc: isZH
                ? "战斗总结面板（战斗时点击玩家头像）显示：平均每小时战斗次数、收入、经验"
                : "Battle info panel(click on player avatar during combat): Encounters/hour, revenue, exp.",
            isTrue: true,
        },
        itemIconLevel: {
            id: "itemIconLevel",
            desc: isZH ? "装备图标右上角显示：装备等级" : "Top right corner of equipment icons: Equipment level.",
            isTrue: true,
        },
        showsKeyInfoInIcon: {
            id: "showsKeyInfoInIcon",
            desc: isZH
                ? "钥匙和钥匙碎片图标右上角显示：对应的地图序号 [依赖上一项]"
                : "Top right corner of key/fragment icons: Corresponding combat zone index number. [Depends on the previous selection]",
            isTrue: true,
        },
        marketFilter: {
            id: "marketFilter",
            desc: isZH ? "市场页面显示：装备按等级、职业、部位筛选" : "Marketplace: Filter by equipment level, class, slot.",
            isTrue: true,
        },
        taskMapIndex: {
            id: "taskMapIndex",
            desc: isZH ? "任务页面显示：目标战斗地图序号" : "Tasks page: Combat zone index number.",
            isTrue: true,
        },
        mapIndex: {
            id: "mapIndex",
            desc: isZH ? "战斗地图选择页面显示：地图序号" : "Combat zones page: Combat zone index number.",
            isTrue: true,
        },
        skillbook: {
            id: "skillbook",
            desc: isZH
                ? "技能书的物品词典面板显示：到多少级还需要多少本技能书"
                : "Item dictionary of skill books: Number of books needed to reach target skill level.",
            isTrue: true,
        },
        ThirdPartyLinks: {
            id: "ThirdPartyLinks",
            desc: isZH ? "左侧菜单栏显示：第三方工具网站链接、脚本设置链接" : "Left sidebar: Links to 3rd-party websites, script settings.",
            isTrue: true,
        },
        actionQueue: {
            id: "actionQueue",
            desc: isZH
                ? "上方动作队列菜单显示：队列中每个动作预计总时间、到何时完成"
                : "Queued actions panel at the top: Estimated total time and complete time of each queued action.",
            isTrue: true,
        },
        enhanceSim: {
            id: "enhanceSim",
            desc: isZH
                ? "带强化等级的装备的悬浮菜单显示：强化模拟计算"
                : "Tooltip of equipment with enhancement level: Enhancing simulator calculations.",
            isTrue: true,
        },
        checkEquipment: {
            id: "checkEquipment",
            desc: isZH
                ? "页面上方显示：战斗时穿了生产装备，或者生产时没有穿对应的生产装备而仓库里有，红字警告"
                : "Top: Alert message when combating with production equipments equipted, or producing when there are unequipted corresponding production equipment in the inventory.",
            isTrue: true,
        },
        notifiEmptyAction: {
            id: "notifiEmptyAction",
            desc: isZH
                ? "弹窗通知：正在空闲（游戏网页打开时才有效）"
                : "Browser notification: Action queue is empty. (Works only when the game page is open.)",
            isTrue: false,
        },
        fillMarketOrderPrice: {
            id: "fillMarketOrderPrice",
            desc: isZH
                ? "发布市场订单时自动填写为最小压价"
                : "Automatically input price with the smallest increasement/decreasement when posting marketplace bid/sell orders.",
            isTrue: true,
        },
        showDamage: {
            id: "showDamage",
            desc: isZH ? "战斗时，人物头像下方显示：伤害统计数字" : "Bottom of player avatar during combat: DPS.",
            isTrue: true,
        },
        showDamageGraph: {
            id: "showDamageGraph",
            desc: isZH
                ? "战斗时，悬浮窗显示：伤害统计图表 [依赖上一项]"
                : "Floating window during combat: DPS chart. [Depends on the previous selection]",
            isTrue: true,
        },
        forceMWIToolsDisplayZH: {
            id: "forceMWIToolsDisplayZH",
            desc: isZH ? "MWITools本身强制显示中文 MWITools always in Chinese" : "MWITools本身强制显示中文 MWITools always in Chinese",
            isTrue: false,
        },
    };
    readSettings();

    // 非游戏网站
    if (document.URL.includes("amvoidguy.github.io") || document.URL.includes("shykai.github.io/MWICombatSimulatorTest/")) {
        addImportButtonForAmvoidguy();
        observeResultsForAmvoidguy();
        return;
    } else if (document.URL.includes("shykai.github.io/mwisim")) {
        addImportButtonFor9Battles();
        observeResultsForAmvoidguy();
        return;
    } else if (document.URL.includes("mooneycalc.netlify.app")) {
        addImportButtonForMooneycalc();
        return;
    }

    /* 官方汉化 */
    // /static/js/main.9972e69d.chunk.js
    const ZHitemNames = {
        "/items/coin": "\u91d1\u5e01",
        "/items/task_token": "\u4efb\u52a1\u4ee3\u5e01",
        "/items/chimerical_token": "\u5947\u5e7b\u4ee3\u5e01",
        "/items/sinister_token": "\u9634\u68ee\u4ee3\u5e01",
        "/items/enchanted_token": "\u79d8\u6cd5\u4ee3\u5e01",
        "/items/cowbell": "\u725b\u94c3",
        "/items/bag_of_10_cowbells": "\u725b\u94c3\u888b (10\u4e2a)",
        "/items/purples_gift": "\u5c0f\u7d2b\u725b\u7684\u793c\u7269",
        "/items/small_meteorite_cache": "\u5c0f\u9668\u77f3\u8231",
        "/items/medium_meteorite_cache": "\u4e2d\u9668\u77f3\u8231",
        "/items/large_meteorite_cache": "\u5927\u9668\u77f3\u8231",
        "/items/small_artisans_crate": "\u5c0f\u5de5\u5320\u5323",
        "/items/medium_artisans_crate": "\u4e2d\u5de5\u5320\u5323",
        "/items/large_artisans_crate": "\u5927\u5de5\u5320\u5323",
        "/items/small_treasure_chest": "\u5c0f\u5b9d\u7bb1",
        "/items/medium_treasure_chest": "\u4e2d\u5b9d\u7bb1",
        "/items/large_treasure_chest": "\u5927\u5b9d\u7bb1",
        "/items/chimerical_chest": "\u5947\u5e7b\u5b9d\u7bb1",
        "/items/sinister_chest": "\u9634\u68ee\u5b9d\u7bb1",
        "/items/enchanted_chest": "\u79d8\u6cd5\u5b9d\u7bb1",
        "/items/blue_key_fragment": "\u84dd\u8272\u94a5\u5319\u788e\u7247",
        "/items/green_key_fragment": "\u7eff\u8272\u94a5\u5319\u788e\u7247",
        "/items/purple_key_fragment": "\u7d2b\u8272\u94a5\u5319\u788e\u7247",
        "/items/white_key_fragment": "\u767d\u8272\u94a5\u5319\u788e\u7247",
        "/items/orange_key_fragment": "\u6a59\u8272\u94a5\u5319\u788e\u7247",
        "/items/brown_key_fragment": "\u68d5\u8272\u94a5\u5319\u788e\u7247",
        "/items/stone_key_fragment": "\u77f3\u5934\u94a5\u5319\u788e\u7247",
        "/items/dark_key_fragment": "\u9ed1\u6697\u94a5\u5319\u788e\u7247",
        "/items/burning_key_fragment": "\u71c3\u70e7\u94a5\u5319\u788e\u7247",
        "/items/chimerical_entry_key": "\u5947\u5e7b\u94a5\u5319",
        "/items/chimerical_chest_key": "\u5947\u5e7b\u5b9d\u7bb1\u94a5\u5319",
        "/items/sinister_entry_key": "\u9634\u68ee\u94a5\u5319",
        "/items/sinister_chest_key": "\u9634\u68ee\u5b9d\u7bb1\u94a5\u5319",
        "/items/enchanted_entry_key": "\u79d8\u6cd5\u94a5\u5319",
        "/items/enchanted_chest_key": "\u79d8\u6cd5\u5b9d\u7bb1\u94a5\u5319",
        "/items/donut": "\u751c\u751c\u5708",
        "/items/blueberry_donut": "\u84dd\u8393\u751c\u751c\u5708",
        "/items/blackberry_donut": "\u9ed1\u8393\u751c\u751c\u5708",
        "/items/strawberry_donut": "\u8349\u8393\u751c\u751c\u5708",
        "/items/mooberry_donut": "\u54de\u8393\u751c\u751c\u5708",
        "/items/marsberry_donut": "\u706b\u661f\u8393\u751c\u751c\u5708",
        "/items/spaceberry_donut": "\u592a\u7a7a\u8393\u751c\u751c\u5708",
        "/items/cupcake": "\u7eb8\u676f\u86cb\u7cd5",
        "/items/blueberry_cake": "\u84dd\u8393\u86cb\u7cd5",
        "/items/blackberry_cake": "\u9ed1\u8393\u86cb\u7cd5",
        "/items/strawberry_cake": "\u8349\u8393\u86cb\u7cd5",
        "/items/mooberry_cake": "\u54de\u8393\u86cb\u7cd5",
        "/items/marsberry_cake": "\u706b\u661f\u8393\u86cb\u7cd5",
        "/items/spaceberry_cake": "\u592a\u7a7a\u8393\u86cb\u7cd5",
        "/items/gummy": "\u8f6f\u7cd6",
        "/items/apple_gummy": "\u82f9\u679c\u8f6f\u7cd6",
        "/items/orange_gummy": "\u6a59\u5b50\u8f6f\u7cd6",
        "/items/plum_gummy": "\u674e\u5b50\u8f6f\u7cd6",
        "/items/peach_gummy": "\u6843\u5b50\u8f6f\u7cd6",
        "/items/dragon_fruit_gummy": "\u706b\u9f99\u679c\u8f6f\u7cd6",
        "/items/star_fruit_gummy": "\u6768\u6843\u8f6f\u7cd6",
        "/items/yogurt": "\u9178\u5976",
        "/items/apple_yogurt": "\u82f9\u679c\u9178\u5976",
        "/items/orange_yogurt": "\u6a59\u5b50\u9178\u5976",
        "/items/plum_yogurt": "\u674e\u5b50\u9178\u5976",
        "/items/peach_yogurt": "\u6843\u5b50\u9178\u5976",
        "/items/dragon_fruit_yogurt": "\u706b\u9f99\u679c\u9178\u5976",
        "/items/star_fruit_yogurt": "\u6768\u6843\u9178\u5976",
        "/items/milking_tea": "\u6324\u5976\u8336",
        "/items/foraging_tea": "\u91c7\u6458\u8336",
        "/items/woodcutting_tea": "\u4f10\u6728\u8336",
        "/items/cooking_tea": "\u70f9\u996a\u8336",
        "/items/brewing_tea": "\u51b2\u6ce1\u8336",
        "/items/alchemy_tea": "\u70bc\u91d1\u8336",
        "/items/enhancing_tea": "\u5f3a\u5316\u8336",
        "/items/cheesesmithing_tea": "\u5976\u916a\u953b\u9020\u8336",
        "/items/crafting_tea": "\u5236\u4f5c\u8336",
        "/items/tailoring_tea": "\u7f1d\u7eab\u8336",
        "/items/super_milking_tea": "\u8d85\u7ea7\u6324\u5976\u8336",
        "/items/super_foraging_tea": "\u8d85\u7ea7\u91c7\u6458\u8336",
        "/items/super_woodcutting_tea": "\u8d85\u7ea7\u4f10\u6728\u8336",
        "/items/super_cooking_tea": "\u8d85\u7ea7\u70f9\u996a\u8336",
        "/items/super_brewing_tea": "\u8d85\u7ea7\u51b2\u6ce1\u8336",
        "/items/super_alchemy_tea": "\u8d85\u7ea7\u70bc\u91d1\u8336",
        "/items/super_enhancing_tea": "\u8d85\u7ea7\u5f3a\u5316\u8336",
        "/items/super_cheesesmithing_tea": "\u8d85\u7ea7\u5976\u916a\u953b\u9020\u8336",
        "/items/super_crafting_tea": "\u8d85\u7ea7\u5236\u4f5c\u8336",
        "/items/super_tailoring_tea": "\u8d85\u7ea7\u7f1d\u7eab\u8336",
        "/items/ultra_milking_tea": "\u7a76\u6781\u6324\u5976\u8336",
        "/items/ultra_foraging_tea": "\u7a76\u6781\u91c7\u6458\u8336",
        "/items/ultra_woodcutting_tea": "\u7a76\u6781\u4f10\u6728\u8336",
        "/items/ultra_cooking_tea": "\u7a76\u6781\u70f9\u996a\u8336",
        "/items/ultra_brewing_tea": "\u7a76\u6781\u51b2\u6ce1\u8336",
        "/items/ultra_alchemy_tea": "\u7a76\u6781\u70bc\u91d1\u8336",
        "/items/ultra_enhancing_tea": "\u7a76\u6781\u5f3a\u5316\u8336",
        "/items/ultra_cheesesmithing_tea": "\u7a76\u6781\u5976\u916a\u953b\u9020\u8336",
        "/items/ultra_crafting_tea": "\u7a76\u6781\u5236\u4f5c\u8336",
        "/items/ultra_tailoring_tea": "\u7a76\u6781\u7f1d\u7eab\u8336",
        "/items/gathering_tea": "\u91c7\u96c6\u8336",
        "/items/gourmet_tea": "\u7f8e\u98df\u8336",
        "/items/wisdom_tea": "\u7ecf\u9a8c\u8336",
        "/items/processing_tea": "\u52a0\u5de5\u8336",
        "/items/efficiency_tea": "\u6548\u7387\u8336",
        "/items/artisan_tea": "\u5de5\u5320\u8336",
        "/items/catalytic_tea": "\u50ac\u5316\u8336",
        "/items/blessed_tea": "\u798f\u6c14\u8336",
        "/items/stamina_coffee": "\u8010\u529b\u5496\u5561",
        "/items/intelligence_coffee": "\u667a\u529b\u5496\u5561",
        "/items/defense_coffee": "\u9632\u5fa1\u5496\u5561",
        "/items/attack_coffee": "\u653b\u51fb\u5496\u5561",
        "/items/power_coffee": "\u529b\u91cf\u5496\u5561",
        "/items/ranged_coffee": "\u8fdc\u7a0b\u5496\u5561",
        "/items/magic_coffee": "\u9b54\u6cd5\u5496\u5561",
        "/items/super_stamina_coffee": "\u8d85\u7ea7\u8010\u529b\u5496\u5561",
        "/items/super_intelligence_coffee": "\u8d85\u7ea7\u667a\u529b\u5496\u5561",
        "/items/super_defense_coffee": "\u8d85\u7ea7\u9632\u5fa1\u5496\u5561",
        "/items/super_attack_coffee": "\u8d85\u7ea7\u653b\u51fb\u5496\u5561",
        "/items/super_power_coffee": "\u8d85\u7ea7\u529b\u91cf\u5496\u5561",
        "/items/super_ranged_coffee": "\u8d85\u7ea7\u8fdc\u7a0b\u5496\u5561",
        "/items/super_magic_coffee": "\u8d85\u7ea7\u9b54\u6cd5\u5496\u5561",
        "/items/ultra_stamina_coffee": "\u7a76\u6781\u8010\u529b\u5496\u5561",
        "/items/ultra_intelligence_coffee": "\u7a76\u6781\u667a\u529b\u5496\u5561",
        "/items/ultra_defense_coffee": "\u7a76\u6781\u9632\u5fa1\u5496\u5561",
        "/items/ultra_attack_coffee": "\u7a76\u6781\u653b\u51fb\u5496\u5561",
        "/items/ultra_power_coffee": "\u7a76\u6781\u529b\u91cf\u5496\u5561",
        "/items/ultra_ranged_coffee": "\u7a76\u6781\u8fdc\u7a0b\u5496\u5561",
        "/items/ultra_magic_coffee": "\u7a76\u6781\u9b54\u6cd5\u5496\u5561",
        "/items/wisdom_coffee": "\u7ecf\u9a8c\u5496\u5561",
        "/items/lucky_coffee": "\u5e78\u8fd0\u5496\u5561",
        "/items/swiftness_coffee": "\u8fc5\u6377\u5496\u5561",
        "/items/channeling_coffee": "\u541f\u5531\u5496\u5561",
        "/items/critical_coffee": "\u66b4\u51fb\u5496\u5561",
        "/items/poke": "\u7834\u80c6\u4e4b\u523a",
        "/items/impale": "\u900f\u9aa8\u4e4b\u523a",
        "/items/puncture": "\u7834\u7532\u4e4b\u523a",
        "/items/penetrating_strike": "\u8d2f\u5fc3\u4e4b\u523a",
        "/items/scratch": "\u722a\u5f71\u65a9",
        "/items/cleave": "\u5206\u88c2\u65a9",
        "/items/maim": "\u8840\u5203\u65a9",
        "/items/crippling_slash": "\u81f4\u6b8b\u65a9",
        "/items/smack": "\u91cd\u78be",
        "/items/sweep": "\u91cd\u626b",
        "/items/stunning_blow": "\u91cd\u9524",
        "/items/quick_shot": "\u5feb\u901f\u5c04\u51fb",
        "/items/aqua_arrow": "\u6d41\u6c34\u7bad",
        "/items/flame_arrow": "\u70c8\u7130\u7bad",
        "/items/rain_of_arrows": "\u7bad\u96e8",
        "/items/silencing_shot": "\u6c89\u9ed8\u4e4b\u7bad",
        "/items/steady_shot": "\u7a33\u5b9a\u5c04\u51fb",
        "/items/pestilent_shot": "\u75ab\u75c5\u5c04\u51fb",
        "/items/penetrating_shot": "\u8d2f\u7a7f\u5c04\u51fb",
        "/items/water_strike": "\u6d41\u6c34\u51b2\u51fb",
        "/items/ice_spear": "\u51b0\u67aa\u672f",
        "/items/frost_surge": "\u51b0\u971c\u7206\u88c2",
        "/items/mana_spring": "\u6cd5\u529b\u55b7\u6cc9",
        "/items/entangle": "\u7f20\u7ed5",
        "/items/toxic_pollen": "\u5267\u6bd2\u7c89\u5c18",
        "/items/natures_veil": "\u81ea\u7136\u83cc\u5e55",
        "/items/fireball": "\u706b\u7403",
        "/items/flame_blast": "\u7194\u5ca9\u7206\u88c2",
        "/items/firestorm": "\u706b\u7130\u98ce\u66b4",
        "/items/smoke_burst": "\u70df\u7206\u706d\u5f71",
        "/items/minor_heal": "\u521d\u7ea7\u81ea\u6108\u672f",
        "/items/heal": "\u81ea\u6108\u672f",
        "/items/quick_aid": "\u5feb\u901f\u6cbb\u7597\u672f",
        "/items/rejuvenate": "\u7fa4\u4f53\u6cbb\u7597\u672f",
        "/items/taunt": "\u5632\u8bbd",
        "/items/provoke": "\u6311\u8845",
        "/items/toughness": "\u575a\u97e7",
        "/items/elusiveness": "\u95ea\u907f",
        "/items/precision": "\u7cbe\u786e",
        "/items/berserk": "\u72c2\u66b4",
        "/items/elemental_affinity": "\u5143\u7d20\u589e\u5e45",
        "/items/frenzy": "\u72c2\u901f",
        "/items/spike_shell": "\u5c16\u523a\u9632\u62a4",
        "/items/arcane_reflection": "\u5965\u672f\u53cd\u5c04",
        "/items/vampirism": "\u5438\u8840",
        "/items/revive": "\u590d\u6d3b",
        "/items/insanity": "\u75af\u72c2",
        "/items/invincible": "\u65e0\u654c",
        "/items/fierce_aura": "\u7269\u7406\u5149\u73af",
        "/items/aqua_aura": "\u6d41\u6c34\u5149\u73af",
        "/items/sylvan_aura": "\u81ea\u7136\u5149\u73af",
        "/items/flame_aura": "\u706b\u7130\u5149\u73af",
        "/items/speed_aura": "\u901f\u5ea6\u5149\u73af",
        "/items/critical_aura": "\u66b4\u51fb\u5149\u73af",
        "/items/gobo_stabber": "\u54e5\u5e03\u6797\u957f\u5251",
        "/items/gobo_slasher": "\u54e5\u5e03\u6797\u5173\u5200",
        "/items/gobo_smasher": "\u54e5\u5e03\u6797\u72fc\u7259\u68d2",
        "/items/spiked_bulwark": "\u5c16\u523a\u76fe",
        "/items/werewolf_slasher": "\u72fc\u4eba\u5173\u5200",
        "/items/griffin_bulwark": "\u72ee\u9e6b\u91cd\u76fe",
        "/items/gobo_shooter": "\u54e5\u5e03\u6797\u5f39\u5f13",
        "/items/vampiric_bow": "\u5438\u8840\u5f13",
        "/items/cursed_bow": "\u5492\u6028\u4e4b\u5f13",
        "/items/gobo_boomstick": "\u54e5\u5e03\u6797\u706b\u68cd",
        "/items/cheese_bulwark": "\u5976\u916a\u91cd\u76fe",
        "/items/verdant_bulwark": "\u7fe0\u7eff\u91cd\u76fe",
        "/items/azure_bulwark": "\u851a\u84dd\u91cd\u76fe",
        "/items/burble_bulwark": "\u6df1\u7d2b\u91cd\u76fe",
        "/items/crimson_bulwark": "\u7edb\u7ea2\u91cd\u76fe",
        "/items/rainbow_bulwark": "\u5f69\u8679\u91cd\u76fe",
        "/items/holy_bulwark": "\u795e\u5723\u91cd\u76fe",
        "/items/wooden_bow": "\u6728\u5f13",
        "/items/birch_bow": "\u6866\u6728\u5f13",
        "/items/cedar_bow": "\u96ea\u677e\u5f13",
        "/items/purpleheart_bow": "\u7d2b\u5fc3\u5f13",
        "/items/ginkgo_bow": "\u94f6\u674f\u5f13",
        "/items/redwood_bow": "\u7ea2\u6749\u5f13",
        "/items/arcane_bow": "\u795e\u79d8\u5f13",
        "/items/stalactite_spear": "\u77f3\u949f\u957f\u67aa",
        "/items/granite_bludgeon": "\u82b1\u5c97\u5ca9\u5927\u68d2",
        "/items/regal_sword": "\u541b\u738b\u4e4b\u5251",
        "/items/chaotic_flail": "\u6df7\u6c8c\u8fde\u67b7",
        "/items/soul_hunter_crossbow": "\u7075\u9b42\u730e\u624b\u5f29",
        "/items/sundering_crossbow": "\u88c2\u7a7a\u4e4b\u5f29",
        "/items/frost_staff": "\u51b0\u971c\u6cd5\u6756",
        "/items/infernal_battlestaff": "\u70bc\u72f1\u6cd5\u6756",
        "/items/jackalope_staff": "\u9e7f\u89d2\u5154\u4e4b\u6756",
        "/items/cheese_sword": "\u5976\u916a\u5251",
        "/items/verdant_sword": "\u7fe0\u7eff\u5251",
        "/items/azure_sword": "\u851a\u84dd\u5251",
        "/items/burble_sword": "\u6df1\u7d2b\u5251",
        "/items/crimson_sword": "\u7edb\u7ea2\u5251",
        "/items/rainbow_sword": "\u5f69\u8679\u5251",
        "/items/holy_sword": "\u795e\u5723\u5251",
        "/items/cheese_spear": "\u5976\u916a\u957f\u67aa",
        "/items/verdant_spear": "\u7fe0\u7eff\u957f\u67aa",
        "/items/azure_spear": "\u851a\u84dd\u957f\u67aa",
        "/items/burble_spear": "\u6df1\u7d2b\u957f\u67aa",
        "/items/crimson_spear": "\u7edb\u7ea2\u957f\u67aa",
        "/items/rainbow_spear": "\u5f69\u8679\u957f\u67aa",
        "/items/holy_spear": "\u795e\u5723\u957f\u67aa",
        "/items/cheese_mace": "\u5976\u916a\u9489\u5934\u9524",
        "/items/verdant_mace": "\u7fe0\u7eff\u9489\u5934\u9524",
        "/items/azure_mace": "\u851a\u84dd\u9489\u5934\u9524",
        "/items/burble_mace": "\u6df1\u7d2b\u9489\u5934\u9524",
        "/items/crimson_mace": "\u7edb\u7ea2\u9489\u5934\u9524",
        "/items/rainbow_mace": "\u5f69\u8679\u9489\u5934\u9524",
        "/items/holy_mace": "\u795e\u5723\u9489\u5934\u9524",
        "/items/wooden_crossbow": "\u6728\u5f29",
        "/items/birch_crossbow": "\u6866\u6728\u5f29",
        "/items/cedar_crossbow": "\u96ea\u677e\u5f29",
        "/items/purpleheart_crossbow": "\u7d2b\u5fc3\u5f29",
        "/items/ginkgo_crossbow": "\u94f6\u674f\u5f29",
        "/items/redwood_crossbow": "\u7ea2\u6749\u5f29",
        "/items/arcane_crossbow": "\u795e\u79d8\u5f29",
        "/items/wooden_water_staff": "\u6728\u5236\u6c34\u6cd5\u6756",
        "/items/birch_water_staff": "\u6866\u6728\u6c34\u6cd5\u6756",
        "/items/cedar_water_staff": "\u96ea\u677e\u6c34\u6cd5\u6756",
        "/items/purpleheart_water_staff": "\u7d2b\u5fc3\u6c34\u6cd5\u6756",
        "/items/ginkgo_water_staff": "\u94f6\u674f\u6c34\u6cd5\u6756",
        "/items/redwood_water_staff": "\u7ea2\u6749\u6c34\u6cd5\u6756",
        "/items/arcane_water_staff": "\u795e\u79d8\u6c34\u6cd5\u6756",
        "/items/wooden_nature_staff": "\u6728\u5236\u81ea\u7136\u6cd5\u6756",
        "/items/birch_nature_staff": "\u6866\u6728\u81ea\u7136\u6cd5\u6756",
        "/items/cedar_nature_staff": "\u96ea\u677e\u81ea\u7136\u6cd5\u6756",
        "/items/purpleheart_nature_staff": "\u7d2b\u5fc3\u81ea\u7136\u6cd5\u6756",
        "/items/ginkgo_nature_staff": "\u94f6\u674f\u81ea\u7136\u6cd5\u6756",
        "/items/redwood_nature_staff": "\u7ea2\u6749\u81ea\u7136\u6cd5\u6756",
        "/items/arcane_nature_staff": "\u795e\u79d8\u81ea\u7136\u6cd5\u6756",
        "/items/wooden_fire_staff": "\u6728\u706b\u6cd5\u6756",
        "/items/birch_fire_staff": "\u6866\u6728\u706b\u6cd5\u6756",
        "/items/cedar_fire_staff": "\u96ea\u677e\u706b\u6cd5\u6756",
        "/items/purpleheart_fire_staff": "\u7d2b\u5fc3\u706b\u6cd5\u6756",
        "/items/ginkgo_fire_staff": "\u94f6\u674f\u706b\u6cd5\u6756",
        "/items/redwood_fire_staff": "\u7ea2\u6749\u706b\u6cd5\u6756",
        "/items/arcane_fire_staff": "\u795e\u79d8\u706b\u6cd5\u6756",
        "/items/eye_watch": "\u638c\u4e0a\u76d1\u5de5",
        "/items/snake_fang_dirk": "\u86c7\u7259\u77ed\u5251",
        "/items/vision_shield": "\u89c6\u89c9\u76fe",
        "/items/gobo_defender": "\u54e5\u5e03\u6797\u9632\u5fa1\u8005",
        "/items/vampire_fang_dirk": "\u5438\u8840\u9b3c\u77ed\u5251",
        "/items/knights_aegis": "\u9a91\u58eb\u76fe",
        "/items/treant_shield": "\u6811\u4eba\u76fe",
        "/items/manticore_shield": "\u874e\u72ee\u76fe",
        "/items/tome_of_healing": "\u6cbb\u7597\u4e4b\u4e66",
        "/items/tome_of_the_elements": "\u5143\u7d20\u4e4b\u4e66",
        "/items/watchful_relic": "\u8b66\u6212\u9057\u7269",
        "/items/bishops_codex": "\u4e3b\u6559\u6cd5\u5178",
        "/items/cheese_buckler": "\u5976\u916a\u5706\u76fe",
        "/items/verdant_buckler": "\u7fe0\u7eff\u5706\u76fe",
        "/items/azure_buckler": "\u851a\u84dd\u5706\u76fe",
        "/items/burble_buckler": "\u6df1\u7d2b\u5706\u76fe",
        "/items/crimson_buckler": "\u7edb\u7ea2\u5706\u76fe",
        "/items/rainbow_buckler": "\u5f69\u8679\u5706\u76fe",
        "/items/holy_buckler": "\u795e\u5723\u5706\u76fe",
        "/items/wooden_shield": "\u6728\u76fe",
        "/items/birch_shield": "\u6866\u6728\u76fe",
        "/items/cedar_shield": "\u96ea\u677e\u76fe",
        "/items/purpleheart_shield": "\u7d2b\u5fc3\u76fe",
        "/items/ginkgo_shield": "\u94f6\u674f\u76fe",
        "/items/redwood_shield": "\u7ea2\u6749\u76fe",
        "/items/arcane_shield": "\u795e\u79d8\u76fe",
        "/items/sinister_cape": "\u9634\u68ee\u6597\u7bf7",
        "/items/chimerical_quiver": "\u5947\u5e7b\u7bad\u888b",
        "/items/enchanted_cloak": "\u79d8\u6cd5\u62ab\u98ce",
        "/items/red_culinary_hat": "\u7ea2\u8272\u53a8\u5e08\u5e3d",
        "/items/snail_shell_helmet": "\u8717\u725b\u58f3\u5934\u76d4",
        "/items/vision_helmet": "\u89c6\u89c9\u5934\u76d4",
        "/items/fluffy_red_hat": "\u84ec\u677e\u7ea2\u5e3d\u5b50",
        "/items/acrobatic_hood": "\u6742\u6280\u5e08\u515c\u5e3d",
        "/items/magicians_hat": "\u9b54\u672f\u5e08\u5e3d",
        "/items/cheese_helmet": "\u5976\u916a\u5934\u76d4",
        "/items/verdant_helmet": "\u7fe0\u7eff\u5934\u76d4",
        "/items/azure_helmet": "\u851a\u84dd\u5934\u76d4",
        "/items/burble_helmet": "\u6df1\u7d2b\u5934\u76d4",
        "/items/crimson_helmet": "\u7edb\u7ea2\u5934\u76d4",
        "/items/rainbow_helmet": "\u5f69\u8679\u5934\u76d4",
        "/items/holy_helmet": "\u795e\u5723\u5934\u76d4",
        "/items/rough_hood": "\u7c97\u7cd9\u515c\u5e3d",
        "/items/reptile_hood": "\u722c\u884c\u52a8\u7269\u515c\u5e3d",
        "/items/gobo_hood": "\u54e5\u5e03\u6797\u515c\u5e3d",
        "/items/beast_hood": "\u91ce\u517d\u515c\u5e3d",
        "/items/umbral_hood": "\u6697\u5f71\u515c\u5e3d",
        "/items/cotton_hat": "\u68c9\u5e3d",
        "/items/linen_hat": "\u4e9a\u9ebb\u5e3d",
        "/items/bamboo_hat": "\u7af9\u5e3d",
        "/items/silk_hat": "\u4e1d\u5e3d",
        "/items/radiant_hat": "\u5149\u8f89\u5e3d",
        "/items/dairyhands_top": "\u6324\u5976\u5de5\u4e0a\u8863",
        "/items/foragers_top": "\u91c7\u6458\u8005\u4e0a\u8863",
        "/items/lumberjacks_top": "\u4f10\u6728\u5de5\u4e0a\u8863",
        "/items/cheesemakers_top": "\u5976\u916a\u5e08\u4e0a\u8863",
        "/items/crafters_top": "\u5de5\u5320\u4e0a\u8863",
        "/items/tailors_top": "\u88c1\u7f1d\u4e0a\u8863",
        "/items/chefs_top": "\u53a8\u5e08\u4e0a\u8863",
        "/items/brewers_top": "\u996e\u54c1\u5e08\u4e0a\u8863",
        "/items/alchemists_top": "\u70bc\u91d1\u5e08\u4e0a\u8863",
        "/items/enhancers_top": "\u5f3a\u5316\u5e08\u4e0a\u8863",
        "/items/gator_vest": "\u9cc4\u9c7c\u9a6c\u7532",
        "/items/turtle_shell_body": "\u9f9f\u58f3\u80f8\u7532",
        "/items/colossus_plate_body": "\u5de8\u50cf\u80f8\u7532",
        "/items/demonic_plate_body": "\u6076\u9b54\u80f8\u7532",
        "/items/marine_tunic": "\u6d77\u6d0b\u76ae\u8863",
        "/items/revenant_tunic": "\u4ea1\u7075\u76ae\u8863",
        "/items/griffin_tunic": "\u72ee\u9e6b\u76ae\u8863",
        "/items/icy_robe_top": "\u51b0\u971c\u888d\u670d",
        "/items/flaming_robe_top": "\u70c8\u7130\u888d\u670d",
        "/items/luna_robe_top": "\u6708\u795e\u888d\u670d",
        "/items/royal_water_robe_top": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d",
        "/items/royal_nature_robe_top": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d",
        "/items/royal_fire_robe_top": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d",
        "/items/cheese_plate_body": "\u5976\u916a\u80f8\u7532",
        "/items/verdant_plate_body": "\u7fe0\u7eff\u80f8\u7532",
        "/items/azure_plate_body": "\u851a\u84dd\u80f8\u7532",
        "/items/burble_plate_body": "\u6df1\u7d2b\u80f8\u7532",
        "/items/crimson_plate_body": "\u7edb\u7ea2\u80f8\u7532",
        "/items/rainbow_plate_body": "\u5f69\u8679\u80f8\u7532",
        "/items/holy_plate_body": "\u795e\u5723\u80f8\u7532",
        "/items/rough_tunic": "\u7c97\u7cd9\u76ae\u8863",
        "/items/reptile_tunic": "\u722c\u884c\u52a8\u7269\u76ae\u8863",
        "/items/gobo_tunic": "\u54e5\u5e03\u6797\u76ae\u8863",
        "/items/beast_tunic": "\u91ce\u517d\u76ae\u8863",
        "/items/umbral_tunic": "\u6697\u5f71\u76ae\u8863",
        "/items/cotton_robe_top": "\u68c9\u5e03\u888d\u670d",
        "/items/linen_robe_top": "\u4e9a\u9ebb\u888d\u670d",
        "/items/bamboo_robe_top": "\u7af9\u888d\u670d",
        "/items/silk_robe_top": "\u4e1d\u7ef8\u888d\u670d",
        "/items/radiant_robe_top": "\u5149\u8f89\u888d\u670d",
        "/items/dairyhands_bottoms": "\u6324\u5976\u5de5\u4e0b\u88c5",
        "/items/foragers_bottoms": "\u91c7\u6458\u8005\u4e0b\u88c5",
        "/items/lumberjacks_bottoms": "\u4f10\u6728\u5de5\u4e0b\u88c5",
        "/items/cheesemakers_bottoms": "\u5976\u916a\u5e08\u4e0b\u88c5",
        "/items/crafters_bottoms": "\u5de5\u5320\u4e0b\u88c5",
        "/items/tailors_bottoms": "\u88c1\u7f1d\u4e0b\u88c5",
        "/items/chefs_bottoms": "\u53a8\u5e08\u4e0b\u88c5",
        "/items/brewers_bottoms": "\u996e\u54c1\u5e08\u4e0b\u88c5",
        "/items/alchemists_bottoms": "\u70bc\u91d1\u5e08\u4e0b\u88c5",
        "/items/enhancers_bottoms": "\u5f3a\u5316\u5e08\u4e0b\u88c5",
        "/items/turtle_shell_legs": "\u9f9f\u58f3\u817f\u7532",
        "/items/colossus_plate_legs": "\u5de8\u50cf\u817f\u7532",
        "/items/demonic_plate_legs": "\u6076\u9b54\u817f\u7532",
        "/items/marine_chaps": "\u822a\u6d77\u76ae\u88e4",
        "/items/revenant_chaps": "\u4ea1\u7075\u76ae\u88e4",
        "/items/griffin_chaps": "\u72ee\u9e6b\u76ae\u88e4",
        "/items/icy_robe_bottoms": "\u51b0\u971c\u888d\u88d9",
        "/items/flaming_robe_bottoms": "\u70c8\u7130\u888d\u88d9",
        "/items/luna_robe_bottoms": "\u6708\u795e\u888d\u88d9",
        "/items/royal_water_robe_bottoms": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9",
        "/items/royal_nature_robe_bottoms": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9",
        "/items/royal_fire_robe_bottoms": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9",
        "/items/cheese_plate_legs": "\u5976\u916a\u817f\u7532",
        "/items/verdant_plate_legs": "\u7fe0\u7eff\u817f\u7532",
        "/items/azure_plate_legs": "\u851a\u84dd\u817f\u7532",
        "/items/burble_plate_legs": "\u6df1\u7d2b\u817f\u7532",
        "/items/crimson_plate_legs": "\u7edb\u7ea2\u817f\u7532",
        "/items/rainbow_plate_legs": "\u5f69\u8679\u817f\u7532",
        "/items/holy_plate_legs": "\u795e\u5723\u817f\u7532",
        "/items/rough_chaps": "\u7c97\u7cd9\u76ae\u88e4",
        "/items/reptile_chaps": "\u722c\u884c\u52a8\u7269\u76ae\u88e4",
        "/items/gobo_chaps": "\u54e5\u5e03\u6797\u76ae\u88e4",
        "/items/beast_chaps": "\u91ce\u517d\u76ae\u88e4",
        "/items/umbral_chaps": "\u6697\u5f71\u76ae\u88e4",
        "/items/cotton_robe_bottoms": "\u68c9\u888d\u88d9",
        "/items/linen_robe_bottoms": "\u4e9a\u9ebb\u888d\u88d9",
        "/items/bamboo_robe_bottoms": "\u7af9\u888d\u88d9",
        "/items/silk_robe_bottoms": "\u4e1d\u7ef8\u888d\u88d9",
        "/items/radiant_robe_bottoms": "\u5149\u8f89\u888d\u88d9",
        "/items/enchanted_gloves": "\u9644\u9b54\u624b\u5957",
        "/items/pincer_gloves": "\u87f9\u94b3\u624b\u5957",
        "/items/panda_gloves": "\u718a\u732b\u624b\u5957",
        "/items/magnetic_gloves": "\u78c1\u529b\u624b\u5957",
        "/items/dodocamel_gauntlets": "\u6e21\u6e21\u9a7c\u62a4\u624b",
        "/items/sighted_bracers": "\u7784\u51c6\u62a4\u8155",
        "/items/chrono_gloves": "\u65f6\u7a7a\u624b\u5957",
        "/items/cheese_gauntlets": "\u5976\u916a\u62a4\u624b",
        "/items/verdant_gauntlets": "\u7fe0\u7eff\u62a4\u624b",
        "/items/azure_gauntlets": "\u851a\u84dd\u62a4\u624b",
        "/items/burble_gauntlets": "\u6df1\u7d2b\u62a4\u624b",
        "/items/crimson_gauntlets": "\u7edb\u7ea2\u62a4\u624b",
        "/items/rainbow_gauntlets": "\u5f69\u8679\u62a4\u624b",
        "/items/holy_gauntlets": "\u795e\u5723\u62a4\u624b",
        "/items/rough_bracers": "\u7c97\u7cd9\u62a4\u8155",
        "/items/reptile_bracers": "\u722c\u884c\u52a8\u7269\u62a4\u8155",
        "/items/gobo_bracers": "\u54e5\u5e03\u6797\u62a4\u8155",
        "/items/beast_bracers": "\u91ce\u517d\u62a4\u8155",
        "/items/umbral_bracers": "\u6697\u5f71\u62a4\u8155",
        "/items/cotton_gloves": "\u68c9\u624b\u5957",
        "/items/linen_gloves": "\u4e9a\u9ebb\u624b\u5957",
        "/items/bamboo_gloves": "\u7af9\u624b\u5957",
        "/items/silk_gloves": "\u4e1d\u624b\u5957",
        "/items/radiant_gloves": "\u5149\u8f89\u624b\u5957",
        "/items/collectors_boots": "\u6536\u85cf\u5bb6\u9774",
        "/items/shoebill_shoes": "\u9cb8\u5934\u9e73\u978b",
        "/items/black_bear_shoes": "\u9ed1\u718a\u978b",
        "/items/grizzly_bear_shoes": "\u68d5\u718a\u978b",
        "/items/polar_bear_shoes": "\u5317\u6781\u718a\u978b",
        "/items/centaur_boots": "\u534a\u4eba\u9a6c\u9774",
        "/items/sorcerer_boots": "\u5deb\u5e08\u9774",
        "/items/cheese_boots": "\u5976\u916a\u9774",
        "/items/verdant_boots": "\u7fe0\u7eff\u9774",
        "/items/azure_boots": "\u851a\u84dd\u9774",
        "/items/burble_boots": "\u6df1\u7d2b\u9774",
        "/items/crimson_boots": "\u7edb\u7ea2\u9774",
        "/items/rainbow_boots": "\u5f69\u8679\u9774",
        "/items/holy_boots": "\u795e\u5723\u9774",
        "/items/rough_boots": "\u7c97\u7cd9\u9774",
        "/items/reptile_boots": "\u722c\u884c\u52a8\u7269\u9774",
        "/items/gobo_boots": "\u54e5\u5e03\u6797\u9774",
        "/items/beast_boots": "\u91ce\u517d\u9774",
        "/items/umbral_boots": "\u6697\u5f71\u9774",
        "/items/cotton_boots": "\u68c9\u9774",
        "/items/linen_boots": "\u4e9a\u9ebb\u9774",
        "/items/bamboo_boots": "\u7af9\u9774",
        "/items/silk_boots": "\u4e1d\u9774",
        "/items/radiant_boots": "\u5149\u8f89\u9774",
        "/items/small_pouch": "\u5c0f\u888b\u5b50",
        "/items/medium_pouch": "\u4e2d\u888b\u5b50",
        "/items/large_pouch": "\u5927\u888b\u5b50",
        "/items/giant_pouch": "\u5de8\u5927\u888b\u5b50",
        "/items/gluttonous_pouch": "\u8d2a\u98df\u4e4b\u888b",
        "/items/guzzling_pouch": "\u66b4\u996e\u4e4b\u56ca",
        "/items/necklace_of_efficiency": "\u6548\u7387\u9879\u94fe",
        "/items/fighter_necklace": "\u6218\u58eb\u9879\u94fe",
        "/items/ranger_necklace": "\u5c04\u624b\u9879\u94fe",
        "/items/wizard_necklace": "\u5deb\u5e08\u9879\u94fe",
        "/items/necklace_of_wisdom": "\u7ecf\u9a8c\u9879\u94fe",
        "/items/necklace_of_speed": "\u901f\u5ea6\u9879\u94fe",
        "/items/philosophers_necklace": "\u8d24\u8005\u9879\u94fe",
        "/items/earrings_of_gathering": "\u91c7\u96c6\u8033\u73af",
        "/items/earrings_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u8033\u73af",
        "/items/earrings_of_armor": "\u62a4\u7532\u8033\u73af",
        "/items/earrings_of_regeneration": "\u6062\u590d\u8033\u73af",
        "/items/earrings_of_resistance": "\u6297\u6027\u8033\u73af",
        "/items/earrings_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u8033\u73af",
        "/items/earrings_of_critical_strike": "\u66b4\u51fb\u8033\u73af",
        "/items/philosophers_earrings": "\u8d24\u8005\u8033\u73af",
        "/items/ring_of_gathering": "\u91c7\u96c6\u6212\u6307",
        "/items/ring_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u6212\u6307",
        "/items/ring_of_armor": "\u62a4\u7532\u6212\u6307",
        "/items/ring_of_regeneration": "\u6062\u590d\u6212\u6307",
        "/items/ring_of_resistance": "\u6297\u6027\u6212\u6307",
        "/items/ring_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u6212\u6307",
        "/items/ring_of_critical_strike": "\u66b4\u51fb\u6212\u6307",
        "/items/philosophers_ring": "\u8d24\u8005\u6212\u6307",
        "/items/basic_task_badge": "\u57fa\u7840\u4efb\u52a1\u5fbd\u7ae0",
        "/items/advanced_task_badge": "\u9ad8\u7ea7\u4efb\u52a1\u5fbd\u7ae0",
        "/items/expert_task_badge": "\u4e13\u5bb6\u4efb\u52a1\u5fbd\u7ae0",
        "/items/celestial_brush": "\u661f\u7a7a\u5237\u5b50",
        "/items/cheese_brush": "\u5976\u916a\u5237\u5b50",
        "/items/verdant_brush": "\u7fe0\u7eff\u5237\u5b50",
        "/items/azure_brush": "\u851a\u84dd\u5237\u5b50",
        "/items/burble_brush": "\u6df1\u7d2b\u5237\u5b50",
        "/items/crimson_brush": "\u7edb\u7ea2\u5237\u5b50",
        "/items/rainbow_brush": "\u5f69\u8679\u5237\u5b50",
        "/items/holy_brush": "\u795e\u5723\u5237\u5b50",
        "/items/celestial_shears": "\u661f\u7a7a\u526a\u5200",
        "/items/cheese_shears": "\u5976\u916a\u526a\u5200",
        "/items/verdant_shears": "\u7fe0\u7eff\u526a\u5200",
        "/items/azure_shears": "\u851a\u84dd\u526a\u5200",
        "/items/burble_shears": "\u6df1\u7d2b\u526a\u5200",
        "/items/crimson_shears": "\u7edb\u7ea2\u526a\u5200",
        "/items/rainbow_shears": "\u5f69\u8679\u526a\u5200",
        "/items/holy_shears": "\u795e\u5723\u526a\u5200",
        "/items/celestial_hatchet": "\u661f\u7a7a\u65a7\u5934",
        "/items/cheese_hatchet": "\u5976\u916a\u65a7\u5934",
        "/items/verdant_hatchet": "\u7fe0\u7eff\u65a7\u5934",
        "/items/azure_hatchet": "\u851a\u84dd\u65a7\u5934",
        "/items/burble_hatchet": "\u6df1\u7d2b\u65a7\u5934",
        "/items/crimson_hatchet": "\u7edb\u7ea2\u65a7\u5934",
        "/items/rainbow_hatchet": "\u5f69\u8679\u65a7\u5934",
        "/items/holy_hatchet": "\u795e\u5723\u65a7\u5934",
        "/items/celestial_hammer": "\u661f\u7a7a\u9524\u5b50",
        "/items/cheese_hammer": "\u5976\u916a\u9524\u5b50",
        "/items/verdant_hammer": "\u7fe0\u7eff\u9524\u5b50",
        "/items/azure_hammer": "\u851a\u84dd\u9524\u5b50",
        "/items/burble_hammer": "\u6df1\u7d2b\u9524\u5b50",
        "/items/crimson_hammer": "\u7edb\u7ea2\u9524\u5b50",
        "/items/rainbow_hammer": "\u5f69\u8679\u9524\u5b50",
        "/items/holy_hammer": "\u795e\u5723\u9524\u5b50",
        "/items/celestial_chisel": "\u661f\u7a7a\u51ff\u5b50",
        "/items/cheese_chisel": "\u5976\u916a\u51ff\u5b50",
        "/items/verdant_chisel": "\u7fe0\u7eff\u51ff\u5b50",
        "/items/azure_chisel": "\u851a\u84dd\u51ff\u5b50",
        "/items/burble_chisel": "\u6df1\u7d2b\u51ff\u5b50",
        "/items/crimson_chisel": "\u7edb\u7ea2\u51ff\u5b50",
        "/items/rainbow_chisel": "\u5f69\u8679\u51ff\u5b50",
        "/items/holy_chisel": "\u795e\u5723\u51ff\u5b50",
        "/items/celestial_needle": "\u661f\u7a7a\u9488",
        "/items/cheese_needle": "\u5976\u916a\u9488",
        "/items/verdant_needle": "\u7fe0\u7eff\u9488",
        "/items/azure_needle": "\u851a\u84dd\u9488",
        "/items/burble_needle": "\u6df1\u7d2b\u9488",
        "/items/crimson_needle": "\u7edb\u7ea2\u9488",
        "/items/rainbow_needle": "\u5f69\u8679\u9488",
        "/items/holy_needle": "\u795e\u5723\u9488",
        "/items/celestial_spatula": "\u661f\u7a7a\u9505\u94f2",
        "/items/cheese_spatula": "\u5976\u916a\u9505\u94f2",
        "/items/verdant_spatula": "\u7fe0\u7eff\u9505\u94f2",
        "/items/azure_spatula": "\u851a\u84dd\u9505\u94f2",
        "/items/burble_spatula": "\u6df1\u7d2b\u9505\u94f2",
        "/items/crimson_spatula": "\u7edb\u7ea2\u9505\u94f2",
        "/items/rainbow_spatula": "\u5f69\u8679\u9505\u94f2",
        "/items/holy_spatula": "\u795e\u5723\u9505\u94f2",
        "/items/celestial_pot": "\u661f\u7a7a\u58f6",
        "/items/cheese_pot": "\u5976\u916a\u58f6",
        "/items/verdant_pot": "\u7fe0\u7eff\u58f6",
        "/items/azure_pot": "\u851a\u84dd\u58f6",
        "/items/burble_pot": "\u6df1\u7d2b\u58f6",
        "/items/crimson_pot": "\u7edb\u7ea2\u58f6",
        "/items/rainbow_pot": "\u5f69\u8679\u58f6",
        "/items/holy_pot": "\u795e\u5723\u58f6",
        "/items/celestial_alembic": "\u661f\u7a7a\u84b8\u998f\u5668",
        "/items/cheese_alembic": "\u5976\u916a\u84b8\u998f\u5668",
        "/items/verdant_alembic": "\u7fe0\u7eff\u84b8\u998f\u5668",
        "/items/azure_alembic": "\u851a\u84dd\u84b8\u998f\u5668",
        "/items/burble_alembic": "\u6df1\u7d2b\u84b8\u998f\u5668",
        "/items/crimson_alembic": "\u7edb\u7ea2\u84b8\u998f\u5668",
        "/items/rainbow_alembic": "\u5f69\u8679\u84b8\u998f\u5668",
        "/items/holy_alembic": "\u795e\u5723\u84b8\u998f\u5668",
        "/items/celestial_enhancer": "\u661f\u7a7a\u5f3a\u5316\u5668",
        "/items/cheese_enhancer": "\u5976\u916a\u5f3a\u5316\u5668",
        "/items/verdant_enhancer": "\u7fe0\u7eff\u5f3a\u5316\u5668",
        "/items/azure_enhancer": "\u851a\u84dd\u5f3a\u5316\u5668",
        "/items/burble_enhancer": "\u6df1\u7d2b\u5f3a\u5316\u5668",
        "/items/crimson_enhancer": "\u7edb\u7ea2\u5f3a\u5316\u5668",
        "/items/rainbow_enhancer": "\u5f69\u8679\u5f3a\u5316\u5668",
        "/items/holy_enhancer": "\u795e\u5723\u5f3a\u5316\u5668",
        "/items/milk": "\u725b\u5976",
        "/items/verdant_milk": "\u7fe0\u7eff\u725b\u5976",
        "/items/azure_milk": "\u851a\u84dd\u725b\u5976",
        "/items/burble_milk": "\u6df1\u7d2b\u725b\u5976",
        "/items/crimson_milk": "\u7edb\u7ea2\u725b\u5976",
        "/items/rainbow_milk": "\u5f69\u8679\u725b\u5976",
        "/items/holy_milk": "\u795e\u5723\u725b\u5976",
        "/items/cheese": "\u5976\u916a",
        "/items/verdant_cheese": "\u7fe0\u7eff\u5976\u916a",
        "/items/azure_cheese": "\u851a\u84dd\u5976\u916a",
        "/items/burble_cheese": "\u6df1\u7d2b\u5976\u916a",
        "/items/crimson_cheese": "\u7edb\u7ea2\u5976\u916a",
        "/items/rainbow_cheese": "\u5f69\u8679\u5976\u916a",
        "/items/holy_cheese": "\u795e\u5723\u5976\u916a",
        "/items/log": "\u539f\u6728",
        "/items/birch_log": "\u767d\u6866\u539f\u6728",
        "/items/cedar_log": "\u96ea\u677e\u539f\u6728",
        "/items/purpleheart_log": "\u7d2b\u5fc3\u539f\u6728",
        "/items/ginkgo_log": "\u94f6\u674f\u539f\u6728",
        "/items/redwood_log": "\u7ea2\u6749\u539f\u6728",
        "/items/arcane_log": "\u795e\u79d8\u539f\u6728",
        "/items/lumber": "\u6728\u677f",
        "/items/birch_lumber": "\u767d\u6866\u6728\u677f",
        "/items/cedar_lumber": "\u96ea\u677e\u6728\u677f",
        "/items/purpleheart_lumber": "\u7d2b\u5fc3\u6728\u677f",
        "/items/ginkgo_lumber": "\u94f6\u674f\u6728\u677f",
        "/items/redwood_lumber": "\u7ea2\u6749\u6728\u677f",
        "/items/arcane_lumber": "\u795e\u79d8\u6728\u677f",
        "/items/rough_hide": "\u7c97\u7cd9\u517d\u76ae",
        "/items/reptile_hide": "\u722c\u884c\u52a8\u7269\u76ae",
        "/items/gobo_hide": "\u54e5\u5e03\u6797\u76ae",
        "/items/beast_hide": "\u91ce\u517d\u76ae",
        "/items/umbral_hide": "\u6697\u5f71\u76ae",
        "/items/rough_leather": "\u7c97\u7cd9\u76ae\u9769",
        "/items/reptile_leather": "\u722c\u884c\u52a8\u7269\u76ae\u9769",
        "/items/gobo_leather": "\u54e5\u5e03\u6797\u76ae\u9769",
        "/items/beast_leather": "\u91ce\u517d\u76ae\u9769",
        "/items/umbral_leather": "\u6697\u5f71\u76ae\u9769",
        "/items/cotton": "\u68c9\u82b1",
        "/items/flax": "\u4e9a\u9ebb",
        "/items/bamboo_branch": "\u7af9\u5b50",
        "/items/cocoon": "\u8695\u8327",
        "/items/radiant_fiber": "\u5149\u8f89\u7ea4\u7ef4",
        "/items/cotton_fabric": "\u68c9\u82b1\u5e03\u6599",
        "/items/linen_fabric": "\u4e9a\u9ebb\u5e03\u6599",
        "/items/bamboo_fabric": "\u7af9\u5b50\u5e03\u6599",
        "/items/silk_fabric": "\u4e1d\u7ef8",
        "/items/radiant_fabric": "\u5149\u8f89\u5e03\u6599",
        "/items/egg": "\u9e21\u86cb",
        "/items/wheat": "\u5c0f\u9ea6",
        "/items/sugar": "\u7cd6",
        "/items/blueberry": "\u84dd\u8393",
        "/items/blackberry": "\u9ed1\u8393",
        "/items/strawberry": "\u8349\u8393",
        "/items/mooberry": "\u54de\u6885",
        "/items/marsberry": "\u706b\u661f\u6885",
        "/items/spaceberry": "\u592a\u7a7a\u6885",
        "/items/apple": "\u82f9\u679c",
        "/items/orange": "\u6a59\u5b50",
        "/items/plum": "\u674e\u5b50",
        "/items/peach": "\u6843\u5b50",
        "/items/dragon_fruit": "\u706b\u9f99\u679c",
        "/items/star_fruit": "\u6768\u6843",
        "/items/arabica_coffee_bean": "\u4f4e\u7ea7\u5496\u5561\u8c46",
        "/items/robusta_coffee_bean": "\u4e2d\u7ea7\u5496\u5561\u8c46",
        "/items/liberica_coffee_bean": "\u9ad8\u7ea7\u5496\u5561\u8c46",
        "/items/excelsa_coffee_bean": "\u7279\u7ea7\u5496\u5561\u8c46",
        "/items/fieriosa_coffee_bean": "\u706b\u5c71\u5496\u5561\u8c46",
        "/items/spacia_coffee_bean": "\u592a\u7a7a\u5496\u5561\u8c46",
        "/items/green_tea_leaf": "\u7eff\u8336\u53f6",
        "/items/black_tea_leaf": "\u9ed1\u8336\u53f6",
        "/items/burble_tea_leaf": "\u7d2b\u8336\u53f6",
        "/items/moolong_tea_leaf": "\u54de\u9f99\u8336\u53f6",
        "/items/red_tea_leaf": "\u7ea2\u8336\u53f6",
        "/items/emp_tea_leaf": "\u865a\u7a7a\u8336\u53f6",
        "/items/catalyst_of_coinification": "\u70b9\u91d1\u50ac\u5316\u5242",
        "/items/catalyst_of_decomposition": "\u5206\u89e3\u50ac\u5316\u5242",
        "/items/catalyst_of_transmutation": "\u8f6c\u5316\u50ac\u5316\u5242",
        "/items/prime_catalyst": "\u81f3\u9ad8\u50ac\u5316\u5242",
        "/items/snake_fang": "\u86c7\u7259",
        "/items/shoebill_feather": "\u9cb8\u5934\u9e73\u7fbd\u6bdb",
        "/items/snail_shell": "\u8717\u725b\u58f3",
        "/items/crab_pincer": "\u87f9\u94b3",
        "/items/turtle_shell": "\u4e4c\u9f9f\u58f3",
        "/items/marine_scale": "\u6d77\u6d0b\u9cde\u7247",
        "/items/treant_bark": "\u6811\u76ae",
        "/items/centaur_hoof": "\u534a\u4eba\u9a6c\u8e44",
        "/items/luna_wing": "\u6708\u795e\u7ffc",
        "/items/gobo_rag": "\u54e5\u5e03\u6797\u62b9\u5e03",
        "/items/goggles": "\u62a4\u76ee\u955c",
        "/items/magnifying_glass": "\u653e\u5927\u955c",
        "/items/eye_of_the_watcher": "\u89c2\u5bdf\u8005\u4e4b\u773c",
        "/items/icy_cloth": "\u51b0\u971c\u7ec7\u7269",
        "/items/flaming_cloth": "\u70c8\u7130\u7ec7\u7269",
        "/items/sorcerers_sole": "\u9b54\u6cd5\u5e08\u978b\u5e95",
        "/items/chrono_sphere": "\u65f6\u7a7a\u7403",
        "/items/frost_sphere": "\u51b0\u971c\u7403",
        "/items/panda_fluff": "\u718a\u732b\u7ed2",
        "/items/black_bear_fluff": "\u9ed1\u718a\u7ed2",
        "/items/grizzly_bear_fluff": "\u68d5\u718a\u7ed2",
        "/items/polar_bear_fluff": "\u5317\u6781\u718a\u7ed2",
        "/items/red_panda_fluff": "\u5c0f\u718a\u732b\u7ed2",
        "/items/magnet": "\u78c1\u94c1",
        "/items/stalactite_shard": "\u949f\u4e73\u77f3\u788e\u7247",
        "/items/living_granite": "\u82b1\u5c97\u5ca9",
        "/items/colossus_core": "\u5de8\u50cf\u6838\u5fc3",
        "/items/vampire_fang": "\u5438\u8840\u9b3c\u4e4b\u7259",
        "/items/werewolf_claw": "\u72fc\u4eba\u4e4b\u722a",
        "/items/revenant_anima": "\u4ea1\u8005\u4e4b\u9b42",
        "/items/soul_fragment": "\u7075\u9b42\u788e\u7247",
        "/items/infernal_ember": "\u5730\u72f1\u4f59\u70ec",
        "/items/demonic_core": "\u6076\u9b54\u6838\u5fc3",
        "/items/griffin_leather": "\u72ee\u9e6b\u4e4b\u76ae",
        "/items/manticore_sting": "\u874e\u72ee\u4e4b\u523a",
        "/items/jackalope_antler": "\u9e7f\u89d2\u5154\u4e4b\u89d2",
        "/items/dodocamel_plume": "\u6e21\u6e21\u9a7c\u4e4b\u7fce",
        "/items/griffin_talon": "\u72ee\u9e6b\u4e4b\u722a",
        "/items/acrobats_ribbon": "\u6742\u6280\u5e08\u5f69\u5e26",
        "/items/magicians_cloth": "\u9b54\u672f\u5e08\u7ec7\u7269",
        "/items/chaotic_chain": "\u6df7\u6c8c\u9501\u94fe",
        "/items/cursed_ball": "\u8bc5\u5492\u4e4b\u7403",
        "/items/royal_cloth": "\u7687\u5bb6\u7ec7\u7269",
        "/items/knights_ingot": "\u9a91\u58eb\u4e4b\u952d",
        "/items/bishops_scroll": "\u4e3b\u6559\u5377\u8f74",
        "/items/regal_jewel": "\u541b\u738b\u5b9d\u77f3",
        "/items/sundering_jewel": "\u88c2\u7a7a\u5b9d\u77f3",
        "/items/butter_of_proficiency": "\u7cbe\u901a\u4e4b\u6cb9",
        "/items/thread_of_expertise": "\u4e13\u7cbe\u4e4b\u7ebf",
        "/items/branch_of_insight": "\u6d1e\u5bdf\u4e4b\u679d",
        "/items/gluttonous_energy": "\u8d2a\u98df\u80fd\u91cf",
        "/items/guzzling_energy": "\u66b4\u996e\u80fd\u91cf",
        "/items/milking_essence": "\u6324\u5976\u7cbe\u534e",
        "/items/foraging_essence": "\u91c7\u6458\u7cbe\u534e",
        "/items/woodcutting_essence": "\u4f10\u6728\u7cbe\u534e",
        "/items/cheesesmithing_essence": "\u5976\u916a\u953b\u9020\u7cbe\u534e",
        "/items/crafting_essence": "\u5236\u4f5c\u7cbe\u534e",
        "/items/tailoring_essence": "\u7f1d\u7eab\u7cbe\u534e",
        "/items/cooking_essence": "\u70f9\u996a\u7cbe\u534e",
        "/items/brewing_essence": "\u51b2\u6ce1\u7cbe\u534e",
        "/items/alchemy_essence": "\u70bc\u91d1\u7cbe\u534e",
        "/items/enhancing_essence": "\u5f3a\u5316\u7cbe\u534e",
        "/items/swamp_essence": "\u6cbc\u6cfd\u7cbe\u534e",
        "/items/aqua_essence": "\u6d77\u6d0b\u7cbe\u534e",
        "/items/jungle_essence": "\u4e1b\u6797\u7cbe\u534e",
        "/items/gobo_essence": "\u54e5\u5e03\u6797\u7cbe\u534e",
        "/items/eyessence": "\u773c\u7cbe\u534e",
        "/items/sorcerer_essence": "\u6cd5\u5e08\u7cbe\u534e",
        "/items/bear_essence": "\u718a\u718a\u7cbe\u534e",
        "/items/golem_essence": "\u9b54\u50cf\u7cbe\u534e",
        "/items/twilight_essence": "\u66ae\u5149\u7cbe\u534e",
        "/items/abyssal_essence": "\u5730\u72f1\u7cbe\u534e",
        "/items/chimerical_essence": "\u5947\u5e7b\u7cbe\u534e",
        "/items/sinister_essence": "\u9634\u68ee\u7cbe\u534e",
        "/items/enchanted_essence": "\u79d8\u6cd5\u7cbe\u534e",
        "/items/task_crystal": "\u4efb\u52a1\u6c34\u6676",
        "/items/star_fragment": "\u661f\u5149\u788e\u7247",
        "/items/pearl": "\u73cd\u73e0",
        "/items/amber": "\u7425\u73c0",
        "/items/garnet": "\u77f3\u69b4\u77f3",
        "/items/jade": "\u7fe1\u7fe0",
        "/items/amethyst": "\u7d2b\u6c34\u6676",
        "/items/moonstone": "\u6708\u4eae\u77f3",
        "/items/sunstone": "\u592a\u9633\u77f3",
        "/items/philosophers_stone": "\u8d24\u8005\u4e4b\u77f3",
        "/items/crushed_pearl": "\u73cd\u73e0\u788e\u7247",
        "/items/crushed_amber": "\u7425\u73c0\u788e\u7247",
        "/items/crushed_garnet": "\u77f3\u69b4\u77f3\u788e\u7247",
        "/items/crushed_jade": "\u7fe1\u7fe0\u788e\u7247",
        "/items/crushed_amethyst": "\u7d2b\u6c34\u6676\u788e\u7247",
        "/items/crushed_moonstone": "\u6708\u4eae\u77f3\u788e\u7247",
        "/items/crushed_sunstone": "\u592a\u9633\u77f3\u788e\u7247",
        "/items/crushed_philosophers_stone": "\u8d24\u8005\u4e4b\u77f3\u788e\u7247",
        "/items/shard_of_protection": "\u4fdd\u62a4\u788e\u7247",
        "/items/mirror_of_protection": "\u4fdd\u62a4\u4e4b\u955c",
    };

    const ZHActionNames = {
        "/actions/milking/cow": "\u5976\u725b",
        "/actions/milking/verdant_cow": "\u7fe0\u7eff\u5976\u725b",
        "/actions/milking/azure_cow": "\u851a\u84dd\u5976\u725b",
        "/actions/milking/burble_cow": "\u6df1\u7d2b\u5976\u725b",
        "/actions/milking/crimson_cow": "\u7edb\u7ea2\u5976\u725b",
        "/actions/milking/unicow": "\u5f69\u8679\u5976\u725b",
        "/actions/milking/holy_cow": "\u795e\u5723\u5976\u725b",
        "/actions/foraging/egg": "\u9e21\u86cb",
        "/actions/foraging/wheat": "\u5c0f\u9ea6",
        "/actions/foraging/sugar": "\u7cd6",
        "/actions/foraging/cotton": "\u68c9\u82b1",
        "/actions/foraging/farmland": "\u7fe0\u91ce\u519c\u573a",
        "/actions/foraging/blueberry": "\u84dd\u8393",
        "/actions/foraging/apple": "\u82f9\u679c",
        "/actions/foraging/arabica_coffee_bean": "\u4f4e\u7ea7\u5496\u5561\u8c46",
        "/actions/foraging/flax": "\u4e9a\u9ebb",
        "/actions/foraging/shimmering_lake": "\u6ce2\u5149\u6e56\u6cca",
        "/actions/foraging/blackberry": "\u9ed1\u8393",
        "/actions/foraging/orange": "\u6a59\u5b50",
        "/actions/foraging/robusta_coffee_bean": "\u4e2d\u7ea7\u5496\u5561\u8c46",
        "/actions/foraging/misty_forest": "\u8ff7\u96fe\u68ee\u6797",
        "/actions/foraging/strawberry": "\u8349\u8393",
        "/actions/foraging/plum": "\u674e\u5b50",
        "/actions/foraging/liberica_coffee_bean": "\u9ad8\u7ea7\u5496\u5561\u8c46",
        "/actions/foraging/bamboo_branch": "\u7af9\u5b50",
        "/actions/foraging/burble_beach": "\u6df1\u7d2b\u6c99\u6ee9",
        "/actions/foraging/mooberry": "\u54de\u6885",
        "/actions/foraging/peach": "\u6843\u5b50",
        "/actions/foraging/excelsa_coffee_bean": "\u7279\u7ea7\u5496\u5561\u8c46",
        "/actions/foraging/cocoon": "\u8695\u8327",
        "/actions/foraging/silly_cow_valley": "\u50bb\u725b\u5c71\u8c37",
        "/actions/foraging/marsberry": "\u706b\u661f\u6885",
        "/actions/foraging/dragon_fruit": "\u706b\u9f99\u679c",
        "/actions/foraging/fieriosa_coffee_bean": "\u706b\u5c71\u5496\u5561\u8c46",
        "/actions/foraging/olympus_mons": "\u5965\u6797\u5339\u65af\u5c71",
        "/actions/foraging/spaceberry": "\u592a\u7a7a\u6885",
        "/actions/foraging/star_fruit": "\u6768\u6843",
        "/actions/foraging/spacia_coffee_bean": "\u592a\u7a7a\u5496\u5561\u8c46",
        "/actions/foraging/radiant_fiber": "\u5149\u8f89\u7ea4\u7ef4",
        "/actions/foraging/asteroid_belt": "\u5c0f\u884c\u661f\u5e26",
        "/actions/woodcutting/tree": "\u6811",
        "/actions/woodcutting/birch_tree": "\u6866\u6811",
        "/actions/woodcutting/cedar_tree": "\u96ea\u677e\u6811",
        "/actions/woodcutting/purpleheart_tree": "\u7d2b\u5fc3\u6811",
        "/actions/woodcutting/ginkgo_tree": "\u94f6\u674f\u6811",
        "/actions/woodcutting/redwood_tree": "\u7ea2\u6749\u6811",
        "/actions/woodcutting/arcane_tree": "\u5965\u79d8\u6811",
        "/actions/cheesesmithing/cheese": "\u5976\u916a",
        "/actions/cheesesmithing/cheese_boots": "\u5976\u916a\u9774",
        "/actions/cheesesmithing/cheese_gauntlets": "\u5976\u916a\u62a4\u624b",
        "/actions/cheesesmithing/cheese_sword": "\u5976\u916a\u5251",
        "/actions/cheesesmithing/cheese_brush": "\u5976\u916a\u5237\u5b50",
        "/actions/cheesesmithing/cheese_shears": "\u5976\u916a\u526a\u5200",
        "/actions/cheesesmithing/cheese_hatchet": "\u5976\u916a\u65a7\u5934",
        "/actions/cheesesmithing/cheese_spear": "\u5976\u916a\u957f\u67aa",
        "/actions/cheesesmithing/cheese_hammer": "\u5976\u916a\u9524\u5b50",
        "/actions/cheesesmithing/cheese_chisel": "\u5976\u916a\u51ff\u5b50",
        "/actions/cheesesmithing/cheese_needle": "\u5976\u916a\u9488",
        "/actions/cheesesmithing/cheese_spatula": "\u5976\u916a\u9505\u94f2",
        "/actions/cheesesmithing/cheese_pot": "\u5976\u916a\u58f6",
        "/actions/cheesesmithing/cheese_mace": "\u5976\u916a\u9489\u5934\u9524",
        "/actions/cheesesmithing/cheese_alembic": "\u5976\u916a\u84b8\u998f\u5668",
        "/actions/cheesesmithing/cheese_enhancer": "\u5976\u916a\u5f3a\u5316\u5668",
        "/actions/cheesesmithing/cheese_helmet": "\u5976\u916a\u5934\u76d4",
        "/actions/cheesesmithing/cheese_buckler": "\u5976\u916a\u5706\u76fe",
        "/actions/cheesesmithing/cheese_bulwark": "\u5976\u916a\u91cd\u76fe",
        "/actions/cheesesmithing/cheese_plate_legs": "\u5976\u916a\u817f\u7532",
        "/actions/cheesesmithing/cheese_plate_body": "\u5976\u916a\u80f8\u7532",
        "/actions/cheesesmithing/verdant_cheese": "\u7fe0\u7eff\u5976\u916a",
        "/actions/cheesesmithing/verdant_boots": "\u7fe0\u7eff\u9774",
        "/actions/cheesesmithing/verdant_gauntlets": "\u7fe0\u7eff\u62a4\u624b",
        "/actions/cheesesmithing/verdant_sword": "\u7fe0\u7eff\u5251",
        "/actions/cheesesmithing/verdant_brush": "\u7fe0\u7eff\u5237\u5b50",
        "/actions/cheesesmithing/verdant_shears": "\u7fe0\u7eff\u526a\u5200",
        "/actions/cheesesmithing/verdant_hatchet": "\u7fe0\u7eff\u65a7\u5934",
        "/actions/cheesesmithing/verdant_spear": "\u7fe0\u7eff\u957f\u67aa",
        "/actions/cheesesmithing/verdant_hammer": "\u7fe0\u7eff\u9524\u5b50",
        "/actions/cheesesmithing/verdant_chisel": "\u7fe0\u7eff\u51ff\u5b50",
        "/actions/cheesesmithing/verdant_needle": "\u7fe0\u7eff\u9488",
        "/actions/cheesesmithing/verdant_spatula": "\u7fe0\u7eff\u9505\u94f2",
        "/actions/cheesesmithing/verdant_pot": "\u7fe0\u7eff\u58f6",
        "/actions/cheesesmithing/verdant_mace": "\u7fe0\u7eff\u9489\u5934\u9524",
        "/actions/cheesesmithing/snake_fang_dirk": "\u86c7\u7259\u77ed\u5251",
        "/actions/cheesesmithing/verdant_alembic": "\u7fe0\u7eff\u84b8\u998f\u5668",
        "/actions/cheesesmithing/verdant_enhancer": "\u7fe0\u7eff\u5f3a\u5316\u5668",
        "/actions/cheesesmithing/verdant_helmet": "\u7fe0\u7eff\u5934\u76d4",
        "/actions/cheesesmithing/verdant_buckler": "\u7fe0\u7eff\u5706\u76fe",
        "/actions/cheesesmithing/verdant_bulwark": "\u7fe0\u7eff\u91cd\u76fe",
        "/actions/cheesesmithing/verdant_plate_legs": "\u7fe0\u7eff\u817f\u7532",
        "/actions/cheesesmithing/verdant_plate_body": "\u7fe0\u7eff\u80f8\u7532",
        "/actions/cheesesmithing/azure_cheese": "\u851a\u84dd\u5976\u916a",
        "/actions/cheesesmithing/azure_boots": "\u851a\u84dd\u9774",
        "/actions/cheesesmithing/azure_gauntlets": "\u851a\u84dd\u62a4\u624b",
        "/actions/cheesesmithing/azure_sword": "\u851a\u84dd\u5251",
        "/actions/cheesesmithing/azure_brush": "\u851a\u84dd\u5237\u5b50",
        "/actions/cheesesmithing/azure_shears": "\u851a\u84dd\u526a\u5200",
        "/actions/cheesesmithing/azure_hatchet": "\u851a\u84dd\u65a7\u5934",
        "/actions/cheesesmithing/azure_spear": "\u851a\u84dd\u957f\u67aa",
        "/actions/cheesesmithing/azure_hammer": "\u851a\u84dd\u9524\u5b50",
        "/actions/cheesesmithing/azure_chisel": "\u851a\u84dd\u51ff\u5b50",
        "/actions/cheesesmithing/azure_needle": "\u851a\u84dd\u9488",
        "/actions/cheesesmithing/azure_spatula": "\u851a\u84dd\u9505\u94f2",
        "/actions/cheesesmithing/azure_pot": "\u851a\u84dd\u58f6",
        "/actions/cheesesmithing/azure_mace": "\u851a\u84dd\u9489\u5934\u9524",
        "/actions/cheesesmithing/pincer_gloves": "\u87f9\u94b3\u624b\u5957",
        "/actions/cheesesmithing/azure_alembic": "\u851a\u84dd\u84b8\u998f\u5668",
        "/actions/cheesesmithing/azure_enhancer": "\u851a\u84dd\u5f3a\u5316\u5668",
        "/actions/cheesesmithing/azure_helmet": "\u851a\u84dd\u5934\u76d4",
        "/actions/cheesesmithing/azure_buckler": "\u851a\u84dd\u5706\u76fe",
        "/actions/cheesesmithing/azure_bulwark": "\u851a\u84dd\u91cd\u76fe",
        "/actions/cheesesmithing/azure_plate_legs": "\u851a\u84dd\u817f\u7532",
        "/actions/cheesesmithing/snail_shell_helmet": "\u8717\u725b\u58f3\u5934\u76d4",
        "/actions/cheesesmithing/azure_plate_body": "\u851a\u84dd\u80f8\u7532",
        "/actions/cheesesmithing/turtle_shell_legs": "\u9f9f\u58f3\u817f\u7532",
        "/actions/cheesesmithing/turtle_shell_body": "\u9f9f\u58f3\u80f8\u7532",
        "/actions/cheesesmithing/burble_cheese": "\u6df1\u7d2b\u5976\u916a",
        "/actions/cheesesmithing/burble_boots": "\u6df1\u7d2b\u9774",
        "/actions/cheesesmithing/burble_gauntlets": "\u6df1\u7d2b\u62a4\u624b",
        "/actions/cheesesmithing/burble_sword": "\u6df1\u7d2b\u5251",
        "/actions/cheesesmithing/burble_brush": "\u6df1\u7d2b\u5237\u5b50",
        "/actions/cheesesmithing/burble_shears": "\u6df1\u7d2b\u526a\u5200",
        "/actions/cheesesmithing/burble_hatchet": "\u6df1\u7d2b\u65a7\u5934",
        "/actions/cheesesmithing/burble_spear": "\u6df1\u7d2b\u957f\u67aa",
        "/actions/cheesesmithing/burble_hammer": "\u6df1\u7d2b\u9524\u5b50",
        "/actions/cheesesmithing/burble_chisel": "\u6df1\u7d2b\u51ff\u5b50",
        "/actions/cheesesmithing/burble_needle": "\u6df1\u7d2b\u9488",
        "/actions/cheesesmithing/burble_spatula": "\u6df1\u7d2b\u9505\u94f2",
        "/actions/cheesesmithing/burble_pot": "\u6df1\u7d2b\u58f6",
        "/actions/cheesesmithing/burble_mace": "\u6df1\u7d2b\u9489\u5934\u9524",
        "/actions/cheesesmithing/burble_alembic": "\u6df1\u7d2b\u84b8\u998f\u5668",
        "/actions/cheesesmithing/burble_enhancer": "\u6df1\u7d2b\u5f3a\u5316\u5668",
        "/actions/cheesesmithing/burble_helmet": "\u6df1\u7d2b\u5934\u76d4",
        "/actions/cheesesmithing/burble_buckler": "\u6df1\u7d2b\u5706\u76fe",
        "/actions/cheesesmithing/burble_bulwark": "\u6df1\u7d2b\u91cd\u76fe",
        "/actions/cheesesmithing/burble_plate_legs": "\u6df1\u7d2b\u817f\u7532",
        "/actions/cheesesmithing/burble_plate_body": "\u6df1\u7d2b\u80f8\u7532",
        "/actions/cheesesmithing/crimson_cheese": "\u7edb\u7ea2\u5976\u916a",
        "/actions/cheesesmithing/crimson_boots": "\u7edb\u7ea2\u9774",
        "/actions/cheesesmithing/crimson_gauntlets": "\u7edb\u7ea2\u62a4\u624b",
        "/actions/cheesesmithing/crimson_sword": "\u7edb\u7ea2\u5251",
        "/actions/cheesesmithing/crimson_brush": "\u7edb\u7ea2\u5237\u5b50",
        "/actions/cheesesmithing/crimson_shears": "\u7edb\u7ea2\u526a\u5200",
        "/actions/cheesesmithing/crimson_hatchet": "\u7edb\u7ea2\u65a7\u5934",
        "/actions/cheesesmithing/crimson_spear": "\u7edb\u7ea2\u957f\u67aa",
        "/actions/cheesesmithing/crimson_hammer": "\u7edb\u7ea2\u9524\u5b50",
        "/actions/cheesesmithing/crimson_chisel": "\u7edb\u7ea2\u51ff\u5b50",
        "/actions/cheesesmithing/crimson_needle": "\u7edb\u7ea2\u9488",
        "/actions/cheesesmithing/crimson_spatula": "\u7edb\u7ea2\u9505\u94f2",
        "/actions/cheesesmithing/crimson_pot": "\u7edb\u7ea2\u58f6",
        "/actions/cheesesmithing/crimson_mace": "\u7edb\u7ea2\u9489\u5934\u9524",
        "/actions/cheesesmithing/crimson_alembic": "\u7edb\u7ea2\u84b8\u998f\u5668",
        "/actions/cheesesmithing/crimson_enhancer": "\u7edb\u7ea2\u5f3a\u5316\u5668",
        "/actions/cheesesmithing/crimson_helmet": "\u7edb\u7ea2\u5934\u76d4",
        "/actions/cheesesmithing/crimson_buckler": "\u7edb\u7ea2\u5706\u76fe",
        "/actions/cheesesmithing/crimson_bulwark": "\u7edb\u7ea2\u91cd\u76fe",
        "/actions/cheesesmithing/crimson_plate_legs": "\u7edb\u7ea2\u817f\u7532",
        "/actions/cheesesmithing/vision_helmet": "\u89c6\u89c9\u5934\u76d4",
        "/actions/cheesesmithing/vision_shield": "\u89c6\u89c9\u76fe",
        "/actions/cheesesmithing/crimson_plate_body": "\u7edb\u7ea2\u80f8\u7532",
        "/actions/cheesesmithing/rainbow_cheese": "\u5f69\u8679\u5976\u916a",
        "/actions/cheesesmithing/rainbow_boots": "\u5f69\u8679\u9774",
        "/actions/cheesesmithing/black_bear_shoes": "\u9ed1\u718a\u978b",
        "/actions/cheesesmithing/grizzly_bear_shoes": "\u68d5\u718a\u978b",
        "/actions/cheesesmithing/polar_bear_shoes": "\u5317\u6781\u718a\u978b",
        "/actions/cheesesmithing/rainbow_gauntlets": "\u5f69\u8679\u62a4\u624b",
        "/actions/cheesesmithing/rainbow_sword": "\u5f69\u8679\u5251",
        "/actions/cheesesmithing/panda_gloves": "\u718a\u732b\u624b\u5957",
        "/actions/cheesesmithing/rainbow_brush": "\u5f69\u8679\u5237\u5b50",
        "/actions/cheesesmithing/rainbow_shears": "\u5f69\u8679\u526a\u5200",
        "/actions/cheesesmithing/rainbow_hatchet": "\u5f69\u8679\u65a7\u5934",
        "/actions/cheesesmithing/rainbow_spear": "\u5f69\u8679\u957f\u67aa",
        "/actions/cheesesmithing/rainbow_hammer": "\u5f69\u8679\u9524\u5b50",
        "/actions/cheesesmithing/rainbow_chisel": "\u5f69\u8679\u51ff\u5b50",
        "/actions/cheesesmithing/rainbow_needle": "\u5f69\u8679\u9488",
        "/actions/cheesesmithing/rainbow_spatula": "\u5f69\u8679\u9505\u94f2",
        "/actions/cheesesmithing/rainbow_pot": "\u5f69\u8679\u58f6",
        "/actions/cheesesmithing/rainbow_mace": "\u5f69\u8679\u9489\u5934\u9524",
        "/actions/cheesesmithing/rainbow_alembic": "\u5f69\u8679\u84b8\u998f\u5668",
        "/actions/cheesesmithing/rainbow_enhancer": "\u5f69\u8679\u5f3a\u5316\u5668",
        "/actions/cheesesmithing/rainbow_helmet": "\u5f69\u8679\u5934\u76d4",
        "/actions/cheesesmithing/rainbow_buckler": "\u5f69\u8679\u5706\u76fe",
        "/actions/cheesesmithing/rainbow_bulwark": "\u5f69\u8679\u91cd\u76fe",
        "/actions/cheesesmithing/rainbow_plate_legs": "\u5f69\u8679\u817f\u7532",
        "/actions/cheesesmithing/rainbow_plate_body": "\u5f69\u8679\u80f8\u7532",
        "/actions/cheesesmithing/holy_cheese": "\u795e\u5723\u5976\u916a",
        "/actions/cheesesmithing/holy_boots": "\u795e\u5723\u9774",
        "/actions/cheesesmithing/holy_gauntlets": "\u795e\u5723\u62a4\u624b",
        "/actions/cheesesmithing/holy_sword": "\u795e\u5723\u5251",
        "/actions/cheesesmithing/holy_brush": "\u795e\u5723\u5237\u5b50",
        "/actions/cheesesmithing/holy_shears": "\u795e\u5723\u526a\u5200",
        "/actions/cheesesmithing/holy_hatchet": "\u795e\u5723\u65a7\u5934",
        "/actions/cheesesmithing/holy_spear": "\u795e\u5723\u957f\u67aa",
        "/actions/cheesesmithing/holy_hammer": "\u795e\u5723\u9524\u5b50",
        "/actions/cheesesmithing/holy_chisel": "\u795e\u5723\u51ff\u5b50",
        "/actions/cheesesmithing/holy_needle": "\u795e\u5723\u9488",
        "/actions/cheesesmithing/holy_spatula": "\u795e\u5723\u9505\u94f2",
        "/actions/cheesesmithing/holy_pot": "\u795e\u5723\u58f6",
        "/actions/cheesesmithing/holy_mace": "\u795e\u5723\u9489\u5934\u9524",
        "/actions/cheesesmithing/magnetic_gloves": "\u78c1\u529b\u624b\u5957",
        "/actions/cheesesmithing/stalactite_spear": "\u77f3\u949f\u957f\u67aa",
        "/actions/cheesesmithing/granite_bludgeon": "\u82b1\u5c97\u5ca9\u5927\u68d2",
        "/actions/cheesesmithing/vampire_fang_dirk": "\u5438\u8840\u9b3c\u77ed\u5251",
        "/actions/cheesesmithing/werewolf_slasher": "\u72fc\u4eba\u5173\u5200",
        "/actions/cheesesmithing/holy_alembic": "\u795e\u5723\u84b8\u998f\u5668",
        "/actions/cheesesmithing/holy_enhancer": "\u795e\u5723\u5f3a\u5316\u5668",
        "/actions/cheesesmithing/holy_helmet": "\u795e\u5723\u5934\u76d4",
        "/actions/cheesesmithing/holy_buckler": "\u795e\u5723\u5706\u76fe",
        "/actions/cheesesmithing/holy_bulwark": "\u795e\u5723\u91cd\u76fe",
        "/actions/cheesesmithing/holy_plate_legs": "\u795e\u5723\u817f\u7532",
        "/actions/cheesesmithing/holy_plate_body": "\u795e\u5723\u80f8\u7532",
        "/actions/cheesesmithing/celestial_brush": "\u661f\u7a7a\u5237\u5b50",
        "/actions/cheesesmithing/celestial_shears": "\u661f\u7a7a\u526a\u5200",
        "/actions/cheesesmithing/celestial_hatchet": "\u661f\u7a7a\u65a7\u5934",
        "/actions/cheesesmithing/celestial_hammer": "\u661f\u7a7a\u9524\u5b50",
        "/actions/cheesesmithing/celestial_chisel": "\u661f\u7a7a\u51ff\u5b50",
        "/actions/cheesesmithing/celestial_needle": "\u661f\u7a7a\u9488",
        "/actions/cheesesmithing/celestial_spatula": "\u661f\u7a7a\u9505\u94f2",
        "/actions/cheesesmithing/celestial_pot": "\u661f\u7a7a\u58f6",
        "/actions/cheesesmithing/celestial_alembic": "\u661f\u7a7a\u84b8\u998f\u5668",
        "/actions/cheesesmithing/celestial_enhancer": "\u661f\u7a7a\u5f3a\u5316\u5668",
        "/actions/cheesesmithing/colossus_plate_body": "\u5de8\u50cf\u80f8\u7532",
        "/actions/cheesesmithing/colossus_plate_legs": "\u5de8\u50cf\u817f\u7532",
        "/actions/cheesesmithing/demonic_plate_body": "\u6076\u9b54\u80f8\u7532",
        "/actions/cheesesmithing/demonic_plate_legs": "\u6076\u9b54\u817f\u7532",
        "/actions/cheesesmithing/spiked_bulwark": "\u5c16\u523a\u91cd\u76fe",
        "/actions/cheesesmithing/dodocamel_gauntlets": "\u6e21\u6e21\u9a7c\u62a4\u624b",
        "/actions/cheesesmithing/knights_aegis": "\u9a91\u58eb\u76fe",
        "/actions/cheesesmithing/griffin_bulwark": "\u72ee\u9e6b\u91cd\u76fe",
        "/actions/cheesesmithing/chaotic_flail": "\u6df7\u6c8c\u8fde\u67b7",
        "/actions/cheesesmithing/regal_sword": "\u541b\u738b\u4e4b\u5251",
        "/actions/crafting/lumber": "\u6728\u677f",
        "/actions/crafting/wooden_crossbow": "\u6728\u5f29",
        "/actions/crafting/wooden_water_staff": "\u6728\u5236\u6c34\u6cd5\u6756",
        "/actions/crafting/basic_task_badge": "\u57fa\u7840\u4efb\u52a1\u5fbd\u7ae0",
        "/actions/crafting/advanced_task_badge": "\u9ad8\u7ea7\u4efb\u52a1\u5fbd\u7ae0",
        "/actions/crafting/expert_task_badge": "\u4e13\u5bb6\u4efb\u52a1\u5fbd\u7ae0",
        "/actions/crafting/wooden_shield": "\u6728\u76fe",
        "/actions/crafting/wooden_nature_staff": "\u6728\u5236\u81ea\u7136\u6cd5\u6756",
        "/actions/crafting/wooden_bow": "\u6728\u5f13",
        "/actions/crafting/wooden_fire_staff": "\u6728\u5236\u706b\u6cd5\u6756",
        "/actions/crafting/birch_lumber": "\u767d\u6866\u6728\u677f",
        "/actions/crafting/birch_crossbow": "\u6866\u6728\u5f29",
        "/actions/crafting/birch_water_staff": "\u6866\u6728\u6c34\u6cd5\u6756",
        "/actions/crafting/crushed_pearl": "\u73cd\u73e0\u788e\u7247",
        "/actions/crafting/birch_shield": "\u6866\u6728\u76fe",
        "/actions/crafting/birch_nature_staff": "\u6866\u6728\u81ea\u7136\u6cd5\u6756",
        "/actions/crafting/birch_bow": "\u6866\u6728\u5f13",
        "/actions/crafting/ring_of_gathering": "\u91c7\u96c6\u6212\u6307",
        "/actions/crafting/birch_fire_staff": "\u6866\u6728\u706b\u6cd5\u6756",
        "/actions/crafting/earrings_of_gathering": "\u91c7\u96c6\u8033\u73af",
        "/actions/crafting/cedar_lumber": "\u96ea\u677e\u6728\u677f",
        "/actions/crafting/cedar_crossbow": "\u96ea\u677e\u5f29",
        "/actions/crafting/cedar_water_staff": "\u96ea\u677e\u6c34\u6cd5\u6756",
        "/actions/crafting/cedar_shield": "\u96ea\u677e\u76fe",
        "/actions/crafting/cedar_nature_staff": "\u96ea\u677e\u81ea\u7136\u6cd5\u6756",
        "/actions/crafting/cedar_bow": "\u96ea\u677e\u5f13",
        "/actions/crafting/crushed_amber": "\u7425\u73c0\u788e\u7247",
        "/actions/crafting/cedar_fire_staff": "\u96ea\u677e\u706b\u6cd5\u6756",
        "/actions/crafting/ring_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u6212\u6307",
        "/actions/crafting/earrings_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u8033\u73af",
        "/actions/crafting/necklace_of_efficiency": "\u6548\u7387\u9879\u94fe",
        "/actions/crafting/purpleheart_lumber": "\u7d2b\u5fc3\u6728\u677f",
        "/actions/crafting/purpleheart_crossbow": "\u7d2b\u5fc3\u5f29",
        "/actions/crafting/purpleheart_water_staff": "\u7d2b\u5fc3\u6c34\u6cd5\u6756",
        "/actions/crafting/purpleheart_shield": "\u7d2b\u5fc3\u76fe",
        "/actions/crafting/purpleheart_nature_staff": "\u7d2b\u5fc3\u81ea\u7136\u6cd5\u6756",
        "/actions/crafting/purpleheart_bow": "\u7d2b\u5fc3\u5f13",
        "/actions/crafting/crushed_garnet": "\u77f3\u69b4\u77f3\u788e\u7247",
        "/actions/crafting/crushed_jade": "\u7fe1\u7fe0\u788e\u7247",
        "/actions/crafting/crushed_amethyst": "\u7d2b\u6c34\u6676\u788e\u7247",
        "/actions/crafting/catalyst_of_coinification": "\u70b9\u91d1\u50ac\u5316\u5242",
        "/actions/crafting/treant_shield": "\u6811\u4eba\u76fe",
        "/actions/crafting/purpleheart_fire_staff": "\u7d2b\u5fc3\u706b\u6cd5\u6756",
        "/actions/crafting/ring_of_regeneration": "\u6062\u590d\u6212\u6307",
        "/actions/crafting/earrings_of_regeneration": "\u6062\u590d\u8033\u73af",
        "/actions/crafting/fighter_necklace": "\u6218\u58eb\u9879\u94fe",
        "/actions/crafting/ginkgo_lumber": "\u94f6\u674f\u6728\u677f",
        "/actions/crafting/ginkgo_crossbow": "\u94f6\u674f\u5f29",
        "/actions/crafting/ginkgo_water_staff": "\u94f6\u674f\u6c34\u6cd5\u6756",
        "/actions/crafting/ring_of_armor": "\u62a4\u7532\u6212\u6307",
        "/actions/crafting/catalyst_of_decomposition": "\u5206\u89e3\u50ac\u5316\u5242",
        "/actions/crafting/ginkgo_shield": "\u94f6\u674f\u76fe",
        "/actions/crafting/earrings_of_armor": "\u62a4\u7532\u8033\u73af",
        "/actions/crafting/ginkgo_nature_staff": "\u94f6\u674f\u81ea\u7136\u6cd5\u6756",
        "/actions/crafting/ranger_necklace": "\u5c04\u624b\u9879\u94fe",
        "/actions/crafting/ginkgo_bow": "\u94f6\u674f\u5f13",
        "/actions/crafting/ring_of_resistance": "\u6297\u6027\u6212\u6307",
        "/actions/crafting/crushed_moonstone": "\u6708\u4eae\u77f3\u788e\u7247",
        "/actions/crafting/ginkgo_fire_staff": "\u94f6\u674f\u706b\u6cd5\u6756",
        "/actions/crafting/earrings_of_resistance": "\u6297\u6027\u8033\u73af",
        "/actions/crafting/wizard_necklace": "\u5deb\u5e08\u9879\u94fe",
        "/actions/crafting/ring_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u6212\u6307",
        "/actions/crafting/catalyst_of_transmutation": "\u8f6c\u5316\u50ac\u5316\u5242",
        "/actions/crafting/earrings_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u8033\u73af",
        "/actions/crafting/necklace_of_wisdom": "\u7ecf\u9a8c\u9879\u94fe",
        "/actions/crafting/redwood_lumber": "\u7ea2\u6749\u6728\u677f",
        "/actions/crafting/redwood_crossbow": "\u7ea2\u6749\u5f29",
        "/actions/crafting/redwood_water_staff": "\u7ea2\u6749\u6c34\u6cd5\u6756",
        "/actions/crafting/redwood_shield": "\u7ea2\u6749\u76fe",
        "/actions/crafting/redwood_nature_staff": "\u7ea2\u6749\u81ea\u7136\u6cd5\u6756",
        "/actions/crafting/redwood_bow": "\u7ea2\u6749\u5f13",
        "/actions/crafting/crushed_sunstone": "\u592a\u9633\u77f3\u788e\u7247",
        "/actions/crafting/chimerical_entry_key": "\u5947\u5e7b\u94a5\u5319",
        "/actions/crafting/chimerical_chest_key": "\u5947\u5e7b\u5b9d\u7bb1\u94a5\u5319",
        "/actions/crafting/eye_watch": "\u638c\u4e0a\u76d1\u5de5",
        "/actions/crafting/watchful_relic": "\u8b66\u6212\u9057\u7269",
        "/actions/crafting/redwood_fire_staff": "\u7ea2\u6749\u706b\u6cd5\u6756",
        "/actions/crafting/ring_of_critical_strike": "\u66b4\u51fb\u6212\u6307",
        "/actions/crafting/mirror_of_protection": "\u4fdd\u62a4\u4e4b\u955c",
        "/actions/crafting/earrings_of_critical_strike": "\u66b4\u51fb\u8033\u73af",
        "/actions/crafting/necklace_of_speed": "\u901f\u5ea6\u9879\u94fe",
        "/actions/crafting/arcane_lumber": "\u795e\u79d8\u6728\u677f",
        "/actions/crafting/arcane_crossbow": "\u795e\u79d8\u5f29",
        "/actions/crafting/arcane_water_staff": "\u795e\u79d8\u6c34\u6cd5\u6756",
        "/actions/crafting/sinister_entry_key": "\u9634\u68ee\u94a5\u5319",
        "/actions/crafting/sinister_chest_key": "\u9634\u68ee\u5b9d\u7bb1\u94a5\u5319",
        "/actions/crafting/arcane_shield": "\u795e\u79d8\u76fe",
        "/actions/crafting/arcane_nature_staff": "\u795e\u79d8\u81ea\u7136\u6cd5\u6756",
        "/actions/crafting/manticore_shield": "\u874e\u72ee\u76fe",
        "/actions/crafting/arcane_bow": "\u795e\u79d8\u5f13",
        "/actions/crafting/enchanted_entry_key": "\u79d8\u6cd5\u94a5\u5319",
        "/actions/crafting/enchanted_chest_key": "\u79d8\u6cd5\u5b9d\u7bb1\u94a5\u5319",
        "/actions/crafting/arcane_fire_staff": "\u795e\u79d8\u706b\u6cd5\u6756",
        "/actions/crafting/vampiric_bow": "\u5438\u8840\u5f13",
        "/actions/crafting/soul_hunter_crossbow": "\u7075\u9b42\u730e\u624b\u5f29",
        "/actions/crafting/frost_staff": "\u51b0\u971c\u6cd5\u6756",
        "/actions/crafting/infernal_battlestaff": "\u70bc\u72f1\u6cd5\u6756",
        "/actions/crafting/jackalope_staff": "\u9e7f\u89d2\u5154\u4e4b\u6756",
        "/actions/crafting/philosophers_ring": "\u8d24\u8005\u6212\u6307",
        "/actions/crafting/crushed_philosophers_stone": "\u8d24\u8005\u4e4b\u77f3\u788e\u7247",
        "/actions/crafting/philosophers_earrings": "\u8d24\u8005\u8033\u73af",
        "/actions/crafting/philosophers_necklace": "\u8d24\u8005\u9879\u94fe",
        "/actions/crafting/bishops_codex": "\u4e3b\u6559\u6cd5\u5178",
        "/actions/crafting/cursed_bow": "\u5492\u6028\u4e4b\u5f13",
        "/actions/crafting/sundering_crossbow": "\u88c2\u7a7a\u4e4b\u5f29",
        "/actions/tailoring/rough_leather": "\u7c97\u7cd9\u76ae\u9769",
        "/actions/tailoring/cotton_fabric": "\u68c9\u82b1\u5e03\u6599",
        "/actions/tailoring/rough_boots": "\u7c97\u7cd9\u9774",
        "/actions/tailoring/cotton_boots": "\u68c9\u9774",
        "/actions/tailoring/rough_bracers": "\u7c97\u7cd9\u62a4\u8155",
        "/actions/tailoring/cotton_gloves": "\u68c9\u624b\u5957",
        "/actions/tailoring/small_pouch": "\u5c0f\u888b\u5b50",
        "/actions/tailoring/rough_hood": "\u7c97\u7cd9\u515c\u5e3d",
        "/actions/tailoring/cotton_hat": "\u68c9\u5e3d",
        "/actions/tailoring/rough_chaps": "\u7c97\u7cd9\u76ae\u88e4",
        "/actions/tailoring/cotton_robe_bottoms": "\u68c9\u5e03\u888d\u88d9",
        "/actions/tailoring/rough_tunic": "\u7c97\u7cd9\u76ae\u8863",
        "/actions/tailoring/cotton_robe_top": "\u68c9\u5e03\u888d\u670d",
        "/actions/tailoring/reptile_leather": "\u722c\u884c\u52a8\u7269\u76ae\u9769",
        "/actions/tailoring/linen_fabric": "\u4e9a\u9ebb\u5e03\u6599",
        "/actions/tailoring/reptile_boots": "\u722c\u884c\u52a8\u7269\u9774",
        "/actions/tailoring/linen_boots": "\u4e9a\u9ebb\u9774",
        "/actions/tailoring/reptile_bracers": "\u722c\u884c\u52a8\u7269\u62a4\u8155",
        "/actions/tailoring/linen_gloves": "\u4e9a\u9ebb\u624b\u5957",
        "/actions/tailoring/reptile_hood": "\u722c\u884c\u52a8\u7269\u515c\u5e3d",
        "/actions/tailoring/linen_hat": "\u4e9a\u9ebb\u5e3d",
        "/actions/tailoring/reptile_chaps": "\u722c\u884c\u52a8\u7269\u76ae\u88e4",
        "/actions/tailoring/linen_robe_bottoms": "\u4e9a\u9ebb\u888d\u88d9",
        "/actions/tailoring/medium_pouch": "\u4e2d\u888b\u5b50",
        "/actions/tailoring/reptile_tunic": "\u722c\u884c\u52a8\u7269\u76ae\u8863",
        "/actions/tailoring/linen_robe_top": "\u4e9a\u9ebb\u888d\u670d",
        "/actions/tailoring/shoebill_shoes": "\u9cb8\u5934\u9e73\u978b",
        "/actions/tailoring/gobo_leather": "\u54e5\u5e03\u6797\u76ae\u9769",
        "/actions/tailoring/bamboo_fabric": "\u7af9\u5b50\u5e03\u6599",
        "/actions/tailoring/gobo_boots": "\u54e5\u5e03\u6797\u9774",
        "/actions/tailoring/bamboo_boots": "\u7af9\u9774",
        "/actions/tailoring/gobo_bracers": "\u54e5\u5e03\u6797\u62a4\u8155",
        "/actions/tailoring/bamboo_gloves": "\u7af9\u624b\u5957",
        "/actions/tailoring/gobo_hood": "\u54e5\u5e03\u6797\u515c\u5e3d",
        "/actions/tailoring/bamboo_hat": "\u7af9\u5e3d",
        "/actions/tailoring/gobo_chaps": "\u54e5\u5e03\u6797\u76ae\u88e4",
        "/actions/tailoring/bamboo_robe_bottoms": "\u7af9\u5e03\u888d\u88d9",
        "/actions/tailoring/large_pouch": "\u5927\u888b\u5b50",
        "/actions/tailoring/gobo_tunic": "\u54e5\u5e03\u6797\u76ae\u8863",
        "/actions/tailoring/bamboo_robe_top": "\u7af9\u888d\u670d",
        "/actions/tailoring/marine_tunic": "\u6d77\u6d0b\u76ae\u8863",
        "/actions/tailoring/marine_chaps": "\u822a\u6d77\u76ae\u88e4",
        "/actions/tailoring/icy_robe_top": "\u51b0\u971c\u888d\u670d",
        "/actions/tailoring/icy_robe_bottoms": "\u51b0\u971c\u888d\u88d9",
        "/actions/tailoring/flaming_robe_top": "\u70c8\u7130\u888d\u670d",
        "/actions/tailoring/flaming_robe_bottoms": "\u70c8\u7130\u888d\u88d9",
        "/actions/tailoring/beast_leather": "\u91ce\u517d\u76ae\u9769",
        "/actions/tailoring/silk_fabric": "\u4e1d\u7ef8",
        "/actions/tailoring/beast_boots": "\u91ce\u517d\u9774",
        "/actions/tailoring/silk_boots": "\u4e1d\u9774",
        "/actions/tailoring/beast_bracers": "\u91ce\u517d\u62a4\u8155",
        "/actions/tailoring/silk_gloves": "\u4e1d\u624b\u5957",
        "/actions/tailoring/collectors_boots": "\u6536\u85cf\u5bb6\u4e4b\u9774",
        "/actions/tailoring/sighted_bracers": "\u7784\u51c6\u62a4\u8155",
        "/actions/tailoring/beast_hood": "\u91ce\u517d\u515c\u5e3d",
        "/actions/tailoring/silk_hat": "\u4e1d\u5e3d",
        "/actions/tailoring/beast_chaps": "\u91ce\u517d\u76ae\u88e4",
        "/actions/tailoring/silk_robe_bottoms": "\u4e1d\u7ef8\u888d\u88d9",
        "/actions/tailoring/centaur_boots": "\u534a\u4eba\u9a6c\u9774",
        "/actions/tailoring/sorcerer_boots": "\u5deb\u5e08\u9774",
        "/actions/tailoring/giant_pouch": "\u5de8\u5927\u888b\u5b50",
        "/actions/tailoring/beast_tunic": "\u91ce\u517d\u76ae\u8863",
        "/actions/tailoring/silk_robe_top": "\u4e1d\u7ef8\u888d\u670d",
        "/actions/tailoring/red_culinary_hat": "\u7ea2\u8272\u53a8\u5e08\u5e3d",
        "/actions/tailoring/luna_robe_top": "\u6708\u795e\u888d\u670d",
        "/actions/tailoring/luna_robe_bottoms": "\u6708\u795e\u888d\u88d9",
        "/actions/tailoring/umbral_leather": "\u6697\u5f71\u76ae\u9769",
        "/actions/tailoring/radiant_fabric": "\u5149\u8f89\u5e03\u6599",
        "/actions/tailoring/umbral_boots": "\u6697\u5f71\u9774",
        "/actions/tailoring/radiant_boots": "\u5149\u8f89\u9774",
        "/actions/tailoring/umbral_bracers": "\u6697\u5f71\u62a4\u8155",
        "/actions/tailoring/radiant_gloves": "\u5149\u8f89\u624b\u5957",
        "/actions/tailoring/enchanted_gloves": "\u9644\u9b54\u624b\u5957",
        "/actions/tailoring/fluffy_red_hat": "\u84ec\u677e\u7ea2\u5e3d\u5b50",
        "/actions/tailoring/chrono_gloves": "\u65f6\u7a7a\u624b\u5957",
        "/actions/tailoring/umbral_hood": "\u6697\u5f71\u515c\u5e3d",
        "/actions/tailoring/radiant_hat": "\u5149\u8f89\u5e3d",
        "/actions/tailoring/umbral_chaps": "\u6697\u5f71\u76ae\u88e4",
        "/actions/tailoring/radiant_robe_bottoms": "\u5149\u8f89\u888d\u88d9",
        "/actions/tailoring/umbral_tunic": "\u6697\u5f71\u76ae\u8863",
        "/actions/tailoring/radiant_robe_top": "\u5149\u8f89\u888d\u670d",
        "/actions/tailoring/revenant_chaps": "\u4ea1\u7075\u76ae\u88e4",
        "/actions/tailoring/griffin_chaps": "\u72ee\u9e6b\u62a4\u817f",
        "/actions/tailoring/dairyhands_top": "\u6324\u5976\u5de5\u4e0a\u8863",
        "/actions/tailoring/dairyhands_bottoms": "\u6324\u5976\u5de5\u4e0b\u88c5",
        "/actions/tailoring/foragers_top": "\u91c7\u6458\u8005\u4e0a\u8863",
        "/actions/tailoring/foragers_bottoms": "\u91c7\u6458\u8005\u4e0b\u88c5",
        "/actions/tailoring/lumberjacks_top": "\u4f10\u6728\u5de5\u4e0a\u8863",
        "/actions/tailoring/lumberjacks_bottoms": "\u4f10\u6728\u5de5\u4e0b\u88c5",
        "/actions/tailoring/cheesemakers_top": "\u5976\u916a\u5e08\u4e0a\u8863",
        "/actions/tailoring/cheesemakers_bottoms": "\u5976\u916a\u5e08\u4e0b\u88c5",
        "/actions/tailoring/crafters_top": "\u5de5\u5320\u4e0a\u8863",
        "/actions/tailoring/crafters_bottoms": "\u5de5\u5320\u4e0b\u88c5",
        "/actions/tailoring/tailors_top": "\u88c1\u7f1d\u4e0a\u8863",
        "/actions/tailoring/tailors_bottoms": "\u88c1\u7f1d\u4e0b\u88c5",
        "/actions/tailoring/chefs_top": "\u53a8\u5e08\u4e0a\u8863",
        "/actions/tailoring/chefs_bottoms": "\u53a8\u5e08\u4e0b\u88c5",
        "/actions/tailoring/brewers_top": "\u996e\u54c1\u5e08\u4e0a\u8863",
        "/actions/tailoring/brewers_bottoms": "\u996e\u54c1\u5e08\u4e0b\u88c5",
        "/actions/tailoring/alchemists_top": "\u70bc\u91d1\u5e08\u7684\u4e0a\u8863",
        "/actions/tailoring/alchemists_bottoms": "\u70bc\u91d1\u5e08\u4e0b\u88c5",
        "/actions/tailoring/enhancers_top": "\u5f3a\u5316\u5e08\u4e0a\u8863",
        "/actions/tailoring/enhancers_bottoms": "\u5f3a\u5316\u5e08\u4e0b\u88c5",
        "/actions/tailoring/revenant_tunic": "\u4ea1\u7075\u76ae\u8863",
        "/actions/tailoring/griffin_tunic": "\u72ee\u9e6b\u76ae\u8863",
        "/actions/tailoring/gluttonous_pouch": "\u8d2a\u98df\u4e4b\u888b",
        "/actions/tailoring/guzzling_pouch": "\u66b4\u996e\u4e4b\u56ca",
        "/actions/tailoring/acrobatic_hood": "\u6742\u6280\u5e08\u515c\u5e3d",
        "/actions/tailoring/magicians_hat": "\u9b54\u672f\u5e08\u4e4b\u5e3d",
        "/actions/tailoring/royal_water_robe_bottoms": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9",
        "/actions/tailoring/royal_water_robe_bottoms_from_nature": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9 (\u4ece\u81ea\u7136\u7cfb\u88c1\u6539)",
        "/actions/tailoring/royal_water_robe_bottoms_from_fire": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9 (\u4ece\u706b\u7cfb\u88c1\u6539)",
        "/actions/tailoring/royal_nature_robe_bottoms": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9",
        "/actions/tailoring/royal_nature_robe_bottoms_from_water": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9 (\u4ece\u6c34\u7cfb\u88c1\u6539)",
        "/actions/tailoring/royal_nature_robe_bottoms_from_fire": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9 (\u4ece\u706b\u7cfb\u88c1\u6539)",
        "/actions/tailoring/royal_fire_robe_bottoms": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9",
        "/actions/tailoring/royal_fire_robe_bottoms_from_water": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9 (\u4ece\u6c34\u7cfb\u88c1\u6539)",
        "/actions/tailoring/royal_fire_robe_bottoms_from_nature": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9 (\u4ece\u81ea\u7136\u7cfb\u88c1\u6539)",
        "/actions/tailoring/royal_water_robe_top": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d",
        "/actions/tailoring/royal_water_robe_top_from_nature": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d (\u4ece\u81ea\u7136\u7cfb\u88c1\u6539)",
        "/actions/tailoring/royal_water_robe_top_from_fire": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d (\u4ece\u706b\u7cfb\u88c1\u6539)",
        "/actions/tailoring/royal_nature_robe_top": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d",
        "/actions/tailoring/royal_nature_robe_top_from_water": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d (\u4ece\u81ea\u7136\u7cfb\u88c1\u6539)",
        "/actions/tailoring/royal_nature_robe_top_from_fire": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d (\u4ece\u706b\u7cfb\u88c1\u6539)",
        "/actions/tailoring/royal_fire_robe_top": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d",
        "/actions/tailoring/royal_fire_robe_top_from_water": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d (\u4ece\u6c34\u7cfb\u88c1\u6539)",
        "/actions/tailoring/royal_fire_robe_top_from_nature": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d (\u4ece\u81ea\u7136\u7cfb\u88c1\u6539)",
        "/actions/cooking/donut": "\u751c\u751c\u5708",
        "/actions/cooking/cupcake": "\u7eb8\u676f\u86cb\u7cd5",
        "/actions/cooking/gummy": "\u8f6f\u7cd6",
        "/actions/cooking/yogurt": "\u9178\u5976",
        "/actions/cooking/blueberry_donut": "\u84dd\u8393\u751c\u751c\u5708",
        "/actions/cooking/blueberry_cake": "\u84dd\u8393\u86cb\u7cd5",
        "/actions/cooking/apple_gummy": "\u82f9\u679c\u8f6f\u7cd6",
        "/actions/cooking/apple_yogurt": "\u82f9\u679c\u9178\u5976",
        "/actions/cooking/blackberry_donut": "\u9ed1\u8393\u751c\u751c\u5708",
        "/actions/cooking/blackberry_cake": "\u9ed1\u8393\u86cb\u7cd5",
        "/actions/cooking/orange_gummy": "\u6a59\u5b50\u8f6f\u7cd6",
        "/actions/cooking/orange_yogurt": "\u6a59\u5b50\u9178\u5976",
        "/actions/cooking/strawberry_donut": "\u8349\u8393\u751c\u751c\u5708",
        "/actions/cooking/strawberry_cake": "\u8349\u8393\u86cb\u7cd5",
        "/actions/cooking/plum_gummy": "\u674e\u5b50\u8f6f\u7cd6",
        "/actions/cooking/plum_yogurt": "\u674e\u5b50\u9178\u5976",
        "/actions/cooking/mooberry_donut": "\u54de\u8393\u751c\u751c\u5708",
        "/actions/cooking/mooberry_cake": "\u54de\u8393\u86cb\u7cd5",
        "/actions/cooking/peach_gummy": "\u6843\u5b50\u8f6f\u7cd6",
        "/actions/cooking/peach_yogurt": "\u6843\u5b50\u9178\u5976",
        "/actions/cooking/marsberry_donut": "\u706b\u661f\u8393\u751c\u751c\u5708",
        "/actions/cooking/marsberry_cake": "\u706b\u661f\u8393\u86cb\u7cd5",
        "/actions/cooking/dragon_fruit_gummy": "\u706b\u9f99\u679c\u8f6f\u7cd6",
        "/actions/cooking/dragon_fruit_yogurt": "\u706b\u9f99\u679c\u9178\u5976",
        "/actions/cooking/spaceberry_donut": "\u592a\u7a7a\u8393\u751c\u751c\u5708",
        "/actions/cooking/spaceberry_cake": "\u592a\u7a7a\u8393\u86cb\u7cd5",
        "/actions/cooking/star_fruit_gummy": "\u6768\u6843\u8f6f\u7cd6",
        "/actions/cooking/star_fruit_yogurt": "\u6768\u6843\u9178\u5976",
        "/actions/brewing/milking_tea": "\u6324\u5976\u8336",
        "/actions/brewing/stamina_coffee": "\u8010\u529b\u5496\u5561",
        "/actions/brewing/foraging_tea": "\u91c7\u6458\u8336",
        "/actions/brewing/intelligence_coffee": "\u667a\u529b\u5496\u5561",
        "/actions/brewing/gathering_tea": "\u91c7\u96c6\u8336",
        "/actions/brewing/woodcutting_tea": "\u4f10\u6728\u8336",
        "/actions/brewing/cooking_tea": "\u70f9\u996a\u8336",
        "/actions/brewing/defense_coffee": "\u9632\u5fa1\u5496\u5561",
        "/actions/brewing/brewing_tea": "\u51b2\u6ce1\u8336",
        "/actions/brewing/attack_coffee": "\u653b\u51fb\u5496\u5561",
        "/actions/brewing/gourmet_tea": "\u7f8e\u98df\u8336",
        "/actions/brewing/alchemy_tea": "\u70bc\u91d1\u8336",
        "/actions/brewing/enhancing_tea": "\u5f3a\u5316\u8336",
        "/actions/brewing/cheesesmithing_tea": "\u5976\u916a\u953b\u9020\u8336",
        "/actions/brewing/power_coffee": "\u529b\u91cf\u5496\u5561",
        "/actions/brewing/crafting_tea": "\u5236\u4f5c\u8336",
        "/actions/brewing/ranged_coffee": "\u8fdc\u7a0b\u5496\u5561",
        "/actions/brewing/wisdom_tea": "\u7ecf\u9a8c\u8336",
        "/actions/brewing/wisdom_coffee": "\u7ecf\u9a8c\u5496\u5561",
        "/actions/brewing/tailoring_tea": "\u7f1d\u7eab\u8336",
        "/actions/brewing/magic_coffee": "\u9b54\u6cd5\u5496\u5561",
        "/actions/brewing/super_milking_tea": "\u8d85\u7ea7\u6324\u5976\u8336",
        "/actions/brewing/super_stamina_coffee": "\u8d85\u7ea7\u8010\u529b\u5496\u5561",
        "/actions/brewing/super_foraging_tea": "\u8d85\u7ea7\u91c7\u6458\u8336",
        "/actions/brewing/super_intelligence_coffee": "\u8d85\u7ea7\u667a\u529b\u5496\u5561",
        "/actions/brewing/processing_tea": "\u52a0\u5de5\u8336",
        "/actions/brewing/lucky_coffee": "\u5e78\u8fd0\u5496\u5561",
        "/actions/brewing/super_woodcutting_tea": "\u8d85\u7ea7\u4f10\u6728\u8336",
        "/actions/brewing/super_cooking_tea": "\u8d85\u7ea7\u70f9\u996a\u8336",
        "/actions/brewing/super_defense_coffee": "\u8d85\u7ea7\u9632\u5fa1\u5496\u5561",
        "/actions/brewing/super_brewing_tea": "\u8d85\u7ea7\u51b2\u6ce1\u8336",
        "/actions/brewing/ultra_milking_tea": "\u7a76\u6781\u6324\u5976\u8336",
        "/actions/brewing/super_attack_coffee": "\u8d85\u7ea7\u653b\u51fb\u5496\u5561",
        "/actions/brewing/ultra_stamina_coffee": "\u7a76\u6781\u8010\u529b\u5496\u5561",
        "/actions/brewing/efficiency_tea": "\u6548\u7387\u8336",
        "/actions/brewing/swiftness_coffee": "\u8fc5\u6377\u5496\u5561",
        "/actions/brewing/super_alchemy_tea": "\u8d85\u7ea7\u70bc\u91d1\u8336",
        "/actions/brewing/super_enhancing_tea": "\u8d85\u7ea7\u5f3a\u5316\u8336",
        "/actions/brewing/ultra_foraging_tea": "\u7a76\u6781\u91c7\u6458\u8336",
        "/actions/brewing/ultra_intelligence_coffee": "\u7a76\u6781\u667a\u529b\u5496\u5561",
        "/actions/brewing/channeling_coffee": "\u541f\u5531\u5496\u5561",
        "/actions/brewing/super_cheesesmithing_tea": "\u8d85\u7ea7\u5976\u916a\u953b\u9020\u8336",
        "/actions/brewing/ultra_woodcutting_tea": "\u7a76\u6781\u4f10\u6728\u8336",
        "/actions/brewing/super_power_coffee": "\u8d85\u7ea7\u529b\u91cf\u5496\u5561",
        "/actions/brewing/artisan_tea": "\u5de5\u5320\u8336",
        "/actions/brewing/super_crafting_tea": "\u8d85\u7ea7\u5236\u4f5c\u8336",
        "/actions/brewing/ultra_cooking_tea": "\u7a76\u6781\u70f9\u996a\u8336",
        "/actions/brewing/super_ranged_coffee": "\u8d85\u7ea7\u8fdc\u7a0b\u5496\u5561",
        "/actions/brewing/ultra_defense_coffee": "\u7a76\u6781\u9632\u5fa1\u5496\u5561",
        "/actions/brewing/catalytic_tea": "\u50ac\u5316\u8336",
        "/actions/brewing/critical_coffee": "\u66b4\u51fb\u5496\u5561",
        "/actions/brewing/super_tailoring_tea": "\u8d85\u7ea7\u7f1d\u7eab\u8336",
        "/actions/brewing/ultra_brewing_tea": "\u7a76\u6781\u51b2\u6ce1\u8336",
        "/actions/brewing/super_magic_coffee": "\u8d85\u7ea7\u9b54\u6cd5\u5496\u5561",
        "/actions/brewing/ultra_attack_coffee": "\u7a76\u6781\u653b\u51fb\u5496\u5561",
        "/actions/brewing/blessed_tea": "\u798f\u6c14\u8336",
        "/actions/brewing/ultra_alchemy_tea": "\u7a76\u6781\u70bc\u91d1\u8336",
        "/actions/brewing/ultra_enhancing_tea": "\u7a76\u6781\u5f3a\u5316\u8336",
        "/actions/brewing/ultra_cheesesmithing_tea": "\u7a76\u6781\u5976\u916a\u953b\u9020\u8336",
        "/actions/brewing/ultra_power_coffee": "\u7a76\u6781\u529b\u91cf\u5496\u5561",
        "/actions/brewing/ultra_crafting_tea": "\u7a76\u6781\u5236\u4f5c\u8336",
        "/actions/brewing/ultra_ranged_coffee": "\u7a76\u6781\u8fdc\u7a0b\u5496\u5561",
        "/actions/brewing/ultra_tailoring_tea": "\u7a76\u6781\u7f1d\u7eab\u8336",
        "/actions/brewing/ultra_magic_coffee": "\u7a76\u6781\u9b54\u6cd5\u5496\u5561",
        "/actions/alchemy/transmute": "\u8f6c\u5316",
        "/actions/alchemy/decompose": "\u5206\u89e3",
        "/actions/alchemy/coinify": "\u70b9\u91d1",
        "/actions/enhancing/enhance": "\u5f3a\u5316",
        "/actions/combat/fly": "\u82cd\u8747",
        "/actions/combat/rat": "\u6770\u745e",
        "/actions/combat/skunk": "\u81ed\u9f2c",
        "/actions/combat/porcupine": "\u8c6a\u732a",
        "/actions/combat/slimy": "\u53f2\u83b1\u59c6",
        "/actions/combat/smelly_planet": "\u81ed\u81ed\u661f\u7403",
        "/actions/combat/smelly_planet_elite": "\u81ed\u81ed\u661f\u7403 (\u7cbe\u82f1)",
        "/actions/combat/frog": "\u9752\u86d9",
        "/actions/combat/snake": "\u86c7",
        "/actions/combat/swampy": "\u6cbc\u6cfd\u866b",
        "/actions/combat/alligator": "\u590f\u6d1b\u514b",
        "/actions/combat/swamp_planet": "\u6cbc\u6cfd\u661f\u7403",
        "/actions/combat/swamp_planet_elite": "\u6cbc\u6cfd\u661f\u7403 (\u7cbe\u82f1)",
        "/actions/combat/sea_snail": "\u8717\u725b",
        "/actions/combat/crab": "\u8783\u87f9",
        "/actions/combat/aquahorse": "\u6c34\u9a6c",
        "/actions/combat/nom_nom": "\u54ac\u54ac\u9c7c",
        "/actions/combat/turtle": "\u5fcd\u8005\u9f9f",
        "/actions/combat/aqua_planet": "\u6d77\u6d0b\u661f\u7403",
        "/actions/combat/aqua_planet_elite": "\u6d77\u6d0b\u661f\u7403 (\u7cbe\u82f1)",
        "/actions/combat/jungle_sprite": "\u4e1b\u6797\u7cbe\u7075",
        "/actions/combat/myconid": "\u8611\u83c7\u4eba",
        "/actions/combat/treant": "\u6811\u4eba",
        "/actions/combat/centaur_archer": "\u534a\u4eba\u9a6c\u5f13\u7bad\u624b",
        "/actions/combat/jungle_planet": "\u4e1b\u6797\u661f\u7403",
        "/actions/combat/jungle_planet_elite": "\u4e1b\u6797\u661f\u7403 (\u7cbe\u82f1)",
        "/actions/combat/gobo_stabby": "\u523a\u523a",
        "/actions/combat/gobo_slashy": "\u780d\u780d",
        "/actions/combat/gobo_smashy": "\u9524\u9524",
        "/actions/combat/gobo_shooty": "\u54bb\u54bb",
        "/actions/combat/gobo_boomy": "\u8f70\u8f70",
        "/actions/combat/gobo_planet": "\u54e5\u5e03\u6797\u661f\u7403",
        "/actions/combat/gobo_planet_elite": "\u54e5\u5e03\u6797\u661f\u7403 (\u7cbe\u82f1)",
        "/actions/combat/eye": "\u72ec\u773c",
        "/actions/combat/eyes": "\u53e0\u773c",
        "/actions/combat/veyes": "\u590d\u773c",
        "/actions/combat/planet_of_the_eyes": "\u773c\u7403\u661f\u7403",
        "/actions/combat/planet_of_the_eyes_elite": "\u773c\u7403\u661f\u7403 (\u7cbe\u82f1)",
        "/actions/combat/novice_sorcerer": "\u65b0\u624b\u5deb\u5e08",
        "/actions/combat/ice_sorcerer": "\u51b0\u971c\u5deb\u5e08",
        "/actions/combat/flame_sorcerer": "\u706b\u7130\u5deb\u5e08",
        "/actions/combat/elementalist": "\u5143\u7d20\u6cd5\u5e08",
        "/actions/combat/sorcerers_tower": "\u5deb\u5e08\u4e4b\u5854",
        "/actions/combat/sorcerers_tower_elite": "\u5deb\u5e08\u4e4b\u5854 (\u7cbe\u82f1)",
        "/actions/combat/gummy_bear": "\u8f6f\u7cd6\u718a",
        "/actions/combat/panda": "\u718a\u732b",
        "/actions/combat/black_bear": "\u9ed1\u718a",
        "/actions/combat/grizzly_bear": "\u68d5\u718a",
        "/actions/combat/polar_bear": "\u5317\u6781\u718a",
        "/actions/combat/bear_with_it": "\u718a\u718a\u661f\u7403",
        "/actions/combat/bear_with_it_elite": "\u718a\u718a\u661f\u7403 (\u7cbe\u82f1)",
        "/actions/combat/magnetic_golem": "\u78c1\u529b\u9b54\u50cf",
        "/actions/combat/stalactite_golem": "\u949f\u4e73\u77f3\u9b54\u50cf",
        "/actions/combat/granite_golem": "\u82b1\u5c97\u5ca9\u9b54\u50cf",
        "/actions/combat/golem_cave": "\u9b54\u50cf\u6d1e\u7a74",
        "/actions/combat/golem_cave_elite": "\u9b54\u50cf\u6d1e\u7a74 (\u7cbe\u82f1)",
        "/actions/combat/zombie": "\u50f5\u5c38",
        "/actions/combat/vampire": "\u5438\u8840\u9b3c",
        "/actions/combat/werewolf": "\u72fc\u4eba",
        "/actions/combat/twilight_zone": "\u66ae\u5149\u4e4b\u5730",
        "/actions/combat/twilight_zone_elite": "\u66ae\u5149\u4e4b\u5730 (\u7cbe\u82f1)",
        "/actions/combat/abyssal_imp": "\u6df1\u6e0a\u5c0f\u9b3c",
        "/actions/combat/soul_hunter": "\u7075\u9b42\u730e\u624b",
        "/actions/combat/infernal_warlock": "\u5730\u72f1\u672f\u58eb",
        "/actions/combat/infernal_abyss": "\u5730\u72f1\u6df1\u6e0a",
        "/actions/combat/infernal_abyss_elite": "\u5730\u72f1\u6df1\u6e0a (\u7cbe\u82f1)",
        "/actions/combat/chimerical_den": "\u5947\u5e7b\u6d1e\u7a74",
        "/actions/combat/sinister_circus": "\u9634\u68ee\u9a6c\u620f\u56e2",
        "/actions/combat/enchanted_fortress": "\u79d8\u6cd5\u8981\u585e",
    };

    const ZHOthersDic = {
        // monsterNames
        "/monsters/abyssal_imp": "\u6df1\u6e0a\u5c0f\u9b3c",
        "/monsters/acrobat": "\u6742\u6280\u5e08",
        "/monsters/aquahorse": "\u6c34\u9a6c",
        "/monsters/black_bear": "\u9ed1\u718a",
        "/monsters/gobo_boomy": "\u8f70\u8f70",
        "/monsters/butterjerry": "\u8776\u9f20",
        "/monsters/centaur_archer": "\u534a\u4eba\u9a6c\u5f13\u7bad\u624b",
        "/monsters/chronofrost_sorcerer": "\u971c\u65f6\u5deb\u5e08",
        "/monsters/crystal_colossus": "\u6c34\u6676\u5de8\u50cf",
        "/monsters/demonic_overlord": "\u6076\u9b54\u9738\u4e3b",
        "/monsters/deranged_jester": "\u5c0f\u4e11\u7687",
        "/monsters/dodocamel": "\u6e21\u6e21\u9a7c",
        "/monsters/dusk_revenant": "\u9ec4\u660f\u4ea1\u7075",
        "/monsters/elementalist": "\u5143\u7d20\u6cd5\u5e08",
        "/monsters/enchanted_bishop": "\u79d8\u6cd5\u4e4b\u76f8",
        "/monsters/enchanted_king": "\u79d8\u6cd5\u4e4b\u738b",
        "/monsters/enchanted_knight": "\u79d8\u6cd5\u9a91\u58eb",
        "/monsters/enchanted_pawn": "\u79d8\u6cd5\u4e4b\u5175",
        "/monsters/enchanted_queen": "\u79d8\u6cd5\u4e4b\u540e",
        "/monsters/enchanted_rook": "\u79d8\u6cd5\u5821\u5792",
        "/monsters/eye": "\u72ec\u773c",
        "/monsters/eyes": "\u53e0\u773c",
        "/monsters/flame_sorcerer": "\u706b\u7130\u5deb\u5e08",
        "/monsters/fly": "\u82cd\u8747",
        "/monsters/frog": "\u9752\u86d9",
        "/monsters/sea_snail": "\u8717\u725b",
        "/monsters/giant_shoebill": "\u9cb8\u5934\u9e73",
        "/monsters/gobo_chieftain": "\u54e5\u5e03\u6797\u914b\u957f",
        "/monsters/granite_golem": "\u82b1\u5c97\u9b54\u50cf",
        "/monsters/griffin": "\u72ee\u9e6b",
        "/monsters/grizzly_bear": "\u68d5\u718a",
        "/monsters/gummy_bear": "\u8f6f\u7cd6\u718a",
        "/monsters/crab": "\u8783\u87f9",
        "/monsters/ice_sorcerer": "\u51b0\u971c\u5deb\u5e08",
        "/monsters/infernal_warlock": "\u5730\u72f1\u672f\u58eb",
        "/monsters/jackalope": "\u9e7f\u89d2\u5154",
        "/monsters/rat": "\u6770\u745e",
        "/monsters/juggler": "\u6742\u800d\u8005",
        "/monsters/jungle_sprite": "\u4e1b\u6797\u7cbe\u7075",
        "/monsters/luna_empress": "\u6708\u795e\u4e4b\u8776",
        "/monsters/magician": "\u9b54\u672f\u5e08",
        "/monsters/magnetic_golem": "\u78c1\u529b\u9b54\u50cf",
        "/monsters/manticore": "\u72ee\u874e\u517d",
        "/monsters/marine_huntress": "\u6d77\u6d0b\u730e\u624b",
        "/monsters/myconid": "\u8611\u83c7\u4eba",
        "/monsters/nom_nom": "\u54ac\u54ac\u9c7c",
        "/monsters/novice_sorcerer": "\u65b0\u624b\u5deb\u5e08",
        "/monsters/panda": "\u718a\u732b",
        "/monsters/polar_bear": "\u5317\u6781\u718a",
        "/monsters/porcupine": "\u8c6a\u732a",
        "/monsters/rabid_rabbit": "\u75af\u9b54\u5154",
        "/monsters/red_panda": "\u5c0f\u718a\u732b",
        "/monsters/alligator": "\u590f\u6d1b\u514b",
        "/monsters/gobo_shooty": "\u54bb\u54bb",
        "/monsters/skunk": "\u81ed\u9f2c",
        "/monsters/gobo_slashy": "\u780d\u780d",
        "/monsters/slimy": "\u53f2\u83b1\u59c6",
        "/monsters/gobo_smashy": "\u9524\u9524",
        "/monsters/soul_hunter": "\u7075\u9b42\u730e\u624b",
        "/monsters/gobo_stabby": "\u523a\u523a",
        "/monsters/stalactite_golem": "\u949f\u4e73\u77f3\u9b54\u50cf",
        "/monsters/swampy": "\u6cbc\u6cfd\u866b",
        "/monsters/the_watcher": "\u89c2\u5bdf\u8005",
        "/monsters/snake": "\u86c7",
        "/monsters/treant": "\u6811\u4eba",
        "/monsters/turtle": "\u5fcd\u8005\u9f9f",
        "/monsters/vampire": "\u5438\u8840\u9b3c",
        "/monsters/veyes": "\u590d\u773c",
        "/monsters/werewolf": "\u72fc\u4eba",
        "/monsters/zombie": "\u50f5\u5c38",
        "/monsters/zombie_bear": "\u50f5\u5c38\u718a",

        // abilityNames
        "/abilities/poke": "\u7834\u80c6\u4e4b\u523a",
        "/abilities/impale": "\u900f\u9aa8\u4e4b\u523a",
        "/abilities/puncture": "\u7834\u7532\u4e4b\u523a",
        "/abilities/penetrating_strike": "\u8d2f\u5fc3\u4e4b\u523a",
        "/abilities/scratch": "\u722a\u5f71\u65a9",
        "/abilities/cleave": "\u5206\u88c2\u65a9",
        "/abilities/maim": "\u8840\u5203\u65a9",
        "/abilities/crippling_slash": "\u81f4\u6b8b\u65a9",
        "/abilities/smack": "\u91cd\u78be",
        "/abilities/sweep": "\u91cd\u626b",
        "/abilities/stunning_blow": "\u91cd\u9524",
        "/abilities/quick_shot": "\u5feb\u901f\u5c04\u51fb",
        "/abilities/aqua_arrow": "\u6d41\u6c34\u7bad",
        "/abilities/flame_arrow": "\u70c8\u7130\u7bad",
        "/abilities/rain_of_arrows": "\u7bad\u96e8",
        "/abilities/silencing_shot": "\u6c89\u9ed8\u4e4b\u7bad",
        "/abilities/steady_shot": "\u7a33\u5b9a\u5c04\u51fb",
        "/abilities/pestilent_shot": "\u75ab\u75c5\u5c04\u51fb",
        "/abilities/penetrating_shot": "\u8d2f\u7a7f\u5c04\u51fb",
        "/abilities/water_strike": "\u6d41\u6c34\u51b2\u51fb",
        "/abilities/ice_spear": "\u51b0\u67aa\u672f",
        "/abilities/frost_surge": "\u51b0\u971c\u7206\u88c2",
        "/abilities/mana_spring": "\u6cd5\u529b\u55b7\u6cc9",
        "/abilities/entangle": "\u7f20\u7ed5",
        "/abilities/toxic_pollen": "\u5267\u6bd2\u7c89\u5c18",
        "/abilities/natures_veil": "\u81ea\u7136\u83cc\u5e55",
        "/abilities/fireball": "\u706b\u7403",
        "/abilities/flame_blast": "\u7194\u5ca9\u7206\u88c2",
        "/abilities/firestorm": "\u706b\u7130\u98ce\u66b4",
        "/abilities/smoke_burst": "\u70df\u7206\u706d\u5f71",
        "/abilities/minor_heal": "\u521d\u7ea7\u81ea\u6108\u672f",
        "/abilities/heal": "\u81ea\u6108\u672f",
        "/abilities/quick_aid": "\u5feb\u901f\u6cbb\u7597\u672f",
        "/abilities/rejuvenate": "\u7fa4\u4f53\u6cbb\u7597\u672f",
        "/abilities/taunt": "\u5632\u8bbd",
        "/abilities/provoke": "\u6311\u8845",
        "/abilities/toughness": "\u575a\u97e7",
        "/abilities/elusiveness": "\u95ea\u907f",
        "/abilities/precision": "\u7cbe\u786e",
        "/abilities/berserk": "\u72c2\u66b4",
        "/abilities/frenzy": "\u72c2\u901f",
        "/abilities/elemental_affinity": "\u5143\u7d20\u589e\u5e45",
        "/abilities/spike_shell": "\u5c16\u523a\u9632\u62a4",
        "/abilities/arcane_reflection": "\u5965\u672f\u53cd\u5c04",
        "/abilities/vampirism": "\u5438\u8840",
        "/abilities/revive": "\u590d\u6d3b",
        "/abilities/insanity": "\u75af\u72c2",
        "/abilities/invincible": "\u65e0\u654c",
        "/abilities/fierce_aura": "\u7269\u7406\u5149\u73af",
        "/abilities/aqua_aura": "\u6d41\u6c34\u5149\u73af",
        "/abilities/sylvan_aura": "\u81ea\u7136\u5149\u73af",
        "/abilities/flame_aura": "\u706b\u7130\u5149\u73af",
        "/abilities/speed_aura": "\u901f\u5ea6\u5149\u73af",
        "/abilities/critical_aura": "\u66b4\u51fb\u5149\u73af",
        "/abilities/promote": "\u664b\u5347",
    };

    function inverseKV(obj) {
        const retobj = {};
        for (const key in obj) {
            retobj[obj[key]] = key;
        }
        return retobj;
    }

    const ZHToItemHridMap = inverseKV(ZHitemNames);
    const ZHToActionHridMap = inverseKV(ZHActionNames);
    const ZHToOthersMap = inverseKV(ZHOthersDic);

    function getItemEnNameFromZhName(zhName) {
        const itemHrid = ZHToItemHridMap[zhName];
        if (!itemHrid) {
            console.log("Can not find EN name for item " + zhName);
            return "";
        }
        const enName = initData_itemDetailMap[itemHrid]?.name;
        if (!enName) {
            console.log("Can not find EN name for itemHrid " + itemHrid);
            return "";
        }
        return enName;
    }

    function getActionEnNameFromZhName(zhName) {
        const actionHrid = ZHToActionHridMap[zhName];
        if (!actionHrid) {
            console.log("Can not find EN name for action " + zhName);
            return "";
        }
        const enName = initData_actionDetailMap[actionHrid]?.name;
        if (!enName) {
            console.log("Can not find EN name for actionHrid " + actionHrid);
            return "";
        }
        return enName;
    }

    function getOthersFromZhName(zhName) {
        const key = ZHToOthersMap[zhName];
        if (!key) {
            // console.log("Can not find EN key for " + zhName);
            return "";
        }
        return key;
    }

    const MARKET_JSON_LOCAL_BACKUP = `{"time":1741022101,"market":{"Amber":{"ask":25000,"bid":24000},"Amethyst":{"ask":41000,"bid":40000},"Apple":{"ask":22,"bid":10},"Apple Gummy":{"ask":14,"bid":11},"Apple Yogurt":{"ask":500,"bid":23},"Aqua Arrow":{"ask":58000,"bid":56000},"Aqua Essence":{"ask":22,"bid":19},"Arabica Coffee Bean":{"ask":245,"bid":215},"Arcane Bow":{"ask":1000000,"bid":960000},"Arcane Crossbow":{"ask":760000,"bid":700000},"Arcane Fire Staff":{"ask":760000,"bid":500000},"Arcane Log":{"ask":470,"bid":440},"Arcane Lumber":{"ask":2600,"bid":2500},"Arcane Nature Staff":{"ask":820000,"bid":560000},"Arcane Water Staff":{"ask":780000,"bid":540000},"Artisan Tea":{"ask":2500,"bid":2300},"Attack Coffee":{"ask":900,"bid":520},"Azure Boots":{"ask":68000,"bid":18000},"Azure Brush":{"ask":115000,"bid":4000},"Azure Buckler":{"ask":21500,"bid":-1},"Azure Bulwark":{"ask":38000,"bid":3500},"Azure Cheese":{"ask":960,"bid":780},"Azure Chisel":{"ask":74000,"bid":22000},"Azure Enhancer":{"ask":94000,"bid":32000},"Azure Gauntlets":{"ask":86000,"bid":18000},"Azure Hammer":{"ask":190000,"bid":6000},"Azure Hatchet":{"ask":38000,"bid":15000},"Azure Helmet":{"ask":72000,"bid":23000},"Azure Mace":{"ask":115000,"bid":24000},"Azure Milk":{"ask":180,"bid":145},"Azure Needle":{"ask":78000,"bid":2200},"Azure Plate Body":{"ask":115000,"bid":40000},"Azure Plate Legs":{"ask":295000,"bid":32000},"Azure Pot":{"ask":80000,"bid":2200},"Azure Shears":{"ask":100000,"bid":26500},"Azure Spatula":{"ask":78000,"bid":2100},"Azure Spear":{"ask":98000,"bid":19000},"Azure Sword":{"ask":275000,"bid":5600},"Bamboo Boots":{"ask":23500,"bid":2600},"Bamboo Branch":{"ask":39,"bid":21},"Bamboo Fabric":{"ask":260,"bid":195},"Bamboo Gloves":{"ask":49000,"bid":7000},"Bamboo Hat":{"ask":54000,"bid":13000},"Bamboo Robe Bottoms":{"ask":105000,"bid":-1},"Bamboo Robe Top":{"ask":45000,"bid":19500},"Bear Essence":{"ask":100,"bid":86},"Beast Boots":{"ask":310000,"bid":45000},"Beast Bracers":{"ask":76000,"bid":-1},"Beast Chaps":{"ask":130000,"bid":-1},"Beast Hide":{"ask":21,"bid":20},"Beast Hood":{"ask":115000,"bid":-1},"Beast Leather":{"ask":820,"bid":780},"Beast Tunic":{"ask":140000,"bid":-1},"Berserk":{"ask":240000,"bid":230000},"Birch Bow":{"ask":35000,"bid":8400},"Birch Crossbow":{"ask":44000,"bid":880},"Birch Fire Staff":{"ask":72000,"bid":1200},"Birch Log":{"ask":140,"bid":76},"Birch Lumber":{"ask":560,"bid":500},"Birch Nature Staff":{"ask":295000,"bid":2700},"Birch Water Staff":{"ask":45000,"bid":2250},"Black Bear Fluff":{"ask":56000,"bid":52000},"Black Bear Shoes":{"ask":400000,"bid":170000},"Black Tea Leaf":{"ask":17,"bid":16},"Blackberry":{"ask":82,"bid":60},"Blackberry Cake":{"ask":720,"bid":410},"Blackberry Donut":{"ask":460,"bid":320},"Blessed Tea":{"ask":2350,"bid":2250},"Blueberry":{"ask":74,"bid":42},"Blueberry Cake":{"ask":820,"bid":310},"Blueberry Donut":{"ask":310,"bid":115},"Brewing Tea":{"ask":640,"bid":200},"Burble Brush":{"ask":115000,"bid":5600},"Burble Buckler":{"ask":76000,"bid":-1},"Burble Bulwark":{"ask":105000,"bid":8800},"Burble Chisel":{"ask":94000,"bid":30000},"Burble Enhancer":{"ask":90000,"bid":54000},"Burble Gauntlets":{"ask":125000,"bid":40000},"Burble Hatchet":{"ask":76000,"bid":-1},"Burble Helmet":{"ask":90000,"bid":5200},"Burble Mace":{"ask":98000,"bid":50000},"Burble Needle":{"ask":40000,"bid":5400},"Burble Plate Body":{"ask":360000,"bid":82000},"Burble Pot":{"ask":88000,"bid":16500},"Burble Shears":{"ask":135000,"bid":12500},"Burble Spatula":{"ask":100000,"bid":72000},"Burble Sword":{"ask":110000,"bid":-1},"Burble Tea Leaf":{"ask":33,"bid":26},"Cedar Bow":{"ask":120000,"bid":40000},"Cedar Fire Staff":{"ask":56000,"bid":27000},"Cedar Log":{"ask":145,"bid":120},"Cedar Lumber":{"ask":720,"bid":700},"Cedar Water Staff":{"ask":275000,"bid":44000},"Centaur Boots":{"ask":1400000,"bid":-1},"Centaur Hoof":{"ask":145000,"bid":140000},"Cheese Boots":{"ask":8800,"bid":2400},"Cheese Brush":{"ask":4900,"bid":205},"Cheese Buckler":{"ask":4000,"bid":105},"Cheese Chisel":{"ask":8600,"bid":250},"Cheese Enhancer":{"ask":5000,"bid":215},"Cheese Gauntlets":{"ask":5200,"bid":350},"Cheese Hammer":{"ask":5000,"bid":130},"Cheese Helmet":{"ask":26500,"bid":1000},"Cheese Mace":{"ask":45000,"bid":2500},"Cheese Plate Body":{"ask":32000,"bid":700},"Cheese Plate Legs":{"ask":39000,"bid":135},"Cheese Pot":{"ask":9800,"bid":880},"Cheese Spatula":{"ask":5800,"bid":215},"Cheese Spear":{"ask":9800,"bid":225},"Cheese Sword":{"ask":4500,"bid":-1},"Cleave":{"ask":72000,"bid":62000},"Cocoon":{"ask":245,"bid":225},"Coin":{"ask":-1,"bid":-1},"Cotton":{"ask":150,"bid":66},"Cotton Boots":{"ask":3300,"bid":3000},"Cotton Fabric":{"ask":420,"bid":360},"Cotton Hat":{"ask":4600,"bid":80},"Cotton Robe Bottoms":{"ask":3800,"bid":370},"Cotton Robe Top":{"ask":6000,"bid":420},"Crab Pincer":{"ask":18000,"bid":7800},"Crafting Tea":{"ask":1150,"bid":700},"Crimson Boots":{"ask":600000,"bid":7400},"Crimson Buckler":{"ask":195000,"bid":135000},"Crimson Bulwark":{"ask":180000,"bid":18500},"Crimson Cheese":{"ask":1150,"bid":1050},"Crimson Enhancer":{"ask":86000,"bid":20000},"Crimson Gauntlets":{"ask":90000,"bid":66000},"Crimson Hammer":{"ask":130000,"bid":37000},"Crimson Helmet":{"ask":92000,"bid":8600},"Crimson Mace":{"ask":210000,"bid":105000},"Crimson Milk":{"ask":275,"bid":240},"Crimson Plate Body":{"ask":165000,"bid":15500},"Crimson Plate Legs":{"ask":140000,"bid":26000},"Crimson Pot":{"ask":98000,"bid":-1},"Crimson Spatula":{"ask":250000,"bid":-1},"Crimson Spear":{"ask":390000,"bid":100000},"Crimson Sword":{"ask":185000,"bid":88000},"Crushed Amber":{"ask":1500,"bid":1400},"Crushed Amethyst":{"ask":2550,"bid":2400},"Crushed Garnet":{"ask":2600,"bid":2300},"Crushed Moonstone":{"ask":3300,"bid":3000},"Crushed Pearl":{"ask":920,"bid":820},"Cupcake":{"ask":300,"bid":32},"Donut":{"ask":180,"bid":34},"Dragon Fruit":{"ask":190,"bid":185},"Dragon Fruit Gummy":{"ask":740,"bid":720},"Earrings Of Armor":{"ask":9400000,"bid":7200000},"Earrings Of Gathering":{"ask":9400000,"bid":6400000},"Earrings Of Regeneration":{"ask":10000000,"bid":6800000},"Earrings Of Resistance":{"ask":9400000,"bid":7200000},"Efficiency Tea":{"ask":1250,"bid":1000},"Elemental Affinity":{"ask":265000,"bid":260000},"Emp Tea Leaf":{"ask":540,"bid":500},"Enhancing Tea":{"ask":1800,"bid":1400},"Excelsa Coffee Bean":{"ask":640,"bid":620},"Eyessence":{"ask":66,"bid":58},"Fieriosa Coffee Bean":{"ask":720,"bid":680},"Fireball":{"ask":11500,"bid":10500},"Flame Arrow":{"ask":60000,"bid":52000},"Flame Blast":{"ask":92000,"bid":90000},"Flaming Cloth":{"ask":41000,"bid":40000},"Flaming Robe Top":{"ask":260000,"bid":200000},"Flax":{"ask":185,"bid":120},"Foraging Tea":{"ask":560,"bid":420},"Garnet":{"ask":41000,"bid":40000},"Gathering Tea":{"ask":600,"bid":540},"Giant Pouch":{"ask":7400000,"bid":-1},"Ginkgo Bow":{"ask":620000,"bid":92000},"Ginkgo Crossbow":{"ask":205000,"bid":70000},"Ginkgo Log":{"ask":200,"bid":190},"Ginkgo Lumber":{"ask":1150,"bid":1050},"Ginkgo Nature Staff":{"ask":480000,"bid":70000},"Gobo Boomstick":{"ask":82000,"bid":80000},"Gobo Boots":{"ask":60000,"bid":26500},"Gobo Bracers":{"ask":150000,"bid":-1},"Gobo Essence":{"ask":96,"bid":74},"Gobo Hide":{"ask":14,"bid":12},"Gobo Hood":{"ask":40000,"bid":22000},"Gobo Shooter":{"ask":82000,"bid":80000},"Gobo Slasher":{"ask":82000,"bid":80000},"Gobo Smasher":{"ask":82000,"bid":80000},"Gobo Tunic":{"ask":45000,"bid":30000},"Goggles":{"ask":430000,"bid":350000},"Golem Essence":{"ask":290,"bid":280},"Granite Bludgeon":{"ask":13000000,"bid":6000000},"Green Tea Leaf":{"ask":24,"bid":16},"Grizzly Bear Fluff":{"ask":62000,"bid":60000},"Gummy":{"ask":300,"bid":20},"Heal":{"ask":58000,"bid":56000},"Holy Boots":{"ask":210000,"bid":125000},"Holy Buckler":{"ask":420000,"bid":300000},"Holy Bulwark":{"ask":820000,"bid":450000},"Holy Cheese":{"ask":2100,"bid":2000},"Holy Enhancer":{"ask":520000,"bid":410000},"Holy Gauntlets":{"ask":400000,"bid":240000},"Holy Hammer":{"ask":470000,"bid":440000},"Holy Helmet":{"ask":330000,"bid":150000},"Holy Mace":{"ask":560000,"bid":540000},"Holy Milk":{"ask":470,"bid":450},"Holy Plate Body":{"ask":860000,"bid":520000},"Holy Plate Legs":{"ask":540000,"bid":120000},"Holy Pot":{"ask":540000,"bid":440000},"Holy Spatula":{"ask":580000,"bid":490000},"Holy Spear":{"ask":600000,"bid":520000},"Holy Sword":{"ask":600000,"bid":500000},"Icy Cloth":{"ask":40000,"bid":39000},"Icy Robe Bottoms":{"ask":290000,"bid":40000},"Icy Robe Top":{"ask":250000,"bid":150000},"Jade":{"ask":42000,"bid":41000},"Jungle Essence":{"ask":94,"bid":74},"Large Artisan's Crate":{"ask":-1,"bid":-1},"Large Pouch":{"ask":660000,"bid":390000},"Large Treasure Chest":{"ask":-1,"bid":-1},"Liberica Coffee Bean":{"ask":500,"bid":480},"Linen Boots":{"ask":8000,"bid":640},"Linen Gloves":{"ask":94000,"bid":640},"Linen Hat":{"ask":54000,"bid":1600},"Linen Robe Bottoms":{"ask":34000,"bid":-1},"Living Granite":{"ask":600000,"bid":580000},"Log":{"ask":76,"bid":56},"Lucky Coffee":{"ask":2050,"bid":1950},"Magic Coffee":{"ask":920,"bid":900},"Magnet":{"ask":290000,"bid":285000},"Magnifying Glass":{"ask":1700000,"bid":1500000},"Maim":{"ask":200000,"bid":195000},"Marsberry":{"ask":170,"bid":140},"Marsberry Donut":{"ask":860,"bid":820},"Medium Artisan's Crate":{"ask":-1,"bid":-1},"Medium Meteorite Cache":{"ask":-1,"bid":-1},"Medium Treasure Chest":{"ask":-1,"bid":-1},"Milk":{"ask":64,"bid":41},"Milking Tea":{"ask":660,"bid":500},"Minor Heal":{"ask":4500,"bid":3400},"Mooberry":{"ask":140,"bid":130},"Mooberry Cake":{"ask":980,"bid":840},"Mooberry Donut":{"ask":760,"bid":720},"Moonstone":{"ask":60000,"bid":58000},"Necklace Of Efficiency":{"ask":15500000,"bid":10000000},"Necklace Of Wisdom":{"ask":17000000,"bid":13000000},"Orange Gummy":{"ask":32,"bid":24},"Orange Yogurt":{"ask":470,"bid":265},"Panda Gloves":{"ask":430000,"bid":180000},"Peach":{"ask":32,"bid":27},"Peach Gummy":{"ask":380,"bid":340},"Pearl":{"ask":14500,"bid":13500},"Pierce":{"ask":-1,"bid":-1},"Pincer Gloves":{"ask":66000,"bid":20500},"Plum":{"ask":66,"bid":29},"Plum Yogurt":{"ask":600,"bid":500},"Poke":{"ask":3000,"bid":2850},"Power Coffee":{"ask":940,"bid":800},"Precision":{"ask":72000,"bid":68000},"Purpleheart Bow":{"ask":225000,"bid":120000},"Purpleheart Crossbow":{"ask":160000,"bid":20000},"Purpleheart Fire Staff":{"ask":100000,"bid":68000},"Purpleheart Lumber":{"ask":1000,"bid":880},"Purpleheart Nature Staff":{"ask":320000,"bid":94000},"Purpleheart Water Staff":{"ask":165000,"bid":84000},"Quick Shot":{"ask":4000,"bid":2800},"Radiant Fabric":{"ask":2500,"bid":2450},"Radiant Fiber":{"ask":600,"bid":580},"Radiant Gloves":{"ask":180000,"bid":120000},"Radiant Robe Bottoms":{"ask":520000,"bid":420000},"Radiant Robe Top":{"ask":500000,"bid":400000},"Rain Of Arrows":{"ask":340000,"bid":295000},"Rainbow Brush":{"ask":215000,"bid":-1},"Rainbow Buckler":{"ask":150000,"bid":22000},"Rainbow Bulwark":{"ask":360000,"bid":43000},"Rainbow Chisel":{"ask":460000,"bid":-1},"Rainbow Enhancer":{"ask":215000,"bid":88000},"Rainbow Gauntlets":{"ask":175000,"bid":56000},"Rainbow Hatchet":{"ask":250000,"bid":44000},"Rainbow Helmet":{"ask":200000,"bid":-1},"Rainbow Mace":{"ask":265000,"bid":200000},"Rainbow Needle":{"ask":220000,"bid":-1},"Rainbow Plate Body":{"ask":270000,"bid":56000},"Rainbow Plate Legs":{"ask":255000,"bid":56000},"Rainbow Shears":{"ask":580000,"bid":-1},"Rainbow Spatula":{"ask":400000,"bid":200000},"Rainbow Spear":{"ask":200000,"bid":150000},"Ranged Coffee":{"ask":980,"bid":880},"Ranger Necklace":{"ask":17000000,"bid":10000000},"Red Tea Leaf":{"ask":49,"bid":48},"Redwood Crossbow":{"ask":340000,"bid":180000},"Redwood Fire Staff":{"ask":370000,"bid":240000},"Redwood Log":{"ask":110,"bid":76},"Redwood Nature Staff":{"ask":360000,"bid":300000},"Redwood Water Staff":{"ask":800000,"bid":300000},"Reptile Boots":{"ask":47000,"bid":640},"Reptile Chaps":{"ask":30000,"bid":1250},"Reptile Hide":{"ask":14,"bid":7},"Reptile Hood":{"ask":18000,"bid":1500},"Reptile Tunic":{"ask":22000,"bid":1450},"Ring Of Armor":{"ask":9600000,"bid":7000000},"Ring Of Gathering":{"ask":10000000,"bid":6600000},"Ring Of Regeneration":{"ask":9800000,"bid":6800000},"Ring Of Resistance":{"ask":9600000,"bid":7000000},"Robusta Coffee Bean":{"ask":215,"bid":155},"Rough Bracers":{"ask":13000,"bid":880},"Rough Chaps":{"ask":30000,"bid":640},"Rough Hide":{"ask":90,"bid":52},"Rough Leather":{"ask":380,"bid":360},"Rough Tunic":{"ask":2750,"bid":130},"Scratch":{"ask":7600,"bid":4500},"Silk Boots":{"ask":45000,"bid":25000},"Silk Fabric":{"ask":1200,"bid":1150},"Silk Gloves":{"ask":96000,"bid":72000},"Silk Robe Bottoms":{"ask":140000,"bid":125000},"Silk Robe Top":{"ask":205000,"bid":145000},"Smack":{"ask":3500,"bid":2850},"Small Meteorite Cache":{"ask":-1,"bid":-1},"Small Pouch":{"ask":18500,"bid":8000},"Snail Shell":{"ask":7600,"bid":5600},"Snail Shell Helmet":{"ask":76000,"bid":20000},"Snake Fang":{"ask":3800,"bid":3200},"Sorcerer Boots":{"ask":480000,"bid":230000},"Sorcerer Essence":{"ask":120,"bid":110},"Sorcerer's Sole":{"ask":70000,"bid":66000},"Spaceberry Cake":{"ask":1450,"bid":1400},"Spaceberry Donut":{"ask":1200,"bid":1150},"Spacia Coffee Bean":{"ask":900,"bid":860},"Stalactite Shard":{"ask":600000,"bid":580000},"Stalactite Spear":{"ask":-1,"bid":10000000},"Stamina Coffee":{"ask":620,"bid":460},"Star Fruit":{"ask":520,"bid":490},"Star Fruit Gummy":{"ask":1150,"bid":1000},"Star Fruit Yogurt":{"ask":1450,"bid":1400},"Strawberry Cake":{"ask":700,"bid":680},"Strawberry Donut":{"ask":760,"bid":400},"Stunning Blow":{"ask":410000,"bid":350000},"Super Attack Coffee":{"ask":3800,"bid":2650},"Super Brewing Tea":{"ask":7400,"bid":-1},"Super Cheesesmithing Tea":{"ask":5200,"bid":3100},"Super Crafting Tea":{"ask":5800,"bid":4400},"Super Defense Coffee":{"ask":3700,"bid":3200},"Super Enhancing Tea":{"ask":7600,"bid":6200},"Super Foraging Tea":{"ask":3000,"bid":2650},"Super Magic Coffee":{"ask":4800,"bid":4700},"Super Milking Tea":{"ask":3300,"bid":2000},"Super Power Coffee":{"ask":4700,"bid":4500},"Super Stamina Coffee":{"ask":2950,"bid":1950},"Super Tailoring Tea":{"ask":5200,"bid":3900},"Super Woodcutting Tea":{"ask":3100,"bid":1900},"Sweep":{"ask":62000,"bid":58000},"Swiftness Coffee":{"ask":2400,"bid":2250},"Tailoring Tea":{"ask":740,"bid":660},"Tome Of The Elements":{"ask":2900000,"bid":2650000},"Toughness":{"ask":74000,"bid":70000},"Toxic Pollen":{"ask":265000,"bid":230000},"Turtle Shell Body":{"ask":70000,"bid":-1},"Turtle Shell Legs":{"ask":78000,"bid":-1},"Twilight Essence":{"ask":285,"bid":280},"Umbral Bracers":{"ask":205000,"bid":52000},"Umbral Chaps":{"ask":295000,"bid":105000},"Umbral Hide":{"ask":180,"bid":150},"Umbral Leather":{"ask":1500,"bid":1450},"Umbral Tunic":{"ask":350000,"bid":275000},"Vampire Fang":{"ask":600000,"bid":580000},"Vampirism":{"ask":52000,"bid":44000},"Verdant Boots":{"ask":36000,"bid":7400},"Verdant Brush":{"ask":25500,"bid":8200},"Verdant Bulwark":{"ask":37000,"bid":2300},"Verdant Cheese":{"ask":620,"bid":540},"Verdant Chisel":{"ask":29500,"bid":4200},"Verdant Gauntlets":{"ask":27000,"bid":1400},"Verdant Hammer":{"ask":20000,"bid":800},"Verdant Hatchet":{"ask":29500,"bid":1450},"Verdant Mace":{"ask":45000,"bid":1000},"Verdant Milk":{"ask":110,"bid":78},"Verdant Needle":{"ask":80000,"bid":600},"Verdant Plate Legs":{"ask":86000,"bid":16500},"Verdant Pot":{"ask":27000,"bid":4900},"Verdant Shears":{"ask":29500,"bid":1100},"Verdant Spear":{"ask":76000,"bid":-1},"Verdant Sword":{"ask":38000,"bid":1050},"Vision Helmet":{"ask":310000,"bid":66000},"Water Strike":{"ask":20000,"bid":19500},"Werewolf Claw":{"ask":600000,"bid":580000},"Werewolf Slasher":{"ask":13000000,"bid":7200000},"Wisdom Coffee":{"ask":1600,"bid":1500},"Wisdom Tea":{"ask":900,"bid":780},"Wizard Necklace":{"ask":16500000,"bid":12500000},"Wooden Bow":{"ask":8400,"bid":2000},"Wooden Crossbow":{"ask":5400,"bid":-1},"Wooden Fire Staff":{"ask":5000,"bid":145},"Wooden Water Staff":{"ask":8200,"bid":640},"Yogurt":{"ask":300,"bid":100},"Burble Boots":{"ask":72000,"bid":43000},"Burble Cheese":{"ask":880,"bid":700},"Burble Hammer":{"ask":98000,"bid":21500},"Burble Milk":{"ask":225,"bid":210},"Cedar Nature Staff":{"ask":295000,"bid":46000},"Cheese":{"ask":400,"bid":360},"Cheese Bulwark":{"ask":5000,"bid":440},"Cheese Hatchet":{"ask":6600,"bid":225},"Cheese Needle":{"ask":6000,"bid":500},"Cheese Shears":{"ask":17500,"bid":225},"Cheesesmithing Tea":{"ask":960,"bid":780},"Cooking Tea":{"ask":680,"bid":66},"Cotton Gloves":{"ask":23000,"bid":350},"Cowbell":{"ask":-1,"bid":-1},"Crimson Brush":{"ask":150000,"bid":47000},"Crimson Chisel":{"ask":180000,"bid":-1},"Crimson Hatchet":{"ask":150000,"bid":48000},"Crimson Shears":{"ask":310000,"bid":64000},"Critical Coffee":{"ask":3000,"bid":2950},"Crushed Jade":{"ask":2550,"bid":2450},"Defense Coffee":{"ask":900,"bid":600},"Dragon Fruit Yogurt":{"ask":980,"bid":940},"Flaming Robe Bottoms":{"ask":320000,"bid":135000},"Frenzy":{"ask":250000,"bid":230000},"Gobo Leather":{"ask":440,"bid":360},"Holy Chisel":{"ask":500000,"bid":420000},"Holy Hatchet":{"ask":450000,"bid":440000},"Holy Needle":{"ask":480000,"bid":400000},"Holy Shears":{"ask":490000,"bid":420000},"Ice Spear":{"ask":56000,"bid":52000},"Intelligence Coffee":{"ask":560,"bid":500},"Linen Fabric":{"ask":290,"bid":210},"Linen Robe Top":{"ask":34000,"bid":1900},"Lumber":{"ask":420,"bid":330},"Mirror Of Protection":{"ask":13000000,"bid":12500000},"Moolong Tea Leaf":{"ask":33,"bid":32},"Orange":{"ask":17,"bid":10},"Panda Fluff":{"ask":56000,"bid":52000},"Peach Yogurt":{"ask":760,"bid":720},"Plum Gummy":{"ask":100,"bid":84},"Processing Tea":{"ask":1850,"bid":1750},"Purpleheart Log":{"ask":175,"bid":130},"Radiant Boots":{"ask":185000,"bid":74000},"Radiant Hat":{"ask":430000,"bid":330000},"Rainbow Boots":{"ask":115000,"bid":76000},"Rainbow Cheese":{"ask":1100,"bid":1000},"Rainbow Hammer":{"ask":295000,"bid":54000},"Rainbow Milk":{"ask":310,"bid":295},"Rainbow Pot":{"ask":275000,"bid":-1},"Rainbow Sword":{"ask":250000,"bid":-1},"Redwood Bow":{"ask":580000,"bid":320000},"Redwood Lumber":{"ask":980,"bid":900},"Reptile Bracers":{"ask":19000,"bid":1200},"Reptile Leather":{"ask":400,"bid":370},"Ring Of Rare Find":{"ask":11500000,"bid":7200000},"Rough Boots":{"ask":3300,"bid":380},"Rough Hood":{"ask":2600,"bid":80},"Shard Of Protection":{"ask":72000,"bid":70000},"Silk Hat":{"ask":135000,"bid":92000},"Small Artisan's Crate":{"ask":-1,"bid":-1},"Small Treasure Chest":{"ask":-1,"bid":-1},"Snake Fang Dirk":{"ask":28000,"bid":10500},"Spaceberry":{"ask":275,"bid":240},"Spike Shell":{"ask":70000,"bid":43000},"Star Fragment":{"ask":16500,"bid":16000},"Strawberry":{"ask":145,"bid":110},"Super Cooking Tea":{"ask":3700,"bid":2100},"Super Intelligence Coffee":{"ask":3300,"bid":2750},"Super Ranged Coffee":{"ask":4700,"bid":4600},"Swamp Essence":{"ask":52,"bid":30},"Tome Of Healing":{"ask":150000,"bid":120000},"Turtle Shell":{"ask":19000,"bid":13000},"Umbral Boots":{"ask":150000,"bid":24500},"Umbral Hood":{"ask":270000,"bid":220000},"Vampire Fang Dirk":{"ask":-1,"bid":3000000},"Verdant Buckler":{"ask":22000,"bid":-1},"Verdant Enhancer":{"ask":20000,"bid":740},"Verdant Helmet":{"ask":20500,"bid":2050},"Verdant Spatula":{"ask":58000,"bid":2000},"Vision Shield":{"ask":1950000,"bid":1200000},"Wheat":{"ask":44,"bid":42},"Woodcutting Tea":{"ask":760,"bid":300},"Wooden Nature Staff":{"ask":5200,"bid":285},"Cedar Crossbow":{"ask":70000,"bid":-1},"Earrings Of Rare Find":{"ask":12000000,"bid":6000000},"Egg":{"ask":32,"bid":31},"Entangle":{"ask":19000,"bid":16500},"Fighter Necklace":{"ask":17500000,"bid":10000000},"Gator Vest":{"ask":17000,"bid":15000},"Ginkgo Fire Staff":{"ask":640000,"bid":115000},"Gobo Chaps":{"ask":295000,"bid":23000},"Gobo Stabber":{"ask":82000,"bid":80000},"Gourmet Tea":{"ask":680,"bid":450},"Grizzly Bear Shoes":{"ask":740000,"bid":64000},"Holy Brush":{"ask":460000,"bid":400000},"Large Meteorite Cache":{"ask":-1,"bid":-1},"Magnetic Gloves":{"ask":3900000,"bid":1350000},"Marsberry Cake":{"ask":1250,"bid":1200},"Medium Pouch":{"ask":94000,"bid":74000},"Polar Bear Fluff":{"ask":66000,"bid":62000},"Verdant Plate Body":{"ask":40000,"bid":6600},"Ginkgo Water Staff":{"ask":360000,"bid":120000},"Polar Bear Shoes":{"ask":460000,"bid":255000},"Sugar":{"ask":7,"bid":6},"Crimson Needle":{"ask":140000,"bid":35000},"Burble Plate Legs":{"ask":92000,"bid":66000},"Burble Spear":{"ask":275000,"bid":98000},"Arcane Shield":{"ask":520000,"bid":400000},"Birch Shield":{"ask":13500,"bid":480},"Cedar Shield":{"ask":27000,"bid":2000},"Ginkgo Shield":{"ask":68000,"bid":38000},"Purpleheart Shield":{"ask":64000,"bid":31000},"Redwood Shield":{"ask":200000,"bid":-1},"Sighted Bracers":{"ask":1600000,"bid":330000},"Spiked Bulwark":{"ask":16000000,"bid":5000000},"Wooden Shield":{"ask":3500,"bid":160},"Advanced Task Ring":{"ask":-1,"bid":-1},"Basic Task Ring":{"ask":-1,"bid":-1},"Expert Task Ring":{"ask":-1,"bid":-1},"Purple's Gift":{"ask":-1,"bid":-1},"Task Crystal":{"ask":-1,"bid":-1},"Task Token":{"ask":-1,"bid":-1},"Abyssal Essence":{"ask":285,"bid":275},"Channeling Coffee":{"ask":2450,"bid":2400},"Chrono Gloves":{"ask":-1,"bid":200000},"Chrono Sphere":{"ask":600000,"bid":560000},"Collector's Boots":{"ask":5000000,"bid":3900000},"Colossus Core":{"ask":980000,"bid":940000},"Colossus Plate Body":{"ask":-1,"bid":4800000},"Colossus Plate Legs":{"ask":8000000,"bid":-1},"Demonic Core":{"ask":960000,"bid":940000},"Demonic Plate Body":{"ask":-1,"bid":7600000},"Demonic Plate Legs":{"ask":9400000,"bid":5000000},"Elusiveness":{"ask":46000,"bid":44000},"Enchanted Gloves":{"ask":6200000,"bid":1150000},"Eye Of The Watcher":{"ask":720000,"bid":660000},"Eye Watch":{"ask":7200000,"bid":4900000},"Firestorm":{"ask":270000,"bid":260000},"Fluffy Red Hat":{"ask":6000000,"bid":3000000},"Frost Sphere":{"ask":620000,"bid":600000},"Frost Staff":{"ask":-1,"bid":8200000},"Frost Surge":{"ask":720000,"bid":660000},"Gobo Defender":{"ask":3800000,"bid":3400000},"Gobo Rag":{"ask":430000,"bid":410000},"Infernal Battlestaff":{"ask":20000000,"bid":10000000},"Infernal Ember":{"ask":620000,"bid":600000},"Luna Robe Bottoms":{"ask":1700000,"bid":215000},"Luna Robe Top":{"ask":2150000,"bid":350000},"Luna Wing":{"ask":180000,"bid":175000},"Marine Chaps":{"ask":560000,"bid":-1},"Marine Scale":{"ask":74000,"bid":72000},"Marine Tunic":{"ask":860000,"bid":60000},"Nature's Veil":{"ask":800000,"bid":700000},"Puncture":{"ask":200000,"bid":195000},"Red Chef's Hat":{"ask":-1,"bid":-1},"Red Panda Fluff":{"ask":600000,"bid":580000},"Revenant Anima":{"ask":1000000,"bid":960000},"Revenant Chaps":{"ask":9600000,"bid":6600000},"Revenant Tunic":{"ask":-1,"bid":8200000},"Shoebill Feather":{"ask":70000,"bid":66000},"Shoebill Shoes":{"ask":860000,"bid":125000},"Silencing Shot":{"ask":200000,"bid":195000},"Soul Fragment":{"ask":600000,"bid":580000},"Soul Hunter Crossbow":{"ask":13000000,"bid":-1},"Steady Shot":{"ask":200000,"bid":195000},"Treant Bark":{"ask":26000,"bid":23000},"Treant Shield":{"ask":175000,"bid":115000},"Vampiric Bow":{"ask":19500000,"bid":6400000},"Watchful Relic":{"ask":8000000,"bid":1000000},"Bag Of 10 Cowbells":{"ask":490000,"bid":470000},"Aqua Aura":{"ask":1650000,"bid":1550000},"Critical Aura":{"ask":4400000,"bid":3100000},"Fierce Aura":{"ask":6600000,"bid":5800000},"Flame Aura":{"ask":2300000,"bid":1800000},"Insanity":{"ask":3500000,"bid":2700000},"Invincible":{"ask":1650000,"bid":1500000},"Provoke":{"ask":96000,"bid":50000},"Quick Aid":{"ask":265000,"bid":250000},"Rejuvenate":{"ask":540000,"bid":470000},"Revive":{"ask":1600000,"bid":1500000},"Speed Aura":{"ask":2450000,"bid":1900000},"Sylvan Aura":{"ask":2300000,"bid":1900000},"Taunt":{"ask":76000,"bid":72000},"Acrobatic Hood":{"ask":80000000,"bid":72000000},"Acrobat's Ribbon":{"ask":7800000,"bid":7000000},"Bishop's Codex":{"ask":110000000,"bid":100000000},"Bishop's Scroll":{"ask":8400000,"bid":8200000},"Blue Key Fragment":{"ask":640000,"bid":620000},"Brown Key Fragment":{"ask":840000,"bid":820000},"Burning Key Fragment":{"ask":1900000,"bid":1850000},"Chaotic Chain":{"ask":9000000,"bid":8600000},"Chaotic Flail":{"ask":270000000,"bid":200000000},"Chimerical Chest":{"ask":-1,"bid":-1},"Chimerical Essence":{"ask":540,"bid":500},"Chimerical Key":{"ask":-1,"bid":-1},"Chimerical Quiver":{"ask":-1,"bid":-1},"Crippling Slash":{"ask":37000,"bid":33000},"Cursed Ball":{"ask":6000000,"bid":4600000},"Cursed Bow":{"ask":-1,"bid":115000000},"Dark Key Fragment":{"ask":1200000,"bid":1150000},"Dodocamel Gauntlets":{"ask":45000000,"bid":36000000},"Dodocamel Plume":{"ask":4700000,"bid":3500000},"Earrings Of Threat":{"ask":-1,"bid":-1},"Enchanted Chest":{"ask":-1,"bid":-1},"Enchanted Cloak":{"ask":-1,"bid":-1},"Enchanted Essence":{"ask":1700,"bid":1650},"Enchanted Key":{"ask":-1,"bid":-1},"Green Key Fragment":{"ask":580000,"bid":500000},"Griffin Chaps":{"ask":8000000,"bid":2750000},"Griffin Leather":{"ask":900000,"bid":840000},"Griffin Tunic":{"ask":9600000,"bid":5000000},"Impale":{"ask":58000,"bid":56000},"Jackalope Antler":{"ask":2850000,"bid":2550000},"Jackalope Staff":{"ask":54000000,"bid":38000000},"Knight's Aegis":{"ask":120000000,"bid":100000000},"Knight's Ingot":{"ask":8400000,"bid":8200000},"Magician's Cloth":{"ask":7600000,"bid":7000000},"Magician's Hat":{"ask":86000000,"bid":76000000},"Mana Spring":{"ask":260000,"bid":235000},"Manticore Shield":{"ask":26500000,"bid":25500000},"Manticore Sting":{"ask":2800000,"bid":2750000},"Orange Key Fragment":{"ask":1000000,"bid":980000},"Penetrating Shot":{"ask":240000,"bid":225000},"Penetrating Strike":{"ask":70000,"bid":58000},"Pestilent Shot":{"ask":37000,"bid":29000},"Purple Key Fragment":{"ask":470000,"bid":450000},"Regal Jewel":{"ask":8400000,"bid":8200000},"Regal Sword":{"ask":-1,"bid":170000000},"Ring Of Threat":{"ask":-1,"bid":-1},"Royal Cloth":{"ask":8400000,"bid":8200000},"Royal Fire Robe Bottoms":{"ask":82000000,"bid":68000000},"Royal Fire Robe Top":{"ask":98000000,"bid":72000000},"Royal Nature Robe Bottoms":{"ask":78000000,"bid":60000000},"Royal Nature Robe Top":{"ask":120000000,"bid":72000000},"Royal Water Robe Bottoms":{"ask":80000000,"bid":60000000},"Royal Water Robe Top":{"ask":92000000,"bid":72000000},"Sinister Cape":{"ask":-1,"bid":-1},"Sinister Chest":{"ask":-1,"bid":-1},"Sinister Essence":{"ask":900,"bid":880},"Sinister Key":{"ask":-1,"bid":-1},"Smoke Burst":{"ask":56000,"bid":48000},"Stone Key Fragment":{"ask":2100000,"bid":2050000},"Sundering Crossbow":{"ask":300000000,"bid":270000000},"Sundering Jewel":{"ask":12500000,"bid":12000000},"White Key Fragment":{"ask":1000000,"bid":980000},"Arcane Reflection":{"ask":60000,"bid":56000},"Chimerical Chest Key":{"ask":2600000,"bid":2350000},"Chimerical Entry Key":{"ask":340000,"bid":290000},"Enchanted Chest Key":{"ask":5600000,"bid":5400000},"Enchanted Entry Key":{"ask":600000,"bid":560000},"Griffin Bulwark":{"ask":-1,"bid":110000000},"Griffin Talon":{"ask":2950000,"bid":2100000},"Sinister Chest Key":{"ask":3500000,"bid":3200000},"Sinister Entry Key":{"ask":490000,"bid":430000},"Advanced Task Badge":{"ask":-1,"bid":-1},"Alchemy Essence":{"ask":330,"bid":320},"Alchemy Tea":{"ask":740,"bid":680},"Azure Alembic":{"ask":76000,"bid":-1},"Basic Task Badge":{"ask":-1,"bid":-1},"Brewing Essence":{"ask":240,"bid":225},"Burble Alembic":{"ask":105000,"bid":56000},"Catalyst Of Coinification":{"ask":3700,"bid":3300},"Catalyst Of Decomposition":{"ask":3700,"bid":3300},"Catalyst Of Transmutation":{"ask":10500,"bid":10000},"Catalytic Tea":{"ask":2300,"bid":2200},"Cheese Alembic":{"ask":5800,"bid":1350},"Cheesesmithing Essence":{"ask":310,"bid":285},"Chimerical Token":{"ask":-1,"bid":-1},"Cooking Essence":{"ask":285,"bid":265},"Crafting Essence":{"ask":390,"bid":370},"Crimson Alembic":{"ask":470000,"bid":60000},"Crushed Philosopher's Stone":{"ask":2600000,"bid":2500000},"Crushed Sunstone":{"ask":9400,"bid":9200},"Earrings Of Critical Strike":{"ask":12000000,"bid":8200000},"Earrings Of Essence Find":{"ask":9800000,"bid":6400000},"Enchanted Token":{"ask":-1,"bid":-1},"Enhancing Essence":{"ask":1650,"bid":1600},"Expert Task Badge":{"ask":-1,"bid":-1},"Foraging Essence":{"ask":280,"bid":240},"Gluttonous Energy":{"ask":17500000,"bid":16000000},"Gluttonous Pouch":{"ask":300000000,"bid":100000000},"Guzzling Energy":{"ask":30000000,"bid":29500000},"Guzzling Pouch":{"ask":-1,"bid":60000000},"Holy Alembic":{"ask":470000,"bid":410000},"Milking Essence":{"ask":265,"bid":205},"Necklace Of Speed":{"ask":20000000,"bid":12500000},"Philosopher's Earrings":{"ask":-1,"bid":280000000},"Philosopher's Necklace":{"ask":-1,"bid":540000000},"Philosopher's Ring":{"ask":1000000000,"bid":420000000},"Philosopher's Stone":{"ask":700000000,"bid":680000000},"Prime Catalyst":{"ask":145000,"bid":130000},"Rainbow Alembic":{"ask":205000,"bid":47000},"Ring Of Critical Strike":{"ask":12000000,"bid":8200000},"Ring Of Essence Find":{"ask":9600000,"bid":6600000},"Sinister Token":{"ask":-1,"bid":-1},"Sunstone":{"ask":620000,"bid":600000},"Super Alchemy Tea":{"ask":3800,"bid":3300},"Tailoring Essence":{"ask":215,"bid":205},"Ultra Alchemy Tea":{"ask":9200,"bid":6800},"Ultra Attack Coffee":{"ask":10000,"bid":2750},"Ultra Brewing Tea":{"ask":8800,"bid":2800},"Ultra Cheesesmithing Tea":{"ask":11500,"bid":6000},"Ultra Cooking Tea":{"ask":10000,"bid":3000},"Ultra Crafting Tea":{"ask":11500,"bid":8000},"Ultra Defense Coffee":{"ask":13000,"bid":-1},"Ultra Enhancing Tea":{"ask":15500,"bid":13500},"Ultra Foraging Tea":{"ask":8600,"bid":5600},"Ultra Intelligence Coffee":{"ask":13000,"bid":2500},"Ultra Magic Coffee":{"ask":14500,"bid":13500},"Ultra Milking Tea":{"ask":9600,"bid":6000},"Ultra Power Coffee":{"ask":15000,"bid":13500},"Ultra Ranged Coffee":{"ask":13500,"bid":13000},"Ultra Stamina Coffee":{"ask":11000,"bid":-1},"Ultra Tailoring Tea":{"ask":11500,"bid":4900},"Ultra Woodcutting Tea":{"ask":17000,"bid":5600},"Verdant Alembic":{"ask":27500,"bid":8600},"Woodcutting Essence":{"ask":290,"bid":200},"Alchemist's Bottoms":{"ask":-1,"bid":-1},"Alchemist's Top":{"ask":-1,"bid":-1},"Branch Of Insight":{"ask":21500000,"bid":21000000},"Brewer's Bottoms":{"ask":-1,"bid":3500000},"Brewer's Top":{"ask":-1,"bid":3700000},"Butter Of Proficiency":{"ask":15500000,"bid":13500000},"Celestial Alembic":{"ask":-1,"bid":135000000},"Celestial Brush":{"ask":-1,"bid":64000000},"Celestial Chisel":{"ask":-1,"bid":-1},"Celestial Enhancer":{"ask":-1,"bid":54000000},"Celestial Hammer":{"ask":-1,"bid":-1},"Celestial Hatchet":{"ask":-1,"bid":-1},"Celestial Needle":{"ask":-1,"bid":-1},"Celestial Pot":{"ask":-1,"bid":-1},"Celestial Shears":{"ask":480000000,"bid":205000000},"Celestial Spatula":{"ask":430000000,"bid":-1},"Cheesemaker's Bottoms":{"ask":-1,"bid":-1},"Cheesemaker's Top":{"ask":-1,"bid":-1},"Chef's Bottoms":{"ask":-1,"bid":-1},"Chef's Top":{"ask":-1,"bid":-1},"Crafter's Bottoms":{"ask":-1,"bid":-1},"Crafter's Top":{"ask":-1,"bid":-1},"Dairyhand's Bottoms":{"ask":-1,"bid":-1},"Dairyhand's Top":{"ask":-1,"bid":115000000},"Enhancer's Bottoms":{"ask":-1,"bid":-1},"Enhancer's Top":{"ask":-1,"bid":25000000},"Forager's Bottoms":{"ask":-1,"bid":180000000},"Forager's Top":{"ask":-1,"bid":180000000},"Lumberjack's Bottoms":{"ask":-1,"bid":15500000},"Lumberjack's Top":{"ask":-1,"bid":15500000},"Red Culinary Hat":{"ask":6000000,"bid":4800000},"Tailor's Bottoms":{"ask":-1,"bid":-1},"Tailor's Top":{"ask":-1,"bid":-1},"Thread Of Expertise":{"ask":11000000,"bid":10000000}}}`;

    let isUsingExpiredMarketJson = false;
    let reasonForUsingExpiredMarketJson = "";

    let initData_characterSkills = null;
    let initData_characterItems = null;
    let initData_combatAbilities = null;
    let initData_characterHouseRoomMap = null;
    let initData_actionTypeDrinkSlotsMap = null;
    let initData_actionDetailMap = null;
    let initData_levelExperienceTable = null;
    let initData_itemDetailMap = null;
    let initData_actionCategoryDetailMap = null;
    let initData_abilityDetailMap = null;
    let initData_characterAbilities = null;
    let initData_myMarketListings = null;

    let currentActionsHridList = [];
    let currentEquipmentMap = {};

    if (localStorage.getItem("initClientData")) {
        const obj = JSON.parse(localStorage.getItem("initClientData"));
        console.log(obj);
        GM_setValue("init_client_data", localStorage.getItem("initClientData"));

        initData_actionDetailMap = obj.actionDetailMap;
        initData_levelExperienceTable = obj.levelExperienceTable;
        initData_itemDetailMap = obj.itemDetailMap;
        initData_actionCategoryDetailMap = obj.actionCategoryDetailMap;
        initData_abilityDetailMap = obj.abilityDetailMap;
    }

    hookWS();

    fetchMarketJSON(true);

    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message }); // Anti-loop

            return handleMessage(message);
        }
    }

    function handleMessage(message) {
        let obj = JSON.parse(message);
        if (obj && obj.type === "init_character_data") {
            console.log(obj);
            GM_setValue("init_character_data", message);

            initData_characterSkills = obj.characterSkills;
            initData_characterItems = obj.characterItems;
            initData_characterHouseRoomMap = obj.characterHouseRoomMap;
            initData_actionTypeDrinkSlotsMap = obj.actionTypeDrinkSlotsMap;
            initData_characterAbilities = obj.characterAbilities;
            initData_myMarketListings = obj.myMarketListings;
            initData_combatAbilities = obj.combatUnit.combatAbilities;
            currentActionsHridList = [...obj.characterActions];
            if (settingsMap.totalActionTime.isTrue) {
                showTotalActionTime();
            }
            waitForActionPanelParent();
            if (settingsMap.skillbook.isTrue) {
                waitForItemDict();
            }
            if (settingsMap.ThirdPartyLinks.isTrue) {
                add3rdPartyLinks();
            }
            if (settingsMap.networth.isTrue) {
                calculateNetworth();
            }
            for (const item of obj.characterItems) {
                if (item.itemLocationHrid !== "/item_locations/inventory") {
                    currentEquipmentMap[item.itemLocationHrid] = item;
                }
            }
            if (settingsMap.checkEquipment.isTrue) {
                checkEquipment();
            }
            if (settingsMap.notifiEmptyAction.isTrue) {
                notificate();
            }
            if (settingsMap.fillMarketOrderPrice.isTrue) {
                waitForMarketOrders();
            }
        } else if (obj && obj.type === "init_client_data") {
            console.log(obj);
            GM_setValue("init_client_data", message);

            initData_actionDetailMap = obj.actionDetailMap;
            initData_levelExperienceTable = obj.levelExperienceTable;
            initData_itemDetailMap = obj.itemDetailMap;
            initData_actionCategoryDetailMap = obj.actionCategoryDetailMap;
            initData_abilityDetailMap = obj.abilityDetailMap;
        } else if (obj && obj.type === "actions_updated") {
            for (const action of obj.endCharacterActions) {
                if (action.isDone === false) {
                    currentActionsHridList.push(action);
                } else {
                    currentActionsHridList = currentActionsHridList.filter((o) => {
                        return o.id !== action.id;
                    });
                }
            }
            if (settingsMap.checkEquipment.isTrue) {
                checkEquipment();
            }
            if (settingsMap.notifiEmptyAction.isTrue) {
                setTimeout(notificate, 1000);
            }
            if (settingsMap.showDamage.isTrue) {
                if (currentActionsHridList.length === 0 || !currentActionsHridList[0].actionHrid.startsWith("/actions/combat/")) {
                    // Clear damage statistics panel
                    players = [];
                    monsters = [];
                    monstersHP = [];
                    startTime = null;
                    endTime = null;
                    totalDuration = 0;
                    totalDamage = new Array(players.length).fill(0);
                    monsterCounts = {};
                    monsterEvasion = {};
                }
            }
        } else if (obj && obj.type === "action_completed") {
            const action = obj.endCharacterAction;
            if (action.isDone === false) {
                for (const a of currentActionsHridList) {
                    if (a.id === action.id) {
                        a.currentCount = action.currentCount;
                    }
                }
            }
        } else if (obj && obj.type === "battle_unit_fetched") {
            if (settingsMap.battlePanel.isTrue) {
                handleBattleSummary(obj);
            }
        } else if (obj && obj.type === "items_updated" && obj.endCharacterItems) {
            for (const item of obj.endCharacterItems) {
                if (item.itemLocationHrid !== "/item_locations/inventory") {
                    if (item.count === 0) {
                        currentEquipmentMap[item.itemLocationHrid] = null;
                    } else {
                        currentEquipmentMap[item.itemLocationHrid] = item;
                    }
                }
            }
            if (settingsMap.checkEquipment.isTrue) {
                checkEquipment();
            }
        } else if (obj && obj.type === "new_battle") {
            GM_setValue("new_battle", message); // This is the only place to get other party members' equipted consumables.

            if (settingsMap.showDamage.isTrue) {
                if (startTime && endTime) {
                    totalDuration += (endTime - startTime) / 1000;
                }
                startTime = Date.now();
                endTime = null;
                monstersHP = obj.monsters.map((monster) => monster.currentHitpoints);
                if (!players || players.length === 0) {
                    players = obj.players;
                }
                const playerIndices = Object.keys(players);
                playerIndices.forEach((userIndex) => {
                    players[userIndex].currentAction = players[userIndex].preparingAbilityHrid
                        ? players[userIndex].preparingAbilityHrid
                        : players[userIndex].isPreparingAutoAttack
                        ? "auto"
                        : "idle";
                });
                monsters = obj.monsters;
                if (!totalDamage.length) {
                    totalDamage = new Array(players.length).fill(0);
                }
                // Accumulate monster counts and store evasion ratings by combat style
                obj.monsters.forEach((monster) => {
                    const name = monster.name;
                    monsterCounts[name] = (monsterCounts[name] || 0) + 1;
                    if (!monsterEvasion[name]) {
                        monsterEvasion[name] = {};
                    }
                    players.forEach((player) => {
                        if (player.combatDetails && player.combatDetails.combatStats.combatStyleHrids) {
                            player.combatDetails.combatStats.combatStyleHrids.forEach((styleHrid) => {
                                const style = styleHrid.split("/").pop(); // Get the combat style (e.g., "ranged")
                                const evasionRating = monster.combatDetails[`${style}EvasionRating`];
                                monsterEvasion[name][player.name + "-" + style] = evasionRating;
                            });
                        }
                    });
                });
            }
        } else if (obj && obj.type === "profile_shared") {
            let profileExportListString = GM_getValue("profile_export_list", null);
            let profileExportList = null;
            // Remove invalid
            // GM_setValue("profile_export_list", JSON.stringify(new Array())); // Remove stored profiles. Only for testing.
            if (profileExportListString) {
                profileExportList = JSON.parse(profileExportListString);
                if (!profileExportList || !profileExportList.filter) {
                    console.error("Found invalid profileExportList in store. profileExportList cleared.");
                    GM_setValue("profile_export_list", JSON.stringify(new Array()));
                }
            } else {
                GM_setValue("profile_export_list", JSON.stringify(new Array()));
            }

            obj.characterID = obj.profile.characterSkills[0].characterID;
            obj.characterName = obj.profile.sharableCharacter.name;
            obj.timestamp = Date.now();

            profileExportListString = GM_getValue("profile_export_list", null) || JSON.stringify(new Array());
            profileExportList = JSON.parse(profileExportListString);
            profileExportList = profileExportList.filter((item) => item.characterID !== obj.characterID);
            profileExportList.unshift(obj);
            if (profileExportList.length > 20) {
                profileExportList.pop();
            }
            // console.log(profileExportList);
            GM_setValue("profile_export_list", JSON.stringify(profileExportList));

            addExportButton(obj);

            if (settingsMap.profileBuildScore.isTrue) {
                showBuildScoreOnProfile(obj);
            }
        } else if (obj && obj.type === "battle_updated" && monstersHP.length) {
            /* Logging start */
            //     console.log("------");
            //     const mMap = obj.mMap;
            //     if (Object.keys(mMap).length === 0) {
            //         const playerIndices = Object.keys(obj.pMap);
            //         if (playerIndices.length === 0) {
            //             console.log(`【错误：无变化】`);
            //         }
            //         playerIndices.forEach((userIndex) => {
            //             const statusTxt = `${obj.pMap.isStunned ? "【眩晕】" : ""}${
            //                 obj.pMap[userIndex].abilityHrid ? "【" + obj.pMap[userIndex].abilityHrid.replace("/abilities/", "") + "】" : ""
            //             }${obj.pMap[userIndex].isAutoAtk ? "【普攻】" : ""}`;
            //             console.log(
            //                 `【玩家自行变化】${statusTxt} ${players[userIndex].name} 上个动作【${players[userIndex].currentAction.replace(
            //                     "/abilities/",
            //                     ""
            //                 )}】`
            //             );
            //         });
            //     }
            //     monstersHP.forEach((mHP, mIndex) => {
            //         const monster = mMap[mIndex];
            //         if (monster) {
            //             const playerIndices = Object.keys(obj.pMap);
            //             if (playerIndices.length === 0) {
            //                 const hpDiff = mHP - monster.cHP;
            //                 console.log(`【怪物自行变化】${monsters[mIndex].name} 自行变化 ${hpDiff} 点血量`);
            //             }
            //             playerIndices.forEach((userIndex) => {
            //                 const hpDiff = mHP - monster.cHP;
            //                 const statusTxt = `${obj.pMap.isStunned ? "【眩晕】" : ""}${
            //                     obj.pMap[userIndex].abilityHrid ? "【" + obj.pMap[userIndex].abilityHrid.replace("/abilities/", "") + "】" : ""
            //                 }${obj.pMap[userIndex].isAutoAtk ? "【普攻】" : ""}`;
            //                 if (hpDiff > 0) {
            //                     console.log(
            //                         `【伤害】${statusTxt} ${players[userIndex].name} 对 ${
            //                             monsters[mIndex].name
            //                         } 造成了 ${hpDiff} 点伤害 上个动作【${players[userIndex].currentAction.replace("/abilities/", "")}】`
            //                     );
            //                 } else if (hpDiff === 0) {
            //                     console.log(
            //                         `【Miss】${statusTxt} ${players[userIndex].name} 对 ${monsters[mIndex].name} MISS (造成0点伤害) 上个动作【${players[
            //                             userIndex
            //                         ].currentAction.replace("/abilities/", "")}】`
            //                     );
            //                 } else {
            //                     console.log(
            //                         `【治疗】${statusTxt} ${players[userIndex].name} 对 ${
            //                             monsters[mIndex].name
            //                         } 造成了 ${-hpDiff} 点治疗 上个动作【${players[userIndex].currentAction.replace("/abilities/", "")}】`
            //                     );
            //                 }
            //             });
            //         }
            //     });
            /* Logging end */
            if (settingsMap.showDamage.isTrue) {
                const mMap = obj.mMap;
                const pMap = obj.pMap;
                const playerIndices = Object.keys(obj.pMap);

                monstersHP.forEach((mHP, mIndex) => {
                    const monster = mMap[mIndex];
                    if (monster) {
                        const hpDiff = mHP - monster.cHP;
                        monstersHP[mIndex] = monster.cHP;
                        if (hpDiff > 0) {
                            if (playerIndices.length > 1) {
                                // Damage is resulted by ManaSpring from one of the players.
                                playerIndices.forEach((userIndex) => {
                                    const action = pMap[userIndex].abilityHrid
                                        ? pMap[userIndex].abilityHrid
                                        : pMap[userIndex].isAutoAtk
                                        ? "auto"
                                        : null;
                                    // console.log(`${players[userIndex].name} ${players[userIndex].currentAction} -> ${action}`);
                                    if (players[userIndex].currentAction !== action && players[userIndex].currentAction?.includes("mana_spring")) {
                                        if (!players[userIndex].damageMap) {
                                            players[userIndex].damageMap = new Map();
                                        }
                                        players[userIndex].damageMap.set(
                                            players[userIndex].currentAction,
                                            players[userIndex].damageMap.has(players[userIndex].currentAction)
                                                ? players[userIndex].damageMap.get(players[userIndex].currentAction) + hpDiff
                                                : hpDiff
                                        );
                                        totalDamage[userIndex] += hpDiff;
                                        // console.log("mana_spring by " + players[userIndex].name);
                                        // console.log(players[userIndex].damageMap);
                                    }
                                });
                            } else {
                                if (!players[playerIndices[0]].damageMap) {
                                    players[playerIndices[0]].damageMap = new Map();
                                }
                                players[playerIndices[0]].damageMap.set(
                                    players[playerIndices[0]].currentAction,
                                    players[playerIndices[0]].damageMap.has(players[playerIndices[0]].currentAction)
                                        ? players[playerIndices[0]].damageMap.get(players[playerIndices[0]].currentAction) + hpDiff
                                        : hpDiff
                                );
                                totalDamage[playerIndices[0]] += hpDiff;
                                // console.log(players[playerIndices[0]].damageMap);
                            }
                        }
                    }
                });

                playerIndices.forEach((userIndex) => {
                    players[userIndex].currentAction = pMap[userIndex].abilityHrid
                        ? pMap[userIndex].abilityHrid
                        : pMap[userIndex].isAutoAtk
                        ? "auto"
                        : "idle";
                });
                endTime = Date.now();
                updateStatisticsPanel();
            }
        }
        return message;
    }

    /* 计算Networth */
    async function calculateNetworth() {
        const marketAPIJson = await fetchMarketJSON();
        if (!marketAPIJson) {
            console.error("calculateNetworth marketAPIJson is null");
            return;
        }

        let networthAsk = 0;
        let networthBid = 0;
        let marketListingsNetworthAsk = 0;
        let marketListingsNetworthBid = 0;
        let equippedNetworthAsk = 0;
        let equippedNetworthBid = 0;
        let inventoryNetworthAsk = 0;
        let inventoryNetworthBid = 0;

        for (const item of initData_characterItems) {
            const enhanceLevel = item.enhancementLevel;
            const itemName = initData_itemDetailMap[item.itemHrid].name;
            const marketPrices = marketAPIJson.market[itemName];
            if (enhanceLevel && enhanceLevel > 1) {
                input_data.item_hrid = item.itemHrid;
                input_data.stop_at = enhanceLevel;
                const best = await findBestEnhanceStrat(input_data);
                let totalCost = best?.totalCost;
                totalCost = totalCost ? Math.round(totalCost) : 0;
                if (item.itemLocationHrid !== "/item_locations/inventory") {
                    equippedNetworthAsk += item.count * (totalCost > 0 ? totalCost : 0);
                    equippedNetworthBid += item.count * (totalCost > 0 ? totalCost : 0);
                } else {
                    inventoryNetworthAsk += item.count * (totalCost > 0 ? totalCost : 0);
                    inventoryNetworthBid += item.count * (totalCost > 0 ? totalCost : 0);
                }
            } else if (marketPrices) {
                if (item.itemLocationHrid !== "/item_locations/inventory") {
                    equippedNetworthAsk += item.count * (marketPrices.ask > 0 ? marketPrices.ask : 0);
                    equippedNetworthBid += item.count * (marketPrices.bid > 0 ? marketPrices.bid : 0);
                } else {
                    inventoryNetworthAsk += item.count * (marketPrices.ask > 0 ? marketPrices.ask : 0);
                    inventoryNetworthBid += item.count * (marketPrices.bid > 0 ? marketPrices.bid : 0);
                }
            } else {
                console.log("calculateNetworth cannot find price of " + itemName);
            }
        }

        for (const item of initData_myMarketListings) {
            const itemName = initData_itemDetailMap[item.itemHrid]?.name;
            const quantity = item.orderQuantity - item.filledQuantity;
            const enhancementLevel = item.enhancementLevel;
            const marketPrices = marketAPIJson.market[itemName];
            if (!marketPrices) {
                console.log("calculateNetworth cannot get marketPrices of " + itemName);
                return;
            }
            if (item.isSell) {
                if (itemName === "Bag Of 10 Cowbells") {
                    marketPrices.ask *= 1 - 18 / 100;
                    marketPrices.bid *= 1 - 18 / 100;
                } else {
                    marketPrices.ask *= 1 - 2 / 100;
                    marketPrices.bid *= 1 - 2 / 100;
                }
                if (!enhancementLevel || enhancementLevel <= 1) {
                    marketListingsNetworthAsk += quantity * (marketPrices.ask > 0 ? marketPrices.ask : 0);
                    marketListingsNetworthBid += quantity * (marketPrices.bid > 0 ? marketPrices.bid : 0);
                } else {
                    input_data.item_hrid = item.itemHrid;
                    input_data.stop_at = enhancementLevel;
                    const best = await findBestEnhanceStrat(input_data);
                    let totalCost = best?.totalCost;
                    totalCost = totalCost ? Math.round(totalCost) : 0;
                    marketListingsNetworthAsk += quantity * (totalCost > 0 ? totalCost : 0);
                    marketListingsNetworthBid += quantity * (totalCost > 0 ? totalCost : 0);
                }
                marketListingsNetworthAsk += item.unclaimedCoinCount;
                marketListingsNetworthBid += item.unclaimedCoinCount;
            } else {
                marketListingsNetworthAsk += quantity * item.price;
                marketListingsNetworthBid += quantity * item.price;
                marketListingsNetworthAsk += item.unclaimedItemCount * (marketPrices.ask > 0 ? marketPrices.ask : 0);
                marketListingsNetworthBid += item.unclaimedItemCount * (marketPrices.bid > 0 ? marketPrices.bid : 0);
            }
        }

        networthAsk = equippedNetworthAsk + inventoryNetworthAsk + marketListingsNetworthAsk;
        networthBid = equippedNetworthBid + inventoryNetworthBid + marketListingsNetworthBid;

        /* 仓库搜索栏下方显示人物总结 */
        // Some code of networth summery is by Stella.
        const addInventorySummery = async (invElem) => {
            const [battleHouseScore, nonBattleHouseScore, abilityScore, equipmentScore] = await getSelfBuildScores(
                equippedNetworthAsk * 0.5 + equippedNetworthBid * 0.5
            );
            const totalScore = battleHouseScore + abilityScore + equipmentScore;
            const totalHouseScore = battleHouseScore + nonBattleHouseScore;
            const totalNetworth = networthAsk * 0.5 + networthBid * 0.5 + (totalHouseScore + abilityScore) * 1000000;

            invElem.insertAdjacentHTML(
                "beforebegin",
                `<div style="text-align: left; color: ${SCRIPT_COLOR_MAIN}; font-size: 14px;">
                    <!-- 战力打造分 -->
                    <div style="cursor: pointer; font-weight: bold" id="toggleScores">${
                        isZH ? "+ 战力打造分: " : "+ Character Build Score: "
                    }${totalScore.toFixed(1)}</div>
                    <div id="buildScores" style="display: none; margin-left: 20px;">
                            <div>${isZH ? "房子分：" : "House score: "}${battleHouseScore.toFixed(1)}</div>
                            <div>${isZH ? "技能分：" : "Ability score: "}${abilityScore.toFixed(1)}</div>
                            <div>${isZH ? "装备分：" : "Equipment score: "}${equipmentScore.toFixed(1)}</div>
                    </div>

                    <!-- 总NetWorth -->
                    <div style="cursor: pointer; font-weight: bold;" id="toggleNetWorth">
                        ${isZH ? "+ 总NetWorth：" : "+ Total NetWorth: "}${numberFormatter(totalNetworth)}
                    </div>

                    <div id="netWorthDetails" style="display: none; margin-left: 20px;">
                        <!-- 流动资产 -->
                        <div style="cursor: pointer;" id="toggleCurrentAssets">
                            ${isZH ? "+ 流动资产价值" : "+ Current assets value"}
                        </div>
                        <div id="currentAssets" style="display: none; margin-left: 20px;">
                            <div>${isZH ? "装备价值：" : "Equipment value: "}${numberFormatter(equippedNetworthAsk)}</div>
                            <div>${isZH ? "库存价值：" : "Inventory value: "}${numberFormatter(inventoryNetworthAsk)}</div>
                            <div>${isZH ? "订单价值：" : "Market listing value: "}${numberFormatter(marketListingsNetworthAsk)}</div>
                        </div>

                        <!-- 非流动资产 -->
                        <div style="cursor: pointer;" id="toggleNonCurrentAssets">
                            ${isZH ? "+ 非流动资产价值" : "+ Fixed assets value"}
                        </div>
                        <div id="nonCurrentAssets" style="display: none; margin-left: 20px;">
                            <div>${isZH ? "房子价值：" : "Houses value: "}${numberFormatter(totalHouseScore * 1000000)}</div>
                            <div>${isZH ? "技能价值：" : "Abilities value: "}${numberFormatter(abilityScore * 1000000)}</div>
                        </div>
                    </div>
                </div>`
            );

            // 监听点击事件，控制折叠和展开
            const toggleScores = document.getElementById("toggleScores");
            const ScoreDetails = document.getElementById("buildScores");
            const toggleButton = document.getElementById("toggleNetWorth");
            const netWorthDetails = document.getElementById("netWorthDetails");
            const toggleCurrentAssets = document.getElementById("toggleCurrentAssets");
            const currentAssets = document.getElementById("currentAssets");
            const toggleNonCurrentAssets = document.getElementById("toggleNonCurrentAssets");
            const nonCurrentAssets = document.getElementById("nonCurrentAssets");

            toggleScores.addEventListener("click", () => {
                const isCollapsed = ScoreDetails.style.display === "none";
                ScoreDetails.style.display = isCollapsed ? "block" : "none";
                toggleScores.textContent = (isCollapsed ? "↓ " : "+ ") + (isZH ? "战力打造分: " : "Character Build Score: ") + totalScore.toFixed(1);
            });

            toggleButton.addEventListener("click", () => {
                const isCollapsed = netWorthDetails.style.display === "none";
                netWorthDetails.style.display = isCollapsed ? "block" : "none";
                toggleButton.textContent =
                    (isCollapsed ? "↓ " : "+ ") + (isZH ? "总NetWorth：" : "Total NetWorth: ") + numberFormatter(totalNetworth);
                currentAssets.style.display = isCollapsed ? "block" : "none";
                toggleCurrentAssets.textContent = (isCollapsed ? "↓ " : "+ ") + (isZH ? "流动资产价值" : "Current assets value");
                nonCurrentAssets.style.display = isCollapsed ? "block" : "none";
                toggleNonCurrentAssets.textContent = (isCollapsed ? "↓ " : "+ ") + (isZH ? "非流动资产价值" : "Fixed assets value");
            });

            toggleCurrentAssets.addEventListener("click", () => {
                const isCollapsed = currentAssets.style.display === "none";
                currentAssets.style.display = isCollapsed ? "block" : "none";
                toggleCurrentAssets.textContent = (isCollapsed ? "↓ " : "+ ") + (isZH ? "流动资产价值" : "Current assets value");
            });

            toggleNonCurrentAssets.addEventListener("click", () => {
                const isCollapsed = nonCurrentAssets.style.display === "none";
                nonCurrentAssets.style.display = isCollapsed ? "block" : "none";
                toggleNonCurrentAssets.textContent = (isCollapsed ? "↓ " : "+ ") + (isZH ? "非流动资产价值" : "Fixed assets value");
            });
        };

        const waitForHeader = () => {
            const targetNode = document.querySelector("div.Header_totalLevel__8LY3Q");
            if (targetNode) {
                targetNode.insertAdjacentHTML(
                    "afterend",
                    `<div style="font-size: 13px; font-weight: 500; color: ${SCRIPT_COLOR_MAIN}; text-wrap: nowrap;">Current Assets: ${numberFormatter(
                        networthAsk
                    )} / ${numberFormatter(networthBid)}${`<div id="script_api_fail_alert" style="color: ${SCRIPT_COLOR_ALERT};">${
                        isZH ? "无法从API更新市场数据" : "Can't update market prices"
                    }</div>`}</div>`
                );

                const alertDiv = document.querySelector("div#script_api_fail_alert");
                if (alertDiv) {
                    alertDiv.style.cursor = "pointer";
                    alertDiv.addEventListener("click", () => {
                        showApiFailAlertPopup();
                    });

                    if (isUsingExpiredMarketJson && settingsMap.networkAlert.isTrue) {
                        alertDiv.style.display = "block";
                    } else {
                        alertDiv.style.display = "none";
                    }
                }

                document.body.insertAdjacentHTML(
                    "beforeend",
                    `<div id="script_api_fail_popout" style="display: none; position: absolute; top: 50px; left: 0; padding: 10px; background: white; border: 1px solid black; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2); border-radius: 8px; white-space: pre-wrap;"></div>`
                );

                const popout = document.querySelector("#script_api_fail_popout");
                if (popout) {
                    popout.addEventListener("click", function () {
                        const popout = document.querySelector("#script_api_fail_popout");
                        popout.style.display = popout.style.display === "block" ? "none" : "block";
                    });
                }
            } else {
                setTimeout(waitForHeader, 200);
            }
        };
        waitForHeader();

        function showApiFailAlertPopup() {
            console.log(reasonForUsingExpiredMarketJson);
            const popout = document.querySelector("#script_api_fail_popout");
            if (popout) {
                popout.textContent = reasonForUsingExpiredMarketJson;
                popout.style.display = "block";
            }
        }

        const waitForInv = () => {
            const targetNodes = document.querySelectorAll("div.Inventory_items__6SXv0");
            for (const node of targetNodes) {
                if (settingsMap.invWorth.isTrue) {
                    if (!node.classList.contains("script_buildScore_added")) {
                        node.classList.add("script_buildScore_added");
                        addInventorySummery(node);
                    }
                }
                if (settingsMap.invSort.isTrue) {
                    if (!node.classList.contains("script_invSort_added")) {
                        node.classList.add("script_invSort_added");
                        addInvSortButton(node);
                    }
                }
            }
            setTimeout(waitForInv, 1000);
        };
        waitForInv();
    }

    /* 仓库物品排序 */
    // by daluo, bot7420
    async function addInvSortButton(invElem) {
        const price_data = await fetchMarketJSON();
        if (!price_data || !price_data.market) {
            console.error("addInvSortButton fetchMarketJSON null");
            return;
        }

        const askButton = `<button
            id="script_sortByAsk_btn"
            style="border-radius: 3px; background-color: ${SCRIPT_COLOR_MAIN}; color: black;">
            ${isZH ? "出售价" : "Ask"}
            </button>`;
        const bidButton = `<button
            id="script_sortByBid_btn"
            style="border-radius: 3px; background-color: ${SCRIPT_COLOR_MAIN}; color: black;">
            ${isZH ? "收购价" : "Bid"}
            </button>`;
        const noneButton = `<button
            id="script_sortByNone_btn"
            style="border-radius: 3px; background-color: ${SCRIPT_COLOR_MAIN}; color: black;">
            ${isZH ? "无" : "None"}
            </button>`;
        const buttonsDiv = `<div style="color: ${SCRIPT_COLOR_MAIN}; font-size: 14px; text-align: left; ">${
            isZH ? "物品排序：" : "Sort items by: "
        }${askButton} ${bidButton} ${noneButton}</div>`;
        invElem.insertAdjacentHTML("beforebegin", buttonsDiv);

        invElem.parentElement.querySelector("button#script_sortByAsk_btn").addEventListener("click", function (e) {
            sortItemsBy("ask");
        });
        invElem.parentElement.querySelector("button#script_sortByBid_btn").addEventListener("click", function (e) {
            sortItemsBy("bid");
        });
        invElem.parentElement.querySelector("button#script_sortByNone_btn").addEventListener("click", function (e) {
            sortItemsBy("none");
        });

        const sortItemsBy = (order) => {
            for (const typeDiv of invElem.children) {
                const typeName = getOriTextFromElement(typeDiv.getElementsByClassName("Inventory_categoryButton__35s1x")[0]);
                const notNeedSortTypes = ["Loots", "Currencies", "Equipment"];
                if (notNeedSortTypes.includes(typeName)) {
                    continue;
                }

                typeDiv.querySelector(".Inventory_label__XEOAx").style.order = Number.MIN_SAFE_INTEGER;

                const itemElems = typeDiv.querySelectorAll(".Item_itemContainer__x7kH1");
                for (const itemElem of itemElems) {
                    let itemName = itemElem.querySelector("svg").attributes["aria-label"].value;
                    if (isZHInGameSetting) {
                        itemName = getItemEnNameFromZhName(itemName);
                    }
                    let itemCount = itemElem.querySelector(".Item_count__1HVvv").innerText;
                    itemCount = Number(itemCount.toLowerCase().replaceAll("k", "000").replaceAll("m", "000000"));
                    const askPrice = price_data.market[itemName] && price_data.market[itemName].ask > 0 ? price_data.market[itemName].ask : 0;
                    const bidPrice = price_data.market[itemName] && price_data.market[itemName].bid > 0 ? price_data.market[itemName].bid : 0;
                    const itemAskmWorth = askPrice * itemCount;
                    const itemBidWorth = bidPrice * itemCount;

                    // 价格角标
                    if (!itemElem.querySelector("#script_stack_price")) {
                        const priceElemHTML = `<div
                            id="script_stack_price"
                            style="z-index: 1; position: absolute; top: 2px; left: 2px; text-align: left;">
                        </div>`;
                        itemElem.querySelector(".Item_item__2De2O.Item_clickable__3viV6").insertAdjacentHTML("beforeend", priceElemHTML);
                    }
                    const priceElem = itemElem.querySelector("#script_stack_price");

                    // 排序
                    if (order === "ask") {
                        itemElem.style.order = -itemAskmWorth;
                        priceElem.textContent = numberFormatter(itemAskmWorth);
                    } else if (order === "bid") {
                        itemElem.style.order = -itemBidWorth;
                        priceElem.textContent = numberFormatter(itemBidWorth);
                    } else if (order === "none") {
                        itemElem.style.order = 0;
                        priceElem.textContent = "";
                    }
                }
            }
        };
    }

    /* 计算打造分 */
    // BuildScore algorithm by Ratatatata (https://greasyfork.org/zh-CN/scripts/511240)
    async function getSelfBuildScores(equippedNetworth) {
        // 房子分：战斗相关房子升级所需总金币
        const battleHouses = ["dining_room", "library", "dojo", "gym", "armory", "archery_range", "mystical_study"];
        let battleHouseScore = 0;
        let nonBattleHouseScore = 0;
        for (const key in initData_characterHouseRoomMap) {
            if (battleHouses.some((house) => initData_characterHouseRoomMap[key].houseRoomHrid.includes(house))) {
                battleHouseScore += (await getHouseFullBuildPrice(initData_characterHouseRoomMap[key])) / 1000000;
            } else {
                nonBattleHouseScore += (await getHouseFullBuildPrice(initData_characterHouseRoomMap[key])) / 1000000;
            }
        }

        // 技能分：当前使用的战斗技能所需技能书总价，单位M
        let abilityScore = 0;
        try {
            abilityScore = await calculateAbilityScore();
        } catch (error) {
            console.error("Error in calculateAbilityScore()", error);
        }
        // console.log("abilityScore " + abilityScore);

        // 装备分：当前身上装备总价，单位M
        let equipmentScore = equippedNetworth / 1000000;
        // console.log("equipmentScore " + equipmentScore);

        return [battleHouseScore, nonBattleHouseScore, abilityScore, equipmentScore];
    }

    // 计算单个房子完整造价
    async function getHouseFullBuildPrice(house) {
        const marketAPIJson = await fetchMarketJSON();
        if (!marketAPIJson) {
            return 0;
        }
        const clientObj = JSON.parse(GM_getValue("init_client_data", ""));

        const upgradeCostsMap = clientObj.houseRoomDetailMap[house.houseRoomHrid].upgradeCostsMap;
        const level = house.level;

        let cost = 0;
        for (let i = 1; i <= level; i++) {
            for (const item of upgradeCostsMap[i]) {
                const itemName = clientObj.itemDetailMap[item.itemHrid].name;
                const marketPrices = marketAPIJson.market[itemName];
                if (marketPrices) {
                    cost += item.count * getWeightedMarketPrice(marketPrices);
                } else {
                    console.log("getHouseFullBuildPrice cannot find price of " + itemName);
                }
            }
        }
        return cost;
    }

    function getWeightedMarketPrice(marketPrices, ratio = 0.5) {
        let ask = marketPrices.ask;
        let bid = marketPrices.bid;
        if (ask > 0 && bid < 0) {
            bid = ask;
        }
        if (bid > 0 && ask < 0) {
            ask = bid;
        }
        const weightedPrice = ask * ratio + bid * (1 - ratio);
        return weightedPrice;
    }

    // 技能价格计算
    async function calculateAbilityScore() {
        const marketAPIJson = await fetchMarketJSON();
        if (!marketAPIJson) {
            return 0;
        }
        let exp_50_skill = ["poke", "scratch", "smack", "quick_shot", "water_strike", "fireball", "entangle", "minor_heal"];
        const getNeedBooksToLevel = (targetLevel, abilityPerBookExp) => {
            const needExp = initData_levelExperienceTable[targetLevel];
            let needBooks = needExp / abilityPerBookExp;
            needBooks += 1;
            return needBooks.toFixed(1);
        };
        // 技能净值
        let price = 0;
        initData_combatAbilities.forEach((item) => {
            let numBooks = 0;
            if (exp_50_skill.some((skill) => item.abilityHrid.includes(skill))) {
                numBooks = getNeedBooksToLevel(item.level, 50);
            } else {
                numBooks = getNeedBooksToLevel(item.level, 500);
            }
            const itemName = initData_itemDetailMap[item.abilityHrid.replace("/abilities/", "/items/")].name;
            const marketPrices = marketAPIJson.market[itemName];
            if (marketPrices) {
                price += numBooks * getWeightedMarketPrice(marketPrices);
            } else {
                console.log("calculateAbilityScore cannot find price of " + itemName);
            }
            // console.log(`技能:${itemName},价值${numBooks * (marketPrices.bid > 0 ? marketPrices.bid : 0)}`)
        });

        return (price /= 1000000);
    }

    /* 查看人物面板显示打造分 */
    // by Ratatatata (https://greasyfork.org/zh-CN/scripts/511240)
    function getInfoPanel() {
        const selectedElement = document.querySelector(`div.SharableProfile_overviewTab__W4dCV`);
        if (selectedElement) {
            return selectedElement;
        } else {
            return new Promise((resolve) => {
                setTimeout(() => resolve(getInfoPanel()), 500);
            });
        }
    }

    async function showBuildScoreOnProfile(profile_shared_obj) {
        const [battleHouseScore, abilityScore, equipmentScore] = await getBuildScoreByProfile(profile_shared_obj);
        const totalBuildScore = battleHouseScore + abilityScore + equipmentScore;
        const isEquipmentHiddenText = abilityScore + equipmentScore <= 0 ? (isZH ? " (装备隐藏)" : " (Equipment hidden)") : " ";

        const panel = await getInfoPanel();
        panel.insertAdjacentHTML(
            "beforeend",
            `<div style="text-align: left; color: ${SCRIPT_COLOR_MAIN}; font-size: 14px;">
                <div style="cursor: pointer; font-weight: bold" id="toggleScores_profile">${
                    isZH ? "+ 战力打造分: " : "+ Character Build Score: "
                }${totalBuildScore.toFixed(1)}${isEquipmentHiddenText}</div>
                <div id="buildScores_profile" style="display: none; margin-left: 20px;">
                        <div>${isZH ? "房子分：" : "House score: "}${battleHouseScore.toFixed(1)}</div>
                        <div>${isZH ? "技能分：" : "Ability score: "}${abilityScore.toFixed(1)}</div>
                        <div>${isZH ? "装备分：" : "Equipment score: "}${equipmentScore.toFixed(1)}</div>
                </div>
            </div>`
        );
        // 监听点击事件，控制折叠和展开
        const toggleScores = document.getElementById("toggleScores_profile");
        const ScoreDetails = document.getElementById("buildScores_profile");
        toggleScores.addEventListener("click", () => {
            const isCollapsed = ScoreDetails.style.display === "none";
            ScoreDetails.style.display = isCollapsed ? "block" : "none";
            toggleScores.textContent =
                (isCollapsed ? "↓ " : "+ ") +
                (isZH ? "战力打造分: " : "Character Build Score: ") +
                totalBuildScore.toFixed(1) +
                isEquipmentHiddenText;
        });
    }

    // 计算打造分
    async function getBuildScoreByProfile(profile_shared_obj) {
        // 房子分：战斗相关房子升级所需总金币
        const battleHouses = ["dining_room", "library", "dojo", "gym", "armory", "archery_range", "mystical_study"];
        let battleHouseScore = 0;
        for (const key in profile_shared_obj.profile.characterHouseRoomMap) {
            if (battleHouses.some((house) => profile_shared_obj.profile.characterHouseRoomMap[key].houseRoomHrid.includes(house))) {
                battleHouseScore += (await getHouseFullBuildPrice(profile_shared_obj.profile.characterHouseRoomMap[key])) / 1000000;
            }
        }
        // console.log("房屋分：" + battleHouseScore);
        if (profile_shared_obj.profile.hideWearableItems) {
            // 对方未展示装备
            return [battleHouseScore, 0, 0];
        }

        // 技能分：当前使用的战斗技能所需技能书总价，单位M
        let abilityScore = 0;
        try {
            abilityScore = await calculateSkill(profile_shared_obj);
            // console.log("技能分：" + abilityScore);
        } catch (error) {
            console.error("Error in calculate skill:", error);
        }

        // 装备分：当前身上装备总价，单位M
        let equipmentScore = 0;
        try {
            equipmentScore = await calculateEquipment(profile_shared_obj);
            // console.log("装备分：" + equipmentScore);
        } catch (error) {
            console.error("Error in calculateEquipmen:", error);
        }

        return [battleHouseScore, abilityScore, equipmentScore];
    }

    // 技能价格计算
    async function calculateSkill(profile_shared_obj) {
        const marketAPIJson = await fetchMarketJSON();
        if (!marketAPIJson) {
            return 0;
        }
        let obj = profile_shared_obj.profile;
        let exp_50_skill = ["poke", "scratch", "smack", "quick_shot", "water_strike", "fireball", "entangle", "minor_heal"];
        const getNeedBooksToLevel = (targetLevel, abilityPerBookExp) => {
            const needExp = initData_levelExperienceTable[targetLevel];
            let needBooks = needExp / abilityPerBookExp;
            needBooks += 1;
            return needBooks.toFixed(1);
        };
        // 技能净值
        let price = 0;
        obj.equippedAbilities.forEach((item) => {
            let numBooks = 0;
            if (exp_50_skill.some((skill) => item.abilityHrid.includes(skill))) {
                numBooks = getNeedBooksToLevel(item.level, 50);
            } else {
                numBooks = getNeedBooksToLevel(item.level, 500);
            }
            const itemName = initData_itemDetailMap[item.abilityHrid.replace("/abilities/", "/items/")].name;
            const marketPrices = marketAPIJson.market[itemName];
            if (marketPrices) {
                price += numBooks * getWeightedMarketPrice(marketPrices);
            } else {
                console.log("calculateSkill cannot find price of " + itemName);
            }
            // console.log(`技能:${itemName},价值${numBooks * (marketPrices.bid > 0 ? marketPrices.bid : 0)}`)
        });

        return (price /= 1000000);
    }

    // 装备价格计算
    async function calculateEquipment(profile_shared_obj) {
        const marketAPIJson = await fetchMarketJSON();
        if (!marketAPIJson) {
            return 0;
        }
        let obj = profile_shared_obj.profile;
        // 装备净值
        let networthAsk = 0;
        let networthBid = 0;
        for (const key in obj.wearableItemMap) {
            let item = obj.wearableItemMap[key];
            const enhanceLevel = obj.wearableItemMap[key].enhancementLevel;
            const itemName = initData_itemDetailMap[obj.wearableItemMap[key].itemHrid].name;
            const marketPrices = marketAPIJson.market[itemName];

            if (enhanceLevel && enhanceLevel > 1) {
                input_data.item_hrid = item.itemHrid;
                input_data.stop_at = enhanceLevel;
                const best = await findBestEnhanceStrat(input_data);
                let totalCost = best?.totalCost;
                totalCost = totalCost ? Math.round(totalCost) : 0;
                networthAsk += item.count * (totalCost > 0 ? totalCost : 0);
                networthBid += item.count * (totalCost > 0 ? totalCost : 0);
            } else if (marketPrices) {
                networthAsk += item.count * (marketPrices.ask > 0 ? marketPrices.ask : 0);
                networthBid += item.count * (marketPrices.bid > 0 ? marketPrices.bid : 0);
            } else {
                console.log("calculateEquipment cannot find price of " + itemName);
            }
        }

        return (networthAsk * 0.5 + networthBid * 0.5) / 1000000;
    }

    /* 显示当前动作总时间 */
    const showTotalActionTime = () => {
        const targetNode = document.querySelector("div.Header_actionName__31-L2");
        if (targetNode) {
            console.log("start observe action progress bar");
            calculateTotalTime(targetNode);
            new MutationObserver((mutationsList) =>
                mutationsList.forEach((mutation) => {
                    calculateTotalTime();
                })
            ).observe(targetNode, { characterData: true, subtree: true, childList: true });
        } else {
            setTimeout(showTotalActionTime, 200);
        }
    };

    function calculateTotalTime() {
        const targetNode = document.querySelector("div.Header_actionName__31-L2 > div.Header_displayName__1hN09");
        if (targetNode.textContent.includes("[")) {
            return;
        }

        let totalTimeStr = "Error";
        const content = targetNode.innerText;
        const match = content.match(/\((\d+)\)/);
        if (match) {
            const numOfTimes = +match[1];
            const timePerActionSec = +getOriTextFromElement(document.querySelector(".ProgressBar_text__102Yn")).match(/[\d\.]+/)[0];
            const actionHrid = currentActionsHridList[0].actionHrid;
            let effBuff = 1 + getTotalEffiPercentage(actionHrid) / 100;
            if (actionHrid.includes("enhanc")) {
                effBuff = 1;
            }
            const actualNumberOfTimes = Math.round(numOfTimes / effBuff);
            const totalTimeSeconds = actualNumberOfTimes * timePerActionSec;
            totalTimeStr = " [" + timeReadable(totalTimeSeconds) + "]";

            const currentTime = new Date();
            currentTime.setSeconds(currentTime.getSeconds() + totalTimeSeconds);
            totalTimeStr += ` ${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}:${String(
                currentTime.getSeconds()
            ).padStart(2, "0")}`;
        } else {
            totalTimeStr = " [∞]";
        }

        targetNode.textContent += totalTimeStr;
    }

    function timeReadable(sec) {
        if (sec >= 86400) {
            return Number(sec / 86400).toFixed(1) + (isZH ? " 天" : " days");
        }
        const d = new Date(Math.round(sec * 1000));
        function pad(i) {
            return ("0" + i).slice(-2);
        }
        let str = d.getUTCHours() + "h " + pad(d.getUTCMinutes()) + "m " + pad(d.getUTCSeconds()) + "s";
        return str;
    }

    GM_addStyle(`div.Header_actionName__31-L2 {
        overflow: visible !important;
        white-space: normal !important;
        height: auto !important;
      }`);

    GM_addStyle(`span.NavigationBar_label__1uH-y {
        width: 10px !important;
      }`);

    /* 物品 ToolTips */
    const tooltipObserver = new MutationObserver(async function (mutations) {
        for (const mutation of mutations) {
            for (const added of mutation.addedNodes) {
                if (added.classList.contains("MuiTooltip-popper")) {
                    if (added.querySelector("div.ItemTooltipText_name__2JAHA")) {
                        await handleTooltipItem(added);
                    } else if (added.querySelector("div.QueuedActions_queuedActionsEditMenu__3OoQH")) {
                        handleActionQueueMenue(added.querySelector("div.QueuedActions_queuedActionsEditMenu__3OoQH"));
                    }
                }
            }
        }
    });
    tooltipObserver.observe(document.body, { attributes: false, childList: true, characterData: false });

    const actionHridToToolsSpeedBuffNamesMap = {
        "/action_types/brewing": "brewingSpeed",
        "/action_types/cheesesmithing": "cheesesmithingSpeed",
        "/action_types/cooking": "cookingSpeed",
        "/action_types/crafting": "craftingSpeed",
        "/action_types/foraging": "foragingSpeed",
        "/action_types/milking": "milkingSpeed",
        "/action_types/tailoring": "tailoringSpeed",
        "/action_types/woodcutting": "woodcuttingSpeed",
        "/action_types/alchemy": "alchemySpeed",
    };

    const actionHridToHouseNamesMap = {
        "/action_types/brewing": "/house_rooms/brewery",
        "/action_types/cheesesmithing": "/house_rooms/forge",
        "/action_types/cooking": "/house_rooms/kitchen",
        "/action_types/crafting": "/house_rooms/workshop",
        "/action_types/foraging": "/house_rooms/garden",
        "/action_types/milking": "/house_rooms/dairy_barn",
        "/action_types/tailoring": "/house_rooms/sewing_parlor",
        "/action_types/woodcutting": "/house_rooms/log_shed",
        "/action_types/alchemy": "/house_rooms/laboratory",
    };

    const itemEnhanceLevelToBuffBonusMap = {
        0: 0,
        1: 2,
        2: 4.2,
        3: 6.6,
        4: 9.2,
        5: 12.0,
        6: 15.0,
        7: 18.2,
        8: 21.6,
        9: 25.2,
        10: 29.0,
        11: 33.0,
        12: 37.2,
        13: 41.6,
        14: 46.2,
        15: 51.0,
        16: 56.0,
        17: 61.2,
        18: 66.6,
        19: 72.2,
        20: 78.0,
    };

    function getToolsSpeedBuffByActionHrid(actionHrid) {
        let totalBuff = 0;
        for (const item of initData_characterItems) {
            if (item.itemLocationHrid.includes("_tool")) {
                const buffName = actionHridToToolsSpeedBuffNamesMap[initData_actionDetailMap[actionHrid].type];
                const enhanceBonus = 1 + itemEnhanceLevelToBuffBonusMap[item.enhancementLevel] / 100;
                const buff = initData_itemDetailMap[item.itemHrid].equipmentDetail.noncombatStats[buffName] || 0;
                totalBuff += buff * enhanceBonus;
            }
        }
        return Number(totalBuff * 100).toFixed(1);
    }

    function getItemEffiBuffByActionHrid(actionHrid) {
        let buff = 0;
        const propertyName = initData_actionDetailMap[actionHrid].type.replace("/action_types/", "") + "Efficiency";
        for (const item of initData_characterItems) {
            if (item.itemLocationHrid === "/item_locations/inventory") {
                continue;
            }
            const itemDetail = initData_itemDetailMap[item.itemHrid];

            const specificStat = itemDetail?.equipmentDetail?.noncombatStats[propertyName];
            if (specificStat && specificStat > 0) {
                let enhanceBonus = 1;
                if (item.itemLocationHrid.includes("earrings") || item.itemLocationHrid.includes("ring") || item.itemLocationHrid.includes("neck")) {
                    enhanceBonus = 1 + (itemEnhanceLevelToBuffBonusMap[item.enhancementLevel] * 5) / 100;
                } else {
                    enhanceBonus = 1 + itemEnhanceLevelToBuffBonusMap[item.enhancementLevel] / 100;
                }
                buff += specificStat * enhanceBonus;
            }

            const skillingStat = itemDetail?.equipmentDetail?.noncombatStats["skillingEfficiency"];
            if (skillingStat && skillingStat > 0) {
                let enhanceBonus = 1;
                if (item.itemLocationHrid.includes("earrings") || item.itemLocationHrid.includes("ring") || item.itemLocationHrid.includes("neck")) {
                    enhanceBonus = 1 + (itemEnhanceLevelToBuffBonusMap[item.enhancementLevel] * 5) / 100;
                } else {
                    enhanceBonus = 1 + itemEnhanceLevelToBuffBonusMap[item.enhancementLevel] / 100;
                }
                buff += skillingStat * enhanceBonus;
            }
        }
        return Number(buff * 100).toFixed(1);
    }

    function getHousesEffBuffByActionHrid(actionHrid) {
        const houseName = actionHridToHouseNamesMap[initData_actionDetailMap[actionHrid].type];
        if (!houseName) {
            return 0;
        }
        const house = initData_characterHouseRoomMap[houseName];
        if (!house) {
            return 0;
        }
        return house.level * 1.5;
    }

    function getTeaBuffsByActionHrid(actionHrid) {
        const teaBuffs = {
            efficiency: 0, // Efficiency tea, specific teas, -Artisan tea.
            quantity: 0, // Gathering tea, Gourmet tea.
            lessResource: 0, // Artisan tea.
            extraExp: 0, // Wisdom tea. Not used.
            upgradedProduct: 0, // Processing tea. Not used.
        };

        const actionTypeId = initData_actionDetailMap[actionHrid].type;
        const teaList = initData_actionTypeDrinkSlotsMap[actionTypeId];
        for (const tea of teaList) {
            if (!tea || !tea.itemHrid) {
                continue;
            }

            for (const buff of initData_itemDetailMap[tea.itemHrid].consumableDetail.buffs) {
                if (buff.typeHrid === "/buff_types/artisan") {
                    teaBuffs.lessResource += buff.flatBoost * 100;
                } else if (buff.typeHrid === "/buff_types/action_level") {
                    teaBuffs.efficiency -= buff.flatBoost;
                } else if (buff.typeHrid === "/buff_types/gathering") {
                    teaBuffs.quantity += buff.flatBoost * 100;
                } else if (buff.typeHrid === "/buff_types/gourmet") {
                    teaBuffs.quantity += buff.flatBoost * 100;
                } else if (buff.typeHrid === "/buff_types/wisdom") {
                    teaBuffs.extraExp += buff.flatBoost * 100;
                } else if (buff.typeHrid === "/buff_types/processing") {
                    teaBuffs.upgradedProduct += buff.flatBoost * 100;
                } else if (buff.typeHrid === "/buff_types/efficiency") {
                    teaBuffs.efficiency += buff.flatBoost * 100;
                } else if (buff.typeHrid === `/buff_types/${actionTypeId.replace("/action_types/", "")}_level`) {
                    teaBuffs.efficiency += buff.flatBoost;
                }
            }
        }

        return teaBuffs;
    }

    async function handleTooltipItem(tooltip) {
        const itemNameElems = tooltip.querySelectorAll("div.ItemTooltipText_name__2JAHA span");

        // 带强化等级的物品单独处理
        if (itemNameElems.length > 1) {
            handleItemTooltipWithEnhancementLevel(tooltip);
            return;
        }

        const itemNameElem = itemNameElems[0];
        let itemName = getOriTextFromElement(itemNameElem);
        if (isZHInGameSetting) {
            itemName = getItemEnNameFromZhName(itemName);
        }

        let amount = 0;
        let insertAfterElem = null;
        const amountSpan = tooltip.querySelectorAll("span")[1];
        if (amountSpan) {
            amount = +getOriTextFromElement(amountSpan).split(": ")[1].replaceAll(THOUSAND_SEPERATOR, "");
            insertAfterElem = amountSpan.parentNode.nextSibling;
        } else {
            insertAfterElem = tooltip.querySelectorAll("span")[0].parentNode.nextSibling;
        }

        let appendHTMLStr = "";
        let marketJson = null;
        let ask = null;
        let bid = null;

        // 物品市场价格
        if (settingsMap.itemTooltip_prices.isTrue) {
            marketJson = await fetchMarketJSON();
            if (!marketJson || !marketJson.market) {
                console.error("jsonObj null");
            }
            ask = marketJson?.market[itemName]?.ask;
            bid = marketJson?.market[itemName]?.bid;
            appendHTMLStr += `
        <div style="color: ${SCRIPT_COLOR_TOOLTIP};">${isZH ? "日均价: " : "Daily average price: "}${numberFormatter(ask)} / ${numberFormatter(
                bid
            )} (${ask && ask > 0 ? numberFormatter(ask * amount) : ""} / ${bid && bid > 0 ? numberFormatter(bid * amount) : ""})</div>
        `;
        }

        // 消耗品回复计算
        if (settingsMap.showConsumTips.isTrue) {
            let itemDetail = null;
            for (const item of Object.values(initData_itemDetailMap)) {
                if (item.name === itemName) {
                    itemDetail = item;
                }
            }
            const hp = itemDetail?.consumableDetail?.hitpointRestore;
            const mp = itemDetail?.consumableDetail?.manapointRestore;
            const cd = itemDetail?.consumableDetail?.cooldownDuration;
            if (hp && cd) {
                const hpPerMiniute = (60 / (cd / 1000000000)) * hp;
                const pricePer100Hp = ask ? ask / (hp / 100) : null;
                const usePerday = (24 * 60 * 60) / (cd / 1000000000);
                appendHTMLStr += `<div style="color: ${SCRIPT_COLOR_TOOLTIP}; font-size: 10px;">${
                    pricePer100Hp ? pricePer100Hp.toFixed(0) + (isZH ? "金/100血, " : "coins/100hp, ") : ""
                }${hpPerMiniute.toFixed(0) + (isZH ? "血/分" : "hp/min")}, ${usePerday.toFixed(0)}${isZH ? "个/天" : "/day"}</div>`;
            } else if (mp && cd) {
                const mpPerMiniute = (60 / (cd / 1000000000)) * mp;
                const pricePer100Mp = ask ? ask / (mp / 100) : null;
                const usePerday = (24 * 60 * 60) / (cd / 1000000000);
                appendHTMLStr += `<div style="color: ${SCRIPT_COLOR_TOOLTIP}; font-size: 10px;">${
                    pricePer100Mp ? pricePer100Mp.toFixed(0) + (isZH ? "金/100蓝, " : "coins/100hp, ") : ""
                }${mpPerMiniute.toFixed(0) + (isZH ? "蓝/分" : "hp/min")}, ${usePerday.toFixed(0)}${isZH ? "个/天" : "/day"}</div>`;
            } else if (cd) {
                const usePerday = (24 * 60 * 60) / (cd / 1000000000);
                appendHTMLStr += `<div style="color: ${SCRIPT_COLOR_TOOLTIP}">${usePerday.toFixed(0)}${isZH ? "个/天" : "/day"}</div>`;
            }
        }

        // 生产利润计算
        if (
            settingsMap.itemTooltip_profit.isTrue &&
            marketJson &&
            getActionHridFromItemName(itemName) &&
            initData_actionDetailMap &&
            initData_itemDetailMap
        ) {
            // 区分生产类动作和采集类动作
            const isProduction =
                initData_actionDetailMap[getActionHridFromItemName(itemName)].inputItems &&
                initData_actionDetailMap[getActionHridFromItemName(itemName)].inputItems.length > 0;

            const actionHrid = getActionHridFromItemName(itemName);
            // 茶效率
            const teaBuffs = getTeaBuffsByActionHrid(actionHrid);

            // 原料信息
            let inputItems = [];
            let totalResourcesAskPricePerAction = 0;
            let totalResourcesBidPricePerAction = 0;

            if (isProduction) {
                inputItems = JSON.parse(JSON.stringify(initData_actionDetailMap[actionHrid].inputItems));
                for (const item of inputItems) {
                    item.name = initData_itemDetailMap[item.itemHrid].name;
                    item.zhName = ZHitemNames[item.itemHrid];
                    item.perAskPrice = marketJson?.market[item.name]?.ask;
                    item.perBidPrice = marketJson?.market[item.name]?.bid;
                    totalResourcesAskPricePerAction += item.perAskPrice * item.count;
                    totalResourcesBidPricePerAction += item.perBidPrice * item.count;
                }

                // 茶减少原料消耗（对于升级物品，不影响上一级物品消耗）
                const lessResourceBuff = teaBuffs.lessResource;
                totalResourcesAskPricePerAction *= 1 - lessResourceBuff / 100;
                totalResourcesBidPricePerAction *= 1 - lessResourceBuff / 100;

                // 上级物品作为原料
                const upgradedFromItemHrid = initData_actionDetailMap[actionHrid]?.upgradeItemHrid;
                let upgradedFromItemName = null;
                let upgradedFromItemZhName = null;
                let upgradedFromItemAsk = null;
                let upgradedFromItemBid = null;
                if (upgradedFromItemHrid) {
                    upgradedFromItemName = initData_itemDetailMap[upgradedFromItemHrid].name;
                    upgradedFromItemZhName = ZHitemNames[upgradedFromItemHrid];
                    upgradedFromItemAsk += marketJson?.market[upgradedFromItemName]?.ask;
                    upgradedFromItemBid += marketJson?.market[upgradedFromItemName]?.bid;
                    totalResourcesAskPricePerAction += upgradedFromItemAsk;
                    totalResourcesBidPricePerAction += upgradedFromItemBid;
                }

                appendHTMLStr += `<div style="color: ${SCRIPT_COLOR_TOOLTIP}; font-size: 10px;">${
                    isZH ? "原料市场价: " : "Source materials market price: "
                }${numberFormatter(totalResourcesAskPricePerAction)}  / ${numberFormatter(totalResourcesBidPricePerAction)}</div>`;

                for (const item of inputItems) {
                    appendHTMLStr += `
                    <div style="color: ${SCRIPT_COLOR_TOOLTIP}; font-size: 10px;"> ${isZH ? item.zhName : item.name} x${
                        item.count
                    }: ${numberFormatter(item.perAskPrice)} / ${numberFormatter(item.perBidPrice)}</div>
                    `;
                }

                if (upgradedFromItemHrid) {
                    appendHTMLStr += `
                    <div style="color: ${SCRIPT_COLOR_TOOLTIP}; font-size: 10px;"> ${
                        isZH ? upgradedFromItemZhName : upgradedFromItemName
                    }: ${numberFormatter(upgradedFromItemAsk)} / ${numberFormatter(upgradedFromItemBid)}</div>
                    `;
                }
            }

            // 消耗饮料
            let drinksConsumedPerHourAskPrice = 0;
            let drinksConsumedPerHourBidPrice = 0;

            const drinksList = initData_actionTypeDrinkSlotsMap[initData_actionDetailMap[actionHrid].type];
            for (const drink of drinksList) {
                if (!drink || !drink.itemHrid) {
                    continue;
                }
                const drinkName = initData_itemDetailMap[drink.itemHrid].name;
                drinksConsumedPerHourAskPrice += (marketJson?.market[drinkName]?.ask ?? 0) * 12;
                drinksConsumedPerHourBidPrice += (marketJson?.market[drinkName]?.bid ?? 0) * 12;
            }

            // 每小时动作数（包含工具缩减动作时间）
            const baseTimePerActionSec = initData_actionDetailMap[actionHrid].baseTimeCost / 1000000000;
            const toolPercent = getToolsSpeedBuffByActionHrid(actionHrid);
            const actualTimePerActionSec = baseTimePerActionSec / (1 + toolPercent / 100);
            let actionPerHour = 3600 / actualTimePerActionSec;

            // 每小时产品数
            let droprate = null;
            if (isProduction) {
                droprate = initData_actionDetailMap[actionHrid].outputItems[0].count;
            } else {
                droprate =
                    (initData_actionDetailMap[actionHrid].dropTable[0].minCount + initData_actionDetailMap[actionHrid].dropTable[0].maxCount) / 2;
            }
            let itemPerHour = actionPerHour * droprate;

            // 等级碾压提高效率（人物等级不及最低要求等级时，按最低要求等级计算）
            const requiredLevel = initData_actionDetailMap[actionHrid].levelRequirement.level;
            let currentLevel = requiredLevel;
            for (const skill of initData_characterSkills) {
                if (skill.skillHrid === initData_actionDetailMap[actionHrid].levelRequirement.skillHrid) {
                    currentLevel = skill.level;
                    break;
                }
            }
            const levelEffBuff = currentLevel - requiredLevel > 0 ? currentLevel - requiredLevel : 0;

            // 房子效率
            const houseEffBuff = getHousesEffBuffByActionHrid(actionHrid);

            // 特殊装备效率
            const itemEffiBuff = Number(getItemEffiBuffByActionHrid(actionHrid));

            // 总效率影响动作数/生产物品数
            actionPerHour *= 1 + (levelEffBuff + houseEffBuff + teaBuffs.efficiency + itemEffiBuff) / 100;
            itemPerHour *= 1 + (levelEffBuff + houseEffBuff + teaBuffs.efficiency + itemEffiBuff) / 100;

            // 茶额外产品数量（不消耗原料）
            const extraFreeItemPerHour = (itemPerHour * teaBuffs.quantity) / 100;

            // 出售市场税
            const bidAfterTax = bid * 0.98;

            // 每小时利润
            const profitPerHour =
                itemPerHour * (bidAfterTax - totalResourcesAskPricePerAction / droprate) +
                extraFreeItemPerHour * bidAfterTax -
                drinksConsumedPerHourAskPrice;

            appendHTMLStr += `<div style="color: ${SCRIPT_COLOR_TOOLTIP}; font-size: 10px;">${
                isZH
                    ? "生产利润(卖单价进、买单价出；不包括加工茶、社区增益、稀有掉落、袋子饮食增益；刷新网页更新人物数据)："
                    : "Production profit(Sell price in, bid price out; Not including processing tea, comm buffs, rare drops, pouch consumables buffs; Refresh page to update player data): "
            }</div>`;

            appendHTMLStr += `<div style="color: ${SCRIPT_COLOR_TOOLTIP}; font-size: 10px;">x${droprate} ${
                isZH ? "基础掉率" : "base drop rate,"
            } +${toolPercent}%${isZH ? "工具速度" : " tool speed,"} +${levelEffBuff}%${isZH ? "等级效率" : " level eff,"} +${houseEffBuff}%${
                isZH ? "房子效率" : " house eff,"
            } +${teaBuffs.efficiency}%${isZH ? "茶效率" : " tea eff,"} +${itemEffiBuff}%${isZH ? "装备效率" : " equipment eff,"} +${
                teaBuffs.quantity
            }%${isZH ? "茶额外数量" : " tea extra outcome,"} +${teaBuffs.lessResource}%${isZH ? "茶减少消耗" : " tea lower resource"}</div>`;

            appendHTMLStr += `<div style="color: ${SCRIPT_COLOR_TOOLTIP}; font-size: 10px;">${
                isZH ? "每小时饮料消耗: " : "Drinks consumed per hour: "
            }${numberFormatter(drinksConsumedPerHourAskPrice)}  / ${numberFormatter(drinksConsumedPerHourBidPrice)}</div>`;

            appendHTMLStr += `<div style="color: ${SCRIPT_COLOR_TOOLTIP}; font-size: 10px;">${isZH ? "每小时动作" : "Actions per hour"} ${Number(
                actionPerHour
            ).toFixed(1)}${isZH ? " 次" : " times"}, ${isZH ? "每小时生产" : "Production per hour"} ${Number(
                itemPerHour + extraFreeItemPerHour
            ).toFixed(1)}${isZH ? " 个" : " items"}</div>`;

            appendHTMLStr += `<div style="color: ${SCRIPT_COLOR_TOOLTIP};">${isZH ? "利润: " : "Profit: "}${numberFormatter(
                profitPerHour / actionPerHour
            )}${isZH ? "/动作" : "/action"}, ${numberFormatter(profitPerHour)}${isZH ? "/小时" : "/hour"}, ${numberFormatter(24 * profitPerHour)}${
                isZH ? "/天" : "/day"
            }</div>`;
        }

        insertAfterElem.insertAdjacentHTML("afterend", appendHTMLStr);
    }

    async function fetchMarketJSON(forceFetch = false) {
        // console.log(GM_xmlhttpRequest); // Tampermonkey
        // console.log(GM.xmlHttpRequest); // Tampermonkey promise based, Greasemonkey 4.0+

        // Broswer does not support fetch
        const sendRequest =
            typeof GM.xmlHttpRequest === "function" ? GM.xmlHttpRequest : typeof GM_xmlhttpRequest === "function" ? GM_xmlhttpRequest : null;
        if (typeof sendRequest != "function") {
            console.error("fetchMarketJSON null GM xmlHttpRequest function");
            if (!isUsingExpiredMarketJson) {
                reasonForUsingExpiredMarketJson += new Date().toUTCString() + " Setting isUsingExpiredMarketJson to true:\n";
                reasonForUsingExpiredMarketJson += "GM_xmlhttpRequest " + typeof GM_xmlhttpRequest + "\n";
                reasonForUsingExpiredMarketJson += "GM.xmlHttpRequest " + typeof GM.xmlHttpRequest + "\n";
            }
            isUsingExpiredMarketJson = true;
            const alertDiv = document.querySelector("div#script_api_fail_alert");
            if (alertDiv) {
                alertDiv.style.display = "block";
            }

            const jsonStr = MARKET_JSON_LOCAL_BACKUP;
            const jsonObj = JSON.parse(jsonStr);
            if (jsonObj && jsonObj.time && jsonObj.market) {
                jsonObj.market.Coin.ask = 1;
                jsonObj.market.Coin.bid = 1;
                console.log(jsonObj);
                localStorage.setItem("MWITools_marketAPI_timestamp", Date.now());
                localStorage.setItem("MWITools_marketAPI_json", JSON.stringify(jsonObj));
                return jsonObj;
            }
        }

        // Has recently fetched
        if (
            !forceFetch &&
            localStorage.getItem("MWITools_marketAPI_timestamp") &&
            Date.now() - localStorage.getItem("MWITools_marketAPI_timestamp") < 3600000 // 1 hr
        ) {
            return JSON.parse(localStorage.getItem("MWITools_marketAPI_json"));
        }

        // Start fetch
        console.log("fetchMarketJSON fetch github start");
        reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch start \n";
        const response = await sendRequest({
            url: MARKET_API_URL,
            method: "GET",
            synchronous: true,
            timeout: 5000,
            onload: (response) => {
                if (response.status == 200) {
                    console.log("fetchMarketJSON fetch github success 200");
                    reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch onload 200 \n";
                } else {
                    console.error("fetchMarketJSON fetch github onload with HTTP status failure " + response.status);
                    reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch onload NOT 200 \n";
                }
            },
            onabort: () => {
                console.error("fetchMarketJSON fetch github onabort");
                reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch onabort \n";
            },
            onerror: () => {
                console.error("fetchMarketJSON fetch github onerror");
                reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch onerror \n";
            },
            ontimeout: () => {
                console.error("fetchMarketJSON fetch github ontimeout");
                reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch ontimeout \n";
            },
        });
        console.log("fetchMarketJSON fetch github end with response status: " + response?.status);
        reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch end with response status " + response?.status + "\n";

        let jsonStr = response?.status === 200 ? response.responseText : null;

        // Fetch failed
        if (!jsonStr) {
            isUsingExpiredMarketJson = true;
            reasonForUsingExpiredMarketJson += new Date().toUTCString() + " Setting isUsingExpiredMarketJson to true:\n";
            reasonForUsingExpiredMarketJson += "Failed fetch";
            const alertDiv = document.querySelector("div#script_api_fail_alert");
            if (alertDiv) {
                alertDiv.style.display = "block";
            }
            if (
                JSON.parse(localStorage.getItem("MWITools_marketAPI_json")) &&
                localStorage.getItem("MWITools_marketAPI_timestamp") &&
                JSON.parse(MARKET_JSON_LOCAL_BACKUP).time * 1000 < localStorage.getItem("MWITools_marketAPI_timestamp")
            ) {
                console.error("fetchMarketJSON network error, using previously fetched version");
                jsonStr = localStorage.getItem("MWITools_marketAPI_json");
            } else {
                console.error("fetchMarketJSON network error, using hard-coded backup version");
                jsonStr = MARKET_JSON_LOCAL_BACKUP;
            }
        } else {
            isUsingExpiredMarketJson = false;
            reasonForUsingExpiredMarketJson = "";
            const alertDiv = document.querySelector("div#script_api_fail_alert");
            if (alertDiv) {
                alertDiv.style.display = "none";
            }
        }

        const jsonObj = JSON.parse(jsonStr);
        if (jsonObj && jsonObj.time && jsonObj.market) {
            jsonObj.market.Coin.ask = 1;
            jsonObj.market.Coin.bid = 1;
            console.log(jsonObj);
            localStorage.setItem("MWITools_marketAPI_timestamp", Date.now());
            localStorage.setItem("MWITools_marketAPI_json", JSON.stringify(jsonObj));
            return jsonObj;
        }
        console.error("MWITools: fetchMarketJSON JSON.parse error");
        localStorage.setItem("MWITools_marketAPI_timestamp", 0);
        localStorage.setItem("MWITools_marketAPI_json", "");
        return null;
    }

    function numberFormatter(num, digits = 1) {
        if (num === null || num === undefined) {
            return null;
        }
        if (num < 0) {
            return "-" + numberFormatter(-num);
        }
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "B" },
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup
            .slice()
            .reverse()
            .find(function (item) {
                return num >= item.value;
            });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    }

    function getActionHridFromItemName(name) {
        let newName = name.replace("Milk", "Cow");
        newName = newName.replace("Log", "Tree");
        newName = newName.replace("Cowing", "Milking");
        newName = newName.replace("Rainbow Cow", "Unicow");
        newName = newName.replace("Collector's Boots", "Collectors Boots");
        newName = newName.replace("Knight's Aegis", "Knights Aegis");
        if (!initData_actionDetailMap) {
            console.error("getActionHridFromItemName no initData_actionDetailMap: " + name);
            return null;
        }
        for (const action of Object.values(initData_actionDetailMap)) {
            if (action.name === newName) {
                return action.hrid;
            }
        }
        return null;
    }

    /* 动作面板 */
    const waitForActionPanelParent = () => {
        const targetNode = document.querySelector("div.GamePage_mainPanel__2njyb");
        if (targetNode) {
            console.log("start observe action panel");
            const actionPanelObserver = new MutationObserver(async function (mutations) {
                for (const mutation of mutations) {
                    for (const added of mutation.addedNodes) {
                        if (
                            added?.classList?.contains("Modal_modalContainer__3B80m") &&
                            added.querySelector("div.SkillActionDetail_regularComponent__3oCgr")
                        ) {
                            handleActionPanel(added.querySelector("div.SkillActionDetail_regularComponent__3oCgr"));
                        }
                    }
                }
            });
            actionPanelObserver.observe(targetNode, { attributes: false, childList: true, subtree: true });
        } else {
            setTimeout(waitForActionPanelParent, 200);
        }
    };

    async function handleActionPanel(panel) {
        if (!settingsMap.actionPanel_totalTime.isTrue) {
            return;
        }

        if (!panel.querySelector("div.SkillActionDetail_expGain__F5xHu")) {
            return; // 不处理战斗ActionPanel
        }
        let actionName = getOriTextFromElement(panel.querySelector("div.SkillActionDetail_name__3erHV"));
        if (isZHInGameSetting) {
            actionName = getActionEnNameFromZhName(actionName);
        }

        const exp = Number(
            getOriTextFromElement(panel.querySelector("div.SkillActionDetail_expGain__F5xHu"))
                .replaceAll(THOUSAND_SEPERATOR, "")
                .replaceAll(DECIMAL_SEPERATOR, ".")
        );

        const duration = Number(
            getOriTextFromElement(panel.querySelectorAll("div.SkillActionDetail_value__dQjYH")[5])
                .replaceAll(THOUSAND_SEPERATOR, "")
                .replaceAll(DECIMAL_SEPERATOR, ".")
                .replace("s", "")
        );
        const inputElem = panel.querySelector("div.SkillActionDetail_maxActionCountInput__1C0Pw input");

        const actionHrid = initData_actionDetailMap[getActionHridFromItemName(actionName)].hrid;
        const effBuff = 1 + getTotalEffiPercentage(actionHrid, false) / 100;

        // 显示总时间
        let hTMLStr = `<div id="showTotalTime" style="color: ${SCRIPT_COLOR_MAIN}; text-align: left;">${getTotalTimeStr(
            inputElem.value,
            duration,
            effBuff
        )}</div>`;
        const gatherDiv = inputElem.parentNode.parentNode.parentNode;
        gatherDiv.insertAdjacentHTML("afterend", hTMLStr);
        const showTotalTimeDiv = panel.querySelector("div#showTotalTime");

        panel.addEventListener("click", function (evt) {
            setTimeout(() => {
                showTotalTimeDiv.textContent = getTotalTimeStr(inputElem.value, duration, effBuff);
            }, 50);
        });
        inputElem.addEventListener("keyup", function (evt) {
            if (inputElem.value.toLowerCase().includes("k") || inputElem.value.toLowerCase().includes("m")) {
                reactInputTriggerHack(inputElem, inputElem.value.toLowerCase().replaceAll("k", "000").replaceAll("m", "000000"));
            }
            showTotalTimeDiv.textContent = getTotalTimeStr(inputElem.value, duration, effBuff);
        });

        let appendAfterElem = showTotalTimeDiv;

        // 显示快捷按钮
        if (settingsMap.actionPanel_totalTime_quickInputs.isTrue) {
            hTMLStr = `<div id="quickInputButtons" style="color: ${SCRIPT_COLOR_MAIN}; text-align: left;">${isZH ? "做 " : "Do "}</div>`;
            showTotalTimeDiv.insertAdjacentHTML("afterend", hTMLStr);
            const quickInputButtonsDiv = panel.querySelector("div#quickInputButtons");

            const presetHours = [0.5, 1, 2, 3, 4, 5, 6, 10, 12, 24];
            for (const value of presetHours) {
                const btn = document.createElement("button");
                btn.style.backgroundColor = "white";
                btn.style.padding = "1px 6px 1px 6px";
                btn.style.margin = "1px";
                btn.innerText = value === 0.5 ? 0.5 : numberFormatter(value);
                btn.onclick = () => {
                    reactInputTriggerHack(inputElem, Math.round((value * 60 * 60 * effBuff) / duration));
                };
                quickInputButtonsDiv.append(btn);
            }
            quickInputButtonsDiv.append(document.createTextNode(isZH ? " 小时" : " hours"));

            quickInputButtonsDiv.append(document.createElement("div"));
            quickInputButtonsDiv.append(document.createTextNode(isZH ? "做 " : "Do "));
            const presetTimes = [10, 100, 300, 500, 1000, 2000];
            for (const value of presetTimes) {
                const btn = document.createElement("button");
                btn.style.backgroundColor = "white";
                btn.style.padding = "1px 6px 1px 6px";
                btn.style.margin = "1px";
                btn.innerText = numberFormatter(value);
                btn.onclick = () => {
                    reactInputTriggerHack(inputElem, value);
                };
                quickInputButtonsDiv.append(btn);
            }
            quickInputButtonsDiv.append(document.createTextNode(isZH ? " 次" : " times"));

            appendAfterElem = quickInputButtonsDiv;
        }

        // 还有多久到多少技能等级
        const skillHrid = initData_actionDetailMap[getActionHridFromItemName(actionName)].experienceGain.skillHrid;
        let currentExp = null;
        let currentLevel = null;
        for (const skill of initData_characterSkills) {
            if (skill.skillHrid === skillHrid) {
                currentExp = skill.experience;
                currentLevel = skill.level;
                break;
            }
        }
        if (currentExp && currentLevel) {
            const calculateNeedToLevel = (currentLevel, targetLevel, effBuff, duration, exp) => {
                let needTotalTimeSec = 0;
                let needTotalNumOfActions = 0;
                for (let level = currentLevel; level < targetLevel; level++) {
                    let needExpToNextLevel = null;
                    if (level === currentLevel) {
                        needExpToNextLevel = initData_levelExperienceTable[level + 1] - currentExp;
                    } else {
                        needExpToNextLevel = initData_levelExperienceTable[level + 1] - initData_levelExperienceTable[level];
                    }
                    const extraLevelEffBuff = (level - currentLevel) * 0.01; // 升级过程中，每升一级，额外多1%效率
                    const needNumOfActionsToNextLevel = Math.round(needExpToNextLevel / exp);
                    needTotalNumOfActions += needNumOfActionsToNextLevel;
                    needTotalTimeSec += (needNumOfActionsToNextLevel / (effBuff + extraLevelEffBuff)) * duration;
                }
                return { numOfActions: needTotalNumOfActions, timeSec: needTotalTimeSec };
            };

            const need = calculateNeedToLevel(currentLevel, currentLevel + 1, effBuff, duration, exp);
            hTMLStr = `<div id="tillLevel" style="color: ${SCRIPT_COLOR_MAIN}; text-align: left;">${
                isZH ? "到 " : "To reach level "
            }<input id="tillLevelInput" type="number" value="${currentLevel + 1}" min="${currentLevel + 1}" max="200">${
                isZH ? " 级还需做 " : ", need to do "
            }<span id="tillLevelNumber">${need.numOfActions}${isZH ? " 次" : " times "}[${timeReadable(need.timeSec)}]${
                isZH ? " (刷新网页更新当前等级)" : " (Refresh page to update current level)"
            }</span></div>`;

            appendAfterElem.insertAdjacentHTML("afterend", hTMLStr);
            const tillLevelInput = panel.querySelector("input#tillLevelInput");
            const tillLevelNumber = panel.querySelector("span#tillLevelNumber");
            tillLevelInput.onchange = () => {
                const targetLevel = Number(tillLevelInput.value);
                if (targetLevel > currentLevel && targetLevel <= 200) {
                    const need = calculateNeedToLevel(currentLevel, targetLevel, effBuff, duration, exp);
                    tillLevelNumber.textContent = `${need.numOfActions}${isZH ? " 次" : " times "}[${timeReadable(need.timeSec)}]${
                        isZH ? " (刷新网页更新当前等级)" : " (Refresh page to update current level)"
                    }`;
                } else {
                    tillLevelNumber.textContent = "Error";
                }
            };
            tillLevelInput.addEventListener("keyup", function (evt) {
                const targetLevel = Number(tillLevelInput.value);
                if (targetLevel > currentLevel && targetLevel <= 200) {
                    const need = calculateNeedToLevel(currentLevel, targetLevel, effBuff, duration, exp);
                    tillLevelNumber.textContent = `${need.numOfActions}${isZH ? " 次" : " times "}[${timeReadable(need.timeSec)}]${
                        isZH ? " (刷新网页更新当前等级)" : " (Refresh page to update current level)"
                    }`;
                } else {
                    tillLevelNumber.textContent = "Error";
                }
            });
        }

        // 显示每小时经验
        panel
            .querySelector("div#tillLevel")
            .insertAdjacentHTML(
                "afterend",
                `<div id="expPerHour" style="color: ${SCRIPT_COLOR_MAIN}; text-align: left;">${isZH ? "每小时经验: " : "Exp/hour: "}${numberFormatter(
                    Math.round((3600 / duration) * exp * effBuff)
                )} (+${Number((effBuff - 1) * 100).toFixed(1)}%${isZH ? "效率" : " eff"})</div>`
            );

        // 显示Foraging最后一个图综合收益
        if (panel.querySelector("div.SkillActionDetail_dropTable__3ViVp").children.length > 1 && settingsMap.actionPanel_foragingTotal.isTrue) {
            const marketJson = await fetchMarketJSON();
            const actionHrid = "/actions/foraging/" + actionName.toLowerCase().replaceAll(" ", "_");

            // 茶效率
            const teaBuffs = getTeaBuffsByActionHrid(actionHrid);

            // 消耗饮料
            let drinksConsumedPerHourAskPrice = 0;
            let drinksConsumedPerHourBidPrice = 0;

            const drinksList = initData_actionTypeDrinkSlotsMap[initData_actionDetailMap[actionHrid].type];
            for (const drink of drinksList) {
                if (!drink || !drink.itemHrid) {
                    continue;
                }
                const drinkName = initData_itemDetailMap[drink.itemHrid].name;
                drinksConsumedPerHourAskPrice += (marketJson?.market[drinkName]?.ask ?? 0) * 12;
                drinksConsumedPerHourBidPrice += (marketJson?.market[drinkName]?.bid ?? 0) * 12;
            }

            // 每小时动作数（包含工具缩减动作时间）
            const baseTimePerActionSec = initData_actionDetailMap[actionHrid].baseTimeCost / 1000000000;
            const toolPercent = getToolsSpeedBuffByActionHrid(actionHrid);
            const actualTimePerActionSec = baseTimePerActionSec / (1 + toolPercent / 100);
            let actionPerHour = 3600 / actualTimePerActionSec;

            // 将掉落表看作每次动作掉落一件虚拟物品
            const dropTable = initData_actionDetailMap[actionHrid].dropTable;
            let virtualItemBid = 0;
            for (const drop of dropTable) {
                const bid = marketJson?.market[initData_itemDetailMap[drop.itemHrid].name]?.bid;
                const amount = drop.dropRate * ((drop.minCount + drop.maxCount) / 2);
                virtualItemBid += bid * amount;
            }
            let droprate = 1;
            let itemPerHour = actionPerHour * droprate;

            // 等级碾压提高效率（人物等级不及最低要求等级时，按最低要求等级计算）
            const requiredLevel = initData_actionDetailMap[actionHrid].levelRequirement.level;
            let currentLevel = requiredLevel;
            for (const skill of initData_characterSkills) {
                if (skill.skillHrid === initData_actionDetailMap[actionHrid].levelRequirement.skillHrid) {
                    currentLevel = skill.level;
                    break;
                }
            }
            const levelEffBuff = currentLevel - requiredLevel > 0 ? currentLevel - requiredLevel : 0;

            // 房子效率
            const houseEffBuff = getHousesEffBuffByActionHrid(actionHrid);

            // 特殊装备效率
            const itemEffiBuff = Number(getItemEffiBuffByActionHrid(actionHrid));

            // 总效率影响动作数/生产物品数
            actionPerHour *= 1 + (levelEffBuff + houseEffBuff + teaBuffs.efficiency + itemEffiBuff) / 100;
            itemPerHour *= 1 + (levelEffBuff + houseEffBuff + teaBuffs.efficiency + itemEffiBuff) / 100;

            // 茶额外产品数量（不消耗原料）
            const extraFreeItemPerHour = (itemPerHour * teaBuffs.quantity) / 100;

            // 出售市场税
            const bidAfterTax = virtualItemBid * 0.98;

            // 每小时利润
            const profitPerHour = itemPerHour * bidAfterTax + extraFreeItemPerHour * bidAfterTax - drinksConsumedPerHourAskPrice;

            let htmlStr = `<div id="totalProfit"  style="color: ${SCRIPT_COLOR_MAIN}; text-align: left;">${
                isZH ? "综合利润: " : "Overall profit: "
            }${numberFormatter(profitPerHour)}${isZH ? "/小时" : "/hour"}, ${numberFormatter(24 * profitPerHour)}${isZH ? "/天" : "/day"}</div>`;
            panel.querySelector("div#expPerHour").insertAdjacentHTML("afterend", htmlStr);
        }
    }

    function getTotalEffiPercentage(actionHrid, debug = false) {
        if (debug) {
            console.log("----- getTotalEffiPercentage " + actionHrid);
        }
        // 等级碾压效率
        const requiredLevel = initData_actionDetailMap[actionHrid].levelRequirement.level;
        let currentLevel = requiredLevel;
        for (const skill of initData_characterSkills) {
            if (skill.skillHrid === initData_actionDetailMap[actionHrid].levelRequirement.skillHrid) {
                currentLevel = skill.level;
                break;
            }
        }
        const levelEffBuff = currentLevel - requiredLevel > 0 ? currentLevel - requiredLevel : 0;
        if (debug) {
            console.log("等级碾压 " + levelEffBuff);
        }
        // 房子效率
        const houseEffBuff = getHousesEffBuffByActionHrid(actionHrid);
        if (debug) {
            console.log("房子 " + houseEffBuff);
        }
        // 茶
        const teaBuffs = getTeaBuffsByActionHrid(actionHrid);
        if (debug) {
            console.log("茶 " + teaBuffs.efficiency);
        }
        // 特殊装备
        const itemEffiBuff = getItemEffiBuffByActionHrid(actionHrid);
        if (debug) {
            console.log("特殊装备 " + itemEffiBuff);
        }
        // 总效率
        const total = levelEffBuff + houseEffBuff + teaBuffs.efficiency + Number(itemEffiBuff);
        if (debug) {
            console.log("总计 " + total);
        }
        return total;
    }

    function getTotalTimeStr(input, duration, effBuff) {
        if (input === "∞") {
            return "[∞]";
        } else if (isNaN(input)) {
            return "Error";
        }
        return "[" + timeReadable(Math.round(input / effBuff) * duration) + "]";
    }

    function reactInputTriggerHack(inputElem, value) {
        let lastValue = inputElem.value;
        inputElem.value = value;
        let event = new Event("input", { bubbles: true });
        event.simulated = true;
        let tracker = inputElem._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputElem.dispatchEvent(event);
    }

    /* 左侧栏显示技能百分比 */
    const waitForProgressBar = () => {
        const elements = document.querySelectorAll(".NavigationBar_currentExperience__3GDeX");
        if (elements.length) {
            removeInsertedDivs();
            elements.forEach((element) => {
                let text = element.style.width;
                text = Number(text.replace("%", "")).toFixed(2) + "%";

                const span = document.createElement("span");
                span.textContent = text;
                span.classList.add("insertedSpan");
                span.style.fontSize = "13px";
                span.style.color = SCRIPT_COLOR_MAIN;

                element.parentNode.parentNode.querySelector("span.NavigationBar_level__3C7eR").style.width = "auto";

                const insertParent = element.parentNode.parentNode.children[0];
                insertParent.insertBefore(span, insertParent.children[1]);
            });
        } else {
            setTimeout(waitForProgressBar, 200);
        }
    };

    const removeInsertedDivs = () => document.querySelectorAll("span.insertedSpan").forEach((div) => div.parentNode.removeChild(div));

    if (settingsMap.expPercentage.isTrue) {
        window.setInterval(() => {
            removeInsertedDivs();
            waitForProgressBar();
        }, 1000);
    }

    /* 战斗总结 */
    async function handleBattleSummary(message) {
        const marketJson = await fetchMarketJSON();
        let hasMarketJson = true;
        if (!marketJson) {
            console.error("handleBattleSummary null marketAPI");
            hasMarketJson = false;
        }
        let totalPriceAsk = 0;
        let totalPriceAskBid = 0;
        let totalRawCoins = 0; // For IC

        if (hasMarketJson) {
            for (const loot of Object.values(message.unit.totalLootMap)) {
                const itemName = initData_itemDetailMap[loot.itemHrid].name;
                const itemCount = loot.count;
                if (itemName === "Coin") {
                    totalRawCoins += itemCount;
                }
                if (marketJson.market[itemName]) {
                    totalPriceAsk += marketJson.market[itemName].ask * itemCount;
                    totalPriceAskBid += marketJson.market[itemName].bid * itemCount;
                } else {
                    console.log("handleBattleSummary failed to read price of " + loot.itemHrid);
                }
            }
        }

        let totalSkillsExp = 0;
        for (const exp of Object.values(message.unit.totalSkillExperienceMap)) {
            totalSkillsExp += exp;
        }

        let tryTimes = 0;
        findElem();
        function findElem() {
            tryTimes++;
            let elem = document.querySelector(".BattlePanel_gainedExp__3SaCa")?.parentElement;
            if (elem) {
                // 战斗时长和次数
                let battleDurationSec = null;
                const combatInfoElement = document.querySelector(".BattlePanel_combatInfo__sHGCe");
                if (combatInfoElement) {
                    let matches = combatInfoElement.innerHTML.match(
                        /(战斗时间|战斗时长|Combat Duration): (?:(\d+)d\s*)?(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s).*?(交战|战斗|Battles): (\d+).*?(战败|死亡次数|Deaths): (\d+)/
                    );
                    if (matches) {
                        let days = parseInt(matches[2], 10) || 0;
                        let hours = parseInt(matches[3], 10) || 0;
                        let minutes = parseInt(matches[4], 10) || 0;
                        let seconds = parseInt(matches[5], 10) || 0;
                        let battles = parseInt(matches[7], 10) - 1; // 排除当前战斗
                        battleDurationSec = days * 86400 + hours * 3600 + minutes * 60 + seconds;
                        let efficiencyPerHour = ((battles / battleDurationSec) * 3600).toFixed(1);
                        elem.insertAdjacentHTML(
                            "beforeend",
                            `<div id="script_battleNumbers" style="color: ${SCRIPT_COLOR_MAIN};">${
                                isZH ? "每小时战斗: " : "Encounters/hour: "
                            }${efficiencyPerHour}${isZH ? " 次" : ""}</div>`
                        );
                    }
                }
                // 总收入
                document
                    .querySelector("div#script_battleNumbers")
                    .insertAdjacentHTML(
                        "afterend",
                        `<div id="script_totalIncome" style="color: ${SCRIPT_COLOR_MAIN};">${isZH ? "总收获: " : "Total revenue: "}${numberFormatter(
                            totalPriceAsk
                        )} / ${numberFormatter(totalPriceAskBid)}</div>`
                    );
                // 平均收入
                if (battleDurationSec) {
                    document
                        .querySelector("div#script_totalIncome")
                        .insertAdjacentHTML(
                            "afterend",
                            `<div id="script_averageIncome" style="color: ${SCRIPT_COLOR_MAIN};">${
                                isZH ? "每小时收获: " : "Revenue/hour: "
                            }${numberFormatter(totalPriceAsk / (battleDurationSec / 60 / 60))} / ${numberFormatter(
                                totalPriceAskBid / (battleDurationSec / 60 / 60)
                            )}</div>`
                        );
                    document
                        .querySelector("div#script_averageIncome")
                        .insertAdjacentHTML(
                            "afterend",
                            `<div id="script_totalIncomeDay" style="color: ${SCRIPT_COLOR_MAIN};">${
                                isZH ? "每天收获: " : "Revenue/day: "
                            }${numberFormatter((totalPriceAsk / (battleDurationSec / 60 / 60)) * 24)} / ${numberFormatter(
                                (totalPriceAskBid / (battleDurationSec / 60 / 60)) * 24
                            )}</div>`
                        );
                    document
                        .querySelector("div#script_totalIncomeDay")
                        .insertAdjacentHTML(
                            "afterend",
                            `<div id="script_avgRawCoinHour" style="color: ${SCRIPT_COLOR_MAIN};">${
                                isZH ? "每小时仅金币收获: " : "Raw coins/hour: "
                            }${numberFormatter(totalRawCoins / (battleDurationSec / 60 / 60))}</div>`
                        );
                }
                // 总经验
                document
                    .querySelector("div#script_avgRawCoinHour")
                    .insertAdjacentHTML(
                        "afterend",
                        `<div id="script_totalSkillsExp" style="color: ${SCRIPT_COLOR_MAIN};">${isZH ? "总经验: " : "Total exp: "}${numberFormatter(
                            totalSkillsExp
                        )}</div>`
                    );
                // 平均经验
                if (battleDurationSec) {
                    document
                        .querySelector("div#script_totalSkillsExp")
                        .insertAdjacentHTML(
                            "afterend",
                            `<div id="script_averageSkillsExp" style="color: ${SCRIPT_COLOR_MAIN};">${
                                isZH ? "每小时总经验: " : "Total exp/hour: "
                            }${numberFormatter(totalSkillsExp / (battleDurationSec / 60 / 60))}</div>`
                        );

                    [
                        { skillHrid: "/skills/magic", zhName: "魔法", enName: "Magic" },
                        { skillHrid: "/skills/ranged", zhName: "远程", enName: "Ranged" },
                        { skillHrid: "/skills/defense", zhName: "防御", enName: "Defense" },
                        { skillHrid: "/skills/power", zhName: "力量", enName: "Power" },
                        { skillHrid: "/skills/attack", zhName: "攻击", enName: "Attack" },
                        { skillHrid: "/skills/intelligence", zhName: "智力", enName: "Intelligence" },
                        { skillHrid: "/skills/stamina", zhName: "耐力", enName: "Stamina" },
                    ].forEach((skill) => {
                        const expGained = message.unit.totalSkillExperienceMap[skill.skillHrid];
                        if (expGained) {
                            document
                                .querySelector("div#script_totalSkillsExp")
                                .insertAdjacentHTML(
                                    "afterend",
                                    `<div style="color: ${SCRIPT_COLOR_MAIN};">${isZH ? "每小时" : ""}${isZH ? skill.zhName : skill.enName}${
                                        isZH ? "经验: " : " exp/hour: "
                                    }${numberFormatter(expGained / (battleDurationSec / 60 / 60))}</div>`
                                );
                        }
                    });
                } else {
                    console.error("handleBattleSummary unable to display average exp due to null battleDurationSec");
                }
            } else if (tryTimes <= 10) {
                setTimeout(findElem, 200);
            } else {
                console.error("handleBattleSummary: Elem not found after 10 tries.");
            }
        }
    }

    /* 图标上显示装备等级 */
    function addItemLevels() {
        const iconDivs = document.querySelectorAll("div.Item_itemContainer__x7kH1 div.Item_item__2De2O.Item_clickable__3viV6");
        for (const div of iconDivs) {
            if (div.querySelector("div.Item_name__2C42x")) {
                continue;
            }
            const href = div.querySelector("use").getAttribute("href");
            const hrefName = href.split("#")[1];
            const itemHrid = "/items/" + hrefName;
            const itemLevel = initData_itemDetailMap[itemHrid]?.itemLevel;
            const itemAbilityLevel = initData_itemDetailMap[itemHrid]?.abilityBookDetail?.levelRequirements?.[0]?.level;

            if (initData_itemDetailMap[itemHrid]?.equipmentDetail && itemLevel && itemLevel > 0) {
                if (!div.querySelector("div.script_itemLevel")) {
                    div.insertAdjacentHTML(
                        "beforeend",
                        `<div class="script_itemLevel" style="z-index: 1; position: absolute; top: 2px; right: 2px; text-align: right; color: ${SCRIPT_COLOR_MAIN};">${itemLevel}</div>`
                    );
                }
                if (
                    !initData_itemDetailMap[itemHrid]?.equipmentDetail?.type?.includes("_tool") &&
                    div.parentElement.parentElement.parentElement.className.includes("MarketplacePanel_marketItems__D4k7e")
                ) {
                    handleMarketItemFilter(div, initData_itemDetailMap[itemHrid]);
                }
            } else if (itemAbilityLevel && itemAbilityLevel > 0) {
                if (!div.querySelector("div.script_itemLevel")) {
                    div.insertAdjacentHTML(
                        "beforeend",
                        `<div class="script_itemLevel" style="z-index: 1; position: absolute; top: 2px; right: 2px; text-align: right; color: ${SCRIPT_COLOR_MAIN};">${itemAbilityLevel}</div>`
                    );
                }
            } else if (settingsMap.showsKeyInfoInIcon.isTrue && (itemHrid.includes("_key_fragment") || itemHrid.includes("_key"))) {
                const map = new Map();
                map.set("/items/blue_key_fragment", isZH ? "图3" : "Z3");
                map.set("/items/green_key_fragment", isZH ? "图4" : "Z4");
                map.set("/items/purple_key_fragment", isZH ? "图5" : "Z5");
                map.set("/items/white_key_fragment", isZH ? "图6" : "Z6");
                map.set("/items/orange_key_fragment", isZH ? "图7" : "Z7");
                map.set("/items/brown_key_fragment", isZH ? "图8" : "Z8");
                map.set("/items/stone_key_fragment", isZH ? "图9" : "Z9");
                map.set("/items/dark_key_fragment", isZH ? "图10" : "Z10");
                map.set("/items/burning_key_fragment", isZH ? "图11" : "Z11");

                map.set("/items/chimerical_entry_key", isZH ? "牢1" : "D1");
                map.set("/items/sinister_entry_key", isZH ? "牢2" : "D2");
                map.set("/items/enchanted_entry_key", isZH ? "牢3" : "D3");

                map.set("/items/chimerical_chest_key", "3.4.5.8");
                map.set("/items/sinister_chest_key", "5.7.8.10");
                map.set("/items/enchanted_chest_key", "6.7.9.11");

                if (!div.querySelector("div.script_key")) {
                    div.insertAdjacentHTML(
                        "beforeend",
                        `<div class="script_key" style="z-index: 1; position: absolute; top: 2px; right: 2px; text-align: right; color: ${SCRIPT_COLOR_MAIN};">${map.get(
                            itemHrid
                        )}</div>`
                    );
                }
            }
        }
    }
    if (settingsMap.itemIconLevel.isTrue) {
        setInterval(addItemLevels, 500);
    }

    /* 市场物品筛选 */
    let onlyShowItemsAboveLevel = 1;
    let onlyShowItemsBelowLevel = 1000;
    let onlyShowItemsType = "all";
    let onlyShowItemsSkillReq = "all";

    function addMarketFilterButtons() {
        const oriFilter = document.querySelector(".MarketplacePanel_itemFilterContainer__3F3td");
        let filters = document.querySelector("#script_filters");
        if (oriFilter && !filters) {
            oriFilter.insertAdjacentHTML("afterend", `<div id="script_filters" style="float: left; color: ${SCRIPT_COLOR_MAIN};"></div>`);
            filters = document.querySelector("#script_filters");
            filters.insertAdjacentHTML(
                "beforeend",
                `<span id="script_filter_level" style="float: left; color: ${SCRIPT_COLOR_MAIN};">${isZH ? "等级: 大于等于 " : "Equipment level: >= "}
                <select name="script_filter_level_select" id="script_filter_level_select">
                <option value="1">All</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="60">60</option>
                <option value="65">65</option>
                <option value="70">70</option>
                <option value="75">75</option>
                <option value="80">80</option>
                <option value="85">85</option>
                <option value="90">90</option>
                <option value="95">95</option>
                <option value="100">100</option>
            </select>&nbsp;</span>`
            );
            filters.insertAdjacentHTML(
                "beforeend",
                `<span id="script_filter_level_to" style="float: left; color: ${SCRIPT_COLOR_MAIN};">${isZH ? "小于 " : "< "}
                <select name="script_filter_level_select_to" id="script_filter_level_select_to">
                <option value="1000">All</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="60">60</option>
                <option value="65">65</option>
                <option value="70">70</option>
                <option value="75">75</option>
                <option value="80">80</option>
                <option value="85">85</option>
                <option value="90">90</option>
                <option value="95">95</option>
                <option value="100">100</option>
            </select>&emsp;</span>`
            );
            filters.insertAdjacentHTML(
                "beforeend",
                `<span id="script_filter_skill" style="float: left; color: ${SCRIPT_COLOR_MAIN};">${isZH ? "职业: " : "Class: "}
                <select name="script_filter_skill_select" id="script_filter_skill_select">
                    <option value="all">All</option>
                    <option value="attack">Attack</option>
                    <option value="power">Power</option>
                    <option value="defense">Defense</option>
                    <option value="ranged">Ranged</option>
                    <option value="magic">Magic</option>
                    <option value="others">Others</option>
                </select>&emsp;</span>`
            );
            filters.insertAdjacentHTML(
                "beforeend",
                `<span id="script_filter_location" style="float: left; color: ${SCRIPT_COLOR_MAIN};">${isZH ? "部位: " : "Slot: "}
                <select name="script_filter_location_select" id="script_filter_location_select">
                    <option value="all">All</option>
                    <option value="main_hand">Main Hand</option>
                    <option value="off_hand">Off Hand</option>
                    <option value="two_hand">Two Hand</option>
                    <option value="head">Head</option>
                    <option value="body">Body</option>
                    <option value="hands">Hands</option>
                    <option value="legs">Legs</option>
                    <option value="feet">Feet</option>
                    <option value="neck">Neck</option>
                    <option value="earrings">Earrings</option>
                    <option value="ring">Ring</option>
                    <option value="pouch">Pouch</option>
                    <option value="back">Back</option>
                </select>&emsp;</span>`
            );

            const levelFilter = document.querySelector("#script_filter_level_select");
            levelFilter.addEventListener("change", function () {
                if (levelFilter.value && !isNaN(levelFilter.value)) {
                    onlyShowItemsAboveLevel = Number(levelFilter.value);
                }
            });
            const levelToFilter = document.querySelector("#script_filter_level_select_to");
            levelToFilter.addEventListener("change", function () {
                if (levelToFilter.value && !isNaN(levelToFilter.value)) {
                    onlyShowItemsBelowLevel = Number(levelToFilter.value);
                }
            });
            const skillFilter = document.querySelector("#script_filter_skill_select");
            skillFilter.addEventListener("change", function () {
                if (skillFilter.value) {
                    onlyShowItemsSkillReq = skillFilter.value;
                }
            });
            const locationFilter = document.querySelector("#script_filter_location_select");
            locationFilter.addEventListener("change", function () {
                if (locationFilter.value) {
                    onlyShowItemsType = locationFilter.value;
                }
            });
        }
    }
    if (settingsMap.marketFilter.isTrue) {
        setInterval(addMarketFilterButtons, 500);
    }

    function handleMarketItemFilter(div, itemDetal) {
        if (!itemDetal.equipmentDetail) {
            return;
        }

        const itemLevel = itemDetal.itemLevel;
        const type = itemDetal.equipmentDetail.type;
        const levelRequirements = itemDetal.equipmentDetail.levelRequirements;

        let isType = false;
        isType = type && type.includes(onlyShowItemsType);
        if (onlyShowItemsType === "all") {
            isType = true;
        }

        let isRequired = false;
        for (const requirement of levelRequirements) {
            if (requirement.skillHrid.includes(onlyShowItemsSkillReq)) {
                isRequired = true;
            }
        }
        if (onlyShowItemsSkillReq === "others") {
            const combatTypes = ["attack", "power", "defense", "ranged", "magic"];
            isRequired = !combatTypes.some((type) => {
                for (const requirement of levelRequirements) {
                    if (requirement.skillHrid.includes(type)) {
                        return true;
                    }
                }
            });
        }
        if (onlyShowItemsSkillReq === "all") {
            isRequired = true;
        }

        if (itemLevel >= onlyShowItemsAboveLevel && itemLevel < onlyShowItemsBelowLevel && isType && isRequired) {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
    }

    /* 任务卡片显示战斗地图序号 */
    function handleTaskCard() {
        const taskNameDivs = document.querySelectorAll("div.RandomTask_randomTask__3B9fA div.RandomTask_name__1hl1b");
        for (const div of taskNameDivs) {
            if (div.querySelector("span.script_taskMapIndex")) {
                continue;
            }

            const taskStr = getOriTextFromElement(div);
            if (!taskStr.startsWith("Defeat - ") && !taskStr.startsWith("击败 - ")) {
                continue;
            }

            let monsterName = taskStr.replace("Defeat - ", "").replace("击败 - ", "");
            let actionHrid = null;
            if (isZHInGameSetting) {
                actionHrid = (
                    getOthersFromZhName(monsterName) ? getOthersFromZhName(monsterName) : getActionEnNameFromZhName(monsterName)
                )?.replaceAll("/monsters/", "/actions/combat/");
            }

            let actionObj = null;
            for (const action of Object.values(initData_actionDetailMap)) {
                if (action.hrid.includes("/combat/")) {
                    if (action.hrid === actionHrid || action.name.toLowerCase() === monsterName.toLowerCase()) {
                        actionObj = action;
                        break;
                    } else if (action.combatZoneInfo.fightInfo.battlesPerBoss === 10) {
                        if (
                            actionHrid?.replaceAll("/actions/combat/", "/monsters/") ===
                                action.combatZoneInfo.fightInfo.bossSpawns[0].combatMonsterHrid ||
                            "/monsters/" + monsterName.toLowerCase().replaceAll(" ", "_") ===
                                action.combatZoneInfo.fightInfo.bossSpawns[0].combatMonsterHrid
                        ) {
                            actionObj = action;
                            break;
                        }
                    }
                }
            }
            const actionCategoryHrid = actionObj?.category;
            const index = initData_actionCategoryDetailMap?.[actionCategoryHrid]?.sortIndex;
            if (index) {
                div.insertAdjacentHTML(
                    "beforeend",
                    `<span class="script_taskMapIndex" style="text-align: right; color: ${SCRIPT_COLOR_MAIN};"> ${isZH ? "图" : "Z"}${index}</span>`
                );
            }
        }
    }
    if (settingsMap.taskMapIndex.isTrue) {
        setInterval(handleTaskCard, 500);
    }

    /* 显示战斗地图序号 */
    function addIndexToMaps() {
        const buttons = document.querySelectorAll(
            "div.MainPanel_subPanelContainer__1i-H9 div.CombatPanel_tabsComponentContainer__GsQlg div.MuiTabs-root.MuiTabs-vertical.css-6x4ics button.MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary.css-1q2h7u5 span.MuiBadge-root.TabsComponent_badge__1Du26.css-1rzb3uu"
        );
        let index = 1;
        for (const button of buttons) {
            if (!button.querySelector("span.script_mapIndex")) {
                button.insertAdjacentHTML("afterbegin", `<span class="script_mapIndex" style="color: ${SCRIPT_COLOR_MAIN};">${index++}. </span>`);
            }
        }
    }
    if (settingsMap.mapIndex.isTrue) {
        setInterval(addIndexToMaps, 500);
    }

    /* 物品词典窗口显示还需多少技能书到X级 */
    const waitForItemDict = () => {
        const targetNode = document.querySelector("div.GamePage_gamePage__ixiPl");
        if (targetNode) {
            console.log("start observe item dict");
            const itemDictPanelObserver = new MutationObserver(async function (mutations) {
                for (const mutation of mutations) {
                    for (const added of mutation.addedNodes) {
                        if (
                            added?.classList?.contains("Modal_modalContainer__3B80m") &&
                            added.querySelector("div.ItemDictionary_modalContent__WvEBY")
                        ) {
                            handleItemDict(added.querySelector("div.ItemDictionary_modalContent__WvEBY"));
                        }
                    }
                }
            });
            itemDictPanelObserver.observe(targetNode, { attributes: false, childList: true, subtree: true });
        } else {
            setTimeout(waitForItemDict, 200);
        }
    };

    function handleItemDict(panel) {
        let abilityHrid = null;
        if (isZHInGameSetting) {
            abilityHrid = getOthersFromZhName(panel.querySelector("h1.ItemDictionary_title__27cTd").textContent);
        } else {
            const itemName = getOriTextFromElement(panel.querySelector("h1.ItemDictionary_title__27cTd"))
                .toLowerCase()
                .replaceAll(" ", "_")
                .replaceAll("'", "");
            for (const skillHrid of Object.keys(initData_abilityDetailMap)) {
                if (skillHrid.includes("/" + itemName)) {
                    abilityHrid = skillHrid;
                }
            }
        }
        if (!abilityHrid) {
            return;
        }

        const itemHrid = abilityHrid.replace("/abilities/", "/items/");
        const abilityPerBookExp = initData_itemDetailMap[itemHrid]?.abilityBookDetail?.experienceGain;

        let currentLevel = 0;
        let currentExp = 0;
        for (const a of Object.values(initData_characterAbilities)) {
            if (a.abilityHrid === abilityHrid) {
                currentLevel = a.level;
                currentExp = a.experience;
            }
        }

        const getNeedBooksToLevel = (currentLevel, currentExp, targetLevel, abilityPerBookExp) => {
            const needExp = initData_levelExperienceTable[targetLevel] - currentExp;
            let needBooks = needExp / abilityPerBookExp;
            if (currentLevel === 0) {
                needBooks += 1;
            }
            return needBooks.toFixed(1);
        };

        let numBooks = getNeedBooksToLevel(currentLevel, currentExp, currentLevel + 1, abilityPerBookExp);
        let hTMLStr = `<div id="tillLevel" style="color: ${SCRIPT_COLOR_MAIN}; text-align: left;">${
            isZH ? "到 " : "To "
        }<input id="tillLevelInput" type="number" value="${currentLevel + 1}" min="${currentLevel + 1}" max="200">${
            isZH ? " 级还需 " : " level need "
        }<span id="tillLevelNumber">${numBooks}${
            isZH ? " 本书 (刷新网页更新当前等级)" : " books (Refresh page to update current level.)"
        }</span></div>`;
        panel.insertAdjacentHTML("beforeend", hTMLStr);
        const tillLevelInput = panel.querySelector("input#tillLevelInput");
        const tillLevelNumber = panel.querySelector("span#tillLevelNumber");
        tillLevelInput.onchange = () => {
            const targetLevel = Number(tillLevelInput.value);
            if (targetLevel > currentLevel && targetLevel <= 200) {
                let numBooks = getNeedBooksToLevel(currentLevel, currentExp, targetLevel, abilityPerBookExp);
                tillLevelNumber.textContent = `${numBooks}${
                    isZH ? " 本书 (刷新网页更新当前等级)" : " books (Refresh page to update current level.)"
                }`;
            } else {
                tillLevelNumber.textContent = "Error";
            }
        };
        tillLevelInput.addEventListener("keyup", function (evt) {
            const targetLevel = Number(tillLevelInput.value);
            if (targetLevel > currentLevel && targetLevel <= 200) {
                let numBooks = getNeedBooksToLevel(currentLevel, currentExp, targetLevel, abilityPerBookExp);
                tillLevelNumber.textContent = `${numBooks}${
                    isZH ? " 本书 (刷新网页更新当前等级)" : " books (Refresh page to update current level.)"
                }`;
            } else {
                tillLevelNumber.textContent = "Error";
            }
        });
    }

    /* 添加第三方网站链接 */
    function add3rdPartyLinks() {
        const waitForNavi = () => {
            const targetNode = document.querySelector("div.NavigationBar_minorNavigationLinks__dbxh7");
            if (targetNode) {
                let div = document.createElement("div");
                div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                div.style.color = SCRIPT_COLOR_MAIN;
                div.innerHTML = isZH ? "插件设置" : "Script settings";
                div.addEventListener("click", () => {
                    const array = document.querySelectorAll(".NavigationBar_navigationLink__3eAHA");
                    array[array.length - 1]?.click();
                });
                targetNode.insertAdjacentElement("afterbegin", div);

                if (isZH) {
                    div = document.createElement("div");
                    div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                    div.style.color = SCRIPT_COLOR_MAIN;
                    div.innerHTML = isZH ? "9战模拟" : "9战模拟";
                    div.addEventListener("click", () => {
                        window.open("https://shykai.github.io/mwisim.github.io/", "_blank");
                    });
                    targetNode.insertAdjacentElement("afterbegin", div);

                    div = document.createElement("div");
                    div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                    div.style.color = SCRIPT_COLOR_MAIN;
                    div.innerHTML = isZH ? "利润网站 Mooneycalc" : "利润网站 Mooneycalc";
                    div.addEventListener("click", () => {
                        window.open("https://mooneycalc.netlify.app/", "_blank");
                    });
                    targetNode.insertAdjacentElement("afterbegin", div);

                    div = document.createElement("div");
                    div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                    div.style.color = SCRIPT_COLOR_MAIN;
                    div.innerHTML = isZH ? "利润网站 Milkonomy" : "利润网站 Milkonomy";
                    div.addEventListener("click", () => {
                        window.open("https://milkonomy.pages.dev/", "_blank");
                    });
                    targetNode.insertAdjacentElement("afterbegin", div);

                    div = document.createElement("div");
                    div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                    div.style.color = SCRIPT_COLOR_MAIN;
                    div.innerHTML = isZH ? "牛牛手册" : "牛牛手册";
                    div.addEventListener("click", () => {
                        window.open("https://test-ctmd6jnzo6t9.feishu.cn/docx/KG9ddER6Eo2uPoxJFkicsvbEnCe", "_blank");
                    });
                    targetNode.insertAdjacentElement("afterbegin", div);
                }

                div = document.createElement("div");
                div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                div.style.color = SCRIPT_COLOR_MAIN;
                div.innerHTML = isZH ? "强化模拟 Enhancelator" : "Enhancement sim Enhancelator";
                div.addEventListener("click", () => {
                    window.open("https://doh-nuts.github.io/Enhancelator/", "_blank");
                });
                targetNode.insertAdjacentElement("afterbegin", div);

                div = document.createElement("div");
                div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                div.style.color = SCRIPT_COLOR_MAIN;
                div.innerHTML = isZH ? "利润计算 Cowculator" : "Profit calc Cowculator";
                div.addEventListener("click", () => {
                    window.open("https://danthegoodman.github.io/cowculator/", "_blank");
                });
                targetNode.insertAdjacentElement("afterbegin", div);

                div = document.createElement("div");
                div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                div.style.color = SCRIPT_COLOR_MAIN;
                div.innerHTML = isZH ? "战斗模拟 AmVoidGuy-shykai" : "Combat sim AmVoidGuy";
                div.addEventListener("click", () => {
                    window.open(
                        isZH
                            ? "https://shykai.github.io/MWICombatSimulatorTest/dist/"
                            : "https://amvoidguy.github.io/MWICombatSimulatorTest/dist/index.html",
                        "_blank"
                    );
                });
                targetNode.insertAdjacentElement("afterbegin", div);
            } else {
                setTimeout(add3rdPartyLinks, 200);
            }
        };
        waitForNavi();
    }

    /* 动作列表菜单计算时间 */
    function handleActionQueueMenue(added) {
        if (!settingsMap.actionQueue.isTrue) {
            return;
        }

        handleActionQueueMenueCalculateTime(added);

        const listDiv = added.querySelector(".QueuedActions_actions__2Lur6");
        new MutationObserver((mutationsList) => {
            handleActionQueueMenueCalculateTime(added);
        }).observe(listDiv, { characterData: false, subtree: false, childList: true });
    }

    function handleActionQueueMenueCalculateTime(added) {
        const actionDivList = added.querySelectorAll("div.QueuedActions_action__r3HlD");
        if (!actionDivList || actionDivList.length === 0) {
            return;
        }
        if (actionDivList.length !== currentActionsHridList.length - 1) {
            console.error("handleActionQueueTooltip action queue length inconsistency");
            return;
        }

        let actionDivListIndex = 0;
        let hasSkippedfirstActionObj = false;
        let accumulatedTimeSec = 0;
        let isAccumulatedTimeInfinite = false;
        for (const actionObj of currentActionsHridList) {
            const actionHrid = actionObj.actionHrid;
            const count = actionObj.maxCount - actionObj.currentCount;
            let isInfinit = false;
            if (count === 0 || actionHrid.includes("/combat/")) {
                isInfinit = true;
                isAccumulatedTimeInfinite = true;
            }

            const baseTimePerActionSec = initData_actionDetailMap[actionHrid].baseTimeCost / 1000000000;
            const totalEffBuff = getTotalEffiPercentage(actionHrid);
            const toolSpeedBuff = getToolsSpeedBuffByActionHrid(actionHrid);

            let timePerActionSec = baseTimePerActionSec / (1 + toolSpeedBuff / 100);
            timePerActionSec /= 1 + totalEffBuff / 100;
            let totalTimeSec = count * timePerActionSec;

            let str = isZH ? "到 ∞ " : "Complete at ∞ ";
            if (!isAccumulatedTimeInfinite) {
                accumulatedTimeSec += totalTimeSec;
                const currentTime = new Date();
                currentTime.setSeconds(currentTime.getSeconds() + accumulatedTimeSec);
                str = `${isZH ? "到 " : "Complete at "}${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(
                    2,
                    "0"
                )}:${String(currentTime.getSeconds()).padStart(2, "0")}`;
            }

            if (hasSkippedfirstActionObj) {
                const html = `<div class="script_actionTime" style="color: ${SCRIPT_COLOR_MAIN};">${
                    isInfinit ? "[ ∞ ] " : `[${timeReadable(totalTimeSec)}]`
                } ${str}</div>`;
                if (actionDivList[actionDivListIndex].querySelector("div div.script_actionTime")) {
                    actionDivList[actionDivListIndex].querySelector("div div.script_actionTime").innerHTML = html;
                } else {
                    actionDivList[actionDivListIndex].querySelector("div").insertAdjacentHTML("beforeend", html);
                }
                actionDivListIndex++;
            }
            hasSkippedfirstActionObj = true;
        }
        const html = `<div id="script_queueTotalTime" style="color: ${SCRIPT_COLOR_MAIN};">${isZH ? "总时间：" : "Total time: "}${
            isAccumulatedTimeInfinite ? "[ ∞ ] " : `[${timeReadable(accumulatedTimeSec)}]`
        }</div>`;
        if (document.querySelector("div#script_queueTotalTime")) {
            document.querySelector("div#script_queueTotalTime").innerHTML = html;
        } else {
            document.querySelector("div.QueuedActions_queuedActionsEditMenu__3OoQH").insertAdjacentHTML("afterend", html);
        }
    }

    /* 支持修改版汉化插件 */
    function getOriTextFromElement(elem) {
        if (!elem) {
            console.error("getTextFromElement null elem");
            return "";
        }
        const translatedfrom = elem.getAttribute("script_translatedfrom");
        if (translatedfrom) {
            return translatedfrom;
        }
        return elem.textContent;
    }

    /* 强化模拟器 */
    async function handleItemTooltipWithEnhancementLevel(tooltip) {
        if (!settingsMap.enhanceSim.isTrue) {
            return;
        }

        if (typeof math === "undefined") {
            console.error(`handleItemTooltipWithEnhancementLevel no math lib`);
            tooltip
                .querySelector(".ItemTooltipText_itemTooltipText__zFq3A")
                .insertAdjacentHTML(
                    "beforeend",
                    `<div style="color: ${SCRIPT_COLOR_ALERT};">${
                        isZH ? "由于网络问题无法强化模拟: 1. 手机可能不支持脚本联网；2. 请尝试科学网络；" : "Enhancement sim Internet error"
                    }</div>`
                );
            return;
        }

        const itemNameElems = tooltip.querySelectorAll("div.ItemTooltipText_name__2JAHA span");
        let itemName = getOriTextFromElement(itemNameElems[0]);
        if (isZHInGameSetting) {
            itemName = getItemEnNameFromZhName(itemName);
        }
        const enhancementLevel = Number(itemNameElems[1].textContent.replace("+", ""));

        let itemHrid = null;
        for (const item of Object.values(initData_itemDetailMap)) {
            if (item.name === itemName) {
                itemHrid = item.hrid;
            }
        }
        if (!itemHrid || !initData_itemDetailMap[itemHrid]) {
            console.error(`handleItemTooltipWithEnhancementLevel invalid itemHrid ${itemName} ${itemHrid}`);
            return;
        }

        input_data.item_hrid = itemHrid;
        input_data.stop_at = enhancementLevel;
        const best = await findBestEnhanceStrat(input_data);

        let appendHTMLStr = `<div style="color: ${SCRIPT_COLOR_TOOLTIP};">${
            isZH ? "不支持模拟+1装备" : "Enhancement sim of +1 equipments not supported"
        }</div>`;
        if (best) {
            let needMatStr = "";
            for (const [key, value] of Object.entries(best.costs.needMap)) {
                needMatStr += `<div>${key} ${isZH ? "单价: " : "price per item: "}${numberFormatter(value)}<div>`;
            }
            appendHTMLStr = `<div style="color: ${SCRIPT_COLOR_TOOLTIP};"><div>${
                isZH
                    ? "强化模拟（默认100级强化，4级房子，10级工具，5级手套，究极茶，幸运茶，卖单价收货，无工时费）："
                    : "Enhancement simulator: Default level 100 enhancing, level 4 house, level 10 tool, level 5 gloves, ultra tea, blessed tea, sell order price in, no player time fee"
            }</div><div>${isZH ? "总成本 " : "Total cost "}${numberFormatter(best.totalCost.toFixed(0))}</div><div>${isZH ? "耗时 " : "Time spend "}${
                best.simResult.totalActionTimeStr
            }</div>${
                best.protect_count > 0
                    ? `<div>${isZH ? "从 " : "Use protection from level "}` + best.protect_at + `${isZH ? " 级开始保护" : ""}</div>`
                    : `<div>${isZH ? "不需要保护" : "No protection use"}</div>`
            }<div>${isZH ? "保护 " : "Protection "}${best.protect_count.toFixed(1)}${isZH ? " 次" : " times"}</div><div>${
                isZH ? "+0底子: " : "+0 Base item: "
            }${numberFormatter(best.costs.baseCost)}</div><div>${
                best.protect_count > 0
                    ? (isZH ? "保护单价: " : "Price per protection: ") +
                      initData_itemDetailMap[best.costs.choiceOfProtection].name +
                      " " +
                      numberFormatter(best.costs.minProtectionCost)
                    : ""
            } 
             </div>${needMatStr}</div>`;
        }

        tooltip.querySelector(".ItemTooltipText_itemTooltipText__zFq3A").insertAdjacentHTML("beforeend", appendHTMLStr);
    }

    async function findBestEnhanceStrat(input_data) {
        const price_data = await fetchMarketJSON();
        if (!price_data || !price_data.market) {
            console.error("findBestEnhanceStrat fetchMarketJSON null");
            return [];
        }

        const allResults = [];
        for (let protect_at = 2; protect_at <= input_data.stop_at; protect_at++) {
            const simResult = Enhancelate(input_data, protect_at);
            const costs = getCosts(input_data.item_hrid, price_data);
            const totalCost = costs.baseCost + costs.minProtectionCost * simResult.protect_count + costs.perActionCost * simResult.actions;
            const r = {};
            r.protect_at = protect_at;
            r.protect_count = simResult.protect_count;
            r.simResult = simResult;
            r.costs = costs;
            r.totalCost = totalCost;
            allResults.push(r);
        }

        let best = null;
        for (const r of allResults) {
            if (best === null || r.totalCost < best.totalCost) {
                best = r;
            }
        }
        return best;
    }

    // Source: https://doh-nuts.github.io/Enhancelator/
    function Enhancelate(input_data, protect_at) {
        const success_rate = [
            50, //+1
            45, //+2
            45, //+3
            40, //+4
            40, //+5
            40, //+6
            35, //+7
            35, //+8
            35, //+9
            35, //+10
            30, //+11
            30, //+12
            30, //+13
            30, //+14
            30, //+15
            30, //+16
            30, //+17
            30, //+18
            30, //+19
            30, //+20
        ];

        // 物品等级
        const itemLevel = initData_itemDetailMap[input_data.item_hrid].itemLevel;

        // 总强化buff
        let total_bonus = null;
        const effective_level =
            input_data.enhancing_level +
            (input_data.tea_enhancing ? 3 : 0) +
            (input_data.tea_super_enhancing ? 6 : 0) +
            (input_data.tea_ultra_enhancing ? 8 : 0);
        if (effective_level >= itemLevel) {
            total_bonus = 1 + (0.05 * (effective_level + input_data.laboratory_level - itemLevel) + input_data.enhancer_bonus) / 100;
        } else {
            total_bonus = 1 - 0.5 * (1 - effective_level / itemLevel) + (0.05 * input_data.laboratory_level + input_data.enhancer_bonus) / 100;
        }

        // 模拟
        let markov = math.zeros(20, 20);
        for (let i = 0; i < input_data.stop_at; i++) {
            const success_chance = (success_rate[i] / 100.0) * total_bonus;
            const destination = i >= protect_at ? i - 1 : 0;
            if (input_data.tea_blessed) {
                markov.set([i, i + 2], success_chance * 0.01);
                markov.set([i, i + 1], success_chance * 0.99);
                markov.set([i, destination], 1 - success_chance);
            } else {
                markov.set([i, i + 1], success_chance);
                markov.set([i, destination], 1.0 - success_chance);
            }
        }
        markov.set([input_data.stop_at, input_data.stop_at], 1.0);
        let Q = markov.subset(math.index(math.range(0, input_data.stop_at), math.range(0, input_data.stop_at)));
        const M = math.inv(math.subtract(math.identity(input_data.stop_at), Q));
        const attemptsArray = M.subset(math.index(math.range(0, 1), math.range(0, input_data.stop_at)));
        const attempts = math.flatten(math.row(attemptsArray, 0).valueOf()).reduce((a, b) => a + b, 0);
        const protectAttempts = M.subset(math.index(math.range(0, 1), math.range(protect_at, input_data.stop_at)));
        const protectAttemptsArray = typeof protectAttempts === "number" ? [protectAttempts] : math.flatten(math.row(protectAttempts, 0).valueOf());
        const protects = protectAttemptsArray.map((a, i) => a * markov.get([i + protect_at, i + protect_at - 1])).reduce((a, b) => a + b, 0);

        // 动作时间
        const perActionTimeSec = (
            12 /
            (1 +
                (input_data.enhancing_level > itemLevel
                    ? (effective_level + input_data.laboratory_level - itemLevel + input_data.glove_bonus) / 100
                    : (input_data.laboratory_level + input_data.glove_bonus) / 100))
        ).toFixed(2);

        const result = {};
        result.actions = attempts;
        result.protect_count = protects;
        result.totalActionTimeSec = perActionTimeSec * attempts;
        result.totalActionTimeStr = timeReadable(result.totalActionTimeSec);
        return result;
    }

    // 自定义强化模拟输入参数
    // Customization
    let input_data = {
        item_hrid: null,
        stop_at: null,

        enhancing_level: 100, // 人物 Enhancing 技能等级
        laboratory_level: 4, // 房子等级
        enhancer_bonus: 4.64, // 工具提高成功率，0级=3.6，5级=4.03，10级=4.64
        glove_bonus: 11.2, // 手套提高强化速度，0级=10，5级=11.2，10级=12.9

        tea_enhancing: false, // 强化茶
        tea_super_enhancing: false, // 超级强化茶
        tea_ultra_enhancing: true,
        tea_blessed: true, // 祝福茶

        priceAskBidRatio: 1, // 取市场卖单价买单价比例，1=只用卖单价，0=只用买单价
    };

    function getCosts(hrid, price_data) {
        const itemDetailObj = initData_itemDetailMap[hrid];

        // +0本体成本
        const baseCost = getRealisticBaseItemPrice(hrid, price_data);

        // 保护成本
        let minProtectionPrice = null;
        let minProtectionHrid = null;
        let protect_item_hrids =
            itemDetailObj.protectionItemHrids == null
                ? [hrid, "/items/mirror_of_protection"]
                : [hrid, "/items/mirror_of_protection"].concat(itemDetailObj.protectionItemHrids);
        protect_item_hrids.forEach((protection_hrid, i) => {
            const this_cost = getRealisticBaseItemPrice(protection_hrid, price_data);
            if (i === 0) {
                minProtectionPrice = this_cost;
                minProtectionHrid = protection_hrid;
            } else {
                if (this_cost > 0 && (minProtectionPrice < 0 || this_cost < minProtectionPrice)) {
                    minProtectionPrice = this_cost;
                    minProtectionHrid = protection_hrid;
                }
            }
        });

        // 强化材料成本
        const needMap = {};
        let totalNeedPrice = 0;
        for (const need of itemDetailObj.enhancementCosts) {
            const price = getItemMarketPrice(need.itemHrid, price_data);
            totalNeedPrice += price * need.count;
            if (!need.itemHrid.includes("/coin")) {
                needMap[initData_itemDetailMap[need.itemHrid].name] = price;
            }
        }

        return {
            baseCost: baseCost,
            minProtectionCost: minProtectionPrice,
            perActionCost: totalNeedPrice,
            choiceOfProtection: minProtectionHrid,
            needMap: needMap,
        };
    }

    function getRealisticBaseItemPrice(hrid, price_data) {
        const itemDetailObj = initData_itemDetailMap[hrid];
        const productionCost = getBaseItemProductionCost(itemDetailObj.name, price_data);

        const fullName = initData_itemDetailMap[hrid].name;
        const item_price_data = price_data.market[fullName];
        const ask = item_price_data?.ask;
        const bid = item_price_data?.bid;

        let result = 0;

        if (ask && ask > 0) {
            if (bid && bid > 0) {
                // Both ask and bid.
                if (ask / bid > 1.3) {
                    result = Math.max(bid, productionCost);
                } else {
                    result = ask;
                }
            } else {
                // Only ask.
                if (ask / productionCost > 1.3) {
                    result = productionCost;
                } else {
                    result = Math.max(ask, productionCost);
                }
            }
        } else {
            if (bid && bid > 0) {
                // Only bid.
                result = Math.max(bid, productionCost);
            } else {
                // Neither ask nor bid.
                result = productionCost;
            }
        }

        return result;
    }

    function getItemMarketPrice(hrid, price_data) {
        const fullName = initData_itemDetailMap[hrid].name;
        const item_price_data = price_data.market[fullName];

        // Return 0 if the item does not have neither ask nor bid prices.
        if (!item_price_data || (item_price_data.ask < 0 && item_price_data.bid < 0)) {
            // console.log("getItemMarketPrice() return 0 due to neither ask nor bid prices: " + fullName);
            return 0;
        }

        // Return the other price if the item does not have ask or bid price.
        let ask = item_price_data.ask;
        let bid = item_price_data.bid;
        if (ask > 0 && bid < 0) {
            return ask;
        }
        if (bid > 0 && ask < 0) {
            return bid;
        }

        let final_cost = ask * input_data.priceAskBidRatio + bid * (1 - input_data.priceAskBidRatio);
        return final_cost;
    }

    // +0底子制作成本，仅单层制作，考虑茶减少消耗
    function getBaseItemProductionCost(itemName, price_data) {
        const actionHrid = getActionHridFromItemName(itemName);
        if (!actionHrid || !initData_actionDetailMap[actionHrid]) {
            return -1;
        }

        let totalPrice = 0;

        const inputItems = JSON.parse(JSON.stringify(initData_actionDetailMap[actionHrid].inputItems));
        for (let item of inputItems) {
            totalPrice += getItemMarketPrice(item.itemHrid, price_data) * item.count;
        }
        totalPrice *= 0.9; // 茶减少消耗

        const upgradedFromItemHrid = initData_actionDetailMap[actionHrid]?.upgradeItemHrid;
        if (upgradedFromItemHrid) {
            totalPrice += getItemMarketPrice(upgradedFromItemHrid, price_data) * 1;
        }

        return totalPrice;
    }

    /* 脚本设置面板 */
    const waitForSetttins = () => {
        const targetNode = document.querySelector("div.SettingsPanel_profileTab__214Bj");
        if (targetNode) {
            if (!targetNode.querySelector("#script_settings")) {
                targetNode.insertAdjacentHTML("beforeend", `<div id="script_settings"></div>`);
                const insertElem = targetNode.querySelector("div#script_settings");
                insertElem.insertAdjacentHTML(
                    "beforeend",
                    `<div style="float: left; color: ${SCRIPT_COLOR_MAIN}">${
                        isZH ? "MWITools 设置 （刷新生效）：" : "MWITools Settings (refresh page to apply): "
                    }</div></br>`
                );

                for (const setting of Object.values(settingsMap)) {
                    insertElem.insertAdjacentHTML(
                        "beforeend",
                        `<div style="float: left;"><input type="checkbox" id="${setting.id}" ${setting.isTrue ? "checked" : ""}></input>${
                            setting.desc
                        }</div></br>`
                    );
                }

                insertElem.insertAdjacentHTML(
                    "beforeend",
                    `<div style="float: left;">${
                        isZH
                            ? "代码里搜索“自定义”可以手动修改字体颜色、强化模拟默认参数"
                            : `Search "Customization" in code to customize font colors and default enhancement simulation parameters.`
                    }</div></br>`
                );
                insertElem.addEventListener("change", saveSettings);
            }
        }
        setTimeout(waitForSetttins, 500);
    };
    waitForSetttins();

    function saveSettings() {
        for (const checkbox of document.querySelectorAll("div#script_settings input")) {
            settingsMap[checkbox.id].isTrue = checkbox.checked;
            localStorage.setItem("script_settingsMap", JSON.stringify(settingsMap));
        }
    }

    function readSettings() {
        const ls = localStorage.getItem("script_settingsMap");
        if (ls) {
            const lsObj = JSON.parse(ls);
            for (const option of Object.values(lsObj)) {
                if (settingsMap.hasOwnProperty(option.id)) {
                    settingsMap[option.id].isTrue = option.isTrue;
                }
            }
        }

        if (settingsMap.forceMWIToolsDisplayZH.isTrue) {
            isZH = true; // For Traditional Chinese users.
        }

        if (settingsMap.useOrangeAsMainColor.isTrue && SCRIPT_COLOR_MAIN === "green") {
            SCRIPT_COLOR_MAIN = "orange";
        }
        if (settingsMap.useOrangeAsMainColor.isTrue && SCRIPT_COLOR_TOOLTIP === "darkgreen") {
            SCRIPT_COLOR_TOOLTIP = "#804600";
        }
    }

    /* 检查是否穿错生产/战斗装备 */
    function checkEquipment() {
        if (currentActionsHridList.length === 0) {
            return;
        }
        const currentActionHrid = currentActionsHridList[0].actionHrid;
        const hasHat = currentEquipmentMap["/item_locations/head"]?.itemHrid === "/items/red_chefs_hat" ? true : false; // Cooking, Brewing
        const hasOffHand = currentEquipmentMap["/item_locations/off_hand"]?.itemHrid === "/items/eye_watch" ? true : false; // Cheesesmithing, Crafting, Tailoring
        const hasBoot = currentEquipmentMap["/item_locations/feet"]?.itemHrid === "/items/collectors_boots" ? true : false; // Milking, Foraging, Woodcutting
        const hasGlove = currentEquipmentMap["/item_locations/hands"]?.itemHrid === "/items/enchanted_gloves" ? true : false; // Enhancing

        let warningStr = null;
        if (currentActionHrid.includes("/actions/combat/")) {
            if (hasHat || hasOffHand || hasBoot || hasGlove) {
                warningStr = isZH ? "正穿着生产装备" : "Production equipment equipted";
            }
        } else if (currentActionHrid.includes("/actions/cooking/") || currentActionHrid.includes("/actions/brewing/")) {
            if (!hasHat && hasItemHridInInv("/items/red_chefs_hat")) {
                warningStr = isZH ? "没穿生产帽" : "Not wearing production hat";
            }
        } else if (
            currentActionHrid.includes("/actions/cheesesmithing/") ||
            currentActionHrid.includes("/actions/crafting/") ||
            currentActionHrid.includes("/actions/tailoring/")
        ) {
            if (!hasOffHand && hasItemHridInInv("/items/eye_watch")) {
                warningStr = isZH ? "没穿生产副手" : "Not wearing production off-hand";
            }
        } else if (
            currentActionHrid.includes("/actions/milking/") ||
            currentActionHrid.includes("/actions/foraging/") ||
            currentActionHrid.includes("/actions/woodcutting/")
        ) {
            if (!hasBoot && hasItemHridInInv("/items/collectors_boots")) {
                warningStr = isZH ? "没穿生产鞋" : "Not wearing production boots";
            }
        } else if (currentActionHrid.includes("/actions/enhancing")) {
            if (!hasGlove && hasItemHridInInv("/items/enchanted_gloves")) {
                warningStr = isZH ? "没穿强化手套" : "Not wearing enhancing gloves";
            }
        }

        document.body.querySelector("#script_item_warning")?.remove();
        if (warningStr) {
            document.body.insertAdjacentHTML(
                "beforeend",
                `<div id="script_item_warning" style="position: fixed; top: 1%; left: 30%; color: ${SCRIPT_COLOR_ALERT}; font-size: 20px;">${warningStr}</div>`
            );
        }
    }

    function hasItemHridInInv(hrid) {
        let result = null;
        for (const item of initData_characterItems) {
            if (item.itemHrid === hrid && item.itemLocationHrid === "/item_locations/inventory") {
                result = item;
            }
        }
        return result ? true : false;
    }

    /* 空闲时弹窗通知 */
    function notificate() {
        if (typeof GM_notification === "undefined" || !GM_notification) {
            console.error("notificate null GM_notification");
            return;
        }
        if (currentActionsHridList.length > 0) {
            return;
        }
        console.log("notificate empty action");
        GM_notification({
            text: isZH ? "动作队列为空" : "Action queue is empty.",
            title: "MWITools",
        });
    }

    /* 市场价格自动输入最小压价 */
    const waitForMarketOrders = () => {
        const element = document.querySelector(".MarketplacePanel_marketListings__1GCyQ");
        if (element) {
            console.log("start observe market order");
            new MutationObserver((mutationsList) => {
                mutationsList.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.classList.contains("Modal_modalContainer__3B80m")) {
                            handleMarketNewOrder(node);
                        }
                    });
                });
            }).observe(element, {
                characterData: false,
                subtree: false,
                childList: true,
            });
        } else {
            setTimeout(waitForMarketOrders, 500);
        }
    };

    function handleMarketNewOrder(node) {
        const title = getOriTextFromElement(node.querySelector(".MarketplacePanel_header__yahJo"));
        if (!title || title.includes(" Now") || title.includes("立即")) {
            return;
        }
        const label = node.querySelector("span.MarketplacePanel_bestPrice__3bgKp");
        const inputDiv = node.querySelector(".MarketplacePanel_inputContainer__3xmB2 .MarketplacePanel_priceInputs__3iWxy");
        if (!label || !inputDiv) {
            console.error("handleMarketNewOrder can not find elements");
            return;
        }

        label.click();

        if (getOriTextFromElement(label.parentElement).toLowerCase().includes("best buy") || label.parentElement.textContent.includes("购买")) {
            inputDiv.querySelectorAll(".MarketplacePanel_buttonContainer__vJQud")[2]?.querySelector("div button")?.click();
        } else if (
            getOriTextFromElement(label.parentElement).toLowerCase().includes("best sell") ||
            label.parentElement.textContent.includes("出售")
        ) {
            inputDiv.querySelectorAll(".MarketplacePanel_buttonContainer__vJQud")[1]?.querySelector("div button")?.click();
        }
    }

    /* 伤害统计 */
    // 此功能基于以下作者的代码：
    // 伤害统计 by ponchain
    // 图表 by Stella
    // 头像下方显示数字 by Truth_Light
    const lang = {
        toggleButtonHide: isZH ? "收起" : "Hide",
        toggleButtonShow: isZH ? "展开" : "Show",
        players: isZH ? "玩家" : "Players",
        dpsTextDPS: isZH ? "DPS" : "DPS",
        dpsTextTotalDamage: isZH ? "总伤害" : "Total Damage",
        totalRuntime: isZH ? "运行时间" : "Runtime",
        totalTeamDPS: isZH ? "团队DPS" : "Total Team DPS",
        totalTeamDamage: isZH ? "团队总伤害" : "Total Team Damage",
        damagePercentage: isZH ? "伤害占比" : "Damage %",
        monstername: isZH ? "怪物" : "Monster",
        encountertimes: isZH ? "遭遇数" : "Encounter",
        hitChance: isZH ? "命中率" : "Hit Chance",
        aura: isZH ? "光环" : "Aura",
    };

    let totalDamage = [];
    let totalDuration = 0;
    let startTime = null;
    let endTime = null;
    let monstersHP = [];
    let players = [];
    let monsters = [];
    let dragging = false;
    let panelExpanded = true;
    let chart = null;
    let monsterCounts = {}; // Object to store monster counts
    let monsterEvasion = {}; // Object to store monster evasion ratings by combat style
    const calculateHitChance = (accuracy, evasion) => {
        const hitChance = (Math.pow(accuracy, 1.4) / (Math.pow(accuracy, 1.4) + Math.pow(evasion, 1.4))) * 100;
        return hitChance;
    };

 const getStatisticsDom = () => {
    if (!document.querySelector(".script_dps_panel")) {
        let panel = document.createElement("div");
        panel.style.position = "fixed";
        panel.style.top = "50px";
        panel.style.left = "50px";
       panel.style.background = "rgba(0, 0, 0, 0.5)";
        panel.style.border = "1px solid rgba(255, 255, 255, 0.2)";
        panel.style.zIndex = "9999";
        panel.style.fontSize = "14px";
        panel.style.padding = "10px";
        panel.style.borderRadius = "16px";
        panel.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
        panel.style.resize = "both";
        panel.style.overflow = "auto";
        panel.style.width = "400px";
        panel.style.transition = "all 0.3s ease";
        panel.style.backdropFilter = "blur(8px)";

        panel.innerHTML = `
            <div id="panelHeader" style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; cursor: move;">
                <span style="font-weight: bold; font-size: 16px; color: #0078d4;">DPS</span>
                <button id="script_toggleButton" style="background-color: #0078d4; color: white; border: none; padding: 5px 10px; border-radius: 8px; cursor: pointer; transition: background-color 0.3s ease;">${lang.toggleButtonHide}</button>
            </div>
            <div id="script_panelContent">
                <canvas id="script_dpsChart" width="300" height="200"></canvas>
                <div id="script_dpsText"></div>
                <div id="script_hitChanceTable" style="margin-top: 10px;"></div>
            </div>`;
        panel.className = "script_dps_panel";
        let offsetX, offsetY;
        let dragging = false;
        let lastMove = 0;

        const panelHeader = panel.querySelector("#panelHeader");

        // 鼠标拖动面板
        panelHeader.addEventListener("mousedown", function (e) {
            const rect = panel.getBoundingClientRect();
            const isResizing = e.clientX > rect.right - 10 || e.clientY > rect.bottom - 10;
            if (isResizing || e.target.id === "script_toggleButton") return;
            dragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            e.preventDefault(); // 阻止默认行为，防止选择文本
        });

        let dragStartTime = 0;

        document.addEventListener("mousemove", function (e) {
            if (dragging) {
                const now = Date.now();
                if (now - dragStartTime < 16) return; // 限制每16毫秒更新一次

                dragStartTime = now;
                requestAnimationFrame(() => {
                    var newX = e.clientX - offsetX;
                    var newY = e.clientY - offsetY;
                    panel.style.transform = `translate(${newX}px, ${newY}px)`;
                });
            }
        });

        document.addEventListener("mouseup", function () {
            dragging = false;
        });

        panel.addEventListener("touchstart", function (e) {
            const rect = panel.getBoundingClientRect();
            const isResizing = e.clientX > rect.right - 10 || e.clientY > rect.bottom - 10;
            if (isResizing || e.target.id === "script_toggleButton") return;
            dragging = true;
            let touch = e.touches[0];
            offsetX = touch.clientX - panel.offsetLeft;
            offsetY = touch.clientY - panel.offsetTop;
            e.preventDefault();
        });

        document.addEventListener("touchmove", function (e) {
            if (dragging) {
                let touch = e.touches[0];
                var newX = touch.clientX - offsetX;
                var newY = touch.clientY - offsetY;
                panel.style.transform = `translate(${newX}px, ${newY}px)`;
            }
        });

        document.addEventListener("touchend", function () {
            dragging = false;
        });

        document.body.appendChild(panel);

        // Toggle button functionality
        document.getElementById("script_toggleButton").addEventListener("click", function () {
            panelExpanded = !panelExpanded;
            this.textContent = lang.toggleButtonHide;
            const panelContent = document.getElementById("script_panelContent");
            if (panelExpanded) {
                panelContent.style.display = "block";
                this.textContent = lang.toggleButtonHide;
                panel.style.width = "auto";
                panel.style.height = "auto";
            } else {
                panelContent.style.display = "none";
                this.textContent = lang.toggleButtonShow;
                panel.style.width = "auto";
                panel.style.height = "auto";
            }
        });

       // Create chart
const ctx = document.getElementById("script_dpsChart").getContext("2d");
const numPlayers = players.length;
const chartHeight = numPlayers * 35; // 设置每个条目的高度
ctx.canvas.height = chartHeight;

chart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",   // 浅粉色
                    "rgba(54, 162, 235, 0.6)",   // 浅蓝色
                    "rgba(255, 206, 86, 0.6)",   // 浅黄色
                    "rgba(75, 192, 192, 0.6)",   // 浅绿色
                    "rgba(153, 102, 255, 0.6)",  // 浅紫色
                    "rgba(255, 159, 64, 0.6)",   // 浅橙色
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",    // 浅粉色边框
                    "rgba(54, 162, 235, 1)",    // 浅蓝色边框
                    "rgba(255, 206, 86, 1)",    // 浅黄色边框
                    "rgba(75, 192, 192, 1)",    // 浅绿色边框
                    "rgba(153, 102, 255, 1)",   // 浅紫色边框
                    "rgba(255, 159, 64, 1)",    // 浅橙色边框
                ],
                borderWidth: 1,
                barPercentage: 0.9,
                categoryPercentage: 1.0,
            },
        ],
    },
    options: {
    responsive: true,
    indexAxis: "y",
    scales: {
        x: {
            beginAtZero: true,
            grace: "20%",
            display: false,
            grid: {
                display: false,
            },
        },
        y: {
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    size: 12,   // 字体大小
                    weight: "bold",  // 加粗字体
                },
                color: "rgba(255, 255, 255, 0.7)",  // 浅色字体（你可以根据背景调整颜色）
            },
        },
    },
    layout: {
        padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: false,
        },
        datalabels: {
            anchor: "end",
            align: "right",
            color: function (context) {
                const value = context.dataset.data[context.dataIndex];
                return value > 0 ? "white" : "transparent";
            },
            font: {
                weight: "bold",
                size: 12,
            },
            formatter: function (value) {
                return `${value.toLocaleString()}`;
            },
            clip: false,
            display: true,
        },
    },
},

    plugins: [ChartDataLabels],
});

    }
    return document.querySelector(".script_dps_panel");
};


    const updateStatisticsPanel = () => {
        const totalTime = totalDuration + (endTime - startTime) / 1000;
        const dps = totalDamage.map((damage) => (totalTime ? Math.round(damage / totalTime) : 0));
        const totalTeamDamage = totalDamage.reduce((acc, damage) => acc + damage, 0);
        const totalTeamDPS = totalTime ? Math.round(totalTeamDamage / totalTime) : 0;

        // 人物头像下方显示数字
        const playersContainer = document.querySelector(".BattlePanel_combatUnitGrid__2hTAM");
        if (playersContainer) {
            players.forEach((player, index) => {
                const playerElement = playersContainer.children[index];
                if (playerElement) {
                    const statusElement = playerElement.querySelector(".CombatUnit_status__3bH7W");
                    if (statusElement) {
                        let dpsElement = statusElement.querySelector(".dps-info");
                        if (!dpsElement) {
                            dpsElement = document.createElement("div");
                            dpsElement.className = "dps-info";
                            statusElement.appendChild(dpsElement);
                        }
                        dpsElement.textContent = `DPS: ${dps[index].toLocaleString()} (${numberFormatter(totalDamage[index])})`;
                    }
                }
            });
        }

      // 显示图表
if (settingsMap.showDamageGraph.isTrue && !dragging) {
    const panel = getStatisticsDom();
    chart.data.labels = players.map((player) => player?.name);
    chart.data.datasets[0].data = dps;
    chart.update();

    // Update text information
    const days = Math.floor(totalTime / (24 * 3600));
    const hours = Math.floor((totalTime % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    const seconds = Math.floor(totalTime % 60);
    const formattedTime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const dpsText = document.getElementById("script_dpsText");
    const playerRows = players
        .map((player, index) => {
            const dpsFormatted = dps[index].toLocaleString();
            const totalDamageFormatted = totalDamage[index].toLocaleString();
            const damagePercentage = totalTeamDamage ? ((totalDamage[index] / totalTeamDamage) * 100).toFixed(2) : 0;

            // Get auraskill for the current player
            let auraskill = "N/A";
            if (player.combatAbilities && Array.isArray(player.combatAbilities)) {
                const firstAbility = player.combatAbilities[0];
                if (firstAbility && firstAbility.abilityHrid) {
                    auraskill = firstAbility.abilityHrid.split("/").pop().replace(/_/g, " ");
                    const validSkills = [
                        "revive",
                        "insanity",
                        "invincible",
                        "fierce aura",
                        "aqua aura",
                        "sylvan aura",
                        "flame aura",
                        "speed aura",
                        "critical aura",
                    ];
                    if (!validSkills.includes(auraskill)) {
                        auraskill = "N/A";
                    }
                }
            }

            // Capitalize the first letter of each word in aura skill
            auraskill = auraskill
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            // Highlight the player with the highest DPS
            const isHighestDPS = dps[index] === Math.max(...dps);
            const dpsPrefix = isHighestDPS ? "🔥" : "";

            return `
            <tr style="color: white;">
                <td style="font-weight: bold;">${dpsPrefix} ${player.name}</td>
                <td>${auraskill}</td>
                <td>${dpsFormatted}</td>
                <td>${totalDamageFormatted}</td>
                <td>${damagePercentage}%</td>
            </tr>`;
        })
        .join("");

    // Display monster counts
    const monsterRows = Object.entries(monsterCounts)
        .map(([name, count]) => {
            return `<tr><td style="color: white;">${name} (${count})</td></tr>`;
        })
        .join("");

    dpsText.innerHTML = `
    <table style="width: 100%; border-collapse: collapse; font-size: smaller;">
        <thead>
            <tr style="text-align: left; color: white;">
                <th style="font-weight: bold;">${lang.players}</th>
                <th style="font-weight: bold;">${lang.aura}</th>
                <th style="font-weight: bold;">${lang.dpsTextDPS}</th>
                <th style="font-weight: bold;">${lang.dpsTextTotalDamage}</th>
                <th style="font-weight: bold;">${lang.damagePercentage}</th>
            </tr>
        </thead>
        <tbody>
            ${playerRows}
        </tbody>
        <tbody>
            <tr style="border-top: 2px solid white; font-weight: bold; text-align: left; color: white;">
                <td>${formattedTime}</td>
                <td></td>
                <td>${totalTeamDPS.toLocaleString()}</td>
                <td>${totalTeamDamage.toLocaleString()}</td>
                <td>100%</td>
            </tr>
        </tbody>
    </table>`;

    // Update hit chance table
    const hitChanceTable = document.getElementById("script_hitChanceTable");
    const hitChanceRows = players
        .map((player) => {
            const playerName = player.name;
            const playerHitChances = Object.entries(monsterCounts)
                .map(([monsterName, count]) => {
                    const combatStyle = player.combatDetails.combatStats.combatStyleHrids[0].split("/").pop(); // Assuming only one combat style for simplicity
                    const evasionRating = monsterEvasion[monsterName][`${player.name}-${combatStyle}`];
                    const accuracy = player.combatDetails[`${combatStyle}AccuracyRating`];
                    const hitChance = calculateHitChance(accuracy, evasionRating);
                    return `<td style="color: white;">${hitChance.toFixed(0)}%</td>`;
                })
                .join("");
            return `<tr><td style="color: white;">${playerName}</td>${playerHitChances}</tr>`;
        })
        .join("");

    hitChanceTable.innerHTML = `
    <table style="width: 100%; border-collapse: collapse; font-size: smaller;">
        <thead>
            <tr>
                <th style="font-size: smaller; white-space: normal; text-align: left; color: white;">${lang.hitChance}</th>
                ${Object.entries(monsterCounts)
                    .map(
                        ([monsterName, count]) =>
                            `<th style="font-size: smaller; white-space: normal; text-align: left; color: white;">${monsterName} (${count})</th>`
                    )
                    .join("")}
            </tr>
        </thead>
        <tbody>
            ${hitChanceRows}
        </tbody>
    </table>`;
}

    };

    /* 为 https://amvoidguy.github.io/MWICombatSimulatorTest/ 添加导入按钮 */
    // Parts of code regarding group export are by Ratatatata (https://greasyfork.org/en/scripts/507255).
    function addImportButtonForAmvoidguy() {
        const checkElem = () => {
            const selectedElement = document.querySelector(`button#buttonImportExport`);
            if (selectedElement) {
                clearInterval(timer);
                let button = document.createElement("button");
                selectedElement.parentNode.parentElement.parentElement.insertBefore(button, selectedElement.parentElement.parentElement.nextSibling);
                button.textContent = isZH
                    ? "单人/组队导入(刷新游戏网页更新人物数据)"
                    : "Import solo/group (Refresh game page to update character set)";
                button.style.backgroundColor = SCRIPT_COLOR_MAIN;
                button.style.padding = "5px";
                button.onclick = function () {
                    console.log("Importer: Import button onclick");
                    const getPriceButton = document.querySelector(`button#buttonGetPrices`);
                    if (getPriceButton) {
                        console.log("Click getPriceButton");
                        getPriceButton.click();
                    }
                    importDataForAmvoidguy(button);
                    return false;
                };
            }
        };
        let timer = setInterval(checkElem, 200);
    }

    async function importDataForAmvoidguy(button) {
        const [exportObj, playerIDs, importedPlayerPositions, zone, isZoneDungeon, isParty] = constructGroupExportObj();
        console.log(exportObj);
        console.log(playerIDs);

        document.querySelector(`a#group-combat-tab`).click();
        const importInputElem = document.querySelector(`input#inputSetGroupCombatAll`);
        importInputElem.value = JSON.stringify(exportObj);
        document.querySelector(`button#buttonImportSet`).click();

        document.querySelector(`a#player1-tab`).textContent = playerIDs[0];
        document.querySelector(`a#player2-tab`).textContent = playerIDs[1];
        document.querySelector(`a#player3-tab`).textContent = playerIDs[2];
        document.querySelector(`a#player4-tab`).textContent = playerIDs[3];
        document.querySelector(`a#player5-tab`).textContent = playerIDs[4];

        // Select zone or dungeon
        if (zone) {
            if (isZoneDungeon) {
                document.querySelector(`input#simDungeonToggle`).checked = true;
                document.querySelector(`input#simDungeonToggle`).dispatchEvent(new Event("change"));
                const selectDungeon = document.querySelector(`select#selectDungeon`);
                for (let i = 0; i < selectZone.options.length; i++) {
                    if (selectDungeon.options[i].value === zone) {
                        selectDungeon.options[i].selected = true;
                        break;
                    }
                }
            } else {
                document.querySelector(`input#simDungeonToggle`).checked = false;
                document.querySelector(`input#simDungeonToggle`).dispatchEvent(new Event("change"));
                const selectZone = document.querySelector(`select#selectZone`);
                for (let i = 0; i < selectZone.options.length; i++) {
                    if (selectZone.options[i].value === zone) {
                        selectZone.options[i].selected = true;
                        break;
                    }
                }
            }
        }

        // Select sim players
        for (let i = 0; i < 5; i++) {
            if (importedPlayerPositions[i]) {
                if (document.querySelector(`input#player${i + 1}.form-check-input.player-checkbox`)) {
                    document.querySelector(`input#player${i + 1}.form-check-input.player-checkbox`).checked = true;
                    document.querySelector(`input#player${i + 1}.form-check-input.player-checkbox`).dispatchEvent(new Event("change"));
                }
            } else {
                if (document.querySelector(`input#player${i + 1}.form-check-input.player-checkbox`)) {
                    document.querySelector(`input#player${i + 1}.form-check-input.player-checkbox`).checked = false;
                    document.querySelector(`input#player${i + 1}.form-check-input.player-checkbox`).dispatchEvent(new Event("change"));
                }
            }
        }

        // Input simulation time
        document.querySelector(`input#inputSimulationTime`).value = 24;

        button.textContent = isZH ? "已导入" : "Imported";
        if (!isParty) {
            setTimeout(() => {
                document.querySelector(`button#buttonStartSimulation`).click();
            }, 500);
        }
    }

    /* 为 9战模拟网站 添加导入按钮 */
    function addImportButtonFor9Battles() {
        const checkElem = () => {
            const selectedElement = document.querySelector(`button#buttonImportExport`);
            if (selectedElement) {
                clearInterval(timer);
                let button = document.createElement("button");
                selectedElement.parentNode.parentElement.parentElement.insertBefore(button, selectedElement.parentElement.parentElement.nextSibling);
                button.textContent = isZH ? "导入自己(刷新游戏网页更新人物数据)" : "Import Self(Refresh game page to update character set)";
                button.style.backgroundColor = SCRIPT_COLOR_MAIN;
                button.style.padding = "5px";
                button.onclick = function () {
                    console.log("Importer: Import button onclick");
                    const getPriceButton = document.querySelector(`button#buttonGetPrices`);
                    if (getPriceButton) {
                        console.log("Click getPriceButton");
                        getPriceButton.click();
                    }
                    importDataFor9Battles(button);
                    return false;
                };
            }
        };
        let timer = setInterval(checkElem, 200);
    }

    async function importDataFor9Battles(button) {
        const characterObj = JSON.parse(GM_getValue("init_character_data", ""));
        const clientObj = JSON.parse(GM_getValue("init_client_data", ""));
        console.log(characterObj);
        console.log(clientObj);

        const json = constructSelfPlayerExportObjFromInitCharacterData(characterObj, clientObj);
        console.log(json);

        const importInputElem = document.querySelector(`input#inputSet`);
        importInputElem.value = JSON.stringify(json);
        document.querySelector(`button#buttonImportSet`).click();

        button.textContent = isZH ? "已导入" : "Imported";
        // setTimeout(() => {
        //     document.querySelector(`button#buttonStartSimulation`).click();
        // }, 500);
    }

    function constructGroupExportObj() {
        const characterObj = JSON.parse(GM_getValue("init_character_data", ""));
        const clientObj = JSON.parse(GM_getValue("init_client_data", ""));
        let battleObj = null;
        if (GM_getValue("new_battle", "")) {
            battleObj = JSON.parse(GM_getValue("new_battle", ""));
        }
        // console.log(battleObj);
        const storedProfileList = JSON.parse(GM_getValue("profile_export_list", "[]"));
        // console.log(storedProfileList);

        const BLANK_PLAYER_JSON = `{\"player\":{\"attackLevel\":1,\"magicLevel\":1,\"powerLevel\":1,\"rangedLevel\":1,\"defenseLevel\":1,\"staminaLevel\":1,\"intelligenceLevel\":1,\"equipment\":[]},\"food\":{\"/action_types/combat\":[{\"itemHrid\":\"\"},{\"itemHrid\":\"\"},{\"itemHrid\":\"\"}]},\"drinks\":{\"/action_types/combat\":[{\"itemHrid\":\"\"},{\"itemHrid\":\"\"},{\"itemHrid\":\"\"}]},\"abilities\":[{\"abilityHrid\":\"\",\"level\":\"1\"},{\"abilityHrid\":\"\",\"level\":\"1\"},{\"abilityHrid\":\"\",\"level\":\"1\"},{\"abilityHrid\":\"\",\"level\":\"1\"},{\"abilityHrid\":\"\",\"level\":\"1\"}],\"triggerMap\":{},\"zone\":\"/actions/combat/fly\",\"simulationTime\":\"100\",\"houseRooms\":{\"/house_rooms/dairy_barn\":0,\"/house_rooms/garden\":0,\"/house_rooms/log_shed\":0,\"/house_rooms/forge\":0,\"/house_rooms/workshop\":0,\"/house_rooms/sewing_parlor\":0,\"/house_rooms/kitchen\":0,\"/house_rooms/brewery\":0,\"/house_rooms/laboratory\":0,\"/house_rooms/observatory\":0,\"/house_rooms/dining_room\":0,\"/house_rooms/library\":0,\"/house_rooms/dojo\":0,\"/house_rooms/gym\":0,\"/house_rooms/armory\":0,\"/house_rooms/archery_range\":0,\"/house_rooms/mystical_study\":0}}`;

        const exportObj = {};
        exportObj[1] = BLANK_PLAYER_JSON;
        exportObj[2] = BLANK_PLAYER_JSON;
        exportObj[3] = BLANK_PLAYER_JSON;
        exportObj[4] = BLANK_PLAYER_JSON;
        exportObj[5] = BLANK_PLAYER_JSON;

        let isParty = false;
        const playerIDs = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5"];
        const importedPlayerPositions = [false, false, false, false, false];
        let zone = "/actions/combat/fly";
        let isZoneDungeon = false;

        if (!characterObj?.partyInfo?.partySlotMap) {
            exportObj[1] = JSON.stringify(constructSelfPlayerExportObjFromInitCharacterData(characterObj, clientObj));
            playerIDs[0] = characterObj.character.name;
            importedPlayerPositions[0] = true;
            // Zone
            for (const action of characterObj.characterActions) {
                if (action && action.actionHrid.includes("/actions/combat/")) {
                    zone = action.actionHrid;
                    isZoneDungeon = clientObj.actionDetailMap[action.actionHrid]?.combatZoneInfo?.isDungeon;
                    break;
                }
            }
        } else {
            isParty = true;
            let i = 1;
            for (const member of Object.values(characterObj.partyInfo.partySlotMap)) {
                if (member.characterID) {
                    if (member.characterID === characterObj.character.id) {
                        exportObj[i] = JSON.stringify(constructSelfPlayerExportObjFromInitCharacterData(characterObj, clientObj));
                        playerIDs[i - 1] = characterObj.character.name;
                        importedPlayerPositions[i - 1] = true;
                    } else {
                        const profileList = storedProfileList.filter((item) => item.characterID === member.characterID);
                        if (profileList.length !== 1) {
                            console.log("Can not find stored profile for " + member.characterID);
                            playerIDs[i - 1] = isZH ? "需要点开资料" : "Open profile in game";
                            i++;
                            continue;
                        }
                        const profile = profileList[0];

                        const battlePlayerList = battleObj.players.filter((item) => item.character.id === member.characterID);
                        let battlePlayer = null;
                        if (battlePlayerList.length === 1) {
                            battlePlayer = battlePlayerList[0];
                        }

                        exportObj[i] = JSON.stringify(constructPlayerExportObjFromStoredProfile(profile, clientObj, battlePlayer));
                        playerIDs[i - 1] = profile.characterName;
                        importedPlayerPositions[i - 1] = true;
                    }
                }
                i++;
            }

            // Zone
            zone = characterObj.partyInfo?.party?.actionHrid;
            isZoneDungeon = clientObj.actionDetailMap[zone]?.combatZoneInfo?.isDungeon;
        }

        return [exportObj, playerIDs, importedPlayerPositions, zone, isZoneDungeon, isParty];
    }

    function constructSelfPlayerExportObjFromInitCharacterData(characterObj, clientObj) {
        const playerObj = {};
        playerObj.player = {};

        // Levels
        for (const skill of characterObj.characterSkills) {
            if (skill.skillHrid.includes("stamina")) {
                playerObj.player.staminaLevel = skill.level;
            } else if (skill.skillHrid.includes("intelligence")) {
                playerObj.player.intelligenceLevel = skill.level;
            } else if (skill.skillHrid.includes("attack")) {
                playerObj.player.attackLevel = skill.level;
            } else if (skill.skillHrid.includes("power")) {
                playerObj.player.powerLevel = skill.level;
            } else if (skill.skillHrid.includes("defense")) {
                playerObj.player.defenseLevel = skill.level;
            } else if (skill.skillHrid.includes("ranged")) {
                playerObj.player.rangedLevel = skill.level;
            } else if (skill.skillHrid.includes("magic")) {
                playerObj.player.magicLevel = skill.level;
            }
        }

        // Items
        playerObj.player.equipment = [];
        for (const item of characterObj.characterItems) {
            if (!item.itemLocationHrid.includes("/item_locations/inventory")) {
                playerObj.player.equipment.push({
                    itemLocationHrid: item.itemLocationHrid,
                    itemHrid: item.itemHrid,
                    enhancementLevel: item.enhancementLevel,
                });
            }
        }

        // Food
        playerObj.food = {};
        playerObj.food["/action_types/combat"] = [];
        for (const food of characterObj.actionTypeFoodSlotsMap["/action_types/combat"]) {
            if (food) {
                playerObj.food["/action_types/combat"].push({
                    itemHrid: food.itemHrid,
                });
            } else {
                playerObj.food["/action_types/combat"].push({
                    itemHrid: "",
                });
            }
        }

        // Drinks
        playerObj.drinks = {};
        playerObj.drinks["/action_types/combat"] = [];
        for (const drink of characterObj.actionTypeDrinkSlotsMap["/action_types/combat"]) {
            if (drink) {
                playerObj.drinks["/action_types/combat"].push({
                    itemHrid: drink.itemHrid,
                });
            } else {
                playerObj.drinks["/action_types/combat"].push({
                    itemHrid: "",
                });
            }
        }

        // Abilities
        playerObj.abilities = [
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
        ];
        let normalAbillityIndex = 1;
        for (const ability of characterObj.combatUnit.combatAbilities) {
            if (ability && clientObj.abilityDetailMap[ability.abilityHrid].isSpecialAbility) {
                playerObj.abilities[0] = {
                    abilityHrid: ability.abilityHrid,
                    level: ability.level,
                };
            } else if (ability) {
                playerObj.abilities[normalAbillityIndex++] = {
                    abilityHrid: ability.abilityHrid,
                    level: ability.level,
                };
            }
        }

        // TriggerMap
        playerObj.triggerMap = { ...characterObj.abilityCombatTriggersMap, ...characterObj.consumableCombatTriggersMap };

        // HouseRooms
        playerObj.houseRooms = {};
        for (const house of Object.values(characterObj.characterHouseRoomMap)) {
            playerObj.houseRooms[house.houseRoomHrid] = house.level;
        }

        return playerObj;
    }

    function constructPlayerExportObjFromStoredProfile(profile, clientObj, battlePlayer) {
        const playerObj = {};
        playerObj.player = {};

        // Levels
        for (const skill of profile.profile.characterSkills) {
            if (skill.skillHrid.includes("stamina")) {
                playerObj.player.staminaLevel = skill.level;
            } else if (skill.skillHrid.includes("intelligence")) {
                playerObj.player.intelligenceLevel = skill.level;
            } else if (skill.skillHrid.includes("attack")) {
                playerObj.player.attackLevel = skill.level;
            } else if (skill.skillHrid.includes("power")) {
                playerObj.player.powerLevel = skill.level;
            } else if (skill.skillHrid.includes("defense")) {
                playerObj.player.defenseLevel = skill.level;
            } else if (skill.skillHrid.includes("ranged")) {
                playerObj.player.rangedLevel = skill.level;
            } else if (skill.skillHrid.includes("magic")) {
                playerObj.player.magicLevel = skill.level;
            }
        }

        // Items
        playerObj.player.equipment = [];
        if (profile.profile.wearableItemMap) {
            for (const key in profile.profile.wearableItemMap) {
                const item = profile.profile.wearableItemMap[key];
                playerObj.player.equipment.push({
                    itemLocationHrid: item.itemLocationHrid,
                    itemHrid: item.itemHrid,
                    enhancementLevel: item.enhancementLevel,
                });
            }
        }

        // Food and drinks
        playerObj.food = {};
        playerObj.food["/action_types/combat"] = [];
        playerObj.drinks = {};
        playerObj.drinks["/action_types/combat"] = [];

        if (battlePlayer?.combatConsumables) {
            for (const foodOrDrink of battlePlayer.combatConsumables) {
                if (foodOrDrink.itemHrid.includes("coffee")) {
                    playerObj.drinks["/action_types/combat"].push({
                        itemHrid: foodOrDrink.itemHrid,
                    });
                } else {
                    playerObj.food["/action_types/combat"].push({
                        itemHrid: foodOrDrink.itemHrid,
                    });
                }
            }
        } else {
            // Assume food and drinks based on equipted weapon
            const weapon =
                profile.profile.wearableItemMap &&
                (profile.profile.wearableItemMap["/item_locations/main_hand"]?.itemHrid ||
                    profile.profile.wearableItemMap["/item_locations/two_hand"]?.itemHrid);
            if (weapon) {
                if (weapon.includes("shooter") || weapon.includes("bow")) {
                    // 远程
                    // xp,超远,暴击
                    playerObj.drinks["/action_types/combat"].push({
                        itemHrid: "/items/wisdom_coffee",
                    });
                    playerObj.drinks["/action_types/combat"].push({
                        itemHrid: "/items/super_ranged_coffee",
                    });
                    playerObj.drinks["/action_types/combat"].push({
                        itemHrid: "/items/critical_coffee",
                    });
                    // 2红1蓝
                    playerObj.food["/action_types/combat"].push({
                        itemHrid: "/items/spaceberry_donut",
                    });
                    playerObj.food["/action_types/combat"].push({
                        itemHrid: "/items/spaceberry_cake",
                    });
                    playerObj.food["/action_types/combat"].push({
                        itemHrid: "/items/star_fruit_yogurt",
                    });
                } else if (weapon.includes("boomstick") || weapon.includes("staff")) {
                    // 法师
                    // xp,超魔,吟唱
                    playerObj.drinks["/action_types/combat"].push({
                        itemHrid: "/items/wisdom_coffee",
                    });
                    playerObj.drinks["/action_types/combat"].push({
                        itemHrid: "/items/super_magic_coffee",
                    });
                    playerObj.drinks["/action_types/combat"].push({
                        itemHrid: "/items/channeling_coffee",
                    });
                    // 1红2蓝
                    playerObj.food["/action_types/combat"].push({
                        itemHrid: "/items/spaceberry_cake",
                    });
                    playerObj.food["/action_types/combat"].push({
                        itemHrid: "/items/star_fruit_gummy",
                    });
                    playerObj.food["/action_types/combat"].push({
                        itemHrid: "/items/star_fruit_yogurt",
                    });
                } else if (weapon.includes("bulwark")) {
                    // 双手盾 精暮光
                    // xp,超防,超耐
                    playerObj.drinks["/action_types/combat"].push({
                        itemHrid: "/items/wisdom_coffee",
                    });
                    playerObj.drinks["/action_types/combat"].push({
                        itemHrid: "/items/super_defense_coffee",
                    });
                    playerObj.drinks["/action_types/combat"].push({
                        itemHrid: "/items/super_stamina_coffee",
                    });
                    // 2红1蓝
                    playerObj.food["/action_types/combat"].push({
                        itemHrid: "/items/spaceberry_donut",
                    });
                    playerObj.food["/action_types/combat"].push({
                        itemHrid: "/items/spaceberry_cake",
                    });
                    playerObj.food["/action_types/combat"].push({
                        itemHrid: "/items/star_fruit_yogurt",
                    });
                } else {
                    // 战士
                    // xp,超力,迅捷
                    playerObj.drinks["/action_types/combat"].push({
                        itemHrid: "/items/wisdom_coffee",
                    });
                    playerObj.drinks["/action_types/combat"].push({
                        itemHrid: "/items/super_power_coffee",
                    });
                    playerObj.drinks["/action_types/combat"].push({
                        itemHrid: "/items/swiftness_coffee",
                    });
                    // 2红1蓝
                    playerObj.food["/action_types/combat"].push({
                        itemHrid: "/items/spaceberry_donut",
                    });
                    playerObj.food["/action_types/combat"].push({
                        itemHrid: "/items/spaceberry_cake",
                    });
                    playerObj.food["/action_types/combat"].push({
                        itemHrid: "/items/star_fruit_yogurt",
                    });
                }
            }
        }

        // Abilities
        playerObj.abilities = [
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
        ];
        if (profile.profile.equippedAbilities) {
            let normalAbillityIndex = 1;
            for (const ability of profile.profile.equippedAbilities) {
                if (ability && clientObj.abilityDetailMap[ability.abilityHrid].isSpecialAbility) {
                    playerObj.abilities[0] = {
                        abilityHrid: ability.abilityHrid,
                        level: ability.level,
                    };
                } else if (ability) {
                    playerObj.abilities[normalAbillityIndex++] = {
                        abilityHrid: ability.abilityHrid,
                        level: ability.level,
                    };
                }
            }
        }

        // TriggerMap
        // Ignored. The game does not provide access to other players' trigger settings.

        // HouseRooms
        playerObj.houseRooms = {};
        for (const house of Object.values(profile.profile.characterHouseRoomMap)) {
            playerObj.houseRooms[house.houseRoomHrid] = house.level;
        }

        return playerObj;
    }

    async function observeResultsForAmvoidguy() {
        let resultDiv = document.querySelector(`div.row`)?.querySelectorAll(`div.col-md-5`)?.[2]?.querySelector(`div.row > div.col-md-5`);
        while (!resultDiv) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            resultDiv = document.querySelector(`div.row`)?.querySelectorAll(`div.col-md-5`)?.[2]?.querySelector(`div.row > div.col-md-5`);
        }

        const deathDiv = document.querySelector(`div#simulationResultPlayerDeaths`);
        const expDiv = document.querySelector(`div#simulationResultExperienceGain`);
        const consumeDiv = document.querySelector(`div#simulationResultConsumablesUsed`);
        deathDiv.style.backgroundColor = "#FFEAE9";
        deathDiv.style.color = "black";
        expDiv.style.backgroundColor = "#CDFFDD";
        expDiv.style.color = "black";
        consumeDiv.style.backgroundColor = "#F0F8FF";
        consumeDiv.style.color = "black";

        let div = document.createElement("div");
        div.id = "tillLevel";
        div.style.backgroundColor = "#FFFFE0";
        div.style.color = "black";
        div.textContent = "";
        resultDiv.append(div);

        new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (mutation.addedNodes.length >= 3) {
                    handleResultForAmvoidguy(mutation.addedNodes, div);
                }
            });
        }).observe(expDiv, { childList: true, subtree: true });
    }

    function handleResultForAmvoidguy(expNodes, parentDiv) {
        const isZHIn3rdPartyWebsites = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh");

        let perHourGainExp = {
            stamina: 0,
            intelligence: 0,
            attack: 0,
            power: 0,
            defense: 0,
            ranged: 0,
            magic: 0,
        };

        expNodes.forEach((expNode) => {
            if (getOriTextFromElement(expNode.children[0]).includes("Stamina") || getOriTextFromElement(expNode.children[0]).includes("耐力")) {
                perHourGainExp.stamina = Number(expNode.children[1].textContent);
            } else if (
                getOriTextFromElement(expNode.children[0]).includes("Intelligence") ||
                getOriTextFromElement(expNode.children[0]).includes("智力")
            ) {
                perHourGainExp.intelligence = Number(expNode.children[1].textContent);
            } else if (getOriTextFromElement(expNode.children[0]).includes("Attack") || getOriTextFromElement(expNode.children[0]).includes("攻击")) {
                perHourGainExp.attack = Number(expNode.children[1].textContent);
            } else if (getOriTextFromElement(expNode.children[0]).includes("Power") || getOriTextFromElement(expNode.children[0]).includes("力量")) {
                perHourGainExp.power = Number(expNode.children[1].textContent);
            } else if (
                getOriTextFromElement(expNode.children[0]).includes("Defense") ||
                getOriTextFromElement(expNode.children[0]).includes("防御")
            ) {
                perHourGainExp.defense = Number(expNode.children[1].textContent);
            } else if (getOriTextFromElement(expNode.children[0]).includes("Ranged") || getOriTextFromElement(expNode.children[0]).includes("远程")) {
                perHourGainExp.ranged = Number(expNode.children[1].textContent);
            } else if (getOriTextFromElement(expNode.children[0]).includes("Magic") || getOriTextFromElement(expNode.children[0]).includes("魔法")) {
                perHourGainExp.magic = Number(expNode.children[1].textContent);
            }
        });

        let data = GM_getValue("init_character_data", null);
        let obj = JSON.parse(data);
        if (!obj || !obj.characterSkills || !obj.currentTimestamp) {
            console.error("handleResult no character localstorage");
            return;
        }

        let skillLevels = {};
        for (const skill of obj.characterSkills) {
            if (skill.skillHrid.includes("stamina")) {
                skillLevels.stamina = {};
                skillLevels.stamina.skillName = "Stamina";
                skillLevels.stamina.skillZhName = "耐力";
                skillLevels.stamina.currentLevel = skill.level;
                skillLevels.stamina.currentExp = skill.experience;
            } else if (skill.skillHrid.includes("intelligence")) {
                skillLevels.intelligence = {};
                skillLevels.intelligence.skillName = "Intelligence";
                skillLevels.intelligence.skillZhName = "智力";
                skillLevels.intelligence.currentLevel = skill.level;
                skillLevels.intelligence.currentExp = skill.experience;
            } else if (skill.skillHrid.includes("attack")) {
                skillLevels.attack = {};
                skillLevels.attack.skillName = "Attack";
                skillLevels.attack.skillZhName = "攻击";
                skillLevels.attack.currentLevel = skill.level;
                skillLevels.attack.currentExp = skill.experience;
            } else if (skill.skillHrid.includes("power")) {
                skillLevels.power = {};
                skillLevels.power.skillName = "Power";
                skillLevels.power.skillZhName = "力量";
                skillLevels.power.currentLevel = skill.level;
                skillLevels.power.currentExp = skill.experience;
            } else if (skill.skillHrid.includes("defense")) {
                skillLevels.defense = {};
                skillLevels.defense.skillName = "Defense";
                skillLevels.defense.skillZhName = "防御";
                skillLevels.defense.currentLevel = skill.level;
                skillLevels.defense.currentExp = skill.experience;
            } else if (skill.skillHrid.includes("ranged")) {
                skillLevels.ranged = {};
                skillLevels.ranged.skillName = "Ranged";
                skillLevels.ranged.skillZhName = "远程";
                skillLevels.ranged.currentLevel = skill.level;
                skillLevels.ranged.currentExp = skill.experience;
            } else if (skill.skillHrid.includes("magic")) {
                skillLevels.magic = {};
                skillLevels.magic.skillName = "Magic";
                skillLevels.magic.skillZhName = "魔法";
                skillLevels.magic.currentLevel = skill.level;
                skillLevels.magic.currentExp = skill.experience;
            }
        }

        const skillNamesInOrder = ["stamina", "intelligence", "attack", "power", "defense", "ranged", "magic"];
        let hTMLStr = "";
        for (const skill of skillNamesInOrder) {
            hTMLStr += `<div id="${"inputDiv_" + skill}" style="display: flex; justify-content: flex-end">${
                isZHIn3rdPartyWebsites ? skillLevels[skill].skillZhName : skillLevels[skill].skillName
            }${isZHIn3rdPartyWebsites ? "到" : " to level "}<input id="${"input_" + skill}" type="number" value="${
                skillLevels[skill].currentLevel + 1
            }" min="${skillLevels[skill].currentLevel + 1}" max="200">${isZHIn3rdPartyWebsites ? "级" : ""}</div>`;
        }

        hTMLStr += `<div id="script_afterDays" style="display: flex; justify-content: flex-end"><input id="script_afterDays_input" type="number" value="1" min="0" max="200">${
            isZHIn3rdPartyWebsites ? "天后" : "days after"
        }</div>`;

        hTMLStr += `<div id="needDiv"></div>`;
        hTMLStr += `<div id="needListDiv"></div>`;
        parentDiv.innerHTML = hTMLStr;

        for (const skill of skillNamesInOrder) {
            const skillDiv = parentDiv.querySelector(`div#${"inputDiv_" + skill}`);
            const skillInput = parentDiv.querySelector(`input#${"input_" + skill}`);
            skillInput.onchange = () => {
                calculateTill(skill, skillInput, skillLevels, parentDiv, perHourGainExp, isZHIn3rdPartyWebsites);
            };
            skillInput.addEventListener("keyup", function (evt) {
                calculateTill(skill, skillInput, skillLevels, parentDiv, perHourGainExp, isZHIn3rdPartyWebsites);
            });
            skillDiv.onclick = () => {
                calculateTill(skill, skillInput, skillLevels, parentDiv, perHourGainExp, isZHIn3rdPartyWebsites);
            };
        }

        const daysAfterDiv = parentDiv.querySelector(`div#script_afterDays`);
        const daysAfterInput = parentDiv.querySelector(`input#script_afterDays_input`);
        daysAfterInput.onchange = () => {
            calculateAfterDays(daysAfterInput, skillLevels, parentDiv, perHourGainExp, skillNamesInOrder, isZHIn3rdPartyWebsites);
        };
        daysAfterInput.addEventListener("keyup", function (evt) {
            calculateAfterDays(daysAfterInput, skillLevels, parentDiv, perHourGainExp, skillNamesInOrder, isZHIn3rdPartyWebsites);
        });
        daysAfterDiv.onclick = () => {
            calculateAfterDays(daysAfterInput, skillLevels, parentDiv, perHourGainExp, skillNamesInOrder, isZHIn3rdPartyWebsites);
        };

        // 提取成本和收益
        const expensesSpan = document.querySelector(`span#expensesSpan`);
        const revenueSpan = document.querySelector(`span#revenueSpan`);
        const profitSpan = document.querySelector(`span#profitPreview`);
        const expenseDiv = document.querySelector(`div#script_expense`);
        const revenueDiv = document.querySelector(`div#script_revenue`);
        if (expenseDiv && expenseDiv) {
            expenseDiv.textContent = expensesSpan.parentNode.textContent;
            revenueDiv.textContent = revenueSpan.parentNode.textContent;
        } else {
            profitSpan.parentNode.insertAdjacentHTML(
                "beforeend",
                `<div id="script_expense" style="background-color: #DCDCDC; color: black;">${expensesSpan.parentNode.textContent}</div><div id="script_revenue" style="background-color: #DCDCDC; color: black;">${revenueSpan.parentNode.textContent}</div>`
            );
        }
    }

    function calculateAfterDays(daysAfterInput, skillLevels, parentDiv, perHourGainExp, skillNamesInOrder, isZHIn3rdPartyWebsites) {
        const initData_levelExperienceTable = JSON.parse(GM_getValue("init_client_data", null)).levelExperienceTable;
        const days = Number(daysAfterInput.value);
        parentDiv.querySelector(`div#needDiv`).textContent = `${isZHIn3rdPartyWebsites ? "" : "After"} ${days} ${
            isZHIn3rdPartyWebsites ? "天后：" : "days: "
        }`;
        const listDiv = parentDiv.querySelector(`div#needListDiv`);

        let html = "";
        let resultLevels = {};
        for (const skillName of skillNamesInOrder) {
            for (const skill of Object.values(skillLevels)) {
                if (skill.skillName.toLowerCase() === skillName.toLowerCase()) {
                    const exp = skill.currentExp + perHourGainExp[skill.skillName.toLowerCase()] * days * 24;
                    let level = 1;
                    while (initData_levelExperienceTable[level] < exp) {
                        level++;
                    }
                    level--;
                    const minExpAtLevel = initData_levelExperienceTable[level];
                    const maxExpAtLevel = initData_levelExperienceTable[level + 1] - 1;
                    const expSpanInLevel = maxExpAtLevel - minExpAtLevel;
                    const levelPercentage = Number(((exp - minExpAtLevel) / expSpanInLevel) * 100).toFixed(1);
                    resultLevels[skillName.toLowerCase()] = level;
                    html += `<div>${isZHIn3rdPartyWebsites ? skill.skillZhName : skill.skillName} ${isZHIn3rdPartyWebsites ? "" : "level"} ${level} ${
                        isZHIn3rdPartyWebsites ? "级" : ""
                    } ${levelPercentage}%</div>`;
                    break;
                }
            }
        }
        const combatLevel =
            0.2 * (resultLevels.stamina + resultLevels.intelligence + resultLevels.defense) +
            0.4 * Math.max(0.5 * (resultLevels.attack + resultLevels.power), resultLevels.ranged, resultLevels.magic);
        html += `<div>${isZHIn3rdPartyWebsites ? "战斗等级：" : "Combat level: "} ${combatLevel.toFixed(1)}</div>`;
        listDiv.innerHTML = html;
    }

    function calculateTill(skillName, skillInputElem, skillLevels, parentDiv, perHourGainExp, isZHIn3rdPartyWebsites) {
        const initData_levelExperienceTable = JSON.parse(GM_getValue("init_client_data", null)).levelExperienceTable;
        const targetLevel = Number(skillInputElem.value);
        parentDiv.querySelector(`div#needDiv`).textContent = `${
            isZHIn3rdPartyWebsites ? skillLevels[skillName].skillZhName : skillLevels[skillName].skillName
        } ${isZHIn3rdPartyWebsites ? "到" : "to level"} ${targetLevel} ${isZHIn3rdPartyWebsites ? "级 还需：" : " takes: "}`;
        const listDiv = parentDiv.querySelector(`div#needListDiv`);

        const currentLevel = Number(skillLevels[skillName].currentLevel);
        const currentExp = Number(skillLevels[skillName].currentExp);
        if (targetLevel > currentLevel && targetLevel <= 200) {
            if (perHourGainExp[skillName] === 0) {
                listDiv.innerHTML = isZHIn3rdPartyWebsites ? "永远" : "Forever";
            } else {
                let needExp = initData_levelExperienceTable[targetLevel] - currentExp;
                let needHours = needExp / perHourGainExp[skillName];
                let html = "";
                html += `<div>[${hoursToReadableString(needHours)}]</div>`;

                const consumeDivs = document.querySelectorAll(`div#simulationResultConsumablesUsed div.row`);
                for (const elem of consumeDivs) {
                    const conName = elem.children[0].textContent;
                    const conPerHour = Number(elem.children[1].textContent);
                    html += `<div>${conName} ${Number(conPerHour * needHours).toFixed(0)}</div>`;
                }

                listDiv.innerHTML = html;
            }
        } else {
            listDiv.innerHTML = isZHIn3rdPartyWebsites ? "输入错误" : "Input error";
        }
    }

    function addImportButtonForMooneycalc() {
        const checkElem = () => {
            const selectedElement = document.querySelector(`div[role="tablist"]`);
            if (selectedElement) {
                clearInterval(timer);
                const button = document.createElement("button");
                selectedElement.parentNode.insertBefore(button, selectedElement.nextSibling);
                button.textContent = isZH
                    ? "导入人物数据 (刷新游戏网页更新人物数据)"
                    : "Import character settings (Refresh game page to update character settings)";
                button.style.backgroundColor = SCRIPT_COLOR_MAIN;
                button.style.color = "black";
                button.style.padding = "5px";
                button.onclick = function () {
                    console.log("Mooneycalc-Importer: Button onclick");
                    importDataForMooneycalc(button);
                    return false;
                };
            }
        };
        let timer = setInterval(checkElem, 200);
    }

    async function importDataForMooneycalc(button) {
        const characterData = JSON.parse(GM_getValue("init_character_data", ""));
        console.log(characterData);
        if (!characterData || !characterData.characterSkills || !characterData.currentTimestamp) {
            button.textContent = isZH ? "错误：没有人物数据" : "Error: no character settings found";
            return;
        }

        const ls = constructMooneycalcLocalStorage(characterData);
        localStorage.setItem("settings", ls);

        button.textContent = isZH ? "已导入" : "Imported";
        await new Promise((r) => setTimeout(r, 500));
        location.reload();
    }

    function constructMooneycalcLocalStorage(characterData) {
        const ls = localStorage.getItem("settings");
        let lsObj = JSON.parse(ls);

        // 人物技能等级
        lsObj.state.settings.levels = {};
        for (const skill of characterData.characterSkills) {
            lsObj.state.settings.levels[skill.skillHrid] = skill.level;
        }

        // 社区全局buff
        lsObj.state.settings.communityBuffs = {};
        for (const buff of characterData.communityBuffs) {
            lsObj.state.settings.communityBuffs[buff.hrid] = buff.level;
        }

        // 装备 & 装备强化等级
        lsObj.state.settings.equipment = {};
        lsObj.state.settings.equipmentLevels = {};
        for (const item of characterData.characterItems) {
            if (item.itemLocationHrid !== "/item_locations/inventory") {
                lsObj.state.settings.equipment[item.itemLocationHrid.replace("item_locations", "equipment_types")] = item.itemHrid;
                lsObj.state.settings.equipmentLevels[item.itemLocationHrid.replace("item_locations", "equipment_types")] = item.enhancementLevel;
            }
        }

        // 房子
        lsObj.state.settings.houseRooms = {};
        for (const house of Object.values(characterData.characterHouseRoomMap)) {
            lsObj.state.settings.houseRooms[house.houseRoomHrid] = house.level;
        }

        return JSON.stringify(lsObj);
    }

    function hoursToReadableString(hours) {
        const sec = hours * 60 * 60;
        if (sec >= 86400) {
            return Number(sec / 86400).toFixed(1) + (isZH ? " 天" : " days");
        }
        const d = new Date(Math.round(sec * 1000));
        function pad(i) {
            return ("0" + i).slice(-2);
        }
        let str = d.getUTCHours() + "h " + pad(d.getUTCMinutes()) + "m " + pad(d.getUTCSeconds()) + "s";
        return str;
    }

    function addExportButton(obj) {
        const checkElem = () => {
            const selectedElement = document.querySelector(`div.SharableProfile_overviewTab__W4dCV`);
            if (selectedElement) {
                clearInterval(timer);

                const button = document.createElement("button");
                selectedElement.appendChild(button);
                button.textContent = isZH ? "导出人物到剪贴板" : "Export to clipboard";
                button.style.borderRadius = "5px";
                button.style.height = "30px";
                button.style.backgroundColor = SCRIPT_COLOR_MAIN;
                button.style.color = "black";
                button.style.boxShadow = "none";
                button.style.border = "0px";
                button.onclick = function () {
                    let exportString = "";
                    const playerID = obj.profile.characterSkills[0].characterID;
                    const clientObj = JSON.parse(GM_getValue("init_client_data", ""));
                    const characterObj = JSON.parse(GM_getValue("init_character_data", ""));
                    const battleObj = JSON.parse(GM_getValue("new_battle", ""));

                    if (playerID === characterObj.character.id) {
                        exportString = JSON.stringify(constructSelfPlayerExportObjFromInitCharacterData(characterObj, clientObj));
                    } else {
                        const storedProfileList = JSON.parse(GM_getValue("profile_export_list", "[]"));
                        const profileList = storedProfileList.filter((item) => item.characterID === playerID);
                        let profile = null;
                        if (profileList.length !== 1) {
                            console.log("Can not find stored profile for " + playerID);
                            return;
                        }
                        profile = profileList[0];

                        const battlePlayerList = battleObj.players.filter((item) => item.character.id === playerID);
                        let battlePlayer = null;
                        if (battlePlayerList.length === 1) {
                            battlePlayer = battlePlayerList[0];
                        }

                        exportString = JSON.stringify(constructPlayerExportObjFromStoredProfile(profile, clientObj, battlePlayer));
                    }

                    console.log(exportString);
                    navigator.clipboard.writeText(exportString);
                    button.textContent = isZH ? "已复制" : "Copied";
                    return false;
                };
                return false;
            }
        };
        let timer = setInterval(checkElem, 200);
    }
})();
