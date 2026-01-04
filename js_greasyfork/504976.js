// ==UserScript==
// @name         SHU选课自动化脚本
// @namespace    https://sfkgroup.github.io/
// @version      0.3
// @description  这是一个助力上海大学选课的脚本
// @author       SFKgroup
// @match        http://xk.autoisp.shu.edu.cn/StudentQuery/QueryCourse
// @match        http://xk.autoisp.shu.edu.cn/CourseSelectionStudent/FuzzyQuery
// @match        http://xk.autoisp.shu.edu.cn/Home/TermSelect
// @match        http*://xk.shuosc.com/*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @icon         https://newsso.shu.edu.cn/static/images/ico.jpg
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/504976/SHU%E9%80%89%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/504976/SHU%E9%80%89%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    var data = GM_getValue('data', [{ 'name': 'Default', 'class': '', 'teacher': '', 'type': 'top', 'hide': true }])
    var index = 0
    var alert_res = false
    var output_dom = null
    var is_selecting_page = false

    function create_span() {
        var e_0 = document.createElement("span");
        e_0.setAttribute("style", "color:Red; display:inline;");
        //e_0.setAttribute("datahtmllocale", "fuzzyquerynarrowpossible");
        e_0.appendChild(document.createTextNode("当前模式下显示会有异常，但仍可以正常选课"));
        return e_0;
    }

    function create_button() {
        var e_0 = document.createElement("button");
        e_0.setAttribute("type", "button");
        e_0.setAttribute("class", "btn btn-primary btn-sm");
        var e_1 = document.createElement("i");
        e_1.setAttribute("class", "fa fa-chevron-left");
        e_0.appendChild(e_1);
        var e_2 = document.createElement("span");
        //e_2.setAttribute("datahtmllocale", "query");
        e_2.appendChild(document.createTextNode(" 快速选课 "));
        e_0.appendChild(e_2);
        var e_3 = document.createElement("i");
        e_3.setAttribute("class", "fa fa-chevron-right");
        e_0.appendChild(e_3);
        return e_0;
    }

    function create_button_up() {
        var e_0 = document.createElement("button");
        e_0.setAttribute("type", "button");
        e_0.setAttribute("class", "btn btn-primary");
        var e_1 = document.createElement("i");
        e_1.setAttribute("class", "fa fa-chevron-up");
        e_0.appendChild(e_1);
        var e_2 = document.createElement("span");
        //e_2.setAttribute("datahtmllocale", "query");
        e_2.appendChild(document.createTextNode(" 上移"));
        e_0.appendChild(e_2);
        return e_0;
    }

    function create_button_down() {
        var e_0 = document.createElement("button");
        e_0.setAttribute("type", "button");
        e_0.setAttribute("class", "btn btn-primary");
        var e_1 = document.createElement("i");
        e_1.setAttribute("class", "fa fa-chevron-down");
        e_0.appendChild(e_1);
        var e_2 = document.createElement("span");
        //e_2.setAttribute("datahtmllocale", "query");
        e_2.appendChild(document.createTextNode(" 下移"));
        e_0.appendChild(e_2);
        return e_0;
    }

    function create_button_empty() {
        var e_0 = document.createElement("button");
        e_0.setAttribute("type", "button");
        e_0.setAttribute("class", "btn btn-sm");
        var e_1 = document.createElement("i");
        e_1.setAttribute("class", "fa fa-stop");
        e_0.appendChild(e_1);
        var e_2 = document.createElement("span");
        //e_2.setAttribute("datahtmllocale", "query");
        e_2.appendChild(document.createTextNode(" 到底了"));
        e_0.appendChild(e_2);
        return e_0;
    }

    function create_button_hide(text) {
        var e_0 = document.createElement("button");
        e_0.setAttribute("type", "button");
        e_0.setAttribute("class", "btn btn-sm");
        var e_2 = document.createElement("span");
        //e_2.setAttribute("datahtmllocale", "query");
        e_2.appendChild(document.createTextNode(text));
        e_0.appendChild(e_2);
        return e_0;
    }

    function createTable(data) {
        var e_0 = document.createElement("table");
        e_0.setAttribute("class", "tbllist");
        var e_1 = document.createElement("tbody");
        var e_2 = document.createElement("tr");
        var e_3 = document.createElement("td");
        e_3.setAttribute("colspan", "20");
        e_3.setAttribute("style", "color:Blue;");
        var e_4 = document.createElement("span");
        e_4.setAttribute("datahtmllocale", "deletedcourses");
        e_4.appendChild(document.createTextNode("课程列表"));
        e_3.appendChild(e_4);
        e_2.appendChild(e_3);
        e_1.appendChild(e_2);
        var e_5 = document.createElement("tr");
        var e_6 = document.createElement("th");
        e_6.appendChild(document.createTextNode("选课顺序"));
        e_5.appendChild(e_6);
        var e_7 = document.createElement("th");
        e_7.appendChild(document.createTextNode("课程名称"));
        e_5.appendChild(e_7);
        var e_8 = document.createElement("th");
        e_8.appendChild(document.createTextNode("课程号"));
        e_5.appendChild(e_8);
        var e_9 = document.createElement("th");
        e_9.appendChild(document.createTextNode("教师号"));
        e_5.appendChild(e_9);
        var e_10 = document.createElement("th");
        e_10.appendChild(document.createTextNode("是否已选"));
        e_5.appendChild(e_10);
        var e_11 = document.createElement("th");
        e_11.appendChild(document.createTextNode("设置"));
        e_5.appendChild(e_11);
        e_1.appendChild(e_5);
        for (let i = 0; i < data.length; i++) {
            var e_12 = document.createElement("tr");
            e_12.setAttribute("name", "rowclass");
            e_12.setAttribute("style", "");
            var e_13 = document.createElement("td");
            e_13.setAttribute("style", "text-align: center;");
            e_13.appendChild(document.createTextNode(i + 1));
            e_12.appendChild(e_13);
            var e_14 = document.createElement("td");
            e_14.appendChild(document.createTextNode(data[i].name));
            e_12.appendChild(e_14);
            var e_15 = document.createElement("td");
            e_15.setAttribute("style", "text-align: center;");
            e_15.appendChild(document.createTextNode(data[i].class));
            e_12.appendChild(e_15);
            var e_16 = document.createElement("td");
            e_16.setAttribute("style", "text-align: center;");
            e_16.appendChild(document.createTextNode(data[i].teacher));
            e_12.appendChild(e_16);
            var e_17 = document.createElement("td");
            e_17.setAttribute("style", "text-align: center;");
            let hide_button = create_button_hide(data[i].hide?"是":"否")
            hide_button.addEventListener('click', function(){hide_class(data[i].class+'_'+data[i].teacher)})
            e_17.appendChild(hide_button);
            e_12.appendChild(e_17);
            var e_18 = document.createElement("td");
            e_18.setAttribute("style", "text-align: center;");
            if (i != 0){
                let up_button = create_button_up()
                up_button.addEventListener('click', function(){move_up(data[i].class+'_'+data[i].teacher)})
                e_18.appendChild(up_button);
            } else {
                e_18.appendChild(create_button_empty());
            }
            e_18.appendChild(document.createTextNode(" "));
            if (i != data.length-1){
            let down_button = create_button_down()
            down_button.addEventListener('click', function(){move_down(data[i].class+'_'+data[i].teacher)})
            e_18.appendChild(down_button);
            } else {
                e_18.appendChild(create_button_empty());
            }
            e_12.appendChild(e_18);
            e_1.appendChild(e_12);
        }
        e_0.appendChild(e_1);
        return e_0;
    }

    function move_up(id){
        GM_log('move up')
        for (let i = 0; i < data.length; i++){
            if (data[i].class+'_'+data[i].teacher == id){
                if (i == 0){
                    return
                }
                let temp = data[i]
                data[i] = data[i-1]
                data[i-1] = temp
                break
            }
        }
        GM_setValue('data', data)
        location.reload();
    }

    function move_down(id){
        GM_log('move down')
        for (let i = 0; i < data.length; i++){
            if (data[i].class+'_'+data[i].teacher == id){
                if (i == data.length-1){
                    return
                }
                let temp = data[i]
                data[i] = data[i+1]
                data[i+1] = temp
                break
            }
        }
        GM_setValue('data', data)
        location.reload();
    }

    function hide_class(id){
        GM_log('hide_class')
        for (let i = 0; i < data.length; i++){
            if (data[i].class+'_'+data[i].teacher == id){
                data[i].hide = !data[i].hide
                break
            }
        }
        GM_setValue('data', data)
        location.reload();
    }

    function fast_select() {
        index = 0
        document.querySelector("body > div.wrapper > div.content-wrapper > div.content > div > div:nth-child(1) > table > tbody > tr > td > button:nth-child(3)").click()
        document.querySelector("#tblcoursefilter > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=text]").value = data[index].class
        document.querySelector("#tblcoursefilter > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=text]").value = data[index].teacher
        document.querySelector("#QueryAction > i").setAttribute('class', 'fa fa-check-square-o')
        document.querySelector("#QueryAction > span").innerText = '选择'
        output_dom.innerText = '下一个课程:' + data[index].name
        index++

        let button = document.querySelector("#QueryAction")
        button.addEventListener('click', function () {
            //document.querySelector("#QueryAction > span").innerText = '选择'
            GM_log('clicked', index)
            if (alert_res) {
                alert('本选项是备选选项')
                alert_res = false
            }

            if (index < data.length) {
                if (data[index].type == 'res') { alert_res = true }
                document.querySelector("#tblcoursefilter > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=text]").value = data[index].class
                document.querySelector("#tblcoursefilter > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=text]").value = data[index].teacher
                document.querySelector("#QueryAction > span").innerText = '选择'
                document.querySelector("#QueryAction > i").setAttribute('class', 'fa fa-check-square-o')
            } else if (index == data.length) {
                document.querySelector("#tblcoursefilter > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=text]").value = ''
                document.querySelector("#tblcoursefilter > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=text]").value = ''
                output_dom.innerText = '这是最后一个课程了'
                document.querySelector("#QueryAction > span").innerText = '查询'
                document.querySelector("#QueryAction > i").setAttribute('class', 'fa fa-search')
                index = index + 10
            }

            let select_box = document.querySelector("#tblcoursecheck > tbody > tr:nth-child(2) > td:nth-child(1) > input")
            if (select_box != null) {
                if (data[index - 1].hide == false) {
                    select_box.click()
                    document.querySelector("#CourseCheckAction").click()
                    let select_result = document.querySelector("#divOperationResult > table > tbody > tr:nth-child(2) > td:nth-child(6)").innerText
                    document.querySelector("#divOperationResult > table > tbody > tr:nth-child(3) > td > button").click()
                    output_dom.innerText = select_result + ' | 下一个课程:' + data[index].name
                    if (select_result.indexOf('已选此课程') != -1) {
                        data[index - 1].hide = true
                    }
                } else {
                    output_dom.innerText = '您已选过' + data[index - 1].name + '(若手动退课需手动再选) | 下一个课程:' + data[index].name
                }
            } else {
                output_dom.innerText = '下一个课程:' + data[index].name
            }
            index++
        });
    }

    function set_data() {
        if (is_selecting_page){
            let data_dom = document.querySelector("body > div:nth-child(8) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div > div.ant-tabs-content.ant-tabs-content-no-animated.ant-tabs-left-content.ant-tabs-card-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > textarea")
            if (data_dom == null) {
                alert('设置失败: 请先打开"导出已选课程文本"窗口')
                return 1
            }
            let new_raw_data = data_dom.value.split('\n\n')
            data = []
            for (let i = 0; i < new_raw_data.length; i++) {
                if (new_raw_data[i].indexOf('~') != -1) { continue }
                let new_raw_data_line = new_raw_data[i].split('\n')
                data.push({
                    'name': new_raw_data_line[2].split(', ')[0],
                    'class': new_raw_data_line[1].split(', ')[0],
                    'teacher': new_raw_data_line[1].split(', ')[1],
                    'type': 'top',
                    'hide': false
                })

            }
            GM_log(data)
            GM_setValue('data', data)
            alert('设置成功')
        }
        else{
        let new_raw_data = prompt('请粘贴SHU排课助手导出的课程文本(~开头)').split('\r\n\r\n')

        if (new_raw_data == null) { return 1 }
        data = []
        for (let i = 0; i < new_raw_data.length; i++) {
            if (new_raw_data[i].indexOf('~') != -1) { continue }
            let new_raw_data_line = new_raw_data[i].split('\r\n')
            data.push({
                'name': new_raw_data_line[2].split(', ')[0],
                'class': new_raw_data_line[1].split(', ')[0],
                'teacher': new_raw_data_line[1].split(', ')[1],
                'type': 'top',
                'hide': false
            })

        }
        GM_log(data)
        GM_setValue('data', data)
        alert('设置成功')
    }}

    function show_data() {
        let data_print = []
        for (let i = 0; i < data.length; i++) {
            data_print.push((i + 1) + ':' + data[i].name + '_' + data[i].class + '_' + data[i].teacher)
        }
        alert(data_print.join('\r\n'))
    }

    GM_registerMenuCommand("设置课程", set_data);
    GM_registerMenuCommand("查看课程", show_data);

    if (document.querySelector("#tblcoursefilter") != null) {

        let run_button = create_button()
        var button_col = document.querySelector("body > div.wrapper > div.content-wrapper > div.content > div > div:nth-child(1) > table > tbody > tr > td")
        button_col.insertBefore(run_button, button_col.firstChild)
        run_button.addEventListener('click', function () {
            output_dom = document.querySelector("body > div.wrapper > div.content-wrapper > div.content > div > div:nth-child(1) > table > tbody > tr > td > span")
            if (output_dom == null) {
                output_dom = create_span()
                button_col.appendChild(output_dom)
            }
            fast_select()
        });

    } else {
        var table_dom = document.querySelector("body > div.wrapper > div.content-wrapper > div.content > div")
        if (table_dom){
            table_dom.appendChild(createTable(data))
            GM_log('选课未开始')
        } else {
            GM_log('课程复制页面')
            is_selecting_page = true
        }
    }
})();