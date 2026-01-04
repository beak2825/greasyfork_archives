// ==UserScript==
// @name        宪法小卫士办公自动化(批量导入、课后练习、考试自动答题)
// @namespace   http://tampermonkey.net/
// @match       *://static.qspfw.moe.gov.cn/*
// @version     2023.10
// @author      Hzane
// @description 宪法卫士辅助工具，减轻班主任负担,个个100分
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @icon         https://img.alicdn.com/tfs/TB13RHdl8r0gK0jSZFnXXbRRXXa-32-32.png
// @require      https://update.greasyfork.org/scripts/499192/1402326/jquery_360.js
// @require      https://greasyfork.org/scripts/444783-xlsx-full-min/code/xlsxfullmin.js?version=1048986
// @require      https://greasyfork.org/scripts/444781-import-file/code/import_file.js?version=1052250
// @downloadURL https://update.greasyfork.org/scripts/499193/%E5%AE%AA%E6%B3%95%E5%B0%8F%E5%8D%AB%E5%A3%AB%E5%8A%9E%E5%85%AC%E8%87%AA%E5%8A%A8%E5%8C%96%28%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E3%80%81%E8%AF%BE%E5%90%8E%E7%BB%83%E4%B9%A0%E3%80%81%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499193/%E5%AE%AA%E6%B3%95%E5%B0%8F%E5%8D%AB%E5%A3%AB%E5%8A%9E%E5%85%AC%E8%87%AA%E5%8A%A8%E5%8C%96%28%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E3%80%81%E8%AF%BE%E5%90%8E%E7%BB%83%E4%B9%A0%E3%80%81%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%29.meta.js
// ==/UserScript==


var study_css = ".file {position: relative;display: inline-block;background: #D0EEFF;border: 1px solid #99D3F5;border-radius: 4px;padding: 4px 5px;overflow: hidden;color: #1E88C7;text-decoration: none;text-indent: 0;line-height: 20px;right: -5px;top: -5px;}.file:hover {background: #AADFFD;border-color: #78C3F3;color: #004974;text-decoration: none;}.file input {position: absolute;font-size: 100px;right: 0;top: 0;opacity: 0;line-height: 100%;text-align: center}.btn {position: relative;display: inline-block;background: #D0EEFF;border: 1px solid #99D3F5;border-radius: 4px;padding: 4px 5px;overflow: hidden;color: #1E88C7;text-decoration: none;text-indent: 0;line-height: 5px;right: -5px;top: -5px;}.btn:hover {background: #AADFFD;border-color: #78C3F3;color: #004974;text-decoration: none;}.egg_study_btn{outline:0;border:0;position:fixed;top:5px;left:5px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_manual_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#e3484b;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_auto_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#666777;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_setting_box{position:fixed;top:70px;left:5px;padding:12px 20px;border-radius:10px;background-color:#fff;box-shadow:0 0 9px #666777}.egg_setting_item{margin-top:5px;height:30px;width:140px;font-size:14px;display:flex;justify-items:center;justify-content:space-between}input[type='checkbox'].egg_setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color .3s,background-color .3s}input[type='checkbox'].egg_setting_switch::after{content:'';display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:.4s;top:3px;position:absolute;left:3px}input[type='checkbox'].egg_setting_switch:checked{background:#fd5052}input[type='checkbox'].egg_setting_switch:checked::after{content:'';position:absolute;left:55%;top:3px}";
GM_addStyle(study_css);

var    $ = unsafeWindow.jQuery || top.jQuery; // 将全局变量jQuery赋值给$变量，如果jQuery不存在，则将top.jQuery赋值给$变量
var    Swal = Swal || window.Swal; // 将全局变量Swal赋值给Swal变量，如果Swal不存在，则将window.Swal赋值给Swal变量
var    columnId = getQueryVariable("columnId"); // 调用getQueryVariable函数获取URL参数columnId的值，并将其赋值给columnId变量
var    answer_list = []; // 创建一个空数组answer_list
var    exam_list = []; // 创建一个空数组exam_list
var    time = 2e3; // 设置答题间隔时间为5秒（5e3表示5乘以10的3次方，即5000）
var    num = {"A": 1,"B": 2, "C": 3, "D": 4}; // 创建一个对象num，包含键值对，A对应1，B对应2，C对应3，D对应4

var ZHtemp = '';
var MMtemp = '';
var XMtemp = '';
var jsonData;
var len;
var xhlen = 0;

(function () {
    // 如果当前页面是考试页面
    if (window.location.pathname.indexOf('learn_exam.html') != -1) {
        // 获取考试题目
        getExam();

        // 设置定时器，每隔一段时间执行一次自动答题
        let t = setInterval(function () {
            doExam(t);
        }, time / 2);
    }

    // 如果当前页面是课后练习页面
    else if (window.location.pathname.indexOf('learn-practice.html') != -1) {
        // 在一段时间后执行以下代码块
        setTimeout(function () {
            // 如果页面中包含标题为"课后练习"的元素
            if ($(".inside-pages-title:contains('课后练习')") != null) {
                // 获取题目的答案
                getAnswer(columnId);

                // 设置定时器，每隔一段时间执行一次自动答题
                let t = setInterval(function () {
                    doQuestion(t);
                }, time / 2);
            }
        }, time / 2);
    }

    // 如果当前页面是课后练习列表页面
    else if (window.location.pathname.indexOf('learn_practice_list.html') != -1) {
        // 在一段时间后触发页面中的类名为"red"的元素的点击事件
        setTimeout(function () {
            $(".red").click();
        }, time / 2);
    }

    // 如果当前页面是用户页面
    else if (window.location.pathname.indexOf('/user/') != -1) {
      let ready = setInterval(function () {
            //if (document.getElementsByClassName("text-wrap")[0]) {
            if (document.getElementsByClassName("logo-div")[0]) {
                clearInterval(ready);//停止定时器

                    var button = document.querySelector("#formLogin > div:nth-child(8) > div > div > span > div > label > span.ant-radio > input");
                    if (button && !button.checked) {
                        button.click();
                    }


                //初始化设置
                initSetting();
                //创建"开始学习"按钮
                createStartButton();
                drzh();
                var saveSettingbtn = document.querySelector("#saveSetting");
                //添加事件监听
                try {// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
                    saveSettingbtn.addEventListener("click", saveSetting, false);
                } catch (e) {
                    try {// IE8.0及其以下版本
                        saveSettingbtn.attachEvent('onclick', saveSetting);
                    } catch (e) {// 早期浏览器
                        console.log("不学习何以青骄error: 开始学习按钮绑定事件失败")
                    }
                };

                //判断完成情况
                if (GM_getValue('pdshifouwancheng') == "1") {
                    let startButton = document.getElementById("startButton");
                    startButton.innerText = "正在操作";
                    startButton.style.cursor = "default";
                    startButton.setAttribute("disabled", true);
                    let timer = setInterval(() => {//等待弹出账号密码元素加载完，才执行点击按钮
                        let ZZinput = document.querySelector("#formLogin_loginInfo");//点击账号框
                        let MMinput = document.querySelector("#formLogin_password");//点击密码框
                        let XMinput = document.querySelector("#formLogin_userName");//点击姓名框
                        let TY_button = document.querySelector("#formLogin > div:nth-child(8) > div > div > span > div > label > span.ant-radio > input");//点击已阅读按钮
                        if (TY_button) {
                            clearInterval(timer);//停止定时器
                            ZZinput.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                            MMinput.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                            XMinput.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                            //TY_button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                        }

                    }, 100);
                };
            };
        }, 800);
        // 在一段时间后执行以下代码块
        setTimeout(function () {
            // 设置定时器，每隔一段时间执行一次内部的函数
            setInterval(function () {
                // 查找页面中包含文本为"开始学习"的按钮元素
                var stu = document.querySelector("#app > div > section > section > main > div > div > div > div.act-top > div.act-top-right > button > span");

                // 如果找到了"开始学习"按钮
                if (stu != null) {
                    // 触发"开始学习"按钮的点击事件
                    stu.click();
                }
            }, time / 2);



        }, time / 2);

    }

    // 如果当前页面是课程学习页面
    else if (window.location.pathname.indexOf('learning-page.html') != -1) {
        // 在一段时间后执行以下代码块
        setTimeout(function () {
            // 如果页面中包含标题为"课程学习"的元素
            if ($(".inside-pages-title:contains('课程学习')") != null) {
                // 触发id为"afterClassPractice"的元素的点击事件
                $("#afterClassPractice").click();
            }
        }, time / 2);
    }

    // 如果当前页面是评估页面
    else if (window.location.pathname.indexOf('evaluation.html') != -1) {
        // 将当前页面的URL重定向到指定的URL
        //window.location.href = "https://static.qspfw.moe.gov.cn/user/#/user/login?redirect=%2Factivity";
    }
})();



function getQueryVariable(variable) { // 定义一个名为getQueryVariable的函数，接受一个参数variable
    var query = window.location.search.substring(1); // 获取URL中的查询字符串，去掉开头的问号
    var vars = query.split("&"); // 将查询字符串按照"&"分割成一个数组
    for (var i=0;i<vars.length;i++) { // 遍历数组中的每一项
            var pair = vars[i].split("="); // 将每一项按照"="分割成一个键值对
            if(pair[0] == variable){return pair[1];} // 如果键等于传入的参数variable，则返回对应的值
    }
    return(false); // 如果没有找到对应的键值对，则返回false
};


function getAnswer(columnId) { // 定义一个名为getAnswer的函数，接受一个参数columnId
    //console.log("host"+unsafeWindow.config.practice.host);
  //console.log("practice"+unsafeWindow.config.practice.practice);
  //console.log("taskId"+unsafeWindow.config.taskId);
    //console.log(unsafeWindow.config.practice.host + unsafeWindow.config.practice.practice + "?columnId="+ columnId + "&taskId=" + unsafeWindow.config.taskId);
  //console.log(unsafeWindow.config.apiConfig.header);
    $.ajax({ // 使用jQuery的ajax方法发送异步请求
        url: unsafeWindow.config.practice.host + unsafeWindow.config.practice.practice + "?columnId="+ columnId + "&taskId=" + unsafeWindow.config.taskId, // 设置请求的URL，包括columnId和taskId参数
        headers: unsafeWindow.config.apiConfig.header, // 设置请求的头部信息
        async: false, // 设置请求为同步请求，即在请求完成之前阻塞代码的执行
        success: function (res) { // 请求成功时的回调函数，接收一个参数res表示响应数据
            const { data, status } = res; // 从响应数据中解构出data和status字段
            if (status === "0") { // 如果status等于"0"
                var question_data = res.data; // 将响应数据中的data字段赋值给question_data变量
                var questionBankList = data.questionBankList; // 将data字段中的questionBankList赋值给questionBankList变量
                answer_list = questionBankList; // 将questionBankList赋值给answer_list变量
                // 从localStorage中获取已经缓存的答案数组，如果没有则使用一个空数组
                var cached_answers = JSON.parse(localStorage.getItem("answers")) || [];
                // 遍历每个答案，检查是否已经存在相同id属性的答案
                for (var i = 0; i < answer_list.length; i++) {
                    var answer = answer_list[i]; // 获取当前答案
                    // 使用find方法或some方法来检查缓存数组中是否已经存在相同id属性的答案
                    var found_answer = cached_answers.some(function(cached_answer) {
                        return cached_answer.answerOptions == answer.answerOptions;
                    });
                    // 如果不存在相同id属性的答案，将它追加到缓存数组中
                    if (!found_answer) {
                        cached_answers.push(answer);
                    }
                }
                // 将更新后的缓存数组重新保存到localStorage中
                localStorage.setItem("answers", JSON.stringify(cached_answers));
            } else if (status === "1") { // 如果status等于"1"
                alert("请先学习当前模块"); // 弹出提示框，提示用户先学习当前模块
                window.history.go(-1); // 返回上一页
            } else if (status === "-2") { // 如果status等于"-2"
                alert("请重新登陆"); // 弹出提示框，提示用户重新登录
            } else { // 其他情况

            }
        },
        error: function (err) { // 请求失败时的回调函数，接收一个参数err表示错误信息

        }
    });
}


// 答题操作
function doQuestion(t) {
    // 获取当前题目的序号和总题目数
    var cur_topic = $('#currentTopic').text(),
        tol_topic = $('#totalTopic').text();

    // 根据当前题目的序号从答案数组中获取答案信息
    var answer = answer_list[cur_topic - 1].answer;

    // 根据答案信息选择对应的答案选项
    $('#exam_answer > div:nth-child(' + num[answer] + ')').click();

    if (cur_topic == tol_topic) {
        // 如果当前题目是最后一题，清除Interval的定时器
        clearInterval(t);

        // 根据页面中的元素显示不同的提示信息
        if ($("#next_exam").css("display")  != 'none') {
            // 如果显示的是"下一套试卷"按钮，则调用nextExam函数
            nextExam();
        } else {
            // 如果显示的是"返回综合评价"按钮，则调用toEvaluation函数
            toEvaluation();
        }
    } else{
        // 如果当前题目不是最后一题，延迟一段时间后点击"下一题"按钮
        setTimeout(function(){$('#next_question').click()},time / 5);
    };
}


// 获取考试题目
function getExam(){
    // 发送一个AJAX请求
    $.ajax({
        // 请求的目标地址
        url: unsafeWindow.config.wexam.host + unsafeWindow.config.wexam.getPaper + "?taskId=" + unsafeWindow.config.taskId,
        // 请求头配置
        headers: unsafeWindow.config.apiConfig.header,
        // 是否异步，默认为true
        async: false,
        // 请求成功的回调函数
        success: function (res) {
            // 从响应对象中获取data、status和message属性
            const { data, status, message } = res;
            // 判断status属性的值是否为"0"
            if (status === "0") {
                // 从响应数据中获取question_data、paper和paperInfo属性
                var question_data = res.data;
                var paper = question_data.paper;
                var paperInfo = paper.paperInfo;
                // 将paperInfo赋值给exam_list变量
                exam_list = paperInfo;
            } else {
                // 弹出提示框，显示获取考试题目失败的消息
                alert('获取考试题目失败！')
            }
        },
        // 请求失败的回调函数
        error: function (err) {
        }
    });
}


// 考试答题操作
function doExam(t) {
    // 检查页面中是否已存在id为ne21ans的元素，如果存在则显示正在搜索答案的提示，否则在exam_question元素下添加一个id为ne21ans的元素并显示正在搜索答案的提示
    $('#ne21ans')[0] ? $('#ne21ans').html('<p style="color: red;">正在搜索答案~</p>') : $('#exam_question').append('<div id="ne21ans"><p style="color: red;">正在搜索答案~</p></div>')

    // 获取当前题目的序号和总题目数
    var cur_topic = $('#currentTopic').text(),
        tol_topic = $('#totalTopic').text();

    // 根据当前题目的序号从题目数组中获取题目信息
    var questionInfo = exam_list[cur_topic - 1];

    // 从localStorage中获取已经缓存的答案数组，如果没有则使用一个空数组
    var cached_answers = JSON.parse(localStorage.getItem("answers")) || [];

    // 从缓存数组中查找与题目id相同的答案
    var cached_answer = cached_answers.find(function(answer) {
        // 使用正则表达式去除答案和题目内容中的空格后进行比较
        return answer.answerOptions.replace(/\s+/g, '') == questionInfo.answerOptions.replace(/\s+/g, '');
    });

    if (cached_answer) {
        // 如果找到了匹配的答案，直接显示并选择
        $('#ne21ans').html('<p style="color: red;">参考答案：'+ cached_answer.answer + '</p>')
        $('#exam_answer > div:nth-child(' + num[cached_answer.answer] + ')').click();
    } else {
        // 如果没有找到匹配的答案，提示用户自己作答或者使用其他方法获取答案
        $('#ne21ans').html('<p style="color: red;">没有找到该题目的答案，请自己作答或者尝试刷新页面</p>')
    }

    if (cur_topic == tol_topic) {
        // 清除Interval的定时器
        clearInterval(t);
        saveResult();
        // 延迟一段时间后点击"返回综合评价"按钮
        setTimeout(function(){$("button:contains('返回综合评价')").click();},time / 2);
    } else {
        // 延迟一段时间后点击"下一题"按钮
        setTimeout(function(){$('#next_question').click()},time / 5);
    };
}


//初始化配置
function initSetting() {
    try {
        let settingTemp = JSON.parse(GM_getValue('studySetting'));
        if (settingTemp != null) {
            settings = settingTemp;
        } else {
            settings = [true, true, true, true, true, true, true, false];
        }
    } catch (e) {
        //没有则直接初始化
        settings = [true, true, true, true, true, true, true, false];
    }
};

//创建“开始学习”按钮和配置
function createStartButton() {
    let base = document.createElement("div");
  let baseInfo = `
    <form id="settingData" class="egg_menu" action="" target="_blank" onsubmit="return false">
        <div class="egg_setting_box">
            <div class="egg_setting_item">
                <label><B>①</B>下载模板</label>
                <button class="btn" id="DL_btn" name="0">点击下载</button>
                <a href="" download="账号密码模板.xlsx" id="hf"></a>
            </div>
            <div class="egg_setting_item">
                <label><B>②</B>导入账号</label>
                <a href="javascript:;" class="file">选择文件<input type="file" id="DR_btn" name="1" /></a>
            </div>
            <hr />
            <div title="Tip:开始学习后，隐藏相关页面和提示（不隐藏答题中的关闭自动答题按钮）" class="egg_setting_item">
                <label>运行隐藏</label>
                <input class="egg_setting_switch" type="checkbox" name="7" ${settings[7] ? 'checked' : ''} />
            </div>
            <div id="saveSetting" style="color:#d90609;border: solid 2px;justify-content: center;align-items: center;border-radius: 20px;cursor: pointer;margin: 12px 0;font-size:14px;" class="egg_setting_item">
                <label style="cursor: pointer;">保存配置</label>
            </div>
            <a style="text-decoration: none;" title="使用说明" target="blank" href="https://docs.qq.com/document/DWHNzQUpSZERNaURC">
                <div style="color:#5F5F5F;font-size:14px;" class="egg_setting_item">
                    <label style="cursor: pointer;">Tips:使用说明</label>
                </div>
            </a>
        </div>
    </form>
`;
  base.innerHTML = baseInfo;
    let body = document.getElementsByTagName("body")[0];//getElementsByTagName() 方法可返回带有指定标签名的对象的集合
    body.append(base)//append() 方法在被选元素的结尾（仍然在内部）插入指定内容//将建立的div块插入到body后面
    let startButton = document.createElement("button");//在div块中加载一个按钮
    startButton.setAttribute("id", "startButton");//setAttribute() 方法添加指定的属性，并为其赋指定的值
    startButton.innerText = "开始学习";
    startButton.className = "egg_study_btn egg_menu";
    //添加事件监听
    try {// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        startButton.addEventListener("click", start, false);
    } catch (e) {
        try {// IE8.0及其以下版本
            startButton.attachEvent('onclick', start);
        } catch (e) {// 早期浏览器
            console.log("宪法小卫士提醒error: 开始学习按钮绑定事件失败")
        }
    }
    //插入节点
    body.append(startButton)
    DL_btn.addEventListener("click", function () { downloadExl() }, false);
    DR_btn.addEventListener('change', function () { importFile(this) }, false);

}

//点击账号登录
function drzh() {
    jsonData = JSON.parse(GM_getValue('zhPass'));
    len = jsonData.length;
    console.log(jsonData);
    var localUrl = window.location.href;
    if (localUrl == "https://static.qspfw.moe.gov.cn/user/#/user/login"|| "https://static.qspfw.moe.gov.cn/user/#/user/login?redirect=%2Factivity") {
        function writeZH() {
            //document.getElementById('account').setAttribute('value', ZHtemp);
            //document.getElementById('account').value = ZHtemp;
            var nameInput = document.querySelector("#formLogin_loginInfo");

            changeInputData(nameInput, ZHtemp);// 用户名输入框赋值

            console.log(ZHtemp);

        }
        function writeMM() {
            console.log(MMtemp);
            //document.getElementById('password').setAttribute('value', MMtemp);
            //document.getElementById('password').value = MMtemp;
            var pwdInput = document.querySelector("#formLogin_password");
            changeInputData(pwdInput, MMtemp);// 密码输入框赋值
        }
        function writeXM() {
            console.log(XMtemp);
            //document.getElementById('password').setAttribute('value', MMtemp);
            //document.getElementById('password').value = MMtemp;
            var pwdInput = document.querySelector("#formLogin_userName");
            changeInputData(pwdInput, XMtemp);// 姓名输入框赋值
        }
        function ddyzm() {
            var verificationInput = document.querySelector("#formLogin_captcha");
            var confirmButton = document.querySelector("#formLogin > div:nth-child(9) > div > div > span > button")

            verificationInput.addEventListener("input", function () {
                if (verificationInput.value.length === 5) {
                    confirmButton.click();
                }
            });

        };
        for (var i = 0; i < len; i++) {

            if (!jsonData[i]['成绩'] || jsonData[i]['成绩'] == ' ') {
                ZHtemp = jsonData[i]['账号'];
                //console.log("账号"+jsonData[i]['账号']);
                MMtemp = jsonData[i]['密码'];
                XMtemp = jsonData[i]['姓名'];
                xhlen = i;
                break;

            }
        }

        if (i == len) { // 如果所有学生都已完成知识竞赛，则执行以下代码块
            alert("所有账号已操作完毕！"); // 弹出提示框，提示所有学生已完成知识竞赛
            //pdshifouwancheng = "2";
            GM_setValue('pdshifouwancheng', '2');
            GM_deleteValue("zhPass"); // 删除名为 'zhPass' 的本地存储
        } else if (0 < i < len) {
            //pdshifouwancheng = "1";
            GM_setValue('pdshifouwancheng', '1');
        };

        document.onclick = function () {
            if (event.srcElement.getAttribute('id') == 'formLogin_loginInfo') {
                writeZH();

            }
            else if (event.srcElement.getAttribute('id') == 'formLogin_password') {
                writeMM();

            }
            else if (event.srcElement.getAttribute('id') == 'formLogin_userName') {
                writeXM();
            } else if (event.srcElement.getAttribute('type') == 'submit') {
                ddyzm()
                for (var i = 0; i < len; i++) {
                    if (jsonData[i]['账号'] == ZHtemp) {
                        jsonData[i]['成绩'] = '100';
                        GM_setValue('zhPass', JSON.stringify(jsonData));


                    }
                }

            }

        }
    }
}

//显示提示
function showTip(title, type = "success", time = 1000) {
    let tipBox = document.createElement("div");
    let baseInfo = "";
    if (type == null) {
        type = "success";
    }
    baseInfo += "<div class='egg_tip egg_tip_" + type + "'>" + title + "</div>";
    tipBox.innerHTML = baseInfo;
    let body = document.getElementsByTagName("body")[0];
    body.append(tipBox);
    if (time == null) {
        time = 1000;
    }
    //经过一定时间后，取消显示提示
    setTimeout(function () {
        tipBox.remove();
    }, time);
}



//保存配置
function saveSetting() {
    let form = document.getElementById("settingData");
    let formData = new FormData(form);
    settings[0] = (formData.get('0') != null);//下载模板
    settings[1] = (formData.get('1') != null);//导入账号
    settings[2] = (formData.get('2') != null);//激活账号
    settings[3] = (formData.get('3') != null);//视频+习题
    settings[4] = (formData.get('4') != null);//竞赛答题
    settings[7] = (formData.get('7') != null);//运行时是否要隐藏
    console.log("保存配置")
    GM_setValue('studySetting', JSON.stringify(settings));
    showTip("保存成功");
}

//是否显示目录
function showMenu(isShow = true) {
    let items = document.getElementsByClassName("egg_menu");
    for (let i = 0; i < items.length; i++) {
        items[i].style.display = isShow ? "block" : "none";
    }
}


async function start() {
    //保存配置
    console.log("初始化...")
    saveSetting();
    if (GM_getValue('zhPass')) {
        GM_setValue('pdshifouwancheng', '1');
        let startButton = document.getElementById("startButton");
        startButton.innerText = "正在学习";
        startButton.style.cursor = "default";
        startButton.setAttribute("disabled", true);
        if (settings[7]) {
            showMenu(false);
        }

        let timer = setInterval(() => {//等待弹出账号密码元素加载完，才执行点击按钮
            let ZZinput = document.querySelector("#formLogin_loginInfo");//点击账号框
            let MMinput = document.querySelector("#formLogin_password");//点击密码框
            let XMinput = document.querySelector("#formLogin_userName");//点击姓名框
            let TY_button = document.querySelector("#formLogin > div:nth-child(8) > div > div > span > div > label > span.ant-radio > input");//点击已阅读按钮
            if (TY_button) {
                clearInterval(timer);//停止定时器
                ZZinput.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                MMinput.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                XMinput.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                //TY_button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
            }

        }, 100);

        if (pdshifouwancheng == "2") {
            console.log("已完成");
            startButton.innerText = "已完成";
            startButton.style.color = "#c7c7c7";
            if (settings[7]) {
                showMenu();
            }
        };
    } else {
        //提醒导入账号
        alert("请先导入账号");
    };
    return false;//终止事件函数
};


//模拟手动输入账号密码
function changeInputData(el, value) {
    let copySetValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    copySetValue.call(el, value);
    let e = new Event('input', { bubbles: true });
    el.dispatchEvent(e);
};
