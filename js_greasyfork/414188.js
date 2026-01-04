// ==UserScript==
// @name         韶关学院教务成绩统计助手
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  方便同学们统计
// @author       Wchert
// @match        http://jwc.sgu.edu.cn/jsxsd/kscj/cjcx_list
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/414188/%E9%9F%B6%E5%85%B3%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E6%88%90%E7%BB%A9%E7%BB%9F%E8%AE%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/414188/%E9%9F%B6%E5%85%B3%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E6%88%90%E7%BB%A9%E7%BB%9F%E8%AE%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
$(function () {
    //获取学期集合
    const set = new Set();
    let trs = $("#dataList tr");
    for (let index = 1; index < trs.length; index++) {
        const tr = trs[index];
        let term = tr.childNodes[3].textContent;
        set.add(term);
    }
    let from ='<div id="chatDiv" style="position:absolute;right:0;top:30%;width:400px;border:1px solid blue;  ">\n' +
    '        <div style="text-align: center;">\n' +
    '            <div><span style="color: red;">使用前须知：</span>\n' +
    '                <div\n' +
    '                    style="color: blue;">脚本免费使用,有任何使用问题反馈可与作者Wchert联系By：Wchert@126.com</div>\n' +
    '            </div>\n' +
    '            <br/>\n' +
    '            <from>\n' +
    '                <span>请选择要计算的学期:</span></br>';
    for (const s of set) {
        from += '<input type="checkbox" value="' + s + '" checked> ' + s + '</input></br>';
    }
    from += '            <span>请选择要计算的科目类型:</span></br>\n' +
        '            <input type="checkbox" value="公共选修课"  checked>公共选修课</input></br>\n' +
        '            <input type="checkbox" value="公共必修课" checked>公共必修课</input></br>\n' +
        '            <input type="checkbox" value="学科基础必修课" checked>学科基础必修课</input></br>\n' +
        '            <input type="checkbox"value="学科基础选修课" checked>学科基础选修课</input></br>\n' +
        '            <input type="checkbox"value="专业必修课" checked>专业必修课</input></br>\n' +
        '            <input type="checkbox"value="专业选修课" checked>专业选修课</input></br>\n' +
        '        </from>\n' +
        '        <button id="sb">计算</button>\n' +
        '    </div>\n' +
        '</div>';

    $(".Nsb_pw").append(from);
    $("#chatDiv").append('<div id = "chuankou"></div>')

    $("#sb").click(function () {
        let trs = $("#dataList tr");
        let sumGrade = 0.0;
        let sumCredit = 0.0;
        let sumGpa = 0.0;
        let nums = 0.0;
        let other = 0.0;
        var table = '<div id = "chuankou"><table  width="100%" border="0" cellspacing="0" cellpadding="0" class="Nsb_r_list Nsb_table">';
        var courses = '';
        let minScore = 100, minCourse = '', minGrade = 0;
        for (let i = 1; i < trs.length; i++) {
            const tr = trs[i];
            let category = tr.lastElementChild.textContent;
            let term = tr.childNodes[3].textContent;
            if (checkItem(category) || checkItem(term)) continue;
            nums++;
            let course = tr.childNodes[7].textContent;
            let grade = tr.childNodes[11].textContent;
            let credit = tr.childNodes[13].textContent;
            let status = tr.childNodes[17].textContent;
            console.debug(credit);
            let gpa = tr.childNodes[21].textContent;
            //判断是否为正考
            if(status == '正考'){
                other += parseFloat(gpa) * parseFloat(credit);
                courses += course + '\t';
                sumGrade += parseFloat(grade);
                sumCredit += parseFloat(credit);
                sumGpa += parseFloat(gpa);
            }
            if (minScore > parseFloat(grade)) {
                minScore = parseFloat(grade);
                minCourse = course;
                minGrade = gpa;
            }
        }
        console.debug(other);
        table += '    <tr>\n' +
            '        <th class="Nsb_r_list_thb">课程总数目</th>\n' +
            '        <th class="Nsb_r_list_thb">' + nums + '</th>\n' +
            '    </tr>\n';
        table += '    <tr>\n' +
            '        <th class="Nsb_r_list_thb">课程详情</th>\n' +
            '        <th class="Nsb_r_list_thb">' + courses + '\t</th>\n' +
            '    </tr>\n';
        table += '    <tr>\n' +
            '        <th class="Nsb_r_list_thb">总计</th>\n' +
            '        <th class="Nsb_r_list_thb">总分数:' + sumGrade + '\t总学分:' + sumCredit + '\t总绩点:' + toMyFixed(sumGpa) + '</th>\n' +
            '    </tr>\n';
        table += '    <tr>\n' +
            '        <th class="Nsb_r_list_thb">平均成绩（原数据）</th>\n' +
            '        <th class="Nsb_r_list_thb">课程平均分:' + sumGrade / nums + '\n平均学分绩点:' + other / sumCredit + '\n平均绩点:' + sumGpa / nums + '</th>\n' +
            '    </tr>\n';
        table += '    <tr>\n' +
            '        <th class="Nsb_r_list_thb">平均成绩（四舍五入）</th>\n' +
            '        <th class="Nsb_r_list_thb">课程平均分:' + toMyFixed(sumGrade / nums) + '\t平均学分绩点:' + toMyFixed(other / sumCredit) + '\t平均绩点:' + toMyFixed(sumGpa / nums) + '</th>\n' +
            '    </tr>\n';
        table += '    <tr>\n' +
            '        <th class="Nsb_r_list_thb">最低成绩</th>\n' +
            '        <th class="Nsb_r_list_thb">最低分课程:' + minCourse + '\t课程最低分:' + toMyFixed(minScore) + '\t最低学分绩点:' + minGrade + '</th>\n' +
            '    </tr>\n';
        table += '</table></div>';
        $("#chuankou").replaceWith(table);
    })

    function checkItem(str) {
        let noBoxs = $(":checkbox").not("input:checked");
        console.log(noBoxs);
        for (let i = 0; i < noBoxs.length; i++) {
            if (str === noBoxs[i].value) {
                return true;
            }
        }
        return false;
    }
    function toMyFixed(n){
        return Math.round(n*100)/100;
    }
})