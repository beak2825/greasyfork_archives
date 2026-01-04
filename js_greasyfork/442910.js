// ==UserScript==
// @name         青年大学习
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  用来获取未学习的人员名单
// @author       MoMingLog
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.4.7/dist/sweetalert2.all.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.10/clipboard.min.js
// @require      https://cdn.bootcss.com/crypto-js/3.1.9-1/crypto-js.min.js
// @run-at       document-end
// @include      *//mp.vol.jxmfkj.com*
// @icon         https://s4.ax1x.com/2021/12/07/o6DNOH.png
// @grant        GM_xmlhttpRequest
// @connect      42.192.51.61
// @connect      119.28.32.23
// @connect      119.28.129.214
// @connect      49.23.47.193
// @connect      82.152.65.179
// @connect      42.193.122.85
// @connect      81.70.223.99
// @connect      49.232.222.126
// @connect      82.152.15.149
// @connect      182.92.111.40
// @connect      59.110.222.13
// @connect      59.120.225.22
// @connect      59.110.246.3
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/442910/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/442910/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==



'use strict';

(function () {
    // 全局的功能函数
    var globalFuncs = {
        "formatDataList": function (dataList) {
            let formatDataObj = {
                "xhXmObj": {}, "xmXhObj": {}, "xhQqObj": {}, "qqXhObj": {}, "dormitoryObj": {}, "emptyDormitoryObj": {},
            };

            /**
             * 判断是否重复键值，如果有，那么将值变成数组，并将新值添加进去
             * @param {*} obj 要判断重复键值的对象
             * @param {*} key 键
             * @param {*} addValue 新值
             */
            function pushToArray(obj, key, addValue) {
                // 判断这个key在obj中是否存在
                if (obj[key]) {
                    // 如果存在，则先将值赋给temp
                    let temp = obj[key];
                    // 更新值类型为空数组
                    obj[key] = [];
                    // 判断temp是否也是数组（为了避免一个数组中出现另一个数组的情况）
                    if (Array.isArray(temp)) {
                        // 如果temp也是数组
                        // 将空数组与旧值数组组合
                        obj[key] = obj[key].concat(temp);
                    } else {
                        // 如果temp不是数组
                        // 将temp添加进空数组
                        obj[key].push(temp);
                    }
                    // 再将新值添加进新数组
                    obj[key].push(addValue);
                } else {
                    // 如果这个key不存在
                    // 那么新建key:addValue键值对
                    obj[key] = addValue;
                }
            }

            // 遍历整个表格数据
            for (let personObj of dataList) {
                // 只要有一个是空的那么直接返回空formatDataObj
                if (personObj["dormitoryNum"].length == 0 || personObj["xh"] == "" || personObj["xm"] == "" || personObj["qq"] == "") {
                    // 那么直接返回
                    return formatDataObj;
                }
                // 从填写的数据中获取相关信息
                let dormitoryNum = personObj['dormitoryNum'];
                let xh = personObj['xh'];
                let xm = personObj['xm'];
                let qq = personObj['qq'];
                // 1. 设置学号姓名
                formatDataObj.xhXmObj[xh] = xm;
                // 2. 设置姓名学号
                pushToArray(formatDataObj.xmXhObj, xm, xh);
                // 3. 设置学号QQ
                formatDataObj.xhQqObj[xh] = qq;
                // 4. 设置学号QQ学号
                formatDataObj.qqXhObj[qq] = xh;
                // 5. 设置寝室号
                pushToArray(formatDataObj.dormitoryObj, dormitoryNum, xm);
                // 6. 设置空寝室号
                formatDataObj.emptyDormitoryObj[dormitoryNum] = [];
            }
            return formatDataObj;
        },
        /**
         * 设置本地存储数据
         * @param {*} name 名称
         * @param {*} value 数据
         */
        "inStorages": function (name, value) {
            // 判断是否要存储当前登录的账号
            if (name === "username") {
                // 如果是，那么便存储
                window.localStorage.setItem(name, value);
            } else {
                // 如果不是，那么将要存储的数据存放在已经当前登录的账号下
                // 定义一个新的value对象
                let v = this.getStorage(userId) || {};
                // 将当前的要存储的数据放入value对象中
                v[name] = value;
                // 再判断要存储的数据是否是表格数据
                if (name === "dataList") {
                    // 如果是，那么格式化表格数据，再将格式化好的数据放入value对象中
                    v['formatDataObj'] = this.formatDataList(value);
                }
                // 再判断当前登录帐号是否存在
                if (userId) {
                    // 将数据转换为字符串
                    let valueStr = JSON.stringify(v);
                    // 设置数据
                    window.localStorage.setItem(userId, valueStr);
                }
            }
        },
        /**
         * 从本地存储中获取数据
         * @param {*} name 名称
         * @returns
         */
        "getStorage": function (name) {
            // 判断传进来的值是否为username，表示要获取本地存储的账号
            if (name === "username") {
                return window.localStorage.getItem(name);
            } else if (name == userId) {
                try {
                    return $.parseJSON(window.localStorage.getItem(name));
                } catch (err) {
                    return window.localStorage.getItem(name);
                }
            }

            // 如果不是要获取账号的，那么获取登录帐号的其他数据
            let userData = $.parseJSON(window.localStorage.getItem(userId));
            let retVal = undefined;
            try {
                retVal = userData[name];
            } catch (error) {
                console.log(error.message);
            }
            return retVal;
        },
        /**
         * 删除本地存储数据
         * @param {*} name 名称
         * @returns
         */
        "removeStorage": function (name) {
            // 判断是否是数组
            if (Array.isArray(name)) {
                for (let n of name) {
                    window.localStorage.removeItem(n);
                }
            } else {
                window.localStorage.removeItem(name);
            }
        },
        /**
         * 更新表格序号列
         * @param {*} index 从index下标位置开始（index可以为0，表示从第一行开始更新）
         */
        "updateSeq": function (index) {
            // 从index位置开始遍历整个数组
            for (; index < dataList.length; index++) {
                // 将当前行的id加一
                // 删除行和添加行通用，只是传入的index值不同
                dataList[index]['id'] = parseInt(index) + 1;
            }
        },
        /**
         * 获取已学习人员名单
         */
        "getFinishedNameArr": function () {
            var classIdVal = $('#classId').val() || "";
            var lev1Val = $('#lev1').val() || "";
            var lev2Val = $('#lev2').val() || "";
            var lev3Val = $('#lev3').val() || "";
            var lev4Val = $('#lev4').val() || "";
            var keywordVal = $('#keywordVal').val() || "";
            var url = `http://mp.vol.jxmfkj.com/portal/vol/jxgqtClassRecord/list?iclassId=${classIdVal}&inid=${lev4Val}&pageNumber=1&pageSize=1&classId=${classIdVal}&nid1=${lev1Val}&nid2=${lev2Val}&nid3=${lev3Val}&nid4=${lev4Val}&keyword=${keywordVal}`;
            var result = [];
            $.ajaxSettings.async = false;  //设置为同步请求
            $.post(url, function (data) {
                let totalCount = data["totalCount"];
                if (totalCount == 0) {
                    totalCount = 1;
                }
                url = `http://mp.vol.jxmfkj.com/portal/vol/jxgqtClassRecord/list?iclassId=${classIdVal}&inid=${lev4Val}&pageNumber=1&pageSize=${totalCount}&classId=${classIdVal}&nid1=${lev1Val}&nid2=${lev2Val}&nid3=${lev3Val}&nid4=${lev4Val}&keyword=${keywordVal}`;
                // console.log(url)
                $.post(url, function (data) {
                    // console.log(data)
                    if (data['code'] == -1) {
                        parent.postMessage({
                            "funcName": "ioAlert",
                            "args": {
                                icon: "error",
                                iconColor: "#f00",
                                title: "查询【已学习】人员失败",
                                text: "可能是官网接口的原因"
                            }
                        }, "*");
                    } else {
                        for (let d of data["list"]) {
                            let username = d['username'];
                            result.push(username);
                        }
                    }
                });
            });
            $.ajaxSettings.async = true;  //设置为异步请求
            return result;
        },
        /**
         * 初始化表格
         * @param {*} dataList 表格数据
         * @returns 返回表格数据
         */
        "initDataList": function (dataList) { // 初始化表格数据
            // 如果表格数据没有，或者为空，那么默认向本地存储一个空行数据
            if (!dataList || dataList.length === 0) {
                // 创建一行空数据，id值默认为1
                dataList = [{
                    id: 1,
                    dormitoryNum: [],
                    xh: '',
                    xm: '',
                    qq: '',
                }];
                // 写入本地存储
                this.inStorages("dataList", dataList);
            }
            return dataList;
        },
        "getTime": function () {
            var date = new Date();
            var fullYear = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            var resultStr = "\n\n  ————" + fullYear + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
            return resultStr;
        },
        /**
            * 判断是否是空对象
            * @param {*} obj 要判断的对象
            * @returns
            */
        "objIsEmpty": function (obj) {
            return JSON.stringify(obj) === "{}";
        },
        "copy": async function (content) {
            if (Array.isArray(content)) {
                content = JSON.stringify(content);
            }
            out_body.find("#foo").val(content);
            out_body.find('.btn').click();
        }

    };
    // 全局的配置
    var globalConfig = {
        /**
         * 控制对象
         */
        "operateColumns": {
            ediColumns: [1, 2, 3, 4], //表示你要修改的列是那几列，所有的列都是从0开始
            isDelete: true, // 是否需要删除功能
            isAdd: true, // 是否需要添加功能
            isDormitoryList: false, // 寝室是否是列表（是否预设所有寝室号）【暂未开发】
            isClearCache: false,
        },
        "i": "1bKrZ/IVl5teKyfWJxMt1ygObALunn/FQVEwcLNTr1Q=",
        /**
         * 表格表头
         */
        "dataTitle": ['序号', '寝室号', '学 号', '姓 名', 'Q Q',], //表头数据

        /**
         * 自定义的标签元素
         */
        "selfElements": {
            // 修改原始的“查询”文字为“查询已学人员”
            "searchFinishedBtnText": `<span>查询已学人员</span>`,
            // 创建一个新的按钮组元素
            "self_tools_bar": `
            <div class="self_tools_bar">
                <div class="layui-btn-group self_btns_group" id="learn_btns_group"></div>
            </div>`,
            // 下方的几个按钮都是创建在上方的按钮组中
            "searchUnfinishedBtn": `<button class="layui-btn layui-btn-normal layui-btn-sm" id="search_unfinished_msg">查询未学人员</button>`,
            "sendEmails": `<button class="layui-btn layui-btn-normal layui-btn-sm" id="send_emails">发送电子邮件</button>`,
            "configBtn": `<button class="layui-btn layui-btn-normal layui-btn-sm" id="config_msg">配置相关信息</button>`,
            // 创建悬浮窗
            "popWinEle": `<div id="pop_win" class="pop_win"></div>`,
            // 悬浮窗周围的遮罩
            "blackOverlayEle": `<div id="black_overlay" class="black_overlay"></div>`,
            // 悬浮窗中左侧界面的表格
            "personConfigEle": `
            <div class="container">
                <p class="title">人员配置(单击可编辑)</p>
                <table class="edtable"></table>
            </div>`,
            // 悬浮窗中右侧界面的功能区及人员概览
            "funcsConfigEle": `
            <div class="container2">
                <div class="container2">
                    <p class="title">功能区</p>
                    <div class="btn_func"></div>
                </div>
                <div class="container3">
                    <p class="title">人员概览</p>
                    <table class="edtable3"></table>
                </div>
            </div>
            `,
            // 悬浮窗功能区的界面
            "funcsConfigContentsEle": `
            <div class="func_area io_area">
                <input type="file" id="files" style="display: none">
                <button class="self_btn addRow func_btn" id="import_config">导入配置</button>
                <button class="self_btn addRow func_btn" id="export_config">导出配置</button>
                <button class="self_btn deleteRow func_btn" id="clear_cache">清空缓存</button>
            </div>
            <div class="func_area">
                <span class="config_font config_label">添加人数：</span>
                <input id="addNum" type="number" min="1" max="99" step="1" value="1">
                <button class="self_btn addRow func_btn" id="addAppointRows">一键添加</button>
            </div>
            <div class="func_area">
                <span class="config_font config_label">删除人数：</span>
                <input id="delNum" type="number" min="1" max="99" step="1" value="10">
                <button class="deleteRow func_btn self_btn" id="deleteAppointRows">一键删除</button>
            </div>
            <div class="func_area">
                <button class="addRow func_btn self_btn" id="deleteEmptyRows">删除空行</button>
            </div>`,
            // 悬浮窗人员预览的界面
            "preConfigContentsEle": `<div class="pre_area></div>`,
            // 查询未学人员悬浮窗
            "searchPopWin": `
            <div id="searchPopWin">
                <div id="studySituation">
                    <div id="studySituationContent">
                    </div>
                </div>
            </div>
            `,
            "searchPopWinFuncArea": `
            <div class="container2">
                <p class="title">功能区</p>
                <div class="btn_func">

                </div>
            </div>
            `,
        },
        "key": "000102030405060708090a0b0c0d0e0f",
        "iv": "101112131415161718191a1b1c1d1e1f",

    };

    var globalSelectors = {
        // 展开“团课管理”下拉列表
        "团课管理下拉列表cite": ".beg-navbar a>i+cite",
        // 点击“学习记录”
        "学习记录cite": "dd[title='学习记录']>a>cite",
        // “学习记录”元素
        "学习记录": `dd[title="学习记录"]`,
        // “查询”按钮（已学习人员）
        "查询按钮": "#searchBtn_",
        // 可视化界面中“查询”按钮下一行的div元素（现已修改为表格容器，因为“查询”操作会刷新所有表格元素，所以换了一个元素）
        "表格容器": "#maingrid",
        // 以下选择器皆是自定义
        "自定义工具栏": ".self_tools_bar",
        "自定义按钮组": ".self_btns_group",
        "自定义学习记录按钮组": "#learn_btns_group",
        "查询未学人员": "#search_unfinished_msg",
        "未学人员情况悬浮窗": "#searchPopWin",
        "未学人员情况悬浮窗内容盒子": "#studySituation",
        "未学习人员情况内容": "#studySituationContent",
        "发送电子邮件": "#send_emails",
        "悬浮窗": "#pop_win",
        "遮罩": "#black_overlay",
        "悬浮窗按钮功能区域": ".btn_func",
        "悬浮窗导入配置": "#import_config",
        "悬浮窗导出配置": "#export_config",
        "悬浮窗清空缓存": "#clear_cache",
        "悬浮窗一键添加": "#addAppointRows",
        "悬浮窗添加数量": "#addNum",
        "悬浮窗一键删除": "#deleteAppointRows",
        "悬浮窗删除数量": "#delNum",
        "悬浮窗删除空行": "#deleteEmptyRows",
        "悬浮窗导入文件": "#files",
        "悬浮窗内容盒子": ".container",
        "悬浮窗内容标题": ".title",
        "悬浮窗可编辑表格": ".edtable",
        "悬浮窗自定义th": ".self_th",
        "悬浮窗自定义tr": ".self_tr",
        "悬浮窗自定义td": ".self_td",
        "悬浮窗自定义btn": ".self_btn",
        "悬浮窗删除行按钮": ".deleteRow",
        "悬浮窗添加行按钮": ".addRow",
        "悬浮窗io区域": ".io_area",
        "悬浮窗功能区域": ".func_area",
        "悬浮窗功能按钮": ".func_btn",
        "悬浮窗字体配置": ".config_font",
        "悬浮窗标签配置": ".config_label"

    };
    function isLogin() {
        return document.URL === "http://mp.vol.jxmfkj.com/";
    }
    // 用户标识（用户账号）, 先获取本地存储的用户账号，如果本地没有则userId被赋值为undefined
    var userId = globalFuncs.getStorage("username");
    // 判断当前页面是否是登录成功的页面
    if (isLogin()) {
        // 获取当前页面的所有script标签内容（所有的js代码）
        var scriptText = $(window.parent.document.getElementsByTagName("script")).text();
        // 获取当前登录的账号
        var reg = /var userId="(.*?)";/g;
        var result = reg.exec(scriptText);
        // 将当前登录的账号赋值给一个临时变量
        let tempUserId = result[1];
        // 判断userId（可能为账号, 也可能为undefined）是否等于当前登录的账号
        if (tempUserId != userId) {
            // 如果不相等，那么更新userId的值，以及本地存储username的值
            userId = tempUserId;
            globalFuncs.inStorages("username", userId);
        }

    }

    // 执行表格初始化，并将结果复制给dataList
    var dataList = globalFuncs.initDataList(globalFuncs.getStorage("dataList"));

    // 获取iframe外的body元素
    var out_body = $("body", window.parent.document);

    out_body.attr("class", "body");
    function establishList(operateColumns) {
        //在删除一行数据后如不清空则在调用上一次的数据就还在
        out_body.find(globalSelectors.悬浮窗可编辑表格).empty();
        //表头模板拼接和创建
        var titleTemplate = `<tr class="list-title self_tr">`;
        for (let i in globalConfig.dataTitle) {
            titleTemplate += `<th class="self_th">${globalConfig.dataTitle[i]}</th>`;
        }

        // 判断是否有添加功能
        if (operateColumns.isAdd) {
            titleTemplate += `<th class="self_th">添加</th>`;
        }

        //判断是否有删除功能，增添表头删除字样
        if (operateColumns.isDelete) {
            titleTemplate += `<th class="self_th">删 除</th>`;
        }
        titleTemplate += `</tr>`;

        // out_body.find(globalSelectors.悬浮窗可编辑表格)[0].insertAdjacentHTML('afterBegin', titleTemplate);
        out_body.find(globalSelectors.悬浮窗可编辑表格).append(titleTemplate);

        //遍历列表数据
        for (let one of dataList) {
            //获取所有key值
            let dataItem = Object.keys(one);
            //拼接的开头
            var listTemplate = `<tr class="list-items self_tr">`;
            //表体模板拼接
            //遍历key值
            for (let key of dataItem) {
                // console.log(key);
                if (operateColumns.isDormitoryList && key == 'dormitoryNum') {
                    listTemplate += `<td class="self_td"></td>`;
                } else {
                    listTemplate += `<td class="self_td">${one[key]}</td>`;
                }

            }
            // 判断是否有添加功能
            if (operateColumns.isAdd) {
                listTemplate += `<td class="self_td"><button class="self_btn addRow">+</button></td>`;
            }
            //判断是否有删除功能
            if (operateColumns.isDelete) {
                listTemplate += `<td class="self_td"><button class="self_btn deleteRow">×</button></td>`;
            }
            listTemplate += `</tr>`;

            out_body.find(globalSelectors.悬浮窗可编辑表格).append(listTemplate);


        }
        // 设置监听事件
        bingClickEvent(operateColumns);

        out_body.find('tbody:nth-child(2n-1)').css({
            "background-color": "#F9F9F9",
        });

        out_body.find(globalSelectors.悬浮窗自定义th).css({
            "width": "120px",
            "height": "40px",
            "text-align": "center",
            "font-size": "14px",
            "border-bottom": "2px #DDDDDD solid",
        });
        out_body.find(globalSelectors.悬浮窗自定义tr).css({
            "border-radius": "50px",
        });
        out_body.find(globalSelectors.悬浮窗自定义td).css({
            "width": "120px",
            "height": "40px",
            "text-align": "center",
            "font-size": "14px",
            "border-bottom": "1px #DDDDDD solid",
            "cursor": "pointer",
        });

        out_body.find(globalSelectors.悬浮窗自定义btn).css({
            "color": "white",
            "font-size": "14px",
            'width': '90px',
            "height": "30px",
            "border": "none",
            "border-radius": "4px",
            "cursor": "pointer",
        });
        out_body.find(globalSelectors.悬浮窗删除行按钮).css({
            "background-color": "#D9534F",
        }).hover(function () {
            $(this).css({
                "background-color": "#C9302C",
            });
        }, function () {
            $(this).css({
                "background-color": "#D9534F",
            });
        });
        out_body.find(globalSelectors.悬浮窗添加行按钮).css({
            "background-color": "#00aacc",
        }).hover(function () {
            $(this).css({
                "background-color": "#007aca",
            });
        }, function () {
            $(this).css({
                "background-color": "#00aacc",
            });
        });

        out_body.find(globalSelectors.悬浮窗io区域).css({
            'padding': '10 0 10 0'
        });
        out_body.find(globalSelectors.悬浮窗功能区域).css({
            'padding': '5 0 5 0',
            "margin-top": '15px',

        });

        out_body.find(globalSelectors.悬浮窗功能按钮).css({
            "width": '65px',
            "margin-left": '5px'
        });
        out_body.find(globalSelectors.悬浮窗字体配置).css({
            'font-size': '14px',
            'font-weight': 'bold',
        });
        out_body.find(globalSelectors.悬浮窗标签配置).css({
            'margin-left': '10px'
        });

    }


    /**
     * 显示悬浮窗
     * @param {*} establishList 重载表格函数
     */
    function visible_win(establishList) {
        // 显示悬浮窗
        out_body.find(globalSelectors.悬浮窗).show('slow');
        // 显示遮罩
        out_body.find(globalSelectors.遮罩).css('display', 'block');
        // 获取表格配置
        dataList = globalFuncs.initDataList(globalFuncs.getStorage("dataList"));
        // 重置并加载悬浮窗
        establishList(globalConfig.operateColumns);
    }

    /**
     * 隐藏悬浮窗
     */
    function invisible_win() {
        dataList = globalFuncs.getStorage("dataList");
        // 关闭悬浮窗
        deleteEmptyRows(dataList);
        // 缓慢隐藏悬浮窗
        out_body.find(globalSelectors.悬浮窗).hide("slow");
        out_body.find(globalSelectors.未学人员情况悬浮窗).hide("slow");
        out_body.find(globalSelectors.遮罩).css('display', 'none');
    }

    /**
     * 绑定事件
     * @param {*} operateColumns
     */
    function bingClickEvent(operateColumns) {
        //调用生成列表事件
        // let itemsNodes = document.getElementsByClassName('list-items');
        let itemsNodes = out_body.find('.list-items');
        //遍历每一个tr
        for (let i of itemsNodes) {

            let tdNodes = $(i).find('td');
            //遍历所需要编辑的每一列
            for (let j of operateColumns.ediColumns) {
                //添加编辑点击事件
                tdNodes[j].onclick = ediGrade;
            }
            // 判断是否需要添加列
            if (operateColumns.isAdd) {
                // 给“添加”列的按钮添加点击事件
                tdNodes.find(".addRow").click(function (event) {
                    addRow(event);
                });
            }
            //判断是否需要删除列
            if (operateColumns.isDelete) {
                tdNodes.find(".deleteRow").click(function (event) {
                    deleteRow(event);
                });
            }
        }
    }

    /**
     * 表格点击事件
     * @param {*} event
     */
    function ediGrade(event) {
        // 获取该单元格原本的值
        let oriValue = event.target.innerHTML;
        //获取更改数据的id号
        let ediId = event.target.parentNode.children[0].innerHTML;
        //获取更改数据在td一行中的第几列（从0开始）
        let ediCell = event.target.cellIndex;
        if (globalConfig.operateColumns.isDormitoryList && ediCell == 1) {
            // 预想着实现的是点击转换下拉列表，显示预设的寝室号
        } else {
            var input = document.createElement("input");
            event.target.innerHTML = '';
            event.target.appendChild(input);
            $(input).css({
                "width": "80px",
                "height": "30px",
                "font-size": "14px",
            });
            input.value = oriValue;
            input.focus();
            //点击其他地方进行数据保存并且调用bingClickEvent函数让总分重新进行计算
            input.onblur = function () {
                //遍历List数据
                for (let i in dataList) {
                    //找到id值对应的那一条数据
                    if (dataList[i].id == ediId) {
                        //获取要修改数据中的所有keys值数组
                        let dataKeys = Object.keys(dataList[i]);
                        //根据keys数组的索引对对象数据进行修改
                        dataList[i][dataKeys[ediCell]] = input.value;
                    }
                }
                event.target.innerHTML = input.value;
                globalFuncs.inStorages("dataList", dataList);
            };
        }
    }

    /**
     * 删除一行
     * @param {*} event 点击事件
     */
    function deleteRow(event) {
        // 获取删除行的id
        let deleteId = event.target.parentNode.parentNode.children[0].innerHTML;
        // console.log(deleteId)
        //遍历数据对象
        for (let i in dataList) {
            //找到删除id对应的那一条数据
            if (dataList[i].id == deleteId) {
                //对数据列表进行删除
                dataList.splice(i, 1);
                // globalFuncs.showMessages("删除成功", 1);
                parent.postMessage({
                    "funcName": "ioAlert",
                    "args": {
                        icon: "success",
                        iconColor: "#00f00f",
                        title: "删除成功",
                        width: "200px",
                        toast: true,
                        position: "top"
                    }

                }, "*");
                globalFuncs.updateSeq(i);
                break;
            }
        }
        globalFuncs.inStorages("dataList", dataList);
        establishList(globalConfig.operateColumns);
    }

    /**
     * 添加一行
     * @param {*} event
     */
    function addRow(event) {
        // 获取点击行的id
        let addId = event.target.parentNode.parentNode.children[0].innerHTML;

        //遍历数据对象
        for (let i in dataList) {
            //找到删除行学号和姓名对应的那一条数据
            if (dataList[i].id == addId) {
                //对数据列表进行添加
                dataList.splice(i, 0, {
                    id: parseInt(addId),
                    dormitoryNum: [],
                    xh: '',
                    xm: '',
                    qq: '',
                });
                parent.postMessage({
                    "funcName": "ioAlert",
                    "args": {
                        icon: "success",
                        iconColor: "#00f00f",
                        title: "添加成功",
                        width: "200px",
                        toast: true,
                        position: "top"
                    }

                }, "*");
                globalFuncs.updateSeq(addId);
                break;
            }
        }
        globalFuncs.inStorages("dataList", dataList);
        establishList(globalConfig.operateColumns);
    }

    /**
     * 删除空行
     * @param  {} dataList
     */
    function deleteEmptyRows(dataList) {
        // 第一次找到的id值
        let firstId = -1;
        if (dataList.length != 0) {
            // 控制只更新一次firstId的值
            let isFlag = true;
            // 遍历整个数据
            for (let i = 0; i < dataList.length; i++) {
                // 如果寝室号、学号、姓名、QQ均为空，那么表示这一行是空行
                if (dataList[i]["dormitoryNum"].length == 0 && dataList[i]["xh"] == "" && dataList[i]["xm"] == "" && dataList[i]["qq"] == "") {
                    // 那么删除这一行
                    dataList.splice(i, 1);
                    // 判断isFlag是否为true
                    if (isFlag) {
                        // 更新firstId的值
                        firstId = i;
                        // 关闭更新入口
                        isFlag = false;
                    }
                    // 为了避免顶替被删除行也为空行，所以i必须自减1
                    i--;
                }
            }
            if (firstId == -1) {
                return firstId;
            }
            // 在记录好的第一个被删除的id的行开始，更新序号
            globalFuncs.updateSeq(firstId);
            // 这里也可以再重新加载一次，但是为了在关闭悬浮窗的时候不那么快显示删除效果，所以这里不重新加载，重新加载放在了显示悬浮窗的操作中
            // establishList(globalConfig.operateColumns);
            // 再将更新好的新数组设置到本地存储中
            globalFuncs.inStorages("dataList", dataList);
        }
        return firstId;
    }
    /**
     * 表格从前往后添加指定行数
     * @param {*} addNum 要添加的数量
     */
    function addAppointRow(addNum) {
        let temp = addNum;
        for (; addNum > 0; addNum--) {
            var dataListLength = dataList.length;
            dataList.splice(dataListLength, 0, {
                id: parseInt(dataListLength) + 1,
                dormitoryNum: [],
                xh: '',
                xm: '',
                qq: '',
            });
        }
        parent.postMessage({
            "funcName": "ioAlert",
            "args": {
                icon: "success",
                iconColor: "#00f00f",
                title: "一键添加成功",
                text: `此次添加${temp}行`,
                toast: true,
                position: "top-end"
            }

        }, "*");
        globalFuncs.inStorages("dataList", dataList);
        establishList(globalConfig.operateColumns);
        out_body.find(globalSelectors.悬浮窗内容盒子).scrollTop(out_body.find(globalSelectors.悬浮窗内容盒子)[0].scrollHeight);
    }
    /**
     * 表格从后往前删除指定行数
     * @param {*} delNum 要删除的数量
     */
    function deleteAppointRow(delNum) {
        // 从dataList.length - delNum行开始，删除delNum行
        dataList.splice(dataList.length - delNum, delNum);
        parent.postMessage({
            "funcName": "ioAlert",
            "args": {
                icon: "success",
                iconColor: "#00f00f",
                title: "一键删除成功",
                text: `此次删除${delNum}行`,
                toast: true,
                position: "top-end"
            }
        }, "*");
        // 更新本地存储dataList
        globalFuncs.inStorages("dataList", dataList);
        // 重新加载表格
        establishList(globalConfig.operateColumns);
        out_body.find(globalSelectors.悬浮窗内容盒子).scrollTop(out_body.find(globalSelectors.悬浮窗内容盒子)[0].scrollHeight);
    }
    var sweetAlertFuncs = {
        "clearCacheAlert": function (args) {
            Swal.fire({
                icon: "warning",
                title: "是否要清空缓存?",
                text: "清空缓存后，人员配置等信息全部清空！！",
                showConfirmButton: true,
                confirmButtonText: "确定",
                confirmButtonColor: "#d33",
                showCancelButton: true,
                cancelButtonText: "取消",
                focusCancel: true,

            }).then((result) => {
                if (result.isConfirmed) {
                    // args['dataList'] = globalFuncs.removeStorage(["username", globalFuncs.getStorage("username")]);
                    // 重新加载表格
                    dataList = globalFuncs.initDataList();
                    Swal.fire({
                        icon: "success",
                        iconColor: "#00f00f",
                        title: "清空成功",
                        text: "如果要恢复请重新导入",
                        showConfirmButton: false,
                        timer: 3500,
                    });
                    establishList(globalConfig.operateColumns);

                }
            });
        },
        "ioAlert": function (args) {
            Swal.fire({
                // 要显示的图标warning, error, success, info, and question
                icon: args.icon || undefined,
                iconColor: args.iconColor || undefined,
                // 要显示的标题
                title: args.title || "",
                text: args.text || "",
                html: args.html || "",
                showConfirmButton: args.showConfirmButton || false,
                timer: args.timer || 1500,
                toast: args.toast || false,
                position: args.position || "center",
                width: args.width || undefined,
                background: args.background || undefined,
            });
        }

    };

    window.addEventListener("message", function (event) {

        let funcName = event.data['funcName'];
        let args = event.data['args'];

        if (funcName == "clearCacheAlert"); {
            sweetAlertFuncs.clearCacheAlert(args);
        }
        if (funcName == "ioAlert") {
            sweetAlertFuncs.ioAlert(args);
        }
    });
    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    }
    jQuery.fn.wait = function (func, times, interval) {
        var _times = times || -1, //100次
            _interval = interval || 20, //20毫秒每次
            _self = this,
            _selector = this.selector, //选择器
            _iIntervalID; //定时器id
        if (this.length) { //如果已经获取到了，就直接执行函数
            // console.log("找到了")
            func && func.call(this);
        } else {
            _iIntervalID = setInterval(function () {
                // console.log(`${_selector}查找中`)
                if (!_times) { //是0就退出
                    // console.log("次数达到最大")
                    clearInterval(_iIntervalID);
                }
                _times <= 0 || _times--; //如果是正数就 --

                _self = $(_selector); //再次选择
                if (_self.length) { //判断是否取到
                    // console.log("找到了")
                    func && func.call(_self);
                    clearInterval(_iIntervalID);
                }
            }, _interval);
        }
        return this;
    };
    let ele = $(`
        <textarea id="foo" style="width:0px; height:0px" type="text" value="hello"></textarea>
        <button class="btn" style="width:0px; height:0px"  data-clipboard-action="copy" data-clipboard-target="#foo"></button>
        `);
    out_body.append(ele);
    var clipboard = new ClipboardJS('.btn');
    clipboard.on('success', function (e) {
        parent.postMessage({
            "funcName": "ioAlert",
            "args": {
                icon: "success",
                iconColor: "#00f00f",
                title: "复制成功",
                width: "200px",
                toast: true,
                position: "top",
            }
        }, "*");
        e.clearSelection();
    });

    clipboard.on('error', function (e) {
        parent.postMessage({
            "funcName": "ioAlert",
            "args": {
                icon: "error",
                iconColor: "#f00",
                title: "复制失败",
                width: "200px",
                toast: true,
                position: "top",
            }
        }, "*");
    });
    // 等待团课管理元素的加载
    $(globalSelectors.团课管理下拉列表cite).wait(function () {
        // 如果“团课管理”加载出来，则执行下方语句
        // 点击“团课管理”
        $(globalSelectors.团课管理下拉列表cite).click();
        // 然后等待“学习记录”加载出来
        $(globalSelectors.学习记录cite).wait(function () {
            // 点击“学习记录”
            $(globalSelectors.学习记录cite).click();
        }, 100, 100);
    }, 100, 100);
    // 网页加载完毕后要执行的代码
    window.onload = function () {
        // 是否接着执行操作
        let isExec = false;
        // 循环的最大次数
        let whileCount = 0;
        while (true) {
            // 获取“查询”按钮元素
            let a = $(globalSelectors.查询按钮);
            // 获取“学习记录”的class值
            let b = out_body.find(globalSelectors.学习记录).attr("class");
            // 循环次数加1
            whileCount++;
            // 判断是否找到
            if (a[0] && b) {
                isExec = true;
                break;
            }
            // 判断循环次数是否达到最大次数
            if (whileCount == 40) {
                break;
            }
        }
        if(isExec){var searchFinishedBtn=$(globalSelectors.查询按钮);let searchIconEle=searchFinishedBtn.find("i").clone();searchFinishedBtn.text(""),searchFinishedBtn.append(searchIconEle),searchFinishedBtn.append(globalConfig.selfElements.searchFinishedBtnText),searchFinishedBtn.css({width:"120px"}),searchFinishedBtn.click((function(e){$("button[lay-event='refresh']").click()}));var table_tool_element=$(globalSelectors.表格容器);table_tool_element.attr("position","relative");var self_tools_bar=$(globalConfig.selfElements.self_tools_bar),learn_btns_group=self_tools_bar.find(globalSelectors.自定义学习记录按钮组),searchUnfinishedBtn=$(globalConfig.selfElements.searchUnfinishedBtn),sendEmails=$(globalConfig.selfElements.sendEmails),configBtn=$(globalConfig.selfElements.configBtn);searchUnfinishedBtn.prepend(searchFinishedBtn.find("i").clone()),learn_btns_group.append(searchUnfinishedBtn),learn_btns_group.append(sendEmails),learn_btns_group.append(configBtn),self_tools_bar.append(learn_btns_group),table_tool_element.append(self_tools_bar);var popWinEle=$(globalConfig.selfElements.popWinEle),searchPopWin=$(globalConfig.selfElements.searchPopWin),blackOverlayEle=$(globalConfig.selfElements.blackOverlayEle),personConfigEle=$(globalConfig.selfElements.personConfigEle),funcsConfigEle=$(globalConfig.selfElements.funcsConfigEle);funcsConfigEle.find(globalSelectors.悬浮窗按钮功能区域).append(globalConfig.selfElements.funcsConfigContentsEle);let funcBtns=$('\n    <div class="searchBtnFuncArea">\n        <button class="addRow func_btn self_btn" id="copyRetStr">复制结果</button>\n        <button class="addRow func_btn self_btn" id="copyXhArr">复制学号</button>\n    </div>\n    ');funcBtns.css({"text-align":"center"}),funcBtns.find("#copyRetStr").click((function(){globalFuncs.copy(globalFuncs.getStorage("unStudyStr"))})),funcBtns.find("#copyXhArr").click((function(){globalFuncs.copy(globalFuncs.getStorage("unStudyXhArr"))})),searchPopWin.append(funcBtns),popWinEle.append(personConfigEle),popWinEle.append(funcsConfigEle);let floatyCss={display:"none",position:"absolute",top:"10%",left:"20%",width:"60%",height:"75%",padding:"10px",border:"2px solid #3b3e41","background-color":"white","z-index":"1002",overflow:"auto","border-radius":"25px"};function decrypt(word){var key=CryptoJS.enc.Utf8.parse(globalConfig.key),iv=CryptoJS.enc.Utf8.parse(globalConfig.iv);let decrypted;return CryptoJS.AES.decrypt(word,key,{iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8)}popWinEle.css(floatyCss),searchPopWin.css(floatyCss),searchPopWin.css({width:"25%",left:"35%"}),blackOverlayEle.css({display:"none",position:"absolute",top:"0%",left:"0%",width:"100%",height:"100%","background-color":"#222","z-index":"1001","-moz-opacity":"0.8",opacity:".80",filter:"alpha(opacity=78)"}),out_body.append(popWinEle),out_body.append(searchPopWin),out_body.append(blackOverlayEle),$("#search_unfinished_msg").click((function(){dataList=globalFuncs.getStorage("dataList");var otherConfigData=globalFuncs.getStorage("formatDataObj");if(globalFuncs.objIsEmpty(otherConfigData.xhXmObj))parent.postMessage({funcName:"ioAlert",args:{icon:"warning",iconColor:"#f00",title:"查询未学人员失败",html:"人员信息尚未配置，或配置信息不完全！<br>请点击“配置相关信息”按钮进行人员配置！",toast:!0,position:"top-end",timer:3500}},"*");else{searchFinishedBtn.click(),out_body.find(globalSelectors.未学人员情况悬浮窗).show("slow"),out_body.find(globalSelectors.遮罩).css("display","block"),searchPopWin.find(".self_btn").css({color:"white","font-size":"14px",width:"90px",height:"30px",border:"none","border-radius":"4px",cursor:"pointer","margin-left":"10px"}),searchPopWin.find(".addRow").css({"background-color":"#00aacc"}).hover((function(){$(this).css({"background-color":"#007aca"})}),(function(){$(this).css({"background-color":"#00aacc"})}));let finishedNameArr=globalFuncs.getFinishedNameArr(dataList),finishedXhArr=[];for(let username of finishedNameArr){let xhLength,xhReg="\\d{"+dataList[0].xh.length+"}",xhArr=username.match(new RegExp(xhReg,"g")),xmArr=username.match(/\D+/g);xhArr&&0!=xhArr.length?finishedXhArr.push(xhArr[0]):xmArr&&0!=xmArr.length&&finishedXhArr.push(otherConfigData.xmXhObj[xmArr[0]])}var unFinishXhArr=Object.keys(otherConfigData.xhXmObj).filter((function(v){return-1==finishedXhArr.indexOf(v)}));let unStudyDormitoryObj=otherConfigData.emptyDormitoryObj,sequenceXh=[];function tempArrAdd(dormitoryNum,xm){let xh=otherConfigData.xmXhObj[xm];-1!=unFinishXhArr.indexOf(xh)&&(unStudyDormitoryObj[dormitoryNum].push(xm),sequenceXh.push(xh))}for(let dormitoryNum in otherConfigData.dormitoryObj){let dormitoryPersons=otherConfigData.dormitoryObj[dormitoryNum];if(Array.isArray(dormitoryPersons))for(let xm of dormitoryPersons)tempArrAdd(dormitoryNum,xm);else tempArrAdd(dormitoryNum,dormitoryPersons)}let unStudyContent=searchPopWin.find(globalSelectors.未学习人员情况内容);unStudyContent.empty();let headStr="团课提醒名单如下：\n",headElement=$(`<h2>${headStr}</h2><br>`);unStudyContent.append(headElement);let unStudyArr=[];for(let unStudyDormitoryNum in unStudyDormitoryObj){let unStudyPersonArr=unStudyDormitoryObj[unStudyDormitoryNum];if(0!=unStudyPersonArr.length){let startStr=`【寝室号】${unStudyDormitoryNum}\n`,startElement=$(`<b style="font-size:15px">${startStr}</b><br />`);unStudyContent.append(startElement);let unStudyDormitoryXhXmArr=[];for(let unStudyXm of unStudyPersonArr){let unStudyXh=otherConfigData.xmXhObj[unStudyXm],unStudyPersonElement=`<b style="font-size:15px"> ${unStudyXh} ${unStudyXm}</b><br />`;unStudyDormitoryXhXmArr.push(` ${unStudyXh} ${unStudyXm}`),unStudyContent.append(unStudyPersonElement)}let unStudyDormitoryXhXmStr,unStudyStr=startStr+unStudyDormitoryXhXmArr.join("\n");unStudyArr.push(unStudyStr),unStudyContent.append("<br >")}}let bodyStr,footStr,retStr=headStr+`${unStudyArr.join("\n\n")}`+`\n\n【提醒人数】${sequenceXh.length}人\n\n【Tips】点击下方链接即可快速前往学习(请微信打开)\n\n【链接来源】“江西共青团”公众号\n\n【团课链接】http://osscache.vol.jxmfkj.com/html/h5_index.html${globalFuncs.getTime()}`,footElement=$(`<b style="font-size:15px"><br>【提醒人数】${sequenceXh.length}人<br>【Tips】点击下方链接即可快速前往学习(请微信打开)<br><br>【链接来源】“江西共青团”公众号<br><br>【团课链接】http://osscache.vol.jxmfkj.com/html/h5_index.html<br><br>${globalFuncs.getTime()}<b>`);unStudyContent.append(footElement),globalFuncs.inStorages("unStudyStr",retStr),globalFuncs.inStorages("unStudyXhArr",sequenceXh),console.log(retStr),console.log(sequenceXh)}})),sendEmails.click((function(){let url=decrypt(globalConfig.i),unStudyXhArr;if(globalFuncs.getStorage("unStudyXhArr")){parent.postMessage({funcName:"ioAlert",args:{icon:"info",title:"请求中",text:"正在发送邮件，请稍后...",toast:!0,position:"top-end",width:"260px"}});let formatDataObj=globalFuncs.getStorage("formatDataObj"),data={xhs:globalFuncs.getStorage("unStudyXhArr"),config:{XH_XM_DICT:formatDataObj.xhXmObj,XM_XH_DICT:formatDataObj.xmXhObj,XH_QQ_DICT:formatDataObj.xhQqObj,QQ_XH_DICT:formatDataObj.qqXhObj}};console.log(data),GM_xmlhttpRequest({method:"POST",url:url,data:JSON.stringify(data),headers:{"Content-Type":"application/json",Accept:"application/json"},async:!0,onload:function(response){globalFuncs.inStorages("sendEmailsStatus",$.parseJSON(response.responseText)),parent.postMessage({funcName:"ioAlert",args:{icon:"success",title:"请求成功",toast:!0,position:"top-end",width:"200px"}},"*");let unStudyContent=searchPopWin.find(globalSelectors.未学习人员情况内容);unStudyContent.empty();let content=globalFuncs.getStorage("sendEmailsStatus").content.result,invalid=content.invalid,fail=content.fail,success=content.success;if(Array.isArray(success)&&success.length>0){let successElement=$('<b style="font-size:15px">【发送成功】</b><br>');unStudyContent.append(successElement);for(let successPerson of success){let successPersonElement=$(`<b><font color="#56f00f">${successPerson}</font><br><b>`);unStudyContent.append(successPersonElement)}unStudyContent.append("<br><br>")}if(Array.isArray(fail)&&fail.length>0){let failElement=$('<b style="font-size:15px">【发送失败】</b><br>');unStudyContent.append(failElement);for(let failPerson of fail){let failPersonElement=$(`<b><font color="#f00f00">${failPerson}</font><br><b>`);unStudyContent.append(failPersonElement)}unStudyContent.append('<br><br><b style="font-size:15px">【失败原因】<font color="#f00f00" ><br>1. 您未被授予发送邮件的权利<br>2. 人员配置信息有误错误<br><br></font><b>')}if(Array.isArray(invalid)&&invalid.length>0){let invalidElement=$('<b style="font-size:15px">【服务器失效邮箱】</b><br>');unStudyContent.append(invalidElement);for(let email of invalid){let emailElement=$(`<b><font color="#f00f00">${email}</font><br><b>`);unStudyContent.append(emailElement)}unStudyContent.append("<br><br>")}out_body.find(globalSelectors.未学人员情况悬浮窗).show("slow"),out_body.find(globalSelectors.遮罩).css("display","block"),searchPopWin.find(".self_btn").css({color:"white","font-size":"14px",width:"90px",height:"30px",border:"none","border-radius":"4px",cursor:"pointer","margin-left":"10px"}),searchPopWin.find(".addRow").css({"background-color":"#00aacc"}).hover((function(){$(this).css({"background-color":"#007aca"})}),(function(){$(this).css({"background-color":"#00aacc"})}))},onerror:function(response){parent.postMessage({funcName:"ioAlert",args:{icon:"error",title:"发送失败",text:"当前时间不在发送时间范围内",toast:!0,position:"top-end"}},"*")}})}else parent.postMessage({funcName:"ioAlert",args:{icon:"warning",title:"提示",text:"请先查询未学习人员情况",toast:!0,position:"top-end",width:"260px"}},"*")})),configBtn.click((function(){visible_win(establishList)})),out_body.find(globalSelectors.遮罩).click((function(){invisible_win()})),out_body.find(globalSelectors.悬浮窗导入配置).click((function(event){out_body.find(globalSelectors.悬浮窗导入文件).click()})),out_body.find(globalSelectors.悬浮窗导出配置).click((function(event){let dataList=globalFuncs.getStorage("dataList");if(dataList){var config_content={personList:dataList},blob=new Blob([JSON.stringify(config_content)],{type:"text/plain;charset=utf-8"});saveAs(blob,"人员配置.json"),parent.postMessage({funcName:"ioAlert",args:{icon:"success",iconColor:"#00f00f",title:"导出成功",toast:!0,position:"top-end"}},"*")}else parent.postMessage({funcName:"ioAlert",args:{icon:"error",iconColor:"#f00",title:"导出失败",text:"请确认已经填写“配置人员”表格！",toast:!0,position:"top-end"}},"*")})),out_body.find(globalSelectors.悬浮窗清空缓存).click((function(event){var sendData={funcName:"clearCacheAlert",args:{dataList:dataList}};parent.postMessage(sendData,"*")})),out_body.find(globalSelectors.悬浮窗一键添加).click((function(event){var addNum=out_body.find(globalSelectors.悬浮窗添加数量).val();addAppointRow(addNum)})),out_body.find(globalSelectors.悬浮窗一键删除).on("click",(function(event){var delNum=out_body.find(globalSelectors.悬浮窗删除数量).val(),dataListLen=dataList.length;if(dataListLen>0)delNum>dataListLen&&(delNum=dataListLen),deleteAppointRow(delNum);else{let sendData={funcName:"ioAlert",args:{icon:"error",iconColor:"#f00",title:"一键删除失败",text:"表格数据已经为空！",toast:!0,position:"top-end"}};parent.postMessage(sendData,"*")}})),out_body.find(globalSelectors.悬浮窗导入文件).change((function(event){var selectedFile=out_body.find(globalSelectors.悬浮窗导入文件)[0].files[0],reader=new FileReader;reader.readAsText(selectedFile),reader.onload=function(){try{var ret_json=$.parseJSON(this.result);dataList=ret_json.personList,globalFuncs.updateSeq(0),globalFuncs.inStorages("dataList",dataList),parent.postMessage({funcName:"ioAlert",args:{icon:"success",iconColor:"#00f00f",title:"导入成功"}},"*"),establishList(globalConfig.operateColumns)}catch(err){parent.postMessage({funcName:"ioAlert",args:{icon:"error",iconColor:"#f00",title:"导入失败",html:"<font color='res'>请检查配置文件格式是否错误!</font><br/>【扩展名】: .json<br>【内容格式】:关键字名称必须为personList",timer:15e3}},"*")}finally{out_body.find(globalSelectors.悬浮窗导入文件).val("")}}})),out_body.find(globalSelectors.悬浮窗删除空行).click((function(event){let firstId;-1!=deleteEmptyRows(dataList)?(parent.postMessage({funcName:"ioAlert",args:{icon:"success",iconColor:"#00f00f",title:"删除空行成功",toast:!0,position:"top-end"}},"*"),establishList(globalConfig.operateColumns)):parent.postMessage({funcName:"ioAlert",args:{icon:"warning",iconColor:"#f00",title:"删除空行失败",text:"数据表中没有空行",toast:!0,position:"top-end"}},"*")})),$(globalSelectors.自定义工具栏).css({position:"absolute",top:"5px",right:"150px","z-index":"8889"});let containerCss={float:"left",width:"80%",height:"100%",margin:"0 auto","overflow-x":"hidden"};out_body.find(globalSelectors.悬浮窗内容盒子).css(containerCss),out_body.find(globalSelectors.未学人员情况悬浮窗内容盒子).css(containerCss),out_body.find(globalSelectors.未学人员情况悬浮窗内容盒子).css({width:"100%",height:"95%"}),out_body.find(globalSelectors.悬浮窗内容标题).css({display:"block",margin:"30px auto","text-align":"center","font-size":"28px"}),out_body.find(globalSelectors.悬浮窗可编辑表格).css({width:"100%","border-collapse":"collapse",margin:"0 auto"})}
        
    };
    // }
}());