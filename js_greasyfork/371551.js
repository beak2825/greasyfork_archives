// ==UserScript==
// @name              网易云课堂下载助手（需配合Aria2使用）
// @name:en           Study163 Downloader
// @namespace         http://mofiter.com/
// @version           0.7
// @description       在网易云课堂的课程目录页面添加下载助手按钮（可批量下载和单个视频下载），方便将视频下载到本地学习
// @description:en    add download button on study.163.com to download videos
// @author            mofiter
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match             *://study.163.com/course/courseMain.htm?courseId=*
// @grant             unsafeWindow
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @grant             GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/371551/%E7%BD%91%E6%98%93%E4%BA%91%E8%AF%BE%E5%A0%82%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BC%88%E9%9C%80%E9%85%8D%E5%90%88Aria2%E4%BD%BF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/371551/%E7%BD%91%E6%98%93%E4%BA%91%E8%AF%BE%E5%A0%82%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BC%88%E9%9C%80%E9%85%8D%E5%90%88Aria2%E4%BD%BF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.$;
    var log_count = 1;
    var hasOpenAriac2Tab = false;
    var video_quality = 2; //视频清晰度
    var video_format = 'mp4'; //视频格式
    var video_file_name; //视频文件名称
    var aria2_url = "http://127.0.0.1:6800/jsonrpc"; //Aria2 地址
    var course_save_path = '/Users/mofiter/Downloads/study163'; //课程保存路径
    var video_save_path; //每个视频保存路径
    var video_download_url = ""; //视频下载地址
    var course_info = {'course_id': {},'course_name': {},'chapter_info': [],'course_price': {},'course_duration': {}}; //课程信息
    var cookies = document.cookie;
    var match_cookie = cookies.match(/NTESSTUDYSI=(\w+)/)[1];

    //自定义 log 函数
    function mylog(param1,param2){
        param1 = param1 ? param1 : "";
        param2 = param2 ? param2 : "";
        console.log("#" + log_count++ + "-Study163Downloader-log:",param1,param2);
    }

    setTimeout(function(){
        if(!getCourseInfo()){
            return;
        }
        loadSetting();
        addDownloadAssistant();
        addDownloadButton();
        mylog("网易云课堂下载助手加载完成~");
    },5000); //页面加载完成后延时5秒执行

    //加载个人设置
    function loadSetting(){
        video_quality = GM_getValue('video_quality', 2);
        video_format = GM_getValue('video_format','mp4');
        aria2_url = GM_getValue('aria2_url','http://127.0.0.1:6800/jsonrpc');
        course_save_path = GM_getValue('course_save_path','');
    }

    //添加下载助手按钮
    function addDownloadAssistant(){
        $(".u-navsearchUI").css("width","224px");
        var download_assistant_div = $("<div class='m-nav_item' style='margin-left:24px;'></div>");
        var download_assistant = $("<span>下载助手</span>");
        var assistant_div = $("<div class='f-pa' style='line-height:40px;display:none;left:0px;top:60px;width:auto;height:auto;background-color:#fff;color:#666;border:1px solid #ddd;padding:0 10px;text-align:center;'><div class='arrr f-pa' style='background:url(//s.stu.126.net/res/images/ui/ui_new_yktnav_sprite.png) 9999px 9999px no-repeat;top:-9px;left:40px;width:14px;height:9px;background-position:-187px 0;'></div></div>");
        var batch_download = $("<a style='width:50%;float:left;'>批量下载</a>");
        var assistant_setting = $("<a style='width:50%;float:right;'>设置</a>");
        var recommendation = $("<img width='300px' src='https://qcloud.coding.net/u/mofiter/p/public_files/git/raw/master/recommendation.png'>");
        assistant_div.append(batch_download).append(assistant_setting).append(recommendation);
        download_assistant_div.append(download_assistant).append(assistant_div);
        $('.m-nav').append(download_assistant_div);
        download_assistant_div.mouseover(function(){
            assistant_div.show();
        });
        download_assistant_div.mouseout(function(){
            assistant_div.hide();
        });
        batch_download.click(function(){
            assistant_div.hide();
            loadSetting();
            if(course_save_path==""){
                alert("请到下载助手的设置里面填写文件保存位置");
            }else if(aria2_url==""){
                alert("请到下载助手的设置里面填写 Aria2 地址");
            }else{
                batchDownload();
            }
        });
        assistant_setting.click(function(){
            assistant_div.hide();
            showSetting();
        });
    }

    //打开设置
    function showSetting(){
        if(document.querySelector('#dl-setting') == null){
            var container = document.createElement("div");
            container.id = "dl-setting";
            container.style = "position:fixed;z-index:999999;top:30%;left:45%;width:auto;height:auto;background-color:#eee;padding:5px 10px;font-size:14px;border:1px solid;";
            container.innerHTML =
            "<div style='line-height:25px;'>" +
            "<legend style='text-align:center;'>下载助手设置</legend>" +
            "<ul>" +
            "<li>Aria2 地址：</li>" +
            "<li><input type='text' id='aria2_url' name='aria2_url' value='" + aria2_url + "' style='width:100%'></input></li>" +
            "<li>文件保存位置：</li>\n" +
            "<li><input type='text' id='save_path' name='save_path' value='" + course_save_path + "' style='width:100%'></input></li>" +
            "<li>清晰度：<label title='高清'><input id='video-quality-2' name='video-quality' value='2' type='radio' style='margin:0 5px;'" + (video_quality==2 ? "checked":"") + "></input>高清</label>\n" +
            "<label title='标清' style='padding:0 5px;'><input id='video-quality-1' name='video-quality' value='1' type='radio' style='margin:0 5px;'" + (video_quality==1 ? "checked":"") + "></input>标清</label></li>\n" +
            "<li>格式：<label title='mp4' style='padding:0 0 0 14px;'><input id='video-format-mp4' name='video-format' value='mp4' type='radio' style='margin:0 5px;'" + (video_format=='mp4' ? "checked":"") + "></input>mp4</label>" +
            "<label title='flv' style='padding:0 5px;'><input id='video-format-flv' name='video-format' value='flv' type='radio' style='margin:0 5px 0 10px;'" + (video_format=='flv' ? "checked":"") + "></input>flv</label></li>" +
            "</ul>\n" +
            "<input type='button' value='取消' id='cancel_button' style='position:relative;float:left;border:1px solid #ccc;padding:0 2px;'></input>\n" +
            "<input type='button' value='保存' id='save_button' style='position:relative;float:right;border:1px solid #ccc;padding:0 2px;'></input>\n" +
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
    function getCourseInfo(){
        var courseVo = unsafeWindow.courseVo;
        mylog(courseVo);
        course_info.course_id = courseVo.id; //课程 id
        course_info.course_name = courseVo.name.replace(/:|\?|\*|"|<|>|\|/g," "); //课程名称
        course_info.course_price = courseVo.price; //课程价格
        var chapter = courseVo.chapterDtos; //课程章节
        var allSeconds = 0; //课程总时长，单位为秒
        chapter.forEach(function(val,index){
            var chapter = {'chapter_id': val.id,'chapter_name': val.name.replace(/:|\?|\*|"|<|>|\|/g," "),'lesson_info': []}; //章节信息
            var lessonDtos = val.lessonDtos;
            lessonDtos.forEach(function(val,index){
                var lesson = {'keshi':val.ksstr,'lesson_id':val.id,'lesson_name':val.lessonName.replace(/:|\?|\*|"|<|>|\|/g," "),'lesson_type':val.lessonType}; //课时信息
                if(val.videoTime){
                    var videoTime = val.videoTime.split(':');
                    if(videoTime.length == 3){
                        allSeconds += parseInt(videoTime[0]) * 3600 + parseInt(videoTime[1]) * 60 + parseInt(videoTime[2]);
                    }else if(videoTime.length == 2){
                        allSeconds += parseInt(videoTime[0]) * 60 + parseInt(videoTime[1]);
                    }else if(videoTime.length == 1){
                        allSeconds += parseInt(videoTime[0]);
                    }
                }
                chapter.lesson_info.push(lesson);
            });
            course_info.chapter_info.push(chapter);
        });
        var formatTime = {'hour':0,'minute':0,'second':0};
        formatTime.hour = parseInt(allSeconds/3600);
        formatTime.minute = parseInt(allSeconds%3600/60);
        formatTime.second = parseInt(allSeconds%3600%60);
        if(formatTime.hour){
            course_info.course_duration = formatTime.hour + "小时" + formatTime.minute + "分" + formatTime.second + "秒";
        }else if(formatTime.minute){
            course_info.course_duration = formatTime.minute + "分" + formatTime.second + "秒";
        }else if(formatTime.second){
            course_info.course_duration = formatTime.second + "秒";
        }
        mylog(course_info);
        if(course_info.course_price > 0){
            return false;
        }else{
            return true;
        }
    }

    //批量下载
    function batchDownload(){
        course_info.chapter_info.forEach(function(chapter,index){
            chapter.lesson_info.forEach(function(lesson){
                var file_name = lesson.keshi + '_' + lesson.lesson_name;
                var save_path = course_save_path.replace(/\\/g,'\/') + '/' + course_info.course_name + '/章节' + (index + 1) + '_' + chapter.chapter_name;
                if(lesson.lesson_type=="3"){
                    getTextLearnInfo(lesson,file_name,save_path);
                }else{
                    getVideoLearnInfo(lesson,file_name,save_path);
                }
            });
        });
    }

    // 添加下载按钮
    function addDownloadButton(){
        var ksbtn = document.getElementsByClassName('ksbtn')[0];
        var ksbtn_style = 'display:' + getStyle(ksbtn,'display') + ';width:' + getStyle(ksbtn,'width') + ';background-position:' + getStyle(ksbtn,'background-position') + ';margin-top:' + getStyle(ksbtn,'margin-top') + ';';
        var ksbtn_span = ksbtn.firstChild;
        var ksbtn_span_style = 'display:' + getStyle(ksbtn_span,'display') + ';text-align:' + getStyle(ksbtn_span,'text-align') + ';background:' + getStyle(ksbtn_span,'background') +
                         ';width:' + getStyle(ksbtn_span,'width') + ';font-size:' + getStyle(ksbtn_span,'font-size') + ';height:' + getStyle(ksbtn_span,'height') + ';line-height:' +
                         getStyle(ksbtn_span,'line-height') + ';color:' + getStyle(ksbtn_span,'color') + ';background-position:' + getStyle(ksbtn_span,'background-position') + ';';
        var allNodes = document.getElementsByClassName("section");
        for (var i = 0;i < allNodes.length;i ++) {
            var download_button = document.createElement("a");
            var style = 'display:block;text-align:center;padding-left:10px;width:58px;font-size:12px;height:34px;line-height:33px;color:#fff;background-position:-40px 0px;';
            download_button.innerHTML = "<span>下载</span>";
            download_button.className = "f-fr j-hovershow download-button";
            download_button.style = ksbtn_style;
            download_button.lastChild.style = ksbtn_span_style;
            allNodes[i].appendChild(download_button);
        }
        $('.download-button').each(function(){ //下载按钮点击事件
            $(this).click(function(event){
                loadSetting();
                if(course_save_path==""){
                    alert("请到下载助手的设置里面填写文件保存位置");
                }else if(aria2_url==""){
                    alert("请到下载助手的设置里面填写 Aria2 地址");
                }else{
                    var data_chapter = event.target.parentNode.parentNode.getAttribute("data-chapter");
                    var data_lesson = event.target.parentNode.parentNode.getAttribute("data-lesson");
                    var index = Number(data_lesson);
                    for(var i = 0;i < Number(data_chapter); i ++){
                        index = index - course_info.chapter_info[i].lesson_info.length;
                    }
                    var lesson = course_info.chapter_info[data_chapter].lesson_info[index];
                    mylog("选择的课为【lesson_name: " + lesson.lesson_name + ",lesson_id: " + lesson.lesson_id + ",lesson_type: " + lesson.lesson_type + '】');
                    var file_name = lesson.keshi + '_' + lesson.lesson_name;
                    var save_path = course_save_path.replace(/\\/g,'\/') + '/' + course_info.course_name + '/章节' + (Number(data_chapter) + 1) + '_' + course_info.chapter_info[data_chapter].chapter_name;
                    if(lesson.lesson_type=="3"){
                        getTextLearnInfo(lesson,file_name,save_path);
                    }else{
                        getVideoLearnInfo(lesson,file_name,save_path);
                    }
                }
                event.stopPropagation();
            });
        });
    }

    //获取文档下载地址
    function getTextLearnInfo(lesson,file_name,save_path){
        var timestamp = new Date().getTime();
        var params = {
            "callCount":"1",
            "scriptSessionId":"${scriptSessionId}190",
            "httpSessionId":match_cookie,
            "c0-scriptName":"LessonLearnBean",
            "c0-methodName":"getTextLearnInfo",
            "c0-id":"0",
            "c0-param0":"string:" + lesson.lesson_id,
            "c0-param1":"string:" + course_info.course_id,
            "batchId":timestamp
        };
        var url = "https://study.163.com/dwr/call/plaincall/LessonLearnBean.getTextLearnInfo.dwr?" + timestamp;
        $.ajax({
            url:url,
            method:'POST',
            async: true,
            data: params,
            success: function (response){
                var pdfUrl = response.match(/pdfUrl:"(.*?)"/)[1];
                sendDownloadTaskToAria2(pdfUrl,file_name + ".pdf",save_path);
            }
        });
    }

    //获取视频文件信息
    function getVideoLearnInfo(lesson,file_name,save_path){
        var timestamp = new Date().getTime();
        var params = {
            "callCount":"1",
            "scriptSessionId":"${scriptSessionId}190",
            "httpSessionId":match_cookie,
            "c0-scriptName":"LessonLearnBean",
            "c0-methodName":"getVideoLearnInfo",
            "c0-id":"0",
            "c0-param0":"string:" + lesson.lesson_id,
            "c0-param1":"string:" + course_info.course_id,
            "batchId":timestamp
        };
        var url = "https://study.163.com/dwr/call/plaincall/LessonLearnBean.getVideoLearnInfo.dwr?" + timestamp;
        $.ajax({
            url:url,
            method:'POST',
            async: true,
            data: params,
            success: function (response){
                var signature = response.match(/signature="(\w+?)";/)[1];
                var videoId = response.match(/videoId=(\w+?);/)[1];
                getVideoUrl(videoId,signature,file_name,save_path);
            }
        });
    }

    //获取视频下载地址
    function getVideoUrl(videoId,signature,file_name,save_path){
        var params = {
            'videoId':videoId,
            'signature':signature,
            'clientType':'1'
        };
        $.ajax({
            url:"https://vod.study.163.com/eds/api/v1/vod/video",
            method:'POST',
            async:true,
            data:params,
            success:function(response){
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

    //获取元素样式
    function getStyle(element,cssPropertyName){
        if(window.getComputedStyle){ //如果支持getComputedStyle属性（IE9及以上，ie9以下不兼容）
            return window.getComputedStyle(element)[cssPropertyName];
        } else { //如果支持currentStyle（IE9以下使用），返回
            return element.currentStyle[cssPropertyName];
        }
    }

})();