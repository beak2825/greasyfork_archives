// ==UserScript==
// @name         用户同步信息
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  try to take over the world!
// @author       xgm
// @match        https://www.douyin.com/search/*
// @match        https://www.douyin.com/video/*
// @match        https://www.douyin.com/note/*
// @match        https://www.douyin.com/user/*
// @match        https://www.douyin.com/discover*
// @match        https://www.xiaohongshu.com/explore*
// @match        https://www.xiaohongshu.com/user/profile/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      End-User License Agreement
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/498581/%E7%94%A8%E6%88%B7%E5%90%8C%E6%AD%A5%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/498581/%E7%94%A8%E6%88%B7%E5%90%8C%E6%AD%A5%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 自定义css
    let div_css = `
        .cyOperate{
            width: 500px;
            max-height: 700px;
            overflow-y: auto;
            padding: 15px 20px;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            right: 15%;
            top: 50%;
            transform: translateY(-50%);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 99999;
            color: #333;
            box-sizing: initial;
        }
        .cyInp input{
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin-left: 20px;
        }
        .cyBtn{
            text-align: center;
        }
        .cyBtn button{
            width: 150px;
            height: 35px;
            background-color: #0096DB;
            color: #fff;
            border: 0;
            border-radius: 3px;
            cursor: pointer;
            font-size: 16px;
            letter-spacing: 3px;
        }
        .cyloading{
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999999;
            display: none;
        }
        .cyloading svg{
            width: 300px;
            height: 300px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -150px;
            margin-top: -150px;
        }
        .cyloading svg text{
            font-size: 2px;
        }
        .cyInp {
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin:0 0 20px 10px;
        }
        .keyword {
           margin:20px 0;
        }
        .title {
           font-size:16px;
           font-weight:500;
           color:blue;
        }
        .h1_content{
        font-size:22px;
        font-weight:bold;
        display:none;
        }
    `
    // 引用自定义css
    GM_addStyle(div_css);

    let div = `
        <div class="cyOperate">
            <div class="cyBtn">
             <div class="h1_content"><span id="content_text"></span>将在<span id="countdown">60</span> 秒后重新加载</div>
                <button>开始</button>
            </div>
        </div>
        <div class="cyloading">
            <svg
            version="1.1"
            id="dc-spinner"
            xmlns="http://www.w3.org/2000/svg"
            x="0px" y="0px"
            width:"38"
            height:"38"
            viewBox="0 0 38 38"
            preserveAspectRatio="xMinYMin meet"
            >
            <text x="7" y="21" font-family="Monaco" font-size="2px" style="letter-spacing:0.6" fill="#fff">达人抓取中，请勿关闭
            <animate
                attributeName="opacity"
                values="0;1;0" dur="1.8s"
                repeatCount="indefinite"/>
            </text>
            <path fill="#373a42" d="M20,35c-8.271,0-15-6.729-15-15S11.729,5,20,5s15,6.729,15,15S28.271,35,20,35z M20,5.203
            C11.841,5.203,5.203,11.841,5.203,20c0,8.159,6.638,14.797,14.797,14.797S34.797,28.159,34.797,20
            C34.797,11.841,28.159,5.203,20,5.203z">
            </path>
            <path fill="#373a42" d="M20,33.125c-7.237,0-13.125-5.888-13.125-13.125S12.763,6.875,20,6.875S33.125,12.763,33.125,20
            S27.237,33.125,20,33.125z M20,7.078C12.875,7.078,7.078,12.875,7.078,20c0,7.125,5.797,12.922,12.922,12.922
            S32.922,27.125,32.922,20C32.922,12.875,27.125,7.078,20,7.078z">
            </path>
            <path fill="#2AA198" stroke="#2AA198" stroke-width="0.6027" stroke-miterlimit="10" d="M5.203,20
                    c0-8.159,6.638-14.797,14.797-14.797V5C11.729,5,5,11.729,5,20s6.729,15,15,15v-0.203C11.841,34.797,5.203,28.159,5.203,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                calcMode="spline"
                keySplines="0.4, 0, 0.2, 1"
                keyTimes="0;1"
                dur="2s" repeatCount="indefinite" />
            </path>
            <path fill="#859900" stroke="#859900" stroke-width="0.2027" stroke-miterlimit="10" d="M7.078,20
            c0-7.125,5.797-12.922,12.922-12.922V6.875C12.763,6.875,6.875,12.763,6.875,20S12.763,33.125,20,33.125v-0.203
            C12.875,32.922,7.078,27.125,7.078,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur="1.8s"
                repeatCount="indefinite" />
            </path>
            </svg>
        </div>
    `
    $("body").append(div);
    let rex = window.location.href;
    // apiHost
    var apiHost = "https://api.oa.cyek.com/";
    const version = "1.0.4"
    // 查找抖音数据id
    function searchData(object, data) {
        for (var key in object) {
            if (object[key] == object[data]){
                // console.log(key)
                return key
            };
            for(var i in object[key]){
                // console.log(i);
                if(i == data){
                    return key;
                }
            }
        }
    }
    function hasDoubleQuestionMark(url) {
        // 使用正则表达式匹配第一个问号后的内容
        let match = url.match(/\?(.*)\?/);
        if (match) {
            let contentAfterFirstQuestionMark = match[1];
            let newUrl = url.replace(/\?.*\?/, "?");
            return newUrl
        } else {
            return url
        }
    }
    let intervals
    const countdown = (text,callback,time=60)=>{
        clearInterval(intervals); // 清除之前的计时器
        var countdownTimer = time;
        intervals = setInterval(function() {
            document.querySelector(".h1_content").style.display = "flex";
            document.getElementById("content_text").innerText =text;
            document.getElementById("countdown").innerText = countdownTimer;
            countdownTimer--;
            if (countdownTimer < 0) {
                clearInterval(intervals);
                document.querySelector(".h1_content").style.display = "none";
                if(callback) {
                    callback()
                }else{
                    window.location.reload();
                }
            }
        }, 1000);
    }

    function req(url,data,sucFun,specialFun){
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
            onload: function(res) {
                if (res.status == 200) {
                    var text = res.responseText;
                    var json = JSON.parse(text);
                    // console.log(json);
                    if(json.code == 1000){
                        sucFun(json)
                    }else if(json.code == 1002){
                        window.close()
                    }else{
                        window.close()
                        if (typeof(specialFun) == "function") {
                            specialFun()
                        }
                    }
                }
            }
        });
    }

    function getCookie(cname)
    {
        var name = cname + "=";
        var ca = document.cookie.split(';').reverse();
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }
    if(rex.match(/https:\/\/www.douyin.com\/note\/*/)){
        window.close()
    }
    //抖音视频发文
    if(rex.match(/https:\/\/www.douyin.com\/video\/*/)){
        const urlParams = new URLSearchParams(unsafeWindow.location.search);
        const isKeyword = urlParams.get('type');
        if(!isKeyword)return
        $(".cyloading").show()
       var originalSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function() {
                var self = this;
                // 监听readystatechange事件，当readyState变为4时获取响应
                this.onreadystatechange = function() {
                    if (self.readyState === 4) {
                        if (self.responseURL.match(/https:\/\/www.douyin.com\/aweme\/v1\/web\/aweme\/detail\/*/) != null) {
                            // 在获取到响应后执行你的操作
                            var json = JSON?.parse(self?.response||"null");
                            const detail = json?.aweme_detail
                            console.log(json,'detail')
                            if(json){
                                const data = {
                                    ukey:"sec_uid",
                                    uvalue:detail?.author?.sec_uid,
                                    title:detail?.desc,
                                    desc:detail?.desc,
                                    outside_video_id:detail?.aweme_id,
                                    type:detail?.media_type?detail?.media_type==4?1:2:0,
                                    collect_count:detail?.statistics?.collect_count,
                                    comment_count:detail?.statistics?.comment_count ,
                                    digg_count:detail?.statistics?.digg_count,
                                    share_count:detail?.statistics?.share_count,
                                    cate:JSON.stringify(detail?.video_tag),
                                    tag:JSON.stringify(detail?.text_extra),
                                    cover:detail?.video.cover?.url_list[0],
                                    cover_list:JSON.stringify(detail?.video?.cover?.url_list),
                                    cover_width:detail?.video?.cover.width,
                                    cover_height:detail?.video.cover.height,
                                    play_addr:JSON.stringify(detail?.video.play_addr),
                                    bit_rate:JSON.stringify(detail?.video.bit_rate),
                                    video_dura:detail?.music?.video_duration ||Math.round(Number(detail?.duration/1000)),
                                    video_width:detail?.video.play_addr.width,
                                    video_height:detail?.video.play_addr.height,
                                    video_size:detail?.video.play_addr.data_size,
                                    post_time:detail?.create_time,
                                    images:JSON.stringify(detail?.images),
                                    is_top:detail?.is_top
                                }
                                let saveUid = {
                                    "platform_id":1,
                                    "app_type": "tools_" + 1,
                                    "app_id": "1",
                                    "sign": "1",
                                    "sec_uid":detail?.author?.sec_uid,
                                    "access_token": token,
                                    "result": JSON.stringify([data])
                                }
                                req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
                                    console.log('发文信息获取完毕，关闭页面')
                                    window.close()
                                    $(".cyloading").hide()
                                })
                                }else{
                                    setTimeout(()=>{
                                        window.close()
                                    },3000)
                                }
                        }
                    }
                };
                // 调用原始的send方法
                originalSend.apply(this, arguments);
            };
        countdown("页面重新加载",()=>window.close())
    }
    if(rex.match(/https:\/\/www.douyin.com\/discover\/*/) != null) {//抖音发文
        function processData(url) {
            // 取出下一批数据进行处理
            console.log(`${url}数据获取`)
            // 如果还有数据需要处理
            if (url){
                // 处理数据
                window.open(url)
                document.onvisibilitychange=()=>{
                    if(!document.hidden){
                        getList()
                    }
                }
            } else {
               alert("抓取完毕")
            }
        }
        const getList = ()=>{
            req(apiHost+"/spider/browser/getExcepDyUrl",{},function(res){
                processData(res?.result)
            })
        }
        // 抓取达人
        $(".cyBtn button").click(function(){
            getList()
        })
    }
    //用户页
    if(rex.match(/https:\/\/www.douyin.com\/user\/*/) != null){
        const keyword = localStorage.getItem('keyword');
        const urlParams = new URLSearchParams(unsafeWindow.location.search);
        const isKeyword = urlParams.get('type');
        const wid = urlParams.get('wid');
        const sec_uid = unsafeWindow.location.pathname.split("/")[2]
        var token = localStorage.getItem("token");
        console.log(isKeyword,wid,sec_uid,333333333)
        if(!isKeyword)return
        $(".cyloading").show()
        // 获取抖音json数据
        let text = $("#RENDER_DATA").text();
        let decode = JSON.parse(decodeURIComponent(text));
        let dy_max_cursor = 0
        const workTime = Date.now() - (90 * 24 * 60 * 60 * 1000);
        //以下是用户信息同步功能 暂时不用
        let user;
        // 拦截响应
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.send = function() {
            var self = this;
            // 监听readystatechange事件，当readyState变为4时获取响应
            this.onreadystatechange = function() {
                if (self.readyState === 4) {
                    if (self.responseURL.match(/https:\/\/www.douyin.com\/aweme\/v1\/web\/user\/profile\/other\/*/) != null) {
                        // 在获取到响应后执行你的操作
                        var json = JSON.parse(self.response);
                        let user = json.user
                        let account_tag,cert;
                        // 判断抖音达人账号类别
                        if(user?.is_ban == true){
                            account_tag = "封禁号"
                        }else if(user?.is_ban == undefined){
                            account_tag = "注销号"
                        }else if(user?.enterprise_verify_reason != ""){
                            account_tag = "蓝v"
                            cert =user?.enterprise_verify_reason
                        }else if(user?.custom_verify != ""){
                            account_tag = "黄v"
                            cert =user?.custom_verify
                        }
                        // 检测达人是否可以绑定
                        var dataBind = {
                            "app_type": "tools_"+1,
                            "app_id": 1,
                            "sign": 1,
                            "access_token": token,
                            "sec_uid": sec_uid,
                            "platform_id": 1,
                            "link": window.location.href,
                            "author_id":  user?.uid,
                            "nick": user?.nickname,
                            "account": user?.unique_id,
                            "avatar": user?.avatar_300x300.url_list[0],
                            "desc": user?.signatur,
                            "like_count": user?.total_favorited,
                            "fans_count": user?.mplatform_followers_count,
                            "video_count": user?.aweme_count,
                            "cate_str": '',
                            "sex": user?.basic_info?.gender == 0 ? 1 : 2,
                            "diy":{
                                "short_id": user?.short_id,
                                "location": user?.ip_location ? user?.ip_location?.split("：")[1] : "",
                                "cert":cert||"",
                            },
                            "v": "5.5.2",
                            "account_tag": account_tag
                        }
                        req(apiHost+"/spider/browser/syncInfo",dataBind,function(response){
                            console.log('用户信息获取完毕',dataBind)
                            window.close()
                            $(".cyloading").hide()
                        })
                    }
                }
            };
            // 调用原始的send方法
            originalSend.apply(this, arguments);
        };
        countdown("页面刷新倒计时",()=>window.location.reload())
    }
//搜索页
    if(rex.match(/https:\/\/www.douyin.com\/search\/*/) != null){
        function processData(url) {
            // 取出下一批数据进行处理
            console.log(`${url}数据获取`)
            // 如果还有数据需要处理
            if (url){
                // 处理数据
              window.open(hasDoubleQuestionMark(url))
                document.onvisibilitychange=()=>{
                    if(!document.hidden){
                        getList()
                    }
                }
            } else {
                console.log(`==============用户抓取完毕==============`)
            }
        }
        const getList = ()=>{
            req(apiHost+"/spider/browser/getExcepDyUrl",{},function(res){
               processData(res?.result)
            })
        }
 // 抓取达人
        $(".cyBtn button").click(function(){
            getList()
        })
    }
    //小红书 /www.xiaohongshu.com/user/profile
    if(rex.match(/https:\/\/www.xiaohongshu.com\/explore\/*/) != null){
        function processData(url) {
            // 取出下一批数据进行处理
            console.log(`${url}数据获取`)
            // 如果还有数据需要处理
            if (url){
                // 处理数据
                window.open(hasDoubleQuestionMark(url))
                document.onvisibilitychange=()=>{
                    if(!document.hidden){
                        getList()
                    }
                }
            } else {
               alert(`==============用户抓取完毕==============`)
            }
        }
        const getList = ()=>{
            req(apiHost+"/spider/browser/getExcepXhsUrl",{},function(res){
                processData(res?.result)
            })
        }
        // 抓取达人
        $(".cyBtn button").click(function(){
            getList()
        })
    }
    if(rex.match(/https:\/\/www.xiaohongshu.com\/website-login\/captcha\/*/)){
        countdown("页面刷新倒计时",()=>window.location.reload(),3600)
    }
    if(rex.match(/https:\/\/www.xiaohongshu.com\/user\/profile\/*/) != null){
        // 获取小红书数据
        const urlParams = new URLSearchParams(unsafeWindow.location.search);
        let xhs_secUid = window.location.pathname.split("/")
        let sec_uid = xhs_secUid[xhs_secUid.length - 1];
        const isKeyword = urlParams.get('type');
        if(!isKeyword)return
        $(".cyloading").show()
        window.onload = function() {
            let user = unsafeWindow?.__INITIAL_STATE__?.user.userPageData?._rawValue
            console.log('页面加载完毕！',user);
            let userData = {
                target_user_id: sec_uid
            }
            if(typeof(user) != "undefined" && user !== null && Object.keys(user).length != 0){
                console.log("window拿到用户接口")
                user.basic_info = user.basicInfo
                redInfo(user)
            }else{
               alert("用户信息获取失败")
            }
            function redInfo(user){
                if(user?.userAccountStatus?.toast=="账号封禁") return window.close()
                // 粉丝数
                let fansCount = user.interactions[1].count.replace("+","")
                let fans_count;
                // console.log(fansCount)
                if(fansCount.indexOf("k") != -1){
                    fans_count = fansCount.replace("k","")*1000
                }else if(fansCount.indexOf("万") != -1){
                    fans_count = fansCount.replace("万","")*10000
                }else{
                    fans_count = fansCount
                }
                // 抖音author_id
                let author_id = xhs_secUid[xhs_secUid.length - 1];
                // 昵称
                let nick = user.basic_info.nickname;
                // account号
                let account = user.basic_info.redId;
                // 分类
                let cate = "";
                // 获赞数
                let like_count = "";
                // 位置
                let location = user.basic_info.ipLocation;
                // 头像
                let avatar = user.basic_info.imageb;
                // 简介
                let desc = user.basic_info.desc;
                // 获赞数
                let likeCount = user.interactions[2].count.replace("+","")
                if(likeCount.indexOf("k") != -1){
                    like_count = likeCount.replace("k","")*1000
                }else if(likeCount.indexOf("w") != -1){
                    like_count = likeCount.replace("w","")*10000
                }else{
                    like_count = likeCount
                }
                // 作品数
                let video_count = "";
                // 平台id
                let platform_id = 4;
                // 性别
                let sex = user.basic_info.gender == 0 ? 1 : 2;
                let account_tag, cert;
                let userType = user?.verifyInfo?.redOfficialVerifyType
                if(userType == 2){
                    account_tag = "蓝v"
                    cert = nick
                }else if(userType == 1){
                    account_tag = "红v"
                    cert = nick
                }else if(user?.tags?.find(e=>e?.tagType=="profession")?.name){
                    account_tag = "定向博主"
                    cert = user?.tags?.find(e=>e?.tagType=="profession")?.name ||""
                }
                // 自定义字段
                let diy = {
                    "location": location,
                    "cert":cert||"",
                    "userType":userType
                };
                var dataBind = {
                    "app_type": "tools_"+platform_id,
                    "app_id": 1,
                    "sign": 1,
                    "sec_uid": sec_uid,
                    "platform_id": platform_id,
                    "link": window.location.href,
                    "author_id": author_id,
                    "nick": nick,
                    "account": account,
                    "avatar": avatar,
                    "desc": desc,
                    "like_count": like_count,
                    "fans_count": fans_count,
                    "video_count": video_count,
                    "cate_str": cate,
                    "sex": sex,
                    "diy": diy,
                    "account_tag":account_tag||"",
                    "v": version
                }
                req(apiHost+"/spider/browser/syncInfo",dataBind,function(response){
                    console.log('用户信息同步完毕',dataBind)
                    window.close()
                    $(".cyloading").hide()
                })
            }
    }
        countdown("页面刷新倒计时",()=>window.location.reload())
    }

    // 登录框拖拽
    function dragInfo(yTop,yBot){
        var _move1=false;//移动标记
        var _x1,_y1;//鼠标离控件左上角的相对位置
        $(".cyOperate").click(function(){
            //alert("click");//点击（松开后触发）
        }).mousedown(function(e){
            //console.log(e);
            _move1=true;
            _x1=e.pageX-parseInt($(".cyOperate").css("left"));
            _y1=e.pageY-parseInt($(".cyOperate").css("top"));
            // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
        });
        $(document).mousemove(function(e){
            if(_move1){
                var x=e.pageX-_x1;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y1;
                // console.log("y",y);
                if(x < 0){
                    x = 0;
                }else if(x > $(document).width() - $('.cyOperate').outerWidth(true)){ // 判断是否超出浏览器宽度
                    x = $(document).width() - $('.cyOperate').outerWidth(true)
                }
                if (y < yTop) {
                    y = yTop;
                } else if (y > $(window).height() - $('.cyOperate').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                    y = $(window).height() - $('.cyOperate').outerHeight(true) + yBot;
                }
                $(".cyOperate").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move1=false;

            // 记录每次拖拽后位置存储
            localStorage.setItem("elLeftLogin",$(".cyOperate").css("left"));
            localStorage.setItem("elTopLogin",$(".cyOperate").css("top"));
            // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
    }

    // 获取登录框拖拽后位置
    var elLeftLogin = localStorage.getItem("elLeftLogin");
    var elTopLogin = localStorage.getItem("elTopLogin");
    $(".cyOperate").css({
        "left": elLeftLogin,
        "top": elTopLogin
    })



    dragInfo(100,0)



})();