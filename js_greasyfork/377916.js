// ==UserScript==
// @name              网易云课堂mooc.study.163.com ADown下载助手
// @name:en           mooc.study.163.com Downloader
// @namespace         https://www.cnblogs.com/Chary/
// @version           1.0
// @description       在mooc.study.163.com的课程学习页面添加批量下载按钮，方便将视频下载到本地学习
// @description:en    add download button on mooc.study.163.com to download videos
// @author            charyGao
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match             *://mooc.study.163.com/learn/*
// @grant             unsafeWindow
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @grant             GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/377916/%E7%BD%91%E6%98%93%E4%BA%91%E8%AF%BE%E5%A0%82moocstudy163com%20ADown%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/377916/%E7%BD%91%E6%98%93%E4%BA%91%E8%AF%BE%E5%A0%82moocstudy163com%20ADown%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
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

   var isMarkAsLearned = true;//保存video 视频

   var video_quality = 2; //视频清晰度
   var video_format = 'mp4'; //视频格式
   var aria2_url = "http://127.0.0.1:6800/jsonrpc"; //Aria2 地址
   var course_save_path = 'output'; //课程保存路径
   var video_save_path; //每个视频保存路径
   var video_download_url = ""; //视频下载地址
   var course_info = { 'course_id': {}, 'course_name': {}, 'units_info': [] }; //课程信息
   var cookies = document.cookie;
   var sessionId = cookies.match(/NTESSTUDYSI=(\w+)/)[1];

   //自定义 log 函数
   function mylog(param1, param2) {
      param1 = param1 ? param1 : "";
      param2 = param2 ? param2 : "";
      console.log("#" + log_count++ + "-mooc.study.163.comDownloader-log:", param1, param2);
   }

   setTimeout(function () {
      getCourseIdAndName();
      getCourseContentInfo();
      loadSetting();
      addDownloadAssistant();
      mylog("mooc.study.163.com下载助手加载完成~");
   }, 2000); //页面加载完成后延时2秒执行

   //获取课程名称
   function getCourseIdAndName() {
      var courseDto = unsafeWindow.courseDto;
      course_info.course_name = courseDto.name.replace(/\/|:|\?|\*|"|<|>|\|/g, " ");
      if (location.href.match(/tid=(\d+)/)[1]) {
         course_info.course_id = location.href.match(/tid=(\d+)/)[1];
      } else {
         course_info.course_id = courseDto.currentTermId;
      }
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
         url: 'https://mooc.study.163.com/dwr/call/plaincall/CourseBean.getLastLearnedMocTermDto.dwr',
         method: 'POST',
         async: true,
         data: params,
         success: function (response) {
            var root_key = response.match(/s0\.chapters=(.*?);/)[1]; //保存全部章节的变量 root s1
            var unit_reg = new RegExp(root_key + '\\[\\d+\\]=(.*?);', 'g');
            var units_key_expression = response.match(unit_reg); //保存各章节的变量 root->units s3-s10
            units_key_expression.forEach(function (value) {
               var unit_info_key = value.match(/=(.*?);/)[1]; //保存各章节的变量名字 root->units s3
               var unit_info_reg = new RegExp(unit_info_key + '.id=(.*?);' + unit_info_key + '.lessons=(.*?);' + unit_info_key + '.name="(.*?)";');
               var unit_info = response.match(unit_info_reg); //保存章节 id，lessons，name 的变量 root->units s3(s12)
               var unit_id_key_reg = new RegExp(unit_info[2] + '\\[\\d+\\]=(.*?);', 'g');
               var chapter_key_expression = response.match(unit_id_key_reg); // root->units s3(s12)->chapters s14-s16
               var unit = { 'chapter_id': unit_info[1], 'chapter_name': unescape(unit_info[3].replace(/\\u/gi, '%u').replace(/\/|:|\?|\*|"|<|>|\|/g, " ")), 'chapters_info': [] }; //id+第1单元 让一切并行起来
               chapter_key_expression.forEach(function (value) {
                  var chapter_info_key = value.match(/=(.*?);/)[1]; //保存各小节的变量名字 root->units s3(s12)->chapters s14
                  var chapter_info_reg = new RegExp(chapter_info_key + '.chapterId=(.*?);.*?' + chapter_info_key + '.id=(.*?);.*?' + chapter_info_key + '.name="(.*?)";.*?' + chapter_info_key + '.units=(.*?);');
                  var chapter_info = response.match(chapter_info_reg);//保存各小节的变量名字 root->units s3(s12)->chapter s14(s17)
                  var chapter_id_key_reg = new RegExp(chapter_info[4] + '\\[\\d+\\]=(.*?);', 'g');//
                  var lessons_key_expression = response.match(chapter_id_key_reg);//root->units s3(s12)->chapter s14(s17)->lessons s18-s35
                  var chapter = { 'chapter_id': chapter_info[1], 'lesson_id': chapter_info[2], 'lesson_name': unescape(chapter_info[3].replace(/\\u/gi, '%u').replace(/\/|:|\?|\*|"|<|>|\|/g, " ")), 'lessons_info': [] };
                  lessons_key_expression.forEach(function (value) {
                     var lesson_info_key = value.match(/=(.*?);/)[1];//root->units s3(s12)->chapter s14(s17)->lessons s18
                     var lesson_info_reg = new RegExp(lesson_info_key + '.chapterId=(.*?);.*?' + lesson_info_key + '.contentId=(.*?);.*?' + lesson_info_key + '.contentType=(.*?);.*?' + lesson_info_key + '.id=(.*?);.*?'
                        + lesson_info_key + '.jsonContent=(.*?);.*?' + lesson_info_key + '.lessonId=(.*?);.*?' + lesson_info_key + '.name="(.*?)";.*?');
                     var lesson_info = response.match(lesson_info_reg);
                     var jsonContent = null;
                     var json_Content_info = lesson_info[5].match(/\{\\"nosKey\\":\\"(.*?)\\",\\"fileName\\":\\"(.*?)\\"\}/);
                     if (json_Content_info != null && json_Content_info.length >= 2) {
                        jsonContent = { 'nosKey': json_Content_info[1], 'fileName': json_Content_info[2] };
                     }
                     var lesson = {
                        'chapter_id': lesson_info[1], 'content_id': lesson_info[2], 'content_type': lesson_info[3], 'section_id': lesson_info[4],
                        'json_content': jsonContent,
                        'lesson_id': lesson_info[6], 'section_name': unescape(lesson_info[7].replace(/\\u/gi, '%u').replace(/\/|:|\?|\*|"|<|>|\|/g, " ")), 'content_type': lesson_info[3]
                     };
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

   //加载个人设置
   function loadSetting() {
      video_quality = GM_getValue('video_quality', 2);
      video_format = GM_getValue('video_format', 'mp4');
      aria2_url = GM_getValue('aria2_url', 'http://127.0.0.1:6800/jsonrpc');
      course_save_path = GM_getValue('course_save_path', 'output');

      isSaveHtm = GM_getValue('isSaveHtm', false);
      isSaveZip = GM_getValue('isSaveZip', true);
      isSavePpt = GM_getValue('isSavePpt', true);
      isSaveVideo = GM_getValue('isSaveVideo', true);

      isMarkAsLearned = GM_getValue('isMarkAsLearned', true);
   }

   //添加批量下载和下载设置按钮
   function addDownloadAssistant() {
      var batch_download_li = $("<li class='u-greentab'></li>");
      var batch_download = $("<a>批量下载</a>");
      batch_download_li.append(batch_download);
      var assistant_setting_li = $("<li class='u-greentab'></li>");
      var assistant_setting = $("<a>下载设置</a>");
      assistant_setting_li.append(assistant_setting);
      $('#j-courseTabList ul.tab').append(batch_download_li).append(assistant_setting_li);
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

   //打开设置
   function showSetting() {
      if (document.querySelector('#dl-setting') == null) {
         var container = document.createElement("div");
         container.id = "dl-setting";
         container.style = "position: fixed; z-index: 999999; bottom: 10%; left: 40px; width: 250px; height: auto; background: black; padding: 10px; color: white; font-size: 14px; border: 1px solid red;";
         container.innerHTML =
            '<div style="line-height:22px;"><p style="text-align:center;font-size:16px;">下载设置</p>' +

            '<div> Aria2 地址: <input type="text" id="aria2_url" name="aria2_url" value="' + aria2_url + '"style="width:100%" /></div>' +
            '<div>文件保存位置: <input type="text" id="save_path" name="save_path" value="' + course_save_path + '" style="width:100%" /></div>' +

            '<div>下载内容: </div><div style="text-align: center;">' +
            '<input id="is_save_htm" type="checkbox" ' + (isSaveHtm == true ? "checked" : "") + '/> htm' +
            '<input id="is_save_zip" type="checkbox" ' + (isSaveZip == true ? "checked" : "") + ' /> zip' +
            '<input id="is_save_ppt" type="checkbox" ' + (isSavePpt == true ? "checked" : "") + ' /> ppt' +
            '<input id="is_save_video" type="checkbox" ' + (isSaveVideo == true ? "checked" : "") + ' /> video</div>' +

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
            '<input type="button" value="取消" id="cancel_button">' +
            '<input type="button" value="保存" id="save_button"></span></div></div>';
         document.body.appendChild(container);
      } else {
         loadSetting();

         set_select_checked_value('video_quality', video_quality, true);//设置清晰度 显示值
         set_select_checked_value('video_format', video_format, true);//设置格式 显示值

         // switch (video_format) {
         //     case 1: $('#video_quality').prop('checked', true); break;
         //     case 2: $('#video_quality').prop('checked', true); break;
         //     case 3: $('#video_quality').prop('checked', true); break;
         // }
         $('#is_save_htm').prop('checked', isSaveHtm);//设置htm 显示值
         $('#is_save_zip').prop('checked', isSaveZip);//设置zip 显示值
         $('#is_save_ppt').prop('checked', isSavePpt);//设置ppt 显示值
         $('#is_save_video').prop('checked', isSaveVideo); //设置video 显示值

         $('#is_mark_as_learned').prop('checked', isMarkAsLearned); //设置标记已完成 显示值

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

         GM_setValue('isMarkAsLearned', $('#is_mark_as_learned').prop('checked'));

         $('#dl-setting').hide();
      });
      $('#cancel_button').click(function () {
         $('#dl-setting').hide();
      });
   }

   //批量下载
   function batchDownload() {
      course_info.units_info.forEach(function (unit, index_unit) {
         unit.chapters_info.forEach(function (chapter, index_chapter) {
            chapter.lessons_info.forEach(function (lesson, index_lesson) {
               var file_name = '第' + (index_lesson + 1) + '节_' + lesson.section_name;
               var save_path = course_save_path.replace(/\\/g, '\/') + '/' + course_info.course_name + '/第' + (index_unit + 1) + '单元_' + unit.chapter_name + '/第' + (index_chapter + 1) + '章_' + chapter.lesson_name;
               if (lesson.content_type == '1' && isSaveVideo) {//1视频
                  getVideoToken(lesson.content_type, course_info.course_id, lesson.content_id, lesson, file_name, save_path);
               } else if (lesson.content_type == '3' && isSavePpt) {//3 ppt
                  getCourseContentUrl(lesson.content_type, course_info.course_id, lesson.content_id, lesson, file_name, save_path);
               } else if (lesson.content_type == '4') {//4 html
                  if (isSaveHtm) {
                     getHtmlContent(lesson.content_type, course_info.course_id, lesson.content_id, lesson.section_id, file_name, save_path);//lesson.json_content,
                  }
                  if (isSaveZip && lesson.json_content != null) {
                     sendDownloadTaskToAria2('https://mooc.study.163.com/course/attachment.htm?fileName=' + lesson.json_content.fileName + '&nosKey=' + lesson.json_content.nosKey, file_name + '_' + lesson.json_content.fileName, save_path);
                  }
                  if (isMarkAsLearned) {
                     mark_htm_as_learned(lesson);
                  }
               } else if (lesson.content_type == '6') {//6 讨论 htm
                  if (isSaveHtm) {
                     get_discuss_htm_content(lesson.content_type, course_info.course_id, lesson.content_id, lesson.section_id, file_name, save_path);//lesson.json_content,
                  }
                  if (isMarkAsLearned) {
                     mark_htm_as_learned(lesson);
                  }
               }
            });
         });
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
         "c0-param0": "Object_Object:{unitId:reference:c0-e1,pageNum:reference:c0-e2}",// + content_type,
         "batchId": timestamp
      };
      $.ajax({
         url: 'https://mooc.study.163.com/dwr/call/plaincall/CourseBean.saveMocContentLearn.dwr?' + timestamp,
         method: 'POST',
         async: true,
         data: params,
         success: function (response) {
            //mylog(lesson.section_id + lesson.section_name + ' ppt mark as learned!->' + response);
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
         "c0-param0": "Object_Object:{unitId:reference:c0-e1,finished:reference:c0-e2}",// + content_type,
         "batchId": timestamp
      };
      $.ajax({
         url: 'https://mooc.study.163.com/dwr/call/plaincall/CourseBean.saveMocContentLearn.dwr?' + timestamp,
         method: 'POST',
         async: true,
         data: params,
         success: function (response) {
            //mylog(lesson.section_id + lesson.section_name + 'htm mark as learned!->' + response);
         }
      });
   }

   //标记视频已经完成学习
   function mark_video_as_learned(duration, lesson) {//course_id, content_id,file_name, save_path
      var timestamp = new Date().getTime();
      var params = {
         "callCount": "1",
         "scriptSessionId": "${scriptSessionId}190",
         "httpSessionId": sessionId,
         "c0-scriptName": "CourseBean",
         "c0-methodName": "saveMocContentLearn",
         "c0-id": "0",
         "c0-e1": "number:" + lesson.section_id,//course_id,
         "c0-e2": "number:" + duration,// + content_id,videoTime=545
         "c0-e3": "boolean:true",// + content_id,
         "c0-param0": "Object_Object:{unitId:reference:c0-e1,videoTime:reference:c0-e2,finished:reference:c0-e3}",// + content_type,
         "batchId": timestamp
      };
      $.ajax({
         url: 'https://mooc.study.163.com/dwr/call/plaincall/CourseBean.saveMocContentLearn.dwr?' + timestamp,
         method: 'POST',
         async: true,
         data: params,
         success: function (response) {
            //mylog(lesson.section_id + lesson.section_name + 'vedio mark as learned!->' + response);
         }
      });
   }
   //获取文档下载地址
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
         url: 'https://mooc.study.163.com/dwr/call/plaincall/CourseBean.getLessonUnitLearnVo.dwr?' + timestamp,
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

   function obj2str(o) //obj -> json string
   {
      var r = [];
      if (typeof o == "string" || o == null) {
         return o;
      }
      if (typeof o == "object") {
         if (!o.sort) {
            r[0] = "{"
            for (var i in o) {
               r[r.length] = i;
               r[r.length] = ":";
               r[r.length] = obj2str(o[i]);
               r[r.length] = ",";
            }
            r[r.length - 1] = "}"
         } else {
            r[0] = "["
            for (var j = 0; j < o.length; j++) {
               r[r.length] = obj2str(o[j]);
               r[r.length] = ",";
            }
            r[r.length - 1] = "]"
         }
         return r.join("");
      }
      return o.toString();
   }

   //获取文档下载地址
   function getCourseContentUrl(content_type, course_id, content_id, lesson, file_name, save_path) {
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
         "c0-param4": "number:" + lesson.section_id,
         "batchId": timestamp
      };
      $.ajax({
         url: 'https://mooc.study.163.com/dwr/call/plaincall/CourseBean.getLessonUnitLearnVo.dwr?' + timestamp,
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

   //获取视频信息
   function getVideoToken(content_type, course_id, content_id, lesson, file_name, save_path) {
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
         "c0-param4": "number:" + lesson.section_id,
         "batchId": timestamp
      };
      $.ajax({
         url: 'https://mooc.study.163.com/dwr/call/plaincall/CourseBean.getLessonUnitLearnVo.dwr?' + timestamp,
         method: 'POST',
         async: true,
         data: params,
         success: function (response) {
            var signature_id_info = response.match(/s0.duration=(.*?);.*?s0.signature="(.*?)";.*?s0.videoId=(.*?);/);
            var video_duration = signature_id_info[1];
            var video_signature = signature_id_info[2];
            var video_id = signature_id_info[3];
            getVideoUrl(content_id, video_signature, file_name, save_path);//video_id = content_id
            if (isMarkAsLearned) {
               mark_video_as_learned(video_duration, lesson);
            }
         }
      });
   }

   //获取视频下载地址
   function getVideoUrl(videoId, signature, file_name, save_path) {
      var params = {
         'videoId': videoId,
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
               //if (video_download_url != "")
               var qualityString = ".";
               switch (video_url_list[0].video_quality) {
                  case 1: qualityString = ".sd"; break;
                  case 2: qualityString = ".hd"; break;
                  case 3: qualityString = ".shd"; break;
               }
               if (video_format == 'hls') {
                  video_format = 'm3u8';
               }
               //mylog(video_download_url);
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