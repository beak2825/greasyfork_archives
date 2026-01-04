// ==UserScript==
// @name         长江大学教务处自动评教
// @namespace    bakaft
// @version      1.1
// @description  简简单单打个满分，进入评教页面后按F5刷新，让表格填充到整个页面的时候，你就可以在表格上方看到自动评教按钮了
// @author       BakaFT
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @match        http://jwc3.yangtzeu.edu.cn/eams/quality/stdEvaluate.action
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446553/%E9%95%BF%E6%B1%9F%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%A4%84%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/446553/%E9%95%BF%E6%B1%9F%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%A4%84%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==


(function () {
    'use strict';
    let father = document.querySelector("#semesterForm > div:nth-child(2)");
    let button = document.createElement('button');
    button.name = 'mybtn'
    button.innerHTML = '自动评教'
    button.type = 'button';
    button.onclick = foo;
    father.appendChild(button);
})();


function foo() {
    let queryParam = null
    let course = null
    let coursename = null
    let semesterid = document.querySelector("input[name='semester.id']").getAttribute('value')
    console.log("开始遍历课程")
    let courseTable = document.querySelector(".gridtable").children[1]
    let numsOfCourse = courseTable.children.length
    console.log("共" + numsOfCourse + "门课程需要评教")

    for (let index = 0; index < numsOfCourse; index++) {
        course = courseTable.children[index];
        coursename = "(" + course.children[2].innerHTML + ")" + course.children[1].innerHTML
        console.log("当前课程：" +coursename)
        // 这意味着未评教
        if (course.children[5].firstChild.nodeType == 1) {
            console.log("课程尚未评教，正在发送请求")
            queryParam = new URLSearchParams(course.lastChild.firstChild.href.split('action')[1])
            makeRequest(queryParam.get('teacher.id'), semesterid, queryParam.get('evaluationLesson.id'),coursename)
        }
        else {
            console.log("课程已被评教过，跳过")
        }
    }
     alert("评教完了，刷新看看")
}

function makeRequest(teacherid, semesterid, evaluationLessonid,coursename) {
    console.log('评教中...')
    let params = new URLSearchParams();
    params.append('teacher.id', teacherid)
    params.append('semester.id', semesterid)
    params.append('evaluationLesson.id', evaluationLessonid)
    params.append('result1_0.questionName', '\u6559\u5E08\u4E3A\u4EBA\u5E08\u8868\u3001\u6CBB\u5B66\u6001\u5EA6\u4E25\u8C28')
    params.append('result1_0.content', '\u6EE1\u610F')
    params.append('result1_0.score', '20')
    params.append('result1_1.questionName', '\u6559\u5B66\u5185\u5BB9\u5145\u5B9E\uFF0C\u7406\u8BBA\u8054\u7CFB\u5B9E\u9645')
    params.append('result1_1.content', '\u6EE1\u610F')
    params.append('result1_1.score', '20')
    params.append('result1_2.questionName', '\u5E08\u751F\u4E92\u52A8\uFF0C\u8BFE\u5802\u7BA1\u7406\u4E25\u683C')
    params.append('result1_2.content', '\u6EE1\u610F')
    params.append('result1_2.score', '20')
    params.append('result1_3.questionName', '\u6559\u5B66\u8D28\u91CF\u4E0E\u6548\u679C\u7684\u603B\u4F53\u8BC4\u4EF7')
    params.append('result1_3.content', '\u6EE1\u610F')
    params.append('result1_3.score', '40')
    params.append('result1Num', '4')
    params.append('result2Num', '0')

    axios.post('/eams/quality/stdEvaluate!finishAnswer.action', params) .then(function (response) {
        // handle success
        console("评教成功:"+coursename)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
}

