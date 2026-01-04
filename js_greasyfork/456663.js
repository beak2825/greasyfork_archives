// ==UserScript==
// @name         教师资格考务-系统辅助
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  教师资格考务系统辅助
// @author       qqhugo
// @require      https://cdn.bootcdn.net/ajax/libs/xlsx/0.16.6/xlsx.full.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
//// @require      https://unpkg.com/axios/dist/axios.min.js
//// @resource     css https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.min.css

// @include      https://ntcekw*.neea.edu.cn/*

// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceUrl
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/456663/%E6%95%99%E5%B8%88%E8%B5%84%E6%A0%BC%E8%80%83%E5%8A%A1-%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/456663/%E6%95%99%E5%B8%88%E8%B5%84%E6%A0%BC%E8%80%83%E5%8A%A1-%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.2/FileSaver.min.js
(function () {
    //原页面中通过判断是否存在window.ActiveXObject来判断是否为ie浏览器
    //如(!window.ActiveXObject)为true则判断为非ie，会自动跳转到/teach/login/ieNote页
    //故将其直接赋值为true。
    //油猴脚本需添加如下指令，使本脚本在原页面执行前生效
    // @run-at      document-start
    if (location.pathname === "/teach/login" || location.pathname === "/teach/") {
        window.ActiveXObject = true
    }


    // 在任何页面启用，隔25分钟访问下首页，保持登陆状态
    setInterval(function () {
        $.get('/teach/frame/totalPage', function (html) {
            // console.log(html)
            // console.log(new Date())
        })
    }, 1000 * 60 * 25)
})();

//考务系统各页面附加功能
$(document).ready(function () {
    //指定页面执行指定函数模式
    console.log(location.pathname)
    //定义对象，不同的location.pathname，指定相应的do_script函数
    let page_action = {
        //非ie登陆
        "/teach/login/ieNote": {
            "do_script": ieNote,
        },

        //左侧菜单
        "/teach/frame/leftPage": {
            "do_script": leftPage,
        },
        // // 笔试审核已完成列表
        // "/teach/applicant/checkedList": {
        //     "do_script": checkedList,
        // },
        // //审核已经通过（未交费）页面
        // "/teach/applicant/cancelCheckedList": {
        //     "do_script": testpost,
        // },
        // // 笔试待审核列表页面
        // "/teach/applicant/list": {
        //     "do_script": bishi_daishenhe,
        // },

        // 笔试考生分配页
        "/teach/examRoomResult/preDispatch": {
            "do_script": bishi_kaoshenfenpei,
        },
        // 笔试考生分配页,分配第三时间段
        "/teach/examRoomResult/subjectDispatch2": {
            "do_script": subjectDispatch2,
        },
        // 笔试考生分配页,分配第一二时间段，分配普通科目101、102、201、202、301、302
        "/teach/examRoomResult/dispatch3": {
            "do_script": subjectDispatch3,
        },
        // 编排检查(考点)，获取考点分配到的考生，各科目人数
        "/teach/examRoomResult/statsArrange4org": {
            "do_script": statsArrange4org,
        },
        // 编排考场页面
        "/teach/examRoomResult/arrange": {
            "do_script": bianpaikaochang,
        },
        // 编排结果(考点),考点试场号列表
        "/teach/examRoomResult/statusksbp4org": {
            "do_script": shichanghaoliebiao,
        },
        // 考场编排结果列表 笔试
        "/teach/examRoomResult/arrangeQueryResult": {
            "do_script": arrangeQueryResult,
        },
        // 全部文档下载 笔试
        "/teach/examRoomResult/exportAllData": {
            "do_script": exportAllData,
        },
        // 查询编排结果 笔试 导出编排数据
        "/teach/examRoomResult/arrangeQuery": {
            "do_script": arrangeQuery,
        },
        // 考生信息开关设定 笔试
        "/teach/applicant/ismodifyDo": {
            "do_script": ismodifyDo,
        },
        // 考生信息开关设定 笔试
        "/teach/applicant/ismodify": {
            "do_script": ismodifyDo,
        },
        // // 密码重置页，获取考生手机号
        // "/teach/customer/password": {
        //     "do_script": getMobilePhoneNumber,
        // },
        // 面试错误考区处理
        "/teach/self/error_kaoqu": {
            "do_script": self_error_kaoqu,
        },
        // 面试编排明细查询导出
        "/teach/interviewArrange/arrangeQuery": {
            "do_script": interviewArrangeQuery,
        },
        // 面试编排-指定1位考生到指定 考点-时间段
        "/teach/interviewArrange/disZxsTiaoIv": {
            "do_script": interviewArrange_disZxsTiaoIv,
        },
        // 面试编排-清除编排
        "/teach/interviewArrange/clearArrange": {
            "do_script": interviewArrange_clearArrange,
        }
    }
    //如果访问页面的pathname在page_action中已定义，则执行对应的功能函数
    if (page_action.hasOwnProperty(location.pathname)) {
        page_action[location.pathname].do_script()
    }

});

//通用工具函数
//将数组out导出为excel文件
function export_to_excel(data, filename) {
    let wb = XLSX.utils.book_new();
    let sheet = XLSX.utils.aoa_to_sheet(data);
    // XLSX.utils.table_to_sheet()
    XLSX.utils.book_append_sheet(wb, sheet, "Sheet1")
    XLSX.writeFile(wb, filename);
}

function export_to_excel_table(table, filename) {
    let wb = XLSX.utils.book_new();
    let sheet = XLSX.utils.table_to_sheet(table, {raw: true});
    XLSX.utils.book_append_sheet(wb, sheet, "Table")
    XLSX.writeFile(wb, filename);
}

function ieNote() {
    $.get(
        '/teach/login',
        function (html) {
            $("body").prepend($(html).filter("form"))
        }
    )
}

//左侧菜单打开新窗口,添加星标
function leftPage() {
    //添加自己的菜单
    $("td:contains('面试报名审核')").parent().next().find("br:last").after(
        "<span>" +
        "<img src=\"../imagesmain/fang100.gif\" border=\"0\" style=\"margin-bottom:-5px\">" +
        "<a href='/teach/self/error_kaoqu' target='mainFrm'>错误考区处理★(非浙工大)</a>" +
        "</span>"
    )

    let tds = $("td[id^='outlookdiv']")
    tds.css('padding-left', '0px');
    tds.find("span").each(function () {
        //alert($(this).text());
        let $a = $(this).find('a').attr('href').split('"');
        //alert($a[1]);
        $(this).find('img').wrap("<a href='" + $a[1] + "' target='_blank'></a>");
    });

    // 为常用项目添加星标
    let add_star = ['常规分配', '编排检查(考点)', '编排考场', '清除考场编排', '编排结果(考点)',
        '查询编排明细', '文档全部下载', '编排明细查询', '单个考生调整编排', '清除编排','信息开关设定']
    add_star.forEach(function (value, index) {
        // console.log(index, value)
        $("a:contains(" + value + ")").append(" ★")
    })


}


//测试提交通过
function testpost() {
    $("#myForm").after("<div id='mytest'>提交测试</div><div id='mytest2'>提交测试2</div>")
    $("#mytest").click(function () {
        $.ajax({
            type: "POST",
            url: "/teach/applicant/applyNoCheckDo",
            data: {
                ids: '10688844',
                check3: 'check3',
                kindCode: '',
                idType: '',
                ywjzz: '',
                iszxs: '',
                isqx: '',
                v10688844: 1,
                myId: 10688844,
                n10688844: 1,
                comment10688844: '通过审核',
                memo10688844: '',
            },
            success: function (html) {
                console.log("提交成功", html)
            },
            complete: function (obj) {
                // let theobj = obj
                console.log(obj)
            }
        })
    })
    $("#mytest2").click(function () {
        $.get(
            '/teach/applicant/applyConfirmTable/5338113?flagyzm=23cbaafba884c25fc7171236cd55658357755add4926253a4540f2dac9b9df94b238547e2046057b6d034914aed58f91',
            function (html) {
                console.log(html)
            }
        )
    })

}

//提取每行信息，输入考生列表页html，返回查看考生信息页链接列表
function shenhe_wancheng_list(html) {
    let title_map = new Map([
        ["准考证号", "zkzh"],
        ["考生姓名", "xm"],
        ["证件号", "zjh"],
        ["考区", "kaoqu"],
        ["注册时间", "zcsj"],
        ["报名时间", "bmsj"],
        ["审核时间", "shsj"],
        ["审核人", "shr"],
        // ["操作", "xm"],
    ])
    let title_td = $(html).find("td[class=\"tableGrayHr\"]")
    let key_map = new Map(
        title_td.map(function (index, value) {
            // console.log(index, value)
            let key = $(value).text()
            if (title_map.has(key)) {
                return [[index, title_map.get(key)]]
            }
        })
    )
    // console.log(key_map)

    // 查找列表每行
    let stu_row_list = []
    let li = $(html).find("tr[bgcolor=\"#ffffff\"]")
    li.each(function (index, tr) {
        // 单元格文本
        let tds = $(tr).find("td")
        let stu_info_base_map = new Map(
            tds.map(function (index, value) {
                if (key_map.has(index)) {
                    return [[key_map.get(index), $.trim($(value).text())]]
                }
            })
        )
        // console.log(stu_info_base_map)
        // 考生信息查看链接
        let stu_info_url = $(tr).find("a").attr("href")
        let stu_id = stu_info_url.match(/applyConfirmTable\/([0-9]*)\?/)[1]
        stu_info_base_map.set('id', stu_id)
        stu_row_list.push({
            "stu_info_url": stu_info_url,
            "stu_info_base_map": stu_info_base_map,
        })
    })
    return stu_row_list
}

// 获取考生信息页
function get_kaosheng_infopage(url, stu_info_base_map = new Map) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (html) {
            // console.log(html)
            let x = jiexie_kaosheng_infopage(html, stu_info_base_map)
            console.log(x)
        },
    })
}

// 解析考生信息页
function jiexie_kaosheng_infopage(html, stu_info_map = new Map) {
    let cn_en_map = new Map([
        ['姓名', 'xm'],
        ['性别', 'xb'],
        ['出生日期', 'csrq'],
        ['民族', 'mz'],
        ['证件号码', 'zjh'],
        ['证件类型', 'zjlx'],
        ['政治面貌', 'zzmm'],
        ['户籍所在地', 'hjszd'],
        ['报考类别', 'bklb'],
        ['居住证申领地', 'jzzsld'],
        ['居住证编号', 'jzzbh'],
        ['学校名称', 'xxmc'],
        ['学习形式', 'xxxs'],
        ['最高学历层次', 'zgxl'],
        ['是否师范专业', 'sfzy'],
        ['入校年份', 'rxsj'],
        ['学制', 'xz'],
        ['当前年级', 'dqnj'],
        ['专业', 'zy'],
        ['学籍学号', 'xjxh'],
        ['院系班级', 'yxbj'],
        ['学历证书编号', 'xlzsbh'],
        ['学信网验证码', 'xxwyzm'],
        ['注册时间', 'zcsj'],
        ['电子邮箱', 'dzyx'],
    ])
    // let stu_info_map = new Map
    // console.log(html)
    //修改html，防止读照片
    html = html.replace("img", "div")


    // 是否在校生
    let title = $(html).find("span[style=\"color:#130C73;font-size:18px;font-weight:bold\"]").text()
    if (title.search("非在校生") > 0) {
        stu_info_map.set('sfzd', '否')
    } else {
        stu_info_map.set('sfzd', '是')
    }

    // 考生信息
    let tds = $(html).find("td")
    let tds_txt = Array.from(tds.map(function () {
        return $.trim($(this).text())
    }))
    let index_of_baokaoxinxi = tds_txt.findIndex(function (value) {
        return value === '报考信息'
    })

    let kaoshengxinxi_list = tds_txt.slice(0, 4).concat(tds_txt.slice(5, index_of_baokaoxinxi))
    // console.log(kaoshengxinxi_list)
    kaoshengxinxi_list.forEach(function (value, index, array) {
        let v = value.replace(' ', '')
        if (cn_en_map.has(v)) {
            stu_info_map.set(cn_en_map.get(v), array[index + 1])
        }
    })

    // 报考科目信息kemu_list
    let kemu_list = tds_txt.slice(index_of_baokaoxinxi + 3, tds_txt.length - 3)
    let kemu = ''
    kemu_list.forEach(function (value, index) {
        if (index % 2 === 0) {
            kemu += value.split('-', 1) + ','
        }
    })
    stu_info_map.set('km', kemu)

    // console.log(stu_info_map)
    return stu_info_map
}

// 获取已审核考生列表
function checkedList() {
    $("body").prepend("<a id='start'> 开始 </a>")
    $("#start").click(function () {
        get_one()
        // savef()
    })

    // // 保存文件测试用
    // function savef() {
    //     // let blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    //     // saveAs(blob, "hello world.txt");
    //     // 存储中 增加一个存储量，名字叫 'myName', 值是'woonigh'
    //     let my_name = GM_setValue('myName', 'Woonigh');
    //
    //
    //     // 读取存储中的，名字叫 'hisName' 的值， 如果没有这个名字的存储的话，那返回来的值就叫 'Tony'
    //     let his_name = GM_getValue('hisName', 'Tony');
    //     let xx = GM_getValue('myName')
    //     console.log(xx)
    // }

    //笔试审核已完成考生页访问测试
    function get_one() {
        $.ajax({
            type: "GET",
            url: "/teach/applicant/checkedList",
            data: {"offset": 5, "max": 5},
            success: function (html) {
                let stu_row_list = shenhe_wancheng_list(html)
                stu_row_list.forEach(function (stu_row) {
                    get_kaosheng_infopage(stu_row["stu_info_url"], stu_row["stu_info_base_map"])
                })
            },
        })
    }

}

// 笔试待审核列表页面
function bishi_daishenhe() {

    function get_list_page(offset, max) {
        $.ajax({
            async: false,
            type: 'GET',
            url: '/teach/applicant/list',
            data: {
                offset: offset,
                max: max,
            },
            success: function (html) {
                let infodata = []
                //匹配每行
                let trs = $(html).find("tr[bgcolor='#ffffff']")
                //提取每行考生数据
                $(trs).each(function (index, tr) {
                    let tds = $(tr).find("td")
                    //考生信息
                    let info = {
                        'sname': $(tds).eq(0).text(),
                        'sidcardno': $(tds).eq(1).text(),
                        'city': $(tds).eq(2).text(),
                        'szhucetime': $(tds).eq(3).text(),
                        'sbaomingtime': $(tds).eq(4).text(),
                    }
                    //将1行考生信息info，添加到该页infodata数组
                    infodata.push(info)
                })
                let json = JSON.stringify(infodata)
                // console.log(json)
                $.ajax({
                    async: true,
                    type: 'POST',
                    url: 'https://10.24.35.189/App_ntceshenhe/api/index/add_baoming',
                    data: {'json': json},
                    success: function () {
                        console.log('page', offset, 'saved')
                    },
                    complete: function (xhr) {
                        console.log('page', offset, xhr.state())
                    }
                })


            }
        })
    }

    $("body").prepend("<button type='button' id='get_info'>获取考生信息</button>")
    $("#get_info").click(function () {
        for (let i = 0; i <= 1; i++) {
            try {
                get_list_page(i, 20)
                console.log('page', i)
            } catch (err) {
                console.log(i, err)
            }
        }
    })
}

function bishi_kaoshenfenpei() {
    let js = $('script').text()
    let kaoqu_name = js.match(/var orgname= "([^"]*)"/)[1]
    let kaoqu_id = js.match(/newAjax\( 'orgInfo',([^)])\);/)[1]
    console.log("考点：id", kaoqu_name, kaoqu_id)
}

//获取考点信息
function get_kaodian_info(handle) {
    $.get('/teach/orginfo/spotList',
        function (html) {
            let trs = $(html).find("input[name='myId']").parent().parent()
            $.each(trs, function (index, tr) {
                // console.log(tr)
                let kaodian_id = $(tr).find("input[name='myId']").val()
                let kaodian_name = $(tr).find("td").eq(2).text()
                console.log(kaodian_id, kaodian_name)
                $(handle).append(
                    "<div><input type='radio' name='kaodian' value='" + kaodian_id + "'>"
                    + "id:" + kaodian_id + " " + kaodian_name + "</div>")
            })

        })
}

//获取考点信息2
function get_kaodian_info_2(callback, async = true) {
    $.ajax({
        async: async,
        url: '/teach/orginfo/spotList',
        tpye: "get",
        success: function (html) {
            let trs = $(html).find("input[name='myId']").parent().parent()
            $.each(trs, function (index, tr) {
                // console.log(tr)
                let kaodian_id = $(tr).find("input[name='myId']").val()
                let kaodian_code = $(tr).find("td").eq(1).text()
                let kaodian_name = $(tr).find("td").eq(2).text()
                if (callback !== undefined) {
                    let kaodian_data = {kaodian_id: kaodian_id, kaodian_name: kaodian_name, kaodian_code: kaodian_code}
                    callback(kaodian_data)
                }
            })
        }
    })

}

// 获取面试时间段
async function get_time_map_ms() {
    return new Promise(function (resolve, reject) {
        let vals = []
        $.ajax({
            url: '/teach/interviewArrange/arrangeQuery',
            type: 'get',
            success: function (html) {
                let items = $(html).find("#sceneId  option")
                for (let i = 1; i < items.length; i++) {
                    vals.push($(items[i]).val())
                }
                resolve(vals)
            }
        })
    })
}

// 工具函数
// 笔试分配考生到考点
function fenpei_to_kaodian(kaodian_id, renshu, kemu_id, kaoqu_id, xueduan_id) {
    let key = 'value_' + kaodian_id.toString()
    let p_data = {
        myId: kaodian_id,//考点id
        planId: kemu_id,//科目id
        orgId: kaoqu_id,//考区id
        examType: xueduan_id,//学段id
        ids: kaodian_id,//考点id
    }
    p_data[key] = renshu //人数
    $.ajax({
        type: 'post',
        url: '/teach/examRoomResult/subjectDispatchDo',
        data: p_data,
    })
}

// 笔试考生分配页,分配第三时间段
function subjectDispatch2() {
    //获取考区id：orgId，学段id：examType
    let kaoqu_id = $("[name='orgId']").val()
    let xueduan_id = $("[name='examType']").val()
    console.log(kaoqu_id, xueduan_id)

    //隐藏下一步按钮
    $("input[value='下一步']").hide()

    // 添加考点选择表
    let form = $("form")
    form.wrap("<div class='wrap'></div>")
    form.css('float', 'left')
    form.before("<div style='float:left'><div id='kaodian_list' ></div></div>")
    get_kaodian_info($("#kaodian_list"))

    // 为每学科每行添加复选框，隐藏单选
    let inputs = $("[name='myId']")
    $.each(inputs, function (index, input) {
        if (!$(input).attr('disabled')) {
            let planId = $(input).val()
            $(input).parent().parent().attr('name', 'info_row')
            $(input).after("<input type='checkbox' name='planId' value='" + planId + "'/>")
            $(input).hide()
        }
    })

    // 在“科目”单元格中加入“全选”复选框
    $("td:contains('科目')").text(function (index, td_text) {
        if (td_text === "科目") {
            $(this).prepend("<input type='checkbox' id='select_all'>全选 ")
            // 当“全选”复选框选中时，自动选中所有科目
            $("#select_all").change(function () {
                if ($(this).prop('checked')) {
                    $("[name='planId']").prop('checked', true)
                } else {
                    $("[name='planId']").prop('checked', false)
                }
            })
        }
    })
    //添加一键分配按钮
    $("#kaodian_list").after("<hr>" +
        "<p>说明：单选考点，复选科目，单击一键分配后，</br>" +
        "会自动把对应科目的【全部】考生，分配到指定考点。</br>" +
        "分配是否成功，本页面无反馈，可在分配统计页面中查看。</p>" +
        "<button type='button' id='tijiao'>一键分配选中科目</button>")
    $("#tijiao").click(function () {
        //获取考点选择表中选中的考点id
        let kaodian_id = $("[name='kaodian']:checked").val()
        console.log(kaodian_id)
        //遍历选中的科目
        let kemu_id_list = $("[name='planId']:checked")
        $.each(kemu_id_list, function (index, kemu) {
            // 科目id
            let kemu_id = $(kemu).val()
            // 待分配人数
            let renshu = $(kemu).parent().parent().find("td").eq(1).text()
            fenpei_to_kaodian(kaodian_id, renshu, kemu_id, kaoqu_id, xueduan_id)
        })

    })
}

// 笔试考生分配页,分配普通科目
function subjectDispatch3() {
    let aform = $("#aForm").find("tr").filter(":gt(3)")
    aform.each(function () {
        // $(this).find("td:eq(1)").attr("align", "left")
        //input1:选择考点的复选框，input2：分配人数输入框
        // 将两输入组件移动到考点名字两边，方便操作
        let input1 = $(this).find("td:eq(0)").find("input")
        let input2 = $(this).find("td:eq(2)").find("input")
        $(this).find("td:eq(1)").prepend(input1)
        $(this).find("td:eq(1)").append(input2)
        // 当分配人数输入框里有数字后，自动选中该考点复选框。分配人数无时，则取消选择复选框
        input2.change(function () {
            if (input2.val() !== "") {
                input1.prop('checked', true)
            } else {
                input1.prop('checked', false)
            }
        })
        // console.log($(this).find("td"))
    })
}

function statsArrange4org() {
    $("body").prepend("<table  id='content' class='table table-sm'><tr><td>考点</td><td>科目</td><td>人数</td><td>试场数</td><td>尾数</td><td>已编排人数</td></tr></table>")
    get_kaodian_info_2(function (kaodian_data) {
        // console.log(data)
        let kaodian_name = kaodian_data['kaodian_name']
        get_kaodian_fenpei_kemu_renshu(kaodian_data['kaodian_id'], function (fenpei_data) {
            $("#content").append("<tr>" +
                "<td>" + kaodian_name + "</td>" +
                "<td>" + fenpei_data['kemu'] + "</td>" +
                "<td>" + fenpei_data['totle_no'] + "</td>" +
                "<td>" + fenpei_data['shichangshu'] + "</td>" +
                "<td>" + fenpei_data['weishu'] + "</td>" +
                "<td>" + fenpei_data['yibianpai'] + "</td>" +
                "</tr>")
        })
    })
}

// 获取考点分配的各科人数
function get_kaodian_fenpei_kemu_renshu(kaodian_id, callback) {
    $.ajax({
        type: 'post',
        url: '/teach/examRoomResult/statsArrange4org',
        data: {
            'orginfo.id': kaodian_id,
            'fir': 'fir',
        },
        success: function (html) {
            // 考点科目分配统计表，取第二行至倒数第二行的数据行
            let trs = $(html).find("tbody").eq(2).find("tr").slice(1, -1)
            $.each(trs, function (index, tr) {
                //第二列，总分配考生
                let td_2 = $(tr).find("td").eq(1).text()
                if (td_2.match(/^\d+$/) && td_2 !== "0") {
                    let tds = $(tr).find("td")
                    let kemu = tds.eq(0).text()
                    let totle_no = td_2
                    let shichangshu = Math.ceil(totle_no / 30) //试场数
                    let weishu = totle_no % 30 //尾数试场人数
                    let yibianpai = tds.eq(2).text()
                    // console.log(kaodian_id, kemu, totle_no, shichangshu)
                    if (callback !== undefined) {
                        callback({
                            kemu: kemu,
                            totle_no: totle_no,
                            shichangshu: shichangshu,
                            weishu: weishu,
                            yibianpai: yibianpai
                        })
                    }
                }
            })
        }
    })
}

//编排考场页面
function bianpaikaochang() {
    $("form").after(
        "<button type='button' id='show_kaodian'>编排所有考点</button>" +
        "<table border='1' id='kaodian_list'></table>"
    )
    $("#show_kaodian").click(function () {
        get_kaoqu_id(function (kaoqu_id) {
            get_kaodian_info_2(function (kaodian_data) {
                let kaodian_name = kaodian_data["kaodian_name"]
                let kaodian_id = kaodian_data["kaodian_id"]
                console.log(kaoqu_id, kaodian_id)
                $("#kaodian_list").append(
                    "<tr><td>" + kaodian_name +
                    "</td><td id='bp_" + kaodian_id + "'></td></tr>"
                )
                kaodian_bianpai(kaoqu_id, kaodian_id, function (kaodian_id, txt) {
                    $("#bp_" + kaodian_id).text(txt)
                })
            })
        })
    })

    function get_kaoqu_id(callback) {
        $.ajax({
            type: 'get',
            url: '/teach/orginfo/list',
            success: function (html) {
                let kaoqu_id = $(html).find("input[name='myId']").val()
                callback(kaoqu_id)
            }
        })
    }

    function kaodian_bianpai(kaoqu_id, kaodian_id, callback) {
        $.ajax({
            type: 'post',
            url: '/teach/examRoomResult/arrange2',
            data: {
                'orgId': kaoqu_id,
                'orginfo.id': kaodian_id,
                'examPlanId': '000',
            },
            success: function (html) {
                let txt = $(html).find('span').text()
                console.log(txt)
                callback(kaodian_id, txt)
            }
        })
    }


}

// 编排结果(考点),考点试场号列表
function shichanghaoliebiao() {
    $('body').prepend("<button type='button' id='exp_all'>导出所有考点</button>")
    $("#exp_all").click(function () {
        exp_all()
    })

    function exp_all() {
        $("body").append("<table id='kd_list'></table>")
        //获取考试时间信息
        let time_map = []
        $.ajax({
            async: false,
            type: "get",
            url: "/teach/examRoomResult/tailMergeQuery",
            success: function (html) {
                $.each($(html).find("option "), function (index, op) {
                    let start_time = $(op).val()
                    let end_time = (Number(start_time.substr(-5, 2)) + 2).toString() + ":00"
                    time_map.push(start_time + "-" + end_time)
                })
            }
        })

        // 考点信息列表,遍历所有考点
        let kaodian_list = []
        get_kaodian_info_2(function (info) {
            let key = String(info.kaodian_code)
            kaodian_list[key] = info.kaodian_name
            // console.log(kaodian_list)
            $("#kd_list").append("<tr><td>" + info.kaodian_code + info.kaodian_name + "</td></tr>")
            $.ajax({
                type: 'post',
                url: '/teach/examRoomResult/statusksbp4org',
                data: {
                    'orginfo.id': info.kaodian_id,
                    'fir': 'fir',
                },
                success: function (html) {
                    // console.log(html)
                    export_kaodian(html, time_map)
                }
            })
        })

        function export_kaodian(html, time_map) {
            //标题 XXXX年上下半年
            let title = "中小学教师资格笔试考场列表"
            let year = time_map[0].substring(0, 4)
            let month = time_map[0].substring(5, 7)
            // let year = '2021'
            // let month = '03'
            if (month < "06") {
                title = year + "年上半年" + title
            } else {
                title = year + "年下半年" + title
            }
            //考点信息
            let kaodiancode = $(html).find("td").eq(13).text().substr(0, 6)
            // console.log(kaodiancode)
            let kaodianmingcheng = kaodian_list[kaodiancode]
            //考场列表内容
            let data = []
            let tmp_kemu = ""
            let trs = $(html).find("tr:contains('考试科目')").parent().find("tr:gt(0)")
            // console.log(html)
            // console.log(trs)
            $.each(trs, function (index, tr) {
                let tds = $(tr).find('td')
                let kemu = $(tds).eq(-6).text()//考试科目
                if (kemu !== "") {
                    tmp_kemu = kemu
                } else {
                    kemu = tmp_kemu
                }
                let kaochangdaima = $(tds).eq(-4).text()//考场代码
                let kaochangrenshu = $(tds).eq(-1).text()//考场人数
                let time_flag = kemu.substr(1, 2)//考试时间标志
                let kaoshishijian
                if (time_flag === "试科") {
                    kaoshishijian = "考试时间"
                } else if (time_flag === "01") {
                    kaoshishijian = time_map[0]
                } else if (time_flag === "02") {
                    kaoshishijian = time_map[1]
                } else {
                    kaoshishijian = time_map[2]
                }
                // console.log(kemu,kaochangdaima, kaochangrenshu, time_flag,kaoshishijian)
                data.push([kaoshishijian, kemu, kaochangdaima, kaochangrenshu])
            })
            //因，将试场号列表重新按考试时间-试场号排序
            //试场号列表先按试场号排序x[2]：kaochangdaima，确保试场号是顺序排列
            data.sort(function (x, y) {
                return x[2].localeCompare(y[2])
            })
            //试场号列表再按考试时间排序x[0]：kaoshishijian
            data.sort(function (x, y) {
                return x[0].localeCompare(y[0])
            })
            // console.log(data)

            let data_out = []
            let i //导出表第一列序号
            let tmp_kaoshishijian = ""
            for (let item of data) {
                let kaoshishijian = item[0]
                let kemu = item[1]
                let kaochangdaima = item[2]
                let kaochangrenshu = item[3]
                if (kaoshishijian !== tmp_kaoshishijian) {
                    tmp_kaoshishijian = kaoshishijian
                    data_out.push([title])
                    data_out.push(["考点名称：" + kaodianmingcheng])
                    data_out.push(["考点代码：" + kaodiancode])
                    data_out.push(["考试时间：" + kaoshishijian])
                    data_out.push(["序号", "考试时间", "考试科目", "考场代码", "人数", "教室号"])
                    i = 1
                }
                data_out.push([i, kaoshishijian, kemu, kaochangdaima, kaochangrenshu])
                i += 1
            }
            // console.log(data_out.length)
            if (data_out.length > 0) {
                export_to_excel(data_out, kaodiancode + "_" + kaodianmingcheng + "_试场号列表.xlsx")
            }

        }
    }


    // // 考点列表测试
    // $('body').prepend("<button type='button' id='kaodiantest'>考点测试</button>")
    // $("#kaodiantest").click(function () {
    //     $.ajax({
    //         type: "get",
    //         url: "/teach/examMateStatistics/ajaxlist",
    //         data: {
    //             id: 29,
    //             ttop: 0,
    //             // obj:orgInfo,
    //             lleft: 0,
    //             wwidth: 0,
    //             isclic: 1,
    //             hheight: 0,
    //             // pobj:orgInfo,
    //             lev: 2,
    //         },
    //         complete: function (html) {
    //             console.log(html)
    //             console.log(html.responseText)
    //         },
    //         success: function (xx) {
    //             console.log(xx)
    //             console.log("ok")
    //         }
    //     })
    // })
}

//考场编排结果列表笔试
function arrangeQueryResult() {
    $('body').prepend("<div id='button'>测试</div>")
    $("#button").click(function () {
        console.log('xxxx')
        $.ajax({
            type: 'get',
            data: {
                'offset': 0,
                'max': 100,
                'planId': '000',
                'sceneId': '000',
                'orginfo.id': '498',
                'search': '',
                'nametj': '',
            },
            url: '/teach/examRoomResult/arrangeQueryResult',
            success: function (html) {
                // console.log(html)
                let trs = $(html).filter(".tableGray").find('tr')
                // console.log(trs.length)
                $.each(trs, function (index, tr) {
                    let tds = $(tr).find('td').text()
                    console.log(tds)
                    console.log(tds.length)
                })
            }
        })
    })
}

// 全部文档下载 笔试
function exportAllData() {
    $('body').append("<div><button type='button' id='listall'>列出所有考点 考场核对单</button></div>")
    $("#listall").click(function () {
        listall()
    })

    function listall() {
        $('body').append("<table id='k_table'>考点列表</table>")
        get_kaodian_info_2(function (kaodian_list) {
            $(kaodian_list).each(function () {
                $("#k_table").append("<tr>" +
                    "<td>" + this["kaodian_id"] + "</td>" +
                    "<td id='filename_" + this["kaodian_id"] + "'>" + this["kaodian_code"] + this["kaodian_name"] + "</td>" +
                    "<td id='kd_" + this["kaodian_id"] + "'></td>" +
                    "</tr>")
                ger_wendang_bs(this["kaodian_id"])
            })
        })

        function ger_wendang_bs(kaodian_id) {
            if (kaodian_id > 0) {
                $.ajax({
                    type: 'post',
                    data: {
                        'orginfo.id': kaodian_id,
                    },
                    url: '/teach/examRoomResult/exportNamelistAll',
                    success: function (html) {
                        // console.log(html)
                        let download_link = $(html).find("a:contains('下载')")
                        if (download_link.length > 0) {
                            console.log(download_link, 'ok')
                            $("#kd_" + kaodian_id).append(download_link)
                            let file_url = $(download_link).attr('href')
                            $(download_link).after("<a id='dl_" + kaodian_id + "'>  按考点文件名下载</a>")
                            $("#dl_" + kaodian_id).click(
                                download(file_url, $("#filename_" + kaodian_id).text() + ".pdf")
                            )
                        } else {
                            $("#kd_" + kaodian_id).append(
                                $(html).find("span").filter(":contains('没有编排记录')")
                            )
                        }
                    }
                })
            }
        }
    }

    /**
     * 获取 blob
     * @param  {String} url 目标文件地址
     * @return {Promise}
     */
    function getBlob(url) {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                }
            };

            xhr.send();
        });
    }

    /**
     * 保存
     * @param  {Blob} blob
     * @param  {String} filename 想要保存的文件名称
     */
    function saveAs(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            const link = document.createElement('a');
            const body = document.querySelector('body');

            link.href = window.URL.createObjectURL(blob);
            link.download = filename;

            // fix Firefox
            link.style.display = 'none';
            body.appendChild(link);

            link.click();
            body.removeChild(link);

            window.URL.revokeObjectURL(link.href);
        }
    }

    /**
     * 下载
     * @param  {String} url 目标文件地址
     * @param  {String} filename 想要保存的文件名称
     */
    function download(url, filename) {
        getBlob(url).then(blob => {
            saveAs(blob, filename);
        });
    }

}

// 查询编排结果 笔试 导出编排数据
function arrangeQuery() {
    $("body").append("<button id='get_all'>导出所有考点编排数据</button>" +
        "<div>已检查考点：<span id='numbers_of_kaodian'></span> 获取条数：<span id='totle_rows'></span>条 </div>")
    $("#get_all").click(function () {
        get_all()
    })

    function get_all() {
        let number_of_rows = 0
        let out_data = [['考生姓名', '准考证号', '证件号码', '考试科目', '考点名称', '考场代码', '座位号', '考试时间']]
        let total_number_of_kd = 0, used_number_of_kd = 0, unused_number_of_kd = 0
        get_kaodian_info_2(function (kd) {
            // console.log(kd)
            total_number_of_kd += 1
            $.ajax({
                type: 'get',
                url: '/teach/examRoomResult/arrangeQueryResult',
                data: {
                    'offset': 0,
                    'max': 99999,
                    'planId': '000',
                    'sceneId': '000',
                    'orginfo.id': kd['kaodian_id'],
                },
                success: function (html) {
                    let trs = $(html).filter(".tableGray").find("tr:gt(0)")
                    // console.log(trs)
                    if (trs.length > 0) {
                        // 有分配考生的考点
                        used_number_of_kd += 1
                        trs.each(function (index, tr) {
                            let td_txt_arr = $(tr).find("td").map(function () {
                                return $.trim($(this).text());
                            }).get()
                            // console.log(td_txt_arr)
                            out_data.push(td_txt_arr)
                            number_of_rows += 1
                            $("#totle_rows").text(number_of_rows)
                        })
                    } else {
                        // 没有分配考生的考点
                        unused_number_of_kd += 1
                    }
                    $("#numbers_of_kaodian").text("共" + total_number_of_kd + "/已用" + used_number_of_kd + "+未用" + unused_number_of_kd)
                    if (used_number_of_kd + unused_number_of_kd === total_number_of_kd) {
                        // console.log(out_data)
                        $("#totle_rows").parent().append("<button id='save_all'>下载</button>")
                        $("#save_all").click(function () {
                            export_to_excel(out_data, 'bs_stu_list.xlsx')
                        })
                    }
                }
            })
        })
    }
}

// 考生信息开关设定 笔试
function ismodifyDo() {

    $("body").prepend("姓名\\t身份证号<div><textarea id='stu_list'></textarea>" +
        "<button id='turn_on'>批量打开</button><button id='turn_off'>批量关闭</button></div>" +
        "<div><table id='stu_table'></table></div>")
    $("#turn_on").click(function () {
        bulk_open_or_close('P')
    })
    $("#turn_off").click(function () {
        bulk_open_or_close('N')
    })

    function bulk_open_or_close(on_off) {
        $("#stu_table").children().remove()
        let text_content = $("#stu_list").val()
        let rows = text_content.split('\n')
        rows.forEach(function (row) {
            let stu = row.split("\t", 2)
            let realname = stu[0]
            let idcard = stu[1]
            $("#stu_table").append("<tr><td>" + realname + "</td><td>" + idcard + "</td><td id='" + idcard + "'></td></tr>")
            photo_editing_switch_turned_on(realname, idcard, on_off,
                function (txt) {
                    $("#" + idcard).append(txt)
                })
        })
    }

    function photo_editing_switch_turned_on(realname, idCard, on_off, callback_function) {
        //on_off为"P"打开修改，"N"关闭修改
        $.ajax({
            type: 'post',
            data: {
                'realname': realname,
                'idCard': idCard,
                'photo': on_off,
                'zpModify': on_off,
            },
            url: '/teach/applicant/ismodifyDo',
            success: function (html) {
                // console.log(html)
                let return_content_successfully = $(html).find("span:contains('成功')").text()
                let return_content_failed = $(html).filter(".message").text()
                callback_function(return_content_successfully + return_content_failed)
                console.log(return_content_successfully + return_content_failed)
            }
        })
    }
}

function getMobilePhoneNumber() {
    $("body").append("姓名\t准考证号或身份证号<br/>" +
        "<textarea id='stu_info'></textarea>" +
        "<button id='submit'>获取</button>" +
        "<button id='test'>逐个大量获取</button>" +
        "<div><table id='phonelist'><tr><td>姓名</td><td>准考证号</td><td>身份证号</td><td>手机号</td></tr></table></div>")
    $("#test").click(function () {
        let rows = $("#stu_info").val().trim().split('\n')
        rows.forEach(function (item, index, input) {
            input[index] = item.split('\t')
        })
        // console.log(rows)
        let table = $("#phonelist")

        async function fn() {
            for (var i = 0; i < rows.length; i++) {
                await (function () {
                    return new Promise(function (res, rej) {
                        setTimeout(function () {
                            item = rows[i]
                            // console.log(item)
                            // table.append("<tr><td>" + item[0] + "</td><td>" + item[1] + "</td><td></td><td></td></tr>")
                            if (item[1].length == 18) {
                                phonenumber(item[0], item[1])
                            }

                            function phonenumber(realname, idcard) {
                                // 查询手机号
                                $.ajax({
                                    async: false,
                                    type: "post",
                                    url: '/teach/customer/passwordNext',
                                    data: {
                                        'realname': realname,
                                        'idCard': idcard,
                                    },
                                    success: function (html) {
                                        let p = $(html).find("td:contains('手机号')").parent().find("input").val()
                                        console.log(realname, idcard, p)
                                        // table.find("tr").eq(i+1).find("td").eq(3).text(p)
                                        table.append("<tr><td>" + realname + "</td><td></td><td>" + idcard + "</td><td>" + p + "</td></tr>")
                                    }
                                })
                            }

                            // console.log("res")
                            res();
                        }, 0)
                    })
                }())
                // console.log(i)

            }
        };

        fn()
    })
    $("#submit").click(function () {
        let rows = $("#stu_info").val().trim().split('\n')
        rows.forEach(function (item, index, input) {
            input[index] = item.split('\t')
        })
        console.log(rows)
        let table = $("#phonelist")
        rows.forEach(function (item, index, input) {
            table.append("<tr><td>" + item[0] + "</td><td>" + item[1] + "</td><td></td><td></td></tr>")
            if (item[1].length == 18) {
                phonenumber(item[0], item[1])
            } else if (item[1].length == 15) {
                // 查询身份证号
                $.ajax({
                    type: "post",
                    url: '/teach/applicant/checkedList',
                    data: {
                        'search': 'examNo',
                        'nametj': item[1]
                    },
                    success: function (html) {
                        let admission_ticket_number = $(html).filter("table.tableGray").find("tr").eq(1)
                            .find("td").eq(2).text()
                        // console.log(admission_ticket_number)
                        if (item[1].length == 18) {
                            admission_ticket_number = item[1]
                        }
                        table.find("tr").eq(index + 1).find("td").eq(2).text(admission_ticket_number)
                        phonenumber(item[0], admission_ticket_number)
                    }
                })
            }

            function phonenumber(realname, idcard) {
                // 查询手机号
                $.ajax({
                    async: false,
                    type: "post",
                    url: '/teach/customer/passwordNext',
                    data: {
                        'realname': realname,
                        'idCard': idcard,
                    },
                    success: function (html) {
                        let p = $(html).find("td:contains('手机号')").parent().find("input").val()
                        table.find("tr").eq(index + 1).find("td").eq(3).text(p)
                    }
                })
            }
        })
    })
}

function get_phonenumber(realname, idcard) {
    // 查询手机号
    let phone = ""
    $.ajax({
        async: false,
        type: "post",
        url: '/teach/customer/passwordNext',
        data: {
            'realname': realname,
            'idCard': idcard,
        },
        success: function (html) {
            phone = $(html).find("td:contains('手机号')").parent().find("input").val()
        }
    })
    return phone
}

function self_error_kaoqu() {
    $('header').append("<meta http-equiv=\"Content-Security-Policy\" content=\"upgrade-insecure-requests\" />")
    let body = $('body')
    body.empty()
    body.append(
        // "<meta http-equiv=\"Content-Security-Policy\" content=\"upgrade-insecure-requests\" />" +
        "<link type=\"text/css\" rel=\"stylesheet\" href=\"/teach/css/csslxh/lxh.css\">" +
        "<table align=\"center\" class=\"tableGray\" cellpadding=\"0\" cellspacing=\"1\" style=\"margin-top:5px;\">" +
        "<tbody><tr>" +
        "<td class=\"tableGrayHr\" style=\"color:#000000\">考生姓名</td>" +
        "<td class=\"tableGrayHr\" style=\"color:#000000\">证件号码</td>" +
        "<td class=\"tableGrayHr\" style=\"color:#000000\">考区</td>" +
        "<td class=\"tableGrayHr\" style=\"color:#000000\">面试科目</td>" +
        "<td class=\"tableGrayHr\" style=\"color:#000000\">注册时间</td>" +
        "<td width=\"120px\" class=\"tableGrayHr\" style=\"color:#000000\">报名时间</td>" +
        "<td width=\"120px\" class=\"tableGrayHr\" style=\"color:#000000\">手机号</td>" +
        // "<td width=\"120px\" class=\"tableGrayHr\" style=\"color:#000000\">取消审核时间</td>" +
        // "<td width=\"120px\" class=\"tableGrayHr\" style=\"color:#000000\">取消人员</td>" +
        "<td width=\"100px\" align=\"center\" class=\"tableGrayHr\" style=\"color:#000000\">操作</td> " +
        "</tr></tbody></table>" +
        "<button id='del'>导出考区报错清单</button>" +
        ""
    )
    let nametj = ["D", "日语", "俄语"]
    nametj.forEach(value => {
        $.get("/teach/interviewee/list?offset=0&max=99999&nametj=" + value + "&search=ivCourse.courseName",
            function (html) {
                let trs = $(html).filter('table.tableGray').find('tr:gt(0)')
                trs.each(function (i, v) {
                    let kaoqu = $(v).find('td:eq(2)').text()
                    console.log(kaoqu)
                    if (kaoqu != "浙工大") {
                        let realname = $(v).find('td:eq(0)').text()
                        let idcard = $(v).find('td:eq(1)').text()
                        let phone
                        // phone = get_phonenumber(realname, idcard)
                        $(this).find('td:eq(6)').text(phone)
                        $(this).find('td:eq(8)').append(
                            "<a href='/teach/interviewee/threeCheckDo?idCardNo=" + idcard + "' target='_blank'>[审核]</a>")
                        $(this).find('td:eq(7)').remove()
                        console.log(realname, idcard, phone)
                        // trs[i].prepend("<td>XX</td>")
                    } else {
                        $(this).empty()
                    }
                })
                body.find('tbody').append(trs)
            })
    })
    $("#del").click(function () {
        let data = []
        let idcards = []
        $('table:eq(0)').find('tr').each(function () {
            let row = []
            $(this).find('td').each(function () {
                row.push($(this).text())
            })
            data.push(row)
            idcards.push(row[1])
        })
        export_to_excel(data, "考区选择错误考生清单.xlsx")
    })

}

//教师资格服务器，未审核3中，系统会返回http开头的302重定向，包含了考生id、验证码，chrome浏览器因安全问题，拒绝重定向，因此无法获取进一步信息
function sheneh3() {
    $.ajax({
        type: 'get',
        url: "/teach/interviewee/threeCheckDo?idCardNo=330281199508141725",
        complete: function (h) {
            console.log(h)
        }
    })
}

function interviewArrangeQuery() {
    $("body").append("<table class='table table-striped' id='kaodian'><tr><td>考点代码</td><td>考点名称</td><td>考点id</td>" +
        "<td>面试人数</td><td>下载编排数据</td></tr></table>")
    get_kaodian_info_2(function (kaodian_info) {
        let kaodian_code = kaodian_info.kaodian_code
        let kaodian_name = kaodian_info.kaodian_name
        let kaodian_id = kaodian_info.kaodian_id
        $.get("/teach/interviewArrange/arrangeQueryResult?offset=0&max=9999&sceneId=000&orginfo.id=" + kaodian_id,
            function (html) {
                let data_trs = $(html).filter("table.tableGray").find("tr")
                let len = $(data_trs).length - 1
                if (len >= 1) {
                    let data = []
                    data_trs.each(function (i, tr) {
                        let r = []
                        $(tr).find("td").each(function (index, td) {
                            r.push($(td).text().trim())
                        })
                        data.push(r)
                    })
                    // console.log(data)
                    $("#kaodian").append("<tr><td>" + kaodian_code + "</td><td>" + kaodian_name + "</td><td>" + kaodian_id + "</td>" +
                        "<td>" + len + "</td><td><button id='down_" + kaodian_id + "'>下载</button></td></tr>")
                    $("#down_" + kaodian_id).click(function () {
                        export_to_excel(data, kaodian_code + kaodian_name + "-01考生数据.xls")
                    })
                }

            })

    })
}

// 面试编排单个考生
async function interviewArrange_disZxsTiaoIv() {
    $("form").after(`<hr/>
<table><tr><td valign="top">
        <div id='kaodian_list'>
        <h3><a href="/teach/interviewArrange/disZxsTiaoIv" target="_blank">在新窗口打开本页</a></h3>
        <h3>考点列表</h3></div>
        </td><td valign="top">
        <h3>说明</h3>
        1.按“姓名 证件号 时间段号 考点名称”顺序在excel中先做好分配计划<br/>
        　时间段号为“1,2,3,4"，对应四个半天，第一个半天为1<br/>
        　考点名称参考左侧考点列表，考点名称必须准确<br/>
        2.将excel中的分配计划全选，复制粘贴到下方输入框<br/>
        　注意：先删除框中的样例，excel复制的内容为纯数据，不要包含表头<br/>
        3.按下“开始分配”，等待执行完成，期间不要刷新或关闭页面<br/>
        4.执行过程中可查看执行结果，已标记是否成功及错误原因。完成后可按“导出结果”导出执行结果<br/>
        5.如有错误的，可更正后再次分配，可只分配有错误的<br/>
        6.如需调整已有分配，可直接再次分配，会覆盖，无需清除原有分配<br/>
        7.如需清除所有分配数据，在“面试编排管理-清除编排”中附加了清除所有考点的功能，谨慎使用！
        <hr/>
        <h3>输入</h3>
        <p>姓名\t证件号\t时间段号\t考点名称</p>
        <textarea id='stu_list' cols="70" rows="15">张三\t33020319961014123X\t2\t考点名称XX学校</textarea>
        <div><button id="btn">开始分配</button></div>
        <br/>
        <h3>结果</h3>
        <p>共 <span id="total_n">0</span>条，执行 <span id="do_n">0</span>条，
        成功<span id="success_n">0</span>，失败<span id="error_n">0</span></p>
        <button id="exp">导出结果</button>
        <table id="res_list"></table>
        </td></tr></table>
        `)
    // 获取考点信息
    let kaodian_map = []
    get_kaodian_info_2(function (kaodian_data) {
        //kaodian_data = {kaodian_id: kaodian_id, kaodian_name: kaodian_name, kaodian_code: kaodian_code}
        kaodian_map[kaodian_data.kaodian_name] = kaodian_data.kaodian_id
        $("#kaodian_list").append(kaodian_data.kaodian_name + "<br/>")
    }, false)
    // console.log(kaodian_map)

    // 获取时间段信息
    let time_map = await get_time_map_ms()
    console.log("time_map", time_map)


    // 分配按钮
    $("#btn").click(function () {
        $("#success_n").text("0")
        $("#error_n").text("0")
        $("#res_list").empty()
        let text_content = $("#stu_list").val().trim()
        let rows = text_content.split('\n')
        $("#total_n").text(rows.length)
        for (let i = 0; i < rows.length; i++) {
            let stu = rows[i].trim().replace(" ", "\t").split("\t", 4)
            let realname = stu[0]
            let idcard = stu[1]
            let timeid = stu[2]
            let kaodianid = kaodian_map[stu[3]]
            $("#res_list").append(`<tr id="r` + i + `">
<td>` + (i + 1).toString() + `</td>
<td name="realname">` + realname + `</td>
<td name="idcard">` + idcard + `</td>
<td name="timeid">` + timeid + `</td>
<td name="kaodianid">` + stu[3] + `</td>
<td name="memid"></td>
<td name="res"></td>
<td name="msg"></td>
</tr>`)
            setTimeout(function () {
                console.log(stu)
                fenpei(i, realname, idcard, timeid, kaodianid)
            }, 300 * i)
        }
    })
    // 导出按钮
    $("#exp").click(function () {
        let table1 = document.querySelector("#res_list")
        export_to_excel_table(table1, "分配结果.xlsx")
    })

    // 分配动作
    function fenpei(i, realname, idcard, timeid, kaodianid) {
        let msg = ""
        $("#do_n").text(i + 1)
        $.ajax({
            tpye: "post",
            url: "/teach/interviewArrange/disZxsTiaoIvDo",
            data: {
                "realname": realname,
                "idCard": idcard,
            },
            success: function (html) {
                // 第一步，查找考生，获取memid
                // console.log(html)
                let memid = $(html).find("[name='memId']").val()
                if (memid === undefined) {
                    msg += "未找到考生，"
                }
                $("#r" + i.toString()).find("[name='memid']").text(memid)
                // console.log(memid, timeid, kaodianid)

                let sceneId = time_map[timeid * 1 - 1]
                if (sceneId === undefined) {
                    msg += "时间段错误，"
                }
                if (kaodianid === undefined) {
                    msg += "考点名称错误，"
                }
                // 提交,返回302重定向，只管提交就是
                $.ajax({
                    type: "post",
                    url: '/teach/interviewArrange/zxsTiaoIvDo2',
                    data: {
                        'memId': memid * 1,
                        'spotId': kaodianid * 1,
                        'sceneId': sceneId,
                    },
                    error: function (e) {
                        console.log("err", e["readyState"])
                        if (e["readyState"] == 0) {
                            let success_n = $("#success_n").text() * 1 + 1
                            $("#success_n").text(success_n)
                            $("#r" + i.toString()).find("[name='res']").text("成功")
                        } else {
                            let error_n = $("#error_n").text() * 1 + 1
                            $("#error_n").text(error_n)
                            $("#r" + i.toString()).find("[name='res']").text("失败")
                            if (msg === "") {
                                msg += "国网服务器错误，"
                            }
                        }
                    }
                })

                $("#r" + i.toString()).find("[name='msg']").text(msg)
            }
        })

    }
}

// 清除面试编排
function interviewArrange_clearArrange() {
    $("form").after(`<button id="clear">清除所有考点分配</button>`)
    $("#clear").click(function () {
        if (confirm("【清除数据！】将删除所有考点分配信息！") == true) {
            get_kaodian_info_2(function (kaodian_data) {
                //kaodian_data = {kaodian_id: kaodian_id, kaodian_name: kaodian_name, kaodian_code: kaodian_code}
                $.ajax({
                    url: "/teach/interviewArrange/clearArrange",
                    type: "post",
                    data: {
                        'orginfo.id': kaodian_data['kaodian_id'],
                        'sceneId': '000',
                        'courseId': '000',
                    }
                })
            })
        }

    })
}