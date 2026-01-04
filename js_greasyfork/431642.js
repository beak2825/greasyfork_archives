// ==UserScript==
// @name         阿里云日志
// @version      1.1
// @author       hx
// @match        https://sls.console.aliyun.com/lognext/project/ymt-crm-log/logsearch/crm-debug-log*
// @icon         https://www.google.com/s2/favicons?domain=aliyun.com
// @description  阿里云日志排序
// @grant        none
// @namespace https://greasyfork.org/users/762977
// @downloadURL https://update.greasyfork.org/scripts/431642/%E9%98%BF%E9%87%8C%E4%BA%91%E6%97%A5%E5%BF%97.user.js
// @updateURL https://update.greasyfork.org/scripts/431642/%E9%98%BF%E9%87%8C%E4%BA%91%E6%97%A5%E5%BF%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let maxPage = 4;
    window.au_fetch = window.fetch;
    window.paramFun = function (param) {
        var o, s = {},
            a = decodeURI(param).split("&");
        for (var c in a) s[(o = a[c].split("="))[0]] = o[1];
        return s;
    };
    window.fetch = function (url) {
        let params = arguments.length > 1 ? arguments[1] : {};
        return window.au_fetch.apply(window, arguments).then((response) => {
            if (!my) {
                my = {
                    isUrlHook: function() {
                        return false;
                    }
                };
            }
            if (!my.isUrlHook(url, params) || !my.modifyData) {
                console.log('直接返回');
                return response;
            }
            const reader = response.body.getReader();
            const stream = new ReadableStream({
                start(controller) {
                    let valArr = [];
                    function getNewValArr8() {
                        let newValArr8 = new Uint8Array(valArr);
                        let oldVal = new TextDecoder("utf-8").decode(newValArr8);
                        if (my.isUrlHook(url, params) && my.modifyData) {
                            let newVal = my.modifyData(url, params, oldVal);
                            if (typeof(newVal) != 'string') {
                                newVal = JSON.stringify(newVal);
                            }
                            newValArr8 = new TextEncoder("utf-8").encode(newVal);
                        }
                        return newValArr8;
                    }
                    function push() {
                        // "done"是一个布尔型，"value"是一个Unit8Array
                        reader.read().then((e) => {
                            let {done, value} = e;
                            // 判断是否还有可读的数据？
                            if (done) {
                                // 取得数据并将它通过controller发送给浏览器
                                controller.enqueue(getNewValArr8());
                                // 告诉浏览器已经结束数据发送
                                controller.close();
                                return;
                            }
                            // valArr.push(...value);
                            valArr = [...valArr, ...value];
                            // valArr.push.apply(valArr, value)
                            push();
                        });
                    }
                    push();
                }
            });
            let ret = new Response(stream, {
                headers: {
                    "Content-Type": "text/html"
                }
            })
            return ret;
        });
    };

    window.my = {
        count: 0,
        isUrlHook: function(url, params) {
            return url.indexOf('/console/logstoreindex/getLogs.json') != -1 || url.indexOf('/console/logstoreindex/getHistograms.json') != -1;
        },
        setCount: function(data) {
            if (!data.success) {
                return;
            }
            my.count = data.data.count;
        },
        modifyData(url, params, data) {
            let dataObj = {};
            try {
                dataObj = JSON.parse(data);
            } catch (e) {
                console.error('转换 json 异常', data);
                alert('json 转换异常');
                debugger
                return data;
            }
            if (url.indexOf('/console/logstoreindex/getHistograms.json') != -1) {
                my.setCount(dataObj);
                return data;
            }
            let logs = dataObj.data.logs;
            let reqParam = paramFun(params.body);
            let asc = 'true' == reqParam.Reverse;
            let pageSize = reqParam.Size * 1;
            let maxNum = maxPage * pageSize;
            function getNextData(reqParam, page) {
                let nextData = [];
                let form = new FormData();
                Object.keys(reqParam).forEach(function(key) {
                    let val = reqParam[key];
                    if (key == "Page") {
                        val = page;
                    }
                    form.append(key, decodeURIComponent(val));
                });
                let httpRequest = new XMLHttpRequest();
                httpRequest.open("POST", "/console/logstoreindex/getLogs.json", false);
                httpRequest.onload = function (e) {
                    nextData = JSON.parse(e.target.responseText).data.logs;
                }
                httpRequest.send(form);
                return nextData;
            }
            // 如果总数大于分页数且总数小于要获取的最大数且是第一页
            if (my.count > pageSize && my.count <= maxNum && reqParam.Page * 1 == 1) {
                // 如果是第一页并且结果不小于分页大小
                // if (logs.length >= pageSize && reqParam.Page * 1 == 1) {
                let nextDatas = [];
                for (let i = 1, len = maxPage; i <= len; i++) {
                    let nextData = getNextData(reqParam, reqParam.Page * 1 + i);
                    if (nextData.length == 0) {
                        break;
                    }
                    nextDatas.push.apply(nextDatas, nextData);
                    if (nextData.length < pageSize) {
                        break;
                    }
                }
                if (nextDatas.length < maxNum) {
                    logs.push.apply(logs, nextDatas);
                }
            }
            logs.sort(function(log1, log2) {
                let log1s = log1.content.substr(0, log1.content.indexOf(' ')).split(/:|\./g);
                let log2s = log2.content.substr(0, log2.content.indexOf(' ')).split(/:|\./g);
                for (let i = 0, len = log1s.length; i < len; i++) {
                    let log1Num = log1s[i] * 1, log2Num = log2s[i] * 1;
                    if (asc) {
                        if (log1Num > log2Num) {
                            return -1;
                        }
                        if (log1Num < log2Num) {
                            return 1;
                        }
                        continue;
                    }
                    if (log1Num > log2Num) {
                        return 1;
                    }
                    if (log1Num < log2Num) {
                        return -1;
                    }
                }
                return 0;
            });
            return dataObj;
        }
    };
})();