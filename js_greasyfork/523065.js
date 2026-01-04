// ==UserScript==
// @name         全国计算机考务系统辅助
// @namespace    http://nbeea.com/
// @version      0.1
// @description  全国计算机考务系统辅助工具
// @author       qqhugo
// @license      MIT
//               https://cdn.bootcdn.net/ajax/libs/xlsx/0.16.6/xlsx.full.min.js
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
// @match        https://ncre-kw.neea.cn/*
// @match        https://ncre-kw.neea.edu.cn/*
// @match        https://passport.neea.cn/NCRELogin?ReturnUrl=https://ncre-kw.neea.cn/Home/VerifyPassport/?LoginType=1|33&Safe=1
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/523065/%E5%85%A8%E5%9B%BD%E8%AE%A1%E7%AE%97%E6%9C%BA%E8%80%83%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/523065/%E5%85%A8%E5%9B%BD%E8%AE%A1%E7%AE%97%E6%9C%BA%E8%80%83%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    // 在任何页面启用，隔5分钟访问下首页，保持登陆状态
    setInterval(function () {
        $.get('/WelcomeManage/Index', function (html) {
            // console.log(html)
            // console.log(new Date())
        })
        console.log("访问/WelcomeManage/Index，保持登录状态")
    }, 1000 * 60 * 5)
})();


// //将数组out导出为excel文件
// function export_to_excel() {
//     let wb = XLSX.utils.book_new();
//     let sheet = XLSX.utils.aoa_to_sheet(out);
//     XLSX.utils.book_append_sheet(wb, sheet, "Table")
//     XLSX.writeFile(wb, RegOrgCode + "_考生报名数据.xlsx");
// }
// 公共函数部分
// 将数组out导出为excel文件
function export_to_excel(arr, filename) {
    let wb = XLSX.utils.book_new();
    let sheet = XLSX.utils.aoa_to_sheet(arr);
    XLSX.utils.book_append_sheet(wb, sheet, "Table")
    XLSX.writeFile(wb, filename);
}

// 公共函数部分结束

//登陆页面验证码放大
if (location.hostname === "passport.neea.cn" || location.hostname === "passport.neea.edu.cn") {
    $("#imgCheckImage").css({"height": 60, "width": 150})
    $("#chkForce").click()
}


//考务系统各页面附加功能
$(document).ready(function () {
    //指定页面执行指定函数模式
    console.log(location.pathname)
    //定义对象，不同的location.pathname，指定相应的do_script函数
    let page_action = {
        // 首页自动跳转浙江
        "/Index": {
            "do_script": Index,
        },
        // 给左侧菜单添加直接链接
        "/WelcomeManage/Index": {
            "do_script": WelcomeManage_Index,
        },
        // 考生管理
        "/CANDIDATEMANAGE/Index": {
            "do_script": CANDIDATEMANAGE_Index,
        },
        //统计页面
        "/COMMONSTATMANAGE/Index": {
            "do_script": COMMONSTATMANAGE_Index,
        },
        //成绩信息管理
        "/SCOREMANAGE/Index": {
            "do_script": SCOREMANAGE_Index,
        },

    }
    //如果访问页面的pathname在page_action中已定义，则执行对应的功能函数
    if (page_action.hasOwnProperty(location.pathname)) {
        page_action[location.pathname].do_script()
    }

});

function Index() {
    // console.log(location)
    window.location.replace('https://passport.neea.edu.cn/NCRELogin?ReturnUrl=https://ncre-kw.neea.edu.cn/Home/VerifyPassport/?LoginType=1|33&Safe=1')
}

// 给左侧菜单添加直接链接
function WelcomeManage_Index() {
    // 给顶端添加文档链接
    $(".nav.navbar-nav.pull-right").prepend("<li><a href='https://shimo.im/docs/cKQpYW3RcWKWwXVX/' target='_blank'>📘操作要点</a></li>")
    $(".nav.navbar-nav.pull-right").prepend("<li><a href='https://shimo.im/docs/Ee32MVDo4bFlldA2/' target='_blank'>🔥常见问题</a></li>")

    // 左侧菜单添加单独页面打开的链接
    $(".page-sidebar-menu a.ajaxify").each(function () {
        $(this).attr("href", $(this).attr("url"));
    });

    // 给左侧菜单添加图标
    let addicon = [
        ["aTestCenterTimeManage", "fa-cogs"],//考点操作时间设置
        ["aTestCenterGeneralRegisterManage", "fa-cogs"],//考点报名综合设置
        ["aTestCenterTestSubjectManage", ""],//考点开考科目设置
        ["aTestCenterCapacityManage", "fa-check-circle-o"],//考点容量设置
        ["aTestCenterOnlineRegisterManage", "fa-cogs"],//考生报名时间设置
        ["aTestCenterRegisterNoticeManage", "fa-check-circle-o"],//考点报名通告设置
        // ["aStudentEnrollmentSettingManage", "fa-check-circle-o"],//学籍报考设置
        ["aTestCenterArrangeManage", "fa-cogs"],//考点账号编排设置
        ["aCandidateManage", "fa-share-square"],//考生管理
        ["aCommonStatManage", "fa-share-square"],//通用统计
    ]
    addicon.forEach(function (i) {
        $("#" + i[0]).find("i").attr('class', "fa fa-star")//加黄星号
        $("#" + i[0]).find("i").attr('style', "color:orange")//加黄星号
        $("#" + i[0]).append("<i class='fa " + i[1] + "' style=\"color:red\"></i>")//加图标
    })
    $(".page-sidebar-menu").append("<li><a href='http://www.thinkcmf.cn/font_awesome.html' target='_blank'>" +
        "<i class=\"fa fa-flag\"></i><span> 图标</span></a></li>")
}

//考生管理
function CANDIDATEMANAGE_Index1() {
    let RegOrgCode = ""
    let a = []
    let out = []
    let total = 0

    // 获取通行证相关信息,item：1行考生信息提取出的数据对象，处理后在item中添加通行证相关字段数据
    function get_txz(item) {
        $.ajax({
            async: false,
            mysetting: "get_txz",
            type: "GET",
            url: "/CandidateManage/DetailsIDENT",
            data: {
                "TestCenterCode": item.TestCenterCode,
                "sid": item.SID,
            },
            success: function (html) {
                let txz_values = $(html).find(".form-body td[align='left']")
                item.txz_id = $.trim($(txz_values[2]).text())
                item.txz_name = $.trim($(txz_values[3]).text())
                item.txz_email = $.trim($(txz_values[4]).text())
                item.txz_phone = $.trim($(txz_values[5]).text())
                // console.log("f(get_txz).txz_id", item.txz_id)
                a.push(item)
            },

        })
    }

    //从考生列表中提取数据，RegOrgCode考点代码，page页码数, rows每页行数
    function get_data(RegOrgCode, page, rows) {
        // console.log(arguments[3])
        //处理后的数据会存放在responseJSON["rows"]中
        $.ajax({
            async: false,
            mysetting: "get_data",
            type: "POST",
            url: "/CandidateManage/GetCandidate",
            data: {
                "RegOrgCode": RegOrgCode, "page": page, "rows": rows,
                "OrderByField": "modifytime", "OrderByType": "asc",
            },
            success: function (result) {
                //对查询考生信息的返回数据进行处理
                //需1.去除html标签,2.提取通行证相关数据
                let myrows = result.rows
                myrows.forEach(function (item) {
                    //去除html标签
                    for (let key in item) {
                        if (item.hasOwnProperty(key)) {
                            if (item[key]) {
                                item[key] = item[key].toString().replace(/(<([^>]+)>)/ig, "")
                            }

                        }
                    }
                    //调用“获取通行证相关信息”的函数
                    get_txz(item)
                })
            }
        })
    }

    //获取总行数
    function get_total(RegOrgCode) {
        $.ajax({
            mysetting: "get_total",
            type: "POST",
            url: "/CandidateManage/GetCandidate",
            data: {
                "RegOrgCode": RegOrgCode, "page": 1, "rows": 1,
            },
            success: function (result) {
                total = result.total
            }
        })
    }


    //UI操作，添加按钮
    $("body").prepend(
        // "<div id='ttt' class=\"btn btn-default\">测试<span></span></div>" +
        "<div id='export' class=\"btn btn-default\">导出 <span></span></div>"
    )
    $("#export").click(function () {
        // RegOrgCode考点代码
        RegOrgCode = $("#searchRegOrgCode").val()
        // 获取总行数
        get_total(RegOrgCode)
        let finished = 0
        $(document).ajaxComplete(function (event, request, settings) {
            console.log(event, request, settings)
            switch (settings.mysetting) {
                case "get_total":
                    //总行数，在这里获取IDE会提示“未解析的变量responseJSON”，改放到get_total函数本身中
                    // total = request.responseJSON["total"];
                    console.log(total)
                    //每页行数
                    let rows = 200;
                    //遍历所有页，执行读取考生数据的ajax函数gat_data，数据处理在case "get_data"分支处理
                    for (let i = 1; i <= Math.round(total / rows) + 1; i++) {
                        get_data(RegOrgCode, i, rows)
                    }
                    break;
                case "get_data":
                    // console.log("ajaxcomplete", request.responseJSON["rows"])
                    break;
                case "get_txz":
                    // console.log(event, request, settings)
                    finished++
                    $("#export").find("span").text(finished + "/" + total)
                    if (finished === total) {
                        console.log("====")
                        a.forEach(function (item) {
                            let row = Object.keys(item).map(function (key) {
                                return item[key]
                            });
                            out.push(row)
                        })
                        export_to_excel(out, RegOrgCode + "_考生报名数据.xlsx")
                    }
                    break;
                case "test":
                    break
            }
        });
    })


}

function CANDIDATEMANAGE_Index() {
    // “报名机构”名称
    let searchRegOrgFullName = ""
    let a = []
    //考生数据字段列表
    let key_map = {
        "SID": "考生编号",
        "ProvinceCode": "省份代码",
        "CRegType": "报名方式代码",
        "CRegTypeHtml": "报名方式",
        "CandidatePayState": "支付状态代码",
        "CandidatePayStateHtml": "支付状态",
        "CRegLock": "报名信息锁定代码",
        "CRegLockHtml": "报名信息锁定",
        "AuditState": "审核状态",
        "AuditStateString": "审核状态",
        "AuditStateHtml": "审核状态",
        "Name": "姓名",
        "GenderHtml": "性别",
        "DobString": "出生日期",
        "IDTypeString": "证件类型",
        "IDNumber": "证件号码",
        "PhotoFlag": "照片标识",
        "TestCenterCode": "考点代码",
        "TestCenterFullName": "考点全称",
        "SubjectCount": "科目数量",
        "SubjectCodesString": "科目代码",
        "SubjectFullNamesString": "科目全称",
        "NationString": "民族",
        "OccupString": "职业",
        "EduLevelString": "学历层次",
        "TrainModeString": "培训类型",
        "TrainModeHtml": "培训类型",
        "PostCode": "邮政编码",
        "Address": "地址",
        "Email": "电子邮箱",
        "College": "院校",
        "Major": "专业",
        "Class": "班级",
        "AdditInfo": "额外信息",
        "Memo": "备注信息",
        "RegCode": "报名流水号",
        "RegNumber": "报名号",
        "CreateTimeString": "报名时间",
        "ModifyTimeString": "修改时间",
        "TestTicketPrintTimeString": "准考证打印时间",
        "IntentionTestDatesString": "意向考试日期",
        "CertificateApplyTypesString": "证书申请类型",
        "CertificateApplyTypesHtml": "证书申请类型",
        "PassportSID": "考生通行证ID",
        // "txz_name": "考生通行证姓名",
        // "txz_email": "考生通行证邮箱",
        // "txz_phone": "考生通行证手机号",
    };
    //标题行
    let title_arr = []
    for (let i in key_map) {
        title_arr.push(key_map[i]);
    }
    let out = [title_arr]//标题行放到输出数组首行
    let txzjs = 0

    //添加“导出”按钮
    $("body div:first div:first").prepend(
        "<div></div>" +
        "<div id='export' class='btn blue btn-sm'>导出为Excel<span id='jingdu'></span></div>")
    //按钮事件
    $("#export").click(function () {
        updateProgress(0); // 初始化进度条为0%
        a = []
        out = [title_arr]
        $("#jingdu").text(" (请等待...)")
        //从页面中获取当前选择的“报名机构”代码
        let searchRegOrgCode = $("#searchRegOrgCode").val()
        console.log(searchRegOrgCode)
        //从页面中获取当前选择的“报名机构”名称，导出excel文件名用
        searchRegOrgFullName = $("#searchRegOrgFullName").attr("title")
        console.log(searchRegOrgFullName)

        // 用于更新进度条显示的函数
        function updateProgress(progress) {
            $('#progressBar').css('width', progress + '%').html(progress + '%');
        }

        // 获取通行证相关信息,item：1行考生信息提取出的数据对象，处理后在item中添加通行证相关字段数据
        function get_txz(item) {

            let r = []
            $.ajax({
                async: false,
                type: "GET",
                url: "/CandidateManage/DetailsIDENT",
                data: {
                    "TestCenterCode": item.TestCenterCode,
                    "sid": item.SID,
                },
                success: function (html) {
                    let txz_values = $(html).find(".form-body td[align='left']")
                    item.txz_id = $.trim($(txz_values[2]).text())
                    item.txz_name = $.trim($(txz_values[3]).text())
                    item.txz_email = $.trim($(txz_values[4]).text())
                    item.txz_phone = $.trim($(txz_values[5]).text())
                    console.log("f(get_txz).txz_id", item.txz_id, item.txz_name, item.txz_email, item.txz_phone)
                    // a.push(item)
                    r = [item.txz_name, item.txz_email, item.txz_phone]
                },

            })
            return r
        }

        //递归函数，分页获取所有考生数据，所有数据获取后执行导出动作
        function dg(total, page) {
            let rows = 200;
            if (page <= Math.round(total / rows) + 1) {
                $.ajax({
                        // async: false,
                        type: "POST",
                        url: "/CandidateManage/GetCandidate",
                        data: {"RegOrgCode": searchRegOrgCode, "page": page, "rows": rows},
                        success: function (result) {
                            a = a.concat(result.rows)
                            total = result.total
                            $("#jingdu").text(" (" + a.length + "/" + total + ")")
                            // console.log(a)
                            dg(total, page + 1)
                        }
                    },
                )
            } else {
                //获取到所有行数据时执行
                a.forEach(function (item) {
                    let row = Object.keys(item).map(function (key) {
                        let txt = item[key]
                        if (txt) {
                            txt = txt.toString().replace(/(<([^>]+)>)/ig, "")
                        }
                        return txt
                    });
                    // 获取通行证信息
                    // let txz_info = get_txz(item)
                    // row = row.concat(txz_info)
                    console.log(row)
                    out.push(row)
                })
                //执行导出到excel的过程
                export_to_excel(out, searchRegOrgFullName + "_考生报名数据导出.xlsx");
                $("#export").after(
                    "<div id='save_btn' class='btn blue btn-sm'>下载Excel文件</div>");
                $("#save_btn").click(function () {
                    export_to_excel(out, searchRegOrgFullName + "_考生报名数据导出.xlsx");
                })
            }
        }

        //执行递归函数
        dg(100, 1)
    });
}

//统计页面
function COMMONSTATMANAGE_Index() {
    //通用统计页面，添加按钮，按下按钮后自动填充
    $("#divReport .portlet-body>div:eq(1)").prepend(""
        + "<button id='mybtn1' class='btn blue btn-sm'>试场安排表（按科目）</button>"
    );
    $("#mybtn1").click(function () {
        $("#statColumn").val("考点代码;考点名称;考场批次编号;考场代码;考场批次开始时间;考场批次结束时间;科目代码;科目名称");
        $("#StatIndicator").val("编排科目数");
        $("button:contains('查询')").click();
        $("#divReport .portlet-body>div:eq(1)").append(""
            + "<button id='btnout1' class='btn blue btn-sm'>导出试场安排表（按科目）</button>"
        );
        $("#btnout1").click(function () {
            myToExcel();
        });

        function myToExcel() {
            var sectionType = $('#hidCollegeMajorStatType').val();
            $.ajax({
                type: "post",
                url: './GetExportExcel',
                data: {
                    statColumn: $("#statColumn").val(),
                    StatIndicator: $("#StatIndicator").val(),
                    statCondition: $("#statCondition").val(),
                    statProvinceCodeLibrary: $("#statProvinceCodeLibrary").val(),
                    chkColumnSummation: $("#chkColumnSummation").is(':checked') ? 1 : 0,
                    chkRowSummation: $("#chkRowSummation").is(':checked') ? 1 : 0,
                    chkRowGroupSummation: $("#chkRowGroupSummation").is(':checked') ? 1 : 0
                },
                success: function (data) {
                    switch (data.ExceuteResultType) {
                        case -1:
                            $.messager.alert('提示', '错误：' + data.Message, 'error');
                            break;
                        case 0:
                            $.messager.alert('提示', '执行无结果！', 'error');
                            break;
                        case 1:
                            var iframe = document.createElement("iframe");
                            iframe.src = "GetFile?guid=" + data.Message;
                            iframe.style.display = "none";
                            document.body.appendChild(iframe);
                            break;
                    }
                },
                error: function (data) {
                    $.messager.alert('提示', '下载失败，错误信息：' + data.responseJSON.Message, 'error');
                }
            });
        }
    });

}

// 成绩信息管理
function SCOREMANAGE_Index() {
    let wb
    let sheet
    // “报名机构”名称
    let searchRegOrgFullName = ""
    let a = []
    //考生数据字段列表
    let key_map = {
        TestID: "考次号",
        NcreCode: "考点代码",
        OrgName: "考点名称",
        TestTicket: "准考证号",
        Name: "姓名",
        GenderString: "性别",
        // NationString: "民族",
        // IDTypeString: "证件类型",
        IDNumber: "证件号",
        SubjectName: "科目",
        RankingCode: "等第代码",
        RankingCodeString: "等第",
        CertificateNumber: "证书号",
        CertificateApplyType: "证书类型代码",
        CertificateApplyTypeString: "证书类型",
        CertificateEMS: "邮递方式代码",
        CertificateEMSString: "邮递方式",

    }

    let key_map_kaodian = {
        // TestID: "考次号",
        // NcreCode: "考点代码",
        // OrgName: "考点名称",
        TestTicket: "准考证号",
        Name: "姓名",
        // GenderString: "性别",
        // NationString: "民族",
        // IDTypeString: "证件类型",
        IDNumber: "证件号",
        // RankingCode: "等第代码",
        // RankingCodeString: "等第",
        CertificateNumber: "证书号",
        // CertificateApplyType: "证书类型代码",
        // CertificateApplyTypeString: "证书类型",
        // CertificateEMS: "邮递方式代码",
        // CertificateEMSString: "邮递方式",

    }
    //标题行
    let title_arr = []
    for (let i in key_map) {
        title_arr.push(key_map[i]);
    }
    let out = [title_arr]//标题行放到输出数组首行

    //添加“导出”按钮
    $("body div:first div:first").prepend(
        "<div id='export' class='btn blue btn-sm'>导出为Excel<span id='jingdu'></span></div>"
    )
    //按钮事件
    $("#export").click(function () {
        a = []
        out = [title_arr]
        out_kaodian = []
        $("#jingdu").text(" (请等待...)")
        //从页面中获取当前选择的“机构”代码
        let OrgCode = $("#searchOrgCode").val()
        console.log(OrgCode)
        // OrgCode = "3302330093"
        //从页面中获取当前选择的“报名机构”名称，导出excel文件名用
        searchRegOrgFullName = $("#searchOrg").val()
        // searchRegOrgFullName = "导出文件名"
        console.log(searchRegOrgFullName)

        //递归函数，分页获取所有考生数据，所有数据获取后执行导出动作
        function dg(total, page) {
            let rows = 200;
            if (page <= Math.round(total / rows) + 1) {
                $.post(
                    "https://ncre-kw.neea.edu.cn/SCOREMANAGE/GetScoreInfoList",
                    {
                        "OrgCode": OrgCode,
                        "Name": "",
                        "IDNumber": "",
                        "TestTicket": "",
                        "SubjectCodeList": "",
                        "IsCertificateEMS": "",
                        "IsHaveCertificateNumber": "",
                        "CertificateNumber": "",
                        "RankingCodeList": "",
                        "CertificateApplyType": "",
                        "page": page,
                        "rows": rows,
                    },
                    function (result) {
                        a = a.concat(result.rows)
                        total = result.total
                        $("#jingdu").text(" (" + a.length + "/" + total + ")")
                        // console.log(a)
                        dg(total, page + 1)
                    }
                )
            } else {
                //获取到所有行数据时执行
                console.log(a)
                a.forEach(function (item) {
                    // 用map函数处理每行数据
                    // let row = Object.keys(item).map(function (key) {
                    //     console.log("aaaa", key)
                    //     let txt = item[key]
                    //     // 在“考生数据字段列表”中的，处理后返回，不要的字段返回null
                    //     if (key_map.hasOwnProperty(key) && txt) {
                    //         txt = txt.toString().replace(/(<([^>]+)>)/ig, "") //去除html标签
                    //     } else {
                    //         txt = null
                    //     }
                    //     return txt
                    // });

                    // 遍历key_map字典，按key_map取出有用的字段
                    let row_t = []
                    Object.entries(key_map).forEach(function ([key, value]) {
                        row_t.push(item[key].toString().replace(/(<([^>]+)>)/ig, ""))
                    })
                    // 用item.Subject.FullName的值，即包含科目代码的科目名称替换，index为7的科目名称（不含科目代码）
                    row_t[7] = item['Subject']['FullName']
                    out.push(row_t)


                    let row_kaodian = []
                    Object.entries(key_map_kaodian).forEach(function ([key, value]) {
                        row_kaodian.push(item[key].toString().replace(/(<([^>]+)>)/ig, ""))
                    })
                    // console.log(out_kaodian)
                    // out_kaodian["001"].push()

                })

                // console.log(out_kaodian)
                //执行导出到excel的过程
                const kaocihao = out[1][0]
                export_to_excel(out, kaocihao + "_NCRE_" + searchRegOrgFullName + "_成绩证书数据导出.xlsx");
                $("#export").after(
                    "<div id='save_btn' class='btn blue btn-sm'>下载Excel文件</div>");
                $("#save_btn").click(function () {
                    export_to_excel(out, kaocihao + "_NCRE_" + searchRegOrgFullName + "_成绩证书数据导出.xlsx");
                })
            }
        }

        //执行递归函数
        dg(100, 1)
    });
}