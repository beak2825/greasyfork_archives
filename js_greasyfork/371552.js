// ==UserScript==
// @name              Udemy下载助手（需配合Aria2使用）
// @name:en           Udemy Downloader
// @namespace         http://mofiter.com/
// @version           0.3
// @description       在 Udemy 上课程的课程内容页面添加下载按钮（可批量下载和单个视频下载），方便将视频下载到本地学习
// @description:en    add button on udemy's course content to download videos
// @author            mofiter
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match             *://www.udemy.com/*/learn/v4/content
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @grant             GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/371552/Udemy%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BC%88%E9%9C%80%E9%85%8D%E5%90%88Aria2%E4%BD%BF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/371552/Udemy%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BC%88%E9%9C%80%E9%85%8D%E5%90%88Aria2%E4%BD%BF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var log_count = 1;
    var hasOpenAriac2Tab = false;
    var video_quality = "720"; //视频清晰度
    var aria2_url = "http://127.0.0.1:6800/jsonrpc"; //Aria2 地址
    var course_save_path = '/Users/mofiter/Downloads/study163'; //课程保存路径
    var mycourses_url = "https://www.udemy.com/api-2.0/users/me/subscribed-courses"; //已购所有课程的地址
    var curricuclum_url = "https://www.udemy.com/api-2.0/courses/{0}/cached-subscriber-curriculum-items/?page_size=9999"; //当前课程的地址
    var lesson_url = "https://www.udemy.com/api-2.0/assets/{0}?fields[asset]=@min,status,delayed_asset_message,time_estimation,stream_urls,captions,body&fields[caption]=@default,is_translation"; //一节课的地址
    var cookies = document.cookie;
    var match_cookie = cookies.match(/access_token=(\w+?);/);
    var authorization = "Bearer " + match_cookie[1];
    var mycourses_info;
    var current_course_url = location.pathname;
    var current_course_info = {'course_id':{},'course_name':{},'chapter_info':[]};
    var isExpand = false; //下载助手是否展开

    //自定义 log 函数
    function mylog(param1,param2){
        param1 = param1 ? param1 : "";
        param2 = param2 ? param2 : "";
        console.log("#" + log_count++ + "-UdemyDownloader-log:",param1,param2);
    }

    //javascript 字符串使用占位符轻松拼接
    String.prototype.format = function() {
        if(arguments.length == 0) return this;
        var param = arguments[0];
        var s = this;
        if(typeof(param) == 'object') {
            for(var key in param)
            {s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);}
            return s;
        } else {
            for(var i = 0; i < arguments.length; i++)
            {s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);}
            return s;
        }
    }

    setTimeout(function(){
        getCourseInfo();
        loadSetting();
        addDownloadAssistant();
        addDownloadButton();
        mylog("Udemy 下载助手加载完成 ~");
    },5000); //页面加载完成后延时5秒执行

    //获取视频信息
    function getCourseInfo(){
        $.ajax({
            url:mycourses_url,
            async:false,
            method:'GET',
            beforeSend:function(xhr){
                xhr.setRequestHeader('authorization',authorization);
            },
            success:function(response){
                mycourses_info = response.results;
            }
        });
        $.each(mycourses_info,function(index,element){
            if (current_course_url.indexOf(element.url) > -1) {
                current_course_info.course_id = element.id;
                current_course_info.course_name = element.title.replace(/:|\?|\*|"|<|>|\|/g," ");
                return false;
            }
        });
        curricuclum_url = curricuclum_url.format(current_course_info.course_id);
        $.ajax({
            url:curricuclum_url,
            async:false,
            method:'GET',
            beforeSend:function(xhr){
                xhr.setRequestHeader('authorization',authorization);
            },
            success:function(response){
                var list = response.results;
                list.push({'_class':'chapter','id':'useless','title':''});
                var chapter = {'chapter_id':'','chapter_name':{},'lecture_info':[]};
                var lecture_sn = 0;
                list.forEach(function(item,index){
                    if(item._class == 'chapter'){
                        if(chapter.chapter_id != ''){
                            var data = JSON.parse(JSON.stringify(chapter));
                            current_course_info.chapter_info.push(data);
                        }
                        if(item.id != 'useless'){
                            chapter.chapter_id = item.id;
                            chapter.chapter_name = item.title.replace(/:|\?|\*|"|<|>|\|/g," ");
                            chapter.lecture_info = [];
                        }
                    }else if(item._class == 'lecture'){
                        var lecture = {'lecture_sn':(++lecture_sn),'lecture_id':item.id,'lecture_name':item.title.replace(/:|\?|\*|"|<|>|\|/g," "),'lecture_asset':{'asset_id':item.asset.id,'asset_name':item.asset.title.replace(/:|\?|\*|"|<|>|\|/g," "),'asset_type':item.asset.asset_type}};
                        chapter.lecture_info.push(lecture);
                    }
                });
                mylog(current_course_info);
            }
        });
    }

    //添加下载助手按钮
    function addDownloadAssistant(){
        var download_assistant = $('<li ui-sref-active="active"></li>');
        var download_assistant_a = $('<a class="dropdown-toggle"><span class="mr5"><span>下载助手</span></span><i class="udi udi-caret-down"></i></a>');
        var assistant_content = $('<div id="assistant_content" style="display:none;z-index:999999;position:absolute;width:90px;background-color:#fff;border:1px solid #ddd;top:55px;padding:5px 10px;text-align:center;line-height:30px;"></div>');
        var batch_download = $('<a>批量下载</a>');
        var assistant_setting = $('<a>设置</a>');
        assistant_content.append(batch_download).append(assistant_setting);
        download_assistant.append(download_assistant_a).append(assistant_content);
        $('.nav-tabs').append(download_assistant);
        download_assistant.click(function(event){
            if(isExpand){
                isExpand = false;
            }else{
                isExpand = true;
            }
            assistant_content.toggle();
            event.stopPropagation();
        });
        $(document).click(function(){
            if(isExpand){
                assistant_content.hide();
                isExpand = false;
            }
        });
        batch_download.click(function(){
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
             showSetting();
        });
    }

    //加载个人设置
    function loadSetting(){
        video_quality = GM_getValue('video_quality', '720');
        aria2_url = GM_getValue('aria2_url','http://127.0.0.1:6800/jsonrpc');
        course_save_path = GM_getValue('course_save_path','');
    }

    //打开设置
    function showSetting(){
        if(document.querySelector('#dl-setting') == null){
            var container = document.createElement("div");
            container.id = "dl-setting";
            container.style = "position:fixed;z-index:999999;top:10%;right:2%;width:270px;background-color:#eee;padding:5px 10px;font-size:14px;border:1px solid;";
            container.innerHTML =
                "<div style='line-height:25px;'>" +
                "<div style='text-align:center;font-size:16px;'>下载助手设置</div>" +
                "<ul>" +
                "<li>Aria2 地址：</li>" +
                "<li><input type='text' id='aria2_url' name='aria2_url' value='" + aria2_url + "' style='width:100%'></input></li>" +
                "<li>文件保存位置：</li>" +
                "<li><input type='text' id='save_path' name='save_path' value='" + course_save_path + "' style='width:100%'></input></li>" +
                "<li>清晰度：</li>" +
                "<li><label title='720P'><input id='video-quality-1' name='video-quality' value='720' type='radio' style='margin:0 5px;'" + (video_quality=="720" ? "checked":"") + "></input>720P</label>" +
                "<label title='480P' style='padding:0 5px;'><input id='video-quality-2' name='video-quality' value='480' type='radio' style='margin:0 5px;'" + (video_quality=="480" ? "checked":"") + "></input>480P</label>" +
                "<label title='360P' style='padding:0 5px;'><input id='video-quality-3' name='video-quality' value='360' type='radio' style='margin:0 5px;'" + (video_quality=="360" ? "checked":"") + "></input>360P</label>" +
                "<label title='144P' style='padding:0 5px;'><input id='video-quality-4' name='video-quality' value='144' type='radio' style='margin:0 5px;'" + (video_quality=="144" ? "checked":"") + "></input>144P</label></li>" +
                "</ul>\n" +
                "<input type='button' value='取消' id='cancel_button' style='position:relative;float:left;border:1px solid;padding:0 4px;'></input>\n" +
                "<input type='button' value='保存' id='save_button' style='position:relative;float:right;border:1px solid;padding:0 4px;'></input>\n" +
                "</div>";
            document.body.appendChild(container);
        }else{
            loadSetting();
            if(video_quality=="720"){
                $('#video-quality-1').prop('checked',true);
            }else if(video_quality=="480"){
                $('#video-quality-2').prop('checked',true);
            }else if(video_quality=="360"){
                $('#video-quality-3').prop('checked',true);
            }else if(video_quality=="144"){
                $('#video-quality-4').prop('checked',true);
            }
            $('#aria2_url').value = aria2_url;
            $('#save_path').value = course_save_path;
            $('#dl-setting').show();
        }
        $('#save_button').click(function(){
            GM_setValue('video_quality',$('input[name="video-quality"]:checked').val());
            GM_setValue('aria2_url',$('input[name="aria2_url"]').val());
            GM_setValue('course_save_path',$('input[name="save_path"]').val());
            $('#dl-setting').hide();
        });
        $('#cancel_button').click(function(){
            $('#dl-setting').hide();
        });
    }

    //批量下载
    function batchDownload(){
        current_course_info.chapter_info.forEach(function(chapter,index){
            chapter.lecture_info.forEach(function(lecture){
                if(lecture.lecture_asset.asset_type == 'Video'){
                    var file_name = lecture.lecture_sn + '.' + lecture.lecture_name;
                    var save_path = course_save_path.replace(/\\/g,'\/') + '/' + current_course_info.course_name + '/' + (index + 1) + '.' + current_course_info.chapter_info[index].chapter_name;
                    var real_lesson_url = lesson_url.format(lecture.lecture_asset.asset_id);
                    getVideoUrl(real_lesson_url,file_name + '.mp4',save_path);
                }
            });
        });
    }

    //添加下载按钮
    function addDownloadButton(){
        var li_items = $('div.section--section--CIk7q li.curriculum-item--curriculum-item--iJwX5');
        $.each(li_items,function(index,element){
            if (element.firstChild.childNodes[2].innerHTML == '') {
                element.firstChild.style.paddingRight = "70px";
                return true;
            }
            var download_button = document.createElement('span');
            download_button.className = 'download-button';
            download_button.innerHTML = '下载';
            download_button.style.order = 5;
            download_button.style.marginLeft = '20px';
            (element.firstChild).append(download_button);
        });
        $('.download-button').each(function(){
            $(this).click(function(event){
                loadSetting();
                if(course_save_path==""){
                    alert("请到下载助手的设置里面填写文件保存位置");
                }else if(aria2_url==""){
                    alert("请到下载助手的设置里面填写 Aria2 地址");
                }else{
                    var chapter_index = $(this).parents('.section--section--CIk7q').index();
                    var lecture_index = $(this).parents('.curriculum-item--curriculum-item--iJwX5').index();
                    var lecture = current_course_info.chapter_info[chapter_index].lecture_info[lecture_index];
                    mylog("选择的课为【lecture_name:" + lecture.lecture_name + ",lecture_id:" + lecture.lecture_id + '】');
                    var file_name = lecture.lecture_sn + '.' + lecture.lecture_name;
                    var save_path = course_save_path.replace(/\\/g,'\/') + '/' + current_course_info.course_name + '/' + (chapter_index + 1) + '.' + current_course_info.chapter_info[chapter_index].chapter_name;
                    var real_lesson_url = lesson_url.format(lecture.lecture_asset.asset_id);
                    var url = 'https://www.udemy.com/vuejs-app/learn/v4/t/lecture/{0}?start=0'.format(lecture.lecture_id);
                    getVideoUrl(real_lesson_url,file_name + '.mp4',save_path);
                }
                event.stopPropagation();
            });
        });
    }

    //获取视频下载地址
    function getVideoUrl(url,file_name,save_path){
        $.ajax({
            url:url,
            async:true,
            method:'GET',
            beforeSend:function(xhr){
                xhr.setRequestHeader('authorization',authorization);
            },
            success:function(response){
                var video_urls = response.stream_urls.Video;
                video_urls.forEach(function(value){
                    if (value.label == video_quality){
                        //mylog(value.file);
                        sendDownloadTaskToAria2(value.file,file_name,save_path);
                    }
                });
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