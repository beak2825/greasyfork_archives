// ==UserScript==
// @name         强化成本计算
// @namespace    http://tampermonkey.net/
// @version      23.14
// @description  Tools for MilkyWayIdle. Shows total action time. Shows market prices. Shows action number quick inputs. Shows how many actions are needed to reach certain skill level. Shows skill exp percentages. Shows total networth. Shows combat summary. Shows combat maps index. Shows item level on item icons. Shows how many ability books are needed to reach certain level. Shows market equipment filters.
// @author       bot7420
// @license      CC-BY-NC-SA-4.0
// @match        https://www.milkywayidle.com/characterSelect
// @match        https://www.milkywayidle.com/
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.2/math.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0/dist/chartjs-plugin-datalabels.min.js
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @downloadURL https://update.greasyfork.org/scripts/544082/%E5%BC%BA%E5%8C%96%E6%88%90%E6%9C%AC%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/544082/%E5%BC%BA%E5%8C%96%E6%88%90%E6%9C%AC%E8%AE%A1%E7%AE%97.meta.js
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

    // 提前定义排序函数，确保全局可用
    window.sortTableByProfit = function(enhancementLevel) {
        // 注意：这里需要通过面板找到minEnhancementLevel变量
        const panel = document.getElementById('decomposition-results-panel');
        if (!panel) return;

        // 从面板数据中获取minEnhancementLevel
        // 这里假设panel上有一个data属性存储了这个值
        const minEnhancementLevel = 4; // 回退值

        const table = panel.querySelector('table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const headerIndex = enhancementLevel - minEnhancementLevel + 2; // +2 是因为前两列是物品名称和分解产物

        // 更新排序图标
        for (let i = 4; i <= 15; i++) {
            const icon = document.getElementById(`sort-icon-${i}`);
            if (icon) {
                icon.textContent = '▼';
            }
        }
        const currentIcon = document.getElementById(`sort-icon-${enhancementLevel}`);
        if (currentIcon) {
            currentIcon.textContent = '▲';
        }

        // 排序行
        rows.sort((a, b) => {
            const aCell = a.cells[headerIndex];
            const bCell = b.cells[headerIndex];
            const aDiffText = aCell.querySelector('div:nth-child(3)')?.textContent || '0';
            const bDiffText = bCell.querySelector('div:nth-child(3)')?.textContent || '0';
            const aDiff = parseFloat(aDiffText.replace(/[^0-9.-]/g, '')) || 0;
            const bDiff = parseFloat(bDiffText.replace(/[^0-9.-]/g, '')) || 0;
            return bDiff - aDiff; // 降序排列
        });

        // 重新添加行
        rows.forEach(row => tbody.appendChild(row));
    };

    // 解压initClientData数据
    function decompressInitClientData(compressedData) {
        try {
            // 使用lz-string库解压UTF16格式数据
            const decompressedJson = LZString.decompressFromUTF16(compressedData);
            if (!decompressedJson) {
                throw new Error("decompressInitClientData: decompressFromUTF16() returned null");
            }
            return JSON.parse(decompressedJson);
        } catch (error) {
            console.error("decompressInitClientData: ", error);
            return null;
        }
    }

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

    const MARKET_API_URL = "https://gitee.com/deric1312/myapi1/raw/master/api.json";
    const API_TOKEN = "18aeb3bc2084c2d9006fac9d17bfefdc";

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
        damageGraphTransparentBackground: {
            id: "damageGraphTransparentBackground",
            desc: isZH ? "伤害统计图表背景透明 [依赖上一项]" : "DPS chart transparent and blur background. [Depends on the previous selection]",
            isTrue: true,
        },
        forceMWIToolsDisplayZH: {
            id: "forceMWIToolsDisplayZH",
            desc: isZH ? "MWITools本身强制显示中文 MWITools always in Chinese" : "MWITools本身强制显示中文 MWITools always in Chinese",
            isTrue: false,
        },
        bulkEnhancementCosts: {
            id: "bulkEnhancementCosts",
            desc: isZH ? "右上角显示：批量强化成本计算按钮" : "Top right: Bulk enhancement costs calculation button",
            isTrue: true,
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
        "/items/pirate_token": "\u6d77\u76d7\u4ee3\u5e01",
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
        "/items/chimerical_refinement_chest": "\u5947\u5e7b\u7cbe\u70bc\u5b9d\u7bb1",
        "/items/sinister_chest": "\u9634\u68ee\u5b9d\u7bb1",
        "/items/sinister_refinement_chest": "\u9634\u68ee\u7cbe\u70bc\u5b9d\u7bb1",
        "/items/enchanted_chest": "\u79d8\u6cd5\u5b9d\u7bb1",
        "/items/enchanted_refinement_chest": "\u79d8\u6cd5\u7cbe\u70bc\u5b9d\u7bb1",
        "/items/pirate_chest": "\u6d77\u76d7\u5b9d\u7bb1",
        "/items/pirate_refinement_chest": "\u6d77\u76d7\u7cbe\u70bc\u5b9d\u7bb1",
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
        "/items/pirate_entry_key": "\u6d77\u76d7\u94a5\u5319",
        "/items/pirate_chest_key": "\u6d77\u76d7\u5b9d\u7bb1\u94a5\u5319",
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
        "/items/melee_coffee": "\u8fd1\u6218\u5496\u5561",
        "/items/ranged_coffee": "\u8fdc\u7a0b\u5496\u5561",
        "/items/magic_coffee": "\u9b54\u6cd5\u5496\u5561",
        "/items/super_stamina_coffee": "\u8d85\u7ea7\u8010\u529b\u5496\u5561",
        "/items/super_intelligence_coffee": "\u8d85\u7ea7\u667a\u529b\u5496\u5561",
        "/items/super_defense_coffee": "\u8d85\u7ea7\u9632\u5fa1\u5496\u5561",
        "/items/super_attack_coffee": "\u8d85\u7ea7\u653b\u51fb\u5496\u5561",
        "/items/super_melee_coffee": "\u8d85\u7ea7\u8fd1\u6218\u5496\u5561",
        "/items/super_ranged_coffee": "\u8d85\u7ea7\u8fdc\u7a0b\u5496\u5561",
        "/items/super_magic_coffee": "\u8d85\u7ea7\u9b54\u6cd5\u5496\u5561",
        "/items/ultra_stamina_coffee": "\u7a76\u6781\u8010\u529b\u5496\u5561",
        "/items/ultra_intelligence_coffee": "\u7a76\u6781\u667a\u529b\u5496\u5561",
        "/items/ultra_defense_coffee": "\u7a76\u6781\u9632\u5fa1\u5496\u5561",
        "/items/ultra_attack_coffee": "\u7a76\u6781\u653b\u51fb\u5496\u5561",
        "/items/ultra_melee_coffee": "\u7a76\u6781\u8fd1\u6218\u5496\u5561",
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
        "/items/fracturing_impact": "\u788e\u88c2\u51b2\u51fb",
        "/items/shield_bash": "\u76fe\u51fb",
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
        "/items/life_drain": "\u751f\u547d\u5438\u53d6",
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
        "/items/retribution": "\u60e9\u6212",
        "/items/vampirism": "\u5438\u8840",
        "/items/revive": "\u590d\u6d3b",
        "/items/insanity": "\u75af\u72c2",
        "/items/invincible": "\u65e0\u654c",
        "/items/speed_aura": "\u901f\u5ea6\u5149\u73af",
        "/items/guardian_aura": "\u5b88\u62a4\u5149\u73af",
        "/items/fierce_aura": "\u7269\u7406\u5149\u73af",
        "/items/critical_aura": "\u66b4\u51fb\u5149\u73af",
        "/items/mystic_aura": "\u5143\u7d20\u5149\u73af",
        "/items/gobo_stabber": "\u54e5\u5e03\u6797\u957f\u5251",
        "/items/gobo_slasher": "\u54e5\u5e03\u6797\u5173\u5200",
        "/items/gobo_smasher": "\u54e5\u5e03\u6797\u72fc\u7259\u68d2",
        "/items/spiked_bulwark": "\u5c16\u523a\u91cd\u76fe",
        "/items/werewolf_slasher": "\u72fc\u4eba\u5173\u5200",
        "/items/griffin_bulwark": "\u72ee\u9e6b\u91cd\u76fe",
        "/items/griffin_bulwark_refined": "\u72ee\u9e6b\u91cd\u76fe\uff08\u7cbe\uff09",
        "/items/gobo_shooter": "\u54e5\u5e03\u6797\u5f39\u5f13",
        "/items/vampiric_bow": "\u5438\u8840\u5f13",
        "/items/cursed_bow": "\u5492\u6028\u4e4b\u5f13",
        "/items/cursed_bow_refined": "\u5492\u6028\u4e4b\u5f13\uff08\u7cbe\uff09",
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
        "/items/furious_spear": "\u72c2\u6012\u957f\u67aa",
        "/items/furious_spear_refined": "\u72c2\u6012\u957f\u67aa\uff08\u7cbe\uff09",
        "/items/regal_sword": "\u541b\u738b\u4e4b\u5251",
        "/items/regal_sword_refined": "\u541b\u738b\u4e4b\u5251\uff08\u7cbe\uff09",
        "/items/chaotic_flail": "\u6df7\u6c8c\u8fde\u67b7",
        "/items/chaotic_flail_refined": "\u6df7\u6c8c\u8fde\u67b7\uff08\u7cbe\uff09",
        "/items/soul_hunter_crossbow": "\u7075\u9b42\u730e\u624b\u5f29",
        "/items/sundering_crossbow": "\u88c2\u7a7a\u4e4b\u5f29",
        "/items/sundering_crossbow_refined": "\u88c2\u7a7a\u4e4b\u5f29\uff08\u7cbe\uff09",
        "/items/frost_staff": "\u51b0\u971c\u6cd5\u6756",
        "/items/infernal_battlestaff": "\u70bc\u72f1\u6cd5\u6756",
        "/items/jackalope_staff": "\u9e7f\u89d2\u5154\u4e4b\u6756",
        "/items/rippling_trident": "\u6d9f\u6f2a\u4e09\u53c9\u621f",
        "/items/rippling_trident_refined": "\u6d9f\u6f2a\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
        "/items/blooming_trident": "\u7efd\u653e\u4e09\u53c9\u621f",
        "/items/blooming_trident_refined": "\u7efd\u653e\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
        "/items/blazing_trident": "\u70bd\u7130\u4e09\u53c9\u621f",
        "/items/blazing_trident_refined": "\u70bd\u7130\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
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
        "/items/wooden_fire_staff": "\u6728\u5236\u706b\u6cd5\u6756",
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
        "/items/knights_aegis_refined": "\u9a91\u58eb\u76fe\uff08\u7cbe\uff09",
        "/items/treant_shield": "\u6811\u4eba\u76fe",
        "/items/manticore_shield": "\u874e\u72ee\u76fe",
        "/items/tome_of_healing": "\u6cbb\u7597\u4e4b\u4e66",
        "/items/tome_of_the_elements": "\u5143\u7d20\u4e4b\u4e66",
        "/items/watchful_relic": "\u8b66\u6212\u9057\u7269",
        "/items/bishops_codex": "\u4e3b\u6559\u6cd5\u5178",
        "/items/bishops_codex_refined": "\u4e3b\u6559\u6cd5\u5178\uff08\u7cbe\uff09",
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
        "/items/sinister_cape_refined": "\u9634\u68ee\u6597\u7bf7\uff08\u7cbe\uff09",
        "/items/chimerical_quiver": "\u5947\u5e7b\u7bad\u888b",
        "/items/chimerical_quiver_refined": "\u5947\u5e7b\u7bad\u888b\uff08\u7cbe\uff09",
        "/items/enchanted_cloak": "\u79d8\u6cd5\u62ab\u98ce",
        "/items/enchanted_cloak_refined": "\u79d8\u6cd5\u62ab\u98ce\uff08\u7cbe\uff09",
        "/items/red_culinary_hat": "\u7ea2\u8272\u53a8\u5e08\u5e3d",
        "/items/snail_shell_helmet": "\u8717\u725b\u58f3\u5934\u76d4",
        "/items/vision_helmet": "\u89c6\u89c9\u5934\u76d4",
        "/items/fluffy_red_hat": "\u84ec\u677e\u7ea2\u5e3d\u5b50",
        "/items/corsair_helmet": "\u63a0\u593a\u8005\u5934\u76d4",
        "/items/corsair_helmet_refined": "\u63a0\u593a\u8005\u5934\u76d4\uff08\u7cbe\uff09",
        "/items/acrobatic_hood": "\u6742\u6280\u5e08\u515c\u5e3d",
        "/items/acrobatic_hood_refined": "\u6742\u6280\u5e08\u515c\u5e3d\uff08\u7cbe\uff09",
        "/items/magicians_hat": "\u9b54\u672f\u5e08\u5e3d",
        "/items/magicians_hat_refined": "\u9b54\u672f\u5e08\u5e3d\uff08\u7cbe\uff09",
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
        "/items/anchorbound_plate_body": "\u951a\u5b9a\u80f8\u7532",
        "/items/anchorbound_plate_body_refined": "\u951a\u5b9a\u80f8\u7532\uff08\u7cbe\uff09",
        "/items/maelstrom_plate_body": "\u6012\u6d9b\u80f8\u7532",
        "/items/maelstrom_plate_body_refined": "\u6012\u6d9b\u80f8\u7532\uff08\u7cbe\uff09",
        "/items/marine_tunic": "\u6d77\u6d0b\u76ae\u8863",
        "/items/revenant_tunic": "\u4ea1\u7075\u76ae\u8863",
        "/items/griffin_tunic": "\u72ee\u9e6b\u76ae\u8863",
        "/items/kraken_tunic": "\u514b\u62c9\u80af\u76ae\u8863",
        "/items/kraken_tunic_refined": "\u514b\u62c9\u80af\u76ae\u8863\uff08\u7cbe\uff09",
        "/items/icy_robe_top": "\u51b0\u971c\u888d\u670d",
        "/items/flaming_robe_top": "\u70c8\u7130\u888d\u670d",
        "/items/luna_robe_top": "\u6708\u795e\u888d\u670d",
        "/items/royal_water_robe_top": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d",
        "/items/royal_water_robe_top_refined": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
        "/items/royal_nature_robe_top": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d",
        "/items/royal_nature_robe_top_refined": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
        "/items/royal_fire_robe_top": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d",
        "/items/royal_fire_robe_top_refined": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
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
        "/items/cotton_robe_top": "\u68c9\u888d\u670d",
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
        "/items/anchorbound_plate_legs": "\u951a\u5b9a\u817f\u7532",
        "/items/anchorbound_plate_legs_refined": "\u951a\u5b9a\u817f\u7532\uff08\u7cbe\uff09",
        "/items/maelstrom_plate_legs": "\u6012\u6d9b\u817f\u7532",
        "/items/maelstrom_plate_legs_refined": "\u6012\u6d9b\u817f\u7532\uff08\u7cbe\uff09",
        "/items/marine_chaps": "\u822a\u6d77\u76ae\u88e4",
        "/items/revenant_chaps": "\u4ea1\u7075\u76ae\u88e4",
        "/items/griffin_chaps": "\u72ee\u9e6b\u76ae\u88e4",
        "/items/kraken_chaps": "\u514b\u62c9\u80af\u76ae\u88e4",
        "/items/kraken_chaps_refined": "\u514b\u62c9\u80af\u76ae\u88e4\uff08\u7cbe\uff09",
        "/items/icy_robe_bottoms": "\u51b0\u971c\u888d\u88d9",
        "/items/flaming_robe_bottoms": "\u70c8\u7130\u888d\u88d9",
        "/items/luna_robe_bottoms": "\u6708\u795e\u888d\u88d9",
        "/items/royal_water_robe_bottoms": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9",
        "/items/royal_water_robe_bottoms_refined": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
        "/items/royal_nature_robe_bottoms": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9",
        "/items/royal_nature_robe_bottoms_refined": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
        "/items/royal_fire_robe_bottoms": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9",
        "/items/royal_fire_robe_bottoms_refined": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
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
        "/items/dodocamel_gauntlets_refined": "\u6e21\u6e21\u9a7c\u62a4\u624b\uff08\u7cbe\uff09",
        "/items/sighted_bracers": "\u7784\u51c6\u62a4\u8155",
        "/items/marksman_bracers": "\u795e\u5c04\u62a4\u8155",
        "/items/marksman_bracers_refined": "\u795e\u5c04\u62a4\u8155\uff08\u7cbe\uff09",
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
        "/items/trainee_milking_charm": "\u5b9e\u4e60\u6324\u5976\u62a4\u7b26",
        "/items/basic_milking_charm": "\u57fa\u7840\u6324\u5976\u62a4\u7b26",
        "/items/advanced_milking_charm": "\u9ad8\u7ea7\u6324\u5976\u62a4\u7b26",
        "/items/expert_milking_charm": "\u4e13\u5bb6\u6324\u5976\u62a4\u7b26",
        "/items/master_milking_charm": "\u5927\u5e08\u6324\u5976\u62a4\u7b26",
        "/items/grandmaster_milking_charm": "\u5b97\u5e08\u6324\u5976\u62a4\u7b26",
        "/items/trainee_foraging_charm": "\u5b9e\u4e60\u91c7\u6458\u62a4\u7b26",
        "/items/basic_foraging_charm": "\u57fa\u7840\u91c7\u6458\u62a4\u7b26",
        "/items/advanced_foraging_charm": "\u9ad8\u7ea7\u91c7\u6458\u62a4\u7b26",
        "/items/expert_foraging_charm": "\u4e13\u5bb6\u91c7\u6458\u62a4\u7b26",
        "/items/master_foraging_charm": "\u5927\u5e08\u91c7\u6458\u62a4\u7b26",
        "/items/grandmaster_foraging_charm": "\u5b97\u5e08\u91c7\u6458\u62a4\u7b26",
        "/items/trainee_woodcutting_charm": "\u5b9e\u4e60\u4f10\u6728\u62a4\u7b26",
        "/items/basic_woodcutting_charm": "\u57fa\u7840\u4f10\u6728\u62a4\u7b26",
        "/items/advanced_woodcutting_charm": "\u9ad8\u7ea7\u4f10\u6728\u62a4\u7b26",
        "/items/expert_woodcutting_charm": "\u4e13\u5bb6\u4f10\u6728\u62a4\u7b26",
        "/items/master_woodcutting_charm": "\u5927\u5e08\u4f10\u6728\u62a4\u7b26",
        "/items/grandmaster_woodcutting_charm": "\u5b97\u5e08\u4f10\u6728\u62a4\u7b26",
        "/items/trainee_cheesesmithing_charm": "\u5b9e\u4e60\u5976\u916a\u953b\u9020\u62a4\u7b26",
        "/items/basic_cheesesmithing_charm": "\u57fa\u7840\u5976\u916a\u953b\u9020\u62a4\u7b26",
        "/items/advanced_cheesesmithing_charm": "\u9ad8\u7ea7\u5976\u916a\u953b\u9020\u62a4\u7b26",
        "/items/expert_cheesesmithing_charm": "\u4e13\u5bb6\u5976\u916a\u953b\u9020\u62a4\u7b26",
        "/items/master_cheesesmithing_charm": "\u5927\u5e08\u5976\u916a\u953b\u9020\u62a4\u7b26",
        "/items/grandmaster_cheesesmithing_charm": "\u5b97\u5e08\u5976\u916a\u953b\u9020\u62a4\u7b26",
        "/items/trainee_crafting_charm": "\u5b9e\u4e60\u5236\u4f5c\u62a4\u7b26",
        "/items/basic_crafting_charm": "\u57fa\u7840\u5236\u4f5c\u62a4\u7b26",
        "/items/advanced_crafting_charm": "\u9ad8\u7ea7\u5236\u4f5c\u62a4\u7b26",
        "/items/expert_crafting_charm": "\u4e13\u5bb6\u5236\u4f5c\u62a4\u7b26",
        "/items/master_crafting_charm": "\u5927\u5e08\u5236\u4f5c\u62a4\u7b26",
        "/items/grandmaster_crafting_charm": "\u5b97\u5e08\u5236\u4f5c\u62a4\u7b26",
        "/items/trainee_tailoring_charm": "\u5b9e\u4e60\u7f1d\u7eab\u62a4\u7b26",
        "/items/basic_tailoring_charm": "\u57fa\u7840\u7f1d\u7eab\u62a4\u7b26",
        "/items/advanced_tailoring_charm": "\u9ad8\u7ea7\u7f1d\u7eab\u62a4\u7b26",
        "/items/expert_tailoring_charm": "\u4e13\u5bb6\u7f1d\u7eab\u62a4\u7b26",
        "/items/master_tailoring_charm": "\u5927\u5e08\u7f1d\u7eab\u62a4\u7b26",
        "/items/grandmaster_tailoring_charm": "\u5b97\u5e08\u7f1d\u7eab\u62a4\u7b26",
        "/items/trainee_cooking_charm": "\u5b9e\u4e60\u70f9\u996a\u62a4\u7b26",
        "/items/basic_cooking_charm": "\u57fa\u7840\u70f9\u996a\u62a4\u7b26",
        "/items/advanced_cooking_charm": "\u9ad8\u7ea7\u70f9\u996a\u62a4\u7b26",
        "/items/expert_cooking_charm": "\u4e13\u5bb6\u70f9\u996a\u62a4\u7b26",
        "/items/master_cooking_charm": "\u5927\u5e08\u70f9\u996a\u62a4\u7b26",
        "/items/grandmaster_cooking_charm": "\u5b97\u5e08\u70f9\u996a\u62a4\u7b26",
        "/items/trainee_brewing_charm": "\u5b9e\u4e60\u51b2\u6ce1\u62a4\u7b26",
        "/items/basic_brewing_charm": "\u57fa\u7840\u51b2\u6ce1\u62a4\u7b26",
        "/items/advanced_brewing_charm": "\u9ad8\u7ea7\u51b2\u6ce1\u62a4\u7b26",
        "/items/expert_brewing_charm": "\u4e13\u5bb6\u51b2\u6ce1\u62a4\u7b26",
        "/items/master_brewing_charm": "\u5927\u5e08\u51b2\u6ce1\u62a4\u7b26",
        "/items/grandmaster_brewing_charm": "\u5b97\u5e08\u51b2\u6ce1\u62a4\u7b26",
        "/items/trainee_alchemy_charm": "\u5b9e\u4e60\u70bc\u91d1\u62a4\u7b26",
        "/items/basic_alchemy_charm": "\u57fa\u7840\u70bc\u91d1\u62a4\u7b26",
        "/items/advanced_alchemy_charm": "\u9ad8\u7ea7\u70bc\u91d1\u62a4\u7b26",
        "/items/expert_alchemy_charm": "\u4e13\u5bb6\u70bc\u91d1\u62a4\u7b26",
        "/items/master_alchemy_charm": "\u5927\u5e08\u70bc\u91d1\u62a4\u7b26",
        "/items/grandmaster_alchemy_charm": "\u5b97\u5e08\u70bc\u91d1\u62a4\u7b26",
        "/items/trainee_enhancing_charm": "\u5b9e\u4e60\u5f3a\u5316\u62a4\u7b26",
        "/items/basic_enhancing_charm": "\u57fa\u7840\u5f3a\u5316\u62a4\u7b26",
        "/items/advanced_enhancing_charm": "\u9ad8\u7ea7\u5f3a\u5316\u62a4\u7b26",
        "/items/expert_enhancing_charm": "\u4e13\u5bb6\u5f3a\u5316\u62a4\u7b26",
        "/items/master_enhancing_charm": "\u5927\u5e08\u5f3a\u5316\u62a4\u7b26",
        "/items/grandmaster_enhancing_charm": "\u5b97\u5e08\u5f3a\u5316\u62a4\u7b26",
        "/items/trainee_stamina_charm": "\u5b9e\u4e60\u8010\u529b\u62a4\u7b26",
        "/items/basic_stamina_charm": "\u57fa\u7840\u8010\u529b\u62a4\u7b26",
        "/items/advanced_stamina_charm": "\u9ad8\u7ea7\u8010\u529b\u62a4\u7b26",
        "/items/expert_stamina_charm": "\u4e13\u5bb6\u8010\u529b\u62a4\u7b26",
        "/items/master_stamina_charm": "\u5927\u5e08\u8010\u529b\u62a4\u7b26",
        "/items/grandmaster_stamina_charm": "\u5b97\u5e08\u8010\u529b\u62a4\u7b26",
        "/items/trainee_intelligence_charm": "\u5b9e\u4e60\u667a\u529b\u62a4\u7b26",
        "/items/basic_intelligence_charm": "\u57fa\u7840\u667a\u529b\u62a4\u7b26",
        "/items/advanced_intelligence_charm": "\u9ad8\u7ea7\u667a\u529b\u62a4\u7b26",
        "/items/expert_intelligence_charm": "\u4e13\u5bb6\u667a\u529b\u62a4\u7b26",
        "/items/master_intelligence_charm": "\u5927\u5e08\u667a\u529b\u62a4\u7b26",
        "/items/grandmaster_intelligence_charm": "\u5b97\u5e08\u667a\u529b\u62a4\u7b26",
        "/items/trainee_attack_charm": "\u5b9e\u4e60\u653b\u51fb\u62a4\u7b26",
        "/items/basic_attack_charm": "\u57fa\u7840\u653b\u51fb\u62a4\u7b26",
        "/items/advanced_attack_charm": "\u9ad8\u7ea7\u653b\u51fb\u62a4\u7b26",
        "/items/expert_attack_charm": "\u4e13\u5bb6\u653b\u51fb\u62a4\u7b26",
        "/items/master_attack_charm": "\u5927\u5e08\u653b\u51fb\u62a4\u7b26",
        "/items/grandmaster_attack_charm": "\u5b97\u5e08\u653b\u51fb\u62a4\u7b26",
        "/items/trainee_defense_charm": "\u5b9e\u4e60\u9632\u5fa1\u62a4\u7b26",
        "/items/basic_defense_charm": "\u57fa\u7840\u9632\u5fa1\u62a4\u7b26",
        "/items/advanced_defense_charm": "\u9ad8\u7ea7\u9632\u5fa1\u62a4\u7b26",
        "/items/expert_defense_charm": "\u4e13\u5bb6\u9632\u5fa1\u62a4\u7b26",
        "/items/master_defense_charm": "\u5927\u5e08\u9632\u5fa1\u62a4\u7b26",
        "/items/grandmaster_defense_charm": "\u5b97\u5e08\u9632\u5fa1\u62a4\u7b26",
        "/items/trainee_melee_charm": "\u5b9e\u4e60\u8fd1\u6218\u62a4\u7b26",
        "/items/basic_melee_charm": "\u57fa\u7840\u8fd1\u6218\u62a4\u7b26",
        "/items/advanced_melee_charm": "\u9ad8\u7ea7\u8fd1\u6218\u62a4\u7b26",
        "/items/expert_melee_charm": "\u4e13\u5bb6\u8fd1\u6218\u62a4\u7b26",
        "/items/master_melee_charm": "\u5927\u5e08\u8fd1\u6218\u62a4\u7b26",
        "/items/grandmaster_melee_charm": "\u5b97\u5e08\u8fd1\u6218\u62a4\u7b26",
        "/items/trainee_ranged_charm": "\u5b9e\u4e60\u8fdc\u7a0b\u62a4\u7b26",
        "/items/basic_ranged_charm": "\u57fa\u7840\u8fdc\u7a0b\u62a4\u7b26",
        "/items/advanced_ranged_charm": "\u9ad8\u7ea7\u8fdc\u7a0b\u62a4\u7b26",
        "/items/expert_ranged_charm": "\u4e13\u5bb6\u8fdc\u7a0b\u62a4\u7b26",
        "/items/master_ranged_charm": "\u5927\u5e08\u8fdc\u7a0b\u62a4\u7b26",
        "/items/grandmaster_ranged_charm": "\u5b97\u5e08\u8fdc\u7a0b\u62a4\u7b26",
        "/items/trainee_magic_charm": "\u5b9e\u4e60\u9b54\u6cd5\u62a4\u7b26",
        "/items/basic_magic_charm": "\u57fa\u7840\u9b54\u6cd5\u62a4\u7b26",
        "/items/advanced_magic_charm": "\u9ad8\u7ea7\u9b54\u6cd5\u62a4\u7b26",
        "/items/expert_magic_charm": "\u4e13\u5bb6\u9b54\u6cd5\u62a4\u7b26",
        "/items/master_magic_charm": "\u5927\u5e08\u9b54\u6cd5\u62a4\u7b26",
        "/items/grandmaster_magic_charm": "\u5b97\u5e08\u9b54\u6cd5\u62a4\u7b26",
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
        "/items/mooberry": "\u54de\u8393",
        "/items/marsberry": "\u706b\u661f\u8393",
        "/items/spaceberry": "\u592a\u7a7a\u8393",
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
        "/items/chimerical_refinement_shard": "\u5947\u5e7b\u7cbe\u70bc\u788e\u7247",
        "/items/acrobats_ribbon": "\u6742\u6280\u5e08\u5f69\u5e26",
        "/items/magicians_cloth": "\u9b54\u672f\u5e08\u7ec7\u7269",
        "/items/chaotic_chain": "\u6df7\u6c8c\u9501\u94fe",
        "/items/cursed_ball": "\u8bc5\u5492\u4e4b\u7403",
        "/items/sinister_refinement_shard": "\u9634\u68ee\u7cbe\u70bc\u788e\u7247",
        "/items/royal_cloth": "\u7687\u5bb6\u7ec7\u7269",
        "/items/knights_ingot": "\u9a91\u58eb\u4e4b\u952d",
        "/items/bishops_scroll": "\u4e3b\u6559\u5377\u8f74",
        "/items/regal_jewel": "\u541b\u738b\u5b9d\u77f3",
        "/items/sundering_jewel": "\u88c2\u7a7a\u5b9d\u77f3",
        "/items/enchanted_refinement_shard": "\u79d8\u6cd5\u7cbe\u70bc\u788e\u7247",
        "/items/marksman_brooch": "\u795e\u5c04\u80f8\u9488",
        "/items/corsair_crest": "\u63a0\u593a\u8005\u5fbd\u7ae0",
        "/items/damaged_anchor": "\u7834\u635f\u8239\u951a",
        "/items/maelstrom_plating": "\u6012\u6d9b\u7532\u7247",
        "/items/kraken_leather": "\u514b\u62c9\u80af\u76ae\u9769",
        "/items/kraken_fang": "\u514b\u62c9\u80af\u4e4b\u7259",
        "/items/pirate_refinement_shard": "\u6d77\u76d7\u7cbe\u70bc\u788e\u7247",
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
        "/items/pirate_essence": "\u6d77\u76d7\u7cbe\u534e",
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
        "/actions/foraging/mooberry": "\u54de\u8393",
        "/actions/foraging/peach": "\u6843\u5b50",
        "/actions/foraging/excelsa_coffee_bean": "\u7279\u7ea7\u5496\u5561\u8c46",
        "/actions/foraging/cocoon": "\u8695\u8327",
        "/actions/foraging/silly_cow_valley": "\u50bb\u725b\u5c71\u8c37",
        "/actions/foraging/marsberry": "\u706b\u661f\u8393",
        "/actions/foraging/dragon_fruit": "\u706b\u9f99\u679c",
        "/actions/foraging/fieriosa_coffee_bean": "\u706b\u5c71\u5496\u5561\u8c46",
        "/actions/foraging/olympus_mons": "\u5965\u6797\u5339\u65af\u5c71",
        "/actions/foraging/spaceberry": "\u592a\u7a7a\u8393",
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
        "/actions/cheesesmithing/corsair_helmet": "\u63a0\u593a\u8005\u5934\u76d4",
        "/actions/cheesesmithing/knights_aegis": "\u9a91\u58eb\u76fe",
        "/actions/cheesesmithing/anchorbound_plate_legs": "\u951a\u5b9a\u817f\u7532",
        "/actions/cheesesmithing/maelstrom_plate_legs": "\u6012\u6d9b\u817f\u7532",
        "/actions/cheesesmithing/griffin_bulwark": "\u72ee\u9e6b\u91cd\u76fe",
        "/actions/cheesesmithing/furious_spear": "\u72c2\u6012\u957f\u67aa",
        "/actions/cheesesmithing/chaotic_flail": "\u6df7\u6c8c\u8fde\u67b7",
        "/actions/cheesesmithing/regal_sword": "\u541b\u738b\u4e4b\u5251",
        "/actions/cheesesmithing/anchorbound_plate_body": "\u951a\u5b9a\u80f8\u7532",
        "/actions/cheesesmithing/maelstrom_plate_body": "\u6012\u6d9b\u80f8\u7532",
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
        "/actions/crafting/pirate_entry_key": "\u6d77\u76d7\u94a5\u5319",
        "/actions/crafting/pirate_chest_key": "\u6d77\u76d7\u5b9d\u7bb1\u94a5\u5319",
        "/actions/crafting/arcane_fire_staff": "\u795e\u79d8\u706b\u6cd5\u6756",
        "/actions/crafting/vampiric_bow": "\u5438\u8840\u5f13",
        "/actions/crafting/soul_hunter_crossbow": "\u7075\u9b42\u730e\u624b\u5f29",
        "/actions/crafting/rippling_trident": "\u6d9f\u6f2a\u4e09\u53c9\u621f",
        "/actions/crafting/blooming_trident": "\u7efd\u653e\u4e09\u53c9\u621f",
        "/actions/crafting/blazing_trident": "\u70bd\u7130\u4e09\u53c9\u621f",
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
        "/actions/tailoring/marksman_bracers": "\u795e\u5c04\u62a4\u8155",
        "/actions/tailoring/acrobatic_hood": "\u6742\u6280\u5e08\u515c\u5e3d",
        "/actions/tailoring/magicians_hat": "\u9b54\u672f\u5e08\u4e4b\u5e3d",
        "/actions/tailoring/kraken_chaps": "\u514b\u62c9\u80af\u76ae\u88e4",
        "/actions/tailoring/royal_water_robe_bottoms": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9",
        "/actions/tailoring/royal_nature_robe_bottoms": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9",
        "/actions/tailoring/royal_fire_robe_bottoms": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9",
        "/actions/tailoring/kraken_tunic": "\u514b\u62c9\u80af\u76ae\u8863",
        "/actions/tailoring/royal_water_robe_top": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d",
        "/actions/tailoring/royal_nature_robe_top": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d",
        "/actions/tailoring/royal_fire_robe_top": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d",
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
        "/actions/alchemy/coinify": "\u70b9\u91d1",
        "/actions/alchemy/transmute": "\u8f6c\u5316",
        "/actions/alchemy/decompose": "\u5206\u89e3",
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
        "/actions/combat/pirate_cove": "\u6d77\u76d7\u57fa\u5730",
    };

    const ZHOthersDic = {
        // monsterNames
        "/monsters/abyssal_imp": "\u6df1\u6e0a\u5c0f\u9b3c",
        "/monsters/acrobat": "\u6742\u6280\u5e08",
        "/monsters/anchor_shark": "\u6301\u951a\u9ca8",
        "/monsters/aquahorse": "\u6c34\u9a6c",
        "/monsters/black_bear": "\u9ed1\u718a",
        "/monsters/gobo_boomy": "\u8f70\u8f70",
        "/monsters/brine_marksman": "\u6d77\u76d0\u5c04\u624b",
        "/monsters/captain_fishhook": "\u9c7c\u94a9\u8239\u957f",
        "/monsters/butterjerry": "\u8776\u9f20",
        "/monsters/centaur_archer": "\u534a\u4eba\u9a6c\u5f13\u7bad\u624b",
        "/monsters/chronofrost_sorcerer": "\u971c\u65f6\u5deb\u5e08",
        "/monsters/crystal_colossus": "\u6c34\u6676\u5de8\u50cf",
        "/monsters/demonic_overlord": "\u6076\u9b54\u9738\u4e3b",
        "/monsters/deranged_jester": "\u5c0f\u4e11\u7687",
        "/monsters/dodocamel": "\u6e21\u6e21\u9a7c",
        "/monsters/dusk_revenant": "\u9ec4\u660f\u4ea1\u7075",
        "/monsters/elementalist": "\u5143\u7d20\u6cd5\u5e08",
        "/monsters/enchanted_bishop": "\u79d8\u6cd5\u4e3b\u6559",
        "/monsters/enchanted_king": "\u79d8\u6cd5\u56fd\u738b",
        "/monsters/enchanted_knight": "\u79d8\u6cd5\u9a91\u58eb",
        "/monsters/enchanted_pawn": "\u79d8\u6cd5\u58eb\u5175",
        "/monsters/enchanted_queen": "\u79d8\u6cd5\u738b\u540e",
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
        "/monsters/squawker": "\u9e66\u9e49",
        "/monsters/gobo_stabby": "\u523a\u523a",
        "/monsters/stalactite_golem": "\u949f\u4e73\u77f3\u9b54\u50cf",
        "/monsters/swampy": "\u6cbc\u6cfd\u866b",
        "/monsters/the_kraken": "\u514b\u62c9\u80af",
        "/monsters/the_watcher": "\u89c2\u5bdf\u8005",
        "/monsters/snake": "\u86c7",
        "/monsters/tidal_conjuror": "\u6f6e\u6c50\u53ec\u5524\u5e08",
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
        "/abilities/fracturing_impact": "\u788e\u88c2\u51b2\u51fb",
        "/abilities/shield_bash": "\u76fe\u51fb",
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
        "/abilities/life_drain": "\u751f\u547d\u5438\u53d6",
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

    const itemEnNameToHridMap = {};

    const MARKET_JSON_LOCAL_BACKUP = `{"marketData":{"/items/abyssal_essence":{"0":{"a":310,"b":300}},"/items/acrobatic_hood":{"0":{"a":80000000,"b":74000000},"1":{"a":-1,"b":5200000},"2":{"a":-1,"b":4400000},"3":{"a":-1,"b":12000000},"5":{"a":82000000,"b":74000000},"6":{"a":88000000,"b":6000000},"7":{"a":94000000,"b":92000000},"8":{"a":130000000,"b":115000000},"9":{"a":-1,"b":140000000},"10":{"a":300000000,"b":290000000},"11":{"a":-1,"b":330000000},"12":{"a":-1,"b":920000000},"13":{"a":-1,"b":78000000}},"/items/acrobats_ribbon":{"0":{"a":7600000,"b":7400000}},"/items/alchemists_bottoms":{"0":{"a":-1,"b":56000000},"5":{"a":185000000,"b":170000000},"6":{"a":3500000000,"b":-1},"7":{"a":205000000,"b":190000000},"8":{"a":235000000,"b":-1},"10":{"a":460000000,"b":250000000}},"/items/alchemists_top":{"0":{"a":-1,"b":92000000},"5":{"a":-1,"b":145000000},"6":{"a":-1,"b":5000000},"7":{"a":185000000,"b":-1},"8":{"a":235000000,"b":-1},"10":{"a":420000000,"b":250000000}},"/items/alchemy_essence":{"0":{"a":270,"b":265}},"/items/alchemy_tea":{"0":{"a":620,"b":600}},"/items/amber":{"0":{"a":22000,"b":21500}},"/items/amethyst":{"0":{"a":35000,"b":34000}},"/items/anchorbound_plate_body":{"0":{"a":98000000,"b":90000000},"1":{"a":-1,"b":74000000},"2":{"a":-1,"b":74000000},"3":{"a":-1,"b":74000000},"4":{"a":-1,"b":74000000},"5":{"a":105000000,"b":98000000},"6":{"a":-1,"b":78000000},"7":{"a":130000000,"b":120000000},"8":{"a":-1,"b":155000000},"9":{"a":-1,"b":120000000},"10":{"a":480000000,"b":340000000},"12":{"a":-1,"b":800000000}},"/items/anchorbound_plate_legs":{"0":{"a":78000000,"b":72000000},"1":{"a":-1,"b":66000000},"2":{"a":-1,"b":66000000},"3":{"a":-1,"b":66000000},"4":{"a":-1,"b":66000000},"5":{"a":82000000,"b":72000000},"6":{"a":100000000,"b":70000000},"7":{"a":110000000,"b":76000000},"8":{"a":-1,"b":135000000},"9":{"a":-1,"b":105000000},"10":{"a":370000000,"b":280000000},"12":{"a":-1,"b":700000000}},"/items/apple":{"0":{"a":12,"b":11}},"/items/apple_gummy":{"0":{"a":11,"b":10}},"/items/apple_yogurt":{"0":{"a":400,"b":350}},"/items/aqua_arrow":{"0":{"a":27500,"b":27000}},"/items/aqua_aura":{"0":{"a":1250000,"b":1200000}},"/items/aqua_essence":{"0":{"a":27,"b":23}},"/items/arabica_coffee_bean":{"0":{"a":160,"b":150}},"/items/arcane_bow":{"0":{"a":680000,"b":620000},"5":{"a":980000,"b":-1},"6":{"a":3000000,"b":-1}},"/items/arcane_crossbow":{"0":{"a":540000,"b":520000},"1":{"a":-1,"b":350000},"2":{"a":560000,"b":105000},"3":{"a":580000,"b":105000},"4":{"a":620000,"b":110000},"5":{"a":680000,"b":400000},"6":{"a":2800000,"b":-1},"7":{"a":9600000,"b":-1},"8":{"a":25000000,"b":-1}},"/items/arcane_fire_staff":{"0":{"a":560000,"b":540000},"1":{"a":580000,"b":105000},"2":{"a":640000,"b":105000},"3":{"a":660000,"b":105000},"4":{"a":840000,"b":-1},"5":{"a":940000,"b":600000},"7":{"a":15000000,"b":-1},"8":{"a":25000000,"b":-1},"10":{"a":58000000,"b":1050000}},"/items/arcane_log":{"0":{"a":300,"b":295}},"/items/arcane_lumber":{"0":{"a":1800,"b":1750}},"/items/arcane_nature_staff":{"0":{"a":520000,"b":500000},"1":{"a":600000,"b":100000},"2":{"a":640000,"b":100000},"3":{"a":780000,"b":105000},"5":{"a":1250000,"b":900000},"7":{"a":8400000,"b":-1}},"/items/arcane_reflection":{"0":{"a":40000,"b":39000}},"/items/arcane_shield":{"0":{"a":330000,"b":320000},"1":{"a":350000,"b":100000},"2":{"a":-1,"b":100000},"3":{"a":680000,"b":100000},"4":{"a":680000,"b":100000},"5":{"a":620000,"b":330000},"6":{"a":2450000,"b":-1},"8":{"a":7000000,"b":-1}},"/items/arcane_water_staff":{"0":{"a":540000,"b":500000},"2":{"a":620000,"b":105000},"3":{"a":580000,"b":105000},"4":{"a":660000,"b":-1},"5":{"a":860000,"b":310000},"8":{"a":10000000,"b":-1},"10":{"a":-1,"b":4000000}},"/items/artisan_tea":{"0":{"a":1700,"b":1650}},"/items/attack_coffee":{"0":{"a":600,"b":580}},"/items/azure_alembic":{"0":{"a":30000,"b":29000},"1":{"a":320000,"b":-1},"2":{"a":440000,"b":-1},"3":{"a":390000,"b":-1},"5":{"a":400000,"b":-1}},"/items/azure_boots":{"0":{"a":22000,"b":19500},"4":{"a":125000,"b":-1}},"/items/azure_brush":{"0":{"a":26000,"b":20500},"1":{"a":34000,"b":-1},"2":{"a":68000,"b":-1},"4":{"a":3000000,"b":-1},"5":{"a":100000,"b":40000},"6":{"a":125000,"b":-1}},"/items/azure_buckler":{"0":{"a":28000,"b":23000},"2":{"a":880000,"b":-1},"3":{"a":200000,"b":-1},"4":{"a":240000,"b":-1},"5":{"a":295000,"b":-1},"6":{"a":440000,"b":-1}},"/items/azure_bulwark":{"0":{"a":26500,"b":21500},"2":{"a":31000,"b":-1},"5":{"a":7000000,"b":-1}},"/items/azure_cheese":{"0":{"a":660,"b":640}},"/items/azure_chisel":{"0":{"a":27500,"b":22500},"1":{"a":10000000,"b":-1},"3":{"a":2000000,"b":-1},"4":{"a":235000,"b":-1},"5":{"a":-1,"b":2050},"6":{"a":600000,"b":2050}},"/items/azure_enhancer":{"0":{"a":28500,"b":24500},"1":{"a":2200000,"b":-1},"3":{"a":62000,"b":-1},"4":{"a":660000,"b":-1},"5":{"a":310000,"b":-1},"6":{"a":350000,"b":-1},"8":{"a":400000,"b":-1},"9":{"a":1300000,"b":-1},"10":{"a":2500000,"b":-1}},"/items/azure_gauntlets":{"0":{"a":22500,"b":13000},"1":{"a":5000000,"b":-1},"5":{"a":200000,"b":-1},"8":{"a":700000,"b":-1},"10":{"a":1200000,"b":-1}},"/items/azure_hammer":{"0":{"a":26500,"b":24000},"1":{"a":10000000,"b":-1}},"/items/azure_hatchet":{"0":{"a":27000,"b":22500},"1":{"a":10000000,"b":-1},"5":{"a":700000,"b":-1},"6":{"a":1400000,"b":-1}},"/items/azure_helmet":{"0":{"a":27000,"b":22500},"1":{"a":13500000,"b":-1},"2":{"a":100000,"b":-1},"3":{"a":135000,"b":-1},"5":{"a":200000,"b":-1}},"/items/azure_mace":{"0":{"a":40000,"b":33000},"1":{"a":5000000,"b":-1},"5":{"a":9800000,"b":-1}},"/items/azure_milk":{"0":{"a":115,"b":105}},"/items/azure_needle":{"0":{"a":29000,"b":21500},"1":{"a":10000000,"b":2100},"3":{"a":-1,"b":2050}},"/items/azure_plate_body":{"0":{"a":37000,"b":30000},"1":{"a":40000,"b":-1},"2":{"a":64000,"b":-1}},"/items/azure_plate_legs":{"0":{"a":33000,"b":32000},"1":{"a":98000,"b":-1},"2":{"a":-1,"b":2050},"3":{"a":120000,"b":2050},"5":{"a":220000,"b":2050}},"/items/azure_pot":{"0":{"a":32000,"b":29500},"2":{"a":86000,"b":-1}},"/items/azure_shears":{"0":{"a":38000,"b":25500},"1":{"a":78000,"b":-1},"4":{"a":175000000,"b":-1}},"/items/azure_spatula":{"0":{"a":29500,"b":26000},"3":{"a":175000,"b":-1}},"/items/azure_spear":{"0":{"a":37000,"b":34000},"1":{"a":76000,"b":-1},"3":{"a":130000,"b":-1}},"/items/azure_sword":{"0":{"a":43000,"b":37000},"1":{"a":10000000,"b":-1},"2":{"a":4800000,"b":-1},"3":{"a":320000,"b":-1}},"/items/bag_of_10_cowbells":{"0":{"a":310000,"b":300000}},"/items/bamboo_boots":{"0":{"a":10500,"b":9800},"1":{"a":20000,"b":-1},"3":{"a":100000,"b":-1},"4":{"a":125000,"b":-1},"5":{"a":130000,"b":-1},"7":{"a":450000,"b":-1}},"/items/bamboo_branch":{"0":{"a":17,"b":16}},"/items/bamboo_fabric":{"0":{"a":165,"b":160}},"/items/bamboo_gloves":{"0":{"a":12000,"b":9800},"1":{"a":340000,"b":-1},"2":{"a":145000,"b":-1},"3":{"a":140000,"b":-1},"5":{"a":125000,"b":-1},"6":{"a":130000,"b":-1},"7":{"a":280000,"b":-1}},"/items/bamboo_hat":{"0":{"a":19000,"b":14500},"1":{"a":20000,"b":-1},"2":{"a":45000,"b":-1},"3":{"a":74000,"b":-1},"4":{"a":105000,"b":-1},"5":{"a":135000,"b":-1}},"/items/bamboo_robe_bottoms":{"0":{"a":26500,"b":23500},"1":{"a":32000,"b":-1},"2":{"a":100000,"b":-1},"3":{"a":120000,"b":-1},"4":{"a":160000,"b":-1},"5":{"a":185000,"b":-1},"6":{"a":660000,"b":-1}},"/items/bamboo_robe_top":{"0":{"a":35000,"b":27000},"1":{"a":41000,"b":-1},"2":{"a":42000,"b":-1},"3":{"a":72000,"b":-1},"4":{"a":110000,"b":-1},"5":{"a":130000,"b":-1},"6":{"a":190000,"b":-1},"7":{"a":240000,"b":-1}},"/items/bear_essence":{"0":{"a":120,"b":115}},"/items/beast_boots":{"0":{"a":42000,"b":40000},"1":{"a":43000,"b":-1},"2":{"a":74000,"b":-1},"3":{"a":88000,"b":-1},"4":{"a":150000,"b":-1},"5":{"a":175000,"b":-1}},"/items/beast_bracers":{"0":{"a":66000,"b":62000},"1":{"a":100000,"b":-1},"2":{"a":105000,"b":-1},"3":{"a":100000,"b":-1},"4":{"a":185000,"b":-1},"5":{"a":195000,"b":-1}},"/items/beast_chaps":{"0":{"a":125000,"b":90000},"1":{"a":140000,"b":-1},"2":{"a":150000,"b":-1},"3":{"a":160000,"b":-1},"4":{"a":195000,"b":-1},"5":{"a":265000,"b":200000},"6":{"a":1050000,"b":-1},"8":{"a":5000000,"b":-1}},"/items/beast_hide":{"0":{"a":21,"b":20}},"/items/beast_hood":{"0":{"a":88000,"b":82000},"2":{"a":96000,"b":-1},"3":{"a":98000,"b":-1},"5":{"a":185000,"b":-1},"7":{"a":-1,"b":275000}},"/items/beast_leather":{"0":{"a":900,"b":880}},"/items/beast_tunic":{"0":{"a":115000,"b":110000},"1":{"a":120000,"b":-1},"2":{"a":140000,"b":-1},"3":{"a":140000,"b":-1},"4":{"a":185000,"b":-1},"5":{"a":290000,"b":105000}},"/items/berserk":{"0":{"a":160000,"b":155000}},"/items/birch_bow":{"0":{"a":21500,"b":18000},"1":{"a":10000000,"b":-1},"2":{"a":10000000,"b":-1},"8":{"a":1200000,"b":-1}},"/items/birch_crossbow":{"0":{"a":17000,"b":14500},"1":{"a":10000000,"b":-1},"2":{"a":1000000,"b":-1},"3":{"a":640000,"b":-1},"5":{"a":230000,"b":-1}},"/items/birch_fire_staff":{"0":{"a":17500,"b":13500},"1":{"a":40000,"b":-1},"2":{"a":10000000,"b":720},"3":{"a":62000,"b":-1},"5":{"a":170000,"b":-1},"10":{"a":-1,"b":860000}},"/items/birch_log":{"0":{"a":60,"b":54}},"/items/birch_lumber":{"0":{"a":420,"b":410}},"/items/birch_nature_staff":{"0":{"a":16000,"b":15000},"1":{"a":9800000,"b":-1}},"/items/birch_shield":{"0":{"a":10000,"b":4500},"1":{"a":15000000,"b":-1}},"/items/birch_water_staff":{"0":{"a":17500,"b":15000},"1":{"a":255000,"b":-1},"2":{"a":700000,"b":-1},"4":{"a":500000,"b":-1},"5":{"a":150000,"b":-1}},"/items/bishops_codex":{"0":{"a":86000000,"b":82000000},"1":{"a":-1,"b":78000000},"2":{"a":-1,"b":78000000},"3":{"a":-1,"b":76000000},"4":{"a":-1,"b":78000000},"5":{"a":90000000,"b":86000000},"6":{"a":96000000,"b":86000000},"7":{"a":110000000,"b":105000000},"8":{"a":-1,"b":140000000},"9":{"a":-1,"b":180000000},"10":{"a":360000000,"b":340000000},"11":{"a":-1,"b":400000000},"12":{"a":1350000000,"b":700000000},"14":{"a":5200000000,"b":-1}},"/items/bishops_scroll":{"0":{"a":8200000,"b":8000000}},"/items/black_bear_fluff":{"0":{"a":80000,"b":78000}},"/items/black_bear_shoes":{"0":{"a":440000,"b":380000},"1":{"a":450000,"b":-1},"2":{"a":490000,"b":-1},"3":{"a":560000,"b":-1},"5":{"a":740000,"b":540000},"6":{"a":1100000,"b":-1},"7":{"a":2000000,"b":1000000},"8":{"a":4000000,"b":-1},"9":{"a":7800000,"b":760000},"10":{"a":11500000,"b":8600000},"11":{"a":29000000,"b":14000000},"12":{"a":46000000,"b":-1},"14":{"a":170000000,"b":-1}},"/items/black_tea_leaf":{"0":{"a":18,"b":17}},"/items/blackberry":{"0":{"a":62,"b":56}},"/items/blackberry_cake":{"0":{"a":540,"b":500}},"/items/blackberry_donut":{"0":{"a":460,"b":400}},"/items/blazing_trident":{"0":{"a":295000000,"b":275000000},"1":{"a":-1,"b":110000000},"5":{"a":300000000,"b":290000000},"6":{"a":-1,"b":300000000},"7":{"a":340000000,"b":330000000},"8":{"a":400000000,"b":260000000},"9":{"a":-1,"b":400000000},"10":{"a":680000000,"b":660000000},"12":{"a":1950000000,"b":1700000000},"14":{"a":6800000000,"b":-1},"15":{"a":13000000000,"b":-1},"19":{"a":-1,"b":5000000}},"/items/blessed_tea":{"0":{"a":1700,"b":1650}},"/items/blooming_trident":{"0":{"a":-1,"b":330000000},"1":{"a":-1,"b":13000000},"3":{"a":-1,"b":17000000},"4":{"a":-1,"b":40000000},"5":{"a":350000000,"b":330000000},"6":{"a":-1,"b":310000000},"7":{"a":390000000,"b":380000000},"8":{"a":440000000,"b":430000000},"10":{"a":740000000,"b":700000000},"12":{"a":2000000000,"b":1350000000},"14":{"a":-1,"b":70000000},"20":{"a":-1,"b":10000000}},"/items/blue_key_fragment":{"0":{"a":660000,"b":640000}},"/items/blueberry":{"0":{"a":40,"b":36}},"/items/blueberry_cake":{"0":{"a":410,"b":390}},"/items/blueberry_donut":{"0":{"a":430,"b":400}},"/items/branch_of_insight":{"0":{"a":14500000,"b":14000000}},"/items/brewers_bottoms":{"0":{"a":245000000,"b":80000000},"5":{"a":175000000,"b":150000000},"6":{"a":180000000,"b":17500000},"7":{"a":195000000,"b":180000000},"8":{"a":235000000,"b":-1},"10":{"a":390000000,"b":-1}},"/items/brewers_top":{"0":{"a":-1,"b":50000000},"5":{"a":-1,"b":145000000},"6":{"a":160000000,"b":-1},"7":{"a":175000000,"b":160000000},"8":{"a":205000000,"b":50000000},"9":{"a":295000000,"b":-1},"10":{"a":370000000,"b":300000000}},"/items/brewing_essence":{"0":{"a":210,"b":205}},"/items/brewing_tea":{"0":{"a":490,"b":480}},"/items/brown_key_fragment":{"0":{"a":1050000,"b":1000000}},"/items/burble_alembic":{"0":{"a":66000,"b":58000},"1":{"a":9800000,"b":-1},"2":{"a":580000,"b":-1},"3":{"a":520000,"b":-1}},"/items/burble_boots":{"0":{"a":43000,"b":30000},"2":{"a":100000,"b":-1},"3":{"a":250000,"b":-1},"6":{"a":400000,"b":-1},"7":{"a":640000,"b":-1},"8":{"a":600000,"b":-1},"10":{"a":2000000,"b":-1}},"/items/burble_brush":{"0":{"a":64000,"b":56000},"1":{"a":100000,"b":-1},"2":{"a":160000,"b":-1},"3":{"a":280000,"b":-1},"4":{"a":430000,"b":-1},"5":{"a":2200000,"b":-1},"8":{"a":7000000,"b":-1}},"/items/burble_buckler":{"0":{"a":66000,"b":49000},"1":{"a":64000,"b":-1},"2":{"a":80000,"b":-1},"3":{"a":110000,"b":-1},"5":{"a":400000,"b":-1},"6":{"a":280000,"b":-1}},"/items/burble_bulwark":{"0":{"a":54000,"b":47000},"1":{"a":10000000,"b":-1},"3":{"a":155000,"b":-1}},"/items/burble_cheese":{"0":{"a":820,"b":800}},"/items/burble_chisel":{"0":{"a":62000,"b":47000},"1":{"a":115000,"b":-1},"3":{"a":10000000,"b":-1},"5":{"a":200000,"b":-1}},"/items/burble_enhancer":{"0":{"a":68000,"b":58000},"2":{"a":70000,"b":-1},"3":{"a":76000,"b":-1},"4":{"a":84000,"b":-1},"5":{"a":150000,"b":-1}},"/items/burble_gauntlets":{"0":{"a":47000,"b":28000},"1":{"a":60000,"b":-1},"2":{"a":680000,"b":-1},"3":{"a":310000,"b":-1},"5":{"a":145000,"b":-1},"6":{"a":390000,"b":-1}},"/items/burble_hammer":{"0":{"a":64000,"b":56000},"2":{"a":135000,"b":-1},"3":{"a":270000,"b":-1},"4":{"a":320000,"b":-1},"5":{"a":400000,"b":-1},"7":{"a":1000000,"b":-1}},"/items/burble_hatchet":{"0":{"a":62000,"b":56000},"1":{"a":120000,"b":-1},"2":{"a":140000,"b":-1},"3":{"a":74000000,"b":-1},"5":{"a":500000,"b":-1}},"/items/burble_helmet":{"0":{"a":54000,"b":48000},"2":{"a":54000,"b":-1},"3":{"a":110000,"b":-1},"4":{"a":200000,"b":-1},"5":{"a":520000,"b":-1},"6":{"a":600000,"b":-1},"7":{"a":500000,"b":-1},"10":{"a":1450000,"b":1000000}},"/items/burble_mace":{"0":{"a":72000,"b":68000},"1":{"a":105000,"b":-1},"5":{"a":430000,"b":58000},"7":{"a":12500000,"b":-1}},"/items/burble_milk":{"0":{"a":170,"b":165}},"/items/burble_needle":{"0":{"a":66000,"b":58000},"1":{"a":100000,"b":-1},"3":{"a":400000,"b":-1}},"/items/burble_plate_body":{"0":{"a":80000,"b":76000},"1":{"a":820000,"b":-1},"2":{"a":340000,"b":-1},"3":{"a":300000,"b":-1},"5":{"a":740000,"b":86000}},"/items/burble_plate_legs":{"0":{"a":70000,"b":60000},"1":{"a":78000,"b":-1},"2":{"a":110000,"b":-1},"3":{"a":290000,"b":-1},"6":{"a":940000,"b":-1}},"/items/burble_pot":{"0":{"a":68000,"b":58000},"1":{"a":100000,"b":-1},"2":{"a":130000,"b":-1},"5":{"a":520000,"b":100000}},"/items/burble_shears":{"0":{"a":66000,"b":56000},"1":{"a":150000,"b":-1},"2":{"a":245000,"b":-1},"3":{"a":340000,"b":90000},"5":{"a":450000,"b":-1}},"/items/burble_spatula":{"0":{"a":70000,"b":54000},"1":{"a":2500000,"b":-1},"5":{"a":150000,"b":-1},"6":{"a":-1,"b":260000}},"/items/burble_spear":{"0":{"a":80000,"b":70000},"4":{"a":440000,"b":-1},"5":{"a":190000,"b":-1},"9":{"a":7000000,"b":-1}},"/items/burble_sword":{"0":{"a":88000,"b":78000},"1":{"a":86000,"b":-1},"3":{"a":120000,"b":-1},"5":{"a":215000,"b":100000},"6":{"a":400000,"b":-1},"8":{"a":410000,"b":-1}},"/items/burble_tea_leaf":{"0":{"a":26,"b":24}},"/items/burning_key_fragment":{"0":{"a":1850000,"b":1800000}},"/items/butter_of_proficiency":{"0":{"a":11000000,"b":10500000}},"/items/catalyst_of_coinification":{"0":{"a":2950,"b":2900}},"/items/catalyst_of_decomposition":{"0":{"a":3300,"b":3200}},"/items/catalyst_of_transmutation":{"0":{"a":7200,"b":7000}},"/items/catalytic_tea":{"0":{"a":1700,"b":1650}},"/items/cedar_bow":{"0":{"a":52000,"b":50000},"1":{"a":105000,"b":-1},"2":{"a":190000,"b":-1},"4":{"a":400000,"b":-1},"8":{"a":2300000,"b":-1}},"/items/cedar_crossbow":{"0":{"a":39000,"b":36000},"2":{"a":10000000,"b":-1},"4":{"a":160000,"b":-1},"5":{"a":350000,"b":-1}},"/items/cedar_fire_staff":{"0":{"a":42000,"b":39000},"1":{"a":3000000,"b":-1},"4":{"a":280000,"b":-1},"5":{"a":125000,"b":-1},"8":{"a":1000000,"b":-1}},"/items/cedar_log":{"0":{"a":84,"b":82}},"/items/cedar_lumber":{"0":{"a":640,"b":620}},"/items/cedar_nature_staff":{"0":{"a":41000,"b":36000},"2":{"a":60000,"b":-1},"5":{"a":125000,"b":31000}},"/items/cedar_shield":{"0":{"a":26500,"b":13500},"2":{"a":190000,"b":-1},"3":{"a":82000,"b":-1},"4":{"a":9800000,"b":-1}},"/items/cedar_water_staff":{"0":{"a":41000,"b":38000},"1":{"a":100000000,"b":-1},"3":{"a":240000,"b":-1},"4":{"a":240000,"b":-1},"5":{"a":300000,"b":-1},"8":{"a":6800000,"b":-1}},"/items/celestial_alembic":{"0":{"a":-1,"b":150000000},"5":{"a":-1,"b":150000000},"6":{"a":300000000,"b":98000000},"7":{"a":330000000,"b":310000000},"10":{"a":680000000,"b":300000000}},"/items/celestial_brush":{"0":{"a":400000000,"b":150000000},"2":{"a":-1,"b":100000000},"3":{"a":-1,"b":110000000},"5":{"a":275000000,"b":260000000},"6":{"a":290000000,"b":-1},"7":{"a":310000000,"b":-1},"10":{"a":620000000,"b":-1},"11":{"a":-1,"b":78000000},"20":{"a":-1,"b":7000000}},"/items/celestial_chisel":{"0":{"a":-1,"b":150000000},"2":{"a":-1,"b":14500000},"5":{"a":-1,"b":250000000},"6":{"a":-1,"b":32000000},"7":{"a":320000000,"b":275000000},"10":{"a":680000000,"b":580000000}},"/items/celestial_enhancer":{"5":{"a":-1,"b":200000000},"8":{"a":480000000,"b":6800000},"9":{"a":620000000,"b":125000000},"10":{"a":880000000,"b":780000000},"12":{"a":-1,"b":1900000000}},"/items/celestial_hammer":{"1":{"a":-1,"b":29500000},"2":{"a":-1,"b":29500000},"3":{"a":-1,"b":29500000},"4":{"a":-1,"b":29500000},"5":{"a":285000000,"b":220000000},"6":{"a":-1,"b":23000000},"7":{"a":320000000,"b":300000000},"10":{"a":-1,"b":580000000}},"/items/celestial_hatchet":{"0":{"a":-1,"b":150000000},"5":{"a":285000000,"b":74000000},"7":{"a":310000000,"b":90000000},"10":{"a":-1,"b":500000000}},"/items/celestial_needle":{"0":{"a":-1,"b":150000000},"1":{"a":-1,"b":6200000},"5":{"a":270000000,"b":220000000},"6":{"a":-1,"b":5000000},"7":{"a":310000000,"b":-1},"10":{"a":640000000,"b":500000000}},"/items/celestial_pot":{"0":{"a":-1,"b":150000000},"5":{"a":-1,"b":250000000},"6":{"a":290000000,"b":280000000},"7":{"a":310000000,"b":-1},"10":{"a":660000000,"b":400000000},"12":{"a":-1,"b":1500000000},"20":{"a":-1,"b":5000000}},"/items/celestial_shears":{"0":{"a":-1,"b":150000000},"3":{"a":-1,"b":120000000},"4":{"a":-1,"b":105000000},"5":{"a":285000000,"b":190000000},"6":{"a":290000000,"b":160000000},"7":{"a":300000000,"b":-1},"10":{"a":640000000,"b":600000000},"20":{"a":-1,"b":10500000}},"/items/celestial_spatula":{"0":{"a":-1,"b":150000000},"5":{"a":285000000,"b":240000000},"6":{"a":-1,"b":10000000},"7":{"a":310000000,"b":-1},"10":{"a":-1,"b":600000000},"20":{"a":-1,"b":6000000}},"/items/centaur_boots":{"0":{"a":1700000,"b":900000},"1":{"a":3800000,"b":125000},"2":{"a":1600000,"b":98000},"3":{"a":-1,"b":80000},"4":{"a":2700000,"b":-1},"5":{"a":1250000,"b":1050000},"6":{"a":1700000,"b":1250000},"7":{"a":2400000,"b":2150000},"8":{"a":4600000,"b":3100000},"9":{"a":11000000,"b":5200000},"10":{"a":13500000,"b":12500000},"11":{"a":-1,"b":20000000},"12":{"a":50000000,"b":45000000},"13":{"a":110000000,"b":80000000},"14":{"a":360000000,"b":100000000}},"/items/centaur_hoof":{"0":{"a":175000,"b":170000}},"/items/channeling_coffee":{"0":{"a":1900,"b":1850}},"/items/chaotic_chain":{"0":{"a":11500000,"b":11000000}},"/items/chaotic_flail":{"0":{"a":245000000,"b":220000000},"3":{"a":-1,"b":54000000},"4":{"a":-1,"b":58000000},"5":{"a":255000000,"b":220000000},"6":{"a":-1,"b":42000000},"7":{"a":280000000,"b":250000000},"8":{"a":-1,"b":300000000},"10":{"a":580000000,"b":540000000},"12":{"a":1600000000,"b":1250000000}},"/items/cheese":{"0":{"a":290,"b":285}},"/items/cheese_alembic":{"0":{"a":4900,"b":4100},"1":{"a":290000,"b":-1},"2":{"a":220000,"b":-1},"5":{"a":400000,"b":-1},"6":{"a":4800000,"b":-1},"20":{"a":-1,"b":115}},"/items/cheese_boots":{"0":{"a":2450,"b":2350},"1":{"a":10000000000,"b":-1},"4":{"a":-1,"b":8000},"5":{"a":680000,"b":-1},"6":{"a":1750000,"b":8200},"8":{"a":500000,"b":-1},"10":{"a":-1,"b":800000},"11":{"a":-1,"b":1600000},"12":{"a":3600000,"b":3000000},"13":{"a":7400000,"b":6000000},"14":{"a":14000000,"b":10500000},"15":{"a":-1,"b":17500000}},"/items/cheese_brush":{"0":{"a":3400,"b":2900},"1":{"a":3500,"b":-1},"2":{"a":9800,"b":-1},"3":{"a":12000,"b":-1},"4":{"a":135000,"b":-1},"5":{"a":100000,"b":-1},"7":{"a":1000000,"b":-1},"8":{"a":1500000,"b":-1},"10":{"a":1900000,"b":280000},"20":{"a":-1,"b":115}},"/items/cheese_buckler":{"0":{"a":3500,"b":2550},"4":{"a":30000,"b":-1},"5":{"a":43000,"b":-1},"7":{"a":5200000,"b":-1},"10":{"a":12000000,"b":-1}},"/items/cheese_bulwark":{"0":{"a":6400,"b":3500},"1":{"a":8000,"b":-1},"2":{"a":10000000,"b":-1},"3":{"a":15000,"b":-1},"5":{"a":2400000,"b":-1},"6":{"a":600000,"b":-1}},"/items/cheese_chisel":{"0":{"a":4300,"b":3600},"1":{"a":10000000,"b":-1},"2":{"a":8200000,"b":-1}},"/items/cheese_enhancer":{"0":{"a":4800,"b":3600},"2":{"a":10000000,"b":-1},"4":{"a":98000,"b":-1},"5":{"a":-1,"b":35000},"8":{"a":500000,"b":-1},"10":{"a":1000000,"b":-1},"11":{"a":4000000,"b":-1}},"/items/cheese_gauntlets":{"0":{"a":2400,"b":2350},"1":{"a":225000,"b":-1},"2":{"a":9600000,"b":-1},"3":{"a":9600000,"b":-1},"4":{"a":500000,"b":-1},"6":{"a":4000000,"b":8600},"9":{"a":470000,"b":-1},"10":{"a":980000,"b":-1},"12":{"a":3600000,"b":2700000},"13":{"a":-1,"b":4900000},"14":{"a":-1,"b":10500000},"15":{"a":-1,"b":15000000}},"/items/cheese_hammer":{"0":{"a":3700,"b":3100},"1":{"a":12500000,"b":-1},"2":{"a":3500000,"b":-1}},"/items/cheese_hatchet":{"0":{"a":4100,"b":3400},"1":{"a":10000000,"b":-1}},"/items/cheese_helmet":{"0":{"a":2950,"b":2450},"4":{"a":9800000,"b":80}},"/items/cheese_mace":{"0":{"a":4300,"b":4000},"1":{"a":10000000,"b":1350},"5":{"a":1900000,"b":-1},"8":{"a":8800000,"b":-1}},"/items/cheese_needle":{"0":{"a":4300,"b":3500},"1":{"a":4200000,"b":-1},"2":{"a":10000000,"b":-1},"3":{"a":10000000,"b":-1},"10":{"a":28000000,"b":-1}},"/items/cheese_plate_body":{"0":{"a":5600,"b":5400},"1":{"a":11000,"b":360},"2":{"a":10500,"b":250},"4":{"a":250000,"b":-1},"5":{"a":245000,"b":-1}},"/items/cheese_plate_legs":{"0":{"a":4300,"b":4200},"2":{"a":92000000,"b":-1},"3":{"a":125000,"b":-1},"4":{"a":115000,"b":-1},"5":{"a":145000,"b":-1},"8":{"a":300000,"b":-1}},"/items/cheese_pot":{"0":{"a":4900,"b":3800},"1":{"a":10000000,"b":-1},"5":{"a":400000,"b":-1},"8":{"a":960000,"b":-1}},"/items/cheese_shears":{"0":{"a":3500,"b":2800},"1":{"a":8000000,"b":-1},"6":{"a":8800000,"b":-1},"7":{"a":14000000,"b":-1},"15":{"a":-1,"b":115},"20":{"a":-1,"b":3300}},"/items/cheese_spatula":{"0":{"a":4300,"b":4000}},"/items/cheese_spear":{"0":{"a":4300,"b":3900},"1":{"a":430000,"b":-1},"2":{"a":980000,"b":-1},"5":{"a":4400000,"b":-1},"6":{"a":17500000,"b":-1}},"/items/cheese_sword":{"0":{"a":5200,"b":4900},"1":{"a":76000,"b":2250},"2":{"a":880000000,"b":460},"3":{"a":14000000,"b":450},"4":{"a":-1,"b":1050},"5":{"a":4900000,"b":-1},"6":{"a":-1,"b":4300},"8":{"a":-1,"b":295},"10":{"a":-1,"b":240000}},"/items/cheesemakers_bottoms":{"0":{"a":-1,"b":84000000},"5":{"a":185000000,"b":155000000},"6":{"a":190000000,"b":-1},"7":{"a":205000000,"b":-1},"8":{"a":245000000,"b":-1},"10":{"a":420000000,"b":310000000}},"/items/cheesemakers_top":{"0":{"a":250000000,"b":80000000},"5":{"a":160000000,"b":130000000},"6":{"a":-1,"b":130000000},"7":{"a":180000000,"b":170000000},"8":{"a":225000000,"b":-1},"10":{"a":420000000,"b":320000000}},"/items/cheesesmithing_essence":{"0":{"a":245,"b":240}},"/items/cheesesmithing_tea":{"0":{"a":560,"b":540}},"/items/chefs_bottoms":{"1":{"a":-1,"b":29500000},"5":{"a":170000000,"b":160000000},"6":{"a":180000000,"b":100000000},"7":{"a":195000000,"b":56000000},"8":{"a":235000000,"b":205000000},"10":{"a":480000000,"b":-1},"20":{"a":-1,"b":3500000}},"/items/chefs_top":{"0":{"a":250000000,"b":40000000},"5":{"a":155000000,"b":125000000},"6":{"a":160000000,"b":145000000},"7":{"a":165000000,"b":155000000},"8":{"a":215000000,"b":170000000},"10":{"a":460000000,"b":300000000}},"/items/chimerical_chest_key":{"0":{"a":2900000,"b":2850000}},"/items/chimerical_entry_key":{"0":{"a":295000,"b":290000}},"/items/chimerical_essence":{"0":{"a":600,"b":580}},"/items/chrono_gloves":{"0":{"a":9800000,"b":9600000},"1":{"a":10000000,"b":-1},"3":{"a":10000000,"b":2850000},"4":{"a":-1,"b":6000000},"5":{"a":11000000,"b":10000000},"6":{"a":12500000,"b":10500000},"7":{"a":16500000,"b":15000000},"8":{"a":40000000,"b":22000000},"9":{"a":-1,"b":31000000},"10":{"a":66000000,"b":62000000},"11":{"a":115000000,"b":-1},"12":{"a":235000000,"b":220000000},"14":{"a":-1,"b":940000000},"15":{"a":1900000000,"b":-1}},"/items/chrono_sphere":{"0":{"a":1050000,"b":1000000}},"/items/cleave":{"0":{"a":28500,"b":27000}},"/items/cocoon":{"0":{"a":225,"b":210}},"/items/collectors_boots":{"0":{"a":3800000,"b":3600000},"1":{"a":4100000,"b":410000},"2":{"a":4100000,"b":215000},"3":{"a":4500000,"b":390000},"5":{"a":4600000,"b":4100000},"6":{"a":6000000,"b":-1},"7":{"a":8400000,"b":7200000},"8":{"a":15000000,"b":9000000},"9":{"a":28000000,"b":13000000},"10":{"a":37000000,"b":35000000},"11":{"a":-1,"b":50000000},"12":{"a":145000000,"b":66000000},"13":{"a":-1,"b":125000000},"15":{"a":-1,"b":175000000},"18":{"a":-1,"b":350000000}},"/items/colossus_core":{"0":{"a":1100000,"b":1050000}},"/items/colossus_plate_body":{"0":{"a":-1,"b":7400000},"1":{"a":-1,"b":1750000},"2":{"a":-1,"b":1750000},"3":{"a":10500000,"b":1950000},"4":{"a":1050000000,"b":2150000},"5":{"a":11000000,"b":10000000},"6":{"a":15500000,"b":11500000},"7":{"a":19000000,"b":-1},"8":{"a":32000000,"b":17000000},"9":{"a":-1,"b":400000},"10":{"a":64000000,"b":40000000},"12":{"a":205000000,"b":-1}},"/items/colossus_plate_legs":{"0":{"a":8400000,"b":-1},"1":{"a":-1,"b":2050000},"2":{"a":-1,"b":2050000},"3":{"a":-1,"b":2000000},"4":{"a":-1,"b":1900000},"5":{"a":10000000,"b":9000000},"6":{"a":12000000,"b":-1},"7":{"a":18000000,"b":330000},"8":{"a":28000000,"b":330000},"9":{"a":-1,"b":320000},"10":{"a":50000000,"b":36000000}},"/items/cooking_essence":{"0":{"a":215,"b":210}},"/items/cooking_tea":{"0":{"a":490,"b":480}},"/items/corsair_crest":{"0":{"a":8800000,"b":8600000}},"/items/corsair_helmet":{"0":{"a":94000000,"b":88000000},"1":{"a":-1,"b":80000000},"2":{"a":-1,"b":80000000},"3":{"a":-1,"b":80000000},"4":{"a":-1,"b":88000000},"5":{"a":110000000,"b":86000000},"6":{"a":-1,"b":88000000},"7":{"a":120000000,"b":110000000},"8":{"a":155000000,"b":130000000},"9":{"a":-1,"b":160000000},"10":{"a":370000000,"b":340000000},"11":{"a":-1,"b":450000000},"12":{"a":1300000000,"b":1000000000}},"/items/cotton":{"0":{"a":45,"b":40}},"/items/cotton_boots":{"0":{"a":2500,"b":2450},"1":{"a":15000,"b":-1},"2":{"a":150000,"b":-1},"4":{"a":240000,"b":7600},"5":{"a":490000,"b":-1},"6":{"a":12500000,"b":-1},"10":{"a":4500000,"b":-1},"12":{"a":-1,"b":2400000},"13":{"a":7000000,"b":4800000},"14":{"a":16000000,"b":10000000},"15":{"a":26500000,"b":-1}},"/items/cotton_fabric":{"0":{"a":290,"b":285}},"/items/cotton_gloves":{"0":{"a":2450,"b":2400},"1":{"a":86000,"b":-1},"2":{"a":86000,"b":-1},"3":{"a":86000,"b":-1},"4":{"a":88000,"b":-1},"5":{"a":460000,"b":-1},"10":{"a":1100000,"b":340000},"12":{"a":-1,"b":2400000},"13":{"a":-1,"b":4900000}},"/items/cotton_hat":{"0":{"a":2550,"b":2350},"1":{"a":100000,"b":185},"2":{"a":-1,"b":420},"4":{"a":430000,"b":-1},"5":{"a":640000,"b":-1},"6":{"a":700000,"b":-1},"8":{"a":2350000,"b":-1}},"/items/cotton_robe_bottoms":{"0":{"a":4100,"b":2650}},"/items/cotton_robe_top":{"0":{"a":4100,"b":3100},"2":{"a":16000000,"b":-1},"3":{"a":9800000,"b":-1},"5":{"a":500000,"b":-1}},"/items/crab_pincer":{"0":{"a":8800,"b":8200}},"/items/crafters_bottoms":{"0":{"a":-1,"b":60000000},"5":{"a":185000000,"b":130000000},"6":{"a":195000000,"b":-1},"7":{"a":205000000,"b":-1},"8":{"a":245000000,"b":-1},"10":{"a":-1,"b":350000000}},"/items/crafters_top":{"0":{"a":-1,"b":16500000},"5":{"a":165000000,"b":145000000},"6":{"a":170000000,"b":4000000},"7":{"a":180000000,"b":170000000},"8":{"a":225000000,"b":-1},"10":{"a":-1,"b":350000000}},"/items/crafting_essence":{"0":{"a":255,"b":250}},"/items/crafting_tea":{"0":{"a":640,"b":600}},"/items/crimson_alembic":{"0":{"a":115000,"b":100000},"1":{"a":145000,"b":-1},"2":{"a":185000,"b":-1},"3":{"a":200000,"b":-1},"5":{"a":500000,"b":200000}},"/items/crimson_boots":{"0":{"a":52000,"b":44000},"1":{"a":98000,"b":-1},"2":{"a":160000,"b":-1},"5":{"a":840000,"b":-1},"6":{"a":4000000,"b":-1}},"/items/crimson_brush":{"0":{"a":88000,"b":84000},"2":{"a":135000,"b":-1},"3":{"a":175000,"b":-1},"4":{"a":255000,"b":-1},"5":{"a":450000,"b":150000},"6":{"a":1300000,"b":-1}},"/items/crimson_buckler":{"0":{"a":110000,"b":92000},"1":{"a":115000,"b":-1},"4":{"a":145000,"b":-1},"5":{"a":330000,"b":-1},"7":{"a":10000000,"b":-1},"9":{"a":7000000,"b":-1}},"/items/crimson_bulwark":{"0":{"a":105000,"b":96000},"1":{"a":115000,"b":-1},"2":{"a":135000,"b":-1},"3":{"a":160000,"b":-1},"4":{"a":320000,"b":-1},"5":{"a":4900000,"b":-1},"6":{"a":1900000,"b":-1}},"/items/crimson_cheese":{"0":{"a":980,"b":960}},"/items/crimson_chisel":{"0":{"a":98000,"b":96000},"1":{"a":130000,"b":-1},"3":{"a":380000,"b":-1},"5":{"a":520000,"b":160000}},"/items/crimson_enhancer":{"0":{"a":110000,"b":105000},"1":{"a":125000,"b":-1},"3":{"a":160000,"b":-1},"4":{"a":350000,"b":-1},"5":{"a":410000,"b":62000},"6":{"a":1100000,"b":-1},"7":{"a":1450000,"b":13500},"10":{"a":5600000,"b":-1}},"/items/crimson_gauntlets":{"0":{"a":66000,"b":56000},"1":{"a":170000,"b":-1},"3":{"a":150000,"b":-1},"4":{"a":290000,"b":-1},"10":{"a":8000000,"b":-1}},"/items/crimson_hammer":{"0":{"a":100000,"b":96000},"1":{"a":150000,"b":-1},"5":{"a":540000,"b":110000}},"/items/crimson_hatchet":{"0":{"a":96000,"b":84000},"1":{"a":115000,"b":-1},"3":{"a":120000,"b":-1},"4":{"a":340000,"b":-1},"5":{"a":420000,"b":120000}},"/items/crimson_helmet":{"0":{"a":105000,"b":90000},"1":{"a":100000,"b":-1},"2":{"a":150000,"b":-1},"3":{"a":215000,"b":-1},"5":{"a":430000,"b":110000},"6":{"a":1250000,"b":-1}},"/items/crimson_mace":{"0":{"a":175000,"b":110000},"1":{"a":130000,"b":-1},"2":{"a":2250000,"b":-1},"5":{"a":640000,"b":52000}},"/items/crimson_milk":{"0":{"a":200,"b":190}},"/items/crimson_needle":{"0":{"a":125000,"b":105000},"3":{"a":380000,"b":-1},"4":{"a":420000,"b":-1},"5":{"a":640000,"b":380000}},"/items/crimson_plate_body":{"0":{"a":150000,"b":105000},"1":{"a":150000,"b":-1},"2":{"a":100000,"b":-1},"4":{"a":390000,"b":-1},"5":{"a":-1,"b":105000}},"/items/crimson_plate_legs":{"0":{"a":135000,"b":98000},"1":{"a":200000,"b":-1},"2":{"a":11000000,"b":-1},"5":{"a":490000,"b":105000}},"/items/crimson_pot":{"0":{"a":90000,"b":68000},"1":{"a":120000,"b":-1},"2":{"a":125000,"b":-1},"3":{"a":165000,"b":72000},"4":{"a":310000,"b":78000},"5":{"a":540000,"b":90000}},"/items/crimson_shears":{"0":{"a":105000,"b":100000},"1":{"a":135000,"b":-1},"2":{"a":205000,"b":-1},"3":{"a":390000,"b":-1},"5":{"a":720000,"b":115000}},"/items/crimson_spatula":{"0":{"a":120000,"b":110000},"1":{"a":120000,"b":-1},"3":{"a":175000,"b":-1},"5":{"a":295000,"b":145000},"6":{"a":-1,"b":320000}},"/items/crimson_spear":{"0":{"a":170000,"b":120000},"1":{"a":120000,"b":-1},"3":{"a":135000,"b":-1},"4":{"a":170000,"b":-1},"5":{"a":640000,"b":-1}},"/items/crimson_sword":{"0":{"a":160000,"b":88000},"1":{"a":130000,"b":-1},"2":{"a":140000,"b":-1},"3":{"a":180000,"b":-1},"4":{"a":195000,"b":-1},"5":{"a":-1,"b":80000}},"/items/crippling_slash":{"0":{"a":41000,"b":40000}},"/items/critical_aura":{"0":{"a":1650000,"b":1600000}},"/items/critical_coffee":{"0":{"a":2100,"b":2050}},"/items/crushed_amber":{"0":{"a":1400,"b":1350}},"/items/crushed_amethyst":{"0":{"a":2150,"b":2100}},"/items/crushed_garnet":{"0":{"a":2200,"b":2150}},"/items/crushed_jade":{"0":{"a":2200,"b":2150}},"/items/crushed_moonstone":{"0":{"a":3300,"b":3200}},"/items/crushed_pearl":{"0":{"a":880,"b":860}},"/items/crushed_philosophers_stone":{"0":{"a":2100000,"b":2050000}},"/items/crushed_sunstone":{"0":{"a":7800,"b":7600}},"/items/cupcake":{"0":{"a":310,"b":280}},"/items/cursed_ball":{"0":{"a":8400000,"b":8200000}},"/items/cursed_bow":{"0":{"a":175000000,"b":165000000},"2":{"a":-1,"b":18000000},"5":{"a":-1,"b":100000000},"6":{"a":-1,"b":5000000},"7":{"a":195000000,"b":135000000},"8":{"a":270000000,"b":180000000},"10":{"a":-1,"b":440000000},"12":{"a":1700000000,"b":1400000000}},"/items/dairyhands_bottoms":{"0":{"a":-1,"b":100000000},"5":{"a":170000000,"b":155000000},"6":{"a":175000000,"b":160000000},"7":{"a":195000000,"b":50000000},"8":{"a":230000000,"b":-1},"10":{"a":390000000,"b":230000000}},"/items/dairyhands_top":{"0":{"a":-1,"b":96000000},"1":{"a":-1,"b":3700000},"2":{"a":-1,"b":4100000},"5":{"a":155000000,"b":3500000},"6":{"a":155000000,"b":-1},"7":{"a":160000000,"b":-1},"8":{"a":225000000,"b":-1},"9":{"a":-1,"b":185000000},"10":{"a":-1,"b":200000000}},"/items/damaged_anchor":{"0":{"a":8000000,"b":7800000}},"/items/dark_key_fragment":{"0":{"a":1700000,"b":1650000}},"/items/defense_coffee":{"0":{"a":540,"b":500}},"/items/demonic_core":{"0":{"a":1100000,"b":1050000}},"/items/demonic_plate_body":{"0":{"a":-1,"b":5800000},"1":{"a":-1,"b":900000},"2":{"a":34000000,"b":900000},"3":{"a":-1,"b":2250000},"5":{"a":11000000,"b":9600000},"6":{"a":18500000,"b":14000000},"7":{"a":21000000,"b":9800000},"8":{"a":-1,"b":22500000},"9":{"a":-1,"b":25000000},"10":{"a":60000000,"b":54000000},"12":{"a":125000000,"b":400000}},"/items/demonic_plate_legs":{"0":{"a":9200000,"b":7200000},"5":{"a":9800000,"b":9000000},"7":{"a":18000000,"b":10000000},"8":{"a":28000000,"b":10000000},"10":{"a":54000000,"b":30000000},"12":{"a":130000000,"b":38000000},"13":{"a":-1,"b":20500000}},"/items/dodocamel_gauntlets":{"0":{"a":62000000,"b":52000000},"3":{"a":-1,"b":5200000},"5":{"a":58000000,"b":52000000},"7":{"a":-1,"b":66000000},"8":{"a":98000000,"b":80000000},"10":{"a":260000000,"b":230000000},"11":{"a":450000000,"b":-1},"12":{"a":-1,"b":3000000}},"/items/dodocamel_plume":{"0":{"a":8400000,"b":8000000}},"/items/donut":{"0":{"a":150,"b":120}},"/items/dragon_fruit":{"0":{"a":205,"b":200}},"/items/dragon_fruit_gummy":{"0":{"a":700,"b":680}},"/items/dragon_fruit_yogurt":{"0":{"a":860,"b":840}},"/items/earrings_of_armor":{"0":{"a":6000000,"b":5400000},"2":{"a":12000000,"b":-1},"3":{"a":17500000,"b":-1},"4":{"a":38000000,"b":-1}},"/items/earrings_of_critical_strike":{"0":{"a":7800000,"b":7200000},"1":{"a":12000000,"b":6200000},"2":{"a":13000000,"b":9400000},"3":{"a":19000000,"b":18500000},"4":{"a":36000000,"b":31000000},"5":{"a":72000000,"b":64000000}},"/items/earrings_of_essence_find":{"0":{"a":5800000,"b":5200000},"1":{"a":9800000,"b":94000},"2":{"a":10500000,"b":185000},"3":{"a":16000000,"b":195000},"4":{"a":33000000,"b":270000},"5":{"a":49000000,"b":-1}},"/items/earrings_of_gathering":{"0":{"a":5600000,"b":5000000},"1":{"a":9800000,"b":340000},"5":{"a":-1,"b":215000}},"/items/earrings_of_rare_find":{"0":{"a":6800000,"b":6400000},"1":{"a":8200000,"b":7000000},"2":{"a":12000000,"b":9000000},"3":{"a":19500000,"b":16000000},"4":{"a":36000000,"b":30000000},"5":{"a":84000000,"b":50000000},"6":{"a":-1,"b":1100000},"7":{"a":-1,"b":120000000},"8":{"a":-1,"b":41000},"9":{"a":-1,"b":41000},"10":{"a":-1,"b":100000000}},"/items/earrings_of_regeneration":{"0":{"a":6000000,"b":5800000},"1":{"a":9800000,"b":3000000},"2":{"a":-1,"b":9200000},"3":{"a":17000000,"b":16000000},"4":{"a":31000000,"b":27000000},"5":{"a":58000000,"b":54000000},"6":{"a":105000000,"b":90000000},"7":{"a":215000000,"b":160000000},"8":{"a":285000000,"b":-1},"9":{"a":-1,"b":31000000},"20":{"a":-1,"b":48000}},"/items/earrings_of_resistance":{"0":{"a":5400000,"b":5000000},"1":{"a":9600000,"b":110000},"2":{"a":20500000,"b":165000},"3":{"a":-1,"b":125000},"4":{"a":-1,"b":220000},"5":{"a":98000000,"b":400000},"6":{"a":-1,"b":105000}},"/items/efficiency_tea":{"0":{"a":1050,"b":1000}},"/items/egg":{"0":{"a":32,"b":31}},"/items/elemental_affinity":{"0":{"a":220000,"b":215000}},"/items/elusiveness":{"0":{"a":42000,"b":40000}},"/items/emp_tea_leaf":{"0":{"a":360,"b":350}},"/items/enchanted_chest_key":{"0":{"a":5400000,"b":5200000}},"/items/enchanted_entry_key":{"0":{"a":540000,"b":520000}},"/items/enchanted_essence":{"0":{"a":1650,"b":1600}},"/items/enchanted_gloves":{"0":{"a":10000000,"b":8800000},"1":{"a":-1,"b":8600000},"2":{"a":-1,"b":8600000},"3":{"a":11000000,"b":8600000},"4":{"a":-1,"b":255000},"5":{"a":11500000,"b":10500000},"6":{"a":14000000,"b":1800000},"8":{"a":38000000,"b":25000000},"10":{"a":72000000,"b":70000000},"12":{"a":290000000,"b":220000000},"13":{"a":600000000,"b":-1}},"/items/enhancers_bottoms":{"0":{"a":-1,"b":11000000},"5":{"a":-1,"b":15500000},"8":{"a":320000000,"b":280000000},"10":{"a":520000000,"b":-1}},"/items/enhancers_top":{"0":{"a":235000000,"b":-1},"5":{"a":-1,"b":12500000},"8":{"a":-1,"b":3500000}},"/items/enhancing_essence":{"0":{"a":820,"b":800}},"/items/enhancing_tea":{"0":{"a":1100,"b":1000}},"/items/entangle":{"0":{"a":15500,"b":15000}},"/items/excelsa_coffee_bean":{"0":{"a":480,"b":460}},"/items/eye_of_the_watcher":{"0":{"a":330000,"b":320000}},"/items/eye_watch":{"0":{"a":3600000,"b":3200000},"1":{"a":12000000,"b":-1},"4":{"a":-1,"b":3200000},"5":{"a":4800000,"b":4500000},"6":{"a":-1,"b":5600000},"7":{"a":10000000,"b":8600000},"8":{"a":16000000,"b":13500000},"9":{"a":28500000,"b":245000},"10":{"a":40000000,"b":35000000},"11":{"a":78000000,"b":66000000},"12":{"a":-1,"b":62000000}},"/items/eyessence":{"0":{"a":60,"b":58}},"/items/fierce_aura":{"0":{"a":3300000,"b":3200000}},"/items/fieriosa_coffee_bean":{"0":{"a":540,"b":520}},"/items/fighter_necklace":{"0":{"a":10500000,"b":9600000},"1":{"a":12500000,"b":12000000},"2":{"a":-1,"b":10000000},"3":{"a":-1,"b":18500000},"4":{"a":74000000,"b":270000},"5":{"a":98000000,"b":30000000},"6":{"a":-1,"b":370000},"7":{"a":-1,"b":2450000}},"/items/fireball":{"0":{"a":7600,"b":7400}},"/items/firestorm":{"0":{"a":260000,"b":255000}},"/items/flame_arrow":{"0":{"a":27500,"b":27000}},"/items/flame_aura":{"0":{"a":1150000,"b":1100000}},"/items/flame_blast":{"0":{"a":46000,"b":45000}},"/items/flaming_cloth":{"0":{"a":58000,"b":56000}},"/items/flaming_robe_bottoms":{"0":{"a":230000,"b":190000},"1":{"a":220000,"b":-1},"2":{"a":245000,"b":-1},"3":{"a":275000,"b":-1},"4":{"a":340000,"b":-1},"5":{"a":340000,"b":310000},"6":{"a":820000,"b":-1},"7":{"a":1500000,"b":600000},"8":{"a":2200000,"b":1650000},"9":{"a":4800000,"b":2800000},"10":{"a":6800000,"b":6200000},"11":{"a":-1,"b":8400000},"12":{"a":20000000,"b":-1}},"/items/flaming_robe_top":{"0":{"a":360000,"b":300000},"1":{"a":310000,"b":105000},"2":{"a":320000,"b":100000},"3":{"a":320000,"b":105000},"4":{"a":330000,"b":-1},"5":{"a":350000,"b":-1},"6":{"a":940000,"b":390000},"7":{"a":1100000,"b":900000},"8":{"a":2350000,"b":1900000},"9":{"a":5200000,"b":3200000},"10":{"a":7400000,"b":6600000},"11":{"a":-1,"b":9400000},"12":{"a":24000000,"b":-1},"13":{"a":54000000,"b":-1}},"/items/flax":{"0":{"a":49,"b":45}},"/items/fluffy_red_hat":{"0":{"a":5000000,"b":4200000},"3":{"a":5600000,"b":540000},"5":{"a":5400000,"b":5000000},"6":{"a":7000000,"b":5400000},"7":{"a":11500000,"b":10000000},"8":{"a":18500000,"b":13000000},"9":{"a":35000000,"b":19000000},"10":{"a":40000000,"b":37000000},"11":{"a":-1,"b":310000},"12":{"a":92000000,"b":-1},"13":{"a":200000000,"b":-1}},"/items/foragers_bottoms":{"0":{"a":250000000,"b":105000000},"4":{"a":-1,"b":115000000},"5":{"a":175000000,"b":160000000},"6":{"a":180000000,"b":170000000},"7":{"a":195000000,"b":180000000},"8":{"a":235000000,"b":-1},"10":{"a":480000000,"b":4200000}},"/items/foragers_top":{"0":{"a":-1,"b":18500000},"4":{"a":-1,"b":100000000},"5":{"a":160000000,"b":145000000},"6":{"a":160000000,"b":20500000},"7":{"a":180000000,"b":-1},"8":{"a":215000000,"b":26000000},"10":{"a":450000000,"b":300000000},"11":{"a":-1,"b":320000000},"12":{"a":1350000000,"b":-1}},"/items/foraging_essence":{"0":{"a":215,"b":205}},"/items/foraging_tea":{"0":{"a":430,"b":400}},"/items/fracturing_impact":{"0":{"a":80000,"b":70000}},"/items/frenzy":{"0":{"a":225000,"b":220000}},"/items/frost_sphere":{"0":{"a":580000,"b":560000}},"/items/frost_staff":{"0":{"a":12000000,"b":11000000},"1":{"a":-1,"b":1250000},"2":{"a":-1,"b":1450000},"3":{"a":-1,"b":3600000},"4":{"a":-1,"b":1850000},"5":{"a":12000000,"b":10500000},"6":{"a":15000000,"b":1500000},"7":{"a":18000000,"b":-1},"8":{"a":26000000,"b":13000000},"9":{"a":32000000,"b":-1},"10":{"a":50000000,"b":38000000},"11":{"a":-1,"b":70000000},"12":{"a":165000000,"b":100000000},"14":{"a":760000000,"b":12000000}},"/items/frost_surge":{"0":{"a":300000,"b":295000}},"/items/furious_spear":{"0":{"a":255000000,"b":240000000},"5":{"a":285000000,"b":165000000},"6":{"a":-1,"b":250000000},"7":{"a":295000000,"b":270000000},"8":{"a":370000000,"b":38000000},"10":{"a":680000000,"b":600000000},"12":{"a":1950000000,"b":1700000000}},"/items/garnet":{"0":{"a":35000,"b":34000}},"/items/gathering_tea":{"0":{"a":420,"b":390}},"/items/gator_vest":{"0":{"a":18000,"b":17500},"1":{"a":19000,"b":17000},"2":{"a":19000,"b":16500},"3":{"a":19000,"b":16500},"4":{"a":21000,"b":16500},"5":{"a":27000,"b":25500},"6":{"a":66000,"b":47000},"7":{"a":115000,"b":105000},"8":{"a":260000,"b":205000},"9":{"a":840000,"b":440000},"10":{"a":880000,"b":860000},"11":{"a":2900000,"b":-1},"13":{"a":21500000,"b":-1},"15":{"a":90000000,"b":5000},"20":{"a":-1,"b":5200}},"/items/giant_pouch":{"0":{"a":6000000,"b":5800000},"1":{"a":-1,"b":2150000},"2":{"a":6800000,"b":1350000},"3":{"a":7400000,"b":4500000},"4":{"a":9000000,"b":7000000},"5":{"a":11500000,"b":9400000},"6":{"a":20000000,"b":1050000},"7":{"a":90000000,"b":20000000},"8":{"a":-1,"b":1000000},"10":{"a":-1,"b":90000000},"20":{"a":-1,"b":2200000}},"/items/ginkgo_bow":{"0":{"a":165000,"b":145000},"2":{"a":150000,"b":-1},"4":{"a":230000,"b":-1},"5":{"a":190000,"b":-1}},"/items/ginkgo_crossbow":{"0":{"a":150000,"b":130000},"1":{"a":150000,"b":-1},"2":{"a":135000,"b":-1},"3":{"a":140000,"b":-1},"4":{"a":175000,"b":-1},"5":{"a":210000,"b":-1},"6":{"a":300000,"b":-1},"7":{"a":400000,"b":-1}},"/items/ginkgo_fire_staff":{"0":{"a":145000,"b":130000},"1":{"a":150000,"b":-1},"2":{"a":160000,"b":-1},"3":{"a":170000,"b":-1},"4":{"a":225000,"b":-1},"5":{"a":250000,"b":-1},"6":{"a":1250000,"b":-1}},"/items/ginkgo_log":{"0":{"a":27,"b":24}},"/items/ginkgo_lumber":{"0":{"a":820,"b":800}},"/items/ginkgo_nature_staff":{"0":{"a":155000,"b":130000},"1":{"a":-1,"b":14000},"2":{"a":160000,"b":14000},"3":{"a":170000,"b":14000},"4":{"a":200000,"b":-1},"5":{"a":470000,"b":110000},"7":{"a":1100000,"b":-1},"10":{"a":10000000,"b":-1}},"/items/ginkgo_shield":{"0":{"a":68000,"b":62000},"1":{"a":74000,"b":-1},"3":{"a":130000,"b":-1},"4":{"a":125000,"b":-1},"5":{"a":100000,"b":84000},"6":{"a":250000,"b":-1},"10":{"a":2950000,"b":1500000}},"/items/ginkgo_water_staff":{"0":{"a":145000,"b":115000},"1":{"a":130000,"b":-1},"2":{"a":140000,"b":-1},"3":{"a":170000,"b":-1},"4":{"a":310000,"b":-1},"5":{"a":430000,"b":-1}},"/items/gluttonous_energy":{"0":{"a":11500000,"b":9000000}},"/items/gluttonous_pouch":{"0":{"a":-1,"b":31000000},"1":{"a":-1,"b":7000000},"2":{"a":-1,"b":7000000},"3":{"a":-1,"b":7000000},"4":{"a":310000000,"b":7000000},"5":{"a":-1,"b":5200000}},"/items/gobo_boomstick":{"0":{"a":82000,"b":80000},"1":{"a":92000,"b":20000},"2":{"a":-1,"b":20000},"3":{"a":2250000,"b":20000},"4":{"a":135000,"b":-1},"5":{"a":100000,"b":82000},"6":{"a":145000,"b":-1},"7":{"a":340000,"b":-1},"8":{"a":660000,"b":-1},"10":{"a":2650000,"b":880000}},"/items/gobo_boots":{"0":{"a":25000,"b":20500},"1":{"a":9800000,"b":-1},"2":{"a":31000,"b":-1},"3":{"a":29500,"b":-1},"4":{"a":48000,"b":-1},"5":{"a":80000,"b":-1},"8":{"a":12500000,"b":-1}},"/items/gobo_bracers":{"0":{"a":31000,"b":27000},"1":{"a":145000,"b":-1},"2":{"a":84000,"b":-1},"3":{"a":90000,"b":-1},"4":{"a":115000,"b":-1},"5":{"a":245000,"b":-1},"6":{"a":300000,"b":-1},"7":{"a":700000,"b":-1}},"/items/gobo_chaps":{"0":{"a":45000,"b":44000},"1":{"a":58000,"b":-1},"2":{"a":70000,"b":-1},"3":{"a":70000,"b":-1},"4":{"a":120000,"b":-1},"5":{"a":160000,"b":-1},"8":{"a":5000000,"b":-1}},"/items/gobo_defender":{"0":{"a":420000,"b":410000},"2":{"a":430000,"b":-1},"4":{"a":450000,"b":-1},"5":{"a":460000,"b":380000},"6":{"a":500000,"b":390000},"7":{"a":600000,"b":-1},"8":{"a":900000,"b":800000},"9":{"a":2150000,"b":900000},"10":{"a":3300000,"b":2450000},"11":{"a":-1,"b":3500000},"12":{"a":-1,"b":100000}},"/items/gobo_essence":{"0":{"a":45,"b":41}},"/items/gobo_hide":{"0":{"a":22,"b":14}},"/items/gobo_hood":{"0":{"a":31000,"b":29500},"1":{"a":39000,"b":-1},"3":{"a":45000,"b":-1},"4":{"a":82000,"b":-1},"5":{"a":135000,"b":-1},"6":{"a":900000,"b":-1},"7":{"a":6600000,"b":-1}},"/items/gobo_leather":{"0":{"a":580,"b":560}},"/items/gobo_rag":{"0":{"a":370000,"b":360000}},"/items/gobo_shooter":{"0":{"a":82000,"b":80000},"2":{"a":100000,"b":-1},"3":{"a":98000,"b":-1},"4":{"a":110000,"b":-1},"5":{"a":105000,"b":90000},"6":{"a":140000,"b":-1},"7":{"a":260000,"b":-1},"8":{"a":1000000,"b":-1},"10":{"a":2750000,"b":1050000}},"/items/gobo_slasher":{"0":{"a":82000,"b":80000},"1":{"a":82000,"b":-1},"2":{"a":84000,"b":-1},"3":{"a":86000,"b":-1},"4":{"a":98000,"b":-1},"5":{"a":100000,"b":-1},"6":{"a":160000,"b":120000},"7":{"a":340000,"b":205000},"8":{"a":1000000,"b":-1},"9":{"a":2850000,"b":1600000},"10":{"a":4000000,"b":2400000},"11":{"a":19500000,"b":760000},"12":{"a":20000000,"b":-1}},"/items/gobo_smasher":{"0":{"a":82000,"b":80000},"1":{"a":84000,"b":-1},"2":{"a":86000,"b":-1},"3":{"a":86000,"b":-1},"5":{"a":98000,"b":82000},"6":{"a":275000,"b":-1},"7":{"a":580000,"b":-1},"10":{"a":7400000,"b":-1},"14":{"a":245000000,"b":-1}},"/items/gobo_stabber":{"0":{"a":82000,"b":80000},"1":{"a":88000,"b":-1},"2":{"a":5000000,"b":-1},"3":{"a":100000,"b":-1},"4":{"a":100000,"b":-1},"5":{"a":105000,"b":-1},"6":{"a":180000,"b":-1},"7":{"a":400000,"b":-1},"8":{"a":2500000,"b":-1},"10":{"a":4700000,"b":-1},"11":{"a":5800000,"b":-1}},"/items/gobo_tunic":{"0":{"a":49000,"b":47000},"1":{"a":150000,"b":-1},"2":{"a":70000,"b":-1},"3":{"a":105000,"b":-1},"4":{"a":80000,"b":-1},"5":{"a":54000,"b":-1},"9":{"a":13000000,"b":-1}},"/items/goggles":{"0":{"a":58000,"b":56000}},"/items/golem_essence":{"0":{"a":300,"b":295}},"/items/gourmet_tea":{"0":{"a":540,"b":520}},"/items/granite_bludgeon":{"0":{"a":12000000,"b":11000000},"1":{"a":-1,"b":5400000},"2":{"a":-1,"b":5400000},"3":{"a":-1,"b":6400000},"4":{"a":-1,"b":2650000},"5":{"a":12000000,"b":11500000},"6":{"a":-1,"b":8000000},"7":{"a":20000000,"b":16500000},"8":{"a":30000000,"b":19500000},"10":{"a":74000000,"b":58000000},"14":{"a":400000000,"b":-1}},"/items/green_key_fragment":{"0":{"a":680000,"b":660000}},"/items/green_tea_leaf":{"0":{"a":10,"b":9}},"/items/griffin_bulwark":{"0":{"a":170000000,"b":145000000},"4":{"a":-1,"b":5000000},"5":{"a":170000000,"b":160000000},"6":{"a":170000000,"b":-1},"7":{"a":195000000,"b":170000000},"8":{"a":-1,"b":195000000},"10":{"a":440000000,"b":-1},"11":{"a":-1,"b":5000000},"12":{"a":-1,"b":350000000}},"/items/griffin_chaps":{"0":{"a":7000000,"b":5600000},"1":{"a":6400000,"b":-1},"5":{"a":6200000,"b":6000000},"7":{"a":14000000,"b":10000000},"10":{"a":39000000,"b":30000000}},"/items/griffin_leather":{"0":{"a":780000,"b":740000}},"/items/griffin_talon":{"0":{"a":7000000,"b":6200000}},"/items/griffin_tunic":{"0":{"a":7800000,"b":7400000},"5":{"a":8000000,"b":7200000},"6":{"a":11500000,"b":-1},"7":{"a":21500000,"b":11000000},"8":{"a":30000000,"b":-1},"10":{"a":72000000,"b":60000000}},"/items/grizzly_bear_fluff":{"0":{"a":82000,"b":80000}},"/items/grizzly_bear_shoes":{"0":{"a":400000,"b":380000},"1":{"a":500000,"b":-1},"3":{"a":520000,"b":-1},"4":{"a":620000,"b":-1},"5":{"a":680000,"b":540000},"6":{"a":-1,"b":820000},"7":{"a":1850000,"b":1500000},"8":{"a":4000000,"b":2050000},"9":{"a":9200000,"b":4000000},"10":{"a":10500000,"b":9800000},"11":{"a":22000000,"b":1550000},"12":{"a":44000000,"b":33000000},"13":{"a":80000000,"b":35000000},"14":{"a":160000000,"b":80000000},"15":{"a":360000000,"b":185000000}},"/items/gummy":{"0":{"a":38,"b":36}},"/items/guzzling_energy":{"0":{"a":22500000,"b":22000000}},"/items/guzzling_pouch":{"0":{"a":280000000,"b":250000000},"1":{"a":-1,"b":32000000},"2":{"a":-1,"b":180000000},"4":{"a":-1,"b":40000000},"5":{"a":280000000,"b":275000000},"6":{"a":300000000,"b":290000000},"7":{"a":360000000,"b":350000000},"8":{"a":460000000,"b":240000000},"10":{"a":940000000,"b":880000000}},"/items/heal":{"0":{"a":31000,"b":27500}},"/items/holy_alembic":{"0":{"a":400000,"b":390000},"1":{"a":-1,"b":62000},"3":{"a":600000,"b":340000},"4":{"a":1000000,"b":500000},"5":{"a":1550000,"b":1500000},"6":{"a":3200000,"b":2900000},"7":{"a":7000000,"b":5800000},"8":{"a":12000000,"b":10000000},"9":{"a":23500000,"b":19000000},"10":{"a":39000000,"b":35000000},"12":{"a":-1,"b":340000},"20":{"a":-1,"b":90000}},"/items/holy_boots":{"0":{"a":160000,"b":150000},"1":{"a":160000,"b":-1},"2":{"a":225000,"b":-1},"3":{"a":300000,"b":-1},"4":{"a":540000,"b":-1},"5":{"a":490000,"b":300000},"6":{"a":3200000,"b":-1},"10":{"a":20500000,"b":2700000}},"/items/holy_brush":{"0":{"a":370000,"b":350000},"1":{"a":410000,"b":300000},"2":{"a":580000,"b":160000},"3":{"a":760000,"b":360000},"4":{"a":1000000,"b":500000},"5":{"a":1550000,"b":1450000},"6":{"a":3500000,"b":3000000},"7":{"a":6800000,"b":5800000},"8":{"a":12000000,"b":10500000},"9":{"a":23500000,"b":17000000},"10":{"a":36000000,"b":34000000},"11":{"a":66000000,"b":-1}},"/items/holy_buckler":{"0":{"a":380000,"b":370000},"1":{"a":340000,"b":-1},"2":{"a":350000,"b":-1},"4":{"a":700000,"b":-1},"5":{"a":1200000,"b":300000},"6":{"a":3000000,"b":-1},"7":{"a":6400000,"b":-1}},"/items/holy_bulwark":{"0":{"a":490000,"b":470000},"1":{"a":-1,"b":330000},"2":{"a":800000,"b":-1},"4":{"a":920000,"b":300000},"5":{"a":1750000,"b":1200000}},"/items/holy_cheese":{"0":{"a":1650,"b":1600}},"/items/holy_chisel":{"0":{"a":380000,"b":370000},"2":{"a":-1,"b":380000},"3":{"a":660000,"b":410000},"4":{"a":1000000,"b":520000},"5":{"a":1550000,"b":1500000},"6":{"a":4500000,"b":2250000},"7":{"a":7000000,"b":6200000},"8":{"a":12000000,"b":9200000},"9":{"a":25000000,"b":16500000},"10":{"a":37000000,"b":36000000},"11":{"a":70000000,"b":50000000},"12":{"a":155000000,"b":-1}},"/items/holy_enhancer":{"0":{"a":410000,"b":380000},"1":{"a":420000,"b":-1},"2":{"a":520000,"b":260000},"3":{"a":600000,"b":320000},"4":{"a":820000,"b":500000},"5":{"a":1550000,"b":1450000},"6":{"a":3200000,"b":2200000},"7":{"a":6400000,"b":5200000},"8":{"a":12500000,"b":9200000},"9":{"a":22000000,"b":18500000},"10":{"a":36000000,"b":34000000},"11":{"a":78000000,"b":38000000},"12":{"a":140000000,"b":-1},"13":{"a":-1,"b":100000000}},"/items/holy_gauntlets":{"0":{"a":260000,"b":250000},"1":{"a":280000,"b":-1},"2":{"a":300000,"b":-1},"4":{"a":860000,"b":-1},"5":{"a":640000,"b":-1},"6":{"a":1950000,"b":-1}},"/items/holy_hammer":{"0":{"a":390000,"b":360000},"1":{"a":-1,"b":62000},"2":{"a":600000,"b":320000},"3":{"a":640000,"b":340000},"4":{"a":980000,"b":490000},"5":{"a":1550000,"b":1500000},"6":{"a":3600000,"b":2400000},"7":{"a":6800000,"b":4700000},"8":{"a":12000000,"b":-1},"9":{"a":22500000,"b":17000000},"10":{"a":37000000,"b":35000000},"15":{"a":880000000,"b":-1}},"/items/holy_hatchet":{"0":{"a":380000,"b":370000},"1":{"a":500000,"b":330000},"2":{"a":500000,"b":360000},"3":{"a":780000,"b":330000},"4":{"a":-1,"b":540000},"5":{"a":1550000,"b":1400000},"6":{"a":3800000,"b":2400000},"7":{"a":6400000,"b":5800000},"8":{"a":12500000,"b":9200000},"9":{"a":23500000,"b":-1},"10":{"a":36000000,"b":32000000},"11":{"a":66000000,"b":-1},"14":{"a":600000000,"b":-1}},"/items/holy_helmet":{"0":{"a":310000,"b":300000},"3":{"a":680000,"b":-1},"4":{"a":760000,"b":-1},"5":{"a":1400000,"b":100000},"6":{"a":2950000,"b":-1},"7":{"a":6000000,"b":-1}},"/items/holy_mace":{"0":{"a":470000,"b":460000},"1":{"a":520000,"b":-1},"2":{"a":600000,"b":-1},"3":{"a":660000,"b":-1},"4":{"a":780000,"b":-1},"5":{"a":980000,"b":-1},"6":{"a":3400000,"b":960000},"7":{"a":7600000,"b":84000},"8":{"a":-1,"b":105000},"10":{"a":22500000,"b":-1}},"/items/holy_milk":{"0":{"a":260,"b":250}},"/items/holy_needle":{"0":{"a":390000,"b":380000},"1":{"a":450000,"b":300000},"2":{"a":490000,"b":330000},"3":{"a":780000,"b":370000},"4":{"a":1100000,"b":160000},"5":{"a":1600000,"b":1500000},"6":{"a":3500000,"b":2350000},"7":{"a":6600000,"b":5600000},"8":{"a":13000000,"b":9400000},"9":{"a":21500000,"b":3500000},"10":{"a":38000000,"b":37000000}},"/items/holy_plate_body":{"0":{"a":500000,"b":470000},"1":{"a":540000,"b":-1},"2":{"a":540000,"b":-1},"3":{"a":800000,"b":-1},"4":{"a":940000,"b":-1},"5":{"a":1500000,"b":820000},"6":{"a":2800000,"b":-1},"10":{"a":-1,"b":3000000}},"/items/holy_plate_legs":{"0":{"a":450000,"b":410000},"2":{"a":500000,"b":-1},"3":{"a":640000,"b":-1},"4":{"a":740000,"b":-1},"5":{"a":940000,"b":-1},"6":{"a":1800000,"b":-1}},"/items/holy_pot":{"0":{"a":400000,"b":390000},"2":{"a":-1,"b":340000},"3":{"a":700000,"b":350000},"4":{"a":1000000,"b":760000},"5":{"a":1550000,"b":1500000},"6":{"a":3500000,"b":-1},"7":{"a":6800000,"b":5400000},"8":{"a":12000000,"b":9400000},"9":{"a":23500000,"b":18500000},"10":{"a":36000000,"b":34000000},"13":{"a":330000000,"b":32000000},"14":{"a":490000000,"b":-1}},"/items/holy_shears":{"0":{"a":400000,"b":380000},"1":{"a":480000,"b":62000},"2":{"a":540000,"b":130000},"3":{"a":680000,"b":390000},"4":{"a":980000,"b":490000},"5":{"a":1550000,"b":1500000},"6":{"a":3000000,"b":2150000},"7":{"a":6600000,"b":6200000},"8":{"a":12500000,"b":9200000},"9":{"a":23500000,"b":18500000},"10":{"a":39000000,"b":37000000},"11":{"a":80000000,"b":200000},"16":{"a":-1,"b":880000}},"/items/holy_spatula":{"0":{"a":400000,"b":370000},"1":{"a":-1,"b":320000},"2":{"a":450000,"b":340000},"3":{"a":700000,"b":340000},"4":{"a":1100000,"b":520000},"5":{"a":1550000,"b":1500000},"6":{"a":3400000,"b":2400000},"7":{"a":6600000,"b":4500000},"8":{"a":-1,"b":9400000},"9":{"a":22500000,"b":-1},"10":{"a":36000000,"b":35000000},"11":{"a":78000000,"b":50000000},"12":{"a":-1,"b":66000000}},"/items/holy_spear":{"0":{"a":490000,"b":450000},"3":{"a":700000,"b":80000},"4":{"a":1200000,"b":80000},"5":{"a":1800000,"b":-1},"6":{"a":4800000,"b":84000},"7":{"a":6200000,"b":-1},"8":{"a":9800000,"b":96000},"9":{"a":-1,"b":100000},"10":{"a":-1,"b":110000}},"/items/holy_sword":{"0":{"a":540000,"b":520000},"1":{"a":520000,"b":-1},"2":{"a":580000,"b":-1},"3":{"a":600000,"b":-1},"4":{"a":820000,"b":-1},"5":{"a":1150000,"b":-1},"6":{"a":3800000,"b":-1},"7":{"a":-1,"b":480000},"8":{"a":-1,"b":480000},"9":{"a":-1,"b":480000},"10":{"a":-1,"b":8000000},"20":{"a":-1,"b":10000000}},"/items/ice_spear":{"0":{"a":27500,"b":27000}},"/items/icy_cloth":{"0":{"a":58000,"b":56000}},"/items/icy_robe_bottoms":{"0":{"a":205000,"b":180000},"3":{"a":235000,"b":-1},"4":{"a":370000,"b":-1},"5":{"a":220000,"b":130000},"6":{"a":390000,"b":200000},"7":{"a":1100000,"b":400000},"8":{"a":1750000,"b":450000},"10":{"a":5400000,"b":5000000}},"/items/icy_robe_top":{"0":{"a":320000,"b":300000},"3":{"a":300000,"b":-1},"4":{"a":470000,"b":-1},"5":{"a":320000,"b":130000},"6":{"a":580000,"b":-1},"7":{"a":1700000,"b":-1},"8":{"a":1950000,"b":-1},"9":{"a":4200000,"b":-1},"10":{"a":6600000,"b":6000000},"11":{"a":13500000,"b":3100000}},"/items/impale":{"0":{"a":27500,"b":27000}},"/items/infernal_battlestaff":{"0":{"a":12500000,"b":11000000},"1":{"a":-1,"b":1500000},"2":{"a":-1,"b":1350000},"3":{"a":-1,"b":1850000},"5":{"a":11500000,"b":11000000},"6":{"a":14000000,"b":10000000},"7":{"a":19000000,"b":15000000},"8":{"a":-1,"b":23000000},"9":{"a":-1,"b":40000000},"10":{"a":68000000,"b":62000000},"11":{"a":100000000,"b":-1},"12":{"a":165000000,"b":-1},"13":{"a":-1,"b":20500000}},"/items/infernal_ember":{"0":{"a":640000,"b":620000}},"/items/insanity":{"0":{"a":2150000,"b":2100000}},"/items/intelligence_coffee":{"0":{"a":460,"b":450}},"/items/invincible":{"0":{"a":1150000,"b":1100000}},"/items/jackalope_antler":{"0":{"a":3300000,"b":3200000}},"/items/jackalope_staff":{"0":{"a":58000000,"b":56000000},"3":{"a":-1,"b":9800000},"4":{"a":-1,"b":9800000},"5":{"a":62000000,"b":58000000},"6":{"a":68000000,"b":-1},"7":{"a":74000000,"b":66000000},"8":{"a":92000000,"b":72000000},"9":{"a":-1,"b":11500000},"10":{"a":170000000,"b":155000000}},"/items/jade":{"0":{"a":35000,"b":34000}},"/items/jungle_essence":{"0":{"a":40,"b":36}},"/items/knights_aegis":{"0":{"a":86000000,"b":84000000},"1":{"a":-1,"b":80000000},"2":{"a":-1,"b":80000000},"3":{"a":-1,"b":82000000},"4":{"a":-1,"b":84000000},"5":{"a":90000000,"b":84000000},"6":{"a":96000000,"b":84000000},"7":{"a":110000000,"b":105000000},"8":{"a":150000000,"b":135000000},"9":{"a":-1,"b":170000000},"10":{"a":370000000,"b":330000000},"11":{"a":-1,"b":400000000},"12":{"a":-1,"b":600000000}},"/items/knights_ingot":{"0":{"a":8200000,"b":8000000}},"/items/kraken_chaps":{"0":{"a":84000000,"b":80000000},"1":{"a":-1,"b":74000000},"2":{"a":-1,"b":74000000},"3":{"a":-1,"b":74000000},"4":{"a":-1,"b":76000000},"5":{"a":88000000,"b":84000000},"6":{"a":-1,"b":82000000},"7":{"a":110000000,"b":105000000},"8":{"a":-1,"b":140000000},"9":{"a":-1,"b":145000000},"10":{"a":-1,"b":380000000},"11":{"a":-1,"b":420000000},"12":{"a":-1,"b":900000000}},"/items/kraken_fang":{"0":{"a":14000000,"b":13500000}},"/items/kraken_leather":{"0":{"a":9200000,"b":9000000}},"/items/kraken_tunic":{"0":{"a":-1,"b":96000000},"1":{"a":-1,"b":84000000},"2":{"a":-1,"b":84000000},"3":{"a":-1,"b":84000000},"4":{"a":-1,"b":86000000},"5":{"a":110000000,"b":98000000},"6":{"a":-1,"b":100000000},"7":{"a":130000000,"b":125000000},"8":{"a":-1,"b":165000000},"9":{"a":260000000,"b":235000000},"10":{"a":430000000,"b":400000000},"11":{"a":-1,"b":500000000},"12":{"a":-1,"b":900000000}},"/items/large_pouch":{"0":{"a":580000,"b":560000},"1":{"a":600000,"b":110000},"2":{"a":680000,"b":100000},"3":{"a":980000,"b":-1},"4":{"a":8800000,"b":105000},"5":{"a":4300000,"b":1200000}},"/items/liberica_coffee_bean":{"0":{"a":380,"b":370}},"/items/life_drain":{"0":{"a":68000,"b":64000}},"/items/linen_boots":{"0":{"a":9600,"b":8400},"1":{"a":580,"b":-1},"3":{"a":86000,"b":-1},"5":{"a":90000,"b":-1},"7":{"a":1650000,"b":-1},"10":{"a":6400000,"b":-1}},"/items/linen_fabric":{"0":{"a":360,"b":350}},"/items/linen_gloves":{"0":{"a":9400,"b":8400},"3":{"a":40000,"b":-1},"4":{"a":130000,"b":-1},"5":{"a":240000,"b":-1},"6":{"a":200000,"b":-1},"7":{"a":980000,"b":-1}},"/items/linen_hat":{"0":{"a":11000,"b":9000},"1":{"a":30000,"b":-1},"3":{"a":1600000,"b":-1},"5":{"a":170000,"b":-1},"7":{"a":400000,"b":-1}},"/items/linen_robe_bottoms":{"0":{"a":15500,"b":12500},"1":{"a":50000,"b":-1},"2":{"a":480000,"b":-1},"5":{"a":245000,"b":-1}},"/items/linen_robe_top":{"0":{"a":16000,"b":13500},"1":{"a":33000,"b":-1},"2":{"a":40000,"b":-1},"3":{"a":88000,"b":-1},"4":{"a":180000,"b":-1},"5":{"a":500000,"b":-1},"6":{"a":760000,"b":-1},"7":{"a":1000000,"b":-1},"8":{"a":1200000,"b":-1},"10":{"a":1900000,"b":-1}},"/items/living_granite":{"0":{"a":640000,"b":620000}},"/items/log":{"0":{"a":13,"b":12}},"/items/lucky_coffee":{"0":{"a":1550,"b":1500}},"/items/lumber":{"0":{"a":235,"b":225}},"/items/lumberjacks_bottoms":{"0":{"a":-1,"b":100000000},"5":{"a":175000000,"b":130000000},"6":{"a":180000000,"b":160000000},"7":{"a":195000000,"b":-1},"8":{"a":235000000,"b":-1},"10":{"a":-1,"b":330000000}},"/items/lumberjacks_top":{"0":{"a":-1,"b":100000000},"5":{"a":155000000,"b":135000000},"7":{"a":175000000,"b":-1},"8":{"a":215000000,"b":-1},"10":{"a":-1,"b":300000000}},"/items/luna_robe_bottoms":{"0":{"a":1550000,"b":1450000},"1":{"a":2050000,"b":-1},"3":{"a":-1,"b":210000},"4":{"a":-1,"b":185000},"5":{"a":-1,"b":1750000},"6":{"a":3000000,"b":1500000},"7":{"a":5400000,"b":4600000},"8":{"a":8000000,"b":3200000},"9":{"a":-1,"b":5000000},"10":{"a":21500000,"b":21000000}},"/items/luna_robe_top":{"0":{"a":2150000,"b":1900000},"1":{"a":2250000,"b":235000},"2":{"a":-1,"b":255000},"3":{"a":-1,"b":280000},"4":{"a":-1,"b":260000},"5":{"a":2600000,"b":2500000},"6":{"a":4500000,"b":2500000},"7":{"a":6400000,"b":5400000},"8":{"a":13000000,"b":6600000},"9":{"a":16000000,"b":7800000},"10":{"a":24000000,"b":22000000},"12":{"a":86000000,"b":78000000}},"/items/luna_wing":{"0":{"a":205000,"b":200000}},"/items/maelstrom_plate_body":{"0":{"a":110000000,"b":100000000},"1":{"a":-1,"b":90000000},"2":{"a":-1,"b":90000000},"3":{"a":-1,"b":90000000},"4":{"a":-1,"b":90000000},"5":{"a":110000000,"b":98000000},"6":{"a":-1,"b":94000000},"7":{"a":140000000,"b":110000000},"8":{"a":200000000,"b":180000000},"9":{"a":-1,"b":175000000},"10":{"a":500000000,"b":410000000},"12":{"a":-1,"b":800000000}},"/items/maelstrom_plate_legs":{"0":{"a":86000000,"b":80000000},"1":{"a":-1,"b":78000000},"2":{"a":-1,"b":78000000},"3":{"a":-1,"b":78000000},"4":{"a":-1,"b":80000000},"5":{"a":96000000,"b":82000000},"6":{"a":-1,"b":88000000},"7":{"a":115000000,"b":110000000},"8":{"a":-1,"b":150000000},"9":{"a":-1,"b":140000000},"10":{"a":410000000,"b":380000000},"12":{"a":1600000000,"b":700000000}},"/items/maelstrom_plating":{"0":{"a":9200000,"b":9000000}},"/items/magic_coffee":{"0":{"a":780,"b":760}},"/items/magicians_cloth":{"0":{"a":7600000,"b":7400000}},"/items/magicians_hat":{"0":{"a":82000000,"b":72000000},"1":{"a":-1,"b":72000000},"2":{"a":-1,"b":72000000},"3":{"a":-1,"b":72000000},"4":{"a":-1,"b":74000000},"5":{"a":105000000,"b":84000000},"6":{"a":92000000,"b":82000000},"7":{"a":105000000,"b":100000000},"8":{"a":135000000,"b":125000000},"9":{"a":-1,"b":175000000},"10":{"a":310000000,"b":295000000},"11":{"a":-1,"b":400000000},"12":{"a":1150000000,"b":1050000000}},"/items/magnet":{"0":{"a":320000,"b":310000}},"/items/magnetic_gloves":{"0":{"a":3200000,"b":2900000},"2":{"a":-1,"b":320000},"3":{"a":4200000,"b":310000},"4":{"a":3300000,"b":1000000},"5":{"a":3800000,"b":3400000},"6":{"a":5400000,"b":-1},"7":{"a":7400000,"b":5800000},"8":{"a":12000000,"b":9400000},"9":{"a":19500000,"b":13500000},"10":{"a":33000000,"b":29000000},"11":{"a":-1,"b":300000},"12":{"a":125000000,"b":1050000},"20":{"a":-1,"b":2000000}},"/items/magnifying_glass":{"0":{"a":155000,"b":150000}},"/items/maim":{"0":{"a":145000,"b":140000}},"/items/mana_spring":{"0":{"a":115000,"b":110000}},"/items/manticore_shield":{"0":{"a":25500000,"b":23500000},"2":{"a":-1,"b":3600000},"3":{"a":-1,"b":3600000},"4":{"a":-1,"b":4200000},"5":{"a":26000000,"b":25000000},"7":{"a":35000000,"b":33000000},"8":{"a":48000000,"b":29000000},"10":{"a":120000000,"b":115000000},"11":{"a":230000000,"b":100000000},"12":{"a":470000000,"b":400000}},"/items/manticore_sting":{"0":{"a":2750000,"b":2700000}},"/items/marine_chaps":{"0":{"a":440000,"b":400000},"3":{"a":520000,"b":-1},"4":{"a":600000,"b":-1},"5":{"a":720000,"b":-1},"10":{"a":9000000,"b":-1},"11":{"a":6000000,"b":-1}},"/items/marine_scale":{"0":{"a":68000,"b":64000}},"/items/marine_tunic":{"0":{"a":520000,"b":480000},"5":{"a":1150000,"b":-1},"6":{"a":1150000,"b":-1},"9":{"a":3800000,"b":-1},"10":{"a":9000000,"b":-1}},"/items/marksman_bracers":{"0":{"a":92000000,"b":86000000},"1":{"a":-1,"b":9000000},"2":{"a":-1,"b":11000000},"3":{"a":-1,"b":17000000},"5":{"a":100000000,"b":92000000},"6":{"a":-1,"b":17000000},"7":{"a":110000000,"b":105000000},"8":{"a":145000000,"b":130000000},"10":{"a":370000000,"b":310000000},"11":{"a":-1,"b":29500000},"12":{"a":-1,"b":900000000},"15":{"a":-1,"b":13000000}},"/items/marksman_brooch":{"0":{"a":9200000,"b":9000000}},"/items/marsberry":{"0":{"a":110,"b":105}},"/items/marsberry_cake":{"0":{"a":900,"b":880}},"/items/marsberry_donut":{"0":{"a":800,"b":760}},"/items/medium_pouch":{"0":{"a":105000,"b":96000},"1":{"a":100000,"b":-1},"2":{"a":110000,"b":-1},"3":{"a":175000,"b":-1},"4":{"a":225000,"b":-1},"5":{"a":500000,"b":-1}},"/items/milk":{"0":{"a":54,"b":52}},"/items/milking_essence":{"0":{"a":180,"b":170}},"/items/milking_tea":{"0":{"a":470,"b":390}},"/items/minor_heal":{"0":{"a":4500,"b":3800}},"/items/mirror_of_protection":{"0":{"a":10500000,"b":10000000}},"/items/mooberry":{"0":{"a":110,"b":100}},"/items/mooberry_cake":{"0":{"a":780,"b":760}},"/items/mooberry_donut":{"0":{"a":520,"b":480}},"/items/moolong_tea_leaf":{"0":{"a":33,"b":32}},"/items/moonstone":{"0":{"a":52000,"b":50000}},"/items/natures_veil":{"0":{"a":620000,"b":600000}},"/items/necklace_of_efficiency":{"0":{"a":10000000,"b":9400000},"1":{"a":17500000,"b":2350000},"2":{"a":20500000,"b":11500000},"3":{"a":-1,"b":1450000},"4":{"a":-1,"b":35000000},"5":{"a":120000000,"b":90000000},"6":{"a":-1,"b":190000},"7":{"a":-1,"b":420000},"20":{"a":-1,"b":62000}},"/items/necklace_of_speed":{"0":{"a":13000000,"b":12000000},"1":{"a":16000000,"b":13500000},"2":{"a":21500000,"b":16500000},"3":{"a":30000000,"b":27500000},"4":{"a":58000000,"b":42000000},"5":{"a":100000000,"b":80000000},"6":{"a":-1,"b":235000},"10":{"a":-1,"b":300000000}},"/items/necklace_of_wisdom":{"0":{"a":9400000,"b":9200000},"1":{"a":12000000,"b":10000000},"2":{"a":16500000,"b":14000000},"3":{"a":-1,"b":22000000},"4":{"a":52000000,"b":30000000},"5":{"a":94000000,"b":54000000},"7":{"a":205000000,"b":110000000},"8":{"a":350000000,"b":260000000},"9":{"a":700000000,"b":800000},"10":{"a":-1,"b":300000}},"/items/orange":{"0":{"a":7,"b":6}},"/items/orange_gummy":{"0":{"a":31,"b":28}},"/items/orange_key_fragment":{"0":{"a":1050000,"b":1000000}},"/items/orange_yogurt":{"0":{"a":470,"b":420}},"/items/panda_fluff":{"0":{"a":80000,"b":78000}},"/items/panda_gloves":{"0":{"a":500000,"b":490000},"1":{"a":500000,"b":-1},"2":{"a":540000,"b":-1},"3":{"a":620000,"b":-1},"4":{"a":780000,"b":-1},"5":{"a":760000,"b":420000},"6":{"a":1000000,"b":-1},"7":{"a":2500000,"b":-1},"8":{"a":4800000,"b":2500000},"9":{"a":9400000,"b":980000},"10":{"a":9600000,"b":8200000},"11":{"a":15000000,"b":1900000},"12":{"a":29000000,"b":-1}},"/items/peach":{"0":{"a":100,"b":94}},"/items/peach_gummy":{"0":{"a":400,"b":370}},"/items/peach_yogurt":{"0":{"a":660,"b":640}},"/items/pearl":{"0":{"a":14000,"b":13500}},"/items/penetrating_shot":{"0":{"a":215000,"b":210000}},"/items/penetrating_strike":{"0":{"a":45000,"b":44000}},"/items/pestilent_shot":{"0":{"a":42000,"b":40000}},"/items/philosophers_earrings":{"1":{"a":-1,"b":90000000},"2":{"a":700000000,"b":-1},"3":{"a":-1,"b":41000000},"5":{"a":940000000,"b":900000000},"7":{"a":1500000000,"b":1100000000},"10":{"a":-1,"b":64000000}},"/items/philosophers_necklace":{"0":{"a":-1,"b":600000000},"1":{"a":-1,"b":450000000},"2":{"a":-1,"b":560000000},"3":{"a":720000000,"b":580000000},"4":{"a":-1,"b":660000000},"5":{"a":1050000000,"b":1000000000},"6":{"a":-1,"b":1150000000},"7":{"a":1750000000,"b":1350000000},"8":{"a":-1,"b":88000000},"10":{"a":5800000000,"b":900000000},"11":{"a":-1,"b":31000000},"20":{"a":-1,"b":410000000}},"/items/philosophers_ring":{"0":{"a":-1,"b":200000000},"1":{"a":-1,"b":145000000},"2":{"a":-1,"b":17000000},"4":{"a":-1,"b":540000000},"5":{"a":940000000,"b":920000000},"6":{"a":-1,"b":1100000000},"7":{"a":1500000000,"b":1350000000},"10":{"a":-1,"b":12000000}},"/items/philosophers_stone":{"0":{"a":580000000,"b":560000000}},"/items/pincer_gloves":{"0":{"a":23500,"b":22000},"1":{"a":29500,"b":28500},"2":{"a":34000,"b":16000},"3":{"a":60000,"b":-1},"4":{"a":110000,"b":28000},"5":{"a":100000,"b":43000},"6":{"a":270000,"b":60000},"7":{"a":450000,"b":-1},"8":{"a":1150000,"b":-1},"10":{"a":1600000,"b":1250000},"12":{"a":6800000,"b":-1}},"/items/pirate_chest_key":{"0":{"a":6000000,"b":5800000}},"/items/pirate_entry_key":{"0":{"a":540000,"b":520000}},"/items/pirate_essence":{"0":{"a":2050,"b":2000}},"/items/plum":{"0":{"a":78,"b":76}},"/items/plum_gummy":{"0":{"a":190,"b":185}},"/items/plum_yogurt":{"0":{"a":760,"b":620}},"/items/poke":{"0":{"a":3200,"b":3000}},"/items/polar_bear_fluff":{"0":{"a":80000,"b":78000}},"/items/polar_bear_shoes":{"0":{"a":450000,"b":370000},"1":{"a":500000,"b":-1},"4":{"a":600000,"b":-1},"5":{"a":680000,"b":580000},"6":{"a":1150000,"b":620000},"9":{"a":980000000,"b":-1},"10":{"a":11500000,"b":10500000},"11":{"a":-1,"b":15000000},"12":{"a":41000000,"b":24500000},"13":{"a":480000000,"b":-1}},"/items/power_coffee":{"0":{"a":720,"b":700}},"/items/precision":{"0":{"a":60000,"b":58000}},"/items/prime_catalyst":{"0":{"a":105000,"b":100000}},"/items/processing_tea":{"0":{"a":1700,"b":1600}},"/items/provoke":{"0":{"a":42000,"b":41000}},"/items/puncture":{"0":{"a":150000,"b":145000}},"/items/purple_key_fragment":{"0":{"a":720000,"b":700000}},"/items/purpleheart_bow":{"0":{"a":120000,"b":105000},"1":{"a":540000,"b":-1},"3":{"a":105000,"b":-1},"5":{"a":600000,"b":-1}},"/items/purpleheart_crossbow":{"0":{"a":78000,"b":72000},"3":{"a":100000,"b":6600},"4":{"a":240000,"b":-1},"5":{"a":255000,"b":105000},"7":{"a":400000,"b":-1}},"/items/purpleheart_fire_staff":{"0":{"a":84000,"b":74000},"1":{"a":78000,"b":-1},"2":{"a":90000,"b":-1},"3":{"a":150000,"b":-1},"4":{"a":195000,"b":-1},"5":{"a":200000,"b":66000},"8":{"a":1600000,"b":-1}},"/items/purpleheart_log":{"0":{"a":62,"b":58}},"/items/purpleheart_lumber":{"0":{"a":740,"b":720}},"/items/purpleheart_nature_staff":{"0":{"a":84000,"b":74000},"1":{"a":80000,"b":-1},"2":{"a":-1,"b":6600},"3":{"a":90000,"b":6600},"4":{"a":160000,"b":6600},"5":{"a":275000,"b":6600},"7":{"a":9800000,"b":-1}},"/items/purpleheart_shield":{"0":{"a":56000,"b":38000},"2":{"a":94000,"b":-1},"3":{"a":98000,"b":-1},"4":{"a":125000,"b":-1},"5":{"a":190000,"b":-1}},"/items/purpleheart_water_staff":{"0":{"a":94000,"b":74000},"1":{"a":120000,"b":-1},"2":{"a":170000,"b":-1}},"/items/quick_aid":{"0":{"a":245000,"b":240000}},"/items/quick_shot":{"0":{"a":3200,"b":3100}},"/items/radiant_boots":{"0":{"a":135000,"b":125000},"1":{"a":210000,"b":-1},"2":{"a":200000,"b":-1},"3":{"a":310000,"b":-1},"5":{"a":1200000,"b":250000},"6":{"a":2950000,"b":-1},"7":{"a":-1,"b":2000000}},"/items/radiant_fabric":{"0":{"a":2100,"b":2050}},"/items/radiant_fiber":{"0":{"a":450,"b":430}},"/items/radiant_gloves":{"0":{"a":145000,"b":130000},"2":{"a":205000,"b":-1},"3":{"a":230000,"b":-1},"4":{"a":430000,"b":-1},"5":{"a":660000,"b":500000},"6":{"a":1300000,"b":-1},"7":{"a":9600000,"b":2000000},"10":{"a":175000000,"b":-1}},"/items/radiant_hat":{"0":{"a":290000,"b":285000},"1":{"a":330000,"b":200000},"2":{"a":350000,"b":230000},"3":{"a":440000,"b":310000},"4":{"a":620000,"b":-1},"5":{"a":660000,"b":410000},"6":{"a":3000000,"b":800000},"7":{"a":-1,"b":2400000},"8":{"a":8400000,"b":-1},"9":{"a":-1,"b":21000000},"10":{"a":40000000,"b":15000000}},"/items/radiant_robe_bottoms":{"0":{"a":400000,"b":370000},"2":{"a":660000,"b":110000},"3":{"a":840000,"b":-1},"4":{"a":1100000,"b":760000},"5":{"a":1650000,"b":1000000},"7":{"a":-1,"b":2000000},"8":{"a":9000000,"b":-1},"10":{"a":60000000,"b":-1},"12":{"a":120000000,"b":-1}},"/items/radiant_robe_top":{"0":{"a":450000,"b":440000},"1":{"a":-1,"b":120000},"2":{"a":520000,"b":105000},"3":{"a":680000,"b":-1},"4":{"a":1000000,"b":-1},"5":{"a":1650000,"b":720000},"7":{"a":-1,"b":2000000},"8":{"a":15000000,"b":-1},"9":{"a":22000000,"b":-1},"10":{"a":31000000,"b":-1},"12":{"a":110000000,"b":300000}},"/items/rain_of_arrows":{"0":{"a":160000,"b":150000}},"/items/rainbow_alembic":{"0":{"a":220000,"b":190000},"1":{"a":300000,"b":-1},"2":{"a":310000,"b":-1},"3":{"a":350000,"b":100000},"4":{"a":680000,"b":-1},"5":{"a":560000,"b":330000},"7":{"a":-1,"b":700000},"8":{"a":12500000,"b":-1},"10":{"a":8800000000,"b":-1}},"/items/rainbow_boots":{"0":{"a":100000,"b":-1},"1":{"a":115000,"b":-1},"2":{"a":195000,"b":-1},"3":{"a":250000,"b":-1},"5":{"a":310000,"b":82000}},"/items/rainbow_brush":{"0":{"a":195000,"b":165000},"1":{"a":265000,"b":-1},"2":{"a":275000,"b":-1},"3":{"a":300000,"b":100000},"4":{"a":660000,"b":-1},"5":{"a":700000,"b":580000},"6":{"a":1600000,"b":25000},"7":{"a":5800000,"b":155000},"8":{"a":-1,"b":1200000}},"/items/rainbow_buckler":{"0":{"a":180000,"b":155000},"5":{"a":1950000,"b":115000}},"/items/rainbow_bulwark":{"0":{"a":200000,"b":180000},"1":{"a":205000,"b":-1},"2":{"a":200000,"b":-1},"3":{"a":860000,"b":-1},"5":{"a":960000,"b":125000}},"/items/rainbow_cheese":{"0":{"a":1200,"b":1150}},"/items/rainbow_chisel":{"0":{"a":195000,"b":170000},"1":{"a":260000,"b":-1},"2":{"a":260000,"b":-1},"3":{"a":420000,"b":185000},"4":{"a":580000,"b":-1},"5":{"a":640000,"b":400000},"6":{"a":980000,"b":-1}},"/items/rainbow_enhancer":{"0":{"a":225000,"b":200000},"1":{"a":230000,"b":-1},"2":{"a":245000,"b":-1},"3":{"a":-1,"b":100000},"4":{"a":580000,"b":25000},"5":{"a":880000,"b":370000},"6":{"a":1900000,"b":-1},"8":{"a":12500000,"b":-1},"9":{"a":14000000,"b":-1}},"/items/rainbow_gauntlets":{"0":{"a":130000,"b":125000},"1":{"a":10000000,"b":-1},"2":{"a":225000,"b":-1},"3":{"a":300000,"b":-1},"5":{"a":490000,"b":-1}},"/items/rainbow_hammer":{"0":{"a":195000,"b":155000},"1":{"a":225000,"b":-1},"2":{"a":340000,"b":25000},"3":{"a":350000,"b":100000},"4":{"a":-1,"b":25000},"5":{"a":880000,"b":540000},"6":{"a":2150000,"b":490000}},"/items/rainbow_hatchet":{"0":{"a":185000,"b":180000},"1":{"a":235000,"b":-1},"2":{"a":-1,"b":25000},"3":{"a":-1,"b":100000},"5":{"a":1050000,"b":680000},"6":{"a":-1,"b":25000},"7":{"a":-1,"b":780000}},"/items/rainbow_helmet":{"0":{"a":165000,"b":150000},"1":{"a":175000,"b":18000},"2":{"a":210000,"b":18000},"3":{"a":-1,"b":18000},"5":{"a":780000,"b":230000},"6":{"a":-1,"b":200000}},"/items/rainbow_mace":{"0":{"a":245000,"b":220000},"1":{"a":140000,"b":-1},"2":{"a":140000,"b":-1},"3":{"a":275000,"b":-1},"4":{"a":310000,"b":-1},"5":{"a":390000,"b":155000},"6":{"a":500000,"b":-1}},"/items/rainbow_milk":{"0":{"a":180,"b":175}},"/items/rainbow_needle":{"0":{"a":180000,"b":175000},"1":{"a":190000,"b":-1},"2":{"a":240000,"b":-1},"3":{"a":400000,"b":100000},"4":{"a":740000,"b":130000},"5":{"a":1350000,"b":520000}},"/items/rainbow_plate_body":{"0":{"a":235000,"b":230000},"2":{"a":290000,"b":-1},"3":{"a":295000,"b":-1},"4":{"a":1650000,"b":-1},"5":{"a":640000,"b":225000},"6":{"a":2700000,"b":320000},"10":{"a":56000000,"b":430000}},"/items/rainbow_plate_legs":{"0":{"a":255000,"b":190000},"1":{"a":270000,"b":-1},"3":{"a":380000,"b":-1},"4":{"a":-1,"b":225000},"5":{"a":580000,"b":235000}},"/items/rainbow_pot":{"0":{"a":200000,"b":190000},"2":{"a":230000,"b":180000},"3":{"a":340000,"b":100000},"4":{"a":320000,"b":25000},"5":{"a":580000,"b":210000},"6":{"a":-1,"b":25500}},"/items/rainbow_shears":{"0":{"a":190000,"b":175000},"2":{"a":250000,"b":-1},"3":{"a":380000,"b":100000},"4":{"a":600000,"b":-1},"5":{"a":800000,"b":300000},"7":{"a":-1,"b":700000}},"/items/rainbow_spatula":{"0":{"a":295000,"b":185000},"2":{"a":220000,"b":-1},"3":{"a":260000,"b":100000},"4":{"a":390000,"b":28500},"5":{"a":680000,"b":480000},"6":{"a":980000,"b":25500}},"/items/rainbow_spear":{"0":{"a":320000,"b":230000},"1":{"a":225000,"b":-1},"2":{"a":350000,"b":-1},"3":{"a":1000000,"b":-1},"4":{"a":500000,"b":-1},"5":{"a":700000,"b":450000}},"/items/rainbow_sword":{"0":{"a":295000,"b":265000},"1":{"a":280000,"b":-1},"3":{"a":295000,"b":-1},"4":{"a":310000,"b":-1},"5":{"a":450000,"b":195000},"6":{"a":1850000,"b":-1},"10":{"a":20000000,"b":-1},"20":{"a":-1,"b":700000}},"/items/ranged_coffee":{"0":{"a":760,"b":740}},"/items/ranger_necklace":{"0":{"a":9600000,"b":9000000},"1":{"a":13000000,"b":98000},"2":{"a":22500000,"b":1250000},"3":{"a":29000000,"b":25500000},"5":{"a":78000000,"b":-1},"6":{"a":-1,"b":350000}},"/items/red_culinary_hat":{"0":{"a":5200000,"b":4900000},"3":{"a":-1,"b":3100000},"5":{"a":6400000,"b":5600000},"6":{"a":7800000,"b":6200000},"7":{"a":13000000,"b":10000000},"8":{"a":16000000,"b":14500000},"9":{"a":34000000,"b":-1},"10":{"a":52000000,"b":47000000},"11":{"a":-1,"b":50000000},"12":{"a":150000000,"b":-1}},"/items/red_panda_fluff":{"0":{"a":520000,"b":500000}},"/items/red_tea_leaf":{"0":{"a":49,"b":48}},"/items/redwood_bow":{"0":{"a":310000,"b":295000},"1":{"a":290000,"b":43000},"2":{"a":-1,"b":43000},"3":{"a":620000,"b":-1},"5":{"a":860000,"b":43000},"7":{"a":5000000,"b":-1}},"/items/redwood_crossbow":{"0":{"a":265000,"b":230000},"1":{"a":240000,"b":-1},"2":{"a":250000,"b":-1},"3":{"a":270000,"b":-1},"4":{"a":310000,"b":-1},"5":{"a":410000,"b":50000},"6":{"a":1000000,"b":-1},"7":{"a":2150000,"b":170000},"10":{"a":24000000,"b":-1}},"/items/redwood_fire_staff":{"0":{"a":255000,"b":240000},"1":{"a":280000,"b":-1},"2":{"a":235000,"b":-1},"3":{"a":300000,"b":-1},"4":{"a":410000,"b":-1},"5":{"a":500000,"b":-1},"6":{"a":1300000,"b":-1}},"/items/redwood_log":{"0":{"a":40,"b":37}},"/items/redwood_lumber":{"0":{"a":980,"b":960}},"/items/redwood_nature_staff":{"0":{"a":250000,"b":205000},"1":{"a":275000,"b":100000},"2":{"a":275000,"b":100000},"3":{"a":320000,"b":100000},"4":{"a":360000,"b":-1},"5":{"a":480000,"b":98000}},"/items/redwood_shield":{"0":{"a":135000,"b":120000},"2":{"a":155000,"b":-1},"3":{"a":160000,"b":-1},"4":{"a":210000,"b":-1},"5":{"a":210000,"b":82000}},"/items/redwood_water_staff":{"0":{"a":235000,"b":210000},"1":{"a":250000,"b":-1},"5":{"a":620000,"b":-1},"6":{"a":840000,"b":-1}},"/items/regal_jewel":{"0":{"a":12000000,"b":11500000}},"/items/regal_sword":{"0":{"a":265000000,"b":250000000},"4":{"a":-1,"b":120000000},"5":{"a":-1,"b":260000000},"7":{"a":300000000,"b":280000000},"8":{"a":-1,"b":320000000},"9":{"a":-1,"b":50000000},"10":{"a":-1,"b":580000000},"12":{"a":1900000000,"b":1300000000}},"/items/rejuvenate":{"0":{"a":390000,"b":380000}},"/items/reptile_boots":{"0":{"a":9400,"b":8000},"2":{"a":29500,"b":-1},"4":{"a":68000,"b":-1}},"/items/reptile_bracers":{"0":{"a":9800,"b":8800},"1":{"a":25000,"b":-1},"2":{"a":90000,"b":-1},"3":{"a":180000,"b":-1},"5":{"a":185000,"b":64000}},"/items/reptile_chaps":{"0":{"a":16500,"b":13000},"2":{"a":94000,"b":-1},"3":{"a":10000000,"b":-1},"4":{"a":100000,"b":-1},"5":{"a":94000,"b":-1}},"/items/reptile_hide":{"0":{"a":13,"b":9}},"/items/reptile_hood":{"0":{"a":11500,"b":9000},"2":{"a":88000,"b":-1},"3":{"a":100000,"b":-1},"4":{"a":100000,"b":-1},"5":{"a":245000,"b":-1},"7":{"a":500000,"b":-1}},"/items/reptile_leather":{"0":{"a":400,"b":380}},"/items/reptile_tunic":{"0":{"a":15500,"b":12500},"1":{"a":110000,"b":-1},"2":{"a":120000,"b":-1},"3":{"a":215000,"b":-1},"5":{"a":-1,"b":70000}},"/items/revenant_anima":{"0":{"a":1100000,"b":1050000}},"/items/revenant_chaps":{"0":{"a":8200000,"b":6200000},"1":{"a":-1,"b":1150000},"2":{"a":-1,"b":920000},"3":{"a":-1,"b":1500000},"4":{"a":-1,"b":1700000},"5":{"a":9000000,"b":8400000},"6":{"a":10500000,"b":9400000},"7":{"a":17500000,"b":15500000},"8":{"a":29000000,"b":1950000},"10":{"a":62000000,"b":56000000},"12":{"a":130000000,"b":-1}},"/items/revenant_tunic":{"0":{"a":9800000,"b":5000000},"3":{"a":-1,"b":1150000},"5":{"a":9600000,"b":8800000},"6":{"a":13000000,"b":7600000},"7":{"a":24500000,"b":21000000},"8":{"a":30000000,"b":-1},"9":{"a":-1,"b":25500000},"10":{"a":64000000,"b":-1},"11":{"a":94000000,"b":-1},"12":{"a":105000000,"b":-1}},"/items/revive":{"0":{"a":1200000,"b":1100000}},"/items/ring_of_armor":{"0":{"a":6000000,"b":4200000},"1":{"a":-1,"b":230000},"3":{"a":-1,"b":270000},"4":{"a":50000000,"b":-1}},"/items/ring_of_critical_strike":{"0":{"a":7800000,"b":6800000},"1":{"a":9600000,"b":7800000},"2":{"a":13000000,"b":9400000},"3":{"a":19000000,"b":18000000},"4":{"a":-1,"b":20000000},"5":{"a":72000000,"b":62000000},"10":{"a":-1,"b":125000}},"/items/ring_of_essence_find":{"0":{"a":5400000,"b":5000000},"1":{"a":9800000,"b":20000},"2":{"a":11500000,"b":-1},"3":{"a":23000000,"b":310000}},"/items/ring_of_gathering":{"0":{"a":5400000,"b":4500000},"1":{"a":9200000,"b":210000},"2":{"a":-1,"b":205000},"4":{"a":36000000,"b":20000000},"5":{"a":-1,"b":40000000},"7":{"a":-1,"b":100000}},"/items/ring_of_rare_find":{"0":{"a":6800000,"b":6400000},"1":{"a":9000000,"b":7200000},"2":{"a":12000000,"b":9800000},"3":{"a":17000000,"b":13500000},"4":{"a":39000000,"b":30000000},"5":{"a":84000000,"b":50000000},"6":{"a":-1,"b":4400000},"7":{"a":-1,"b":120000000},"8":{"a":-1,"b":41000},"9":{"a":-1,"b":41000},"10":{"a":-1,"b":100000000},"20":{"a":-1,"b":420000}},"/items/ring_of_regeneration":{"0":{"a":6000000,"b":5800000},"1":{"a":-1,"b":6200000},"2":{"a":12000000,"b":9600000},"3":{"a":18500000,"b":16000000},"4":{"a":31000000,"b":28500000},"5":{"a":60000000,"b":58000000},"6":{"a":105000000,"b":86000000},"7":{"a":195000000,"b":165000000},"8":{"a":295000000,"b":30000000}},"/items/ring_of_resistance":{"0":{"a":5600000,"b":4900000},"1":{"a":8000000,"b":100000},"5":{"a":60000000,"b":-1}},"/items/rippling_trident":{"0":{"a":290000000,"b":280000000},"5":{"a":320000000,"b":200000000},"7":{"a":-1,"b":330000000},"8":{"a":430000000,"b":370000000},"10":{"a":680000000,"b":640000000},"11":{"a":1100000000,"b":-1},"12":{"a":2050000000,"b":1750000000}},"/items/robusta_coffee_bean":{"0":{"a":215,"b":205}},"/items/rough_boots":{"0":{"a":2500,"b":2450},"1":{"a":250000,"b":-1},"4":{"a":49000,"b":-1},"5":{"a":50000,"b":-1}},"/items/rough_bracers":{"0":{"a":2500,"b":2400},"1":{"a":47000,"b":-1},"2":{"a":74000,"b":-1},"5":{"a":100000,"b":-1},"12":{"a":-1,"b":2400000},"13":{"a":-1,"b":4800000},"14":{"a":-1,"b":8000000}},"/items/rough_chaps":{"0":{"a":4300,"b":3800},"1":{"a":30000,"b":-1},"3":{"a":98000,"b":-1}},"/items/rough_hide":{"0":{"a":46,"b":44}},"/items/rough_hood":{"0":{"a":3000,"b":2450},"1":{"a":56000,"b":-1},"3":{"a":100000,"b":-1},"4":{"a":6000000,"b":6400}},"/items/rough_leather":{"0":{"a":295,"b":285}},"/items/rough_tunic":{"0":{"a":4200,"b":3800},"1":{"a":100000,"b":-1},"2":{"a":130000,"b":-1},"3":{"a":48000,"b":-1},"5":{"a":140000,"b":-1},"8":{"a":500000,"b":-1}},"/items/royal_cloth":{"0":{"a":8200000,"b":8000000}},"/items/royal_fire_robe_bottoms":{"0":{"a":78000000,"b":64000000},"1":{"a":-1,"b":25000000},"2":{"a":-1,"b":5000000},"5":{"a":78000000,"b":74000000},"6":{"a":92000000,"b":-1},"7":{"a":98000000,"b":96000000},"8":{"a":170000000,"b":100000000},"9":{"a":-1,"b":215000000},"10":{"a":-1,"b":330000000},"12":{"a":1350000000,"b":1100000000}},"/items/royal_fire_robe_top":{"0":{"a":94000000,"b":82000000},"5":{"a":96000000,"b":90000000},"6":{"a":105000000,"b":90000000},"7":{"a":120000000,"b":115000000},"8":{"a":-1,"b":50000000},"9":{"a":-1,"b":245000000},"10":{"a":430000000,"b":390000000},"12":{"a":1450000000,"b":1350000000}},"/items/royal_nature_robe_bottoms":{"0":{"a":68000000,"b":66000000},"5":{"a":78000000,"b":70000000},"6":{"a":84000000,"b":-1},"7":{"a":96000000,"b":90000000},"8":{"a":140000000,"b":120000000},"9":{"a":215000000,"b":4000000},"10":{"a":370000000,"b":350000000},"12":{"a":1350000000,"b":1150000000}},"/items/royal_nature_robe_top":{"0":{"a":86000000,"b":76000000},"5":{"a":-1,"b":80000000},"6":{"a":105000000,"b":80000000},"7":{"a":115000000,"b":110000000},"8":{"a":160000000,"b":140000000},"9":{"a":-1,"b":4500000},"10":{"a":400000000,"b":360000000},"12":{"a":1600000000,"b":1250000000}},"/items/royal_water_robe_bottoms":{"0":{"a":74000000,"b":62000000},"1":{"a":72000000,"b":-1},"4":{"a":-1,"b":8400000},"5":{"a":90000000,"b":70000000},"6":{"a":84000000,"b":76000000},"7":{"a":98000000,"b":90000000},"8":{"a":135000000,"b":35000000},"10":{"a":380000000,"b":320000000},"12":{"a":1300000000,"b":-1}},"/items/royal_water_robe_top":{"0":{"a":88000000,"b":82000000},"1":{"a":-1,"b":11000000},"2":{"a":-1,"b":9800000},"4":{"a":-1,"b":9800000},"5":{"a":96000000,"b":84000000},"6":{"a":105000000,"b":86000000},"7":{"a":120000000,"b":115000000},"8":{"a":175000000,"b":125000000},"10":{"a":400000000,"b":390000000},"11":{"a":700000000,"b":-1},"12":{"a":1450000000,"b":1150000000}},"/items/scratch":{"0":{"a":3200,"b":3100}},"/items/shard_of_protection":{"0":{"a":60000,"b":58000}},"/items/shield_bash":{"0":{"a":40000,"b":39000}},"/items/shoebill_feather":{"0":{"a":66000,"b":64000}},"/items/shoebill_shoes":{"0":{"a":520000,"b":480000},"1":{"a":-1,"b":290000},"4":{"a":620000,"b":-1},"5":{"a":800000,"b":300000},"6":{"a":1950000,"b":-1},"7":{"a":2000000,"b":-1},"8":{"a":4800000,"b":-1},"9":{"a":5200000,"b":-1},"10":{"a":7800000,"b":7200000},"12":{"a":31000000,"b":16000000},"14":{"a":160000000,"b":50000000},"20":{"a":-1,"b":32000}},"/items/sighted_bracers":{"0":{"a":185000,"b":165000},"1":{"a":200000,"b":-1},"2":{"a":200000,"b":-1},"3":{"a":190000,"b":-1},"4":{"a":230000,"b":-1},"5":{"a":230000,"b":160000},"6":{"a":500000,"b":280000},"7":{"a":1350000,"b":760000},"8":{"a":2100000,"b":1650000},"9":{"a":4800000,"b":2300000},"10":{"a":6600000,"b":5800000},"11":{"a":16500000,"b":1050000},"12":{"a":27500000,"b":-1}},"/items/silencing_shot":{"0":{"a":145000,"b":140000}},"/items/silk_boots":{"0":{"a":47000,"b":46000},"1":{"a":82000,"b":-1},"2":{"a":76000,"b":-1},"3":{"a":195000,"b":50000},"4":{"a":340000,"b":-1},"5":{"a":380000,"b":100000},"6":{"a":580000,"b":-1},"7":{"a":600000,"b":-1},"10":{"a":25000000,"b":-1}},"/items/silk_fabric":{"0":{"a":1350,"b":1250}},"/items/silk_gloves":{"0":{"a":49000,"b":45000},"1":{"a":60000,"b":-1},"2":{"a":98000,"b":-1},"3":{"a":170000,"b":50000},"4":{"a":450000,"b":-1},"5":{"a":580000,"b":100000},"6":{"a":660000,"b":-1},"7":{"a":1200000,"b":-1},"10":{"a":2500000,"b":330000}},"/items/silk_hat":{"0":{"a":94000,"b":92000},"1":{"a":100000,"b":-1},"2":{"a":115000,"b":-1},"3":{"a":150000,"b":50000},"4":{"a":280000,"b":-1},"5":{"a":450000,"b":130000},"6":{"a":3500000,"b":-1},"7":{"a":5000000,"b":-1}},"/items/silk_robe_bottoms":{"0":{"a":140000,"b":130000},"1":{"a":150000,"b":-1},"2":{"a":200000,"b":-1},"3":{"a":185000,"b":-1},"4":{"a":300000,"b":-1},"5":{"a":490000,"b":-1},"6":{"a":600000,"b":-1},"7":{"a":680000,"b":-1},"8":{"a":7600000,"b":-1}},"/items/silk_robe_top":{"0":{"a":160000,"b":150000},"1":{"a":160000,"b":-1},"2":{"a":160000,"b":-1},"3":{"a":195000,"b":-1},"4":{"a":280000,"b":-1},"5":{"a":280000,"b":-1},"6":{"a":300000,"b":-1},"7":{"a":6600000,"b":-1}},"/items/sinister_chest_key":{"0":{"a":4200000,"b":4100000}},"/items/sinister_entry_key":{"0":{"a":390000,"b":380000}},"/items/sinister_essence":{"0":{"a":920,"b":900}},"/items/smack":{"0":{"a":3200,"b":3100}},"/items/small_pouch":{"0":{"a":15000,"b":14000},"1":{"a":21000,"b":-1},"2":{"a":50000,"b":-1},"3":{"a":130000,"b":-1},"4":{"a":100000,"b":-1},"5":{"a":115000,"b":-1},"6":{"a":700000,"b":-1}},"/items/smoke_burst":{"0":{"a":80000,"b":76000}},"/items/snail_shell":{"0":{"a":9400,"b":9000}},"/items/snail_shell_helmet":{"0":{"a":25500,"b":22500},"1":{"a":25500,"b":-1},"3":{"a":32000,"b":-1},"4":{"a":58000,"b":-1},"5":{"a":84000,"b":-1},"7":{"a":1000000,"b":-1},"8":{"a":2700000,"b":-1},"9":{"a":3000000,"b":-1},"10":{"a":5400000,"b":960000}},"/items/snake_fang":{"0":{"a":3100,"b":3000}},"/items/snake_fang_dirk":{"0":{"a":56000,"b":15000},"1":{"a":48000,"b":10000},"2":{"a":9600000,"b":-1},"3":{"a":31000,"b":-1},"5":{"a":84000,"b":27500},"6":{"a":130000,"b":-1},"7":{"a":620000,"b":-1},"8":{"a":740000,"b":-1},"9":{"a":2450000,"b":-1},"10":{"a":1000000,"b":760000},"11":{"a":94000000,"b":-1},"13":{"a":96000000,"b":5800000},"15":{"a":500000000,"b":-1},"16":{"a":2000000000,"b":-1}},"/items/sorcerer_boots":{"0":{"a":560000,"b":540000},"1":{"a":600000,"b":105000},"2":{"a":620000,"b":105000},"3":{"a":660000,"b":105000},"4":{"a":720000,"b":580000},"5":{"a":900000,"b":880000},"6":{"a":1400000,"b":1250000},"7":{"a":2200000,"b":2150000},"8":{"a":4400000,"b":3900000},"9":{"a":8000000,"b":6600000},"10":{"a":13000000,"b":12000000},"11":{"a":24000000,"b":21000000},"12":{"a":46000000,"b":44000000},"13":{"a":94000000,"b":-1},"14":{"a":185000000,"b":170000000},"15":{"a":390000000,"b":-1},"16":{"a":1100000000,"b":4400000},"17":{"a":-1,"b":1000000000}},"/items/sorcerer_essence":{"0":{"a":130,"b":125}},"/items/sorcerers_sole":{"0":{"a":110000,"b":105000}},"/items/soul_fragment":{"0":{"a":640000,"b":620000}},"/items/soul_hunter_crossbow":{"0":{"a":12500000,"b":11500000},"3":{"a":15500000,"b":4200000},"4":{"a":12500000,"b":-1},"5":{"a":13000000,"b":11500000},"6":{"a":14500000,"b":1050000},"7":{"a":17500000,"b":6000000},"8":{"a":22500000,"b":17500000},"9":{"a":48000000,"b":20500000},"10":{"a":56000000,"b":52000000},"12":{"a":-1,"b":190000000}},"/items/spaceberry":{"0":{"a":185,"b":180}},"/items/spaceberry_cake":{"0":{"a":1200,"b":1150}},"/items/spaceberry_donut":{"0":{"a":960,"b":940}},"/items/spacia_coffee_bean":{"0":{"a":540,"b":500}},"/items/speed_aura":{"0":{"a":2650000,"b":2550000}},"/items/spike_shell":{"0":{"a":56000,"b":48000}},"/items/spiked_bulwark":{"0":{"a":12000000,"b":10500000},"1":{"a":12500000,"b":1000000},"5":{"a":14500000,"b":13000000},"6":{"a":19000000,"b":-1},"7":{"a":-1,"b":17500000},"8":{"a":48000000,"b":2600000},"10":{"a":84000000,"b":40000000},"12":{"a":-1,"b":2900000}},"/items/stalactite_shard":{"0":{"a":640000,"b":620000}},"/items/stalactite_spear":{"0":{"a":13000000,"b":10500000},"5":{"a":14500000,"b":12500000},"10":{"a":60000000,"b":-1},"11":{"a":130000000,"b":12500000},"12":{"a":230000000,"b":-1},"14":{"a":500000000,"b":50000000}},"/items/stamina_coffee":{"0":{"a":430,"b":410}},"/items/star_fragment":{"0":{"a":11500,"b":11000}},"/items/star_fruit":{"0":{"a":360,"b":350}},"/items/star_fruit_gummy":{"0":{"a":960,"b":940}},"/items/star_fruit_yogurt":{"0":{"a":1150,"b":1100}},"/items/steady_shot":{"0":{"a":145000,"b":140000}},"/items/stone_key_fragment":{"0":{"a":1900000,"b":1850000}},"/items/strawberry":{"0":{"a":96,"b":94}},"/items/strawberry_cake":{"0":{"a":640,"b":620}},"/items/strawberry_donut":{"0":{"a":460,"b":420}},"/items/stunning_blow":{"0":{"a":145000,"b":140000}},"/items/sugar":{"0":{"a":11,"b":10}},"/items/sundering_crossbow":{"0":{"a":270000000,"b":250000000},"1":{"a":-1,"b":220000000},"2":{"a":-1,"b":220000000},"3":{"a":-1,"b":225000000},"4":{"a":-1,"b":225000000},"5":{"a":275000000,"b":245000000},"6":{"a":-1,"b":240000000},"7":{"a":300000000,"b":295000000},"8":{"a":370000000,"b":320000000},"9":{"a":-1,"b":380000000},"10":{"a":640000000,"b":620000000},"11":{"a":-1,"b":760000000},"12":{"a":1850000000,"b":1800000000},"13":{"a":-1,"b":1000000000},"14":{"a":-1,"b":2400000000},"15":{"a":-1,"b":20000000},"16":{"a":-1,"b":10000000},"17":{"a":-1,"b":10000000}},"/items/sundering_jewel":{"0":{"a":12000000,"b":11500000}},"/items/sunstone":{"0":{"a":520000,"b":500000}},"/items/super_alchemy_tea":{"0":{"a":3100,"b":3000}},"/items/super_attack_coffee":{"0":{"a":3300,"b":2950}},"/items/super_brewing_tea":{"0":{"a":2800,"b":2750}},"/items/super_cheesesmithing_tea":{"0":{"a":4100,"b":4000}},"/items/super_cooking_tea":{"0":{"a":2800,"b":2750}},"/items/super_crafting_tea":{"0":{"a":4200,"b":3700}},"/items/super_defense_coffee":{"0":{"a":2850,"b":2800}},"/items/super_enhancing_tea":{"0":{"a":4100,"b":4000}},"/items/super_foraging_tea":{"0":{"a":2050,"b":1850}},"/items/super_intelligence_coffee":{"0":{"a":2100,"b":2000}},"/items/super_magic_coffee":{"0":{"a":4000,"b":3900}},"/items/super_milking_tea":{"0":{"a":2050,"b":1850}},"/items/super_power_coffee":{"0":{"a":3800,"b":3700}},"/items/super_ranged_coffee":{"0":{"a":3900,"b":3800}},"/items/super_stamina_coffee":{"0":{"a":2150,"b":2100}},"/items/super_tailoring_tea":{"0":{"a":4200,"b":4100}},"/items/super_woodcutting_tea":{"0":{"a":2350,"b":2150}},"/items/swamp_essence":{"0":{"a":27,"b":25}},"/items/sweep":{"0":{"a":29000,"b":28000}},"/items/swiftness_coffee":{"0":{"a":1850,"b":1800}},"/items/sylvan_aura":{"0":{"a":2750000,"b":2600000}},"/items/tailoring_essence":{"0":{"a":150,"b":145}},"/items/tailoring_tea":{"0":{"a":640,"b":620}},"/items/tailors_bottoms":{"0":{"a":250000000,"b":82000000},"5":{"a":170000000,"b":140000000},"6":{"a":175000000,"b":-1},"7":{"a":190000000,"b":-1},"8":{"a":225000000,"b":-1}},"/items/tailors_top":{"0":{"a":-1,"b":50000000},"1":{"a":-1,"b":5600000},"5":{"a":150000000,"b":125000000},"6":{"a":155000000,"b":135000000},"7":{"a":170000000,"b":140000000}},"/items/taunt":{"0":{"a":60000,"b":58000}},"/items/thread_of_expertise":{"0":{"a":9200000,"b":9000000}},"/items/tome_of_healing":{"0":{"a":39000,"b":38000},"2":{"a":42000,"b":25000},"3":{"a":50000,"b":23500},"4":{"a":60000,"b":23500},"5":{"a":68000,"b":62000},"6":{"a":105000,"b":100000},"7":{"a":210000,"b":200000},"8":{"a":440000,"b":400000},"9":{"a":840000,"b":-1},"10":{"a":1700000,"b":1450000},"11":{"a":4900000,"b":2000000},"12":{"a":9000000,"b":5200000},"14":{"a":35000000,"b":17500000},"15":{"a":80000000,"b":12000000}},"/items/tome_of_the_elements":{"0":{"a":460000,"b":450000},"1":{"a":470000,"b":310000},"2":{"a":450000,"b":310000},"3":{"a":540000,"b":410000},"4":{"a":520000,"b":460000},"5":{"a":580000,"b":520000},"6":{"a":760000,"b":560000},"7":{"a":1000000,"b":860000},"8":{"a":1600000,"b":1500000},"9":{"a":4000000,"b":2000000},"10":{"a":9400000,"b":7800000},"11":{"a":20000000,"b":2000000},"12":{"a":45000000,"b":5800000},"15":{"a":200000000,"b":100000000}},"/items/toughness":{"0":{"a":62000,"b":60000}},"/items/toxic_pollen":{"0":{"a":155000,"b":150000}},"/items/treant_bark":{"0":{"a":28000,"b":27000}},"/items/treant_shield":{"0":{"a":135000,"b":130000},"1":{"a":-1,"b":90000},"2":{"a":195000,"b":92000},"3":{"a":165000,"b":96000},"4":{"a":200000,"b":100000},"5":{"a":190000,"b":125000},"6":{"a":450000,"b":150000},"7":{"a":580000,"b":-1},"8":{"a":840000,"b":-1},"9":{"a":2000000,"b":-1},"10":{"a":2550000,"b":1350000},"12":{"a":19500000,"b":-1}},"/items/turtle_shell":{"0":{"a":12000,"b":11000}},"/items/turtle_shell_body":{"0":{"a":46000,"b":44000},"1":{"a":50000,"b":-1},"2":{"a":78000,"b":36000},"3":{"a":170000,"b":-1},"4":{"a":500000,"b":50000},"5":{"a":125000,"b":-1},"6":{"a":-1,"b":90000}},"/items/turtle_shell_legs":{"0":{"a":44000,"b":31000},"1":{"a":40000,"b":-1},"2":{"a":56000,"b":-1},"3":{"a":92000,"b":-1},"4":{"a":105000,"b":-1},"5":{"a":150000,"b":-1}},"/items/twilight_essence":{"0":{"a":300,"b":295}},"/items/ultra_alchemy_tea":{"0":{"a":7000,"b":6600}},"/items/ultra_attack_coffee":{"0":{"a":11000,"b":9600}},"/items/ultra_brewing_tea":{"0":{"a":6800,"b":6600}},"/items/ultra_cheesesmithing_tea":{"0":{"a":8200,"b":8000}},"/items/ultra_cooking_tea":{"0":{"a":6800,"b":6600}},"/items/ultra_crafting_tea":{"0":{"a":8200,"b":8000}},"/items/ultra_defense_coffee":{"0":{"a":9800,"b":9600}},"/items/ultra_enhancing_tea":{"0":{"a":10000,"b":9800}},"/items/ultra_foraging_tea":{"0":{"a":6000,"b":5000}},"/items/ultra_intelligence_coffee":{"0":{"a":8600,"b":8000}},"/items/ultra_magic_coffee":{"0":{"a":11000,"b":10500}},"/items/ultra_milking_tea":{"0":{"a":6000,"b":5400}},"/items/ultra_power_coffee":{"0":{"a":11000,"b":10500}},"/items/ultra_ranged_coffee":{"0":{"a":11000,"b":10500}},"/items/ultra_stamina_coffee":{"0":{"a":9000,"b":8800}},"/items/ultra_tailoring_tea":{"0":{"a":8200,"b":8000}},"/items/ultra_woodcutting_tea":{"0":{"a":6200,"b":5800}},"/items/umbral_boots":{"0":{"a":115000,"b":100000},"1":{"a":150000,"b":-1},"2":{"a":295000,"b":-1},"3":{"a":410000,"b":-1},"4":{"a":500000,"b":-1},"5":{"a":800000,"b":-1}},"/items/umbral_bracers":{"0":{"a":165000,"b":150000},"1":{"a":165000,"b":-1},"2":{"a":500000,"b":-1},"3":{"a":250000,"b":-1},"4":{"a":900000,"b":-1},"5":{"a":-1,"b":600000},"7":{"a":2550000,"b":-1}},"/items/umbral_chaps":{"0":{"a":295000,"b":290000},"1":{"a":295000,"b":-1},"2":{"a":320000,"b":170000},"3":{"a":430000,"b":100000},"4":{"a":560000,"b":76000},"5":{"a":640000,"b":390000}},"/items/umbral_hide":{"0":{"a":76,"b":74}},"/items/umbral_hood":{"0":{"a":200000,"b":190000},"1":{"a":295000,"b":-1},"3":{"a":520000,"b":135000},"4":{"a":660000,"b":-1},"5":{"a":880000,"b":700000},"6":{"a":3500000,"b":-1},"8":{"a":-1,"b":2500000},"10":{"a":-1,"b":9000000}},"/items/umbral_leather":{"0":{"a":1350,"b":1300}},"/items/umbral_tunic":{"0":{"a":310000,"b":300000},"1":{"a":-1,"b":100000},"2":{"a":390000,"b":-1},"3":{"a":450000,"b":190000},"4":{"a":640000,"b":380000},"5":{"a":700000,"b":600000}},"/items/vampire_fang":{"0":{"a":640000,"b":620000}},"/items/vampire_fang_dirk":{"0":{"a":12500000,"b":10000000},"3":{"a":13500000,"b":1000000},"5":{"a":13500000,"b":12500000},"6":{"a":17500000,"b":-1},"7":{"a":21000000,"b":17500000},"8":{"a":31000000,"b":22500000},"10":{"a":78000000,"b":22000000},"12":{"a":-1,"b":120000000}},"/items/vampiric_bow":{"0":{"a":12000000,"b":9000000},"2":{"a":-1,"b":1650000},"3":{"a":-1,"b":1650000},"4":{"a":12000000,"b":1650000},"5":{"a":13500000,"b":5000000},"6":{"a":13500000,"b":-1},"7":{"a":13500000,"b":-1},"10":{"a":66000000,"b":20000000},"12":{"a":200000000,"b":19500000}},"/items/vampirism":{"0":{"a":58000,"b":56000}},"/items/verdant_alembic":{"0":{"a":12000,"b":11000},"1":{"a":1000000,"b":-1},"2":{"a":105000,"b":-1},"3":{"a":500000,"b":-1},"4":{"a":840000,"b":-1},"10":{"a":1400000,"b":-1}},"/items/verdant_boots":{"0":{"a":9600,"b":9000},"1":{"a":20500,"b":-1},"5":{"a":620000,"b":-1}},"/items/verdant_brush":{"0":{"a":12000,"b":9800},"1":{"a":520000,"b":-1},"5":{"a":190000,"b":-1},"6":{"a":10000000,"b":-1}},"/items/verdant_buckler":{"0":{"a":12000,"b":9400},"1":{"a":37000,"b":-1}},"/items/verdant_bulwark":{"0":{"a":12000,"b":9800},"1":{"a":300000,"b":-1},"2":{"a":10000000,"b":-1}},"/items/verdant_cheese":{"0":{"a":450,"b":440}},"/items/verdant_chisel":{"0":{"a":12500,"b":10500},"1":{"a":100000,"b":-1},"8":{"a":40000000,"b":-1}},"/items/verdant_enhancer":{"0":{"a":13000,"b":11000},"1":{"a":16000,"b":-1},"2":{"a":12500,"b":-1},"3":{"a":44000,"b":-1},"4":{"a":140000,"b":-1},"5":{"a":205000,"b":-1}},"/items/verdant_gauntlets":{"0":{"a":10000,"b":6000},"1":{"a":200000,"b":-1},"5":{"a":200000,"b":-1}},"/items/verdant_hammer":{"0":{"a":11500,"b":10500},"1":{"a":10000000,"b":-1}},"/items/verdant_hatchet":{"0":{"a":11500,"b":11000},"1":{"a":2200000,"b":-1},"2":{"a":100000,"b":-1},"5":{"a":200000,"b":-1}},"/items/verdant_helmet":{"0":{"a":12000,"b":9800},"1":{"a":16000,"b":-1},"2":{"a":42000000,"b":-1},"3":{"a":200000,"b":-1},"4":{"a":660000,"b":-1},"5":{"a":1550000,"b":800}},"/items/verdant_mace":{"0":{"a":20000,"b":15000},"1":{"a":4900000,"b":-1},"2":{"a":100000000000,"b":-1},"4":{"a":5800000,"b":-1},"5":{"a":1000000,"b":-1},"7":{"a":3800000,"b":-1}},"/items/verdant_milk":{"0":{"a":88,"b":84}},"/items/verdant_needle":{"0":{"a":13500,"b":10000},"1":{"a":10000000,"b":-1},"5":{"a":105000,"b":-1}},"/items/verdant_plate_body":{"0":{"a":16000,"b":15000},"1":{"a":27000,"b":-1},"2":{"a":34000,"b":8800},"5":{"a":98000,"b":800},"6":{"a":110000,"b":-1}},"/items/verdant_plate_legs":{"0":{"a":15500,"b":14500},"1":{"a":500000,"b":-1},"5":{"a":-1,"b":800}},"/items/verdant_pot":{"0":{"a":14000,"b":9400},"1":{"a":40000,"b":-1},"3":{"a":2150000,"b":-1}},"/items/verdant_shears":{"0":{"a":12500,"b":10000},"1":{"a":15500,"b":-1},"2":{"a":10000000,"b":-1}},"/items/verdant_spatula":{"0":{"a":12000,"b":8000},"2":{"a":21500000,"b":-1}},"/items/verdant_spear":{"0":{"a":17500,"b":14500},"1":{"a":18000000,"b":-1},"2":{"a":1350000,"b":-1},"3":{"a":4800000,"b":-1},"5":{"a":960000,"b":-1}},"/items/verdant_sword":{"0":{"a":19000,"b":16000},"1":{"a":500000,"b":-1},"2":{"a":9800000,"b":-1},"3":{"a":2800000,"b":-1},"5":{"a":185000,"b":-1},"6":{"a":-1,"b":720}},"/items/vision_helmet":{"0":{"a":140000,"b":100000},"1":{"a":140000,"b":-1},"2":{"a":140000,"b":-1},"3":{"a":150000,"b":-1},"4":{"a":-1,"b":110000},"5":{"a":300000,"b":76000},"6":{"a":440000,"b":150000},"7":{"a":800000,"b":580000},"8":{"a":2800000,"b":1000000},"10":{"a":-1,"b":6000000}},"/items/vision_shield":{"0":{"a":245000,"b":220000},"1":{"a":290000,"b":-1},"2":{"a":310000,"b":-1},"3":{"a":255000,"b":-1},"4":{"a":350000,"b":-1},"5":{"a":450000,"b":265000},"8":{"a":5200000,"b":-1},"10":{"a":28000000,"b":-1}},"/items/watchful_relic":{"0":{"a":3800000,"b":2850000},"1":{"a":4600000,"b":540000},"2":{"a":4400000,"b":460000},"4":{"a":4300000,"b":-1},"5":{"a":3800000,"b":3500000},"6":{"a":5200000,"b":500000},"7":{"a":6000000,"b":5000000},"8":{"a":18000000,"b":3000000},"9":{"a":24000000,"b":14000000},"10":{"a":-1,"b":25000000},"12":{"a":-1,"b":4000000}},"/items/water_strike":{"0":{"a":10000,"b":9800}},"/items/werewolf_claw":{"0":{"a":640000,"b":620000}},"/items/werewolf_slasher":{"0":{"a":12000000,"b":10000000},"1":{"a":12000000,"b":500000},"2":{"a":-1,"b":1400000},"3":{"a":11500000,"b":3000000},"4":{"a":-1,"b":4000000},"5":{"a":12000000,"b":11000000},"6":{"a":16000000,"b":-1},"7":{"a":19000000,"b":17500000},"8":{"a":25500000,"b":22000000},"9":{"a":78000000,"b":34000000},"10":{"a":66000000,"b":56000000},"12":{"a":230000000,"b":-1},"13":{"a":-1,"b":80000000}},"/items/wheat":{"0":{"a":29,"b":28}},"/items/white_key_fragment":{"0":{"a":1100000,"b":1050000}},"/items/wisdom_coffee":{"0":{"a":1250,"b":1200}},"/items/wisdom_tea":{"0":{"a":760,"b":720}},"/items/wizard_necklace":{"0":{"a":10500000,"b":9800000},"1":{"a":14000000,"b":11000000},"2":{"a":18000000,"b":17000000},"3":{"a":29000000,"b":27500000},"4":{"a":49000000,"b":440000},"5":{"a":96000000,"b":92000000},"6":{"a":-1,"b":98000000},"7":{"a":200000000,"b":145000000},"8":{"a":-1,"b":680000},"10":{"a":460000000,"b":-1}},"/items/woodcutting_essence":{"0":{"a":180,"b":175}},"/items/woodcutting_tea":{"0":{"a":520,"b":450}},"/items/wooden_bow":{"0":{"a":3800,"b":3500},"1":{"a":370000000,"b":2800},"2":{"a":10000000,"b":1300},"3":{"a":68000,"b":4200},"4":{"a":-1,"b":6400},"5":{"a":92000,"b":6400},"6":{"a":120000,"b":-1}},"/items/wooden_crossbow":{"0":{"a":4800,"b":3700},"1":{"a":34000,"b":-1},"3":{"a":80000,"b":-1},"4":{"a":98000,"b":-1},"5":{"a":90000,"b":-1},"8":{"a":660000,"b":-1}},"/items/wooden_fire_staff":{"0":{"a":4100,"b":3000},"1":{"a":9600000,"b":-1},"3":{"a":72000,"b":-1},"6":{"a":150,"b":-1}},"/items/wooden_nature_staff":{"0":{"a":3800,"b":3500},"1":{"a":9800000,"b":-1},"3":{"a":49000,"b":-1},"5":{"a":1200000,"b":-1}},"/items/wooden_shield":{"0":{"a":3200,"b":2050},"1":{"a":9800000,"b":-1},"2":{"a":9800000,"b":-1},"3":{"a":10000000,"b":-1}},"/items/wooden_water_staff":{"0":{"a":4700,"b":3400},"1":{"a":2500000,"b":580},"2":{"a":98000,"b":560},"5":{"a":195000,"b":430}},"/items/yogurt":{"0":{"a":115,"b":110}}},"timestamp":1751706566}`;

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
        const obj = decompressInitClientData(localStorage.getItem("initClientData"));
        console.log(obj);
        GM_setValue("init_client_data", JSON.stringify(obj));

        initData_actionDetailMap = obj.actionDetailMap;
        initData_levelExperienceTable = obj.levelExperienceTable;
        initData_itemDetailMap = obj.itemDetailMap;
        initData_actionCategoryDetailMap = obj.actionCategoryDetailMap;
        initData_abilityDetailMap = obj.abilityDetailMap;

        for (const [key, value] of Object.entries(initData_itemDetailMap)) {
            itemEnNameToHridMap[value.name] = key;
        }

        // 添加批量强化成本计算按钮
        setTimeout(addBulkEnhancementCostsButton, 1000);
    }

    hookWS();

    const currentApiVersion = 2;
    const ApiVersion = localStorage.getItem("MWITools_marketAPI_ApiVersion");
    if (!ApiVersion || parseInt(ApiVersion) < currentApiVersion) {
        console.log("Clearing API cache due to ApiVersion update");
        localStorage.setItem("MWITools_marketAPI_timestamp", JSON.stringify(0));
        localStorage.setItem("MWITools_marketAPI_json", JSON.stringify(null));
        localStorage.setItem("MWITools_marketAPI_ApiVersion", JSON.stringify(currentApiVersion));
    }
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







    function getWeightedMarketPrice(marketPrices, ratio = 0.5) {
        let ask = marketPrices[0].a;
        let bid = marketPrices[0].b;
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


    /* 查看人物面板显示打造分 */
    // by Ratatatata (https://greasyfork.org/zh-CN/scripts/511240)


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
        const itemHrid = itemEnNameToHridMap[itemName];

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
            if (!marketJson || !marketJson.marketData) {
                console.error("jsonObj null");
            }

            ask = marketJson?.marketData[itemHrid]?.[0].a;
            bid = marketJson?.marketData[itemHrid]?.[0].b;
            appendHTMLStr += `
        <div style="color: ${SCRIPT_COLOR_TOOLTIP};">${isZH ? "价格: " : "Price: "}${numberFormatter(ask)} / ${numberFormatter(bid)} (${
                ask && ask > 0 ? numberFormatter(ask * amount) : ""
            } / ${bid && bid > 0 ? numberFormatter(bid * amount) : ""})</div>
        `;
        }

        // 消耗品回复计算
        if (settingsMap.showConsumTips.isTrue) {
            let itemDetail = initData_itemDetailMap[itemHrid];
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
                    item.perAskPrice = marketJson?.marketData[item.itemHrid]?.[0].a;
                    item.perBidPrice = marketJson?.marketData[item.itemHrid]?.[0].b;
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
                    upgradedFromItemAsk += marketJson?.marketData[upgradedFromItemHrid]?.[0].a;
                    upgradedFromItemBid += marketJson?.marketData[upgradedFromItemHrid]?.[0].b;
                    totalResourcesAskPricePerAction += upgradedFromItemAsk;
                    totalResourcesBidPricePerAction += upgradedFromItemBid;
                }

                // 使用表格显示原料信息
                appendHTMLStr += `
                                <div style="color: ${SCRIPT_COLOR_TOOLTIP}; font-size: 10px;">
                                    <table style="width:100%; border-collapse: collapse;">
                                        <tr style="border-bottom: 1px solid ${SCRIPT_COLOR_TOOLTIP};">
                                            <th style="text-align: left;">${isZH ? "原料" : "Material"}</th>
                                            <th style="text-align: center;">${isZH ? "数量" : "Count"}</th>
                                            <th style="text-align: right;">${isZH ? "出售价" : "Ask"}</th>
                                            <th style="text-align: right;">${isZH ? "收购价" : "Bid"}</th>
                                        </tr>
                                        <tr style="border-bottom: 1px solid ${SCRIPT_COLOR_TOOLTIP};">
                                            <td style="text-align: left;"><b>${isZH ? "合计" : "Total"}</b></td>
                                            <td style="text-align: center;"><b>${inputItems.reduce((sum, item) => sum + item.count, 0)}</b></td>
                                            <td style="text-align: right;"><b>${numberFormatter(totalResourcesAskPricePerAction)}</b></td>
                                            <td style="text-align: right;"><b>${numberFormatter(totalResourcesBidPricePerAction)}</b></td>
                                        </tr>`;

                for (const item of inputItems) {
                    appendHTMLStr += `
                                        <tr>
                                            <td style="text-align: left;">${isZH ? item.zhName : item.name}</td>
                                            <td style="text-align: center;">${item.count}</td>
                                            <td style="text-align: right;">${numberFormatter(item.perAskPrice)}</td>
                                            <td style="text-align: right;">${numberFormatter(item.perBidPrice)}</td>
                                        </tr>`;
                }
                appendHTMLStr += `</table></div>`;

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
                drinksConsumedPerHourAskPrice += (marketJson?.marketData[drink.itemHrid]?.[0].a ?? 0) * 12;
                drinksConsumedPerHourBidPrice += (marketJson?.marketData[drink.itemHrid]?.[0].b ?? 0) * 12;
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
                    ? "生产利润(卖单价进、买单价出，包含销售税；不包括加工茶、社区增益、稀有掉落、袋子饮食增益；刷新网页更新人物数据)："
                    : "Production profit(Sell price in, bid price out, including sales tax; Not including processing tea, comm buffs, rare drops, pouch consumables buffs; Refresh page to update player data): "
            }</div>`;

            appendHTMLStr += `<div style="color: ${SCRIPT_COLOR_TOOLTIP}; font-size: 10px;">${baseTimePerActionSec.toFixed(2)}s ${
                isZH ? "基础速度" : "base speed,"
            } x${droprate} ${isZH ? "基础掉率" : "base drop rate,"} +${toolPercent}%${isZH ? "工具速度" : " tool speed,"} +${levelEffBuff}%${
                isZH ? "等级效率" : " level eff,"
            } +${houseEffBuff}%${isZH ? "房子效率" : " house eff,"} +${teaBuffs.efficiency}%${isZH ? "茶效率" : " tea eff,"} +${itemEffiBuff}%${
                isZH ? "装备效率" : " equipment eff,"
            } +${teaBuffs.quantity}%${isZH ? "茶额外数量" : " tea extra outcome,"} +${teaBuffs.lessResource}%${
                isZH ? "茶减少消耗" : " tea lower resource"
            }</div>`;

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

        // Make sure the tooltip is fully visible in the viewport
        const tootip = insertAfterElem.closest(".MuiTooltip-popper");
        const fixOverflow = (tootip) => {
            if (!tootip.isConnected) {
                return;
            }
            const bBox = tootip.getBoundingClientRect();
            if (bBox.top < 0 || bBox.bottom > window.innerHeight) {
                const transformString = tootip.style.transform.split(/\w+\(|\);?/);
                const transformValues = transformString[1].split(/,\s?/g).map((numStr) => parseInt(numStr));
                tootip.style.transform = `translate3d(${transformValues[0]}px, 0px, ${transformValues[2]}px)`;
            }
        };
        setTimeout(fixOverflow, 100, tootip); // A delay is added because the game seems to reset the style if applied immediately.
    }

    function validateMarketJsonFetch(jsonStr, isSave) {
        if (!jsonStr) {
            console.error("validateMarketJson jsonStr is null");
            return null;
        }

        let jsonObj = null;
        try {
            jsonObj = JSON.parse(jsonStr);
        } catch (error) {
            console.error("validateMarketJson failed to parse JSON:", error.message);
        }

        // 检查新API的数据格式兼容性
        if (jsonObj) {
            console.log('新API数据格式检查:', {
                hasTimestamp: !!jsonObj.timestamp,
                hasMarketData: !!jsonObj.marketData,
                hasData: !!jsonObj.data,
                keys: Object.keys(jsonObj)
            });

            // 如果新API使用不同的数据结构，尝试适配
            if (!jsonObj.marketData && jsonObj.data) {
                console.log('检测到新API格式，进行数据适配');
                jsonObj.marketData = jsonObj.data;
            }

            // 如果没有timestamp，使用当前时间
            if (!jsonObj.timestamp) {
                jsonObj.timestamp = Math.floor(Date.now() / 1000);
                console.log('添加时间戳:', jsonObj.timestamp);
            }
        }

        if (jsonObj && jsonObj.timestamp && jsonObj.marketData) {
            // Add modifications to API data
            jsonObj.marketData["/items/coin"] = { 0: { a: 1, b: 1 } };
            jsonObj.marketData["/items/task_token"] = { 0: { a: 0, b: 0 } };
            jsonObj.marketData["/items/cowbell"] = { 0: { a: 0, b: 0 } };

            jsonObj.marketData["/items/small_treasure_chest"] = { 0: { a: 0, b: 0 } };
            jsonObj.marketData["/items/medium_treasure_chest"] = { 0: { a: 0, b: 0 } };
            jsonObj.marketData["/items/large_treasure_chest"] = { 0: { a: 0, b: 0 } };

            jsonObj.marketData["/items/basic_task_badge"] = { 0: { a: 0, b: 0 } };
            jsonObj.marketData["/items/advanced_task_badge"] = { 0: { a: 0, b: 0 } };
            jsonObj.marketData["/items/expert_task_badge"] = { 0: { a: 0, b: 0 } };

            if (isSave) {
                console.log('API数据结构:', jsonObj);
                console.log('API数据键:', Object.keys(jsonObj));
                if (jsonObj.marketData) {
                    console.log('市场数据键数量:', Object.keys(jsonObj.marketData).length);
                    console.log('市场数据示例:', Object.keys(jsonObj.marketData).slice(0, 5));
                }
                localStorage.setItem("MWITools_marketAPI_timestamp", Date.now());
                localStorage.setItem("MWITools_marketAPI_json", JSON.stringify(jsonObj));
                // 保存API时间戳
                if (jsonObj.timestamp) {
                    localStorage.setItem("MWITools_api_timestamp1", jsonObj.timestamp);
                console.log('保存API时间戳:', jsonObj.timestamp);
                // 更新设置按钮上的时间戳
                if (typeof updateSettingsButtonTimestamp === 'function') {
                    updateSettingsButtonTimestamp();
                }
                }
            }

            return jsonObj;
        } else {
            console.error("validateMarketJson invalid json structure");
            return null;
        }
    }

    // 创建一个自定义事件，用于通知市场数据已更新
    const marketDataUpdatedEvent = new CustomEvent('MWIMarketDataUpdated');

    // API超时通知相关变量
    let apiTimeoutCount = 0; // 超时次数计数
    let apiNotificationTimer = null; // 通知定时器
    const BASE_NOTIFICATION_INTERVAL = 5 * 60 * 1000; // 基础通知间隔5分钟（毫秒）

    // 发送API超时通知
    function sendApiTimeoutNotification() {
        if (typeof GM_notification === "undefined" || !GM_notification) {
            console.error("sendApiTimeoutNotification null GM_notification");
            return;
        }

        const timeoutCount = apiTimeoutCount;
        const interval = timeoutCount * BASE_NOTIFICATION_INTERVAL;
        const minutes = interval / 60000;

        console.log(`发送API超时通知，超时次数: ${timeoutCount}，当前间隔: ${minutes}分钟`);
        GM_notification({
            text: isZH ? `API超时，下次通知间隔将增加到${minutes}分钟` : `API timeout, next notification interval will increase to ${minutes} minutes`,
            title: "MWITools",
        });

        // 设置下一次通知
        apiNotificationTimer = setTimeout(sendApiTimeoutNotification, interval);
    }

    // 重置API超时通知设置
    function resetApiTimeoutSettings() {
        apiTimeoutCount = 0;
        if (apiNotificationTimer) {
            clearTimeout(apiNotificationTimer);
            apiNotificationTimer = null;
        }
        console.log("重置API超时通知设置");
    }

    // 处理API超时
    function handleApiTimeout() {
        apiTimeoutCount++;
        console.log(`API超时，当前超时次数: ${apiTimeoutCount}`);

        // 如果是第一次超时，立即发送通知并设置下次通知
        if (apiTimeoutCount === 1) {
            sendApiTimeoutNotification();
        }
    }

    // 同步API数据到localStorage.marketdataenhance
    async function syncMarketData() {
        try {
            console.log('开始同步市场数据...');
            // 从API获取数据
            const apiResponse = await GM.xmlHttpRequest({
                url: MARKET_API_URL,
                method: 'GET',
                timeout: 5000,
                headers: {
                    'Authorization': `token ${API_TOKEN}`
                },
                ontimeout: () => {
                    console.error('API请求超时');
                    handleApiTimeout();
                }
            });

            if (apiResponse.status === 200) {
                // API调用成功，重置超时设置
                resetApiTimeoutSettings();

                const apiData = JSON.parse(apiResponse.responseText);
                const apiTimestamp = apiData.timestamp || Math.floor(Date.now() / 1000);

                // 获取本地数据
                const localDataStr = localStorage.getItem('marketdataenhance');
                let localTimestamp = 0;

                if (localDataStr) {
                    try {
                        const localData = JSON.parse(localDataStr);
                        localTimestamp = localData.timestamp || 0;
                    } catch (e) {
                        console.error('解析本地市场数据失败:', e);
                    }
                }

                // 比较时间戳并更新
                if (apiTimestamp > localTimestamp) {
                    try {
                        // 解析API响应并仅存储必要的数据
                        const apiData = JSON.parse(apiResponse.responseText);
                        // 只保留marketData和timestamp字段
                        const essentialData = {
                            marketData: apiData.marketData || {},
                            timestamp: apiTimestamp
                        };
                        // 尝试压缩数据以减少大小
                        const compressedData = JSON.stringify(essentialData);
                        localStorage.setItem('marketdataenhance', compressedData);
                        // 保存时间戳到localStorage
                        localStorage.setItem('MWITools_api_timestamp1', apiTimestamp.toString());
                        console.log('市场数据已更新，API时间戳:', apiTimestamp, '本地时间戳:', localTimestamp);
                        console.log('压缩后的数据大小:', Math.round(compressedData.length / 1024), 'KB');
                        // 触发市场数据更新事件
                        document.dispatchEvent(marketDataUpdatedEvent);
                    } catch (e) {
                        console.error('处理并存储市场数据时出错:', e);
                    }
                } else {
                    console.log('市场数据已是最新，无需更新');
                }
            } else {
                console.error('获取API数据失败，状态码:', apiResponse.status);
            }
        } catch (e) {
            console.error('同步市场数据时出错:', e);
            // 如果是网络错误或超时，处理超时
            if (e.message && (e.message.includes('timeout') || e.message.includes('TimeOut'))) {
                handleApiTimeout();
            }
        }
    }

    async function fetchMarketJSON(forceFetch = false) {
        // console.log(GM_xmlhttpRequest); // Tampermonkey
        // console.log(GM.xmlHttpRequest); // Tampermonkey promise based, Greasemonkey 4.0+

        // Has recently fetched
        if (
            !forceFetch &&
            localStorage.getItem("MWITools_marketAPI_timestamp") &&
            Date.now() - localStorage.getItem("MWITools_marketAPI_timestamp") < 18000000000000 // 30 min (减少缓存时间)
        ) {
            const cachedData = JSON.parse(localStorage.getItem("marketdataenhance"));
            // 确保缓存数据中的时间戳也被保存
            if (cachedData && cachedData.timestamp && !localStorage.getItem("MWITools_api_timestamp1")) {
                localStorage.setItem("MWITools_api_timestamp1", cachedData.timestamp);
                console.log('从缓存保存API时间戳:', cachedData.timestamp);
                // 更新设置按钮上的时间戳
                if (typeof updateSettingsButtonTimestamp === 'function') {
                    updateSettingsButtonTimestamp();
                }
            }
            return cachedData;
        }

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
            reasonForUsingExpiredMarketJson += "\nusing hard-coded backup version\n";

            const jsonStr = MARKET_JSON_LOCAL_BACKUP;
            return validateMarketJsonFetch(jsonStr, false);
        }

        // Start fetch
        console.log("fetchMarketJSON fetch start");
        reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch start \n";
        let timeoutOccurred = false;
        const response = await sendRequest({
            url: MARKET_API_URL,
            method: "GET",
            synchronous: true,
            timeout: 5000,
            headers: {
                'Authorization': `token ${API_TOKEN}`
            },
            onload: (response) => {
                if (response.status == 200) {
                    console.log("fetchMarketJSON fetch success 200");
                    reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch onload 200 \n";
                } else {
                    console.error("fetchMarketJSON fetch onload with HTTP status failure " + response.status);
                    reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch onload NOT 200 \n";
                }
            },
            onabort: () => {
                console.error("fetchMarketJSON fetch onabort");
                reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch onabort \n";
            },
            onerror: () => {
                console.error("fetchMarketJSON fetch onerror");
                reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch onerror \n";
            },
            ontimeout: () => {
                console.error("fetchMarketJSON fetch ontimeout");
                reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch ontimeout \n";
                timeoutOccurred = true;
                handleApiTimeout();
            },
        });
        console.log("fetchMarketJSON fetch end with response status: " + response?.status);
        reasonForUsingExpiredMarketJson += new Date().toUTCString() + " fetch end with response status " + response?.status + "\n";

        let jsonStr = response?.status === 200 ? response.responseText : null;
        let jsonObj = validateMarketJsonFetch(jsonStr, true);

        if (jsonObj) {
            // API调用成功，重置超时设置
            resetApiTimeoutSettings();

            isUsingExpiredMarketJson = false;
            reasonForUsingExpiredMarketJson = "";
            const alertDiv = document.querySelector("div#script_api_fail_alert");
            if (alertDiv) {
                alertDiv.style.display = "none";
            }
            return jsonObj;
        }

        // Fetch failed
        isUsingExpiredMarketJson = true;
        reasonForUsingExpiredMarketJson += new Date().toUTCString() + " Setting isUsingExpiredMarketJson to true:\n";
        reasonForUsingExpiredMarketJson += "Failed fetch";
        const alertDiv = document.querySelector("div#script_api_fail_alert");
        if (alertDiv) {
            alertDiv.style.display = "block";
        }

        // Try previously fetched version
        if (
            localStorage.getItem("MWITools_marketAPI_json") &&
            localStorage.getItem("MWITools_marketAPI_timestamp") &&
            JSON.parse(MARKET_JSON_LOCAL_BACKUP).timestamp * 1000 < localStorage.getItem("MWITools_marketAPI_timestamp")
        ) {
            console.error("fetchMarketJSON network error, using previously fetched version");
            const jsonStr = localStorage.getItem("MWITools_marketAPI_json");
            const jsonObj = validateMarketJsonFetch(jsonStr, false);
            if (jsonObj) {
                // 确保备用数据中的时间戳也被保存
                if (jsonObj.timestamp && !localStorage.getItem("MWITools_api_timestamp1")) {
                    localStorage.setItem("MWITools_api_timestamp1", jsonObj.timestamp);
                    console.log('从备用数据保存API时间戳:', jsonObj.timestamp);
                }
                reasonForUsingExpiredMarketJson += "\nusing previously fetched version\n";
                return jsonObj;
            }
        }

        // Use hard-coded backup version
        reasonForUsingExpiredMarketJson += "\nusing hard-coded backup version\n";
        const backupData = validateMarketJsonFetch(MARKET_JSON_LOCAL_BACKUP, false);
        // 确保硬编码备用数据中的时间戳也被保存
        if (backupData && backupData.timestamp && !localStorage.getItem("MWITools_api_timestamp1")) {
            localStorage.setItem("MWITools_api_timestamp1", backupData.timestamp);
            // 更新设置按钮上的时间戳
            if (typeof updateSettingsButtonTimestamp === 'function') {
                updateSettingsButtonTimestamp();
            }
            console.log('从硬编码备用数据保存API时间戳:', backupData.timestamp);
        }
        return backupData;
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
            { value: 1e9999, symbol: "B" },
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

        const elems = panel.querySelectorAll("div.SkillActionDetail_value__dQjYH");
        const duration = Number(
            getOriTextFromElement(elems[elems.length - 2])
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
            // 延长延迟时间确保DOM加载完成
        // 延长等待时间确保DOM完全加载
        // 延长延迟至2秒确保DOM完全加载
        // 修复：在正确位置延长延迟至2秒并添加调试日志
        // 修复：正确位置添加2秒延迟和完整调试日志
        setTimeout(() => {
            console.log('[市场数据提取] 开始处理商品信息');
            const summaryPanel = document.querySelector('div.MarketplacePanel_itemSummary__29rdY');
            console.log('[市场数据提取] 找到商品面板:', !!summaryPanel);
            console.log('开始提取商品信息，检查DOM元素...');
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
                btn.style.color = "black";
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
                btn.style.color = "black";
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
                drinksConsumedPerHourAskPrice += (marketJson?.marketData[drink.itemHrid]?.[0].a ?? 0) * 12;
                drinksConsumedPerHourBidPrice += (marketJson?.marketData[drink.itemHrid]?.[0].b ?? 0) * 12;
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
                const bid = marketJson?.marketData[drop.itemHrid]?.[0].b;
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




    /* 战斗总结 */
    // 已移除handleBattleSummary函数


    /* 图标上显示装备等级 */

    // 优化：添加定时器管理和性能优化




    // 优化：监听设置变化，动态启停监控
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-istrue') {
                if (settingsMap.itemIconLevel.isTrue) {
                    startItemLevelsMonitor();
                } else {
                    stopItemLevelsMonitor();
                }
            }
        });
    });

    // 假设settingsMap.itemIconLevel有对应的DOM元素，这里需要实际的选择器
    // observer.observe(document.querySelector('#itemIconLevelSetting'), { attributes: true });

    // 页面卸载时清理


    /* 市场物品筛选 */


    /* 动作列表菜单计算时间 */
    // 已移除动作队列时间计算相关函数


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

        let itemHrid = itemEnNameToHridMap[itemName];
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
                    ? "强化模拟（默认125级强化，6级房子，10级星空工具，10级手套，究极茶，幸运茶，卖单价收货，不包括工时费，不包括市场税）："
                    : "Enhancement simulator: Default level 12 enhancing, level 6 house, level 10 celestial tool, level 10 gloves, ultra tea, blessed tea, sell order price in, no player time fee, no market tax: "
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

    async function findBestEnhanceStrat(input_data, price_data) {
        if (!price_data || !price_data.marketData) {
            console.error("findBestEnhanceStrat: price_data is invalid");
            return null;
        }

        const allResults = [];
        // 获取目标强化等级的市场售价和买价
        const marketPrices = getMarketPricesForEnhancementLevel(input_data.item_hrid, input_data.stop_at, price_data);
        const sellPrice = marketPrices.sellPrice || 0;
        const buyPrice = marketPrices.buyPrice || 0;

        for (let protect_at = 2; protect_at <= input_data.stop_at; protect_at++) {
            const simResult = Enhancelate(input_data, protect_at);
            if (!simResult) continue;

            const costs = getCosts(input_data.item_hrid, price_data);
            const totalCost = costs.baseCost + costs.minProtectionCost * simResult.protect_count + costs.perActionCost * simResult.actions;

            // 计算利润和时薪
            // 当只有买单价或卖单价中的一个存在时，使用存在的那个价格
            let priceForProfit = 0;
            if (sellPrice > 0 && buyPrice > 0) {
                priceForProfit = sellPrice; // 两者都存在时，使用卖单价
            } else if (sellPrice > 0) {
                priceForProfit = sellPrice; // 只有卖单价存在
            } else if (buyPrice > 0) {
                priceForProfit = buyPrice; // 只有买单价存在
            }

            const profit = (priceForProfit * 0.98) - totalCost;
            const hourlyRate = calculateHourlyRate(profit, simResult.totalActionTimeStr);

            const r = {
                protect_at: protect_at,
                protect_count: simResult.protect_count,
                simResult: simResult,
                costs: costs,
                totalCost: totalCost,
                hourlyRate: hourlyRate // 存储时薪
            };
            allResults.push(r);
        }

        if (allResults.length === 0) {
            return null;
        }

        let best = allResults[0];
        for (let i = 1; i < allResults.length; i++) {
            // 选择时薪最高的策略
            if (allResults[i].hourlyRate > best.hourlyRate) {
                best = allResults[i];
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

        enhancing_level: 125, // 人物 Enhancing 技能等级
        laboratory_level: 6, // 房子等级
        enhancer_bonus: 5.42, // 工具提高成功率，10级星空强化工具
        glove_bonus: 12.9, // 手套提高强化速度，0级=10，5级=11.2，10级=12.9

        tea_enhancing: false, // 强化茶
        tea_super_enhancing: false, // 超级强化茶
        tea_ultra_enhancing: true,
        tea_blessed: true, // 祝福茶

        priceAskBidRatio: 0, // 取市场卖单价买单价比例，1=只用卖单价，0=只用买单价
    };

    // 更新input_data使用用户设置
    function updateInputDataWithUserSettings() {
        const userSettings = getEnhancementSettings();
        input_data.enhancing_level = userSettings.enhancing_level;
        input_data.laboratory_level = userSettings.laboratory_level;
        input_data.enhancer_bonus = userSettings.enhancer_bonus;
        input_data.glove_bonus = userSettings.glove_bonus;
    }

    // 获取物品的汉化名称
    function getItemZhName(hrid) {
        return ZHitemNames[hrid] || null;
    }

    // 格式化价格显示：卖单价/买单价
    function formatPriceDisplay(sellPrice, buyPrice) {
        const sellStr = sellPrice > 0 ? numberFormatter(sellPrice, 2) : '-';
        const buyStr = buyPrice > 0 ? numberFormatter(buyPrice, 2) : '-';
        return `${sellStr}/${buyStr}`;
    }

    // 格式化API时间戳
    function formatApiTimestamp(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // 计算时薪（利润/小时）
    function calculateHourlyRate(profit, timeStr) {
        try {
            let totalHours = 0;

            // 尝试匹配天数格式，如 "1.1 天"
            const daysMatch = timeStr.match(/(\d+\.\d+)\s*天/);
            if (daysMatch) {
                const days = parseFloat(daysMatch[1]);
                totalHours = days * 24; // 转换为小时
            } else {
                // 尝试匹配小时分钟秒格式，如 "1h 30m 45s"
                const timeMatch = timeStr.match(/(\d+)h\s*(\d+)m\s*(\d+)s/);
                if (!timeMatch) {
                    return 0;
                }

                const hours = parseInt(timeMatch[1]) || 0;
                const minutes = parseInt(timeMatch[2]) || 0;
                const seconds = parseInt(timeMatch[3]) || 0;

                // 转换为小时
                totalHours = hours + minutes / 60 + seconds / 3600;
            }

            if (totalHours <= 0) {
                return 0;
            }

            // 计算时薪
            return profit / totalHours;
        } catch (error) {
            console.error('计算时薪时出错:', error);
            return 0;
        }
    }

    // 获取指定强化等级的市场价格（卖单价和买单价）
    function getMarketPricesForEnhancementLevel(hrid, enhancementLevel, price_data) {
        try {
            if (!price_data || !price_data.marketData || !price_data.marketData[hrid]) {
                return { sellPrice: null, buyPrice: null };
            }

            const itemMarketData = price_data.marketData[hrid];
            const levelData = itemMarketData[enhancementLevel];

            if (levelData) {
                const sellPrice = levelData.a && levelData.a > 0 ? levelData.a : null;
                const buyPrice = levelData.b && levelData.b > 0 ? levelData.b : null;
                return { sellPrice, buyPrice };
            } else {
                return { sellPrice: null, buyPrice: null };
            }
        } catch (error) {
            console.error('获取市场价格时出错:', error);
            return { sellPrice: null, buyPrice: null };
        }
    }

    // 批量强化成本计算功能
    async function calculateAllEnhancementCosts(isCancelled = false) {
        if (!initData_itemDetailMap) {
            console.error("initData_itemDetailMap 未初始化");
            return [];
        }

        const price_data = await fetchMarketJSON();
        if (!price_data || !price_data.marketData) {
            console.error("无法获取市场价格数据");
            return [];
        }

        // 获取用户设置
        const userSettings = getEnhancementSettings();

        // 获取收藏列表
        const favorites = getEnhancementFavorites();
        let itemsToProcess = [];
        let totalItems = 0;

        // 根据设置确定计算模式
        const calculationMode = userSettings.calculation_mode || 'all';

        if (calculationMode === 'favorites' && favorites.length > 0) {
            // 仅收藏模式：只计算收藏的物品
            for (const hrid of favorites) {
                const itemDetail = initData_itemDetailMap[hrid];
                if (itemDetail && itemDetail.enhancementCosts && itemDetail.enhancementCosts.length > 0) {
                    itemsToProcess.push({ hrid, itemDetail });
                    totalItems++;
                }
            }
            console.log(`使用仅收藏模式，计算 ${totalItems} 个收藏物品`);
        } else {
            // 全局模式：计算所有物品
            for (const [hrid, itemDetail] of Object.entries(initData_itemDetailMap)) {
                if (itemDetail.enhancementCosts && itemDetail.enhancementCosts.length > 0) {
                    itemsToProcess.push({ hrid, itemDetail });
                    totalItems++;
                }
            }
            console.log(`使用全局模式，计算 ${totalItems} 个物品`);
        }

        const enhancementItems = [];
        let processedCount = 0;

        // 分批处理，每批处理3个物品（减少批次大小以提高响应性）
        const batchSize = 3;
        for (let i = 0; i < itemsToProcess.length; i += batchSize) {
            // 检查是否已取消
            if (isCancelled) {
                console.log('计算已取消');
                return [];
            }

            const batch = itemsToProcess.slice(i, i + batchSize);

            // 使用 Promise.all 并行处理每批
            const batchPromises = batch.map(async ({ hrid, itemDetail }) => {
                try {
                    processedCount++;
                    const zhName = getItemZhName(hrid) || itemDetail.name;
                    console.log(`正在处理第 ${processedCount}/${totalItems} 个物品: ${zhName} (${itemDetail.name})`);

                    // 更新进度条
                    const progressBar = document.getElementById('progress-bar');
                    if (progressBar) {
                        const progress = (processedCount / totalItems) * 100;
                        progressBar.style.width = progress + '%';
                    }

                    // 为每个物品计算强化成本
                    const costs = getCosts(hrid, price_data);

                    // 根据用户设置计算选定的强化等级
                    const targetLevels = userSettings.enhancement_levels || [5, 7, 10];
                    const enhancementResults = [];

                    for (const targetLevel of targetLevels) {
                        // 检查是否已取消
                        if (isCancelled) {
                            return null;
                        }

                        // 获取用户设置
                        const userSettings = getEnhancementSettings();

                        const input_data = {
                            item_hrid: hrid,
                            stop_at: targetLevel,
                            enhancing_level: userSettings.enhancing_level,
                            laboratory_level: userSettings.laboratory_level,
                            enhancer_bonus: userSettings.enhancer_bonus,
                            glove_bonus: userSettings.glove_bonus,
                            tea_enhancing: false,
                            tea_super_enhancing: false,
                            tea_ultra_enhancing: true,
                            tea_blessed: true,
                            priceAskBidRatio: 0,
                        };

                        const bestStrategy = await findBestEnhanceStrat(input_data, price_data);
                        if (bestStrategy) {
                            // 获取市场价格数据（卖单价和买单价）
                            const marketPrices = getMarketPricesForEnhancementLevel(hrid, targetLevel, price_data);

                            enhancementResults.push({
                                targetLevel: targetLevel,
                                totalCost: bestStrategy.totalCost,
                                protectCount: bestStrategy.protect_count,
                                protectAt: bestStrategy.protect_at,
                                actions: bestStrategy.simResult.actions,
                                timeSpent: bestStrategy.simResult.totalActionTimeStr,
                                sellPrice: marketPrices.sellPrice,
                                buyPrice: marketPrices.buyPrice
                            });
                        }
                    }

                    return {
                        hrid: hrid,
                        name: itemDetail.name,
                        itemLevel: itemDetail.itemLevel || 0,
                        costs: costs,
                        enhancementResults: enhancementResults
                    };
                } catch (error) {
                    console.error(`计算物品 ${itemDetail.name} 强化成本时出错:`, error);
                    return null;
                }
            });

            // 等待当前批次完成
            const batchResults = await Promise.all(batchPromises);

            // 添加有效结果到列表中
            for (const result of batchResults) {
                if (result) {
                    enhancementItems.push(result);
                }
            }

            // 让出主线程控制权，增加延迟以避免阻塞
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        // 统计汉化情况
        const zhNameCount = enhancementItems.filter(item => ZHitemNames[item.hrid]).length;
        console.log(`总共处理了 ${enhancementItems.length} 个可强化物品，其中 ${zhNameCount} 个物品有中文名称`);

        // 按最高时薪排序（降序，使用卖单价的时薪，扣除2%市场税，只考虑用户选择的强化等级）
        const selectedLevels = userSettings.enhancement_levels || [5, 7, 10];
        enhancementItems.sort((a, b) => {
            const aMaxHourlyRate = Math.max(...a.enhancementResults
                .filter(r => selectedLevels.includes(r.targetLevel))
                .map(r => {
                    const sellPrice = r.sellPrice || 0;
                    const profit = sellPrice > 0 ? (sellPrice * 0.98) - r.totalCost : 0;
                    return r.timeSpent ? calculateHourlyRate(profit, r.timeSpent) : 0;
                }));
            const bMaxHourlyRate = Math.max(...b.enhancementResults
                .filter(r => selectedLevels.includes(r.targetLevel))
                .map(r => {
                    const sellPrice = r.sellPrice || 0;
                    const profit = sellPrice > 0 ? (sellPrice * 0.98) - r.totalCost : 0;
                    return r.timeSpent ? calculateHourlyRate(profit, r.timeSpent) : 0;
                }));
            return bMaxHourlyRate - aMaxHourlyRate; // 降序排列，时薪最高的在前面
        });

        // 如果没有找到任何可强化物品，显示提示
        if (enhancementItems.length === 0) {
            console.warn('没有找到任何可强化的物品');
        }

        return enhancementItems;
    }

    // 显示批量强化成本计算结果的UI
    // 最小化强化成本面板
    function minimizeEnhancementPanel(panel) {
        const isMinimized = panel.classList.contains('minimized');

        if (isMinimized) {
            // 恢复面板
            panel.classList.remove('minimized');
            panel.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 1500px;
                max-height: 90vh;
                background: white;
                border: 2px solid #333;
                border-radius: 8px;
                padding: 20px;
                z-index: 10000;
                overflow-y: auto;
                font-family: Arial, sans-serif;
            `;

            // 恢复内容
            const content = panel.querySelector('.minimized-content');
            if (content) {
                content.style.display = 'block';
            }

            // 更新按钮文本
            const minimizeButton = panel.querySelector('#minimize-button');
            if (minimizeButton) {
                minimizeButton.textContent = isZH ? '最小化' : 'Minimize';
            }

            // 恢复标题
            const title = panel.querySelector('h2');
            if (title) {
                title.textContent = isZH ? '批量强化成本计算' : 'Bulk Enhancement Cost Calculation';
            }
        } else {
            // 最小化面板
            panel.classList.add('minimized');
            panel.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: 300px;
                height: 60px;
                background: white;
                border: 2px solid #333;
                border-radius: 8px;
                padding: 10px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                overflow: hidden;
            `;

            // 添加最小化状态指示器
            const title = panel.querySelector('h2');
            if (title) {
                title.textContent = isZH ? '强化成本计算 (已最小化)' : 'Enhancement Costs (Minimized)';
            }

            // 隐藏内容
            const content = panel.querySelector('.minimized-content');
            if (content) {
                content.style.display = 'none';
            }

            // 更新按钮文本
            const minimizeButton = panel.querySelector('#minimize-button');
            if (minimizeButton) {
                minimizeButton.textContent = isZH ? '恢复' : 'Restore';
            }
        }
    }

    function showEnhancementCostsUI(enhancementItems) {
        console.log('显示强化成本UI，物品数量:', enhancementItems.length);

        // 获取用户设置
        const userSettings = getEnhancementSettings();
        const selectedLevels = userSettings.enhancement_levels || [5, 7, 10];

        // 获取API时间戳
        const apiTimestamp = localStorage.getItem("MWITools_api_timestamp1");
        const apiTimeStr = apiTimestamp ? formatApiTimestamp(parseInt(apiTimestamp)) : '';

        // 移除已存在的面板
        const existingPanel = document.getElementById('enhancement-costs-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'enhancement-costs-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 1500px;
            max-height: 90vh;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            overflow-y: auto;
            font-family: Arial, sans-serif;
        `;

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; position: sticky; top: 0; background: white; z-index: 10; padding: 10px 0; border-bottom: 1px solid #ddd;">
                <button id="close-button"
                        style="background: #ff4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    ${isZH ? '关闭' : 'Close'}
                </button>
                <h2 style="margin: 0; color: #333; text-align: center; flex-grow: 1; margin: 0 20px;">${isZH ? '批量强化成本计算' : 'Bulk Enhancement Cost Calculation'}</h2>
                <button id="minimize-button"
                        style="background: #ffaa00; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    ${isZH ? '最小化' : 'Minimize'}
                </button>
            </div>
            <div style="margin-bottom: 15px;">
                                <!-- 已删除强化成本说明文字 -->

                <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
                    ${isZH ? `计算模式：${userSettings.calculation_mode === 'favorites' ? '仅收藏模式（仅计算收藏物品）' : '全局模式（计算所有可强化物品）'}` :
                    `Calculation mode: ${userSettings.calculation_mode === 'favorites' ? 'Favorites only mode (only calculated favorite items)' : 'Global mode (calculated all enhanceable items)'}`}
                </p>
                ${apiTimeStr ? `<p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
                    ${isZH ? `API数据时间：${apiTimeStr}` : `API data time: ${apiTimeStr}`}
                </p>` : ''}
            </div>
            <div class="minimized-content">
        `;

        if (enhancementItems.length === 0) {
            html += `<p style="color: #666;">${isZH ? '没有找到可强化的物品' : 'No enhanceable items found'}</p>`;
        } else {
            // 生成表头
            let tableHeader = `
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                        <tr style="background: #f0f0f0;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${isZH ? '物品名称' : 'Item Name'}</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">${isZH ? '物品等级' : 'Item Level'}</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">${isZH ? '基础成本' : 'Base Cost'}</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">${isZH ? '保护成本' : 'Protection Cost'}</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">${isZH ? '动作成本' : 'Action Cost'}</th>`;

            // 为每个选定的等级添加列
            for (const level of selectedLevels) {
                tableHeader += `
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">${isZH ? `+${level}成本/售价` : `+${level} Cost/Price`}</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">${isZH ? `+${level}耗时` : `+${level} Time`}</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; cursor: pointer;" class="sort-header" data-level="${level}" title="${isZH ? '点击按卖单时薪排序' : 'Click to sort by sell hourly rate'}">${isZH ? `+${level}时薪(卖/买)` : `+${level} Rate(Sell/Buy)`}</th>`;
            }

            tableHeader += `
                        </tr>
                    </thead>
                    <tbody>`;

            html += tableHeader;

            for (const item of enhancementItems) {
                // 获取汉化名称
                const zhName = ZHitemNames[item.hrid] || item.name;

                // 开始生成表格行
                let tableRow = `
                    <tr style="background: white;">
                        <td style="border: 1px solid #ddd; padding: 8px;" title="${item.name}">${zhName}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.itemLevel}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${numberFormatter(item.costs.baseCost, 2)}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${numberFormatter(item.costs.minProtectionCost, 2)}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${numberFormatter(item.costs.perActionCost, 2)}</td>`;

                // 为每个选定的等级添加数据
                for (const level of selectedLevels) {
                    const result = item.enhancementResults.find(r => r.targetLevel === level);
                    const cost = result?.totalCost || 0;
                    const sellPrice = result?.sellPrice || 0;
                    const buyPrice = result?.buyPrice || 0;
                    const time = result?.timeSpent || '';

                    // 计算时薪（扣除2%市场税）
                    const sellProfit = sellPrice > 0 ? (sellPrice * 0.98) - cost : 0;
                    const buyProfit = buyPrice > 0 ? (buyPrice * 0.98) - cost : 0;
                    const sellHourlyRate = sellPrice > 0 && time ? calculateHourlyRate(sellProfit, time) : 0;
                    const buyHourlyRate = buyPrice > 0 && time ? calculateHourlyRate(buyProfit, time) : 0;

                    // 添加成本/售价列
                    tableRow += `
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                            <div style="font-size: 11px;">
                                <div style="color: #666;">成本: ${numberFormatter(cost, 2)}</div>
                                <div style="color: ${sellPrice > 0 || buyPrice > 0 ? 'green' : '#999'};">
                                    售价: ${sellPrice > 0 || buyPrice > 0 ? formatPriceDisplay(sellPrice, buyPrice) : '-'}
                                </div>
                            </div>
                        </td>`;

                    // 添加耗时列
                    tableRow += `
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${time || '-'}</td>`;

                    // 添加时薪列
                    const protectAt = result?.protectAt || 0;
                    tableRow += `
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; background: ${sellHourlyRate > 0 ? '#e8f5e8' : sellHourlyRate < 0 ? '#ffe8e8' : '#f8f8f8'};">
                            <div style="font-size: 11px;">
                                <div style="color: ${sellHourlyRate > 0 ? 'green' : sellHourlyRate < 0 ? 'red' : '#999'}; font-weight: ${sellHourlyRate > 0 ? 'bold' : 'normal'};">
                                    卖: ${sellHourlyRate !== 0 ? numberFormatter(sellHourlyRate, 2) : '-'}/h
                                </div>
                                <div style="color: ${buyHourlyRate > 0 ? 'blue' : buyHourlyRate < 0 ? 'red' : '#999'};">
                                    买: ${buyHourlyRate !== 0 ? numberFormatter(buyHourlyRate, 2) : '-'}/h
                                </div>
                                ${protectAt > 0 ? `<div style="color: #666; font-size: 10px; margin-top: 2px;">保护: +${protectAt}/${result.protectCount.toFixed(1)}</div>` : ''}
                                ${result?.actions ? `<div style="color: #666; font-size: 10px; margin-top: 2px;">强化次数：${result.actions.toFixed(0)}</div>` : ''}
                            </div>
                        </td>`;
                }

                tableRow += `</tr>`;
                html += tableRow;
            }

            html += `
                    </tbody>
                </table>
            `;
        }

        html += `</div>`;

        panel.innerHTML = html;
        document.body.appendChild(panel);

        // 添加按钮事件监听器
        const minimizeButton = panel.querySelector('#minimize-button');
        const closeButton = panel.querySelector('#close-button');

        if (minimizeButton) {
            minimizeButton.addEventListener('click', () => {
                minimizeEnhancementPanel(panel);
            });
        }

        // 添加拖拽功能
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        panel.addEventListener('mousedown', (e) => {
            if (panel.classList.contains('minimized')) {
                isDragging = true;
                dragOffset.x = e.clientX - panel.offsetLeft;
                dragOffset.y = e.clientY - panel.offsetTop;
                panel.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && panel.classList.contains('minimized')) {
                panel.style.left = (e.clientX - dragOffset.x) + 'px';
                panel.style.top = (e.clientY - dragOffset.y) + 'px';
                panel.style.transform = 'none';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                panel.style.cursor = 'default';
            }
        });

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                panel.remove();
            });
        }

        // 存储当前数据用于排序
        window.currentEnhancementItems = enhancementItems;

        // 排序功能已通过全局函数 window.handleSortClick 实现

        // 添加测试按钮（仅用于调试）

        // 添加性能监控
        console.log(`批量强化成本计算完成，共处理 ${enhancementItems.length} 个物品`);
        if (enhancementItems.length > 0) {
            console.log('示例数据:', enhancementItems[0]);
        }
    }



    // 添加批量强化成本计算按钮
    function addBulkEnhancementCostsButton() {
        // 检查设置是否启用
        if (!settingsMap.bulkEnhancementCosts.isTrue) {
            return;
        }

        // 检查是否已存在按钮容器
        const existingContainer = document.getElementById('bulk-enhancement-costs-container');
        if (existingContainer) {
            return;
        }

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'bulk-enhancement-costs-container';
        buttonContainer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        // 计算按钮
        const calcButton = document.createElement('button');
        calcButton.id = 'bulk-enhancement-costs-button';
        calcButton.textContent = isZH ? '批量强化成本计算' : 'Bulk Enhancement Costs';
        calcButton.style.cssText = `
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;

        calcButton.onclick = async () => {
            calcButton.textContent = isZH ? '计算中...' : 'Calculating...';
            calcButton.disabled = true;

            // 获取用户设置
            const userSettings = getEnhancementSettings();

            // 显示进度提示
            const progressDiv = document.createElement('div');
            progressDiv.id = 'enhancement-progress';
            progressDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 2px solid #333;
                border-radius: 8px;
                padding: 20px;
                z-index: 10001;
                text-align: center;
            `;
            progressDiv.innerHTML = `
                <h3>${isZH ? '正在计算强化成本...' : 'Calculating enhancement costs...'}</h3>
                <p>${isZH ? '这可能需要几分钟时间，请耐心等待' : 'This may take several minutes, please wait'}</p>
                <p style="font-size: 12px; color: #666; margin-top: 5px;">${isZH ? '物品名称将显示为中文' : 'Item names will be displayed in Chinese'}</p>
                <p style="font-size: 12px; color: #666; margin-top: 5px;">${isZH ? `计算模式：${userSettings.calculation_mode === 'favorites' ? '仅收藏模式' : '全局模式'}` : `Mode: ${userSettings.calculation_mode === 'favorites' ? 'Favorites Only' : 'Global'}`}</p>
                <div style="margin-top: 10px;">
                    <div style="width: 200px; height: 20px; border: 1px solid #ccc; border-radius: 10px; overflow: hidden;">
                        <div id="progress-bar" style="width: 0%; height: 100%; background: #4CAF50; transition: width 0.3s;"></div>
                    </div>
                </div>
                <button id="cancel-calculation" style="margin-top: 10px; background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                    ${isZH ? '取消' : 'Cancel'}
                </button>
            `;
            document.body.appendChild(progressDiv);

            // 添加取消功能
            let isCancelled = false;
            const cancelButton = document.getElementById('cancel-calculation');
            cancelButton.onclick = () => {
                isCancelled = true;
                progressDiv.remove();
                calcButton.textContent = isZH ? '批量强化成本计算' : 'Bulk Enhancement Costs';
                calcButton.disabled = false;
            };

            try {
                console.log('开始计算强化成本...');
                const enhancementItems = await calculateAllEnhancementCosts(isCancelled);
                console.log('计算完成，结果数量:', enhancementItems.length);
                if (!isCancelled) {
                    progressDiv.remove();
                    showEnhancementCostsUI(enhancementItems);
                }
            } catch (error) {
                console.error('批量强化成本计算出错:', error);
                if (!isCancelled) {
                    progressDiv.remove();
                    alert(isZH ? '计算过程中出现错误，请查看控制台' : 'Error during calculation, please check console');
                }
            } finally {
                if (!isCancelled) {
                    calcButton.textContent = isZH ? '批量强化成本计算' : 'Bulk Enhancement Costs';
                    calcButton.disabled = false;
                }
            }
        };

        // 收藏按钮
        const favoriteButton = document.createElement('button');
        favoriteButton.id = 'enhancement-favorites-button';
        favoriteButton.textContent = isZH ? '收藏管理' : 'Favorites';
        favoriteButton.style.cssText = `
            background: #2196F3;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;

        favoriteButton.onclick = () => {
            showFavoritesManager();
        };

        buttonContainer.appendChild(calcButton);
        buttonContainer.appendChild(favoriteButton);

        // 设置按钮
        const settingsButton = document.createElement('button');
        settingsButton.id = 'enhancement-settings-button';

        // 函数：更新设置按钮上的时间戳
        function updateSettingsButtonTimestamp() {
            const apiTimestamp = localStorage.getItem('MWITools_api_timestamp1');
            let timestampText = '';
            if (apiTimestamp) {
                const date = new Date(parseInt(apiTimestamp) * 1000);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                timestampText = `${month}/${day} ${hours}:${minutes}`;
            }
            settingsButton.innerHTML = isZH ? `设置<br><span style="font-size: 10px;">${timestampText}</span>` : `Settings<br><span style="font-size: 10px;">${timestampText}</span>`;
        }

        // 添加事件监听器，当市场数据更新时刷新时间戳
        document.addEventListener('MWIMarketDataUpdated', updateSettingsButtonTimestamp);

        // 初始更新时间戳
        updateSettingsButtonTimestamp();

        settingsButton.style.cssText = `
            background: #FF9800;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            text-align: center;
            line-height: 1.5;
        `;
        settingsButton.onclick = () => {
            showEnhancementSettings();
        };
        buttonContainer.appendChild(settingsButton);

        // 强化分解计算按钮
        const decompositionButton = document.createElement('button');
        decompositionButton.id = 'enhancement-decomposition-button';
        decompositionButton.textContent = isZH ? '强化分解计算' : 'Enhancement Decomposition';
        decompositionButton.style.cssText = `
            background: #9C27B0;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            margin-top: 10px;
        `;
        decompositionButton.onclick = async () => {
            decompositionButton.textContent = isZH ? '计算中...' : 'Calculating...';
            decompositionButton.disabled = true;

            try {
                // 直接计算收藏物品分解
                await calculateFavoritesDecomposition();
            } catch (error) {
                console.error('强化分解计算出错:', error);
                alert(isZH ? '计算过程中出现错误，请查看控制台' : 'Error during calculation, please check console');
            } finally {
                decompositionButton.textContent = isZH ? '强化分解计算' : 'Enhancement Decomposition';
                decompositionButton.disabled = false;
            }
        };

    // 显示强化分解计算界面
    function showEnhancementDecomposition() {
        // 获取所有可强化物品
        const allEnhanceableItems = [];
        for (const [hrid, itemDetail] of Object.entries(initData_itemDetailMap)) {
            if (itemDetail && itemDetail.enhancementCosts && itemDetail.enhancementCosts.length > 0) {
                allEnhanceableItems.push({
                    hrid: hrid,
                    name: itemDetail.name,
                    zhName: getItemZhName(hrid) || itemDetail.name,
                });
            }
        }

        // 按中文名称排序
        allEnhanceableItems.sort((a, b) => a.zhName.localeCompare(b.zhName));

        // 获取分解收藏列表
        const decompositionFavorites = getDecompositionFavorites();

        // 创建面板
        const panel = document.createElement('div');
        panel.id = 'enhancement-decomposition-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            z-index: 10002;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #333;">${isZH ? '强化分解计算' : 'Enhancement Decomposition Calculation'}</h2>
                <div style="display: flex; gap: 10px;">
                    <button onclick="document.getElementById('enhancement-decomposition-panel').remove()"
                        style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        ${isZH ? '关闭' : 'Close'}
                    </button>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="display: inline-block; border: 1px solid #ccc; border-radius: 4px; overflow: hidden;">
                    <button id="view-all-items" class="tab-btn active" style="background: #f0f0f0; border: none; padding: 8px 16px; cursor: pointer;">
                        ${isZH ? '所有物品' : 'All Items'}
                    </button>
                    <button id="view-favorite-items" class="tab-btn" style="background: white; border: none; padding: 8px 16px; cursor: pointer;">
                        ${isZH ? '分解收藏' : 'Decomposition Favorites'}
                    </button>
                </div>
            </div>

            <div style="display: flex; gap: 20px; margin-bottom: 15px;">
                <div style="flex: 1;">
                    <h3 style="margin-top: 0;">${isZH ? '物品列表' : 'Items List'}</h3>
                    <div id="all-items-container" style="max-height: 300px; overflow-y: auto; border: 1px solid #ccc; border-radius: 4px; padding: 10px; display: block;">
                        ${allEnhanceableItems.map(item => `
                        <div style="padding: 5px; border-bottom: 1px solid #eee; cursor: pointer; ${decompositionFavorites.includes(item.hrid) ? 'background: #e6f7ff;' : ''}" onclick="calculateDecomposition('${item.hrid}')">
                            ${item.zhName} (${item.name}) ${decompositionFavorites.includes(item.hrid) ? '<span style="color: #2196F3; float: right;">★</span>' : ''}
                        </div>`).join('')}
                    </div>
                    <div id="favorite-items-container" style="max-height: 300px; overflow-y: auto; border: 1px solid #ccc; border-radius: 4px; padding: 10px; display: none;">
                        ${decompositionFavorites.length > 0 ? decompositionFavorites.map(hrid => {
                            const itemDetail = initData_itemDetailMap[hrid];
                            if (itemDetail) {
                                const zhName = getItemZhName(hrid) || itemDetail.name;
                                return `
                                <div style="padding: 5px; border-bottom: 1px solid #eee; cursor: pointer; background: #e6f7ff;" onclick="calculateDecomposition('${hrid}')">
                                    ${zhName} (${itemDetail.name}) <span style="color: #2196F3; float: right;">★</span>
                                </div>`;
                            }
                            return '';
                        }).join('') : `<p>${isZH ? '没有分解收藏的物品' : 'No decomposition favorite items'}</p>`}
                    </div>
                </div>
                <div style="flex: 1;">
                    <h3 style="margin-top: 0;">${isZH ? '分解产物' : 'Decomposition Products'}</h3>
                    <div id="decomposition-results" style="max-height: 300px; overflow-y: auto; border: 1px solid #ccc; border-radius: 4px; padding: 10px;">
                        <p>${isZH ? '请选择一个物品进行分解计算，或点击"计算收藏物品分解"按钮' : 'Please select an item to calculate decomposition, or click "Calculate Favorites Decomposition" button'}</p>
                    </div>
                </div>
            </div>
        `;

        panel.innerHTML = html;
        document.body.appendChild(panel);

        // 添加标签切换功能
        document.getElementById('view-all-items').addEventListener('click', function() {
            this.classList.add('active');
            this.style.background = '#f0f0f0';
            document.getElementById('view-favorite-items').classList.remove('active');
            document.getElementById('view-favorite-items').style.background = 'white';
            document.getElementById('all-items-container').style.display = 'block';
            document.getElementById('favorite-items-container').style.display = 'none';
        });

        document.getElementById('view-favorite-items').addEventListener('click', function() {
            this.classList.add('active');
            this.style.background = '#f0f0f0';
            document.getElementById('view-all-items').classList.remove('active');
            document.getElementById('view-all-items').style.background = 'white';
            document.getElementById('all-items-container').style.display = 'none';
            document.getElementById('favorite-items-container').style.display = 'block';
        });

    }

    // 计算所有收藏物品的分解产物，按每个物品分别显示（参考批量强化成本界面样式）
    async function calculateFavoritesDecomposition() {
        const decompositionFavorites = getDecompositionFavorites();

        // 显示进度提示
        const progressDiv = document.createElement('div');
        progressDiv.id = 'decomposition-progress';
        progressDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            z-index: 10001;
            text-align: center;
        `;
        progressDiv.innerHTML = `
            <h3>${isZH ? '正在计算分解产物...' : 'Calculating decomposition products...'}</h3>
            <p>${isZH ? '这可能需要几分钟时间，请耐心等待' : 'This may take several minutes, please wait'}</p>
            <div style="margin-top: 10px;">
                <div style="width: 200px; height: 20px; border: 1px solid #ccc; border-radius: 10px; overflow: hidden;">
                    <div id="decomposition-progress-bar" style="width: 0%; height: 100%; background: #9C27B0; transition: width 0.3s;"></div>
                </div>
            </div>
            <button id="cancel-decomposition" style="margin-top: 10px; background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                ${isZH ? '取消' : 'Cancel'}
            </button>
        `;
        document.body.appendChild(progressDiv);

        // 添加取消功能
        let isCancelled = false;
        const cancelButton = document.getElementById('cancel-decomposition');
        cancelButton.onclick = () => {
            isCancelled = true;
            progressDiv.remove();
        };

        // 创建结果面板
        let panel = document.getElementById('decomposition-results-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'decomposition-results-panel';
            panel.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 2px solid #333;
                border-radius: 8px;
                padding: 20px;
                z-index: 10002;
                width: 90%;
                max-width: 1800px;
                max-height: 80vh;
                overflow-y: auto;
                display: none;
            `;
            document.body.appendChild(panel);
        } else {
            panel.style.display = 'none';
        }

        if (decompositionFavorites.length === 0) {
            panel.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333;">${isZH ? '强化分解计算结果' : 'Enhancement Decomposition Results'}</h2>
                    <button onclick="document.getElementById('decomposition-results-panel').remove()"
                        style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        ${isZH ? '关闭' : 'Close'}
                    </button>
                </div>
                <p style="padding: 10px; text-align: center;">${isZH ? '没有分解收藏的物品' : 'No decomposition favorite items'}</p>
            `;
            return;
        }

        // 定义强化等级范围
        const minEnhancementLevel = 0;
        const maxEnhancementLevel = 15;

        const failedItems = [];

        // 获取市场价格数据
        const price_data = await fetchMarketJSON();
        if (!price_data || !price_data.marketData) {
            panel.innerHTML = `<p style="color: red; padding: 10px;">${isZH ? '无法获取市场价格数据' : 'Failed to fetch market price data'}</p>`;
            progressDiv.remove();
            return;
        }

        // 读取marketdataenhance数据
        const marketDataEnhanceStr = localStorage.getItem('marketdataenhance');
        const marketDataEnhance = marketDataEnhanceStr ? JSON.parse(marketDataEnhanceStr) : { marketData: {} };

        // 获取催化剂价格
        const decompositionCatalystHrid = '/items/catalyst_of_decomposition';
        const primeCatalystHrid = '/items/prime_catalyst';
        const decompositionCatalystPrice = getItemMarketPrice(decompositionCatalystHrid, price_data) || 0;
        const primeCatalystPrice = getItemMarketPrice(primeCatalystHrid, price_data) || 0;


            // 获取强化精华的价格，优先使用用户自定义价格
            const enhancingEssenceHrid = '/items/enhancing_essence';
            const marketEnhancingEssencePrice = getItemMarketPrice(enhancingEssenceHrid, price_data) || 0;
            // 尝试从localStorage获取用户自定义的强化精华价格
            const userEnhancingEssencePrice = localStorage.getItem('enhancing_essence') ? parseFloat(localStorage.getItem('enhancing_essence')) : null;
            // 如果用户有设置自定义价格且不为0，则使用自定义价格，否则使用市场价格
            const enhancingEssencePrice = userEnhancingEssencePrice && userEnhancingEssencePrice > 0 ? userEnhancingEssencePrice : marketEnhancingEssencePrice;

        let resultsHtml = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #333;">${isZH ? '强化分解计算结果' : 'Enhancement Decomposition Results'}</h2>
                <button onclick="document.getElementById('decomposition-results-panel').remove()"
                    style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                    ${isZH ? '关闭' : 'Close'}
                </button>
            </div>
            <div style="padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 15px;">
                <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                    <div style="flex: 1; min-width: 200px;">
                        <span style="font-weight: bold;">${isZH ? '分解催化剂价格: ' : 'Decomposition Catalyst Price: '}</span>
                        <span>${(decompositionCatalystPrice)}</span>
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <span style="font-weight: bold;">${isZH ? '至高催化剂价格: ' : 'Prime Catalyst Price: '}</span>
                        <span>${(primeCatalystPrice)}</span>
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <span style="font-weight: bold;">${isZH ? '强化精华价格: ' : 'Enhancing Essence Price: '}</span>
                        <span>${(enhancingEssencePrice)} ${userEnhancingEssencePrice ? '(' + isZH ? '市场右边价格:' : 'User Defined' + ')' : ''} ${(marketEnhancingEssencePrice)}</span>
                    </div>
                </div>
            </div>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                        <tr style="background: #f0f0f0;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${isZH ? '物品名称' : 'Item Name'}</th>

                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+0级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+1级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+2级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+3级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+4级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background: #e6f7ff;">+5级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+6级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+7级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+8级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+9级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background: #e6f7ff;">+10级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+11级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+12级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+13级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+14级</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">+15级</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // 特殊物品分解映射表
        const specialDecompositionItems = {
            'gobo_shooter': { essence: 'gobo_essence', quantity: 1000, name: '哥布林弹弓' },
            'gator_vest': { essence: 'swamp_essence', quantity: 400, name: '鳄鱼马甲' },
            'gobo_defender': { essence: 'gobo_essence', quantity: 5000, name: '哥布林防御者' },
            'gobo_slasher': { essence: 'gobo_essence', quantity: 500, name: '哥布林关刀' },
            'gobo_boomstick': { essence: 'gobo_essence', quantity: 1000, name: '哥布林火棍' },
            'gobo_smasher': { essence: 'gobo_essence', quantity: 500, name: '哥布林狼牙棒' },
            'gobo_stabber': { essence: 'gobo_essence', quantity: 500, name: '哥布林长剑' },
            'tome_of_healing': { essence: 'jungle_essence', quantity: 500, name: '治疗之书' },
            'tome_of_the_elements': { essence: 'sorcerer_essence', quantity: 5000, name: '元素之书' }
        };


        // 更新进度条
        const progressBar = document.getElementById('decomposition-progress-bar');
        let processedCount = 0;

        decompositionFavorites.forEach(hrid => {
            if (isCancelled) return;

            processedCount++;
            const progress = (processedCount / decompositionFavorites.length) * 100;
            progressBar.style.width = `${progress}%`;
            const itemDetail = initData_itemDetailMap[hrid];
            if (!itemDetail) {
                failedItems.push({ hrid, name: hrid });
                return;
            }

            // 直接调用基础成本计算时的配方相关代码
            const actionHrid = getActionHridFromItemName(itemDetail.name);
            // 检查是否为特殊分解物品
            const itemKey = hrid.split('/').pop();
            let inputItems = [];
            let actionDetail;
            let itemName;

            if (specialDecompositionItems[itemKey]) {
                // 处理特殊物品分解
                const specialItem = specialDecompositionItems[itemKey];
                itemName = getItemZhName(hrid) || itemDetail.name || specialItem.name;

                // 构建特殊分解产物
                const essenceHrid = '/items/' + specialItem.essence;
                inputItems = [{ itemHrid: essenceHrid, quantity: specialItem.quantity }];
            } else {
                // 非特殊物品，使用原有逻辑
                actionDetail = initData_actionDetailMap[actionHrid];
                itemName = getItemZhName(hrid) || itemDetail.name;

                if (!actionDetail) {
                    failedItems.push({ hrid, name: itemName });
                    return;
                }

                // 使用与基础成本计算相同的逻辑获取配方输入物品
                if (actionDetail.inputItems) {
                    // 基础成本计算中使用的输入物品字段
                    inputItems = JSON.parse(JSON.stringify(actionDetail.inputItems));
                } else if (actionDetail.inputs) {
                    // 兼容原有的分解产物字段
                    inputItems = actionDetail.inputs;
                }
            }

            if (!inputItems || inputItems.length === 0) {
                failedItems.push({ hrid, name: itemName });
                return;
            }

            // 当前物品的分解产物
            const itemProducts = {};

            // 处理输入物品
            inputItems.forEach(product => {
                if (!itemProducts[product.itemHrid]) {
                    itemProducts[product.itemHrid] = {
                        name: getItemZhName(product.itemHrid) || initData_itemDetailMap[product.itemHrid].name,
                        quantity: 0
                    };
                }
                // 确保数量是有效的数字（参考基础价格计算中的处理方式）
                const quantity = parseFloat(product.count || product.quantity) || 0;
                itemProducts[product.itemHrid].quantity += quantity;
            });

            // 处理升级物品（如果有）
            if (actionDetail) {
                const upgradedFromItemHrid = actionDetail.upgradeItemHrid;
                if (upgradedFromItemHrid) {
                    if (!itemProducts[upgradedFromItemHrid]) {
                        itemProducts[upgradedFromItemHrid] = {
                            name: getItemZhName(upgradedFromItemHrid) || initData_itemDetailMap[upgradedFromItemHrid].name,
                            quantity: 0
                        };
                    }
                    itemProducts[upgradedFromItemHrid].quantity += 1;
                }
            }

            // 按数量降序排序
            const sortedItemProducts = Object.entries(itemProducts).sort((a, b) => b[1].quantity - a[1].quantity);

            // 生成产物列表HTML
            let productsListHtml = '';
            sortedItemProducts.forEach(([prodHrid, product]) => {
                productsListHtml += `
                    <div style="padding: 3px 0; border-bottom: 1px solid #eee;">
                        ${product.name} x ${product.quantity}
                    </div>
                `;
            });

            // 计算强化精华（针对不同强化等级）
            const itemLevel = itemDetail.itemLevel || 1; // 获取物品等级（与批量强化成本计算保持一致）

            // 计算分解产物的总价
            let decompositionProductsTotalPrice = 0;
            sortedItemProducts.forEach(([prodHrid, product]) => {
                const productPrice = getItemMarketPrice(prodHrid, price_data) || 0;
                decompositionProductsTotalPrice += productPrice * product.quantity;
            });

            // 存储各强化等级的精华总价(分解产物价格+强化精华价格)和市场价格
            const essenceTotalPrices = [];
            const marketPrices = [];
            for (let enhancementLevel = minEnhancementLevel; enhancementLevel <= maxEnhancementLevel; enhancementLevel++) {
                // 计算公式: +0级时为0，其他等级使用原公式
                let essenceCount;
                if (enhancementLevel === 0) {
                    essenceCount = 0;
                } else {
                    essenceCount = (0.1 * Math.pow(1.05, itemLevel) + 0.5) * 2 * Math.pow(2, enhancementLevel);
                }
                const roundedEssenceCount = Math.round(essenceCount);
                // 计算强化精华总价 = 分解产物总价 + 强化精华数量 * 强化精华价格
                const totalPrice = decompositionProductsTotalPrice + (roundedEssenceCount * enhancingEssencePrice);
                essenceTotalPrices.push(totalPrice);

                // 获取市场价格
                const enPath = hrid;
                const marketPrice = marketDataEnhance.marketData[enPath]?.[enhancementLevel]?.a || 0;
                marketPrices.push(marketPrice);
            }

            // 计算所有等级的利润(diff)并检查是否都小于等于0
            const allDiffsNonPositive = essenceTotalPrices.every((price, index) => {
                const marketPrice = marketPrices[index];
                const value1 = (price - decompositionCatalystPrice) * 0.7234 * 0.98;
                const value2 = (price - primeCatalystPrice) * 0.7834 * 0.98;
                const value3 = price * 0.6334 * 0.98; // 不使用催化剂，概率63.34%
                const maxValue = Math.max(value1, value2, value3);
                const diff = marketPrice > 0 ? (maxValue - marketPrice) : 0;
                return diff <= 10000;
            });

            // 只有当不是所有等级的利润都小于等于0时，才添加到表格行
            if (!allDiffsNonPositive) {
                resultsHtml += `
                            <tr style="background: white; transition: background-color 0.2s;">
                                <td style="border: 1px solid #ddd; padding: 10px; vertical-align: top; font-weight: bold;">
                                    ${itemName}
                                </td>

                                ${essenceTotalPrices.map((price, index) => {
                                    const marketPrice = marketPrices[index];
                                    // 计算两个公式的值
                                    const value1 = (price - decompositionCatalystPrice) * 0.7234 * 0.98;
                                    const value2 = (price - primeCatalystPrice) * 0.7834 * 0.98;
                                    const value3 = price * 0.6334 * 0.98; // 不使用催化剂，概率63.34%
                                    // 比较并获取较大值
                                    let maxValue, type;
                                    maxValue = Math.max(value1, value2, value3);
                                    if (maxValue === value1) {
                                        type = isZH ? '分解' : 'Decompose';
                                    } else if (maxValue === value2) {
                                        type = isZH ? '至高' : 'Prime';
                                    } else {
                                        type = isZH ? '无' : 'None';
                                    }
                                    // 计算与市场价的差值
                                    const diff = marketPrice > 0 ? (maxValue - marketPrice) : 0;
                                    return `
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; ${diff > 10000 ? 'background: #ffffcc;' : ''}">
                                    ${numberFormatter(price)}
                                    <div style="font-size: 10px; color: #666;">${marketPrice > 0 ? numberFormatter(marketPrice) : '-'} +${minEnhancementLevel + index}</div>
                                    <div style="font-size: 10px; color: ${diff > 0 ? 'green' : diff < 0 ? 'red' : '#888888'};">${numberFormatter(diff)}(${type})</div>
                                </td>`;
                                }).join('')}
                            </tr>
                `;
            }
        });

        resultsHtml += `
                    </tbody>
                </table>
            </div>
        `;

        // 添加分解失败的物品
        if (failedItems.length > 0) {
            resultsHtml += `
                <div style="margin-top: 15px; padding: 10px; border: 1px solid #ff4444; border-radius: 5px; background-color: #fff2f2;">
                    <h4 style="margin-top: 0; color: #ff4444;">${isZH ? '无法分解的物品' : 'Items that cannot be decomposed'}:</h4>
                    <div style="max-height: 200px; overflow-y: auto;">
            `;

            failedItems.forEach(item => {
                resultsHtml += `
                        <div style="padding: 5px; border-bottom: 1px solid #ffeeee; color: #ff4444;">
                            ${item.name}
                        </div>
                `;
            });

            resultsHtml += `
                    </div>
                </div>
            `;
        }

        // 移除进度条


        progressDiv.remove();

        if (isCancelled) {
            // 如果取消了计算，清理结果面板
            if (panel) {
                panel.remove();
            }
            return;
        }

        // 设置面板内容并显示
        panel.innerHTML = resultsHtml;
        panel.style.display = 'block';
    }

    // 计算分解产物
    async function calculateDecomposition(itemHrid) {
        const resultsDiv = document.getElementById('decomposition-results');
        const itemDetail = initData_itemDetailMap[itemHrid];
        const itemName = getItemZhName(itemHrid) || itemDetail.name;

        // 显示加载中状态
        resultsDiv.innerHTML = `<p>${isZH ? '正在加载价格数据...' : 'Loading price data...'}</p>`;

        try {
            // 获取市场价格数据
            const price_data = await fetchMarketJSON();
            if (!price_data || !price_data.marketData) {
                resultsDiv.innerHTML = `<p style="color: red; padding: 10px;">${isZH ? '无法获取市场价格数据' : 'Failed to fetch market price data'}</p>`;
                return;
            }

            // 获取催化剂和强化精华价格
            const decompositionCatalystHrid = '/items/catalyst_of_decomposition';
            const primeCatalystHrid = '/items/prime_catalyst';
            const enhancingEssenceHrid = '/items/enhancing_essence';

            const decompositionCatalystPrice = getItemMarketPrice(decompositionCatalystHrid, price_data) || 0;
            const primeCatalystPrice = getItemMarketPrice(primeCatalystHrid, price_data) || 0;
            const marketEnhancingEssencePrice = getItemMarketPrice(enhancingEssenceHrid, price_data) || 0;

            // 尝试从localStorage获取用户自定义的强化精华价格
            const userEnhancingEssencePrice = localStorage.getItem('enhancing_essence') ? parseFloat(localStorage.getItem('enhancing_essence')) : null;
            // 如果用户有设置自定义价格，则使用自定义价格，否则使用市场价格
            const enhancingEssencePrice = userEnhancingEssencePrice || marketEnhancingEssencePrice;

            // 获取物品配方
            const actionHrid = getActionHridFromItemName(itemDetail.name);
            let decompositionProducts = [];

            if (actionHrid && initData_actionDetailMap[actionHrid]) {
                const actionDetail = initData_actionDetailMap[actionHrid];
                if (actionDetail.inputs && actionDetail.inputs.length > 0) {
                    decompositionProducts = actionDetail.inputs;
                }
            }

        // 检查是否为特殊分解物品
        const itemKey = itemHrid.split('/').pop();
        if (specialDecompositionItems[itemKey]) {
            // 处理特殊物品分解
            const specialItem = specialDecompositionItems[itemKey];
            const essenceHrid = '/items/' + specialItem.essence;
            decompositionProducts = [{ itemHrid: essenceHrid, quantity: specialItem.quantity }];
        } else if (decompositionProducts.length === 0) {
            resultsDiv.innerHTML = `<p>${isZH ? '未找到该物品的配方信息' : 'No recipe information found for this item'}</p>`;
            return;
        }

        // 生成分解产物HTML
        let productsHtml = `
            <div style="padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 15px;">
                <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                    <div style="flex: 1; min-width: 200px;">
                        <span style="font-weight: bold;">${isZH ? '分解催化剂价格: ' : 'Decomposition Catalyst Price: '}</span>
                        <span>${numberFormatter(decompositionCatalystPrice)}</span>
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <span style="font-weight: bold;">${isZH ? '至高催化剂价格: ' : 'Prime Catalyst Price: '}</span>
                        <span>${numberFormatter(primeCatalystPrice)}</span>
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <span style="font-weight: bold;">${isZH ? '强化精华价格: ' : 'Enhancing Essence Price: '}</span>
                        <span>${numberFormatter(enhancingEssencePrice)} ${userEnhancingEssencePrice ? '(' + isZH ? '用户自定义' : 'User Defined' + ')' : ''}</span>
                    </div>
                </div>
            </div>
            <h4>${isZH ? '分解 ' : 'Decompose '}${itemName} ${isZH ? '可获得' : 'to get'}:</h4>
            <ul style="list-style-type: none; padding: 0;">
        `;

        decompositionProducts.forEach(product => {
            const productDetail = initData_itemDetailMap[product.itemHrid];
            const productName = getItemZhName(product.itemHrid) || productDetail.name;
            productsHtml += `
                <li style="padding: 5px; border-bottom: 1px solid #eee;">
                    ${productName} x ${product.quantity}
                </li>
            `;
        });

        productsHtml += `
            </ul>
        `;
        resultsDiv.innerHTML = productsHtml;
        } catch (error) {
            console.error('计算分解产物时出错:', error);
            resultsDiv.innerHTML = `<p style="color: red; padding: 10px;">${isZH ? '计算分解产物时出错' : 'Error calculating decomposition products'}</p>`;
        }
    }
        buttonContainer.appendChild(decompositionButton);

        document.body.appendChild(buttonContainer);
    }

    // 获取分解收藏列表
    function getDecompositionFavorites() {
        try {
            const decompositionFavorites = localStorage.getItem('decomposition_favorites');
            return decompositionFavorites ? JSON.parse(decompositionFavorites) : [];
        } catch (error) {
            console.error('获取分解收藏列表时出错:', error);
            return [];
        }
    }

    // 添加分解收藏
    function addDecompositionFavorite(hrid) {
        console.log('添加分解收藏:', hrid);
        const decompositionFavorites = getDecompositionFavorites();
        if (decompositionFavorites.includes(hrid)) {
            alert(isZH ? '该物品已在分解收藏列表中' : 'This item is already in decomposition favorites');
            return;
        }

        decompositionFavorites.push(hrid);
        localStorage.setItem('decomposition_favorites', JSON.stringify(decompositionFavorites));
        console.log('分解收藏已添加，当前收藏列表:', decompositionFavorites);

        // 更新当前面板中的按钮状态
        const panel = document.getElementById('favorites-manager-panel');
        if (panel) {
            const row = panel.querySelector(`.favorites-item-row[data-hrid="${hrid}"]`);
            if (row) {
                const button = row.querySelector('.decomposition-favorite-btn');
                if (button) {
                    button.textContent = isZH ? '取消分解收藏' : 'Unfavorite Decomposition';
                    button.style.background = '#ff4444';
                    button.setAttribute('data-action', 'remove');
                }
                // 检查是否仍是强化收藏
                const isStillFavorite = getEnhancementFavorites().includes(hrid);
                row.style.background = isStillFavorite ? '#e6fff0' : '#e6f7ff';
            }
        }
    }

    // 移除分解收藏
    function removeDecompositionFavorite(hrid) {
        console.log('移除分解收藏:', hrid);
        const decompositionFavorites = getDecompositionFavorites();
        const newDecompositionFavorites = decompositionFavorites.filter(item => item !== hrid);
        localStorage.setItem('decomposition_favorites', JSON.stringify(newDecompositionFavorites));
        console.log('分解收藏已移除，当前收藏列表:', newDecompositionFavorites);

        // 更新当前面板中的按钮状态
        const panel = document.getElementById('favorites-manager-panel');
        if (panel) {
            const row = panel.querySelector(`.favorites-item-row[data-hrid="${hrid}"]`);
            if (row) {
                const button = row.querySelector('.decomposition-favorite-btn');
                if (button) {
                    button.textContent = isZH ? '添加分解收藏' : 'Favorite Decomposition';
                    button.style.background = '#2196F3';
                    button.setAttribute('data-action', 'add');
                }
                // 检查是否仍是强化收藏
                const isStillFavorite = getEnhancementFavorites().includes(hrid);
                row.style.background = isStillFavorite ? '#fff3cd' : 'white';
            }
        }
    }

    // 显示收藏管理器
    function showFavoritesManager() {
        // 获取收藏列表
        const favorites = getEnhancementFavorites();
        const decompositionFavorites = getDecompositionFavorites();

        // 获取所有可强化物品
        const allEnhanceableItems = [];
        for (const [hrid, itemDetail] of Object.entries(initData_itemDetailMap)) {
            if (itemDetail && itemDetail.enhancementCosts && itemDetail.enhancementCosts.length > 0) {
                allEnhanceableItems.push({
                    hrid: hrid,
                    name: itemDetail.name,
                    zhName: getItemZhName(hrid) || itemDetail.name,
                    isFavorite: favorites.includes(hrid),
                    isDecompositionFavorite: decompositionFavorites.includes(hrid)
                });
            }
        }

        // 按中文名称排序
        allEnhanceableItems.sort((a, b) => a.zhName.localeCompare(b.zhName));

        // 创建面板
        const panel = document.createElement('div');
        panel.id = 'favorites-manager-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            z-index: 10002;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #333;">${isZH ? '强化物品收藏管理' : 'Enhancement Favorites Manager'}</h2>
                <button onclick="document.getElementById('favorites-manager-panel').remove()"
                        style="background: #ff4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    ${isZH ? '关闭' : 'Close'}
                </button>
            </div>
            <div style="margin-bottom: 15px;">
                <p style="margin: 0; color: #666;">${isZH ? `共找到 ${allEnhanceableItems.length} 个可强化物品，其中 ${favorites.length} 个已收藏，${decompositionFavorites.length} 个已分解收藏` :
                `Found ${allEnhanceableItems.length} enhanceable items, ${favorites.length} are favorited, ${decompositionFavorites.length} are decomposition favorited`}</p>
            </div>
            <div style="margin-bottom: 15px;">
                <input type="text" id="favorites-search-input" placeholder="${isZH ? '搜索物品名称...' : 'Search item names...'}"
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
            </div>
        `;

        // 显示所有可强化物品列表
        html += `
            <div class="favorites-scroll-container" style="max-height: 500px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                        <tr style="background: #f0f0f0;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${isZH ? '物品名称' : 'Item Name'}</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">${isZH ? '强化收藏' : 'Enhancement Favorite'}</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">${isZH ? '分解收藏' : 'Decomposition Favorite'}</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        for (const item of allEnhanceableItems) {
            const favoriteButtonText = item.isFavorite ? (isZH ? '取消收藏' : 'Unfavorite') : (isZH ? '添加收藏' : 'Favorite');
            const favoriteButtonColor = item.isFavorite ? '#ff4444' : '#4CAF50';

            const decompositionButtonText = item.isDecompositionFavorite ? (isZH ? '取消分解收藏' : 'Unfavorite Decomposition') : (isZH ? '添加分解收藏' : 'Favorite Decomposition');
            const decompositionButtonColor = item.isDecompositionFavorite ? '#ff4444' : '#2196F3';

            // 设置行背景色：同时是两种收藏为浅蓝绿色，仅强化收藏为浅黄色，仅分解收藏为浅蓝色，都不是为白色
            let rowBackgroundColor = 'white';
            if (item.isFavorite && item.isDecompositionFavorite) {
                rowBackgroundColor = '#e6fff0';
            } else if (item.isFavorite) {
                rowBackgroundColor = '#fff3cd';
            } else if (item.isDecompositionFavorite) {
                rowBackgroundColor = '#e6f7ff';
            }

            html += `
                <tr class="favorites-item-row" data-zh-name="${item.zhName.toLowerCase()}" data-en-name="${item.name.toLowerCase()}" data-hrid="${item.hrid}" style="background: ${rowBackgroundColor};">
                    <td style="border: 1px solid #ddd; padding: 8px;" title="${item.name}">${item.zhName}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                        <button class="favorite-btn" data-hrid="${item.hrid}" data-action="${item.isFavorite ? 'remove' : 'add'}"
                                style="background: ${favoriteButtonColor}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                            ${favoriteButtonText}
                        </button>
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                        <button class="decomposition-favorite-btn" data-hrid="${item.hrid}" data-action="${item.isDecompositionFavorite ? 'remove' : 'add'}"
                                style="background: ${decompositionButtonColor}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                            ${decompositionButtonText}
                        </button>
                    </td>
                </tr>
            `;
        }

        html += `
                    </tbody>
                </table>
            </div>
        `;

        panel.innerHTML = html;
        document.body.appendChild(panel);

        // 添加事件监听器
        const favoriteButtons = panel.querySelectorAll('.favorite-btn');
        favoriteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const hrid = this.getAttribute('data-hrid');
                const action = this.getAttribute('data-action');

                if (action === 'add') {
                    addEnhancementFavoriteFromList(hrid);
                } else if (action === 'remove') {
                    removeEnhancementFavorite(hrid);
                }
            });
        });

        // 为分解收藏按钮添加点击事件
        const decompositionFavoriteButtons = panel.querySelectorAll('.decomposition-favorite-btn');
        decompositionFavoriteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const hrid = this.getAttribute('data-hrid');
                const action = this.getAttribute('data-action');

                if (action === 'add') {
                    addDecompositionFavorite(hrid);
                } else if (action === 'remove') {
                    removeDecompositionFavorite(hrid);
                }
            });
        });

        // 添加搜索功能
        const searchInput = panel.querySelector('#favorites-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                const rows = panel.querySelectorAll('.favorites-item-row');
                let visibleCount = 0;

                rows.forEach(row => {
                    const zhName = row.getAttribute('data-zh-name');
                    const enName = row.getAttribute('data-en-name');
                    const matches = !searchTerm || zhName.includes(searchTerm) || enName.includes(searchTerm);

                    row.style.display = matches ? '' : 'none';
                    if (matches) visibleCount++;
                });

                // 更新显示数量
                const countText = panel.querySelector('p');
                if (countText) {
                    const totalItems = allEnhanceableItems.length;
                    const favoritesCount = favorites.length;
                    if (searchTerm) {
                        countText.textContent = isZH ?
                            `搜索 "${searchTerm}" 找到 ${visibleCount} 个物品，共 ${totalItems} 个可强化物品，其中 ${favoritesCount} 个已收藏` :
                            `Search "${searchTerm}" found ${visibleCount} items, total ${totalItems} enhanceable items, ${favoritesCount} are favorited`;
                    } else {
                        countText.textContent = isZH ?
                            `共找到 ${totalItems} 个可强化物品，其中 ${favoritesCount} 个已收藏` :
                            `Found ${totalItems} enhanceable items, ${favoritesCount} are favorited`;
                    }
                }
            });
        }
    }

    // 更新收藏数量统计信息
    function updateFavoritesCount(panel, newFavoritesCount) {
        const countText = panel.querySelector('p');
        if (countText) {
            const searchInput = panel.querySelector('#favorites-search-input');
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const totalItems = panel.querySelectorAll('.favorites-item-row').length;
            const visibleRows = panel.querySelectorAll('.favorites-item-row:not([style*="display: none"])');
            const visibleCount = visibleRows.length;

            if (searchTerm) {
                countText.textContent = isZH ?
                    `搜索 "${searchTerm}" 找到 ${visibleCount} 个物品，共 ${totalItems} 个可强化物品，其中 ${newFavoritesCount} 个已收藏` :
                    `Search "${searchTerm}" found ${visibleCount} items, total ${totalItems} enhanceable items, ${newFavoritesCount} are favorited`;
            } else {
                countText.textContent = isZH ?
                    `共找到 ${totalItems} 个可强化物品，其中 ${newFavoritesCount} 个已收藏` :
                    `Found ${totalItems} enhanceable items, ${newFavoritesCount} are favorited`;
            }
        }
    }

    // 获取强化收藏列表
    function getEnhancementFavorites() {
        try {
            const favorites = localStorage.getItem('enhancement_favorites');
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('获取收藏列表时出错:', error);
            return [];
        }
    }



    // 移除强化收藏
    function removeEnhancementFavorite(hrid) {
        console.log('移除收藏:', hrid);
        const favorites = getEnhancementFavorites();
        const newFavorites = favorites.filter(item => item !== hrid);
        localStorage.setItem('enhancement_favorites', JSON.stringify(newFavorites));
        console.log('收藏已移除，当前收藏列表:', newFavorites);

        // 直接更新当前面板中的按钮状态
        const panel = document.getElementById('favorites-manager-panel');
        if (panel) {
            const row = panel.querySelector(`[data-hrid="${hrid}"]`).closest('.favorites-item-row');
            if (row) {
                // 更新按钮
                const button = row.querySelector('.favorite-btn');
                if (button) {
                    button.textContent = isZH ? '添加收藏' : 'Favorite';
                    button.style.background = '#4CAF50';
                    button.setAttribute('data-action', 'add');
                }

                // 更新行背景色
                row.style.background = 'white';

                // 更新统计信息
                updateFavoritesCount(panel, newFavorites.length);
            }
        }
    }

    // 从列表中添加收藏
    function addEnhancementFavoriteFromList(hrid) {
        console.log('添加收藏:', hrid);
        const favorites = getEnhancementFavorites();
        if (favorites.includes(hrid)) {
            alert(isZH ? '该物品已在收藏列表中' : 'This item is already in favorites');
            return;
        }

        favorites.push(hrid);
        localStorage.setItem('enhancement_favorites', JSON.stringify(favorites));
        console.log('收藏已添加，当前收藏列表:', favorites);

        // 直接更新当前面板中的按钮状态
        const panel = document.getElementById('favorites-manager-panel');
        if (panel) {
            const row = panel.querySelector(`[data-hrid="${hrid}"]`).closest('.favorites-item-row');
            if (row) {
                // 更新按钮
                const button = row.querySelector('.favorite-btn');
                if (button) {
                    button.textContent = isZH ? '取消收藏' : 'Unfavorite';
                    button.style.background = '#ff4444';
                    button.setAttribute('data-action', 'remove');
                }

                // 更新行背景色
                row.style.background = '#fff3cd';

                // 更新统计信息
                updateFavoritesCount(panel, favorites.length);
            }
        }
    }


    // 初始化时更新input_data使用用户设置
    updateInputDataWithUserSettings();

    // 事件委托 - 在document级别监听排序点击
    // 确保只添加一次事件监听器
    if (!window.sortClickHandlerAdded) {
        document.addEventListener('click', function(event) {
            console.log('Document click event triggered, target:', event.target);
            console.log('Target classes:', event.target.classList);

            // 检查是否点击了排序表头
            if (event.target.classList.contains('sort-header')) {
                const level = parseInt(event.target.getAttribute('data-level'));
                console.log('点击排序表头，等级:', level);

                // 初始化排序状态
                if (!window.sortState) {
                    window.sortState = { level: null, count: 0 };
                }

                // 如果是同一个等级，增加计数
                if (window.sortState.level === level) {
                    window.sortState.count++;
                } else {
                    // 不同等级，重置状态
                    window.sortState = { level: level, count: 1 };
                }

                console.log('排序状态:', window.sortState);

                // 根据计数决定排序类型
                let sortType = 'sell';
                if (window.sortState.count === 2) {
                    sortType = 'buy';
                } else if (window.sortState.count >= 3) {
                    // 第三次点击恢复默认排序
                    window.sortState = { level: null, count: 0 };
                    sortType = 'default';
                }

                console.log('执行排序，类型:', sortType);
                sortByHourlyRate(level, sortType);
            }
        });
        window.sortClickHandlerAdded = true;
        console.log('排序事件监听器已添加');
    }

    // 显示强化设置界面
    function showEnhancementSettings() {
        // 移除已存在的设置面板
        const existingPanel = document.getElementById('enhancement-settings-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // 获取当前设置
        const currentSettings = getEnhancementSettings();

        // 创建设置面板
        const panel = document.createElement('div');
        panel.id = 'enhancement-settings-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            z-index: 10001;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #333;">${isZH ? '强化设置' : 'Enhancement Settings'}</h2>
                <button onclick="document.getElementById('enhancement-settings-panel').remove()" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    ${isZH ? '关闭' : 'Close'}
                </button>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">
                    ${isZH ? 'Enhancing 技能等级' : 'Enhancing Skill Level'}:
                </label>
                <input type="number" id="enhancing-level" value="${currentSettings.enhancing_level}" min="1" max="200" step="1" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <small style="color: #666;">${isZH ? '人物 Enhancing 技能等级' : 'Character Enhancing skill level'}</small>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">
                    ${isZH ? '实验室等级' : 'Laboratory Level'}:
                </label>
                <input type="number" id="laboratory-level" value="${currentSettings.laboratory_level}" min="1" max="10" step="1" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <small style="color: #666;">${isZH ? '房子实验室等级' : 'House laboratory level'}</small>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">
                    ${isZH ? '强化工具加成' : 'Enhancer Bonus'}:
                </label>
                <input type="number" id="enhancer-bonus" value="${currentSettings.enhancer_bonus}" min="0" max="20" step="0.01" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <small style="color: #666;">${isZH ? '工具提高成功率，10级星空强化工具=5.42' : 'Tool success rate bonus, 10-level Starry Enhancement Tool = 5.42'}</small>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">
                    ${isZH ? '手套加成' : 'Glove Bonus'}:
                </label>
                <input type="number" id="glove-bonus" value="${currentSettings.glove_bonus}" min="10" max="15" step="0.1" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <small style="color: #666;">${isZH ? '手套提高强化速度，0级=10，5级=11.2，10级=12.9' : 'Glove enhancement speed bonus, 0-level=10, 5-level=11.2, 10-level=12.9'}</small>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">
                    ${isZH ? '强化精华价格' : 'Enhancing Essence Price'}:
                </label>
                <input type="number" id="enhancing-essence-price" value="${localStorage.getItem('enhancing_essence') || '1000'}" min="1" step="1" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <small style="color: #666;">${isZH ? '设置强化精华的价格' : 'Set the price for Enhancing Essence'}</small>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">
                    ${isZH ? '计算模式' : 'Calculation Mode'}:
                </label>
                <select id="calculation-mode" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="all" ${currentSettings.calculation_mode === 'all' ? 'selected' : ''}>
                        ${isZH ? '全局计算 - 计算所有可强化物品' : 'Global Calculation - Calculate all enhanceable items'}
                    </option>
                    <option value="favorites" ${currentSettings.calculation_mode === 'favorites' ? 'selected' : ''}>
                        ${isZH ? '仅收藏物品 - 只计算收藏的物品' : 'Favorites Only - Calculate only favorited items'}
                    </option>
                </select>
                <small style="color: #666;">${isZH ? '选择计算模式，影响批量强化成本计算的范围' : 'Select calculation mode, affects the scope of bulk enhancement cost calculation'}</small>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">
                    ${isZH ? '强化等级选择' : 'Enhancement Levels'}:
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 5px;">
                    ${[5, 6, 7, 8, 9, 10].map(level => `
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="checkbox" id="level-${level}" value="${level}"
                                ${currentSettings.enhancement_levels && currentSettings.enhancement_levels.includes(level) ? 'checked' : ''}
                                style="margin: 0;">
                            <span>+${level}</span>
                        </label>
                    `).join('')}
                </div>
                <small style="color: #666;">${isZH ? '选择要计算的强化等级，至少选择一个等级' : 'Select enhancement levels to calculate, at least one level must be selected'}</small>
            </div>

            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="save-enhancement-settings" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    ${isZH ? '保存设置' : 'Save Settings'}
                </button>
                <button id="reset-enhancement-settings" style="background: #ff9800; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    ${isZH ? '重置默认' : 'Reset Default'}
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        // 添加按钮事件监听器
        const saveButton = panel.querySelector('#save-enhancement-settings');
        const resetButton = panel.querySelector('#reset-enhancement-settings');

        if (saveButton) {
            saveButton.addEventListener('click', saveEnhancementSettings);
        }

        if (resetButton) {
            resetButton.addEventListener('click', resetEnhancementSettings);
        }
    }

    // 获取强化设置
    function getEnhancementSettings() {
        const defaultSettings = {
            enhancing_level: 125,
            laboratory_level: 6,
            enhancer_bonus: 5.42,
            glove_bonus: 12.9,
            calculation_mode: 'all', // 默认全局计算
            enhancement_levels: [5, 7, 10] // 默认计算+5、+7、+10等级
        };

        const savedSettings = localStorage.getItem('enhancement_settings');
        if (savedSettings) {
            try {
                return { ...defaultSettings, ...JSON.parse(savedSettings) };
            } catch (e) {
                console.error('解析强化设置失败:', e);
                return defaultSettings;
            }
        }
        return defaultSettings;
    }

    // 保存强化设置
    function saveEnhancementSettings() {
        console.log('保存强化设置函数被调用');

        const enhancingLevel = document.getElementById('enhancing-level');
        const laboratoryLevel = document.getElementById('laboratory-level');
        const enhancerBonus = document.getElementById('enhancer-bonus');
        const gloveBonus = document.getElementById('glove-bonus');

        console.log('找到的输入元素:', {
            enhancingLevel: enhancingLevel,
            laboratoryLevel: laboratoryLevel,
            enhancerBonus: enhancerBonus,
            gloveBonus: gloveBonus
        });

        const calculationMode = document.getElementById('calculation-mode');

        // 获取选中的强化等级
        const selectedLevels = [];
        for (let i = 5; i <= 10; i++) {
            const checkbox = document.getElementById(`level-${i}`);
            if (checkbox && checkbox.checked) {
                selectedLevels.push(i);
            }
        }

        // 验证至少选择一个等级
        if (selectedLevels.length === 0) {
            alert(isZH ? '请至少选择一个强化等级' : 'Please select at least one enhancement level');
            return;
        }

        const settings = {
            enhancing_level: parseFloat(enhancingLevel ? enhancingLevel.value : 0),
            laboratory_level: parseFloat(laboratoryLevel ? laboratoryLevel.value : 0),
            enhancer_bonus: parseFloat(enhancerBonus ? enhancerBonus.value : 0),
            glove_bonus: parseFloat(gloveBonus ? gloveBonus.value : 0),
            calculation_mode: calculationMode ? calculationMode.value : 'all',
            enhancement_levels: selectedLevels
        };

        console.log('解析的设置值:', settings);

        // 验证输入
        if (isNaN(settings.enhancing_level) || isNaN(settings.laboratory_level) ||
            isNaN(settings.enhancer_bonus) || isNaN(settings.glove_bonus)) {
            alert(isZH ? '请输入有效的数值' : 'Please enter valid numbers');
            return;
        }

        // 保存到本地存储
        localStorage.setItem('enhancement_settings', JSON.stringify(settings));

        // 保存强化精华价格
        const enhancingEssencePrice = document.getElementById('enhancing-essence-price');
        if (enhancingEssencePrice && !isNaN(parseFloat(enhancingEssencePrice.value))) {
            localStorage.setItem('enhancing_essence', enhancingEssencePrice.value);
        }

        // 更新全局input_data
        updateInputDataWithUserSettings();

        // 显示成功消息
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10002;
            font-size: 14px;
        `;
        message.textContent = isZH ? '设置已保存' : 'Settings saved';
        document.body.appendChild(message);

        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);

        // 关闭设置面板
        const panel = document.getElementById('enhancement-settings-panel');
        if (panel) {
            panel.remove();
        }
    }

    // 重置强化设置为默认值
    function resetEnhancementSettings() {
        const defaultSettings = {
            enhancing_level: 125,
            laboratory_level: 6,
            enhancer_bonus: 5.42,
            glove_bonus: 12.9,
            calculation_mode: 'all',
            enhancement_levels: [5, 7, 10]
        };

        // 更新输入框
        document.getElementById('enhancing-level').value = defaultSettings.enhancing_level;
        document.getElementById('laboratory-level').value = defaultSettings.laboratory_level;
        document.getElementById('enhancer-bonus').value = defaultSettings.enhancer_bonus;
        document.getElementById('glove-bonus').value = defaultSettings.glove_bonus;
        document.getElementById('calculation-mode').value = defaultSettings.calculation_mode;

        // 更新复选框
        for (let i = 5; i <= 10; i++) {
            const checkbox = document.getElementById(`level-${i}`);
            if (checkbox) {
                checkbox.checked = defaultSettings.enhancement_levels.includes(i);
            }
        }

        // 清除本地存储
        localStorage.removeItem('enhancement_settings');

        // 重置强化精华价格为默认值并清除localStorage
        const enhancingEssenceInput = document.getElementById('enhancing-essence-price');
        if (enhancingEssenceInput) {
            enhancingEssenceInput.value = '1000';
        }
        localStorage.removeItem('enhancing_essence');

        // 显示重置消息
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff9800;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10002;
            font-size: 14px;
        `;
        message.textContent = isZH ? '已重置为默认设置' : 'Reset to default settings';
        document.body.appendChild(message);

        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }

    // 按时薪排序函数
    function sortByHourlyRate(level, sortType) {
        console.log('排序函数被调用:', level, sortType);

        if (!window.currentEnhancementItems) {
            console.log('没有可排序的数据');
            return;
        }

        console.log('当前数据项数:', window.currentEnhancementItems.length);

        // 执行排序
        const sortedItems = [...window.currentEnhancementItems];

        if (sortType === 'default') {
            // 恢复默认排序（按最高卖单时薪，只考虑用户选择的强化等级）
            const userSettings = getEnhancementSettings();
            const selectedLevels = userSettings.enhancement_levels || [5, 7, 10];

            sortedItems.sort((a, b) => {
                const aMaxHourlyRate = Math.max(...a.enhancementResults
                    .filter(r => selectedLevels.includes(r.targetLevel))
                    .map(r => {
                        const sellPrice = r.sellPrice || 0;
                        const profit = sellPrice > 0 ? (sellPrice * 0.98) - r.totalCost : 0;
                        return r.timeSpent ? calculateHourlyRate(profit, r.timeSpent) : 0;
                    }));
                const bMaxHourlyRate = Math.max(...b.enhancementResults
                    .filter(r => selectedLevels.includes(r.targetLevel))
                    .map(r => {
                        const sellPrice = r.sellPrice || 0;
                        const profit = sellPrice > 0 ? (sellPrice * 0.98) - r.totalCost : 0;
                        return r.timeSpent ? calculateHourlyRate(profit, r.timeSpent) : 0;
                    }));
                return bMaxHourlyRate - aMaxHourlyRate;
            });
        } else {
            // 按指定等级和类型的时薪排序
            sortedItems.sort((a, b) => {
                const aResult = a.enhancementResults.find(r => r.targetLevel === level);
                const bResult = b.enhancementResults.find(r => r.targetLevel === level);

                if (!aResult || !bResult) return 0;

                const aPrice = sortType === 'sell' ? (aResult.sellPrice || 0) : (aResult.buyPrice || 0);
                const bPrice = sortType === 'sell' ? (bResult.sellPrice || 0) : (bResult.buyPrice || 0);

                // 卖单和买单价格都扣除2%税
                const aProfit = aPrice > 0 ? (aPrice * 0.98) - aResult.totalCost : 0;
                const bProfit = bPrice > 0 ? (bPrice * 0.98) - bResult.totalCost : 0;

                const aHourlyRate = aResult.timeSpent ? calculateHourlyRate(aProfit, aResult.timeSpent) : 0;
                const bHourlyRate = bResult.timeSpent ? calculateHourlyRate(bProfit, bResult.timeSpent) : 0;

                return bHourlyRate - aHourlyRate; // 降序排列
            });
        }

        console.log('排序完成，重新显示界面');

        // 更新显示
        showEnhancementCostsUI(sortedItems);

        // 显示排序提示
        let sortMessage = '';
        if (sortType === 'sell') {
            sortMessage = isZH ? `已按+${level}卖单时薪排序` : `Sorted by +${level} sell hourly rate`;
        } else if (sortType === 'buy') {
            sortMessage = isZH ? `已按+${level}买单时薪排序` : `Sorted by +${level} buy hourly rate`;
        } else {
            sortMessage = isZH ? '已恢复默认排序' : 'Restored default sorting';
        }

        console.log('排序提示信息:', sortMessage);

        // 显示临时提示
        const panel = document.getElementById('enhancement-costs-panel');
        if (panel) {
            const existingMessage = panel.querySelector('.sort-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = 'sort-message';
            messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                z-index: 10001;
                font-size: 14px;
            `;
            messageDiv.textContent = sortMessage;
            document.body.appendChild(messageDiv);

            // 3秒后自动移除提示
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 3000);
        }
    }

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

        const item_price_data = price_data.marketData[hrid];
        const ask = item_price_data?.[0]?.a;
        const bid = item_price_data?.[0]?.b;

        let result = 0;

        // 处理生产成本为-1的情况（没有制作配方）
        if (productionCost === -1) {
            if (bid && bid > 0) {
                result = bid; // 以买单价为基础成本
            } else if (ask && ask > 0) {
                result = ask; // 如果没有买单价，使用卖单价
            } else {
                result = 0; // 如果都没有，设为0
            }
        } else if (ask && ask > 0) {
            // 取生产成本和卖单价的最小值
            result = Math.min(ask, productionCost);
        } else if (bid && bid > 0) {
            // 只有买单价的情况，保持原逻辑
            result = Math.max(bid, productionCost);
        } else {
            // 没有市场价格的情况，保持原逻辑
            result = productionCost;
        }

        return result;
    }

    function getItemMarketPrice(hrid, price_data) {
        // 金币价格固定为1
        if (hrid === '/items/coin') {
            return 1;
        }
        const item_price_data = price_data.marketData[hrid];

        // Return 0 if the item does not have neither ask nor bid prices.
        if (!item_price_data || (item_price_data[0].a < 0 && item_price_data[0].b < 0)) {
            // console.log("getItemMarketPrice() return 0 due to neither ask nor bid prices: " + hrid);
            return 0;
        }

        // Return the other price if the item does not have ask or bid price.
        let ask = item_price_data[0]?.a;
        let bid = item_price_data[0]?.b;
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

        // 处理批量强化成本计算按钮的显示/隐藏
        const existingButton = document.getElementById('bulk-enhancement-costs-button');
        if (settingsMap.bulkEnhancementCosts.isTrue) {
            if (!existingButton) {
                addBulkEnhancementCostsButton();
            }
        } else {
            if (existingButton) {
                existingButton.remove();
            }
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
            inputDiv.querySelectorAll(".MarketplacePanel_buttonContainer__vJQud")[5]?.querySelector("div button")?.click();
        } else if (
            getOriTextFromElement(label.parentElement).toLowerCase().includes("best sell") ||
            label.parentElement.textContent.includes("出售")
        ) {
            inputDiv.querySelectorAll(".MarketplacePanel_buttonContainer__vJQud")[5]?.querySelector("div button")?.click();
        }
    }

    /* 伤害统计 */





    // 页面加载时同步市场数据
    syncMarketData();

    // 添加每分钟自动更新API数据的定时任务
    setInterval(syncMarketData, 15000); // 60000毫秒 = 1分钟
})();