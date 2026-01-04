// ==UserScript==
// @name SEUGPAHelper
// @description 帮助你快速计算绩点
// @version 0.1.0
// @match *://ehall.seu.edu.cn/jwapp/sys/cjcx/*
// @run-at document-end
// @namespace https://greasyfork.org/users/730743
// @downloadURL https://update.greasyfork.org/scripts/420600/SEUGPAHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/420600/SEUGPAHelper.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function loadMyScript() {
        if (document.querySelector('.bh-advancedQuery-totalNum') === null || document.querySelector('.bh-advancedQuery-totalNum').firstChild === null) { setTimeout(loadMyScript, 500); }
        else {
            alert('使用方法: 本插件计算所有列表中显示出来的绩点。若想要计算所有课程绩点，请选择务必全部，并务必在右下角选择每页显示100。\n\n使用技巧：在上一步基础上，使用高级搜索，筛选掉所有任选课程，避免课程数超出100导致无法计算。\n\n本插件不计算绩点的课程有军训、中西哲学智慧、中国戏曲艺术、吴健雄学院CPP课，所有任选课，所有通过/不通过课程')
            function getGrade(grade) {
                if (grade === '优') return 95;
                if (grade === '良') return 85;
                if (grade === '中') return 75;
                if (grade === '合格') return 65;
                if (grade === '不合格') return 59;
                else return parseFloat(grade);
            }
            function getGPA(grade) {
                if (grade <= 100 && grade >= 96) return 4.8;
                if (grade >= 93) return 4.5;
                if (grade >= 90) return 4.0;
                if (grade >= 86) return 3.8;
                if (grade >= 83) return 3.5;
                if (grade >= 80) return 3.0;
                if (grade >= 76) return 2.8;
                if (grade >= 73) return 2.5;
                if (grade >= 70) return 2.0;
                if (grade >= 66) return 1.8;
                if (grade >= 63) return 1.5;
                if (grade >= 60) return 1.0;
                else return 0;
            }
            function judgeLesson(lesson) {
                let lessonName = lesson.children[2].firstChild.innerHTML;
                let lessonFlag = lesson.children[6].firstChild.innerHTML;
                let lessonNotAllowed = ['军训', '中国戏曲艺术', '中西哲学智慧', '算法与程序设计'];
                if (lessonFlag === '任选') return false;
                if (lessonNotAllowed.indexOf(lessonName) !== -1) return false;
                return true;
            }
            function calclulate() {
                let totalNum = parseInt(document.querySelector('.bh-advancedQuery-totalNum').firstChild.innerHTML);
                let calclulatedNum = 0;
                let totalGPA = 0;
                let AVGgpa = 0;
                let totalGrade = 0;
                let AVGgrade = 0;
                let totalCredits = 0;
                let AllLessons;
                if (document.querySelector('#contentqb-index-table') !== null) {
                    AllLessons = document.querySelector('#contentqb-index-table').children[1].firstChild.firstChild.children[1].children;
                }
                else {
                    AllLessons = document.querySelector('#contentdqxq-index-table').children[1].firstChild.firstChild.children[1].children;
                }
                let htotalGPA=0,htotalGrade=0,htotalCredits=0;
                for (let i = 0; i < AllLessons.length; i++) {
                    if(AllLessons[i].children[9].innerHTML !== '通过' && AllLessons[i].children[9].innerHTML !== '不通过' && !isNaN(getGrade(AllLessons[i].children[9].innerHTML))){
                        calclulatedNum++;
                        let credit = parseFloat(AllLessons[i].children[7].firstChild.innerHTML);
                        let grade = getGrade(AllLessons[i].children[9].innerHTML);
                        let gpa = getGPA(grade);
                        htotalGPA += gpa * credit;
                        htotalGrade += grade * credit;
                        htotalCredits += credit;
                    }
                }
                console.log(`共查询到 ${totalNum}门课程\n计算了 ${calclulatedNum}门课程\n已获总学分为 ${htotalCredits},百分制均分为 ${htotalGrade/htotalCredits}\n4.8制度绩点为 ${htotalGPA/htotalCredits}`);
                calclulatedNum=0;
                for (let i = 0; i < AllLessons.length; i++) {
                    if (judgeLesson(AllLessons[i]) && AllLessons[i].children[9].innerHTML !== '通过' && AllLessons[i].children[9].innerHTML !== '不通过') {
                        calclulatedNum++;
                        let credit = parseFloat(AllLessons[i].children[7].firstChild.innerHTML);
                        let grade = getGrade(AllLessons[i].children[9].innerHTML);
                        let gpa = getGPA(grade);
                        totalGPA += gpa * credit;
                        totalGrade += grade * credit;
                        totalCredits += credit;
                    }
                }
                AVGgrade = totalGrade / totalCredits;
                AVGgpa = totalGPA / totalCredits;
                //alert(`共查询到 ${totalNum}门课程\n计算了 ${calclulatedNum}门课程\n已获总学分为 ${totalCredits}\n百分制均分为 ${AVGgrade}\n4.8制度绩点为 ${AVGgpa}`);
                let gpaText = document.createElement('div');
                gpaText.appendChild(document.createTextNode(`共查询到 ${totalNum}门课程,   计算了 ${calclulatedNum}门课程,   已获总学分为 ${totalCredits},   百分制均分为 ${AVGgrade},   4.8制度绩点为 ${AVGgpa}`));
                if (document.querySelector('.jqx-tabs-title-container').children.length == 3) { document.querySelector('.jqx-tabs-title-container').appendChild(gpaText); }
                else {document.querySelector('.jqx-tabs-title-container').children[3].innerHTML=`共查询到 ${totalNum}门课程,   计算了 ${calclulatedNum}门课程,   已获总学分为 ${totalCredits},   百分制均分为 ${AVGgrade},   4.8制度绩点为 ${AVGgpa}`}
            }
            let calcBtn = document.createElement('button');
            calcBtn.appendChild(document.createTextNode("计算绩点"));
            calcBtn.onclick = calclulate;
            document.querySelector('.jqx-tabs-title-container').appendChild(calcBtn);
        }
    }
    loadMyScript();
})();
