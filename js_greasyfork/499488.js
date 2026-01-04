// ==UserScript==
// @name         sku关键词搜索
// @namespace    http://tampermonkey.net/
// @version      1.6.3
// @description  根据sku关键词搜索视频
// @author       xgm
// @match        https://www.douyin.com/search/*
// @match        https://www.douyin.com/user/*
// @match        https://www.xiaohongshu.com/search_result/*
// @match        https://www.xiaohongshu.com/user/profile/*
// @match        https://www.kuaishou.com/search/video*
// @match        https://search.bilibili.com/video*
// @match        https://www.bilibili.com/video*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      End-User License Agreement
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/499488/sku%E5%85%B3%E9%94%AE%E8%AF%8D%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/499488/sku%E5%85%B3%E9%94%AE%E8%AF%8D%E6%90%9C%E7%B4%A2.meta.js
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
        .version{
          margin-bottom:20px;
        }
    `
    // 引用自定义css
    GM_addStyle(div_css);
 
    let div = `
        <div class="cyOperate">
        <div class="h1_content"><span id="content_text"></span>将在<span id="countdown">60</span> 秒后重新加载</div>
        <div class="h2_content">当前抓取数：<span class="numbers">0</span></div>
        <div class="keyword">当前关键词：<span id="keyword_text">当前暂无关键词</span></div>
        <div class="version">版本号：<span class="version_id"></span></div>
        <div><span>设备标识：</span><input class="cyInp" type="text" id="myInput" /></div>
            <div class="cyBtn">
                <button>搜索</button>
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
    // apiHost https://api.test.cyek.com/
    var apiHost = "https://api.oa.cyek.com/";
    const version = "1.6.1"
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
                        alert(json.message);
                        window.location.reload()
                    }else{
                        alert(json.message);
                        if (typeof(specialFun) == "function") {
                            specialFun()
                        }
                    }
                }
            }
        });
    }
    function getDay() {//获取当日时间
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        let day = ('0' + currentDate.getDate()).slice(-2);
        let hours = ('0' + currentDate.getHours()).slice(-2);
        let minutes = ('0' + currentDate.getMinutes()).slice(-2);
        let seconds = ('0' + currentDate.getSeconds()).slice(-2);
 
        let formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        return formattedDateTime
    }
    getDay()
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
    const setDeviceId = ()=>{//设备标识
        const device_id = localStorage.getItem('device_id');
         const keyword = localStorage.getItem('keyword');
        // 获取input元素
        const input = document.getElementById('myInput')
        if(device_id) {
            // 读取localStorage中的数据
            input.value = device_id
        }
        if(keyword) {
            document.getElementById('keyword_text').innerHTML =keyword||""
        }
        document.querySelector(".version_id").innerHTML = version;
    }
    const setPageNum = (num=0)=>{//当前已抓取数量
        if(num)localStorage.setItem('numbers',num)
        const numbers = localStorage.getItem('numbers');
        document.querySelector(".numbers").innerText = numbers||num;
    }
    function clearCookies() {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
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
                clearCookies()
                if(callback) {
                    callback()
                }else{
                    window.location.reload();
                }
            }
        }, 1000);
    }
    const getError =(type,fail_page,sec_uid,search_nil_item,text,callback)=>{
        const device = localStorage.getItem('device_id');
        const keyword = localStorage.getItem('keyword');
        const platform_name = localStorage.getItem('platform_name');
        const id = localStorage.getItem('id');
        req("https://spider.oa.cyek.com/keywordReport",{type,keyword,id,device,fail_page,sec_uid,search_nil_item,version:version,platform_name},function(res){
            if(type !=1 &&text) countdown(text);
            callback&&callback()
            console.log(`==============日志上传完成==============`)
        })
    }
    //判断720天时间
    const getNinety = (time,callBack,errorback)=>{
        const now = new Date()
        let currentYear = now.getFullYear();
        let currentMonth = now.getMonth();
        let currentDate = now.getDate();
        let currentHours = now.getHours();
        let currentMinutes = now.getMinutes();
        let currentSeconds = now.getSeconds();
        let currentMilliseconds = now.getMilliseconds();
        let lastYear = currentYear - 2;
        let lastYearSameTime = new Date(lastYear, currentMonth, currentDate, currentHours, currentMinutes, currentSeconds, currentMilliseconds);
        let ninetyDaysAgo = lastYearSameTime.getTime();
        // 获取720天前的时间戳
        // 只抓小于720天的视频
        if (time * 1000 < ninetyDaysAgo) {
            console.log(time * 1000, ninetyDaysAgo, "时间戳大于720天");
            errorback&& errorback()
        } else {
            //console.log(time * 1000, ninetyDaysAgo, "进入抓取列表");
            callBack()
        }
    }
 
    const getNextYear = () => {
        const now = new Date()
        let currentYear = now.getFullYear();
        let currentMonth = now.getMonth();
        let currentDate = now.getDate();
        let currentHours = now.getHours();
        let currentMinutes = now.getMinutes();
        let currentSeconds = now.getSeconds();
        let currentMilliseconds = now.getMilliseconds();
        let lastYear = currentYear - 2;
        let lastYearSameTime = new Date(lastYear, currentMonth, currentDate, currentHours, currentMinutes, currentSeconds, currentMilliseconds);
        return lastYearSameTime.getTime();
    }
    //用户页
    if(rex.match(/https:\/\/www.douyin.com\/user\/*/) != null){
        document.querySelector(".cyBtn").style.display = 'none';
        setDeviceId()
        setPageNum()
        const urlParams = new URLSearchParams(unsafeWindow.location.search);
        const isKeyword = urlParams.get('type');
        if(!isKeyword)return
        const keyword = localStorage.getItem('keyword');
        const wid = urlParams.get('wid');
        const sec_uid = unsafeWindow.location.pathname.split("/")[2]
        var token = localStorage.getItem("token");
        console.log(isKeyword,'isKeyword')
        $(".cyloading").show()
        console.log("页面加载成功")
            let user;
            // 拦截响应
            var originalSend = XMLHttpRequest.prototype.send;
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
                                cert =user?.user?.custom_verify
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
                                setTimeout(function() {
                                    window.close()
                                    $(".cyloading").hide()
                                }, 3000);
                                // getWorkData()
                            })
                        }
                    }
                };
                // 调用原始的send方法
                originalSend.apply(this, arguments);
            };
        countdown("页面刷新倒计时",()=>window.location.reload())
        function getWorkData(){
            let dataVideo = {
                device_platform: "webapp",
                aid: 6383,
                channel: "channel_pc_web",
                sec_user_id: sec_uid,
             //   max_cursor: dy_max_cursor,
                locate_query: false,
                show_live_replay_strategy: 1,
                count: 18,
                publish_video_strategy_type: 2,
                pc_client_type: 1,
                version_code: 170400,
                version_name: "17.4.0",
                cookie_enabled: true,
                screen_width: 2560,
                screen_height: 1440,
                browser_language: "zh-CN",
                browser_platform: "Win32",
                browser_name: "Chrome",
                browser_version: "114.0.0.0",
                browser_online: true,
                engine_name: "Blink",
                engine_version: "114.0.0.0",
                os_name: "Windows",
                os_version: 10,
                cpu_core_num: 16,
                device_memory: 8,
                platform: "PC",
                downlink: 6.95,
                effective_type: "4g",
                round_trip_time: 100,
             //   webid: decode.app.odin.user_unique_id,
            }
 
            $.ajax({
                type: "get",
                url: "https://www.douyin.com/aweme/v1/web/aweme/post/",
                data: dataVideo,
                timeout: 100000, // 设置超时时间为100000毫秒（100秒）
                headers: {
                    Accept: "application/json, text/plain, */*"
                },
                beforeSend: function(res,settings){
                    Object.freeze(settings);
                },
                success: function (res) {
                    if(!res?.aweme_list){
                        getError(2,1,sec_uid,'发文数据获取失败',"发文数据获取失败")
                        $(".cyloading").hide()
                        return
                    }
                    // 定义数组来接收数据
                    let videoData = res.aweme_list
                    videoData = videoData.map(e=>({
                        ukey:"sec_uid",
                        uvalue:sec_uid,
                        title:e?.desc,
                        desc:e?.desc,
                        outside_video_id:e?.aweme_id,
                        type:e?.media_type?e.media_type ==4?1:2:'',
                        collect_count:e?.statistics?.collect_count,
                        comment_count:e?.statistics?.comment_count ,
                        digg_count:e?.statistics?.digg_count,
                        share_count:e?.statistics?.share_count,
                        cate:JSON.stringify(e?.video_tag),
                        tag:JSON.stringify(e?.text_extra),
                        cover:e?.video.cover?.url_list[0],
                        cover_list:JSON.stringify(e?.video.cover?.url_list),
                        cover_width:e?.video?.cover.width,
                        cover_height:e?.video.cover.height,
                        play_addr:JSON.stringify(e?.video.play_addr),
                        bit_rate:JSON.stringify(e.video.bit_rate),
                        video_dura:e?.music?.video_duration ||Math.round(Number(e.duration/1000)),
                        video_width:e.video.play_addr.width,
                        video_height:e.video.play_addr.height,
                        video_size:e.video.play_addr.data_size,
                        post_time:e?.create_time,
                        images:JSON.stringify(e?.images),
                        is_top:e.is_top
                    }))
                    console.log(videoData,"video2")
                    let saveUid = {
                        "platform_id":1,
                        "app_type": "tools_" + 1,
                        "app_id": "1",
                        "sign": "1",
                        "sec_uid":sec_uid,
                        "access_token": token,
                        "result": JSON.stringify(videoData)
                    }
                    req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
                        console.log('发文信息获取完毕，关闭页面')
                        setTimeout(function() {
                             isKeyword && window.close()
                            $(".cyloading").hide()
                        }, 4000);
                    })
                },
                error: function(fail, textStatus, errorThrown){
                    $(".cyloading").hide()
                     // 请求失败或超时的回调函数
                    if (textStatus === 'timeout') {
                        getError(2,1,sec_uid,'请求超时',"请求超时")
                    } else {
                        getError(2,1,sec_uid,'发文数据获取失败',"发文数据获取失败")
                    }
                }
            });
        }
    }else if(rex.match(/https:\/\/www.xiaohongshu.com\/user\/profile\/*/) != null){
        document.querySelector(".cyBtn").style.display = 'none';
        setPageNum()
        setDeviceId()
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
            return countdown("获取不到用户信息，请刷新重试",()=>window.location.reload())
            }
            function redInfo(user){
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
                let account = user.basic_info.red_id;
                // 分类
                let cate = "";
                // 获赞数
                let like_count = "";
                // 位置
                let location = user.basic_info.ip_location;
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
                // 自定义字段
                let diy = {
                    "location": location
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
                    "v": version
                }
                req(apiHost+"/spider/browser/syncInfo",dataBind,function(response){
                    console.log('用户信息同步完毕',dataBind)
                    setTimeout(function() {
                        window.close()
                        $(".cyloading").hide()
                    }, 3000);
                   // getDom()
                })
            }
            function getDom() {
                var parentElement = document.getElementById('userPostedFeeds');
                var childElements = parentElement.getElementsByTagName('section');
                var lastMatchingElement = null;
 
                for (var i = 0; i < childElements.length; i++) {
                    var divElements = childElements[i].querySelector('div.top-tag-area');
                    var spanElements = childElements[i].querySelector('span.play-icon');
                    console.log(!!!divElements,!!spanElements,'spanElements')
                    if (!!!divElements && !!spanElements&&!!!lastMatchingElement) {
                        lastMatchingElement = childElements[i].querySelector('div > a');
                        break;
                    }
                }
                if(lastMatchingElement) {
                    // 如果找到符合条件的节点，则输出信息或者进行其他操作
                    const url = lastMatchingElement.href
                    const startIndex = url.indexOf("explore/") + "explore/".length;
                    const endIndex = url.length;
                    const noteId = url.slice(startIndex, endIndex);
                    console.log(noteId,"numberString"); // 输出：numberString
                    getXhsInfo(noteId,sec_uid,(res)=>{//获取小红书无水印视频
                        // 定义数组来接收数据
                        let videoData = res.data
                        console.log(videoData)
                        videoData = {
                            ukey:"sec_uid",
                            uvalue:videoData?.userId,
                            title:videoData?.title,
                            desc:videoData?.content,
                            outside_video_id:videoData?.noteId,
                            type:videoData?.type?videoData?.type==1?2:1:0,
                            collect_count:videoData?.favNum,
                            comment_count:videoData?.cmtNum,
                            digg_count:videoData?.likeNum,
                            share_count:videoData?.shareNum,
                            cate:JSON.stringify(videoData?.userInfo?.contentTags),
                            tag:JSON.stringify([]),
                            cover:videoData?.imagesList[0]?.url,
                            cover_list:JSON.stringify(videoData[i]?.imagesList),
                            cover_width:videoData?.imagesList[0]?.width,
                            cover_height:videoData?.imagesList[0]?.height,
                            play_addr:videoData?.videoInfo?.videoUrl||"",
                            bit_rate:0,
                            video_dura:videoData?.videoInfo?.meta?.duration,
                            video_width:videoData?.videoInfo?.meta?.width,
                            video_height:videoData?.videoInfo?.meta?.height,
                            video_size:0,
                            post_time:videoData?.time?.createTime?videoData?.time?.createTime/1000:"",
                            images:JSON.stringify(videoData?.imagesList),
                            is_top:''
                        }
                        console.log(videoData,"video")
                        let saveUid = {
                            "platform_id":4,
                            "app_type": "tools_" + 4,
                            "app_id": "1",
                            "sign": "1",
                            "sec_uid":sec_uid,
                            "access_token": token,
                            "result": JSON.stringify([videoData])
                        }
                        req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
                            console.log('发文信息获取完毕，关闭页面')
                            setTimeout(function() {
                                window.close()
                                $(".cyloading").hide()
                            }, 3000);
                        })
                    })
                    // 返回或者继续其他操作
                }else{
                    getError(2,1,sec_uid,'无法找到相关视频节点',"无法找到相关视频节点")
                }
            }
        };
        countdown("页面刷新倒计时",()=>window.location.reload())
    }
    //请求小红书无水印视频
    function getXhsInfo(noteId,sec_uid,callback){
        function base36EncodeBigInt(number, digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
            let base36 = '';
            let remainder;
 
            while (number > unsafeWindow.BigInt(0)) {
                [remainder, number] = [number % unsafeWindow.BigInt(36), number / unsafeWindow.BigInt(36)];
                base36 = digits[Number(remainder)] + base36;
            }
            return base36.toLowerCase();
        }
        function getSid() {
            const timestamp = unsafeWindow.BigInt(Date.now()) << unsafeWindow.BigInt(64);
            const randomValue = unsafeWindow.BigInt(Math.floor(Math.random() * 2147483647));
            const combined = timestamp + randomValue;
            return base36EncodeBigInt(combined);
        }
        function H() {
            for (var t = "", e = 0; e < 16; e++)
                t += "abcdef0123456789".charAt(Math.floor(16 * Math.random()));
            return t
        }
        var arr = unsafeWindow._webmsxyw("/api/solar/index/note_detail", {ext_flags: [], image_formats: ["jpg", "webp", "avif"], keyword: noteId, note_type: 0, page: 2, page_size: 20, search_id: getSid(),sort: "general"})
        $.ajax({
            type: "get",
            url: "https://pgy.xiaohongshu.com/api/solar/index/note_detail",
            data: {
                noteId,
            },
            timeout: 100000, // 设置超时时间为100000毫秒（100秒）
            headers: {
                Accept: "application/json, text/plain, */*",
                //cookie:document.cookie,
                "x-b3-traceid":H(),
                "x-s":arr["X-s"],
                "x-t":arr["X-t"],
            },
            error: function(fail, textStatus, errorThrown){
                $(".cyloading").hide()
                // 请求失败或超时的回调函数
                if (textStatus === 'timeout') {
                    getError(2,1,sec_uid,'小红书请求超时')
                    countdown("小红书发文数据",()=> getXhsInfo(noteId,sec_uid,callback))
                } else {
                    getError(2,1,sec_uid,'小红书发文数据获取失败')
                    countdown("小红书发文数据",()=> getXhsInfo(noteId,sec_uid,callback))
                }
            },
            success: function (res) {
                if(res?.data){
                    callback(res)
                }else{
                    getError(2,1,sec_uid,'小红书发文数据获取失败'+JSON.stringify(res.data))
                    countdown("小红书发文数据",()=> getXhsInfo(noteId,sec_uid,callback))
                    return
                }
            }})
    }
 
//搜索页
    if(rex.match(/https:\/\/www.douyin.com\/search\/*/) != null){
        setDeviceId()
        // 获取抖音json数据
        let text = $("#RENDER_DATA").text();
        let decode = JSON.parse(decodeURIComponent(text));
        console.log(decode,'decode');
        let dyCookie = getCookie("msToken")
        let dyoffset = 0
        let need_filter_settings = 1
        let search_id
        let linkArr = []
        const maxNum = 40
        const min_digg_count = 50
 
        function getDyData(keyword,search_keyword_id){
            $(".cyloading").show()
            let dataVideo = {
                device_platform: "webapp",
                aid: 6383,
                channel: "channel_pc_web",
                search_channel: "aweme_video_web",
                enable_history: 1,
                keyword: keyword,
                search_source: "normal_search",
                query_correct_type: 1,
                is_filter_search:0,
                from_group_id: "",
                offset: dyoffset,
                count:10,
                need_filter_settings: 1,
                list_type: "single",
                update_version_code: 170400,
                pc_client_type: 1,
                version_code: 170400,
                version_name: "17.4.0",
                cookie_enabled: true,
                screen_width: 1920,
                screen_height: 1080,
                search_id: search_id,
                browser_language: "zh-CN",
                browser_platform: "Win32",
                browser_name: decode.app.browserInfo.browser,
                browser_version: decode.app.browserInfo.browser_version,
                browser_online: true,
                engine_name: "Blink",
                engine_version: decode.app.browserInfo.browser_version,
                os_name: "Windows",
                os_version: 10,
                cpu_core_num: 16,
                device_memory: 8,
                platform: "PC",
                downlink: 10,
                effective_type: "4g",
                round_trip_time: 100,
                webid: decode.app.odin.user_unique_id,
                // msToken: "",
                // "X-Bogus": "DFSzswVORDtANt/ltTElNl9WX7rs",
            }
            $.ajax({
                type: "get",
                url: "https://www.douyin.com/aweme/v1/web/search/item/",
                data: dataVideo,
                dataType: "json",
                 timeout: 100000, // 设置超时时间为10000毫秒（10秒）
                error: function(fail,textStatus, errorThrown){
                    $(".cyloading").hide()
                     // 请求失败或超时的回调函数
                    if (textStatus === 'timeout') {
                        getError(4,0,'','搜索请求超时',"请求超时")
                        console.log('请求超时！');
                    }
                },
                success: function (res) {
                    console.log(res)
                    dyoffset+=10
                    need_filter_settings = 0
                    search_id = res.log_pb.impr_id
                    if(res?.data == undefined ||(res?.data?.length == 0 && res?.search_nil_info?.is_load_more != "is_load_more"||res?.search_nil_info?.search_nil_type=="verify_check")){
                        getError(4,0,'','搜索接口出错data:'+JSON.stringify(res.data))
                        countdown("抖音搜索数据获取失败",()=> getKeyword(),4800)
                        return
                    }else{
                        res.data.forEach((item,index)=>{
                            if(linkArr.some(e=>e?.aweme_info?.aweme_id == item.aweme_info.aweme_id)) {//有重复
                                console.log("有重复跳过")
                            }else{
                                linkArr.push(item)
                            }
                        })
                        if(res.has_more == 1 && linkArr.length <maxNum){
                            setTimeout(function(){
                                getDyData(keyword,search_keyword_id)
                            },2000)
                        }else{
                            if(linkArr?.length==0){
                                getError(2,linkArr.length,'','搜索未找到满足条件的数据:'+JSON.stringify(res))
                                return getKeyword()
                            }
                            let linkItem = linkArr
                            console.log("总共获取到"+linkItem.length+"条数据",getDay())
                            const getResData = (i)=>{
                                getUserInfo(linkItem[i]?.aweme_info?.author_user_id,linkItem[i]?.aweme_info?.desc,(resArr=[])=>{
                                    const arr = resArr?.map(e=>(
                                        {
                                            ukey:"sec_uid",
                                            uvalue:e?.item?.author?.sec_uid,
                                            title:e?.item?.desc,
                                            desc:e?.item?.desc,
                                            outside_video_id:e?.item?.aweme_id,
                                            type:e?.type,
                                            collect_count:e?.item?.statistics?.collect_count,
                                            comment_count:e?.item?.statistics?.comment_count ,
                                            digg_count:e?.item?.statistics?.digg_count,
                                            share_count:e?.item?.statistics?.share_count,
                                            cate:JSON.stringify(e?.item?.video_tag),
                                            tag:JSON.stringify(e?.item?.text_extra),
                                            cover:e?.item?.video.cover?.url_list[0],
                                            cover_list:JSON.stringify(e?.item?.video?.cover?.url_list),
                                            cover_width:e?.item?.video?.cover.width,
                                            cover_height:e?.item?.video.cover.height,
                                            play_addr:JSON.stringify(e?.item?.video.play_addr),
                                            bit_rate:JSON.stringify(e?.item?.video.bit_rate),
                                            video_dura:e?.item?.music?.video_duration ||Math.round(Number(e?.item?.duration/1000)),
                                            video_width:e?.item?.video.play_addr.width,
                                            video_height:e?.item?.video.play_addr.height,
                                            video_size:e?.item?.video.play_addr.data_size,
                                            post_time:e?.item?.create_time,
                                            images:JSON.stringify(e?.item?.images),
                                            is_top:e?.item?.is_top
                                        }
                                    ))
                                    let saveUid = {
                                        "platform_id":1,
                                        "app_type": "tools_" + 1,
                                        "app_id": "1",
                                        "sign": "1",
                                        "sec_uid":linkItem[i]?.aweme_info?.author?.sec_uid,
                                        "access_token": token,
                                        "result": JSON.stringify(arr)
                                    }
                                    req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
                                        console.log('单条发文信息上传完毕',linkItem[i]?.aweme_info?.author?.sec_uid,getDay())
                                        window.open("https://www.douyin.com/user/"+linkItem[i].aweme_info.author.sec_uid+`?type=keyword&wid=${linkItem[i].aweme_info?.aweme_id}`)
                                        document.onvisibilitychange=()=>{
                                            if(!document.hidden){
                                                moreData(i+1)
                                            }
                                        }
                                    })
                                })
                            }
                            const moreData = (index)=>{
                                 let batchList = linkItem.slice(index, index +1);
                                   console.log(batchList,11111)
                                 // 如果还有数据需要处理
                                 if (batchList.length>0 ||index < linkItem.length){
                                     console.log(`${index+1}条数据截取${getDay()}`)
                                     setPageNum(index+1)
                                     getResData(index)
                                 }else{//所有数据同步完成
                                    saveSearch()
                                 }
                            }
                            const saveSearch= ()=>{
                                const newArr = linkItem.map(e=>({outside_video_id:e.aweme_info.aweme_id,sec_uid:e.aweme_info.author.sec_uid,type:e?.type}))
                                let urlData = {
                                    search_keyword_id,
                                    keyword: keyword,
                                    platform_id: 1,
                                    result: JSON.stringify(newArr),
                                }
                                req(apiHost+"spider/browser/saveSearchKeywordResult",urlData,function(res){
                                    dyoffset = 0
                                    need_filter_settings = 1
                                    search_id = null
                                    linkArr = []
                                    console.log(`==============${keyword}关键词抓取完毕==============`,getDay())
                                    // 数据处理结束
                                    // 调用接口拿到下一个 keyword
                                    getError(1,linkItem.length,'','','',()=>{
                                        localStorage.removeItem("numbers")
                                        setPageNum(0)
                                        linkItem = []
                                        linkArr = []
                                        getKeyword()
                                    })
                                })
                               }
                               //获取发文
                               moreData(0)
                            function getUserInfo(from_user,desc,callback) {
                                let dataVideo = {
                                    device_platform: "webapp",
                                    aid: 6383,
                                    channel: "channel_pc_web",
                                    search_channel: "aweme_personal_home_video",
                                    search_source: "normal_search",
                                    search_scene:" douyin_search",
                                    sort_type: 0,
                                    publish_time: 0,
                                    is_filter_search: 0,
                                    query_correct_type: 1,
                                    keyword:desc,
                                    search_id: '',
                                    offset: 0,
                                    count: 10,
                                    from_user,
                                    pc_client_type: 1,
                                    version_code: 170400,
                                    version_name: "17.4.0",
                                    cookie_enabled: true,
                                    screen_width: 1920,
                                    screen_height: 1080,
                                    browser_language: "zh-CN",
                                    browser_platform:" Win32",
                                    browser_name:decode.app.browserInfo.browser,
                                    browser_version: decode.app.browserInfo.browser_version,
                                    browser_online: true,
                                    engine_name: "Blink",
                                    engine_version: decode.app.browserInfo.browser_version,
                                    os_name: "Windows",
                                    os_version: 10,
                                    cpu_core_num: 6,
                                    device_memory: 8,
                                    platform:" PC",
                                    downlink: 10,
                                    effective_type:"4g",
                                    round_trip_time: 50,
                                    webid: decode.app.odin.user_unique_id,
                                }
                                $.ajax({
                                    type: "get",
                                    url: "https://www.douyin.com/aweme/v1/web/home/search/item/",
                                    data: dataVideo,
                                    dataType: "json",
                                    timeout: 100000, // 设置超时时间为10000毫秒（10秒）
                                    error: function(fail,textStatus, errorThrown){
                                        $(".cyloading").hide()
                                        // 请求失败或超时的回调函数
                                        if (textStatus === 'timeout') {
                                            $(".cyloading").hide()
                                             getError(4,0,'',"抖音用户主页搜索数据超时")
                                            countdown("抖音用户主页搜索数据超时",()=> getUserInfo(from_user,callback),320)
                                        }
                                    },
                                    success: function (res) {
                                        if(res?.aweme_list) {
                                            let datas = res.aweme_list
                                            console.log(res.aweme_list,'datas',getDay())
                                            callback(datas)
                                        }else{
                                            $(".cyloading").hide()
                                             getError(4,0,'',"抖音用户主页搜索数据获取失败"+JSON.stringify(res))
                                            countdown("抖音用户主页搜索数据获取失败",()=> getUserInfo(from_user,callback),320)
                                        }
                                    }})
                            }
                        }
 
                    }
                }
            });
        }
 
        function getKeyword(){
            if(navigator.userAgent.indexOf("Chrome") == -1)return alert("目前只支持谷歌浏览器")
            let searchKeyword = {
                type:1,
                platform_id: 1,
                project_id:15,
                version
            }
            clearInterval(intervals); // 清除之前的计时器
            req(apiHost+"spider/browser/getSearchKeyword",searchKeyword,function(res){
                if(res.result.keyword){
                    console.log(`==============开始进行${res.result.keyword}关键词抓取==============`,getDay())
                    localStorage.setItem('keyword', res.result.keyword)
                    localStorage.setItem('id', res.result.id)
                    document.getElementById('keyword_text').innerHTML =res?.result?.keyword||""
                    getDyData(res.result.keyword,res.result.id)
                }else{
                    localStorage.removeItem("keyword")
                    localStorage.removeItem("id")
                    if(res.result.version == version){
                        countdown("关键词数据",()=>getKeyword())
                    }else{
                      $(".cyloading").hide()
                      window.location.reload()
                  }
 
                }
            })
        }
 
        // 抓取达人
        $(".cyBtn button").click(function(){
            // 获取input元素
            var input = document.getElementById('myInput')
            // 读取localStorage中的数据
            const device_id = localStorage.getItem('device_id');
            if(device_id||input.value) {
                if(input?.value&&input?.value!=device_id) localStorage.setItem('device_id', input?.value)
                localStorage.setItem('platform_name',"抖音")
                getKeyword()
            }else{
                return alert("请输入设备标识")
            }
        })
 
    }else if(rex.match(/https:\/\/www.xiaohongshu.com\/search_result*/) != null){
        window.addEventListener('load', function() {
            setDeviceId()
            const urlParams = new URLSearchParams(unsafeWindow.location.search);
            const isKeyword = urlParams.get('type');
            const keyword = urlParams.get('keyword');
            const search_keyword_id = urlParams.get('search_keyword_id');
            const dataType= {
                "video":1,
                "normal":2
            }
            var all_list = []
            var aweme_list = [];
            let scrollHeight = document.body.scrollHeight;
            let maxNum = 40
            let min_liked_count = 20
            let i = 0;
            let isShow =false
            console.log("页面加载完毕")
            if(isKeyword!="keyword") return
            $(".cyloading").show()
            function tabClick(){
                console.log("点击")
                // 找到要点击的页面元素
                var elementToClick = document.querySelector('#video_note');
                // 创建一个点击事件
                var clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: false,
                    view: unsafeWindow
                });
                elementToClick.dispatchEvent(clickEvent);
                isShow =true
            }
         /*   function simulateClick(){
                // 触发点击事件
                document.querySelectorAll(".dropdown-items")[2].querySelectorAll("li")[1].click()
            } */
             let interval
              const onScroll=()=> {
                  var div = document.querySelector(".feeds-container");
                  var divHeight = div.getBoundingClientRect().height;
                  interval = setInterval(()=> {
                      if(document.getElementsByClassName("end-container").length <= 0) {
                          window.scrollTo(divHeight * i, divHeight * (i+1));
                          console.log(divHeight * i, divHeight * (i+1))
                          i++
                      } else {
                          console.log('stop')
                          document.querySelectorAll(".end-container")[0]?.scrollIntoViewIfNeeded()
                          clearInterval(interval);
                          return
                      }
                  }, 3000);
              };
            tabClick()//模拟页面点击
            // 拦截响应
            var originalSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function() {
                var self = this;
                // 监听readystatechange事件，当readyState变为4时获取响应
                this.onreadystatechange = function() {
                    if (self.readyState === 4) {
                        if (self.responseURL == "https://edith.xiaohongshu.com/api/sns/web/v1/search/notes") {
                            if(!isShow)return
                            // 在获取到响应后执行你的操作
                            var json = JSON.parse(self.response);
                            var data = json?.data?.items;
                            console.log(aweme_list.length,'aweme_list')
                            if(JSON.stringify(data)!="{}" && json?.data?.has_more){
                                all_list = all_list.concat(data.filter(item => item.model_type == 'note'&& item?.note_card?.type=="video"))//过滤不是视频的数据/和点赞数小于min_liked_count
                                console.log(all_list.length,'all_list')
                                if(all_list.length>=40){
                                    console.log("拿满了")
                                    clearInterval(interval);
                                    moreData(all_list,0,()=>{
                                        all_list=[]
                                        if(aweme_list.length<maxNum){//如果拿到
                                            onScroll(); // 继续滚动
                                        }else{
                                            getSearchResult()
                                        }
                                    })
                                }else{
                                    if(i==0) onScroll()
                                }
                            }else{
                                if(json?.code == -1 ||json?.msg=="网页版搜索次数已达今日上限，可以去小红书App继续搜索"){
                                    getError(4,aweme_list.length,'','网页版搜索次数已达今日上限，可以去小红书App继续搜索:'+self.response)
                                    countdown("小红书搜索数据失败",()=>window.close(),43200)
                                    return
                                }
                                if(all_list.length>0) {
                                    moreData(all_list,0,()=>{
                                       if(aweme_list.length>0){
                                           all_list=[]
                                           getSearchResult()
                                       }else{
                                           getError(2,aweme_list.length,'','搜索未找到满足条件的数据:'+self.response)
                                           window.close()
                                       }
 
                                    })
                                }else if(aweme_list.length>0){
                                    getSearchResult()
                                }else{
                                     if(document.getElementsByClassName("search-empty-text").length>0){
                                        window.close()
                                     }else{
                                         getError(4,aweme_list.length,"小红书搜索数据异常data"+self.response)
                                         countdown("小红书搜索数据失败",()=>window.close(),4800)
                                     }
                                }
                            }
                        }
                    }
                };
                // 调用原始的send方法
                originalSend.apply(this, arguments);
            };
            const moreData = (arr,index,callback)=>{
                let batchList = arr.slice(index, index +1);
                // 如果还有数据需要处理
                if (batchList.length>0 ||index < arr.length){
                   console.log(`${index+1}条数据截取`,getDay())
                    getResData(arr,index,callback)
                }else{//所有数据同步完毕
                   callback()
                }
            }
            const getResData = (videoData,index,callback)=>{//获取无水印视频数据
                if(aweme_list.some(e=>e.id==videoData[index]?.id)){//相同的跳过
                    moreData(videoData,index+1,callback)
                }else{
                    getXhsInfo(videoData[index]?.id,videoData[index]?.note_card?.user.user_id,(res)=>{
                        const data= res.data
                        let datas = {
                            ukey:"sec_uid",
                            uvalue:videoData[index]?.note_card?.user.user_id,
                            title:videoData[index]?.note_card?.display_title,
                            desc:data?.content,
                            outside_video_id:videoData[index]?.id,
                            type:dataType?.[videoData[index]?.note_card?.type]||0,
                            collect_count:data.favNum,
                            comment_count:data.cmtNum,
                            digg_count:data.likeNum,
                            share_count:data.shareNum,
                            cate:JSON.stringify(data.userInfo.contentTags),
                            tag:JSON.stringify([]),
                            cover:videoData[index]?.note_card?.cover?.url_default,
                            cover_list:JSON.stringify([videoData[index]?.note_card?.cover]),
                            cover_width:videoData[index]?.note_card?.cover?.width,
                            cover_height:videoData[index]?.note_card?.cover?.height,
                            play_addr:data?.videoInfo?.videoUrl||"",
                            bit_rate:0,
                            video_dura:data?.videoInfo?.meta?.duration,
                            video_width:data?.videoInfo?.meta?.width,
                            video_height:data?.videoInfo?.meta?.height,
                            video_size:0,
                            post_time:data?.time?.createTime?data?.time?.createTime/1000:"",
                            images:JSON.stringify(data?.imagesList),
                            is_top:''
                        }
                        let saveUid = {
                            "platform_id":4,
                            "app_type": "tools_" + 4,
                            "app_id": "1",
                            "sign": "1",
                            "sec_uid":datas.uvalue,
                            "access_token": token,
                            "result": JSON.stringify([datas])
                        }
                            req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
                                console.log('单条发文信息上传完毕',datas.uvalue,getDay())
                                window.open("https://www.xiaohongshu.com/user/profile/"+datas.uvalue+`?type=keyword&wid=${datas.outside_video_id}`)
                                document.onvisibilitychange=()=>{
                                    if(!document.hidden){
                                        setPageNum(aweme_list.length+1)
                                        aweme_list.push(videoData[index])
                                        moreData(videoData,index+1,callback)
                                    }
                                }
                            })
                    })
                }
            }
            const getSearchResult = ()=>{
                const newArr = aweme_list.map(e=>({outside_video_id:e.id,sec_uid:e.note_card?.user.user_id,type:dataType[e?.note_card?.type]||0}))
                let urlData = {
                    search_keyword_id,
                    keyword,
                    platform_id: 4,
                    result: JSON.stringify(newArr),
                }
                console.log(aweme_list,'aweme_list')
                req(apiHost+"spider/browser/saveSearchKeywordResult",urlData,function(res){
                    console.log(`总共${aweme_list.length}条数据信息抓取完毕`)
                    // 数据处理结束
                    console.log(`==============${keyword}关键词抓取完毕==============`,getDay())
                    // 调用接口拿到下一个 keyword
                    getError(1,aweme_list.length,'','','',()=>{
                        aweme_list = []
                        i=0
                        localStorage.removeItem("numbers")
                        setPageNum(0)
                        window.close()
                    })
                })
            }
            })
        const sendList = (keyword,id)=>{
            window.open(`https://www.xiaohongshu.com/search_result?keyword=${keyword}&source=web_search_result_notes&type=keyword&search_keyword_id=${id}`)
            document.onvisibilitychange=()=>{
                if(!document.hidden){
                   getKeyword()
                }
            }
        }
        function getKeyword(){
             $(".cyloading").show()
            if(navigator.userAgent.indexOf("Chrome") == -1)return alert("目前只支持谷歌浏览器")
            let searchKeyword = {
                type:1,
                platform_id: 4,
                project_id:15,
                version
            }
            req(apiHost+"spider/browser/getSearchKeyword",searchKeyword,function(res){
                if(res.result.keyword){
                    console.log(`==============开始进行${res.result.keyword}关键词抓取==============`)
                    localStorage.setItem('keyword', res.result.keyword)
                    localStorage.setItem('id', res.result.id)
                    document.getElementById('keyword_text').innerHTML =res?.result?.keyword||""
                    sendList(res.result.keyword,res.result.id)
                }else{
                    localStorage.removeItem("keyword")
                    localStorage.removeItem("id")
                    if(res.result.version == version){
                        countdown("关键词数据",()=>getKeyword())
                    }else{
                        $(".cyloading").hide()
                        window.location.reload()
                    }
 
                }
            })
        }
 
        // 抓取达人
        $(".cyBtn button").click(function(){
            // 获取input元素
            var input = document.getElementById('myInput')
            // 读取localStorage中的数据
            const device_id = localStorage.getItem('device_id');
            if(device_id||input.value) {
                if(input?.value&&input?.value!=device_id) localStorage.setItem('device_id', input?.value)
                localStorage.setItem('platform_name',"小红书")
                getKeyword()
            }else{
                return alert("请输入设备标识")
            }
        })
 
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