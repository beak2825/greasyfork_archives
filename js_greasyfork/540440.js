// ==UserScript==
// @name         MWITools - Extended
// @namespace    http://tampermonkey.net/
// @version      23.3.9.3
// @description  Extention for MWITools.
// @author       DrDucky
// @license      CC-BY-NC-SA-4.0
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://amvoidguy.github.io/MWICombatSimulatorTest/*
// @match        https://shykai.github.io/mwisim.github.io/*
// @match        https://shykai.github.io/MWICombatSimulatorTest/dist/*
// @match        https://mooneycalc.netlify.app/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      raw.githubusercontent.com
// @connect      ghproxy.net
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.2/math.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0/dist/chartjs-plugin-datalabels.min.js
// @downloadURL https://update.greasyfork.org/scripts/540440/MWITools%20-%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/540440/MWITools%20-%20Extended.meta.js
// ==/UserScript==

/*
    Steam客户端玩家还需要额外安装兼容插件。

    MilkyWayIdle Steam game client players should also install this script:
    https://raw.githubusercontent.com/YangLeda/Userscripts-For-MilkyWayIdle/refs/heads/main/MWITools%20addon%20for%20Steam%20version.js
*/


(() => {
    "use strict";


    const THOUSAND_SEPERATOR = new Intl.NumberFormat().format(1111).replaceAll("1", "").at(0) || "";
    const DECIMAL_SEPERATOR = new Intl.NumberFormat().format(1.1).replaceAll("1", "").at(0);
    let marketJson = localStorage.getItem("MWITools_marketAPI_json"); // 市场数据
    const isZHInGameSetting = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh"); // 获取游戏内设置语言
    let isZH = isZHInGameSetting; // MWITools 本身显示的语言默认由游戏内设置语言决定
    let loggerLog = [];
    let globalActionName = "";

    let isAskPriceActive = false;
    let SCRIPT_COLOR_MAIN = "green"; // 脚本主要字体颜色
    let SCRIPT_COLOR_TOOLTIP = "darkgreen"; // 物品悬浮窗的字体颜色
    const SCRIPT_COLOR_ALERT = "red"; // 警告字体颜色

    const EXTENDED_SCRIPT_COLORS = {
        brightGreen: "#6F0",
        darkGreen: "#0A0",
        brightRed: "#F44",
        darkRed: "#A00",
        orange: "#FA0",
        yellow: "#FF0",
        brightBlue: "#09F",
        deepBlue: "#00A",
        purple: "#90F",
        pink: "#F0C",
        white: "#FFF",
        lightGray: "#CCC",
        gray: "#888",
        darkGray: "#444",
        black: "#000",
        cyan: "#0FF",
        teal: "#088",
        lime: "#AF0",
        gold: "#FC0"
    };


    window.addEventListener("error", function (e) {
        logger(`❌ Caught global script error: ${e.message} "at" ${e.filename}: ${+ e.lineno}`, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
    });

    window.addEventListener("unhandledrejection", function (e) {
        logger(`❌ Unhandled Promise rejection: ${e.reason}`, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
    });

    const MARKET_API_URL = "https://www.milkywayidle.com/game_data/marketplace.json";
    let liveCreateInterval = null;

    let settingsMap = {
        forceMWIToolsDisplayZH: {
            id: "forceMWIToolsDisplayZH",
            desc: isZH ? "MWITools本身强制显示中文 MWITools always in Chinese" : "MWITools本身强制显示中文 MWITools always in Chinese",
            isTrue: false,
        },
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
        timeFormatShortLong: {
            id: "timeFormatShortLong",
            desc: isZH ? "时间格式：短（天数、小时、分钟 - 倒计时）或长（日期、时间 - 总天数" : "Time format: short (days hours minutes - countdown like) or Long (date, time - total days)",
            isTrue: true,
            value: true,
            type: "select",
            options: [
                { value: false, label: isZH ? "短的" : "Short" },
                { value: true, label: isZH ? "长的" : "Long" }
            ],
            extended: true
        },
        includeCurrentTime: {
            id: "includeCurrentTime",
            desc: isZH ? "以简短时间格式显示当前完成时间" : "Show current finish hour in short time format",
            isTrue: false,
            extended: true
        },
        showExpDisplay: {
            id: "showExpDisplay",
            desc: isZH ? "时间格式：未勾选为简洁（天 小时 分钟 - 倒计时样式显示），已勾选为完整（日期、时间 - 总天数" : `Show how much Exp is left for level up`,
            isTrue: true,
            extended: true
        },
        graphicStyle: {
            id: "graphicStyle",
            desc: isZH ? "库存排序和统计样式" : "Inventory sorting and stats style",
            isTrue: true,
            value: true,
            type: "select",
            options: [
                { value: true, label: isZH ? "新的" : "New" },
                { value: false, label: isZH ? "老的" : "Old" }
            ],
            extended: true
        },
        actionPanelStyle: {
            id: "actionPanelStyle",
            desc: isZH ? "库存排序和统计样式" : "Action panel interaction style",
            isTrue: true,
            value: true,
            type: "select",
            options: [
                { value: true, label: isZH ? "下拉菜单" : "Dropdown" },
                { value: false, label: isZH ? "按钮" : "Button" }
            ],
            extended: true
        },
        keybindInput: {
            id: "keybindInput",
            desc: isZH ? "重置操作工具覆盖位置的组合键" : "Key combination to reset the action tools overlay position",
            isTrue: true,
            value: '',
            type: "text",
            placeholder: 'Enter your keybind (e.g. F1)',
            skip: false,
            extended: true,
            keyinput: true
        },
        testNumber:{
            id: "testNumber",
            desc: isZH ? "库存排序和统计样式" : "Action panel interaction style",
            isTrue: true,
            value: 3,
            type: "number",
            min: 1,
            max: 10,
            placeholder: 'Number of retries',
            skip: true,
            extended: true
        },
    };

    readSettings();

    // ========== KEYBINDS ========== //
    document.addEventListener("keydown", (e) => {
        const stored = localStorage.getItem("keybind") || "CTRL + F2";

        // Normalize and parse
        const parts = stored.toUpperCase().replace(/\s+/g, "").split("+");
        const keybind = {
            ctrl: parts.includes("CTRL"),
            alt: parts.includes("ALT"),
            shift: parts.includes("SHIFT"),
            meta: parts.includes("META"), // ⌘ on Mac
            code: parts.find(p => !["CTRL", "ALT", "SHIFT", "META"].includes(p))
        };

        // Check match
        if (
            e.code.toUpperCase() === keybind.code &&
            e.ctrlKey === keybind.ctrl &&
            e.altKey === keybind.alt &&
            e.shiftKey === keybind.shift &&
            e.metaKey === keybind.meta
        ) {
            localStorage.setItem("actionToolsOverlayPos", `50%,50%`);
            const actionToolsOverlay = document.querySelector("#actionToolsOverlay");
            if (actionToolsOverlay) {
                actionToolsOverlay.style.top = "50%";
                actionToolsOverlay.style.left = "50%";
             }
        }
    });

    var lzString;
    if (typeof LZString !== 'undefined') {
        lzString = LZString;
    } else {
        lzString=function(){var r=String.fromCharCode,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",e={};function c(r,o){if(!e[r]){e[r]={};for(var n=0;n<r.length;n++)e[r][r.charAt(n)]=n}return e[r][o]}var t={compressToBase64:function(r){if(null==r)return"";var n=t._compress(r,6,function(r){return o.charAt(r)});switch(n.length%4){default:case 0:return n;case 1:return n+"===";case 2:return n+"==";case 3:return n+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:t._decompress(r.length,32,function(n){return c(o,r.charAt(n))})},compressToUTF16:function(o){return null==o?"":t._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(r){return null==r?"":""==r?null:t._decompress(r.length,16384,function(o){return r.charCodeAt(o)-32})},compressToUint8Array:function(r){for(var o=t.compress(r),n=new Uint8Array(2*o.length),e=0,c=o.length;e<c;e++){var s=o.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null==o)return t.decompress(o);for(var n=new Array(o.length/2),e=0,c=n.length;e<c;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),t.decompress(s.join(""))},compressToEncodedURIComponent:function(r){return null==r?"":t._compress(r,6,function(r){return n.charAt(r)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),t._decompress(r.length,32,function(o){return c(n,r.charAt(o))}))},compress:function(o){return t._compress(o,16,function(o){return r(o)})},_compress:function(r,o,n){if(null==r)return"";var e,c,t,s={},u={},a="",i="",p="",l=2,f=3,h=2,d=[],m=0,v=0;for(t=0;t<r.length;t+=1)if(a=r.charAt(t),Object.prototype.hasOwnProperty.call(s,a)||(s[a]=f++,u[a]=!0),i=p+a,Object.prototype.hasOwnProperty.call(s,i))p=i;else{if(Object.prototype.hasOwnProperty.call(u,p)){if(p.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(c=p.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&c,v==o-1?(v=0,d.push(n(m)),m=0):v++,c>>=1}else{for(c=1,e=0;e<h;e++)m=m<<1|c,v==o-1?(v=0,d.push(n(m)),m=0):v++,c=0;for(c=p.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&c,v==o-1?(v=0,d.push(n(m)),m=0):v++,c>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[p]}else for(c=s[p],e=0;e<h;e++)m=m<<1|1&c,v==o-1?(v=0,d.push(n(m)),m=0):v++,c>>=1;0==--l&&(l=Math.pow(2,h),h++),s[i]=f++,p=String(a)}if(""!==p){if(Object.prototype.hasOwnProperty.call(u,p)){if(p.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(c=p.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&c,v==o-1?(v=0,d.push(n(m)),m=0):v++,c>>=1}else{for(c=1,e=0;e<h;e++)m=m<<1|c,v==o-1?(v=0,d.push(n(m)),m=0):v++,c=0;for(c=p.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&c,v==o-1?(v=0,d.push(n(m)),m=0):v++,c>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[p]}else for(c=s[p],e=0;e<h;e++)m=m<<1|1&c,v==o-1?(v=0,d.push(n(m)),m=0):v++,c>>=1;0==--l&&(l=Math.pow(2,h),h++)}for(c=2,e=0;e<h;e++)m=m<<1|1&c,v==o-1?(v=0,d.push(n(m)),m=0):v++,c>>=1;for(;;){if(m<<=1,v==o-1){d.push(n(m));break}v++}return d.join("")},decompress:function(r){return null==r?"":""==r?null:t._decompress(r.length,32768,function(o){return r.charCodeAt(o)})},_decompress:function(o,n,e){var c,t,s,u,a,i,p,l=[],f=4,h=4,d=3,m="",v=[],g={val:e(0),position:n,index:1};for(c=0;c<3;c+=1)l[c]=c;for(s=0,a=Math.pow(2,2),i=1;i!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*i,i<<=1;switch(s){case 0:for(s=0,a=Math.pow(2,8),i=1;i!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*i,i<<=1;p=r(s);break;case 1:for(s=0,a=Math.pow(2,16),i=1;i!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*i,i<<=1;p=r(s);break;case 2:return""}for(l[3]=p,t=p,v.push(p);;){if(g.index>o)return"";for(s=0,a=Math.pow(2,d),i=1;i!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*i,i<<=1;switch(p=s){case 0:for(s=0,a=Math.pow(2,8),i=1;i!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*i,i<<=1;l[h++]=r(s),p=h-1,f--;break;case 1:for(s=0,a=Math.pow(2,16),i=1;i!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*i,i<<=1;l[h++]=r(s),p=h-1,f--;break;case 2:return v.join("")}if(0==f&&(f=Math.pow(2,d),d++),l[p])m=l[p];else{if(p!==h)return null;m=t+t.charAt(0)}v.push(m),l[h++]=t+m.charAt(0),t=m,0==--f&&(f=Math.pow(2,d),d++)}}};return t}();
    }
    window.LZString = lzString;
    const decompressString = (text) => lzString.decompressFromUTF16(text);

    // Handle graphic style changes with proper value checking
    function handleGraphicStyleChange(currentStyle) {

        if (currentStyle === "New" || currentStyle === "新的" || currentStyle === true) {
            // Remove old elements
            document.querySelector("div#oldTotalNet")?.remove();
            document.querySelectorAll("div#from-og").forEach(el => el.remove());
            document.querySelectorAll("div.from-custom").forEach(el => el.remove());
            document.querySelector("div#oldSort")?.remove();
            document.querySelector("div#oldShow")?.remove();

            // Remove old classes
            document.querySelector("div.Inventory_items__6SXv0")?.classList.remove(
                "script_buildScore_added",
                "script_invSort_added"
            );

            // Apply new style
            calculateNetworth();
        } else {
            // Remove new elements
            document.querySelectorAll("div#from-og")?.forEach(el => el.remove());
            document.querySelectorAll("div.from-custom")?.forEach(el => el.remove());
            document.querySelector("div#main-sort-div")?.remove();
            document.querySelector("div#main-net-div")?.remove();

            // Remove classes
            document.querySelector("div.Inventory_items__6SXv0")?.classList.remove(
                "script_buildScore_added",
                "script_invSort_added"
            );

            // Apply old style
            calculateNetworthOld();
        }
    }

    // Helper functions for common reactive behaviors
    function updateThemeColors(color) {
        document.documentElement.style.setProperty('--mwitools-accent', color);
        document.documentElement.style.setProperty('--mwitools-glow', color + '40'); // Add alpha
    }

    function updateNotificationVolume(volume) {
        // Update any audio elements or notification systems
        logger(`[Audio] Volume set to: ${volume}%`, EXTENDED_SCRIPT_COLORS.brightGreen);
    }


    // Auto-save to localStorage
    function saveSettingsToStorage() {
        const settings = {};

        for (const [key, setting] of Object.entries(settingsMap)) {
            const type = setting.type || 'checkbox';
            if (type === 'checkbox') {
                settings[key] = setting.isTrue;
            } else {
                settings[key] = setting.value;
            }
        }

        localStorage.setItem('mwitools_settings', JSON.stringify(settings));
    }

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

    const COMPRESSED_DATA = "H4sIAMVadWgC/5V9WW8bSbLuXznop3OAAeac1/N2gfswT/e+z8UBUSRLUrWLLHaRtFo9GMCyLGu1ZMuyZVmbZcmLJFuWJbVN7X9GVUX+i5uZkftWHICAu1Vf5BIZkZFLZMQ/fvn736JO2Pg/QSNs//Lf/+8fv/wV/2/7r7Ukav7y378MZl5kvclf/sL+3AnaDyqd5EGIP95fXWXzu/dXewqkNhY1wjSqBTEHZh9msosrHdiOmlG7E6YcNnhznu8d67CwWRsLmp2wznHFpzf52Ssd14rSoBNyUP7nz2JjzWhcMl4N4xgXMrcxeDklvlSD0UoyUvmv/6xQTJuD+u8X/u3f/+s/73uH/yFV101bcdiujEYjHdzFk+Xi/Ajhi7dPiv3rYu5A6mgjiONKI+yESYr+UqkFtbEQaAbrn4uds/7sd4FuhPWo27DA73tfLfA4SEdDW+H7nyxoaEqQdqJ20GxXaphl0JLs54ds8V22uGe0xECjhljQ0BCz6P1PFjC0o5OGQbubokaPhW3Kxex4qzg22WFAcSM0KLTALBS1QENKMspRREZ1IJdRBgMZ1WFCRhkOZFTHURllIJBRHVSNu2HlQThRGUmD0UbYxMj+y63+3OlgBTFyvXi/VMzNCPxoGoZNnaC4unMSgOgaFOdHTorxMSxaOsH6jZMgSYPmqEGRH6w7KappMm70It975SRod5Km2aads2z/3E5QD9IHOn5w9SJ/u+ZoUTdtRs1Ro4qZqWLqk51EkisETicwLZctIHELoQIGodBJuDjKpYNIOqFy2bL06gRChuXCQY7dWLl0WeZ1Cir5ctEg/Q6gXK6sJjq8njS7ZFRWN9Ev25xV9agapqg+BsJatPTSCg1qD1Qskgw7tt1Jg3Gt3GdzdmwjSVRk9nLbgQzStgotJo/yNzuONrSCmta3bP+wOLi0w2vdVi14gGfj4rKXb33rbywUZ69snKIwYJQJ41yiOGCSjpM4xMojDNJxnDsUBcwxUJwzrA+MMUa9giusRMYUHTrabTSwaPVvvhVnr8XfgxaeGfnXhYt8e1PH0LmNgdCkln19roNaMTJaHLK1ZIOEyFQLzO6UBVNH807SRNNPN+pwKGLA4Hbd0rJ2J0g1bL71GZWsAyeS0W5KpHy6l334ofeffwYG6CDKAI4CDugowgGBISwwMIQFAkR4oIMUHnAsZ4IOl5gg1Y65oCMbUfwAT/CdMMCYxX30tb8oAUZQT0cFYjAzk794oyDGk6Re63Y6AnR//Tzf/KyAakki1VNMXQw+HCqAahqOC0D29DQ/21UAQYzmw8YEK+HxNVqXK4CwiebjmlTG9WW2+FptxVgYtsN2I+qMSbgPPwbTh4PVq8Gjdyo6DUakXmWzP+5vNhVEJ4hitOQU/breKi6PFEi720IGSGVz/8d0cfnJwmwAaywHtIXxgDbZDwSWQQACdSgAbBkQAKvDAmDL4ABYHSJasjlQANaHi5ZtDhpttW3oKI1rACmlOoyUxhxMQOtDSnthDmw3RlO8NrDFwY98e9IysADWBhbQloEFtDmwQGAZWCDQdIyALQMLYHVgAWwZWABrugclmwMLYH1gadnmwNJW2waW0rgGllKqA0tpzIEFtKGr0AtzYEeDzliYKlPeYOOpCkm6KdpuspJulwZ7O+qcGLXrSYN9v1oeHC4q31tpUgvbbWlymX+HtojqfDYyEtUitMxkfM9fzRZLM+qkCFtNVgjZZKpzWNAJ4olOVGOQx1/0YaiiLXwbHy1AYz8u5yerqmJ0gkbUxPI1MhKSpcyj59n8RrbyOnu1K2ARWgzHcTSKWhwKbL5+acHWw5Gw2ZZggzen2e2uDgs6HbTckgpbvcpmrnRUKxkn0xoFoeoGM8s6iNjrutSHu83i84KOaiD9rEmt+rqKV/MaCCYKkytkprDzBkjsHKLWwMonoDO4RU2ClWd0KtY4Ryux8g8oNC7SadLKSyAwOAr9t/KVWkGVu7QXVh6Dzho8BqW18xhI7DymE7OVx0Bn8JjOzlYe01lR4zGtxMpjoNB4TGcsK4+BQOcx7b+Vx9QgqTymvbDymE5SAkvmKR0Vd2sPJiTtuuj1754b4zsejXSaaB6RFWw6f/ZTB+I9czOM8cQniny+k61+N5Bp1IGDAa79b8+t2g87onfn/amn9xcL2eylNCc1WkFMNPkR6ttn/XOr26x1uimlL1ZPDUDYDBFXiZVBW7oIdnLn37K7KR3axqd9tTFc1OxhdvM9fy0df9biMHhI+jr7tL/3WPnWCKIGLnX3UTY7pVKlEdqLkLrjoI2L7s+c58cLCqjdQEJIzNSz4v2tPCRh2IK/53NH8mzebZIznWqcjMP3weq+tOBPA8wTjMDcq5GNxvsl1Gq0PED8l0oai8K4XqlC04qNW+Xrb90IKUd7LCE787ujwaOd7OSJAgl+6yItSlPSjvzPyfzkvDj+KjUlDhohBxRTs8WTEwWQBlETn1gTCDmsPv462PgsnwDFIaxFaEPy07nB1Rs0dko5bWT76hMMU3w+y47f6o1the0OLq3DYa+PirVpEyZJDACRvBQHdzpwPOgQK0KFCrqvszhCk1gb7RBTsic6ybcP881v8lglbdSebjoaAmCwuVkQCZPFC02g7RYeUFwNmgbQFPj6Z342J2+dOmiiIYpSXL8rrqRTgk7yO5pPWkkcwzXG3Kf820pxOpedvBGgZoC1qF15GEYxkdLD4smP/vJidiGVFEcjYaWOh4ycVe1kL26y571sWdqTj0RpWA3gbmLyqHg+pctCFekB4f3T1ez0QO8qJm93krRB6Z+cDPaW0KwhKwuaLSrVbgqlTO2gIorJr0hd5S1xM0krY2EQE33dwkZt5jB/Mquwnn63fAHBD6I6l/v89Kp4vaaA0vDX7sOwCfcDxe3+/c1LC6oTdMl5a/bmtH98oywfH8K0ly++6O9Oy8PVHR3DEzGm2no72PkkjXLcbUeoUvg6WDscTN7JZYa1qB0lZHROb4vdY2mJGKbtMMWzTLHwWGFoGIf4TBhN0wFarjajDjm+nZ4qzt9l77ezi2lZWMPmHxNQBmKKfGaFVAApC1xKZSev0byK7G4+vy8vdGtBM6yk4Ugc1jrQyuzDB8StbPkZUi2BfBg0WlEatRvEsvTQtCpz/WEE0/D+s/xc1rMmWkVD44vX31AD5U8PIzSFVIl25Gvv8leLssSFKVLRoJuStfPcQfH8aTY9Vyx902c5QFAt1xDtifghWsRTDGiPjqFzIa2ICLdRTCtEawUKwdPt5Ucdwo0qaw+YVA01mlQTvPaqonEnZ5Ifst5Uvr02eHWXzb3Qcdg0qbhs+iybfaTjGgauWLgu5tbzvRVNFpBN6cbjARE4Kg7IuG1Ixg0to8LxJB6RakeF3V9eGlWnEZZLqcBi4XhwcaQXCE0cS5KO1pXri+z6pSFdtUqV2CQQMAVRQ5ML7gF8X1nJH5FlhwwhlVWTpIEsCrHdgiOTR/neM/3ASmYHbIm11j8M03qALJPUyzs0jd/puOAPfCkoUP3Vt/2XWzoKTY9I2iVY/vN7cW6wDMlSo50orL3aKC7f6zg84yNuyJ24OeivX+i4sSSekAv7sJ1t7hkDnyT1sEm5m29+VvhajdLaGPu2+1H/XAvrQUo/DzYO861b5TNcCaJ5Pe1QEOo0WuipQxc1H4wmrJCXP/KtZeV7GtZxE1kBl+/zrTkFQCcy+v3DdvHpjfIdqV2MFl34rpEZ/mLnbLCyg5QPmX9ZsvGMhU1itz4akgmxP/89O11DhjHb/6Ro1QhazyXdtigRzeKPVvQS03AUzQzt8SQlpuv5RrG0gEVXVnm0fk/waQKajoipz3/+zE8X+3fb+fZPqRNJN66MIdtFjt+Sdpt2d/LPwdfHxeJSPocUQl7Ddpt1OHKR0Mi0FweXRHcOjCVPB5kbvuRBi5p867U8ZY+EaRP1pYq2aHHIwMXj62Lhuw7+FS2fgzhphbzQwcVd/9NKNr2K6lagfDmOFm11ejv7Yye/PrzvzWXLc/nsjnyqgvRbxRZXN/nqrRUb/KFBH9+gCd4CpRMCHyQyHSgjxOYCBoGZQIHANMAAMAkoADoDMATovyoHVPl5LUT1FQjTe95WovUKhKg8L4IovCZt0Fu2AobJTxNb3mEm3DD1aSjaZ4qhE5+GYd2mIDrtaSDec1YdTHq6LrHOs6bDlKehoP+sIJjw9OqABWiTFwoOrMzhG35518aYQHGUByYO2EBRlAsmijKCwigfTBhjBasUOGHiGDNYJ4AXJo6wgxUG3DBB1AJIEwWZ5w90MyADqC040G2BhGEG4cBuEORZjFqFA8MqyMVR03Bgmga5KGofDgz7IIOokTgweMC2kDBt4S7O/kDLS32GA35oYMISCxgYo4KBNxawzCGVBJhkIaGs0iog3LKgGc+0wgnbLHDKPA1N+GdBUy7C5lVjIyzC7ZzUCQgr7QTATY0A2GknkDmqkQFL7WSUq3pFhK12CsZZvRLCWjsJ5a5OQdhrp6Acxvtyjb94oWtlroolrLVgga8KFrhqwcosVSiAoRYKyk21eMJLC5gxUi2asNGCpjxUwYSDFnA4QWSZHCrmS4v3vfli40X284O0cGoGaOs8EqDFQz2CJf3GDNpTFTtf1UUB2dlX4MQOoz497X+aM3dA5BS8ru36yBF4/9G0vgtSK4at0ODLtV73g2Y0OtZpV4JwNCIHD4cvsr0jpW7sr0gO1mjz8ncv0F5OgTQQIKolmG28E1tLaDOnFpSgTXIyQk5v6IEXOVVBK7n7i48mrjMWVugRRpsfXOhgMgQjaEWbhnFUwxV//ZjPrgwm1xQX12qE9o8tfAJeD38n3plX+at1fOA23bPs6GoP4lAsarLNp44dHcPRdZyGYzs6hqKLOQ3Fd3QMRld0Gkzs6HilsKzTcGJHxzsBazsNR3d0vDBY4GkgOkeIsUcKr7SdTAviM0wJSrPJZMARdCKQEfIUwHFU/RUdAMUXRYHSK32n6i6KAVVXBgWUXEBAwWWIcE0MWiH3SsxfrxXfflrdI3/rRg+pvGDfyOL4a//9gtUbMU6CB9wTMZ8/GuwtKc2v1LpIN4J0ojIWdKAD/bnTbOlz1pvNejfK5BLFcC6HFCpuhOQwexNJ/Ua2h31Mi41VY4oRQDLF6KiRuDsyMlHBzYDa+y+/4NFCQta7yb4+lz2G0nYQpaLAfOldtn+J5iG9zAAtltBOD+1Kx9DIEFenx/n8I9yd6U2lR+RyLMKu2VA5vhfb/Kb3m6oor5hqqN5fqqEcRhVUbxxRUMEV0E8NRPVTdBXUU0Mx9RQ1gnZqMKadov2gnBqMKKcoCnRTLwqfJjOuFqdrxdm6ztI0bOFrEQ6a/dLfXczmP6OpUYcSC0Nx0lmhCqqGAdrfU9RgZimbvtEh3UY1RRrBBvvtWnbzXcfUkk4HsyoAF+o55SMS/5B9u798O7i8UpsQNKpJwrTj6EJViih+wEh7WyorgnpEJIJ8zabn+rdqvXUkzxNITevtSidpcX87ZNGRae/v7mled2HKcNRH6NG0josRL8IUH2EwKHgHWYoEqW6g9QIvlgp2b9bAYs8aCUf8SnQQONQwTH8P+9JYKh3hpZAZRkdgPySpox+Os5eTFhh4IKEpkyHB/ciCBPcjqfHE8cgCHA06SVp5SN80nD0ZfL8eHHwpVk+lLnbTTkyvJirVpE78x2930OzXn+opyFoSow1bt11pxdh1m2Kzn5+zqWUdWw8bSRNfqsnQfPIHmo10KOrJWJJWk26zrsIHq2+z47c6vBGEcbuTJg2t7Ecr+Y8NE5wiPah0uk2yqMn//JmfLxRvjxUmpSG+pUJCzWD3l7vF5J86jB2zMxQcsuuoBymSPgHKphfyhbn+4286LqohC5FUQzaC5JCv//5ZvvlMvRDBh2YSEG6IdWDcbQYyKt+cRbOdjkqTCTSnwM5RLvLtTHaMN9XF2ZWdhG6HDBrYETnJyA7AIMIXOyYFNUiqaBHd1ceUGSUFCobJEC1imBQgGCcdSI2TKlHEQBlKQA2UWjsxUjqUGSm1T8RQ6VBiqNQiibEyiiTGiksgsVamOIO14ijJXBkyjc0Vl1V+Q6OhwF4xGBgsHUMNFtc0YrF0ELVYsqBiszVliDMxXhIMLJgOo0ZMlrCjCx1EjJlcVG+ruOoZAkvtmqySxLjpQMm+VXFvGm3Vxi3096YtNk5gJTunYmU7J+CSrVPhiq0TeMneaXhm7yQstXkqkNk8gWN2z2jAiFIatX0qitk+iQHC/qlQyf4JtGQDVbSwgVIThB3U+iQbuTgcbQsjN33nM3IUS42chlWNHIVSI6dBTSPHWgFGToPrRo6VDUbOABMjhzZHLTJas4f4JRVSvb19i5FjMGHkZBgzcgwljJyMokaOgRQjJ+O4kZOGiBm6/t66w9BJg8+MnQIWxk7SQGbwFKRh8KSiVaNnIZONnk4nGz4LqTB8OiE3fgqVYvyYyIHx08ZaNX4USo2fLnKS8aNAavw0oGL8mKSB8dOVQzF+rHYwfhpUNX6sT2D8NKhk/FiRYPz0Ionx45LJjZ8q5mD8OEozfoqsY+PHZVg2fjIKjB+DCeMnY6jxYyBh/GSQbPwkwd2bM+RbWD/JDjALqEBlCyiJGrGCClBYQalIZglVCZYtoaS3zBoqYHEkMxonD0PCofUn+MhhbiH7sCY/98RztUD1dy4GK2cGCtnVQICKp/PF4pEOagSjzRCfhAjcHnYw1nH1pJ7UgkYYV0axi1kckuPPvLeLfoOD63x+H1HIHBodwx1BI4mtCi52+0k28xTh+tPqO8UH7UbQlIFIXE+e6MDaWJo0E9HKfO1HcXCpt5KqvtxE0Hy9fUzzZSQovo4ExZdxoPc6juq9wh2i9jqQqb1SNdF6Hcm0XukOUXodSZReKZDovFEg0XmJ1UTrdVYzrZdwkt7raHBN4lCu+ToONF8AQfd1FNV9AQPtN6QBtF9Iw96cLgqg9xwBGq+DqMYL2T+60CFE10UxvS0dwFScY0C5DdHEDrG1DqwFE5CP1R/9tWVkxwZbssfpWBJWoxifoyYwB5z28JX2xdlge0F7V1xBXE0F8OoFUnIFhVYgf/yBz9RlXL73Sse1khh7OsmobHENP3fSgDXsu9lNeR+yZ/P3l5eDgy9qH5IUjV8owX4eoYWkgmH3GgwBjgoygl9pUAj1UZAh9DaDAqh7ggxgFxmM5eCZoLSD3WGwWsApQYbw6wvWVvBHkCFwc8GKAFcEpQhQPQYgiqcCmNYxiKRzCpD5AnYUdVM7DbpGMaBpCoCpGeMKUTKVK6BhHLE3p3wG7WJfQbnUJoBm8d4cqewiWsXJe1sau0GjeCeJQqn0JBRKK+mSq87sZLn/fkG5DKARUBjivvdVR0DgE17E/icdMEoawQFo02LBxF3MJ+wqx4D988PB3s79xYJy3TLaRXqIF+UMlr89R3s37Ky2MS/5xYe1B0ixyVWjeM7Hn/INdi8GL29lb2JsZtMKI8PA2TfZ3pEOJM+CFBy2sXMLOm48+iNI6woONFfDye2EV0H8OZAPShyOua+xjmyNob1yO2mN4X2o1IT++T7a4etoNFdhB8A2Lpe/wBSvLx+dKR7KMhq/XsSPvdDWDK4pbrNnS9nyi2LpxEcWpI2EXIXO76OVtA+ZhqNhM8RvOoiXZT75Ptt/5idoo5063oGT8tfyR5+88CAVrf/8KN+cK289d+QWD0iIK7dOowwCK4APgo4mLpjWAchnV/LFGRPpYb6LRGW8C2VluhtsMNwJdTDbhXcxWscrjKasAybryGrQxs9xcRSxalCHlzs7l8XuI4gllt3eFEfvJJtYf4g7VlcpBkdv8Bt/K0X4eytMOyr+vvcSrUzs+FqIfWQjslDrkrdc+ZsdtBzPZn+qN7LUxFMQPU3TQNzKUxS9FdVQ1NBTDL0U1TDM1rM2wZ2o3iZm7ll1cCWqobjFZ02HG1ENBUafFQQXonp1nFVt7E3QFryaO1TeHTDPVYZijroqiruuMhhz1lVh1HeVgZjDrgpizqu8XdRpV2sX817lNVLHXRXG3Vd5+6nzrgoD/1VeFHXg1WrkLBvDfjRwv014lr/+hFbC5r07h9HNngbjF+8cR7d6Go7evHMU3ehpKHb1LtoG2zy9bezuXVQKmzwNxy/fRSdgi6fh4PZdFAYbPL1SiXWNBjjuEM4NVvdtmslRLHDCvlU1OYyuwDUY4xsF0VW4BuJsY+2ClbjeLs41ViOsxjWYYBprP6zINRjlGSsKVuV6jZxltbGoHcZCQWfubCzjKKqgGoqxjMOogmowYBkHUQXVQJRlol2goHq7KMtEjaCgGoyxTLQfFFSDEZaJokBB9Ro5y5poOQfP3EDKVmYNfnEI80SfNZnFMcwLfVbnFEcwD/RZg02iLdT7fNbkkaiIep7PmgwSDaZe57Mad0Qh1ON81jrdt4JONw4kDZwevDy1vFRgMKaCKky8VWA4poMqjr1WYCimhCqKv1fgbaNaqLWNv1jglVI1VHHizQLvBNVDFUdfLfDCqCJqlXLWtRIx5Wd7P8yT/URyspK/8/P8RHKvkgH0FD+RHKvkz+zsPpFcqpT62Yl9IjlTyQB+Tp9IblQyAE7nE8mBSimfsyCIw0YV7n4JG/orvcHH5Wz9s8EMgaR3HCaSsUVA6R2HCQUGCSC94zCBlFVSO+GOw9JOyjSpdrjjMKGMfVKf4I7DhBJGSkXCHYelds5SdsUpRAvuNy08laBUykwoY6qEpQJnYoGrEpLKnomkbJXbCmJoaSvlq9wAkEgTyxgrdwyE08QSzsqFgpyaQBzJCsL9KgHi+MMi+pkwRQfRV0UAAW7oEPakCDDABh3D3xPRukj/dRB/TAQg6LgOgpdEtBjSY6MuIhtcJGwmnwKoHGgwZvIpiIqABuImn6Lo6GsoYfJZjTDwGkyYfNZyGHMNRk0+KwqGW8PEyShxStjJNz/rntbwrVi/yXc/6gjwtAYEfTClIWRPa1oSPJfScNTTmhYFj6U0CPO0psXAUykNQz2tKQQeSmkQcB0Bx/J8687oLvsMPdZBtMcMRF9CaSCl07w8eAGlQVm/eYHw8klD8a7zwuDFkwZjvecoeOmkFwZOvFE9lJx48TWtxYmXgtSLYd2DF0DypbDhvgsQfiFs+u4CgF8G662NQ3ICJV9lD7YOzAZLOLXNCpo0W0Dllis4aLwA8vYrKNoFAeO9UGBw5E5vsee/K/4cv/NTdvOIPcXuMNTxWPWHryXwyvvtq/7iJ/N8fSSi4RrI+XpxuV9cmTcAI0E1BQNPWoX58Nq4Xucg5hytgmhLOQpaqqPInYAoidynWxrNAMxdWi0kHCXzQ2+3v7Egh+IOAxoqfXD5UX5GPgovaeU4rzywL4/pa4vmywP52kL48ui9ZtxeHrLXEqxXjtNri9ArB+fVws/yuLN6xFkealYNMsujy2pxZXlAWXsoWTmGrC16LA8bK885AVqjsZBs+I6RpEG4WcLR4khorv73p7I6V7uoPB3e+2qHx1iGzeLhtNOCD39HK8K2Di/mLuxwHK4lSkz85FH2/bsFj8cq0tEwZhY0BKHvhAGeG0ZoAPrFH9nyD/2eV8JgqdMxsGqQCzo/0kFIAOMEwkcyFBJENJQ6MIXQjrwotFTXEGGjJSP662+xTGogCCSJpkd8Jp5EzWgEDRM9nC8eX2A/RBJaMpt7bCeqh7Wk0UraEYveM/u0/2mvhAipYLPd6HZYTf0bAjeJWmgNhRM/ACmJonOGpMaCFE8m+WtJy239iDAC7L6+uL3Jv21Yn0fJ76IUr9JqBZx7uFeP3e0Sq8TFIjhdGr6L7RqEsAMH/cHZthJunz6drNJILe9eKNaU3e+PJcmIfL3fv3ii+QyO0+eSxFewuLvWrCeaNFR3kAv0HzJmdDQGb4T5/WLjePBqU3VKikYm8IXKaBy0wVfiFifnkFH4sSt9kUkeXALTPj3Ovu1gh+CLhWLzWvWerMVJZ0zEPbuaUZ5jMrdJhqLh4zQUc21oV9pJLIX87M0OtheyS9NlqY1veELusqTGKIPYJAxB2yUjwImLPILjPlzF1YrVD4ShwA9EQSl+IAwHfiAKTvIDYSjuB6IA8SShtg0nczGbB/5l4FY2eDlpD1szFpB4HoOVnXukNTtneoaIOHpIZAEC2MhxayyuxvjJL3cyzt/10Jra/g5ZfoKMpUVWax4uqhYH4zxWFEbNHlrcgFG7GgG4AYPoDb4+1oLbyMkwIKqN1kkegyaki/Ns86RY+H5/s15MfTHdpGk3wUFa7yZzPJZWu8T1GHdA1nbpjXSH3kCSJ9J6qEoR8ibALmapFvMG/YfNUxCvM0LZSxBXf7dkeQSEym4qjZS5TF9r4kvSahUWyPy55s1B1vtoe67JlJg/2NT1mMUlQv+S+IIQl2iwOqk4GbDYXBBisP9tOltZwe2TVRS8lPmsAZ7JWm3sSTtiMjn8gyftWFBWv5oPwtuoxzDHkxfh2bOf/ZtzPezSr+E4nOOTsEs40cfOmS1AEsNBdCQdJzlgJkltjPtf9qd66sE2fVxbS2kWHv62VrsbrgdoEHBUOeKjD3FS82c7/dmLwepbl08+NSXEIb9YPVX0grrHS7sxyUFe2UBRJNNtBtN1u9rtYJ8ZZDpaaSK52BSnt4NHb3EIp9MLyVyOIXtZJ54L5JY8atPbcQTHJV/KBwRkK4axUZN4wOJOnW8jg4RL3d6y+g1hp4XRCe441J+6GcwsWxyHOA48h3QciytP/Sv4OxpwsLCkZxBAeESjA+Vo8gILL2h0rBaSXcDlgOwGEYvGLsFJLHYdKAKxCySEYTeKpAHtJRwJZ6/jWCx7qWYSyV7HsTD2UnnkBY2OExHspRLJiamObI8jCyQP0ul1fnZj1IsjQEogeGmpgX7t4gis8tj0NvAZhQYjqzGpWfwsQ+/DhNTLzWuj4cylU2oWWfYYvMWLB6kotCZAP6NRcdiQRfDrKrLWxsCPRzFWI7nOt8c4+KTOr+pEu41Np+gmMZ6mnIpUU5KMkvgIen951ijRSBJywRx7ngJKdJqEUtCRLJ2TPK7Fxpop7u0HaJ6dwCsknjAQRyNaNxO2iKRfb3YwX/SkZWgsyD3u8rNiWXYRYud/zz8Uy3LwyyClq7Wds/zjuWIpfg3gqO9ut7hTigo7Y7CDwl4QWjPRprNJco7BTuH+8li3Uuwr2iQP3pwpXxUPKYYDFyk88+4oO6cu2hehJanSYSPTGEWp3XehTGa4kApr3JWajHJhrWxzgW1MdGFLWWokjMNrc2orOzyQ7v0dfv+gYxtRmiapA4zXOmj39s//+csvf//b/yLfpPyZAfkDt2I45SRYD7RFxhXo3/mdCwQ8YxcuDjS9eoEgkezexYFlNzAQB45dvzjA/CIGmsFuYRxo/JoX+sXuYRxAuJFhsdzgOkaDMjNuHHgaAPPs04Box6DGd8vJtIEZCdJGHDRpAEl8EP50M9u8tGLtJ6wGzDzYNCHDHi6a7dUP1U2uIGPRgDV0DJnR8rP3aJLNL17nZ/OOjlmPhw2c5WjWwAx9EGpQ4le/Ezh3ECzV+3c/Bxu3OFjQ9pq9o/ZzawNnnBsbiOFPY03WOW8zTCj182Tn1eB/d7qeXx3Y+WE7ejd7Zxx/m7o27OGxRYOMuxhzGKIY1L7yEG03Ia3l4yt8Rvj9e//kp71rrqsDA+k7xTeVY+hjb1O044lGC21rGuivNOT69lq2eJG//oZo7R13XnBYRNV602AtcphzeFPrSu7GzBkILxKTqI4qiek0299dxMuxnjLZStspfAQbwtmrCwFXzQy3+9EDhQtnCqXXzW60fPNMaei9s5uGXkGzKuAC2g1nd9GseLiJduPppTSFI4HBq2cVru4vba4YXqT9kZmfxPeG1E9pDbVc0j6Hh3xJRS5fcT+Z2126pDpHUOWy2hwuxn4yp5utn8zubVrWL5cLpp/O4oboJ3CHZPbTeV38/KR+T7aSkXOFsyuRZWegyjI6V8qCkmHwxXkYhtQRH8lBWurtVUJnfcxaQuN7pV5Cag3qXtZEx0ucsqpcb1JK6NzPMsoqdMRvL63P8ZqhdMQdLv0ldHbv9tK+ufy9Swgtvs8lFO4I8A7C8hjCJTV6HZFLaP3+tmVD7wq9WaYRzqC6pYSu/Cplw+gLSTMUrSOWm4O2xDvVS2V9fu+l8IXT8BJaU1D4G+d4MuivxvVyzkvlfjnmr8yRYqKkLsdrq5LxdTw48lLZH9+U9Mn1EMVLZnmZ4cW701I4yMoi53hr8z6L8FL6Xf/9A+0KBOyXemd87xIyV6In/7D5wmK5jchQsaKHqNgRjNJBOUz0umFIHdFdHaRljv1+Mmv4Ej+JLxCRn9KaxKekfY4n1yUVuV4e+8ncL29LqnNk6SmrzfFgtWygHY82/WT2R4xl/XK95vPTWZ65+Qnc2X38dN5HYn5S/0OokpFzBUcvkWVnzoMyOlf2u5Jh8EUKHIbUEWHXtfUteztUQmcNk1RC4wt1VkJqTRdW1kRHaIeyqlwRDkro3C/8yyp0JAQrrc/xNr50xB0PxEvo7I+mS/vmejpcQmh5W1tC4U4mVkLofZFaQut/dVk2gq58DGWC7UyzUkroyrhZNhq+2KSubWhJXg8/mT3j0FDNdMQPd9CWvo4sobMGg3PN1yXB+hxk5dH7XNuc8nB+Jb3zxZwsIbWmb3Q11B+jtGwIHNF5yhroilFTQucO0VJWoSOnY2l9jugmpRLtCPFRQmePfFHaN1fshxJCS4yEEgp3NsgSQm88gRJa/5P5shF0ZdQpE2xnnqxSQlfK5LLR8EWWHorWkZLBQet/dO4jsgbZ9BH44uL66KxpZr0tc0QC81biioXlI3KHgfJW5Ugb66/JETzJP6yO8EE+IntUHX9/XAFlfFSW4Cs+uDu5rIOqPKC260CsPI+3c5kwTGJv17JruMyMDmr+TqodB2320gg/lcqmz4YQZG8AFx+hPz6JV6JdCcy8mu1MSeincqWm9wqoL3Z/OaEj441rAV0aybGU0BnXsJTSHd5vCFJHeLtSSmeUt1JKe7Czcv44A4GVkloCYZXSeCNHlVL7gyS5yIdKZTYcsSNFjIN4qMRoQ9E68s245upW9AA/CxSrrZPX2exlqYIPnUXByazyFJcOUm9SXdcly7B5dpy2cKjEO+7dL3kdKk2j5H1oKZdHummEX9ZxM7rwGFU5hMMavAgdiYMo5i9C+3fb+fZP3yqYvMbkm17yGhO/n/XfTQ+bpm9Izjry9nFq+tTOFtvIwND8ulJCeZwz6/rABy5NLG8QDh3U2KD8V+IbG8TDhzp2ddWSd9gFHSpRvItYYv1LH64sV7rJeX8YKwdeFgcCd0kEwDWBgAq8AlH2hMtRkT3PswOsDwghKR0QoFX7bh+SYcKhO4ovS2NvSvKQ8e9NRvsjlDnw0vjTQG6O8Qe4Ov60Dv/4e5JyO8DacAJJ6XACrdqVl16RdL0XdBStDCXth3co/6XY+F5BGCq1gVHC0FknDMqhAtl5qSS5ooH/HHIlE6nSRevzSld5QncviSZpQFgqaXIJahf98uZ7eeokcjxC9Qi17z2qSfavhXMy6GnYITFdv3txf3k5DO8VdaJDNpQ6lWSE8CpSSQoPg3aITCwGTVloRxeBPBVDIEyHylC8NhdDLV5tKcu84ZWOIeJ2uVoqZn/SSJd0DJOVxVWFbjNIRaWaXJ4/x1WfOk4vSwTWk5XEqcglj8VdDVOtFPB76AWHN2GNuVItzSrkZklp9hWvLA4RDs7fz9JMO15j6kyNZPa3LICrk0I2oBDy1jEbMALNeEI9/umAUgrDSYhc6sngutEkROWqRqnVLvkNpj8EgkkmhQFpdtKJygN4bUsCgQxWPmSL62V0aD+OJEymw5GVjr97qHG8OhKojpzbLN735ouNF9nPD3aVwcCRbow0LQaX468fkcwPJtdoXCkn31RzCQM1lLksT1xkkA4T8aFMxcoTU3lVzJVSzDw2KIl97CKQ9QviRTv0i+I19YJavOolQs1IwgjBZjzixKlkUQSqUlGkTRX6TFrp0meK1tWZ0JSqsxRijnv2kBhzJbWpHLervxR6R+IcBN/xKSInk1kHZKWsY0F8pAohjE85jVwb0Aw7UKpOw2B5dRpu9aIaZSNc6LnYSOITjnWbRJgkaYcwhYtL+OrSZVOiVotEJ0O6W6eRiH7s5NeH9z1kKefy2R37kUecJA2VrLi6yVdvy8iCPzSqxzfFkxM/FQ2ySbkHMTY9rONxGKtBp4PvRSjXH18XC989dCJGIl9USSESnVvEIbLAuY/Kho/m46/Yk+fPT+jJ0mg554LohrWkHv7OgxtinZvu2btJgy+CCK+s5I8+44N1lxTziIeSDEPQQ0KlCDAPKVcaPt6kKAuM7qrDmvzVWbyZedVZrjOfs7Nwe+JkE+5Js+pqzRhag0hpAzaz3o23KWMkOBFqhxPoz1TvLNhMDY+GSKRcd9XTwVGalHp298rr6SQtuY5885mjjiHTEJiUJYH23VV5Egq7arHm9fXUUJIo3FWNMzm3uyomXVI9PhmDekDEGMdu/DVwOVPHxSltUIUmbFCXT9h8+YndjePCqTXOJaJS40BCecOcElqaftwkKc+WYdKUpYRw1OLKe+2swExA7SrZl8LeWbw9c7yjCiq8vHyf5NLyQXQxc1xAUjITWpn1TomlRWsiS+rwzo+ehNmOZjFxVZrlklW5WSCsqEk+SaXR7lklNEiqpwZKwJjVnz3Eq3APp3DMeKk9sHT0NYkTCL5yIidfWdx5ueck9LyvJoVIGkVG6KytLGWNZUZw5GVxlW3NO+8o1kwB7yyV6yeU61NOUrSwLr0tn2rWkjgOa50ErWb5mmv1R39tGfsEXCx42o9P/Ouy9dt+ks089c4akOwI5gHoh28SIP2g1qu35Z4rSKlMrPmAOsWaFKtbLDKsPsFhmSH4FMxSQ7g5xEIGcxI49XXOwxEEMKETzM/PJXMM9Jvpv+i3S/9Fv6kxZH32LNfqlVoXWdEgnWBz8eX7/txptvQZh593rjtwggx5YUiSZPhqEhTSkpVROcekNLOUpUtleZSctXDtIHW4V4W0Aj7opHwnnBXOtQiK92kRq4FrOFThU3Jx5MOJButPcHIADxHJbIEmdEQFY99/+QXf5V++RwPvlEqa9kNssUjaD189LMUZTAvQf9+0wPoPjWLjd+MtnM0OXECcswMrXbdjpJohhJHbY16TSx+VmqiJZbV4VJLm3GA9ur/cLSb/9PWIORLypT1xIyQSdmenqAdROoEEpt5mCkxi6Wc/P9z35p39kagkJRaUC/29aYek4WiS+DwFaoOA/PgUx1MbpxF1SXTuuuAAHJ9Wseogpn9J52QyyWwIUneN4LvYCB6IHtLQcL1ZX5UKnSSJgtZTJz4Wkur7+SFbfOetjBFIFVEidy3wX6yS/t5kcb3lq4ThRR2Mxsu9Ed4NYnZKeDai9IFSuMvHuRAk0ftwnL2cLKmEkUiSJ8jcNUE2hajdYZVBMgWcQ+DtE199EqG01GXEviqZPztnILiz+7sniCQ+CkJ3bXxuYnOgmJtcdfEUOGxnT+YmL4VIHcKWSpA5BCfiee/aorMsIowEkojgg9GNeeduiWWG4QtckhrGZ5pprp6oxq0ZT9XjMWgibQ+YNJ60B7fPRUSzvfCtr5QVxm3bSKoeuKHTd04kb09+cl6cXflPCXER9C7MWgZciQ1VDLnXsRZSTB6VlED7z/fYcv+dFlfvP9VDte9u22v0XaaX+11ShOi3XADvs0ZNs7r8tZ40u2QJvrqJftnmrA1U67ZqEK29uOzlW9/6GwvF2SsbcrTbaJC4UTfftMD3DDGRjHZTIpDTPZoLWofwUPYV1joIaO9toyCiTQUad1NJJPwKbzCJh+9uNqB54wHu6wILWs/7AKHrS/rAqWgngMjdCQh6z3sBoe/dvaBw3g3Au7shotiLoSCx7L3dkKjYWBAidzdwFHzRCRIL390JAhZdIGh3F1iget4BCFfv7QCnoc0HEk/zcZh70X4S7N7TfoIWHSBwTwdYOHreAx6U3t8JTsd0l5G5OyIHtOf94WHt3V1S6HjPOKFHwHiYejE+LFi9X8YEIRskRufunoh0Lwkbjnfv7plEIokcpjE7RTNg8bRhnTDgm5X+ohWKim9ETRZUH2vKo+fZ/AbE07cR8FRjUDjdndgLj9DmPI6jUeK9zmvI1y+9NfB3D6IK/PbBXoWc0AzgsHtxwFkuMYBCHjEHtB6OhM221O7Bm9PsdtfdbpZ/DMqG3GOOsoNOB8eOESxZvcpmrjwsSbppI+ywZt8u4ZxyjqJpdjMKJetpB1QkOKNNJsthF+fUbHCUQsoE56BrJePYA4X1FI38YGbZ3VOeP45WQHLHOYomtqQuie7dZvF5wV02OG4yzhDnTZdUAZKXDGB3ySKZHS2cJLJzFE4WxpJYQapZZ9ntbgsxUFXp/o/p4vKTX7EJmanehLJMyYFYU3Ug9So80NnVnra5RPlbaVIL221JAubfoS27o764W3swIQnXRa9/97ysW+aUAU3zThxAqk4fQOadRIDMmEooK0smFCBWpxWg9E4u3RgtfzSBKQ5+5NuTQwiMPjPRUSuZn6BKQ9ig1jJhE4+TmMEiD5RczRyPRjpNJCKy3k/nz36W8VGdGOnY+aZHINMnSToAvqkSuKFpD/DCqz1AZ9ceOoAl2oPPw5shORMQSvF8J1v9XsYd6/RO+1o+yUPLTcWCVg+hWJqVoBWX2IoAJ24NmmyiIAd7fvVVjQutxWdioGPaqoF0agi1N+wTzL0lVgqqNKYMKj8lUwY8k8BHNZQp5FGEy6QzJ22xDiFO2mWyols7qks+mwedUqcy6JF3KqO2TzWYdPIsMZtQoz6dUTUqmc6qMX5yWWft/Licn6x6O6YtukBAfHMLkOlzC+VI+dxi1VZKPay2aipHqUtUjlav6hElLdcjXSGofRhKIYwlFjC5XOg06aF65JAeOpB/hceQE/wZpA3DniGF/AmSDcUezoX80ZyM4hLAzqf5MlzdCzaqQeevIzEcFD3rb81YPqfgdLl1UrzYtnxuP+g2SRD4ma+D6y8WQCtJa91WBP7G3w+LxUNbKXFEtq3Z8ml/6Xv26akN0whjCF0ED15RjeiHQ888nyqDV5D1Ao5KRP/278XpbX/h+3/YmJIm5IH81kp/Y91WepOeAG3YeEYyN0/wlM399SMLKMDmOOiQF4nZ/nJ+vpFNL7gKE92GIt3dltC81zKNr9ftEC23mhDSBOLrW0BITav4+/ZUf+fC1q/fusFYkkLo+pPzwYFNKppoH9Qkz92ylS/oN/h+bUFBEH0MunuGHcZvdxz1Sewhrl1O9khgwR2JxMcdmkS73UqBjufQLib/tMAbE7WkGZFHLG9e9Jdn7i8vbV0kb535I2cbv6kzTZDWqNMk86bJrl8Wx1/1MEBKYzlfoLFOvihwzhmZyMcZ4sGH1unVKlHi2Uv0c8Jw9DcyBb57hn5OWIPCBqv7ehQ9GTaWJB1S6QqyvFcuWDVJ6Pn9Cfq5UJxZwq3TxS8Jz7mlUfkYFk4Qo7Hwpdi8tn8m91TL7+zfHzLA/jM7gLYMv2odCysUjTO1P59ydsmk4T2TKX3daiYPI7S9YM5cWKpfn2B3FuLMZSHQ0OAA6URjR0YFj2+Bnpw48WEc4pTnQRy1wftlqjh/B5nobZMfLRff/45Dc0jB+GJxd7WcQMiBRObVGnxWSyIv85ul4um8bWRw5GMe8tgCEDGjebRoW31SiGgeHNpqsVlEaDkWtK1aHDR6HK0WK5AnFjXv6bxTvmS0kCyJxscrESozQYPKI2WiBVc2tWwbGxEhk1EMVnbuL/BrXycRC47JKHhkTDcFRlZqwUN65IZQ+fl2cXDuxfLeyxS+3v+B/omIaE39mZ30bDMChOaUA3JaUCwEJw+9aTNI41GM3VUrf9AwAW+Ps+k5LM2bJ2VwYVIlIl/HgupEu422ilGjBWkp8t48Tj5ubb309lB7cmibWdjTvPEgjZMaCby3eYKf5W1+y/aOfBSkUQJPGlWKF9ovUfm6Lj0Qr4dN/jTcKT7iDW+EFtRt8ez34Es+u5xtvLdNgNyVcSRJ0UqDdAser/Y/Tma7tgU9e4CaPAzF29OdSzz6//yfv/zy97/9X3yP0v7f2JPgH7/8Feduxr5QJUMpYOD1Ibt7qN9JtDtk12l+lMXJwerbwelnFWRdYvLPjumQf3csCQQ98f1nTi2MC88hjIeCrAUttIPEgdXaY2glgluMVrKDlYP+LI7drpba7aB/f2W507d+DK7fqYUNt9ATeOI9Sp+sCqOIn6yu/RBGUeDTCTwtVlgYTWBevv4DImgqWBbxEkkBUh/I8UTiXQ42e/e9Kw1Ld+C/hm3QTTTu970XxdsZFcciWspxLFVEt/2gwjyjyNg9yd8sg2eUAiyx7ALHFQBelHLxhwelDuwDeFtLX3lv3BRLCy4kiZQpHpKTQJkObCsYb4pS946y6T8dyN+6YSigqPbs+ZIDmoLQ0ULf7WbbKypSW2jKH9QlJv9SusqSkOrJgfig7575F/sOU2hmBIGf4F2Z/KLMVGA0gYYjWPuUN17TC7re2a26MOkSkPjXcc86/aN98SQQzuWcpIHa1pl/KVkIC1y5WeNY/spcfl+uIPSzHUHaHR2lia22Hvcf4c239t2/FeZA8lYhbLSo7YFnCtj7cOuHgmNufbJHnw7wLwAlJI0iAQPZ38JvPTQEmeDxUoK1Cx6E8cWEgNo38fy74xxD+l62I+JQc5UvPjlX5BLEdswmjXQ1QrMF2qHDUv31N8w5XRzILAWtQFO4pSHOMytVNS27cjEDGAeGGq15PiBobceEGrl5biDIvQtIAUOri/EHYEsvPg4u5iy1mGcdgnyorYeAW88K+We8Fwf3Tdlx04CQGECQxPPT4+zbjq6w2nmloI3qZEXQ/LWbQmy0m+P8+/Ns+Uu2uq9LqOWsSnyzHtXxz479ifhunGjwT9ZNC/9q2Rpp37jeEADbySL7EnWiECsOeJG9O+9PPcU7Fnp0xQFoQRuQng0eLQ8OP9sgrW6zhh1doZxi9dQKCtEEhqMENkdF/KL++bfsbsoGbyNjAQGgitlD/Mrp9YEKqMUh7Dvx+f/eY+N7I4iIudt9lM1OmdQ8HAtROKKQ5/nxggFECkXMDA6l/f5W+zYehvAI5Vk+d6R963SbTVx+NYawdjPP2Dkex4ykAeYbRmEu18jU9H4J9SZ7eprNXGklkqBAlSo0t9i4NRC/dSO08EezD1kU3h3hQE8nTwwYOQQO0hSi9P45ib2Zj79qTSOrIAaCt7IGCGe1gcCCCEb2VsdfBxuftWZHcQjXcbRh+enc4OoNjrqil4fENqhPMFzx+Sw7fmvrQAuH4Eeldjj09VGxNm2HSlIHYCRzxcGdDcziUbHgWoQ1tqEgNo1lqnp6km8fIpOtjy3Zl3RTiNdNFjQFkVRdTNEKAS8kyJobr2LnN7LXP/OzORWHl/t40UH8oN4VV6/Uz53kdxygHz/QJTPl3Kf820pxOpedvFGB4JLerjwMYRFKPNH7y4vZhVZiHI2ElXoKC8xidSd7cYPmrmz5tdZPNK1VA7JYxQtlevSlyRHakUL01Ker2emBjQ24mDYyrA2+4B7sLeVvz3VlRLNVpdpNobSpHVRUMfkVTQ8aU6NmgkP/ByS11+wWdhCYOcyfzBrDRDGOr6BQAVkAgT7lp1fF6zUDmIa/dvG2DQ71bvfvb146kB2czQAX9+a0f3yjCWuaPITpOF980d+d1oe4OzrWhAVbtvV2sPNJk5C4245QIwAxWDscTN7p5Yc1kjoQ4h0Xu8fq9yqyGiFNH/DYYP5IGjb/mICPiBN65XRHWgnwJiKC5Q/Zl2bvt7MLrS8kKwRkhxYpId6c5vPaDEmDeqXhSMxD5mUfPuAF8vIzpMIqmobyaje4ndVH6WEEJmP/WX6u63SzHdB2o+Uh6qP++WGEprEqpDVZe5e/WtQlOESL3ErQTckqdu6geP40m55jsaG02RdQdIaxoNoT8cOgyXCgpTYcnadppbBTtRWHQ/8xGMT/s8G47wprH3iuWJBIVBsJnHWuL2TPZn755z//P9yQk4HsBQEA";

    function loadDictionaries() {
        try {
            // Decompress using pako (gzip)
            const compressed = Uint8Array.from(atob(COMPRESSED_DATA), c => c.charCodeAt(0));
            // eslint-disable-next-line no-undef
            const decompressed = pako.inflate(compressed, { to: 'string' });
            const data = JSON.parse(decompressed);

            logger('✅ Dictionaries loaded successfully', EXTENDED_SCRIPT_COLORS.brightGreen);
            return data;

        } catch (error) {
            logger(`❌ Failed to load dictionaries: ${error}`, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
            return {
                ZHitemNames: {},
                ZHActionNames: {},
                ZHOthersDic: {}
            };
        }
    }

    // Initialize your dictionaries
    const { ZHitemNames, ZHActionNames, ZHOthersDic } = loadDictionaries();

    function injectGlobalStyles() {
        if (document.getElementById('tamper-style-sort-box')) return;

        const style = document.createElement('style');
        style.id = 'tamper-style-sort-box';
        style.textContent = `
            :root{
                --mwitools-main: ${SCRIPT_COLOR_MAIN};
                --mwitools-bg  : linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(30, 30, 60, 0.9));
                --mwitools-on  : #4ECDC4;
                --mwitools-off : #64748b;
                --mwitools-accent: #9CDCFF;
                --mwitools-secondary: #8A2BE2;
                --mwitools-glow: rgba(78, 205, 196, 0.6);
            }

            #main-sort-div {
                width: 100%;
                max-width: 850px;
                margin: auto;
                box-sizing: border-box;
            }

            #main-net-div {
                width: 100%;
                max-width: 850px;
                margin: auto;
                box-sizing: border-box;
                margin-bottom: 12px;
            }

            .collapsible-content {
                overflow: hidden;
                max-height: 0;
                border-bottom: 1px solid rgba(156, 220, 255, 0.2);
                // transition: max-height 0.4s ease, padding 0.3s ease;
                padding: 0 16px;
            }

            .collapsible-net-content {
                overflow: hidden;
                max-height: 0;
                // transition: max-height 0.4s ease, padding 0.3s ease, display 0.3s ease;
                padding: 0 16px;
                border-bottom: 1px solid rgba(156, 220, 255, 0.2);
            }

            .collapsible-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px;
                cursor: pointer;
                user-select: none;
                background: transparent;
                // transition: background 0.3s ease;
                border-top: 1px solid rgba(156, 220, 255, 0.3);
                border-bottom: 1px solid rgba(156, 220, 255, 0.3);
            }

            .collapsible-net-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px;
                cursor: pointer;
                user-select: none;
                background: transparent;
                // transition: max-height 0.4s ease-in-out, display 0.3s ease-in-out, hidden 0.3s ease-in-out;
                border-bottom: 1px solid rgba(156, 220, 255, 0.3);
            }

            .collapsible-header:hover {
                background: rgba(156, 220, 255, 0.1);
            }

            .collapsible-header span {
                display: flex;
                align-items: center;
            }

            .collapsible-header .collapse-arrow {
                color: #9CDCFF;
                font-size: 18px;
                transition: transform 0.3s ease;
                margin-left: 12px;
            }

            .collapsible-net-header:hover {
                background: rgba(156, 220, 255, 0.1);
            }

            .collapsible-net-header span {
                display: flex;
                align-items: center;
            }

            .collapsible-net-header .collapse-net-arrow {
                color: #9CDCFF;
                font-size: 18px;
                transition: transform 0.3s ease;
                margin-left: 12px;
            }

            .sort-buttons-container {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
                width: 100%;
                box-sizing: border-box;
            }

            .mwitools-card{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                padding: 20px 24px;
                font-size: 14px;
                line-height: 1.5;
                margin-top: 16px;
                color: #E6E6FA;
                position: relative;
                overflow-y: auto;
                flex-wrap: wrap;
                gap: 6px;
                align-items: stretch;
            }

            .mwitools-settings-column {
                display: flex;
                flex-direction: column;
            }

            .mwitools-settings-column .mwitools-setting:nth-child(n+26) {
                display: none;
            }

            .mwitools-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(90deg, transparent, var(--mwitools-accent), transparent);
            }

            .mwitools-card::-webkit-scrollbar {
                width: 8px;
            }

            .mwitools-card::-webkit-scrollbar-track {
                background: rgba(30, 30, 60, 0.5);
                border-radius: 4px;
            }

            .mwitools-card::-webkit-scrollbar-thumb {
                background: var(--mwitools-accent);
                border-radius: 4px;
                opacity: 0.7;
            }

            .mwitools-card::-webkit-scrollbar-thumb:hover {
                opacity: 1;
            }
            .mwitools-card h3 {
                grid-column: 1 / -1; /* Header spans all columns */
                margin: 0 0 20px 0;
                color: var(--mwitools-accent);
                font-weight: 600;
                text-shadow: 0 0 8px var(--mwitools-glow);
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: space-between; /* Space between title and buttons */
                gap: 8px;
            }

            .mwitools-setting {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                margin: 4px 4px;
                padding: 8px 8px;
                border-bottom: 1px solid rgba(156, 220, 255, 0.1);
            }

            .mwitools-setting-label {
                text-align: left;
                flex: 1;
                margin-right: 16px;
            }

            .mwitools-setting-input {
                flex-shrink: 0;
            }

            .mwitools-text-input,
            .mwitools-number-input {
                padding: 8px 12px;
                border: 1px solid rgba(156, 220, 255, 0.3);
                border-radius: 4px;
                background: rgba(0, 0, 0, 0.3);
                color: var(--mwitools-text);
                min-width: 120px;
            }

            .mwitools-text-input:focus,
            .mwitools-number-input:focus {
                outline: none;
                border-color: var(--mwitools-accent);
                box-shadow: 0 0 8px rgba(156, 220, 255, 0.3);
            }
            .mwitools-select-input {
                padding: 8px 12px;
                border: 1px solid rgba(156, 220, 255, 0.3);
                border-radius: 4px;
                background: rgba(0, 0, 0, 0.3);
                color: rgb(25, 118, 210);
                font-weight: bold;
                min-width: 120px;
                cursor: pointer;

                /* Force browser to use custom styles where possible */
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;

                /* Add custom dropdown arrow */
                background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239cddff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
                background-repeat: no-repeat;
                background-position: right 8px center;
                background-size: 16px;
                padding-right: 32px;
            }

            .mwitools-select-input:focus {
                outline: none;
                border-color: var(--mwitools-accent);
                box-shadow: 0 0 8px rgba(156, 220, 255, 0.3);
            }


            .mwitools-select-input option {
                background: rgb(13, 14, 17);
                color: rgb(25, 118, 210);
                font-weight: bold;
            }

            .mwitools-range-container {
                display: flex;
                align-items: center;
                gap: 12px;
                min-width: 140px;
            }

            .mwitools-range-input {
                flex: 1;
                min-width: 100px;
            }

            .mwitools-range-value {
                font-size: 14px;
                color: var(--mwitools-accent);
                min-width: 30px;
                text-align: center;
            }

            .mwitools-color-input {
                width: 40px;
                height: 40px;
                border: 1px solid rgba(156, 220, 255, 0.3);
                border-radius: 4px;
                cursor: pointer;
                background: none;
            }

            .mwitools-color-input:focus {
                outline: none;
                border-color: var(--mwitools-accent);
                box-shadow: 0 0 8px rgba(156, 220, 255, 0.3);
            }
            .mwitools-setting span{
                flex: 1 1 auto;
                color: #E6E6FA;
                font-weight: 500;
            }

            .mwitools-switch {
                position: relative;
                width: 48px;
                height: 26px;
                flex-shrink: 0;
                box-sizing: border-box !important;
            }

            .mwitools-switch input {
                opacity: 0;
                width: 0;
                height: 0;
                position: absolute;
            }

            .mwitools-slider {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--mwitools-off);
                border-radius: 34px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid rgba(156, 220, 255, 0.2);
                box-sizing: border-box !important;
            }

            .mwitools-slider:before {
                content: "";
                position: absolute;
                height: 20px;
                width: 20px;
                left: 3px;
                bottom: 2px;
                background: linear-gradient(135deg, #ffffff, #f0f0f0);
                border-radius: 50%;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                box-sizing: border-box !important;
            }
            .mwitools-switch input:checked + .mwitools-slider{
                background: rgb(25, 118, 210);
                border-color: rgb(25, 118, 210);
                box-shadow: 0 0 12px rgb(25, 118, 210);
            }

            .mwitools-switch input:checked + .mwitools-slider:before{
                transform: translateX(22px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
            }
            .mwitools-bulk {
                /* Remove grid positioning since it's now inside h3 */
                display: flex;
                gap: 12px;
                /* Remove other properties as they're not needed */
            }

            .mwitools-bulk button{
                background: linear-gradient(135deg, var(--mwitools-secondary), #6A1B9A);
                border: 1px solid rgba(138, 43, 226, 0.4);
                color: #ffffff;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-shadow: 0 0 4px rgba(138, 43, 226, 0.6);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }

            .mwitools-bulk button:hover{
                background: linear-gradient(135deg, #9A4BCF, var(--mwitools-secondary));
                box-shadow: 0 0 12px rgba(138, 43, 226, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3);
                transform: translateY(-1px);
            }

            .mwitools-bulk button:active{
                transform: translateY(0);
            }

            .mwitools-search input{
                width: 100%;
                padding: 12px 16px;
                border-radius: 8px;
                border: 1px solid rgba(156, 220, 255, 0.3);
                margin-bottom: 16px;
                background: rgba(30, 30, 60, 0.7);
                color: #E6E6FA;
                font-size: 14px;
                backdrop-filter: blur(5px);
                transition: all 0.3s ease;
            }

            .mwitools-search input::placeholder{
                color: rgba(156, 220, 255, 0.6);
            }

            .mwitools-search input:focus{
                outline: none;
                border-color: var(--mwitools-accent);
                box-shadow: 0 0 12px rgba(156, 220, 255, 0.3);
            }

            .mwitools-card p {
                grid-column: 1 / -1; /* Footer text spans all columns */
                font-size: 18px;
                color: rgba(156, 220, 255, 0.7);
                text-align: center;
                font-style: italic;
            }
            .circle-glow {
                position: absolute;
                top: -5px;
                right: 18px;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: rgba(255, 0, 76, 0.1);
                border: 2px solid rgba(255, 80, 100, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 0 6px rgba(255, 80, 100, 0.5);
                transition: all 0.2s ease;
                scale: 50%;
            }

            .circle-glow:hover {
                box-shadow: 0 0 12px rgba(255, 80, 100, 0.8);
                transform: scale(1.05);
            }

            .overlay-icon-svg {
                width: 28px;
                height: 28px;
            }
            .externalNavLink {
                font-size: 0.95em;
                opacity: 0.9;
                transition: all 0.2s ease;
                padding: 3px 4px;
                cursor: pointer;
                color: #ffe7a1; /* Soft golden tone, replace with SCRIPT_COLOR_MAIN if dynamic */
                border-radius: 4px;
            }

            .externalNavLink:hover {
                opacity: 1;
                background-color: rgba(255, 255, 255, 0.05); /* faint hover bg */
                text-decoration: underline;
            }

            .externalNavLinkWrapper {
                position: relative;
                display: inline-block;
            }

            .floatingTooltip {
                position: absolute;
                display: none;
                background: rgba(184 184 233 / 60%);
                border: 1px solid #9994;
                color: white;
                font-size: 12px;
                line-height: 1.3;
                padding: 6px 8px;
                border-radius: 6px;
                backdrop-filter: blur(2px);
                z-index: 9999;
                pointer-events: none;
                max-width: 240px;
            }

            .floatingTooltip strong {
                display: block;
                font-weight: bold;
                margin-bottom: 2px;
            }

        `;
        document.head.appendChild(style);
    }
    injectGlobalStyles();

    function inverseKV(obj) {
        const retobj = {};
        for (const key in obj) {
            retobj[obj[key]] = key;
        }
        return retobj;
    }

    function getCallerFunctionName() {
        try {
            const err = new Error();
            const stackLines = err.stack.split("\n");
            // stackLines[0] is "Error"
            // stackLines[1] is this function (getCallerFunctionName)
            // stackLines[2] is the caller of getCallerFunctionName (aka logger)
            const callerLine = stackLines[3] || stackLines[2];
            const match = callerLine.match(/at (\S+)/);
            return match ? match[1] : "anonymous";
        } catch (e) {
            logger(`Error getting caller function name: ${e}`, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
            return "unknown";
        }
    }

    function logger(message, color, debug = false, level = "info") {

        console.log(`%c[${new Date().toLocaleString()}] [MWIT-Extended]%c ${message} ${debug ? console.trace() : ''}`,
        `color: ${color}; font-weight: bold`,
        'color: inherit');
        if (level === "error") loggerLog.push({"message": message, "timestamp": new Date().toISOString(), "caller": getCallerFunctionName()});
    }


    const ZHToItemHridMap = inverseKV(ZHitemNames);
    const ZHToActionHridMap = inverseKV(ZHActionNames);
    const ZHToOthersMap = inverseKV(ZHOthersDic);

    function getItemEnNameFromZhName(zhName) {
        const itemHrid = ZHToItemHridMap[zhName];
        if (!itemHrid) {
            logger("Can not find EN name for item " + zhName, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
            return "";
        }
        const enName = initData_itemDetailMap[itemHrid]?.name;
        if (!enName) {
            logger("Can not find EN name for itemHrid " + itemHrid, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
            return "";
        }
        return enName;
    }

    function getActionEnNameFromZhName(zhName) {
        const actionHrid = ZHToActionHridMap[zhName];
        if (!actionHrid) {
            logger("Can not find EN name for action " + zhName, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
            return "";
        }
        const enName = initData_actionDetailMap[actionHrid]?.name;
        if (!enName) {
            logger("Can not find EN name for actionHrid " + actionHrid, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
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

    const MARKET_JSON_LOCAL_BACKUP = `{"marketData":{"/items/abyssal_essence":{"0":{"a":320,"b":310}},"/items/acrobatic_hood":{"0":{"a":96000000,"b":90000000},"1":{"a":-1,"b":12000000},"4":{"a":-1,"b":60000000},"5":{"a":98000000,"b":96000000},"6":{"a":105000000,"b":94000000},"7":{"a":110000000,"b":105000000},"8":{"a":140000000,"b":130000000},"10":{"a":300000000,"b":285000000}},"/items/acrobats_ribbon":{"0":{"a":9600000,"b":9200000}},"/items/alchemists_bottoms":{"5":{"a":155000000,"b":40000000},"7":{"a":170000000,"b":-1},"8":{"a":205000000,"b":150000000},"10":{"a":340000000,"b":-1}},"/items/alchemists_top":{"5":{"a":145000000,"b":130000000},"8":{"a":195000000,"b":150000000},"10":{"a":420000000,"b":-1}},"/items/alchemy_essence":{"0":{"a":270,"b":260}},"/items/alchemy_tea":{"0":{"a":620,"b":580}},"/items/amber":{"0":{"a":25000,"b":24500}},"/items/amethyst":{"0":{"a":40000,"b":39000}},"/items/anchorbound_plate_body":{"0":{"a":-1,"b":120000000},"3":{"a":-1,"b":5000000},"5":{"a":140000000,"b":135000000},"7":{"a":175000000,"b":145000000},"8":{"a":-1,"b":100000000},"10":{"a":560000000,"b":-1}},"/items/anchorbound_plate_legs":{"0":{"a":120000000,"b":100000000},"3":{"a":110000000,"b":-1},"5":{"a":-1,"b":76000000},"7":{"a":145000000,"b":120000000},"10":{"a":440000000,"b":-1}},"/items/apple":{"0":{"a":14,"b":13}},"/items/apple_gummy":{"0":{"a":22,"b":21}},"/items/apple_yogurt":{"0":{"a":320,"b":290}},"/items/aqua_arrow":{"0":{"a":28500,"b":28000}},"/items/aqua_aura":{"0":{"a":2300000,"b":2150000}},"/items/aqua_essence":{"0":{"a":20,"b":19}},"/items/arabica_coffee_bean":{"0":{"a":185,"b":175}},"/items/arcane_bow":{"0":{"a":600000,"b":560000},"4":{"a":900000,"b":-1},"5":{"a":1750000,"b":-1},"7":{"a":7800000,"b":-1}},"/items/arcane_crossbow":{"0":{"a":470000,"b":460000},"1":{"a":480000,"b":300000},"2":{"a":460000,"b":300000},"3":{"a":480000,"b":310000},"4":{"a":490000,"b":330000},"5":{"a":600000,"b":500000},"6":{"a":1250000,"b":540000},"7":{"a":4200000,"b":2100000},"8":{"a":-1,"b":3100000},"9":{"a":-1,"b":4000000},"10":{"a":-1,"b":28000000}},"/items/arcane_fire_staff":{"0":{"a":460000,"b":450000},"1":{"a":490000,"b":82000},"2":{"a":600000,"b":-1},"3":{"a":640000,"b":-1},"4":{"a":-1,"b":490000},"5":{"a":1350000,"b":1000000},"6":{"a":3000000,"b":1500000},"7":{"a":-1,"b":5000000},"8":{"a":-1,"b":3600000},"9":{"a":-1,"b":5000000},"10":{"a":-1,"b":6600000}},"/items/arcane_log":{"0":{"a":360,"b":350}},"/items/arcane_lumber":{"0":{"a":1800,"b":1750}},"/items/arcane_nature_staff":{"0":{"a":460000,"b":450000},"1":{"a":-1,"b":90000},"2":{"a":600000,"b":-1},"5":{"a":1550000,"b":1250000},"7":{"a":-1,"b":1750000},"9":{"a":-1,"b":120000},"10":{"a":29500000,"b":2000000},"11":{"a":46000000,"b":-1}},"/items/arcane_reflection":{"0":{"a":64000,"b":62000}},"/items/arcane_shield":{"0":{"a":285000,"b":280000},"2":{"a":340000,"b":-1},"3":{"a":420000,"b":-1},"4":{"a":680000,"b":-1},"5":{"a":600000,"b":350000},"6":{"a":2500000,"b":-1},"7":{"a":-1,"b":480000}},"/items/arcane_water_staff":{"0":{"a":460000,"b":450000},"1":{"a":460000,"b":-1},"2":{"a":500000,"b":-1},"3":{"a":580000,"b":-1},"4":{"a":700000,"b":-1},"5":{"a":980000,"b":760000},"6":{"a":7000000,"b":700000},"7":{"a":9200000,"b":1650000},"8":{"a":11500000,"b":2000000}},"/items/artisan_tea":{"0":{"a":1650,"b":1600}},"/items/attack_coffee":{"0":{"a":440,"b":430}},"/items/azure_alembic":{"0":{"a":27500,"b":21000},"1":{"a":2250000,"b":-1},"3":{"a":130000,"b":-1},"4":{"a":110000,"b":-1},"5":{"a":33000,"b":-1}},"/items/azure_boots":{"0":{"a":17000,"b":15000},"1":{"a":32000,"b":-1},"2":{"a":38000,"b":-1}},"/items/azure_brush":{"0":{"a":22000,"b":21000},"1":{"a":29500,"b":-1},"2":{"a":100000,"b":-1},"3":{"a":88000,"b":-1},"4":{"a":145000,"b":-1},"5":{"a":180000,"b":-1},"6":{"a":540000,"b":-1}},"/items/azure_buckler":{"0":{"a":19500,"b":17000},"2":{"a":800000,"b":-1},"4":{"a":155000,"b":-1},"5":{"a":300000,"b":-1},"6":{"a":440000,"b":-1},"7":{"a":500000,"b":-1}},"/items/azure_bulwark":{"0":{"a":23000,"b":17500},"1":{"a":39000,"b":-1},"3":{"a":440000,"b":-1},"4":{"a":76000000,"b":-1},"5":{"a":165000,"b":-1},"6":{"a":145000,"b":-1}},"/items/azure_cheese":{"0":{"a":540,"b":490}},"/items/azure_chisel":{"0":{"a":24000,"b":22500},"2":{"a":100000,"b":-1},"3":{"a":245000,"b":-1},"4":{"a":450000,"b":-1},"6":{"a":680000,"b":-1}},"/items/azure_enhancer":{"0":{"a":25000,"b":24500},"1":{"a":30000,"b":-1},"2":{"a":37000,"b":-1},"3":{"a":52000,"b":-1},"4":{"a":60000,"b":-1},"5":{"a":1250000,"b":-1},"6":{"a":210000,"b":-1}},"/items/azure_gauntlets":{"0":{"a":18000,"b":15500},"1":{"a":90000,"b":-1},"3":{"a":160000,"b":-1},"4":{"a":200000,"b":-1},"5":{"a":240000,"b":-1},"6":{"a":150000,"b":-1},"10":{"a":1200000,"b":-1}},"/items/azure_hammer":{"0":{"a":22000,"b":17000},"1":{"a":27500,"b":-1},"2":{"a":90000,"b":-1},"5":{"a":185000,"b":-1}},"/items/azure_hatchet":{"0":{"a":29000,"b":21500},"1":{"a":600000,"b":-1},"2":{"a":82000,"b":-1},"3":{"a":120000,"b":-1},"4":{"a":120000,"b":-1},"5":{"a":250000,"b":-1}},"/items/azure_helmet":{"0":{"a":20000,"b":17500},"1":{"a":41000,"b":-1},"2":{"a":180000,"b":-1},"3":{"a":350000,"b":-1},"4":{"a":500000,"b":-1},"5":{"a":1100000,"b":-1},"7":{"a":780000,"b":-1}},"/items/azure_mace":{"0":{"a":31000,"b":29500},"3":{"a":130000,"b":-1},"5":{"a":230000,"b":-1}},"/items/azure_milk":{"0":{"a":115,"b":105}},"/items/azure_needle":{"0":{"a":23500,"b":23000},"1":{"a":76000,"b":-1},"2":{"a":160000,"b":-1},"3":{"a":190000,"b":-1},"4":{"a":2300000,"b":-1},"5":{"a":240000,"b":-1}},"/items/azure_plate_body":{"0":{"a":32000,"b":29500},"1":{"a":37000,"b":-1},"2":{"a":98000,"b":-1},"3":{"a":155000,"b":-1},"5":{"a":290000,"b":-1}},"/items/azure_plate_legs":{"0":{"a":27000,"b":25500},"1":{"a":38000,"b":-1}},"/items/azure_pot":{"0":{"a":26000,"b":22500},"1":{"a":125000,"b":-1},"2":{"a":150000,"b":-1},"3":{"a":120000,"b":-1}},"/items/azure_shears":{"0":{"a":21500,"b":20500},"4":{"a":235000,"b":-1},"5":{"a":115000,"b":-1}},"/items/azure_spatula":{"0":{"a":24000,"b":23500},"1":{"a":98000,"b":-1},"2":{"a":145000,"b":-1},"3":{"a":180000,"b":-1},"5":{"a":500000,"b":-1}},"/items/azure_spear":{"0":{"a":32000,"b":27500},"1":{"a":36000,"b":-1},"2":{"a":76000,"b":-1},"3":{"a":42000,"b":-1},"4":{"a":150000,"b":-1},"5":{"a":140000,"b":-1}},"/items/azure_sword":{"0":{"a":31000,"b":28500},"1":{"a":40000,"b":19000},"2":{"a":41000,"b":-1},"3":{"a":165000,"b":-1},"4":{"a":155000,"b":-1},"5":{"a":245000,"b":-1},"7":{"a":2000000,"b":-1}},"/items/bag_of_10_cowbells":{"0":{"a":220000,"b":215000}},"/items/bamboo_boots":{"0":{"a":9600,"b":9000},"1":{"a":29500,"b":-1},"2":{"a":45000,"b":-1},"3":{"a":76000,"b":-1},"5":{"a":170000,"b":-1},"6":{"a":300000,"b":-1},"7":{"a":500000,"b":-1},"8":{"a":760000,"b":-1}},"/items/bamboo_branch":{"0":{"a":31,"b":30}},"/items/bamboo_fabric":{"0":{"a":235,"b":225}},"/items/bamboo_gloves":{"0":{"a":9200,"b":7200},"1":{"a":32000,"b":-1},"2":{"a":44000,"b":-1},"3":{"a":98000,"b":-1},"5":{"a":145000,"b":-1},"6":{"a":320000,"b":-1},"8":{"a":600000,"b":-1}},"/items/bamboo_hat":{"0":{"a":23000,"b":20500},"1":{"a":80000,"b":-1},"2":{"a":82000,"b":-1},"3":{"a":98000,"b":-1},"4":{"a":220000,"b":-1},"5":{"a":270000,"b":-1}},"/items/bamboo_robe_bottoms":{"0":{"a":29500,"b":24000},"1":{"a":130000,"b":-1},"2":{"a":66000,"b":-1},"3":{"a":96000,"b":-1},"4":{"a":150000,"b":-1},"5":{"a":190000,"b":-1}},"/items/bamboo_robe_top":{"0":{"a":28500,"b":25000},"1":{"a":38000,"b":-1},"2":{"a":49000,"b":-1},"3":{"a":84000,"b":-1},"4":{"a":110000,"b":-1},"5":{"a":180000,"b":-1}},"/items/bear_essence":{"0":{"a":130,"b":125}},"/items/beast_boots":{"0":{"a":31000,"b":30000},"1":{"a":50000,"b":-1},"3":{"a":105000,"b":-1},"4":{"a":165000,"b":-1},"5":{"a":200000,"b":-1},"6":{"a":600000,"b":300000}},"/items/beast_bracers":{"0":{"a":45000,"b":35000},"1":{"a":210000,"b":-1},"2":{"a":100000,"b":-1},"3":{"a":110000,"b":-1},"4":{"a":155000,"b":-1},"5":{"a":500000,"b":-1}},"/items/beast_chaps":{"0":{"a":84000,"b":80000},"3":{"a":190000,"b":-1}},"/items/beast_hide":{"0":{"a":21,"b":20}},"/items/beast_hood":{"0":{"a":72000,"b":66000},"1":{"a":80000,"b":-1},"2":{"a":98000,"b":-1},"3":{"a":110000,"b":-1},"4":{"a":185000,"b":-1},"5":{"a":265000,"b":76000}},"/items/beast_leather":{"0":{"a":660,"b":640}},"/items/beast_tunic":{"0":{"a":98000,"b":96000},"1":{"a":115000,"b":-1},"2":{"a":130000,"b":-1},"3":{"a":155000,"b":-1},"5":{"a":420000,"b":-1}},"/items/berserk":{"0":{"a":175000,"b":170000}},"/items/birch_bow":{"0":{"a":16000,"b":14500},"1":{"a":28500,"b":-1},"3":{"a":74000,"b":-1},"4":{"a":200000,"b":-1},"6":{"a":520000,"b":-1},"7":{"a":900000,"b":-1}},"/items/birch_crossbow":{"0":{"a":13000,"b":11500},"1":{"a":205000,"b":-1},"4":{"a":820000,"b":-1}},"/items/birch_fire_staff":{"0":{"a":12000,"b":9600},"2":{"a":19500,"b":-1},"3":{"a":120000,"b":-1},"4":{"a":100000,"b":-1},"5":{"a":150000,"b":-1}},"/items/birch_log":{"0":{"a":46,"b":45}},"/items/birch_lumber":{"0":{"a":330,"b":320}},"/items/birch_nature_staff":{"0":{"a":14000,"b":12500},"1":{"a":22000,"b":-1},"2":{"a":42000,"b":-1},"4":{"a":125000,"b":-1},"5":{"a":120000,"b":-1}},"/items/birch_shield":{"0":{"a":6800,"b":2450},"2":{"a":48000,"b":-1},"3":{"a":62000,"b":-1}},"/items/birch_water_staff":{"0":{"a":13000,"b":11000},"1":{"a":44000,"b":-1},"4":{"a":40000,"b":-1},"5":{"a":185000,"b":-1},"8":{"a":-1,"b":960000}},"/items/bishops_codex":{"0":{"a":110000000,"b":105000000},"3":{"a":-1,"b":12500000},"4":{"a":-1,"b":42000000},"5":{"a":115000000,"b":110000000},"6":{"a":125000000,"b":120000000},"7":{"a":140000000,"b":130000000},"8":{"a":185000000,"b":165000000},"9":{"a":-1,"b":225000000},"10":{"a":410000000,"b":390000000},"11":{"a":-1,"b":4100000},"12":{"a":1400000000,"b":-1}},"/items/bishops_scroll":{"0":{"a":11000000,"b":10500000}},"/items/black_bear_fluff":{"0":{"a":86000,"b":84000}},"/items/black_bear_shoes":{"0":{"a":470000,"b":390000},"1":{"a":-1,"b":135000},"2":{"a":600000,"b":165000},"3":{"a":500000,"b":130000},"4":{"a":620000,"b":195000},"5":{"a":680000,"b":540000},"6":{"a":1100000,"b":880000},"7":{"a":2450000,"b":-1},"8":{"a":5000000,"b":-1},"9":{"a":7800000,"b":4400000},"10":{"a":11000000,"b":8600000},"11":{"a":25000000,"b":-1},"12":{"a":50000000,"b":-1},"14":{"a":180000000,"b":-1},"15":{"a":450000000,"b":-1}},"/items/black_tea_leaf":{"0":{"a":17,"b":16}},"/items/blackberry":{"0":{"a":68,"b":66}},"/items/blackberry_cake":{"0":{"a":500,"b":470}},"/items/blackberry_donut":{"0":{"a":370,"b":330}},"/items/blazing_trident":{"0":{"a":400000000,"b":380000000},"3":{"a":-1,"b":100000000},"4":{"a":-1,"b":98000000},"5":{"a":400000000,"b":350000000},"6":{"a":420000000,"b":-1},"7":{"a":450000000,"b":430000000},"8":{"a":520000000,"b":460000000},"9":{"a":620000000,"b":410000000},"10":{"a":800000000,"b":760000000},"11":{"a":1300000000,"b":-1},"12":{"a":2050000000,"b":1700000000}},"/items/blessed_tea":{"0":{"a":1650,"b":1600}},"/items/blooming_trident":{"0":{"a":-1,"b":380000000},"1":{"a":-1,"b":52000000},"5":{"a":440000000,"b":350000000},"6":{"a":460000000,"b":370000000},"7":{"a":480000000,"b":450000000},"8":{"a":560000000,"b":500000000},"10":{"a":860000000,"b":580000000},"12":{"a":2100000000,"b":-1}},"/items/blue_key_fragment":{"0":{"a":620000,"b":600000}},"/items/blueberry":{"0":{"a":41,"b":40}},"/items/blueberry_cake":{"0":{"a":380,"b":320}},"/items/blueberry_donut":{"0":{"a":370,"b":310}},"/items/branch_of_insight":{"0":{"a":13000000,"b":12500000}},"/items/brewers_bottoms":{"0":{"a":200000000,"b":30000000},"5":{"a":150000000,"b":140000000},"6":{"a":155000000,"b":-1},"7":{"a":160000000,"b":-1},"8":{"a":195000000,"b":-1},"10":{"a":420000000,"b":-1}},"/items/brewers_top":{"0":{"a":-1,"b":30000000},"5":{"a":140000000,"b":130000000},"6":{"a":145000000,"b":-1},"7":{"a":165000000,"b":-1},"10":{"a":450000000,"b":-1}},"/items/brewing_essence":{"0":{"a":180,"b":175}},"/items/brewing_tea":{"0":{"a":400,"b":380}},"/items/brown_key_fragment":{"0":{"a":1150000,"b":1100000}},"/items/burble_alembic":{"0":{"a":46000,"b":38000},"1":{"a":66000,"b":-1},"2":{"a":96000,"b":-1},"3":{"a":150000,"b":-1},"4":{"a":390000,"b":-1},"5":{"a":300000,"b":-1}},"/items/burble_boots":{"0":{"a":31000,"b":24000},"1":{"a":37000,"b":-1},"2":{"a":72000,"b":-1},"3":{"a":88000,"b":-1},"5":{"a":460000,"b":-1},"6":{"a":620000,"b":-1},"7":{"a":1400000,"b":-1}},"/items/burble_brush":{"0":{"a":40000,"b":39000},"1":{"a":62000,"b":-1},"2":{"a":110000,"b":-1},"3":{"a":2000000,"b":-1},"4":{"a":480000,"b":-1},"5":{"a":640000,"b":-1},"6":{"a":640000,"b":-1},"8":{"a":10000000,"b":-1}},"/items/burble_buckler":{"0":{"a":41000,"b":32000},"2":{"a":5000,"b":-1},"5":{"a":600000,"b":-1}},"/items/burble_bulwark":{"0":{"a":43000,"b":35000},"2":{"a":60000,"b":-1},"3":{"a":180000,"b":-1}},"/items/burble_cheese":{"0":{"a":470,"b":460}},"/items/burble_chisel":{"0":{"a":40000,"b":38000},"1":{"a":76000,"b":-1},"2":{"a":135000,"b":-1},"3":{"a":250000,"b":-1},"4":{"a":320000,"b":-1}},"/items/burble_enhancer":{"0":{"a":50000,"b":39000},"1":{"a":46000,"b":-1},"2":{"a":50000,"b":-1},"3":{"a":58000,"b":-1},"4":{"a":96000,"b":-1},"5":{"a":150000,"b":-1},"8":{"a":1250000,"b":-1}},"/items/burble_gauntlets":{"0":{"a":28000,"b":25000},"1":{"a":60000,"b":-1},"4":{"a":360000,"b":-1},"6":{"a":1400000,"b":-1}},"/items/burble_hammer":{"0":{"a":43000,"b":36000},"1":{"a":66000,"b":-1},"2":{"a":205000,"b":-1},"3":{"a":150000,"b":-1},"4":{"a":320000,"b":-1},"5":{"a":290000,"b":-1},"6":{"a":480000,"b":-1},"10":{"a":2500000,"b":-1}},"/items/burble_hatchet":{"0":{"a":42000,"b":36000},"1":{"a":62000,"b":-1},"2":{"a":280000,"b":-1},"4":{"a":500000,"b":-1},"5":{"a":520000,"b":-1},"6":{"a":640000,"b":-1}},"/items/burble_helmet":{"0":{"a":35000,"b":31000},"1":{"a":39000,"b":-1},"2":{"a":86000,"b":-1},"4":{"a":135000,"b":-1},"5":{"a":620000,"b":320000},"6":{"a":1500000,"b":-1}},"/items/burble_mace":{"0":{"a":46000,"b":39000},"1":{"a":70000,"b":-1},"2":{"a":84000,"b":-1},"3":{"a":160000,"b":-1},"5":{"a":8000000,"b":-1}},"/items/burble_milk":{"0":{"a":150,"b":145}},"/items/burble_needle":{"0":{"a":50000,"b":38000},"4":{"a":200000,"b":-1},"6":{"a":500000,"b":-1}},"/items/burble_plate_body":{"0":{"a":50000,"b":42000},"1":{"a":66000,"b":-1},"2":{"a":78000,"b":-1},"3":{"a":98000,"b":-1},"4":{"a":130000,"b":-1},"5":{"a":200000,"b":-1}},"/items/burble_plate_legs":{"0":{"a":49000,"b":43000},"1":{"a":68000,"b":-1},"3":{"a":300000,"b":-1},"5":{"a":180000,"b":-1}},"/items/burble_pot":{"0":{"a":44000,"b":37000},"1":{"a":100000,"b":-1},"2":{"a":145000,"b":-1},"4":{"a":250000,"b":-1}},"/items/burble_shears":{"0":{"a":47000,"b":38000},"1":{"a":68000,"b":-1},"2":{"a":110000,"b":-1},"5":{"a":680000,"b":-1},"6":{"a":580000,"b":-1}},"/items/burble_spatula":{"0":{"a":45000,"b":38000},"1":{"a":110000,"b":-1},"2":{"a":100000,"b":-1},"3":{"a":175000,"b":-1},"4":{"a":160000,"b":-1},"5":{"a":295000,"b":200000}},"/items/burble_spear":{"0":{"a":52000,"b":44000},"1":{"a":60000,"b":-1},"2":{"a":90000,"b":-1},"3":{"a":125000,"b":-1}},"/items/burble_sword":{"0":{"a":62000,"b":56000},"1":{"a":62000,"b":18500},"2":{"a":58000,"b":-1},"3":{"a":90000,"b":-1},"4":{"a":110000,"b":-1},"5":{"a":155000,"b":-1},"10":{"a":3600000,"b":-1}},"/items/burble_tea_leaf":{"0":{"a":31,"b":28}},"/items/burning_key_fragment":{"0":{"a":2600000,"b":2550000}},"/items/butter_of_proficiency":{"0":{"a":10500000,"b":10000000}},"/items/catalyst_of_coinification":{"0":{"a":2900,"b":2850}},"/items/catalyst_of_decomposition":{"0":{"a":3200,"b":3100}},"/items/catalyst_of_transmutation":{"0":{"a":6800,"b":6600}},"/items/catalytic_tea":{"0":{"a":1650,"b":1600}},"/items/cedar_bow":{"0":{"a":34000,"b":31000},"1":{"a":40000,"b":-1},"5":{"a":88000,"b":-1}},"/items/cedar_crossbow":{"0":{"a":32000,"b":29000},"1":{"a":34000,"b":-1},"2":{"a":45000,"b":-1},"3":{"a":49000,"b":-1},"4":{"a":74000,"b":-1},"5":{"a":90000,"b":-1},"6":{"a":110000,"b":-1}},"/items/cedar_fire_staff":{"0":{"a":33000,"b":28500},"1":{"a":35000,"b":-1},"2":{"a":34000,"b":-1},"3":{"a":60000,"b":-1},"4":{"a":98000,"b":-1},"5":{"a":130000,"b":-1},"6":{"a":4000000,"b":-1},"7":{"a":700000,"b":-1},"8":{"a":1450000,"b":-1},"10":{"a":10000000,"b":-1}},"/items/cedar_log":{"0":{"a":64,"b":62}},"/items/cedar_lumber":{"0":{"a":470,"b":460}},"/items/cedar_nature_staff":{"0":{"a":34000,"b":29000},"2":{"a":88000,"b":-1},"3":{"a":94000,"b":-1},"4":{"a":110000,"b":-1},"5":{"a":185000,"b":-1}},"/items/cedar_shield":{"0":{"a":22500,"b":17500},"2":{"a":880000,"b":-1},"3":{"a":100000,"b":-1},"4":{"a":68000,"b":-1},"5":{"a":72000,"b":-1},"6":{"a":105000,"b":-1}},"/items/cedar_water_staff":{"0":{"a":30000,"b":29500},"1":{"a":56000,"b":-1},"3":{"a":66000,"b":-1},"4":{"a":140000,"b":-1},"5":{"a":90000,"b":-1},"8":{"a":2500000,"b":-1}},"/items/celestial_alembic":{"0":{"a":-1,"b":20000000},"5":{"a":-1,"b":24000000},"7":{"a":-1,"b":220000000},"20":{"a":-1,"b":5000000}},"/items/celestial_brush":{"0":{"a":500000000,"b":225000000},"5":{"a":275000000,"b":250000000},"7":{"a":290000000,"b":-1},"10":{"a":720000000,"b":500000000},"11":{"a":900000000,"b":-1}},"/items/celestial_chisel":{"0":{"a":-1,"b":210000000},"2":{"a":-1,"b":6800000},"7":{"a":320000000,"b":-1}},"/items/celestial_enhancer":{"0":{"a":-1,"b":135000000},"12":{"a":-1,"b":2000000000}},"/items/celestial_hammer":{"0":{"a":-1,"b":240000000},"7":{"a":320000000,"b":-1}},"/items/celestial_hatchet":{"0":{"a":250000000,"b":170000000},"5":{"a":-1,"b":190000000},"7":{"a":310000000,"b":280000000},"14":{"a":-1,"b":4200000000},"20":{"a":-1,"b":5000000}},"/items/celestial_needle":{"0":{"a":-1,"b":220000000},"5":{"a":275000000,"b":-1},"7":{"a":310000000,"b":230000000}},"/items/celestial_pot":{"0":{"a":-1,"b":74000000},"5":{"a":275000000,"b":-1},"8":{"a":350000000,"b":235000000},"10":{"a":-1,"b":200000000},"20":{"a":-1,"b":10000000}},"/items/celestial_shears":{"0":{"a":-1,"b":105000000},"1":{"a":-1,"b":50000000},"2":{"a":-1,"b":39000000},"3":{"a":-1,"b":9400000},"4":{"a":-1,"b":10000000},"5":{"a":275000000,"b":150000000},"7":{"a":290000000,"b":200000000},"10":{"a":-1,"b":500000000}},"/items/celestial_spatula":{"0":{"a":-1,"b":180000000},"7":{"a":320000000,"b":-1},"10":{"a":-1,"b":600000000},"20":{"a":-1,"b":8800000}},"/items/centaur_boots":{"0":{"a":980000,"b":840000},"1":{"a":960000,"b":820000},"2":{"a":980000,"b":420000},"3":{"a":920000,"b":580000},"4":{"a":960000,"b":-1},"5":{"a":900000,"b":660000},"6":{"a":1050000,"b":-1},"7":{"a":1900000,"b":1000000},"8":{"a":4100000,"b":1050000},"9":{"a":9200000,"b":6000000},"10":{"a":13500000,"b":12500000},"11":{"a":-1,"b":21000000},"12":{"a":68000000,"b":4500000},"14":{"a":-1,"b":160000000},"15":{"a":-1,"b":400000000}},"/items/centaur_hoof":{"0":{"a":175000,"b":170000}},"/items/channeling_coffee":{"0":{"a":1850,"b":1800}},"/items/chaotic_chain":{"0":{"a":14500000,"b":14000000}},"/items/chaotic_flail":{"0":{"a":310000000,"b":285000000},"1":{"a":-1,"b":100000000},"5":{"a":300000000,"b":290000000},"6":{"a":330000000,"b":295000000},"7":{"a":340000000,"b":330000000},"8":{"a":380000000,"b":370000000},"10":{"a":620000000,"b":520000000},"12":{"a":1800000000,"b":1500000000}},"/items/cheese":{"0":{"a":255,"b":245}},"/items/cheese_alembic":{"0":{"a":3500,"b":3200},"1":{"a":2500000,"b":-1},"2":{"a":110000,"b":-1}},"/items/cheese_boots":{"0":{"a":2200,"b":2150},"1":{"a":20000,"b":-1},"3":{"a":-1,"b":4200},"4":{"a":-1,"b":8000},"5":{"a":700000,"b":-1},"6":{"a":2000000,"b":8200},"7":{"a":-1,"b":8000},"8":{"a":400000,"b":-1},"9":{"a":-1,"b":280000},"10":{"a":940000,"b":800000},"11":{"a":-1,"b":1600000},"12":{"a":3700000,"b":3000000},"13":{"a":7200000,"b":5600000},"15":{"a":-1,"b":11500}},"/items/cheese_brush":{"0":{"a":2900,"b":2400},"1":{"a":7400,"b":500},"2":{"a":64000,"b":1000},"3":{"a":60000,"b":-1},"5":{"a":105000,"b":-1}},"/items/cheese_buckler":{"0":{"a":2450,"b":2200},"1":{"a":2000000,"b":2800},"2":{"a":64000,"b":3500},"3":{"a":100000,"b":98},"4":{"a":190000,"b":98},"5":{"a":5000000,"b":-1},"9":{"a":-1,"b":360000},"10":{"a":5000000000,"b":-1}},"/items/cheese_bulwark":{"0":{"a":5000,"b":4000},"1":{"a":500000,"b":3000},"2":{"a":9800000,"b":-1},"3":{"a":-1,"b":1000},"5":{"a":5000000,"b":-1},"6":{"a":1000000,"b":-1}},"/items/cheese_chisel":{"0":{"a":3400,"b":3300},"1":{"a":-1,"b":500}},"/items/cheese_enhancer":{"0":{"a":3800,"b":2400},"1":{"a":1400000,"b":200},"5":{"a":60000,"b":120},"8":{"a":110000,"b":-1},"10":{"a":1000000,"b":-1}},"/items/cheese_gauntlets":{"0":{"a":2150,"b":2100},"1":{"a":4900,"b":-1},"2":{"a":500000,"b":-1},"3":{"a":1000000,"b":-1},"4":{"a":700000,"b":-1},"6":{"a":4000000,"b":8600},"9":{"a":-1,"b":290000}},"/items/cheese_hammer":{"0":{"a":3200,"b":2750},"1":{"a":70000,"b":-1},"2":{"a":28000000,"b":-1},"5":{"a":105000,"b":-1},"6":{"a":56000,"b":-1}},"/items/cheese_hatchet":{"0":{"a":3400,"b":3200},"1":{"a":5000,"b":-1},"2":{"a":145000,"b":-1},"3":{"a":180000,"b":-1},"4":{"a":250000,"b":-1},"5":{"a":80000000,"b":-1}},"/items/cheese_helmet":{"0":{"a":2750,"b":2300},"1":{"a":2950,"b":-1},"4":{"a":9800000,"b":80},"5":{"a":80000,"b":-1},"9":{"a":-1,"b":360000}},"/items/cheese_mace":{"0":{"a":4600,"b":2650},"1":{"a":-1,"b":500},"2":{"a":47000,"b":-1}},"/items/cheese_needle":{"0":{"a":3600,"b":3300},"1":{"a":9000000,"b":-1}},"/items/cheese_plate_body":{"0":{"a":4100,"b":2500},"1":{"a":36000,"b":295},"2":{"a":-1,"b":420},"3":{"a":-1,"b":470}},"/items/cheese_plate_legs":{"0":{"a":3800,"b":3000},"2":{"a":70000,"b":-1},"5":{"a":145000,"b":-1},"10":{"a":1000000,"b":-1}},"/items/cheese_pot":{"0":{"a":3900,"b":3100},"1":{"a":98000,"b":-1},"2":{"a":100000,"b":-1},"6":{"a":220000,"b":-1}},"/items/cheese_shears":{"0":{"a":3700,"b":3200},"1":{"a":120000,"b":-1},"2":{"a":10000,"b":-1},"3":{"a":40000,"b":-1},"4":{"a":100000,"b":-1},"5":{"a":1700000,"b":-1},"20":{"a":-1,"b":3300}},"/items/cheese_spatula":{"0":{"a":3700,"b":2100},"3":{"a":5000000,"b":-1},"20":{"a":-1,"b":1900}},"/items/cheese_spear":{"0":{"a":4400,"b":4000},"1":{"a":500000,"b":500},"2":{"a":14500,"b":-1},"5":{"a":76000,"b":-1}},"/items/cheese_sword":{"0":{"a":4400,"b":4300},"1":{"a":10000,"b":2250},"2":{"a":14500,"b":420},"3":{"a":27000,"b":410},"4":{"a":49000,"b":1000},"5":{"a":-1,"b":4500},"8":{"a":-1,"b":36000},"10":{"a":1000000,"b":-1},"20":{"a":-1,"b":1000000}},"/items/cheesemakers_bottoms":{"0":{"a":-1,"b":64000000},"5":{"a":155000000,"b":-1},"7":{"a":-1,"b":130000000}},"/items/cheesemakers_top":{"0":{"a":-1,"b":98000000},"5":{"a":145000000,"b":-1}},"/items/cheesesmithing_essence":{"0":{"a":245,"b":240}},"/items/cheesesmithing_tea":{"0":{"a":620,"b":580}},"/items/chefs_bottoms":{"0":{"a":-1,"b":120000000},"5":{"a":155000000,"b":150000000},"6":{"a":160000000,"b":-1},"7":{"a":175000000,"b":125000000},"8":{"a":205000000,"b":-1},"10":{"a":-1,"b":280000000}},"/items/chefs_top":{"0":{"a":200000000,"b":72000000},"5":{"a":140000000,"b":20000000},"6":{"a":145000000,"b":130000000},"7":{"a":165000000,"b":3600000},"8":{"a":-1,"b":120000000},"10":{"a":-1,"b":250000000}},"/items/chimerical_chest_key":{"0":{"a":2950000,"b":2900000}},"/items/chimerical_entry_key":{"0":{"a":280000,"b":275000}},"/items/chimerical_essence":{"0":{"a":600,"b":580}},"/items/chrono_gloves":{"0":{"a":10500000,"b":9800000},"5":{"a":11500000,"b":11000000},"6":{"a":15500000,"b":11500000},"7":{"a":16500000,"b":15000000},"8":{"a":26000000,"b":23000000},"10":{"a":66000000,"b":62000000},"12":{"a":265000000,"b":230000000},"14":{"a":1200000000,"b":900000000},"15":{"a":-1,"b":1700000000}},"/items/chrono_sphere":{"0":{"a":1100000,"b":1050000}},"/items/cleave":{"0":{"a":29000,"b":28000}},"/items/cocoon":{"0":{"a":175,"b":170}},"/items/collectors_boots":{"0":{"a":3800000,"b":3600000},"2":{"a":-1,"b":2450000},"3":{"a":4600000,"b":3200000},"4":{"a":-1,"b":3900000},"5":{"a":4700000,"b":4600000},"6":{"a":8400000,"b":5000000},"7":{"a":9000000,"b":6800000},"8":{"a":14500000,"b":11500000},"9":{"a":25000000,"b":13000000},"10":{"a":38000000,"b":34000000},"12":{"a":140000000,"b":96000000},"15":{"a":-1,"b":50000000},"20":{"a":-1,"b":15500000}},"/items/colossus_core":{"0":{"a":1150000,"b":1100000}},"/items/colossus_plate_body":{"0":{"a":12500000,"b":9200000},"5":{"a":14000000,"b":13000000},"6":{"a":30000000,"b":9000000},"7":{"a":28000000,"b":10000000},"8":{"a":46000000,"b":17000000},"9":{"a":66000000,"b":-1},"10":{"a":64000000,"b":40000000},"12":{"a":205000000,"b":20500000}},"/items/colossus_plate_legs":{"0":{"a":11000000,"b":8200000},"5":{"a":11000000,"b":10500000},"6":{"a":15000000,"b":7200000},"7":{"a":24000000,"b":12000000},"10":{"a":66000000,"b":43000000},"12":{"a":205000000,"b":-1}},"/items/cooking_essence":{"0":{"a":190,"b":185}},"/items/cooking_tea":{"0":{"a":490,"b":470}},"/items/corsair_crest":{"0":{"a":11500000,"b":11000000}},"/items/corsair_helmet":{"0":{"a":125000000,"b":110000000},"2":{"a":-1,"b":3500000},"5":{"a":120000000,"b":115000000},"6":{"a":130000000,"b":125000000},"7":{"a":140000000,"b":130000000},"8":{"a":175000000,"b":-1},"10":{"a":420000000,"b":3900000},"12":{"a":-1,"b":3800000}},"/items/cotton":{"0":{"a":46,"b":45}},"/items/cotton_boots":{"0":{"a":2250,"b":2150},"1":{"a":5400,"b":-1},"2":{"a":24500,"b":-1},"3":{"a":-1,"b":4200},"4":{"a":-1,"b":7600},"5":{"a":400000,"b":-1},"10":{"a":1000000,"b":-1}},"/items/cotton_fabric":{"0":{"a":260,"b":255}},"/items/cotton_gloves":{"0":{"a":2300,"b":2250},"1":{"a":4300,"b":66},"2":{"a":16000,"b":-1},"3":{"a":47000,"b":-1},"4":{"a":8000000,"b":-1},"5":{"a":9800000,"b":-1},"8":{"a":-1,"b":260000},"11":{"a":1500000,"b":-1},"12":{"a":-1,"b":3000000}},"/items/cotton_hat":{"0":{"a":2600,"b":2200},"1":{"a":11500,"b":155},"2":{"a":48000,"b":410},"3":{"a":70000,"b":450},"5":{"a":150000,"b":-1},"8":{"a":-1,"b":340000}},"/items/cotton_robe_bottoms":{"0":{"a":3300,"b":3100},"1":{"a":14500,"b":-1},"2":{"a":98000,"b":-1},"3":{"a":420000,"b":-1},"5":{"a":800000,"b":-1}},"/items/cotton_robe_top":{"0":{"a":2750,"b":2500},"1":{"a":18000,"b":130},"2":{"a":27500,"b":-1},"3":{"a":76000,"b":-1},"5":{"a":68000,"b":-1}},"/items/crab_pincer":{"0":{"a":7600,"b":7400}},"/items/crafters_bottoms":{"0":{"a":-1,"b":36000000},"5":{"a":155000000,"b":-1},"7":{"a":175000000,"b":-1}},"/items/crafters_top":{"0":{"a":-1,"b":70000000},"5":{"a":140000000,"b":120000000},"8":{"a":195000000,"b":-1}},"/items/crafting_essence":{"0":{"a":240,"b":235}},"/items/crafting_tea":{"0":{"a":540,"b":500}},"/items/crimson_alembic":{"0":{"a":76000,"b":70000},"1":{"a":98000,"b":-1},"2":{"a":105000,"b":-1},"3":{"a":155000,"b":-1},"5":{"a":380000,"b":52000}},"/items/crimson_boots":{"0":{"a":32000,"b":26500},"1":{"a":45000,"b":-1},"2":{"a":52000,"b":-1},"3":{"a":110000,"b":-1},"4":{"a":195000,"b":-1},"5":{"a":330000,"b":-1}},"/items/crimson_brush":{"0":{"a":70000,"b":64000},"1":{"a":94000,"b":52000},"2":{"a":120000,"b":18000},"3":{"a":140000,"b":-1},"4":{"a":700000,"b":-1},"5":{"a":1100000,"b":300000},"6":{"a":-1,"b":250000}},"/items/crimson_buckler":{"0":{"a":78000,"b":66000},"1":{"a":74000,"b":-1},"3":{"a":245000,"b":-1},"4":{"a":290000,"b":-1},"5":{"a":600000,"b":-1},"7":{"a":10000000,"b":-1}},"/items/crimson_bulwark":{"0":{"a":84000,"b":72000},"2":{"a":100000,"b":-1},"3":{"a":180000,"b":-1},"5":{"a":290000,"b":-1}},"/items/crimson_cheese":{"0":{"a":520,"b":490}},"/items/crimson_chisel":{"0":{"a":64000,"b":62000},"1":{"a":96000,"b":11500},"2":{"a":160000,"b":11500},"3":{"a":500000,"b":-1},"5":{"a":400000,"b":-1}},"/items/crimson_enhancer":{"0":{"a":78000,"b":74000},"1":{"a":-1,"b":23000},"3":{"a":105000,"b":11500},"4":{"a":160000,"b":11500},"5":{"a":235000,"b":20500},"6":{"a":-1,"b":18500},"7":{"a":-1,"b":13500},"10":{"a":-1,"b":1000000}},"/items/crimson_gauntlets":{"0":{"a":54000,"b":40000},"1":{"a":78000,"b":-1},"2":{"a":84000,"b":-1},"3":{"a":125000,"b":-1},"4":{"a":240000,"b":-1},"5":{"a":275000,"b":-1}},"/items/crimson_hammer":{"0":{"a":64000,"b":62000},"1":{"a":98000,"b":-1},"2":{"a":125000,"b":-1},"3":{"a":150000,"b":-1},"4":{"a":250000,"b":-1},"5":{"a":430000,"b":-1}},"/items/crimson_hatchet":{"0":{"a":74000,"b":58000},"1":{"a":115000,"b":-1},"2":{"a":245000,"b":-1},"5":{"a":640000,"b":-1},"6":{"a":860000,"b":-1}},"/items/crimson_helmet":{"0":{"a":66000,"b":56000},"1":{"a":70000,"b":-1},"2":{"a":84000,"b":-1},"3":{"a":105000,"b":-1},"4":{"a":200000,"b":-1},"5":{"a":220000,"b":-1}},"/items/crimson_mace":{"0":{"a":88000,"b":78000},"1":{"a":115000,"b":-1},"2":{"a":100000,"b":-1},"3":{"a":115000,"b":-1}},"/items/crimson_milk":{"0":{"a":200,"b":195}},"/items/crimson_needle":{"0":{"a":78000,"b":72000},"1":{"a":96000,"b":13000},"2":{"a":120000,"b":60000},"3":{"a":135000,"b":12000},"5":{"a":430000,"b":14000}},"/items/crimson_plate_body":{"0":{"a":90000,"b":78000},"1":{"a":98000,"b":-1},"2":{"a":100000,"b":-1},"5":{"a":430000,"b":100000},"6":{"a":680000,"b":-1}},"/items/crimson_plate_legs":{"0":{"a":90000,"b":68000},"1":{"a":88000,"b":-1},"2":{"a":98000,"b":-1},"4":{"a":195000,"b":-1},"5":{"a":300000,"b":100000}},"/items/crimson_pot":{"0":{"a":74000,"b":68000},"1":{"a":90000,"b":-1},"2":{"a":195000,"b":-1},"3":{"a":200000,"b":-1},"4":{"a":400000,"b":-1},"5":{"a":470000,"b":12000}},"/items/crimson_shears":{"0":{"a":76000,"b":62000},"1":{"a":100000,"b":11000},"2":{"a":100000,"b":-1},"3":{"a":115000,"b":-1},"4":{"a":225000,"b":-1},"5":{"a":560000,"b":-1}},"/items/crimson_spatula":{"0":{"a":74000,"b":72000},"1":{"a":92000,"b":-1},"2":{"a":105000,"b":-1},"3":{"a":220000,"b":11000},"4":{"a":-1,"b":11500},"5":{"a":340000,"b":165000},"6":{"a":900000,"b":-1}},"/items/crimson_spear":{"0":{"a":82000,"b":76000},"4":{"a":280000,"b":-1},"5":{"a":400000,"b":-1}},"/items/crimson_sword":{"0":{"a":90000,"b":80000},"1":{"a":100000,"b":14000},"2":{"a":110000,"b":-1},"3":{"a":125000,"b":-1},"4":{"a":150000,"b":-1},"5":{"a":190000,"b":50000},"7":{"a":760000,"b":-1},"8":{"a":1200000,"b":-1}},"/items/crippling_slash":{"0":{"a":62000,"b":60000}},"/items/critical_aura":{"0":{"a":3400000,"b":3300000}},"/items/critical_coffee":{"0":{"a":2300,"b":2250}},"/items/crushed_amber":{"0":{"a":1550,"b":1500}},"/items/crushed_amethyst":{"0":{"a":2500,"b":2450}},"/items/crushed_garnet":{"0":{"a":2400,"b":2350}},"/items/crushed_jade":{"0":{"a":2500,"b":2450}},"/items/crushed_moonstone":{"0":{"a":2800,"b":2700}},"/items/crushed_pearl":{"0":{"a":900,"b":880}},"/items/crushed_philosophers_stone":{"0":{"a":2250000,"b":2200000}},"/items/crushed_sunstone":{"0":{"a":8600,"b":8400}},"/items/cupcake":{"0":{"a":285,"b":255}},"/items/cursed_ball":{"0":{"a":8000000,"b":7800000}},"/items/cursed_bow":{"0":{"a":185000000,"b":160000000},"7":{"a":255000000,"b":135000000},"8":{"a":-1,"b":260000000},"10":{"a":580000000,"b":-1}},"/items/dairyhands_bottoms":{"0":{"a":-1,"b":115000000},"5":{"a":150000000,"b":-1},"6":{"a":155000000,"b":62000000},"8":{"a":-1,"b":165000000},"10":{"a":420000000,"b":-1}},"/items/dairyhands_top":{"0":{"a":-1,"b":46000000},"1":{"a":-1,"b":10000000},"5":{"a":140000000,"b":130000000},"6":{"a":145000000,"b":9600000},"8":{"a":195000000,"b":-1},"10":{"a":380000000,"b":220000000}},"/items/damaged_anchor":{"0":{"a":12500000,"b":12000000}},"/items/dark_key_fragment":{"0":{"a":2100000,"b":2050000}},"/items/defense_coffee":{"0":{"a":400,"b":340}},"/items/demonic_core":{"0":{"a":1150000,"b":1100000}},"/items/demonic_plate_body":{"0":{"a":11000000,"b":8600000},"1":{"a":58000000,"b":-1},"5":{"a":14000000,"b":12500000},"6":{"a":20000000,"b":12500000},"7":{"a":31000000,"b":-1},"8":{"a":50000000,"b":-1},"10":{"a":72000000,"b":50000000},"12":{"a":180000000,"b":-1}},"/items/demonic_plate_legs":{"0":{"a":10500000,"b":8400000},"5":{"a":11500000,"b":10500000},"6":{"a":16000000,"b":13500000},"7":{"a":20500000,"b":11000000},"8":{"a":33000000,"b":-1},"9":{"a":47000000,"b":-1},"10":{"a":60000000,"b":45000000},"12":{"a":150000000,"b":66000000},"13":{"a":200000000,"b":19500000}},"/items/dodocamel_gauntlets":{"0":{"a":54000000,"b":52000000},"3":{"a":54000000,"b":3900000},"4":{"a":-1,"b":31000000},"5":{"a":56000000,"b":54000000},"6":{"a":-1,"b":40000000},"7":{"a":70000000,"b":66000000},"8":{"a":100000000,"b":3200000},"10":{"a":260000000,"b":235000000},"12":{"a":-1,"b":3300000}},"/items/dodocamel_plume":{"0":{"a":8200000,"b":8000000}},"/items/donut":{"0":{"a":150,"b":130}},"/items/dragon_fruit":{"0":{"a":220,"b":215}},"/items/dragon_fruit_gummy":{"0":{"a":680,"b":660}},"/items/dragon_fruit_yogurt":{"0":{"a":860,"b":840}},"/items/earrings_of_armor":{"0":{"a":7200000,"b":6800000},"1":{"a":-1,"b":7000000},"5":{"a":66000000,"b":-1}},"/items/earrings_of_critical_strike":{"0":{"a":9200000,"b":9000000},"1":{"a":11000000,"b":700000},"2":{"a":15000000,"b":13500000},"3":{"a":23000000,"b":15000000},"4":{"a":45000000,"b":29000000},"5":{"a":86000000,"b":60000000}},"/items/earrings_of_essence_find":{"0":{"a":7800000,"b":7200000},"3":{"a":28500000,"b":-1},"5":{"a":74000000,"b":74000}},"/items/earrings_of_gathering":{"0":{"a":7600000,"b":6600000},"1":{"a":12500000,"b":8800000},"3":{"a":50000000,"b":18000000},"4":{"a":-1,"b":25000000}},"/items/earrings_of_rare_find":{"0":{"a":8000000,"b":7600000},"1":{"a":-1,"b":7800000},"2":{"a":14000000,"b":11000000},"3":{"a":22000000,"b":18000000},"4":{"a":-1,"b":26000000},"5":{"a":82000000,"b":41000000}},"/items/earrings_of_regeneration":{"0":{"a":7800000,"b":7400000},"1":{"a":11500000,"b":8000000},"2":{"a":13000000,"b":10000000},"3":{"a":21000000,"b":20000000},"4":{"a":38000000,"b":35000000},"5":{"a":72000000,"b":70000000},"6":{"a":130000000,"b":100000000},"7":{"a":165000000,"b":160000000},"8":{"a":290000000,"b":180000000}},"/items/earrings_of_resistance":{"0":{"a":7200000,"b":6800000}},"/items/efficiency_tea":{"0":{"a":1000,"b":960}},"/items/egg":{"0":{"a":30,"b":28}},"/items/elemental_affinity":{"0":{"a":230000,"b":225000}},"/items/elusiveness":{"0":{"a":44000,"b":43000}},"/items/emp_tea_leaf":{"0":{"a":350,"b":340}},"/items/enchanted_chest_key":{"0":{"a":6600000,"b":6400000}},"/items/enchanted_entry_key":{"0":{"a":480000,"b":460000}},"/items/enchanted_essence":{"0":{"a":1700,"b":1650}},"/items/enchanted_gloves":{"0":{"a":10500000,"b":10000000},"5":{"a":12500000,"b":11500000},"6":{"a":16000000,"b":12500000},"7":{"a":24000000,"b":-1},"8":{"a":33000000,"b":-1},"9":{"a":50000000,"b":-1},"10":{"a":82000000,"b":66000000},"12":{"a":-1,"b":245000000},"13":{"a":1000000000,"b":-1}},"/items/enhancers_bottoms":{"0":{"a":-1,"b":58000000}},"/items/enhancers_top":{"0":{"a":-1,"b":58000000},"5":{"a":215000000,"b":160000000}},"/items/enhancing_essence":{"0":{"a":840,"b":820}},"/items/enhancing_tea":{"0":{"a":1150,"b":980}},"/items/entangle":{"0":{"a":15000,"b":14500}},"/items/excelsa_coffee_bean":{"0":{"a":520,"b":500}},"/items/eye_of_the_watcher":{"0":{"a":410000,"b":390000}},"/items/eye_watch":{"0":{"a":4200000,"b":4000000},"1":{"a":5400000,"b":2650000},"2":{"a":4800000,"b":2900000},"3":{"a":-1,"b":2850000},"4":{"a":4900000,"b":3500000},"5":{"a":5200000,"b":5000000},"6":{"a":8400000,"b":6000000},"7":{"a":10500000,"b":8400000},"8":{"a":16500000,"b":9800000},"9":{"a":27000000,"b":2900000},"10":{"a":45000000,"b":32000000},"11":{"a":-1,"b":50000000},"12":{"a":-1,"b":60000000}},"/items/eyessence":{"0":{"a":76,"b":74}},"/items/fierce_aura":{"0":{"a":6600000,"b":6200000}},"/items/fieriosa_coffee_bean":{"0":{"a":450,"b":440}},"/items/fighter_necklace":{"0":{"a":13000000,"b":11500000},"1":{"a":19500000,"b":-1},"2":{"a":-1,"b":19000000},"5":{"a":70000000,"b":190000}},"/items/fireball":{"0":{"a":9600,"b":9400}},"/items/firestorm":{"0":{"a":280000,"b":275000}},"/items/flame_arrow":{"0":{"a":28500,"b":28000}},"/items/flame_aura":{"0":{"a":2300000,"b":2200000}},"/items/flame_blast":{"0":{"a":50000,"b":49000}},"/items/flaming_cloth":{"0":{"a":62000,"b":60000}},"/items/flaming_robe_bottoms":{"0":{"a":250000,"b":240000},"1":{"a":270000,"b":-1},"2":{"a":255000,"b":-1},"3":{"a":280000,"b":-1},"4":{"a":340000,"b":-1},"5":{"a":400000,"b":-1},"6":{"a":1000000,"b":-1},"7":{"a":2000000,"b":1250000},"8":{"a":2750000,"b":2300000},"9":{"a":7000000,"b":-1},"10":{"a":7800000,"b":7600000},"12":{"a":22000000,"b":-1}},"/items/flaming_robe_top":{"0":{"a":350000,"b":300000},"1":{"a":340000,"b":-1},"2":{"a":390000,"b":-1},"3":{"a":390000,"b":-1},"4":{"a":480000,"b":-1},"5":{"a":500000,"b":240000},"6":{"a":980000,"b":520000},"7":{"a":1750000,"b":1200000},"8":{"a":2850000,"b":2600000},"9":{"a":7400000,"b":-1},"10":{"a":8600000,"b":8000000},"12":{"a":19500000,"b":-1},"13":{"a":90000000,"b":-1}},"/items/flax":{"0":{"a":50,"b":49}},"/items/fluffy_red_hat":{"0":{"a":5800000,"b":5400000},"1":{"a":-1,"b":5200000},"2":{"a":-1,"b":5000000},"3":{"a":-1,"b":5600000},"4":{"a":-1,"b":5800000},"5":{"a":6800000,"b":6400000},"6":{"a":9800000,"b":7000000},"7":{"a":13000000,"b":10000000},"8":{"a":20000000,"b":13000000},"9":{"a":35000000,"b":-1},"10":{"a":48000000,"b":-1},"11":{"a":-1,"b":300000},"12":{"a":92000000,"b":50000000},"13":{"a":200000000,"b":68000000}},"/items/foragers_bottoms":{"0":{"a":200000000,"b":18500000},"5":{"a":150000000,"b":-1},"6":{"a":155000000,"b":10000000},"7":{"a":-1,"b":5800000},"8":{"a":205000000,"b":-1},"10":{"a":420000000,"b":270000000}},"/items/foragers_top":{"0":{"a":-1,"b":100000000},"5":{"a":135000000,"b":130000000},"6":{"a":140000000,"b":5000000},"7":{"a":150000000,"b":62000000},"8":{"a":-1,"b":110000000},"10":{"a":490000000,"b":205000000},"12":{"a":1350000000,"b":24000000}},"/items/foraging_essence":{"0":{"a":175,"b":170}},"/items/foraging_tea":{"0":{"a":430,"b":390}},"/items/fracturing_impact":{"0":{"a":125000,"b":120000}},"/items/frenzy":{"0":{"a":225000,"b":220000}},"/items/frost_sphere":{"0":{"a":620000,"b":600000}},"/items/frost_staff":{"0":{"a":12000000,"b":11500000},"5":{"a":12500000,"b":11000000},"7":{"a":-1,"b":12000000},"8":{"a":-1,"b":20500000},"10":{"a":64000000,"b":58000000},"11":{"a":100000000,"b":10000000},"12":{"a":235000000,"b":400000},"14":{"a":760000000,"b":-1}},"/items/frost_surge":{"0":{"a":480000,"b":470000}},"/items/furious_spear":{"0":{"a":330000000,"b":300000000},"5":{"a":350000000,"b":250000000},"6":{"a":-1,"b":220000000},"7":{"a":370000000,"b":5200000},"8":{"a":410000000,"b":270000000},"9":{"a":540000000,"b":5200000},"10":{"a":700000000,"b":-1},"12":{"a":2050000000,"b":-1}},"/items/garnet":{"0":{"a":40000,"b":39000}},"/items/gathering_tea":{"0":{"a":420,"b":390}},"/items/gator_vest":{"0":{"a":18000,"b":17500},"1":{"a":18500,"b":17500},"2":{"a":19000,"b":17500},"3":{"a":20000,"b":17500},"4":{"a":22000,"b":17500},"5":{"a":40000,"b":25500},"6":{"a":56000,"b":46000},"7":{"a":115000,"b":90000},"8":{"a":260000,"b":165000},"9":{"a":480000,"b":340000},"10":{"a":820000,"b":760000},"11":{"a":1900000,"b":-1},"12":{"a":10000000,"b":-1},"13":{"a":23500000,"b":-1},"14":{"a":49000000,"b":-1},"15":{"a":100000000,"b":-1},"20":{"a":-1,"b":20500}},"/items/giant_pouch":{"0":{"a":6400000,"b":5800000},"1":{"a":23000000,"b":4300000},"2":{"a":-1,"b":1200000},"3":{"a":7800000,"b":6200000},"4":{"a":9200000,"b":5200000},"5":{"a":11000000,"b":9800000},"6":{"a":20000000,"b":15000000},"9":{"a":-1,"b":45000000},"10":{"a":-1,"b":60000000}},"/items/ginkgo_bow":{"0":{"a":120000,"b":115000},"1":{"a":120000,"b":-1},"2":{"a":120000,"b":-1},"3":{"a":190000,"b":-1}},"/items/ginkgo_crossbow":{"0":{"a":105000,"b":98000},"1":{"a":105000,"b":-1},"3":{"a":190000,"b":-1},"4":{"a":135000,"b":-1},"5":{"a":265000,"b":100000}},"/items/ginkgo_fire_staff":{"0":{"a":105000,"b":92000},"1":{"a":105000,"b":-1},"2":{"a":110000,"b":-1},"3":{"a":115000,"b":-1},"4":{"a":195000,"b":-1},"5":{"a":265000,"b":120000},"6":{"a":800000,"b":-1}},"/items/ginkgo_log":{"0":{"a":31,"b":29}},"/items/ginkgo_lumber":{"0":{"a":560,"b":520}},"/items/ginkgo_nature_staff":{"0":{"a":90000,"b":82000},"2":{"a":130000,"b":-1},"3":{"a":185000,"b":-1},"4":{"a":230000,"b":-1},"5":{"a":390000,"b":-1}},"/items/ginkgo_shield":{"0":{"a":48000,"b":44000},"1":{"a":74000,"b":-1},"2":{"a":78000,"b":-1},"3":{"a":86000,"b":-1},"4":{"a":150000,"b":-1},"5":{"a":230000,"b":-1}},"/items/ginkgo_water_staff":{"0":{"a":100000,"b":86000},"1":{"a":145000,"b":-1},"2":{"a":140000,"b":-1},"3":{"a":140000,"b":-1},"5":{"a":265000,"b":115000}},"/items/gluttonous_energy":{"0":{"a":11000000,"b":9800000}},"/items/gluttonous_pouch":{"0":{"a":-1,"b":5200000},"5":{"a":300000000,"b":5000000}},"/items/gobo_boomstick":{"0":{"a":80000,"b":78000},"1":{"a":90000,"b":-1},"2":{"a":94000,"b":-1},"3":{"a":96000,"b":20000},"5":{"a":90000,"b":-1},"6":{"a":175000,"b":-1},"8":{"a":1350000,"b":-1},"10":{"a":3900000,"b":2100000}},"/items/gobo_boots":{"0":{"a":16000,"b":13000},"1":{"a":25000,"b":-1},"2":{"a":20000,"b":-1},"3":{"a":82000,"b":-1},"4":{"a":100000,"b":-1},"5":{"a":98000,"b":-1}},"/items/gobo_bracers":{"0":{"a":24500,"b":21000},"1":{"a":29000,"b":-1},"2":{"a":30000,"b":-1},"3":{"a":66000,"b":-1},"4":{"a":150000,"b":-1},"5":{"a":180000,"b":-1}},"/items/gobo_chaps":{"0":{"a":41000,"b":32000},"1":{"a":54000,"b":-1},"2":{"a":74000,"b":-1},"3":{"a":140000,"b":-1},"5":{"a":260000,"b":-1}},"/items/gobo_defender":{"0":{"a":420000,"b":410000},"1":{"a":300000,"b":-1},"2":{"a":440000,"b":-1},"3":{"a":430000,"b":-1},"5":{"a":430000,"b":380000},"6":{"a":400000,"b":-1},"7":{"a":600000,"b":330000},"8":{"a":800000,"b":450000},"9":{"a":2100000,"b":1100000},"10":{"a":3200000,"b":2000000}},"/items/gobo_essence":{"0":{"a":42,"b":41}},"/items/gobo_hide":{"0":{"a":13,"b":12}},"/items/gobo_hood":{"0":{"a":26500,"b":18000},"1":{"a":32000,"b":-1},"2":{"a":40000,"b":-1},"3":{"a":88000,"b":-1},"4":{"a":180000,"b":-1},"5":{"a":100000,"b":-1},"6":{"a":200000,"b":-1}},"/items/gobo_leather":{"0":{"a":500,"b":470}},"/items/gobo_rag":{"0":{"a":400000,"b":390000}},"/items/gobo_shooter":{"0":{"a":80000,"b":78000},"1":{"a":80000,"b":-1},"2":{"a":84000,"b":-1},"3":{"a":98000,"b":-1},"4":{"a":145000,"b":20000},"5":{"a":100000,"b":90000},"6":{"a":175000,"b":-1},"7":{"a":500000,"b":-1},"8":{"a":1000000,"b":520000},"10":{"a":4700000,"b":4100000}},"/items/gobo_slasher":{"0":{"a":80000,"b":78000},"1":{"a":82000,"b":-1},"2":{"a":84000,"b":-1},"3":{"a":90000,"b":56000},"4":{"a":98000,"b":-1},"5":{"a":110000,"b":90000},"6":{"a":190000,"b":-1},"7":{"a":440000,"b":205000},"8":{"a":940000,"b":360000},"9":{"a":2750000,"b":-1},"10":{"a":4300000,"b":3700000},"11":{"a":33000000,"b":-1},"12":{"a":35000000,"b":-1}},"/items/gobo_smasher":{"0":{"a":80000,"b":78000},"2":{"a":86000,"b":-1},"3":{"a":82000,"b":-1},"4":{"a":-1,"b":20000},"5":{"a":96000,"b":20500},"6":{"a":190000,"b":-1},"7":{"a":450000,"b":20000},"8":{"a":880000,"b":-1},"10":{"a":8000000,"b":-1},"14":{"a":295000000,"b":-1}},"/items/gobo_stabber":{"0":{"a":80000,"b":78000},"1":{"a":84000,"b":-1},"2":{"a":94000,"b":-1},"3":{"a":90000,"b":-1},"4":{"a":90000,"b":-1},"5":{"a":90000,"b":80000},"6":{"a":150000,"b":-1},"7":{"a":420000,"b":-1},"10":{"a":70000000,"b":-1},"13":{"a":135000000,"b":-1}},"/items/gobo_tunic":{"0":{"a":45000,"b":38000},"2":{"a":60000,"b":-1},"3":{"a":100000,"b":-1},"4":{"a":145000,"b":-1},"5":{"a":96000,"b":-1}},"/items/goggles":{"0":{"a":66000,"b":64000}},"/items/golem_essence":{"0":{"a":320,"b":310}},"/items/gourmet_tea":{"0":{"a":500,"b":490}},"/items/granite_bludgeon":{"0":{"a":14500000,"b":12000000},"5":{"a":22500000,"b":13500000},"6":{"a":-1,"b":15000000},"7":{"a":34000000,"b":21500000},"8":{"a":49000000,"b":-1},"9":{"a":90000000,"b":-1},"10":{"a":86000000,"b":-1}},"/items/green_key_fragment":{"0":{"a":560000,"b":540000}},"/items/green_tea_leaf":{"0":{"a":11,"b":9}},"/items/griffin_bulwark":{"0":{"a":-1,"b":145000000},"2":{"a":-1,"b":5000000},"5":{"a":-1,"b":82000000},"8":{"a":-1,"b":180000000},"10":{"a":440000000,"b":5400000}},"/items/griffin_chaps":{"0":{"a":7600000,"b":6800000},"5":{"a":8200000,"b":7600000},"6":{"a":13000000,"b":-1},"7":{"a":16000000,"b":-1},"8":{"a":26500000,"b":-1},"10":{"a":45000000,"b":20000000}},"/items/griffin_leather":{"0":{"a":940000,"b":880000}},"/items/griffin_talon":{"0":{"a":5800000,"b":5600000}},"/items/griffin_tunic":{"0":{"a":9000000,"b":8800000},"5":{"a":9400000,"b":8600000},"6":{"a":11000000,"b":-1},"8":{"a":29500000,"b":-1},"10":{"a":48000000,"b":-1},"12":{"a":300000000,"b":-1}},"/items/grizzly_bear_fluff":{"0":{"a":86000,"b":84000}},"/items/grizzly_bear_shoes":{"0":{"a":480000,"b":440000},"1":{"a":600000,"b":175000},"2":{"a":720000,"b":-1},"3":{"a":540000,"b":155000},"5":{"a":840000,"b":620000},"6":{"a":1800000,"b":500000},"7":{"a":2050000,"b":1650000},"8":{"a":5200000,"b":2750000},"9":{"a":8600000,"b":3500000},"10":{"a":10500000,"b":9400000},"11":{"a":25000000,"b":-1},"12":{"a":47000000,"b":35000000},"14":{"a":195000000,"b":-1}},"/items/gummy":{"0":{"a":240,"b":205}},"/items/guzzling_energy":{"0":{"a":19500000,"b":19000000}},"/items/guzzling_pouch":{"0":{"a":-1,"b":215000000},"1":{"a":-1,"b":7000000},"2":{"a":-1,"b":6000000},"5":{"a":255000000,"b":245000000},"6":{"a":-1,"b":265000000},"7":{"a":-1,"b":320000000},"8":{"a":430000000,"b":380000000},"10":{"a":900000000,"b":-1}},"/items/heal":{"0":{"a":28000,"b":27500}},"/items/holy_alembic":{"0":{"a":350000,"b":330000},"2":{"a":440000,"b":220000},"3":{"a":540000,"b":340000},"4":{"a":960000,"b":450000},"5":{"a":1550000,"b":1500000},"6":{"a":2950000,"b":2250000},"7":{"a":7400000,"b":5400000},"8":{"a":13000000,"b":11500000},"9":{"a":-1,"b":210000},"10":{"a":37000000,"b":36000000},"12":{"a":-1,"b":340000},"20":{"a":-1,"b":100000}},"/items/holy_boots":{"0":{"a":170000,"b":135000},"1":{"a":190000,"b":-1},"2":{"a":280000,"b":-1},"3":{"a":420000,"b":-1},"4":{"a":600000,"b":-1},"5":{"a":500000,"b":-1},"7":{"a":5000000,"b":490000}},"/items/holy_brush":{"0":{"a":330000,"b":310000},"1":{"a":390000,"b":100000},"2":{"a":700000,"b":-1},"3":{"a":620000,"b":360000},"4":{"a":940000,"b":460000},"5":{"a":1600000,"b":1550000},"6":{"a":2950000,"b":2350000},"7":{"a":6000000,"b":5000000},"8":{"a":13000000,"b":9600000},"9":{"a":27500000,"b":12000000},"10":{"a":38000000,"b":34000000},"11":{"a":98000000,"b":175000},"12":{"a":-1,"b":3700000},"14":{"a":-1,"b":1100000},"15":{"a":320000000,"b":235000000},"20":{"a":-1,"b":8800000}},"/items/holy_buckler":{"0":{"a":410000,"b":300000},"3":{"a":450000,"b":-1},"4":{"a":880000,"b":-1},"5":{"a":960000,"b":-1},"7":{"a":6000000,"b":600000}},"/items/holy_bulwark":{"0":{"a":560000,"b":440000},"4":{"a":1150000,"b":-1},"5":{"a":3000000,"b":-1},"10":{"a":92000000,"b":-1}},"/items/holy_cheese":{"0":{"a":1650,"b":1600}},"/items/holy_chisel":{"0":{"a":330000,"b":320000},"1":{"a":400000,"b":290000},"2":{"a":490000,"b":290000},"3":{"a":520000,"b":330000},"4":{"a":880000,"b":560000},"5":{"a":1600000,"b":1550000},"6":{"a":3100000,"b":2450000},"7":{"a":6600000,"b":5800000},"8":{"a":-1,"b":11000000},"9":{"a":27000000,"b":22000000},"10":{"a":37000000,"b":31000000},"11":{"a":-1,"b":50000000}},"/items/holy_enhancer":{"0":{"a":350000,"b":340000},"1":{"a":-1,"b":64000},"2":{"a":420000,"b":330000},"3":{"a":520000,"b":360000},"4":{"a":820000,"b":430000},"5":{"a":1600000,"b":1500000},"6":{"a":2550000,"b":2000000},"7":{"a":5000000,"b":4100000},"8":{"a":11000000,"b":7800000},"9":{"a":20000000,"b":-1},"10":{"a":36000000,"b":35000000},"11":{"a":70000000,"b":-1},"12":{"a":145000000,"b":135000000},"13":{"a":-1,"b":240000000}},"/items/holy_gauntlets":{"0":{"a":215000,"b":175000},"1":{"a":220000,"b":-1},"2":{"a":350000,"b":-1},"3":{"a":430000,"b":-1},"4":{"a":1000000,"b":-1},"5":{"a":1000000,"b":-1},"6":{"a":1950000,"b":-1},"7":{"a":4300000,"b":-1}},"/items/holy_hammer":{"0":{"a":320000,"b":310000},"1":{"a":410000,"b":100000},"2":{"a":430000,"b":260000},"3":{"a":500000,"b":-1},"4":{"a":980000,"b":500000},"5":{"a":1600000,"b":1500000},"6":{"a":2950000,"b":2300000},"7":{"a":6600000,"b":4200000},"8":{"a":12000000,"b":11000000},"9":{"a":21500000,"b":2000000},"10":{"a":35000000,"b":33000000},"11":{"a":70000000,"b":-1},"12":{"a":-1,"b":50000000},"15":{"a":880000000,"b":225000000}},"/items/holy_hatchet":{"0":{"a":360000,"b":320000},"1":{"a":920000,"b":-1},"2":{"a":490000,"b":-1},"3":{"a":560000,"b":440000},"4":{"a":880000,"b":450000},"5":{"a":1600000,"b":1550000},"6":{"a":3000000,"b":2400000},"7":{"a":7400000,"b":5600000},"8":{"a":13000000,"b":10000000},"9":{"a":-1,"b":3100000},"10":{"a":37000000,"b":34000000},"11":{"a":78000000,"b":-1},"13":{"a":285000000,"b":-1},"14":{"a":760000000,"b":-1}},"/items/holy_helmet":{"0":{"a":255000,"b":250000},"1":{"a":250000,"b":-1},"2":{"a":300000,"b":-1},"3":{"a":400000,"b":-1},"4":{"a":780000,"b":-1},"5":{"a":1800000,"b":-1},"6":{"a":4000000,"b":400000},"8":{"a":6400000,"b":620000}},"/items/holy_mace":{"0":{"a":380000,"b":370000},"2":{"a":500000,"b":-1},"3":{"a":700000,"b":-1},"4":{"a":840000,"b":-1},"5":{"a":1000000,"b":-1},"9":{"a":20000000,"b":-1},"10":{"a":34000000,"b":-1}},"/items/holy_milk":{"0":{"a":350,"b":340}},"/items/holy_needle":{"0":{"a":340000,"b":320000},"1":{"a":-1,"b":115000},"2":{"a":410000,"b":340000},"3":{"a":580000,"b":320000},"4":{"a":1000000,"b":430000},"5":{"a":1550000,"b":1500000},"6":{"a":3000000,"b":2050000},"7":{"a":6400000,"b":5200000},"8":{"a":13000000,"b":11500000},"9":{"a":-1,"b":350000},"10":{"a":38000000,"b":34000000}},"/items/holy_plate_body":{"0":{"a":380000,"b":360000},"2":{"a":440000,"b":-1},"3":{"a":560000,"b":-1},"4":{"a":740000,"b":-1},"5":{"a":1200000,"b":400000},"6":{"a":2550000,"b":-1}},"/items/holy_plate_legs":{"0":{"a":350000,"b":340000},"2":{"a":450000,"b":-1},"3":{"a":500000,"b":-1},"5":{"a":840000,"b":-1}},"/items/holy_pot":{"0":{"a":330000,"b":320000},"1":{"a":-1,"b":110000},"2":{"a":-1,"b":300000},"3":{"a":580000,"b":350000},"4":{"a":960000,"b":560000},"5":{"a":1550000,"b":1500000},"6":{"a":3100000,"b":2350000},"7":{"a":7600000,"b":5000000},"8":{"a":13000000,"b":10500000},"9":{"a":26000000,"b":5000000},"10":{"a":36000000,"b":34000000},"11":{"a":90000000,"b":-1},"13":{"a":-1,"b":300000},"14":{"a":320000000,"b":-1},"20":{"a":-1,"b":62000}},"/items/holy_shears":{"0":{"a":330000,"b":320000},"2":{"a":-1,"b":320000},"3":{"a":-1,"b":350000},"4":{"a":-1,"b":580000},"5":{"a":1600000,"b":1550000},"6":{"a":3400000,"b":2000000},"7":{"a":6000000,"b":4300000},"8":{"a":13000000,"b":-1},"9":{"a":-1,"b":13500000},"10":{"a":37000000,"b":33000000},"12":{"a":145000000,"b":-1},"16":{"a":800000000,"b":-1},"20":{"a":-1,"b":1050000}},"/items/holy_spatula":{"0":{"a":340000,"b":330000},"1":{"a":-1,"b":64000},"2":{"a":460000,"b":390000},"3":{"a":540000,"b":370000},"4":{"a":1000000,"b":450000},"5":{"a":1600000,"b":1500000},"6":{"a":2700000,"b":2350000},"7":{"a":6400000,"b":5200000},"8":{"a":13000000,"b":10000000},"9":{"a":25500000,"b":19000000},"10":{"a":37000000,"b":36000000},"11":{"a":-1,"b":52000000},"12":{"a":100000000,"b":-1}},"/items/holy_spear":{"0":{"a":420000,"b":400000},"1":{"a":400000,"b":-1},"2":{"a":440000,"b":-1},"3":{"a":800000,"b":-1},"4":{"a":1500000,"b":-1},"5":{"a":1550000,"b":-1},"6":{"a":5000000,"b":-1},"8":{"a":13000000,"b":-1}},"/items/holy_sword":{"0":{"a":420000,"b":410000},"1":{"a":450000,"b":230000},"2":{"a":500000,"b":-1},"3":{"a":580000,"b":-1},"5":{"a":1000000,"b":-1},"6":{"a":3000000,"b":820000},"10":{"a":56000000,"b":1150000},"20":{"a":-1,"b":1000000}},"/items/ice_spear":{"0":{"a":28000,"b":27500}},"/items/icy_cloth":{"0":{"a":62000,"b":60000}},"/items/icy_robe_bottoms":{"0":{"a":290000,"b":200000},"1":{"a":290000,"b":-1},"2":{"a":290000,"b":-1},"3":{"a":330000,"b":-1},"4":{"a":420000,"b":-1},"5":{"a":350000,"b":255000},"6":{"a":680000,"b":450000},"7":{"a":1800000,"b":-1},"8":{"a":2200000,"b":1250000},"10":{"a":8800000,"b":7800000}},"/items/icy_robe_top":{"0":{"a":330000,"b":300000},"1":{"a":-1,"b":145000},"2":{"a":360000,"b":135000},"3":{"a":350000,"b":185000},"4":{"a":470000,"b":160000},"5":{"a":470000,"b":150000},"6":{"a":-1,"b":450000},"7":{"a":2450000,"b":-1},"8":{"a":3100000,"b":1850000},"10":{"a":9000000,"b":8200000}},"/items/impale":{"0":{"a":29000,"b":28000}},"/items/infernal_battlestaff":{"0":{"a":24500000,"b":20500000},"1":{"a":-1,"b":14000000},"2":{"a":26000000,"b":9000000},"5":{"a":26000000,"b":25500000},"6":{"a":28500000,"b":26000000},"7":{"a":36000000,"b":33000000},"8":{"a":49000000,"b":40000000},"9":{"a":-1,"b":64000000},"10":{"a":105000000,"b":96000000},"12":{"a":150000000,"b":120000000}},"/items/infernal_ember":{"0":{"a":1300000,"b":1250000}},"/items/insanity":{"0":{"a":3300000,"b":3100000}},"/items/intelligence_coffee":{"0":{"a":490,"b":460}},"/items/invincible":{"0":{"a":2250000,"b":2150000}},"/items/jackalope_antler":{"0":{"a":3300000,"b":3200000}},"/items/jackalope_staff":{"0":{"a":60000000,"b":50000000},"1":{"a":-1,"b":9800000},"2":{"a":-1,"b":1000000},"4":{"a":-1,"b":9800000},"5":{"a":64000000,"b":60000000},"6":{"a":70000000,"b":60000000},"7":{"a":78000000,"b":74000000},"8":{"a":100000000,"b":80000000},"10":{"a":190000000,"b":165000000},"12":{"a":480000000,"b":-1},"20":{"a":-1,"b":72000000}},"/items/jade":{"0":{"a":40000,"b":39000}},"/items/jungle_essence":{"0":{"a":56,"b":54}},"/items/knights_aegis":{"0":{"a":-1,"b":100000000},"4":{"a":-1,"b":6000000},"5":{"a":150000000,"b":110000000},"6":{"a":120000000,"b":-1},"7":{"a":135000000,"b":125000000},"8":{"a":175000000,"b":165000000},"9":{"a":-1,"b":4100000},"10":{"a":390000000,"b":370000000},"12":{"a":-1,"b":1000000000}},"/items/knights_ingot":{"0":{"a":11000000,"b":10500000}},"/items/kraken_chaps":{"0":{"a":115000000,"b":105000000},"5":{"a":120000000,"b":115000000},"7":{"a":140000000,"b":135000000},"8":{"a":200000000,"b":185000000},"10":{"a":480000000,"b":430000000}},"/items/kraken_fang":{"0":{"a":19500000,"b":19000000}},"/items/kraken_leather":{"0":{"a":13000000,"b":12500000}},"/items/kraken_tunic":{"0":{"a":145000000,"b":130000000},"5":{"a":145000000,"b":135000000},"6":{"a":-1,"b":140000000},"7":{"a":170000000,"b":165000000},"8":{"a":-1,"b":190000000},"10":{"a":-1,"b":490000000},"11":{"a":-1,"b":9600000},"12":{"a":1750000000,"b":-1}},"/items/large_pouch":{"0":{"a":580000,"b":560000},"1":{"a":620000,"b":-1},"2":{"a":860000,"b":-1},"3":{"a":1000000,"b":-1},"4":{"a":-1,"b":450000}},"/items/liberica_coffee_bean":{"0":{"a":380,"b":370}},"/items/life_drain":{"0":{"a":100000,"b":94000}},"/items/linen_boots":{"0":{"a":9600,"b":7400},"1":{"a":35000,"b":-1},"2":{"a":96000,"b":-1},"3":{"a":96000,"b":-1},"7":{"a":2150000,"b":-1}},"/items/linen_fabric":{"0":{"a":390,"b":380}},"/items/linen_gloves":{"0":{"a":8600,"b":6800},"1":{"a":9800000,"b":-1},"2":{"a":105000,"b":-1},"3":{"a":150000,"b":-1},"5":{"a":170000,"b":-1},"7":{"a":1000000,"b":-1}},"/items/linen_hat":{"0":{"a":11000,"b":7000},"1":{"a":270000,"b":-1},"3":{"a":100000,"b":-1},"5":{"a":100000,"b":-1}},"/items/linen_robe_bottoms":{"0":{"a":16000,"b":13500},"1":{"a":100000,"b":-1},"2":{"a":98000,"b":-1},"3":{"a":100000,"b":-1},"5":{"a":170000,"b":-1}},"/items/linen_robe_top":{"0":{"a":15000,"b":13500},"1":{"a":290000,"b":-1},"2":{"a":250000,"b":-1},"3":{"a":320000,"b":-1},"4":{"a":240000,"b":-1},"5":{"a":600000,"b":-1},"6":{"a":480000,"b":-1}},"/items/living_granite":{"0":{"a":660000,"b":640000}},"/items/log":{"0":{"a":37,"b":35}},"/items/lucky_coffee":{"0":{"a":1600,"b":1550}},"/items/lumber":{"0":{"a":210,"b":205}},"/items/lumberjacks_bottoms":{"0":{"a":-1,"b":20500000},"5":{"a":150000000,"b":-1},"7":{"a":175000000,"b":-1}},"/items/lumberjacks_top":{"0":{"a":-1,"b":27000000},"5":{"a":135000000,"b":125000000},"7":{"a":165000000,"b":-1},"8":{"a":205000000,"b":-1},"10":{"a":420000000,"b":255000000}},"/items/luna_robe_bottoms":{"0":{"a":1700000,"b":1450000},"2":{"a":2000000,"b":470000},"3":{"a":-1,"b":170000},"4":{"a":1850000,"b":180000},"5":{"a":2050000,"b":1950000},"6":{"a":3500000,"b":340000},"7":{"a":5800000,"b":4000000},"8":{"a":8600000,"b":7000000},"10":{"a":22500000,"b":22000000},"11":{"a":50000000,"b":185000}},"/items/luna_robe_top":{"0":{"a":1850000,"b":1800000},"1":{"a":2050000,"b":205000},"2":{"a":2250000,"b":225000},"3":{"a":-1,"b":225000},"4":{"a":-1,"b":225000},"5":{"a":2400000,"b":2050000},"6":{"a":5600000,"b":540000},"7":{"a":6600000,"b":5400000},"8":{"a":9800000,"b":7200000},"10":{"a":23500000,"b":23000000},"11":{"a":72000000,"b":110000}},"/items/luna_wing":{"0":{"a":195000,"b":190000}},"/items/maelstrom_plate_body":{"0":{"a":135000000,"b":120000000},"5":{"a":140000000,"b":130000000},"7":{"a":175000000,"b":150000000},"8":{"a":220000000,"b":195000000},"9":{"a":330000000,"b":-1},"10":{"a":540000000,"b":-1},"12":{"a":-1,"b":8600000}},"/items/maelstrom_plate_legs":{"0":{"a":120000000,"b":100000000},"5":{"a":-1,"b":115000000},"7":{"a":145000000,"b":130000000},"10":{"a":480000000,"b":450000000},"12":{"a":1700000000,"b":1400000000}},"/items/maelstrom_plating":{"0":{"a":13000000,"b":12500000}},"/items/magic_coffee":{"0":{"a":760,"b":740}},"/items/magicians_cloth":{"0":{"a":9600000,"b":9400000}},"/items/magicians_hat":{"0":{"a":98000000,"b":94000000},"1":{"a":-1,"b":12000000},"2":{"a":-1,"b":9600000},"5":{"a":105000000,"b":94000000},"7":{"a":115000000,"b":110000000},"8":{"a":140000000,"b":130000000},"10":{"a":320000000,"b":290000000},"12":{"a":-1,"b":1050000000}},"/items/magnet":{"0":{"a":330000,"b":320000}},"/items/magnetic_gloves":{"0":{"a":3800000,"b":3100000},"1":{"a":-1,"b":470000},"2":{"a":-1,"b":580000},"3":{"a":-1,"b":600000},"4":{"a":-1,"b":3200000},"5":{"a":4300000,"b":3600000},"6":{"a":6800000,"b":5000000},"7":{"a":12500000,"b":6200000},"8":{"a":13000000,"b":10000000},"9":{"a":22500000,"b":16500000},"10":{"a":37000000,"b":34000000}},"/items/magnifying_glass":{"0":{"a":190000,"b":185000}},"/items/maim":{"0":{"a":165000,"b":160000}},"/items/mana_spring":{"0":{"a":230000,"b":225000}},"/items/manticore_shield":{"0":{"a":26500000,"b":23500000},"3":{"a":34000000,"b":7600000},"5":{"a":27500000,"b":27000000},"6":{"a":-1,"b":27000000},"7":{"a":36000000,"b":34000000},"8":{"a":56000000,"b":50000000},"9":{"a":-1,"b":80000000},"10":{"a":125000000,"b":120000000},"11":{"a":290000000,"b":400000},"12":{"a":500000000,"b":-1}},"/items/manticore_sting":{"0":{"a":2750000,"b":2700000}},"/items/marine_chaps":{"0":{"a":410000,"b":390000},"4":{"a":540000,"b":-1},"5":{"a":660000,"b":-1},"6":{"a":900000,"b":-1},"7":{"a":1200000,"b":-1},"8":{"a":3000000,"b":-1},"10":{"a":8400000,"b":-1},"11":{"a":9800000,"b":-1},"12":{"a":16000000,"b":-1}},"/items/marine_scale":{"0":{"a":70000,"b":68000}},"/items/marine_tunic":{"0":{"a":500000,"b":490000},"1":{"a":580000,"b":-1},"3":{"a":760000,"b":-1},"4":{"a":740000,"b":-1},"5":{"a":840000,"b":-1},"7":{"a":2200000,"b":-1},"8":{"a":3600000,"b":-1}},"/items/marksman_bracers":{"0":{"a":115000000,"b":110000000},"5":{"a":120000000,"b":110000000},"7":{"a":135000000,"b":130000000},"8":{"a":-1,"b":150000000},"10":{"a":410000000,"b":370000000},"12":{"a":-1,"b":1100000000}},"/items/marksman_brooch":{"0":{"a":12500000,"b":12000000}},"/items/marsberry":{"0":{"a":105,"b":100}},"/items/marsberry_cake":{"0":{"a":880,"b":860}},"/items/marsberry_donut":{"0":{"a":700,"b":680}},"/items/medium_pouch":{"0":{"a":90000,"b":84000},"1":{"a":110000,"b":-1},"2":{"a":145000,"b":-1},"3":{"a":235000,"b":-1},"4":{"a":480000,"b":-1},"5":{"a":760000,"b":-1},"10":{"a":5000000,"b":-1}},"/items/milk":{"0":{"a":54,"b":52}},"/items/milking_essence":{"0":{"a":200,"b":195}},"/items/milking_tea":{"0":{"a":380,"b":360}},"/items/minor_heal":{"0":{"a":3500,"b":3300}},"/items/mirror_of_protection":{"0":{"a":11000000,"b":10500000}},"/items/mooberry":{"0":{"a":105,"b":100}},"/items/mooberry_cake":{"0":{"a":760,"b":740}},"/items/mooberry_donut":{"0":{"a":520,"b":500}},"/items/moolong_tea_leaf":{"0":{"a":34,"b":33}},"/items/moonstone":{"0":{"a":60000,"b":58000}},"/items/natures_veil":{"0":{"a":660000,"b":640000}},"/items/necklace_of_efficiency":{"0":{"a":13500000,"b":12000000},"1":{"a":20000000,"b":1000000},"2":{"a":-1,"b":1500000},"3":{"a":-1,"b":13000000},"4":{"a":-1,"b":220000},"20":{"a":-1,"b":30000}},"/items/necklace_of_speed":{"0":{"a":15000000,"b":14000000},"1":{"a":20000000,"b":17000000},"2":{"a":-1,"b":20500000},"3":{"a":39000000,"b":34000000},"4":{"a":72000000,"b":40000000},"5":{"a":140000000,"b":62000000},"6":{"a":240000000,"b":2400000},"10":{"a":-1,"b":340000000}},"/items/necklace_of_wisdom":{"0":{"a":13000000,"b":12500000},"1":{"a":15000000,"b":13500000},"2":{"a":22000000,"b":19000000},"3":{"a":33000000,"b":28000000},"4":{"a":84000000,"b":45000000},"5":{"a":-1,"b":80000000},"6":{"a":150000000,"b":92000000},"7":{"a":195000000,"b":185000000},"8":{"a":320000000,"b":200000000},"10":{"a":780000000,"b":200000000}},"/items/orange":{"0":{"a":8,"b":7}},"/items/orange_gummy":{"0":{"a":52,"b":43}},"/items/orange_key_fragment":{"0":{"a":1150000,"b":1100000}},"/items/orange_yogurt":{"0":{"a":340,"b":330}},"/items/panda_fluff":{"0":{"a":86000,"b":84000}},"/items/panda_gloves":{"0":{"a":560000,"b":500000},"2":{"a":600000,"b":580000},"5":{"a":840000,"b":740000},"6":{"a":1150000,"b":840000},"7":{"a":4600000,"b":2000000},"8":{"a":6200000,"b":3000000},"10":{"a":12500000,"b":6800000}},"/items/peach":{"0":{"a":110,"b":105}},"/items/peach_gummy":{"0":{"a":470,"b":460}},"/items/peach_yogurt":{"0":{"a":640,"b":620}},"/items/pearl":{"0":{"a":14000,"b":13500}},"/items/penetrating_shot":{"0":{"a":360000,"b":350000}},"/items/penetrating_strike":{"0":{"a":68000,"b":66000}},"/items/pestilent_shot":{"0":{"a":64000,"b":62000}},"/items/philosophers_earrings":{"0":{"a":-1,"b":540000000},"5":{"a":1150000000,"b":1050000000},"7":{"a":1800000000,"b":1500000000},"10":{"a":-1,"b":15000000}},"/items/philosophers_necklace":{"0":{"a":760000000,"b":700000000},"2":{"a":800000000,"b":720000000},"3":{"a":-1,"b":760000000},"5":{"a":1250000000,"b":1200000000},"7":{"a":2050000000,"b":12000000},"20":{"a":-1,"b":12000000}},"/items/philosophers_ring":{"0":{"a":-1,"b":450000000},"4":{"a":-1,"b":56000000},"5":{"a":1150000000,"b":1050000000},"7":{"a":1800000000,"b":1650000000},"10":{"a":-1,"b":560000000}},"/items/philosophers_stone":{"0":{"a":660000000,"b":620000000}},"/items/pincer_gloves":{"0":{"a":22000,"b":21000},"1":{"a":22500,"b":-1},"2":{"a":22000,"b":-1},"3":{"a":29500,"b":-1},"4":{"a":48000,"b":-1},"5":{"a":94000,"b":16000},"6":{"a":185000,"b":-1},"7":{"a":700000,"b":-1},"8":{"a":860000,"b":-1},"9":{"a":1350000,"b":-1},"10":{"a":4200000,"b":1250000},"12":{"a":11500000,"b":-1},"14":{"a":18000000,"b":-1}},"/items/pirate_chest_key":{"0":{"a":7600000,"b":7400000}},"/items/pirate_entry_key":{"0":{"a":500000,"b":490000}},"/items/pirate_essence":{"0":{"a":2050,"b":2000}},"/items/plum":{"0":{"a":96,"b":90}},"/items/plum_gummy":{"0":{"a":215,"b":210}},"/items/plum_yogurt":{"0":{"a":560,"b":520}},"/items/poke":{"0":{"a":3400,"b":3000}},"/items/polar_bear_fluff":{"0":{"a":88000,"b":86000}},"/items/polar_bear_shoes":{"0":{"a":470000,"b":400000},"1":{"a":520000,"b":145000},"2":{"a":-1,"b":165000},"3":{"a":600000,"b":175000},"4":{"a":2500000,"b":165000},"5":{"a":760000,"b":600000},"6":{"a":1300000,"b":900000},"7":{"a":1900000,"b":195000},"8":{"a":3900000,"b":2400000},"9":{"a":9400000,"b":600000},"10":{"a":11500000,"b":10000000},"11":{"a":24000000,"b":-1},"12":{"a":35000000,"b":30000000},"14":{"a":180000000,"b":150000000}},"/items/power_coffee":{"0":{"a":740,"b":700}},"/items/precision":{"0":{"a":64000,"b":62000}},"/items/prime_catalyst":{"0":{"a":98000,"b":96000}},"/items/processing_tea":{"0":{"a":1350,"b":1300}},"/items/provoke":{"0":{"a":46000,"b":45000}},"/items/puncture":{"0":{"a":165000,"b":160000}},"/items/purple_key_fragment":{"0":{"a":780000,"b":760000}},"/items/purpleheart_bow":{"0":{"a":74000,"b":68000},"1":{"a":72000,"b":-1},"2":{"a":76000,"b":-1},"3":{"a":86000,"b":-1},"5":{"a":130000,"b":-1},"6":{"a":540000,"b":-1},"10":{"a":-1,"b":16000}},"/items/purpleheart_crossbow":{"0":{"a":60000,"b":58000},"1":{"a":72000,"b":-1},"2":{"a":78000,"b":-1},"3":{"a":90000,"b":-1},"4":{"a":100000,"b":-1},"5":{"a":165000,"b":100000}},"/items/purpleheart_fire_staff":{"0":{"a":60000,"b":54000},"1":{"a":66000,"b":-1},"2":{"a":78000,"b":-1},"3":{"a":90000,"b":-1},"4":{"a":110000,"b":-1},"5":{"a":150000,"b":100000},"6":{"a":350000,"b":-1},"7":{"a":600000,"b":-1},"8":{"a":6000000,"b":-1}},"/items/purpleheart_log":{"0":{"a":42,"b":38}},"/items/purpleheart_lumber":{"0":{"a":560,"b":520}},"/items/purpleheart_nature_staff":{"0":{"a":60000,"b":54000},"1":{"a":72000,"b":-1},"2":{"a":78000,"b":-1},"3":{"a":100000,"b":-1},"4":{"a":200000,"b":-1},"5":{"a":340000,"b":-1}},"/items/purpleheart_shield":{"0":{"a":43000,"b":38000},"3":{"a":125000,"b":-1},"5":{"a":245000,"b":-1}},"/items/purpleheart_water_staff":{"0":{"a":64000,"b":56000},"1":{"a":70000,"b":-1},"2":{"a":4500000,"b":-1},"3":{"a":52000,"b":-1},"4":{"a":100000,"b":-1},"5":{"a":110000,"b":-1}},"/items/quick_aid":{"0":{"a":290000,"b":285000}},"/items/quick_shot":{"0":{"a":3100,"b":3000}},"/items/radiant_boots":{"0":{"a":110000,"b":105000},"1":{"a":130000,"b":-1},"2":{"a":120000,"b":-1},"3":{"a":320000,"b":-1},"4":{"a":580000,"b":-1},"5":{"a":960000,"b":-1},"6":{"a":-1,"b":105000},"7":{"a":5000000,"b":-1}},"/items/radiant_fabric":{"0":{"a":1700,"b":1650}},"/items/radiant_fiber":{"0":{"a":320,"b":310}},"/items/radiant_gloves":{"0":{"a":110000,"b":105000},"1":{"a":125000,"b":-1},"2":{"a":150000,"b":-1},"3":{"a":370000,"b":-1},"4":{"a":680000,"b":-1},"5":{"a":1100000,"b":920000},"6":{"a":2450000,"b":-1},"7":{"a":-1,"b":2700000},"9":{"a":-1,"b":3500000},"10":{"a":43000000,"b":7000000}},"/items/radiant_hat":{"0":{"a":235000,"b":225000},"1":{"a":295000,"b":-1},"2":{"a":440000,"b":-1},"3":{"a":600000,"b":-1},"4":{"a":-1,"b":410000},"5":{"a":1300000,"b":1100000},"6":{"a":3800000,"b":380000},"7":{"a":-1,"b":860000},"8":{"a":14500000,"b":8600000},"10":{"a":30000000,"b":22500000},"12":{"a":80000000,"b":-1}},"/items/radiant_robe_bottoms":{"0":{"a":340000,"b":330000},"1":{"a":330000,"b":-1},"2":{"a":620000,"b":-1},"3":{"a":700000,"b":450000},"4":{"a":920000,"b":-1},"5":{"a":1850000,"b":-1},"6":{"a":7000000,"b":-1},"7":{"a":9800000,"b":3000000},"8":{"a":-1,"b":12000000},"12":{"a":150000000,"b":-1}},"/items/radiant_robe_top":{"0":{"a":360000,"b":350000},"1":{"a":400000,"b":-1},"3":{"a":600000,"b":-1},"4":{"a":940000,"b":380000},"5":{"a":1850000,"b":-1},"7":{"a":9800000,"b":3000000},"8":{"a":14500000,"b":1300000},"12":{"a":68000000,"b":1400000}},"/items/rain_of_arrows":{"0":{"a":180000,"b":175000}},"/items/rainbow_alembic":{"0":{"a":140000,"b":135000},"1":{"a":150000,"b":-1},"2":{"a":215000,"b":-1},"3":{"a":245000,"b":100000},"5":{"a":760000,"b":560000},"6":{"a":16000000,"b":-1}},"/items/rainbow_boots":{"0":{"a":72000,"b":60000},"1":{"a":72000,"b":-1},"2":{"a":76000,"b":-1},"3":{"a":98000,"b":-1},"4":{"a":110000,"b":-1},"5":{"a":185000,"b":-1},"6":{"a":700000,"b":-1}},"/items/rainbow_brush":{"0":{"a":135000,"b":120000},"1":{"a":160000,"b":27500},"2":{"a":215000,"b":-1},"3":{"a":295000,"b":-1},"5":{"a":780000,"b":560000},"6":{"a":1200000,"b":-1}},"/items/rainbow_buckler":{"0":{"a":145000,"b":125000},"1":{"a":120000,"b":-1},"2":{"a":170000,"b":-1},"3":{"a":300000,"b":-1},"5":{"a":300000,"b":-1}},"/items/rainbow_bulwark":{"0":{"a":175000,"b":170000},"1":{"a":205000,"b":-1},"2":{"a":220000,"b":-1},"3":{"a":270000,"b":-1},"4":{"a":500000,"b":-1},"5":{"a":400000,"b":-1}},"/items/rainbow_cheese":{"0":{"a":740,"b":720}},"/items/rainbow_chisel":{"0":{"a":135000,"b":120000},"1":{"a":135000,"b":25500},"2":{"a":205000,"b":-1},"3":{"a":420000,"b":165000},"5":{"a":660000,"b":520000}},"/items/rainbow_enhancer":{"0":{"a":150000,"b":145000},"1":{"a":360000,"b":27500},"2":{"a":185000,"b":26000},"3":{"a":240000,"b":100000},"4":{"a":380000,"b":28000},"5":{"a":490000,"b":285000},"6":{"a":1500000,"b":26000},"7":{"a":2700000,"b":520000},"8":{"a":5600000,"b":-1},"10":{"a":520000000,"b":1500000}},"/items/rainbow_gauntlets":{"0":{"a":88000,"b":74000},"1":{"a":105000,"b":-1},"2":{"a":175000,"b":-1},"3":{"a":155000,"b":-1},"4":{"a":310000,"b":-1},"5":{"a":600000,"b":-1},"6":{"a":1900000,"b":-1},"7":{"a":7200000,"b":-1},"10":{"a":8000000,"b":-1}},"/items/rainbow_hammer":{"0":{"a":125000,"b":120000},"1":{"a":320000,"b":25500},"2":{"a":230000,"b":-1},"3":{"a":400000,"b":-1},"5":{"a":580000,"b":340000},"6":{"a":-1,"b":135000}},"/items/rainbow_hatchet":{"0":{"a":145000,"b":125000},"1":{"a":175000,"b":25500},"2":{"a":195000,"b":-1},"3":{"a":235000,"b":-1},"4":{"a":520000,"b":-1},"5":{"a":800000,"b":700000}},"/items/rainbow_helmet":{"0":{"a":105000,"b":90000},"1":{"a":105000,"b":-1},"2":{"a":110000,"b":-1},"3":{"a":145000,"b":-1},"4":{"a":280000,"b":-1},"5":{"a":330000,"b":175000}},"/items/rainbow_mace":{"0":{"a":155000,"b":115000},"1":{"a":180000,"b":-1},"2":{"a":195000,"b":-1},"3":{"a":210000,"b":-1},"4":{"a":340000,"b":-1},"5":{"a":560000,"b":-1},"6":{"a":3500000,"b":-1}},"/items/rainbow_milk":{"0":{"a":210,"b":205}},"/items/rainbow_needle":{"0":{"a":135000,"b":130000},"1":{"a":150000,"b":25500},"2":{"a":200000,"b":-1},"3":{"a":295000,"b":100000},"4":{"a":400000,"b":36000},"5":{"a":-1,"b":660000}},"/items/rainbow_plate_body":{"0":{"a":170000,"b":130000},"1":{"a":195000,"b":-1},"3":{"a":1250000,"b":-1},"4":{"a":680000,"b":-1},"5":{"a":700000,"b":-1}},"/items/rainbow_plate_legs":{"0":{"a":150000,"b":130000},"1":{"a":165000,"b":-1},"2":{"a":175000,"b":-1},"3":{"a":215000,"b":-1},"4":{"a":500000,"b":-1},"5":{"a":520000,"b":450000}},"/items/rainbow_pot":{"0":{"a":130000,"b":125000},"1":{"a":135000,"b":-1},"2":{"a":150000,"b":-1},"3":{"a":200000,"b":100000},"4":{"a":490000,"b":-1},"5":{"a":1100000,"b":660000},"6":{"a":1200000,"b":-1},"10":{"a":-1,"b":1050000}},"/items/rainbow_shears":{"0":{"a":135000,"b":130000},"1":{"a":175000,"b":50000},"2":{"a":180000,"b":-1},"3":{"a":280000,"b":-1},"5":{"a":580000,"b":460000},"6":{"a":4100000,"b":-1},"7":{"a":5800000,"b":165000}},"/items/rainbow_spatula":{"0":{"a":145000,"b":140000},"1":{"a":160000,"b":25500},"2":{"a":220000,"b":140000},"3":{"a":145000,"b":100000},"4":{"a":470000,"b":50000},"5":{"a":560000,"b":430000},"7":{"a":-1,"b":125000}},"/items/rainbow_spear":{"0":{"a":155000,"b":135000},"1":{"a":190000,"b":-1},"2":{"a":205000,"b":-1},"5":{"a":800000,"b":400000},"6":{"a":2000000,"b":-1}},"/items/rainbow_sword":{"0":{"a":155000,"b":140000},"1":{"a":150000,"b":-1},"2":{"a":200000,"b":-1},"3":{"a":230000,"b":-1},"4":{"a":340000,"b":-1},"5":{"a":520000,"b":-1},"10":{"a":-1,"b":7000000},"20":{"a":-1,"b":680000}},"/items/ranged_coffee":{"0":{"a":760,"b":740}},"/items/ranger_necklace":{"0":{"a":12000000,"b":10500000},"1":{"a":-1,"b":1100000},"3":{"a":-1,"b":21000000},"5":{"a":76000000,"b":740000}},"/items/red_culinary_hat":{"0":{"a":5800000,"b":5600000},"1":{"a":6000000,"b":5000000},"2":{"a":-1,"b":3900000},"3":{"a":-1,"b":4000000},"4":{"a":-1,"b":4300000},"5":{"a":7000000,"b":6800000},"6":{"a":9800000,"b":8400000},"7":{"a":14000000,"b":10000000},"8":{"a":-1,"b":12000000},"9":{"a":40000000,"b":410000},"10":{"a":52000000,"b":45000000},"11":{"a":-1,"b":50000000},"15":{"a":-1,"b":120000000}},"/items/red_panda_fluff":{"0":{"a":600000,"b":580000}},"/items/red_tea_leaf":{"0":{"a":49,"b":48}},"/items/redwood_bow":{"0":{"a":215000,"b":210000},"1":{"a":210000,"b":-1},"3":{"a":680000,"b":-1},"4":{"a":300000,"b":-1},"5":{"a":330000,"b":-1},"6":{"a":700000,"b":-1},"7":{"a":2500000,"b":-1}},"/items/redwood_crossbow":{"0":{"a":180000,"b":170000},"1":{"a":180000,"b":-1},"2":{"a":185000,"b":-1},"3":{"a":150000,"b":-1},"4":{"a":230000,"b":-1},"5":{"a":330000,"b":205000},"6":{"a":960000,"b":-1},"7":{"a":2550000,"b":1150000},"10":{"a":25000000,"b":-1}},"/items/redwood_fire_staff":{"0":{"a":175000,"b":170000},"1":{"a":190000,"b":-1},"2":{"a":210000,"b":-1},"3":{"a":290000,"b":-1},"4":{"a":560000,"b":-1},"5":{"a":720000,"b":640000},"7":{"a":2400000,"b":-1},"8":{"a":-1,"b":1500000},"9":{"a":-1,"b":2100000},"10":{"a":-1,"b":3300000}},"/items/redwood_log":{"0":{"a":39,"b":37}},"/items/redwood_lumber":{"0":{"a":680,"b":660}},"/items/redwood_nature_staff":{"0":{"a":175000,"b":170000},"1":{"a":220000,"b":-1},"2":{"a":280000,"b":-1},"3":{"a":240000,"b":-1},"4":{"a":400000,"b":-1},"5":{"a":490000,"b":200000},"6":{"a":2100000,"b":-1},"8":{"a":-1,"b":32000},"9":{"a":-1,"b":60000},"10":{"a":-1,"b":50000}},"/items/redwood_shield":{"0":{"a":115000,"b":98000},"1":{"a":110000,"b":-1},"2":{"a":115000,"b":-1},"3":{"a":135000,"b":-1},"4":{"a":220000,"b":-1},"5":{"a":300000,"b":-1},"6":{"a":900000,"b":-1}},"/items/redwood_water_staff":{"0":{"a":190000,"b":165000},"2":{"a":200000,"b":-1},"3":{"a":225000,"b":-1},"5":{"a":295000,"b":-1},"6":{"a":380000,"b":-1},"7":{"a":1400000,"b":-1}},"/items/regal_jewel":{"0":{"a":16000000,"b":15500000}},"/items/regal_sword":{"0":{"a":-1,"b":300000000},"2":{"a":-1,"b":5800000},"3":{"a":-1,"b":5800000},"5":{"a":340000000,"b":310000000},"6":{"a":340000000,"b":320000000},"7":{"a":360000000,"b":350000000},"8":{"a":440000000,"b":410000000},"10":{"a":740000000,"b":350000000},"12":{"a":2150000000,"b":-1},"13":{"a":-1,"b":380000000},"16":{"a":-1,"b":36000000}},"/items/rejuvenate":{"0":{"a":330000,"b":320000}},"/items/reptile_boots":{"0":{"a":8400,"b":6600},"1":{"a":9000,"b":-1},"2":{"a":5000000,"b":-1}},"/items/reptile_bracers":{"0":{"a":7600,"b":5200},"1":{"a":50000,"b":-1},"2":{"a":4000000,"b":-1},"4":{"a":62000,"b":-1}},"/items/reptile_chaps":{"0":{"a":14000,"b":10500}},"/items/reptile_hide":{"0":{"a":8,"b":7}},"/items/reptile_hood":{"0":{"a":9200,"b":8800},"3":{"a":70000,"b":-1},"5":{"a":100000,"b":-1},"6":{"a":350000,"b":-1}},"/items/reptile_leather":{"0":{"a":285,"b":265}},"/items/reptile_tunic":{"0":{"a":12000,"b":9000},"1":{"a":19500,"b":-1},"3":{"a":31000,"b":-1}},"/items/revenant_anima":{"0":{"a":1150000,"b":1100000}},"/items/revenant_chaps":{"0":{"a":8600000,"b":8200000},"1":{"a":9000000,"b":-1},"2":{"a":9800000,"b":-1},"5":{"a":10500000,"b":9800000},"6":{"a":14500000,"b":11000000},"7":{"a":19500000,"b":15500000},"8":{"a":29000000,"b":17000000},"10":{"a":62000000,"b":50000000},"12":{"a":140000000,"b":-1}},"/items/revenant_tunic":{"0":{"a":10500000,"b":10000000},"5":{"a":15500000,"b":13500000},"6":{"a":19000000,"b":15000000},"7":{"a":-1,"b":15000000},"8":{"a":35000000,"b":31000000},"9":{"a":50000000,"b":-1},"10":{"a":58000000,"b":50000000},"12":{"a":145000000,"b":-1}},"/items/revive":{"0":{"a":2250000,"b":2150000}},"/items/ring_of_armor":{"0":{"a":6600000,"b":6200000},"1":{"a":-1,"b":7000000},"2":{"a":15000000,"b":-1},"3":{"a":23500000,"b":-1},"4":{"a":24000000,"b":5400000},"8":{"a":-1,"b":400000}},"/items/ring_of_critical_strike":{"0":{"a":9200000,"b":8800000},"1":{"a":10500000,"b":2300000},"2":{"a":14000000,"b":-1},"3":{"a":23000000,"b":15500000},"4":{"a":-1,"b":29000000},"5":{"a":82000000,"b":60000000}},"/items/ring_of_essence_find":{"0":{"a":7000000,"b":6800000},"2":{"a":12000000,"b":-1},"3":{"a":17000000,"b":-1},"4":{"a":29500000,"b":240000},"5":{"a":-1,"b":66000}},"/items/ring_of_gathering":{"0":{"a":7400000,"b":6600000},"1":{"a":11500000,"b":6400000},"2":{"a":16500000,"b":-1},"3":{"a":-1,"b":14500000},"4":{"a":-1,"b":25000000},"5":{"a":100000000,"b":16500000}},"/items/ring_of_rare_find":{"0":{"a":8000000,"b":7600000},"1":{"a":12000000,"b":7600000},"2":{"a":14000000,"b":12500000},"3":{"a":21500000,"b":18000000},"4":{"a":42000000,"b":21500000},"5":{"a":82000000,"b":42000000},"6":{"a":-1,"b":3100000},"20":{"a":-1,"b":350000}},"/items/ring_of_regeneration":{"0":{"a":7600000,"b":7200000},"1":{"a":10000000,"b":8000000},"2":{"a":13500000,"b":10000000},"3":{"a":20500000,"b":20000000},"4":{"a":38000000,"b":35000000},"5":{"a":72000000,"b":70000000},"6":{"a":140000000,"b":100000000},"7":{"a":180000000,"b":150000000}},"/items/ring_of_resistance":{"0":{"a":6800000,"b":6000000},"1":{"a":20000000,"b":-1}},"/items/rippling_trident":{"0":{"a":400000000,"b":370000000},"1":{"a":-1,"b":160000000},"7":{"a":-1,"b":380000000},"8":{"a":520000000,"b":76000000},"10":{"a":860000000,"b":700000000},"11":{"a":-1,"b":5200000},"12":{"a":2100000000,"b":1300000000},"14":{"a":-1,"b":8400000}},"/items/robusta_coffee_bean":{"0":{"a":155,"b":140}},"/items/rough_boots":{"0":{"a":2100,"b":2050},"1":{"a":56000,"b":-1},"2":{"a":50000,"b":-1},"3":{"a":100000000000,"b":-1},"4":{"a":100000,"b":-1},"5":{"a":90000,"b":-1},"10":{"a":-1,"b":740000},"11":{"a":1950000,"b":-1}},"/items/rough_bracers":{"0":{"a":2150,"b":2100},"1":{"a":3000,"b":-1},"2":{"a":180000,"b":-1},"3":{"a":50000,"b":-1},"4":{"a":100000,"b":-1},"5":{"a":125000,"b":-1},"7":{"a":1000000,"b":-1}},"/items/rough_chaps":{"0":{"a":3400,"b":3300},"1":{"a":100000,"b":-1},"3":{"a":440000,"b":-1}},"/items/rough_hide":{"0":{"a":44,"b":42}},"/items/rough_hood":{"0":{"a":2300,"b":2050},"1":{"a":600000,"b":-1},"5":{"a":120000,"b":-1}},"/items/rough_leather":{"0":{"a":265,"b":255}},"/items/rough_tunic":{"0":{"a":2900,"b":2450},"1":{"a":8800,"b":-1},"5":{"a":120000,"b":-1},"7":{"a":1000000,"b":-1}},"/items/royal_cloth":{"0":{"a":11000000,"b":10500000}},"/items/royal_fire_robe_bottoms":{"0":{"a":94000000,"b":84000000},"1":{"a":-1,"b":30000000},"5":{"a":100000000,"b":94000000},"6":{"a":-1,"b":100000000},"7":{"a":120000000,"b":115000000},"8":{"a":180000000,"b":135000000},"10":{"a":370000000,"b":-1},"12":{"a":-1,"b":1300000000}},"/items/royal_fire_robe_top":{"0":{"a":150000000,"b":105000000},"5":{"a":120000000,"b":110000000},"6":{"a":-1,"b":115000000},"7":{"a":145000000,"b":140000000},"8":{"a":205000000,"b":180000000},"10":{"a":-1,"b":410000000},"12":{"a":-1,"b":1500000000}},"/items/royal_nature_robe_bottoms":{"0":{"a":88000000,"b":80000000},"1":{"a":90000000,"b":-1},"5":{"a":110000000,"b":88000000},"7":{"a":115000000,"b":110000000},"8":{"a":-1,"b":110000000},"10":{"a":420000000,"b":380000000}},"/items/royal_nature_robe_top":{"0":{"a":100000000,"b":92000000},"5":{"a":115000000,"b":100000000},"6":{"a":125000000,"b":-1},"7":{"a":140000000,"b":130000000},"8":{"a":-1,"b":170000000},"10":{"a":460000000,"b":420000000}},"/items/royal_water_robe_bottoms":{"0":{"a":98000000,"b":86000000},"1":{"a":-1,"b":9800000},"2":{"a":-1,"b":9600000},"3":{"a":-1,"b":9800000},"4":{"a":-1,"b":8400000},"5":{"a":105000000,"b":96000000},"7":{"a":120000000,"b":115000000},"10":{"a":-1,"b":360000000},"12":{"a":-1,"b":1400000000}},"/items/royal_water_robe_top":{"0":{"a":115000000,"b":100000000},"1":{"a":-1,"b":9800000},"5":{"a":120000000,"b":105000000},"7":{"a":145000000,"b":140000000},"8":{"a":-1,"b":175000000},"10":{"a":460000000,"b":400000000},"12":{"a":1750000000,"b":-1}},"/items/scratch":{"0":{"a":3200,"b":3100}},"/items/shard_of_protection":{"0":{"a":60000,"b":58000}},"/items/shield_bash":{"0":{"a":64000,"b":62000}},"/items/shoebill_feather":{"0":{"a":68000,"b":66000}},"/items/shoebill_shoes":{"0":{"a":580000,"b":500000},"1":{"a":2400000,"b":-1},"2":{"a":600000,"b":-1},"3":{"a":620000,"b":-1},"4":{"a":680000,"b":-1},"5":{"a":740000,"b":520000},"6":{"a":1350000,"b":-1},"7":{"a":2200000,"b":-1},"10":{"a":9400000,"b":7000000},"12":{"a":-1,"b":16000000},"15":{"a":-1,"b":170000000}},"/items/sighted_bracers":{"0":{"a":195000,"b":190000},"1":{"a":200000,"b":-1},"2":{"a":235000,"b":-1},"3":{"a":250000,"b":-1},"5":{"a":320000,"b":250000},"6":{"a":600000,"b":300000},"7":{"a":1450000,"b":580000},"8":{"a":3300000,"b":2700000},"9":{"a":8000000,"b":2100000},"10":{"a":13000000,"b":12000000},"11":{"a":20000000,"b":12000000},"12":{"a":39000000,"b":21500000},"13":{"a":-1,"b":40000000}},"/items/silencing_shot":{"0":{"a":165000,"b":160000}},"/items/silk_boots":{"0":{"a":37000,"b":36000},"1":{"a":50000,"b":-1},"2":{"a":66000,"b":-1},"3":{"a":94000,"b":-1},"4":{"a":260000,"b":-1},"5":{"a":400000,"b":100000},"6":{"a":760000,"b":-1}},"/items/silk_fabric":{"0":{"a":1050,"b":1000}},"/items/silk_gloves":{"0":{"a":40000,"b":36000},"1":{"a":46000,"b":-1},"2":{"a":45000,"b":-1},"5":{"a":350000,"b":100000}},"/items/silk_hat":{"0":{"a":84000,"b":82000},"1":{"a":96000,"b":-1},"2":{"a":86000,"b":-1},"3":{"a":150000,"b":10000},"5":{"a":500000,"b":240000}},"/items/silk_robe_bottoms":{"0":{"a":120000,"b":110000},"1":{"a":165000,"b":-1},"2":{"a":140000,"b":-1},"3":{"a":145000,"b":-1},"4":{"a":185000,"b":-1},"5":{"a":190000,"b":-1}},"/items/silk_robe_top":{"0":{"a":125000,"b":120000},"1":{"a":220000,"b":-1},"3":{"a":145000,"b":-1},"4":{"a":185000,"b":-1},"5":{"a":295000,"b":120000},"6":{"a":1350000,"b":-1},"7":{"a":1500000,"b":-1}},"/items/sinister_chest_key":{"0":{"a":4800000,"b":4700000}},"/items/sinister_entry_key":{"0":{"a":360000,"b":340000}},"/items/sinister_essence":{"0":{"a":940,"b":920}},"/items/smack":{"0":{"a":3100,"b":3000}},"/items/small_pouch":{"0":{"a":11500,"b":11000},"1":{"a":15000,"b":-1},"2":{"a":23500,"b":-1},"5":{"a":295000,"b":-1},"6":{"a":500000,"b":-1},"20":{"a":-1,"b":1000}},"/items/smoke_burst":{"0":{"a":66000,"b":62000}},"/items/snail_shell":{"0":{"a":7400,"b":7200}},"/items/snail_shell_helmet":{"0":{"a":22000,"b":21000},"1":{"a":22500,"b":-1},"2":{"a":25000,"b":-1},"3":{"a":48000,"b":-1},"4":{"a":86000,"b":-1},"5":{"a":100000,"b":-1}},"/items/snake_fang":{"0":{"a":3800,"b":3600}},"/items/snake_fang_dirk":{"0":{"a":18500,"b":17500},"1":{"a":22000,"b":13000},"2":{"a":29500,"b":13000},"3":{"a":40000,"b":-1},"4":{"a":70000,"b":-1},"5":{"a":86000,"b":21000},"6":{"a":140000,"b":-1},"7":{"a":720000,"b":-1},"8":{"a":800000,"b":-1},"10":{"a":2150000,"b":-1},"12":{"a":27500000,"b":-1},"13":{"a":98000000,"b":-1},"15":{"a":125000000,"b":-1}},"/items/sorcerer_boots":{"0":{"a":700000,"b":660000},"1":{"a":740000,"b":490000},"2":{"a":-1,"b":490000},"3":{"a":-1,"b":490000},"4":{"a":760000,"b":520000},"5":{"a":960000,"b":940000},"6":{"a":1250000,"b":960000},"7":{"a":1900000,"b":1700000},"8":{"a":4500000,"b":3600000},"9":{"a":9200000,"b":7400000},"10":{"a":13500000,"b":13000000},"11":{"a":-1,"b":20500000},"12":{"a":48000000,"b":45000000},"13":{"a":110000000,"b":-1},"14":{"a":215000000,"b":200000000},"15":{"a":-1,"b":350000000},"16":{"a":-1,"b":680000000}},"/items/sorcerer_essence":{"0":{"a":125,"b":120}},"/items/sorcerers_sole":{"0":{"a":130000,"b":125000}},"/items/soul_fragment":{"0":{"a":1450000,"b":1400000}},"/items/soul_hunter_crossbow":{"0":{"a":30000000,"b":26000000},"3":{"a":-1,"b":15500000},"5":{"a":28500000,"b":27500000},"6":{"a":46000000,"b":26000000},"7":{"a":50000000,"b":33000000},"8":{"a":56000000,"b":48000000},"9":{"a":125000000,"b":-1},"10":{"a":115000000,"b":105000000},"11":{"a":-1,"b":155000000},"12":{"a":390000000,"b":-1}},"/items/spaceberry":{"0":{"a":155,"b":150}},"/items/spaceberry_cake":{"0":{"a":1200,"b":1150}},"/items/spaceberry_donut":{"0":{"a":900,"b":880}},"/items/spacia_coffee_bean":{"0":{"a":600,"b":580}},"/items/speed_aura":{"0":{"a":6000000,"b":5800000}},"/items/spike_shell":{"0":{"a":49000,"b":44000}},"/items/spiked_bulwark":{"0":{"a":13500000,"b":9400000},"3":{"a":14000000,"b":-1},"5":{"a":15500000,"b":15000000},"10":{"a":-1,"b":30000000}},"/items/stalactite_shard":{"0":{"a":660000,"b":640000}},"/items/stalactite_spear":{"0":{"a":12500000,"b":8800000},"5":{"a":14000000,"b":11500000},"6":{"a":17000000,"b":-1},"7":{"a":20500000,"b":-1},"8":{"a":58000000,"b":-1},"10":{"a":64000000,"b":-1},"12":{"a":190000000,"b":-1},"14":{"a":680000000,"b":-1}},"/items/stamina_coffee":{"0":{"a":420,"b":390}},"/items/star_fragment":{"0":{"a":14000,"b":13500}},"/items/star_fruit":{"0":{"a":340,"b":330}},"/items/star_fruit_gummy":{"0":{"a":900,"b":880}},"/items/star_fruit_yogurt":{"0":{"a":1200,"b":1150}},"/items/steady_shot":{"0":{"a":165000,"b":160000}},"/items/stone_key_fragment":{"0":{"a":2300000,"b":2250000}},"/items/strawberry":{"0":{"a":82,"b":78}},"/items/strawberry_cake":{"0":{"a":620,"b":580}},"/items/strawberry_donut":{"0":{"a":450,"b":400}},"/items/stunning_blow":{"0":{"a":165000,"b":160000}},"/items/sugar":{"0":{"a":13,"b":12}},"/items/sundering_crossbow":{"0":{"a":390000000,"b":330000000},"3":{"a":-1,"b":210000000},"4":{"a":-1,"b":250000000},"5":{"a":370000000,"b":330000000},"6":{"a":360000000,"b":350000000},"7":{"a":380000000,"b":360000000},"8":{"a":440000000,"b":410000000},"9":{"a":-1,"b":54000000},"10":{"a":740000000,"b":720000000},"11":{"a":-1,"b":98000000},"12":{"a":1950000000,"b":1000000000},"13":{"a":-1,"b":21500000},"15":{"a":-1,"b":5400000}},"/items/sundering_jewel":{"0":{"a":16000000,"b":15500000}},"/items/sunstone":{"0":{"a":560000,"b":540000}},"/items/super_alchemy_tea":{"0":{"a":3400,"b":3000}},"/items/super_attack_coffee":{"0":{"a":3000,"b":2750}},"/items/super_brewing_tea":{"0":{"a":2800,"b":2750}},"/items/super_cheesesmithing_tea":{"0":{"a":4400,"b":4100}},"/items/super_cooking_tea":{"0":{"a":2850,"b":2600}},"/items/super_crafting_tea":{"0":{"a":3900,"b":3800}},"/items/super_defense_coffee":{"0":{"a":2750,"b":2700}},"/items/super_enhancing_tea":{"0":{"a":4800,"b":4600}},"/items/super_foraging_tea":{"0":{"a":2100,"b":2000}},"/items/super_intelligence_coffee":{"0":{"a":2100,"b":2050}},"/items/super_magic_coffee":{"0":{"a":4300,"b":4200}},"/items/super_milking_tea":{"0":{"a":1900,"b":1800}},"/items/super_power_coffee":{"0":{"a":4100,"b":4000}},"/items/super_ranged_coffee":{"0":{"a":4100,"b":4000}},"/items/super_stamina_coffee":{"0":{"a":2150,"b":2050}},"/items/super_tailoring_tea":{"0":{"a":4300,"b":4100}},"/items/super_woodcutting_tea":{"0":{"a":2150,"b":2050}},"/items/swamp_essence":{"0":{"a":13,"b":12}},"/items/sweep":{"0":{"a":33000,"b":32000}},"/items/swiftness_coffee":{"0":{"a":1650,"b":1600}},"/items/sylvan_aura":{"0":{"a":5600000,"b":5200000}},"/items/tailoring_essence":{"0":{"a":155,"b":150}},"/items/tailoring_tea":{"0":{"a":560,"b":540}},"/items/tailors_bottoms":{"0":{"a":200000000,"b":-1},"5":{"a":145000000,"b":66000000},"8":{"a":205000000,"b":-1}},"/items/tailors_top":{"0":{"a":-1,"b":21500000},"5":{"a":135000000,"b":58000000},"8":{"a":195000000,"b":80000000},"10":{"a":380000000,"b":-1}},"/items/taunt":{"0":{"a":64000,"b":62000}},"/items/thread_of_expertise":{"0":{"a":6800000,"b":6600000}},"/items/tome_of_healing":{"0":{"a":39000,"b":38000},"1":{"a":40000,"b":21000},"2":{"a":42000,"b":22000},"3":{"a":47000,"b":-1},"4":{"a":58000,"b":-1},"5":{"a":60000,"b":58000},"6":{"a":110000,"b":86000},"7":{"a":215000,"b":205000},"8":{"a":450000,"b":420000},"9":{"a":980000,"b":740000},"10":{"a":1950000,"b":1750000},"11":{"a":10000000,"b":440000},"12":{"a":12000000,"b":8000000},"13":{"a":20500000,"b":-1},"14":{"a":41000000,"b":-1},"15":{"a":150000000,"b":-1}},"/items/tome_of_the_elements":{"0":{"a":440000,"b":430000},"1":{"a":490000,"b":300000},"2":{"a":560000,"b":320000},"3":{"a":500000,"b":-1},"5":{"a":500000,"b":460000},"6":{"a":680000,"b":500000},"7":{"a":1200000,"b":960000},"8":{"a":2750000,"b":2350000},"9":{"a":7600000,"b":4300000},"10":{"a":14000000,"b":13500000},"11":{"a":22500000,"b":15000000}},"/items/toughness":{"0":{"a":64000,"b":62000}},"/items/toxic_pollen":{"0":{"a":155000,"b":150000}},"/items/treant_bark":{"0":{"a":27000,"b":26500}},"/items/treant_shield":{"0":{"a":130000,"b":125000},"1":{"a":-1,"b":90000},"2":{"a":135000,"b":94000},"3":{"a":130000,"b":96000},"4":{"a":130000,"b":98000},"5":{"a":160000,"b":125000},"6":{"a":540000,"b":155000},"7":{"a":840000,"b":-1},"8":{"a":1350000,"b":-1},"9":{"a":4000000,"b":-1},"12":{"a":23000000,"b":-1}},"/items/turtle_shell":{"0":{"a":9000,"b":8600}},"/items/turtle_shell_body":{"0":{"a":37000,"b":36000},"1":{"a":56000,"b":-1},"2":{"a":37000,"b":-1},"3":{"a":45000,"b":-1},"5":{"a":94000,"b":-1}},"/items/turtle_shell_legs":{"0":{"a":29500,"b":28500},"3":{"a":45000,"b":-1},"5":{"a":100000,"b":-1}},"/items/twilight_essence":{"0":{"a":320,"b":310}},"/items/ultra_alchemy_tea":{"0":{"a":6800,"b":6400}},"/items/ultra_attack_coffee":{"0":{"a":10000,"b":9800}},"/items/ultra_brewing_tea":{"0":{"a":6400,"b":6000}},"/items/ultra_cheesesmithing_tea":{"0":{"a":8400,"b":7600}},"/items/ultra_cooking_tea":{"0":{"a":6200,"b":6000}},"/items/ultra_crafting_tea":{"0":{"a":7200,"b":7000}},"/items/ultra_defense_coffee":{"0":{"a":10000,"b":9000}},"/items/ultra_enhancing_tea":{"0":{"a":9600,"b":9200}},"/items/ultra_foraging_tea":{"0":{"a":5200,"b":5000}},"/items/ultra_intelligence_coffee":{"0":{"a":9400,"b":8600}},"/items/ultra_magic_coffee":{"0":{"a":12000,"b":11500}},"/items/ultra_milking_tea":{"0":{"a":5800,"b":5200}},"/items/ultra_power_coffee":{"0":{"a":12000,"b":11500}},"/items/ultra_ranged_coffee":{"0":{"a":12000,"b":11500}},"/items/ultra_stamina_coffee":{"0":{"a":9600,"b":9000}},"/items/ultra_tailoring_tea":{"0":{"a":8600,"b":7000}},"/items/ultra_woodcutting_tea":{"0":{"a":5800,"b":5400}},"/items/umbral_boots":{"0":{"a":88000,"b":86000},"2":{"a":145000,"b":-1},"4":{"a":500000,"b":-1},"5":{"a":840000,"b":-1}},"/items/umbral_bracers":{"0":{"a":155000,"b":140000},"2":{"a":250000,"b":-1},"4":{"a":600000,"b":-1},"5":{"a":940000,"b":250000},"6":{"a":2200000,"b":-1}},"/items/umbral_chaps":{"0":{"a":270000,"b":250000},"1":{"a":-1,"b":170000},"2":{"a":330000,"b":175000},"3":{"a":440000,"b":185000},"4":{"a":640000,"b":190000},"5":{"a":1200000,"b":800000},"7":{"a":4500000,"b":-1},"9":{"a":10000000,"b":-1},"10":{"a":-1,"b":2000000}},"/items/umbral_hide":{"0":{"a":150,"b":145}},"/items/umbral_hood":{"0":{"a":200000,"b":195000},"1":{"a":230000,"b":120000},"2":{"a":300000,"b":125000},"3":{"a":490000,"b":135000},"4":{"a":960000,"b":150000},"5":{"a":960000,"b":700000},"6":{"a":3000000,"b":200000}},"/items/umbral_leather":{"0":{"a":1350,"b":1300}},"/items/umbral_tunic":{"0":{"a":295000,"b":290000},"1":{"a":360000,"b":170000},"2":{"a":360000,"b":175000},"3":{"a":540000,"b":180000},"4":{"a":680000,"b":200000},"5":{"a":800000,"b":700000}},"/items/vampire_fang":{"0":{"a":680000,"b":660000}},"/items/vampire_fang_dirk":{"0":{"a":13000000,"b":9800000},"2":{"a":14000000,"b":-1},"3":{"a":14500000,"b":-1},"5":{"a":14000000,"b":13500000},"6":{"a":-1,"b":14000000},"7":{"a":-1,"b":17500000},"8":{"a":40000000,"b":-1}},"/items/vampiric_bow":{"0":{"a":12000000,"b":8600000},"1":{"a":12000000,"b":-1},"5":{"a":12500000,"b":6000000},"7":{"a":35000000,"b":-1},"8":{"a":30000000,"b":410000},"10":{"a":88000000,"b":-1}},"/items/vampirism":{"0":{"a":52000,"b":50000}},"/items/verdant_alembic":{"0":{"a":12500,"b":10500},"1":{"a":2000000,"b":-1},"2":{"a":100000,"b":-1},"3":{"a":115000,"b":-1},"5":{"a":165000,"b":-1}},"/items/verdant_boots":{"0":{"a":8000,"b":7000}},"/items/verdant_brush":{"0":{"a":10500,"b":8600},"1":{"a":1050000,"b":-1},"2":{"a":120000,"b":-1},"3":{"a":105000,"b":-1},"4":{"a":450000,"b":-1},"5":{"a":900000,"b":-1}},"/items/verdant_buckler":{"0":{"a":7600,"b":4200},"10":{"a":4000000,"b":-1}},"/items/verdant_bulwark":{"0":{"a":15000,"b":10500},"1":{"a":80000,"b":-1},"2":{"a":23500,"b":-1},"3":{"a":285000,"b":-1},"5":{"a":96000,"b":-1},"10":{"a":1000000,"b":-1}},"/items/verdant_cheese":{"0":{"a":380,"b":360}},"/items/verdant_chisel":{"0":{"a":10500,"b":9600},"1":{"a":170000,"b":-1},"8":{"a":50000000,"b":-1}},"/items/verdant_enhancer":{"0":{"a":11500,"b":8800},"1":{"a":22000,"b":-1},"2":{"a":29000,"b":-1}},"/items/verdant_gauntlets":{"0":{"a":8000,"b":7000},"2":{"a":110000,"b":-1},"3":{"a":290000,"b":-1},"5":{"a":270000,"b":-1},"7":{"a":840000,"b":-1}},"/items/verdant_hammer":{"0":{"a":11000,"b":10000},"1":{"a":60000,"b":-1},"2":{"a":200000,"b":-1},"3":{"a":380000,"b":-1},"5":{"a":580000,"b":-1}},"/items/verdant_hatchet":{"0":{"a":12000,"b":8400},"1":{"a":49000,"b":-1},"2":{"a":110000,"b":560},"5":{"a":250000,"b":-1}},"/items/verdant_helmet":{"0":{"a":8600,"b":7800},"1":{"a":290000,"b":-1}},"/items/verdant_mace":{"0":{"a":14000,"b":12500},"3":{"a":175000,"b":-1}},"/items/verdant_milk":{"0":{"a":82,"b":78}},"/items/verdant_needle":{"0":{"a":13000,"b":10000},"1":{"a":80000,"b":-1},"2":{"a":98000,"b":-1},"5":{"a":250000,"b":-1}},"/items/verdant_plate_body":{"0":{"a":13000,"b":12000},"1":{"a":19500,"b":-1},"2":{"a":31000,"b":-1},"5":{"a":160000,"b":-1}},"/items/verdant_plate_legs":{"0":{"a":12500,"b":11500},"1":{"a":580000,"b":-1},"2":{"a":110000,"b":-1}},"/items/verdant_pot":{"0":{"a":11500,"b":9400},"1":{"a":21000,"b":-1},"2":{"a":100000,"b":-1}},"/items/verdant_shears":{"0":{"a":13000,"b":10500},"1":{"a":16000,"b":-1},"2":{"a":94000,"b":-1},"3":{"a":100000000,"b":-1},"4":{"a":215000,"b":-1},"5":{"a":145000,"b":-1},"8":{"a":500000,"b":-1}},"/items/verdant_spatula":{"0":{"a":11500,"b":11000},"2":{"a":270000,"b":-1}},"/items/verdant_spear":{"0":{"a":14000,"b":13500},"1":{"a":160000,"b":-1},"2":{"a":41000,"b":-1},"4":{"a":-1,"b":36000},"5":{"a":295000,"b":-1}},"/items/verdant_sword":{"0":{"a":15000,"b":14000},"1":{"a":17500,"b":-1},"2":{"a":34000,"b":1000},"3":{"a":34000,"b":17500},"5":{"a":98000,"b":-1},"10":{"a":1400000,"b":-1}},"/items/vision_helmet":{"0":{"a":98000,"b":78000},"1":{"a":110000,"b":82000},"2":{"a":115000,"b":84000},"3":{"a":130000,"b":88000},"4":{"a":235000,"b":90000},"5":{"a":195000,"b":130000},"6":{"a":380000,"b":155000},"7":{"a":2050000,"b":-1},"8":{"a":4500000,"b":20000},"10":{"a":-1,"b":3100000}},"/items/vision_shield":{"0":{"a":225000,"b":220000},"1":{"a":250000,"b":-1},"2":{"a":215000,"b":-1},"3":{"a":330000,"b":-1},"4":{"a":450000,"b":-1},"5":{"a":580000,"b":175000},"6":{"a":1200000,"b":-1},"7":{"a":1400000,"b":-1},"8":{"a":2850000,"b":2000000},"10":{"a":10000000,"b":-1}},"/items/watchful_relic":{"0":{"a":3900000,"b":3600000},"1":{"a":5000000,"b":3700000},"2":{"a":5200000,"b":540000},"3":{"a":5200000,"b":560000},"4":{"a":4800000,"b":500000},"5":{"a":4700000,"b":4200000},"6":{"a":5400000,"b":680000},"7":{"a":9200000,"b":-1},"8":{"a":13500000,"b":8800000},"9":{"a":22000000,"b":3500000},"10":{"a":33000000,"b":25000000},"12":{"a":92000000,"b":-1}},"/items/water_strike":{"0":{"a":11500,"b":11000}},"/items/werewolf_claw":{"0":{"a":660000,"b":640000}},"/items/werewolf_slasher":{"0":{"a":14000000,"b":11000000},"1":{"a":-1,"b":520000},"2":{"a":15000000,"b":-1},"3":{"a":15500000,"b":8000000},"4":{"a":-1,"b":520000},"5":{"a":15000000,"b":14500000},"6":{"a":19000000,"b":16000000},"7":{"a":24500000,"b":21500000},"8":{"a":35000000,"b":31000000},"9":{"a":-1,"b":7000000},"10":{"a":78000000,"b":70000000}},"/items/wheat":{"0":{"a":29,"b":27}},"/items/white_key_fragment":{"0":{"a":1250000,"b":1200000}},"/items/wisdom_coffee":{"0":{"a":1250,"b":1200}},"/items/wisdom_tea":{"0":{"a":660,"b":640}},"/items/wizard_necklace":{"0":{"a":13000000,"b":12500000},"1":{"a":-1,"b":12000000},"2":{"a":21500000,"b":18000000},"3":{"a":-1,"b":32000000},"4":{"a":64000000,"b":33000000},"5":{"a":115000000,"b":80000000},"7":{"a":205000000,"b":-1},"8":{"a":295000000,"b":-1},"10":{"a":580000000,"b":100000000}},"/items/woodcutting_essence":{"0":{"a":195,"b":190}},"/items/woodcutting_tea":{"0":{"a":540,"b":480}},"/items/wooden_bow":{"0":{"a":4500,"b":4100},"1":{"a":4700,"b":-1},"2":{"a":9800,"b":-1},"3":{"a":30000,"b":-1},"4":{"a":12000000,"b":-1},"5":{"a":100000,"b":-1},"10":{"a":4000000,"b":-1}},"/items/wooden_crossbow":{"0":{"a":3700,"b":3200},"1":{"a":11500,"b":-1},"3":{"a":16500,"b":-1},"4":{"a":140000,"b":-1}},"/items/wooden_fire_staff":{"0":{"a":3600,"b":3100},"1":{"a":6800,"b":500},"3":{"a":37000,"b":-1},"4":{"a":1050000,"b":-1},"5":{"a":88000,"b":-1}},"/items/wooden_nature_staff":{"0":{"a":3900,"b":3300},"1":{"a":31000,"b":500},"2":{"a":20000,"b":-1},"3":{"a":23000,"b":-1},"5":{"a":36000,"b":-1}},"/items/wooden_shield":{"0":{"a":2050,"b":1700},"1":{"a":720000,"b":-1},"3":{"a":760000,"b":-1},"5":{"a":200000,"b":-1},"6":{"a":180000,"b":-1}},"/items/wooden_water_staff":{"0":{"a":3900,"b":3300},"1":{"a":14000,"b":500},"2":{"a":2200000,"b":-1},"3":{"a":400000,"b":-1},"4":{"a":52000,"b":-1}},"/items/yogurt":{"0":{"a":205,"b":200}}},"timestamp":1749272897}`;
    let isClientDataValid = true;
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
        try {
            const obj = JSON.parse(decompressString(localStorage.getItem("initClientData")));
            // console.log(obj);
            GM_setValue("init_client_data", localStorage.getItem("initClientData"));

            initData_actionDetailMap = obj.actionDetailMap;
            initData_levelExperienceTable = obj.levelExperienceTable;
            initData_itemDetailMap = obj.itemDetailMap;
            initData_actionCategoryDetailMap = obj.actionCategoryDetailMap;
            initData_abilityDetailMap = obj.abilityDetailMap;
            const matches = findKeysLike(obj, "duration");
            for (const [key, value] of Object.entries(initData_itemDetailMap)) {
                itemEnNameToHridMap[value.name] = key;
            }
        } catch (e) {

        }
    }
    let activeFetchMarketPromise = null;
    let fetchMarketCalledSuccess = false;
    hookWS();

    function findKeysLike(obj, searchTerm = "duration", path = "") {
        const results = [];
        const termLower = searchTerm.toLowerCase();

        function walk(current, currentPath) {
            if (typeof current !== "object" || current === null) return;

            for (const key of Object.keys(current)) {
                const fullPath = currentPath ? `${currentPath}.${key}` : key;

                // fuzzy-ish check: does key include search term ignoring case?
                if (key.toLowerCase().includes(termLower)) {
                    results.push({ path: fullPath, value: current[key] });
                }

                // recurse into objects & arrays
                if (typeof current[key] === "object" && current[key] !== null) {
                    walk(current[key], fullPath);
                }
            }
        }

        walk(obj, path);
        return results;
    }

    const currentApiVersion = 2;
    const ApiVersion = localStorage.getItem("MWITools_marketAPI_ApiVersion");

    if (!ApiVersion || parseInt(ApiVersion) < currentApiVersion) {
        logger("Clearing API cache due to ApiVersion update", EXTENDED_SCRIPT_COLORS.darkRed);
        localStorage.setItem("MWITools_marketAPI_timestamp", JSON.stringify(0));
        localStorage.setItem("MWITools_marketAPI_json", JSON.stringify(null));
        localStorage.setItem("MWITools_marketAPI_ApiVersion", JSON.stringify(currentApiVersion));
    }

    fetchMarketJSON(true);

    async function hookWS() {
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
        try {
            let obj = JSON.parse(message);
            if (obj && obj.type === "init_character_data") {
                // console.log(obj);
                GM_setValue("init_character_data", message);
                localStorage.setItem("init_character_data", message);
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
                waitForVisibleTabPanel();

                waitForAbilityToolTip();

                if (settingsMap.skillbook.isTrue) {
                    waitForItemDict();
                }
                if (settingsMap.ThirdPartyLinks.isTrue) {
                    add3rdPartyLinks();
                }
                if (settingsMap.networth.isTrue) {
                    if (settingsMap.graphicStyle.isTrue) {
                        calculateNetworth();
                    } else {
                        calculateNetworthOld();
                    }
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
                // console.log(obj);
                GM_setValue("init_client_data", message);

                initData_actionDetailMap = obj.actionDetailMap;
                initData_levelExperienceTable = obj.levelExperienceTable;
                initData_itemDetailMap = obj.itemDetailMap;
                initData_actionCategoryDetailMap = obj.actionCategoryDetailMap;
                initData_abilityDetailMap = obj.abilityDetailMap;

                for (const [key, value] of Object.entries(initData_itemDetailMap)) {
                    itemEnNameToHridMap[value.name] = key;
                }
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
                        playersMP = [];
                        startTime = null;
                        endTime = null;
                        totalDuration = 0;
                        totalDamage = new Array(players.length).fill(0);
                        monsterCounts = {};
                        monsterEvasion = {};
                        monsterHrids = {};
                    }
                }
            } else if (obj && obj.type === "action_completed") {
                const action = obj.endCharacterAction;
                if (action && action.isDone === false) {
                    for (const a of currentActionsHridList) {
                        if (a.id === action.id) {
                            a.currentCount = action.currentCount;
                            break;
                        }
                    }
                }

                const endCharacterSkills = Array.isArray(obj.endCharacterSkills) ? obj.endCharacterSkills : null;
                if (endCharacterSkills && initData_characterSkills) {
                    for (const endSkill of endCharacterSkills) {
                        const skillHrid = endSkill.skillHrid;
                        for (const skill of initData_characterSkills) {
                            if (skill.skillHrid === skillHrid) {
                                skill.experience = endSkill.experience;
                                skill.level = endSkill.level;
                                break;
                            }
                        }
                    }
                }

                const endCharacterItems = Array.isArray(obj.endCharacterItems) ? obj.endCharacterItems : null;
                if (endCharacterItems && initData_characterItems) {
                    for (const endItem of endCharacterItems) {
                        for (const invItem of initData_characterItems) {
                            if (invItem.id === endItem.id) {
                                invItem.count = endItem.count;
                                break;
                            }
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
                    } else {
                        // Update inventory items
                        const index = initData_characterItems.findIndex((invItem) => invItem.id === item.id);
                        if (index !== -1) {
                            initData_characterItems[index].count = item.count;
                        } else {
                            initData_characterItems.push(item);
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
                    playersMP = obj.players.map((player) => player.currentManapoints);
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
                        monsterHrids[name] = monster.hrid;
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
                        logger("Found invalid profileExportList in store. profileExportList cleared.");
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
                if (settingsMap.showDamage.isTrue) {
                    const mMap = obj.mMap;
                    const pMap = obj.pMap;
                    const playerIndices = Object.keys(obj.pMap);

                    // Decide which player cast a spell by MP decrease.
                    let castPlayer = -1;
                    playerIndices.forEach((userIndex) => {
                        if (pMap[userIndex].cMP < playersMP[userIndex]) {
                            castPlayer = userIndex;
                        }
                        playersMP[userIndex] = pMap[userIndex].cMP;
                    });

                    monstersHP.forEach((mHP, mIndex) => {
                        const monster = mMap[mIndex];
                        if (monster) {
                            const hpDiff = mHP - monster.cHP;
                            monstersHP[mIndex] = monster.cHP;
                            if (hpDiff > 0) {
                                if (playerIndices.length > 1) {
                                    // Damage is resulted by ManaSpring or Bloom from one of the players.
                                    playerIndices.forEach((userIndex) => {
                                        if (userIndex === castPlayer) {
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
        } catch (e) {
            let obj = JSON.parse(decompressString(message));
            if (obj && obj.type === "init_client_data") {
                // console.log(obj);
                GM_setValue("init_client_data", message);

                initData_actionDetailMap = obj.actionDetailMap;
                initData_levelExperienceTable = obj.levelExperienceTable;
                initData_itemDetailMap = obj.itemDetailMap;
                initData_actionCategoryDetailMap = obj.actionCategoryDetailMap;
                initData_abilityDetailMap = obj.abilityDetailMap;

                for (const [key, value] of Object.entries(initData_itemDetailMap)) {
                    itemEnNameToHridMap[value.name] = key;
                }
            }
        }
        return message;
    }

    function isParsableJSON(value) {
        if (typeof value !== "string") return false;
        try {
            const parsed = JSON.parse(value);
            return typeof parsed === "object" && parsed !== null;
        } catch (e) {
            logger("isParsableJSON error: " + e, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
            return false;
        }
    }

    /* 计算Networth */
    async function calculateNetworth() {

        if (isParsableJSON(marketJson)) {
            marketJson = JSON.parse(marketJson);
            logger("Parsed marketJson from string", EXTENDED_SCRIPT_COLORS.brightGreen);
        } else if (typeof marketJson === "object" && marketJson !== null) {
            logger("Using cached marketJson as object", EXTENDED_SCRIPT_COLORS.brightGreen);
        } else {
            logger("marketJson is invalid", EXTENDED_SCRIPT_COLORS.red);
        }

        const marketAPIJson = marketJson ? marketJson : await fetchMarketJSON();

        if (!marketAPIJson) {
            logger("calculateNetworth marketAPIJson is null");
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
            try{
                const enhanceLevel = item.enhancementLevel;
                const marketPrices = marketAPIJson.marketData[item.itemHrid];

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
                        equippedNetworthAsk += item.count * (marketPrices[0]?.a > 0 ? marketPrices[0].a : 0);
                        equippedNetworthBid += item.count * (marketPrices[0]?.b > 0 ? marketPrices[0].b : 0);

                    } else {
                        inventoryNetworthAsk += item.count * (marketPrices[0]?.a > 0 ? marketPrices[0].a : 0);
                        inventoryNetworthBid += item.count * (marketPrices[0]?.b > 0 ? marketPrices[0].b : 0);
                    }
                } else {
                    logger(`calculateNetworth cannot find price of ${item.itemHrid}`, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
                }
            } catch (error) {
                logger(`calculateNetworth error processing item ${item.itemHrid}: ${error}`, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
                continue;
            }
        }

        for (const item of initData_myMarketListings) {
            const quantity = item.orderQuantity - item.filledQuantity;
            const enhancementLevel = item.enhancementLevel;
            const marketPrices = marketAPIJson.marketData[item.itemHrid];
            if (!marketPrices) {
                logger("calculateNetworth cannot get marketPrices of " + item.itemHrid, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
                return;
            }
            if (item.isSell) {
                if (item.itemHrid === "/items/bag_of_10_cowbells") {
                    marketPrices[0].a *= 1 - 18 / 100;
                    marketPrices[0].b *= 1 - 18 / 100;
                } else {
                    marketPrices[0].a *= 1 - 2 / 100;
                    marketPrices[0].b *= 1 - 2 / 100;
                }
                if (!enhancementLevel || enhancementLevel <= 1) {
                    marketListingsNetworthAsk += quantity * (marketPrices[0].a > 0 ? marketPrices[0].a : 0);
                    marketListingsNetworthBid += quantity * (marketPrices[0].b > 0 ? marketPrices[0].b : 0);
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
                marketListingsNetworthAsk += item.unclaimedItemCount * (marketPrices[0].a > 0 ? marketPrices[0].a : 0);
                marketListingsNetworthBid += item.unclaimedItemCount * (marketPrices[0].b > 0 ? marketPrices[0].b : 0);
            }
        }

        networthAsk = equippedNetworthAsk + inventoryNetworthAsk + marketListingsNetworthAsk;
        networthBid = equippedNetworthBid + inventoryNetworthBid + marketListingsNetworthBid;

        /* 仓库搜索栏下方显示人物总结 */
        // Some code of networth summery is by Stella.
        const addInventorySummery = async (invElem) => {

            invElem = document.querySelector(".Inventory_items__6SXv0");
            const [battleHouseScore, nonBattleHouseScore, abilityScore, equipmentScore] = await getSelfBuildScores(
                equippedNetworthAsk * 0.5 + equippedNetworthBid * 0.5
            );
            const totalScore = battleHouseScore + abilityScore + equipmentScore;
            const totalHouseScore = battleHouseScore + nonBattleHouseScore;
            const totalNetworth = networthAsk * 0.5 + networthBid * 0.5 + (totalHouseScore + abilityScore) * 1000000;

            // Find the existing buttonsDiv container and add the inventory summary content to it
            const firstChild = invElem.firstElementChild;
            const newElem = document.createElement("div");
            newElem.id = "main-net-div";
            newElem.style.padding = "8px 12px;";
            newElem.innerHTML =`
                <div class="collapsible-net-header"
                    onmouseover="this.style.background='rgba(255, 255, 255, 0.05)'"
                    onmouseout="this.style.background='transparent'">

                    <span style="
                        color: #FFD700;
                        font-size: 14px;
                        font-weight: bold;
                        text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
                        display: flex;
                        align-items: center;
                    ">
                        <span style="margin-right: 8px;">💰🏅</span>
                        ${isZH ? "物品排序工具" : "Networth & Score"}
                    </span>

                    <!-- Toggle arrow -->
                    <span class="collapse-net-arrow" style="
                        color: #9CDCFF;
                        font-size: 18px;
                        transform: rotate(-90deg);
                        transition: transform 0.3s ease;
                        margin-left: 12px;
                    ">▼</span>
                 </div>
                <div style="
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 15px;
                    color: #FFD700;
                    padding: 8px 12px;
                    background: linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent);
                    border-left: 3px solid #FFD700;
                    border-radius: 6px;
                    margin-top: 8px;
                    margin-bottom: 8px;
                    // transition: all 0.3s ease;
                    text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
                "
                id="toggleScores"
                onmouseover="this.style.background='linear-gradient(90deg, rgba(255, 215, 0, 0.2), transparent)'"
                onmouseout="this.style.background='linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent)'" hidden>
                    <span style="margin-right: 8px;">⚔️</span>
                    ${isZH ? "+ 战力打造分: " : "+ Character Build Score: "}${totalScore.toFixed(1)}
                </div>

                <div id="buildScores" style="
                    display: none;
                    margin-left: 20px;
                    padding: 8px 12px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 6px;
                    border-left: 2px solid #FFD700;
                    margin-bottom: 8px;
                ">
                    <div style="color: #E6E6FA; margin-bottom: 6px; font-size: 14px;">
                        <span style="color: #FF6B6B;">🏠</span> ${isZH ? "房子分：" : "House score: "}
                        <span style="color: #FFD700; font-weight: bold;">${battleHouseScore.toFixed(1)}</span>
                    </div>
                    <div style="color: #E6E6FA; margin-bottom: 6px; font-size: 14px;">
                        <span style="color: #4ECDC4;">✨</span> ${isZH ? "技能分：" : "Ability score: "}
                        <span style="color: #FFD700; font-weight: bold;">${abilityScore.toFixed(1)}</span>
                    </div>
                    <div style="color: #E6E6FA; font-size: 14px;">
                        <span style="color: #45B7D1;">⚡</span> ${isZH ? "装备分：" : "Equipment score: "}
                        <span style="color: #FFD700; font-weight: bold;">${equipmentScore.toFixed(1)}</span>
                    </div>
                </div>
                <div style="
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 15px;
                    color: #4ECDC4;
                    padding: 8px 12px;
                    background: linear-gradient(90deg, rgba(78, 205, 196, 0.1), transparent);
                    border-left: 3px solid #4ECDC4;
                    border-radius: 6px;
                    // transition: all 0.3s ease;
                    text-shadow: 0 0 8px rgba(78, 205, 196, 0.6);
                "
                id="toggleNetWorth"
                onmouseover="this.style.background='linear-gradient(90deg, rgba(78, 205, 196, 0.2), transparent)'"
                onmouseout="this.style.background='linear-gradient(90deg, rgba(78, 205, 196, 0.1), transparent)'" hidden>
                    <span style="margin-right: 8px;">💰</span>
                    ${isZH ? "+ 总NetWorth：" : "+ Total NetWorth: "}${numberFormatter(totalNetworth)}
                </div>

                <div id="netWorthDetails" style="display: none; margin-left: 20px;">
                    <!-- Current Assets -->
                    <div style="
                        cursor: pointer;
                        color: #98D8C8;
                        margin-top: 8px;
                        padding: 6px 10px;
                        margin-bottom: 6px;
                        background: rgba(152, 216, 200, 0.1);
                        border-radius: 6px;
                        font-weight: 600;
                        // transition: all 0.3s ease;
                    "
                    id="toggleCurrentAssets"
                    onmouseover="this.style.background='rgba(152, 216, 200, 0.2)'"
                    onmouseout="this.style.background='rgba(152, 216, 200, 0.1)'">
                        <span style="margin-right: 6px;">📦</span>
                        ${isZH ? "+ 流动资产价值" : "+ Current assets value"}
                    </div>

                    <div id="currentAssets" style="
                        display: none;
                        margin-left: 20px;
                        padding: 10px;
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 6px;
                        border-left: 2px solid #98D8C8;
                    ">
                        <div style="color: #E6E6FA; margin-bottom: 4px; font-size: 13px;">
                            <span style="color: #FF6B6B;">⚔️</span> ${isZH ? "装备价值：" : "Equipment value: "}
                            <span style="color: #98D8C8; font-weight: bold;">${numberFormatter(equippedNetworthAsk)}</span>
                        </div>
                        <div style="color: #E6E6FA; margin-bottom: 4px; font-size: 13px;">
                            <span style="color: #FFD93D;">📋</span> ${isZH ? "库存价值：" : "Inventory value: "}
                            <span style="color: #98D8C8; font-weight: bold;">${numberFormatter(inventoryNetworthAsk)}</span>
                        </div>
                        <div style="color: #E6E6FA; font-size: 13px;">
                            <span style="color: #6BCF7F;">📈</span> ${isZH ? "订单价值：" : "Market listing value: "}
                            <span style="color: #98D8C8; font-weight: bold;">${numberFormatter(marketListingsNetworthAsk)}</span>
                        </div>
                    </div>

                    <div style="
                        cursor: pointer;
                        color: #F38BA8;
                        padding: 6px 10px;
                        margin-top: 8px;
                        margin-bottom: 6px;
                        background: rgba(243, 139, 168, 0.1);
                        border-radius: 6px;
                        font-weight: 600;
                        // transition: all 0.3s ease;
                    "
                    id="toggleNonCurrentAssets"
                    onmouseover="this.style.background='rgba(243, 139, 168, 0.2)'"
                    onmouseout="this.style.background='rgba(243, 139, 168, 0.1)'">
                        <span style="margin-right: 6px;">🏛️</span>
                        ${isZH ? "+ 非流动资产价值" : "+ Fixed assets value"}
                    </div>

                    <div id="nonCurrentAssets" style="
                        display: none;
                        margin-left: 20px;
                        padding: 10px;
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 6px;
                        border-left: 2px solid #F38BA8;
                    ">
                        <div style="color: #E6E6FA; margin-bottom: 4px; font-size: 13px;">
                            <span style="color: #FF6B6B;">🏠</span> ${isZH ? "房子价值：" : "Houses value: "}
                            <span style="color: #F38BA8; font-weight: bold;">${numberFormatter(totalHouseScore * 1000000)}</span>
                        </div>
                        <div style="color: #E6E6FA; font-size: 13px;">
                            <span style="color: #4ECDC4;">✨</span> ${isZH ? "技能价值：" : "Abilities value: "}
                            <span style="color: #F38BA8; font-weight: bold;">${numberFormatter(abilityScore * 1000000)}</span>
                        </div>
                    </div>
                </div>
                </div>
            `;
            invElem.insertBefore(newElem, firstChild.nextSibling);
            document.getElementById("main-net-div").setAttribute("skip", "true");
            // refreshCollapsibleHeight();

            document.addEventListener('click', collapsibleNetHandler);

            // Event listeners remain the same but with updated styling
            const toggleScores = document.getElementById("toggleScores");
            const ScoreDetails = document.getElementById("buildScores");
            const toggleButton = document.getElementById("toggleNetWorth");
            const netWorthDetails = document.getElementById("netWorthDetails");
            const toggleCurrentAssets = document.getElementById("toggleCurrentAssets");
            const currentAssets = document.getElementById("currentAssets");
            const toggleNonCurrentAssets = document.getElementById("toggleNonCurrentAssets");
            const nonCurrentAssets = document.getElementById("nonCurrentAssets");

            if (toggleScores) {
                toggleScores.addEventListener("click", () => {
                    const isCollapsed = ScoreDetails.style.display === "none";
                    ScoreDetails.style.display = isCollapsed ? "block" : "none";
                    toggleScores.innerHTML = (isCollapsed ? '<span style="margin-right: 8px;">⚔️</span>↓ ' : '<span style="margin-right: 8px;">⚔️</span>+ ') + (isZH ? "战力打造分: " : "Character Build Score: ") + totalScore.toFixed(1);
                    // mainSortDiv.style.height = (isCollapsed ? "auto" : `${parseInt(toggleScores.style.height) + parseInt(mainSortDiv.style.height)}px`)
                });
            }

            if (toggleButton) {
                toggleButton.addEventListener("click", () => {
                    const isCollapsed = netWorthDetails.style.display === "none";
                    netWorthDetails.style.display = isCollapsed ? "block" : "none";
                    toggleButton.innerHTML = (isCollapsed ? '<span style="margin-right: 8px;">💰</span>↓ ' : '<span style="margin-right: 8px;">💰</span>+ ') + (isZH ? "总NetWorth：" : "Total NetWorth: ") + numberFormatter(totalNetworth);
                    currentAssets.style.display = isCollapsed ? "block" : "none";
                    toggleCurrentAssets.innerHTML = (isCollapsed ? '<span style="margin-right: 6px;">📦</span>↓ ' : '<span style="margin-right: 6px;">📦</span>+ ') + (isZH ? "流动资产价值" : "Current assets value");
                    nonCurrentAssets.style.display = isCollapsed ? "block" : "none";
                    toggleNonCurrentAssets.innerHTML = (isCollapsed ? '<span style="margin-right: 6px;">🏛️</span>↓ ' : '<span style="margin-right: 6px;">🏛️</span>+ ') + (isZH ? "非流动资产价值" : "Fixed assets value");
                });
            }

            if (toggleCurrentAssets) {
                toggleCurrentAssets.addEventListener("click", () => {
                    const isCollapsed = currentAssets.style.display === "none";
                    currentAssets.style.display = isCollapsed ? "block" : "none";
                    toggleCurrentAssets.innerHTML = (isCollapsed ? '<span style="margin-right: 6px;">📦</span>↓ ' : '<span style="margin-right: 6px;">📦</span>+ ') + (isZH ? "流动资产价值" : "Current assets value");
                });
            }

            if (toggleNonCurrentAssets) {
                toggleNonCurrentAssets.addEventListener("click", () => {
                    const isCollapsed = nonCurrentAssets.style.display === "none";
                    nonCurrentAssets.style.display = isCollapsed ? "block" : "none";
                    toggleNonCurrentAssets.innerHTML = (isCollapsed ? '<span style="margin-right: 6px;">🏛️</span>↓ ' : '<span style="margin-right: 6px;">🏛️</span>+ ') + (isZH ? "非流动资产价值" : "Fixed assets value");
                });
            }
        };

        const waitForHeader = () => {
            const targetNode = document.querySelector("div.Header_totalLevel__8LY3Q");
            if (targetNode) {

                targetNode.insertAdjacentHTML(
                    "afterend",
                    `<div class="from-custom" style="font-size: 13px; font-weight: 500; color: ${SCRIPT_COLOR_MAIN}; text-wrap: nowrap;">Current Assets: ${numberFormatter(
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
        const showCustomAlert = () => {
            const alertDiv = document.createElement('div');
            alertDiv.innerHTML = `
                <div class="alertMain" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">
                    <div style="
                        background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
                        border: 2px solid #4a69bd;
                        padding: 25px 30px;
                        border-radius: 15px;
                        box-shadow: 0 0 30px rgba(74, 105, 189, 0.3), inset 0 1px 0 rgba(255,255,255,0.1);
                        text-align: center;
                        color: #e1e8f0;
                        max-width: 400px;
                        animation: gentleFadeIn 0.3s ease-out;
                        position: relative;
                        overflow: hidden;
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: radial-gradient(circle at 30% 20%, rgba(74, 105, 189, 0.1) 0%, transparent 50%),
                                       radial-gradient(circle at 70% 80%, rgba(130, 88, 159, 0.1) 0%, transparent 50%);
                            pointer-events: none;
                        "></div>
                        <div style="font-size: 32px; margin-bottom: 12px; position: relative; z-index: 1;">🛸</div>
                        <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; position: relative; z-index: 1; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${isZH ? "检测到重复工具" : "Duplicate Tools Detected"}</h3>
                        <p style="margin: 0 0 20px 0; line-height: 1.4; opacity: 0.9; font-size: 14px; position: relative; z-index: 1;">
                            ${isZH ?
                                "银河系中检测到多个MWITOOLS实例。<br>为确保最佳太空探索体验，请只保留一个实例运行。" :
                                "Multiple MWITOOLS instances detected in the galaxy.<br>For optimal space exploration, please keep only one instance active."
                            }
                        </p>
                        <button onclick="this.closest('div.alertMain').remove()" style="
                            background: linear-gradient(135deg, #4a69bd, #3742fa);
                            color: white;
                            border: 1px solid #5a6acf;
                            padding: 10px 20px;
                            border-radius: 20px;
                            font-weight: 500;
                            cursor: pointer;
                            font-size: 14px;
                            transition: all 0.2s ease;
                            box-shadow: 0 2px 8px rgba(74, 105, 189, 0.3);
                            position: relative;
                            z-index: 1;
                        " onmouseover="this.style.background='linear-gradient(135deg, #5a79cd, #4752ff)'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(74, 105, 189, 0.4)'" onmouseout="this.style.background='linear-gradient(135deg, #4a69bd, #3742fa)'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(74, 105, 189, 0.3)'">
                            ${isZH ? "了解，舰长" : "Roger, Captain"}
                        </button>
                    </div>
                </div>
                <style>
                    @keyframes gentleFadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(-10px) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                </style>
            `;
            document.body.appendChild(alertDiv);
        };

        const checkForDuplicatedMWITools = () => {
            const targetNode = document.querySelector("div.Header_info__26fkk");

            if (!targetNode) {
                setTimeout(checkForDuplicatedMWITools, 200);
                return;
            }

            for (const node of targetNode.children) {
                if (node.className.toLowerCase().includes("header")) continue;

                if (!node.className.includes("from-custom") && !node.id.includes("from-og")) {
                    showCustomAlert();
                    return; // Stop checking once found
                }
            }

            setTimeout(checkForDuplicatedMWITools, 200);
        };

        checkForDuplicatedMWITools();

        function showApiFailAlertPopup() {
            logger(reasonForUsingExpiredMarketJson, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
            const popout = document.querySelector("#script_api_fail_popout");
            if (popout) {
                popout.textContent = reasonForUsingExpiredMarketJson;
                popout.style.display = "block";
            }
        }

        class InventoryWatcher {
            constructor() {
                this.observer = null;
                this.isWatching = false;
                this.pricesInitialized = false;
                this.processedNodes = new WeakSet();

                this.config = {
                    inventorySelector: "div.Inventory_items__6SXv0",
                    retryInterval: 1000,
                    maxRetries: 10,
                    retryCount: 0
                };
            }

            start() {
                if (this.isWatching) return;

                this.isWatching = true;
                this.setupMutationObserver();
                this.processExistingInventories();

                logger("🔍 Inventory watcher started", EXTENDED_SCRIPT_COLORS.cyan);
            }

            setupMutationObserver() {
                this.observer = new MutationObserver((mutations) => {
                    let shouldProcess = false;

                    for (const mutation of mutations) {
                        if (mutation.type === 'childList') {
                            // Check if any inventory nodes were added
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    if (node.matches?.(this.config.inventorySelector) ||
                                        node.querySelector?.(this.config.inventorySelector)) {
                                        shouldProcess = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (shouldProcess) break;
                    }

                    if (shouldProcess) {
                        this.processExistingInventories();
                    }
                });

                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
            processExistingInventories() {
                const inventoryNodes = document.querySelectorAll(this.config.inventorySelector);

                if (inventoryNodes.length === 0) {
                    this.handleNoInventoryFound();
                    return;
                }

                this.config.retryCount = 0;

                // Process all inventory nodes first
                for (const node of inventoryNodes) {
                    this.processInventoryNode(node);
                }

                // Only initialize prices once when main-sort-div appears
                this.waitForMainSortDiv();
             }

             waitForMainSortDiv() {
                const mainSortDiv = document.querySelector('#main-sort-div');

                if (mainSortDiv && !this.pricesInitialized) {
                    this.initializePricesIfNeeded();
                    return;
                }

                // If main-sort-div doesn't exist yet, wait and check again
                if (!this.pricesInitialized) {
                    setTimeout(() => this.waitForMainSortDiv(), 500);
                }
             }

            async processInventoryNode(node) {
                if (this.processedNodes.has(node)) return true;

                let processingComplete = true;

                // Process inventory worth
                if (settingsMap.invWorth?.isTrue) {
                    if (!node.classList.contains("script_buildScore_added")) {
                        node.classList.add("script_buildScore_added");
                        try {
                            this.addInventorySummary(node);
                        } catch (error) {
                            logger("Error adding inventory summary: " + error, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
                            processingComplete = false;
                        }
                    }
                }

                // Process inventory sort
                if (settingsMap.invSort?.isTrue) {
                    if (!node.classList.contains("script_invSort_added")) {
                        node.classList.add("script_invSort_added");
                        try {
                            this.addInvSortButton(node);
                        } catch (error) {
                            logger("Error adding inventory sort button: " + error, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
                            processingComplete = false;
                        }
                    }
                }

                if (processingComplete) {
                    this.processedNodes.add(node);
                }

                return processingComplete;
            }

            initializePricesIfNeeded() {
                // Only initialize prices if not already done and not currently active
                if (!this.pricesInitialized && !isAskPriceActive) {
                    initPrices();
                    this.pricesInitialized = true;
                    logger("💰 Prices initialized", EXTENDED_SCRIPT_COLORS.brightGreen);
                }
            }

            async addInventorySummary(node) {
                try {
                    if (typeof addInventorySummery === 'function') {
                        await addInventorySummery(node);
                    } else {
                        console.warn("addInventorySummery function not found");
                    }
                } catch (error) {
                    logger("Error adding inventory summary: "+ error, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
                }
            }

            async addInvSortButton(node) {
                try {
                    if (typeof addInvSortButton === 'function') {
                        await addInvSortButton(node);
                    } else {
                        console.warn("addInvSortButton function not found");
                    }
                } catch (error) {
                    logger("Error adding inventory sort button: " + error, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
                }
            }

            handleNoInventoryFound() {
                // Retry logic with exponential backoff
                if (this.config.retryCount < this.config.maxRetries) {
                    this.config.retryCount++;
                    const delay = Math.min(this.config.retryInterval * this.config.retryCount, 10000);

                    setTimeout(() => {
                        if (this.isWatching) {
                            this.processExistingInventories();
                        }
                    }, delay);
                } else {
                    logger("⚠️ Max retries reached, inventory not found", EXTENDED_SCRIPT_COLORS.orange);
                }
            }

            // Method to reset prices initialization (call this when prices are manually stopped)
            resetPricesInitialization() {
                this.pricesInitialized = false;
            }

            // Method to force reprocess all inventories (useful for settings changes)
            forceReprocess() {
                this.processedNodes = new WeakSet();
                this.processExistingInventories();
            }

            stop() {
                if (!this.isWatching) return;

                this.isWatching = false;

                if (this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                }

                logger("🛑 Inventory watcher stopped", EXTENDED_SCRIPT_COLORS.red);
            }

            destroy() {
                this.stop();
                this.processedNodes = new WeakSet();
                this.pricesInitialized = false;
            }
        }

        // Global instance
        let inventoryWatcher = null;

        // Initialize the inventory watcher
        function initInventoryWatcher() {
            // Clean up existing watcher
            if (inventoryWatcher) {
                inventoryWatcher.destroy();
            }

            inventoryWatcher = new InventoryWatcher();
            inventoryWatcher.start();
        }

        // Utility functions for external use
        // eslint-disable-next-line no-unused-vars
        function resetPricesInitialization() {
            if (inventoryWatcher) {
                inventoryWatcher.resetPricesInitialization();
            }
        }

        // eslint-disable-next-line no-unused-vars
        function forceReprocessInventories() {
            if (inventoryWatcher) {
                inventoryWatcher.forceReprocess();
            }
        }

        // Start the watcher
        initInventoryWatcher();
    }
    // Generic collapsible handler factory
    const createCollapsibleHandler = (config) => {
        const {
            headerSelector,
            arrowSelector,
            transitionDuration = 0,
            paddingExpanded = '16px',
            paddingCollapsed = '0 16px',
            includeSecondElement = false
        } = config;

        // Cache for elements to avoid repeated DOM queries
        const elementCache = new WeakMap();

        // Single RAF callback to handle multiple elements
        const scheduleAnimation = (callback) => {
            requestAnimationFrame(callback);
        };

        // Optimized element expansion
        const expandElement = (element, includePadding = true) => {
            if (!element) return;

            element.hidden = false;

            scheduleAnimation(() => {
                const fullHeight = element.id.includes("toggle") ? element.scrollHeight * 2 : element.scrollHeight;
                element.style.maxHeight = fullHeight + 'px';
                if (includePadding) {
                    element.style.padding = paddingExpanded;
                }
            });
        };

        // Optimized element collapse
        const collapseElement = (element, includePadding = true) => {
            if (!element) return;

            element.style.maxHeight = '0px';
            if (includePadding) {
                element.style.padding = paddingCollapsed;
            }

            // Use cached timeout or create new one
            if (!elementCache.has(element)) {
                elementCache.set(element, {});
            }

            const cache = elementCache.get(element);
            if (cache.hideTimeout) {
                clearTimeout(cache.hideTimeout);
            }

            cache.hideTimeout = setTimeout(() => {
                element.hidden = true;
                cache.hideTimeout = null;
            }, transitionDuration);
        };

        // Check if element is collapsed
        const isCollapsed = (element) => {
            const maxHeight = element.style.maxHeight;
            return maxHeight === '' || maxHeight === '0px';
        };

        // Main click handler
        return function(event) {
            // Early exit if not a collapsible header
            const headerElement = event.target.closest(headerSelector);
            if (!headerElement) return;

            // Get or cache related elements
            let cache = elementCache.get(headerElement);
            if (!cache) {
                const content = headerElement.nextElementSibling;
                const secondElement = includeSecondElement
                ? content?.nextElementSibling?.nextElementSibling
                : null;
                const arrow = headerElement.querySelector(arrowSelector);

                cache = { content, secondElement, arrow };
                elementCache.set(headerElement, cache);
            }

            const { content, secondElement, arrow } = cache;
            if (!content) return;

            const collapsed = isCollapsed(content);

            if (collapsed) {
                // Expand elements
                if (secondElement) {
                    expandElement(secondElement, true);
                }
                expandElement(content, true);

                // Update arrow
                if (arrow) {
                    arrow.style.transform = 'rotate(0deg)';
                }
            } else {
                // Collapse elements
                collapseElement(content, true);
                if (secondElement) {
                    collapseElement(secondElement, true);
                }

                // Update arrow
                if (arrow) {
                    arrow.style.transform = 'rotate(-90deg)';
                }
            }
        };
    };

    // Create handlers for both collapsible types
    const collapsibleHandler = createCollapsibleHandler({
        headerSelector: '.collapsible-header',
        arrowSelector: '.collapse-arrow',
        includeSecondElement: false
    });

    const collapsibleNetHandler = createCollapsibleHandler({
        headerSelector: '.collapsible-net-header',
        arrowSelector: '.collapse-net-arrow',
        includeSecondElement: true
    });
    /* 仓库物品排序 */
    // by daluo, bot7420
    async function addInvSortButton(invElem) {
        invElem = document.querySelector(".Inventory_items__6SXv0");
        const price_data = await fetchMarketJSON();
        if (!price_data || !price_data.marketData) {
            logger("addInvSortButton fetchMarketJSON null");
            return;
        }
        const buttonStyle = `
    padding: 6px 12px;
            margin: 0 2px;
            border: 1px solid rgba(106, 13, 173, 0.4);
            border-radius: 6px;
            background: linear-gradient(135deg, rgba(106, 13, 173, 0.8), rgba(65, 105, 225, 0.8));
            color: white;
            font-weight: bold;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            text-shadow: 0 1px 2px rgba(0,0,0,0.8);
            user-select: none;
            backdrop-filter: blur(2px);
        `;

        const hoverStyle = `
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(106, 13, 173, 0.4)'; this.style.borderColor='rgba(106, 13, 173, 0.6)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.3)'; this.style.borderColor='rgba(106, 13, 173, 0.4)'"
            onmousedown="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 4px rgba(0,0,0,0.4)'"
            onmouseup="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(106, 13, 173, 0.4)'"
        `;

        const askButton = `<button
            id="script_sortByAsk_btn"
            style="${buttonStyle}"
            ${hoverStyle}>
            ${isZH ? "出售价" : "Ask"}
        </button>`;

        const bidButton = `<button
            id="script_sortByBid_btn"
            style="${buttonStyle}"
            ${hoverStyle}>
            ${isZH ? "收购价" : "Bid"}
        </button>`;

        const sellButton = `<button
            id="script_sortBySell_btn"
            style="${buttonStyle}"
            ${hoverStyle}>
            ${isZH ? "买" : "Buy"}
        </button>`;

        const BuyButton = `<button
            id="script_sortByBuy_btn"
            style="${buttonStyle}"
            ${hoverStyle}>
            ${isZH ? "卖" : "Sell"}
        </button>`;

        const noneButton = `<button
            id="script_sortByNone_btn"
            style="${buttonStyle}"
            ${hoverStyle}>
            ${isZH ? "无" : "None"}
        </button>`;

        const toggleSellPriceCheckbox = `
            <label id="script_toggleSellPrice_label"
                style="
                    display: inline-flex;
                    align-items: center;
                    padding: 8px 16px;
                    background: ${localStorage.getItem("showAskPrice") === "true" ? "linear-gradient(135deg, rgba(78, 205, 196, 0.8), rgba(76, 175, 80, 0.8))" : "linear-gradient(135deg, rgba(136, 136, 136, 0.8), rgba(100, 100, 100, 0.8))"};
                    color: white;
                    border: 1px solid ${localStorage.getItem("showAskPrice") === "true" ? "rgba(78, 205, 196, 0.4)" : "rgba(136, 136, 136, 0.4)"};
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    user-select: none;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
                    margin-right: 15px;
                    backdrop-filter: blur(2px);
                ">
                <input type="checkbox" id="toggleSellPrices" style="display: none;" ${localStorage.getItem("showAskPrice") === "true" ? "checked" : ""} />
                <span style="margin-right: 6px;">💰</span>
                ${isZH ? "显示售价" : "Show Prices"}
            </label>
        `;

        // After inserting the HTML, add event listeners
        setTimeout(() => {
            const label = document.getElementById('script_toggleSellPrice_label');
            const checkbox = document.getElementById('toggleSellPrices');

            if (label && checkbox) {
                const updateButtonStyle = () => {
                    const isChecked = checkbox.checked;
                    label.style.background = isChecked ?
                        "linear-gradient(135deg, rgba(78, 205, 196, 0.8), rgba(76, 175, 80, 0.8))" :
                    "linear-gradient(135deg, rgba(136, 136, 136, 0.8), rgba(100, 100, 100, 0.8))";
                    label.style.borderColor = isChecked ?
                        "rgba(78, 205, 196, 0.4)" :
                    "rgba(136, 136, 136, 0.4)";
                };

                label.onmouseover = () => {
                    const isChecked = checkbox.checked;
                    label.style.background = isChecked ?
                        "linear-gradient(135deg, rgba(78, 205, 196, 1), rgba(76, 175, 80, 1))" :
                    "linear-gradient(135deg, rgba(156, 156, 156, 0.9), rgba(120, 120, 120, 0.9))";
                    label.style.transform = 'translateY(-1px)';
                    label.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
                };

                label.onmouseout = () => {
                    updateButtonStyle();
                    label.style.transform = 'translateY(0)';
                    label.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                };

                // Update style when checkbox changes
                checkbox.addEventListener('change', updateButtonStyle);

                // Initial style update
                updateButtonStyle();
            }
        }, 100);

        const buttonDiv = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 0;
                margin-bottom: 8px;
            ">
                <div style="display: flex; align-items: center;">
                    ${toggleSellPriceCheckbox}
                </div>
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    font-size: 14px;
                    font-weight: bold;
                ">
                    <span style="
                        color: #FF6B6B;
                        padding: 6px 10px;
                        background: rgba(255, 107, 107, 0.15);
                        border: 1px solid rgba(255, 107, 107, 0.3);
                        border-radius: 6px;
                        cursor: default;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.6);
                        backdrop-filter: blur(2px);
                    ">
                        <span style="margin-right: 4px;">📈</span>${isZH ? "买" : "Buy"}
                    </span>
                    <span style="
                        color: #4ECDC4;
                        padding: 6px 10px;
                        background: rgba(78, 205, 196, 0.15);
                        border: 1px solid rgba(78, 205, 196, 0.3);
                        border-radius: 6px;
                        cursor: default;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.6);
                        backdrop-filter: blur(2px);
                    ">
                        <span style="margin-right: 4px;">📉</span>${isZH ? "卖" : "Sell"}
                    </span>
                </div>
            </div>
        `;

        const buttonsDiv = `
            <div id="main-sort-div" skip="true">
                <!-- Header (always visible) -->
                <div class="collapsible-header"
                    onmouseover="this.style.background='rgba(255, 255, 255, 0.05)'"
                    onmouseout="this.style.background='transparent'">

                    <span style="
                        color: #FFD700;
                        font-size: 14px;
                        font-weight: bold;
                        text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
                        display: flex;
                        align-items: center;
                    ">
                        <span style="margin-right: 8px;">⚡</span>
                        ${isZH ? "物品排序工具" : "Item Sorting Tools"}
                    </span>

                    <!-- Toggle arrow -->
                    <span class="collapse-arrow" style="
                        color: #9CDCFF;
                        font-size: 18px;
                        transform: rotate(-90deg);
                        transition: transform 0.3s ease;
                        margin-left: 12px;
                    ">▼</span>
                </div>

                <!-- Collapsible content -->
                <div class="collapsible-content" hidden>
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        margin-bottom: 6px;
                    ">
                        <span style="
                            color: #FFD700;
                            font-size: 14px;
                            font-weight: bold;
                            text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
                            white-space: nowrap;
                            display: flex;
                            align-items: center;
                        ">
                            ${isZH ? "排序方式" : "Sort by:"}
                        </span>
                        <div style="display: flex; gap: 1px; flex-wrap: nowrap;">
                            ${askButton} ${bidButton} ${sellButton} ${BuyButton} ${noneButton}
                        </div>
                    </div>
                    ${buttonDiv}
                </div>
            </div>


        `;

        document.addEventListener('click', collapsibleHandler);

        invElem.insertAdjacentHTML("afterbegin", buttonsDiv);
        // invElem.insertAdjacentHTML("beforebegin", buttonDiv);
        document.getElementById("main-sort-div").setAttribute("skip", "true");
        invElem.querySelector("button#script_sortByAsk_btn").addEventListener("click", function () {
            sortItemsBy("ask");
        });
        invElem.querySelector("button#script_sortByBid_btn").addEventListener("click", function () {
            sortItemsBy("bid");
        });
        invElem.querySelector("button#script_sortBySell_btn").addEventListener("click", function () {
            sortItemsBy("sell");
        });
        invElem.querySelector("button#script_sortByBuy_btn").addEventListener("click", function () {
            sortItemsBy("buy");
        });
        invElem.querySelector("button#script_sortByNone_btn").addEventListener("click", function () {
            sortItemsBy("none");
        });

        const sortItemsBy = (order) => {
            for (const typeDiv of invElem.children) {
                if (typeDiv.hasAttribute("skip")) continue;
                const typeName = getOriTextFromElement(typeDiv.getElementsByClassName("Inventory_categoryButton__35s1x")[0]);
                const notNeedSortTypes = ["Loots", "Currencies"];
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
                    const itemHrid = itemEnNameToHridMap[itemName];
                    let itemCount = itemElem.querySelector(".Item_count__1HVvv").innerText;
                    itemCount = Number(itemCount.toLowerCase().replaceAll("k", "000").replaceAll("m", "000000"));
                    const askPrice =
                        price_data.marketData[itemHrid] && price_data.marketData[itemHrid][0].a > 0 ? price_data.marketData[itemHrid][0].a : 0;
                    const bidPrice =
                        price_data.marketData[itemHrid] && price_data.marketData[itemHrid][0].b > 0 ? price_data.marketData[itemHrid][0].b : 0;
                    const itemAskmWorth = askPrice * itemCount;
                    const itemBidWorth = bidPrice * itemCount;

                    // 价格角标
                    if (!itemElem.querySelector("#script_stack_price")) {
                        itemElem.style.position = "relative";
                        const priceElemHTML = `<div
                            id="script_stack_price"
                            style="
                                z-index: 1;
                                position: absolute;
                                top: 2px;
                                left: 2px;
                                text-align: left;
                                font-size: 11px;
                                font-weight: bold;
                                color: #FFD700;
                                text-shadow:
                                    0 0 4px rgba(255, 215, 0, 0.8),
                                    -1px -1px 0 #000,
                                    1px -1px 0 #000,
                                    -1px 1px 0 #000,
                                    1px 1px 0 #000;
                                pointer-events: none;
                            ">
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
                    } else if (order === "sell") {
                        itemElem.style.order = -askPrice;
                        priceElem.textContent = numberFormatter(itemAskmWorth);
                    } else if (order === "buy") {
                        itemElem.style.order = -bidPrice;
                        priceElem.textContent = numberFormatter(itemBidWorth);
                    } else if (order === "none") {
                        itemElem.style.order = 0;
                        priceElem.textContent = "";
                    }
                }
            }
        };
    }

    /* 计算Networth */
    async function calculateNetworthOld() {
        const marketAPIJson = await fetchMarketJSON();
        if (!marketAPIJson) {
            logger("calculateNetworth marketAPIJson is null");
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
            let marketPrices = marketAPIJson.marketData[item.itemHrid];

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
                    equippedNetworthAsk += item.count * (marketPrices[0].a > 0 ? marketPrices[0].a : 0);
                    equippedNetworthBid += item.count * (marketPrices[0].b > 0 ? marketPrices[0].b : 0);
                } else {
                    inventoryNetworthAsk += item.count * (marketPrices[0].a > 0 ? marketPrices[0].a : 0);
                    inventoryNetworthBid += item.count * (marketPrices[0].b > 0 ? marketPrices[0].b : 0);
                }
            } else {
                console.log("calculateNetworth cannot find price of " + item.itemHrid);
            }
        }

        for (const item of initData_myMarketListings) {
            const quantity = item.orderQuantity - item.filledQuantity;
            const enhancementLevel = item.enhancementLevel;
            const marketPrices = marketAPIJson.marketData[item.itemHrid];
            if (!marketPrices) {
                console.log("calculateNetworth cannot get marketPrices of " + item.itemHrid);
                return;
            }
            if (item.isSell) {
                if (item.itemHrid === "/items/bag_of_10_cowbells") {
                    marketPrices[0].a *= 1 - 18 / 100;
                    marketPrices[0].b *= 1 - 18 / 100;
                } else {
                    marketPrices[0].a *= 1 - 2 / 100;
                    marketPrices[0].b *= 1 - 2 / 100;
                }
                if (!enhancementLevel || enhancementLevel <= 1) {
                    marketListingsNetworthAsk += quantity * (marketPrices[0].a > 0 ? marketPrices[0].a : 0);
                    marketListingsNetworthBid += quantity * (marketPrices[0].b > 0 ? marketPrices[0].b : 0);
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
                marketListingsNetworthAsk += item.unclaimedItemCount * (marketPrices[0].a > 0 ? marketPrices[0].a : 0);
                marketListingsNetworthBid += item.unclaimedItemCount * (marketPrices[0].b > 0 ? marketPrices[0].b : 0);
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
                `<div id="oldTotalNet" style="text-align: left; color: ${SCRIPT_COLOR_MAIN}; font-size: 14px;">
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
                    `<div id="from-og" style="font-size: 13px; font-weight: 500; color: ${SCRIPT_COLOR_MAIN}; text-wrap: nowrap;">Current Assets: ${numberFormatter(
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
            logger(reasonForUsingExpiredMarketJson, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
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
                        addInvSortButtonOld(node);
                    }
                }
            }
            setTimeout(waitForInv, 1000);
        };
        waitForInv();

        const waitForMain = () => {
            const targetNode = document.querySelector("#oldSort");
            if (targetNode) {
                    initPrices()
                    return;
            }
            setTimeout(waitForMain, 1000);
        };
        waitForMain();
    }

    /* 仓库物品排序 */
    // by daluo, bot7420
    async function addInvSortButtonOld(invElem) {
        const price_data = await fetchMarketJSON();
        if (!price_data || !price_data.marketData) {
            logger("addInvSortButton fetchMarketJSON null");
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
        const sellButton = `<button
            id="script_sortBySell_btn"
            style="border-radius: 3px; background-color: ${SCRIPT_COLOR_MAIN}; color: black;">
            ${isZH ? "卖" : "Sell"}
            </button>`;
        const BuyButton = `<button
            id="script_sortByBuy_btn"
            style="border-radius: 3px; background-color: ${SCRIPT_COLOR_MAIN}; color: black;">
            ${isZH ? "买" : "Buy"}
            </button>`;
        const noneButton = `<button
            id="script_sortByNone_btn"
            style="border-radius: 3px; background-color: ${SCRIPT_COLOR_MAIN}; color: black;">
            ${isZH ? "无" : "None"}
            </button>`;
        const toggleSellPriceCheckbox = `
            <label id="script_toggleSellPrice_label"
                style="
                    display: inline-block;
                    border-radius: 3px;
                    background-color: ${localStorage.getItem("showAskPrice") === "true" ? "limegreen" : "gray"};
                    color: black;
                    padding: 2px 8px;
                    cursor: pointer;
                    font-size: 14px;
                    user-select: none;
                ">
                <input type="checkbox" id="toggleSellPrices" style="display: none;" ${localStorage.getItem("showAskPrice") === "true" ? "checked" : ""} />
                ${isZH ? "显示售价" : "Show Prices"}
            </label>
            `;
        const buttonsDiv = `<div id="oldSort" style="color: ${SCRIPT_COLOR_MAIN}; font-size: 14px; text-align: left; ">${
            isZH ? "物品排序：" : "Sort items by: "
        }${askButton} ${bidButton} ${sellButton} ${BuyButton} ${noneButton}</div>`;
        const buttonDiv = `<div id="oldShow" style="color: ${SCRIPT_COLOR_MAIN}; font-size: 14px; text-align: left; ">${toggleSellPriceCheckbox} <span style="color:red;">${isZH ? "买" : "Buy"}</span> <span style="color:green;">${isZH ? "卖" : "Sell"}</span></div>`;
        invElem.insertAdjacentHTML("beforebegin", buttonsDiv);
        invElem.insertAdjacentHTML("beforebegin", buttonDiv);

        invElem.parentElement.querySelector("button#script_sortByAsk_btn").addEventListener("click", function () {
            sortItemsBy("ask");
        });
        invElem.parentElement.querySelector("button#script_sortByBid_btn").addEventListener("click", function () {
            sortItemsBy("bid");
        });
        invElem.parentElement.querySelector("button#script_sortBySell_btn").addEventListener("click", function () {
            sortItemsBy("sell");
        });
        invElem.parentElement.querySelector("button#script_sortByBuy_btn").addEventListener("click", function () {
            sortItemsBy("buy");
        });
        invElem.parentElement.querySelector("button#script_sortByNone_btn").addEventListener("click", function () {
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
                    const itemHrid = itemEnNameToHridMap[itemName];
                    let itemCount = itemElem.querySelector(".Item_count__1HVvv").innerText;
                    itemCount = Number(itemCount.toLowerCase().replaceAll("k", "000").replaceAll("m", "000000"));
                    const askPrice =
                        price_data.marketData[itemHrid] && price_data.marketData[itemHrid][0].a > 0 ? price_data.marketData[itemHrid][0].a : 0;
                    const bidPrice =
                        price_data.marketData[itemHrid] && price_data.marketData[itemHrid][0].b > 0 ? price_data.marketData[itemHrid][0].b : 0;
                    const itemAskmWorth = askPrice * itemCount;
                    const itemBidWorth = bidPrice * itemCount;

                    // 价格角标
                    if (!itemElem.querySelector("#script_stack_price")) {
                        itemElem.style.position = "relative";
                        const priceElemHTML = `<div
                            id="script_stack_price"
                            style="z-index: 1; position: absolute; top: 2px; left: 2px; text-align: left;
                                font-size: 13px;
                                font-weight: bold;
                                color: orange;
                                text-shadow: 1px 1px 2px black;
                                pointer-events: none;">
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
                    } else if (order === "sell") {
                        itemElem.style.order = -askPrice;
                        priceElem.textContent = numberFormatter(itemAskmWorth);
                    } else if (order === "buy") {
                        itemElem.style.order = -bidPrice;
                        priceElem.textContent = numberFormatter(itemBidWorth);
                    } else if (order === "none") {
                        itemElem.style.order = 0;
                        priceElem.textContent = "";
                    }
                }
            }
        };
    }

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
            logger("Error in calculateAbilityScore() " + error, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
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
        const clientObj = JSON.parse(decompressString(GM_getValue("init_client_data", "")));

        const upgradeCostsMap = clientObj.houseRoomDetailMap[house.houseRoomHrid].upgradeCostsMap;
        const level = house.level;

        let cost = 0;
        for (let i = 1; i <= level; i++) {
            for (const item of upgradeCostsMap[i]) {
                const marketPrices = marketAPIJson.marketData[item.itemHrid];
                if (marketPrices) {
                    cost += item.count * getWeightedMarketPrice(marketPrices);
                } else {
                    logger("getHouseFullBuildPrice cannot find price of " + item.itemHrid, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
                }
            }
        }
        return cost;
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
            const itemHrid = item.abilityHrid.replace("/abilities/", "/items/");
            const marketPrices = marketAPIJson.marketData[itemHrid];
            if (marketPrices) {
                price += numBooks * getWeightedMarketPrice(marketPrices);
            } else {
                logger("calculateAbilityScore cannot find price of " + itemHrid, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
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
            logger("Error in calculate skill: "+ error, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
        }

        // 装备分：当前身上装备总价，单位M
        let equipmentScore = 0;
        try {
            equipmentScore = await calculateEquipment(profile_shared_obj);
            // console.log("装备分：" + equipmentScore);
        } catch (error) {
            logger("Error in calculateEquipmen: " + error, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
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
            const itemHrid = item.abilityHrid.replace("/abilities/", "/items/");
            const marketPrices = marketAPIJson.marketData[itemHrid];
            if (marketPrices) {
                price += numBooks * getWeightedMarketPrice(marketPrices);
            } else {
                logger("calculateSkill cannot find price of " + itemHrid, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
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
            const itemHrid = obj.wearableItemMap[key].itemHrid;
            const marketPrices = marketAPIJson.marketData[itemHrid];

            if (enhanceLevel && enhanceLevel > 1) {
                input_data.item_hrid = item.itemHrid;
                input_data.stop_at = enhanceLevel;
                const best = await findBestEnhanceStrat(input_data);
                let totalCost = best?.totalCost;
                totalCost = totalCost ? Math.round(totalCost) : 0;
                networthAsk += item.count * (totalCost > 0 ? totalCost : 0);
                networthBid += item.count * (totalCost > 0 ? totalCost : 0);
            } else if (marketPrices) {
                networthAsk += item.count * (marketPrices[0].a > 0 ? marketPrices[0].a : 0);
                networthBid += item.count * (marketPrices[0].b > 0 ? marketPrices[0].b : 0);
            } else {
                logger("calculateEquipment cannot find price of " + itemHrid, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
            }
        }

        return (networthAsk * 0.5 + networthBid * 0.5) / 1000000;
    }

    /* 显示当前动作总时间 */
    const showTotalActionTime = () => {
        const targetNode = document.querySelector("div.Header_actionName__31-L2");
        if (targetNode) {
            logger("start observe action progress bar", EXTENDED_SCRIPT_COLORS.cyan);
            calculateTotalTime(targetNode);
            new MutationObserver((mutationsList) =>
                mutationsList.forEach(() => {
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
        const match = content.match(/\((\d+(?:[KMB])?)\)/);
        if (match) {
            const numOfTimes = +parseShorthandNumber(match[1]);
            const timePerActionSec = +getOriTextFromElement(document.querySelector(".ProgressBar_text__102Yn")).match(/[\d\.]+/)[0];
            const actionHrid = currentActionsHridList[0].actionHrid;
            let effBuff = 1 + getTotalEffiPercentage(actionHrid) / 100;
            if (actionHrid.includes("enhanc")) {
                effBuff = 1;
            }
            const actualNumberOfTimes = Math.round(numOfTimes / effBuff);
            const totalTimeSeconds = actualNumberOfTimes * timePerActionSec;
            totalTimeStr = " [" + timeReadable(totalTimeSeconds) + "]";
            if (!settingsMap.timeFormatShortLong.isTrue && settingsMap.includeCurrentTime.isTrue) {
                const currentTime = new Date();
                currentTime.setSeconds(currentTime.getSeconds() + totalTimeSeconds);
                totalTimeStr += ` ${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}:${String(
                    currentTime.getSeconds()
                ).padStart(2, "0")}`;
            }
        } else {
            totalTimeStr = " [∞]";
        }
        targetNode.innerHTML = `
        <span>${targetNode.textContent}</span>
        <span style="
            color: #4ECDC4;
            text-shadow:
                0 0 6px rgba(78, 205, 196, 0.8),
                -1px -1px 0 #000,
                1px -1px 0 #000,
                -1px 1px 0 #000,
                1px 1px 0 #000;
            font-weight: bold;
        ">${totalTimeStr}</span>
    `;
    }

    function timeReadable(sec) {
        if (sec >= 86400) {
            const now = new Date();
            const future = new Date(now.getTime() + sec * 1000);
            if (!settingsMap.timeFormatShortLong.isTrue) {
                const days = Math.floor(sec / 86400);
                const hours = Math.floor((sec % 86400) / 3600);
                const minutes = Math.floor((sec % 3600) / 60);

                if (isZH) {
                    return `${days}天${hours}小时${minutes}分钟`;
                } else {
                    return `${days} days ${hours} hours ${minutes} minutes`;
                }
            } else {
                return `${future.toLocaleDateString(isZH ? "zh-CN" : "en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                })} - ${Number(sec / 86400).toFixed(1) + (isZH ? "天" : " days")}`;
            }
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

    class PriceDisplaySystem {
        constructor() {
            this.askPriceInterval = null;
            this.showPricesInterval = null;
            this.isActive = false;
            this.cachedItemElements = [];
            this.inventoryObserver = null;
            this.lastInventoryHTML = "";
            this.marketData = null;
            this.marketDataTimestamp = 0;

            // Configuration
            this.config = {
                updateInterval: 3600000, // 1 hour
                displayUpdateInterval: 100, // Reduced from 50ms for better performance
                marketDataCacheTime: 3600000, // 5 minutes cache
                selectors: {
                    inventory: "div.Inventory_items__6SXv0",
                    inventorySectionLabel: ".Inventory_categoryButton__35s1x",
                    itemContainer: ".Item_itemContainer__x7kH1",
                    itemClickable: ".Item_item__2De2O.Item_clickable__3viV6",
                    enhancementLevel: ".Item_enhancementLevel__19g-e",
                    itemCount: ".Item_count__1HVvv"
                },
                priceElements: {
                    sell: { id: "script_sell_price", side: "left", color: "#FF6B6B" },
                    buy: { id: "script_buy_price", side: "right", color: "#4ECDC4" }
                }
            };

            this.init();
        }

        init() {
            this.injectStyles();
            this.setupCheckboxHandler();
            this.setupInventoryObserver();

            // Check if should start on init
            const checkbox = document.getElementById("toggleSellPrices");
            if (checkbox?.checked) {
                this.start();
            }
        }

        injectStyles() {
            if (document.getElementById("price-display-styles")) return;

            const styleTag = document.createElement("style");
            styleTag.id = "price-display-styles";
            styleTag.textContent = `
                .price-display-element {
                    z-index: 1;
                    position: absolute;
                    bottom: 12px;
                    font-size: 10px;
                    font-weight: bold;
                    text-shadow:
                        0 0 4px rgba(0, 0, 0, 0.8),
                        -1px -1px 0 #000,
                        1px -1px 0 #000,
                        -1px 1px 0 #000,
                        1px 1px 0 #000;
                    pointer-events: none;
                }

                .price-display-wrapper {
                    z-index: 1;
                    position: relative;
                    bottom: 20px;
                    width: 90%;
                    font-size: 10px;
                    font-weight: bold;
                    text-shadow:
                        0 0 4px rgba(0, 0, 0, 0.8),
                        -1px -1px 0 #000,
                        1px -1px 0 #000,
                        -1px 1px 0 #000,
                        1px 1px 0 #000;
                    pointer-events: none;
                    display: flex;
                    justify-content: space-between;
                    justify-self: center;
                }

                .price-display-sell {
                    left: 1px;
                    color: #FF6B6B;
                }

                .price-display-buy {
                    right: 1px;
                    color: #4ECDC4;
                }
            `;
            document.head.appendChild(styleTag);
        }

        async start() {
            if (this.isActive) return;

            this.isActive = true;
            isAskPriceActive = true;
            await this.updateMarketData();

            // Set up intervals
            this.askPriceInterval = setInterval(() => this.updateMarketData(), this.config.updateInterval);
            this.showPricesInterval = setInterval(() => this.displayPrices(), this.config.displayUpdateInterval);

            logger("Price display system started", EXTENDED_SCRIPT_COLORS.brightGreen);
        }

        stop() {
            logger(`Stopping price display system... `, EXTENDED_SCRIPT_COLORS.orange);
            this.isActive = false;
            isAskPriceActive = false;
            // Clear intervals
            if (this.askPriceInterval) {
                clearInterval(this.askPriceInterval);
                this.askPriceInterval = null;
            }
            if (this.showPricesInterval) {
                clearInterval(this.showPricesInterval);
                this.showPricesInterval = null;
            }

            // Remove price elements
            this.removePriceElements();

            logger("Price display system stopped", EXTENDED_SCRIPT_COLORS.orange);
        }

        async updateMarketData() {
            if (!this.isActive) return;

            try {
                // Use cached data if recent
                const now = Date.now();
                if (this.marketData && (now - this.marketDataTimestamp) < this.config.marketDataCacheTime) {
                    return;
                }

                // Handle different marketJson formats
                let market = null;
                if (isParsableJSON(marketJson) && (now - this.marketDataTimestamp) < this.config.marketDataCacheTime) {
                    market = JSON.parse(marketJson);
                } else if (typeof marketJson === "object" && marketJson !== null) {
                    market = marketJson;
                } else {
                    market = await fetchMarketJSON(true);
                }

                if (!market?.marketData) {
                    logger("Invalid market data received");
                    return;
                }

                this.marketData = market;
                this.marketDataTimestamp = now;

                logger("Market data updated", EXTENDED_SCRIPT_COLORS.brightGreen);
            } catch (error) {
                logger("Error updating market data: " + error, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
            }
        }

        buildItemCache(invElem) {

            this.cachedItemElements = [];

            for (const typeDiv of invElem.children) {

                const sectionTitle = typeDiv.querySelector(this.config.selectors.inventorySectionLabel)?.innerText;

                if (!sectionTitle || ["Currencies","Loot"].includes(sectionTitle)) continue;

                const itemElems = typeDiv.querySelectorAll(this.config.selectors.itemContainer);

                for (const itemElem of itemElems) {
                    const itemData = this.extractItemData(itemElem);
                    if (!itemData) continue;

                    const priceElements = this.createPriceElements(itemElem);
                    if (!priceElements) continue;

                    this.cachedItemElements.push({
                        itemElem,
                        ...itemData,
                        ...priceElements
                    });
                }
            }
        }

        extractItemData(itemElem) {
            try {
                const svg = itemElem.querySelector("svg");
                const label = svg?.getAttribute("aria-label");
                if (!label) return null;

                let itemName = label;
                if (isZHInGameSetting) {
                    itemName = getItemEnNameFromZhName(itemName);
                }

                const itemHrid = itemEnNameToHridMap[itemName];
                if (!itemHrid) return null;

                const enhanceLevel = parseInt(
                    itemElem.querySelector(this.config.selectors.enhancementLevel)?.textContent || "0",
                    10
                );

                return { itemHrid, enhanceLevel };
            } catch (error) {
                logger("Error extracting item data: " + error, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
                return null;
            }
        }

        createPriceElements(itemElem) {
            try {
                itemElem.style.position = "relative";
                const container = itemElem.querySelector(this.config.selectors.itemClickable);
                if (!container) return null;

                const elements = {};

                for (const [type, config] of Object.entries(this.config.priceElements)) {
                    let element = itemElem.querySelector(`#${config.id}`);

                    if (!element) {
                        element = document.createElement("div");
                        element.id = config.id;
                        element.className = `price-display-element price-display-${type}`;
                        container.appendChild(element);
                    }

                    elements[`${type}Elem`] = element;
                }

                return elements;
            } catch (error) {
                logger("Error creating price elements: " + error, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
                return null;
            }
        }

        displayPrices() {
            if (!this.isActive || !this.marketData) return;

            const invElem = document.querySelector(this.config.selectors.inventory);
            if (!invElem) return;

            // Rebuild cache if empty
            if (this.cachedItemElements.length === 0) {
                this.buildItemCache(invElem);
            }

            // Update prices for cached elements
            for (const item of this.cachedItemElements) {
                try {
                    const marketItem = this.marketData.marketData[item.itemHrid]?.[item.enhanceLevel];
                    if (!marketItem) continue;

                    if (item.sellElem) {
                        item.sellElem.textContent = numberFormatter(marketItem.a ?? 0);
                    }
                    if (item.buyElem) {
                        item.buyElem.textContent = numberFormatter(marketItem.b ?? 0);
                    }
                } catch (error) {
                    logger(`Error updating price for item: ${item.itemHrid} : ${error}`, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
                }
            }
        }

        setupInventoryObserver() {
            const invElem = document.querySelector(this.config.selectors.inventory);
            if (!invElem) return;

            this.inventoryObserver = new MutationObserver((mutations) => {
                // Check if there are significant changes
                const hasSignificantChange = mutations.some(mutation =>
                    mutation.type === 'childList' &&
                    (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
                );

                if (!hasSignificantChange) return;

                const htmlSnapshot = invElem.innerHTML;
                if (htmlSnapshot !== this.lastInventoryHTML) {
                    this.lastInventoryHTML = htmlSnapshot;
                    this.cachedItemElements = []; // Clear cache to force rebuild
                }
            });

            this.inventoryObserver.observe(invElem, {
                childList: true,
                subtree: true
            });

            logger("Inventory observer initialized", EXTENDED_SCRIPT_COLORS.teal);
        }

        setupCheckboxHandler() {
            const waitForCheckbox = () => {
                const checkbox = document.getElementById("toggleSellPrices");
                const label = document.getElementById("script_toggleSellPrice_label");

                if (checkbox && label) {
                    checkbox.addEventListener("click", (e) => {
                        const checked = e.target.checked;
                        localStorage.setItem("showAskPrice", checked);

                        label.style.backgroundColor = checked ? "#4CAF50" : "gray";

                        if (checked) {
                            this.start();
                        } else {
                            this.stop();
                        }
                    });
                    return;
                }

                setTimeout(waitForCheckbox, 1000);
            };

            waitForCheckbox();
        }

        removePriceElements() {
            const priceElements = document.querySelectorAll("#script_sell_price, #script_buy_price");
            priceElements.forEach(el => el.remove());
            this.cachedItemElements = [];
        }

        // Cleanup method
        destroy() {
            this.stop();

            if (this.inventoryObserver) {
                this.inventoryObserver.disconnect();
                this.inventoryObserver = null;
            }

            const styleElement = document.getElementById("price-display-styles");
            if (styleElement) {
                styleElement.remove();
            }

            this.removePriceElements();
        }
    }

    // Initialize the price display system
    function initPrices() {

        // Clean up any existing instance
        if (window.priceDisplaySystem) {
            window.priceDisplaySystem.destroy();
        }

        window.priceDisplaySystem = new PriceDisplaySystem();
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
                logger("jsonObj null");
                return;
            }

            ask = marketJson?.marketData[itemHrid]?.[0]?.a > 0 ? marketJson?.marketData[itemHrid]?.[0]?.a : 0;
            bid = marketJson?.marketData[itemHrid]?.[0]?.b > 0 ? marketJson?.marketData[itemHrid]?.[0]?.b : 0;
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
            logger("validateMarketJson jsonStr is null");
            return null;
        }

        let jsonObj = null;
        try {
            jsonObj = JSON.parse(jsonStr);
        } catch (error) {
            logger("validateMarketJson failed to parse JSON: " + error.message, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
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
                // console.log(jsonObj);
                localStorage.setItem("MWITools_marketAPI_timestamp", Date.now());
                localStorage.setItem("MWITools_marketAPI_json", JSON.stringify(jsonObj));
            }

            return jsonObj;
        } else {
            logger("validateMarketJson invalid json structure");
            return null;
        }
    }

    async function fetchMarketJSON(forceFetch = false) {

        if ((fetchMarketCalledSuccess || marketJson) && !forceFetch) {
            return isParsableJSON(marketJson) ? JSON.parse(marketJson) : marketJson;
        }

        // 🧠 Check if a fetch is already in progress — reuse it
        if (activeFetchMarketPromise && forceFetch) {
            return activeFetchMarketPromise;
        }

        // 📦 Create and store shared fetch promise
        activeFetchMarketPromise = (async () => {
            const CACHE_DURATION = 3600000; // 1 hour
            const REQUEST_TIMEOUT = 5000;

            // Check cache first
            if (!forceFetch) {

                const cachedTimestamp = localStorage.getItem("MWITools_marketAPI_timestamp");
                const cachedJson = localStorage.getItem("MWITools_marketAPI_json");
                if (cachedTimestamp && cachedJson && (Date.now() - cachedTimestamp < CACHE_DURATION)) {
                    try {
                        const parsed = JSON.parse(cachedJson);
                        logger("Using cached market JSON", EXTENDED_SCRIPT_COLORS.brightGreen);
                        return parsed;
                    } catch (error) {
                        logger("Failed to parse cached JSON, fetching fresh data " + error, EXTENDED_SCRIPT_COLORS.orange, false, "error");
                    }
                }
                logger("No valid cache found, fetching fresh data", EXTENDED_SCRIPT_COLORS.orange);
            }

            reasonForUsingExpiredMarketJson = "";

            const sendRequest = GM?.xmlhttpRequest || GM_xmlhttpRequest || null;

            if (sendRequest) {
                logger("Trying GM_xmlhttpRequest first...", EXTENDED_SCRIPT_COLORS.purple);

                try {
                    const response = await new Promise((resolve, reject) => {
                        let resolved = false;
                        const guard = setTimeout(() => {
                            if (!resolved) {
                                resolved = true;
                                reject(new Error("Manual timeout guard triggered"));
                            }
                        }, REQUEST_TIMEOUT + 500);

                        sendRequest({
                            url: MARKET_API_URL,
                            method: "GET",
                            timeout: REQUEST_TIMEOUT,
                            onload: (res) => {
                                if (!resolved) {
                                    resolved = true;
                                    clearTimeout(guard);
                                    resolve(res);
                                }
                            },
                            onabort: () => {
                                if (!resolved) {
                                    resolved = true;
                                    clearTimeout(guard);
                                    reject(new Error("Request aborted"));
                                }
                            },
                            onerror: () => {
                                if (!resolved) {
                                    resolved = true;
                                    clearTimeout(guard);
                                    reject(new Error("Network error"));
                                }
                            },
                            ontimeout: () => {
                                if (!resolved) {
                                    resolved = true;
                                    clearTimeout(guard);
                                    reject(new Error("Request timeout"));
                                }
                            }
                        });
                    });

                    if (response.status === 200) {
                        const jsonObj = validateMarketJsonFetch(response.responseText, true);
                        if (jsonObj) {
                            logger("Successfully fetched via GM_xmlhttpRequest", EXTENDED_SCRIPT_COLORS.brightGreen);
                            localStorage.setItem("MWITools_marketAPI_json", JSON.stringify(jsonObj));
                            localStorage.setItem("MWITools_marketAPI_timestamp", Date.now().toString());
                            marketJson = jsonObj;
                            fetchMarketCalledSuccess = true;
                            return jsonObj;
                        }
                    } else {
                        logger(`GM_xmlhttpRequest HTTP error: ${response.status}`, EXTENDED_SCRIPT_COLORS.darkRed);
                    }
                } catch (error) {
                    logger(`GM_xmlhttpRequest failed: ${error.message}`, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
                }
            } else {
                logger("GM_xmlhttpRequest not available", EXTENDED_SCRIPT_COLORS.darkRed);
            }

            // Fallback to fetch
            try {
                logger("Falling back to fetch()", EXTENDED_SCRIPT_COLORS.teal);
                const response = await fetch(MARKET_API_URL, { cache: "no-store" });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const text = await response.text();
                const jsonObj = validateMarketJsonFetch(text, true);
                if (jsonObj) {
                    logger("Successfully fetched via fetch()", EXTENDED_SCRIPT_COLORS.brightGreen);
                    localStorage.setItem("MWITools_marketAPI_json", JSON.stringify(jsonObj));
                    localStorage.setItem("MWITools_marketAPI_timestamp", Date.now().toString());
                    marketJson = jsonObj;
                    fetchMarketCalledSuccess = true;
                    return jsonObj;
                }
            } catch (error) {
                logger(`Fallback fetch failed: ${error.message}`, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
            }

            return handleFetchFailure("All fetch attempts failed");
        })();


        try {
            const result = await activeFetchMarketPromise;
            fetchMarketCalledSuccess = true;
            return result;
        } finally {
            // ❌ Clean up once complete so future calls can restart
            activeFetchMarketPromise = null;
        }
    }


    // Helper function to handle fetch failures
    function handleFetchFailure(reason) {
        isUsingExpiredMarketJson = true;
        reasonForUsingExpiredMarketJson += `${new Date().toUTCString()} Setting isUsingExpiredMarketJson to true: ${reason}\n`;
        toggleAlertDiv(true);

        // Try previously cached version first
        const cachedJson = localStorage.getItem("MWITools_marketAPI_json");
        const cachedTimestamp = localStorage.getItem("MWITools_marketAPI_timestamp");

        if (cachedJson && cachedTimestamp) {
            try {
                const backupTimestamp = JSON.parse(MARKET_JSON_LOCAL_BACKUP).timestamp * 1000;
                if (backupTimestamp < cachedTimestamp) {
                    const jsonObj = validateMarketJsonFetch(cachedJson, false);
                    if (jsonObj) {
                        marketJson = jsonObj;
                        reasonForUsingExpiredMarketJson += "using previously fetched version\n";
                        return jsonObj;
                    }
                }
            } catch {
                logger("Failed to use cached version, falling back to backup", EXTENDED_SCRIPT_COLORS.orange);
            }
        }

        // Fall back to hard-coded backup
        reasonForUsingExpiredMarketJson += "using hard-coded backup version\n";
        return validateMarketJsonFetch(MARKET_JSON_LOCAL_BACKUP, false);
    }

    // Helper function to toggle alert visibility
    function toggleAlertDiv(show) {
        const alertDiv = document.querySelector("div#script_api_fail_alert");
        if (alertDiv) {
            alertDiv.style.display = show ? "block" : "none";
        }
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

    function getItemHrid(name) {
        for (const item of Object.values(initData_itemDetailMap)) {
            if (item.name === name) {
                return item.hrid;
            }
        }
    }
    function getActionHridFromItemName(name) {
        let newName = name.replace("Milk", "Cow");
        newName = newName.replace("Log", "Tree");
        newName = newName.replace("Cowing", "Milking");
        newName = newName.replace("Rainbow Cow", "Unicow");
        newName = newName.replace("Collector's Boots", "Collectors Boots");
        newName = newName.replace("Knight's Aegis", "Knights Aegis");
        if (!initData_actionDetailMap) {
            logger("getActionHridFromItemName no initData_actionDetailMap: " + name);
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
            logger("start observe action panel",EXTENDED_SCRIPT_COLORS.cyan);
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

    const waitForVisibleTabPanel = () => {
        const container = document.querySelector("div.GamePage_mainPanel__2njyb");
        if (!container) return setTimeout(waitForVisibleTabPanel, 200);

        logger('🔍 Observing tab panel visibility changes...', EXTENDED_SCRIPT_COLORS.cyan);

        let lastVisible = null;

        const observer = new MutationObserver(() => {
            const visiblePanel = Array.from(container.querySelectorAll("div.TabPanel_tabPanel__tXMJF"))
            .find(panel => !panel.classList.contains("TabPanel_hidden__26UM3"));

            if (visiblePanel && visiblePanel !== lastVisible) {
                lastVisible = visiblePanel;
                // logger(`✅ New visible TabPanel: ${visiblePanel}`, EXTENDED_SCRIPT_COLORS.lime);
                handleVisibleTabPanel(visiblePanel);
            }
        });

        observer.observe(container, {
            attributes: true,
            childList: true,
            subtree: true
        });

        // Also handle initial visible panel
        const initialVisible = Array.from(container.querySelectorAll(".TabPanel_tabPanel__tXMjF"))
        .find(panel => !panel.classList.contains("TabPanel_hidden__26UM3"));
        if (initialVisible) {
            lastVisible = initialVisible;
            handleVisibleTabPanel(initialVisible);
        }
    };

    // Optimized tooltip selector
    const TOOLTIP_SELECTOR = '[role="tooltip"] div.Item_actionMenu__2yUcG, [role="tooltip"] div.Ability_actionMenu__1iyxD';

    // Cached selectors for item name extraction
    const ITEM_NAME_SELECTORS = ['.Item_name__2C42x', '.Ability_name__139E3'];

    const waitForAbilityToolTip = () => {
        let lastTooltip = null;
        let styleInjected = false;

        // Inject styles only once
        const injectStyles = () => {
            if (styleInjected) return;

            const styleTag = document.createElement("style");
            styleTag.id = "cst-tooltip-styles";
            styleTag.textContent = `
                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .cst-marketplace-btn {
                    background: linear-gradient(270deg, #6e00ff, #00c4ff, #6e00ff) !important;
                    background-size: 400% 400% !important;
                    animation: gradientMove 4s ease infinite !important;
                    color: #fff !important;
                    font-weight: 700 !important;
                    text-shadow: 0 0 3px rgba(0,0,0,0.4) !important;
                    border: none !important;
                    box-shadow: 0 0 6px rgba(0,0,0,0.4) !important;
                    transition: box-shadow 0.3s !important;
                    cursor: pointer !important;
                }

                .cst-marketplace-btn:hover {
                    box-shadow: 0 0 12px 2px rgba(0, 200, 255, 0.7) !important;
                }
            `;
            document.head.appendChild(styleTag);
            styleInjected = true;
        };

        const observer = new MutationObserver((mutations) => {
            // Check if mutations contain relevant changes
            const hasRelevantMutation = mutations.some(mutation =>
                mutation.type === 'childList' &&
                (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
            );

            if (!hasRelevantMutation) return;

            const tooltip = document.querySelector(TOOLTIP_SELECTOR);

            // Only trigger if a new tooltip appears
            if (tooltip && tooltip !== lastTooltip) {
                lastTooltip = tooltip;
                handleAbilityToolTip(tooltip);
            }

            // If tooltip disappears, reset tracker
            if (!tooltip && lastTooltip) {
                lastTooltip = null;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        injectStyles();
        logger("🔍 Watching for ability tooltips globally...", EXTENDED_SCRIPT_COLORS.cyan);
    };

    function handleAbilityToolTip(panel) {
        try {
            // Remove existing buttons more efficiently
            const existingButtons = panel.querySelectorAll("#cst-view");
            existingButtons.forEach(btn => btn.remove());

            // Create marketplace button
            const marketplaceBtn = createMarketplaceButton(panel);
            if (!marketplaceBtn) return;

            // Get item data
            const itemData = getItemData(panel);
            if (!itemData) {
                console.warn("⚠️ Could not find item data for tooltip");
                return;
            }

            // Add click handler
            marketplaceBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                const itemHrid = itemData.itemHrid || itemData.hrid;
                if (itemHrid) {
                    const url = `https://milkyway.market/all-items?item=${encodeURIComponent(itemHrid)}`;
                    window.open(url, "_blank");
                }
            });

            panel.appendChild(marketplaceBtn);

        } catch (err) {
            logger("⚠️ handleAbilityToolTip error: " + err, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
        }
    }

    function createMarketplaceButton(panel) {
        try {
            // Find template button to clone styles from
            const templateBtn = panel.children[3] || panel.children[1];
            if (!templateBtn) return null;

            const clone = templateBtn.cloneNode(false); // Shallow clone for better performance

            // Set button properties
            clone.id = "cst-view";
            clone.innerHTML = `${isZH ? "在 Milkyway.Market 上查看" : "Check in Milkyway.Market"} <span style="margin-left: 6px;">🔗</span>`;
            clone.className = `${templateBtn.className} cst-marketplace-btn`;

            return clone;
        } catch (err) {
            logger("⚠️ createMarketplaceButton error:", err);
            return null;
        }
    }

    function getItemData(panel) {
        try {
            // Extract item name using cached selectors
            let itemNameElement = null;
            for (const selector of ITEM_NAME_SELECTORS) {
                itemNameElement = panel.querySelector(selector);
                if (itemNameElement) break;
            }

            if (!itemNameElement) return null;

            const itemName = itemNameElement.innerText.trim().toLowerCase().replace(/\s+/g, "_");

            // Search in character items first (likely more common)
            let foundItem = initData_characterItems?.find(item =>
                item.itemHrid?.toLowerCase().includes(itemName)
            );

            // Fallback to item detail map
            if (!foundItem && initData_itemDetailMap) {
                foundItem = Object.values(initData_itemDetailMap).find(item =>
                    item.hrid?.toLowerCase().includes(itemName)
                );
            }

            return foundItem;
        } catch (err) {
            logger("⚠️ getItemData error: " + err, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
            return null;
        }
    }

    function parseShorthandNumber(text) {
        if (!text) return NaN;

        const cleaned = text.trim().replace(/,/g, "").toUpperCase(); // Remove commas and normalize case

        const match = cleaned.match(/^([\d.]+)([KMB])?$/);
        if (!match) return parseFloat(cleaned); // Fallback if no suffix

        const number = parseFloat(match[1]);
        const suffix = match[2];

        const multiplier = {
            K: 1e3,
            M: 1e6,
            B: 1e9,
        };

        return suffix ? number * multiplier[suffix] : number;
    }

    async function showRequiredItems(panel, maxNum) {
        const requiresDiv = panel.querySelector("div.SkillActionDetail_itemRequirements__3SPnA");
        if (!requiresDiv) {
            showOutputEXP(panel, maxNum);
            showOutputAmounts(panel, maxNum);
            return;
        };
        const children = Array.from(requiresDiv.children);
        // Remove existing cloned element (if any)
        const clonedItems = panel.querySelectorAll("span#req-mis");
        if (clonedItems && clonedItems.length > 0) {
            clonedItems.forEach((existing) => {
                existing.remove();
            })
        };
        const inventorySpans = panel.querySelectorAll("span.SkillActionDetail_inventoryCount__tHmPD");
        const inputSpans = Array.from(
            panel.querySelectorAll("span.SkillActionDetail_inputCount__1rdrn")
        ).filter(span => !span.innerText.includes("Required"));
        const possibleCounts = [];

        // Helper function to normalize numbers from different locales
        function normalizeNumber(text) {
            // Remove all spaces first
            text = text.replace(/\s/g, '');

            // Check if it uses comma as decimal separator (European format)
            // Pattern: digits, then comma, then 1-2 digits at the end
            if (/^\d+,\d{1,2}$/.test(text)) {
                // This is a decimal number with comma separator (e.g., "0,9")
                return parseFloat(text.replace(',', '.'));
            }

            // Otherwise, treat commas as thousand separators and remove them
            text = text.replace(/,/g, '');
            return parseFloat(text);
        }

        for (let i = 0; i < inventorySpans.length && i < inputSpans.length; i++) {
            const index = i;
            let invText = inventorySpans[i].innerText.trim();
            let inputText = inputSpans[i].innerText.trim();
            if (invText.toLowerCase().includes("k") || invText.toLowerCase().includes("m")) {
                invText = invText.toLowerCase().replaceAll("k", "000").replaceAll("m", "000000");
            }
            // Use the normalized parsing for inventory value
            const invValue = normalizeNumber(invText);

            // For input value, still use the existing logic but with normalization
            const match = inputText.match(/\/\s*([\d,\.]+)/);
            const inputValue = match ? normalizeNumber(match[1]) : NaN;

            if (!isNaN(invValue) && !isNaN(inputValue) && inputValue > 0) {
                const multipliedValue = inputValue * maxNum;
                var dict = {
                    index,
                    multipliedValue,
                    invValue,
                    inputValue
                };
                possibleCounts.push(dict);
            }
        }
        let j = 0;
        children.forEach((child, index) => {
            if (child.className.includes("inputCount")) {
                const fromDict = Array.from(possibleCounts).find(count => count.index === j);
                const newText = isZH ? `所需: ${fromDict.multipliedValue.toLocaleString()}` : `Required: ${fromDict.multipliedValue.toLocaleString()}`;
                const targetContainer = requiresDiv.children[index + 1];
                if (!targetContainer) return;
                const req = child.cloneNode(true);
                req.id = "req-mis";
                req.textContent = newText;
                req.style.color = (fromDict.multipliedValue > fromDict.invValue) ? "red" : "gold";
                req.style.cssText += `
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100%;
                `;
                targetContainer.appendChild(req);
                if (fromDict.multipliedValue > fromDict.invValue) {
                    req.textContent += (isZH ? ` || 缺少: ${(fromDict.multipliedValue - fromDict.invValue).toLocaleString()}` : ` || Missing: ${(fromDict.multipliedValue- fromDict.invValue).toLocaleString()}`);
                }
            j++;
        }
                         });
        showOutputEXP(panel, maxNum);
    }

    const calculateLevelsGained = (startingLevel, startingExp, expGain, levelTable) => {

        let currentLevel = startingLevel;
        let currentExp = startingExp;
        let remainingExp = expGain;

        while (currentLevel + 1 in levelTable) {
            const expToNext = levelTable[currentLevel + 1] - currentExp;

            if (remainingExp >= expToNext) {
                remainingExp -= expToNext;
                currentLevel++;
                currentExp = levelTable[currentLevel];
            } else {
                currentExp += remainingExp;
                break;
            }
        }

        return {
            newLevel: currentLevel,
            leftoverExp: remainingExp,
            finalExp: currentExp
        };
    };

    function getCurrLevelAndExp(actionName) {

        // Level calculation section - now in overlay
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
        return {currentLevel, currentExp};
    }

    async function showOutputEXP(panel, amount) {
        const outputDiv = panel.querySelector("div.SkillActionDetail_expGain__F5xHu");
        if (!outputDiv) return;

        const clone = outputDiv.cloneNode(true);
        const clone2 = outputDiv.cloneNode(true);
        const parent = outputDiv.parentNode;
        const svg = outputDiv.firstElementChild.outerHTML;
        const value = parseFloat(outputDiv.textContent.replace(/,/g, ""), 10); // Remove commas before parsing
        if (isNaN(value)) return;

        const multipliedValue = value * amount;
        const newText = `${multipliedValue.toLocaleString()}${svg}`; // Optional formatting


        // Keep only the first child (assumed to be a <div>), remove the rest
        while (parent.children.length > 2) {
            parent.removeChild(parent.children[1]);
        }

        const { currentLevel, currentExp } = getCurrLevelAndExp(globalActionName);
        const {newLevel, leftoverExp, finalExp } = calculateLevelsGained(currentLevel, currentExp, multipliedValue, initData_levelExperienceTable);

        // Check if a child with the same className and newText already exists
        const alreadyExists = Array.from(parent.children).some(el =>
                                                               el.className === clone.className && el.textContent.trim() === newText
                                                              );

        if (!alreadyExists) {
            clone.innerHTML = newText;
            clone.style.cssText = `
                color: #546ddb !important;
                text-shadow: 0 0 6px rgba(157, 78, 221, 0.6) !important;
                font-weight: 600 !important;
                margin-top: 2px !important;
            `;
            parent.insertBefore(clone, parent.children[parent.children.length - 1]);

            if (newLevel > currentLevel)  // Only show level up if new level is greater than current
            {

                const newText2 = `Level: ${currentLevel} -> ${newLevel} 🌟 `; // Optional formatting
                clone2.innerHTML = newText2;
                clone2.style.cssText = `
                    color:rgb(219, 217, 84) !important;
                    text-shadow: 0 0 6px rgba(157, 78, 221, 0.6) !important;
                    font-weight: 600 !important;
                    margin-top: 2px !important;
                `;
                parent.insertBefore(clone2, parent.children[parent.children.length - 1]);
            }
        }

    }

    async function showOutputAmounts(panel, amount) {
        // Helper function to process drops in any container
        const processDropContainer = (container, colorClass = "gold") => {
            if (!container) return;

            const children = Array.from(container.children);

            // Remove existing cloned elements
            const clonedItems = container.querySelectorAll(".cloned-output");
            clonedItems.forEach((existing) => existing.remove());
            // Helper function to process a single child element
            const processChildElement = (child, colorClass, amount) => {
                // Look for output element (first child with numbers or ranges)
                const outputElement = child.children[0]?.innerText.includes("-") || child.children[0]?.innerText.match(/[\d\.]+/)
                ? child.children[0]
                : null;

                if (!outputElement) return;

                // Extract drop rate from the child's text
                const dropRateText = child.innerText;
                const rateMatch = dropRateText.match(/~?([\d\.]+)%/);
                const dropRate = rateMatch ? parseFloat(rateMatch[1]) / 100 : 1; // Default to 100%

                // Parse output values
                const output = outputElement.innerText.split("-");

                // Create styled clone
                const clone = outputElement.cloneNode(true);
                clone.classList.add("cloned-output");
                clone.style.cssText = `
        color: ${getColorValue(colorClass)};
        text-shadow: 0 0 6px ${getShadowValue(colorClass)};
        font-weight: 600;
        margin-top: 2px;
    `;

                // Calculate and set the expected output
                if (output.length > 1) {
                    // Range output (e.g., "1.3 - 4")
                    const minOutput = parseFloat(output[0].trim());
                    const maxOutput = parseFloat(output[1].trim());
                    const expectedMin = (minOutput * amount * dropRate).toFixed(1);
                    const expectedMax = (maxOutput * amount * dropRate).toFixed(1);
                    clone.innerText = `${expectedMin} - ${expectedMax}`;
                } else {
                    // Single value output
                    const value = parseFloat(output[0].trim());
                    const expectedValue = (value * amount * dropRate).toFixed(1);
                    clone.innerText = `Roughly ${expectedValue}`;
                }

                return clone;
            };

            // Helper functions for colors
            const getColorValue = (colorClass) => {
                const colors = {
                    gold: "#FFD700",
                    essence: "#9D4EDD",
                    default: "#FF6B6B"
                };
                return colors[colorClass] || colors.default;
            };

            const getShadowValue = (colorClass) => {
                const shadows = {
                    gold: "rgba(255, 215, 0, 0.6)",
                    essence: "rgba(157, 78, 221, 0.6)",
                    default: "rgba(255, 107, 107, 0.6)"
                };
                return shadows[colorClass] || shadows.default;
            };

            // Main processing logic
            children.forEach((childs) => {
                const hasDropElements = childs.children.length > 1 && childs.querySelector("div.SkillActionDetail_drop__26KBZ");

                if (hasDropElements) {
                    // Process multiple drop elements
                    const dropElements = childs.querySelectorAll("div.SkillActionDetail_drop__26KBZ");

                    dropElements.forEach(child => {
                        const clone = processChildElement(child, colorClass, amount);
                        if (clone) {
                            child.after(clone);
                        }
                    });

                } else {
                    // Process single element
                    const clone = processChildElement(childs, colorClass, amount);
                    if (clone) {
                        childs.parentNode.insertBefore(clone, childs.nextSibling);
                    }
                }
            });
        };

        // Process main outputs
        let dropTable = panel.querySelector("div.SkillActionDetail_dropTable__3ViVp");
        if (!dropTable) return;

        let outputItems = panel.querySelector("div.SkillActionDetail_outputItems__3zp_f");
        if (outputItems) dropTable = outputItems;

        processDropContainer(dropTable, "gold");

        // Process Essences
        const essencesContainer = panel.querySelector("div.SkillActionDetail_dropTable__3ViVp");
        if (essencesContainer) {
            // Look for essence-specific containers or items with "Essence" in the name
            const essenceItems = essencesContainer.querySelectorAll('[class*="drop"], [class*="Item"]');
            essenceItems.forEach(item => {
                if (item.innerText.toLowerCase().includes('essence')) {
                    const parent = item.closest('[class*="SkillActionDetail"]');
                    if (parent && !parent.querySelector('.cloned-output')) {
                        processDropContainer(parent.parentElement, "essence");
                    }
                }
            });
        }

        // Process Rares
        const raresContainer = panel.querySelector("div.SkillActionDetail_dropTable__3ViVp");
        if (raresContainer) {
            // Look for rare-specific containers or items with rare indicators
            const rareItems = raresContainer.querySelectorAll('[class*="drop"], [class*="Item"]');
            rareItems.forEach(item => {
                // Check for rare items (typically have very low percentages or specific naming)
                if (item.innerText.includes('%') && !item.innerText.toLowerCase().includes('essence')) {
                    const percentage = item.innerText.match(/([\d\.]+)%/);
                    if (percentage && parseFloat(percentage[1]) < 5) { // Assume rares are < 5%
                        const parent = item.closest('[class*="SkillActionDetail"]');
                        if (parent && !parent.querySelector('.cloned-output')) {
                            processDropContainer(parent.parentElement, "rare");
                        }
                    }
                }
            });
        }

        // Alternative approach: Look for specific section containers
        const allDropSections = panel.querySelectorAll('div[class*="SkillActionDetail_label"]');
        allDropSections.forEach(labelDiv => {
            const labelText = labelDiv.innerText.toLowerCase();
            let colorClass = "gold";

            if (labelText.includes('essence')) {
                colorClass = "essence";
            } else if (labelText.includes('rare')) {
                colorClass = "rare";
            }

            // Find the next sibling that contains the actual drops
            let nextSibling = labelDiv.nextElementSibling;
            while (nextSibling && !nextSibling.querySelector('[class*="drop"], [class*="Item"]')) {
                nextSibling = nextSibling.nextElementSibling;
            }

            if (nextSibling && colorClass !== "gold") {
                processDropContainer(nextSibling, colorClass);
            }
        });
    }

    async function addMaxLButton(quickInputButtonsDiv, panel, inputElem) {

        const button = document.createElement("button");

        button.innerText = isZH ? "受限最大值" : "MAX_LOW";

        styleDarkThemeButton(button);

        button.onclick = () => {
            const inventorySpans = panel.querySelectorAll("span.SkillActionDetail_inventoryCount__tHmPD");
            const inputSpans = Array.from(
                panel.querySelectorAll("span.SkillActionDetail_inputCount__1rdrn")
            ).filter(span => !span.innerText.includes("Required"));
            const possibleCounts = [];
            for (let i = 0; i < inventorySpans.length && i < inputSpans.length; i++) {
                const invText = inventorySpans[i].innerText.trim().replace(/,/g, "");
                const inputText = inputSpans[i].innerText.trim();

                const invValue = parseShorthandNumber(invText);
                const match = inputText.match(/\/\s*([\d,]+)/);
                const inputValue = match ? parseInt(match[1].replace(/,/g, ""), 10) : NaN;

                if (!isNaN(invValue) && !isNaN(inputValue) && inputValue > 0) {
                    possibleCounts.push(Math.floor(invValue / inputValue));
                }
            }

            const m_value = possibleCounts.length ? Math.min(...possibleCounts) : 0;

            reactInputTriggerHack(inputElem, m_value);
            showRequiredItems(panel, m_value);
            showOutputAmounts(panel, m_value);
        };

        quickInputButtonsDiv.append(button);
    }

    async function addMaxHButton(quickInputButtonsDiv, panel, inputElem) {

        const button = document.createElement("button");

        button.innerText = isZH ? "理论最大值" : "MAX_HIGH";
        styleDarkThemeButton(button);

        button.onclick = () => {
            const inventorySpans = panel.querySelectorAll("span.SkillActionDetail_inventoryCount__tHmPD");
            const inputSpans = Array.from(
                panel.querySelectorAll("span.SkillActionDetail_inputCount__1rdrn")
            ).filter(span => !span.innerText.includes("Required"));
            const possibleCounts = [];

            for (let i = 0; i < inventorySpans.length && i < inputSpans.length; i++) {
                const invText = inventorySpans[i].innerText.trim().replace(/,/g, "");
                const inputText = inputSpans[i].innerText.trim();

                const invValue = parseShorthandNumber(invText);
                const match = inputText.match(/\/\s*([\d,]+)/);
                const inputValue = match ? parseInt(match[1].replace(/,/g, ""), 10) : NaN;

                if (!isNaN(invValue) && !isNaN(inputValue) && inputValue > 0) {
                    possibleCounts.push(Math.floor(invValue / inputValue));
                }
            }

            const m_value = possibleCounts.length ? Math.max(...possibleCounts) : 0;
            reactInputTriggerHack(inputElem, m_value);
            showRequiredItems(panel, m_value);
            showOutputAmounts(panel, m_value);
        };

        quickInputButtonsDiv.append(button);
    }

    async function addGatherMax(quickInputButtonsDiv, panel, inputElem, actionName, effBuff, duration, exp) {

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
        let m_value = calculateNeedToLevel(currentLevel, currentLevel + 1, effBuff, duration, exp).numOfActions;
        const button = document.createElement("button");

        button.innerText = m_value;

        button.id = "maxForGather";

        styleDarkThemeButton(button);

        button.onclick = () => {
            reactInputTriggerHack(inputElem, parseInt(button.innerText));
            showRequiredItems(panel, parseInt(button.innerText));
            showOutputEXP(panel, parseInt(button.innerText));
            showOutputAmounts(panel, parseInt(button.innerText));
        };

        quickInputButtonsDiv.append(button);
    }

    function expLeft(actionName){

        const skillHrid = "/skills/" + actionName.toLowerCase();

        let currentExp = null;
        let currentLevel = null;
        if (!initData_characterSkills) return;
        for (const skill of initData_characterSkills) {
            if (skill.skillHrid === skillHrid) {
                currentExp = skill.experience;
                currentLevel = skill.level;
                break;
            }
        }

        const calculateNeedToLevel = (currentLevel, targetLevel) => {

            let needExpToNextLevel = null;

            for (let level = currentLevel; level < targetLevel; level++) {
                if (level === currentLevel) {
                    needExpToNextLevel = initData_levelExperienceTable[level + 1] - currentExp;
                } else {
                    needExpToNextLevel = initData_levelExperienceTable[level + 1] - initData_levelExperienceTable[level];
                }
            }
            return parseInt(needExpToNextLevel + 1);
        };

        return calculateNeedToLevel(currentLevel, currentLevel + 1).toLocaleString();
    }

    async function handleVisibleTabPanel(panel) {
        const skillGrid = panel.querySelectorAll("div.SkillAction_skillAction__1esCp");
        const panels = Array.from(skillGrid);
        if (panels.length === 0) return;

        // Clear previous interval if any
        if (liveCreateInterval) clearInterval(liveCreateInterval);

        const skillPanel = document.querySelector("div.GatheringProductionSkillPanel_gatheringProductionSkillPanel__vG4M7");
        if (!skillPanel) {
            const combatTitle = document.querySelector("h1.CombatPanel_title__WUVp8");
            if (combatTitle) return;
        }
        const title = skillPanel?.querySelector("h1.GatheringProductionSkillPanel_title__3VihQ");
        let titleName = title?.children[0]?.innerText || '';

        // Remove existing indicators and filter controls
        panel.querySelectorAll("#can_Create").forEach(existing => existing.remove());
        panel.querySelectorAll("#filter_controls").forEach(existing => existing.remove());

        // Create filter controls container
        const filterContainer = document.createElement("div");
        filterContainer.id = "filter_controls";
        filterContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 10px;
        margin-bottom: 15px;
    `;
        if (!["Milking", "Foraging", "Woodcutting", "Combat"].includes(titleName)) {
            // Create filter button
            const filterButton = document.createElement("button");
            filterButton.textContent = isZH ? "仅显示可制作" : "Show Only Produceable";
            filterButton.style.cssText = `
                padding: 8px 16px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: background 0.3s;
                white-space: nowrap;
            `;
            filterButton.onmouseover = () => filterButton.style.background = "#45a049";
            filterButton.onmouseout = () => filterButton.style.background = isFiltered ? "#ff9800" : "#4CAF50";
            filterContainer.appendChild(filterButton);

            // Filter toggle function
            const toggleFilter = () => {
                isFiltered = !isFiltered;

                // Update button text and style
                if (isFiltered) {
                    filterButton.textContent = isZH ? "显示全部" : "Show All";
                    filterButton.style.background = "#ff9800";
                } else {
                    filterButton.textContent = isZH ? "仅显示可制作" : "Show Only Produceable";
                    filterButton.style.background = "#4CAF50";
                }

                applyFilters();
            };
            filterButton.onclick = toggleFilter;
        }

        // Create search input
        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = isZH ? "搜索物品..." : "Search items...";
        searchInput.style.cssText = `
        padding: 8px 12px;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
        flex: 1;
        transition: border-color 0.3s;
        max-width: 200px;
    `;
        searchInput.onfocus = () => searchInput.style.borderColor = "#4CAF50";
        searchInput.onblur = () => searchInput.style.borderColor = "#ddd";

        // Add controls to container
        filterContainer.appendChild(searchInput);

        // Initial render and store references
        const labelMap = new Map();
        const panelData = new Map(); // store panel + its produceable status

        const button = document.createElement("button");
        button.innerText = isZH ? "💰 显示售价" : "💰 Show Prices";
        button.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    padding: 8px 16px;
                    background: ${localStorage.getItem("showSellPrice") === "true" ? "linear-gradient(135deg, rgba(78, 205, 196, 0.8), rgba(76, 175, 80, 0.8))" : "linear-gradient(135deg, rgba(136, 136, 136, 0.8), rgba(100, 100, 100, 0.8))"};
                    color: white;
                    border: 1px solid ${localStorage.getItem("showSellPrice") === "true" ? "rgba(78, 205, 196, 0.4)" : "rgba(136, 136, 136, 0.4)"};
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    user-select: none;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
                    margin-right: 15px;
                    backdrop-filter: blur(2px);`
        button.onmouseover = () => button.style.background = localStorage.getItem("showSellPrice") === "true" ? "linear-gradient(135deg, rgba(78, 205, 196, 0.9), rgba(76, 175, 80, 0.9))" : "linear-gradient(135deg, rgba(136, 136, 136, 0.9), rgba(100, 100, 100, 0.9))";
        button.onmouseout = () => button.style.background = localStorage.getItem("showSellPrice") === "true" ? "linear-gradient(135deg, rgba(78, 205, 196, 0.8), rgba(76, 175, 80, 0.8))" : "linear-gradient(135deg, rgba(136, 136, 136, 0.8), rgba(100, 100, 100, 0.8))";

        button.onclick = () => {

            let showSellPrice = localStorage.getItem("showSellPrice") === "true";
            localStorage.setItem("showSellPrice", !showSellPrice);

            showSellPrice = localStorage.getItem("showSellPrice") === "true";
            button.style.background = showSellPrice ? "linear-gradient(135deg, rgba(78, 205, 196, 0.8), rgba(76, 175, 80, 0.8))" : "linear-gradient(135deg, rgba(136, 136, 136, 0.8), rgba(100, 100, 100, 0.8))";
            button.style.border = showSellPrice ? "1px solid rgba(78, 205, 196, 0.4)" : "1px solid rgba(136, 136, 136, 0.4)";

            if (showSellPrice) {
                applySellPrice();
            } else {
                removeSellPrice();
            }
        }

        filterContainer.appendChild(button);
        // Find the skill grid container and insert controls before it
        const skillGridContainer = panel.querySelector("div.SkillActionGrid_skillActionGrid__1tJFk");
        if (skillGridContainer) {
            panel.insertBefore(filterContainer, skillGridContainer);
        } else {
            // Fallback: insert at the beginning of the panel
            panel.insertBefore(filterContainer, panel.firstChild);
        }

        panels.forEach((skillPanel) => {
            let actionName = skillPanel.children[0].innerText;
            if (actionName.includes("\\")) {
                actionName = actionName.split("\\")[0];
            }
            const action = initData_actionDetailMap[getActionHridFromItemName(actionName)];

            // Store the action name for search filtering
            panelData.set(skillPanel, {
                canProduce: true,
                minCrafts: action.inputItems && action.inputItems.length > 0 ? 0 : Infinity,
                actionName: actionName.toLowerCase()
            });

            if (!action.inputItems || action.inputItems.length === 0) {
                return;
            }

            const span = document.createElement("span");
            span.id = "can_Create";
            span.style.display = "block";
            span.style.fontWeight = "bold";
            skillPanel.children[0].appendChild(span);

            labelMap.set(span, action);
        });

        // Filter states
        let isFiltered = false;
        let searchTerm = "";

        const itemNameLowerToHridMap = {};
        for (const [key, value] of Object.entries(itemEnNameToHridMap)) {
            itemNameLowerToHridMap[key.toLowerCase()] = value;
        }
        const applySellPrice = async () => {

            const price_data = await fetchMarketJSON(); // Only fetch once
            removeSellPrice();
            panels.forEach((skillPanel) => {
                const data = panelData.get(skillPanel);
                if (!data) return;
                let actionName, itemHrid;

                if (titleName === "Woodcutting") {

                    const treeName = data.actionName.trim(); // e.g. "Birch Tree"

                    // Handle generic case
                    if (treeName.toLowerCase() === "tree") {
                        actionName = "Log";
                    } else {
                        // Remove "Tree" suffix if present
                        const prefix = treeName.replace(/ ?tree$/i, "");
                        actionName = `${prefix} Log`;
                    }

                    // Use normalized map
                    itemHrid = itemNameLowerToHridMap[actionName.toLowerCase()];

                } else if (titleName === "Milking") {

                    const cowName = data.actionName.trim(); // e.g. "Birch Tree"

                    // Handle generic case
                    if (cowName.toLowerCase() === "cow") {
                        actionName = "Milk";
                    } else if (cowName.toLowerCase() === "unicow") {
                        actionName = `Rainbow Milk`;
                    } else {
                        // Remove "Tree" suffix if present
                        const prefix = cowName.replace(/ ?cow$/i, "");
                        actionName = `${prefix} Milk`;
                    }

                    // Use normalized map
                    itemHrid = itemNameLowerToHridMap[actionName.toLowerCase()];
                } else {
                    actionName = data.actionName.normalize();
                    itemHrid = itemNameLowerToHridMap[actionName.toLowerCase()];
                }

                const marketEntry = price_data.marketData[itemHrid]?.[0] || {};

                const askPrice = marketEntry.a > 0 ? marketEntry.a : 0;
                const bidPrice = marketEntry.b > 0 ? marketEntry.b : 0;

                // 🧠 Add prices directly into the stored object
                data.askPrice = askPrice;
                data.bidPrice = bidPrice;

                const priceWrapper = document.createElement("div");
                priceWrapper.classList.add("price-display-wrapper");

                // 🪧 Optional: display on the UI
                const priceSpanSell = document.createElement("div");
                priceSpanSell.id = "itemSellPrice";
                priceSpanSell.classList.add("price-display-sell");
                priceSpanSell.textContent = numberFormatter(askPrice);

                const priceSpanBuy = document.createElement("div");
                priceSpanBuy.id = "itemBuyPrice";
                priceSpanBuy.classList.add("price-display-buy");
                priceSpanBuy.textContent = numberFormatter(bidPrice);

                priceWrapper.appendChild(priceSpanSell);
                priceWrapper.appendChild(priceSpanBuy);

                skillPanel.appendChild(priceWrapper);
            });
        };
        const removeSellPrice = async() => {
            document.querySelectorAll(".price-display-wrapper").forEach(el => el.remove());
            document.querySelectorAll("#itemSellPrice").forEach(el => el.remove());
            document.querySelectorAll("#itemBuyPrice").forEach(el => el.remove());
        }
        // Apply filters function
        const applyFilters = () => {
            panels.forEach(skillPanel => {
                const data = panelData.get(skillPanel);
                let shouldShow = true;

                // Apply produceable filter
                if (isFiltered && data.canProduce && data.minCrafts <= 0) {
                    shouldShow = false;
                }

                // Apply search filter
                if (searchTerm && !data.actionName.includes(searchTerm.toLowerCase())) {
                    shouldShow = false;
                }

                skillPanel.style.display = shouldShow ? "grid" : "none";
            });
        };

        // Search input handler
        const handleSearch = () => {
            searchTerm = searchInput.value;
            applyFilters();
        };

        // Add event listeners
        searchInput.oninput = handleSearch;

        // Live update logic
        const updateLabels = () => {
            for (const [span, action] of labelMap.entries()) {
                const maxCraftsPerInput = action.inputItems.map(input => {
                    const invCount = getItemCountFromInv(input.itemHrid);
                    return Math.floor(invCount / input.count);
                });

                let minCrafts = Math.min(...maxCraftsPerInput);

                if (action.upgradeItemHrid && action.upgradeItemHrid.trim() !== "") {
                    const upgradeItemCount = getItemCountFromInv(action.upgradeItemHrid);
                    minCrafts = Math.min(minCrafts, upgradeItemCount);
                }

                span.style.color = minCrafts > 0 ? "gold" : "red";
                span.textContent = isZH ? `可制作: ${minCrafts}` : `Can produce: ${minCrafts}`;

                // Update panel data for filtering
                const skillPanel = span.closest("div.SkillAction_skillAction__1esCp");
                const data = panelData.get(skillPanel);
                if (data) {
                    data.canProduce = true;
                    data.minCrafts = minCrafts;
                }
            }

            // Re-apply filters
            applyFilters();
            if (localStorage.getItem("showSellPrice") === "true") applySellPrice();
        };

        // Start live updates
        updateLabels(); // run once immediately
        liveCreateInterval = setInterval(updateLabels, 1000); // update every second
    }

    // Function to create draggable overlay panel
    function createDraggableOverlay(actionName) {
        // Remove existing overlay if it exists
        const existingOverlay = document.getElementById('actionToolsOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        const modal = document.querySelector("div.Modal_modal__1Jiep");
        // how far you want to nudge the overlay
        const yOffsetPct = 0; // 10 % below the modal
        const xOffsetPct = -0.6; // 10 % to the right of the modal

        let modalTop, modalLeft, modalHeight, modalWidth;

        const lastPos = localStorage.getItem("actionToolsOverlayPos");
        const lastSize = localStorage.getItem("actionToolsOverlaySize");
        let notSaved = true;

        if (!lastPos) {
            modalTop = "50%";
            modalLeft = "50%";
        } else {
            const [top, left] = lastPos.split(",");
            modalTop = top;
            modalLeft = left;
        }

        if (!lastSize) {
            modalWidth = Window.width > 800 ? 400 : 300;
            modalHeight = "auto";
        } else {
            const [height, width] = lastSize.split(",");
            modalHeight = height;
            modalWidth = width;
        }
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.id = 'actionToolsOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: ${modalTop};
            left: ${modalLeft};
            width: ${modalWidth};
            height: ${modalHeight};
            max-height: 80vh;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(30, 30, 60, 0.95));
            border: 2px solid rgba(156, 220, 255, 0.4);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            z-index: 999;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        // Create header with drag handle and close button
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, rgba(78, 205, 196, 0.2), rgba(138, 43, 226, 0.2));
            padding: 12px 16px;
            border-bottom: 1px solid rgba(156, 220, 255, 0.3);
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #9CDCFF;
            font-weight: 600;
            font-size: 14px;
            text-shadow: 0 0 6px rgba(156, 220, 255, 0.6);
        `;

        header.innerHTML = `
            <span>⚡ ${actionName} </span>
            <button id="closeOverlay" style="
                background: rgba(255, 107, 107, 0.2);
                border: 1px solid rgba(255, 107, 107, 0.4);
                color: #FF6B6B;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                z-index: 999999;
            ">×</button>
        `;

        // Create scrollable content area
        const content = document.createElement('div');
        content.id = 'overlayContent';
        content.style.cssText = `
            padding: 16px;
            overflow-y: auto;
            flex: 1;
            max-height: calc(80vh - 60px);
        `;

        // Assemble overlay
        overlay.appendChild(header);
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Make draggable
        makeDraggable(overlay, header);

        // Close button functionality
        const closeButton = header.querySelector('#closeOverlay');
        closeButton.onclick = () => overlay.remove();
        closeButton.ontouchend = () => overlay.remove();

        const observer = new MutationObserver(() => {
            const modal = document.querySelector("div.Modal_modal__1Jiep");
            if (!modal) {
                if (notSaved) {
                    localStorage.setItem("actionToolsOverlayPos", `${overlay.style.top},${overlay.style.left}`);
                    localStorage.setItem("actionToolsOverlaySize", `${overlay.style.height},${overlay.style.width}`);

                    notSaved = false;
                }
                overlay.remove();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return content;
    }

    function makeDraggable(element, dragHandle) {
        let isDragging = false;
        let isResizing = false;
        let dragOffset = { x: 0, y: 0 };
        let resizeOffset = { x: 0, y: 0 };

        // Get position from mouse or touch event
        const getEventPos = (e) => {
            if (e.touches && e.touches[0]) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        };

        // Create resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, rgba(156, 220, 255, 0.3), rgba(156, 220, 255, 0.6));
            cursor: nw-resize;
            border-radius: 0 0 12px 0;
            opacity: 0.7;
            transition: opacity 0.2s;
        `;

        resizeHandle.innerHTML = `
            <div style="
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-bottom: 8px solid rgba(156, 220, 255, 0.8);
            "></div>
        `;

        element.appendChild(resizeHandle);

        // Hover effects
        resizeHandle.onmouseenter = () => resizeHandle.style.opacity = '1';
        resizeHandle.onmouseleave = () => resizeHandle.style.opacity = '0.7';

        // Drag events for dragHandle
        dragHandle.onmousedown = (e) => {
            if (e.target === resizeHandle || resizeHandle.contains(e.target)) return;
            startDrag(e);
        };

        dragHandle.ontouchstart = (e) => {
            if (e.target === resizeHandle || resizeHandle.contains(e.target)) return;
            startDrag(e);
        };

        // Resize events for resizeHandle
        resizeHandle.onmousedown = (e) => {
            startResize(e);
        };

        resizeHandle.ontouchstart = (e) => {
            startResize(e);
        };

        function startDrag(e) {
            isDragging = true;
            const pos = getEventPos(e);
            dragOffset.x = pos.x - element.offsetLeft;
            dragOffset.y = pos.y - element.offsetTop;
            element.style.cursor = 'grabbing';
            e.preventDefault();
            e.stopPropagation();
        }

        function startResize(e) {
            isResizing = true;
            const pos = getEventPos(e);
            resizeOffset.x = pos.x - element.offsetWidth;
            resizeOffset.y = pos.y - element.offsetHeight;
            e.preventDefault();
            e.stopPropagation();
        }

        // Mouse move
        document.onmousemove = (e) => {
            if (isDragging) {
                handleDrag(e);
            } else if (isResizing) {
                handleResize(e);
            }
        };

        // Touch move
        document.ontouchmove = (e) => {
            if (isDragging) {
                handleDrag(e);
            } else if (isResizing) {
                handleResize(e);
            }
        };

        function handleDrag(e) {
            const pos = getEventPos(e);
            const newX = pos.x - dragOffset.x;
            const newY = pos.y - dragOffset.y;


            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
            element.style.right = 'auto';
        }

        function handleResize(e) {
            const pos = getEventPos(e);
            const newWidth = pos.x - resizeOffset.x;
            const newHeight = pos.y - resizeOffset.y;

            // Set minimum and maximum sizes
            const minWidth = 300;
            const minHeight = 200;
            const maxWidth = window.innerWidth - element.offsetLeft;
            const maxHeight = window.innerHeight - element.offsetTop;

            element.style.width = Math.max(minWidth, Math.min(newWidth, maxWidth)) + 'px';
            element.style.height = Math.max(minHeight, Math.min(newHeight, maxHeight)) + 'px';
        }

        // Mouse up
        document.onmouseup = () => {
            endDrag();
        };

        // Touch end
        document.ontouchend = () => {
            endDrag();
        };

        function endDrag() {
            isDragging = false;
            isResizing = false;
            element.style.cursor = 'default';
        }
    }

    function updateMarketEstimate(inputElem, marketCostDiv, actionName, marketJson, goldSvg) {
        const skillTitleElem = document.querySelector("h1.GatheringProductionSkillPanel_title__3VihQ");
        const skillName = skillTitleElem?.textContent?.trim();
        const useRangeInstead = ["Milking", "Foraging", "Woodcutting"].includes(skillName);

        if (inputElem.value === "∞") {
            marketCostDiv.innerHTML = `Estimated sell value: 0${goldSvg}`;
            return;
        }

        if (!useRangeInstead) {
            const amount = parseInt(
                inputElem.value.toLowerCase().replaceAll("k", "000").replaceAll("m", "000000")
            ) || 0;

            const hrid = getItemHrid(actionName);
            const unitPrice = getItemMarketPrice(hrid, marketJson);
            const total = unitPrice * amount;

            marketCostDiv.innerHTML = `Estimated sell value: ${formatCompactNumber(total)}${goldSvg}`;
            return;
        }
        const dropTable = document.querySelector(".cloned-output") ? document.querySelector(".cloned-output").parentElement : null;
        if (!dropTable) {
            marketCostDiv.innerHTML = `Estimated sell value: ?${goldSvg}`
            return;
        }

        const itemDivs = dropTable.querySelectorAll(".Item_name__2C42x");
        let htmlLines = [];

        itemDivs.forEach(itemDiv => {
            const itemName = itemDiv.textContent.trim();
            const hrid = getItemHrid(itemName);
            const price = getItemMarketPrice(hrid, marketJson) || 0;

            // Look for nearest .cloned-output
            let clonedOutput = null;
            let current = itemDiv.parentElement;

            clonedOutput = current.parentElement.parentElement.parentElement.nextElementSibling;

            if (!clonedOutput) return;

            const raw = clonedOutput.textContent.trim();
            const rangeMatch = raw.match(/([\d.]+)\s*-\s*([\d.]+)/);
            const approxMatch = raw.match(/Roughly\s+([\d.]+)/i);

            let min = 0, max = 0, avg = 0;

            if (rangeMatch) {
                min = parseFloat(rangeMatch[1]);
                max = parseFloat(rangeMatch[2]);
                avg = (min + max) / 2;
            } else if (approxMatch) {
                min = max = avg = parseFloat(approxMatch[1]);
            } else {
                return;
            }

            const minTotal = min * price;
            const maxTotal = max * price;
            const avgTotal = avg * price;

            htmlLines.push(`
                <div style="margin-bottom: 4px;">
                    <b style="color:rgb(200, 0, 255);">${itemName}</b><br/>
                    Min: ${formatCompactNumber(minTotal)}${goldSvg} |
                    Max: ${formatCompactNumber(maxTotal)}${goldSvg} |
                    Avg: ${formatCompactNumber(avgTotal)}${goldSvg}
                </div>
            `);
        });

        marketCostDiv.innerHTML = htmlLines.length > 0
            ? htmlLines.join("")
            : `Estimated sell value: ?${goldSvg}`;
    }

    function formatCompactNumber(num) {
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "b";
        if (num >= 1_000_000)     return (num / 1_000_000).toFixed(2) + "m";
        if (num >= 1_000)         return (num / 1_000).toFixed(2) + "k";
        return num.toString();
    }
    // Modified handleActionPanel function
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
        globalActionName = actionName;
        const panelParent = panel.parentElement;

        if (panelParent) {

            const overlayButtonDiv = document.createElement("div");
            overlayButtonDiv.id = "overlay-circle-button";
            overlayButtonDiv.classList.add("circle-glow");
            overlayButtonDiv.innerHTML = `
            <svg class="overlay-icon-svg" viewBox="0 0 64 64">
                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#FFD700"/>
                    <stop offset="100%" stop-color="#00FFFF"/>
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur"/>
                    <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                    </filter>
                </defs>

                <!-- Bottom -->
                <polygon points="32,34 56,46 32,58 8,46"
                        stroke="url(#grad)" stroke-width="2" fill="none" filter="url(#glow)" />
                <!-- Middle -->
                <polygon points="32,20 56,32 32,44 8,32"
                        stroke="url(#grad)" stroke-width="2" fill="none" filter="url(#glow)" />
                <!-- Top -->
                <polygon points="32,6 56,18 32,30 8,18"
                        stroke="url(#grad)" stroke-width="2" fill="none" filter="url(#glow)" />
                </svg>
            `;
            overlayButtonDiv.title = "Open Action Tools Overlay or reset position";
            overlayButtonDiv.addEventListener("click", function () {
                // Create or update the overlay
                if (document.getElementById('actionToolsOverlay')) {
                    const existingOverlay = document.getElementById('actionToolsOverlay');
                    existingOverlay.style.top = `50%`;
                    existingOverlay.style.left = `50%`;
                } else {
                    handleActionPanel(panel);
                    return;
                }
            });

            panelParent.appendChild(overlayButtonDiv);

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

        // Create draggable overlay
        const overlayContent = createDraggableOverlay(actionName);

        // 显示总时间 - now in overlay
        let hTMLStr = `<div id="showTotalTime" style="
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(30, 30, 60, 0.9));
            border: 1px solid rgba(78, 205, 196, 0.3);
            border-left: 4px solid #4ECDC4;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(5px);
            color: #4ECDC4;
            text-shadow: 0 0 6px rgba(78, 205, 196, 0.6);
            font-weight: 600;
            font-size: 14px;
        ">${getTotalTimeStr(inputElem.value, duration, effBuff)}</div>`;

        overlayContent.insertAdjacentHTML("beforeend", hTMLStr);

        const goldSvg = `<svg role="img" aria-label="Coins" class="Icon_icon__2LtL_ Icon_xtiny__331pI Icon_inline__1Idwv" width="100%" height="100%" style="margin: 1px 2px;"><use href="/static/media/items_sprite.6d12eb9d.svg#coin"></use></svg>`;

        let marketCostHTML = `<div id="marketCost" style="
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(30, 30, 60, 0.9));
            border: 1px solid rgba(36, 227, 90, 0.3);
            border-left: 4px solid rgb(78, 205, 108);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(5px);
            color:rgb(0, 255, 42);
            text-shadow: 0 0 6px rgba(78, 205, 196, 0.6);
            font-weight: 600;
            font-size: 14px;
        ">Estimated sell value: 0${goldSvg}</div>`;

        overlayContent.insertAdjacentHTML("beforeend", marketCostHTML);

        const showTotalTimeDiv = overlayContent.querySelector("div#showTotalTime");
        const marketCostDiv = overlayContent.querySelector("div#marketCost");
        // Event listeners for updating time
        panel.addEventListener("click", function () {
            setTimeout(() => {
                if (showTotalTimeDiv) {
                    showTotalTimeDiv.textContent = getTotalTimeStr(inputElem.value, duration, effBuff);
                    updateMarketEstimate(inputElem, marketCostDiv, actionName, marketJson, goldSvg);
                }
            }, 50);
        });

        inputElem.addEventListener("keyup", function () {
            if (inputElem.value.toLowerCase().includes("k") || inputElem.value.toLowerCase().includes("m")) {
                reactInputTriggerHack(inputElem, inputElem.value.toLowerCase().replaceAll("k", "000").replaceAll("m", "000000"));
            }
            if (showTotalTimeDiv) {
                showTotalTimeDiv.textContent = getTotalTimeStr(inputElem.value, duration, effBuff);
                updateMarketEstimate(inputElem, marketCostDiv, actionName, marketJson, goldSvg);
            }
            showRequiredItems(panel, inputElem.value);
            showOutputAmounts(panel, inputElem.value);
        });

        // Listen for all buttons and inputs in the overlay
        overlayContent.addEventListener("click", function (evt) {
            if (evt.target.matches("button, input[type='button'], select, div")) {
                setTimeout(() => {
                    if (showTotalTimeDiv) {
                        showTotalTimeDiv.textContent = getTotalTimeStr(inputElem.value, duration, effBuff);
                        updateMarketEstimate(inputElem, marketCostDiv, actionName, marketJson, goldSvg);
                    }
                    showRequiredItems(panel, inputElem.value);
                    showOutputAmounts(panel, inputElem.value);
                }, 50);
            }
        });

        overlayContent.addEventListener("input", function (evt) {
            if (evt.target.matches("input, select")) {
                setTimeout(() => {
                    if (showTotalTimeDiv) {
                        showTotalTimeDiv.textContent = getTotalTimeStr(inputElem.value, duration, effBuff);
                        updateMarketEstimate(inputElem, marketCostDiv, actionName, marketJson, goldSvg);
                    }
                    showRequiredItems(panel, inputElem.value);
                    showOutputAmounts(panel, inputElem.value);
                }, 50);
            }
        });
        // 显示快捷按钮 - now in overlay
        if (settingsMap.actionPanel_totalTime_quickInputs.isTrue) {
            const isZHText = isZH ? "做 " : "Do ";
            const quickInputDivHTML = `<div id="quickInputButtons" style="
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(30, 30, 60, 0.9));
                border: 1px solid rgba(138, 43, 226, 0.3);
                border-left: 4px solid #8A2BE2;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 12px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(5px);
                color: #E6E6FA;
                text-shadow: 0 0 4px rgba(138, 43, 226, 0.6);
                font-weight: 500;
                font-size: 12px;
                line-height: 1.4;
                text-align: left;
            "></div>`;

            overlayContent.insertAdjacentHTML("beforeend", quickInputDivHTML);
            const quickInputButtonsDiv = overlayContent.querySelector("div#quickInputButtons");

            // Add all the quick input content (same as before)
            quickInputButtonsDiv.append(document.createTextNode(isZH ? "~~~ 小时预设 ~~~" : "~~~ Hours Presets ~~~"));
            quickInputButtonsDiv.appendChild(document.createElement("br"));
            quickInputButtonsDiv.appendChild(document.createTextNode(isZHText));
            // quickInputButtonsDiv.appendChild(createHourSelect(inputElem, panel, effBuff, duration));
            quickInputButtonsDiv.appendChild(createTimeInput(inputElem, panel, effBuff, duration));
            // quickInputButtonsDiv.appendChild(createCustomHourInput(inputElem, panel, effBuff, duration));

            // Continue with all the other quick input sections...
            quickInputButtonsDiv.appendChild(document.createElement("br"));
            quickInputButtonsDiv.append(document.createTextNode(isZH ? "~~~ 采集预设 ~~~" : "~~~ Gather Presets ~~~"));
            quickInputButtonsDiv.appendChild(document.createElement("br"));
            quickInputButtonsDiv.append(document.createTextNode(isZHText));
            quickInputButtonsDiv.appendChild(createTimesSelect(inputElem, panel));
            quickInputButtonsDiv.append(document.createTextNode(isZH ? " 次" : " Times or Max "));
            quickInputButtonsDiv.appendChild(document.createElement("br"));

            const invs = panel.querySelectorAll("span.SkillActionDetail_inventoryCount__tHmPD");
            if (invs.length > 0) {
                addMaxLButton(quickInputButtonsDiv, panel, inputElem);
                addMaxHButton(quickInputButtonsDiv, panel, inputElem);
            }
            addGatherMax(quickInputButtonsDiv, panel, inputElem, actionName, effBuff, duration, exp);

            quickInputButtonsDiv.appendChild(document.createElement("br"));
            quickInputButtonsDiv.append(document.createTextNode(isZH ? "~~~ 经验值转采集次数 ~~~" : "~~~ EXP to Gather amount convert ~~~"));
            quickInputButtonsDiv.appendChild(document.createElement("br"));
            quickInputButtonsDiv.append(document.createTextNode(isZHText));
            quickInputButtonsDiv.appendChild(createCustomExpInput(inputElem, panel, effBuff, duration, exp));
        }

        // Level calculation section - now in overlay
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
                    const extraLevelEffBuff = (level - currentLevel) * 0.01;
                    const needNumOfActionsToNextLevel = Math.round(needExpToNextLevel / exp);
                    needTotalNumOfActions += needNumOfActionsToNextLevel;
                    needTotalTimeSec += (needNumOfActionsToNextLevel / (effBuff + extraLevelEffBuff)) * duration;
                }
                return { numOfActions: needTotalNumOfActions, timeSec: needTotalTimeSec };
            };

            const need = calculateNeedToLevel(currentLevel, currentLevel + 1, effBuff, duration, exp);
            hTMLStr = `<div id="tillLevel" style="
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(30, 30, 60, 0.9));
                border: 1px solid rgba(255, 215, 0, 0.3);
                border-left: 4px solid #FFD700;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 12px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(5px);
                color: #FFD700;
                text-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
                font-weight: 600;
                font-size: 14px;
                text-align: left;
                z-index: 999;
            ">${
                isZH ? "到 " : "To reach level "
            }<input id="tillLevelInput" type="number" value="${currentLevel + 1}" min="${currentLevel + 1}" max="200">${
                isZH ? " 级还需做 " : ", need to do "}
                <span id="tillLevelNumber"><span id="tillLevelNumberInnerSpan"style="
                    color: #4ECDC4;
                    text-shadow: 0 0 6px rgba(78, 205, 196, 0.6);
                    font-weight: 600;
                    font-size: 14px;
                " >${need.numOfActions}</span>
                ${isZH ? " 次" : " times "}<br><span id=tillLevelTimeInnerSpan style="
                    color: #4ECDC4;
                    text-shadow: 0 0 6px rgba(78, 205, 196, 0.6);
                    font-weight: 600;
                    font-size: 14px;
                ">[${timeReadable(need.timeSec)}]</span><br>${
                isZH ? " (刷新网页更新当前等级)" : " (Refresh page to update current level)"
            }</span></div>`;

            overlayContent.insertAdjacentHTML("beforeend", hTMLStr);

            // Style the input and add event listeners (same as before)
            const tillLevelInput = overlayContent.querySelector("input#tillLevelInput");
            if (tillLevelInput) {
                tillLevelInput.style.cssText = `
                    background: linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(45, 45, 45, 0.9));
                    color: #FFD700;
                    border: 1px solid rgba(255, 215, 0, 0.4);
                    padding: 4px 6px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    outline: none;
                    margin: 0 4px;
                    width: 60px;
                    transition: all 0.3s ease;
                    text-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(2px);
                `;

                tillLevelInput.onfocus = () => {
                    tillLevelInput.style.borderColor = "rgba(255, 215, 0, 0.8)";
                    tillLevelInput.style.boxShadow = "0 0 8px rgba(255, 215, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)";
                };

                tillLevelInput.onblur = () => {
                    tillLevelInput.style.borderColor = "rgba(255, 215, 0, 0.4)";
                    tillLevelInput.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
                };
            }

            const tillLevelNumber = overlayContent.querySelector("div#tillLevel");
            const maxGather = document.getElementById("maxForGather");

            tillLevelInput.onchange = () => {
                const targetLevel = Number(tillLevelInput.value);
                if (targetLevel > currentLevel && targetLevel <= 200) {
                    const need = calculateNeedToLevel(currentLevel, targetLevel, effBuff, duration, exp);
                    tillLevelNumber.querySelector("span#tillLevelNumberInnerSpan").textContent = need.numOfActions;
                    tillLevelNumber.querySelector("span#tillLevelTimeInnerSpan").textContent = timeReadable(need.timeSec);
                    if (maxGather) maxGather.innerText = need.numOfActions;

                    reactInputTriggerHack(inputElem, parseInt(need.numOfActions));
                    showRequiredItems(panel, parseInt(need.numOfActions));
                    showOutputEXP(panel, parseInt(need.numOfActions));
                    showOutputAmounts(panel, parseInt(need.numOfActions));
                } else {
                    tillLevelNumber.querySelector("span#tillLevelNumberInnerSpan").textContent = "Error";
                }
            };

            tillLevelInput.addEventListener("keyup", function () {
                const targetLevel = Number(tillLevelInput.value);
                if (targetLevel > currentLevel && targetLevel <= 200) {
                    const need = calculateNeedToLevel(currentLevel, targetLevel, effBuff, duration, exp);
                    tillLevelNumber.querySelector("span#tillLevelNumberInnerSpan").textContent = need.numOfActions;
                    tillLevelNumber.querySelector("span#tillLevelTimeInnerSpan").textContent = timeReadable(need.timeSec);
                    if (maxGather) maxGather.innerText = need.numOfActions;

                    reactInputTriggerHack(inputElem, parseInt(need.numOfActions));
                    showRequiredItems(panel, parseInt(need.numOfActions));
                    showOutputEXP(panel, parseInt(need.numOfActions));
                    showOutputAmounts(panel, parseInt(need.numOfActions));
                } else {
                    tillLevelNumber.querySelector("span#tillLevelNumberInnerSpan").textContent = "Error";
                }
            });
        }

        // Exp per hour - now in overlay
        overlayContent.insertAdjacentHTML("beforeend", `<div id="expPerHour" style="
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(30, 30, 60, 0.9));
            border: 1px solid rgba(152, 216, 200, 0.3);
            border-left: 4px solid #98D8C8;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(5px);
            color: #98D8C8;
            text-shadow: 0 0 6px rgba(152, 216, 200, 0.6);
            font-weight: 600;
            font-size: 14px;
            text-align: left;
        ">${isZH ? "每小时经验: " : "Exp/hour: "}${numberFormatter(
            Math.round((3600 / duration) * exp * effBuff)
        )} (+${Number((effBuff - 1) * 100).toFixed(1)}%${isZH ? "效率" : " eff"})</div>`);

        // Keep the foraging profit calculation in the original panel if needed
        // [Foraging profit calculation code remains the same as original...]
    }

    function createHourSelect(inputElem, panel, effBuff, duration) {
        const presetHours = [0.5, 1, 2, 3, 4, 5, 6, 10, 12, 24];

        const useDropdown = settingsMap?.actionPanelStyle?.isTrue;
        const customElement = document.createElement("div");
        customElement.style.cssText = `position: relative; display: inline-block;`;

        const button = document.createElement("button");
        button.textContent = `${presetHours[0] === 0.5 ? 0.5 : numberFormatter(presetHours[0])} ${isZH ? "次" : "Hours"}`;
        button.style.cssText = `
            background: linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(45, 45, 45, 0.9));
            color: #FFD700;
            border: 1px solid rgba(255, 215, 0, 0.4);
            padding: 6px 8px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            text-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(2px);
            min-width: 100px;
            text-align: left;
            transition: all 0.3s ease;
        `;

        if (useDropdown) {
            const dropdownList = document.createElement("div");
            dropdownList.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(35, 35, 55, 0.95));
                border: 1px solid rgba(255, 215, 0, 0.4);
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(8px);
                z-index: 99999;
                display: none;
                max-height: 100px;
                overflow-y: auto;
            `;

            for (const value of presetHours) {
                const option = document.createElement("div");
                option.textContent = `${value === 0.5 ? 0.5 : numberFormatter(value)} ${isZH ? "次" : "Hours"}`;
                option.dataset.value = value;
                option.style.cssText = `
                    padding: 8px 12px;
                    color: #FFD700;
                    font-weight: 600;
                    font-size: 12px;
                    text-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-bottom: 1px solid rgba(255, 215, 0, 0.1);
                `;

                option.addEventListener('mouseover', () => {
                    option.style.background = 'rgba(255, 215, 0, 0.2)';
                    option.style.color = '#FFFFFF';
                });

                option.addEventListener('mouseout', () => {
                    option.style.background = 'transparent';
                    option.style.color = '#FFD700';
                });

                option.addEventListener('click', () => {
                    button.textContent = option.textContent;
                    dropdownList.style.display = 'none';
                    const hours = parseFloat(option.dataset.value);
                    const count = Math.round((hours * 3600 * effBuff) / duration);
                    updatePanelValues(inputElem, panel, count);
                });

                dropdownList.appendChild(option);
            }

            button.addEventListener('click', () => {

                const hours = parseFloat(button.textContent.split(" ")[0]);

                dropdownList.style.display = dropdownList.style.display === 'none' ? 'block' : 'none';
                const count = Math.round((hours * 3600 * effBuff) / duration);
                updatePanelValues(inputElem, panel, count);
            });

            document.addEventListener('click', (e) => {
                if (!customElement.contains(e.target)) dropdownList.style.display = 'none';
            });

            customElement.appendChild(button);
            customElement.appendChild(dropdownList);
        } else {
            // BUTTONS mode
            for (const value of presetHours) {
                const button = document.createElement("button");
                button.textContent = `${numberFormatter(value)} ${isZH ? "次" : "Hours"}`;
                button.style.cssText = buttonStyle();

                button.addEventListener('click', () => {
                    const count = Math.round((value * 3600 * effBuff) / duration);
                    updatePanelValues(inputElem, panel, count);
                });

                customElement.appendChild(button);
            }
        }

        return customElement;
    }
    function createCustomHourInput(inputElem, panel, effBuff, duration) {
        const container = document.createElement("span");

        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.placeholder = isZH ? "自定义" : "Custom";

        styleDarkThemeInput(input);

        const btn = document.createElement("button");
        btn.innerText = isZH ? "小时" : "Hours";

        styleDarkThemeButton(btn);
        btn.onclick = () => {
            const value = parseFloat(input.value);
            if (!isNaN(value) && value > 0) {
                const ticks = Math.round((value * 3600 * effBuff) / duration);
                updatePanelValues(inputElem, panel, ticks);
            }
        };

        container.appendChild(input);
        container.appendChild(btn);
        return container;
    }
    function createTimesSelect(inputElem, panel) {
        const presetTimes = [10, 100, 300, 500, 1000, 2000];

        const useDropdown = settingsMap?.actionPanelStyle?.isTrue;
        const customElement = document.createElement("div");
        customElement.style.cssText = `position: relative; display: inline-block;`;

        const button = document.createElement("button");
        button.textContent = `${numberFormatter(presetTimes[0])} ${isZH ? "次" : "Times"}`;
        button.style.cssText = `
            background: linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(45, 45, 45, 0.9));
            color: #FFD700;
            border: 1px solid rgba(255, 215, 0, 0.4);
            padding: 6px 8px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            text-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(2px);
            min-width: 100px;
            text-align: left;
            transition: all 0.3s ease;
        `;

        if (useDropdown) {
            const dropdownList = document.createElement("div");
            dropdownList.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(35, 35, 55, 0.95));
                border: 1px solid rgba(255, 215, 0, 0.4);
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(8px);
                z-index: 99999;
                display: none;
                max-height: 100px;
                overflow-y: auto;
            `;

            for (const value of presetTimes) {
                const option = document.createElement("div");
                option.textContent = `${numberFormatter(value)} ${isZH ? "次" : "Times"}`;
                option.dataset.value = value;
                option.style.cssText = `
                    padding: 8px 12px;
                    color: #FFD700;
                    font-weight: 600;
                    font-size: 12px;
                    text-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-bottom: 1px solid rgba(255, 215, 0, 0.1);
                `;

                option.addEventListener('mouseover', () => {
                    option.style.background = 'rgba(255, 215, 0, 0.2)';
                    option.style.color = '#FFFFFF';
                });

                option.addEventListener('mouseout', () => {
                    option.style.background = 'transparent';
                    option.style.color = '#FFD700';
                });

                option.addEventListener('click', () => {
                    button.textContent = option.textContent;
                    dropdownList.style.display = 'none';
                    const selectedValue = parseInt(option.dataset.value);
                    updatePanelValues(inputElem, panel, selectedValue);
                });

                dropdownList.appendChild(option);
            }

            button.addEventListener('click', () => {
                dropdownList.style.display = dropdownList.style.display === 'none' ? 'block' : 'none';

                const times = parseFloat(button.textContent.split(" ")[0]);

                updatePanelValues(inputElem, panel, parseInt(times));
            });

            document.addEventListener('click', (e) => {
                if (!customElement.contains(e.target)) dropdownList.style.display = 'none';
            });

            customElement.appendChild(button);
            customElement.appendChild(dropdownList);
        } else {
            for (const value of presetTimes) {
                const button = document.createElement("button");
                button.textContent = `${numberFormatter(value)} ${isZH ? "次" : "Times"}`;
                button.style.cssText = buttonStyle();

                button.addEventListener('click', () => {
                    updatePanelValues(inputElem, panel, value);
                });

                customElement.appendChild(button);
            }
        }

        return customElement;
    }
    function createTimeInput(inputElem, panel, effBuff, duration) {
        const useDropdown = settingsMap?.actionPanelStyle?.isTrue;
        if (useDropdown) {
            const customElement = document.createElement("div");
            customElement.style.cssText = `position: relative; display: inline-block;`;
            const container = document.createElement("span");

            const input = document.createElement("input");
            input.type = "number";
            input.min = "0";
            input.placeholder = isZH ? "数量" : "Value";
            styleDarkThemeInput(input);

            input.addEventListener("keyup", function () {
                const value = parseFloat(input.value);
                const unit = select.value;
                if (isNaN(value) || value <= 0) return;

                const secondsPerUnit = {
                    minutes: 60,
                    hours: 3600,
                    days: 86400,
                    weeks: 604800,
                    years: 31536000
                };

                const totalSeconds = value * secondsPerUnit[unit];
                const ticks = Math.round((totalSeconds * effBuff) / duration);
                updatePanelValues(inputElem, panel, ticks);
            });
            const timesPreset = ["minutes", "hours", "days", "weeks", "years"];

            const select = document.createElement("select");

            timesPreset.forEach(unit => {
                const opt = document.createElement("option");
                opt.value = unit;
                opt.textContent = unit;
                select.appendChild(opt);
            });

            styleDarkThemeSelect(select);

            select.onclick = () => {
                const value = parseFloat(input.value);
                const unit = select.value;
                if (isNaN(value) || value <= 0) return;

                const secondsPerUnit = {
                    minutes: 60,
                    hours: 3600,
                    days: 86400,
                    weeks: 604800,
                    years: 31536000
                };

                const totalSeconds = value * secondsPerUnit[unit];
                const ticks = Math.round((totalSeconds * effBuff) / duration);
                updatePanelValues(inputElem, panel, ticks);
            };
            container.appendChild(input);
            container.appendChild(select);
            container.appendChild(customElement);
            return container;
        } else {
            const customElement = document.createElement("div");
            customElement.style.cssText = `position: relative; display: inline-block;`;

            const presetHours = [0.5, 1, 2, 3, 4, 5, 6, 10, 12, 24];

            // BUTTONS mode
            for (const value of presetHours) {
                const button = document.createElement("button");
                button.textContent = `${numberFormatter(value)} ${isZH ? "次" : "Hours"}`;
                button.style.cssText = buttonStyle();

                button.addEventListener('click', () => {
                    const count = Math.round((value * 3600 * effBuff) / duration);
                    updatePanelValues(inputElem, panel, count);
                });

                customElement.appendChild(button);
            }
            return customElement;
        }
    }
    function createCustomExpInput(inputElem, panel, effBuff, duration, expPerAction) {
        const container = document.createElement("span");

        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.placeholder = isZH ? "经验值" : "EXP Amount";

        styleDarkThemeInput(input);

        const btn = document.createElement("button");
        btn.innerText = isZH ? "换算" : "Convert";
        styleDarkThemeButton(btn);
        btn.onclick = () => {
            const value = parseFloat(input.value);
            if (!isNaN(value) && value > 0) {
                const actionsNeeded = Math.ceil(value / expPerAction);
                updatePanelValues(inputElem, panel, actionsNeeded);
            }
        };

        container.appendChild(input);
        container.appendChild(btn);
        return container;
    }
    function buttonStyle() {
        return `
        background: linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(45, 45, 45, 0.9));
        color: #FFD700;
        border: 1px solid rgba(255, 215, 0, 0.4);
        padding: 6px 8px;
        margin: 2px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 12px;
        cursor: pointer;
        text-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
        transition: all 0.3s ease;
    `;
    }
    function styleDarkThemeSelect(select) {
        select.style.cssText = `
            background: linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(45, 45, 45, 0.9));
            color: #FFD700;
            border: 1px solid rgba(255, 215, 0, 0.4);
            padding: 6px 8px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            margin: 2px;
            max-width: 80px;
            transition: all 0.3s ease;
            text-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(2px);
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
        `;

        select.onmouseover = () => {
            select.style.borderColor = "rgba(255, 215, 0, 0.6)";
            select.style.boxShadow = "0 0 8px rgba(255, 215, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)";
        };

        select.onmouseout = () => {
            select.style.borderColor = "rgba(255, 215, 0, 0.4)";
            select.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
        };

        select.onfocus = () => {
            select.style.borderColor = "rgba(255, 215, 0, 0.8)";
            select.style.boxShadow = "0 0 8px rgba(255, 215, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)";
        };

        return select;
    }

    function styleDarkThemeInput(input) {
        input.style.cssText = `
        background: linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(45, 45, 45, 0.9));
        color: #FFD700;
        border: 1px solid rgba(255, 215, 0, 0.4);
        padding: 6px 8px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 12px;
        cursor: pointer;
        margin: 2px;
        max-width: 100px;
        transition: all 0.3s ease;
        text-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
    `;

        input.onmouseover = () => {
            input.style.borderColor = "rgba(255, 215, 0, 0.6)";
            input.style.boxShadow = "0 0 8px rgba(255, 215, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)";
        };

        input.onmouseout = () => {
            input.style.borderColor = "rgba(255, 215, 0, 0.4)";
            input.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
        };

        input.onfocus = () => {
            input.style.borderColor = "rgba(255, 215, 0, 0.8)";
            input.style.boxShadow = "0 0 8px rgba(255, 215, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)";
        };

        return input;
    }

    function styleDarkThemeButton(btn) {
        btn.style.cssText = `
        background: linear-gradient(135deg, rgba(106, 13, 173, 0.8), rgba(65, 105, 225, 0.8));
        color: white;
        border: 1px solid rgba(106, 13, 173, 0.4);
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 4px;
        margin-left: 4px;
        transition: all 0.3s ease;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
    `;

        btn.onmouseover = () => {
            btn.style.transform = "translateY(-1px)";
            btn.style.boxShadow = "0 4px 8px rgba(106, 13, 173, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)";
            btn.style.borderColor = "rgba(106, 13, 173, 0.6)";
        };

        btn.onmouseout = () => {
            btn.style.transform = "translateY(0)";
            btn.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
            btn.style.borderColor = "rgba(106, 13, 173, 0.4)";
        };

        btn.onmousedown = () => {
            btn.style.transform = "translateY(0)";
            btn.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.4)";
        };

        btn.onmouseup = () => {
            btn.style.transform = "translateY(-1px)";
            btn.style.boxShadow = "0 4px 8px rgba(106, 13, 173, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)";
        };

        return btn;
    }

    function updatePanelValues(inputElem, panel, value) {
        reactInputTriggerHack(inputElem, value);
        showRequiredItems(panel, value);
        showOutputEXP(panel, value);
        showOutputAmounts(panel, value);

        const marketCostDiv = document.querySelector("div#marketCost");

        const goldSvg = `<svg role="img" aria-label="Coins" class="Icon_icon__2LtL_ Icon_xtiny__331pI Icon_inline__1Idwv" width="100%" height="100%" style="margin: 1px 2px;"><use href="/static/media/items_sprite.6d12eb9d.svg#coin"></use></svg>`;

        const actionName = panel.querySelector("div.SkillActionDetail_name__3erHV").textContent;

        updateMarketEstimate(inputElem, marketCostDiv, actionName, marketJson, goldSvg);
    }


    function getTotalEffiPercentage(actionHrid, debug = false) {
        if (debug) {
            logger("----- getTotalEffiPercentage " + actionHrid, EXTENDED_SCRIPT_COLORS.brightBlue);
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
        return timeReadable(Math.round(input / effBuff) * duration);
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
                const actionName = insertParent.children[0].textContent;
                insertParent.insertBefore(span, insertParent.children[1]);

                if (settingsMap.showExpDisplay.isTrue) {
                    const expL = expLeft(actionName);
                    const insertParent2 = element.parentNode;
                    const span2 = document.createElement("span");
                    const xpText = isZH ? `${expL} 剩余经验` : `${expL} XP left`;

                    span2.textContent = xpText;
                    span2.classList.add("insertedSpan");
                    span2.style.cssText = `
                        font-size: 11px;
                        color: #FFFFFF;
                        display: block;
                        margin-top: -8px;
                        text-align: center;
                        width: 100%;
                        font-weight: 600;
                        text-shadow:
                            0 0 4px rgba(0, 0, 0, 1),
                            0 0 8px rgba(0, 0, 0, 1),
                            2px 2px 0 rgba(0, 0, 0, 1),
                            -2px -2px 0 rgba(0, 0, 0, 1),
                            2px -2px 0 rgba(0, 0, 0, 1),
                            -2px 2px 0 rgba(0, 0, 0, 1),
                            0 0 12px rgba(138, 43, 226, 0.8);
                        font-family: 'Arial', sans-serif;
                        background: linear-gradient(90deg,
                            transparent,
                            rgba(75, 0, 130, 0.18),
                            transparent);
                        padding: 1px 0;
                        letter-spacing: 0.3px;
                    `;

                    insertParent2.insertBefore(span2, insertParent2.children[1]);
                }
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
            logger("handleBattleSummary null marketAPI");
            hasMarketJson = false;
        }
        let totalPriceAsk = 0;
        let totalPriceAskBid = 0;
        let totalRawCoins = 0; // For IC

        if (hasMarketJson) {
            for (const loot of Object.values(message.unit.totalLootMap)) {
                const itemCount = loot.count;
                if (loot.itemHrid === "/items/coin") {
                    totalRawCoins += itemCount;
                }
                if (marketJson.marketData[loot.itemHrid]) {
                    totalPriceAsk += marketJson.marketData[loot.itemHrid][0].a * itemCount;
                    totalPriceAskBid += marketJson.marketData[loot.itemHrid][0].b * itemCount;
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
                    logger("handleBattleSummary unable to display average exp due to null battleDurationSec");
                }
            } else if (tryTimes <= 10) {
                setTimeout(findElem, 200);
            } else {
                logger("handleBattleSummary: Elem not found after 10 tries.");
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
                    div.style.position = "relative";
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
                    div.style.position = "relative";
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
                map.set("/items/pirate_entry_key", isZH ? "牢4" : "D4");

                map.set("/items/chimerical_chest_key", "3.4.5.6");
                map.set("/items/sinister_chest_key", "5.7.8.10");
                map.set("/items/enchanted_chest_key", "7.8.9.11");
                map.set("/items/pirate_chest_key", "6.9.10.11");

                if (!div.querySelector("div.script_key")) {
                    div.style.position = "relative";
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
            logger("start observe item dict", EXTENDED_SCRIPT_COLORS.cyan);
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

    async function handleItemDict(panel) {
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

        const marketAPIJson = await fetchMarketJSON();
        const ask = marketAPIJson.marketData[itemHrid][0].a || 0;
        const bid = marketAPIJson.marketData[itemHrid][0].b || 0;

        let hTMLStr = `<div id="tillLevel" style="color: ${SCRIPT_COLOR_MAIN}; text-align: left;">${
            isZH ? "到 " : "To "
        }<input id="tillLevelInput" type="number" value="${currentLevel + 1}" min="${currentLevel + 1}" max="200">${
            isZH ? " 级还需 " : " level need "
        }
        <span id="tillLevelNumber">${numBooks} (${numberFormatter(numBooks * ask)} / ${numberFormatter(numBooks * bid)})</span>
        <div>${isZH ? " 本书 (刷新网页更新当前等级)" : " books (Refresh page to update current level.)"}</div>
        </div>`;
        panel.insertAdjacentHTML("beforeend", hTMLStr);

        const tillLevelInput = panel.querySelector("input#tillLevelInput");
        if (tillLevelInput) {
            tillLevelInput.style.cssText = `
        background: linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(45, 45, 45, 0.9));
        color: #FFD700;
        border: 1px solid rgba(255, 215, 0, 0.4);
        padding: 4px 6px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        outline: none;
        margin: 0 4px;
        width: 60px;
        transition: all 0.3s ease;
        text-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
    `;

            tillLevelInput.onfocus = () => {
                tillLevelInput.style.borderColor = "rgba(255, 215, 0, 0.8)";
                tillLevelInput.style.boxShadow = "0 0 8px rgba(255, 215, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)";
            };

            tillLevelInput.onblur = () => {
                tillLevelInput.style.borderColor = "rgba(255, 215, 0, 0.4)";
                tillLevelInput.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
            };
        }
        const tillLevelNumber = panel.querySelector("span#tillLevelNumber");
        tillLevelInput.onchange = () => {
            const targetLevel = Number(tillLevelInput.value);

            if (targetLevel > currentLevel && targetLevel <= 200) {
                let numBooks = getNeedBooksToLevel(currentLevel, currentExp, targetLevel, abilityPerBookExp);
                tillLevelNumber.textContent = `${numBooks} (${numberFormatter(numBooks * ask)} / ${numberFormatter(numBooks * bid)})`;
            } else {
                tillLevelNumber.textContent = "Error";
            }
        };
        tillLevelInput.addEventListener("keyup", function () {
            const targetLevel = Number(tillLevelInput.value);
            if (targetLevel > currentLevel && targetLevel <= 200) {
                let numBooks = getNeedBooksToLevel(currentLevel, currentExp, targetLevel, abilityPerBookExp);
                tillLevelNumber.textContent = `${numBooks} (${numberFormatter(numBooks * ask)} / ${numberFormatter(numBooks * bid)})`;
            } else {
                tillLevelNumber.textContent = "Error";
            }
        });
    }

    function createExternalMarketButton(panel) {
        try {

            const dupedChild = panel.children[2]?.cloneNode(true);
            const clone = document.createElement("button");
            clone.id = "cst-view";
            // clone.innerText = "External Marketplace";
            clone.innerHTML = `Check out Milkyway.Market <span style="margin-left: 6px;">🔗</span>`;
            clone.className = dupedChild.className;
            clone.style.cursor = "pointer";
            attachFloatingTooltip(clone, `
                <strong>Milkyway.market</strong>
                Track. Analyze. Dominate the economy.
                Milkyway.market gives you the tools to thrive.
                `);;
            // Style override
            clone.style.background = "linear-gradient(270deg, #6e00ff, #00c4ff, #6e00ff)";
            clone.style.backgroundSize = "400% 400%";
            // clone.style.animation = "gradientMove 4s ease infinite";
            clone.style.color = "#fff";
            clone.style.fontWeight = "700";
            clone.style.textShadow = "0 0 3px rgba(0,0,0,0.4)";
            clone.style.border = "none";
            clone.style.boxShadow = "0 0 6px rgba(0,0,0,0.4)";
            clone.style.transition = "box-shadow 0.3s";

            // Hover glow
            clone.addEventListener("mouseenter", () => {
                clone.style.boxShadow = "0 0 12px 2px rgba(0, 200, 255, 0.7)";
            });
            clone.addEventListener("mouseleave", () => {
                clone.style.boxShadow = "0 0 6px rgba(0,0,0,0.4)";
            });

            // Add @keyframes and ripple CSS
            const styleTag = document.createElement("style");
            styleTag.textContent = `
                                    @keyframes gradientMove {
                                      0% { background-position: 0% 50%; }
                                      50% { background-position: 100% 50%; }
                                      100% { background-position: 0% 50%; }
                                    }
                                    `;
            document.head.appendChild(styleTag);

            // On click, open external marketplace
            clone.addEventListener("click", () => {
                const url = `https://milkyway.market/`;
                window.open(url, "_blank");
            });

            panel.insertBefore(clone, panel.children[20]);
        } catch (err) {
            logger("⚠️ createExternalMarketButton error: " + err, EXTENDED_SCRIPT_COLORS.brightRed, false, "error");
        }
    }
    const tooltipDiv = document.createElement("div");
    tooltipDiv.className = "floatingTooltip";
    document.body.appendChild(tooltipDiv);

    function attachFloatingTooltip(targetDiv, htmlContent) {
        targetDiv.addEventListener("mouseenter", (e) => {
            tooltipDiv.innerHTML = htmlContent;
            tooltipDiv.style.display = "block";
            positionTooltip(e);
        });

        targetDiv.addEventListener("mousemove", (e) => {
            positionTooltip(e);
        });

        targetDiv.addEventListener("mouseleave", () => {
            tooltipDiv.style.display = "none";
        });
    }

    function positionTooltip(e) {
        const offsetX = 12;
        const offsetY = 12;
        tooltipDiv.style.left = `${e.pageX + offsetX}px`;
        tooltipDiv.style.top = `${e.pageY + offsetY}px`;
    }

    /* 添加第三方网站链接 */
    function add3rdPartyLinks() {
        const waitForNavi = () => {
            const targetNode = document.querySelector("div.NavigationBar_minorNavigationLinks__dbxh7");
            if (targetNode) {

                createExternalMarketButton(targetNode.parentNode);
                let wrapper = document.createElement("div");
                wrapper.className = "externalNavLinkWrapper";

                let div = document.createElement("div");
                div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y externalNavLink");
                div.innerHTML = isZH ? "🛠️ 插件设置" : "🛠️ Script settings";
                div.addEventListener("click", () => {
                    const settingsSpan = Array.from(document.querySelectorAll("span.NavigationBar_label__1uH-y"))
                        .find(span => span.textContent.trim() === "Settings");

                    if (settingsSpan) {
                        const clickableDiv = settingsSpan.closest("div.NavigationBar_navigationLink__3eAHA");
                        if (clickableDiv) {
                            clickableDiv.click();

                            // Step 2: After slight delay, click mwitools-tab-button
                            setTimeout(() => {
                                const toolsTab = document.querySelector("#mwitools-tab-button > span.MuiBadge-root");
                                if (toolsTab) {
                                    toolsTab.click();
                                } else {
                                    console.warn("Tools tab not found!");
                                }
                            }, 300); // 300ms delay — tweak if needed
                        }
                    }

                });

                attachFloatingTooltip(div, `
                <strong>Script Settings</strong>
                Open internal tools tab and access script-specific settings.
                `);

                targetNode.insertAdjacentElement("afterbegin", div);

                if (isZH) {
                    wrapper = document.createElement("div");
                    wrapper.className = "externalNavLinkWrapper";

                    div = document.createElement("div");
                    div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y externalNavLink");
                    div.innerHTML = isZH ? "⚔️ 9战模拟" : "⚔️ 9战模拟";
                    div.addEventListener("click", () => {
                        window.open("https://shykai.github.io/mwisim.github.io/", "_blank");
                    });

                    attachFloatingTooltip(div, `
                    <strong>9战模拟</strong>
                    Quickly test team comps in 9-round battles using Kai’s simulator.
                    `);

                    targetNode.insertAdjacentElement("afterbegin", div);

                    wrapper = document.createElement("div");
                    wrapper.className = "externalNavLinkWrapper";
                    div = document.createElement("div");
                    div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y externalNavLink");
                    div.innerHTML = isZH ? "💰 利润网站 Mooneycalc" : "💰 Profit site Mooneycalc";
                    div.addEventListener("click", () => {
                        window.open("https://mooneycalc.netlify.app/", "_blank");
                    });

                    attachFloatingTooltip(div,  `
                        <strong>Mooneycalc</strong>
                        Profit calculator for items, market flips, and crafting costs.
                      `);
                    targetNode.insertAdjacentElement("afterbegin", div);

                    wrapper = document.createElement("div");
                    wrapper.className = "externalNavLinkWrapper";
                    div = document.createElement("div");
                    div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y externalNavLink");
                    div.innerHTML = isZH ? "🥛 利润网站 Milkonomy" : "🥛 Profit site Milkonomy";
                    div.addEventListener("click", () => {
                        window.open("https://milkonomy.pages.dev/", "_blank");
                    });
                    attachFloatingTooltip(div, `
                    <strong>Milkonomy</strong>
                    Economy visualizer and market analyzer for MWI.
                  `);
                    targetNode.insertAdjacentElement("afterbegin", div);

                    wrapper = document.createElement("div");
                    wrapper.className = "externalNavLinkWrapper";
                    div = document.createElement("div");
                    div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y externalNavLink");
                    div.innerHTML = isZH ? "📖 牛牛手册" : "📖 牛牛手册";
                    div.addEventListener("click", () => {
                        window.open("https://test-ctmd6jnzo6t9.feishu.cn/docx/KG9ddER6Eo2uPoxJFkicsvbEnCe", "_blank");
                    });
                    attachFloatingTooltip(div,  `
                    <strong>牛牛手册</strong>
                    Player-created handbook with guides and resources.
                  `);
                    targetNode.insertAdjacentElement("afterbegin", div);
                }

                wrapper = document.createElement("div");
                wrapper.className = "externalNavLinkWrapper";
                div = document.createElement("div");
                div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y externalNavLink");
                div.innerHTML = isZH ? "✨ 强化模拟 Enhancelator" : "✨ Enhancement sim";
                div.addEventListener("click", () => {
                    window.open("https://doh-nuts.github.io/Enhancelator/", "_blank");
                });
                attachFloatingTooltip(div,  `
                <strong>Enhancelator</strong>
                Simulator to test enhancement success rates and strategies.
              `);
                targetNode.insertAdjacentElement("afterbegin", div);

                wrapper = document.createElement("div");
                wrapper.className = "externalNavLinkWrapper";

                div = document.createElement("div");
                div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y externalNavLink");
                div.innerHTML = isZH ? "🐮 利润计算 Cowculator" : "🐮 Profit calc Cowculator";
                div.addEventListener("click", () => {
                    window.open("https://danthegoodman.github.io/cowculator/", "_blank");
                });
                attachFloatingTooltip(div,  `
                <strong>Cowculator</strong>
                Profit calculator for cow production, feeding, and selling.
              `);
                targetNode.insertAdjacentElement("afterbegin", div);

                wrapper = document.createElement("div");
                wrapper.className = "externalNavLinkWrapper";

                div = document.createElement("div");
                div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y externalNavLink");
                div.innerHTML = isZH ? "⚔️ 战斗模拟 shykai" : "⚔️ Combat sim shykai";
                div.addEventListener("click", () => {
                    window.open("https://shykai.github.io/MWICombatSimulatorTest/dist/", "_blank");
                });
                attachFloatingTooltip(div,  `
                <strong>Combat sim (shykai)</strong>
                Lightweight tool for testing battle outcomes and team synergy.
              `);
                targetNode.insertAdjacentElement("afterbegin", div);

                // Create the bug report button
                div = document.createElement("div");
                div.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y externalNavLink");
                div.innerHTML = isZH ? "⚠️ 发送错误报告" : "⚠️ Send Bug Report";

                div.addEventListener("click", async (e) => {

                        if (e.shiftKey) {
                            console.log("Testing error handler...");
                            setTimeout(() => {
                                throw new Error("Test error from bug report button");
                            }, 100);
                            return;
                        }

                        // Check if loggerLog exists and has entries
                        if (!loggerLog || loggerLog.length === 0) {
                            alert("No log entries found to send.");
                            return;
                        }

                        // Prepare the log data
                        const recentLog = loggerLog.slice(-20).map(entry => {
                            return JSON.stringify(entry);
                        }).join(",\n");

                        // Wrap in array brackets to make valid JSON
                        const validJson = `[\n${recentLog}\n]`;

                        // Try multiple methods with user choice
                        await navigator.clipboard.writeText(validJson);

                        // eslint-disable-next-line no-undef
                        GM_notification({
                            text: "Log entries copied to clipboard! You can now paste them in Discord or elsewhere",
                            title: "MWITools Extended",
                        });
                });

                attachFloatingTooltip(div, `
                    <strong>Send Bug Report</strong>
                    Copies the "Error" log entries to clipboard so you can send it in discord.
                  `);
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
        new MutationObserver(() => {
            handleActionQueueMenueCalculateTime(added);
        }).observe(listDiv, { characterData: false, subtree: false, childList: true });
    }

    function handleActionQueueMenueCalculateTime(added) {
        const actionDivList = added.querySelectorAll("div.QueuedActions_action__r3HlD");
        if (!actionDivList || actionDivList.length === 0) {
            return;
        }
        if (actionDivList.length !== currentActionsHridList.length - 1) {
            logger("handleActionQueueTooltip action queue length inconsistency");
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

            if (!isAccumulatedTimeInfinite) {
                accumulatedTimeSec += totalTimeSec;
                const currentTime = new Date();
                currentTime.setSeconds(currentTime.getSeconds() + accumulatedTimeSec);
            }
            if (hasSkippedfirstActionObj) {
                const html = `<div class="script_actionTime" style="
                color: #FFD700;
                text-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
                font-weight: 600;
                font-size: 11px;
            ">${
                isInfinit ? "[ ∞ ] " : `[${timeReadable(accumulatedTimeSec)}]`
                }</div>`;
                if (actionDivList[actionDivListIndex].querySelector("div div.script_actionTime")) {
                    actionDivList[actionDivListIndex].querySelector("div div.script_actionTime").outerHTML = html;
                } else {
                    actionDivList[actionDivListIndex].querySelector("div").insertAdjacentHTML("beforeend", html);
                }
                actionDivListIndex++;
            }
            hasSkippedfirstActionObj = true;
        }
        const html = `<div id="script_queueTotalTime" style="
        color: #4ECDC4;
        text-shadow: 0 0 8px rgba(78, 205, 196, 0.6);
        font-weight: 600;
        font-size: 13px;
        margin-top: 6px;
    ">${isZH ? "总时间：" : "Total time: "}${
        isAccumulatedTimeInfinite ? "[ ∞ ] " : `[${timeReadable(accumulatedTimeSec)}]`
        }</div>`;
        if (document.querySelector("div#script_queueTotalTime")) {
            document.querySelector("div#script_queueTotalTime").outerHTML = html;
        } else {
            document.querySelector("div.QueuedActions_queuedActionsEditMenu__3OoQH").insertAdjacentHTML("afterend", html);
        }
    }

    /* 支持修改版汉化插件 */
    function getOriTextFromElement(elem) {
        if (!elem) {
            logger("getTextFromElement null elem");
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
            logger(`handleItemTooltipWithEnhancementLevel no math lib`);
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
            logger(`handleItemTooltipWithEnhancementLevel invalid itemHrid ${itemName} ${itemHrid}`);
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
        if (!price_data || !price_data.marketData) {
            logger("findBestEnhanceStrat fetchMarketJSON null");
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
        // eslint-disable-next-line no-undef
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
        // eslint-disable-next-line no-undef
        let Q = markov.subset(math.index(math.range(0, input_data.stop_at), math.range(0, input_data.stop_at)));
        // eslint-disable-next-line no-undef
        const M = math.inv(math.subtract(math.identity(input_data.stop_at), Q));
        // eslint-disable-next-line no-undef
        const attemptsArray = M.subset(math.index(math.range(0, 1), math.range(0, input_data.stop_at)));
        // eslint-disable-next-line no-undef
        const attempts = math.flatten(math.row(attemptsArray, 0).valueOf()).reduce((a, b) => a + b, 0);
        // eslint-disable-next-line no-undef
        const protectAttempts = M.subset(math.index(math.range(0, 1), math.range(protect_at, input_data.stop_at)));
        // eslint-disable-next-line no-undef
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
            (itemDetailObj.protectionItemHrids === null || itemDetailObj.protectionItemHrids === undefined)
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
        let productionCost = getBaseItemProductionCost(itemDetailObj.name, price_data);

        const item_price_data = price_data.marketData[hrid];
        const ask = item_price_data?.[0]?.a;
        const bid = item_price_data?.[0]?.b;

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

    // Helper function to generate different input types
    function generateSettingInput(setting) {
        const type = setting.type || 'checkbox'; // Default to checkbox if no type specified
        switch (type) {
            case 'checkbox':
                return `
                    <label class="mwitools-switch">
                        <input type="checkbox" id="${setting.id}" ${setting.isTrue ? 'checked' : ''}>
                        <span class="mwitools-slider"></span>
                    </label>
                `;

            case 'text':
                const keyrec = setting.keyinput;
                return `
                        <input type="text"
                            id="${setting.id}"
                            class="mwitools-text-input ${keyrec ? 'keyrec-active' : ''}"
                            value="${setting.value || ''}"
                            placeholder="${setting.placeholder || ''}"
                            ${keyrec ? 'readonly' : ''}>
                    `;

            case 'number':
                return `
                    <input type="number"
                        id="${setting.id}"
                        class="mwitools-number-input"
                        value="${setting.value || ''}"
                        min="${setting.min || ''}"
                        max="${setting.max || ''}"
                        step="${setting.step || '1'}"
                        placeholder="${setting.placeholder || ''}">
                `;


                case 'select':
                    const options = setting.options || [];
                    const optionsHTML = options.map(option => {
                        const value = typeof option === 'object' ? option.value : option;
                        const label = typeof option === 'object' ? option.label : option;

                        // Convert boolean values to strings for HTML attributes
                        const htmlValue = typeof value === 'boolean' ? value.toString() : value;
                        const selected = setting.isTrue === value ? 'selected' : '';

                        return `<option value="${htmlValue}" ${selected}>${label}</option>`;
                    }).join('');

                    return `
                        <select id="${setting.id}" class="mwitools-select-input">
                            ${optionsHTML}
                        </select>
                    `;

            case 'range':
                return `
                    <div class="mwitools-range-container">
                        <input type="range"
                            id="${setting.id}"
                            class="mwitools-range-input"
                            value="${setting.value || setting.min || 0}"
                            min="${setting.min || 0}"
                            max="${setting.max || 100}"
                            step="${setting.step || 1}">
                        <span class="mwitools-range-value">${setting.value || setting.min || 0}</span>
                    </div>
                `;

            case 'color':
                return `
                    <input type="color"
                        id="${setting.id}"
                        class="mwitools-color-input"
                        value="${setting.value || '#000000'}">
                `;

            default:
                console.warn(`Unknown setting type: ${type}`);
                return generateSettingInput({...setting, type: 'checkbox'});
        }
    }
    function handleTimeFormatChange() {
        const targetNode = document.querySelector("div.Header_actionName__31-L2 > div.Header_displayName__1hN09");
        if (targetNode) {
            const timeSpan = targetNode.querySelectorAll("span")[1];
            if (timeSpan) {
                timeSpan.innerText = "";
            }

            // Recalculate time display
            calculateTotalTime();

            // Update queue actions if present
            const queueActions = document.querySelector("div.QueuedActions_queuedActionsEditMenu__3OoQH");
            if (queueActions) {
                handleActionQueueMenue(queueActions);
            }
        }
    }
    /* -----------------------------------------------------------
        Build the card UI
    ----------------------------------------------------------- */
    function buildSettingsUI(container) {
    // Check if MWITools tab already exists
        if (container.querySelector('#mwitools-tab-button')) return;

        // Find the tabs container and tab panels container
        const tabsContainer = container.querySelector('.MuiTabs-flexContainer');
        const tabPanelsContainer = container.querySelector('.TabsComponent_tabPanelsContainer__26mzo');

        if (!tabsContainer || !tabPanelsContainer) {
            console.warn('Could not find tabs structure, falling back to original method');
            // Fallback to original implementation
            buildOriginalSettingsUI(container);
            return;
        }

        // Get the next tab index
        const existingTabs = tabsContainer.querySelectorAll('button[role="tab"]');

        // Create the new tab button
        const tabButton = document.createElement('button');
        tabButton.className = 'MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-1q2h7u5';
        tabButton.id = 'mwitools-tab-button';
        tabButton.setAttribute('role', 'tab');
        tabButton.setAttribute('aria-selected', 'false');
        tabButton.setAttribute('tabindex', '-1');
        tabButton.setAttribute('type', 'button');
        tabButton.innerHTML = `
        <span class="MuiBadge-root TabsComponent_badge__1Du26 css-1rzb3uu">
            ${isZH ? 'MWITools' : 'MWITools'}
            <span class="MuiBadge-badge MuiBadge-standard MuiBadge-invisible MuiBadge-anchorOriginTopRight MuiBadge-anchorOriginTopRightRectangular MuiBadge-overlapRectangular css-vwo4eg"></span>
        </span>
        <span class="MuiTouchRipple-root css-w0pj6f"></span>
    `;

        // Create the tab panel content
        const tabPanel = document.createElement('div');
        tabPanel.className = 'TabPanel_tabPanel__tXMJF TabPanel_hidden__26UM3';
        tabPanel.id = 'mwitools-tab-panel';
        tabPanel.setAttribute('role', 'tabpanel');
        tabPanel.style.display = 'none'; // Initially hidden

        // Create the settings card content
        const card = document.createElement('div');
        card.className = 'mwitools-card';
        card.id = 'script_settings';

        // Updated settings generation
        for (const setting of Object.values(settingsMap)) {
            if (setting.skip || setting.extended) continue;
            const inputHTML = generateSettingInput(setting);

            card.insertAdjacentHTML('beforeend', `
                <div class="mwitools-setting" data-type="${setting.type || 'checkbox'}">
                    <span class="mwitools-setting-label">${setting.desc}</span>
                    ${inputHTML}
                </div>
            `);
        }

        // Create the settings card content
        const card2 = document.createElement('div');
        card2.className = 'mwitools-card';
        card2.id = 'script_settings';

        const extendedSettings = document.createElement("div");
        extendedSettings.innerHTML = `<br><div style="font-size: 24px; font-weight: bold;">⚙️ MWITools Extended Settings</div>`;

        // card2.insertAdjacentHTML("beforeend", extendedSettings);
        // Updated settings generation
        for (const setting of Object.values(settingsMap)) {
            if (!setting.extended) continue;
            if (setting.skip) continue;
            const inputHTML = generateSettingInput(setting);

            card2.insertAdjacentHTML('beforeend', `
                <div class="mwitools-setting" data-type="${setting.type || 'checkbox'}">
                    <span class="mwitools-setting-label">${setting.desc}</span>
                    ${inputHTML}
                </div>
            `);
        }
        card2.querySelectorAll('input.keyrec-active').forEach(input => {
            input.addEventListener('focus', () => {
                input.value = ''; // Clear current value on focus
                input.dataset.armed = 'true'; // Mark as listening
            });

            input.addEventListener('blur', () => {
                input.dataset.armed = 'false'; // Stop listening
            });
        });

        // Global listener to detect key presses
        document.addEventListener('keydown', (e) => {
            const activeInput = document.querySelector('input.keyrec-active[data-armed="true"]');
            if (!activeInput) return;

            e.preventDefault(); // Prevent default behavior like opening dev tools or page reload

            const keys = [];
            if (e.ctrlKey) keys.push('CTRL');
            if (e.altKey) keys.push('ALT');
            if (e.shiftKey) keys.push('SHIFT');
            if (e.metaKey) keys.push('META');

            // Add the main key
            const mainKey = e.code.replace(/^Key/, '').replace(/^Digit/, '');
            if (!['CONTROL', 'ALT', 'SHIFT', 'META'].includes(mainKey.toUpperCase())) {
                keys.push(mainKey.toUpperCase());
            }

            const keyString = keys.join(' + ');
            activeInput.value = keyString;
            localStorage.setItem("keybind", keyString); // Store in localStorage
            // Optionally store it in your settings:
            const settingId = activeInput.id;
            if (settingsMap[settingId]) {
                settingsMap[settingId].value = keyString;
            }
            saveSettings();
        });

        card2.addEventListener('change', (event) => {
            if (event.target.tagName === 'SELECT') {
                const settingId = event.target.id;
                const selectedValue = event.target.value;

                // Convert string back to original type
                const originalSetting = settingsMap[settingId];
                if (originalSetting && originalSetting.options) {
                    const matchingOption = originalSetting.options.find(opt => {
                        const optValue = typeof opt === 'object' ? opt.value : opt;
                        return optValue.toString() === selectedValue;
                    });

                    if (matchingOption) {
                        const actualValue = typeof matchingOption === 'object' ? matchingOption.value : matchingOption;
                        if (settingId === "graphicStyle") {
                            originalSetting.isTrue = actualValue;
                            handleGraphicStyleChange(actualValue); // This triggers the reactive proxy
                        } else if (settingId === "actionPanelStyle") {
                            originalSetting.isTrue = actualValue; // For checkbox-like behavior
                        } else if (settingId === "timeFormatShortLong") {
                            originalSetting.isTrue = actualValue; // For checkbox-like behavior
                            handleTimeFormatChange();
                        }
                    }
                }
            }

            if (event.target.tagName === 'INPUT') {
                const settingId = event.target.id;
                const selectedValue = event.target.value;

                // Convert string back to original type
                const originalSetting = settingsMap[settingId];
                if (originalSetting) {
                    if (settingId === "testNumber") {
                        console.log(`workInProgress - testNumber: ${selectedValue}`);
                    } else if (settingId === "keybindInput") {
                        localStorage.setItem("keybind", selectedValue);
                    } else if (settingId === "includeCurrentTime") {
                        originalSetting.isTrue = event.target.checked; // For checkbox-like behavior
                        handleTimeFormatChange();
                    }
                }
            }
            // Save all settings
            saveSettings();
        });

        // Add the card to the tab panel
        tabPanel.appendChild(card);
        tabPanel.appendChild(extendedSettings);
        tabPanel.appendChild(card2);

        // Tab switching functionality
        const switchToTab = (targetButton, targetPanel) => {
            // Hide all tab panels
            const allPanels = tabPanelsContainer.querySelectorAll('.TabPanel_tabPanel__tXMJF');
            allPanels.forEach(panel => {
                panel.style.display = 'none';
                panel.classList.add('TabPanel_hidden__26UM3');
            });

            // Deactivate all tab buttons
            const allButtons = tabsContainer.querySelectorAll('button[role="tab"]');
            allButtons.forEach(button => {
                button.setAttribute('aria-selected', 'false');
                button.setAttribute('tabindex', '-1');
                button.classList.remove('Mui-selected');
            });

            // Activate target tab
            // TabPanel_hidden__26UM3
            targetButton.setAttribute('aria-selected', 'true');
            targetButton.setAttribute('tabindex', '0');
            targetButton.classList.add('Mui-selected');
            targetPanel.style.display = 'block';
            targetPanel.classList.remove('TabPanel_hidden__26UM3');
            if (targetButton.id && targetButton.id.includes("mwi")) {
                document.querySelector("h1.SettingsPanel_title__3ORAB").innerHTML = `⚙️ MWITools Settings (refresh to apply) <br> Refresh not needed for Extended settings`;
            } else {
                document.querySelector("h1.SettingsPanel_title__3ORAB").textContent = `Settings`;
            }
        };

        // Add click handler for new tab
        tabButton.addEventListener('click', () => {
            switchToTab(tabButton, tabPanel);
        });

        // Add click handlers for existing tabs to hide MWITools panel
        existingTabs.forEach((existingTab, index) => {
            existingTab.addEventListener('click', () => {
                const correspondingPanel = tabPanelsContainer.children[index];
                if (correspondingPanel) {
                    switchToTab(existingTab, correspondingPanel);
                }
            });
        });

        // Add event listeners for settings
        card.addEventListener('change', saveSettings);
        card2.addEventListener('change', saveSettings);

        // Append the new tab and panel
        tabsContainer.appendChild(tabButton);
        tabPanelsContainer.appendChild(tabPanel);
    }

    // Fallback function for original behavior
    function buildOriginalSettingsUI(container) {
        if (container.querySelector('#script_settings')) return;
        const card = document.createElement('div');
        card.className = 'mwitools-card';
        card.id = 'script_settings';
        card.innerHTML = `<h3>${
        isZH ? 'MWITools 设置（刷新后生效）' : 'MWITools Settings (refresh to apply)'
        }</h3>`;

            // Just add all settings directly to the card
            for (const setting of Object.values(settingsMap)) {
                card.insertAdjacentHTML('beforeend', `
                <div class="mwitools-setting">
                    <span style="text-align: left;">${setting.desc}</span>
                    <label class="mwitools-switch">
                        <input type="checkbox" id="${setting.id}" ${setting.isTrue ? 'checked' : ''}>
                        <span class="mwitools-slider"></span>
                    </label>
                </div>
            `);
            }

            card.insertAdjacentHTML('beforeend', `
            <div class="mwitools-bulk">
                <button id="mwitools-all">${isZH ? '全选' : 'Select All'}</button>
                <button id="mwitools-none">${isZH ? '全清' : 'Clear All'}</button>
            </div>
            <p>
                ${isZH
                                    ? '在脚本中搜索"Customization"可调整配色和默认强化参数。'
                                    : 'Search "Customization" in the code to tweak colors and default enhancement parameters.'}
            </p>
        `);

        // events remain the same
        card.addEventListener('change', saveSettings);
        card.querySelector('#mwitools-all').onclick = () => {
            card.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = true);
            saveSettings();
        };
        card.querySelector('#mwitools-none').onclick = () => {
            card.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
            saveSettings();
        };
        container.appendChild(card);
    }

    /* 脚本设置面板 */
    const waitForSetttings = () => {
        const targetNode = document.querySelector("div.SettingsPanel_profileTab__214Bj");
        if (targetNode) {
            if (!targetNode.querySelector("#script_settings")) {
                buildSettingsUI(document.querySelector("div.SettingsPanel_tabsComponentContainer__Xb_5H"));
            }
        }
        setTimeout(waitForSetttings, 500);
    };

    function waitForMath(callback) {
        const interval = setInterval(() => {
            if (typeof math !== 'undefined') {
                clearInterval(interval);
                callback();
            }
        }, 50); // check every 50ms
    }

    waitForMath(() => {
        logger("🔢 Math.js is ready, initializing settings...", EXTENDED_SCRIPT_COLORS.brightGreen);

        waitForSetttings();
    });


    function saveSettings() {
        const settings = {};

        document.querySelectorAll('.mwitools-setting').forEach(settingEl => {
            const type = settingEl.dataset.type || 'checkbox';
            const input = settingEl.querySelector('input, select');

            if (!input || !input.id) return;

            switch (type) {
                case 'checkbox':
                    settings[input.id] = input.checked;
                    break;
                case 'text':
                case 'color':
                    settings[input.id] = input.value;
                    break;
                case 'number':
                case 'range':
                    settings[input.id] = parseFloat(input.value) || 0;
                    break;
                case 'select':
                    // Handle boolean values in select options
                    let selectValue = (input.value === "true");
                    if (selectValue === 'true') selectValue = true;
                    if (selectValue === 'false') selectValue = false;
                    settings[input.id] = selectValue;
                    break;
            }
        });

        // Save to localStorage
        localStorage.setItem('mwitools_settings', JSON.stringify(settings));

        // Update the settingsMap and trigger reactive updates
        for (const [key, value] of Object.entries(settings)) {
            if (settingsMap[key]) {
                const setting = settingsMap[key];
                const type = setting.type || 'checkbox';
                try {
                    if (type === 'checkbox') {
                        setting.isTrue = value; // This will trigger the proxy
                    } else {
                        setting.value = value; // This will trigger the proxy
                        setting.isTrue = value; // This will trigger the proxy
                    }
                } catch (err) {
                    logger("Error updating setting: " + key + " : " + err, EXTENDED_SCRIPT_COLORS.brightRed, true, "error");
                }
            }
        }
        saveSettingsToStorage();
    }
    function readSettings() {
        // Read from the new storage key first, fallback to old key for backward compatibility
        let savedSettings = localStorage.getItem("mwitools_settings");

        // Fallback to old storage format for backward compatibility
        if (!savedSettings) {
            const oldSettings = localStorage.getItem("script_settingsMap");
            if (oldSettings) {
                console.log("[Settings] Migrating from old storage format");
                const oldObj = JSON.parse(oldSettings);
                const migratedSettings = {};

                // Migrate old format to new format
                for (const option of Object.values(oldObj)) {
                    if (settingsMap.hasOwnProperty(option.id)) {
                        migratedSettings[option.id] = option.isTrue;
                    }
                }

                // Save in new format
                localStorage.setItem("mwitools_settings", JSON.stringify(migratedSettings));
                savedSettings = JSON.stringify(migratedSettings);

                // Remove old storage
                localStorage.removeItem("script_settingsMap");
            }
        }

        // Apply saved settings
        if (savedSettings) {
            const savedObj = JSON.parse(savedSettings);

            for (const [settingId, savedValue] of Object.entries(savedObj)) {
                if (settingsMap.hasOwnProperty(settingId)) {
                    const setting = settingsMap[settingId];
                    const settingType = setting.type || 'checkbox';

                    // Apply the saved value based on setting type
                    // Note: This will trigger reactive behaviors through the proxy
                    try {
                        if (settingType === 'checkbox') {
                            setting.isTrue = savedValue;
                        } else if (settingType === 'text') {
                            setting.value = savedValue;
                        } else {
                            setting.value = savedValue;
                            setting.isTrue = savedValue;
                        }
                    } catch (err) {
                        logger(err.message, EXTENDED_SCRIPT_COLORS.orange, true, "error");
                    }
                }
            }
        }

        // Apply global settings that affect the entire script
        applyGlobalSettings();
    }

    // Separate function for global settings that need to be applied immediately
    function applyGlobalSettings() {
        // Language setting
        if (settingsMap.forceMWIToolsDisplayZH?.isTrue) {
            isZH = true; // For Traditional Chinese users.
        }

        // Color theme settings
        if (settingsMap.useOrangeAsMainColor?.isTrue) {
            if (SCRIPT_COLOR_MAIN === "green") {
                SCRIPT_COLOR_MAIN = "orange";
            }
            if (SCRIPT_COLOR_TOOLTIP === "darkgreen") {
                SCRIPT_COLOR_TOOLTIP = "#804600";
            }
        }

        // Custom accent color (if it exists and is a color type)
        if (settingsMap.accentColor?.type === 'color' && settingsMap.accentColor?.value) {
            updateThemeColors(settingsMap.accentColor.value);
        }

        // Volume setting (if it exists)
        if (settingsMap.volume?.type === 'range' && settingsMap.volume?.value !== undefined) {
            updateNotificationVolume(settingsMap.volume.value);
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

    function getItemCountFromInv(hrid) {

        let result = null;
        for (const item of initData_characterItems) {
            if (item.itemHrid === hrid && item.itemLocationHrid === "/item_locations/inventory") {
                result = item.count;
            }
        }
        return result ? result : false;
    }

    /* 空闲时弹窗通知 */
    function notificate() {
        // eslint-disable-next-line no-undef
        if (typeof GM_notification === "undefined" || !GM_notification) {
            logger("notificate null GM_notification");
            return;
        }
        if (currentActionsHridList.length > 0) {
            return;
        }
        console.log("notificate empty action");
        // eslint-disable-next-line no-undef
        GM_notification({
            text: isZH ? "动作队列为空" : "Action queue is empty.",
            title: "MWITools",
        });
    }

    /* 市场价格自动输入最小压价 */
    const waitForMarketOrders = () => {
        const element = document.querySelector(".MarketplacePanel_marketListings__1GCyQ");
        if (element) {
            logger("start observe market order", EXTENDED_SCRIPT_COLORS.cyan);
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
            logger("handleMarketNewOrder can not find elements");
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
    let playersMP = [];
    let players = [];
    // eslint-disable-next-line no-unused-vars
    let monsters = [];
    let dragging = false;
    let chart = null;
    let monsterCounts = {}; // Object to store monster counts
    let monsterEvasion = {}; // Object to store monster evasion ratings by combat style
    let monsterHrids = {};
    const calculateHitChance = (accuracy, evasion) => {
        const hitChance = (Math.pow(accuracy, 1.4) / (Math.pow(accuracy, 1.4) + Math.pow(evasion, 1.4))) * 100;
        return hitChance;
    };

    const getStatisticsDom = () => {
        const numPlayers = players.length;
        const chartHeight = numPlayers * 35 + 20;

        if (!document.querySelector(".script_dps_panel")) {
            let panel = document.createElement("div");
            panel.style.position = "fixed";
            panel.style.top = "50px";
            panel.style.left = "50px";
            panel.style.zIndex = "9999";
            panel.style.fontSize = "14px";
            panel.style.padding = "10px";
            panel.style.borderRadius = "16px";
            panel.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
            panel.style.overflow = "auto";
            panel.style.width = "auto";
            panel.style.height = "auto";
            panel.style.backdropFilter = "blur(8px)";
            if (settingsMap.damageGraphTransparentBackground.isTrue) {
                panel.style.background = "rgba(0, 0, 0, 0.5)";
                panel.style.border = "1px solid rgba(255, 255, 255, 0.2)";
                panel.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
                panel.style.backdropFilter = "blur(8px)";
            } else {
                panel.style.background = "rgba(0, 0, 0)";
                panel.style.border = "1px solid rgba(255, 255, 255)";
                panel.style.boxShadow = "0 4px 12px rgba(0, 0, 0)";
            }

            panel.innerHTML = `
            <div id="panelHeader" style="display: flex; justify-content: space-between; align-items: center; cursor: move; width: auto; height: auto;">
                <span style="font-weight: bold; font-size: 16px; color: #0078d4;">DPS</span>
                <button id="script_toggleButton" style="background-color: #0078d4; color: white; border: none; padding: 5px 10px; margin-left: 10px; border-radius: 8px; cursor: pointer;">${lang.toggleButtonHide}</button>
            </div>
            <div id="script_panelContent">
                <div id="script_dpsChart_div" style="width: 400px; height: ${chartHeight}px;">
                    <canvas id="script_dpsChart"></canvas></div>
                <div id="script_dpsText"></div>
                <div id="script_hitChanceTable" style="margin-top: 10px;"></div>
            </div>`;
            panel.className = "script_dps_panel";

            let offsetX, offsetY;
            let dragging = false;

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

                    var newX = e.clientX - offsetX;
                    var newY = e.clientY - offsetY;
                    panel.style.left = newX + "px";
                    panel.style.top = newY + "px";
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
                    const now = Date.now();
                    if (now - dragStartTime < 16) return; // 限制每16毫秒更新一次
                    dragStartTime = now;

                    let touch = e.touches[0];
                    var newX = touch.clientX - offsetX;
                    var newY = touch.clientY - offsetY;
                    panel.style.left = newX + "px";
                    panel.style.top = newY + "px";
                }
            });

            document.addEventListener("touchend", function () {
                dragging = false;
            });

            document.body.appendChild(panel);

            // Toggle button functionality
            if (!localStorage.getItem("script_dpsPanel_isExpanded")) {
                localStorage.setItem("script_dpsPanel_isExpanded", true);
            }
            if (localStorage.getItem("script_dpsPanel_isExpanded") !== "true") {
                document.getElementById("script_panelContent").style.display = "none";
                document.getElementById("script_toggleButton").textContent = lang.toggleButtonShow;
            }

            document.getElementById("script_toggleButton").addEventListener("click", function () {
                let isExpanded = localStorage.getItem("script_dpsPanel_isExpanded") === "true";
                isExpanded = !isExpanded;
                localStorage.setItem("script_dpsPanel_isExpanded", isExpanded ? true : false);
                this.textContent = isExpanded ? lang.toggleButtonHide : lang.toggleButtonShow;
                const panelContent = document.getElementById("script_panelContent");
                if (isExpanded) {
                    panelContent.style.display = "block";
                    this.textContent = lang.toggleButtonHide;
                } else {
                    panelContent.style.display = "none";
                    this.textContent = lang.toggleButtonShow;
                }
            });

            // Create chart
            const ctx = document.getElementById("script_dpsChart").getContext("2d");
            // eslint-disable-next-line no-undef
            chart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: [],
                    datasets: [
                        {
                            data: [],
                            backgroundColor: [
                                "rgba(255, 99, 132, 0.6)", // 浅粉色
                                "rgba(54, 162, 235, 0.6)", // 浅蓝色
                                "rgba(255, 206, 86, 0.6)", // 浅黄色
                                "rgba(75, 192, 192, 0.6)", // 浅绿色
                                "rgba(153, 102, 255, 0.6)", // 浅紫色
                                "rgba(255, 159, 64, 0.6)", // 浅橙色
                            ],
                            borderColor: [
                                "rgba(255, 99, 132, 1)", // 浅粉色边框
                                "rgba(54, 162, 235, 1)", // 浅蓝色边框
                                "rgba(255, 206, 86, 1)", // 浅黄色边框
                                "rgba(75, 192, 192, 1)", // 浅绿色边框
                                "rgba(153, 102, 255, 1)", // 浅紫色边框
                                "rgba(255, 159, 64, 1)", // 浅橙色边框
                            ],
                            borderWidth: 1,
                            barPercentage: 0.9,
                            categoryPercentage: 1.0,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
                                    size: 12, // 字体大小
                                    weight: "bold", // 加粗字体
                                },
                                color: "rgba(255, 255, 255, 0.7)", // 浅色字体（你可以根据背景调整颜色）
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

                // eslint-disable-next-line no-undef
                plugins: [ChartDataLabels],
            });
        } else if (document.getElementById("script_dpsChart_div")) {
            document.getElementById("script_dpsChart_div").style.height = `${chartHeight}px`;
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
            // eslint-disable-next-line no-unused-vars
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
                    let auraskillHrid = null;
                    if (player.combatAbilities && Array.isArray(player.combatAbilities)) {
                        const firstAbility = player.combatAbilities[0];
                        if (firstAbility && firstAbility.abilityHrid) {
                            auraskillHrid = firstAbility.abilityHrid;
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
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ");

                    // Highlight the player with the highest DPS
                    const isHighestDPS = dps[index] === Math.max(...dps);
                    const dpsPrefix = isHighestDPS ? "🔥" : "";

                    return `
            <tr style="color: white;">
                <td style="font-weight: bold;">${dpsPrefix} ${player.name}</td>
                <td>${isZH ? (auraskillHrid ? ZHOthersDic[auraskillHrid] : "无") : auraskill}</td>
                <td>${dpsFormatted}</td>
                <td>${totalDamageFormatted}</td>
                <td>${damagePercentage}%</td>
            </tr>`;
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
                        // eslint-disable-next-line no-unused-vars
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
                            `<th style="font-size: smaller; white-space: normal; text-align: left; color: white;">${
                                isZH ? ZHOthersDic[monsterHrids[monsterName]] : monsterName
                            } (${count})</th>`
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
                for (let i = 0; i < selectDungeon.options.length; i++) {
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
        const clientObj = JSON.parse(decompressString(GM_getValue("init_client_data", "")));
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
        const clientObj = JSON.parse(decompressString(GM_getValue("init_client_data", "")));
        let battleObj = null;
        if (GM_getValue("new_battle", "")) {
            battleObj = JSON.parse(GM_getValue("new_battle", ""));
        }
        // console.log(battleObj);
        const storedProfileList = JSON.parse(GM_getValue("profile_export_list", "[]"));
        // console.log(storedProfileList);

        const BLANK_PLAYER_JSON = `{\"player\":{\"attackLevel\":1,\"magicLevel\":1,\"powerLevel\":1,\"rangedLevel\":1,\"meleeLevel\":1,\"defenseLevel\":1,\"staminaLevel\":1,\"intelligenceLevel\":1,\"equipment\":[]},\"food\":{\"/action_types/combat\":[{\"itemHrid\":\"\"},{\"itemHrid\":\"\"},{\"itemHrid\":\"\"}]},\"drinks\":{\"/action_types/combat\":[{\"itemHrid\":\"\"},{\"itemHrid\":\"\"},{\"itemHrid\":\"\"}]},\"abilities\":[{\"abilityHrid\":\"\",\"level\":\"1\"},{\"abilityHrid\":\"\",\"level\":\"1\"},{\"abilityHrid\":\"\",\"level\":\"1\"},{\"abilityHrid\":\"\",\"level\":\"1\"},{\"abilityHrid\":\"\",\"level\":\"1\"}],\"triggerMap\":{},\"zone\":\"/actions/combat/fly\",\"simulationTime\":\"100\",\"houseRooms\":{\"/house_rooms/dairy_barn\":0,\"/house_rooms/garden\":0,\"/house_rooms/log_shed\":0,\"/house_rooms/forge\":0,\"/house_rooms/workshop\":0,\"/house_rooms/sewing_parlor\":0,\"/house_rooms/kitchen\":0,\"/house_rooms/brewery\":0,\"/house_rooms/laboratory\":0,\"/house_rooms/observatory\":0,\"/house_rooms/dining_room\":0,\"/house_rooms/library\":0,\"/house_rooms/dojo\":0,\"/house_rooms/gym\":0,\"/house_rooms/armory\":0,\"/house_rooms/archery_range\":0,\"/house_rooms/mystical_study\":0}}`;

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
            } else if (skill.skillHrid.includes("melee")) {
                playerObj.player.meleeLevel = skill.level;
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
            } else if (skill.skillHrid.includes("melee")) {
                playerObj.player.meleeLevel = skill.level;
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
                } else if (weapon.includes("boomstick") || weapon.includes("staff") || weapon.includes("trident")) {
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
            } else if (getOriTextFromElement(expNode.children[0]).includes("Melee") || getOriTextFromElement(expNode.children[0]).includes("魔法")) {
                perHourGainExp.melee = Number(expNode.children[1].textContent);
            }
        });

        let data = GM_getValue("init_character_data", null);
        let obj = JSON.parse(data);
        if (!obj || !obj.characterSkills || !obj.currentTimestamp) {
            logger("handleResult no character localstorage");
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
            } else if (skill.skillHrid.includes("melee")) {
                skillLevels.magic = {};
                skillLevels.magic.skillName = "Melee";
                skillLevels.magic.skillZhName = "近战";
                skillLevels.magic.currentLevel = skill.level;
                skillLevels.magic.currentExp = skill.experience;
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

        const skillNamesInOrder = ["stamina", "intelligence", "attack", "power", "defense", "melee", "ranged", "magic"];
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
            skillInput.addEventListener("keyup", function () {
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
        daysAfterInput.addEventListener("keyup", function () {
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
        const initData_levelExperienceTable = JSON.parse(decompressString(GM_getValue("init_client_data", null))).levelExperienceTable;
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
        const initData_levelExperienceTable = JSON.parse(decompressString(GM_getValue("init_client_data", null))).levelExperienceTable;
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
                    const clientObj = JSON.parse(decompressString(GM_getValue("init_client_data", "")));
                    const characterObj = JSON.parse(GM_getValue("init_character_data", ""));

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

                        let battlePlayer = null;
                        if (GM_getValue("new_battle", "")) {
                            const battleObj = JSON.parse(GM_getValue("new_battle", ""));
                            const battlePlayerList = battleObj.players.filter((item) => item.character.id === playerID);
                            if (battlePlayerList.length === 1) {
                                battlePlayer = battlePlayerList[0];
                            }
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