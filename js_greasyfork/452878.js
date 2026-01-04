// ==UserScript==
// @name         小米路由器(mini)PC端设备实时网速
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  小米路由器(mini)PC端后台管理界面设备实时网速
// @author       过去终究是个回忆
// @license      MIT
// @match        http://192.168.31.1/cgi-bin/luci/*/web/home*
// @require      https://registry.npmmirror.com/dayjs/1.10.8/files/dayjs.min.js
// @require      https://registry.npmmirror.com/vue/2.7.16/files/dist/vue.min.js
// @require      https://registry.npmmirror.com/ajax-hook/2.1.3/files/dist/ajaxhook.min.js
// @require      https://registry.npmmirror.com/element-ui/2.15.14/files/lib/index.js
// @require      https://registry.npmmirror.com/echarts/5.3.0/files/dist/echarts.min.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_addStyle
// @grant        unsafeWindow
// @resource     element-ui https://registry.npmmirror.com/element-ui/2.15.14/files/lib/theme-chalk/index.css
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/452878/%E5%B0%8F%E7%B1%B3%E8%B7%AF%E7%94%B1%E5%99%A8%28mini%29PC%E7%AB%AF%E8%AE%BE%E5%A4%87%E5%AE%9E%E6%97%B6%E7%BD%91%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/452878/%E5%B0%8F%E7%B1%B3%E8%B7%AF%E7%94%B1%E5%99%A8%28mini%29PC%E7%AB%AF%E8%AE%BE%E5%A4%87%E5%AE%9E%E6%97%B6%E7%BD%91%E9%80%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(GM_getResourceText('element-ui'))
    GM_addStyle(`
        @font-face{font-family:element-icons;src:url(https://registry.npmmirror.com/element-ui/2.15.14/files/lib/theme-chalk/fonts/element-icons.woff) format("woff"),url(https://registry.npmmirror.com/element-ui/2.15.14/files/lib/theme-chalk/fonts/element-icons.ttf) format("truetype");font-weight:400;font-display:"auto";font-style:normal}
        #net-speed {
            float: left;
            margin-top: 40px;
            width: 100%;
            }
            .demo-table-expand {
            font-size: 0;
        }
        .speed-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .speed-line div[role="progressbar"] {
            width: 300px;
        }
        #net-speed-charts {
            height: 600px;
        }
    `)

    const maxEachDataStorage = Number.MAX_SAFE_INTEGER // 100
    const updateDevDataEvent = new Event('updateDevData')
    const initData = {
        history: {},
        tableData: []
    }

    window.ah.proxy({
        //请求成功后进入
        onResponse: (response, handler) => {
            if (response.config.url.includes('/api/misystem/status')) {
                const data = JSON.parse(response.response)
                initData.tableData = data.dev.map(item => ({
                    ...item,
                    download: Number(item.download),
                    downspeed: Number(item.downspeed),
                    maxdownloadspeed: Number(item.maxdownloadspeed),
                    maxuploadspeed: Number(item.maxuploadspeed),
                    online: Number(item.online),
                    upload: Number(item.upload),
                    upspeed: Number(item.upspeed),
                    dateSecond: Date.now(),
                    combinedSpeed: Number(item.upspeed) + Number(item.downspeed),
                }))
                data.dev.forEach(item => {
                    if (!initData.history[item.mac]) {
                        initData.history[item.mac] = []
                    }
                    initData.history[item.mac].push({
                        ...item,
                        dateSecond: Date.now(),
                    })
                    if (initData.history[item.mac].length > maxEachDataStorage) {
                        initData.history[item.mac].shift()
                    }
                })
                document.dispatchEvent(updateDevDataEvent)
            }
            handler.next(response)
        }
    }, unsafeWindow)

    window.onload = function () {
        const container = document.createElement('div')
        container.id = 'net-speed'
        console.log('net-speed starting...')

        const target = document.querySelector('#bd>.mod-routerstatus.nav-tab-content')
        target.appendChild(container)

        new Vue({
            el: container,
            data() {
                return {
                    dialogTableTitle: 'dialogTableTitle',
                    dialogTableVisible: false,
                    currentRow: {},
                    history: {},
                    tableData: [],
                    dataSource: 1,
                    stok: '',
                    totalDownloadSpeed: 0,
                    totalUploadSpeed: 0,
                    myChart: null,
                }
            },
            async created() {
                this.stok = location.pathname.match(/\/;stok=(.*?)\//)?.[1]
                this.history = initData.history
                this.tableData = initData.tableData
                document.addEventListener("updateDevData", () => {
                    if (this.dataSource === 1) {
                        this.history = initData.history
                        this.tableData = initData.tableData
                        if (this.myChart) {
                            const $row = this.history[this.currentRow.mac]
                            this.myChart.setOption({
                                xAxis: {
                                    data: $row.map(item => this.dateTimeFormatter(item.dateSecond))
                                },
                                series: [
                                    {
                                        name: '上传',
                                        data: $row.map(item => item.upspeed)
                                    },
                                    {
                                        name: '下载',
                                        data: $row.map(item => item.downspeed)
                                    },
                                ]
                            });
                        }
                        console.log(this.tableData, 'this.tableData')
                        console.log(this.history, 'this.history')
                    }
                })
                const res = await this.getBbandwidth()
                this.totalDownloadSpeed = res.bandwidth / 8 * 1024 * 1024
                this.totalUploadSpeed = res.bandwidth2 / 8 * 1024 * 1024

                window.addEventListener('resize', () => {
                    this.myChart && this.myChart.resize();
                });
            },
            watch: {
                dataSource(prev, next) {
                    if (prev !== next) {
                        this.history = []
                        this.tableData = []
                        if (next === 2) {

                        }
                    }
                },
            },
            methods: {
                byteFormat: byteFormat,
                secondToDate: secondToDate,
                speedFormat(number, precision, isarray) {
                    return this.byteFormat(number, precision, isarray) + '/S'
                },
                speedFormatter(row, column, cellValue) {
                    return this.speedFormat(cellValue, 100)
                },
                dataFormatter(row, column, cellValue) {
                    return this.byteFormat(cellValue, 100)
                },
                secondFormatter(row, column, cellValue) {
                    return this.secondToDate(cellValue)
                },
                dateTimeFormatter(cellValue) {
                    return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
                },
                showHistoryData(row) {
                    this.dialogTableVisible = true
                    this.dialogTableTitle = `${row.devname}(${row.mac}) 历史数据`
                    this.currentRow = row
                    const $row = this.history[this.currentRow.mac]
                    this.$nextTick(() => {
                        this.myChart = echarts.init(document.getElementById('net-speed-charts'));
                        // 绘制图表
                        this.myChart.setOption({
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'cross',
                                    label: {
                                        backgroundColor: '#6a7985'
                                    }
                                }
                            },
                            dataZoom: [
                                {
                                    show: true,
                                    realtime: true,
                                    start: 0,
                                    end: 100
                                },
                                {
                                    type: 'inside',
                                    realtime: true,
                                    start: 0,
                                    end: 100
                                },
                            ],
                            color: ['#2673bf', '#33cc33'],
                            legend: {
                                data: ['上传', '下载']
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    boundaryGap: false,
                                    data: $row.map(item => this.dateTimeFormatter(item.dateSecond)),
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    axisLabel: {
                                        formatter: (value) => this.speedFormat(value, 100),
                                    },
                                }
                            ],
                            series: [
                                {
                                    name: '上传',
                                    type: 'line',
                                    areaStyle: {},
                                    tooltip: {
                                        valueFormatter: (value) => this.speedFormat(value, 100)
                                    },
                                    emphasis: {
                                        focus: 'series'
                                    },
                                    data: $row.map(item => item.upspeed)
                                },
                                {
                                    name: '下载',
                                    type: 'line',
                                    areaStyle: {},
                                    tooltip: {
                                        valueFormatter: (value) => this.speedFormat(value, 100)
                                    },
                                    emphasis: {
                                        focus: 'series'
                                    },
                                    data: $row.map(item => item.downspeed)
                                },
                            ]
                        });

                    })
                },
                beforeDialogTableClose(done) {
                    this.myChart.dispose()
                    this.myChart = null
                    done()
                },
                async getBbandwidth() {
                    const res = await fetch(`/cgi-bin/luci/;stok=${this.stok}/api/misystem/bandwidth_test?history=1`).then(result => result.json())
                    if (res.code === 0) {
                        return res
                    } else {
                        throw res;
                    }
                },
                async updateNetSpeed() {
                    const res = await fetch(`/cgi-bin/luci/;stok=${this.stok}/api/misystem/devicelist`).then(result => result.json())
                    if (res.code === 0) {
                        const devList = res.data.map(item => ({ ...item, ...item.statistics, ip: item.ip[0].ip }))
                        this.tableData = devList
                    }
                }
            },
            template: `
            <div id="net-speed">
                <div style="margin-bottom: 20px;">
                    数据来源（切换会清空历史记录）：
                    <el-radio-group v-model="dataSource">
                        <el-tooltip content="性能开销小" placement="top">
                            <el-radio-button :label="1">请求代理</el-radio-button>
                        </el-tooltip>
                        <el-tooltip content="通用、设备全（尚未开发）" placement="top">
                            <el-radio-button :label="2" disabled>主动请求</el-radio-button>
                        </el-tooltip>
                    </el-radio-group>
                </div>
                <el-table
                    v-loading="!tableData.length"
                    :data="tableData"
                    :default-sort="{prop: 'combinedSpeed', order: 'descending'}"
                    border
                    fit
                    max-height="500px"
                    style="width: 100%;"
                >
                    <el-table-column
                        prop="devname"
                        label="设备"
                        sortable
                        width="200"
                    />
                    <el-table-column
                        prop="mac"
                        label="MAC"
                        sortable
                        width="148"
                    />
                    <el-table-column
                        prop="combinedSpeed"
                        label="网速"
                        width="540"
                        sortable
                        sort-by="combinedSpeed"
                    >
                        <template slot-scope="scope">
                            <p class="speed-line">上传速度: <el-progress :percentage="scope.row.upspeed / totalUploadSpeed * 100" :show-text="false" color="#2673bf"></el-progress>{{speedFormat(scope.row.upspeed, 100)}}</p>
                            <p class="speed-line">下载速度: <el-progress :percentage="scope.row.downspeed / totalDownloadSpeed * 100" :show-text="false" color="#33cc33"></el-progress>{{speedFormat(scope.row.downspeed, 100)}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="maxuploadspeed"
                        label="历史最大上传速度"
                        width="158"
                        sortable
                        :formatter="speedFormatter"
                    />
                    <el-table-column
                        prop="maxdownloadspeed"
                        label="历史最大下载速度"
                        width="158"
                        sortable
                        :formatter="speedFormatter"
                    />
                    <el-table-column
                        prop="upload"
                        label="上传流量"
                        width="102"
                        sortable
                        :formatter="dataFormatter"
                    />
                    <el-table-column
                        prop="download"
                        label="下载流量"
                        width="102"
                        sortable
                        :formatter="dataFormatter"
                    />
                    <el-table-column
                        prop="online"
                        label="在线时间"
                        width="140"
                        sortable
                        :formatter="secondFormatter"
                    />
                    <el-table-column
                        prop="devname"
                        label="操作"
                        fixed="right"
                    >
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="showHistoryData(scope.row)">历史数据</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog :title="dialogTableTitle" :visible.sync="dialogTableVisible" :before-close="beforeDialogTableClose" width="80%">
                    <div id="net-speed-charts"></div>
                </el-dialog>
            </div>
        `
        })
    }
})();