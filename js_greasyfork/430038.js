// ==UserScript==
// @name         普法网（宪法小卫士）课后练习、考试自动答题
// @namespace    Ne-21
// @version      1.4.1
// @description  全国学生“学宪法 讲宪法”活动自动答题脚本,因缺少测试账号无法保证每年都能用，欢迎大家提供测试账号以支持此脚本长期可用，测试账号登录信息请发送至我们的邮箱nawlgzs@gmail.com
// @author       Ne-21
// @match        *://static.qspfw.moe.gov.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjJCMTM4REU5QzA5MTFFQkFDM0JFOTA2NTIxOTBCRDYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjJCMTM4REQ5QzA5MTFFQkFDM0JFOTA2NTIxOTBCRDYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjE1NUY2OTBGODJEMzExRUJBRkNGRDU5Rjg3MUU5NUNBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE1NUY2OTEwODJEMzExRUJBRkNGRDU5Rjg3MUU5NUNBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+hXGxWQAAEPVJREFUeNqsWQd0XGV2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
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/limonte-sweetalert2/11.0.1/sweetalert2.all.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/430038/%E6%99%AE%E6%B3%95%E7%BD%91%EF%BC%88%E5%AE%AA%E6%B3%95%E5%B0%8F%E5%8D%AB%E5%A3%AB%EF%BC%89%E8%AF%BE%E5%90%8E%E7%BB%83%E4%B9%A0%E3%80%81%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/430038/%E6%99%AE%E6%B3%95%E7%BD%91%EF%BC%88%E5%AE%AA%E6%B3%95%E5%B0%8F%E5%8D%AB%E5%A3%AB%EF%BC%89%E8%AF%BE%E5%90%8E%E7%BB%83%E4%B9%A0%E3%80%81%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

var _self = unsafeWindow,
    $ = _self.jQuery || top.jQuery,
    Swal = Swal || window.Swal,
    columnId = getQueryVariable("columnId"),
    answer_list = [],
    exam_list = [],
    time = 3e3, // 答题间隔时间，最好为5秒
    save_key = "xfxws2024",
    num = {"A": 1,"B": 2, "C": 3, "D": 4};

(function() {
    // 题目切换其实可以不依靠定时器，不过懒得改了，能用就行。。。
    if (window.location.pathname.indexOf('learn_exam.html') != -1) {
        Swal.fire('宪法小助手提示','点击确定开始考试','info').then(()=>{
            Swal.fire({
                position: 'top-end',
                title: '脚本将在3秒后开始自动作答！',
                showConfirmButton: false,
                timer: 3000
            })
            getExam();
            let t = setInterval( function() {
                doExam(t)
            },time);
        })
    } else if (window.location.pathname.indexOf('learn-practice.html') != -1) {
        Swal.fire('宪法小助手提示','点击确定开始练习,脚本会自动收录本练习题目数据','info').then(()=>{
            getAnswer(columnId);
            let t = setInterval( function() {
                doQuestion(t)
            },time);
        })
    } else if (window.location.pathname.indexOf('learn_practice_list.html') != -1) {
        Swal.fire('宪法小助手提示','<div style="font-size: 13px;">脚本最后更新时间：2024.10.26<br />使用说明：<br /><div><span style="color: red;">1.脚本题库数据托管于本地，请在做综合评价前逐个完成练习，收集答案！！！</span><br />2.脚本运行故障如综合测评无操作等，请使用Edge浏览器+ScriptCat。<br />3.问题联系邮箱nawlgzs@gmail.com<br />4.脚本数据来自本网站后端返回的明文JSON数据包，脚本不涉及任何逆向操作！<br />5.脚本仅供学习交流，请勿用于商业用途，否则后果自负！</div></div>')
    } else if (window.location.pathname.indexOf('evaluation.html') != -1) {
       
    } else {
        console.log(window.location.pathname)
    }
})();

// 解析url参数
function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
};

// 正则匹配
function getStr(str, start, end) {
    let res = str.match(new RegExp(`${start}(.*?)${end}`))
    return res ? res[1] : null
}

// 获取答案
function getAnswer(columnId) {
    $.ajax({
        url: _self.config.practice.host + _self.config.practice.practice + "?columnId="+ columnId + "&taskId=" + _self.config.taskId,
        headers: _self.config.apiConfig.header,
        async: false,
        success: function (res) {
            const { data, status } = res;
            if (status === "0") {
                var questionBankList = data.questionBankList
                answer_list = questionBankList;
                upload(answer_list)
            } else if (status === "1") {
                alert("请先学习当前模块");
                window.history.go(-1);
            } else if (status === "-2") {
                alert("请重新登陆");
            } else {

            }
        },
        error: function (err) {
        }
    });
}

// 答题操作
function doQuestion(t) {
    var cur_topic = $('#currentTopic').text(),
        tol_topic = $('#totalTopic').text(),
        answer = answer_list[cur_topic - 1].answer;
    $('#exam_answer > div:nth-child(' + num[answer] + ')').click();
    if (cur_topic == tol_topic) {
        clearInterval(t);
        setTimeout(function(){Swal.fire('宪法小助手提示','答题完成','info')},time / 2);
    } else{
        setTimeout(function(){$('#next_question').click()},time / 2);
    };
}

// 获取考试题目
function getExam(){
    $.ajax({
        url: _self.config.wexam.host + _self.config.wexam.getPaper + "?taskId=" + _self.config.taskId,
        headers: _self.config.apiConfig.header,
        async: false,
        success: function (res) {
            const { data, status, message } = res;
            if (status === "0") {
                var question_data = res.data;
                var paper = question_data.paper;
                var paperInfo = paper.paperInfo;
                exam_list = paperInfo;
            } else {
                alert('获取考试题目失败！')
            }
        },
        error: function (err) {
        }
    });
}

// 考试答题操作
function doExam(t){
    let db_json = []
    if (GM_getValue(save_key) && JSON.parse(GM_getValue(save_key)).length >= 0) {
        db_json = JSON.parse(GM_getValue(save_key))
    } else {
        $('#ne21ans')[0] ? $('#ne21ans').html('<p style="color: red;">未匹配到答案，请手动作答~</p>') : $('#exam_question').append('<div id="ne21ans"><p style="color: red;">未匹配到答案，请手动作答~</p></div>')
        return
    }

    console.log(JSON.parse(GM_getValue(save_key)))
    $('#ne21ans')[0] ? $('#ne21ans').html('<p style="color: red;">正在搜索答案~</p>') : $('#exam_question').append('<div id="ne21ans"><p style="color: red;">正在搜索答案~</p></div>')

    var cur_topic = $('#currentTopic').text(),
        tol_topic = $('#totalTopic').text(),
        questionInfo = exam_list[cur_topic - 1];


    ans_index = []
    let question = filterStr(questionInfo.content) 
    let ops = questionInfo.answerOptions.split("@!@")
    ops.map((el)=> filterStr(el) )
    for (var i = 0; i < ops.length; i++) {
        hash_tmp = MD555(question+"|"+ops[i])
        db_json.forEach((item)=>{
            if (item.hash == hash_tmp) {
                ans_index.push(i)
            }
        }) 
    }

    if (ans_index.length == 0) {
        $('#ne21ans')[0] ? $('#ne21ans').html('<p style="color: red;">无题库数据，请先收集答案或自己作答~</p>') : $('#exam_question').append('<div id="ne21ans"><p style="color: red;">无题库数据，请先收集答案或自己作答~</p></div>')
        return
    }

    ans_index.forEach((item1)=>{
        $('#ne21ans').html('<p style="color: red;">参考答案：'+ ops[item1] + '</p>')
        $('#exam_answer > div:nth-child(' + (item1+1) + ')').click();  
    })

    if (cur_topic == tol_topic) {
         clearInterval(t);
         setTimeout(function(){Swal.fire('宪法小助手提示','答题完成,请自己点击交卷！','info')},time / 2);
    } else{
         setTimeout(function(){$('#next_question').click()},time / 2);
    };

}

function upload(question_data) {
    let db_json = []
    if (GM_getValue(save_key) && JSON.parse(GM_getValue(save_key)).length >= 0) {
        db_json = JSON.parse(GM_getValue(save_key))
    }
    question_data.forEach((item)=>{
        let question = filterStr(item.content)
        let ans_index = []
        item.answer.split().forEach(((item1)=>{
            let index_tmp = "ABCDEFG".indexOf(item1)
            ans_index.push(index_tmp)
        }))
        let ans_ops = item.answerOptions.split("@!@")
        ans_ops.map((el)=> filterStr(el) )
        ans_index.forEach((item3)=>{
            db_json.push({
                "hash":MD555(question+"|"+ans_ops[item3]), 
                "question": question, 
                "answer": ans_ops[item3]
                })
        })
    })

    let dbJson = uniqueByField(db_json,"hash")
    GM_setValue(save_key,JSON.stringify(dbJson))
    // console.log(JSON.parse(GM_getValue(save_key)))
}

function MD555(str) {
    return CryptoJS.MD5(str).toString()
}

// 重复数据过滤
function uniqueByField(array, field) {
    const seen = new Set();
    return array.filter((item) => {
        const key = item[field];
        return seen.has(key) ? false : seen.add(key);
    });
}

// 去除字符串中的空格、换行、制表符
function filterStr(str){
   return str.replace(/[\r\n\s<br>]/g, "").trim()
}
