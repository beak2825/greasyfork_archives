// ==UserScript==
// @name         	icve-helper
// @namespace    	2196760287@qq.com
// @version      	1.0.0
// @description  	icve-funs
// @author       	AI_童话
// @grant           GM_xmlhttpRequest
// ==/UserScript==

// ========================================================router.js=================================================
let _apiserver = 'https://zjy2.icve.com.cn/api'
let _config = {
    study: _apiserver + '/study/',
    com: _apiserver + '/common/',
    student: _apiserver + '/student/'
}

let _securityOrigin = 'https://security.zjy2.icve.com.cn/api'
let _securityConfig = {
    study: _securityOrigin + '/study/'
}
let urls = {
    login: _config.study + 'login/login',
    myHomework_getMyHomeworkList: _config.student + 'myHomework/getMyHomeworkList',
    homework_detail: _securityConfig.study + '/homework/detail',
    homework_history: _securityConfig.study + 'homework/history'
};
// ========================================================router.js=================================================


// ========================================================class.js==================================================
/** 学生类
 * @class Student
 */
class Student {
    constructor(userName, userPwd) {
        this.userName = userName;
        this.userPwd = userPwd;
    }

    /** 学生登录
     *  @method login
     *  @returns 登录成功信息
     */
    login() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: urls.login,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data: 'userName=' + this.userName +
                    '&userPwd=' + this.userPwd +
                    '&verifyCode=' + ''
                ,
                timeout: setting.time,
                onload: xhr => {
                    if (xhr.status == 200) {
                        let obj = JSON.parse(xhr.responseText);
                        resolve(obj);
                    }
                }
            });
        });
    }

    /** 获取我的作业列表
     * @method getMyHomeworkList
     * @param {boolean} unprocessed 是否未完成 0 已完成 1未完成
     * @return 作业列表
     */
    getMyHomeworkList(unprocessed) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: urls.myHomework_getMyHomeworkList,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: 'unprocessed=' + unprocessed || 0,
                timeout: setting.timeout,
                onload: xhr => {
                    if (xhr.status == 200) {
                        var obj = JSON.parse(xhr.responseText);
                        this.hmwrkList = obj.list;				// list
                        resolve(this.hmwrkList);
                    }
                }
            });
        });
    }

    // 不写了  累
    getDetail(hmwrk) {
        if (hmwrk instanceof HomeWork) {

        }
    }

    getHistory(hmwrk) {
        if (hmwrk instanceof HomeWork) {

        }
    }
}

// 我 是 学生
class I extends Student {
    constructor(userName, userPwd) {
        super(userName, userPwd);
    }

    /** 获取我的作业信息
     * @method getPerivewInfo
     * @return 我的作业对象
     */
    getPerivewInfo() {
        let courseOpenId = $('[name=courseOpenId]')[0].value;
        let openClassId = $('[name=openClassId]')[0].value;
        let homeWorkId = $('[name=homeworkId]')[0].value;
        let hkTermTimeId = ($('[name=hkTermTimeId]')[0] || $('[name=homeworkTermTimeId]')[0]).value;
        this.hmwrk = new HomeWork(courseOpenId, openClassId, homeWorkId, hkTermTimeId);		// 获取我的作业信息
        return this.hmwrk;
    }

    copy(hmwrk) {
        if (!(hmwrk instanceof HomeWork)) {
            return '不是作业没办法复制呢!';
        }
        fillAnswer(hmwrk.history);
    }
}

// 我朋友 是 学生
class MyFriend extends Student {
    constructor(userName, userPwd) {
        super(userName, userPwd);
    }

    // 我的朋友帮助我
    async helpWith(hmwrk) {
        if (!(hmwrk instanceof HomeWork)) {							           // 如果是 HomeWork
            return '数据类型错误!';									            // 传过来的不是作业
        }

        console.log('我朋友的作业列表: ');
        console.log(await this.getMyHomeworkList());                            // 获取我的作业列表 hmwrkList

        let isfndCourse = false;									            // 是否找到课程
        for (let i = 0; i < this.hmwrkList.length; i++) {
            let hk = this.hmwrkList[i];
            if (hk.courseOpenId == hmwrk.courseOpenId) {
                isfndCourse = true;									            // 找到相应课程
                this.hmwrkList = hk.homeworkList;					            // 根据courseOpenId 获取 homeworkList
                break;
            }
        }

        if (!isfndCourse) {											            // 如果找到相应 课程
            return '你们没有报名相同的课程.';
        }

        let isfndHmwrk = false;										            // 是否找该作业
        for (let i = 0; i < this.hmwrkList.length; i++) {
            let hk = this.hmwrkList[i];
            if (hk.homeworkId == hmwrk.homeWorkId) {
                isfndHmwrk = true;
                if (!hk.stuHomeworkCount) return '该学生还未做答!';		        // 如果作答次数为0, 直接返回

                // 朋友的作业
                this.hmwrk = new HomeWork(hk.courseOpenId, hk.openClassId, hk.homeWorkId,
                    hk.hkTermTimeId)
                    ;

                this.hmwrk.info = hk;									// 朋友作业的官方信息
                await this.hmwrk.getDetail();							// 朋友获取作业的详细
                console.log(await this.hmwrk.getHistory());				// 朋友获取作答记录
                return '成功获取朋友的作业.';
            }
        }

        return '你的朋友没有这个作业!';
    }
}

// 作业
class HomeWork {
    constructor(courseOpenId, openClassId, homeWorkId, hkTermTimeId) {
        this.courseOpenId = courseOpenId;
        this.openClassId = openClassId;
        this.homeWorkId = homeWorkId;			// 作业id
        this.hkTermTimeId = hkTermTimeId;
    }

    /** 获取该作业的详细信息
     *  @method getDetail
     *  @return this.detail
     */
    getDetail() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: urls.homework_detail,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: 'courseOpenId=' + this.info.courseOpenId +
                    '&openClassId=' + this.info.openClassId +
                    '&homeworkId=' + this.info.homeworkId +
                    '&hkTermTimeId=' + this.info.hkTermTimeId
                // '&dtype=1&viewType=2&unprocessed=0'
                ,
                timeout: setting.time,
                onload: xhr => {
                    if (xhr.status == 200) {
                        this.detail = JSON.parse(xhr.responseText);
                        resolve(this.detail);
                    }
                }
            });
        })

    }

    /** 根据 stuHomeworkId 获取 批过的试卷
     *  @method getHistory
     *  @return this.history
     */
    getHistory() {
        return new Promise((resolve, reject) => {
            let index = this.detail.homeworkStulist.length - 1;		// 最后一次提交

            GM_xmlhttpRequest({
                method: 'POST',
                url: urls.homework_history,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: 'courseOpenId=' + this.detail.courseOpenId +
                    '&homeWorkId=' + this.detail.homeworkId +
                    '&studentWorkId=' + this.detail.homeworkStulist[index].Id
                ,
                timeout: setting.time,
                onload: xhr => {
                    if (xhr.status == 200) {
                        this.history = JSON.parse(xhr.responseText);
                        resolve(this.history);      // history object
                    }
                }
            });
        })
    }
}

// ========================================================class.js==================================================


// ========================================================handler.js================================================
/** 向控制台输出 hello world!
 * @method hello
 */
function hello() {
    console.log("hello world");
}

/** 获取网站的jQuery, 并添加自己的函数
 * @method getjQuery
 * @param window unsafewindow
 * @returns $
 */
function getjQuery(window) {

    /** 等待元素出现
     *  @method wait
     *  @param func 找到元素后执行
     *  @param times 检测次数 -1 一直检测
     *  @param interval 检测间隔 默认20s
     */
    window.jQuery.fn.wait = function (func, times, interval) {
        var _times = times || -1, // 100次
            _interval = interval || 20, // 20毫秒每次
            _self = this,
            _selector = this.selector, // 选择器
            _iIntervalID; // 定时器id
        if (this.length) { // 如果已经获取到了，就直接执行函数
            func && func.call(this);
        } else {
            _iIntervalID = setInterval(function () {
                if (!_times) { // 是0就退出
                    clearInterval(_iIntervalID);
                }
                _times <= 0 || _times--; // 如果是正数就 --

                _self = $(_selector); // 再次选择
                if (_self.length) { // 判断是否取到
                    func && func.call(_self);
                    clearInterval(_iIntervalID);
                }
            }, _interval);
        }
    }

    return window.jQuery;
}

/* 
* 职教云作业解封文本限制 @tuChanged
*/
function uncageCopyLimit() {
    let arr = ["oncontextmenu", "ondragstart", "onselectstart", "onselect", "oncopy", "onbeforecopy"]
    for (let i of arr)
        $(".hasNoLeft").attr(i, "return true")
    console.log("已成功复制解除限制,📣如果您有软件定制(管理系统,APP,小程序等),毕设困扰,又或者课程设计困扰等欢迎联系,价格从优,源码调试成功再付款💰,实力保证,包远程,包讲解 QQ:2622321887")
}

function num2zimu(t) {
    return new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-')[t];
}


function _get_tamplate(asw) {
    let s = ''
    for (let i = 0; i < asw.length; i++) {
        if (i > 0) {
            s += ', ';
        }
        s += num2zimu(asw[i]);
    }

    return document.createTextNode('搬运答案: ' + s);
}

/** 自动填写答案
 * @method fillAnswer
 * @param {HomeWork.history} history 作业记录
 */
function fillAnswer(history) {
    console.log("开始填写答案!");
    let questions = history.questions;
    let questbodys = $('.e-q-body');     // 题目div数组

    //  遍历 questions 数组 根据questionTitle找到questionBody 之后  判断字符串  点击
    for (let i = 0; i < questions.length; i++) {
        let q = questions[i];
        let qt = q.questionType;

        // 分步乘法计数原理  遍历 Body
        for (let j = 0; j < questbodys.length; j++) {
            let qbody = questbodys[j];

            if (qbody.getAttribute('data-questionid') == q.questionId) {      	// 对比 quesiotnId
                if (qt <= 3)						                        	// 单选、多选、判断
                {
                    let asw = q.Answer;
                    let stuAsw = q.studentAnswer.split(',');
                    asw = asw || stuAsw;
                    let optli = qbody.getElementsByTagName('li');     	        // 获取选项

                    if (qt == 1 || qt == 2) {		                        	// 单选题 或者 多选题
                        let aswli = q.answerList;

                        // 遍历 答案列表
                        for (let k = 0; k < asw.length; k++) {
                            let aswCntnt = aswli[asw[k]].Content;
                            for (let l = 0; l < optli.length; l++) {
                                let dstryTtlBtn = optli[l].getElementsByTagName('div')[0];
                                // console.log('html: ' + dstryTtlBtn.innerText);
                                // console.log('数据答案: ' + aswCntnt);
                                // if (aswCntnt.indexOf(dstryTtlBtn.innerText) !== -1) {		// destoryTitleButton
                                if (zyxformat(aswCntnt) == zyxformat(dstryTtlBtn.innerText)) {
                                    optli[l].style.color = 'green';
                                    optli[l].click();
                                }
                                else {
                                    if (optli[l].style.color != 'green') {
                                        optli[l].style.color = 'red';
                                    }
                                }
                            }
                        }
                    }
                    else if (qt == 3) {                                         // 判断题
                        for (let k = 0; k < asw.length; k++)			        // 判断题 相反
                        {
                            optli[asw[k]].style.color = 'red';
                            optli[asw[k] ^ 1].style.color = 'green';
                            optli[asw[k] ^ 1].click();
                        }
                    }
                    // 加入答案面板
                    qbody.appendChild(_get_tamplate(asw));
                }
                // <!-- 8：阅读理解 9：完形填空 11：视听题 -->
                else if (questions[i].questionType == 8 || questions[i].questionType == 9 || questions[i].questionType == 11) {												// 完型填空
                    console.log(history);
                    let subQuestions = history.subQuestions;					// 数据
                    let forms = Array.from(questbodys[j].getElementsByTagName('form'));		// 实体
                    console.log(forms);

                    subQuestions[Id].forEach(subQuestion => {
                        // let qid = subQuestion.Id;      			// question Id
                        // let qttl = subQuestion.title;          	// question Title
                        // let qt = subQuestion.subQuestionType;   // question type
                        // let asw = subQuestion.questionAnswer;	// answer array
                        // let aswli = subQuestion.subAnswerList;  // anserList array
                        // let stuasw = subQuestion.studentAnswer;	//

                        forms.forEach(f => {
                            if (f.querySelector('[name=subQuestionId]').value == subQuestion.Id) {
                                if (subQuestion.subQuestionType == 1 || subQuestion.subQuestionType == 2) {
                                    // (subQuestion.questionAnswer || subQuestion.studentAnswer).forEach(answer => {
                                    let as = subQuestion.questionAnswer || subQuestion.studentAnswer;
                                    console.log('sub答案: ' + as);
                                    Array.from(f.getElementsByTagName('li')).forEach(opt => {
                                        console.log(opt.getElementsByClassName('destroyTitleButton')[0].innerText);
                                        console.log(subQuestion.subAnswerList[as].Content);
                                        if (opt.getElementsByClassName('destroyTitleButton')[0].innerText == subQuestion.subAnswerList[as].Content) {
                                            opt.style.color = 'green';
                                            opt.click();
                                        } else {
                                            opt.style.color = 'red';
                                        }
                                    });
                                    // });
                                }
                                else {
                                    Array.from(f.getElementsByTagName('li')).forEach(opt => {
                                        if (opt.getAttribute('data-index') == subQuestion.questionAnswer || subQuestion.studentAnswer) {
                                            opt.style.color = 'green';
                                            opt.click();
                                        } else {
                                            opt.style.color = 'red';
                                        }
                                    });
                                }
                            }
                        });
                    });
                }
            }
        }
        // else if (qt == 6)													// 问答题
        // {
        // 	var txa = questbodys[i].getElementsByTagName('textarea')[0];
        // 	(function (qid, txa, a, i) {
        // 		setTimeout(function () {
        // 			txa.value = a[0];
        // 			GM_xmlhttpRequest({
        // 				method: 'POST',
        // 				url: onlineHomeworkAnswer,
        // 				headers: {
        // 					'Content-type': 'application/x-www-form-urlencoded'
        // 				},
        // 				data: 'studentWorkId=' + qid +
        // 					'&answer=' + a[0]
        // 				,
        // 				timeout: 5E3,
        // 				onload: function (xhr) {
        // 					if (xhr.status == 200) {
        // 						var obj = JSON.parse(xhr.responseText);
        // 						if (obj.code) {
        // 							console.log('ok');
        // 						}
        // 					}
        // 				}
        // 			});
        // 		}, (i + 1) * 1000);
        // 	})(qid, txa, asw, i);
        // }
    }
}

// @感谢中国大学mooc网课助手作者 democrazy 的字符串处理
let zyxtrim = function (str) { return str.replace(/\s+/g, ""); };   // 修剪
let zyxformat = function (str) {            // format
    let htmlDecode = function (_str) {
        var s = "";
        if (_str.length == 0) return "";
        s = _str.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/&amp;/g, "&");
        return s;
    }
    var regx = /<[img ]{3,}[\S]+?[https]{3,4}:\/\/([\S]+?\.[pngjeifbm]{3,4})[\S]+?>/gi;
    var regx2 = /\<[\S ]+?\>/ig;
    return zyxtrim(htmlDecode(str)).replace(regx, "$1").replace(regx2, "");
}
// ========================================================handler.js================================================

