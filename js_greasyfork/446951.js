// ==UserScript==
// @name         吉时学试卷
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  查答案
// @author       Gy
// @match        *://elearning.geely.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446951/%E5%90%89%E6%97%B6%E5%AD%A6%E8%AF%95%E5%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/446951/%E5%90%89%E6%97%B6%E5%AD%A6%E8%AF%95%E5%8D%B7.meta.js
// ==/UserScript==
// update： 2022 09 21 16 17
(function () {
    'use strict';
    var GyLearn = {
        isLoading: false,
        hasPermissions: false,
        global: {
            window: null,
        },
        // 获取url查询字符串值
        getSearchString: function (url, key) {
            // 获取URL中?之后的字符
            var str = url.split("?")[1];

            // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
            var arr = str.split('&')
            var obj = new Object()

            // 将每一个数组元素以=分隔并赋给obj对象
            for (var i = 0; i < arr.length; i++) {
                var tmp_arr = arr[i].split('=')
                obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1])
            }
            return obj[key]
        },
        // 展示一个弹窗
        showOnNewWindow: function (inner) {
            var box = document.createElement("div");
            box.style = "overflow:hidden;transition:300ms;right:0;top:5%;width:500px;height:95%;padding:10px;background:#fff;border:1px solid #f00;position:fixed;z-index:99999999999;display:flex;flex-direction:column;align-items:center;"
            var button = document.createElement("button");
            button.innerHTML = "关闭";
            button.style = "margin:0 20px"
            button.onclick = function () {
                box.remove();
                document.documentElement.removeAttribute("hasWindowInExam")
            }
            var button2 = document.createElement("button");
            button2.innerHTML = "收缩";
            button2.onclick = function () { box.style = "overflow:hidden;transition:300ms;right:0;top:5%;width:500px;height:40px;padding:10px;background:#fff;border:1px solid #f00;position:fixed;z-index:99999999999;display:flex;flex-direction:column;align-items:center;" }
            var button3 = document.createElement("button");
            button3.innerHTML = "展开";
            button3.onclick = function () { box.style = "overflow:hidden;transition:300ms;right:0;top:5%;width:500px;height:95%;padding:10px;background:#fff;border:1px solid #f00;position:fixed;z-index:99999999999;display:flex;flex-direction:column;align-items:center;" }
            var div = document.createElement("div");
            var btnGroup = document.createElement("div");
            btnGroup.append(button);
            btnGroup.append(button2);
            btnGroup.append(button3);
            box.append(btnGroup);
            div.style = "overflow-y:auto;height:100%;width:100%;";
            box.append(div);
            div.appendChild(inner);
            document.body.appendChild(box);
            GyLearn.global.window = box;

        },
        // 使用管理员权限
        getPermissions: function () {
            GyLearn.hasPermissions = true;
            fetch("https://elearning.geely.com/platform/switch-tenant/9999", {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0",
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
                    "X-Requested-With": "XMLHttpRequest",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin"
                },
                "referrer": "https://elearning.geely.com/",
                "method": "POST",
                "mode": "cors"
            }).then(res => {
                var curTime = new Date().getTime();
                fetch("https://elearning.geely.com/gke/user/Tenant/switch?saasTenantId=9999&tenantId=2028215768118723593&_=" + curTime, {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0",
                        "Accept": "application/json, text/javascript, */*; q=0.01",
                        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
                        "X-Requested-With": "XMLHttpRequest",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin"
                    },
                    "referrer": "https://elearning.geely.com/",
                    "method": "GET",
                    "mode": "cors"
                });
                console.log("GyLearn:获取权限成功");
            })

        },
        // 
        // 创建一个btn
        buildBtn(str) {
            var btn = document.createElement("button");
            btn.style = "position:absolute;left:0;top:0;z-index:999;border:1px solid red;background:rgba(230,230,230,0.7);"
            btn.innerText = str;
            return btn;
        },
        // 获取试卷Id
        getPaperId(examId) {
            GyLearn.isLoading = true;
            var curTime = new Date().getTime();
            return new Promise((ok, fail) => {
                fetch(`https://elearning.geely.com/gke/user/exam/info?id=${examId}&_=${curTime}`, {
                    "headers": {
                        "accept": "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                        "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest",
                        "cookie": "_gscu_684401847=51135392ffyrub14; __clickidc=165113539318672300; sensorsdata2015jssdkcross=%7B%22%24device_id%22%3A%2218073072c70dfe-037485dbe03eaa-b7a1a38-1821369-18073072c71e98%22%7D; SESSION_GKE=870c8341-1a2f-4b0d-a06c-f421df4e636f; logintime=1652834776365"
                    },
                    "referrer": "https://elearning.geely.com/",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": null,
                    "method": "GET",
                    "mode": "cors"
                }).then((res) => res.json()).then(res => {
                    GyLearn.isLoading = false;
                    if (res.code == "success") {
                        ok(res.data.exam);
                    } else {
                        fail(res.message);
                    }
                }).catch(err => {
                    GyLearn.isLoading = false;
                    console.log("获取试卷Id（PaperId）失败", err);
                    fail("获取试卷Id（PaperId）失败")
                })
            })
        },
        // 使用题库id获取所有题
        useBankIdGetAnswer(bankId) {
            GyLearn.isLoading = true;
            var curTime = new Date().getTime();
            return new Promise((ok, fail) => {
                fetch(`https://elearning.geely.com/gke/exam/question/list?bankId=${bankId}&pageSize=1000&pageNum=1&_=${curTime}`, {
                    "headers": {
                        "accept": "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Microsoft Edge\";v=\"101\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest",
                        "cookie": "SESSION_GKE=a2a2a759-1d8e-4d75-b0e9-c5f8902f8f33; logintime=1652834138559",
                        "Referer": "https://elearning.geely.com/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": null,
                    "method": "GET"
                }).then(res => res.json()).then(res => {
                    GyLearn.isLoading = false;
                    if (res.code == "success") {
                        ok(res.data.items);
                    } else {
                        fail(res.message);
                    }
                }).catch(err => {
                    GyLearn.isLoading = false;
                    console.log('用bankId获取所有题目失败', err);
                    fail('用bankId获取所有题目失败');
                })
            });
        },
        // 使用试卷id获取答案
        usePaperIdGetAnswer(paperId) {
            GyLearn.isLoading = true;
            var curTime = new Date().getTime();
            return new Promise((ok, fail) => {
                fetch(`https://elearning.geely.com/gke/exam/paper/?paperId=${paperId}&_=${curTime}`, {
                    "headers": {
                        "accept": "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Microsoft Edge\";v=\"101\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest",
                        "cookie": "SESSION_GKE=a2a2a759-1d8e-4d75-b0e9-c5f8902f8f33; logintime=1652834138559",
                        "Referer": "https://elearning.geely.com/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": null,
                    "method": "GET"
                }).then(res => res.json()).then(res => {
                    GyLearn.isLoading = false;
                    if (res.code == "success") {
                        if (res.data.hasOwnProperty('questions')) {
                            ok(res.data.questions);
                        } else if (res.data.hasOwnProperty('questionBanks')) {
                            var banks = res.data.questionBanks;
                            var promiseList = banks.map((item) => {
                                return GyLearn.useBankIdGetAnswer(item.bankId);
                            })
                            Promise.all(promiseList).then(res => {
                                var questions = [];
                                res.forEach(item => {
                                    questions = questions.concat(item);
                                })
                                ok(questions);
                            })
                        } else {
                            fail('没有题，也没有题库');
                        }
                    } else {
                        fail(res.message);
                    }
                    // ok(res);
                }).catch(err => {
                    GyLearn.isLoading = false;
                    console.log("获取试卷答案失败", err);
                    fail("获取试卷答案失败")
                })
            })
        },
        // 使用考试Id获取答案并展开窗口
        useExamIdFindAnswerAndRanderWindow(examId, btn = null) {
            GyLearn.getPaperId(examId).then(exam => {
                // exam.paperId
                // console.log(exam);
                var examName = exam.examName;
                GyLearn.usePaperIdGetAnswer(exam.paperId).then(answareList => {
                    GyLearn.isLoading = false;
                    if (btn)
                        btn.innerText = "完成";
                    console.log(answareList);

                    var htmls = `<h3>${examName}</h3>`;
                    answareList.forEach(qusitem => {
                        var answareEls = ""
                        if (qusitem.questionType == 1) {
                            // if (qusitem.questiondetail && qusitem.questiondetail.length > 0)
                            //     var itemAnswers = qusitem.questiondetail.split("%s");
                            // else
                            var itemAnswers = ['对', '错']
                            itemAnswers.forEach((ansItem, ind) => {
                                answareEls += `<span style="color:${qusitem.answer == (ind + 1).toString() ? 'red' : 'black'}">${ansItem}</span>`;
                            })
                        } else if (qusitem.questionType == 2 || qusitem.questionType == 3) {
                            var itemAnswers = qusitem.questiondetail.split("%s");
                            var words = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
                            itemAnswers.forEach((ansItem, ind) => {
                                answareEls += `<span style="color:${qusitem.answer.indexOf(words[ind]) !== -1 ? 'red' : 'black'}">${words[ind]} ${ansItem}</span><br/>`;
                            })
                        } else {
                            answareEls += `<span style="color:black">${qusitem.answer}</span><br/>`;
                        }
                        htmls += `<p style="margin-bottom:5px;color:#333;">题目：${qusitem.question}</p>答案：${qusitem.answer}<br/>${answareEls}<br><br>`;
                    })
                    var allHtml = `<!DOCTYPE html> <html lang="zh-cn"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>${examName}</title> </head> <body>` +
                        htmls + `</body> </html>`;
                    var textarea = document.createElement('textarea');
                    textarea.style.width = "300px";
                    textarea.style.height = "200px";
                    textarea.innerText = allHtml;

                    var div = document.createElement('div');
                    div.innerHTML = htmls;
                    div.prepend(textarea);


                    // var autoBtn = document.createElement("button");
                    // autoBtn.innerText = "自动答题";
                    // autoBtn.addEventListener("click", () => {
                    //     if (window.location.href.indexOf('onexam') !== -1 || window.location.href.indexOf('examview') !== -1) {
                    //         var inputs = document.querySelectorAll("input");
                    //         // 清除所有选中项
                    //         for (let inputItem = 0; inputItem < inputs.length; inputItem++) {
                    //             const element = inputs[inputItem];
                    //             element.checked = false;
                    //             element.removeAttribute("checked");
                    //         }
                    //         var allExamItem = document.querySelectorAll('.exam-item');
                    //         for (let examInd = 0; examInd < allExamItem.length; examInd++) {
                    //             const examItem = allExamItem[examInd];
                    //             var question = examItem.querySelector("table tbody > tr.text-bold > td:nth-child(1)");
                    //             // var ansElement = examItem.querySelector(" table  tbody > tr.text-bold + tr:nth-child(2)");
                    //             var ansElement = examItem.querySelector(" table  tbody > tr.text-bold + tr:nth-child(2) .exam-question-detail");
                    //             // console.log(ansElement);
                    //             var anss = examItem.querySelectorAll(".mr12>label");
                    //             var questionText = question.innerText.slice(3)
                    //             if (window.location.href.indexOf('examview') !== -1) {
                    //                 questionText = question.innerText.slice(3, question.innerText.length - 7);
                    //             }
                    //             // 数据中的文字空格在html中只保留一个 所以需要去除中间的空格
                    //             var ansElementText = ansElement.innerText.replace(/[\s*|A-Z|、|参考答案：|答案解析：]/g, "");
                    //             var answerItem = answareList.find((item) => {
                    //                 var questionOk = item.question.replace(/\s*/g, "").indexOf(questionText.replace(/\s*/g, "")) !== -1;
                    //                 var percent = GyLearn.strSimilarity2Percent(ansElementText,item.questiondetail.replace(/[\s*|%s]/g, ""))
                    //                 // if(item.question.replace(/\s*/g, "").indexOf('张某参加职业健康体检，公司可要求其自己承担体检费用'.replace(/\s*/g, "")) !== -1){
                    //                 //     console.log(ansElementText,item.questiondetail.replace(/[\s*|%s]/g, ""),percent);
                    //                 // }
                    //                 return questionOk && percent >= 0.8;
                    //             })
                    //             console.log("xxxxxxxxxxxxx",GyLearn.strSimilarity2Percent(ansElementText,answerItem.questiondetail.replace(/[\s*|%s]/g,"")),ansElementText, answerItem.questiondetail.replace(/[\s*|%s]/g,""));
                    //             // console.log(questionText, answerItem, anss)
                    //             if (answerItem == null) {
                    //                 continue;
                    //             }
                    //             var answer = answerItem.answer;
                    //             var questionType = answerItem.questionType;
                    //             if (questionType == 1) {
                    //                 // console.log(questionText, answerItem, anss)
                    //                 anss[answer - 1].click();
                    //             } else if (
                    //                 questionType == 2 || questionType == 3
                    //             ) {
                    //                 var words = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
                    //                 words.forEach((item, ind) => {
                    //                     if (answer.indexOf(item) !== -1) {
                    //                         anss[ind].click();
                    //                     }
                    //                 })
                    //             }
                    //         }
                    //     }
                    // })
                    // div.prepend(autoBtn);

                    var eleLink = document.createElement('a');
                    eleLink.download = examName + '.html';
                    var blob = new Blob([allHtml]);
                    eleLink.href =  URL.createObjectURL(blob);
                    eleLink.innerHTML = '下载';
                    eleLink.style="display:block;border:1px solid #f00;"

                    div.prepend(eleLink);

                    GyLearn.showOnNewWindow(div);
                }).catch(err => {
                    if (btn)
                        btn.innerText = "失败";
                    GyLearn.isLoading = false;
                    console.log(err);
                })
            }).catch(err => {
                if (btn)
                    btn.innerText = "失败";
                GyLearn.isLoading = false;
                console.log(err);
            })
        },
        strSimilarity2Number: function (s, t) {
            var n = s.length, m = t.length, d = [];
            var i, j, s_i, t_j, cost;
            if (n == 0) return m;
            if (m == 0) return n;
            for (i = 0; i <= n; i++) {
                d[i] = [];
                d[i][0] = i;
            }
            for (j = 0; j <= m; j++) {
                d[0][j] = j;
            }
            for (i = 1; i <= n; i++) {
                s_i = s.charAt(i - 1);
                for (j = 1; j <= m; j++) {
                    t_j = t.charAt(j - 1);
                    if (s_i == t_j) {
                        cost = 0;
                    } else {
                        cost = 1;
                    }
                    d[i][j] = this.Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
                }
            }
            return d[n][m];
        },
        //两个字符串的相似程度，并返回相似度百分比
        strSimilarity2Percent: function (s, t) {
            var l = s.length > t.length ? s.length : t.length;
            var d = this.strSimilarity2Number(s, t);
            return (1 - d / l).toFixed(4);
        },
        Minimum: function (a, b, c) {
            return a < b ? (a < c ? a : c) : (b < c ? b : c);
        },
        // 发送请求获取答案(按钮回调)
        getAnswerHandle(e) {
            if (GyLearn.isLoading === true) return;
            var btn = e.target;
            btn.innerText = "加载中...";
            GyLearn.isLoading = true;
            var examId = btn.getAttribute("examId");
            GyLearn.useExamIdFindAnswerAndRanderWindow(examId, btn);
        },
        //查找所有考试并创建按钮
        renderBtns() {
            // var exams = document.querySelectorAll('#user-center-exam-2 > div.exam-type.exam-type-2 > ul > li > table > tbody  td.singleLineName');
            var exams = document.querySelectorAll('div.exam-type table > tbody  td.singleLineName');
            for (let elInd = 0; elInd < exams.length; elInd++) {
                const examItem = exams[elInd];
                var parentEl = examItem.parentElement;
                examItem.style = "position:relative";
                var nextTr = parentEl.nextElementSibling;
                var hrefA = nextTr != null ? nextTr.querySelector('a[href]') : undefined;
                var hrefStart = examItem.parentElement.querySelector('a[href]');
                if ((hrefA != undefined && hrefA.innerText.indexOf("开始补考") !== -1) || (hrefStart != undefined && hrefStart.innerText.indexOf('开始考试') !== -1 && hrefStart.getAttribute('href').length > 33)) {
                    if (!examItem.hasAttribute('hasBtn')) {
                        var hrefEl = hrefA ? hrefA : hrefStart;
                        var lookBtn = this.buildBtn('答案')
                        examItem.prepend(lookBtn)
                        examItem.setAttribute("hasBtn", '');
                        var hrefTxt = hrefEl.getAttribute('href');
                        // console.log(examId);
                        var ids = hrefTxt.split("/");
                        var examId = ids[ids.length - 1];
                        lookBtn.setAttribute("examId", examId);
                        lookBtn.addEventListener("click", GyLearn.getAnswerHandle);
                        // console.log(hrefEl.innerText, examId);
                    }
                } else if (hrefStart != undefined && hrefStart.innerText.indexOf('开始考试') !== -1 && hrefStart.getAttribute('href').length <= 33) {
                    var list = document.querySelector('#userCenterExam > div > ul.nav');
                    if (!list.hasAttribute("hasBtn")) {
                        var lookBtn = this.buildBtn('公开考试点击开始考试后弹窗中点击取消，然后在待考试中即可以查看答案');
                        lookBtn.style.position = "relative"
                        list.setAttribute("hasBtn", "");
                        list.appendChild(lookBtn);
                    }
                }


            }
        },
        // 初始化
        init: function () {
            console.log("开始脚本")
            setInterval(function () {
                var url = window.location.href;
                if (url.indexOf('login') !== -1) return;
                if (GyLearn.hasPermissions === false)
                    GyLearn.getPermissions();
                var hrefTxt = window.location.href;
                if (document.documentElement.hasAttribute("hasWindowInExam") && (hrefTxt.indexOf("examview") == -1 && hrefTxt.indexOf("onexam") == -1)) {
                    GyLearn.global.window.remove();
                    GyLearn.global.window = null;
                    document.documentElement.removeAttribute("hasWindowInExam")
                }
                if (hrefTxt.indexOf("examview") !== -1 || hrefTxt.indexOf("onexam") !== -1) {
                    if (document.documentElement.hasAttribute("hasWindowInExam")) return;
                    var ids = hrefTxt.split("/");
                    var examId = ids[ids.length - 1];
                    document.documentElement.setAttribute("hasWindowInExam", "")
                    GyLearn.useExamIdFindAnswerAndRanderWindow(examId);
                }
                GyLearn.renderBtns();
            }, 1000);
        },
    }
    GyLearn.init();
    window.Gy = GyLearn;
    // Your code here...
})();