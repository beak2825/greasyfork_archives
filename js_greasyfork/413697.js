// ==UserScript==
// @name         武汉理工大成教作业辅助工具
// @namespace    http://wljy.whut.edu.cn/
// @version      0.1.1
// @description  一键挂课时、做选择题
// @author       You
// @match        http://wljy.whut.edu.cn/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413697/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E6%88%90%E6%95%99%E4%BD%9C%E4%B8%9A%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/413697/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E6%88%90%E6%95%99%E4%BD%9C%E4%B8%9A%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var WljyCrack = {
        exerciseAnswer: {},
        createBox() {
            var zhouBox = document.createElement("div");
            zhouBox.id = "zhouBox";
            zhouBox.innerHTML = "<div style='width:40%;height:70px;background-color:#FFF;border:1px solid #000;text-align: center'>" +
                "<button id='addCourseTime' type='button' class='btn btn-success btn-sm'>挂课时</button>" +
                "<form class='form-inline' style='display: flex'>" +
                "<div class='form-group' style='width: 50%'><input type='text' id='randomStart' class='form-control' style='width: 100%' placeholder='随机时长起始(分钟)'></div>" +
                "<div class='form-group' style='width: 50%'><input type='text' id='randomEnd' class='form-control' style='width: 100%' placeholder='随机时长结束(分钟)'></div>" +
                "</form></div>" +
                "<div style='width:20%;height:70px;background-color:#FFF;border:1px solid #000;text-align: center'>" +
                "<button id='fillAnswer' type='button' class='btn btn-success btn-sm'>一键答题</button>" +
                "</div>" +
                "<div style='width:40%;height:70px;background-color:#FFF;border:1px solid #000;text-align: center'>" +
                "<p><button id='examAnswer' type='button' class='btn btn-success btn-sm' data-toggle='modal' data-target='#dialogmodal'>获取答案</button></p>" +
                "<p><select id='queSelect'></select></p>" +
                "</div>";
            zhouBox.style.display = "none";
            zhouBox.style.width = "600px";
            zhouBox.style.height = "70px";
            zhouBox.style.position = "fixed";
            zhouBox.style.top = 0;
            zhouBox.style.left = 0;
            zhouBox.style.right = 0;
            zhouBox.style.marginLeft = "auto";
            zhouBox.style.marginRight = "auto";
            zhouBox.style.zIndex = 99999999999;
            zhouBox.style.backgroundColor = "white";
            // zhouBox.style.opacity = 0.3;
            document.getElementsByTagName("body")[0].appendChild(zhouBox);
        },
        addCourseTime() {
            var _tbody = document.getElementById("maintable").lastElementChild;
            if (_tbody.tagName.toLowerCase() == 'tbody' && _tbody.childElementCount != 0) {
                var trNum = _tbody.childElementCount;
                var randomStart = document.getElementById('randomStart').value * 60;
                var randomEnd = document.getElementById('randomEnd').value * 60;
                if (randomStart == '' || randomEnd == '') {
                    alert('请输入随机时长起始点和结束点');
                    return false;
                }
                for (var i=0;i<trNum;i++) {  // 循环tr
                    if (_tbody.children[i] == undefined) {
                        continue;
                    }
                    var studystate = _tbody.children[i].children[6];  // 学习时长列
                    if (_tbody.children[i].children[7].childElementCount != 0) { // 课程资源列
                        var courResFunc = _tbody.children[i].children[7].children[0].getAttribute('onclick');
                        if (courResFunc.indexOf('learnCourse') != -1) {
                            var courNo = courResFunc.match(/\d+/g)[0]; // 第一个参数: 课程编号
                            var isValid = courResFunc.match(/\d+/g)[1]; // 第二个参数：课程是否可学习: 1可学习 0不可学习
                            if (isValid != 0) {
                                var finalearnTime = this.getRandom(randomStart, randomEnd, 6);
                                web.ajax(basePath+"edu/eduStuCourse/saveCourseLearnTime.ajax",{userid:userId,courlibNo:courNo,learnTime:finalearnTime},true,function(r){
                                    if(r.state == 0){
                                        console.log("学习时间："+finalearnTime +r.msgInfo);
                                    } else {
                                        console.log("学习时间："+finalearnTime +r.msgInfo);
                                        return;
                                    }
                                });
                            }
                        }
                    }
                }
                $("#curriculum").delay(100).trigger("click");
            }
        },
        fillExperiseAnswer() {
            var self = this;
            // 当前url: http://wljy.whut.edu.cn/web/exercise.htm?stuId=190380214100138&instNo=3005795&limitTime=100
            web.ajax(basePath + '/exam/paperInstance/showExerciseQuestions.ajax', {
                userid:userId,instNo:instNo,type:1
            }, true, function(r) {
                var allAnswer = {};
                if (r.flag == 0) { // 0 失败 1 成功  99 练习已提交
                    $('#shijuanmodal').modal('hide');
                    messageDialogShow("提示", r.msgInfo);
                    return;
                } else {
                    var letterToNum = {'A':0,'B':1,'C':2,'D':3,'E':4,'F':5};
                    if ('' != r.paperName) {
                        for (let key1 in r.paperDetail) {
                            let bigQues = r.paperDetail[key1];  // 大题
                            let queType = bigQues.queType;   // 题目类型：1单选 3多选 4判断 9填空 12简答 13问答
                            for (let key2 in bigQues.questionList) {
                                let correctAnswer = bigQues.questionList[key2].correctAnswer;  // 正确答案
                                let rnT = bigQues.questionList[key2].rn;   // 题目序号
                                // console.log(rnT);
                                // console.log(correctAnswer);
                                self.exerciseAnswer[rnT] = correctAnswer;
                                if (queType == 1 || queType == 3 || queType == 4) {
                                    correctAnswer = correctAnswer.split(';');
                                    // console.log(correctAnswer);
                                    for (let index in correctAnswer) {
                                        let letter = correctAnswer[index];
                                        // console.log(letter);
                                        let corrNum = letterToNum[letter];
                                        // console.log(corrNum);
                                        // console.log($('#Q_' + rnT).children("div:last-child").children('label').eq(corrNum));
                                        $('#Q_' + rnT).children("div:last-child").children('label').eq(corrNum).children('input').delay('slow').trigger("click");
                                    }
                                }
                            }
                        }
                    }
                }
            });
        },
        getExamAnswer($index) { // 考试科目序号 从0开始
            var _table = document.getElementsByClassName('table-bordered');
            if (_table.length == 0) {
                alert('考试科目为空(table不存在)！！');
                return false;
            }
            var _tbody = _table[0].lastElementChild;
            if (_tbody.tagName.toLowerCase() != 'tbody' || _tbody.childElementCount == 0) {
                alert('考试科目为空(tbody不存在或为空)！！');
                return false;
            }
            var startExamBt = _tbody.children[$index].children[5].children[0];  // 开始考试按钮
            if (startExamBt === undefined) {
                alert('选中的科目不能考试！！');
                return false;
            }
            var courResFunc = startExamBt.getAttribute('onclick');
            if (courResFunc.indexOf('startMyWzExam') == -1 && courResFunc.indexOf('continueMyWzExam') == -1) {
                alert('开始考试按钮调用方法不存在！！');
                return false;
            }
            var courNo = courResFunc.match(/\d+/g)[0]; // 第一个参数: 课程编号
            var epepNo = courResFunc.match(/\d+/g)[1];
            // 生成考试试题
            self = this;
            web.ajax(basePath + '/exam/paperInstance/startCourseWzExam.ajax',
                {userid:userId, courNo:courNo, epepNo:epepNo}, true, function(r) {
                    if (r.state == -1) {
                        alert(r.msgInfo);
                        return false;
                    } else {
                        self.requestAnswer(r.value);
                    }
                });
        },
        requestAnswer(instNo) {
            // 获取考试答案
            var queAnswer = '';  // 答案
            web.ajax(basePath + '/exam/paperInstance/showWzExamQuestions.ajax',
                {userid:userId, instNo:instNo}, true, function (r) {
                    if (r.instState != "00") {
                        alert(r.msgInfo);
                        return false;
                    } else {
                        for (let key1 in r.paperDetail) {
                            let bigQues = r.paperDetail[key1];  // 大题
                            // let queType = bigQues.queType;   // 题目类型：1单选 3多选 4判断 9填空 17计算
                            queAnswer += bigQues.title + '<br>';
                            for (let key2 in bigQues.questionList) {
                                if (key2 > 0 && key2 % 5 == 0) {  // 每5题换行
                                    queAnswer += '<br>'
                                }
                                let subQue = bigQues.questionList[key2]; // 小题
                                let correctAnswer = subQue.correctAnswer;  // 正确答案
                                let rnT = subQue.rn;   // 题目序号
                                if (bigQues.titleName == '简答' || bigQues.titleName == '问答' || bigQues.titleName == '计算') {    // 简答
                                    queAnswer += subQue.queContent + '<br>' + subQue.correctAnswer + '<br>';
                                } else if (bigQues.titleName == '辨析') {
                                    queAnswer += `${subQue.seqNo}、<br>${subQue.correctAnswer}<br>`;
                                } else if(bigQues.titleName == '论述') {
                                    queAnswer += subQue.queContent.replace('/\.\.\//g', basePath) + '<br>' + subQue.correctAnswer + '<br>' + subQue.userNote;
                                } else {
                                    queAnswer += subQue.subQueContent + subQue.correctAnswer + '\xa0';
                                }
                            }
                            queAnswer += '<br>';
                        }
                        document.getElementById('dialogmodalcontent').innerHTML = queAnswer;
                    }
                });
        },
        getRandom(start, end, fixed = 0) { // 随机数  fixed 保留小数位
            let differ = end - start
            let random = Math.random()
            return (start + differ * random).toFixed(fixed)
        },
        init() {
            self = this;
            if (window.frames.length == parent.frames.length) {
                self.createBox();
            }
            let _pathname = location.pathname;
            if (_pathname == "/web/admissionprocess.htm") {
                document.getElementById("addCourseTime").onclick = function () {
                    var myCourse = document.getElementById("curriculum").getAttribute('class');
                    if (myCourse != "chosen") {
                        alert("当前页面不是我的课程页面！！");
                        return false;
                    }
                    self.addCourseTime();
                };

                // 获取考试题目，拼接option
                var optHtml = '';
                document.getElementById('myTest').addEventListener('click', function () {
                    setTimeout(function() {
                        var _table = document.getElementsByClassName('table-bordered');
                        var _tbody = _table[0].lastElementChild;
                        var optCnt = document.getElementById('queSelect').childElementCount;
                        if (_table.length > 0 && _tbody.childElementCount > 0 && optCnt == 0) {
                            var trLen = _tbody.children.length;
                            // console.log(_tbody.children);
                            for (let i = 0; i < trLen; i++) {
                                var courName = _tbody.children[i].children[1].innerText;  // 课程名称
                                // console.log(courName);
                                optHtml += "<option value='" + i + "'>" + courName + "</option>"
                            }
                            document.getElementById('queSelect').innerHTML = optHtml;
                        }
                    }, 2000);
                });

                // 获取答案按钮绑定事件
                document.getElementById('examAnswer').onclick = function () {
                    if (document.getElementById('myTest').getAttribute('class') != 'chosen') {
                        alert('当前页面不是我的考试页面，请切换到我的考试页面再操作！');
                        return false;
                    }
                    var courIndex = document.getElementById('queSelect').value;
                    self.getExamAnswer(courIndex);
                };

                let leftMenu = document.querySelectorAll('ul.submenu>li');
                let bindIds = ['curriculum', 'myTest'];
                for (let i in leftMenu) {
                    if (leftMenu[i].id === undefined) {continue};
                    if (bindIds.indexOf(leftMenu[i].id) != -1 ) {
                        document.getElementById(leftMenu[i].id).onclick = function () {
                            document.getElementById('zhouBox').style.display = 'flex';
                        }
                    } else {
                        document.getElementById(leftMenu[i].id).onclick = function () {
                            document.getElementById('zhouBox').style.display = 'none';
                        }
                    }
                }
            }
            if (_pathname == "/web/exercise.htm") {
                document.getElementById('zhouBox').style.display = 'flex';
                document.getElementById("fillAnswer").onclick = function () {
                    self.fillExperiseAnswer();
                };
            }
        }
    };
    WljyCrack.init();
})();