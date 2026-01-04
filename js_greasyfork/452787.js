// ==UserScript==
// @name         气象干部培训学院科学学习
// @version      3.3
// @description  气象干部培训学院科学学习20251210
// @author       20251210
// @match        http://*.cmatc.cn/*
// @match        http://*.cma.cn/*
// @match        https://*.cmatc.cn/*
// @match        https://*.cma.cn/*
// @license      MIT
// @exclude      http://www.cmatc.cn/lms/app/lms/lesson/Lesson/studentSelectLesson.do*
// @exclude      http://www.cmatc.cn/lms/app/tms/trainclass/Trainclass/trainclassIndex.do*
// @exclude      http://www.cmatc.cn/lms/framebase/scripts/my97datepicker/my97datepicker.htm*
// @exclude      http://www.cmatc.cn/lms/app/lms/student/learn/exitlesson.do*
// @namespace    http://www.cmatc.cn/lms/app/lms/lesson/Lesson/studentSelectLesson.do
// @home-url     https://greasyfork.org/zh-CN/scripts/452787
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/452787/%E6%B0%94%E8%B1%A1%E5%B9%B2%E9%83%A8%E5%9F%B9%E8%AE%AD%E5%AD%A6%E9%99%A2%E7%A7%91%E5%AD%A6%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/452787/%E6%B0%94%E8%B1%A1%E5%B9%B2%E9%83%A8%E5%9F%B9%E8%AE%AD%E5%AD%A6%E9%99%A2%E7%A7%91%E5%AD%A6%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function () {
    $(document).ready(function () {
        var userid = window.localStorage.getItem("userid");
        var password = window.localStorage.getItem("password");
        var url_href = window.location.href.toLowerCase();
        console.log("气象干部培训学院科学学习", url_href);
        var clearDiv = "<div id='studentId' style='width:250px;font-size:12px;background-color:#fff;border:#ccc solid 1px;position:fixed;left:3px;top:3px;z-index:9999'>";
        clearDiv += `当前ID号：${userid}-${password}</div>`;
        $("body").append(clearDiv);
        function autoLogin() {
            $("#txtusername1").val(userid);
            $("#txtpassword1").val(password);
            $("input[name='submxxit']").click();
            dologin();
        }
        $("#fm1").submit(function (e) {
            userid = $("#txtusername1").val();
            password = $("#txtpassword1").val();
            window.localStorage.setItem("userid", userid);
            window.localStorage.setItem("password", password);
            console.log("账号密码" + userid + "," + password);
        });
        $('input[name="submxxit"]').click(function () {
            userid = $("#txtusername1").val();
            password = $("#txtpassword1").val();
            window.localStorage.setItem("userid", userid);
            window.localStorage.setItem("password", password);
            console.log("账号密码" + userid + "," + password);
        });
        //登录页面自动登录
        if (url_href.indexOf("sso/login") != -1) {
            if ($("#msg").text().indexOf("登录成功") != -1) {
                window.location.href = "http://www.cmatc.cn/lms/app/lms/student/Userdashboardinfo/show.do";
            } else {
                $("body").append(clearDiv);
                if (userid == null || userid == "null" || userid == "") {
                    console.log("ID为空");
                    return;
                }
                $("#txtusername1").val(userid);
                $("#txtpassword1").val(password);
                hintMsg();
            }
        }
        var tt = 20;
        function hintMsg() {
            if (tt === 0) {
                autoLogin();
                return;
            } else {
                tt--;
                $("input.btn-submit").val(tt + "秒后将自动登录");
            }
            setTimeout(function () {
                hintMsg();
            }, 1000);
        }
        // if (url_href.indexOf("/index/index.shtml") != -1) {
        // 	var loginMsg = $("#loginMsg").text();
        // 	setTimeout(function () {
        // 		window.location.href = "http://www.cmatc.cn/lms/app/tms/sfi/StudyContent/year.do";
        // 	}, 120000);
        // 	if (loginMsg == "用户登录") {
        // 		window.location.href = "http://www.cmatc.cn/sso/login?service=http%3A%2F%2Fwww.cmatc.cn%2Flms%2Fj_spring_cas_security_check";
        // 	}
        // }
        //学员首页120秒跳转个人信息，跳来跳去不掉线loginMsg
        if (url_href.indexOf("userdashboardinfo/show.do") != -1) {
            //console.log("StudyContent");
            var loginMsg1 = $("#loginMsg").text();
            setTimeout(function () {
                window.location.href = "http://www.cmatc.cn/lms/app/tms/sfi/StudyContent/year.do";
            }, 120000);
            if (loginMsg1 == "用户登录") {
                window.location.href = "http://www.cmatc.cn/sso/login?service=http%3A%2F%2Fwww.cmatc.cn%2Flms%2Fj_spring_cas_security_check";
            }
        }
        //个人中心120秒跳转个人信息，跳来跳去不掉线
        if (url_href.indexOf("studycontent/year.do") != -1) {
            //console.log("StudyContent");
            var loginMsg2 = $("#loginMsg").text();
            setTimeout(function () {
                window.location.href = "http://www.cmatc.cn/lms/app/tms/sfi/StudyContent/year.do";
            }, 120000);
            if (loginMsg2 == "用户登录") {
                window.location.href = "http://www.cmatc.cn/sso/login?service=http%3A%2F%2Fwww.cmatc.cn%2Flms%2Fj_spring_cas_security_check";
            }
        }
        //个人信息120秒跳转个人中心，跳来跳去不掉线
        if (url_href.indexOf("student/self.do") != -1) {
            //console.log("self");
            var loginMsg3 = $("#loginMsg").text();
            setTimeout(function () {
                window.location.href = "http://www.cmatc.cn/lms/app/tms/sfi/StudyContent/year.do";
            }, 120000);
            if (loginMsg3 == "用户登录") {
                window.location.href = "http://www.cmatc.cn/sso/login?service=http%3A%2F%2Fwww.cmatc.cn%2Flms%2Fj_spring_cas_security_check";
            }
        }
        //个人信息120秒跳转个人中心，跳来跳去不掉线
        if (url_href.indexOf("student/userdashboardinfo/showtrainclass.do") != -1) {
            //console.log("self");
            let loginMsg4 = $("#loginMsg").text();
            setTimeout(function () {
                window.location.href = "http://www.cmatc.cn/lms/app/tms/sfi/StudyContent/year.do";
            }, 120000);
            if (loginMsg4 == "用户登录") {
                window.location.href = "http://www.cmatc.cn/sso/login?service=http%3A%2F%2Fwww.cmatc.cn%2Flms%2Fj_spring_cas_security_check";
            }
        }
        var errorMsgCount = 0;
        //防止出现“点击继续观看”
        if (
            url_href.indexOf("enterurl") != -1 ||
            url_href.indexOf("stream2") != -1 ||
            url_href.indexOf("resource/course") != -1 ||
            url_href.indexOf("exitplaytime") != -1 ||
            document.getElementsByTagName("video").length > 0
        ) {
            console.log("这是学习的页面");
            $("#studentId").text("5秒后自动开始");
            setInterval(function () {
                try {
                    $("#course_player").prop("muted", 1); //静音
                    $("#ckplayer_a1").prop("muted", 1); //静音
                    $("video").prop("muted", 1); //静音
                    $("#msgbt").click(); //点击继续播放
                    if ($(".continue").css("display") != "none") {
                        $(".user_choise").click();
                    } //点击开始播放
                    $("#studentId").text("已开启：自动静音、自动点击继续观看");
                } catch (err) {
                    errorMsgCount = errorMsgCount + 1;
                    if (errorMsgCount <= 3) console.log(err);
                }
            }, 5000);
        }
        function getQueryVariable(urlStr, variable) {
            var vars = urlStr.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return false;
        }
        function postLearnTime(userId, lessonId, coursewareId, tclessonId, lessonOrigin, lessonGkey, exitplaytime, uncle) {
            if (uncle.attr("title") == "100%") {
                console.log("已完成");
                // window.location.reload();
                return;
            }
            let data = {
                userId: userId,
                lessonId: lessonId,
                coursewareId: coursewareId,
                tclessonId: tclessonId,
                lessonOrigin: lessonOrigin,
                standard: "6",
                isMobile: "0",
                isPreview: "false",
                lessonGkey: lessonGkey,
                exitplaytime: exitplaytime,
                serverId: "9002",
                learntime: "120",
            };
            let url = "http://www.cmatc.cn/lms/app/lms/student/Learn/recordLearnTimePro.do";
            $.ajax({
                url: url,
                type: "POST",
                data: data,
                success: function (data) {
                    console.log(data);
                },
            });
        }
        function getJindu(lessonId, tclessonId, lessonOrigin, uncle, e_index, bt_a) {
            let data = {
                lessonId: lessonId,
                tclessonId: tclessonId,
                lessonOrigin: lessonOrigin,
            };
            let url = "http://www.cmatc.cn/lms/app/lms/student/Userselectlesson/commonlessonpasscond.do";
            $.ajax({
                url: url,
                type: "POST",
                data: data,
                success: function (data) {
                    //console.log(data);
                    let progress = "0";
                    var matchReg = /(?<=学习进度为).*?(?=%，)/;
                    var p = data.match(matchReg);
                    progress = p?.toString() | "0";
                    $("#progress" + e_index).text(progress + "%");
                    $(uncle)
                        .find(".jindu_green")
                        .css("width", progress + "%");
                    // $(uncle).textContent=progress + "%";
                },
            });
        }
        /*一键全学功能*/
        function addYJQX() {
            var table0 = $("table.table-list");
            var tr0 = table0.find("tr:eq(0)");
            var th = tr0.find("th:last");
            var isExecuting = false;
            var learnWindow = null; // 存储固定复用的窗口对象

            if (th.text().trim() === "学习") {
                th.css({ width: "120px", cursor: "pointer",color: "red" }).text("点此全部学5秒");

                th.off("click").on("click", function () {
                    if (isExecuting) {
                        alert("正在执行一键全学，请稍等！");
                        return;
                    }
                    if (confirm("确定要一键全学吗？")) {
                        isExecuting = true;
                        var links = $('a[id^="myspan"]');
                        var linkIndex = 0; // 当前要处理的链接索引

                        // 递归处理每个链接（核心：逐个处理，8秒/个）
                        function handleNextLink() {
                            // 所有链接处理完毕
                            if (linkIndex >= links.length) {
                                isExecuting = false;
                                // 可选：处理完关闭窗口
                                // learnWindow && learnWindow.close();
                                learnWindow = null;
                                return;
                            }

                            var link = links[linkIndex];
                            var href = link.getAttribute("href");
                            // 有效地址才处理
                            if (href && href !== "#" && href !== "") {
                                // 复用窗口：窗口不存在/已关闭则新建，否则更新地址
                                if (!learnWindow || learnWindow.closed) {
                                    learnWindow = window.open(href, "learnWindow", "width=800,height=600");
                                } else {
                                    learnWindow.location.href = href;
                                }
								// 把link改成自动在学状态
                                $(link).text("自动在学").css("color", "green");
                            }

                            linkIndex++;
                            // 8秒后处理下一个
                            setTimeout(handleNextLink, 12000);
                        }

                        // 启动第一个链接处理
                        if (links.length === 0) {
                            isExecuting = false;
                            alert("未找到可学习的链接！");
                        } else {
                            handleNextLink();
                        }
                    }
                });
            }
        }
        //加装科学学习按钮
        if (url_href?.indexOf("userselectlesson") !== -1) {
            // 300秒刷新页面（保留原有逻辑）
            setTimeout(function () {
                window.location.reload();
            }, 300000);

            setTimeout(function () {
                // 存储定时器，用于后续清理
                const intervalTimers = [];
                const by = $("head").text() || "";
                const matchReg = /(?<=userId\":\").*?(?=\",\"lessonId)/;
                const userIdMatch = by.match(matchReg);
                const userId = userIdMatch?.toString() || ""; // 容错：无匹配时赋空

                // 清理注释标签（保留原有逻辑）
                $("div.btn_box").each(function () {
                    let box_html = $(this).html() || "";
                    box_html = box_html.replace(/<!--/g, "").replace(/-->/g, "");
                    $(this).html(box_html);
                });

                $("a.learn").each(function () {
                    const $sp = $(this);
                    const $uncle = $sp.parent().prev();
                    const progress = $uncle.attr("title") || ""; // 容错：无title赋空

                    // 100%直接标记已完成
                    if (progress === "100%") {
                        $sp.text("已完成");
                        return;
                    }

                    if ($sp.text().trim() === "学习") {
                        $sp.text("学习").css("background-color", "grey").css("display", "none");

                        // 容错：onclick属性不存在时直接返回
                        const onclck_str = $sp.attr("onclick") || "";
                        if (onclck_str.length < 23) return;

                        // 解析参数（加容错）
                        const msgs = onclck_str.substring(23, onclck_str.length - 2) || "";
                        const lst = msgs.split(",").map((item) => item.replace(/\'/g, "")); // 统一清理单引号
                        const lessonId = lst[0] || "";
                        const coursewareId = lst[1] || "";
                        const lessonGkey = lst[2] || "";

                        // 解析URL参数（加容错）
                        const tclessonId = getQueryVariable(url_href, "tclessonid") || 0;
                        const lessonOrigin = getQueryVariable(url_href, "lessonorigin") || "selflearn";

                        let msg = "自动在学";
                        let cr = "green";
                        let hrefs = "#";
                        const e_index = coursewareId; // 保留原有命名
                        const baseUrl = "http://www.cmatc.cn/lms/app/lms/student/Learn/enter.do";

                        // 处理进度为0的情况（兼容0%/0.0%）
                        if (["0%", "0.0%"].includes(progress)) {
                            msg = "点此自学5秒";
                            cr = "red";
                            hrefs = `${baseUrl}?lessonId=${lessonId}&coursewareId=${coursewareId}&lessonGkey=${lessonGkey}&tclessonId=${tclessonId}&lessonOrigin=${lessonOrigin}`;
                        } else {
                            // 执行学习时长提交（函数存在性检查）
                            typeof postLearnTime === "function" && postLearnTime(userId, lessonId, coursewareId, tclessonId, lessonOrigin, lessonGkey, 0, $uncle);
                            // 定时提交（保存定时器，避免内存泄漏）
                            const timer = setInterval(function () {
                                typeof postLearnTime === "function" && postLearnTime(userId, lessonId, coursewareId, tclessonId, lessonOrigin, lessonGkey, 0, $uncle);
                            }, 35000);
                            intervalTimers.push(timer);
                        }

                        // 创建新链接
                        const spans = `<a id="myspan${e_index}" class="learn" target=_blank href="${hrefs}" style="width:100px;color:${cr};">${msg}</a>`;
                        $sp.after(spans);

                        // 绑定点击事件（先解除再绑定，避免重复）
                        $(`#myspan${e_index}`)
                            .off("click")
                            .on("click", function () {
                                $(this).text("自动在学").css("color", "green");
                            });
                    }
                });

                // 执行一键全学（函数存在性检查）
                typeof addYJQX === "function" && addYJQX();

                // 页面卸载时清理定时器（避免内存泄漏）
                $(window).on("beforeunload", function () {
                    intervalTimers.forEach((timer) => clearInterval(timer));
                });
            }, 5000);
        }
        if (url_href.indexOf("recordlearntime") != -1) {
            _submitLearnTime(120);
            setInterval(function () {
                _submitLearnTime(120);
            }, 35000);
        }
    });
})();
