// ==UserScript==
// @name         HB商店显示已购买选项
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       jklujklu
// @icon         https://humblebundle-a.akamaihd.net/static/hashed/46cf2ed85a0641bfdc052121786440c70da77d75.png
// @include      https://www.humblebundle.com/store*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/431393/HB%E5%95%86%E5%BA%97%E6%98%BE%E7%A4%BA%E5%B7%B2%E8%B4%AD%E4%B9%B0%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/431393/HB%E5%95%86%E5%BA%97%E6%98%BE%E7%A4%BA%E5%B7%B2%E8%B4%AD%E4%B9%B0%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';


    const API = 'https://www.humblebundle.com/api/v1/order/';

    // 创建HTML并插入DOM
    const wrap = document.createElement("div");
    wrap.id = 'app-1'
    wrap.innerHTML = `
            <el-drawer
              title="已购买游戏"
              :visible.sync="table"
              direction="rtl"
              size="80%">
               <el-table :data="gridData" border stripe :default-sort = "{prop: 'time', order: 'descending'}">
                    <el-table-column property="name" label="游戏名"></el-table-column>
                    <el-table-column property="isExpired" label="是否过期">
                        <template slot-scope="scope">
                            <i :class="scope.row.isExpired ? 'el-icon-check':'el-icon-close'"></i>
                        </template>
                    </el-table-column>
                    <el-table-column property="isGift" label="是否为礼物">
                        <template slot-scope="scope">
                            <i :class="scope.row.isGift ? 'el-icon-check':'el-icon-close'"></i>
                        </template>
                    </el-table-column>
                    <el-table-column property="key" label="CDKEY" v-if="storeKey"></el-table-column>
                    <el-table-column property="keyType" label="游戏平台"></el-table-column>
                    <el-table-column property="spent" label="下单价格" sortable></el-table-column>
                    <el-table-column property="time" label="下单时间" sortable></el-table-column>
                    </el-table>
            </el-drawer>
            <el-card class="box-card" v-show="loading" style="width: 50%; height: 150px; z-index: 999; top: 0; right: 0; bottom: 0; left: 0; position: fixed; margin: auto;">
                <el-progress :text-inside="true" :stroke-width="24" :percentage="Math.round(currentOrder / orderCounts * 100)" status="success"></el-progress>
                <div style="margin: 10px;text-align: center">共获取{{orderCounts}}订单，正在获取第{{currentOrder}}个订单</div>
                <div style="margin: 10px;text-align: center">成功{{successOrderCount}}订单，失败{{errorOrderCount}}订单</div>
            </el-card>`

    const first = document.body.firstChild;//得到页面的第一个元素
    document.body.insertBefore(wrap, first);

    /**
     * 加载CSS
     * @param url
     */
    function loadStyle(url) {
        const link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        const head = document.getElementsByTagName('head')[0];
        head.appendChild(link);
    }

    /**
     * 加载JS
     * @param url
     * @param callback
     */
    function loadScript(url, callback) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        if (typeof (callback) != "undefined") {
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload = function () {
                    callback();
                };
            }
        }
        script.src = url;
        document.body.appendChild(script);
    }

    /**
     * 主程序
     */
    function start() {
        new Vue({
            el: '#app-1',
            data() {
                return {
                    loading: false,
                    table: false,
                    gridData: [],
                    allGame: {},
                    storeKey: true,
                    duration: 300,
                    currentOrder: 0,
                    orderCounts: 1,
                    successOrderCount: 0,
                    errorOrderCount: 0
                }
            },
            methods: {
                getOrders() {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: 'https://www.humblebundle.com/home/purchases?hmb_source=navbar',
                            success: rs => {
                                const doc = new DOMParser().parseFromString(rs, 'text/html');
                                const data = doc.querySelector('#user-home-json-data').innerText;
                                console.log(data);
                                resolve(JSON.parse(data));
                            },
                            error: e => {
                                reject(e);
                            }
                        })
                    })
                },
                getGameInfo(gameId) {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: API + gameId,
                            type: 'GET',
                            data: {all_tpkds: true},
                            success: rs => {
                                // console.log(rs);
                                resolve(rs);
                            },
                            error: e => {
                                reject(gameId);
                            }
                        })
                    })
                },
                sleep(time) {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve('ok');
                        }, time)
                    })
                },
                markGame() {
                    document.querySelectorAll('.entity-title').forEach(item => {
                        let name = item.innerText;
                        if (item.getAttribute('title')) {
                            name = item.getAttribute('title').toLowerCase();
                        }
                        if (Object.prototype.hasOwnProperty.call(this.allGame, `game_${name}`.toLowerCase())) {
                            // console.log('发现已购买过的游戏：', name);
                            item.style.background = 'green';
                            item.style.color = 'white';
                        }
                    })
                },
                watchHTML() {
                    const target = document.querySelector('body');

                    console.log(this.allGame);

                    const observer = new MutationObserver((mutations) => {
                        console.log('html change!');
                        this.markGame();
                    });

                    const config = {childList: true, subtree: true};

                    observer.observe(target, config);

                    // observer.disconnect();
                }
            },
            mounted() {
                this.allGame = GM_getValue("allGames");
                this.storeKey = GM_getValue("storeKey");
                GM_registerMenuCommand("更新已购买游戏", async () => {

                    // 选择是否存储KEY
                    await this.$confirm('是否需要存储KEY？', '确认信息', {
                        confirmButtonText: '存储',
                        cancelButtonText: '不存储'
                    }).then(() => {
                        console.log('store key: yes');
                        this.storeKey = true;
                    }).catch(action => {
                        console.log('store key: no');
                        this.storeKey = false;
                    });
                    GM_setValue("storeKey", this.storeKey);
                    console.log(`store key: ok, your choice is ${this.storeKey}`);
                    this.$message({
                        type: 'info',
                        message: `你的选择是${this.storeKey ? '' : '不'}存储Key`
                    });

                    // 获取订单信息
                    const orders = await this.getOrders().catch(err => {
                        this.$message.error('所有订单获取失败，请检查账号是否登陆！');
                        return
                    })
                    if (orders) {
                        const country = orders['userOptions']['selectedCountry'];
                        // this.$message(`你的账号区域为：${country}`);
                        const games = orders['gamekeys'];
                        console.log(`订单获取成功，共获得共获取${games.length}个订单！`)
                        this.$message({
                            message: `获取订单成功，共获取${games.length}个订单！`,
                            type: 'success'
                        });

                        // 遍历每个订单，获取游戏信息
                        this.loading = true;
                        this.orderCounts = games.length;
                        let allGames = {}
                        for (let i = 0; i < games.length; i++) {
                            let game = games[i];
                            const rs = await this.getGameInfo(game).catch(err => {
                                this.$message.error(`订单获取失败！`)
                                return
                            });
                            // 判断请求是否成功
                            if (rs) {
                                // 判断响应是否有效
                                try {
                                    this.successOrderCount++;
                                    const spent = rs['amount_spent'] + rs['currency'];
                                    const time = rs['created'];
                                    const type = rs['product']['category'];
                                    if (type === 'storefront') {
                                        const name = rs['tpkd_dict']['all_tpks'][0]['human_name'].toLowerCase();
                                        const isExpired = rs['tpkd_dict']['all_tpks'][0]['is_expired']
                                        const isGift = rs['tpkd_dict']['all_tpks'][0]['is_gift']
                                        const keyType = rs['tpkd_dict']['all_tpks'][0]['key_type_human_name']
                                        let key = '';
                                        if (this.storeKey) {
                                            key = rs['tpkd_dict']['all_tpks'][0]['redeemed_key_val']
                                        }
                                        console.log(`${game}信息获取成功，游戏为：${name}`)
                                        allGames['game_' + name] = {isExpired, isGift, keyType, key, spent, time};
                                    } else {
                                        console.warn(`${game}, type: ${type}, continue!`);
                                    }
                                } catch (e) {
                                    this.errorOrderCount++;
                                    console.error(`响应无效，${game}信息获取失败！`);
                                }
                            } else {
                                this.errorOrderCount++;
                                console.error(`请求失败，${game}信息获取失败！`);
                            }
                            this.currentOrder = i + 1;
                            await this.sleep(this.duration);
                        }
                        this.loading = false;
                        console.log('allGame:', allGames);
                        this.$message({
                            message: `共获取${Object.keys(allGames).length}个商店类型游戏！`,
                            type: 'success'
                        });
                        GM_setValue("allGames", allGames);
                    } else {
                        console.error(`获取所有订单失败！`)
                    }
                }, "H");

                GM_registerMenuCommand("显示所有已购买的商店游戏", () => {
                    this.gridData = [];
                    const games = GM_getValue("allGames");
                    if (!games) {
                        this.$message.error('请先点击上方按钮，更新游戏库存！');
                        return;
                    }
                    this.allGame = games;
                    console.log(games);
                    Object.keys(games).forEach(item => {
                        this.gridData.push({
                            name: item.substr(5),
                            isExpired: games[item].isExpired,
                            isGift: games[item].isGift,
                            key: games[item].key,
                            keyType: games[item].keyType,
                            time: games[item].time,
                            spent: games[item].spent,
                        })
                    })
                    console.log(this.gridData);
                    this.table = true;
                }, "S");

                console.log('allGame', this.allGame);

                if (this.allGame) {
                    this.markGame();

                    this.watchHTML();
                }
            }
        })
    }

    let vueLoaded = false;
    loadStyle('https://unpkg.com/element-ui/lib/theme-chalk/index.css');
    loadScript('https://unpkg.com/vue/dist/vue.js', () => {
        vueLoaded = true
    });
    loadScript('https://unpkg.com/element-ui/lib/index.js', () => {
        const timer = setInterval(() => {
            if (vueLoaded) {
                clearInterval(timer);
                start();
            }
        }, 200)
    });


})();
