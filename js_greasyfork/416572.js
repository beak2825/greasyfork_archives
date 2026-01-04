// ==UserScript==
/* globals jQuery, $, waitForKeyElements */
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @name         哈尔滨理工大学 教务在线 评估课程&教学评价自动完成、个人GPA计算脚本 Hrbust Auto-Eva
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  哈尔滨理工大学（hrbust） 评估课程&教学评价自动完成、个人GPA计算脚本。作用于哈理工教务在线（http://jwzx.hrbust.edu.cn/）内。
// @author       Leisurelybear
// @homepageURL  https://github.com/Leisurelybear/Hrbust-Auto-Eva
// @supportURL   https://github.com/Leisurelybear/Hrbust-Auto-Eva/issues
// @match        http://jwzx.hrbust.edu.cn/*
// @run-at       document-end
// @license      MIT
// @icon         https://s3.ax1x.com/2020/11/22/DG9DVe.png
// @icon64       https://s3.ax1x.com/2020/11/22/DG9DVe.png

// @downloadURL https://update.greasyfork.org/scripts/416572/%E5%93%88%E5%B0%94%E6%BB%A8%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%20%E6%95%99%E5%8A%A1%E5%9C%A8%E7%BA%BF%20%E8%AF%84%E4%BC%B0%E8%AF%BE%E7%A8%8B%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E3%80%81%E4%B8%AA%E4%BA%BAGPA%E8%AE%A1%E7%AE%97%E8%84%9A%E6%9C%AC%20Hrbust%20Auto-Eva.user.js
// @updateURL https://update.greasyfork.org/scripts/416572/%E5%93%88%E5%B0%94%E6%BB%A8%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%20%E6%95%99%E5%8A%A1%E5%9C%A8%E7%BA%BF%20%E8%AF%84%E4%BC%B0%E8%AF%BE%E7%A8%8B%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E3%80%81%E4%B8%AA%E4%BA%BAGPA%E8%AE%A1%E7%AE%97%E8%84%9A%E6%9C%AC%20Hrbust%20Auto-Eva.meta.js
// ==/UserScript==
(function () {
    "use strict";
    /////////////////////////---- Settings -----///////////////////////////
    var sleep_time = 1000; //设置模拟提交刷新时间，单位毫秒，不建议更改

    var auto_commit = 1; //设置自动提交  【1：自动提交， 0：手动提交】

    var evaluation_level = 0; //设置评价等级，默认为0：关闭。其他参数：【1：完全好评，2：中等评价，3：较差评价，4：完全随机。】 * 注意：开启此选项，则需要手动提交每一次评价

    //你认为教师在教学上最值得肯定之处？ 可按照格式拼接或删除建议
    var text_approve = [
        "活跃同学气氛 让同学们都能积极参于课堂问答",
        "善待学生，师生融恰，学生成绩能稳定提高，学校、家长双满意即是值得肯定的优秀教师。",
        "我觉得我们学校的老师教学水平是非常值得肯定的，学校里有很多年龄比较大的老师，他们都有特别丰富的人生阅历和渊博的知识，这些完美的履历是可以让我们敬畏他们的。",
        "老师对学生的关心与帮助是无微不至的",
    ];

    //你认为教师在教学上最应该改进之处？可按照格式拼接或删除建议
    var text_improve = [
        "转变教育观念：传统教师与现代教师的区别应当有现代教育观，吸引新思想，树立新的教育观念。",
        "拓展教学艺术，教学课堂要有创新，教师首先要努力实现教学观念的更新，以前的教学注重以教材为中心，以教测为目标。",
        "很好",
        "很不错",
        "很完美",
    ];

    //你对本门课程选用教材及参考书有何意见和建议？ 可按照格式拼接或删除建议
    var text_advice = [
        "很好",
        "教材应该具有实践性",
        "教材应该具有人文性",
        "教材应该具有综合性",
        "教材应该具有思想性",
    ];

    //其他建议？可按照格式拼接或删除建议
    var text_other = ["很好", "无"];

    /////////////////////////---- start -----///////////////////////////

    var URL_keyword_score = "studentOwnScore"; //学生个人成绩URL关键词
    var URL_keyword_evaindexinfo = "evaindexinfo"; //评价详细信息URL关键词
    var URL_keyword_resultlist = "resultlist"; //待评价列表URL关键词
    var URL_keyword_login = "login.jsp";
    var URL_keyword_homeindex = "homepage/index.do";
    var URL_keyword_indexnew = "academic/index_new.jsp";
    var URL_keyword_menu = "listLeft.do";

    var dataMap = new Map(); //数据map

    listen(); //程序开始

    /**
     * 监听程序开始，监听用户进入的页面是匹配
     */
    function listen() {
        console.log("Auto-Eva started...");

        if (window.location.href.indexOf(URL_keyword_menu) !== -1) {
            console.log("menu");
            appendController();
        }

        if (
            window.location.href.indexOf(URL_keyword_homeindex) !== -1 ||
            window.location.href.indexOf(URL_keyword_login) !== -1
        ) {
            //考虑到每次重新登录账号，清除过期的GPA_ALL和GPA_RC
            GM_deleteValue("GPA_ALL");
            GM_deleteValue("GPA_RC");
        }

        if (window.location.href.indexOf(URL_keyword_score) !== -1) {
            let query_table = $("body > center > form > table > tbody > tr");
            let cal_td =
                "<td><input name='hae_cal_score' type='button' id='hae_cal_score' class='button' value='计算GPA'></td>";
            query_table.append(cal_td); //添加按钮

            appendGPA();

            //点击计算GPA
            $("#hae_cal_score").click(function () {
                calGPA();
            });
        }

        if (window.location.href.indexOf(URL_keyword_evaindexinfo) !== -1) {
            eva_core();
        }
        if (window.location.href.indexOf(URL_keyword_resultlist) !== -1) {
            let eva_tag = $("#li14 > a");
            let count = 0;
            //let innerTabRow = $("body > center > table.infolist_tab > tbody > tr");

            //body > center > table.infolist_tab > tbody > tr:nth-child(1)
            let innerTabRow = $(
                "body > center > table.infolist_tab > tbody > tr"
            );
            // console.log(innerTabRow)
            for (let i = 1; i <= innerTabRow.length; i++) {
                //console.log(innerTabRow[i])
                //评估 a href标签  nth-child 选择第n个子节点，从1开始
                let rowLink = $(
                    "body > center > table.infolist_tab > tbody > tr:nth-child(" +
                        i +
                        ") > td:nth-child(4) > a"
                );
                let evaStatus = $(
                    "body > center > table.infolist_tab > tbody > tr:nth-child(" +
                        i +
                        ") > td:nth-child(3)"
                );
                // body > center > table.infolist_tab > tbody > tr:nth-child(8) > td:nth-child(4) > a
                if (
                    typeof evaStatus.html() != "undefined" &&
                    evaStatus.html().indexOf("未评估") !== -1 &&
                    rowLink.length !== 0
                ) {
                    //未评估 可以点：评估
                    //console.log(rowLink[0].href)
                    window.parent.frames["mainFrame"].location.href =
                        rowLink[0].href;
                }
                if (
                    typeof evaStatus.html() != "undefined" &&
                    evaStatus.html().indexOf("已评估") !== -1
                ) {
                    count++;
                }

                //body > table > tbody > tr:nth-child(8) > td:nth-child(4) > a
            }
            if (count >= innerTabRow.length - 1) {
                //如果完成了，则取消这个监听器
                console.log("Finish all " + count + " item(s).");
            } else {
                console.log(
                    "Already finish " +
                        count +
                        " item(s), remain " +
                        (innerTabRow.length - 1) +
                        ". "
                );
            }
        }
    }

    /**
     * menu 拼接进入自动评估选项
     */
    function appendController() {
        var gotoEva =
            '<li><script type="text/javascript">    var moduleStatus506 = true;</script></head><body><a onclick="showInfo(506)" href="./accessModule.do?moduleId=506" target="mainFrame"><span style=\'color: red\'>>>点击进入自动评估课程<<</span></a></li>';
        $("#menu").append(gotoEva);
    }

    /**
     * 计算当前页面的GPA
     * 注：其中多处计算扩大了倍数，是为了变成整数计算，保持浮点数精度
     * @returns {gpaCurrentPage:string,creditCurrentPage:string}
     */
    function calculateCurrentPage() {
        let gpaCurrentPage = 0; //当前页面
        let gpaRCCurrentPage = 0;
        let creditCurrentPage = 0; //当前页面
        let creditRCCurrentPage = 0;

        let rowlength = $("body > center > table > tbody > tr").length - 1;
        let headRow = $("body > center > table > tbody > tr:nth-child(1)");

        for (let i = 2; i <= 1 + rowlength; i++) {
            //当前行的所有td
            let currentRowTds = $(
                "body > center > table > tbody > tr:nth-child(" + i + ") > td"
            );

            let credit = currentRowTds[7].innerHTML.trim();
            let gpa = currentRowTds[13].innerHTML.trim();
            let testState = currentRowTds[11].innerHTML.trim(); //考试状态
            let courseType = currentRowTds[9].innerHTML.trim();
            if (testState !== "正常考试") {
                //补考或重修，不计入
                continue;
            }

            //gpa = gpa * 100
            gpa = parseFloat((gpa * 100).toFixed(10));
            //credit = credit * 10
            credit = parseFloat((credit * 10).toFixed(10));

            if (courseType === "必修") {
                gpaRCCurrentPage += gpa * credit;
                creditRCCurrentPage += credit;
            }
            gpaCurrentPage += gpa * credit;
            creditCurrentPage += credit;
        }

        //creditCurrentPage *= 100;
        creditCurrentPage = parseFloat((creditCurrentPage * 100).toFixed(10));
        creditRCCurrentPage = parseFloat(
            (creditRCCurrentPage * 100).toFixed(10)
        );
        return {
            gpaCurrentPage: gpaCurrentPage / creditCurrentPage,
            gpaRCCurrentPage: gpaRCCurrentPage / creditRCCurrentPage,
        };
    }
    function GPAToScore(GPA) {
        return (parseFloat(GPA) * 10 + 50).toFixed(2);
    }
    /**
     *  某一门学科的GPA：(期末总评-50.0)/10.0（不及格科目GPA为0）
     *  备注：五级分制期末总评：优秀95，良好85，中75，及格65，不及格50。
     *  所有学科的GPA：（学科1GPA×学科1学分数+学科2GPA×学科2学分数+......）］/(所有学科学分之和)
     *
     *  注：其中多处计算扩大了倍数，是为了变成整数计算，保持浮点数精度
     */
    function calGPA() {
        $("#hae_tb_gpa").remove();
        let gpaALL = GM_getValue("GPA_ALL");
        let gpaRC = GM_getValue("GPA_RC");
        let gpaCurrentPage = calculateCurrentPage().gpaCurrentPage;
        let gpaRCCurrentPage = calculateCurrentPage().gpaRCCurrentPage;
        if (typeof gpaALL == "undefined" || typeof gpaRC == "undefined") {
            if (dataMap.has(URL_keyword_score)) {
                // 已经获取过数据，仅仅点击关闭，所以下次不需要再次ajax请求
            } else {
                //请求全部科目
                $.ajax({
                    type: "POST",
                    url: "http://jwzx.hrbust.edu.cn/academic/manager/score/studentOwnScore.do",
                    data: {
                        year: "",
                        term: "",
                        prop: "",
                        groupName: "",
                        para: "0",
                        sortColumn: "",
                        Submit: "查询",
                    },
                    async: false,
                    success: function (result) {
                        var base = document.createElement("div"); //创建dom节点
                        base.innerHTML = result; //把请求的网页放到div中
                        //div > center > table > tbody > tr:nth-child(2)

                        let tbody = base.querySelector(
                            "div > center > table > tbody"
                        ); //选择器选择出tr
                        tbody.removeChild(tbody.firstChild); //移除表头
                        let rows = tbody.children; //rows为许多行成绩

                        dataMap.set(URL_keyword_score, rows);
                    },
                });
            }
            let rows = dataMap.get(URL_keyword_score);

            let gpaALLWeight = 0; //加权GPA：单科GPA*学分之和
            let creditALL = 0; //单科学分之和

            let gpaRCWeight = 0; //加权GPA：仅必修课
            let creditRC = 0; //仅必修课

            for (let i = 0; i < rows.length; i++) {
                let currentRowTds = rows[i].children;

                let score = currentRowTds[6].innerHTML.trim(); //成绩
                let credit = Number.parseFloat(
                    currentRowTds[7].innerHTML.trim()
                ); //学分
                let courseType = currentRowTds[9].innerHTML.trim(); //课程属性，是否为必修
                let passState = currentRowTds[12].innerHTML.trim(); //通过状态
                let testState = currentRowTds[11].innerHTML.trim(); //考试状态

                if (testState !== "正常考试") {
                    //补考或重修，不计入
                    continue;
                }

                //五级分制期末总评：优秀95，良好85，中75，及格65，不及格50。
                if (isNaN(Number(score))) {
                    //如果不是数字类型
                    score = getScoreBy5Level(score.trim());
                }

                let GPA = passState === "及格" ? (score - 50.0) / 10.0 : 0;

                //GPA = GPA * 100
                GPA = parseFloat((GPA * 100).toFixed(10));
                //credit = credit * 10
                credit = parseFloat((credit * 10).toFixed(10));

                if (GPA === 0) {
                    //挂科
                    gpaALLWeight += 0; //加权GPA + 0
                    creditALL += credit; //学分需要加
                    if (courseType === "必修") {
                        //必修课
                        gpaRCWeight += 0; //加权GPA + 0
                        creditRC += credit; //学分需要加
                    }
                } else {
                    //通过

                    gpaALLWeight += GPA * credit; //加权GPA + 0
                    creditALL += credit; //学分需要加
                    if (courseType === "必修") {
                        //必修课
                        gpaRCWeight += GPA * credit; //加权GPA 增加
                        creditRC += credit; //学分需要加
                    }
                }
            }

            //creditALL *= 100;
            creditALL = parseFloat((creditALL * 100).toFixed(10));
            //creditRC *= 100;
            creditRC = parseFloat((creditRC * 100).toFixed(10));

            gpaALL = gpaALLWeight / creditALL;
            gpaRC = gpaRCWeight / creditRC;
            GM_setValue("GPA_ALL", gpaALL);
            GM_setValue("GPA_RC", gpaRC);
        }

        let queryTable = $("body > center > form");
        let GPA_Table_HTML =
            "" +
            "<table class='form' cellspacing='0' cellpadding='0' id='hae_tb_gpa'>" +
            "<tr><td>所有已修学科GPA（全部：包括必修、限选、任选）</td><td>" +
            gpaALL.toFixed(2) +
            "(" +
            GPAToScore(gpaALL) +
            ")</td></tr>" +
            "<tr><td>所有已修学科GPA（仅必修）</td><td>" +
            gpaRC.toFixed(2) +
            "(" +
            GPAToScore(gpaRC) +
            ")</td></tr>" +
            "<tr><td>当前页面GPA（全部：包括必修、限选、任选）</td><td>" +
            gpaCurrentPage.toFixed(2) +
            "(" +
            GPAToScore(gpaCurrentPage) +
            ")</td></tr>" +
            "<tr><td>当前页面GPA（仅必修）</td><td>" +
            gpaRCCurrentPage.toFixed(2) +
            "(" +
            GPAToScore(gpaRCCurrentPage) +
            ")</td></tr>" +
            "<tr style='color: red'><td colspan='2' title='某一门学科的GPA：(期末总评-50.0)/10.0（不及格科目GPA为0）\n备注：五级分制期末总评：优秀95，良好85，中75，及格65，不及格50。\n所有学科的GPA：（学科1GPA×学科1学分数+学科2GPA×学科2学分数+......）］/(所有学科学分之和)'>提示：计算结果仅供参考！<b>【计算方法】</b>（鼠标悬浮查看）</td></tr>" +
            "<tr><td colspan='2' style='text-align: center'><input type='button' class='button' onclick=' $(\"#hae_tb_gpa\").remove();' value='关闭'></td></tr>" +
            "</table>";

        queryTable.append(GPA_Table_HTML);
    }

    /**
     * 核心评价代码，在评价页面，自动选择单选框，自动填写评语
     */
    function eva_core() {
        //取出所有radios组件
        var radios = $("input:radio");
        //console.log(radios)
        //有radios的行数
        let rowNums = radios.length % 4 === 0 ? radios.length / 4 : -1;
        console.log("radios评估共：" + rowNums + "行");

        if (rowNums !== -1) {
            let level2 = Math.ceil(Math.random() * (rowNums - 1));

            //console.log("rowNums:" + rowNums)
            switch (evaluation_level) {
                case 0:
                case 1: //优秀评价
                    //除了最后一行总评，随机取出一个，评价为良好，其他全部优秀
                    for (let i = 0; i < rowNums; i++) {
                        if (i !== level2) {
                            checkRadioIndexOf(radios, i, 0);
                        } else {
                            checkRadioIndexOf(radios, i, 1);
                        }
                    }
                    break;
                case 2: //中等评价
                    for (let i = 0; i < rowNums; i++) {
                        let rand0 = Math.ceil(Math.random() * (rowNums - 1));
                        if (i !== level2) {
                            checkRadioIndexOf(radios, i, (rand0 & 1) + 1);
                        } else {
                            checkRadioIndexOf(radios, i, 0);
                        }
                    }
                    break;
                case 3: //较差评价
                    for (let i = 0; i < rowNums; i++) {
                        let rand0 = Math.ceil(Math.random() * (rowNums - 1));
                        if (i !== level2) {
                            checkRadioIndexOf(radios, i, (rand0 & 1) + 2);
                        } else {
                            checkRadioIndexOf(radios, i, 0);
                        }
                    }
                    break;

                case 4: //全随机评价
                    //防止随机全重复，无法提交
                    checkRadioIndexOf(radios, 0, 0);
                    checkRadioIndexOf(radios, 1, 1);
                    for (let i = 2; i < rowNums; i++) {
                        let rand0 = Math.ceil(Math.random() * (rowNums - 1));
                        checkRadioIndexOf(radios, i, rand0 & 0b11);
                    }
                    break;
                default: //默认优秀评价
                    for (let i = 0; i < rowNums; i++) {
                        if (i !== level2) {
                            checkRadioIndexOf(radios, i, 0);
                        } else {
                            checkRadioIndexOf(radios, i, 1);
                        }
                    }
                    break;
            }
        }

        //填充文字评价
        let textareas = $("textarea");

        textareas[0].innerText = randomApprove();
        textareas[1].innerText = randomImprove();
        textareas[2].innerText = randomAdvice();
        textareas[3].innerText = randomOther();

        //提交
        if (auto_commit === 1 && evaluation_level === 0) {
            //document.form1.sub_b.disabled=true;
            var cn = 0;

            for (let i = 0; i < document.form1.elements.length; i++) {
                if (document.form1.elements[i].type === "radio") {
                    if (document.form1.elements[i].checked) {
                        cn++;
                    }
                }
            }
            //alert(cn)
            setTimeout(function () {
                document.form1.submit();
            }, sleep_time);
            //document.form1.submit();
        }
    }

    //选择第row行的第index个radio，其中row从0开始，index从0开始
    function checkRadioIndexOf(radios, row, index) {
        radios[row * 4 + index].setAttribute("checked", true);
    }

    //你认为教师在教学上最值得肯定之处？ 随机一个 老师值得肯定的地方
    function randomApprove() {
        //str中可以自定义随机评价老师的内容
        let str = text_approve;

        let rand = Math.ceil(Math.random() * str.length) - 1;
        if (rand < 0) {
            rand = 0;
        }
        let good = str[rand];
        return good;
    }

    //你认为教师在教学上最应该改进之处？ 随机一个 应该改进的地方
    function randomImprove() {
        //str中可以自定义随机还需提升的部分
        let str = text_improve;

        let rand = Math.ceil(Math.random() * str.length) - 1;
        if (rand < 0) {
            rand = 0;
        }
        let good = str[rand];
        return good;
    }

    //你对本门课程选用教材及参考书有何意见和建议？ 随机教材建议
    function randomAdvice() {
        //str中可以自定义随机还需提升的部分
        let str = text_advice;

        let rand = Math.ceil(Math.random() * str.length) - 1;
        if (rand < 0) {
            rand = 0;
        }
        let good = str[rand];
        return good;
    }

    //其他建议
    function randomOther() {
        //str中可以自定义随机还需提升的部分
        let str = text_other;

        let rand = Math.ceil(Math.random() * str.length) - 1;
        if (rand < 0) {
            rand = 0;
        }
        let good = str[rand];
        return good;
    }

    /**
     * 在个人成绩页面，自动拼接单科GPA到每一行末尾
     */
    function appendGPA() {
        let rowlength = $("body > center > table > tbody > tr").length - 1;
        let headRow = $("body > center > table > tbody > tr:nth-child(1)");
        //console.log(headRow)
        headRow.append("<th>单科GPA</th>");
        for (let i = 2; i <= 1 + rowlength; i++) {
            let currentRow = $(
                "body > center > table > tbody > tr:nth-child(" + i + ")"
            );

            //当前行的所有td
            let currentRowTds = $(
                "body > center > table > tbody > tr:nth-child(" + i + ") > td"
            );

            // console.log(tdInfos)
            let score = currentRowTds[6].innerHTML.trim();
            let credit = currentRowTds[7].innerHTML.trim();
            let pass_state = currentRowTds[12].innerHTML.trim();
            //五级分制期末总评：优秀95，良好85，中75，及格65，不及格50。
            if (isNaN(Number(score))) {
                //如果不是数字类型
                score = getScoreBy5Level(score.trim());
            }

            let GPA = pass_state === "及格" ? (score - 50.0) / 10.0 : 0;

            let td_GPA = "<td>" + GPA + "</td>";
            currentRow.append(td_GPA);
        }
    }

    //五级分制期末总评：优秀95，良好85，中75，及格65，不及格50。
    function getScoreBy5Level(str) {
        let score = NaN;
        switch (str.trim()) {
            // score.trim()
            case "优秀":
                score = 95;
                break;
            case "良好":
                score = 85;
                break;
            case "中":
                score = 75;
                break;
            case "及格":
                score = 65;
                break;
            case "不及格":
                score = 50;
                break;
            default:
                score = str;
        }
        return score;
    }
})();
