// ==UserScript==
// @name         E10总部系统快速访问按钮
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  托管定时执行一些代码
// @author       You
// @match        https://www.e-cology.com.cn/*
// @exclude      https://www.e-cology.com.cn/sp/formreport/designer/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_log
// @license      123
// @downloadURL https://update.greasyfork.org/scripts/474128/E10%E6%80%BB%E9%83%A8%E7%B3%BB%E7%BB%9F%E5%BF%AB%E9%80%9F%E8%AE%BF%E9%97%AE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/474128/E10%E6%80%BB%E9%83%A8%E7%B3%BB%E7%BB%9F%E5%BF%AB%E9%80%9F%E8%AE%BF%E9%97%AE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // *** 变量声明

    var myOA = '{"text":['+
        '{"name":"账号信息","url":"https://www.e-cology.com.cn/cusapp/5408795894070927890/statlist?cusMenuId=2858800834441065558&urlPageTitle=5pys5ZGo6K6%2F6Zeu&searchId=879439754115014657"},'+
        '{"name":"客户","url":"https://www.e-cology.com.cn/crm/customer/4973922920472213726/customerList/all?cusMenuId=6917885170972286710&urlPageTitle=5a6i5oi35bqT"},'+
        '{"name":"知识文档（个人知识库）","url":"https://www.e-cology.com.cn/doc/knowledge/300/4973922920472213726?cusMenuId=5408506923342574384&urlPageTitle=5Liq5Lq655%20l6K%20G5bqT"},'+
        '{"name":"工作流程","url":"https://www.e-cology.com.cn/workflow/list/todo?cusMenuId=6917877349202431758&urlPageTitle=5b6F5Yqe5rWB56iL"},'+
        '{"name":"任务协作","url":"https://www.e-cology.com.cn/task/list/4973922920472213726/mine?cusMenuId=2858670749202261119&urlPageTitle=5oiR55qE5Lu75Yqh"},'+
        '{"name":"我的日报","url":"https://www.e-cology.com.cn/cusapp/2858838014012304428/statlist?cusMenuId=5408907242625089750&urlPageTitle=5pys5ZGo5pel5oql&searchId=883840639808765953"},'+
        '{"name":"E10模块负责人","url":"https://www.e-cology.com.cn/cusapp/6236919325045599128/statlist?cusMenuId=6236919325546599131&urlPageTitle=RTEw55u45YWz5qih5Z2X"},'+
        '{"name":"业务表单","url":"https://www.e-cology.com.cn/formreport/forms?cusMenuId=5115960268011766714&urlPageTitle=6KGo5Y2V5YiX6KGo"},'+
        '{"name":"演示中心","url":"https://demofactory.e-cology.com.cn/spa/demofactory/static/index.html#/main/demofactory/home?_key=4fe9ku"}'+
        ']}';

    //     原来的格式
    //      //-----------------  以下固定内容不可编辑 ------------------
    //         '{"name":"复制当前页","url":"www.eteams.cn"},'+
    //         '{"name":"其他","url":"www.eteas.cn"}'+
    //         ']}';

    var finalTitle = "";
    var isScriptRunning = "";
    var isMenuCreating = "no";
    var obj_json_parse = "";


    // *** ------------------------------------------------------------------------------------ 程序入口 ------------------------------------------------------------------------------------------------------------
    // ***
    // ***

    detectingPage();
    window.onload = function(){
        log("window onload!");
        var temp = getValue("tempTitle");
        if(temp != null){
            titleFexed(temp);
            deleteValue("tempTitle")
        }
    }


    function detectingPage(){
        //log("匹配页面中……");
        var detectingTimeout = setTimeout(detectingPage,1000);
        var theHref = window.location.href;

        if(document.getElementById("开启新页面") == null){
            if(isMenuCreating == "no"){ createMenu(); }//防止重复加载
        }

    }



    // *** ---------------------------------------------------------------------------------------- 开启新页面 -------------------------------------------------------------------------------------------------------------------
    // ***
    // ***

    //程序入口
    function createMenu(){
        isMenuCreating = "yes";
        log("循环找插入锚点（from开启新页面）");
        var b = setTimeout(createMenu,1000);
        if(document.querySelector(".e10header-search-container") != null ){
            //导航栏页面加载完成
            clearTimeout(b);
            log("取消计时");
            //序列化json字符串
            obj_json_parse = JSON.parse(myOA);
            headerCreate();
        }
    }

    //创建顶部按钮
    function headerCreate(){

        //创建顶部按钮，插入顶部按钮
        var ele = document.createElement("div");
        ele.id = "开启新页面";
        ele.innerText = "E-cology 10.0";
        ele.style.width="140px";//ele.offsetWidth+"px";
        ele.style.fontSize = "20px";ele.style.color = "white";ele.style.position = "relative";ele.style.top = "50%";ele.style.left = "20%";ele.style.transform="translate(-50%,-50%)";
        // document.querySelector(".e10header-search-container").append(ele);
        document.getElementsByClassName("e10header-menu")[0].append(ele);
        //创建对话框
        createDialogView();
        hideDialog();
        ele.onclick = function(){
            showDialog();//显示dialog对话框
        }
    }

    //   创建dialog对话框
    //
    //
    function createDialogView(){

        //创建dialog对话框
        var dialog = document.createElement("div");
        dialog.id = "dialog17699059661";

        //创建dialog对话框的全部内容
        var head = document.createElement("div");//顶部 head（请选择）
        head.style.cssText=" border-bottom: 1px solid gray; font-size: 24px; padding: 10px; background-color: rgb(255,249,249); ";
        head.innerText="请选择";
        dialog.append(head);
        createOptions(dialog);//创建dialog对话框的选项

        //把dialog加入屏幕正中央
        document.body.appendChild(dialog);
        dialog.style.cssText = "position: absolute; z-index: 9999; font-size: 28px; border-radius: 7px; background-color: rgb(255,255,255); overflow: auto; left: 50%; top: 50%; text-align: center; padding: 10px; ";
        dialog.style.width = "50%";
        dialog.style.marginTop = "-" + dialog.offsetHeight/2 +"px";
        dialog.style.marginLeft = "-" + dialog.offsetWidth/2 +"px";

        //添加底部遮罩
        var shed = document.createElement("div");
        shed.id = "shed17699059661";
        shed.style.cssText = "width: 100%; height: 100%; background-color: rgb(0, 0, 0); position: absolute; left: 0px; top: 0px; z-index: 2000; opacity: 0.4;";
        shed.onclick = hideDialog;
        document.body.appendChild(shed);
    }

    //    以obj_json_parse创建dialog对话框的选项
    //     arg:
    //     dialog---网页dialog元素
    function createOptions(dialog){

        for (var i in obj_json_parse.text) {

            var div = document.createElement("div");//创建一行（一个选项）
            div.style.borderBottom = "1px solid gray";

            var option = document.createElement("div");//创建这一行的选项值
            option.id = "option";
            option.innerText = obj_json_parse.text[i].name;
            option.style.float = "left";
            option.style.margin = "10px";
            option.setAttribute("name", obj_json_parse.text[i].name);
            option.setAttribute("url", obj_json_parse.text[i].url);
            option.onmouseover = function(){this.style.color = "red"};
            option.onmouseleave = function(){this.style.color = ""};
            div.append(option);
            option.onclick = function(){
                window.open(this.getAttribute("url"));
                setValue("tempTitle",this.innerText);
                hideDialog();
            }

            var image = document.createElement("div");//创建这一行的图标
            image.id = "image_fixCurrentPage";
            image.innerHTML = "<svg width='40px' height='40px' viewBox='0 0 1024 1024'><path d='M448 544H256a32 32 0 1 1 0-64h192v-160a32 32 0 1 1 64 0v384a32 32 0 0 1-64 0v-160z m320 96a32 32 0 0 1-32-32v-192a32 32 0 0 1 64 0v192a32 32 0 0 1-32 32z m0-32h-288a32 32 0 0 1-32-32v-128a32 32 0 0 1 32-32h288a32 32 0 0 1 32 32v128a32 32 0 0 1-32 32z m-256-64h224v-64h-224v64z'></path></svg>";
            image.style.float = "right";
            image.setAttribute("name", obj_json_parse.text[i].name);
            image.setAttribute("url", obj_json_parse.text[i].url);
            div.append(image);
            image.onclick = function () {
                titleFexed(this.getAttribute("name"));
                hideDialog();
            }
            var enmpty = document.createElement("div");
            enmpty.style.clear = "both";
            div.append(enmpty);

            dialog.appendChild(div);
        }
    }

    //    把dialog连同遮罩都做一个隐藏
    function hideDialog(){
        log("开始隐藏");
        if(document.getElementById("dialog17699059661").style.display == ""){
            document.getElementById("dialog17699059661").style.display = "none";
        }
        if(document.getElementById("shed17699059661").style.display == ""){
            document.getElementById("shed17699059661").style.display = "none";
        }
    }

    //    把dialog连同遮罩都做一个显示
    function showDialog(){
        log("开始显示");
        if(document.getElementById("dialog17699059661").style.display == "none"){
            document.getElementById("dialog17699059661").style.display = "";
        }
        if(document.getElementById("shed17699059661").style.display == "none"){
            document.getElementById("shed17699059661").style.display = "";
        }
    }

    function titleFexed(title){
        if(title == "请输入"){
            title = prompt("请输入");
        }

        //第一次运行titleFexed函数时，就给dom插入theTitle-state元素，并且设置为"正在运行"
        if(isScriptRunning != "正在运行"){
            isScriptRunning = "正在运行";

            // 选择将观察突变的节点
            var targetNode = document.getElementsByTagName("title")[0];

            var config = {childList: true,subtree:false,characterDataOldValue:false};

            // 当观察到突变时执行的回调函数
            var callback = function(mutationsList) {
                mutationsList.forEach(
                    function(item){
                        if (item.type == 'childList') {
                            if(finalTitle != document.title){
                                log('+++++++++++++++有节点发生改变');
                                document.title = title;
                                finalTitle = title;
                            }
                        }
                    });
            };

            // 创建一个链接到回调函数的观察者实例
            var observer = new MutationObserver(callback);

            // 开始观察已配置突变的目标节点
            observer.observe(targetNode, config);

            // 停止观察
            //observer.disconnect();
            document.title=title;
        }else{
            document.title=title;
            finalTitle = title;
        }
    }


    // *** ------------------------------------------------------------------------------------ 公共方法---------------------------------------------------------------------------------------------------------
    // ***
    // ***

    // *** 打印log的函数
    function log(msg){
        GM_log("tampermonkey  "+ msg);
        //         GM_log("tampermonkey  "+new Date().format1("yyyy-MM-dd hh:mm:ss:S")+"\n"+msg)
    }

    Date.prototype.format1 = function(fmt){
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };

        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }

        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(
                    RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }

        return fmt;
    }


    // *** 读取数据
    function getValue(key){
        var value = GM_getValue(key);
        log("读取的数据是:"+value);
        return GM_getValue(key);
    }

    // *** 存储数据
    function setValue(key,value){
        log("存储的数据：key = "+key+" value = "+value);
        GM_setValue(key,value);
    }

    // *** 删除数据
    function deleteValue(key){
        log("删除数据：key = "+key+" value = "+getValue(key));
        GM_deleteValue(key);
    }

    //     在屏幕顶端显示一个toast提示
    //     arg:
    //     msg---要显示的信息内容
    //     typ---toast的颜色，1是绿色，0是红色，分别表示成功和警告
    //     time---显示时长，单位ms

    function toast(msg,type,time){
        var div = document.createElement("div");
        div.id="toast17699059661";
        div.style.cssText="width: 300px; height: 40px; text-align: center; color: rgb(255, 255, 255); position: fixed; left: 43%; top: 10%; line-height: 40px; border-radius: 5px; z-index: 9999;";
        div.innerText=msg;
        if(type){
            div.style.backgroundColor="rgb(5,107,0,0.8)";
        }else{
            div.style.backgroundColor="rgb(255,42,76,0.8)"
        }
        document.body.append(div);
        setTimeout(function(){document.getElementById("toast17699059661").remove()},time);
    }


})();