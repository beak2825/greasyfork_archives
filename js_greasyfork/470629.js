// ==UserScript==
// @name         GDBScriptNew
// @version      10
// @description  Select Custom Script
// @author       JeJe
// @match        http://10.128.11.21:9123/sqlquery/
// @match        http://review.etczs.net/sqlquery/
// @grant        none
// @license      JeJe
// @note         // @require      https://gosspublic.alicdn.com/aliyun-oss-sdk-6.18.0.min.js
// @namespace https://www.jeje.me
// @downloadURL https://update.greasyfork.org/scripts/470629/GDBScriptNew.user.js
// @updateURL https://update.greasyfork.org/scripts/470629/GDBScriptNew.meta.js
// ==/UserScript==

// -------Replace the above account password with your own account password-----
var userName = '';
var passWord = '';
// -------Replace the above account password with your own account password-----

var jwt = '';

// -------Aliyun OSS Config -------
 var client = new OSS({
        region: "oss-cn-shenzhen",
        accessKeyId: "LTAI5tDuW7G17JewH2uzFU4cZK",
        accessKeySecret: "YolaVfWBTm4JeB6LiqxbjABryantKvs5IDzkUY",
        bucket: "jeje"
 });

var dirFile = 'uPic/' + userName + 'sql.json';
// -------Aliyun OSS Config -------

// By default, the page query button is invalid :(CTRL + r or command+ r)
document.onkeydown = function (e) {
    var keyCode = e.keyCode || e.which || e.charCode;
    var ctrlKey = e.ctrlKey || e.metaKey;
    if (ctrlKey && keyCode == 82) {
        retry = true;
        query();
        writeSqlToLocal(editor.getValue());
        readJwt();
        return false;
    }
}


var clsName = '';
var dbName = '';
var dbs = [];
var columns = [];
var retry = false;
var dataClusterName = [];


// Save the database query statement
function writeSqlToLocal(data){
    const buffer = new OSS.Buffer(data);
    client.put(dirFile, buffer).then(function (result) {
        console.dir('writeSql' + result);
        console.dir(result);
    }).catch(function (err) {
        console.log(err);
    });
}

// Read a database query statement
function readSqlToLocal() {
    console.dir(client);
    client.get(dirFile).then(function (result) {
        const decoder = new TextDecoder('utf-8');
        console.dir('redSql' + result);
        console.dir(result);
        console.dir(decoder.decode(result.res.data));
        editor.setValue(decoder.decode(result.res.data));
        $('#instance_name').find('#optgroup-mysql :nth-child(3)').attr("selected",true);
        const select = document.querySelector('#instance_name');
        select.dispatchEvent(new Event('change'));
    }).catch(function (err) {
        console.log(err);
    });
}

// read Jwt
function readJwt() {
    var file = 'uPic/jwt.json';
    return client.get(file).then(function (result) {
        const decoder = new TextDecoder('utf-8');
        console.dir('readToken:' + result.res.data);
        jwt = decoder.decode(result.res.data);
    }).catch(function (err) {
        console.log(err);
    });
}

// Obtain the clusters, databases, and data tables that can be queried by the current user
(function () {
        //$('.col-md-2').remove();
        //$('.col-md-10').addClass('col-md-12').removeClass('col-md-10');
        //$('.col-md-9').addClass('col-md-12').removeClass('col-md-9');
        //$('.col-md-3').css('display','none');
        //$('.text-info').remove();
        //$('.text-center').remove();
        //$('.navbar').remove();
        //$('#page-wrapper').css('margin','0px')
        //$('body').css('overflow','hidden');
        //$('.panel-heading').remove();
        //$('.panel panel-default').css('margin-bottom','0px');
        $('body').append('<div class="modal fade" id="loadingModal"><div style="width: 200px;height:20px; z-index: 20000; position: absolute; text-align: center; left: 50%; top: 50%;margin-left:-100px;margin-top:-10px"><div class="progress progress-striped active" style="margin-bottom: 0;"><div class="progress-bar" style="width: 100%;"></div></div><h5>查询中...</h5></div></div>')
        var resizes = editor.resize.bind(editor, null)
        resizes();

        $.ajax({
            type: "post",
            url: "/group/user_all_instances/?tag_codes%5B%5D=can_read",
            dataType: "json",
            async: false,
            data: {
                limit: 1000,
                offset: 0
            },
            complete: function () {},
            success: function (response) {
                if (response.data.length > 0) {
                    var privileges = response.data;
                    dataClusterName = [];
                    var skipInstance = [
                        'MySQL-Etc_10.128.24.132',
                        'MySQL-Member_10.128.24.111',
                        'MySQL-Tolls_10.128.24.151',
                        'MySQL-Etc_10.128.24.130',
                        'DBM-ETC_Shardingspere',
                        'Big-Member-db_10.127.37.29',
                        'Big-Etc-db_10.127.37.36',
                        'Big-KF_10.128.26.101',
                        'Big-Customer-db_10.127.37.31',
                        'MySQL-Bigdata_10.128.24.11',
                        'MySQL-Bigdata_10.128.24.70',
                        'Big-Test-db_10.127.8.2',
                        'tdsql-mysql_10.128.26.50',
                        'MySQL-Insurance_10.128.26.70',
                        'DBM-ETC_SpEX'
                    ];

                    for (var c = 0; c < privileges.length; c++) {
                        if (dataClusterName.indexOf(privileges[c]['instance_name']) === -1
                            && skipInstance.indexOf(privileges[c]['instance_name']) === -1
                            && privileges[c]['instance_name'].substring(0,5) !== 'Redis'
                           ) {
                            dataClusterName.push(privileges[c]['instance_name']);
                        }
                    }
                } else {
                    alert("获取集群失败:status: " + data.status + "\nmeesg: " + data.msg + data.data);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('获取集群异常' + errorThrown);
            }
        });

        console.log('集群:' + dataClusterName);

    for (var d = 0; d < dataClusterName.length; d++) {
            clsName = dataClusterName[d];
            $.ajax({
                type: "post",
                url: "/instance/instance_resource/?instance_name="+clsName+"&resource_type=database",
                dataType: "json",
                async: false,
                data: {
                    cluster_name: clsName
                },
                complete: function () {},
                success: function (data) {
                    if (data.status === 0) {
                        var result = data.data;
                        // Prompt for auto completion
                        setCompleteData(result)
                        for (var i = 0; i < result.length; i++) {
                            dbName = result[i];
                            $.ajax({
                                type: "post",
                                url: "/instance/instance_resource/?instance_name="+clsName+"&db_name="+dbName+"&resource_type=table",
                                dataType: "json",
                                async: false,
                                data: {
                                    cluster_name: clsName,
                                    db_name: dbName
                                },
                                complete: function () {},
                                success: function (response) {
                                    if (response.status === 0) {
                                        var ret = response.data;
                                        console.log('ret'+ret);
                                        for (var j = 0; j < ret.length; j++) {
                                            if (dbs[ret[j]] == undefined) {
                                                dbs[ret[j]] = [];
                                            }

                                            if (dbs.hasOwnProperty(ret[j])) {
                                                dbs[ret[j]].push({
                                                    cluster_name: clsName,
                                                    db_name: dbName
                                                })
                                            } else {
                                                dbs[ret[j]] = {
                                                    cluster_name: clsName,
                                                    db_name: dbName
                                                };
                                            }
                                        }
                                        // Prompt for auto completion
                                        setTablesCompleteData(ret)
                                    } else {
                                        console.log("status: " + data.status +
                                            "\nmeesg: " + data.msg + data.data);
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    console.log(errorThrown);
                                }
                            });
                        }
                    } else {
                        console.log("status: " + data.status + "\nms22g: " + data.msg + data.data);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        }

        console.dir('表' + dbs);
        console.log('success');

        window.onbeforeunload = function (event) {
            event.returnValue = "确认退出?";
        };

        document.addEventListener('copy', function (e) {
            var sqlSelectContent = e.clipboardData.getData('text/plain');
            var documentContent = document.getSelection().toString();
            var content = sqlSelectContent || documentContent;
            console.log(content.trim())
            e.clipboardData.setData('text/plain', content.trim());
            e.preventDefault();
        });

       document.execCommand('copy');
       readSqlToLocal();
})();

var script = document.createElement("script");
script.type = "text/javascript";
script.appendChild(document.createTextNode("function select_db(obj) {$('#selcts').remove();$('#instance_name').empty();$('#instance_name').append(\"<option value='\"+ $(obj).attr('cluster-name') +\"' selected='selected'>请选择数据库:</option>\");$('#db_name').empty();$('#db_name').append(\"<option value='\"+ $(obj).attr('db-name') +\"' selected='selected'>请选择数据库:</option>\");$('#table_name').empty();$('#table_name').append(\"<option value='\"+ $(obj).attr('tableName') +\"' selected='selected'>请选择表:</option>\");return sqlquery($(obj).attr('sql'));}function selcts_remove() {$('#selcts').remove();}"));
script.appendChild(document.createTextNode("function executeReviewPass(sn, sign) {if(confirm(\"确定要执行审核通过吗？\") == true) {$.ajax({type:\"post\",url: \"https://api-pre.etczs.net/no-login/execute-review-pass\",dataType: \"json\",async: false,data: {\"sign\":sign,\"order_sn\":sn},complete: function () {},success: function (response) {if (response.code != 0) { alert(response.msg)} else {console.log(response)}},error: function (XMLHttpRequest, textStatus, errorThrown) {alert(errorThrown);}});}}"));
script.appendChild(document.createTextNode("function executeFinish(sn, sign) {if(confirm(\"确定要执行完成吗？\") == true) {$.ajax({type:\"post\",url: \"https://api-pre.etczs.net/no-login/execute-finish\",dataType: \"json\",async: false,data: {\"sign\":sign,\"order_sn\":sn},complete: function () {},success: function (response) {if (response.code != 0) { alert(response.msg)} else {console.log(response)}},error: function (XMLHttpRequest, textStatus, errorThrown) {alert(errorThrown);}});}}"));
script.appendChild(document.createTextNode("function executeRetry(id, sign, token) {if(confirm(\"确定要执行重试吗？\") == true) {$.ajax({type:\"post\",url: \"https://api-pre.etczs.net/no-login/execute-retry\",dataType: \"json\",async: true,data: {\"sign\":sign,\"id\":id,\"token\":token},complete: function () {},success: function (response) {if (response.code != 0) { alert(response.msg)} else {console.log(response)}},error: function (XMLHttpRequest, textStatus, errorThrown) {alert(errorThrown);}});}}"));
document.body.appendChild(script);

// Query Sql authentication
function sqlvalidate() {
    var result = true;
    var select_sqlContent = editor.session.getTextRange(editor.getSelectionRange());
    if (select_sqlContent) {
        var sqlContent = select_sqlContent
    } else {
        var sqlContent = editor.getValue();
    }

    var cluster_name = $("#cluster_name").val();
    var db_name = $("#db_name").val();

    if (sqlContent === null || sqlContent.trim() === "") {
        alert("SQL内容不能为空！");
        return result = false;
    } else if (cluster_name === null || cluster_name === $("#cluster_name").attr("data-placeholder")) {
        console.log("请选择集群！");
        return result = true;
    } else if (db_name === null || db_name === $("#db_name").attr("data-placeholder")) {
        console.log("请选择数据库！");
        return result = true;
    }
    return result;
}

// Check before query
function query() {
    $('#selcts').remove();
    if (sqlvalidate()) {
        var sql = '';
        columns = [];
        var select_sqlContent = editor.session.getTextRange(editor.getSelectionRange());
        if (select_sqlContent) {
            sqlContent = select_sqlContent
        } else {
            var sqlContent = editor.getValue();
        }
        // Viewing the Execution Plan
        // Viewing the Execution Plan
        if (sql === 'explain') {
            sqlContent = 'explain ' + sqlContent
        }
        // Viewing Table Structure
        else if (sql === 'show create table') {
            var table_name = $("#table_name").val();
            sqlContent = "show create table " + table_name + ";"
        }
        // Process Sql, removing comments, empty lines, etc
        sqlContent = sqlContent.replace(/^--\s+.*|^#\s+.*/g, '');
        sqlContent = sqlContent.replace(/[\r\n\f]{2,}/g, '\n');
        sqlContent = sqlContent.trim();
        var tableName = '';
        sqlContent.match(/\s+from\s+(\w+)/g);
        tableName = RegExp.$1;
        if (tableName == '') {
            sqlContent.match(/\s+table\s+(\w+)/g);
            tableName = RegExp.$1;
        }

        console.log('查询表:' + tableName);
        console.dir(dbs);
        console.dir(dbs[tableName]);
        var str =
            '<div id="selcts" style="display: block;z-index: 9999;margin-top:-600px;margin-left: 500px;width: auto;padding: 10px;"class="export btn-group open"><ul style="padding:10px;"class="dropdown-menu" role="menu"><li class="text-info" style="list-style-type: none;margin-bottom: 5px;"><label>待查询的表:' +
            tableName +
            '存在于多个集群的多个数据库中, 请选择要查询的集群和数据库!</label><button style="margin-left: 15px;margin-top: -10px;border: 0;margin-right: -10px;"class="btn btn-default btn-sm pull-right" onclick="return selcts_remove()"><span class="glyphicon glyphicon-remove"></span></button></li>'
        if (dbs[tableName] != undefined && dbs[tableName].length > 1) {
            for (var s = 0; s < dbs[tableName].length; s++) {
                str += '<li onclick="return select_db(this)" sql="' + sql + '" sql-content="' + sqlContent + '"tableName="' + tableName +
                    '"cluster-name = "' + dbs[tableName][s]['cluster_name'] + '" db-name="' + dbs[tableName][s][
                        'db_name'] +
                    '" style="border-bottom:1px solid #ccc;list-style-type: none;cursor: pointer;margin: 6px;font-size: 15px;font-weight: 700;"><input type="radio" data-field="1"  style="margin-right: 10px;">集群: ' +
                    dbs[tableName][s]['cluster_name'] + ' --> ' + dbs[tableName][s]['db_name'] + ' 数据库</li>'
            }
            str += '</ul></div>'
            $('#page-wrapper').append(str);
            return false;
        } else {
            if (dbs[tableName] == undefined) {
                alert('查询错误，待查询的表：' + tableName + '不存在于你的可查询表列表，请核实后再试');
                return false;
            }

            cluster_name = dbs[tableName][0]['cluster_name'];
            db_name = dbs[tableName][0]['db_name'];
            query_request(cluster_name, db_name, sqlContent, sql, tableName)
        }
    }
}

// Execute the query and format the query results
function query_request(cluster_name, db_name, sqlContent, sql, tableName) {
    $('.modal-backdrop').remove();
    $("#loadingModal").modal('show');
     console.log(sqlContent)
     sqlContent.match(/\s+limit\s+(\w+)/g);
     var limit = RegExp.$1
     console.log('limiit'+limit)
     console.log('isNaN'+ isNaN(limit))
     if (isNaN(limit) || limit == '') {
       limit = 1000;
     }
     console.log('limiit'+limit)
    $.ajax({
        type: "post",
        url: "/query/",
        dataType: "json",
        data: {
            instance_name: cluster_name,
            db_name: db_name,
            tb_name: tableName,
            sql_content: sqlContent,
            limit_num: limit

        },
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        complete: function () {
           $("#loadingModal").modal('hide');
           $('.modal-backdrop').remove();
        },
        success: function (data) {
            $("#loadingModal").modal('hide');
            $('.modal-backdrop').remove();
            console.log('查询响应:' + data);
            if (data.status === 0 || data.status === 2) {
                // If the current TAB page is not in the execution result page, a new page is added by default
                var active_li_id = sessionStorage.getItem('active_li_id');
                console.log('active_li_id' + active_li_id);

                if (active_li_id.match(/^execute_result_tab*/)) {
                    // Viewing the table structure opens a new window by default
                    if (sql === 'show create table') {
                        tab_add();
                        n = sessionStorage.getItem('tab_num');
                    } else {
                        var n = active_li_id.split("execute_result_tab")[1];
                        console.log('nnnnnnnnnnnnn' + n);
                    }
                } else {
                    tab_add();
                    n = sessionStorage.getItem('tab_num');
                }

                var result = data.data;
                /*if (tableName == 'etc_issuer_aftersales' && result['column_list'] != null && result['column_list'] != '' && result['column_list'] != undefined) {
                    result['column_list'].push('retry_push');
                }


                if (tableName == 'etc_issuer_aftersales' && result['rows'] != null && result['rows'] != '' && result['rows'] != undefined) {
                     $.each(result['rows'], function (i, column) {
                        column.push('1');
                     });
                }

                if (tableName == 'etc_issuer_notify' && result['rows'] != null && result['rows'] != '' && result['rows'] != undefined) {
                     $.each(result['rows'], function (i, column) {
                         $.each(column, function (j, c) {
                             if (j == 9) {
                                 column[j] = c.replace("\"business_sn\"", "\"order_sn\"") ;
                             }
                         });
                     });
                }*/
                $("#" + ('execute_result_tab' + n)).find('a').text('查询表：' + tableName);
                $("#" + ('execute_result_tab' + n)).attr('ondblclick', 'tab_remove()');


                // Description Failed to query an error
                if (result['Error']) {
                    alertStyle = "alert-danger";
                    $("#" + ('query_result' + n)).bootstrapTable('destroy').bootstrapTable({
                        columns: [{
                            field: 'error',
                            title: 'Error'
                }],
                        data: [{
                            error: 'mysql返回异常：' + result['Error']
                }]
                    })
                }
                // Inception detected an error
                else if (data.status === 2) {
                    var errer_info = data.msg;
                    //替换所有的换行符
                    errer_info = errer_info.replace(/\r\n/g, "<br>");
                    errer_info = errer_info.replace(/\n/g, "<br>");
                    //替换所有的空格
                    errer_info = errer_info.replace(/\s/g, " ");
                    alertStyle = "alert-danger";
                    $("#" + ('query_result' + n)).bootstrapTable('destroy').bootstrapTable({
                        columns: [{
                            field: 'error',
                            title: 'Error',
                            formatter: function (value, row, index) {
                            //staus为2的时候，增加申请链接
                            if (data.status === 2) {
                                return value + "<a href=\"/queryapplylist/\">" + "（提交申请）" + "</a>"
                            } else {
                                return value
                            }
                        }
                }],
                        data: [{
                            error: errer_info
                }]
                    })
                } else if (result['column_list']) {
                    console.log('Prompt for auto completion' +result['column_list']);
                    columns.push({
                          title: '全选',
                          field: '',
                          visible: false,
                     });
                    var tableColumns = [];
                    // Asynchronously gets the column to be dynamically generated
                    $.each(result['column_list'], function (i, column) {
                        columns.push({
                            "field": i,
                            "title": column,
                            "sortable": true,
                            "filterControl": "select",
                            "formatter": function (value, row, index) {
                                return $('<div/>').text(value).html();
                            }
                        });

                        tableColumns.push({
                            name: column,
                            value: column,
                            caption: column,
                            meta: $("#table_name").val(),
                            score: '100'
                        });
                    });
                    console.log('tableConlumns' + tableColumns);
                    //Prompt for auto completion
                    setCompleteData(tableColumns);
                   if (result['full_sql'].match(/^show\s+create\s+table/)) {
                        // Initialize table structure display
                        $("#" + ("query_result" + n)).bootstrapTable('destroy').bootstrapTable({
                            data: result['rows'],
                            columns: [{
                                    title: 'Create Table',
                                    field: 1,
                                    formatter: function (value, row, index) {
                                        let sql = window.sqlFormatter.format(value);
                                        //替换标签
                                        sql = sql.replace(/&/g, "&amp;");
                                        sql = sql.replace(/</g, "&lt;");
                                        sql = sql.replace(/>/g, "&gt;");
                                        sql = sql.replace(/"/g, "&quot;");
                                        //替换所有的换行符
                                        sql = sql.replace(/\r\n/g, "<br>");
                                        sql = sql.replace(/\n/g, "<br>");
                                        //替换所有的空格
                                        return sql;

                                    }
                      }
                      ],
                            locale: 'zh-CN'
                        });
                    } else {
                        var isdetail = false
                        var optgroup = cluster_name.substring(0,2)
                        if (optgroup === 'Mo' || optgroup === 'Re') {
                            isdetail = true
                        }
                        console.log('query-result' + n);
                        console.log('query-optgroup' +optgroup);
                        console.log('query-resul###t' + "#" + ('query_result' + n));

                        // Initialize the query result
                        $("#" + ('query_result' + n)).bootstrapTable('destroy').bootstrapTable({
                            data: result['rows'],
                            columns: columns,
                            fixedColumns: true,
                            fixedNumber: 1, // 固定列数
                            showExport: true,
                            exportDataType: "all",
                            exportTypes: ['json', 'sql', 'excel'],
                            exportOptions: {
                                htmlContent:true,
                                fileName: tableName + new Date().getTime(), //文件名称设置
                                onMsoNumberFormat: function (cell, row, col) {
                                    return '\\@';
                                }
                            },
                            filterControl: 'select',
                            undefinedText: '(null)',
                            detailView: isdetail, //开启显示行首"+"
                            showColumns: true,
                            showColumns: true,
                            search: true,
                            height: 0.1,
                            showToggle: true,
                            showCopyRows: true,
                            clickToSelect: true,
                            striped: true,
                            pagination: true,
                            pageSize: 1000,
                            pageList: [30, 50, 100, 500, 1000],
                            search: true,//是否显示表格搜索
                            strictSearch: false,//是否全匹配搜索
                            detailFormatter: function (index, row) {
                                var html = [];
                                $.each(row, function (key, value) {
                                    if (key === 0) {//mongodb这里要修改
                                        let rs = value;
                                        if (optgroup === 'Re') {
                                            try {
                                                rs = JSON.parse(rs);
                                                if (typeof rs == 'object' && rs) {
                                                    rs = JSON.stringify(rs, null, 2)
                                                }
                                            } catch (e) {
                                                html.push('<strong>' + "非json格式，无法格式化！" + '</strong>');
                                                return false;
                                            }
                                        }
                                        html.push('<pre>' + highLight(rs) + '</pre>');
                                    }
                                });
                                return html.join('');
                            },
                            onPostBody: function(data) {
                                $("#" + ('sqlquery_result' + n)).find('.bootstrap3').find('.fixed-table-container').attr('style','');
                            },
                            onDblClickCell: function(field, value, row, e) {
                                var sign='2fa364948993a'+passWord+'ff9e1c3df358423bad1';
                                if (field === 7 && tableName == 'saleafter_revoke_order' && value.indexOf('ZX') != -1) {
                                    executeReviewPass(value, sign)
                                }

                                if (field === 8 && tableName == 'saleafter_revoke_order' && value.indexOf('ZX') != -1) {
                                    executeFinish(value, sign)
                                }

                                if (field === 9 && tableName == 'saleafter_revoke_order') {
                                    executeRetry(value, sign, jwt)
                                }
                            },
                            locale: 'zh-CN'
                        });
                    }
                    // Execution time and desensitization time assignment
                    $("#" + ('time') + n).text(result['query_time'] + ' sec');
                    $("#" + ('masking_time') + n).text(result['mask_time'] + ' sec');
                    $("#" + ('sqlquery_result' + n)).find('.fixed-table-body').css('height', '280px');
                    $("#" + ('sqlquery_result' + n)).find('.bootstrap3').find('.fixed-table-container').attr('style','');
                    $("#" + ('sqlquery_result' + n)).find('.bootstrap3').on("change", function(){
                        $("#" + ('sqlquery_result' + n)).find('.bootstrap3').find('.fixed-table-container').attr('style','');
                    })
                    var checkOne = $(".fixed-table-toolbar .keep-open .dropdown-menu li input");
                    var checkAll = checkOne.eq(9);
                    checkAll.prop("checked", true)
                    checkAll.off('click').on('click', function () {
                        var flag = checkAll.prop("checked");
                        checkOne.each(function(i){
                            if (i>7){
                                var $this = $(this);
                                if (flag) {
                                    if (!$this.prop('checked')) {
                                        $this.click();
                                    }
                                } else {
                                    if ($this.prop('checked')) {
                                        $this.click();
                                    }
                                }
                            }
                        });
                    });
                    checkOne.on('click', function () {
                        var len = checkOne.length;
                        var _l = 7;
                        checkOne.each(function(i){
                            if (i>7){
                                if ($(this).prop('checked')) {
                                    _l++;
                                }
                            }
                        });
                        if (_l === len-1){
                            checkAll.prop("checked", true)
                        } else {
                            checkAll.prop("checked", false)
                        }
                    });
                }
            } else {
                $("#loadingModal").modal('hide');
                $('.modal-backdrop').remove();
                alert("status: " + data.status + "\nmsg: " + data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $("#loadingModal").modal('hide');
            if (errorThrown == 'Internal Server Error' || errorThrown == 'INTERNAL SERVER ERROR') {
                alert('查询错误：请确认是否已经选择需要查询的SQL语句或SQL语句语法是否正确!')
            } else {
                console.log(retry);
                if (retry) {
                    $.ajax({
                        type: "post",
                        url: "/authenticate/",
                        dataType: "json",
                        data: {
                            username: userName,
                            password: passWord
                        },
                        headers: {
                           "X-CSRFToken": getCookie("csrftoken")
                        },
                        complete: function () {
                            $("#loadingModal").modal('hide');
                            $('.modal-backdrop').remove();
                            $('#btnLogin').removeClass('disabled');
                            $('#btnLogin').prop('disabled', false);
                        },
                        success: function (data) {
                            if (data.status === 0) {
                               if (data.data) {
                                   document.cookie = "sessionid=" + data.data
                                }
                                $("#loadingModal").modal('hide');
                                $('.modal-backdrop').remove();
                                retry = false;
                                console.log('login');
                                console.log(data);
                                query();
                            } else {
                                alert(data.msg);
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                             $("#loadingModal").modal('hide');
                             $('.modal-backdrop').remove();
                             console.dir('loginError' + errorThrown);
                             alert('登录失效, 已经重新登录，即将刷新当前页面');
                             $(location).attr('href', '/sqlquery/');
                        }
                    });
                }
            }
            console.log('query error');
            console.log(retry);
            console.dir(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    })
}
