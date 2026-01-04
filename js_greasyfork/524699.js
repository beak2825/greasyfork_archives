// ==UserScript==
// @name         传奇挂机
// @namespace    http://ifool.com
// @version      1.6.3
// @description  传奇自动挂机
// @author       ifool
// @match        https://cq.kubbo.cn/play?*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524699/%E4%BC%A0%E5%A5%87%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/524699/%E4%BC%A0%E5%A5%87%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function () {
    // 动态加载 CSS 和 JS 资源的函数
    const loadResource = (type, url) => {
        return new Promise((resolve, reject) => {
            let element;
            if (type === 'css') {
                element = document.createElement('link');
                element.setAttribute('rel', 'stylesheet');
                element.href = url;
            } else if (type === 'js') {
                element = document.createElement('script');
                element.setAttribute('type', 'text/javascript');
                element.src = url;
            } else {
                reject(`Unknown resource type: ${type}`);
                return;
            }

            element.onload = resolve;
            element.onerror = (e) => reject(`Failed to load ${type} from ${url}: ${e}`);
            document.documentElement.appendChild(element);
        });
    };

    const xys = {
        a: [{
            "x": 76,
            "y": 19
        }],
        b: [{
            "x": 24,
            "y": 53
        }],
        c: [{
            "x": 130,
            "y": 60
        }],
        d: [{
            "x": 78,
            "y": 94
        }]
    }

    // 加载 Vue 和 Element UI 资源
    Promise.all([
        loadResource('js', 'https://cdn.jsdelivr.net/npm/vue@2'),
        loadResource('css', 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'),
        loadResource('js', 'https://unpkg.com/element-ui/lib/index.js')
    ])
        .then(() => {
            // 在 Vue 和 Element UI 加载完之后运行
            const appHtml = `
            <div id="cqApp" style="position: absolute; bottom: 1vh; left: 1vh">
                <div style="padding: 10px">
                    <div>
                        <el-checkbox style="color: #fff;" v-model="attachBossOnly" @change="handleAttachBossOnlyChange" label="只打boss"></el-checkbox>
                    </div>
                    <div>
                        <el-checkbox style="color: #fff;" v-model="autoFire" @change="handleAutoFireChange" label="自动火墙"></el-checkbox>
                    </div>
                    <div>
                        <el-checkbox style="color: #fff;" v-model="autoCy" @change="handleAutoCyChange" label="自动打boss吃药"></el-checkbox>
                    </div>
                    <div>
                        <el-checkbox style="color: #fff;" v-model="autoExp" @change="handleAutoExpChange" label="自动五倍经验"></el-checkbox>
                    </div>
                </div>
                <el-cascader
                    placeholder="挂机位置"
                    v-model="selectMapValue"
                    :options="mapOptions"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChange">
                </el-cascader>
            </div>
        `;

            const appContainer = document.createElement('div');
            appContainer.innerHTML = appHtml;
            document.body.appendChild(appContainer);

            // 初始化 Vue 实例
            new Vue({
                el: '#cqApp',
                data: {
                    timers: [],
                    autoFire: false,
                    autFireTimer: undefined,
                    autoExpTimer: undefined,
                    cyTimer: undefined,
                    autoBpx: undefined,
                    autoBpxTimer: undefined,
                    attachBossOnly: false,
                    autoExp: false,
                    autoCy: false,
                    selectMapValue: [],
                    currentBossId: -1,
                    mapOptions: [{
                        value: 'sd',
                        label: '手动挡'
                    }, {
                        value: 'longmen',
                        label: '龙门',
                        children: [{
                            value: 'a',
                            label: '左上'
                        }, {
                            value: 'b',
                            label: '左下'
                        }, {
                            value: 'c',
                            label: '右上'
                        }, {
                            value: 'd',
                            label: '右下'
                        }]
                    }, {
                        value: 'cangyue',
                        label: '苍月'
                    }, {
                        value: 'cm5',
                        label: '沉默之路五层'
                    }, {
                        value: 'hs5',
                        label: '昏睡之路五层'
                    }, {
                        value: 'fm',
                        label: '封魔谷'
                    }, {
                        value: 'niumo',
                        label: '牛魔',
                        children: [{
                            value: '112',
                            label: '一层'
                        }, {
                            value: '113',
                            label: '二层'
                        }, {
                            value: '114',
                            label: '三层'
                        }, {
                            value: '115',
                            label: '四层'
                        }, {
                            value: '116',
                            label: '五层'
                        }, {
                            value: '117',
                            label: '六层'
                        }]
                    }, {
                        value: 'zhuangyuan',
                        label: '庄园'
                    }]
                },
                methods: {
                    async handleChange(value) {
                        this.clearTimers()
                        this.attachBossOnly = false;
                        if (!this.autoExp) {
                            this.autoExp = true
                            this.handleAutoExpChange(true)
                        }
                        if (value[0] === 'zhuangyuan') {
                            app.PKRX.ins().send_1_7(app.NWRFmB.ins().getPayer.recog, 118);
                            this.$message.error("3秒后开启自动庄园打怪功能");
                            const timer = setInterval(() => {
                                app.GameMap.scenes.isHook = 1;
                                this.checkEdcwsp();
                            }, 300);
                            this.timers.push(timer);
                        } else if (value[0] === 'longmen') {
                            const hook = xys[value[1]];
                            if (!app.GameMap._mapName.includes('龙门窟')) {
                                this.$message.error("传送到到龙门窟");
                                app.PKRX.ins().send_1_7(app.NWRFmB.ins().getPayer.recog, 218);
                            }
                            app.GameMap.scenes.hook = hook;
                            this.checkEdcwsp();
                        } else if (value[0] === 'cangyue') {
                            if (!app.GameMap._mapName.includes('苍月')) {
                                app.PKRX.ins().send_1_7(app.NWRFmB.ins().getPayer.recog, 16);
                                this.$message.error("3秒后开启无怪自动飞鞋");
                            }
                            const player = this.getPlayer();
                            const autoFlyTimer = window.setInterval(() => {
                                this.checkEdcwsp();
                                if (this.checkMonster() < 1 && this.checkDropCount() < 1) {
                                    this.autoFly(player);
                                }
                            }, 3000);
                            this.timers.push(autoFlyTimer);
                        } else if (value[0] === 'niumo') {
                            app.PKRX.ins().send_1_7(app.NWRFmB.ins().getPayer.recog, parseInt(value[1]));
                            this.checkEdcwsp();
                        } else if (value[0] === 'cm5') {
                            if (app.GameMap._mapName !== '沉默之路5层') {
                                app.PKRX.ins().send_1_7(app.NWRFmB.ins().getPayer.recog, 233);
                            }
                            app.GameMap.scenes.hook = [{
                                "y": 10,
                                "x": 41
                            }];
                            this.checkEdcwsp();
                        } else if (value[0] === 'hs5') {
                            if (app.GameMap._mapName !== '昏睡之地5层') {
                                app.PKRX.ins().send_1_7(app.NWRFmB.ins().getPayer.recog, 234);
                            }
                            this.checkEdcwsp();
                        } else if (value[0] === 'fm') {
                            const rectangle = new Rectangle([
                                [162, 60],
                                [208, 95],
                                [155, 130],
                                [110, 100]
                            ]);
                            const player = this.getPlayer();
                            if (!app.GameMap._mapName.includes('封魔')) {
                                app.PKRX.ins().send_1_7(app.NWRFmB.ins().getPayer.recog, 12);
                            }
                            const autoFlyTimer = window.setInterval(() => {
                                if (!app.GameMap._mapName.includes('封魔')) {
                                    app.PKRX.ins().send_1_7(app.NWRFmB.ins().getPayer.recog, 12);
                                } else {
                                    this.checkEdcwsp();
                                    if (rectangle.isInside(player.lastX, player.lastY)) {
                                        this.$message.error(`人[${player.lastX},${player.lastY}],在封魔谷的城中，危险，防止小黑屋，开飞`);
                                        this.fly();
                                    } else if (this.checkMonster() < 1 && this.checkDropCount() < 1) {
                                        this.autoFly(player);
                                    }
                                }
                            }, 3e3);
                            this.timers.push(autoFlyTimer);
                        } else if (value[0] === 'sd') {
                            app.qTVCL.ins().YFOmNj();
                        }
                    },
                    async handleAttachBossOnlyChange(value) {
                        if (app.GameMap._mapName.includes('苍月') || app.GameMap._mapName.includes('牛魔')) {
                            if (value) {
                                this.$message.error("3秒后开启无BOSS飞鞋");
                                const player = this.getPlayer();
                                this.checkEdcwsp();
                                const autoFlyTimer = window.setInterval(() => {
                                    const bossId = this.getBoss();
                                    const charRole = app.NWRFmB.ins().getCharRole(bossId);
                                    if ((bossId === -1 || (charRole && charRole.propSet.getName().includes("麒麟"))) && this.checkDropCount() < 1) {
                                        this.autoFly(player, "boss");
                                    } else {
                                        // if (!this.hasBuf('幸运神水')) {
                                        //     this.useExp(997, 1)
                                        // }
                                        // app.NWRFmB.ins().getPayer.pathFinding(charRole.currentX, charRole.currentY)
                                        // app.Nzfh.ins().postUpdateTarget(bossId);
                                        this.checkEdcwsp()
                                    }
                                }, 3000);
                                this.timers.push(autoFlyTimer)
                            } else {
                                this.clearTimers()
                            }
                        }
                    },
                    clearTimers() {
                        if (this.timers && this.timers.length > 0) {
                            this.timers.forEach(item => {
                                window.clearInterval(item)
                            })
                            this.timers = []
                        }
                    },
                    handleAutoCyChange(value) {
                        window.clearInterval(this.cyTimer);
                        if (value) {
                            this.cyTimer = window.setInterval(() => {
                                const boss = this.getBoss()
                                const charRole = app.NWRFmB.ins().getCharRole(boss);
                                if (charRole && charRole.propSet.getName().includes("神话") && !charRole.propSet.getName().includes("涂山狐") && !charRole.propSet.getName().includes("炼狱魔龙")) {
                                    const event = new KeyboardEvent('keydown', {
                                        key: '1',
                                        keyCode: 49,
                                        which: 49,
                                        bubbles: true
                                    });
                                    document.dispatchEvent(event);
                                }
                            }, 1500); // 每1500毫秒触发一次
                        }
                    },
                    handleAutoExpChange(value) {
                        window.clearInterval(this.autoExpTimer)
                        if (value) {
                            this.$message.error("开启自动使用五倍经验")
                            this.autoExpTimer = window.setInterval(() => {
                                this.useExp(462, 1)
                            }, 12e5);
                        }
                    },
                    handleAutoFireChange(value) {
                        window.clearInterval(this.autFireTimer)
                        if (value) {
                            this.autFireTimer = window.setInterval(() => {
                                this.fire()
                            }, 10e3);
                        }
                    },
                    hasBuf(name) {
                        const player = this.getPlayer();
                        player.buffType1Ary
                        for (const _ in player.buffType1Ary) {
                            const buf = player.buffType1Ary[_]
                            if (buf.name.includes(name)) {
                                return true;
                            }
                        }
                        return false
                    },
                    useExp(exp_id, count) {
                        // 997 幸运神水
                        // 1007 闪避神水
                        // 1006 吸血神水
                        // 1005 体力神水
                        void 0 === count && (count = 1);
                        //获取人物背包是否有物品
                        const item = app.ThgMu.ins().getItemById(exp_id);
                        if (item) {
                            // 使用物品，前提是 item 不等于空，使用数量小于 item 的 btCount，btCount 最大是一组物品的数量，不是背包的所有数量
                            app.pWFTj.ins().useItem(item.series, exp_id, count === 1 || (count > 1 && count < item.btCount) ? count : item.btCount);
                            console.log(app.pWFTj.ins().useItem(item.series, exp_id, count === 1 || (count > 1 && count < item.btCount) ? count : item.btCount), "五倍经验已使用.");
                        }
                    },
                    sleep(ms) {
                        return new Promise(resolve => setTimeout(resolve, ms));
                    },
                    checkEdcwsp() {
                        if (!app.qTVCL.ins().isOpen) {
                            // 开始挂机
                            app.qTVCL.ins().edcwsp();
                            // 停止挂机
                            // app.qTVCL.ins().YFOmNj();
                            this.$message.error("开始挂机");
                        }
                    },
                    checkMonster() {
                        const all = app.NWRFmB.ins().YUwhM();
                        let count = 0;
                        for (const a in all) {
                            const monster = all[a];
                            if (monster.propSet.getRace() === 1) {
                                count++;
                            }
                        }
                        return count;
                    },
                    getBoss() {
                        const all = app.NWRFmB.ins().YUwhM();
                        for (const a in all) {
                            const charRole = app.NWRFmB.ins().getCharRole(a);
                            if (charRole.isMy) {
                                continue
                            }
                            if (charRole.propSet.getName().includes("BOSS") || charRole.propSet.getName().includes("神话")) {
                                return a;
                            }
                        }
                        return -1;
                    },
                    checkDropCount() {
                        const drops = app.NWRFmB.ins().dropList;
                        let count = 0;
                        for (const _ in drops) {
                            count++;
                        }
                        return count;
                    },
                    getPlayer() {
                        return app.NWRFmB.ins().getPayer;
                    },
                    autoFly(player, msg) {
                        const count = player.propSet.getFlyshoes();
                        if (count > 0) {
                            this.$message.error(`周围没有${msg ? msg : '怪'}了，开始飞，飞鞋点数剩余：${count - 1}`);
                            this.fly();
                        } else {
                            this.$message.error(`飞鞋点数不足，请补充飞鞋点数`);
                        }
                    },
                    fly() {
                        app.EhSWiR.m_clickSkillId = 58;
                    },
                    fire() {
                        app.EhSWiR.m_clickSkillId = 14;
                    },
                    autoAttachChange(value) {
                        window.clearInterval(this.autoBpxTimer);
                        if (value) {
                            this.autoBpxTimer = window.setInterval(() => {
                                const event = new KeyboardEvent('keydown', {
                                    key: '6',
                                    keyCode: 54,
                                    which: 54,
                                    bubbles: true
                                });
                                document.dispatchEvent(event);
                            }, 500); // 每1500毫秒触发一次
                        }
                    },
                }
            })
        })
        .catch((error) => {
            console.error('资源加载失败:', error);
        });

    var __defProp = Object.defineProperty;
    var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value
    }) : obj[key] = value;
    const __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

    // app.NWRFmB.ins().getPayer.moveTo(1,1,1)
    class Rectangle {
        constructor(vertices) {
            __publicField(this, "vertices");
            this.vertices = vertices;
        }

        crossProduct(x, y, z) {
            return (z[1] - y[1]) * (y[0] - x[0]) - (z[0] - y[0]) * (y[1] - x[1]);
        }

        isOnSameSide(p1, p2, a, b) {
            const cp1 = this.crossProduct(a, b, p1);
            const cp2 = this.crossProduct(a, b, p2);
            return cp1 * cp2 >= 0;
        }

        isInside(x, y) {
            const [A, B, C, D] = this.vertices;
            const p = [x, y];
            return this.isOnSameSide(p, A, B, C) && this.isOnSameSide(p, B, C, D) && this.isOnSameSide(p, C, D, A) && this.isOnSameSide(p, D, A, B);
        }
    }
})();
