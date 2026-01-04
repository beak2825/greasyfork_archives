// ==UserScript==
// @name         Njord 平台管理端插件
// @namespace    Njord admin script
// @description  Njord平台管理端增强插件
// @author       yhw
// @version      2.0.11
// @match        http://mark.meituan.com/*
// @match        https://mark.meituan.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_info
// @grant		 GM_getValue
// @grant		 GM_setValue
// @require		 https://cdn.jsdelivr.net/npm/linq-es2015@2.5.1/dist/linq.min.js
// @require		 https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js

// @downloadURL https://update.greasyfork.org/scripts/481913/Njord%20%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86%E7%AB%AF%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/481913/Njord%20%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86%E7%AB%AF%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const http_url = window.location.href.startsWith('https') ? "https://mark.meituan.com" : "http://mark.meituan.com";
    var XHR = XMLHttpRequest.prototype;

    var open = XHR.open;
    var send = XHR.send;

    XHR.open = function (method, url) {
        this._method = method;
        this._url = url;
        return open.apply(this, arguments);
    };

    XHR.send = function (postData) {
        if (this._method.toLowerCase() === 'post') {
            this.addEventListener('load', function () {
                /// 用户信息
                if (this.url.indexOf('/process/user/profile') > -1) {
                // if (this.url.startsWith('/process/user/profile')) {
                    console.log('--------用户信息');
                    var user = JSON.parse(this.response)['data'];
                    sessionStorage['valid'] = user['departmentName'] == "HT";
                    sessionStorage['user'] = JSON.stringify(user);
                    //window.postMessage({ type: 'injected', name: 'user', data: JSON.stringify(sessionStorage) }, '*');  // send to content script
                }
                /// 获取项目
                if (this.url.indexOf('/admin/project/list') > -1) {
                // if (this.url.startsWith('/admin/project/list')) {
                    console.log('--------项目列表');
                    var project = JSON.parse(this.response)['data'];
                    sessionStorage['projectlist'] = JSON.stringify(project);
                    //window.postMessage({ type: 'injected', name: 'projectlist', data: JSON.stringify(sessionStorage) }, '*');  // send to content script
                }
                /// 获取标签列表
                if (this.url.indexOf('/admin/acl/constexplain') > -1) {
                // if (this.url.startsWith('/admin/acl/constexplain')) {
                    console.log('--------获取标签列表');
                    var tags = JSON.parse(this.response)['data'];
                    sessionStorage['tags'] = JSON.stringify(tags);
                    //window.postMessage({ type: 'injected', name: 'tags', data: postData }, '*');  // send to content script
                }
                /// 查询标注人员
                if (this.url.indexOf('/admin/annotate/summary') > -1) {
                // if (this.url.startsWith('/admin/annotate/summary')) {
                    console.log('--------查询标注人员');
                    sessionStorage['summaryparams'] = postData;
                    sessionStorage['summaryurl'] = http_url+'/admin/annotate/summary';
                    //window.postMessage({ type: 'injected', name: 'labelsummary', data: postData }, '*');  // send to content script
                }
                /// 查询质检人员
                if (this.url.indexOf('/admin/check/summary') > -1) {
                // if (this.url.startsWith('/admin/check/summary')) {
                    console.log('--------查询质检人员');
                    sessionStorage['summaryparams'] = postData;
                    sessionStorage['summaryurl'] = http_url+'/admin/check/summary';
                    //window.postMessage({ type: 'injected', name: 'checksummary', data: postData }, '*');  // send to content script
                }
                /// 查询任务
                if (this.url.indexOf('/admin/annotate/loglist') > -1) {
                // if (this.url.startsWith('/admin/annotate/loglist')) {
                    console.log('--------查询任务');
                    sessionStorage['taskparams'] = postData;
                    sessionStorage['taskurl'] =  http_url+'/admin/annotate/loglist';
                    //window.postMessage({ type: 'injected', name: 'tasklist', data: postData }, '*');  // send to content script
                }
            });
        }
        return send.apply(this, arguments);
    };


    document._timer_ = setInterval(init, 1000)

    function init() {
        // 页面加载完毕
        if (document.URL.includes("/admins/")) {
            addImportElements();
            addExportElements();
        }
    }

    function addExportElements() {
        var queryButtons = document.getElementsByClassName('el-button el-button--primary'); //el-button el-button--primary
        if (queryButtons.length == 2 && queryButtons[0].innerText == '查询' && queryButtons[1].innerText == '查询') {
            var count = queryButtons.length;
            for (var i = 0, j = 0; i < count; j++) {
                var queryButton = queryButtons[j];
                if (queryButton.innerText == '查询') {
                    var exportButton = document.createElement('button');
                    exportButton.className = 'el-button el-button--primary';
                    exportButton.innerText = '导出查询数据';
                    if (i == 0) {
                        exportButton.onclick = function () { // 人员信息
                            if (sessionStorage['exportInfos'] != 'true')
                              exportUserInfos();
                            else
                               alert('当前正在导出，请等待！');
                        };
                    } else {
                        exportButton.onclick = function () { // 任务信息
                            if (sessionStorage['exportTasks'] != 'true')
                                exportTaskInfos();
                            else
                                alert('当前正在导出，请等待！');
                        }
                    }
                    queryButton.parentElement.appendChild(exportButton);
                    if (i == 1) {
                        var exportTaskRejectedButton = document.createElement('button');
                        exportTaskRejectedButton.className = 'el-button el-button--primary';
                        exportTaskRejectedButton.innerText = '导出驳回任务';
                        exportTaskRejectedButton.onclick = function () { // 驳回任务明细
                            if (sessionStorage['exportTaskReject'] != 'true')
                                exportTaskRejectedInfos();
                            else
                                alert('当前正在导出，请等待！')
                        }
                        queryButton.parentElement.appendChild(exportTaskRejectedButton);
                    }
                    i++;
                }
            }
            return true;
        }
        return false;
    }

    /// 根据session导出标注员/质检员信息
    async function exportUserInfos() {
        sessionStorage['exportInfos'] = 'true';
        const isLabeler = document.getElementsByClassName('el-radio__original')[0];
        if (isLabeler.checked)
            await exportLabelerInfos();
        else
            await exportCheckerInfos();
        sessionStorage['exportInfos'] = '';
    }

    /// 导出标注员信息
    async function exportLabelerInfos() {
        let data = await getInfos(sessionStorage['summaryurl'], sessionStorage['summaryparams'], 10);
        let xlsxData = data.map((v) => {
            let userName = v['userName'];
            const item = {};
            let index = /^[A-Z]+-/.test(userName) ? userName.indexOf('-') : -1;
            item['group'] = userName.substring(0, index);
            item['label'] = userName.substring(index + 1);
            item['departmentName'] = v['departmentName'];
            item['month'] = v['month'];
            item['validSum'] = v['annSum'] - v['discardSum'];
            item['annSum'] = v['annSum'];
            item['markDuration'] = v['extend'] == "" ? "" : JSON.parse(v['extend'])['mark_duration'];
            item['avgValidRatio'] = v['avgValidRatio'];
            item['annCount'] = v['annCount'];
            item['submitTimes'] = v['submitTimes'];
            return item;
        });
        let property = ['group', 'label', 'departmentName', 'month', 'validSum', 'annSum', 'markDuration', 'avgValidRatio', 'annCount', 'submitTimes'];
        let header = {
            group: '组',
            label: '标注员',
            departmentName: '组织',
            month: '月份',
            validSum: '有效条数',
            annSum: '总条数',
            markDuration: '验收通过时长(s)',
            avgValidRatio: '质检成功率',
            annCount: '任务包数量',
            submitTimes: '提交次数'
        };
        let sheet1 = XLSX.utils.json_to_sheet([header, ...xlsxData], { header: property, skipHeader: true });
        let workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet1, "Sheet1");
        XLSX.writeFile(workbook, '标注员信息.xlsx');
    }

    /// 导出质检员信息
    async function exportCheckerInfos() {
        let data = await getInfos(sessionStorage['summaryurl'], sessionStorage['summaryparams'], 10);
        let xlsxData = data.map((v) => {
            let userName = v['userName'];
            const item = {};
            let index = /^[A-Z]+-/.test(userName) ? userName.indexOf('-') : -1;
            item['group'] = userName.substring(0, index);
            item['label'] = userName.substring(index + 1);
            item['departmentName'] = v['departmentName'];
            item['month'] = v['month'];
            item['checkCount'] = v['checkCount'];
            item['checkSum'] = v['checkSum'];
            return item;
        });
        let property = ['group', 'label', 'departmentName', 'month', 'checkCount', 'checkSum'];
        let header = {
            group: '组',
            label: '标注员',
            departmentName: '组织',
            month: '月份',
            checkCount: '质检任务包',
            checkSum: '质检任务总数',
        };
        let sheet1 = XLSX.utils.json_to_sheet([header, ...xlsxData], { header: property, skipHeader: true });
        let workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet1, "Sheet1");
        XLSX.writeFile(workbook, '质检员信息.xlsx');
    }

    /// 导出任务信息
    async function exportTaskInfos() {
        sessionStorage['exportTasks'] = 'true';
        let tags = JSON.parse(sessionStorage['tags'])['annotateProcess'];
        let data = await getInfos(sessionStorage['taskurl'], sessionStorage['taskparams'], 10);
        let xlsxData = data.map((v) => {
            let userName = v['userName'];
            const item = {};
            let index = /^[A-Z]+-/.test(userName) ? userName.indexOf('-') : -1;
            item['annLogId'] = v['annLogId'];
            item['group'] = userName.substring(0, index);
            item['label'] = userName.substring(index + 1);
            item['validSum'] = v['annSum'] - v['discardSum'];
            item['annSum'] = v['annSum'];
            item['markDuration'] = v['extend'] == "" ? "" : JSON.parse(v['extend'])['mark_duration'];
            item['createTime'] = new Date(v['createTime']).toLocaleDateString();
            item['modifyTime'] = new Date(v['modifyTime']).toLocaleDateString();
            item['submitTimes'] = v['submitTimes'];
            item['rejectTimes'] = v['rejectTimes'];
            item['processFlag'] = tags[v['processFlag']];
            item['submitTime'] = new Date(v['submitTime']).toLocaleDateString();
            item['qulityValidRatio'] = v['qulityValidRatio'];
            return item;
        });
        let property = [
            'annLogId',
            'group',
            'label',
            'validSum',
            'annSum',
            'markDuration',
            'createTime',
            'modifyTime',
            'submitTimes',
            'rejectTimes',
            'processFlag',
            'submitTime',
            'qulityValidRatio'
        ];
        let header = {
            annLogId: '任务包ID',
            group: '组',
            label: '标注员',
            validSum: '有效条数',
            annSum: '总条数',
            markDuration: '验收通过时长(s)',
            createTime: '开始时间',
            modifyTime: '更新时间',
            submitTimes: '已提交次数',
            rejectTimes: '驳回次数',
            processFlag: '当前状态',
            submitTime: '任务提交时间',
            qulityValidRatio: '正确率'
        };
        let sheet1 = XLSX.utils.json_to_sheet([header, ...xlsxData], { header: property, skipHeader: true });
        let workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet1, "Sheet1");
        XLSX.writeFile(workbook, '任务信息.xlsx');
        sessionStorage['exportTasks'] = '';
    }

    // 导出驳回任务明细
    async function exportTaskRejectedInfos() {
        sessionStorage['exportTaskReject'] = 'true';
        try {
            let data = await getInfos(sessionStorage['taskurl'], sessionStorage['taskparams'], 10);
            let rejectData = data.filter((v) => v['submitTimes'] > 0 || v["rejectTimes"] > 0);
            let xlsxDatas = new Array();
            for (var i = 0; i < rejectData.length; i++) {
                var v = rejectData[i];
                let params = new URLSearchParams();
                params.set('projectId', new URLSearchParams(sessionStorage['taskparams']).get('projectId'));
                params.set('annLogId', v['annLogId'])
                let detail = await getInfos(http_url+'/admin/annotate/detaillist', params, 0); // 获取每个项目的明细列表
                let items = Enumerable.asEnumerable(detail)
                    .select((v1, i1) => { return { index: i1, item: v1 }; })
                    .where(v2 => { return v2['item']['checkFlag'] != 0 }) // 获取明细列表中有质检信息的数据
                    .select(v3 => {
                        let checkNote = v3['item']['checkNote'] == "" ? new Array() : JSON.parse(v3['item']['checkNote']);
                        const item = {};
                        item['任务包ID'] = v['annLogId'];
                        item['标注人员'] = v['userName'];
                        item['任务编号'] = v3['index'] + 1;
                        item['内检次数'] = 0;
                        item['质检次数'] = 0;
                        for (var i = checkNote.length-1,j = 0; i >= 0; i--,j++) {
                            let note = checkNote[i];
                            item['质检时间' + (j + 1)] = note['note_time'];
                            item['质检类型' + (j + 1)] = note['level'] == 0 ? '内检' : '质检';
                            if (note['level'] == 0) {
                                item['内检次数'] += 1;
                            } else {
                                item['质检次数'] += 1;
                            }
                            item['质检员' + (j + 1)] = note['name'];
                            item['驳回原因' + (j + 1)] = note['note'];
                            item['错误类型' + (j + 1)] = getErrorType(note['note']);
                        }
                        return item;
                    })
                    .toArray();
                xlsxDatas.push(items);
            }

            let xlsxData = Enumerable.asEnumerable(xlsxDatas).selectMany(_ => _).toArray();
            let sheet1 = XLSX.utils.json_to_sheet(xlsxData);
            let workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, sheet1, "Sheet1");
            XLSX.writeFile(workbook, '驳回任务明细.xlsx');
        } finally {
            sessionStorage['exportTaskReject'] = '';
        }
    }

    function getErrorType(content) {
        if (content.indexOf('内容') >= 0
            || content.indexOf('文本') >= 0
            || content.indexOf('错字') >= 0
            || content.indexOf('错别字') >= 0
            || content.indexOf('多字') >= 0
            || content.indexOf('少字') >= 0
            || content.indexOf('丢字') >= 0
            || content.indexOf('格式') >= 0
            || content.indexOf('拼音') >= 0
            || content.indexOf('空格') >= 0
            || content.indexOf('标点') >= 0
        )
            return '内容';
        if (content.indexOf('截取') >= 0
            || content.indexOf('切音') >= 0
            || content.indexOf('避开') >= 0
        )
            return '截取';
        if (content.indexOf('有效') >= 0
            || content.indexOf('可转写') >= 0)
            return '有效';
        if (content.indexOf('无效') >= 0
            || content.indexOf('废弃') >= 0
            || content.indexOf('作废') >= 0
        )
            return '无效';
        if (content.indexOf('儿化音') >= 0
            || content.indexOf('er') >= 0
        )
            return '儿化音';
        if (content.indexOf('性别') >= 0
            || content.indexOf('男') >= 0
            || content.indexOf('女') >= 0
        )
            return '性别';
        if (content.indexOf('口音') >= 0)
            return '口音';
        if (content.indexOf('噪声') >= 0
            || content.indexOf('噪音') >= 0
        )
            return '噪声';
    }


    /**
     * 根据传入的url或参数获取信息
     * @param {string} url
     * @param {string|URLSearchParams} params
     * @param {number} pageSize
     */
    async function getInfos(url, params, pageSize) {
        var data = new Array();
        var myHeaders = new Headers();
        myHeaders.append("X-TOKEN", sessionStorage['adminstoken']);
        myHeaders.append("Cookie", document.cookie);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var pageIndex = 0;
        var pageTotal = 1;
        for (; pageIndex < pageTotal; pageIndex++) {
            var urlencoded = new URLSearchParams(params);
            if (pageSize > 0) {
                urlencoded.set('page', pageIndex);
                urlencoded.set('pageSize', pageSize);
            }

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            // retry 5 times
            for (var i = 0; i < 5; i++) {
                let isBreak = false;
                await fetch(url, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        pageTotal = pageSize <= 0 ? pageTotal : Math.ceil(result['data']['total'] / pageSize);
                        data = data.concat(result['data']['data'])
                        isBreak = true;
                    })
                    .catch(error => console.log('error', error));
                if (isBreak)
                    break;
            }
        }
        return data;
    }

    /// 添加导入excel相关的按钮
    function addImportElements() {
        var mains = document.getElementsByClassName('el-main');
        if (mains.length == 0 || mains[0].children.length == 0) return;
        var main = mains[0].children[0];
        if (main.children.length == 1) {
            var ol = document.createElement('ol');
            main.append(ol);
        }
        var addButtons = document.getElementsByClassName('el-button add-btn pull-right el-button--text');
        if (addButtons != undefined && addButtons.length == 1 && addButtons[0].parentElement.children.length == 2) {
            var inputElement = addButtons[0].parentElement.insertBefore(document.createElement('input'), addButtons[0]);
            inputElement.setAttribute('id', 'inputExcel');
            inputElement.setAttribute('type', 'file');
            var importButton = addButtons[0].parentElement.insertBefore(document.createElement('button'), addButtons[0]);
            importButton.innerText = '[导入Excel]';
            importButton.onclick = function () {
                let e = document.getElementById('inputExcel');
                var mains = document.getElementsByClassName('el-main');
                var main = mains[0].children[0];
                if (main.children.length == 2) {
                    var ol = main.children[1];
                    ol.innerHTML = '';
                }
                [].slice.call(e.files).forEach(file => {
                    importExcel(file);
                });
            };
            return true;
        }
        return false;
    }

    /// 添加导入excel时的报错信息
    function addErrorMessage(message) {
        var mains = document.getElementsByClassName('el-main');
        var main = mains[0].children[0];
        if (main.children.length == 2) {
            var ol = main.children[1];
            var li = document.createElement('li');
            li.innerText = message;
            ol.append(li);
        }
    }

    // 批量导入excel用户信息
    function importExcel(file) {
        var fileReader = new FileReader();
        fileReader.onload = async function (ev) {
            try {
                var data = ev.target.result
                var workbook = XLSX.read(data, {
                    type: 'binary'
                }) // 以二进制流方式读取得到整份excel表格对象
            } catch (e) {
                alert('文件类型不正确');
                return;
            }
            var count = 0;
            var total = 0;
            // 表格的表格范围，可用于判断表头是否数量是否正确
            var fromTo = '';
            // 遍历每张表读取
            for (var sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    var person = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                    for (let index = 0; index < person.length; index++) {
                        const element = person[index];
                        let item = {};
                        let j = 0;
                        for (var key in element) {
                            if (j == 1) {
                                item.trueName = element[key];
                            }
                            if (j == 2) {
                                item.phoneNum = element[key];
                            }
                            if (j == 3) {
                                item.userName = element[key];
                            }
                            j++;
                        }
                        item.departmentId = 35;
                        total++;
                        await fetch(http_url+'/admin/member/add', {
                            method: 'POST',
                            headers:
                            {
                                'Cookie': document.cookie,
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'X-TOKEN': sessionStorage['adminstoken']
                            },
                            body: new URLSearchParams(Object.entries(item)).toString()
                        }).then(async (response) => {
                            var json = await response.json();
                            var itemJson = JSON.stringify(item);
                            if (response.status != 200) {
                                addErrorMessage(itemJson + '导入失败:请求失败' + response.statusText);
                            } else if (json.errNo != 0) {
                                addErrorMessage(itemJson + '导入失败:' + json.errMsg);
                            } else { count++; }
                            console.log(json);
                        }).catch((err) => {
                            console.log(err)
                        });
                    }
                    break; // 如果只取第一张表
                }
            }
            alert('成功导入' + count + '条数据' + '\n' + '总共' + total + '条数据');
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file);
    }

})();