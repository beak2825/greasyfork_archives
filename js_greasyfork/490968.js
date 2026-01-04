// ==UserScript==
// @name         yearning-plus
// @namespace    http://tampermonkey.net/
// @version      2024-07-17.1
// @description  功能增强-支持sql提示
// @author       zhming
// @match        *yearning.int.zhumanggroup.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/490968/yearning-plus.user.js
// @updateURL https://update.greasyfork.org/scripts/490968/yearning-plus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 监听所有的 XMLHttpRequest 请求
    var open = window.XMLHttpRequest.prototype.open;
    var send = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.status === 200) {
                // 获取响应内容
                var responseText = this.responseText;

                // 修改响应内容
                var url = this.responseURL;
                console.log(url);
                if (url.includes("api/v2/query/fetch_base")) {
                    setTimeout(function () {
                        // 添加自动提示事件
                        autocompleteEvent();
                    }, 500);
                }
                if (!url.includes("api/v2/fetch/source?idc=") || url.includes("change=1")) {
                    return;
                }
                let php = ["---以下PHP---", "r_sdbattery", "r_sdbackend", "r_sd_stat", "r_sd_xxl_job", "r_sd_device", "r_sd_finance", "r_sd_orders", "r_offline_all", "r_dtm_orders", "r_dtm_finance", "r_dtm_device", "r_dtm_stat", "r_dtm_main", "rr_user_center", "r_sd_factory", "r_sd_users", "r_polardb_bigdata_all", "r_sd_orders_suffix", "rw_ali_us_oversea"];
                let java = ["---以下JAVA---", "r_polardb-bigdata-middle-all", "r_sd-api-db\t", "r_mysql-sd-prod-middle-ims-all", "mysql-sd-prod-middle-account-sd_post_sale", "r-mysql-sd-prod-middle-settlement-all", "r-mysql-app-partner-all", "r-mysql-sd-prod-middle-crm-all", "r_mysql-sd-prod-middle-order-all", "r_mysql-sd-prod-middle-liquidation-all", "r_mysql-sd-prod-middle-funds-biz-all", "r_mysql-sd-prod-middle-trade-all", "r_mysql-sd-prod-middle-reception-all", "r_mysql-user-store-work-flow", "r_mysql_zm_user_marketing"];
                let jd = [];
                let bigdata = [];
                let userName = sessionStorage.getItem("user");
                let allwoList = ["zihaoran", "yujing", "zhongziqi", "zitaixu"];
                if (!url.includes('%E8%A1%97%E7%94%B5%E7%A0%94%E5%8F%91') && allwoList.includes(userName)) {
                    jd = ["---以下街电---", "r-sd_retail_goods", "r_sd_robot", "mysql-sd-prod-middle-ims-store_task", "r-polardb-zm-assets"];
                     bigdata = ["---以下大数据---","r-polardb"];
                }

                responseText = JSON.parse(responseText);
                var idc = "JAVA生产";
                if (url.includes("JAVA")) {
                    responseText.payload.source.push(...php, ...jd,...bigdata);
                }
                if (url.includes("PHP")) {
                    responseText.payload.source.push(...java, ...jd,...bigdata);
                }
                if (url.includes('%E8%A1%97%E7%94%B5%E7%A0%94%E5%8F%91')) {
                    responseText.payload.source.push(...java, ...php,...bigdata);
                }

                // 更新响应内容
                Object.defineProperty(this, 'responseText', {value: JSON.stringify(responseText)});
            }
        });
        return open.apply(this, arguments);
    };
    window.XMLHttpRequest.prototype.send = function () {
        // 继续原始的 XMLHttpRequest.send 方法
        return send.apply(this, arguments);
    };


    GM_addStyle("https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css");
    GM_addStyle(`
        .ui-autocomplete {
          max-height: 200px !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          position: absolute;
          z-index: 9999;
        }
    `)
    var _data = {
        "findCache": [], "findNum": 0, "tableCache": {}, "defAuto": []
    };

    var addTimer = setInterval(function () {
        //检查依赖扩展是否安装
        if (typeof jQuery == 'undefined') {
            alert("依赖扩展未安装：通过：https://crxdl.com 查询：jnnkmalnijfcglljcmaihlbnigpfegkd 下载依赖安装，或直接谷歌商场下载【yearning助手】")
            clearInterval(addTimer);
            return;
        }
        if ($(".findTable").length == 0) {
            findTableHtml();
            clearInterval(addTimer);
        }
    }, 1000);

    function findTableHtml() {
        let html = '<li class="ivu-menu-item findTable">' + '<i class="ivu-icon ivu-icon-md-search" style="font-size: 18px;" id="addOptionBtn"></i>' + '<input type="text" id="myInput">' + '</li>';
        $(".ivu-menu-light").append(html);
        jQuery.getScript("https://libs.baidu.com/jqueryui/1.8.22/jquery-ui.min.js", function () {
            $(document).ready(function () {
                let findCache = localStorage.getItem('_findCache');
                if (findCache != null) {
                    _data.findCache = JSON.parse(findCache);
                }
                let tableCache = localStorage.getItem('_tableCache');
                if (tableCache != null) {
                    _data.tableCache = JSON.parse(tableCache);
                }
                autoTips();

                $('#addOptionBtn').on('click', function () {
                    //缓存数据
                    cacheFind();
                    setTimeout(function () {
                        localStorage.setItem('_findCache', JSON.stringify(_data.findCache));
                        localStorage.setItem('_tableCache', JSON.stringify(_data.tableCache));
                        autoTips();
                        alert("缓存更新成功！！！")
                    }, 5000);
                });
            });
        });
    }

    function autocompleteEvent() {
        console.log("autocompleteEvent");
        $("#showImage .ivu-tree-children .ivu-tree-children .ivu-icon-ios-arrow-forward").parent().parent().click(function () {
            var db = $(this).find(".ivu-tree-title:first").text();
            var source = $(this).parent().parent().find(".ivu-tree-title:first").text();
            var libKey = source + ":" + db;
            if (!_data.tableCache.hasOwnProperty(libKey)) {
                _data.tableCache[libKey] = {};
            }
            console.log(libKey);
            autocomplete(_data.tableCache[libKey])
        })
    }

    function autocomplete(tableColumns) {
        $('.ivu-tabs-content .ace_editor').each(function () {
            var parent = $(this).parent();
            if (parent.css('visibility') === 'visible') {
                var editor = this.aceEditor;
                editor.session.setMode("ace/mode/sql");

                // 异步加载语言工具扩展
                ace.config.loadModule("ace/ext/language_tools", function () {
                    // 启用自动补全
                    editor.setOptions({
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                    });
                    //缓存第一次的补全逻辑
                    if (_data.defAuto.length === 0) {
                        _data.defAuto = editor.completers;
                    }
                    // 自定义补全逻辑
                    editor.completers = [..._data.defAuto, {
                        getCompletions: function (editor, session, pos, prefix, callback) {
                            // 获取编辑器中的所有行
                            var lines = session.getDocument().getAllLines();
                            var linePrefix = lines.slice(0, pos.row + 1).join("\n").substring(0, pos.column);

                            // 正则表达式匹配 FROM 和 JOIN 语句中的表名及别名
                            var tableNameRegex = /\b(FROM|JOIN)\s+(\w+)(\s+(\w+))?/gi;
                            var match;

                            // 用于存储已经匹配过的表别名
                            var tableAliases = {};

                            // 用于存储当前有效的表名
                            var currentTableName = null;

                            // 遍历所有行，匹配 FROM 和 JOIN 语句中的表名及别名，并确定当前有效的表名
                            for (var i = 0; i <= pos.row; i++) {
                                var line = lines[i];

                                // 排除注释行
                                if (line.trim().startsWith("--")) {
                                    continue;
                                }

                                while ((match = tableNameRegex.exec(line)) !== null) {
                                    var tableName = match[2]; // 获取表名
                                    var tableAlias = match[4]; // 获取表别名

                                    if (tableAlias) {
                                        tableAliases[tableAlias] = tableName;
                                    } else {
                                        tableAliases[tableName] = tableName;
                                    }

                                    if (i === pos.row && linePrefix.includes("WHERE") || linePrefix.includes("ON")) {
                                        currentTableName = tableName;
                                    }
                                }
                            }

                            // 根据当前有效的表名或别名生成补全项
                            var completions = [];

                            // 添加表名补全项
                            Object.keys(tableColumns).forEach(function (tableName) {
                                completions.push({
                                    name: tableName,
                                    value: tableName,
                                    score: 100,
                                    meta: "table"
                                });
                            });

                            // 添加字段补全项
                            if (currentTableName) {
                                var table = tableAliases[currentTableName] || currentTableName;
                                if (tableColumns.hasOwnProperty(table)) {
                                    tableColumns[table].forEach(function (column) {
                                        completions.push({
                                            name: column,
                                            value: column,
                                            score: 100,
                                            meta: "column"
                                        });
                                    });
                                }
                            }

                            // 添加别名字段补全项
                            Object.keys(tableAliases).forEach(function (alias) {
                                var table = tableAliases[alias];
                                if (tableColumns.hasOwnProperty(table)) {
                                    tableColumns[table].forEach(function (column) {
                                        completions.push({
                                            name: alias + "." + column,
                                            value: alias + "." + column,
                                            score: 100,
                                            meta: "alias column"
                                        });
                                    });
                                }
                            });

                            // 调用回调函数返回补全项
                            callback(null, completions);
                        }
                    }];
                });
            }
        });
    }

    function autoTips() {
        $("#myInput").autocomplete({
            source: function (request, response) {
                var term = request.term;
                var matchingResults = [];

                // 寻找包含用户输入内容的结果
                _data.findCache.forEach(function (item) {
                    if (item.toString().indexOf(term) !== -1) {
                        matchingResults.push(item);
                    }
                });

                // 将完全匹配的项排在第一位
                matchingResults.sort(function (a, b) {
                    let at = a.split("~")[0];
                    let bt = b.split("~")[0];
                    if (at.length > bt.length) {
                        return 1
                    } else if (at.length == bt.length) {
                        return 0;
                    } else {
                        return -1
                    }
                });

                response(matchingResults);
            },
            minLength: 2
        });
    }

    function excludeKey(key) {
        //处理分库表--仅保留0
        let matches = key.match(/\d+/);
        if (matches && matches[0] != 0) {
            return true;
        }
        //其他关键字
        let keywords = ["mysql", "_schema", "xxl_job"];
        let regexStr = "(" + keywords.join("|") + ")";
        let regex = new RegExp(regexStr, "gi");
        matches = key.match(regex);
        if (matches) {
            return true;
        }
        return false;
    }

    function cacheFind() {
        alert("缓存时间较长，确认后请耐心等待，成功后会弹出确认提示");
        _data.findCache = [];
        _data.tableCache = {};
        let idcList = ["JAVA生产", "PHP生产"];
        idcList.forEach(function (idc) {
            sendRequest("GET", "/api/v2/fetch/source?tp=query&idc=" + idc, null, function (sourceRes) {
                if (sourceRes.payload.source != null) {
                    sourceRes.payload.source.forEach(function (source) {
                        //此source暂时排除
                        if (source === 'rw_ali_us_oversea') {
                            return;
                        }
                        sendRequest("PUT", "/api/v2/query/fetch_base", {"source": "" + source + ""}, function (dbRes) {
                            if (dbRes.payload.highlight != null) {
                                dbRes.payload.highlight.forEach(function (dbValue) {
                                    let db = dbValue.vl;
                                    if (excludeKey(db)) {
                                        return;
                                    }
                                    sendRequest("GET", "/api/v2/query/fetch_table?title=" + db + "&source=" + source, null, function (tableRes) {
                                        if (tableRes.code == 1200 && tableRes.payload.highlight != null) {
                                            tableRes.payload.highlight.forEach(function (tableValue) {
                                                let table = tableValue.vl;
                                                if (excludeKey(table)) {
                                                    return;
                                                }
                                                _data.findCache.push(table + "~" + idc + ":" + source + ":" + db)

                                                //缓存表字段
                                                var libKey = source + ":" + db;
                                                if (!_data.tableCache.hasOwnProperty(libKey)) {
                                                    _data.tableCache[libKey] = {};
                                                }
                                                sendRequest("GET", "/api/v2/query/table_info?data_base=" + db + "&source=" + source + "&table=" + table, null, function (colRes) {
                                                    if (colRes.code == 1200 && colRes.payload != null) {
                                                        var columns = [];
                                                        colRes.payload.forEach(function (colValue) {
                                                            columns.push(colValue.field)
                                                        })
                                                        _data.tableCache[libKey][table] = columns;
                                                    }
                                                })
                                            })
                                        }
                                    })
                                })
                            }
                        })
                    });
                }
            })
        })
    }

    function sendRequest(method, url, data, successCallback, errorCallback, async) {
        $.ajax({
            type: method, url: url, data: data, xhrFields: {
                withCredentials: true
            }, headers: {
                'Authorization': sessionStorage.getItem('jwt')
            }, success: function (response) {
                if (successCallback) {
                    successCallback(response);
                }
            }, error: function (xhr, status, error) {
                if (errorCallback) {
                    errorCallback(xhr, status, error);
                }
            },
            async: async ? true : false,
        });
    }


})();