// ==UserScript==
// @name:en           Study163FreeLess ADown
// @name              Vedio FreeLess ADown下载助手
// @namespace         https://www.cnblogs.com/Chary/
// @version           2019.06.22
// @description       将视频下载到本地学习
// @description:en    add download button on study.163.com Html Header to download videos
// @author            CharyGao
// @require           https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require           https://cdn.bootcss.com/crypto-js/3.1.9-1/crypto-js.min.js
// @match             https://study.163.com/course/courseMain.htm?*courseId=*
// @grant             unsafeWindow
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @grant             GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/386657/Vedio%20FreeLess%20ADown%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/386657/Vedio%20FreeLess%20ADown%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var log_count = 1;

    var video_quality = 2; //视频清晰度
    var video_format = 'mp4'; //视频格式
    var video_download_url = ""; //视频下载地址

    var course_info = {
        'course_id': {},
        'course_name': {},
        'chapter_info': [],
        'course_price': {}, //价格
        'course_duration': {} //课程时长
    }; //课程信息

    var cookies = document.cookie;
    var match_cookie = cookies.match(/NTESSTUDYSI=(\w+)/)[1];

    //自定义 log 函数
    function mylog(param1, param2) {
        param1 = param1 ? param1 : "";
        param2 = param2 ? param2 : "";
        console.log("#" + log_count++ + "ADown:", param1, param2);
    }

    setTimeout(function() {
        getCourseInfo(); //1.获取课程信息
        loadSetting(); //2.加载个人设置
        addDownloadAssistant(); //3.添加下载助手按钮
        addDownloadButton(); //4.添加单个下载按钮
        showTextArea();
        $("#Study163FreeLessAdownTextDiv").hide();
        mylog("Study.163.com FreeLess ADown加载完成~ aria2c --input-file=");
    }, 5000); //页面加载完成后延时2秒执行



    // 添加下载按钮
    function addDownloadButton() {
        var ksbtn = document.getElementsByClassName('ksbtn')[0];
        var ksbtn_style = 'display:' + getStyle(ksbtn, 'display') + ';width:' + getStyle(ksbtn, 'width') + ';background-position:' + getStyle(ksbtn, 'background-position') + ';margin-top:' + getStyle(ksbtn, 'margin-top') + ';';
        var ksbtn_span = ksbtn.firstChild;
        var ksbtn_span_style = 'display:' + getStyle(ksbtn_span, 'display') + ';text-align:' + getStyle(ksbtn_span, 'text-align') + ';background:' + getStyle(ksbtn_span, 'background') +
            ';width:' + getStyle(ksbtn_span, 'width') + ';font-size:' + getStyle(ksbtn_span, 'font-size') + ';height:' + getStyle(ksbtn_span, 'height') + ';line-height:' +
            getStyle(ksbtn_span, 'line-height') + ';color:' + getStyle(ksbtn_span, 'color') + ';background-position:' + getStyle(ksbtn_span, 'background-position') + ';';
        var allNodes = document.getElementsByClassName("section");
        for (var i = 0; i < allNodes.length; i++) {
            var download_button = document.createElement("a");
            var style = 'display:block;text-align:center;padding-left:10px;width:58px;font-size:12px;height:34px;line-height:33px;color:#fff;background-position:-40px 0px;';
            download_button.innerHTML = "<span>下载</span>";
            download_button.className = "f-fr j-hovershow download-button";
            download_button.style = ksbtn_style;
            download_button.lastChild.style = ksbtn_span_style;
            allNodes[i].appendChild(download_button);
        }
        $('.download-button').each(function() { //下载按钮点击事件
            $(this).click(function(event) {
                loadSetting();

                var data_chapter = event.target.parentNode.parentNode.getAttribute("data-chapter");
                var data_lesson = event.target.parentNode.parentNode.getAttribute("data-lesson");
                var index = Number(data_lesson);
                for (var i = 0; i < Number(data_chapter); i++) {
                    index = index - course_info.chapter_info[i].lesson_info.length;
                }
                var lesson = course_info.chapter_info[data_chapter].lesson_info[index];
                mylog("选择的课为【lesson_name: " + lesson.lesson_name + ",lesson_id: " + lesson.lesson_id + ",lesson_type: " + lesson.lesson_type + '】');
                var file_name = lesson.keshi + '_' + lesson.lesson_name;
                var save_path = course_info.course_name + '-章节' + (Number(data_chapter) + 1) + '_' + course_info.chapter_info[data_chapter].chapter_name;
                if (lesson.lesson_type == '2') { //2 视频
                    getVideoLearnInfo(lesson, file_name, save_path);
                } else if (lesson.lesson_type == "3") { //3 文档
                    getTextLearnInfo(lesson, file_name, save_path);
                } else {
                    mylog('error:' + file_name, lesson);
                }

                event.stopPropagation();
            });
        });
    }


    //#region 加解密

    var charListMap = {
        v_0: [
            { table: 1, item: 2 }, { table: 3, item: 9 }, { table: 3, item: 7 }, { table: 3, item: 2 },
            { table: 1, item: 0 }, { table: 1, item: 4 }, { table: 1, item: 2 }, { table: 3, item: 1 },
            { table: 3, item: 1 }, { table: 3, item: 8 }, { table: 1, item: 5 }, { table: 1, item: 4 },
            { table: 1, item: 4 }, { table: 3, item: 6 }, { table: 3, item: 9 }, { table: 1, item: 5 }
        ],
        v_1: [
            { table: 3, item: 3 }, { table: 1, item: 5 }, { table: 1, item: 15 }, { table: 3, item: 4 },
            { table: 1, item: 23 }, { table: 1, item: 18 }, { table: 3, item: 9 }, { table: 3, item: 2 },
            { table: 3, item: 2 }, { table: 1, item: 14 }, { table: 1, item: 20 }, { table: 1, item: 22 },
            { table: 3, item: 5 }, { table: 1, item: 16 }, { table: 3, item: 7 }, { table: 3, item: 2 }
        ],
        v_2: [
            { table: 2, item: 16 }, { table: 2, item: 7 }, { table: 1, item: 7 }, { table: 2, item: 24 },
            { table: 1, item: 17 }, { table: 2, item: 4 }, { table: 1, item: 4 }, { table: 2, item: 18 },
            { table: 2, item: 12 }, { table: 2, item: 5 }, { table: 2, item: 18 }, { table: 2, item: 4 },
            { table: 1, item: 0 }, { table: 2, item: 22 }, { table: 1, item: 11 }, { table: 2, item: 6 }
        ],
        v_3: [
            { table: 2, item: 18 }, { table: 1, item: 4 }, { table: 1, item: 7 }, { table: 2, item: 24 },
            { table: 1, item: 17 }, { table: 2, item: 15 }, { table: 1, item: 4 }, { table: 2, item: 18 },
            { table: 1, item: 11 }, { table: 2, item: 5 }, { table: 2, item: 18 }, { table: 1, item: 14 },
            { table: 1, item: 0 }, { table: 2, item: 22 }, { table: 1, item: 11 }, { table: 3, item: 5 }
        ]
    };


    var charEnlist1 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    var charEnlist2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var charEnlist3 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];


    function loadMatrixPassword(v) {
        let matrixStr = "";
        charListMap["v_" + v].forEach(function(item) {
            matrixStr += eval("charEnlist" + (item.table))[item.item];
        });
        return matrixStr
    }

    function stringToUintArray(cipherStr) {
        let uint8Array = new Uint8Array(new ArrayBuffer(cipherStr.length));
        for (let index = 0; index < cipherStr.length; index++)
            uint8Array[index] = cipherStr.charCodeAt(index); //方法可返回指定位置的字符的 Unicode 编码
        return uint8Array;
    }

    function parseStrToArray(str) {
        let arrayBinary = atob(str);
        let uint8Array = new Uint8Array(arrayBinary.length);
        Array.prototype.forEach.call(arrayBinary, function(str, arrayBinary) {
            uint8Array[arrayBinary] = str.charCodeAt(0); //方法可返回指定位置的字符的 Unicode 编码
        });
        return uint8Array;
    }

    function mapToArray(e) {
        return btoa(Array.prototype.map.call(e, function(e) {
            return String.fromCharCode(e) //Unicode 值，然后返回一个字符串。
        }).join(""));
    }

    function decryptAES(orgKey, matrixVersion) {
        let cipher = loadMatrixPassword(matrixVersion);
        let orgKeyArray = parseStrToArray(orgKey);
        let key = CryptoJS.enc.Base64.parse(mapToArray(stringToUintArray(cipher)));
        let iv = CryptoJS.enc.Base64.parse(mapToArray(new Uint8Array(orgKeyArray.buffer, 0, 16)));

        let cipherTextBase64Str = CryptoJS.enc.Base64.parse(mapToArray(new Uint8Array(orgKeyArray.buffer, 16, orgKeyArray.length - 16)));
        try {
            return JSON.parse(CryptoJS.AES.decrypt({ ciphertext: cipherTextBase64Str }, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }).toString(CryptoJS.enc.Utf8));
        } catch (g) {
            document.write("error:" + g + "<br />");
        }
    }


    function generateUrl(e, t) {
        t = t.replace(/(^\/\/)|(^http:\/\/)|(^https:\/\/)/, window.location.protocol + "//");
        if (e.indexOf("?") != -1)
            return e + "&token=" + encodeURIComponent(t) + "&t=" + (new Date).getTime();
        else
            return e + "?token=" + encodeURIComponent(t) + "&t=" + (new Date).getTime()
    }
    //#endregion 加解密
    function showTextArea() {
        if (document.querySelector('#Study163FreeLessAdownTextDiv') == null) {
            var container = document.createElement("div");
            container.id = "Study163FreeLessAdownTextDiv";
            container.style = "width: 100%;position: fixed; z-index: 999998;top: 20%; height: 80%; background: black; color: red;";
            container.innerHTML =
                '<textarea id="Study163FreeLessAdownTextArea" readonly="readonly" style="width: 98%; margin: 0 20px 10px 0;height: 98%; background: black; color: green; border: 1px solid red;"></textarea>'
            document.body.appendChild(container);
        } else {
            $('#Study163FreeLessAdownTextDiv').show();
        }
    }

    //1.获取课程信息
    function getCourseInfo() {
        var courseVo = unsafeWindow.courseVo;
        mylog(courseVo);
        course_info.course_id = courseVo.id; //课程 id
        course_info.course_name = courseVo.name.replace(/:|\?|\*|"|<|>|\|/g, " "); //课程名称
        course_info.course_price = courseVo.price; //课程价格
        var chapter = courseVo.chapterDtos; //课程章节
        var allSeconds = 0; //课程总时长，单位为秒
        chapter.forEach(function(chapterCourse, chapterCourseindex) {
            var chapter = {
                'chapter_id': chapterCourse.id,
                'chapter_name': chapterCourse.name.replace(/:|\?|\*|"|<|>|\|/g, " "),
                'lesson_info': []
            }; //章节信息
            var lessonDtos = chapterCourse.lessonDtos;
            lessonDtos.forEach(function(val, index) {
                var lesson = {
                    'keshi': val.ksstr,
                    'lesson_id': val.id,
                    'lesson_name': val.lessonName.replace(/:|\?|\*|"|<|>|\|/g, " "),
                    'lesson_type': val.lessonType
                }; //课时信息
                if (val.videoTime) {
                    var videoTime = val.videoTime.split(':');
                    if (videoTime.length == 3) {
                        allSeconds += parseInt(videoTime[0]) * 3600 + parseInt(videoTime[1]) * 60 + parseInt(videoTime[2]);
                    } else if (videoTime.length == 2) {
                        allSeconds += parseInt(videoTime[0]) * 60 + parseInt(videoTime[1]);
                    } else if (videoTime.length == 1) {
                        allSeconds += parseInt(videoTime[0]);
                    }
                }
                chapter.lesson_info.push(lesson);
            });
            course_info.chapter_info.push(chapter);
        });
        var formatTime = {
            'hour': 0,
            'minute': 0,
            'second': 0
        };
        formatTime.hour = parseInt(allSeconds / 3600);
        formatTime.minute = parseInt(allSeconds % 3600 / 60);
        formatTime.second = parseInt(allSeconds % 3600 % 60);
        if (formatTime.hour) {
            course_info.course_duration = formatTime.hour + "小时" + formatTime.minute + "分" + formatTime.second + "秒";
        } else if (formatTime.minute) {
            course_info.course_duration = formatTime.minute + "分" + formatTime.second + "秒";
        } else if (formatTime.second) {
            course_info.course_duration = formatTime.second + "秒";
        }
        mylog(course_info);
    }
    //2.加载个人设置
    function loadSetting() {
        video_quality = GM_getValue('video_quality', 2);
        video_format = GM_getValue('video_format', 'mp4');
    }
    //3.添加下载助手按钮
    function addDownloadAssistant() {
        var download_assistant_div = $("<div class='m-nav_item_Adown' style='text-align: center;'></div>"); //Title
        var assistant_div = $("<div style='display:none;background-color:black;width:auto;'></div>"); //下拉列表
        var assistant_show_text = $("<span>Adown↓</span>"); //批量下载按钮
        var assistant_batch_download = $("<div><a>批量下载</a></div>"); //批量下载按钮
        var assistant_setting = $("<div><a>设置</a><div>"); //设置按钮
        assistant_div.append(assistant_batch_download).append(assistant_setting); //拼装下拉菜单
        download_assistant_div.append(assistant_show_text).append(assistant_div); //拼装下载列表按钮
        $('.mn-userinfo_download').prepend(download_assistant_div); //挂接到header上
        download_assistant_div.mouseover(function() {
            assistant_div.show();
        });
        download_assistant_div.mouseout(function() {
            assistant_div.hide();
        });
        assistant_batch_download.click(function() {
            assistant_div.hide();
            loadSetting();
            batchDownload();
        });
        assistant_setting.click(function() {
            assistant_div.hide();
            showSetting();
        });
        assistant_show_text.click(function() {
            $("#Study163FreeLessAdownTextDiv").toggle();
        });
    }

    //3.1批量下载
    function batchDownload() {
        course_info.chapter_info.forEach(function(chapter, index) {
            chapter.lesson_info.forEach(function(lesson) {
                var file_name = lesson.keshi + '_' + lesson.lesson_name;
                var save_path = course_info.course_name + '-章节' + (index + 1) + '_' + chapter.chapter_name;
                if (lesson.lesson_type == '2') { //2 视频
                    getVideoLearnInfo(lesson, file_name, save_path);
                } else if (lesson.lesson_type == "3") { //3 文档
                    getTextLearnInfo(lesson, file_name, save_path);
                } else {
                    mylog('error:' + file_name, lesson);
                }
            });
        });
    }

    /** 
     * 设置select控件选中 
     * @param selectId select的id值 
     * @param checkValue 选中option的值 
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

    //3.2打开设置
    function showSetting() {
        if (document.querySelector('#dl-setting') == null) {
            var container = document.createElement("div");
            container.id = "dl-setting";
            container.style = "position: fixed; z-index: 999999; top: 20%; right: 100px; width: 250px; height: auto; background: black; padding: 10px; color: white; font-size: 14px; border: 1px solid red;";
            container.innerHTML =
                '<div style="line-height:22px;"><p style="text-align:center;font-size:16px;">下载设置</p>' +
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
                '<span style="float: right;">' +
                '<input type="button" value="取消" id="cancel_button"> | ' +
                '<input type="button" value="保存" id="save_button"></span></div></div>';
            document.body.appendChild(container);
        } else {
            loadSetting();
            set_select_checked_value('video_quality', video_quality, true); //设置清晰度 显示值
            set_select_checked_value('video_format', video_format, true); //设置格式 显示值
            $('#dl-setting').show();
        }
        $('#save_button').click(function() {
            GM_setValue('video_quality', $('#video_quality option:selected').val());
            GM_setValue('video_format', $('#video_format option:selected').val());
            $('#dl-setting').hide();
        });
        $('#cancel_button').click(function() {
            $('#dl-setting').hide();
        });
    }

    //5.1 获取文档下载地址
    function getTextLearnInfo(lesson, file_name, save_path) {
        var timestamp = new Date().getTime();
        var params = {
            "callCount": "1",
            "scriptSessionId": "${scriptSessionId}190",
            "httpSessionId": match_cookie,
            "c0-scriptName": "LessonLearnBean",
            "c0-methodName": "getTextLearnInfo",
            "c0-id": "0",
            "c0-param0": "string:" + lesson.lesson_id,
            "c0-param1": "string:" + course_info.course_id,
            "batchId": timestamp
        };
        var url = "https://study.163.com/dwr/call/plaincall/LessonLearnBean.getTextLearnInfo.dwr?" + timestamp;
        $.ajax({
            url: url,
            method: 'POST',
            async: true,
            data: params,
            success: function(response) {
                var pdfUrl = response.match(/pdfUrl:"(.*?)"/)[1];
                sendDownloadTaskToAria2(pdfUrl, file_name + ".pdf", save_path);
            }
        });
    }

    //5.2获取视频文件信息
    function getVideoLearnInfo(lesson, file_name, save_path) {
        var timestamp = new Date().getTime();
        var params = {
            "callCount": "1",
            "scriptSessionId": "${scriptSessionId}190",
            "httpSessionId": match_cookie,
            "c0-scriptName": "LessonLearnBean",
            "c0-methodName": "getVideoLearnInfo",
            "c0-id": "0",
            "c0-param0": "string:" + lesson.lesson_id,
            "c0-param1": "string:" + course_info.course_id,
            "batchId": timestamp
        };
        var url = "https://study.163.com/dwr/call/plaincall/LessonLearnBean.getVideoLearnInfo.dwr?" + timestamp;
        $.ajax({
            url: url,
            method: 'POST',
            async: true,
            data: params,
            success: function(response) {
                var signature = response.match(/signature="(\w+?)";/)[1];
                var videoId = response.match(/videoId=(\w+?);/)[1];
                //mylog(file_name, response);
                getVideoUrl(videoId, signature, file_name, save_path);
            }
        });
    }

    //5.2.1获取视频下载地址
    function getVideoUrl(videoId, signature, file_name, save_path) {
        var params = {
            'videoId': videoId,
            'signature': signature,
            'clientType': '1'
        };
        $.ajax({
            url: "https://vod.study.163.com/eds/api/v1/vod/video",
            method: 'POST',
            async: true,
            data: params,
            success: function(response) {
                var videoUrls = response.result.videos;
                var video_url_list = [];
                var video_url_back_OtherFormat = {};
                var thisDownLoadResponseResultVideoId = response.result.videoId;
                videoUrls.forEach(function(video) {
                    if (video.format == video_format && video.quality == video_quality) {
                        video_url_list.push({ 'video_format': video.format, 'video_quality': video.quality, 'video_url': video.videoUrl, 'k': video.k, 'v': video.v });
                    }
                    if (video.format == 'hls' && video.quality == video_quality) {
                        video_url_back_OtherFormat = { 'video_format': video.format, 'video_quality': video.quality, 'video_url': video.videoUrl, 'k': video.k, 'v': video.v };
                    }
                });
                if (video_url_list.length < 1) {
                    video_url_list.push(video_url_back_OtherFormat);
                    //没有MP4下flv
                    mylog('hls替代：' + file_name, response.result);
                }
                video_download_url = video_url_list[0].video_url.replace(/http:\/\//g, 'https://');
                var qualityString = ".";
                var this_video_format = video_url_list[0].video_format;
                switch (video_url_list[0].video_quality) {
                    case 1:
                        qualityString = ".sd";
                        break;
                    case 2:
                        qualityString = ".hd";
                        break;
                    case 3:
                        qualityString = ".shd";
                        break;
                }
                if (this_video_format == 'hls') {
                    //this_video_format = 'm3u8'; //hls调用m3u8
                    sendDownloadTextToM3u8(video_download_url, file_name + qualityString + '.' + this_video_format, save_path, video_url_list[0]);
                } else { //mp4G调用aira2
                    sendDownloadTaskToAria2(video_download_url, file_name + qualityString + '.' + this_video_format, save_path);
                }

            }
        });
    }
    //6.将下载链接发送到 Aria2 下载
    function sendDownloadTaskToAria2(download_url, file_name, save_path) {
        var fileFullName = save_path + '-' + file_name;
        // $('#Study163FreeLessAdownTextArea').append(download_url + '\n dir=output\n out=' + fileFullName + '\n');
        //return;
        var json_rpc = {
            id: '',
            jsonrpc: '2.0',
            method: 'aria2.addUri',
            params: [
                [download_url],
                {
                    dir: 'output',
                    out: fileFullName
                }
            ]
        };
        GM_xmlhttpRequest({
            url: "http://127.0.0.1:6800/jsonrpc", //Aria2 地址
            method: 'POST',
            data: JSON.stringify(json_rpc),
            onerror: function(response) {
                mylog(response);
            },
            onload: function(response) {
                mylog(response);
            }
        });
    }

    //6. 将下载链接发送到 M3u8 下载
    function sendDownloadTextToM3u8(download_url, file_name, save_path, e) {
        //mylog(download_url + '\n\t' + save_path + '-' + file_name + '\n');
        //console.log(download_url + '\n dir=' + save_path + '\n out=' + file_name+'\n');
        //展平处理//var fileFullName 
        // var timestamp = new Date().getTime();
        let decryptAESstr = decryptAES(e.k, e.v);


        var fileFullName = save_path + '-' + file_name;
        $('#Study163FreeLessAdownTextArea').append(fileFullName + ',' + download_url + '&token=' +
            generateUrl(e.video_url, decryptAESstr.k)
            // 'https%3A%2F%2Fvod.study.163.com%2Feds%2Fapi%2Fv1%2Fvod%2Fhls%2Fkey%3Fid%3D' + responsedVideoId +
            // '%26token%3D' + keyOrg + '&t=' + timestamp
            +
            '\n');
    }

    //获取元素样式
    function getStyle(element, cssPropertyName) {
        if (window.getComputedStyle) { //如果支持getComputedStyle属性（IE9及以上，ie9以下不兼容）
            return window.getComputedStyle(element)[cssPropertyName];
        } else { //如果支持currentStyle（IE9以下使用），返回
            return element.currentStyle[cssPropertyName];
        }
    }

})();