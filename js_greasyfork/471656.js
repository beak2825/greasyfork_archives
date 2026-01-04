// ==UserScript==
// @name         小黑屋
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  小黑屋游戏的辅助脚本，实现了各种buffer功能，谁用谁知道。
// @match        https://game.ur1.fun/adarkroom*
// @match        http://game.ur1.fun/adarkroom*
// @match        http://adarkroom.doublespeakgames.com/*
// @match        https://adarkroom.doublespeakgames.com/*
// @icon         https://txc.gtimg.com/data/350493/2021/0910/eaf5a32e8ffe2839f3d990b11f9dab38.png
// @resource     ELEMENT_CSS https://cdn.jsdelivr.net/npm/element-plus/dist/index.css
// @require      https://greasyfork.org/scripts/471654-vue3-js/code/vue3js.js?version=1225059
// @require      https://greasyfork.org/scripts/471655-elementplus-js/code/elementPlusjs.js?version=1225062
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/471656/%E5%B0%8F%E9%BB%91%E5%B1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/471656/%E5%B0%8F%E9%BB%91%E5%B1%8B.meta.js
// ==/UserScript==

const elements = GM_getResourceText("ELEMENT_CSS");
GM_addStyle(elements);

this.$ = this.jQuery = jQuery.noConflict(true);

function addStyleNode(str) {
    var styleNode = document.createElement("style");
    styleNode.type = "text/css";
    if (styleNode.styleSheet) {         //
        styleNode.styleSheet.cssText = str;       //ie下要通过 styleSheet.cssText写入.
    } else {
        styleNode.innerHTML = str;       //在ff中， innerHTML是可读写的，但在ie中，它是只读的.
    }
    document.getElementsByTagName("head")[0].appendChild(styleNode);
}

(function () {
    //添加元素
    $('body').prepend(`
        <div id="control">
            <el-divider content-position="center">
                <div v-loading="levelLoading">
                <span>建筑等级：</span>
                <span>{{curLevel}}</span>
                </div>
            </el-divider>
             
            <el-tabs style="height: 700px;width: 300px" tab-position="left">
                <el-tab-pane :label="item.title" class="group" v-for="item in injectOps" :key="item.title" >
                    <div class="btn-group">
                        <el-button class="op-btn" plain v-for="btn in item.ops" :key="btn.name" @click="wrapAction(btn)">{{btn.name}}</el-button>
                    </div>
                </el-tab-pane>
             </el-tabs>
        </div>
    `);
    // 添加建筑等级
    // $('#main>#header').prepend(`<div id="level" v-loading="">0级</div>`);
    addStyleNode(`
     div#wrapper{
        padding: 20px 0 0 550px;
    }
    div#wrapper>#notifications{
        left: 350px;
    }
    div#content{
        height: 900px;
    }
    div#outerSlider>div#main{
        height: 900px;
    }
    div.menu{
        position: fixed;
    }
    #control{
        margin-left: 10px;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: flex-start;
        width: 350px;
        position: absolute;
        left: 0;
        z-index: 999;
    }
    #control div.el-divider.el-divider--horizontal{
        margin: 5px 10px 30px 10px;
    }
    button.op-btn.el-button{
        word-wrap: break-word;
        writing-mode: vertical-lr;
        padding: 3px 5px;
        height: 130px;
        margin: 5px 5px;
        width: 25px;
        font-size: 13px;
        margin-left: 5px;
    }
    button.op-btn.el-button>span{
        writing-mode: tb;
    }
    `)

    const {createApp, ref, computed, onMounted} = Vue


    const app = createApp({
        setup() {
            let collectWoodAndTrapsInterval;
            let attackFlag = ref(true)
            const attack = () =>
                setInterval(() => {
                    if (attackFlag.value === true) {
                        if (!$('#enemy').length) {
                            return;
                        }
                        console.log('敌人血量', window.$('#enemy').data('hp'))
                        if (window.$ && window.$('#enemy').data('hp') <= 0) {
                            return;
                        }
                        if (window.$ && window.$('#wanderer').data('hp') <= window.$('#enemy').data('hp')) {
                            window.$('#wanderer').data('hp') = window.$('#enemy').data('hp') + 5
                        }
                        $('.eventPanel>#buttons>[id^="attack_"]').each(function () {
                            if ($(this).hasClass('disabled')) {
                                $(this).removeClass('disabled');
                            }
                            $(this).click();
                        });
                    } else {
                    }
                }, 500);
            let attackInterval = attack();
            const injectOps = ref([
                {
                    title: "采集",
                    ops: [
                        {
                            name: "快速收集木头",
                            action: () => {
                                clearInterval(collectWoodAndTrapsInterval);
                                collectWoodAndTrapsInterval = setInterval(() => {
                                    $('#gatherButton').removeClass('disabled');
                                    $('#gatherButton').click();
                                }, 100);
                            }
                        },
                        {
                            name: "快速查看陷阱",
                            action: () => {
                                clearInterval(collectWoodAndTrapsInterval);
                                collectWoodAndTrapsInterval = setInterval(() => {
                                    $('#trapsButton').removeClass('disabled');
                                    $('#trapsButton').click();
                                }, 100);
                            }
                        },
                        {
                            name: "快速收集木头和陷阱",
                            action: () => {
                                clearInterval(collectWoodAndTrapsInterval);
                                collectWoodAndTrapsInterval = setInterval(() => {
                                    $('#gatherButton').removeClass('disabled');
                                    $('#gatherButton').click();
                                    $('#trapsButton').removeClass('disabled');
                                    $('#trapsButton').click();
                                }, 100);
                            }
                        },
                        {
                            name: "结束快速收集",
                            action: () => {
                                clearInterval(collectWoodAndTrapsInterval);
                            }
                        },
                        {
                            name: "木头采集速度+100",
                            action: () => {
                                $SM.add('income.builder.stores.wood', 100);
                            }
                        },
                        {
                            name: "木头采集速度-100",
                            action: () => {
                                $SM.add('income.builder.stores.wood', -100);
                            }
                        },
                        {
                            name: "抓捕小偷",
                            action: () => {
                                $SM.set('game.thieves', 2);
                                $SM.remove('income.thieves');
                                $SM.addPerk('stealthy');
                            }
                        },
                        {
                            name: "随机事件",
                            action: () => {
                                Events.triggerEvent();
                            }
                        }
                    ]
                },
                {
                    title: "探险",
                    ops: [
                        {
                            name: attackFlag.value ? '关闭自动击杀' : '开启自动击杀',
                            action: () => {
                                if (attackFlag.value === true) {
                                    attackFlag.value = false;
                                    clearInterval(attackInterval);
                                } else {
                                    attackFlag.value = true;
                                    attackInterval = attack();
                                }
                            }
                        },
                        {
                            name: "生命+9999(战斗时)",
                            action: () => {
                                window.$('#wanderer').data('hp', 9999);
                                $('.eventPanel>#buttons>[id^="attack_"]').each(function () {
                                    if ($(this).hasClass('disabled')) {
                                        $(this).removeClass('disabled');
                                    }
                                    $(this).click();
                                });
                            }
                        },
                        {
                            name: "一击必杀(战斗时)",
                            action: () => {
                                window.$('#enemy').data('hp', 0);
                                $('.eventPanel>#buttons>[id^="attack_"]').each(function () {
                                    if ($(this).hasClass('disabled')) {
                                        $(this).removeClass('disabled');
                                    }
                                    $(this).click();
                                });
                            }
                        },
                        {
                            name: "加满背包水",
                            action: () => {
                                World.setWater(90)
                                World.updateSupplies()
                            }
                        },
                        {
                            name: "加满背包腊肉",
                            action: () => {
                                let free = Path.getFreeSpace()
                                Path.outfit['cured meat'] += free
                                Path.updateOutfitting()
                                World.updateSupplies()
                            }
                        },
                        {
                            name: "直接回家",
                            action: () => {
                                World.goHome()
                            }
                        },
                        {
                            name: "解锁全部地图",
                            action: () => {
                                $SM.set(
                                    'game.world.mask',
                                    new Array(World.RADIUS * 2 + 1).fill(new Array(World.RADIUS * 2 + 1).fill(true))
                                );
                            }
                        },
                    ]
                },
                {
                    title: "资源",
                    ops: [
                        {
                            name: "木头+10000",
                            action: () => {
                                $SM.add('stores.wood', 10000);
                            }
                        },
                        {
                            name: "木头木头-10000",
                            action: () => {
                                $SM.add('stores.wood', -10000);
                            }
                        },
                        {
                            name: "毛皮+10000",
                            action: () => {
                                $SM.add('stores.fur', 10000);
                            }
                        },
                        {
                            name: "鲜肉+10000",
                            action: () => {
                                $SM.add('stores.meat', 10000);
                            }
                        },
                        {
                            name: "鳞片+10000",
                            action: () => {
                                $SM.add('stores.scales', 10000);
                            }
                        },
                        {
                            name: "利齿+5000",
                            action: () => {
                                $SM.add('stores.teeth', 5000);
                            }
                        },
                        {
                            name: "布料+1000",
                            action: () => {
                                $SM.add('stores.cloth', 1000);
                            }
                        },
                        {
                            name: "腊肉+1000",
                            action: () => {
                                $SM.add('stores["cured meat"]', 1000);
                            }
                        },
                        {
                            name: "皮革+500",
                            action: () => {
                                $SM.add('stores.leather', 500);
                            }
                        },
                        {
                            name: "药品+200",
                            action: () => {
                                $SM.add('stores.medicine', 200);
                            }
                        },
                        {
                            name: "火把+100",
                            action: () => {
                                $SM.add('stores.torch', 100);
                            }
                        },
                        {
                            name: "诱饵+500",
                            action: () => {
                                $SM.add('stores.bait', 500);
                            }
                        },
                        {
                            name: "护身符+20",
                            action: () => {
                                $SM.add('stores.charm', 20);
                            }
                        },
                        {
                            name: "骨矛+100",
                            action: () => {
                                $SM.add('stores["bone spear"]', 100);
                            }
                        },
                        {
                            name: "套锁+100",
                            action: () => {
                                $SM.add('stores.bolas', 100);
                            }
                        },
                        {
                            name: "铁+1000",
                            action: () => {
                                $SM.add('stores.iron', 1000);
                            }
                        },
                        {
                            name: "铁剑+100",
                            action: () => {
                                $SM.add('stores["iron sword"]', 100);
                            }
                        },
                        {
                            name: "钢+1000",
                            action: () => {
                                $SM.add('stores.steel', 1000);
                            }
                        },
                        {
                            name: "钢剑+100",
                            action: () => {
                                $SM.add('stores["steel sword"]', 100);
                            }
                        },
                        {
                            name: "煤+2000",
                            action: () => {
                                $SM.add('stores.coal', 2000);
                            }
                        },
                        {
                            name: "硫磺+2000",
                            action: () => {
                                $SM.add('stores.sulphur', 2000);
                            }
                        },
                        {
                            name: "刺刀+200",
                            action: () => {
                                $SM.add('stores.bayonet', 200);
                            }
                        },
                        {
                            name: "子弹+500",
                            action: () => {
                                $SM.add('stores.bullets', 20);
                            }
                        },
                        {
                            name: "手榴弹+200",
                            action: () => {
                                $SM.add('stores.grenade', 200);
                            }
                        },
                        {
                            name: "燃料电池+100",
                            action: () => {
                                $SM.add('stores["energy cell"]', 100);
                            }
                        },
                        {
                            name: "外星合金+100",
                            action: () => {
                                $SM.add('stores["alien alloy"]', 100);
                            }
                        },
                        {
                            name: "猎枪+50",
                            action: () => {
                                $SM.add('stores.rifle', 50);
                            }
                        },
                        {
                            name: "激光步枪+50",
                            action: () => {
                                $SM.add('stores["laser rifle"]', 50);
                            }
                        },
                    ]
                },
                {
                    title: "飞船",
                    ops: [
                        {
                            name: "飞船现身",
                            action: () => {
                                if (!$SM.get('features.location.spaceShip')) {
                                    Ship.init();
                                }
                            }
                        },
                        {
                            name: "加固船身+100",
                            action: () => {
                                $SM.add('game.spaceShip.hull', 100);
                                $('#reinforceButton').click();
                            }
                        },
                        {
                            name: "升级飞艇+100",
                            action: () => {
                                $SM.add('game.spaceShip.thrusters', 100);
                                $('#engineButton').click();
                            }
                        }
                    ]
                }
            ])


            let curLevel = ref(0);
            let levelLoading = ref(false);
            onMounted(() => {
                //直接出发
                setInterval(() => {
                    let embarkButton = document.querySelector('#embarkButton');
                    if (embarkButton !== null) {
                        embarkButton.classList.remove('disabled');
                    }
                    //直接起飞
                    $('#liftoffButton').removeClass('disabled');
                }, 500);

                levelLoading.value = true
                setInterval(() => {
                    try {
                        if ($SM) {
                            let level = $SM.get('game.builder.level');
                            if (level !== curLevel.value) {
                                curLevel.value = level
                            }
                            levelLoading.value = false
                        }
                    } catch {
                        console.log("等级加载中。。。")
                    }
                }, 5000);

                setTimeout(() => {
                    let perk_render = setInterval(() => {
                        try {
                            if (Engine && Engine.Perks) {
                                let actions = []
                                for (let name of Object.keys(Engine.Perks).sort()) {
                                    actions.push({
                                        name: _ ? _.translate(name) : name,
                                        action: () => {
                                            $SM.addPerk(name);
                                        }
                                    })
                                }
                                let tmp = injectOps.value
                                tmp.push({title: "技能", ops: actions})
                                injectOps.value = tmp
                                clearInterval(perk_render);
                            }
                        } catch {
                            console.log("技能加载中。。。")
                        }
                    }, 2000);
                }, 2000)
            })

            const wrapAction = (op) => {
                console.log(op.name)
                op.action()
            }

            return {
                injectOps,
                curLevel,
                levelLoading,
                wrapAction,
            }
        }
    })
    app.use(ElementPlus);
    app.mount('#control');

})();
