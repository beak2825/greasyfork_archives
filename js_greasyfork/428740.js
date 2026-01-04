// ==UserScript==
// @name         西柚教务增强脚本
// @namespace    https://github.com/Hami-Lemon/SwpuEducationEnhance
// @version      1.1.0
// @description  解决西柚教务系统无法查看成绩明细的问题
// @author       Hami Lemon
// @match        *://jwxt.swpu.edu.cn/gradeLnAllAction.do*
// @match        *://jwxt.swpu.edu.cn/bxqcjcxAction.do*
// @exclude      *://jwxt.swpu.edu.cn/bxqcjcxAction.do?oper=cjmx*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      GPL-3.0
// @compatible   firefox
// @compatible   chrome
// @supportURL   https://github.com/Hami-Lemon/SwpuEducationEnhance/issues
// @compatible   edge
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/428740/%E8%A5%BF%E6%9F%9A%E6%95%99%E5%8A%A1%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/428740/%E8%A5%BF%E6%9F%9A%E6%95%99%E5%8A%A1%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    /* 在现代浏览器中，此方法已被废弃（除了IE)，而查看成绩明细功能则是调用此方法来显示
    详见：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/showModalDialog */
    unsafeWindow.showModalDialog = pageDialog;

    //添加弹窗样式
    GM_addStyle("div#dialog {" +
        "max-height: 500px;" +
        "text-align: center;" +
        "position: fixed;" +
        "left: 50%;" +
        "top: 50%;" +
        "box-sizing: border-box;" +
        "overflow: auto;" +
        "color: #000;" +
        "background-color: #fff;" +
        "border-radius: 6px;" +
        "box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), " +
        "0 2px 2px 0 rgb(0 0 0 / 14%), " +
        "0 1px 5px 0 rgb(0 0 0 / 12%);");
    GM_addStyle("div#close {text-align: end;}");
    GM_addStyle("div#close i {" +
        "padding: 0 4px;" +
        "color: #000;" +
        "display: inline-block;" +
        "width: 18px;" +
        "height: 18px;" +
        "font-size: 18px;" +
        "border-radius: 0 6px 0 6px;" +
        "text-align: center;}");
    GM_addStyle("div#close i:hover {background-color: #F00;color: #FFF;cursor: pointer;}")

    //匹配本学期成绩页面
    if (location.href.search("bxqcjcxAction.do") != -1) {
        //计算本学期的学分绩点，计算公式见学生手册33页（此公式为本科生的计算公式）
        let calGPA = function(gradesTable) {
            let gradesTr = gradesTable.find("thead tr");
            //每门课学分*绩点的总和
            let totalPoint = 0;
            //总学分
            let totalCredit = 0;
            //遍历每一行数据
            for (let i = 0; i < gradesTr.length; i++) {
                let course = gradesTr.eq(i).find("td");

                //成绩
                let grades = course.eq(9)
                    .text()
                    .replace(/\s*/g, "");
                //该课程没有成绩，不参与计算
                if (grades == "") {
                    continue;
                }
                //学分
                let credit = course.eq(4)
                    .text()
                    .replace(/\s*/g, "");
                credit = Number(credit);

                //学分绩点：（分数-60）/10+1
                let gradePoint;
                //成绩为按等级划分
                switch (grades) {
                    case "优秀":
                        gradePoint = 4.5;
                        break;
                    case "良好":
                        gradePoint = 3.5;
                        break;
                    case "中等":
                        gradePoint = 2.5
                        break;
                    case "及格":
                        gradePoint = 1.5
                        break;
                    case "不及格":
                        gradePoint = 0;
                        break;
                    default:
                        gradePoint = -1;
                        break;
                }
                if (gradePoint == -1) {
                    grades = Number(grades);
                    if (grades < 60) {
                        gradePoint = 0;
                    } else {
                        gradePoint = (grades - 60) / 10 + 1;
                    }
                }
                totalCredit += credit;
                totalPoint += (credit * gradePoint);
            }
            //平均学分绩点 总(学分*绩点）/ 总学分
            return totalPoint / totalCredit;
        }

        let gradesTable = $("table#user.displayTag");
        if (gradesTable != null) {
            let gpa = calGPA(gradesTable);
            if (!isNaN(gpa)) {
                //保留小数点后三位（四舍五入）
                gpa = gpa.toFixed(3);
                let gpaRoot = $("<div></div>");
                gpaRoot.css("font-size", "14px");
                gpaRoot.css("margin", "30px 50px");

                let gpaElement = $("<div></div>");
                gpaElement.text("平均绩点：" + gpa);

                let infoElement = $("<div>*没有成绩的课程不会参与计算</div>");
                infoElement.css("font-size", "12px");
                infoElement.css("color", "#E00");
                infoElement.css("margin", "6px 0");

                gpaRoot.append(gpaElement);
                gpaRoot.append(infoElement);
                $("body").append(gpaRoot);
            }
        }

    }

    //显示弹窗
    function pageDialog(url) {
        let dialog = $("<div id='dialog'>" +
            "<div id='close'><i>X</i></div>" +
            "<div id='loading'>正在加载。。。</div>" +
            "<iframe frameborder='0'>你的浏览器不支持显示此内容</iframe>" +
            "</div>");
        //显示内容的iframe
        let frame = dialog.find("iframe");
        frame.prop("src", url);
        frame.load(function() {
            dialog.find("#loading").remove();
            //内容的实际高度和宽度
            let height = this.contentWindow.document.documentElement.scrollHeight;
            let width = this.contentWindow.document.documentElement.scrollWidth;
            frame.height(height);
            frame.width(width += 200);

            dialog.width(width)
            //居中
            dialog.css("margin-top", "-" + dialog.height() / 2 + "px");
            dialog.css("margin-left", "-" + dialog.width() / 2 + "px")
        })
        //点击关闭
        dialog.find("#close i")
            .click(function() {
                dialog.remove();
            })

        $("body").append(dialog);
    }

})();
