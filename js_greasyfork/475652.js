// ==UserScript==
// @name         chinahrt全自动刷课
// @namespace    https://github.com/jsgang/chinahrt
// @version      1.5
// @description  chinahrt刷课，规则更改了，只能耗时间，可以把视频加入列表放置让自动切换。。
// @author       jsgang  yikuaibaiban  https://www.jsgang.top
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jsgang.top
// @match        http://*.chinahrt.com/*
// @match        https://*.chinahrt.com/*
// @match        http://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        http://videoadmin.chinahrt.com/videoPlay/play*
// @match        https://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        https://videoadmin.chinahrt.com/videoPlay/play*
//
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_notification
//
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/475652/chinahrt%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/475652/chinahrt%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
/**
 * 课程预览页面
 * @type {number}
 */
const COURSE_PREVIEW = 0;
/**
 * 课程播放页面
 * @type {number}
 */
const COURSE_PALY = 1;
/**
 * 视频播放页面
 * @type {number}
 */
const VIDEO_PALY = 2;
/**
 * VUE课程预览页面
 * @type {number}
 */
const VUE_COURSE_PREVIEW = 3;
/**
 * 未知页面
 * @type {number}
 */
const UNKOWN_PAGE = 9999;
/**
 * 课程存储关键字
 * @type {string}
 */
const COURSES = "courses";
/**
 * 自动播放
 * @type {string}
 */
const AUTOPLAY = "autoPlay";
/**
 * 静音
 * @type {string}
 */
const MUTE = "mute";
/**
 * 拖动
 * @type {string}
 */
const DRAG = "drag";
/**
 * 播放速度
 * @type {string}
 */
const SPEED = "speed";
/**
 * 播放模式
 * @type {string}
 */
const PLAY_MODE = "play_mode";
/**
 * 重复次数
 * @type {string}
 */
const REAPT_NUM = "reapt_num";
/**
 * 自刷切换
 * @type {string}
 */
const REAPT_MODE = "reapt_mode";
/**
 * 获取自动播放
 * @returns {*}
 */
function getAutoPlay() {
    return GM_getValue(AUTOPLAY, true);
}

/**
 * 获取静音
 * @returns {*}
 */
function getMute() {
    return GM_getValue(MUTE, true);
}

/**
 * 获取拖动
 * @returns {*}
 */
function getDrag() {
    return GM_getValue(DRAG, 5);
}

/**
 * 获取播放速度
 * @returns {*}
 */
function getSpeed() {
    return GM_getValue(SPEED, 1);
}

/**
 * 获取播放列表
 * @returns {*|*[]}
 */
function getCourses() {
    var value = GM_getValue(COURSES, []);
    if (Array.isArray(value)) {
        return value;
    }
    return [];
}

/**
 * 添加到播放列表
 * @param element
 * @returns {boolean}
 */
function addCourse(element) {
    if (!element.title || !element.url) {
        console.error(element);
        alert("添加失败,缺少必要参数");
        return false;
    }

    var oldValue = getCourses();

    if (oldValue.findIndex(value => value.url == element.url) > -1) {
        alert("已经存在播放列表中");
        return false;
    }

    oldValue.push({title: element.title, url: element.url});

    GM_setValue(COURSES, oldValue);

    return true;
}

/**
 * 从播放列表移除
 * @param index
 */
function removeCourse(index) {
    var courses = getCourses();

    if (Number.isNaN(index)) {
        for (let i = courses.length; i >= 0; i--) {
            const element = courses[i];
            // 正则提取 href 中  sectionId courseId trainplanId
            var jsonHref = element.url;
            var jsonSectionId = jsonHref.match(/sectionId=([^&]*)/)[1];
            var jsonCourseId = jsonHref.match(/courseId=([^&]*)/)[1];
            var jsonTrainplanId = jsonHref.match(/trainplanId=([^&]*)/)[1];

            // 正则提取 window.location.href 中  sectionId courseId trainplanId
            var href = window.location.href;
            var sectionId = href.match(/sectionId=([^&]*)/)[1];
            var courseId = href.match(/courseId=([^&]*)/)[1];
            var trainplanId = href.match(/trainplanId=([^&]*)/)[1];

            if (jsonCourseId == courseId && jsonSectionId == sectionId && jsonTrainplanId == trainplanId) {
                courses.splice(i, 1);
            }
        }
    } else {
        courses.splice(index, 1);
    }

    GM_setValue(COURSES, courses);
}

/**
 * 生成可以添加到播放列表的容器
 * @returns {*|jQuery|HTMLElement}
 */
function createCanPlayList() {
    // 生成容器
    var playListBox = $("<div>", {
        id: "canPlayBox",
        css: {
            width: "300px",
            height: "500px",
            position: "fixed",
            top: "100px",
            background: "rgba(255,255,255,1)",
            right: "20px",
            border: "1px solid #c1c1c1"
        }
    });

    var status = $("<div></div>", {
        text: "获取中...",
        css: {
            height: "30px",
            "border-bottom": "1px solid",
            "text-align": "center",
            "line-height": "30px",
            "color": "#4bccf2",
            "font-weight": "bold"
        },
        click: function () {
            playListBox.trigger("clear");
            if (getPageNumber() == VUE_COURSE_PREVIEW) {
                vue_findCourses(playListBox);
            } else {
                findCourses(playListBox);
            }
        }
    });
    status.appendTo(playListBox);

    var listBox = $("<div></div>", {
        css: {
            height: "470px",
            "overflow-y": "auto"
        }
    }).appendTo(playListBox);

    playListBox.on("clear", function () {
        status.text("获取中...");
        listBox.empty();
    });

    // 添加绑定事件
    playListBox.on("bind", function (e, data) {
        if (status.text() == "获取中...") {
            status.text("点击刷新");
        }
        var box = $("<div>", {
            css: {
                "border-bottom": "1px solid #c1c1c1",
                "padding": "8px",
                "line-height": "150%",
                "border-bottom": "1px solid #c1c1c1",
                "margin-bottom": "3px"
            }
        });

        var ptitle = $("<p>", {
            text: data.title,
            title: data.title,
            css: {
                "font-size": "13px",
                "white-space": "nowrap",
                "overflow": "hidden",
                "text-overflow": "ellipsis",
            }
        });
        ptitle.appendTo(box);

        var pstatus = $("<p>", {
            text: "学习状态: " + data.status,
            title: "学习状态: " + data.status,
            css: {
                "font-size": "12px",
                "white-space": "nowrap",
                "overflow": "hidden",
                "text-overflow": "ellipsis",
                "color": "#c1c1c1"
            }
        });
        pstatus.appendTo(box);

        var disabled = getCourses().findIndex(value => value.url == data.url) > -1;
        var button = $("<button>", {
            text: disabled ? "已在列表中" : "添加到播放列表",
            type: "button",
            disabled: disabled,
            css: {
                color: disabled ? "#000" : "#FFF",
                backgroundColor: disabled ? "#c3c3c3" : "#4bccf2",
                border: "none",
                padding: "5px 10px",
                "margin-top": "4px"
            },
            click: function () {
                if (addCourse({title: data.title, url: data.url})) {
                    $(this).attr("disabled", true);
                    $(this).css({
                        color: "#000",
                        backgroundColor: "#c3c3c3",
                    }).text("已在列表中");
                }
            }
        });
        button.appendTo(box);

        box.appendTo(listBox);
    });

    playListBox.appendTo('body');

    return playListBox;
}

/**
 * 显示通知
 * @param content
 */
function showNotification(content) {
    GM_notification({
        text: content,
        title: "Chinahrt自动刷课",
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAArFJREFUWEftlttPE0EUxr+9ddtdYOXSSmmlFFoasSFemmg0qYkIMfGF/9J/wTeN0cSYGBHEBBIoLSIU0VrKpe1eagaySWVmutu+GJPO4+5cfvOdc745wkGl3sI/HEIf4L9ToHrqoHLi4LTRgmm1IAhAMCDgmi4ibEgQhe4SyncOFA9tFMoWaucO9wRJFDAZlpCeUKAq/kA8AY7PHKwWmqic+i8WRRaQTciIj8qeFB0Bjo4dvN9ooOX/7L8OnLshYybaWQouALn5m/XeD3dJ5qcCSEQkrhJcgLfrdabshV8mvtdsPEoEPeV1JzzOqhjSROZ8JsBO2cJa0WQueLFSQ6lqYWpYQT4ZQnSQfzt3g+iwhFw64B/g9VqDm+0uANlNkYB8UkMupnqqkc+qMBgqUAqQOiex5412AHdOJhzAUlqDpvBNIBOXMTtBJyQF0El+ciALgHwfUEUspjTMjrGzPmKIuJ+hlaIA1ksmtg+srhRon7wwE0IuTieoHhTwZJ7+TgGsbDexe2T3DJAdV/E8o1HriTMu3QlR3ymAz4UmSj96A1AkActzOqZH6DD4BtjYM7G5130IYkMynmV0jHHqfXRQxMObPnKg/NvGh81mVyG4HQ1gcVYH22out5oel3Fr0kcVOC3g5cdz2JxH72oVPE1ruDfh7QMPMirCBo3IdMIvRfPi6WUNF2BMl0Aynjii1yAGRIyINZgADRN4tVa/aDiujnfFOg5PbCykNAyp/roPYsPEjn0DkInfflr4tMV+D7xu3P4/eV1GNsFXqWM/sLVv4usuvyK8QGIjEu6m2I+Qu9azIyKt2OoOvyp4EF439w1AJpLmhHjDfoVvUO6GJOHSMZkb86vAngq0L6ieOSA+UalddsWWfZmkA0ERhi4iYkjMUusUqq4AvGLey/8+QF+BP0npcPDdfTv7AAAAAElFTkSuQmCC",
    });
}

/**
 * 创建配置窗口
 */
function createConfigBox() {
    var box = $("<div>", {
        css: {
            position: "fixed",
            right: 0,
            top: 0,
            width: "250px",
            height: "240px",
            "background-color": "#FFF",
            "z-index": 9999,
            border: "1px solid #ccc"
        }
    });

    $("<div>", {
        text: "视频控制配置",
        css: {
            "border-bottom": "1px solid #ccc",
            padding: "5px",
            "font-weight": "bold"
        }
    }).appendTo(box);

    var configBox = $("<div>", {
        css: {
            padding: "5px",
            "padding-bottom": "5px",
            "font-size": "12px",
            "line-height": "150%"
        }
    });

    // 自动播放
    var autoPlayBox = $("<div>", {css: {"border-bottom": "1px dotted #ccc", "padding-bottom": "5px"}});
    $("<p>", {text: "是否自动播放："}).appendTo(autoPlayBox);
    $("<input>", {
        type: "radio", name: "autoPlay", value: true, checked: getAutoPlay(), click: function () {
            GM_setValue(AUTOPLAY, true);
        }
    }).appendTo(autoPlayBox);
    $("<label>", {text: "是"}).appendTo(autoPlayBox);
    $("<input>", {
        type: "radio", name: "autoPlay", value: false, checked: !getAutoPlay(), click: function () {
            GM_setValue(AUTOPLAY, false);
        }
    }).appendTo(autoPlayBox);
    $("<label>", {text: "否"}).appendTo(autoPlayBox);
    autoPlayBox.appendTo(configBox);

    // 是否静音
    var mutePlayBox = $("<div>", {css: {"border-bottom": "1px dotted #ccc", "padding-bottom": "5px"}});
    $("<p>", {text: "是否静音："}).appendTo(mutePlayBox);
    $("<input>", {
        type: "radio", name: "mute", value: true, checked: getMute(), click: function () {
            GM_setValue(MUTE, true);
        }
    }).appendTo(mutePlayBox);
    $("<label>", {text: "是"}).appendTo(mutePlayBox);
    $("<input>", {
        type: "radio", name: "mute", value: false, checked: !getMute(), click: function () {
            GM_setValue(MUTE, false);
        }
    }).appendTo(mutePlayBox);
    $("<label>", {text: "否"}).appendTo(mutePlayBox);
    $("<p>", {
        text: "注意：不静音，视频可能会出现不会自动播放",
        css: {"font-size": "13px", "font-weight": "bold"}
    }).appendTo(mutePlayBox);
    mutePlayBox.appendTo(configBox);

    // 启用拖放
    var dragPlayBox = $("<div>", {css: {"border-bottom": "1px dotted #ccc", "padding-bottom": "5px"}});
    $("<p>", {text: "启用拖放（慎用）："}).appendTo(dragPlayBox);
    $("<input>", {
        type: "radio", name: "drag", value: 5, checked: getDrag() == 5, click: function () {
            GM_setValue(DRAG, 5);
        }
    }).appendTo(dragPlayBox);
    $("<label>", {text: "还原"}).appendTo(dragPlayBox);
    $("<input>", {
        type: "radio", name: "drag", value: 1, checked: getDrag() == 1, click: function () {
            GM_setValue(DRAG, 1);
        }
    }).appendTo(dragPlayBox);
    $("<label>", {text: "启用"}).appendTo(dragPlayBox);
    dragPlayBox.appendTo(configBox);
 var playModeBox = $("<div>", {css: {"border-bottom": "1px dotted #ccc", "padding-bottom": "5px"}});

    playModeBox.appendTo(configBox);

    configBox.appendTo(box);

    box.appendTo("body");
}

/**
 * 创建播放列表窗口
 */
function createPlayListBox() {
    var box = $("<div>", {
        id: "playListBox",
        css: {
            position: "fixed",
            right: 0,
            top: 250,
            width: "250px",
            height: "450px",
            "background-color": "#FFF",
            "z-index": 9999,
            border: "1px solid #ccc",
            "overflow-y": "auto"
        }
    });

    $("<div>", {
        text: "视频列表",
        css: {
            "border-bottom": "1px solid #ccc",
            padding: "5px",
            "font-weight": "bold"
        }
    }).appendTo(box);

    // 渲染课程列表
    var courses = getCourses();
    for (let index = 0; index < courses.length; index++) {
        const element = courses[index];

        var ptitle = $("<p>", {
            text: element.title,
            title: element.title,
            css: {
                "font-size": "13px",
                "white-space": "nowrap",
                "overflow": "hidden",
                "text-overflow": "ellipsis",
            }
        });
        ptitle.appendTo(box);

        var button = $("<button>", {
            text: "移除",
            type: "button",
            data: {index: index},
            css: {
                color: "#FFF",
                backgroundColor: "#fd1952",
                border: "none",
                padding: "5px 10px",
                "margin": "4px 0 10px 0",
            },
            click: function () {
                if (confirm("确定删除这个视频么？")) {
                    removeCourse($(this).data("index"));
                }
            }
        });
        button.appendTo(box);
    }

    box.appendTo("body");
}

/**
 * 获取当前页面编号
 * @returns {number}
 */
function getPageNumber() {
    var href = window.location.href;
    // 以下是Vue版的请求地址
    if (href.indexOf("/index.html#/v_courseDetails") > -1) {
        return VUE_COURSE_PREVIEW;
    }
    // 默认课程详情地址
    if (href.indexOf("/course/preview") > -1) {
        return COURSE_PREVIEW;
    }
    if (href.indexOf("/course/play_video") > -1) {
        return COURSE_PALY;
    }
    if (href.indexOf("/videoPlay/play") > -1) {
        return VIDEO_PALY;
    }

    return UNKOWN_PAGE;
}

/**
 * 获取课程信息
 * @param playListBox
 */
function findCourses(playListBox) {
    // 提取所有链接
    var allLinks = document.querySelectorAll("a");
    // 提取所有可以播放的数据
    for (let i = 0; i < allLinks.length; i++) {
        const element = allLinks[i];
        if (element.href.indexOf("/course/play_video") > -1) {
            playListBox.trigger("bind", {
                title: element.innerText,
                url: element.href,
                status: $(element).prev().text()
            });
        }
    }
}

/**
 * VUE版本获取课程信息
 * @param playListBox
 */
function vue_findCourses(playListBox) {
    // 获取data
    var data = document.querySelector("article")?.__vue__?._data;
    if (!data) {
        return;
    }

    // 获取页面信息
    var pageData = data?.pageData;
    if (!pageData) {
        return;
    }

    // 获取所有章节信息
    var chapters = pageData?.course?.chapter_list;

    // 循环获取章节信息
    if (chapters && chapters.length > 0) {
        for (let i = 0; i < chapters.length; i++) {
            const chapter = chapters[i];
            // 循环分段（课时）
            var sections = chapter?.section_list;
            if (sections && sections.length > 0) {
                for (let j = 0; j < sections.length; j++) {
                    const section = sections[j];
                    // 拼接课时网址
                    var url = window.location.protocol + "//" + window.location.host + window.location.pathname + "#/v_video?platformId=" + data.platformId + "&trainplanId=" + data.trainplanId + "&courseId=" + data.courseId + "&sectionId=" + section.id;
                    playListBox.trigger("bind", {
                        title: section.name,
                        url: url,
                        status: section.study_status + "( " + section.studyTimeHHmmss + " )"
                    });
                }
            }
        }
    }
}

window.onload = function () {
    try {
        // 检测到是Vue
        if (Vue) {
            console.log("当前是Vue模式");
            // 创建播放列表
            var playListBox;
            // 循环检测
            setInterval(() => {
                if (getPageNumber() == VUE_COURSE_PREVIEW) {
                    if (!playListBox) {
                        playListBox = createCanPlayList();
                        setTimeout(function () {
                            vue_findCourses(playListBox);
                        }, 1000);
                    }
                } else {
                    if (playListBox) {
                        playListBox.remove();
                        playListBox = undefined;
                    }
                }
            }, 1000);
        }
    } catch (error) {
        console.log("当前不是Vue模式");
    }


    if (getPageNumber() == COURSE_PREVIEW) {
        $(document).ready(function () {
            // 创建播放列表
            var playListBox = createCanPlayList();
            findCourses(playListBox);
        });
    }

    if (getPageNumber() == VIDEO_PALY) {
        $(document).ready(function () {

            // 增加提示信息
            $('<div></div>', {
                html: "点课程详情页中的【添加到播放列表】按钮添加需要学习的课程。受到浏览器策略影响第一次可能无法自动播放，请手动点击播放。视频播放标签放置最前面",
                css: {
                    "font-size": "14px",
                    "font-weight": "bold",
                    color: "red",
                    background: "#FFF",
                    position: "absolute",
                    "line-height": "30px",
                    "z-index": "99999",
                    "left": "30px",
                    bottom: "10px"
                }
            }).prependTo("#body");

            $("video").prop("muted", "muted");

            // 移除讨厌的事件
            removePauseBlur();

            // 视频播放初始化
            function run() {
                 // 总是显示播放进度
                player.changeControlBarShow(true);

                // 拖动开关
                player.changeConfig('config', 'timeScheduleAdjust', getDrag());

                // 静音
                if (getMute()) {
                    player.videoMute();
                } else {
                    +
                        player.videoEscMute();
                }

                // 播放速度
                player.changePlaybackRate(getSpeed());

                // 自动播放
                if (getAutoPlay()) {
                    player.videoPlay();
                }
            }

            // 视频总长度
            var videoDuration = 0;
            var videocurrentTime=0;
            var startstaus=0;
            var actisok=0;
            var ctimes=0;
            var rtimes=0;
            var rtimess=0;
            var jumpas=0;
            var nonum=0;
            var nplay=0;

             var tmp = setInterval(function () {
                if (player != undefined) {
                    player.addListener('loadedmetadata', run);
                    run();
                    clearInterval(tmp);


                    // 移除本课程学习完毕
                    attrset.proxyUrl = "";

                    // 播放结束
                    player.addListener('ended', function () {
                        removeCourse(window.location.href);
                        var courses = getCourses();
                        if (courses.length == 0) {
                            GM_setValue(REAPT_MODE, 0);
                            GM_setValue(REAPT_NUM, 0);
                            showNotification("所有视频已经播放完毕");
                        } else {
                            GM_setValue(REAPT_MODE, 0);
                            GM_setValue(REAPT_NUM, 0);
                           
                            showNotification("即将播放下一个视频:" + courses[0].title);
                            window.top.location.href = courses[0].url;
                         
                        }
                    });


                    player.addListener('time', function (t) {
                        videoDuration = parseInt(player.getMetaDate().duration);
                        videocurrentTime = parseInt(attrset.currentTime);
                        
                        
                      // console.log(attrset.currentTime+"/"+videoDuration);

                    });
                }
            }, 1000);

            // 创建配置窗口
            createConfigBox();

            // 创建播放列表窗口
            createPlayListBox();



            // 检测播放列表
            GM_addValueChangeListener(COURSES, function (name, oldValue, newValue, remote) {
                console.log("检测播放列表变动");
                $("#playListBox").remove();
                createPlayListBox();
            });

            // 监测自动播放
            GM_addValueChangeListener(AUTOPLAY, function (name, oldValue, newValue, remote) {
                console.log("监测自动播放变动");
                if (newValue) {
                    player.videoPlay();
                }
            });

            // 检测静音
            GM_addValueChangeListener(MUTE, function (name, oldValue, newValue, remote) {
                console.log("检测静音变动");
                if (newValue) {
                    player.videoMute();
                } else {
                    player.videoEscMute();
                }
            });

            // 检测拖动
            GM_addValueChangeListener(DRAG, function (name, oldValue, newValue, remote) {
                console.log("检测拖动变动");
                player.changeConfig('config', 'timeScheduleAdjust', newValue);
            });

            // 检测速度
            GM_addValueChangeListener(SPEED, function (name, oldValue, newValue, remote) {
                console.log("检测速度变动");
                player.changePlaybackRate(newValue);
            });
        });
    }
}