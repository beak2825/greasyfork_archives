// ==UserScript==
// @name         飞书任务管理-自动填充任务总工时
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  自动填充任务总工时
// @author       xiaolong、xulei
// @match        https://k7n084n7rx.feishu.cn/base/bascnxklVJQ9VqGGkc4bmu3YJPb*
// @match        https://k7n084n7rx.feishu.cn/base/BmGUb5Zp6a9WCasthF1cAWhTnSn*
// @match        https://d5t3la2r90.feishu.cn/base/As2abCpPZaItARsJYNpc5f2Fn8b*
// @match        https://ai.feishu.cn/base/DZ4pbG7XzaEsQpsCP1jcG4oQnsg*
// @icon         https://www.feishu.cn/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/layer/3.5.1/layer.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     layerCSS https://cdnjs.cloudflare.com/ajax/libs/layer/3.5.1/theme/default/layer.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.7.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.14/index.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @resource     ElementCSS https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.14/theme-chalk/index.min.css
// @connect *
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/459172/%E9%A3%9E%E4%B9%A6%E4%BB%BB%E5%8A%A1%E7%AE%A1%E7%90%86-%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E4%BB%BB%E5%8A%A1%E6%80%BB%E5%B7%A5%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/459172/%E9%A3%9E%E4%B9%A6%E4%BB%BB%E5%8A%A1%E7%AE%A1%E7%90%86-%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E4%BB%BB%E5%8A%A1%E6%80%BB%E5%B7%A5%E6%97%B6.meta.js
// ==/UserScript==

// @Date         2023-01-18 08:49:11
// @LastEditors  xiaolong
// @LastEditTime 2024-11-29
// Docs          【腾讯文档】自动填充任务总工时 油猴脚本使用说明 https://docs.qq.com/doc/DSGtZUE1Kd0FiY2NR


GM_addStyle(GM_getResourceText('layerCSS'));

// global variables
(function() {
    window.app_token = window.location.pathname.split('/base/').length ? window.location.pathname.split('/base/')[1] : '';
    if(!window.app_token) {return false;}

    var groupData = {// 一张多维表对应一个分组
        'BmGUb5Zp6a9WCasthF1cAWhTnSn': [
        {label: '大数据组', value: 1},
        {label: '一网协同组', value: 2},
        {label: '一网统管组', value: 3},
        {label: '一网通办组', value: 4},
        {label: '智能设备组', value: 5}
        ],
        'bascnxklVJQ9VqGGkc4bmu3YJPb': [
        {label: '大数据组', value: 1},
        {label: '一网协同组', value: 2},
        {label: '一网统管组', value: 3},
        {label: '一网通办组', value: 4},
        {label: '智能设备组', value: 5}
        ],
        'As2abCpPZaItARsJYNpc5f2Fn8b': [
        {label: '1组', value: 1},
        {label: '2组', value: 2},
        {label: '3组', value: 3}
        ],
        'DZ4pbG7XzaEsQpsCP1jcG4oQnsg': [
        {label: '1组', value: 1},
        {label: '2组', value: 2},
        {label: '3组', value: 3}
        ]
    };

    var memberData = [
        {id: '智能设备组', value: '肖龙', manager: '肖龙'},
        {id: '一网协同组', value: '王凯,王培培,王志超,杨恒,王凯(前端研发3部)', manager: '王凯'},
        {id: '一网统管组', value: '高丽,秦欣玥,衡海江,金娟', manager: '高丽'},
        {id: '一网通办组', value: '顾逸聪,周杰,周杰(前端研发3部)', manager: ''},
        {id: '大数据组', value: '徐磊,郭瀚钰,贺云龙,蒋高明,徐磊(前端研发3部)', manager: '徐磊'},
        {id: '1组', value: '赵阳,井宇轩,谢环志,范新悦,汤浩,汤浩(前端研发4部)', manager: '赵阳'},
        {id: '2组', value: '武洲,黄鑫慧,沈小炜,钱雨婷,瞿超楠,钱雨婷(前端研发4部),钱雨婷(前端研究中心)', manager: '武洲'},
        {id: '3组', value: '黄聪,胡家华,瞿国强,赵丁琪,徐海,许佳伟,高婧', manager: '黄聪'}
    ];

    var FeishuPluginConfig = {
        departName : (window.app_token === 'As2abCpPZaItARsJYNpc5f2Fn8b' || window.app_token === 'DZ4pbG7XzaEsQpsCP1jcG4oQnsg') ? '前端研发4部': '前端研发3部',
        group: groupData[window.app_token],
        memberData: memberData
    };

    window.FeishuPluginConfig = FeishuPluginConfig;
})();

// 公共方法
(function(){
    function getUrlParameters() {
        var params = {};
        var search = window.location.search.substring(1);
        var urlParams = search.split('&');

        for (var i = 0; i < urlParams.length; i++) {
            var param = urlParams[i].split('=');
            var paramName = decodeURIComponent(param[0]);
            var paramValue = decodeURIComponent(param[1] || '');
            if(paramName) {
                params[paramName] = paramValue;
            }
        }

        return params;
    }

    function getCookie(sName) {
        var aCookie = document.cookie.split('; ');
        var lastMatch = null;
        for (var i = 0; i < aCookie.length; i++) {
            var aCrumb = aCookie[i].split('=');
            if (sName == aCrumb[0]) {
                lastMatch = aCrumb;
                break;
            }
        }
        if (lastMatch) {
            var v = lastMatch[1];
            if (v === undefined) {
                return v;
            }
            return decodeURI(v);
        }
        return null;
    }

    function setCookie(name, value, expires, domain) {
        var largeExpDate = new Date();
        if (expires !== null) {
            largeExpDate = new Date(largeExpDate.getTime() + expires * 1000 * 3600 * 24); //expires天数
        }

        document.cookie =
            name +
            '=' +
            escape(value) +
            (expires === null ? '' : '; expires=' + largeExpDate.toGMTString()) +
            ';path=/' +
            (domain ? '; domain=' + domain : '');
    }

    function getTaskGuid(url){
        // 截取任务详情中的任务guid
        var guid = url ? url.split('?RowGuid=')[1] : '';
        // 适配新的任务url
        if(!guid) {
            guid = url ? url.split('?rowguid=')[1] : '';
        }
        guid = guid ? guid.slice(0, 36) : '';

        return guid;
    }

    // 时间戳转字符串
    function getNow(now) {
        if(!now) {
            now = new Date();
        }  else {
            now = new Date(now);
        }
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        if (month < 10) month = "0" + month;
        var day = now.getDate();
        if (day < 10) day = "0" + day;
        var hours = now.getHours();
        if (hours < 10) hours = "0" + hours;
        var minutes = now.getMinutes();
        if (minutes < 10) minutes = "0" + minutes;
        var seconds = now.getSeconds();
        if (seconds < 10) seconds = "0" + seconds;
        var timeStr = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        return timeStr;
    };

    // 根据id获取controls内的value
    function getValueById(controls, id) {
        if (!Array.isArray(controls)) {
            console.error("Input is not a valid array");
            return null;
        }

        for (const item of controls) {
            if (item.id === id) {
                return item.value || null; // 返回 value，如果不存在则返回 null
            }
        }

        return null; // 如果未找到匹配的 id
    }

    // 根据id设置controls内的value
    function setValueById(controls, id, newValue, addIfNotFound = false) {
        if (!Array.isArray(controls)) {
            console.error("Input is not a valid array");
            return false;
        }

        const targetItem = controls.find((item) => item.id === id);

        if (targetItem) {
            // 如果找到对应的 id，则更新其 value
            targetItem.value = newValue;
            return true; // 表示成功设置值
        } else if (addIfNotFound) {
            // 如果未找到且允许新增
            controls.push({ id, value: newValue });
            return true; // 表示成功新增
        }

        return false; // 未找到也未新增
    }

    // 根据姓名获取小组名
    function getGroupNameFromName(name, memberData) {
        if (!name) {
            return null; // 如果 name 为空，返回 null
        }

        if(memberData === undefined) {
            memberData = window.FeishuPluginConfig.memberData
        }

        for (let i = 0; i < memberData.length; i++) {
            if (memberData[i].value.includes(name)) {
                return memberData[i].id;
            }
        }
        return null; // 如果找不到返回 null
    }

    // 是否管理者
    function isManager(name, memberData) {
        if (!name) {
            return false;
        }

        if(memberData === undefined) {
            memberData = window.FeishuPluginConfig.memberData
        }

        for (let i = 0; i < memberData.length; i++) {
            if (memberData[i].manager.includes(name)) {
                return true;
            }
        }
        return false;
    }

    window.FSUtil = {
        getUrlParameters: getUrlParameters,
        getCookie: getCookie,
        setCookie: setCookie,
        getTaskGuid: getTaskGuid,
        getNow: getNow,
        getValueById: getValueById,
        setValueById: setValueById,
        getGroupNameFromName: getGroupNameFromName,
        isManager: isManager
    };
})();

// 任务明细地址更新飞书记录
(function () {
    'use strict';

    // 任务管理表格的 id 信息
    var app_token = window.app_token;
    var table_id = FSUtil.getUrlParameters().table || '';

    if(!app_token || !table_id) {
        return false;
    }

    // 操作应用（账号）的密钥
    var app_id = 'cli_a34cc98d9bf8900b';
    var app_secret = '4BkUTBYZHeYCjiXGy1hM15XoaPcYIOUF';

    // 定义变量
    var username = '',
        addIndex = 0, // 填充任务计数
        userAccessTokenData = {},
        // tenant_access_token = '', // 应用token
        userAccessToken = ''; // user-token

    window.tenant_access_token = ''; // 应用token
    window.TaskInfo = {
        username: username,
        userguid: '',
        myFSTasklist: [], // 我的飞书任务
        departmentFSTasklist: [], // 部门飞书任务
        tasklistReady: false, // 准备好飞书数据
    };
    getUserInfo();

    // 获取当前用户信息
    function getUserInfo() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://'+window.location.host+'/space/api/user/',
            onload: function (res) {
                var data = JSON.parse(res.response).data;
                var name = data.name || data.cn_name || data.display_name.value;

                // 非访客
                if (name.indexOf('访客') === -1) {
                    getOAUserInfo();
                }
            }
        });
    }

    function getOAUserInfo() {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://oa.epoint.com.cn/epointoa9/rest/frame/fui/pages/themes/aide/themedataaction/getUserInfo?isCommondto=true',
            onload: function (res) {
                try {
                    JSON.parse(res.response);
                } catch (e) {
                    layer.msg('自动同步功能须先登录OA', {
                        time: 5000, //5s后自动关闭
                        btn: ['去登录', '取消'],
                        yes: function (index, layero) {
                            window.open('https://oa.epoint.com.cn/', '_blank');
                        }
                    });
                    return false;
                }
                var data = JSON.parse(res.response);
                username = TaskInfo.username = JSON.parse(data.custom).name;
                TaskInfo.userguid = JSON.parse(data.custom).guid;
                username && getAccessToken();
            }
        });
    }

    // 根据appid获取token
    function getAccessToken() {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: JSON.stringify({
                app_id: app_id,
                app_secret: app_secret
            }),
            onload: function (res) {
                tenant_access_token =
                    JSON.parse(res.response).tenant_access_token || JSON.parse(res.response).data.tenantAccessToken;

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://open.feishu.cn/open-apis/bitable/v1/apps/bascnzBFn4nK0U9Mbr8zXDhKPyh/tables/tblDQ55uJJ3hfZyk/records',
                    headers: {
                        Authorization: 'Bearer ' + tenant_access_token
                    },
                    onload: function (res) {
                        var data = JSON.parse(res.response).data;
                        $.each(data.items, function (i, item) {
                            var fields = item.fields;
                            if (fields['appId'] == app_id) {
                                userAccessTokenData = fields;

                                // usertoken有效
                                if (new Date(userAccessTokenData.expireDate).getTime() > new Date().getTime()) {
                                    userAccessToken = userAccessTokenData.userAccessToken;
                                }
                                // 获取表格数据
                                validationPermission();
                            }
                        });
                    }
                });
            }
        });
    }

    // 验证是否有编辑权限
    function validationPermission(){
        //userAccessToken = '';
        var token = userAccessToken || tenant_access_token;
        if (!userAccessToken) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://open.feishu.cn/open-apis/drive/v1/permissions/'+app_token+'/public?type=bitable',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                synchronous: true,
                onload: function (res) {
                    var data = JSON.parse(res.response).data;
                    // 无编辑权限
                    if(data.permission_public.link_share_entity !=='anyone_editable'){
                        var timeNow = new Date().getHours();//取得当前时间的小时
                        //判断当前时间是否在  09:00 之后
                        if(timeNow >= 9){
                            // layer.msg('自动填充权限异常，请稍后再试!');
                            console.error('自动填充权限异常，请稍后再试!');
                        } else {
                            console.error('自动填充权限异常，请稍后再试!');
                        }
                    } else {
                        getRecords();
                    }
                }
            });
        } else {
            getRecords();
        }
    }

    // 获取表格数据
    var page_token = ''; // 分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果
    var recordsIndex = 0;
    function getRecords() {
        if (userAccessToken) {
            console.log('用户账号');
        } else if (tenant_access_token) {
            console.log('应用账号');
        }
        var token = userAccessToken || tenant_access_token;
        // 该接口用于列出数据表中的现有记录，单次最多列出 500 行记录，支持分页获取
        // https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/app-table-record/list
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://open.feishu.cn/open-apis/bitable/v1/apps/' + app_token + '/tables/' + table_id + '/records' + '?page_token=' + page_token,
            headers: {
                Authorization: 'Bearer ' + token
            },
            onload: function (res) {
                if(JSON.parse(res.response).code!=0) {
                    layer.msg('自动填充功能权限异常，请联系徐磊!');

                    return false;
                }
                var data = JSON.parse(res.response).data;
                var items = data.items;
                // 倒序
                items.reverse();
                Array.prototype.push.apply(TaskInfo.departmentFSTasklist, items);
                $.each(items, function (i, item) {
                    var fields = item.fields;

                    // 只处理负责人是自己的记录
                    if (!fields['负责人'] || username.indexOf(fields['负责人'][0].text) === -1) {
                        return true; //跳出当前循环，进入下一个循环
                    }
                    // 自己的数据记录到全局
                    TaskInfo.myFSTasklist.push(item);debugger;

                    // 更新本月和上月
                    var date = new Date();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var itemDate = fields['登记日期'] ? fields['登记日期'].split('/')[1] : '';
                    // if (!(itemDate == month || (itemDate == month - 1 && day < 10))) {
                    if (!(itemDate == month || itemDate == month - 1 || (itemDate == 12 && month == 1))) {
                        return true; //跳出当前循环，进入下一个循环
                    }

                    var url = fields['任务详情'];
                    var time = fields['任务总工时'];
                    // 截取任务详情中的任务guid
                    var guid = FSUtil.getTaskGuid(url);

                    if (guid) {
                        // 未填写任务工时，自动填充
                        if (!time) {
                            addIndex++;
                            // 延迟执行
                            setTimeout(function () {
                                getTaskTime(guid, null, function (resdata) {
                                    updateRow(item, resdata);
                                });
                            }, addIndex * 200);
                        } else {
                            // 已有时间则判断是否更新
                            addIndex++;
                            // 如未获取到产品，执行更新
                            if (!fields['产品']) {
                                time = 0;
                            }
                            // 延迟执行
                            setTimeout(function () {
                                getTaskTime(guid, time, function (resdata) {
                                    updateRow(item, resdata);
                                });
                            }, addIndex * 400);
                        }
                    }
                });
                page_token = data.page_token || '';
                recordsIndex++;
                var recordsPage = Math.ceil(data.total / 500); // 获取页数
                if(page_token && recordsIndex < recordsPage) {
                    getRecords();
                } else {
                    // 数据全部拿到
                    TaskInfo.tasklistReady = true;
                }
            }
        });
    }

    // 根据任务guid获任务工时
    function getTaskTime(guid, time, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://oa.epoint.com.cn/ProjectManage/ProjectMission/Record_Detail.aspx?RowGuid=' + guid,
            onload: function (res) {
                var $dom = $(res.responseText);
                var rowtime = parseFloat($dom.find('#ctl00_ContentPlaceHolder1_RealWorkDays_61').text()) || 0;

                // 未填写时间或者填写时间与实际时间不一致时，进行更新
                if (time == null || (time != null && rowtime != time)) {
                    // 获取需求详情
                    getDemandmanageData(
                        $dom.find('#ctl00_ContentPlaceHolder1_lblOriginGuid').text(),
                        function (controls) {
                            (rowtime || rowtime == 0) &&
                                callback &&
                                callback({
                                time: rowtime, // 任务工时
                                id: guid, // 任务guid
                                text: $dom.find('#ctl00_ContentPlaceHolder1_MissionName_61').text(), // 任务名称
                                projectName: $dom.find('#ctl00_ContentPlaceHolder1_lblProjectName').text(), // 项目名称
                                completePercent: $dom.find('#ctl00_ContentPlaceHolder1_CompletePercent_61').text(), // 完成比例
                                controls: controls,
                                tags: $dom.find('#ctl00_ContentPlaceHolder1_lblStoryName1').text() // 项目或任务标签
                            });
                        }
                    );
                }
            }
        });
    }

    // 保留中文
    function getCN(v) {
        if (typeof v == 'string') {
            var regEx = /[^\u4e00-\u9fa5\uf900-\ufa2d]/g;
            return v.replace(regEx, '');
        }
    }
    // 更新一行（一条）数据
    function updateRow(item, data, callback) {
        var fields = {
            '项目 或 产品名称': data.projectName,
            任务总工时: data.time,
            所在部门: item.fields['所在部门'] || window.FeishuPluginConfig.departName,
            任务接受情况: '已接收',
            类型: item.fields['类型'] || (data.projectName.indexOf('【募投研发】') > -1 ? '产品' : '项目'),
            完成进度: item.fields['完成进度'] - 0 || data.completePercent / 100,
            完成情况: item.fields['完成情况'] || (data.completePercent == 100 ? '已完成' : '')
        };
        if (data.completePercent == 100) {
            fields['完成情况'] = '已完成';
            fields['完成进度'] = 1;
        } else if (data.completePercent > 0 && !fields['完成情况']) {
            fields['完成情况'] = '研发中';
        }
        if (data.controls && data.controls.length > 0) {
            fields['业务条线'] = item.fields['业务条线'] || getCN(data.controls[0].value);
            fields['紧急程度'] = item.fields['紧急程度'] || (data.controls[1].value == 0 ? '一般' : '紧急');
            // fields['产品'] = data.controls[3].value.split('- ')[1];
            if(data.controls[3].value) {
                fields['产品'] = data.controls[3].value;
            }
            if(data.controls[4].value) {
                fields['子系统'] = data.controls[4].value;
            }
        }
        // console.log('项目或任务标签', item.fields['项目或任务标签'], data.tags);
        if (data.tags && data.tags == '知识库' && !item.fields['项目或任务标签']) {
            // console.log('项目或任务标签', item.fields['项目或任务标签'], data.tags)
            fields['项目或任务标签'] = ['知识库'];
            fields['是否已反馈'] = '是';
        }

        if (data.text) {
            if(item.fields['任务详情']) {
                // 有填写但没任务地址
                if(item.fields['任务详情'].indexOf('Record_Detail.aspx?RowGuid') === -1 && item.fields['任务详情'].indexOf('projectmissiondetail?rowguid') === -1) {
                    fields['任务详情'] = item.fields['任务详情'] + ' https://oa.epoint.com.cn/ProjectManage/ProjectMission/Record_Detail.aspx?RowGuid=' + data.id
                }
            } else {
                // 什么也没填
                fields['任务详情'] = data.text + ' https://oa.epoint.com.cn/ProjectManage/ProjectMission/Record_Detail.aspx?RowGuid=' + data.id;
            }
        }

        if (data.end_date && !item.fields['要求完成时间']) {
            fields['要求完成时间'] = new Date(data.end_date).getTime()
        }

        var token = userAccessToken || tenant_access_token;
        GM_xmlhttpRequest({
            method: 'PUT',
            url:
            'https://open.feishu.cn/open-apis/bitable/v1/apps/' +
            app_token +
            '/tables/' +
            table_id +
            '/records/' + item.record_id,
            data: JSON.stringify({
                fields: fields
            }),
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json; charset=utf-8'
            },
            onload: function (res) {
                var data = JSON.parse(res.response);
                callback && callback(data);
            }
        });
    }
    // 更新多条(多行)记录
    function updateRows(fsRecords, oaDatas, callback) {
        // fsRecors, oaDatas 要确保一一对应。
        // 准备 fs fsRecors 数据，然后提交服务端，做数据库和视图更新。

        let i = 0 ,l = fsRecords.length;
        let params = {
            records: []
        }
        for(; i < l; i++) {
            let data = oaDatas[i]; // 数据字段要验证
            let item = fsRecords[i];

            let fields = {
                '项目 或 产品名称':  data.projectname || data.projectName,
                '任务总工时': data.realworkdays || data.time,
                '所在部门': item.fields['所在部门'] || window.FeishuPluginConfig.departName,
                '任务接受情况': '已接收',
                '类型': item.fields['类型'] || (data.projectname.indexOf('【募投研发】') > -1 ? '产品' : '项目'),
                '完成进度': item.fields['完成进度'] - 0 || data.completepercent / 100,
                '完成情况': item.fields['完成情况'] || (data.completepercent == 100 ? '已完成' : '')
            };
            if (data.completePercent == 100) {
                fields['完成情况'] = '已完成';
                fields['完成进度'] = 1;
            } else if (data.completePercent > 0 && !fields['完成情况']) {
                fields['完成情况'] = '研发中';
            }
            if (data.controls && data.controls.length > 0) {
                fields['业务条线'] = item.fields['业务条线'] || getCN(data.controls[0].value);
                fields['紧急程度'] = item.fields['紧急程度'] || (data.controls[1].value == 0 ? '一般' : '紧急');
                // fields['产品'] = data.controls[3].value.split('- ')[1];
                if(data.controls[3].value) {
                    fields['产品'] = data.controls[3].value;
                }
                if(data.controls[4].value) {
                    fields['子系统'] = data.controls[4].value;
                }
            }

            if (data.tags && data.tags == '知识库' && !item.fields['项目或任务标签']) {
                // console.log('项目或任务标签', item.fields['项目或任务标签'], data.tags)
                fields['项目或任务标签'] = ['知识库'];
                fields['是否已反馈'] = '是';
            }

            if (data.text) {
                if(item.fields['任务详情']) {
                    // 有填写但没任务地址
                    if(item.fields['任务详情'].indexOf('Record_Detail.aspx?RowGuid') === -1 && item.fields['任务详情'].indexOf('projectmissiondetail?rowguid') === -1) {
                        fields['任务详情'] = item.fields['任务详情'] + ' https://oa.epoint.com.cn/ProjectManage/ProjectMission/Record_Detail.aspx?RowGuid=' + data.id
                    }
                } else {
                    // 什么也没填
                    fields['任务详情'] = data.text + ' https://oa.epoint.com.cn/ProjectManage/ProjectMission/Record_Detail.aspx?RowGuid=' + data.id;
                }
            }

            if (data.realfinishdate && !item.fields['要求完成时间']) {
                fields['要求完成时间'] = new Date(data.end_date).getTime();
            }

            params.records.push({
                'record_id': item.record_id,
                fields: fields
            });

        }

        var token = userAccessToken || tenant_access_token;
        GM_xmlhttpRequest({
            method: 'POST',
            url:
            'https://open.feishu.cn/open-apis/bitable/v1/apps/' +
            app_token +
            '/tables/' +
            table_id +
            '/records/batch_update',
            data: JSON.stringify(params),
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json; charset=utf-8'
            },
            onload: function (res) {
                var data = JSON.parse(res.response);
                callback && callback(data);
            }
        });
    }

    // 增加多条记录
    function addTaskRecord(fields, callback) {
        var token = userAccessToken || tenant_access_token;
        GM_xmlhttpRequest({
            method: 'POST',
            url:
            'https://open.feishu.cn/open-apis/bitable/v1/apps/' +
            app_token +
            '/tables/' +
            table_id +
            '/records/batch_create',
            data: JSON.stringify({
                records: fields
            }),
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json; charset=utf-8'
            },
            onload: function (res) {
                var data = JSON.parse(res.response);
                callback && callback(data);
            }
        });
    }

    // 获取需求详情
    function getDemandmanageData(guid, callback, islast) {
        var data = {
            commonDto: [
                { id: 'buname', bind: 'dataBean.buname', type: 'outputtext', action: '' }, // BU名称
                { id: 'isurgent', bind: 'dataBean.isurgent', type: 'outputtext', action: '' }, // 紧急程度
                { id: 'linereadid', bind: 'dataBean.line', type: 'outputtext', action: '' }, // 所属条线id
                { id: 'productname', bind: 'dataBean.productname', type: 'outputtext', action: '' }, // 产品
                { id: 'functionmodule', bind: 'dataBean.functionmodule', type: 'outputtext', action: '' }, // 子系统
                { id: 'linereadlabel', bind: 'dataBean.linename', type: 'outputtext', action: ''} // 所属条线label
            ],
            cmdParams: {
                pageUrl:
                'https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandbasicinfo_detail?RowGuid=' + guid
            }
        };
        var formData = new FormData();
        formData.append('commonDto', JSON.stringify(data.commonDto));
        formData.append('cmdParams', JSON.stringify(data.cmdParams));debugger;
        GM_xmlhttpRequest({
            method: 'POST',
            url:
            'https://oa.epoint.com.cn/productrelease/rest/cpzt/demandmanage/demandbasicinfoaction/page_load?RowGuid=' +
            guid +
            '&isCommondto=true',
            data: formData,
            onload: function (res) {
                try {
                    var obj = JSON.parse(res.response);
                    var controls = obj.controls;
                    if (controls.length > 0 && controls[0].value == '政数BU') {
                        if (controls[2].value == 1) {
                            controls[0].value = '一网通办';
                        } else {
                            controls[0].value = '大数据';
                        }
                    }

                    // 兼容获取条线label
                    if(controls.length > 0 && controls[3].value && controls[3].value.indexOf(' - ') == -1) {
                        controls[3].value = controls[5].value + ' - ' + controls[3].value;
                    }

                    // 登录后初次请求不能获取到登录状态，需要再请求一次处理
                    if (obj.controls.length == 0 && islast) {
                        getDemandmanageData(guid, callback, true);
                    } else {
                        callback && callback(controls);
                    }
                } catch (err) {
                    callback && callback();
                }
            }
        });
    }

    window.updateRow = updateRow;
    window.addTaskRecord = addTaskRecord;
    window.updateRows = updateRows;
})();

// 添加问题反馈、更新脚本按钮、更强大的任务管理管理员开放
(function () {
    let epointCss = ".epoint-tool {position: fixed; bottom: 70px; right:10px; transform: translateY(-40%);}";
    epointCss += ".el-row { padding: 3px 0;} .el-dialog__body .el-tree{min-height: 420px; max-height: 500px;overflow: auto;}";
    epointCss += ".view-toolbar {padding-bottom: 10px;}";
    epointCss += ".deploy-body {height: 306px;}"
    epointCss += ".el-loading-spinner {margin-top: -60px;} .el-button--primary:focus {outline: 0 !important;}";
    epointCss += ".manager .el-form .el-form-item {margin-bottom: 0} .manager .el-dialog__body {padding: 0 !important;}";
    epointCss += "a {color: #409eff}"

    // 添加注入样式
    let extraStyleElement = document.createElement("style");
    extraStyleElement.innerHTML = epointCss;
    document.head.appendChild(extraStyleElement);

    const fontUrl = 'https://element.eleme.io/2.11/static/element-icons.535877f.woff';

    // 添加样式规则，将字体应用到指定元素上
    GM_addStyle(`
        @font-face {
            font-family: element-icons;
            src: url(${fontUrl}) format("woff");
        }
    `);

    GM_addStyle(GM_getResourceText('ElementCSS'));

    const MyComponent = {
        template: `<div class="epoint-wrap">
            <div class="epoint-tool"><el-row>
            <el-button-group>
              <el-tooltip content="任务同步管理" placement="top" effect="light">
                <el-button type="primary" icon="el-icon-s-operation" @click="synchronousTasklist"></el-button>
              </el-tooltip>
              <el-tooltip content="更新自动填充工时脚本" placement="top" effect="light">
                <el-button type="primary" v-if="showUpdate" icon="el-icon-refresh"  @click="handleUpdate"></el-button>
              </el-tooltip>
              <el-tooltip content="同步扩展信息至OA" placement="top" effect="light">
                <el-button type="primary" icon="el-icon-s-unfold" @click="doExtendInfo"></el-button>
              </el-tooltip>
              <el-tooltip content="脚本问题反馈" placement="top" effect="light">
                <el-button type="primary" icon="el-icon-edit-outline" @click="handleFeedback"></el-button>
              </el-tooltip>
            </el-button-group></el-row>
            </div>
            <el-dialog title="任务管理" width="96%" class="manager" :visible.sync="dialogSynchVisible" :top="dialogTop" :close-on-click-modal="false">
                <el-form :model="form" ref="form">
                    <el-form-item label="时间范围: " :label-width="formLabelWidth" prop="daterange">
                      <el-radio-group v-model="form.daterange" @input="synchronousTasklist">
                        <el-radio v-for="item in dateranges" :label="item.label" :value="item.value"></el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否登记: " :label-width="formLabelWidth" prop="register">
                      <el-radio-group v-model="form.register" @input="filterTasklist">
                        <el-radio v-for="item in status" :label="item.label" :value="item.value"></el-radio>
                      </el-radio-group>
                    </el-form-item>
                </el-form>
                <div class="mid-content" :style="midStyle">
                <el-row>
                    <el-col :span="12"><div class="grid-content bg-purple">
                    <!-- oa 任务 -->
                    <el-table
                        ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        :height="tableHeight"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                          type="selection"
                          width="55">
                        </el-table-column>
                        <el-table-column
                          label="序号"
                          type="index"
                          width="50">
                        </el-table-column>
                        <el-table-column
                          label="OA任务名称"
                          show-overflow-tooltip
                          width="300">
                          <template slot-scope="scope"><a :href="'https://oa.epoint.com.cn/ProjectManage/ProjectMission/Record_Detail.aspx?RowGuid=' + scope.row.id" target="_blank">{{ scope.row.text }}</a></template>
                        </el-table-column>
                       <el-table-column
                          show-overflow-tooltip
                          label="OA项目名称">
                          <template slot-scope="scope"><a :href="'http://192.168.0.200/?name=' + (scope.row.xiangmumc_simple)" target="_blank">{{ scope.row.xiangmumc }}</a></template>
                        </el-table-column>
                        <el-table-column
                          prop="workdays"
                          label="工时"
                          width="100">
                        </el-table-column>
                        <el-table-column
                          label="是否登记"
                          width="100">
                            <template slot-scope="scope">
                               <span style="color: #67c23a;" v-if="scope.row.register === '已登记'">{{ scope.row.register }}</span>
                               <span style="color: #f56c6c;" v-if="scope.row.register === '未登记'">{{ scope.row.register }}</span>
                            </template>
                        </el-table-column>
                      </el-table>
                    </div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light">
                    <!-- 飞书登记任务 -->
                    <el-table
                        ref="multipleTable"
                        :data="tableData2"
                        tooltip-effect="dark"
                        style="width: 100%"
                        :height="tableHeight"
                        @selection-change="handleSelectionChange2">
                        <el-table-column
                          type="selection"
                          width="55">
                        </el-table-column>
                        <el-table-column
                          label="序号"
                          type="index"
                          width="50">
                        </el-table-column>
                        <el-table-column
                          label="飞书任务名称"
                          prop="text"
                          show-overflow-tooltip
                          width="350">
                        </el-table-column>
                       <el-table-column
                          prop="xiangmumc"
                          show-overflow-tooltip
                          label="飞书项目名称">
                        </el-table-column>
                      </el-table>
                    </div></el-col>
                </el-row>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogSynchVisible = false">取 消</el-button>
                    <el-tooltip content="选择左边未登记的OA任务，新增到飞书任务管理表中" placement="top" effect="light">
                    <el-button type="primary" @click="addRecord(false)">新增记录</el-button>
                    </el-tooltip>
                    <el-tooltip content="选择左边已登记的OA任务，更新到飞书任务管理表中" placement="top" effect="light">
                    <el-button type="primary" @click="addRecord(true)">更新记录</el-button>
                    </el-tooltip>
                    <el-tooltip content="左边和右边各选一条,进行同步记录" placement="top" effect="light">
                    <el-button type="primary" @click="updateOneRecord">同步一条记录</el-button>
                    </el-tooltip>
                </div>
            </el-dialog>
            <el-dialog title="新增任务" width="600px"  :visible.sync="dialogAddVisible" :close-on-click-modal="false">
                <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="80px">
                    <el-form-item label="项目名称" prop="projectName">
                      <el-input v-model="addForm.projectName" :readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人" prop="head">
                      <el-input v-model="addForm.head"></el-input>
                    </el-form-item>
                    <el-form-item label="小组" prop="groupName">
                        <el-select v-model="addForm.groupName" placeholder="请选择所在小组">
                            <el-option :label="item.label" :value="item.label" v-for="item in groupData" :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="邮件地址" prop="mailUrl">
                      <el-input v-model="addForm.mailUrl" :readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item label="登记日期" prop="registerDate">
                      <el-input v-model="addForm.registerDate" :readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item label="任务详情" prop="detail">
                      <el-input v-model="addForm.detail"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogAddVisible = false">取 消</el-button>
                    <el-button type="primary" :disabled="isAddMailRecordDisabled" v-if="isAddMailRecordDisabled">任务加载中...</el-button>
                    <el-button type="primary" @click="addMailRecord">新增记录</el-button>
                </div>
            </el-dialog>
            <el-dialog title="任务填写提醒" width="96%" :visible.sync="dialogRemindVisible" :close-on-click-modal="false" :top="dialogTop">
                <el-alert
                  title="您有以下任务的记录需要完善，框架类型、开发方式、完成情况、纯重构任务工时（非前后端分离开发方式）为必填字段，请尽快补充，并确保信息准确!"
                  type="warning">
                </el-alert>
                <div class="mid-content" :style="midStyle2">
                <el-row>
                    <el-col :span="24"><div class="grid-content">
                    <!-- 飞书登记任务 -->
                    <el-table
                        ref="multipleTable"
                        :data="tableData3"
                        tooltip-effect="dark"
                        style="width: 100%"
                        :height="tableHeight2"
                        >
                        <el-table-column
                          label="序号"
                          type="index"
                          width="50">
                        </el-table-column>
                        <el-table-column
                          label="飞书任务名称"
                          prop="text"
                          show-overflow-tooltip
                          >
                        </el-table-column>
                        <el-table-column
                          prop="xiangmumc"
                          show-overflow-tooltip
                          label="飞书项目名称">
                        </el-table-column>
                        <el-table-column
                          prop="record_date"
                          width="150"
                          show-overflow-tooltip
                          label="登记日期">
                        </el-table-column>
                        <el-table-column
                          prop="frame_type"
                          width="150"
                          show-overflow-tooltip
                          label="框架类型">
                        </el-table-column>
                        <el-table-column
                          prop="develop_type"
                          width="150"
                          show-overflow-tooltip
                          label="开发方式">
                        </el-table-column>
                        <el-table-column
                          prop="complete_type"
                          width="150"
                          show-overflow-tooltip
                          label="完成情况">
                        </el-table-column>
                        <el-table-column
                          prop="html_time"
                          width="150"
                          show-overflow-tooltip
                          label="纯重构任务工时">
                        </el-table-column>
                      </el-table>
                    </div></el-col>
                </el-row>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogRemindVisible = false">确定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="同步扩展字段" class="manager" width="96%" :visible.sync="dialogExtendVisible" :close-on-click-modal="false" :top="dialogTop">
                <el-alert
                  title="以下任务记录的扩展字段信息会同步至OA，包括：框架类型、开发方式、完成情况、纯重构任务工时（非前后端分离开发方式）为必填字段，请核对，确认无误后提交!"
                  type="success">
                </el-alert>
                <el-form :model="updateForm" >
                    <el-form-item label="时间范围: " :label-width="formLabelWidth">
                      <el-radio-group v-model="updateForm.daterange" @input="filterDeptTasklist">
                        <el-radio label="本月" value="0"></el-radio>
                        <el-radio label="前一个月" value="1"></el-radio>
                        <el-radio label="前两个月" value="2"></el-radio>
                        <el-radio label="前三个月" value="3"></el-radio>
                      </el-radio-group>
                    </el-form-item>
                </el-form>
                <div class="mid-content" :style="midStyle2">
                <el-row>
                    <el-col :span="24"><div class="grid-content">
                    <!-- 飞书登记任务 -->
                    <el-table
                        ref="multipleTable"
                        :data="tableData4"
                        tooltip-effect="dark"
                        style="width: 100%"
                        :height="tableHeight2"
                        >
                        <el-table-column
                          label="序号"
                          type="index"
                          width="50">
                        </el-table-column>
                        <el-table-column
                          label="飞书任务名称"
                          show-overflow-tooltip
                          >
                          <template slot-scope="scope"><a :href="'https://oa.epoint.com.cn/ProjectManage/ProjectMission/Record_Detail.aspx?RowGuid=' + scope.row.task_id" target="_blank">{{ scope.row.text }}</a></template>
                        </el-table-column>
                        <el-table-column
                          prop="xiangmumc"
                          show-overflow-tooltip
                          label="飞书项目名称">
                        </el-table-column>
                        <el-table-column
                          prop="register_date"
                          width="150"
                          show-overflow-tooltip
                          label="登记日期">
                        </el-table-column>
                        <el-table-column
                          prop="head_name"
                          width="120"
                          show-overflow-tooltip
                          label="负责人">
                        </el-table-column>
                        <el-table-column
                          prop="frame_type"
                          width="150"
                          show-overflow-tooltip
                          label="框架类型">
                        </el-table-column>
                        <el-table-column
                          prop="develop_type"
                          width="150"
                          show-overflow-tooltip
                          label="开发方式">
                        </el-table-column>
                        <el-table-column
                          prop="complete_type"
                          width="120"
                          show-overflow-tooltip
                          label="完成情况">
                        </el-table-column>
                        <el-table-column
                          prop="html_time"
                          width="150"
                          show-overflow-tooltip
                          label="纯重构任务工时">
                        </el-table-column>
                        <el-table-column
                          prop="labels"
                          width="150"
                          show-overflow-tooltip
                          label="项目或任务标签">
                        </el-table-column>
                      </el-table>
                    </div></el-col>
                </el-row>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitExtendData">确定</el-button>
                </div>
            </el-dialog>
        </div>
            `,
        data() {
            return {
                showUpdate: false,
                dialogSynchVisible: false,
                dialogAddVisible: false,
                dialogRemindVisible: false,
                dialogExtendVisible: false,
                formLabelWidth: '120px',
                form: {
                    register: '全部',
                    daterange: '近两个月'
                },
                addForm: {
                    projectName: '',
                    head: '',
                    groupName: '',
                    mailUrl: '',
                    registerDate: '',
                    detail: ''
                },
                groupData: window.FeishuPluginConfig.group,
                addRules: {
                    projectName: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' }
                    ],
                    head: [
                        { required: true, message: '请输入负责人', trigger: 'blur' }
                    ],
                    group: [
                        { required: true, message: '请选择所在小组', trigger: 'change' }
                    ],
                    registerDate: [
                        { required: true, message: '请输入登记日期', trigger: 'blur' }
                    ],
                    detail: [
                        { required: true, message: '请输入任务详情', trigger: 'blur' }
                    ],
                    mailUrl: [
                        { required: true, message: '请输入邮件地址', trigger: 'blur' }
                    ]
                },
                updateForm: {
                    daterange: '前一个月'
                },
                dateranges: [{
                    label: '近一个月',
                    value: '1'
                },{
                    label: '近两个月',
                    value: '2'
                }, {
                    label: '近三个月',
                    value: '3'
                }],
                status: [{
                    label: '全部',
                    value: '1'
                },{
                    label: '未登记',
                    value: '2'
                }, {
                    label: '已登记',
                    value: '3'
                }],
                tableData: [], // OA 任务表格
                tableData2: [], // 飞书任务表格
                tableDataCopy: [], // OA 任务表格备份，用于本地过滤还原
                allFSTaskData: [], // 飞书任务备份，
                multipleSelection: [],
                multipleSelection2: [],
                tableData3: [], // 提醒表格
                execRemindTask: 0, // 执行提醒次数
                tableData4: [], // 待同步至中研院扩展字段表的数据
                isAddMailRecordDisabled: true
            };
        },
        computed: {
            // 任务管理表格
            midStyle() {
                return {
                    height: window.innerHeight - 304 + 'px',
                    overflow: 'auto'
                };
            },
            midStyle2() {
                return {
                    height: window.innerHeight - 318 + 'px',
                    overflow: 'auto'
                };
            },
            tableHeight() {
                return window.innerHeight - 352 + 'px';
            },
            tableHeight2() {
                return window.innerHeight - 324 + 'px';
            },
            dialogTop() {
                return '50px';
            },
            daterangeValue() {
                let start = '';
                let end = moment().format('YYYY-MM-DD');

                switch (this.form.daterange) {
                    case '近一个月':
                        start = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
                        break;
                    case '近两个月':
                        start = moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD')
                        break;
                    case '近三个月':
                        start = moment().subtract(3, 'month').startOf('month').format('YYYY-MM-DD')
                        break;
                }
                return start + ',' + end;
            },
            currentYear() {
                return new Date().getFullYear() + '';
            },
            currentMonth() {
                return new Date().getMonth() + 1;
            },
            registerDaterangeValue() {
                let arr = [];
                arr.push(moment().format('YYYY/MM'));

                switch (this.form.daterange) {
                    case '近一个月':
                        break;
                    case '近两个月':
                        if(this.currentMonth > 1) {
                            arr.push(this.currentYear + '/' + ((this.currentMonth - 1 ) < 10 ? ('0' + (this.currentMonth - 1 )) : (this.currentMonth - 1 )) );
                        }
                        break;
                    case '近三个月':
                        if(this.currentMonth === 2) {
                            arr.push(this.currentYear + '/' + ((this.currentMonth - 1 ) < 10? ('0' + (this.currentMonth - 1 )) : (this.currentMonth - 1 )) );
                        } else if(this.currentMonth > 2 ){
                            arr.push(this.currentYear + '/' + ((this.currentMonth - 1 ) < 10? ('0' + (this.currentMonth - 1 )) : (this.currentMonth - 1 )) );
                            arr.push(this.currentYear + '/' + ((this.currentMonth - 2 ) < 10? ('0' + (this.currentMonth - 2 )) : (this.currentMonth - 2 )) );
                        }
                        break;
                }
                return arr;
            }
        },
        methods: {
            handleUpdate() {
                window.open('https://greasyfork.org/zh-CN/scripts/459172-%E9%A3%9E%E4%B9%A6%E4%BB%BB%E5%8A%A1%E7%AE%A1%E7%90%86-%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E4%BB%BB%E5%8A%A1%E6%80%BB%E5%B7%A5%E6%97%B6', '_blank');
            },
            handleFeedback(data) {
                window.open('http://192.168.0.200/fe3group/feishu-autocomplete/-/issues', '_blank');
            },
            // 时间范围切换
            synchronousTasklist() {
                let self = this;
                console.log(TaskInfo.myFSTasklist);
                // 本地数据是否准备好。
                if(!TaskInfo.tasklistReady) {
                    const h = self.$createElement;
                    self.$message({
                        message: h('p', null, [
                            h('i', { class: 'el-icon-loading' }, ''),
                            h('span', null, '数据准备中，请耐心等待几秒... '),
                        ])
                    });

                    return false;
                }

                // 飞书数据转 el-table 数据
                self.tableData2 = self.changeDataFormat();
                // 显示弹窗和获取OA同步
                self.dialogSynchVisible = true;
                // 获取OA数据
                this.getLatestTasklist({
                    userguid: window.TaskInfo.userguid, // 用户 guid
                    daterange: self.daterangeValue // 时间范围
                }, function(data) {
                    let lastyear = self.currentYear - 1;

                    // 过滤掉去年的任务
                    data = data.filter(item => {
                        if(item.finishdate && item.finishdate.split('-')[0] > lastyear) {
                           if(item.realfinishdate && item.realfinishdate.split('-')[0] > lastyear || !item.realfinishdate) {
                               return true;
                           }
                           return false;
                        }
                        return false;
                    });

                    for(let i = 0, l = data.length; i < l; i++) {
                        // 数据转换 start
                        data[i].id = data[i].rowguid; // 任务guid
                        data[i].xiangmumc = data[i].projectname || data[i].missionname; // TODO 接口需要连表查项目名称，没项目表。。。，目前是取的任务名称，刷新页面后会自动更新成项目名称，暂无问题
                        data[i].text = data[i].missionname; // 任务名称
                        data[i].workdays = data[i].realworkdays; // 实际工作工时
                        data[i].start_date = data[i].realbegindate;
                        data[i].end_date = data[i].realfinishdate;
                        data[i].progress = data[i].completepercent; // 完成进度
                        // 数据转换 end

                        data[i].xiangmumc_simple = data[i].xiangmumc.replace(/\+/g, '').replace(/\(临时\)/g, '').replace(/（临时）/g, '');
                    }
                    self.tableData = data;
                    self.tableDataCopy = data;

                    if(self.form.register !== '全部') {
                        // self.filterTasklist();
                    }
                    self.filterTasklist();
                });
            },
            // 是否登记切换时处理
            filterTasklist() {
                // 只处理（过滤）OA任务
                let registerOATask = [];
                let unRegisterOATask = [];

                for(let i = 0, l = this.tableDataCopy.length; i < l; i++) {
                    let haveID = false;
                    for(let j = 0, l2 = this.allFSTaskData.length; j < l2; j++) {
                        if(this.allFSTaskData[j].task_id === this.tableDataCopy[i].id) {
                            registerOATask.push(this.tableDataCopy[i]);
                            haveID = true;
                            this.tableDataCopy[i].register = '已登记';
                            break;
                        }
                    }
                    if(!haveID) {
                        unRegisterOATask.push(this.tableDataCopy[i]);
                        this.tableDataCopy[i].register = '未登记';
                    }
                }

                if(this.form.register == '未登记') {
                    this.tableData = unRegisterOATask;
                } else if(this.form.register == '已登记') {
                    this.tableData = registerOATask;
                } else {
                    this.tableData = this.tableDataCopy;
                }
                console.log(this.tableData)
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                let self = this;
                self.multipleSelection = val;
            },
            handleSelectionChange2(val) {
                let self = this;
                self.multipleSelection2 = val;
            },
            noticeLoginOA() {
                let self = this;
                layer.msg('请先登录新点低代码', {
                    time: 5000, //5s后自动关闭
                    btn: ['去登录', '取消'],
                    yes: function (index, layero) {
                        window.open('https://oa.epoint.com.cn/oaextend/frame/fui/pages/themes/idea/idea', '_blank');

                        self.dialogSynchVisible = false;

                        setTimeout(()=>{
                            self.dialogSynchVisible = true;
                        }, 3000);
                    }
                });

                return false;

                const oaextend = window.open('https://oa.epoint.com.cn/oaextend/frame/fui/pages/themes/idea/idea', '_blank');

                setTimeout(()=>{
                    oaextend.close();
                    setTimeout(()=>{
                        self.synchronousTasklist();
                    }, 2000);
                }, 300);


            },
            // 获取近期OA上的任务数据
            getLatestTasklist(params, callback) {
                let self = this;
                let userguid = params.userguid ? params.userguid : '';
                let daterange = params.daterange ? params.daterange : '';

                let formData = new FormData();
                formData.append('userguid', userguid);
                formData.append('daterange', daterange);
                GM_xmlhttpRequest({
                    method: 'POST',
                    // url: 'https://oa.epoint.com.cn/oaextend/rest/dynamicapi/tasklistViewbyusrCall',
                    url: 'https://oa.epoint.com.cn/oaextend/rest/dynamicapi/postMissionManageByUserguidCall',
                    data: formData,
                    onload: function (res) {
                        try {
                            JSON.parse(res.response);
                        } catch (e) {
                            self.noticeLoginOA();
                            return false;
                        }
                        const data = JSON.parse(res.response);
                        if(data.status.text.indexOf('缺失授权令牌') > -1 || data.status.code !== '200') {
                            self.noticeLoginOA();
                            return false;
                        }
                        callback && callback(data.custom);
                    }
                });
            },
            // 新增记录，如果是已存在的会更新。
            // 存在的问题：同时调用新增和更新，更新会失效，改成一次只能执行一个操作
            addRecord(isUpdate) {
                console.log(this.multipleSelection);
                let self = this;
                if(this.multipleSelection.length == 0) {
                    this.$message({
                        type: 'warning',
                        message: '未选中OA任务记录！'
                    });

                    return false;
                }

                // 新增时判断是否选中了飞书表中已建的记录
                // 1. 已建的不让建，直接建未创建的；2. 已建的进行更新操作； 3. 已建的重复建一个新的记录，
                let registerTasks = [], unregisterTasks = [], fsRecords = [], fsRecord; // 查找到的对应飞书记录
                let i = 0, l = this.multipleSelection.length;

                for(; i < l; i++) {
                    fsRecord = this.findFSRecord(this.multipleSelection[i]);
                    if(fsRecord) {
                        registerTasks.push(this.multipleSelection[i]);
                        fsRecords.push(fsRecord);
                    } else {
                        unregisterTasks.push(this.multipleSelection[i])
                    }
                }

                let confirmTpl = '';
                let temp = [];
                if(unregisterTasks.length && !isUpdate) {
                    confirmTpl += '<span style="font-weight:bold;"> 新增 </span>以下OA任务至飞书记录：<br/>';

                    for(i = 0; i < unregisterTasks.length; i++) {
                        temp.push('<p>'+(i +1)+'：<a href="https://oa.epoint.com.cn/ProjectManage/ProjectMission/Record_Detail.aspx?RowGuid='+ unregisterTasks[i].id +
                                  '" target="_blank">'+ unregisterTasks[i].text +'</a> - '+ unregisterTasks[i].start_date.substring(0, 7).replace(/-/g, '/') +'</p>');
                    }
                }

                if(registerTasks.length && isUpdate) {
                    temp.push('<span style="font-weight:bold;"> 更新 </span>以下已登记的飞书任务：');
                    for(i = 0; i < registerTasks.length; i++) {
                        temp.push('<p>'+(i +1)+'：<a href="https://oa.epoint.com.cn/ProjectManage/ProjectMission/Record_Detail.aspx?RowGuid='+ registerTasks[i].id +
                                  '" target="_blank">'+ registerTasks[i].text +'</a> - '+ registerTasks[i].start_date.substring(0, 7).replace(/-/g, '/') +'</p>');
                    }
                }

                confirmTpl += temp.join('');
                confirmTpl += '<p>是否继续?</p>';

                if(unregisterTasks.length == 0 && !isUpdate) {
                    self.$message({
                        type: 'error',
                        message: '未选择未登记的记录！'
                    });
                    return false;
                }

                if(registerTasks.length == 0 && isUpdate) {
                    self.$message({
                        type: 'error',
                        message: '未选择已登记的记录！'
                    });
                    return false;
                }

                this.$confirm(confirmTpl, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    width: '600px',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    // oa 数据转飞书数据：changeToFSData
                    // 执行新增记录
                    if(unregisterTasks.length && !isUpdate) {
                        addTaskRecord(self.changeToFSData(unregisterTasks), function(data) {
                            if(data.msg == 'success') {
                                self.$message({
                                    type: 'success',
                                    message: '新增成功，关闭弹窗查看！'
                                });

                                // 新增成功后，往本地的 myFSTasklist 添加数据
                                // 左右两边表格数据更新
                                self.addLocalFSTaskList(data.data.records);
                                self.filterTasklist(); // 左边表格
                                self.tableData2 = self.changeDataFormat();// 右边表格

                            } else {
                                self.$message({
                                    type: 'error',
                                    message: data.msg
                                });
                            }
                        });
                    }

                    // 有更新执行更新
                    if(registerTasks.length && isUpdate) {
                        // 调用全局的更新多条记录
                        updateRows(fsRecords, registerTasks, function(data) {
                            if(data.msg === 'success') {
                                self.$message({
                                    type: 'success',
                                    message: '更新成功，关闭弹窗查看！'
                                });
                                // 更新成功后，往本地的 myFSTasklist 更新数据
                                // 左右两边表格数据更新
                                self.updateLocalFSTaskList(data.data.records);
                                self.filterTasklist();
                                self.tableData2 = self.changeDataFormat();// 右边表格
                            }
                        });
                        if(unregisterTasks.length) {
                            // 同时调用新增和更新会出错。先新增后更新。
                            /*
                            setTimeout(()=> {
                                // 调用全局的更新多条记录
                                updateRows(fsRecords, registerTasks, function(data) {
                                    if(data.msg === 'success') {
                                        self.$message({
                                            type: 'success',
                                            message: '更新成功，关闭弹窗查看！'
                                        });
                                        // 更新成功后，往本地的 myFSTasklist 更新数据
                                        // 左右两边表格数据更新
                                        self.updateLocalFSTaskList(data.data.records);
                                        self.filterTasklist();
                                        self.tableData2 = self.changeDataFormat();// 右边表格
                                    }
                                });
                            }, 30000); */
                        }


                    }

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消新增飞书任务'
                    });
                });
            },
            // 表格数据（oa）查找对应的飞书记录
            findFSRecord(record) {
                let fsrecord;
                let i = 0, l = TaskInfo.myFSTasklist.length;

                for(; i < l; i++) {
                    let detail = TaskInfo.myFSTasklist[i].fields['任务详情'];
                    let rowguid = FSUtil.getTaskGuid(detail);

                    if(rowguid === record.id) {
                        fsrecord = TaskInfo.myFSTasklist[i];
                        break;
                    }
                }
                return fsrecord;

            },
            // 同步一条记录
            updateOneRecord() {
                if(this.multipleSelection.length !== 1 || this.multipleSelection2.length !== 1) {
                    this.$message({
                        type: 'warning',
                        showClose: true,
                        message: '请 OA 任务和飞书任务各选一条进行同步！'
                    });
                    return false;
                }
                let self = this;

                // 拿到表格2中的数据，在 myFSTshklist 的item,飞书记录
                let record_id = this.multipleSelection2[0].record_id;
                let i = 0, l = TaskInfo.myFSTasklist.length;
                let item;
                for(; i < l; i++) {
                    if(TaskInfo.myFSTasklist[i].record_id == record_id) {
                        item = TaskInfo.myFSTasklist[i];
                        break;
                    }
                }
                // 需要更新的值，表格1中的数据，OA记录
                let updateValue = {
                    time: this.multipleSelection[0].workdays - 0, // 任务工时
                    projectName: this.multipleSelection[0].xiangmumc, // 项目名称
                    completePercent: (this.multipleSelection[0].progress - 0) / 100, // 完成比例
                    text: this.multipleSelection[0].text, // 任务名称
                    id: this.multipleSelection[0].id, // 任务guid
                    end_date: new Date(this.multipleSelection[0].end_date).getTime(), // 要求完成时间
                    controls: [], // 需求字段
                    tags: this.multipleSelection[0].missionregion === 'ZTBKN' ? ['知识库']: [] // 项目或任务标签
                };
                // 同步前再次确认
                this.$confirm('此操作会同步记录, <br/><span style="font-weight:bold;">从 OA 任务：</span><a href="https://oa.epoint.com.cn/ProjectManage/ProjectMission/Record_Detail.aspx?RowGuid='+ this.multipleSelection[0].id
                              +'" target="_blank">'+ this.multipleSelection[0].text
                              +'</a><br/><span style="font-weight:bold;">同步至飞书任务：</span>“'+ (item.fields['任务详情'] || item.fields['项目 或 产品名称'])
                              +'”<p style="font-size: 12px;">同步字段：项目名称、任务总工时、类型、完成进度、完成情况、业务条线、产品等。</p><p style="color:red;">此操作不可逆，是否继续?</p>', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    // 调用全局更新方法。
                    updateRow(item, updateValue, function(data) {
                        if(data.msg === 'success') {
                            self.$message({
                                type: 'success',
                                message: 'OA 任务和飞书任务同步成功，关闭弹窗后查看记录数据！'
                            });

                            // 更新成功后，同步下本地的
                            self.updateLocalFSTaskList(data.data.record);
                            self.updateLocalFSTaskList();


                        } else {
                            self.$message({
                                type: 'error',
                                message: data.msg
                            });
                        }
                    });
                }).catch(() => {
                    console.log('取消同步')
                });

            },
            // 根据时间范围转换飞书数据到el-table数据，返回table2所需数据
            // 时间范围切换时调用
            changeDataFormat(needInit) {
                let array = [];
                let i = 0, l = window.TaskInfo.myFSTasklist.length;
                let date, detail;

                needInit = needInit ? needInit : (this.allFSTaskData.length == 0 ? true : false);
                if(needInit) {
                    // 清空
                    this.allFSTaskData.splice(0);
                }

                for(; i < l; i++) {
                    date = TaskInfo.myFSTasklist[i].fields['登记日期'];
                    detail = TaskInfo.myFSTasklist[i].fields['任务详情'];

                    let obj = {
                        text: detail,
                        xiangmumc: TaskInfo.myFSTasklist[i].fields['项目 或 产品名称'],
                        id: TaskInfo.myFSTasklist[i].id,
                        record_id: TaskInfo.myFSTasklist[i].record_id,
                        record_date: date,
                        task_id: FSUtil.getTaskGuid(detail)
                    };

                    if(this.registerDaterangeValue.indexOf(date) > -1) {
                        array.push(obj);
                    }
                    if(needInit) {
                        this.allFSTaskData.push(obj);
                    }
                }
                console.log(array);

                return array;
            },
            // 数据转换，oa 数据转成 飞书需要的数据
            changeToFSData(arrayData) {
                arrayData = arrayData ? arrayData : this.multipleSelection;
                let destArr = [];
                // TODO 一年新建表时，未有任务记录需要每人手动建第一个任务，可优化。
                if(!TaskInfo.myFSTasklist[0].fields) {
                    this.$message({
                        type: 'info',
                        message: '请先手动添加一条本人任务记录'
                    });
                    return false;
                }

                const groupName = TaskInfo.myFSTasklist[0].fields['小组'],
                      headName = TaskInfo.myFSTasklist[0].fields['负责人'][0].record_ids,
                      deptName = TaskInfo.myFSTasklist[0].fields['所在部门'];

                for(let i = 0, l = arrayData.length; i < l; i++) {
                    destArr.push({
                        fields: {
                            '项目 或 产品名称': arrayData[i].xiangmumc,
                            '任务总工时': arrayData[i].workdays - 0,
                            '完成进度': (arrayData[i].progress - 0) / 100 ,
                            '完成情况': arrayData[i].progress == '100' ? '已完成' : '研发中',
                            '类型': arrayData[i].xiangmumc.indexOf('募投研发') > -1 ? '产品' : '项目',
                            '登记日期': arrayData[i].start_date.substring(0, 7).replace(/-/g, '/'),
                            '紧急程度': '一般',
                            '要求完成时间': new Date(arrayData[i].end_date).getTime(),
                            '任务详情': arrayData[i].text + ' https://oa.epoint.com.cn/ProjectManage/ProjectMission/Record_Detail.aspx?RowGuid=' + arrayData[i].id,
                            '任务接受情况': '已接收',
                            '项目或任务标签': arrayData[i].missionregion == 'ZTBKN' ? ['知识库']: [],
                            '负责人': headName,
                            '小组': groupName,
                            '所在部门': deptName,
                        }
                    });
                }
                return destArr;
            },
            // 提醒记录完整性
            remindFill(successFn) {

                const day = new Date().getDate();
                const month = new Date().getMonth() + 1;
                let start, end;
                if(month === 10){
                    start = 7;
                    end = 12;
                } else {
                    start = 1;
                    //end = 30; // 测试用
                    end = 6;
                }

                // 数据未准备好，先跳过
                if(!TaskInfo.tasklistReady) {
                    return ;
                }

                // 每月 1-5 号进行提醒
                if(day >= start && day < end ) {
                    // 无弹窗打开时
                    if(!this.dialogSynchVisible && !this.dialogAddVisible) {
                        let remindTime = FSUtil.getCookie('remindtime');

                        if(remindTime === null) {
                            // 有效期一天
                            FSUtil.setCookie('remindtime', 2, 1);
                            remindTime = FSUtil.getCookie('remindtime');

                        }

                        if(remindTime > 0) {
                            // alert('提醒：' + remindTime);
                            // 检查数据完整性 allFSTaskData 的扩展字段是否填充。
                            this.execRemind();
                            FSUtil.setCookie('remindtime', (remindTime - 1));
                            // 执行成功才停止
                            successFn && successFn();
                        } else {
                            // 不需要执行任务，和执行成功同样操作
                            successFn && successFn();
                        }
                    } else {
                        // 需要执行，但是有其他弹窗打开，暂时放弃
                    }

                } else {
                    // 不需要执行任务, 和执行成功同样操作
                    successFn && successFn();
                }
            },
            // 获取当前的年月
            getMonthYearAndMonth() {
                const today = new Date();
                let year = today.getFullYear();
                let month = today.getMonth() + 1; // 月份是从 0 到 11 编号的，所以要加 1

                // 格式化年份和月份为指定格式（例如：2023/04）
                const formattedYear = year.toString();
                const formattedMonth = month < 10 ? `0${month}` : month.toString();

                return `${formattedYear}/${formattedMonth}`;
            },
            // 执行提醒
            execRemind() {
                // 完成情况、开发方式、框架类型、纯重构工时（开发方式非前后端分离时），强制检查
                let remindRecord = [];
                let self = this;
                let i = 0, l = TaskInfo.myFSTasklist.length;

                for(; i < l; i++) {
                    let developType = TaskInfo.myFSTasklist[i].fields['开发方式'],
                        compeleteType = TaskInfo.myFSTasklist[i].fields['完成情况'],
                        frameType = TaskInfo.myFSTasklist[i].fields['框架类型'],
                        htmlTime = TaskInfo.myFSTasklist[i].fields['纯重构任务工时'],
                        projectName = TaskInfo.myFSTasklist[i].fields['项目 或 产品名称'],
                        taskName = TaskInfo.myFSTasklist[i].fields['任务详情'],
                        registerDate = TaskInfo.myFSTasklist[i].fields['登记日期'];
                    // 排除本月任务、空白任务
                    if(registerDate === self.getMonthYearAndMonth() || (!registerDate && !taskName)) {
                        continue;
                    }
                    // 完成情况、开发方式、框架类型 未登记
                    if(!developType || !frameType || !compeleteType) {
                        remindRecord.push({
                            text: taskName,
                            xiangmumc: projectName,
                            id: TaskInfo.myFSTasklist[i].id,
                            record_id: TaskInfo.myFSTasklist[i].record_id,
                            record_date: registerDate,
                            frame_type: frameType,
                            develop_type: developType,
                            html_time: htmlTime,
                            compelete_type: compeleteType
                        });
                    }
                    // 非完全前后端分离，但没填纯重构工时
                    if(developType && developType !== '前后端分离' && !htmlTime) {
                        remindRecord.push({
                            text: taskName,
                            xiangmumc: projectName,
                            id: TaskInfo.myFSTasklist[i].id,
                            record_id: TaskInfo.myFSTasklist[i].record_id,
                            record_date: registerDate,
                            frame_type: frameType,
                            develop_type: developType,
                            html_time: htmlTime,
                            complete_type: compeleteType
                        });
                    }
                }

                // 提醒表格数据
                if(remindRecord.length > 0) {
                    self.tableData3 = remindRecord;
                    self.dialogRemindVisible = true;
                }
            },
            // 同步扩展，管理员操作
            doExtendInfo() {
                let self = this;
                // 本地数据是否准备好。
                if(!TaskInfo.tasklistReady) {
                    const h = self.$createElement;
                    self.$message({
                        message: h('p', null, [
                            h('i', { class: 'el-icon-loading' }, ''),
                            h('span', null, '数据准备中，请耐心等待几秒... '),
                        ])
                    });

                    return false;
                }
                // 管理者执行
                if(window.FSUtil.isManager(TaskInfo.username) ) {

                    self.filterDeptTasklist();
                    // 展示同步数据弹窗
                    self.dialogExtendVisible = true;
                } else {
                    self.$message({
                        type: 'info',
                        message: '建设中...'
                    });
                }
            },
            // 更新本地的飞书数据
            updateLocalFSTaskList(records) {
                let isMulti = Array.isArray(records);

                if(isMulti) {
                    let i = 0, l = records.length;

                    for(; i < l; i++) {
                        this.updateLocalFSTaskListSingle(records[i]);
                    }
                } else {
                    this.updateLocalFSTaskListSingle(records);
                }

            },
            // 更新一条本地飞书数据
            updateLocalFSTaskListSingle (record) {
                let i = 0, l = TaskInfo.myFSTasklist.length;
                for(; i < l;i++) {
                    if(record.record_id == TaskInfo.myFSTasklist[i].record_id) {
                        TaskInfo.myFSTasklist[i] = record;
                        break;
                    }
                }
                l = this.allFSTaskData.length;
                for(; i < l;i++) {
                    if(record.record_id == this.allFSTaskData[i].record_id) {
                        this.allFSTaskData.splice(i, 1, record);
                        break;
                    }
                }
                // TODO 给tableData2 重新赋值
                this.tableData2 = this.changeDataFormat(true);
            },
            // 过滤链接
            extractLinksFromString(inputString) {
                // 使用正则表达式匹配链接
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const linksArray = inputString.match(urlRegex); // 使用正则表达式的 match 方法来提取链接

                return linksArray[0];
            },
            // 提交扩展
            submitExtendData() {
                // this.tableData4 数据提交给接口，转换成接口所需
                const that = this;
                let dataList = [];
                this.tableData4.forEach(row => {
                    if(row.task_id) {
                        dataList.push({
                            frametype:row.frame_type, // 框架类型
                            worktype: row.develop_type, // 开发方式
                            missioncompletepercent: row.complete_type, // 完成情况
                            workcost: row.html_time || '', // 纯重构任务总工时
                            missionlabel: row.labels ? row.labels.join(',') : '', // 项目或任务标签
                            note: row.note, // 备注说明
                            actualfinishtime: row.actualfinishtime ? FSUtil.getNow(row.actualfinishtime) : '', // 内部完成时间
                            emailaddress: row.emailaddress ? that.extractLinksFromString(row.emailaddress) : '', // 邮件地址
                            rowguid: row.task_id, // oa任务主键
                            isurgent: row.isurgent, // 紧急程度
                        })
                    }
                });

                var data = {
                    dataList: dataList
                };
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://oa.epoint.com.cn/oaextend/rest/dynamicapi/updateMissionExtInfoCall',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: JSON.stringify(data),
                    onload: function (res) {
                        try {
                            JSON.parse(res.response);
                        } catch (e) {
                            layer.msg('同步发生错误', {
                                time: 5000, //5s后自动关闭
                            });
                            return false;
                        }
                        var data = JSON.parse(res.response);
                        var msg = '同步成功';
                        if(data.errorList && data.errorList.length>0) {
                            msg = data.errorList.length + ' 条数据同步失败'
                            console.log(data.errorList)
                        }
                        if(data.error) {
                            msg = data.error ? data.error : msg;
                        }
                        layer.alert(msg);
                    }
                });
            },
            // 新增本地的飞书数据,records 数组
            addLocalFSTaskList(records) {
                Array.prototype.push.apply(TaskInfo.myFSTasklist, records);
                this.tableData2 = this.changeDataFormat(true);
            },
            // 邮件表单
            initMailRecord() {

                const params = FSUtil.getUrlParameters();
                const projectName = params.projectName;
                const mailGuid = params.mailGuid;
                const mailTitle = params.mailTitle;
                const username = params.username && params.username.replace(/\(前端研发\d{1}部\)/g, '');

                if(projectName && mailGuid && mailTitle) {

                    this.addForm.projectName = projectName;
                    this.addForm.mailUrl = 'https://oa.epoint.com.cn:8080/OA9/oa9/mail/mailview?detailguid=' + mailGuid;
                    this.addForm.detail = mailTitle;
                    this.addForm.head = username;

                    this.addForm.registerDate = moment().format('YYYY/MM');

                    this.addForm.groupName = window.FSUtil.getGroupNameFromName(username);

                    this.dialogAddVisible = true;
                }

                // 延迟一段时间后启用按钮，避免飞书还未登录成功
                setTimeout(() => {
                    this.isAddMailRecordDisabled = false;
                }, 3000);
            },
            // 新增表单记录
            addMailRecord() {
                // 调用全局新增方法
                let self = this;
                this.$confirm('确认新增此任务？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {debugger;
                    const groupName = TaskInfo.myFSTasklist[0] && TaskInfo.myFSTasklist[0].fields['小组'],
                          headName = TaskInfo.myFSTasklist[0] && TaskInfo.myFSTasklist[0].fields['负责人'][0].record_ids;

                    if(!headName) {
                        this.$message({
                            type: 'info',
                            message: '请先手动添加一条本人任务记录'
                        });
                        return false;
                    }

                    // 参考 changeToFSData 准备数据
                    let destArr = [];
                    // 部门、紧急程度、类型、完成情况、是否反馈、任务接收情况，这些字段带上默认值
                    destArr.push({
                        fields: {
                            '项目 或 产品名称': this.addForm.projectName,
                            '完成情况': '排队中',
                            '类型': this.addForm.projectName.indexOf('募投研发') > -1 ? '产品' : '项目',
                            '登记日期': this.addForm.registerDate,
                            '紧急程度': '一般',
                            '任务详情': this.addForm.detail,
                            '负责人': headName || [''],
                            '小组': groupName || window.FSUtil.getGroupNameFromName(this.addForm.head),
                            '所在部门': window.FeishuPluginConfig.departName,
                            '是否已反馈': '否',
                            '邮件地址': this.addForm.mailUrl,
                            '任务接受情况': '需求未发'
                        }
                    });
                    // 执行新增记录
                    addTaskRecord(destArr, function(data) {
                        if(data.msg == 'success') {
                            self.$message({
                                type: 'success',
                                message: '新增成功！'
                            });

                            self.dialogAddVisible = false;

                            // 新增成功后，往本地的 myFSTasklist 添加数据
                            // 左右两边表格数据更新
                            self.addLocalFSTaskList(data.data.records);
                            // self.filterTasklist();

                        } else {
                            self.$message({
                                type: 'error',
                                message: data.msg
                            });
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消新增飞书任务'
                    });
                });
            },
            // 过滤全部的飞书数据
            filterDeptTasklist() {
                let deptTasklist = [];
                let i = 0, l = TaskInfo.departmentFSTasklist.length;
                let daterange = [];

                switch(this.updateForm.daterange) {
                    case '本月':
                        daterange.push(moment().format('YYYY/MM'));
                        break;
                    case '前一个月':
                        daterange.push(moment().subtract(1, 'month').startOf('month').format('YYYY/MM'));
                        break;
                    case '前两个月':
                        daterange.push(moment().subtract(1, 'month').startOf('month').format('YYYY/MM'));
                        daterange.push(moment().subtract(2, 'month').startOf('month').format('YYYY/MM'));
                        break;
                    case '前三个月':
                        daterange.push(moment().subtract(1, 'month').startOf('month').format('YYYY/MM'));
                        daterange.push(moment().subtract(2, 'month').startOf('month').format('YYYY/MM'));
                        daterange.push(moment().subtract(3, 'month').startOf('month').format('YYYY/MM'));
                        break;
                }

                let date,detail;
                // 参考 changeDataFormat
                for(; i < l; i++) {
                    date = TaskInfo.departmentFSTasklist[i].fields['登记日期'];
                    detail = TaskInfo.departmentFSTasklist[i].fields['任务详情'];
                    // 筛选表单范围内的
                    if(daterange.indexOf(date) > -1) {
                        let obj = {
                            text: detail,
                            xiangmumc: TaskInfo.departmentFSTasklist[i].fields['项目 或 产品名称'],
                            id: TaskInfo.departmentFSTasklist[i].id,
                            record_id: TaskInfo.departmentFSTasklist[i].record_id,
                            record_date: date,
                            task_id: FSUtil.getTaskGuid(detail),
                            frame_type: TaskInfo.departmentFSTasklist[i].fields['框架类型'],
                            develop_type: TaskInfo.departmentFSTasklist[i].fields['开发方式'],
                            html_time: TaskInfo.departmentFSTasklist[i].fields['纯重构任务工时'],
                            complete_type: TaskInfo.departmentFSTasklist[i].fields['完成情况'],
                            register_date: TaskInfo.departmentFSTasklist[i].fields['登记日期'],
                            head_name: TaskInfo.departmentFSTasklist[i].fields['负责人'],
                            labels: TaskInfo.departmentFSTasklist[i].fields['项目或任务标签'],
                            actualfinishtime: TaskInfo.departmentFSTasklist[i].fields['内部完成时间'],
                            emailaddress: TaskInfo.departmentFSTasklist[i].fields['邮件地址'],
                            isurgent: TaskInfo.departmentFSTasklist[i].fields['紧急程度'],
                            missioncompletepercent: TaskInfo.departmentFSTasklist[i].fields['完成情况'],
                            note: TaskInfo.departmentFSTasklist[i].fields['备注说明'],
                        };

                        deptTasklist.push(obj);
                    }
                }
                if(deptTasklist.length > 0) {
                    this.tableData4 = deptTasklist;
                }
            },
            compareVersion(version1, version2) {
                const v1 = version1.split('.');
                const v2 = version2.split('.');

                for (let i = 0; i < 3; i++) {
                    const num1 = parseInt(v1[i] || 0);
                    const num2 = parseInt(v2[i] || 0);

                    if (num1 > num2) {
                        return 1;
                    } else if (num1 < num2) {
                        return -1;
                    }
                }

                return 0;
            }
        },
        mounted() {
            var _this = this;
            GM_xmlhttpRequest({
                method: 'GET',
                url:
                'http://192.168.0.200/fe3group/feishu-autocomplete/-/raw/main/data.json',
                onload: function (res) {
                    try {
                        // 获取最新版本号
                        var obj = JSON.parse(res.response);
                        // 获取当前脚本的版本号
                        var version = GM_info.script.version;

                        // 有新版本
                        if(_this.compareVersion(obj.version, version) == 1 && obj.version !== '1.0.20240101') {
                            _this.showUpdate = true;
                            _this.$alert('自动填充工时油猴脚本有新版本', '脚本更新提醒', {
                                confirmButtonText: '去更新',
                                callback: action => {
                                    if(action === 'confirm') {
                                        _this.handleUpdate();
                                    }
                                }
                            });
                        }
                    } catch (err) {

                    }
                }
            });

            _this.initMailRecord();

            // 加载一次页面执行一次，一天执行2次任务。
            let remindTimer;

            remindTimer = setInterval(()=> {
                if(_this.execRemindTask === 0) {
                    _this.remindFill(function () {
                        _this.execRemindTask++;
                    });
                } else {
                    clearInterval(remindTimer);
                }

            }, 5000);


        }
    };

    const placeholder = document.createElement('div');

    // 创建 Vue 实例并挂载到页面
    const vueInstance = new Vue({
        el: placeholder,
        components: {
            MyComponent
        },
        methods: {
        },
        template: `<my-component></my-component>`
    });

    window.vueInstance = vueInstance;

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 将占位元素追加到 body 元素中
        document.body.appendChild(vueInstance.$el);
    });

})();
