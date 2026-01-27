// ==UserScript==
// @name         Ranged Way Idle
// @version      6.24
// @author       AlphB
// @description  一些超级有用的MWI的QoL功能
// @match        https://*.milkywayidle.com/*
// @match        https://*.milkywayidlecn.com/*
// @connect      www.milkywayidle.com
// @connect      test.milkywayidle.com
// @connect      www.milkywayidlecn.com
// @connect      test.milkywayidlecn.com
// @connect      alphb.cn
// @grant        GM.xmlHttpRequest
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @icon         https://tupian.li/images/2025/09/30/68dae3cf1fa7e.png
// @license      CC-BY-NC-SA-4.0
// @namespace    http://tampermonkey.net/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535671/Ranged%20Way%20Idle.user.js
// @updateURL https://update.greasyfork.org/scripts/535671/Ranged%20Way%20Idle.meta.js
// ==/UserScript==

(function () {
    const configs = {
        combatClass: {
            notifyCombatDeath: {
                type: "switch",
                value: true,
                trigger: ["ws"],
                listenMessageTypes: ["new_battle", "battle_updated", "init_character_data"]
            },
            minimumNotifyCooldownSeconds: {type: "input_number", value: 5}
        },

        messageClass: {
            notifyChatMessages: {
                type: "switch",
                value: true,
                trigger: ["ws", "ob"],
                listenMessageTypes: ["chat_message_received", "init_character_data"]
            },
            notifyChatMessagesVolume: {type: "input_range", value: 0.5, min: 0, max: 1, step: 0.01},
            notifyChatMessagesByRegex: {type: "switch", value: false},
            notifyChatMessagesFilterSelf: {type: "switch", value: true},
            consoleLogChatMessages: {type: "switch", value: true},
        },

        gameInfoClass: {
            initCharacterData: {
                type: "switch",
                value: true,
                trigger: ["ws"],
                listenMessageTypes: ["init_character_data"],
                isHidden: true
            },
            updateLocalStorageMarketPrice: {
                type: "switch", value: true, trigger: ["ws"], listenMessageTypes: ["market_item_order_books_updated"]
            },
            showTaskValue: {
                type: "switch",
                value: true,
                trigger: ["ws", "ob"],
                listenMessageTypes: ["quests_updated", "init_character_data"]
            },
            showTaskRerollValue: {
                type: "switch",
                value: true,
                trigger: ["ob"],
            },
            showDungeonTokenValue: {
                type: "switch", value: true, trigger: ["ob"]
            },
            trackLeaderBoardData: {type: "switch", value: true, trigger: ["ob"]},
            actionQueueNotify: {
                type: "switch",
                value: false,
                trigger: ["ob"]
            },
            actionQueueNotifyCount: {type: "input_number", value: 0},
            actionQueueNotifyVolume: {type: "input_range", value: 0.5, min: 0, max: 1, step: 0.01},
            showQueueLengthInTitle: {type: "switch", value: false, trigger: ["ob"]},
        },

        gameUIClass: {
            autoClickTaskSortButton: {type: "switch", value: true, trigger: ["ob"]},
            showMarketAPIUpdateTime: {type: "switch", value: true, trigger: ["ob"]},
            forceUpdateAPIButton: {type: "switch", value: true, trigger: ["ob"]},
            forceUpdateAPIWithTime: {type: "switch", value: false},
            disableQueueUpgradeButton: {type: "switch", value: false, trigger: ["ob"]},
            disableActionQueueBar: {type: "switch", value: false, trigger: ["ob"]},
            hideSideBarButton: {
                type: "switch", value: false, trigger: ["ob", "ws"], listenMessageTypes: ["init_character_data"]
            },
            hideTrainRubbishButton: {type: "switch", value: false, trigger: ["ob"]},
            alwaysHideTrainRubbish: {type: "switch", value: false},
            addWatermark: {type: "switch", value: false, trigger: ["ob"]},
            watermarkText: {type: "input_text", value: ""},
            quickCopyItemHrid: {type: "switch", value: false, trigger: ["ob"]},
            visibleItemCountMarket: {type: "switch", value: false, trigger: ["ob"]},
            visibleItemCountOpacity: {type: "input_range", value: 0.25, min: 0, max: 1, step: 0.01},
            visibleItemCountCountEquippedItems: {type: "switch", value: true},
        },

        listingClass: {
            hookListingInfo: {
                type: "switch",
                value: true,
                trigger: ["ws"],
                listenMessageTypes: ["market_listings_updated", "init_character_data"],
                isHidden: true
            },
            saveListingInfoToLocalStorage: {type: "switch", value: true},
            saveListingInfoToLocalStorageMaxDays: {type: "input_number", value: 30},
            showTotalListingFunds: {
                type: "switch", value: true, trigger: ["ws", "ob"], listenMessageTypes: ["market_listings_updated"]
            },
            showTotalListingFundsPrecise: {type: "input_number", value: 0},
            showListingInfo: {
                type: "switch",
                value: true,
                trigger: ["ws", "ob"],
                listenMessageTypes: ["market_listings_updated", "market_item_order_books_updated", "init_character_data"]
            },
            mwiOrderHelperCompatible: {type: "switch", value: false},
            enableMagicSort: {type: "switch", value: false},
            showListingPricePrecise: {type: "input_number", value: 2},
            showListingCreateTimeByLifespan: {type: "switch", value: false},
            listingSortTools: {type: "switch", value: false, isHidden: true, trigger: ["ob"]}, // TO DO
            notifyListingFilled: {
                type: "switch", value: false, trigger: ["ws"], listenMessageTypes: ["market_listings_updated"]
            },
            notifyListingFilledVolume: {type: "input_range", value: 0.5, min: 0, max: 1, step: 0.01},
            orderBooksInfo: {
                type: "switch",
                value: true,
                trigger: ["ws", "ob"],
                listenMessageTypes: ["market_item_order_books_updated"]
            },
            estimateListingCreateTimeColorByAccuracy: {type: "switch", value: false},
            estimateListingCreateTimeColorByLifespan: {type: "switch", value: false},
            estimateListingCreateTimeByLifespan: {type: "switch", value: false},
        },

        immemorialMarketClass: {
            enableImmemorialMarket: {
                type: "switch", value: false, trigger: ["ob", "ws"],
                listenMessageTypes: ["init_character_data", "chat_message_received", "market_item_order_books_updated", "market_listings_updated"]
            },
            debugPrintIMWSMessages: {type: "switch", value: false},
        },

        otherClass: {
            scriptLanguage: {type: "select", value: "zh-cn", options: ["zh-cn", "en-us"]},
            showSponsor: {type: "switch", value: false, trigger: ["ob"]},
            mournForMagicWayIdle: {type: "switch", value: true, trigger: ["init"]},
            debugPrintWSMessages: {type: "switch", value: false, listenMessageTypes: []},
            lazyLoadScript: {type: "switch", value: false},
            showConfigMenu: {type: "switch", value: true, trigger: ["ob"], isHidden: true}
        }
    };

    const globalVariables = {
        scriptVersion: GM_info?.script?.version || "6.24",
        marketAPIUrl: "https://www.milkywayidle.com/game_data/marketplace.json",
        initCharacterData: null,
        documentObserver: null,
        documentObserverFunction: null,
        webSocketMessageProcessor: null,
        functionMap: {},
        notifyMessageAudio: new Audio("https://upload.thbwiki.cc/d/d1/se_bonus2.mp3"),
        notifyListingFilledAudio: new Audio("https://upload.thbwiki.cc/f/ff/se_trophy.mp3"),
        allListings: {},
        configs: configs,
        gameStateNode: null, // Do not abuse this function
        isIMRealNameOrderEnabled: false,
        imListingsOwnerMap: {},
        imListingsToDeleteSet: new Set(),
        imListingsCreateTimeData: [],
    };
    unsafeWindow._rwivb = globalVariables;

    const I18NMap = {
        "combatClass": {"zh-cn": "战斗功能", "en-us": "Combat Functions"},
        "messageClass": {"zh-cn": "聊天功能", "en-us": "Message Functions"},
        "gameInfoClass": {"zh-cn": "游戏信息设置", "en-us": "Game Info"},
        "gameUIClass": {"zh-cn": "游戏界面设置", "en-us": "Game UI"},
        "listingClass": {"zh-cn": "挂单功能设置", "en-us": "Listing Functions"},
        "immemorialMarketClass": {
            "zh-cn": "熙攘市场",
            "en-us": "Immemorial Market (Do not support english version currently)"
        },
        "otherClass": {"zh-cn": "其他设置", "en-us": "Other Functions"},

        "ranged_way_idle_config_menu_title": {"zh-cn": "设置", "en-us": "Config"},
        "notifyCombatDeath": {"zh-cn": "战斗中角色死亡时，发出通知", "en-us": "Notify when a character dies in combat"},
        "minimumNotifyCooldownSeconds": {
            "zh-cn": "角色死亡通知冷却时间（秒）",
            "en-us": "Minimum cooldown time for notifying when a character dies in combat (seconds)"
        },
        "notifyChatMessages": {
            "zh-cn": "聊天消息含有关键词时，发出声音提醒", "en-us": "Notify when chat messages contain preset keywords"
        },
        "notifyChatMessagesVolume": {"zh-cn": "聊天消息声音提醒音量", "en-us": "Chat message notify sound volume"},
        "notifyChatMessagesByRegex": {"zh-cn": "聊天消息采用正则匹配", "en-us": "Use regex to match chat messages"},
        "notifyChatMessagesFilterSelf": {
            "zh-cn": "不提醒自己发送的聊天消息", "en-us": "Filter out chat messages sent by yourself"
        },
        "consoleLogChatMessages": {
            "zh-cn": "在控制台输出提醒的消息", "en-us": "Log notify chat messages to console"
        },
        "updateLocalStorageMarketPrice": {
            "zh-cn": "更新localStorage中的市场价格", "en-us": "Update localStorage market price while click in market"
        },
        "showTaskValue": {
            "zh-cn": "显示任务期望收益（依赖 食用工具）", "en-us": "Show task expected value (requires TaskManager)"
        },
        "showTaskRerollValue": {
            "zh-cn": "显示使用牛铃重置任务时等价的金币数，并用绿色标出更便宜的选项。",
            "en-us": "Show equivalent counts of coins when resetting tasks with cowbell. And mark cheaper option with green color."
        },
        "showDungeonTokenValue": {
            "zh-cn": "商店中显示地下城战利品价值", "en-us": "Show dungeon token value at shop"
        },
        "trackLeaderBoardData": {"zh-cn": "跟踪排行榜数据", "en-us": "Track leaderboard data"},
        "actionQueueNotify": {
            "zh-cn": "当行动队列中的行动数量下降到指定数量时，发出一个声音提醒。",
            "en-us": "Notify when action queue count drops to specified number."
        },
        "actionQueueNotifyCount": {
            "zh-cn": "行动的指定数量（例如设为0则在无所事事时提醒）",
            "en-us": "Count of actions in action queue to notify (e.g. set to 0 to notify when doing nothing)"
        },
        "actionQueueNotifyVolume": {
            "zh-cn": "行动队列数量提示的音量",
            "en-us": "Action queue count notify sound volume"
        },
        "showQueueLengthInTitle": {
            "zh-cn": "浏览器标题界面显示行动队列的长度",
            "en-us": "Show action queue length in browser title"
        },
        "autoClickTaskSortButton": {
            "zh-cn": "自动点击任务排序按钮（依赖 MWI TaskManager）",
            "en-us": "Auto-click task sort button (requires TaskManager)"
        },
        "showMarketAPIUpdateTime": {"zh-cn": "显示市场API更新时间", "en-us": "Show market API update time"},
        "forceUpdateAPIButton": {"zh-cn": "强制更新市场API按钮", "en-us": "Force update market API button"},
        "forceUpdateAPIWithTime": {
            "zh-cn": "强制更新市场API时，同样覆盖本地的时间",
            "en-us": "Also set localStorage time when force update market API "
        },
        "disableQueueUpgradeButton": {
            "zh-cn": "禁用各处队列升级按钮，以防跳转至牛铃商店",
            "en-us": "Disable queue upgrade buttons to prevent redirect to cowbell shop"
        },
        "disableActionQueueBar": {"zh-cn": "禁用行动队列提示框显示", "en-us": "Disable action queue bar display"},
        "hideSideBarButton": {"zh-cn": "隐藏左侧边栏的部分按钮", "en-us": "Hide some buttons in left sidebar"},
        "hideTrainRubbishButton": {
            "zh-cn": "允许隐藏背包里的火车垃圾（无强化等级的奶酪、木制、皮革或布料装备等）",
            "en-us": "Allow hiding train rubbish in inventory (with no enhancement level)"
        },
        "alwaysHideTrainRubbish": {
            "zh-cn": "总是自动隐藏背包里的火车垃圾", "en-us": "Always hide train rubbish in inventory"
        },
        "addWatermark": {
            "zh-cn": "为整个页面添加水印，以防止他人偷图",
            "en-us": "Add watermark to whole page to prevent stealing your show-off image"
        },
        "watermarkText": {
            "zh-cn": "水印文字", "en-us": "Watermark text"
        },
        "quickCopyItemHrid": {
            "zh-cn": "快速复制itemHrid", "en-us": "Quick copy itemHrid"
        },
        "visibleItemCountMarket": {
            "zh-cn": "市场界面可见背包内的物品数量", "en-us": "Visible item count in market UI"
        },
        "visibleItemCountOpacity": {
            "zh-cn": "市场界面可见背包内的物品数量：背包里不包含该物品时，图标的不透明度",
            "en-us": "Visible item count in market UI: Opcity of item count in market UI when not in inventory"
        },
        "visibleItemCountCountEquippedItems": {
            "zh-cn": "市场界面可见背包内的物品数量：是否统计已装备的物品",
            "en-us": "Visible item count in market UI: Count equipped items"
        },
        "saveListingInfoToLocalStorage": {
            "zh-cn": "保存挂单信息到localStorage", "en-us": "Save listing info to localStorage"
        },
        "saveListingInfoToLocalStorageMaxDays": {
            "zh-cn": "挂单信息本地保存时间（天）", "en-us": "Max days to save listing info to localStorage"
        },
        "showTotalListingFunds": {
            "zh-cn": "显示市场挂单的总购买预付金/出售可获金/待领取金额",
            "en-us": "Show total listing funds (purchase prepaid coins/sell result coins/unclaimed coins)"
        },
        "showTotalListingFundsPrecise": {
            "zh-cn": "显示市场挂单的总购买预付金/出售可获金/待领取金额的精度", "en-us": "Precise of total listing funds"
        },
        "showListingInfo": {"zh-cn": "显示各个挂单的价格、创建时间信息", "en-us": "Show listing price/create time"},
        "mwiOrderHelperCompatible": {
            "zh-cn": "尝试兼容Magic Sort。此功能由@adudu完成，暂不对维护开启这个功能后遇到的bug。",
            "en-us": "Try to be compatible with Magic Sort. This feature is developed by @adudu, and I will not maintain this feature after encountering bugs."
        },
        "enableMagicSort": {
            "zh-cn": "启用Magic Sort。此功能由@adudu完成，暂不对维护开启这个功能后遇到的bug。",
            "en-us": "Enable magic sort. This feature is developed by @adudu, and I will not maintain this feature after encountering bugs.",
        },
        "showListingPricePrecise": {
            "zh-cn": "各个挂单的购买预付金/出售可获金的价格精度", "en-us": "Precise of listing price"
        },
        "showListingCreateTimeByLifespan": {
            "zh-cn": "显示挂单已存在时长，而非创建的时刻", "en-us": "Show listing lifespan instead of create time"
        },
        "notifyListingFilled": {"zh-cn": "挂单完成时，发出声音提醒", "en-us": "Notify when a listing is filled"},
        "notifyListingFilledVolume": {"zh-cn": "挂单完成声音提醒音量", "en-us": "Listing filled notify sound volume"},
        "orderBooksInfo": {
            "zh-cn": "估算挂单创建时间。显示挂单所有者（必须启用熙攘市场的对应功能）",
            "en-us": "Estimate listing create time. Show listing owner (requires immemorial market feature)"
        },
        "estimateListingCreateTimeColorByAccuracy": {
            "zh-cn": "依据精度为挂单创建时间着色（越偏向绿色 精度越高）该项为真时，覆盖下一选项设置",
            "en-us": "Color listing create time by accuracy (green for high accuracy). while this option is true, it overrides the next option setting"
        },
        "estimateListingCreateTimeColorByLifespan": {
            "zh-cn": "依据存在时间为挂单创建时间着色（越偏向绿色 创建时间越短）",
            "en-us": "Color listing create time by lifespan (green for short lifespan)"
        },
        "estimateListingCreateTimeByLifespan": {
            "zh-cn": "估算结果显示为挂单已存在时长，而非创建的时刻",
            "en-us": "Show estimate listing create time by lifespan"
        },
        "enableImmemorialMarket": {
            "zh-cn": "启用🌈熙攘市场🌈（启用后请刷新页面）",
            "en-us": "Enable 🌈Immemorial Market🌈(Please refresh page after enabling this feature)"
        },
        "debugPrintIMWSMessages": {
            "zh-cn": "打印IMWebSocket消息（不推荐打开）",
            "en-us": "Print IMWebSocket messages (not recommended)"
        },
        "scriptLanguage": {"zh-cn": "语言 🌏", "en-us": "Language 🌏"},
        "showSponsor": {"zh-cn": "赞助作者", "en-us": "Buy me a coffee"},
        "mournForMagicWayIdle": {"zh-cn": "在控制台为Magic Way Idle默哀", "en-us": "Mourn for Magic Way Idle"},
        "debugPrintWSMessages": {
            "zh-cn": "打印WebSocket消息（不推荐打开）", "en-us": "Print WebSocket messages (not recommended)"
        },
        "lazyLoadScript": {
            "zh-cn": "懒加载脚本以提升初始化脚本时的性能，但可能导致部分功能更改开关后，需要手动刷新页面才能生效。",
            "en-us": "Lazy load script to improve performance during initialization, but may cause some features to not work properly until page refresh."
        },

        "configNoteText": {
            "zh-cn": "部分设置可能需要刷新页面才能生效。如果完全无效，或者控制台大量报错，请尝试更新本插件或前置插件",
            "en-us": "Some settings may not take effect until page refresh. If not working, or console is spammed with errors, try updating this script or its pre-requisites."
        },
        "notifyChatMessagesAddRowButton": {"zh-cn": "添加聊天消息监听关键词", "en-us": "Add chat message keyword"},
        "taskExpectedValueText": {"zh-cn": "任务期望收益：", "en-us": "Task expected value:"},
        "dungeonTokenValueTipText": {
            "zh-cn": "数字为每代币价值（左一/右一）。绿色为对应地下城的最高价。",
            "en-us": "Number is the value of each token (Top ask / Top bid). Green stands for the highest value for the corresponding dungeon."
        },
        "trackLeaderBoardDataLeaderboardStoreButton": {"zh-cn": "记录当前排行榜数据", "en-us": "Record current data"},
        "trackLeaderBoardDataLeaderboardDeleteButton": {"zh-cn": "删除本地数据", "en-us": "Delete local data"},
        "trackLeaderBoardDataLeaderboardRecordTimeText": {
            "zh-cn": "本地数据记录于：${recordTime}（${timeDelta}小时前）",
            "en-us": "Local data recorded at: ${recordTime} (${timeDelta} hours ago)"
        },
        "trackLeaderBoardDataLeaderboardNoRecordTimeText": {
            "zh-cn": "无本地数据记录", "en-us": "No local data recorded"
        },
        "trackLeaderBoardDataNoteText": {
            "zh-cn": "由于排行榜数据每20分钟记录一次，增速和超越时间有误差，仅供参考。",
            "en-us": "Due to the leaderboard update every 20 minutes, speed and catchup time may be inaccurate. This is for reference only."
        },
        "trackLeaderBoardDataDifference": {"zh-cn": "增量", "en-us": "Difference"},
        "trackLeaderBoardDataSpeed": {"zh-cn": "增速", "en-us": "Speed"},
        "trackLeaderBoardDataCatchupTime": {"zh-cn": "超越时间", "en-us": "Catchup time"},
        "trackLeaderBoardDataCatchupTimeNow": {"zh-cn": "现在！", "en-us": "Now!"},
        "trackLeaderBoardDataNewRecordText": {"zh-cn": "新上榜", "en-us": "New in LB"},
        "showMarketAPIUpdateTimeText": {"zh-cn": "市场API更新时间于：", "en-us": "Market API update time:"},
        "forceUpdateAPIButtonText": {"zh-cn": "强制更新市场API", "en-us": "Force update market API"},
        "forceUpdateAPIButtonTextSuccess": {
            "zh-cn": "更新成功。市场数据更新于", "en-us": "Update success. Market data updated at:"
        },
        "forceUpdateAPIButtonTextError": {
            "zh-cn": "更新失败。请稍后重试。", "en-us": "Update failed. Please try again later."
        },
        "forceUpdateAPIButtonTextTimeout": {
            "zh-cn": "更新超时。请稍后重试。", "en-us": "Update timeout. Please try again later."
        },
        "hideSidebarText": {"zh-cn": "隐藏左侧边栏按钮配置", "en-us": "Hide sidebar buttons config"},
        "hideTrainRubbishButtonText": {"zh-cn": "隐藏火车垃圾", "en-us": "Hide train rubbish"},
        "showTrainRubbishButtonText": {"zh-cn": "显示火车垃圾", "en-us": "Show train rubbish"},
        "quickCopyItemHridButtonText": {"zh-cn": "复制itemHrid", "en-us": "Copy itemHrid"},
        "totalUnclaimedCoinsText": {"zh-cn": "待领取金额", "en-us": "Unclaimed"},
        "totalPrepaidCoinsText": {"zh-cn": "购买预付金", "en-us": "Purchase prepaid"},
        "totalSellResultCoinsText": {"zh-cn": "出售可获金", "en-us": "Sell result"},
        "showListingInfoCreateTimeAt": {"zh-cn": "创建于", "en-us": "Created at"},
        "showListingInfoCreateTimeLifespan": {
            "zh-cn": "已存在 ${days}天${hours}时${minutes}分${seconds}秒",
            "en-us": "Lifespan: ${days}d ${hours}h ${minutes}m ${seconds}s"
        },
        "showListingInfoTopOrderPriceText": {"zh-cn": "左一/右一 价格", "en-us": "Top order price"},
        "showListingInfoTotalPriceText": {"zh-cn": "购买预付金/出售可获金", "en-us": "Purchase prepaid / Sell result"},
        "estimateListingCreateTimeText": {"zh-cn": "估计创建时间", "en-us": "Estimated create time"},
        "realNameOrderText": {"zh-cn": "挂单所有者", "en-us": "Owner"},
        "unknownRealName": {"zh-cn": "未知", "en-us": "Unknown"},
        "estimateListingCreateTimeLifespan": {
            "zh-cn": "${days}天${hours}时${minutes}分", "en-us": "${days}d ${hours}h ${minutes}m"
        },
        "sponsorTipText": {
            "zh-cn": "下列赞助排名按照首字母排序。赞助为自愿性质，不包含额外服务！",
            "en-us": "Sponsor list sorted by first letter. Sponsorship is voluntary and does not include any additional services!"
        },
        "sponsorText": {"zh-cn": "赞助作者", "en-us": "Buy me a coffee"},
        "sponsorAlertText": {
            "zh-cn": "本赞助为纯自愿捐赠，不包含任何本脚本的额外隐藏功能或服务。如果您愿意，可以在备注中写上你的ID，作者将会把您的名字加入到赞助名单中。忘记备注ID的可以联系AlphB提供支付证明来补充。",
            "en-us": "This sponsorship is purely voluntary and does not include any additional hidden features or services for this script. If you wish, you can write your ID in the note and the author will add your name to the sponsor list. If you forgot to input your ID, you can contact AlphB to provide payment proof to add it back."
        },
        "zh-cn": {"zh-cn": "中文", "en-us": "中文"},
        "en-us": {"zh-cn": "English", "en-us": "English"},
        "characterID": {"zh-cn": "角色ID", "en-us": "Character ID"},
        "sponsorValue": {"zh-cn": "赞助金额", "en-us": "Sponsor value"},
        "IMOpenConfigPanel": {"zh-cn": "打开熙攘市场配置面板", "en-us": "Open Immemorial Market Config Panel"},

        "/chat_channel_types/general": {"zh-cn": "英语", "en-us": "English"},
        "/chat_channel_types/chinese": {"zh-cn": "中文", "en-us": "Chinese"},
        "/chat_channel_types/ironcow": {"zh-cn": "铁牛", "en-us": "Ironcow"},
        "/chat_channel_types/trade": {"zh-cn": "交易", "en-us": "Trade"},
        "/chat_channel_types/recruit": {"zh-cn": "招募", "en-us": "Recruit"},
        "/chat_channel_types/beginner": {"zh-cn": "新手", "en-us": "Beginner"},
        "/chat_channel_types/guild": {"zh-cn": "公会", "en-us": "Guild"},
        "/chat_channel_types/party": {"zh-cn": "队伍", "en-us": "Party"},
        "/chat_channel_types/whisper": {"zh-cn": "私聊", "en-us": "Whisper"},
        "/chat_channel_types/moderator": {"zh-cn": "管理员", "en-us": "Moderator"},
        "CHAT_CHANNEL_ANY": {"zh-cn": "所有频道", "en-us": "All channels"},

        "/chat_channel_types/arabic": {"zh-cn": "العربية", "en-us": "العربية"},
        "/chat_channel_types/french": {"zh-cn": "Français", "en-us": "Français"},
        "/chat_channel_types/german": {"zh-cn": "Deutsch", "en-us": "Deutsch"},
        "/chat_channel_types/hebrew": {"zh-cn": "עברית", "en-us": "עברית"},
        "/chat_channel_types/hindi": {"zh-cn": "हिंदी", "en-us": "हिंदी"},
        "/chat_channel_types/japanese": {"zh-cn": "日本語", "en-us": "日本語"},
        "/chat_channel_types/korean": {"zh-cn": "한국어", "en-us": "한국어"},
        "/chat_channel_types/portuguese": {"zh-cn": "Português", "en-us": "Português"},
        "/chat_channel_types/russian": {"zh-cn": "Русский", "en-us": "Русский"},
        "/chat_channel_types/spanish": {"zh-cn": "Español", "en-us": "Español"},
        "/chat_channel_types/vietnamese": {"zh-cn": "Tiếng Việt", "en-us": "Tiếng Việt"},

    };

    function initScript() {
        if (document.URL.includes("test.milkywayidle")) {
            if (document.URL.includes("test.milkywayidle.com")) {
                globalVariables.marketAPIUrl = "https://test.milkywayidlecn.com/game_data/marketplace.json";
            } else {
                globalVariables.marketAPIUrl = "https://test.milkywayidle.com/game_data/marketplace.json";
            }
        } else {
            if (document.URL.includes("www.milkywayidle.com")) {
                globalVariables.marketAPIUrl = "https://www.milkywayidle.com/game_data/marketplace.json";
            } else {
                globalVariables.marketAPIUrl = "https://www.milkywayidlecn.com/game_data/marketplace.json";
            }
        }
        migrateFromLocalStorage();
        const allFunctionsObject = new AllFunctions();
        const localConfig = getStorage("ranged_way_idle_configs");
        const lazyLoad = localConfig ? localConfig?.otherClass?.lazyLoadScript : false;
        const otherClass = allFunctionsObject.otherClass();
        globalVariables.functionMap.otherClass = {
            showConfigMenu: otherClass.showConfigMenu()
        };
        globalVariables.functionMap.otherClass.showConfigMenu.loadLocalConfig();
        for (const configClass in configs) {
            if (configClass !== 'otherClass') {
                globalVariables.functionMap[configClass] = {};
            }
            const functionClassObject = allFunctionsObject[configClass]();
            for (const configName in configs[configClass]) {
                if (configs[configClass][configName].type !== 'switch') continue;
                if (!(configs[configClass][configName]?.trigger?.length > 0)) continue;
                if (lazyLoad && !configs[configClass][configName].value) continue;
                if (!functionClassObject[configName]) {
                    console.warn("No function found for config: " + configName);
                } else if (configName !== 'showConfigMenu') {
                    globalVariables.functionMap[configClass][configName] = functionClassObject[configName]();
                }
            }
        }

        hookWebSocket();
        initDocumentObserver();

        for (const configClass in configs) {
            for (const configName in configs[configClass]) {
                if (configs[configClass][configName].type === 'switch' && configs[configClass][configName].value &&
                    globalVariables.functionMap[configClass][configName] && configs[configClass][configName].trigger.includes("init")) {
                    try {
                        globalVariables.functionMap[configClass][configName].init();
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        }

        function hookWebSocket() {
            // message processor
            globalVariables.webSocketMessageProcessor = function (message, type) {
                const obj = JSON.parse(message);
                if (configs.otherClass.debugPrintWSMessages.value) console.log(type, obj);
                if (type !== 'get' || !obj) return;
                const messageType = obj.type;
                for (const configClass in configs) {
                    for (const configName in configs[configClass]) {
                        if (configs[configClass][configName].type === 'switch' && configs[configClass][configName].value &&
                            globalVariables.functionMap[configClass][configName] && configs[configClass][configName]?.trigger?.includes('ws') &&
                            configs[configClass][configName].listenMessageTypes && configs[configClass][configName].listenMessageTypes.includes(messageType)) {
                            try {
                                globalVariables.functionMap[configClass][configName].ws(obj);
                            } catch (err) {
                                console.error(err);
                            }
                        }
                    }
                }
            };

            // get
            const oriGet = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data").get;

            function hookedGet() {
                const socket = this.currentTarget;
                if (!(socket instanceof WebSocket) || !socket.url) {
                    return oriGet.call(this);
                }
                if (!socket.url.includes("wss://api.milkywayidle") && !socket.url.includes("wss://api-test.milkywayidle")) {
                    return oriGet.call(this);
                }
                const message = oriGet.call(this);
                try {
                    globalVariables.webSocketMessageProcessor(message, 'get')
                } catch (err) {
                    console.error(err);
                }
                return message;
            }

            Object.defineProperty(MessageEvent.prototype, "data", {
                get: hookedGet, configurable: true, enumerable: true
            });

            // // send
            // const originalSend = WebSocket.prototype.send;
            //
            // WebSocket.prototype.send = function (message) {
            //     if (!this.url || !this.url.includes("wss://api.milkywayidle")) {
            //         return originalSend.call(this, message);
            //     }
            //     try {
            //         globalVariables.webSocketMessageProcessor(message, 'send');
            //     } catch (err) {
            //         console.error(err);
            //     }
            //     return originalSend.call(this, message);
            // }
        }

        function initDocumentObserver() {
            globalVariables.documentObserverFunction = function documentObserverFunction() {
                globalVariables.documentObserver.disconnect();
                for (const configClass in configs) {
                    for (const configName in configs[configClass]) {
                        const config = configs[configClass][configName];
                        if (config.type === 'switch' && config.value && config?.trigger?.includes('ob') && globalVariables.functionMap[configClass][configName]) {
                            try {
                                globalVariables.functionMap[configClass][configName].ob(document);
                            } catch (err) {
                                console.error(err);
                            }
                        }
                    }
                }
                globalVariables.documentObserver.observe(document, {childList: true, subtree: true});
            }
            globalVariables.documentObserver = new MutationObserver(globalVariables.documentObserverFunction);
            globalVariables.documentObserver.observe(document, {childList: true, subtree: true});
        }
    }

    class AllFunctions {
        combatClass() {
            function notifyCombatDeath() {
                const players = [];
                let lastNotificationTime = 0;

                function newBattle(obj) {
                    players.length = 0;
                    for (const player of obj.players) {
                        players.push({
                            name: player.name, isAlive: player.currentHitpoints > 0
                        });
                        if (player.currentHitpoints === 0) {
                            new Notification('战斗提醒', {body: `${player.name} 死了！`});
                        }
                    }
                }

                function battleUpdated(obj) {
                    for (const playerIndex in obj.pMap) {
                        const player = players[playerIndex];
                        if (player.isAlive && obj.pMap[playerIndex].cHP === 0 && Date.now() - lastNotificationTime > 1000 * configs.combatClass.minimumNotifyCooldownSeconds.value) {
                            new Notification('战斗提醒', {body: `${player.name} 死了！`});
                            lastNotificationTime = Date.now();
                        }
                        player.isAlive = obj.pMap[playerIndex].cHP > 0;
                    }
                }

                function ws(obj) {
                    if (obj.type === "new_battle") {
                        newBattle(obj);
                    } else if (obj.type === "battle_updated") {
                        battleUpdated(obj);
                    } else if (obj.type === "init_character_data") {
                        Notification.requestPermission();
                    }
                }

                return {ws: ws};
            }

            return {notifyCombatDeath: notifyCombatDeath};
        }

        messageClass() {
            function notifyChatMessages() {
                const allChannels = ["CHAT_CHANNEL_ANY", "/chat_channel_types/chinese", "/chat_channel_types/general", "/chat_channel_types/ironcow", "/chat_channel_types/trade", "/chat_channel_types/recruit", "/chat_channel_types/beginner", "/chat_channel_types/guild", "/chat_channel_types/party", "/chat_channel_types/whisper", "/chat_channel_types/moderator",
                    "/chat_channel_types/arabic", "/chat_channel_types/french", "/chat_channel_types/german", "/chat_channel_types/hebrew", "/chat_channel_types/hindi", "/chat_channel_types/japanese", "/chat_channel_types/korean", "/chat_channel_types/portuguese", "/chat_channel_types/russian", "/chat_channel_types/spanish", "/chat_channel_types/vietnamese",];
                let listenObject = {};
                let messageListerMenuRootNode;

                function createNewRow(selectedChannel = "", inputText = "") {
                    const listenRow = document.createElement("div");
                    listenRow.classList.add("RangedWayIdleMessageListenRow");

                    // channel select
                    const selectNode = document.createElement('select');
                    allChannels.forEach(channel => {
                        const option = document.createElement('option');
                        option.value = channel;
                        option.textContent = I18N(channel);
                        if (channel === selectedChannel) {
                            option.selected = true;
                        }
                        selectNode.appendChild(option);
                    });
                    selectNode.addEventListener('change', updateListenObject);

                    // input text
                    const inputNode = document.createElement('input');
                    inputNode.type = 'text';
                    inputNode.value = inputText;
                    inputNode.style.width = "15rem";
                    inputNode.addEventListener('input', updateListenObject);

                    // delete button
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = "×";
                    deleteButton.addEventListener('click', function () {
                        listenRow.remove();
                        updateListenObject();
                    });
                    deleteButton.style.backgroundColor = "#F44444";

                    // add to row
                    listenRow.appendChild(selectNode);
                    listenRow.appendChild(inputNode);
                    listenRow.appendChild(deleteButton);

                    return listenRow;
                }

                function updateListenObject() {
                    const newListenObject = {};
                    for (const channel of allChannels) {
                        newListenObject[channel] = [];
                    }

                    // collect channel and text from rows
                    for (const row of messageListerMenuRootNode.querySelectorAll('.RangedWayIdleMessageListenRow')) {
                        const channel = row.querySelector('select').value;
                        const text = row.querySelector('input').value.trim();
                        newListenObject[channel].push(text);
                    }

                    listenObject = newListenObject;
                    setStorage("ranged_way_idle_listen_chat_messages", listenObject);
                }

                function ws(obj) {
                    if (obj.type === "chat_message_received") {
                        if (configs.messageClass.notifyChatMessagesFilterSelf.value && obj.message.cId === globalVariables.initCharacterData.character.id) return;
                        const channel = obj.message.chan;
                        const text = obj.message.m;
                        const toMatchTexts = [];
                        if (listenObject["CHAT_CHANNEL_ANY"]) {
                            for (const listenText of listenObject["CHAT_CHANNEL_ANY"]) {
                                toMatchTexts.push(listenText);
                            }
                        }
                        if (listenObject[channel]) {
                            for (const listenText of listenObject[channel]) {
                                toMatchTexts.push(listenText);
                            }
                        }
                        for (const listenText of toMatchTexts) {
                            if (configs.messageClass.notifyChatMessagesByRegex.value) {
                                const regex = new RegExp(listenText, "g");
                                if (regex.test(text)) {
                                    globalVariables.notifyMessageAudio.volume = configs.messageClass.notifyChatMessagesVolume.value;
                                    globalVariables.notifyMessageAudio.play();
                                    if (configs.messageClass.consoleLogChatMessages.value) {
                                        console.log(`[${I18N(channel)}] ${obj.message.sName}: ${text}`);
                                    }
                                    return;
                                }
                            } else {
                                if (text.includes(listenText)) {
                                    globalVariables.notifyMessageAudio.volume = configs.messageClass.notifyChatMessagesVolume.value;
                                    globalVariables.notifyMessageAudio.play();
                                    if (configs.messageClass.consoleLogChatMessages.value) {
                                        console.log(`[${I18N(channel)}] ${obj.message.sName}: ${text}`);
                                    }
                                    return;
                                }
                            }
                        }
                    } else if (obj.type === "init_character_data") {
                        listenObject = getStorage("ranged_way_idle_listen_chat_messages") || {};
                    }
                }

                function ob(node) {
                    // add this after config menu
                    const configMenuRootNode = node.querySelector(".RangedWayIdleConfigMenuRoot");
                    if (!configMenuRootNode) return;
                    if (node.querySelector(".RangedWayIdleMessageListerMenu")) return;
                    messageListerMenuRootNode = document.createElement("div");
                    messageListerMenuRootNode.classList.add("RangedWayIdleMessageListerMenu");

                    // new row button
                    const addNewRowButton = document.createElement("button");
                    addNewRowButton.textContent = I18N("notifyChatMessagesAddRowButton");
                    addNewRowButton.addEventListener("click", () => {
                        messageListerMenuRootNode.appendChild(createNewRow());
                    });
                    addNewRowButton.style.backgroundColor = "#66CCFF";
                    addNewRowButton.style.color = "#000000";
                    messageListerMenuRootNode.appendChild(addNewRowButton);

                    // load local listeners
                    for (const channel of allChannels) {
                        if (listenObject[channel]) {
                            for (const text of listenObject[channel]) {
                                messageListerMenuRootNode.appendChild(createNewRow(channel, text));
                            }
                        }
                    }

                    configMenuRootNode.insertAdjacentElement("afterend", messageListerMenuRootNode);
                }

                return {ws: ws, ob: ob};
            }

            return {notifyChatMessages: notifyChatMessages};
        }

        gameInfoClass() {
            function initCharacterData() {
                function ws(obj) {
                    globalVariables.initCharacterData = obj;
                    globalVariables.gameStateNode = (e => e?.[Object.keys(e).find(k => k.startsWith('__reactFiber$'))]?.return?.stateNode)(document.querySelector('[class^="GamePage"]'));
                }

                return {ws: ws};
            }

            function updateLocalStorageMarketPrice() {
                function ws(obj) {
                    if (obj.type === "market_item_order_books_updated") {
                        const localMarketAPIJson = getStorage("MWITools_marketAPI_json", true);
                        const itemHrid = obj.marketItemOrderBooks.itemHrid;
                        const orderBooks = obj.marketItemOrderBooks.orderBooks;
                        for (let enhanceLevel = 0; enhanceLevel <= 20; enhanceLevel++) {
                            if (orderBooks[enhanceLevel]) {
                                // 如果左右至少有一个挂单，则需要更新为该价格
                                let askValue = -1;
                                const ask = orderBooks[enhanceLevel].asks;
                                if (ask && ask.length) {
                                    askValue = Math.min(...ask.map(listing => listing.price));
                                }
                                let bidValue = -1;
                                const bid = orderBooks[enhanceLevel].bids;
                                if (bid && bid.length) {
                                    bidValue = Math.max(...bid.map(listing => listing.price));
                                }

                                if (askValue !== -1 || bidValue !== -1) {
                                    localMarketAPIJson.marketData[itemHrid][enhanceLevel] = {
                                        a: askValue, b: bidValue
                                    };
                                }
                            } else if (enhanceLevel === 0) {
                                // 左右都没有，强化等级为+0，记录为-1
                                localMarketAPIJson.marketData[itemHrid][enhanceLevel] = {
                                    a: -1, b: -1
                                }
                            } else {
                                // 左右都没有，强化等级不为+0，删除记录
                                delete localMarketAPIJson.marketData[itemHrid][enhanceLevel];
                            }
                        }
                        // 将修改后结果写回marketAPI缓存，完成对marketAPI价格的强制修改
                        setStorage("MWITools_marketAPI_json", localMarketAPIJson, true);
                    }
                }

                return {ws: ws};
            }

            function showTaskValue() {
                let taskValueObject;

                function getTaskTokenValue() {
                    const chestDropData = getStorage("Edible_Tools", true).Chest_Drop_Data;
                    const lootsName = ["大陨石舱", "大工匠匣", "大宝箱"];
                    const bidValueList = [parseFloat(chestDropData["Large Meteorite Cache"]["期望产出" + "Bid"]), parseFloat(chestDropData["Large Artisan's Crate"]["期望产出" + "Bid"]), parseFloat(chestDropData["Large Treasure Chest"]["期望产出" + "Bid"]),];
                    const askValueList = [parseFloat(chestDropData["Large Meteorite Cache"]["期望产出" + "Ask"]), parseFloat(chestDropData["Large Artisan's Crate"]["期望产出" + "Ask"]), parseFloat(chestDropData["Large Treasure Chest"]["期望产出" + "Ask"]),];
                    const res = {
                        bidValue: Math.max(...bidValueList), askValue: Math.max(...askValueList)
                    };
                    // bid和ask的最佳兑换选项
                    res.bidLoots = lootsName[bidValueList.indexOf(res.bidValue)];
                    res.askLoots = lootsName[askValueList.indexOf(res.askValue)];
                    // bid和ask的任务代币价值
                    res.bidValue = Math.round(res.bidValue / 30);
                    res.askValue = Math.round(res.askValue / 30);
                    // 小紫牛的礼物的额外价值计算
                    res.giftValueBid = Math.round(parseFloat(chestDropData["Purple's Gift"]["期望产出" + "Bid"]));
                    res.giftValueAsk = Math.round(parseFloat(chestDropData["Purple's Gift"]["期望产出" + "Ask"]));

                    res.rewardValueBid = res.bidValue + res.giftValueBid / 50;
                    res.rewardValueAsk = res.askValue + res.giftValueAsk / 50;
                    return res;
                }

                function updateTaskValueNode(node) {
                    const taskListNode = node.querySelector(".TasksPanel_taskList__2xh4k");
                    if (!taskListNode) return;
                    if (taskListNode.querySelector(".RangedWayIdleTaskValue")) return;

                    for (const taskNode of taskListNode.querySelectorAll(".RandomTask_taskInfo__1uasf")) {
                        const rewardsNode = taskNode.querySelector(".RandomTask_rewards__YZk7D");
                        let coinCount = 0;
                        let taskTokenCount = 0;
                        for (const itemContainerNode of rewardsNode.querySelectorAll(".Item_itemContainer__x7kH1")) {
                            if (itemContainerNode.querySelector("use").href.baseVal.includes("coin")) {
                                coinCount = parseItemCount(itemContainerNode.querySelector(".Item_count__1HVvv").textContent);
                            } else if (itemContainerNode.querySelector("use").href.baseVal.includes("task_token")) {
                                taskTokenCount = parseItemCount(itemContainerNode.querySelector(".Item_count__1HVvv").textContent);
                            }
                        }

                        const askValue = taskTokenCount * taskValueObject.rewardValueAsk + coinCount;
                        const bidValue = taskTokenCount * taskValueObject.rewardValueBid + coinCount;

                        const taskValueDivNode = document.createElement("div");
                        taskValueDivNode.classList.add("RangedWayIdleTaskValue");
                        taskValueDivNode.textContent = I18N("taskExpectedValueText") + `${formatItemCount(askValue)} / ${formatItemCount(bidValue)}`;
                        taskValueDivNode.style.color = "#66CCFF";
                        taskValueDivNode.style.fontSize = "0.75rem";
                        taskNode.querySelector(".RandomTask_action__3eC6o").appendChild(taskValueDivNode);
                    }
                }

                function updateTaskShopItemValue(node) {
                    const taskShopPanelNode = node.querySelector(".TasksPanel_taskShop__q5sHL");
                    if (!taskShopPanelNode) return;
                    if (taskShopPanelNode.classList.contains("RangedWayIdleTaskShopValueSet")) return;
                    const chestDropData = getStorage("Edible_Tools", true).Chest_Drop_Data;
                    taskShopPanelNode.classList.add("RangedWayIdleTaskShopValueSet");
                    const nameMap = {
                        "large_meteorite_cache": "Large Meteorite Cache",
                        "large_artisans_crate": "Large Artisan's Crate",
                        "large_treasure_chest": "Large Treasure Chest"
                    }
                    for (const taskShopItemNode of taskShopPanelNode.querySelectorAll(".TasksPanel_item__DWSpv")) {
                        const item = taskShopItemNode.querySelector(".TasksPanel_iconContainer__2JGVN use").href.baseVal.split("#")[1];
                        if (!Object.keys(nameMap).includes(item)) {
                            continue;
                        }
                        const name = nameMap[item];
                        const askValue = parseFloat(chestDropData[name]["期望产出" + "Ask"]);
                        const bidValue = parseFloat(chestDropData[name]["期望产出" + "Bid"]);
                        const divNode = document.createElement("div");
                        divNode.textContent = `${formatItemCount(askValue)} / ${formatItemCount(bidValue)}`;
                        divNode.style.color = "#66CCFF";
                        taskShopItemNode.insertBefore(divNode, taskShopItemNode.lastChild);
                    }
                }

                function ws(obj) {
                    if (obj.type === "quests_updated") {
                        // remove old task value nodes
                        document.querySelectorAll(".RangedWayIdleTaskValue").forEach(node => {
                            node.remove();
                        });
                    } else if (obj.type === "init_character_data") {
                        taskValueObject = getTaskTokenValue();
                        if (configs.gameInfoClass.updateLocalStorageMarketPrice.value) {
                            const localMarketAPIJson = getStorage("MWITools_marketAPI_json", true);
                            localMarketAPIJson.marketData["/items/task_token"] = {
                                "0": {
                                    a: taskValueObject.askValue, b: taskValueObject.bidValue
                                }
                            };
                            setStorage("MWITools_marketAPI_json", localMarketAPIJson, true);
                        }
                    }
                }

                function ob(node) {
                    // set task expected value
                    updateTaskValueNode(node);

                    // set task shop item value
                    updateTaskShopItemValue(node);
                }

                return {ws: ws, ob: ob};
            }

            function showTaskRerollValue() {
                function ob(node) {
                    const allNodes = document.querySelectorAll(".RandomTask_rerollOptionsContainer__3yFjo");
                    if (allNodes.length === 0) {
                        return;
                    }
                    const cowbellPrice = getStorage("MWITools_marketAPI_json", true).marketData["/items/bag_of_10_cowbells"][0].a / 10;
                    for (const node of allNodes) {
                        // moopass free reroll
                        if (node.firstChild.firstChild.firstChild === null) continue;

                        // show coin value for cowbell reroll
                        const cowbellSpanNode = node.firstChild.firstChild.firstChild;
                        cowbellSpanNode.style.fontSize = "0.8rem";
                        const cowbellSvgNode = cowbellSpanNode.querySelector("svg");
                        cowbellSvgNode.style.width = "0.8rem";
                        cowbellSvgNode.style.height = "0.8rem";
                        cowbellSvgNode.classList = [];
                        const nowValue = cowbellSpanNode.firstChild.textContent.split(' ')[1];
                        if (nowValue !== cowbellSpanNode.dataset.value) {
                            node.querySelectorAll(".RangedWayIdleTaskRerollValue").forEach(node => node.remove());
                            cowbellSpanNode.dataset.value = nowValue;
                            const divNode = cowbellSpanNode.appendChild(document.createElement("div"));
                            divNode.classList.add("RangedWayIdleTaskRerollValue");
                            divNode.innerHTML = `<svg width="0.6rem" height="0.6rem" style="margin: -2px 0 -2px 2px;"><use href="/static/media/items_sprite.328d6606.svg#coin"></use></svg>`
                            const spanNode1 = divNode.insertBefore(document.createElement("span"), divNode.lastChild);
                            spanNode1.classList.add("RangedWayIdleTaskRerollValue");
                            spanNode1.textContent = `(≈${formatItemCount(Number(nowValue) * cowbellPrice)}`;
                            spanNode1.style.fontSize = "0.6rem";
                            const spanNode2 = divNode.appendChild(document.createElement("span"));
                            spanNode2.classList.add("RangedWayIdleTaskRerollValue");
                            spanNode2.textContent = ")";
                            spanNode2.style.fontSize = "0.6rem";
                        }

                        // compare two reroll ways
                        const coinSpanNode = node.lastChild.firstChild.firstChild;
                        const nowCoinValue = coinSpanNode.firstChild.textContent.split(' ')[1];
                        if (Number(nowValue) * cowbellPrice > parseItemCount(nowCoinValue)) {
                            cowbellSpanNode.style.color = "#FF0000";
                            coinSpanNode.style.color = "#00FF00";
                        } else {
                            cowbellSpanNode.style.color = "#00FF00";
                            coinSpanNode.style.color = "#FF0000";
                        }
                    }
                }

                return {ob: ob};
            }

            function showDungeonTokenValue() {
                const tokenMap = {
                    "chimerical_essence": {tokenType: "D1", tokenCount: 1},
                    "griffin_leather": {tokenType: "D1", tokenCount: 600},
                    "manticore_sting": {tokenType: "D1", tokenCount: 1000},
                    "jackalope_antler": {tokenType: "D1", tokenCount: 1200},
                    "dodocamel_plume": {tokenType: "D1", tokenCount: 3000},
                    "griffin_talon": {tokenType: "D1", tokenCount: 3000},

                    "sinister_essence": {tokenType: "D2", tokenCount: 1},
                    "acrobats_ribbon": {tokenType: "D2", tokenCount: 2000},
                    "magicians_cloth": {tokenType: "D2", tokenCount: 2000},
                    "chaotic_chain": {tokenType: "D2", tokenCount: 3000},
                    "cursed_ball": {tokenType: "D2", tokenCount: 3000},

                    "enchanted_essence": {tokenType: "D3", tokenCount: 1},
                    "royal_cloth": {tokenType: "D3", tokenCount: 2000},
                    "knights_ingot": {tokenType: "D3", tokenCount: 2000},
                    "bishops_scroll": {tokenType: "D3", tokenCount: 2000},
                    "regal_jewel": {tokenType: "D3", tokenCount: 3000},
                    "sundering_jewel": {tokenType: "D3", tokenCount: 3000},

                    "pirate_essence": {tokenType: "D4", tokenCount: 1},
                    "marksman_brooch": {tokenType: "D4", tokenCount: 2000},
                    "corsair_crest": {tokenType: "D4", tokenCount: 2000},
                    "damaged_anchor": {tokenType: "D4", tokenCount: 2000},
                    "maelstrom_plating": {tokenType: "D4", tokenCount: 2000},
                    "kraken_leather": {tokenType: "D4", tokenCount: 2000},
                    "kraken_fang": {tokenType: "D4", tokenCount: 3000}
                };

                function ob(node) {
                    const shopContainerNode = node.querySelector(".ShopPanel_tabsComponentContainer__3z6R4 .TabsComponent_tabPanelsContainer__26mzo");
                    if (!shopContainerNode) return;
                    const shopPanelNode = shopContainerNode.lastChild;
                    if (shopPanelNode.querySelector(".RangedWayIdleDungeonTokenValue")) return;
                    const localMarketAPIJson = getStorage("MWITools_marketAPI_json", true);
                    const marketData = localMarketAPIJson.marketData;
                    const maxItemPrice = {
                        "D1": {"a": 0, "b": 0},
                        "D2": {"a": 0, "b": 0},
                        "D3": {"a": 0, "b": 0},
                        "D4": {"a": 0, "b": 0}
                    }
                    // match dungeon shop
                    if (shopPanelNode.querySelectorAll(".ShopPanel_shopItem__10Noo").length !== 27) return;
                    for (const itemNode of shopPanelNode.querySelectorAll(".ShopPanel_shopItem__10Noo")) {
                        const itemName = itemNode.querySelector(".ShopPanel_itemContainer__1MlwA use").href.baseVal.split("#")[1];
                        if (!tokenMap[itemName]) continue;
                        const itemHrid = `/items/${itemName}`;

                        const askValue = marketData[itemHrid][0].a;
                        const bidValue = marketData[itemHrid][0].b;
                        const tokenCount = tokenMap[itemName].tokenCount;
                        const askValueEach = askValue / tokenCount;
                        const bidValueEach = bidValue / tokenCount;
                        maxItemPrice[tokenMap[itemName].tokenType].a = Math.max(maxItemPrice[tokenMap[itemName].tokenType].a, askValueEach);
                        maxItemPrice[tokenMap[itemName].tokenType].b = Math.max(maxItemPrice[tokenMap[itemName].tokenType].b, bidValueEach);

                        const divNode = document.createElement("div");

                        const textAskNode = document.createElement("span");
                        textAskNode.classList.add("RangedWayIdleDungeonTokenValue");
                        textAskNode.textContent = formatItemCount(askValueEach);
                        textAskNode.style.color = "#FF0000";
                        textAskNode.dataset.tokenType = tokenMap[itemName].tokenType;
                        textAskNode.dataset.value = askValueEach.toString();
                        textAskNode.dataset.type = "ask";
                        divNode.appendChild(textAskNode);

                        const splashNode = document.createElement("span");
                        splashNode.classList.add("RangedWayIdleDungeonTokenValue");
                        splashNode.textContent = " / ";
                        splashNode.style.color = "#66CCFF";
                        splashNode.dataset.type = "splash";
                        divNode.appendChild(splashNode);

                        const textBidNode = document.createElement("span");
                        textBidNode.classList.add("RangedWayIdleDungeonTokenValue");
                        textBidNode.textContent = formatItemCount(bidValueEach);
                        textBidNode.style.color = "#FF0000";
                        textBidNode.dataset.tokenType = tokenMap[itemName].tokenType;
                        textBidNode.dataset.value = bidValueEach.toString();
                        textBidNode.dataset.type = "bid";
                        divNode.appendChild(textBidNode);

                        itemNode.insertBefore(divNode, itemNode.lastChild);
                    }

                    for (const textNode of shopPanelNode.querySelectorAll(".RangedWayIdleDungeonTokenValue")) {
                        if (textNode.dataset.type === "ask") {
                            if (textNode.dataset.value === maxItemPrice[textNode.dataset.tokenType].a.toString()) {
                                textNode.style.color = "#00FF00";
                            }
                        } else if (textNode.dataset.type === "bid") {
                            if (textNode.dataset.value === maxItemPrice[textNode.dataset.tokenType].b.toString()) {
                                textNode.style.color = "#00FF00";
                            }
                        }
                    }
                    const tipNode = shopPanelNode.insertBefore(document.createElement("div"), shopPanelNode.firstChild);
                    tipNode.textContent = I18N("dungeonTokenValueTipText");
                    tipNode.style.color = "#66CCFF";
                    tipNode.style.fontSize = "1.2rem";
                }

                return {ob: ob};
            }

            function trackLeaderBoardData() {
                function getCurrentKey() {
                    const selectedTabs = document.querySelectorAll(".LeaderboardPanel_tabsComponentContainer__mIgnw .Mui-selected");
                    if (selectedTabs.length === 0) return;
                    const selectedText = Array.from(selectedTabs).map((tab) => tab.textContent);
                    return selectedText.join("-");
                }

                function createNoteAndButton(noteNode) {
                    const keyString = getCurrentKey();

                    // store data button
                    const storeButton = document.createElement("button");
                    storeButton.textContent = I18N("trackLeaderBoardDataLeaderboardStoreButton");
                    storeButton.style.backgroundColor = "#66CCFF";
                    storeButton.addEventListener("click", function () {
                        // get data
                        const leaderBoardData = {};
                        const tableNode = document.querySelector(".LeaderboardPanel_leaderboardTable__3JLvu");
                        for (const row of tableNode.querySelectorAll("tbody tr")) {
                            const characterNameNode = row.querySelector(".LeaderboardPanel_name__3hpvo").querySelector("span");
                            const guildNameNode = row.querySelector(".LeaderboardPanel_guildName__2RYcC");
                            const name = characterNameNode ? characterNameNode.textContent : guildNameNode.textContent;
                            const valueNode1 = row.querySelector(".LeaderboardPanel_valueColumn1__2HFDb");
                            const valueNode2 = row.querySelector(".LeaderboardPanel_valueColumn2__1ejF2");
                            const value = Number((valueNode2 ? valueNode2.textContent : valueNode1.textContent).replaceAll(",", ""));
                            leaderBoardData[name] = value || 0;
                        }

                        // store data
                        const localData = getStorage("ranged_way_idle_leaderboard_data") || {};
                        localData[keyString] = {
                            data: leaderBoardData, timestamp: new Date().getTime()
                        };
                        setStorage("ranged_way_idle_leaderboard_data", localData);
                    });
                    noteNode.appendChild(storeButton);

                    // delete data button
                    const deleteDataButton = document.createElement("button");
                    deleteDataButton.textContent = I18N("trackLeaderBoardDataLeaderboardDeleteButton");
                    deleteDataButton.style.backgroundColor = "#F44444";
                    deleteDataButton.addEventListener("click", function () {
                        const localData = getStorage("ranged_way_idle_leaderboard_data") || {};
                        delete localData[keyString];
                        setStorage("ranged_way_idle_leaderboard_data", localData);
                    });
                    noteNode.appendChild(deleteDataButton);

                    // record time text node
                    const localData = getStorage("ranged_way_idle_leaderboard_data") || {};
                    const recordTimeTextNode = document.createElement("div");
                    if (localData[keyString]) {
                        const recordTime = new Date(localData[keyString].timestamp);
                        const timeDelta = (new Date().getTime() - localData[keyString].timestamp) / 3600000;
                        recordTimeTextNode.textContent = I18N("trackLeaderBoardDataLeaderboardRecordTimeText", {
                            recordTime: recordTime.toLocaleString(), timeDelta: timeDelta.toFixed(2)
                        });
                    } else {
                        recordTimeTextNode.textContent = I18N("trackLeaderBoardDataLeaderboardNoRecordTimeText");
                    }
                    noteNode.appendChild(recordTimeTextNode);

                    // hint text node
                    const noteTextNode = document.createElement("div");
                    noteTextNode.textContent = I18N("trackLeaderBoardDataNoteText");
                    noteNode.appendChild(noteTextNode);
                }

                function showDifference(leaderBoardContentNode) {
                    const keyString = getCurrentKey();

                    const allStoreData = getStorage("ranged_way_idle_leaderboard_data") || {};
                    if (!allStoreData || !allStoreData[keyString]) {
                        return;
                    }
                    // expand panel
                    leaderBoardContentNode.style.maxWidth = '60rem';

                    // get current data
                    const localData = allStoreData[keyString].data;
                    const timeDelta = (new Date().getTime() - allStoreData[keyString].timestamp) / 1000;
                    const hourDelta = timeDelta / 3600;

                    const tableNode = leaderBoardContentNode.querySelector(".LeaderboardPanel_leaderboardTable__3JLvu");

                    // head
                    const headNode = tableNode.querySelector("thead").firstChild;
                    const diffNode = document.createElement("th");
                    diffNode.textContent = I18N("trackLeaderBoardDataDifference");
                    headNode.appendChild(diffNode);
                    const speedNode = document.createElement("th");
                    speedNode.textContent = I18N("trackLeaderBoardDataSpeed");
                    headNode.appendChild(speedNode);
                    const catchupTimeNode = document.createElement("th");
                    catchupTimeNode.textContent = I18N("trackLeaderBoardDataCatchupTime");
                    headNode.appendChild(catchupTimeNode);

                    // body
                    let previousRowValue = null;
                    let previousRowSpeed = null;
                    let maxSpeedValue = 0.0;
                    let personalRow = null;
                    let personalName = null;

                    // calculate max speed for set color
                    for (const row of tableNode.querySelectorAll("tbody tr")) {
                        const characterNameNode = row.querySelector(".LeaderboardPanel_name__3hpvo").querySelector("span");
                        const guildNameNode = row.querySelector(".LeaderboardPanel_guildName__2RYcC");
                        const name = characterNameNode ? characterNameNode.textContent : guildNameNode.textContent;
                        const valueNode1 = row.querySelector(".LeaderboardPanel_valueColumn1__2HFDb");
                        const valueNode2 = row.querySelector(".LeaderboardPanel_valueColumn2__1ejF2");
                        const value = Number((valueNode2 ? valueNode2.textContent : valueNode1.textContent).replaceAll(",", ""));
                        if (localData[name]) {
                            const diffValue = value - localData[name];
                            maxSpeedValue = Math.max(maxSpeedValue, diffValue / hourDelta);
                        }
                        if (row.classList.contains("LeaderboardPanel_personal__DZ7Nr")) {
                            personalRow = row;
                            personalName = name;
                        }
                    }

                    for (const row of tableNode.querySelectorAll("tbody tr")) {
                        const characterNameNode = row.querySelector(".LeaderboardPanel_name__3hpvo").querySelector("span");
                        const guildNameNode = row.querySelector(".LeaderboardPanel_guildName__2RYcC");
                        const name = characterNameNode ? characterNameNode.textContent : guildNameNode.textContent;
                        const valueNode1 = row.querySelector(".LeaderboardPanel_valueColumn1__2HFDb");
                        const valueNode2 = row.querySelector(".LeaderboardPanel_valueColumn2__1ejF2");
                        const value = Number((valueNode2 ? valueNode2.textContent : valueNode1.textContent).replaceAll(",", ""));

                        const diffValueNode = document.createElement("td");
                        diffValueNode.classList.add("RangedWayIdleLeaderBoardDiffValue");
                        const speedValueNode = document.createElement("td");
                        speedValueNode.classList.add("RangedWayIdleLeaderBoardSpeedValue");
                        const catchupTimeValueNode = document.createElement("td");
                        catchupTimeValueNode.classList.add("RangedWayIdleLeaderBoardCatchupTimeValue");

                        if (localData[name]) {
                            const diffValue = value - localData[name];
                            diffValueNode.textContent = diffValue.toLocaleString();
                            const speedValue = diffValue / hourDelta;
                            speedValueNode.textContent = formatItemCount(speedValue, 2) + "/h";

                            const k1 = Math.log(1 + (Math.E - 1) * speedValue / maxSpeedValue);
                            diffValueNode.style.color = `rgb(${255 - k1 * 255}, ${k1 * 255}, 0)`;
                            speedValueNode.style.color = `rgb(${255 - k1 * 255}, ${k1 * 255}, 0)`;

                            if (previousRowValue === null || previousRowSpeed === null) {
                                catchupTimeValueNode.textContent = "?????";
                                catchupTimeValueNode.style.color = "#66CCFF";
                            } else {
                                const deltaSpeed = speedValue - previousRowSpeed;
                                if (deltaSpeed === 0) {
                                    if (previousRowValue === value) {
                                        catchupTimeValueNode.textContent = I18N("trackLeaderBoardDataCatchupTimeNow");
                                        catchupTimeValueNode.style.color = "#00FF00";
                                    } else {
                                        catchupTimeValueNode.textContent = "∞";
                                        catchupTimeValueNode.style.color = "#FF0000";
                                    }
                                } else {
                                    const catchupTimeValue = (previousRowValue - value) / deltaSpeed;
                                    if (catchupTimeValue > 0) {
                                        catchupTimeValueNode.textContent = formatItemCount(catchupTimeValue, 2) + "h";
                                        const k2 = 10000 / (10000 + catchupTimeValue * catchupTimeValue);
                                        catchupTimeValueNode.style.color = `rgb(${255 - k2 * 255}, ${k2 * 255}, 0)`;
                                    } else if (catchupTimeValue === 0) {
                                        catchupTimeValueNode.textContent = "?????";
                                        catchupTimeValueNode.style.color = "#66CCFF";
                                    } else {
                                        catchupTimeValueNode.textContent = "∞";
                                        catchupTimeValueNode.style.color = "#FF0000";
                                    }
                                }
                            }
                            previousRowSpeed = speedValue;
                        } else {
                            diffValueNode.textContent = I18N("trackLeaderBoardDataNewRecordText");
                            speedValueNode.textContent = I18N("trackLeaderBoardDataNewRecordText");
                            catchupTimeValueNode.textContent = I18N("trackLeaderBoardDataNewRecordText");
                            diffValueNode.style.color = "#66CCFF";
                            speedValueNode.style.color = "#66CCFF";
                            catchupTimeValueNode.style.color = "#66CCFF";
                            previousRowSpeed = null;
                        }
                        previousRowValue = value;

                        // personal row
                        if (row.classList.contains("LeaderboardPanel_personal__DZ7Nr")) {
                            previousRowValue = null;
                            previousRowSpeed = null;
                        }

                        row.appendChild(diffValueNode);
                        row.appendChild(speedValueNode);
                        row.appendChild(catchupTimeValueNode);

                        if (personalRow && personalName === name) {
                            personalRow.querySelector(".RangedWayIdleLeaderBoardCatchupTimeValue").textContent = catchupTimeValueNode.textContent;
                            personalRow.querySelector(".RangedWayIdleLeaderBoardCatchupTimeValue").style.color = catchupTimeValueNode.style.color;
                        }
                    }
                }

                function ob(node) {
                    const leaderBoardRootNode = node.querySelector(".LeaderboardPanel_leaderboardPanel__19U0W");
                    if (!leaderBoardRootNode) return;
                    const noteNode = leaderBoardRootNode.querySelector(".LeaderboardPanel_note__z4OpJ");
                    if (!noteNode) return;

                    // make note and buttons
                    if (noteNode.classList.contains("RangedWayIdleLeaderBoardNote")) return;
                    noteNode.classList.add("RangedWayIdleLeaderBoardNote");
                    createNoteAndButton(noteNode);

                    // show difference
                    const leaderBoardContentNode = leaderBoardRootNode.querySelector(".LeaderboardPanel_content__p_WNw");
                    showDifference(leaderBoardContentNode);
                }

                return {ob: ob};
            }

            function actionQueueNotify() {
                const audio = new Audio('https://upload.thbwiki.cc/a/a8/se_notice.mp3');
                let lastLength;

                function ob(node) {
                    const nowLength = globalVariables.gameStateNode?.state?.characterActions?.length;
                    if (nowLength <= configs.gameInfoClass.actionQueueNotifyCount.value
                        && lastLength > configs.gameInfoClass.actionQueueNotifyCount.value) {
                        audio.volume = configs.gameInfoClass.actionQueueNotifyVolume.value;
                        audio.play();
                    }
                    lastLength = nowLength;
                }

                return {ob: ob};
            }

            function showQueueLengthInTitle() {
                function ob(node) {
                    const nowLength = globalVariables.gameStateNode?.state?.characterActions?.length;
                    if (!document.title.startsWith("[") && typeof (nowLength) === "number") {
                        document.title = `[${nowLength}] ${document.title}`;
                    }
                }

                return {ob: ob};
            }

            return {
                initCharacterData: initCharacterData,
                updateLocalStorageMarketPrice: updateLocalStorageMarketPrice,
                showTaskValue: showTaskValue,
                showTaskRerollValue: showTaskRerollValue,
                showDungeonTokenValue: showDungeonTokenValue,
                trackLeaderBoardData: trackLeaderBoardData,
                actionQueueNotify: actionQueueNotify,
                showQueueLengthInTitle: showQueueLengthInTitle
            }
        }

        gameUIClass() {
            function autoClickTaskSortButton() {
                function ob(node) {
                    const buttonNode = node.querySelector('#TaskSort');
                    if (!buttonNode || buttonNode.classList.contains("RangedWayIdleAutoClicked")) return;
                    buttonNode.click();
                    buttonNode.classList.add("RangedWayIdleAutoClicked");
                }

                return {ob: ob};
            }

            function showMarketAPIUpdateTime() {
                let lastTime = 0;

                function ob(node) {
                    const buttonContainerNode = node.querySelector(".MarketplacePanel_buttonContainer__vJQud");
                    if (!buttonContainerNode) return;
                    const nowTime = getStorage("MWITools_marketAPI_json", true)?.timestamp || 0;
                    const lastNode = buttonContainerNode.querySelector(".RangedWayIdleShowMarketAPIUpdateTime");
                    if (nowTime === lastTime) return;
                    if (lastNode) lastNode.remove();
                    lastTime = nowTime;
                    const divNode = document.createElement("div");
                    divNode.textContent = I18N("showMarketAPIUpdateTimeText") + " " + new Date(nowTime * 1000).toLocaleString();
                    divNode.style.color = "rgb(102,204,255)";
                    divNode.classList.add("RangedWayIdleShowMarketAPIUpdateTime");
                    buttonContainerNode.insertBefore(divNode, buttonContainerNode.lastChild);
                }

                return {ob: ob};
            }

            function forceUpdateAPIButton() {
                function ob(node) {
                    const listingContainerNode = node.querySelector(".MarketplacePanel_listingCount__3nVY_");
                    if (!listingContainerNode || !listingContainerNode.querySelector("button")) return;
                    if (listingContainerNode.querySelector(".RangedWayIdleForceUpdateAPIButton")) return;
                    const buttonNode = listingContainerNode.querySelector("button").cloneNode(true);
                    buttonNode.classList.add("RangedWayIdleForceUpdateAPIButton");
                    buttonNode.textContent = I18N("forceUpdateAPIButtonText");
                    buttonNode.addEventListener("click", async function () {
                        if (GM && GM.xmlHttpRequest) {
                            GM.xmlHttpRequest({
                                method: 'GET', url: globalVariables.marketAPIUrl, onload: function (response) {
                                    const obj = JSON.parse(response.responseText);
                                    setStorage("MWITools_marketAPI_json", obj, true);
                                    if (configs.gameUIClass.forceUpdateAPIWithTime.value) {
                                        setStorage("MWITools_marketAPI_timestamp", new Date().getTime(), true);
                                    }
                                    alert(I18N("forceUpdateAPIButtonTextSuccess") + new Date(obj.timestamp * 1000).toLocaleString());
                                }, onerror: function (err) {
                                    alert(I18N("forceUpdateAPIButtonTextError"));
                                    console.error(err);
                                }, ontimeout: function () {
                                    alert(I18N("forceUpdateAPIButtonTextTimeout"));
                                    console.error('timeout');
                                }
                            });
                        } else {
                            const resp = await fetch(globalVariable.marketURL);
                            const obj = await resp.json();
                            setStorage("MWITools_marketAPI_json", obj);
                            if (configs.gameUIClass.forceUpdateAPIWithTime.value) {
                                setStorage("MWITools_marketAPI_timestamp", new Date().getTime(), true);
                            }
                            alert(I18N("forceUpdateAPIButtonTextSuccess") + new Date(obj.timestamp * 1000).toLocaleString());
                        }
                    });
                    listingContainerNode.appendChild(buttonNode);
                }

                return {ob: ob};
            }

            function disableQueueUpgradeButton() {
                const disabledButtons = [];

                function ob(node) {
                    const buttons = node.querySelectorAll("button");
                    for (const button of buttons) {
                        if ((button.textContent === "Upgrade Queue Capacity" || button.textContent === "升级行动队列") && !button.disabled) {
                            button.disabled = true;
                            disabledButtons.push(button);
                        }
                    }
                    for (let i = disabledButtons.length - 1; i >= 0; i--) {
                        const button = disabledButtons[i];
                        if (!button.isConnected || (button.textContent !== "Upgrade Queue Capacity" && button.textContent !== "升级行动队列")) {
                            button.disabled = false;
                            disabledButtons.splice(i, 1);
                        }
                    }
                }

                return {ob: ob};
            }

            function disableActionQueueBar() {
                function ob(node) {
                    const actionQueueBarNode = node.querySelector(".QueuedActions_queuedActionsEditMenu__3OoQH");
                    if (!actionQueueBarNode) return;
                    const buttonNode = node.querySelector(".QueuedActions_queuedActions__2xerL ");
                    buttonNode.click();
                }

                return {ob: ob};
            }

            function hideSideBarButton() {
                let hideConfigs = null;
                let hasInit = false;

                function hideSideBar() {
                    const sideBarRootNode = document.querySelector(".NavigationBar_navigationLinks__1XSSb");
                    if (!sideBarRootNode) return false;
                    for (const sideBarNode of sideBarRootNode.querySelectorAll(".NavigationBar_navigationLink__3eAHA ")) {
                        for (const useNode of sideBarNode.querySelectorAll("use")) {
                            if (hideConfigs[useNode.href.baseVal] !== undefined) {
                                sideBarNode.style.display = hideConfigs[useNode.href.baseVal] ? "none" : "block";
                                break;
                            }
                        }
                    }
                    return true;
                }

                function showHideSideBarConfigMenu(node) {
                    // add this after config menu
                    const configMenuRootNode = node.querySelector(".RangedWayIdleConfigMenuRoot");
                    if (!configMenuRootNode) return;
                    if (configMenuRootNode.parentNode.querySelector(".RangedWayIdleHideSidebar")) return;
                    const divRootNode = document.createElement("div");
                    divRootNode.appendChild(document.createElement("div"));
                    divRootNode.firstChild.textContent = I18N("hideSidebarText");
                    divRootNode.firstChild.style.fontSize = "1.5rem";
                    divRootNode.classList.add("RangedWayIdleHideSidebar");

                    for (const key in hideConfigs) {
                        const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        const useNode = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                        useNode.setAttributeNS('http://www.w3.org/1999/xlink', 'href', key);
                        svgNode.appendChild(useNode);
                        svgNode.style.width = "2.5rem";
                        svgNode.style.height = "2.5rem";
                        svgNode.style.opacity = hideConfigs[key] ? "0.25" : "1";
                        svgNode.onclick = function () {
                            hideConfigs[key] = !hideConfigs[key];
                            svgNode.style.opacity = hideConfigs[key] ? "0.25" : "1";
                            setStorage("ranged_way_idle_hide_sidebar_config", hideConfigs);
                            hideSideBar();
                        };
                        divRootNode.appendChild(svgNode);
                    }
                    configMenuRootNode.insertAdjacentElement("afterend", divRootNode);
                }

                function ob(node) {
                    // init hide svg
                    if (hideConfigs === null) {
                        const sideBarRootNode = node.querySelector(".NavigationBar_navigationLinks__1XSSb");
                        if (!sideBarRootNode) return;
                        const localConfigs = getStorage("ranged_way_idle_hide_sidebar_config") || {};
                        hideConfigs = {};
                        for (const sideBarNode of sideBarRootNode.querySelectorAll(".NavigationBar_navigationLink__3eAHA ")) {
                            const useNode = sideBarNode.querySelector("use");
                            if (useNode.href.baseVal.includes("triangle_")) {
                                // combat
                                const link = "/static/media/misc_sprite.354aafcf.svg#combat";
                                hideConfigs[link] = localConfigs[link] || false;
                            } else if (!useNode.href.baseVal.includes("settings")) {
                                // cannot hide settings
                                hideConfigs[useNode.href.baseVal] = localConfigs[useNode.href.baseVal] || false;
                            }
                        }
                    }
                    showHideSideBarConfigMenu(node);
                    if (!hasInit) hasInit = hideSideBar();
                }

                function ws(obj) {
                    if (obj.type === "init_character_data") {
                        hasInit = false;
                    }
                }

                return {ob: ob, ws: ws};
            }

            function hideTrainRubbishButton() {
                const rubbishNames = [];
                for (const a of ['cheese', 'verdant', 'azure', 'burble', 'crimson', 'rainbow']) {
                    for (const b of ['brush', 'shears', 'hatchet', 'hammer', 'chisel', 'needle', 'spatula', 'pot', 'alembic', 'enhancer', 'sword', 'spear', 'mace', 'bulwark', 'buckler', 'boots', 'gauntlets', 'helmet', 'plate_legs', 'plate_body',]) {
                        rubbishNames.push(`${a}_${b}`);
                    }
                }
                for (const a of ['wooden', 'birch', 'cedar', 'purpleheart', 'ginkgo', 'redwood']) {
                    for (const b of ['crossbow', 'bow', 'water_staff', 'nature_staff', 'fire_staff', 'shield']) {
                        rubbishNames.push(`${a}_${b}`);
                    }
                }
                for (const a of ['rough', 'reptile', 'gobo', 'beast']) {
                    for (const b of ['boots', 'bracers', 'hood', 'chaps', 'tunic']) {
                        rubbishNames.push(`${a}_${b}`);
                    }
                }
                for (const a of ['cotton', 'linen', 'bamboo', 'silk']) {
                    for (const b of ['boots', 'gloves', 'hat', 'robe_bottoms', 'robe_top']) {
                        rubbishNames.push(`${a}_${b}`);
                    }
                }

                function hide(inventoryNode) {
                    for (const itemContainerNode of inventoryNode.querySelectorAll(".Item_itemContainer__x7kH1")) {
                        const itemName = itemContainerNode.querySelector("use").href.baseVal.split("#")[1];
                        const isNotEnhanced = !itemContainerNode.querySelector(".Item_enhancementLevel__19g-e");
                        if (rubbishNames.includes(itemName) && isNotEnhanced) {
                            itemContainerNode.style.display = "none";
                        }
                    }
                }

                function show(inventoryNode) {
                    if (configs.gameUIClass.alwaysHideTrainRubbish.value) return;
                    for (const itemContainerNode of inventoryNode.querySelectorAll(".Item_itemContainer__x7kH1")) {
                        itemContainerNode.style.display = "block";
                    }
                }

                function ob(node) {
                    for (const inventoryNode of node.querySelectorAll(".Inventory_inventory__17CH2")) {
                        if (configs.gameUIClass.alwaysHideTrainRubbish.value) hide(inventoryNode);
                        if (inventoryNode.querySelector(".RangedWayIdleHideTrainRubbishButton")) continue;
                        const hideButtonNode = document.createElement("button");
                        hideButtonNode.textContent = I18N("hideTrainRubbishButtonText");
                        hideButtonNode.style.backgroundColor = "#66CCFF";
                        hideButtonNode.classList.add("RangedWayIdleHideTrainRubbishButton");
                        hideButtonNode.addEventListener("click", () => hide(inventoryNode));

                        const showButtonNode = document.createElement("button");
                        showButtonNode.textContent = I18N("showTrainRubbishButtonText");
                        showButtonNode.style.backgroundColor = "#66CCFF";
                        showButtonNode.addEventListener("click", () => show(inventoryNode));

                        inventoryNode.insertBefore(showButtonNode, inventoryNode.firstChild);
                        inventoryNode.insertBefore(hideButtonNode, inventoryNode.firstChild);
                    }
                }

                return {ob: ob};

            }

            function addWatermark() {
                let watermark = null;
                let lastText = "";

                function draw(text) {
                    if (!document || !document.body) return;
                    watermark = document.createElement('div');
                    watermark.classList.add("RangedWayIdleWatermark");

                    Object.assign(watermark.style, {
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: '9999',
                        opacity: '0.3'
                    });

                    const canvas = document.createElement('canvas');
                    canvas.width = 100;
                    canvas.height = 100;
                    const ctx = canvas.getContext('2d');

                    ctx.font = '16px Arial';
                    ctx.fillStyle = '#999999';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(-Math.PI / 6);
                    ctx.fillText(text, 0, 0);
                    lastText = text;

                    watermark.style.backgroundImage = `url(${canvas.toDataURL()})`;
                    watermark.style.backgroundRepeat = 'repeat';

                    document.body.appendChild(watermark);
                }

                function ob() {
                    if (configs.gameUIClass.watermarkText.value !== lastText || !configs.gameUIClass.addWatermark.value) {
                        if (watermark) {
                            watermark.remove();
                            watermark = null;
                        }
                        lastText = "";
                    }
                    if (!watermark) draw(configs.gameUIClass.watermarkText.value);
                }

                return {ob: ob};
            }

            function quickCopyItemHrid() {
                let lastItemHrid = "";

                function marketPanelCopy(node) {
                    const buttonContainerNode = node.querySelector(".MarketplacePanel_marketNavButtonContainer__2QI9I");
                    if (!buttonContainerNode) return;
                    if (!node.querySelector(".MarketplacePanel_currentItem__3ercC .Item_iconContainer__5z7j4 use")) return;
                    const itemHrid = "/items/" + node.querySelector(".MarketplacePanel_currentItem__3ercC .Item_iconContainer__5z7j4 use").href.baseVal.split("#")[1];
                    if (itemHrid !== lastItemHrid) {
                        const lastButton = buttonContainerNode.querySelector(".RangedWayIdleQuickCopyItemHridButton");
                        if (lastButton) lastButton.remove();
                        lastItemHrid = itemHrid;
                        const buttonNode = buttonContainerNode.firstChild.cloneNode(true);
                        buttonNode.classList.add("RangedWayIdleQuickCopyItemHridButton");
                        buttonNode.textContent = I18N("quickCopyItemHridButtonText");
                        buttonNode.addEventListener("click", () => {
                            navigator.clipboard.writeText(itemHrid);
                        });
                        buttonContainerNode.appendChild(buttonNode);
                    }
                }

                function itemActionMenuCopy(node) {
                    const itemActionMenuNode = node.querySelector(".Item_actionMenu__2yUcG");
                    if (!itemActionMenuNode) return;
                    if (itemActionMenuNode.querySelector(".RangedWayIdleQuickCopyItemHridButton")) return;
                    if (!node.querySelector(".Item_selected__1lIgj use")) return;
                    const itemHrid = "/items/" + node.querySelector(".Item_selected__1lIgj use").href.baseVal.split("#")[1];
                    const buttonNode = itemActionMenuNode.querySelector(":not(.Button_small__3fqC7).Button_button__1Fe9z").cloneNode(true);
                    buttonNode.classList.add("RangedWayIdleQuickCopyItemHridButton");
                    buttonNode.textContent = I18N("quickCopyItemHridButtonText");
                    buttonNode.addEventListener("click", () => {
                        navigator.clipboard.writeText(itemHrid);
                    });
                    itemActionMenuNode.insertBefore(buttonNode, itemActionMenuNode.lastChild);
                }

                function ob(node) {
                    marketPanelCopy(node);
                    itemActionMenuCopy(node);
                }

                return {ob: ob};
            }

            function visibleItemCountMarket() {
                // Inspired by GM 539693
                function ob(node) {
                    if (!node.querySelector(".MarketplacePanel_marketItems__D4k7e")) return;
                    const itemCountMap = {};
                    for (const item of globalVariables.gameStateNode.state.characterItemMap.values()) {
                        if (configs.gameUIClass.visibleItemCountCountEquippedItems.value || (item.itemLocationHrid === "/item_locations/inventory")) {
                            itemCountMap[item.itemHrid] = (itemCountMap[item.itemHrid] || 0) + item.count;
                        }
                    }
                    for (const targetNode of node.querySelectorAll(".MarketplacePanel_marketItems__D4k7e .Item_clickable__3viV6")) {
                        const divNode = targetNode.querySelector(".SimpleMarketNext") || targetNode.appendChild(document.createElement("div"));
                        const itemHrid = "/items/" + targetNode.querySelector("use").href.baseVal.split("#")[1];
                        const itemCount = (itemCountMap[itemHrid] || 0).toString();
                        const opacity = configs.gameUIClass.visibleItemCountOpacity.value.toString();
                        if ((divNode.textContent === itemCount) || (divNode.textContent === "" && itemCount === "0" && targetNode.style.opacity === opacity)) continue;
                        if (itemCount === "0") {
                            targetNode.style.opacity = opacity;
                            divNode.textContent = "";
                        } else {
                            targetNode.style.opacity = "1.0";
                            divNode.textContent = itemCount;
                        }
                        if (!divNode.classList.contains("SimpleMarketNext")) {
                            divNode.classList.add("SimpleMarketNext");
                            targetNode.style.position = "relative";
                            divNode.style.position = "absolute";
                            divNode.style.bottom = "-1px";
                            divNode.style.right = "2px";
                            divNode.style.textAlign = "right";
                        }
                    }
                }

                return {ob: ob};
            }

            return {
                autoClickTaskSortButton: autoClickTaskSortButton,
                showMarketAPIUpdateTime: showMarketAPIUpdateTime,
                forceUpdateAPIButton: forceUpdateAPIButton,
                disableQueueUpgradeButton: disableQueueUpgradeButton,
                disableActionQueueBar: disableActionQueueBar,
                hideSideBarButton: hideSideBarButton,
                hideTrainRubbishButton: hideTrainRubbishButton,
                addWatermark: addWatermark,
                quickCopyItemHrid: quickCopyItemHrid,
                visibleItemCountMarket: visibleItemCountMarket,
            }
        }

        listingClass() {
            function hookListingInfo() {
                function handleListing(listing) {
                    if (listing.status === "/market_listing_status/cancelled" || (listing.status === "/market_listing_status/filled" && listing.unclaimedItemCount === 0 && listing.unclaimedCoinCount === 0)) {
                        delete globalVariables.allListings[listing.id];
                        return;
                    }
                    globalVariables.allListings[listing.id] = {
                        id: listing.id,
                        isSell: listing.isSell,
                        itemHrid: listing.itemHrid,
                        enhancementLevel: listing.enhancementLevel,
                        orderQuantity: listing.orderQuantity,
                        filledQuantity: listing.filledQuantity,
                        price: listing.price,
                        coinsAvailable: listing.coinsAvailable,
                        unclaimedItemCount: listing.unclaimedItemCount,
                        unclaimedCoinCount: listing.unclaimedCoinCount,
                        createdTimestamp: listing.createdTimestamp,
                    }
                }

                function saveListings() {
                    const obj = getStorage("ranged_way_idle_market_listings") || {};
                    const characterId = globalVariables.initCharacterData.character.id;
                    if (!obj[characterId]) obj[characterId] = {};
                    for (const listingId in globalVariables.allListings) {
                        if (obj[characterId][listingId]) continue;
                        const listing = globalVariables.allListings[listingId];
                        obj[characterId][listingId] = {
                            id: listing.id,
                            isSell: listing.isSell,
                            itemHrid: listing.itemHrid,
                            enhancementLevel: listing.enhancementLevel,
                            orderQuantity: listing.orderQuantity,
                            filledQuantity: listing.filledQuantity,
                            price: listing.price,
                            createdTimestamp: listing.createdTimestamp,
                        }
                    }
                    const nowTime = new Date().getTime();
                    for (const listingId in obj[characterId]) {
                        const listing = obj[characterId][listingId];
                        if (nowTime - new Date(listing.createdTimestamp).getTime() > configs.listingClass.saveListingInfoToLocalStorageMaxDays * 24 * 60 * 60 * 1000) {
                            delete obj[characterId][listingId];
                        }
                    }
                    setStorage("ranged_way_idle_market_listings", obj);
                }

                function ws(obj) {
                    if (obj.type === "init_character_data") {
                        for (const listing of obj.myMarketListings) {
                            handleListing(listing);
                        }
                        if (configs.listingClass.saveListingInfoToLocalStorage.value) {
                            saveListings();
                        }
                    } else if (obj.type === "market_listings_updated") {
                        for (const listing of obj.endMarketListings) {
                            handleListing(listing);
                        }
                        if (configs.listingClass.saveListingInfoToLocalStorage.value) {
                            saveListings();
                        }
                    }
                }

                return {ws: ws};
            }

            function showTotalListingFunds() {
                function ws(obj) {
                    if (obj.type === "market_listings_updated") {
                        document.querySelectorAll(".RangedWayIdleTotalListingFunds").forEach(node => {
                            node.remove();
                        });
                    }
                }

                function ob(node) {
                    const marketplacePanelNode = node.querySelector(".MarketplacePanel_marketplacePanel__21b7o");
                    if (!marketplacePanelNode) return;
                    if (marketplacePanelNode.querySelector(".RangedWayIdleTotalListingFunds")) return;

                    let totalUnclaimedCoins = 0;
                    let totalPrepaidCoins = 0;
                    let totalSellResultCoins = 0;

                    for (const listing of Object.values(globalVariables.allListings)) {
                        totalUnclaimedCoins += listing.unclaimedCoinCount;
                        totalPrepaidCoins += listing.coinsAvailable;
                        if (listing.isSell) {
                            const tax = listing.itemHrid === "/items/bag_of_10_cowbells" ? 0.82 : 0.98;
                            totalSellResultCoins += (listing.orderQuantity - listing.filledQuantity) * Math.floor(listing.price * tax)
                        }
                    }

                    const currentCoinNode = marketplacePanelNode.querySelector(".MarketplacePanel_coinStack__1l0UD");

                    const totalUnclaimedCoinsNode = currentCoinNode.cloneNode(true);
                    const totalPrepaidCoinsNode = currentCoinNode.cloneNode(true);
                    const totalSellResultCoinsNode = currentCoinNode.cloneNode(true);

                    totalUnclaimedCoinsNode.querySelector(".Item_count__1HVvv").textContent = formatItemCount(totalUnclaimedCoins, configs.listingClass.showTotalListingFundsPrecise.value);
                    totalPrepaidCoinsNode.querySelector(".Item_count__1HVvv").textContent = formatItemCount(totalPrepaidCoins, configs.listingClass.showTotalListingFundsPrecise.value);
                    totalSellResultCoinsNode.querySelector(".Item_count__1HVvv").textContent = formatItemCount(totalSellResultCoins, configs.listingClass.showTotalListingFundsPrecise.value);

                    totalUnclaimedCoinsNode.querySelector(".Item_name__2C42x").textContent = I18N("totalUnclaimedCoinsText");
                    totalPrepaidCoinsNode.querySelector(".Item_name__2C42x").textContent = I18N("totalPrepaidCoinsText");
                    totalSellResultCoinsNode.querySelector(".Item_name__2C42x").textContent = I18N("totalSellResultCoinsText");

                    totalUnclaimedCoinsNode.querySelector(".Item_name__2C42x").style.color = "#66CCFF";
                    totalPrepaidCoinsNode.querySelector(".Item_name__2C42x").style.color = "#66CCFF";
                    totalSellResultCoinsNode.querySelector(".Item_name__2C42x").style.color = "#66CCFF";

                    currentCoinNode.style.left = "0rem";
                    currentCoinNode.style.top = "0rem";
                    totalUnclaimedCoinsNode.style.left = "0rem";
                    totalUnclaimedCoinsNode.style.top = "1.5rem";
                    totalPrepaidCoinsNode.style.left = "8rem";
                    totalPrepaidCoinsNode.style.top = "0rem";
                    totalSellResultCoinsNode.style.left = "8rem";
                    totalSellResultCoinsNode.style.top = "1.5rem";

                    totalUnclaimedCoinsNode.classList.add("RangedWayIdleTotalListingFunds");
                    totalPrepaidCoinsNode.classList.add("RangedWayIdleTotalListingFunds");
                    totalSellResultCoinsNode.classList.add("RangedWayIdleTotalListingFunds");

                    marketplacePanelNode.insertBefore(totalUnclaimedCoinsNode, currentCoinNode.nextSibling);
                    marketplacePanelNode.insertBefore(totalPrepaidCoinsNode, currentCoinNode.nextSibling);
                    marketplacePanelNode.insertBefore(totalSellResultCoinsNode, currentCoinNode.nextSibling);
                }

                return {ws: ws, ob: ob}
            }

            function showListingInfo() {
                const allCreateTimeNodes = [];
                let intervalId = null;

                function magicSortInit() {
                    let initialized = false;
                    let buttonsAdded = false;
                    let currentSort = 'time-asc';
                    let pinUndercutOnTop = false;
                    let isSorting = false;
                    let rowTimestamps = new WeakMap();
                    let priceCache = new Map();
                    let marketSearchKeyword = '';
                    let marketObserver = null;
                    let notificationObserver = null;

                    function getItemName(row) {
                        try {
                            const svg = row.querySelector('svg[aria-label]');
                            if (svg) return svg.getAttribute('aria-label') || '';
                            const itemElement = row.querySelector('.Item_item__2De2O');
                            if (itemElement) return itemElement.textContent ? itemElement.textContent.trim() : '';
                            return '';
                        } catch {
                            return '';
                        }
                    }

                    function parsePrice(priceText) {
                        try {
                            if (!priceText) return 0;
                            const text = priceText.replace(/[^\d.KM]/g, '');
                            const number = parseFloat(text.replace(/[KM]/g, ''));
                            if (isNaN(number)) return 0;
                            if (text.includes('M')) return number * 1000000;
                            if (text.includes('K')) return number * 1000;
                            return number;
                        } catch {
                            return 0;
                        }
                    }

                    function isCollectableItem(row) {
                        try {
                            const collectButton = row.querySelector('.MarketplacePanel_claimsContainer__29bqh .Button_button__1Fe9z');
                            const claimsContent = row.querySelector('.MarketplacePanel_claims__WmSFp');
                            return !!(collectButton && claimsContent && claimsContent.children.length > 0 && collectButton.textContent && collectButton.textContent.includes('收集'));
                        } catch {
                            return false;
                        }
                    }

                    function updatePriceCache(row) {
                        try {
                            const itemName = getItemName(row);
                            const priceElement = row.querySelector('.MarketplacePanel_price__hIzrY span');
                            const price = priceElement ? priceElement.textContent.trim() : null;
                            if (itemName && price) priceCache.set(itemName, price);
                        } catch {
                        }
                    }

                    function updateAllPriceCache() {
                        try {
                            const tbody = document.querySelector('.MarketplacePanel_myListingsTable__3P1aT tbody');
                            if (!tbody) return;
                            const rows = Array.from(tbody.children).filter(r => r.tagName === 'TR' && r.querySelector('td'));
                            rows.forEach(updatePriceCache);
                        } catch {
                        }
                    }

                    function initializeTimeTracking() {
                        try {
                            const tbody = document.querySelector('.MarketplacePanel_myListingsTable__3P1aT tbody');
                            if (!tbody) return;
                            const rows = Array.from(tbody.children).filter(r => r.tagName === 'TR' && r.querySelector('td'));
                            rowTimestamps = new WeakMap();
                            const base = Date.now();
                            rows.forEach((row, idx) => {
                                const ts = base - (rows.length - idx) * 1000;
                                rowTimestamps.set(row, ts);
                                updatePriceCache(row);
                            });
                        } catch {
                        }
                    }

                    function startMarketObserver() {
                        try {
                            const tbody = document.querySelector('.MarketplacePanel_myListingsTable__3P1aT tbody');
                            if (!tbody) return;
                            if (marketObserver) marketObserver.disconnect();
                            marketObserver = new MutationObserver(mutations => {
                                let changed = false;
                                for (const m of mutations) {
                                    if (m.type === 'childList') {
                                        m.addedNodes.forEach(n => {
                                            if (n.tagName === 'TR' && n.querySelector('td')) {
                                                if (!rowTimestamps.has(n)) rowTimestamps.set(n, Date.now());
                                                updatePriceCache(n);
                                                changed = true;
                                            }
                                        });
                                        if (m.removedNodes.length) changed = true;
                                    }
                                }
                                if (changed) updateAllPriceCache();
                            });
                            marketObserver.observe(tbody, {childList: true, subtree: false});
                            updateAllPriceCache();
                        } catch {
                        }
                    }

                    function stopMarketObserver() {
                        if (marketObserver) {
                            marketObserver.disconnect();
                            marketObserver = null;
                        }
                    }

                    function startNotificationObserver() {
                        try {
                            const container = document.querySelector('.GamePage_notifications__1xT_i');
                            if (!container) return;
                            if (notificationObserver) notificationObserver.disconnect();
                            notificationObserver = new MutationObserver(() => {
                            });
                            notificationObserver.observe(container, {
                                childList: true,
                                subtree: true,
                                characterData: true
                            });
                        } catch {
                        }
                    }

                    function stopNotificationObserver() {
                        if (notificationObserver) {
                            notificationObserver.disconnect();
                            notificationObserver = null;
                        }
                    }

                    function filterMarketItems() {
                        try {
                            const tbody = document.querySelector('.MarketplacePanel_myListingsTable__3P1aT tbody');
                            if (!tbody) return;
                            const rows = Array.from(tbody.children).filter(r => r.tagName === 'TR' && r.querySelector('td'));
                            rows.forEach(row => {
                                const name = getItemName(row);
                                const show = !marketSearchKeyword || name.toLowerCase().includes(marketSearchKeyword.toLowerCase());
                                if (show) row.classList.remove('magic-table-row-hidden');
                                else row.classList.add('magic-table-row-hidden');
                            });
                            const clearBtn = document.querySelector('.magic-clear-market-search');
                            if (clearBtn) clearBtn.style.display = marketSearchKeyword ? 'flex' : 'none';
                        } catch {
                        }
                    }

                    function sortMarketItems() {
                        if (isSorting) return false;
                        return attemptSort(0);
                    }

                    function attemptSort(retryCount) {
                        if (retryCount >= 3) return false;
                        try {
                            isSorting = true;
                            const tbody = document.querySelector('.MarketplacePanel_myListingsTable__3P1aT tbody');
                            if (!tbody) {
                                isSorting = false;
                                return false;
                            }
                            const allRows = Array.from(tbody.children).filter(r => r.tagName === 'TR' && r.querySelector('td'));
                            if (!allRows.length) {
                                isSorting = false;
                                return false;
                            }
                            const data = allRows.map((row, index) => {
                                const itemName = getItemName(row);
                                const priceElement = row.querySelector('.MarketplacePanel_price__hIzrY span');
                                const priceText = priceElement ? priceElement.textContent.trim() : '0';
                                const price = parsePrice(priceText);
                                const isCollectable = isCollectableItem(row);
                                let isUndercut = false;
                                try {
                                    const spans = row.querySelectorAll('.RangedWayIdleShowListingInfo span');
                                    if (spans && spans.length) {
                                        const color = getComputedStyle(spans[0]).color;
                                        isUndercut = /rgb\(255,\s*0,\s*0\)/i.test(color) || color.toLowerCase() === '#ff0000';
                                    }
                                } catch {
                                }
                                const timestamp = rowTimestamps.get(row) || Date.now();
                                if (itemName && priceText && priceText !== '0') priceCache.set(itemName, priceText);
                                return {
                                    row,
                                    itemName,
                                    price,
                                    priceText,
                                    isCollectable,
                                    originalIndex: index,
                                    timestamp,
                                    isUndercut
                                };
                            });
                            const sorted = [...data].sort((a, b) => {
                                if (a.isCollectable && !b.isCollectable) return -1;
                                if (!a.isCollectable && b.isCollectable) return 1;
                                if (pinUndercutOnTop) {
                                    if (a.isUndercut && !b.isUndercut) return -1;
                                    if (!a.isUndercut && b.isUndercut) return 1;
                                }
                                if (currentSort === 'name-asc') return a.itemName.localeCompare(b.itemName, 'zh-CN');
                                if (currentSort === 'price-asc') return a.price - b.price;
                                return a.timestamp - b.timestamp;
                            });
                            while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
                            sorted.forEach(({row, isCollectable}) => {
                                row.style.backgroundColor = isCollectable ? 'rgba(76, 175, 80, 0.15)' : '';
                                tbody.appendChild(row);
                            });
                            isSorting = false;
                            if (marketSearchKeyword) filterMarketItems();
                            return true;
                        } catch (e) {
                            isSorting = false;
                            if (retryCount < 2) {
                                setTimeout(() => attemptSort(retryCount + 1), 200);
                                return false;
                            }
                            return false;
                        }
                    }

                    function addMarketSortButton() {
                        try {
                            const marketPanel = document.querySelector('.MarketplacePanel_myListings__25wPW');
                            if (!marketPanel) return;
                            const buttonContainer = marketPanel.querySelector('.MarketplacePanel_buttonContainer__vJQud');
                            if (!buttonContainer) return;
                            if (buttonContainer.closest('.MarketplacePanel_modalContent__3YhCo')) return;
                            const existingButtons = buttonContainer.querySelectorAll('.magic-sort-button, .magic-refresh-button');
                            const existingContainers = buttonContainer.querySelectorAll('.magic-search-container, .magic-button-container');
                            existingButtons.forEach(btn => btn.remove());
                            existingContainers.forEach(c => c.remove());
                            {
                                const css = '.MarketplacePanel_myListings__25wPW .MarketplacePanel_buttonContainer__vJQud{display:flex!important;align-items:center!important;gap:12px!important;flex-wrap:wrap!important}.MarketplacePanel_myListings__25wPW .MarketplacePanel_listingCount__3nVY_{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:4px!important;margin-right:auto!important}.MarketplacePanel_myListings__25wPW .magic-button-container{order:-1!important}.MarketplacePanel_myListings__25wPW .magic-search-container{order:0!important;margin-right:auto!important}.MarketplacePanel_myListings__25wPW .magic-table-row-hidden{display:none!important}';
                                const styleEl = document.getElementById('magic-sort-style') || document.createElement('style');
                                styleEl.id = 'magic-sort-style';
                                styleEl.textContent = css;
                                if (!document.getElementById('magic-sort-style')) document.head.appendChild(styleEl);
                            }
                            const searchContainer = document.createElement('div');
                            searchContainer.className = 'magic-search-container';
                            searchContainer.style.cssText = 'display:flex;align-items:center;gap:8px;margin-right:12px;';
                            const marketSearchInput = document.createElement('input');
                            marketSearchInput.className = 'Input_input__2-t98 magic-market-search';
                            marketSearchInput.type = 'search';
                            marketSearchInput.placeholder = '🔍 物品搜索';
                            marketSearchInput.value = marketSearchKeyword;
                            marketSearchInput.style.cssText = 'width:200px;padding:4px 8px;border:1px solid rgba(255,255,255,0.3);border-radius:4px;background:rgba(255,255,255,0.1);color:white;font-size:12px;outline:none;transition:all .2s ease;box-sizing:border-box;';
                            let marketSearchTimeout;
                            marketSearchInput.addEventListener('input', e => {
                                clearTimeout(marketSearchTimeout);
                                marketSearchTimeout = setTimeout(() => {
                                    marketSearchKeyword = e.target.value.trim();
                                    filterMarketItems();
                                }, 150);
                            });
                            marketSearchInput.addEventListener('keydown', e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    marketSearchInput.blur();
                                }
                            });
                            const clearMarketSearchBtn = document.createElement('button');
                            clearMarketSearchBtn.className = 'magic-clear-market-search';
                            clearMarketSearchBtn.title = '清空搜索';
                            clearMarketSearchBtn.textContent = '×';
                            clearMarketSearchBtn.style.cssText = 'background:rgba(255,99,71,.8);border:none;border-radius:4px;color:white;width:24px;height:24px;cursor:pointer;font-size:12px;transition:background .2s;display:' + (marketSearchKeyword ? 'flex' : 'none') + ';align-items:center;justify-content:center;';
                            clearMarketSearchBtn.addEventListener('click', () => {
                                marketSearchInput.value = '';
                                marketSearchKeyword = '';
                                clearMarketSearchBtn.style.display = 'none';
                                filterMarketItems();
                            });
                            searchContainer.appendChild(marketSearchInput);
                            searchContainer.appendChild(clearMarketSearchBtn);
                            const magicButtonContainer = document.createElement('div');
                            magicButtonContainer.className = 'magic-button-container';
                            magicButtonContainer.style.cssText = 'display:flex;gap:6px;margin-right:12px;';
                            const refreshButton = document.createElement('button');
                            refreshButton.className = 'Button_button__1Fe9z Button_small__3fqC7 magic-refresh-button';
                            refreshButton.textContent = '刷新';
                            refreshButton.style.cssText = 'background-color:#4CAF50;color:white;transition:all .2s ease;border:none;font-size:12px;padding:4px 8px;min-width:48px;';
                            refreshButton.addEventListener('click', e => {
                                e.preventDefault();
                                e.stopPropagation();
                                refreshMarketListings(refreshButton);
                            });
                            const sortButton = document.createElement('button');
                            sortButton.className = 'Button_button__1Fe9z Button_small__3fqC7 magic-sort-button';
                            const getSortText = () => currentSort === 'name-asc' ? '排序 (名称↑)' : currentSort === 'price-asc' ? '排序 (价格↑)' : '排序 (时间↑)';
                            sortButton.textContent = getSortText();
                            sortButton.style.cssText = 'background-color:#2196F3;color:white;transition:all .2s ease;border:none;font-size:12px;padding:4px 8px;min-width:80px;';
                            sortButton.addEventListener('click', e => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (currentSort === 'time-asc') currentSort = 'name-asc'; else if (currentSort === 'name-asc') currentSort = 'price-asc'; else currentSort = 'time-asc';
                                sortButton.textContent = getSortText();
                                sortMarketItems();
                            });
                            const pinButton = document.createElement('button');
                            pinButton.className = 'Button_button__1Fe9z Button_small__3fqC7 magic-pin-red-button';
                            const getPinText = () => pinUndercutOnTop ? '取消置顶红价' : '置顶红价';
                            pinButton.textContent = getPinText();
                            pinButton.style.cssText = 'background-color:#E91E63;color:white;transition:all .2s ease;border:none;font-size:12px;padding:4px 8px;min-width:72px;';
                            pinButton.addEventListener('click', e => {
                                e.preventDefault();
                                e.stopPropagation();
                                pinUndercutOnTop = !pinUndercutOnTop;
                                pinButton.textContent = getPinText();
                                sortMarketItems();
                            });
                            magicButtonContainer.appendChild(refreshButton);
                            magicButtonContainer.appendChild(pinButton);
                            magicButtonContainer.appendChild(sortButton);
                            buttonContainer.insertBefore(searchContainer, buttonContainer.firstChild);
                            buttonContainer.insertBefore(magicButtonContainer, searchContainer.nextSibling);
                            buttonsAdded = true;
                        } catch {
                        }
                    }

                    function refreshMarketListings(refreshButton) {
                        try {
                            const originalText = refreshButton.textContent;
                            const originalColor = refreshButton.style.backgroundColor;
                            refreshButton.textContent = '刷新中...';
                            refreshButton.style.backgroundColor = '#FF9800';
                            refreshButton.disabled = true;
                            setTimeout(() => {
                                try {
                                    initializeTimeTracking();
                                    currentSort = 'time-asc';
                                    marketSearchKeyword = '';
                                    const marketSearchInput = document.querySelector('.magic-market-search');
                                    if (marketSearchInput) marketSearchInput.value = '';
                                    const clearBtn = document.querySelector('.magic-clear-market-search');
                                    if (clearBtn) clearBtn.style.display = 'none';
                                    sortMarketItems();
                                    filterMarketItems();
                                    refreshButton.textContent = originalText;
                                    refreshButton.style.backgroundColor = originalColor;
                                    refreshButton.disabled = false;
                                } catch {
                                    refreshButton.textContent = originalText;
                                    refreshButton.style.backgroundColor = originalColor;
                                    refreshButton.disabled = false;
                                }
                            }, 500);
                        } catch {
                        }
                    }

                    function onMyListingsOpen() {
                        const marketPanel = document.querySelector('.MarketplacePanel_myListings__25wPW');
                        const table = document.querySelector('.MarketplacePanel_myListingsTable__3P1aT tbody');
                        if (!marketPanel || !table) return;
                        addMarketSortButton();
                        if (!initialized) {
                            initializeTimeTracking();
                            startMarketObserver();
                            startNotificationObserver();
                            initialized = true;
                        }
                        sortMarketItems();
                        filterMarketItems();
                    }

                    window.MagicSortIntegration = {onMyListingsOpen};
                }

                function formatUTCTime(date) {
                    return I18N("showListingInfoCreateTimeAt") + " " + date.toLocaleString('en-US', {
                        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
                    }).replace(/\//g, '-').replace(',', '');
                }

                function formatLifespan(date) {
                    const diffMs = new Date() - date;
                    const seconds = Math.floor(diffMs / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);
                    return I18N("showListingInfoCreateTimeLifespan", {
                        days: days, hours: hours % 24, minutes: minutes % 60, seconds: seconds % 60
                    });
                }

                function handleTableHead(trNode) {
                    const topOrderPriceNode = document.createElement("th");
                    topOrderPriceNode.classList.add("RangedWayIdleShowListingInfo");
                    const totalPriceNode = document.createElement("th");
                    totalPriceNode.classList.add("RangedWayIdleShowListingInfo");

                    topOrderPriceNode.textContent = I18N("showListingInfoTopOrderPriceText");
                    totalPriceNode.textContent = I18N("showListingInfoTotalPriceText");

                    trNode.insertBefore(topOrderPriceNode, trNode.children[4]);
                    trNode.insertBefore(totalPriceNode, trNode.children[5]);
                }

                function addDataToRowsAduduVersion(bodyNode) {
                    // Helper: parse number from display text (tolerant to commas and non-digits)
                    function parseDisplayNumber(text) {
                        if (!text) return NaN;
                        const numStr = String(text).replace(/[^0-9]/g, "");
                        return numStr ? Number(numStr) : NaN;
                    }

                    // Helper: extract minimal info from a row to match listing
                    function extractRowInfo(trNode) {
                        // itemHrid via SVG <use href="#..."> inside the item cell
                        let itemHrid = null;
                        const useNodes = trNode.querySelectorAll('use');
                        for (const use of useNodes) {
                            const href = use.href && use.href.baseVal ? use.href.baseVal : '';
                            if (href.includes('#')) {
                                // Prefer items sprite (usually items.svg), but fallback to first usable
                                const idPart = href.split('#')[1];
                                if (idPart && !idPart.toLowerCase().includes('coin')) {
                                    itemHrid = '/items/' + idPart;
                                    break;
                                }
                            }
                        }

                        // enhancement level (e.g., "+5")
                        let enhancementLevel = 0;
                        const enhNode = trNode.querySelector('[class*="enhancementLevel"], .Item_enhancementLevel__19g-e');
                        if (enhNode && enhNode.textContent) {
                            const m = enhNode.textContent.match(/\+\s*(\d+)/);
                            if (m) enhancementLevel = Number(m[1]);
                        }

                        // isSell detection from the second cell's class/text when available
                        let isSell = null;
                        const typeCell = trNode.children[1];
                        if (typeCell) {
                            const cls = Array.from(typeCell.classList).join(' ').toLowerCase();
                            const txt = (typeCell.textContent || '').toLowerCase();
                            if (cls.includes('sell') || txt.includes('sell') || txt.includes('出售') || txt.includes('卖')) {
                                isSell = true;
                            } else if (cls.includes('buy') || txt.includes('buy') || txt.includes('购买') || txt.includes('买')) {
                                isSell = false;
                            }
                        }

                        // price cell heuristic: prefer a cell/class containing "price"
                        let price = NaN;
                        let priceNode = trNode.querySelector('[class*="price"], .MarketplacePanel_price__hIzrY');
                        if (!priceNode) {
                            // fallback: often the price is in the 4th cell before our inserts
                            priceNode = trNode.children[3] || null;
                        }
                        if (priceNode) {
                            // Some price nodes have a nested span; try firstChild
                            const text = (priceNode.firstChild && priceNode.firstChild.textContent) ? priceNode.firstChild.textContent : priceNode.textContent;
                            price = parseDisplayNumber(text);
                        }

                        return {itemHrid, enhancementLevel, isSell, price};
                    }

                    // Build a list of listings for matching
                    const listings = Object.values(globalVariables.allListings);
                    const used = new Set();

                    // Iterate rows and attach dataset by matching content rather than index
                    for (const trNode of bodyNode.querySelectorAll('tr')) {
                        const info = extractRowInfo(trNode);
                        const existingId = trNode.dataset.id ? Number(trNode.dataset.id) : null;
                        if (existingId && globalVariables.allListings[existingId]) {
                            const listing = globalVariables.allListings[existingId];
                            const sameAsRow = (
                                (!info.itemHrid || listing.itemHrid === info.itemHrid) &&
                                Number(listing.enhancementLevel) === Number(info.enhancementLevel) &&
                                (info.isSell === null || Boolean(listing.isSell) === Boolean(info.isSell)) &&
                                (Number.isNaN(info.price) || Number(listing.price) === Number(info.price))
                            );
                            if (sameAsRow && !used.has(listing.id)) {
                                for (const key in listing) trNode.dataset[key] = listing[key];
                                trNode.dataset.originalIndex = trNode.dataset.originalIndex || '';
                                used.add(listing.id);
                                continue;
                            } else {
                                for (const key of Object.keys(trNode.dataset)) delete trNode.dataset[key];
                            }
                        }
                        let matched = null;

                        // Primary match: itemHrid + enhancementLevel + isSell + price
                        for (const l of listings) {
                            if (used.has(l.id)) continue;
                            if (info.itemHrid && l.itemHrid !== info.itemHrid) continue;
                            if (Number(l.enhancementLevel) !== Number(info.enhancementLevel)) continue;
                            if (info.isSell !== null && Boolean(l.isSell) !== Boolean(info.isSell)) continue;
                            if (!Number.isNaN(info.price) && Number(l.price) !== Number(info.price)) continue;
                            matched = l;
                            break;
                        }

                        // Fallback match: itemHrid + enhancementLevel + isSell (ignore price)
                        if (!matched && info.itemHrid) {
                            for (const l of listings) {
                                if (used.has(l.id)) continue;
                                if (l.itemHrid !== info.itemHrid) continue;
                                if (Number(l.enhancementLevel) !== Number(info.enhancementLevel)) continue;
                                if (info.isSell !== null && Boolean(l.isSell) !== Boolean(info.isSell)) continue;
                                matched = l;
                                break;
                            }
                        }

                        // Final fallback: any unused listing
                        if (!matched) {
                            for (const l of listings) {
                                if (!used.has(l.id)) {
                                    matched = l;
                                    break;
                                }
                            }
                        }

                        if (matched) {
                            for (const key in matched) trNode.dataset[key] = matched[key];
                            used.add(matched.id);
                        } else {
                            for (const key of Object.keys(trNode.dataset)) delete trNode.dataset[key];
                        }
                    }
                }

                function addDataToRows(bodyNode) {
                    let index = Object.keys(globalVariables.allListings).length - 1;
                    for (const listingId in globalVariables.allListings) {
                        const trNode = bodyNode.childNodes[index];
                        for (const key in globalVariables.allListings[listingId]) {
                            trNode.dataset[key] = globalVariables.allListings[listingId][key];
                        }
                        trNode.dataset.originalIndex = index;
                        index--;
                    }
                }

                function handleTableBody(tbodyNode) {
                    const localMarketAPIJson = getStorage("MWITools_marketAPI_json", true);
                    for (const trNode of tbodyNode.querySelectorAll("tr")) {
                        const dataSet = trNode.dataset;

                        // top order price
                        const topOrderPriceNode = document.createElement("td");
                        topOrderPriceNode.classList.add("RangedWayIdleShowListingInfo");
                        const topOrderPriceSpanNode = document.createElement("span");
                        topOrderPriceSpanNode.classList.add("RangedWayIdleShowListingInfo");
                        const itemHrid = dataSet.itemHrid;
                        const enhancementLevel = Number(dataSet.enhancementLevel);
                        const isSell = dataSet.isSell === 'true';
                        const price = Number(dataSet.price);
                        let localPrice = null;
                        try {
                            localPrice = localMarketAPIJson.marketData[itemHrid][enhancementLevel][isSell ? "a" : "b"];
                        } catch (e) {
                        }
                        if (localPrice === -1) localPrice = null;
                        topOrderPriceSpanNode.textContent = formatItemCount(localPrice, 1);
                        if (localPrice === null) {
                            topOrderPriceSpanNode.style.color = "#004FFF";
                        } else if (isSell) {
                            topOrderPriceSpanNode.style.color = localPrice < price ? "#FF0000" : "#00FF00";
                        } else {
                            topOrderPriceSpanNode.style.color = localPrice > price ? "#FF0000" : "#00FF00";
                        }
                        topOrderPriceNode.appendChild(topOrderPriceSpanNode);
                        trNode.insertBefore(topOrderPriceNode, trNode.children[4]);

                        // total price
                        const totalPriceNode = document.createElement("td");
                        totalPriceNode.classList.add("RangedWayIdleShowListingInfo");
                        const totalPriceSpanNode = document.createElement("span");
                        totalPriceSpanNode.classList.add("RangedWayIdleShowListingInfo");
                        const orderQuantity = Number(dataSet.orderQuantity);
                        const filledQuantity = Number(dataSet.filledQuantity);
                        const tax = isSell ? (itemHrid === "/items/bag_of_10_cowbells" ? 0.82 : 0.98) : 1.0;
                        const totalPrice = (orderQuantity - filledQuantity) * Math.floor(price * tax);
                        totalPriceSpanNode.textContent = formatItemCount(totalPrice, configs.listingClass.showListingPricePrecise.value);
                        totalPriceSpanNode.style.color = itemCountColorMap(totalPrice);
                        totalPriceNode.appendChild(totalPriceSpanNode);
                        trNode.insertBefore(totalPriceNode, trNode.children[5]);

                        // add create time
                        const createTimeNode = document.createElement("div");
                        createTimeNode.classList.add("RangedWayIdleShowListingInfo");
                        createTimeNode.style.fontSize = '0.75rem';
                        if (configs.listingClass.showListingCreateTimeByLifespan.value) {
                            createTimeNode.textContent = formatLifespan(new Date(dataSet.createdTimestamp));
                            allCreateTimeNodes.push(createTimeNode);
                        } else {
                            createTimeNode.textContent = formatUTCTime(new Date(dataSet.createdTimestamp));
                        }
                        createTimeNode.style.color = "gray";
                        trNode.firstChild.appendChild(createTimeNode);
                    }
                }

                function updateLifespan() {
                    if (!configs.listingClass.showListingCreateTimeByLifespan.value) {
                        allCreateTimeNodes.length = 0;
                        if (intervalId !== null) {
                            resetAll();
                            clearInterval(intervalId);
                            intervalId = null;
                        }
                        return;
                    }
                    allCreateTimeNodes.forEach(node => {
                        if (!node.isConnected) {
                            allCreateTimeNodes.splice(allCreateTimeNodes.indexOf(node), 1);
                            node.remove();
                            return;
                        }
                        const newText = formatLifespan(new Date(node.parentNode.parentNode.dataset.createdTimestamp));
                        if (newText !== node.textContent) {
                            node.textContent = newText;
                        }
                    });
                    if (intervalId === null) {
                        resetAll();
                        intervalId = setInterval(updateLifespan, 250);
                    }
                }

                function resetAll() {
                    const myListingTableNode = document.querySelector(".MarketplacePanel_myListingsTable__3P1aT");
                    if (!myListingTableNode) return;
                    const bodyNode = myListingTableNode.querySelector("tbody");
                    if (!bodyNode) return;
                    myListingTableNode.classList.remove("RangedWayIdleShowListingInfoSet");
                    document.querySelectorAll(".RangedWayIdleShowListingInfo").forEach(node => {
                        node.remove();
                    });
                }

                function ws(obj) {
                    if (obj.type === "market_listings_updated") {
                        resetAll();
                    } else if (obj.type === "market_item_order_books_updated") {
                        resetAll();
                    } else if (obj.type === "init_character_data") {
                        if (configs.listingClass.enableMagicSort.value) {
                            magicSortInit();
                        }
                    }
                }

                function ob(node) {
                    updateLifespan();
                    const myListingTableNode = node.querySelector(".MarketplacePanel_myListingsTable__3P1aT");
                    if (!myListingTableNode) return;
                    if (myListingTableNode.classList.contains("RangedWayIdleShowListingInfoSet")) return;
                    if (myListingTableNode.querySelectorAll("tbody tr").length !== Object.keys(globalVariables.allListings).length) {
                        return;
                    }
                    myListingTableNode.classList.add("RangedWayIdleShowListingInfoSet");

                    handleTableHead(myListingTableNode.querySelector("thead tr"));
                    if (configs.listingClass.mwiOrderHelperCompatible.value) {
                        addDataToRowsAduduVersion(myListingTableNode.querySelector("tbody"));
                    } else {
                        addDataToRows(myListingTableNode.querySelector("tbody"));
                    }
                    handleTableBody(myListingTableNode.querySelector("tbody"));
                    if (configs.listingClass.enableMagicSort.value && window.MagicSortIntegration) {
                        window.MagicSortIntegration.onMyListingsOpen();
                    }
                }

                return {ws: ws, ob: ob};
            }

            function notifyListingFilled() {
                function ws(obj) {
                    if (obj.type === "market_listings_updated") {
                        for (const listing of obj.endMarketListings) {
                            if (listing.status === "/market_listing_status/filled" && (listing.unclaimedCoinCount || listing.unclaimedItemCount)) {
                                globalVariables.notifyListingFilledAudio.volume = configs.listingClass.notifyListingFilledVolume.value;
                                globalVariables.notifyListingFilledAudio.play();
                                return;
                            }
                        }
                    }
                }

                return {ws: ws};
            }

            function orderBooksInfo() {
                const lastMarketItemOrderBooks = {};

                function formatLifespan(date) {
                    const diffMs = new Date() - date;
                    const seconds = Math.floor(diffMs / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);
                    return I18N("estimateListingCreateTimeLifespan", {
                        days: days, hours: hours % 24, minutes: minutes % 60
                    });
                }

                function formatUTCTime(date) {

                    return date.toLocaleString('en-US', {
                        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
                    }).replace(/\//g, '-').replace(',', '').replace('24:', '00:');
                }

                function getListingData() {
                    // author's data
                    const data = [
                        {"id": 106442952, "timestamp": 1763409373481},
                        {"id": 106791533, "timestamp": 1763541486867},
                        {"id": 107530218, "timestamp": 1763842767083},
                        {"id": 107640371, "timestamp": 1763890560819},
                        {"id": 107678558, "timestamp": 1763904036320}
                    ];
                    data.push(...globalVariables.imListingsCreateTimeData);
                    const localListings = getStorage("ranged_way_idle_market_listings") || [];
                    if (localListings) {
                        for (const characterId in localListings) {
                            for (const listingId in localListings[characterId]) {
                                const listing = localListings[characterId][listingId];
                                data.push({id: listing.id, timestamp: new Date(listing.createdTimestamp).getTime()});
                            }
                        }
                    } else {
                        for (const listing of Object.values(globalVariables.allListings)) {
                            data.push({id: listing.id, timestamp: new Date(listing.createdTimestamp).getTime()});
                        }
                    }
                    return [...data].sort((a, b) => a.id - b.id);
                }

                function estimateCreateTime(sortedData, id) {
                    const minId = sortedData[0].id;
                    const maxId = sortedData[sortedData.length - 1].id;
                    if (minId <= id && id <= maxId) {
                        return linearInterpolationEstimate();
                    } else {
                        return linearRegressionEstimate();
                    }

                    function linearInterpolationEstimate() {
                        let leftIndex = 0;
                        let rightIndex = sortedData.length - 1;
                        for (let i = 0; i < sortedData.length; i++) {
                            if (sortedData[i].id === id) {
                                return sortedData[i].timestamp;
                            }
                        }
                        for (let i = 0; i < sortedData.length - 1; i++) {
                            if (id >= sortedData[i].id && id <= sortedData[i + 1].id) {
                                leftIndex = i;
                                rightIndex = i + 1;
                                break;
                            }
                        }
                        const left = sortedData[leftIndex];
                        const right = sortedData[rightIndex];
                        const rightLeftDistance = right.id - left.id;
                        const leftDistance = id - left.id;
                        const k = leftDistance / rightLeftDistance;
                        return (1 - k) * left.timestamp + k * right.timestamp;
                    }

                    function linearRegressionEstimate() {
                        let sumX = 0, sumY = 0;
                        for (const point of sortedData) {
                            sumX += point.id;
                            sumY += point.timestamp;
                        }
                        const meanX = sumX / sortedData.length;
                        const meanY = sumY / sortedData.length;
                        let numerator = 0;
                        let denominator = 0;
                        for (const datum of sortedData) {
                            numerator += (datum.id - meanX) * (datum.timestamp - meanY);
                            denominator += (datum.id - meanX) * (datum.id - meanX);
                        }
                        const slope = numerator / denominator;
                        if (id > maxId) {
                            return slope * (id - maxId) + sortedData[sortedData.length - 1].timestamp;
                        } else {
                            return slope * (id - minId) + sortedData[0].timestamp;
                        }
                    }
                }

                function colorByAccuracy(sortedData, timestamp) {
                    const timeDelta = Math.min(...sortedData.map(item => Math.abs(item.timestamp - timestamp)));
                    return Math.max(1 - timeDelta / 43200_000, 0.0);
                }

                function colorByLifespan(sortedData, timestamp) {
                    const timeDelta = Math.max(new Date().getTime() - timestamp, 0);
                    const meanTime = 172800_000;
                    return (meanTime * meanTime) / (meanTime * meanTime + timeDelta * timeDelta);
                }

                function ws(obj) {
                    if (obj.type === "market_item_order_books_updated") {
                        lastMarketItemOrderBooks[obj.marketItemOrderBooks.itemHrid] = obj.marketItemOrderBooks;
                        document.querySelectorAll(".RangedWayIdleEstimateListingCreateTimeSet").forEach(node => node.classList.remove("RangedWayIdleEstimateListingCreateTimeSet"));
                    }
                }

                function ob(node) {
                    const targetItemNode = node.querySelector(".MarketplacePanel_currentItem__3ercC");
                    if (!targetItemNode) return;
                    if (node.querySelector(".RangedWayIdleEstimateListingCreateTimeSet") && node.querySelector(".RangedWayIdleEstimateListingCreateTime")) return;
                    document.querySelectorAll(".RangedWayIdleEstimateListingCreateTime").forEach(node => {
                        node.remove();
                    });
                    document.querySelectorAll(".RangedWayIdleEstimateListingCreateTimeSet").forEach(node => node.classList.remove("RangedWayIdleEstimateListingCreateTimeSet"));

                    const itemHrid = "/items/" + targetItemNode.querySelector("use").href.baseVal.split('#')[1];
                    const enhanceLevelNode = targetItemNode.querySelector(".Item_enhancementLevel__19g-e");
                    const enhanceLevel = enhanceLevelNode ? Number(enhanceLevelNode.textContent.substring(1)) : 0;
                    if (!lastMarketItemOrderBooks[itemHrid]) return;

                    const listingContainer = node.querySelector(".MarketplacePanel_orderBooksContainer__B4YE-");
                    const askContainer = listingContainer ? listingContainer.childNodes[0] : node.querySelectorAll(".MarketplacePanel_orderBookTableContainer__hUu-X")[0];
                    const bidContainer = listingContainer ? listingContainer.childNodes[1] : node.querySelectorAll(".MarketplacePanel_orderBookTableContainer__hUu-X")[1];
                    if (!askContainer || !bidContainer) return;
                    if (!askContainer || !bidContainer) return;
                    const askTable = askContainer.querySelector("table");
                    const bidTable = bidContainer.querySelector("table");
                    if (!askTable || !bidTable) return;
                    askContainer.classList.add("RangedWayIdleEstimateListingCreateTimeSet");
                    bidContainer.classList.add("RangedWayIdleEstimateListingCreateTimeSet");

                    // head
                    const askTimeHead = document.createElement("th");
                    askTimeHead.classList.add("RangedWayIdleEstimateListingCreateTime");
                    const bidTimeHead = document.createElement("th");
                    bidTimeHead.classList.add("RangedWayIdleEstimateListingCreateTime");
                    askTimeHead.textContent = I18N("estimateListingCreateTimeText");
                    bidTimeHead.textContent = I18N("estimateListingCreateTimeText");
                    askTable.querySelector("thead tr").insertBefore(askTimeHead, askTable.querySelector("thead tr").lastChild);
                    bidTable.querySelector("thead tr").insertBefore(bidTimeHead, bidTable.querySelector("thead tr").lastChild);
                    if (globalVariables.isIMRealNameOrderEnabled) {
                        const askRealNameHead = document.createElement("th");
                        const bidRealNameHead = document.createElement("th");
                        askRealNameHead.textContent = I18N("realNameOrderText");
                        bidRealNameHead.textContent = I18N("realNameOrderText");
                        askRealNameHead.classList.add("RangedWayIdleEstimateListingCreateTime");
                        bidRealNameHead.classList.add("RangedWayIdleEstimateListingCreateTime");
                        askTable.querySelector("thead tr").insertBefore(askRealNameHead, askTable.querySelector("thead tr").lastChild);
                        bidTable.querySelector("thead tr").insertBefore(bidRealNameHead, bidTable.querySelector("thead tr").lastChild);
                    }

                    // body
                    const sortedData = getListingData();
                    let askTopPrice, askTopTime, bidTopPrice, bidTopTime;
                    const allOrderBookId = new Set();
                    lastMarketItemOrderBooks[itemHrid].orderBooks[enhanceLevel].asks.forEach(listing => allOrderBookId.add(listing.listingId));
                    lastMarketItemOrderBooks[itemHrid].orderBooks[enhanceLevel].bids.forEach(listing => allOrderBookId.add(listing.listingId));

                    function process(isAskTable) {
                        let index = 0;
                        const listings = lastMarketItemOrderBooks[itemHrid].orderBooks[enhanceLevel][isAskTable ? "asks" : "bids"];
                        for (const row of (isAskTable ? askTable : bidTable).querySelectorAll("tbody tr")) {
                            if (index < listings.length) {
                                // 市场显示挂单
                                const listingId = listings[index].listingId;
                                const estimatedTime = estimateCreateTime(sortedData, listingId);
                                if (isAskTable) {
                                    if (askTopPrice === undefined) {
                                        askTopPrice = listings[index].price;
                                        askTopTime = estimatedTime;
                                    }
                                } else {
                                    if (bidTopPrice === undefined) {
                                        bidTopPrice = listings[index].price;
                                        bidTopTime = estimatedTime;
                                    }
                                }
                                const node = document.createElement("td");
                                node.classList.add("RangedWayIdleEstimateListingCreateTime");
                                if (configs.listingClass.estimateListingCreateTimeByLifespan.value) {
                                    node.textContent = formatLifespan(new Date(estimatedTime));
                                } else {
                                    node.textContent = formatUTCTime(new Date(estimatedTime));
                                }
                                if (configs.listingClass.estimateListingCreateTimeColorByAccuracy.value) {
                                    const k = colorByAccuracy(sortedData, estimatedTime);
                                    node.style.color = `rgb(${255 - k * 255}, ${k * 255}, 0)`;
                                } else if (configs.listingClass.estimateListingCreateTimeColorByLifespan.value) {
                                    const k = colorByLifespan(sortedData, estimatedTime);
                                    node.style.color = `rgb(${255 - k * 255}, ${k * 255}, 0)`;
                                }
                                row.insertBefore(node, row.lastChild);
                                if (globalVariables.isIMRealNameOrderEnabled) {
                                    const realNameNode = document.createElement("td");
                                    realNameNode.classList.add("RangedWayIdleEstimateListingCreateTime");
                                    // 本地记录，IM 依次查找
                                    const ownName = Object.keys(globalVariables.allListings).includes(listingId.toString()) ? globalVariables.initCharacterData.character.name : undefined;
                                    const imName = globalVariables.imListingsOwnerMap[listingId];
                                    realNameNode.textContent = ownName || imName || I18N("unknownRealName");
                                    // 是自己的已删除单，或者非自己的单子且非IM的单子，显示为灰色
                                    if (((getStorage("ranged_way_idle_deleted_listings") || []).map(id => Number(id))).includes(listingId) || (!ownName && !imName)) {
                                        realNameNode.style.color = "#7F7F7F";
                                    }
                                    if (ownName) {
                                        realNameNode.onclick = () => {
                                            globalVariables.imListingsToDeleteSet.add(listingId);
                                            globalVariables.imListingsToDeleteAllow = true;
                                            delete globalVariables.imListingsOwnerMap[listingId];
                                            const localSet = getStorage("ranged_way_idle_deleted_listings") || [];
                                            localSet.push(listingId.toString());
                                            setStorage("ranged_way_idle_deleted_listings", localSet);
                                        }
                                    }
                                    row.insertBefore(realNameNode, row.lastChild);
                                }
                            } else if (index === listings.length) {
                                // 省略号行
                                const node = document.createElement("td");
                                node.textContent = "· · ·";
                                node.classList.add("RangedWayIdleEstimateListingCreateTime");
                                row.insertBefore(node, row.lastChild);

                                if (globalVariables.isIMRealNameOrderEnabled) {
                                    const realNameNode = document.createElement("td");
                                    realNameNode.textContent = "· · ·";
                                    realNameNode.classList.add("RangedWayIdleEstimateListingCreateTime");
                                    row.insertBefore(realNameNode, row.lastChild);
                                }
                            } else if (index > listings.length) {
                                // 超过20名之后 自己的挂单
                                const node = document.createElement("td");
                                const listing = Object.values(globalVariables.allListings)
                                    .filter(listing => listing.itemHrid === itemHrid && listing.enhancementLevel === enhanceLevel && !(listing.isSell ^ isAskTable))
                                    .filter(listing => !allOrderBookId.has(listing.id))
                                    .sort((a, b) => a.price !== b.price ? (a.price - b.price) * (isAskTable ? 1 : -1) : a.id - b.id)
                                    [index - listings.length - 1];
                                const date = new Date(listing.createdTimestamp);
                                if (configs.listingClass.estimateListingCreateTimeByLifespan.value) {
                                    node.textContent = formatLifespan(date);
                                } else {
                                    node.textContent = formatUTCTime(date);
                                }
                                if (configs.listingClass.estimateListingCreateTimeColorByAccuracy.value) {
                                    const k = colorByAccuracy(sortedData, date.getTime());
                                    node.style.color = `rgb(${255 - k * 255}, ${k * 255}, 0)`;
                                } else if (configs.listingClass.estimateListingCreateTimeColorByLifespan.value) {
                                    const k = colorByLifespan(sortedData, date.getTime());
                                    node.style.color = `rgb(${255 - k * 255}, ${k * 255}, 0)`;
                                }
                                node.classList.add("RangedWayIdleEstimateListingCreateTime");
                                row.insertBefore(node, row.lastChild);

                                if (globalVariables.isIMRealNameOrderEnabled) {
                                    const realNameNode = document.createElement("td");
                                    realNameNode.textContent = globalVariables.initCharacterData.character.name;
                                    realNameNode.classList.add("RangedWayIdleEstimateListingCreateTime");
                                    if ((getStorage("ranged_way_idle_deleted_listings") || []).map(id => Number(id)).includes(listing.id)) realNameNode.style.color = "#7F7F7F";
                                    realNameNode.onclick = () => {
                                        globalVariables.imListingsToDeleteSet.add(listing.id);
                                        globalVariables.imListingsToDeleteAllow = true;
                                        delete globalVariables.imListingsOwnerMap[listing.id];
                                        const localSet = getStorage("ranged_way_idle_deleted_listings") || [];
                                        localSet.push(listing.id.toString());
                                        setStorage("ranged_way_idle_deleted_listings", localSet);
                                    }
                                    row.insertBefore(realNameNode, row.lastChild);
                                }
                            }
                            index++;
                        }
                    }

                    process(true);
                    process(false);
                }

                return {ws: ws, ob: ob};
            }

            return {
                hookListingInfo: hookListingInfo,
                showTotalListingFunds: showTotalListingFunds,
                showListingInfo: showListingInfo,
                notifyListingFilled: notifyListingFilled,
                orderBooksInfo: orderBooksInfo
            }
        }

        immemorialMarketClass() {
            class WebSukima {
                constructor(url) {
                    this.url = url;
                    this.socket = null;
                    this.reconnectTimer = null;
                    this.reconnectDelay = 5000;
                    this.isManualClose = false;

                    // 回调函数数组
                    this.messageCallbacks = [];
                    this.stateChangeCallbacks = [];

                    // 连接状态
                    this.states = {
                        CONNECTING: 'connecting',
                        OPEN: 'open',
                        CLOSING: 'closing',
                        CLOSED: 'closed',
                        RECONNECTING: 'reconnecting',
                        ERROR: 'error'
                    };

                    this.currentState = this.states.CLOSED;

                    this.connect();
                }

                connect() {
                    if (this.reconnectTimer) {
                        clearTimeout(this.reconnectTimer);
                        this.reconnectTimer = null;
                    }

                    // 关闭现有连接
                    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
                        this.socket.close();
                    }

                    this.setState(this.states.CONNECTING);

                    try {
                        this.socket = new WebSocket(this.url);

                        this.socket.onopen = () => {
                            this.setState(this.states.OPEN);
                            this.reconnectDelay = 5000;
                        };

                        this.socket.onmessage = (event) => {
                            try {
                                const data = JSON.parse(event.data);
                                this.messageCallbacks.forEach(callback => {
                                    try {
                                        callback(data);
                                    } catch (error) {
                                    }
                                });
                            } catch (error) {
                                console.error('Error parsing WebSukima message:', event.data);
                            }
                        };

                        this.socket.onclose = (event) => {
                            this.setState(this.states.CLOSED);
                            console.log(`WebSukima Close: ${event.code}. Reason: ${event.reason}`);

                            // 如果不是手动关闭，则尝试重连
                            if (!this.isManualClose) {
                                const delay = Math.random() * this.reconnectDelay;
                                console.log(`Retry in ${delay / 1000} seconds`);
                                this.reconnectTimer = setTimeout(() => {
                                    this.setState(this.states.RECONNECTING);
                                    this.connect();
                                }, delay);
                                this.reconnectDelay = Math.min(this.reconnectDelay * 2, 100000);
                            }
                        };

                        this.socket.onerror = (error) => {
                            this.setState(this.states.ERROR);
                            console.error('WebSukima Error:', error);
                        };

                    } catch (error) {
                        console.error('Error creating WebSukima:', error);
                        this.setState(this.states.ERROR);

                        if (!this.isManualClose) {
                            const delay = Math.random() * this.reconnectDelay;
                            this.reconnectTimer = setTimeout(() => {
                                this.setState(this.states.RECONNECTING);
                                this.connect();
                            }, delay);
                            this.reconnectDelay = Math.min(this.reconnectDelay * 2, 100000);
                        }
                    }
                }

                setState(newState) {
                    const oldState = this.currentState;
                    this.currentState = newState;

                    // 触发状态变化回调
                    this.stateChangeCallbacks.forEach(callback => {
                        try {
                            callback(newState, oldState);
                        } catch (error) {
                            console.error('Error while handling state change callback:', error);
                        }
                    });
                }

                sendMessage(obj) {
                    if (configs.immemorialMarketClass.debugPrintIMWSMessages.value) {
                        console.log('IMWS send', JSON.parse(JSON.stringify(obj)));
                    }
                    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                        try {
                            const message = JSON.stringify(obj);
                            this.socket.send(message);
                            return true;
                        } catch (error) {
                            console.error('Error while sending message:', error);
                            return false;
                        }
                    } else {
                        console.warn('WebSukima not connected.');
                        return false;
                    }
                }

                receiveMessage(callback) {
                    if (typeof callback === 'function') {
                        this.messageCallbacks.push(callback);
                    }
                }

                onStateChange(callback) {
                    if (typeof callback === 'function') {
                        this.stateChangeCallbacks.push(callback);
                    }
                }

                disconnect() {
                    this.isManualClose = true;

                    if (this.reconnectTimer) {
                        clearTimeout(this.reconnectTimer);
                        this.reconnectTimer = null;
                    }

                    if (this.socket) {
                        this.socket.close();
                    }
                }
            }

            class ModalTabs {
                // Modal Tabs
                constructor() {
                    this.modal = null;
                    this.tabs = [];
                    this.activeTabId = null;
                    this.isOpen = false;

                    // 默认样式
                    this.styles = `
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .modal-content {
        background-color: #20202F;
        width: 80%;
        max-width: 800px;
        height: 80vh;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
      .tabs-header {
        display: flex;
        background-color: #2A2A3F;
        padding: 0;
        border-bottom: 1px solid #3A3A4F;
        min-height: 50px;
        flex-wrap: wrap;
      }
      .tab-button {
        background: none;
        border: none;
        color: #CCCCCC;
        padding: 15px 20px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
        border-bottom: 3px solid transparent;
      }
      .tab-button:hover {
        background-color: #35354A;
        color: #FFFFFF;
      }
      .tab-button.active {
        color: #FFFFFF;
        border-bottom-color: #4A9EFF;
        background-color: #2F2F44;
      }
      .tab-button.hidden {
        display: none;
      }
      .tabs-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        color: #FFFFFF;
      }
      .tab-pane {
        display: none;
      }
      .tab-pane.active {
        display: block;
      }
      .close-area {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }
    `;

                    this.init();
                }

                init() {
                    this.injectStyles();
                    this.createModal();
                }

                injectStyles() {
                    if (document.getElementById('modal-tabs-styles')) return;

                    const styleSheet = document.createElement('style');
                    styleSheet.id = 'modal-tabs-styles';
                    styleSheet.textContent = this.styles;
                    document.head.appendChild(styleSheet);
                }

                createModal() {
                    // 创建模态框结构
                    this.modal = document.createElement('div');
                    this.modal.className = 'modal-backdrop';
                    this.modal.style.display = 'none';

                    const modalContent = document.createElement('div');
                    modalContent.className = 'modal-content';

                    const tabsHeader = document.createElement('div');
                    tabsHeader.className = 'tabs-header';

                    const tabsContent = document.createElement('div');
                    tabsContent.className = 'tabs-content';

                    // 点击空白区域关闭
                    const closeArea = document.createElement('div');
                    closeArea.className = 'close-area';
                    closeArea.addEventListener('click', () => this.close());

                    // 阻止点击内容区域时关闭
                    modalContent.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });

                    modalContent.appendChild(tabsHeader);
                    modalContent.appendChild(tabsContent);
                    this.modal.appendChild(modalContent);
                    this.modal.appendChild(closeArea);
                    document.body.appendChild(this.modal);
                }

                addTab(tabId, title, content, visible = true) {
                    const tab = {
                        id: tabId,
                        title: title,
                        content: content,
                        visible: visible,
                        element: null,
                        pane: null
                    };

                    this.tabs.push(tab);

                    if (this.tabs.length === 1) {
                        this.activeTabId = tabId;
                    }

                    this.renderTabs();
                    return this;
                }

                renderTabs() {
                    const tabsHeader = this.modal.querySelector('.tabs-header');
                    const tabsContent = this.modal.querySelector('.tabs-content');

                    // 清空现有内容
                    tabsHeader.innerHTML = '';
                    tabsContent.innerHTML = '';

                    // 创建选项卡按钮和内容面板
                    this.tabs.forEach(tab => {
                        if (!tab.visible) return;

                        // 创建选项卡按钮
                        const tabButton = document.createElement('button');
                        tabButton.className = `tab-button ${tab.id === this.activeTabId ? 'active' : ''}`;
                        tabButton.textContent = tab.title;
                        tabButton.addEventListener('click', () => this.switchTab(tab.id));

                        tab.element = tabButton;
                        tabsHeader.appendChild(tabButton);

                        // 创建内容面板
                        const tabPane = document.createElement('div');
                        tabPane.className = `tab-pane ${tab.id === this.activeTabId ? 'active' : ''}`;

                        if (typeof tab.content === 'string') {
                            tabPane.innerHTML = tab.content;
                        } else if (tab.content instanceof HTMLElement) {
                            tabPane.appendChild(tab.content);
                        } else if (typeof tab.content === 'function') {
                            const content = tab.content();
                            if (typeof content === 'string') {
                                tabPane.innerHTML = content;
                            } else if (content instanceof HTMLElement) {
                                tabPane.appendChild(content);
                            }
                        }

                        tab.pane = tabPane;
                        tabsContent.appendChild(tabPane);
                    });
                }

                switchTab(tabId) {
                    this.activeTabId = tabId;
                    this.renderTabs();
                }

                setTabVisibility(tabId, visible) {
                    const tab = this.tabs.find(t => t.id === tabId);
                    if (tab) {
                        tab.visible = visible;
                        this.renderTabs();
                    }
                    return this;
                }

                /*
                showTab(tabId) {
                    return this.setTabVisibility(tabId, true);
                }

                hideTab(tabId) {
                    return this.setTabVisibility(tabId, false);
                }
                */
                open() {
                    if (this.isOpen) return;

                    this.modal.style.display = 'flex';
                    this.isOpen = true;
                }

                close() {
                    if (!this.isOpen) return;

                    this.modal.style.display = 'none';
                    this.isOpen = false;

                    if (this.escHandler) {
                        document.removeEventListener('keydown', this.escHandler);
                        this.escHandler = null;
                    }
                }

                // 创建触发按钮
                createTriggerButton(text = '打开面板') {
                    const button = document.createElement('button');
                    button.textContent = text;
                    button.style.cssText = `
                      padding: 20px 40px;
                      background: linear-gradient(
                       30deg, 
                       #7f0000, #7f8000, #7f7f00, 
                       #3f7f00, #007f00, #007f80, 
                       #007f7f, #003f7f, #00007f, 
                       #3f007f, #7f007f, #7f003f
                      );
                      border: none;
                      color: #66CCFF;
                      font-size: 1.2rem;
                      font-weight: bold;
                    `;
                    button.addEventListener('click', () => this.open());
                    return button;
                }
            }

            async function sha256(message) {
                return Array.from(
                    new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message)))
                ).map(b => b.toString(16).padStart(2, '0')).join('');
            }

            let hasInit = false;
            const serverAddress = "wss://alphb.cn/websocket";
            // const serverAddress = "ws://localhost:9961/websocket";
            let modalTabs;
            let webSukima;
            const imConfigs = {
                "password": "",

                "accurate-create-time": false, // 准确挂单创建时间
                "real-name-order-owner": false, // 市场可见订单的所有者
                "upload-listings-id-time": false, //上传你的挂单创建时间、挂单ID
                "upload-listings-item-info": false, // 上传挂单时附带物品名、强化等级
                "realtime-market-api": false, // 实时市场API
                "upload-order-books": false, // 上传市场当前价格信息
                "get_listing_top_price": false, // 载入游戏时，查询自己的挂单物品左一右一价格
                "upload-token": false, // 响应验证码
                "upload-init-character-data": false, // 上传init_character_data以供分析（这包含你的账号敏感信息！不信任我请勿上传）

                "auto-login": true, // 自动登录
            };
            let hasLogin = false;
            let permissionLevel = 0;
            let toUploadedListings = {};
            const hasUploadedListingIds = new Set();
            let lastGetListingCreatedTimestampTime = 0;

            function loadConfig() {
                const localConfigObj = getStorage("ImmemorialMarketConfigs") || {};
                for (const key in imConfigs) {
                    imConfigs[key] = localConfigObj[key] || imConfigs[key];
                }
            }

            function saveConfig() {
                setStorage("ImmemorialMarketConfigs", imConfigs);
            }

            function addAllTabs() {
                // if (configs.otherClass.scriptLanguage.value === "zh-cn") {
                modalTabs
                    .addTab('tab1', '首页', () => {
                        const divNode = document.createElement("div");
                        divNode.innerHTML = `
                        <h2>当前服务器状态</h2>
                            <p style="color: #7F7F7F;" id="IM-server-status">初始化中</p>
                        <h2>使用说明</h2>
                            <p>
                                <p style="
                                    background: linear-gradient(90deg, 
                                        #ff0000, #ff8000, #ffff00, 
                                        #80ff00, #00ff00, #00ff80, 
                                        #00ffff, #0080ff, #0000ff, 
                                        #8000ff, #ff00ff, #ff0080, 
                                        #ff0000);
                                    background-size: 1400% 100%;
                                    -webkit-background-clip: text;
                                    background-clip: text;
                                    color: transparent;
                                    animation: rainbow 8s linear infinite;
                                    display: inline-block;
                                ">熙攘市场 ～ Immemorial Market</p>
                                <style>
                                @keyframes rainbow {
                                    0% { background-position: 0 50%; }
                                    100% { background-position: 100% 50%; }
                                }
                                </style>
                                为附属于Ranged Way Idle的功能。
                            </p>
                            <p>主要用途为与其他安装插件的玩家共享市场的数据信息。</p>
                            <p>您可以从其他人那里获取到共享的信息，也需要上传自己的信息来分享给他人。</p>
                            <p>仅打开本功能的初始开关时，您的所有数据都不会上传。各个功能需要在“功能设置”选项卡中手动开启。</p>
                            <p>为防止恶意上传信息或盗用身份，注册时您需要将您的角色名、角色ID上传，以提供身份验证。具体的注册流程请参见“账号设置”选项卡。</p>
                        <h2>从其他人那里共享的信息列表</h2>
                            <ul>
                            <li>准确挂单创建时间（权限等级>=1）</li>
                            <li>挂单所有者（权限等级>=1）</li>
                            <li>实时市场数据API（权限等级>=2）</li>
                            </ul>
                        <h2>需要上传的信息</h2>
                            <ul>
                            <li>角色名</li>
                            <li>角色ID</li>
                            <li>准确挂单创建时间：无需额外信息</li>
                            <li>挂单所有者：你的市场挂单创建时间、挂单ID、物品信息</li>
                            <li>实时市场数据API：当前市场的左右价格信息（权限等级>=2才能上传）</li>
                            </ul>
                        <h2>权限等级说明</h2>
                            <ul>
                            <li>0：未注册/未认证</li>
                            <li>1~4：已注册 (>=2不对外开放)</li>
                            <li>5：管理员（插件作者）</li>
                            </ul>
                        <h2>其他说明</h2>
                            <p>在市场界面，对于自己的挂单，点击挂单所有者处自己的名字，即可隐藏该条挂单，不让其他玩家看到。</p>
                            <p>本插件方便安装的玩家和谐商量挂单价格，请勿以此人身攻击其他玩家！</p>
                            <p>喜欢本插件，可以赞助一下作者❤ 在插件的设置页面里可以找到“赞助作者”的功能哦。</p>
                            <p>若需要删除所有自己上传的信息，退出使用，请联系AlphB。</p>
                          `;

                        function changeModalTabHint(state) {
                            switch (state) {
                                case"open": {
                                    divNode.querySelector("#IM-server-status").textContent = "已连接 " + (hasLogin ? "已登录 权限等级" + permissionLevel : "未登录");
                                    divNode.querySelector("#IM-server-status").style.color = "#00FF00";
                                    break;
                                }
                                case"closed": {
                                    divNode.querySelector("#IM-server-status").textContent = "连接失败！等待重连中。长时间连接失败则可能服务器正在维护";
                                    divNode.querySelector("#IM-server-status").style.color = "#FF0000";
                                    break;
                                }
                                case"reconnecting": {
                                    divNode.querySelector("#IM-server-status").textContent = "重连中";
                                    divNode.querySelector("#IM-server-status").style.color = "#7F7F7F";
                                    break;
                                }
                                case"closing": {
                                    divNode.querySelector("#IM-server-status").textContent = "正在关闭";
                                    divNode.querySelector("#IM-server-status").style.color = "#7F0000";
                                    break;
                                }
                                case"connecting": {
                                    divNode.querySelector("#IM-server-status").textContent = "连接中";
                                    divNode.querySelector("#IM-server-status").style.color = "#FFFF00";
                                    break;
                                }
                                case"error": {
                                    divNode.querySelector("#IM-server-status").textContent = "连接出错";
                                    divNode.querySelector("#IM-server-status").style.color = "#FF0000";
                                    break;
                                }
                            }
                        }

                        changeModalTabHint(webSukima.currentState);
                        webSukima.onStateChange((newState) => changeModalTabHint(newState));
                        webSukima.receiveMessage(() => changeModalTabHint("open"));
                        return divNode;
                    })
                    .addTab('tab2', '账号设置', () => {
                        const divNode = document.createElement("div");
                        divNode.innerHTML = `
                        <h2>账号注册说明</h2>
                            <p>为防止恶意上传信息或盗用身份，注册时您需要将您的角色名、角色ID上传，以提供身份验证。目前仅允许标准角色注册，不允许铁牛，以保证一人一号，不浪费服务器资源。</p>
                            <p>验证时需要提交的个人信息仅包含您的角色名、角色ID。实际上这些数据也是公开的，任何人都可以获取到。因此服务器不会获取您的任何身份隐私信息。</p>
                        <h2>注册流程</h2>
                            <ol>
                                <li>在下面输入您的初始注册密码，插件会将其Hash后，随您的角色名、角色ID一起提交到服务器。由于密码经过Hash后上传，服务器无法获取到明文密码。尽管如此，密码的明文仍然以明文存储在本地的localStorage中，请小心其他恶意插件窃取！<span style="color: gold;">该密码仅为本功能使用，不需要与您的游戏账号密码一致，可随意填写其他密码！</span></li>
                                <li>服务器会生成一个随机的长验证码返回给你，<span style="color: gold;">你需要将这个验证码完整复制，并在游戏内私聊给ABot（插件作者的铁牛角色）。</span></li>
                                <li>服务器会自动将您的角色名、角色ID、验证码比对。匹配后即为成功验证，<span style="color: gold;">之后请手动点击登录按钮</span>，并开始使用各功能，同时权限等级变为1。</li>
                                <li>如果发送私聊验证消息后，没有接收到验证成功的提醒，则角色可能暂时掉线，请稍等几分钟后重试。</li>
                                <li>若仍然无法验证成功，请联系AlphB重启服务器。</li>
                                <li>若忘记密码，请在游戏内私聊ABot：reset-password [你的临时密码]。例如 /w ABot reset-password <span id="temp-password"></span> 。使用临时密码登录后，建议修改密码！</li>
                            </ol>
                        <h2>登录流程</h2>
                            <p>在下面输入您的密码，即可直接登录。未验证的账号无法登录。</p>
                            <label>密码<input id="IM-password" style="width: 12rem"></label>
                            <button id="IM-register-button" style="background: #66CCFF; border: none; color: black;">注册</button>
                            <button id="IM-login-button" style="background: #66CCFF; border: none; color: black;">登录</button>
                            <button id="IM-change-password-button" style="background: #66CCFF; border: none; color: black;">修改密码（需要已经登录）</button>
                            <p>注册反馈：</p>
                            <p id="register-reply" style="color:#66CCFF;">----</p>
                            <p>登录反馈：</p>
                            <p id="login-reply" style="color:#66CCFF;">----</p>
                            <p>修改密码反馈：</p>
                            <p id="change-password-reply" style="color:#66CCFF;">----</p>
                            <button id="IM-copy-token-button" style="background: #66CCFF; border: none; color: black;">复制私聊验证指令</button>
                          `;
                        divNode.querySelector("#temp-password").textContent = Math.floor(10000000 + Math.random() * 90000000).toString();
                        let token = "";
                        divNode.querySelector("#IM-password").value = imConfigs.password;
                        divNode.querySelector("#IM-password").addEventListener("change", () => {
                            imConfigs.password = divNode.querySelector("#IM-password").value;
                            saveConfig();
                        });
                        divNode.querySelector("#IM-register-button").addEventListener("click", async () => {
                            if (divNode.querySelector("#IM-password").value === "") return;
                            webSukima.sendMessage({
                                "type": "register",
                                "characterId": globalVariables.initCharacterData.character.id,
                                "characterName": globalVariables.initCharacterData.character.name,
                                "password": await sha256(divNode.querySelector("#IM-password").value),
                            });
                        });
                        divNode.querySelector("#IM-login-button").addEventListener("click", async () => {
                            webSukima.sendMessage({
                                "type": "login",
                                "characterId": globalVariables.initCharacterData.character.id,
                                "characterName": globalVariables.initCharacterData.character.name,
                                "password": await sha256(divNode.querySelector("#IM-password").value),
                                "version": globalVariables.scriptVersion,
                            });
                        });
                        divNode.querySelector("#IM-change-password-button").addEventListener("click", async () => {
                            webSukima.sendMessage({
                                "type": "change_password",
                                "newPassword": await sha256(divNode.querySelector("#IM-password").value)
                            });
                        });
                        webSukima.receiveMessage((obj) => {
                            if (obj.type === "register_reply") {
                                if (obj.success) {
                                    token = obj.token;
                                    divNode.querySelector("#register-reply").textContent = "验证码：" + token;
                                } else {
                                    divNode.querySelector("#register-reply").textContent = "注册失败，原因：" + obj.reason;
                                }
                            }
                        });
                        webSukima.receiveMessage((obj) => {
                            if (obj.type === "login_reply") {
                                if (obj.success) {
                                    divNode.querySelector("#login-reply").textContent = "登录成功。权限等级：" + permissionLevel;
                                } else {
                                    divNode.querySelector("#login-reply").textContent = "登录失败，原因：" + obj.reason;
                                }
                            }
                        });
                        webSukima.receiveMessage((obj) => {
                            if (obj.type === "change_password_reply") {
                                if (obj.success) {
                                    divNode.querySelector("#change-password-reply").textContent = "修改成功。下次登录时请输入新密码。";
                                } else {
                                    divNode.querySelector("#change-password-reply").textContent = "修改失败，原因：" + obj.reason;
                                }
                            }
                        });
                        divNode.querySelector("#IM-copy-token-button").addEventListener("click", () => {
                            navigator.clipboard.writeText("/w ABot " + token);
                        });
                        return divNode;
                    })
                    .addTab('tab3', '功能设置', () => {
                        const divNode = document.createElement("div");
                        divNode.innerHTML = `
                        <h2>说明</h2>
                            <p>开启各个功能需要你上传相应的信息。例如想要知道某挂单的所有者，则你必须上传你有哪些挂单。</p>
                            <p>各个功能下列出了对应的需要上传信息。</p>
                        <h2>功能开关</h2>
                        
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; align-items: center;">
                                <input type="checkbox" id="IM-accurate-create-time">
                                <label for="IM-accurate-create-time" style="margin: 0">准确挂单创建时间</label>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; align-items: center">
                                <input type="checkbox" id="IM-real-name-order-owner">
                                <label for="IM-real-name-order-owner" style="margin: 0">市场可见订单的所有者</label>
                            </div>
                            
                            <div style="display: flex; align-items: center; margin-left: 2rem;">
                                <input type="checkbox" id="IM-upload-listings-id-time">
                                <label for="IM-upload-listings-id-time" style="margin: 0">上传你的挂单创建时间、挂单ID</label>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; align-items: center">
                                <input type="checkbox" id="IM-upload-listings-item-info">
                                <label for="IM-upload-listings-item-info" style="margin: 0">上传挂单时附带物品名、强化等级</label>
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; align-items: center">
                                <input type="checkbox" id="IM-realtime-market-api">
                                <label for="IM-realtime-market-api" style="margin: 0">实时市场API（需要权限等级>=2）</label>
                            </div>
                            
                            <div style="display: flex; align-items: center; margin-left: 2rem;">
                                <input type="checkbox" id="IM-upload-order-books">
                                <label for="IM-upload-order-books" style="margin: 0">上传市场当前价格信息（需要权限等级>=1）</label>
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; align-items: center">
                                <input type="checkbox" id="IM-get_listing_top_price">
                                <label for="IM-get_listing_top_price" style="margin: 0">载入游戏时，查询自己的挂单物品左一右一价格（需要权限等级>=1）</label>
                            </div>
                            
                            <div style="display: flex; align-items: center; margin-left: 2rem;">
                                <input type="checkbox" id="IM-upload-order-books">
                                <label for="IM-upload-order-books" style="margin: 0">上传市场当前价格信息（需要权限等级>=1）</label>
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; align-items: center">
                                <input type="checkbox" id="IM-upload-token">
                                <label for="IM-upload-token" style="margin: 0">响应验证码（需要权限等级=5）</label>
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; align-items: center">
                                <input type="checkbox" id="IM-upload-init-character-data">
                                <label for="IM-upload-init-character-data" style="margin: 0">上传init_character_data以供分析（这包含你的账号敏感信息！不信任我请勿上传）（需要权限等级>=4）</label>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; align-items: center">
                                <input type="checkbox" id="IM-auto-login">
                                <label for="IM-auto-login" style="margin: 0">自动登录</label>
                            </div>
                        </div>
                        `;
                        const functionRelyMap = {
                            "accurate-create-time": {
                                "permissionLevel": 1,
                                "uploadInfo": []
                            },
                            "real-name-order-owner": {
                                "permissionLevel": 1,
                                "uploadInfo": ["upload-listings-id-time",]
                            },
                            "realtime-market-api": {
                                "permissionLevel": 2,
                                "uploadInfo": ["upload-order-books"],
                            },
                            "get_listing_top_price": {
                                "permissionLevel": 1,
                                "uploadInfo": ["upload-order-books"],
                            },
                            "upload-token": {
                                "permissionLevel": 5,
                                "uploadInfo": [],
                            },
                            "listen-profiting-action": {
                                "permissionLevel": 4,
                                "uploadInfo": ["upload-init-character-data"],
                            },
                            "auto-login": {
                                "permissionLevel": 1,
                                "uploadInfo": []
                            }
                        };
                        const uploadInfoPermissionLevelMap = {
                            "upload-listings-id-time": 1,
                            "upload-order-books": 1,
                            "upload-listings-item-info": 1,
                            "upload-init-character-data": 4,
                        };
                        const functionNodes = [];
                        const uploadInfoNodes = [];

                        function changeInputBox(event) {
                            if (!event) {
                                if (!hasLogin) {
                                    for (const node of uploadInfoNodes) {
                                        node.disabled = true;
                                    }
                                    for (const node of functionNodes) {
                                        node.disabled = true;
                                    }
                                    return;
                                }
                                for (const node of uploadInfoNodes) {
                                    const id = node.id.split("IM-")[1];
                                    if (permissionLevel < uploadInfoPermissionLevelMap[id]) {
                                        node.checked = false;
                                        imConfigs[id] = false;
                                    }
                                }
                                for (const node of functionNodes) {
                                    const id = node.id.split("IM-")[1];
                                    if (permissionLevel < functionRelyMap[id].permissionLevel) {
                                        node.checked = false;
                                        node.disabled = true;
                                        imConfigs[id] = false;
                                        continue;
                                    }
                                    for (const uploadInfoId of functionRelyMap[id].uploadInfo) {
                                        if (!imConfigs[uploadInfoId]) {
                                            node.checked = false;
                                            node.disabled = true;
                                            imConfigs[id] = false;
                                            break;
                                        }
                                    }
                                }
                                return;
                            }
                            const currentElement = event.target;
                            const currentId = currentElement.id.split("IM-")[1];
                            const currentChecked = currentElement.checked;
                            for (const node of uploadInfoNodes) {
                                const id = node.id.split("IM-")[1];
                                if (id === currentId) {
                                    node.checked = currentChecked;
                                    imConfigs[id] = currentChecked;
                                }
                            }
                            for (const node of functionNodes) {
                                const id = node.id.split("IM-")[1];
                                let shouldEnable = true;
                                for (const uploadInfoId of functionRelyMap[id].uploadInfo) {
                                    if (!imConfigs[uploadInfoId]) {
                                        node.checked = false;
                                        node.disabled = true;
                                        shouldEnable = false;
                                        break;
                                    }
                                }
                                if (shouldEnable) {
                                    node.disabled = false;
                                }
                                imConfigs[id] = node.checked;
                            }
                            saveConfig();
                        }

                        for (const node of divNode.querySelectorAll("input[type='checkbox']")) {
                            node.checked = imConfigs[node.id.split("IM-")[1]];
                            node.addEventListener("change", (e) => changeInputBox(e));
                            if (Object.keys(functionRelyMap).includes(node.id.split("IM-")[1])) {
                                functionNodes.push(node);
                            } else if (Object.keys(uploadInfoPermissionLevelMap).includes(node.id.split("IM-")[1])) {
                                uploadInfoNodes.push(node);
                            }
                        }

                        changeInputBox();
                        webSukima.receiveMessage((obj) => {
                            if (obj.type === "login_reply") {
                                changeInputBox();
                            }
                        });

                        return divNode;
                    })
                    .addTab('tab4', '数据库直连', function () {
                        const divNode = document.createElement("div");
                        divNode.innerHTML = `
                        <div style="display: flex; width: 100%; height: 120px;">
                            <textarea id="IM-SQL-input" style="flex: 1; resize: vertical; min-height: 60px;" placeholder="SQL"></textarea>
                            <button id="IM-SQL-input-button" style="margin-left: 8px;">
                            发送
                            </button>
                        </div>
                        <div id="IM-SQL-output" style="margin-top: 8px; overflow-y: auto;">
                        </div>
                        `;
                        divNode.querySelector("#IM-SQL-input-button").addEventListener("click", async () => {
                            const sql = divNode.querySelector("#IM-SQL-input").value;
                            if (sql === "") return;
                            webSukima.sendMessage({
                                "type": "execute_sql",
                                "sql": sql
                            });
                        });

                        function addMessage(content) {
                            const chatOutput = divNode.querySelector("#IM-SQL-output");
                            const messageDiv = document.createElement('div');
                            messageDiv.style.border = '1px solid #66CCFF';
                            messageDiv.style.whiteSpace = 'pre-wrap';
                            messageDiv.textContent = content;
                            messageDiv.style.color = 'white';
                            messageDiv.onclick = (event) => {
                                if (event.shiftKey) {
                                    messageDiv.remove();
                                }
                            }
                            chatOutput.appendChild(messageDiv);
                        }

                        webSukima.receiveMessage((obj) => {
                            if (obj.type === "execute_sql_reply") {
                                if (obj.success) {
                                    addMessage("执行成功！\n" + JSON.stringify(obj.result, null, 2));
                                } else {
                                    addMessage("执行失败！\n" + obj.reason);
                                }
                            }
                        });
                        return divNode;
                    });
                // }
                modalTabs.setTabVisibility('tab4', false);
            }

            function showModalTabButton(node) {
                const configMenuRootNode = node.querySelector(".RangedWayIdleConfigMenuRoot");
                if (!configMenuRootNode) return;
                if (configMenuRootNode.parentNode.querySelector(".RangedWayIdleIMButton")) return;
                const divNode = document.createElement("div");
                const buttonNode = divNode.appendChild(modalTabs.createTriggerButton(I18N("IMOpenConfigPanel")));
                buttonNode.classList.add("RangedWayIdleIMButton");
                configMenuRootNode.insertAdjacentElement("afterend", divNode);
            }

            function enableImmemorialMarket() {
                function initIM() {
                    loadConfig();
                    if (hasInit) return;
                    modalTabs = new ModalTabs();
                    webSukima = new WebSukima(serverAddress);
                    unsafeWindow._rwiimws = webSukima;
                    webSukima.receiveMessage(async (obj) => {
                        if (configs.immemorialMarketClass.debugPrintIMWSMessages.value) {
                            console.log("IMWS get", JSON.parse(JSON.stringify(obj)));
                        }
                        if (obj.type === "register_pass") {
                            alert("验证成功！");
                        } else if (obj.type === "login_reply") {
                            if (!obj.success) return;

                            hasLogin = true;
                            permissionLevel = obj.permissionLevel;
                            if (permissionLevel === 5) {
                                modalTabs.setTabVisibility('tab4', true);
                            }
                            const localDeletedListings = new Set((getStorage("ranged_way_idle_deleted_listings") || []).map(id => id.toString()).filter(str => /^[1-9]\d*$/.test(str.trim())));
                            const currentAllListings = new Set(Object.keys(globalVariables.allListings));
                            const allHistoryListings = new Set(Object.keys((getStorage("ranged_way_idle_market_listings") || {})[globalVariables.initCharacterData.character.id]));
                            const currentShowedListing = currentAllListings.difference(localDeletedListings);
                            // 30天内所有单 - (现存单子 - 记录的已删除单) = 30天内所有单 - 现存公开单 = 所有已结束单 | 现存已隐藏单    告知服务器删除
                            allHistoryListings.difference(currentShowedListing).forEach(id => globalVariables.imListingsToDeleteSet.add(id));
                            // 记录的已删除单 & 30天内所有单 -> 记录的已删除单
                            // 即移除超过30的单子
                            // 不使用 记录的已删除单 & 现存单子 ，为避免本次告知服务器删除失败，导致单子无限滞留在服务器
                            setStorage("ranged_way_idle_deleted_listings", [...localDeletedListings].filter(id => allHistoryListings.has(id)));
                            // 上传现存公开单
                            for (const id of currentShowedListing) {
                                const listing = globalVariables.allListings[id];
                                if (imConfigs["upload-listings-item-info"]) {
                                    toUploadedListings[listing.id] = {
                                        listingId: listing.id,
                                        itemHrid: listing.itemHrid,
                                        enhancementLevel: listing.enhancementLevel,
                                        createdTimestamp: new Date(listing.createdTimestamp).getTime(),
                                    };
                                } else {
                                    toUploadedListings[listing.id] = {
                                        listingId: listing.id,
                                        createdTimestamp: new Date(listing.createdTimestamp).getTime(),
                                    };
                                }
                            }
                            if (imConfigs["upload-listings-id-time"]) {
                                if (toUploadedListings) {
                                    webSukima.sendMessage({
                                        "type": "new_multi_listing",
                                        "listings": toUploadedListings
                                    });
                                }
                            }
                            if (imConfigs["realtime-market-api"]) {
                                const password = await sha256(imConfigs.password);
                                globalVariables.marketAPIUrl = `https://alphb.cn/marketplace?characterId=${globalVariables.initCharacterData.character.id}&password=${password}`;
                            }
                            if (imConfigs["upload-token"]) {
                                const chatHistory = globalVariables.initCharacterData.whisperChatHistory;
                                chatHistory.splice(0, Math.max(chatHistory.length - 10, 0));
                                for (const messageObj of chatHistory) {
                                    if (messageObj.gm === "ironcow") continue;
                                    if (!messageObj.m.startsWith("reset-password ")) {
                                        webSukima.sendMessage({
                                            "type": "register_confirm",
                                            "characterId": messageObj.cId,
                                            "characterName": messageObj.sName,
                                            "messageContent": messageObj.m,
                                        });
                                    }
                                }
                            }
                            if (imConfigs["upload-init-character-data"]) {
                                webSukima.sendMessage({
                                    "type": "upload_character_data",
                                    "characterData": JSON.stringify(globalVariables.initCharacterData),
                                });
                            }
                            if (imConfigs["get_listing_top_price"]) {
                                if (hasLogin) {
                                    setTimeout(async () => {
                                        const hashedPassword = await sha256(imConfigs.password);
                                        for (const listingId in globalVariables.allListings) {
                                            const searchParams = new URLSearchParams();
                                            const itemHrid = globalVariables.allListings[listingId].itemHrid;
                                            const enhancementLevel = globalVariables.allListings[listingId].enhancementLevel;
                                            const mode = globalVariables.allListings[listingId].isSell ? 'a' : 'b';
                                            searchParams.append('characterId', globalVariables.initCharacterData.character.id);
                                            searchParams.append('password', hashedPassword);
                                            searchParams.append('itemName', itemHrid.split('/')[2]);
                                            searchParams.append('enhancementLevel', enhancementLevel);
                                            searchParams.append('mode', mode);
                                            searchParams.append('requestMooket', 'false');
                                            const url = `https://alphb.cn/price?${searchParams.toString()}`;

                                            let shouldContinue = true;
                                            const resp = await fetch(url);
                                            const obj = await resp.json();
                                            if (!obj.isFromImmemorialMarket) {
                                                shouldContinue = false;
                                                return;
                                            }
                                            if (obj.timestamp > (getStorage("MWITools_marketAPI_timestamp") || 0)) {
                                                const localMarketData = getStorage("MWITools_marketAPI_json", true);
                                                localMarketData.marketData[itemHrid][enhancementLevel][mode] = obj.price;
                                                setStorage("MWITools_marketAPI_json", localMarketData, true);
                                            }
                                            if (!shouldContinue) return;
                                        }
                                    }, 0);
                                }
                            }
                        } else if (obj.type === "Hello") {
                            if ((imConfigs["auto-login"] && globalVariables.initCharacterData.character.gameMode === "standard") || globalVariables.initCharacterData.character.name === "ABot") {
                                webSukima.sendMessage({
                                    "type": "login",
                                    "characterId": globalVariables.initCharacterData.character.id,
                                    "characterName": globalVariables.initCharacterData.character.name,
                                    "password": await sha256(imConfigs.password),
                                    "version": globalVariables.scriptVersion,
                                });
                            }
                        }
                        if (!hasLogin) return;
                        if (obj.type === "query_listings_owner_reply") {
                            const result = obj.result;
                            globalVariables.isIMRealNameOrderEnabled = true;
                            for (const listingId in result) {
                                globalVariables.imListingsOwnerMap[listingId] = result[listingId];
                            }
                            document.querySelectorAll(".RangedWayIdleEstimateListingCreateTimeSet").forEach(node => node.classList.remove("RangedWayIdleEstimateListingCreateTimeSet"));
                        } else if (obj.type === "new_multi_listing_reply") {
                            if (obj.success) {
                                for (const listingId of obj.allListingId) {
                                    delete toUploadedListings[listingId];
                                    hasUploadedListingIds.add(listingId.toString());
                                }
                            }
                        } else if (obj.type === "get_listing_create_time_reply") {
                            globalVariables.imListingsCreateTimeData = obj.result;
                        } else if (obj.type === "delete_listing_reply") {
                            if (obj.success) {
                                obj.allListingId.forEach(listingId => {
                                    globalVariables.imListingsToDeleteSet.delete(listingId);
                                    globalVariables.imListingsToDeleteSet.delete(listingId.toString());
                                });
                                globalVariables.imListingsToDeleteAllow = true;
                                setStorage("ranged_way_idle_deleted_listings", Array.from(new Set(getStorage("ranged_way_idle_deleted_listings") || []).union(new Set(obj.allListingId.map(id => id.toString())))));
                                document.querySelectorAll(".RangedWayIdleEstimateListingCreateTimeSet").forEach(node => node.classList.remove("RangedWayIdleEstimateListingCreateTimeSet"));
                            }
                        }
                    });
                    addAllTabs();
                    webSukima.onStateChange(async (newState) => {
                        console.log("IMWS state change", newState);
                        if (newState !== "open") {
                            hasLogin = false;
                            permissionLevel = -2;
                        }
                    });
                    hasInit = true;
                }

                function ob(node) {
                    if (hasInit) {
                        showModalTabButton(node);
                        if (globalVariables.imListingsToDeleteSet.size > 0 && globalVariables.imListingsToDeleteAllow) {
                            webSukima.sendMessage({
                                "type": "delete_listing",
                                "allListingId": Array.from(globalVariables.imListingsToDeleteSet),
                            });
                            globalVariables.imListingsToDeleteAllow = false;
                        }
                    }
                }

                function ws(obj) {
                    if (obj.type === "init_character_data") {
                        initIM();
                    } else if (obj.type === "chat_message_received") {
                        if (!hasLogin) return;
                        const messageObj = obj.message;
                        if (imConfigs["upload-token"]) {
                            if (messageObj.chan !== "/chat_channel_types/whisper") return;
                            if (messageObj.gm === "ironcow") return;
                            if (messageObj.m.startsWith("reset-password ")) {
                                webSukima.sendMessage({
                                    "type": "reset_password",
                                    "characterId": messageObj.cId,
                                    "newPassword": messageObj.m.split(" ")[1],
                                });
                            } else {
                                webSukima.sendMessage({
                                    "type": "register_confirm",
                                    "characterId": messageObj.cId,
                                    "characterName": messageObj.sName,
                                    "messageContent": messageObj.m,
                                });
                            }
                        }
                    } else if (obj.type === "market_item_order_books_updated") {
                        if (!hasLogin) return;
                        if (imConfigs["real-name-order-owner"]) {
                            const query = [];
                            for (const enhancementLevel in obj.marketItemOrderBooks.orderBooks) {
                                obj.marketItemOrderBooks.orderBooks[enhancementLevel]?.asks?.forEach((listing) => query.push(listing.listingId));
                                obj.marketItemOrderBooks.orderBooks[enhancementLevel]?.bids?.forEach((listing) => query.push(listing.listingId));
                            }
                            webSukima.sendMessage({
                                "type": "query_listings_owner",
                                "query": query,
                            });
                        }
                        if (imConfigs["accurate-create-time"]) {
                            if (new Date().getTime() - lastGetListingCreatedTimestampTime > 300_000) {
                                webSukima.sendMessage({"type": "get_listing_create_time"});
                                lastGetListingCreatedTimestampTime = new Date().getTime();
                            }
                        }
                        if (imConfigs["upload-order-books"]) {
                            webSukima.sendMessage({
                                "type": "update_from_market_books",
                                "orderBooks": obj.marketItemOrderBooks.orderBooks,
                                "itemHrid": obj.marketItemOrderBooks.itemHrid,
                                "timestamp": new Date().getTime(),
                            });
                        }
                    } else if (obj.type === "market_listings_updated") {
                        for (const id of (
                            new Set(Object.keys(globalVariables.allListings))
                                .difference(new Set((getStorage("ranged_way_idle_deleted_listings") || []).map(id => id.toString())))
                                .difference(globalVariables.imListingsToDeleteSet)
                                .difference(hasUploadedListingIds)
                        )) {
                            const listing = globalVariables.allListings[id];
                            if (imConfigs["upload-listings-item-info"]) {
                                toUploadedListings[listing.id] = {
                                    listingId: listing.id,
                                    itemHrid: listing.itemHrid,
                                    enhancementLevel: listing.enhancementLevel,
                                    createdTimestamp: new Date(listing.createdTimestamp).getTime(),
                                };
                            } else {
                                toUploadedListings[listing.id] = {
                                    listingId: listing.id,
                                    createdTimestamp: new Date(listing.createdTimestamp).getTime(),
                                };
                            }
                        }
                        if (hasLogin) {
                            if (toUploadedListings && imConfigs["upload-listings-id-time"]) {
                                webSukima.sendMessage({
                                    "type": "new_multi_listing",
                                    "listings": toUploadedListings
                                });
                            }
                        }
                    }
                }


                return {ob: ob, ws: ws};
            }

            return {enableImmemorialMarket: enableImmemorialMarket}
        }

        otherClass() {
            function showSponsor() {
                const imageURL1 = "https://tupian.li/images/2025/10/26/68fdddfbe6b75.png";
                const imageURL2 = "https://tupian.li/images/2025/11/24/692340e22b0ad.jpeg";
                const sponsorList = ((obj) => Object.keys(obj)
                    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                    .reduce((sorted, key) => {
                        sorted[key] = obj[key];
                        return sorted;
                    }, {}))({
                    "SuXingX": "50.00 CNY", // 251028
                    "BraveNNiu": "100.00 CNY", // 251029
                    "JokyeeZ": "66.66 CNY", // 251102
                    "baozhi": "1.00 CNY", // 251110
                    "RyuuSan": "9.00 CNY", // 251111
                    "Megumii": "11.11 CNY", // 251111 251216
                    "Yukira": "1.00 CNY", // 251111
                    "goingdown": "50.00 CNY", // 251120
                    "Railgunhp": "50.00 CNY", // 251123
                    "Derwindz": "10.00 CNY", // 251124
                    "ID9527": "10.00 CNY", // 251124
                    "BubbleEcho": "100.00 CNY", // 251124 z
                    "<未知玩家1>": "166.00 CNY", // 251125
                    "Foxzhuquyubai": "0.01 CNY", // 251125 z
                    "hyhfish": "10.00 CNY", // 251128
                    "400BadRequest": "123.45 CNY", // 251130 z
                    "binniuniu": "50.00 CNY", // 251204 z
                    "dying084": "10.24 CNY", // 251205
                    "xxll": "10.00 CNY", // 251210
                    "Joey": "200.00 CNY", // 251214
                });

                function showImage() {
                    const img1 = document.createElement('img');
                    img1.src = imageURL1;
                    img1.style.position = 'fixed';
                    img1.style.top = '50%';
                    img1.style.left = '25%';
                    img1.style.transform = 'translate(-50%, -50%)';
                    img1.style.maxWidth = '60%';
                    img1.style.maxHeight = '60%';
                    img1.style.zIndex = '1000';

                    const img2 = document.createElement('img');
                    img2.src = imageURL2;
                    img2.style.position = 'fixed';
                    img2.style.top = '50%';
                    img2.style.left = '75%';
                    img2.style.transform = 'translate(-50%, -50%)';
                    img2.style.maxWidth = '60%';
                    img2.style.maxHeight = '60%';
                    img2.style.zIndex = '1000';

                    const overlay = document.createElement('div');
                    overlay.style.position = 'fixed';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    overlay.style.zIndex = '999';
                    img1.addEventListener('click', () => {
                        img1.remove();
                        img2.remove();
                        overlay.remove();
                    });
                    img2.addEventListener('click', () => {
                        img1.remove();
                        img2.remove();
                        overlay.remove();
                    });
                    overlay.addEventListener('click', () => {
                        img1.remove();
                        img2.remove();
                        overlay.remove();
                    });
                    document.body.appendChild(overlay);
                    document.body.appendChild(img1);
                    document.body.appendChild(img2);

                    alert(I18N("sponsorAlertText"));
                }

                function makeSponsorTable() {
                    const tableNode = document.createElement("table");
                    tableNode.style.borderSpacing = "1rem";

                    const tHeadNode = document.createElement("thead");
                    const tHeadTrNode = document.createElement("tr");
                    const tHeadThNode1 = document.createElement("th");
                    tHeadThNode1.textContent = I18N("characterID");
                    tHeadTrNode.appendChild(tHeadThNode1);
                    const tHeadThNode2 = document.createElement("th");
                    tHeadThNode2.textContent = I18N("sponsorValue");
                    tHeadTrNode.appendChild(tHeadThNode2);
                    tHeadNode.appendChild(tHeadTrNode);
                    tableNode.appendChild(tHeadNode);

                    const tBodyNode = document.createElement("tbody");
                    for (const characterID in sponsorList) {
                        const tBodyTrNode = document.createElement("tr");
                        const tBodyTdNode1 = document.createElement("td");
                        tBodyTdNode1.textContent = characterID;
                        tBodyTrNode.appendChild(tBodyTdNode1);
                        const tBodyTdNode2 = document.createElement("td");
                        tBodyTdNode2.textContent = sponsorList[characterID];
                        tBodyTrNode.appendChild(tBodyTdNode2);
                        tBodyNode.appendChild(tBodyTrNode);
                    }
                    tableNode.appendChild(tBodyNode);

                    return tableNode;
                }

                function ob(node) {
                    const configMenuRootNode = node.querySelector(".RangedWayIdleConfigMenuRoot");
                    if (!configMenuRootNode) return;
                    if (configMenuRootNode.parentNode.querySelector(".RangedWayIdleSponsorButton")) return;
                    const divNode = document.createElement("div");
                    divNode.style.display = "flex";
                    divNode.style.flexDirection = "column";

                    const textTipNode = document.createElement("div");
                    textTipNode.textContent = I18N("sponsorTipText");
                    textTipNode.style.color = "#66CCFF";
                    textTipNode.style.display = "flex";
                    textTipNode.style.alignItems = "center";

                    const sponsorButton = document.createElement("button");
                    sponsorButton.classList.add("RangedWayIdleSponsorButton");
                    sponsorButton.textContent = I18N("sponsorText");
                    sponsorButton.style.backgroundColor = "#66CCFF"
                    sponsorButton.addEventListener("click", showImage);

                    divNode.appendChild(textTipNode);
                    divNode.appendChild(sponsorButton);
                    divNode.appendChild(makeSponsorTable());
                    configMenuRootNode.insertAdjacentElement("afterend", divNode);
                }

                return {ob: ob};
            }

            function mournForMagicWayIdle() {
                function init() {
                    console.log("为法师助手默哀");
                }

                return {init: init};
            }

            function showConfigMenu() {
                function loadLocalConfig() {
                    let localConfigObject = getStorage("ranged_way_idle_configs") || {};
                    if (localConfigObject.version !== 'v6') localConfigObject = {};
                    for (const configClass in configs) {
                        if (!localConfigObject[configClass]) localConfigObject[configClass] = {};
                        for (const configName in configs[configClass]) {
                            if (localConfigObject[configClass][configName] !== undefined) {
                                configs[configClass][configName].value = localConfigObject[configClass][configName];
                            }
                        }
                    }
                    saveLocalConfig();
                }

                function saveLocalConfig() {
                    let localConfigObject = getStorage("ranged_way_idle_configs") || {};
                    for (const configClass in configs) {
                        if (!localConfigObject[configClass]) localConfigObject[configClass] = {};
                        for (const configName in configs[configClass]) {
                            localConfigObject[configClass][configName] = configs[configClass][configName].value;
                        }
                    }
                    localConfigObject.version = 'v6';
                    setStorage("ranged_way_idle_configs", localConfigObject);
                }

                function setConfig(configClass, configName, value) {
                    // forbid changing hidden config
                    if (configs[configClass][configName].isHidden) return;
                    configs[configClass][configName].value = value;
                    saveLocalConfig();
                }

                function ob(node) {
                    const settingPanelNode = node.querySelector(".SettingsPanel_profileTab__214Bj");
                    if (!settingPanelNode) return;
                    if (settingPanelNode.querySelector(".RangedWayIdleConfigMenuRoot")) return;
                    const configMenuRootNode = document.createElement("div");
                    configMenuRootNode.classList.add("RangedWayIdleConfigMenuRoot");
                    configMenuRootNode.style.display = "flex";
                    configMenuRootNode.style.flexDirection = "column";

                    // head
                    const headNode = document.createElement("div");
                    const headSpanNode1 = document.createElement("span");
                    headSpanNode1.textContent = "Ranged Way Idle ";
                    headSpanNode1.style.fontSize = "1.5rem";
                    headSpanNode1.style.color = "#66CCFF";
                    headNode.appendChild(headSpanNode1);
                    const headSpanNode2 = document.createElement("span");
                    headSpanNode2.textContent = I18N("ranged_way_idle_config_menu_title");
                    headSpanNode2.style.fontSize = "1.5rem";
                    headNode.appendChild(headSpanNode2);
                    configMenuRootNode.appendChild(headNode);

                    // note text
                    const noteTextNode = document.createElement("div");
                    noteTextNode.textContent = I18N("configNoteText");
                    configMenuRootNode.appendChild(noteTextNode);

                    // if contains secret setting, add additional text
                    let hasSecretSetting = false;
                    for (const configClass in configs) {
                        for (const configName in configs[configClass]) {
                            if (configs[configClass][configName].isSecret) {
                                hasSecretSetting = true;
                                break;
                            }
                        }
                        if (hasSecretSetting) break;
                    }
                    if (hasSecretSetting) {
                        // 没错我就是有隐藏功能不给大伙用，不服你就憋着嘿嘿嘿 ᗜˬᗜ
                        const secretTextNode = document.createElement("div");
                        secretTextNode.innerHTML = `<span style="color:#66CCFF">天依蓝</span>为内部功能，严禁外传！截图也不行！`;
                        configMenuRootNode.appendChild(secretTextNode);
                    }

                    // body
                    for (const configClass in configs) {
                        const classDivNode = document.createElement("div");
                        classDivNode.style.display = "flex";
                        classDivNode.style.alignItems = "center";
                        classDivNode.style.fontSize = "1.2rem";
                        classDivNode.style.color = "#F800F8";
                        classDivNode.textContent = I18N(configClass);
                        configMenuRootNode.appendChild(classDivNode);
                        for (const configName in configs[configClass]) {
                            if (configs[configClass][configName].isHidden) continue;
                            const divNode = document.createElement("div");
                            divNode.style.display = "flex";
                            divNode.style.alignItems = "center";
                            if (configs[configClass][configName].type === "switch") {
                                const inputNode = document.createElement("input");
                                inputNode.type = "checkbox";
                                inputNode.checked = configs[configClass][configName].value;
                                inputNode.addEventListener("change", () => {
                                    setConfig(configClass, configName, inputNode.checked);
                                });
                                inputNode.id = configName;
                                divNode.appendChild(inputNode);

                                const textNode = document.createElement("span");
                                textNode.textContent = I18N(configName);
                                if (configs[configClass][configName].isSecret) {
                                    textNode.style.color = "#66CCFF";
                                }
                                divNode.appendChild(textNode);

                            } else if (configs[configClass][configName].type === "input_number") {
                                const textNode = document.createElement("span");
                                textNode.textContent = I18N(configName);
                                if (configs[configClass][configName].isSecret) {
                                    textNode.style.color = "#66CCFF";
                                }
                                divNode.appendChild(textNode);

                                const inputNode = document.createElement("input");
                                inputNode.type = "number";
                                inputNode.value = configs[configClass][configName].value;
                                inputNode.addEventListener("change", () => {
                                    setConfig(configClass, configName, Number(inputNode.value));
                                });
                                inputNode.id = configName;
                                inputNode.style.width = "5rem";
                                divNode.appendChild(inputNode);
                            } else if (configs[configClass][configName].type === "input_range") {
                                const textNode = document.createElement("span");
                                textNode.textContent = I18N(configName);
                                if (configs[configClass][configName].isSecret) {
                                    textNode.style.color = "#66CCFF";
                                }
                                divNode.appendChild(textNode);

                                const inputNode = document.createElement("input");
                                inputNode.type = "range";
                                inputNode.min = configs[configClass][configName].min;
                                inputNode.max = configs[configClass][configName].max;
                                inputNode.step = configs[configClass][configName].step;
                                inputNode.value = configs[configClass][configName].value;
                                inputNode.addEventListener("change", () => {
                                    setConfig(configClass, configName, Number(inputNode.value));
                                });
                                inputNode.id = configName;
                                inputNode.style.width = "10rem";
                                divNode.appendChild(inputNode);
                            } else if (configs[configClass][configName].type === "input_text") {
                                const textNode = document.createElement("span");
                                textNode.textContent = I18N(configName);
                                if (configs[configClass][configName].isSecret) {
                                    textNode.style.color = "#66CCFF";
                                }
                                divNode.appendChild(textNode);

                                const inputNode = document.createElement("input");
                                inputNode.value = configs[configClass][configName].value;
                                inputNode.addEventListener("change", () => {
                                    setConfig(configClass, configName, inputNode.value);
                                });
                                inputNode.id = configName;
                                inputNode.style.width = "5rem";
                                divNode.appendChild(inputNode);
                            } else if (configs[configClass][configName].type === "select") {
                                const textNode = document.createElement("span");
                                textNode.textContent = I18N(configName);
                                if (configs[configClass][configName].isSecret) {
                                    textNode.style.color = "#66CCFF";
                                }
                                divNode.appendChild(textNode);

                                const selectNode = document.createElement("select");
                                for (const option of configs[configClass][configName].options) {
                                    const optionNode = document.createElement("option");
                                    optionNode.value = option;
                                    optionNode.textContent = I18N(option);
                                    if (option.value === configs[configClass][configName].value) optionNode.selected = true;
                                    selectNode.appendChild(optionNode);
                                }
                                selectNode.value = configs[configClass][configName].value;
                                selectNode.addEventListener("change", () => {
                                    setConfig(configClass, configName, selectNode.value);
                                });
                                divNode.appendChild(selectNode);
                            }
                            configMenuRootNode.appendChild(divNode);
                        }
                    }

                    // add to panel
                    settingPanelNode.appendChild(configMenuRootNode);
                }


                return {loadLocalConfig: loadLocalConfig, ob: ob};
            }

            return {
                showSponsor: showSponsor, mournForMagicWayIdle: mournForMagicWayIdle, showConfigMenu: showConfigMenu
            }
        }
    }

    function I18N(key, data) {
        let i18nValue;
        if (!I18NMap[key]) {
            i18nValue = key;
        } else if (I18NMap[key][configs.otherClass.scriptLanguage.value]) {
            i18nValue = I18NMap[key][configs.otherClass.scriptLanguage.value];
        } else {
            i18nValue = key;
        }
        return fillTemplate(i18nValue, data || {});

        function fillTemplate(template, data) {
            return template.replace(/\$\{(\w+)}/g, (match, key) => {
                return data[key] !== undefined ? data[key] : match;
            });
        }
    }

    function formatItemCount(num, precise = 0) {
        if (num === null) return "NULL";
        num = Number(num);
        if (isNaN(num)) {
            return "NULL";
        }
        const divisorMap = [{threshold: 1e13, divisor: 1e12, unit: "T"}, {
            threshold: 1e10,
            divisor: 1e9,
            unit: "B"
        }, {threshold: 1e7, divisor: 1e6, unit: "M"}, {threshold: 1e4, divisor: 1e3, unit: "K"}];
        for (const {threshold, divisor, unit} of divisorMap) {
            if (Math.abs(num) >= threshold) {
                const value = Math.floor(num / divisor * Math.pow(10, precise)) / Math.pow(10, precise);
                return value + unit;
            }
        }
        return Math.floor(num * Math.pow(10, precise)) / Math.pow(10, precise);
    }

    function parseItemCount(str) {
        const unitMap = {
            "T": 1e12, "B": 1e9, "M": 1e6, "K": 1e3
        }
        for (const unit in unitMap) {
            if (str.endsWith(unit)) {
                const value = Number(str.slice(0, -1));
                return value * unitMap[unit];
            }
        }
        return Number(str);
    }

    function itemCountColorMap(num) {
        if (Math.abs(num) < 1e5) {
            return "#FFFFFF";
        }
        if (Math.abs(num) < 1e7) {
            return "#FDDAA5";
        }
        if (Math.abs(num) < 1e10) {
            return "#82DCCA";
        }
        if (Math.abs(num) < 1e13) {
            return "#77BAEC";
        }
        if (Math.abs(num) < 1e16) {
            return "#AC8FD4";
        }
        return "#F800F8";
    }

    function setStorage(key, obj, forceUseLocalStorage = false) {
        if (!forceUseLocalStorage && GM_setValue && GM_getValue) {
            GM_setValue(key, obj);
        } else {
            localStorage.setItem(key, JSON.stringify(obj));
        }
    }

    function getStorage(key, forceUseLocalStorage = false) {
        if (!forceUseLocalStorage && GM_setValue && GM_getValue) {
            return GM_getValue(key);
        }
        const value = localStorage.getItem(key);
        try {
            return value ? JSON.parse(value) : undefined;
        } catch (e) {
        }
        return value;
    }

    function migrateFromLocalStorage() {
        if (!GM_setValue || !GM_getValue) return;
        const configNames = [
            "ranged_way_idle_configs",
            "ranged_way_idle_deleted_listings",
            "ranged_way_idle_hide_sidebar_config",
            "ranged_way_idle_leaderboard_data",
            "ranged_way_idle_listen_chat_messages",
            "ranged_way_idle_market_listings",
            "ImmemorialMarketConfigs"
        ];
        for (const name of configNames) {
            const obj = getStorage(name, true);
            if (obj) {
                setStorage(name, obj);
                localStorage.removeItem(name);
                console.log(`Migrated ${name} from localStorage to GM_storage`);
            }
        }
    }

    initScript();
})();