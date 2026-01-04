// ==UserScript==
// @name         MoYuIdleHelperPlus
// @namespace    https://tampermonkey.net/
// @version      2.7.0
// @description  摸鱼放置助手 
// @author       Mid & Firestream
// @license      MIT
// @match        https://www.moyu-idle.com/*
// @match        https://moyu-idle.com/*
// @run-at       document-start
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js
// @downloadURL https://update.greasyfork.org/scripts/542439/MoYuIdleHelperPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/542439/MoYuIdleHelperPlus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const VERSION = "2.7.0";
    const tast = true;
    const dbuglistenws = false;
    let enableDebugLogging = false;

    // --- START: WebSocket 拦截器 ---
    if (window.isMoYuHelperWsAttached) { return; }
    window.isMoYuHelperWsAttached = true;
    console.log('🟢 摸鱼放置助手 : 准备部署全入口原型链拦截器。');
    const OriginalWebSocket = window.WebSocket;
    window._moyuHelperWS = null;

    const originalAddEventListener = OriginalWebSocket.prototype.addEventListener;
    OriginalWebSocket.prototype.addEventListener = function(type, listener, options) {
        window._moyuHelperWS = this;
        if (type === 'message') {
            const originalListener = listener;
            const wrappedListener = (event) => {
                if (enableDebugLogging) logMessage(event);
                processMessageEvent(event);
                if (typeof originalListener === 'function') originalListener.call(this, event);
                else if (originalListener && typeof originalListener.handleEvent === 'function') originalListener.handleEvent.call(originalListener, event);
            };
            if (!this._wrappedListeners) { this._wrappedListeners = new Map(); }
            this._wrappedListeners.set(listener, wrappedListener);
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    const originalRemoveEventListener = OriginalWebSocket.prototype.removeEventListener;
    OriginalWebSocket.prototype.removeEventListener = function(type, listener, options) {
        if (type === 'message' && this._wrappedListeners && this._wrappedListeners.has(listener)) {
            const wrappedListener = this._wrappedListeners.get(listener);
            this._wrappedListeners.delete(listener);
            return originalRemoveEventListener.call(this, type, wrappedListener, options);
        }
        return originalRemoveEventListener.call(this, type, listener, options);
    };

    Object.defineProperty(OriginalWebSocket.prototype, 'onmessage', {
        get: function() { return this._onmessageListener || null; },
        set: function(listener) {
            window._moyuHelperWS = this;
            if (this._onmessageListener) this.removeEventListener('message', this._onmessageListener);
            this._onmessageListener = listener;
            if (typeof listener === 'function') this.addEventListener('message', listener);
        },
        configurable: true, enumerable: true
    });

    const originalSend = OriginalWebSocket.prototype.send;
    OriginalWebSocket.prototype.send = function(data) {
        window._moyuHelperWS = this;
        if (enableDebugLogging) console.log('%c[WebSocket 已发送]', 'color: #03A9F4; font-weight: bold;', data);
        if(typeof data === 'string' && data.includes('requestCharacterStatusInfo')) {
            setTimeout(requestPlayerSkills, 500); // 延迟请求技能以确保状态更新
        }
        return originalSend.call(this, data);
    };

    function detectCompression(buf) { const b = new Uint8Array(buf); if (b.length >= 2) { if (b[0] === 0x1f && b[1] === 0x8b) return 'gzip'; if (b[0] === 0x78 && (((b[0] << 8) | b[1]) % 31) === 0) return 'zlib'; } return 'deflate'; }
    function logMessage(event) { let messageData = event.data; if (messageData instanceof ArrayBuffer) { try { const format = detectCompression(messageData); let text = pako.inflate(new Uint8Array(messageData), { to: 'string' }); const obj = JSON.parse(text); console.log('%c[WebSocket 已接收]', 'color: #4CAF50; font-weight: bold;', `(已解压 ${format})`, obj); } catch (e) { console.error('[WS] 解压或解析消息失败', e); } } else { try { const obj = JSON.parse(messageData); console.log('%c[WebSocket 已接收]', 'color: #4CAF50; font-weight: bold;', '(JSON)', obj); } catch (e) { console.log('%c[WebSocket 已接收]', 'color: #4CAF50; font-weight: bold;', '(文本)', messageData); } } }
    const pendingBinaryEvents = [];
    function processMessageEvent(event) { if (typeof event.data === 'string') { const simpleMatch = event.data.match(/^42(\[.*\])$/); if (simpleMatch) { try { const arr = JSON.parse(simpleMatch[1]); if (Array.isArray(arr) && typeof arr[0] === 'string') { processCommand(arr[0], arr[1]); } } catch(e) {} return; } const binaryPlaceholderMatch = event.data.match(/^451-(\[.*\])$/); if (binaryPlaceholderMatch) { try { const arr = JSON.parse(binaryPlaceholderMatch[1]); pendingBinaryEvents.push(arr); } catch(e) {} return; } } if (event.data instanceof ArrayBuffer) { const pendingEvent = pendingBinaryEvents.shift(); if (pendingEvent) { try { let text = pako.inflate(new Uint8Array(event.data), { to: 'string' }); const binaryData = JSON.parse(text); processCommand(pendingEvent[0], binaryData); } catch (e) { if (enableDebugLogging) console.error(`[MoYuHelper] 二进制包处理失败 (指令: ${pendingEvent[0]}):`, e); } } } }
    // --- END: WebSocket 拦截器 ---

    // ===== 全局共享变量 =====
    let userInfo = null;
    window.currentRoomInfo = null;
    const pendingPromises = new Map();
    const ASYNC_TIMEOUT = 8000;

    // ===== START: 核心数据与常量 =====
    const LOCAL_STORAGE_NAME = "MO_YU_IDLE_HELPER_DATA";
    const INVENTORY_STORAGE_NAME = "MO_YU_IDLE_HELPER_INVENTORY";
    const EARNINGS_STORAGE_NAME = "MO_YU_IDLE_HELPER_EARNINGS";
    const SETTINGS_STORAGE_NAME = "MO_YU_IDLE_HELPER_SETTINGS";
    const PROJECTION_STABILIZE_COUNT = 50; // 掉落50次后切换到EMA
    const EMA_ALPHA = 0.1; // EMA平滑因子
    
    const damageAccum = new Map(), actionCount = new Map(), healAccum = new Map();
    let dropStatistics = { gold: 0, goldDropCount: 0 }, saveInventoryEnabled = false, lastProcessedTimestamp = null;
    let earningsStartTime = null;
    let xpStatistics = {
        strengthXp: 0, dexterityXp: 0, attackXp: 0,
        staminaXp: 0, defenseXp: 0,
        skillCasts: {}, totalIntelligenceXp: 0
    };
    let projections = {
        goldEmaPerHour: 0,
        strPerHour: 0, dexPerHour: 0, atkPerHour: 0,
        staPerHour: 0, defPerHour: 0, intPerHour: 0
    };
    let playerSkills = new Map();
    let playerAttributes = new Map();

    const SKILL_LEVEL_UP_XP = [0, 20, 45, 80, 125, 180, 245, 320, 405, 500, 605, 720, 845, 980, 1125, 1280, 1445, 1620, 1805, 2e3, 2205, 2420, 2645, 2880, 3125, 3380, 3645, 3920, 4205, 4500, 4805, 5760, 6825, 8e3, 9285, 10680, 12185, 13800, 15525, 17360, 19305, 21360, 23525, 25800, 28185, 30680, 33285, 36e3, 38825, 41760, 44805, ...Array.from({length: 50}, (e, t) => Math.floor(44805 * Math.pow(1.18, t + 1))), ...Array.from({length: 30}, (e, t) => Math.floor(44805 * Math.pow(1.18, 50) * Math.pow(1.15, t + 1))), ...Array.from({length: 20}, (e, t) => Math.floor(44805 * Math.pow(1.18, 50) * Math.pow(1.15, 30) * Math.pow(1.12, t + 1)))];
    const attributeNames = { battle: "战斗", strength: "力量", dexterity: "敏捷", intelligence: "智力", stamina: "耐力", attacking: "攻击", defencing: "防御" };
    const skillNames = { baseAttack: "普通攻击", boneShield: "骨盾", corrosiveBreath: "腐蚀吐息", summonBerryBird: "召唤浆果鸟", baseHeal: "基础治疗", poison: "中毒", selfHeal: "自我疗愈", sweep: "横扫", baseGroupHeal: "基础群体治疗", powerStrike: "重击", guardianLaser: "守护者激光", lavaBreath: "熔岩吐息", dragonRoar: "龙之咆哮", doubleStrike: "双重打击", lowestHpStrike: "弱点打击", explosiveShot: "爆炸射击", freeze: "冻结", iceBomb: "冰弹", lifeDrain: "吸血", roar: "咆哮", blizzard: "暴风雪", ironWall: "铁壁", curse: "诅咒", shadowBurst: "暗影爆发", groupCurse: "群体诅咒", holyLight: "神圣之光", bless: "祝福", revive: "复活", groupRegen: "群体再生", astralBarrier: "星辉结界", astralBlast: "星辉冲击", groupSilence: "群体沉默", selfRepair: "自我修复", cleanse: "驱散", cometStrike: "彗星打击", armorBreak: "破甲", starTrap: "星辰陷阱", emperorCatFinale_forAstralEmpressBoss: "星辉终极裁决", astralStorm: "星辉风暴", groupShield: "群体护盾", sneak: "潜行", ambush: "偷袭", poisonClaw: "毒爪", shadowStep: "暗影步", silenceStrike: "沉默打击", slientSmokeScreen: "静默烟雾弹", mirrorImage: "镜像影分身", shadowAssassinUlt: "绝影连杀", stardustMouseSwap: "偷天换日", dizzySpin: "眩晕旋转", carouselOverdrive: "失控加速", candyBomb: "糖果爆裂", prankSmoke: "恶作剧烟雾", plushTaunt: "毛绒嘲讽", starlightSanctuary: "星光治愈", ghostlyStrike: "鬼影冲锋", paradeHorn: "狂欢号角", clownSummon: "小丑召集令", kingAegis: "猫王庇护", sealMagic: "封印魔法", banish: "驱逐", bind: "束缚", detectMagic: "识破魔法", punish: "惩戒", confuse: "扰乱", forbiddenMagic: "禁忌魔法", ultimateLibraryJudgement: "禁魔审判" };
    const itemIdNameMap = { "__satiety": "饱食度", "__cat": "小猫咪", "gold": "金币", "catPawCoin": "猫爪古钱币", "wood": "木材", "stone": "矿石", "coal": "煤炭", "iron": "铁", "steel": "钢", "silverOre": "银矿", "silverIngot": "银锭", "mithrilOre": "秘银矿", "mithrilIngot": "秘银锭", "bamboo": "竹子", "fish": "鱼", "mushroom": "蘑菇", "berry": "浆果", "chickenEgg": "鸡蛋", "milk": "牛奶", "salmon": "鲑鱼", "tuna": "金枪鱼", "honey": "蜂蜜", "herb": "草药", "wool": "羊毛", "silk": "蚕丝", "cashmere": "羊绒布料", "silkFabric": "丝绸布料", "axe": "斧头", "pickaxe": "铁镐", "baseHealSkillBook": "基础治疗技能书", "sweepSkillBook": "横扫", "collectRing": "采集戒指", "collectRing2": "附魔采集戒指", "catTailorClothes": "毛毛裁缝服", "catTailorGloves": "毛毛裁缝手套", "woolTailorClothes": "羊毛裁缝服", "woolTailorGloves": "羊毛裁缝手套", "goblinDaggerPlus": "哥布林匕首·改", "wolfPeltArmor": "狼皮甲", "skeletonShieldPlus": "骷髅盾·强化", "trollClubPlus": "巨魔木棒·重型", "scorpionStingerSpear": "巨蝎毒矛", "guardianCoreAmulet": "守护者核心护符", "moonlightGuardianCoreAmulet": "月光守护者", "dragonScaleArmor": "龙鳞甲", "woolCoat": "羊毛衣", "woolHat": "羊毛帽", "woolGloves": "羊毛手套", "woolPants": "羊毛裤", "ironCoat": "铁甲衣", "ironHat": "铁头盔", "ironGloves": "铁护手", "ironPants": "铁护腿", "steelCoat": "钢甲衣", "steelHat": "钢头盔", "steelGloves": "钢护手", "steelPants": "钢护腿", "silverSword": "银质剑", "silverDagger": "银质匕首", "silverCoat": "银护甲", "silverHat": "银头盔", "silverGloves": "银护手", "silverPants": "银护腿", "simpleSalad": "野草沙拉", "wildFruitMix": "野果拼盘", "fishSoup": "鱼汤", "berryPie": "浆果派", "mushroomStew": "蘑菇炖汤", "catMint": "猫薄荷饼干", "catSnack": "猫咪零食", "luxuryCatFood": "豪华猫粮", "sashimiPlatter": "鲜鱼刺身拼盘", "catGiftBag": "猫猫礼袋", "luckyCatBox": "幸运猫盒", "mysteryCan": "神秘罐头", "catnipSurprise": "猫薄荷惊喜包", "meowEnergyBall": "喵能量球", "dreamFeatherBag": "梦羽袋", "woodSword": "木剑", "ironSword": "铁剑", "steelSword": "钢剑", "catFurCoat": "毛毛衣", "catFurHat": "毛毛帽", "catFurGloves": "毛毛手套", "catFurPants": "毛毛裤", "collectingBracelet": "采集手环", "fishingHat": "钓鱼帽", "miningBelt": "采矿工作服", "farmingGloves": "园艺手套", "heavyMinerGloves": "重型矿工手套", "agileGatherBoots": "灵巧采集靴", "focusedFishingCap": "钓鱼专注帽", "woodFishingRod": "木钓竿", "chefHat": "厨师帽", "ancientFishboneNecklace": "远古鱼骨项链", "moonlightPendant": "月光吊坠", "testResource": "测试资源", "forestDagger": "冰霜匕首", "snowWolfCloak": "雪狼皮披风", "iceFeatherBoots": "冰羽靴", "icePickaxe": "冰稿", "woolBurqa": "羊毛罩袍", "woolMageHat": "羊毛法师帽", "woolMageLongGloves": "羊毛法师手套", "woolMagePants": "羊毛法师裤", "silkMageBurqa": "丝质罩袍", "silkMageHat": "丝质法师帽", "silkMageLongGloves": "丝质法师手套", "silkMagePants": "丝质法师裤", "woolTightsCloth": "羊毛紧身衣", "woolDexHeadScarf": "羊毛裹头巾", "woolDexGloves": "羊毛绑带手套", "woolTightsPants": "羊毛紧身裤", "silkTightsCloth": "丝质夜行衣", "silkDexHeadScarf": "丝质裹头巾", "silkDexGloves": "丝质绑带手套", "silkTightsPants": "丝质宽松裤", "woodStaff": "木法杖", "ironDagger": "铁匕首", "moonlightStaff": "月光法杖", "mewShadowStaff": "喵影法杖", "groupShieldSkillBook": "群体护盾技能书", "silverNecklace": "银项链", "silverBracelet": "银手链", "catPotionSilverBracelet": "猫薄荷手链", "catFurCuteHat": "毛毛可爱帽", "woolCuteHat": "羊毛可爱帽", "catPawStamp": "猫爪印章", "rareCatfish": "稀有猫鱼", "mysticalKoi": "神秘锦鲤", "treasureMap": "藏宝图", "catPawFossil": "猫爪化石", "catStatue": "猫雕像", "mysteriousBell": "神秘铃铛", "ancientCatBowl": "古代猫碗", "catScroll": "猫之卷轴", "catAntiqueShard": "猫咪文物碎片", "catHairball": "猫毛球", "luckyCatCharm": "招财猫护符", "catnipGem": "猫薄荷宝石", "ancientFishBone": "远古鱼骨", "whiskerFeather": "胡须羽毛", "moonlightBell": "月光铃铛", "shell": "贝壳", "mysticalEssence": "神秘精华", "catPotion": "猫薄荷药剂", "magicScroll": "魔法卷轴", "catRelic": "猫咪圣物", "blessedBell": "祝福铃铛", "slimeGel": "史莱姆凝胶", "slimeCore": "史莱姆核心", "goblinEar": "哥布林耳朵", "goblinDagger": "哥布林匕首", "batWing": "蝙蝠翅膀", "batTooth": "蝙蝠牙", "wolfFang": "狼牙", "wolfPelt": "狼皮", "skeletonBone": "骷髅骨", "skeletonShield": "骷髅残盾", "toxicSpore": "毒孢子", "mushroomCap": "蘑菇怪帽", "lizardScale": "蜥蜴鳞片", "lizardTail": "蜥蜴尾巴", "spiritEssence": "幽灵精华", "ectoplasm": "灵质", "trollHide": "巨魔兽皮", "trollClub": "巨魔木棒", "scorpionStinger": "巨蝎毒针", "scorpionCarapace": "巨蝎甲壳", "guardianCore": "守护者核心", "ancientGear": "古代齿轮", "lavaHeart": "熔岩之心", "dragonScale": "龙鳞", "venomDagger": "剧毒匕首", "emberAegis": "余烬庇护", "iceGel": "冰霜凝胶", "frostCrystal": "霜之结晶", "snowWolfFur": "雪狼皮", "frostDagger": "冰霜匕首", "iceBomb": "冰弹", "iceBatWing": "冰蝙蝠翅膀", "snowRabbitFur": "雪兔皮", "frostEssence": "霜之精华", "snowBeastFang": "巨兽獠牙", "snowBeastHide": "巨兽皮", "frostCrown": "霜之王冠", "shadowFur": "暗影猫皮", "catShadowGem": "猫影宝石", "dungeonKey": "地牢钥匙", "ironPawArmor": "铁爪护甲", "phantomWhisker": "幻影胡须", "curseWing": "诅咒之翼", "golemCore": "猫偶核心", "witchHat": "巫术猫帽", "shadowOrb": "暗影法球", "abyssalCloak": "深渊披风", "ancestorCrown": "猫祖王冠", "starEssence": "星辉精华", "starShard": "星辰碎片", "trapParts": "陷阱零件", "starDust": "星尘", "starCrown": "星辉王冠", "starRelic": "星辉遗物", "nightEyeGem": "夜瞳宝石", "toxicFur": "剧毒皮毛", "whiskerCharm": "胡须护符", "shadowCape": "暗影披风", "rareClaw": "稀有利爪", "smokeBall": "烟雾弹", "candyBomb": "糖果炸弹", "plushFur": "毛绒绒", "ghostEssence": "恶灵精华", "loadOfamusementPark": "“游乐园之王”", "paradeCape": "游行披风", "empressCloak": "女皇披风", "mithrilSword": "秘银剑", "mithrilDagger": "秘银匕首", "mithrilHat": "秘银头盔", "mithrilCoat": "秘银护甲", "mithrilGloves": "秘银手套", "mithrilPants": "秘银护腿", "steelHammer": "钢制重锤", "paper": "纸", "book": "书", "pencil": "碳笔", "experienceOfStrength": "力量经验", "experienceOfDexterity": "敏捷经验", "experienceOfIntelligence": "智力经验", "bookOfStrength": "力量之书", "bookOfDexterity": "敏捷之书", "bookOfIntelligence": "智力之书", "magicBook": "魔法书", "slimeDivideCore": "分裂核心", "batShadownCape": "蝠影披风", "fangNecklace": "兽牙项链", "overloadGuardianCore": "过载核心", "shadowBlade": "影之刃", "starDustMagicBook": "星辰魔法书", "stealthAmulet": "伏击吊坠", "initiativeAmulet": "先机吊坠", "nightmarePrisonChest": "噩梦监狱宝箱", "glassBottles": "玻璃瓶", "manacrystal": "魔晶石", "catEyeStone": "猫眼石", "amberEyeStone": "琥珀瞳石", "fishscaleMineral": "鱼鳞矿", "fluffstone": "绒毛岩", "clawmarkOre": "爪痕矿", "fishscaleMineralIgnot": "鱼鳞合金", "shadowSteel": "暗影精铁", "starforgedAlloy": "星辰合金", "manacrystalStaff": "魔晶法杖", "ironPot": "铁锅", "ironShovel": "铁铲", "steelPot": "钢锅", "steelShovel": "钢铲", "ironMachinistHammer": "铁锤", "steelMachinistHammer": "钢锤", "fermentationStirrer": "酿造搅拌器", "mithrilMachinistHammer": "秘银工匠锤", "woolArtisanOutfit": "羊毛工匠服", "silkCuteHat": "丝质可爱帽", "silkCuteGloves": "丝质可爱手套", "silkArtisanOutfit": "丝质工匠服", "silkTailorClothes": "丝质裁缝服", "silkTailorGloves": "丝质裁缝手套", "cloudwalkerBoots": "云行靴", "cloudwalkerCloak": "云行斗篷", "fishscaleMineralHat": "鱼鳞合金头盔", "fishscaleMineralCoat": "鱼鳞合金盔甲", "fishscaleMineralGloves": "鱼鳞合金护手", "fishscaleMineralPants": "鱼鳞合金护腿", "berryWine": "浆果酒", "custardPudding": "蛋奶布丁", "woodPulp": "木浆", "sand": "沙子", "jadeTuna": "翡翠金枪鱼", "emberEel": "余烬鳗", "moonlightShrimp": "月光虾", "crystalCarp": "水晶鲤", "dawnBlossom": "晨露花", "amberSap": "琥珀汁", "luminousMoss": "夜光苔", "windBellHerb": "风铃草", "cloudCotton": "云絮", "rainbowShard": "彩虹碎片", "autoFeeder": "自动喂食器", "scratchingPost": "猫抓板" };
    Object.entries(skillNames).forEach(([skillId, skillName]) => { const bookId = skillId + 'SkillBook'; if (!itemIdNameMap[bookId]) { itemIdNameMap[bookId] = skillName + '技能书'; } });

    const startTime = Date.now();
    let panel, content, tabBar, tabBtns = {}, activeTab = 'combat';
    let panelWidth = 420, panelHeight = 500, isCollapsed = false;

    // --- START: 核心UI渲染模块 ---
    function savePanelSettings() { const data = { enableDebugLogging, panelWidth, panelHeight }; let allData = {}; try { allData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || {}; } catch (e) { allData = {}; } allData[SETTINGS_STORAGE_NAME] = data; localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(allData)); }
    function loadPanelSettings() {
        try {
            const allData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || {};
            const saved = allData[SETTINGS_STORAGE_NAME];
            if (saved) {
                enableDebugLogging = saved.enableDebugLogging || false;
                panelWidth = saved.panelWidth || 420;
                panelHeight = saved.panelHeight || 500;
                if (panel) {
                    panel.style.width = `${panelWidth}px`;
                    panel.style.height = `${panelHeight}px`;
                }
            }
        } catch (e) { console.warn('加载面板设置失败:', e); }
    }
    function renderContent() { if (!content) return; let panelContent = ''; switch (activeTab) { case 'combat': panelContent = renderCombatPanel(); break; case 'inventory': panelContent = renderInventoryPanel(); break; case 'earnings': panelContent = renderEarningsPanel(); break; case 'room': panelContent = renderRoomPanel(); break; case 'settings': panelContent = renderSettingsPanel(); break; } content.innerHTML = panelContent; setTimeout(() => attachEventListeners(activeTab), 50); }
    function setActiveTab(key) { activeTab = key; for (const k in tabBtns) { tabBtns[k].style.borderBottomColor = (k === key) ? '#ffd700' : 'transparent'; tabBtns[k].style.color = (k === key) ? '#ffd700' : '#fff'; } renderContent(); }
    function renderCombatPanel() { return `<table style="width:100%;border-collapse:collapse;font-size:13px;"><thead><tr style="color:#ffd700;"><th style="text-align:left;">玩家</th><th style="text-align:right;">输出效率</th><th style="text-align:right;">治疗效率</th><th style="text-align:right;">总伤害</th><th style="text-align:right;">总治疗</th></tr></thead><tbody id="dpsTableBody"></tbody></table><div style="margin-top:12px;"><div style="font-weight:bold;margin-bottom:4px;">战斗日志</div><ul id="battleLog" style="max-height:${panelHeight-250}px;overflow-y:auto;padding-left:18px;font-size:13px;"></ul></div>`; }
    function renderInventoryPanel() { return `<div style='margin-bottom:12px;'><div style='display:flex;align-items:center;gap:8px;margin-bottom:8px;'><input type="checkbox" id="save-inventory-toggle" ${saveInventoryEnabled?'checked':''} style="margin:0;" /><label for="save-inventory-toggle" style="font-size:13px;">启动保存掉落统计</label><button id="clear-inventory-btn" style="margin-left:auto;padding:4px 12px;border-radius:4px;border:1px solid #666;background:#333;color:#fff;font-size:12px;cursor:pointer;">清除记录</button></div><div style='font-size:12px;color:#888;'>启用后，将自动记录掉落与收益，请在“个人收益”页查看。</div></div><table style="width:100%;border-collapse:collapse;font-size:13px;"><thead><tr style="color:#ffd700;"><th style="text-align:left;">物品</th><th style="text-align:right;">数量</th></tr></thead><tbody id="inventoryTableBody"></tbody></table>`; }
    function renderEarningsPanel() {
        return `
            <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom:1px solid #555;">
                <h4 style="color:#ffd700; margin:0; padding: 5px 0; ">金币收益预期</h4>
                <button id="clear-earnings-btn" style="padding:2px 8px;border-radius:4px;border:1px solid #555;background:#3a3a3a;color:#ccc;font-size:11px;cursor:pointer; margin-left:10px; flex-shrink: 0;">清除收益</button>
            </div>
            <div id="gold-projection-content" style="margin-bottom: 15px;"></div>
            <div style="margin-bottom: 15px;">
                 <h4 style="color:#ffd700; margin:0 0 10px 0; border-bottom:1px solid #555; padding-bottom:5px;">属性经验预期</h4>
                 <div id="attribute-xp-container" style="font-size: 12px; line-height: 1.6;">
                    <table style="width:100%;font-size:12px;border-collapse:collapse;">
                        <thead><tr style="color:#ffd700;"><th style="text-align:left;">属性 (LV)</th><th style="text-align:center;">经验进度</th><th style="text-align:right;">经验/小时</th><th style="text-align:right;">预计下一级</th></tr></thead>
                        <tbody id="attribute-xp-table"><tr><td colspan="4" style="text-align:center;color:#888;">暂无数据</td></tr></tbody>
                    </table>
                 </div>
            </div>
            <div>
                <h4 style="color:#ffd700; margin:0 0 10px 0; border-bottom:1px solid #555; padding-bottom:5px;">技能经验预期</h4>
                <table style="width:100%;font-size:12px;border-collapse:collapse; margin-top: 8px;">
                    <thead><tr style="color:#ffd700;"><th style="text-align:left;">技能 (LV)</th><th style="text-align:center;">经验进度</th><th style="text-align:right;">经验/小时</th><th style="text-align:right;">预计下一级</th></tr></thead>
                    <tbody id="skill-xp-table"><tr><td colspan="4" style="text-align:center;color:#888;">暂无数据</td></tr></tbody>
                </table>
            </div>
        `;
    }

    function renderSettingsPanel() {
        let tastSection = '';
        if (tast) { tastSection = `<div style='margin-top:20px; border-top: 1px solid #444; padding-top: 12px;'><div style='font-weight:bold;font-size:16px;margin-bottom:12px;'>开发者/测试工具</div><div style="display: flex; gap: 10px; margin-bottom: 8px;"><button id="force-stop-battle-btn" style="padding: 6px 14px; border-radius: 5px; border: 1px solid #e67e22; background-color: #f39c12; color: white; font-weight: bold; cursor: pointer;">强制停战</button><button id="force-leave-room-btn" style="padding: 6px 14px; border-radius: 5px; border: 1px solid #c0392b; background-color: #e74c3c; color: white; font-weight: bold; cursor: pointer;">强制越狱</button></div><div style='font-size:12px;color:#888;'><b>强制停战：</b>3秒后发送停战指令。</div><div style='font-size:12px;color:#888;margin-top: 4px;'><b>强制越狱：</b>3秒后先停战再退房。</div></div>`; }
        
        let debugWsSection = '';
        if (dbuglistenws) {
            debugWsSection = `<div style='margin-bottom:16px;'><div style='display:flex;align-items:center;gap:8px;margin-bottom:8px;'><input type="checkbox" id="debug-logging-toggle" ${enableDebugLogging ? 'checked' : ''} style="margin:0;" /><label for="debug-logging-toggle" style="font-size:13px;">启用WebSocket调试日志</label></div><div style='font-size:12px;color:#888;padding-left:26px;'>在浏览器F12控制台中显示所有收发的WebSocket消息。</div></div>`;
        }

        return `<div style='font-weight:bold;font-size:16px;margin-bottom:12px;'>全局设置</div>
                ${debugWsSection}
                <div style="margin-bottom: 16px; border-top: 1px solid #444; padding-top: 12px;"><div style='font-weight:bold;font-size:16px;margin-bottom:12px;'>外观设置</div><div style="display:flex; gap: 10px; align-items: center;"><label for="panel-width-input">宽度:</label><input type="number" id="panel-width-input" value="${panelWidth}" style="width: 60px; background: #222; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 2px 4px;" /><label for="panel-height-input">高度:</label><input type="number" id="panel-height-input" value="${panelHeight}" style="width: 60px; background: #222; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 2px 4px;" /></div></div>${tastSection}`;
    }
    // --- END: 核心UI渲染模块 ---

    window.userProfileCache = window.userProfileCache || {};
    function fetchUserProfile(uuid, cb) { if (window.userProfileCache[uuid]) { cb(window.userProfileCache[uuid]); return; } const apiUrl = `${window.location.origin}/api/game/user/profile?uuid=${uuid}`; fetch(apiUrl).then(r=>r.json()).then(res=>{ if(res&&res.code===200&&res.data){ window.userProfileCache[uuid]=res.data; cb(res.data); } else { cb({uuid,name:uuid}); } }).catch(()=>cb({uuid,name:uuid})); }
    const MapInfos = { plain_001: { name: "悠闲平原" }, forest_001: { name: "幽暗森林" }, cave_001: { name: "黑石洞窟" }, ruins_001: { name: "遗迹深处" }, snowfield_001: { name: "极寒雪原" }, cat_dungeon_001: { name: "猫影深渊" }, holy_cat_temple_001: { name: "神圣猫咪神殿" }, shadow_paw_hideout: { name: "影爪巢穴" }, astralEmpressTrial: { name: "星辉女帝试炼" }, amusement_park: { name: "游乐园" } };
    function renderRoomPanel(){ const i=window.currentRoomInfo; if (!i){ return`<div style='color:#888;text-align:center;'>暂无房间信息</div>`; } const m=i.memberIds||[];let r='';m.forEach(u=>{let n=window.userProfileCache[u]?.name||u;if(!window.userProfileCache[u]){fetchUserProfile(u,()=>{if(activeTab==='room')renderContent()})}const d=i.readyMap&&i.readyMap[u];r+=`<li>${n}：<span style='color:${d?'#0f0':'#f00'};'>${d?'已准备':'未准备'}</span></li>`});const a=MapInfos[i.area]?.name||i.area; return`<div style='font-weight:bold;font-size:16px;margin-bottom:8px;'>${i.name||'房间'}</div><div>房主：${window.userProfileCache[i.ownerId]?.name||i.ownerId}</div><div>成员：${m.length}/${i.maxMembers}</div><div>状态：${i.status}</div><div>类型：${i.type}</div><div>区域：${a}</div><div>轮次：${i.currentRepeat}/${i.repeatCount}</div><div>自动重开：${i.autoRestart?'是':'否'}</div><div>创建时间：${new Date(i.createdAt).toLocaleString()}</div><div style='margin-top:8px;font-weight:bold;'>成员准备情况：</div><ul style='padding-left:18px;'>${r}</ul>`;}
    function updateDpsPanel(pu,mm){const t=document.querySelector('#dpsTableBody');if(!t)return;if(!pu||!mm||pu.length===0){t.innerHTML=`<tr><td colspan="5" style="text-align:center;color:#888;">暂无数据</td></tr>`;return}const r=pu.map(u=>{const tot=damageAccum.get(u)||0,h=healAccum.get(u)||0,c=actionCount.get(u)||1,n=mm[u]?.name||u,d=Math.round(tot/c),p=Math.round(h/c);return{name:n,dps:d,hps:p,total:tot,heal:h}}).sort((a,b)=>b.dps-a.dps);t.innerHTML=r.map(x=>`<tr><td>${x.name}</td><td style='text-align:right;'>${x.dps}</td><td style='text-align:right;'>${x.hps}</td><td style='text-align:right;'>${x.total}</td><td style='text-align:right;'>${x.heal}</td></tr>`).join('')}
    const logList=[];let logAutoScroll=true;
    function addBattleLog(l){logList.push(...l);while(logList.length>200)logList.shift();const u=document.getElementById('battleLog');if(u){u.innerHTML=logList.map(x=>`<li style='margin-bottom:2px;'>${x}</li>`).join('');if(logAutoScroll)u.scrollTop=u.scrollHeight}}
    
    // --- START: 数据处理与统计模块 ---
    const formatDecimal = (num) => (num || 0).toFixed(2);
    function formatHours(hours) { if (hours === Infinity || !hours || hours < 0) return "∞"; if (hours < 1) return `${Math.floor(hours * 60)}分`; if (hours < 24) return `${(Math.floor(hours * 10) / 10).toFixed(1)}时`; const days = Math.floor(hours / 24); const remainingHours = hours % 24; return `${days}天 ${(Math.floor(remainingHours * 10) / 10).toFixed(1)}时`; }
    function formatGold(num) { if (!num || num < 1000) return formatDecimal(num); if (num < 1000000) return `${(num / 1000).toFixed(1)}k`; return `${(num / 1000000).toFixed(1)}m`; }

    function updateInventoryPanel(){const t=document.querySelector('#inventoryTableBody');if(!t)return;const s=Object.entries(dropStatistics).filter(([k])=>k!=='goldDropCount').filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);t.innerHTML=s.map(([i,v])=>`<tr><td>${itemIdNameMap[i]||i}</td><td style="text-align:right;">${v}</td></tr>`).join('')}
    
    function updateEarningsPanel() {
        const getEl = id => document.getElementById(id);
        const goldContentEl = getEl('gold-projection-content');
        if (goldContentEl) {
            let goldPerHour;
            if (dropStatistics.goldDropCount > PROJECTION_STABILIZE_COUNT) {
                goldPerHour = projections.goldEmaPerHour;
            } else {
                const elapsedHours = earningsStartTime ? (Date.now() - earningsStartTime) / 3600000 : 0;
                if (elapsedHours > 0 && dropStatistics.goldDropCount > 0) {
                    const credibility = dropStatistics.goldDropCount / PROJECTION_STABILIZE_COUNT;
                    const avgGoldPerDrop = dropStatistics.gold / dropStatistics.goldDropCount;
                    const dropsPerHour = dropStatistics.goldDropCount / elapsedHours;
                    goldPerHour = (avgGoldPerDrop * dropsPerHour) * credibility;
                } else {
                    goldPerHour = 0;
                }
            }
            goldContentEl.innerHTML = `<p>每小时: <strong style="color:#00e676;">${formatGold(goldPerHour)}</strong> | 每日: <strong style="color:#00e676;">${formatGold(goldPerHour * 24)}</strong></p>`;
        }
        
        const attrTableBody = getEl('attribute-xp-table');
        if (attrTableBody) {
            const attrs = ['battle', 'strength', 'attacking', 'stamina', 'defencing', 'dexterity', 'intelligence'];
            attrTableBody.innerHTML = attrs.map(id => {
                const baseData = playerAttributes.get(id);
                if(!baseData) return '';
                
                const projectionKeyMap = { attacking: 'atkPerHour', defencing: 'defPerHour', strength: 'strPerHour', dexterity: 'dexPerHour', stamina: 'staPerHour', intelligence: 'intPerHour' };
                const xpKeyMap = { attacking: 'attackXp', defencing: 'defenseXp', strength: 'strengthXp', dexterity: 'dexterityXp', stamina: 'staminaXp', intelligence: 'totalIntelligenceXp' };
                
                const hourly = projections[projectionKeyMap[id]] || 0;
                const gainedXp = xpStatistics[xpKeyMap[id]] || 0;

                let currentLevel = baseData.level;
                let currentTotalXp = baseData.currentExp + gainedXp;
                let xpForNextLevel = SKILL_LEVEL_UP_XP[currentLevel];
                while (xpForNextLevel !== undefined && currentTotalXp >= xpForNextLevel) { currentTotalXp -= xpForNextLevel; currentLevel++; xpForNextLevel = SKILL_LEVEL_UP_XP[currentLevel]; }
                if(xpForNextLevel === undefined) xpForNextLevel = Infinity;

                const xpNeeded = xpForNextLevel - currentTotalXp;
                const hoursToNextLvl = hourly > 0 ? xpNeeded / hourly : Infinity;
                
                return `<tr>
                            <td>${attributeNames[id] || id} (LV.${currentLevel})</td>
                            <td style="text-align:center;">${Math.floor(currentTotalXp)}/${xpForNextLevel === Infinity ? 'MAX' : xpForNextLevel}</td>
                            <td style="text-align:right;">${formatDecimal(hourly)}</td>
                            <td style="text-align:right;">${formatHours(hoursToNextLvl)}</td>
                        </tr>`;
            }).join('');
        }

        const skxEl = getEl('skill-xp-table');
        if (skxEl && playerSkills.size > 0 && earningsStartTime) {
            const elapsedHours = (Date.now() - earningsStartTime) / 3600000;
            const sortedSkills = Array.from(playerSkills.keys()).sort((a, b) => (xpStatistics.skillCasts[b] || 0) - (xpStatistics.skillCasts[a] || 0));
            
            skxEl.innerHTML = sortedSkills.map(id => {
                const baseData = playerSkills.get(id);
                if (!baseData) return '';
                const casts = xpStatistics.skillCasts[id] || 0;
                const gainedXp = casts;
                const skillXpHour = elapsedHours > 0 ? gainedXp / elapsedHours : 0;
                
                let currentLevel = baseData.level;
                let currentTotalXp = baseData.exp + gainedXp;
                let xpForNextLevel = SKILL_LEVEL_UP_XP[currentLevel];

                while (xpForNextLevel !== undefined && currentTotalXp >= xpForNextLevel) { currentTotalXp -= xpForNextLevel; currentLevel++; xpForNextLevel = SKILL_LEVEL_UP_XP[currentLevel]; }
                if(xpForNextLevel === undefined) xpForNextLevel = Infinity;

                const xpNeeded = xpForNextLevel - currentTotalXp;
                const hoursToNextLvl = skillXpHour > 0 ? xpNeeded / skillXpHour : Infinity;

                return `<tr><td>${skillNames[id] || id} (LV.${currentLevel})</td><td style="text-align:center;">${currentTotalXp}/${xpForNextLevel === Infinity ? 'MAX' : xpForNextLevel}</td><td style="text-align:right;">${formatDecimal(skillXpHour)}</td><td style="text-align:right;">${formatHours(hoursToNextLvl)}</td></tr>`;
            }).join('');
        } else if (skxEl) {
            skxEl.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#888;">暂无数据</td></tr>`;
        }
    }

    function saveAllData() {
        const inventoryData = { dropStatistics, saveInventoryEnabled, lastProcessedTimestamp };
        const earningsData = { earningsStartTime, projections, xpStatistics, playerSkills: Array.from(playerSkills.entries()), playerAttributes: Array.from(playerAttributes.entries()) };
        let allData = {};
        try { allData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || {}; } catch(e){}
        allData[INVENTORY_STORAGE_NAME] = inventoryData;
        allData[EARNINGS_STORAGE_NAME] = earningsData;
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(allData));
    }
    
    function loadAllData() {
        try {
            const allData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || {};
            const inv = allData[INVENTORY_STORAGE_NAME];
            if (inv) {
                dropStatistics = inv.dropStatistics || { gold: 0, goldDropCount: 0 };
                saveInventoryEnabled = inv.saveInventoryEnabled || false;
                lastProcessedTimestamp = inv.lastProcessedTimestamp || null;
            }
            const earn = allData[EARNINGS_STORAGE_NAME];
            if (earn) {
                earningsStartTime = earn.earningsStartTime || null;
                projections = earn.projections || projections;
                xpStatistics = earn.xpStatistics || xpStatistics;
                playerSkills = new Map(earn.playerSkills || []);
                playerAttributes = new Map(earn.playerAttributes || []);
            }
        } catch(e) { console.warn('加载全部数据失败:', e); }
    }

    function processDropLogs(logs) {
        if (!saveInventoryEnabled || !lastProcessedTimestamp) return;
        let newLatestTimestamp = lastProcessedTimestamp;
        let newDropsCount = 0;
        let goldInThisBatch = 0;

        for (const log of logs) {
            if (log.date > lastProcessedTimestamp) {
                newDropsCount++;
                if (log.info.gold) {
                    goldInThisBatch += log.info.gold.count;
                    dropStatistics.goldDropCount = (dropStatistics.goldDropCount || 0) + 1;
                }
                for (const [itemId, itemData] of Object.entries(log.info)) {
                    if(itemId !== 'gold') {
                        if (itemData.count > 0) dropStatistics[itemId] = (dropStatistics[itemId] || 0) + itemData.count;
                    }
                }
                dropStatistics.gold = (dropStatistics.gold || 0) + (log.info.gold?.count || 0);
                if (log.date > newLatestTimestamp) newLatestTimestamp = log.date;
            } else { break; }
        }

        if (newDropsCount > 0) {
            console.log(`[MoYuHelper] 处理了 ${newDropsCount} 条新的掉落记录。`);
            const timeDiffHours = (newLatestTimestamp - lastProcessedTimestamp) / 3600000;
            if(timeDiffHours > 0 && goldInThisBatch > 0) {
                 const currentGoldRate = goldInThisBatch / timeDiffHours;
                 projections.goldEmaPerHour = (projections.goldEmaPerHour || currentGoldRate) * (1 - EMA_ALPHA) + currentGoldRate * EMA_ALPHA;
            }
            lastProcessedTimestamp = newLatestTimestamp;
            saveAllData();
            if (activeTab === 'inventory') updateInventoryPanel();
            if (activeTab === 'earnings') updateEarningsPanel();
        }
    }

    function requestAndProcessDropLogs() {
        if (!saveInventoryEnabled || !window._moyuHelperWS || !userInfo) return;
        const command = "inventory:getModifyInfoByType", successCmd = "inventory:getModifyInfoByType:success", failCmd = "inventory:getModifyInfoByType:fail";
        new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => { pendingPromises.delete(successCmd); reject(new Error(`Request for ${command} timed out.`)); }, ASYNC_TIMEOUT);
            pendingPromises.set(successCmd, { resolve: (res) => { clearTimeout(timeoutId); pendingPromises.delete(successCmd); resolve(res); }, reject: (err) => { clearTimeout(timeoutId); pendingPromises.delete(successCmd); reject(err); }, failCmd: failCmd });
            window._moyuHelperWS.send(`42["${command}",{"user":${JSON.stringify(userInfo)},"data":{"type":"Battle"}}]`);
        }).then(rawData => { if (rawData && rawData.data) processDropLogs(rawData.data); }).catch(error => console.error('[MoYuHelper] 异步获取掉落日志失败:', error));
    }

    function requestPlayerSkills() {
        if (!window._moyuHelperWS || !userInfo) return;
        const command = "character:getSkills", successCmd = "character:getSkills:success", failCmd = "character:getSkills:fail";
        new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => { pendingPromises.delete(successCmd); reject(new Error(`Request for ${command} timed out.`)); }, ASYNC_TIMEOUT);
            pendingPromises.set(successCmd, { resolve: (res) => { clearTimeout(timeoutId); pendingPromises.delete(successCmd); resolve(res); }, reject: (err) => { clearTimeout(timeoutId); pendingPromises.delete(successCmd); reject(err); }, failCmd: failCmd });
            window._moyuHelperWS.send(`42["${command}",{"user":${JSON.stringify(userInfo)},"data":{}}]`);
        }).then(rawData => {
            if (rawData && rawData.data) {
                console.log(`[MoYuHelper] 技能数据已同步。`);
                playerSkills.clear();
                rawData.data.forEach(skill => playerSkills.set(skill.skillId, { level: skill.level, exp: skill.exp }));
                saveAllData();
                if(activeTab === 'earnings') updateEarningsPanel();
            }
        }).catch(error => console.error('[MoYuHelper] 异步获取玩家技能失败:', error));
    }
    // --- END: 数据处理与统计模块 ---

    // ===== START: 卡房处理与手动操作核心逻辑 =====
    function forceStopBattleAction() { if (!userInfo || !window.currentRoomInfo) { alert('错误：无法执行操作。未获取到用户信息或当前不在任何房间内。'); return; } if (!window._moyuHelperWS) { alert('错误：WebSocket未连接。'); return; } if (confirm("确定要强制停止当前战斗吗？\n将在3秒后发送指令。")) { console.log("[MoYuHelper] 指令已计划：强制停战将在3秒后执行。"); setTimeout(() => { const roomId = window.currentRoomInfo.uuid; const stopBattleCommand = `42["battle:stopBattle",{"user":${JSON.stringify(userInfo)},"data":{"roomId":"${roomId}"}}]`; window._moyuHelperWS.send(stopBattleCommand); console.log("[MoYuHelper] 强制停战指令已发送。"); }, 3000); } }
    function forceLeaveRoomAction() { if (!userInfo || !window.currentRoomInfo) { alert('错误：无法执行操作。未获取到用户信息或当前不在任何房间内。'); return; } if (!window._moyuHelperWS) { alert('错误：WebSocket未连接。'); return; } if (confirm("确定要强制停止战斗并退出牢房吗？\n此操作无法撤销，将在3秒后启动。")) { console.log("[MoYuHelper] 指令已计划：强制越狱将在3秒后执行。"); setTimeout(() => { const roomId = window.currentRoomInfo.uuid; const stopBattleCommand = `42["battle:stopBattle",{"user":${JSON.stringify(userInfo)},"data":{"roomId":"${roomId}"}}]`; window._moyuHelperWS.send(stopBattleCommand); setTimeout(() => { const leaveRoomCommand = `42["battleRoom:leave",{"user":${JSON.stringify(userInfo)},"data":null}]`; window._moyuHelperWS.send(leaveRoomCommand); }, 1500); }, 3000); } }
    
    // ===== 核心消息处理与分发 =====
    function handleRoomUpdate(command, rawData) { if (command.endsWith(':leave:success') || (command === 'battleRoom:getCurrentRoom:success' && !rawData.data)) { window.currentRoomInfo = null; } else if (rawData.data) { if (command === 'battleRoom:getCurrentRoom:success') { window.currentRoomInfo = rawData.data; } else if(Array.isArray(rawData.data)) { if (userInfo) { const room = rawData.data.find(r => r.memberIds && r.memberIds.includes(userInfo.uuid)); if (room) window.currentRoomInfo = room; } } else if (typeof rawData.data === 'object' && rawData.data.uuid) { window.currentRoomInfo = rawData.data; } if (window.currentRoomInfo && enableDebugLogging) { console.log(`[MoYuHelper] 房间信息已更新 (${command})`); } } if (activeTab === 'room') renderContent(); }

    function processCommand(command, rawData) {
        if (!command || !rawData) return;
        if (pendingPromises.has(command)) { pendingPromises.get(command).resolve(rawData); return; }
        else { for (const [key, handlers] of pendingPromises.entries()) { if (handlers.failCmd === command) { handlers.reject(new Error(rawData.message || `操作失败: ${command}`)); return; } } }

        if ((!userInfo || !userInfo.uuid) && rawData.user && rawData.user.uuid) {
            userInfo = rawData.user;
            console.log(`%c[MoYuHelper] 用户信息已成功捕获: ${userInfo.name} (ID: ${userInfo.uuid})`, 'color: #00e676; font-weight: bold;');
            requestPlayerSkills();
        }
        
        if (command === 'dispatchCharacterStatusInfo' && rawData.data) {
             console.log(`[MoYuHelper] 角色属性数据已同步。`);
             Object.entries(rawData.data).forEach(([attrId, attrData]) => {
                if(attributeNames[attrId]) {
                    playerAttributes.set(attrId, { level: attrData.level, currentExp: attrData.currentExp });
                }
             });
             xpStatistics.strengthXp = 0; xpStatistics.dexterityXp = 0; xpStatistics.attackXp = 0; xpStatistics.staminaXp = 0; xpStatistics.defenseXp = 0; xpStatistics.totalIntelligenceXp = 0;
             if (saveInventoryEnabled) earningsStartTime = Date.now();
             saveAllData();
             if(activeTab === 'earnings') updateEarningsPanel();
        }

        if (command.startsWith('battleRoom:')) {
            handleRoomUpdate(command, rawData);
            if (command === 'battleRoom:startBattle:success') {
                requestAndProcessDropLogs();
            }
        } else if (command.startsWith('battle:fullInfo:success')) {
            const d = rawData.data;
            if(d && d.battleInfo && d.thisRoundAction){
                const b = d.battleInfo, a = d.thisRoundAction, m = b.members || [];
                const p = (b.groups?.player) || [], mm = Object.fromEntries(m.map(x=>[x.uuid,x]));
                const su = a.sourceUnitUuid, dg = a.damage || {}, hg = a.heal || {};
                
                if(p.includes(su)){ let ha=false; for(const v of Object.values(dg)){damageAccum.set(su,(damageAccum.get(su)||0)+Math.floor(v));ha=true} for(const v of Object.values(hg)){healAccum.set(su,(healAccum.get(su)||0)+Math.floor(v));ha=true} if(ha)actionCount.set(su,(actionCount.get(su)||0)+1) }
                
                if (saveInventoryEnabled && userInfo && earningsStartTime) {
                    const playerUuid = userInfo.uuid;
                    const alliesUuids = b.groups.player || [];
                    const summonOwnerMap = new Map();
                    m.forEach(member => { if (member.summonerUuid) summonOwnerMap.set(member.uuid, member.summonerUuid); });

                    if (a.castSkillId) {
                        const sourceIsPlayer = su === playerUuid;
                        const sourceIsPlayerSummon = summonOwnerMap.get(su) === playerUuid;
                        if (sourceIsPlayer || sourceIsPlayerSummon) {
                            xpStatistics.skillCasts[a.castSkillId] = (xpStatistics.skillCasts[a.castSkillId] || 0) + 1;
                            xpStatistics.totalIntelligenceXp += 0.25;
                        }
                    }

                    for (const [targetUuid, damage] of Object.entries(dg)) {
                        if (damage <= 0) continue;
                        const sourceIsPlayer = su === playerUuid, sourceIsAlly = alliesUuids.includes(su) && !sourceIsPlayer, sourceIsPlayerSummon = summonOwnerMap.get(su) === playerUuid;
                        if (sourceIsPlayer) { xpStatistics.strengthXp += damage * 0.01; xpStatistics.dexterityXp += damage * 0.005; xpStatistics.attackXp += damage * 0.01; }
                        else if (sourceIsPlayerSummon) { xpStatistics.strengthXp += damage * 0.01 * 0.6; xpStatistics.dexterityXp += damage * 0.005 * 0.6; xpStatistics.attackXp += damage * 0.01 * 0.6; }
                        else if (sourceIsAlly) { xpStatistics.strengthXp += damage * 0.01 * 0.3; xpStatistics.dexterityXp += damage * 0.005 * 0.3; xpStatistics.attackXp += damage * 0.01 * 0.3; }
                        
                        if (targetUuid === playerUuid) { xpStatistics.staminaXp += damage * 0.01; xpStatistics.dexterityXp += damage * 0.005; xpStatistics.defenseXp += damage * 0.01; }
                    }

                    const elapsedHours = (Date.now() - earningsStartTime) / 3600000;
                    if (elapsedHours > 0) {
                        projections.intPerHour = xpStatistics.totalIntelligenceXp / elapsedHours;
                        projections.strPerHour = xpStatistics.strengthXp / elapsedHours;
                        projections.dexPerHour = xpStatistics.dexterityXp / elapsedHours;
                        projections.atkPerHour = xpStatistics.attackXp / elapsedHours;
                        projections.staPerHour = xpStatistics.staminaXp / elapsedHours;
                        projections.defPerHour = xpStatistics.defenseXp / elapsedHours;
                    }
                    saveAllData();
                    if(activeTab === 'earnings') updateEarningsPanel();
                }

                window.playerUuids=p; window.memberMap=mm; updateDpsPanel(p,mm);
                let ll=[]; if(p.includes(su)||a.targetUnitUuidList.some(t=>p.includes(t))){ const sn=mm[su]?.name||su, snm=skillNames[a.castSkillId||'?']||a.castSkillId; for(const tu of a.targetUnitUuidList){ const tn=mm[tu]?.name||tu,dmg=Math.floor(dg[tu]||0),h=Math.floor(hg[tu]||0); if(dmg>0)ll.push(`🗡️ <b>${sn}</b> 用 <b>${snm}</b> 对 <b>${tn}</b> 造成 <span style='color:#ff7675;'>${dmg}</span> 伤害`); if(h>0)ll.push(`💚 <b>${sn}</b> 用 <b>${snm}</b> 治疗 <b>${tn}</b> <span style='color:#00e676;'>${h}</span> 生命`); } } if(ll.length)addBattleLog(ll);
            }
        }
    }
    console.log('✅ 摸鱼放置助手 : 原型链拦截器已成功部署。');

    // ===== UI 初始化与事件绑定 =====
    function makeDraggable(handle, el) { let isDown = false, offsetX = 0, offsetY = 0; handle.addEventListener('mousedown', e => { isDown = true; const rect = el.getBoundingClientRect(); offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top; el.style.right = 'auto'; el.style.bottom = 'auto'; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); e.preventDefault(); }); function onMouseMove(e) { if (!isDown) return; let newLeft = e.clientX - offsetX; let newTop = e.clientY - offsetY; const maxLeft = window.innerWidth - el.offsetWidth; const maxTop = window.innerHeight - el.offsetHeight; newLeft = Math.max(0, Math.min(newLeft, maxLeft)); newTop = Math.max(0, Math.min(newTop, maxTop)); el.style.left = `${newLeft}px`; el.style.top = `${newTop}px`; } function onMouseUp() { isDown = false; document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); } }
    function initializeHelperUI() {
        panel = document.createElement('div');
        panel.id = 'moyu-helper-panel';
        panel.style.cssText = `position: fixed; top: 40px; left: 40px; width: ${panelWidth}px; height: ${panelHeight}px; max-width: 90vw; min-height: 60px; background: rgba(30, 32, 40, 0.96); color: #fff; border-radius: 12px; box-shadow: 0 4px 24px 0 rgba(0,0,0,0.25); z-index: 9999; font-size: 14px; user-select: none; transition: all 0.2s; display: flex; flex-direction: column;`;
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: rgba(0,0,0,0.3); border-radius: 12px 12px 0 0; cursor: move; font-weight: bold; font-size: 14px; flex-shrink: 0;`;
        titleBar.innerHTML = `<span>摸鱼放置助手 ${VERSION}</span><div style="display:flex;align-items:center;gap:12px;"><span id="moyu-runtime" style="font-size:12px;color:#ffd700;"></span><button id="moyu-collapse" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;">−</button></div>`;
        tabBar = document.createElement('div');
        tabBar.style.cssText = `display: flex; background: rgba(0,0,0,0.2); border-radius: 12px 12px 0 0; flex-shrink: 0;`;
        const tabs = [{ key: 'combat', label: '战斗统计' }, { key: 'inventory', label: '物品统计' }, { key: 'earnings', label: '个人收益' }, { key: 'room', label: '房间信息' }, { key: 'settings', label: '设置' }];
        tabs.forEach(tab => { const btn = document.createElement('button'); btn.textContent = tab.label; btn.style.cssText = `flex: 1; padding: 6px 0; background: none; border: none; border-bottom: 2px solid transparent; color: #fff; font-size: 15px; cursor: pointer; transition: border-color 0.2s, color 0.2s;`; btn.addEventListener('click', () => setActiveTab(tab.key)); tabBar.appendChild(btn); tabBtns[tab.key] = btn; });
        content = document.createElement('div');
        content.style.cssText = `flex: 1; padding: 12px; overflow-y: auto; overflow-x: hidden; min-height: 0;`;

        function toggleCollapse() { isCollapsed = !isCollapsed; content.style.display = isCollapsed ? 'none' : 'block'; tabBar.style.display = isCollapsed ? 'none' : 'flex'; panel.style.height = isCollapsed ? 'auto' : `${panelHeight}px`; panel.style.minHeight = isCollapsed ? '40px' : '60px'; const collapseBtn = document.querySelector('#moyu-collapse'); if (collapseBtn) { collapseBtn.textContent = isCollapsed ? '+' : '−'; } }
        document.addEventListener('click', (e) => { if (e.target && e.target.id === 'moyu-collapse') { toggleCollapse(); } });
        function updateRuntime() { const now = Date.now(); let diff = Math.floor((now - startTime) / 1000); const h = Math.floor(diff / 3600); diff %= 3600; const m = Math.floor(diff / 60); const s = diff % 60; const runtimeEl = document.getElementById('moyu-runtime'); if (runtimeEl) { runtimeEl.textContent = `已运行: ${h > 0 ? `${h}小时` : ''}${m > 0 ? `${m}分` : ''}${s}秒`; } }
        setInterval(updateRuntime, 1000);
        setTimeout(updateRuntime, 100);

        makeDraggable(titleBar, panel);

        const lpc = document.createElement('style'); lpc.innerHTML=`#battleLog::-webkit-scrollbar{width:8px;background:transparent}#battleLog::-webkit-scrollbar-thumb{background:linear-gradient(120deg,#444 30%,#888 100%);border-radius:6px}#battleLog:hover::-webkit-scrollbar-thumb{background:linear-gradient(120deg,#666 30%,#aaa 100%)}#battleLog{scrollbar-width:thin;scrollbar-color:#888 #222}`; document.head.appendChild(lpc);
        setTimeout(() => { const lp = document.getElementById('battleLog'); if (lp) { lp.addEventListener('scroll', () => { logAutoScroll = lp.scrollTop + lp.clientHeight >= lp.scrollHeight - 5 }); lp.addEventListener('mouseenter', () => { logAutoScroll = false }); lp.addEventListener('mouseleave', () => { logAutoScroll = lp.scrollTop + lp.clientHeight >= lp.scrollHeight - 5 }); } }, 500);
        panel.appendChild(titleBar); panel.appendChild(tabBar); panel.appendChild(content);
        document.body.appendChild(panel);

        loadAllData();
        loadPanelSettings();
        setActiveTab('combat');

        window.MoYuHelperAPI = { getRoomInfo: () => console.log(window.currentRoomInfo || '当前不在任何房间内'), getUserInfo: () => console.log(userInfo || '用户信息尚未获取'), };
    }

    function attachEventListeners(tab) {
        const get = (id) => document.getElementById(id);
        switch (tab) {
            case 'combat': if (window.playerUuids && window.memberMap) updateDpsPanel(window.playerUuids, window.memberMap); break;
            case 'inventory':
                updateInventoryPanel();
                const saveToggle = get('save-inventory-toggle');
                if (saveToggle) { saveToggle.onchange = function() { const wasEnabled = saveInventoryEnabled; saveInventoryEnabled = this.checked; if (saveInventoryEnabled && !wasEnabled) { if (!lastProcessedTimestamp) { const now = Date.now(); lastProcessedTimestamp = now; earningsStartTime = now; alert('统计已开启！\n将从下一场战斗胜利后开始记录掉落与收益。'); } else { alert('统计已恢复。'); } } else if (!saveInventoryEnabled && wasEnabled) { alert('统计已暂停。'); } saveAllData(); }; }
                get('clear-inventory-btn').onclick = () => { if (confirm('警告：此操作将清除所有物品掉落及个人收益记录！确定吗？')) { dropStatistics = { gold: 0, goldDropCount: 0 }; lastProcessedTimestamp = null; xpStatistics = { strengthXp: 0, dexterityXp: 0, attackXp: 0, staminaXp: 0, defenseXp: 0, skillCasts: {}, totalIntelligenceXp: 0 }; earningsStartTime = null; projections = { goldEmaPerHour: 0, strPerHour: 0, dexPerHour: 0, atkPerHour: 0, staPerHour: 0, defPerHour: 0, intPerHour: 0 }; playerSkills.clear(); playerAttributes.clear(); let d = {}; try { d = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || {}; } catch(e){} if(d[INVENTORY_STORAGE_NAME]) delete d[INVENTORY_STORAGE_NAME]; if(d[EARNINGS_STORAGE_NAME]) delete d[EARNINGS_STORAGE_NAME]; localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(d)); updateInventoryPanel(); if(activeTab === 'earnings') updateEarningsPanel(); alert('所有统计记录已清除。'); } };
                break;
            case 'earnings':
                updateEarningsPanel();
                get('clear-earnings-btn').onclick = () => { if (confirm('确定要清除所有个人收益记录吗？(这不会影响物品掉落统计)')) { xpStatistics = { strengthXp: 0, dexterityXp: 0, attackXp: 0, staminaXp: 0, defenseXp: 0, skillCasts: {}, totalIntelligenceXp: 0 }; earningsStartTime = Date.now(); projections = { goldEmaPerHour: 0, strPerHour: 0, dexPerHour: 0, atkPerHour: 0, staPerHour: 0, defPerHour: 0, intPerHour: 0 }; saveAllData(); updateEarningsPanel(); alert('个人收益记录已清除。'); } }
                break;
            case 'room': break;
            case 'settings':
                const debugToggle = get('debug-logging-toggle');
                if (debugToggle) { debugToggle.onchange = function() { enableDebugLogging = this.checked; savePanelSettings(); }; }
                const widthInput = get('panel-width-input');
                const heightInput = get('panel-height-input');
                const updatePanelSize = () => {
                    const newWidth = Math.max(300, Math.min(1000, Number(widthInput.value)));
                    const newHeight = Math.max(200, Math.min(800, Number(heightInput.value)));
                    panelWidth = newWidth; panelHeight = newHeight;
                    panel.style.width = `${panelWidth}px`;
                    panel.style.height = `${panelHeight}px`;
                    savePanelSettings();
                };
                if(widthInput) widthInput.onchange = updatePanelSize;
                if(heightInput) heightInput.onchange = updatePanelSize;
                if (tast) { const stopBtn = get('force-stop-battle-btn'); if (stopBtn) { stopBtn.onclick = forceStopBattleAction; } const leaveBtn = get('force-leave-room-btn'); if (leaveBtn) { leaveBtn.onclick = forceLeaveRoomAction; } }
                break;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHelperUI);
    } else {
        initializeHelperUI();
    }

})();