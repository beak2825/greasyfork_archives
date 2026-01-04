// ==UserScript==
// @name         DownloadHelp
// @version      1.0.0
// @description    为网易云课堂添加下载
// @compatible   chrome
// @license      MIT
// @require           https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @match             *://study.163.com/course/courseMain.htm?courseId=*
// @grant             unsafeWindow
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @grant             GM_openInTab
// @namespace https://greasyfork.org/users/249131
// @downloadURL https://update.greasyfork.org/scripts/378204/DownloadHelp.user.js
// @updateURL https://update.greasyfork.org/scripts/378204/DownloadHelp.meta.js
// ==/UserScript==

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
var course_info = { 'course_id': {}, 'course_name': {}, 'chapter_info': [], 'course_price': {}, 'course_duration': {} }; //课程信息
var cookies = document.cookie;
var match_cookie = cookies.match(/NTESSTUDYSI=(\w+)/)[1];
const mylog = console.log.bind(console);

setTimeout(function () {
    if (!getCourseInfo()) {
        return;
    }
    loadSetting();
    addDownloadAssistant();
    addDownloadButton();
    mylog("网易云课堂下载助手加载完成~");
}, 5000); //页面加载完成后延时5秒执行

function getCourseInfo() {
    let courseVo = unsafeWindow.courseVo;
    course_info.course_id = courseVo.id;
    course_info.course_name = courseVo.name.replace(/:|\?|\*|"|<|>|\|/g, "");
    course_info.course_price = courseVo.price;
    let chapter = courseVo.chapterDtos;
    chapter.forEach(function (val, index) {
        let chapter = { 'chapter_id': val.id, 'chapter_name': val.name.replace(/:|\?|\*|"|<|>|\|/g, " "), 'lesson_info': [] };
        let lesson_info = val.lessonDtos;
        lessonDtos.forEach(function (val, index) {
            let lesson = { 'keshi': val.ksstr, 'lesson_id': val.id, 'lesson_name': val.name.replace(/:|\?|\*|"|<|>|\|/g, " "), 'lesson_type': val.lessonType };
            chapter.lesson_info.push(lesson);
        });
        course_info.chapter_info.push(chapter);
    });
    if (course_info.course_price > 0) {
        return false;
    } else {
        return true;
    }
}

function loadSetting() {
    video_quality = GM_getValue('video_quality', 2);
    video_format = GM_getValue('video_format', 'mp4');
    aria2_url = GM_getValue('aria2_url', 'http://127.0.0.1:6800/jsonrpc');
    course_save_path = GM_getValue('course_save_path', '');
}

function showSetting() {
    if (document.querySelector('#dl-setting') == null) {
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
            "<li>清晰度：<label title='高清'><input id='video-quality-2' name='video-quality' value='2' type='radio' style='margin:0 5px;'" + (video_quality == 2 ? "checked" : "") + "></input>高清</label>\n" +
            "<label title='标清' style='padding:0 5px;'><input id='video-quality-1' name='video-quality' value='1' type='radio' style='margin:0 5px;'" + (video_quality == 1 ? "checked" : "") + "></input>标清</label></li>\n" +
            "<li>格式：<label title='mp4' style='padding:0 0 0 14px;'><input id='video-format-mp4' name='video-format' value='mp4' type='radio' style='margin:0 5px;'" + (video_format == 'mp4' ? "checked" : "") + "></input>mp4</label>" +
            "<label title='flv' style='padding:0 5px;'><input id='video-format-flv' name='video-format' value='flv' type='radio' style='margin:0 5px 0 10px;'" + (video_format == 'flv' ? "checked" : "") + "></input>flv</label></li>" +
            "</ul>\n" +
            "<input type='button' value='取消' id='cancel_button' style='position:relative;float:left;border:1px solid #ccc;padding:0 2px;'></input>\n" +
            "<input type='button' value='保存' id='save_button' style='position:relative;float:right;border:1px solid #ccc;padding:0 2px;'></input>\n" +
            "</div>";
        document.body.appendChild(container);
    } else {
        loadSetting();
        if (video_quality == 2) {
            $('#video-quality-2').prop('checked', true);
        } else {
            $('#video-quality-1').prop('checked', true);
        }
        if (video_format == 'mp4') {
            $('#video-format-mp4').prop('checked', true);
        } else {
            $('#video-format-flv').prop('checked', true);
        }
        $('#aria2_url').value = aria2_url;
        $('#save_path').value = course_save_path;
        $('#dl-setting').show();
    }
    $('#save_button').click(function () {
        GM_setValue('video_quality', $('input[name="video-quality"]:checked').val());
        GM_setValue('video_format', $('input[name="video-format"]:checked').val());
        GM_setValue('aria2_url', $('input[name="aria2_url"]').val());
        GM_setValue('course_save_path', $('input[name="save_path"]').val());
        $('#dl-setting').hide();
    });
    $('#cancel_button').click(function () {
        $('#dl-setting').hide();
    });
}

function addDownloadButton() {
    let ksbtn = document.getElementsByClassName('ksbtn')[0];
    let ksbtn_style = 'display:' + getStyle(ksbtn, 'display') + ';width:' + getStyle(ksbtn, 'width') + ';background-position:' + getStyle(ksbtn, 'background-position') + ';margin-top:' + getStyle(ksbtn, 'margin-top') + ';';
    let ksbtn_span = ksbtn.firstChild;
    let ksbtn_span_style = 'display:' + getStyle(ksbtn_span, 'display') + ';text-align:' + getStyle(ksbtn_span, 'text-align') + ';background:' + getStyle(ksbtn_span, 'background') +
        ';width:' + getStyle(ksbtn_span, 'width') + ';font-size:' + getStyle(ksbtn_span, 'font-size') + ';height:' + getStyle(ksbtn_span, 'height') + ';line-height:' +
        getStyle(ksbtn_span, 'line-height') + ';color:' + getStyle(ksbtn_span, 'color') + ';background-position:' + getStyle(ksbtn_span, 'background-position') + ';';
    let allNodes = document.getElementsByClassName("section");
    for (let i = 0; i < allNodes.length; i++) {
        let download_button = document.createElement("a");
        let style = 'display:block;text-align:center;padding-left:10px;width:58px;font-size:12px;height:34px;line-height:33px;color:#fff;background-position:-40px 0px;';
        download_button.innerHTML = '<span>下载</span>';
        download_button.className = 'f-fr j-hovershow download-button';
        download_button.style = ksbtn_style;
        download_button.lastChild.style = ksbtn_span_style;
        allNodes[i].appendChild(download_button);
    }
    $('.download-button').each(function () {
        $(this).click(function (event) {
            loadSetting();
            if (course_save_path == "") {
                alert("请到下载助手的设置里面填写文件保存位置");
            } else if (aria2_url == "") {
                alert("请到下载助手的设置里面填写Aria2位置");
            } else {
                let data_chapter = event.target.parentNode.getAttribute("data-chapter");
                let data_lesson = event.target.parentNode.getAttribute("data-lesson");
                let index = Number(data_lesson);
                for (let i = 0; i < Number(data_chapter); i++) {
                    index = index - course_info.chapter_info[i].lesson_info.length;
                };
                let lesson = course_info.chapter_info[data_chapter].lesson_info[index];
                mylog("选择的课为【lesson_name: " + lesson.lesson_name + ",lesson_id: " + lesson.lesson_id + ",lesson_type: " + lesson.lesson_type + '】');
                var file_name = lesson.keshi + '_' + lesson.lesson_name;
                var save_path = course_save_path.replace(/\\/g, '\/') + '/' + course_info.course_name + '/章节' + (Number(data_chapter) + 1) + '_' + course_info.chapter_info[data_chapter].chapter_name;
                if (lesson.lesson_type == "3") {
                    getTextLearnInfo(lesson, file_name, save_path);
                } else {
                    getVideoLearnInfo(lesson, file_name, save_path);
                }
            }
            event.stopPropagation();
        });
    });
}

function getStyle(element, cssPropertyName) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(element)[cssPropertyName];
    } else {//IE9以下使用
        return element.currentStyle[cssPropertyName];
    }
}


function getTextLearnInfo(lesson, file_name, save_path) {
    let timestamp = new Date().getTime();
    let params = {
        "callCount": "1",
        "scriptSessionId": "${scriptSessionID}190",
        "httpSessionId": match_cookie,
        "c0-scriptName": "lessonLearnBean",
        "c0-methodName": "getTextLearnInfo",
        "c0-id": "0",
        "c0-param0": "string" + lesson.lesson_id,
        "c0-param1": "string" + course_info.course_id,
        "batchId": timestamp
    };
    let url = "https://study.163.com/dwr/call/plaincall/LessonLearnBean.getTextLearnInfo.dwr?" + timestamp;
    $.ajax({
        url: url,
        method: "POST",
        async: true,
        data: params,
        success: function (response) {
            let pdfUrl = response.match(/pdfUrl:"(.*?)"/)[1];
            sendDownloadTaskToAria2(pdfUrl, file_name + ".pdf", save_path);
        }
    });
}

function getVideoLearnInfo(videoId, signature, file_name, save_path) {
    let params = {
        "videoId": videoId,
        "signature": signature,
        "clientType": "1"
    };
    $.ajax({
        url: "https://vod.study.163.com/eds/api/v1/vod/viedo",
        method: "POST",
        async: true,
        data: params,
        success: function (response) {
            let videoUrls = response.result.videos;
            let video_url_list = [];
            videoUrls.forEach(function (video) {
                if (video.format == video_format) {
                    video_url_list.push({
                        "video_format": video.format, 'video_quality': video.quality, 'video_url': video.videoUrl
                    });
                };
            });
            if (video_url_list.length != 0) {
                if (video_quality == "2") {
                    video_download_url = video_url_list[video_url_list.length - 1];
                } else {
                    video_download_url = video_url_list[0].video_url;
                }
            }
            if (video_download_url !== "") {
                mylog(video_download_url);
                sendDownloadTaskToAria2(video_download_url, file_name + "." + video_format, save_path);
            }
        }
    });
}

function sendDownloadTaskToAria2(download_url, file_name, save_path) {
    let json_rpc = {
        id: "",
        jsonrpc: "2.0",
        method: "aria2.addUrl",
        params: [
            [download_url], { dir: save_path, out: file_name }
        ]
    };
    GM_xmlhttpRequest({
        url: aria2_url,
        method: "POST",
        data: JSON.stringify(json_rpc),
        onerror: function (response) {
            mylog(response);
        },
        onload: function (response) {
            mylog(response);
            if (!hasOpenAriac2Tab) {
                GM_openInTab("http://aria2c.com/", { active: true });
                hasOpenAriac2Tab = true;
            }
        }
    });
}

function addDownLoadAssistant() {
    $(".u-navsearchUI").css("width", "224px");
    let download_assistant_div = $("<div class= 'm-nav_item'></div>");
    let download_assistant = $("<span>下载助手</span>");
    let assistant_div = $("<div class='f-pa' style='line-height:40px;display:none;left:0px;top:60px;width:auto;height:auto;background-color:#fff;color:#666;border:1px solid #ddd;padding:5px 10px;text-align:center;'><div class='arrr f-pa' style='background:url(//s.stu.126.net/res/images/ui/ui_new_yktnav_sprite.png) 9999px 9999px no-repeat;top:-9px;left:40px;width:14px;height:9px;background-position:-187px 0;'></div></div>");
    let batch_download = $("<a>批量下载</a>");
    let assistant_setting = $("<a>设置</a>");
    assistant_div.append(batch_download).append(assistant_setting);
    download_assistant_div.append(download_assistant).append(assistant_div);
    $('.m-nav').append(download_assistant_div);
    download_assistant_div.mouseover(function () {
        assistant_div.show();
    });
    download_assistant_div.mouseout(function () {
        assistant_div.hide();
    });
    batch_download.click(function () {
        assistant_div.hide();
        loadSetting();
        if (course_save_path == '') {
            alert("请到下载助手的设置里面填写文件保存位置");
        } else if (aria2_url == "") {
            alert("请到下载助手的设置里面填写Aria2位置");
        } else {
            batchDownload();
        }
    });
    assistant_setting.click(function () {
        assistant_div.hide();
        showSetting();
    });
}

function batchDownload() {
    course_info.chapter_info.forEach(function (chapter, index) {
        chapter.lesson_info.forEach(function (lesson) {
            let file_name = lesson.keshi + '_' + lesson.lesson_name;
            let save_path = course_save_path.replace(/\\/g, '\/') + '/' + course_save_path;
            if (lesson.lesson_type == "3") {
                getTextLearnInfo(lesson, file_name, save_path);
            } else {
                getVideoLearnInfo(lesson, file_name, save_path);
            }
        });
    });
}