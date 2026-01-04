// ==UserScript==
// @name         蓝天教育网培训视频
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  全自动看蓝天网视频
// @author       hui
// @require    https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match      *://*.lt-edu.net/student.html*
// @match      *://preview.dccloud.com.cn/?*
// @match      *://*.lt-edu.net/login.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447208/%E8%93%9D%E5%A4%A9%E6%95%99%E8%82%B2%E7%BD%91%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/447208/%E8%93%9D%E5%A4%A9%E6%95%99%E8%82%B2%E7%BD%91%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var lantian_key = "lantian_models";
    var lantian_key2 = "lantian_can_click";
    var lantian_username_key = "lantian_username_key";
    var lantian_password_key = "lantian_password_key";
    var lantian_role_key = "lantian_role"
    var urlInfos = window.location.href.split("/");
    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    var urlPathName = window.location.pathname;
    console.log(window.location.href)
    console.log(urlTip);
    console.log(urlPathName);
    var myAS = getAutoSee();
    if (urlTip == "classStudy") {
        console.log("视频页面")
        myAS.breakControl()
        setTimeout(function () { //20分钟后刷新，尝试解决未知的卡死问题
            console.log("1");
            window.location.reload()
        }, 20 * 60 * 1000)
    } else if (urlTip == "index") {
        console.log("模块页面")
        $(function () {
            myAS.modelInit()
        })
        /*
        setTimeout(function () { //10分钟后刷新，尝试解决未知问题
            window.location.reload()
        }, 10 * 60 * 1000)
        */
    } else if (urlInfos[2] == "preview.dccloud.com.cn") {
        console.log("ppt页面")

        window.opener = null;
        window.open(' ', '_self');
        window.close();
    } else if (urlPathName == "/login.html") {
        console.log("登陆界面")
        myAS.autoLogin()
        localStorage.setItem(lantian_key2, true) //让模块选择页面可以进行刷新
        setTimeout(function () { //2分钟后刷新，尝试解决未知问题
            console.log("2");
            window.location.reload()
        }, 2 * 60 * 1000)
    } else if (urlTip == "home" || urlTip == "student.html" || urlInfos[urlInfos.length - 2] == "student.html#") {
        console.log("登陆成功界面")
        $(function () {
            var i = setInterval(function () {
                var p = $(".training-projectsList")[0]
                if (p) {
                    $(p).click()
                    clearInterval(i)
                    myAS.modelInit()
                }
            }, 3000)
            })
    } else if (urlTip == "personaldata") {
        console.log("个人资料")
        $(function () {
            var i = setInterval(function () {
                var p = $(".public-headerNavListButton.fs18.c-fff")[0]
                if (p) {
                    $(p).click()
                    clearInterval(i)
                    var i2 = setInterval(function () {
                        var p = $(".training-projectsList")[0]
                        if (p) {
                            $(p).click()
                            clearInterval(i2)
                            myAS.modelInit()
                        }
                    }, 3000)
                    }
            }, 3000)
            })
    } else {
        console.log("其它  " + window.location.href)
        setTimeout(function () { //2分钟后刷新，尝试解决未知问题
            console.log("3");
            window.location.reload()
        }, 2 * 60 * 1000)
    }

    function getAutoSee() {
        return {

            breakControl: function () {
                /*
                var i = setInterval(function () {
                    if (window.ckplayer) {
                        console.log("有了");
                        window.clearInterval(i);
                        window.ckplayer.prototype.addVEvent = addVEvent;
                    }
                }, 0)
                */
                /*function yuedu() {
                    setTimeout(function(){
                    var num = $(".fs12.c-red").length;
                    if(num>0){
                            $('button').click();
                    }
                    test()
                },1000)
                }*/
                function test() {
                    var vidoe = document.querySelector("video");
                    if (vidoe) {
                        console.log("找到了")
                        vidoe.muted = 1
                        vidoe.addEventListener("loadedmetadata", ready)
                        vidoe.addEventListener("pause", pause)
                        vidoe.addEventListener("ended", ended)
                        vidoe.play()
                        if(document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__header > div")){document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary").click()}
                        window.nowVieo = vidoe

                        function ready() {
                            console.log("准备好了")
                            vidoe.play()
                        }

                        function pause() {
                            console.log("暂停了")
                            vidoe.play()
                        }

                        function ended() {
                            console.log("结束了")
                            setTimeout(function () {
                                console.log("4");
                                location.reload()
                            }, 3000)
                            vidoe.removeEventListener(pause)
                        }
                    }
                }

                $(function () {
                    var i2 = setInterval(function () {
                        checkIsPDF()
                    }, 5000)

                    var i3 = setInterval(function () {
                        checkIsWaiZhan()
                    }, 5000)

                    var i4 = setInterval(function () {
                        checkID()
                    }, 5000)

                    window.test = test;
                    window.checkIsDone = checkIsDone;
                    window.i2 = i2;
                    window.i3 = i3;
                    window.i4 = i4;
                    console.log('cc')
                })

                var checkIsDone = function () {
                    console.log("checkIsDone")
                    if ($(".el-icon-video-play.el-icon.el-icon-video-pause").length == 0 && $(".beyondConcealment.ellipsis.active").prev().hasClass("study")) {
                        dealPlayEnd()
                    } else if ($($(".el-icon-video-play.el-icon.el-icon-video-pause").next()).hasClass("success")) {
                        dealPlayEnd()
                    } else {
                        test()
                    }
                }

                var dealPlayEnd = function () {
                    console.log("结束审判")
                    //$($(".el-icon-video-play.el-icon.el-icon-video-pause").next()).attr("class","video-status success")
                    //$($(".el-icon-video-play.el-icon.el-icon-video-pause").next()).html("已学习")
                    var needToSee = $(".video-status.study , .video-status.unstudy")
                    console.log("needToSee's length: " + needToSee.length)
                    if (needToSee.length != 0) {
                        $(needToSee[0]).click()
                        setTimeout(function () {
                            $(".el-button.el-button--default.el-button--small.el-button--primary").click()
                        }, 1000)
                    } else {
                        //$($(".beyondConcealment.ellipsis.active").prev()).attr("class", "video_round study") //改变当前node状态为已完成
                        //$($(".beyondConcealment.ellipsis.active").prev()).attr("title", "已学习") //改变当前node状态为已完成
                        console.log("没得切，去下一个节点")
                        var points = $(".nav_menu")
                        var find = false;
                        for (var i = 0; i < points.length; ++i) {
                            if (points[i].firstElementChild.title == "未学习" || points[i].firstElementChild.title == "学习中") {
                                find = true;
                                setTimeout(function () {
                                    $(points[i]).click()
                                }, 1000)
                                break;
                            }
                        }
                        if (!find) {
                            clearInterval(window.i2)
                            clearInterval(window.i3)
                            clearInterval(window.i4)
                            console.log("当前页面全部学完了")
                            //完成笔记和问答
                            finishNodeAndQuestion()

                            setTimeout(function () {
                                var datas = JSON.parse(localStorage.getItem(lantian_key));
                                if (datas) {
                                    var key = $(".ellipsis-2.cursor-pointer").html()
                                    for (var i = 0; i < datas.length; ++i) {
                                        if (datas[i][0] == key) {
                                            datas[i][1] = true;
                                            break;
                                        }
                                    }
                                    localStorage.setItem(lantian_key, JSON.stringify(datas));
                                    localStorage.setItem(lantian_key2, true);
                                }
                                window.opener = null;
                                window.open(' ', '_self');
                                window.close();
                            }, 15000)
                        }
                    }

                    function inputIn(dom, st) {
                        var evt = new InputEvent('input', {
                            inputType: 'text',
                            data: st,
                            dataTransfer: null,
                            isComposing: false
                        });
                        dom.value = st;
                        dom.dispatchEvent(evt);
                    }

                    function finishNodeAndQuestion() {

                        setTimeout(function () {
                            document.querySelectorAll(".course-nav-list")[1].click() //切换到笔记页面
                            setTimeout(function () {
                                var ps = document.querySelectorAll(".m_top_p.c-ccc.fs14 .c-fff") //获取所有评论
                                if (ps.length != 0) {
                                    var index = Math.floor(Math.random() * ps.length); //获取随机下标
                                    inputIn(document.querySelector(".el-textarea__inner"), ps[index].innerText)
                                } else {
                                    inputIn(document.querySelector(".el-textarea__inner"), document.querySelector("h3.ellipsis-2.cursor-pointer").title)
                                }
                                setTimeout(function () {
                                    document.querySelector(".el-button.btn.el-button--primary.el-button--small").click() //提交
                                }, 1000)
                            }, 1000)
                        }, 0)

                        setTimeout(function () {
                            document.querySelectorAll(".course-nav-list")[2].click() //切换到问答页面
                            setTimeout(function () {
                                var ps = document.querySelectorAll(".m_top_p.c-ccc.fs14 .c-fff") //获取所有评论
                                if (ps.length != 0) {
                                    var index = Math.floor(Math.random() * ps.length); //获取随机下标
                                    inputIn(document.querySelector(".el-textarea__inner"), ps[index].innerText)
                                } else {
                                    inputIn(document.querySelector(".el-textarea__inner"), document.querySelector("h3.ellipsis-2.cursor-pointer").title)
                                }
                                setTimeout(function () {
                                    document.querySelector(".el-button.btn.el-button--primary.el-button--small").click() //提交
                                }, 1000)
                            }, 1000)
                        }, 5000)


                        setTimeout(function () {
                            document.querySelectorAll(".course-nav-list")[2].click() //切换到问答页面
                            setTimeout(function () {
                                var pingluns = document.querySelectorAll(".comment_m_List")
                                var find = false
                                for (let i = 0; i < pingluns.length; ++i) {
                                    let pinglunNumber = pingluns[i].querySelectorAll("p.cursor-pointer")[1].innerText.match(/\d+/g)
                                    if (pinglunNumber.length > 0 && pinglunNumber[0] > 0) {
                                        pingluns[i].querySelectorAll("p.cursor-pointer")[1].click() //展开input
                                        pingluns[i].querySelector(".has-num").click() //展开评论
                                        setTimeout(function () {

                                            inputIn(pingluns[i].querySelector(".el-input__inner"), pingluns[i].querySelectorAll(".m_bottom")[0].querySelector("p.c-fff").innerText)
                                            setTimeout(function () {
                                                pingluns[i].querySelector(".input.c-ccc.d-flex button").click()
                                            }, 1000)
                                        }, 1000)
                                        find = true
                                        break;
                                    }
                                }
                                if (!find) {
                                    pingluns[0].querySelectorAll("p.cursor-pointer")[1].click() //展开input
                                    setTimeout(function () {
                                        inputIn(pingluns[0].querySelector(".el-input__inner"), document.querySelector("h3.ellipsis-2.cursor-pointer").title)
                                        setTimeout(function () {
                                            pingluns[0].querySelector(".input.c-ccc.d-flex button").click()
                                        }, 1000)
                                    }, 1000)
                                }
                            }, 1000)
                        }, 10000)
                    }
                }



                function checkIsPDF() {
                    console.log('checkIsPDF')
                    var words = $(".fs12.c-red")
                    if (words.length != 0) {
                        $('button')[0].click()
                        if (words.length == 0) {
                            setTimeout(function () {
                                console.log("5");
                                location.reload();
                            }, 3000)
                        }
                    }
                    checkIsDone()
                }

                function checkIsWaiZhan() {
                    console.log('checkIsWaiZhan')
                    if (document.querySelectorAll(".left-content")[0].children[1].firstElementChild.tagName == "P") {
                        setTimeout(function () {
                            console.log("6");
                            //location.reload()
                        }, 3000)
                    }

                }

                function checkID() {
                    console.log('checkID')
                    var video = document.querySelector("video")
                    if (video) {
                        if (!window.nowVieo || video.id != window.nowVieo.id) {
                            checkIsDone()
                        }
                    }
                }
            },
            modelInit: function () {
                console.log("初始化模型")
                setTimeout(function () {
                    if($("div.ta-center.pt20.fw600.fs16").length ==1){
                        $("button")[1].click()}
                }, 3000);
                var ii = setInterval(function () {
                    if ($(".fs14.c-333.ellipsis-2").length != 0 && $(".public-headerInfo").length != 0) {
                        window.clearInterval(ii)
                        localStorage.removeItem(lantian_key)
                        localStorage.removeItem(lantian_key2)
                        var datas = new Array()
                        var titles = $(".fs14.c-333.ellipsis-2")
                        var hasToStudy = false;
                        for (var i = 0; i < titles.length; ++i) {
                            var data = new Array()
                            data[0] = $(titles[i]).html()
                            data[1] = false //是否完成
                            data[2] = true //是否可以点击
                            datas[i] = data
                            if ($(titles[i]).next().html() != "学习中" && $(titles[i]).next().html() != "未学习") {
                                datas[i][1] = true;
                            } else {
                                hasToStudy = true;
                            }
                        }
                        localStorage.setItem(lantian_key, JSON.stringify(datas));
                        localStorage.setItem(lantian_key2, true);
                        //var key2_info = localStorage.getItem(lantian_key2);
                        /***************** 添加控制台 ************************/
                        /*
                        $(".public-headerInfo").after('<div id="lanTianControl" style="background-color: white;width: 100%;color: red;text-align: center;">\
                        <b>这里是脚本的控制台，提供一些特殊操作：</b>\
                        <button style="width: 150px;height: 60px;cursor: pointer;border-radius:5px;background-color: #fdc41c;"  onclick="setLantian_key2()">自动打开视频:' + key2_info + '</button>\
                        <b>(如果此页面没有打开视频，请点击此按钮)</b>\
                        </div>')
                        */
                        if (hasToStudy) {
                            modelChose()
                        } else {
                            alert("已经全部看完了")
                            //$("#lanTianControl").html("<h1>看完了</h1>")
                        }
                    }

                }, 1000)

                function setLantian_key2() {
                    localStorage.setItem(lantian_key2, true);
                    alert("重置成功")
                    console.log("7");
                    window.location.reload()
                }
                window.setLantian_key2 = setLantian_key2;

                function modelChose() {
                    console.log("模型选择")
                    work()
                    var iii = setInterval(function () {
                        if (localStorage.getItem(lantian_key2) == "true") {
                            console.log("8");
                            location.reload()
                        }
                    }, 10000)

                    function work() {
                        if (localStorage.getItem(lantian_key2) == "true") {
                            var datas = JSON.parse(localStorage.getItem(lantian_key));
                            var titles = $(".fs14.c-333.ellipsis-2")
                            var find = false;
                            for (var i = 0; i < titles.length; ++i) {
                                if (!datas[i][1] && datas[i][2]) {
                                    $(titles[i]).click()
                                    console.log("点击了")
                                    localStorage.setItem(lantian_key2, false);
                                    find = true;
                                    break;
                                } else {
                                    $(titles[i]).next().html("已学习")
                                }
                            }
                            if (!find) {
                                //全学完，刷新页面
                                //location.reload()
                            }
                        }
                    }
                }
            },
            autoLogin: function () {
                $(function () {
                    var i = setInterval(function () {
                        if ($(".verification-handler.verification-handlerBg")[0]) {
                            var role = localStorage.getItem(lantian_role_key)
                            if (!role) role = 0
                            else {
                                switch (role) {
                                    case "教师学员": {
                                        role = 0;
                                        break;
                                    }
                                    case "辅导教师": {
                                        role = 1;
                                        break;
                                    }
                                    case "教师督学": {
                                        role = 2;
                                        break;
                                    }
                                    case "学科专家": {
                                        role = 3;
                                        break;
                                    }
                                    case "行政管理员": {
                                        role = 4;
                                        break;
                                    }
                                    case "项目管理员": {
                                        role = 5;
                                        break;
                                    }
                                    default: {
                                        role = 0;
                                        break;
                                    }
                                }
                            }
                            $(".login-iconRight.dc-iconfont.dc-icon-zhankai.animated").click()
                            setTimeout(function () {
                                $(".login-formSelect.animated.fadeIn").children("li")[role].click()
                                $(".el-checkbox__inner").click()
                                mockVerify()
                            }, 1000)

                            clearInterval(i)
                        }
                    }, 100)
                    })

                function inputIn(dom, st) {
                    var evt = new InputEvent('input', {
                        inputType: 'text',
                        data: st,
                        dataTransfer: null,
                        isComposing: false
                    });
                    dom.value = st;
                    dom.dispatchEvent(evt);
                }

                function mockVerify() {
                    console.log("mockVerify");

                    var btn = document.querySelector(".verification-handler.verification-handlerBg");
                    var mousedown = document.createEvent("MouseEvents");
                    var rect = btn.getBoundingClientRect();
                    var x = rect.x;
                    var y = rect.y;
                    mousedown.initMouseEvent("mousedown", true, true, window, 0,
                                             x, y, x, y, false, false, false, false, 0, null);
                    btn.dispatchEvent(mousedown);

                    var dx = 0;
                    var dy = 0;
                    var interval = setInterval(function () {
                        var mousemove = document.createEvent("MouseEvents");
                        var _x = x + dx;
                        var _y = y + dy;
                        mousemove.initMouseEvent("mousemove", true, true, window, 0,
                                                 _x, _y, _x, _y, false, false, false, false, 0, null);
                        btn.dispatchEvent(mousemove);

                        btn.dispatchEvent(mousemove);
                        if (_x - x >= 340) {
                            window.clearInterval(interval);
                            var mouseup = document.createEvent("MouseEvents");
                            mouseup.initMouseEvent("mouseup", true, true, window, 0,
                                                   _x, _y, _x, _y, false, false, false, false, 0, null);
                            btn.dispatchEvent(mouseup);
                            setTimeout(function () {
                                var username = localStorage.getItem(lantian_username_key);
                                var password = localStorage.getItem(lantian_password_key);
                                if (username && password) {
                                    var inputs = document.querySelectorAll(".login-formElInput");
                                    inputIn(inputs[0], username)
                                    inputIn(inputs[1], password)
                                    setTimeout(function () {
                                        if (inputs[0].value && inputs[1].value) {
                                            $(".login-button.mt34").click()
                                        }
                                    }, 3000)
                                } else {
                                    $($(".login-button.mt34")[0]).on("click", function () {
                                        var inputs = document.querySelectorAll(".login-formElInput");
                                        localStorage.setItem(lantian_username_key, inputs[0].value);
                                        localStorage.setItem(lantian_password_key, inputs[1].value);
                                        var role = document.querySelector(".login-formElSelectLabel.login-formElSelectLabelOn").firstElementChild.innerHTML;
                                        localStorage.setItem(lantian_role_key, role)
                                    })
                                }

                            }, 1000)
                        } else {
                            dx += Math.ceil(Math.random() * 50);
                            console.log(dx);
                        }
                    }, 30);


                }
            }
        }
    }

    // Your code here...
})();