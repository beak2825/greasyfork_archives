// ==UserScript==
// @name         同步作品
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  达人视频数据获取
// @author       xgm
// @match        https://www.douyin.com/user/*
// @match        https://www.kuaishou.com/profile/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      End-User License Agreement
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/471754/%E5%90%8C%E6%AD%A5%E4%BD%9C%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/471754/%E5%90%8C%E6%AD%A5%E4%BD%9C%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义css
    let div_css = `
        *{
            margin: 0;
            padding: 0;
        }
        .loginBox{
            min-width: 330px;
            padding: 30px 30px;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            top: 50%;
            left: 5%;
            transform: translateY(-50%);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 999;
            font-size: initial;
        }
        .login-title{
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 3px;
        }
        .login-tel{
            margin: 20px 0 10px;
        }
        .login-tel,.login-pwd{
            display: flex;
            align-items: center;
        }
        .login-tel span,.login-pwd span{
            width: 70px;
            font-size: 16px;
            text-align: right;
        }
        .login-tel input,.login-pwd input{
            width: 200px;
            height: 30px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 6px;
            border: 1px solid #aaa;
        }
        .login-btn{
            margin-top: 20px;
            text-align: center;
        }
        .login-btn button{
            width: 150px;
            height: 35px;
            background-color: #0096DB;
            color: #fff;
            border: 0;
            border-radius: 6px;
            cursor: pointer;
        }
        .logo{
            width: 80px;
            position: absolute;
            top: 10px;
            left: 10px;
        }
        .logo img{
            width: 100%;
        }
        .operate{
            width: 400px;
            padding: 15px 20px;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            right: 15%;
            top: 50%;
            transform: translateY(-50%);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 998;
            color: #333;
            display: none;
            box-sizing: initial;
        }
        .operate-toggle,.login-toggle{
            position: absolute;
            right: 15px;
            top: 2px;
            cursor: pointer;
        }
        .operate-toggle svg,.login-toggle svg{
            width: 40px;
            height: 40px;
        }
        .operate-name{
            width: 230px;
            font-size: 16px;
            margin-bottom: 15px;
        }
        .operate-quit{
            position: absolute;
            right: 60px;
            top: 8px;
        }
        .operate-quit a{
            display: block;
            padding: 5px 10px;
            border-radius: 6px;
            background-color: #1890ff;
            color: #fff;
            font-size: 14px;
            text-decoration: none;
        }
        .info-name{
            font-size: 20px;
            font-weight: bold;
        }
        #copy{
            word-break : break-all;
            margin-left: 0;
        }
        .info-name p{
            display: inline-block;
            font-size: 16px;
            font-weight: normal;
            margin-left: 15px;
        }
        .info-name div{
            font-size: 16px;
            font-weight: normal;
            margin-top: 10px;
        }
        .info-name span{
            margin-left: 15px;
            font-size: 16px;
            font-weight: normal;
            cursor: pointer;
        }
        .info-data{
            margin-top: 15px;
        }
        .info-data>div{
            word-break: break-all;
            font-size: 16px;
            margin-bottom: 5px;
            min-height: 32px;
            line-height: 32px;
        }
        .info-data>div span{
            display: inline-block;
            vertical-align: top;
        }
        .cy-tool{
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #ccc;
        }
        svg{
            width: 32px;
            height: 32px;
        }
        .windowH{
            max-height: 400px;
            overflow-y: auto;
        }
        /*定义滚动条高宽及背景
         高宽分别对应横竖滚动条的尺寸*/
        .windowH::-webkit-scrollbar
        {
            width:10px;
            height:10px;
            background-color:#F5F5F5;
        }
        /*定义滚动条轨道
         内阴影+圆角*/
        .windowH::-webkit-scrollbar-track
        {
            -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
            // border-radius:10px;
            background-color:#F5F5F5;
        }
        /*定义滑块
         内阴影+圆角*/
        .windowH::-webkit-scrollbar-thumb
        {
            border-radius:10px;
            -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);
            background-color:#555;
        }
        .data-btn{
            margin-top: 30px;
            text-align: center;
        }
        #synchronize{
            padding: 7px 20px;
            background-color: #1890ff;
            font-size: 14px;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            border: 0;
/*             margin-right: 20px; */
            margin-bottom: 10px;
        }
        .loading{
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,0.7);
            z-index: 9999;
            display: none;
        }
        .loading svg{
            width: 300px;
            height: 300px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -150px;
            margin-top: -150px;
        }
        .loading svg text{
            font-size: 2px;
        }
        .msg{
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px;
            background-color: #fff;
            border-radius: 10px;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            display: none;
        }
    `
    // 引用自定义css
    GM_addStyle(div_css);

    let div = `
        <div class="loginBox">
            <div class="logo">
                <img src="https://www.cyek.com/img/logo-scroll.svg" alt="">
            </div>
            <div class="login-toggle" data-bind="1"><svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg></div>
            <div class="cylogin-box">
                <div class="login-title">登录</div>
                <div class="login-tel">
                    <span>手机号：</span>
                    <input type="tel" placeholder="请输入你的手机号" name="phone" id="cyphoneNum" autocomplete="off" tabindex="1" />
                </div>
                <div class="login-pwd">
                    <span>密码：</span>
                    <input type="password" placeholder="请输入密码" name="pwd" id="cypwd" autocomplete="off" tabindex="2" />
                </div>
                <div class="login-btn">
                    <button>登录</button>
                </div>
            </div>
            <div class="cy-tool">灿耀易客浏览器工具</div>
        </div>
        <div class="operate">
            <div class="operate-quit">
                <a href="javascript:;">退出登录</a>
            </div>
            <div class="operate-toggle" data-bind="1"><svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg></div>
            <div class="operate-box">
                <div class="operate-name"></div>
                <div class="operate-info">
                    <div class="info-name"></div>
                    <div class="info-data">
                        <div class="data-amount">
                            <div class="follower_count"></div>
                            <div class="fans_count"></div>
                            <div class="video_count"></div>
                        </div>
                        <div class="data-btn">
                            <button id="synchronize">同步作品</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cy-tool">灿耀易客浏览器工具</div>
        </div>
        <div class="loading">
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
            <text x="14" y="21" font-family="Monaco" font-size="2px" style="letter-spacing:0.6" fill="#fff">LOADING
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
        <div class="msg">返回显示数据</div>;
    `

    $("body").append(div);


    // apiHost
    // var apiHost = "https://api.test.cyek.com/";
    var apiHost = "https://api.oa.cyek.com/";

    // 版本号
    var version = "1.1.0";
    $(".cy-tool").text("灿耀易客运营工具"+version);

    // 手机号验证
    function checkphone(){
        var phone = $("#cyphoneNum").val().trim();
        // console.log(phone)
        var phoneReg = /^[1][0-9]{10}$/;
        if(phone){
            return true;
        }else{
            alert("请输入正确的手机号")
            return false;
        }
        return phone;
    }
    // 密码不能为空
    function checkpwd(){
        var pwd = $("#cypwd").val();
        if(pwd !== ""){
            return true;
        }else{
            alert("密码不能为空")
            return false;
        }
    }


    // msg 显示  3s后消失
    function msgHide(text){
        $(".msg").text(text);
        $(".msg").fadeIn();
        var msgTime = 3;
        var msgTimer = setInterval(function(){
            msgTime--;
            if(msgTime === 0){
                clearInterval(msgTimer);
                $(".msg").stop().fadeOut(400);
            }
        },1000)
    }

    // 判断屏幕可视高度
    let windowH = unsafeWindow.innerHeight;
    console.log(windowH)
    if(windowH < 870){
        $(".operate").addClass("windowH")
    }

    // 获取当前页面地址
    let rex = window.location.href;

    // 粉丝数
    let follower_count;
    // 粉丝数
    let fans_count;
    // id
    let sec_uid;
    // 抖音author_id
    let author_id;
    // 昵称
    let nick;
    // 小红书号
    let account;
    // 分类
    let cate;
    // 位置
    let location;
    // 头像
    let avatar;
    // 简介
    let desc;
    // 获赞数
    let like_count;
    // 作品数
    let video_count;
    // 关注数
    let following;
    // 平台id
    let platform_id;
    // 性别
    let sex = 0;
    // 自定义字段
    let diy = {};


    // 获取local存储信息
    var token = localStorage.getItem("token");
    var storagePhone = localStorage.getItem("storagePhone");
    var storagePwd = localStorage.getItem("storagePwd");
    var dep_name = localStorage.getItem("dep_name");
    var staffName = localStorage.getItem("name");

    // 简介信息渲染
    $(".operate-name").text("欢迎你，"+dep_name+"-"+staffName);



    setTimeout(function(){
        // $(".QWdywTXI").click()
    },1000)



    if(rex.match(/https:\/\/www.douyin.com\/user\/*/) != null){
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

        // 获取抖音json数据
        let text = $("#RENDER_DATA").text();
        let decode = JSON.parse(decodeURIComponent(text));
        // console.log(decode);
        // console.log(searchData(decode,"uid"));
        var user = decode[searchData(decode,"uid")].user.user;
        console.log(user);
        // 粉丝数
        follower_count = user.followerCount;
        // 粉丝数
        fans_count = user.mplatformFollowersCount;
        // 抖音sec_uid
        sec_uid = user.secUid;
        // 抖音author_id
        author_id = user.uid;
        // 昵称
        nick = user.nickname;
        // account号
        account = user.uniqueId;
        // 头像
        avatar = user.avatar300Url;
        // 简介
        desc = user.desc;
        // 获赞数
        like_count = user.totalFavorited;
        // 作品数
        video_count = user.awemeCount;
        // 平台id
        platform_id = 1;
        // 分类
        cate = "";
        // 位置
        location = user.ipLocation ? user.ipLocation.split("：")[1] : ""
        // 自定义字段
        diy = {
            "short_id": user.shortId,
            "location": location
        };

        let fans = fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count
        let followers = follower_count > 10000 ? (follower_count/10000).toFixed(2)+"万" : follower_count
        // 简介信息渲染
        $(".follower_count").append(`抖音粉丝数：${followers}`);
        $(".fans_count").append(`多平台粉丝数：${fans}`);
        $(".video_count").append(`作品数：${video_count}`);

        // 定义参数max_cursor
        let max_cursor = 0;

        // 调用接口获取视频数据
        function getVideoInfo(){
            let token = localStorage.getItem("token");
            // loading 加载
            $(".loading").show()

            // 接口传递参数
            let dataVideo = {
                device_platform: "webapp",
                aid: 6383,
                channel: "channel_pc_web",
                sec_user_id: user.secUid,
                max_cursor: max_cursor,
                locate_item_id: 0,
                locate_query: false,
                show_live_replay_strategy: 1,
                count: user.awemeCount,
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
                browser_version: "106.0.0.0",
                browser_online: true,
                engine_name: "Blink",
                engine_version: "106.0.0.0",
                os_name: "Windows",
                os_version: 10,
                cpu_core_num: 16,
                device_memory: 8,
                platform: "PC",
                downlink: 10,
                effective_type: "4g",
                round_trip_time: 50,
                webid: 7091485348957816359,
                msToken: "blp334L-PqC7nAhdSwQvwbUXxW-3rCG5eslKH8bSWR8EMDfI5pZaTaTVLwNu9t56bQbTDpyqxNtKUDXmqybrxTK-HYKc_KTo7Lt2YTXI7RAii_CM3ellYYV_dGzKKsA7Big=",
                "X-Bogus": "DFSzswVONiJANHQbSk4yRl9WX7Jq"
            }
            $.ajax({
                type: "get",
                url: "https://www.douyin.com/aweme/v1/web/aweme/post/",
                data: dataVideo,
                async: true,
                success: function (res) {
                    console.log(res);
                    for(let key in res.aweme_list){
                        // 定义对象存储单个视频信息数据
                        let starData = {};
                        // console.log(res.aweme_list[key])

                        // 如果是视频  aweme_type = 0  获取视频数据
                        if(res.aweme_list[key].aweme_type == 0){
                            // 视频标题介绍
                            starData[0] = res.aweme_list[key].desc
                            // 视频缩略图
                            starData[1] = res.aweme_list[key].video.cover.url_list[0]
                            // 视频uri
                            starData[2] = res.aweme_list[key].video.play_addr.url_list[2]
                            // 视频收藏数
                            starData[3] = res.aweme_list[key].statistics.collect_count
                            // 视频点赞数
                            starData[4] = res.aweme_list[key].statistics.digg_count
                            // 视频评论数
                            starData[5] = res.aweme_list[key].statistics.comment_count
                            // 视频分享数
                            starData[6] = res.aweme_list[key].statistics.share_count
                            // 视频时长
                            starData[7] = res.aweme_list[key].duration

                            // 数据填充进数组
                            videoData.push(starData)
                        }
                    }

                    // 如果还有下一页接着调用接口
                    if(res.has_more == 1){
                        // 改变max_cursor参数来接着调用下一页数据
                        max_cursor = res.max_cursor
                        getVideoInfo()
                    }else{
                        console.log(videoData)

                        // 提交数据
                        $.ajax({
                            type: "post",
                            url: apiHost+"/spider/browser/videos",
                            data: {
                                "app_type": "tools_" + platform_id,
                                "app_id": "1",
                                "sign": "1",
                                "access_token": token,
                                "platform_id": platform_id, //达人归属平台
                                "cool_id": localStorage.getItem("cool_id"),
                                "v_lists": JSON.stringify(videoData), //达人数据
                            },
                            async: false,
                            success: function (res) {
                                console.log(res);
                                // loading 结束
                                $(".loading").hide()
                                if(res.code === 1000){
                                    msgHide("同步成功")

                                    // 初始化数据
                                    videoData = [];
                                    max_cursor = 0;
                                }else if(res.code === 1002){
                                    alert("同步失败，请重新登录")
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("storagePhone");
                                    localStorage.removeItem("storagePwd");
                                    localStorage.removeItem("dep_name");
                                    localStorage.removeItem("staffName");
                                    $(".operate").hide();
                                    $(".loginBox").show();

                                    // 初始化数据
                                    videoData = [];
                                }else{
                                    msgHide("同步失败")

                                    // 初始化数据
                                    videoData = [];
                                    max_cursor = 0;
                                }
                            },
                            error: function(fail){
                                // loading 结束
                                $(".loading").hide()
                                console.log(fail.statusText)
                                msgHide("同步失败，请联系技术部")

                                // 初始化数据
                                videoData = [];
                                max_cursor = 0;
                            }
                        });
                    }
                }
            });
        }


        // 定义数组来接收数据
        let videoData = [];

        // 同步数据
        $("#synchronize").click(function(){
            getVideoInfo();
        })

    }else if(rex.match(/https:\/\/www.kuaishou.com\/profile\/*/) != null){
        // 获取快手数据
        let userData = {
            "operationName":"visionProfile",
            "query":"query visionProfile($userId: String) {\n  visionProfile(userId: $userId) {\n    result\n    hostName\n    userProfile {\n      ownerCount {\n        fan\n        photo\n        follow\n        photo_public\n        __typename\n      }\n      profile {\n        gender\n        user_name\n        user_id\n        headurl\n        user_text\n        user_profile_bg_url\n        __typename\n      }\n      isFollowing\n      __typename\n    }\n    __typename\n  }\n}\n",
            "variables":{"userId": window.location.pathname.split("/")[2]}
        }

        $.ajax({
            type: "post",
            url: "https://www.kuaishou.com/graphql",
            data: JSON.stringify(userData),
            contentType:'application/json',
            dataType: "json",
            async: true,
            success: function (res) {
                console.log(res);
                let resData = res.data.visionProfile.userProfile
                if(resData){
                    // 粉丝数
                    let fans_count_str = resData.ownerCount ? resData.ownerCount.fan : ""
                    // console.log(fans_count_str)
                    let fans_count_num = fans_count_str.indexOf("万") == -1 ? fans_count_str : fans_count_str.split("万")[0]*10000
                    // console.log(fans_count_num)
                    fans_count = resData.ownerCount ? fans_count_num : ""
                    // 作品数
                    video_count = resData.ownerCount ? resData.ownerCount.photo_public : ""
                    // 关注数
                    following = resData.ownerCount ? resData.ownerCount.follow : ""


                    // 昵称
                    nick = resData.profile.user_name
                    // id
                    sec_uid = resData.profile.user_id;
                    // 抖音author_id
                    author_id = resData.profile.user_id;
                    // account号
                    account = resData.profile.user_id;
                    // 头像
                    avatar = resData.profile.headurl;
                    // 简介
                    desc = resData.profile.user_text;
                    // 性别
                    sex = resData.profile.gender == "F" ? 2 : 1

                    if(following == ""){
                        $(".data-amount").css("color","red");
                    }

                    // 简介信息渲染
                    $(".follower_count").append(`关注数：${following == "" ? "请在快手平台登录账号,已登录请刷新页面" : following}`);
                    $(".fans_count").append(`粉丝数：${fans_count == "" ? "请在快手平台登录账号,已登录请刷新页面" : fans_count_str}`);
                    $(".video_count").append(`作品数：${video_count == "" ? "请在快手平台登录账号,已登录请刷新页面" : video_count}`);
                    // 判断手机密码是否存储 存储就登录
                    if(localStorage.getItem("token")!=null){
                        resourceInfo();
                    }
                }else{
                    // 简介信息渲染
                    $(".follower_count").append(`无法获取数据，快手号被封`);
                    $(".fans_count").append(`无法获取数据，快手号被封`);
                    $(".video_count").append(`无法获取数据，快手号被封`);
                }
            },
            error: function(fail){
                console.log(fail.statusText)
            }
        });

        // 分类
        cate = "";
        // 位置
        location = "";
        // 获赞数
        like_count = "";
        // 平台id
        platform_id = 3;


        // 定义参数max_cursor
        let pcursor = "";

        // 调用接口获取视频数据
        function getKsVideoInfo(){
            let token = localStorage.getItem("token");
            // loading 加载
            $(".loading").show()

            // 接口传递参数
            let dataVideo = {
                "operationName":"visionProfilePhotoList",
                "query":"fragment photoContent on PhotoEntity {\n  id\n  duration\n  caption\n  originCaption\n  likeCount\n  viewCount\n  realLikeCount\n  coverUrl\n  photoUrl\n  photoH265Url\n  manifest\n  manifestH265\n  videoResource\n  coverUrls {\n    url\n    __typename\n  }\n  timestamp\n  expTag\n  animatedCoverUrl\n  distance\n  videoRatio\n  liked\n  stereoType\n  profileUserTopPhoto\n  musicBlocked\n  __typename\n}\n\nfragment feedContent on Feed {\n  type\n  author {\n    id\n    name\n    headerUrl\n    following\n    headerUrls {\n      url\n      __typename\n    }\n    __typename\n  }\n  photo {\n    ...photoContent\n    __typename\n  }\n  canAddComment\n  llsid\n  status\n  currentPcursor\n  tags {\n    type\n    name\n    __typename\n  }\n  __typename\n}\n\nquery visionProfilePhotoList($pcursor: String, $userId: String, $page: String, $webPageArea: String) {\n  visionProfilePhotoList(pcursor: $pcursor, userId: $userId, page: $page, webPageArea: $webPageArea) {\n    result\n    llsid\n    webPageArea\n    feeds {\n      ...feedContent\n      __typename\n    }\n    hostName\n    pcursor\n    __typename\n  }\n}\n",
                "variables":{"page": "profile",pcursor: pcursor,"userId": window.location.pathname.split("/")[2]}
            }
            $.ajax({
                type: "post",
                url: "https://www.kuaishou.com/graphql",
                data: dataVideo,
                async: true,
                success: function (res) {
                    // console.log(res);
                    let dataInfo = res.data.visionProfilePhotoList.feeds
                    for(let key in dataInfo){
                        // 定义对象存储单个视频信息数据
                        let starData = {};
                        // console.log(res.aweme_list[key])

                        // 如果是视频  aweme_type = 0  获取视频数据
                        if(dataInfo[key].type == 1){
                            // 视频标题介绍
                            starData[0] = dataInfo[key].photo.caption
                            // 视频缩略图
                            starData[1] = dataInfo[key].photo.coverUrl
                            // 视频
                            starData[2] = dataInfo[key].photo.photoUrl
                            // 视频收藏数
                            starData[3] = 0
                            // 视频点赞数
                            starData[4] = dataInfo[key].photo.realLikeCount
                            // 视频评论数
                            starData[5] = 0
                            // 视频分享数
                            starData[6] = 0
                            // 视频时长
                            starData[7] = dataInfo[key].photo.duration

                            // 数据填充进数组
                            videoData.push(starData)
                        }
                    }

                    // 如果还有下一页接着调用接口
                    if(res.data.visionProfilePhotoList.pcursor != "no_more"){
                        // 改变max_cursor参数来接着调用下一页数据
                        pcursor = res.data.visionProfilePhotoList.pcursor
                        getKsVideoInfo()
                    }else{
                        console.log(videoData)

                        // 提交数据
                        $.ajax({
                            type: "post",
                            url: apiHost+"/spider/browser/videos",
                            data: {
                                "app_type": "tools_" + platform_id,
                                "app_id": "1",
                                "sign": "1",
                                "access_token": token,
                                "platform_id": platform_id, //达人归属平台
                                "cool_id": localStorage.getItem("cool_id"),
                                "v_lists": JSON.stringify(videoData), //达人数据
                            },
                            async: false,
                            success: function (res) {
                                console.log(res);
                                // loading 结束
                                $(".loading").hide()
                                if(res.code === 1000){
                                    msgHide("同步成功")

                                    // 初始化数据
                                    videoData = [];
                                    pcursor = "";
                                }else if(res.code === 1002){
                                    alert("同步失败，请重新登录")
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("storagePhone");
                                    localStorage.removeItem("storagePwd");
                                    localStorage.removeItem("dep_name");
                                    localStorage.removeItem("staffName");
                                    $(".operate").hide();
                                    $(".loginBox").show();

                                    // 初始化数据
                                    videoData = [];
                                    pcursor = "";
                                }else{
                                    msgHide("同步失败")

                                    // 初始化数据
                                    videoData = [];
                                    pcursor = "";
                                }
                            },
                            error: function(fail){
                                // loading 结束
                                $(".loading").hide()
                                console.log(fail.statusText)
                                msgHide("同步失败，请联系技术部")

                                // 初始化数据
                                videoData = [];
                                pcursor = "";
                            }
                        });
                    }
                }
            });
        }


        // 定义数组来接收数据
        let videoData = [];

        // 同步数据
        $("#synchronize").click(function(){
            getKsVideoInfo();
        })

    }


    //  md5 方法
    function md5(string) {
        function md5_RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function md5_AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function md5_F(x, y, z) {
            return (x & y) | ((~x) & z);
        }

        function md5_G(x, y, z) {
            return (x & z) | (y & (~z));
        }

        function md5_H(x, y, z) {
            return (x ^ y ^ z);
        }

        function md5_I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        function md5_FF(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };

        function md5_GG(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };

        function md5_HH(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };

        function md5_II(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };

        function md5_ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function md5_WordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        function md5_Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
        string = md5_Utf8Encode(string);
        x = md5_ConvertToWordArray(string);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = md5_AddUnsigned(a, AA);
            b = md5_AddUnsigned(b, BB);
            c = md5_AddUnsigned(c, CC);
            d = md5_AddUnsigned(d, DD);
        }
        return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
    }




    // resourceInfo 接口调用
    function resourceInfo(){
        var token = localStorage.getItem("token");
        // 检测达人是否可以绑定
        var dataBind = {
            "app_type": "tools_"+platform_id,
            "app_id": 1,
            "sign": 1,
            "access_token": localStorage.getItem("token"),
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
        // console.log(dataBind);

        $(".loginBox").hide();
        $(".operate").show();

        // 粉丝数少于49500  不显示操作
        // if(fans_count < fansNum){
        //     $(".operate-btn").hide();
        //     $(".talent").hide();
        //     $(".expandTime").hide();
        //     $(".expand").text("该达人粉丝数少于五万不达标！");
        // }

        $.ajax({
            type: "post",
            url: apiHost+"/spider/browser/resourceInfo",
            data: dataBind,
            dataType: "json",
            success: function (response) {
                console.log(response);
                if(response.code == 1000){

                    // 设置cool_id,resource_id
                    localStorage.setItem("cool_id",response.result.info.cool_id);
                    localStorage.setItem("resource_id",response.result.info.resource_id);

                    $(".info-name").text(response.result.info.nick_prefix+nick);
                    $(".expand span").text(response.result.info.mcn_bind_state_str);
                    $(".expandTime span").text(response.result.info.mcn_bind_refresh_time_str);
                    // $(".talent span").text(response.result.info.with_desc);

                    // 达人编号
                    if(response.result.info.resource_id != 0){
                        let starNum = "<p>达人编号：<span id='copy'>" + response.result.info.resource_id + "</span></p>";
                        $(".info-name").append(starNum);
                    }

                    // 页面显示author_id
                    let authorNum = "<div>MID：<span id='copy'>" + author_id + "</span></div>";
                    console.log(author_id)
                    $(".info-name").append(authorNum);
                }else if(response.code == 1002){
                    localStorage.removeItem("token");
                    localStorage.removeItem("storagePhone");
                    localStorage.removeItem("storagePwd");
                    localStorage.removeItem("dep_name");
                    localStorage.removeItem("staffName");
                    $(".operate").hide();
                    $(".loginBox").show();
                }else{
                    alert(response.message);
                }
            }
        })
    }

    // 版本号验证
    function ver(){
        $.ajax({
            type: "post",
            url: apiHost+"/spider/browser/version",
            data:{
                type: 1
            },
            dataType: "json",
            success: function (response) {
                console.log(response);
                if(response.code == 1000){
                    if(response.result.v != version && response.result.u == true){
                        $(".renew").show();
                    }
                }else if(response.code == 1002){
                    alert(response.message);
                    localStorage.removeItem("token");
                    localStorage.removeItem("storagePhone");
                    localStorage.removeItem("storagePwd");
                    localStorage.removeItem("dep_name");
                    localStorage.removeItem("staffName");
                    window.location.reload();
                }else{
                    // 显示提示信息
                    alert(response.message)
                }
            }
        });
    }

    // 版本号是否更新
    ver();


    // 点击登录验证显示弹窗
    function loginInfo(){
        if(checkphone()&&checkpwd()){
            let phone = $("#cyphoneNum").val()
            let pwd = md5($("#cypwd").val())
            // 登录传递的参数
            var data = {
                "app_type": "tools_"+platform_id,
                "app_id": 1,
                "phone": phone,
                "pwd": pwd,
                "v": version
            }
            // console.log(data);
            // 登录传参
            $.ajax({
                type: "post",
                url: apiHost+"/spider/browser/login",
                data: data,
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    if(response.code == 1000){
                        // 获取部门和名字 存储
                        $(".operate-name").text("欢迎你，"+response.result.dep_name+"-"+response.result.name);
                        localStorage.setItem("dep_name",response.result.dep_name);
                        localStorage.setItem("name",response.result.name);

                        // 获取token 存储
                        localStorage.setItem("token",response.result.access_token);
                        var token = localStorage.getItem("token");

                        // 获取账号密码 存储session
                        // localStorage.setItem("storagePhone",$("#cyphoneNum").val());
                        // localStorage.setItem("storagePwd",md5($("#cypwd").val()));
                        // var storagePhone = localStorage.getItem("storagePhone");
                        // var storagePwd = localStorage.getItem("storagePwd");

                        resourceInfo();

                    }else{
                        // 显示账号密码不正确
                        alert(response.message)
                    }
                }
            });
        }
    }


    $(".login-btn button").click(function(){
        loginInfo()
    })
    $(".loginBox").keydown(function(){
        if(event.keyCode==13){
            loginInfo()
        }
    })



    // 判断手机密码是否存储 存储就登录
    if(localStorage.getItem("token")!=null){
        if(rex.match(/https:\/\/www.kuaishou.com\/profile\/*/) == null && rex.match(/https:\/\/live.kuaishou.com\/profile\/*/) == null && rex.match(/https:\/\/www.xiaohongshu.com\/user\/profile\/*/) == null){
            if(rex.match(/https:\/\/weibo.com\/*/) != null){
                if(rex.match(/https:\/\/weibo.com\/u\/*/) == null){
                    return false
                }
            }
            resourceInfo();
        }
    }else{
        if(rex.match(/https:\/\/www.kuaishou.com\/profile\/*/) == null && rex.match(/https:\/\/live.kuaishou.com\/profile\/*/) == null && rex.match(/https:\/\/www.xiaohongshu.com\/user\/profile\/*/) == null){
            if(rex.match(/https:\/\/weibo.com\/*/) != null){
                if(rex.match(/https:\/\/weibo.com\/u\/*/) == null){
                    return false
                }
            }
        }
    }




    // 信息框拖拽
    function dragInfo(yTop,yBot){
        var _move=false;//移动标记
        var _x,_y;//鼠标离控件左上角的相对位置
        $(".operate").click(function(){
            //alert("click");//点击（松开后触发）
        }).mousedown(function(e){
            //console.log(e);
            _move=true;
            _x=e.pageX-parseInt($(".operate").css("left"));
            _y=e.pageY-parseInt($(".operate").css("top"));
            // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
        });
        $(document).mousemove(function(e){
            if(_move){
                var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y;
                //console.log("y",y);
                if(x < 0){
                    x = 0;
                }else if(x > $(document).width() - $('.operate').outerWidth(true)){ // 判断是否超出浏览器宽度
                    x = $(document).width() - $('.operate').outerWidth(true)
                }
                if (y < yTop) {
                    y = yTop;
                } else if (y > $(window).height() - $('.operate').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                    y = $(window).height() - $('.operate').outerHeight(true) + yBot;
                }
                $(".operate").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move=false;

            // 记录每次拖拽后位置存储
            localStorage.setItem("elLeft",$(".operate").css("left"));
            localStorage.setItem("elTop",$(".operate").css("top"));
            // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
    }

    // 获取信息框拖拽后位置
    var elLeft = localStorage.getItem("elLeft");
    var elTop = localStorage.getItem("elTop");
    $(".operate").css({
        "left": elLeft,
        "top": elTop
    })


    // 登录框拖拽
    function dragInfo1(yTop,yBot){
        var _move1=false;//移动标记
        var _x1,_y1;//鼠标离控件左上角的相对位置
        $(".loginBox").click(function(){
            //alert("click");//点击（松开后触发）
        }).mousedown(function(e){
            //console.log(e);
            _move1=true;
            _x1=e.pageX-parseInt($(".loginBox").css("left"));
            _y1=e.pageY-parseInt($(".loginBox").css("top"));
            // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
        });
        $(document).mousemove(function(e){
            if(_move1){
                var x=e.pageX-_x1;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y1;
                // console.log("y",y);
                if(x < 0){
                    x = 0;
                }else if(x > $(document).width() - $('.loginBox').outerWidth(true)){ // 判断是否超出浏览器宽度
                    x = $(document).width() - $('.loginBox').outerWidth(true)
                }
                if (y < yTop) {
                    y = yTop;
                } else if (y > $(window).height() - $('.loginBox').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                    y = $(window).height() - $('.loginBox').outerHeight(true) + yBot;
                }
                $(".loginBox").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move1=false;

            // 记录每次拖拽后位置存储
            localStorage.setItem("elLeftLogin",$(".loginBox").css("left"));
            localStorage.setItem("elTopLogin",$(".loginBox").css("top"));
            // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
    }

    // 获取登录框拖拽后位置
    var elLeftLogin = localStorage.getItem("elLeftLogin");
    var elTopLogin = localStorage.getItem("elTopLogin");
    $(".loginBox").css({
        "left": elLeftLogin,
        "top": elTopLogin
    })

    // 点击收起展开
    // el 元素 elBox 展开收起元素  toggleName localStorage存储名称 drag 调用函数 yTop,yBot,yTop1,yBot1 展开收起时各自对于顶部以及底部的限制范围
    function toggleShow(el,elBox,toggleName,drag,yTop,yBot,yTop1,yBot1,flag){
        el.click(function(){
            if($(this).attr("data-bind") == 1){
                el.html(`<svg t="1646796481460" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3799" width="48" height="48"><path d="M122.368 165.888h778.24c-9.216 0-16.384-7.168-16.384-16.384v713.728c0-9.216 7.168-16.384 16.384-16.384h-778.24c9.216 0 16.384 7.168 16.384 16.384V150.016c0 8.192-6.656 15.872-16.384 15.872z m-32.768 684.544c0 26.112 20.992 47.104 47.104 47.104h750.08c26.112 0 47.104-20.992 47.104-47.104V162.304c0-26.112-20.992-47.104-47.104-47.104H136.704c-26.112 0-47.104 20.992-47.104 47.104v688.128z" p-id="3800" fill="#2c2c2c"></path><path d="M138.752 158.208V435.2h745.472V158.208H138.752z m609.792 206.336l-102.912-109.056 25.088-26.624 77.824 82.432 77.824-82.432 25.088 26.624-102.912 109.056z" p-id="3801" fill="#2c2c2c"></path></svg>`);
                elBox.slideUp();
                localStorage.setItem(toggleName,false);
                $(this).attr("data-bind",2);
                if(flag){
                    elBox.next().css({
                        "marginTop":"0",
                        "textAlign": "left"
                    });
                }
                drag(yTop,yBot);
            }else{
                el.html(`<svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg>`);
                elBox.slideDown();
                localStorage.setItem(toggleName,true);
                $(this).attr("data-bind",1);
                elBox.next().css({
                    "marginTop":"20px",
                    "textAlign": "center"
                });
                drag(yTop1,yBot1);
            }
        })
        var toggle = localStorage.getItem(toggleName);
        // console.log(toggle);
        if(toggle == "true" || toggle == undefined){
            el.html(`<svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg>`);
            elBox.show();
            el.attr("data-bind",1);
            elBox.next().css({
                "marginTop":"20px",
                "textAlign": "center"
            });
            drag(yTop1,yBot1);
        }else{
            el.html(`<svg t="1646796481460" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3799" width="48" height="48"><path d="M122.368 165.888h778.24c-9.216 0-16.384-7.168-16.384-16.384v713.728c0-9.216 7.168-16.384 16.384-16.384h-778.24c9.216 0 16.384 7.168 16.384 16.384V150.016c0 8.192-6.656 15.872-16.384 15.872z m-32.768 684.544c0 26.112 20.992 47.104 47.104 47.104h750.08c26.112 0 47.104-20.992 47.104-47.104V162.304c0-26.112-20.992-47.104-47.104-47.104H136.704c-26.112 0-47.104 20.992-47.104 47.104v688.128z" p-id="3800" fill="#2c2c2c"></path><path d="M138.752 158.208V435.2h745.472V158.208H138.752z m609.792 206.336l-102.912-109.056 25.088-26.624 77.824 82.432 77.824-82.432 25.088 26.624-102.912 109.056z" p-id="3801" fill="#2c2c2c"></path></svg>`);
            elBox.hide();
            el.attr("data-bind",2);
            if(flag){
                elBox.next().css({
                    "marginTop":"0",
                    "textAlign": "left"
                });
            }
            drag(yTop,yBot);
        }
    }

    // 信息框收起展开
    toggleShow($(".operate-toggle"),$(".operate-box"),"toggle1",dragInfo,100,0,300,329,true);

    // 登录框收起展开
    toggleShow($(".login-toggle"),$(".login-box"),"toggle2",dragInfo1,120,40,200,140);


    // 退出登录
    $(".operate-quit a").click(function(){
        localStorage.removeItem("token");
        localStorage.removeItem("storagePhone");
        localStorage.removeItem("storagePwd");
        localStorage.removeItem("dep_name");
        localStorage.removeItem("staffName");
        window.location.reload();
    })

    // 达人编号 MID 点击复制文本内容
    $(".info-name").on("click","#copy",function(){
        console.log(this.innerText)
        var Url2= this.innerText;
        var oInput = document.createElement('input');
        oInput.value = Url2;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.remove();
        msgHide("复制成功!");
    })



})();