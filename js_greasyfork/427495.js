// ==UserScript==
// @name         清爽百度
// @version      0.6.1.0
// @description  这是一个登录净化百度首页的脚本,个人使用
// @author       想吃糖
// @match        https://www.baidu.com/
// @grant        none
// @namespace https://greasyfork.org/users/597361
// @downloadURL https://update.greasyfork.org/scripts/427495/%E6%B8%85%E7%88%BD%E7%99%BE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/427495/%E6%B8%85%E7%88%BD%E7%99%BE%E5%BA%A6.meta.js
// ==/UserScript==
(async function() {
    'use strict';
    if((window.location.href).split("/")[2] != "www.baidu.com") return false;
    class InitSetting{
        constructor(){
            this.initSetting()
            this.sid = $.cookie.get("H_PS_PSSID");
            this.IsLoginBool = $('.s-top-login-btn').text() == '登录' ? true : false;
            //初始化 净化设置
            this.createSetting();
            //初始化 一言
            this.createhitokoto();
            this.createSettingElement();
            this.init();
            console.log(this.BaiduSetting)
            console.log("初始化InitSetting...");
        }
        createSetting(){
            let SettingDiv = document.createElement("div");
            SettingDiv.innerText = "净化设置";
            SettingDiv.className = "s-top-right-text c-font-normal c-color-t";
            $(SettingDiv).click(()=>{$("#SettingBgc").fadeIn()});
            $("#u1>#s-usersetting-top").before(SettingDiv);
        }
        initSetting(){
            if(!this.LocalstorageGet("BaiduSetting"))this.LocalstorageSet({"color":"black"},"BaiduSetting")
            //获取默认设置
            this.BaiduSetting = this.LocalstorageGet("BaiduSetting");
        }
        createSettingElement(){
            var that = this;
            let SettingCard = document.createElement("div");
            let SettingBgc = document.createElement("div");
            $(SettingBgc).attr("id","SettingBgc");
            let SettingFot = document.createElement("div");
            let SettingHead = document.createElement("div");
            $(SettingHead).css({
                "padding":"1rem"
            })
            SettingHead.className = "SettingHead";
            SettingCard.className = "SettingCard";
            $(SettingBgc).css({
                "width":"100%",
                "height":"100%",
                "background":"#0000002e",
                'position': 'fixed',
                "z-index":"999999999",
                "display":"none"
            })
            $(SettingCard).css({
                "width":"20rem",
                "height":"15rem",
                "background":"white",
                'position': 'fixed',
                'left': '50%',
                'top': '50%',
                'transform': 'translate(-50%,-50%)',
                "border-radius":"20px"
            });
            // 配置
            $(SettingHead).html(`
           <div style="display:flex;justify-content:space-around;">一言颜色设置:<input type="text" id="SettingColor" value="${this.BaiduSetting.color}" placehloder="填入色值默认黑色"></div>



            `);
            let CardBottomOncanl = document.createElement("div");
            CardBottomOncanl.innerText = "取消";
            let CardBottomOk = document.createElement("div");
            $([CardBottomOncanl,CardBottomOk]).css({"cursor":"pointer"})
            //取消事件
            $([CardBottomOncanl]).click(()=>$("#SettingBgc").fadeOut());
            //保存事件
            $(CardBottomOk).click(()=>that.onSettingok());
            CardBottomOk.innerText = "保存";
            $(SettingFot).html(CardBottomOk);
            $(CardBottomOk).before(CardBottomOncanl);
            $(SettingFot).css({
                "position":"absolute",
                "bottom" :"0.5rem",
                "right" :"2rem",
                "width" :"5rem",
                "display":"flex",
                "justify-content":"space-around"
            });
            $(SettingCard).html(SettingFot);
            $(SettingFot).before(SettingHead)
            $("#wrapper>#head").before(SettingBgc);
            $(SettingBgc).html(SettingCard);
        }
        onSettingok(){
            this.BaiduSetting.color = $('#SettingColor').val();
            this.LocalstorageSet(this.BaiduSetting);
            alert("刷新后可看到效果!");
            $("#SettingBgc").fadeOut();
        }
        createhitokoto(){
            let that = this;
            //一言模块
            fetch('https://v1.hitokoto.cn/?c=a').then(function (response) {return response.json();}).then(function (myJson) {
                var myText = document.createElement('div');
                myText.className = 'hitokoto';
                $(myText).css({
                    'position': 'absolute',
                    'left': '50%',
                    'top': '50%',
                    'transform': 'translate(-50%,-50%)',
                    'width': '200%',
                    'textOverflow': 'ellipsis',
                    'whiteSpace': 'normal',
                    'textAlign': 'center',
                    'fontSize': '1.6rem',
                    'color': that.BaiduSetting.color
                })
                myText.innerText = myJson.hitokoto;
                //一言的作者 处理
                var fromWho = '';
                if (myJson.from_who == null)fromWho = '';
                //时间处理
                var CreateTime = new Date(parseFloat(myJson.created_at + '000'));
                var CreatTime = CreateTime.toLocaleDateString() + CreateTime.toLocaleTimeString();
                myText.innerHTML += '<span id="spanText" style="font-size:1rem;">' + '<br>' + '来自—' + myJson.from + '   ' + fromWho + '   ' + CreatTime + '</span>';
                $(IsLogin).append(myText);
            });
        }
        init(){
            if(this.IsLoginBool)return;
            //初始化请求百度配置
            $.ajax({
                url: "https://www.baidu.com/home/page/data/settinghome",
                type: "GET",
                data:{sid:this.sid},
                dataType: "jsonp", //指定服务器返回的数据类型
                success: function (data) {
                    window.localStorage.IsNewPage = false;
                    if(data)window.localStorage.IsNewPage = data.bsData.settingelem[1].tipsvalue;
                }
            });
        }
        LocalstorageGet(params="BaiduSetting"){
            let data = window.localStorage[params];
            data = data ? JSON.parse(window.localStorage[params]) : undefined;
            return data
        }
        LocalstorageSet(options,params="BaiduSetting"){return window.localStorage[params] = JSON.stringify(options)}
    }
    new InitSetting();
    var IsLogin = $('.s-top-login-btn').text() == '登录' ? "#lg" : "#s_fm";
    var IsLoginBool = $('.s-top-login-btn').text() == '登录' ? true : false;
    var ClearVal = `#s_lg_img,.s-hotsearch-title,#hotsearch-content-wrapper,#s-top-left,#bottom_layer,#s_side_wrapper,#s_top_wrap`;
    //输入框清空事件
    //$('.self-btn').click(()=>{ setTimeout(function(){ $('.s_ipt').val('');  $('.hitokoto').hide() },150) });
    $("#kw").bind("input propertychange",function(e){
        MasterFun();
    });
    //下拉框 去掉不协调白色
    let SelUlInval = setInterval(()=>{
        if($("#form>.bdsug-new>ul")[0]){
            $("#form>.bdsug-new>ul").css({"border":"none"});
            clearInterval(SelUlInval);
        }
    },200)
    $("#kw").bind("focus",()=>{
        console.log("focus")
        setTimeout(()=>{
            let SelUlInval = setInterval(()=>{
                if($("#form>.bdsug-new>ul")[0]){
                    $("#form>.bdsug-new>ul").css({"border":"none"});
                    clearInterval(SelUlInval);
                }
            },50)
            },150)
    })
    // 精简部分
    var BaiduImgSIn = setInterval(()=>{
        if($('#s_lg_img')[0]){
            $(ClearVal).hide();
            //输入框
            $('#kw').css({
                "background":"#0000002e"
            })
            //未登录和登录态两种处理方式
            if(IsLoginBool){
                $("span.soutu-btn").css({
                    "background":"url(https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/searchbox/nicon-10750f3f7d.png) no-repeat",
                    "background-position-y":"-50px",
                })
            }else{
                //上传小相机背景
                $("span#s_kw_wrap>span:first-child").css({
                    "background":"url(https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/searchbox/nicon-10750f3f7d.png) no-repeat",
                    "background-position-y":"-50px",
                })
            }
            clearInterval(BaiduImgSIn);
        };
    },100);
    //下拉框
    var BaiduSelSIn = setInterval(()=>{
        if($('div.bdsug.bdsug-new.bdsugbg')[0] || $("div.bdsug.bdsug-new")[0]){
            $('div.bdsug.bdsug-new.bdsugbg,div.bdsug.bdsug-new').css({"background":"#0000002e"});
            //输入框下拉的
            clearInterval(BaiduSelSIn);
        };
    },100);
    //输入框
    var BaiduInputSIn = setInterval(()=>{
        if($('#kw').val()){
            MasterFun();
            clearInterval(BaiduInputSIn);
        }
    },100);
    function MasterFun(){
        //如果是未登录状态
        if(IsLoginBool){
            $('.bdsug.bdsug-new.bdsugbg').css({"background":"white"});
            $('#kw').css({"background":"transparent"});
            let False = setInterval(()=>{
                if($('.bdsug.bdsug-new.bdsugbg')[0]){
                    $('.bdsug.bdsug-new.bdsugbg').css({"background":"white"});
                }
                clearInterval(False)
            },50)
            }
        $(".bdsug-new>ul").css({"border":"none"});
        setTimeout(()=>{$(".bdsug-new>ul").css({"border":"none"});},200)
        if(window.localStorage.IsNewPage != "false" )return;
        $(".bdsug").css({"background":"rgba(255, 255, 255, 0.77)"});
        $(".hitokoto").hide();
        $(".s_ipt").css({"border":"none"});
        $(".bgcImg").css({"opacity":"0.3","z-index":"-1","width":"100%"});
        $(".wrapper_new #head #page").css({"background":"transparent"});
        $("#page").css({"background":"transparent"});
        //输入后 输入框变成默认颜色
        $('#kw').css({"background":"transparent"});
        //下拉变回默认颜色
        if($('div.bdsug.bdsug-new.bdsugbg')[0]){
            $('div.bdsug.bdsug-new.bdsugbg').css({"background":"white"});
        }
    }
})();