// ==UserScript==
// @name        dbman_helpr_plus
// @namespace    https://greasyfork.org/zh-CN/scripts/392734-dbman-helpr
// @version      1.9.1
// @description  dbman helpr
// @author       xiangdongg
// @include *dbman.int.*
// @include *hiveweb.int.*
// @include *dbman.*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/392734/dbman_helpr_plus.user.js
// @updateURL https://update.greasyfork.org/scripts/392734/dbman_helpr_plus.meta.js
// ==/UserScript==

window._dbman = {
    //存储的key
    storageKey:'history',
    // sharding config
    shardingMap: [
        {
            instance_name: "prod-jiedian_user",
            instance_count: 1,
            db_name: "jduser_shard_",
            table_names: ["user_vip_state", "user_property", "user_exp_record", "user_level_prize_record", "user_save_item", "user_weapp_form_ids"],
            table_count: 512,
            shard_uid_count: 3,
            desc: "用户"
        },
        {
            instance_name: "prod-activity_coupon",
            instance_count: 1,
            db_name: "coupon_shard_",
            table_names: ["coupon", "coupon_order", "coupon_order_refund", "coupon_consume_log", "renew_config", "user_rights_log"],
            table_count: 1024,
            shard_uid_count: 4,
            desc: "卡券"
        },
        {
            instance_name: "prod-activity_coupon",
            instance_count: 1,
            db_name: "activity_shard_",
            table_names: ["activity_user_prizes", "score_change_log", "sem_record", "user_guessing_log", "user_score"],
            table_count: 512,
            shard_uid_count: 3,
            desc: "活动"
        },
        {
            instance_name: "prod-jdorder_sharding",
            instance_count: 4,
            db_name: "orders_shard_",
            table_names: ["orders", "order_product", "order_origin", "order_analyse", "zhima_order", "order_pay", "order_pending"],
            table_count: 1024,
            shard_uid_count: 4,
            desc: "订单"
        },
        {
            instance_name: "prod-jdpay_sharding",
            instance_count: 4,
            db_name: "jdpay_shard_",
            table_names: ["receive_order", "refund_order", "consume_order", "pre_auth", "charge_order", "bill_refund", "bill_recharge", "bill_consume", "account_flow"],
            table_count: 512,
            shard_uid_count: 4,
            desc: "支付"
        },
    ],

    select:function(dbName,tableName)
    {
        var dbNodes = $(`.sumo_db_instance li.opt label`);
        for (let i = 0; i <= dbNodes.length; i++) {
            if (dbNodes.eq(i).text() == dbName) {
                dbNodes.eq(i).click();
                break
            }
        }
        var selectDb = function() {
            let nodes = $(`.sumo_db_name li.opt label:contains('${tableName}')`)
            let node = null
            for (let i = 0; i <= nodes.length; i++) {
                if (nodes.eq(i).text() == tableName) {
                    node = nodes.eq(i)
                    break
                }
            }
            if (node) {
                node.click()
            }
        }
        setTimeout(selectDb,500);
        setTimeout(selectDb,1000);
    },
    blurShardUid: function(e) {
        if (e.keyCode == 13) {
            var el = $('#shardUid');
            var uid = el.val().trim();
            if (uid) {
                this.calcSharding();
            }
            el.blur();
        }
    },
    calcSharding: function()
    {
        var uid = $("#shardUid").val().trim();
        if (!uid || isNaN(uid)) {
            alert("请输入正确的 uid");
            return false;
        }
        var shardingArea = $("#sharding_area");
        if (shardingArea.length == 0) {
            $("#codeRun").append('<div id="sharding_area" data-hide="1" style="border:1px solid #ccc;padding:10px;border-radius:20px;margin-top:10px;margin-bottom:10px"></div>');
            shardingArea = $("#sharding_area");
        }
        var shardingResult = '';
        $.each(this.shardingMap, function(index, item){
            var lastUid = 0;
            if (item.shard_uid_count == 3 || item.shard_uid_count == 4) {
                lastUid = uid < Math.pow(10, item.shard_uid_count) ? uid : parseInt(uid.slice(-item.shard_uid_count));
            } else {
                alert("暂不支持该分表数: " + item.table_count + " - " + item.shard_uid_count);
                return false;
            }
            var tableNum = lastUid % item.table_count;
            var instanceNum = item.instance_count > 1 ? Math.ceil(tableNum / (item.table_count / item.instance_count)) : 0;
            var dbNum = parseInt(tableNum / 8);
            console.log("tableNum: " + tableNum + " dbNum: " + dbNum + " lastUid: " + lastUid);
            var tmp = item.db_name + dbNum + '.';
            shardingResult += '<ul style="margin-left:0;"><p><span style="color:#fff;background-color:#409eff;padding:4px 8px;border-radius:4px;font-size:12px;">' + item.desc + '</span> - '
                + item.instance_name + " [" + item.table_count + "] - DB [<span style='color:#409eff'>" + dbNum + "</span>] - TABLE [<span style='color:#ff40e6'>" + tableNum + "</span>]</p>";
            $.each(item.table_names, function (i, it) {
                shardingResult += '<li style="display:inline-block;"><button type="button" onclick="window._dbman.select_shard(\''
                    + item.instance_name + '\', \'' + instanceNum + '\', \'' + item.db_name + dbNum + '\', \'' + it + '\', \'' + tableNum + '\', ' + uid + ')">' + it + '</button></li>';
            });
            shardingResult += '</ul>';
        });
        shardingArea.html(shardingResult);
        shardingArea.data('hide', 1).show();
    },
    select_shard:function(instanceName, instanceNum, dbName, tableName, tableNum, uid)
    {
        console.log(instanceName, instanceNum, dbName, tableName, tableNum, uid);
        if (instanceNum > 0) {
            instanceName += "_" + instanceNum;
        }
        this.select(instanceName, dbName);
        editor.setValue('select * from `' + dbName + '`.`' + tableName + '_' + tableNum + '` where uid = ' + uid + ' order by id desc;');
        this.toggleShardingArea();
        setTimeout(function() {
            $('#codeRun button:contains("执行")').click();
        }, 1000);
    },
    toggleShardingArea: function()
    {
        var shardingArea = $("#sharding_area");
        if (shardingArea.length > 0) {
            var hide = shardingArea.data('hide');
            var newHide = hide ? 0 : 1;
            if (hide) {
                shardingArea.data('hide', newHide).hide();
            } else {
                shardingArea.data('hide', newHide).show();
            }
        }
    },
    unixtime:function()
    {
        let sql = editor.getValue().replace(/select .* from/gi,function(a){ return a.replace(/((?<=[,\s])[\w\.]+_time)/g,function(a){console.log(a); return "from_unixtime("+a+"+28800)"})});
        editor.setValue(sql);
    },
    showDDL:function(){
        var sql = editor.getSelection();
        if (sql != '') {
            eval(`var pattern = /${sql}/gi;`)
            sql = editor.getValue().replace(pattern,`show create table ${sql}`);
            editor.setValue(sql);
        } else {
            editor.setValue('show create table ;' + editor.getValue());
        }
    },
    showSelect:function(){
        var sql = editor.getSelection();
        if (sql != '') {
            eval(`var pattern = /${sql}/gi;`)
            sql = editor.getValue().replace(pattern,`select * from ${sql} a`);
            editor.setValue(sql);
        } else {
            editor.setValue('select * from ' + editor.getValue() +' a ');
        }
    },
    //获取当前时间
    getNowFormatDate:function() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    },
    showHistory:function() {
        if (!localStorage.hasOwnProperty(this.storageKey)) {
            alert('当前没有历史');
            return;
        }
        var history = JSON.parse(localStorage.getItem('history'));
        var tabContent = '<tr><td>操作</td><td>实例</td><td>数据库</td><td>SQL语句</td><td>时间</td></tr>';
        history.forEach(function(v, k){
            let tr = `<tr onmouseenter='active(this)' onmouseleave='deactive(this)'><td><button class="btn" onclick="fa_copy(${k})">使用</button></td><td id="db_instance_${k}">${v.instance}</td><td id="db_name_${k}">${v.db}</td><td id="${k}">${v.sql}</td><td>${v.time}</td></tr>`
            tabContent = tabContent + tr;
        });
        $('#myHistory').html(`<table id="myHistory_tb" class="table table-bordered table-hover table-striped"><tbody>${tabContent}</tbody></table>`)
    },
    writeHistory:function(sql){
        //因点了执行显示的历史还在，所以写入前先重置下历史记录显示状态
        $('#myHistory').html('');
        $('#myHistory_li').removeClass('active')
        //开始写入
        var storageKey = this.storageKey;
        var dbName = $('#id_db_name').val();
        var history = localStorage.hasOwnProperty(storageKey) ? JSON.parse(localStorage.getItem(storageKey)) : new Array();
        if (history.length >= 300) {
            history.pop();
        }
        if(history.length >= 1) {
            if (history[0].sql == sql && history[0].db == dbName) {//和上一条相同，不用记录
                return;
            }
        }
        var item = {'time':_dbman.getNowFormatDate(), 'sql': sql, 'instance':$('#instance').val(),'db':dbName};
        history.unshift(item);
        localStorage.setItem('history', JSON.stringify(history));
    },
    selectDefault:function(){
        //默认选中那个库
        if (window.location.search.indexOf('db_name=') > 0) {
            return;
        }
        var defaultInstance = "prod-jiedian_crm";
        var defaultDB = "jiedian_crm";
        if(/zhiming/.test($('#banner').text())) {
           defaultInstance = "prod-jiedian_finance";
           defaultDB = "jd_fsp";
        } else if(/chaoshengt/.test($('#banner').text())) {
           defaultInstance = "prod-bi_jddw_hw";
           defaultDB = "data_cube_hw";
        } else if (/qiang.li/.test($('#banner').text())) {
           defaultInstance = "prod-jiedian_crm";
           defaultDB = "jiedian_contract";
        } else if (/xiangdongg/.test($('#banner').text())) {
            defaultInstance = "prod-jiedian_crm";
            defaultDB = "jiedian_crm";
        } else if (/jie.xu/.test($('#banner').text())) {
            defaultInstance = "prod-jiedian_user";
            defaultDB = "jiedian_user";
        }
        setTimeout(function(){
            window._dbman.select(defaultInstance,defaultDB);
            editor.setValue('select * from  order by id desc;');
            editor.setCursor(0, 14);
            console.log(editor.getCursor());
        },1000);
    },
    cacheTable:function(env,instance,db_name){
        let table = showTables(env,instance,db_name);
        let key = instance+db_name;
        localStorage.setItem(key, JSON.stringify(table));
        return table;
    },
    getCacheTable:function(env,instance,db_name){
        let key = instance+db_name;
        let table = JSON.parse(localStorage.getItem(key));
        if (!table) {
            table = window._dbman.cacheTable(env,instance,db_name);
        }
        return table;
    },
    setTableCache:function(env,instance,db_name, tableName, fields){
        let key = instance+db_name;
        let table = JSON.parse(localStorage.getItem(key));
        if (table) {
            table.tables[tableName]=fields;
            localStorage.setItem(key, JSON.stringify(table));
            compleTables(table,instance,db_name);
        }
    },
    getAllCacheTablesName:function(instance,db_name){
        let key = instance+db_name;
        let table = JSON.parse(localStorage.getItem(key));
        let names = [];
        for(let name in table.tables) {
            names.push(name)
        }
        return names;
    },
    clearCacheTable:function(){
        let instance = $("#instance").val();
        let db_name = $("#id_db_name").val();
        let key = instance+db_name;
        localStorage.removeItem(key);
    },
    flushNewTables:function(){
        //获取新增表，并缓存表结构
        let db_instance = $("#instance").val();
        let db_name = $("#id_db_name").val();
        let env = getEnv();
        let tables = window._dbman.getAllCacheTablesName(db_instance,db_name);
        if (tables.length == 0) {
            alert("获取缓存表名失败,添加新表失败");
            return
        }
        let sql = "SELECT table_name FROM information_schema.TABLES WHERE TABLE_TYPE = 'base table' and TABLE_SCHEMA = '"+db_name+"' and table_name not in ('"+tables.join("','")+"')";
        let tidbFlag = db_instance.match("tidb") != null;
        if (tidbFlag) {
            sql = "SHOW TABLES FROM " + db_name;
        }
        $.ajaxSetup({
            headers: { "X-CSRFToken": getCookie("csrftoken") }
        });
        $.ajax({
            url:"/query/",
            data:{
                db_instance:db_instance,
                db_name:db_name,
                query:sql,
                charset: 'utf8',
                env:env==1?'online':'rd',
                room: '',
                type: "exec"
            },
            type:'POST',
            error: function(){alert('ajax error')},
            success:function(data){
                if(data.msg == '查询成功!'){
                    for(let t in data.values){
                       if (tidbFlag) {
                           if(tables.indexOf(data.values[t][0]) != -1) {
                               continue;
                           }
                       }
                       window._dbman.cacheByTable(data.values[t][0]);
                    }
                }
            },
            dataType: 'JSON'
        });
    },
    cacheByTable:function (table) {
        let db_instance = $("#instance").val();
        let db_name = $("#id_db_name").val();
        let env = getEnv();
        $.ajaxSetup({
            headers: { "X-CSRFToken": getCookie("csrftoken") }
        });
        $.ajax({
            url:"/query/showcreatetable",
            data:{
                db_instance:db_instance,
                db_name:db_name,
                table:table,
                env:env,
            },
            type:'GET',
            error: function(){alert('ajax error')},
            success:function(data){
                if(data.msg == '查询成功!'){
                    window._dbman.setTableCache(env,db_instance,db_name, table, data.fields);
                }
            },
            dataType: 'JSON'
        });
    }
};

(function () {
    'use strict';
    if (window.location.host == 'sh-hiveweb.int.ankerjiedian.com') {
        $("#callboard").remove()
    } else {
        //默认是dbman.int.ankerjiedian.com
        //美化样式
        $('body').append(`
        <style>
        #favorite_tb td {overflow:hidden;text-overflow: ellipsis;max-width: 200px;white-space: nowrap}
        /* .bottom .tab-content table {position:absolute;left:10%;width:100%} */

        </style>`);

        //新建表绕过check检查
        if (window.location.pathname == "/newtable/add" || window.location.pathname == "/newtable/save") {
          $('#format').after("<button style='width: 350px;color: red;' type='button' class='btn apply-btn-submit' onclick='$(\"form\").submit();'>绕过Check申请(针对tidb语法不兼容使用)</button>");
        }
        //拦截事件-缓存表数据
        $("#id_db_name").unbind('change').change(function() {
            var instance = $("#instance").val();
            var db_name = $("#id_db_name").val();
            var env = getEnv();
            values = window._dbman.getCacheTable(env,instance,db_name);
            compleTables(values,instance,db_name);
            //添加更新表缓存事件
            $("#tables li a").click(function(){
                let table = $(this).text();
                window._dbman.cacheByTable(table);
            });
        });

        //鼠标中间运行
        editor.setOption("extraKeys", {
            RightClick: function(cm) {
                $('#codeRun button:contains("执行")').click()
            },
            "Esc": function(cm) {
                $('#codeRun button:contains("执行")').click()
            },
            "Ctrl-1": function(cm) {
                window._dbman.select('prod-jiedian_finance','jd_fsp')
            },
            "Ctrl-2": function(cm) {
                window._dbman.select('prod-jiedian_crm','jiedian_crm')
            },
            "Ctrl-3": function(cm) {
                window._dbman.select('prod-bi_jddw_hw','data_cube_hw')
            },
            "Ctrl-4": function(cm) {
                window._dbman.unixtime()
            },
            "Alt-1": function(cm) {
                window._dbman.select('prod-jiedian_crm_tidb','jiedian_fsp')
            },
        });
        $('#codeRun button[type="submit"]').click(function(){
            var sql = editor.getSelection();
            sql = sql == "" ? editor.getValue() : sql;
            if (sql == '') {
                return;
            }
            //记录历史记录
            _dbman.writeHistory(sql);
        });
        //如需要添加，请复制，并添加相应的实例名和库名
        var btnContainer = $('#codeRun');
        var changeDbContainer = btnContainer;
        if (changeDbContainer.length == 0) {
            changeDbContainer = $('#right .messages');
        }
        $('.right .top label').append('<br>选中快速执行:鼠标右键，或Esc键;   查看表DDL可更新表字段(<font color="green">缓存表变更</font>)')
        btnContainer.append('<button type="button" class="btn" onclick="window._dbman.unixtime()">添加时区</button>')
        btnContainer.append(`<button type="button" class="btn" onclick="window._dbman.showDDL()">show DDL</button>`)
        btnContainer.append(`<button type="button" class="btn" onclick="window._dbman.showSelect()" style="background:skyblue">SELECT</button>`)
        btnContainer.append(`<button type="button" class="btn" onclick="window._dbman.flushNewTables()">缓存新建表</button>`)
        // B 端相关数据库
        changeDbContainer.append(`<br/><span style="font-weight:700;color:#0059ff">B端常用库</span><button type="button" class="btn" onclick="window._dbman.select('prod-jiedian_crm','jiedian_crm')">crm</button>`)
        changeDbContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-jiedian_crm','jiedian_contract')">contract</button>`)
        changeDbContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-jiedian_crm','jiedian_assets')">assets</button>`)
        changeDbContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-jiedian_crm','jiedian_userlib')">userlib</button>`)
        changeDbContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-data_pub_sh','jiedian_userlib_pub')" style="width:150px">userlib-pub</button>`)
        // 结算相关数据库
        changeDbContainer.append(`<br/><span style="font-weight:700;color:#0059ff">结算常用库</span><button type="button" class="btn" onclick="window._dbman.select('prod-jiedian_finance','jd_fsp')">fsp</button>`)
        changeDbContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-jiedian_crm_tidb','jiedian_fsp')">tidb-fsp</button>`)
        // 大数据相关数据库
        changeDbContainer.append(`<br/><span style="font-weight:700;color:#0059ff">报表常用库</span>`)
        changeDbContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-bi_jddw_hw','data_cube_hw')" style="width:150px">data-cube-hw</button>`)
        changeDbContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-bi_jddw_rds','bi_data')" style="width:150px">bi_data</button>`)
        // C 端相关数据库
        btnContainer.append(`<br/><span style="font-weight:700;color:#0059ff">C端常用库 </span><button type="button" class="btn" onclick="window._dbman.select('prod-jiedian_user','jiedian_user')" style="width:60px">user</button>`);
        btnContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-jiedian_user_set1','jiedian_user_set1')" style="width:100px">user_set1</button>`);
        btnContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-jiedian_payment','jiedian_payment')" style="width:90px">payment</button>`);
        btnContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-jiedian_payment_set1','jiedian_payment_set1')" style="width:130px">payment_set1</button>`);
        btnContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-jiedian_user','jiedian_activity')" style="width:130px">jiedian_activity</button>`);
        btnContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-activity_coupon','jiedian_coupon')" style="width:130px">jiedian_coupon</button>`);
        btnContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-jiedian_manufactor','manufactor_data')" style="width:110px">manufactor</button>`);
        btnContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-jiedian_advertising','jiedian_advertising_draft')" style="width:110px">advertising</button>`);
        btnContainer.append(`<br/><span style="font-weight:700;color:#0059ff">C端汇总库 </span><button type="button" class="btn" onclick="window._dbman.select('prod-hw_pay_sumdb','payment_sumdb')" style="width:90px">payment</button>`);
        btnContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-hw_oders_sumdb','order_sumdb')" style="width:70px">orders</button>`);
        btnContainer.append(`<button type="button" class="btn" onclick="window._dbman.select('prod-hw_user_coupon_sumdb','user_coupon_sumdb')" style="width:120px">user-coupon</button>`);
        // C 端 Sharding
        btnContainer.append(`<br/><span style="font-weight:700;color:#0059ff">C端Sharding </span><input placeholder="输入 uid，回车计算 Sharding 表..." id="shardUid" onkeydown="window._dbman.blurShardUid(event)" style="width:220px" />
<button type="button" class="btn" onclick="window._dbman.calcSharding()" style="width:150px">计算Sharding</button>
<button type="button" class="btn" onclick="window._dbman.toggleShardingArea()" style="width:180px">显示/隐藏Sharding</button>`);

        $('body').append('<style>.CodeMirror-focused .CodeMirror-selected {background: #0088cc}</style>')
        $('#favorite').after(`<div class="tab-pane fade in" id="myHistory"></div>`)
        $('#ioniconsTab').append('<li id="myHistory_li"><a href="#myHistory" data-toggle="tab" onclick="return window._dbman.showHistory()"><div class="text-center"></div><span class="hidden-xs m-l-3">历史记录</span></a></li>')
        _dbman.selectDefault()
    }
})();

