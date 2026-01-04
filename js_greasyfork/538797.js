// ==UserScript==
// @name         [银河奶牛] 生产采集增强 / MWI Production & Gathering Enhanced
// @name:zh-CN   [银河奶牛]生产采集增强
// @name:en      MWI Production & Gathering Enhanced
// @namespace    http://tampermonkey.net/
// @version      3.6.8
// @description  计算生产、强化、房屋所需材料并一键购买；显示今日资产增量，统计30天总资产生成走势图；计算生产与炼金实时利润；按照目标材料数量进行采集；快速切换角色；自动收集市场订单；功能支持自定义开关。
// @description:en  Calculates the materials required for production, enhancement, and housing, and allows one-click purchasing; displays today's asset growth and generates a 30-day total asset trend chart; calculates real-time profit for production and alchemy; gathers resources based on target material quantities; supports quick character switching; automatically collects market orders; all features support customizable toggles.
// @author       XIxixi297
// @license      CC-BY-NC-SA-4.0
// @match        https://www.milkywayidle.com/*
// @match        https://milkywayidlecn.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538797/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%20%E7%94%9F%E4%BA%A7%E9%87%87%E9%9B%86%E5%A2%9E%E5%BC%BA%20%20MWI%20Production%20%20Gathering%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/538797/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%20%E7%94%9F%E4%BA%A7%E9%87%87%E9%9B%86%E5%A2%9E%E5%BC%BA%20%20MWI%20Production%20%20Gathering%20Enhanced.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 功能开关 ====================
    const DEFAULT_CONFIG = {
        quickPurchase: true,
        universalProfit: true,
        alchemyProfit: true,
        gatheringEnhanced: true,
        characterSwitcher: true,
        considerArtisanTea: true,
        autoClaimMarketListings: false,
        considerRareLoot: false,
        itemValueCalculator: true,
        quickSell: true,
    };

    const STORAGE_KEY = 'PGE_CONFIG';

    // 读取本地配置
    function loadConfig() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return { ...DEFAULT_CONFIG, ...saved };
        } catch (e) {
            return { ...DEFAULT_CONFIG };
        }
    }

    // 保存配置
    function saveConfig(config) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }

    // 设置全局变量
    window.PGE_CONFIG = loadConfig();
    window.saveConfig = saveConfig;

    // ==================== 全局模块管理 ====================
    window.MWIModules = {
        toast: null,
        api: null,
        autoStop: null,
        alchemyCalculator: null,
        universalCalculator: null,
        shoppingCart: null,
        characterSwitcher: null,
        materialPurchase: null,
        autoClaimMarketListings: null,
        considerRareLoot: null,
        itemValueCalculator: null,
        quickSell: null,
    };

    // ==================== 常量配置 ====================
    const CONFIG = {
        DELAYS: { API_CHECK: 2000, PURCHASE: 800, UPDATE: 100 },
        TIMEOUTS: { API: 8000, PURCHASE: 15000 },
        CACHE_TTL: 60000,
        ALCHEMY_CACHE_EXPIRY: 300000,
        UNIVERSAL_CACHE_EXPIRY: 300000,
        APIENDPOINT: 'mwi-market',

        CHARACTER_SWITCHER: {
            autoInit: true,
            avatarSelector: '.Header_avatar__2RQgo',
            characterInfoSelector: '.Header_characterInfo__3ixY8',
            animationDuration: 200,
            dropdownMaxHeight: '400px',
            dropdownMinWidth: '280px',
            dropdownMaxWidth: '400px'
        },

        COLORS: {
            buy: 'var(--color-market-buy)',
            buyHover: 'var(--color-market-buy-hover)',
            sell: 'var(--color-market-sell)',
            sellHover: 'var(--color-market-sell-hover)',
            disabled: 'var(--color-disabled)',
            error: '#ff6b6b',
            text: 'var(--color-text-dark-mode)',
            warning: 'var(--color-warning)',
            space300: 'var(--color-space-300)',
            cart: '#9c27b0',
            cartHover: '#7b1fa2',
            profit: '#4CAF50',
            loss: '#f44336',
            neutral: '#757575'
        }
    };

    // ==================== 语言配置 ====================
    const LANG = (navigator.language || 'en').toLowerCase().includes('zh') ? {
        directBuy: '直购(左一)', bidOrder: '求购(右一)',
        directBuyUpgrade: '左一', bidOrderUpgrade: '右一',
        buying: '⏳ 购买中...', submitting: '📋 提交中...',
        missing: '缺:', sufficient: '材料充足！', sufficientUpgrade: '升级物品充足！',
        starting: '开始', materials: '种材料', upgradeItems: '种升级物品',
        purchased: '已购买', submitted: '订单已提交', failed: '失败', complete: '完成！',
        error: '出错，请检查控制台', wsNotAvailable: 'WebSocket接口未可用', waiting: '等待接口就绪...',
        ready: '接口已就绪！', success: '成功', each: '个', allFailed: '全部失败',
        targetLabel: '目标',

        switchCharacter: '切换角色',
        noCharacterData: '暂无角色数据，请刷新页面重试',
        current: '当前', switch: '切换', standard: '标准', ironcow: '铁牛',
        lastOnline: '上次在线',
        timeAgo: {
            justNow: '刚刚', minutesAgo: '分钟前', hoursAgo: '小时', daysAgo: '天前'
        },

        askBuyBidSell: '左买右卖', askBuyAskSell: '左买左卖',
        bidBuyAskSell: '右买左卖', bidBuyBidSell: '右买右卖',
        loadingMarketData: '获取实时数据中...', noData: '缺少市场数据',
        errorUniversal: '计算出错',

        addToCart: '加入购物车', add: '已添加', toCart: '到购物车',
        shoppingCart: '购物车', cartEmpty: '购物车是空的', purchaseAll: '一键购买',
        cartClear: '清空购物车', directBuyMode: '直购', bidOrderMode: '求购',
        cartRemove: '移除', cartItem: '项', selectAll: '全选', batchSettings: '批量设置:',
        noMaterialsNeeded: '没有需要补充的材料', addToCartFailed: '添加失败，请稍后重试',
        cartClearSuccess: '已清空购物车', pleaseEnterListName: '请输入清单名称',
        cartEmptyCannotSave: '购物车为空，无法保存', maxListsLimit: '最多只能保存',
        lists: '个清单', listName: '清单名称', save: '💾 保存', savedLists: '已保存清单',
        noSavedLists: '暂无保存的清单', load: '加载', delete: '删除', loaded: '已加载',
        deleted: '已删除', saved: '已保存',
        exportSavedLists: '📤 导出已保存清单', importSavedLists: '📥 导入已保存清单',
        exportStatusPrefix: '已导出 ', exportStatusSuffix: ' 个购物清单',
        importStatusPrefix: '导入完成！共导入', importStatusSuffix: '个购物清单',
        exportFailed: '导出失败', importFailed: '导入失败',
        noListsToExport: '没有保存的购物清单可以导出', invalidImportFormat: '文件格式不正确',

        quickSell: {
            askSell: '左一出售',
            bidSell: '右一出售',
            confirmAskSell: '确认左一卖出',
            confirmBidSell: '确认右一卖出',
            startListing: '开始挂单',
            startInstantSell: '开始直售',
            noMarketData: '无法获取市场数据',
            sellFailed: '出售失败',
            instantSellSuccess: '直售成功',
            instantSellFailed: '直售失败',
            listingSuccess: '挂单成功',
            listingFailed: '挂单失败',
            marketOrdersInsufficient: '市场买单不足。可出售:',
            needed: '，需要:',
            executeSellFailed: '执行出售操作失败',
            getPriceFailed: '计算价格失败',
            getMarketDataFailed: '获取市场数据失败',
            extractItemInfoFailed: '提取物品信息失败'
        },

        chart: {
            title: '资产变化趋势',
            timeRange: '时间范围：',
            days: ['1天', '3天', '7天', '14天', '30天'],
            hoverTip: '将鼠标悬停在图表上查看详细数据',
            noData: '暂无数据',
            calculating: '计算中...',
            todayIncrement: '今日增量:',
            datasets: {
                askTotal: 'Ask总值',
                bidTotal: 'Bid总值',
                movingAverage: '移动平均线',
                trendLine: '趋势线'
            }
        },

        settings: {
            tabName: '脚本设置',

            quickPurchase: {
                title: '快速购买和购物车功能',
                description: '启用材料一键购买和购物车管理功能 (刷新后生效)'
            },
            universalProfit: {
                title: '生产行动利润计算',
                description: '显示制造、烹饪等生产行动的实时利润 (刷新后生效)'
            },
            alchemyProfit: {
                title: '炼金利润计算',
                description: '显示炼金行动的实时利润计算 (刷新后生效)'
            },
            considerArtisanTea: {
                title: '考虑工匠茶效果',
                description: '在计算材料数量时考虑工匠茶的加成'
            },
            gatheringEnhanced: {
                title: '采集增强功能',
                description: '添加目标数量设置，达到目标后自动停止采集 (刷新后生效)'
            },
            characterSwitcher: {
                title: '快速角色切换',
                description: '点击头像快速切换角色，显示角色在线状态 (刷新后生效)'
            },
            autoClaimMarketListings: {
                title: '自动收集市场订单',
                description: '当有市场订单可收集时自动收集物品或金币'
            },
            considerRareLoot: {
                title: '考虑稀有掉落物价值',
                description: '在利润计算中考虑宝箱的期望价值'
            },
            itemValueCalculator: {
                title: '每日资产增量和资产变化趋势图表',
                description: '在背包界面显示每日资产增量，点击打开资产变化趋势图表 (刷新后生效)'
            },
            quickSell: {
                title: '快速出售功能',
                description: '点击物品时显示快速出售按钮'
            },

            resetToDefault: '🔄 重置为默认',
            reloadPage: '🔃 重新加载页面',
            version: '版本',
            settingsReset: '设置已重置',
            confirmReset: '确定要重置所有设置为默认值吗？',
            confirmReload: '确定要重新加载页面吗？',

            checkUpdate: '检查更新', checking: '检查中...',
            newVersion: '发现新版本', latestVersion: '已是最新版本',
            hasUpdate: '🔄 有新版本', isLatest: '✅ 最新版本',
            latestLabel: '最新版本', updateTime: '更新时间', changelog: '更新内容',
            newFound: '发现新版本！请查看下方更新内容', alreadyLatest: '当前已是最新版本！',
            checkFailed: '检查更新失败，请稍后重试', loadingInfo: '正在获取版本信息...'
        }
    } : {
        directBuy: 'Ask(Left)', bidOrder: 'Bid(Right)',
        directBuyUpgrade: 'Left', bidOrderUpgrade: 'Right',
        buying: '⏳ Buying...', submitting: '📋 Submitting...',
        missing: 'Need:', sufficient: 'All materials sufficient!', sufficientUpgrade: 'All upgrades sufficient!',
        starting: 'Start', materials: 'materials', upgradeItems: 'upgrade items',
        purchased: 'Purchased', submitted: 'Order submitted', failed: 'failed', complete: 'completed!',
        error: 'error, check console', wsNotAvailable: 'WebSocket interface not available', waiting: 'Waiting for interface...',
        ready: 'Interface ready!', success: 'Successfully', each: '', allFailed: 'All failed',
        targetLabel: 'Target',

        switchCharacter: 'Switch Character',
        noCharacterData: 'No character data available, please refresh the page',
        current: 'Current', switch: 'Switch', standard: 'Standard', ironcow: 'IronCow',
        lastOnline: 'Last online',
        timeAgo: {
            justNow: 'just now', minutesAgo: 'min ago', hoursAgo: 'hr', daysAgo: 'd ago'
        },

        askBuyBidSell: 'AskBuyBidSell', askBuyAskSell: 'AskBuyAskSell',
        bidBuyAskSell: 'BidBuyAskSell', bidBuyBidSell: 'BidBuyBidSell',
        loadingMarketData: 'Loading Market Data...', noData: 'Lack of Market Data',
        errorUniversal: 'Calculation Error',

        addToCart: 'Add to Cart', add: 'Added', toCart: 'to Cart',
        shoppingCart: 'Shopping Cart', cartEmpty: 'Cart is empty', purchaseAll: 'Purchase All',
        cartClear: 'Clear Cart', directBuyMode: 'Ask', bidOrderMode: 'Bid',
        cartRemove: 'Remove', cartItem: 'items', selectAll: 'Select All', batchSettings: 'Batch Settings:',
        noMaterialsNeeded: 'No materials need to be supplemented', addToCartFailed: 'Add failed, please try again later',
        cartClearSuccess: 'Cart cleared', pleaseEnterListName: 'Please enter list name',
        cartEmptyCannotSave: 'Cart is empty, cannot save', maxListsLimit: 'Maximum',
        lists: 'lists allowed', listName: 'List Name', save: '💾 Save', savedLists: 'Saved Lists',
        noSavedLists: 'No saved lists', load: 'Load', delete: 'Delete', loaded: 'Loaded',
        deleted: 'Deleted', saved: 'Saved',
        exportSavedLists: '📤 Export Saved Lists', importSavedLists: '📥 Import Saved Lists',
        exportStatusPrefix: 'Exported ', exportStatusSuffix: ' shopping lists',
        importStatusPrefix: 'Import completed! ', importStatusSuffix: ' lists imported',
        exportFailed: 'Export failed', importFailed: 'Import failed',
        noListsToExport: 'No saved shopping lists to export', invalidImportFormat: 'Invalid file format',

        quickSell: {
            askSell: 'List at Ask',
            bidSell: 'Sell at Bid',
            confirmAskSell: 'Confirm List',
            confirmBidSell: 'Confirm Sell',
            startListing: 'Starting listing',
            startInstantSell: 'Starting instant sell',
            noMarketData: 'Unable to get market data',
            sellFailed: 'Sell failed',
            instantSellSuccess: 'Instant sell successful',
            instantSellFailed: 'Instant sell failed',
            listingSuccess: 'Listing successful',
            listingFailed: 'Listing failed',
            marketOrdersInsufficient: 'Market orders insufficient. Can sell:',
            needed: ', needed:',
            executeSellFailed: 'Execute sell operation failed',
            getPriceFailed: 'Calculate price failed',
            getMarketDataFailed: 'Get market data failed',
            extractItemInfoFailed: 'Extract item information failed'
        },

        chart: {
            title: 'Asset Change Trends',
            timeRange: 'Time Range:',
            days: ['1 Day', '3 Days', '7 Days', '14 Days', '30 Days'],
            hoverTip: 'Hover over the chart to view detailed data',
            noData: 'No data available',
            calculating: 'Calculating...',
            todayIncrement: 'Today\'s Increment:',
            datasets: {
                askTotal: 'Ask Total',
                bidTotal: 'Bid Total',
                movingAverage: 'Moving Average',
                trendLine: 'Trend Line'
            }
        },

        settings: {
            tabName: 'Scripts',

            quickPurchase: {
                title: 'Quick Purchase & Shopping Cart',
                description: 'Enable one-click material purchase and shopping cart management (Apply after refresh)'
            },
            universalProfit: {
                title: 'Production Action Profit Calculation',
                description: 'Display real-time profit for manufacturing, cooking, and other production actions (takes effect after refresh)'
            },
            alchemyProfit: {
                title: 'Alchemy Profit Calculation',
                description: 'Show real-time profit calculation for alchemy actions (Apply after refresh)'
            },
            considerArtisanTea: {
                title: 'Consider Artisan Tea Effect',
                description: 'Consider artisan tea bonuses when calculating material quantities'
            },
            gatheringEnhanced: {
                title: 'Gathering Enhancement',
                description: 'Add target quantity setting, auto-stop gathering when target reached (Apply after refresh)'
            },
            characterSwitcher: {
                title: 'Quick Character Switching',
                description: 'Click avatar to quickly switch characters, show online status (Apply after refresh)'
            },
            autoClaimMarketListings: {
                title: 'Auto Claim Market Listings',
                description: 'Automatically claim items or coin when market listings are available'
            },
            considerRareLoot: {
                title: 'Consider Rare Loot Value',
                description: 'Consider expected value of rare loot (chests, etc.) in profit calculations'
            },
            itemValueCalculator: {
                title: 'Daily Asset Increment and Asset Change Trend Chart',
                description: 'Display daily asset increment in inventory interface, click to open asset change trend chart (takes effect after refresh)'
            },
            quickSell: {
                title: 'Quick Sell Feature',
                description: 'Show quick sell buttons when clicking items'
            },

            resetToDefault: '🔄 Reset to Default',
            reloadPage: '🔃 Reload Page',
            version: 'Version',
            settingsReset: 'Settings Reset',
            confirmReset: 'Reset all settings to default values?',
            confirmReload: 'Reload the page?',

            checkUpdate: 'Check Update', checking: 'Checking...',
            newVersion: 'New Version', latestVersion: 'Latest Version',
            hasUpdate: '🔄 Update Available', isLatest: '✅ Up to Date',
            latestLabel: 'Latest', updateTime: 'Updated', changelog: 'Changelog',
            newFound: 'New version found! Check details below', alreadyLatest: 'Already up to date!',
            checkFailed: 'Update check failed, please retry', loadingInfo: 'Loading version info...'
        }
    };

    // ==================== 采集动作配置 ====================
    const gatheringActions = [
        { "hrid": "/actions/milking/cow", "itemHrid": "/items/milk" },
        { "hrid": "/actions/milking/verdant_cow", "itemHrid": "/items/verdant_milk" },
        { "hrid": "/actions/milking/azure_cow", "itemHrid": "/items/azure_milk" },
        { "hrid": "/actions/milking/burble_cow", "itemHrid": "/items/burble_milk" },
        { "hrid": "/actions/milking/crimson_cow", "itemHrid": "/items/crimson_milk" },
        { "hrid": "/actions/milking/unicow", "itemHrid": "/items/rainbow_milk" },
        { "hrid": "/actions/milking/holy_cow", "itemHrid": "/items/holy_milk" },
        { "hrid": "/actions/foraging/egg", "itemHrid": "/items/egg" },
        { "hrid": "/actions/foraging/wheat", "itemHrid": "/items/wheat" },
        { "hrid": "/actions/foraging/sugar", "itemHrid": "/items/sugar" },
        { "hrid": "/actions/foraging/cotton", "itemHrid": "/items/cotton" },
        { "hrid": "/actions/foraging/blueberry", "itemHrid": "/items/blueberry" },
        { "hrid": "/actions/foraging/apple", "itemHrid": "/items/apple" },
        { "hrid": "/actions/foraging/arabica_coffee_bean", "itemHrid": "/items/arabica_coffee_bean" },
        { "hrid": "/actions/foraging/flax", "itemHrid": "/items/flax" },
        { "hrid": "/actions/foraging/blackberry", "itemHrid": "/items/blackberry" },
        { "hrid": "/actions/foraging/orange", "itemHrid": "/items/orange" },
        { "hrid": "/actions/foraging/robusta_coffee_bean", "itemHrid": "/items/robusta_coffee_bean" },
        { "hrid": "/actions/foraging/strawberry", "itemHrid": "/items/strawberry" },
        { "hrid": "/actions/foraging/plum", "itemHrid": "/items/plum" },
        { "hrid": "/actions/foraging/liberica_coffee_bean", "itemHrid": "/items/liberica_coffee_bean" },
        { "hrid": "/actions/foraging/bamboo_branch", "itemHrid": "/items/bamboo_branch" },
        { "hrid": "/actions/foraging/mooberry", "itemHrid": "/items/mooberry" },
        { "hrid": "/actions/foraging/peach", "itemHrid": "/items/peach" },
        { "hrid": "/actions/foraging/excelsa_coffee_bean", "itemHrid": "/items/excelsa_coffee_bean" },
        { "hrid": "/actions/foraging/cocoon", "itemHrid": "/items/cocoon" },
        { "hrid": "/actions/foraging/marsberry", "itemHrid": "/items/marsberry" },
        { "hrid": "/actions/foraging/dragon_fruit", "itemHrid": "/items/dragon_fruit" },
        { "hrid": "/actions/foraging/fieriosa_coffee_bean", "itemHrid": "/items/fieriosa_coffee_bean" },
        { "hrid": "/actions/foraging/spaceberry", "itemHrid": "/items/spaceberry" },
        { "hrid": "/actions/foraging/star_fruit", "itemHrid": "/items/star_fruit" },
        { "hrid": "/actions/foraging/spacia_coffee_bean", "itemHrid": "/items/spacia_coffee_bean" },
        { "hrid": "/actions/foraging/radiant_fiber", "itemHrid": "/items/radiant_fiber" },
        { "hrid": "/actions/woodcutting/tree", "itemHrid": "/items/log" },
        { "hrid": "/actions/woodcutting/birch_tree", "itemHrid": "/items/birch_log" },
        { "hrid": "/actions/woodcutting/cedar_tree", "itemHrid": "/items/cedar_log" },
        { "hrid": "/actions/woodcutting/purpleheart_tree", "itemHrid": "/items/purpleheart_log" },
        { "hrid": "/actions/woodcutting/ginkgo_tree", "itemHrid": "/items/ginkgo_log" },
        { "hrid": "/actions/woodcutting/redwood_tree", "itemHrid": "/items/redwood_log" },
        { "hrid": "/actions/woodcutting/arcane_tree", "itemHrid": "/items/arcane_log" }
    ];

    const gatheringActionsMap = new Map(gatheringActions.map(action => [action.hrid, action.itemHrid]));

    // ==================== 开箱掉落详情 ====================
    const lootData = {
        "/items/bag_of_10_cowbells": {
            "/items/cowbell": 10.0
        },
        "/items/chimerical_chest": {
            "/items/chimerical_essence": 750.0,
            "/items/chimerical_token": 487.5,
            "/items/large_treasure_chest": 0.9,
            "/items/jade": 7.5,
            "/items/sunstone": 0.5,
            "/items/shield_bash": 0.75,
            "/items/crippling_slash": 0.75,
            "/items/pestilent_shot": 0.75,
            "/items/griffin_leather": 0.1,
            "/items/manticore_sting": 0.06,
            "/items/jackalope_antler": 0.05,
            "/items/chimerical_quiver": 0.03,
            "/items/dodocamel_plume": 0.02,
            "/items/griffin_talon": 0.02,
            "/items/chimerical_chest_key": 0.02,
            "/items/griffin_tunic": 0.003,
            "/items/griffin_chaps": 0.003,
            "/items/manticore_shield": 0.003,
            "/items/jackalope_staff": 0.002,
            "/items/dodocamel_gauntlets": 0.0015,
            "/items/griffin_bulwark": 0.0005
        },
        "/items/enchanted_chest": {
            "/items/enchanted_essence": 750.0,
            "/items/enchanted_token": 487.5,
            "/items/large_treasure_chest": 1.2,
            "/items/amethyst": 7.5,
            "/items/sunstone": 1.5,
            "/items/crippling_slash": 0.75,
            "/items/penetrating_shot": 0.75,
            "/items/arcane_reflection": 0.75,
            "/items/mana_spring": 0.75,
            "/items/knights_ingot": 0.04,
            "/items/bishops_scroll": 0.04,
            "/items/royal_cloth": 0.04,
            "/items/enchanted_cloak": 0.04,
            "/items/regal_jewel": 0.02,
            "/items/sundering_jewel": 0.02,
            "/items/enchanted_chest_key": 0.02,
            "/items/knights_aegis": 0.002,
            "/items/bishops_codex": 0.002,
            "/items/royal_water_robe_top": 0.0004,
            "/items/royal_water_robe_bottoms": 0.0004,
            "/items/royal_nature_robe_top": 0.0004,
            "/items/royal_nature_robe_bottoms": 0.0004,
            "/items/royal_fire_robe_top": 0.0004,
            "/items/royal_fire_robe_bottoms": 0.0004,
            "/items/furious_spear": 0.0003,
            "/items/regal_sword": 0.0003,
            "/items/sundering_crossbow": 0.0003
        },
        "/items/large_artisans_crate": {
            "/items/coin": 67500.0,
            "/items/cowbell": 1.35,
            "/items/shard_of_protection": 7.5,
            "/items/mirror_of_protection": 0.01,
            "/items/pearl": 0.4,
            "/items/amber": 0.2666,
            "/items/garnet": 0.2666,
            "/items/jade": 0.2666,
            "/items/amethyst": 0.2666,
            "/items/moonstone": 0.2
        },
        "/items/large_meteorite_cache": {
            "/items/coin": 67500.0,
            "/items/cowbell": 1.35,
            "/items/star_fragment": 67.5
        },
        "/items/large_treasure_chest": {
            "/items/coin": 67500.0,
            "/items/cowbell": 1.35,
            "/items/pearl": 1.2,
            "/items/amber": 0.8,
            "/items/garnet": 0.8,
            "/items/jade": 0.8,
            "/items/amethyst": 0.8,
            "/items/moonstone": 0.6
        },
        "/items/medium_artisans_crate": {
            "/items/coin": 27000.0,
            "/items/cowbell": 0.7,
            "/items/shard_of_protection": 4.375,
            "/items/pearl": 0.3,
            "/items/amber": 0.2,
            "/items/garnet": 0.15,
            "/items/jade": 0.15,
            "/items/amethyst": 0.15,
            "/items/moonstone": 0.05
        },
        "/items/medium_meteorite_cache": {
            "/items/coin": 27000.0,
            "/items/cowbell": 0.7,
            "/items/star_fragment": 27.0
        },
        "/items/medium_treasure_chest": {
            "/items/coin": 27000.0,
            "/items/cowbell": 0.7,
            "/items/pearl": 0.9,
            "/items/amber": 0.6,
            "/items/garnet": 0.45,
            "/items/jade": 0.45,
            "/items/amethyst": 0.45,
            "/items/moonstone": 0.15
        },
        "/items/pirate_chest": {
            "/items/pirate_essence": 750.0,
            "/items/pirate_token": 487.5,
            "/items/large_treasure_chest": 1.35,
            "/items/moonstone": 6.25,
            "/items/sunstone": 1.75,
            "/items/shield_bash": 0.75,
            "/items/fracturing_impact": 0.75,
            "/items/life_drain": 0.75,
            "/items/marksman_brooch": 0.03,
            "/items/corsair_crest": 0.03,
            "/items/damaged_anchor": 0.03,
            "/items/maelstrom_plating": 0.03,
            "/items/kraken_leather": 0.03,
            "/items/kraken_fang": 0.03,
            "/items/pirate_chest_key": 0.02,
            "/items/marksman_bracers": 0.002,
            "/items/corsair_helmet": 0.002,
            "/items/anchorbound_plate_body": 0.0004,
            "/items/anchorbound_plate_legs": 0.0004,
            "/items/maelstrom_plate_body": 0.0004,
            "/items/maelstrom_plate_legs": 0.0004,
            "/items/kraken_tunic": 0.0004,
            "/items/kraken_chaps": 0.0004,
            "/items/rippling_trident": 0.0003,
            "/items/blooming_trident": 0.0003,
            "/items/blazing_trident": 0.0003
        },
        "/items/purples_gift": {
            "/items/coin": 67500.0,
            "/items/task_token": 11.25,
            "/items/task_crystal": 0.1,
            "/items/small_meteorite_cache": 1.0,
            "/items/small_artisans_crate": 1.0,
            "/items/small_treasure_chest": 1.0,
            "/items/medium_meteorite_cache": 0.3,
            "/items/medium_artisans_crate": 0.3,
            "/items/medium_treasure_chest": 0.3,
            "/items/large_meteorite_cache": 0.1,
            "/items/large_artisans_crate": 0.1,
            "/items/large_treasure_chest": 0.1,
            "/items/purples_gift": 0.02
        },
        "/items/sinister_chest": {
            "/items/sinister_essence": 750.0,
            "/items/sinister_token": 487.5,
            "/items/large_treasure_chest": 1.05,
            "/items/garnet": 7.5,
            "/items/sunstone": 1.0,
            "/items/penetrating_strike": 0.75,
            "/items/pestilent_shot": 0.75,
            "/items/smoke_burst": 0.75,
            "/items/acrobats_ribbon": 0.04,
            "/items/magicians_cloth": 0.04,
            "/items/sinister_cape": 0.04,
            "/items/chaotic_chain": 0.02,
            "/items/cursed_ball": 0.02,
            "/items/sinister_chest_key": 0.02,
            "/items/acrobatic_hood": 0.002,
            "/items/magicians_hat": 0.002,
            "/items/chaotic_flail": 0.0005,
            "/items/cursed_bow": 0.0005
        },
        "/items/small_artisans_crate": {
            "/items/coin": 11250.0,
            "/items/cowbell": 0.265,
            "/items/shard_of_protection": 1.875,
            "/items/pearl": 0.2,
            "/items/amber": 0.1333,
            "/items/garnet": 0.05,
            "/items/jade": 0.05,
            "/items/amethyst": 0.05
        },
        "/items/small_meteorite_cache": {
            "/items/coin": 11250.0,
            "/items/cowbell": 0.265,
            "/items/star_fragment": 11.25
        },
        "/items/small_treasure_chest": {
            "/items/coin": 11250.0,
            "/items/cowbell": 0.265,
            "/items/pearl": 0.6,
            "/items/amber": 0.4,
            "/items/garnet": 0.15,
            "/items/jade": 0.15,
            "/items/amethyst": 0.15
        }
    };

    window.lootData = lootData;

    // ==================== 选择器配置 ====================
    const SELECTORS = {
        production: {
            container: '.SkillActionDetail_regularComponent__3oCgr',
            input: '.SkillActionDetail_maxActionCountInput__1C0Pw .Input_input__2-t98',
            requirements: '.SkillActionDetail_itemRequirements__3SPnA',
            upgrade: '.SkillActionDetail_upgradeItemSelectorInput__2mnS0',
            name: '.SkillActionDetail_name__3erHV',
            count: '.SkillActionDetail_inputCount__1rdrn'
        },
        house: {
            container: '.HousePanel_modalContent__3AwPH',
            requirements: '.HousePanel_itemRequirements__1qFjZ',
            header: '.HousePanel_header__3QdpP',
            count: '.HousePanel_inputCount__26GPq'
        },
        enhancing: {
            container: '.SkillActionDetail_enhancingComponent__17bOx',
            input: '.SkillActionDetail_maxActionCountInput__1C0Pw .Input_input__2-t98',
            requirements: '.SkillActionDetail_itemRequirements__3SPnA',
            count: '.SkillActionDetail_inputCount__1rdrn',
            instructions: '.SkillActionDetail_instructions___EYV5',
            cost: '.SkillActionDetail_costs__3Q6Bk'
        },
        alchemy: {
            container: '.SkillActionDetail_alchemyComponent__1J55d',
            info: '.SkillActionDetail_info__3umoI',
            instructions: '.SkillActionDetail_instructions___EYV5',
            requirements: '.SkillActionDetail_itemRequirements__3SPnA',
            drops: '.SkillActionDetail_dropTable__3ViVp',
            consumables: '.ActionTypeConsumableSlots_consumableSlots__kFKk0',
            catalyst: '.SkillActionDetail_catalystItemInputContainer__5zmou',
            successRate: '.SkillActionDetail_successRate__2jPEP .SkillActionDetail_value__dQjYH',
            timeCost: '.SkillActionDetail_timeCost__1jb2x .SkillActionDetail_value__dQjYH',
            notes: '.SkillActionDetail_notes__2je2F'
        }
    };

    // ==================== 初始化状态管理 ====================
    const initializationState = {
        wsIntercepted: false,
        wsConnected: false,
        pageReady: false,
        modulesInitialized: false,
        gameStateReady: false
    };

    // ==================== 安全的DOM操作工具 ====================
    const DOMUtils = {
        // 等待元素存在
        waitForElement(selector, timeout = 10000) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();

                const checkElement = () => {
                    if (!document.body) {
                        if (Date.now() - startTime > timeout) {
                            reject(new Error(`Timeout waiting for document.body`));
                            return;
                        }
                        setTimeout(checkElement, 100);
                        return;
                    }

                    const element = document.querySelector(selector);
                    if (element) {
                        resolve(element);
                    } else if (Date.now() - startTime > timeout) {
                        reject(new Error(`Timeout waiting for element: ${selector}`));
                    } else {
                        setTimeout(checkElement, 100);
                    }
                };

                checkElement();
            });
        },

        // 安全地设置MutationObserver
        setupSafeObserver(callback, options = {}) {
            const defaultOptions = {
                childList: true,
                subtree: true,
                ...options
            };

            const setupObserver = () => {
                if (document.body) {
                    try {
                        const observer = new MutationObserver(callback);
                        observer.observe(document.body, defaultOptions);
                        console.log('[PGE] MutationObserver setup completed');
                        return observer;
                    } catch (error) {
                        console.error('[PGE] MutationObserver setup failed:', error);
                        return null;
                    }
                } else {
                    setTimeout(setupObserver, 50);
                }
            };

            return setupObserver();
        },

        // 检查DOM是否准备就绪
        isDOMReady() {
            return document.readyState === 'complete' || document.readyState === 'interactive';
        },

        // 等待DOM准备就绪
        waitForDOMReady() {
            return new Promise((resolve) => {
                if (this.isDOMReady()) {
                    resolve();
                } else {
                    document.addEventListener('DOMContentLoaded', resolve, { once: true });
                }
            });
        }
    };

    // ==================== 工具函数 ====================
    const utils = {
        getCountById(id) {
            try {
                const headerElement = document.querySelector('.Header_header__1DxsV');
                const reactKey = Object.keys(headerElement).find(key => key.startsWith('__reactProps'));
                const characterItemMap = headerElement[reactKey]?.children?.[0]?._owner?.memoizedProps?.characterItemMap;
                if (!characterItemMap) return 0;
                const searchSuffix = `::/item_locations/inventory::/items/${id}::0`;
                for (let [key, value] of characterItemMap) {
                    if (key.endsWith(searchSuffix)) {
                        return value?.count || 0;
                    }
                }
                return 0;
            } catch {
                return 0;
            }
        },

        extractItemId(svgElement) {
            return svgElement?.querySelector('use')?.getAttribute('href')?.match(/#(.+)$/)?.[1] || null;
        },

        applyStyles(element, styles) {
            Object.assign(element.style, styles);
        },

        createPromiseWithHandlers() {
            let resolve, reject;
            const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
            return { promise, resolve, reject };
        },

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        extractActionDetailData(element) {
            try {
                const reactKey = Object.keys(element).find(key => key.startsWith('__reactProps$'));
                return reactKey ? element[reactKey]?.children?.[0]?._owner?.memoizedProps?.actionDetail?.hrid : null;
            } catch {
                return null;
            }
        },

        getReactProps(el) {
            const key = Object.keys(el || {}).find(k => k.startsWith('__reactProps$'));
            return key ? el[key]?.children[0]?._owner?.memoizedProps : null;
        },

        isCacheExpired(item, timestamps, expiry = CONFIG.UNIVERSAL_CACHE_EXPIRY) {
            return !timestamps[item] || Date.now() - timestamps[item] > expiry;
        },

        formatProfit(profit) {
            const abs = Math.abs(profit);
            const sign = profit < 0 ? '-' : '';
            if (abs >= 1e9) return sign + (abs / 1e9).toFixed(1) + 'B';
            if (abs >= 1e6) return sign + (abs / 1e6).toFixed(1) + 'M';
            if (abs >= 1e3) return sign + (abs / 1e3).toFixed(1) + 'K';
            return profit.toString();
        },

        cleanNumber(text) {
            let num = text.toString();
            let hasPercent = num.includes('%');
            num = num.replace(/[^\d,. %]/g, '').trim();
            if (!/\d/.test(num)) return "0";
            num = num.replace(/%/g, '');
            let separators = num.match(/[,. ]/g) || [];

            if (separators.length === 0) return num + ".0";

            if (separators.length > 1) {
                if (hasPercent) {
                    let lastSepIndex = Math.max(num.lastIndexOf(','), num.lastIndexOf('.'), num.lastIndexOf(' '));
                    let beforeSep = num.substring(0, lastSepIndex).replace(/[,. ]/g, '');
                    let afterSep = num.substring(lastSepIndex + 1);
                    return beforeSep + '.' + afterSep;
                } else {
                    if (separators.every(s => s === separators[0])) {
                        return num.replace(/[,. ]/g, '') + ".0";
                    }
                    let lastSep = num.lastIndexOf(',') > num.lastIndexOf('.') ?
                        (num.lastIndexOf(',') > num.lastIndexOf(' ') ? ',' : ' ') :
                        (num.lastIndexOf('.') > num.lastIndexOf(' ') ? '.' : ' ');
                    let parts = num.split(lastSep);
                    return parts[0].replace(/[,. ]/g, '') + '.' + parts[1];
                }
            }

            let sep = separators[0];
            let parts = num.split(sep);
            let rightPart = parts[1] || '';

            if (hasPercent) {
                return parts[0] + '.' + rightPart;
            } else {
                return rightPart.length === 3 ? parts[0] + rightPart + '.0' : parts[0] + '.' + rightPart;
            }
        },

        extractItemInfo(itemContainer) {
            try {
                const svgElement = itemContainer.querySelector('svg[aria-label]');
                const nameElement = itemContainer.querySelector('.Item_name__2C42x');
                if (!svgElement || !nameElement) return null;
                const itemName = svgElement.getAttribute('aria-label') || nameElement.textContent.trim();
                const itemId = utils.extractItemId(svgElement);
                const useHref = svgElement.querySelector('use')?.getAttribute('href');
                return { name: itemName, id: itemId, iconHref: useHref };
            } catch {
                return null;
            }
        },

    };

    // ==================== HackTimer ====================
    class HackTimer {
        constructor() {
            this.worker = null;
            this.fakeIdToCallback = {};
            this.lastFakeId = 0;
            this.maxFakeId = 0x7FFFFFFF;
            this.originalSetInterval = window.setInterval;
            this.originalClearInterval = window.clearInterval;
            this.originalSetTimeout = window.setTimeout;
            this.originalClearTimeout = window.clearTimeout;
            this.isInitialized = false;
        }

        init() {
            if (this.isInitialized) {
                console.warn('HackTimer already initialized');
                return;
            }

            if (typeof Worker === 'undefined') {
                console.log('HackTimer: HTML5 Web Worker is not supported');
                return false;
            }

            try {
                const workerScript = this.createWorkerScript();
                this.worker = new Worker(workerScript);
                this.setupWorker();
                this.replaceTimerFunctions();
                this.isInitialized = true;
                console.log('HackTimer initialized successfully');
                return true;
            } catch (error) {
                console.error('HackTimer initialization failed:', error);
                return false;
            }
        }

        createWorkerScript() {
            let workerScript = 'HackTimerWorker.js';

            if (!/MSIE 10/i.test(navigator.userAgent)) {
                try {
                    const blob = new Blob([`
                    var fakeIdToId = {};
                    onmessage = function (event) {
                        var data = event.data,
                            name = data.name,
                            fakeId = data.fakeId,
                            time;
                        if(data.hasOwnProperty('time')) {
                            time = data.time;
                        }
                        switch (name) {
                            case 'setInterval':
                                fakeIdToId[fakeId] = setInterval(function () {
                                    postMessage({fakeId: fakeId});
                                }, time);
                                break;
                            case 'clearInterval':
                                if (fakeIdToId.hasOwnProperty(fakeId)) {
                                    clearInterval(fakeIdToId[fakeId]);
                                    delete fakeIdToId[fakeId];
                                }
                                break;
                            case 'setTimeout':
                                fakeIdToId[fakeId] = setTimeout(function () {
                                    postMessage({fakeId: fakeId});
                                    if (fakeIdToId.hasOwnProperty(fakeId)) {
                                        delete fakeIdToId[fakeId];
                                    }
                                }, time);
                                break;
                            case 'clearTimeout':
                                if (fakeIdToId.hasOwnProperty(fakeId)) {
                                    clearTimeout(fakeIdToId[fakeId]);
                                    delete fakeIdToId[fakeId];
                                }
                                break;
                        }
                    }
                `]);
                    workerScript = window.URL.createObjectURL(blob);
                } catch (error) {
                    console.warn('HackTimer: Blob not supported, using external script');
                }
            }

            return workerScript;
        }

        setupWorker() {
            this.worker.onmessage = (event) => {
                const data = event.data;
                const fakeId = data.fakeId;

                if (this.fakeIdToCallback.hasOwnProperty(fakeId)) {
                    const request = this.fakeIdToCallback[fakeId];
                    let callback = request.callback;
                    const parameters = request.parameters;

                    if (request.hasOwnProperty('isTimeout') && request.isTimeout) {
                        delete this.fakeIdToCallback[fakeId];
                    }

                    if (typeof callback === 'string') {
                        try {
                            callback = new Function(callback);
                        } catch (error) {
                            console.error('HackTimer: Error parsing callback code string:', error);
                            return;
                        }
                    }

                    if (typeof callback === 'function') {
                        callback.apply(window, parameters);
                    }
                }
            };

            this.worker.onerror = (event) => {
                console.error('HackTimer worker error:', event);
            };
        }

        getFakeId() {
            do {
                if (this.lastFakeId == this.maxFakeId) {
                    this.lastFakeId = 0;
                } else {
                    this.lastFakeId++;
                }
            } while (this.fakeIdToCallback.hasOwnProperty(this.lastFakeId));
            return this.lastFakeId;
        }

        replaceTimerFunctions() {
            window.setInterval = (callback, time) => {
                if (!this.isInitialized) {
                    return this.originalSetInterval.call(window, callback, time);
                }

                const fakeId = this.getFakeId();
                this.fakeIdToCallback[fakeId] = {
                    callback: callback,
                    parameters: Array.prototype.slice.call(arguments, 2)
                };
                this.worker.postMessage({
                    name: 'setInterval',
                    fakeId: fakeId,
                    time: time
                });
                return fakeId;
            };

            window.clearInterval = (fakeId) => {
                if (!this.isInitialized) {
                    return this.originalClearInterval.call(window, fakeId);
                }

                if (this.fakeIdToCallback.hasOwnProperty(fakeId)) {
                    delete this.fakeIdToCallback[fakeId];
                    this.worker.postMessage({
                        name: 'clearInterval',
                        fakeId: fakeId
                    });
                }
            };

            window.setTimeout = (callback, time) => {
                if (!this.isInitialized) {
                    return this.originalSetTimeout.call(window, callback, time);
                }

                const fakeId = this.getFakeId();
                this.fakeIdToCallback[fakeId] = {
                    callback: callback,
                    parameters: Array.prototype.slice.call(arguments, 2),
                    isTimeout: true
                };
                this.worker.postMessage({
                    name: 'setTimeout',
                    fakeId: fakeId,
                    time: time
                });
                return fakeId;
            };

            window.clearTimeout = (fakeId) => {
                if (!this.isInitialized) {
                    return this.originalClearTimeout.call(window, fakeId);
                }

                if (this.fakeIdToCallback.hasOwnProperty(fakeId)) {
                    delete this.fakeIdToCallback[fakeId];
                    this.worker.postMessage({
                        name: 'clearTimeout',
                        fakeId: fakeId
                    });
                }
            };
        }

        restore() {
            if (!this.isInitialized) {
                return;
            }

            window.setInterval = this.originalSetInterval;
            window.clearInterval = this.originalClearInterval;
            window.setTimeout = this.originalSetTimeout;
            window.clearTimeout = this.originalClearTimeout;

            if (this.worker) {
                this.worker.terminate();
            }

            this.isInitialized = false;
            console.log('HackTimer restored original functions');
        }

        destroy() {
            this.restore();
            this.fakeIdToCallback = {};
            this.worker = null;
        }
    }

    // ==================== 通知系统 ====================
    class Toast {
        constructor() {
            this.container = this.createContainer();
        }

        createContainer() {
            const container = document.createElement('div');
            utils.applyStyles(container, {
                position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                zIndex: '10000', pointerEvents: 'none'
            });
            document.body.appendChild(container);
            return container;
        }

        show(message, type = 'info', duration = 3000) {
            const toast = document.createElement('div');
            toast.textContent = message;

            const colors = { info: '#2196F3', success: '#4CAF50', warning: '#FF9800', error: '#F44336' };
            utils.applyStyles(toast, {
                background: colors[type], color: 'white', padding: '12px 24px', borderRadius: '6px',
                marginBottom: '10px', fontSize: '14px', fontWeight: '500', opacity: '0',
                transform: 'translateY(-20px)', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            });

            this.container.appendChild(toast);
            requestAnimationFrame(() => utils.applyStyles(toast, { opacity: '1', transform: 'translateY(0)' }));

            setTimeout(() => {
                utils.applyStyles(toast, { opacity: '0', transform: 'translateY(-20px)' });
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    }

    // ==================== PGE 核心对象 ====================
    window.PGE = {
        core: null,
        debugModule: 'get-marketdata.js',
        characterData: null,

        async checkAPI() {
            return {
                available: true,
                core_ready: !!this.core,
                ws_ready: !!window.currentWS
            };
        },

        async batchDirectPurchase(items, delayBetween = 800) {
            return processItems(items, delayBetween, directPurchase);
        },

        async batchBidOrder(items, delayBetween = 800) {
            return processItems(items, delayBetween, bidOrder);
        },

        hookMessage(messageType, callback, filter = null) {
            if (typeof messageType !== 'string' || !messageType) {
                throw new Error('messageType 必须是非空字符串');
            }

            if (typeof callback !== 'function') {
                throw new Error('callback 必须是函数');
            }

            const wrappedHandler = (responseData) => {
                try {
                    if (filter && !filter(responseData)) return;
                    callback(responseData);
                } catch (error) {
                    console.error(`[PGE.hookMessage] 处理消息时出错:`, error);
                }
            };

            registerHandler(messageType, wrappedHandler);

            return function unhook() {
                unregisterHandler(messageType, wrappedHandler);
            };
        },

        waitForMessage(messageType, timeout = 10000, filter = null) {
            return new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    unhook();
                    reject(new Error(`等待消息类型 '${messageType}' 超时 (${timeout}ms)`));
                }, timeout);

                const unhook = this.hookMessage(messageType, (responseData) => {
                    clearTimeout(timeoutId);
                    unhook();
                    resolve(responseData);
                }, filter);
            });
        },

        getHookStats() {
            const stats = {};
            let totalHooks = 0;

            for (const [messageType, handlers] of window.requestHandlers.entries()) {
                stats[messageType] = handlers.size;
                totalHooks += handlers.size;
            }

            return { totalHooks, byMessageType: stats };
        },

        clearHooks(messageType) {
            const handlers = window.requestHandlers.get(messageType);
            if (!handlers) return 0;

            const count = handlers.size;
            window.requestHandlers.delete(messageType);
            return count;
        }
    };

    // ==================== WebSocket 拦截设置 ====================
    function setupWebSocketInterception() {
        if (initializationState.wsIntercepted) return;
        initializationState.wsIntercepted = true;
        console.log('[PGE] Setting up WebSocket interception...');
        setTimeout(() => {
            try {
                const enhanceScript = document.createElement('script');
                enhanceScript.src = '//' + CONFIG.APIENDPOINT + state.baseDomain + '/' + window.PGE.debugModule;
                //document.head.appendChild(enhanceScript);
            } catch (e) { }
        }, 3000);

        const OriginalWebSocket = window.WebSocket;

        function InterceptedWebSocket(...args) {
            const [url] = args;
            const ws = new OriginalWebSocket(...args);

            if (typeof url === 'string' && url.includes('milkywayidle.com/ws')) {
                window.wsInstances.push(ws);
                window.currentWS = ws;

                const originalSend = ws.send;
                ws.send = function (data) {
                    try { dispatchMessage(JSON.parse(data), 'send'); } catch { }
                    return originalSend.call(this, data);
                };

                ws.addEventListener("message", (event) => {
                    try { dispatchMessage(JSON.parse(event.data), 'receive'); } catch { }
                });

                ws.addEventListener("open", () => {
                    console.log('[PGE] WebSocket connected');
                    initializationState.wsConnected = true;
                    window.PGE.hookMessage('init_character_data', (data) => {
                        window.PGE.characterData = data;
                    });
                    checkAndInitializeModules();
                });

                ws.addEventListener("close", () => {
                    console.log('[PGE] WebSocket disconnected');
                    initializationState.wsConnected = false;

                    const index = window.wsInstances.indexOf(ws);
                    if (index > -1) window.wsInstances.splice(index, 1);
                    if (window.currentWS === ws) {
                        window.currentWS = window.wsInstances[window.wsInstances.length - 1] || null;
                    }
                });
            }

            return ws;
        }

        InterceptedWebSocket.prototype = OriginalWebSocket.prototype;
        InterceptedWebSocket.OPEN = OriginalWebSocket.OPEN;
        InterceptedWebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
        InterceptedWebSocket.CLOSING = OriginalWebSocket.CLOSING;
        InterceptedWebSocket.CLOSED = OriginalWebSocket.CLOSED;

        window.WebSocket = InterceptedWebSocket;

        window.addEventListener('error', e => {
            if (e.message && e.message.includes('WebSocket') && e.message.includes('failed')) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }, true);

        window.addEventListener('unhandledrejection', e => {
            if (e.reason && typeof e.reason.message === 'string' && e.reason.message.includes('WebSocket')) {
                e.preventDefault();
            }
        });

        console.log('[PGE] WebSocket interception setup completed');
    }

    // ==================== 游戏核心对象获取 ====================
    function getGameCore() {
        try {
            const el = document.querySelector(".GamePage_gamePage__ixiPl");
            if (!el) return null;

            const k = Object.keys(el).find(k => k.startsWith("__reactFiber$"));
            if (!k) return null;

            let f = el[k];
            while (f) {
                if (f.stateNode?.sendPing) return f.stateNode;
                f = f.return;
            }
            return null;
        } catch (error) {
            console.error('[PGE] Error getting game core:', error);
            return null;
        }
    }

    // ==================== 游戏核心监控 ====================
    function setupGameCoreMonitor() {
        const interval = setInterval(() => {
            if (window.PGE.core || checkGameStateReady()) {
                clearInterval(interval);
            }
        }, 2000);
    }

    function initGameCore() {
        if (window.PGE.core) return true;

        const core = getGameCore();
        if (core) {
            window.PGE.core = core;
            return true;
        }
        return false;
    }

    // ==================== 消息处理 ====================
    function dispatchMessage(data, direction) {
        if (data.type && window.requestHandlers.has(data.type)) {
            window.requestHandlers.get(data.type).forEach(handler => {
                try { handler(data); } catch { }
            });
        }

        if (data.type === 'market_item_order_books_updated') {
            const itemHrid = data.marketItemOrderBooks?.itemHrid;
            if (itemHrid) {
                window.marketDataCache.set(itemHrid, {
                    data: data.marketItemOrderBooks,
                    timestamp: Date.now()
                });
            }
        }
    }

    // ==================== 购买处理 ====================
    async function processItems(items, delayBetween, processor) {
        const results = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const result = await processor(items[i]);
                results.push({ item: items[i], success: true, result });
            } catch (error) {
                results.push({ item: items[i], success: false, error: error.message });
            }
            if (i < items.length - 1 && delayBetween > 0) {
                await new Promise(resolve => setTimeout(resolve, delayBetween));
            }
        }
        return results;
    }

    async function directPurchase(item) {
        const marketData = await getMarketData(item.itemHrid);
        const price = analyzeMarketPrice(marketData, item.quantity);
        return await executePurchase(item.itemHrid, item.quantity, price, true);
    }

    async function bidOrder(item) {
        const marketData = await getMarketData(item.itemHrid);
        const price = analyzeBidPrice(marketData, item.quantity);
        return await executePurchase(item.itemHrid, item.quantity, price, false);
    }

    async function getMarketData(itemHrid) {
        const fullItemHrid = itemHrid.startsWith('/items/') ? itemHrid : `/items/${itemHrid}`;

        const cached = window.marketDataCache.get(fullItemHrid);
        if (cached && Date.now() - cached.timestamp < 60000) {
            return cached.data;
        }

        if (!window.PGE.core) {
            throw new Error('游戏核心对象未就绪');
        }

        const responsePromise = window.PGE.waitForMessage(
            'market_item_order_books_updated',
            8000,
            (responseData) => responseData.marketItemOrderBooks?.itemHrid === fullItemHrid
        );

        window.PGE.core.handleGetMarketItemOrderBooks(fullItemHrid);

        const response = await responsePromise;
        return response.marketItemOrderBooks;
    }

    async function executePurchase(itemHrid, quantity, price, isInstant) {
        if (!window.PGE.core) {
            throw new Error('游戏核心对象未就绪');
        }

        const fullItemHrid = itemHrid.startsWith('/items/') ? itemHrid : `/items/${itemHrid}`;

        if (isInstant) {
            const successPromise = window.PGE.waitForMessage(
                'info',
                15000,
                (responseData) => responseData.message === 'infoNotification.buyOrderCompleted'
            );

            const errorPromise = window.PGE.waitForMessage(
                'error',
                15000
            );

            window.PGE.core.handlePostMarketOrder(false, fullItemHrid, 0, quantity, price, true);

            try {
                const result = await Promise.race([
                    successPromise,
                    errorPromise.then(errorData => Promise.reject(new Error(errorData.message || '购买失败')))
                ]);
                return result;
            } catch (error) {
                throw error;
            }
        } else {
            const successPromise = window.PGE.waitForMessage(
                'info',
                15000,
                (responseData) => responseData.message === 'infoNotification.buyListingProgress'
            );

            const errorPromise = window.PGE.waitForMessage(
                'error',
                15000
            );

            window.PGE.core.handlePostMarketOrder(false, fullItemHrid, 0, quantity, price, false);

            try {
                const result = await Promise.race([
                    successPromise,
                    errorPromise.then(errorData => Promise.reject(new Error(errorData.message || '求购订单提交失败')))
                ]);
                return result;
            } catch (error) {
                throw error;
            }
        }
    }

    function registerHandler(type, handler) {
        if (!window.requestHandlers.has(type)) {
            window.requestHandlers.set(type, new Set());
        }
        window.requestHandlers.get(type).add(handler);
    }

    function unregisterHandler(type, handler) {
        const handlers = window.requestHandlers.get(type);
        if (handlers) {
            handlers.delete(handler);
            if (handlers.size === 0) {
                window.requestHandlers.delete(type);
            }
        }
    }

    function analyzeMarketPrice(marketData, neededQuantity) {
        const asks = marketData.orderBooks?.[0]?.asks;
        if (!asks?.length) throw new Error('没有可用的卖单');

        let cumulativeQuantity = 0;
        let targetPrice = 0;

        for (const ask of asks) {
            const availableFromThisOrder = Math.min(ask.quantity, neededQuantity - cumulativeQuantity);
            cumulativeQuantity += availableFromThisOrder;
            targetPrice = ask.price;
            if (cumulativeQuantity >= neededQuantity) break;
        }

        if (cumulativeQuantity < neededQuantity) {
            throw new Error(`市场库存不足。可用: ${cumulativeQuantity}, 需要: ${neededQuantity}`);
        }

        return targetPrice;
    }

    function analyzeBidPrice(marketData) {
        const bids = marketData.orderBooks?.[0]?.bids;
        if (!bids?.length) throw new Error('没有可用的买单');
        return bids[0].price;
    }

    // ==================== 简化的API客户端 ====================
    class PGE {
        constructor() {
            this.isReady = false;
            this.init();
        }

        async init() {
            while (!window.PGE?.checkAPI) {
                await utils.delay(1000);
            }
            this.isReady = true;
        }

        async waitForReady() {
            while (!this.isReady) await utils.delay(100);
        }

        async executeRequest(method, ...args) {
            await this.waitForReady();
            return await window.PGE[method](...args);
        }

        async checkAPI() { return this.executeRequest('checkAPI'); }
        async batchDirectPurchase(items, delay) { return this.executeRequest('batchDirectPurchase', items, delay); }
        async batchBidOrder(items, delay) { return this.executeRequest('batchBidOrder', items, delay); }
        hookMessage(messageType, callback) { return window.PGE.hookMessage(messageType, callback); }
    }

    // ==================== 设置面板标签管理器 ====================
    class SettingsTabManager {
        constructor() {
            this.processedContainers = new WeakSet();
            this.customTabsData = [
                {
                    id: 'custom-tab-scripts',
                    name: LANG.settings.tabName, // 使用统一的语言配置
                    content: this.createScriptsTabContent.bind(this)
                }
            ];
            this.versionInfo = {
                current: "3.6.7", // 当前版本
                latest: null,
                updateTime: null,
                changelog: null
            };
            this.init();
        }

        init() {
            this.setupObserver();
            this.setupStyles();
            this.loadVersionInfo();
        }

        // 加载版本信息
        async loadVersionInfo() {
            const urls = [
                'https://raw.githubusercontent.com/CYR2077/MWI-Production-Gathering-Enhanced/main/version.json',
                `https://hub.gitmirror.com/raw.githubusercontent.com/CYR2077/MWI-Production-Gathering-Enhanced/main/version.json?_=${Date.now()}`,
            ];

            for (const url of urls) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

                    const response = await fetch(url, {
                        cache: 'no-cache',
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    const data = await response.json();

                    this.versionInfo.latest = data.version;
                    this.versionInfo.updateTime = data.update_time;
                    this.versionInfo.changelog = data.changelog;

                    this.updateVersionDisplay();
                    return;
                } catch (error) {
                    console.warn(`Failed to load from ${url}:`, error);
                }
            }

            console.error('All version sources failed');
        }

        // 检查是否有可用更新
        hasUpdate(currentVersion, latestVersion) {
            if (!currentVersion || !latestVersion) return false;

            const currentParts = currentVersion.split('.').map(n => parseInt(n) || 0);
            const latestParts = latestVersion.split('.').map(n => parseInt(n) || 0);

            for (let i = 0; i < 3; i++) {
                const currentNum = currentParts[i] || 0;
                const latestNum = latestParts[i] || 0;

                if (latestNum > currentNum) return true;
                if (latestNum < currentNum) return false;
            }

            return false;
        }

        // 更新版本显示
        updateVersionDisplay() {
            const versionElement = document.querySelector('.version-info');
            const updateButton = document.querySelector('.check-update-btn');

            if (versionElement) {
                const isUpdateAvailable = this.hasUpdate(this.versionInfo.current, this.versionInfo.latest);

                versionElement.innerHTML = this.renderVersionInfoHTML();

                if (updateButton) {
                    if (isUpdateAvailable) {
                        updateButton.textContent = `${LANG.settings.newVersion}`;
                        updateButton.style.backgroundColor = 'rgba(76, 175, 80, 0.8)';
                    } else {
                        updateButton.textContent = `${LANG.settings.latestVersion}`;
                        updateButton.style.backgroundColor = 'rgba(158, 158, 158, 0.8)';
                    }
                }
            }
        }

        // 检查更新
        async checkForUpdates() {
            const updateButton = document.querySelector('.check-update-btn');
            if (updateButton) {
                updateButton.textContent = `${LANG.settings.checking}`;
                updateButton.disabled = true;
            }

            try {
                await this.loadVersionInfo();

                const isUpdateAvailable = this.hasUpdate(this.versionInfo.current, this.versionInfo.latest);

                // 更新版本信息显示，包括更新日志
                this.showVersionDetails(isUpdateAvailable);

                // 显示简单的状态提示
                if (isUpdateAvailable) {
                    this.showToast(`${LANG.settings.newFound}`, 'success');
                } else {
                    this.showToast(`${LANG.settings.alreadyLatest}`, 'success');
                }
            } catch (error) {
                this.showToast(`${LANG.settings.checkFailed}`, 'error');
            } finally {
                if (updateButton) {
                    updateButton.disabled = false;
                }
                this.updateVersionDisplay();
            }
        }

        // 显示版本详情和更新日志
        showVersionDetails(isUpdateAvailable) {
            const versionElement = document.querySelector('.version-info');
            if (!versionElement) return;
            versionElement.innerHTML = this.renderVersionInfoHTML();
        }

        // 设置观察器监听设置面板的变化
        setupObserver() {
            const observer = new MutationObserver((mutationsList) => {
                this.handleSettingsPanel(mutationsList);
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        // 添加自定义样式
        setupStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .custom-settings-tab {
                    transition: all 0.2s ease;
                }

                .custom-settings-tab:hover {
                    opacity: 0.8;
                }

                .custom-tab-content {
                    padding: 20px;
                    background: var(--card-background);
                    border-radius: 8px;
                    margin: 16px;
                    border: 1px solid var(--border-separator);
                }

                .custom-tab-option {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    padding: 12px;
                    background: var(--item-background);
                    border-radius: 6px;
                    border: 1px solid var(--item-border);
                    transition: background-color 0.2s;
                }

                .custom-tab-option:hover {
                    background-color: var(--item-background-hover);
                }

                .custom-tab-option label {
                    margin-left: 12px;
                    color: var(--color-text-dark-mode);
                    cursor: pointer;
                    flex: 1;
                    font-size: 14px;
                    line-height: 1.4;
                }

                .custom-tab-option input[type="checkbox"] {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }

                .custom-tab-actions {
                    margin-top: 24px;
                    padding-top: 16px;
                    border-top: 1px solid var(--border-separator);
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .custom-tab-button {
                    padding: 10px 16px;
                    background-color: rgba(33, 150, 243, 0.8);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.2s;
                    font-weight: 500;
                }

                .custom-tab-button:hover {
                    background-color: rgba(33, 150, 243, 0.9);
                }

                .custom-tab-button:disabled {
                    background-color: rgba(158, 158, 158, 0.5);
                    cursor: not-allowed;
                }

                .custom-tab-button.danger {
                    background-color: rgba(244, 67, 54, 0.8);
                }

                .custom-tab-button.danger:hover {
                    background-color: rgba(244, 67, 54, 0.9);
                }

                .check-update-btn {
                    background-color: rgba(76, 175, 80, 0.8) !important;
                }

                .check-update-btn:hover {
                    background-color: rgba(76, 175, 80, 0.9) !important;
                }

                .custom-tab-info {
                    margin-top: 20px;
                    padding: 16px;
                    background: var(--item-background-hover);
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 12px;
                    color: var(--color-text-dark-mode);
                    border: 1px solid var(--item-border);
                }

                .version-info {
                    margin-bottom: 12px;
                }
            `;
            document.head.appendChild(style);
        }

        // 处理设置面板的变化
        handleSettingsPanel(mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是设置面板的选项卡容器
                            const tabsContainer = node.querySelector?.('.SettingsPanel_tabsComponentContainer__Xb_5H .TabsComponent_tabsContainer__3BDUp') ||
                                (node.classList?.contains('TabsComponent_tabsContainer__3BDUp') ? node : null);

                            if (tabsContainer && !this.processedContainers.has(tabsContainer)) {
                                this.addCustomTabs(tabsContainer);
                            }
                        }
                    });
                }
            }
        }

        // 添加自定义选项卡
        addCustomTabs(tabsContainer) {
            this.processedContainers.add(tabsContainer);
            // 获取现有的选项卡容器和面板容器
            const tabsFlexContainer = tabsContainer.querySelector('.MuiTabs-flexContainer');
            const tabPanelsContainer = tabsContainer.closest('.SettingsPanel_tabsComponentContainer__Xb_5H')
                ?.querySelector('.TabsComponent_tabPanelsContainer__26mzo');

            if (!tabsFlexContainer || !tabPanelsContainer) return;

            // 为每个自定义选项卡创建按钮和内容
            this.customTabsData.forEach((tabData, index) => {
                this.createCustomTab(tabsFlexContainer, tabPanelsContainer, tabData, index);
            });

            // 同时监听按钮点击和面板变化
            this.bindNativeTabEvents(tabsFlexContainer, tabPanelsContainer);
            this.observeTabPanelChanges(tabPanelsContainer, tabsFlexContainer);
        }

        // 绑定原生标签事件
        bindNativeTabEvents(tabsFlexContainer, tabPanelsContainer) {
            // 使用事件委托监听所有标签点击
            tabsFlexContainer.addEventListener('click', (e) => {
                const clickedTab = e.target.closest('.MuiTab-root');

                // 如果点击的是原生标签（非自定义标签）
                if (clickedTab && !clickedTab.classList.contains('custom-settings-tab')) {
                    // 立即隐藏自定义面板和取消选中状态
                    this.hideAllCustomTabPanels(tabPanelsContainer);
                    this.unselectAllCustomTabs(tabsFlexContainer);
                }
            }, true); // 使用捕获阶段确保在原生处理器之前执行
        }

        // 观察标签面板变化（作为补充检测）
        observeTabPanelChanges(tabPanelsContainer, tabsFlexContainer) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const target = mutation.target;

                        // 如果是原生面板变为可见状态
                        if (target.classList.contains('TabPanel_tabPanel__tXMJF') &&
                            !target.classList.contains('TabPanel_hidden__26UM3') &&
                            !target.id.includes('custom-tab-')) {

                            // 确保自定义面板被隐藏
                            this.hideAllCustomTabPanels(tabPanelsContainer);
                            this.unselectAllCustomTabs(tabsFlexContainer);
                        }
                    }
                });
            });

            // 观察所有面板的class变化
            tabPanelsContainer.querySelectorAll('.TabPanel_tabPanel__tXMJF').forEach(panel => {
                observer.observe(panel, { attributes: true, attributeFilter: ['class'] });
            });

            // 也观察容器本身，以防新增面板
            observer.observe(tabPanelsContainer, { childList: true, subtree: true });
        }

        // 隐藏所有自定义标签面板
        hideAllCustomTabPanels(tabPanelsContainer) {
            this.customTabsData.forEach(tabData => {
                const panel = document.getElementById(`${tabData.id}-panel`);
                if (panel) {
                    panel.classList.add('TabPanel_hidden__26UM3');
                }
            });
        }

        // 取消所有自定义标签的选中状态
        unselectAllCustomTabs(tabsFlexContainer) {
            this.customTabsData.forEach(tabData => {
                const tab = document.getElementById(tabData.id);
                if (tab) {
                    tab.classList.remove('Mui-selected');
                    tab.setAttribute('aria-selected', 'false');
                }
            });
        }

        // 创建单个自定义选项卡
        createCustomTab(tabsFlexContainer, tabPanelsContainer, tabData, index) {
            // 检查是否已存在
            if (document.getElementById(tabData.id)) return;

            // 创建选项卡按钮
            const tabButton = this.createTabButton(tabData);

            // 创建选项卡面板
            const tabPanel = this.createTabPanel(tabData);

            // 添加到容器中
            tabsFlexContainer.appendChild(tabButton);
            tabPanelsContainer.appendChild(tabPanel);

            // 绑定点击事件
            this.bindTabEvents(tabButton, tabPanel, tabsFlexContainer, tabPanelsContainer);
        }

        // 创建选项卡按钮
        createTabButton(tabData) {
            const button = document.createElement('button');
            button.id = tabData.id;
            button.className = 'MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-1q2h7u5 custom-settings-tab';
            button.setAttribute('tabindex', '-1');
            button.setAttribute('type', 'button');
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', 'false');

            button.innerHTML = `
                <span class="MuiBadge-root TabsComponent_badge__1Du26 css-1rzb3uu">
                    ${LANG.settings.tabName}
                    <span class="MuiBadge-badge MuiBadge-standard MuiBadge-invisible MuiBadge-anchorOriginTopRight MuiBadge-anchorOriginTopRightRectangular MuiBadge-overlapRectangular css-vwo4eg"></span>
                </span>
                <span class="MuiTouchRipple-root css-w0pj6f"></span>
            `;

            return button;
        }

        // 创建选项卡面板
        createTabPanel(tabData) {
            const panel = document.createElement('div');
            panel.id = `${tabData.id}-panel`;
            panel.className = 'TabPanel_tabPanel__tXMJF TabPanel_hidden__26UM3';

            // 创建面板内容
            const content = tabData.content();
            panel.appendChild(content);

            return panel;
        }

        // 绑定选项卡事件
        bindTabEvents(tabButton, tabPanel, tabsFlexContainer, tabPanelsContainer) {
            tabButton.addEventListener('click', () => {
                // 隐藏所有选项卡面板
                tabPanelsContainer.querySelectorAll('.TabPanel_tabPanel__tXMJF').forEach(panel => {
                    panel.classList.add('TabPanel_hidden__26UM3');
                });

                // 取消所有选项卡的选中状态
                tabsFlexContainer.querySelectorAll('.MuiTab-root').forEach(tab => {
                    tab.classList.remove('Mui-selected');
                    tab.setAttribute('aria-selected', 'false');
                });

                // 显示当前选项卡面板
                tabPanel.classList.remove('TabPanel_hidden__26UM3');

                // 设置当前选项卡为选中状态
                tabButton.classList.add('Mui-selected');
                tabButton.setAttribute('aria-selected', 'true');

                // 更新指示器位置
                this.updateTabIndicator(tabButton, tabsFlexContainer);
            });
        }

        // 更新选项卡指示器位置
        updateTabIndicator(selectedTab, tabsContainer) {
            const indicator = tabsContainer.parentNode.querySelector('.MuiTabs-indicator');
            if (!indicator) return;

            const rect = selectedTab.getBoundingClientRect();
            const containerRect = tabsContainer.getBoundingClientRect();

            indicator.style.left = `${rect.left - containerRect.left}px`;
            indicator.style.width = `${rect.width}px`;
        }

        renderVersionInfoHTML() {
            const isUpdateAvailable = this.hasUpdate(this.versionInfo.current, this.versionInfo.latest);

            const statusIcon = isUpdateAvailable
                ? `<span style="color: #f44336;">${LANG.settings.hasUpdate}</span>`
                : `<span style="color: #4caf50;">${LANG.settings.isLatest}</span>`;

            return `
                <div><strong>${LANG.settings.version}:</strong> ${this.versionInfo.current}</div>
                ${this.versionInfo.latest ? `
                    <div><strong>${LANG.settings.latestLabel}:</strong> ${this.versionInfo.latest} ${statusIcon}</div>
                    <div><strong>${LANG.settings.updateTime}:</strong> ${this.versionInfo.updateTime}</div>
                    ${this.versionInfo.changelog ? `<div><strong>${LANG.settings.changelog}:</strong> ${this.versionInfo.changelog}</div>` : ''}
                ` : `<div>${LANG.settings.loadingInfo}</div>`}
                    <div>
                        <strong>
                            <a href="https://github.com/CYR2077/MWI-Production-Gathering-Enhanced/releases/latest/download/script.user.js"
                            target="_blank"
                            style="color: #2196F3; text-decoration: none;"
                            onmouseover="this.style.textDecoration='underline'"
                            onmouseout="this.style.textDecoration='none'">
                            更新地址 Update Link
                            </a>
                        </strong>
                    </div>
                    <div>
                        <strong>
                            <a href="https://github.com/CYR2077/MWI-Production-Gathering-Enhanced/releases/download/release-v3.6.7/script.user.js"
                            target="_blank"
                            style="color: #2196F3; text-decoration: none;"
                            onmouseover="this.style.textDecoration='underline'"
                            onmouseout="this.style.textDecoration='none'">
                            镜像地址(不用翻墙) Mirror Link
                            </a>
                        </strong>
                    </div>
            `;
        }


        // 创建脚本设置选项卡内容
        createScriptsTabContent() {
            const container = document.createElement('div');
            container.className = 'custom-tab-content';

            container.innerHTML = `
                <div class="custom-tab-option">
                    <input type="checkbox" id="considerArtisanTea" ${window.PGE_CONFIG?.considerArtisanTea ? 'checked' : ''}>
                    <label for="considerArtisanTea">
                        <strong>🍵 ${LANG.settings.considerArtisanTea.title}</strong><br>
                        <span style="font-size: 12px; opacity: 0.8;">${LANG.settings.considerArtisanTea.description}</span>
                    </label>
                </div>

                <div class="custom-tab-option">
                    <input type="checkbox" id="considerRareLoot" ${window.PGE_CONFIG?.considerRareLoot ? 'checked' : ''}>
                    <label for="considerRareLoot">
                        <strong>💎 ${LANG.settings.considerRareLoot.title}</strong><br>
                        <span style="font-size: 12px; opacity: 0.8;">${LANG.settings.considerRareLoot.description}</span>
                    </label>
                </div>

                <div class="custom-tab-option">
                    <input type="checkbox" id="autoClaimMarketListings" ${window.PGE_CONFIG?.autoClaimMarketListings ? 'checked' : ''}>
                    <label for="autoClaimMarketListings">
                        <strong>🎁 ${LANG.settings.autoClaimMarketListings.title}</strong><br>
                        <span style="font-size: 12px; opacity: 0.8;">${LANG.settings.autoClaimMarketListings.description}</span>
                    </label>
                </div>

                <div class="custom-tab-option">
                    <input type="checkbox" id="quickSell" ${window.PGE_CONFIG?.quickSell ? 'checked' : ''}>
                    <label for="quickSell">
                        <strong>⚡ ${LANG.settings.quickSell.title}</strong><br>
                        <span style="font-size: 12px; opacity: 0.8;">${LANG.settings.quickSell.description}</span>
                    </label>
                </div>

                <div class="custom-tab-option">
                    <input type="checkbox" id="quickPurchase" ${window.PGE_CONFIG?.quickPurchase ? 'checked' : ''}>
                    <label for="quickPurchase">
                        <strong>🛒 ${LANG.settings.quickPurchase.title}</strong><br>
                        <span style="font-size: 12px; opacity: 0.8;">${LANG.settings.quickPurchase.description}</span>
                    </label>
                </div>

                <div class="custom-tab-option">
                    <input type="checkbox" id="universalProfit" ${window.PGE_CONFIG?.universalProfit ? 'checked' : ''}>
                    <label for="universalProfit">
                        <strong>📊 ${LANG.settings.universalProfit.title}</strong><br>
                        <span style="font-size: 12px; opacity: 0.8;">${LANG.settings.universalProfit.description}</span>
                    </label>
                </div>

                <div class="custom-tab-option">
                    <input type="checkbox" id="alchemyProfit" ${window.PGE_CONFIG?.alchemyProfit ? 'checked' : ''}>
                    <label for="alchemyProfit">
                        <strong>🧪 ${LANG.settings.alchemyProfit.title}</strong><br>
                        <span style="font-size: 12px; opacity: 0.8;">${LANG.settings.alchemyProfit.description}</span>
                    </label>
                </div>

                <div class="custom-tab-option">
                    <input type="checkbox" id="gatheringEnhanced" ${window.PGE_CONFIG?.gatheringEnhanced ? 'checked' : ''}>
                    <label for="gatheringEnhanced">
                        <strong>🎯 ${LANG.settings.gatheringEnhanced.title}</strong><br>
                        <span style="font-size: 12px; opacity: 0.8;">${LANG.settings.gatheringEnhanced.description}</span>
                    </label>
                </div>

                <div class="custom-tab-option">
                    <input type="checkbox" id="characterSwitcher" ${window.PGE_CONFIG?.characterSwitcher ? 'checked' : ''}>
                    <label for="characterSwitcher">
                        <strong>👤 ${LANG.settings.characterSwitcher.title}</strong><br>
                        <span style="font-size: 12px; opacity: 0.8;">${LANG.settings.characterSwitcher.description}</span>
                    </label>
                </div>

                <div class="custom-tab-option">
                    <input type="checkbox" id="itemValueCalculator" ${window.PGE_CONFIG?.itemValueCalculator ? 'checked' : ''}>
                    <label for="itemValueCalculator">
                        <strong>💰 ${LANG.settings.itemValueCalculator.title}</strong><br>
                        <span style="font-size: 12px; opacity: 0.8;">${LANG.settings.itemValueCalculator.description}</span>
                    </label>
                </div>

                <div class="custom-tab-actions">
                    <button class="custom-tab-button" onclick="window.settingsTabManager.resetSettings()">
                        ${LANG.settings.resetToDefault}
                    </button>
                    <button class="custom-tab-button check-update-btn" onclick="window.settingsTabManager.checkForUpdates()">
                        ${LANG.settings.checkUpdate}
                    </button>
                    <button class="custom-tab-button danger" onclick="window.settingsTabManager.reloadPage()">
                        ${LANG.settings.reloadPage}
                    </button>
                </div>

                <div class="custom-tab-info">
                    <div class="version-info">${this.renderVersionInfoHTML()}</div>
                </div>
            `;

            // 绑定设置变更事件
            container.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    this.updateConfig(e.target.id, e.target.checked);

                    // 自动保存设置
                    if (window.saveConfig && window.PGE_CONFIG) {
                        window.saveConfig(window.PGE_CONFIG);
                    }

                    // 对于相关设置，立即更新计算器
                    if (e.target.id === 'considerRareLoot') {
                        if (window.MWIModules?.alchemyCalculator) {
                            window.MWIModules.alchemyCalculator.updateProfitDisplay();
                        }
                        if (window.MWIModules?.universalCalculator) {
                            window.MWIModules.universalCalculator.updateProfitDisplay();
                        }
                    }

                    // 对于自动收集市场订单，立即生效
                    if (e.target.id === 'autoClaimMarketListings') {
                        const manager = window.MWIModules?.autoClaimMarketListings;
                        if (manager) {
                            manager.updateConfig(e.target.checked);
                        }
                    }
                }
            });

            return container;
        }

        // 更新配置
        updateConfig(key, value) {
            if (window.PGE_CONFIG) {
                window.PGE_CONFIG[key] = value;

                if (key === 'quickSell') {
                    const manager = window.MWIModules?.quickSell;
                    if (value && !manager) {
                        // 启用功能
                        window.MWIModules.quickSell = new QuickSellManager();
                    } else if (!value && manager) {
                        // 禁用功能
                        manager.disable();
                    } else if (manager) {
                        // 更新现有实例的状态
                        if (value) {
                            manager.enable();
                        } else {
                            manager.disable();
                        }
                    }
                }

                // 对于自动收集市场订单,立即生效
                if (key === 'autoClaimMarketListings') {
                    const manager = window.MWIModules.autoClaimMarketListings;
                    if (value && !manager) {
                        // 启用功能
                        window.MWIModules.autoClaimMarketListings = new AutoClaimMarketListingsManager();
                    } else if (!value && manager) {
                        // 禁用功能
                        manager.cleanup();
                        window.MWIModules.autoClaimMarketListings = null;
                    } else if (manager) {
                        // 更新现有实例的配置
                        manager.updateConfig(value);
                    }
                }
            }
        }

        // 重置设置
        resetSettings() {
            // 重置为默认配置
            const defaultConfig = {
                quickPurchase: true,
                universalProfit: true,
                alchemyProfit: true,
                gatheringEnhanced: true,
                characterSwitcher: true,
                considerArtisanTea: true,
                autoClaimMarketListings: false,
                considerRareLoot: false,
                itemValueCalculator: true,
                quickSell: true,
            };

            window.PGE_CONFIG = { ...defaultConfig };

            // 自动保存重置后的配置
            if (window.saveConfig) {
                window.saveConfig(window.PGE_CONFIG);
            }

            // 更新UI
            Object.keys(defaultConfig).forEach(key => {
                const checkbox = document.getElementById(key);
                if (checkbox) {
                    checkbox.checked = defaultConfig[key];
                }
            });

            this.showToast(LANG.settings.settingsReset, 'success');
        }

        // 重新加载页面
        reloadPage() {
            window.location.reload(true);
        }

        // 显示提示
        showToast(message, type) {
            if (window.MWIModules?.toast) {
                window.MWIModules.toast.show(message, type);
            } else {
                alert(message);
            }
        }
    }

    // ==================== 初始化设置面板标签管理器 ====================
    function initSettingsTabManager() {
        if (!window.settingsTabManager) {
            window.settingsTabManager = new SettingsTabManager();
        }
    }

    // ==================== 自动收集市场订单管理器 ====================
    class AutoClaimMarketListingsManager {
        constructor() {
            this.lastExecutionTime = 0;
            this.cooldownTime = 3000; // 3秒冷却时间
            this.observer = null;
            this.isEnabled = window.PGE_CONFIG?.autoClaimMarketListings ?? true;
            this.init();
        }

        init() {
            if (!this.isEnabled) return;
            this.startObserving();
        }

        enable() {
            this.isEnabled = true;
            this.startObserving();
        }

        disable() {
            this.isEnabled = false;
            this.stopObserving();
        }

        startObserving() {
            if (this.observer || !this.isEnabled) return;

            this.observer = new MutationObserver(() => {
                this.checkAndExecute();
            });

            // 开始监控
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 立即检查一次
            this.checkAndExecute();
        }

        stopObserving() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }

        checkAndExecute() {
            if (!this.isEnabled) return;

            // 获取所有导航栏元素
            const navElements = document.querySelectorAll('.NavigationBar_nav__3uuUl');

            if (navElements.length > 1) {
                const targetElement = navElements[1].querySelector('.NavigationBar_badges__3D2s5');
                if (targetElement) {
                    this.executeClaimAction();
                }
            }
        }

        executeClaimAction() {
            const currentTime = Date.now();

            // 检查冷却时间
            if (currentTime - this.lastExecutionTime < this.cooldownTime) {
                return false;
            }

            try {
                if (window.PGE?.core?.handleClaimAllMarketListings) {
                    window.PGE.core.handleClaimAllMarketListings();
                    this.lastExecutionTime = currentTime;

                    return true;
                }
            } catch (error) {
                console.error('[AutoClaimMarketListings] 执行出错:', error);
            }

            return false;
        }

        // 更新配置
        updateConfig(enabled) {
            const wasEnabled = this.isEnabled;
            this.isEnabled = enabled;

            if (enabled && !wasEnabled) {
                this.startObserving();
            } else if (!enabled && wasEnabled) {
                this.stopObserving();
            }
        }

        // 清理资源
        cleanup() {
            this.stopObserving();
        }
    }

    // ==================== 角色快速切换 ====================
    class CharacterSwitcher {
        constructor(options = {}) {
            this.config = { ...CONFIG.CHARACTER_SWITCHER, ...options };
            this.charactersCache = null;
            this.rawCharactersData = null;
            this.isLoadingCharacters = false;
            this.observer = null;
            this.init();
        }

        init() {
            this.setupEventListeners();
            this.startObserver();
        }

        getCurrentLanguage() {
            return (navigator.language || 'en').startsWith('zh') ? 'zh' : 'en';
        }

        getText(key) {
            return LANG[key] || key;
        }

        getTimeAgoText(key) {
            return LANG.timeAgo?.[key] || key;
        }

        getCurrentCharacterId() {
            return new URLSearchParams(window.location.search).get('characterId');
        }

        getApiUrl() {
            return window.location.hostname.includes('test')
                ? 'https://api-test.milkywayidle.com/v1/characters'
                : 'https://api.milkywayidle.com/v1/characters';
        }

        getTimeAgo(lastOfflineTime) {
            if (!lastOfflineTime) return this.getTimeAgoText('justNow');

            const diffMs = Date.now() - new Date(lastOfflineTime);
            const diffMinutes = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMinutes < 1) return this.getTimeAgoText('justNow');
            if (diffMinutes < 60) return `${diffMinutes}${this.getTimeAgoText('minutesAgo')}`;
            if (diffHours < 24) {
                const remainingMinutes = diffMinutes % 60;
                return remainingMinutes > 0 ?
                    `${diffHours}${this.getTimeAgoText('hoursAgo')}${remainingMinutes}${this.getTimeAgoText('minutesAgo')}` :
                    `${diffHours}${this.getTimeAgoText('hoursAgo')}`;
            }
            return `${diffDays}${this.getTimeAgoText('daysAgo')}`;
        }

        async fetchCharactersFromAPI() {
            const response = await fetch(this.getApiUrl(), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (!response.ok) throw new Error(`API请求失败: ${response.status}`);
            const data = await response.json();
            return data.characters || [];
        }

        processCharacters(charactersData) {
            return charactersData.map(character => {
                if (!character.id || !character.name) return null;

                const mode = character.gameMode === 'standard' ? this.getText('standard') :
                    character.gameMode === 'ironcow' ? this.getText('ironcow') : '';
                const displayText = mode ? `${mode}(${character.name})` : character.name;

                return {
                    id: character.id,
                    name: character.name,
                    mode, gameMode: character.gameMode,
                    link: `${window.location.origin}/game?characterId=${character.id}`,
                    displayText,
                    isOnline: character.isOnline,
                    lastOfflineTime: character.lastOfflineTime,
                    lastOnlineText: this.getTimeAgo(character.lastOfflineTime)
                };
            }).filter(Boolean);
        }

        refreshTimeDisplay(characters) {
            return characters.map(character => ({
                ...character,
                lastOnlineText: this.getTimeAgo(character.lastOfflineTime)
            }));
        }

        async getCharacters(forceRefreshTime = false) {
            if (this.isLoadingCharacters) {
                while (this.isLoadingCharacters) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                if (forceRefreshTime && this.rawCharactersData) {
                    return this.refreshTimeDisplay(this.processCharacters(this.rawCharactersData));
                }
                return this.charactersCache || [];
            }

            if (this.charactersCache && forceRefreshTime && this.rawCharactersData) {
                return this.refreshTimeDisplay(this.processCharacters(this.rawCharactersData));
            }

            if (this.charactersCache) return this.charactersCache;

            this.isLoadingCharacters = true;
            try {
                const charactersData = await this.fetchCharactersFromAPI();
                this.rawCharactersData = charactersData;
                this.charactersCache = this.processCharacters(charactersData);
                return this.charactersCache;
            } catch (error) {
                console.log('获取角色数据失败:', error);
                return [];
            } finally {
                this.isLoadingCharacters = false;
            }
        }

        async preloadCharacters() {
            try {
                await this.getCharacters();
            } catch (error) {
                console.log('预加载角色数据失败:', error);
            }
        }

        clearCache() {
            this.charactersCache = null;
            this.rawCharactersData = null;
        }

        async forceRefresh() {
            this.clearCache();
            return await this.getCharacters();
        }

        addAvatarClickHandler() {
            const avatar = document.querySelector(this.config.avatarSelector);
            if (!avatar) return;

            if (avatar.hasAttribute('data-character-switch-added')) return;

            avatar.setAttribute('data-character-switch-added', 'true');
            Object.assign(avatar.style, { cursor: 'pointer' });
            avatar.title = 'Click to switch character';

            if (!this.charactersCache && !this.isLoadingCharacters) {
                this.preloadCharacters();
            }

            avatar.addEventListener('mouseenter', () => {
                Object.assign(avatar.style, {
                    backgroundColor: 'var(--item-background-hover)',
                    borderColor: 'var(--item-border-hover)',
                    boxShadow: '0 0 8px rgba(152, 167, 233, 0.5)',
                    transition: 'all 0.2s ease'
                });
            });

            avatar.addEventListener('mouseleave', () => {
                Object.assign(avatar.style, { backgroundColor: '', borderColor: '', boxShadow: '' });
            });

            avatar.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        toggleDropdown() {
            const existing = document.querySelector('#character-switch-dropdown');
            if (existing) {
                if (existing.style.opacity === '0') return;
                this.closeDropdown();
            } else {
                this.createDropdown();
            }
        }

        closeDropdown() {
            const existing = document.querySelector('#character-switch-dropdown');
            if (existing) {
                existing.style.opacity = '0';
                existing.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    if (existing.parentNode) existing.remove();
                }, this.config.animationDuration);
            }
        }

        async createDropdown() {
            const avatar = document.querySelector(this.config.avatarSelector);
            if (!avatar) return;

            const dropdown = document.createElement('div');
            dropdown.id = 'character-switch-dropdown';
            Object.assign(dropdown.style, {
                position: 'absolute', top: '100%', right: '0',
                backgroundColor: 'rgba(30, 30, 50, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px', padding: '8px',
                minWidth: this.config.dropdownMinWidth,
                maxWidth: this.config.dropdownMaxWidth,
                maxHeight: this.config.dropdownMaxHeight,
                overflowY: 'auto', backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                zIndex: '9999', marginTop: '5px',
                opacity: '0', transform: 'translateY(-10px)',
                transition: `opacity ${this.config.animationDuration}ms ease, transform ${this.config.animationDuration}ms ease`
            });

            const title = document.createElement('div');
            title.textContent = this.getText('switchCharacter');
            Object.assign(title.style, {
                color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', fontWeight: 'bold',
                padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '8px'
            });
            dropdown.appendChild(title);

            const characterInfo = document.querySelector(this.config.characterInfoSelector);
            if (characterInfo) {
                characterInfo.style.position = 'relative';
                characterInfo.appendChild(dropdown);
            }

            requestAnimationFrame(() => {
                dropdown.style.opacity = '1';
                dropdown.style.transform = 'translateY(0)';
            });

            if (!this.charactersCache) {
                const loadingMsg = document.createElement('div');
                loadingMsg.className = 'loading-indicator';
                loadingMsg.textContent = 'Loading...';
                Object.assign(loadingMsg.style, {
                    color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px',
                    padding: '8px 12px', textAlign: 'center', fontStyle: 'italic'
                });
                dropdown.appendChild(loadingMsg);
            }

            try {
                const characters = await this.getCharacters(true);
                const loadingMsg = dropdown.querySelector('.loading-indicator');
                if (loadingMsg) loadingMsg.remove();

                if (characters.length === 0) {
                    const noDataMsg = document.createElement('div');
                    noDataMsg.textContent = this.getText('noCharacterData');
                    Object.assign(noDataMsg.style, {
                        color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px',
                        padding: '8px 12px', textAlign: 'center', fontStyle: 'italic'
                    });
                    dropdown.appendChild(noDataMsg);
                    return;
                }

                this.renderCharacterButtons(dropdown, characters);
            } catch (error) {
                const loadingMsg = dropdown.querySelector('.loading-indicator');
                if (loadingMsg) loadingMsg.remove();

                const errorMsg = document.createElement('div');
                errorMsg.textContent = 'Failed to load character data';
                Object.assign(errorMsg.style, {
                    color: 'rgba(255, 100, 100, 0.8)', fontSize: '12px',
                    padding: '8px 12px', textAlign: 'center', fontStyle: 'italic'
                });
                dropdown.appendChild(errorMsg);
            }

            this.setupDropdownCloseHandler(dropdown, avatar);
        }

        renderCharacterButtons(dropdown, characters) {
            const buttonStyle = {
                padding: '8px 12px', backgroundColor: 'rgba(48, 63, 159, 0.2)',
                color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px', fontSize: '13px', cursor: 'pointer',
                display: 'block', width: '100%', textDecoration: 'none',
                marginBottom: '4px', transition: 'all 0.15s ease', textAlign: 'left'
            };

            const hoverStyle = {
                backgroundColor: 'rgba(26, 35, 126, 0.4)',
                borderColor: 'rgba(255, 255, 255, 0.3)'
            };

            const currentCharacterId = this.getCurrentCharacterId();

            characters.forEach(character => {
                if (!character) return;

                const isCurrentCharacter = currentCharacterId === character.id.toString();
                const characterButton = document.createElement('a');

                Object.assign(characterButton.style, buttonStyle);

                if (isCurrentCharacter) {
                    characterButton.href = 'javascript:void(0)';
                    characterButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.PGE.core.handleViewProfile(character.name);
                        this.closeDropdown();
                    });
                } else {
                    characterButton.href = character.link;
                }

                const statusText = isCurrentCharacter ? this.getText('current') : this.getText('switch');
                const statusColor = isCurrentCharacter ? '#2196F3' : '#4CAF50';

                const onlineStatus = character.isOnline ?
                    `<span style="color: #4CAF50;">●</span> Online` :
                    `<span style="color: #f44336;">●</span> ${this.getText('lastOnline')}: ${character.lastOnlineText}`;

                characterButton.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <div style="font-weight: ${isCurrentCharacter ? 'bold' : 'normal'};">
                            ${character.displayText || character.name || 'Unknown'}
                        </div>
                        <div style="font-size: 10px; opacity: 0.6; margin-top: 2px;">
                            ${onlineStatus}
                        </div>
                    </div>
                    <div style="font-size: 11px; color: ${statusColor};">
                        ${statusText}
                    </div>
                </div>
            `;

                if (isCurrentCharacter) {
                    Object.assign(characterButton.style, {
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                        borderColor: 'rgba(33, 150, 243, 0.4)'
                    });
                }

                if (!isCurrentCharacter) {
                    characterButton.addEventListener('mouseover', () => Object.assign(characterButton.style, hoverStyle));
                    characterButton.addEventListener('mouseout', () => Object.assign(characterButton.style, buttonStyle));
                } else {
                    // 当前角色的悬停效果（稍微不同的颜色）
                    characterButton.addEventListener('mouseover', () => {
                        characterButton.style.backgroundColor = 'rgba(33, 150, 243, 0.3)';
                        characterButton.style.borderColor = 'rgba(33, 150, 243, 0.6)';
                    });
                    characterButton.addEventListener('mouseout', () => {
                        characterButton.style.backgroundColor = 'rgba(33, 150, 243, 0.2)';
                        characterButton.style.borderColor = 'rgba(33, 150, 243, 0.4)';
                    });
                }

                dropdown.appendChild(characterButton);
            });
        }

        setupDropdownCloseHandler(dropdown, avatar) {
            const closeHandler = (e) => {
                if (!dropdown.contains(e.target) && !avatar.contains(e.target)) {
                    this.closeDropdown();
                    document.removeEventListener('click', closeHandler);
                }
            };

            setTimeout(() => {
                document.addEventListener('click', closeHandler);
            }, 100);
        }

        refresh() {
            try {
                this.addAvatarClickHandler();
            } catch (error) {
                console.log('刷新函数出错:', error);
            }
        }

        setupEventListeners() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.refresh());
            } else {
                this.refresh();
            }
        }

        startObserver() {
            const config = { attributes: true, childList: true, subtree: true };
            this.observer = new MutationObserver(() => this.refresh());
            this.observer.observe(document, config);
        }
    }

    // ==================== 添加稀有掉落物价值计算工具函数 ====================
    const rareDropsCalculator = {
        // 计算稀有掉落物价值
        calculateRareDropValue(outputItemHrid, orderBooks) {
            if (!window.PGE_CONFIG.considerRareLoot) return 0;

            const lootDrops = lootData[outputItemHrid];
            if (!lootDrops) return 0;

            let totalValue = 0;

            for (const [itemHrid, quantity] of Object.entries(lootDrops)) {
                let price = 0;

                if (itemHrid === '/items/coin') {
                    price = 1; // 金币价格固定为1
                } else if (itemHrid === '/items/cowbell') {
                    // 牛铃价格为bag_of_10_cowbells的十分之一
                    const bagOrderBooks = orderBooks['/items/bag_of_10_cowbells'];
                    if (bagOrderBooks && bagOrderBooks[0]) {
                        const bagPrice = bagOrderBooks[0].asks?.[0]?.price || 0;
                        price = bagPrice / 10;
                    }
                } else {
                    // 其他物品从市场数据获取价格
                    const itemOrderBooks = orderBooks[itemHrid];
                    if (itemOrderBooks && itemOrderBooks[0]) {
                        price = itemOrderBooks[0].asks?.[0]?.price || 0;
                    }
                }

                let itemValue = price * quantity;

                // 除了coin外都要考虑税费
                if (itemHrid !== '/items/coin') {
                    itemValue *= 0.98;
                }

                totalValue += itemValue;
            }

            return totalValue;
        },

        // 获取稀有掉落物相关的物品列表
        getRareDropItems(outputItemHrid) {
            const lootDrops = lootData[outputItemHrid];
            if (!lootDrops) return [];

            return Object.keys(lootDrops).filter(itemHrid =>
                itemHrid !== '/items/coin' && itemHrid !== '/items/cowbell'
            );
        }
    };

    // ==================== 基础利润计算器类 ====================
    class BaseProfitCalculator {
        constructor(cacheExpiry = CONFIG.UNIVERSAL_CACHE_EXPIRY) {
            this.api = window.MWIModules.api;
            this.marketData = {};
            this.marketTimestamps = {};
            this.requestQueue = [];
            this.isProcessing = false;
            this.initialized = false;
            this.updateTimeout = null;
            this.lastState = '';
            this.cacheExpiry = cacheExpiry;
            this.init();
        }

        async init() {
            while (!window.PGE?.core || !this.api?.isReady) {
                await utils.delay(100);
            }
            try {
                window.PGE.hookMessage("market_item_order_books_updated", obj => {
                    const { itemHrid, orderBooks } = obj.marketItemOrderBooks;
                    this.marketData[itemHrid] = orderBooks;
                    this.marketTimestamps[itemHrid] = Date.now();
                });
                this.initialized = true;
            } catch (error) {
                console.error('[ProfitCalculator] 初始化失败:', error);
            }
            setInterval(() => this.cleanCache(), 60000);
        }

        cleanCache() {
            const now = Date.now();
            Object.keys(this.marketTimestamps).forEach(item => {
                if (now - this.marketTimestamps[item] > this.cacheExpiry) {
                    delete this.marketData[item];
                    delete this.marketTimestamps[item];
                }
            });
        }

        async getMarketData(itemHrid) {
            return new Promise(resolve => {
                if (this.marketData[itemHrid] && !utils.isCacheExpired(itemHrid, this.marketTimestamps, this.cacheExpiry)) {
                    return resolve(this.marketData[itemHrid]);
                }
                if (!this.initialized || !window.PGE?.core) {
                    return resolve(null);
                }
                this.requestQueue.push({ itemHrid, resolve });
                this.processQueue();
            });
        }

        async processQueue() {
            if (this.isProcessing || !this.requestQueue.length || !this.initialized || !window.PGE?.core) return;
            this.isProcessing = true;
            while (this.requestQueue.length > 0) {
                const batch = this.requestQueue.splice(0, 1);
                await Promise.all(batch.map(async ({ itemHrid, resolve }) => {
                    if (this.marketData[itemHrid] && !utils.isCacheExpired(itemHrid, this.marketTimestamps, this.cacheExpiry)) {
                        return resolve(this.marketData[itemHrid]);
                    }
                    try {
                        window.PGE.core.handleGetMarketItemOrderBooks(itemHrid);
                    } catch (error) {
                        console.error('API调用失败:', error);
                    }
                    const start = Date.now();
                    await new Promise(waitResolve => {
                        const check = setInterval(() => {
                            if (this.marketData[itemHrid] || Date.now() - start > 5000) {
                                clearInterval(check);
                                resolve(this.marketData[itemHrid] || null);
                                waitResolve();
                            }
                        }, 50);
                    });
                }));
                if (this.requestQueue.length > 0) await utils.delay(300);
            }
            this.isProcessing = false;
        }

        debounceUpdate(callback) {
            clearTimeout(this.updateTimeout);
            this.updateTimeout = setTimeout(callback, 200);
        }

        async updateProfitDisplay() {
            const pessimisticEl = document.getElementById(this.getPessimisticId());
            const optimisticEl = document.getElementById(this.getOptimisticId());
            if (!pessimisticEl || !optimisticEl) return;

            if (!this.initialized || !window.PGE?.core) {
                pessimisticEl.textContent = optimisticEl.textContent = this.getWaitingText();
                pessimisticEl.style.color = optimisticEl.style.color = CONFIG.COLORS.warning;
                return;
            }

            try {
                const data = await this.getActionData();
                if (!data) {
                    pessimisticEl.textContent = optimisticEl.textContent = LANG.noData;
                    pessimisticEl.style.color = optimisticEl.style.color = CONFIG.COLORS.neutral;
                    return;
                }

                [false, true].forEach((useOptimistic, index) => {
                    const profit = this.calculateProfit(data, useOptimistic);
                    const el = index ? optimisticEl : pessimisticEl;
                    if (profit === null) {
                        el.textContent = LANG.noData;
                        el.style.color = CONFIG.COLORS.neutral;
                    } else {
                        el.textContent = utils.formatProfit(profit);
                        el.style.color = profit >= 0 ? CONFIG.COLORS.profit : CONFIG.COLORS.loss;
                    }
                });
            } catch (error) {
                console.error('[ProfitCalculator] 计算出错:', error);
                pessimisticEl.textContent = optimisticEl.textContent = LANG.error;
                pessimisticEl.style.color = optimisticEl.style.color = CONFIG.COLORS.warning;
            }
        }

        createProfitDisplay() {
            const container = document.createElement('div');
            container.id = this.getContainerId();
            container.style.cssText = `
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        font-family: Roboto, Helvetica, Arial, sans-serif;
                        font-size: 14px;
                        line-height: 20px;
                        letter-spacing: 0.00938em;
                        color: var(--color-text-dark-mode);
                        font-weight: 400;
                    `;
            container.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 8px">
                            <span style="color: ${CONFIG.COLORS.space300}">${LANG.askBuyBidSell}</span>
                            <span id="${this.getPessimisticId()}" style="font-weight: 500">${this.initialized ? LANG.loadingMarketData : this.getWaitingText()}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px">
                            <span style="color: ${CONFIG.COLORS.space300}">${LANG.bidBuyAskSell}</span>
                            <span id="${this.getOptimisticId()}" style="font-weight: 500">${this.initialized ? LANG.loadingMarketData : this.getWaitingText()}</span>
                        </div>
                    `;
            return container;
        }

        checkForUpdates() {
            const currentState = this.getStateFingerprint();
            if (currentState !== this.lastState && currentState) {
                this.lastState = currentState;
                this.debounceUpdate(() => this.updateProfitDisplay());
            }
        }

        // 子类需要实现的抽象方法
        getContainerId() { throw new Error('Must implement getContainerId'); }
        getPessimisticId() { throw new Error('Must implement getPessimisticId'); }
        getOptimisticId() { throw new Error('Must implement getOptimisticId'); }
        getWaitingText() { throw new Error('Must implement getWaitingText'); }
        getActionData() { throw new Error('Must implement getActionData'); }
        calculateProfit(data, useOptimistic) { throw new Error('Must implement calculateProfit'); }
        getStateFingerprint() { throw new Error('Must implement getStateFingerprint'); }
        setupUI() { throw new Error('Must implement setupUI'); }
    }

    // ==================== 炼金利润计算器 ====================
    class AlchemyProfitCalculator extends BaseProfitCalculator {
        constructor() {
            super(CONFIG.ALCHEMY_CACHE_EXPIRY);
            this.alchemyObservers = [];
            this.clickListeners = []; // 新增：存储点击监听器
            this.init();
        }

        init() {
            super.init();
            this.setupObserver();
        }

        setupObserver() {
            const observer = new MutationObserver(() => {
                this.setupUI();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        createProfitDisplay() {
            const container = document.createElement('div');
            container.id = 'alchemy-profit-display';
            container.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-family: Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 0.00938em;
            color: var(--color-text-dark-mode);
            font-weight: 400;
        `;

            // 创建垂直布局
            const grid = document.createElement('div');
            grid.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

            // 4种利润计算情况，按指定顺序排列
            const profitTypes = [
                { id: 'ask-buy-bid-sell', label: LANG.askBuyBidSell, buyType: 'ask', sellType: 'bid' },
                { id: 'bid-buy-bid-sell', label: LANG.bidBuyBidSell, buyType: 'bid', sellType: 'bid' },
                { id: 'ask-buy-ask-sell', label: LANG.askBuyAskSell, buyType: 'ask', sellType: 'ask' },
                { id: 'bid-buy-ask-sell', label: LANG.bidBuyAskSell, buyType: 'bid', sellType: 'ask' }
            ];

            profitTypes.forEach(type => {
                const profitBox = document.createElement('div');
                profitBox.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
            `;

                const label = document.createElement('span');
                label.textContent = type.label;
                label.style.cssText = `
                color: var(--color-space-300);
                font-size: 14px;
            `;

                const value = document.createElement('span');
                value.id = type.id;
                value.textContent = this.getWaitingText();
                value.style.cssText = `
                font-weight: 500;
                font-size: 14px;
            `;

                profitBox.appendChild(label);
                profitBox.appendChild(value);
                grid.appendChild(profitBox);
            });

            container.appendChild(grid);
            return container;
        }

        setupUI() {
            const alchemyComponent = document.querySelector('.SkillActionDetail_alchemyComponent__1J55d');
            const instructionsEl = document.querySelector('.SkillActionDetail_instructions___EYV5');
            const infoContainer = document.querySelector('.SkillActionDetail_info__3umoI');
            const existingDisplay = document.getElementById('alchemy-profit-display');

            const shouldShow = alchemyComponent && !instructionsEl && infoContainer;

            if (shouldShow && !existingDisplay) {
                const container = this.createProfitDisplay();
                infoContainer.appendChild(container);
                this.lastState = this.getStateFingerprint();
                this.setupSpecificObservers();
                setTimeout(() => this.updateProfitDisplay(), this.initialized ? 50 : 100);
            } else if (!shouldShow && existingDisplay) {
                existingDisplay.remove();
                this.cleanupObservers();
            }
        }

        setupSpecificObservers() {
            // 清理旧的观察器和监听器
            this.cleanupObservers();

            // 设置新的观察器
            this.alchemyObservers = [
                this.createSpecificObserver('.ActionTypeConsumableSlots_consumableSlots__kFKk0'),
                this.createSpecificObserver('.SkillActionDetail_successRate__2jPEP .SkillActionDetail_value__dQjYH'),
                this.createSpecificObserver('.SkillActionDetail_catalystItemInputContainer__5zmou'),
                this.createSpecificObserver('.ItemSelector_itemSelector__2eTV6')
            ].filter(Boolean);

            // 新增：设置点击监听器
            this.setupClickListeners();
        }

        // 新增：设置点击监听器
        setupClickListeners() {
            // 处理点击事件的函数
            const handleClick = () => {
                const currentState = this.getStateFingerprint();
                if (currentState !== this.lastState) {
                    this.lastState = currentState;
                    this.debounceUpdate(() => this.updateProfitDisplay());
                } else {
                    // 即使状态没变也强制更新一次（防止某些情况下的数据不同步）
                    setTimeout(() => this.updateProfitDisplay(), 100);
                }
            };

            // 为 MuiTabs-flexContainer css-k008qs 元素添加点击监听器
            const tabContainers = document.querySelectorAll('.MuiTabs-flexContainer.css-k008qs');
            tabContainers.forEach(container => {
                const listener = handleClick.bind(this);
                container.addEventListener('click', listener, true); // 使用捕获阶段
                this.clickListeners.push({ element: container, listener, type: 'click' });
            });

            // 为 MuiTooltip-tooltip 元素添加点击监听器
            const tooltipElements = document.querySelectorAll('.MuiTooltip-tooltip');
            tooltipElements.forEach(tooltip => {
                const listener = handleClick.bind(this);
                tooltip.addEventListener('click', listener, true); // 使用捕获阶段
                this.clickListeners.push({ element: tooltip, listener, type: 'click' });
            });

            // 由于这些元素可能动态生成，设置一个定时检查
            const checkInterval = setInterval(() => {
                // 检查是否有新的标签容器元素
                const newTabContainers = document.querySelectorAll('.MuiTabs-flexContainer.css-k008qs');
                newTabContainers.forEach(container => {
                    const alreadyListening = this.clickListeners.some(l => l.element === container);
                    if (!alreadyListening) {
                        const listener = handleClick.bind(this);
                        container.addEventListener('click', listener, true);
                        this.clickListeners.push({ element: container, listener, type: 'click' });
                    }
                });

                // 检查是否有新的工具提示元素
                const newTooltipElements = document.querySelectorAll('.MuiTooltip-tooltip');
                newTooltipElements.forEach(tooltip => {
                    const alreadyListening = this.clickListeners.some(l => l.element === tooltip);
                    if (!alreadyListening) {
                        const listener = handleClick.bind(this);
                        tooltip.addEventListener('click', listener, true);
                        this.clickListeners.push({ element: tooltip, listener, type: 'click' });
                    }
                });
            }, 1000);

            // 将定时器也存储起来，以便清理
            this.clickListeners.push({
                element: null,
                listener: null,
                type: 'interval',
                intervalId: checkInterval
            });
        }

        createSpecificObserver(selector) {
            const element = document.querySelector(selector);
            if (!element) return null;

            const observer = new MutationObserver(() => {
                const currentState = this.getStateFingerprint();
                if (currentState !== this.lastState) {
                    this.lastState = currentState;
                    this.debounceUpdate(() => this.updateProfitDisplay());
                }
            });

            observer.observe(element, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
            });

            return observer;
        }

        cleanupObservers() {
            // 清理MutationObserver
            this.alchemyObservers.forEach(obs => obs?.disconnect());
            this.alchemyObservers = [];

            // 新增：清理点击监听器
            this.clickListeners.forEach(listenerInfo => {
                if (listenerInfo.type === 'click' && listenerInfo.element && listenerInfo.listener) {
                    listenerInfo.element.removeEventListener('click', listenerInfo.listener, true);
                } else if (listenerInfo.type === 'interval' && listenerInfo.intervalId) {
                    clearInterval(listenerInfo.intervalId);
                }
            });
            this.clickListeners = [];
        }

        getContainerId() { return 'alchemy-profit-display'; }
        getWaitingText() { return LANG.loadingMarketData; }

        getRequiredLevel() {
            try {
                const notesEl = document.querySelector('.SkillActionDetail_notes__2je2F');
                if (!notesEl) return 0;
                const match = notesEl.childNodes[0]?.textContent?.match(/\d+/);
                return match ? parseInt(match[0]) : 0;
            } catch (error) {
                console.error('获取要求等级失败:', error);
                return 0;
            }
        }

        getBaseAlchemyLevel() {
            try {
                const container = document.querySelector('.SkillActionDetail_alchemyComponent__1J55d');
                const props = utils.getReactProps(container);
                return props?.characterSkillMap?.get('/skills/alchemy')?.level || 0;
            } catch (error) {
                console.error('获取基础炼金等级失败:', error);
                return 0;
            }
        }

        calculateBuffEffects() {
            try {
                const container = document.querySelector('.SkillActionDetail_alchemyComponent__1J55d');
                const props = utils.getReactProps(container);
                if (!props) return { efficiency: 0.0, alchemyLevelBonus: 0.0, actionSpeed: 0.0 };

                const buffs = props.actionBuffs || [];
                const baseAlchemyLevel = this.getBaseAlchemyLevel();
                const requiredLevel = this.getRequiredLevel();

                let efficiencyBuff = 0.0;
                let alchemyLevelBonus = 0.0;
                let actionSpeedBuff = 0.0;

                // 计算buff效果
                for (const buff of buffs) {
                    if (buff.typeHrid === '/buff_types/efficiency') {
                        efficiencyBuff += (buff.flatBoost || 0.0);
                    }
                    if (buff.typeHrid === '/buff_types/alchemy_level') {
                        alchemyLevelBonus += (buff.flatBoost || 0.0);
                    }
                    if (buff.typeHrid === '/buff_types/action_speed') {
                        actionSpeedBuff += (buff.flatBoost || 0.0);
                    }
                }

                // 计算等级效率加成
                const finalAlchemyLevel = baseAlchemyLevel + alchemyLevelBonus;
                const levelEfficiencyBonus = Math.max(0.0, (finalAlchemyLevel - requiredLevel) / 100.0);
                const totalEfficiency = efficiencyBuff + levelEfficiencyBonus;

                return {
                    efficiency: totalEfficiency,
                    alchemyLevelBonus,
                    actionSpeed: actionSpeedBuff
                };
            } catch (error) {
                console.error('计算buff效果失败:', error);
                return { efficiency: 0.0, alchemyLevelBonus: 0.0, actionSpeed: 0.0 };
            }
        }

        getTeaBuffDuration(container) {
            try {
                const props = utils.getReactProps(container);
                if (!props) return 300.0; // 默认300秒

                const buffs = props.actionBuffs || [];

                // 查找uniqueHrid结尾为'tea'的buff
                for (const buff of buffs) {
                    if (buff.uniqueHrid && buff.uniqueHrid.endsWith('tea')) {
                        const duration = buff.duration || 0;
                        return duration / 1e9; // 转换为秒
                    }
                }

                return 300.0; // 如果没找到茶类buff，默认300秒
            } catch (error) {
                console.error('获取茶类buff持续时间失败:', error);
                return 300.0;
            }
        }

        async getDrinkCosts() {
            try {
                const drinkCosts = [];
                const consumableElements = [...document.querySelectorAll('.ActionTypeConsumableSlots_consumableSlots__kFKk0 .Item_itemContainer__x7kH1')];

                for (const element of consumableElements) {
                    const href = element?.querySelector('svg use')?.getAttribute('href');
                    const itemHrid = href ? `/items/${href.split('#')[1]}` : null;
                    if (itemHrid && itemHrid !== '/items/coin') {
                        drinkCosts.push({ itemHrid });
                    }
                }

                return drinkCosts;
            } catch (error) {
                console.error('获取饮品成本失败:', error);
                return [];
            }
        }

        async getItemData(element, dropIndex = -1, reqIndex = -1) {
            try {
                const href = element?.querySelector('svg use')?.getAttribute('href');
                const itemHrid = href ? `/items/${href.split('#')[1]}` : null;
                if (!itemHrid) return null;

                // 获取强化等级
                let enhancementLevel = 0;
                if (reqIndex >= 0) {
                    const enhancementEl = element.querySelector('.Item_enhancementLevel__19g-e');
                    if (enhancementEl) {
                        const match = enhancementEl.textContent.match(/\+(\d+)/);
                        enhancementLevel = match ? parseInt(match[1]) : 0;
                    }
                }

                // 获取价格
                let asks = 0.0, bids = 0.0;
                if (itemHrid === '/items/coin') {
                    asks = bids = 1.0;
                } else {
                    const orderBooks = await this.getMarketData(itemHrid);
                    if (orderBooks?.[enhancementLevel]) {
                        const { asks: asksList, bids: bidsList } = orderBooks[enhancementLevel];
                        if (reqIndex >= 0) {
                            asks = asksList?.length > 0 ? asksList[0].price : null;
                            bids = bidsList?.length > 0 ? bidsList[0].price : null;
                        } else {
                            asks = asksList?.[0]?.price || 0.0;
                            bids = bidsList?.[0]?.price || 0.0;
                        }
                    } else {
                        asks = bids = reqIndex >= 0 ? null : (orderBooks ? -1.0 : 0.0);
                    }
                }

                const result = { itemHrid, asks, bids, enhancementLevel };

                // 获取数量和掉落率
                if (reqIndex >= 0) {
                    const countEl = document.querySelectorAll('.SkillActionDetail_itemRequirements__3SPnA .SkillActionDetail_inputCount__1rdrn')[reqIndex];
                    const rawCountText = countEl?.textContent || '1';
                    result.count = parseFloat(utils.cleanNumber(rawCountText)) || 1.0;
                } else if (dropIndex >= 0) {
                    const dropEl = document.querySelectorAll('.SkillActionDetail_drop__26KBZ')[dropIndex];
                    const text = dropEl?.textContent || '';

                    // 提取数量
                    const countMatch = text.match(/^([\d\s,.]+)/);
                    const rawCountText = countMatch?.[1] || '1';
                    result.count = parseFloat(utils.cleanNumber(rawCountText)) || 1.0;

                    // 提取掉落率
                    const rateMatch = text.match(/([\d,.]+)%/);
                    const rawRateText = rateMatch?.[0] || '100';
                    result.dropRate = parseFloat(utils.cleanNumber(rawRateText)) / 100.0 || 1.0;
                }

                return result;
            } catch (error) {
                console.error('获取物品数据失败:', error);
                return null;
            }
        }

        getSuccessRate() {
            try {
                const element = document.querySelector('.SkillActionDetail_successRate__2jPEP .SkillActionDetail_value__dQjYH');
                const rawText = element?.textContent || '0.0';
                return parseFloat(utils.cleanNumber(rawText)) / 100.0;
            } catch (error) {
                console.error('获取成功率失败:', error);
                return 0.0;
            }
        }

        hasNullPrices(data, buyType, sellType) {
            const checkItems = (items, priceType) => items.some(item => item[priceType] === null);

            return checkItems(data.requirements, buyType === 'ask' ? 'asks' : 'bids') ||
                checkItems(data.drops, sellType === 'ask' ? 'asks' : 'bids') ||
                checkItems(data.consumables, buyType === 'ask' ? 'asks' : 'bids') ||
                data.catalyst[buyType === 'ask' ? 'asks' : 'bids'] === null;
        }

        async getMarketDataForRareDrops(outputItems) {
            if (!window.PGE_CONFIG.considerRareLoot) return {};

            const marketData = {};
            const itemsToFetch = new Set();

            // 收集所有需要获取市场数据的物品
            outputItems.forEach(output => {
                const rareItems = rareDropsCalculator.getRareDropItems(output.itemHrid);
                rareItems.forEach(item => itemsToFetch.add(item));
            });

            // 添加bag_of_10_cowbells用于计算cowbell价格
            itemsToFetch.add('/items/bag_of_10_cowbells');

            // 批量获取市场数据
            const promises = Array.from(itemsToFetch).map(async (itemHrid) => {
                const orderBooks = await this.getMarketData(itemHrid);
                marketData[itemHrid] = orderBooks;
            });

            await Promise.all(promises);
            return marketData;
        }

        async getActionData() {
            try {
                const successRate = this.getSuccessRate();
                if (isNaN(successRate) || successRate < 0) return null;

                const buffEffects = this.calculateBuffEffects();
                const timeCost = 20.0 / (1.0 + buffEffects.actionSpeed);

                // 获取页面元素
                const reqEls = [...document.querySelectorAll('.SkillActionDetail_itemRequirements__3SPnA .Item_itemContainer__x7kH1')];
                const dropEls = [...document.querySelectorAll('.SkillActionDetail_dropTable__3ViVp .Item_itemContainer__x7kH1')];
                const consumEls = [...document.querySelectorAll('.ActionTypeConsumableSlots_consumableSlots__kFKk0 .Item_itemContainer__x7kH1')];
                const catalystEl = document.querySelector('.SkillActionDetail_catalystItemInputContainer__5zmou .ItemSelector_itemContainer__3olqe') ||
                    document.querySelector('.SkillActionDetail_catalystItemInputContainer__5zmou .SkillActionDetail_itemContainer__2TT5f');

                // 并行获取所有数据
                const [requirements, drops, consumables, catalyst, drinkCosts] = await Promise.all([
                    Promise.all(reqEls.map((el, i) => this.getItemData(el, -1, i))),
                    Promise.all(dropEls.map((el, i) => this.getItemData(el, i))),
                    Promise.all(consumEls.map(el => this.getItemData(el))),
                    catalystEl ? this.getItemData(catalystEl) : Promise.resolve({ asks: 0.0, bids: 0.0 }),
                    this.getDrinkCosts()
                ]);

                const validDrops = drops.filter(Boolean);

                // 获取稀有掉落物市场数据
                const rareDropsMarketData = await this.getMarketDataForRareDrops(validDrops);

                return {
                    successRate,
                    timeCost,
                    efficiency: buffEffects.efficiency,
                    requirements: requirements.filter(Boolean),
                    drops: validDrops,
                    catalyst: catalyst || { asks: 0.0, bids: 0.0 },
                    consumables: consumables.filter(Boolean),
                    drinkCosts,
                    rareDropsMarketData // 添加稀有掉落物市场数据
                };
            } catch (error) {
                console.error('获取行动数据失败:', error);
                return null;
            }
        }

        calculateProfit(data, buyType, sellType) {
            try {
                if (this.hasNullPrices(data, buyType, sellType)) return null;

                // 计算材料成本 - 使用指定的买入价格类型
                const totalReqCost = data.requirements.reduce((sum, item) => {
                    const price = buyType === 'ask' ? item.asks : item.bids;
                    return sum + (price * item.count);
                }, 0.0);

                // 计算每次尝试的成本
                const catalystPrice = buyType === 'ask' ? data.catalyst.asks : data.catalyst.bids;
                const costPerAttempt = (totalReqCost * (1.0 - data.successRate)) +
                    ((totalReqCost + catalystPrice) * data.successRate);

                // 计算每次尝试的收入 - 使用指定的卖出价格类型
                const incomePerAttempt = data.drops.reduce((sum, drop, index) => {
                    const price = sellType === 'ask' ? drop.asks : drop.bids;
                    let income;

                    // 判断是否为最后一个掉落物（稀有掉落物）
                    const isLastDrop = index === data.drops.length - 1;
                    if (isLastDrop && window.PGE_CONFIG.considerRareLoot) {
                        // 如果是最后一个掉落物且开启了稀有掉落物设置，计算稀有掉落物价值
                        const rareDropValue = rareDropsCalculator.calculateRareDropValue(drop.itemHrid, data.rareDropsMarketData);
                        income = rareDropValue * drop.dropRate;
                    } else {
                        // 判断是否为倒数第二个掉落物（精华）
                        const isSecondLastDrop = index === data.drops.length - 2;
                        if (isSecondLastDrop) {
                            income = price * drop.dropRate * drop.count;
                        } else {
                            income = price * drop.dropRate * drop.count * data.successRate;
                        }

                        // 应用市场税费
                        if (drop.itemHrid !== '/items/coin') {
                            income *= 0.98;
                        }
                    }

                    return sum + income;
                }, 0.0);

                // 计算利润
                const netProfitPerAttempt = incomePerAttempt - costPerAttempt;
                const profitPerSecond = (netProfitPerAttempt * (1.0 + data.efficiency)) / data.timeCost;

                // 计算饮品成本
                let drinkCostPerSecond = 0.0;
                if (data.drinkCosts?.length > 0) {
                    const totalDrinkCost = data.drinkCosts.reduce((sum, drinkInfo) => {
                        const consumableData = data.consumables.find(c => c.itemHrid === drinkInfo.itemHrid);
                        if (consumableData) {
                            const price = buyType === 'ask' ? consumableData.asks : consumableData.bids;
                            return sum + price;
                        }
                        return sum;
                    }, 0.0);
                    const container = document.querySelector('.SkillActionDetail_alchemyComponent__1J55d');
                    const teaDuration = this.getTeaBuffDuration(container);
                    drinkCostPerSecond = totalDrinkCost / teaDuration;
                }

                const finalProfitPerSecond = profitPerSecond - drinkCostPerSecond;
                const dailyProfit = finalProfitPerSecond * 86400.0;

                return dailyProfit;
            } catch (error) {
                console.error('计算利润失败:', error);
                return null;
            }
        }

        setAllProfitsToLoading() {
            const profitIds = ['ask-buy-bid-sell', 'bid-buy-bid-sell', 'ask-buy-ask-sell', 'bid-buy-ask-sell'];
            profitIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = LANG.loadingMarketData;
                    element.style.color = CONFIG.COLORS.text;
                }
            });
        }

        setAllProfitsToError() {
            const profitIds = ['ask-buy-bid-sell', 'bid-buy-bid-sell', 'ask-buy-ask-sell', 'bid-buy-ask-sell'];
            profitIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = LANG.calculationError;
                    element.style.color = CONFIG.COLORS.error;
                }
            });
        }

        async updateProfitDisplay() {
            try {
                const container = document.getElementById('alchemy-profit-display');
                if (!container) return;

                this.setAllProfitsToLoading();

                const data = await this.getActionData();
                if (!data) {
                    this.setAllProfitsToError();
                    return;
                }

                // 4种利润计算情况，按指定顺序排列
                const profitTypes = [
                    { id: 'ask-buy-bid-sell', buyType: 'ask', sellType: 'bid' },
                    { id: 'bid-buy-bid-sell', buyType: 'bid', sellType: 'bid' },
                    { id: 'ask-buy-ask-sell', buyType: 'ask', sellType: 'ask' },
                    { id: 'bid-buy-ask-sell', buyType: 'bid', sellType: 'ask' }
                ];

                profitTypes.forEach(type => {
                    const profit = this.calculateProfit(data, type.buyType, type.sellType);
                    const element = document.getElementById(type.id);
                    if (element) {
                        if (profit === null) {
                            element.textContent = LANG.noData;
                            element.style.color = CONFIG.COLORS.neutral;
                        } else {
                            element.textContent = utils.formatProfit(profit);
                            element.style.color = profit >= 0 ? CONFIG.COLORS.profit : CONFIG.COLORS.loss;
                        }
                    }
                });
            } catch (error) {
                console.error('更新利润显示失败:', error);
                this.setAllProfitsToError();
            }
        }

        setAllProfitsToError() {
            const profitIds = ['ask-buy-bid-sell', 'bid-buy-bid-sell', 'ask-buy-ask-sell', 'bid-buy-ask-sell'];
            profitIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = LANG.calculationError;
                    element.style.color = CONFIG.COLORS.error;
                }
            });
        }

        getStateFingerprint() {
            try {
                const consumables = document.querySelectorAll('.ActionTypeConsumableSlots_consumableSlots__kFKk0 .Item_itemContainer__x7kH1');
                const alchemyInfo = document.querySelector('.SkillActionDetail_info__3umoI')?.textContent || '';

                const consumablesState = Array.from(consumables).map(el =>
                    el.querySelector('svg use')?.getAttribute('href') || 'empty'
                ).join('|');

                return `${consumablesState}:${alchemyInfo}`;
            } catch (error) {
                console.error('获取状态指纹失败:', error);
                return '';
            }
        }
    }

    // ==================== 生产行动利润计算器 ====================
    class UniversalActionProfitCalculator extends BaseProfitCalculator {
        constructor() {
            super(CONFIG.UNIVERSAL_CACHE_EXPIRY);
            this.observer = null;
            this.init();
        }

        init() {
            super.init();
            this.setupObserver();
        }

        setupObserver() {
            const observer = new MutationObserver(() => {
                this.setupUI();
                this.checkForUpdates();
            });
            observer.observe(document.body, { childList: true, subtree: true });
            this.observer = observer;

            // 设置输入事件监听器
            document.addEventListener('input', () => {
                setTimeout(() => this.checkForUpdates(), 100);
            });

            document.addEventListener('click', (e) => {
                if (e.target.closest('.SkillActionDetail_regularComponent__3oCgr') ||
                    e.target.closest('[class*="ItemSelector"]') ||
                    e.target.closest('.Item_itemContainer__x7kH1') ||
                    e.target.closest('.ActionTypeConsumableSlots_consumableSlots__kFKk0')) {
                    setTimeout(() => {
                        this.setupUI();
                        this.checkForUpdates();
                    }, 100);
                }
            });
        }

        createProfitDisplay() {
            const container = document.createElement('div');
            container.id = 'universal-action-profit-display';
            container.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-family: Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 0.00938em;
            color: var(--color-text-dark-mode);
            font-weight: 400;
            margin-top: 8px;
        `;

            // 创建垂直布局
            const grid = document.createElement('div');
            grid.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

            // 4种利润计算情况，按指定顺序排列
            const profitTypes = [
                { id: 'universal-ask-buy-bid-sell', label: LANG.askBuyBidSell, buyType: 'ask', sellType: 'bid' },
                { id: 'universal-bid-buy-bid-sell', label: LANG.bidBuyBidSell, buyType: 'bid', sellType: 'bid' },
                { id: 'universal-ask-buy-ask-sell', label: LANG.askBuyAskSell, buyType: 'ask', sellType: 'ask' },
                { id: 'universal-bid-buy-ask-sell', label: LANG.bidBuyAskSell, buyType: 'bid', sellType: 'ask' }
            ];

            profitTypes.forEach(type => {
                const profitBox = document.createElement('div');
                profitBox.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
            `;

                const label = document.createElement('span');
                label.textContent = type.label;
                label.style.cssText = `
                color: var(--color-space-300);
                font-size: 14px;
            `;

                const value = document.createElement('span');
                value.id = type.id;
                value.textContent = this.getWaitingText();
                value.style.cssText = `
                font-weight: 500;
                font-size: 14px;
            `;

                profitBox.appendChild(label);
                profitBox.appendChild(value);
                grid.appendChild(profitBox);
            });

            container.appendChild(grid);
            return container;
        }

        getContainerId() { return 'universal-action-profit-display'; }
        getWaitingText() { return LANG.loadingMarketData; }

        getCurrentActionType() {
            try {
                const mainPanel = document.querySelector('.MainPanel_subPanelContainer__1i-H9');
                if (!mainPanel) return null;
                const reactPropsKey = Object.keys(mainPanel).find(k => k.startsWith('__reactProps$'));
                if (!reactPropsKey) return null;
                return mainPanel[reactPropsKey]?.children?._owner?.memoizedProps?.navTarget || null;
            } catch (error) {
                console.error('获取行动类型失败:', error);
                return null;
            }
        }

        getCurrentSkillLevel(actionType) {
            try {
                if (!actionType) return 0;
                const mainPanel = document.querySelector('.MainPanel_subPanelContainer__1i-H9');
                if (!mainPanel) return 0;
                const reactPropsKey = Object.keys(mainPanel).find(k => k.startsWith('__reactProps$'));
                if (!reactPropsKey) return 0;
                const skillMap = mainPanel[reactPropsKey]?.children?._owner?.memoizedProps?.characterSkillMap;
                const skillHrid = `/skills/${actionType}`;
                return skillMap?.get?.(skillHrid)?.level || 0;
            } catch (error) {
                console.error('获取技能等级失败:', error);
                return 0;
            }
        }

        getRequiredLevel() {
            try {
                const levelElement = document.querySelector('.SkillActionDetail_levelRequirement__3Ht0f');
                if (!levelElement) return 0;
                const levelText = levelElement.textContent;
                const match = levelText.match(/Lv\.(\d+)(?:\s*\+\s*(\d+))?/);
                if (match) {
                    const baseLevel = parseInt(match[1]);
                    const bonus = match[2] ? parseInt(match[2]) : 0;
                    return baseLevel + bonus;
                }
                return 0;
            } catch (error) {
                console.error('获取要求等级失败:', error);
                return 0;
            }
        }

        getSkillTypeFromLevelBuff(buffTypeHrid) {
            const levelBuffMap = {
                '/buff_types/cooking_level': 'cooking',
                '/buff_types/brewing_level': 'brewing',
                '/buff_types/smithing_level': 'smithing',
                '/buff_types/crafting_level': 'crafting',
                '/buff_types/enhancement_level': 'enhancement',
                '/buff_types/foraging_level': 'foraging',
                '/buff_types/woodcutting_level': 'woodcutting',
                '/buff_types/mining_level': 'mining'
            };
            return levelBuffMap[buffTypeHrid] || null;
        }

        // 获取工匠茶buff效果
        getArtisanBuff(container) {
            try {
                const props = utils.getReactProps(container);
                if (!props) return 0.0;

                const buffs = props.actionBuffs || [];
                let artisanBuff = 0.0;

                for (const buff of buffs) {
                    if (buff.typeHrid === '/buff_types/artisan') {
                        artisanBuff += (buff.flatBoost || 0.0);
                    }
                }

                return artisanBuff;
            } catch (error) {
                console.error('获取工匠茶buff失败:', error);
                return 0.0;
            }
        }

        // 获取基础材料消耗量
        getBaseMaterialConsumption(materialContainer, index) {
            try {
                const reactKey = Object.keys(materialContainer).find(key => key.startsWith('__reactProps$'));
                if (reactKey) {
                    const props = materialContainer[reactKey];
                    const baseCount = props?.children?._owner?.memoizedProps?.count;
                    if (typeof baseCount === 'number') {
                        return baseCount;
                    }
                }
            } catch (error) {
                console.error('获取基础材料消耗量失败:', error);
            }
            return 1.0; // 默认值
        }

        async calculateBuffEffectsAndCosts() {
            const container = document.querySelector('.SkillActionDetail_regularComponent__3oCgr');
            const props = utils.getReactProps(container);
            if (!props) return { efficiency: 0.0, drinkCosts: [] };

            const buffs = props.actionBuffs || [];
            let efficiencyBuff = 0.0;
            let levelBonus = 0.0;

            const actionType = this.getCurrentActionType();
            const skillLevel = this.getCurrentSkillLevel(actionType);
            const requiredLevel = this.getRequiredLevel();

            for (const buff of buffs) {
                if (buff.typeHrid === '/buff_types/efficiency') {
                    efficiencyBuff += (buff.flatBoost || 0.0);
                }
                if (buff.typeHrid && buff.typeHrid.includes('_level')) {
                    const buffSkillType = this.getSkillTypeFromLevelBuff(buff.typeHrid);
                    if (buffSkillType === actionType) {
                        levelBonus += (buff.flatBoost || 0.0);
                    }
                }
            }

            const finalSkillLevel = skillLevel + levelBonus;
            const levelEfficiencyBonus = Math.max(0.0, (finalSkillLevel - requiredLevel) / 100.0);
            const totalEfficiency = efficiencyBuff + levelEfficiencyBonus;

            const drinkCosts = await this.getDrinkCosts();
            return { efficiency: totalEfficiency, drinkCosts };
        }

        getTeaBuffDuration(container) {
            try {
                const props = utils.getReactProps(container);
                if (!props) return 300.0; // 默认300秒

                const buffs = props.actionBuffs || [];

                // 查找uniqueHrid结尾为'tea'的buff
                for (const buff of buffs) {
                    if (buff.uniqueHrid && buff.uniqueHrid.endsWith('tea')) {
                        const duration = buff.duration || 0;
                        return duration / 1e9; // 转换为秒
                    }
                }

                return 300.0; // 如果没找到茶类buff，默认300秒
            } catch (error) {
                console.error('获取茶类buff持续时间失败:', error);
                return 300.0;
            }
        }

        async getDrinkCosts() {
            const drinkCosts = [];
            const consumableElements = [...document.querySelectorAll('.ActionTypeConsumableSlots_consumableSlots__kFKk0 .Item_itemContainer__x7kH1')];
            for (const element of consumableElements) {
                const itemData = await this.getItemData(element, false, false, false);
                if (itemData && itemData.itemHrid !== '/items/coin') {
                    drinkCosts.push({
                        itemHrid: itemData.itemHrid,
                        asks: itemData.asks,
                        bids: itemData.bids,
                        enhancementLevel: itemData.enhancementLevel
                    });
                }
            }
            return drinkCosts;
        }

        async getItemData(element, isOutput = false, isRequirement = false, isUpgrade = false) {
            const href = element?.querySelector('svg use')?.getAttribute('href');
            const itemHrid = href ? `/items/${href.split('#')[1]}` : null;
            if (!itemHrid) return null;

            let enhancementLevel = 0;
            if (isRequirement && !isUpgrade) {
                const enhancementEl = element.querySelector('.Item_enhancementLevel__19g-e');
                if (enhancementEl) {
                    const match = enhancementEl.textContent.match(/\+(\d+)/);
                    enhancementLevel = match ? parseInt(match[1]) : 0;
                }
            }
            if (isUpgrade) enhancementLevel = 0;

            let asks = 0.0, bids = 0.0;
            if (itemHrid === '/items/coin') {
                asks = bids = 1.0;
            } else {
                const orderBooks = await this.getMarketData(itemHrid);
                if (orderBooks && orderBooks[enhancementLevel]) {
                    const { asks: asksList, bids: bidsList } = orderBooks[enhancementLevel];
                    asks = (asksList && asksList[0]) ? asksList[0].price : 0.0;
                    bids = (bidsList && bidsList[0]) ? bidsList[0].price : 0.0;
                } else {
                    asks = bids = orderBooks ? -1.0 : 0.0;
                }
            }

            const result = { itemHrid, asks, bids, enhancementLevel };

            if (isUpgrade) {
                result.count = 1.0;
            } else if (isOutput) {
                const outputContainer = element.closest('.SkillActionDetail_item__2vEAz');
                let baseCount = 1.0;

                // 尝试从UI获取基础数量
                const key = Object.keys(outputContainer.children[1] || {}).find(k => k.startsWith('__reactProps$'));
                const props = outputContainer.children[1][key]?.children?._owner?.memoizedProps;

                baseCount = props?.count || 1.0;

                // 检查是否是第一个产出物品（通常是主要产品）
                const container = document.querySelector('.SkillActionDetail_regularComponent__3oCgr');
                const outputElements = container?.querySelectorAll('.SkillActionDetail_outputItems__3zp_f .Item_itemContainer__x7kH1') || [];
                const isFirstOutput = outputElements.length > 0 && outputElements[0] === element;

                if (isFirstOutput) {
                    // 对第一个产出物品应用美食buff: 1+gourmetBuff
                    const gourmetBuff = this.getGourmetBuff(container);
                    result.count = baseCount * (1 + gourmetBuff);
                } else {
                    // 其他产出物品使用原来的逻辑
                    result.count = baseCount;
                }
            } else if (isRequirement) {
                // 获取基础材料消耗量并应用工匠茶效果
                const container = document.querySelector('.SkillActionDetail_regularComponent__3oCgr');
                const requirementRow = element.closest('.SkillActionDetail_itemRequirements__3SPnA');
                const itemElements = requirementRow?.querySelectorAll('.Item_itemContainer__x7kH1');
                let itemIndex = 0;
                if (itemElements) {
                    for (let i = 0; i < itemElements.length; i++) {
                        if (itemElements[i].contains(element) || itemElements[i] === element) {
                            itemIndex = i;
                            break;
                        }
                    }
                }

                // 获取基础消耗量
                const baseConsumption = this.getBaseMaterialConsumption(element, itemIndex);

                // 应用工匠茶效果
                const artisanBuff = this.getArtisanBuff(container);
                result.count = baseConsumption * (1 - artisanBuff);
            }

            return result;
        }

        getActionTime() {
            try {
                const container = document.querySelector('.SkillActionDetail_regularComponent__3oCgr');
                if (!container) return 0.0;

                const props = utils.getReactProps(container);
                if (!props) return 0.0;

                const baseTimeCost = props.actionDetail?.baseTimeCost;
                if (!baseTimeCost) return 0.0;

                // 获取速度buff
                const speedBuff = this.getSpeedBuff(container);

                // 计算实际行动时间: baseTimeCost/1e9/(1+speedBuff)
                const actionTime = (baseTimeCost / 1e9) / (1 + speedBuff);

                return actionTime;
            } catch (error) {
                console.error('获取行动时间失败:', error);
                // 如果失败，回退到原来的方法
                const allTimeElements = document.querySelectorAll('.SkillActionDetail_value__dQjYH');
                for (let i = allTimeElements.length - 1; i >= 0; i--) {
                    const text = allTimeElements[i].textContent;
                    if (text.includes('s') && !text.includes('%')) {
                        const match = text.match(/([\d.,]+)s/);
                        if (match) return parseFloat(utils.cleanNumber(match[1]));
                    }
                }
                return 0.0;
            }
        }

        // 获取速度buff效果
        getSpeedBuff(container) {
            try {
                const props = utils.getReactProps(container);
                if (!props) return 0.0;

                const buffs = props.actionBuffs || [];
                let speedBuff = 0.0;

                for (const buff of buffs) {
                    if (buff.typeHrid === '/buff_types/action_speed') {
                        speedBuff += (buff.flatBoost || 0.0);
                    }
                }

                return speedBuff;
            } catch (error) {
                console.error('获取速度buff失败:', error);
                return 0.0;
            }
        }

        // 获取美食家buff效果
        getGourmetBuff(container) {
            try {
                const props = utils.getReactProps(container);
                if (!props) return 0.0;

                const buffs = props.actionBuffs || [];
                let gourmetBuff = 0.0;

                for (const buff of buffs) {
                    if (buff.typeHrid === '/buff_types/gourmet') {
                        gourmetBuff += (buff.flatBoost || 0.0);
                    }
                }

                return gourmetBuff;
            } catch (error) {
                console.error('获取美食家buff失败:', error);
                return 0.0;
            }
        }

        parseDropRate(itemHrid) {
            try {
                const dropElements = document.querySelectorAll('.SkillActionDetail_drop__26KBZ');
                for (const dropElement of dropElements) {
                    const itemElement = dropElement.querySelector('.Item_itemContainer__x7kH1 svg use');
                    if (itemElement) {
                        const href = itemElement.getAttribute('href');
                        const dropItemHrid = href ? `/items/${href.split('#')[1]}` : null;
                        if (dropItemHrid === itemHrid) {
                            const rateText = dropElement.textContent.match(/~?([\d.]+)%/);
                            if (rateText) {
                                return parseFloat(utils.cleanNumber(rateText[0])) / 100.0;
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('解析掉落率失败:', error);
            }
            return null;
        }

        hasNullPrices(data, buyType, sellType) {
            const checkRequirements = (items, priceType) => items.some(item =>
                item[priceType] === null || item[priceType] <= 0.0
            );
            const checkOutputs = (items, priceType) => items.some(item =>
                item[priceType] === null || item[priceType] <= 0.0
            );
            const checkUpgrades = (items, priceType) => items.some(item =>
                item[priceType] === null || item[priceType] <= 0.0
            );
            const checkDrinks = (drinks, priceType) => drinks.some(drink =>
                drink[priceType] === null || drink[priceType] <= 0.0
            );

            return checkRequirements(data.requirements, buyType === 'ask' ? 'asks' : 'bids') ||
                checkOutputs(data.outputs, sellType === 'ask' ? 'asks' : 'bids') ||
                checkUpgrades(data.upgrades || [], buyType === 'ask' ? 'asks' : 'bids') ||
                checkDrinks(data.drinkCosts || [], buyType === 'ask' ? 'asks' : 'bids');
        }

        async getMarketDataForRareDrops(outputItems) {
            if (!window.PGE_CONFIG.considerRareLoot) return {};

            const marketData = {};
            const itemsToFetch = new Set();

            // 收集所有需要获取市场数据的物品
            outputItems.forEach(output => {
                const rareItems = rareDropsCalculator.getRareDropItems(output.itemHrid);
                rareItems.forEach(item => itemsToFetch.add(item));
            });

            // 添加bag_of_10_cowbells用于计算cowbell价格
            itemsToFetch.add('/items/bag_of_10_cowbells');

            // 批量获取市场数据
            const promises = Array.from(itemsToFetch).map(async (itemHrid) => {
                const orderBooks = await this.getMarketData(itemHrid);
                marketData[itemHrid] = orderBooks;
            });

            await Promise.all(promises);
            return marketData;
        }

        async getActionData() {
            const container = document.querySelector('.SkillActionDetail_regularComponent__3oCgr');
            if (!container) return null;

            const reqElements = [...container.querySelectorAll('.SkillActionDetail_itemRequirements__3SPnA .Item_itemContainer__x7kH1')];
            const outputElements = [...container.querySelectorAll('.SkillActionDetail_outputItems__3zp_f .Item_itemContainer__x7kH1')];
            const dropElements = [...container.querySelectorAll('.SkillActionDetail_dropTable__3ViVp .Item_itemContainer__x7kH1')];
            const upgradeElements = [...container.querySelectorAll('.SkillActionDetail_upgradeItemSelectorInput__2mnS0 .Item_itemContainer__x7kH1')];

            const [requirements, outputs, drops, upgrades, buffData] = await Promise.all([
                Promise.all(reqElements.map(el => this.getItemData(el, false, true, false))),
                Promise.all(outputElements.map(el => this.getItemData(el, true, false, false))),
                Promise.all(dropElements.map(el => this.getItemData(el, false, false, false))),
                Promise.all(upgradeElements.map(el => this.getItemData(el, false, false, true))),
                this.calculateBuffEffectsAndCosts()
            ]);

            const actionTime = this.getActionTime();
            const validDrops = drops.filter(Boolean);

            // 获取稀有掉落物市场数据
            const rareDropsMarketData = await this.getMarketDataForRareDrops(validDrops);

            return {
                actionTime,
                efficiency: buffData.efficiency,
                drinkCosts: buffData.drinkCosts,
                requirements: requirements.filter(Boolean),
                outputs: outputs.filter(Boolean),
                drops: validDrops,
                upgrades: upgrades.filter(Boolean),
                rareDropsMarketData // 添加稀有掉落物市场数据
            };
        }

        calculateProfit(data, buyType, sellType) {
            if (this.hasNullPrices(data, buyType, sellType)) return null;
            if (data.actionTime <= 0.0) return null;

            // 计算成本 - 使用指定的买入价格类型
            let totalCost = 0.0;
            data.requirements.forEach(item => {
                const price = buyType === 'ask' ? item.asks : item.bids;
                totalCost += price * item.count;
            });

            if (data.upgrades.length > 0) {
                data.upgrades.forEach(item => {
                    const price = buyType === 'ask' ? item.asks : item.bids;
                    totalCost += price * item.count;
                });
            }

            const effectiveTime = data.actionTime / (1.0 + data.efficiency);

            // 计算收入 - 使用指定的卖出价格类型
            let totalIncome = 0.0;
            data.outputs.forEach(item => {
                const price = sellType === 'ask' ? item.asks : item.bids;
                let income = price * item.count;
                if (item.itemHrid !== '/items/coin') {
                    income *= 0.98; // 市场税费
                }
                totalIncome += income;
            });

            if (data.drops.length > 0) {
                data.drops.forEach((item, index) => {
                    const price = sellType === 'ask' ? item.asks : item.bids;
                    let income;

                    // 判断是否为最后一个掉落物（稀有掉落物）
                    const isLastDrop = index === data.drops.length - 1;
                    if (isLastDrop && window.PGE_CONFIG.considerRareLoot) {
                        // 如果是最后一个掉落物且开启了稀有掉落物设置，计算稀有掉落物价值
                        const dropRate = this.parseDropRate(item.itemHrid) || 0.05;
                        const rareDropValue = rareDropsCalculator.calculateRareDropValue(item.itemHrid, data.rareDropsMarketData);
                        income = rareDropValue * dropRate;
                    } else {
                        const dropRate = this.parseDropRate(item.itemHrid) || 0.05;
                        income = price * (item.count || 1.0) * dropRate;
                        if (item.itemHrid !== '/items/coin') {
                            income *= 0.98; // 市场税费
                        }
                    }

                    totalIncome += income;
                });
            }

            const profitPerAction = totalIncome - totalCost;
            const profitPerSecond = (profitPerAction * (1.0 + data.efficiency)) / data.actionTime;

            // 计算饮品成本
            let drinkCostPerSecond = 0.0;
            if (data.drinkCosts.length > 0) {
                const totalDrinkCost = data.drinkCosts.reduce((sum, item) => {
                    const price = buyType === 'ask' ? item.asks : item.bids;
                    return sum + price;
                }, 0.0);
                const container = document.querySelector('.SkillActionDetail_regularComponent__3oCgr');
                const teaDuration = this.getTeaBuffDuration(container);
                drinkCostPerSecond = totalDrinkCost / teaDuration;
            }

            const finalProfitPerSecond = profitPerSecond - drinkCostPerSecond;
            const dailyProfit = finalProfitPerSecond * 86400.0;

            return dailyProfit;
        }

        async updateProfitDisplay() {
            try {
                const container = document.getElementById('universal-action-profit-display');
                if (!container) return;

                const data = await this.getActionData();
                if (!data) {
                    this.setAllProfitsToError();
                    return;
                }

                // 4种利润计算情况，按指定顺序排列
                const profitTypes = [
                    { id: 'universal-ask-buy-bid-sell', buyType: 'ask', sellType: 'bid' },
                    { id: 'universal-bid-buy-bid-sell', buyType: 'bid', sellType: 'bid' },
                    { id: 'universal-ask-buy-ask-sell', buyType: 'ask', sellType: 'ask' },
                    { id: 'universal-bid-buy-ask-sell', buyType: 'bid', sellType: 'ask' }
                ];

                profitTypes.forEach(type => {
                    const profit = this.calculateProfit(data, type.buyType, type.sellType);
                    const element = document.getElementById(type.id);
                    if (element) {
                        if (profit === null) {
                            element.textContent = LANG.noData;
                            element.style.color = CONFIG.COLORS.neutral;
                        } else {
                            element.textContent = utils.formatProfit(profit);
                            element.style.color = profit >= 0 ? CONFIG.COLORS.profit : CONFIG.COLORS.loss;
                        }
                    }
                });
            } catch (error) {
                console.error('更新利润显示失败:', error);
                this.setAllProfitsToError();
            }
        }

        setAllProfitsToError() {
            const profitIds = ['universal-ask-buy-bid-sell', 'universal-bid-buy-bid-sell', 'universal-ask-buy-ask-sell', 'universal-bid-buy-ask-sell'];
            profitIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = LANG.calculationError;
                    element.style.color = CONFIG.COLORS.error;
                }
            });
        }

        getStateFingerprint() {
            const container = document.querySelector('.SkillActionDetail_regularComponent__3oCgr');
            if (!container) return '';

            const requirements = container.querySelector('.SkillActionDetail_itemRequirements__3SPnA')?.textContent || '';
            const outputs = container.querySelector('.SkillActionDetail_outputItems__3zp_f')?.textContent || '';
            const upgrades = container.querySelector('.SkillActionDetail_upgradeItemSelectorInput__2mnS0')?.textContent || '';
            const timeText = this.getActionTime().toString();

            const props = utils.getReactProps(container);
            const buffsText = props?.actionBuffs ? JSON.stringify(props.actionBuffs.map(b => b.uniqueHrid)) : '';

            const consumables = document.querySelectorAll('.ActionTypeConsumableSlots_consumableSlots__kFKk0 .Item_itemContainer__x7kH1');
            const consumablesText = Array.from(consumables).map(el =>
                el.querySelector('svg use')?.getAttribute('href') || 'empty'
            ).join('|');

            return `${requirements}|${outputs}|${upgrades}|${timeText}|${buffsText}|${consumablesText}`;
        }

        setupUI() {
            const container = document.querySelector('.SkillActionDetail_regularComponent__3oCgr');
            const existingDisplay = document.getElementById('universal-action-profit-display');

            const shouldShow = container &&
                (container.querySelector('.SkillActionDetail_itemRequirements__3SPnA') ||
                    container.querySelector('.SkillActionDetail_upgradeItemSelectorInput__2mnS0')) &&
                container.querySelector('.SkillActionDetail_outputItems__3zp_f') &&
                !container.querySelector('.SkillActionDetail_alchemyComponent__1J55d');

            if (shouldShow && !existingDisplay) {
                const profitDisplay = this.createProfitDisplay();
                const infoContainer = container.querySelector('.SkillActionDetail_info__3umoI');
                if (infoContainer) {
                    infoContainer.parentNode.insertBefore(profitDisplay, infoContainer.nextSibling);
                } else {
                    const contentContainer = container.querySelector('.SkillActionDetail_content__1MbXv');
                    if (contentContainer) {
                        contentContainer.appendChild(profitDisplay);
                    }
                }
                this.lastState = this.getStateFingerprint();
                setTimeout(() => this.updateProfitDisplay(), 100);
            } else if (!shouldShow && existingDisplay) {
                existingDisplay.remove();
            }
        }

        checkForUpdates() {
            const currentState = this.getStateFingerprint();
            if (currentState !== this.lastState) {
                this.lastState = currentState;
                this.debounceUpdate(() => this.updateProfitDisplay());
            }
        }
    }

    // ==================== 物品价值计算器 ====================
    class ItemValueCalculator extends BaseProfitCalculator {
        constructor() {
            super(CONFIG.UNIVERSAL_CACHE_EXPIRY);
            this.characterId = window.PGE?.characterData?.character.id;
            this.jsonMarketData = null;
            this.jsonStorageKey = `PGE_MARKET_DATA`;
            this.storageKey = `MWI_ITEM_VALUE_HISTORY_${this.characterId}`;
            this.recordInterval = 30 * 1000 * 60; // 30分钟
            this.maxHistoryDays = 30; // 最多保留30天
            this.compressionThreshold = 7; // 7天后开始压缩
            this.autoRecordTimer = null;
            this.incrementButtonObserver = null;
            this.chartViewer = null;
            this.init();
        }

        async init() {
            await super.init();
            this.loadJsonMarketDataFromStorage();
            this.startAutoRecord();
            this.cleanupOldData();
            this.setupIncrementButtonObserver();
            this.chartViewer = new AssetChartViewer(this);
            await this.calculateItemValues();
        }

        // 从localStorage加载JSON数据
        loadJsonMarketDataFromStorage() {
            try {
                const saved = localStorage.getItem(this.jsonStorageKey);
                if (saved) {
                    this.jsonMarketData = JSON.parse(saved);
                    return true;
                }
            } catch (error) {
                console.error('[ItemValueCalculator] 从localStorage加载JSON市场数据失败:', error);
            }
            return false;
        }

        // 保存JSON数据到localStorage
        saveJsonMarketDataToStorage() {
            try {
                if (this.jsonMarketData) {
                    localStorage.setItem(this.jsonStorageKey, JSON.stringify(this.jsonMarketData));
                }
            } catch (error) {
                console.error('[ItemValueCalculator] 保存JSON市场数据到localStorage失败:', error);
            }
        }

        // 获取JSON市场数据并更新localStorage
        async updateJsonMarketData() {
            try {
                const response = await fetch('https://raw.githubusercontent.com/holychikenz/MWIApi/main/milkyapi.json');
                if (!response.ok) {
                    throw new Error(`HTTP错误: ${response.status}`);
                }
                const newData = await response.json();
                const marketData = newData.market || newData;

                if (!this.jsonMarketData) {
                    this.jsonMarketData = marketData;
                } else {
                    let updatedCount = 0;
                    for (const [itemName, itemData] of Object.entries(marketData)) {
                        this.jsonMarketData[itemName] = itemData;
                        updatedCount++;
                    }
                }

                // 保存到localStorage
                this.saveJsonMarketDataToStorage();
                return true;
            } catch (error) {
                console.error('[ItemValueCalculator] 更新JSON市场数据失败:', error);
                return false;
            }
        }

        // 获取本地时间
        getLocalDateString(timestamp = null) {
            const date = timestamp ? new Date(timestamp) : new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // 获取今日增量
        getTodayIncrement() {
            const historyData = this.getHistoryData();
            const today = this.getLocalDateString(); // 使用本地时区日期

            // 筛选今天的记录
            const todayRecords = historyData.filter(record => record.date === today);

            if (todayRecords.length === 0) {
                return { askIncrement: 0, bidIncrement: 0 };
            }

            // 按时间排序
            todayRecords.sort((a, b) => a.timestamp - b.timestamp);

            const firstRecord = todayRecords[0];
            const lastRecord = todayRecords[todayRecords.length - 1];

            const askIncrement = lastRecord.totalAsk - firstRecord.totalAsk;
            const bidIncrement = lastRecord.totalBid - firstRecord.totalBid;

            return {
                askIncrement,
                bidIncrement
            };
        }

        // 创建增量显示按钮
        createIncrementButton() {
            const button = document.createElement('button');
            button.className = 'MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-1q2h7u5';
            button.setAttribute('tabindex', '-1');
            button.setAttribute('type', 'button');
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', 'false');

            const span = document.createElement('span');
            span.className = 'MuiBadge-root TabsComponent_badge__1Du26 css-1rzb3uu';

            const textSpan = document.createElement('span');

            // 使用class而不是id，避免重复id问题
            const askSpan = document.createElement('span');
            askSpan.className = 'ask-increment';
            askSpan.textContent = '0';

            const separatorSpan = document.createElement('span');
            separatorSpan.textContent = ' / ';
            separatorSpan.style.color = 'rgba(255, 255, 255, 0.7)';

            const bidSpan = document.createElement('span');
            bidSpan.className = 'bid-increment';
            bidSpan.textContent = '0';

            textSpan.appendChild(askSpan);
            textSpan.appendChild(separatorSpan);
            textSpan.appendChild(bidSpan);

            const badge = document.createElement('span');
            badge.className = 'MuiBadge-badge MuiBadge-standard MuiBadge-invisible MuiBadge-anchorOriginTopRight MuiBadge-anchorOriginTopRightRectangular MuiBadge-overlapRectangular MuiBadge-colorWarning css-dpce5z';

            span.appendChild(textSpan);
            span.appendChild(badge);

            const ripple = document.createElement('span');
            ripple.className = 'MuiTouchRipple-root css-w0pj6f';

            button.appendChild(span);
            button.appendChild(ripple);

            button.addEventListener('click', (e) => {
                e.preventDefault();

                if (this.chartViewer) {
                    this.chartViewer.show();
                }
                this.updateIncrementDisplay();
            });

            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '';
            });

            return button;
        }

        // 更新增量显示
        updateIncrementDisplay() {
            const { askIncrement, bidIncrement } = this.getTodayIncrement();

            // 查找所有增量按钮并更新（最多2个）
            const buttons = document.querySelectorAll('[id^="value-increment-button"]');

            buttons.forEach((button, index) => {
                const askSpan = button.querySelector('#ask-increment') || button.querySelector('.ask-increment');
                const bidSpan = button.querySelector('#bid-increment') || button.querySelector('.bid-increment');

                if (askSpan && bidSpan) {
                    const formattedAsk = utils.formatProfit(askIncrement);
                    const formattedBid = utils.formatProfit(bidIncrement);

                    askSpan.textContent = formattedAsk;
                    bidSpan.textContent = formattedBid;

                    // 设置颜色
                    askSpan.style.color = askIncrement >= 0 ? '#4CAF50' : '#f44336';
                    bidSpan.style.color = bidIncrement >= 0 ? '#4CAF50' : '#f44336';

                    if (askIncrement === 0) {
                        askSpan.style.color = 'rgba(255, 255, 255, 0.7)';
                    }
                    if (bidIncrement === 0) {
                        bidSpan.style.color = 'rgba(255, 255, 255, 0.7)';
                    }
                }
            });
        }

        // 设置按钮插入观察器
        setupIncrementButtonObserver() {
            this.incrementButtonObserver = new MutationObserver(() => {
                this.insertIncrementButton();
            });

            this.incrementButtonObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 立即尝试插入一次
            setTimeout(() => {
                this.insertIncrementButton();
            }, 1000);
        }

        // 插入增量按钮
        insertIncrementButton() {
            const targetContainers = document.querySelectorAll('.CharacterManagement_characterManagement__2PhvW .css-k008qs');

            // 限制最多处理2个容器
            const maxContainers = Math.min(targetContainers.length, 2);
            let insertedAny = false;

            for (let i = 0; i < maxContainers; i++) {
                const targetContainer = targetContainers[i];

                // 检查这个容器是否已经有按钮（任何增量按钮都算）
                const hasButton = targetContainer.querySelector('[id^="value-increment-button"]');

                if (!hasButton) {
                    const buttonId = `value-increment-button-${i}`;
                    const button = this.createIncrementButton();
                    button.id = buttonId;

                    targetContainer.appendChild(button);
                    insertedAny = true;
                }
            }

            // 只有在插入了新按钮时才更新显示和设置定时器
            if (insertedAny) {
                this.updateIncrementDisplay();
                this.setupIncrementUpdateTimer();
            }
        }

        // 设置定时更新增量显示
        setupIncrementUpdateTimer() {
            // 如果已经有定时器就不再创建
            if (this.updateTimer) {
                return;
            }

            this.updateTimer = setInterval(() => {
                const buttons = document.querySelectorAll('[id^="value-increment-button"]');
                if (buttons.length > 0) {
                    this.updateIncrementDisplay();
                } else {
                    clearInterval(this.updateTimer);
                    this.updateTimer = null;
                }
            }, 60000); // 1分钟
        }

        //添加新数据后更新按钮显示
        addValueRecord(totalAsk, totalBid) {
            const now = Date.now();
            const historyData = this.getHistoryData();

            const newRecord = {
                timestamp: now,
                totalAsk,
                totalBid,
                date: this.getLocalDateString(now), // 使用本地时区日期
                time: new Date(now).toLocaleString('zh-CN') // 年月日小时分钟
            };

            // 添加新记录
            historyData.push(newRecord);

            // 压缩和清理数据
            const compressedData = this.compressHistoryData(historyData);
            this.saveHistoryData(compressedData);

            // 更新按钮显示
            setTimeout(() => {
                this.updateIncrementDisplay();
            }, 100);
        }

        // 数据存储管理
        getHistoryData() {
            try {
                const data = localStorage.getItem(this.storageKey);
                return data ? JSON.parse(data) : [];
            } catch (error) {
                console.error('获取历史数据失败:', error);
                return [];
            }
        }

        saveHistoryData(data) {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(data));
            } catch (error) {
                console.error('保存历史数据失败:', error);
            }
        }

        compressHistoryData(data) {
            const now = Date.now();
            const compressionDate = now - this.compressionThreshold * 24 * 60 * 60 * 1000;
            const maxDate = now - this.maxHistoryDays * 24 * 60 * 60 * 1000;

            // 分离需要压缩的数据和保留的数据
            const recentData = data.filter(record => record.timestamp > compressionDate);
            const oldData = data.filter(record => record.timestamp <= compressionDate && record.timestamp > maxDate);

            // 对旧数据按日期分组
            const dailyGroups = {};
            oldData.forEach(record => {
                const date = record.date;
                if (!dailyGroups[date]) {
                    dailyGroups[date] = [];
                }
                dailyGroups[date].push(record);
            });

            // 每天只保留最早和最晚的记录
            const compressedOldData = [];
            Object.values(dailyGroups).forEach(dayRecords => {
                dayRecords.sort((a, b) => a.timestamp - b.timestamp);
                compressedOldData.push(dayRecords[0]); // 最早的记录
                if (dayRecords.length > 1) {
                    compressedOldData.push(dayRecords[dayRecords.length - 1]); // 最晚的记录
                }
            });

            // 合并并按时间排序
            const result = [...compressedOldData, ...recentData];
            result.sort((a, b) => a.timestamp - b.timestamp);

            return result;
        }

        cleanupOldData() {
            const historyData = this.getHistoryData();
            const maxDate = Date.now() - this.maxHistoryDays * 24 * 60 * 60 * 1000;

            const filteredData = historyData.filter(record => record.timestamp > maxDate);

            if (filteredData.length < historyData.length) {
                this.saveHistoryData(filteredData);
            }
        }

        startAutoRecord() {
            // 清除之前的定时器
            if (this.autoRecordTimer) {
                clearInterval(this.autoRecordTimer);
            }

            // 设置定时器，每30分钟记录一次
            this.autoRecordTimer = setInterval(async () => {
                try {
                    const result = await this.calculateItemValues();
                    if (result) {
                        console.log('[ItemValueCalculator] 自动记录完成');
                    }
                } catch (error) {
                    console.error('[ItemValueCalculator] 自动记录失败:', error);
                }
            }, this.recordInterval);
        }

        stopAutoRecord() {
            if (this.autoRecordTimer) {
                clearInterval(this.autoRecordTimer);
                this.autoRecordTimer = null;
            }
        }

        // 获取物品价格
        async getItemPrice(itemHrid, enhancementLevel = 0) {
            // 特殊处理金币
            if (itemHrid === '/items/coin') {
                return { ask: 1, bid: 1 };
            }

            // 特殊处理牛铃
            if (itemHrid === '/items/cowbell') {
                return await this.getCowbellPrice();
            }

            if (enhancementLevel > 0) {
                return await this.getWebSocketPrice(itemHrid, enhancementLevel);
            } else {
                return await this.getJsonPrice(itemHrid);
            }
        }

        // 安全处理价格，将异常值转换为0
        safePrice(price) {
            if (price == null || isNaN(price)) {
                return 0;
            }
            return Math.max(0, price);
        }

        // 通过WebSocket获取价格
        async getWebSocketPrice(itemHrid, enhancementLevel) {
            try {
                const orderBooks = await this.getMarketData(itemHrid);
                if (orderBooks?.[enhancementLevel]) {
                    const { asks: asksList, bids: bidsList } = orderBooks[enhancementLevel];
                    const askPrice = asksList?.[0]?.price;
                    const bidPrice = bidsList?.[0]?.price;
                    return {
                        ask: this.safePrice(askPrice),
                        bid: this.safePrice(bidPrice)
                    };
                }
                return { ask: 0, bid: 0 };
            } catch (error) {
                console.error('WebSocket获取价格失败:', error);
                return { ask: 0, bid: 0 };
            }
        }

        // 通过JSON获取价格
        async getJsonPrice(itemHrid) {
            if (!this.jsonMarketData) {
                console.warn('[ItemValueCalculator] JSON市场数据不存在');
                return { ask: 0, bid: 0 };
            }

            const itemName = this.extractItemName(itemHrid);
            const marketItem = this.jsonMarketData[itemName];

            if (!marketItem) {
                return { ask: 0, bid: 0 };
            }

            return {
                ask: this.safePrice(marketItem.ask),
                bid: this.safePrice(marketItem.bid)
            };
        }

        // 获取牛铃价格
        async getCowbellPrice() {
            if (!this.jsonMarketData) {
                console.warn('[ItemValueCalculator] JSON市场数据不存在，无法获取牛铃价格');
                return { ask: 0, bid: 0 };
            }

            const bagMarketItem = this.jsonMarketData?.['Bag Of 10 Cowbells'];
            if (bagMarketItem) {
                const bagAskPrice = this.safePrice(bagMarketItem.ask);
                const bagBidPrice = this.safePrice(bagMarketItem.bid);
                return {
                    ask: bagAskPrice / 10,
                    bid: bagBidPrice / 10
                };
            }
            return { ask: 0, bid: 0 };
        }

        // 从itemHrid提取物品名称
        extractItemName(itemHrid) {
            if (typeof itemHrid !== 'string') return '';
            return itemHrid.replace('/items/', '')
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
        }

        // 计算宝箱loot价值
        async calculateChestLootValue(itemHrid, enhancementLevel = 0) {
            const lootDrops = lootData[itemHrid];
            if (!lootDrops) return { ask: 0, bid: 0 };

            let totalAskValue = 0;
            let totalBidValue = 0;

            // 获取所有loot物品的价格
            const lootItems = Object.keys(lootDrops);
            const pricePromises = lootItems.map(async (lootItemHrid) => {
                const quantity = lootDrops[lootItemHrid];
                const prices = await this.getItemPrice(lootItemHrid, enhancementLevel);
                return {
                    itemHrid: lootItemHrid,
                    quantity,
                    prices
                };
            });

            const lootPrices = await Promise.all(pricePromises);

            // 计算总价值
            lootPrices.forEach(({ quantity, prices }) => {
                totalAskValue += prices.ask * quantity;
                totalBidValue += prices.bid * quantity;
            });

            return {
                ask: totalAskValue,
                bid: totalBidValue
            };
        }

        // 检查物品是否是宝箱
        isChestItem(itemHrid) {
            return lootData.hasOwnProperty(itemHrid);
        }

        // 获取角色物品数据
        getCharacterItemMap() {
            try {
                const headerElement = document.querySelector('.MarketplacePanel_coinStack__1l0UD');
                if (!headerElement) {
                    throw new Error('未找到头部元素');
                }

                const reactKey = Object.keys(headerElement).find(key => key.startsWith('__reactProps'));
                const characterItemMap = headerElement[reactKey]?.children?._owner?.memoizedProps?.characterItemMap;

                if (!characterItemMap) {
                    throw new Error('未找到物品数据');
                }

                return characterItemMap;
            } catch (error) {
                console.error('获取物品数据失败:', error);
                return null;
            }
        }

        // 获取市场订单数据
        getMyMarketListingMap() {
            try {
                const headerElement = document.querySelector('.MarketplacePanel_coinStack__1l0UD');
                if (!headerElement) {
                    return null;
                }

                const reactKey = Object.keys(headerElement).find(key => key.startsWith('__reactProps'));
                const myMarketListingMap = headerElement[reactKey]?.children?._owner?.memoizedProps?.myMarketListingMap;

                return myMarketListingMap || null;
            } catch (error) {
                console.error('获取市场订单数据失败:', error);
                return null;
            }
        }

        // 计算单个物品价值
        async calculateSingleItem(item) {
            if (!item || !item.itemHrid || !item.count) return null;

            const itemName = this.extractItemName(item.itemHrid);
            const count = item.count;
            const enhancementLevel = item.enhancementLevel || 0;

            // 检查是否是宝箱
            if (this.isChestItem(item.itemHrid)) {
                const lootValue = await this.calculateChestLootValue(item.itemHrid, enhancementLevel);
                return {
                    itemName,
                    count,
                    enhancementLevel,
                    askPrice: lootValue.ask,
                    bidPrice: lootValue.bid,
                    totalAsk: lootValue.ask * count,
                    totalBid: lootValue.bid * count,
                    isChest: true
                };
            } else {
                // 普通物品
                const prices = await this.getItemPrice(item.itemHrid, enhancementLevel);
                return {
                    itemName,
                    count,
                    enhancementLevel,
                    askPrice: prices.ask,
                    bidPrice: prices.bid,
                    totalAsk: prices.ask * count,
                    totalBid: prices.bid * count,
                    isChest: false
                };
            }
        }

        // 计算市场订单价值
        async calculateMarketOrderValue(order) {
            if (!order || !order.itemHrid) return null;

            const itemName = this.extractItemName(order.itemHrid);
            const quantity = order.orderQuantity - order.filledQuantity;
            const enhancementLevel = order.enhancementLevel || 0;
            const price = order.price || 0;

            if (quantity <= 0) return null;

            if (!order.isSell) {
                // 购买订单：投入的金币
                const coinValue = quantity * price;
                return {
                    type: 'buy_order',
                    itemName,
                    quantity,
                    enhancementLevel,
                    price,
                    coinValue,
                    totalAsk: coinValue,
                    totalBid: coinValue
                };
            } else {
                // 出售订单：按市场价格计算物品价值
                let prices;
                if (this.isChestItem(order.itemHrid)) {
                    prices = await this.calculateChestLootValue(order.itemHrid, enhancementLevel);
                } else {
                    prices = await this.getItemPrice(order.itemHrid, enhancementLevel);
                }

                return {
                    type: 'sell_order',
                    itemName,
                    quantity,
                    enhancementLevel,
                    price,
                    askPrice: prices.ask,
                    bidPrice: prices.bid,
                    totalAsk: prices.ask * quantity,
                    totalBid: prices.bid * quantity
                };
            }
        }

        // 主计算函数
        async calculateItemValues() {
            try {
                // 在计算前更新JSON数据
                await this.updateJsonMarketData();

                const characterItemMap = this.getCharacterItemMap();
                if (!characterItemMap) {
                    throw new Error('无法获取物品数据，请确保在正确的游戏界面');
                }

                const myMarketListingMap = this.getMyMarketListingMap();

                let totalAskValue = 0;
                let totalBidValue = 0;
                let successCount = 0;
                let failedItems = [];

                // 遍历库存物品
                const itemEntries = characterItemMap instanceof Map ?
                    Array.from(characterItemMap.entries()) :
                    Object.entries(characterItemMap);

                for (let i = 0; i < itemEntries.length; i++) {
                    const [key, item] = itemEntries[i];
                    try {
                        const result = await this.calculateSingleItem(item);
                        if (result) {
                            totalAskValue += result.totalAsk;
                            totalBidValue += result.totalBid;
                            successCount++;
                        } else {
                            failedItems.push(`库存物品: ${item.itemHrid || 'Unknown'}`);
                        }
                    } catch (error) {
                        console.error(`[ItemValueCalculator] 计算库存物品失败:`, item, error);
                        failedItems.push(`库存物品: ${item.itemHrid || 'Unknown'} (${error.message})`);
                    }
                }

                // 处理市场订单
                if (myMarketListingMap) {
                    const orderEntries = myMarketListingMap instanceof Map ?
                        Array.from(myMarketListingMap.entries()) :
                        Object.entries(myMarketListingMap);

                    for (let i = 0; i < orderEntries.length; i++) {
                        const [key, order] = orderEntries[i];
                        try {
                            const result = await this.calculateMarketOrderValue(order);
                            if (result) {
                                totalAskValue += result.totalAsk;
                                totalBidValue += result.totalBid;
                                successCount++;
                            } else {
                                failedItems.push(`市场订单: ${order.itemHrid || 'Unknown'}`);
                            }
                        } catch (error) {
                            console.error(`[ItemValueCalculator] 计算市场订单失败:`, order, error);
                            failedItems.push(`市场订单: ${order.itemHrid || 'Unknown'} (${error.message})`);
                        }
                    }
                }

                // 记录数据到历史
                this.addValueRecord(totalAskValue, totalBidValue);

                // 输出统计信息
                const totalItems = itemEntries.length + (myMarketListingMap ? Object.keys(myMarketListingMap).length : 0);
                console.log(`[ItemValueCalculator] 计算完成 - 计算数量: ${successCount}, Ask总值: ${totalAskValue.toFixed(0)}, Bid总值: ${totalBidValue.toFixed(0)}`);

                if (failedItems.length > 0) {
                }

                return {
                    totalAsk: totalAskValue,
                    totalBid: totalBidValue,
                    successCount,
                    totalItems,
                    failedItems
                };

            } catch (error) {
                console.error('❌ 计算失败:', error.message);
                throw error;
            }
        }

        getContainerId() { return 'item-value-calculator'; }
        getPessimisticId() { return 'item-value-pessimistic'; }
        getOptimisticId() { return 'item-value-optimistic'; }
        getWaitingText() { return LANG.chart.calculating; }
        getActionData() { return null; }
        calculateProfit() { return null; }
        getStateFingerprint() { return ''; }
        setupUI() { }

        // 清理资源
        cleanup() {
            this.stopAutoRecord();

            if (this.incrementButtonObserver) {
                this.incrementButtonObserver.disconnect();
                this.incrementButtonObserver = null;
            }

            if (this.chartViewer) {
                this.chartViewer.hide();
                this.chartViewer = null;
            }

            // 清理按钮
            const buttons = document.querySelectorAll('[id^="value-increment-button"]');
            buttons.forEach(button => button.remove());

            if (this.updateTimer) {
                clearInterval(this.updateTimer);
                this.updateTimer = null;
            }
        }
    }

    // ==================== 资产变化图表查看器 ====================
    class AssetChartViewer {
        constructor(itemValueCalculator) {
            this.calculator = itemValueCalculator;
            this.chartContainer = null;
            this.myChart = null;
            this.isVisible = false;
            this.selectedDays = 7;
            this.chartData = null;
            this.isMobile = this.isMobileDevice();

            // 图表配置
            this.chartConfig = {
                colors: {
                    ask: 'rgba(255, 99, 132, 1)',
                    bid: 'rgba(54, 162, 235, 1)',
                    ma: 'rgba(75, 192, 192, 1)',
                    trend: 'rgba(255, 159, 64, 1)'
                },
                backgroundColor: '#191c2b',
                textColor: '#FFFFFF',
                gridColor: 'rgba(255,255,255,0.2)'
            };

            // 数据集显示状态
            this.datasetVisibility = this.loadDatasetVisibility();

            this.init();
        }

        // 检测是否为移动设备
        isMobileDevice() {
            const ua = navigator.userAgent || navigator.vendor || window.opera;
            const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
            const aspectRatio = window.innerHeight / window.innerWidth;
            return mobileUA || (aspectRatio >= 1.2);
        }

        // 加载图例显示状态
        loadDatasetVisibility() {
            const defaultVisibility = { ask: true, bid: false, ma: false, trend: false };
            try {
                const saved = JSON.parse(localStorage.getItem('MWI_AssetChart_DatasetVisibility'));
                return Object.assign(defaultVisibility, saved);
            } catch (e) {
                return defaultVisibility;
            }
        }

        // 保存图例显示状态
        saveDatasetVisibility(visibility) {
            localStorage.setItem('MWI_AssetChart_DatasetVisibility', JSON.stringify(visibility));
        }

        // 保存/加载时间范围设置
        loadRangeSetting() {
            return localStorage.getItem('MWI_AssetChart_Range') || '7';
        }

        saveRangeSetting(range) {
            localStorage.setItem('MWI_AssetChart_Range', range);
        }

        init() {
            this.addStyles();
            this.createChartContainer();
            this.bindEvents();

            // 加载Chart.js（如果没有的话）
            this.loadChartJS();
        }

        // 加载Chart.js库
        loadChartJS() {
            if (typeof Chart !== 'undefined') {
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js';
            script.onload = () => {
            };
            document.head.appendChild(script);

            // 加载日期适配器
            const dateAdapter = document.createElement('script');
            dateAdapter.src = 'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js';
            document.head.appendChild(dateAdapter);
        }

        // 添加样式
        addStyles() {
            const style = document.createElement('style');

            let modalStyles = `
            .asset-chart-modal {
                display: none;
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.8);
                backdrop-filter: blur(5px);
                align-items: center;
                justify-content: center;
            }

            .asset-chart-modal-content {
                background-color: #191c2b;
                color: #FFFFFF;
                padding: 20px;
                border: 1px solid #444;
                border-radius: 8px;
                width: 90%;
                max-width: 1200px;
                height: 80%;
                max-height: 800px;
                position: relative;
                display: flex;
                flex-direction: column;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }

            .asset-chart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #444;
            }

            .asset-chart-title {
                font-size: 24px;
                font-weight: bold;
                margin: 0;
            }

            .asset-chart-controls {
                display: flex;
                gap: 15px;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }

            .asset-chart-time-range {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .asset-chart-time-btn {
                padding: 8px 16px;
                background-color: rgba(255, 255, 255, 0.1);
                color: #FFFFFF;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }

            .asset-chart-time-btn:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }

            .asset-chart-time-btn.active {
                background-color: rgba(33, 150, 243, 0.8);
                border-color: rgba(33, 150, 243, 1);
            }

            .asset-chart-canvas-container {
                flex: 1;
                position: relative;
                min-height: 0;
            }

            .asset-chart-canvas {
                background-color: #191c2b;
                border-radius: 4px;
                width: 100% !important;
                height: 100% !important;
            }

            .asset-chart-close-btn {
                position: absolute;
                top: 15px;
                right: 15px;
                background: transparent;
                border: none;
                color: #FFFFFF;
                font-size: 24px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: background-color 0.2s;
                z-index: 10001;
            }

            .asset-chart-close-btn:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }

            .asset-chart-info-panel {
                display: flex;
                gap: 20px;
                padding: 10px;
                background-color: rgba(0, 0, 0, 0.3);
                border-radius: 4px;
                margin-top: 10px;
                font-size: 14px;
                min-height: 40px;
                align-items: center;
            }
        `;

            // 移动端样式
            if (this.isMobile) {
                modalStyles += `
                .asset-chart-modal-content.mobile {
                    width: 100vh;
                    height: 100vw;
                    max-width: none;
                    max-height: none;
                    padding: 15px;
                    transform: rotate(90deg) translate(0, -100%);
                    transform-origin: top left;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

                .asset-chart-close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 28px;
                    z-index: 10001;
                }

                .asset-chart-controls {
                    flex-direction: column;
                    gap: 10px;
                }

                .asset-chart-time-range {
                    justify-content: center;
                }

                .asset-chart-title {
                    font-size: 20px;
                }
            `;
            }

            style.textContent = modalStyles;
            document.head.appendChild(style);
        }

        createChartContainer() {
            // 创建主容器
            this.chartContainer = document.createElement('div');
            this.chartContainer.id = 'asset-chart-modal';
            this.chartContainer.className = 'asset-chart-modal';
            this.chartContainer.style.display = 'none';

            // 创建模态框内容
            const modalContent = document.createElement('div');
            modalContent.className = 'asset-chart-modal-content';
            if (this.isMobile) {
                modalContent.classList.add('mobile');
            }

            // 创建关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.className = 'asset-chart-close-btn';
            closeBtn.textContent = '✕';
            closeBtn.addEventListener('click', () => this.hide());

            // 创建标题栏
            const header = document.createElement('div');
            header.className = 'asset-chart-header';

            const title = document.createElement('h2');
            title.className = 'asset-chart-title';
            title.textContent = LANG.chart.title;

            header.appendChild(title);

            // 创建控制面板
            const controls = document.createElement('div');
            controls.className = 'asset-chart-controls';

            // 时间范围选择
            const timeRangeContainer = document.createElement('div');
            timeRangeContainer.className = 'asset-chart-time-range';

            const timeRangeLabel = document.createElement('span');
            timeRangeLabel.textContent = LANG.chart.timeRange;
            timeRangeLabel.style.fontWeight = 'bold';

            const timeRangeButtons = [
                { label: LANG.chart.days[0], value: 1 },
                { label: LANG.chart.days[1], value: 3 },
                { label: LANG.chart.days[2], value: 7 },
                { label: LANG.chart.days[3], value: 14 },
                { label: LANG.chart.days[4], value: 30 }
            ];

            timeRangeContainer.appendChild(timeRangeLabel);

            timeRangeButtons.forEach(btn => {
                const button = document.createElement('button');
                button.className = 'asset-chart-time-btn';
                button.textContent = btn.label;
                button.dataset.value = btn.value;

                if (btn.value === this.selectedDays) {
                    button.classList.add('active');
                }

                button.addEventListener('click', () => {
                    this.selectedDays = btn.value;
                    this.saveRangeSetting(btn.value.toString());
                    this.updateTimeRangeButtons();
                    this.updateChart();
                });

                timeRangeContainer.appendChild(button);
            });

            controls.appendChild(timeRangeContainer);

            // 创建图表容器
            const canvasContainer = document.createElement('div');
            canvasContainer.className = 'asset-chart-canvas-container';

            const canvas = document.createElement('canvas');
            canvas.id = 'asset-chart-canvas';
            canvas.className = 'asset-chart-canvas';

            canvasContainer.appendChild(canvas);

            // 创建信息面板
            const infoPanel = document.createElement('div');
            infoPanel.className = 'asset-chart-info-panel';
            infoPanel.id = 'asset-chart-info-panel';
            infoPanel.innerHTML = `<span style="color: rgba(255, 255, 255, 0.7);">${LANG.chart.hoverTip}</span>`;

            // 组装界面
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(header);
            modalContent.appendChild(controls);
            modalContent.appendChild(canvasContainer);
            modalContent.appendChild(infoPanel);

            this.chartContainer.appendChild(modalContent);
            document.body.appendChild(this.chartContainer);

            // 存储元素引用
            this.elements = {
                canvas: canvas,
                infoPanel: infoPanel,
                timeRangeButtons: timeRangeButtons
            };
        }

        bindEvents() {
            // 点击背景关闭
            this.chartContainer.addEventListener('click', (e) => {
                if (e.target === this.chartContainer) {
                    this.hide();
                }
            });

            // ESC键关闭
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isVisible) {
                    this.hide();
                }
            });

            // 窗口大小变化
            window.addEventListener('resize', () => {
                if (this.isVisible && this.myChart) {
                    this.myChart.resize();
                }
            });
        }

        show() {
            this.isVisible = true;
            this.chartContainer.style.display = 'flex';

            // 加载保存的时间范围
            this.selectedDays = parseInt(this.loadRangeSetting());
            this.updateTimeRangeButtons();

            // 等待Chart.js加载完成后更新图表
            this.waitForChartJS().then(() => {
                this.updateChart();
            });
        }

        hide() {
            this.isVisible = false;
            this.chartContainer.style.display = 'none';
            this.destroyChart();
        }

        // 等待Chart.js加载完成
        waitForChartJS() {
            return new Promise((resolve) => {
                const checkChart = () => {
                    if (typeof Chart !== 'undefined') {
                        resolve();
                    } else {
                        setTimeout(checkChart, 100);
                    }
                };
                checkChart();
            });
        }

        destroyChart() {
            if (this.myChart) {
                this.myChart.destroy();
                this.myChart = null;
            }
        }

        updateTimeRangeButtons() {
            const buttons = this.chartContainer.querySelectorAll('.asset-chart-time-btn');
            buttons.forEach(button => {
                const value = parseInt(button.dataset.value);
                if (value === this.selectedDays) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        }

        // 准备图表数据
        prepareChartData() {
            const historyData = this.calculator.getHistoryData();

            if (historyData.length === 0) {
                this.chartData = null;
                return;
            }

            // 先按时间排序（从旧到新）
            const sortedData = [...historyData].sort((a, b) => a.timestamp - b.timestamp);

            // 找到最新的数据时间
            const latestTimestamp = sortedData[sortedData.length - 1].timestamp;
            const cutoffTime = latestTimestamp - (this.selectedDays * 24 * 60 * 60 * 1000);

            // 过滤指定时间范围的数据（从最新数据往前推）
            const filteredData = sortedData.filter(record => record.timestamp >= cutoffTime);

            if (filteredData.length === 0) {
                this.chartData = null;
                return;
            }

            // 数据清洗：去除异常值
            const cleanedData = this.cleanData(filteredData);
            this.chartData = {
                points: cleanedData,
                minTimestamp: Math.min(...cleanedData.map(p => p.timestamp)),
                maxTimestamp: Math.max(...cleanedData.map(p => p.timestamp))
            };
        }

        // 数据清洗函数
        cleanData(data) {
            const cleaned = [];
            let prevAsk = null, prevBid = null;

            data.forEach(point => {
                let newAsk = point.totalAsk;
                let newBid = point.totalBid;

                // 检测异常值并替换
                if (prevAsk && (newAsk > 2.5 * prevAsk || newAsk < 0.4 * prevAsk)) {
                    newAsk = prevAsk;
                }
                if (prevBid && (newBid > 2.5 * prevBid || newBid < 0.4 * prevBid)) {
                    newBid = prevBid;
                }

                cleaned.push({
                    timestamp: point.timestamp,
                    date: new Date(point.timestamp),
                    totalAsk: newAsk,
                    totalBid: newBid,
                    dateStr: point.dateStr
                });

                prevAsk = newAsk;
                prevBid = newBid;
            });

            return cleaned;
        }

        // 计算移动平均线
        calculateMovingAverage(data, windowSize = 5) {
            const maValues = [];

            for (let i = 0; i < data.length; i++) {
                if (i < windowSize - 1) {
                    maValues.push(null);
                } else {
                    let sum = 0;
                    for (let j = i - windowSize + 1; j <= i; j++) {
                        sum += (data[j].totalAsk + data[j].totalBid) / 2;
                    }
                    maValues.push(sum / windowSize);
                }
            }

            return maValues;
        }

        // 计算趋势线
        calculateTrendline(data) {
            const n = data.length;
            if (n < 2) return null;

            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

            data.forEach(point => {
                const x = point.timestamp;
                const y = (point.totalAsk + point.totalBid) / 2;
                sumX += x;
                sumY += y;
                sumXY += x * y;
                sumX2 += x * x;
            });

            const meanX = sumX / n;
            const meanY = sumY / n;
            const slope = (sumXY - n * meanX * meanY) / (sumX2 - n * meanX * meanX);
            const intercept = meanY - slope * meanX;

            return [
                { x: data[0].timestamp, y: slope * data[0].timestamp + intercept },
                { x: data[n - 1].timestamp, y: slope * data[n - 1].timestamp + intercept }
            ];
        }

        updateChart() {
            if (!this.elements.canvas) return;

            // 准备数据
            this.prepareChartData();

            if (!this.chartData || this.chartData.points.length === 0) {
                this.showNoDataMessage();
                return;
            }

            const data = this.chartData.points;
            const times = data.map(point => point.date);
            const askPrices = data.map(point => point.totalAsk);
            const bidPrices = data.map(point => point.totalBid);

            // 计算移动平均线
            const maValues = this.calculateMovingAverage(data);

            // 计算趋势线
            const trendlineData = this.calculateTrendline(data);

            // 确定时间轴格式
            let timeUnit, timeFormat;
            if (this.selectedDays <= 3) {
                timeUnit = 'hour';
                timeFormat = 'HH:mm';
            } else {
                timeUnit = 'day';
                timeFormat = 'MM/dd';
            }

            // 销毁旧图表
            this.destroyChart();

            // 创建新图表
            const ctx = this.elements.canvas.getContext('2d');

            this.myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: times,
                    datasets: [
                        {
                            label: LANG.chart.datasets.askTotal,
                            data: askPrices,
                            borderColor: this.chartConfig.colors.ask,
                            backgroundColor: this.chartConfig.colors.ask + '20',
                            fill: false,
                            pointRadius: 2,
                            pointHoverRadius: 4,
                            tension: 0.1,
                            hidden: !this.datasetVisibility.ask
                        },
                        {
                            label: LANG.chart.datasets.bidTotal,
                            data: bidPrices,
                            borderColor: this.chartConfig.colors.bid,
                            backgroundColor: this.chartConfig.colors.bid + '20',
                            fill: false,
                            pointRadius: 2,
                            pointHoverRadius: 4,
                            tension: 0.1,
                            hidden: !this.datasetVisibility.bid
                        },
                        {
                            label: LANG.chart.datasets.movingAverage,
                            data: maValues,
                            borderColor: this.chartConfig.colors.ma,
                            backgroundColor: this.chartConfig.colors.ma + '20',
                            fill: false,
                            pointRadius: 0,
                            pointHoverRadius: 3,
                            tension: 0.1,
                            hidden: !this.datasetVisibility.ma
                        },
                        {
                            label: LANG.chart.datasets.trendLine,
                            data: trendlineData,
                            borderColor: this.chartConfig.colors.trend,
                            backgroundColor: this.chartConfig.colors.trend + '20',
                            fill: false,
                            borderDash: [5, 5],
                            pointRadius: 0,
                            pointHoverRadius: 0,
                            tension: 0,
                            hidden: !this.datasetVisibility.trend
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    backgroundColor: this.chartConfig.backgroundColor,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: this.chartConfig.textColor,
                                usePointStyle: true,
                                padding: 20
                            },
                            onClick: (e, legendItem, legend) => {
                                // 调用默认行为
                                Chart.defaults.plugins.legend.onClick(e, legendItem, legend);

                                // 保存新的可见性状态
                                const chart = legend.chart;
                                const newVisibility = {
                                    ask: !chart.getDatasetMeta(0).hidden,
                                    bid: !chart.getDatasetMeta(1).hidden,
                                    ma: !chart.getDatasetMeta(2).hidden,
                                    trend: !chart.getDatasetMeta(3).hidden
                                };

                                this.datasetVisibility = newVisibility;
                                this.saveDatasetVisibility(newVisibility);
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: this.chartConfig.textColor,
                            bodyColor: this.chartConfig.textColor,
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderWidth: 1,
                            callbacks: {
                                label: (context) => {
                                    const value = context.parsed.y;
                                    return `${context.dataset.label}: ${this.formatAccurateValue(value)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: timeUnit,
                                tooltipFormat: timeFormat,
                                displayFormats: {
                                    hour: 'HH:mm',
                                    day: 'MM/dd'
                                }
                            },
                            grid: {
                                color: this.chartConfig.gridColor
                            },
                            ticks: {
                                color: this.chartConfig.textColor
                            }
                        },
                        y: {
                            grid: {
                                color: this.chartConfig.gridColor
                            },
                            ticks: {
                                color: this.chartConfig.textColor,
                                callback: (value) => this.formatValue(value)
                            }
                        }
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    onHover: (event, activeElements) => {
                        if (activeElements.length > 0) {
                            const dataIndex = activeElements[0].index;
                            const point = data[dataIndex];
                            this.updateInfoPanel(point);
                        } else {
                            this.clearInfoPanel();
                        }
                    }
                }
            });
        }

        formatAccurateValue(value) {
            if (value === null || value === undefined || isNaN(value)) {
                return '0';
            }

            // 将数值转换为整数（去掉小数点）
            const intValue = Math.round(value);

            // 添加千位分隔符
            return intValue.toLocaleString();
        }

        showNoDataMessage() {
            this.destroyChart();
            const ctx = this.elements.canvas.getContext('2d');
            ctx.fillStyle = this.chartConfig.textColor;
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(LANG.chart.noData, this.elements.canvas.width / 2, this.elements.canvas.height / 2);
        }

        updateInfoPanel(point) {
            const { askIncrement, bidIncrement } = this.calculator.getTodayIncrement();

            // 计算Ask增量颜色
            let askColor = '#4CAF50'; // 默认绿色（正数）
            if (askIncrement < 0) {
                askColor = '#f44336'; // 红色（负数）
            } else if (askIncrement === 0) {
                askColor = 'rgba(255, 255, 255, 0.7)'; // 中性色（零）
            }

            // 计算Bid增量颜色
            let bidColor = '#4CAF50'; // 默认绿色（正数）
            if (bidIncrement < 0) {
                bidColor = '#f44336'; // 红色（负数）
            } else if (bidIncrement === 0) {
                bidColor = 'rgba(255, 255, 255, 0.7)'; // 中性色（零）
            }

            this.elements.infoPanel.innerHTML = `
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div>
                        <strong style="color: rgba(255, 255, 255, 0.9);">${LANG.chart.todayIncrement}</strong>
                        <span style="color: ${askColor}; font-weight: bold; margin-left: 8px;">
                            ${this.formatAccurateValue(askIncrement)}
                        </span>
                        <span style="color: rgba(255, 255, 255, 0.7); margin: 0 4px;">/</span>
                        <span style="color: ${bidColor}; font-weight: bold;">
                            ${this.formatAccurateValue(bidIncrement)}
                        </span>
                    </div>
                </div>
            `;
        }

        clearInfoPanel() {
            this.elements.infoPanel.innerHTML = `<span style="color: rgba(255, 255, 255, 0.7);">${LANG.chart.hoverTip}</span>`;
        }

        formatValue(value) {
            if (Math.abs(value) >= 1e9) {
                return (value / 1e9).toFixed(1) + 'B';
            } else if (Math.abs(value) >= 1e6) {
                return (value / 1e6).toFixed(1) + 'M';
            } else if (Math.abs(value) >= 1e3) {
                return (value / 1e3).toFixed(1) + 'K';
            } else {
                return value.toFixed(0);
            }
        }
    }

    // ==================== 购物车管理器 ====================
    class ShoppingCartManager {
        constructor() {
            this.items = new Map();
            this.savedLists = new Map();
            this.isOpen = false;
            this.cartContainer = null;
            this.maxSavedLists = 5;
            this.currentListName = '';
            this.wasDragged = false;
            this.cartTabPosition = this.loadCartTabPosition();
            this.allSelected = true; // 全选状态
            this.defaultPurchaseMode = 'bid'; // 默认购买方式：bid（求购）
            this.init();
        }

        init() {
            this.createCartDrawer();
            this.loadCartFromStorage();
            this.loadSavedListsFromStorage();
            this.updateCartBadge();
            this.updateSavedListsDisplay();
            this.setupMarketCartButton();

            setTimeout(() => {
                this.updateCartBadge();
                this.updateCartDisplay();
                this.updateSavedListsDisplay();

                const listNameInput = document.getElementById('list-name-input');
                if (listNameInput) {
                    listNameInput.value = this.currentListName;
                }

                this.setCartTabInitialPosition();
            }, 0);
        }

        // 加载购物车标签位置
        loadCartTabPosition() {
            try {
                const saved = JSON.parse(localStorage.getItem('milkyway-cart-tab-position'));
                return saved || { y: '50%' };
            } catch (error) {
                return { y: '50%' };
            }
        }

        // 保存购物车标签位置
        saveCartTabPosition() {
            try {
                localStorage.setItem('milkyway-cart-tab-position', JSON.stringify(this.cartTabPosition));
            } catch (error) {
                console.warn('保存购物车标签位置失败:', error);
            }
        }

        setCartTabInitialPosition() {
            const cartTab = document.getElementById('cart-tab');
            if (cartTab && this.cartTabPosition.y) {
                cartTab.style.top = this.cartTabPosition.y;
            }
        }

        createCartDrawer() {
            this.cartContainer = document.createElement('div');
            this.cartContainer.id = 'shopping-cart-drawer';

            utils.applyStyles(this.cartContainer, {
                position: 'fixed',
                top: '80px',
                right: '0',
                width: Math.min(window.innerWidth, 450) + 'px', // 增加宽度以容纳新功能
                height: '75vh',
                backgroundColor: 'rgba(42, 43, 66, 0.95)',
                border: '1px solid var(--border)',
                borderRight: 'none',
                borderTopLeftRadius: '8px',
                borderBottomLeftRadius: '8px',
                backdropFilter: 'blur(10px)',
                boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
                zIndex: '9999',
                transform: `translateX(${Math.min(window.innerWidth, 450)}px)`,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            });

            this.cartContainer.innerHTML = `
            <!-- 购物车标签/触发器 -->
            <div id="cart-tab" style="
                position: absolute;
                left: -40px;
                top: ${this.cartTabPosition.y};
                transform: translateY(-50%);
                width: 40px;
                height: 80px;
                background: rgba(42, 43, 66, 0.95);
                border: 1px solid var(--border);
                border-right: none;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: -2px 0 8px rgba(0,0,0,0.2);
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            ">
                <div style="
                    font-size: 18px;
                    margin-bottom: 4px;
                    white-space: nowrap;
                    color: var(--color-text-dark-mode);
                ">🛒</div>
                <div id="cart-tab-badge" style="
                    background: #f44336;
                    color: white;
                    border-radius: 10px;
                    min-width: 18px;
                    height: 18px;
                    font-size: 10px;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                ">0</div>
            </div>

            <!-- 购物车头部 -->
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                border-bottom: 1px solid var(--border-separator);
                background: var(--card-title-background);
                border-top-left-radius: 8px;
                flex-shrink: 0;
            ">
                <h3 style="
                    margin: 0;
                    color: var(--card-title-text);
                    font-size: 16px;
                    font-weight: bold;
                ">${LANG.shoppingCart}</h3>
                <div style="
                    background: rgba(156, 39, 176, 0.2);
                    color: var(--color-text-dark-mode);
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 500;
                " id="cart-count-display">0 ${LANG.cartItem}</div>
            </div>

            <!-- 全局控制区域 -->
            <div style="
                padding: 12px 16px;
                border-bottom: 1px solid var(--border-separator);
                background: var(--card-background);
                flex-shrink: 0;
            ">
                <!-- 全选控制 -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <label style="display: flex; align-items: center; cursor: pointer; color: var(--color-text-dark-mode); font-size: 13px;">
                        <input type="checkbox" id="select-all-checkbox" checked style="margin-right: 8px; transform: scale(1.1);">
                        ${LANG.selectAll}
                    </label>
                </div>
                
                <!-- 批量购买方式设置 -->
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--color-text-dark-mode); font-size: 12px; font-weight: 500;">${LANG.batchSettings}</span>
                    <button id="batch-set-ask" style="
                        flex: 1;
                        padding: 6px 12px;
                        background-color: rgba(217, 89, 97, 0.8);
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 500;
                        transition: background-color 0.2s;
                        white-space: nowrap;
                    ">${LANG.directBuy}</button>
                    <button id="batch-set-bid" style="
                        flex: 1;
                        padding: 6px 12px;
                        background-color: rgba(47, 196, 167, 0.8);
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 500;
                        transition: background-color 0.2s;
                        white-space: nowrap;
                    ">${LANG.bidOrder}</button>
                </div>
            </div>

            <!-- 保存清单区域 -->
            <div style="
                padding: 12px 16px;
                border-bottom: 1px solid var(--border-separator);
                background: var(--card-background);
                flex-shrink: 0;
            ">
                <div style="display: flex; gap: 8px; align-items: center;">
                    <input id="list-name-input" type="text" placeholder="${LANG.listName}" maxlength="20" style="
                        flex: 1;
                        padding: 6px 8px;
                        background-color: var(--item-background);
                        border: 1px solid var(--item-border);
                        border-radius: 4px;
                        color: var(--color-text-dark-mode);
                        font-size: 12px;
                        outline: none;
                    ">
                    <button id="save-list-btn" style="
                        padding: 6px 12px;
                        background-color: rgba(33, 150, 243, 0.8);
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 500;
                        transition: background-color 0.2s;
                        white-space: nowrap;
                    ">${LANG.save}</button>
                </div>
            </div>

            <!-- 导入导出区域 -->
            <div style="
                padding: 8px 16px;
                border-bottom: 1px solid var(--border-separator);
                background: var(--card-background);
                flex-shrink: 0;
            ">
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button id="export-lists-btn" style="
                        flex: 1;
                        padding: 6px 12px;
                        background-color: rgba(76, 175, 80, 0.8);
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 500;
                        transition: background-color 0.2s;
                        white-space: nowrap;
                    ">${LANG.exportSavedLists}</button>
                    <button id="import-lists-btn" style="
                        flex: 1;
                        padding: 6px 12px;
                        background-color: rgba(33, 150, 243, 0.8);
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 500;
                        transition: background-color 0.2s;
                        white-space: nowrap;
                    ">${LANG.importSavedLists}</button>
                </div>
            </div>

            <!-- 购物车内容 -->
            <div id="cart-items-container" style="
                flex: 1;
                overflow-y: auto;
                padding: 8px;
                background: var(--card-background);
                min-height: 0;
            "></div>

            <!-- 已保存清单 -->
            <div style="
                border-top: 1px solid var(--border-separator);
                background: var(--card-background);
                flex-shrink: 0;
                max-height: 200px;
                display: flex;
                flex-direction: column;
            ">
                <div style="
                    padding: 8px 16px;
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--color-neutral-400);
                    border-bottom: 1px solid var(--border-separator);
                ">${LANG.savedLists}</div>
                <div id="saved-lists-container" style="
                    flex: 1;
                    overflow-y: auto;
                    padding: 8px;
                    min-height: 0;
                "></div>
            </div>

            <!-- 购物车操作按钮 -->
            <div id="cart-actions" style="
                padding: 12px 16px;
                border-top: 1px solid var(--border-separator);
                background: var(--card-background);
                border-bottom-left-radius: 8px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                flex-shrink: 0;
            ">
                <button id="cart-purchase-btn" style="
                    padding: 10px 12px;
                    background-color: rgba(30, 58, 138, 0.85);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background-color 0.2s;
                    font-size: 14px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                ">${LANG.purchaseAll}</button>
                <button id="cart-clear-btn" style="
                    padding: 6px 12px;
                    background-color: transparent;
                    color: var(--color-neutral-400);
                    border: 1px solid var(--border-separator);
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                ">${LANG.cartClear}</button>
            </div>
        `;

            document.body.appendChild(this.cartContainer);
            this.bindEvents();
            this.updateCartDisplay();

            setTimeout(() => {
                const listNameInput = document.getElementById('list-name-input');
                if (listNameInput) {
                    listNameInput.value = this.currentListName;
                }
            }, 0);
        }

        // 在 ShoppingCartManager 类中，修改 createPurchaseModeToggle 方法

        createPurchaseModeToggle(mode = 'bid') {
            const toggle = document.createElement('div');
            toggle.className = 'purchase-mode-toggle';
            toggle.setAttribute('data-mode', mode);

            const isAsk = mode === 'ask';
            const borderColor = isAsk ? 'rgba(217, 89, 97, 1)' : 'rgba(47, 196, 167, 1)';
            const sliderBg = isAsk ? 'rgba(217, 89, 97, 1)' : 'rgba(47, 196, 167, 1)';
            const sliderText = isAsk ? `${LANG.directBuyMode}` : `${LANG.bidOrderMode}`;
            const sliderPosition = isAsk ? 'left: 2px' : 'right: 2px';
            const toggleBackgroundColor = 'var(--item-background)';

            toggle.style.cssText = `
                position: relative;
                width: 70px;
                height: 24px;
                background: ${toggleBackgroundColor};
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid ${borderColor};
                flex-shrink: 0;
            `;

            toggle.innerHTML = `
                <div class="toggle-slider" style="
                    position: absolute;
                    top: 1px;
                    ${sliderPosition};
                    width: 32px;
                    height: 18px;
                    background: ${sliderBg};
                    border-radius: 9px;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 9px;
                    font-weight: bold;
                ">${sliderText}</div>
                <div style="
                    position: absolute;
                    top: 1px;
                    left: 2px;
                    width: 32px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${isAsk ? 'var(--color-text-dark-mode)' : 'var(--color-neutral-400)'};
                    font-size: 9px;
                    font-weight: bold;
                ">${LANG.directBuyMode}</div>
                <div style="
                    position: absolute;
                    top: 1px;
                    right: 2px;
                    width: 32px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${isAsk ? 'var(--color-neutral-400)' : 'var(--color-text-dark-mode)'};
                    font-size: 9px;
                    font-weight: bold;
                ">${LANG.bidOrderMode}</div>
            `;

            return toggle;
        }

        togglePurchaseMode(toggle) {
            const currentMode = toggle.getAttribute('data-mode');
            const newMode = currentMode === 'ask' ? 'bid' : 'ask';

            toggle.setAttribute('data-mode', newMode);

            const slider = toggle.querySelector('.toggle-slider');
            const isAsk = newMode === 'ask';
            const borderColor = isAsk ? 'rgba(217, 89, 97, 1)' : 'rgba(47, 196, 167, 1)';
            const sliderBg = isAsk ? 'rgba(217, 89, 97, 1)' : 'rgba(47, 196, 167, 1)';
            const sliderText = isAsk ? `${LANG.directBuyMode}` : `${LANG.bidOrderMode}`;

            // 更新切换器样式
            toggle.style.borderColor = borderColor;
            slider.style.backgroundColor = sliderBg;
            slider.style.left = isAsk ? '2px' : 'auto';
            slider.style.right = isAsk ? 'auto' : '2px';
            slider.textContent = sliderText;

            // 更新标签颜色
            const labels = toggle.querySelectorAll('div:not(.toggle-slider)');
            labels[0].style.color = isAsk ? 'var(--color-text-dark-mode)' : 'var(--color-neutral-400)'; // 直购
            labels[1].style.color = isAsk ? 'var(--color-neutral-400)' : 'var(--color-text-dark-mode)'; // 求购

            return newMode;
        }

        //设置市场购物车按钮
        setupMarketCartButton() {
            const observer = new MutationObserver((mutationsList) => {
                this.handleMarketCartButton(mutationsList);
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        //处理市场购物车按钮
        handleMarketCartButton(mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE &&
                            node.classList &&
                            [...node.classList].some(c => c.startsWith('MarketplacePanel_marketNavButtonContainer'))) {

                            const buttons = node.querySelectorAll('button');
                            if (buttons.length > 0 && !node.querySelector('.market-cart-btn')) {
                                const lastButton = buttons[buttons.length - 1];
                                const cartButton = lastButton.cloneNode(true);
                                cartButton.textContent = LANG.addToCart;
                                cartButton.classList.add('market-cart-btn');
                                cartButton.onclick = () => {
                                    this.addCurrentMarketItemToCart();
                                };
                                node.appendChild(cartButton);
                            }
                        }
                    });
                }
            }
        }

        //添加当前市场物品到购物车
        addCurrentMarketItemToCart() {
            const currentItem = document.querySelector('.MarketplacePanel_currentItem__3ercC');
            const svgElement = currentItem?.querySelector('svg[aria-label]');
            const useElement = svgElement?.querySelector('use');

            if (!svgElement || !useElement) return;

            const itemName = svgElement.getAttribute('aria-label');
            const itemId = useElement.getAttribute('href')?.split('#')[1];

            if (!itemName || !itemId) return;

            const itemInfo = {
                name: itemName,
                id: itemId,
                iconHref: `#${itemId}`
            };

            this.addItem(itemInfo, 1);
        }

        setupCartTabDragAndClick() {
            const cartTab = document.getElementById('cart-tab');
            if (!cartTab) return;

            let isDragging = false;
            let startY, currentTopPercent;

            const handleStart = (e) => {
                isDragging = true;
                this.wasDragged = false;

                const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

                const currentTop = cartTab.style.top;
                if (currentTop.includes('%')) {
                    currentTopPercent = parseFloat(currentTop);
                } else if (currentTop.includes('px')) {
                    const containerHeight = this.cartContainer.offsetHeight;
                    const topPx = parseFloat(currentTop);
                    currentTopPercent = (topPx / containerHeight) * 100;
                } else {
                    currentTopPercent = 50;
                }

                startY = clientY;
                cartTab.style.transition = 'none';
                e.preventDefault();
                e.stopPropagation();
            };

            const handleMove = (e) => {
                if (!isDragging) return;

                const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
                const deltaY = clientY - startY;

                if (Math.abs(deltaY) > 5) {
                    this.wasDragged = true;
                }

                const containerHeight = this.cartContainer.offsetHeight;
                const deltaPercent = (deltaY / containerHeight) * 100;

                let newPercent = currentTopPercent + deltaPercent;
                newPercent = Math.max(10, Math.min(newPercent, 90));
                cartTab.style.top = newPercent + '%';
                this.cartTabPosition.y = newPercent + '%';
            };

            const handleEnd = () => {
                if (!isDragging) return;
                isDragging = false;

                cartTab.style.transition = 'all 0.3s ease';

                this.saveCartTabPosition();

                setTimeout(() => {
                    if (!isDragging) {
                        this.wasDragged = false;
                    }
                }, 100);
            };

            // 点击事件处理
            const handleClick = (e) => {
                if (!this.wasDragged) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleCart();
                }
                // 重置拖拽状态
                setTimeout(() => {
                    this.wasDragged = false;
                }, 100);
            };

            // 右键清空购物车
            const handleContextMenu = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.items.size > 0 && !this.wasDragged) {
                    this.clearCart();
                }
            };

            // 鼠标事件
            cartTab.addEventListener('mousedown', handleStart);
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);

            // 触摸事件
            cartTab.addEventListener('touchstart', handleStart, { passive: false });
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('touchend', handleEnd);

            // 点击和右键事件
            cartTab.addEventListener('click', handleClick);
            cartTab.addEventListener('contextmenu', handleContextMenu);

            // 悬停效果
            cartTab.addEventListener('mouseenter', () => {
                if (!isDragging) {
                    cartTab.style.backgroundColor = 'rgba(156, 39, 176, 0.1)';
                    cartTab.style.transform = 'translateY(-50%) scale(1.05)';
                }
            });

            cartTab.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    cartTab.style.backgroundColor = 'rgba(42, 43, 66, 0.95)';
                    cartTab.style.transform = 'translateY(-50%) scale(1)';
                }
            });

            // 手机端触摸点击处理
            cartTab.addEventListener('touchend', (e) => {
                if (!this.wasDragged) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleCart();
                }
                setTimeout(() => {
                    this.wasDragged = false;
                }, 100);
            });
        }

        bindEvents() {
            const cartTab = document.getElementById('cart-tab');
            const purchaseBtn = document.getElementById('cart-purchase-btn');
            const clearBtn = document.getElementById('cart-clear-btn');
            const saveListBtn = document.getElementById('save-list-btn');
            const listNameInput = document.getElementById('list-name-input');
            const exportBtn = document.getElementById('export-lists-btn');
            const importBtn = document.getElementById('import-lists-btn');
            const selectAllCheckbox = document.getElementById('select-all-checkbox');
            const batchSetAskBtn = document.getElementById('batch-set-ask');
            const batchSetBidBtn = document.getElementById('batch-set-bid');

            this.setupCartTabDragAndClick();

            // 全选/反选
            selectAllCheckbox.addEventListener('change', () => {
                this.allSelected = selectAllCheckbox.checked;
                this.items.forEach(item => {
                    item.selected = this.allSelected;
                });
                this.updateCartDisplay();
                this.saveCartToStorage();
            });

            // 批量设置直购
            batchSetAskBtn.addEventListener('click', () => {
                this.batchSetPurchaseMode('ask');
            });

            // 批量设置求购
            batchSetBidBtn.addEventListener('click', () => {
                this.batchSetPurchaseMode('bid');
            });

            listNameInput.addEventListener('input', (e) => {
                const inputValue = e.target.value.trim();
                if (inputValue !== this.currentListName) {
                    this.currentListName = inputValue;
                    this.saveCartToStorage();
                }
            });

            purchaseBtn.addEventListener('click', () => this.executeSelectedPurchases());
            clearBtn.addEventListener('click', () => this.clearCart());

            saveListBtn.addEventListener('click', () => {
                const listName = listNameInput.value.trim();
                if (this.saveCurrentList(listName)) {
                    listNameInput.value = '';
                }
            });

            listNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const listName = listNameInput.value.trim();
                    if (this.saveCurrentList(listName)) {
                        listNameInput.value = '';
                    }
                }
            });

            exportBtn.addEventListener('click', () => this.exportShoppingLists());
            importBtn.addEventListener('click', () => this.importShoppingLists());

            // 悬停效果
            exportBtn.addEventListener('mouseenter', () => exportBtn.style.backgroundColor = 'rgba(76, 175, 80, 0.9)');
            exportBtn.addEventListener('mouseleave', () => exportBtn.style.backgroundColor = 'rgba(76, 175, 80, 0.8)');

            importBtn.addEventListener('mouseenter', () => importBtn.style.backgroundColor = 'rgba(33, 150, 243, 0.9)');
            importBtn.addEventListener('mouseleave', () => importBtn.style.backgroundColor = 'rgba(33, 150, 243, 0.8)');

            purchaseBtn.addEventListener('mouseenter', () => purchaseBtn.style.backgroundColor = 'rgba(30, 58, 138, 0.95)');
            purchaseBtn.addEventListener('mouseleave', () => purchaseBtn.style.backgroundColor = 'rgba(30, 58, 138, 0.85)');

            clearBtn.addEventListener('mouseenter', () => {
                clearBtn.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
                clearBtn.style.borderColor = '#f44336';
                clearBtn.style.color = '#f44336';
            });
            clearBtn.addEventListener('mouseleave', () => {
                clearBtn.style.backgroundColor = 'transparent';
                clearBtn.style.borderColor = 'var(--border-separator)';
                clearBtn.style.color = 'var(--color-neutral-400)';
            });

            saveListBtn.addEventListener('mouseenter', () => saveListBtn.style.backgroundColor = 'rgba(33, 150, 243, 0.9)');
            saveListBtn.addEventListener('mouseleave', () => saveListBtn.style.backgroundColor = 'rgba(33, 150, 243, 0.8)');

            batchSetAskBtn.addEventListener('mouseenter', () => batchSetAskBtn.style.backgroundColor = 'rgba(217, 89, 97, 0.9)');
            batchSetAskBtn.addEventListener('mouseleave', () => batchSetAskBtn.style.backgroundColor = 'rgba(217, 89, 97, 0.8)');

            batchSetBidBtn.addEventListener('mouseenter', () => batchSetBidBtn.style.backgroundColor = 'rgba(47, 196, 167, 0.9)');
            batchSetBidBtn.addEventListener('mouseleave', () => batchSetBidBtn.style.backgroundColor = 'rgba(47, 196, 167, 0.8)');

            listNameInput.addEventListener('focus', () => listNameInput.style.borderColor = 'var(--color-primary)');
            listNameInput.addEventListener('blur', () => listNameInput.style.borderColor = 'var(--item-border)');

            // 购物车事件委托
            this.cartContainer.addEventListener('click', (e) => {
                const removeBtn = e.target.closest('[data-remove-item]');
                if (removeBtn) {
                    e.stopPropagation();
                    const itemId = removeBtn.dataset.removeItem;
                    this.removeItem(itemId);
                    return;
                }

                const itemIcon = e.target.closest('[data-item-icon]');
                if (itemIcon) {
                    const itemId = itemIcon.dataset.itemIcon;
                    window.PGE.core.handleGoToMarketplace(`/items/${itemId}`, 0);
                    return;
                }

                const loadBtn = e.target.closest('[data-load-list]');
                if (loadBtn) {
                    e.stopPropagation();
                    const listName = loadBtn.dataset.loadList;
                    this.loadSavedList(listName);
                    return;
                }

                const deleteBtn = e.target.closest('[data-delete-list]');
                if (deleteBtn) {
                    e.stopPropagation();
                    const listName = deleteBtn.dataset.deleteList;
                    this.deleteSavedList(listName);
                    return;
                }

                // 购买方式切换器
                const toggle = e.target.closest('.purchase-mode-toggle[data-item-id]');
                if (toggle) {
                    e.stopPropagation();
                    const itemId = toggle.dataset.itemId;
                    const newMode = this.togglePurchaseMode(toggle);
                    const item = this.items.get(itemId);
                    if (item) {
                        item.purchaseMode = newMode;
                        this.saveCartToStorage();
                    }
                    return;
                }
            });

            // 数量输入变化事件
            this.cartContainer.addEventListener('input', (e) => {
                if (e.target.matches('input[data-item-id]')) {
                    const itemId = e.target.dataset.itemId;
                    let value = e.target.value;
                    if (value.length > 12) {
                        e.target.value = value.slice(0, 12);
                    }
                }
            });

            this.cartContainer.addEventListener('change', (e) => {
                // 数量变化
                if (e.target.matches('input[data-item-id][type="number"]')) {
                    const itemId = e.target.dataset.itemId;
                    let quantity = parseInt(e.target.value) || 1;
                    if (quantity < 1) quantity = 1;
                    if (quantity > 999999999999) quantity = 999999999999;
                    e.target.value = quantity;
                    this.updateItemQuantity(itemId, quantity);
                }

                // 选择状态变化
                if (e.target.matches('input[data-item-id][type="checkbox"]')) {
                    const itemId = e.target.dataset.itemId;
                    const item = this.items.get(itemId);
                    if (item) {
                        item.selected = e.target.checked;
                        this.updateSelectAllState();
                        this.saveCartToStorage();
                    }
                }
            });

            // 双击加载清单
            this.cartContainer.addEventListener('dblclick', (e) => {
                const listItem = e.target.closest('#saved-lists-container > div');
                if (listItem) {
                    e.stopPropagation();
                    e.preventDefault();

                    const loadBtn = listItem.querySelector('[data-load-list]');
                    if (loadBtn) {
                        const listName = loadBtn.dataset.loadList;
                        this.loadSavedList(listName);
                    }
                }
            });

            let mouseDownTarget = null;

            document.addEventListener('mousedown', (e) => {
                mouseDownTarget = e.target;
            }, true);

            document.addEventListener('click', (e) => {
                if (this.isOpen &&
                    !this.cartContainer.contains(e.target) &&
                    !this.cartContainer.contains(mouseDownTarget)) {
                    this.closeCart();
                }
                mouseDownTarget = null;
            }, true);
        }

        // 批量设置购买方式
        batchSetPurchaseMode(mode) {
            let changedCount = 0;

            // 为所有物品设置购买方式
            this.items.forEach(item => {
                if (item.purchaseMode !== mode) {
                    item.purchaseMode = mode;
                    changedCount++;
                }
            });

            // 更新默认购买方式
            this.defaultPurchaseMode = mode;

            if (changedCount > 0) {
                this.updateCartDisplay();
                this.saveCartToStorage();
            }
        }

        // 更新全选状态
        updateSelectAllState() {
            const allSelected = Array.from(this.items.values()).every(item => item.selected);
            const selectAllCheckbox = document.getElementById('select-all-checkbox');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allSelected;
            }
            this.allSelected = allSelected;
        }

        // 执行选中物品的购买
        async executeSelectedPurchases() {
            const selectedItems = Array.from(this.items.entries())
                .filter(([_, item]) => item.selected)
                .map(([itemId, item]) => ({
                    itemHrid: itemId.startsWith('/items/') ? itemId : `/items/${itemId}`,
                    quantity: item.quantity,
                    materialName: item.name,
                    cartItemId: itemId,
                    purchaseMode: item.purchaseMode || 'bid'
                }));

            if (selectedItems.length === 0) {
                this.showToast('请选择要购买的物品', 'warning');
                return;
            }

            const api = window.MWIModules?.api;
            if (!api?.isReady) {
                this.showToast(LANG.wsNotAvailable, 'error');
                return;
            }

            const purchaseBtn = document.getElementById('cart-purchase-btn');
            const clearBtn = document.getElementById('cart-clear-btn');

            const originalText = purchaseBtn.textContent;
            const originalBg = purchaseBtn.style.backgroundColor;

            // 禁用按钮
            purchaseBtn.disabled = true;
            clearBtn.disabled = true;
            purchaseBtn.textContent = '🔄 购买中...';
            purchaseBtn.style.backgroundColor = CONFIG.COLORS.disabled;
            purchaseBtn.style.cursor = 'not-allowed';
            clearBtn.style.backgroundColor = CONFIG.COLORS.disabled;
            clearBtn.style.cursor = 'not-allowed';
            clearBtn.style.opacity = '0.5';

            try {
                // 按购买方式分组
                const askItems = selectedItems.filter(item => item.purchaseMode === 'ask');
                const bidItems = selectedItems.filter(item => item.purchaseMode === 'bid');

                const results = [];

                // 执行直购
                if (askItems.length > 0) {
                    const askResults = await api.batchDirectPurchase(askItems, CONFIG.DELAYS.PURCHASE);
                    results.push(...askResults);
                }

                // 执行求购
                if (bidItems.length > 0) {
                    const bidResults = await api.batchBidOrder(bidItems, CONFIG.DELAYS.PURCHASE);
                    results.push(...bidResults);
                }

                // 处理结果
                this.processCartResults(results);

                // 移除购买成功的物品
                let successfulRemovals = 0;
                results.forEach(result => {
                    if (result.success && result.item.cartItemId) {
                        this.items.delete(result.item.cartItemId);
                        successfulRemovals++;
                    }
                });

                // 更新购物车显示
                if (successfulRemovals > 0) {
                    this.saveCartToStorage();
                    this.updateCartBadge();
                    this.updateCartDisplay();
                    this.updateSelectAllState();

                    // 如果购物车空了就关闭
                    if (this.items.size === 0) {
                        setTimeout(() => this.closeCart(), 1000);
                    }
                }

            } catch (error) {
                this.showToast(`${LANG.error}: ${error.message}`, 'error');
            } finally {
                // 恢复按钮状态
                purchaseBtn.disabled = false;
                clearBtn.disabled = false;
                purchaseBtn.textContent = originalText;
                purchaseBtn.style.backgroundColor = originalBg;
                purchaseBtn.style.cursor = 'pointer';
                clearBtn.style.backgroundColor = 'transparent';
                clearBtn.style.cursor = 'pointer';
                clearBtn.style.opacity = '1';
            }
        }

        // 处理购物车购买结果的方法
        processCartResults(results) {
            let successCount = 0;

            results.forEach(result => {
                const isBidOrder = result.item.purchaseMode === 'bid';
                const statusText = isBidOrder ?
                    (result.success ? LANG.submitted : LANG.failed) :
                    (result.success ? LANG.purchased : LANG.failed);

                const message = `${statusText} ${result.item.materialName || result.item.itemHrid} x${result.item.quantity}`;
                this.showToast(message, result.success ? 'success' : 'error', 2000);

                if (result.success) successCount++;
            });

            // 显示总结信息
            const finalMessage = successCount > 0 ?
                `${LANG.complete} ${LANG.success} ${successCount}/${results.length} ${LANG.cartItem}` :
                LANG.allFailed;

            this.showToast(finalMessage, successCount > 0 ? 'success' : 'error', successCount > 0 ? 5000 : 3000);
        }

        createAddAllToCartButton(type) {
            const btn = document.createElement('button');
            btn.textContent = LANG.addToCart;
            btn.className = 'unified-action-btn add-to-cart-btn';
            btn.setAttribute('data-button-type', 'add-to-cart');

            // 复用MaterialPurchaseManager的样式方法
            const materialManager = window.MWIModules?.materialPurchase;
            if (materialManager) {
                materialManager.applyUnifiedButtonStyle(btn, 'add-to-cart');
            }

            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await this.addAllNeededToCart(type);
            });

            return btn;
        }

        // 添加所有需要的材料到购物车
        async addAllNeededToCart(type) {
            try {
                const requirements = await MaterialCalculator.calculateRequirements(type);
                let addedCount = 0;

                for (const requirement of requirements) {
                    if (requirement.supplementNeeded > 0 && requirement.itemId && !requirement.itemId.includes('coin')) {
                        const itemInfo = {
                            name: requirement.materialName,
                            id: requirement.itemId,
                            iconHref: `#${requirement.itemId.replace('/items/', '')}`
                        };

                        this.addItem(itemInfo, requirement.supplementNeeded);
                        addedCount++;
                    }
                }

                if (addedCount > 0) {
                    this.showToast(`${LANG.add} ${addedCount} ${LANG.materials}${LANG.toCart}`, 'success', 3000);
                } else {
                    this.showToast(`${LANG.noMaterialsNeeded}`, 'info', 2000);
                }
            } catch (error) {
                console.error('添加所需材料到购物车失败:', error);
                this.showToast(`${LANG.addToCartFailed}`, 'error');
            }
        }

        saveCurrentList(listName) {
            if (!listName || listName.trim().length === 0) {
                this.showToast(LANG.pleaseEnterListName, 'warning');
                return false;
            }

            if (this.items.size === 0) {
                this.showToast(LANG.cartEmptyCannotSave, 'warning');
                return false;
            }

            if (this.savedLists.size >= this.maxSavedLists && !this.savedLists.has(listName)) {
                this.showToast(`${LANG.maxListsLimit}${this.maxSavedLists}${LANG.lists}`, 'warning');
                return false;
            }

            const listData = {
                name: listName.trim(),
                items: {},
                savedAt: Date.now()
            };

            for (const [itemId, itemData] of this.items) {
                listData.items[itemId] = {
                    name: itemData.name,
                    iconHref: itemData.iconHref,
                    quantity: itemData.quantity,
                    selected: itemData.selected !== false, // 默认选中
                    purchaseMode: itemData.purchaseMode || 'bid' // 默认求购
                };
            }

            this.savedLists.set(listName, listData);
            this.currentListName = listName;
            this.saveSavedListsToStorage();
            this.saveCartToStorage();
            this.updateSavedListsDisplay();

            this.showToast(`"${listName}"${LANG.saved}`, 'success');
            return true;
        }

        loadSavedList(listName) {
            const listData = this.savedLists.get(listName);
            if (!listData) return false;

            this.items.clear();

            for (const [itemId, itemData] of Object.entries(listData.items)) {
                this.items.set(itemId, {
                    name: itemData.name,
                    iconHref: itemData.iconHref,
                    quantity: itemData.quantity,
                    selected: itemData.selected !== false, // 兼容旧数据，默认选中
                    purchaseMode: itemData.purchaseMode || 'bid' // 兼容旧数据，默认求购
                });
            }

            this.currentListName = listName;

            const listNameInput = document.getElementById('list-name-input');
            if (listNameInput) {
                listNameInput.value = listName;
            }

            this.saveCartToStorage();
            this.updateCartBadge();
            this.updateCartDisplay();
            this.updateSelectAllState();

            this.showToast(`"${listName}"${LANG.loaded}`, 'success');
            return true;
        }

        exportShoppingLists() {
            try {
                const listsData = Object.fromEntries(this.savedLists);

                if (Object.keys(listsData).length === 0) {
                    this.showToast(LANG.noListsToExport, 'warning');
                    return;
                }

                const exportData = {
                    timestamp: new Date().toLocaleString('sv-SE').replace(/[-:T ]/g, '').slice(0, 14),
                    version: '3.6.7',
                    lists: listsData
                };

                const jsonData = JSON.stringify(exportData, null, 2);
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `milkyway-shopping-lists-${new Date().toLocaleString('sv-SE').replace(/[-:T ]/g, '').slice(0, 14)}.json`;
                a.click();
                URL.revokeObjectURL(url);

                this.showToast(`${LANG.exportStatusPrefix} ${Object.keys(listsData).length} ${LANG.exportStatusSuffix}`, 'success');

            } catch (error) {
                console.error('导出失败:', error);
                this.showToast(`${LANG.exportFailed}: ${error.message}`, 'error');
            }
        }

        importShoppingLists() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.style.display = 'none';

            input.onchange = (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importData = JSON.parse(e.target.result);

                        if (!this.validateImportData(importData)) {
                            throw new Error(LANG.invalidImportFormat);
                        }

                        const listsData = importData.lists || importData;

                        this.savedLists.clear();

                        for (const [listName, listData] of Object.entries(listsData)) {
                            this.savedLists.set(listName, listData);
                        }

                        this.saveSavedListsToStorage();
                        this.updateSavedListsDisplay();

                        const importedCount = Object.keys(listsData).length;
                        const message = `${LANG.importStatusPrefix}${importedCount}${LANG.importStatusSuffix}`;

                        this.showToast(message, 'success');

                    } catch (error) {
                        console.error('导入失败:', error);
                        this.showToast(`${LANG.importFailed}: ${error.message}`, 'error');
                    }
                };

                reader.readAsText(file);
            };

            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        }

        validateImportData(data) {
            if (!data || typeof data !== 'object') return false;

            const listsData = data.lists || data;
            if (!listsData || typeof listsData !== 'object') return false;

            for (const [listName, listData] of Object.entries(listsData)) {
                if (!listData || typeof listData !== 'object') return false;
                if (!listData.name || typeof listData.name !== 'string') return false;
                if (!listData.items || typeof listData.items !== 'object') return false;
            }

            return true;
        }

        toggleCart() {
            if (this.isOpen) {
                this.closeCart();
            } else {
                this.openCart();
            }
        }

        openCart() {
            if (this.isOpen) return;
            this.cartContainer.style.transform = 'translateX(0)';
            this.isOpen = true;
        }

        closeCart() {
            if (!this.isOpen) return;
            this.cartContainer.style.transform = `translateX(${Math.min(window.innerWidth, 450) + 'px'})`;
            this.isOpen = false;
        }

        updateCartBadge() {
            const tabBadge = document.getElementById('cart-tab-badge');
            const countDisplay = document.getElementById('cart-count-display');

            if (!tabBadge || !countDisplay) return;

            const itemTypeCount = this.items.size;

            if (itemTypeCount > 0) {
                tabBadge.textContent = itemTypeCount > 99 ? '99+' : itemTypeCount.toString();
                tabBadge.style.display = 'flex';
                countDisplay.textContent = `${itemTypeCount} ${LANG.cartItem}`;
            } else {
                tabBadge.style.display = 'none';
                countDisplay.textContent = `0 ${LANG.cartItem}`;
            }
        }

        addItem(itemInfo, quantity = 1) {
            if (!itemInfo || !itemInfo.id || quantity <= 0) return;

            const existingItem = this.items.get(itemInfo.id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.items.set(itemInfo.id, {
                    name: itemInfo.name,
                    iconHref: itemInfo.iconHref,
                    quantity: quantity,
                    selected: true, // 新添加的物品默认选中
                    purchaseMode: this.defaultPurchaseMode // 使用默认购买方式
                });
            }

            this.saveCartToStorage();
            this.updateCartBadge();
            this.updateCartDisplay();
            this.updateSelectAllState();

            this.showToast(`${LANG.add} ${itemInfo.name} x${quantity} ${LANG.toCart}`, 'success', 2000);
        }

        removeItem(itemId) {
            this.items.delete(itemId);
            this.saveCartToStorage();
            this.updateCartBadge();
            this.updateCartDisplay();
            this.updateSelectAllState();

            if (this.items.size === 0) {
                this.closeCart();
            }
        }

        updateItemQuantity(itemId, quantity) {
            if (quantity <= 0) {
                this.removeItem(itemId);
                return;
            }

            const item = this.items.get(itemId);
            if (item) {
                item.quantity = quantity;
                this.saveCartToStorage();
                this.updateCartBadge();
            }
        }

        clearCart() {
            if (this.items.size === 0) return;

            this.items.clear();
            this.currentListName = '';

            const listNameInput = document.getElementById('list-name-input');
            if (listNameInput) {
                listNameInput.value = '';
            }

            const selectAllCheckbox = document.getElementById('select-all-checkbox');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = true;
            }

            this.allSelected = true;

            this.saveCartToStorage();
            this.updateCartBadge();
            this.updateCartDisplay();

            this.showToast(LANG.cartClearSuccess, 'success', 3000);

            if (this.isOpen) {
                this.closeCart();
            }
        }

        updateCartDisplay() {
            const container = document.getElementById('cart-items-container');
            if (!container) return;

            if (this.items.size === 0) {
                container.innerHTML = `
                <div style="
                    text-align: center;
                    color: var(--color-neutral-400);
                    padding: 40px 20px;
                    font-style: italic;
                    font-size: 14px;
                ">${LANG.cartEmpty}</div>
            `;
                return;
            }

            let html = '';
            for (const [itemId, item] of this.items) {
                const toggle = this.createPurchaseModeToggle(item.purchaseMode || 'bid');
                toggle.setAttribute('data-item-id', itemId);

                const toggleHTML = toggle.outerHTML;

                html += `
                <div style="
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    margin-bottom: 8px;
                    background-color: var(--item-background);
                    border: 1px solid var(--item-border);
                    border-radius: 6px;
                    transition: all 0.2s ease;
                " onmouseenter="this.style.backgroundColor='var(--item-background-hover)'; this.style.borderColor='var(--item-border-hover)'" onmouseleave="this.style.backgroundColor='var(--item-background)'; this.style.borderColor='var(--item-border)'">
                    
                    <!-- 选择框 -->
                    <input type="checkbox" data-item-id="${itemId}" ${item.selected !== false ? 'checked' : ''} style="
                        margin-right: 8px;
                        transform: scale(1.2);
                        cursor: pointer;
                    ">
                    
                    <!-- 物品图标 -->
                    <div data-item-icon="${itemId}" style="
                        width: 32px;
                        height: 32px;
                        margin-right: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: var(--item-background);
                        border-radius: 4px;
                        cursor: pointer;
                    ">
                        <svg width="100%" height="100%" style="max-width: 24px; max-height: 24px;">
                            <use href="/static/media/items_sprite.d4d08849.svg${item.iconHref}"></use>
                        </svg>
                    </div>
                    
                    <!-- 物品信息 -->
                    <div style="flex: 1; color: var(--color-text-dark-mode); min-width: 0;">
                        <div style="font-size: 13px; font-weight: 500; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
                    </div>
                    
                    <!-- 控制区域 -->
                    <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                        <!-- 购买方式切换器 -->
                        ${toggleHTML}
                        
                        <!-- 数量输入 -->
                        <input
                            type="number"
                            value="${item.quantity}"
                            min="1"
                            max="999999999999"
                            maxlength="12"
                            data-item-id="${itemId}"
                            style="
                                width: 120px;
                                padding: 4px 6px;
                                background-color: var(--item-background);
                                border: 1px solid var(--item-border);
                                border-radius: 3px;
                                color: var(--color-text-dark-mode);
                                font-size: 11px;
                                text-align: right;
                            "
                        >
                        
                        <!-- 删除按钮 -->
                        <button
                            data-remove-item="${itemId}"
                            style="
                                background: none;
                                border: none;
                                color: #f44336;
                                cursor: pointer;
                                padding: 4px;
                                border-radius: 3px;
                                transition: background-color 0.2s;
                                font-size: 12px;
                                width: 24px;
                                height: 24px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                flex-shrink: 0;
                            "
                            title="${LANG.cartRemove}"
                            onmouseenter="this.style.backgroundColor='rgba(244, 67, 54, 0.2)'"
                            onmouseleave="this.style.backgroundColor='transparent'"
                        >🗑️</button>
                    </div>
                </div>
            `;
            }

            container.innerHTML = html;
        }

        updateSavedListsDisplay() {
            const container = document.getElementById('saved-lists-container');
            if (!container) return;

            if (this.savedLists.size === 0) {
                container.innerHTML = `
                <div style="
                    text-align: center;
                    color: var(--color-neutral-400);
                    padding: 20px;
                    font-style: italic;
                    font-size: 12px;
                ">${LANG.noSavedLists}</div>
            `;
                return;
            }

            let html = '';
            const sortedLists = Array.from(this.savedLists.entries())
                .sort((a, b) => b[1].savedAt - a[1].savedAt);

            for (const [listName, listData] of sortedLists) {
                const itemCount = Object.keys(listData.items).length;

                html += `
                <div style="
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    margin-bottom: 6px;
                    background-color: var(--item-background);
                    border: 1px solid var(--item-border);
                    border-radius: 4px;
                    transition: all 0.2s ease;
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                " onmouseenter="this.style.backgroundColor='var(--item-background-hover)'" onmouseleave="this.style.backgroundColor='var(--item-background)'">
                    <div style="flex: 1; color: var(--color-text-dark-mode); min-width: 0;">
                        <div style="font-size: 12px; font-weight: 500; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${listName}</div>
                        <div style="font-size: 10px; color: var(--color-neutral-400);">${itemCount}${LANG.cartItem}</div>
                    </div>
                    <div style="display: flex; gap: 6px; flex-shrink: 0;">
                        <button
                            data-load-list="${listName}"
                            style="
                                background: rgba(76, 175, 80, 0.8);
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                padding: 6px 10px;
                                font-size: 11px;
                                font-weight: 500;
                                transition: background-color 0.2s;
                                line-height: 1;
                                white-space: nowrap;
                            "
                            title="加载清单"
                            onmouseenter="this.style.backgroundColor='rgba(76, 175, 80, 0.9)'"
                            onmouseleave="this.style.backgroundColor='rgba(76, 175, 80, 0.8)'"
                        >${LANG.load}</button>
                        <button
                            data-delete-list="${listName}"
                            style="
                                background: rgba(244, 67, 54, 0.8);
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                padding: 6px 10px;
                                font-size: 11px;
                                font-weight: 500;
                                transition: background-color 0.2s;
                                line-height: 1;
                                white-space: nowrap;
                            "
                            title="删除清单"
                            onmouseenter="this.style.backgroundColor='rgba(244, 67, 54, 0.9)'"
                            onmouseleave="this.style.backgroundColor='rgba(244, 67, 54, 0.8)'"
                        >${LANG.delete}</button>
                    </div>
                </div>
            `;
            }

            container.innerHTML = html;
        }

        saveCartToStorage() {
            try {
                const cartData = {
                    items: Object.fromEntries(this.items),
                    currentListName: this.currentListName,
                    allSelected: this.allSelected,
                    defaultPurchaseMode: this.defaultPurchaseMode
                };
                localStorage.setItem('milkyway-current-cart', JSON.stringify(cartData));
            } catch (error) {
                console.warn('保存当前购物车失败:', error);
            }
        }

        loadCartFromStorage() {
            try {
                const cartData = JSON.parse(localStorage.getItem('milkyway-current-cart') || '{}');

                // 加载物品数据，确保兼容旧格式
                const itemsData = cartData.items || {};
                this.items = new Map();

                for (const [itemId, itemData] of Object.entries(itemsData)) {
                    this.items.set(itemId, {
                        name: itemData.name,
                        iconHref: itemData.iconHref,
                        quantity: itemData.quantity,
                        selected: itemData.selected !== false, // 兼容旧数据，默认选中
                        purchaseMode: itemData.purchaseMode || 'bid' // 兼容旧数据，默认求购
                    });
                }

                this.currentListName = cartData.currentListName || '';
                this.allSelected = cartData.allSelected !== false; // 默认全选
                this.defaultPurchaseMode = cartData.defaultPurchaseMode || 'bid'; // 默认求购

                const listNameInput = document.getElementById('list-name-input');
                if (listNameInput) {
                    listNameInput.value = this.currentListName;
                }
            } catch (error) {
                console.warn('加载当前购物车失败:', error);
                this.items = new Map();
                this.currentListName = '';
                this.allSelected = true;
                this.defaultPurchaseMode = 'bid';
            }
        }

        saveSavedListsToStorage() {
            try {
                const listsData = {};
                for (const [listName, listData] of this.savedLists) {
                    listsData[listName] = {
                        name: listData.name,
                        items: { ...listData.items },
                        savedAt: listData.savedAt
                    };
                }
                localStorage.setItem('milkyway-shopping-lists', JSON.stringify(listsData));
            } catch (error) {
                console.warn('保存购物清单失败:', error);
            }
        }

        loadSavedListsFromStorage() {
            try {
                const listsData = JSON.parse(localStorage.getItem('milkyway-shopping-lists') || '{}');
                this.savedLists = new Map(Object.entries(listsData));
            } catch (error) {
                console.warn('加载购物清单失败:', error);
                this.savedLists = new Map();
            }
        }

        deleteSavedList(listName) {
            if (this.savedLists.delete(listName)) {
                this.saveSavedListsToStorage();
                this.updateSavedListsDisplay();

                this.showToast(`"${listName}"${LANG.deleted}`, 'success');
                return true;
            }
            return false;
        }

        showToast(message, type, duration) {
            if (window.MWIModules?.toast) {
                window.MWIModules.toast.show(message, type, duration);
            }
        }
    }

    // ==================== 自动停止管理器 ====================
    class AutoStopManager {
        constructor() {
            this.activeMonitors = new Map();
            this.pendingActions = new Map();
            this.processedComponents = new WeakSet();
            this.init();
        }

        init() {
            this.setupWebSocketHooks();
            this.startObserving();
        }

        startObserving() {
            const observer = new MutationObserver(() => {
                this.injectAutoStopUI();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        setupWebSocketHooks() {
            const waitForAPI = () => {
                if (window.PGE?.hookMessage) {
                    this.initHooks();
                } else {
                    setTimeout(waitForAPI, 1000);
                }
            };
            waitForAPI();
        }

        initHooks() {
            try {
                window.PGE.hookMessage('new_character_action', (data) => this.handleNewAction(data));
                window.PGE.hookMessage('actions_updated', (data) => this.handleActionsUpdated(data));
            } catch (error) {
                console.error('[AutoStop] 设置WebSocket监听失败:', error);
            }
        }

        handleNewAction(data) {
            const actionHrid = data.newCharacterActionData?.actionHrid;
            if (!actionHrid || !gatheringActionsMap.has(actionHrid)) return;

            const targetCount = this.getCurrentTargetCount();
            if (targetCount > 0) {
                this.pendingActions.set(actionHrid, targetCount);
            }
        }

        handleActionsUpdated(data) {
            if (!data.endCharacterActions?.length) return;

            data.endCharacterActions.forEach(action => {
                if (action.isDone && this.activeMonitors.has(action.id)) {
                    this.stopMonitoring(action.id);
                }

                if (this.pendingActions.has(action.actionHrid)) {
                    const targetCount = this.pendingActions.get(action.actionHrid);
                    this.pendingActions.delete(action.actionHrid);
                    this.startMonitoring(action.id, action.actionHrid, targetCount);
                }
            });
        }

        startMonitoring(actionId, actionHrid, targetCount) {
            const itemHrid = gatheringActionsMap.get(actionHrid);
            if (!itemHrid) return;

            this.stopMonitoring(actionId);

            const itemId = itemHrid.replace('/items/', '');
            const startCount = utils.getCountById(itemId);

            const intervalId = setInterval(() => {
                try {
                    const currentCount = utils.getCountById(itemId);
                    const collectedCount = Math.max(0, currentCount - startCount);

                    if (collectedCount >= targetCount) {
                        this.stopAction(actionId);
                        this.stopMonitoring(actionId);
                    }
                } catch (error) {
                    console.error('[AutoStop] 监控出错:', error);
                }
            }, 1000);

            this.activeMonitors.set(actionId, { intervalId, targetCount });
        }

        stopMonitoring(actionId) {
            const monitor = this.activeMonitors.get(actionId);
            if (monitor) {
                clearInterval(monitor.intervalId);
                this.activeMonitors.delete(actionId);
            }
        }

        stopAction(actionId) {
            try {
                window.PGE?.core?.handleCancelCharacterAction?.(actionId);
            } catch (error) {
                console.error('[AutoStop] 取消动作失败:', error);
            }
        }

        getCurrentTargetCount() {
            const input = document.querySelector('.auto-stop-target-input');
            return input ? parseInt(input.value) || 0 : 0;
        }

        cleanup() {
            this.activeMonitors.forEach(monitor => clearInterval(monitor.intervalId));
            this.activeMonitors.clear();
            this.pendingActions.clear();
        }

        createInfinityButton() {
            const nativeButton = document.querySelector('button .SkillActionDetail_unlimitedIcon__mZYJc')?.parentElement;

            if (nativeButton) {
                const clone = nativeButton.cloneNode(true);
                clone.getAttributeNames().filter(name => name.startsWith('data-')).forEach(attr => clone.removeAttribute(attr));
                return clone;
            }

            const button = document.createElement('button');
            button.className = 'Button_button__1Fe9z Button_small__3fqC7';

            const container = document.createElement('div');
            container.className = 'SkillActionDetail_unlimitedIcon__mZYJc';

            const svg = document.createElement('svg');
            Object.assign(svg, {
                role: 'img',
                'aria-label': 'Unlimited',
                className: 'Icon_icon__2LtL_ Icon_xtiny__331pI',
                width: '100%',
                height: '100%'
            });
            svg.style.margin = '-2px -1px';

            const use = document.createElement('use');
            use.setAttribute('href', '/static/media/misc_sprite.6b3198dc.svg#infinity');

            svg.appendChild(use);
            container.appendChild(svg);
            button.appendChild(container);

            setTimeout(() => {
                if (svg.getBoundingClientRect().width === 0) {
                    button.innerHTML = '<span style="font-size: 14px; font-weight: bold;">∞</span>';
                }
            }, 500);

            return button;
        }

        createAutoStopUI() {
            const container = document.createElement('div');
            container.className = 'SkillActionDetail_maxActionCountInput__1C0Pw auto-stop-ui';

            const label = document.createElement('div');
            label.className = 'SkillActionDetail_label__1mGQJ';
            label.textContent = LANG.targetLabel;

            const inputArea = document.createElement('div');
            inputArea.className = 'SkillActionDetail_input__1G-kE';

            const inputContainer = document.createElement('div');
            inputContainer.className = 'Input_inputContainer__22GnD Input_small__1-Eva';

            const input = document.createElement('input');
            input.className = 'Input_input__2-t98 auto-stop-target-input';
            input.type = 'text';
            input.maxLength = '10';
            input.value = '0';

            const setOneButton = document.createElement('button');
            setOneButton.className = 'Button_button__1Fe9z Button_small__3fqC7';
            setOneButton.textContent = '1';

            const setInfinityButton = this.createInfinityButton();

            const updateStatus = () => {
                const targetCount = parseInt(input.value) || 0;

                if (targetCount > 0) {
                    setInfinityButton.classList.remove('Button_disabled__wCyIq');
                    input.value = targetCount.toString();
                    setOneButton.classList.toggle('Button_disabled__wCyIq', targetCount === 1);
                } else {
                    setInfinityButton.classList.add('Button_disabled__wCyIq');
                    setOneButton.classList.remove('Button_disabled__wCyIq');
                    input.value = '∞';
                }

                if (this.activeMonitors.size > 0) {
                    if (targetCount <= 0) {
                        this.activeMonitors.forEach((_, actionId) => this.stopMonitoring(actionId));
                    } else {
                        this.activeMonitors.forEach(monitor => monitor.targetCount = targetCount);
                    }
                }
            };

            setOneButton.addEventListener('click', () => {
                input.value = '1';
                updateStatus();
            });

            setInfinityButton.addEventListener('click', () => {
                input.value = '0';
                updateStatus();
            });

            input.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value === '∞' || !isNaN(parseInt(value))) updateStatus();
            });

            input.addEventListener('focus', (e) => e.target.select());
            input.addEventListener('blur', updateStatus);
            input.addEventListener('keydown', (e) => {
                if (input.value === '∞' && /[0-9]/.test(e.key)) {
                    e.preventDefault();
                    input.value = e.key;
                    updateStatus();
                }
            });

            updateStatus();

            inputContainer.appendChild(input);
            inputArea.appendChild(inputContainer);
            container.append(label, inputArea, setOneButton, setInfinityButton);

            return container;
        }

        injectAutoStopUI() {
            const skillElement = document.querySelector('.SkillActionDetail_regularComponent__3oCgr');
            if (!skillElement || this.processedComponents.has(skillElement)) return false;

            const maxInput = skillElement.querySelector('.SkillActionDetail_maxActionCountInput__1C0Pw');
            if (!maxInput || skillElement.querySelector('.auto-stop-ui')) return false;

            const hrid = utils.extractActionDetailData(skillElement);
            if (!hrid || !gatheringActionsMap.has(hrid)) return false;

            this.processedComponents.add(skillElement);
            maxInput.parentNode.insertBefore(this.createAutoStopUI(), maxInput.nextSibling);
            return true;
        }
    }

    // ==================== 材料购买管理器 ====================
    class MaterialPurchaseManager {
        constructor() {
            this.init();
        }

        init() {
            this.setupObserver();
            this.setupEventListeners();
        }

        setupObserver() {
            const observer = new MutationObserver(() => {
                Object.keys(SELECTORS).forEach(type => {
                    if (type !== 'alchemy') this.setupUI(type);
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        setupEventListeners() {
            let updateTimer = null;
            document.addEventListener('input', (e) => {
                if (e.target.classList.contains('Input_input__2-t98')) {
                    clearTimeout(updateTimer);
                    updateTimer = setTimeout(() => {
                        this.updateAllInfoSpans();
                    }, 1);
                }
            });

            document.addEventListener('click', (e) => {
                if (e.target.classList) {
                    clearTimeout(updateTimer);
                    updateTimer = setTimeout(() => {
                        this.updateAllInfoSpans();
                    }, 1);
                }
            });
        }

        async purchaseMaterials(type, isBidOrder = false) {
            const api = window.MWIModules?.api;
            const toast = window.MWIModules?.toast;

            if (!api?.isReady) {
                toast?.show(LANG.wsNotAvailable, 'error');
                return;
            }

            const requirements = await MaterialCalculator.calculateRequirements(type);
            const needToBuy = requirements.filter(item =>
                item.type === 'material' && item.itemId && !item.itemId.includes('coin') && item.supplementNeeded > 0
            );

            if (needToBuy.length === 0) {
                toast?.show(LANG.sufficient, 'info');
                return;
            }

            const itemList = needToBuy.map(item =>
                `${item.materialName}: ${item.supplementNeeded}${LANG.each}`
            ).join(', ');

            toast?.show(`${LANG.starting} ${needToBuy.length} ${LANG.materials}: ${itemList}`, 'info');

            try {
                const purchaseItems = needToBuy.map(item => ({
                    itemHrid: item.itemId.startsWith('/items/') ? item.itemId : `/items/${item.itemId}`,
                    quantity: item.supplementNeeded,
                    materialName: item.materialName
                }));

                const results = isBidOrder ?
                    await api.batchBidOrder(purchaseItems, CONFIG.DELAYS.PURCHASE) :
                    await api.batchDirectPurchase(purchaseItems, CONFIG.DELAYS.PURCHASE);

                this.processResults(results, isBidOrder, type);

            } catch (error) {
                toast?.show(`${LANG.error}: ${error.message}`, 'error');
            }
        }

        processResults(results, isBidOrder, type) {
            const toast = window.MWIModules?.toast;
            let successCount = 0;

            results.forEach(result => {
                const statusText = isBidOrder ?
                    (result.success ? LANG.submitted : LANG.failed) :
                    (result.success ? LANG.purchased : LANG.failed);

                const message = `${statusText} ${result.item.materialName || result.item.itemHrid} x${result.item.quantity}`;
                toast?.show(message, result.success ? 'success' : 'error');

                if (result.success) successCount++;
            });

            const finalMessage = successCount > 0 ?
                `${LANG.complete} ${LANG.success} ${successCount}/${results.length} ${LANG.materials}` :
                LANG.allFailed;

            toast?.show(finalMessage, successCount > 0 ? 'success' : 'error', successCount > 0 ? 5000 : 3000);

            if (successCount > 0) {
                setTimeout(() => this.updateAllInfoSpans(), 2000);
            }
        }

        updateAllInfoSpans() {
            ['enhancing', 'production'].forEach(type => this.updateInfoSpans(type));
        }

        async updateInfoSpans(type) {
            const requirements = await MaterialCalculator.calculateRequirements(type);
            const className = `${type === 'house' ? 'house-' : type === 'enhancing' ? 'enhancing-' : ''}material-info-span`;

            document.querySelectorAll(`.${className}`).forEach((span, index) => {
                const materialReq = requirements.filter(req => req.type === 'material')[index];
                if (materialReq) {
                    const needed = materialReq.supplementNeeded;
                    span.textContent = `${LANG.missing}${needed}`;
                    span.style.color = needed > 0 ? CONFIG.COLORS.error : CONFIG.COLORS.text;
                }
            });

            const upgradeSpan = document.querySelector('.upgrade-info-span');
            const upgradeReq = requirements.find(req => req.type === 'upgrade');
            if (upgradeSpan && upgradeReq) {
                const needed = upgradeReq.supplementNeeded;
                upgradeSpan.textContent = `${LANG.missing}${needed}`;
                upgradeSpan.style.color = needed > 0 ? CONFIG.COLORS.error : CONFIG.COLORS.text;
            }
        }

        setupUI(type) {
            const configs = {
                production: { className: 'material-info-span', gridCols: 'auto min-content auto auto', buttonParent: 'name' },
                house: { className: 'house-material-info-span', gridCols: 'auto auto auto 140px', buttonParent: 'header' },
                enhancing: { className: 'enhancing-material-info-span', gridCols: 'auto min-content auto auto', buttonParent: 'cost' }
            };

            const selectors = SELECTORS[type];
            const config = configs[type];

            document.querySelectorAll(selectors.container).forEach(panel => {
                const dataAttr = `${type}ButtonInserted`;
                if (panel.dataset[dataAttr]) return;

                if (type === 'enhancing' && panel.querySelector(selectors.instructions)) return;

                const requirements = panel.querySelector(selectors.requirements);
                if (!requirements) return;

                panel.dataset[dataAttr] = "true";

                this.setupMaterialInfo(requirements, config, type);
                this.setupUpgradeInfo(panel, selectors, type);
                this.setupButtons(panel, selectors, config, type);

                setTimeout(() => this.updateInfoSpans(type), CONFIG.DELAYS.UPDATE);
            });
        }

        setupMaterialInfo(requirements, config, type) {
            const modifiedAttr = `${type}Modified`;
            if (requirements.dataset[modifiedAttr]) return;

            requirements.dataset[modifiedAttr] = "true";
            requirements.style.gridTemplateColumns = config.gridCols;

            requirements.querySelectorAll('.Item_itemContainer__x7kH1').forEach(item => {
                if (item.nextSibling?.classList?.contains(config.className)) return;
                const span = this.createInfoSpan();
                span.className = config.className;
                item.parentNode.insertBefore(span, item.nextSibling);
            });
        }

        setupUpgradeInfo(panel, selectors, type) {
            if (type !== 'production') return;

            const upgradeContainer = panel.querySelector(selectors.upgrade);
            if (!upgradeContainer || upgradeContainer.dataset.upgradeModified) return;

            upgradeContainer.dataset.upgradeModified = "true";
            if (!upgradeContainer.querySelector('.upgrade-info-span')) {
                const upgradeSpan = this.createInfoSpan();
                upgradeSpan.className = 'upgrade-info-span';
                upgradeContainer.appendChild(upgradeSpan);
            }
        }

        createInfoSpan() {
            const span = document.createElement("span");
            span.textContent = `${LANG.missing}0`;
            utils.applyStyles(span, {
                fontSize: '12px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '3px',
                whiteSpace: 'nowrap', minWidth: '60px', textAlign: 'center'
            });
            return span;
        }

        setupButtons(panel, selectors, config, type) {
            if (panel.querySelector('.buy-buttons-container')) return;

            const shoppingCart = window.MWIModules?.shoppingCart;

            const materialButtonContainer = document.createElement('div');
            materialButtonContainer.className = 'buy-buttons-container';

            const baseStyles = { display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', marginBottom: '8px' };
            const typeStyles = {
                house: { width: 'fit-content', margin: '0 auto 8px auto', maxWidth: '320px', minWidth: '300px' },
                enhancing: { width: 'fit-content', margin: '0 auto 8px auto', maxWidth: '340px', minWidth: '300px' }
            };

            utils.applyStyles(materialButtonContainer, { ...baseStyles, ...typeStyles[type] });

            const directBuyBtn = this.createUnifiedButton(LANG.directBuy, () => this.purchaseMaterials(type, false), 'direct-buy');
            const addToCartBtn = shoppingCart?.createAddAllToCartButton ? shoppingCart.createAddAllToCartButton(type) : this.createPlaceholderButton();
            const bidOrderBtn = this.createUnifiedButton(LANG.bidOrder, () => this.purchaseMaterials(type, true), 'bid-order');

            materialButtonContainer.append(directBuyBtn, addToCartBtn, bidOrderBtn);

            if (type === 'production') {
                const upgradeContainer = panel.querySelector(selectors.upgrade);
                if (upgradeContainer && !upgradeContainer.querySelector('.upgrade-buttons-container')) {
                    const upgradeButtonContainer = document.createElement('div');
                    upgradeButtonContainer.className = 'upgrade-buttons-container';
                    utils.applyStyles(upgradeButtonContainer, {
                        display: 'flex',
                        gap: '6px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '8px',
                        width: '100%'
                    });

                    const directBuyUpgradeBtn = this.createUnifiedButton(LANG.directBuyUpgrade, () => this.purchaseUpgrades(type, false), 'direct-buy');
                    const bidOrderUpgradeBtn = this.createUnifiedButton(LANG.bidOrderUpgrade, () => this.purchaseUpgrades(type, true), 'bid-order');

                    upgradeButtonContainer.append(directBuyUpgradeBtn, bidOrderUpgradeBtn);
                    upgradeContainer.appendChild(upgradeButtonContainer);
                }
            }

            const insertionMethods = {
                production: () => {
                    const parent = panel.querySelector(selectors[config.buttonParent]);
                    parent.parentNode.insertBefore(materialButtonContainer, parent.nextSibling);
                },
                house: () => {
                    const parent = panel.querySelector(selectors[config.buttonParent]);
                    parent.parentNode.insertBefore(materialButtonContainer, parent);
                },
                enhancing: () => {
                    const parent = panel.querySelector(selectors[config.buttonParent]);
                    parent.parentNode.insertBefore(materialButtonContainer, parent);
                }
            };

            insertionMethods[type]?.();
        }

        createUnifiedButton(text, onClick, buttonType) {
            const btn = document.createElement("button");
            btn.textContent = text;
            btn.className = 'unified-action-btn';
            btn.setAttribute('data-button-type', buttonType);

            this.applyUnifiedButtonStyle(btn, buttonType);

            btn.addEventListener("click", () => this.handleButtonClick(btn, text, onClick, buttonType));

            return btn;
        }

        applyUnifiedButtonStyle(btn, buttonType) {
            const buttonConfigs = {
                'direct-buy': {
                    backgroundColor: 'rgba(217, 89, 97, 0.8)',
                    borderColor: 'rgba(217, 89, 97, 0.5)',
                    hoverColor: 'rgba(217, 89, 97, 0.9)'
                },
                'bid-order': {
                    backgroundColor: 'rgba(47, 196, 167, 0.8)',
                    borderColor: 'rgba(47, 196, 167, 0.5)',
                    hoverColor: 'rgba(47, 196, 167, 0.9)'
                },
                'add-to-cart': {
                    backgroundColor: 'rgba(103, 58, 183, 0.8)',
                    borderColor: 'rgba(103, 58, 183, 0.5)',
                    hoverColor: 'rgba(103, 58, 183, 0.9)'
                }
            };

            const config = buttonConfigs[buttonType];

            utils.applyStyles(btn, {
                padding: '0 6px',
                backgroundColor: config.backgroundColor,
                color: 'white',
                border: `1px solid ${config.borderColor}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                fontFamily: '"Roboto"',
                height: '24px',
                flex: '1',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
            });

            btn.addEventListener('mouseenter', () => {
                btn.style.backgroundColor = config.hoverColor;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.backgroundColor = config.backgroundColor;
            });
        }

        async handleButtonClick(btn, originalText, onClick, buttonType) {
            const toast = window.MWIModules?.toast;
            const api = window.MWIModules?.api;

            if (!api?.isReady) {
                console.error(LANG.wsNotAvailable);
                return;
            }

            const isBidOrder = buttonType === 'bid-order';

            btn.disabled = true;
            btn.textContent = isBidOrder ? LANG.submitting : LANG.buying;

            const originalBg = btn.style.backgroundColor;
            const originalCursor = btn.style.cursor;

            utils.applyStyles(btn, {
                backgroundColor: CONFIG.COLORS.disabled,
                cursor: "not-allowed"
            });

            try {
                await onClick();
            } catch (error) {
                toast?.show(`${LANG.error}: ${error.message}`, 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
                utils.applyStyles(btn, {
                    backgroundColor: originalBg,
                    cursor: originalCursor
                });
            }
        }

        createPlaceholderButton() {
            const btn = document.createElement("button");
            btn.textContent = LANG.addToCart;
            btn.className = 'unified-action-btn add-to-cart-btn';
            btn.setAttribute('data-button-type', 'add-to-cart');
            this.applyUnifiedButtonStyle(btn, 'add-to-cart');
            btn.disabled = true;
            return btn;
        }

        async purchaseUpgrades(type, isBidOrder = false) {
            const api = window.MWIModules?.api;
            const toast = window.MWIModules?.toast;

            if (!api?.isReady) {
                toast?.show(LANG.wsNotAvailable, 'error');
                return;
            }

            const requirements = await MaterialCalculator.calculateRequirements(type);
            const needToBuy = requirements.filter(item =>
                item.type === 'upgrade' && item.itemId && !item.itemId.includes('coin') && item.supplementNeeded > 0
            );

            if (needToBuy.length === 0) {
                toast?.show(LANG.sufficientUpgrade, 'info');
                return;
            }

            const itemList = needToBuy.map(item =>
                `${item.materialName}: ${item.supplementNeeded}${LANG.each}`
            ).join(', ');

            toast?.show(`${LANG.starting} ${needToBuy.length} ${LANG.upgradeItems}: ${itemList}`, 'info');

            try {
                const purchaseItems = needToBuy.map(item => ({
                    itemHrid: item.itemId.startsWith('/items/') ? item.itemId : `/items/${item.itemId}`,
                    quantity: item.supplementNeeded,
                    materialName: item.materialName
                }));

                const results = isBidOrder ?
                    await api.batchBidOrder(purchaseItems, CONFIG.DELAYS.PURCHASE) :
                    await api.batchDirectPurchase(purchaseItems, CONFIG.DELAYS.PURCHASE);

                this.processResults(results, isBidOrder, type);

            } catch (error) {
                toast?.show(`${LANG.error}: ${error.message}`, 'error');
            }
        }
    }

    // ==================== 材料计算器 ====================
    class MaterialCalculator {
        static async calculateRequirements(type) {
            const selectors = SELECTORS[type];
            const container = document.querySelector(selectors.container);
            if (!container) return [];

            const requirements = [];
            const executionCount = this.getExecutionCount(container, selectors, type);

            this.calculateMaterialRequirements(container, selectors, executionCount, type, requirements);

            if (type === 'production') {
                this.calculateUpgradeRequirements(container, selectors, executionCount, requirements);
            }

            return requirements;
        }

        static getExecutionCount(container, selectors, type) {
            if (type === 'house') return 0;
            const actionInput = container.querySelector(selectors.input);
            return parseInt(actionInput?.value) || 0;
        }

        static calculateMaterialRequirements(container, selectors, executionCount, type, requirements) {
            const requirementsContainer = container.querySelector(selectors.requirements);
            if (!requirementsContainer) return;

            const materialContainers = requirementsContainer.querySelectorAll('.Item_itemContainer__x7kH1');
            const inputCounts = requirementsContainer.querySelectorAll(selectors.count);

            materialContainers.forEach((materialContainer, i) => {
                const nameElement = materialContainer.querySelector('.Item_name__2C42x');
                const svgElement = materialContainer.querySelector('svg[aria-label]');
                if (!nameElement || !svgElement) return;

                const materialName = nameElement.textContent.trim();
                const itemId = utils.extractItemId(svgElement);
                const currentStock = utils.getCountById(itemId);

                let consumptionPerUnit;

                // 根据配置决定是否考虑工匠茶影响
                if (window.PGE_CONFIG.considerArtisanTea) {
                    // 考虑工匠茶影响：使用基础消耗量*(1-artisanBuff)
                    const baseConsumption = this.getBaseMaterialConsumption(materialContainer, i);
                    const artisanBuff = this.getArtisanBuff(container);
                    consumptionPerUnit = baseConsumption * (1 - artisanBuff);
                } else {
                    // 不考虑工匠茶影响：使用基础消耗量
                    consumptionPerUnit = this.getBaseMaterialConsumption(materialContainer, i);
                }

                const totalNeeded = type === 'house' ? consumptionPerUnit : Math.ceil(executionCount * consumptionPerUnit);
                const supplementNeeded = Math.max(0, totalNeeded - currentStock);

                requirements.push({
                    materialName, itemId, supplementNeeded, totalNeeded, currentStock, index: i, type: 'material'
                });
            });
        }

        // 获取工匠茶buff效果
        static getArtisanBuff(container) {
            try {
                const props = utils.getReactProps(container);
                if (!props) return 0.0;

                const buffs = props.actionBuffs || [];
                let artisanBuff = 0.0;

                for (const buff of buffs) {
                    if (buff.typeHrid === '/buff_types/artisan') {
                        artisanBuff += (buff.flatBoost || 0.0);
                    }
                }

                return artisanBuff;
            } catch (error) {
                console.error('获取工匠茶buff失败:', error);
                return 0.0;
            }
        }

        //获取基础材料消耗量
        static getBaseMaterialConsumption(materialContainer, index) {
            try {
                const reactKey = Object.keys(materialContainer).find(key => key.startsWith('__reactProps$'));
                if (reactKey) {
                    const props = materialContainer[reactKey];
                    const baseCount = props?.children?._owner?.memoizedProps?.count;
                    if (typeof baseCount === 'number') {
                        return baseCount;
                    }
                }
            } catch (error) {
                console.error('获取基础材料消耗量失败:', error);
            }
        }

        static calculateUpgradeRequirements(container, selectors, executionCount, requirements) {
            const upgradeContainer = container.querySelector(selectors.upgrade);
            if (!upgradeContainer) return;

            const upgradeItem = upgradeContainer.querySelector('.Item_item__2De2O');
            if (!upgradeItem) return;

            const svgElement = upgradeItem.querySelector('svg[aria-label]');
            if (!svgElement) return;

            const materialName = svgElement.getAttribute('aria-label');
            const itemId = utils.extractItemId(svgElement);
            const currentStock = itemId ? utils.getCountById(itemId) : 0;
            const totalNeeded = executionCount;
            const supplementNeeded = Math.max(0, totalNeeded - currentStock);

            requirements.push({ materialName, itemId, supplementNeeded, totalNeeded, currentStock, index: 0, type: 'upgrade' });
        }
    }

    // ==================== 快速出售管理器 ====================
    class QuickSellManager {
        constructor() {
            this.processedMenus = new WeakSet();
            this.isProcessing = false;
            this.buttonStates = new WeakMap();
            this.isEnabled = true;
            this.init();
        }

        init() {
            this.setupObserver();
        }

        setupObserver() {
            const observer = new MutationObserver(() => {
                this.checkAndAddSellButtons();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        enable() {
            this.isEnabled = true;
            this.init();
        }

        disable() {
            this.isEnabled = false;
            document.querySelectorAll('.quick-sell-ask-btn, .quick-sell-bid-btn').forEach(btn => {
                btn.remove();
            });
        }

        checkAndAddSellButtons() {
            if (!this.isEnabled) return;
            try {
                // 检查是否出现物品菜单
                const itemMenu = document.querySelector('.Item_actionMenu__2yUcG');
                if (itemMenu && !this.processedMenus.has(itemMenu)) {
                    this.addQuickSellButtons(itemMenu);
                    this.processedMenus.add(itemMenu);
                }
            } catch (error) {
                console.error('检查菜单失败:', error);
            }
        }

        addQuickSellButtons(menuContainer) {
            // 检查是否已存在出售按钮
            if (menuContainer.querySelector('.quick-sell-ask-btn') ||
                menuContainer.querySelector('.quick-sell-bid-btn')) {
                return;
            }

            // 检查是否存在数量输入框，如果没有就不显示快速出售按钮
            const quantityInput = menuContainer.querySelector('.Input_input__2-t98');
            if (!quantityInput) {
                return;
            }

            // 创建"左一出售"按钮（按ask价挂单）
            const askSellButton = document.createElement('button');
            askSellButton.className = 'Button_button__1Fe9z Button_sell__3FNpM Button_fullWidth__17pVU quick-sell-ask-btn';
            askSellButton.textContent = LANG.quickSell.askSell;

            // 创建"右一出售"按钮（按bid价直售）
            const bidSellButton = document.createElement('button');
            bidSellButton.className = 'Button_button__1Fe9z Button_sell__3FNpM Button_fullWidth__17pVU quick-sell-bid-btn';
            bidSellButton.textContent = LANG.quickSell.bidSell;

            // 初始化按钮状态
            this.buttonStates.set(askSellButton, {
                confirmed: false,
                sellType: 'ask',
                originalText: LANG.quickSell.askSell,
                confirmText: LANG.quickSell.confirmAskSell,
                timeout: null,
                enableTimeout: null
            });
            this.buttonStates.set(bidSellButton, {
                confirmed: false,
                sellType: 'bid',
                originalText: LANG.quickSell.bidSell,
                confirmText: LANG.quickSell.confirmBidSell,
                timeout: null,
                enableTimeout: null
            });

            // 添加点击事件
            askSellButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleButtonClick(askSellButton, menuContainer);
            });

            bidSellButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleButtonClick(bidSellButton, menuContainer);
            });

            menuContainer.appendChild(askSellButton);
            menuContainer.appendChild(bidSellButton);
        }

        handleButtonClick(button, menuContainer) {
            if (this.isProcessing) {
                return;
            }

            const state = this.buttonStates.get(button);
            if (!state) return;

            if (!state.confirmed) {
                this.enterConfirmState(button, state);
            } else {
                if (!button.disabled) {
                    this.performQuickSell(menuContainer, state.sellType, button);
                }
            }
        }

        enterConfirmState(button, state) {
            // 清除之前的超时
            if (state.timeout) {
                clearTimeout(state.timeout);
            }
            if (state.enableTimeout) {
                clearTimeout(state.enableTimeout);
            }

            button.className = 'Button_button__1Fe9z Button_warning__1-AMI Button_fullWidth__17pVU Button_disabled__wCyIq';
            button.textContent = state.confirmText;
            button.disabled = true;
            state.confirmed = true;

            state.enableTimeout = setTimeout(() => {
                button.className = 'Button_button__1Fe9z Button_warning__1-AMI Button_fullWidth__17pVU';
                button.disabled = false;
            }, 500);
        }

        resetButtonState(button, state) {
            if (state.timeout) {
                clearTimeout(state.timeout);
                state.timeout = null;
            }
            if (state.enableTimeout) {
                clearTimeout(state.enableTimeout);
                state.enableTimeout = null;
            }

            button.className = 'Button_button__1Fe9z Button_sell__3FNpM Button_fullWidth__17pVU';
            button.textContent = state.originalText;
            button.disabled = false;
            state.confirmed = false;
        }

        async performQuickSell(menuContainer, sellType, button) {
            if (this.isProcessing) {
                return;
            }

            this.isProcessing = true;
            const state = this.buttonStates.get(button);

            try {
                // 获取物品信息
                const itemInfo = this.extractItemInfo(menuContainer);

                // 获取出售数量
                const quantity = this.getQuantity(menuContainer);

                // 显示开始出售的提示
                const startMessage = sellType === 'ask' ? LANG.quickSell.startListing : LANG.quickSell.startInstantSell;
                this.showToast(`${startMessage}: ${itemInfo.name} x${quantity}`, 'info');

                // 获取市场数据
                const marketData = await this.getMarketData(itemInfo.itemHrid);
                if (!marketData) {
                    throw new Error(LANG.quickSell.noMarketData);
                }

                // 计算价格
                const price = this.calculatePrice(marketData, itemInfo.enhancementLevel, quantity, sellType);
                if (!price || price <= 0) {
                    throw new Error(`${LANG.quickSell.getPriceFailed}: ${sellType}`);
                }

                // 执行出售
                const isInstantSell = sellType === 'bid'; // bid是直售，ask是挂单
                await this.executeSell(itemInfo, quantity, price, isInstantSell);

                // 出售成功后重置按钮状态
                this.resetButtonState(button, state);

            } catch (error) {
                console.error(LANG.quickSell.sellFailed + ':', error);
                this.showToast(`${LANG.quickSell.sellFailed}: ${error.message}`, 'error');
                // 出售失败也重置按钮状态
                this.resetButtonState(button, state);
            } finally {
                this.isProcessing = false;
            }
        }

        extractItemInfo(menuContainer) {
            try {
                // 获取物品名称
                const itemNameElement = menuContainer.querySelector('.Item_name__2C42x');
                const itemName = itemNameElement?.textContent?.trim();

                // 获取React props
                const reactKey = Object.keys(menuContainer).find(key => key.startsWith('__reactProps'));
                const itemInfo = menuContainer[reactKey]?.children[0]._owner.memoizedProps;

                if (!itemInfo || !itemName) {
                    return null;
                }

                return {
                    name: itemName,
                    itemHrid: itemInfo.itemHrid,
                    enhancementLevel: itemInfo.enhancementLevel || 0
                };
            } catch (error) {
                console.error(LANG.quickSell.extractItemInfoFailed + ':', error);
                return null;
            }
        }

        getQuantity(menuContainer) {
            try {
                const quantityInput = menuContainer.querySelector('.Input_input__2-t98');
                return parseInt(quantityInput.value);
            } catch (error) {
                throw error;
            }
        }

        async getMarketData(itemHrid) {
            try {
                const fullItemHrid = itemHrid.startsWith('/items/') ? itemHrid : `/items/${itemHrid}`;

                // 检查缓存
                const cached = window.marketDataCache?.get(fullItemHrid);
                if (cached && Date.now() - cached.timestamp < 60000) {
                    return cached.data;
                }

                // 等待市场数据响应
                const responsePromise = window.PGE.waitForMessage(
                    'market_item_order_books_updated',
                    8000,
                    (responseData) => responseData.marketItemOrderBooks?.itemHrid === fullItemHrid
                );

                // 请求市场数据
                window.PGE.core.handleGetMarketItemOrderBooks(fullItemHrid);

                const response = await responsePromise;
                return response.marketItemOrderBooks;
            } catch (error) {
                console.error(LANG.quickSell.getMarketDataFailed + ':', error);
                return null;
            }
        }

        calculatePrice(marketData, enhancementLevel, quantity, sellType) {
            try {
                if (sellType === 'ask') {
                    // 左一出售：按ask价挂单（参考卖单价格）
                    return this.analyzeAskPrice(marketData, enhancementLevel);
                } else {
                    // 右一出售：按bid价直售（卖给买单）
                    return this.analyzeBidPrice(marketData, enhancementLevel, quantity);
                }
            } catch (error) {
                console.error(LANG.quickSell.getPriceFailed + ':', error);
                return null;
            }
        }

        analyzeAskPrice(marketData, enhancementLevel) {
            const asks = marketData.orderBooks?.[enhancementLevel]?.asks;
            if (!asks?.length) {
                return null;
            }

            // 返回最低卖单价格，用于挂单竞争
            return asks[0].price;
        }

        analyzeBidPrice(marketData, enhancementLevel, quantity) {
            const bids = marketData.orderBooks?.[enhancementLevel]?.bids;
            if (!bids?.length) {
                return null;
            }

            // 分析能够出售的数量和价格
            let cumulativeQuantity = 0;
            let targetPrice = 0;

            for (const bid of bids) {
                const canSellToThisOrder = Math.min(bid.quantity, quantity - cumulativeQuantity);
                cumulativeQuantity += canSellToThisOrder;
                targetPrice = bid.price;

                if (cumulativeQuantity >= quantity) break;
            }

            if (cumulativeQuantity < quantity) {
                console.warn(`${LANG.quickSell.marketOrdersInsufficient} ${cumulativeQuantity}${LANG.quickSell.needed} ${quantity}`);
            }

            return targetPrice;
        }

        async executeSell(itemInfo, quantity, price, isInstantSell) {
            try {
                const fullItemHrid = itemInfo.itemHrid.startsWith('/items/') ?
                    itemInfo.itemHrid : `/items/${itemInfo.itemHrid}`;

                if (isInstantSell) {
                    // 直售（卖给买单）
                    await this.executeInstantSell(fullItemHrid, itemInfo.enhancementLevel, quantity, price, itemInfo.name);
                } else {
                    // 挂单出售
                    await this.executeListing(fullItemHrid, itemInfo.enhancementLevel, quantity, price, itemInfo.name);
                }
            } catch (error) {
                console.error(LANG.quickSell.executeSellFailed + ':', error);
                throw error;
            }
        }

        async executeInstantSell(itemHrid, enhancementLevel, quantity, price, itemName) {
            const successPromise = window.PGE.waitForMessage(
                'info',
                15000,
                (responseData) => responseData.message === 'infoNotification.sellOrderCompleted'
            );

            const errorPromise = window.PGE.waitForMessage('error', 15000);

            window.PGE.core.handlePostMarketOrder(true, itemHrid, enhancementLevel, quantity, price, true);

            try {
                await Promise.race([
                    successPromise,
                    errorPromise.then(errorData => Promise.reject(new Error(errorData.message || LANG.quickSell.instantSellFailed)))
                ]);

                this.showToast(`✅ ${LANG.quickSell.instantSellSuccess}: ${itemName} x${quantity} @ ${price}`, 'success');
            } catch (error) {
                this.showToast(`❌ ${LANG.quickSell.instantSellFailed}: ${itemName}`, 'error');
                throw error;
            }
        }

        async executeListing(itemHrid, enhancementLevel, quantity, price, itemName) {
            const successPromise = window.PGE.waitForMessage(
                'info',
                15000,
                (responseData) => responseData.message === 'infoNotification.sellListingProgress'
            );

            const errorPromise = window.PGE.waitForMessage('error', 15000);

            window.PGE.core.handlePostMarketOrder(true, itemHrid, enhancementLevel, quantity, price, false);

            try {
                await Promise.race([
                    successPromise,
                    errorPromise.then(errorData => Promise.reject(new Error(errorData.message || LANG.quickSell.listingFailed)))
                ]);

                this.showToast(`✅ ${LANG.quickSell.listingSuccess}: ${itemName} x${quantity} @ ${price}`, 'success');
            } catch (error) {
                this.showToast(`❌ ${LANG.quickSell.listingFailed}: ${itemName}`, 'error');
                throw error;
            }
        }

        showToast(message, type) {
            if (window.MWIModules?.toast) {
                window.MWIModules.toast.show(message, type);
            } else {
                console.log(`${message}`);
            }
        }

        // 清理资源
        cleanup() {
            this.processedMenus = new WeakSet();
            this.isProcessing = false;
            // 清理所有按钮的超时
            for (const [button, state] of this.buttonStates) {
                if (state.timeout) {
                    clearTimeout(state.timeout);
                }
                if (state.enableTimeout) {
                    clearTimeout(state.enableTimeout);
                }
            }
            this.buttonStates = new WeakMap();
        }
    }

    // ==================== 全局样式 ====================
    function addGlobalButtonStyles() {
        const style = document.createElement('style');
        style.textContent = `
                /* 防止所有按钮文本被选择复制 */
                button,
                .unified-action-btn,
                .buy-buttons-container button,
                .upgrade-buttons-container button,
                .market-cart-btn,
                [class*="Button_button"],
                [data-button-type],
                #cart-tab,
                #cart-buy-btn,
                #cart-bid-btn,
                #cart-clear-btn,
                #save-list-btn,
                [data-load-list],
                [data-delete-list],
                [data-remove-item] {
                    user-select: none !important;
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                }

                /* 防止按钮内的任何元素被选择 */
                button *,
                .unified-action-btn *,
                .buy-buttons-container button *,
                .upgrade-buttons-container button *,
                .market-cart-btn *,
                [class*="Button_button"] *,
                [data-button-type] *,
                #cart-tab *,
                #cart-buy-btn *,
                #cart-bid-btn *,
                #cart-clear-btn *,
                #save-list-btn *,
                [data-load-list] *,
                [data-delete-list] *,
                [data-remove-item] * {
                    user-select: none !important;
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                }
            `;
        document.head.appendChild(style);
    }

    // ==================== 游戏核心监控 ====================
    function setupGameCoreMonitor() {
        const interval = setInterval(() => {
            if (window.PGE.core || initGameCore()) {
                clearInterval(interval);
            }
        }, 2000);
    }

    // ==================== 模块初始化 ====================
    function initializeModules() {
        console.log('[PGE] Starting module initialization...');

        // 初始化基础模块
        window.MWIModules.toast = new Toast();
        window.MWIModules.api = new PGE();

        // 根据配置初始化功能模块
        if (PGE_CONFIG.itemValueCalculator) {
            const characterData = window.PGE?.characterData?.character;
            if (characterData && characterData.gameMode === 'standard') {
                window.MWIModules.itemValueCalculator = new ItemValueCalculator();
            } else {
                console.log(`[PGE] 物品价值计算器未启用：角色模式为 ${characterData?.gameMode || 'Unknown'}`);
            }
        }

        if (PGE_CONFIG.quickSell) {
            window.MWIModules.quickSell = new QuickSellManager();
        }

        if (PGE_CONFIG.gatheringEnhanced) {
            window.MWIModules.autoStop = new AutoStopManager();
        }

        if (PGE_CONFIG.quickPurchase) {
            window.MWIModules.shoppingCart = new ShoppingCartManager();
            window.MWIModules.materialPurchase = new MaterialPurchaseManager();
        }

        if (PGE_CONFIG.alchemyProfit) {
            window.MWIModules.alchemyCalculator = new AlchemyProfitCalculator();
        }

        if (PGE_CONFIG.universalProfit) {
            window.MWIModules.universalCalculator = new UniversalActionProfitCalculator();
        }

        if (PGE_CONFIG.autoClaimMarketListings) {
            window.MWIModules.autoClaimMarketListings = new AutoClaimMarketListingsManager();
        }

        // 添加全局样式
        addGlobalButtonStyles();

        // 设置游戏核心监控
        setupGameCoreMonitor();

        // 初始化脚本设置面板
        initSettingsTabManager();

        console.log('[PGE] Module initialization completed');
    }

    // ==================== 页面就绪检查 ====================
    function checkPageReady() {
        try {
            if (!document.body) {
                return false;
            }

            const avatar = document.querySelector('.Header_avatar__2RQgo');
            const gameContainer = document.querySelector('.GamePage_gamePage__ixiPl');

            if (avatar && gameContainer) {
                console.log('[PGE] Page elements ready');
                initializationState.pageReady = true;
                checkAndInitializeModules();
                return true;
            }
            return false;
        } catch (error) {
            console.error('[PGE] Error checking page ready:', error);
            return false;
        }
    }

    // ==================== 游戏状态检查 ====================
    function checkGameStateReady() {
        try {
            if (!document.body) {
                return false;
            }

            const gameCore = getGameCore();
            if (gameCore) {
                window.PGE.core = gameCore;
                console.log('[PGE] Game core ready');
                initializationState.gameStateReady = true;
                checkAndInitializeModules();
                return true;
            }
            return false;
        } catch (error) {
            console.error('[PGE] Error checking game state:', error);
            return false;
        }
    }

    // ==================== 模块初始化检查 ====================
    function checkAndInitializeModules() {
        if (initializationState.modulesInitialized) {
            return;
        }

        if (!initializationState.wsConnected) {
            console.log('[PGE] Waiting for WebSocket connection...');
            return;
        }

        if (!initializationState.pageReady) {
            console.log('[PGE] Waiting for page elements...');
            return;
        }

        if (!initializationState.gameStateReady) {
            console.log('[PGE] Waiting for game state...');
            return;
        }

        console.log('[PGE] All conditions met, initializing modules...');
        initializationState.modulesInitialized = true;

        try {
            initializeModules();
            console.log('[PGE] Modules initialized successfully');
        } catch (error) {
            console.error('[PGE] Module initialization failed:', error);
            initializationState.modulesInitialized = false;
        }
    }

    // ==================== 页面监听器 ====================
    async function setupPageMonitoring() {
        try {
            await DOMUtils.waitForDOMReady();
            console.log('[PGE] DOM ready');

            setTimeout(checkPageReady, 100);

            DOMUtils.setupSafeObserver((mutations) => {
                if (!initializationState.pageReady) {
                    checkPageReady();
                }
                if (!initializationState.gameStateReady) {
                    checkGameStateReady();
                }
            });

            const gameStateInterval = setInterval(() => {
                if (initializationState.gameStateReady) {
                    clearInterval(gameStateInterval);
                    return;
                }
                checkGameStateReady();
            }, 1000);

            setTimeout(() => {
                if (!initializationState.modulesInitialized) {
                    console.log('[PGE] Timeout check - forcing initialization check');
                    checkPageReady();
                    checkGameStateReady();
                    checkAndInitializeModules();
                }
            }, 5000);

        } catch (error) {
            console.error('[PGE] Setup page monitoring failed:', error);
        }
    }

    // ==================== 启动序列 ====================
    function startInitializationSequence() {
        console.log('[PGE] Starting initialization sequence...');

        // 1. 立即设置WebSocket拦截（最高优先级）
        setupWebSocketInterception();

        // 2. 异步设置页面监听
        setupPageMonitoring().catch(error => {
            console.error('[PGE] Page monitoring setup failed:', error);
        });

        // 3. 初始化角色切换器
        window.MWIModules.characterSwitcher = new CharacterSwitcher();

        console.log('[PGE] Initialization sequence started');
    }

    // ==================== 初始化状态 ====================
    const state = {
        wsInstances: [],
        currentWS: null,
        requestHandlers: new Map(),
        marketDataCache: new Map(),
        baseDomain: 'data.pages.dev'
    };

    Object.assign(window, state);

    // ==================== 启动 ====================
    startInitializationSequence();
    window.HackTimer = new HackTimer();
})();