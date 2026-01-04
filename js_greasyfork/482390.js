// ==UserScript==
// @name         ccu脚本
// @namespace    https://github.com/Auroraol
// @version      0.1
// @description  try to take over the world!
// @author       lfj
// @match        https://cdjwc.webvpn.ccu.edu.cn/*
// @match        https://cdjwc.webvpn.ccu.edu.cn/jsxsd/
// @match        https://cdjwc.webvpn.ccu.edu.cn/jsxsd/#
// @match        https://cdjwc.webvpn.ccu.edu.cn/jsxsd/xspj/xspj_find.do*
// @match        https://cdjwc.webvpn.ccu.edu.cn/jsxsd/xspj/xspj_list.do*
// @match        https://cdjwc.webvpn.ccu.edu.cn/jsxsd/xspj/xspj_edit.do*
// @match        https://cdjwc.webvpn.ccu.edu.cn/jsxsd/framework/main.jsp
// @match        https://cdjwc.webvpn.ccu.edu.cn/jsxsd/framework/xsMain.jsp
// @match        https://cdjwc.webvpn.ccu.edu.cn/jsxsd/kscj/cjcx_query*
// @match        http://1.1.1.2/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.1.0.js
// @downloadURL https://update.greasyfork.org/scripts/482390/ccu%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/482390/ccu%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    /* eslint no-eval: "off" */
    /*******************************************校园网********************************************************/
    var user = "19390025718"; //校园网账号
    var pwd = "000000"; //校园网密码
    if (window.location.href.startsWith("http://1.1.1.2/")){
        /******************************************校园网********************************************************/
        $("#password_name").val(user);
        $("#password_pwd").val(pwd);
        $("#password_submitBtn").click();
    }else if (window.location.href.startsWith("http://1.1.1.2/homepage/")) {
        window.close();
    }else if (window.location.href === "https://cdjwc.webvpn.ccu.edu.cn/jsxsd/" || window.location.href === "https://cdjwc.webvpn.ccu.edu.cn/jsxsd/#" || window.location.href === "https://cdjwc.webvpn.ccu.edu.cn/") {
        /*******************************************界面********************************************************/
        // 添加 Bootstrap 5 的 CSS 文件
        var bootstrapCss = document.createElement('link');
        bootstrapCss.rel = 'stylesheet';
        bootstrapCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
        document.head.appendChild(bootstrapCss);

        // 添加 Bootstrap Icons 的 CSS 文件
        var bootstrapIconCss = document.createElement('link');
        bootstrapIconCss.rel = 'stylesheet';
        bootstrapIconCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
        document.head.appendChild(bootstrapIconCss);

        if (self == top) {
            // 用于检查当前页面是否是顶层页面
            GM_addStyle(` #main{position:fixed;right:0px;bottom:100px;background:#fff}
#main-hd{font-size:14px;line-height:30px;overflow:hidden;box-sizing:border-box;height:30px;padding:0 10px;cursor:pointer;white-space:nowrap;text-overflow:ellipsis;color:#fff;background:#4d90fe}
#main-hd svg{display:none;margin-top:2px}
#main-bd{box-sizing:border-box;height:320px;padding:10px;border:1px solid #ccc}
.mainSmallHead{width:35px}
.mainSmallHead #main-hd{margin: 0 auto; box-shadow:1px 2px 3px rgba(12,12,12,.3)}
.mainSmallHead #main-hd span{display:none}`)

            // 添加内容
            var smallCnt = `<div id="main"><div id="main-hd"><span>ccu教务系统</span><i class="bi-list"></i></div><div id="main-bd"><div class="form-group relative"><label for="text"class="form-label">用户名:</label><input id="login_username"autocomplete="off"class="form-control form-control-sm"type="text"placeholder="用户名"required=""></div><div class="form-group relative"><label for="pwd"class="form-label">密码:</label><input id="login_password"class="form-control form-control-sm"type="password"placeholder="密码"required=""></div><div class="form-check"><input class="form-check-input"type="checkbox"id="check1"name="option1"value="something"><label class="form-check-label">记住密码</label></div><div class="form-check form-switch"><input class="form-check-input"type="checkbox"id="automatic_login"name="darkmode"value="yes"><label class="form-check-label"for="automatic_login">自动登录</label></div><div class="form-check form-switch"><input class="form-check-input"type="checkbox"id="appraise"name="darkmode"value="yes"><label class="form-check-label"for="appraise">一键进行评教</label></div><div class="form-check form-switch"><input class="form-check-input"type="checkbox"id="query_class"name="darkmode"value="yes"><label class="form-check-label"for="query_class">一键查询课表</label></div><div class="form-check form-switch"><input class="form-check-input"type="checkbox"id="query_performance"name="darkmode"value="yes"><label class="form-check-label"for="query_performance">一键查询成绩</label></div><div><p class="fs-5"id="countdown">运行倒计时：5 秒</p></div><div class="row"><button type="button"class="btn btn-primary btn-sm"id="start_run">未运行</button></div></div></body>`

            $("body").append(smallCnt);

            /*******************************************界面********************************************************/
            // 点击缩小事件
            $('#main-hd').click(function () {
                $('#main').toggleClass('mainSmallHead')
                $('#main-bd').slideToggle()
            })

            // 当用户名或密码输入框的值发生变化时取消复选框的选中状态
            $('#login_username, #login_password').on('input', function () {
                $('#check1').prop('checked', false);
                $('#automatic_login').prop('checked', false);
                $('#appraise').prop('checked', false);
                $('#query_performance').prop('checked', false);
                $('#query_class').prop('checked', false);
                localStorage.removeItem('automatic_login');
                localStorage.removeItem('appraise');
                localStorage.removeItem('query_performance');
                localStorage.removeItem('query_class');

                if (localStorage.getItem('start_run') === "true") {
                    $('#start_run').click();
                }
            });

            // 当用户点击记住密码时保存用户名和密码到本地存储
            $('#check1').on('change', function () {
                localStorage.setItem('rememberPassword', $(this).is(':checked'));
                if ($(this).is(':checked')) {
                    localStorage.setItem('username', $('#login_username').val());
                    localStorage.setItem('password', $('#login_password').val());
                } else {
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                    localStorage.removeItem('automatic_login');
                    localStorage.removeItem('appraise');
                    localStorage.removeItem('query_performance');
                    localStorage.removeItem('query_class');
                }
            });

            // 改变登录事件
            $('#automatic_login').on('change', function () {
                if ($(this).is(':checked')) {
                    localStorage.setItem('automatic_login', $(this).is(':checked'));
                    //操作

                } else {
                    localStorage.removeItem('automatic_login');
                }
            });
            // 一键进行评教事件
            $('#appraise').on('change', function () {
                if ($(this).is(':checked')) {
                    localStorage.setItem('appraise', $(this).is(':checked'));
                    //操作


                } else {
                    localStorage.removeItem('appraise');
                }
            });
            // 一键查询成绩事件
            $('#query_performance').on('change', function () {
                if ($(this).is(':checked')) {
                    localStorage.setItem('query_performance', $(this).is(':checked'));
                    //操作
                } else {
                    localStorage.removeItem('query_performance');
                }
            });

            // 一键查询课表事件
            $('#query_class').on('change', function () {
                if ($(this).is(':checked')) {
                    localStorage.setItem('query_class', $(this).is(':checked'));
                } else {
                    localStorage.removeItem('query_class');
                }
            });

            var countdownElement = $('#countdown');
            var countdown = 5;
            var countdownInterval; // 声明在点击事件外部
            let cInterval;
            $('#start_run').click(function () {

                if ($(this).text() === "未运行") {
                    // 如果点击未运行
                    $(this).text('正在运行');
                    localStorage.setItem('start_run', "true");
                    // 禁用复选框按钮
                    $('#automatic_login').prop('disabled', true);
                    $('#appraise').prop('disabled', true);
                    $('#query_performance').prop('disabled', true);
                    $('#query_class').prop('disabled', true);
                    countdown = 5;
                    countdownInterval = setInterval(() => {
                        countdownElement.text('运行倒计时：' + countdown + ' 秒');
                        countdown--;
                        if (countdown < 0) {
                            // 如果选中任何一个功能
                            if (localStorage.getItem('automatic_login') === 'true' || localStorage.getItem('appraise') === 'true'
                                || localStorage.getItem('query_performance') === 'true' || localStorage.getItem('query_class') === 'true') {

                                countdownElement.text('倒计时结束-运行');
                                // 操作
                                if (window.location.href.startsWith("https://cdjwc.webvpn.ccu.edu.cn/jsxsd/") && localStorage.getItem('automatic_login')) {
                                    localStorage.setItem('indexNext', '0');
                                    $("#userAccount").val(localStorage.getItem('username'));
                                    $("#userPassword").val(localStorage.getItem('password'));
                                    $("#btnSubmit").click();
                                }


                                //
                            } else {
                                countdown = 5;
                                countdownElement.text('请选择一个功能');
                                // 启用复选框按钮
                                $('#automatic_login').prop('disabled', false);
                                $('#appraise').prop('disabled', false);
                                $('#query_performance').prop('disabled', false);
                                $('#query_class').prop('disabled', false);
                                $("#start_run").text('未运行');
                                localStorage.setItem('start_run', "false");
                            }

                            clearInterval(countdownInterval);
                        }

                    }, 1000);

                } else {
                    $(this).text('未运行');
                    if (countdownInterval) {
                        clearInterval(countdownInterval);
                    } if (cInterval) {
                        clearInterval(cInterval);
                    }
                    countdown = 5; // 重置倒计时时间
                    countdownElement.text('运行倒计时：5 秒');
                    localStorage.setItem('start_run', "false");
                    // 启用复选框按钮
                    $('#automatic_login').prop('disabled', false);
                    $('#appraise').prop('disabled', false);
                    $('#query_performance').prop('disabled', false);
                    $('#query_class').prop('disabled', false);
                }
            });


            // 初始化
            // 页面加载时检查本地存储中是否有用户名和密码，并填充到输入框中
            if (localStorage.getItem('username')) {
                $('#login_username').val(localStorage.getItem('username'));
            }
            if (localStorage.getItem('password')) {
                $('#login_password').val(localStorage.getItem('password'));
            }
            if (localStorage.getItem('automatic_login') === 'true') {
                $('#automatic_login').prop('checked', true);
            } else {
                $('#automatic_login').prop('checked', false);
            }

            if (localStorage.getItem('appraise') === 'true') {
                $('#appraise').prop('checked', true);
            } else {
                $('#appraise').prop('checked', false);
            }
            if (localStorage.getItem('query_performance') === 'true') {
                $('#query_performance').prop('checked', true);
            } else {
                $('#query_performance').prop('checked', false);
            }
            if (localStorage.getItem('query_class') === 'true') {
                $('#query_class').prop('checked', true);
            } else {
                $('#query_class').prop('checked', false);
            }
            if (localStorage.getItem('rememberPassword') === 'true') {
                $('#check1').prop('checked', true);
            } else {
                $('#check1').prop('checked', false);
                localStorage.removeItem('automatic_login');
                localStorage.removeItem('appraise');
                localStorage.removeItem('query_performance');
            }

            if (localStorage.getItem('start_run') === 'true') {
                // 如果选中任何一个功能
                if (localStorage.getItem('automatic_login') === 'true' || localStorage.getItem('appraise') === 'true'
                    || localStorage.getItem('query_performance') === 'true' ||localStorage.getItem('query_class') === 'true' ) {
                    $("#start_run").text('正在运行');
                    // 禁用复选框按钮
                    $('#automatic_login').prop('disabled', true);
                    $('#appraise').prop('disabled', true);
                    $('#query_performance').prop('disabled', true);
                    $('#query_class').prop('disabled', true);
                    countdown = 5;
                    cInterval = setInterval(function () {
                        countdownElement.text('运行倒计时：' + countdown + ' 秒');
                        countdown--;
                        if (countdown < 0) {
                            clearInterval(cInterval);
                            countdownElement.text('倒计时结束-运行');
                            //
                            if (window.location.href.startsWith("https://cdjwc.webvpn.ccu.edu.cn/jsxsd/") && localStorage.getItem('automatic_login')) {
                                localStorage.setItem('indexNext', '0');
                                $("#userAccount").val(localStorage.getItem('username'));
                                $("#userPassword").val(localStorage.getItem('password'));
                                $("#btnSubmit").click();
                            }
                            //
                        }
                    }, 1000);
                }

            } else {
                //  如果是从账号密码错误 *
                if (localStorage.getItem("err_flag") === 'true') {
                    countdownElement.text('账号密码错误!');
                    localStorage.setItem('err_flag', "false");

                }

                $("#start_run").text('未运行');
                localStorage.removeItem('start_run')
            }
        }
}
///账号密码错误跳转到https://cdjwc.webvpn.ccu.edu.cn/jsxsd/xk/LoginToXk
else if (window.location.href === "https://cdjwc.webvpn.ccu.edu.cn/jsxsd/xk/LoginToXk") {
    window.location.href = "https://cdjwc.webvpn.ccu.edu.cn/jsxsd";
    localStorage.setItem("err_flag", "true");
    localStorage.removeItem('start_run');

}else if (window.location.href.startsWith("https://cdjwc.webvpn.ccu.edu.cn/jsxsd/framework/")
          && localStorage.getItem('appraise')) {
    //跳转评教页面
    var link = $('a[href="/jsxsd/xspj/xspj_find.do?Ves632DSdyV=NEW_XSD_JXPJ"]').prop('href');
    console.log(link);
    if (link) {
        window.location.href = link;
    }
}else if (window.location.href.startsWith("https://cdjwc.webvpn.ccu.edu.cn/jsxsd/framework/")
          && localStorage.getItem('query_performance')) {
    //跳转成绩页面
    let link = $('a[href="/jsxsd/kscj/cjcx_query?Ves632DSdyV=NEW_XSD_XJCJ"]').prop('href');
    console.log(link);
    if (link) {
        window.location.href = link;
    }
}else if (window.location.href.startsWith("https://cdjwc.webvpn.ccu.edu.cn/jsxsd/framework/")
          && localStorage.getItem('query_class')) {
    //跳转课表页面
    let link = $('a[href="/jsxsd/xskb/xskb_list.do?Ves632DSdyV=NEW_XSD_PYGL"]').prop('href');
    console.log(link);
    if (link) {
        //console.log(link);
        window.location.href = link;
    }

}else if (window.location.href.startsWith("https://cdjwc.webvpn.ccu.edu.cn/jsxsd/xspj/xspj_find.do")) {
    /******************************************评交********************************************************/
    processPage1();
} else if (window.location.href.startsWith("https://cdjwc.webvpn.ccu.edu.cn/jsxsd/xspj/xspj_list.do")) {
    processPage2();
} else if (window.location.href.startsWith("https://cdjwc.webvpn.ccu.edu.cn/jsxsd/xspj/xspj_edit.do")) {
    processPage3();
}
    else if (window.location.href.startsWith("https://cdjwc.webvpn.ccu.edu.cn/jsxsd/kscj/cjcx_query")){
        /******************************************查成绩********************************************************/
        $('#kksj option:eq(2)').prop('selected', true);
        $('#btn_query').click();
    }

//学生评教
function processNextLink() {
    var links = $("a[title='点击进入评价']").map(function() {
        return $(this).prop('href');
    }).get();
    console.log(links);
    // 从localStorage获取indexNext的值
    var indexNext = localStorage.getItem('indexNext');
    if (indexNext === null) {
        // 如果localStorage中没有indexNext的值，将其初始化为0
        indexNext = 0;
    } else {
        // 否则，将indexNext转换为数字
        indexNext = parseInt(indexNext, 10);
    }
    console.log(indexNext);
    if (links.length > 0 && links.length > indexNext) {
        localStorage.setItem('nextOk', '0');
        var nextLink = links[indexNext];
        window.location.href = nextLink;
    }
}

function processPage1() {
    console.log("https://cdjwc.webvpn.ccu.edu.cn/jsxsd/xspj/xspj_find.do");
    processNextLink();
}

var index = 0;
function processPage2() {
    console.log(" https://cdjwc.webvpn.ccu.edu.cn/jsxsd/xspj/xspj_list.do");
    var rows = $('#dataList tr');
    processRow(rows); // 开始处理第一行
}

function processRow(rows) {
    // 如果所有行都已处理，点击返回按钮
    if ($('#dataList tr td:contains("否")').length === 0) {
        //indexNext++;
        //console.log(indexNext);
        // 允许processPage1, 切换到下一页
        // 在你需要增加indexNext的地方，增加indexNext并将其保存到localStorage
        var indexNext = localStorage.getItem('indexNext');
        indexNext++;
        localStorage.setItem('indexNext', indexNext.toString());
        $('#btnShenshen').click();
        return;
    }
    if (index >= rows.length) {
        // 如果所有行都已处理，点击返回按钮
        if ($('#dataList tr td:contains("否")').length != 0) {

            window.location.reload(); //刷新当前页面
            //index = 0
            //processRow(rows);// 处理下一行
        }
        // return;

    }
    var tdText = $(rows[index]).find('td').eq(7).text();// 获取第7列的文本
    if (tdText === '否') {
        // 如果有未评价的行，获取评价链接
        var jsCode = $(rows[index]).find('a:contains("评价")').attr('href');
        // 打开弹出填写表单窗口
        eval(jsCode.substring(11))

    }
    // 检查弹出窗口是否关闭
    var checkPopupClosed = setInterval(function() {
        console.log(index)
        index++;// 增加索引
        processRow(rows);// 处理下一行
    }, 10000);
}

function processPage3(){
    console.log("https://cdjwc.webvpn.ccu.edu.cn/jsxsd/xspj/xspj_edit.do");
    var script = document.createElement('script');
    script.textContent = 'window.confirm = function() { return true; };';
    $('head').append(script);
    var neueInhalte = ["让学生熟练掌握课程知识，并能够以生动有趣的方式向学生传授知识。老师善于激发学生的学习兴趣，制定富有启发性的教学计划并引导学生深入思考与研究。", "实践环节：通过实际的项目和案例研究，帮助学生将理论知识应用到实际工作中，提高他们的技能和应用能力。"];
    var text = $(".Nsb_r_list_thb").text().trim(); // 获取文本并去除前后的空白字符
    if (text.startsWith("评教大类：理论课学生评价")) {
        $("#pj0601id_1_2").prop("checked", true);
        $("#pj0601id_3_1").prop("checked", true);
        $("#pj0601id_9_1").prop("checked", true);
        $("#pj0601id_7_1").prop("checked", true);
        $("#pj0601id_8_1").prop("checked", true);
        $("#pj0601id_2_1").prop("checked", true);
        $("#pj0601id_10_1").prop("checked", true);
        $("#pj0601id_5_1").prop("checked", true);
        $("#pj0601id_6_1").prop("checked", true);
        $("#pj0601id_4_1").prop("checked", true);
        $("textarea[name='jynr']").each(function(index, value) {
            $(this).text(neueInhalte[index]);
        });
    } else if (text.startsWith("评教大类：实践环节学生评价")) {
        $("#pj0601id_3_2").prop("checked", true);
        $("#pj0601id_1_1").prop("checked", true);
        $("#pj0601id_2_1").prop("checked", true);
        $("#pj0601id_4_1").prop("checked", true);
        $("#pj0601id_5_1").prop("checked", true);
        $("textarea[name='jynr']").each(function(index, value) {
            $(this).text(neueInhalte[1- index]);
        });
    }
    $("#tj").click();
}

})();