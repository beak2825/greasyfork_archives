// ==UserScript==
// @name         UESTC dxpx
// @version      0.2.2
// @description  UESTC dxpx学习平台刷课工具
// @author       4ehex + fang
// @match        https://dxpx.uestc.edu.cn/user/account/info
// @match        https://dxpx.uestc.edu.cn/user/lesson
// @match        https://dxpx.uestc.edu.cn/fzdx/*
// @match        https://dxpx.uestc.edu.cn/jjfz/*
// @match        https://dxpx.uestc.edu.cn/exam/*
// @connect      easylearn.baidu.com
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.0.0/jquery.js
// @icon         http://www.gov.cn/ztzl/17da/183d03632724084a01bb02.jpg
// @license      MIT

// @namespace https://greasyfork.org/zh-CN/users/1073349
// @downloadURL https://update.greasyfork.org/scripts/465559/UESTC%20dxpx.user.js
// @updateURL https://update.greasyfork.org/scripts/465559/UESTC%20dxpx.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

let _self = unsafeWindow, url = location.pathname, videoLists = [], interval_id = -1;

//注册油猴菜单
let id_course = RegisterTipMenu("course", "开/关 自动进入未完成课程", "自动进入未完成课程</p><p>(此功能将在进入课程中心时自动查找未完成必读课件的课程)</p>");
let id_compulsory = RegisterTipMenu("compulsory", "开/关 自动进入必修课程", "自动进入必修课程</p><p>(此功能将在进入课程时自动查找未完成的必修课程)</p>");
let id_back = RegisterTipMenu("back", "开/关 自动返回上一级", "自动返回上一级</p><p>(此功能将在完成视频列表里所有播放时, 返回上一级自动查找还未看的视频)</p>");
let id_rightmenu = RegisterTipMenu("rightmenu", "开/关 右键菜单复制", "右键菜单复制</p><p>(此功能将开启右键菜单和复制)</p>");
let id_answer = RegisterTipMenu("answer", "开/关 考试自动搜索答案", "自动搜索答案</p><p>(此功能将自动读取题目，通过百度题库搜索并显示答案)</p>")
let id_about = GM_registerMenuCommand ("关于", function(){
    video_note();
});


// 适配发展对象
if ((url == "/fzdx/lesson"))
{
    alert_note(2, ["转到", "取消"], "[刷课脚本] 提示", '<p>请转到\'个人中心-我的课程\'页面</p><p>当前页面还未做刷课适配</p>', 'public_cont1',
                   function () { $(".public_close").click(); },function (){ $(".public_close").click();});
}

if (url == "/user/account/info")
{
    alert_note(2, ["明白", "关闭"], "[刷课脚本] 提示", '<p>发展对象请转到\'我的课程\'页面开始刷课</p><p>积极分子请转到\'课程中心\'页面开始刷课</p><p>(若未开启刷课,需点击油猴图标开启刷课功能后刷新页面)</p>', 'public_cont1',
                   function () { window.location.href = "https://dxpx.uestc.edu.cn/user/lesson"; },function (){ $(".public_close").click();});
}

if (url == "/user/lesson")
{
    if (!GM_getValue("dont_note")) video_note();

    if (GM_getValue("course")) {
        var unstudy_links = new Array();//所有'未学习'的路由url

        // 遍历所有 class 为 'study_plan2' 的元素
        $('.study_plan2').each(function() {
            var unfinishedFound = false;
            // 遍历子元素
            $(this).find('*').each(function() {
                // 检查子元素的文本是否包含 '未完成'
                if ($(this).text().indexOf('未完成') !== -1) {
                    unfinishedFound = true;
                    return false; // 停止遍历子元素
                }
            });
            // 如果找到了包含 '未完成' 的子元素
            if (unfinishedFound) {
                var study_a = $(this).find('.study_a:contains("学习")').attr('href');
                unstudy_links.push(study_a);
            }
        });

        if (unstudy_links.length != 0)
        {
            //进入第一个还未学习的课程
            console.log("[Debbug] Enter:" + unstudy_links[0]);
            window.location.href = unstudy_links[0];
        }
        else
        {
            alert_note(2, ["好的", "敬请期待"], "提示", '<p>已刷完全部课程</p><p>感谢使用!</p><p>发展对象考试搜题功能还在开发中^_^</p>', 'public_cont1',
                       function () { $(".public_close").click();},function (){ $(".public_close").click();});
        }
    }
}

//定位到'必读课件'＜'已完成必读课件'的课程 并自动跳转到'课程中心-精品课程'
if (url == "/jjfz/lesson") {
    if (!GM_getValue("dont_note")) video_note();

    if(interval_id!= -1) {
        clearInterval(interval_id);
        interval_id = -1;
    }

    if (GM_getValue("course")) {
        let completed_count = 0, course_count = $(".lesson_c_ul").children().length;

        $(".lesson_center_dl").each( function() {
            let courseware_ = $(this).text();
            let required_ = parseInt(courseware_.substr(courseware_.indexOf("必读课件：") + 5, 4));
            let completed_ = parseInt(courseware_.substr(courseware_.indexOf("已完成必读课件：") + 8), 4);
            //console.log("必读课件:" + required_ + "\n已完成:" + completed_);
            if (required_ > completed_) {//未完成
                $(this).next().children()[0].click();//点击'开始学习'
                return false;
            }
            else{
                completed_count += 1;
                if (completed_count >= course_count) {
                    alert_note(2, ["好的", "关闭刷课功能"], "提示", '<p>已刷完全部课程</p><p>感谢使用!</p>', 'public_cont1', function () {
                        $(".public_close").click();
                    },function (){
                        GM_setValue("course", false);GM_setValue("compulsory", false);GM_setValue("back", false);
                        $(".public_close").click();
                        alert("已关闭 [自动进入未完成课程] [自动进入必修课程] [自动返回上一级]");
                    });
                    return false;
                }
            }
        });
    }
}

if (url == "/jjfz/lesson/video" && GM_getValue("compulsory")) {
    if(interval_id!= -1) {
        clearInterval(interval_id);
        interval_id = -1;
    }

    //如果URL最后一位是#则删去
    if (window.location.href.substr(-1) == "#") {
        window.location.href = window.location.href.replace(/\#$/, '');
        return;
    }

    //转到'必修'页面
    if (getUrlParam("required") == null || getUrlParam("required") != '1'){
        UpdateUrlParam("required", 1);
        return;
    }

    let page_count = 1, page_cur = 1, lesson_cur = 0, completed_cur = 0;
    //获取有几页课程 (判断.page_btn是否存在)
    if ($(".page_btn").length != 0) {
        page_count = $(".page_btn").siblings("a").length - 2;//a标签还有page_go和末页
        page_cur = parseInt($(".page_btn").text());
    }

    lesson_cur = $(".lesson1_lists ul:first").children().length;

    //定位到未完成课程 并自动进入
    $(".lesson1_lists ul:first").children().each( function() {
        if ($(this).find(".lesson_pass").length == 0) {//判断是否有"完成"标志 没有则进入
            $(this).children()[0].click();
            return false;
        }
        else {
            completed_cur += 1;
            if (completed_cur >= lesson_cur) {//如果已完成的课程等于列表课程数 则翻页 如果到末页则返回上一级
                if (page_cur >= page_count) {
                    console.log("全部已完成，返回课程中心");
                    if (GM_getValue("back")) $(".head_top_left").find(".head_cut")[0].click();
                }
                else{
                    UpdateUrlParam("page", page_cur + 1);
                    return false;
                }
            }
        }
    });

}

if ((url.indexOf("jjfz/play") != -1) || (url.indexOf("fzdx/play") != -1)) {
    let is_fzdx = (url.indexOf("fzdx/play") != -1);

    getVideoList();//获取视频播放列表

    let nextVideoFlag = false,
        nextClassFlag = false;

    //不加muted谷歌不让自动播放
    setVideoMuted();

    interval_id = setInterval(() => {
        nextVideoFlag = closeAlert();
        nextClassFlag = jumpToVideo(videoLists);
        if (nextVideoFlag) nextClassFlag = nextVideo(videoLists);
        if (nextClassFlag) {
            if (is_fzdx){
                window.location.href = "https://dxpx.uestc.edu.cn/user/lesson"
            }
            else{
                goBack();
            }
        }
    }, 1000)
}

function getVideoList() {
    if ($(".video_lists li").length) {
        //console.log("当前视频" + $(".video_red1").text())
        videoLists = $(".video_lists li");
    }
}

function closeAlert(){
    if($(".video_red1>a").css("color") == "rgb(255, 0, 0)"){
        nextVideo();
    }else if($(".public_cont>.public_text>p").text().indexOf('您需要完整观看一遍课程视频') != -1){
        $(".public_cont>.public_btn>a")[0].click();
    }else if($(".public_cont>.public_text>p").text().indexOf('视频已暂停') != -1){
        $(".public_cont>.public_btn>a")[0].click();
    }else if($(".public_btn>.public_cancel").text().indexOf('继续观看') != -1 ) {
        $(".public_btn>.public_cancel")[0].click();
    }else if($(".public_cont>.public_text>p").text().indexOf('当前视频播放完毕') != -1){
        $(".public_cont>.public_btn>a")[0].click();
    }else if($(".public_cont>.public_text>p").text().indexOf('上次观看') != -1){
        $(".public_cont>.public_btn>a")[1].click();
    }else if($("#wrapper>div>div>button").attr("aria-label") == 'Play'){
        $("#wrapper>div>button").click();
    }
}

//判断是否播放完毕过
function isPlayOverEver() {
    //通过判断Player中是否有进度条来判断是否播放完毕
    if ($(".plyr__progress").length) {
        return true;
    }
    else {
        return false;
    }
}

function nextVideo(){
    let videoCount = $(".video_lists>ul>li").length;
    $(".video_lists>ul>li").each((_,element) => {
        if($(element).children("a").css("color") != "rgb(255, 0, 0)"){//通过文本颜色判断是否播放完毕过 (红色为播放完毕过)
            $(element).children("a")[0].click()
            return false
        }else{
            videoCount--
            if(videoCount == 0) {
                console.log("列表播放完毕，返回课程页");
                clearInterval(interval_id);
                goBack();
            }
        }
    })
}

function jumpToVideo(videoList) {
    if ($(".video_red1").find("a").attr("style") == "width:70%;color:red") {
        let index = $(videoList).index($(".video_red1"));
        if (videoList[index + 1]) {
            $(videoList[index + 1]).children("a").attr('id', 'aRemoveAllTxt');
            document.getElementById("aRemoveAllTxt").click();
        } else {
            return true;
        }
    }
}

function goBack() {
    if (GM_getValue("back")) $('.video_goback')[0].click();
}

//给player加上muted标签
function setVideoMuted() {
    $("#video").prop("muted", true);
}

//通过'百度教育'搜索答案
if ((url == "/jjfz/lesson/exam" || url == "/jjfz/exam_center/end_exam") && GM_getValue("answer")) {
    //↓添加一个搜索答案的浮窗
    //添加样式
    GM_addStyle("body {background: #e9e9e9;font-family: 'Microsoft YaHei','Lantinghei SC','Open Sans',Arial,'Hiragino Sans GB','STHeiti','WenQuanYi Micro Hei','SimSun',sans-serif;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}.bd_answer {background: #ffffff;position:absolute;box-shadow: 3px 3px 2px grey;}.bd_answer header {background: #bd6982;padding: 10px 15px;color: #ffffff;font-size: 14px;cursor: move;}.bd_answer header:before, .bd_answer header:after {display: block;content: '';clear: both;}.bd_answer header h2, .bd_answer .body ul li .content h3 {margin: 0;padding: 0;font-size: 14px;float: left;}.bd_answer header h2 a {color: #ffffff;text-decoration: none;}.bd_answer header .tools {list-style: none;margin: 0;padding: 0;float: right;}.bd_answer header .tools li {display: inline-block;margin-right: 6px;}.bd_answer header .tools li:last-child {margin: 0;}.bd_answer header .tools li a {color: #ffffff;text-decoration: none;-webkit-transition: all 0.3s linear 0s;-moz-transition: all 0.3s linear 0s;-ms-transition: all 0.3s linear 0s;-o-transition: all 0.3s linear 0s;transition: all 0.3s linear 0s;}.bd_answer .body {position: relative;max-height: 360px;overflow-y: scroll;overflow-x: hidden;}.bd_answer .body .search {display: none;width: 100%;}.bd_answer .body .search.opened {display: block;}.bd_answer .body .search input {width: 100%;margin: 0;padding: 10px 15px;border: none;-webkti-box-size: border-box;-moz-box-size: border-box;box-size: border-box;}.bd_answer .body ul {list-style: none;padding: 0;margin: 0;border-top: 1px solid #f2f2f2;}.bd_answer .body ul li {position: relative;background: #ffffff;display: block;width: 100%;padding: 10px;box-sizing: border-box;}.bd_answer .body ul li:before, .bd_answer .body ul li:after {display: block;content: '';clear: both;}.bd_answer .body ul li:hover .thumbnail {background: #bd6982;}.bd_answer .body ul li:nth-child(2n) {background: #f2f2f2;}.bd_answer .body ul li .thumbnail {display: inline-block;background: #bfbfbf;width: 50px;color: #ffffff;line-height: 50px;text-align: center;text-decoration: none;-webkit-transition: background 0.3s linear 0s;-moz-transition: background 0.3s linear 0s;-ms-transition: background 0.3s linear 0s;-o-transition: background 0.3s linear 0s;transition: background 0.3s linear 0s;}.bd_answer .body ul li .thumbnail img {width: 100%;}.bd_answer .body ul li .content {display: inline-block;margin-left: 6px;vertical-align: top;line-height: 1;}.bd_answer .body ul li .content h3 {display: block;width: 100%;margin-bottom: 5px;color: #808080;}.bd_answer .body ul li .content .preview {display: block;width: 100%;max-width: 200px;margin-bottom: 5px;color: #cccccc;font-size: 12px;}.bd_answer .body ul li .content .meta {color: #b3b3b3;font-size: 12px;}.bd_answer .body ul li .content .meta a {color: #999999;text-decoration: none;}.bd_answer .body ul li .content .meta a:hover {text-decoration: underline;}.bd_answer .body ul li .message {display: none;position: absolute;top: 0;left: 0;overflow: hidden;height: 100%;width: 100%;padding: 10px;box-sizing: border-box;}.bd_answer footer a {background: #bd6982;display: block;width: 100%;padding: 10px 15px;color: #ffffff;font-size: 14px;text-align: center;text-decoration: none;box-sizing: border-box;}.bd_answer footer a:hover {background: #cd8ca0;-webkit-transition: background 0.3s linear 0s;-moz-transition: background 0.3s linear 0s;-ms-transition: background 0.3s linear 0s;-o-transition: background 0.3s linear 0s;transition: background 0.3s linear 0s;}.info {width: 300px;margin: 25px auto;text-align: center;}.info h1 {margin: 0;padding: 0;font-size: 20px;font-weight: 400;color: #333333;}.info span {color: #666666;font-size: 12px;}.info span a {color: #000000;text-decoration: none;}.info span .fa {color: #bd6982;}.info span .spoilers {color: #999999;margin-top: 5px;font-size: 10px;}");
    //添加html
    $("body").prepend(`<div class="bd_answer" id="asr1" style="width:auto;inset:107px auto auto 124.82px;height:auto;z-index: 9999999;"><header><h2 id="main_title" class="drag_zone">点击右侧获取答案👉</h2><ul class="tools" style="cursor:pointer"><li><div id="get_answer">◼</div></li><li><div id="clear_asr">🗑︎</div></li><li><div id="search_setting">⚙</div></li></ul></header><div class="body"><div id="search_options" style="display: block;"><input id="search_num" placeholder="搜索数量 默认为3" type="number" min="1" max="10" style="float: left;width:62%;"><label style="font-size: 80%;vertical-align: middle;"><input type="checkbox" id="cb_enhanced" style="vertical-align: middle;"/>Enhanced</label></div><ul id="info_container"><li><a class="thumbnail"style="width: 50px;word-wrap: break-word;word-break: break-all;" href="#">[简答]</a><div class="content"><h3>[题目]</h3><span class="preview">[答案]</span> <span class="meta"><a target="_blank" href="[#]">原网页链接</a></span></div></li></ul></div><footer class="drag_zone"><a style="cursor:move">拖动这里移动窗口</a></footer></div>`);
    //以下为针对新添加浮窗的JS脚本
    var _move=false;//移动标记
    var _x,_y;//鼠标离控件左上角的相对位置
    $(".drag_zone").click(function(){}).mousedown(function(e){
        _move=true;
        _x=e.pageX-parseInt($("#asr1").css("left"));
        _y=e.pageY-parseInt($("#asr1").css("top"));
        $(".bd_answer").fadeTo(20, 0.25);//点击后开始拖动并透明显示
    });
    $(document).mousemove(function(e){
        if(_move){
            var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
            var y=e.pageY-_y;
            $(".bd_answer").css({top:y,left:x});//控件新位置
        }
    }).mouseup(function(){
        _move=false;
        $(".bd_answer").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
    });
    $("#clear_asr").click(function(){//清空答案
        $('#info_container').children().each(function(){$(this).remove()});
        $("#main_title").text('点击右侧获取答案👉');
    });
    $("#search_setting").click(function(){
        if ($("#search_options").attr("style").indexOf("display: none") != -1) {
            $("#search_options").css('display', 'block');
        }
        else {
            $("#search_options").css('display', 'none');
        }
    });
    $("#get_answer").click(function(){
        let s_question = $(".exam_h2").text().substr($(".exam_h2").text().indexOf('.') + 1);//获取问题;
        if ($('#cb_enhanced').is(':checked')){//如果开启了增强模式则连同题目的选项一起搜索
            let s_options = '';
            if ($('.e_cont_title').text().indexOf('单选题') != -1) {
                s_options = $('.answer_list').text().split(/[\t\r\f\n\s]*/g).join('');
            }
            else if ($('.e_cont_title').text().indexOf('多选题') != -1){
                s_options = $('.answer_list_box').text().split(/[\t\r\f\n\s]*/g).join('');
            }
            s_question += s_options;
        }
        //console.log(s_question);
        $('#info_container').children().each(function(){$(this).remove()});//删除之前的元素

        //在浮窗中添加search_bdjy search_rwwz链接
        let template_a = `<li><a class="thumbnail" style="width: 50px;word-wrap: break-word;word-break: break-all;" href="#">[🔎]</a><div class="content"><span class="meta"><a target="_blank" href="[search_bdjy]">🔎: 用百度在'百度教育'中搜索</a></span><br><br><span class="meta"><a target="_blank" href="[search_rwwz]">🔎: 用百度在'瑞文文摘'中搜索</a></span>`;
        let bd_search_url = "https://www.baidu.com/s?ie=utf-8&tn=baidu&wd=";
        template_a = template_a.replace("[search_bdjy]", bd_search_url + encodeURIComponent("site:easylearn.baidu.com" + s_question));
        template_a = template_a.replace("[search_rwwz]", bd_search_url + encodeURIComponent("site:www.rwtext.com" + s_question));
        $('#info_container').append(template_a);

        //拼接请求URL (pageSize代表返回几个搜索结果)
        let search_count = "3",
            search_url = "https://easylearn.baidu.com/edu-web/content/search?query=[question]&type=&page=1&pageSize=[seach_count]&clientType=pc",
            search_result_ids = new Array(),
            basicinfo_url = "https://easylearn.baidu.com/edu-web-go/shiti/basicinfo?id=[entityId]&eqid=&clientType=pc",//通过entityId获取问题答案
            basicinfo_result_iqac = new Map();//{id:[ question, answer, [choice] ], ...} e.g. 1709367078503208905:["邓小平理论同马克思列宁主", "A",  ["A.xxx", B."xxxx"]], ...

        if ($("#search_num").val() != '') search_count = $("#search_num").val();
        search_url = search_url.replace("[seach_count]", search_count);

        //发送搜索题目的GET请求 同步方式
        $("#main_title").text('正在发送搜索问题GET请求...');
        let true_search_url = search_url.replace("[question]", encodeURIComponent(s_question));
        SyncXmlHttpRequest(true_search_url, "GET").then((res) => {
            let search_parse = $.parseJSON(res);
            if (search_parse.errmsg != "success") {
                console.log("[Error] Search GET response Json Not success!");
                return alert("搜索响应结果不是success!");
            }

            if (search_parse.data.list.length <= 0) {
                console.log("[Error] Search GET response Json List Empty!");
                $("#main_title").text('❌搜索为空请点击下方搜索...');
                return ;//alert("搜索响应结果为空!");
            }

            search_parse.data.list.forEach(function (item, index) {//遍历搜索结果的entityId
                if (item.entityId != null) search_result_ids.push(item.entityId);
            });

            if (search_result_ids.length <= 0) {
                console.log("[Error] Search Result Empty!");
                return alert("搜索结果为空!");
            }

            //发送获取答案的GET请求 同步方式
            var promises = search_result_ids.map(function (item) {
                //console.log("[Debug] id: " + item);
                let true_basicinfo_url = basicinfo_url.replace("[entityId]", item);
                return SyncXmlHttpRequest(true_basicinfo_url, "GET").then((res) => {
                    console.log(res);
                    let basicinfo_parse = $.parseJSON(res);
                    if (basicinfo_parse.errmsg != "success") {
                        console.log("[Error] BasicInfo GET response Json Not success!");
                        return alert("获取答案响应结果不是success!");
                    }
                    let array_choice = new Array();//获取选项
                    if (basicinfo_parse.data.choice != null && basicinfo_parse.data.choice.length != 0) {
                        basicinfo_parse.data.choice.forEach(function(item) {
                            array_choice.push(item.desc);
                        })
                    }

                    basicinfo_result_iqac[basicinfo_parse.data.id] = [basicinfo_parse.data.strquestion, basicinfo_parse.data.answer[0].desc, array_choice];

                    //console.log("[Debug] 题目: " + basicinfo_parse.data.strquestion);
                    //console.log("[Debug] 解答: " + basicinfo_parse.data.answer[0].desc);
                }).catch((err) => {
                    console.log("[Error] " + err);
                    return alert(err);
                });
            });
            $("#main_title").text('题目搜索完毕,发送搜索答案GET请求...');
            Promise.all(promises).then(() => {//统一执行
                //添加元素到浮窗
                let template_li = `<li><a class="thumbnail"style="font-size: 25%;  line-height:235%;width: 50px; word-wrap: break-word;word-break: break-all;" href="#">[简答]</a><div class="content"><h3>[题目]</h3><span class="preview">[选项]</span> <span class="meta"><a target="_blank" href="[#]">原网页链接</a></span></div></li>`,
                    org_answer_url = "https://easylearn.baidu.com/edu-page/tiangong/questiondetail?id=[entityId]&from=jySearch";
                $.each(basicinfo_result_iqac, function(key, value){
                    let str_tmp = template_li.replace("[题目]", value[0].substr(0, 20)), str_choice = '';
                    if (value[2].length != 0) {//选项文本
                        value[2].forEach(function(item, index){
                            str_choice += (String.fromCharCode(65+index) + "." + DelMiscContent(item));
                        });
                    }

                    if (value[1].indexOf("<img") != -1) {//答案中有图片
                        let img_ = `<img style="width: auto; height: auto; max-width: 100%; max-height: 60%;"src=` + GetImgSrc(value[1])[0] + "/>";
                        str_tmp = str_tmp.replace("[选项]", str_choice + img_);
                        str_tmp = str_tmp.replace("[简答]", "[图片]");
                    }
                    else {
                        if (str_choice.length != 0){//选项不为空文本
                            str_tmp = str_tmp.replace("[选项]", str_choice);
                        }
                        else{//选项为空则把选项的位置放入答案文本
                            str_tmp = str_tmp.replace("[选项]", DelMiscContent(value[1]));
                        }
                        str_tmp = str_tmp.replace("[简答]", DelMiscContent(value[1]).substr(0, 10));
                    }

                    str_tmp = str_tmp.replace("[#]", org_answer_url.replace("[entityId]", key));

                    $('#info_container').append(str_tmp);
                });
                $("#main_title").text('✔︎全部已完成...');
            });
        }).catch((err) => {
            console.log("[Error] " + err);
            return alert(err);
        });
    });
}

if (GM_getValue("rightmenu")) openCopy();


function openCopy() {
    $(document).ready(new function () {
        document.oncontextmenu = new Function("event.returnValue=true");
        document.onselectstart = new Function("event.returnValue=true");
        document.oncopy = new Function("return true");
    })
}

function video_note() {
    alert_note(2, ["关闭", "不再提示"], "UESTC dxpx脚本使用说明", 
               '<p><font color="aqua"></font>[*] 默认功能全关 需点击油猴图标进行设置</p>' +
               '<p style="color: red;"><font color="aqua"></font>[*] 积极分子开启前三项即可自动刷课</p>' +
               '<p style="color: red;"><font color="aqua"></font>[*] 发展对象只需开启第一项和第三项</p>' +
               '<p><font color="aqua"></font>[+] 新增发展对象刷课功能</p>' +
               '<p>[-] 考试自动搜题功能已失效 之后完善</p>',
               'public_cont1', function () {
        $(".public_close").click(); //此为关闭方法
        GM_setValue("dont_note", false)
    }, function () {
        $(".public_close").click(); //此为关闭方法
        GM_setValue("dont_note", true)
    });
}

function alert_note(btn_num, btn_text, note_text, public_text, public_cont_class, submit_fun, cancel_fun) {
    var public_a;
    if (btn_num == 1) {
        public_a = '<a href="#" class="public_submit">' + btn_text[0] + '</a>';
    } else {
        public_a = '<a href="#" class="public_submit">' + btn_text[0] + '</a> <a href="#" class="public_cancel">' + btn_text[1] + '</a>';
    }
    var public_html = '<div class="public_mask"></div><div class="public_cont ' + public_cont_class + '"><div class="public_title"><h3>' + note_text + '</h3><div class="public_close"></div></div><div class="public_text">' + public_text + '</div><div class="public_btn">' + public_a + '</div></div>';
    $("body").append(public_html);
    $(".public_close").click(function () {
        $(".public_mask").remove();
        $(".public_cont").remove();
    });
    $(".public_mask").click(function () {
        $(".public_mask").remove();
        $(".public_cont").remove();
    });
    if (btn_num == 1) {
        $(".public_submit").click(function () {
            submit_fun();
        })
    } else {
        $(".public_submit").click(function () {
            submit_fun();
        });
        $(".public_cancel").click(function () {
            cancel_fun();
        })
    }
}

// 获取url中参数的值
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return (r[2]); return null;
}

// 添加 修改 url中参数的值
function UpdateUrlParam(name, val) {
    let thisURL = document.location.href;

    // 如果 url中包含这个参数 则修改
    if (thisURL.indexOf(name+'=') > 0) {
        let v = getUrlParam(name);
        if (v != null) {// 是否包含参数
            thisURL = thisURL.replace(name + '=' + v, name + '=' + val);
        }
        else {
            thisURL = thisURL.replace(name + '=', name + '=' + val);
        }
    }
    else {// 不包含这个参数 则添加
        if (thisURL.indexOf("?") > 0) {
            thisURL = thisURL + "&" + name + "=" + val;
        }
        else {
            thisURL = thisURL + "?" + name + "=" + val;
        }
    }

    if (thisURL != document.location.href) document.location.href = thisURL;
};

//注册油猴提示菜单
function RegisterTipMenu(id, menu_text, tip_text) {
    let id_menu = GM_registerMenuCommand (menu_text, function(){
        if (GM_getValue(id)) {
            GM_setValue(id, false);
            alert_note(1, ["关闭"], "提示", '<p>已关闭 ' + tip_text, 'public_cont1', function () {
                $(".public_close").click();
            });
        }
        else {
            GM_setValue(id, true);
            alert_note(1, ["关闭"], "提示", '<p>已开启 ' + tip_text, 'public_cont1', function () {
                $(".public_close").click();
            });
        }
    });
}

//以同步方式发送跨域请求
function SyncXmlHttpRequest(request_url, method_type) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: method_type,
            url: request_url,
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6"
            },
            onload: function(response) {
                if (response.status != 200){
                    return reject("Search GET response Not 200 OK!");
                }
                //console.log("[Debug] " + response.responseText);
                return resolve(response.responseText);
            },
            onerror: function(err) {
                return reject(err);
            }
        });
    });
}

//纯字符串操作的方式 删去答案和选项中html标签中的杂项
function DelMiscContent(val){
    let start = -1, end = -1, pos = -1, ele = "div";
    while((pos = val.indexOf('text-indent')) != -1){
        start = val.lastIndexOf('<', pos);
        ele = val.substring(start + 1, val.indexOf(" ", start));
        if (val.indexOf("/>", pos) != -1){
            end = val.indexOf("/>", pos) + 2;
        }
        else{
            end = val.indexOf("</" + ele, pos) + 6;
        }
        val = val.substring(0, start) + val.substr(end);
    }
    return GetPlainText(val);
}

//去除文本中的html标签
function GetPlainText(val) {
    if (val != null && val != "") {
        var re1 = new RegExp("<.+?>|&.+?;","g"); //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
        var msg = val.replace(re1,""); //执行替换成空字符
        msg = msg.replace(/\s/g,""); //去掉所有的空格（中文空格、英文空格都会被替换）
        msg = msg.replace(/[\r\n]/g,""); //去掉所有的换行符
        return msg;
    } else return ''
}

//获取<img>中的src的值
function GetImgSrc(article) {
    let reg = /(< img|<img).*?(?:>|\/>)/gim //匹配所有图片标签
    let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
    return article.match(reg).map(val => {
        let src = val.match(srcReg)
        return src[1]
    });
}
