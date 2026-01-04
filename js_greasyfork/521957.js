// ==UserScript==
// @name         城市美日常辅助工具NEW
// @namespace    http://tampermonkey.net/
// @version      0.2.03
// @description  城市美日常辅助工具。
// @author       城市美
// @match        https://*.baidu.com/*
// @match        https://gzwy.gov.cn/dsfa/nc/pc/course/views/*
// @match        https://gzwy.gov.cn/page.html#/pc/nc/pagecourse/coursePlayer
// @match        https://*.gov.cn/*
// @match        *.gov.cn/*
// @match        *
// @match        http://*.gzjxjy.gzsrs.cn/*
// @match        http://www.gzjxjy.gzsrs.cn/*
// @match        http://www.gzjxjy.gzsrs.cn/personback/*
// @match        http://www.gzjxjy.gzsrs.cn/personback/#/courseNet
// @match        https://www.gzjxjy.gzsrs.cn/*
// @match        https://www.gzjxjy.gzsrs.cn/personback/*
// @match        https://www.gzjxjy.gzsrs.cn/personback/#/courseNet
// @match        https://gzjxjy.gzsrs.cn/*
// @require
// @require      https://update.greasyfork.org/scripts/522211/1511565/jQueryv214.js
// @grant        GM_xmlhttpRequest
// @connect      cx.icodef.com
// @connect      q.icodef.com
// @connect      www.tikuhai.com
// @connect      tk.enncy.cn

// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/521957/%E5%9F%8E%E5%B8%82%E7%BE%8E%E6%97%A5%E5%B8%B8%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7NEW.user.js
// @updateURL https://update.greasyfork.org/scripts/521957/%E5%9F%8E%E5%B8%82%E7%BE%8E%E6%97%A5%E5%B8%B8%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7NEW.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    // 定义站点模块匹配
    addToolBox(); // 基本界面
    addRibbon(); // 业务模块主控
})();


//业务模块主控
function addRibbon(){
    var timerInterval_ToolBox
    var CreateOpt={
        Obj_Css:{
            'font-size': '14px',
            'text-align': 'center',
            'height':'100%',
        }
    };
    var pageURL = $(location).attr("href");
    timerInterval_ToolBox = self.setInterval(function(){
        console.log("Notifiy");
        if ($("#My_ToolBox").length>0){
            // 1.1、百度测试业务模块
            if (My_matchStr(pageURL,"https://*.baidu.com/*") || My_matchStr(pageURL,"*.muketool.com/*") ) {
                CreateOpt=Object.assign(CreateOpt,{
                    Obj_Parent_Id:"My_ToolBoxBody",
                    Obj_Id:"My_BaiduTemp",
                    Obj_Title1:"百度测试：",
                    Obj_Title2:"请点击2",
                    Obj_Click_Fn:Obj_Click_Fn.百度测试业务模块
                });
                Create_Button_public(CreateOpt);
            }

            // 1.2、自动播放业务模块 调用 （贵州省党员干部网络学院）
            if (My_matchStr(pageURL,"https://gzwy.gov.cn/*") || My_matchStr(pageURL,"https://*.gov.cn/*")) {
                addRibbon_VideoAutoPlay();
                CreateOpt=Object.assign(CreateOpt,{
                    Obj_Parent_Id:"My_ToolBoxBody",
                    Obj_Id:"My_gzwy_gov_cn",
                    Obj_Title1:"",
                    Obj_Title2:"一键完成VUE",
                    Obj_Click_Fn:Obj_Click_Fn.贵州省党员干部网络学院
                });
                Create_Button_public(CreateOpt);
                // 面板重布局 （贵州省党员干部网络学院）
                $("#My_ToolBox").css({
                    'min-height': 'auto',
                    'top': '120px',
                    'left':'auto',
                    'right':'10px'
                });
            }

            // 1.3、自动播放业务模块 调用 （贵州省专业技术人员继续教育）
            if (My_matchStr(pageURL,"https://*.gzjxjy.gzsrs.cn/*")||My_matchStr(pageURL,"https://gzjxjy.gzsrs.cn/*")) {
                addRibbon_VideoAutoPlay();
                CreateOpt=Object.assign(CreateOpt,{
                    Obj_Parent_Id:"My_ToolBoxBody",
                    Obj_Id:"My_gzjxjy_gzsrs_cn",
                    Obj_Title1:"",
                    Obj_Title2:"一键完成VUE",
                    Obj_Click_Fn:Obj_Click_Fn.贵州省专业技术人员继续教育
                });
                Create_Button_public(CreateOpt);
            }
        };
        clearInterval(timerInterval_ToolBox); // 清除定时器
    }, 1000);

    // 2、通用控件构造器
    function Create_Button_public(CreateOpt){
        var Dom = "<div id='"+CreateOpt.Obj_Id+"Box'>"+CreateOpt.Obj_Title1+"<spen id='"+CreateOpt.Obj_Id+"Button' Style='cursor:pointer'>"+CreateOpt.Obj_Title2+"</spen></div>";
        $("#"+CreateOpt.Obj_Parent_Id).append(Dom);
        $("#"+CreateOpt.Obj_Id+"Box").css(CreateOpt.Obj_Css);
        $("#"+CreateOpt.Obj_Id+"Button").on("click",CreateOpt.Obj_Click_Fn);
    };

    //3、网站业务_Click_Function 点击方法模块
    var Obj_Click_Fn = {
        百度测试业务模块:async function(){
            console.log("模块化Fn输出_Obj_Click_Fn_百度测试业务模块");

            // 题库海请求 测试未通过，待测试。api文档来源 https://www.tikuhai.com/fans/api
            // https://www.tikuhai.com/fans/
            // key	5b744a8d5c251ce6ba9bf1986944a7d0	是	string	秘钥
            // question	不是金黄色葡萄球菌引起的疾病是	是	string	题目
            // option	["食物中毒", "肉毒毒素中毒", "烫伤样皮肤综合征", "毒性休克综合征"]	是	string	选项数组字符串
            // questionData	<div><h1>不是金黄色葡萄球菌引起的疾病是</h1>...</div>	否	string	题目原格式html,可不传
            // var opt={
            //     method:'POST',
            //     url:"https://www.tikuhai.com/api/accurateSearch",
            //     headers:{"Content-Type": "application/x-www-form-urlencoded",}, // application/json 表示请求体是 JSON 格式的数据，application/x-www-form-urlencoded 表示请求体是表单数据。
            //     data:{
            //         key:"5b744a8d5c251ce6ba9bf1986944a7d0",
            //         question:"不是金黄色葡萄球菌引起的疾病是",
            //         option:["食物中毒", "肉毒毒素中毒", "烫伤样皮肤综合征", "毒性休克综合征"],
            //         questionData:"<div><h1>不是金黄色葡萄球菌引起的疾病是</h1></div>"
            //     },
            //     timeout:5000
            // }

            // 王一之题库2请求 测试未通过，待测试。api文档来源 https://tk.enncy.cn/user/dashboard
            // var question = "不是金黄色葡萄球菌引起的疾病是";
            // var token="wYfKwnj1QPNkK0Ql";
            // var simple="false";
            // var opt={
            //     method:"POST",
            //     url:"http://cx.icodef.com/wyn-nb?v=4",
            //     headers:{"Content-Type": "application/x-www-form-urlencoded; charset=utf-8","Authorization": token},
            //     data:{question: "不是金黄色葡萄球菌引起的疾病是",title: "不是金黄色葡萄球菌引起的疾病是"}
            // };


            // （免费）王一之题库1请求 测试通过。api文档来源 https://q.icodef.com/question/api#%E4%BD%BF%E7%94%A8-curl-%E5%AE%9E%E7%8E%B0%E7%A4%BA%E4%BE%8B
            var question = encodeURI("不是金黄色葡萄球菌引起的疾病是");
            var token="wYfKwnj1QPNkK0Ql";
            var simple="false";
            var opt={
                method:"GET",
                url:`https://q.icodef.com/api/v1/q/${question}?simple=${simple}`,
                headers:{"Content-Type": "application/x-www-form-urlencoded","Authorization": token,},
                data:""
            };

            // （收费/新注册免100次）言溪题库请求 测试通过。 api文档来源 https://tk.enncy.cn/user/dashboard
            // var token = "1bfdc88c5e3842d2adb6d91afd357637";
            // var title = "不是金黄色葡萄球菌引起的疾病是";
            // var options =encodeURI(JSON.stringify(["食物中毒", "肉毒毒素中毒", "烫伤样皮肤综合征", "毒性休克综合征"]));
            // var type = 1;
            // var opt={
            // method:"GET",
            // url:`https://tk.enncy.cn/query?token=${token}&title=${title}&options=${options}&type=${type}`,
            // headers:{"Content-Type": "application/x-www-form-urlencoded"},
            // data:""
            // };

            // 请求部分
            var res = await __answerApi_Promise_GM_xmlhttpRequest(opt).then( res => { return res;}).catch( error => { return error;});
            console.log('最终输出:', __JSONStrToJSONObject(res.responseText));
        },
        贵州省党员干部网络学院:function(){
            //console.log("模块化Fn输出_Obj_Click_Fn_贵州省党员干部网络学院");
            //$("video")[0].pause();
            //__this.pause();
            var __this = $("#app")[0].__vue__.$children[0].$children[0].$children[0].$children[0].$children[0].$children[0];
            var t = {
                courseId: __this.queryiId,
                coursewareId: __this.curPlayItem && __this.curPlayItem.id,
                watchPoint: __this.formatSeconds(__this.curVideoAllTime),
                pulseRate: __this.playrate,
                pulseTime: 10,
            };
            if (__this.isView == 1) {
                t = Object.assign(t, { isView: 1 });
            };
            __this.realWatchTime2 = __this.curVideoAllTime;
            //console.log(__this.formatSeconds(__this.realWatchTime2));
            __this.updateProgress(t);
        },
        贵州省专业技术人员继续教育:function(){
            //console.log("模块化Fn输出_Obj_Click_Fn_贵州省专业技术人员继续教育");
            $("#app")[0].__vue__.$children[0].player.tech_.setCurrentTime($("#app")[0].__vue__.$children[0].totalHour);
            $("#app")[0].__vue__.$children[0].onPlayerEnded();
        }
    }



    //4、自动播放业务模块
    function addRibbon_VideoAutoPlay(){
        var timerInterval_AutoPlay
        var timerInterval_ProgressUnlock
        var mydate
        var mytime
        var mydatetime


        //添加控件 智能播放
        var My_VideoAutoPlayBox = "<div id='My_VideoAutoPlayBox'>智能播放：<spen id='My_VideoAutoPlayButton' Style='cursor:pointer'>已停用</spen></div>";
        $("#My_ToolBoxBody").append(My_VideoAutoPlayBox);
        $("#My_VideoAutoPlayBox").css({
            'font-size': '14px',
            'text-align': 'center',
            'height':'100%',
            // 'line-height': '42px',
            // 'background-color': '#2ffe84',
            // 'cursor': 'pointer'
        });

        //添加控件 倍数播放
        var My_VideoPlaySpeedBox = "<div id='My_VideoPlaySpeedBox'>倍数播放：<spen id='My_VideoPlaySpeedButton' Style='cursor:pointer'>1x</spen></div>";
        $("#My_ToolBoxBody").append(My_VideoPlaySpeedBox);
        $("#My_VideoPlaySpeedBox").css({
            'font-size': '14px',
            'text-align': 'center',
            'height':'100%',
            // 'line-height': '42px',
            // 'background-color': '#2ffe84',
            // 'cursor': 'pointer'
        });

        //绑定事件  倍数播放控件(单击事件)
        $("#My_VideoPlaySpeedButton").on("click",function(){
            if ($("#My_VideoPlaySpeedButton").text()=="1x") {
                $("#My_VideoPlaySpeedButton").text("10x");
            } else {
                $("#My_VideoPlaySpeedButton").text("1x");
            }
        });

        //进度条解锁
        timerInterval_ProgressUnlock = self.setInterval(function(){
            //currentTime
            if($("#app")[0].__vue__.$children[0].currentVideoStatHour==$("video")[0].duration){
                $("#My_JumpPlayButton").text("一键完成");
                $("#My_JumpPlayButton").css('color', '#fff');
            }else{
                $("#My_JumpPlayButton").text("一键完成");
                $("#My_JumpPlayButton").css('color', '#fff');
            }
        },1000);

        //绑定事件  智能播放控件(单击事件)
        $("#My_VideoAutoPlayButton").on("click",function(){
            let fgjobj_click_count = 0
            if ($("#My_VideoAutoPlayButton").text()=="已停用") {
                $("#My_VideoAutoPlayButton").text("已启用");
                timerInterval_AutoPlay = self.setInterval(function(){

                    //查找video，后台持续播放部分
                    if ($("video").length>0){
                        $("video").trigger('play');//后台持续播放
                        // $("video").prop('muted', true);//静音
                        // $("video").prop('playbackRate', '16');//加速
                        if($("#My_VideoPlaySpeedButton").text()=="10x"){
                            $("video").prop('playbackRate', '10');
                        }else{
                            $("video").prop('playbackRate', '1');
                        }
                    };

                    //添加自动下一视频
                    if($(".active span:contains('已学完')").length>0){
                        if($(".active").html()!=$(".is-flex").html()){
                            $(".active").next().children(".el-step__main").children(".el-step__title").children("p").click();
                            mydate = new Date();
                            mytime=mydate.toLocaleTimeString(); //获取当前时间
                            mydatetime=mydate.toLocaleString( ); //获取日期与时间
                            console.log(mydatetime + "  " + $(".active").find("p").attr("title")+ "  已完成学习。");
                            console.log(mydatetime + "  切换播放下一视频：" + $(".active").next().find("p").attr("title"));
                        }
                    }


                    //查找“防挂机提醒，请点击确定继续学习”，点击确定
                    var fgjobj=$("div>p:contains('防挂机提醒，请点击确定继续学习')").parent().next().children().children()
                    if (fgjobj.length>0 && fgjobj.text()=="确 定"){
                        fgjobj.click();
                        fgjobj_click_count=fgjobj_click_count+1
                        mydate = new Date();
                        mytime=mydate.toLocaleTimeString(); //获取当前时间
                        mydatetime=mydate.toLocaleString( ); //获取日期与时间
                        console.log(mydatetime + "  平台 防挂机提醒 点击 "+ fgjobj_click_count + " 次。");
                    };
                    // console.clear();
                    // mydate = new Date();
                    // mytime=mydate.toLocaleTimeString(); //获取当前时间
                    // mydatetime=mydate.toLocaleString( ); //获取日期与时间
                    // console.log(mydatetime);

                }, 1000);
            } else {
                $("#My_VideoAutoPlayButton").text("已停用");
                clearInterval(timerInterval_AutoPlay); // 清除定时器
                // console.log("已停用");
            }
        });
    };








}



//基本界面
function addToolBox(){
    var ToolBox = "<div id='My_ToolBox' ></div>";

    var timerInterval_Body
    timerInterval_Body = self.setInterval(function(){
        if ($("body").length>0){
            clearInterval(timerInterval_Body);
            // alert("body已加载")

            $("body").before(ToolBox);
            /*
        方法：
        1、元素之前.before()；
        2、元素之后.after()；
        3、元素内部的结尾插入append()；
        4、元素内部的开头插入.prepend()。
        */
            $("#My_ToolBox").css({
                // 'width':120,
                // 'width':5,
                // 'height':50,
                'display': 'block',
                'vertical-align': 'top',
                // 'background-color': '#25ae84',
                'background-color': '#1155ff',
                'color': '#ffffff',
                'margin-bottom': '2px',
                'z-index':99999,
                'position': 'fixed',
                'top':'100px',
                'left':'11px',
                '-moz-user-select':'none',
                '-webkit-user-select':'none'
                // 'text-align': 'center',
                // 'line-height': '42px',
                // 'cursor': 'pointer'
            });

            var ToolBoxTille = "<div id='My_ToolBoxTille'>工具面板</div>";
            $("#My_ToolBox").append(ToolBoxTille);
            $("#My_ToolBoxTille").css({
                'font-size': '16px',
                'text-align': 'center',
                'line-height': '42px',
                'display':'none'
                // 'cursor': 'pointer'
            });

            var ToolBoxBody = "<div id='My_ToolBoxBody'></div>";
            $("#My_ToolBox").append(ToolBoxBody);
            $("#My_ToolBoxBody").css({
                // 'width':80,
                'font-size': '16px',
                'text-align': 'center',
                'height':'100%',
                'line-height': '42px',
                'display':'none'
                // 'background-color': '#2ffe84',
                // 'cursor': 'pointer'
            });

            var ToolBoxDisplay = "<div id='My_ToolBoxDisplay'>＋</div>";
            $("#My_ToolBox").append(ToolBoxDisplay);
            $("#My_ToolBoxDisplay").css({
                'font-size': '16px',
                'text-align': 'center',
                // 'height':'auto',
                // 'line-height': '42px',
                'background-color': '#ff0000',
                'cursor': 'pointer',
                'position': 'absolute',
                'top': '-11px',
                'right': '-11px',
                'border-radius': '50%',
                'height': '23px',
                'width': '23px',
            });

            //绑定事件
            $("#My_ToolBoxDisplay").on("click",function(){

                if ($("#My_ToolBoxDisplay").text()=='×') {
                    $("#My_ToolBoxTille,#My_ToolBoxBody").css({
                        'display':'none'
                    });
                    $("#My_ToolBoxDisplay").css({
                        'display':'block'
                    });
                    $("#My_ToolBoxDisplay").text('＋');
                } else {
                    $("#My_ToolBoxTille,#My_ToolBoxBody").css({
                        'display':'block'
                    });
                    $("#My_ToolBoxDisplay").css({
                    });
                    $("#My_ToolBoxDisplay").text('×');
                }
            });

        };
    }, 1000);

}



//公共函数部分

//1、通用 通配符字符串比较
function My_matchStr(str1,str2){
    // 用法：
    // My_matchStr(原始字符串,带通配符字符串)
    // 返回true/false
    // 仅支持*，不支持?
    return matchRuleShort(str1,str2);
    // matchRuleShort(原始字符串,带通配符字符串)
    // alert(
    //     "1. " + matchRuleShort("bird123", "bird*") + "\n" +
    //     "2. " + matchRuleShort("123bird", "*bird") + "\n" +
    //     "3. " + matchRuleShort("123bird123", "*bird*") + "\n" +
    //     "4. " + matchRuleShort("bird123bird", "bird*bird") + "\n" +
    //     "5. " + matchRuleShort("123bird123bird123", "*bird*bird*") + "\n" +
    //     "6. " + matchRuleShort("s[pe]c 3 re$ex 6 cha^rs", "s[pe]c*re$ex*cha^rs") + "\n" +
    //     "7. " + matchRuleShort("should not match", "should noo*oot match") + "\n"
    // );
    function matchRuleShort(str, rule) {
        var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
    };
    function matchRuleExpl(str, rule) {
        var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        rule = rule.split("*").map(escapeRegex).join(".*");
        rule = "^" + rule + "$"
        var regex = new RegExp(rule);
        return regex.test(str);
    };
};


// 2、通用 ajax + Promise请求 // 弃用 跨域问题
// var res = await __ajax(opt).then( res => { return res;}).catch( error => { return error;})  // 弃用 跨域问题
async function __ajax(opt={
    type:'POST',
    url:"http://127.0.0.1:8080/saveData",
    contentType:"application/x-www-form-urlencoded; charset=utf-8", // application/json 表示请求体是 JSON 格式的数据，application/x-www-form-urlencoded 表示请求体是表单数据。
    data:{param1:0, param2:0},
    timeout:5000
}){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: opt.type,
            url: opt.url,
            //属性 contentType 用于告诉服务器请求体的数据类型是什么，默认值为 application/x-www-form-urlencoded，
            //application/json 表示请求体是 JSON 格式的数据，application/x-www-form-urlencoded 表示请求体是表单数据。
            contentType: opt.contentType,

            //属性 processData 用于指定 data 属性值是否需要自动转换，默认为 true。
            //processData: false,

            //属性 data 用于指定发送到服务器的数据，类型可以是 Key/Value 对、JSON 字符串、FromData 对象等，
            //此时此处 data 属性值将自动转换为表单数据格式并放在请求体中。
            // data: JSON.stringify(opt.data),
            data: opt.data,
            //JavaScript 内置对象 JSON 的方法stringify()，用于将 JavaScript 对象转换成 JSON 格式的字符串。
            //data: JSON.stringify({ param1:value1,param2:value2 }),
            success: (result)=>{
                // console.log(JSON.parse(result));
                console.log("ajax_success");
                resolve(result)
            },
            timeout: opt.timeout,
            error: (xhr, status, error)=>{
                console.log("请求失败，请稍后重试!");
                console.log(xhr);
                console.log(status);
                console.log(error);
                reject(error)
            }
        })
    });
}

// question	不是金黄色葡萄球菌引起的疾病是	是	string	题目
// option	["食物中毒", "肉毒毒素中毒", "烫伤样皮肤综合征", "毒性休克综合征"]	是	string	选项数组字符串
// 3、通用 GM_xmlhttpRequest + Promise请求
async function __answerApi_Promise_GM_xmlhttpRequest(opt={
    // method:"POST",
    // url:"",
    // headers:{"Content-Type": "application/json;charset=utf-8","Authorization": "TOKEN",},
    // data:JSON.stringify({"question": "不是金黄色葡萄球菌引起的疾病是","options": ["食物中毒", "肉毒毒素中毒", "烫伤样皮肤综合征", "毒性休克综合征"],"type": 1})
}){
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: opt.method,
            url: opt.url,
            headers: opt.headers,
            data: opt.data,
            onload: function(res) {
                try {
                    resolve(res);
                } catch (e) {
                    resolve([]);
                }
            },
            onerror: function(e) {
                console.log(e);
                resolve([]);
            }
        });
    });
}


// 4、通用 JSON字符串转JSONObject
function __JSONStrToJSONObject(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return obj;
            } else {
                return str;
            }
        } catch(e) {
            return str;
        }
    }else{
        return str;
    }
}
