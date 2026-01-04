// ==UserScript==
// @name         bjjnts
// @namespace    https://www.bjjnts.cn/mine/student/study
// @version      1.2
// @description  北京市职业技能提升行动管理平台自动播放
// @author       Jassist
// @match        https://*.bjjnts.cn/*
// @match        https://*.bjjnts.cn/*
// @match        https://*.zpimg.cn/*
// @match        https://*.alicdn.com/*
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @connect      100anquan.com
// @run-at       document-end
// @require      https://libs.baidu.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/435806/bjjnts.user.js
// @updateURL https://update.greasyfork.org/scripts/435806/bjjnts.meta.js
// ==/UserScript==

let playErr = 0;//播放错误次数
(function () {
    'use strict';
    //
    let tooberUrl = "";
    //有时间获取url有问题，循环监听地址变化再见触发
    setInterval(function () {

        if (unsafeWindow.window.location.href.indexOf("https://www.bjjnts.cn/user/login") !== -1) {
            MyPlayer._log("模拟登录");


            let loginBtn = $(".ant-form-item-control-input-content").find('button');
            if(loginBtn.length>0)
            {
                setTimeout(() => {
                    loginBtn[0].click()
                }, 2000);

            }
        }
        if (unsafeWindow.window.location.href !== tooberUrl) {
            //时时检测当前网页网址
            tooberUrl = unsafeWindow.window.location.href;

            if (tooberUrl.indexOf("https://www.bjjnts.cn/home") !== -1) {
                MyPlayer._log("进入：首页");
                MyWeb._init();
            }
            if (tooberUrl.indexOf("https://www.bjjnts.cn/mine/student/setting") !== -1) {
                MyPlayer._log("进入：修改页面");
                MyWeb._goHome();
            }
            if(!MyPlayer._getPlayFlat()){
                MyPlayer._log("暂停");
                return ;
            }
            if (tooberUrl.indexOf("https://www.bjjnts.cn/mine/student/study") !== -1) {
                MyPlayer._log("进入：课程列表");
                MyWeb._searchLoginName(); //查找用户名
                /**
                 * 逻辑关系：检测课程列表数量，并且根据当前学习索引进入进程学习
                 */
                MyPlayer._playStduy();
            } else if (tooberUrl.indexOf("https://www.bjjnts.cn/study/video") !== -1 ||
                       tooberUrl.indexOf("https://www.bjjnts.cn/study?") !== -1
                      ) {
                MyPlayer._log("进入视频: stduyIndex：" + MyPlayer._getStudyIndex());
                /**
                 * 逻辑关系：1 检查当前页未学完的视频
                 *            1 学完跳转到课程页
                 *            2 有未学完的点击播放进行学习
                 */
                setInterval(function () {
                    if (MyWeb._any()) {
                        //检测确定按钮/学习超时按钮提示
                        return;
                    }
                    let linksSize = MyWeb._searchLinksSize();
                    if (linksSize <= 0) {
                        MyPlayer._log("本课程已学完");
                        MyWeb._goHome();
                    } else {
                        if (MyWeb._checkStudyFinish()) {
                            //本页视频完成
                            MyWeb._joinLinks();
                        } else {
                            //本页没有播放完成则播放
                            let b1 = MyWeb._checkStopButton(false);
                            let b2 = MyWeb._checkPlayButton(true);
                            if(b1 == false && b2 == false){
                                //无播放，无停止按
                                MyWeb._repVedio();
                            }
                        }
                    }
                    //设置title
                    MyWeb._setLoginName();
                    //检查视频是不是出错，是则刷新
                    MyWeb._searchVedioErr();
                }, 5000);

            } else if (tooberUrl.indexOf("https://www.bjjnts.cn/study/exam") !== -1) {
                MyPlayer._log("跳过单元测式");
                MyWeb._goHome();
            } else if (tooberUrl.indexOf("https://www.bjjnts.cn/study/courseware") !== -1) {
                MyPlayer._log("跳过单元考试");
                MyWeb._goHome();
            }

        } else {
            tooberUrl = unsafeWindow.window.location.href;
        }
        MyPlayer._log(tooberUrl);
    }, 2000);
})();

//播放控制
let MyPlayer = {
    _init: function () {
        unsafeWindow.MyPlayer = MyPlayer;
        unsafeWindow.MyWeb = MyWeb;
    },
    _playStduy: function () {
        //此方法需要在课程目录下调用
        //开始学习一个课程
        if (!MyPlayer._getPlayFlat()) {
            MyPlayer._log("未开始或已暂停");
            return;
        }
        let studysIndex = MyPlayer._getStudyIndex(); //取当前课程索引
        let timeThread = setInterval(function () {
            //因为列表是异步加载，所有定时检测
            let studys = MyWeb._searchStudy();
            if (studys.length > 0) {
                //检测到了就清除定时器
                clearInterval(timeThread);
                if (studysIndex > studys.length) {
                    MyPlayer._log("MyPlayer._play:播放课程索引越界");
                } else {
                    //进入课程
                    MyPlayer._log("进入课程:" + studys.length + " " + studysIndex);
                    if((studysIndex + 1) > studys.length){
                        MyPlayer._setStudyIndex(0);
                    }else{
                        MyPlayer._setStudyIndex(studysIndex + 1);
                    }
                    studys[studysIndex].click(); //点击进入
                }
            }
        }, 2000);
    },
    _stopStduy: function () {
        //暂停课程播放
        MyPlayer._setPlayFlat(true);
        MyPlayer._setStudyIndex(0);
    },
    _getPlayFlat: function () {
        //获取播放状态
        let result = GM_getValue("playFlat");
        if (result === undefined) {
            return true;
        }
        MyPlayer._log("getPlayFlat_playFlat:", result);
        return result;
    },
    _setPlayFlat: function (isPlay) {
        //设置播放状态
        GM_setValue("playFlat", isPlay);
        MyPlayer._log("GM_setValue_playFlat:", isPlay);
    },
    _setStudyIndex: function (value) {
        //存储当前播放课程索引
        if (value === undefined) {
            GM_setValue("studyIndex", 0);
        } else {
            GM_setValue("studyIndex", value);
        }
    },
    _getStudyIndex: function () {
        //从存出获取当前播放课程索引
        let val = GM_getValue("studyIndex");
        if (val === undefined) {
            MyPlayer._setStudyIndex(0);
            return 0;
        } else {
            return val;
        }
    },
    _log: function (msg) {
        GM_log(msg);
    }
};
//网页操作
let MyWeb = {
    _init: function(){
        unsafeWindow.MyWeb = MyWeb;
        unsafeWindow.MyPlayer = MyPlayer;

        MyWeb._any()


        let lab = $("[class^='ant-dropdown-trigger']");
        if(lab.length > 0){
            if(MyPlayer._getPlayFlat()){
                lab.parent().after("<button id = 'btn-on' style='background: red;color: white' onclick='MyPlayer._setPlayFlat(false);alert(\"连播插件已停用\");MyWeb._goHome();' >停用连播插件</button>")
            }else{
                lab.parent().after("<button id = 'btn-on' style='background: green;color: white' onclick='MyPlayer._setPlayFlat(true);MyPlayer._setStudyIndex(0);alert(\"连播插件已开启\");MyWeb._goHome();' >开启连播插件</button>")
            }
        }
    },
    _repVedio: function(){
        MyWeb._goHome();
    },
    _searchLoginName : function(){
        //mobile___3wQCc
        let lName = $("div[class^='mobile___']");
        if(lName.length > 0 ){
            GM_setValue("bjjnts_loginName", lName.eq(0).text());
        }
    },
    _setLoginName : function(){
        let loginName = GM_getValue("bjjnts_loginName");
        if(loginName === null || loginName === undefined)
        {
            return;
        }
        let time = "";
        //current-time
        let span1 =  $("span[class='current-time']");
        let span2 = $("span[class='duration']");
        if(span1.length > 0 && span2.length > 0){
            time = span1.text()+":"+span2.text();
        }
        $("title").html("["+loginName+"]"+time);
    },
    _goHome: function () {
        // 跳转到课程页
        unsafeWindow.window.location.href = "https://www.bjjnts.cn/mine/student/study";
    },
        _goLogin: function () {
        // 跳转到课程页
        unsafeWindow.window.location.href = "https://www.bjjnts.cn/user/login";
    },
    _addHomeBtn :function() {
        //主页增加控制按钮
        let trigger = $("a[class='ant-dropdown-trigger']");
        if(trigger.length > 0){
            trigger.parent().append('　开启连播插件<input style="font-size:20px"; id="hk_sw" type="checkbox" value="连播插件" checked="checked" />　');
        }
    },
    _checkPlayButton: function (isPlay) {
        //检查是否有播放按钮，有则表示未播放，点击会播放
        //prism-big-play-btn loading-center
        //prism-big-play-btn loading-center pause
        //prism-play-btn
        let playBtn = $("[class='prism-big-play-btn loading-center']");
        if (playBtn.length > 0) {
            //有则返回此按钮
            MyPlayer._log("有播放按钮:" + playBtn.length);
            if(isPlay){
                playBtn[0].click();
                MyPlayer._log("点击播放");
                playErr++;
                if(playErr>=5){
                    playErr = 0;
                    //大于次无法播放直接返回
                    MyWeb._repVedio();
                }
            }
            return true;
        } else {
            MyPlayer._log("无播放按钮");
            return false;
        }
    },
    _checkStopButton: function (isStop) {
        //检查是否有播放按钮,有则代表正在播放，点击会暂停
        let stopBtn = $("[class='prism-play-btn playing']");
        if (stopBtn.length >= 1) {
            //有则返回此按钮
            MyPlayer._log("有停止按钮");
            if(isStop){
                stopBtn[0].click();
            }
            return true;
        } else {
            MyPlayer._log("无停止按钮");
            return false;
        }
    },
    _searchStudy: function () {
        //寻找课程列表
        // https://www.bjjnts.cn/mine/student/study
        let list = $("a[class^='lesson_list_item___']");
        MyPlayer._log("课程数量:" + list.length);
        return list;
    },
    _joinLinks(){
        //进入未学视频学习
        let list = $("a[href^='/study/video']");
        MyPlayer._log("进入未学课程:" + list.length);
        //搜索<span role="img" aria-label="check-circle" class="anticon anticon-check-circle study_success_svg___jPGAq">
        for (let i = 0; i < list.length; i++) {
            let aTag = list.eq(i); //jquery对象
            if (aTag.find("span[role='img']").length <= 0) {
                list[i].click(); //dom对象点击
                break;
            }
        }
    },
    _searchVedioErr: function(){
        //video_error_wrap
        //视频解析失败了，请几分钟后再试。您可以尝试切换清晰度或先学习其他章节。
        //[4400]由于服务器或网络原因不能加载资源，或者格式不支持
        let lab = $("div[class='video_error_wrap']");
        if(lab.length > 0){
            MyPlayer._log( lab.eq(0).text());
            unsafeWindow.window.location.reload();
        }
    },
    _searchLinksSize: function () {
        //搜索未学的链接列表
        let index = 0;
        //href="/study/video?course_id=529&unit_id=12076&class_id=12447"
        let list = $("a[href^='/study/video']");
        MyPlayer._log("搜索到视频个数:" + list.length);
        //搜索<span role="img" aria-label="check-circle" class="anticon anticon-check-circle study_success_svg___jPGAq">
        for (let i = 0; i < list.length; i++) {
            let aTag = list.eq(i);
            if (aTag.find("span[role='img']").length <= 0) {
                index++
            }
        }
        MyPlayer._log("未学习的视频个数:" + index);
        return index;
    },
    _checkStudyFinish: function () {
        //检查当前而是否已学完
        //<img src="https://g.alicdn.com/de/prismplayer/2.9.3/skins/default/img/dragcursor.png">
        let result = false;
        /**
         * 判断是否有此图片（播放条拖拽图片）有则已完成
         *
         */
        let playTag = $("#J_prismPlayer");
        if (playTag.length > 0) {
            //有播放视频DIV层,J_prismPlayer
            let imgTag = playTag.find("img[src$='https://g.alicdn.com/de/prismplayer/2.9.3/skins/default/img/dragcursor.png']");
            if (imgTag.length > 0) {
                result = true;
            }
        }
        if(!result){
            if(MyWeb._searchNextBtn()){
                //判断是否有下一集按钮
                result = true;
            }
        }
        if(!result){
            if(MyWeb._searchRepBtn()){
                //判断是否有重播按钮
                result = true;
            }
        }
        MyPlayer._log("本页播放是否完成:" + result);
        return result;
    },_searchNextBtn : function (){
        //寻找下一集按钮
        let btn = $("button[class^='next_button___']");
        if(btn.length > 0){
            return true;
        }else{
            return false;
        }
    },_searchRepBtn : function (){
        //寻找重播按钮
        let btn = $("button[class^='reset_button___']");
        if(btn.length > 0){
            return true;
        }else{
            return false;
        }
    },
    _any: function any() {
        //检测确认按钮/学习超过8小时按钮
        //ant-btn ant-btn-primary
        let time = $("button[class='ant-btn ant-btn-primary']");
        if (time.length > 0) {
            MyPlayer._log("检测到需要确认学习:" + time.length);
            let spans = $("span");
            let flag = false;
            for (let i = 0; i < spans.length; i++) {
                if (spans.eq(i).text() == "1天最多学习8小时，快去休息吧") {
                    MyPlayer._log("1天最多学习8小时，快去休息吧");
                    flag = true;
                    MyPlayer._stopStduy(); //停止

                    MyWeb._goLogin()
                    break;
                }
                if (spans.eq(i).text() == "好的, 我知道了") {
                    MyPlayer._log("好的, 我知道了");


                    break;
                }
            }
            if (!flag) {
                //检测到需要确认学习
                time[0].click();
            }
            return true;
        } else {
            return false;
        }
    }
};
