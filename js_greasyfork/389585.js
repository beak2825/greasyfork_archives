// ==UserScript==
// @name         虎牙自动弹幕及页面精简等功能、斗鱼页面精简及检测广告弹窗、百度翻译精简[更多关注 纯净科技公众号]
// @namespace    https://mp.weixin.qq.com/s/H3twfD4wXZuxFjyNQMYepA
// @require		 https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require       https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @version      3.2.5
// @description  出现页面布局问题 ctrl + f5 刷新一次[更多福利关注 纯净科技公众号]
// @description  公众号教程地址最初版本教程地址:https://mp.weixin.qq.com/s/H3twfD4wXZuxFjyNQMYepA
// @description  斗鱼脚本功能: 自动精简斗鱼页面以及自动检测屏蔽广告等讨厌弹窗;自动发送弹幕暂时不添加;自动开启屏蔽功能
// @description  虎牙脚本功能: 自动发送弹幕;自动精简虎牙页面(非常精简,不喜欢请关闭脚本);自动开启屏蔽功能(屏蔽进场消息、礼物特效和消息等);破解关键字输入限制;自动检测回复怼
// @description  百度翻译: 因为作者经常使用感觉多余的部分强迫症不舒服,所以去掉了...
// @description  知乎弹窗移除
// @description  阿里开发社区登录弹窗移除
// @description  优化执行代码
// @description  csdn 复制/自动展开
// @description  优化虎牙平台精简体验
// @description  掘金UI调整
// @author       Bitle
// @license      MIT
// @match        *://www.huya.com/*
// @match        *://www.douyu.com/*
// @match        *://fanyi.baidu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @match        *://developer.aliyun.com/*
// @match        *://blog.csdn.net/*
// @match        *://juejin.cn/*
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/389585/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95%E5%8F%8A%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80%E7%AD%89%E5%8A%9F%E8%83%BD%E3%80%81%E6%96%97%E9%B1%BC%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80%E5%8F%8A%E6%A3%80%E6%B5%8B%E5%B9%BF%E5%91%8A%E5%BC%B9%E7%AA%97%E3%80%81%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%B2%BE%E7%AE%80%5B%E6%9B%B4%E5%A4%9A%E5%85%B3%E6%B3%A8%20%E7%BA%AF%E5%87%80%E7%A7%91%E6%8A%80%E5%85%AC%E4%BC%97%E5%8F%B7%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/389585/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95%E5%8F%8A%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80%E7%AD%89%E5%8A%9F%E8%83%BD%E3%80%81%E6%96%97%E9%B1%BC%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80%E5%8F%8A%E6%A3%80%E6%B5%8B%E5%B9%BF%E5%91%8A%E5%BC%B9%E7%AA%97%E3%80%81%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%B2%BE%E7%AE%80%5B%E6%9B%B4%E5%A4%9A%E5%85%B3%E6%B3%A8%20%E7%BA%AF%E5%87%80%E7%A7%91%E6%8A%80%E5%85%AC%E4%BC%97%E5%8F%B7%5D.meta.js
// ==/UserScript==
(function() {
    let host = document.domain;
    let cssReg = /!important/;
    let hostObject = {
        "huya":"www.huya.com",
        "douyu":"www.douyu.com",
        "zhihu":"zhuanlan.zhihu.com",
        "csdn":"csdn.net"
    };

    // 要移除的配置信息 document window timer
    var removeObject = {
        "www.huya.com":{
            "removeElementSelector":[
                ".mod-sidebar",
                ".room-footer",
                ".box-crumb",
                ".room-sidebar-hd",
                ".player-gift-wrap",
                ".special-bg",
                ".hy-side",
                '.room-mod-ggTop',
                '#player-login-tip-wrap',
                ".room-gg-chat",
                "#huya-ab",
            ],
            "loadingType":"document",
            "css":{
                ".js-responded-list":["marginLeft","10px"],
                ".mod-list":{
                    "width":"99%",
                    "padding":"0",
                },
                ".box-bd":["marginRight","unset"],
                ".player-ctrl-wrap":["position","unset"],
                ".player-ctrl-wrap":["marginTop","1px"],
                ".main-room":{
                    "padding":"10px 0 0 8px"
                },
                ".main-wrap":{
                    "padding":"0",
                },
                ".chat-room__bd":["height","100%"],
                ".chat-room":["height","520px"],
                ".roomBlockWords-list":{
                    "zIndex":"999999",
                    "height":"333px",
                    "overflow":"scroll",
                },
                ".game-live-item":{
                    "width":"unset!important",
                },
                ".live-list":{
                    "display": "flex",
                    "justify-content": "space-around",
                    "flex-flow": "row wrap"
                },
                ".list-adx":{
                    "width":"85%",
                    "margin": "0 auto"
                }
            },
            "attr":{
                "#js-live-list":["class","live-list"],
            }
        },
        "www.douyu.com":{
            "removeElementSelector":[
                '.layout-Aside'
                ,'#js-bottom',
                ".Title-impress",
                ".Title-videoSiteLink",
                '.Title-roomOtherBottom',
                '.layout-Player-toolbar',
                '.SignBaseComponent-sign-box',
                '.AppFlow is-show',
                '.UPlayerLotteryEnter',
                '.layout-Player-guessgame',
                '.LotteryContainer',
                '.layout-Player-announce',
                '.layout-Player-rank',
                '.ChatTabContainer',
                '.closeBg-998534',
                '#js-player-toolbar',
                '.SuperFansGuideTips',
                '.Act156581',
                '.PcDiversion',
                '.HeaderGif-left',
                '.HeaderGif-right',
                '.Title-anchorFriend',
                '.SociatyLabel',
                '.Title-addFriend',
                '.ActSuperFansGroup'
            ],
            "loadingType":"window",
            "css":{
                ".layout-Player-barrage'":["top","0"],
                ".layout-Main":["margin","0"],
                ".layout-Main":["padding","0"],
                ".layout-Player-main":["height", "110%"],
                ".Title":["height", "90px"],
                ".Title-anchorPic":["height", "90px"],
                ".Title-anchorPic":["width", "90px"],
                ".layout-Player-title":["marginBottom", "0"],
            }
        },
        "fanyi.baidu.com":{
            "removeElementSelector":['.header','#transOtherRight','.footer'],
            "loadingType":"document"
        },
        "zhuanlan.zhihu.com":{
            "removeElementSelector":[".Modal-wrapper",".css-1ynzxqw"],
            "loadingType":"timer",
            "css":{
                "html":["overflow","scroll"],
            }
        },
        "developer.aliyun.com":{
            "removeElementSelector":[".ace-overlay-wrapper"],
            "loadingType":"document",
            "css":{
                "html":["overflow","scroll"],
            },
        },
        "csdn.net":{
            "removeElementSelector":[
                ".passport-login-container",
                ".blog_container_aside",
                "#rightAside",
                ".more-toolbox-new",
            ],
            "loadingType":"document",
            "css":{
                ".prettyprint":["user-select","auto"],
                "code":["user-select","auto"],
                "#mainBox":["width","100%"],
                ".blog-content-box":{
                    "width":"75%",
                    "margin": "0 auto",
                },
                "main":["width","100%"],
                ".csdn-side-toolbar":["left","1846px"],
                "pre":{
                    "width":"unset",
                    "user-select":"auto"
                },
            },
            "attr":{
                "code":["onclick","mdcp.copyCode(event)"],
                ".hljs-button":{
                    "class":"hljs-button",
                    "data-title":"点击复制",
                    "onclick":"setTimeout(function(){$('.hljs-button').attr('data-title', '点击复制');},3500);"
                }
            }
        },
        "juejin.cn":{
            "removeElementSelector":[
                ".sidebar",
                ".article-suspended-panel",
                ".extension"
            ],
            "loadingType":"window",
            "css":{
                ".main-area":["width","unset"],
            },
        }
    }

    var $_ = function(para){
        let judgeSelect = para.toString().substring(0,1);
        let valueSelect = para.toString().substring(1);
        var el;
        if(judgeSelect==="."){
            el = document.getElementsByClassName(valueSelect)[0];
        }else if(judgeSelect==="#"){
            el = document.getElementById(valueSelect);
        }

        return el;
    }

    // 公用判断执行方法
    var judgeFn = (host,loading)=>{
        let loadingType = removeObject[host]["loadingType"];

        if(loadingType==loading){
            let arr = removeObject[host]["removeElementSelector"];
            let css = removeObject[host]["css"];
            let attr = removeObject[host]["attr"];

            if(css){
                for(let k in css){
                    if(getType(css[k]) == "Object"){
                        for(let j in css[k]){
                            if(cssReg.test(css[k][j])){
                                $(k).css("cssText", `${j}:${css[k][j]}`);
                            }else{
                                $(k).css(css[k]);
                            }
                        }
                    }else{
                        if(cssReg.test(css[k][1])){
                            $(k).css("cssText", `${css[k][0]}:${css[k][1]}`);
                        }else{
                            $(k).css(css[k][0],css[k][1]);
                        }
                    }
                }
            }

            if(attr){
                for(let k in attr){
                    if(getType(attr[k]) == "Object"){
                        $(k).attr(attr[k]);
                    }else{
                        $(k).attr(attr[k][0],attr[k][1]);
                    }
                }
            }

            perform_removal(arr);
        }
    }

    // 执行移除
    var perform_removal = (arr)=>{
        for(let i = 0;i< arr.length;i++){
            if($(arr[i]).length>0){
                $(arr[i]).remove();
            }
        }
    }

    // 判断数组还是对象
    function getType(type){
        if(typeof type == 'object'){
            if( typeof type.length == 'number' ){
                return 'Array';
            }else{
                return 'Object';
            }
        }else{
            return 'param is no object type';
        }
    }

    // 虎牙房间 弹幕关闭
    var huya_barrage_closed=function(host){
        if(host == hostObject.huya){
            if($.cookie("yyuid") == null){
                window.localStorage.setItem("TT_ROOM_SHIELD_CFG_0_",'{"20001":1,"20002":1,"20003":1,"20004":1,"20005":3,"20006":0,"20007":0,"20008":0,"30000":0}');
            }else{
                let setName = "TT_ROOM_SHIELD_CFG_0_"+$.cookie("yyuid");
                window.localStorage.setItem(setName,'{"20001":1,"20002":1,"20003":1,"20004":1,"20005":3,"20006":0,"20007":0,"20008":0,"30000":0}');
            }
        }
    }

    // huya 定时处理控制方法
    function huyaControl (){
        if(host == hostObject.huya){
            if($(".shielding-effect-select").length==0){
                $(".shielding-effect-btn").click();
            }

            let c2 = $("J_input")[1];
            let d2 = $(".roomBlockWords-list")[1];

            if($_('.J_input')||c2){
                if(c.getAttribute("maxlength")=="10"||$_('.J_input').getAttribute("disabled")==""||c2.getAttribute("maxlength")=="10"||c2.getAttribute("disabled")==""){
                    $_('.J_input').removeAttribute("disabled");
                    $_('.J_input').setAttribute("maxlength","n");

                    c2.removeAttribute("disabled");
                    c2.setAttribute("maxlength","n");
                }
            }

            if(d2){
                d2.style.overflow ="scroll";
                d2.style.height ="336px";
                d2.style.zIndex = "99999";
            }
        }
    }

    // csdn 定时处理控制方法[自动展开]
    function csdnControl (){
        if(host == hostObject.csdn){
            if($(".hide-preCode-bt").length>0){
                $(".hide-preCode-bt").click();
            }
        }
    }

    // 定时器检测
    var s = setInterval(function () {
        judgeFn(host,"timer");
        huyaControl();
    },0);

    // 随文档加载
    judgeFn(host,"document");
    csdnControl();

    // window 加载
    window.onload = function(){
        judgeFn(host,"window");
        huya_barrage_closed(host);
    }

    var str_div = (function(){/*
			<div id="open"
        style="user-select: none;cursor:pointer;width: 40px;height: 40px;border-radius:6px;background:#65c294;position: fixed;right: 100px;bottom:60px;color: #111331;text-align: center;z-index: 99999;display: flex;flex-direction: column;justify-content: flex-start;">
        <div class="drag"
            style="font-size: 10px;box-sizing:border-box;border-bottom: 1px solid yellow;line-height:20px;">拖动</div>
        <div class="move" style="font-size: 10px;box-sizing:border-box;border-top: 1px solid yellow;line-height:20px;">
            展开</div>
    </div>
    <div id="barrage"
        style="user-select: none;display:none;position:fixed;top:0;background: #65c294;width: 200px;height: 230px;z-index: 999999999999;">
        <div id="head"
            style="color: #ffffff;height: 30px;text-align: center;border-bottom: 1px solid #eeeeee;cursor: pointer;">
            <div class="reply"
                style="margin-left: 3px;font-size: 15px;float: left;color: #ffffff;font-weight: bold;line-height: 30px;box-sizing: border-box;width: 30px;background: #111331">
                怼</div>
            <div style="font-size: 12px;float: left;line-height: 30px;width: 134px;">自动弹幕</div>
            <div class="close"
                style="font-size: 15px;float: left;color: #ffffff;font-weight: bold;line-height: 30px;box-sizing: border-box;width: 30px;background: #111331">
                藏</div>
        </div>
        <div id="barrageContent" style="margin-top: 3px;">
            <div style="height: 30px;">
                <span
                    style="color: #ffffff;font-size: 15px;line-height: 30px;vertical-align:top;margin-left: 3px;">时间(s):</span>
                <textarea id="setTime" placeholder="默认10s"
                    style="width: 80px;vertical-align:top;line-height: 8px;resize: none;color: #232323;padding-top: 9px;"></textarea>
            </div>
            <div style="height: 130px;">
                <span
                    style="color: #ffffff;font-size: 15px;line-height: 30px;vertical-align:top;margin-left: 3px;">输入弹幕:</span>
                <textarea id="barrage_text" placeholder="多个弹幕请换行"
                    style="width: 187px;height: 90px;resize: none;margin-left: 3px;"></textarea>
            </div>
        </div>
        <div id="reply" style="display:none;">
            <div>
                <span style="color: #ffffff;font-size: 12px;margin-left: 3px;">关键字:</span>
                <textarea id="setKey" placeholder="关键字目前只能输入一个"
                    style="width: 187px;height:44px;margin-left: 3px;line-height: 8px;resize: none;color: #232323;padding-top: 9px;"></textarea>
            </div>
            <div>
                <span style="color: #ffffff;font-size: 12px;margin-left: 3px;">回怼弹幕:</span>
                <textarea id="reply_text" placeholder="多个回复随机弹幕请换行"
                    style="width: 187px;height: 46px;resize: none;margin-left: 3px;"></textarea>
            </div>
        </div>
        <div id="comfirm"
            style="color: #ffffff;font-size: 15px;width:100%;height: 30px;line-height: 30px;text-align:center;background: green;cursor: pointer;position: absolute;bottom: 0;">
            开始执行</div>
    </div>
		*/}).toString().split('/*')[1].split('*/')[0].replace(/[\n]/g, '');

    if(host == hostObject.huya){
        $("body").append(str_div);
        $('#head').mousedown(function (e) {
            var positionDiv = $(this).offset();
            var distenceX = e.pageX - positionDiv.left;
            var distenceY = e.pageY - positionDiv.top;

            $(document).mousemove(function (e) {
                var x = e.pageX - distenceX;
                var y = e.pageY - distenceY;
                if (x < 0) {
                    x = 0;
                } else if (x > $(document).width() - $('#barrage').outerWidth(true)) {
                    x = $(document).width() - $('#barrage').outerWidth(true);
                }
                if (y < 0) {
                    y = 0;
                } else if (y > $(document).height() - $('#barrage').outerHeight(true)) {
                    y = $(document).height() - $('#barrage').outerHeight(true);
                }
                let obj = { x: x, y: y };
                window.localStorage.setItem("coordinate", JSON.stringify(obj));

                $('#barrage').css({
                    'left': x + 'px',
                    'top': y + 'px'
                });
            });
            $(document).mouseup(function () {
                $(document).off('mousemove');
            });
        });


        $('.drag').mousedown(function (e) {
            var positionDiv = $(this).offset();
            var distenceX = e.pageX - positionDiv.left;
            var distenceY = e.pageY - positionDiv.top;

            $(document).mousemove(function (e) {
                var x = e.pageX - distenceX;
                var y = e.pageY - distenceY;
                if (x < 0) {
                    x = 0;
                } else if (x > $(document).width() - $('#open').outerWidth(true)) {
                    x = $(document).width() - $('#open').outerWidth(true);
                }
                if (y < 0) {
                    y = 0;
                } else if (y > $(document).height() - $('#open').outerHeight(true)) {
                    y = $(document).height() - $('#open').outerHeight(true);
                }
                let obj = { x: x, y: y };
                window.localStorage.setItem("coordinate_two", JSON.stringify(obj));

                $('#open').css({
                    'left': x + 'px',
                    'top': y + 'px'
                });
            });
            $(document).mouseup(function () {
                $(document).off('mousemove');
            });
        });
        $(".move").click(function () {
            $("#open").slideToggle();
            $("#barrage").slideToggle();
            let x = JSON.parse(window.localStorage.getItem("coordinate")).x;
            let y = JSON.parse(window.localStorage.getItem("coordinate")).y;
            $('#barrage').css({
                'left': x + 'px',
                'top': y + 'px'
            });
        });
        $(".close").click(function () {
            $("#barrage").slideToggle();
            $("#open").slideToggle();
        });
        var comfirmStatus = true;
        var stop1, stop2;
        var pageStatus = true;
        var relaseBarrage = [];
        var relaseKey = [];
        var Barrage = [];
        var checkReply = [];
        var defualtTime = 10;
        let random_ = function (len) {
            let rand = Math.floor(Math.random() * len);
            return rand;
        }
        let countTime = function (time) {
            let second = time * 1000;
            let len = $('#barrage_text').val().split("\n").length;
            let pageStatus_ = JSON.parse(window.localStorage.getItem("pageStatus"));
            Barrage = $('#barrage_text').val().split("\n");
            $('#comfirm').text("停止执行");
            $('#comfirm').css("backgroundColor", "red");
            stop1 = setInterval(function () {
                $(".chat-room__input>span").attr("class", "btn-sendMsg enable");
                $('#pub_msg_input').val(Barrage[random_(len)]);
                $('.btn-sendMsg').click();
            }, second);
        }
        let changeTime = function () {
            let randomTime = Math.random() * (5 - 1) + 1;
            return parseFloat(randomTime.toFixed(2));
        }
        $('#comfirm').click(function () {
            let pageStatus_ = JSON.parse(window.localStorage.getItem("pageStatus"));
            if (pageStatus_ === true || pageStatus_ === null) {
                if (comfirmStatus === true) {
                    comfirmStatus = false;
                    var reg = new RegExp("^[0-9]*$");
                    let value = parseInt($('#setTime').val());
                    window.localStorage.setItem("barrageText", JSON.stringify($('#barrage_text').val()));
                    if (reg.test(value)) {
                        let rdtime = value + changeTime();
                        window.localStorage.setItem("countTime", JSON.stringify(value));
                        countTime(rdtime);
                    } else if ($('#setTime').val() == "") {
                        countTime(defualtTime);
                    } else {
                        alert("时间填写不是数字");
                    }
                } else {
                    comfirmStatus = true;
                    $('#comfirm').text("开始执行");
                    $('#comfirm').css("background", "green");
                    clearInterval(stop1);
                }
            } else {
                if (comfirmStatus === true) {
                    comfirmStatus = false;
                    let times_ = changeTime()*1000;
                    window.localStorage.setItem("setKey", JSON.stringify($('#setKey').val()));
                    window.localStorage.setItem("replyText", JSON.stringify($('#reply_text').val()));
                    stop2 = setInterval(repyRule,3000+times_);
                    $('#comfirm').text("停止执行").css("background", "red");
                } else {
                    comfirmStatus = true;
                    $('#comfirm').text("开始执行").css("background", "green");
                    clearInterval(stop2);
                }
            }
        });

        let repyRule = function(){
            let name_ = $("#chat-room__list > li:last-of-type >.msg-normal>.name").text();
            let msg_ = $("#chat-room__list > li:last-of-type >.msg-normal>.msg").text();
            let relaseBarrageLen = $('#reply_text').val().split("\n").length;
            relaseBarrage = $('#reply_text').val().split("\n");
            relaseKey = $('#setKey').val().split("\n");
            let check = new RegExp(relaseKey[0], 'g');

            if (check.test(msg_)) {
                //console.log("@"+name_+"=>"+relaseBarrage[random_(relaseBarrageLen)]);
                $(".chat-room__input>span").attr("class", "btn-sendMsg enable");
                $('#pub_msg_input').val("@"+name_+"=>"+relaseBarrage[random_(relaseBarrageLen)]);
                $('.btn-sendMsg').click();
            }
        }

        $(".reply").click(function () {
            let pageStatus_ = JSON.parse(window.localStorage.getItem("pageStatus"));
            let countTime = JSON.parse(window.localStorage.getItem("countTime"));
            let barrageText = JSON.parse(window.localStorage.getItem("barrageText"));
            let replyText_ = JSON.parse(window.localStorage.getItem("replyText"));
            let setKey_ = JSON.parse(window.localStorage.getItem("setKey"));
            comfirmStatus = true;
            clearInterval(stop1);
            clearInterval(stop2);
            $('#comfirm').text("开始执行");
            $('#comfirm').css("background", "green");
            if (pageStatus_ === null || pageStatus_ === true) {
                window.localStorage.setItem("pageStatus", JSON.stringify(false));
                $('#setKey').val(setKey_);
                $('#reply_text').val(replyText_);
                $("#barrageContent").slideToggle();
                $("#reply").slideToggle();
            } else {
                window.localStorage.setItem("pageStatus", JSON.stringify(true));
                $('#setTime').val(countTime);
                $('#barrage_text').val(barrageText);
                $("#barrageContent").slideToggle();
                $("#reply").slideToggle();
            }

        })

        $(document).ready(function () {
            let x = JSON.parse(window.localStorage.getItem("coordinate_two")).x;
            let y = JSON.parse(window.localStorage.getItem("coordinate_two")).y;
            let countTime = JSON.parse(window.localStorage.getItem("countTime"));
            let barrageText = JSON.parse(window.localStorage.getItem("barrageText"));
            let replyText_ = JSON.parse(window.localStorage.getItem("replyText"));
            let setKey_ = JSON.parse(window.localStorage.getItem("setKey"));
            let pageStatus_ = JSON.parse(window.localStorage.getItem("pageStatus"));
            $('#open').css({
                'left': x + 'px',
                'top': y + 'px'
            });
            if (pageStatus_ === true || pageStatus_ === null) {
                $("#barrageContent").css("display", "block");
                $("#reply").css("diplay", "none");
                $('#setTime').val(countTime);
                $('#barrage_text').val(barrageText);
            } else {
                $("#barrageContent").css("display", "none");
                $("#reply").css("display", "block");
                $('#setKey').val(setKey_);
                $('#reply_text').val(replyText_);
            }
        });
    }
})();