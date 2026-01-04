
// ==UserScript==
// @name         传奇私服自用脚本
// @namespace    https://linux.do/u/io.oi/cq.auto.play
// @version      0.0.1
// @author       果农
// @description  自助挂机脚本
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-hai.one
// @match        http://chuanqi.proxy2world.com/play?*
// @match        https://cq.kubbo.cn/*
// @match        http://fuckgfw.me:23180/play?*
// @match        http://cq.eb.cx/*
// @grant        GM_addStyle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531389/%E4%BC%A0%E5%A5%87%E7%A7%81%E6%9C%8D%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/531389/%E4%BC%A0%E5%A5%87%E7%A7%81%E6%9C%8D%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

((o) => {
    // 添加自定义样式到页面
    if (typeof GM_addStyle == "function") {
        GM_addStyle(o);
        return;
    }
    const t = document.createElement("style");
    (t.textContent = o), document.head.append(t);
})(
    " .control-panel{position:fixed;bottom:0;left:0;min-width:auto} "+
    " .control-panel .control-group{display:flex} " +
    " .control-panel div{background: #0f0f0f;} " +
    " .control-panel div label, .control-panel .control-group .button{color:#ece6cf;background-color:#084552;padding:.4rem;border:none;cursor:pointer;border-radius:.1rem} " +
    " .control-panel input[type=checkbox]{display: none;} "+
    " .control-panel .icon-label {display: inline-block; cursor: pointer;} " +
    " .control-panel .icon-label svg {width: 100%; height: 100%;} "
);

(function () {
    "use strict";
    const gameState = {
        // 自动挂机地图ID
        autoPlayMapId: 150,
        // 存储上一个BOSS的信息，用于判断是否为新BOSS
        lastBoss: {},
        // 是否正在寻路
        isFindedPath: false,
        // 是否在自动挂机状态
        autoPlayStatus: true,
        // 上一个地图ID
        lastMapId: 147,
        // 连续飞行次数
        flyCount: 0,
        // 是否是第一次连接
        isFirstConnected: true,
        // 是否是第一次运行
        isFirstRun: true,
        // 是否在黑白佬的服务器
        isInBlackWhite: window.location.hostname === "chuanqi.proxy2world.com",
        // 定时器和状态管理
        fireTimer: undefined,
        // 监控定时器
        watchTimer: undefined,
        // 是否附近有BOSS怪物
        nearHasBossMonster: false
    };
    window.gameState = gameState;

    const buttonColor = "#55b47d"; // 激活状态按钮颜色
    const buttonColor2 = "#084552"; // 未激活状态按钮颜色

    /**
     * 地图配置
     * @property {string} name - 地图名称
     * @property {number} flyId - 传送ID
     * @property {number} mapId - 地图ID
     * @property {boolean} dontautoplay - 是否禁用自动挂机
     * @property {Array} dangerArea - 危险区域坐标点（顺时针）
     * @property {Array} avoidMonsters - 需要躲避的怪物名称列表
     */
    const mapCfgs = {
        0: {
            // 这个适合任意地图挂机，仅实现无怪自动飞功能
            name: "无怪自动飞",
            flyId: 0,
            mapId: 0,
        },
        1: {
            name: "比奇",
            flyId: 3,
            mapId: 1,
            // 不开启挂机，只传送到当前地图
            dontautoplay: 1,
        },
        3: {
            name: "盟重",
            flyId: 14,
            mapId: 3,
            dontautoplay: 1,
        },
        9: {
            name: "封魔谷",
            flyId: 12,
            mapId: 9,
            // 忽略的坐标点，顺时针
            dangerArea: [
                [162, 60],
                [208, 95],
                [155, 130],
                [110, 100],
            ],
            // 不打的怪物名称，可以是全名，也可以只指定部分。如果检测到这些怪物就直接飞走
            avoidMonsters: ["麒麟"],
        },
        4: {
            name: "苍月",
            flyId: 16,
            mapId: 4,
            dangerArea: [
                [3, 130],
                [52, 103],
                [89, 135],
                [31, 168],
            ],
            avoidMonsters: ["麒麟", "魔龙"],
            notRecordBossInfo: true,
        },
        143: {
            name: "牛魔1层",
            flyId: 112,
            mapId: 143,
        },
        144: {
            name: "牛魔2层",
            flyId: 113,
            mapId: 144,
        },
        145: {
            name: "牛魔3层",
            flyId: 114,
            mapId: 145,
        },
        146: {
            name: "牛魔4层",
            flyId: 115,
            mapId: 146,
        },
        147: {
            name: "牛魔5层",
            flyId: 116,
            mapId: 147,
        },
        148: {
            name: "牛魔6层",
            flyId: 117,
            mapId: 148,
        },
        149: {
            name: "牛魔7层",
            // boss直接，配置参考 app.VlaoF.BossConfig，由 app.UyfaJ.ins().send_49_2 负责调用
            flyBossId: [9, 102],
            mapId: 149,
        },
        150: {
            name: "庄园",
            flyId: 118,
            mapId: 150,
            notFly: 1,
            // 挂机坐标点 38,33 40,31 42,29 44,27 46,25
            autoPlayArea: {
                x: 41,
                y: 30,
                scope: 3,
            },
            autoPlayInitPosition: {x: 40, y: 31, random: 3},
        },
        239: {
            name: "太行1层",
            flyId: 167,
            mapId: 239,
        },
        318: {
            name: "龙门1层",
            flyId: 218,
            mapId: 318,
        },
        347: {
            name: "沉默5层",
            flyId: 233,
            mapId: 347,
        },
        348: {
            name: "昏睡5层",
            flyId: 234,
            mapId: 348,
        },
        349: {
            name: "天池1层",
            flyId: 235,
            mapId: 349,
        },
    };

    /**
     * 一些app相关的函数以及数组
     * app.VlaoF.StdItems 这是一个数组，存放着所有的物品信息
     * app.VlaoF.RecyclingSettingConfig 这是一个数组，存放着所有的回收配置
     * app.GameMap.scenes.hook 这是一个数组，存放着当前地图的挂机点位
     *
     * app.ForgeMgr.ins().send_19_1 这是合成的api，经验瓶的itemCfg.Eid是3402
     * send_19_1(3402,1)
     *
     * 有龙的，捡取范围不生效可以自己改一下
     * app.PlayerRole.prototype.pickUpPetRange = function () { return 25; }
     */

    const gameHelper = {

        /**
         * 更新网页标题
         */
        updateDocumentTitle: function() {
            let player = app.NWRFmB.ins().getPayer;
            if(player && player.hasOwnProperty("_charName")) {
                document.title = player._charName + " - " + gameHelper.getCircleLv() + '转' + gameHelper.getLv() + '级' + '(' + app.MiOx.srvname + ')';
            }
        },

        /**
         * 整理包裹
         */
        sortBag: function() {
            app.ThgMu.ins().post_8_10();
        },

        /**
         * 替换玩家身上指定装备
         */
        replaceEquip: function(item) {
            // 包袱ID：0：药品，1：装备，2：材料；包袱中的所有物品存放于数组app.ThgMu.ins().bagItem[x]中
            // 先给包袱里的物品整理一下，这样就不用去找属性最好的那个了
            gameHelper.sortBag();
            // 获取当前的装备
            let itemId = gameHelper.checkAndConvertToItemId(item);
            if (itemId == 0) {
                return false;
            }
            // 检查一下包袱里有没有这个物品
            let itemInBag = gameHelper.getBagItemNum(itemId);
            if (!itemInBag) {
                // 没这玩意
                console.log('背包没有' + item + ', 无法替换');
                return false;
            }
            item = app.VlaoF.StdItems[itemId];
            let currentItem = app.caJqU.ins().getEquipsByPos(item.type - 1);
            if (currentItem['wItemId'] != itemId) {
                let currentItemName = app.VlaoF.StdItems[currentItem['wItemId']]['name'];
                console.log('将' + currentItemName + '替换为' + item['name']);
                return gameHelper.useItem(itemId, 1);
            } else {
                console.log('当前装备是' + item['name'] + ', 不需要替换');
                return true;
            }
        },

        /**
         * 检测是否是Boss
         */
        checkIsBoss: function(monsterName) {
            let checkNames = ["[神话]", "BOSS", "妖兽"];
            let isBoss = false;
            for (let i in checkNames) {
                if (monsterName.indexOf(checkNames[i]) >= 0) {
                    isBoss = true;
                    break;
                }
            }
            return isBoss;
        },

        /**
         * 获取指定背包中的物品列表
         *
         * @param {int} bagId 背包ID，0：药品，1：装备，2：材料
         * @param {int} showInConsole 是否在控制台输出，0：不输出，1：输出
         */
        getBagItems: function(bagId = 0, showInConsole = 0, onlytop = 0) {
            let items = app.ThgMu.ins().bagItem[bagId];
            let result = {};
            for(let i in items) {
                let itemId = items[i].wItemId;
                let itemName = app.VlaoF.StdItems[itemId]['name'];
                if(!result[itemId]) {
                    result[itemId] = {
                        id: itemId,
                        name: itemName,
                        count: 0,
                        itemlevel: app.VlaoF.StdItems[itemId]['itemlevel']?app.VlaoF.StdItems[itemId]['itemlevel']:0,
                    };
                }
                result[itemId].count += items[i].btCount;
            }
            let checkedItemLevel = [99, 117];
            // 以itemlevel和count从大到小排序
            // result = Object.values(result).sort((a, b) => {
            //     if(a['itemlevel'] == b['itemlevel']) {
            //         return b['count'] - a['count'];
            //     } else {
            //         return b['itemlevel'] - a['itemlevel'];
            //     }
            // })
            // 以 count 从大到小排序，如果 itemlevel 为 117，则在最前面
            result = Object.values(result).sort((a, b) => {
                let acount = a.count;
                let bcount = b.count;
                if(checkedItemLevel.indexOf(a['itemlevel']) >= 0) {
                    acount = acount * 1000000000;
                }
                if(checkedItemLevel.indexOf(b['itemlevel']) >= 0) {
                    bcount = bcount * 1000000000;
                }
                return bcount - acount;
            })
            if(showInConsole) {
                console.log('背包物品：' + (onlytop?'(只显示前'+onlytop+'个)':''));
                for(let i in result) {
                    if(onlytop && i >= onlytop) break;
                    let item = result[i];
                    if(checkedItemLevel.indexOf(item['itemlevel']) >= 0) {
                        gameHelper.redLog(item.name + ':'+ item.count);
                    } else {
                        console.log(item.name + ':'+ item.count);
                    }
                }
            }
            return result;
        },

        /**
         * 获取包裹中指定物品的数量
         *
         * @param {string} item 物品名称
         * @returns
         */
        getBagItemNum: function(item) {
            let itemId = gameHelper.checkAndConvertToItemId(item);
            if(!itemId) return 0;
            return app.ThgMu.ins().getItemCountById(itemId);
        },

        /**
         * 使用魔法
         *
         * @param {int} skillId
         */
        useMagic: function(skillId) {
            var player = app.NWRFmB.ins().getPayer;
            var skill = player.getUserSkill(skillId);
            if (player && skill && !skill.isDisable && egret.getTimer() > skill.dwResumeTick) {
                // 13: 瞬息移动，55：回城，56：盟重回城，57：比奇回城，58：随机
                var a = player.propSet.getAP_JOB();
                app.NGcJ.ins().s_5_2(skill.nSkillId, 0, player.currentX, player.currentY, player.dir, a);
            }
        },

        /**
         *
         * @param {int} key
         * @returns
         */
        appGetValue: function(key) {
            return app.NWRFmB.ins().getPayer.propSet.getValue(key)
        },

        /**
         * 转生等级
         * @returns
         */
        getCircleLv: function() {
            return app.NWRFmB.ins().getPayer.propSet.MzYki()
        },

        /**
         * 角色等级
         * @returns
         */
        getLv: function() {
            return app.NWRFmB.ins().getPayer.propSet.mBjV()
        },

        /**
         * 角色坐标
         * @returns
         */
        currentPosition: function() {
            let player = gameHelper.getPlayer();
            return { x: player.propSet.getX(), y: player.propSet.getY() }
        },

        /**
         * 多倍经验值
         * @returns
         */
        getmultipleExp: function() {
            return app.MathUtils.MakeLong64(gameHelper.appGetValue(app.nRDo.AP_MAX_EXP_L), gameHelper.appGetValue(app.nRDo.AP_MAX_EXP_H))
        },

        /**
         * 自动吃药
         * 药品使用有个冷却时间，这里默认延迟5s
         * @param {number} id - 物品ID
         * @param {number} count - 使用次数
         * @returns {Promise} 返回Promise用于处理完成后的操作
         */
        autoUseItem: function(id, count) {
            return new Promise((resolve) => {
                let usedCount = 0;
                const tmpTimer = setInterval(() => {
                    if (usedCount >= count) {
                        console.log(`自动使用${count}个${id}完成`);
                        clearInterval(tmpTimer);
                        resolve();
                        return;
                    }
                    gameHelper.useItem(id, 1);
                    usedCount++;
                }, 5000);
            });
        },

        /**
         * 使用物品
         * @param {number} id - 物品ID
         * @param {number} count - 使用次数
         * @returns {boolean} 返回是否使用成功
         */
        useItem: function(id, count) {
            let itemId = gameHelper.checkAndConvertToItemId(id);
            if(!itemId) {
                return false;
            }

            void 0 === count && (count = 1);
            //获取人物背包是否有物品
            const item = app.ThgMu.ins().getItemById(itemId);
            if (item) {
                // 使用物品，前提是 item 不等于空，使用数量小于 item 的 btCount，btCount 最大是一组物品的数量，不是背包的所有数量
                return app.pWFTj
                    .ins()
                    .useItem(
                        item.series,
                        itemId,
                        count === 1 || (count > 1 && count < item.btCount)
                            ? count
                            : item.btCount
                    );
            }
            return false;
        },

        /**
         * 添加指定类型的装备到自动回收列表中
         *
         * @param {int} typeId 回收类型
         * @param {int} itemlevel 回收物品等级
         * @param {string} itemName 装备名称
         */
        addToRecyclingList: function(typeId, itemlevel, itemName) {
            let recyCfg = app.VlaoF.RecyclingSettingConfig;
            // 如果没有指定levelId，则在所有装备中检索出装备的配置信息
            if (!itemlevel && itemName) {
                let hasFindItem = false;
                for (let i = 0; i < app.VlaoF.StdItems.length; i++) {
                    let item = app.VlaoF.StdItems[i];
                    if (item.name === itemName) {
                        hasFindItem = true;
                        if(item.hasOwnProperty("itemlevel")) {
                            itemlevel = item.itemlevel;
                            typeId = item.type;
                        }
                        break;
                    }
                }
                if (!hasFindItem) {
                    console.log("没有找到该装备");
                    return false;
                }
            }
            if(!itemlevel) {
                // 该装备不支持一键回收
                console.log("该装备不支持一键回收");
                return false;
            }
            // 查找最大的idx
            let maxIdx = 0;
            for (let i in recyCfg[typeId]) {
                let recyItem = recyCfg[typeId][i];
                if(recyItem.itemlevel == itemlevel) {
                    console.log('要添加的回收项目已经存在');
                    return recyItem;
                }
                if (recyItem.idx > maxIdx) {
                    maxIdx = recyItem.idx;
                }
            }
            maxIdx++;
            let item = {
                idx: maxIdx,
                id: typeId,
                tips: "一键回收" + itemName,
                Titletips: "一键回收" + itemName,
                value: 0,
                name: itemName,
                showQuality: 0,
                optionid: 32,
                itemlevel: itemlevel,
                title: "材料及药品",
                VipLV: 0,
            }
            app.VlaoF.RecyclingSettingConfig[typeId][maxIdx] = item;
            return item;
        },

        /**
         * 获取当前玩家信息
         *
         * @returns {Array}
         */
        getPlayer: function() {
            return app.NWRFmB.ins().getPayer;
        },

        /**
         * 获取商铺所有在售商品
         *
         * @returns {Array}
         */
        getAllShopItem: function(shopId)
        {
            //app.VlaoF.ShopConfig
            // 1为元宝商城，2为行会商城
            if(!shopId) {
                shopId = 1;
            }
            var shop = app.VlaoF.ShopConfig[shopId];
            for(var page in shop) {
                for(var item in shop[page]) {
                    let shopItem = shop[page][item]['shop'];
                    if(shopItem && shopItem.hasOwnProperty("id")) {
                        let itemId = shopItem['id'];
                        app.VlaoF.StdItems[itemId]['shopcfg'] = [page, item];
                    }
                }
            }
        },

        /**
         * 检查物品是否存在，如果不存在则转换为物品ID
         */
        checkAndConvertToItemId: function(item)
        {
            let itemId = 0;
            if(typeof item == 'number') {
                itemId = parseInt(item);
            } else {
                for(var stditem in app.VlaoF.StdItems) {
                    if(app.VlaoF.StdItems[stditem]['name'] == item) {
                        itemId = stditem;
                        break;
                    }
                }
            }
            if(itemId && !app.VlaoF.StdItems.hasOwnProperty(itemId)) {
                console.log('物品：' + item + '不存在');
                itemId = 0;
            }
            return parseInt(itemId);
        },

        /**
         * 购买物品
         */
        buyInShop: function(item, num)
        {
            let itemId = gameHelper.checkAndConvertToItemId(item);
            if(!itemId) return false;
            let itemName = app.VlaoF.StdItems[itemId]['name'];
            console.log('购买物品：' + itemName + '，数量：' + num);
            if(!app.VlaoF.StdItems[itemId]['shopcfg']) {
                gameHelper.getAllShopItem();
            }
            let shopCfg = app.VlaoF.StdItems[itemId]['shopcfg'];
            if(!shopCfg) return false;
            let [page, idx] = shopCfg;
            app.ShopMgr.ins().sendBuyShop(1, page, idx, app.ShopMgr.ins().npcCog, num);
        },

        /**
         * 解析洗炼属性
         *
         * @param {string} attr
         * @returns
         */
        parseRefineAttr: function(attr)
        {
            let currAttrs = {};
            let tmp = attr.split('|');
            for (let i = 0; i < tmp.length; i++) {
                // 将属性ID和属性值分离
                let [attrId, attrValue] = tmp[i].split(',');
                let attrName = '未知' + attrId;
                if(app.CrmPU.language_ATTROBJ.hasOwnProperty(attrId)) {
                    attrName = app.CrmPU.language_ATTROBJ[attrId];
                }
                // 将属性ID和属性值转换为数字类型
                currAttrs[attrId] = {attrName: attrName, attrId: parseInt(attrId), attrValue: parseInt(attrValue)};
            }
            return currAttrs;
        },

        /**
         * 检测洗炼属性
         */
        checkRefineAttr: function(currAttr, newAttr) {
            /**
             * 洗炼结果存放在 app.ForgeMgr.ins().refiningRuslt 中
             * 物品属性为使用|分隔的多组数据，每组数据格式为`a,b`，其中a为属性ID，b为属性值
             */
            // 解析洗炼结果
            let currAttrs = gameHelper.parseRefineAttr(currAttr);
            let newAttrs = gameHelper.parseRefineAttr(newAttr);
            // 要监控的属性ID，名称在 app.CrmPU.language_ATTROBJ 中
            let attrIds = [54, 136];
            console.log('原属性：', currAttrs, '新属性：', newAttrs);
            /**
             * TODO 此时系统并未替换，需要找到手动替换的注释方式，然后检查newAttrs中指定的attrId的值是否大于currAttrs中指定的attrId的值
             */
            try {
                for(let i in attrIds) {
                    let attrId = attrIds[i];
                    let currAttrValue = 0;
                    if(currAttrs.hasOwnProperty(attrId)) {
                        currAttrValue = currAttrs[attrId].attrValue;
                    }
                    if(newAttrs.hasOwnProperty(attrId) && newAttrs[attrId].attrValue >= currAttrValue) {
                        alert('洗炼成功，增加了' + (newAttrs[attrId].attrValue - currAttrValue) + '' + app.CrmPU.language_ATTROBJ[attrId]);
                    }
                }
            } catch(e) {
                console.log(e);
            }
        },

        /**
         * 检查掉落物数量
         *
         * @returns
         */
        checkDropCount: function() {
            const drops = app.NWRFmB.ins().dropList;
            let count = 0;
            for (var i in drops) {
                let item = drops[i];
                if(item.hasOwnProperty("nameTxt") && item.nameTxt['text'].indexOf("金牛") >= 0) {
                    count++;
                }
            }
            return count;
        },

        /**
         * 自动寻路
         *
         * @param {int} x
         * @param {int} y
         */
        pathFind: function(x, y) {
            var player = gameHelper.getPlayer();
            gameHelper.stopEdcwsp();
            player.pathFinding(x, y);
        },

        /**
         * 停止挂机
         */
        stopEdcwsp: function() {
            if (app.qTVCL.ins().isOpen) {
                app.qTVCL.ins().YFOmNj();
            }
        },

        /**
         * 检测并开启自动挂机
         */
        checkEdcwsp: function() {
            if(app.qTVCL.ins().isFinding) {
                stopWatchTimer();
                return false;
            }
            // 在不允许挂机的地图开启挂机功能
            app.GameMap.scenes.isHook = 1;
            if (!app.qTVCL.ins().isOpen) {
                app.qTVCL.ins().edcwsp();
                gameHelper.toast("开始挂机", "0x00ff60");
            }
        },

        /**
         * 检测怪物
         * @returns
         */
        checkMonster: function() {
            // 修复一下疗伤药回收的bug
            if(app.VlaoF.RecyclingSettingConfig[4].hasOwnProperty(401) && app.VlaoF.RecyclingSettingConfig[4][401]['itemlevel']!=401) {
                app.VlaoF.RecyclingSettingConfig[4][401]['itemlevel']=401;
            }
            if(gameHelper.getLv()<999) {
                // 检测一下5倍经验卷是否用完
                if(app.NWRFmB.ins().getPayer.propSet.getExpPower() < 40000) {
                    // 这玩意不用买，直接用
                    gameHelper.useItem("5倍挂机卷(大)", 1);
                }
                // 检测一下多倍经验瓶是否用完
                if (gameHelper.getmultipleExp() < 1000000) {
                    let itemId = gameHelper.checkAndConvertToItemId("多倍经验瓶");
                    if(itemId) {
                        let count = gameHelper.getBagItemNum("多倍经验瓶");
                        if(count<1000) {
                            // 先买100组，每组10个
                            gameHelper.buyInShop("多倍经验瓶", 100);
                        }
                        // 买完后等待2秒后使用
                        setTimeout(() => {
                            if(gameState.isInBlackWhite) {
                                gameHelper.useItem("多倍经验瓶", 200);
                            } else {
                                // 使用合成的方式使用药品，此方案是每次吃100个，需要吃10次
                                for(let i=0; i<10; i++) {
                                    app.ForgeMgr.ins().send_19_1(3402, 1)
                                }
                            }
                        }, 2000);
                    }
                }

            }
            // 检测一下活动
            if(app.OpenServerTreasureView.prototype.canLuckDraw()) {

            }
            let count = 0;
            const player = gameHelper.getPlayer();
            let mapId = app.GameMap.mapID;
            let mapName = app.GameMap.mapName;
            let mapCfg = {};
            if (mapCfgs.hasOwnProperty(mapId)) {
                mapCfg = mapCfgs[mapId];
            }
            let avoidMonsters = [];
            if (
                mapCfg.hasOwnProperty("avoidMonsters") &&
                !document.getElementById("dontCheckMonsters").checked
            ) {
                avoidMonsters = mapCfg["avoidMonsters"];
            }

            let hasBoss = false;
            const all = app.NWRFmB.ins().YUwhM();
            for (const a in all) {
                const monster = all[a];
                let monsterX = monster.propSet.propValueObj[1];
                let monsterY = monster.propSet.propValueObj[2];
                let monsterName = monster._charName;
                // 定义可见 app.ActorRace.Monster，0为玩家，1为怪物，2为NPC，等等
                if (monster.propSet.getRace() == 1) {
                    if (gameHelper.checkIsBoss(monsterName)) {
                        let monsterCfg = app.VlaoF.Monster[monster.propSet.getACTOR_ID()];
                        if (monsterCfg && 1 != monsterCfg.ascriptionopen) {
                            app.VlaoF.Monster[monster.propSet.getACTOR_ID()].ascriptionopen = 1;
                        }
                        hasBoss = true;
                        gameHelper.checkIsNewBoss(monsterX, monsterY, monsterName, mapId);
                    }
                    for (let i in avoidMonsters) {
                        if (monsterName.indexOf(avoidMonsters[i]) >= 0) {
                            let msg = `${mapName}的[${monsterX},${monsterY}]有"${monsterName}"，闪人！`;
                            gameHelper.redLog(msg);
                            gameHelper.toast(msg, "0xff0000");
                            gameHelper.fly();
                        }
                    }
                    count++;
                }
            }
            if (
                document.getElementById("onlyFindBoss").checked &&
                !hasBoss && !gameState.nearHasBossMonster
            ) {
                return 0;
            }
            return count;
        },

        /**
         * 是否新boss怪物(名称中有神话,BOSS,妖兽等字样)
         * @param {int} monsterX 怪物的x坐标
         * @param {int} monsterY 怪物的y坐标
         * @param {string} monsterName 怪物名称
         */
        checkIsNewBoss: function(monsterX, monsterY, monsterName, mapId) {
            const radius = 20;
            if (gameState.lastBoss.hasOwnProperty("monsterName")) {
                // 检查名称是否重复
                if (gameState.lastBoss.monsterName == monsterName) {
                    // 检查坐标是否有重叠
                    let xDec = Math.abs(monsterX - gameState.lastBoss.monsterX);
                    let yDec = Math.abs(monsterY - gameState.lastBoss.monsterY);
                    if (xDec < radius && yDec < radius) {
                        return false;
                    }
                }
            }
            // 更新lastBoss信息
            gameState.lastBoss = {
                monsterName: monsterName,
                monsterX: monsterX,
                monsterY: monsterY,
            };
            let xy = "地图：" + mapId;
            let mapCfg = {};
            if (mapCfgs.hasOwnProperty(mapId)) {
                mapCfg = mapCfgs[mapId];
                xy = mapCfg["name"];
            }
            xy += "(" + monsterX + "," + monsterY + ")发现" + monsterName;
            // 输出当前时间
            if(mapCfg.hasOwnProperty('notRecordBossInfo') && mapCfg['notRecordBossInfo']) {
                return true;
            }
            gameHelper.redLog("时间：" + new Date().toLocaleString() + "," + xy);
            let bossRecord = localStorage.getItem("boss");
            if (bossRecord) {
                bossRecord = JSON.parse(bossRecord);
            } else {
                bossRecord = {};
            }
            let record = [ monsterName,monsterX, monsterY, new Date().toLocaleString()];
            let tmp = new Array();
            if (bossRecord.hasOwnProperty(mapId)) {
                tmp = bossRecord[mapId];
            }
            if (tmp.length >= 24) {
                tmp.pop();
            }
            tmp.unshift(record);
            bossRecord[mapId] = tmp;
            localStorage.setItem("boss", JSON.stringify(bossRecord));

            return true;
        },

        /**
         * 自动飞
         * @param {*} player
         */
        autoFly: function(player) {
            if (gameHelper.checkMonster() > 0) return false;
            const count = player.propSet.getFlyshoes();
            if (count<10) gameHelper.useItem(307, 99);
            // 飞之前再检查一次周围的怪物
            if (gameHelper.checkMonster() < 1 && gameHelper.checkDropCount() < 1 && count > 0) {
                // gameHelper.toast(`周围没有怪了，开始飞，飞鞋点数剩余：${count - 1}`);
                gameHelper.fly();
            } else {
                // 买点吧
                gameHelper.buyInShop('飞鞋', 99);
                gameHelper.toast(`飞鞋点数不足，请补充飞鞋点数`, "0xff0000");
            }
        },

        /**
         * 检查用户坐标是否在指定位置
         *
         * @param {int} x
         * @param {int} y
         * @param {int} scope
         * @returns boolean
         */
        checkUserPosition: function(x, y, scope) {
            let player = gameHelper.getPlayer();
            // 目标点可能有人或者有怪，所以只能指定一个可能的范围，只要到达这个范围即算是成功到达
            let startX = x - scope;
            let endX = x + scope;
            let startY = y - scope;
            let endY = y + scope;
            if (
                player.lastX >= startX &&
                player.lastX <= endX &&
                player.lastY >= startY &&
                player.lastY <= endY
            ) {
                // 在坐标范围
                return true;
            }
            console.log(
                "用户当前坐标(" +
                player.lastX +
                "," +
                player.lastY +
                ")不在指定位置(" +
                x +
                "," +
                y +
                ")"
            );
            if (!app.qTVCL.ins().isFinding) {
                // 开启寻路
                gameHelper.pathFind(x, y);
            } else {
                if (app.qTVCL.ins().isOpen) {
                    // 可能在寻路的过程中用户强制开始挂机，这时就不需要再寻路了
                    return true;
                }
                gameHelper.toast("正在前往挂机点(" + x + "," + y + ")");
            }
            return false;
        },

        /**
         * 检查是否需要飞行
         *
         * @param {array} rectangle
         * @returns boolean
         */
        checkNeedFly: function(rectangle) {
            let player = gameHelper.getPlayer();
            // 当前地图ID
            let currentMapId = app.GameMap.mapID;
            let currentMapName = app.GameMap.mapName;
            if(!mapCfgs.hasOwnProperty(currentMapId)) {
                // 为什么会有这种情况？
                rectangle = false;
            }

            // 处理自动挂机相关逻辑
            if (gameHelper.handleAutoplay()) {
                return;
            }

            // 如果开启了寻找BOSS，就不检查危险区域
            if(!document.getElementById("onlyFindBoss").checked && rectangle && rectangle.isInside(player.lastX, player.lastY)) {
                gameHelper.toast(
                    `人[${player.lastX},${player.lastY}],在[${currentMapName}]危险区域，开飞`,
                    "0xff0000"
                );
                gameHelper.fly();
                return;
            }

            // 检查是否需要飞行
            if (
                gameHelper.checkMonster() < 1 &&
                gameHelper.checkDropCount() < 1 &&
                !(currentMapId == gameState.autoPlayMapId && gameState.autoPlayStatus)
            ) {
                gameHelper.autoFly(player);
            }
        },

        /**
         * 处理自动挂机相关逻辑
         *
         * @param {string} playerName - 玩家名
         * @param {number} currentMapId - 当前地图ID
         * @returns {boolean} - 是否处理了自动挂机逻辑
         */
        handleAutoplay: function() {
            // 处理自动挂机相关逻辑
            const apConfig = new AutoPlayHelper(gameState.autoPlayMapId);
            apConfig.readInputFieldsAndSaveConfig();

            // 处理进入挂机地图逻辑
            if (apConfig.shouldEnterAutoPlayMap()) {
                apConfig.enterAutoPlayMap();
                return true;
            }

            // 处理离开挂机地图逻辑
            if (apConfig.shouldLeaveAutoPlayMap()) {
                apConfig.leaveAutoPlayMap();
                return true;
            }

            return false;
        },

        /**
         * 检查是否在指定地图
         *
         * @param {int} id
         * @returns boolean
         */
        inMap: function(id) {
            if (id < 1) return true;
            return app.GameMap.mapID == id;
        },

        fly: function() {
            gameState.lastBoss = {};
            let mapCfg = {};
            let selectMapId = document.getElementById("map-select").value;
            if (mapCfgs.hasOwnProperty(selectMapId)) {
                mapCfg = mapCfgs[selectMapId];
            }
            if (gameHelper.inMap(selectMapId)) {
                if (mapCfg.hasOwnProperty("notFly")) {
                    return false;
                }
            }
            gameHelper.useMagic(58);
            gameState.flyCount++;
        },

        fire: function() {
            // 14：火墙，12：雷电
            app.EhSWiR.m_clickSkillId = 14;
        },

        flyToNewMap: function(user, mapCfg) {
            // 换地图了，清除lastBoss信息
            gameState.lastBoss = {};
            gameState.flyCount = 0;

            if (mapCfg.hasOwnProperty("flyId")) {
                app.PKRX.ins().send_1_7(user, mapCfg["flyId"]);
            } else if (mapCfg.hasOwnProperty("flyBossId")) {
                let mapId = mapCfg["flyBossId"];
                app.UyfaJ.ins().send_49_2(mapId[0], mapId[1]);
            }
        },

        toast: function(message, color = "0xff7700") {
            console.log(message);
            app.uMEZy.ins().IrCm(`|C:${color}&T:${message}|`);
        },

        redLog: function(message) {
            console.log(`%c${message}`, "color: red");
        },
    }
    window.gameHelper = gameHelper;

    // 定义一个矩形类
    class Rectangle {
        constructor(vertices) {
            __publicField(this, "vertices");
            this.vertices = vertices;
        }

        crossProduct(x, y, z) {
            return (
                (z[1] - y[1]) * (y[0] - x[0]) - (z[0] - y[0]) * (y[1] - x[1])
            );
        }

        isOnSameSide(p1, p2, a, b) {
            const cp1 = this.crossProduct(a, b, p1);
            const cp2 = this.crossProduct(a, b, p2);
            return cp1 * cp2 >= 0;
        }

        isInside(x, y) {
            const [A, B, C, D] = this.vertices;
            const p = [x, y];
            return (
                this.isOnSameSide(p, A, B, C) &&
                this.isOnSameSide(p, B, C, D) &&
                this.isOnSameSide(p, C, D, A) &&
                this.isOnSameSide(p, D, A, B)
            );
        }
    }

    /**
     * 配置管理助手类
     */
    class ConfigHelper {
        /**
         * @param {string} configKey - 配置键名
         * @param {object} defaultConfig - 默认配置
         */
        constructor(configKey, defaultConfig = {}) {
            this.player = gameHelper.getPlayer()._charName;
            this.configKey = configKey;
            this.defaultConfig = defaultConfig;
            this.fullConfig = this.loadFullConfig();
        }

        /**
         * 加载完整配置
         * @private
         * @returns {object} 完整配置对象
         */
        loadFullConfig() {
            let fullConfig = localStorage.getItem(this.player);
            if (fullConfig) {
                try {
                    fullConfig = JSON.parse(fullConfig);
                } catch (e) {
                    console.error('配置解析错误:', e);
                    fullConfig = {};
                }

                if (typeof fullConfig !== "object") {
                    fullConfig = {};
                }
            } else {
                fullConfig = {};
            }

            if (!fullConfig.hasOwnProperty(this.configKey)) {
                fullConfig[this.configKey] = this.defaultConfig;
            }

            return fullConfig;
        }

        /**
         * 保存完整配置
         * @private
         */
        saveFullConfig() {
            localStorage.setItem(this.player, JSON.stringify(this.fullConfig));
        }

        /**
         * 加载配置
         * @public
         * @returns {object} 配置对象
         */
        load() {
            let config = this.fullConfig[this.configKey];
            return this.ensureConfigComplete(config);
        }

        /**
         * 保存配置
         * @public
         * @param {object} config - 要保存的配置
         */
        save(config) {
            this.fullConfig[this.configKey] = config;
            this.saveFullConfig();
        }

        /**
         * 确保配置完整性
         * @private
         * @param {object} config - 当前配置
         * @returns {object} 完整的配置
         */
        ensureConfigComplete(config) {
            for (const key in this.defaultConfig) {
                if (!config.hasOwnProperty(key)) {
                    config[key] = this.defaultConfig[key];
                }
            }
            return config;
        }

        /**
         * 更新配置中的特定字段
         * @param {string} key - 配置键
         * @param {any} value - 配置值
         */
        updateField(key, value) {
            let config = this.load();
            config[key] = value;
            this.save(config);
        }

        /**
         * 获取配置中的特定字段
         * @param {string} key - 配置键
         * @returns {any} 配置值
         */
        getField(key) {
            let config = this.load();
            return config[key];
        }
    }

    // 自动挂机配置管理类
    class AutoPlayHelper {
        constructor(mapId, player) {
            this.mapId = mapId;
            this.mapCfg = {};
            if (mapCfgs.hasOwnProperty(this.mapId)) {
                this.mapCfg = mapCfgs[this.mapId];
            }

            // 使用 ConfigHelper 来管理配置
            this.configHelper = new ConfigHelper('autoplay', {
                [this.mapId]: this.getDefaultConfig()
            });

            this.config = this.loadConfig();
        }

        loadConfig() {
            let config = this.configHelper.load();
            if (!config[this.mapId]) {
                config[this.mapId] = this.getDefaultConfig();
            }

            this.updateInputFields(config[this.mapId]);
            return config;
        }

        saveConfig() {
            this.configHelper.save(this.config);
        }

        /**
         * 获取默认配置
         *
         * @returns
         */
        getDefaultConfig() {
            // 从地图配置中获取默认位置
            let defaultPosition = [0, 0];
            if (
                this.mapCfg.hasOwnProperty("autoPlayInitPosition") &&
                this.mapCfg.autoPlayInitPosition
            ) {
                const {
                    x,
                    y,
                    random = 0,
                } = this.mapCfg.autoPlayInitPosition;
                const rand = random
                    ? Math.floor(Math.random() * random)
                    : 0;
                defaultPosition = [x + rand, y - rand];
            }

            return {
                position: defaultPosition,
                enterTime: "<0",
                autoPlay: false,
                scope: this.mapCfg.autoPlayArea?.scope || 3,
            };
        }

        /**
         * 更新输入框的值
         *
         * @param {object} config
         * @returns
         */
        updateInputFields(config) {
            if(!gameState.isFirstRun) {
                return;
            }
            gameState.isFirstRun = false;
            // 更新输入框的值
            const positionInput = document.getElementById("position");
            const enterTimeInput = document.getElementById("enterTime");
            const autoPlayCheckbox = document.getElementById("autoplayenabled");
            positionInput.value = config.position.join(",");
            enterTimeInput.value = config.enterTime;
            if(config.autoPlay) {
                autoPlayCheckbox.checked = config.autoPlay;
            }
        }

        /**
         * 保存配置
         *
         * @returns
         */
        readInputFieldsAndSaveConfig() {
            let position = document.getElementById("position").value;
            if (position) {
                // 从输入框中获取坐标
                let [x, y] = position.split(",").map((v) => parseInt(v));
                this.config[this.mapId].position = [x, y];
                mapCfgs[this.mapId]["autoPlayArea"] = {x: x, y: y, scope: 3};
            }
            let enterTime = document.getElementById("enterTime").value;
            if (enterTime) {
                // 从输入框中获取时间
                this.config[this.mapId].enterTime = enterTime;
            }
            let autoPlay = document.getElementById("autoplayenabled").checked;
            // 从输入框中获取自动挂机
            this.config[this.mapId].autoPlay = autoPlay;
            this.saveConfig();
        }

        /**
         * 检查当前时间是否在指定范围内
         * @param {string} timeId - 时间输入框的ID
         * @returns {boolean} - 是否在指定时间范围内
         */
        checkTimeScope(timeId, minute = -1) {
            // 获取当前的分钟
            if (minute < 0) minute = new Date().getMinutes();
            let time = document.getElementById(timeId).value;
            localStorage.setItem(timeId, time);
            // 如果没有输入，直接返回true
            if (!time) return true;

            try {
                // 替换表达式中的比较符号，使其成为有效的JavaScript表达式
                let expression = time
                    .replace(/([<>]=?)\s*(\d+)/g, "minute $1 $2") // 处理 >30, <50 这样的表达式
                    .replace(/(\d+)\s*([<>]=?)/g, "$1 $2 minute") // 处理反向的表达式
                    .replace(/&&/g, "&&") // 保持 && 运算符
                    .replace(/\|\|/g, "||"); // 保持 || 运算符

                // 使用eval执行表达式（在这种特定场景下使用eval是安全的，因为输入已经被严格处理）
                return eval(expression);
            } catch (e) {
                console.error("时间表达式格式错误:", time);
                return false;
            }
        }

        /**
         * 是否可以进入挂机地图
         *
         * @returns
         */
        shouldEnterAutoPlayMap() {
            return (
                document.getElementById("autoplayenabled").checked &&
                this.checkTimeScope("enterTime") &&
                app.GameMap.mapID != this.mapId
            );
        }

        /**
         * 进入挂机地图
         */
        enterAutoPlayMap() {
            gameHelper.replaceEquip('金牛手镯[炎]');
            gameHelper.autoUseItem(1006, 5);
            gameHelper.autoUseItem(1007, 5);
            gameState.lastMapId = app.GameMap.mapID;
            document.getElementById("map-select").value = this.mapId;
        }

        /**
         * 是否可以离开挂机地图
         * @returns
         */
        shouldLeaveAutoPlayMap() {
            return (
                app.GameMap.mapID == this.mapId &&
                document.getElementById("autoplayenabled").checked &&
                gameHelper.checkMonster() < 1 &&
                gameHelper.checkDropCount() < 1 &&
                !this.checkTimeScope("enterTime")
            );
        }

        /**
         * 离开挂机地图
         */
        leaveAutoPlayMap() {
            gameHelper.replaceEquip('大地之春');
            if (!mapCfgs.hasOwnProperty(gameState.lastMapId)) {
                gameState.lastMapId = 148;
            }
            gameHelper.toast("搞定，回" + mapCfgs[gameState.lastMapId]["name"]);
            document.getElementById("map-select").value = gameState.lastMapId;
        }
    }

    // 定义一个公共字段的函数
    var __defProp = Object.defineProperty;
    var __defNormalProp = (obj, key, value) =>
        key in obj
            ? __defProp(obj, key, {
                enumerable: true,
                configurable: true,
                writable: true,
                value,
            })
            : (obj[key] = value);
    var __publicField = (obj, key, value) =>
        __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

    class Icons {}

    __publicField(
        Icons,
        "startIcon",
        '<svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"><path d="M823.8 603.5l-501.2 336c-50.7 34-119.3 20.4-153.2-30.2-12.2-18.2-18.7-39.6-18.7-61.5v-672c0-61 49.5-110.4 110.4-110.4 21.9 0 43.3 6.5 61.5 18.7l501.1 336c50.7 34 64.2 102.6 30.2 153.2-7.8 11.9-18.1 22.2-30.1 30.2z m0 0"></path></svg>'
    );
    __publicField(
        Icons,
        "stopIcon",
        '<svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M941.967463 109.714286v804.571428q0 14.857143-10.857143 25.714286t-25.714286 10.857143H100.824606q-14.857143 0-25.714286-10.857143t-10.857143-25.714286V109.714286q0-14.857143 10.857143-25.714286t25.714286-10.857143h804.571428q14.857143 0 25.714286 10.857143t10.857143 25.714286z"></path></svg>'
    );

    function createControlPanel(clicked) {
        const controlPanel = document.createElement("div");
        controlPanel.id = "control-panel";
        controlPanel.className = "control-panel";
        const mapOptions = Object.entries(mapCfgs)
            .map(([key, cfg]) => `<option value="${key}">${cfg.name}</option>`)
            .join("");
        controlPanel.innerHTML = `
        <div style="background: rgba(0,0,0, .5);color: #fff;" id="autoplaydiv">
      <div>不避怪<input id="dontCheckMonsters" type="checkbox" title="不避怪" value="1"><label for="dontCheckMonsters" class="icon-label"></label></div>
      <div>尽量找Boss<input id="onlyFindBoss" type="checkbox" title="只找Boss" value="1"><label for="onlyFindBoss" class="icon-label"></label></div>
      <div>坐标：<input type="text" class="text" id="position" title="自动挂机的坐标点" placeholder="41,30" style="width: 80px;background: #000;color:#fff;" value=""></div>
      <div>进入：<input type="text" class="text" id="enterTime" title="进入时间" placeholder="00 00" style="width: 80px;background: #000;color:#fff;" value=""></div>
      </div>
      <div class="control-group" id="autoplaycp">
      <button id="toggle" class="button" title="点击开始自动释放火墙">${Icons.startIcon}</button>
      <select id="map-select" class="select" title="选择地图">${mapOptions}</select>
      <div><input type="checkbox" id="autoplayenabled" title="自动挂机" value="1"><label for="autoplayenabled" class="icon-label"></label></div>
      <button id="random" class="button">${Icons.startIcon}</button>
  </div>`;
        // 添加复选框状态变化事件处理
        const checkboxes = controlPanel.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling;
            label.style.backgroundColor = checkbox.checked? buttonColor : buttonColor2;
            label.innerHTML = checkbox.checked? Icons.stopIcon : Icons.startIcon;
            checkbox.addEventListener('change', function() {
                label.style.backgroundColor = this.checked? buttonColor : buttonColor2;
                label.innerHTML = this.checked ? Icons.stopIcon : Icons.startIcon;
                let player = gameHelper.getPlayer();
                if(player && player.hasOwnProperty("_charName")) {
                    const apConfig = new AutoPlayHelper(gameState.autoPlayMapId);
                    apConfig.readInputFieldsAndSaveConfig();
                }
            });
        });
        const btns = Array.from(controlPanel.querySelectorAll("button"));
        for (const btn of btns) {
            btn.addEventListener("click", () => {
                clicked(btn);
            });
        }
        return controlPanel;
    }

    /**
     * 切换按钮状态
     *
     * @param {object} btn
     * @param {string} color
     * @param {string} icon
     * @returns
     */
    function toggleBtnStatus(btn, color, icon) {
        btn.style.backgroundColor = color;
        btn.innerHTML = icon;
    }

    /**
     * 停止挂机
     */
    function stopWatchTimer() {
        let btn = document.getElementById("random");
        if (gameState.watchTimer) {
            clearInterval(gameState.watchTimer);
        }
        gameState.watchTimer = void 0;
        toggleBtnStatus(btn, buttonColor2, Icons.startIcon);
        gameHelper.stopEdcwsp();
    }

    /**
     * 开始挂机
     *
     * @param {object} mapCfg
     * @returns
     */
    function startWatchTimer(mapCfg, btn) {
        // 自动回收这个只需要执行一次
        if (gameState.isInBlackWhite) {
            gameHelper.addToRecyclingList(1,114,'王者套装')
            gameHelper.addToRecyclingList(1,118,'天龙套装')
        }
        gameHelper.addToRecyclingList(4,82,'炼狱材料')
        if(app.qTVCL.ins().isFinding) {
            gameHelper.toast("正在寻路中，不允许开启自动挂机！");
            stopWatchTimer();
            return false;
        }
        if (!mapCfg || mapCfg.length < 1) {
            gameHelper.toast("暂不支持指定地图挂机");
            return false;
        }
        gameHelper.toast("4秒后开始挂机，请不要有任何操作");
        const player = gameHelper.getPlayer();
        gameState.watchTimer = setInterval(() => {
            gameHelper.updateDocumentTitle();
            let currentMapId = app.GameMap.mapID;
            let mapCfg = {};
            let selectMapId = document.getElementById("map-select").value;
            if (mapCfgs.hasOwnProperty(selectMapId)) {
                mapCfg = mapCfgs[selectMapId];
            } else {
                return false;
            }
            if(app.qTVCL.ins().isFinding) {
                gameHelper.toast("正在寻路中，不允许开启自动挂机！");
                return false;
            }
            if (gameHelper.inMap(selectMapId)) {
                if (mapCfg.hasOwnProperty("dontautoplay")) {
                    gameHelper.toast("该地图不允许自动挂机");
                    return false;
                }
                if (
                    mapCfg.hasOwnProperty("autoPlayArea") &&
                    !gameState.isFindedPath
                ) {
                    const tt = setInterval(() => {
                        if (
                            gameHelper.checkUserPosition(
                                mapCfg.autoPlayArea.x,
                                mapCfg.autoPlayArea.y,
                                mapCfg.autoPlayArea.scope
                            )
                        ) {
                            gameState.isFindedPath = true;
                            clearInterval(tt);
                        }
                    }, 1e3);
                }
                gameHelper.checkEdcwsp();
                let rectangle = false;
                if (mapCfg.hasOwnProperty("dangerArea")) {
                    rectangle = new Rectangle(mapCfg["dangerArea"]);
                }
                gameHelper.checkNeedFly(rectangle);
            } else {
                gameState.isFindedPath = false;
                gameHelper.toast("不在`" + mapCfg.name + "`，开始传送");
                gameHelper.flyToNewMap(player.recog, mapCfg);
                if (mapCfg.hasOwnProperty("dontautoplay")) {
                    stopWatchTimer();
                    return false;
                }
                const tt = setInterval(() => {
                    if (gameHelper.inMap(selectMapId)) {
                        gameHelper.checkEdcwsp();
                        clearInterval(tt);
                    }
                }, 2e3);
            }
        }, 4e3);
        toggleBtnStatus(btn, buttonColor, Icons.stopIcon);
    }

    window.addEventListener("load", () => {

        /**
         * 对原app功能进行hook
         */
        function hackApp() {
            alert("开始注入对app的功能修改");

            // 盒子批量兑换功能
            app.CommonGiftSelectWin.prototype.onClick = function (e) {
                switch (e.currentTarget) {
                    case this.rect:
                        app.mAYZL.ins().close(this);
                        break;
                    case this.receiveBtn:
                        console.log(this.userItemInfo.series);
                        console.log(this.curItemData.index);
                        if (!this.curItemData) return void app.uMEZy.ins().IrCm(app.CrmPU.language_Tips73);
                        if (!this.userItemInfo || !this.userItemInfo.series) {
                            return void app.uMEZy.ins().IrCm(app.CrmPU.language_Tips73);
                        }
                        // 背包最低空闲数量
                        var i = app.VlaoF.BagRemainConfig[10];
                        if (i) {
                            let usedCount = 0;
                            let count = 10;
                            // 如果当前页面有batch_count输入框，且输入的数量大于0，则使用输入的数量
                            const batchCountInput = document.getElementById("batch_count");
                            if (batchCountInput && batchCountInput.value > 0) {
                                count = parseInt(batchCountInput.value);
                            }
                            // 每隔50毫秒执行一次兑换操作
                            let tmpTimer = setInterval(() => {
                                if (usedCount >= count) {
                                    clearInterval(tmpTimer);
                                    return;
                                }
                                usedCount++;
                                // 检查背包是否已满
                                var n = app.ThgMu.ins().getBagCapacity(i.bagremain);
                                // 背包未满，则执行兑换操作；背包已满，则弹出提示并停止兑换。
                                if (n) {
                                    app.ThgMu.ins().send_8_8(this.userItemInfo.series, !0, this.curItemData.index);
                                } else {
                                    app.uMEZy.ins().IrCm(i.bagtips);
                                    clearInterval(tmpTimer);
                                    return;
                                }
                            }, 50);
                        }
                }
            }

            /**
             * 修复藏经阁的抽奖次数是当前最大可抽奖次数
             *
             * @param {object} t
             * @returns
             */
            app.OpenServerTreasureView.prototype.onClick = function (t) {
                switch (t.currentTarget) {
                    case this.receiveBtn:
                        this.onLuckDraw();
                        break;
                    case this.receiveBtn2:
                        var maxTimes = this.curDayMoney.Maxcount - this.chouNumber;
                        this.onLuckDraws(maxTimes);
                }
            };

            app.ForgeRefiningView.prototype.updatexxxxx = function(){
                var e = app.ForgeMgr.ins().refiningRuslt;
                console.log('update: 原属性：' + e.currAttr + '，新属性：' + e.newAttr);
                if (0 == e.errcode) {
                  (this.lbFail.visible = !1), this.refiningBind(e.currAttr);
                  var i = this.tabEq.selectedItem.item,
                    n = app.VlaoF.RefiningmaterialsConfig[i.wItemId],
                    s = this.refiningmaterialsGetData(n.consume);
                  this.costGoods.replaceAll(s),
                    e.replace
                      ? ((this.lbReplaceState.visible = !0), (this.btnReplace.visible = !1), this.refiningNewAttrBind(e.currAttr, e.currAttr))
                      : e.newAttr
                      ? ((i.refining = e.newAttr),
                        (this.lbFail.visible = !1),
                        (this.lbReplaceState.visible = !1),
                        (this.btnReplace.visible = !0),
                        this.refiningNewAttrBind(e.currAttr, e.newAttr),
                        app.uMEZy.ins().IrCm(app.CrmPU.language_Refining_Text6))
                      : ((this.lbFail.visible = !0), (this.lbReplaceState.visible = !1), (this.btnReplace.visible = !1), this.newAttrArr.removeAll(), app.uMEZy.ins().IrCm(app.CrmPU.language_Refining_Text5));
                }

            }

            /**
             * 圣物洗炼结果监控
             *
             * @param {object} e
             * @returns
             */
            app.SoldierSoulMgr.prototype.post_58_3 = function (e) {
                var i = e.readByte(),
                  n = (e.readByte(), e.readByte()),
                  replace = e.readByte(),
                  currAttr = e.readString(),
                  newAttr = e.readString();
                if (9 == i) {
                  var o = app.VlaoF.soulWpRefiningConfig[n];
                  o && o.limitMsg && app.uMEZy.ins().IrCm("|C:0xff7700&T:" + o.limitMsg + "|");
                }
                if(replace == 0) {
                    gameHelper.checkRefineAttr(currAttr, newAttr);
                }
                return {
                  errcode: i,
                  weaponID: n,
                  currAttr: currAttr,
                  newAttr: newAttr,
                  replace: replace,
                };
              }

            /**
             * 对装备洗炼结果的监控处理
             *
             * @param {object} t
             * @returns
             */
            app.ForgeMgr.prototype.post_19_4 = function (t) {
                var errcode = t.readByte(),
                    goodId = t.readNumber(),
                    replace = t.readByte(),
                    currAttr = t.readString(),
                    newAttr = t.readString();

                if(replace == 0) {
                    gameHelper.checkRefineAttr(currAttr, newAttr);
                }
                this.refiningRuslt = {
                    // 错误码，0 成功，1 失败
                    errcode: errcode,
                    // 物品ID
                    goodId: goodId,
                    // 物品原属性
                    currAttr: currAttr,
                    // 物品新属性
                    newAttr: newAttr,
                    // 是否替换
                    replace: replace,
                };
            }

            /**
             * 移除一些不需要的控制台输出
             *
             * @param {object} t
             * @returns
             */
            app.MainBottomNotice.prototype.Addnotice=function (t) {
                var e = t[1],
                  i = t[0];
                // console.log(e + " - " + i);
                1 == e
                  ? (this.noticeAry1.push(i), this.payNotice1())
                  : 2 == e
                  ? (this.noticeAry2.push(i), this.payNotice2())
                  : -1 == i.indexOf("银两") && (this.noticeAry.push(i), this.isShowNotice || this.payNotice());
            }

            /**
             * 修复拾取宠物的范围
             *
             * @returns
             */
            app.PlayerRole.prototype.pickUpPetRange = function () {
                var a = app.NWRFmB.ins().getPayer.propSet.getPickUpPet();
                var i = app.VlaoF.lootPetConfig;
                for (var n in i) for (var s in i[n]) if (+s == a) return (i[n][s].nDropPetLootDistance);
                return 0;
            };

            /**
             * 注入对周围怪物的检测
             *
             * @returns
             */
            app.qTVCL.ins().getNearestMonster_magicBOSS = function () {
                let checkNames = ["[神话]", "BOSS", "妖兽"];
                var e,
                    monster,
                    monsterName,
                    n,
                    s = app.NWRFmB.ins().YUwhM(),
                    a = app.NWRFmB.ins().getPayer,
                    r = Number.MAX_VALUE;
                gameState.nearHasBossMonster = false;
                for (var o in s) {
                    e = s[o];
                    monster = app.VlaoF.Monster[e.propSet.getACTOR_ID()];
                    if (!monster) continue;
                    monsterName = monster.name;
                    if (1 != monster.ascriptionopen) {
                        for (let i in checkNames) {
                            if (monsterName.indexOf(checkNames[i]) >= 0) {
                                app.VlaoF.Monster[e.propSet.getACTOR_ID()].ascriptionopen = 1;
                                monster.ascriptionopen = 1;
                                break;
                            }
                        }
                    }
                    var l = this.isRange(a.currentX, a.currentY, e.currentX, e.currentY);
                    if (l && e.propSet.getRace() == app.ActorRace.Monster && 1 == monster.ascriptionopen) {
                        let str = "  时间：" + new Date().toLocaleString() + "," + e.currentX + "," + e.currentY + "," + monsterName;
                        gameHelper.redLog(str);
                        gameState.nearHasBossMonster = true;
                        var h = app.MathUtils.getDistanceByObject(a, e);
                        r > h && ((r = h), (n = o));
                    }
                }
                return n;
            };
            // 注册一个定时器，每秒执行一次 app.qTVCL.ins().getNearestMonster_magicBOSS
            gameState.watchTimer = setInterval(() => {
                app.qTVCL.ins().getNearestMonster_magicBOSS();
            }, 1000);
            egret.log=function(){return false;}
            /**
             * 服务器连接后的操作
             */
            app.ubnV.ins().KLsbd = function () {
                var i = new app.xAFLf();
                this.socket_.readBytes(i),
                    (i.position = 0),
                    (this._salt = i.readUnsignedShort()),
                    this.updateStatus(3);

                // 上面的代码不要动！！！！
                if (gameState.isFirstConnected) {
                    // 网页首次打开时连接上服务器后，执行下面的代码
                    gameState.isFirstConnected = false;
                } else {
                    // 计算进出挂机地图的时间范围，最多呆10分钟
                    let minute = new Date().getMinutes();
                    // 如果当前分钟小于2分钟或者大于50，则设置去处符为`||`否则设为`&&
                    let logicType = "&&";
                    if (minute < 1 || minute > 49) {
                        logicType = "||";
                    }
                    let minMinute = minute - 2;
                    if (minMinute < 0) minMinute += 60;
                    let maxMinute = minute + 10;
                    if (maxMinute >= 60) maxMinute -= 60;
                    let timeStr = `>${minMinute} ${logicType} <${maxMinute}`;
                    // document.getElementById("enterTime").value = timeStr;
                    let lastReboot = localStorage.getItem("lastReboot");
                    if (!lastReboot) {
                        lastReboot = [];
                    } else {
                        try {
                            lastReboot = JSON.parse(lastReboot);
                        } catch (error) {
                            lastReboot = [];
                        }
                    }
                    if (lastReboot.length > 10) {
                        lastReboot.shift();
                    }
                    lastReboot.push(new Date().toLocaleString());
                    localStorage.setItem("lastReboot", JSON.stringify(lastReboot));
                    console.log(
                        new Date().toLocaleString() +
                        "又TMD被人搞崩，还好又连上了"
                    );
                }
            };
        };
        const waitForAppLoaed = setInterval(() => {
            if (typeof egret !== "undefined" &&
                typeof app !== "undefined" &&
                app.hasOwnProperty("MainBottomNotice") &&
                app.hasOwnProperty("ubnV") &&
                app.hasOwnProperty("qTVCL") &&
                app.hasOwnProperty("PlayerRole") &&
                app.hasOwnProperty("MainBottomNotice") &&
                app.hasOwnProperty("VlaoF")
            ) {
                clearInterval(waitForAppLoaed);
                // 10秒后执行
                setTimeout(() => {
                    hackApp();
                }, 10000);
            }
        }, 100);

        const panel = createControlPanel((btn) => {
            const id = btn.getAttribute("id");
            let mapCfg = {};
            let selectMapId = document.getElementById("map-select").value;
            if (mapCfgs.hasOwnProperty(selectMapId)) {
                mapCfg = mapCfgs[selectMapId];
            }
            let player = gameHelper.getPlayer();
            if (!player || !player.hasOwnProperty("_charName")) {
                alert("请先进入游戏");
                return false;
            }
            gameHelper.updateDocumentTitle();
            switch (id) {
                case "toggle":
                    if (gameState.fireTimer) {
                        clearInterval(gameState.fireTimer);
                        gameState.fireTimer = void 0;
                        toggleBtnStatus(btn, buttonColor2, Icons.startIcon);
                    } else {
                        gameHelper.fire();
                        gameState.fireTimer = setInterval(() => {
                            gameHelper.fire();
                        }, 9e3);
                        toggleBtnStatus(btn, buttonColor, Icons.stopIcon);
                    }
                    break;
                case "random":
                    if (gameState.watchTimer) {
                        stopWatchTimer();
                    } else {
                        startWatchTimer(mapCfg, btn);
                    }
                    break;
            }
        });
        document.body.appendChild(panel);
        document.getElementById("autoplaycp").onmouseover = function() {if (!gameState.watchTimer) return false;let autoplayObj = document.getElementById("autoplaydiv");autoplayObj.style.display = "block";};
        setInterval(() => {
            document.getElementById("mainDiv").onmouseover = function() {let autoplayObj = document.getElementById("autoplaydiv");autoplayObj.style.display = "none";};
        }, 9e3);
    });
})();
