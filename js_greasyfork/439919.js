// ==UserScript==
// @name         air_tickets
// @namespace    http://tampermonkey.net/
// @version      0.4.2022年4月20日
// @description  use at srw.sabre.com
// @author       You
// @match        https://srw.sabre.com/*
// @icon         https://www.google.com/s2/favicons?domain=sabre.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439919/air_tickets.user.js
// @updateURL https://update.greasyfork.org/scripts/439919/air_tickets.meta.js
// ==/UserScript==

$(document).ready(function () {
    let fu_zhu_set = '<style>\n' +
        '    .fu_zhu, .fu_zhu * {\n' +
        '        float: left;\n' +
        '        padding: 0;\n' +
        '        margin: 10px 0 0 20px;\n' +
        '        color: black;\n' +
        '        background-color: azure;\n' +
        '    }\n' +
        '\n' +
        '    .fu_zhu {\n' +
        '        padding: 20px 0;\n' +
        '        position: absolute;\n' +
        '        right: 50px;\n' +
        '        bottom: 15px;\n' +
        '        width: 450px;\n' +
        '        height: auto;\n' +
        '        border-color: black;\n' +
        '        border-width: 2px;\n' +
        '        border-style: solid;display: block;\n' +
        '        z-index: 999999;\n' +
        '    }\n' +
        '\n' +
        '    .fu_zhu p {\n' +
        '        font-size: 19px;\n' +
        '    }\n' +
        '\n' +
        '    .fu_zhu textarea {\n' +
        '        width: 400px;\n' +
        '        height: 80px;\n' +
        '        font-size: 17px;\n' +
        '        padding: 3px;\n' +
        '        resize: none\n' +
        '    }\n' +
        '\n' +
        '    .fu_zhu .btn {\n' +
        '        float: left;\n' +
        '        height: 50px;\n' +
        '        width: 122px;\n' +
        '        border-color: black;\n' +
        '        border-width: 2px;\n' +
        '        border-style: solid;\n' +
        '        color: #0e0000;\n' +
        '        line-height: 50px;\n' +
        '        text-align: center;\n' +
        '        font-size: 21px;\n' +
        '        cursor: pointer;\n' +
        '        margin-left: 50px;\n' +
        '    }\n' +
        '\n' +
        '</style>\n' +
        '<div class="fu_zhu">\n' +
        '    <p>输入指令</p><p id="my_commands"></p>\n' +
        '    <textarea id="my_script_input_command"></textarea>\n' +
        '    <p>数据判断</p><p id="my_keywords"></p><p id="this_key"></p>\n' +
        '    <textarea id="my_script_input_keyword"></textarea>\n' +
        '    <p>运行状态:</p><p id="my_run_status">无状态</p>\n' +
        '    <textarea id="status" readonly></textarea>\n' +
        '    <div class="btn" id="run">开始</div>\n' +
        '    <div class="btn" id="stop">暂停</div>\n' +
        '</div>';
    $('body').append(fu_zhu_set); //将新创建的div节点插入到nav容器的内容底部

    $('body').append('<audio id="my_notify_audio" src="https://ppt-mp3cdn.hrxz.com/d/file/filemp3/hrxz.com-xlbhueszh1b64603.mp3" loop="true"></audio>')


    function replace_ns(testStr) {
        return testStr.replace(/\s/g, "").replace(/[\r\n]/g, "");
    }

    function is_time_out() {
        function run_timeout() {
            let time_out = localStorage.getItem("last_run_time_class_1_code_time");
            if (!time_out) {
                console.log("//没有此对象,不用考虑超时问题")
                return -1;
            } else {
                let lTime_interval = Date.parse(new Date()) - parseInt(time_out)
                console.log(lTime_interval)
                if (lTime_interval > 60000) {
                    console.log("//超时了")
                    return 1;
                } else {
                    console.log("没超时")
                    return 0;
                }
            }
        }

        if (run_timeout() === 1) {
            next_code = 'cmd1';//执行第一类指令
            return true;
        } else {
            return false;
        }
    }


    function detect_id() {
        function get_now_id() {
            let uulist = document.querySelectorAll(".dn-response-line");
            if (uulist.length = 0) {
                return -1;
            } else {
                let id = $(uulist[uulist.length - 1].children[0]).attr("object-id");
                return id
            }
        }

        let now_id = get_now_id();

        if (now_id === -1) {
            console.log("队列没有消息")
            return true
        }

        if (id_hub.indexOf(now_id) < 0) {
            id_hub.push(now_id);
            return true;
        } else {
            console.log(next_code)
            console.log(id_hub)
            console.log("返回false")
            return false;
        }
    }

    function fitting_ns(test_list) {
        return test_list.join("|")
    }


    function save_get() {
        function shu_las(textarea_id, local_tag, tip_id) {
            let stop_cls = false;
            let text_val = replace_ns($(textarea_id).val())
            let value_dtae;
            if (text_val === '') {
                //输入框无内容
                let local_str = localStorage.getItem(local_tag);
                if (local_str === null) {
                    $(tip_id).text("空内容")
                    stop_cls = true;
                } else {
                    let local_value = JSON.parse(local_str);
                    if (local_value.length === 0) {
                        $(tip_id).text("空内容")
                        stop_cls = true;
                    } else {
                        $(tip_id).text("OK")
                        text_val = local_value;
                        $(textarea_id).val(fitting_ns(text_val))
                    }
                }
            } else {
                value_dtae = text_val.split('|');
                $(tip_id).text("存在命令")
                let my_value_str = JSON.stringify(value_dtae);
                localStorage.setItem(local_tag, my_value_str);
            }
            return [value_dtae, stop_cls]
        }

        let this_commands_data = shu_las('#my_script_input_command', '#my_commands', '#my_commands')
        let this_keywords_data = shu_las('#my_script_input_keyword', '#my_keywords', '#my_keywords')
        return [this_commands_data[0], this_keywords_data[0]]
    }

    function play_notify(param) {
        let audioEle = document.getElementById("my_notify_audio");
        if (param === 1) {
            audioEle.play()
        } else {
            audioEle.pause()
        }
    }


    function set_runs(data, command) {
        for (let i = 0; i < data.length; i++) {
            if (data[i][0] === command) {
                data[i][1] += 1;//    命令执行次数加一
            }
        }
        let dis_ste = "";
        for (let i = 0; i < data.length; i++) {
            dis_ste = dis_ste + data[i][0] + "\t 执行次数：" + data[i][1] + "\n";
        }
        $("#status").val(dis_ste);//设置运行状态文本域
        return data;
    }

    function command_inpu_run(command) {
        $(".command-line-input").val(command)
        $(".send-button").click()
        const myDate = new Date();
        console.log("执行指令:" + command + "\t时间戳：" + myDate.toISOString());
    }


    function get_response_run(param) {
        function get_response_run1() {
            //返回请求性指令返回关键字
            let uu_list = document.querySelectorAll(".dn-response-line");
            let code_list = []
            if (uu_list.length > 0) {
                //有新消息
                let last_message = uu_list[uu_list.length - 1];
                let booking = last_message.querySelectorAll('.booking-classes');
                if (booking.length > 0) {
                    let info_list = booking[0].querySelectorAll('.point-and-click-element');
                    for (let i = 0; i < info_list.length; i++) {
                        code_list[code_list.length] = info_list[i].textContent
                    }
                    console.log(code_list)
                }
            }
            return code_list
        }

        function get_response_run2() {
            let list = $(".dn-response-line[aria-live='polite']");
            let last_info = list[list.length - 1]
            return $(last_info).find(".dn-line .col-booking-6").text();
        }

        if (param === 1) {
            return get_response_run1();
        } else if (param === 2) {
            return get_response_run2();
        }
    }


    function run_code() {

        function select_code(data) {
            //选择一个执行次数最少的指令
            //return str
            let min_code = 99999999;//设置一个伪最大值
            let command = "";
            for (let i = 0; i < data.length; i++) {
                if (data[i][1] < min_code) {
                    min_code = data[i][1];
                    command = data[i][0];
                }
            }
            return command;
        }

        function creat_mini_command(short_code) {
            return '0' + short_code.substr(-1) + short_code.substr(-2, 1) + '1';
        }

        function record_time() {
            localStorage.setItem("last_run_time_class_1_code_time", Date.parse(new Date()));
        }


        //cmd1,第一类指令
        //cmd2,第二类指令
        //cmd3,第三类指令
        let detect_id_tag = detect_id();
        let detect_first_request;
        if (first_request_cmd === false) {
            console.log("第一条指令未被输入")
            detect_first_request = true;
        } else {
            console.log("第一条指令已被输入，检查id_hub")
            if (id_hub.length > 0) {
                detect_first_request = true;
            } else {
                detect_first_request = false;
            }

        }

        let detect_time_out = is_time_out();


        console.log("detect_id_tag:" + detect_id_tag)
        console.log("detect_first_request:" + detect_first_request)
        if ((detect_id_tag || detect_time_out) && detect_first_request) {
            console.log("最后一个返回true 执行nextcode")
            console.log(next_code)
            if (next_code === 'cmd1') {
                let command = select_code(glo_data);
                command_inpu_run(command)
                record_time();//记录执行时间
                if (first_request_cmd === false) {
                    first_request_cmd = true;
                }
                glo_data = set_runs(glo_data, command);//设置指令执行次数
                next_code = 'cmd2';
            } else if (next_code === 'cmd2') {
                next_code = 'cmd1';
                let code_list = get_response_run(1);
                //返回结果仅为codes列表
                for (const element of code_list) {
                    if (keywords.indexOf(element) > -1) {
                        let mini_code_2 = creat_mini_command(element)
                        $("#this_key").text(mini_code_2)
                        command_inpu_run(mini_code_2)
                        next_code = 'cmd3'
                        break;
                    }
                }
                id_hub.length = 0;
            } else if (next_code == 'cmd3') {
                let key_result = get_response_run(2);
                if (key_result.search('SS') > -1) {
                    $("#my_run_status").text("脚本已经暂停，等待用户操作");
                    play_notify(1);
                    clearInterval(qu);
                } else if (key_result.search('UC') > -1) {
                    console.log("下一步输入i")
                    command_inpu_run('i');
                    next_code = 'cmd1'
                } else {
                    // $("#my_run_status").text("脚本已经暂停，等待用户操作");
                    // play_notify(1);
                    // clearInterval(qu);

                    id_hub.length = 0;
                    console.log("idhub_置为0")
                }

            }
        }

    }

    function set_glo_values(val) {
        function set_data(commands) {
            let glo_data = []
            for (let i = 0; i < commands.length; i++) {
                glo_data[i] = [commands[i], 0];
            }
            return glo_data;
        }

        let data_lt = save_get();
        commands = data_lt[0];
        keywords = data_lt[1];

        console.log(commands)
        console.log(keywords)

        if (val === 1) {
            glo_data = set_data(commands)
        }


    }

    let commands;
    let keywords;
    //匹配字符
    let glo_data;

    set_glo_values(0);//初始化脚本时初始化变量

    //全局性的数据集

    let TimeDelay = 100;//api接口返回数据的延时
    let qu;//标记运行状态
    let next_code = 'cmd1';//标记下一步指令
    let id_hub = [];//存放消息id，出现新消息就把新的id放进去，可以依据判断消息是否出现过


    let first_request_cmd = false;

    $("#run").click(function () {
        set_glo_values(1);//点击开始按钮重置变量
        next_code = 'cmd1';
        id_hub = [];
        first_request_cmd = false;
        $("#my_run_status").text("运行中");
        qu = setInterval(run_code, TimeDelay);
    });

    $("#stop").click(function () {
        $("#my_run_status").text("已经停止");
        play_notify(-1);//停止播放音乐
        clearInterval(qu);
    })
});