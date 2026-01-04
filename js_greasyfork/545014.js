// ==UserScript==
// @name         auto click
// @namespace    http://tampermonkey.net/
// @version      1.26
// @description  自动点击功能脚本，功能待定
// @author       You
// @match        https://*.milkywayidle.com/*
// @match        https://*.milkywayidlecn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545014/auto%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/545014/auto%20click.meta.js
// ==/UserScript==
 
(() => {
    'use strict';

    // 获取URL参数中的characterId
    const urlParams = new URLSearchParams(window.location.search);
    const characterId = urlParams.get('characterId') || '';
    // 生成flag名称，格式为flag_click+characterId
    const flagName = `flag_click${characterId}`;

    // 定义customPaths变量，将从远程获取
    let customPaths = [];
    
    // 从远程获取customPaths数组的函数
    async function fetchCustomPaths() {
        try {
            if (!characterId) {
                console.error('未找到characterId参数，无法获取自定义路径列表');
                return;
            }
            
            // 构建请求URL
            const giteeUrl = `https://gitee.com/deric1312/myapi1/raw/master/${characterId}.json`;
            // 使用更可靠的CORS代理服务解决跨域问题
            // 尝试多个代理服务以提高可靠性
            const proxyUrls = [
                'https://api.allorigins.win/raw?url=',
                'https://cors.bridged.cc/',
                'https://crossorigin.me/'
            ];
            
            // 尝试直接请求（可能服务器已支持CORS）
            let response;
            try {
                console.log(`正在尝试直接从${giteeUrl}获取customPaths数组...`);
                response = await fetch(giteeUrl);
                if (!response.ok) {
                    throw new Error(`直接请求失败，状态: ${response.status}`);
                }
            } catch (directError) {
                console.log(`直接请求失败: ${directError.message}，正在尝试使用CORS代理...`);
                
                // 尝试所有代理服务
                let proxyError;
                for (const proxyUrl of proxyUrls) {
                    try {
                        const url = `${proxyUrl}${giteeUrl}`;
                        console.log(`正在通过${proxyUrl}从${giteeUrl}获取customPaths数组...`);
                        
                        response = await fetch(url);
                        if (!response.ok) {
                            throw new Error(`代理请求失败，状态: ${response.status}`);
                        }
                        // 成功获取响应，退出循环
                        break;
                    } catch (error) {
                        proxyError = error;
                        console.log(`使用${proxyUrl}代理失败: ${error.message}`);
                        // 继续尝试下一个代理
                    }
                }
                
                // 如果所有代理都失败
                if (!response) {
                    throw new Error(`所有代理服务都失败，最后一个错误: ${proxyError.message}`);
                }
            }
            
            // 解析JSON响应
            const data = await response.json();
            
            // 检查数据是否为数组
            if (Array.isArray(data)) {
                customPaths = data;
                console.log('成功获取customPaths数组:', customPaths);
            } else {
                console.error('获取的customPaths数据不是数组格式:', data);
                customPaths = [];
            }
        } catch (error) {
            console.error('获取customPaths数组失败:', error);
            // 如果获取失败，使用默认空数组
            customPaths = [
"enhancing_essence",
"blazing_trident",
"blazing_trident_refined",
"dodocamel_gauntlets",
"dodocamel_gauntlets_refined",
"royal_fire_robe_top",
"royal_fire_robe_top_refined",
"royal_fire_robe_bottoms",
"royal_fire_robe_bottoms_refined",
"royal_water_robe_top",
"royal_water_robe_top_refined",
"royal_water_robe_bottoms",
"royal_water_robe_bottoms_refined",
"royal_nature_robe_top",
"royal_nature_robe_top_refined",
"royal_nature_robe_bottoms",
"royal_nature_robe_bottoms_refined",
"chaotic_flail",
"chaotic_flail_refined",
"regal_sword",
"regal_sword_refined",
"kraken_chaps",
"kraken_chaps_refined",
"kraken_tunic",
"kraken_tunic_refined",
"furious_spear",
"furious_spear_refined",
"rippling_trident",
"rippling_trident_refined",
"sundering_crossbow",
"sundering_crossbow_refined",
"corsair_helmet",
"corsair_helmet_refined",
"anchorbound_plate_legs",
"anchorbound_plate_legs_refined",
"anchorbound_plate_body",
"anchorbound_plate_body_refined",
"maelstrom_plate_legs",
"maelstrom_plate_legs_refined",
"maelstrom_plate_body",
"maelstrom_plate_body_refined",
"knights_aegis",
"knights_aegis_refined",
"marksman_bracers",
"marksman_bracers_refined",
"griffin_bulwark",
"griffin_bulwark_refined",
"acrobatic_hood",
"acrobatic_hood_refined",
"blooming_trident",
"blooming_trident_refined",
"cursed_bow",
"cursed_bow_refined",
"bishops_codex",
"bishops_codex_refined",
"magicians_hat",
"magicians_hat_refined",
        "gobo_shooter",
        "umbral_bracers",
        "umbral_chaps",
        "umbral_tunic",
        "umbral_boots",
        "rainbow_hammer",
        "rainbow_mace",
        "rainbow_hatchet",
        "rainbow_spatula",
        "rainbow_pot",
        "rainbow_gauntlets",
        "rainbow_shears",
        "rainbow_sword",
        "rainbow_enhancer",
        "gator_vest",
        "gobo_hood",
        "gobo_defender",
        "gobo_slasher",
        "gobo_bracers",
        "gobo_boomstick",
        "gobo_smasher",
        "gobo_chaps",
        "gobo_tunic",
        "gobo_boots",
        "gobo_stabber",
        "werewolf_slasher",
        "pincer_gloves",
        "rainbow_brush",
        "rainbow_helmet",
        "rainbow_plate_legs",
        "rainbow_plate_body",
        "rainbow_boots",
        "rainbow_buckler",
        "rainbow_chisel",
        "rainbow_spear",
        "rainbow_needle",
        "rainbow_alembic",
        "rainbow_bulwark",
        "rough_hood",
        "rough_bracers",
        "rough_chaps",
        "rough_tunic",
        "rough_boots",
        "verdant_hammer",
        "verdant_hatchet",
        "verdant_mace",
        "verdant_spatula",
        "verdant_pot",
        "verdant_gauntlets",
        "verdant_shears",
        "verdant_sword",
        "verdant_enhancer",
        "verdant_brush",
        "verdant_helmet",
        "verdant_plate_legs",
        "verdant_plate_body",
        "verdant_boots",
        "verdant_buckler",
        "verdant_chisel",
        "verdant_spear",
        "verdant_needle",
        "verdant_alembic",
        "verdant_bulwark",
        "large_pouch",
        "radiant_hat",
        "radiant_robe_top",
        "radiant_robe_bottoms",
        "radiant_gloves",
        "radiant_boots",
        "turtle_shell_legs",
        "turtle_shell_body",
        "marine_tunic",
        "marine_chaps",
        "redwood_shield",
        "redwood_bow",
        "redwood_fire_staff",
        "redwood_crossbow",
        "redwood_water_staff",
        "redwood_nature_staff",
        "earrings_of_armor",
        "ring_of_armor",
        "granite_bludgeon",
        "birch_shield",
        "birch_bow",
        "birch_fire_staff",
        "birch_crossbow",
        "birch_water_staff",
        "birch_nature_staff",
        "crimson_hammer",
        "crimson_mace",
        "crimson_hatchet",
        "crimson_spatula",
        "crimson_pot",
        "crimson_gauntlets",
        "crimson_shears",
        "crimson_sword",
        "crimson_enhancer",
        "crimson_brush",
        "crimson_helmet",
        "crimson_plate_legs",
        "crimson_plate_body",
        "crimson_boots",
        "crimson_buckler",
        "crimson_chisel",
        "crimson_spear",
        "crimson_needle",
        "crimson_alembic",
        "crimson_bulwark",
        "giant_pouch",
        "cotton_robe_top",
        "cotton_hat",
        "cotton_boots",
        "cotton_gloves",
        "cotton_robe_bottoms",
        "wooden_shield",
        "wooden_bow",
        "wooden_crossbow",
        "wooden_fire_staff",
        "wooden_water_staff",
        "wooden_nature_staff",
        "cheese_hammer",
        "cheese_mace",
        "cheese_hatchet",
        "cheese_spatula",
        "cheese_pot",
        "cheese_gauntlets",
        "cheese_shears",
        "cheese_sword",
        "cheese_enhancer",
        "cheese_brush",
        "cheese_helmet",
        "cheese_plate_legs",
        "cheese_plate_body",
        "cheese_boots",
        "cheese_buckler",
        "cheese_chisel",
        "cheese_spear",
        "cheese_needle",
        "cheese_alembic",
        "cheese_bulwark",
        "reptile_hood",
        "reptile_bracers",
        "reptile_chaps",
        "reptile_tunic",
        "reptile_boots",
        "burble_hammer",
        "burble_mace",
        "burble_hatchet",
        "burble_spatula",
        "burble_pot",
        "burble_gauntlets",
        "burble_shears",
        "burble_sword",
        "burble_enhancer",
        "burble_brush",
        "burble_helmet",
        "burble_plate_legs",
        "burble_plate_body",
        "burble_boots",
        "burble_chisel",
        "burble_buckler",
        "burble_spear",
        "burble_needle",
        "burble_alembic",
        "burble_bulwark",
        "arcane_shield",
        "arcane_bow",
        "arcane_fire_staff",
        "arcane_water_staff",
        "arcane_nature_staff",
        "arcane_crossbow",
        "holy_mace",
        "holy_gauntlets",
        "holy_sword",
        "holy_helmet",
        "holy_plate_legs",
        "holy_plate_body",
        "holy_boots",
        "holy_buckler",
        "holy_spear",
        "holy_bulwark",
        "silk_robe_top",
        "silk_robe_bottoms",
        "silk_hat",
        "silk_gloves",
        "silk_boots",
        "azure_hammer",
        "azure_mace",
        "azure_hatchet",
        "azure_spatula",
        "azure_pot",
        "azure_gauntlets",
        "azure_shears",
        "azure_sword",
        "azure_enhancer",
        "azure_brush",
        "azure_helmet",
        "azure_plate_legs",
        "azure_plate_body",
        "azure_boots",
        "azure_buckler",
        "azure_chisel",
        "azure_spear",
        "azure_needle",
        "azure_alembic",
        "azure_bulwark",
        "snail_shell_helmet",
        "vampire_fang_dirk",
        "small_pouch",
        "cedar_shield",
        "panda_gloves",
        "cedar_bow",
        "cedar_fire_staff",
        "cedar_crossbow",
        "cedar_water_staff",
        "cedar_nature_staff",
        "linen_hat",
        "linen_robe_top",
        "linen_robe_bottoms",
        "linen_gloves",
        "linen_boots",
        "beast_hood",
        "beast_bracers",
        "beast_chaps",
        "beast_tunic",
        "beast_boots",
        "ginkgo_shield",
        "ginkgo_bow",
        "ginkgo_fire_staff",
        "ginkgo_crossbow",
        "ginkgo_water_staff",
        "ginkgo_nature_staff",
        "medium_pouch",
        "bamboo_hat",
        "bamboo_robe_top",
        "bamboo_robe_bottoms",
        "bamboo_gloves",
        "bamboo_boots",
        "purpleheart_shield",
        "purpleheart_bow",
        "purpleheart_fire_staff",
        "purpleheart_crossbow",
        "purpleheart_water_staff",
        "purpleheart_nature_staff",
        "grizzly_bear_shoes",
        "luna_robe_top",
        "luna_robe_bottoms",
        "magnetic_gloves",
        "enchanted_gloves",
        "snake_fang_dirk",
        "stalactite_spear",
        "treant_shield",
        "tome_of_the_elements",
        "tome_of_healing",
        "umbral_hood",
        "black_bear_shoes",
        "red_culinary_hat",
        "sighted_bracers",
        "chimerical_refinement_shard",
        "sinister_refinement_shard",
        "enchanted_refinement_shard",
        "pirate_refinement_shard"
    ];
        }
    }

    // 脚本功能将在这里实现
    console.log('自动点击脚本已加载');
    
    // 脚本加载时自动尝试获取customPaths数组
    fetchCustomPaths().then(() => {
        console.log('脚本加载完成后，当前customPaths数组:', customPaths);
    });
 
    // 向qmsg酱发送消息的函数
 
 
    // 自动点击函数
    // 自动点击函数 - 改为异步函数以支持等待
    async function autoclick() {
        // 确保customPaths已经获取
        if (customPaths.length === 0) {
            console.log('customPaths为空，正在尝试获取...');
            await fetchCustomPaths();
            // 获取API后，延迟5秒进行后续点击
            console.log('获取API完成，延迟5秒后开始点击操作...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
            // 如果customPaths已存在，也延迟5秒进行点击
            console.log('customPaths已存在，延迟5秒后开始点击操作...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        // 显示当前customPaths数组
        console.log('autoclick函数执行时，当前customPaths数组:', customPaths);
        // 使用全局targetButtons，如果不存在则使用默认值
        const targetButtons = window.targetButtons || [5, 6, 1, 5, 6, 1, 5, 6, 1, 5, 6, 1, 5, 6, 1, 5, 6, 1, 5, 6, 1, 5, 6, 1, 5, 6, 1, 5, 6, 1,];
        console.log('当前点击的按钮组:', targetButtons);
        for (const i of targetButtons) {
            // 检查是否取消了自动点击
            if (window.autoClickCanceled) {
                console.log('检测到取消标志，终止自动点击');
                return;
            }
            const selector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7> div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_itemSelection__3jDb- > div.MarketplacePanel_itemSelectionTabsContainer__kd2R2 > div > div.TabsComponent_tabsContainer__3BDUp > div > div > div > button:nth-child(' + i + ')';
            // 先点击导航按钮
            const navButtonSelector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_navPanel__3wbAU > div > div.NavigationBar_navigationBar__1gRln > div.NavigationBar_navigationLinks__1XSSb > div:nth-child(2)';
            const navButton = document.querySelector(navButtonSelector);
            if (navButton) {
                navButton.click();
                console.log('已点击导航按钮');
                // 停顿0.5秒
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            const element = document.querySelector(selector);
            if (element) {
                element.click();
                // 点击后停顿1秒
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log(`已点击按钮 ${i}: ${selector}`);
 
                // 查找指定元素下的子div.Item_itemContainer__x7kH1数量
                const targetSelector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_itemSelection__3jDb- > div.MarketplacePanel_itemSelectionTabsContainer__kd2R2 > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(' + i + ') > div';
                const targetElement = document.querySelector(targetSelector);
 
                if (targetElement) {
                    const itemContainers = targetElement.querySelectorAll('div.Item_itemContainer__x7kH1');
                    const n = itemContainers.length;
                    console.log(`按钮 ${i} 点击后，目标元素下的子div.Item_itemContainer__x7kH1数量: ${n}`);
 
                    // 根据数量n进行循环操作
                    for (let j = 1; j <= n; j++) {
                        // 检查是否取消了自动点击
                        if (window.autoClickCanceled) {
                            console.log('检测到取消标志，终止自动点击');
                            return;
                        }
                        // 查询第j个元素
                        const elementSelector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_itemSelection__3jDb- > div.MarketplacePanel_itemSelectionTabsContainer__kd2R2 > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(' + i + ') > div > div:nth-child(' + j + ')';
                        const currentElement = document.querySelector(elementSelector);
 
                        if (currentElement) {

 
                            // 检查SVG use元素的href属性是否在customPaths数组中
                            const svgUseSelector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_itemSelection__3jDb- > div.MarketplacePanel_itemSelectionTabsContainer__kd2R2 > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(' + i + ') > div > div:nth-child(' + j + ')>div>div>div>svg>use';
                            const svgUseElement = document.querySelector(svgUseSelector);
 
                            // 默认设置为不匹配
                            let isMatch = false;
                            if (svgUseElement && svgUseElement.hasAttribute('href')) {
                                const href = svgUseElement.getAttribute('href');
                                // 提取#后面的部分
                                const hrefSuffix = href.split('#')[1];
 
                                // 检查是否在customPaths数组中
                                if (customPaths.includes(hrefSuffix)) {
                                    console.log(`找到匹配的href: ${hrefSuffix}, 位于customPaths数组中`);
                                    isMatch = true;
                                }
                            }
 
                            // 如果不匹配，跳过当前循环，进入下一个j+1的循环
                            if (!isMatch) {

                                continue;
                            }
 
                            // 停顿2秒
 
                            // 点击指定选择器的元素
                            const newSelector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_itemSelection__3jDb- > div.MarketplacePanel_itemSelectionTabsContainer__kd2R2 > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(' + i + ') > div > div:nth-child(' + j + ') > div > div';
                            const newElement = document.querySelector(newSelector);
                            if (newElement) {
                                // 针对CSS或事件委托实现的可点击div，模拟完整的鼠标事件序列确保冒泡
                                // 1. 触发mouseover事件 - 模拟鼠标移动到元素上
                                const mouseOverEvent = document.createEvent('MouseEvents');
                                mouseOverEvent.initMouseEvent(
                                    'mouseover',
                                    true,  // bubbles
                                    true,  // cancelable
                                    window,  // view
                                    0,  // detail
                                    newElement.getBoundingClientRect().left + 10,  // screenX
                                    newElement.getBoundingClientRect().top + 10,  // screenY
                                    newElement.getBoundingClientRect().left + 10,  // clientX
                                    newElement.getBoundingClientRect().top + 10,  // clientY
                                    false,  // ctrlKey
                                    false,  // altKey
                                    false,  // shiftKey
                                    false,  // metaKey
                                    0,  // button
                                    document.body  // relatedTarget (从body移到元素)
                                );
                                newElement.dispatchEvent(mouseOverEvent);
                                console.log(`已触发mouseover事件 ${j}/${n}`);
 
                                // 短暂延迟
                                await new Promise(resolve => setTimeout(resolve, 50));
 
                                // 2. 触发mousedown事件
                                const mouseDownEvent = document.createEvent('MouseEvents');
                                mouseDownEvent.initMouseEvent(
                                    'mousedown',
                                    true,  // bubbles - 确保事件能冒泡
                                    true,  // cancelable
                                    window,  // view
                                    1,  // detail (click count)
                                    newElement.getBoundingClientRect().left + 10,  // screenX
                                    newElement.getBoundingClientRect().top + 10,  // screenY
                                    newElement.getBoundingClientRect().left + 10,  // clientX
                                    newElement.getBoundingClientRect().top + 10,  // clientY
                                    false,  // ctrlKey
                                    false,  // altKey
                                    false,  // shiftKey
                                    false,  // metaKey
                                    0,  // button (0 for left)
                                    null  // relatedTarget
                                );
                                newElement.dispatchEvent(mouseDownEvent);
                                console.log(`已触发mousedown事件 ${j}/${n}`);
 
                                // 短暂延迟
                                await new Promise(resolve => setTimeout(resolve, 50));
 
                                // 3. 触发mouseup事件
                                const mouseUpEvent = document.createEvent('MouseEvents');
                                mouseUpEvent.initMouseEvent(
                                    'mouseup',
                                    true,  // bubbles
                                    true,  // cancelable
                                    window,  // view
                                    1,  // detail (click count)
                                    newElement.getBoundingClientRect().left + 10,  // screenX
                                    newElement.getBoundingClientRect().top + 10,  // screenY
                                    newElement.getBoundingClientRect().left + 10,  // clientX
                                    newElement.getBoundingClientRect().top + 10,  // clientY
                                    false,  // ctrlKey
                                    false,  // altKey
                                    false,  // shiftKey
                                    false,  // metaKey
                                    0,  // button (0 for left)
                                    null  // relatedTarget
                                );
                                newElement.dispatchEvent(mouseUpEvent);
                                console.log(`已触发mouseup事件 ${j}/${n}`);
 
                                // 4. 触发click事件
                                const clickEvent = document.createEvent('MouseEvents');
                                clickEvent.initMouseEvent(
                                    'click',
                                    true,  // bubbles - 确保事件能冒泡到父元素
                                    true,  // cancelable
                                    window,  // view
                                    1,  // detail (click count)
                                    newElement.getBoundingClientRect().left + 10,  // screenX
                                    newElement.getBoundingClientRect().top + 10,  // screenY
                                    newElement.getBoundingClientRect().left + 10,  // clientX
                                    newElement.getBoundingClientRect().top + 10,  // clientY
                                    false,  // ctrlKey
                                    false,  // altKey
                                    false,  // shiftKey
                                    false,  // metaKey
                                    0,  // button (0 for left)
                                    null  // relatedTarget
                                );
                                newElement.dispatchEvent(clickEvent);
                                console.log(`已触发click事件 ${j}/${n}`);
 
                                // 5. 触发mouseout事件 - 模拟鼠标离开元素
                                await new Promise(resolve => setTimeout(resolve, 50));
                                const mouseOutEvent = document.createEvent('MouseEvents');
                                mouseOutEvent.initMouseEvent(
                                    'mouseout',
                                    true,  // bubbles
                                    true,  // cancelable
                                    window,  // view
                                    0,  // detail
                                    newElement.getBoundingClientRect().left + 10,  // screenX
                                    newElement.getBoundingClientRect().top + 10,  // screenY
                                    newElement.getBoundingClientRect().left + 10,  // clientX
                                    newElement.getBoundingClientRect().top + 10,  // clientY
                                    false,  // ctrlKey
                                    false,  // altKey
                                    false,  // shiftKey
                                    false,  // metaKey
                                    0,  // button
                                    document.body  // relatedTarget (从元素移到body)
                                );
                                newElement.dispatchEvent(mouseOutEvent);
                                console.log(`已触发mouseout事件 ${j}/${n}`);
                            } else {
                                console.log(`未找到新元素 ${j}/${n}: ${newSelector}`);
                            }
 
                            // 等待flagName为1后点击中间按钮
                            const middleButtonSelector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_marketNavButtonContainer__2QI9I > button:nth-child(1)';
 
                            async function waitForFlagAndClick() {
                                let counter = 0; // 添加计数器
                                while (true) {
                                    counter++; // 每次循环增加计数
 
                                    // 检查localStorage中的flagName值
                                    const flag = localStorage.getItem(flagName);
                                    console.log(`当前${flagName}值:`, flag, ' 循环次数:', counter);
 
                                    if (flag === '1' && counter >= 4) {
                                            localStorage.setItem(flagName, '0');
                                        break; // 点击后退出循环
                                    }
 
                                    // 检查是否达到20次循环
                                    if (counter >= 20) {
                                        console.log('已循环20次，退出等待');
                                        localStorage.setItem(flagName, '0');
                                        break;
                                    }
 
                                    // 未满足条件，等待100毫秒后继续检查
                                    await new Promise(resolve => setTimeout(resolve, 100));
                                }
                            }
 
                            // 执行等待并点击函数
                            await waitForFlagAndClick();
 
                            // 点击后等待800毫秒
                            await new Promise(resolve => setTimeout(resolve, 700));
 
                        } else {
                            console.log(`未找到元素 ${j}/${n}: ${elementSelector}`);
                        }
                    }
                } else {
                    console.log(`按钮 ${i} 点击后，未找到目标元素: ${targetSelector}`);
                }
 
            } else {
                console.log(`未找到按钮 ${i}: ${selector}`);
            }
        }
    }
 
    // 添加控制按钮
    function addControlButton() {
        // 全局变量，用于跟踪是否正在执行自动点击
        window.isAutoClickRunning = false;
        // 保存当前执行的Promise，用于取消
        window.currentAutoClickPromise = null;
        // 取消标记
        window.autoClickCanceled = false;
 
        // 创建通用的自动点击执行函数
        function executeAutoClick(targetButtons, button) {
            // 如果正在执行，则停止
            if (window.isAutoClickRunning && button === recordButton) {
                window.autoClickCanceled = true;
                window.isAutoClickRunning = false;
                button.textContent = '记录装备';
                button.style.backgroundColor = '#4CAF50';
                button.disabled = false;
                console.log('自动点击已停止');
                return;
            }
 
            button.textContent = '执行中...';
            button.style.backgroundColor = '#f44336';
            button.disabled = false; // 不禁用按钮，以便可以点击停止
            window.isAutoClickRunning = true;
            window.autoClickCanceled = false;
            console.log('自动点击已开始');
 
            // 保存原始的targetButtons
            const originalTargetButtons = window.targetButtons;
            // 设置新的targetButtons
            window.targetButtons = targetButtons;
 
            // 执行自动点击函数
            async function runAutoClickLoop() {
                if (window.autoClickCanceled) {
                    // 恢复原始的targetButtons
                    window.targetButtons = originalTargetButtons;
                    // 重置状态
                    window.isAutoClickRunning = false;
                    window.currentAutoClickPromise = null;
                    // 重置按钮
                    button.textContent = button === mainButton ? '开始自动点击' : '记录装备';
                    button.style.backgroundColor = '#4CAF50';
                    button.disabled = false;
                    console.log('自动点击已完成');
                    return;
                }
                
                await autoclick();
                
                // 如果是recordButton并且没有取消，则刷新页面
                if (button === recordButton && !window.autoClickCanceled) {
                    console.log('完成一轮点击，准备刷新页面');
                    window.location.reload();
                } else {
                    // 恢复原始的targetButtons
                    window.targetButtons = originalTargetButtons;
                    // 重置状态
                    window.isAutoClickRunning = false;
                    window.currentAutoClickPromise = null;
                    // 重置按钮
                    button.textContent = button === mainButton ? '开始自动点击' : '记录装备';
                    button.style.backgroundColor = '#4CAF50';
                    button.disabled = false;
                    console.log('自动点击已完成');
                }
            }
            
            window.currentAutoClickPromise = runAutoClickLoop();
        }
 
        // 主按钮 - 开始自动点击
        let mainButton = document.createElement('button');
        mainButton.textContent = '开始自动点击';
        mainButton.style.position = 'fixed';
        mainButton.style.top = '10px';
        mainButton.style.left = '10px';
        mainButton.style.zIndex = '9999';
        mainButton.style.padding = '10px';
        mainButton.style.backgroundColor = '#4CAF50';
        mainButton.style.color = 'white';
        mainButton.style.border = 'none';
        mainButton.style.borderRadius = '5px';
        mainButton.style.cursor = 'pointer';
 
        mainButton.addEventListener('click', function () {
            executeAutoClick([1, 5, 7, 1,], mainButton);
        });
 
        // 新按钮 - 记录装备
        let recordButton = document.createElement('button');
        recordButton.textContent = '记录装备';
        recordButton.style.position = 'fixed';
        recordButton.style.top = '60px';  // 位于主按钮下方
        recordButton.style.left = '10px';
        recordButton.style.zIndex = '9999';
        recordButton.style.padding = '10px';
        recordButton.style.backgroundColor = '#2196F3';
        recordButton.style.color = 'white';
        recordButton.style.border = 'none';
        recordButton.style.borderRadius = '5px';
        recordButton.style.cursor = 'pointer';
 
        recordButton.addEventListener('click', function () {
            executeAutoClick([1,5, 7, 5, 7, 5, 7,5,7,5,7], recordButton);
        });
 
        document.body.appendChild(mainButton);
        document.body.appendChild(recordButton);
 
        // 页面加载完成后自动点击记录装备按钮
        setTimeout(() => {
            if (recordButton && document.body.contains(recordButton)) {
                console.log('页面加载完成，自动点击记录装备按钮');
                recordButton.click();
            }
        }, 3000); // 延迟3秒执行，确保页面完全加载
    }
 
    // 添加控制按钮的函数
    function initAutoClickButton() {
        try {
            // 尝试直接添加按钮
            addControlButton();
            console.log('自动点击按钮已直接添加');
        } catch (error) {
            console.error('直接添加按钮失败:', error);
 
            // 如果失败，尝试使用DOMContentLoaded事件
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', addControlButton);
                console.log('等待DOM加载完成后添加按钮');
            } else {
                // 如果DOM已加载完成，使用setTimeout延迟添加
                setTimeout(addControlButton, 1000);
                console.log('DOM已加载完成，延迟1秒添加按钮');
            }
        }
    }
 
    // 立即初始化按钮
    initAutoClickButton();
 
    // 备用方案：使用定时器检查DOM是否就绪
    let checkDOMTimer = setInterval(() => {
        if (document.body) {
            clearInterval(checkDOMTimer);
            // 确保按钮已添加
            if (!document.querySelector('button[style*="z-index: 9999"]')) {
                addControlButton();
                console.log('通过定时器检查添加按钮');
            }
        }
    }, 500);
 
})();