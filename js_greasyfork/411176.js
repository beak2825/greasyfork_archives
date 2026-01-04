// ==UserScript==
// @name         自考考务系统辅助
// @namespace   
// @version      0.2
// @description  浙江自考考务系统改善界面，增强功能。
// @author       qqhugo
// @match        http://zk.zjzs.net:81/*
// @exclude      http://zk.zjzs.net:81/js/My97DatePicker/My97DatePicker.htm
//               https://cdn.bootcdn.net/ajax/libs/xlsx/0.16.6/xlsx.full.min.js
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
//               https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/411176/%E8%87%AA%E8%80%83%E8%80%83%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/411176/%E8%87%AA%E8%80%83%E8%80%83%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
})();


//考务系统各页面附加功能
$(document).ready(function () {
    //显示当前网址
    console.log(location.href)
    if (location.hostname === "zk.zjzs.net") {
        console.log(location.pathname)
        all_page();
        //根据访问的页面，执行对应的功能函数
        switch (location.pathname) {
            //首页多登陆相关
            case "/Index/index.aspx":
                index_login();
                break;
            //考生信息维护
            case "/EnrollAndPay/ExamineeInfoUpdate/examineeInfoUpdate.aspx":
                examineeInfoUpdate();
                break;
            //注册快速审批
            case "/EnrollAndPay/ExamineeRegisterManage/RegisterPhotoReview.aspx":
                RegisterPhotoReview();
                break;
            //课程报名统计列表
            case "/ExaminationManage/CourseEnrollStatisticsReport/courseEnrollStatisticsReport.aspx":
                courseEnrollStatisticsReport();
                break;
            //毕业生登记表打印页
            case "/CertificateManage/FilePrintManage/filePrint.aspx":
                filePrint();
                break;
            //毕业生清单打印页
            case "/Report/Graduation/graduateList.aspx":
                filePrint();
                break;
            //毕业相关报表
            case "/Report/Graduation/graduationReportIndex.aspx":
                graduationReportIndex();
                break;
            //毕业初审课程顶替显示
            case "/CertificateManage/EducationGradReviewManage/firstReview.aspx":
                firstReview();
                break;
            case "/CertificateManage/EducationGradReviewManage/educationGradReviewList.aspx":
                educationGradReviewList();
                break;

            case "/EnrollAndPay/ExamineeRegisterManage/examineeInfoEdit.aspx":
                examineeInfoEdit_look();
                break;
            // 试场分配
            case "/ExaminationManage/ExamRoomSetManage/examRoomSelect.aspx":
                examRoomSelect();
                break;
            // 从考点移除考场
            case "/ExaminationManage/ExamSiteManage/setExamRoomList.aspx":
                setExamRoomList();
                break;
            // 考生报名管理
            case "/EnrollAndPay/ExamineeEnrollManage/examineeEnrollList.aspx":
                examineeEnrollList();
                break;
            // 毕业花名册打印
            case "/Report/Graduation/graduateRoster.aspx":
                graduateRoster();
                break;

        }
    }
});

// 公共函数部分
// 将数组out导出为excel文件
function export_to_excel(arr, filename) {
    let wb = XLSX.utils.book_new();
    let sheet = XLSX.utils.aoa_to_sheet(arr);
    XLSX.utils.book_append_sheet(wb, sheet, "Table")
    XLSX.writeFile(wb, filename);
}

// 公共函数部分结束

// 所有页面都执行的函数
function all_page() {
    $("td[background$='images/middle_di_01.jpg']").click(function () {
        $("td[background$='images/leftdi.jpg']").toggle()
    })

    // 在首页用户名位置显示当前会话sid，用于python端同账户同时登陆。
    let cookie_match = document.cookie.match("sid=([^;]*)")
    $("img[src='/images/top_01.jpg']").parent()
        .before("<td><a href='https://shimo.im/docs/N2A1MK8L89T8dZAD/' target='_blank'>操作文档</a></td>")
    if (cookie_match != null) {
        let SEManageWebaut_sid = cookie_match[1]
        console.log("SEManageWebaut_sid:", SEManageWebaut_sid)
        $("#head2_lbUserInfo").after("<br/>sid: " + SEManageWebaut_sid)
    }
    // 在任何页面启用，隔10分钟访问下首页，保持登陆状态
    setInterval(function () {
        $.get('/Index/index.aspx', function (html) {
        })
        console.log("访问/Index/index.aspx，保持登录状态")
    }, 1000 * 60 * 10)
}

// 所有页面都执行的函数结束

// 首页登陆模拟
function index_login() {

}

// 考生信息维护页
function examineeInfoUpdate() {
}

// 注册快速审批
function RegisterPhotoReview() {
    //默认选中“非限报”
    let ddlifSpecial = $("#ddlifSpecial")
    let $selected_index = ddlifSpecial.find("[selected='selected']").attr("value");
    console.log($selected_index)
    if ($selected_index === "-1") {
        ddlifSpecial.find("[value=0]").attr("selected", "selected");
    }

    //选择照片便利化
    let tab = $("#tab")
    tab.attr("width", "400px");
    // tab.find("table").each(function () {
    //     var $r = $(this).find("input");
    //     $(this).find("td:eq(3)").prepend($r);
    //     $(this).find("td:even").remove();
    // });

    tab.find("table").each(function () {
        // $(this).find("input").attr("disabled", "disabled");
        $(this).click(function () {
            let $s = $(this).find("input").attr("checked");
            $(this).find("input").attr("checked", !$s);
            let $img = $(this).find("img");
            if ($img.attr("style") == null) {
                $img.attr("style", "opacity:0.6;");
            } else {
                $img.removeAttr("style");
            }
        });
    });
}

// 该页有多重功能，通过location.search中的whatDo参数区分
// whatDo=look：新生审核；whatDo=update：毕业生基础信息更正
function examineeInfoEdit_look() {
    console.log("location.search", location.search);
    // 新生审核
    // 用于将误通过的考生设置为不通过，在“考生注册管理”-“查看”考生信息-考生信息页面底部添加按钮，点击按钮确认后设置为不通过
    // 如网址参数中含whatDo=look则执行
    if (/whatDo=look/g.test(location.search)) {
        //从网址中获取考生id
        let examineeID = location.search.match("examineeID=([^&]*)")[1]
        console.log(examineeID)
        //页面底部添加按钮
        $("tbody:last").append(
            "<tr><td colspan='4'>" +
            "<input type='button' id='setNotPass' style='color: #ff0000' value='【高危】设为审核不通过' />" +
            "</td></tr>"
        );
        //按下按钮后，需确认后执行
        $("#setNotPass").click(function () {
            if (confirm("确定设为审核不通过?")) {
                // 点击确定后操作
                // 利用“注册快速审批”页中的ajax提交接口漏洞，
                // 该漏洞只要提供考生id，可以任意设置新生的照片审核通过/不通过状态
                $.post(
                    "/EnrollAndPay/ExamineeRegisterManage/ajax_RegisterPhotoReview.aspx?whatDo=ReviewNotPass",
                    {examineeIDStr: examineeID},
                    function (result) {
                        alert(result);
                        console.log(result);
                    }
                );
            }
        })
    }

    // 毕业生基础信息更正
    if (/whatDo=update/g.test(location.search)) {
        $("#tbcontactAddress,#tbworkUnit,#tbpostcode,#tbcontactPhone,#ddloccupation,#ddleducationalHistory,#ddlpoliticalStatus,#ddlnation")
            .parent().prev("td").css({"color": "red"})
    }
}

// 课程报名统计列表
// 生成试场号、人数数据导出为excel，用于试场编排
function courseEnrollStatisticsReport() {
    $("#btnSearchCheck").after("<div class='btn-btn04' id='creatlist'>生成试场号列表</div>")
    $("#creatlist").click(function () {
        //获取表格原始数据
        //定义函数 返回课程代码	课程名称	人数
        function getData(o) {
            let tddata = []
            o.each(function () {
                tddata.push($.trim($(this).text()))
            })
            return tddata
        }

        let all = []
        let city_name = ""
        let timecode = ""
        //找到表格，每行遍历
        $(".tabOper tr").each(function () {
            let rptList_ctl01_td_cityName = $(this).find("#rptList_ctl01_td_cityName")
            if (rptList_ctl01_td_cityName.length > 0) {
                city_name = rptList_ctl01_td_cityName.text().replace(/[\r\n]/g, "").replace(/ +/g, " ")
                // console.log(city_name)
            }

            //tds匹配每行每格
            let tds = $(this).find("td")
            //一行格数大于4，表示为第一行或有小结
            if (tds.length > 4) {
                //“考试时间号”列中的内容，包含"1、2、3、4、小计"
                let tmptimecode = $.trim(tds.slice(-4, -3).text())
                //仅保留含“1~8”数字的为 考试时间号timecode
                if (/^[12345678]$/.test(tmptimecode)) {
                    timecode = tmptimecode
                }
            }
            let row3 = tds.slice(-3)
            let tddata = getData(row3)
            if (/\d{5}/.test(tddata[0])) {
                tddata.unshift(timecode)
                tddata.push(city_name)
                all.push(tddata)
            }
        })
        console.log(all)

        //生成试场号、人数数据
        let sch_list = [["考区", "考试时间", "课程代码", "课程名称", "试场号", "人数"]]
        let sch = 0
        all.forEach(function (item) {
            let all_num_of_stu = parseInt(item[3])
            let room_num_of_stu
            while (all_num_of_stu > 0) {
                if (all_num_of_stu >= 30) {
                    room_num_of_stu = 30
                } else {
                    room_num_of_stu = all_num_of_stu
                }
                all_num_of_stu -= 30

                sch += 1
                let sch_string = "0201" + ("0000" + sch).substr(-4)
                // let t = item.concat(sch_string,room_num_of_stu)
                let t = [item[4], item[0], item[1], item[2], sch_string, room_num_of_stu]
                console.log(t)
                sch_list.push(t)
            }
        })
        console.log(sch_list)
        export_to_excel(sch_list, "out.xlsx")
    })
}

//系统打印
//毕业生登记表、毕业生清单强制分页，防止批量打印跨页错位。
function filePrint() {
    //1166px:毕业生登记表打印页
    //1046px:毕业生清单打印页
    $("div[style='height: 1166px;'],div[style='height: 1046px;']").each(function () {
        $(this).before("<div style='page-break-after: always;'></div>");
    });
}

//毕业相关报表
//毕业生统计表、花名册、清单标红醒目
function graduationReportIndex() {
    $("#tab").find("tr:gt(1):lt(3)").find("td").each(function () {
        $(this).css('color', 'red')
    });
}

// 毕业生登记页面
// 为审核列表每行添加编辑信息链接，打印按钮
function educationGradReviewList() {
    $("#tab").find("tr:gt(0)").each(function () {
        //审核状态
        let $shzt = $(this).find("td:eq(9)").find("span:eq(0)").text();
        //考生毕业登记id
        let $id = $(this).find("td:eq(0)").find("input:eq(0)").attr('value');
        //打印页面url
        let $url = '/CertificateManage/FilePrintManage/filePrint.aspx?whatDo=print&educationGradApplyInfoID=' + $id
        //考生信息id
        let $examineeID = $(this).find("td:eq(0)").find("input:eq(1)").attr('value');
        //考生信息修改url
        let $info_url = '/EnrollAndPay/ExamineeRegisterManage/examineeInfoEdit.aspx?whatDo=update&examineeID=' + $examineeID
        //为准考证号添加链接到考生信息修改
        $(this).find("td:eq(4)").find('span').wrap(function () {
            return '<a title="编辑考生毕业信息" href="' + $info_url + '" target="view_window" class="btn border w120"/>';
        });
        //为“初审通过”状态的考生添加打印链接
        if ($shzt === "初审通过" || $shzt === "终审通过") {
            $(this).find("td:eq(10)").append("<a href='" + $url + "' target='view_window' class='btn border w50'>打印</a>");
        } else {
            $(this).find("td:eq(10)").append("<a class='btn border w50' ><s>打印</s></a>");
        }
    });

    //毕业待审定页面，添加按钮，预览系统默认的是否审核通过，未通过的可以提前关注
    $("#btnSearchCheck").after("<button type='button' id='showpreview' style='color:red;'>预览是否通过、检查公共课顶替错误</button>");
    $("#showpreview").click(function () {
        $("#tab").find("tr:gt(0)").each(function () {
            //考生信息InfoID
            let $InfoID = $(this).find("input[id$='hfeducationGradApplyInfoID']").val()
            let $f = $(this).find("span[id$='lbgradReviewState']")
            // console.log($InfoID)
            $.get(
                "/CertificateManage/EducationGradReviewManage/firstReview.aspx",
                {
                    "whatDo": "firstReview",
                    "educationGradApplyInfoID": $InfoID,
                },
                function (html) {
                    // 获取系统自动审核信息
                    // $ddlgradReviewState_code：待审核时，系统自动审核显示的“未通过”或“审核通过”
                    let $ddlgradReviewState_code = $(html).find("#ddlgradReviewState")
                        .find("option[selected='selected']").val()
                    if ($ddlgradReviewState_code === '402') {
                        $f.css("color", "green")
                    } else {
                        $f.css("color", "red")
                    }
                    $f.append('<span>' + $ddlgradReviewState_code + '</span>')

                    // 检查本科公共课顶替，00004/00005不能单顶03708
                    let $c03708 = $(html).find("span:contains(03708)").parent().next().next().find("span").text()
                    let $c03709 = $(html).find("span:contains(03709)").parent().next().next().find("span").text()
                    if ($c03709 === "统考" && $c03708 === "") {
                        $f.append('<span style="color: red;">公共课顶替错误！</span>')
                    }

                }
            )
        });


    });
}

//毕业初审课程顶替显示
function firstReview() {
    // 显示顶替证书课的分数
    function show_dingti() {
        // 匹配含有“查看顶替”的行
        let trs_dingti = $("[id$='lbtnReplaceDetail']").parents(".trData")
        $(trs_dingti).each(function () {
            let tr = $(this)
            let id = $(tr).find("[id$='hfeducationGradCourseDetailID']").val()
            $.get(
                "/CertificateManage/EducationGradReviewManage/replaceDetail.aspx",
                {"educationGradCourseDetailID": id},
                function (html) {
                    console.log('html',html)
                    // thetpye 顶替类型：学分，课程，证书
                    let thetpye = $(html).find("#lbreplaceType").text()
                    if (thetpye === "证书") {
                        // lbcertificateCode 证书编号
                        let lbcertificateCode = $(html).find("#lbcertificateCode").text().toString()
                        // tbreplaceScore 证书分数
                        let tbreplaceScore = $(html).find("#tbreplaceScore").val()
                        // $(tr).append(lbcertificateCode + " " + tbreplaceScore)
                        $(tr).find("[id$='lbcourseName']")
                            .append(" <span style='color:red;'>{1}</span><span style='color:darkgreen;'> ({2})</span>"
                                .replace("{1}", tbreplaceScore).replace("{2}", lbcertificateCode))
                        $(tr).find("[id$='lbtnReplaceDetail']")
                            .after(" <span style='color:red;'>{1}</span>"
                                .replace("{1}", tbreplaceScore))
                    }
                }
            )
        })
    }

    // 显示同步免考相关信息
    function show_tongbumiankao() {
        // 解析网址location，获取educationGradApplyInfoID参数
        function GetQueryString(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = window.location.search.substring(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }

        let $InfoID = GetQueryString('educationGradApplyInfoID')
        $.get("/CertificateManage/EducationGradReviewManage/addGradApply.aspx",
            {"whatDo": "update", "educationGradApplyInfoID": $InfoID,},
            function (html) {
                $(html).find("span:contains('申请中-免考')").each(function () {
                    let nnn = $(this).attr('name')
                    console.log(nnn)
                    $("span:contains('" + nnn + "')").parent()
                        .append("<span style='color:blue;'>申请中-免考</span>")
                })

            }
        )
    }

    //添加页面ui，分配动作函数
    let isshow = false
    $(".tabOper").before("<button type=\"button\" id='showdingti' style='float: right;'>" +
        "显示<span style='color:blue;'>申请中-免考</span>，" +
        "<span style='color:red;'>顶替证书分数</span>" +
        "</button>")
    $("#showdingti").click(function () {
        //如当前页面还未显示分数，则执行显示分数的函数
        if (!isshow) {
            show_dingti()
            show_tongbumiankao()
            isshow = true
        }
    })

    //自动档案代码
    let $tbfileCode = $("#tbfileCode")
    if ($tbfileCode.val() === "") {
        $tbfileCode.after("<button type='button' id='auto_add'>A</button>" +
            "<input type='text' id='start_code' style='width: 80px;'\>" +
            "<input type='text' id='added' style='width: 30px;'\>")
        auto_dangan_code_load()

        function auto_dangan_code_load() {
            let $start_code = GM_getValue("start_code")
            let $added = GM_getValue("added")
            console.log("start:", $start_code, "added:", $added)
            if (!$start_code) {
                $start_code = "02010001"
            }
            $("#start_code").val($start_code)
            if (!$added) {
                $added = 1
            }
            $("#added").val($added)
        }

        $("#auto_add").click(function () {
            auto_dangan_code()
        });

        function auto_dangan_code() {
            let $start_code = $("#start_code").val()
            let $added = $("#added").val()
            let $n = $start_code.length;
            let $num = parseInt($start_code) + parseInt($added)
            let $dangan_code = (Array($n).join(0) + $num).slice(-$n)
            $tbfileCode.val($dangan_code)
            GM_setValue("start_code", $start_code)
            GM_setValue("added", parseInt($added) + 1)
        }
    }


}

function examRoomSelect() {
    let page_txt = $("span ~:contains('页次')").text()
    let number_of_pages = /\/(.*)页/i.exec(page_txt)[1]
    // console.log(number_of_pages)
    if (number_of_pages > 1) {
        // 页数大于1，说明没有完全显示所有试场
        // 设置每页显示99999条
        $("input[name='pageControl1$ctl08']").val(99999)
        // 执行原页面上的跳转指令
        __doPostBack('pageControl1$ctl12', '')
    }
    $('body').prepend("在文本框里粘贴以回车或逗号分隔的试场号，按确定，会自动选中对应试场<textarea id='ttt'></textarea>" +
        "<a type='button' id='btn'>确定</a>")
    $("#btn").click(function () {
        let str = $("#ttt").val()
        str = str.replace(/\n/g, ",")
        console.log(str)
        let sch_list = str.split(',')
        console.log(sch_list)
        $.each(sch_list, function (index, sch) {
            console.log(sch)
            if (sch !== '') {
                let t = $("tr:contains('" + sch + "')>td>input")
                console.log(t)
                t.click()
            }

        })

    })
}

//考点试场安排中添加移除所有试场功能
function setExamRoomList() {
    $("body").prepend("<button id='removeall'>移除本页所有试场！</button><span id='rm_num'></span>")
    $("#removeall").click(function () {
        let list = []
        let a = $("input[id^=rptList]")
        $(a).each(function (i, item) {
            list.push($(item).val())
        })
        console.log(list)
        let all_num = list.length
        let rm_num = 0

        let url = location.href
        let xx = ["__VIEWSTATE", "__VIEWSTATEGENERATOR", "__EVENTVALIDATION"]
        let data = {}
        xx.forEach(function (item, index, input) {
            data[item] = $("#" + item).val()
            // console.log(item,$("#"+item).val())
        })
        data['hfCommand'] = 'del'
        data['btnCommand'] = '多功能事件'
        console.log(data)

        list.forEach(function (item, index, input) {
            data['hfValue'] = item
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function () {
                    rm_num += 1
                    $("#rm_num").text(rm_num + "/" + all_num)
                }
            })
        })
    })
}

function examineeEnrollList() {
    $("#form1 > table:nth-child(9) > tbody > tr > td:nth-child(4) > table:nth-child(4)")
        .before("<div id='export'>导出考生信息</div><div id='save'>保存</div>")
    let all_data = []
    $("#save").click(function () {
        export_to_excel(all_data, "zikao_phone.xlsx")
    })
    $("#export").click(function () {
        $("input[name='pageControl1$ctl08']").val(10)
        $.ajax({
            url: "/EnrollAndPay/ExamineeEnrollManage/examineeEnrollList.aspx",
            data: {
                __VIEWSTATE: $("#__VIEWSTATE").val(),
                __VIEWSTATEGENERATOR: $("#__VIEWSTATEGENERATOR").val(),
                __EVENTVALIDATION: $("#__EVENTVALIDATION").val(),
                tbexamNum: $("#tbexamNum").val(),
                ddlexamTimeNumID: -1,
                ddlcountyID: $("#ddlcountyID option:selected").val(),
                ddlcourseProperty: $("#ddlcourseProperty option:selected").val(),
                ddlenrollPayState: -1,
                ddlenrollType: -1,
                ddlschoolID: -1,
                btnSearch: "查询",
                pageControl1$ctl08: 9999,
                pageControl1$ctl11: 1,
            },
            type: "post",
            success: function (html) {
                $(html).find("#tab").find("tr")
                    .each(function (index, item) {
                        let row = []
                        $(item).find("span").each(function (i, v) {
                            row.push($.trim($(v).text()))
                        })
                        all_data.push(row)
                    })
                // console.log(all_data)

                $.get("/EnrollAndPay/ExamineeInfoUpdate/examineeInfoUpdate.aspx")
                    .done(function (first_html) {
                        let VIEWSTATE = $(first_html).find("#__VIEWSTATE").val()
                        let VIEWSTATEGENERATOR = $(first_html).find("#__VIEWSTATEGENERATOR").val()
                        let EVENTVALIDATION = $(first_html).find("#__EVENTVALIDATION").val()
                        let all_row_number = all_data.length
                        let n = 0
                        all_data.forEach(function (v, i, d) {
                            // d[i].push("xx")
                            console.log(v[6])
                            $.ajax({
                                async: false,
                                type: "post",
                                url: "/EnrollAndPay/ExamineeInfoUpdate/examineeInfoUpdate.aspx",
                                data: {
                                    __VIEWSTATE: VIEWSTATE,
                                    __VIEWSTATEGENERATOR: VIEWSTATEGENERATOR,
                                    __EVENTVALIDATION: EVENTVALIDATION,
                                    ddlsearchType: 0,
                                    tbCardNoForSearch: v[6],
                                    btnSearch: "查询",
                                },
                                success: function (sfz_html) {
                                    let sfz = $(sfz_html).find("#tbmobilePhone").val()
                                    console.log(sfz)
                                    d[i].push(sfz)
                                    n++
                                    if (n === all_row_number) {
                                        console.log(all_data)
                                        export_to_excel(all_data, "zikao_phone.xlsx")
                                    }
                                }
                            })
                        })
                    })
            }
        })
    })

}

function graduateRoster() {
    // 为毕业生花名册打印页设置A3尺寸，chrome另存为pdf可以为A3
    let cssPagedMedia = (function () {
        let style = document.createElement('style');
        document.head.appendChild(style);
        return function (rule) {
            style.innerHTML = rule;
        };
    }());

    cssPagedMedia.size = function (size) {
        cssPagedMedia('@page {size: ' + size + '}');
    };

    cssPagedMedia.size('A3 landscape');
}