// ==UserScript==
// @name         海外OTA平台助手(测试版)
// @namespace    http://tampermonkey.net/
// @version      0.92
// @description  测海外OTA平台助手,支持策略页面显示备注等功能
// @author       休止符
// @license      MPL
// @match        https://*.soimt.com/*
// @require      https://unpkg.com/vue@3.5.12/dist/vue.global.js
// @require      data:application/javascript,unsafeWindow.Vue%3DVue%2Cthis.Vue%3DVue%3B
// @require      https://unpkg.com/naive-ui
// @require      https://update.greasyfork.org/scripts/517274/1483694/ElementGetter_xzf.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/518312/%E6%B5%B7%E5%A4%96OTA%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B%28%E6%B5%8B%E8%AF%95%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518312/%E6%B5%B7%E5%A4%96OTA%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B%28%E6%B5%8B%E8%AF%95%E7%89%88%29.meta.js
// ==/UserScript==

init();

function init() {
    let text = `
         <div id="xzf">
            <div
                id="xzfapp"
                :style="{right: position.right + 'px', top: position.top + 'px', position: 'fixed' ,backgroundColor: backgroundColor,zIndex:1024,width: '220px',padding:'4px'}">
                <div style="text-align: center" @mousedown="startDrag" @dblclick="dblclick">
                    <n-tooltip placement="top">
                        <template #trigger>
                            <n-button @dblclick.stop text @click="winZoomlevelChange"> 小助手 </n-button>
                        </template>
                        左键长按可以移动窗口,单击缩放, 双击空白处可以全部展开
                    </n-tooltip>
                </div>
                <!-- padding: 0px 8px 0px 5px -->
                <n-collapse-transition :show="winZoomlevel>0">
                    <n-flex
                        vertical
                        :align="winZoomlevel==1?'center':'end'"
                        justify="space-around"
                        :size="2"
                        style="width: 220px">
                        <n-flex>
                            <n-collapse-transition :show="winZoomlevel>0">
                                VIN:
                                <n-Input
                                    size="small"
                                    v-model:value="vin"
                                    maxlength="17"
                                    style="width: 170px"
                                    placeholder="请输入 vin"
                                    @change="vinChange"></n-Input>
                            </n-collapse-transition>
                        </n-flex>
                        <n-flex>
                            <n-collapse-transition :show="winZoomlevel>1">
                                策略id:
                                <n-Input
                                    size="small"
                                    maxlength="10"
                                    style="width: 170px"
                                    v-model:value="strategyid"
                                    placeholder="请输入 策略id"
                                    @change="strategyidChange"></n-Input>
                            </n-collapse-transition>
                        </n-flex>
                        <n-flex>
                            <n-collapse-transition :show="winZoomlevel>2">
                                任务id:
                                <n-Input
                                    size="small"
                                    v-model:value="taskid"
                                    style="width: 170px"
                                    maxlength="10"
                                    placeholder="请输入 任务id"
                                    @change="taskidChange"></n-Input>
                            </n-collapse-transition>
                        </n-flex>
                    </n-flex>
                </n-collapse-transition>
                <n-collapse-transition :show="winZoomlevel>3">
                    <n-flex justify="space-evenly" :size="0" style="padding-top: 5px">
                        <n-tooltip trigger="hover">
                            <template #trigger>
                                <n-button size="small" @click="CreateTaskclick" :loading="CreateTasking">
                                    创建任务
                                </n-button>
                            </template>
                            使用任务id创建任务
                        </n-tooltip>
                        <n-tooltip width="200" trigger="hover">
                            <template #trigger>
                                <n-button size="small" @click="CreateStrategTask" :loading="CreateStrategTasking">
                                    创建策略
                                </n-button>
                            </template>
                            优先判断任务id是否和策略id一致, 如果一致则直接创建任务,否则使用策略id创建
                        </n-tooltip>
                        <n-button size="small" @click="drawerShow =true"> 设置 </n-button>
                    </n-flex>
                </n-collapse-transition>
            </div>
            <n-drawer v-model:show="drawerShow" :width="250" @after-leave="drawerClose">
                <n-drawer-content title="功能设置">
                    <n-flex vertical>
                        <n-flex>
                            <n-tooltip width="200">
                                <template #trigger>
                                    <n-flex>
                                        全部功能:
                                        <n-switch v-model:value="Functionswitch" :rail-style="railStyle">
                                            <template #checked> 开启 </template>
                                            <template #unchecked> 关闭 </template>
                                        </n-switch>
                                    </n-flex>
                                </template>
                                小助手功能总开关,用来一键开关所有功能
                            </n-tooltip>
                        </n-flex>
                        <n-flex>
                            <n-tooltip width="200">
                                <template #trigger>
                                    <n-flex>
                                        自动备注:
                                        <n-switch v-model:value="PackageDes" :rail-style="railStyle">
                                            <template #checked> 开启 </template>
                                            <template #unchecked> 关闭 </template>
                                        </n-switch>
                                    </n-flex>
                                </template>
                                开启后在创建策略时会显示升级包备注
                            </n-tooltip>
                        </n-flex>
                        <n-flex>
                            <n-tooltip width="200">
                                <template #trigger>
                                    <n-flex>
                                        隐藏数据:
                                        <n-switch
                                            v-model:value="PackageVisibility"
                                            checked-value="collapse"
                                            unchecked-value="visible"
                                            :rail-style="railStyle">
                                            <template #checked> 开启 </template>
                                            <template #unchecked> 关闭 </template>
                                        </n-switch>
                                    </n-flex>
                                </template>
                                开启后在创建策略时会隐藏不属于vin的ecu,隐藏升级包备注不包含vin:vin的升级包
                            </n-tooltip>
                        </n-flex>

                        <n-flex>
                            <n-tooltip width="200">
                                <template #trigger>
                                    <n-flex>
                                        做包检测:
                                        <n-switch v-model:value="MackPackageNotification" :rail-style="railStyle">
                                            <template #checked> 开启 </template>
                                            <template #unchecked> 关闭 </template>
                                        </n-switch>
                                    </n-flex>
                                </template>
                                开启后在会自动后台监控做包状态,成功后会页面通知
                            </n-tooltip>
                        </n-flex>

                        <n-flex>
                            <n-tooltip width="200">
                                <template #trigger>
                                    <n-flex>
                                        自动策略:
                                        <n-switch v-model:value="AutoCreateStrategTask" :rail-style="railStyle">
                                            <template #checked> 开启 </template>
                                            <template #unchecked> 关闭 </template>
                                        </n-switch>
                                    </n-flex>
                                </template>
                                开启后在会自动检测策略状态,自动提交到 测试通过
                            </n-tooltip>
                        </n-flex>

                        <n-flex>
                            <n-tooltip width="200">
                                <template #trigger>
                                    <n-flex>
                                        自动任务:
                                        <n-switch v-model:value="AutoCreateTask" :rail-style="railStyle">
                                            <template #checked> 开启 </template>
                                            <template #unchecked> 关闭 </template>
                                        </n-switch>
                                    </n-flex>
                                </template>
                                开启后在会自动检测任务状态,自动提交到 已发布
                            </n-tooltip>
                        </n-flex>

                        <n-flex>
                            <n-tooltip width="200">
                                <template #trigger>
                                    <n-flex>
                                        自动下发:
                                        <n-switch v-model:value="AutoCheckUpdate" :rail-style="railStyle">
                                            <template #checked> 开启 </template>
                                            <template #unchecked> 关闭 </template>
                                        </n-switch>
                                    </n-flex>
                                </template>
                                开启自动任务和自动下发后会自动检查更新下(301-1)
                            </n-tooltip>
                        </n-flex>

                        <n-flex>
                            <n-tooltip width="200">
                                <template #trigger>
                                    <n-flex>
                                        自动选包:
                                        <n-switch v-model:value="AutoCheckboxed" :rail-style="railStyle">
                                            <template #checked> 开启 </template>
                                            <template #unchecked> 关闭 </template>
                                        </n-switch>
                                    </n-flex>
                                </template>
                                开启后会在创建策略时自动勾选升级包
                            </n-tooltip>
                        </n-flex>

                        <n-flex>
                            <n-tooltip width="200">
                                <template #trigger>
                                    <n-flex>
                                        多级缩放:
                                        <n-switch v-model:value="MultiZoom" :rail-style="railStyle">
                                            <template #checked> 开启 </template>
                                            <template #unchecked> 关闭 </template>
                                        </n-switch>
                                    </n-flex>
                                </template>
                                开启后缩放会变成一层一层增加
                            </n-tooltip>
                        </n-flex>
                        <n-flex align="baseline">
                            <n-tooltip width="300">
                                <template #trigger> 缩放级别: </template>
                                点击标题 可以切换窗口大小
                            </n-tooltip>
                            <n-slider
                                v-model:value="Zoomlevel"
                                :marks="ZoomlevelMarks"
                                range
                                :max="4"
                                @dragend.passive="if(Zoomlevel[0]==Zoomlevel[1]) {Zoomlevel[0]=0;Zoomlevel[1]=4;}"
                                :tooltip="false"
                                style="width: 130px" />
                        </n-flex>

                        <n-flex>
                            设置背景:
                            <n-color-picker
                                :modes="['hex']"
                                style="width: 120px"
                                :swatches="predefineColors"
                                v-model:value="backgroundColor"
                                :show-preview="true"></n-color-picker>
                        </n-flex>
                        <n-flex>
                            通知时长:<n-time-picker
                                style="width: 120px"
                                :actions="[null]"
                                v-model:value="Timestamp"
                                @blur="NotifTime=Timestamp+28799800" />
                        </n-flex>
                    </n-flex>
                </n-drawer-content>
            </n-drawer>
        </div>
    `;

    var el = document.createElement("div");
    el.innerHTML = text;
    document.body.append(el);
    const { message, notification } = naive.createDiscreteApi(["message", "notification"]);
    function messageNotify(mes, type = "info") {
        message[type](mes);
    }
    function destroyAllNotify() {
        notification.destroyAll();
    }
    function notify(config) {
        notification[config.type]({
            content: config.title,
            meta: config.message,
            duration: config.duration,
            keepAliveOnHover: true,
        });
    }

    function returnobservers(selector, callback, observerconfig = { childList: true }) {
        let data = {
            selector: selector,
            observerconfig: observerconfig,
            timeoutId: null,
        };
        data.observer = new MutationObserver((mutation, observer) => {
            if (data.timeoutId) {
                clearTimeout(data.timeoutId);
            }
            data.timeoutId = setTimeout(() => callback(mutation, observer), 200);
        });
        return data;
    }

    const App = {
        data() {
            return {
                env: "",
                intervalId: null,
                dragging: false,
                drawerShow: false,
                CreateTasking: false,
                CreateStrategTasking: false,
                position: {
                    right: 10,
                    top: 100,
                },
                predefineColors: [
                    "#FF450061",
                    "#FF8C005E",
                    "#FFD7006B",
                    "#90EE9085",
                    "#00CED17A",
                    "#1E90FF82",
                    "#c7158577",
                ],
                railStyle: ({ focused, checked }) => {
                    const baseColor = checked ? "#13ce66" : "#ff4949";
                    const style = {
                        background: baseColor,
                        ...(focused && { boxShadow: `0 0 0 2px ${baseColor}` }),
                    };
                    return style;
                },
                ZoomlevelMarks: {
                    0: "最小",
                    1: "vin",
                    2: "策略",
                    3: "任务",
                    4: "全部",
                },
                vin: "",
                strategyid: "",
                taskid: "",
                PackageDes: true,
                PackageVisibility: "collapse",
                MackPackageNotification: true,
                AutoCreateStrategTask: true,
                AutoCreateTask: true,
                AutoCheckUpdate: true,
                AutoCheckboxed: false,
                MultiZoom: true,
                Zoomlevel: [0, 4],
                winZoomlevel: 4,
                backgroundColor: "#00CED17A",
                NotifTime: 0,
                Timestamp: -28799800,
            };
        },
        async mounted() {
            console.log("初始化小助手");
            let url = this.getUrlData(window.location.href);
            this.env = url.origin;
            GM_addValueChangeListener("config", (name, old_value, new_value, remote) => {
                if (remote) this.readConfig();
            });
            this.hookUrl();
            this.hookHTTP();
            this.readConfig();
            this.urlChange(window.location.href);
        },
        computed: {
            Functionswitch: {
                get() {
                    return (
                        this.PackageDes &&
                        this.MackPackageNotification &&
                        this.AutoCreateStrategTask &&
                        this.AutoCreateTask &&
                        this.AutoCheckUpdate &&
                        this.AutoCheckboxed &&
                        this.MultiZoom &&
                        this.PackageVisibility == "collapse"
                    );
                },
                set(newValue) {
                    this.PackageDes = newValue;
                    this.MackPackageNotification = newValue;
                    this.AutoCreateStrategTask = newValue;
                    this.AutoCreateTask = newValue;
                    this.AutoCheckUpdate = newValue;
                    this.AutoCheckboxed = newValue;
                    this.MultiZoom = newValue;
                    this.PackageVisibility = newValue ? "collapse" : "visible";
                },
            },
        },
        methods: {
            dblclick() {
                winZoomlevel = 4;
                destroyAllNotify();
            },
            winZoomlevelChange() {
                min = this.Zoomlevel[0] > this.Zoomlevel[1] ? this.Zoomlevel[1] : this.Zoomlevel[0];
                max = this.Zoomlevel[0] > this.Zoomlevel[1] ? this.Zoomlevel[0] : this.Zoomlevel[1];

                if (!this.MultiZoom) {
                    this.winZoomlevel = this.winZoomlevel >= max ? min : max;
                    this.saveConfig();
                    return;
                }
                this.winZoomlevel++;
                if (this.winZoomlevel > max) this.winZoomlevel = min;
                this.saveConfig();
            },
            saveConfig() {
                var config = {
                    vin: this.vin,
                    strategyid: this.strategyid,
                    taskid: this.taskid,
                    PackageDes: this.PackageDes,
                    PackageVisibility: this.PackageVisibility,
                    MackPackageNotification: this.MackPackageNotification,
                    AutoCreateStrategTask: this.AutoCreateStrategTask,
                    AutoCreateTask: this.AutoCreateTask,
                    AutoCheckUpdate: this.AutoCheckUpdate,
                    AutoCheckboxed: this.AutoCheckboxed,
                    MultiZoom: this.MultiZoom,
                    Zoomlevel: this.Zoomlevel,
                    winZoomlevel: this.winZoomlevel,
                    position: this.position,
                    backgroundColor: this.backgroundColor,
                    NotifTime: this.NotifTime,
                    Timestamp: this.Timestamp,
                };
                GM_setValue("config", JSON.stringify(config));
                console.debug("saveConfig", config);
            },
            readConfig() {
                let str = GM_getValue("config");
                let config = null;
                try {
                    config = (str && JSON.parse(str)) || null;
                } catch (d) {}
                if (config == null) return;
                console.debug("readConfig", config);
                this.vin = config.vin ?? this.vin;
                this.strategyid = config.strategyid ?? this.strategyid;
                this.taskid = config.taskid ?? this.taskid;
                this.PackageDes = config.PackageDes ?? this.PackageDes;
                this.PackageVisibility = config.PackageVisibility ?? this.PackageVisibility;
                this.MackPackageNotification = config.MackPackageNotification ?? this.MackPackageNotification;
                this.AutoCreateStrategTask = config.AutoCreateStrategTask ?? this.AutoCreateStrategTask;
                this.AutoCreateTask = config.AutoCreateTask ?? this.AutoCreateTask;
                this.AutoCheckUpdate = config.AutoCheckUpdate ?? this.AutoCheckUpdate;
                this.AutoCheckboxed = config.AutoCheckboxed ?? this.AutoCheckboxed;
                this.MultiZoom = config.MultiZoom ?? this.MultiZoom;
                this.Zoomlevel = config.Zoomlevel ?? this.Zoomlevel;
                this.winZoomlevel = config.winZoomlevel ?? this.winZoomlevel;
                this.position = config.position ?? this.position;
                this.backgroundColor = config.backgroundColor ?? this.backgroundColor;
                this.NotifTime = config.NotifTime ?? this.NotifTime;
                this.Timestamp = config.Timestamp ?? this.Timestamp;

                /* --------------------------------- 重置窗口位置 --------------------------------- */
                if (this.position.top < 0) this.position.top = 0;
                if (this.position.right < -50) this.position.right = 0;
            },
            strategyidChange() {
                this.saveConfig();
            },
            taskidChange() {
                this.saveConfig();
            },
            drawerClose() {
                this.saveConfig();
                this.urlChange(window.location.href);
            },
            async vinChange() {
                let url = "/mgapi/upgrade/vehicle/list?pageSize=1&pageNumber=1&searchText=" + this.vin;
                let res = await this.httpRequset(url);
                this.vin = res.data.list[0].vin;
                this.saveConfig();
            },
            CreateTaskclick() {
                setTimeout(this.TaskStatusSwitch, 10);
            },
            CreateStrategTask() {
                setTimeout(this.strategyStatusSwitch, 10);
            },
            hookUrl() {
                this.urlHooks = [
                    {
                        url: "#/OTA/StrategyInfoManager/StrategyConfig/AddStrategyInfo",
                        init: this.init_AddStrategyInfo,
                        hookfun: this.urlhook_AddStrategyInfo,
                        observers: [],
                    },
                    {
                        url: "/#/OTA/SoftwareManager/SoftwareList/AddSoftwares",
                        init: this.init_AddSoftwares,
                        hookfun: this.urlhook_AddSoftwares,
                        observers: [],
                    },
                ];
                this.urlHooks.forEach((x) => x.init(x));
                console.debug("hookUrl");
                let originPush = history.pushState;
                history.pushState = async (state, title, url) => {
                    this.urlChange(url);
                    originPush.call(history, state, title, url);
                };
            },
            async urlChange(url) {
                for (const urlhook of this.urlHooks) {
                    urlhook.context = null;
                    urlhook.observers?.forEach((x) => x.observer.disconnect());
                    if (!url.includes(urlhook.url)) continue;
                    urlhook
                        .hookfun()
                        .then((context) => {
                            urlhook.context = context;
                        })
                        .catch((error) => {
                            console.error(urlhook.url + "函数执行异常", error);
                        });

                    for (const item of urlhook.observers) {
                        let ele = await elmGetter.get(item.selector, 30_0000);
                        // let ele = await elmGetter.get(item.selector);
                        if (ele) {
                            item.observer.observe(ele, item.observerconfig);
                            console.debug("开启成功", item.selector);
                        }
                    }
                }
            },
            async urlhook_AddStrategyInfo() {
                var carECU99 = await this.GetCarECU99(this.vin);
                var hw = [...new Set(carECU99.map((ecu) => ecu.hwPartNumber))];
                let ecuMap = new Map(carECU99.map((ecu) => [ecu.ecuName + ecu.hwPartNumber, ecu]));
                let packageMap = await this.GetPackageInfoList(hw);
                return { ecuMap: ecuMap, packageMap: packageMap };
            },
            async urlhook_AddSoftwares() {
                var carECU99 = await this.GetCarECU99(this.vin);
                let ecuMap = new Map(carECU99.map((ecu) => [ecu.ecuName + ecu.hwPartNumber, ecu]));
                let input = await elmGetter.get("div.content-main > form > div > div:nth-child(4) input", 30_000);
                if (input) input.maxLength = 10;
                return { ecuMap: ecuMap };
            },
            init_AddStrategyInfo(urlhook) {
                console.debug("init_AddStrategyInfo=========");

                let data = returnobservers("#u1+.content-box .content-main", (mutation, observer) => {
                    console.debug("init_AddStrategyInfo");
                    if (!urlhook.context) return;
                    //软件包添加备注
                    this.showCheckedPackagesDes(urlhook);
                    //显示包备注
                    this.showPackageDes(urlhook);
                    //输入升级时间
                    this.inputUpdateTime();
                });
                urlhook.observers.push(data);

                urlhook.observers.push(
                    returnobservers(
                        "div.part-one div.content-main div.table-box tbody",
                        (mutation, observer) => {
                            if (!urlhook.context) return;
                            //显示请选择零件备注
                            this.showEcuDes(urlhook);
                        },
                        { childList: true }
                    )
                );
            },
            init_AddSoftwares(urlhook) {
                console.debug("init_AddSoftwares=========");
                let data = returnobservers(
                    ".common-main-box .el-form >.el-row >div:nth-child(2) .el-scrollbar ul",
                    (mutations, observer) => {
                        if (!urlhook.context) return;
                        let ecuMap = urlhook.context.ecuMap;
                        let input = document.querySelector("div.content-main > form > div > div:nth-child(1) input");
                        if (!input) return;
                        input = document.querySelector("div.content-main > form > div > div:nth-child(4) input");
                        if (!input) return;
                        input.maxLength = 10;
                        let mcu = input.value;
                        mutations.forEach((mutation) => {
                            mutation.addedNodes.forEach((ele) => {
                                const packageInfo = ecuMap.get(mcu + ele.innerText);
                                if (packageInfo) {
                                    ele.innerText = `${ele.innerText}--${packageInfo.vin}`;
                                }
                            });
                        });
                    }
                );
                urlhook.observers.push(data);

                urlhook.observers.push(
                    returnobservers(
                        "div.part-one div.content-main div.table-box tbody",
                        (mutation, observer) => {
                            if (!urlhook.context) return;
                            //显示请选择零件备注
                            this.showEcuDes(urlhook);
                        },
                        { childList: true }
                    )
                );
            },
            showEcuDes(urlhook) {
                console.debug("showEcuDes====显示车辆对应ECU====", urlhook.context);
                let ecuMap = urlhook.context.ecuMap;
                const elements = document.querySelectorAll("div.part-one  tbody > tr:nth-child(1) ");

                elements.forEach((element) => {
                    var tmp = element.innerText.replaceAll(" ", "").replaceAll("\t", "").replaceAll("\n", "");
                    const ecuInfo = ecuMap.get(tmp);
                    if (!ecuInfo) return (element.style.visibility = this.PackageVisibility);
                    let ele = element.querySelector("td div td:nth-child(3) > .cell");
                    if (!ele) return;
                    ele.innerHTML = `${ecuInfo.hwPartNumber}<br>备注:${ecuInfo.vin}`;
                });
            },
            showPackageDes(urlhook) {
                console.debug("showPackageDes====显示升级包备注====", urlhook.context);
                const elements = document.querySelectorAll("#u1 #modelPartTableData .el-table__body-wrapper tbody tr");
                for (const element of elements) {
                    let checkbox = element.querySelector("td:nth-child(1) label > span:not(.is-checked)");
                    if (!checkbox) continue;
                    this.Showdes(element, urlhook.context.packageMap, urlhook.context.checkboxedPackages);
                }
            },
            showCheckedPackagesDes(urlhook) {
                console.debug("showCheckedPackagesDes====显示选中升级包备注====", urlhook.context);
                let packageMap = urlhook.context.packageMap;
                var trs = document.querySelectorAll("#u1+.content-box tbody tr");
                if (!trs) return;
                urlhook.context.checkboxedPackages = new Set();
                for (const tr of trs) {
                    let ecu = tr.querySelector("td:nth-child(2) div").innerHTML;
                    let moudle = tr.querySelector("td:nth-child(4) div").innerHTML;
                    let versionele = tr.querySelector("td:nth-child(5) div ");
                    let version = versionele.innerText;
                    const packageInfo = packageMap.get(ecu + "_" + moudle + "_" + version);
                    if (!packageInfo) return true;
                    versionele.innerHTML = `${version}<br>备注: ${packageInfo.description}`;
                    urlhook.context.checkboxedPackages.add(ecu + "_" + moudle);
                }
            },
            inputUpdateTime() {
                console.debug("inputUpdateTime====填写策略升级时间====", urlhook.context);
                const inputs = document.querySelectorAll("div.right-table  td:nth-child(5) input");
                if (!inputs) return true;
                inputs.forEach((input) => {
                    input.value = 12;
                    input.dispatchEvent(new Event("input"));
                });
            },
            Showdes(element, packageMap, checkboxedPackages) {
                if (!this.PackageDes) return;
                let vin4 = this.vin.slice(-4);
                var currentUrl = "/OTA/StrategyInfoManager/StrategyConfig/AddStrategyInfo";
                var locationUrl = window.location.href;
                if (!locationUrl.includes(currentUrl)) return false;

                let ecu = element.querySelector("td:nth-child(2) div").innerHTML;
                let moudle = element.querySelector("td:nth-child(4) div").innerHTML;
                let versionele = element.querySelector("td:nth-child(5) div div");
                let index = versionele.innerHTML.indexOf("<br>备注:");
                let version = index !== -1 ? versionele.innerHTML.slice(0, index) : versionele.innerHTML;
                var has1 = packageMap.has(ecu + "_" + moudle + "_" + version);
                if (!has1) {
                    element.style.visibility = this.PackageVisibility;
                    return true;
                }
                const packageInfo = packageMap.get(ecu + "_" + moudle + "_" + version);

                if (!packageInfo.description) {
                    element.style.visibility = this.PackageVisibility;
                    return true;
                }
                let index_vin = packageInfo.description.toLowerCase().indexOf("vin:");
                if (index_vin == -1) {
                    element.style.visibility = this.PackageVisibility;
                    return true;
                }
                let substringAfter = packageInfo.description.substring(index_vin + 1);
                if (substringAfter.includes(vin4) || moudle == "99") {
                    element.style.visibility = "visible";
                    versionele.innerHTML = `${version}<br>备注: ${packageInfo.description}`;
                    let checkbox = element.querySelector("td:nth-child(1) label > span:not(.is-checked)");
                    if (checkbox && this.AutoCheckboxed) checkbox.click();
                    if (checkboxedPackages.has(ecu + "_" + moudle)) {
                        element.style.visibility = this.PackageVisibility;
                    }
                    return true;
                }
                element.style.visibility = this.PackageVisibility;
                return true;
            },
            hookHTTP() {
                let hookurls = new Map([
                    [
                        "/mgapi/upgrade/v1/strategy/software/part",
                        {
                            gethook: (url) => url.replaceAll("pageSize=10", "pageSize=1000"),
                            responsehook: (response) => response,
                            RequestAfterhook: () => {},
                        },
                    ],
                    [
                        "/mgapi/upgrade/v1/strategy/model/part",
                        {
                            gethook: (url) => url,
                            responsehook: (response) => response,
                            RequestAfterhook: () => {},
                        },
                    ],
                    [
                        "/mgapi/upgrade/v1/strategy/create",
                        {
                            gethook: (url) => url,
                            responsehook: (response) => response,
                            RequestAfterhook: this.strategyCreatestatus,
                        },
                    ],
                    [
                        "/mgapi/upgrade/v1/strategy/submitTest",
                        {
                            gethook: (url) => url,
                            responsehook: (response) => response,
                            RequestAfterhook: (url, data, json) => {
                                this.strategyid = url.paramsJson.id;
                                setTimeout(this.strategyStatusSwitch, 10);
                            },
                        },
                    ],
                    [
                        "/mgapi/upgrade/v1/strategyTest/submitTestResult",
                        {
                            gethook: (url) => url,
                            responsehook: (response) => response,
                            RequestAfterhook: (url, data, json) => {
                                this.strategyTestId = data.strategyId;
                                setTimeout(this.strategyStatusSwitch, 10);
                            },
                        },
                    ],
                    [
                        "/mgapi/upgrade/task/add",
                        {
                            gethook: (url) => url,
                            responsehook: (response) => response,
                            RequestAfterhook: (url, data, json) => {
                                this.recvTaskadd(url, data, json);
                            },
                        },
                    ],
                    [
                        "/mgapi/upgrade/task/update",
                        {
                            gethook: (url) => url,
                            responsehook: (response) => response,
                            RequestAfterhook: (url, data, json) => {
                                this.recvTaskadd(url, data, json);
                            },
                        },
                    ],
                ]);
                this.hookXHR(hookurls);
            },
            async hookMain(hookurl, __url, __data, result) {
                let json = null;
                let data = null;
                try {
                    json = JSON.parse(result);
                    if (this.__method == "POST") data = JSON.parse(__data);
                } catch (error) {
                    console.error("hookMain", __url, error);
                    return;
                }
                let url = _this.getUrlData(__url);
                await hookurl.RequestAfterhook(url, data, json);
            },
            async GetPackageInfoList(hwPartNumbers) {
                if (!Array.isArray(hwPartNumbers) || hwPartNumbers.length === 0) {
                    return [];
                }
                const results = await Promise.all(
                    hwPartNumbers.map((hwPartNumber) => this.GetPackageList("", hwPartNumber))
                );
                // 将所有结果展平为一个数组
                var Packages = results.flat();
                return new Map(Packages.map((pkg) => [pkg.ecuName + "_" + pkg.ecuModuleId + "_" + pkg.version, pkg]));
            },
            async GetPackageList(ecuName, hwPartNumber) {
                var url = "/mgapi/upgrade/packageManage/list";
                var data = {
                    importStatus: 2,
                    pageNumber: 1,
                    pageSize: 1000,
                    hwPartNumber: hwPartNumber,
                    version: "",
                    ecuModuleId: "",
                    louId: "",
                    flId: "",
                    ecuName: ecuName,
                    bmpn: "",
                    asProduct: "",
                    startUpdateTime: "",
                    endUpdateTime: "",
                    startCreateTime: "",
                    endCreateTime: "",
                    tacFixedMaturity: "",
                    ucString: "",
                    payFor: "",
                    functionType: "",
                    functionName: "",
                };

                var adminToken = localStorage.getItem("Admin-Token");
                adminToken = adminToken.replaceAll('"', "");
                const res = await this.httpRequset(url, { json: data });
                return res.data.list;
            },
            async GetCarECU99(vin = "", vehicleModelId = "") {
                var url = "/mgapi/upgrade/vehiclePart/list";
                let params = `?pageNumber=1&pageSize=100&hwPartNumber=&ecuModuleId=99&version=&vin=${vin}&modelId=${vehicleModelId}&subModelId=`;
                var adminToken = localStorage.getItem("Admin-Token");
                adminToken = adminToken.replaceAll('"', "");
                const res = await this.httpRequset(url, { params: params });
                return res.data.list;
            },
            async UploadPackageTab(url, json) {
                if (!this.PackageDes) return;
                if (json.data == undefined) return;
                if (json.data.length < 1) return;
                var locationUrl = window.location.href;
                var currentUrl = "/#/OTA/SoftwareManager/SoftwareList/AddSoftwares";
                if (!locationUrl.includes(currentUrl)) return;
                const input = document.querySelector("div.content-main > form > div > div:nth-child(4) input");
                input.maxLength = 10;
                // 版本号最大10位;
                let vin = this.vin;
                var carECU99 = await this.GetCarECU99(vin);
                const ecuMap = new Map(carECU99.map((ecu) => [ecu.hwPartNumber, ecu]));
                const elements = document.querySelectorAll("div.el-select-dropdown.el-popper >div  span");

                elements.forEach((element) => {
                    const packageInfo = ecuMap.get(element.innerHTML);
                    if (packageInfo) {
                        element.innerHTML = `${element.innerHTML}--${packageInfo.vin}`;
                    }
                });
            },
            /* ---------------------------------- 创建任务 ---------------------------------- */
            async recvTaskadd(url, data, json) {
                this.strategyid = data.strategyId;
                if (!this.AutoCreateTask) return;
                await this.GetTaskid();
                setTimeout(this.TaskStatusSwitch, 10);
            },
            async strategyCreatestatus(url, data, json) {
                let strategys = await this.GetStrategyInfo(data.strategyName);
                if (strategys.length < 1) return;
                this.strategyid = strategys[0].id;
                if (!this.MackPackageNotification && !this.AutoCreateStrategTask) return;
                setTimeout(this.strategyStatusSwitch, 2000);
            },
            async strategyStatusSwitch() {
                let strategys = await this.GetStrategyInfo("", this.strategyid);
                if (strategys.length < 1) return;
                let strategy = strategys[0];
                //strategyStatus  1:新建    2:待测试    3:测试中    4:测试通过    5:测试失败    6:应用中    7:已失效
                let status = ["0", "新建", "待测试", "测试中", "测试通过", "测试失败", "应用中", "已失效"];
                console.debug("strategyStatusSwitch :>> ", status[strategy.strategyStatus]);
                let res = false;
                switch (status[strategy.strategyStatus]) {
                    case "新建":
                        res = await this.strategyCreate(strategy);
                        if (!res) return;
                        break;
                    case "待测试":
                        res = await this.strategyTestbind(strategy);
                        if (!res) return;
                        break;
                    case "测试中":
                        res = await this.SubmitTestResult(strategy);
                        if (!res) return;
                        messageNotify("创建任务中", "loading");
                        await this.CreateTask();
                        break;
                    case "测试通过":
                    case "测试失败":
                    case "应用中":
                    case "已失效":
                        return;
                    default:
                        return;
                }
                if (!this.AutoCreateStrategTask) return;
                setTimeout(this.strategyStatusSwitch, 2500);
            },
            async strategyTestbind(strategy) {
                let url = "/mgapi/upgrade/v1/strategyTest/bind";
                await this.vinChange();
                if (this.vin == "") return;
                let data = {
                    strategyId: strategy.id,
                    strategyName: strategy.strategyName,
                    testVinList: [this.vin],
                };
                let json = await this.httpRequset(url, { json: data });
                return json.code == 1000;
            },
            async SubmitTestResult(strategy) {
                let url = "/mgapi/upgrade/v1/strategyTest/submitTestResult";
                let data = {
                    strategyId: strategy.id,
                    strategyName: strategy.strategyName,
                    strategyStatus: 1,
                    testFilePath: "",
                    testFileName: "",
                    testDesc: "",
                };
                let json = await this.httpRequset(url, { json: data });
                notify({
                    title: "策略发布完成",
                    message: "策略发布完成",
                    type: json.code == 1000 ? "success" : "error",
                    duration: this.NotifTime * 1000,
                });
                return json.code == 1000;
            },
            async strategyCreate(strategy) {
                console.debug("strategyCreate做包状态", strategy.upgradePackageStatus, strategy);
                // 0:未开始  1:进行中  2:成功  3:失败  4:失效
                let status = ["未开始", "做包中", "成功", "失败", "失效"];
                messageNotify("包状态:" + status[strategy.upgradePackageStatus]);
                if ([0, 1].includes(strategy.upgradePackageStatus)) return true;
                if (strategy.upgradePackageStatus == 4) return false;
                if (strategy.upgradePackageStatus == 3 && this.MackPackageNotification) {
                    notify({
                        title: "做包失败",
                        message: "策略id:" + strategy.id + " 做包失败",
                        type: "error",
                        duration: this.NotifTime * 1000,
                    });
                    return false;
                }
                if (strategy.upgradePackageStatus == 2 && this.MackPackageNotification) {
                    notify({
                        title: "做包成功",
                        message: "策略id:" + strategy.id + " 做包成功",
                        type: "success",
                        duration: this.NotifTime * 1000,
                    });
                }
                let url = `/mgapi/upgrade/v1/strategy/submitTest?id=${strategy.id}&strategyName=${strategy.strategyName}`;
                await this.httpRequset(url);
                return true;
            },
            async GetStrategyInfo(strategyName, strategyid = "") {
                //https://tiov-allfota-web-eu.soimt.com/mgapi/upgrade/v1/strategy/list/2
                let url = "/mgapi/upgrade/v1/strategy/list/1";
                let params = `?pageNumber=1&pageSize=1&strategyId=${strategyid}&upgradeBy=&louId=&flId=&strategyName=${strategyName}&strategyStatus=&upgradePackageStatus=&testStatus=&orderField=create_date&orderType=desc`;
                var adminToken = localStorage.getItem("Admin-Token");
                adminToken = adminToken.replaceAll('"', "");
                const res = await this.httpRequset(url, { params: params });
                return res.data.list;
            },
            // <!-- --------------------------------- 创建 ---------------------------------- -->
            async TaskStatusSwitch() {
                if (!this.AutoCreateTask) return;
                let list = await this.GetTaskInfo();
                if (list.length < 1) return;
                let task = list[0];
                // status  1:新建  2:待审核  3:审核不通过  4:审核通过  5:待发布  6:已发布  7:任务结束  8:任务异常  9:已失效
                let status = [
                    "0",
                    "新建",
                    "待审核",
                    "审核不通过",
                    "审核通过",
                    "待发布",
                    "已发布",
                    "任务结束",
                    "任务异常",
                    "已失效",
                ];
                messageNotify("任务状态:" + status[task.status]);
                var res = false;
                switch (status[task.status]) {
                    case "新建":
                        res = await this.TaskSubmit(task);
                        if (!res) return;
                        break;
                    case "待审核":
                        res = await this.taskApprove(task);
                        if (!res) return;
                        break;
                    case "审核不通过":
                        return;
                    case "审核通过":
                        res = await this.TaskCheckpublish(task);
                        if (!res) return;
                        break;
                    case "待发布":
                        setTimeout(this.TaskStatusSwitch, 1000);
                        return;
                    case "已发布":
                        document.querySelector(".el-icon-search").click();
                        if (!this.AutoCheckUpdate) return;
                        res = await this.CheckUpdate();
                        return;
                    case "任务结束":
                    case "任务异常":
                    case "已失效":
                        return;
                }
                setTimeout(this.TaskStatusSwitch, 10);
            },
            async CreateTask() {
                if (!this.AutoCreateTask) return;
                let url = "/mgapi/upgrade/task/add";
                let data = {
                    status: "",
                    taskName: this.NowDateFormat(),
                    strategyId: this.strategyid,
                    includeFuture: 1,
                    taskMode: 3,
                    downloadMode: 1,
                    createRemark: "",
                    upgradeMode: 1,
                };
                await this.httpRequset(url, { json: data });
                await this.GetTaskid();
                setTimeout(this.TaskStatusSwitch, 1);
            },
            async TaskSubmit(task) {
                let url = "/mgapi/upgrade/task/submit";
                let data = { id: task.id, taskName: task.taskName };
                let json = await this.httpRequset(url, { json: data });
                return json.code == 1000;
            },
            async taskApprove(task) {
                let url = "/mgapi/upgrade/task/approve";
                let data = {
                    id: task.id,
                    taskName: task.taskName,
                    approveStatus: 4,
                    approveRemark: "",
                };
                let json = await this.httpRequset(url, { json: data });
                return json.code == 1000;
            },
            async TaskCheckpublish(task) {
                let url = "/mgapi/upgrade/task/checkRepeatTask";
                let params = `?id=${task.id}&taskName=${task.taskName}`;
                const res = await this.httpRequset(url, { params: params });
                //有关联任务已发布
                let ret = true;
                if (res.code == 2202 && res.data.length > 0) {
                    ret = this.TaskCancelPublish(res.data[0]);
                }
                if (ret) return await this.TaskPublish(task);
            },
            async TaskPublish(task) {
                let url = "/mgapi/upgrade/task/publish";
                let newdate = new Date();
                let toTime = new Date();
                toTime = new Date(toTime.setDate(newdate.getDate() + 30));
                let data = {
                    id: task.id,
                    taskName: task.taskName,
                    fromTime: this.GetDateFormat(newdate),
                    toTime: this.GetDateFormat(toTime),
                };
                let json = await this.httpRequset(url, { json: data });
                if (json.code == 1000) {
                    notify({
                        title: "任务发布成功",
                        message: "任务id:" + task.id + " 发布成功",
                        type: "success",
                        duration: this.NotifTime * 1000,
                    });
                }
                return json.code == 1000;
            },
            async TaskCancelPublish(task) {
                let url = "/mgapi/upgrade/task/cancelPublish";
                let data = {
                    id: task.id,
                    strategyId: task.strategyId,
                    taskName: task.taskName,
                };
                let json = await this.httpRequset(url, { json: data });
                return json.code == 1000;
            },
            async GetTaskid() {
                let url = `/mgapi/upgrade/task/list?taskId=&strategyId=${this.strategyid}&pageNumber=1&pageSize=1`;
                const res = await this.httpRequset(url);
                if (res.data.list.length < 1) return;
                this.taskid = res.data.list[0].id;
                return res.code == 1000;
            },
            async GetTaskInfo() {
                let url = `/mgapi/upgrade/task/list?taskId=${this.taskid}&strategyId=&pageNumber=1&pageSize=1`;
                const res = await this.httpRequset(url);
                return res.data.list;
            },
            /* --------------------------------- //检查更新 --------------------------------- */
            async CheckUpdate() {
                let url = "/mgapi/upgrade/send/getVehicleVersion?vin=" + this.vin;
                let res = await this.httpRequset(url);
                return res.code == 1000;
            },
            // <!-- -------------------------------- 辅助函数 --------------------------------- -->
            async httpRequset(url, { params = "", json = null, method = "GET" } = {}) {
                // if (this.token) {
                //params, json = null, method = "GET"
                var token = localStorage.getItem("Admin-Token");
                this.token = token.replaceAll('"', "");
                // }
                let body = undefined;
                if (json != null) {
                    body = JSON.stringify(json);
                    method = "POST";
                }
                const response = await fetch(this.env + url + params, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.token,
                    },
                    body: body,
                });
                return await response.json();
            },
            GetDateFormat(date) {
                const year = date.getFullYear();
                const month = ("0" + (date.getMonth() + 1)).slice(-2); // 月份是从0开始的，所以加1
                const day = ("0" + date.getDate()).slice(-2);
                return `${year}-${month}-${day} 00:00:00`;
            },
            NowDateFormat() {
                const d = new Date();
                const year = d.getFullYear();
                const month = ("0" + (d.getMonth() + 1)).slice(-2); // 月份是从0开始的，所以加1
                const day = ("0" + d.getDate()).slice(-2);
                const hour = ("0" + d.getHours()).slice(-2);
                const minute = ("0" + d.getMinutes()).slice(-2);
                const second = ("0" + d.getSeconds()).slice(-2);
                return `${year}${month}${day}${hour}${minute}${second}`;
            },

            hookXHR(hookurls) {
                let _this = this;
                const originalOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function (...args) {
                    const questionMarkIndex = args[1].indexOf("?");
                    this.__api =
                        questionMarkIndex !== -1
                            ? args[1].substring(_this.env.length, questionMarkIndex)
                            : args[1].substring(_this.env.length);

                    this.__isHooked = hookurls.has(this.__api);
                    this.__method = args[0].toUpperCase();
                    this.__url = args[1];
                    if (this.__isHooked) {
                        args[1] = hookurls.get(this.__api).gethook(args[1]);
                    }
                    originalOpen.apply(this, args);
                };

                const originalSend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.send = function (...args) {
                    if (this.__isHooked) {
                        this.__data = this.__method == "POST" ? args[0] : null;
                    }
                    const response = originalSend.apply(this, args);
                    if (this.__isHooked) {
                        const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, "responseText")?.get;
                        if (getter) {
                            Object.defineProperty(this, "responseText", {
                                get: () => {
                                    var result = getter.call(this);
                                    _this.hookMain(hookurls.get(this.__api), this.__url, this.__data, result);
                                    return result;
                                },
                            });
                        }
                    }
                    return response;
                };
            },
            getUrlData(text) {
                // 获取当前页面的URL
                var url = new URL(text);
                // 获取URL参数
                var searchParams = url.searchParams;
                // 将URL参数转换为JSON对象
                url.paramsJson = {};
                for (let [key, value] of searchParams) {
                    url.paramsJson[key] = value;
                }
                return url;
            },
            startDrag(event) {
                if (this.drawerShow) return;
                this.dragging = true;
                document.addEventListener("mousemove", this.moveDiv);
                document.addEventListener("mouseup", this.stopDrag);
            },
            moveDiv(event) {
                if (this.dragging) {
                    this.position.right -= event.movementX;
                    this.position.top += event.movementY;
                    if (this.position.top < 0) this.position.top = 0;
                    if (this.position.right < -200) this.position.right = -200;
                }
            },
            stopDrag() {
                this.dragging = false;
                document.removeEventListener("mousemove", this.moveDiv);
                document.removeEventListener("mouseup", this.stopDrag);
                this.saveConfig();
            },
        },
    };

    const app = Vue.createApp(App);
    app.use(naive);
    app.mount("#xzf");
}
