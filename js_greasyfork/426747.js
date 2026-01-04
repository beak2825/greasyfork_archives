// ==UserScript==
// @name         自动审核
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自动审核网易经销商文章
// @author       9268peng
// @match        *://local.auto.163.com/*
// @icon         https://www.google.com/s2/favicons?domain=163.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/426747/%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%A0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/426747/%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%A0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // policy:
    //        1---每次允许指定数量个，
    //        2---白名单模式，允许指定商家指定次数
    //        3---混合模式，白名单模式下允许其他的
    var whitetable=Table();
    var dialogIns = 1;
    function get_artical(cityid){
        if (typeof cityid == 'undefined') {
            cityid="131000";
        }
        let tasks=[]
        let dealers=[]
        if (getConfig().policy==1){
            dealers=[[""]]
        }else{
            dealers=GM_getObject("whitlist")
        }
        let dealer=[]
        for (let d=0;d<dealers.length;d++){
            dealer.push(dealers[d][0])
            let dealer_id=dealers[d][0]
            tasks.push(
                fetch("http://local.auto.163.com/local/composite/getArticleList.json?login_city_id="+cityid+"&page=1&page_size=20&submit_type=3&city_id="+cityid+"&title=&dealer_id="+dealer_id+"&doc_kind=&doc_type=&brand_id=&chexi_id=&is_photoset=&start_time=&end_time=&verify_status=0&tuijian_status=&g3_status=&creator=&dealer_name=&_="+new Date().getTime(), {
                    "body": null,
                    "method": "GET",
                }).then(function(response) {
                    return response.json();
                })
            )
        }

        console.log(dealer)
        //后处理函数
        Promise.all(tasks).then((values) => {
            console.log(values);
            let toapprove=[];
            let wtoapprove=[];
            dealers=GM_getObject("whitlist")
            for (let d=0;d<dealers.length;d++){
                dealers[d][1]=parseInt(dealers[d][1]);
            }
            for (let item in values){
                let json=values[item]
                for (let num in json.result){
                    let item = json.result[num]
                    if (item.verify_status == '0'  && item.del=="n"){
                        toapprove.push(item)
                        //检查是否在白名单里的限制数量
                        let dealerid=item.dealer_id
                        for (let d=0;d<dealers.length;d++){
                            if (dealerid==dealers[d][0]){
                                if (dealers[d][1]>0){
                                    wtoapprove.push(item)
                                    dealers[d][1]-=1
                                }else{
                                    console.log("一个id因配额已满而无法执行本次审批："+dealers[d][0])
                                }
                            }
                        }
                    }
                }
            }

            let config=getConfig();
            if (config.policy==1){//简单的允许固定数量的
                approve(cityid,toapprove.slice(0,config.max_allow))
            }else if (config.policy==2){//只允许白名单
                approve(cityid,wtoapprove.slice(0,config.max_allow))
            }else if (config.policy==3){
                alert("这个应该不需要做了吧 😅 。。需要用的话给我说😥")
            }
        });
    }

    function checkTime(){
        let config=getConfig();
        let now = Date.now();
        return (now%config.reqInterval==0)
        //switch (config.reqInterval){
        //    case 3600:
        //        return
        //}
    }
    function approve(cityid,toapprove){
        console.log(toapprove)
        for (let num in toapprove){
            let item=toapprove[num];
            var dataParams = new URLSearchParams()
            dataParams.set('verify_status',1)
            dataParams.set('doc_id',item.doc_id)
            dataParams.set('login_city_id',cityid*1)
            fetch("//local.auto.163.com/local/composite/updateVerifyStatus.json", {
                "method": "POST",
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "x-requested-with": "XMLHttpRequest"
                },
                "body": dataParams
            }).then(function(response) {
                return response.json();
            }).then(function(json) {
                mdui.snackbar({message:item.doc_id + json.statusDesc});
                console.log(json)
            });
        }
    }
    function getConfig(){
        let config={
            policy:GM_getValue("policy",3),
            req_interval:GM_getValue("reqInterval",3600),
            max_allow:GM_getValue("maxAllow",20),
            white:GM_getObject("whitlist",[])
        }
        return config
    }
    function getMenuConfig(){
        let config={
            policy:$("input[name='group1']:checked").val(),
            req_interval:$("#reqinterval").val(),
            max_allow:$("input[type=range]").val(),
            white:whitetable.getValues("whitlisttable")
        }
        console.log(config)
        return config
    }
    function setMenuConfig(config){
        $('input[name="group1"][value="'+config.policy+'"]').prop('checked', true);
        $("#reqinterval").val(config.req_interval);
        $("input[type=range]").val(config.max_allow);mdui.updateSliders();
        $("#whitlisttable").empty();

        whitetable.init({
            id:'whitlisttable',
            header:['id','次数'],
            data:config.white,
            delBtn:true,
            delCallBack:delWhiteList
        });
        dialogIns.handleUpdate()
    }
    function delWhiteList (data){
        console.log(data)
        let target=data.currentTarget.name;
        let conf=getConfig();
        for (let d in conf.white){
            if (conf.white[d][0]==target){
                conf.white.splice(d,1);
                setConfig(conf)
                setMenuConfig(conf)
                break
            }
        }
    }
    function setConfig(config){
        GM_setValue("policy",config.policy)
        GM_setValue("reqInterval",config.req_interval)
        GM_setValue("maxAllow",config.max_allow)
        GM_setObject("whitlist",config.white)
    }

    const ijf_menu = {
        selecter: "body",
        html:`
<div class="mdui-dialog mdui-container" id="menudiolog">
    <div class="mdui-row">
        <div class="mdui-col-xs-3">
            <label class="mdui-switch">
                模式选择：
                <button class="mdui-btn mdui-btn-icon"
                    mdui-tooltip="{content: '模式1---每次允许指定数量个<br>模式2---白名单模式，只允许指定商家指定次数<br>3---混合模式，优先允许白名单，会允许其他文章'}">
                    <i class="mdui-icon material-icons">error_outline</i>
                </button>
            </label>
        </div>
        <div class="mdui-col-xs-6">
            <form>
                <label class="mdui-radio">
                    <input type="radio" name="group1" value='1'/>
                    <i class="mdui-radio-icon"></i>
                    模式一<br>
                </label>
                <label class="mdui-radio">
                    <input type="radio" name="group1" value='2'/>
                    <i class="mdui-radio-icon"></i>
                    模式二<br>
                </label>
                <label class="mdui-radio">
                    <input type="radio" name="group1" value='3'/>
                    <i class="mdui-radio-icon"></i>
                    模式三
                </label>
            </form>
        </div>
    </div>
    <div class="mdui-row">
        <div class="mdui-col-xs-2">
            请求间隔：
        </div>
        <div class="mdui-col-xs-4">
            <select class="mdui-select" id='reqinterval'>
                <option value="60">60s</option>
                <option value="900">15min</option>
                <option value="1800">30min</option>
                <option value="3600">1h</option>
                <option value="7200">2h</option>
            </select>
        </div>
        <div class="mdui-col-xs-2">
            <label>
                是否取整(还没做)：
                <button class="mdui-btn mdui-btn-icon"
                    mdui-tooltip="{content: '是否等待到整点（或一个整除点）才开始第一次执行<br>如15min间隔会在15,30,45,00运行'}">
                    <i class="mdui-icon material-icons">error_outline</i>
                </button>
            </label>
        </div>
        <div class="mdui-col-xs-4">
            <label class="mdui-switch">
                <input type="checkbox" />
                <i class="mdui-switch-icon"></i>
            </label>
        </div>
    </div>
    <div class="mdui-row">
        <div class="mdui-col-xs-2">
            单次最大审核条数：
        </div>
        <div class="mdui-col-xs-8">
            <label class="mdui-slider mdui-slider-discrete">
                <input type="range" step="1" min="1" max="20" />
            </label>
        </div>
    </div>
    <div>
        <label class="mdui-switch">
            白名单控制：
        </label>
        <div class="mdui-table-fluid" id="whitlisttable">
        </div>
        <div class="mdui-textfield mdui-container mdui-row">
            <div class="mdui-col-xs-7">
                <input class="mdui-textfield-input" rows="5" type="text" placeholder="id" id="whiteid"/>
            </div>
            <div class="mdui-col-xs-4">
                <input class="mdui-textfield-input" rows="5" type="text" placeholder="次数" id="whitetimes"/>
            </div>
            <div class="mdui-col-xs-1">
                <button class="mdui-btn mdui-color-theme-accent mdui-ripple mdui-btn-icon" id="add_whitelist"><i class="mdui-icon material-icons">add</i></button>
            </div>
        </div>
        </ul>
    </div>
    <div class="mdui-dialog-actions">
        <button class="mdui-btn mdui-ripple" mdui-dialog-close>取消</button>
        <button class="mdui-btn mdui-ripple" mdui-dialog-confirm>保存</button>
    </div>
</div>
        `,events: [{
            selecter: "#menudiolog",
            event: "confirm.mdui.dialog",
            func: function () {
                console.log(getMenuConfig())
                setConfig(getMenuConfig())
            }
        },{
            selecter: "#menudiolog",
            event: "opened.mdui.dialog",
            func: function () {
                console.log(getConfig())
                setMenuConfig(getConfig())
            }
        },{
            selecter: "#add_whitelist",
            event: "click",
            func: function () {
                let wid=$("#whiteid").val()
                let wtimes=$("#whitetimes").val()
                $("#whiteid").val("")
                $("#whitetimes").val("")
                let config=getConfig()
                config.white.push([wid,wtimes])
                setConfig(config)
                whitetable.addRow("whitlisttable",[wid,wtimes])
                //mdui.updateTables()
                setMenuConfig(config)
            }
        }]
    }


    // 定义右下悬浮按钮
    const ijf_sidebar = {
        selecter: "body",
        html: `
        <div class="mdui-container" style="">
            <button class="mdui-fab mdui-fab-fixed" id="ij_bar_btn1" style="bottom: 130px;">
                <i class="mdui-icon material-icons">check</i>
            </button>
            <button class="mdui-fab mdui-fab-fixed" id="ij_bar_btn2" style="bottom: 60px;">
                <i class="mdui-icon material-icons">loop</i>
            </button>
        </div>`,
        events: [{
            selecter: "#ij_bar_btn2",
            event: "click",
            func: function () {
                get_artical()
                if (window.cron==undefined){
                    let c=getConfig()
                    window.cron=setInterval(get_artical, c.req_interval*1000)
                    mdui.snackbar({  message:"已启动定时任务"});
                }else{
                    clearInterval(window.cron)
                    mdui.snackbar({  message:"已停止定时任务"});
                    window.cron=undefined
                }
            }
        },{
            selecter: "#ij_bar_btn1",
            event: "click",
            func: function (){
                if (dialogIns==1){
                    dialogIns = new mdui.Dialog("#menudiolog", {});
                }
                dialogIns.toggle()
                console.log(getConfig())
                setMenuConfig(getConfig())
                // get_artical("131000","55543")
            }
        }]
    }

    function init() {
        //在这里给页面添加些之后会用到的库,如css/js之类的
        //给页面添加一个md-kit,方便加东西
        // var jssvue = document.createElement("script");
        // jssvue.async = false;
        // jssvue.src = "//cdn.bootcss.com/vue/2.6.10/vue.min.js";
        // document.getElementsByTagName('head')[0].appendChild(jssvue);
        // injectHtml(ijf_public_js);
        let style = document.createElement("link");
        style.rel = "stylesheet";
        style.href = "//cdn.bootcss.com/mdui/1.0.1/css/mdui.min.css";
        document.getElementsByTagName('head')[0].appendChild(style);

        let jss = document.createElement("script");
        jss.src = "//cdn.bootcss.com/mdui/1.0.1/js/mdui.min.js";
        document.getElementsByTagName('head')[0].appendChild(jss);

        // 初始化保存和获取设置的方法
        unsafeWindow.window.GM_setObject = function (name, value) {
            if (value instanceof Object) {
                // 使用 JSON.stringify 将值转换为文本。
                GM_setValue(name, JSON.stringify(value));
            }
        }
        unsafeWindow.window.GM_getObject = function (name, defaults) {
            try {
                return JSON.parse(GM_getValue(name, ''));
            } catch (e) {
                // 如果抓取的数据有误报错就直接返回默认值。
                return defaults;
            }
        };
        unsafeWindow.window.GM_getValue = GM_getValue;
        unsafeWindow.window.GM_setValue = GM_setValue;

    }
    //在页面添加右下角悬浮的设置和运行状态
    function injectHtml(ijf) {
        $(ijf.selecter).append(ijf.html);
        for (let e in ijf.events) {
            let event = ijf.events[e];
            console.log(event);
            $(event.selecter).on(event.event, event.func);
        }
    }

    init();
    injectHtml(ijf_sidebar);
    injectHtml(ijf_menu);
    //table.js
    function Table() {
        var TClass = {};
        var Tool = {};
        var DataStore = {};
        var Option = {};
        Tool.createHeader = function(htmls, data, option) {
            htmls.push('<tr>');
            for (var i in data) {
                htmls.push('<th>' + data[i] + '</th>');
            }
            if (option['delBtn'] != null) {
                htmls.push('<th>删除</th>');
            }
            htmls.push('</tr>');
        };
        Tool.createRow = function(htmls, data,option) {
            htmls.push('<tr>');
            for (var i in data) {
                htmls.push('<td>' + data[i] + '</td>');
            }
            if (option['delBtn'] != null) {
                htmls.push('<td><button class="mdui-btn mdui-color-theme-accent mdui-ripple mdui-btn-icon delBtn" name="'+data[0]+'"><i class="mdui-icon material-icons">delete</i></button></td>');
            }
            htmls.push('</tr>');
        };
        Tool.render = function(id, tag) {
            var htmls = [];
            var option = Option[id];
            if (option['title'] != null) {
                htmls.push('<div class="title">' + option['title'] + '</div>');
            }
            htmls.push('<table class="mdui-table mdui-table-hoverable">');
            Tool.createHeader(htmls, DataStore[id]['header'],option);
            for (var i in DataStore[id]['data']) {
                Tool.createRow(htmls, DataStore[id]['data'][i], option);
            }
            htmls.push('</table>');
            tag.empty().append(htmls.join(''));
            if (option['delBtn']){
                $(".delBtn").on("click",option['delCallBack'])
            }
            Tool.setStyle(id, tag);
        };
        Tool.setStyle = function(id, tag) {
            return
        };
        Tool.getValue = function(value, defalutValue) {
            if (typeof value == 'undefined') {
                return defalutValue;
            } else {
                return value;
            }
        };
        TClass.init = function(option) {
            var id = option['id'];
            var tag = $('#' + id);
            var header = option['header'];
            var data = option['data'];
            DataStore[id] = {
                header: header,
                data: data
            };
            Option[id] = {
                title: Tool.getValue(option['title'], null),
                titleColor: Tool.getValue(option['titleColor'], 'black'),
                titleSize: Tool.getValue(option['titleSize'], 16),
                headerColor: Tool.getValue(option['headerColor'], 'black'),
                headerBgColor: Tool.getValue(option['headerBgColor'], '#A2FD9A'),
                headerSize: Tool.getValue(option['headerSize'], 16),
                color: Tool.getValue(option['color'], 'black'),
                size: Tool.getValue(option['size'], 16),
                align: Tool.getValue(option['align'], 'center'),
                evenBgColor: Tool.getValue(option['evenBgColor'], '#E3F4FD'),
                oddBgColor: Tool.getValue(option['oddBgColor'], '#FDF0E6'),
                rowHeight: Tool.getValue(option['rowHeight'], 34),
                columnWidth: Tool.getValue(option['columnWidth'], null),
                delBtn: Tool.getValue(option['delBtn'], false),
                delCallBack: Tool.getValue(option['delCallBack'], function(){}),
            };
            Tool.render(id, tag);
        };
        TClass.getValue = function(id, row, column) {
            return DataStore[id]['data'][row - 1][column - 1];
        };
        TClass.setValue = function(id, row, column, value) {
            DataStore[id]['data'][row - 1][column - 1] = value;
        };
        TClass.getValues = function(id) {
            return DataStore[id]['data'];
        };
        TClass.addRow = function(id, data) {
            DataStore[id]['data'].push(data);
        };
        TClass.deleteRow = function(id, row) {
            DataStore[id]['data'].splice(row - 1, 1);
        };
        TClass.getRowCount = function(id) {
            return DataStore[id]['data'].length;
        };
        TClass.render = function(id) {
            Tool.render(id, $('#' + id));
        };
        return TClass;
    }
})();