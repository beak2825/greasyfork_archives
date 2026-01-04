// ==UserScript==
// @name              中国大学 MOOC www.icourse163.org ADown下载助手
// @name:en           www.icourse163.org Downloader
// @namespace         https://www.cnblogs.com/Chary/
// @version           1.1
// @description       在www.icourse163.org中国大学 MOOC 的课程学习页面添加批量下载按钮，方便将视频下载到本地学习
// @description:en    add download button on www.icourse163.org to download videos
// @author            charyGao
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match             *://www.icourse163.org/learn/*
// @grant             unsafeWindow
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @grant             GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/378235/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%20MOOC%20wwwicourse163org%20ADown%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/378235/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%20MOOC%20wwwicourse163org%20ADown%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = $ || window.$;
    var log_count = 1;
    var hasOpenAriac2Tab = false;

    var isSaveHtm = false;//保存htmToDownDir
    var isSaveZip = true;//保存Code Zip
    var isSavePpt = true;//保存ppt Pdf
    var isSaveVideo = true;//保存video 视频
    var isSaveSrt = true;//保存字幕

    var isMarkAsLearned = true;//标记为已学
    var video_quality = 2; //视频清晰度
    var video_format = 'mp4'; //视频格式
    var aria2_url = "http://127.0.0.1:6800/jsonrpc"; //Aria2 地址
    var course_save_path = 'output'; //课程保存路径
    var video_save_path; //每个视频保存路径
    var video_download_url = ""; //视频下载地址
    var course_info = { 'course_id': {}, 'id': {}, 'course_name': {}, 'units_info': [] }; //课程信息
    var cookies = document.cookie;
    var sessionId = cookies.match(/NTESSTUDYSI=(\w+)/)[1];
    var userId = cookies.match(/NETEASE_WDA_UID=(\d+)#\|#/)[1];

    //自定义 log 函数
    function mylog(param1, param2) {
        param1 = param1 ? param1 : "";
        param2 = param2 ? param2 : "";
        console.log("#" + log_count++ + "-Icourse163Downloader-log:", param1, param2);
    }

    setTimeout(function () {
        getCourseIdAndName();
        getCourseContentInfo();
        loadSetting();
        addDownloadAssistant();
        mylog("中国大学 MOOC 下载助手加载完成~");
    }, 2000); //页面加载完成后延时2秒执行

    //获取课程名称
    function getCourseIdAndName() {
        var courseCardDto = unsafeWindow.courseCardDto;
        course_info.course_name = courseCardDto.name.replace(/\/|:|\?|\*|"|<|>|\|/g, " ");
        course_info.id = courseCardDto.id;
        if (location.href.match(/tid=(\d+)/)[1]) {
            course_info.course_id = location.href.match(/tid=(\d+)/)[1];
        } else {
            course_info.course_id = courseCardDto.currentTermId;
        }
    }

    //添加批量下载和下载设置按钮
    function addDownloadAssistant() {
        var batch_download_li = $("<li class='u-greentab'></li>");
        var batch_download = $("<a>批量下载</a>");
        batch_download_li.append(batch_download);
        var assistant_setting_li = $("<li class='u-greentab'></li>");
        var assistant_setting = $("<a>下载设置</a>");
        assistant_setting_li.append(assistant_setting);
        $('#j-courseTabList').append(batch_download_li).append(assistant_setting_li);
        batch_download_li.click(function () {
            loadSetting();
            if (course_save_path == "") {
                alert("请点击下载设置去填写文件保存位置");
            } else if (aria2_url == "") {
                alert("请点击下载设置去填写 Aria2 地址");
            } else {
                batchDownload();
            }
        });
        assistant_setting_li.click(function () {
            showSetting();
        });
    }

    /** 
     * 设置select控件选中 
     * @param selectId select的id值 
     * @param checkValue 选中option的值 
     * @author 标哥 
    */
    function set_select_checked_value(selectId, checkValue, isSetTrue) {
        var select = document.getElementById(selectId);

        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].value == checkValue) {
                select.options[i].selected = isSetTrue;
                break;
            }
        }
    }

    //加载个人设置
    function loadSetting() {
        video_quality = GM_getValue('video_quality', 2);
        video_format = GM_getValue('video_format', 'mp4');
        aria2_url = GM_getValue('aria2_url', 'http://127.0.0.1:6800/jsonrpc');
        course_save_path = GM_getValue('course_save_path', 'output');

        isSaveHtm = GM_getValue('isSaveHtm', false);
        isSaveZip = GM_getValue('isSaveZip', false);
        isSavePpt = GM_getValue('isSavePpt', true);
        isSaveVideo = GM_getValue('isSaveVideo', true);
        isSaveSrt = GM_getValue('isSaveSrt', true);

        isMarkAsLearned = GM_getValue('isMarkAsLearned', true);
    }

    //打开设置
    function showSetting() {
        if (document.querySelector('#dl-setting') == null) {
            var container = document.createElement("div");
            container.id = "dl-setting";
            container.style = "position: fixed; z-index: 999999; bottom: 10%; left: 40px; width: 250px; height: auto; background: black; padding: 10px; color: white; font-size: 14px; border: 1px solid red;";
            container.innerHTML =
                '<div style="line-height:22px;"><p style="text-align:center;font-size:16px;">下载设置</p>' +
                '<div> Aria2 地址: <input type="text" id="aria2_url" name="aria2_url" value="' + aria2_url + '" style="width:100%;color:white;border:solid 1px red;"/></div>' +
                '<div>文件保存位置: <input type="text" id="save_path" name="save_path" value="' + course_save_path + '" style="width:100%;color:white;border:solid 1px red;" /></div>' +

                '<div>下载内容: (no video,no srt！)</div><div style="text-align:center;">' +
                // '<input id="is_save_htm" type="checkbox" ' + (isSaveHtm == true ? "checked" : "") + ' style="margin-left: 8px;"/> htm' +
                // '<input id="is_save_zip" type="checkbox" ' + (isSaveZip == true ? "checked" : "") + ' style="margin-left: 8px;"/> zip' +
                '<input id="is_save_ppt" type="checkbox" ' + (isSavePpt == true ? "checked" : "") + ' style="margin-left: 8px;"/> ppt' +
                '<input id="is_save_srt" type="checkbox" ' + (isSaveSrt == true ? "checked" : "") + ' style="margin-left: 8px;"/> srt' +
                '<input id="is_save_video" type="checkbox" ' + (isSaveVideo == true ? "checked" : "") + ' style="margin-left: 8px;"/> video</div>' +

                '<div>清晰度:' +
                '<select id="video_quality" style=" margin-right: 14px; " >' +
                '<option value="1" ' + (video_quality == 1 ? 'selected' : '') + '>1.标清</option>' +
                '<option value="2" ' + (video_quality == 2 ? 'selected' : '') + '>2.高清</option>' +
                '<option value="3" ' + (video_quality == 3 ? 'selected' : '') + '>3.超清</option>' +
                '</select>格式:<select id="video_format">' +
                '<option value="hls" ' + (video_format == 'hls' ? 'selected' : '') + '>hls(m3u8)</option>' +
                '<option value="mp4" ' + (video_format == 'mp4' ? 'selected' : '') + '>mp4</option>' +
                '<option value="flv" ' + (video_format == 'flv' ? 'selected' : '') + '>flv</option></select></div>' +

                '<div style="margin-top: 5px;">' +
                '<span> <input id="is_mark_as_learned" type="checkbox" ' + (isMarkAsLearned == true ? "checked" : "") + ' /> 标记已学过该课程 </span>' +
                '<span style="float: right;">' +
                '<input type="button" value="取消" id="cancel_button" style="border:1px solid white;color: white;padding:0 2px;background:black;">' +
                '<input type="button" value="保存" id="save_button" style="border:1px solid white;color: white;padding:0 2px;background:black;"></span></div></div>';
            document.body.appendChild(container);
        } else {
            loadSetting();

            set_select_checked_value('video_quality', video_quality, true);//设置清晰度 显示值
            set_select_checked_value('video_format', video_format, true);//设置格式 显示值

            $('#is_save_htm').prop('checked', isSaveHtm);//设置htm 显示值
            $('#is_save_zip').prop('checked', isSaveZip);//设置zip 显示值
            $('#is_save_ppt').prop('checked', isSavePpt);//设置ppt 显示值
            $('#is_save_video').prop('checked', isSaveVideo); //设置video 显示值
            $('#is_save_srt').prop('checked', isSaveSrt); //设置 srt 显示值

            $('#is_mark_as_learned').prop('checked', isMarkAsLearned); //设置格式 显示值

            $('#aria2_url').value = aria2_url;
            $('#save_path').value = course_save_path;
            $('#dl-setting').show();
        }
        $('#save_button').click(function () {
            GM_setValue('aria2_url', $('input[name="aria2_url"]').val());
            GM_setValue('course_save_path', $('input[name="save_path"]').val());

            GM_setValue('video_quality', $('#video_quality option:selected').val());
            GM_setValue('video_format', $('#video_format option:selected').val());

            GM_setValue('isSaveHtm', $('#is_save_htm').prop('checked'));
            GM_setValue('isSaveZip', $('#is_save_zip').prop('checked'));
            GM_setValue('isSavePpt', $('#is_save_ppt').prop('checked'));
            GM_setValue('isSaveVideo', $('#is_save_video').prop('checked'));
            GM_setValue('isSaveSrt', $('#is_save_srt').prop('checked'));

            GM_setValue('isMarkAsLearned', $('#is_mark_as_learned').prop('checked'));

            $('#dl-setting').hide();
        });
        $('#cancel_button').click(function () {
            $('#dl-setting').hide();
        });
    }

    //获取课程信息
    function getCourseContentInfo() {
        var timestamp = new Date().getTime();
        var params = {
            "callCount": "1",
            "scriptSessionId": "${scriptSessionId}190",
            "httpSessionId": sessionId,
            "c0-scriptName": "CourseBean",
            "c0-methodName": "getLastLearnedMocTermDto",
            "c0-id": "0",
            "c0-param0": "number:" + course_info.course_id,
            "batchId": timestamp
        };
        $.ajax({
            url: 'https://www.icourse163.org/dwr/call/plaincall/CourseBean.getLastLearnedMocTermDto.dwr',
            method: 'POST',
            async: true,
            data: params,
            success: function (response) {
                var root_key = response.match(/chapters=(.*?);/)[1]; //保存全部章节的变量  root s1
                var unit_reg = new RegExp(root_key + '\\[\\d+\\]=(.*?);', 'g');
                var units_key_expression = response.match(unit_reg); //保存各章节的变量 root->units s3-s10
                units_key_expression.forEach(function (value) {
                    var unit_info_key = value.match(/=(.*?);/)[1]; //保存各章节的变量名字 root->units s3
                    var unit_info_reg = new RegExp(unit_info_key + '.id=(.*?);' + unit_info_key + '.lessons=(.*?);' + unit_info_key + '.name="(.*?)";');
                    var unit_info = response.match(unit_info_reg); //保存章节 id，lessons，name 的变量 root->units s3(s12)
                    var unit_id_key_reg = new RegExp(unit_info[2] + '\\[\\d+\\]=(.*?);', 'g');
                    var chapter_key_expression = response.match(unit_id_key_reg); //保存各小节的变量 // root->units s3(s12)->chapters s14-s16
                    var unit = { 'chapter_id': unit_info[1], 'chapter_name': unescape(unit_info[3].replace(/\\u/gi, '%u').replace(/\/|:|\?|\*|"|<|>|\|/g, " ")), 'chapters_info': [] };//id+第1单元 让一切并行起来
                    chapter_key_expression.forEach(function (value) {
                        var chapter_info_key = value.match(/=(.*?);/)[1]; //保存各小节的变量名字 root->units s3(s12)->chapters s14
                        var chapter_info_reg = new RegExp(chapter_info_key + '.chapterId=(.*?);.*?' + chapter_info_key + '.id=(.*?);.*?' + chapter_info_key + '.name="(.*?)";.*?' + chapter_info_key + '.units=(.*?);');
                        var chapter_info = response.match(chapter_info_reg);//root->units s3(s12)->chapter s14(s17)
                        var chapter_id_key_reg = new RegExp(chapter_info[4] + '\\[\\d+\\]=(.*?);', 'g');
                        var lessons_key_expression = response.match(chapter_id_key_reg);//root->units s3(s12)->chapter s14(s17)->lessons s18-s35
                        var chapter = { 'chapter_id': chapter_info[1], 'lesson_id': chapter_info[2], 'lesson_name': unescape(chapter_info[3].replace(/\\u/gi, '%u').replace(/\/|:|\?|\*|"|<|>|\|/g, " ")), 'lessons_info': [] };
                        lessons_key_expression.forEach(function (value) {
                            var lesson_info_key = value.match(/=(.*?);/)[1];//root->units s3(s12)->chapter s14(s17)->lessons s18
                            var lesson_info_reg = new RegExp(lesson_info_key + '.chapterId=(.*?);.*?' + lesson_info_key + '.contentId=(.*?);.*?' + lesson_info_key + '.contentType=(.*?);.*?'
                                + lesson_info_key + '.id=(.*?);.*?' + lesson_info_key + '.lessonId=(.*?);.*?' + lesson_info_key + '.name="(.*?)";.*?');
                            var lesson_info = response.match(lesson_info_reg);
                            var lesson = { 'chapter_id': lesson_info[1], 'lesson_id': lesson_info[5], 'content_id': lesson_info[2], 'section_id': lesson_info[4], 'section_name': unescape(lesson_info[6].replace(/\\u/gi, '%u').replace(/\/|:|\?|\*|"|<|>|\|/g, " ")), 'content_type': lesson_info[3] };
                            chapter.lessons_info.push(lesson);//section
                        });
                        unit.chapters_info.push(chapter);
                    });
                    course_info.units_info.push(unit);
                });
                mylog(course_info);
            }
        });
    }

    //批量下载
    function batchDownload() {
        course_info.units_info.forEach(function (unit, index_unit) {
            unit.chapters_info.forEach(function (chapter, index_chapter) {
                chapter.lessons_info.forEach(function (lesson, index_lesson) {
                    var file_name = '第' + (index_lesson + 1) + '节_' + lesson.section_name;
                    var save_path = course_save_path.replace(/\\/g, '\/') + '/' + course_info.course_name + '/第' + (index_unit + 1) + '单元_' + unit.chapter_name + '/第' + (index_chapter + 1) + '章_' + chapter.lesson_name;

                    if (lesson.content_type == '1' && isSaveVideo) {
                        getVideoToken(lesson.content_id, lesson, unit, chapter, file_name, save_path);
                    } else if (lesson.content_type == '3' && isSavePpt) {
                        getCourseContentUrl(lesson.content_id, lesson.section_id, lesson, file_name, save_path);
                    } else if (lesson.content_type == '4') {//4 html
                        if (isSaveHtm) {
                            //getHtmlContent(lesson.content_type, course_info.course_id, lesson.content_id, lesson.section_id, file_name, save_path);//lesson.json_content,
                        }
                        if (isSaveZip && lesson.json_content != null) {
                            //sendDownloadTaskToAria2('https://mooc.study.163.com/course/attachment.htm?fileName=' + lesson.json_content.fileName + '&nosKey=' + lesson.json_content.nosKey, file_name + '_' + lesson.json_content.fileName, save_path);
                        }
                        if (isMarkAsLearned) {
                            mark_htm_as_learned(lesson);
                        }
                    } else if (lesson.content_type == '6') {//6 讨论 htm
                        // if (isSaveHtm) {
                        //    get_discuss_htm_content(lesson.content_type, course_info.course_id, lesson.content_id, lesson.section_id, file_name, save_path);//lesson.json_content,
                        // }
                        if (isMarkAsLearned) {
                            mark_htm_as_learned(lesson);
                        }
                    }

                });
            });
        });
    }
    //获取文档下载地址
    function getHtmlContent(content_type, course_id, content_id, section_id, file_name, save_path) {//json_content,
        var timestamp = new Date().getTime();
        var params = {
            "callCount": "1",
            "scriptSessionId": "${scriptSessionId}190",
            "httpSessionId": sessionId,
            "c0-scriptName": "CourseBean",
            "c0-methodName": "getLessonUnitLearnVo",
            "c0-id": "0",
            "c0-param0": "number:" + course_id,
            "c0-param1": "number:" + content_id,
            "c0-param2": "number:" + content_type,
            "c0-param3": "number:0",
            "c0-param4": "number:" + section_id,
            "batchId": timestamp
        };
        $.ajax({
            url: 'https://mooc.study.163.com/dwr/call/plaincall/CourseBean.getLessonUnitLearnVo.dwr?' + timestamp,
            method: 'POST',
            async: true,
            data: params,
            success: function (response) {
                var htmlContent = response.match(/htmlContent:"(.*?)",/);
                if (htmlContent != null && htmlContent.length > 0) {
                    var htmlContentStr = htmlContent[1];
                    //mylog(unescape(htmlContentStr.replace(/\\u/gi, '%u')));//.replace(/\/|:|\?|\*|"|<|>|\|/g, " ")
                    if (isSaveHtm) {
                        exportRaw(save_path.replace(course_save_path, '').replace(/\/|:|\?|\*|"|<|>|\|/g, "") + file_name, unescape(htmlContentStr.replace(/\\"/g, '"').replace(/\\u/gi, '%u')), '.htm');
                    }
                }
            }
        });
    }

    function exportRaw(file_download_path, content, file_extension) {//调用文件下载
        var data = new Blob([content], { type: "text/plain;charset=UTF-8" });
        var downloadUrl = window.URL.createObjectURL(data);
        var anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = file_download_path + file_extension;
        //mylog(file_download_path);
        anchor.click();
        window.URL.revokeObjectURL(data);
    }

    //获取htm文档下载地址
    function get_discuss_htm_content(content_type, course_id, content_id, section_id, file_name, save_path) {//json_content,
        var timestamp = new Date().getTime();
        var params = {
            "callCount": "1",
            "scriptSessionId": "${scriptSessionId}190",
            "httpSessionId": sessionId,
            "c0-scriptName": "CourseBean",
            "c0-methodName": "getLessonUnitLearnVo",
            "c0-id": "0",
            "c0-param0": "number:" + course_id,
            "c0-param1": "number:" + content_id,
            "c0-param2": "number:" + content_type,
            "c0-param3": "number:0",
            "c0-param4": "number:" + section_id,
            "batchId": timestamp
        };
        $.ajax({
            url: 'https://www.icourse163.org/dwr/call/plaincall/CourseBean.getLessonUnitLearnVo.dwr?' + timestamp,
            method: 'POST',
            async: true,
            data: params,
            success: function (response) {
                var htmContent = response.match(/s0\.content="(.*?)";s0/);
                if (htmContent != null && htmContent.length > 0) {
                    var content = htmContent[1];
                    //mylog(unescape(content.replace(/\\u/gi, '%u')));//.replace(/\/|:|\?|\*|"|<|>|\|/g, " ")
                    if (isSaveHtm) {
                        exportRaw(save_path.replace(course_save_path, '').replace(/\/|:|\?|\*|"|<|>|\|/g, "") + file_name, unescape(content.replace(/\\"/g, '"').replace(/\\u/gi, '%u')), '.htm');
                    }
                }
            }
        });
    }
    //标记htm已经完成学习
    function mark_htm_as_learned(lesson) {//content_type, course_id, content_id, 
        var timestamp = new Date().getTime();
        var params = {
            "callCount": "1",
            "scriptSessionId": "${scriptSessionId}190",
            "httpSessionId": sessionId,
            "c0-scriptName": "CourseBean",
            "c0-methodName": "saveMocContentLearn",
            "c0-id": "0",
            "c0-e1": "number:" + lesson.section_id,//course_id,
            "c0-e2": "boolean:true",// + content_id,
            "c0-e3": "number:" + lesson.content_type,
            "c0-param0": "Object_Object:{unitId:reference:c0-e1,finished:reference:c0-e2,contentType:reference:c0-e3}",// + content_type,
            "batchId": timestamp
        };
        $.ajax({
            url: 'https://www.icourse163.org/dwr/call/plaincall/CourseBean.saveMocContentLearn.dwr?' + timestamp,
            method: 'POST',
            async: true,
            data: params,
            success: function (response) {
                //mylog(lesson.section_id + lesson.section_name + 'htm mark as learned!->' + response);
            }
        });
    }

    //获取文档下载地址
    function getCourseContentUrl(content_id, section_id, lesson, file_name, save_path) {
        var timestamp = new Date().getTime();
        var params = {
            "callCount": "1",
            "scriptSessionId": "${scriptSessionId}190",
            "httpSessionId": sessionId,
            "c0-scriptName": "CourseBean",
            "c0-methodName": "getLessonUnitLearnVo",
            "c0-id": "0",
            "c0-param0": "number:" + content_id,
            "c0-param1": "number:3",
            "c0-param2": "number:0",
            "c0-param3": "number:" + section_id,
            "batchId": timestamp
        };
        $.ajax({
            url: 'https://www.icourse163.org/dwr/call/plaincall/CourseBean.getLessonUnitLearnVo.dwr',
            method: 'POST',
            async: true,
            data: params,
            success: function (response) {
                var pdfUrl = response.match(/textOrigUrl:"(.*?)",/)[1];
                //mylog(pdfUrl);
                sendDownloadTaskToAria2(pdfUrl, file_name + ".pdf", save_path);
                if (isMarkAsLearned) {
                    mark_ppt_as_learned(1, lesson);
                }
            }
        });
    }
    //标记ppt已经完成学习
    function mark_ppt_as_learned(page_num, lesson) {
        var timestamp = new Date().getTime();
        var params = {
            "callCount": "1",
            "scriptSessionId": "${scriptSessionId}190",
            "httpSessionId": sessionId,
            "c0-scriptName": "CourseBean",
            "c0-methodName": "saveMocContentLearn",
            "c0-id": "0",
            "c0-e1": "number:" + lesson.section_id,//course_id,
            "c0-e2": "number:" + page_num,// + content_id, 1也行
            "c0-e3": "boolean:true",
            "c0-e4": "number:" + lesson.content_type,
            "c0-param0": "Object_Object:{unitId:reference:c0-e1,pageNum:reference:c0-e2,finished:reference:c0-e3,contentType:reference:c0-e4}",// + content_type,
            "batchId": timestamp
        };
        $.ajax({
            url: 'https://www.icourse163.org/dwr/call/plaincall/CourseBean.saveMocContentLearn.dwr?' + timestamp,
            method: 'POST',
            async: true,
            data: params,
            success: function (response) {
                //mylog(lesson.section_id + lesson.section_name + ' ppt mark as learned!->' + response);
            }
        });
    }

    //获取视频信息
    function getVideoToken(content_id, lesson, unit, chapter, file_name, save_path) {
        var params = {
            'videoId': content_id,
            'targetId': course_info.course_id,
            'targetType': '0'
        };
        $.ajax({
            url: 'https://www.icourse163.org/web/j/resourceRpcBean.getVideoToken.rpc?csrfKey=' + sessionId,
            method: 'POST',
            async: true,
            data: params,
            success: function (response) {
                var signature = response.result.signature;
                getVideoUrl(content_id, signature, file_name, save_path);//video_id = content_id

                //var signature_id_info = response.match(/s0.duration=(.*?);.*?s0.signature="(.*?)";.*?s0.videoId=(.*?);/);
                var video_duration = response.result.duration;
                var video_name = response.result.name;
                var video_status = response.result.status;
                var video_id = response.result.videoId;
                var video_img_url = response.result.videoImgUrl;

                if (isMarkAsLearned) {
                    mark_video_as_learned(video_duration, video_id, lesson, unit, chapter);
                }
            }
        });
    }
    //标记视频已经完成学习
    function mark_video_as_learned(duration, video_id, lesson, unit, chapter) {//course_id, content_id,file_name, save_path
        var timestamp = new Date().getTime();
        var params = {
            "callCount": "1",
            "scriptSessionId": "${scriptSessionId}190",
            "httpSessionId": sessionId,
            "c0-scriptName": "CourseBean",
            "c0-methodName": "saveMocContentLearn",
            "c0-id": "0",
            "c0-e1": "number:" + lesson.section_id,//unit.chapter_id,//course_id,
            "c0-e2": "number:" + duration,// videoTime,观看时长<=duration
            "c0-e3": "boolean:true",//finished,
            "c0-e4": "number:" + 1,//index,发送save的顺序序号
            "c0-e5": "number:20000",//固定的20000 + duration,
            "c0-e6": "number:" + course_info.id,
            "c0-e7": "number:" + lesson.lesson_id,
            "c0-e8": "number:" + lesson.content_id,//video_id,
            "c0-e9": "number:" + course_info.course_id,//termId = course_id
            "c0-e10": "null:null",
            "c0-e11": "string:" + userId,
            "c0-e12": "number:" + lesson.content_type,
            "c0-param0": "Object_Object:{unitId:reference:c0-e1," +
                "videoTime:reference:c0-e2,finished:reference:c0-e3," +
                "index:reference:c0-e4,duration:reference:c0-e5," +
                "courseId:reference:c0-e6,lessonId:reference:c0-e7," +
                "videoId:reference:c0-e8,termId:reference:c0-e9," +
                "resolutionType:reference:c0-e10," +
                "userId:reference:c0-e11,contentType:reference:c0-e12}",
            "batchId": timestamp
        };
        $.ajax({
            url: 'https://www.icourse163.org/dwr/call/plaincall/CourseBean.saveMocContentLearn.dwr?' + timestamp,
            method: 'POST',
            async: true,
            data: params,
            success: function (response) {
                //mylog(lesson.section_id + lesson.section_name + 'vedio mark as learned!->' + response);
            }
        });
    }
    //获取视频下载地址
    function getVideoUrl(content_id, signature, file_name, save_path) {
        var params = {
            'videoId': content_id,
            'signature': signature,
            'clientType': '1'
        };
        $.ajax({
            url: 'https://vod.study.163.com/eds/api/v1/vod/video',
            method: 'POST',
            async: true,
            data: params,
            success: function (response) {
                var videoUrls = response.result.videos;
                var video_url_list = [];
                videoUrls.forEach(function (video) {
                    if (video.format == video_format && video.quality == video_quality) {
                        video_url_list.push({ 'video_format': video.format, 'video_quality': video.quality, 'video_url': video.videoUrl });
                    }
                });
                if (video_url_list.length != 0) {
                    video_download_url = video_url_list[0].video_url;
                    var qualityString = "";
                    switch (video_url_list[0].video_quality) {
                        case 1: qualityString = ".sd"; break;
                        case 2: qualityString = ".hd"; break;
                        case 3: qualityString = ".shd"; break;
                    }
                    if (video_format == 'hls') {
                        video_format = 'm3u8';
                    }

                    //mylog(video_download_url);
                    if (isSaveSrt && response.result.srtCaptions != null) {
                        response.result.srtCaptions.forEach(function (srtCaption) {
                            sendDownloadTaskToAria2(srtCaption.url, file_name + qualityString + '.' + srtCaption.languageCode + '.srt', save_path);
                        });
                    }
                    sendDownloadTaskToAria2(video_download_url, file_name + qualityString + '.' + video_format, save_path);
                }
            }
        });
    }

    // 将下载链接发送到 Aria2 下载
    function sendDownloadTaskToAria2(download_url, file_name, save_path) {
        //mylog(download_url + '\n\t' + save_path + '-' + file_name + '\n');
        //return;
        var json_rpc = {
            id: '',
            jsonrpc: '2.0',
            method: 'aria2.addUri',
            params: [
                [download_url],
                {
                    dir: save_path,
                    out: file_name
                }
            ]
        };
        GM_xmlhttpRequest({
            url: aria2_url,
            method: 'POST',
            data: JSON.stringify(json_rpc),
            onerror: function (response) {
                mylog(response);
            },
            onload: function (response) {
                mylog(response);
                if (!hasOpenAriac2Tab) {
                    //GM_openInTab('http://aria2c.com/', { active: true });
                    alert("done! open AriaNg to look!");
                    hasOpenAriac2Tab = true;
                }
            }
        });
    }

})();