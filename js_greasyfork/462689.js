// ==UserScript==
// @name         云上全平台🦄️支持自动答题｜题库搜｜刷资源｜刷视频｜视频加速｜快速背题｜AI搜题｜AI问答｜截屏搜题
// @version      5.3.38
// @description  【🐯全网免费仅做一款脚本🐯】、【🚀已完美兼容、知到智慧树、中国大学慕课mooc、云班课、雨课堂、新国家开放大学、超星学习通、（新）智慧职教、职教云、蓝墨云、云班课精品课、山东专技、西财在线剩余网站仅支持部分功能🚀】【半兼容、绎通云、U校园、学堂在线】、【😎完美应付测试，全自动答题，一键完成所有资源学习（视频挨个刷时长不存在滴）、视频倍速😎】、【💪新增AI搜题、AI问答，定制化服务💪】、【💙破除网站不可复制文字💙】、【🐮基于生成式AI(ChatGPT)的答案生成🐮】、【🧡新增背题模式（遮挡答案，更好的进行考试复习）🧡】、【云上官方站：https://metost.com】【特别感谢MeTo题库免费提供题目搜索功能】【💚作者在此保证，脚本无任何诸如（手机号，学校信息，等隐私信息）收集💚】
// @author       alv
// @match        *://*.chaoxing.com/*
// @match        *://*.treewises.com/*
// @match        *://*.swufe-online.com/*
// @match        *://*.xuetangx.com/*
// @match        *://*.ytccr.com/*
// @match        *://*.unipus.cn/*
// @match        *://*.icourse163.org/*
// @match        *://*.yuketang.cn/*
// @match        *://*.ouchn.cn/*
// @match        *://*.metst.cn/*
// @match        *://*.metost.com/*
// @match        *://*.metodt.com/*
// @match        *://*.icve.com.cn/*
// @match        *://*.zhihuishu.com/*
// @match        *://*.mosoteach.cn/*
// @match        *://*.xueyinonline.com/*
// @supportURL   https://github.com/alv002
// @icon         https://i.jpg.dog/8a4f4bd4c5ea7b1eff20a2978885f2b1.jpeg

// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://lib.baomitu.com/crypto-js/4.1.1/crypto-js.min.js
// @require      https://lib.baomitu.com/html2canvas/1.4.1/html2canvas.min.js
// @require      https://lib.baomitu.com/tesseract.js/5.1.1/tesseract.min.js

// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.1.1/tesseract.min.js

// @resource     Table https://www.forestpolice.org/ttf/2.0/table.json
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      metost.com
// @connect      metodt.com
// @connect      metst.cn
// @connect      chaoxing.com
// @connect      unipus.cn
// @connect      *
// @license      AGPL-3.0-or-later
// @namespace https://gitee.com/xiaolv12/yunbanke
// @downloadURL https://update.greasyfork.org/scripts/462689/%E4%BA%91%E4%B8%8A%E5%85%A8%E5%B9%B3%E5%8F%B0%F0%9F%A6%84%EF%B8%8F%E6%94%AF%E6%8C%81%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BD%9C%E9%A2%98%E5%BA%93%E6%90%9C%EF%BD%9C%E5%88%B7%E8%B5%84%E6%BA%90%EF%BD%9C%E5%88%B7%E8%A7%86%E9%A2%91%EF%BD%9C%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%EF%BD%9C%E5%BF%AB%E9%80%9F%E8%83%8C%E9%A2%98%EF%BD%9CAI%E6%90%9C%E9%A2%98%EF%BD%9CAI%E9%97%AE%E7%AD%94%EF%BD%9C%E6%88%AA%E5%B1%8F%E6%90%9C%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/462689/%E4%BA%91%E4%B8%8A%E5%85%A8%E5%B9%B3%E5%8F%B0%F0%9F%A6%84%EF%B8%8F%E6%94%AF%E6%8C%81%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BD%9C%E9%A2%98%E5%BA%93%E6%90%9C%EF%BD%9C%E5%88%B7%E8%B5%84%E6%BA%90%EF%BD%9C%E5%88%B7%E8%A7%86%E9%A2%91%EF%BD%9C%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%EF%BD%9C%E5%BF%AB%E9%80%9F%E8%83%8C%E9%A2%98%EF%BD%9CAI%E6%90%9C%E9%A2%98%EF%BD%9CAI%E9%97%AE%E7%AD%94%EF%BD%9C%E6%88%AA%E5%B1%8F%E6%90%9C%E9%A2%98.meta.js
// ==/UserScript==

;(function(_this) {
    let $ = document.getElementById("yl_8") && document.getElementById("yl_8").onclick || _this.y$ || jQuery; // 此处为避免原生网页没有jquery
    _this.y$ = $
    _this.GM_setValue = GM_setValue
    _this.MainIP = "https://m.metst.cn"
    _this.SpareIP ="https://m.metost.com"
    _this.ChatIP = "https://v.metst.cn"
    _this.HelpIP ="https://doc.metst.cn"
    if(GM_getValue("choice_server")){//切换服务器
        _this.MainIP = _this.SpareIP;
        _this.ChatIP = "https://v.metost.com" // 不做实时跟着main走
        _this.HelpIP ="https://doc.metost.com"
    }
    _this.ShopIP ="https://l.metost.com"
    function MyPage(menu){
        this.MainIP = _this.MainIP
        this.SpareIP = _this.SpareIP
        this.ChatIP = _this.ChatIP
        this.ShopIP = _this.ShopIP
        this.HelpIP = _this.HelpIP
        this.version="5.3.38";
        this.$ = $;
        this.menu = menu;
        this.shadowContent = '';
        this.config = this.urlToObject(window.location.href);
        this.config.tk_uid =null;
        this.config.HelpIP = this.HelpIP;
        this.api = this.getAPI(this.config.hostname);
        let exitElement,show
        if(!this.api){ //是否隐藏ui
            show = "none"
            console.log("并未匹配到页面")
            exitElement = this.initMenu("none");
            // return
        }else{
            show = "block"
            exitElement = this.initMenu("block");
            this.prival_global();
        }
        setInterval(() => {
            if (!exitElement.parentNode) {
                // 重新创建
                exitElement = this.initMenu(show);
            }
        }, 1000);
        this.initData();
        return this;
    }
    MyPage.prototype.urlToObject = function(url){
        let obj = {};
        let arr1 = url.split("?");
        obj["front_url"] = arr1[0].split("/");
        let domain = obj["front_url"][2]
        if(domain.includes('mooc.mosoteach.cn')){
            obj.hostname = "mooc.mosoteach";
        }else if(domain.includes('mosoteach.cn')){
            obj.hostname = "mosoteach";
        }else if(domain.includes("zhihuishu.com")){
            obj.hostname = "zhihuishu";
        }else if(domain.includes("ai.icve.com.cn")){
            obj.hostname = "icveai";
        }else if(domain.includes("zjy2.icve.com.cn") || domain.includes("zyk.icve.com.cn")){
            obj.hostname = "icve2";
        }else if(domain.includes("icve.com.cn")){
            obj.hostname = "icve";
        }else if(domain.includes("v.metost.com") || domain.includes("v.metodt.com") || domain.includes("v.metst.cn")){
            obj.hostname = "meto";
        }else if(domain.includes("metost.com") || domain.includes("metodt.com") || domain.includes("metst.cn")){
            obj.hostname = "meto1";
        }else if(domain.includes("syxy.ouchn.cn")){
            obj.hostname = "ouchn2";
        }else if(domain.includes("ouchn.cn")){
            obj.hostname = "ouchn";
        }else if(domain.includes("chaoxing.com")){
            obj.hostname = "chaoxing";
        }else if(domain.includes("yuketang.cn")){
            obj.hostname = "yuketang";
        }else if(domain.includes("icourse163")){
            obj.hostname = "mooc";
        }else if(domain.includes("unipus.cn")){
            obj.hostname = "uschool";
        }else if(domain.includes("xuetangx.com")){
            obj.hostname = "xuetangx";
        }else if(domain.includes("ytccr.com")){
            obj.hostname = "ytccr";
        }else if(domain.includes("treewises.com")){
            obj.hostname = "sdzj"; //山东专技
        }else if(domain.includes("swufe-online.com")){
            obj.hostname = "xczx"; //西财在线
        }
        if(arr1[1]){
            let arr2 = arr1[1].split("&");
            for(let i=0;i<arr2.length;i++){
                let res = arr2[i].split("=");
                obj[res[0]]=res[1];
            }
        }
        if(arr1[2]){
            let arr2 = arr1[2].split("&");
            for(let i=0;i<arr2.length;i++){
                let res = arr2[i].split("=");
                obj[res[0]]=res[1];
            }
        }
        obj.url = window.location.href;
        return obj;
    }
    MyPage.prototype.filter_problems= function(problems){
            return problems.filter(p => {
                if(p.text && p.text.length > 500) return false;
                if(p.answer && p.answer.length > 1000) return false;
                let optionKeys = Object.keys(p).filter(k => k.startsWith("choice_"));
                if(optionKeys.length > 8) return false;
                for(let key of optionKeys){
                    if(p[key] && p[key].length > 200) return false;
                }
                return true;
            });
    }
    MyPage.prototype.getAPI = function(hostname) {
        switch (hostname) {
            case "mooc.mosoteach":
                console.log("精品云班课脚本准备中");
                return new jpyunbanke_api(this.config);
            case "mosoteach":
                console.log("云班课脚本准备中");
                return new yunbanke_api(this.config);
            case "zhihuishu":
                console.log("智慧树脚本准备中");
                return new zhihuishu_api(this.config);
            case "icveai":
                console.log("智慧职教AI脚本准备中");
                return new icveai_api(this.config);
            case "icve2":
                console.log("智慧职教2脚本准备中");
                return new icve2_api(this.config);
            case "icve":
                console.log("智慧职教脚本准备中");
                return new icve_api(this.config);
            case "meto":
                console.log("meto脚本准备中");
                return new meto_api(this.config);
            case "meto1":
                console.log("meto1脚本准备中");
                return new meto_api(this.config);
            case "ouchn2":
                console.log("国开2脚本准备中");
                return new ouchn2_api(this.config);
            case "ouchn":
                console.log("国开脚本准备中");
                return new ouchn_api(this.config);
            case "chaoxing":
                console.log("超星脚本准备中");
                return new chaoxin_api(this.config);
            case "yuketang":
                console.log("雨课堂脚本准备中");
                return new yuketang_api(this.config);
            case "mooc":
                console.log("慕课脚本准备中");
                return new mooc_api(this.config);
            case "uschool":
                console.log("U校园脚本准备中");
                return new uschool_api(this.config);
            case "xuetangx":
                console.log("学堂在线脚本准备中");
                return new xuetangx_api(this.config);
            case "ytccr":
                console.log("绎通云脚本准备中");
                return new ytccr_api(this.config);
            case "sdzj":
                console.log("山东专技脚本准备中");
                return new sdzj_api(this.config);
            case "xczx":
                console.log("西财在线脚本准备中");
                return new xczx_api(this.config);
            default:
                return null;
        }
      };

    MyPage.prototype.getCookie = function(objName) {   //获取指定名称的cookie的值
        var arrStr = document.cookie.split("; ");
        for (var i = 0; i < arrStr.length; i++) {
          var temp = arrStr[i].split("=");
          if (temp[0] == objName) return temp[1];  //解码
        }
        return "";
    }
    MyPage.prototype.generateHexString=function (length) {
        var hexString = '';
        var hexChars = '0123456789abcdef';
        for (var i = 0; i < length; i++) {
            hexString += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
        }
        return hexString;
    }
    MyPage.prototype.video_spend=function () {
        if(window.my.config.hostname=="zhihuishu"){
            return
        }else{
            div_zhu.append("<button id='x_spend' ><span>视频速率</span></button>");
        }
        setInterval(()=> {
            $("video").each((index,item)=>{
                item.playbackRate = GM_getValue("video_spend")||1;
            })
        }, 2000)
        $(shadowContent.querySelector("#x_spend")).click(()=>{
            var userInput = window.prompt("请注意有些平台有速率检测,如被检测请保持默认\n部分平台发现观看速度过快会打回\n请输入您需要修改的速率(一般平台可支持:0-16倍速率，1为正常速率)", GM_getValue("video_spend")||1)||1;
            GM_setValue("video_spend",userInput)
            $("video").each((index,item)=>{
                item.playbackRate = userInput;
            })
        })
    }
    // MyPage.prototype.guid= function(data){
    //     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //         var r =Math.random() * 16 | 0,
    //             v = c == 'x' ? r : (r & 0x3 | 0x8);
    //             console.log(v);
    //         return v.toString(16);
    //     });
    // }
    MyPage.prototype.upladApi = function(url,data){
        let domain = this.MainIP;
        if(GM_getValue("choice_server")){//切换服务器
            domain = this.SpareIP;
        }
        url = domain+url;
        if(!GM_getValue("time_error_rate")){
            GM_setValue("time_error_rate",0)
        }
        var obj={};
        obj.poolId = this.config.poolId;
        obj.token = this.config.poolId;
        obj.userId = this.config.tk_uid
        for(var key in data){
            obj[key] = data[key];
        }
        return new Promise(function(resolve, reject){
            GM_xmlhttpRequest({
                timeout: 15000,
                method: "post",
                "url": url,
                headers:{
                    "Content-Type":'application/json',
                    accept: "application/json",
                },
                data: JSON.stringify(obj),
                onload: function(response) {
					var status = response.status;
					var playurl = "";
                    // console.log(response.responseText)
                    try{
                        var responseText = JSON.parse(response.responseText);
                    }catch{
                        GM_setValue("choice_server",!GM_getValue("choice_server"));
                        aner.text("服务器数据获取失败,请尝试切换网络。请求主机为："+domain);
                        // aner.append("<br>ti_uid="+GM_getValue("ti_uid") +"<br>pp="+GM_getValue("pp") +"<br>poolId="+GM_getValue("poolId"));
                        aner.css("display","block");
                        return
                    }
                    
					if(status==200||status=='200'||status==501||status=='501'){
                        resolve({"result":"success", "json":responseText});
					}else if(status==400||status=='400'||status==401||status=='401'){
                        if ("data" in responseText){
                            if (responseText.data.message){ //基本上是adduid的返回值
                                resolve({"result":"success", "json":responseText});
                            }else{
                                if(responseText.data != "重复试卷"){
                                    aner.css("display","block");
                                    if(responseText.data[0]=="人"){
                                        var time_error_rate = Date.now() - responseText.data.substr(6)
                                        GM_setValue("time_error_rate",time_error_rate);
                                        // console.log(time_error_rate)
                                    }
                                    GM_setValue("overdue",1)
                                    aner.text(responseText.data);
                                }else{
                                    resolve({"result":"success", "json":responseText});
                                }
                            }
                        }else{
                            aner.text("基础配置文件似乎出错了,请刷新后重试");
                            // aner.append("<br>ti_uid="+GM_getValue("ti_uid") +"<br>pp="+GM_getValue("pp") +"<br>poolId="+GM_getValue("poolId"));
                            aner.css("display","block");
                        }
                        
                    }else if(status==500||status=='500'){
                        aner.css("display","block")
                        if("message" in responseText){
                            aner.text(responseText.message);
                        }else{
                            aner.text("导入错误，请联系管理员");
                        }
						reject({"result":"error", "json":responseText});
                    }else{
                        aner.css("display","block")
                        aner.text(responseText.message);
						reject({"result":"error", "json":responseText});
                        GM_setValue("overdue",1)
				    }
                },
                onerror : function(err){
                    if(url != domain+"/tiku/api/v1/problems"){
                        console.log('error')
                        console.log(err)
                        GM_setValue("choice_server",!GM_getValue("choice_server"));
                        aner.css("display","block")
                        aner.text("无法连接到服务器,请尝试更换网络。请求主机为："+domain);
                    }
                },
                ontimeout : function(inf){
                    if(url != domain+"/tiku/api/v1/problems"){
                        GM_setValue("choice_server",!GM_getValue("choice_server"));
                        console.log(inf)
                        aner.css("display","block")
                        aner.text("服务器响应超时，请稍后重试。请求主机为："+domain);
                    }
                }
            });
        });
    }
    
    MyPage.prototype.HtmlUtil = {
        /*1.用浏览器内部转换器实现html转码*/
        htmlEncode:function (html){
            //1.首先动态创建一个容器标签元素，如DIV
            var temp = document.createElement ("div");
            //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
            (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
            //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
            var output = temp.innerHTML;
            temp = null;
            return output;
        },
        /*2.用浏览器内部转换器实现html解码*/
        htmlDecode:function (text){
            //1.首先动态创建一个容器标签元素，如DIV
            var temp = document.createElement("div");
            //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
            temp.innerHTML = text;
            //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
            var output = temp.innerText || temp.textContent;
            temp = null;
            return output;
        }
    };

    MyPage.prototype.resoluAnswers=function(data){
        let newData = {};
        if(data ==null){
            return console.log("并未获取到题库数据");
        }
        if("paperId" in data){
            console.log("MeTo题库重组中");
            newData.id = data.title;
            newData.rows = [];
            data.problems.forEach(row=>{
                let _data ={};
                _data.problemId = row.problemId;
                _data.subject = row.text;
                _data.answers = JSON.parse(row.answer);
                newData.rows.push(_data);
            });
            
        }else if("rule" in data){
            console.log("助手题库重组中");
            newData.rows = [];
            if("get_answer" in data){ //修改未测试
                data.get_answer.forEach(row=>{
                    let _data ={};
                    _data.answers = [];
                    let br = new RegExp("-and-","g");
                    row.t = row.t.replace(br,"&");
                    row.t=this.HtmlUtil.htmlDecode(row.t);
                    _data.subject = row.t;
                    row.a.forEach(an=>{
                        _data.answers.push(this.HtmlUtil.htmlDecode(an.replace(br,"&")))
                    })
                    _data.type =row.y;
                    _data.options = row.s;
                    newData.rows.push(_data);
                });
            }
        }else if("flag" in data){
            if (data.flag == "metoproblems"){
                console.log("meto1题组重组中");
                newData.id = data.title;
                newData.rows = [];
                try{
                    data.problems.forEach(row=>{
                        let _data ={};
                        _data.problemId = row.problemId;
                        _data.subject = row.text;
                        _data.answers = JSON.parse(row.answer);
                        _data.hideAnswer = row.hideAnswer
                        newData.rows.push(_data);
                    });
                }catch (e){
                    // alert("服务器连接失败，请联系作者。")
                    console.log("发生异常:" + e);
                }
                
            }
            
        }else{
            console.log(data);
        }
        return newData;
    }
    /*
    *  西财在线请求
    */
    class xczx_api{
        constructor(config) {
            this.config = config;
        }
        async get_user_obj(){
            let name = _this._USERNAME_
            let id = _this._LOGINID_
            this.config.user_id = "xczx_"+id
            this.config.full_name = name;
            let obj={
                "unionid": this.config.user_id,
                "username": this.config.full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "西财在线",
            };
            return obj
        }
        async init_button(){
            if(this.config.front_url[4] =="learn"){
                this.choice_function()
                if(GM_getValue("resource_farming_state")){
                    div_zhu.append("<button id='x_xxx' ><span>正在刷资源，请稍后</span></button>");
                    aner.show("hide")
                    aner.text("如需暂停请刷新上一级页面")
                }else{
                    if(GM_getValue("resource_farming_main_state")){
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",false);location.reload()'><span>停止翻页</span></button>");
                    }else{
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",true);location.reload()'><span>自动翻页</span></button>");
                    }
                }
            }
            else{
                div_zhu.append(`<button onclick='window.open("${this.config.HelpIP}");'><span>MeTo题库</span></button>`);
            }
        }
        sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        async choice_function(){
            if(!GM_getValue("resource_farming_state")&&!GM_getValue("resource_farming_main_state")){
                return
            }
            var divIframe
            for(let i=20;i;i--){
                console.log("检测视频loading")
                await this.sleep(1000)
                divIframe = $("iframe").contents()
                let videoIframe = $("iframe").contents().find("iframe").contents()
                if(videoIframe.find("video").length&&videoIframe.find("video")[0].duration){
                    console.log("视频加载")
                    let video = videoIframe.find("video")[0]
                    // $(".xt_video_player_common_icon").click()
                    while(1){
                        video = videoIframe.find("video")[0]
                        if(!video){
                            location.reload()
                        }
                        if(video.ended){
                            console.log("video finsh")
                            let flag = false;
                            divIframe.find(".s_point").each((index,div)=>{
                                if($(div).find(".item_done_icon.item_done_pos").attr("class") != 'item_done_icon item_done_pos done_icon_show' && $(div).find(".s_learn_video").length&&!flag){
                                    div.click()
                                    flag = true
                                    this.choice_function();
                                }
                            })
                            break;
                        }
                        video.muted = true;
                        videoIframe.find(".screen-player-btn-icon.icon-play-sp-fill").click()
                        await this.sleep(4000)
                    }
                    break;
                }
            }
            await this.sleep(1000)
            GM_setValue("resource_farming_state",false)
            if(GM_getValue("resource_farming_main_state")){
                let flag = false;
                divIframe.find(".s_point").each((index,div)=>{
                    if($(div).find(".item_done_icon.item_done_pos").attr("class") != 'item_done_icon item_done_pos done_icon_show' && $(div).find(".s_learn_video").length&&!flag){
                        div.click()
                        flag = true
                        this.choice_function();
                    }
                })
            }else{
                window.close();
            }
            
        }
    }

    /*
    *  山东专技请求
    */
     class sdzj_api{
        constructor(config) {
            this.config = config;
        }
        get_user_inf(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'get',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url: "https://sdzz-train.treewises.com/api/login/get-account-info.gson",
                    success: function(res) {
                        resolve(res.attribute.cmsAccountInfo);
                    }
                });
            })
            
        }
        async get_user_obj(){
            let user_inf = await this.get_user_inf()
            console.log(user_inf)
            let name = user_inf.realName
            let id = user_inf.accountId
            this.config.user_id = id
            this.config.full_name = name;
            let obj={
                "unionid": this.config.user_id,
                "username": this.config.full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "山东专技",
            };
            return obj
        }
        async init_button(){
            if(this.config.front_url[3] =="learning"){
                this.choice_function()
                if(GM_getValue("resource_farming_state")){
                    div_zhu.append("<button id='x_xxx' ><span>正在刷资源，请稍后</span></button>");
                    aner.show("hide")
                    aner.text("如需暂停请刷新上一级页面")
                }else{
                    if(GM_getValue("resource_farming_main_state")){
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",false);location.reload()'><span>停止翻页</span></button>");
                    }else{
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",true);location.reload()'><span>自动翻页</span></button>");
                    }
                }
            }
            else{
                div_zhu.append(`<button onclick='window.open("${this.config.HelpIP}");'><span>MeTo题库</span></button>`);
            }
        }
        sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        async choice_function(){
            if(!GM_getValue("resource_farming_state")&&!GM_getValue("resource_farming_main_state")){
                return
            }
            for(let i=10;i;i--){
                console.log("检测视频loading")
                await this.sleep(1000)
                if($("video").length&&$("video")[0].duration){
                    console.log("视频加载")
                    let video = $("video")[0]
                    document.hasFocus = ()=> {
                        return true
                    }
                    await this.sleep(2000)
                    // $(".xt_video_player_common_icon").click()
                    while(1){
                        if(video.ended){
                            $(".course-spend").each((index,div)=>{
                                if(div.innerHTML!='100.0%'){
                                    div.click()
                                    this.choice_function()
                                }
                            })
                            break;
                            
                        }
                        await this.sleep(1000)
                        video.muted = true;
                        $("#replaybtn").click()//播放按钮1
                        $(".bplayer-play-btn").click() //播放按钮2
                        let div = $(".ccQuestion").find("li"); //第一个答题验证
                        while(div.length){
                            var randElement = div[Math.floor(Math.random() * div.length)];
                            randElement.click()
                            $("#ccQuestionSubmit").click()
                            if($("#rightBtn").length){
                                $("#rightBtn").click()
                                break;
                            }
                            await this.sleep(100)
                        }
                        div = $(".bplayer-question-content").find(".option-item"); //第二个答题验证
                        while(div.length && div.attr("style") != 'display: none;'){
                            var randElement = div[Math.floor(Math.random() * div.length)];
                            randElement.click()
                            $(".commit.bplayer-btn").click()
                            $(".complete.bplayer-btn").click()
                            $(".commit.bplayer-btn").click()
                            
                            // if($("#rightBtn").length){
                            //     $("#rightBtn").click()
                            //     break;
                            // }
                            await this.sleep(100)
                        }
                    }
                    break;
                }
            }
            
            await this.sleep(1000)
            GM_setValue("resource_farming_state",false)
            if(GM_getValue("resource_farming_main_state")){
                $(".btn-next").click()
            }else{
                window.close();
            }
            
        }
    }

    
    /*
    *  绎通云请求
    */
    class ytccr_api{
        constructor(config) {
            this.config = config;
        }
        getCookie(objName) {   //获取指定名称的cookie的值
            var arrStr = document.cookie.split("; ");
            for (var i = 0; i < arrStr.length; i++) {
              var temp = arrStr[i].split("=");
              if (temp[0] == objName) return temp[1];  //解码
            }
            return "";
        }
        get_user_inf(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'get',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    headers: {
                        "Authorization":"Bearer "+this.getCookie("token"),
                    },
                    url: "https://dadexs.ytccr.com/org_student_api/yt/student/myStudentInfo/getInfo",
                    success: function(res) {
                        resolve(res);
                    }
                });
            })
            
        }
        async get_user_obj(){
            // var regex = /window.webUser([\s\S]*?)};/gi;
            let user_inf = await this.get_user_inf()
            // var matches = doc.match(regex);
            // GM_setValue("userimg",window.webUser.largeFaceUrl||"");
            // let img_table = $(shadowContent.querySelector("#x_set"))
            // img_table.css("background","url(" +  window.webUser.largeFaceUrl||"" + ")")
            let name = user_inf.data.realName
            let id = user_inf.data.idCardNo
            this.config.user_id = "yty_"+id
            this.config.full_name = name;
            let obj={
                "unionid": this.config.user_id,
                "username": this.config.full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "绎通云",
            };
            return obj
        }
    }
    /*
    *  u校园请求
    */
    class uschool_api{
        constructor(config) {
            this.config = config;
        }
        getCookie(objName) {   //获取指定名称的cookie的值
            var arrStr = document.cookie.split("; ");
            for (var i = 0; i < arrStr.length; i++) {
              var temp = arrStr[i].split("=");
              if (temp[0] == objName) return temp[1];  //解码
            }
            return "";
        }
        get_user_inf(){
            return new Promise((resolve,rejcet)=>{
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://ucamapi.unipus.cn/rpc/api/user-info/brief?source=0&callback=window.user_inf=&openId="+this.getCookie("ucamUserId"),
                    onload: res=> {
                        resolve(res.response);
                    },
                    onerror:err=>{
                        console.log("加载失败")
                    }
                })
            })
            
        }
        // get_user_inf(){
        //     alert("即将发送一个请求信息，点击仅获取一次即可\n此请求信息是为了获取用户ID，否则进行手动登录也可");
        //     return new Promise((resolve,rejcet)=>{
        //         GM_xmlhttpRequest({
        //             method: "GET",
        //             url: "https://ucontent.unipus.cn/auth/api/user",
        //             onload: res=> {
        //                 resolve(res.response);
        //             },
        //             onerror:err=>{
        //                 console.log("加载失败")
        //             }
        //         })
        //     })
            
        // }
        async get_user_obj(){
            // var regex = /window.webUser([\s\S]*?)};/gi;
            let script = await this.get_user_inf()
            // var matches = doc.match(regex);
            eval(script)
            // GM_setValue("userimg",window.webUser.largeFaceUrl||"");
            // let img_table = $(shadowContent.querySelector("#x_set"))
            // img_table.css("background","url(" +  window.webUser.largeFaceUrl||"" + ")")
            let name = window.user_inf.result.name
            let id = window.user_inf.result.id
            this.config.user_id = "uschool_"+id
            this.config.full_name = name;
            let obj={
                "unionid": this.config.user_id,
                "username": this.config.full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "uschool",
            };
            return obj
        }
    }
    /*
    *  学堂在线请求
    */
    
    class xuetangx_api{
        constructor(config) {
            this.config = config;
        }
        async init_button(){
            if(this.config.front_url[this.config.front_url.length-2] =="result"){
                aner.css("display","block")
                aner.text("正在导入题库中");
                let exam_id = this.config.front_url[this.config.front_url.length-1]
                if(!GM_getValue(exam_id)){
                    aner.css("display","block")
                    aner.text("因api被攻击暂不支持导入题库");
                    aner.append(`</br>如需请更新完整版进行更多体验`)
                    aner.append("<br/>可前往<a href=\""+_this.HelpIP+"\">官网</a>安装最新脚本")
                }else{
                    aner.text("题库已存在");
                }
            }else if(this.config.front_url[3] =="learn"){
                this.choice_function()
                if(GM_getValue("resource_farming_main_state")){
                    div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",!1);location.reload()'><span>停止翻页</span></button>");
                    aner.show("hide")
                    aner.text("手动切换课程后请刷新页面")
                }else{
                    div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",!0);location.reload()'><span>自动翻页</span></button>");
                }
            }else{
                div_zhu.append(`<button onclick='window.open("${this.config.HelpIP}");'><span>MeTo题库</span></button>`);
            }
        }
        sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
        async choice_function(){
            if(!GM_getValue("resource_farming_main_state")){
                return
            }
            for(let i=10;i;i--){
                await this.sleep(1000)
                if(y$("video").length&&y$("video")[0].duration){
                    console.log("视频加载")
                    y$("video")[0].muted = true;
                    while(1){
                        if(y$("video")[0].ended){
                            console.log("视频播放结束")
                            y$(".next").click()
                            this.choice_function()
                            break;
                        }
                        y$("video")[0].play()
                        await this.sleep(1000)
                    }
                    break;
                }
            }
        }
        get_exercise_list(exam_id){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url: "https://examination.xuetangx.com/exam_room/show_paper?exam_id="+exam_id,
                    success: function(res) {
                        console.log(res)
                        resolve(res.data);
                    }
                });
            });
        }
        async get_quiz_result(exam_id){
            var status = "error";
            let paper = await this.get_exercise_list(exam_id)
            let title = paper.title
            var answers = this.reset_answer(paper);
            answers.id = exam_id
            if(answers == null || JSON.stringify(answers) == '{}' ||GM_getValue(answers.id)){
                console.log("题库导入存在，或异常")
                return status;
            }
            let obj={
                "poolId": this.config.poolId,
                "userId":   this.config.tk_uid,
                "tags":[title,"学堂在线"],
                "title": "xtzx_"+ answers.id,
                "problems":[],
            };
            let data={};
            answers.rows.forEach(row=>{
                if(row.subject.length < 4 || row.answers == ""){
                    console.log("题目录入有误");
                    return; //跳出循环
                }
                data={
                    "tags":     ["学堂在线"],
                    "text":     row.subject,
                    "answer":   JSON.stringify(row.answers),
                };
                data.tags.push(row.type);
                let l = ["choice_A","choice_B","choice_C","choice_D","choice_E","choice_F","choice_G","choice_H","choice_I","choice_J","choice_K","choice_L","choice_M","choice_N","choice_O","choice_P","choice_Q","choice_R","choice_S","choice_T","choice_U","choice_V","choice_W","choice_X","choice_Y","choice_Z"];
                let i=0;
                row.options.forEach(option =>{
                    data[l[i]]=option;
                    i=i+1;
                })
                obj.problems.push(data);
            });
            obj.problems = window.my.filter_problems(obj.problems);
            if(obj.problems.length == 0){
                return;
            }
            await(window.my.upladApi("/tiku/api/v1/problems",obj).then((resutData)=>{
                console.log(resutData)
                if(resutData.result=="success" && resutData.json){
                    var data = resutData.json.data;
                    GM_setValue(answers.id,1);
                    status = "success"
                }
            }));
            return status;
        }
        reset_answer(data){
            let newData = {};
            if(data ==null){
                return console.log("并未获取到题库数据");
            }
            if("problems" in data){
                console.log("学堂在线题库重组中");
                newData.rows = [];
                data.problems.forEach(row=>{
                    let _data = {};
                    _data.id = row.problem_id;
                    _data.subject = window.my.HtmlUtil.htmlDecode(row.Body);
                    _data.options = [];
                    _data.answers = [];
                    _data.type = row.TypeText;
                    let tmp_option =  row.Options
                        if(row.Score == row.score){
                            tmp_option.forEach(option=>{
                                _data.options.push(window.my.HtmlUtil.htmlDecode(option.value));
                                row.Answer.forEach(value=>{
                                    if(option.key == value){
                                        _data.answers.push(window.my.HtmlUtil.htmlDecode(option.value));
                                    }
                                })
                            });
                        }
                    if(_data != null){
                        newData.rows.push(_data);
                    }
                    
                });
            }else{
                console.log(data);
            }
            console.log(newData)
            return newData;
        }
        get_user_inf(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'get',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url: "https://www.xuetangx.com/api/v1/u/user/basic_profile/",
                    success: function(res) {
                        resolve(res.data);
                    }
                });
            });
        }
        async get_user_obj(){
            let user_inf = await this.get_user_inf()
            console.log(user_inf)
            GM_setValue("userimg",user_inf.avatar||"");
            let img_table =  $(shadowContent.querySelector("#x_set"))
            img_table.css("background","url(" + user_inf.avatar||"" + ")")

            let name = user_inf.nickname
            let id = user_inf.user_id
            this.config.user_id = "xtzx_"+id
            this.config.full_name = name;
            let obj={
                "unionid": this.config.user_id,
                "username": this.config.full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "学堂在线",
            };
            return obj
        }
    }
    /*
    *  mooc请求
    */
    
    class mooc_api{
        constructor(config) {
            this.config = config;
        }
        async init_button(){
            if(this.config.front_url[this.config.front_url.length-1] =="studycontent"||this.config.front_url[this.config.front_url.length-2]=="studentLog"){
                GM_setValue("resource_farming_state",false) //    跨域访问，清空默认状态
                div_zhu.append("<button id='x_res' ><span>一键完成资源</span></button>");
            }else{
                // let a = await this.get_ansers()
                // console.log(a)
                div_zhu.append(`<button onclick='window.open("${this.config.HelpIP}");'><span>MeTo题库</span></button>`);
            }
        }
        getCookie(objName) {   //获取指定名称的cookie的值
            var arrStr = document.cookie.split("; ");
            for (var i = 0; i < arrStr.length; i++) {
              var temp = arrStr[i].split("=");
              if (temp[0] == objName) return temp[1];  //解码
            }
            return "";
        }
        get_ansers(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'post',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    data:{
                        aid: 2698276550,
                        tid: "1241795540",
                        withStdAnswerAndAnalyse: true
                    },
                    url: "https://www.icourse163.org/web/j/mocQuizRpcBean.getOpenQuizPaperDto.rpc?csrfKey="+this.getCookie("NTESSTUDYSI"),
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }

        get_user_inf(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'get',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url: "https://www.icourse163.org/home.htm",
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        async get_user_obj(){
            // var regex = /window.webUser([\s\S]*?)};/gi;
            // let doc = await this.get_user_inf()
            // var matches = doc.match(regex);
            // console.log(_this.webUser)
            // eval(matches[0])
            GM_setValue("userimg",_this.webUser.largeFaceUrl||"");
            let img_table = $(shadowContent.querySelector("#x_set"))
            img_table.css("background","url(" +  _this.webUser.largeFaceUrl||"" + ")")
            let name = _this.webUser.nickName
            let id = _this.webUser.id
            this.config.user_id = "mooc_"+id
            this.config.full_name = name;
            let obj={
                "unionid": this.config.user_id,
                "username": this.config.full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "mooc",
            };
            return obj
        }
    }
    /*
    *  雨课堂请求
    */
    class yuketang_api{
        constructor(config) {
            this.config = config;
            setInterval(()=> {
                if(this.config.url != window.location.href){
                    location.reload()
                }
            }, 400)
        }
        async init_button(){
            if(this.config.front_url[this.config.front_url.length-1] =="studycontent"||this.config.front_url[this.config.front_url.length-2] =="studentLog"){
                GM_setValue("resource_farming_state",false) //    跨域访问，清空默认状态
                div_zhu.append("<button id='x_res' ><span>一键完成资源</span></button>");
                div_zhu.append("<button id='x_forum' ><span>讨论表</span></button>");
            } else if (this.config.front_url[this.config.front_url.length - 2] == "video" || this.config.front_url[this.config.front_url.length - 3] == "video-student" || this.config.front_url[this.config.front_url.length - 2] == "forum" || this.config.front_url[this.config.front_url.length - 2] == "graph"){
                this.choice_function()
                if(GM_getValue("resource_farming_state")){
                    div_zhu.append("<button id='x_xxx' ><span>正在刷资源，请稍后</span></button>");
                    aner.show("hide")
                    aner.text("如需暂停请刷新上一级页面")
                }else{
                    if(GM_getValue("resource_farming_main_state")){
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",false);location.reload()'><span>停止翻页</span></button>");
                        aner.show("hide")
                        aner.text("部分课程仅支持通过一键完成资源启动")
                    }else{
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",true);location.reload()'><span>自动翻页</span></button>");
                    }
                    div_zhu.append("<button id='x_forum' ><span>讨论表</span></button>");
                }
            }else if(this.config.front_url[7] == "exercise"){ //暂时屏蔽上传
                // aner.css("display","block")
                // aner.text("正在导入题库中");
                // if(!GM_getValue(this.config.id)){
                //     let flag =  await(this.get_quiz_result(this.config.front_url[8],this.config.front_url[9]));
                //     if(flag == "success"){
                //         aner.text("题库导入成功");
                //     }else{
                //         // aner.text("题库导入失败");
                //     }
                // }else{
                //     aner.text("题库已存在");
                // }
            }else{
                div_zhu.append(`<button onclick='window.open("${this.config.HelpIP}");'><span>MeTo题库</span></button>`);
            }
        }
        get_exercise_list(classId,paperId){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    headers:{
                        "Classroom-Id":classId,//this.config.front_url[8],
                        "Xtbz":"ykt",
                    },
                    url: "https://"+this.config.front_url[2]+"/mooc-api/v1/lms/exercise/get_exercise_list/"+paperId+"/",
                    success: function(res) {
                        resolve(res.data);
                    }
                });
            });
        }
        get_leaf_info(classId,id){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    headers:{
                        "Classroom-Id":classId,
                        "Xtbz":"ykt",
                    },
                    url: "https://"+this.config.front_url[2]+"/mooc-api/v1/lms/learn/leaf_info/"+classId+"/"+id+"/",
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        async get_quiz_result(classId,id){
            var status = "error";
            let leaf_info = await this.get_leaf_info(classId,id);
            let paper = await this.get_exercise_list(classId,leaf_info.data.content_info.leaf_type_id)
            let classname = paper.problems[0].content.LibraryName
            var answers = this.reset_answer(paper);
            if(answers == null || JSON.stringify(answers) == '{}' ||GM_getValue(answers.id)){
                console.log("题库导入存在，或异常")
                return status;
            }
            let obj={
                "poolId": this.config.poolId,
                "userId":   this.config.tk_uid,
                "tags":[classname,answers.title,"雨课堂"],
                "title": "ykt_"+ answers.id,
                "problems":[],
            };
            let data={};
            answers.rows.forEach(row=>{
                if(row.subject.length < 4 || row.answers == ""){
                    console.log("题目录入有误");
                    return; //跳出循环
                }
                data={
                    "tags":     ["雨课堂"],
                    "text":     row.subject,
                    "answer":   JSON.stringify(row.answers),
                };
                data.tags.push(row.type);
                let l = ["choice_A","choice_B","choice_C","choice_D","choice_E","choice_F","choice_G","choice_H","choice_I","choice_J","choice_K","choice_L","choice_M","choice_N","choice_O","choice_P","choice_Q","choice_R","choice_S","choice_T","choice_U","choice_V","choice_W","choice_X","choice_Y","choice_Z"];
                let i=0;
                row.options.forEach(option =>{
                    data[l[i]]=option;
                    i=i+1;
                })
                obj.problems.push(data);
            });
            if(obj.problems.length == 0){
                return;
            }
            aner.css("display","block")
            aner.text("因api被攻击暂不支持导入题库");
            aner.append(`</br>如需请更新完整版进行更多体验`)
            aner.append("<br/>可前往<a href=\""+_this.HelpIP+"\">官网</a>安装最新脚本")
            return status;
        }
        reset_answer(data){
            let newData = {};
            if(data ==null){
                return console.log("并未获取到题库数据");
            }
            if("problems" in data){
                console.log("雨课堂题库重组中");
                newData.id = data.exercise_id;
                newData.title = data.name;
                newData.rows = [];
                data.problems.forEach(row=>{
                    let _data = {};
                    _data.id = row.content.ProblemID;
                    let imgs =null;
                    try{
                        imgs = $.parseHTML(row.content.Body); // 去除特殊字符报错
                    }catch (e){
                        console.log(e);
                    }
                    row.title=window.my.HtmlUtil.htmlDecode(row.content.Body);
                    if(imgs){
                        imgs.forEach(async function(img,index){
                            if(img.localName == "img"){
                                row.title += img.outerHTML;
                            }
                        })
                    }
                    // row.subject = row.subject.substr(0,500) //截断前500个字符
                    _data.subject = row.title;
                    _data.options = [];
                    _data.answers = [];
                    _data.type = row.content.TypeText;
                    let tmp_option =  row.content.Options
                        if(row.user.is_show_answer){
                            tmp_option.forEach(option=>{
                                _data.options.push(window.my.HtmlUtil.htmlDecode(option.value));
                                if(typeof(row.user.answer) == 'string'){
                                    if(option.key ==row.user.answer){
                                        _data.answers.push(window.my.HtmlUtil.htmlDecode(option.value));
                                    }
                                }else{
                                    row.user.answer.forEach(value=>{
                                        if(option.key == value){
                                            _data.answers.push(window.my.HtmlUtil.htmlDecode(option.value));
                                        }
                                    })
                                }
                            });
                        }
                        // }else{
                        //     if(row.isRight == true){
                        //         tmp_option.forEach(option=>{
                        //             _data.options.push(window.my.HtmlUtil.htmlDecode(option.Content));
                        //             row.recordAnswer.split(",").forEach(index=>{
                        //                 if(option.SortOrder == index){
                        //                     _data.answers.push(window.my.HtmlUtil.htmlDecode(option.Content));
                        //                 }
                        //             })
                                
                        //         });
                        //     }else{
                        //         _data=null;
                        //     }
                        // }
                        
                    // }
                    if(_data != null){
                        newData.rows.push(_data);
                    }
                    
                });
            }else{
                console.log(data);
            }
            console.log(newData)
            return newData;
        }
        get_courses(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    // headers:{
                    //     "Classroom-Id":classId,
                    //     "Xtbz":"ykt",
                    // },
                    url: "https://"+this.config.front_url[2]+"/v2/api/web/courses/list?identity=2",
                    success: function(res) {
                        resolve(res.data.list);
                    }
                });
            });
        }
        get_online_courseware(classId,free_sku_id){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    headers:{
                        "Classroom-Id":classId,
                        "Xtbz":"ykt",
                    },
                    url: "https://"+this.config.front_url[2]+"/c27/online_courseware/schedule/score_detail/single/"+free_sku_id+"/0/",
                    success: function(res) {
                        resolve(res.data);
                    }
                });
            });
        }
        get_classrooms(classId){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    headers:{
                        "Classroom-Id":classId,
                        "Xtbz":"ykt",
                    },
                    url: "https://"+this.config.front_url[2]+"/v2/api/web/classrooms/"+classId+"?role=5",
                    success: function(res) {
                        resolve(res.data);
                    }
                });
            });
        }
        // async upload_all_problem(show_aner){ //暂时不收集
        //     let classListData = await (this.get_courses());
        //     let class_length = 0
        //     if(show_aner){
        //         aner.text("欢迎您的第一次使用，正在为您聚合数据中，请稍后。。。。");
        //         aner.css("display","block")
        //     }
        //     for(let i=0;i<classListData.length;i++){
        //         let cl = classListData[i];
        //         let classrooms =  await this.get_classrooms(cl.classroom_id)
        //         let coursewares = await this.get_online_courseware(cl.classroom_id,classrooms.free_sku_id)
        //         if(!coursewares.leaf_level_infos){
        //             continue;
        //         }else{
        //             coursewares = coursewares.leaf_level_infos
        //         }
        //         for(let j=0;j<coursewares.length;j++){
        //             let courseware = coursewares[j];
        //             console.log(courseware.leaf_type, courseware.schedule, !GM_getValue(courseware.id))
        //             if(courseware.leaf_type==6 && courseware.schedule && !GM_getValue(courseware.id)){
        //                 class_length++;
        //                 try{
        //                     await(this.get_quiz_result(cl.classroom_id,courseware.id));
        //                     console.log(courseware.id+"upload成功")
        //                 }catch{
        //                     console.log(courseware.id+"upload失败")
        //                 }
        //                 if(show_aner){
        //                     aner.text("百分比长时间未动请刷新页面\n已加载："+class_length+"%");
        //                 }
        //             }
        //         }
        //         // console.log(result)
        //         // .then((result) =>{
        //         //     $(result).find(".interaction-row").each(async (index,div)=>{
        //         //         let id = $(div).attr('data-id');
        //         //         let type = $(div).attr('data-type');
        //         //         let status = $(div).attr('data-row-status');
        //         //         if(type=="QUIZ"){
        //         //             
        //         //         }
        //         //     })

        //         // });
        //     }
        // }
        get_user_inf(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'get',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url: "https://"+this.config.front_url[2]+"/edu_admin/get_user_basic_info",
                    success: function(res) {
                        resolve(res.data.user_info);
                    }
                });
            });
        }
        get_user_inf1(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'get',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url: "https://"+this.config.front_url[2]+"/v2/api/web/userinfo",
                    success: function(res) {
                        resolve(res.data[0]);
                    }
                });
            });
        }
        async get_user_obj(){
            let user_inf = await this.get_user_inf() || await this.get_user_inf1()
            GM_setValue("userimg",user_inf.avatar||"");
            $(shadowContent.querySelector("#x_set"))
            let img_table = $(shadowContent.querySelector("#x_set"))
            img_table.css("background","url(" +  user_inf.avatar||"" + ")")

            let name = user_inf.name
            let id = user_inf.user_id
            this.config.user_id = "ykt_"+id
            this.config.full_name = name;
            let obj={
                "unionid": this.config.user_id,
                "username": this.config.full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "雨课堂",
            };
            return obj
        }
        sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        // 创建一个 PointerEvent 对象
        pointerEvent = new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            pointerId: 1, // 指针 ID
            pointerType: "mouse", // 指针类型
            clientX: 100, // 指针在视口中的 X 坐标
            clientY: 100, // 指针在视口中的 Y 坐标
        });
        async choice_function(){
            if(!GM_getValue("resource_farming_state")&&!GM_getValue("resource_farming_main_state")){
                return
            }
            let forum_flag = false;
            for(let i=10;i;i--){
                console.log($(".activity-content").text().length)
                await this.sleep(1000)
                if ($("video").length && $("video")[0].duration) {
                    console.log("视频加载")
                    let video = $("video")[0]

                    document.hasFocus = () => {
                        return true
                    }
                    await this.sleep(2000)
                    $(".xt_video_player_common_icon").click()


                    while (1) {
                        if (video.ended || $(".text").text().includes("100%") || $(".finish").length) {
                            aner.show("hide")
                            aner.append("<br/>任务点已完成")
                            console.log("视频播放完成")
                            break;
                        }
                        await this.sleep(1000)
                        video.muted = true;
                        try{
                        $(".xt_video_bit_play_btn").click()
                        $(".xt_video_bit_play_btn")[0].dispatchEvent(this.pointerEvent);
                        }catch(e){
                            video.play()
                        }

                    }
                    break;
                } else if ($(".publish_discuss_unit_container").length && !forum_flag) {
                    console.log("检测到未讨论")
                    if (GM_getValue("forum_texts")) {
                        var forum_texts = GM_getValue("forum_texts").split(",")
                        var forum_text = forum_texts[Math.floor(Math.random() * forum_texts.length)]
                    } else {
                        console.log("暂未设置讨论词")
                        continue;
                    }
                    $(".publish_discuss_unit_container").find("textarea").val(forum_text)
                    let ev = document.createEvent("HTMLEvents");
                    ev.initEvent("input", true, true);
                    $(".publish_discuss_unit_container").find("textarea")[0].dispatchEvent(ev);
                    await this.sleep(2000)
                    $(".submitComment").click()
                    forum_flag = true;
                    continue;
                }
            }
            
            await this.sleep(1000)
            if (GM_getValue("resource_farming_state")) {
                GM_setValue("resource_farming_state", false)
                window.close();
            } else {
                $(".btn-next").click()
            }
            
        }
        async resource_farming(){
            
            let activity_list=[]
            let divs = $(".leaf-detail")
            divs.each((index,div)=>{
                if($(div).find(".icon--shipin").length && $(div).find(".el-tooltip").text()!="已完成" ){
                    activity_list.push(div)
                }
            })
            
            divs = $(".study-unit") ||[]//雨课堂main site 视频
            $(divs).each((index,div)=>{
                try{
                    let status = $(div).find("span")[2].innerHTML.trim()
                    console.log(status)
                    if(status!="已完成" && status!="已发言" && status!="已读" && status!="未开始"){
                        activity_list.push($(div).find(".name-text"))
                    }
                }catch{}
            })

            if(activity_list.length){
                console.log(activity_list.length)
            }else{
                aner.show("slow")
                aner.text("未检测到页面资源，请等待页面加载完毕。 ")
                aner.append("</br>若未展开资源，请点击全部展开。")
                aner.append("</br>或者进入成绩单页面，再次点击。")
                
                $(shadowContent.querySelector("#x_res")).attr("disabled", false)
                $("#tab-student_school_report").click()
                return
            }
            aner.show("slow")
            aner.text("部分浏览器默认关闭弹出窗口，请在右上角开启")
            
            // return
            for(let i =0;i<activity_list.length;i++){
                GM_setValue("resource_farming_state",true)
                activity_list[i].click()
                while(1){
                    if(GM_getValue("resource_farming_state")){
                        $(shadowContent.querySelector("#x_res")).text("剩余"+(activity_list.length - i)+"资源")
                        await this.sleep(1000)
                    }else{
                        break
                    }
                }
                
            }
            $(shadowContent.querySelector("#x_res")).text("全部完成")
        }
    }
    /*
    *  超星请求
    */
    class chaoxin_api{
        constructor(config) {
            this.config = config;
            setInterval(()=> {
                if(this.config.url != window.location.href){
                    location.reload()
                }
            }, 400)
        }
        /**
         * 原作者 wyn665817@163.com
         * 链接 https://scriptcat.org/script-show-page/432/code
         */
        encode_font(){
            console.log("解密字体")
            // 判断是否存在加密字体
            var $tip = $('iframe').contents().find("iframe").contents().find("iframe").contents().find('style:contains(font-cxsecret)')
            if (!$tip.length) return;

            // 解析font-cxsecret字体
            var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
            font = Typr.parse(base64ToUint8Array(font))[0];

            // 匹配解密字体
            var table = JSON.parse(GM_getResourceText('Table'));
            var match = {};
            for (var i = 19968; i < 40870; i++) { // 中文[19968, 40869]
                $tip = Typr.U.codeToGlyph(font, i);
                if (!$tip) continue;
                $tip = Typr.U.glyphToPath(font, $tip);
                $tip = CryptoJS.MD5(JSON.stringify($tip)).toString().slice(24); // 8位即可区分
                match[i] = table[$tip];
            }
            // 替换加密字体
            $('iframe').contents().find("iframe").contents().find("iframe").contents().find('.font-cxsecret').html(function(index, html) {
                $.each(match, function(key, value) {
                    key = String.fromCharCode(key);
                    key = new RegExp(key, 'g');
                    value = String.fromCharCode(value);
                    html = html.replace(key, value);
                });
                return html;
            }).removeClass('font-cxsecret'); // 移除字体加密

            function base64ToUint8Array(base64) {
                var data = window.atob(base64);
                var buffer = new Uint8Array(data.length);
                for (var i = 0; i < data.length; ++i) {
                    buffer[i] = data.charCodeAt(i);
                }
                return buffer;
            }
        }
        async init_button(){
            if(this.config.c === "res"||this.config.front_url[this.config.front_url.length-1] === "course-learning"){
                div_zhu.append("<button id='x_res' ><span>一键完成资源</span></button>");
            }else if(this.config.front_url.at(-1) =="studentstudy"){
                this.choice_function()
                if(GM_getValue("resource_farming_state")){
                    div_zhu.append("<button id='x_xxx' ><span>正在刷资源，请稍后</span></button>");
                    aner.show("hide")
                    aner.text("如需暂停请刷新上一级页面")
                }else{
                    if(GM_getValue("resource_farming_main_state")){
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",false);location.reload()'><span>停止翻页</span></button>");
                        aner.show("hide")
                        aner.text("手动切换课程后请刷新页面")
                    }else{
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",true);location.reload()'><span>自动翻页</span></button>");
                    }
                }
                iframe.onload = () => {
                    try {this.encode_font();} catch (e) {console.log(e)}
                    let knowledgeId = _this.stu_knowledgeId 
                    let iframeBody = $('iframe').contents().find("iframe").contents().find("iframe").contents().find(".radiusBG")
                    console.log(knowledgeId+'iframe已加载完毕')
                    if(iframeBody.find(".ans-cc").length){
                        div_zhu.append("<button id='x_start' ><span>开始搜题</span></button>");
                    }
                }
            }else if(this.config.front_url[5] =="cards"){
                console.log("获取答案")
                if(!GM_getValue(this.config.knowledgeid)){
                    await this.get_quiz_result(this.config.clazzid,this.config.courseid,this.config.knowledgeid,this.config.num);
                }else{
                    aner.show("hide")
                    aner.text("题库已存在");
                }

            }else if(this.config.front_url[5] =="selectWorkQuestionYiPiYue"){
                await this.sleep(2000)
                console.log("获取答案2")
                if(!GM_getValue(this.config.knowledgeid)){
                    await this.get_quiz_result2(this.config.knowledgeid,document);
                }else{
                    aner.show("hide")
                    aner.text("题库已存在");
                }
            }else if(this.config.front_url[5] =="work"){
                if(this.config.front_url[6] == "view"){
                    aner.css("display","block")
                    aner.text("因api被攻击暂不支持导入题库");
                    aner.append(`</br>如需请更新完整版进行更多体验`)
                    aner.append("<br/>可前往<a href=\""+_this.HelpIP+"\">官网</a>安装最新脚本")
                }else if(this.config.front_url[6] == "dowork"){
                    div_zhu.append("<button id='x_start' ><span>开始搜题</span></button>");
                }
            }else{
                div_zhu.append(`<button onclick='window.open("${this.config.HelpIP}");'><span>MeTo题库</span></button>`);
            }
        }

        get_cards(clazzid,courseid,knowledgeid,num){
            return new Promise((resolve,rejcet)=>{
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://mooc1-2.chaoxing.com/mooc-ans/knowledge/cards?clazzid="+clazzid+"&courseid="+courseid+"&knowledgeid="+knowledgeid+"&num="+num,
                    onload: res=> {
                        resolve(res.response);
                    },
                    onerror:err=>{
                        console.log("加载失败")
                    }
                })
            })
        }
        get_work(data){
            let mArg = JSON.parse(data)
            return new Promise((resolve,rejcet)=>{
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://mooc1-2.chaoxing.com/mooc-ans/api/work?api=1&workId="+mArg.attachments[0].property.workid+"&jobid="+mArg.attachments[0].property._jobid+"&needRedirect=true&skipHeader=true&knowledgeid="+mArg.defaults.knowledgeid+"&ktoken="+mArg.defaults.ktoken+"&cpi="+mArg.defaults.cpi+"&ut=s&clazzId="+mArg.defaults.clazzId+"&type=&enc="+mArg.attachments[0].enc+"&utenc=undefined&courseid="+mArg.defaults.courseid,
                    onload: res=> {
                        resolve(res);
                    },
                    onerror:err=>{
                        console.log("加载失败")
                    }
                })
            })
        }
        get_WorkQuestionYiPiYue(url){
            url = url.replace("api=1", "api=0");
            return new Promise((resolve,rejcet)=>{
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: res=> {
                        resolve(res.response);
                    },
                    onerror:err=>{
                        console.log("加载失败")
                    }
                })
            })
        }
        async get_quiz_result2(knowledgeid,body){
            var status = "error";
            var answers = this.reset_answer2(body);
            answers.id = knowledgeid;
            if(answers == null || JSON.stringify(answers) == '{}'){
                console.log("题库导入存在，或异常")
                return status;
            }
            let obj={
                "poolId": this.config.poolId,
                "userId":   this.config.tk_uid,
                "tags":[answers.title,"超星"],
                "title": "cx_"+ answers.id,
                "problems":[],
            };
            let data={};
            answers.rows.forEach(row=>{
                if(row.subject.length < 4 || row.answers == ""){
                    console.log("题目录入有误");
                    return; //跳出循环
                }
                data={
                    "tags":     ["超星"],
                    "text":     row.subject,
                    "answer":   JSON.stringify(row.answers),
                };
                data.tags.push(row.type);
                let l = ["choice_A","choice_B","choice_C","choice_D","choice_E","choice_F","choice_G","choice_H","choice_I","choice_J","choice_K","choice_L","choice_M","choice_N","choice_O","choice_P","choice_Q","choice_R","choice_S","choice_T","choice_U","choice_V","choice_W","choice_X","choice_Y","choice_Z"];
                let i=0;
                row.options.forEach(option =>{
                    data[l[i]]=option;
                    i=i+1;
                })
                obj.problems.push(data);
            });
            obj.problems = window.my.filter_problems(obj.problems);
            if(obj.problems.length == 0){
                return;
            }
            aner.css("display","block")
            aner.text("因api被攻击暂不支持导入题库");
            aner.append(`</br>如需请更新完整版进行更多体验`)
            aner.append("<br/>可前往<a href=\""+_this.HelpIP+"\">官网</a>安装最新脚本")
            return status;
        }
        reset_answer2(body){
            let newData = {};
            console.log("超星题库重组中");

            newData.title = $(body).find(".ceyan_name h3").text().trim();
            newData.rows = [];
            $(body).find(".aiArea").each((_,row)=>{
                let _data = {};
                // 过滤规则：
                // 有“正确答案”则直接处理；无“正确答案”时，若存在“我的答案”则处理。
                // 填空题额外规则：如果出现错误标记且无“正确答案”，则不录入。
                const hasCorrectBlock = $(row).find(".correctAnswerBx").text().trim().length > 0;
                const hasAnyFillError = $(row).find(".marking_cuo").length > 0;
                if(!hasCorrectBlock && hasAnyFillError){
                    return;
                }
            
                // 兼容新结构：从 .TiMu 获取题目 id
                _data.id = ($(row).find(".TiMu.singleQuesId").attr("data") || $(row).find(".TiMu").attr("id") || "").replace("question","" ).trim();
                // 题型来自标签文本，例如【单选题】/【判断题】
                _data.type = ($(row).find(".qtContent .newZy_TItle").text() || "").replace(/[【】]/g, "").trim();
                // 题干：去除题型标签与分值标注
                let qtText = $(row).find(".qtContent").text().trim();
                let labelText = $(row).find(".qtContent .newZy_TItle").text();
                // subject = subject.replace(/^.*?[：:]\s*/, "");
                let subject = qtText.replace(labelText, "").replace(/^[^】]*】/g, '').trim();
                subject = this.HtmlUtil.htmlDecode(subject).substr(0,500);
                _data.subject = subject;
                _data.options = [];
                _data.answers = [];

                // 填空题专属解析：优先使用正确答案；否则在无错误的情况下回退到我的答案
                if(_data.type.includes("填空题")){
                    let correctParts = $(row).find(".correctAnswerBx .correctAnswer.marTop16 p");
                    if(correctParts.length){
                        correctParts.each((_,p)=>{
                            const t = this.HtmlUtil.htmlDecode($(p).text().trim());
                            if(t){ _data.answers.push(t); }
                        });
                    }else{
                        // 仅当无错误标记时，采集我的答案各空内容
                        if($(row).find(".myAllAnswerBx .marking_cuo").length === 0){
                            $(row).find(".myAllAnswerBx .myAnswer.marTop16").each((_,blk)=>{
                                const pText = $(blk).find("p").text().trim();
                                const cleaned = pText.replace(/^[^：]*：\s*/, "").trim();
                                const t = this.HtmlUtil.htmlDecode(cleaned);
                                if(t){ _data.answers.push(t); }
                            });
                        }
                    }

                }else if(_data.type.includes("单选题") || _data.type.includes("判断题") || _data.type.includes("多选题")){
                    let liOptions = $(row).find("ul.Zy_ulTop.qtDetail li.clearfix");
                    if(liOptions.length){
                        let optionMap = {};
                        liOptions.each((_, option)=>{
                            let letter = ($(option).find("i.fl").text().trim() || "").replace(/、.*/, "").trim();
                            let text = this.HtmlUtil.htmlDecode($(option).find("a").text().replace(/\s+/g, " ").trim());
                            if(text){ _data.options.push(text); }
                            if(letter){ optionMap[letter] = text; }
                        });
                        // 优先使用“正确答案”中的字母，其次使用“我的答案”
                        let correctLetters = ($(row).find(".correctAnswer .answerCon").text() || "").replace(/\s+/g, "").trim();
                        let myLetters = ($(row).find(".myAnswer .answerCon").text() || "").replace(/\s+/g, "").trim();
                        let answerLetters = correctLetters || myLetters;
                        if(answerLetters){
                            answerLetters.split("").forEach(ch=>{
                                if(optionMap[ch]){
                                    _data.answers.push(optionMap[ch]);
                                }
                            });
                        }
                    }else{ // 判断题：优先使用“正确答案”，否则回退到“我的答案”
                        let correctAnsText = ($(row).find(".correctAnswer .answerCon").text() || "").trim();
                        let myAnsText = ($(row).find(".myAnswer .answerCon").text() || "").trim();
                        let finalText = correctAnsText || myAnsText;
                        if(finalText){
                            _data.answers.push(this.HtmlUtil.htmlDecode(finalText));
                        }
                    }
                }
                
                if(_data != null){
                    newData.rows.push(_data);
                }
                
            });

            console.log(newData)
            return newData;
        }
        async get_quiz_result3(){
            var status = "error";
            var answers = this.reset_answer3(document);
            answers.id = this.config.workId;
            if(answers == null || JSON.stringify(answers) == '{}'){
                console.log("题库导入存在，或异常")
                return status;
            }
            let obj={
                "poolId": this.config.poolId,
                "userId":   this.config.tk_uid,
                "tags":[document.title,"超星作业"],
                "title": "cx3_"+ answers.id,
                "problems":[],
            };
            let data={};
            answers.rows.forEach(row=>{
                if(row.subject.length < 4 || row.answers == ""){
                    console.log("题目录入有误");
                    return; //跳出循环
                }
                data={
                    "tags":     ["超星"],
                    "text":     row.subject,
                    "answer":   JSON.stringify(row.answers),
                };
                data.tags.push(row.type);
                let l = ["choice_A","choice_B","choice_C","choice_D","choice_E","choice_F","choice_G","choice_H","choice_I","choice_J","choice_K","choice_L","choice_M","choice_N","choice_O","choice_P","choice_Q","choice_R","choice_S","choice_T","choice_U","choice_V","choice_W","choice_X","choice_Y","choice_Z"];
                let i=0;
                row.options.forEach(option =>{
                    data[l[i]]=option;
                    i=i+1;
                })
                obj.problems.push(data);
            });
            obj.problems = window.my.filter_problems(obj.problems);
            if(obj.problems.length == 0){
                return;
            }
            await(window.my.upladApi("/tiku/api/v1/problems",obj).then((resutData)=>{
                console.log(resutData)
                if(resutData.result=="success" && resutData.json){
                    var data = resutData.json.data;
                    GM_setValue(answers.id,1);
                    status = "success"
                }
            }));
            return status;
        }
        reset_answer3(body){
            let newData = {};
            console.log("超星题库重组中(View)");
            newData.title = $(body).find(".mark_title").text().trim() || document.title;
            newData.rows = [];
            $(body).find(".questionLi").each((_, row) => {
                let _data = {};
                _data.id = ($(row).attr("data") || $(row).attr("id") || "").replace("question","").trim();
                let markName = $(row).find("h3.mark_name");
                _data.type = markName.find(".colorShallow").text().replace(/[()]/g, "").trim();
                _data.subject = markName.find(".qtContent").text().trim();
                _data.subject = this.HtmlUtil.htmlDecode(_data.subject).substr(0,500);
                _data.options = [];
                _data.answers = [];
                let liOptions = $(row).find("ul.mark_letter li");
                let optionMap = {};
                liOptions.each((_, option) => {
                     let textFull = $(option).text().trim();
                     let dotIndex = textFull.indexOf(".");
                     let letter = "";
                     let text = "";
                     if(dotIndex > -1 && dotIndex < 5) {
                         letter = textFull.substring(0, dotIndex).trim();
                         text = textFull.substring(dotIndex + 1).trim();
                     } else {
                         text = textFull;
                     }
                     text = this.HtmlUtil.htmlDecode(text);
                     if(text) { _data.options.push(text); }
                     if(letter) { optionMap[letter] = text; }
                });
                let rightAnswerText = $(row).find(".rightAnswerContent").text().trim();
                if (rightAnswerText) {
                    if (_data.type.includes("单选题") || _data.type.includes("多选题")) {
                         rightAnswerText.split("").forEach(ch => {
                             if(optionMap[ch]) {
                                 _data.answers.push(optionMap[ch]);
                             }
                         });
                    } else if (_data.type.includes("判断题")) {
                         if ((rightAnswerText === "A" || rightAnswerText === "正确") && optionMap["A"]) _data.answers.push(optionMap["A"]);
                         else if ((rightAnswerText === "B" || rightAnswerText === "错误") && optionMap["B"]) _data.answers.push(optionMap["B"]);
                         else _data.answers.push(rightAnswerText);
                    } else {
                         _data.answers.push(rightAnswerText);
                    }
                }
                 if(_data.subject && _data.answers.length > 0){
                    newData.rows.push(_data);
                }
            });
            console.log(newData);
            return newData;
        }
        async get_quiz_result(clazzid,courseid,knowledgeid,num){
            var status = "error";
            let card = await this.get_cards(clazzid,courseid,knowledgeid,num)
            let pattern = /mArg = (\{.*\})/;
            let match = card.match(pattern);
            let work = await this.get_work(match[1])
            let WorkQuestion = await this.get_WorkQuestionYiPiYue(work.finalUrl)
            var answers = this.reset_answer(WorkQuestion);
            if(answers == null || JSON.stringify(answers) == '{}'){
                console.log("题库导入存在，或异常")
                return status;
            }
            let obj={
                "poolId": this.config.poolId,
                "userId":   this.config.tk_uid,
                "tags":[$(WorkQuestion).find("h1").find("span")[0].innerText.trim(),answers.title,"超星"],
                "title": "cx_"+ answers.id,
                "problems":[],
            };
            let data={};
            answers.rows.forEach(row=>{
                if(row.subject.length < 4 || row.answers == ""){
                    console.log("题目录入有误");
                    return; //跳出循环
                }
                data={
                    "tags":     ["超星"],
                    "text":     row.subject,
                    "answer":   JSON.stringify(row.answers),
                };
                data.tags.push(row.type);
                let l = ["choice_A","choice_B","choice_C","choice_D","choice_E","choice_F","choice_G","choice_H","choice_I","choice_J","choice_K","choice_L","choice_M","choice_N","choice_O","choice_P","choice_Q","choice_R","choice_S","choice_T","choice_U","choice_V","choice_W","choice_X","choice_Y","choice_Z"];
                let i=0;
                row.options.forEach(option =>{
                    data[l[i]]=option;
                    i=i+1;
                })
                obj.problems.push(data);
            });
            obj.problems = window.my.filter_problems(obj.problems);
            if(obj.problems.length == 0){
                return;
            }
            aner.css("display","block")
            aner.text("因api被攻击暂不支持导入题库");
            aner.append(`</br>如需请更新完整版进行更多体验`)
            aner.append("<br/>可前往<a href=\""+_this.HelpIP+"\">官网</a>安装最新脚本")
            return status;
        }
        
        HtmlUtil = { //此处由于window.my还没有加载完毕，所以提前拉进来
            /*1.用浏览器内部转换器实现html转码*/
            htmlEncode:function (html){
                //1.首先动态创建一个容器标签元素，如DIV
                var temp = document.createElement ("div");
                //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
                (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
                //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
                var output = temp.innerHTML;
                temp = null;
                return output;
            },
            /*2.用浏览器内部转换器实现html解码*/
            htmlDecode:function (text){
                //1.首先动态创建一个容器标签元素，如DIV
                var temp = document.createElement("div");
                //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
                temp.innerHTML = text;
                //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
                var output = temp.innerText || temp.textContent;
                temp = null;
                return output;
            }
        };
        reset_answer(body){
            let newData = {};
            if(!$(body).find(".Py_answer").text().includes("正确答案")){
                return console.log("并未获取到题库数据");
            }
            console.log("超星题库重组中");
            newData.id = $(body).find("#knowledgeId")[0].value;
            
            newData.title = $(body).find("#_title")[0].value;
            newData.rows = [];
            $(body).find(".imgReview").each((_,row)=>{
                let _data = {};
                _data.id = $(row).find("#moreScore").attr("data");
                row.title=this.HtmlUtil.htmlDecode($(row).find("#questionStem_"+_data.id).text().trim());
                row.title = row.title.substr(0,500) //截断前500个字符
                _data.subject = row.title;
                _data.options = [];
                _data.answers = [];
                _data.type = $(row).find("#typeName_"+_data.id)[0].value;

                let tmp_option = $(row).find("li.clearfix")
                if(tmp_option.length){//多单选择
                    tmp_option.each((_,option)=>{
                        _data.options.push(this.HtmlUtil.htmlDecode($(option).find("a").text().trim()));
                        let answers = $(row).find(".Py_answer").find("span")[0].innerText.substr(6).split("")
                        answers.forEach(answer =>{
                            if($(option).find("i").text()[0] == answer){
                                _data.answers.push(this.HtmlUtil.htmlDecode($(option).find("a").text().trim()));
                            }
                        })
                        
                    });
                }else{ //判断
                    if($(row).find(".Py_answer.Py_tk.clearfix").length){
                        _data.answers.push(this.HtmlUtil.htmlDecode($(row).find(".Py_answer.Py_tk.clearfix")[0].innerText.replace(/[\n\t ]/g, "").substr(5).trim()));
                    }else{
                        _data.answers.push(this.HtmlUtil.htmlDecode($(row).find(".Py_answer").find("span")[0].innerText.trim().substr(6).trim()));
                    }
                }
                
                if(_data != null){
                    newData.rows.push(_data);
                }
                
            });

            console.log(newData)
            return newData;
        }
        get_courses(){
            return new Promise((resolve,rejcet)=>{
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://mooc1-2.chaoxing.com/visit/courses",
                    onload: res=> {
                        resolve(res.response);
                    },
                    onerror:err=>{
                        console.log("加载失败")
                    }
                })
            })
        }
        get_studentcourse(url){
            return new Promise((resolve,rejcet)=>{
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url.replace("i.mooc","mooc1-2"),
                    onload: res=> {
                        resolve(res.response);
                    },
                    onerror:err=>{
                        console.log("加载失败")
                    }
                })
            })
        }
        get_student_specific(url){
            return new Promise((resolve,rejcet)=>{
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://mooc1-2.chaoxing.com/mooc-ans/mycourse/studentstudyAjax?"+url,
                    onload: res=> {
                        resolve(res.response);
                    },
                    onerror:err=>{
                        console.log("加载失败")
                    }
                })
            })
        }
        async upload_all_problem(show_aner){
            this.config.class_size = 0
            this.config.class_length = 0
            if(show_aner){
                aner.text("欢迎您的第一次使用，正在为您聚合数据中，请稍后。。。。");
                aner.css("display","block")
            }
            let courses = await (this.get_courses());
            if(!courses){
                return;
            }
            $(courses).find(".courseName").each(async (index,div)=>{
                let studentcourse = await this.get_studentcourse(div.href)
                if($(studentcourse).find(".clearfix").find(".openlock").length){
                    $(studentcourse).find(".clearfix").find("a").each(async (index,div)=>{
                        let arr1 = $(div)[0].href.split("?")
                        let specific =  await this.get_student_specific(arr1[1])
                        let arr2 = arr1[1].split("&");
                        let obj = {};
                        for(let i=0;i<arr2.length;i++){
                            let res = arr2[i].split("=");
                            obj[res[0]]=res[1];
                        }
                        $(specific).find("span").each(async (index,div)=>{
                            let pattern = /测验|试题|检测|考试|测试|考查|考察|考验|考题|评估|检查|检验/;
                            if(pattern.test(div.innerText)){//如果包含以上内容
                                this.config.class_length++;
                                this.config.class_size++;
                                try{
                                    await this.get_quiz_result(obj.clazzid,obj.courseId,obj.chapterId,div.attributes.class.value[1] -1)
                                    console.log(obj.chapterId+"upload成功")
                                }catch(e){
                                    console.log(e)
                                    console.log(obj.chapterId+"upload失败")
                                }
                                this.config.class_size--;
                                if(show_aner){
                                    aner.text("百分比长时间未动请刷新页面\n已加载："+Math.trunc((1-(this.config.class_size/this.config.class_length))*100)+"%");
                                }
                            }
                            
                        })
                    })
                    
                }
            })

            return
        }

        get_userid(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'post',
                    // xhrFields: {
                    //     withCredentials: true  //允许跨域发送cookies
                    // },
                    url:"http://i.chaoxing.com/base",
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        
        sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        async get_user_obj(){
            // let a = await this.get_userid()
            let name = null
            let id = null
            if($("body").find(".user").find("img")[0]){
                GM_setValue("userimg",$("body").find(".user").find("img")[0].attributes.src.value||"");
                let img_table = $(shadowContent.querySelector("#x_set"))
                img_table.css("background","url(" +  $("body").find(".user").find("img")[0].attributes.src.value||"" + ")")
    
                name = $("body").find(".user").find("h3")[0].innerText
                id = $("body").find(".user").find("img")[0].attributes.src.value.substr(28,9)
            }else if($("body").find(".zt_u_b").find("img")[0]){
                GM_setValue("userimg",$("body").find(".zt_u_b").find("img")[0].attributes.src.value||"");
                let img_table = $(shadowContent.querySelector("#x_set"))
                img_table.css("background","url(" +  GM_getValue("userimg")||"" + ")")
                name = $("body").find(".zt_u_b").find(".zt_u_name")[0].innerText
                id = $("body").find(".zt_u_b").find("img")[0].attributes.src.value.substr(34,9)
            }else{
                GM_setValue("userimg",$("body").find(".headPic").find("img")[0].attributes.src.value||"");
                let img_table = $(shadowContent.querySelector("#x_set"))
                img_table.css("background","url(" +  $("body").find(".headPic").find("img")[0].attributes.src.value||"" + ")")
                name = $("body").find(".name")[0].outerText
                id = $("body").find(".headPic").find("img")[0].attributes.src.value.substr(35,9)
            }
            if(!id){
                return
            }
            this.config.user_id = "cx_"+id;
            this.config.full_name = name;
            let obj={
                "unionid": this.config.user_id,
                "username": this.config.full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "超星",
            };
            return obj
        }
        async choice_function(){
            if(!GM_getValue("resource_farming_main_state")){
                return
            }
            for(let i=10;i;i--){
                await this.sleep(1000)
                console.log("开始检测页面内容"+i)
                let resources = []
                if($('iframe').length){
                    let videos = $('iframe').contents().find("iframe").contents().find("video")
                    for(let i = 0;i<videos.length;i++){
                        if(videos[i].src == ""){
                            console.log("空视频页跳过")
                            continue
                        }
                        resources.push(videos[i])
                    }
                    let audios = $('iframe').contents().find("iframe").contents().find("audio")
                    for(let i = 0;i<audios.length;i++){
                        if(audios[i].src == ""){
                            console.log("空音频页跳过")
                            continue
                        }
                        resources.push(audios[i])
                    }
                    let ariticles = $('iframe').contents().find("iframe").contents().find(".imglook")
                    for(let i = 0;i<ariticles.length;i++){
                        let ariticle = ariticles[i];
                        let ariticle_iframe = $(ariticle).find("iframe").contents()[0].documentElement
                        ariticle_iframe.scrollTop  = ariticle_iframe.scrollHeight
                        console.log(ariticle_iframe)
                    }
                    console.log(resources)
                }
                if(resources.length){
                    console.log("视频加载")
                    for(let i = 0;i<resources.length;i++){
                        let video = resources[i]
                        
                    video.muted = true;
                    while(1){
                            //部分禁止会直接暂停
                            // video.playbackRate = GM_getValue("video_spend")||1
                            if(video.ended||$($('iframe').contents().find(".ans-job-icon")[i]).attr("aria-label") == '任务点已完成'){
                            console.log("播放结束")
                            break;
                        }
                        // $(".playButton").click()
                        video.play()
                        // let mi  = video.duration - video.currentTime
                        // console.log(mi)
                        await this.sleep(1000)
                    }
                        continue;
                    }
                    break;
                }
            }
            try{
                $(".orientationright")[0].click()
            }catch{
                $(".jb_btn.nextChapter").click()
                //$("#prevNextFocusNext").click()
            }
            try{
                $(".nextChapter.prebutton").click()
            }catch{
                
            }
     
            // GM_setValue("resource_farming_state",false)
            this.choice_function() //再次循环
            
        }
        async sleep(delay){
            await new Promise((resolve) => setTimeout(resolve, delay))
        }
        //视频页做题实现
        async studentstudy_searcj(){
            let iframe = $('iframe').contents().find("iframe").contents().find("iframe").contents()
            let HtmlUtil = window.my.HtmlUtil;
            aner.css("display","block")
            aner.text("正在搜索中，请稍后")
            let answers = null;
            // let answers = await(window.my.getAnswers("cx_"+_this.stu_knowledgeId ,true));
            // console.log(answers)
            let subjects = []
            iframe.find(".Zy_TItle").each(function(index,div){
                let subject = $(div).text().replace(/^[^】]*】/g, '').trim();
                // 保留题干中的括号及其内容，仅去除题型标签
                subject = HtmlUtil.htmlDecode(subject);
                subject = subject
                if(subject != ""){
                    subjects.push(subject);
                }
                
            })
            console.log(subjects)
            if(this.config.tk_uid == null || (answers == null)||JSON.stringify(answers) == '{}'  || answers.rows.length <= 0){
                answers = await(window.my.findproblems(subjects));
            }
            
            if(JSON.stringify(answers) == '{}' || !(answers.rows)){
                aner.text("没有搜索到答案，若提前阅卷时有答案，但此时没有请反馈")
            }else{
                aner.text("总共搜索到"+answers.rows.length+"题")
                answers.rows.forEach(row=>{
                    aner.append("<hr>");
                    aner.append("题目:"+row.subject+"<br>"+"答案:");
                    row.answers.forEach(answer =>{        
                         aner.append(answer+" ");
                    });
                });
            }
            
            iframe.find(".TiMu").each(async function(i,div){
                let subject = subjects[i]

                if( $(div).find('.show_answer').length == 0){
                    $(div).append("<div class='show_answer'></div>")
                }
                answers.rows.forEach((row,index)=>{
                    if(row.subject == subject){
                        if(!$(div).find('.show_answer')[0].outerText){
                            $(div).find('.show_answer').append("答案："+JSON.stringify(row.answers)+"<br>").css('color','red'); // 添加答案在后方
                        }else{
                            $(div).append("第"+(i+1)+"题重复<br>").css('color','blue');
                            $(div).find('.show_answer').append("答案："+JSON.stringify(row.answers)+"<br>").css('color','red'); // 添加答案在后方
                            
                        }
                        $(div).find(".fl .after").each((index,after)=>{
                            row.answers.forEach(answer=>{
                                if(after.outerText == answer){
                                    after.click()
                                }
                            })
                        })
                    }
                });
            }) //结束
        }
        async work_search(){
            let HtmlUtil = window.my.HtmlUtil;
            aner.css("display","block")
            aner.text("正在搜索中，请稍后")
            let subjects = []
            
            $(".questionLi").each(function(index,div){
                let title = $(div).find(".mark_name");
                let type = title.find(".colorShallow").text();
                let subject = title.text().replace(type,"").trim();
                
                // Remove leading number (e.g. "1. ")
                subject = subject.replace(/^\d+[\.\、]\s*/, '').trim();
                // Remove 【】 if any
                subject = subject.replace(/^[^】]*】/g, '').trim();
                
                subject = HtmlUtil.htmlDecode(subject);
                if(subject != ""){
                    subjects.push(subject);
                }
            })
            
            console.log(subjects)
            let answers = await(window.my.getAnswers("cx3_"+this.config.workId ,true));
            
            if(JSON.stringify(answers) == '{}' || !(answers.rows) || answers.rows.length === 0){
                answers = await(window.my.findproblems(subjects));
            }
            if(JSON.stringify(answers) == '{}' || !(answers.rows)){
                aner.text("没有搜索到答案，若提前阅卷时有答案，但此时没有请反馈")
            }else{
                aner.text("总共搜索到"+answers.rows.length+"题")
                answers.rows.forEach(row=>{
                    aner.append("<hr>");
                    aner.append("题目:"+row.subject+"<br>"+"答案:");
                    row.answers.forEach(answer =>{        
                         aner.append(answer+" ");
                    });
                });
            }
            
            $(".questionLi").each(async function(i,div){
                let title = $(div).find(".mark_name");
                let type = title.find(".colorShallow").text();
                let subject = title.text().replace(type,"").trim();
                subject = subject.replace(/^\d+[\.\、]\s*/, '').replace(/^[^】]*】/g, '').trim();
                subject = HtmlUtil.htmlDecode(subject);

                if( $(div).find('.show_answer').length == 0){
                    $(div).append("<div class='show_answer'></div>")
                }
                
                answers.rows.forEach((row,index)=>{
                    // Use loose match
                    if(row.subject == subject || subject.indexOf(row.subject) != -1 || row.subject.indexOf(subject) != -1){
                        if(!$(div).find('.show_answer')[0].innerText){
                             $(div).find('.show_answer').append("答案："+JSON.stringify(row.answers)+"<br>").css('color','red');
                        }
                        
                        // Auto Click
                        let options = $(div).find(".answerBg");
                        options.each((idx, optionDiv) => {
                             let pText = $(optionDiv).find(".answer_p").text().trim();
                             pText = HtmlUtil.htmlDecode(pText);
                             
                             row.answers.forEach(answer=>{
                                 if(pText == answer || pText.trim() == answer.trim()){
                                     optionDiv.click();
                                 }
                             })
                        });
                    }
                });
            })
        }
        async start_search(){ //搜题按钮实现
            if(_this.stu_knowledgeId){
                await this.studentstudy_searcj()
            }else{
                await this.work_search()
            }
        }

    }
    /*
    *  国开2请求
    */
    class ouchn2_api{
        constructor(config) {
            this.config = config;
        }
        async init_button(){
            // (this.config.front_url[3] =="course"){
            //     GM_setValue("resource_farming_state",false) //    跨域访问，清空默认状态
            //     div_zhu.append("<button id='x_res' ><span>一键完成资源</span></button>");
            // }else 
            if(this.config.front_url[4] =="page"){
                this.choice_function()
                if(GM_getValue("resource_farming_state")){
                    div_zhu.append("<button id='x_xxx' ><span>正在刷资源，请稍后</span></button>");
                    aner.show("hide")
                    aner.text("如需暂停请刷新上一级页面")
                }else{
                    if(GM_getValue("resource_farming_main_state")){
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",false);location.reload()'><span>停止翻页</span></button>");
                        aner.show("hide")
                        aner.text("手动切换资源后请刷新页面")
                    }else{
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",true);location.reload()'><span>自动翻页</span></button>");
                    }
                }
            }else{
                div_zhu.append(`<button onclick='window.open("${this.config.HelpIP}");'><span>MeTo题库</span></button>`);
            }
        }
        async choice_function(){
            if(!GM_getValue("resource_farming_state")&&!GM_getValue("resource_farming_main_state")){
                return
            }
            // for(let i=10;i;i--){
            //     //暂时只需要进入即可
            //     await this.sleep(1000)
            // }
            
            await this.sleep(3000)
            GM_setValue("resource_farming_state",false)
            $(".newgk-next")[0].click()
            await this.choice_function()
        }
        sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        async resource_farming(){
            let course = this.config.front_url[4]
            let url = "https://lms.ouchn.cn/course/"+course+"/learning-activity/full-screen#/"
            let activity_list=[]
            let divs = $(".learning-activity")
            divs.each((index,div)=>{
                let type = $(div).find(".activity-summary").attr("ng-switch-when")
                if($(div).find(".completeness").attr("class") != "completeness full" && type != "exam"&& type != "forum" &&type != "homework"){
                    try{
                        var id = $(div).attr("id").substr(18)
                    }catch{
                        return
                    }
                    activity_list.push(id)
                }
            })
            if(activity_list.length){
                console.log(activity_list)
            }else{
                y$('#course-section')[0].click()
                console.log($("#course-section").html())
                aner.show("slow")
                aner.text("未检测到页面资源，请等待页面加载完毕。 ")
                aner.append("</br>若未展开资源，请点击全部展开。")
                $(shadowContent.querySelector("#x_res")).attr("disabled", false)
                return
            }
            aner.show("slow")
            aner.text("部分浏览器默认关闭弹出窗口，请在右上角开启")
            
            // return
            for(let i =0;i<activity_list.length;i++){
                GM_setValue("resource_farming_state",true)
                let childwindow = window.open(url+activity_list[i], "_blank")
                while(1){
                    if(GM_getValue("resource_farming_state")){
                        $(shadowContent.querySelector("#x_res")).text("剩余"+(activity_list.length - i)+"资源")
                        await this.sleep(1000)
                    }else{
                        childwindow.close()
                        break
                    }
                }
                
            }
            $(shadowContent.querySelector("#x_res")).text("全部完成")
        }
        get_userid(){
            let user_inf = sessionStorage.getItem("oidc.user:https://passport.syxy.ouchn.cn/:AllInOneStudentSpace")
            return JSON.parse(user_inf)
        }
        async get_user_obj(){
            let user_inf = this.get_userid()
            console.log(user_inf)
            if(!user_inf){
                return
            }
            this.config.user_id = "gksy_"+user_inf.profile.UserId
            this.config.full_name = user_inf.profile.Name;
            let obj={
                "unionid": this.config.user_id,
                "username": this.config.full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "国开",
            };
            return obj
        }
    }
    /*
    *  国开请求
    */
    class ouchn_api{
        constructor(config) {
            this.config = config;
        }
        async init_button(){
            if(this.config.front_url[5] =="ng#" ||this.config.front_url[5] =="ng" ){
                GM_setValue("resource_farming_state",false) //    跨域访问，清空默认状态
                div_zhu.append("<button id='x_res' ><span>一键完成资源</span></button>");
            }else if(this.config.front_url[5] =="learning-activity"){
                this.choice_function()
                if(GM_getValue("resource_farming_state")){
                    div_zhu.append("<button id='x_xxx' ><span>正在刷资源，请稍后</span></button>");
                    aner.show("hide")
                    aner.text("如需暂停请刷新上一级页面")
                }else{
                    if(GM_getValue("resource_farming_main_state")){
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",false);location.reload()'><span>停止翻页</span></button>");
                        aner.show("hide")
                        aner.text("手动切换资源后请刷新页面")
                    }else{
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",true);location.reload()'><span>自动翻页</span></button>");
                    }
                }
            }else if(this.config.front_url[6]=="submission"){
                // div_zhu.append("<button id='x_start' ><span>开始搜题</span></button>");
                aner.css("display","block")
                aner.text("因api被攻击暂不支持导入题库");
                aner.append(`</br>如需请更新完整版进行更多体验`)
                aner.append("<br/>可前往<a href=\""+_this.HelpIP+"\">官网</a>安装最新脚本")
            }else{
                div_zhu.append(`<button onclick='window.open("${this.config.HelpIP}");'><span>MeTo题库</span></button>`);
            }
        }

        get_submission(exam,submission){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url:"https://lms.ouchn.cn/api/exams/"+exam+"/submissions/"+submission,
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }

        async get_quiz_result(exams,submissions){
            let res = await (this.get_submission(exams,submissions));
            var status = "error";
            let answers = this.reset_answer(res);
            answers.title = GM_getValue(examId)||"未命名试卷"
            if(answers == null || JSON.stringify(answers) == '{}' ){
                return status;
            }
            let obj={
                "poolId": this.config.poolId,
                "userId":   this.config.tk_uid,
                "tags":[answers.title,"国开"],
                "title":"gk_"+submissions,
                "problems":[],
            };
            let data={};
            
            answers.rows.forEach(row=>{
                if(row.subject.length < 4 || row.answers == ""){
                    console.log("题目录入有误:");
                    console.log(row);
                    return; //跳出循环
                }
                data={
                    "tags":     ["国开"],
                    "text":     row.subject,
                    "answer":   JSON.stringify(row.answers),
                };
                data.tags.push(row.type);
                let l = ["choice_A","choice_B","choice_C","choice_D","choice_E","choice_F","choice_G","choice_H","choice_I","choice_J","choice_K","choice_L","choice_M","choice_N","choice_O","choice_P","choice_Q","choice_R","choice_S","choice_T","choice_U","choice_V","choice_W","choice_X","choice_Y","choice_Z"];
                let i=0;
                row.options.forEach(option =>{
                    data[l[i]]=option;
                    i=i+1;
                })
                obj.problems.push(data);
            });
            if(obj.problems.length == 0){
                return;
            }
            aner.css("display","block")
            aner.text("因api被攻击暂不支持导入题库");
            aner.append(`</br>如需请更新完整版进行更多体验`)
            aner.append("<br/>可前往<a href=\""+_this.HelpIP+"\">官网</a>安装最新脚本")
            return status;
        }

        reset_answer(data){
            let newData = {};
            if(data ==null){
                return console.log("并未获取到题库数据");
            }
            if("subjects_data" in data){
                console.log("国开题库重组中");
                console.log(data)
                let subjects = data.subjects_data.subjects;
                let submission_score_data = data.submission_score_data;
                let submission_data = data.submission_data;
                newData.title = "暂无";
                newData.rows = [];
                subjects.forEach(row=>{
                    let _data = {};
                    _data.id = row.id;
                    let imgs =null;
                    try{
                        imgs = $.parseHTML(row.description); // 去除特殊字符报错
                    }catch (e){
                        console.log(e);
                    }
                    row.description=window.my.HtmlUtil.htmlDecode(row.description);
                    if(imgs){
                        imgs.forEach(async function(img,index){
                            if(img.localName == "img"){
                                row.description += img.outerHTML;
                            }
                        })
                    }
                    // row.subject = row.subject.substr(0,500) //截断前500个字符
                    _data.subject = row.description;
                    _data.options = [];
                    _data.answers = [];
                    _data.type = row.type;
                    let tmp_option =null;
                    // if(row.options.length){
                    //     tmp_option =  JSON.parse(row.options)
                    // }
                    // if(tmp_option){
                    row.options.forEach(option=>{
                        _data.options.push(window.my.HtmlUtil.htmlDecode(option.content).trim());
                        if(option.is_answer){
                            _data.answers.push(window.my.HtmlUtil.htmlDecode(option.content).trim());
                        }else if(!("is_answer" in option)){ //如果不包含这个值 则判断用户选择
                            if(!submission_score_data || submission_score_data == "0"){
                                return;
                            }
                            if(submission_score_data[_data.id] == row.point){//如果用户答案正确
                                submission_data.subjects.forEach(element => {
                                    if(element.answers){ //填空题
                                        element.answers.forEach(answer =>{
                                                _data.answers.push(window.my.HtmlUtil.htmlDecode(answer.content).trim());
                                        })
                                    }else{ //选择题
                                        element.answer_option_ids.forEach(answer_id =>{
                                            if(option.id == answer_id){
                                                _data.answers.push(window.my.HtmlUtil.htmlDecode(option.content).trim());
                                            }
                                        })
                                    }
                                });
                            }
                        }
                    });
                    if(_data != null && _data.answers.length){
                        newData.rows.push(_data);
                    }
                    
                });
            }else{
                console.log(data);
            }
            console.log(newData)
            return newData;
        }

        get_userid(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url:"https://lms.ouchn.cn/user/settings",
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        // get_user_inf(){
        //     return new Promise((resolve,rejcet)=>{
        //         $.ajax({
        //             type: 'GET',
        //             xhrFields: {
        //                 withCredentials: true  //允许跨域发送cookies
        //             },
        //             url:"https://lms.ouchn.cn/api/user/20000797261/accounts",
        //             success: function(res) {
        //                 resolve(res[0]);
        //             }
        //         });
        //     });
        // }
        async get_user_obj(){
            // let a = await this.get_userid()
            // a = $(a)
            // eval(a.find("script")[0])
            // console.log(globalData)
            // let user_inf = await(this.get_user_inf());
            // if(!user_inf){
            //     return;
            // }
            // console.log(user_inf)
            let user_inf = _this.globalData.user
            // GM_setValue("userimg",user_inf.avatarUrl||"");
            // let img_table = $(shadowContent.querySelector("#x_set"))
            // img_table.css("background","url(" +  user_inf.avatarUrl||"" + ")")
            this.config.user_id = "gk_"+user_inf.id
            this.config.full_name = user_inf.name;
            let obj={
                "unionid": this.config.user_id,
                "username": this.config.full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "国开",
            };
            return obj
        }

        get_activity_reads(course){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url:"https://lms.ouchn.cn/api/course/"+course+"/activity-reads-for-user",
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        get_completeness(course){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url:"https://lms.ouchn.cn/api/course/"+course+"/my-completeness",
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        get_models(course){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url:"https://lms.ouchn.cn/api/courses/"+course+"/modules",
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        get_all_activities(course,str){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url:"https://lms.ouchn.cn/api/course/"+course+"/all-activities?module_ids="+str,
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        async choice_function(){
            if(!GM_getValue("resource_farming_state")&&!GM_getValue("resource_farming_main_state")){
                return
            }
            for(let i=10;i;i--){
                console.log($(".activity-content").text().length)
                await this.sleep(1000)
                if($(".activity-content").find(".text-too-long").length){
                    console.log("检测到ppt按钮")
                    $(".activity-content").find(".text-too-long").click()
                    break;
                }else if($(".join-button").length){
                    console.log("课堂直播")
                    break;
                }else if($("video").length&&$("video")[0].duration){
                    console.log("视频加载")
                    let video = $("video")[0]
                    video.muted = true;
                    while(1){
                        if(video.ended){
                            break;
                        }
                        $(".mvp-fonts-play").click()
                        // let mi  = video.duration - video.currentTime
                        // console.log(mi)
                        await this.sleep(1000)
                    }
                    
                    break;
                }else if($(".activity-content").find(".page-box").length){
                    console.log("文章加载")
                    break;
                }else if($(".exam-activity-box").length){
                    console.log("测试题加载")
                    await this.sleep(1000)//测试题box加载过快，可能导致没有下一个
                    break;
                }
                
                
                
            }
            
            await this.sleep(3000)
            GM_setValue("resource_farming_state",false)
            $(".next-btn").click()
            await this.choice_function()
        }
        sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        async resource_farming(){
            let course = this.config.front_url[4]
            let url = "https://lms.ouchn.cn/course/"+course+"/learning-activity/full-screen#/"
            let activity_list=[]
            let divs = $(".learning-activity")
            divs.each((index,div)=>{
                let type = $(div).find(".activity-summary").attr("ng-switch-when")
                if($(div).find(".completeness").attr("class") != "completeness full" && type != "exam"&& type != "forum" &&type != "homework"){
                    try{
                        var id = $(div).attr("id").substr(18)
                    }catch{
                        return
                    }
                    activity_list.push(id)
                }
            })
            if(activity_list.length){
                console.log(activity_list)
            }else{
                y$('#course-section')[0].click()
                console.log($("#course-section").html())
                aner.show("slow")
                aner.text("未检测到页面资源，请等待页面加载完毕。 ")
                aner.append("</br>若未展开资源，请点击全部展开。")
                $(shadowContent.querySelector("#x_res")).attr("disabled", false)
                return
            }
            aner.show("slow")
            aner.text("部分浏览器默认关闭弹出窗口，请在右上角开启")
            
            // return
            for(let i =0;i<activity_list.length;i++){
                GM_setValue("resource_farming_state",true)
                let childwindow = window.open(url+activity_list[i], "_blank")
                while(1){
                    if(GM_getValue("resource_farming_state")){
                        $(shadowContent.querySelector("#x_res")).text("剩余"+(activity_list.length - i)+"资源")
                        await this.sleep(1000)
                    }else{
                        childwindow.close()
                        break
                    }
                }
                
            }
            $(shadowContent.querySelector("#x_res")).text("全部完成")
        }
    }
    /*
    *  meto请求
    */
    class meto_api{
        constructor(config) {
            this.config = config;
        }
        get_user_inf(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url:"/api/user",
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        async get_user_obj(){
            let user_inf = await(this.get_user_inf());
            if(!user_inf){
                return;
            }
            GM_setValue("token_num",user_inf.num);
            this.config.tk_uid = user_inf.id;
            this.config.pp = user_inf.sal;
            this.config.user_id = user_inf.user.email
            this.config.poolId = CryptoJS.MD5(CryptoJS.MD5(this.config.user_id).toString() + this.config.pp).toString();
            this.config.poolId = this.config.poolId.slice(0,8)+"-"+this.config.poolId.slice(8,12)+"-"+this.config.poolId.slice(12,16)+"-"+this.config.poolId.slice(16,20)+"-"+this.config.poolId.slice(20,32)
            GM_setValue("poolId",this.config.poolId);
            GM_setValue("ti_uid",this.config.tk_uid);
            GM_setValue("pp",this.config.pp);
            
            // GM_setValue("userimg",user_inf.avatarUrl||"");
            // let img_table = $(shadowContent.querySelector("#x_set"))
            // img_table.css("background","url(" +  user_inf.avatarUrl||"" + ")")
            
            this.config.full_name = user_inf.name;
            let obj={
                "unionid": this.config.user_id,
                "username": "",
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "meto",
            };
            return obj
        }
    }
    /*
    *  智慧职教ai请求
    */
    class icveai_api{
        constructor(config) {
            this.config = config;
            setInterval(()=> {
                if(this.config.url != window.location.href){
                    location.reload()
                }
            }, 400)
        }
        sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        async init_button(){
            if (this.config.front_url.at(-1) == "kcnr"){
                this.choice_function()
                if(GM_getValue("resource_farming_main_state")){
                    div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",false);location.reload()'><span>停止翻页</span></button>");
                    aner.show("hide")
                    aner.text("手动切换资源后，需刷新本页面")
                }else{
                    div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",true);location.reload()'><span>自动翻页</span></button>");
                }
            }else{
                div_zhu.append(`<button onclick='window.open("${this.config.HelpIP}");'><span>MeTo题库</span></button>`);
            }
        }
        async choice_function(){
            if(!GM_getValue("resource_farming_main_state")){
                return
            }
            await this.sleep(2000)
            y$("i:not(.zhankai).jiantou ").click()
            await this.sleep(2000)
            let zylist = y$(".node")
            zylist = zylist.filter(v=>zylist[v].id)
            if(zylist.length == 0){
                aner.show("slow")
                aner.text("未检测到页面资源，请等待页面加载完毕。 ")
                aner.append("</br>若未展开资源，请点击全部展开。")
                //展开资源
                return
            }
            for(let i=0;i<zylist.length;i++){
                if(y$(zylist[i]).find(".wc").length){
                    continue
                }
                y$(zylist[i]).find(".title").click()
                console.log("剩余"+(zylist.length - i)+"资源")
                
                for(let i=10;i;i--){
                    await this.sleep(1000)
                    if (y$("video")[0] && y$("video")[0].duration) {
                        console.log("视频加载")
                        y$(".el-message-box .el-button--primary").click()
                        let video = $("video")[0]
                        video.play()
                        document.hasFocus = () => {
                            return true
                        }
                        await this.sleep(2000)
                        while (1) {
                            if (video.ended) {
                                console.log("视频播放完成")
                                break;
                            }
                            video.play()
                            video.muted = true;
                            await this.sleep(1000)
                        }
                        break
                    }else if(y$(".page button").length){
                        while(y$(".page button").text().includes("下一页")){
                            let pageNum = y$(".page").text().replace(/[^0-9]/ig, "")
                            let mid = Math.floor(pageNum.length /2)
                            if(pageNum.substring(0,mid) == pageNum.substring(mid)){
                                break
                            }
                            y$(".page button").each((index,div)=>{
                                if(div.textContent.trim() == '下一页'){
                                    div.click()
                                }
                            })
                            await this.sleep(1000)
                        }
                        break
                    }else if(y$(".shiti").length){
                        //试题直接跳过
                        break
                    }
                }
            }
            
            
        }
        get_user_inf(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },

                    headers: {
                        "Authorization":"Bearer "+this.getCookie("admin-token"),
                    },
                    url:"https://ai.icve.com.cn/prod-api/system/baseUser/info",
                    success: function(res) {
                        resolve(res.data);
                    }
                });
            });
        }
        async get_user_obj(){
            let user_inf={}
            user_inf =  await(this.get_user_inf());
            if(!user_inf){
                return;
            }
            console.log(user_inf)
            let avatarUrl = user_inf.avatarUrl || user_inf.avatar||""
            GM_setValue("userimg",avatarUrl);
            let img_table = $(shadowContent.querySelector("#x_set"))
            img_table.css("background","url(" +  avatarUrl + ")")
            this.config.user_id = "icveai_"
            this.config.user_id += user_inf.id||user_inf.userId||user_inf.Id;
            this.config.full_name = user_inf.displayName|| user_inf.nickName||user_inf.DisplayName;
            let obj={
                "unionid": this.config.user_id,
                "username": this.config.full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "智慧职教ai",
            };
            return obj
        }
        getCookie(objName) {   //获取指定名称的cookie的值
            var arrStr = document.cookie.split("; ");
            for (var i = 0; i < arrStr.length; i++) {
              var temp = arrStr[i].split("=");
              if (temp[0] == objName) return temp[1];  //解码
            }
            return "";
        }
    }
    /*
    *  智慧职教2请求
    */
    class icve2_api{
        constructor(config) {
            this.config = config;
            setInterval(()=> {
                if(this.config.url != window.location.href && this.config.front_url.at(-1)!= "spocjobTest"){
                    location.reload()
                }
            }, 400)
        }
        sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        async init_button(){
            // if(this.config.front_url[this.config.front_url.length-1].includes("spoccourseIndex")){ //暂未实现 留置
            //     GM_setValue("resource_farming_state",false) //    跨域访问，清空默认状态
            //     div_zhu.append("<button id='x_res' ><span>一键完成资源</span></button>");
            // } else 
            if (this.config.front_url[this.config.front_url.length - 1] == "courseware"){
                this.choice_function()
                if(GM_getValue("resource_farming_state")){
                    div_zhu.append("<button id='x_xxx' ><span>正在刷资源，请稍后</span></button>");
                    aner.show("hide")
                    aner.text("如需暂停请刷新上一级页面")
                }else{
                    if(GM_getValue("resource_farming_main_state")){
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",false);location.reload()'><span>停止翻页</span></button>");
                        aner.show("hide")
                        aner.text("手动切换资源后，需刷新本页面")
                    }else{
                        div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",true);location.reload()'><span>自动翻页</span></button>");
                    }
                }
            }else{
                div_zhu.append(`<button onclick='window.open("${this.config.HelpIP}");'><span>MeTo题库</span></button>`);
            }
        }
        async resource_farming(){
            let activity_list=[]
            y$(".ziProgress").each((index,div)=>{
                try{
                    let status = div.innerHTML.trim()
                    if( status!="已学：100%"){
                        activity_list.push(div.parentNode.id || div.parentNode.parentNode.id)
                    }
                }catch{}
            })

            if(activity_list.length){
                console.log(activity_list)
            }else{
                aner.show("slow")
                aner.text("未检测到页面资源，请等待页面加载完毕。 ")
                aner.append("</br>若未展开资源，请等待全部展开。")
                aner.append("</br>或者进入教学内容页面，再次点击。")
                
                $(shadowContent.querySelector("#x_res")).attr("disabled", false)
                if(y$(".iChild").length){
                    y$(".iChild").click()
                }else{
                    y$(".items").click()
                }
                return
            }
            aner.show("slow")
            aner.text("部分浏览器默认关闭弹出窗口，请在右上角开启")
            
            // return
            for(let i =0;i<activity_list.length;i++){
                GM_setValue("resource_farming_state",true)
                window.open("https://zjy2.icve.com.cn/study/v2/coursePreview/spoccourseIndex/courseware?id="+activity_list[i])
                while(1){
                    if(GM_getValue("resource_farming_state")){
                        $(shadowContent.querySelector("#x_res")).text("剩余"+(activity_list.length - i)+"资源")
                        await this.sleep(1000)
                    }else{
                        break
                    }
                }
                
            }
            $(shadowContent.querySelector("#x_res")).text("全部完成")
        }
        async choice_function(){
            if(!GM_getValue("resource_farming_state")&&!GM_getValue("resource_farming_main_state")){
                return
            }
            for(let i=10;i;i--){
                await this.sleep(1000)
                if ($("video")[0] && $("video")[0].duration) {
                    console.log("视频加载")
                    y$(".el-message-box .el-button--primary").click()
                    let video = $("video")[0]
                    console.log(video)
                    video.play()
                    document.hasFocus = () => {
                        return true
                    }
                    await this.sleep(2000)
                    while (1) {
                        if (video.ended) {
                            break;
                        }
                        video.play()
                        video.muted = true;
                        await this.sleep(1000)
                    }
                    break
                }else if(y$(".page button").length){
                    while(y$(".page button").text().includes("下一页")){
                        let pageNum = y$(".page").text().replace(/[^0-9]/ig, "")
                        let mid = Math.floor(pageNum.length /2)
                        if(pageNum.substring(0,mid) == pageNum.substring(mid)){
                            break
                        }
                        y$(".page button").each((index,div)=>{
                            if(div.textContent.trim() == '下一页'){
                                div.click()
                            }
                        })
                        await this.sleep(1000)
                    }
                    break
                }
            }
            if (GM_getValue("resource_farming_state")) {
                GM_setValue("resource_farming_state", false)
                window.close();
            }else{
                if(y$(".next .el-link--inner").text() == '暂无'){
                    alert("请手动切换下一个章节")
                }
                y$(".next .el-link--inner").click()
                this.choice_function()
            }
        }
        get_user_inf(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },

                    headers: {
                        "Authorization":"Bearer "+this.getCookie("Token"),
                    },
                    url:"https://zjy2.icve.com.cn/prod-api/system/user/getInfo",
                    success: function(res) {
                        resolve(res.user);
                    }
                });
            });
        }
        async get_user_obj(){
            let user_inf={}
            if (_this._UID_){
                user_inf.id = _this._UID_;
                user_inf.displayName = _this._TRUENAME_;
            }else{
                user_inf =  await(this.get_user_inf());
                if(!user_inf){
                    return;
                }
            }
            console.log(user_inf)
            let avatarUrl = user_inf.avatarUrl || user_inf.avatar||""
            GM_setValue("userimg",avatarUrl);
            let img_table = $(shadowContent.querySelector("#x_set"))
            img_table.css("background","url(" +  avatarUrl + ")")
            this.config.user_id = "icve2_"
            this.config.user_id += user_inf.id||user_inf.userId||user_inf.Id;
            this.config.full_name = user_inf.displayName|| user_inf.nickName||user_inf.DisplayName;
            let obj={
                "unionid": this.config.user_id,
                "username": this.config.full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "智慧职教2",
            };
            return obj
        }
        getCookie(objName) {   //获取指定名称的cookie的值
            var arrStr = document.cookie.split("; ");
            for (var i = 0; i < arrStr.length; i++) {
              var temp = arrStr[i].split("=");
              if (temp[0] == objName) return temp[1];  //解码
            }
            return "";
        }
    }
    /*
    *  智慧职教请求
    */
    class icve_api{
        constructor(config) {
            this.config = config;
            setInterval(()=> {
                if(this.config.url != window.location.href && this.config.front_url.at(-1)!= "spocjobTest"){
                    location.reload()
                }
            }, 400)
        }
        async init_button(){
            if(this.config.front_url[this.config.front_url.length-1] == "keepTest"||this.config.front_url[this.config.front_url.length-1] =="jobTest"){ //
                // this.Listener();
                div_zhu.append("<button id='x_start' ><span>开始搜题</span></button>");
            }else if(this.config.front_url[this.config.front_url.length-1] =="course-learning"){ //暂未实现 留置
                div_zhu.append("<button id='x_res' ><span>一键完成资源</span></button>");
            }else if(this.config.front_url[this.config.front_url.length-1] == "viewJob1"){ //旧版，似乎还有在用。
                aner.css("display","block")
                aner.text("正在导入题库中");
                let examId = this.config.examId||this.config.id;
                let taskId = this.config.recordId||this.config.taskId;
                if(!GM_getValue(examId+taskId)){
                    let flag =  await(this.get_quiz_result(examId,taskId,"独立导入"));

                    
                }else{
                    aner.text("题库已存在");
                }
            }else if(this.config.front_url[this.config.front_url.length-1] == "examrecord_recordDetail.action"){
                aner.css("display","block")
                aner.text("正在导入题库中");
                let recordId = this.config.recordId;
                if(!GM_getValue(recordId)){
                    let flag =  await(this.get_new_quiz_result(recordId));

                }else{
                    aner.text("题库已存在");
                }
            }else if(this.config.front_url[this.config.front_url.length-2] == "templateeight"){
                this.choice_function()
                if(GM_getValue("resource_farming_main_state")){
                    div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",!1);location.reload()'><span>停止翻页</span></button>");
                }else{
                    div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",!0);location.reload()'><span>自动翻页</span></button>");
                }
            }else{
                div_zhu.append(`<button onclick='window.open("${this.config.HelpIP}");'><span>MeTo题库</span></button>`);
            }
        }
        sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        async choice_function(){
            if(!GM_getValue("resource_farming_main_state")){
                return
            }
            var divIframe
            for(let i=10;i;i--){
                
                console.log(i)
                await this.sleep(1000)
                divIframe = $("iframe").contents()
                divIframe.find(".done_icon_show").remove()
                let videoIframe = $("iframe").contents().find("iframe").contents()
                if($(videoIframe).find("video").length&&$(videoIframe).find("video")[0].duration){
                    console.log("视频加载")
                    let video = $(videoIframe).find("video")[0]
                    video.muted = true;
                    while(1){
                        if(video.ended){
                            console.log("视频播放结束")
                            break;
                        }
                        $(videoIframe).find(".coursespace.screen-player-btn-icon.icon-play-sp-fill").click()
                        await this.sleep(1000)
                    }
                    break;
                }
            }
            divIframe.find(".item_done_pos")[1].click()
            this.choice_function()
        }
        get_user_inf(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    
                    headers: {
                        "Authorization":"Bearer "+this.getCookie("Token"),
                    },
                    url:"https://zyk.icve.com.cn/prod-api/system/user/getInfo",
                    success: function(res) {
                        resolve(res.user);
                    }
                });
            });
        }
        get_user_inf1(){ //https://www.icve.com.cn/
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    url:"https://www.icve.com.cn/studycenter/PersonalInfo/getUserInfo",
                    success: function(res) {
                        resolve(res.userInfo);
                    }
                });
            });
        }
        get_user_inf2(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },

                    headers: {
                        "Authorization":"Bearer "+this.getCookie("zhzj-Token"),
                    },
                    url:"https://www.icve.com.cn/prod-api/getInfo",
                    success: function(res) {
                        resolve(res.data.user);
                    }
                });
            });
        }
        getCookie(objName) {   //获取指定名称的cookie的值
            var arrStr = document.cookie.split("; ");
            for (var i = 0; i < arrStr.length; i++) {
              var temp = arrStr[i].split("=");
              if (temp[0] == objName) return temp[1];  //解码
            }
            return "";
        }
        async get_user_obj(){
            let user_inf={}
            if (_this._UID_){
                user_inf.id = _this._UID_;
                user_inf.displayName = _this._TRUENAME_;
            }else{
                user_inf =  await(this.get_user_inf());
                if(!user_inf){
                    user_inf = await(this.get_user_inf2());

                    if(!user_inf){
                        user_inf = await(this.get_user_inf1());
                        if(!user_inf){
                            return
                        }
                    }
                }
            }
            console.log(user_inf)
            let avatarUrl = user_inf.avatarUrl || user_inf.avatar||""
            GM_setValue("userimg",avatarUrl);
            let img_table = $(shadowContent.querySelector("#x_set"))
            img_table.css("background","url(" +  avatarUrl + ")")
            this.config.user_id = "icve_"
            this.config.user_id += user_inf.id||user_inf.userId||user_inf.Id;
            this.config.full_name = user_inf.displayName|| user_inf.nickName||user_inf.DisplayName;
            let obj={
                "unionid": this.config.user_id,
                "username": this.config.full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "智慧职教",
            };
            return obj
        }

        personResult(examId,taskId){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    headers: {
                        "Authorization":"Bearer "+this.getCookie("Token"),
                    },
                    url:"https://zyk.icve.com.cn/prod-api/teacher/taskExamProblemRecord/examRecordPaperList?examId="+examId+"&taskId="+taskId+"&groupId=0",
                    dataType:"json",
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        join_class(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    headers: {
                        "Authorization":"Bearer "+this.getCookie("Token"),
                    },
                    url:"https://zyk.icve.com.cn/prod-api/teacher/courseList/myCourseList?pageNum=1&pageSize=6&flag=1",
                    dataType:"json",
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }

        get_Paper(recordId){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'POST',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    // headers: {
                    //     "Authorization":"Bearer "+this.getCookie("Token"),
                    // },
                    data:{
                        recordId:recordId,
                    },
                    url:"https://spoc-exam.icve.com.cn/student/exam/examrecord_getRecordPaperStructure.action",
                    dataType:"json",
                    success: function(res) {
                        resolve(res.data);
                    }
                });
            });
        }
        
        get_RecordContent(recordId,examBatchId,contentIds){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'POST',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    data:{
                        recordId:recordId,
                        examBatchId:examBatchId,
                        contentIds:contentIds
                    },
                    url:"https://spoc-exam.icve.com.cn/student/exam/examrecord_getRecordContentByPage.action",
                    dataType:"json",
                    success: function(res) {
                        resolve(res.data);
                    }
                });
            });
        }
        reset_new_answer(data,ids){
            let newData = {};
            if(data ==null){
                return console.log("并未获取到题库数据");
            }
            console.log("智慧职教题库重组中");
            newData.rows = [];
            ids.forEach(dex=>{
                let _data = {};
                if(!data[dex]){
                    return;
                }
                _data.id = dex;
                let row = data[dex].contentHtml;
                let imgs =null;
                try{
                    imgs = $(row).find(".answerOption");
                    imgs.find('.exam_answers').remove()
                    _data.subject=imgs.find("span").text();
                    if(!imgs.length){
                        imgs = $(row).find(".divQuestionTitle"); // 去除特殊字符报错
                        imgs.find('[name="questionIndex"]').remove()
                        imgs.find('.q_score').remove()
                        _data.subject=imgs.text().slice(1);
                    }
                }catch (e){
                    console.log(e);
                }
                if(imgs){ 
                    imgs.find("img").each(function(index,img){
                        if(img.localName == "img"){
                            _data.subject += img.outerHTML;
                        }
                    })
                }
                console.log(_data.subject)
                // row.subject = row.subject.substr(0,500) //截断前500个字符
                _data.options = [];
                _data.answers = [];
                let tmp_option = $(row).find(".q_option_readonly")
                if($(row).find('[name="rightAnswer"]').length){ //选择官方正确答案
                    let indexs = $(row).find('[name="rightAnswer"]').text().split("")
                    tmp_option.each((_,option)=>{
                        if(option.outerText.slice(2)){ // 判断题过滤
                                    _data.options.push(window.my.HtmlUtil.htmlDecode(option.outerText.slice(2)));
                                }else{
                                    _data.options.push(window.my.HtmlUtil.htmlDecode(option.outerText));
                                }
                        indexs.forEach(index=>{
                            if(option.outerText[0] == index){
                                if(option.outerText.slice(2)){ // 判断题过滤
                                    _data.answers.push(window.my.HtmlUtil.htmlDecode(option.outerText.slice(2)));
                                }else{
                                    _data.answers.push(window.my.HtmlUtil.htmlDecode(option.outerText));
                                }
                            }
                        })
                    })
                }else if($(row).find('.icon_examright').length){//自填写的正确答案
                    if($(row).find(".fillblank_answer").length){ //填空
                        $(row).find('.fillblank_answer').each((_,ans)=>{
                            if($(ans).find('.icon_examright').length){ //暂未验证，先去吃饭了。
                                _data.answers.push(window.my.HtmlUtil.htmlDecode(ans.outerText));
                            }
                        })
                    }else if($(row).find('[name="stuAnswer"]').length){
                        let indexs = $(row).find('[name="stuAnswer"]').text().split("")
                        tmp_option.each((_,option)=>{
                            if(option.outerText.slice(2)){ // 判断题过滤
                                        _data.options.push(window.my.HtmlUtil.htmlDecode(option.outerText.slice(2)));
                                    }else{
                                        _data.options.push(window.my.HtmlUtil.htmlDecode(option.outerText));
                                    }
                            indexs.forEach(index=>{
                                if(option.outerText[0] == index){
                                    if(option.outerText.slice(2)){ // 判断题过滤
                                        _data.answers.push(window.my.HtmlUtil.htmlDecode(option.outerText.slice(2)));
                                    }else{
                                        _data.answers.push(window.my.HtmlUtil.htmlDecode(option.outerText));
                                    }
                                }
                            })
                        })
                    }else{
                        _data=null;
                    }
                }else if($(row).find('.exam_rightAnswer').length){//填空正确
                    $(row).find(".exam_rightAnswer").find('.fillblank_answer').each((_,ans)=>{
                            _data.answers.push(window.my.HtmlUtil.htmlDecode(ans.outerText));
                    })
                }
                
                if(_data != null){
                    newData.rows.push(_data);
                }
                
            });
            console.log(newData)
            return newData;
        }

        async get_new_quiz_result(recordId){
            let res = await (this.get_Paper(recordId));
            var status = "error";
            console.log(res)
            let contentIds = ""
            let ids = [];
            res.contentList.forEach(row=>{
                contentIds +=row.id+",";
                ids.push(row.id)
            })
            let RecordContent = await this.get_RecordContent(recordId,res.examBatchId,contentIds)
            let answers = this.reset_new_answer(RecordContent,ids);
            answers.title = res.paperName
            if(answers == null || JSON.stringify(answers) == '{}' ){
                return status;
            }
            let obj={
                "poolId": this.config.poolId,
                "userId":   this.config.tk_uid,
                "tags":[answers.title,"new智慧职教"],
                "title":"zhzj_"+res.paperId,
                "problems":[],
            };
            let data={};
            
            answers.rows.forEach(row=>{
                if(row.subject.length < 4 || row.answers == ""){
                    console.log("题目录入有误");
                    return; //跳出循环
                }
                data={
                    "tags":     ["智慧职教"],
                    "text":     row.subject,
                    "answer":   JSON.stringify(row.answers),
                };
                // data.tags.push(row.type);
                let l = ["choice_A","choice_B","choice_C","choice_D","choice_E","choice_F","choice_G","choice_H","choice_I","choice_J","choice_K","choice_L","choice_M","choice_N","choice_O","choice_P","choice_Q","choice_R","choice_S","choice_T","choice_U","choice_V","choice_W","choice_X","choice_Y","choice_Z"];
                let i=0;
                row.options.forEach(option =>{
                    data[l[i]]=option;
                    i=i+1;
                })
                obj.problems.push(data);
            });
            if(obj.problems.length == 0){
                return;
            }
            console.log(obj)
            aner.css("display","block")
            aner.text("因api被攻击暂不支持导入题库");
            aner.append(`</br>如需请更新完整版进行更多体验`)
            aner.append("<br/>可前往<a href=\""+_this.HelpIP+"\">官网</a>安装最新脚本")
            return status;
        }

        async get_quiz_result(examId,taskId,courseId){
            if(!classname){
                let classListData = await (this.join_class());
                if(!classListData){
                    return;
                }
                classListData.rows.forEach(course=>{
                    GM_setValue(course.courseId,course.courseName);//对应课名
                })
                var classname = GM_getValue("clazz_course_id")
                if(!classname){
                    classname = courseId;
                }
            }
            let res = await (this.personResult(examId,taskId));
            var status = "error";
            // if(res.result_code != 0){
            //      return alert(res.result_msg);
            // }
            let answers = this.reset_answer(res);
            answers.title = GM_getValue(examId)||"未命名试卷"
            if(answers == null || JSON.stringify(answers) == '{}' ){
                return status;
            }
            let obj={
                "poolId": this.config.poolId,
                "userId":   this.config.tk_uid,
                "tags":[classname,answers.title,"智慧职教"],
                "title":"zhzj_"+answers.id,
                "problems":[],
            };
            let data={};
            
            answers.rows.forEach(row=>{
                if(row.subject.length < 4 || row.answers == ""){
                    console.log("题目录入有误");
                    return; //跳出循环
                }
                data={
                    "tags":     ["智慧职教"],
                    "text":     row.subject,
                    "answer":   JSON.stringify(row.answers),
                };
                data.tags.push(row.type);
                let l = ["choice_A","choice_B","choice_C","choice_D","choice_E","choice_F","choice_G","choice_H","choice_I","choice_J","choice_K","choice_L","choice_M","choice_N","choice_O","choice_P","choice_Q","choice_R","choice_S","choice_T","choice_U","choice_V","choice_W","choice_X","choice_Y","choice_Z"];
                let i=0;
                row.options.forEach(option =>{
                    data[l[i]]=option;
                    i=i+1;
                })
                obj.problems.push(data);
            });
            if(obj.problems.length == 0){
                return;
            }
            aner.css("display","block")
            aner.text("因api被攻击暂不支持导入题库");
            aner.append(`</br>如需请更新完整版进行更多体验`)
            aner.append("<br/>可前往<a href=\""+_this.HelpIP+"\">官网</a>安装最新脚本")
            return status;
        }

        reset_answer(data){
            let newData = {};
            if(data ==null){
                return console.log("并未获取到题库数据");
            }
            if("requestId" in data){
                console.log("智慧职教题库重组中");
                newData.id = data.data[0].examId;
                newData.title = "暂无";
                newData.rows = [];
                data.data.forEach(row=>{
                    let _data = {};
                    _data.id = row.questionId;
                    let imgs =null;
                    try{
                        imgs = $.parseHTML(row.title); // 去除特殊字符报错
                    }catch (e){
                        console.log(e);
                    }
                    row.title=window.my.HtmlUtil.htmlDecode(row.title);
                    if(imgs){
                        imgs.forEach(async function(img,index){
                            if(img.localName == "img"){
                                row.title += img.outerHTML;
                            }
                        })
                    }
                    // row.subject = row.subject.substr(0,500) //截断前500个字符
                    _data.subject = row.title;
                    _data.options = [];
                    _data.answers = [];
                    _data.type = row.typeName;
                    let tmp_option =  JSON.parse(row.dataJson)

                        if(row.answer){
                            tmp_option.forEach(option=>{
                                _data.options.push(window.my.HtmlUtil.htmlDecode(option.Content));
                                row.answer.split(",").forEach(index=>{
                                    if(option.SortOrder == index){
                                        _data.answers.push(window.my.HtmlUtil.htmlDecode(option.Content));
                                    }
                                })
                            
                            });
                        }else{
                            if(row.isRight == true){
                                tmp_option.forEach(option=>{
                                    _data.options.push(window.my.HtmlUtil.htmlDecode(option.Content));
                                    row.recordAnswer.split(",").forEach(index=>{
                                        if(option.SortOrder == index){
                                            _data.answers.push(window.my.HtmlUtil.htmlDecode(option.Content));
                                        }
                                    })
                                
                                });
                            }else{
                                _data=null;
                            }
                        }
                        
                    // }
                    if(_data != null){
                        newData.rows.push(_data);
                    }
                    
                });
            }else{
                console.log(data);
            }
            console.log(newData)
            return newData;
        }
        get_page(courseId,courseInfoId){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true  //允许跨域发送cookies
                    },
                    headers: {
                        "Authorization":"Bearer "+this.getCookie("Token"),
                    },
                    url:"https://zyk.icve.com.cn/prod-api/teacher/homeworkExam/answeredExamList?pageNum=1&pageSize=10&categoryId=1&flag=1&courseInfoId="+courseInfoId+"&courseId="+courseId,
                    dataType:"json",
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        async upload_all_problem(show_aner){
            let classListData = await (this.join_class());
            if(!classListData){
                return;
            }
            classListData.rows.forEach(course=>{
                GM_setValue(course.courseId,course.courseName);//对应课名
            })
            this.config.class_size = 0
            this.config.class_length = 0
            if(show_aner){
                aner.text("欢迎您的第一次使用，正在为您聚合数据中，请稍后。。。。");
                aner.css("display","block")
            }
            for(let i=0;i<classListData.rows.length;i++){
                let cl = classListData.rows[i];
                this.get_page(cl.courseId,cl.courseInfoId).then((result) =>{
                    result.rows.forEach(async (item)=>{
                        if(!GM_getValue(item.id)){
                            GM_setValue(item.id,item.name)
                            this.config.class_length++;
                            this.config.class_size++;
                            try{
                                await(this.get_quiz_result(item.id,item.taskId,cl.courseId));
                                console.log(item.id+"upload成功")
                            }catch{
                                console.log(item.id+"upload失败")
                            }
                            this.config.class_size--;
                            if(show_aner){
                                aner.text("百分比长时间未动请刷新页面\n已加载："+Math.trunc((1-(this.config.class_size/this.config.class_length))*100)+"%");
                            }
                        }
                    })

                });
            }
        }
        async start_search(){ //智慧职教搜题按钮实现
            const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
            function random(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }
            let HtmlUtil = window.my.HtmlUtil;
            aner.css("display","block")
            aner.text("正在搜索中，请稍后")
            let upload_paper_flag = false;
            let answers = await(window.my.getAnswers("zhzj_"+this.config.id,true));
            if((answers == null)||JSON.stringify(answers) == '{}'  || answers.rows.length <= 0){
                let subjects = []
                $('.subjectDet').each(function(index,div){
                    let subjct_div = $(div).find('h5');
                    let subject = $(subjct_div).text().trim();
                    let imgs = $(subjct_div).find("img");
                    
                    subject=HtmlUtil.htmlDecode(subject);
                    imgs.each(async function(index,img){
                        if(img.outerHTML){
                            subject += img.outerHTML;
                        }
                    })
                    if(subject != ""){
                        subjects.push(subject);
                    }
                   
                })
                answers = await(window.my.findproblems(subjects));
                upload_paper_flag = true
            }
            
            if(JSON.stringify(answers) == '{}' || !(answers.rows)){
                aner.text("没有搜索到答案，若提前阅卷时有答案，但此时没有请反馈")
            }else{
                aner.text("总共搜索到"+answers.rows.length+"题")
                answers.rows.forEach(row=>{
                    aner.append("<hr>");
                    aner.append("题目:"+row.subject+"<br>"+"答案:");
                    row.answers.forEach(answer =>{        
                         aner.append(answer+" ");
                    });
                });
            }
            let divs = $('.subjectDet');
            for(let i=0;i<divs.length;i++){
                let div = divs[i];
                // let Id = $(div).find('a').attr('name');
                //console.log($(div).find('.t-subject.t-item.moso-text.moso-editor').html());
                let subjct_div = $(div).find('h5');
                let subject = $(subjct_div).text().trim();
                let imgs = $(subjct_div).find("img");
                
                subject=HtmlUtil.htmlDecode(subject);
                imgs.each(async function(index,img){
                    if(img.outerHTML){
                        subject += img.outerHTML;
                    }
                })
                if( $(div).find('.show_answer').length == 0){ //添加文字答案
                    $(div).append("<div class='show_answer'></div>")
                }
                answers.rows.forEach((row,index)=>{
                    if(row.subject == subject){
                        if(!$(div).find('.show_answer')[0].outerText){
                            $(div).find('.show_answer').append("答案："+JSON.stringify(row.answers)+"<br>").css('color','red'); // 添加答案在后方
                        }else{
                            $(div).append("第"+(i+1)+"题重复<br>").css('color','blue');
                            $(div).find('.show_answer').append("答案："+JSON.stringify(row.answers)+"<br>").css('color','red'); // 添加答案在后方
                        }
                    }
                });
                let $options = $(div).find(".el-checkbox");
                if($options.length == 0){
                    $options = $(div).find('.el-radio');
                }
                for(let index = 0;index<answers.rows.length;index++){
                    let row = answers.rows[index];
                    if(row.subject != subject){
                        continue;
                    }
                    if("checked" in answers.rows[index]&& answers.rows[index].checked == answers.rows[index].answers.length){
                        continue
                    }
                    answers.rows[index].checked = 0;
                    for(let i = 0;i < $options.length;i++){
                        let label = $options[i];
                        let content = $(label).find(".ql-editor").text()||$(label).find(".el-radio__label").text()||$(label).find(".el-checkbox__label").text();//单多选题答案获取
                        let content_split = content.trim().substr(2);
                        for(let j=0;j<row.answers.length;j++){
                            let answer = row.answers[j];
                            try{
                                if(content == answer || content_split == answer){
                                    if ($(label).find(".is-checked").length) {
                                        answers.rows[index].checked +=1;
                                        // aner.text("答案重复，请注意分辨答案。题目："+subject);
                                        continue;
                                    }
                                    $(label).css('color','red');
                                    $(label).click();
                                    answers.rows[index].checked +=1;
                                    await sleep(random(100,200));
                                    break;
                                }
                            }catch (e){
                                console.log("发生异常:" + e);
                            }
                        }
                    }
                };
                
    
            await sleep(random(500,1000));
            }; //结束
            answers.rows.forEach((row,index)=>{
                
                if(row.checked < row.answers.length){
                    delete answers.rows[index];
                    return;
                }
                for(let q =index+1;q<answers.rows.length;q++){
                    let row1 = answers.rows[q];
                    if(row.subject == row1.subject){
                        let tmp =  window.my.compareArr(row.answers,row1.answers);
                        if(tmp == "disjoint"){
                            return;
                        }else if(tmp == "equal"){
                            console.log(row.answers);
                            console.log(row1.answers);
                            delete answers.rows[index];
                            return;
                        }else if(tmp == "subset"){
                            delete answers.rows[index];
                            return;
                        }else if(tmp == "superset"){
                            delete answers.rows[q];
                            return;
                        }else if(tmp == "mix"){
                            return;
                        }else{
                            console.log("未知"+tmp)
                        }
                    }
                }
            });
            if(upload_paper_flag){
                window.my.upload_papers(answers,"zhzj_"+this.config.id,"智慧职教");
            }
            // alert('alv');
            this.upload_all_problem(false)
            //题库获取模块 end    
        }
    }
    /*
    *  智慧树请求
    */
    class zhihuishu_api{
        constructor(config) {
            this.config = config;
            alert("由于智慧树官方经常做防护，为保证代码有效性，作者对代码做了不可读，\n需要使用该功能请访问"+_this.HelpIP+"获取5.4版本");
            location.href = _this.HelpIP+"/docs/download";
        }
    }
    /*
    *  精品云班课请求
    */
    class jpyunbanke_api {
        constructor(config) {
            this.config = config;
        }
        async init_button(){
            if(this.config.c === "res"||this.config.front_url[this.config.front_url.length-1] === "course-learning"){
                if(GM_getValue("resource_farming_main_state")){
                    div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",false);location.reload()'><span>停止翻页</span></button>");
                    this.choice_function()
                    aner.show("hide")
                    aner.text("手动切换课程后请刷新页面")
                }else{
                    div_zhu.append("<button onclick='GM_setValue(\"resource_farming_main_state\",true);location.reload()'><span>自动翻页</span></button>");
                }
                // div_zhu.append("<button id='x_res' ><span>一键完成资源</span></button>");// 已失效
                
            }else{
                div_zhu.append(`<button onclick='window.open("${this.config.HelpIP}");'><span>MeTo题库</span></button>`);
            }
        }

        
        sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

        async choice_function(){
            let oid =  await this.resource_farming()

            for(let i=10;i;i--){
                await this.sleep(1000)
                console.log("开始检测页面内容"+i)
                let video
                video = $("video")[0]
                if(video){
                    console.log("视频加载")
                    video.muted = true;
                    while(1){
                        if(video.ended){
                            console.log("播放结束")
                            window.location.href = "https://mooc.mosoteach.cn/course-study/"+this.config.front_url[4]+"/"+this.config.front_url[5]+"/course-learning?currentOid="+oid[1]
                            this.choice_function() //再次循环
                            break;
                        }
                        // $(".playButton").click()
                        video.play()
                        // let mi  = video.duration - video.currentTime
                        // console.log(mi)
                        await this.sleep(1000)
                    }
                    break;
                }
            }
            window.location.href = "https://mooc.mosoteach.cn/course-study/"+this.config.front_url[4]+"/"+this.config.front_url[5]+"/course-learning?currentOid="+oid[1]

        }

        getNewProject(){
            let user_inf = JSON.parse(localStorage.getItem("_user"))
            let online_courses = this.config.front_url[4];
            let plans = this.config.front_url[5];
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'get',
                    url:"https://coreapi-proxy.mosoteach.cn/index.php/online-courses/"+online_courses+"/plans/"+plans+"/members/"+user_inf.userId,
                    dataType:"json",
                    headers: {
                        "X-Token":localStorage.getItem("_token"),
                    },
                    success: function(res) {
                        resolve(res.member.chapters);
                    }
                });
            });
        }
    
        async resource_farming(){
            const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
            let project_obj = await(this.getNewProject())
            let project_oid = []
            project_obj.forEach((item)=>{
                item.sections.forEach((item)=>{
                    item.entities.forEach((item)=>{
                        if(item.gainedScore == -1){
                            project_oid.push(item.oid)
                        }
                    })
                })
            })
            return project_oid
            // let len = project_oid.length
            // for(let i = 0;i< len;i++){
            //     let result = await(this.post_read_project(project_oid[i]))
            //     console.log(result)
            //     if (len - i - 1 != 0) {
            //         $(shadowContent.querySelector("#x_res")).text("剩下" + (len - i - 1) + "个")
            //     }else {
            //         $(shadowContent.querySelector("#x_res")).text("全部完成")
            //         location.reload()
            //         return 0
            //     }
            //     await sleep(1000);
            // }
            
        }
        post_read_project(oid){
            let online_courses = this.config.front_url[4];
            let plans = this.config.front_url[5];
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'post',
                    url:"https://coreapi-proxy.mosoteach.cn/index.php/online-courses/"+online_courses+"/plans/"+plans+"/resources/"+oid+"/read",
                    dataType:"json",
                    headers: {
                        "X-Token":localStorage.getItem("_token"),
                    },
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        async get_user_inf(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'get',
                    url:"https://coreapi-proxy.mosoteach.cn/index.php/users/my-profile",
                    dataType:"json",
                    headers: {
                        "X-Token":localStorage.getItem("_token"),
                    },
                    success: function(res) {
                        resolve(res.user);
                    }
                });
            });
        }

    }
    

    /*
    *  云班课请求
    */
    class yunbanke_api {
        constructor(config) {
            this.config = config;
        }
        async init_button(){
            if(this.config.m === "reply"){ //
                // this.Listener();
                div_zhu.append("<button id='x_start' ><span>开始搜题</span></button>");
                // document.getElementById("zhu")
            }else if(this.config.c === "res"||this.config.front_url[this.config.front_url.length-1] === "course-learning"){
                div_zhu.append("<button id='x_res' ><span>一键完成资源</span></button>");
            }else if(this.config.m === "quiz_ranking" || this.config.m === "start_quiz_confirm"){
                div_zhu.append("<button id='x_yue' ><span>提前阅卷</span></button>");
            }else if(this.config.m === "person_quiz_result"||this.config.m ==="view"){
                // div_zhu.append("<button id='x_start' ><span>开始搜题</span></button>");
                div_zhu.append("<button id='x_recall' ><span>背题模式</span></button>");
                div_zhu.append("<button id='x_error_problems' ><span>错题集</span></button>");
                aner.css("display","block")
                aner.text("正在导入题库中");
                if(!GM_getValue(this.config.id)){
                    let flag =  await(this.get_quiz_result(this.config.id,this.config.user_id,this.config.clazz_course_id));

                    
                }else{
                    aner.text("题库已存在");
                }
            }else{
                div_zhu.append(`<button onclick='window.open("${this.config.HelpIP}");'><span>MeTo题库</span></button>`);
            }
        }
        getListMember(clazzcourseId){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'post',
                    url:"https://www.mosoteach.cn/web/index.php?c=member&m=get_list_member",
                    dataType:"json",
                    data: {
                        clazz_course_id: clazzcourseId,
                        order_item: 'score'
                    },
                    success: function(res) {
                        resolve(res.data.member_data);
                    }
                });
            });
        }

        personResult(id,userId,ccId){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'post',
                    url:"https://www.mosoteach.cn/web/index.php?c=interaction_quiz&m=person_result",
                    dataType:"json",
                    data: {
                        id: id,
                        user_id: userId,
                        cc_id: ccId,
                    },
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        
        join_class(){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'post',
                    url:"https://www.mosoteach.cn/web/index.php?c=clazzcourse&m=my_joined",
                    dataType:"json",
                    success: function(res) {
                        resolve(res.data);
                    }
                });
            });
        }
        get_page(class_id){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'post',
                    url:"https://www.mosoteach.cn/web/index.php?c=interaction&m=index&clazz_course_id="+class_id,
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }
        get_page_status(id,ccId){
            return new Promise((resolve,rejcet)=>{
                $.ajax({
                    type: 'post',
                    url:"https://www.mosoteach.cn/web/index.php?c=interaction_quiz&m=get_quiz_ranking",
                    dataType:"json",
                    data: {
                        id: id,
                        ccId: ccId,
                    },
                    success: function(res) {
                        resolve(res);
                    }
                });
            });
        }

        async get_user_obj(){
            let classListData = await (this.join_class());
            if(!classListData){
                return console.log("未登录账户");
            }
            classListData.forEach(ccid=>{
                GM_setValue(ccid.id,ccid.course.name);//对应课名
                // console.log(ccid);
            })
            if(classListData.length == 0){
                return console.log("未登录账户");
            }     
            
            let {data:objectList} = await (this.getListMember(classListData[0].id));
            if(objectList.length <= 0 ){
                return alert("初始化脚本失败");
            }
            GM_setValue("userimg",objectList[0].full_avatar_url);
            GM_setValue("user_id",objectList[0].user_id);
            let img_table = $(shadowContent.querySelector("#x_set"))
            img_table.css("background","url(" +  objectList[0].full_avatar_url + ")")
            this.config.user_id = objectList[0].user_id;
            this.config.user_list = objectList;
            // console.log(this.config.user_list)
            this.config.full_name = objectList[0].full_name;
            this.config.clazz_course_id = classListData[0].id
            let obj={
                "unionid": objectList[0].user_id,
                "username": objectList[0].full_name,
                "poolId":"ec942b0b-38c6-3256-b0e1-2a33428d4bbc",
                "grade": "云班课",
            };
            return obj
        }

        async upload_all_problem(show_aner){
            let classListData = await (this.join_class());
            if(!classListData){
                return;
            }
            classListData.forEach(ccid=>{
                GM_setValue(ccid.id,ccid.course.name);//对应课名
                // console.log(ccid);
            })
            this.config.class_size = 0
            this.config.class_length = 0
            if(show_aner){
                aner.text("欢迎您的第一次使用，正在为您聚合数据中，请稍后。。。。");
                aner.css("display","block")
            }
            for(let i=0;i<classListData.length;i++){
                let cl = classListData[i];
                this.get_page(cl.id).then((result) =>{
                    $(result).find(".interaction-row").each(async (index,div)=>{
                        let id = $(div).attr('data-id');
                        let type = $(div).attr('data-type');
                        let status = $(div).attr('data-row-status');
                        if(type=="QUIZ"){
                            if(!GM_getValue(id)){
                                this.config.class_length++;
                                this.config.class_size++;
                                try{
                                    await(this.get_quiz_result(id,this.config.user_id,cl.id));
                                    console.log(id+"upload成功")
                                }catch{
                                    console.log(id+"upload失败")
                                }
                                
                                this.config.class_size--;
                                if(show_aner){
                                    aner.text("百分比长时间未动请刷新页面\n已加载："+Math.trunc((1-(this.config.class_size/this.config.class_length))*100)+"%");
                                }
                            }
                        }
                    })

                });
            }
        }

        async get_quiz_result(id,user_id,clazz_course_id){
            var classname = GM_getValue(clazz_course_id)
            if(!classname){
                let classListData = await (this.join_class());
                if(!classListData){
                    return;
                }
                classListData.forEach(ccid=>{
                    GM_setValue(ccid.id,ccid.course.name);//对应课名
                    // console.log(ccid);
                })
                var classname = GM_getValue(clazz_course_id)
                if(!classname){
                    classname = "未命名课程";
                }
            }
            let res = await (this.personResult(id,user_id,clazz_course_id));
            var status = "error";
            // if(res.result_code != 0){
            //      return alert(res.result_msg);
            // }
            let answers = this.reset_answer(res);
            if(answers == null || JSON.stringify(answers) == '{}' ){
                return status;
            }
            let obj={
                "poolId": this.config.poolId,
                "userId":   this.config.tk_uid,
                "tags":[classname,answers.title,"云班课"],
                "title":answers.id,
                "problems":[],
            };
            let data={};
            
            answers.rows.forEach(row=>{
                if(row.subject.length < 4 || row.answers == ""){
                    console.log("题目录入有误");
                    return; //跳出循环
                }
                data={
                    "tags":     ["云班课"],
                    "text":     row.subject,
                    "answer":   JSON.stringify(row.answers),
                };
                data.tags.push(row.type);
                let l = ["choice_A","choice_B","choice_C","choice_D","choice_E","choice_F","choice_G","choice_H","choice_I","choice_J","choice_K","choice_L","choice_M","choice_N","choice_O","choice_P","choice_Q","choice_R","choice_S","choice_T","choice_U","choice_V","choice_W","choice_X","choice_Y","choice_Z"];
                let i=0;
                row.options.forEach(option =>{
                    data[l[i]]=option;
                    i=i+1;
                })
                obj.problems.push(data);
            });
            if(obj.problems.length == 0){
                return;
            }
            aner.css("display","block")
            aner.text("因api被攻击暂不支持导入题库");
            aner.append(`</br>如需请更新完整版进行更多体验`)
            aner.append("<br/>可前往<a href=\""+_this.HelpIP+"\">官网</a>安装最新脚本")
            return status;
        }

        reset_answer(data){
            let newData = {};
            if(data ==null){
                return console.log("并未获取到题库数据");
            }
            if("activity" in data){
                console.log("蓝墨云题库重组中");
                newData.id = data.activity.id;
                newData.title = data.activity.title;
                newData.rows = [];
                data.activity.topics.forEach(row=>{
                    let _data = {};
                    _data.id = row.topic_id;
                    let imgs =null;
                    try{
                        imgs = $.parseHTML(row.subject); // 去除特殊字符报错
                    }catch (e){
                        console.log(e);
                    }
                    row.subject=window.my.HtmlUtil.htmlDecode(row.subject);
                    if(imgs){
                        imgs.forEach(async function(img,index){
                            if(img.localName == "img"){
                                row.subject += img.outerHTML;
                            }
                        })
                    }
                    // row.subject = row.subject.substr(0,500) //截断前500个字符
                    _data.subject = row.subject;
                    _data.options = [];
                    _data.answers = [];
                    _data.type = row.type;
                    if(row.type == "TF"){
                        if(row.tf_answer!=null){
                            _data.answers.push(row.tf_answer);
                        }else{
                            if(row.result == 1){
                                _data.answers.push(row.user_tf_answer)
                            }else{
                                _data=null;
                            }
                        }
                    }else if(row.type == "FILL"){
                        row.fill.blank_alternatives.forEach(answer=>{
                            if(answer.contents[0] !=null){
                                _data.answers.push(answer.contents);
                            }else{
                                if(answer.result ==1){
                                    _data.answers.push(answer.user_content)
                                }else{
                                    _data=null;
                                }
                            }
                        });
                    }else{
                        if(row.answers.length != 0){
                            row.options.forEach(option=>{
                                _data.options.push(window.my.HtmlUtil.htmlDecode(option.content));
                                row.answers.forEach(index =>{
                                    if(option.item_no == index){
                                        _data.answers.push(window.my.HtmlUtil.htmlDecode(option.content));
                                    }
                                });
                            });
                        }else{
                            if(row.result == 1){
                                row.options.forEach(option=>{
                                    _data.options.push(window.my.HtmlUtil.htmlDecode(option.content));
                                    row.user_answers.forEach(index =>{
                                        if(option.item_no == index){
                                            _data.answers.push(window.my.HtmlUtil.htmlDecode(option.content));
                                        }
                                    });
                                });
                            }else{
                                _data=null;
                            }
                        }
                        
                    }
                    if(_data != null){
                        newData.rows.push(_data);
                    }
                    
                });
            }else{
                console.log(data);
            }
            return newData;
        }
        async main_resource(reslist){
            var watch = reslist[0]
            var req = {}
            if (reslist.length != 0) {
                $(shadowContent.querySelector("#x_res")).text("剩下" + reslist.length + "个")
            } else {
                $(shadowContent.querySelector("#x_res")).text("全部完成")
                location.reload()
                return 0
            }
            var clazz_course_id = this.config.clazz_course_id
            $.ajax({
                type: "POST",
                url: "https://www.mosoteach.cn/web/index.php?c=res&m=request_url_for_json",
                data: {
                    'file_id': watch.id,
                    'type': 'VIEW',
                    'clazz_course_id': clazz_course_id,
                },
                dataType: "json",
                success: msg => {
                    const src = msg.src
                    if (src.indexOf("m3u8") > -1) {
                        fetch(src)
                            .then(data => data.text())
                            .then(text => {
                                let time = 0
                                for (i of text.split("\n")) {
                                    if (i.indexOf("#EXTINF:") > -1) {
                                        i = parseFloat(i.replace("#EXTINF:", ""))
                                        time += i
                                    }
                                }
                                time = Math.ceil(time)
                                $.ajax({
                                    type: 'post',
                                    dataType: 'json',
                                    url: 'https://www.mosoteach.cn/web/index.php?c=res&m=save_watch_to',
                                    data: {
                                        clazz_course_id: clazz_course_id,
                                        res_id: watch.id,
                                        watch_to: time,
                                        duration: time,
                                        current_watch_to: time
                                    },
                                    success: res => {
                                        reslist.splice(0, 1)
                                        this.main_resource(reslist)
                                    }
                                });
                            })
                    } else {
                        reslist.splice(0, 1)
                        this.main_resource(reslist)
                    }
                }
            })
        }
        resource_farming(reslist){
            var reslist = []
            $(".res-row-open-enable").each(function() {
                if ($(this).find('span[data-is-drag]')[0].dataset.isDrag == "N") {
                    reslist.push({
                        id: $(this).attr('data-value'),
                        state: $(this).find('span[data-is-drag]')[0].dataset.isDrag,
                        type: $(this).attr('data-mime')
                    })
                }
            });
            this.main_resource(reslist)
        }
        async start_search(){ //搜题按钮实现
            const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
            function random(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }
    
            let HtmlUtil = window.my.HtmlUtil;
            aner.css("display","block")
            aner.text("正在搜索中，请稍后")
            let upload_paper_flag = false;
            let answers = await(window.my.getAnswers(this.config.id,true));
            if(this.config.tk_uid == null || (answers == null)||JSON.stringify(answers) == '{}'  || answers.rows.length <= 0){
                let subjects = []
                $('.topic-item').each(function(index,div){
                    let Id = $(div).find('a').attr('name');
                    let subject = $(div).find('.t-subject.t-item.moso-text.moso-editor').text().trim();
                    let imgs = $(div).find("img");
                    // console.log(imgs)
                    subject = HtmlUtil.htmlDecode(subject);
                    imgs.each(async function(index,img){
                        if(img.outerHTML){
                            subject += img.outerHTML;
                        }
                    })
                    if(subject != ""){
                        subjects.push(subject);
                    }
                   
                })
                answers = await(window.my.findproblems(subjects));
                upload_paper_flag = true
            }
            
            if(JSON.stringify(answers) == '{}' || !(answers.rows)){
                aner.text("没有搜索到答案，若提前阅卷时有答案，但此时没有请反馈")
            }else{
                aner.text("总共搜索到"+answers.rows.length+"题")
                answers.rows.forEach(row=>{
                    aner.append("<hr>");
                    aner.append("题目:"+row.subject+"<br>"+"答案:");
                    row.answers.forEach(answer =>{        
                         aner.append(answer+" ");
                    });
                });
            }
            
    
            window.my.config.timenum = answers.rows.length * 4 * (GM_getValue("is_wait") ? 0:1)
            $(".my-sticky-bottom").children("button:first").attr('id', 'submit')
            window.my.config.timer = setInterval(function() {
                window.my.config.timenum--
                if (window.my.config.timenum < 0) {
                    $("#submit").text("交卷")
                    $("#submit").attr("style", "")
                    $("#submit").attr('disabled', false)
                    clearInterval(window.my.config.timer)
                } else {
                    $("#submit").attr('disabled', true)
                    $(shadowContent.querySelector("#x_start")).attr('disabled', true)
                    $("#submit").attr("style", "width:250px")
                    $("#submit").text("请在" +window.my.config.timenum +"秒后交卷")
                }
            }, 1000)
    
            // $('.topic-item').each(function(index,div){ // 如果是这个后面记得加括号
            let divs = $('.topic-item');
            for(let i=0;i<divs.length;i++){
                let div = divs[i];
                let Id = $(div).find('a').attr('name');
                let flag_FT = false
                //console.log($(div).find('.t-subject.t-item.moso-text.moso-editor').html());
                let subject = $(div).find('.t-subject.t-item.moso-text.moso-editor').text();
                let imgs = $(div).find("img");
                
                subject=HtmlUtil.htmlDecode(subject);
                imgs.each(async function(index,img){
                    if(img.outerHTML){
                        subject += img.outerHTML;
                    }
                })
                // subject = subject.substr(0,500);
                // console.log(subject);
                // subject=escapeto(subject);
                //let space = new RegExp(`${String.fromCharCode(160)}`,"g"); /* no breaking space*/
                // console.log(subject);
                if( $(div).find('.show_answer').length == 0){
                    $(div).find('.t-con').append("<div class='show_answer'></div>")
                }
                answers.rows.forEach((row,index)=>{
                    if(row.subject == subject){
                        if(!$(div).find('.show_answer')[0].outerText){
                            $(div).find('.show_answer').append("答案："+JSON.stringify(row.answers)+"<br>").css('color','red'); // 添加答案在后方
                        }else{
                            $(div).append("第"+(i+1)+"题重复<br>").css('color','blue');
                            $(div).find('.show_answer').append("答案："+JSON.stringify(row.answers)+"<br>").css('color','red'); // 添加答案在后方
                            
                        }
                    }
                });
                let $options = $(div).find('label');
                if($options.length == 0){
                    $options = $(div).find('input');
                }
    
                for(let index = 0;index<answers.rows.length;index++){
                    let row = answers.rows[index];
                    if(row.subject != subject){
                        continue;
                    }
                    if("checked" in answers.rows[index]&& answers.rows[index].checked == answers.rows[index].answers.length){
                        continue
                    }
                    answers.rows[index].checked = 0;
                    for(let i = 0;i < $options.length;i++){
                        let label = $options[i];
                        let content = $(label).find('.option-content.moso-text.moso-editor').text();//单多选题答案获取
                        if(content == ""){
                            content = $(label).find('.el-radio__label').text();//判断题答案获取
                            flag_FT = true
                        }
                        
                        if(content == ""){
                            //填空题
                            if(Array.isArray(row.answers[i])){
                                $(label).val(row.answers[i][0]);
                                answers.rows[index].checked +=1;
                            }else{
                                $(label).val(row.answers[i]);
                                answers.rows[index].checked +=1;
                            }
                            let ev = document.createEvent("HTMLEvents");
                            ev.initEvent("input", true, true);
                            $(label)[0].dispatchEvent(ev);
                        }
                        for(let j=0;j<row.answers.length;j++){
                            let answer = row.answers[j];
                            if(flag_FT == true){
                                if (answer == "T"){
                                    answer = "正确"
                                }else if(answer == "F"){
                                    answer = "错误"
                                }
                            }
                            try{
                                if(content == answer){
                                    if ($(label).find(".is-checked").length) {
                                        answers.rows[index].checked +=1;
                                        // aner.text("答案重复，请注意分辨答案。题目："+subject);
                                        continue;
                                    }
                                    $(label).css('color','red');
                                    $(label).click();
                                    answers.rows[index].checked +=1;
                                    await sleep(random(100,200));
                                    break;
                                }
                            }catch (e){
                                console.log("发生异常:" + e);
                            }
                        }
                    }
                };
                
    
            await sleep(random(500,1000));
            }; //结束
            answers.rows.forEach((row,index)=>{
                
                if(row.checked < row.answers.length){
                    delete answers.rows[index];
                    return;
                }
                for(let q =index+1;q<answers.rows.length;q++){
                    let row1 = answers.rows[q];
                    if(row.subject == row1.subject){
                        let tmp =  window.my.compareArr(row.answers,row1.answers);
                        if(tmp == "disjoint"){
                            return;
                        }else if(tmp == "equal"){
                            console.log(row.answers);
                            console.log(row1.answers);
                            delete answers.rows[index];
                            return;
                        }else if(tmp == "subset"){
                            delete answers.rows[index];
                            return;
                        }else if(tmp == "superset"){
                            delete answers.rows[q];
                            return;
                        }else if(tmp == "mix"){
                            return;
                        }else{
                            console.log("未知"+tmp)
                        }
                    }
                }
            });
            if(upload_paper_flag){
                window.my.upload_papers(answers,this.config.id,"云班课");
            }
            // alert('alv');
            // this.upload_all_problem(false)
            //题库获取模块 end    
        }
    }
    
    MyPage.prototype.x_res = function(){
        return this.api.resource_farming()
    }
    MyPage.prototype.getAnswers = async function(id,deep){
        let answers = {};
        let obj={
            "poolId": this.config.poolId,
            "userId":   this.config.tk_uid,
            "querry": {
                "operator": "==",
                "argument1": "papertitle",
                "argument2": id,
            },
            "deep": deep,
        };
        await(this.upladApi("/tiku/api/v1/queryCollection",obj).then(async (resutData)=>{
            if(resutData.result==="success" && !!resutData.json){
                var data = resutData.json.results;
                console.log("总共查询到数据库数量"+data.length+"个");
                data.forEach((item, index) =>{
                    if(index == 0){
                        answers =this.resoluAnswers(item);
                    }else{
                        this.resoluAnswers(item).rows.forEach(i =>{
                            answers.rows.push(i);
                        })
                        
                    }
                });
            }
        }));

        return answers;
    }

    MyPage.prototype.arrowMove = function(e){
        // var e = document.getElementById(e);
        // 元素大小
        let elW = e.currentTarget.offsetWidth
        let elH = e.currentTarget.offsetHeight
        // 元素位置
        let elL = e.currentTarget.parentNode.parentNode.offsetLeft
        let elT = e.currentTarget.parentNode.parentNode.offsetTop
        // 鼠标位置
        let x = e.clientX
        let y = e.clientY
        // 窗口大小
        let w = window.innerWidth
        let h = window.innerHeight
        // 鼠标到元素左边距离
        let moveX = x - elL
        let moveY = y - elT
        let el = e.currentTarget
        document.onmousemove = function (e) {
            // el.style.position = 'fixed';
            el.parentNode.parentNode.style.left = e.clientX -moveX + 'px'
            el.parentNode.parentNode.style.top =e.clientY - moveY + 'px'
        }
        document.onmouseup = function (e) {
            document.onmousemove = null
            document.onmouseup = null
        }
    };

    MyPage.prototype.initMenu = function(show){
        let $ = this.$,menu = this.menu;
        // $(shadowContent.querySelector("#x_set"))[0].parentNode.remove()
        

        /**
        * MosoteachHelper CSS
        */
        const styleTag = `
            #${menu.id} #zhu_${menu.id} button[disabled]{
                color: white !important;
                background-color: rgb(188, 188, 188) !important;
            }
            #${menu.id} #zhu_${menu.id} button{
                float:left;
                margin:25px 2px;
                // width:70px;
                // height:25px;
                /* 把按钮撑大 */
                padding: 4px 8px;
                /* 去除默认边框 */
                border: none;
                /* 圆角 */
                border-radius: 50px;
                /* 按钮背景色 */
                background-color: #8888ff;
                /* 字体颜色、大小、粗细、字间距 */
                color: #fff;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 1px;
                /* 鼠标小手 */
                cursor: pointer;
                /* 给个定位 */
                position: relative;
                /* 3D模式 */
                transform-style: preserve-3d;
                /* 过度动画时间 */
                transition: ease-in-out 2s;
            }
            #${menu.id} #zhu_${menu.id} button:hover {
                /* 鼠标放上来旋转一圈 */
                transform: rotateX(360deg);
            }
            #${menu.id} #zhu_${menu.id} button::before,
            #${menu.id} #zhu_${menu.id} button:after {
                content: "";
                /* 白色边框线 */
                border: 0.8px solid #fff;
                /* 圆角 */
                border-radius: 50px;

                /* 通过定位来撑开边框，简单来说，确定4边的距离，中间自然就固定了 */
                position: absolute;
                top: 1px;
                left: 1px;
                right: 1px;
                bottom: 1px;

                /* 3D模式 */
                transform-style: preserve-3d;
                /* 设置透视参数，向 Z轴方向移动，正常时候就是向屏幕外面移动 */
                transform: perspective(1000px) translateZ(5px);
            }
            #${menu.id} #zhu_${menu.id} button::after {
                /* 另一边反着移动一下 */
                transform: perspective(1000px) translateZ(-5px);
            }
            #${menu.id} #zhu_${menu.id} button span {
                /* 设置 span 为块元素 */
                display: block;
            
                /* 3D模式 */
                transform-style: preserve-3d;
                /* 同样设置透视，抬高 Z轴距离 */
                transform: perspective(500px) translateZ(8px);
            }
            #${menu.id}{
                color: #000;
                display: ${GM_getValue("is_hide")?'none':show};
                font-size:14px;
                z-index: 9999;
                text-align:center;
                // width:0;
                // height:0;
                position:fixed;
                pointer-events: none;
                left:${menu.pos.x}px;
                top:${menu.pos.y}px;
                // background:${menu.background};
                // opacity:${menu.opacity};
            }
            #${menu.id} #zhu_${menu.id}{
                pointer-events: visible;
            }
            #${menu.id} .drawer{
                pointer-events: visible;
                position:relative;
                max-height:400px;
                overflow:auto;
                text-align: center;
                display: none;
                background: #fff;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                width: 100%; /* initially */
                max-width: 300px;
                opacity: 0.9;
                z-index: 199;
                padding:10px 0px;
                margin:10px;
            }
            #${menu.id} p{
                text-align:left;
                padding-left:5px;
            }
            #${menu.id} .drawer input{
                border-radius: 3px;
                border: 1px solid #000;
                color: #000;
                background-color: #FFF;
                width:160px;
            }
            #${menu.id} .drawer button{
                border-radius: 5px;
                margin-bottom:2px;
                white-space: pre; /*禁止换行*/
                width:40px;
                display:inline;
                border: 1px solid;
                background-color: transparent;
                text-transform: uppercase;
                padding: 1px 0px;
                font-weight: 300;
            }
            #${menu.id} .drawer img{
                width: 100% !important;
                height: 100% !important;
            }
            #${menu.id} .drawer button:hover {
                color: white;
                border: 0;
                background-color: #4cc9f0;
                -webkit-box-shadow: 10px 10px 99px 6px rgba(76,201,240,1);
                -moz-box-shadow: 10px 10px 99px 6px rgba(76,201,240,1);
                box-shadow: 10px 10px 99px 6px rgba(76,201,240,1);
            }
            #${menu.id} #set{ position:relative; }
            #${menu.id} #x_settings{
                position:absolute;
                right:10px;
                bottom:10px;
                width:28px;
                height:28px;
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:16px;
                line-height:28px;
                cursor:pointer;
            }
            #${menu.id} #x_set{
                animation: change 3s linear 0s infinite;
                float:left;
                position:relative;
                z-index: 200;
                margin:10px;
                border-radius:50%; 
                overflow:hidden;
                height: 50px;
                width:50px;
                border: solid 2px #00ff00;
                background: url(${GM_getValue("userimg") ? GM_getValue("userimg"):"https://i.jpg.dog/8a4f4bd4c5ea7b1eff20a2978885f2b1.jpeg"});
                background-size: 50px 50px;
            }
            /* VIP Badge pill overlay on x_set bottom-center */
            #${menu.id} #vip_badge{
                pointer-events: visible;
                position: absolute;
                left: 50%;
                bottom: -2px; /* 位于头像的中下方 */
                transform: translateX(-50%);
                min-width: 44px;
                height: 18px;
                padding: 0 6px;
                border-radius: 10px;
                z-index: 201; /* 高于 x_set，让其显示在上层 */
                background: rgba(0,0,0,0.6);
                border: 1px solid rgba(255,255,255,0.6);
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.25);
                cursor: pointer;
            }
            #${menu.id} #vip_badge span{
                position: relative;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.5px;
            }
            #${menu.id} #vip_badge.svip span{ color:#ffd54f; }
            #${menu.id} #vip_badge.free span{ color:#90caf9; }
            @keyframes change {
                0% {border: solid 2px #333;}
                25% {border: solid 2px #f60;}
                50% {border: solid 2px #f00;}
                75% {border: solid 2px #1ab558;}
                100% {border: solid 2px #333;}
            }
            #${menu.id} .meto-answer-btn{
                display:inline-block;
                margin-left:6px;
                color:#1677ff;
                cursor:pointer;
            }
            #${menu.id} .meto-correct-btn{
                margin-left:8px;
                border:1px solid #1677ff;
                color:#1677ff;
                background:#fff;
                border-radius:4px;
                padding:2px 8px;
                cursor:pointer;
            }
            #${menu.id} .meto-user-ans-tip{
                color:#fa8c16;
            }
            #${menu.id} #settings_modal{
                position:fixed;
                left:0;top:0;right:0;bottom:0;
                background:rgba(0,0,0,0.35);
                display:none;
                z-index:99999;
                pointer-events: visible;
            }
            #${menu.id} #settings_modal .modal-panel{
                position:absolute;
                left:50%;top:50%;
                transform:translate(-50%,-50%);
                background:#fff;
                border-radius:8px;
                width:280px;
                padding:12px;
                box-shadow:0 6px 24px rgba(0,0,0,0.2);
                pointer-events: visible;
            }
            #${menu.id} #settings_modal .modal-panel .row{ margin:6px 0; }
            #${menu.id} #settings_modal .modal-panel .row label{ display:block; font-size:13px; margin-bottom:4px; }
            #${menu.id} #settings_modal .modal-panel .row input,
            #${menu.id} #settings_modal .modal-panel .row select{ width:100%; box-sizing:border-box; padding:6px; border:1px solid #ddd; border-radius:4px; }
            #${menu.id} #settings_modal .modal-panel .actions{ display:flex; justify-content:flex-end; gap:8px; margin-top:10px; }
            `;

        let $menu =
            `
            <div id='${menu.id}'>
                <div id ="zhu_${menu.id}" >
                    <div id="x_set">
                        <div id="vip_badge"><span>FREE</span></div>
                    </div>
                </div>
                <div class= "drawer" id="set">
                    <div>
                        🦄️ <input id = "tiku_user" readonly="readonly" value="未获取到用户名,请刷新重试" />
                        ${GM_getValue("ti_uid")?`<button onclick="GM_setValue('ti_uid','');confirm('确认退出') && location.reload()">退出</button>`:`<button onclick="window.open('${this.ChatIP}/#/activate', 'Meto登陆');">登陆</button>`}
                        <button  id="x_charge" ><a target="_blank" href = "${this.ShopIP}?base=/buy/3">赞赏</a></button>
                    </div>
                    <div>
                        🔎 <input id = "find_input" placeholder="搜索题目需要6个字符以上" />
                        <button  id="x_find" >MT搜</button>
                        <button  id="x_AIfind" >AI搜</button>
                    </div>
                    <div>
                        本项目非盈利，欢迎给项目发电<br/>
                        大家的支持才有我开发的动力<br/>
                        <a target="_blank" href = "https://pd.qq.com/s/7hrwqmix1">QQ频道:🌈点我进群🌈</a><br/>
                        <a target="_blank" href = "https://mp.weixin.qq.com/s/jPjrajPpzXGSYDGDmPVpAA">微信公众号:🐟MeTo智能体🐟</a><br/>
                    </div>
                    <button id="x_settings">⚙</button>
                </div>
                <div class= "drawer" id="aner">
                    <p>
                        正在获取试卷中，请稍等
                    </p>
                
                </div>
                <div id="settings_modal">
                    <div class="modal-panel">
                        <div class="row">
                            <label for="settings_video_spend">视频速率 <a target="_blank" href="${this.config.HelpIP}/docs/question#为什么没有倍速功能">❓︎</a></label>
                            <input id="settings_video_spend" type="number" step="0.1" min="0" />
                        </div>
                        <div class="row">
                            <label for="settings_ai_model">AI模型 <a target="_blank" href="${this.config.HelpIP}/chat/pricing#-ai模型定价">❓︎</a></label>
                            <select id="settings_ai_model">
                                <option value="gpt-4o-mini">gpt-4o-mini</option>
                                <option value="gpt-5-mini">gpt-5-mini</option>
                                <option value="gpt-5.1">gpt-5.1🔥</option>
                            </select>
                        </div>
                        <div class="actions">
                            <button id="settings_cancel">取消</button>
                            <button id="settings_save">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 使用自定义元素
        const hostElement = $("html")[0].appendChild(document.createElement('div'));
        let originalAttachShadow = null;
        try {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.documentElement.appendChild(iframe);
            originalAttachShadow = iframe.contentWindow.Element.prototype.attachShadow;
            document.documentElement.removeChild(iframe);
        } catch (e) {
            console.log("方案1失败:", e.message);
        }
        
        if (!originalAttachShadow) {
            try {
                originalAttachShadow = Element.prototype.attachShadow;
            } catch (e) {
                alert("脚本启动异常", e.message);
            }
        }
        const shadowRoot = originalAttachShadow.call(hostElement, { mode: 'closed' });
        
        // 创建样式元素并将样式添加到影子根节点中
        const stylesElement = document.createElement('style');
        stylesElement.textContent = styleTag;
        shadowRoot.appendChild(stylesElement);

        // 创建影子 DOM 中的内容
        shadowContent = document.createElement('div');
        shadowContent.innerHTML = $menu;
        this.shadowContent=shadowContent

        // 将影子元素添加到影子根节点中
        shadowRoot.appendChild(shadowContent);

        /* Initialize VIP badge label and click behavior */
        try{
            const tokenNum = GM_getValue("token_num") || 0;
            const badgeEl = $(shadowContent.querySelector("#vip_badge"));
            const labelEl = badgeEl.find("span");
            if(tokenNum > 20000){
                badgeEl.addClass("svip").removeClass("free");
                labelEl.text("SVIP");
            }else{
                badgeEl.addClass("free").removeClass("svip");
                labelEl.text("FREE");
            }
            badgeEl.on("click", ()=>{
                window.open(this.ChatIP+"/#/activate", "MetoChat");
            });
        }catch(e){
            console.log("vip badge init error", e);
        }

        GM_registerMenuCommand("基本设置",function(){
            div_set.toggle('active');
        });
        GM_registerMenuCommand(GM_getValue("is_hide") ? "显示脚本UI" : "隐藏脚本UI"  ,function(){
            GM_setValue("is_hide",!GM_getValue("is_hide"));
            GM_getValue("is_hide")?$(shadowContent).find('#'+menu.id).hide():$(shadowContent).find('#'+menu.id).show();
        });
        GM_registerMenuCommand(GM_getValue("is_wait") ? "开启延迟交卷" : "关闭延迟交卷（不建议）"  ,function(){
            GM_setValue("is_wait",!GM_getValue("is_wait"));
            location.reload();
        });
        GM_registerMenuCommand("重置脚本",function(){
            GM_setValue("overdue",1);
            GM_setValue("window.al_yun_xx",null);
            location.reload();
        });
        $(shadowContent).on('mousedown', '#x_set', function (e) {
            e.stopPropagation();
            window.my.arrowMove(e);//.target.parentNode.id
        });
        $(shadowContent).on('click', '#x_start', function () {
            window.my.start();
        });
        $(shadowContent).on('click', '#x_set', function () {
            if(document.querySelectorAll("#wzq").length>1 || document.querySelectorAll("#qptjb").length==1){
                alert("检测到您安装了多个不同版本的脚本\n导致脚本发生冲突\n请关闭除《"+GM_info.script.name+"》以外的脚本")
            }
            div_set.toggle('active');
            aner.hide("slow");
        });
        // $(document).on('click', '#x_charge', function () {
        //     aner.css("display","block")
        //     aner.text("");
        //     aner.append("充电地址：");

        // });
        $(shadowContent).on('click', '#x_find',async function () {
            const $btn = $(this);
            $btn.prop('disabled', true);
            let t = setTimeout(() => {
                $btn.prop('disabled', false);
            }, 3000);
            aner.show("slow");
            aner.text("");
            
            if(find_input.value.length <6){
                aner.append("搜索题目需要6个字符以上");
                $btn.prop('disabled', false);
                clearTimeout(t)
                return;
            }
            aner.append("若长时间未返回信息，请反馈<hr>");
            // problem = window.my.HtmlUtil.htmlDecode(text.value);
            // console.log(problem)
            await window.my.findproblem(find_input.value.replace(/   /g,"   ").substr(0,30))
            clearTimeout(t)
            $btn.prop('disabled', false);
            aner.text("");
            aner.append("搜索到"+window.my.config.answer.rows.length+"条相关题目<hr>");
            window.my.config.answer.rows.forEach(row=>{
                aner.append("<strong>题目:</strong>"+row.subject+"<br>"+"<strong>答案:</strong>");
                if(row.hideAnswer){
                    aner.append("<span class=\"meto-answer-btn\" data-problem-id=\""+row.problemId+"\">点击查看答案</span>");
                }else{
                    row.answers.forEach(answer =>{        
                        aner.append(answer+" ");
                    });
                }
                aner.append("<hr>");
            });
        });
        $(shadowContent).on('click', '.meto-answer-btn', async function () {
            const el = $(this);
            const pid = el.data('problem-id');
            el.text('加载中...');
            let ans = null;
            let user_ans = null;
            let createBy = null;
            try{
                const res = await window.my.upladApi('/tiku/api/v1/queryProblemAnswer', {
                    problemId: pid
                });
                console.log(res.json)
                if(res.result == "success"){
                    const d = res.json.results[0];
                    ans = d.answer;
                    user_ans = d.userAnswer;
                    createBy = d.createBy;
                    if(typeof ans === 'string'){
                        try{ ans = JSON.parse(ans); }catch(e){}
                    }
                }
            }catch(e){}
            let text = null;
            if(Array.isArray(ans)){
                text = ans.join(' ');
            }else if(typeof ans === 'string'){
                text = ans;
            }else{
                el.text('获取失败');
            }
            if(user_ans){
                el.replaceWith('<span class="meto-user-ans-tip">'+text+'<br/><strong>纠正答案：</strong>'+user_ans+'</span>'+
                               '<button class="meto-correct-btn" data-problem-id="'+pid+'" data-create-user="'+(createBy||'')+'">纠正</button>');
            }else if(text){
                el.replaceWith('<span>'+text+'</span>'+
                               '<button class="meto-correct-btn" data-problem-id="'+pid+'" data-create-user="'+(createBy||'')+'">纠正</button>');
            }
        });
        $(shadowContent).on('click', '.meto-correct-btn', async function () {
            const $btn = $(this);
            const pid = $btn.data('problem-id');
            const cu = $btn.data('create-user');
            const input = window.prompt('纠正答案通过审核后奖励5K Token，请输入纠正答案','');
            if(!input){ return; }
            $btn.prop('disabled', true).text('提交中...');
            try{
                const res = await window.my.upladApi('/tiku/api/v1/problemStatus', {
                    problemId: pid,
                    createUser: cu,
                    userAnswer: input,
                    status: "-1"
                });
                $btn.text('已提交');
            }catch(e){
                $btn.text('提交失败');
                $btn.prop('disabled', false);
            }
        });
        $(shadowContent).on('click', '#x_AIfind',async function () {
            const $btn = $(this);
            $btn.prop('disabled', true);
            setTimeout(() => {
                $btn.prop('disabled', false);
            }, 4000);
            aner.show("slow");
            aner.text("");
            
            if(find_input.value.trim() == ""){
                aner.append("请输入内容");
                return;
            }
            aner.append("若长时间未返回信息，请反馈<hr>");

            let obj ={
                "messages": [
                    {
                        "role": "user",
                        "content": find_input.value
                    }
                ],
                "stream": true,
                "model": GM_getValue("ai_model")||"gpt-4o-mini",
                "presence_penalty": 0,
                "frequency_penalty": 0,
                "top_p": 1
            };
            
            GM_xmlhttpRequest({
                responseType:"stream",
                timeout: 10000,
                method: "post",
                url: window.my.ChatIP+"/api/openai/v1/chat/completions",
                headers:{
                    Authorization:'Bearer nk-'+window.my.config.tk_uid+","+window.my.config.poolId,
                },
                data: JSON.stringify(obj),
                onloadstart: function(response) {
                    aner.text("");
                    // console.log(response.response)
                    const reader = response.response.getReader();
                    var error_d = "";
                    function read() {
                        reader.read().then(({ done, value }) => {
                          if (done) {
                            console.log('读取完毕');
                            return;
                          }
                          let data = new TextDecoder().decode(value)
                          data.split("data:").forEach(d=>{
                            if(d!=""&&d.indexOf("[DONE]") == -1){
                                let Json_msg=null;
                                try{
                                    if(error_d){
                                        d = error_d +d;
                                        error_d="";
                                    }
                                    Json_msg = $.parseJSON(d)
                                    if(Json_msg.msg=="empty access code"||Json_msg.msg=="wrong access code"){
                                        aner.append("若需要使用AI功能请先<button onclick=\"window.open('"+window.my.ChatIP+"/#/activate', 'Meto登陆');\">登陆</button>");
                                        return;
                                    }else if(Json_msg.msg && Json_msg.msg.indexOf("剩余token不足") != -1){
                                        aner.append("您的AI剩余TOKEN已不足请<button onclick=\"window.open('"+window.my.ShopIP+"/', 'Meto登陆');\">充值</button><br/>未登陆账号请<button onclick=\"window.open('"+window.my.ChatIP+"/#/activate', 'Meto登陆');\">登陆</button>");
                                        return;
                                    }else if(Json_msg.msg){
                                        aner.append(Json_msg.msg);
                                        return;
                                    }
                                    aner.append(Json_msg.choices[0]?Json_msg.choices[0].delta.content : '');
                                    aner.scrollTop(aner.prop("scrollHeight"));
                                }catch (e){
                                    console.log("发生异常:" + e)
                                    if(Json_msg){
                                        aner.append("发生异常:" + Json_msg);
                                    }
                                    error_d=d;
                                }
                            }
                            
                          });
                        //   console.log($.parseJSON(data));
                          // 继续读取下一个数据块
                          read();
                        });
                      }
                  
                      // 开始读取数据
                      read();
                },
                onerror : function(err){
                    console.log('error')
                    aner.append("发生异常:" + err);
                },
                ontimeout : function(inf){
                    console.log('请求超时')
                    aner.append("请求超时，超时主机为："+window.my.ChatIP);
                }
            })
            
        });
                
        $(shadowContent).on('click', '#x_yue', async function () {
            aner.show("slow");
            $(shadowContent.querySelector("#x_yue")).attr("disabled", true)
            aner.text("正在搜索答案中");
            let answers = await(window.my.getAnswers(window.my.config.id,true));
            if(!answers||JSON.stringify(answers) == "{}"){
                aner.text("暂时没有此试卷信息。可直接开始答题进行搜索（可能最终答案没那么全）");
                return;
            }
            
            aner.text("搜索到"+ answers.rows.length +"条题目信息");
            answers.rows.forEach(row=>{
                aner.append("<hr>");
                aner.append("题目:"+row.subject+"<br>"+"答案:");
                row.answers.forEach(answer =>{
                     aner.append(answer+" ");
                });
            });
                
        });
        $(shadowContent).on('click', '#x_res', async function () {
            $(shadowContent.querySelector("#x_res")).attr("disabled", true)
            window.my.x_res()
        });
        $(shadowContent).on('click', '#x_forum', async function () {
            let texts = prompt("请添加讨论词，使用英文逗号,进行分隔\n注意最后不要加上,", "我是一号讨论词,我是二号讨论词")
            GM_setValue("forum_texts", texts);
        });
        

        $(shadowContent).on('click', '#x_recall', async function () {
            $(shadowContent.querySelector("#x_recall")).attr("disabled", true)
            $(shadowContent.querySelector("#"+menu.id)).css("left","0").css("top","0");
            $(shadowContent.querySelector(".drawer")).hide();
            $(".t-answer").each((index,div) =>{
                $(div).append("<button class =\"addpro\" style = \"height:30px; background:#c9fff5 ;border-radius: 50px;padding: 3px;margin-top: 10px;\">添加到错题</button>")
                $(div).find("span").css("color","#FFF").css("display","block").css("width","70px").css("font-size","25px").css("border","1px solid black").click(function(_this){
                    $(_this.currentTarget).css("color","#0bd")
                });
                $(div).find(".answer-r").hide();
                
            })
        });
        $(shadowContent).on('click', '#x_error_problems', async function () {
            let error_problem = GM_getValue(window.my.config.id+"_error_problem");
            if(!error_problem){
                error_problem = {};
                alert("您还未建立错题集");
                return;
            }
            $(shadowContent.querySelector("#x_recall")).attr("disabled", true)
            $(shadowContent.querySelector("#"+menu.id)).css("left","0").css("top","0");
            $(shadowContent.querySelector(".drawer")).hide();
            $(".topic-list").text("");
            for (var i in error_problem) {
                $(".topic-list").append(error_problem[i]);

            };
            $(".t-answer").each((index,div) =>{
                $(div).find("span").css("color","#FFF").css("display","block").css("width","70px").css("font-size","25px").css("border","1px solid black").click(function(_this){
                    $(_this.currentTarget).css("color","#0bd")
                });
            });
        });
        $(shadowContent).on('click', '#x_settings', function () {
            const modal = $(shadowContent.querySelector('#settings_modal'));
            modal.show();
            $(shadowContent.querySelector('#settings_video_spend')).val(GM_getValue('video_spend')||1);
            const m = GM_getValue('ai_model')||'gpt-4o-mini';
            $(shadowContent.querySelector('#settings_ai_model')).val(m);
        });
        $(shadowContent).on('click', '#settings_cancel', function () {
            $(shadowContent.querySelector('#settings_modal')).hide();
        });
        $(shadowContent).on('click', '#settings_modal', function (e) {
            if(e.target && e.target.id === 'settings_modal'){
                $(shadowContent.querySelector('#settings_modal')).hide();
            }
        });
        $(shadowContent).on('click', '#settings_save', function () {
            const v = parseFloat($(shadowContent.querySelector('#settings_video_spend')).val());
            GM_setValue('video_spend', isNaN(v)?1:v);
            $('video').each((index,item)=>{ item.playbackRate = GM_getValue('video_spend')||1; });
            const model = $(shadowContent.querySelector('#settings_ai_model')).val();
            GM_setValue('ai_model', model);
            $(shadowContent.querySelector('#settings_modal')).hide();
        });

        $(document).on('click', '.addpro', async function (_this) {
            $(_this.currentTarget).attr("class","delpro").css("background","#f2ffc9").text("移出错题集");
            let error_problem = GM_getValue(window.my.config.id+"_error_problem");
            if(!error_problem){
                error_problem = {};
                console.log("新建错题库");
            }
            error_problem[$(_this.currentTarget.offsetParent).find(".t-index").text()] = _this.currentTarget.offsetParent.outerHTML;
            GM_setValue(window.my.config.id+"_error_problem",error_problem);
            console.log(error_problem);
        });
        $(document).on('click', '.delpro', async function (_this) {
            $(_this.currentTarget).attr("class","addpro").css("background","#c9fff5").text("添加到错题");
            let error_problem = GM_getValue(window.my.config.id+"_error_problem");
            delete error_problem[$(_this.currentTarget.offsetParent).find(".t-index").text()];
            GM_setValue(window.my.config.id+"_error_problem",error_problem);

        });    



        window.aner = $(shadowContent.querySelector("#aner"));
        window.div_zhu = $(shadowContent.querySelector("#zhu_"+menu.id));
        window.div_set = $(shadowContent.querySelector("#set"));
        window.find_input =  shadowContent.querySelector("#find_input");
        //暴露到全局
        _this.aner =window.aner
        _this.div_zhu =window.div_zhu
        _this.div_set =window.div_set
        _this.find_input = window.find_input
        
        return hostElement
    }
   

    MyPage.prototype.initData = async function(){ //初始化
        // this.api.upload_all_problem(true) //测试全局上传
        this.config.tk_uid=GM_getValue("ti_uid");
        this.config.pp = GM_getValue("pp");
        this.config.poolId = GM_getValue("poolId");
        console.log(this.config.front_url)
        //GM_getValue("overdue") != this.config.hostname ||  //暂时去除，保留登陆信息
        if(GM_getValue("overdue") == 1
        ||!this.config.tk_uid || !this.config.pp || !this.config.poolId 
        || this.config.tk_uid == "null" || this.config.pp == "null" || this.config.poolId == "null"
        || this.config.hostname == "meto")
        {
            GM_setValue("overdue",this.config.hostname)
            try{
                var obj =await this.api.get_user_obj();
                if(!obj.unionid){
                    console.log("未获取到用户id")
                    // return
                }
            }catch(e){
                console.log(e)
                aner.show("slow");
                aner.text("因恶意攻击低版本关闭快捷登录，请手动登录")
                $(shadowContent.querySelector(".drawer")).show("slow");
                return;
            }
            // aner.append(`</br>或<a href="https://metost.com/docs/download/">更新完整版</a>进行更多体验`)
            $(shadowContent.querySelector(".drawer")).show("slow");
        }
        shadowContent.querySelector("#tiku_user").value=this.config.tk_uid||"您的版本过低，请手动登录";
        try{
            this.api.init_button()
        }catch(e){
            console.log("暂时未定义button",e)
            div_zhu.append(`<button onclick='window.open("${this.HelpIP}");'><span>MeTo题库</span></button>`);
        }
        
        document.hasFocus = ()=> { //移出窗口
            return true
        }
        document.addEventListener('mouseup', ()=>{
            const yaya_select = window.getSelection().toString();
            const input = (shadowContent && shadowContent.querySelector && shadowContent.querySelector("#find_input")) || document.querySelector("#find_input") || window.find_input;
            if(yaya_select && input){ input.value = yaya_select; }
        });
        /*
        *   主要应用于智慧树不可复制
        */
        document.onselectstart = true;
        document.oncopy = true;
        document.oncut = true;
        document.onpaste = true;
        document.oncontextmenu = true;
        window.getSelection().removeAllRanges = function (){}
        window.getSelection().empty = function (){}
        
    }

    


    MyPage.prototype.prival_global= async function(){
        // 获取当前日期字符串 (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];
        const lastVisitDate = GM_getValue("last_visit_date");
        if(!lastVisitDate){//全脚本首次安装
            GM_setValue("last_visit_date", today)
            div_set.css("display","block")
            aner.css("display","block")
            aner.text("meto欢迎您的使用");
            aner.append("<br/>欢迎关注公众号meto智能体<br/>可以试着移动、点击头像<br/>装载截图识别文字(shift+↑)<br/>关闭截图识别文字(shift+↓)")
            // aner.append('<br/><div text-align: center;"><p>此页面仅在首次加载时出现</p>    <p>网络讨口子来咯（商家码）</p>    <img src="https://d.metost.com/uploads/images/IMG_2484.PNG" style="width:200px" ></div>')
        }else if(lastVisitDate != today){//每天第一次访问
            GM_setValue("last_visit_date", today)
            div_set.css("display","block")
            aner.css("display","block")
            aner.text("当前为阉割版："+GM_info.script.version);
            aner.append("<br/>最新版本5.4.*")
            aner.append("<br/>可前往<a href=\""+_this.HelpIP+"\">官网</a>安装最新脚本")
            aner.append("<br/>欢迎关注公众号meto智能体<br/>可以试着移动、点击头像<br/>装载截图识别文字(shift+↑)<br/>关闭截图识别文字(shift+↓)")
            
        }
        /*
        *  全局定时器
        */
        var flag=true;
        let GlobalInterval=setInterval(()=> {
            if($("video").length&&flag){
                flag = false
                window.my.video_spend()
            }
        }, 400)
        return this;
    }
    MyPage.prototype.findproblem = async function(text){
        let obj={
            "poolId": this.config.poolId,
            "userId":   this.config.tk_uid,
            "querry": {
                "operator": "contains",
                "argument1":"problemText",
                "argument2":text,
            }
        }
        /////
        await(this.upladApi("/tiku/api/v1/queryProblems",obj).then(async (resutData)=>{
            if(resutData.result==="success" && !!resutData.json){
                var data = resutData.json.results;
                //处理数据，添加标识头
                let obj = {
                    flag: "metoproblems",
                    problems : data,
                }
                this.config.answer =this.resoluAnswers(obj);
            }
        }))
    }

    MyPage.prototype.findproblems = async function(problems){
        let answer = []
        let obj={
            "poolId": this.config.poolId,
            "userId":   this.config.tk_uid,
            "querry": {
                "operator": "mulit",
                "argument1":"1",
                "argument2":"2",
                "problems":[]
            }
        }
        /////
        problems.forEach(problem =>{
            
            let problemobj = {
                "operator": "==",
                "argument1": "problemText",
                "argument2": problem,
            }
            obj.querry.problems.push(problemobj);
        })
        await(this.upladApi("/tiku/api/v1/queryProblems",obj).then(async (resutData)=>{
            if(resutData.result==="success" && !!resutData.json){
                var data = resutData.json.results;
                //处理数据，添加标识头
                let obj = {
                    flag: "metoproblems",
                    problems : data,
                }
                answer = this.resoluAnswers(obj)
                // console.log(this.config.answers);
            }
        }))
        return answer
    }

    MyPage.prototype.upload_papers = async function(answers,title,platform){
        
        var classname = GM_getValue(this.config.clazz_course_id)
        if(!classname){
            classname = "未命名课程";
        }
        let obj={
            "poolId": this.config.poolId,
            "userId":   this.config.tk_uid,
            "problemIds": [],
            "title":title,
            "tags":[classname,platform],
        }
        answers.rows.forEach(row=>{
            for(let i =0;i<obj.problemIds.length;i++){
                if(obj.problemIds[i] == row.problemId){
                    return;
                }
            }
            obj.problemIds.push(row.problemId); 
        });
        // console.log(obj);
        await(this.upladApi("/tiku/api/v1/collection",obj).then(async (resutData)=>{
            if(resutData.result==="success" && !!resutData.json){
                // var data = resutData.json.results;
                console.log(resutData);
            }
        }))
    }
    


    MyPage.prototype.Listener = function(){
        $('body').append(
			`<script>
			;(function() {
                
                if (typeof window.CustomEvent === 'function') return false;
        
                function CustomEvent(event, params) {
                    params = params || { bubbles: false, cancelable: false, detail: undefined };
                    // 创建自定义事件
                    var evt = document.createEvent('CustomEvent');
                    // 第一个参数为要处理的事件名
                    // 第二个参数为表明事件是否冒泡
                    // 第三个参数为表明是否可以取消事件的默认行为
                    // 第四个参数为细节参数
                    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                    return evt;
                }
        
                CustomEvent.prototype = window.Event.prototype;
        
                window.CustomEvent = CustomEvent;
            })();
            (function() {
                function ajaxEventTrigger(event) {
                    // 创建事件对象
                    var ajaxEvent = new CustomEvent(event, { detail: this });
                    // 触发执行
                    window.dispatchEvent(ajaxEvent);
                }
        
                var oldXHR = window.XMLHttpRequest;
                function newXHR() {
                    var realXHR = new oldXHR();
                    realXHR.addEventListener('abort', function() { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);
                    realXHR.addEventListener('error', function() { ajaxEventTrigger.call(this, 'ajaxError'); }, false);
                    realXHR.addEventListener('load', function() { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
                    realXHR.addEventListener('loadstart', function() { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
                    realXHR.addEventListener('progress', function() { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);
                    realXHR.addEventListener('timeout', function() { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);
                    realXHR.addEventListener('loadend', function() { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);
                    realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
                    // l.onreadystatechange = function() {
                    //     if (l && 4 === l.readyState && (0 !== l.status || l.responseURL && 0 === l.responseURL.indexOf("file:"))) {
                    //         var n = "getAllResponseHeaders"in l ? a(l.getAllResponseHeaders()) : null
                    //           , r = e.responseType && "text" !== e.responseType ? l.response : l.responseText
                    //           , i = {
                    //             data: r,
                    //             status: l.status,
                    //             statusText: l.statusText,
                    //             headers: n,
                    //             config: e,
                    //             request: l
                    //         };
                    //         o(t, f, i),
                    //         l = null
                    //     }
                    // }
                    return realXHR;
                }
        
                window.XMLHttpRequest = newXHR;
            })();
        
            // 调用
            window.addEventListener('ajaxReadyStateChange', function(e) {
                // if (e.detail.readyState === 1) {
                //     console.log(123);
                //     e.detail.setRequestHeader('token', '1326');
                // }
                e.detail.onload = function() {
                    // if(e.detail.responseURL=="https://www.mosoteach.cn/web/index.php?c=interaction_quiz&m=save_answer"){
                        console.log('event====>', e.detail);
                    // }
                    
                };
            });
            `
		)

    }

    MyPage.prototype.compareArr = function(arr1 = [], arr2 = []) {   
        // arr1.sort();
        // arr2.sort();
        const setA = new Set(arr1);
        const setB = new Set(arr2);
        const intersection = new Set([...setA].filter(x => setB.has(x))); // 交集
        const union = new Set([...setA, ...setB]); // 并集
        const differenceA = new Set([...setA].filter(x => !setB.has(x))); // a数组中有而b数组中没有的元素
        const differenceB = new Set([...setB].filter(x => !setA.has(x))); // b数组中有而a数组中没有的元素
        if (intersection.size === 0) {
          return 'disjoint'; // a、b不相交
        } else if (intersection.size === setA.size && intersection.size === setB.size) {
          return 'equal';   // a、b相等
        } else if (intersection.size === setA.size) {
          return 'subset';  // a是子集
        } else if (intersection.size === setB.size) {
          return 'superset'; // a是父集
        } else {
          return 'mix';// a、b相交但不包含
        }
    }

    MyPage.prototype.start =function(reslist){
        return this.api.start_search()
    }
    
    _this.MyPage = MyPage;
})(unsafeWindow||window);

if(window.location == window.parent.location){ // 判断是否为ifarm
    window.my = new unsafeWindow.MyPage({
        id:"mm_"+Math.floor(100000+Math.random()*100000),
        width:80,
        background:'#fff',
        opacity:0.8,
        pos:{
            x:50,
            y:50
        }
    });
}


/*
    author:alv
    date:2024年10月31日
*/
// 由于html2canvas库是二次渲染后再进行截图，但是二次渲染后所有的位置都改变了，导致无法精确截图。
(function(_this) {
    let $ = document.getElementById("yl_8") && document.getElementById("yl_8").onclick || _this.y$ || jQuery; // 此处为避免原生网页没有jquery
    var canvasImg
    var select_box
    var worker
    var offset ={
        x:0,
        y:0
    }
    var devicePixelRatio = window.devicePixelRatio || 1; // 获取设备像素比
    GM_registerMenuCommand(canvasImg? "关闭截图识别文字(shift+↓)" : "装载截图识别文字(shift+↑)"  ,function(){
        canvasImg?document.body.removeEventListener('mousedown', jietu_mouse):jietu_onload();
        canvasImg=null
    });
    document.addEventListener('keydown', function(event) {
        if (event.shiftKey && event.key === 'ArrowUp') {
            jietu_onload()
        }else if(event.shiftKey && event.key === 'ArrowDown'){
            console.log('shift + 下 关闭截图');
            document.body.removeEventListener('mousedown', jietu_mouse);
        }
    });
    
    jietu_onload = (e) =>{
        select_box = document.createElement('div');
        select_box.className = 'select_box';
        let css =`
        .select_box {
            overflow: hidden; /* 隐藏超出的内容 */
            border: 1px dashed #f00;
            position: absolute;
            pointer-events: none;
            display:block;
            z-index:999;
            // background-color: #f0f0f0;
        }
        .select_box canvas{
            cursor : move;
            position: absolute;
            z-index:1;
        }
        .select_box *{
            pointer-events: none;
            width:100%;
            font-size: 12px;
            position: absolute;
            z-index:2;
            text-shadow: 0 0 gray;
        }
        `
        GM_addStyle(css);
        
        $("html")[0].appendChild(select_box);
        var isDragging = false;
        var initX =0
        var initY =0
        var tmptop =0
        var tmpleft =0
        select_box.addEventListener('mousedown', (event) => {
            isDragging = true;
            initX = event.pageX; // 统一使用页面坐标
            initY = event.pageY; // 统一使用页面坐标
            tmptop = parseInt(canvasImg.style.top)
            tmpleft = parseInt(canvasImg.style.left)
        });

        var newX =0
        var newY = 0
        select_box.addEventListener('mousemove', (event) => {
            if (isDragging) {
                newX = event.pageX; // 统一使用页面坐标
                newY = event.pageY; // 统一使用页面坐标
                canvasImg.style.top =  tmptop-Math.floor((initY -newY)) +'px'
                canvasImg.style.left =  tmpleft-Math.floor((initX -newX))+'px'
            }
        });
        select_box.addEventListener('mouseup', () => {
            if (isDragging && (newX || newY)) {
                
                offset.y = offset.y+ Math.floor((initY -newY));
                offset.x = offset.x+ Math.floor((initX -newX));
                console.log(offset)
                initY= initX= newX =newY=0
            }
            isDragging = false;
        });
        console.log('shift + 上箭头被按下,更新截图页面');
        document.body.addEventListener('mousedown', jietu_mouse);
        capture(); //截图
        // 加载文字识别
        const lang = 'chi_sim';
            const langPath = `https://cdn.jsdelivr.net/npm/@tesseract.js-data/${lang}@1.0.0/4.0.0_best_int`;
        (async () => {
            // A worker is created once and used every time a user uploads a new file.
            worker = await Tesseract.createWorker(lang, 1, {
                corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5',
                workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5/dist/worker.min.js',
                langPath: langPath,
                logger: function(m){console.log(m);}
            });
        })();
    }

    jietu_mouse = (e) => {
        select_box.innerHTML = '';
        // select_box.innerHTML = `<button οnclick="alert('123');return false;">重置</botton>`;
        startX = e.pageX;
        startY = e.pageY;
        select_box.style.left = startX + 'px';
        select_box.style.top = startY + 'px';
        select_box.style.width = '0px';  
        select_box.style.height = '0px';
        select_box.style.display = 'block';
        document.body.style.cursor = 'crosshair'; // 鼠标悬停时更改样式
        document.body.style['user-select'] =  "none"; // 禁止选中文字

        const onMouseMove = (e) => {
            endX = e.pageX;
            endY = e.pageY;
            select_box.style.width = Math.abs(endX - startX) + 'px';
            select_box.style.height = Math.abs(endY - startY) + 'px';
            select_box.style.left = Math.min(startX, endX) + 'px';
            select_box.style.top = Math.min(startY, endY) + 'px';
        };

        const onMouseUp = () => {
            // select_box.style.display = 'none'; //关闭选取显示
            document.body.style.cursor = 'default'; // 鼠标悬停时更改样式
            document.body.style['user-select'] =  "text"; // 禁止选中解除
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            var context
            try{
                context = canvasImg.getContext('2d');
            }catch{
                select_box.innerHTML = `<p>正在渲染图片请稍后重新框选</p>`;
            }
            const width = parseInt(select_box.style.width);
            const height = parseInt(select_box.style.height);
            if(!width ||!height){
                return
            }
            canvasImg.style['pointer-events']= 'auto';
            select_box.appendChild(canvasImg); //user显示
            const x = parseInt(select_box.style.left);
            const y = parseInt(select_box.style.top);

            // 使用设备像素比进行坐标转换
            const imageData = context.getImageData(
                (x+offset.x)*devicePixelRatio, 
                (y+offset.y)*devicePixelRatio, 
                width*devicePixelRatio, 
                height*devicePixelRatio
            );
            const newCanvas = document.createElement('canvas');
            newCanvas.width = width*devicePixelRatio;
            newCanvas.height = height*devicePixelRatio;
            newCanvas.getContext('2d').putImageData(imageData, 0, 0);

            base64 = newCanvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, '')
            value = `data:image/png;base64,${base64}`
            // console.log(value) //system识别
            canvasImg.style.top = -offset.y-y +'px';
            canvasImg.style.left = -offset.x-x+'px';

            try{ //当Tesseract未加载完毕时会报错
                worker.recognize(value,'chi_sim', {
                    // logger: info => console.log(info)
                }).then(result => {
                    var text = result?.data?.text.replace(/\s/g, '')
                    if (text) {
                        console.log('【识别结果】', text);
                        // 全局暴露接口
                        let forbears_window = findTopWindow(window)
                        forbears_window.div_set.parent().show()
                        forbears_window.div_set.show();
                        forbears_window.find_input.value=text;
                    }else{
                        msg_box = document.createElement('div');
                        msg_box.innerHTML = `<p>未识别到文字，如选区中无内容请拖动选区到合适位置</br>并重新框选，如有BUG请QQ频道反馈</p>`
                        select_box.appendChild(msg_box);
                    }
                }).catch(error => {
                    console.error('【错误】', error);
                });
            }catch{
                select_box.innerHTML = `<p>识别工具暂未加载完毕,请稍等</p>`;
            }
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function capture() {
        const area = document.body;

        var options={
            scale: devicePixelRatio, // 使用设备像素比
            useCORS: true,
            scrollY: 0,
            scrollX: 0,
            // x:parseInt(select_box.style.left),
            // y:parseInt(select_box.style.top),
            // width:parseInt(select.style.width),
            // height:parseInt(select_box.style.height)
        }

        html2canvas(area,options).then(canvas => {
            // const context = canvas.getContext('2d');
            // const width = parseInt(select_box.style.width);
            // const height = parseInt(select_box.style.height);
            // const x = parseInt(select_box.style.left);
            // const y = parseInt(select_box.style.top);
            // const imageData = context.getImageData(x, y, width, height);
            // const newCanvas = document.createElement('canvas');
            // newCanvas.width = width;
            // newCanvas.height = height;
            // newCanvas.getContext('2d').putImageData(imageData, 0, 0);
            canvasImg = canvas
            

        });
    }
    function findTopWindow(windowObj) {
        if (windowObj.parent === windowObj) {
          return windowObj; // 已经是最顶层的window，返回
        } else {
          return findTopWindow(windowObj.parent); // 递归查找
        }
      }
    
})(unsafeWindow||window);
