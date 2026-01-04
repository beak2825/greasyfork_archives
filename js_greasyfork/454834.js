// ==UserScript==
// @name        【小了白了兔】网课助手(开发测试版)
// @namespace   https://bbs.tampermonkey.net.cn/
// @description 已支持【学习通】【陕西省继续教育平台】吉林/山西/江苏/江西/浙江/广西/云南/新疆/贵州/甘肃/青海/宁夏/湖南/湖北/山东各省继续教育平台挂机脚本正在开发中。
// @version     1.0.9
// @author      小了白了兔
// @storageName yike
// @compatible  chrome firefox edge
// @license MIT
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_openInTab
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener

// @match       *://*

// @connect     85530a3e-fc46-4ea4-a542-160dad54a088.bspapp.com
// @connect     http://jxjy01.xidian.edu.cn/newLogin.jsp
// @connect     http://jxjy01.xidian.edu.cn/u/student/training/index.action
// @connect     https://mooc1.chaoxing.com/ananas/modules/video/index.html

// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/interact.js/1.10.17/interact.min.js
// @require-css https://vkceyugu.cdn.bspapp.com/VKCEYUGU-85530a3e-fc46-4ea4-a542-160dad54a088/5895b760-6bac-4f7f-9602-82b3465bbbae.css



// @downloadURL https://update.greasyfork.org/scripts/454834/%E3%80%90%E5%B0%8F%E4%BA%86%E7%99%BD%E4%BA%86%E5%85%94%E3%80%91%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%28%E5%BC%80%E5%8F%91%E6%B5%8B%E8%AF%95%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/454834/%E3%80%90%E5%B0%8F%E4%BA%86%E7%99%BD%E4%BA%86%E5%85%94%E3%80%91%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%28%E5%BC%80%E5%8F%91%E6%B5%8B%E8%AF%95%E7%89%88%29.meta.js
// ==/UserScript==
//----------公共部分开始




/* // @require     https://vkceyugu.cdn.bspapp.com/VKCEYUGU-85530a3e-fc46-4ea4-a542-160dad54a088/3cf73a9c-154f-4087-8910-dcda60f50038.js
// @require     https://vkceyugu.cdn.bspapp.com/VKCEYUGU-85530a3e-fc46-4ea4-a542-160dad54a088/6803fb98-583d-4819-9d7a-cd03e113f3ed.js */

/* // @match       *://*.jxjy01.xidian.edu.cn/newLogin.jsp*
// @match       *://*.jxjy01.xidian.edu.cn/u/student/training/index.action*
// @match       *://*.jxjy01.xidian.edu.cn/learnspace/learn/learn/templatethree/index.action*

// @match       *://i.chaoxing.com*
// @match       *://*.mooc1-1.chaoxing.com*
// @match       *://*.mooc2-ans.chaoxing.com*
// @match       *://*.mooc1.chaoxing.com/mycourse/studentstudy*

// @match       *://*.kdsx.bwgl.cn*
 */




const style = ".yike a{color:rgb(15,103,235);text-decoration:none;}.yike a:hover{color:#093;text-decoration:none;}.yike .tab_status{height:100%;width:100%;}.yike .not_login{width:100%;height:100%;display:flex;justify-content:center;align-items:center;flex-direction:column;}.yike .not_login button{align-self:flex-end;margin-top:6px;margin-right:20px;width:20%;height:40px;background-color:#093;color:#fff;border:none;border-radius:5px;}.yike .not_login button:active{border:1px solid #ddd;}.yike .op{display:flex;justify-content:space-between;align-items:center;width:100%;}.yike .op .login_info{color:#093;margin-left:20px;}.yike .not_login .text{text-align:right;position:absolute;bottom:10px;right:10px;}.yike .not_login input{border:1px solid #333;background-color:#f9f9f9;border-radius:5px;padding:13px;outline:0;width:80%;}.yike h4{color:#333;font-size:14px;text-align:left;margin:10px 0;}.yike .intro{width:100%;height:100%;padding:15px;text-align:left;}.yike .log{width:100%;height:100%;display:flex;align-items:flex-start;flex-direction:column;padding:5px;overflow:auto;}.yike .log .item{margin:3px 0px;}.yike .log .item .time{margin-right:5px;}.yike .log .error p{color:brown;}.yike .has_login{position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;width:100%;height:100%;}.yike .has_login .left_time,.yike .has_login .client{margin:5px;}.yike .has_login .vali_code{position:absolute;left:8px;bottom:5px;display:flex;justify-content:flex-start;align-items:center;}.yike .has_login .vali_code .copy{margin-left:5px;background-color:#093;color:#fff;border-radius:3px;border:2px solid #095;}.yike .box{width:360px;height:240px;background:#fff;border:1px solid #d3d3d3;position:absolute;bottom:30px;right:30px;z-index:999999;font-size:12px;}.yike .tab_menu{overflow:hidden;}.yike .tab_menu li{width:33.3%;float:left;height:30px;line-height:30px;color:#fff;background:#093;text-align:center;cursor:pointer;}.yike .tab_menu li.current{color:#333;background:#fff;}.yike .tab_box{height:210px;position:relative;}.yike .tab_box li{height:24px;line-height:24px;overflow:hidden;}.yike .tab_box li span{margin:0 5px 0 0;font-weight:400;color:#ddd;}.yike .tab_box .hide{display:none;}";
let html = "";
html += "<div class=\"yike\">";
html += "		<div class=\"box demo2\">";
html += "			<ul class=\"tab_menu\">";
html += "				<li>启动脚本<\/li>";
html += "				<li>使用说明<\/li>";
html += "				<li class=\"current\">运行日志<\/li>";
html += "			<\/ul>";
html += "			<div class=\"tab_box\">";
html += "				<div class=\"tab_status hide\">";
html += "					<div class=\"not_login hide\"> <input class=\"input\" placeholder=\"请输入32位注册码\"";
html += "							value=\"04ANIF1DH8I4VL4P121CWIND8MG5Y5UN\">";
html += "						<div class=\"op\"> <span class=\"login_info\"><\/span> <button class=\"btn\">启动脚本<\/button> <\/div> <a";
html += "							class=\"text\">充值\/咨询\/成为代理<\/a>";
html += "					<\/div>";
html += "					<div class=\"has_login\">";
html += "						<div class=\"vali_code\"> <span class=\"text\"><\/span> <button class=\"copy\">复制<\/button> <\/div>";
html += "						<div class=\"left_time\">剩余时间: <span class=\"text\"><\/span> <\/div>";
html += "					<\/div>";
html += "				<\/div>";
html += "				<div class=\"intro hide\"> <\/div>";
html += "				<div class=\"log\"> <\/div>";
html += "			<\/div>";
html += "		<\/div>";
html += "	<\/div>";




let timers = {};

let run = undefined;

let stop = function () {
    stop_timer();
};

let _script = undefined;//当前的脚本对象

let script_id = undefined;

const back_url = "https://85530a3e-fc46-4ea4-a542-160dad54a088.bspapp.com/user";

const url = window.location.host + window.location.pathname;

const test_vali_code = "04ANIF1DH8I4VL4P121CWIND8MG5Y5UN";




//向后台请求计费，每5分钟一次
const fee = function () {

    window.setInterval(function () {
        const curent_time = new Date().getTime();

        const script = GM_getValue("script", {});

        const vali_code_info = GM_getValue("vali_code_info", {});

        if (script.script_id == undefined) {

            yike_log("error", "未找到脚本注册信息，程序执行错误，请重启浏览器并再次运行脚本");

            return;

        }

        const last_active_time = script.last_active_time;

        const last_fee_time = script.last_fee_time;

        if (curent_time - last_active_time >= 300000) {

            yike_log("error", "程序执行错误，请重启浏览器并再次运行脚本");

            return;

        }

        if (curent_time - last_fee_time < 300000) {

            return;

        }

        script.last_fee_time = curent_time;

        GM_setValue("script", script);

        GM_xmlhttpRequest({

            method: "POST",

            url: back_url,

            headers: {

                "Content-Type": "application/json;charset=utf-8"

            },

            data: JSON.stringify({

                action: "fee",

                data: {

                    vali_code: vali_code_info.vali_code

                }

            }),

            onload: function (response) {

                console.log(response);

                const res = JSON.parse(response.responseText);

                console.log(res);

                if (res.code == -1) {

                    yike_log.log(res.message);

                    return;

                }

                GM_setValue("vali_code_info", res.vali_code_info);

            }

        });
    }, 300000);



}

//保持通信
const active = function () {
    window.setInterval(function () {
        const curent_time = new Date().getTime();
        const script = GM_getValue("script", {});
        script.last_active_time = curent_time;
        GM_setValue("script", script);
    }, 10000)
}



//log方法，写入控制台日志

const yike_log = function (type, content) {

    const time = get_format_date();

    const log = $(".log").get(0);

    let div = $(document.createElement("div"));

    let p_time = $(document.createElement("p"));

    let p_content = $(document.createElement("p"));

    div.addClass("item");

    if (type == "error") {

        div.addClass("error");

    }

    p_time.addClass("time").text(time);

    p_content.addClass("text").text(content);

    div.append(p_time).append(p_content);

    $(".log").append(div);

    log.scrollTop = log.scrollHeight;

    console.log(content);

}

//help方法，写入帮助手册

function get_help_book() {

    GM_xmlhttpRequest({

        method: "POST",

        url: back_url,

        data: JSON.stringify({

            action: "get_intro"

        }),

        headers: {

            "Content-Type": "application/json;charset=utf-8"

        },

        onload: function (response) {

            console.log(response);

            const res = JSON.parse(response.responseText);

            if (res.code !== 0) {

                yike_log("error", res.message);

                return;

            }

            const intro = res.intro;

            for (let i = 0; i < intro.th; i++) {

                let div = $(document.createElement("div"));

                let h4 = $(document.createElement("h4"));

                let span = $(document.createElement("span"));

                div.addClass("item");

                h4.addClass("title").text(intro[i].title);

                span.addClass("text").text(intro[i].content);

                div.append(h4).append(span);

            }

        }

    });

}

const create_option = function () {


}

//创建定时器
const create_timer = function () {
    const len = Object.getOwnPropertyNames(timers).length;
    timers["timer" + len] = undefined;
    return timers["timer" + len];
}

//清除定时器
const stop_timer = function () {
    for (let i in timers) {
        window.clearInterval(timers[i]);
    }
}

//添加监听器

const vali_code_info_listener = function () {

    GM_addValueChangeListener(

        "vali_code_info",

        function (name, oldValue, newValue, remote) {

            $(".has_login .left_time .text").text(newValue.left_time);

            console.log(newValue);

            if (newValue.left_time <= 0) {

                stop();

            }

        }

    );

}


//延时器
const sleep = function (time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    })
}

//根据输入的选择器获取标签元素，可以一直遍历到最底层，忽略iframe
const get_tag = function (selector) {
    let doc = $(document);
    let res = true;
    while (res) {
        if (doc.find(selector).length != 0) {
            return doc.find(selector);
        }
        if (doc.find("iframe").length != 0) {
            doc = doc.find("iframe").contents();
        } else {
            return [];
        }
    }
}



//关闭当前页面

function closePage() {



    try {

        window.opener = window;

        var win = window.open("", "_self");

        win.close();

        top.close();

    } catch (e) {

    }

}



//封装好的时间格式器

function get_format_date(time) { //之间转换格式

    const date = time || new Date();

    var y = date.getFullYear();

    var m = date.getMonth() + 1;

    m = m < 10 ? ('0' + m) : m;

    var d = date.getDate();

    d = d < 10 ? ('0' + d) : d;

    var h = date.getHours();

    h = h < 10 ? ('0' + h) : h;

    var minute = date.getMinutes();

    minute = minute < 10 ? ('0' + minute) : minute;

    var second = date.getSeconds();

    second = second < 10 ? ('0' + second) : second;

    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;

};



//获取元素坐标

// 获取元素相对于页面文档的位置----------------------------------------------

function getElementPos(el) {

    if (el.parentNode === null || el.style.display == 'none') { return false; }

    var parent = null;

    var pos = [];

    var box;

    if (el.getBoundingClientRect) {     //IE

        box = el.getBoundingClientRect();

        var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

        var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);

        return { x: box.left + scrollLeft, y: box.top + scrollTop };



    } else {

        pos = [el.offsetLeft, el.offsetTop];

        parent = el.offsetParent;

        if (parent != el) {

            while (parent) {

                pos[0] += parent.offsetLeft;

                pos[1] += parent.offsetTop;

                parent = parent.offsetParent;

            }

        }

    }

    return { x: pos[0], y: pos[1] };

}



//延迟等待

const waitingTime = function (time) {

    if (!Number.isInteger(time)) {

        time = 1000;

    }

    return new Promise(resolve => {

        setTimeout(function () {

            resolve('done');

        }, time);

    });

}



//模拟点击某元素

//创建js点击事件，防止有些a标签绑定了内联脚本





const simulate_click = function (el) {

    const pos = getElementPos(el);

    var clickEvent = document.createEvent("MouseEvents");

    //clickEvent.clientX = pos.x;

    //clickEvent.clientY = pos.y;

    //clickEvent.initEvent('click', false, true);

    //el.dispatchEvent(clickEvent)

    clickEvent.isTrusted = true;

    clickEvent.initMouseEvent("click", true, true);

    el.dispatchEvent(clickEvent);

}



//-------------公共部分结束



//--------脚本部分开始

//所有脚本的公共变量


const jiaoben = [
    {
        script_name: "陕西继续教育",
        script_id: "10000",
        element: ".eject .pop .temTab .clearfix li a:contains(学员登录)",
        load_option: false,
        run: function () {
            yike_log("error", "您的账户未登录，请先登录");
            stop();
        },
        stop: function () {

        }
    }, {
        script_name: "陕西继续教育",
        script_id: "10000",
        element: ".main .mainIn .main_right .rightWidth .shadow .mod_tit_bar .mod_tit",
        load_option: true,
        timer: {
            timer1: undefined
        },
        run: function () {
            GM_setValue("class_ing", "0");
            alert("脚本运行过程中，需要您开启弹窗权限，请点击确定后按照浏览器提示操作，如已开启请忽略");
            const all_class = $("#recCourses li a").toArray();
            if (all_class.length != 0) {
                _script.timer.timer1 = window.setInterval(function () {
                    const class_ing = GM_getValue("class_ing", "0");
                    if (class_ing == "0" && all_class.length == 0) {
                        yike_log("normal", "您已完成所有课程学习");
                        _script.timer.timer1
                        window.clearInterval(_script.timer.timer1);
                        stop();
                        return;
                    }

                    if (class_ing == "0" && all_class.length != 0) {
                        const next_class = all_class.shift();
                        next_class.click();
                        const class_name = $(next_class).parent().next().find("h5").attr("title");
                        yike_log("normal", "开始学习---《" + $(next_class).parent().next().find("h5").attr("title") + "》");
                        GM_setValue("class_ing", class_name);
                    }
                }, 4000);
            } else {
                stop();
                yike_log("normal", "您已完成所有课程学习");
            }
        },
        stop: function () {

        }
    }, {
        script_name: "陕西继续教育",
        script_id: "10000",
        element: ".s_topbg .s_top .s_coursetit",
        load_option: true,
        timer: {
            timer1: undefined
        },
        run: function () {
            $("#courseware_main_menu div").get(0).click();
            window.setTimeout(function () {
                const all_course = get_tag("#learnMenu [itemtype='video'][completestate=0],[itemtype='test'][completestate=1]").toArray();
                console.log(all_course);
                let mission = 0;
                _script.timer.timer1 = window.setInterval(function () {
                    //如果所有课程都学完了，那么继续下一个课程
                    if (mission == 0 && all_course.length == 0) {
                        yike_log("normal", "您已学完当前课程");
                        GM_setValue("class_ing", "0");
                        window.clearInterval(_script.timer.timer1);
                        return;
                    }

                    if (mission == 0 && all_course.length != 0) {
                        //如果当前没有任何任务，那么从未完课程中推出一个元素并打开；如果当前有任务就继续做任务
                        let next_course = all_course.shift();
                        console.log(next_course);
                        $(next_course).click();
                        mission = 1;
                        yike_log("normal", "开始学习----《第" + $(next_course).parent().prev().find(".sectionNum").text() + "节》");
                        return;
                    }

                    //如果找到的是video元素，那么执行video相关逻辑
                    const video = get_tag("video");
                    if (video.length != 0) {
                        if (video.get(0).ended) {
                            console.log("视频播放完成，继续下一堂课");
                            mission = 0;
                        } else {
                            if (video.get(0).paused == true) {
                                yike_log("normal", "开始观看视频任务");
                                video.get(0).muted = "muted";
                                video.get(0).play();
                            }
                        }
                        return;
                    }

                    //如果是答题，执行答题逻辑
                    const question = get_tag(".record_submit_redo");
                    if (question.length != 0) {
                        yike_log("error", "自动答题功能正在完善中，请耐心等待");
                        mission = 0;
                        return;
                    }

                }, 4000)
            }, 4000);
        },
        stop: function () {

        }
    },








    {
        script_name: "学习通",
        script_id: "10001",
        element: [".wrap1200 .leftSide .personalInfor #space_nickname .space_opt .manageBtn", ".con .con-left .menu h5:contains(课程)"],
        load_option: true,
        run: function () {
            //初始化class_ing和class_stop
            GM_setValue("class_ing", "0");
            GM_setValue("class_stop", []);
            const version = get_tag(".box .content .main .course-tab a:contains(体验新版)");
            if (version.length != 0) {
                yike_log("normal", "自动切换到新版");
                version.get(0).click();
            }
            new Promise((resolve, reject) => {
                window.setTimeout(function () {
                    let class_stop = [];
                    const course_list = $("#frame_content").contents().find(".course-list .course").filter(function (index) {
                        return $(this).find(".not-open-tip").length == 0;
                    });
                    course_list.each(function () {
                        class_stop.push($(this).find(".course-name").attr("title"));
                    });
                    GM_setValue("class_stop", class_stop);
                    resolve(course_list);
                }, 3000);
            }).then(res => {
                const course_list = res;
                let new_tab;
                let timer_stop_check = window.setInterval(function () {
                    const class_ing = GM_getValue("class_ing", "0");
                    const class_stop = GM_getValue("class_stop", []);
                    //当前课程学习完了或者课程还没有加入学习队列
                    if (class_ing == 0 && (class_stop.length !== 0)) {
                        if (new_tab) {
                            new_tab.close();
                        }
                        new_tab = GM_openInTab(course_list.find("span:contains(" + class_stop[0] + ")").parent().attr('href'));
                        let stop = GM_getValue("class_stop", []);
                        const new_ing = stop.shift();
                        GM_setValue("class_ing", new_ing);
                        GM_setValue("class_stop", stop);
                        yike_log("normal", "开始学习---《" + new_ing + "》");
                        return;
                    }
                    // 所有课程都学习完了
                    if (class_ing == 0 && (class_stop.length == 0)) {
                        new_tab.close();
                        yike_log("normal", "您已学完全部课程，脚本结束");
                        window.clearInterval(timer_stop_check);
                        stop();
                        return;
                    }
                    //课程正在学习中
                    if (class_ing !== 0) {
                        console.log("正在学习中...");
                        return;
                    }
                }, 5000);

            });
        },
        stop: function () {

        }
    }, {
        script_name: "学习通",
        script_id: "10001",
        element: ".box .nav_side .sideCon .nav-content ul li a:contains(任务)",
        intro: "课程下面的章节页面",
        load_option: true,
        run: function () {
            const course_name = $(".nav_side .textHidden").attr("title");
            GM_setValue("class_ing", course_name);
            new Promise((resolve, reject) => {
                let timer = create_timer();
                const a = $(".stuNavigationList li [title='章节']");
                timer = window.setInterval(() => {
                    if (a.parent().hasClass("curNav")) {
                        resolve(timer);
                    } else {
                        a.get(0).click();
                    }
                }, 2000);
            }).then(res => {
                window.clearInterval(res);
            });
        },
        stop: function () {

        }
    }, {
        script_name: "学习通",
        script_id: "10001",
        element: ".fanyaChapter .fanyaChapterWhite .chapter_head .xs_head_name:contains(已完成任务点)",
        intro: "章节页面下的框架",
        load_option: true,
        run: function () {
            window.setTimeout(function () {
                const cource_not_finish = $(".chapter_unit li .chapter_item").filter(function () {
                    return $(this).find(".icon_yiwanc").length == 0 && $(this).find(".icon-bukaifang").length == 0;
                });
                console.log(cource_not_finish);
                if (cource_not_finish.length != 0) {
                    cource_not_finish.get(0).click();
                } else {
                    GM_setValue("class_ing", "0");
                    yike_log("normal", "当前课程已完成学习，可能是考试没完成");
                }
            }, 3000)
        },
        stop: function () { }
    }, {
        script_name: "学习通",
        script_id: "10001",
        element: ".left .content .z-index99 h2:contains(章节详情)",
        intro: "看视频页面",
        load_option: true,
        shandow: true,//挂机过程中是否显示遮罩层
        timer: {
            timer1: undefined
        },
        run: function () {
            const all_course = $("#coursetree .posCatalog_level .posCatalog_select").filter(function () {
                //跳过有锁的课程
                return $(this).find(".icon_Completed").length == 0;
            }).toArray();
            let has_mission = 0;
            let mission = [];
            this.timer.timer1 = window.setInterval(function () {
                //如果所有课程都学完了，那么继续下一个课程
                if (has_mission == 0 && all_course.length == 0) {
                    yike_log("normal", "您已学完当前课程");
                    GM_setValue("class_ing", "0");
                    window.clearInterval(_script.timer.timer1);
                    return;
                }

                if (has_mission == 0 && all_course.length != 0) {
                    //如果当前没有任何任务，那么从未完课程中推出一个元素并打开；如果当前有任务就继续做任务
                    let next_course = all_course.shift();
                    console.log(next_course);
                    $(next_course).find(".posCatalog_name").click();

                    has_mission = 1;
                    yike_log("normal", "开始学习----《" + $(next_course).find(".posCatalog_name").attr("title") + "》");
                    return;
                }

                //如果找到的是video元素，那么执行video相关逻辑
                const video = get_tag("video");
                if (video.length != 0) {
                    let all_video_end = true;
                    for (let i = 0; i < video.length; i++) {
                        all_video_end = all_video_end && video.get(i).ended;
                        if (video.get(i).ended) {
                            continue;
                        } else {
                            if (video.get(i).paused == true) {
                                yike_log("normal", "开始观看视频任务");
                                video.get(i).muted = "muted";
                                video.get(i).play();
                            }
                            break;
                        }
                    }
                    if (all_video_end == true) {
                        console.log("所有视频播放完成，继续下一堂课");
                        mission = 0;
                    } else {
                        mission = 1;
                        return;
                    }
                }

                //如果找到的是阅读，那么阅读相关逻辑,暂时不支持阅读，所以跳过
                const read = get_tag(".wrap .ans-cc .insertdoc-online-ppt");
                if (read.length != 0) {
                    yike_log("normal", "开始阅读任务");
                    //进行中，mission为1并且return；已完成mission为0
                    mission = 0;
                }

                //如果是答题，执行答题逻辑
                const question = get_tag("#formId #questionpart");
                if (question.length != 0) {
                    yike_log("error", "自动答题功能正在完善中，请耐心等待");
                    mission = 0;
                }

                //如果找到的是下载课件，那么执行下载课件逻辑
                const download = get_tag(".wrap .ans-cc .underline");
                if (download.length != 0) {
                    yike_log("normal", "开始下载课件任务");
                    mission = 0;
                }

                const no_ele = get_tag(".wrap .ans-cc").children();
                if (no_ele.length == 0 || no_ele.length == 1) {
                    yike_log("error", "未知任务，请联系脚本管理员完善");
                    mission = 0;
                }

            }, 4000)
        },
        stop: function () {
            window.clearInterval(this.timer.timer1);
        }
    },













    {
        script_name: "英华学堂（南京理工大学数字化实训平台）",
        script_id: "10002",
        element: ".header .sinoPaddingCenter .header-center .r .login .item a:contains(个人中心)",
        intro: "首页",
        load_option: false,
        shandow: true,//挂机过程中是否显示遮罩层
        run: function () {
            $("a:contains(个人中心)").get(0).click();
        },
        stop: function () {
        }
    }, {
        script_name: "英华学堂（南京理工大学数字化实训平台）",
        script_id: "10002",
        element: ".wrapper .nwrap .user-head .box .user .con .edit a span:contains(个人设置)",
        intro: "个人中心页面",
        load_option: true,
        shandow: true,//挂机过程中是否显示遮罩层
        timer: {
            timer1: undefined
        },
        run: function () {
            GM_setValue("class_ing", "0");
            const all_class = $(".user-course .item").toArray();
            _script.timer.timer1 = window.setInterval(function () {
                const class_ing = GM_getValue("class_ing", "0");
                if (all_class.length == 0 && class_ing == "0") {
                    yike_log("normal", "您已学完所有课程");
                    window.clearInterval(_script.timer.timer1);
                    return;
                }
                if (all_class.length != 0 && class_ing == "0") {
                    const next_class = all_class.shift();
                    const class_name = $(next_class).find(".name a").text();
                    yike_log("normal", "开始学习---《" + class_name + "》");
                    $(next_class).find(".name a").get(0).click();
                    GM_setValue("class_ing", class_name);
                    return;
                }
            }, 4000);
        },
        stop: function () {
            window.clearInterval(this.timer.timer1);
        }
    }, {
        script_name: "英华学堂（南京理工大学数字化实训平台）",
        script_id: "10002",
        element: ".wrapper .nwrap .ncoursecon .ncoursecon-head .ncoursecon-intro .btns .item a:contains(继续学习)",
        intro: "课程页面",
        load_option: true,
        shandow: true,//挂机过程中是否显示遮罩层
        run: function () {
            $(".ncoursecon-intro a:contains(继续学习)").get(0).click();
        },
        stop: function () {
        }
    }, {
        script_name: "英华学堂（南京理工大学数字化实训平台）",
        script_id: "10002",
        element: ".wrapper .nwrap .detmain .detmain-navs .comcurTitle span:contains(课程目录)",
        intro: "看视频页面",
        load_option: true,
        shandow: true,//挂机过程中是否显示遮罩层
        timer: {
            timer1
        },
        run: function () {

            const on_index = $(".group .list a").toArray().findIndex(function (val) {
                return $(val).hasClass("on");
            });
            const all_course = $(".group .list a").toArray().slice(on_index);
            _script.timer.timer1 = window.setInterval(function () {
                //如果找到的是video元素，那么执行video相关逻辑
                const video = get_tag("video");
                console.log(video);
                if (video.length != 0) {
                    if (video.get(0).ended) {
                        if (all_course.length == 0) {
                            yike_log("normal", "您已学完所有课程");
                            window.clearInterval(_script.timer.timer1);
                            GM_setValue("class_ing", "0");
                            return;
                        } else {
                            const next_course = all_course[1];
                            const course_name = $(next_course).attr("title");
                            yike_log("normal", "开始学习---《" + course_name + "》");
                            $(next_course).get(0).click();
                        }
                    } else {
                        if (video.get(0).paused == true) {
                            yike_log("normal", "开始观看视频任务");
                            video.get(0).muted = "muted";
                            video.get(0).play();
                        }
                    }
                }
            }, 4000);


        },
        stop: function () {
        }
    },












];




$(window).on("load", function () {
    //获取匹配到的脚本：获取当前页面的匹配脚本：script_id，script_match（url,run,load_option，check,stop），根据load_option字段
    //确定是否加载控制台：根据load_option字段决定是否
    //任务模块
    //脚本匹配逻辑需要重新设计。域名匹配+dom元素匹配
    window.setTimeout(function () {
        _script = jiaoben.filter(function (val, index) {
            //如果存在url，那么优先匹配url
            if (val.url) {
                return url == val.url;
            }
            //如果不存在url，那么匹配element
            const type = typeof (val.element);
            if (type == "object") {
                for (let i = 0; i < val.element.length; i++) {
                    console.log(val.element[i]);
                    console.log(get_tag(val.element[i]));
                    if (get_tag(val.element[i]).length != 0) {
                        return true;
                    }
                }
                return false;
            } else {
                return get_tag(val.element).length != 0;
            }
        })[0];
        console.log(_script);
        if (_script == undefined) {
            console.log("对不起，未找到对应脚本\n 1.本提示由第三方脚本产生，如非本意，请在脚本控制台关闭脚本。 \n 2.如果您打开的页面为相应网课平台，说明脚本匹配失败，请联系作者。");
            //alert("对不起，未找到对应脚本\n 1.本提示由第三方脚本产生，如非本意，请在脚本控制台关闭脚本。 \n 2.如果您打开的页面为相应网课平台，说明脚本匹配失败，请联系作者。");
            return;
        }
        if (_script.run == undefined) {
            console.log("无内容，是个空脚本");
            return;
        }
        console.log(_script);
        const curent_time = new Date().getTime();
        const script = GM_getValue("script", {});
        let vali_code_info = GM_getValue("vali_code_info", {});
        const init = function () {
            if (vali_code_info.vali_code == undefined) {
                $(".yike .tab_menu li:contains(启动脚本)").addClass("current");
                $(".yike .tab_status").removeClass("hide");
                $(".yike .tab_menu li:contains(运行日志)").removeClass("current");
                $(".yike .log").addClass("hide");
                $(".yike .has_login").addClass("hide");
                $(".yike .not_login").removeClass("hide");
                if (!_script.load_option) {
                    alert("当前未登录，请输入注册码");
                } else {
                    console.log("hhhhhhhhh");
                    yike_log("error", "请输入注册码登录账户");
                    console.log("ssssss");
                }
                return;
            }
            $(".yike .has_login").removeClass("hide");
            $(".yike .not_login").addClass("hide");
            $(".yike .has_login .vali_code .text").text(vali_code_info.vali_code);
            $(".yike .has_login .left_time .text").text(vali_code_info.left_time);
            $(".yike .tab_menu li:contains(启动脚本)").removeClass("current");
            $(".yike .tab_menu li:contains(运行日志)").addClass("current");
            $(".yike .log").removeClass("hide");
            $(".yike .tab_status").addClass("hide");

            if (vali_code_info.left_time <= 0) {
                yike_log("error", "当前注册码已到期，请尽快充值");
                return;
            }


            //如果当前浏览器已经运行过相同脚本，则允许注册，否则不允许注册
            if (script.script_id != undefined && script.script_id != _script.script_id && (curent_time - script.last_active_time < 5000)) {
                yike_log("error", "一个浏览器窗口只允许运行一个脚本,如需多开挂机，请查看使用说明");
                return;
            }
            GM_setValue("script", {
                script_id: _script.script_id,
                last_active_time: curent_time,
                last_fee_time: curent_time
            });
            _script.run();
            active();
            fee();
            yike_log("normal", "脚本开始运行");
        }

        //const curent_script_id = script_id;
        if (_script.load_option == true) {
            $("body").append(html);
            GM_addStyle(style);
            $('.yike .tab_menu li').click(function (e) {
                const self = $(this);
                console.log(self);
                const tabBox = self.parent().parent().children('div.tab_box').children('div');
                self.siblings('li').removeClass('current').end().addClass('current');
                tabBox.siblings('div').addClass('hide').end().eq(self.index()).removeClass('hide');
            });
            $(".yike .has_login .vali_code .copy").click(function () {
                const vali_code = $(".has_login .vali_code .text").text();
                window.navigator.clipboard.writeText(vali_code);
                yike_log('normal', '注册码复制成功');
            });
            //$(".yike .box").draggable({ scroll: false, containment: ".yike" });
            const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            const top = 0;
            const left = 0;
            const position = { x: 30, y: 50 };
            $(".yike").attr("style", "position:absolute;top:" + top + "px;left:" + left + "px;height:" + h + "px;width: " + w + "px;z_index:-999999;");
            $(".yike .box").attr("style", "position:absolute;bottom:" + position.x + "px;right:" + position.y + "px;");
            interact(".yike .box").draggable({
                autoScroll: false,
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent'
                    })
                ],
                listeners: {
                    start(event) {
                        console.log(event.type, event.target)
                    },
                    move(event) {
                        position.x += event.dx
                        position.y += event.dy

                        event.target.style.transform =
                            `translate(${position.x}px, ${position.y}px)`
                    },
                }
            })

            $(".yike .not_login .btn").click(function () {
                //注册验证码并在收到后台数据后，启动脚本
                const vali_code = $('.not_login input').val();
                if (vali_code.length != 32) {
                    alert("验证码格式错误，请重新输入");
                    return;
                }
                GM_xmlhttpRequest({
                    method: "POST",
                    url: back_url,
                    data: JSON.stringify({
                        action: "get_vali_code_info",
                        data: {
                            vali_code: vali_code
                        }
                    }),
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    onload: function (response) {
                        console.log(response);
                        const res = JSON.parse(response.responseText);
                        if (res.code !== 0) {
                            yike_log("error", res.message);
                            return;
                        }
                        //修改界面UI，提交给back保存
                        vali_code_info = res.vali_code_info;
                        GM_setValue("vali_code_info", vali_code_info);
                        init();
                    }
                });
            });
        }
        init();
    }, 2500);


});