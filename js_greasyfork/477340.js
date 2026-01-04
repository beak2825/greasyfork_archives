// ==UserScript==
// @name         bizMonitorDataSync
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  拉取业务监控数据同步飞书
// @author       You
// @match        https://skynet-grafana.prod.qima-inc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qima-inc.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477340/bizMonitorDataSync.user.js
// @updateURL https://update.greasyfork.org/scripts/477340/bizMonitorDataSync.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const appToken = 'WeBcbLEs8aN3uAsKGRPcoOGxnwd';
    const summaryTableId = 'tblXj9vTMcPR13Mf';
    const timeoutTableId = 'tblhkZ34f0zOmSWU';
    const errorTableId = 'tblmdubX4OuLOd6d';
    const summaryPanelTitle = '总数表';
    const timeoutPanelTitle = '超时分类表';
    const errorPanelTitle = '错误分类表';

    const grafanaPanel2FeishuTableIdMap = {
        [summaryPanelTitle]: summaryTableId,
        [timeoutPanelTitle]: timeoutTableId,
        [errorPanelTitle]: errorTableId
    };


    function craeteFetchBtn() {
        const btn = document.createElement('button');
        btn.innerHTML = '更新飞书表格';
        btn.style.position = 'fixed';
        btn.style.top = '100px';
        btn.style.right = '100px';
        btn.style.width = '100px';
        btn.style.height = '50px';
        document.body.appendChild(btn);

        btn.addEventListener('click', updateFeishuTable);
    }

    /**
    * @returns {Object} 返回数据用于请求详细的面板数据，返回结构为 Record<'总数表' | '超时分类表' | '错误分类表', { info: object; requestData: { params: object; queries: object }}>
    */
    function getPanelRequestConfig() {
        const panelId = 'RF-E5PQ4k';
        const panelTitles = [summaryPanelTitle, timeoutPanelTitle, errorPanelTitle];
        return window.axios({
            url: `https://skynet-grafana.prod.qima-inc.com/api/dashboards/uid/${panelId}`,
            method: "GET"
        }).then(res => {
            if(res.status === 200) {
                const { panels } = res.data.dashboard;
                const usablePanelConfigs = panels.filter((c, index) => panelTitles.includes(c.title));
                const result = {};
                usablePanelConfigs.forEach((c, i) => {
                    const endDate = window.dayjs(new Date()).endOf('date');
                    const startDate = endDate.subtract(7, 'day');
                    result[c.title] = {
                        info: {
                            legendFormat: c.title
                        },
                        requestData: {
                            params: {
                                granularity: {
                                    len: 60,
                                    unit: 's'
                                },
                                others: {},
                                timeRange: {
                                    startTimeSecond: startDate.unix(),
                                    endTimeSecond: endDate.unix()
                                }
                            },
                            queries: c.targets.map(t => ({
                                initialInputMetric: "wsc",
                                mql: t.mql,
                                queryId: `Q${100+i}_${t.refId}`,
                                legend: t.legendFormat
                            }))
                        }
                    }
                })
                return result;
            }
        })
    }

    /**
    * @return {Array}
    */
    function getPanelData(data) {
        return window.axios({
            url: 'https://ops.qima-inc.com/v3/skynet/v2/mql:execute',
            method: 'POST',
            headers: {
                'Sec-Fetch-Size': 'same-site',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'X-Yz-Bu': 'main',
                'X-Yz-Env': 'prod'
            },
            data
        }).then(res => {
            if (res.status === 200) {
                return res.data.results.map((r, i) => {
                        const title = data.queries[i].legend;
                        return [title, r.timeSeries[0].dataPoints.reduce((t, c) => {
                            // 取当天的23:59时间戳
                            const key = +window.dayjs(c.timestamp / 1000).endOf('date').valueOf();
                            if (!t[key]) t[key] = 0;
                            t[key] += c.value;
                            return t;
                        } , {})]
                    })
            }
        })
    }

    function getReleaseList(param) {
        return window.axios({
            url: "https://edp.prod.qima-inc.com/api/feishu/proxy",
            method: "POST",
            data: {
                url: `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${param.tableId}/records`,
                data: {
                    view_id: 'vewifaEU8B',
                    page_size: 200
                },
                method: "GET"
            },
            withCredentials: true
        }).then(res => {
            if(res.status === 200) {
                if(res.data.code === 0) {
                    return res.data.data
                }
            }
        })
    }

    function batchUpdateReleaseData(param) {
        return window.axios({
            url: "https://edp.prod.qima-inc.com/api/feishu/proxy",
            method: "POST",
            data: {
                url: `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${param.tableId}/records/batch_update`,
                data: {
                    records: param.data
                },
                method: "POST"
            },
            withCredentials: true
        }).then(res => {
            if(res.status === 200) {
                if(res.data.code === 0) {
                    return res.data.data
                }
            }
        })
    }

    function batchCreateReleaseData(param) {
        return window.axios({
            url: "https://edp.prod.qima-inc.com/api/feishu/proxy",
            method: "POST",
            data: {
                url: `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${param.tableId}/records/batch_create`,
                data: {
                    records: param.data
                },
                method: "POST"
            },
            withCredentials: true
        }).then(res => {
            if(res.status === 200) {
                if(res.data.code === 0) {
                    return res.data.data
                }
            }
        })
    }


    function updateFeishuTable() {
        // 先拉配置
        getPanelRequestConfig().then(res => {
            Object.entries(res).forEach(([key, value]) => {
                // 获取看板详细数据
                getPanelData(value.requestData).then(res => {
                    // 格式化格式
                    const data = res.map(d => {
                        const [type, dataMapByDate ] = d;
                        return Object.entries(dataMapByDate).map(([date, value]) => {
                            const result = {
                                类型: type,
                                日期: +date,
                                数量: value
                            };
                            return result;
                        })
                    }).flat();
                    console.log(data)
                    // 根据配置匹配飞书表格
                    const tableId = grafanaPanel2FeishuTableIdMap[key];
                    getReleaseList({ tableId }).then(res => {
                        console.log(res.items);
                        // 新增or更新
                        const updateData = [];
                        const addData = [];
                        for (let i = 0, l = data.length; i < l; i++) {
                            const newData = data[i];
                            for (let j = 0; j < res.items.length; j++) {
                                const record = res.items[j];
                                if (record.fields['日期'] === newData['日期'] && record.fields['类型'] === newData['类型']) {
                                    if (+record.fields['数量'] !== newData['数量']) {
                                        record.fields['数量'] = newData['数量'];
                                        updateData.push(record);
                                    }
                                    res.items.splice(j, 1);
                                    break;
                                }
                                if (j === res.items.length - 1) {
                                    addData.push({ fields: newData });
                                }
                            }    
                        }
                        if (updateData.length > 0) {
                            batchUpdateReleaseData({
                                tableId,
                                data: updateData
                            }).then(res => alert('更新成功'))
                        }
                        if (addData.length > 0) {
                            batchCreateReleaseData({
                                tableId,
                                data: addData
                            }).then(res => alert('新增成功'))
                        }


                    })
                }).catch(err => {
                    console.log(err)
                    alert('更新异常')
                })
            });
        })
    }

    craeteFetchBtn();
})();