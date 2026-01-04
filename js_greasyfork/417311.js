// ==UserScript==
// @name         中国大学生在线助手
// @version      0.1
// @description  目前可以自动完成四史活动，这是包含题库的版本
// @author       Bunny_i
// @match        http://ssxx.univs.cn/*
// @match        https://ssxx.univs.cn/*
// @require      https://cdn.jsdelivr.net/npm/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @namespace    Bunny_i
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/417311/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%E7%94%9F%E5%9C%A8%E7%BA%BF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/417311/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%E7%94%9F%E5%9C%A8%E7%BA%BF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var target = []
// true为开启循环作答，会自动开始，结束了自动点返回. false则为关
var loop = true
if (IsPC()) {
    // [移动端]  4 英雄篇 5 复兴篇 6 创新篇 7 信念篇 11限时赛 12抢时赛
    target = [4, 5, 6, 7]
    // 临时
    //target = [4]
} else {
    // [移动端]  2 英雄篇 3 复兴篇 4 创新篇 5 信念篇 9限时赛 10抢时赛
    target = [2, 3, 4, 5]
    // 临时
    //target = [2]
}


let answer = []
let question_data = {}

ah.proxy({
    //请求发起前进入
    onRequest: async (config, handler) => {
        if (config.url.indexOf('/cgi-bin/race/answer/') > -1) {
            let body = JSON.parse(config.body)
            if (answer.length > 0) {
                body.answer = answer
                question_data.answer = answer
                config.body = JSON.stringify(body)
            }
        }
        handler.next(config)
    },

    //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
    onError: (err, handler) => {
        // alert('出现错误，网路问题，可能是大学生在线网站挂了，也可能是题库挂了')
        console.log('出现错误，网路问题，可能是大学生在线网站挂了，也可能是题库挂了')
        console.log(err)
        handler.next(handler)
    },

    //请求成功后进入
    onResponse: async (response, handler) => {
        try {
            // 接收到题目信息
            if (response.config.url.indexOf('/cgi-bin/race/question/') > -1) {
                // 解析JSON
                let body = JSON.parse(response.response)
                // 提取JSON.data数据
                question_data = body.data
                // POST服务器接口,获取答案
                let cloud_answer = (await axios.post('http://192.168.31.10/get_answer',
                    { title: question_data.title, options: question_data.options }
                )).data

                // 判断接口服务器反馈
                if (cloud_answer.ok) {
                    // 如果状态为ok,则填写答案信息
                    answer = cloud_answer.data.answer
                } else answer = []
                if (cloud_answer.msg)
                    alert(cloud_answer.msg)
            }

            // 题目提交后的信息,包括题目答案
            if (response.config.url.indexOf('/cgi-bin/race/answer/') > -1) {
                // 解析JSON
                let body = JSON.parse(response.response)
                // 将答案赋值question_data.answer当中
                question_data.answer = body.data.correct_ids
                // 判断之前是否从题库获得答案,如果没有,则提交数据给服务器
                if (answer.length == 0)
                    (await axios.post('http://192.168.31.10/post_answer', question_data))

            }

        } catch (error) {
            // 异常控制台输出
            console.error(error)
        }
        handler.next(response)
    }
})


setInterval(() => {
    // 试卷已经提交的按钮
    if (document.getElementsByClassName("el-button").length > 0)
        document.getElementsByClassName("el-button")[0].click()

    // 单选按钮
    if (document.getElementsByClassName('el-radio__original').length > 0)
        document.getElementsByClassName('el-radio__original')[0].click()

    // 多选按钮
    if (document.getElementsByClassName('el-checkbox__original').length > 0) {
        document.getElementsByClassName('el-checkbox__original')[0].click() // [0][1][2][3]分别代表 ABCD选项 单选项同理
    }
    // 验证码
    if (document.getElementsByClassName('el-input__inner').length > 0 && document.getElementsByClassName('el-dialog__wrapper').length > 0 && document.getElementsByClassName('el-dialog__wrapper')[0].getAttribute('style').indexOf('none') == -1) {
        document.getElementsByClassName('el-input__inner')[0].value = '0000'
        document.getElementsByClassName('el-input__inner')[0].dispatchEvent(new Event('input'))
        // PC端验证码确认按钮
        document.getElementsByClassName('common_btn2')[0].click()
    } else if (document.getElementsByClassName('el-input__inner').length > 0 && document.getElementsByClassName('van-overlay').length > 0 && document.getElementsByClassName('van-overlay')[0].getAttribute('style').indexOf('none') == -1) {
        document.getElementsByClassName('el-input__inner')[0].value = '0000'
        document.getElementsByClassName('el-input__inner')[0].dispatchEvent(new Event('input'))
        // 移动端验证码确认按钮
        document.getElementsByClassName('code_button')[0].click()
    }
    // 下一题
    if (document.getElementsByClassName('el-loading-mask').length > 0 && document.getElementsByClassName('el-loading-mask')[0].getAttribute('style') == 'display: none;')
        document.getElementsByClassName('question_btn').forEach((x, id) => {
            if (x.getAttribute('style') != 'display: none;') {
                x.click()
            }
        })
}, 2000)



if (loop)
    setInterval(() => {

        if (document.getElementsByTagName('img').length > 6)
            document.getElementsByTagName('img')[target[Math.floor(Math.random() * target.length)]].click()
        // PC端点击返回
        if (document.getElementsByClassName('result_back_btn').length > 0)
            document.getElementsByClassName('result_back_btn')[0].click()
        // 移动端返回按钮
        if (document.getElementsByClassName('activity_result_normal_btn').length > 0)
            document.getElementsByClassName('activity_result_normal_btn')[0].click()

    }, 2000)

String.prototype.toUpperCase1 = String.prototype.toUpperCase
String.prototype.toUpperCase = function () {
    if (this.length == 4 && this != 'post' && this != 'head')
        return '1111'
    else
        return this.toUpperCase1()
}



// 判断是否PC端
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

