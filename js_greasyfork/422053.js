// ==UserScript==
// @name         B站助手
// @namespace    https://blog.imyqs.com/
// @version      0.5.1
// @description  一键下载B站的视频封面；一键下载B站的电影海报；一键复制视频AV/BV号；打开直播页自动进行签到
// @author       FrankYu
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://live.bilibili.com/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_download
// @grant        GM_notification
// @grant        GM_setClipboard
// @license      CC by-4.0
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/422053/B%E7%AB%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/422053/B%E7%AB%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 获取当前网页 URL
    var URL = window.location.href;

    /**
    * 0. 视频标题
    * 1. 视频标题_UP主
    * 2. UP主_视频标题
    * 3. 视频标题_UP主_分区
    * 4. 视频标题_分区_UP主
    * 5. UP主_视频标题_分区
    * 6. UP主_分区_视频标题
    * 7. 分区_UP主_视频标题
    * 8. 分区_视频标题_UP主
    */
    var video_Name_Type = 0;                    //下载的封面标题不同格式，默认为0，即只有视频名称，用户可根据需要自行修改为上方的
    var video_Name_Download = '';               //下载的封面标题名称

    var global_Download_URL = '';               //全局使用下载地址
    var global_Download_File_Name = '';         //全局使用下载文件名称

    // 延时1.5s，获取视频AV\BV号，防止因为网络问题导致的获取失败
    var v_num_A;
    var v_num_B;
    if(URL.indexOf('www.bilibili.com') != -1){
        setTimeout(() => {
            v_num_A = "AV" + aid;
            v_num_B = bvid;
        }, 1500);
    
    }

    if (URL.indexOf('video') != -1) {
        var v_pic = vd.pic;                 //视频封面地址
        var v_title = vd.title;             //标题
        var v_author = vd.owner.name;       //UP主
        var v_type = vd.tname;              //分区
        var v_suffix = vd.pic.split('.')[vd.pic.split('.').length - 1]; //视频封面后缀，jpg/png

        //下载文件名称可选
        switch (video_Name_Type) {
            case 0:
                video_Name_Download = v_title;
                break;
            case 1:
                video_Name_Download = v_title + '_' + v_author;
                break;
            case 2:
                video_Name_Download = v_author + '_' + v_title;
                break;
            case 3:
                video_Name_Download = v_title + '_' + v_author + '_' + v_type;
                break;
            case 4:
                video_Name_Download = v_title + '_' + v_type + '_' + v_author;
                break;
            case 5:
                video_Name_Download = v_author + '_' + v_title + '_' + v_type;
                break;
            case 6:
                video_Name_Download = v_author + '_' + v_type + '_' + v_title;
                break;
            case 7:
                video_Name_Download = v_type + '_' + v_author + '_' + v_title;
                break;
            case 8:
                video_Name_Download = v_type + '_' + v_title + '_' + v_author;
                break;
            default:
                // 如果用户修改视频名称的类型错误，则默认为“仅标题”
                console.log('视频名称类型错误');
                video_Name_Download = v_title;
                break;
        }

        //延迟3秒启动，防止页面刷新取消掉按钮。
        setTimeout(() => {

            //添加下载封面和复制AV/BV号的按钮
            $('div.video-data').append('<span>'
                + '<a style="margin:0px 5px 0px 5px;padding:0px 10px 0px 10px;background-color:#00A7D8;border:1px solid #00A7D8;color:white;border-radius:20px;cursor:pointer;" id="down_pic" title="点击下载该视频封面">下载封面</a>'
                + '<a style="margin:0px 5px 0px 5px;padding:0px 10px 0px 10px;background-color:#00A7D8;border:1px solid #00A7D8;color:white;border-radius:20px;cursor:pointer;" id="copy_AV" title="点击复制该视频AV号到剪切板">复制AV号</a>'
                + '<a style="margin:0px 5px 0px 5px;padding:0px 10px 0px 10px;background-color:#00A7D8;border:1px solid #00A7D8;color:white;border-radius:20px;cursor:pointer;" id="copy_BV" title="点击复制该视频BV号到剪切板">复制BV号</a>'
                + '</span>');

            //复制AV号
            $('a#copy_AV').click(function (e) {
                copy_Number(v_num_A);
            });

            //复制BV号
            $('a#copy_BV').click(function (e) {
                copy_Number(v_num_B);
            });
        }, 2500);

        //鼠标移入移出动画
        setTimeout(() => {
            //下载按钮移入
            $("a#down_pic").mouseover(function () {
                $("a#down_pic").css("background-color", "#43BBDF");
            });
            //下载按钮移出
            $("a#down_pic").mouseout(function () {
                $("a#down_pic").css("background-color", "#00A7D8");
            });
            //复制AV号按钮移入
            $("a#copy_AV").mouseover(function () {
                $("a#copy_AV").css("background-color", "#43BBDF");
            });
            //复制AV号按钮移出
            $("a#copy_AV").mouseout(function () {
                $("a#copy_AV").css("background-color", "#00A7D8");
            });
            //复制BV号按钮移入
            $("a#copy_BV").mouseover(function () {
                $("a#copy_BV").css("background-color", "#43BBDF");
            });
            //复制BV号按钮移出
            $("a#copy_BV").mouseout(function () {
                $("a#copy_BV").css("background-color", "#00A7D8");
            });

        }, 3000);

        //下载封面
        $("body").on("click", "#down_pic", function () {
            global_Download_URL = v_pic;   //获取下载链接
            global_Download_File_Name = video_Name_Download + '.' + v_suffix;   //获取下载文件的后缀
            download_Pic();
        });

        //刷新一次页面，更新信息
        $('div.card-box > div.info > a').click(function (e) {
            location.reload();
        });

    } else if (URL.indexOf('bangumi/play') != -1) {
        //定义
        var m_poster;
        var m_title;
        var m_poster_suffix;

        /*每秒检测两次是否可以下载，如果可以下载则开启下载并停止检测 */
        var Detect_Download = setInterval(function () {
            if (typeof (md.cover) != "string") {
                console.log('暂时不能下载');
            } else {
                console.log('当前可以下载');
                kill_interval()     //停止检测
            }
        }, 500)

        // 停止检测
        function kill_interval() {
            clearInterval(Detect_Download);
            extend_start();     //开启下载模块
        }

        // 获取信息
        function get_Movie_info() {
            m_poster = md.cover;        //电影海报链接
            m_title = md.title;         //电影名称

            //海报文件后缀
            m_poster_suffix = m_poster.split('.')[m_poster.split('.').length - 1]
        }

        function extend_start() {

            get_Movie_info();

            //下载海报
            $("body").on("click", "#down_poster", function () {
                global_Download_URL = 'https:' + m_poster;   //获取下载链接
                global_Download_File_Name = m_title + '_海报.' + m_poster_suffix;
                download_Pic();
            });

            $('.plp-r').click(function (e) {
                setTimeout(function () {
                    get_Movie_info();
                }, 1000);

            });

            //延迟3秒启动，防止页面刷新取消掉按钮。
            setTimeout(() => {

                //添加下载海报和复制AV/BV号的按钮
                $('div.media-count').append('<span>'
                    + '<a style="margin:0px 5px 0px 5px;padding:0px 10px 0px 10px;background-color:#00A7D8;border:1px solid #00A7D8;color:white;border-radius:20px;cursor:pointer;" id="down_poster" title="点击下载该视频海报">下载海报</a>'
                    + '<a style="margin:0px 5px 0px 5px;padding:0px 10px 0px 10px;background-color:#00A7D8;border:1px solid #00A7D8;color:white;border-radius:20px;cursor:pointer;" id="copy_AV" title="点击复制该电影AV号到剪切板">复制AV号</a>'
                    + '<a style="margin:0px 5px 0px 5px;padding:0px 10px 0px 10px;background-color:#00A7D8;border:1px solid #00A7D8;color:white;border-radius:20px;cursor:pointer;" id="copy_BV" title="点击复制该电影BV号到剪切板">复制BV号</a>'
                    + '</span>');

                //复制AV号
                $('a#copy_AV').click(function (e) {
                    copy_Number(v_num_A);
                });

                //复制BV号
                $('a#copy_BV').click(function (e) {
                    copy_Number(v_num_B);
                });
            }, 2500);

            //鼠标移入移出动画
            setTimeout(() => {
                //下载按钮移入
                $("a#down_poster").mouseover(function () {
                    $("a#down_poster").css("background-color", "#43BBDF");
                });
                //下载按钮移出
                $("a#down_poster").mouseout(function () {
                    $("a#down_poster").css("background-color", "#00A7D8");
                });
                //复制AV号按钮移入
                $("a#copy_AV").mouseover(function () {
                    $("a#copy_AV").css("background-color", "#43BBDF");
                });
                //复制AV号按钮移出
                $("a#copy_AV").mouseout(function () {
                    $("a#copy_AV").css("background-color", "#00A7D8");
                });
                //复制BV号按钮移入
                $("a#copy_BV").mouseover(function () {
                    $("a#copy_BV").css("background-color", "#43BBDF");
                });
                //复制BV号按钮移出
                $("a#copy_BV").mouseout(function () {
                    $("a#copy_BV").css("background-color", "#00A7D8");
                });

            }, 3000);

        }
    } else if (URL.indexOf('live.bilibili.com') != -1) {
        setTimeout(() => {
            if ($("div.checkin-btn.t-center.pointer").length != 0) {
                //模拟点击签到按钮
                $("div.checkin-btn.t-center.pointer").trigger("click");
                GM_notification({
                    text: '今日已经完成签到~',
                    timeout: 2500
                });
            } else {
                console.log('已经签到过了');
            }
        }, 10000);
    } else {
        //其他功能待定
    }

    // 下载函数
    function download_Pic() {
        GM_download({
            url: global_Download_URL,
            name: global_Download_File_Name,
            saveAs: true,
            onload() {
                GM_notification({
                    text: '图片：“ ' + global_Download_File_Name + ' ” 下载成功~',
                    timeout: 2500
                });
            },
            onerror(e) {
                GM_notification('下载失败。')
                console.log("下载失败，失败原因：");
                console.log(e);
            }
        })
    }

    //复制函数
    function copy_Number(number) {
        GM_setClipboard(number, 'text');
        GM_notification({
            text: "已经复制到剪切板啦~",
            timeout: 2500
        });
    }


    // Your code here...

})();

