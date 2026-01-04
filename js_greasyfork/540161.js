// ==UserScript==
// @name         MoYuIdleHelper
// @namespace    https://tampermonkey.net/
// @version      1.2.3
// @description  摸鱼放置助手
// @author       Mid
// @license      MIT
// @match        https://www.moyu-idle.com/*
// @match        https://moyu-idle.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/540161/MoYuIdleHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/540161/MoYuIdleHelper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const VERSION = "v1.2.3";
    const DEBUG_MODE = false; // 调试模式开关

    const logUtil = {
        debug: function (...data) {
            if (DEBUG_MODE) {
                console.log("[摸鱼助手log-debug]", ...data);
            }
        },
        info: function (...data) {
            console.log("[摸鱼助手log-infog]", ...data);
        }
    };

    const LOCAL_STORAGE_NAME = "MO_YU_IDLE_HELPER_DATA";
    const INVENTORY_STORAGE_NAME = "MO_YU_IDLE_HELPER_INVENTORY";
    const SETTINGS_STORAGE_NAME = "MO_YU_IDLE_HELPER_SETTINGS";

    const damageAccum = new Map();  // uuid → 累计伤害
    const actionCount = new Map();  // uuid → 动作次数
    const healAccum = new Map();    // uuid → 累计治疗

    // 仓库物品变动跟踪
    let inventory = {};  // 当前仓库状态
    let inventoryChanges = new Map();  // 物品变动记录
    let userInfo = null;
    let saveInventoryEnabled = false;  // 是否保存掉落信息

    // 技能名称映射
    const skillNames = {
        baseAttack: "普通攻击",
        boneShield: "骨盾",
        corrosiveBreath: "腐蚀吐息",
        summonBerryBird: "召唤浆果鸟",
        baseHeal: "基础治疗",
        poison: "中毒",
        selfHeal: "自我疗愈",
        sweep: "横扫",
        baseGroupHeal: "基础群体治疗",
        powerStrike: "重击",
        guardianLaser: "守护者激光",
        lavaBreath: "熔岩吐息",
        dragonRoar: "龙之咆哮",
        doubleStrike: "双重打击",
        lowestHpStrike: "弱点打击",
        explosiveShot: "爆炸射击",
        freeze: "冻结",
        iceBomb: "冰弹",
        lifeDrain: "吸血",
        roar: "咆哮",
        blizzard: "暴风雪",
        ironWall: "铁壁",
        curse: "诅咒",
        shadowBurst: "暗影爆发",
        groupCurse: "群体诅咒",
        holyLight: "神圣之光",
        bless: "祝福",
        revive: "复活",
        groupRegen: "群体再生",
        astralBarrier: "星辉结界",
        astralBlast: "星辉冲击",
        groupSilence: "群体沉默",
        selfRepair: "自我修复",
        cleanse: "驱散",
        cometStrike: "彗星打击",
        armorBreak: "破甲",
        starTrap: "星辰陷阱",
        emperorCatFinale_forAstralEmpressBoss: "星辉终极裁决",
        astralStorm: "星辉风暴",
        groupShield: "群体护盾",
        sneak: "潜行",
        ambush: "偷袭",
        poisonClaw: "毒爪",
        shadowStep: "暗影步",
        silenceStrike: "沉默打击",
        slientSmokeScreen: "静默烟雾弹",
        mirrorImage: "镜像影分身",
        shadowAssassinUlt: "绝影连杀",
        stardustMouseSwap: "偷天换日",
        dizzySpin: "眩晕旋转",
        carouselOverdrive: "失控加速",
        candyBomb: "糖果爆裂",
        prankSmoke: "恶作剧烟雾",
        plushTaunt: "毛绒嘲讽",
        starlightSanctuary: "星光治愈",
        ghostlyStrike: "鬼影冲锋",
        paradeHorn: "狂欢号角",
        clownSummon: "小丑召集令",
        kingAegis: "猫王庇护",
        sealMagic: "封印魔法",
        banish: "驱逐",
        bind: "束缚",
        detectMagic: "识破魔法",
        punish: "惩戒",
        confuse: "扰乱",
        forbiddenMagic: "禁忌魔法",
        ultimateLibraryJudgement: "禁魔审判"
    };


    // 物品ID到名称映射
    const itemIdNameMap = {
        "__satiety": "饱食度",
        "__cat": "小猫咪",
        "gold": "金币",
        "catPawCoin": "猫爪古钱币",
        "wood": "木材",
        "stone": "矿石",
        "coal": "煤炭",
        "iron": "铁",
        "steel": "钢",
        "silverOre": "银矿",
        "silverIngot": "银锭",
        "mithrilOre": "秘银矿",
        "mithrilIngot": "秘银锭",
        "bamboo": "竹子",
        "fish": "鱼",
        "mushroom": "蘑菇",
        "berry": "浆果",
        "chickenEgg": "鸡蛋",
        "milk": "牛奶",
        "salmon": "鲑鱼",
        "tuna": "金枪鱼",
        "honey": "蜂蜜",
        "herb": "草药",
        "wool": "羊毛",
        "silk": "蚕丝",
        "cashmere": "羊绒布料",
        "silkFabric": "丝绸布料",
        "axe": "斧头",
        "pickaxe": "铁镐",
        "baseHealSkillBook": "基础治疗技能书",
        "sweepSkillBook": "横扫",
        "collectRing": "采集戒指",
        "collectRing2": "附魔采集戒指",
        "catTailorClothes": "毛毛裁缝服",
        "catTailorGloves": "毛毛裁缝手套",
        "woolTailorClothes": "羊毛裁缝服",
        "woolTailorGloves": "羊毛裁缝手套",
        "goblinDaggerPlus": "哥布林匕首·改",
        "wolfPeltArmor": "狼皮甲",
        "skeletonShieldPlus": "骷髅盾·强化",
        "trollClubPlus": "巨魔木棒·重型",
        "scorpionStingerSpear": "巨蝎毒矛",
        "guardianCoreAmulet": "守护者核心护符",
        "moonlightGuardianCoreAmulet": "月光守护者",
        "dragonScaleArmor": "龙鳞甲",
        "woolCoat": "羊毛衣",
        "woolHat": "羊毛帽",
        "woolGloves": "羊毛手套",
        "woolPants": "羊毛裤",
        "ironCoat": "铁甲衣",
        "ironHat": "铁头盔",
        "ironGloves": "铁护手",
        "ironPants": "铁护腿",
        "steelCoat": "钢甲衣",
        "steelHat": "钢头盔",
        "steelGloves": "钢护手",
        "steelPants": "钢护腿",
        "silverSword": "银质剑",
        "silverDagger": "银质匕首",
        "silverCoat": "银护甲",
        "silverHat": "银头盔",
        "silverGloves": "银护手",
        "silverPants": "银护腿",
        "simpleSalad": "野草沙拉",
        "wildFruitMix": "野果拼盘",
        "fishSoup": "鱼汤",
        "berryPie": "浆果派",
        "mushroomStew": "蘑菇炖汤",
        "catMint": "猫薄荷饼干",
        "catSnack": "猫咪零食",
        "luxuryCatFood": "豪华猫粮",
        "sashimiPlatter": "鲜鱼刺身拼盘",
        "catGiftBag": "猫猫礼袋",
        "luckyCatBox": "幸运猫盒",
        "mysteryCan": "神秘罐头",
        "catnipSurprise": "猫薄荷惊喜包",
        "meowEnergyBall": "喵能量球",
        "dreamFeatherBag": "梦羽袋",
        "woodSword": "木剑",
        "ironSword": "铁剑",
        "steelSword": "钢剑",
        "catFurCoat": "毛毛衣",
        "catFurHat": "毛毛帽",
        "catFurGloves": "毛毛手套",
        "catFurPants": "毛毛裤",
        "collectingBracelet": "采集手环",
        "fishingHat": "钓鱼帽",
        "miningBelt": "采矿工作服",
        "farmingGloves": "园艺手套",
        "heavyMinerGloves": "重型矿工手套",
        "agileGatherBoots": "灵巧采集靴",
        "focusedFishingCap": "钓鱼专注帽",
        "woodFishingRod": "木钓竿",
        "chefHat": "厨师帽",
        "ancientFishboneNecklace": "远古鱼骨项链",
        "moonlightPendant": "月光吊坠",
        "testResource": "测试资源",
        "forestDagger": "冰霜匕首",
        "snowWolfCloak": "雪狼皮披风",
        "iceFeatherBoots": "冰羽靴",
        "icePickaxe": "冰稿",
        "woolBurqa": "羊毛罩袍",
        "woolMageHat": "羊毛法师帽",
        "woolMageLongGloves": "羊毛法师手套",
        "woolMagePants": "羊毛法师裤",
        "silkMageBurqa": "丝质罩袍",
        "silkMageHat": "丝质法师帽",
        "silkMageLongGloves": "丝质法师手套",
        "silkMagePants": "丝质法师裤",
        "woolTightsCloth": "羊毛紧身衣",
        "woolDexHeadScarf": "羊毛裹头巾",
        "woolDexGloves": "羊毛绑带手套",
        "woolTightsPants": "羊毛紧身裤",
        "silkTightsCloth": "丝质夜行衣",
        "silkDexHeadScarf": "丝质裹头巾",
        "silkDexGloves": "丝质绑带手套",
        "silkTightsPants": "丝质宽松裤",
        "woodStaff": "木法杖",
        "ironDagger": "铁匕首",
        "moonlightStaff": "月光法杖",
        "mewShadowStaff": "喵影法杖",
        "groupShieldSkillBook": "群体护盾技能书",
        "silverNecklace": "银项链",
        "silverBracelet": "银手链",
        "catPotionSilverBracelet": "猫薄荷手链",
        "catFurCuteHat": "毛毛可爱帽",
        "woolCuteHat": "羊毛可爱帽",
        "catPawStamp": "猫爪印章",
        "rareCatfish": "稀有猫鱼",
        "mysticalKoi": "神秘锦鲤",
        "treasureMap": "藏宝图",
        "catPawFossil": "猫爪化石",
        "catStatue": "猫雕像",
        "mysteriousBell": "神秘铃铛",
        "ancientCatBowl": "古代猫碗",
        "catScroll": "猫之卷轴",
        "catAntiqueShard": "猫咪文物碎片",
        "catHairball": "猫毛球",
        "luckyCatCharm": "招财猫护符",
        "catnipGem": "猫薄荷宝石",
        "ancientFishBone": "远古鱼骨",
        "whiskerFeather": "胡须羽毛",
        "moonlightBell": "月光铃铛",
        "shell": "贝壳",
        "mysticalEssence": "神秘精华",
        "catPotion": "猫薄荷药剂",
        "magicScroll": "魔法卷轴",
        "catRelic": "猫咪圣物",
        "blessedBell": "祝福铃铛",
        "slimeGel": "史莱姆凝胶",
        "slimeCore": "史莱姆核心",
        "goblinEar": "哥布林耳朵",
        "goblinDagger": "哥布林匕首",
        "batWing": "蝙蝠翅膀",
        "batTooth": "蝙蝠牙",
        "wolfFang": "狼牙",
        "wolfPelt": "狼皮",
        "skeletonBone": "骷髅骨",
        "skeletonShield": "骷髅残盾",
        "toxicSpore": "毒孢子",
        "mushroomCap": "蘑菇怪帽",
        "lizardScale": "蜥蜴鳞片",
        "lizardTail": "蜥蜴尾巴",
        "spiritEssence": "幽灵精华",
        "ectoplasm": "灵质",
        "trollHide": "巨魔兽皮",
        "trollClub": "巨魔木棒",
        "scorpionStinger": "巨蝎毒针",
        "scorpionCarapace": "巨蝎甲壳",
        "guardianCore": "守护者核心",
        "ancientGear": "古代齿轮",
        "lavaHeart": "熔岩之心",
        "dragonScale": "龙鳞",
        "venomDagger": "剧毒匕首",
        "emberAegis": "余烬庇护",
        "iceGel": "冰霜凝胶",
        "frostCrystal": "霜之结晶",
        "snowWolfFur": "雪狼皮",
        "frostDagger": "冰霜匕首",
        "iceBomb": "冰弹",
        "iceBatWing": "冰蝙蝠翅膀",
        "snowRabbitFur": "雪兔皮",
        "frostEssence": "霜之精华",
        "snowBeastFang": "巨兽獠牙",
        "snowBeastHide": "巨兽皮",
        "frostCrown": "霜之王冠",
        "shadowFur": "暗影猫皮",
        "catShadowGem": "猫影宝石",
        "dungeonKey": "地牢钥匙",
        "ironPawArmor": "铁爪护甲",
        "phantomWhisker": "幻影胡须",
        "curseWing": "诅咒之翼",
        "golemCore": "猫偶核心",
        "witchHat": "巫术猫帽",
        "shadowOrb": "暗影法球",
        "abyssalCloak": "深渊披风",
        "ancestorCrown": "猫祖王冠",
        "starEssence": "星辉精华",
        "starShard": "星辰碎片",
        "trapParts": "陷阱零件",
        "starDust": "星尘",
        "starCrown": "星辉王冠",
        "starRelic": "星辉遗物",
        "nightEyeGem": "夜瞳宝石",
        "toxicFur": "剧毒皮毛",
        "whiskerCharm": "胡须护符",
        "shadowCape": "暗影披风",
        "rareClaw": "稀有利爪",
        "smokeBall": "烟雾弹",
        "candyBomb": "糖果炸弹",
        "plushFur": "毛绒绒",
        "ghostEssence": "幽灵精华",
        "loadOfamusementPark": "游乐园之王",
        "paradeCape": "游行披风",
        "empressCloak": "女皇披风"
        // ...如有遗漏可继续补充
    };

    // 自动为每个技能生成技能书条目
    Object.entries(skillNames).forEach(([skillId, skillName]) => {
        const bookId = skillId + 'SkillBook';
        if (!itemIdNameMap[bookId]) {
            itemIdNameMap[bookId] = skillName + '技能书';
        }
    });

    // 运行时间
    const startTime = Date.now();

    // 创建主面板
    const panel = document.createElement('div');
    let panelWidth = 420;
    let panelHeight = 500;
    panel.id = 'moyu-helper-panel';
    panel.style.cssText = `
        position: fixed;
        top: 40px;
        left: 40px;
        width: ${panelWidth}px;
        height: ${panelHeight}px;
        max-width: 90vw;
        min-height: 60px;
        background: rgba(30, 32, 40, 0.96);
        color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 24px 0 rgba(0,0,0,0.25);
        z-index: 99999;
        font-size: 14px;
        user-select: none;
        transition: box-shadow 0.2s;
        display: flex;
        flex-direction: column;
    `;

    // 标题栏
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: rgba(0,0,0,0.3);
        border-radius: 12px 12px 0 0;
        cursor: move;
        font-weight: bold;
        font-size: 14px;
        flex-shrink: 0;
    `;
    titleBar.innerHTML = `
        <span>摸鱼放置助手 ${VERSION}</span>
        <div style="display:flex;align-items:center;gap:12px;">
            <span id="moyu-runtime" style="font-size:12px;color:#ffd700;"></span>
            <button id="moyu-collapse" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;">−</button>
        </div>
    `;

    // 标签栏
    const tabBar = document.createElement('div');
    tabBar.style.cssText = `
        display: flex;
        background: rgba(0,0,0,0.2);
        border-radius: 12px 12px 0 0;
        flex-shrink: 0;
    `;
    const tabs = [
        { key: 'combat', label: '战斗统计' },
        // { key: 'inventory', label: '物品统计' },
        { key: 'room', label: '房间信息' },
        { key: 'settings', label: '设置' }
    ];
    let activeTab = 'combat';
    const tabBtns = {};
    tabs.forEach(tab => {
        const btn = document.createElement('button');
        btn.textContent = tab.label;
        btn.style.cssText = `
            flex: 1;
            padding: 6px 0;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            color: #fff;
            font-size: 15px;
            cursor: pointer;
            transition: border-color 0.2s, color 0.2s;
        `;
        btn.addEventListener('click', () => setActiveTab(tab.key));
        tabBar.appendChild(btn);
        tabBtns[tab.key] = btn;
    });

    // 内容区域
    const content = document.createElement('div');
    content.style.cssText = `
        flex: 1;
        padding: 12px;
        overflow-y: auto;
        overflow-x: hidden;
        min-height: 0;
    `;

    // WebSocket发送栏
    const wsSendBar = document.createElement('div');
    wsSendBar.style.cssText = `
        padding: 8px 12px;
        background: rgba(0,0,0,0.2);
        border-top: 1px solid #333;
        display: flex;
        gap: 8px;
        align-items: center;
        flex-shrink: 0;
    `;
    wsSendBar.innerHTML = `
        <select id="moyu-ws-cmd-type" style="padding:4px 8px;border-radius:6px;border:1px solid #444;background:#222;color:#fff;font-size:13px;">
            <option value="character:getProfile">character:getProfile</option>
            <option value="character:getProfile">character:getProfile</option>
            <option value="chat:createPublicChatMsg">chat:createPublicChatMsg</option>
            <!-- 可扩展更多指令 -->
        </select>
        <input id="moyu-ws-cmd" type="text" placeholder="输入WebSocket指令(JSON或文本)" style="flex:1;padding:4px 8px;border-radius:6px;border:1px solid #444;background:#222;color:#fff;outline:none;font-size:13px;" />
        <button id="moyu-ws-send" style="padding:4px 16px;border-radius:6px;border:none;background:#ffd700;color:#222;font-weight:bold;cursor:pointer;">发送</button>
    `;
    // 自动填充格式
    wsSendBar.querySelector('#moyu-ws-cmd-type').onchange = function () {
        const cmd = this.value;
        if (cmd === 'character:getProfile') {
            wsSendBar.querySelector('#moyu-ws-cmd').value =
                '42["character:getProfile",' + JSON.stringify({ user: userInfo, data: null }) + ']';
        }
    };
    // 默认填充
    wsSendBar.querySelector('#moyu-ws-cmd-type').onchange();
    // 主动发送指令频率限制
    let lastSendTime = 0;
    const MIN_SEND_INTERVAL = 1000; // 1秒
    // 统一频率限制的发送函数
    function sendWithRateLimit(msg) {
        const now = Date.now();
        if (now - lastSendTime < MIN_SEND_INTERVAL) {
            if (DEBUG_MODE) console.warn('发送过于频繁，已被限制');
            return false;
        }
        if (window._moyuHelperWS && window._moyuHelperWS.readyState === 1) {
            window._moyuHelperWS.send(msg);
            lastSendTime = now;
            return true;
        } else {
            alert('WebSocket未连接');
            return false;
        }
    }
    wsSendBar.querySelector('#moyu-ws-send').onclick = function () {
        const val = wsSendBar.querySelector('#moyu-ws-cmd').value.trim();
        if (!val) return;
        if (!sendWithRateLimit(val)) {
            alert('发送过于频繁，请稍后再试');
        }
    };

    // 折叠逻辑
    let isCollapsed = false;
    function toggleCollapse() {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
            // 折叠时隐藏内容和标签栏，调整面板高度
            content.style.display = 'none';
            tabBar.style.display = 'none';
            panel.style.height = 'auto';
            panel.style.minHeight = '40px';
        } else {
            // 展开时显示内容和标签栏，恢复面板高度
            content.style.display = '';
            tabBar.style.display = 'flex';
            panel.style.height = panelHeight + 'px';
            panel.style.minHeight = '60px';
        }
        const collapseBtn = document.querySelector('#moyu-collapse');
        if (collapseBtn) {
            collapseBtn.textContent = isCollapsed ? '+' : '−';
        }
    }

    // 绑定折叠按钮事件（使用事件委托）
    document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'moyu-collapse') {
            toggleCollapse();
        }
    });

    // 运行时间刷新
    function updateRuntime() {
        const now = Date.now();
        let diff = Math.floor((now - startTime) / 1000);
        const h = Math.floor(diff / 3600);
        diff %= 3600;
        const m = Math.floor(diff / 60);
        const s = diff % 60;
        document.getElementById('moyu-runtime').textContent =
            `已运行: ${h > 0 ? h + '小时' : ''}${m > 0 ? m + '分' : ''}${s}秒`;
    }
    setInterval(updateRuntime, 1000);
    setTimeout(updateRuntime, 100);

    // 拖动逻辑（仅标题栏可拖动）
    (function makeDraggable(handle, el) {
        let isDown = false, offsetX = 0, offsetY = 0;
        handle.addEventListener('mousedown', e => {
            isDown = true;
            el.style.right = 'auto';
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
            e.preventDefault();
        });
        document.addEventListener('mousemove', e => {
            if (!isDown) return;
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            // 边界检测，防止拖出屏幕
            const maxLeft = window.innerWidth - el.offsetWidth;
            const maxTop = window.innerHeight - el.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            el.style.left = newLeft + 'px';
            el.style.top = newTop + 'px';
        });
        document.addEventListener('mouseup', () => { isDown = false; });
    })(titleBar, panel);

    // 标签切换逻辑
    function setActiveTab(key) {
        activeTab = key;
        for (const k in tabBtns) {
            tabBtns[k].style.borderBottomColor = (k === key) ? '#ffd700' : 'transparent';
            tabBtns[k].style.color = (k === key) ? '#ffd700' : '#fff';
        }
        renderContent();
        // 切换后刷新对应数据
        if (activeTab === 'combat') {
            setTimeout(() => {
                // 需要有 playerUuids 和 memberMap 数据
                if (typeof updateDpsPanel === 'function' && window.playerUuids && window.memberMap) {
                    updateDpsPanel(window.playerUuids, window.memberMap);
                }
            }, 0);
        } else if (activeTab === 'inventory') {
            setTimeout(() => {
                if (typeof updateInventoryPanel === 'function') {
                    updateInventoryPanel();
                }
            }, 0);
        } else if (activeTab === 'room') {
            setTimeout(() => {
                if (typeof renderRoomPanel === 'function') {
                    renderRoomPanel();
                }
            }, 0);
        } else if (activeTab === 'settings') {
            renderSettingsPanel();
        }
    }

    // 面板尺寸设置

    let panelSettings = {
        width: panelWidth,
        height: panelHeight
    };

    // 加载面板设置
    function loadPanelSettings() {
        try {
            const allData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || {};
            const saved = allData[SETTINGS_STORAGE_NAME];
            if (saved) {
                if (saved.panelWidth && saved.panelHeight) {
                    panelWidth = saved.panelWidth;
                    panelHeight = saved.panelHeight;
                    panelSettings = saved;
                    updatePanelSize();
                }
            }
        } catch (e) {
            console.warn('加载面板设置失败:', e);
        }
    }

    // 保存面板设置
    function savePanelSettings() {
        const data = {
            panelWidth: panelWidth,
            panelHeight: panelHeight
        };
        let allData = {};
        try {
            allData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || {};
        } catch (e) { allData = {}; }
        allData[SETTINGS_STORAGE_NAME] = data;
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(allData));
    }

    // 更新面板尺寸
    function updatePanelSize() {
        panel.style.width = panelWidth + 'px';
        panel.style.height = panelHeight + 'px';
        // 重新渲染内容以适应新尺寸
        renderContent();
    }

    // 设置面板内容
    function renderSettingsPanel() {
        return `
            <div style='font-weight:bold;font-size:16px;margin-bottom:12px;'>面板设置</div>
            <div style='margin-bottom:16px;'>
                <div style='display:flex;align-items:center;gap:8px;margin-bottom:8px;'>
                    <label style="font-size:13px;min-width:60px;">面板宽度：</label>
                    <input type="number" id="panel-width" value="${panelWidth}" min="200" max="800" style="width:80px;padding:4px 8px;border-radius:4px;border:1px solid #444;background:#222;color:#fff;font-size:13px;" />
                    <span style="font-size:12px;color:#888;">px</span>
                </div>
                <div style='display:flex;align-items:center;gap:8px;margin-bottom:8px;'>
                    <label style="font-size:13px;min-width:60px;">面板高度：</label>
                    <input type="number" id="panel-height" value="${panelHeight}" min="200" max="800" style="width:80px;padding:4px 8px;border-radius:4px;border:1px solid #444;background:#222;color:#fff;font-size:13px;" />
                    <span style="font-size:12px;color:#888;">px</span>
                </div>
                <div style='font-size:12px;color:#888;margin-top:8px;'>调整后会自动保存设置</div>
            </div>
        `;
    }

    // 内容渲染
    function renderContent() {
        if (activeTab === 'combat') {
            content.innerHTML = renderCombatPanel();
            // 渲染历史日志
            setTimeout(() => {
                const ul = document.getElementById('battleLog');
                if (ul) {
                    ul.innerHTML = logList.map(l => `<li style='margin-bottom:2px;'>${l}</li>`).join('');
                    // 自动滚动到底部
                    if (logAutoScroll) ul.scrollTop = ul.scrollHeight;
                }
            }, 0);
        } else if (activeTab === 'inventory') {
            content.innerHTML = renderInventoryPanel();
            // 绑定物品统计设置事件
            setTimeout(() => {
                const saveToggle = document.getElementById('save-inventory-toggle');
                const clearBtn = document.getElementById('clear-inventory-btn');
                if (saveToggle) {
                    saveToggle.onchange = function () {
                        saveInventoryEnabled = this.checked;
                        if (saveInventoryEnabled) {
                            saveInventoryData();
                        }
                    };
                }
                if (clearBtn) {
                    clearBtn.onclick = function () {
                        if (confirm('确定要清除所有物品统计记录吗？此操作不可恢复。')) {
                            // 清除内存中的数据
                            inventory = {};
                            // 清除本地存储
                            let allData = {};
                            try {
                                allData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || {};
                            } catch (e) { allData = {}; }
                            delete allData[INVENTORY_STORAGE_NAME];
                            localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(allData));
                            // 更新显示
                            updateInventoryPanel();
                            alert('物品统计记录已清除');
                        }
                    };
                }
            }, 100);
        } else if (activeTab === 'room') {
            content.innerHTML = renderRoomPanel();
            // 绑定自动准备设置事件
            setTimeout(() => {
                const toggle = document.getElementById('auto-ready-toggle');
                const threshold = document.getElementById('auto-ready-threshold');
                const stopBattleToggle = document.getElementById('auto-stop-battle-toggle');
                const kickUnreadyToggle = document.getElementById('auto-kick-unready-toggle');
                if (toggle) {
                    toggle.onchange = function () {
                        autoReadyEnabled = this.checked;
                    };
                }
                if (threshold) {
                    threshold.onchange = function () {
                        let v = parseInt(this.value) || 2;
                        if (v < 2) v = 2;
                        if (v > 6) v = 6;
                        autoReadyThreshold = v;
                        this.value = v;
                    };
                }
                if (stopBattleToggle) {
                    stopBattleToggle.onchange = function () {
                        autoStopBattleEnabled = this.checked;
                    };
                }
                if (kickUnreadyToggle) {
                    kickUnreadyToggle.onchange = function () {
                        autoKickUnreadyEnabled = this.checked;
                        renderContent();
                    };
                }
                // 绑定自动招募设置事件
                const recruitToggle = document.getElementById('auto-recruit-toggle');
                const recruitMsg = document.getElementById('auto-recruit-msg');
                if (recruitToggle) {
                    recruitToggle.onchange = function () {
                        autoRecruitEnabled = this.checked;
                        renderContent();
                    };
                }
                if (recruitMsg) {
                    recruitMsg.oninput = function () {
                        autoRecruitMsg = this.value;
                    };
                }
            }, 100);
        } else if (activeTab === 'settings') {
            content.innerHTML = renderSettingsPanel();
            // 绑定设置事件
            setTimeout(() => {
                const widthInput = document.getElementById('panel-width');
                const heightInput = document.getElementById('panel-height');
                if (widthInput) {
                    widthInput.onchange = function () {
                        panelWidth = Math.max(200, Math.min(800, parseInt(this.value) || 320));
                        this.value = panelWidth;
                        updatePanelSize();
                        savePanelSettings();
                    };
                }
                if (heightInput) {
                    heightInput.onchange = function () {
                        panelHeight = Math.max(200, Math.min(800, parseInt(this.value) || 400));
                        this.value = panelHeight;
                        updatePanelSize();
                        savePanelSettings();
                    };
                }
            }, 100);
        }
    }

    // 战斗统计内容（可根据实际数据结构填充）
    function renderCombatPanel() {
        return `
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead>
                    <tr style="color:#ffd700;">
                        <th style="text-align:left;">玩家</th>
                        <th style="text-align:right;">输出效率</th>
                        <th style="text-align:right;">治疗效率</th>
                        <th style="text-align:right;">总伤害</th>
                        <th style="text-align:right;">总治疗</th>
                    </tr>
                </thead>
                <tbody id="dpsTableBody">
                    <!-- 动态填充 -->
                </tbody>
            </table>
            <div style="margin-top:12px;">
                <div style="font-weight:bold;margin-bottom:4px;">战斗日志</div>
                <ul id="battleLog" style="max-height:${panelHeight - 300}px;overflow-y:auto;padding-left:18px;font-size:13px;"></ul>
            </div>
        `;
    }

    // 物品统计内容（可根据实际数据结构填充）
    function renderInventoryPanel() {
        return `
            <div style='margin-bottom:12px;'>
                <div style='display:flex;align-items:center;gap:8px;margin-bottom:8px;'>
                    <input type="checkbox" id="save-inventory-toggle" ${saveInventoryEnabled ? 'checked' : ''} style="margin:0;" />
                    <label for="save-inventory-toggle" style="font-size:13px;">保存掉落信息</label>
                    <button id="clear-inventory-btn" style="margin-left:auto;padding:4px 12px;border-radius:4px;border:1px solid #666;background:#333;color:#fff;font-size:12px;cursor:pointer;">清除记录</button>
                </div>
                <div style='font-size:12px;color:#888;'>启用后，物品统计数据将保存到本地，页面刷新后不会丢失</div>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead>
                    <tr style="color:#ffd700;">
                        <th style="text-align:left;">物品</th>
                        <th style="text-align:right;">数量</th>
                    </tr>
                </thead>
                <tbody id="inventoryTableBody">
                    <!-- 动态填充 -->
                </tbody>
            </table>
        `;
    }

    // 用户信息缓存
    window.userProfileCache = window.userProfileCache || {};
    // 获取用户信息（异步）
    function fetchUserProfile(uuid, cb) {
        if (window.userProfileCache[uuid]) {
            cb(window.userProfileCache[uuid]);
            return;
        }
        fetch(`https://moyu-idle.com/api/game/user/profile?uuid=${uuid}`)
            .then(r => r.json())
            .then(res => {
                if (res && res.code === 200 && res.data) {
                    window.userProfileCache[uuid] = res.data;
                    cb(res.data);
                } else {
                    cb({ uuid, name: uuid });
                }
            })
            .catch(() => cb({ uuid, name: uuid }));
    }

    // 地图信息
    const MapInfos = {
        plain_001: { id: "plain_001", name: "悠闲平原", description: "阳光明媚、草地广阔的平原，适合新手猫咪冒险者探索。这里有许多温顺的小动物和丰富的浆果、蘑菇资源。" },
        forest_001: { id: "forest_001", name: "幽暗森林", description: "一片常年被迷雾笼罩的森林，适合新手冒险者历练。" },
        cave_001: { id: "cave_001", name: "黑石洞窟", description: "阴暗潮湿的洞窟，哥布林和蝙蝠出没其间。" },
        ruins_001: { id: "ruins_001", name: "遗迹深处", description: "古老遗迹的深处，危险与宝藏并存。" },
        snowfield_001: { id: "snowfield_001", name: "极寒雪原", description: "一片终年被冰雪覆盖的荒原，危机四伏，只有最勇敢的冒险者敢于挑战。" },
        cat_dungeon_001: { id: "cat_dungeon_001", name: "猫影深渊", description: "传说中猫族先祖封印的地牢，阴影与魔力交织，只有最强的冒险者敢于挑战。" },
        holy_cat_temple_001: { id: "holy_cat_temple_001", name: "神圣猫咪神殿", description: "传说中猫族信仰的圣地，光辉与神秘并存，只有最虔诚的冒险者才能踏足此地。" },
        shadow_paw_hideout: { id: "shadow_paw_hideout", name: "影爪巢穴", description: "传说中只有最敏捷、最隐秘的猫咪刺客才敢踏足的黑暗巢穴。这里聚集着猫族刺客高手，步步杀机，只有最机警的冒险猫才能全身而退。" },
        astralEmpressTrial: { id: "astralEmpressTrial", name: "星辉女帝试炼", description: "在星辉流转的神秘殿堂，猫族勇者们将接受女帝与其星辉守卫的考验。唯有心怀信仰与勇气，才能在星辰的见证下，获得女帝的认可与祝福。传说通过试炼者，将成为喵界真正的星辉之子。" },
        amusement_park: { id: "amusement_park", name: "游乐园", description: "一座欢乐的猫猫游乐园。旋转木马、糖果小丑、毛绒玩偶常见游乐设施这里都有哦！" }
    };

    // 自动准备设置
    let autoReadyEnabled = false;
    let autoReadyThreshold = 6;

    // 自动招募设置
    let autoRecruitEnabled = false;
    let autoRecruitInterval = 300; // 秒，代码中直接设置
    let autoRecruitMsg = ''; // 用户自定义招募模板
    let autoRecruitTimer = null;
    function startAutoRecruit(roomId) {
        stopAutoRecruit();
        if (!autoRecruitEnabled || !roomId) return;
        autoRecruitTimer = setInterval(() => {
            const info = window.currentRoomInfo;
            const memberIds = info?.memberIds || [];
            if (memberIds.length >= autoReadyThreshold) {
                stopAutoRecruit();
                logUtil.debug('人数已达阈值，自动停止招募');
                return;
            }
            if (window._moyuHelperWS && window._moyuHelperWS.readyState === 1 && userInfo) {
                // 只更新人数信息
                const currentMembers = memberIds.length;
                const maxMembers = info.maxMembers;
                const updatedMsg = autoRecruitMsg.replace(/\d+\/\d+人/, `${currentMembers}/${maxMembers}人`);
                const finalMsg = `[😸摸鱼放置助手-自动招募]${updatedMsg}`;
                const msg = `42["chat:createPublicChatMsg",{"user":${JSON.stringify(userInfo)},"data":{"content":${JSON.stringify(finalMsg)}}}]`;
                if (sendWithRateLimit(msg)) {
                    logUtil.debug('自动发送招募信息:', msg);
                }
            }
        }, autoRecruitInterval * 1000);
    }
    function stopAutoRecruit() {
        if (autoRecruitTimer) {
            clearInterval(autoRecruitTimer);
            autoRecruitTimer = null;
        }
    }

    // 自动停止战斗设置
    let autoStopBattleEnabled = false;

    // 自动踢人设置
    let autoKickUnreadyEnabled = false;
    let unreadyKickTimer = null;
    const UNREADY_KICK_INTERVAL = 30; // 检查间隔秒
    const UNREADY_KICK_TIMEOUT = 5 * 60 * 1000; // 5分钟
    let unreadyKickMap = {};

    function startUnreadyKick(roomId) {
        stopUnreadyKick();
        if (!autoKickUnreadyEnabled || !roomId) return;
        unreadyKickTimer = setInterval(() => {
            const info = window.currentRoomInfo;
            if (!info || !info.readyMap) return;
            const now = Date.now();
            (info.memberIds || []).forEach(uid => {
                if (uid === userInfo?.uuid) return; // 不踢自己
                const ready = info.readyMap[uid];
                if (ready) {
                    delete unreadyKickMap[uid];
                } else {
                    if (!unreadyKickMap[uid]) {
                        unreadyKickMap[uid] = now;
                    }
                    if (now - unreadyKickMap[uid] > UNREADY_KICK_TIMEOUT) {
                        // 踢出
                        const kickCmd = `42["battleRoom:kick",{"user":${JSON.stringify(userInfo)},"data":{"roomId":"${info.uuid}","targetUserId":"${uid}"}}]`;
                        if (sendWithRateLimit(kickCmd)) {
                            logUtil.debug('自动踢出未准备玩家:', uid);
                            delete unreadyKickMap[uid];
                        }
                    }
                }
            });
        }, UNREADY_KICK_INTERVAL * 1000);
    }
    function stopUnreadyKick() {
        if (unreadyKickTimer) {
            clearInterval(unreadyKickTimer);
            unreadyKickTimer = null;
        }
        unreadyKickMap = {};
    }

    // 新增：房间信息面板渲染
    function renderRoomPanel() {
        const info = window.currentRoomInfo;
        if (!info) {
            stopAutoRecruit();
            stopUnreadyKick();
            return `<div style='color:#888;text-align:center;'>暂无房间信息</div>`;
        }
        // 渲染成员准备情况，优先显示名称
        const memberIds = info.memberIds || [];
        let readyListHtml = '';
        let needAsync = false;
        memberIds.forEach(uid => {
            let name = uid;
            if (window.userProfileCache[uid]) {
                name = window.userProfileCache[uid].name;
            } else {
                needAsync = true;
                fetchUserProfile(uid, () => {
                    if (activeTab === 'room') renderContent();
                });
            }
            const ready = info.readyMap && info.readyMap[uid];
            readyListHtml += `<li>${name}：<span style='color:${ready ? '#0f0' : '#f00'};'>${ready ? '已准备' : '未准备'}</span></li>`;
        });
        // 匹配区域名称
        const areaName = MapInfos[info.area]?.name || info.area;

        // 自动生成招募信息
        if (!autoRecruitMsg) {
            const roomName = info.name || '房间';
            const currentMembers = memberIds.length;
            const maxMembers = info.maxMembers;
            autoRecruitMsg = `【房间名：${roomName}】${areaName} ${currentMembers}/${maxMembers}人 来人一起摸鱼~`;
        }

        // 检查是否需要自动准备
        if (autoReadyEnabled && memberIds.length >= autoReadyThreshold && !info.readyMap?.[userInfo.uuid]) {
            setTimeout(() => {
                const readyCmd = `42["battleRoom:updateReadyState",{"user":${JSON.stringify(userInfo)},"data":{"roomId":"${info.uuid}","ready":true}}]`;
                if (sendWithRateLimit(readyCmd)) {
                    logUtil.debug('自动发送准备指令:', readyCmd);
                }
            }, 1000);
        }

        // 检查自动招募
        if (autoRecruitEnabled) {
            startAutoRecruit(info.uuid);
        } else {
            stopAutoRecruit();
        }

        // 检查是否需要自动停止战斗
        if (autoStopBattleEnabled && memberIds.length < autoReadyThreshold) {
            setTimeout(() => {
                const stopCmd = `42["battle:stopBattle",{"user":${JSON.stringify(userInfo)},"data":{"roomId":"${info.uuid}"}}]`;
                if (sendWithRateLimit(stopCmd)) {
                    logUtil.debug('自动发送停止战斗指令:', stopCmd);
                }
            }, 1000);
        }

        // 检查自动踢人
        if (autoKickUnreadyEnabled) {
            startUnreadyKick(info.uuid);
        } else {
            stopUnreadyKick();
        }
        // <div>房间ID：${info.uuid}</div>
        return `
            <div style='font-weight:bold;font-size:16px;margin-bottom:8px;'>${info.name || '房间'}</div>

            <div>房主：${window.userProfileCache[info.ownerId]?.name || info.ownerId}</div>
            <div>成员：${memberIds.length} / ${info.maxMembers}</div>
            <div>状态：${info.status}</div>
            <div>类型：${info.type}</div>
            <div>区域：${areaName}</div>
            <div>轮次：${info.currentRepeat} / ${info.repeatCount}</div>
            <div>自动重开：${info.autoRestart ? '是' : '否'}</div>
            <div>创建时间：${new Date(info.createdAt).toLocaleString()}</div>
            <div style='margin-top:8px;font-weight:bold;'>成员准备情况：</div>
            <ul style='padding-left:18px;'>${readyListHtml}</ul>
            <div style='margin-top:12px;padding-top:8px;border-top:1px solid #333;'>
                <div style='font-weight:bold;margin-bottom:6px;'>自动准备设置：</div>
                <div style='display:flex;align-items:center;gap:8px;margin-bottom:4px;'>
                    <input type="checkbox" id="auto-ready-toggle" ${autoReadyEnabled ? 'checked' : ''} style="margin:0;" />
                    <label for="auto-ready-toggle" style="font-size:13px;">启用自动准备</label>
                </div>
                <div style='display:flex;align-items:center;gap:8px;margin-bottom:4px;'>
                    <input type="checkbox" id="auto-stop-battle-toggle" ${autoStopBattleEnabled ? 'checked' : ''} style="margin:0;" />
                    <label for="auto-stop-battle-toggle" style="font-size:13px;">人数不足时自动停止战斗</label>
                </div>
                <div style='display:flex;align-items:center;gap:8px;margin-bottom:4px;'>
                    <input type="checkbox" id="auto-kick-unready-toggle" ${autoKickUnreadyEnabled ? 'checked' : ''} style="margin:0;" />
                    <label for="auto-kick-unready-toggle" style="font-size:13px;">自动踢出5分钟未准备玩家</label>
                </div>
                <div style='display:flex;align-items:center;gap:8px;'>
                    <label style="font-size:13px;">人数阈值：</label>
                    <input type="number" id="auto-ready-threshold" value="${autoReadyThreshold}" min="2" max="6" style="width:60px;padding:2px 4px;border-radius:4px;border:1px solid #444;background:#222;color:#fff;font-size:12px;" />
                </div>
            </div>
            <div style='margin-top:12px;padding-top:8px;border-top:1px solid #333;'>
                <div style='font-weight:bold;margin-bottom:6px;'>自动招募设置：</div>
                <div style='display:flex;align-items:center;gap:8px;margin-bottom:4px;'>
                    <input type="checkbox" id="auto-recruit-toggle" ${autoRecruitEnabled ? 'checked' : ''} style="margin:0;" />
                    <label for="auto-recruit-toggle" style="font-size:13px;">启用自动招募</label>
                </div>
                <div style='display:flex;align-items:center;gap:8px;'>
                    <label style="font-size:13px;">招募模板：</label>
                    <input type="text" id="auto-recruit-msg" value="${autoRecruitMsg}" style="flex:1;padding:2px 8px;border-radius:4px;border:1px solid #444;background:#222;color:#fff;font-size:13px;" maxlength="100" placeholder="输入招募模板，人数用0/6人表示" />
                </div>
            </div>
        `;
    }

    // 组装面板
    panel.appendChild(titleBar);
    panel.appendChild(tabBar);
    panel.appendChild(content);
    // panel.appendChild(wsSendBar);
    document.body.appendChild(panel);

    // 初始化
    setActiveTab('combat');

    // 你可以在此处挂载实际的统计数据渲染逻辑
    // 例如：动态填充dpsTableBody、battleLog、inventoryTableBody等

    // 判断压缩格式
    function detectCompression(buf) {
        const b = new Uint8Array(buf);
        if (b.length >= 2) {
            if (b[0] === 0x1f && b[1] === 0x8b) return 'gzip';
            if (b[0] === 0x78 && (((b[0] << 8) | b[1]) % 31) === 0) return 'zlib';
        }
        return 'deflate';
    }

    // 记录当前WebSocket实例
    window._moyuHelperWS = null;

    // WebSocket 拦截与解压
    const NativeWS = window.WebSocket;
    window.WebSocket = function (url, protocols) {
        const ws = protocols ? new NativeWS(url, protocols) : new NativeWS(url);
        window._moyuHelperWS = ws;

        const originalSend = ws.send;
        ws.send = function (data) {
            logUtil.debug('[WS 发送]', data);
            return originalSend.call(this, data);
        };
        let messageID = 0;
        let lastCmd = null;
        ws.addEventListener('message', ev => {
            messageID++;
            let obj = null;
            let text = null;
            if (ev.data instanceof ArrayBuffer) {
                const format = detectCompression(ev.data);
                switch (format) {
                    case 'gzip':
                        text = pako.ungzip(new Uint8Array(ev.data), { to: 'string' });
                        break;
                    case 'zlib':
                        text = pako.inflate(new Uint8Array(ev.data), { to: 'string' });
                        break;
                    default:
                        text = pako.inflateRaw(new Uint8Array(ev.data), { to: 'string' });
                }
                obj = JSON.parse(text);
            } else {
                text = ev.data
                if (typeof text === 'string' && /^\d+-/.test(text)) {
                    const idx = text.indexOf('-');
                    if (idx !== -1) {
                        try {
                            const arr = JSON.parse(text.slice(idx + 1));
                            if (Array.isArray(arr) && typeof arr[0] === 'string') {
                                lastCmd = arr[0];
                            }
                        } catch (e) {
                            lastCmd = null;
                            logUtil.info(e);
                        }
                    }
                    return;
                }
                logUtil.debug(`[WS 未处理数据]`, text);
            }
            // 根据 lastCmd 分发处理
            if (obj && lastCmd) {
                if (userInfo == null && obj.user) {
                    userInfo = obj.user;
                }
                if (lastCmd.startsWith('inventory:increase:success')) {
                    updateInventory(obj.data);
                } else if (lastCmd.startsWith('battle:fullInfo:success')) {
                    // battle:fullInfo:success、battle:round:success等
                    obj = obj.data
                    if (obj && obj.battleInfo && obj.thisRoundAction) {
                        const battle = obj.battleInfo;
                        const action = obj.thisRoundAction;
                        const members = battle.members || [];
                        const playerUuids = (battle.groups?.player) || [];
                        const memberMap = Object.fromEntries(
                            members.map(m => [m.uuid, m])
                        );
                        const srcUuid = action.sourceUnitUuid;
                        const dmgObj = action.damage || {};           // { uuid: amount, … }
                        const healObj = action.heal || {};            // { uuid: amount, … }
                        const skill = action.castSkillId || '未知技能';
                        const targets = action.targetUnitUuidList || [];
                        // 只统计玩家组
                        if (playerUuids.includes(srcUuid)) {
                            let hasAction = false;
                            for (const [tUuid, amt] of Object.entries(dmgObj)) {
                                damageAccum.set(srcUuid, (damageAccum.get(srcUuid) || 0) + amt);
                                hasAction = true;
                            }
                            for (const [tUuid, amt] of Object.entries(healObj)) {
                                healAccum.set(srcUuid, (healAccum.get(srcUuid) || 0) + amt);
                                hasAction = true;
                            }
                            if (hasAction) {
                                actionCount.set(srcUuid, (actionCount.get(srcUuid) || 0) + 1);
                            }
                            window.playerUuids = playerUuids;
                            window.memberMap = memberMap;
                            updateDpsPanel(playerUuids, memberMap);
                        }
                        // 战斗日志输出
                        let logLines = [];
                        if (playerUuids.includes(srcUuid) || targets.some(t => playerUuids.includes(t))) {
                            const srcName = memberMap[srcUuid]?.name || srcUuid;
                            for (const tUuid of targets) {
                                const tName = memberMap[tUuid]?.name || tUuid;
                                const dmg = dmgObj[tUuid] || 0;
                                const heal = healObj[tUuid] || 0;
                                const skillName = skillNames[skill] || skill;
                                if (dmg > 0) logLines.push(`🗡️ <b>${srcName}</b> 用 <b>${skillName}</b> 对 <b>${tName}</b> 造成 <span style='color:#ff7675;'>${dmg}</span> 伤害`);
                                if (heal > 0) logLines.push(`💚 <b>${srcName}</b> 用 <b>${skillName}</b> 治疗 <b>${tName}</b> <span style='color:#00e676;'>${heal}</span> 生命`);
                            }
                        }
                        if (logLines.length) addBattleLog(logLines);
                    }
                } else if (lastCmd.startsWith('battleRoom:update') || lastCmd.startsWith('battleRoom:create:success')) {
                    const roomInfo = obj.data;
                    window.currentRoomInfo = roomInfo;
                    if (activeTab === 'room') renderContent();
                } else if (lastCmd.startsWith('battleRoom:leave:success')) {
                    window.currentRoomInfo = null;
                    if (activeTab === 'room') renderContent();
                }else if (lastCmd.startsWith('taskUpdated')) {
                    
                }
                else {
                    logUtil.debug(`[WS 未处理指令]`, lastCmd);
                    logUtil.debug(`[WS 未处理对象]`, obj);
                   
                }
                // 其他指令可在此扩展
                lastCmd = null;
            } else {
                // 没有指令时，打印日志

            }
        });

        return ws;
    };

    window.WebSocket.prototype = NativeWS.prototype;
    Object.getOwnPropertyNames(NativeWS).forEach(prop => {
        if (!(prop in window.WebSocket)) {
            window.WebSocket[prop] = NativeWS[prop];
        }
    });

    logUtil.info('✅ MoYuIdleHelper 已启动');


    // 新增：DPS面板渲染函数
    function updateDpsPanel(playerUuids, memberMap) {
        const tbody = document.querySelector('#dpsTableBody');
        if (!tbody) return;
        if (!playerUuids || !memberMap || playerUuids.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#888;">暂无数据</td></tr>`;
            return;
        }
        // 收集玩家数据
        const rows = playerUuids.map(uuid => {
            const total = damageAccum.get(uuid) || 0;
            const heal = healAccum.get(uuid) || 0;
            const cnt = actionCount.get(uuid) || 1;
            const name = memberMap[uuid]?.name || uuid;
            const dps = Math.round(total / cnt); // 输出效率
            const hps = Math.round(heal / cnt);  // 治疗效率
            return { name, dps, hps, total, heal };
        });
        // 按输出效率降序
        rows.sort((a, b) => b.dps - a.dps);
        tbody.innerHTML = rows.map(r => `<tr><td>${r.name}</td><td style='text-align:right;'>${r.dps}</td><td style='text-align:right;'>${r.hps}</td><td style='text-align:right;'>${r.total}</td><td style='text-align:right;'>${r.heal}</td></tr>`).join('');
    }

    // 新增：战斗日志管理
    const logList = [];
    // 日志自动滚动控制
    let logAutoScroll = true;

    // 日志面板增加滚动条美化和事件监听
    const logPanelCss = document.createElement('style');
    logPanelCss.innerHTML = `
    #logPanel::-webkit-scrollbar {
      width: 8px;
      background: transparent;
    }
    #logPanel::-webkit-scrollbar-thumb {
      background: linear-gradient(120deg, #444 30%, #888 100%);
      border-radius: 6px;
    }
    #logPanel:hover::-webkit-scrollbar-thumb {
      background: linear-gradient(120deg, #666 30%, #aaa 100%);
    }
    #logPanel {
      scrollbar-width: thin;
      scrollbar-color: #888 #222;
    }
    `;
    document.head.appendChild(logPanelCss);

    setTimeout(() => {
        const logPanel = document.getElementById('battleLog');
        if (logPanel) {
            logPanel.addEventListener('scroll', function () {
                // 判断是否在底部
                const atBottom = logPanel.scrollTop + logPanel.clientHeight >= logPanel.scrollHeight - 2;
                logAutoScroll = atBottom;
            });
            logPanel.addEventListener('mouseenter', () => { logAutoScroll = false; });
            logPanel.addEventListener('mouseleave', () => {
                // 如果离开时已在底部，则恢复自动滚动
                const atBottom = logPanel.scrollTop + logPanel.clientHeight >= logPanel.scrollHeight - 2;
                logAutoScroll = atBottom;
            });
        }
    }, 500);

    function addBattleLog(lines) {
        // 始终记录到logList
        for (const line of lines) {
            logList.push(line);
        }
        // 限制日志条数
        while (logList.length > 200) logList.shift();
        // 如果面板已打开，刷新显示
        const ul = document.getElementById('battleLog');
        if (ul) {
            ul.innerHTML = logList.map(l => `<li style='margin-bottom:2px;'>${l}</li>`).join('');
            // 自动滚动到底部（仅在自动滚动开启时）
            const logPanel = document.getElementById('battleLog');
            if (logPanel && logAutoScroll) {
                logPanel.scrollTop = logPanel.scrollHeight;
            }
        }
    }

    // 更新物品变动统计
    function updateInventory(newInventory) {
        for (const [itemId, itemData] of Object.entries(newInventory)) {
            const oldCount = inventory[itemId] || 0;
            const newCount = itemData.count;
            inventory[itemId] = oldCount + newCount;
        }
        if (saveInventoryEnabled) {
            saveInventoryData();
        }
        updateInventoryPanel();
    }

    // 更新物品变动面板
    function updateInventoryPanel() {
        const tbody = document.querySelector('#inventoryTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        const sortedItems = Object.entries(inventory)
            .filter(([itemId, total]) => total > 0)
            .sort((a, b) => b[1] - a[1]);
        for (const [itemId, total] of sortedItems) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${itemIdNameMap[itemId] || itemId}</td>
                <td style="text-align:right;">${total}</td>
            `;
            tbody.appendChild(row);
        }
    }

    // 保存物品数据到本地存储
    function saveInventoryData() {
        if (saveInventoryEnabled) {
            const data = {
                inventory: inventory,
                saveInventoryEnabled: saveInventoryEnabled,
                timestamp: Date.now()
            };
            let allData = {};
            try {
                allData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || {};
            } catch (e) { allData = {}; }
            allData[INVENTORY_STORAGE_NAME] = data;
            localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(allData));
        }
    }

    // 从本地存储加载物品数据
    function loadInventoryData() {
        try {
            const allData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || {};
            const saved = allData[INVENTORY_STORAGE_NAME];
            if (saved) {
                const data = saved;
                if (data.inventory) {
                    inventory = data.inventory;
                    logUtil.debug('已加载保存的物品数据');
                }
                if (typeof data.saveInventoryEnabled === 'boolean') {
                    saveInventoryEnabled = data.saveInventoryEnabled;
                    logUtil.debug('已加载保存选项状态:', saveInventoryEnabled);
                }
            }
        } catch (e) {
            logUtil.debug('加载物品数据失败:', e);
        }
    }

    // 初始化时加载数据
    loadInventoryData();
    loadPanelSettings();
})();