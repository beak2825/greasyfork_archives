// ==UserScript==
// @name         全国英语考务系统辅助
// @namespace
// @version      2025.01.14.1
// @description  全国英语考务系统辅助工具
// @author       邱鸿翔
//               https://cdn.bootcdn.net/ajax/libs/xlsx/0.16.6/xlsx.full.min.js
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
// @match        https://pets-kw.neea.edu.cn/*
// @match        https://passport.neea.cn/PETSLogin?ReturnUrl=https://pets-kw.neea.edu.cn/Home/VerifyPassport/?LoginType=1
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/681760
// @downloadURL https://update.greasyfork.org/scripts/511717/%E5%85%A8%E5%9B%BD%E8%8B%B1%E8%AF%AD%E8%80%83%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/511717/%E5%85%A8%E5%9B%BD%E8%8B%B1%E8%AF%AD%E8%80%83%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

//更新
/*
//油猴菜单按钮范例
try {
    GM_registerMenuCommand('油猴菜单按钮', function () {
        console.log("单击了菜单按钮")
    });
} catch (e) {
    console.log(e)
}
// 油猴本地存储范例
a = GM_getValue("aaa")
console.log(a)
vv = {
    "t1": "aaaaa",
    "t2": "bbbbb",
}
//保存到本地，浏览器关闭任然存在
GM_setValue("aaa", vv)
*/
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
//登陆页面验证码放大
if (location.hostname === "passport.neea.cn" || location.hostname === "passport.neea.edu.cn") {
    $("#imgCheckImage").css({"height": 60, "width": 150})
    $("#chkForce").click()
}

//考务系统各页面附加功能
$(document).ready(function () {
    //显示当前网址
    // console.log(location.href)
    if (location.hostname === "pets-kw.neea.edu.cn") {
        console.log(location.pathname)
        //根据访问的页面，执行对应的功能函数
        switch (location.pathname) {
            //系统首页
            case "/WelcomeManage/Index":
                WelcomeManage_Index();
                break;
            //统计页面
            case "/COMMONSTATMANAGE/Index":
                COMMONSTATMANAGE_Index();
                break;
            //试场管理
            case "/TESTROOMMANAGE/Index":
                TESTROOMMANAGE_Index();
                break;
            //试场分配
            case "/TESTROOMALLOTMANAGE/Index":
                TESTROOMALLOTMANAGE_Index();
                break;
            //考生管理
            case "/CANDIDATEMANAGE/Index":
                CANDIDATEMANAGE_Index();
                break;
            //白名单管理
            case "/WHITELISTMANAGE/Index":
                WHITELISTMANAGE_Index();
                break;

            //导出考场编排
            case "/TESTROOMARRANGEMANAGE/Index":
                TESTROOMARRANGEMANAGE_Index();
                break;
            //签到表下载页面
            case "/TESTROOMATTENDANCEEXPORTMANAGE/Index":
                TESTROOMATTENDANCEEXPORTMANAGE_Index();
                break;
            // 准考证下载页面
            case "/TESTCENTERTESTTICKETEXPORTMANAGE/Index":
                TESTCENTERTESTTICKETEXPORTMANAGE_Index();
                break;
            // 试卷下级申报管理-导出领卷清单
            case  "/SUBORGDECLAREMANAGE/Index":
                SUBORGDECLAREMANAGE_Index();
                break;
            // 考点提示设置
            case  "/TESTCENTERWRITTENTESTTICKETNOTICEMANAGE/Index":
                TESTCENTERWRITTENTESTTICKETNOTICEMANAGE_Index();
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

function export_to_excel_table(table, filename) {
    let wb = XLSX.utils.book_new();
    let sheet = XLSX.utils.table_to_sheet(table, {raw: true});//{raw:true}原格式导出
    XLSX.utils.book_append_sheet(wb, sheet, "Table")
    XLSX.writeFile(wb, filename);
}

// 公共函数部分结束

//定义通用常量
let defaultCapacity = {
    //笔试各级别试场人数
    "0": {"1": "30", "2": "30", "3": "30", "4": "30",},
    //口试各级别试场人数
    "1": {"1": "50", "2": "40", "3": "40", "4": "30",},
}
let RoomType_map = {"笔试": "0", "口试": "1"};
let SubjectGrade_map = {"一级": "1", "二级": "2", "三级": "3", "四级": "4",};

function WelcomeManage_Index() {
    // 给顶端添加文档链接
    $(".nav.navbar-nav.pull-right").prepend("<li><a href='https://shimo.im/docs/9kg8hX8rykHphXhd/read' target='_blank'>文档</a></li>")
    // 给左侧菜单添加直接链接
    $(".page-sidebar-menu a.ajaxify").each(function () {
        $(this).attr("href", $(this).attr("url"));
    });
    // 给左侧菜单添加图标
    let addicon = [
        ["aTestCenterCapacityManage", "fa fa-cog"],//考点容量设置
        ["aCandidateManage", "fa-share-square"], //考生管理
        ["aTestRoomAllotManage", "fa-share-square"],
        ["aArrangeManage", "fa-share-square"],
        ["aTestRoomManage", "fa-plus-square"],
        ["aSubOrgDeclareManage", "fa-share-square"],
        ["aTestCenterTestTicketExportManage", "fa-download"],
        ["aTestRoomAttendanceExportManage", "fa-download"],
        ["aSubjectCapacityStatisticsManage", "fa fa-bar-chart"],//科目容量统计
        ["aCommonStatManage", "fa fa-bar-chart"],//通用统计
    ]
    addicon.forEach(function (i) {
        $("#" + i[0]).append("<i class='fa " + i[1] + "' style=\"color:red\"></i>")
    })
    $(".page-sidebar-menu").append("<li><a href='http://www.thinkcmf.cn/font_awesome.html' target='_blank'>" +
        "<i class=\"fa fa-flag\"></i><span> 图标</span></a></li>")

    function ttt() {
        console.log("ccc")
        let ddd = $.post("/OrgManage/GetPartOrgList")
        ddd.done((x) => {
            console.log(x)
        })
        ddd.progress(console.log("........."))
    }

    function t2() {
        console.log("t2 start")
        setTimeout(function () {
                return "t2t2t2"
            }, 3000
        )
    }

    ttt()
}

//统计页面
function COMMONSTATMANAGE_Index() {
    //通用统计页面，添加按钮，按下按钮后自动填充
    $("#divReport .portlet-body>div:eq(1)").prepend(""
        + "<button id='mybtn1' class='btn blue btn-sm'>报名考点报名统计</button>"
        + "<button id='mybtn2' class='btn blue btn-sm'>考试考点分配统计</button>"
        + "<button id='mybtn3' class='btn blue btn-sm'>考试考点已编排统计</button>"
        + "<button id='mybtn4' class='btn blue btn-sm'>考试考点编排检查</button>"
    );
    $("#mybtn1").click(function () {
        $("#statColumn").val("考点代码;考点名称;行转列:科目名称");
        $("#StatIndicator").val("报名科目统计");
        $("button:contains('查询')").click();
    });
    $("#mybtn2").click(function () {
        $("#statColumn").val("考试考点代码;考试考点名称;行转列:科目名称");
        $("#StatIndicator").val("报名科目统计");
        $("button:contains('查询')").click();
    });
    $("#mybtn3").click(function () {
        $("#statColumn").val("考试考点代码;考试考点名称;行转列:科目名称");
        $("#StatIndicator").val("编排科目统计");
        $("button:contains('查询')").click();
    });
    $("#mybtn4").click(function () {
        $("#statColumn").val("考试考点代码;考试考点名称;科目名称");
        $("#StatIndicator").val("报名科目统计;编排科目统计;是否全部编排");
        $("button:contains('查询')").click();
    });
}

//考场管理
function TESTROOMMANAGE_Index() {
    //添加按钮，这里不能添加button标签，会触发表单提交动作刷新页面，用div代替
    $("#form1").prepend("<div id='get_test' class='btn red btn-sm'>自动添加试场（先选择考点）</div>");
    $("#get_test").click(function () {
        //获取当前选择考点代码 #testCenterCode:试场管理页面， #searchTestCenterCode考生分配页面
        let TestCenterCode = $("#testCenterCode,#searchTestCenterCode").attr("value");
        console.log("考点代码", TestCenterCode)
        if (TestCenterCode) {//如选择了考点则进行
            //获取考点各级别报名人数、所需试场数
            let YesCount_list = get_YesCount_list(TestCenterCode);
            //获取添加试场页面的token
            let Token;
            $.ajax({
                url: "https://pets-kw.neea.edu.cn/TESTROOMMANAGE/Details?roomtype=0&testCenterCode=" + TestCenterCode,
                type: "get",
                async: false,
                success: function (data) {
                    Token = $("input[name='__RequestVerificationToken']", $(data)).attr("value");
                }
            });

            //定义批量添加试场函数
            function addRoom(currentValue) {
                let shichangshu = currentValue["shichangshu"]//试场数
                for (let num = 1; num <= shichangshu; num++) {
                    room_no++
                    let RoomType = currentValue["RoomType"]; //0笔试，1口试
                    let SubjectGrade = currentValue["SubjectGrade"]; //级别
                    let Code = ('000' + room_no).slice(-3);
                    let Address = Code + "试场 详见考点平面图";
                    $.post("https://pets-kw.neea.edu.cn/TESTROOMMANAGE/Save",
                        {
                            __RequestVerificationToken: Token,
                            TestCenterCode: TestCenterCode,
                            RoomType: RoomType,
                            SubjectGrade: SubjectGrade,
                            Code: Code,//"003",试场号
                            Address: Address,//"0014",试场地址
                            Capacity: defaultCapacity[RoomType][SubjectGrade],
                            Memo: ""
                        },
                        function (result) {
                            console.log(result);
                        });
                }
            }

            //添加笔试试场
            let room_no
            let YesCount_list_0 = YesCount_list.filter(function (myitem) {
                return myitem["RoomType"] === "0"
            })
            room_no = 0
            YesCount_list_0.forEach(addRoom)
            //添加口试试场
            let YesCount_list_1 = YesCount_list.filter(function (myitem) {
                return myitem["RoomType"] === "1"
            })
            room_no = 0
            YesCount_list_1.forEach(addRoom)
        } else {
            alert("请选择考点")
        }
    });
}

//场次与人数分配
function TESTROOMALLOTMANAGE_Index() {
    //添加按钮，这里不能添加button标签，会触发表单提交动作刷新页面，用div代替
    $("#form1").prepend("<div id='export_room_list' class='btn blue btn-sm'>导出试场数据-不含考生数（编排完成后）</div>");
    $("#export_room_list").click(function () {
        let __RequestVerificationToken = $("input[name='__RequestVerificationToken']").val()
        $.post('/OrgManage/GetPartOrgList?enable=1&orgLevel=4', function (j) {
            // console.log(j.rows)
            let list = [['考点代码', '考点名称', '考点简称', '试场号', '种类代码', '考试种类', '级别代码', '考试级别', '开始时间', '考试时间']]
            j.rows.forEach(function (v, i, c) {
                if (v["OrgLevelString"] === "考点级") {
                    console.log(v["FullName"], v["Code"])
                    for (let searchRoomType = 0; searchRoomType <= 1; searchRoomType++) {
                        $.ajax({
                            async: false,
                            type: "post",
                            url: "/TESTROOMALLOTMANAGE/GetTestRoomAllotList",
                            data: {
                                __RequestVerificationToken: __RequestVerificationToken,
                                searchTestCenterName: v["FullName"],
                                searchTestCenterCode: v["Code"],
                                searchRoomType: searchRoomType,
                                allotType: 9999,
                            },
                            success: function (json) {
                                // console.log(v["FullName"],json.rows)
                                json.rows.forEach(function (item) {
                                    // console.log(item)
                                    let time_long = $(item['Subject' + item['SubjectGrade'] + item['RoomType']])
                                        .filter("input:checked").val()
                                    let exam_room_arr = [
                                        item['PETSCode'],
                                        v["FullName"],
                                        v["Memo"],
                                        item['Code'],
                                        item['RoomType'],
                                        $(item['RoomTypeHtml']).text().substring(0, 2),
                                        item['SubjectGrade'],
                                        $(item['SubjectGradeHtml']).text(),
                                        time_long.substring(0, 16).replace(/\//g, "-"),
                                        time_long.substring(0, 16).replace(/\//g, "-") + "-" + time_long.substring(31, 36)
                                    ]
                                    // console.log(exam_room_arr)
                                    let exam_room = {
                                        PETSCode: item['PETSCode'],
                                        Code: item['Code'],
                                        RoomType: item['RoomType'],
                                        RoomTypeHtml: $(item['RoomTypeHtml']).text().substring(0, 2),
                                        SubjectGrade: item['SubjectGrade'],
                                        SubjectGradeHtml: $(item['SubjectGradeHtml']).text(),
                                        TestID: item['TestID'],
                                    }
                                    list.push(exam_room_arr)
                                })
                            }
                        })
                    }
                }
            })
            console.log(list)
            export_to_excel(list, "PETS试场导出.xlsx")
        })
    })
}


//获取考点各级别种类报考人数,searchTestCenterCode:"3302330203"
function get_YesCount_list(searchTestCenterCode) {
    //设置jquery的ajax为同步（默认为异步，会不能及时取到数据）
    let YesCount_list = [];
    $.ajax({
        url: "https://pets-kw.neea.edu.cn/TESTROOMALLOTMANAGE/GetCandidateAllotStatistics",
        type: "post",
        async: false,
        data: {searchTestCenterCode: searchTestCenterCode},
        success: function (result) {
            result["rows"].forEach(function (currentValue) {
                //种类代码
                let RoomType = RoomType_map[currentValue["SubjectName"].substr(2, 2)];
                //级别代码
                let SubjectGrade = SubjectGrade_map[currentValue["SubjectName"].substr(0, 2)];
                //报考人数
                let YesCount = currentValue["YesCount"]
                //试场数
                let shichangshu = Math.ceil(currentValue["YesCount"] / defaultCapacity[RoomType][SubjectGrade])
                YesCount_list.push({
                    RoomType: RoomType,
                    SubjectGrade: SubjectGrade,
                    YesCount: YesCount,
                    shichangshu: shichangshu
                });
            });
        }
    });
    //按笔试口试、级别排序
    YesCount_list.sort(function (a, b) {
        let order = 1//1正序-1逆序
        if (a["RoomType"] >= b["RoomType"]) {
            if (a["SubjectGrade"] >= b["SubjectGrade"]) {
                return order
            } else {
                return -order
            }
        } else {
            return -order
        }
    });
    console.log("YesCount_list", YesCount_list)
    return YesCount_list;
}

//考生管理，导出考生数据
function CANDIDATEMANAGE_Index() {
    let wb
    let sheet
    // “报名机构”名称
    let searchRegOrgFullName = ""
    let a = []
    //考生数据字段列表
    let key_map = {
        "SID": "SID",
        "CRegType": "CRegType",
        "CRegTypeHtml": "报名方式",
        "CandidatePayState": "CandidatePayState",
        "CandidatePayStateHtml": "支付状态",
        "Name": "姓名",
        "IDNumber": "证件号码",
        "ProvinceFullName": "报考省份",
        "SubjectCount": "科目数",
        "SubjectFullNamesString": "报考科目",
        "IdentityString": "身份",
        "IDTypeString": "证件类型",
        "GenderHtml": "性别",
        "BirthDateString": "出生日期",
        "PhotoFlag": "照片",
        "DomicileString": "户籍",
        "PoliticalString": "政治面貌",
        "EduLevelString": "考前学历",
        "NationString": "民族",
        "OccupationString": "职业",
        "TechnicalTitleString": "职称",
        "PostalCode": "邮编",
        "Address": "地址",
        "Phone": "移动电话",
        "Email": "电子邮箱",
        "ImportTestCenterFullName": "导入考点",
        "Memo": "导入备注",
        "TestTypeHtml": "考试种类",
        "CRegCode": "报名号",
        "RegTestCenterFullNamesString": "报名考点",
        "TestTestCenterFullNamesString": "考试考点",
        "TestTicketsString": "准考证号",
        "TestTicketCandidatePrintStateHtml": "准考证考生打印情况",
        "TestTicketPrintTimesString": "TestTicketPrintTimesString",
        "CandidatePrintedTestTicketSubjectsString": "考生已打印准考证科目",
        "CandidatePrintedTestTicketTimesString": "考生打印准考证时间",
        "CandidateNotPrintedTestTicketSubjectsString": "考生未打印准考证科目",
        "CreateTimeString": "基本信息创建时间",
        "ModifyTimeString": "基本信息修改时间",
        "SRegTypesString": "科目报考方式",
        "SRCreateTimesString": "科目报考时间",
        "SRegLockTimesString": "科目支付时间",
        "IDNumberAbnormalFlagHtml": "证件号码异常",
        "IDNumberAbnormalCreateTimeString": "证件号码异常创建时间",
        "IDNumberAbnormalCorrectTimeString": "证件号码异常修正时间",
        "PassportSID": "考生通行证ID",
    }
    //标题行
    let title_arr = []
    for (let i in key_map) {
        title_arr.push(key_map[i]);
    }
    let out = [title_arr]//标题行放到输出数组首行

    //添加“导出”按钮
    $("body div:first div:first").prepend(
        "<div id='export' class='btn blue btn-sm'>导出为Excel<span id='jingdu'></span></div>" +
        "<div id='save_jpg_btn' class='btn yellow btn-sm'>下载照片(<span id='number_of_downloaded_files'></span>)</div>")
    //按钮事件
    $("#export").click(function () {
        a = []
        out = [title_arr]
        $("#jingdu").text(" (请等待...)")
        //从页面中获取当前选择的“报名机构”代码
        let searchRegOrgCode = $("#searchRegOrgCode").val()
        //从页面中获取当前选择的“报名机构”名称，导出excel文件名用
        searchRegOrgFullName = $("#searchRegOrgFullName").attr("title")

        //递归函数，分页获取所有考生数据，所有数据获取后执行导出动作
        function dg(total, page) {
            let rows = 200;
            if (page <= Math.round(total / rows) + 1) {
                $.post(
                    "https://pets-kw.neea.edu.cn/CANDIDATEMANAGE/GetCandidate",
                    {"RegOrgCode": searchRegOrgCode, "page": page, "rows": rows},
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
                a.forEach(function (item) {
                    let row = Object.keys(item).map(function (key) {
                        let txt = item[key]
                        if (txt) {
                            txt = txt.toString().replace(/(<([^>]+)>)/ig, "")
                        }
                        return txt
                    });
                    if (row[8] === "1") {
                        row[27] = row[9].substring(row[9].length - 2)
                    } else if (row[8] === "2") {
                        row[27] = "全部"
                    }
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
                // $("#save_jpg_btn").click(function () {
                //     function downloadImage(src, filename) {
                //         let a = $("<a></a>").attr("href", src).attr("download", filename);
                //         a[0].click();
                //     }
                //
                //     out.forEach(function (item) {
                //         console.log(item)
                //         downloadImage('/Photo/Show?sid=' + item[0], item[6] + ".jpg")
                //     })
                // })
            }
        }

        //执行递归函数
        dg(100, 1)
    });
    //下载照片
    $("#save_jpg_btn").click(() => {
        let number_of_downloaded_files = 0

        function download_jpg_100(arr, index) {
            let arr_this = arr.slice(0, 100)
            let arr_next = arr.slice(100)
            let n = 0
            let zip = new JSZip();
            // zip.file("Hello.txt", "Hello World\n");
            let img = zip.folder("pets_img");
            arr_this.forEach(function (item) {
                let jpgurl = "/Photo/Show?sid=" + item[0]
                let fname = item[6] + ".jpg"
                console.log(jpgurl, fname)
                let xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", jpgurl, true);
                xmlhttp.responseType = "blob";
                xmlhttp.onload = function () {
                    // console.log(this);
                    n++
                    number_of_downloaded_files++
                    if (this.status == 200) {
                        let blob = this.response;
                        console.log(blob)
                        $("#number_of_downloaded_files").text(number_of_downloaded_files)
                        img.file(fname, blob, {binary: "true"});
                        if (n === arr_this.length) {
                            zip.generateAsync({type: "blob"})
                                .then(function (content) {
                                    saveAs(content, "pets_img_" + ('0000' + index).slice(-4) + ".zip")
                                })
                            if (arr_next.length > 0) {
                                download_jpg_100(arr_next, index + 1)
                            }
                        }
                    }
                }
                xmlhttp.send();
            })

        }

        download_jpg_100(out.slice(1), 1)


        // // 下载图片成功1
        // function downloadImage(src) {
        //     let a = $("<a></a>").attr("href", src).attr("download", "meitu.jpg");
        //     a[0].click();
        // }
        // downloadImage("/Photo/Show?sid=00B5F2A34B3E490B9946041B437880C6")

    })

}

function TESTROOMATTENDANCEEXPORTMANAGE_Index() {
    //添加“生成所有考点”按钮
    $("body").prepend(
        "<div id='shengcheng' class='btn blue btn-sm'>生成所有考点签到表<span id='jishuqi'></span></div>" +
        "<div id='shengcheng_un' class='btn blue btn-sm'>生成还未生成的签到表<span id='jishuqi'></span></div>" +
        "<div id='xiazai' class='btn blue btn-sm'>下载所有考点</div>");
    let OrgCode = $("#OrgCode").val()
    $("#shengcheng").click(function () {
        //从通用统计页面中获取有开考考点科目数据
        $.ajax({
            type: 'post',
            data: {
                statColumn: '考试考点代码;科目代码',
                StatIndicator: '编排科目统计',
                statCondition: '',
                chkColumnSummation: 0,
                chkRowSummation: 0,
                chkRowGroupSummation: 0,
            },
            url: '/CommonStatManage/GetStatData',
            success: function (json) {
                let s = (json.rows).substr(1, (json.rows).length - 2)
                console.log($.parseJSON(s))
                $.each($.parseJSON(s), function (index, row) {
                    console.log(row)
                    //TODO 目前直接生成所有考点，需过滤已经生成过的考点
                    $.ajax({
                        type: 'post',
                        data: {
                            //TODO '3302'目前写死，需要改为动态获取
                            TestCenterCode: '3302' + row.C100115,
                            SubjectCode: row.C100311,
                            ReportType: 3
                        },
                        url: '/TESTROOMATTENDANCEEXPORTMANAGE/CreateFile',
                        success: function (backjson) {
                            console.log(index, row._parentId, row.Code, backjson)
                        }
                    })
                })
            }
        })

        /*
                $.ajax({
                    type: 'post',
                    data: {
                        OrgCode: OrgCode,
                        ReportType: 3
                    },
                    url: '/TESTROOMATTENDANCEEXPORTMANAGE/GetOrgFileInfoList',
                    success: function (json) {
                        // console.log(json)
                        $.each(json.rows, function (index, row) {
                            // console.log(row)
                            if (row.OrgLevel === 0 && row.CreateFileTime != '') {
                                console.log(row.Code, row._parentId)
                                $.ajax({
                                    type:'post',
                                    data:{
                                        TestCenterCode: row._parentId,
                                        SubjectCode: row.Code,
                                        ReportType: 3
                                    },
                                    url:'/TESTROOMATTENDANCEEXPORTMANAGE/CreateFile',
                                    success:function (backjson){
                                        console.log(index,row._parentId,row.Code,backjson)
                                    }
                                })
                            }
                        })
                    }
                })
        */
    })
    $("#shengcheng_un").click(function () {
        //从通用统计页面中获取有开考考点科目数据
        $.ajax({
            type: 'post',
            data: {
                OrgCode: '3302',
                ReportType: '3'
            },
            url: '/TESTROOMATTENDANCEEXPORTMANAGE/GetOrgFileInfoList',
            success: function (json) {
                // console.log(json.rows)
                // let s = (json.rows).substr(1, (json.rows).length - 2)
                // console.log($.parseJSON(s))
                $.each(json.rows, function (index, row) {
                    // console.log(row)
                    // console.log("-----------")
                    if (row.OrgLevel === 0 && row.FileSize === null) {
                        console.log(row)
                        $.ajax({
                            type: 'post',
                            data: {
                                TestCenterCode: row._parentId,
                                SubjectCode: row.Code,
                                ReportType: 3
                            },
                            url: '/TESTROOMATTENDANCEEXPORTMANAGE/CreateFile',
                            success: function (backjson) {
                                console.log(index, row._parentId, row.Code, backjson)
                            }
                        })
                    }
                })
            }
        })

        /*
                $.ajax({
                    type: 'post',
                    data: {
                        OrgCode: OrgCode,
                        ReportType: 3
                    },
                    url: '/TESTROOMATTENDANCEEXPORTMANAGE/GetOrgFileInfoList',
                    success: function (json) {
                        // console.log(json)
                        $.each(json.rows, function (index, row) {
                            // console.log(row)
                            if (row.OrgLevel === 0 && row.CreateFileTime != '') {
                                console.log(row.Code, row._parentId)
                                $.ajax({
                                    type:'post',
                                    data:{
                                        TestCenterCode: row._parentId,
                                        SubjectCode: row.Code,
                                        ReportType: 3
                                    },
                                    url:'/TESTROOMATTENDANCEEXPORTMANAGE/CreateFile',
                                    success:function (backjson){
                                        console.log(index,row._parentId,row.Code,backjson)
                                    }
                                })
                            }
                        })
                    }
                })
        */
    })
    // 下载所有考点签到表的函数
    $("#xiazai").click(function () {
        let xx = $("td[field=\"CreateFileTime\"]>div:contains(':')").parent().parent()
            .find("td[field=\"OrgLevel\"]")
        console.log(xx)
        $.each(xx, function (index, row) {
            // 生成下载url
            // TODO 自动如何下载还有待摸索
            // downloafinfo:  DownFile('3302330203','10')
            let downloafinfo = $(row).find("span").eq(1).attr('onclick')
            let group = downloafinfo.match(/DownFile\('([0-9]*)','([0-9]*)'\)/)
            // 0: "DownFile('3302330203','10')"
            // 1: "3302330203"
            // 2: "10"
            let kaodianid = group[1]
            let jibieid = group[2]
            let downloadurl = 'https://pets-kw.neea.edu.cn/TESTROOMATTENDANCEEXPORTMANAGE/DownFile?TestCenterCode=' +
                kaodianid + '&SubjectCode=' +
                jibieid + '&ReportType=3'
            console.log(downloadurl)

            // TODO 暂时使用模拟单击下载按钮实现
            $(row).find("span").eq(1).click()
        })

    })
    $("#xxx").click(function () {
        $.ajax({
            type: 'post',
            data: {
                statColumn: '考试考点代码;科目代码',
                StatIndicator: '编排科目统计',
                statCondition: '',
                chkColumnSummation: 0,
                chkRowSummation: 0,
                chkRowGroupSummation: 0,
            },
            url: '/CommonStatManage/GetStatData',
            success: function (json) {
                let s = (json.rows).substr(1, (json.rows).length - 2)
                console.log($.parseJSON(s))
                $.each($.parseJSON(s), function (index, row) {
                    console.log(row)
                    //TODO 目前直接生成所有考点，需过滤已经生成过的考点
                    $.ajax({
                        type: 'post',
                        data: {
                            TestCenterCode: '3302' + row.C100114,
                            SubjectCode: row.C100311,
                            ReportType: 3
                        },
                        url: '/TESTROOMATTENDANCEEXPORTMANAGE/DownFileForCheck',
                        success: function (backjson) {
                            console.log(index, row._parentId, row.Code, backjson)
                        }
                    })
                })
            }
        })
    })

}

function SUBORGDECLAREMANAGE_Index() {
    $("body").prepend("<div id='export_shijuan' class='btn blue btn-sm'>导出试卷申报</div>");
    $("#export_shijuan").click(function () {
        $.post('/SUBORGDECLAREMANAGE/GetOrgMaterialList?orgLevel=4', function (j) {
            j.rows.forEach(function (v, i, c) {
                console.log(v["OrgFullName"], v["Code"])
                $.ajax({
                    type: 'get',
                    url: '/SUBORGDECLAREMANAGE/Details?orgCode=' + v["Code"],
                    success: function (html) {
                        let table = $(html).find("#tableDatagrid")
                        console.log(table)
                        export_to_excel_table(table[0], v["OrgFullName"] + "试卷申报表导出.xlsx")

                    }
                })
            })
        })
    })
}

function TESTCENTERTESTTICKETEXPORTMANAGE_Index() {
    $("body").prepend(
        "<div id='shengcheng_zkz' class='btn blue btn-sm'>生成所有未生成考点<span id='jishuqi_zkz'></span></div>" +
        "<div id='xiazai_zkz' class='btn blue btn-sm'>下载所有考点准考证</div>");
    $("#shengcheng_zkz").click(function () {
        let OrgCode = $("#OrgCode").val()
        $.ajax({
            async: false,
            type: "post",
            url: "/TESTCENTERTESTTICKETEXPORTMANAGE/GetOrgFileInfoList",
            data: {
                OrgCode: OrgCode,
                ReportType: 1,
            },
            success: function (json) {
                let r = json['rows']
                console.log(r)
                r.forEach(function (item, index) {
                    if (item["OrgLevel"] === 0 && item["CreateFileTime"] === null) {
                        console.log(item)
                        $("[node-id='" + item["_parentId"] + "']+tr")
                            .find("[node-id='" + item['Code'] + "']")
                            .find("[field=\"FileSize\"] >div").text("已发送命令")
                        $.ajax({
                            async: false,
                            type: "post",
                            url: "/TESTCENTERTESTTICKETEXPORTMANAGE/CreateFileForLargeTestticket",
                            data: {
                                TestCenterCode: item["_parentId"],
                                SubjectCode: item['Code'],
                                ReportType: 1,
                            },
                            success: function (shengcheng_json) {
                                let Message = shengcheng_json['Message']
                                console.log(item["_parentId"], item['Code'], Message)
                                $("[node-id='" + item["_parentId"] + "']+tr")
                                    .find("[node-id='" + item['Code'] + "']")
                                    .find("[field=\"CreateFileTime\"] >div").text(shengcheng_json['ExceuteResultType'] + Message)
                            }
                        })

                    }
                })

            }
        })
    })
    $("#xiazai_zkz").click(function () {
        let OrgCode = $("#OrgCode").val()
        $.ajax({
            type: "post",
            url: "/TESTCENTERTESTTICKETEXPORTMANAGE/GetOrgFileInfoList",
            data: {
                OrgCode: OrgCode,
                ReportType: 1,
            },
            success: function (json) {
                let r = json['rows']
                console.log(r)
                r.forEach(function (item, index) {
                    if (item["OrgLevel"] === 0 && item["FileSize"] != null) {
                        console.log(item)
                        DownFile(item["_parentId"], item['Code'])
                    }
                })

            }
        })
    })
}

function TESTROOMARRANGEMANAGE_Index() {
    $("body").prepend("<div id='auto_bianpai' class='btn red btn-sm'>自动编排（很慢！F12查看进度）</div>")
    $("#auto_bianpai").click(function () {
        let orgCode = $("#OrgCode").val()
        $.post('/TESTROOMARRANGEMANAGE/GetArrangeStatView', {testTestCenterCode: orgCode},
            function (json) {
                json['rows'].forEach(function (item, index) {
                    if (item['UnArrangeCount'] > 0 && item['SubjectCode'] !== null) {
                        console.log(orgCode,"编排", item['SubjectName'])
                        $.post('/TESTROOMARRANGEMANAGE/SetAutoArrange',
                            {
                                testTestCenterCode: orgCode,
                                SubjectCode: item['SubjectCode'],
                                IsIntentionArrange: 0,
                            },
                            function (html) {
                                console.log(item['SubjectName'], "编排成功")
                            })
                    }
                })
            })
    })


    // 导出考生编排数据
    let all_data = [["考点代码", "考点名称", "种类代码", "级别代码", "科目名称", "试场号", "身份证号", "姓名", "座位号", "准考证号", "开始时间", "考试时间"]]
    let n = 0
    // 日期格式转换函数
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        fmt = fmt || "yyyy-MM-dd";
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    $("body").prepend(
        "<div id='export_bianpai' class='btn blue btn-sm'>导出考生编排数据<span id='row_number'></span></div>" +
        "<div id='download_bianpai' class='btn blue btn-sm'>下载考生编排数据</div>");
    $("#export_bianpai").click(function () {
        //获取考点列表信息
        $.post("/OrgManage/GetPartOrgList?enable=1&orgLevel=4", function (json_kaodianlist) {
            json_kaodianlist['rows'].forEach(function (item_kaodian) {
                if (item_kaodian["OrgLevel"] === 4) {
                    let testTestCenterCode = item_kaodian["Code"]
                    let TestCenterFullName = item_kaodian["FullName"]
                    let TestCenterMemoName = item_kaodian["Memo"]
                    // 考点列表
                    // console.log(testTestCenterCode)
                    // 获取试场列表信息
                    $.post("/TESTROOMARRANGEMANAGE/GetArrangeStatView?testTestCenterCode=" + testTestCenterCode,
                        function (json_subjects_list) {
                            let subjects_list = json_subjects_list["rows"]
                            subjects_list.forEach(function (json_subjects) {
                                if (json_subjects["SubjectCode"] !== null) {
                                    // 科目信息
                                    let SubjectCode = json_subjects["SubjectCode"]
                                    let SubjectName = json_subjects["SubjectName"]
                                    $.post("/TESTROOMARRANGEMANAGE/GetTestRoomList",
                                        {OrgCode: testTestCenterCode, SubjectCode: SubjectCode, Code: "", Address: ""}
                                        , function (json_examination_hall_list) {
                                            json_examination_hall_list["rows"].forEach(function (json_examination_hall) {
                                                if (json_examination_hall["SID"] !== null) {
                                                    // 考场列表
                                                    // console.log(json_examination_hall)
                                                    // 考场号
                                                    let room_id = json_examination_hall["_parentId"]
                                                    let BeginTime = json_examination_hall["BeginTime"]
                                                    let EndTime = json_examination_hall["EndTime"]
                                                    $.post("/TESTROOMARRANGEMANAGE/GetArrangedCandidate",
                                                        {
                                                            testTestCenterCode: testTestCenterCode,
                                                            troSid: json_examination_hall["SID"],
                                                        },
                                                        function (json_stu_list) {
                                                            json_stu_list["rows"].forEach(function (item) {
                                                                let one_row = [
                                                                    testTestCenterCode,
                                                                    TestCenterFullName,
                                                                    SubjectCode.substring(1, 2),//笔试0口试1种类代码
                                                                    SubjectCode.substring(0, 1),//一级1四级4级别代码
                                                                    SubjectName,
                                                                    room_id,
                                                                    item["IDNumber"],
                                                                    item["Name"],
                                                                    item["Seat"],
                                                                    item["TestTicket"],
                                                                    eval(BeginTime.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")).format('yyyy-MM-dd hh:mm'),
                                                                    eval(BeginTime.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")).format('yyyy-MM-dd hh:mm') + "-" +
                                                                    eval(EndTime.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")).format('hh:mm')
                                                                ]
                                                                console.log(one_row)
                                                                all_data.push(one_row)
                                                                n++
                                                                $("#row_number").text(n)
                                                            })
                                                        }
                                                    )
                                                }
                                            })
                                        })
                                }
                            })
                        })
                }
            })
        })
    })
    $("#download_bianpai").click(function () {
        export_to_excel(all_data, "PETS编排数据导出.xlsx")
    })

    // 导出考点试场列表
    let shichang_data = [["考点代码", "考点名称", "考点简称", "种类代码", "考试种类", "级别代码", "考试级别", "科目名称", "试场号", "考生人数", "开始时间", "考试时间"]]
    let shichang_n = 0
    $("body").prepend(
        "<div id='export_shichang' class='btn yellow btn-sm'>导出考点试场列表<span id='shichang_row_number'></span></div>" +
        "<div id='download_shichang' class='btn yellow btn-sm'>下载考点试场列表</div>");
    $("#export_shichang").click(function () {
        //获取考点列表信息
        $.post("/OrgManage/GetPartOrgList?enable=1&orgLevel=4", function (json_kaodianlist) {
            json_kaodianlist['rows'].forEach(function (item_kaodian) {
                if (item_kaodian["OrgLevel"] === 4) {
                    let testTestCenterCode = item_kaodian["Code"]
                    let TestCenterFullName = item_kaodian["FullName"]
                    let TestCenterMemoName = item_kaodian["Memo"]
                    // 考点列表
                    // console.log(testTestCenterCode)
                    // 获取试场列表信息
                    $.post("/TESTROOMARRANGEMANAGE/GetArrangeStatView?testTestCenterCode=" + testTestCenterCode,
                        function (json_subjects_list) {
                            let subjects_list = json_subjects_list["rows"]
                            subjects_list.forEach(function (json_subjects) {
                                if (json_subjects["SubjectCode"] !== null) {
                                    // 科目信息
                                    // console.log(json_subjects)
                                    let SubjectCode = json_subjects["SubjectCode"]
                                    let SubjectName = json_subjects["SubjectName"]
                                    $.post("/TESTROOMARRANGEMANAGE/GetTestRoomList",
                                        {OrgCode: testTestCenterCode, SubjectCode: SubjectCode, Code: "", Address: ""}
                                        , function (json_examination_hall_list) {
                                            json_examination_hall_list["rows"].forEach(function (json_examination_hall) {
                                                if (json_examination_hall["SID"] !== null) {
                                                    // 考场列表
                                                    console.log(json_examination_hall)
                                                    let room_id = json_examination_hall["_parentId"]// 考点代码
                                                    let UsedCapacity = json_examination_hall['UsedCapacity']// 考生人数
                                                    let BeginTime = json_examination_hall["BeginTime"]// 开始时间
                                                    let EndTime = json_examination_hall["EndTime"]// 结束时间
                                                    let shichang_one_row = [
                                                        testTestCenterCode.substring(4),
                                                        TestCenterFullName,
                                                        TestCenterMemoName,
                                                        SubjectCode.substring(1, 2),//笔试0口试1种类代码
                                                        SubjectName.substring(2, 4),
                                                        SubjectCode.substring(0, 1),//一级1四级4级别代码
                                                        SubjectName.substring(0, 2),
                                                        SubjectName,
                                                        room_id,
                                                        UsedCapacity,
                                                        eval(BeginTime.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")).format('yyyy-MM-dd hh:mm'),
                                                        eval(BeginTime.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")).format('yyyy-MM-dd hh:mm') + "-" +
                                                        eval(EndTime.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")).format('hh:mm')
                                                    ]
                                                    // 试场人数大于0则算有效试场
                                                    if (UsedCapacity > 0) {
                                                        shichang_data.push(shichang_one_row)
                                                        shichang_n++
                                                        $("#shichang_row_number").text(shichang_n)
                                                    }
                                                }
                                            })
                                        })
                                }
                            })
                        })
                }
            })
        })
    })
    $("#download_shichang").click(function () {
        //TODO 按考点，开始时间，试场号排序shichang_data
        export_to_excel(shichang_data, "PETS试场数据导出.xlsx")
    })
}

function TESTCENTERWRITTENTESTTICKETNOTICEMANAGE_Index() {
    $("body").append(
        "<div class='col-xs-8'>" +
        "<div id='show' class='btn blue btn-sm'>查看所有考点提示</div>" +
        "<div><table id='show_table' class='table table-bordered'>" +
        "<tr><td>考点</td><td>笔试</td><td>口试</td></tr></table></div>" +
        "</div>")
    $("#show").click(function () {
        $.post("/OrgManage/GetPartOrgList",
            {enable: 1, orgLevel: 4},
            function (result) {
                $.each(result['rows'], function (i, v) {
                    if (v['OrgLevelString'] == "考点级") {
                        console.log(v['Code'], v['FullName'])
                        let testCenterCode = v['Code']
                        $("#show_table").append(
                            "<tr><td>" + v['FullName'] + "</td>" +
                            "<td id='bishi_" + testCenterCode + "'></td>" +
                            "<td id='koushi_" + testCenterCode + "'></td></tr>")
                        // 笔试
                        $.post("/TESTCENTERWRITTENTESTTICKETNOTICEMANAGE/GetTestCenterNoticeSettingForAjax",
                            {testCenterCode: testCenterCode},
                            function (result) {
                                $("span").html(result);
                                console.log("笔试", result["Result"]["WrittenTestTicketNotice"])
                                $("#bishi_" + testCenterCode).text(result["Result"]["WrittenTestTicketNotice"])
                            });
                        // 口试
                        $.post("/TESTCENTERSPOKENTESTTICKETNOTICEMANAGE/GetTestCenterNoticeSettingForAjax",
                            {testCenterCode: testCenterCode},
                            function (result) {
                                $("span").html(result);
                                console.log("口试", result["Result"]["SpokenTestTicketNotice"])
                                $("#koushi_" + testCenterCode).text(result["Result"]["SpokenTestTicketNotice"])
                            });
                    }

                })
            }
        )

        // 笔试
        $.post("/TESTCENTERWRITTENTESTTICKETNOTICEMANAGE/GetTestCenterNoticeSettingForAjax",
            {testCenterCode: 3302330202},
            function (result) {
                $("span").html(result);
                console.log("笔试", result["Result"]["WrittenTestTicketNotice"])
            });
        // 口试
        $.post("/TESTCENTERSPOKENTESTTICKETNOTICEMANAGE/GetTestCenterNoticeSettingForAjax",
            {testCenterCode: 3302330202},
            function (result) {
                $("span").html(result);
                console.log("口试", result["Result"]["SpokenTestTicketNotice"])
            });
    })
}

function WHITELISTMANAGE_Index() {
    let wb
    let sheet
    // “机构”名称
    let searchOrgFullName = ""
    let a = []
    //考生数据字段列表
    let key_map = {
        "TestCenterOrgInfo":"TestCenterOrgInfo",
        "TestCenterOrgSetting":"TestCenterOrgSetting",
        "TestCenterFullName": "白名单机构",
        "ProvinceCode": "省代码",
        "PSETSCode": "白名单机构代码",
        "IDTypeString": "证件类型",
        "ModifyTimeString": "最后修改时间",
        "SID": "SID",
        "TestID": "考次号",
        "TestCenterCode": "TestCenterCode",
        "Name": "姓名",
        "IDType": "证件类型代码",
        "IDNumber": "身份证号",
        "CreatePassportSID": "CreatePassportSID",
        "ModifyPassportSID": "ModifyPassportSID",
        "Memo": "Memo",
        "CreateTime": "CreateTime",
        "ModifyTime": "ModifyTime"
    }
    //标题行
    let title_arr = []
    for (let i in key_map) {
        title_arr.push(key_map[i]);
    }
    let out = [title_arr]//标题行放到输出数组首行

    //添加“导出”按钮
    $("body div:first div:first").prepend(
        "<div id='export' class='btn blue btn-sm'>导出为白名单Excel<span id='jingdu'></span></div>"
    )
    //按钮事件
    $("#export").click(function () {
        a = []
        out = [title_arr]
        $("#jingdu").text(" (请等待...)")
        //从页面中获取当前选择的“选择机构”代码
        let searchOrgCode = $("#searchOrgCode").val()
        //从页面中获取当前选择的“报名机构”名称，导出excel文件名用
        searchOrgFullName = $("#searchOrg").val()
        console.log(searchOrgCode, searchOrgFullName)

        //递归函数，分页获取所有考生数据，所有数据获取后执行导出动作
        function dg(total, page) {

            let rows = 200;
            console.log(total, page, rows)
            if (page <= Math.round(total / rows) + 1) {
                $.post(
                    "https://pets-kw.neea.edu.cn/WHITELISTMANAGE/GetList",
                    {
                        "OrgCode": searchOrgCode,
                        "Name": "",
                        "IsRegister": "",
                        "IDType": "",
                        "IDNumber": "",
                        "Memo": "",
                        "page": page,
                        "rows": rows
                    },
                    function (result) {
                        a = a.concat(result.rows)
                        total = result.total
                        $("#jingdu").text(" (" + a.length + "/" + total + ")")
                        console.log(a)
                        dg(total, page + 1)
                    }
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
                    console.log(row)
                    out.push(row)
                })
                //执行导出到excel的过程
                export_to_excel(out, searchOrgFullName + "_白名单数据导出.xlsx");
                $("#export").after(
                    "<div id='save_btn' class='btn blue btn-sm'>下载Excel文件</div>");
                $("#save_btn").click(function () {
                    export_to_excel(out, searchOrgFullName + "_白名单数据导出.xlsx");
                })
                // $("#save_jpg_btn").click(function () {
                //     function downloadImage(src, filename) {
                //         let a = $("<a></a>").attr("href", src).attr("download", filename);
                //         a[0].click();
                //     }
                //
                //     out.forEach(function (item) {
                //         console.log(item)
                //         downloadImage('/Photo/Show?sid=' + item[0], item[6] + ".jpg")
                //     })
                // })
            }
        }

        //执行递归函数
        dg(100, 1)
    });

}