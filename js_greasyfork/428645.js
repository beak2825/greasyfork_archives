// ==UserScript==
// @name		中国教育干部网络学院自动学习
// @namespace	enaea.edu.cn
// @version		3.0.4
// @description	自动进入学习公社完成视频学习
// @author		叶海晨星
// @match		*://study.enaea.edu.cn/*
// @run-at		document-end
// @require		https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant		GM_notification
// @downloadURL https://update.greasyfork.org/scripts/428645/%E4%B8%AD%E5%9B%BD%E6%95%99%E8%82%B2%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/428645/%E4%B8%AD%E5%9B%BD%E6%95%99%E8%82%B2%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

//登录		https://study.enaea.edu.cn/login.do
//个人中心	https://study.enaea.edu.cn/studyCenterRedirect.do

(function () {
    "use strict";

    function logNow() {
        let myDate = new Date();
        return myDate.toLocaleTimeString();
    }

    //返回网址是否匹配给定字符串
    function match(...strs) {
        let href = location.href;
        let isMatch = false;
        strs.every((str) => {
            console.log(logNow() + " 匹配: " + str);
            if (href.indexOf(str) > 0) {
                isMatch = true;
                return false;
            }
        });
        return isMatch;
    }

    //等待指定元素出现后执行函数
    function wait(selector, func, times, interval) {
        let _times = times || 120, //默认重复120
            _interval = interval || 1000, //每1秒检查一次
            _intervalID = 0; //定时器ID
        if ($(selector).length) {
            console.log(logNow() + " " + selector + " 已出现");
            func && func.call(this);
        } else {
            _intervalID = setInterval(() => {
                if (!_times) {
                    //是0就退出
                    clearInterval(_intervalID);
                    location.reload();
                }
                _times <= 0 || _times--; //如果是正数就 --
                if ($(selector).length) {
                    console.log(logNow() + " " + selector + " 已出现");
                    clearInterval(_intervalID);
                    func && func.call(this);
                }
            }, _interval);
        }
        return this;
    }

    function waitAndDelayClick(selector, index, interval, close) {
        let _index = index || 0,					//默认点击第一个元素
            _interval = interval || 1000,			//默认延迟1秒后执行
            _close = close || false;

        wait(selector, () => {						//等待元素出现
            setTimeout(() => {						//延时执行
                console.log(logNow() + " 点击: " + selector);
                $(selector)[_index].click();		//点击元素
                if (_close) {						//是否关闭页面
                    setTimeout(() => {
                        window.close();
                    }, _interval);
                }
            }, _interval);
        });
    }

    if (match("securitySettingsRedirect.do")) {		//安全设置
        let selector = "a#J_submitReg.redbtn";
        waitAndDelayClick(selector);
    } else if (match("action=showCourseList", "action=toMyProject")) {	//个人空间
        let selector = "a.button.intoStudy";
        waitAndDelayClick(selector, 0, 1000, true);
    } else if (match("action=toCircleIndex")) {		//我的学习
        wait("a.btnBig2", () => {
            setTimeout(() => {
                $("div.xxk").each(function () {
                    let course = $(this).find("h2.top15 a");
                    let courseName = course.text();
                    if (courseName.indexOf("试") > 0) return false;
                    let coursePercent = parseInt($(this).find("div.jd").text());
                    console.log(logNow() + " 学习进度: " + courseName + " " + coursePercent + "%");
                    if (coursePercent < 100) {
                        console.log(logNow() + " 开始学习 '" + courseName + "'");
                        course[0].click();
                        return false;
                    }
                });
            }, 1000);
        });
    } else if (match("action=toNewMyClass")) {		//课程列表
        wait("span.prefix", () => {
            $("li.customcur-tab")[1].click();	//点击 未学完的课程
            console.log(logNow() + " 点击 未学完的课程!");
            let intervalID = setInterval(() => {	//每1秒检测一次 直到课程信息加载完成
                if ($("#J_myOptionRecords_processing").css("visibility") == "hidden") {
                    console.log(logNow() + " 已载入 未学完的课程!");
                    clearInterval(intervalID);
                    if ($("td.dataTables_empty").length) {		//全部课程已学完
                        GM_notification({
                            text: "当前学习的全部课程已学完!!",
                            timeout: 0,
                        });
                    } else {
                        console.log(logNow() + " 已载入 未学完的课程!")
                        $("td.last-cell a[title]")[0].click();		//学习最顶端的课程
                        setTimeout(() => {
                            window.close();							//关闭课程列表页面
                        }, 1000);
                    }
                }
            }, 1000);
        });
    } else if (match("viewerforccvideo.do")) {
        let selector = "div.cvtb-MCK-CsCt-info.clearfix";

        let playVideo = function () {
            let done = true;
            $(selector).each(function () {
                let name = $(this).find("div.cvtb-MCK-CsCt-title").text();
                let percent = parseInt($(this).find("div.cvtb-MCK-CsCt-studyProgress").text());
                if (percent < 100) {
                    done = false;
                    console.log(logNow() + " 观看视频 '" + name + "'");
                    GM_notification({
                        text: "学习 '" + name + "'",
                        timeout: 10000,
                    });
                    $(this).click();
                    return false;
                }
            });

            if (done) {
                location.href = "https://study.enaea.edu.cn/";
            }
            return done;
        }
        let mutedAndPlay = function () {
            try {
                $("video").each(function () {
                    $(this).prop('muted', true);
                    videoPause = function () { }; //禁用视频暂停功能
                    videoPlay();
                });
            } catch (error) {
                console.log("播放器错误: " + error);
            }
        }

        wait(selector, () => {
            setTimeout(() => {
                let times = 0,
                    lastPercent = 0;
                playVideo();
                wait("video", () => {
                    mutedAndPlay();
                    setInterval(() => {
                        let _self = $("div.xgplayer-pause");                     //应对暂停
                        if (_self.length) {
                            _self.each(function () {
                                if ($(this).css("display") == "block") {
                                    console.log(logNow() + " 恢复播放!");
                                    mutedAndPlay();
                                    return;
                                }
                            })
                        }

                        _self = $("div.dialog-box button");                     //应对20分钟休息
                        if (_self.length) {
                            _self.each(function () {
                                console.log(logNow() + " 我还能学!");
                                $(this).click();
                            })
                        }

                        _self = $("div.xgplayer-volume-muted");                 //应对未静音的情况
                        if (_self.length==0) {
                            console.log(logNow() + " 闭嘴!");
                            mutedAndPlay();
                        }

                        _self = $("li.cvtb-MCK-course-content.current");        //应对当前视频进度100%
                        if (_self.length) {
                            let percent = parseInt(_self.find("div.cvtb-MCK-CsCt-studyProgress").text());
                            if (lastPercent != percent) {						//检测进度是否变化
                                times = 0;
                                lastPercent = percent;
                            } else {
                                times++;
                                console.log(lastPercent + "%, 已" + times * 2 + "秒");
                                if (times >= 65) {	//130秒进度不动则刷新页面
                                    location.reload();
                                }
                            }

                            if (percent >= 100) {
                                console.log(logNow() + " 学习进度已100%!");
                                times = 0;
                                lastPercent = 0;
                                playVideo();
                            }
                        }
                    }, 2000);
                });
            }, 1000);
        })
    }
})();