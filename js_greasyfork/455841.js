// ==UserScript==
// @name        中国教育网络电视台
// @namespace   https://bbs.tampermonkey.net.cn/
// @description 已支持【学习通】【陕西省继续教育平台】吉林/山西/江苏/江西/浙江/广西/云南/新疆/贵州/甘肃/青海/宁夏/湖南/湖北/山东各省继续教育平台挂机脚本正在开发中。
// @version     1.0.9
// @author      小了白了兔
// @storageName yike
// @license MIT
// @compatible  chrome firefox edge
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
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/interact.js/1.10.17/interact.min.js
// @require-css https://vkceyugu.cdn.bspapp.com/VKCEYUGU-85530a3e-fc46-4ea4-a542-160dad54a088/5895b760-6bac-4f7f-9602-82b3465bbbae.css
// @downloadURL https://update.greasyfork.org/scripts/455841/%E4%B8%AD%E5%9B%BD%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E7%94%B5%E8%A7%86%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/455841/%E4%B8%AD%E5%9B%BD%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E7%94%B5%E8%A7%86%E5%8F%B0.meta.js
// ==/UserScript==







const back_url = "https://85530a3e-fc46-4ea4-a542-160dad54a088.bspapp.com/user";
const style = ".yike {position: absolute;right:50px;bottom:30px;z-index:99999}.yike .yike_tab_status {height: 100%;width: 100%;}.yike .yike_not_login {width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;flex-direction: column;}.yike .yike_not_login .yike_btn {align-self: flex-end;margin-top: 6px;margin-right: 20px;width: 20%;height: 40px;background-color: #093;color: #fff;border: none;border-radius: 5px;}.yike .yike_not_login .yike_btn:active {border: 1px solid #ddd;}.yike .yike_op {display: flex;justify-content: space-between;align-items: center;width: 100%;}.yike .yike_op .yike_login_info {color: #093;margin-left: 20px;}.yike .yike_not_login .yike_text {text-align: right;position: absolute;bottom: 10px;right: 10px;}.yike .yike_not_login .yike_input {border: 1px solid #333;background-color: #f9f9f9;border-radius: 5px;padding: 13px;outline: 0;width: 80%;}.yike .yike_intro {width: 100%;height: 100%;padding: 15px;text-align: left;}.yike .yike_log {width: 100%;height: 100%;display: flex;align-items: flex-start;flex-direction: column;padding: 5px;overflow: auto;}.yike .yike_log .yike_item {margin: 3px 0px;}.yike .yike_log .yike_item p {line-height: normal;}.yike .yike_log .yike_item .yike_time {margin-right: 5px;}.yike .yike_log .yike_error {color: brown;}.yike .yike_has_login {position: relative;display: flex;justify-content: center;align-items: center;flex-direction: column;width: 100%;height: 100%;}.yike .yike_has_login .yike_left_time, .yike .yike_has_login .yike_client {margin: 5px;}.yike .yike_has_login .yike_vali_code {position: absolute;left: 8px;bottom: 5px;display: flex;justify-content: flex-start;align-items: center;}.yike .yike_has_login .yike_vali_code .yike_copy {margin-left: 5px;background-color: #093;color: #fff;border-radius: 3px;border: 2px solid #095;}.yike .yike_box {width: 360px;height: 240px;background: #fff;border: 1px solid #d3d3d3;font-size: 12px;}.yike .yike_tab_menu {overflow: hidden;padding: 0px;margin: 0px;}.yike .yike_tab_menu li {width: 33.3%;float: left;height: 30px;line-height: 30px;color: #fff;background: #093;text-align: center;cursor: pointer;list-style-type: none;}.yike .yike_tab_menu li.yike_current {color: #333;background: #fff;}.yike .yike_tab_box {height: 210px;position: relative;}.yike .yike_tab_box li {height: 24px;line-height: 24px;overflow: hidden;}.yike .yike_tab_box li span {margin: 0 5px 0 0;font-weight: 600;color: #ddd;}.yike .yike_tab_box .yike_hide {display: none;}";
let lost_time = 0;
let html = "";
html += "<div class=\"yike\">";
html += "		<div class=\"yike_box\">";
html += "			<ul class=\"yike_tab_menu\">";
html += "				<li>启动脚本<\/li>";
html += "				<li>使用说明<\/li>";
html += "				<li class=\"yike_current\">运行日志<\/li>";
html += "			<\/ul>";
html += "			<div class=\"yike_tab_box\">";
html += "				<div class=\"yike_tab_status yike_hide\">";
html += "					<div class=\"yike_not_login\"> <input class=\"yike_input\" placeholder=\"请输入32位注册码\"";
html += "							value=\"04ANIF1DH8I4VL4P121CWIND8MG5Y5UN\">";
html += "						<div class=\"yike_op\"> <span class=\"yike_login_info\"><\/span> <button";
html += "								class=\"yike_btn\">启动脚本<\/button> <\/div>";
html += "						<!-- <a class=\"text\">充值\/咨询\/成为代理<\/a> -->";
html += "					<\/div>";
html += "					<div class=\"yike_has_login yike_hide\">";
html += "						<div class=\"yike_vali_code\"> <span class=\"yike_text\"><\/span> <button";
html += "								class=\"yike_copy\">复制<\/button> <\/div>";
html += "						<div class=\"yike_left_time\">剩余时间: <span class=\"yike_text\"><\/span> <\/div>";
html += "					<\/div>";
html += "				<\/div>";
html += "				<div class=\"yike_intro yike_hide\"> <\/div>";
html += "				<div class=\"yike_log\"> <\/div>";
html += "			<\/div>";
html += "		<\/div>";
html += "	<\/div>";

//向后台请求计费，每5分钟一次
const fee = {
    timer: undefined,
    start_fee: function () {
        fee.timer = window.setInterval(function () {
            console.log("开始计费");
            const vali_code_info = GM_getValue("vali_code_info", {});
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
                    const res = JSON.parse(response.responseText);
                    if (res.code == -1) {
                        yike_log.log(res.message);
                        return;
                    }
                    GM_setValue("vali_code_info", res.vali_code_info);
                }
            });
        }, 300000);
    },
    stop_fee: function () {
        console.log("停止计费");
        window.clearInterval(fee.timer);
    }
}

//log方法，写入控制台日志
const yike_log = function (type, content) {
    const time = get_format_date();
    const log = $(".yike .yike_log").get(0);
    if (!log) {
        console.log(content);
        return;
    }

    let div = $(document.createElement("div"));

    let p_time = $(document.createElement("p"));

    let p_content = $(document.createElement("p"));

    div.addClass("yike_item");

    if (type == "error") {

        div.addClass("yike_error");

    }

    p_time.addClass("yike_time").text(time);

    p_content.addClass("yike_text").text(content);

    div.append(p_time).append(p_content);

    $(".yike_log").append(div);

    log.scrollTop = log.scrollHeight;



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

//添加监听器
const vali_code_info_listener = function () {
    GM_addValueChangeListener(
        "vali_code_info",
        function (name, oldValue, newValue, remote) {
            $(".yike_has_login .yike_left_time .yike_text").text(newValue.left_time);
            console.log(newValue);
            if (newValue.left_time <= 0) {
                stop();
            }
        }
    );
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

//-------------公共部分结束



//--------脚本部分开始
const jiaoben = [
    {
        script_name: "中国教育网络电视台",
        script_id: "10004",
        element: [".content .side .sidebar ul li a:contains(课程学习)",],
        load_option: true,
        run: function () {
            alert("1.请开启弹窗权限，否则脚本无法运行。若已开启请忽略;\n2.挂机过程中，请保持此页面始终在前台工作");
            window.addEventListener('message', function (e) {
                const data = e.data;
                const source = data.source;
                const event = data.event;
                console.log(data);
                if ((source != "10004_study") && (source != "10004_video")) {
                    return;
                }
                if (event == "class_start" && source == "10004_study") {
                    page_b = e.source;
                }
                if (event == "class_start" && source == "10004_video") {
                    page_c = e.source;
                }
                if (event == "class_complete") {
                    $(document).trigger("class_complete");
                }
                if (event == "add_log") {
                    console.log(data.content);
                    yike_log(data.type, data.content);
                }
            }, false);
            $(document).on("class_ready", function (e) {
                if (all_class.length == 0) {
                    yike_log("normal", "您已完成所有课程学习");
                    stop();
                    return;
                }
                all_class[0].click();
                const class_name = $(all_class[0]).parent().parent().parent().find(".kcal_title").attr("title");
                yike_log("normal", "开始学习---《" + class_name + "》");
            });
            $(document).on("class_complete", function (e) {
                all_class.shift();
                page_b.close();
                if (all_class.length == 0) {
                    yike_log("normal", "您已完成所有课程学习");
                    stop();
                    return;
                }
                $(document).trigger("class_ready");
            });
            //10秒1此向page_b页面发送消息
            window.setInterval(function () {
                page_b.postMessage({
                    event: "keep_active",
                    source: "10004_main"
                }, "*")
                page_c.postMessage({
                    event: "keep_active",
                    source: "10004_main"
                }, "*")
            }, 10000);
            fee.start_fee();
            let page_b, page_c;
            let all_class;
            const on_kecheng = get_tag(".mian_title1 h2:contains(课程学习)");
            if (on_kecheng.length == 0) {
                $(".content .side .sidebar ul li a:contains(课程学习)").get(0).click();
                window.setTimeout(function () {
                    all_class = $(".kcxx_list .list .kcxx_side_time .xx_pl .qxx").toArray();
                    $(document).trigger("class_ready");
                }, 3000);
            } else {
                all_class = $(".kcxx_list .list .kcxx_side_time .xx_pl .qxx").toArray();
                $(document).trigger("class_ready");
            }
        },
        stop: function () {
            yike_log("error", "挂机结束，脚本停止运行");
            $(document).off();
        }
    },
    {
        script_name: "中国教育网络电视台",
        script_id: "10004",
        element: ".video_title .video_title_time #zonggong",
        run: function () {
            window.confirm = function () {
                return true;
            }
            unsafeWindow.confirm = function () {
                return true;
            }
            const page_name = "10004_study"
            let course_id = $(".video_title .video_title_time #courseId").text();
            let exit_study_url = "http://study.yanxiu.jsyxsq.com/proj/studentwork/studyAjax/AddStudyTimeExit.json?time=";
            page_regist(window.opener, page_name);
            active_check();
            window.addEventListener('message', function (e) {
                const data = e.data;
                const source = data.source;
                if (source != "10004_main") {
                    return;
                }
                const event = data.event;
                if (event == "keep_active") {
                    console.log(get_format_date() + "----学习页收到通知");
                    lost_time = 0;
                }
            }, false);
            window.setInterval(function () {
                const has_study_time = parseInt($(window.top.document).find(".video_title .video_title_time #zonggong").text().slice(0, -2));
                const need_study_time = parseInt($(window.top.document).find(".main_video .video_r .title_tab_lists .introduce_list:contains(课程时长)").text().replace(/[^0-9]/ig, ""));
                console.log(has_study_time);
                console.log(need_study_time);
                if (has_study_time > (need_study_time * 1.3)) {
                    window.opener.postMessage({
                        event: "add_log",
                        type: "normal",
                        content: "已满足学习时长要求（超过1.3倍建议学习时长），您无需再次学习",
                        source: page_name
                    }, "*");
                    window.opener.postMessage({
                        event: "class_complete",
                        source: page_name
                    }, "*");
                    /*   $.ajax({
                          type: "POST",
                          url: exit_study_url + document.form2.passedtime.value,
                          dataType: "json",
                          data: "courseId=" + course_id + "&studyTime=" + document.form2.passedtime.value,
                          success: function (msg) {
                              window.opener.postMessage({
                                  event: "class_complete",
                                  source: "10004_study"
                              }, "*");
                          }
                      }); */
                    return;
                }
            }, 10000);
        },
        stop: function () {
            $(document).off();
        }
    },
    {
        script_name: "中国教育网络电视台",
        script_id: "10004",
        element: [".comWrap .couInfoWrap .rightCout .menu", ".h1bg .h1 .biaoti #coursetitle"],
        run: function () {
            window.confirm = function () {
                return true;
            }
            unsafeWindow.confirm = function () {
                return true;
            }
            const page_name = "10004_video";
            const mission = [];
            page_regist(window.top.opener, page_name);
            active_check();
            window.addEventListener('message', function (e) {
                console.log(e);
                const data = e.data;
                const source = data.source;
                if (source != "10004_main") {
                    return;
                }
                const event = data.event;
                if (event == "keep_active") {
                    console.log(get_format_date() + "----视频页收到通知");
                    lost_time = 0;
                }
            }, false);
            window.setTimeout(function () {
                $(document).on("mission_ready", function (e) {
                    if (mission[0].type == "video") {
                        mission[0].ele.muted = "muted";
                        mission[0].ele.play();
                        $(mission[0].ele).on("ended", function () {
                            console.log("播放结束");
                            $(document).trigger("mission_complete");
                        });
                        /*  $(mission[0].ele).on("pause", function () {
                             mission[0].ele.muted = "muted";
                             mission[0].ele.play();
                         }); */
                        /*   $(mission[0].ele).on("canplay", function () {
                              console.log("开始播放");
                              mission[0].ele.muted = "muted";
                              mission[0].ele.play();
                          }); */
                        return;
                    }
                });
                $(document).on("mission_complete", function (e) {
                    mission.shift();
                    if (mission.length == 0) {
                        $(document).trigger("course_complete");
                        return;
                    }
                    $(document).trigger("mission_ready");
                });
                $(document).on("course_complete", function (e) {
                    all_course.shift();
                    if (all_course.length == 0) {
                        //$(document).trigger("course_complete");
                        return;
                    }
                    all_course[0].click();
                    window.setTimeout(function () {
                        $(document).trigger("course_ready");
                    }, 5000);
                });
                $(document).on("course_ready", function (e) {
                    window.top.opener.postMessage({
                        event: "add_log",
                        type: "normal",
                        content: "开始学习----《" + $(all_course[0]).attr("title") + "》",
                        source: page_name
                    }, "*")
                    const video = get_tag("video");
                    mission.push({
                        type: "video",
                        ele: video.get(0)
                    });
                    $(document).trigger("mission_ready");
                });
                const type_a_ele = get_tag(".comWrap .couInfoWrap .menu .b_name");
                const type_b_ele = get_tag("#menu #list #list_content [indexb=0]");
                let all_course;
                if (type_a_ele.length != 0) {
                    all_course = type_a_ele.toArray();
                } else if (type_b_ele.length != 0) {
                    all_course = type_b_ele.toArray();
                }
                console.log(all_course);
                $(document).trigger("course_ready");
            }, 4000);
        },
        stop: function () {
            $(document).off();
        }
    }
];


const active_check = function () {
    window.setInterval(function () {
        if (lost_time >= 5) {
            stop();
            alert("挂机过程中，不要关闭主页面。脚本运行停止");
        } else {
            console.log("失去连接第 " + lost_time + "次");
            lost_time = lost_time + 1;
        }
    }, 15000);
};

const page_regist = function (win, page_name) {
    win.postMessage({
        event: "class_start",
        source: page_name
    }, "*");
}

const get_script = function () {
    const s = jiaoben.filter(function (val, index) {
        const type = typeof (val.element);
        if (type == "object") {
            for (let i = 0; i < val.element.length; i++) {
                if (get_tag(val.element[i]).length != 0) {
                    return true;
                }
            }
            return false;
        } else {
            return get_tag(val.element).length != 0;
        }
    })[0];
    return s;
}

const load_option = function () {
    $("body").append(html);
    GM_addStyle(style);
    $('.yike .yike_tab_menu li').click(function (e) {
        const self = $(this);
        console.log(self);
        const tabBox = self.parent().parent().children('div.yike_tab_box').children('div');
        self.siblings('li').removeClass('yike_current').end().addClass('yike_current');
        tabBox.siblings('div').addClass('yike_hide').end().eq(self.index()).removeClass('yike_hide');
    });
    $(".yike .yike_has_login .yike_vali_code .yike_copy").click(function () {
        const vali_code = $(".has_login .vali_code .text").text();
        window.navigator.clipboard.writeText(vali_code);
        yike_log('normal', '注册码复制成功');
    });
    let pos = { x: 30, y: 50 };
    interact(".yike").draggable({
        autoScroll: false,
        /*   modifiers: [
              interact.modifiers.restrictRect({
                  restriction: {
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0
                  }
              })
          ], */
        listeners: {
            start(event) {
                console.log(event)
            },
            move(event) {
                pos.x += event.dx
                pos.y += event.dy
                //event.target.style.transform = `translate(${event.dx + pos.x}px, ${event.dy + pos.y}px)`;
                event.target.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            },
        }
    })

    $(".yike .yike_not_login .yike_btn").click(function () {
        //注册验证码并在收到后台数据后，启动脚本
        const vali_code = $('.yike_not_login .yike_input').val();
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
                const res = JSON.parse(response.responseText);
                if (res.code !== 0) {
                    yike_log("error", res.message);
                    return;
                }
                GM_setValue("vali_code_info", res.vali_code_info);
                window.location.reload();
            }
        });
    });
    const vali_code_info = GM_getValue("vali_code_info", {});
    console.log(vali_code_info);
    if (vali_code_info.vali_code == undefined) {
        $(".yike .yike_tab_menu li:contains(启动脚本)").addClass("yike_current");
        $(".yike .yike_tab_status").removeClass("yike_hide");
        $(".yike .yike_tab_menu li:contains(运行日志)").removeClass("yike_current");
        $(".yike .yike_log").addClass("yike_hide");
        $(".yike .yike_has_login").addClass("yike_hide");
        $(".yike .yike_not_login").removeClass("yike_hide");
    } else {
        $(".yike .yike_has_login").removeClass("yike_hide");
        $(".yike .yike_not_login").addClass("yike_hide");
        $(".yike .yike_has_login .yike_vali_code .yike_text").text(vali_code_info.vali_code);
        $(".yike .yike_has_login .yike_left_time .yike_text").text(vali_code_info.left_time);
        $(".yike .yike_tab_menu li:contains(启动脚本)").removeClass("yike_current");
        $(".yike .yike_tab_menu li:contains(运行日志)").addClass("yike_current");
        $(".yike .yike_log").removeClass("yike_hide");
        $(".yike .yike_tab_status").addClass("yike_hide");
    }
}



$(window).on("load", function () {
    window.setTimeout(function () {
        const _script = get_script();
        console.log(_script);
        if (_script == undefined) {
            console.log("对不起，未找到对应脚本\n 1.本提示由第三方脚本产生，如非本意，请在脚本控制台关闭脚本。 \n 2.如果您打开的页面为相应网课平台，说明脚本匹配失败，请联系作者。");
            return;
        }
        const run = _script.run;
        const stop = _script.stop;
        if (_script.load_option) {
            load_option();
        }
        run();
    }, 2500);
});