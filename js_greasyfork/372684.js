// ==UserScript==
// @name              中国大学 MOOC 下载助手（需配合Aria2使用）
// @name:en           Icourse163 Downloader
// @namespace         http://mofiter.com/
// @version           0.3
// @description       在中国大学 MOOC 的课程学习页面添加批量下载按钮，方便将视频下载到本地学习
// @description:en    add download button on icourse163.org to download videos
// @author            mofiter
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match             *://www.icourse163.org/learn/*
// @grant             unsafeWindow
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @grant             GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/372684/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%20MOOC%20%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BC%88%E9%9C%80%E9%85%8D%E5%90%88Aria2%E4%BD%BF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/372684/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%20MOOC%20%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BC%88%E9%9C%80%E9%85%8D%E5%90%88Aria2%E4%BD%BF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var log_count = 1;
    var hasOpenAriac2Tab = false;
    var video_quality = 2; //视频清晰度
    var video_format = 'mp4'; //视频格式
    var aria2_url = "http://127.0.0.1:6800/jsonrpc"; //Aria2 地址
    var course_save_path = '/Users/mofiter/Downloads/icourse163'; //课程保存路径
    var video_save_path; //每个视频保存路径
    var video_download_url = ""; //视频下载地址
    var course_info = {'course_id': {},'course_name': {},'chapter_info': []}; //课程信息
    var cookies = document.cookie;
    var sessionId = cookies.match(/NTESSTUDYSI=(\w+)/)[1];

    //自定义 log 函数
    function mylog(param1,param2){
        param1 = param1 ? param1 : "";
        param2 = param2 ? param2 : "";
        console.log("#" + log_count++ + "-Icourse163Downloader-log:",param1,param2);
    }

    setTimeout(function(){
        getCourseIdAndName();
        getCourseContentInfo();
        loadSetting();
        addDownloadAssistant();
        mylog("中国大学 MOOC 下载助手加载完成~");
    },2000); //页面加载完成后延时2秒执行

    //获取课程名称
    function getCourseIdAndName(){
        var courseCardDto = unsafeWindow.courseCardDto;
        course_info.course_name = courseCardDto.name.replace(/\/|:|\?|\*|"|<|>|\|/g," ");
        if(location.href.match(/tid=(\d+)/)[1]){
            course_info.course_id = location.href.match(/tid=(\d+)/)[1];
        }else{
            course_info.course_id = courseCardDto.currentTermId;
        }
    }

    //添加批量下载和下载设置按钮
    function addDownloadAssistant(){
        var batch_download_li = $("<li class='u-greentab'></li>");
        var batch_download = $("<a>批量下载</a>");
        batch_download_li.append(batch_download);
        var assistant_setting_li = $("<li class='u-greentab'></li>");
        var assistant_setting = $("<a>下载设置</a>");
        assistant_setting_li.append(assistant_setting);
        $('#j-courseTabList').append(batch_download_li).append(assistant_setting_li);
        batch_download_li.click(function(){
            loadSetting();
            if(course_save_path==""){
                alert("请点击下载设置去填写文件保存位置");
            }else if(aria2_url==""){
                alert("请点击下载设置去填写 Aria2 地址");
            }else{
                batchDownload();
            }
        });
        assistant_setting_li.click(function(){
            showSetting();
        });
    }

    //加载个人设置
    function loadSetting(){
        video_quality = GM_getValue('video_quality', 2);
        video_format = GM_getValue('video_format','mp4');
        aria2_url = GM_getValue('aria2_url','http://127.0.0.1:6800/jsonrpc');
        course_save_path = GM_getValue('course_save_path','');
    }

    //打开设置
    function showSetting(){
        if(document.querySelector('#dl-setting') == null){
            var container = document.createElement("div");
            container.id = "dl-setting";
            container.style = "position:fixed;z-index:999999;bottom:10%;right:40px;width:220px;height:auto;background-color:#f8f8f8;padding:5px 10px;font-size:14px;border:1px solid #ccc;";
            container.innerHTML =
            "<div style='line-height:25px;'>" +
            "<legend style='text-align:center;font-size:16px;'>下载设置</legend>" +
            "<ul>" +
            "<li>Aria2 地址：</li>" +
            "<li><input type='text' id='aria2_url' name='aria2_url' value='" + aria2_url + "' style='width:100%;background:#ffffff;'></input></li>" +
            "<li>文件保存位置：</li>\n" +
            "<li><input type='text' id='save_path' name='save_path' value='" + course_save_path + "' style='width:100%;background:#ffffff;'></input></li>" +
            "<li>清晰度：<label title='高清'><input id='video-quality-2' name='video-quality' value='2' type='radio' style='margin:0 5px;'" + (video_quality==2 ? "checked":"") + "></input>高清</label>\n" +
            "<label title='标清' style='padding:0 5px;'><input id='video-quality-1' name='video-quality' value='1' type='radio' style='margin:0 5px;'" + (video_quality==1 ? "checked":"") + "></input>标清</label></li>\n" +
            "<li>格式：<label title='mp4' style='padding:0 0 0 14px;'><input id='video-format-mp4' name='video-format' value='mp4' type='radio' style='margin:0 5px;'" + (video_format=='mp4' ? "checked":"") + "></input>mp4</label>" +
            "<label title='flv' style='padding:0 5px;'><input id='video-format-flv' name='video-format' value='flv' type='radio' style='margin:0 5px 0 10px;'" + (video_format=='flv' ? "checked":"") + "></input>flv</label></li>" +
            "</ul>\n" +
            "<input type='button' value='取消' id='cancel_button' style='position:relative;float:left;border:1px solid #ccc;padding:0 2px;background:#ffffff;'></input>\n" +
            "<input type='button' value='保存' id='save_button' style='position:relative;float:right;border:1px solid #ccc;padding:0 2px;background:#ffffff;'></input>\n" +
            "</div>";
            document.body.appendChild(container);
        }else{
            loadSetting();
            if(video_quality==2){
                $('#video-quality-2').prop('checked',true);
            }else{
                $('#video-quality-1').prop('checked',true);
            }
            if(video_format=='mp4'){
                $('#video-format-mp4').prop('checked',true);
            }else{
                $('#video-format-flv').prop('checked',true);
            }
            $('#aria2_url').value = aria2_url;
            $('#save_path').value = course_save_path;
            $('#dl-setting').show();
        }
        $('#save_button').click(function(){
            GM_setValue('video_quality',$('input[name="video-quality"]:checked').val());
            GM_setValue('video_format',$('input[name="video-format"]:checked').val());
            GM_setValue('aria2_url',$('input[name="aria2_url"]').val());
            GM_setValue('course_save_path',$('input[name="save_path"]').val());
            $('#dl-setting').hide();
        });
        $('#cancel_button').click(function(){
            $('#dl-setting').hide();
        });
    }

    //获取课程信息
    function getCourseContentInfo(){
        var timestamp = new Date().getTime();
        var params = {
            "callCount":"1",
            "scriptSessionId":"${scriptSessionId}190",
            "httpSessionId":sessionId,
            "c0-scriptName":"CourseBean",
            "c0-methodName":"getLastLearnedMocTermDto",
            "c0-id":"0",
            "c0-param0":"number:" + course_info.course_id,
            "batchId":timestamp
        };
        $.ajax({
            url:'https://www.icourse163.org/dwr/call/plaincall/CourseBean.getLastLearnedMocTermDto.dwr',
            method:'POST',
            async: true,
            data: params,
            success: function (response){
                var chapter1 = response.match(/chapters=(.*?);/)[1]; //保存全部章节的变量
                var reg1 = new RegExp(chapter1 + '\\[\\d+]=(.*?);','g');
                var chapter2 = response.match(reg1); //保存各章节的变量
                chapter2.forEach(function(value){
                    var chapter3 = value.match(/=(.*?);/)[1]; //保存各章节的变量名字
                    var reg2 = new RegExp(chapter3 + '.id=(.*?);' + chapter3 + '.lessons=(.*?);' + chapter3 + '.name="(.*?)";');
                    var chapter4 = response.match(reg2); //保存章节 id，lessons，name 的变量
                    var reg3 = new RegExp(chapter4[2] + '\\[\\d+]=(.*?);','g');
                    var lessons = response.match(reg3); //保存各小节的变量
                    var chapter = {'chapter_id':chapter4[1],'chapter_name':unescape(chapter4[3].replace(/\\u/gi, '%u').replace(/\/|:|\?|\*|"|<|>|\|/g," ")),'lesson_info':[]};
                    lessons.forEach(function(value){
                        var lesson1 = value.match(/=(.*?);/)[1]; //保存各小节的变量名字
                        var reg4 = new RegExp(lesson1 + '.chapterId=(.*?);.*?' + lesson1 + '.id=(.*?);.*?' + lesson1 + '.name="(.*?)";.*?' + lesson1 + '.units=(.*?);');
                        var lesson2 = response.match(reg4);
                        var reg5 = new RegExp(lesson2[4] + '\\[\\d+]=(.*?);','g');
                        var sections = response.match(reg5);
                        var lesson = {'chapter_id':lesson2[1],'lesson_id':lesson2[2],'lesson_name':unescape(lesson2[3].replace(/\\u/gi, '%u').replace(/\/|:|\?|\*|"|<|>|\|/g," ")),'section_info':[]};
                        sections.forEach(function(value){
                            var section1 = value.match(/=(.*?);/)[1];
                            var reg6 = new RegExp(section1 + '.chapterId=(.*?);.*?' + section1 + '.contentId=(.*?);.*?' + section1 + '.contentType=(.*?);.*?' + section1 + '.id=(.*?);.*?' + section1 + '.lessonId=(.*?);.*?' + section1 + '.name="(.*?)";.*?');
                            var section2 = response.match(reg6);
                            var section = {'chapter_id':section2[1],'lesson_id':section2[5],'content_id':section2[2],'section_id':section2[4],'section_name':unescape(section2[6].replace(/\\u/gi, '%u').replace(/\/|:|\?|\*|"|<|>|\|/g," ")),'content_type':section2[3]};
                            lesson.section_info.push(section);
                        });
                        chapter.lesson_info.push(lesson);
                    });
                    course_info.chapter_info.push(chapter);
                });
                mylog(course_info);
            }
        });
    }

    //批量下载
    function batchDownload(){
        course_info.chapter_info.forEach(function(chapter,index_chapter){
            chapter.lesson_info.forEach(function(lesson,index_lesson){
                lesson.section_info.forEach(function(section,index_section){
                    var file_name = '第' + (index_section + 1) + '部分_' + section.section_name;
                    var save_path = course_save_path.replace(/\\/g,'\/') + '/' + course_info.course_name + '/第' + (index_chapter + 1) + '章_' + chapter.chapter_name + '/第' + (index_lesson + 1) + '节_' + lesson.lesson_name;
                    if(section.content_type == '1'){
                        getVideoToken(section.content_id,file_name,save_path);
                    } else if(section.content_type == '3'){
                        getCourseContentUrl(section.content_id,section.section_id,file_name,save_path);
                    }
                });
            });
        });
    }

    //获取文档下载地址
    function getCourseContentUrl(content_id,section_id,file_name,save_path){
        var timestamp = new Date().getTime();
        var params = {
            "callCount":"1",
            "scriptSessionId":"${scriptSessionId}190",
            "httpSessionId":sessionId,
            "c0-scriptName":"CourseBean",
            "c0-methodName":"getLessonUnitLearnVo",
            "c0-id":"0",
            "c0-param0":"number:" + content_id,
            "c0-param1":"number:3",
            "c0-param2":"number:0",
            "c0-param3":"number:" + section_id,
            "batchId":timestamp
        };
        $.ajax({
            url:'https://www.icourse163.org/dwr/call/plaincall/CourseBean.getLessonUnitLearnVo.dwr',
            method:'POST',
            async: true,
            data: params,
            success: function (response){
                var pdfUrl = response.match(/textOrigUrl:"(.*?)",/)[1];
                //mylog(pdfUrl);
                sendDownloadTaskToAria2(pdfUrl,file_name + ".pdf",save_path);
            }
        });
    }

    //获取视频信息
    function getVideoToken(content_id,file_name,save_path){
        var params = {
            'videoId':content_id,
            'targetId':course_info.course_id,
            'targetType':'0'
        };
        $.ajax({
            url:'https://www.icourse163.org/web/j/resourceRpcBean.getVideoToken.rpc?csrfKey=' + sessionId,
            method:'POST',
            async: true,
            data: params,
            success: function (response){
                var signature = response.result.signature;
                getVideoUrl(content_id,signature,file_name,save_path);
            }
        });
    }

    //获取视频下载地址
    function getVideoUrl(content_id,signature,file_name,save_path){
        var params = {
            'videoId':content_id,
            'signature':signature,
            'clientType':'1'
        };
        $.ajax({
            url:'https://vod.study.163.com/eds/api/v1/vod/video',
            method:'POST',
            async: true,
            data: params,
            success: function (response){
                var videoUrls = response.result.videos;
                var video_url_list = [];
                videoUrls.forEach(function(video){
                    if(video.format == video_format) {
                        video_url_list.push({'video_format': video.format,'video_quality': video.quality,'video_url': video.videoUrl});
                    }
                });
                if(video_url_list.length != 0){
                    if(video_quality=="2"){
                        video_download_url = video_url_list[video_url_list.length-1].video_url;
                    }else{
                        video_download_url = video_url_list[0].video_url;
                    }
                }
                if(video_download_url != ""){
                    //mylog(video_download_url);
                    sendDownloadTaskToAria2(video_download_url,file_name + '.' + video_format,save_path);
                }
            }
        });
    }

    // 将下载链接发送到 Aria2 下载
    function sendDownloadTaskToAria2(download_url,file_name,save_path){
        var json_rpc = {
            id:'',
            jsonrpc:'2.0',
            method:'aria2.addUri',
            params:[
                [download_url],
                {
                    dir:save_path,
                    out:file_name
                }
            ]
        };
        GM_xmlhttpRequest({
            url:aria2_url,
            method:'POST',
            data:JSON.stringify(json_rpc),
            onerror:function(response){
                mylog(response);
            },
            onload:function(response){
                mylog(response);
                if (!hasOpenAriac2Tab){
                    GM_openInTab('http://aria2c.com/',{active:true});
                    hasOpenAriac2Tab = true;
                }
            }
        });
    }

})();