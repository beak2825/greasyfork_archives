// ==UserScript==
// @name         芒果题库试卷下载
// @namespace    https://lers.fun
// @version      2024-02-01
// @description  下载芒果题库的题
// @author       lers梦魔
// @license      MIT
// @match        http://www.mgtiku.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mgtiku.com
// @require      https://registry.npmmirror.com/sweetalert2/10.16.6/files/dist/sweetalert2.min.js
// @require      https://cdn.staticfile.org/blueimp-md5/2.12.0/js/md5.min.js
// @resource     css https://registry.npmmirror.com/sweetalert2/10.16.6/files/dist/sweetalert2.min.css
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/486580/%E8%8A%92%E6%9E%9C%E9%A2%98%E5%BA%93%E8%AF%95%E5%8D%B7%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/486580/%E8%8A%92%E6%9E%9C%E9%A2%98%E5%BA%93%E8%AF%95%E5%8D%B7%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

//----------------------------------函数------------------------------------------

// hook函数
function addXMLRequestCallback (callback) {
    var oldSend, i
    if (XMLHttpRequest.callbacks) {
        //判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
        XMLHttpRequest.callbacks.push(callback)
    } else {
        XMLHttpRequest.callbacks = [callback]
        //如果不存在则在xmlhttprequest函数下创建一个回调列表
        oldSend = XMLHttpRequest.prototype.send
        //获取旧xml的send函数，并对其进行劫持
        XMLHttpRequest.prototype.send = function () {
            for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                XMLHttpRequest.callbacks[i](this)
            }
            //循环回调xml内的回调函数
            oldSend.apply(this, arguments)
            //由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
        }
    }
}

// 解析题库
function format_paper(json){
    var data = JSON.parse(json).data
    var paper = {}
    paper.title = data.paper.title
    paper.question = []
    data.paper.questions.forEach(chunk => {
        var qs = []
        chunk.questionList.forEach(item => {
            var q = {
                "contens": (item.contents),
                "options": (item.options),
                "answer": (item.answers),
                "analysis": (item.analysis)
            }
            qs.push(q)
        })
        paper.question.push({
            "title": chunk.title,
            "content": qs
        })
    })
    return paper
}

// 发送题库到本地api
function send_local(paper){
    var data = {
        content: paper
    }
    Swal.fire({
        title: "发送中",
        didOpen: () => {
            Swal.showLoading();
        }
    });
    GM_xmlhttpRequest({
        method: "POST",
        url: GM_getValue("url"),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        data: JSON.stringify(data),
        onload: function(response){
            Swal.hideLoading()
            Swal.fire({
                title: "发送成功",
                icon: "success"
            })
        },
        onerror: function(response){
            Swal.hideLoading()
            Swal.fire({
                icon: "error",
                title: "发送失败",
                text: "请联系脚本作者！"
            });
        }
    })
}

//----------------------------------UI------------------------------------------

// 菜单
function registerMenuCommand() {
    GM_registerMenuCommand('▼ 选择下载', () => {
        var response = GM_getValue("response")
        Swal.fire({
            title: "请选择要下载的试卷",
            input: "select",
            inputOptions: response,
            inputPlaceholder: "选择试卷",
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value) {
                        var papers = GM_getValue("papers")
                        send_local(papers[value])
                    } else {
                        resolve("请选择试卷");
                    }
                });
            }
        });
    });
    GM_registerMenuCommand('⚙️ 设置', () => {
        var url2 = Swal.fire({
            title: "配置地址",
            input: "url",
            inputPlaceholder: GM_getValue("url"),
            showCancelButton: true,
        })
        if(url2){
            GM_setValue("url", url2)
        }
    });
}

//----------------------------------流程------------------------------------------
//加载脚本时就启动函数开始监听
(function () {
    'use strict'
    GM_addStyle(GM_getResourceText("css"));
    var response = {}
    var papers = []
    var md5s = new Set()
    GM_setValue("url", "http://localhost:13323")
    registerMenuCommand()
    addXMLRequestCallback(function (xhr) {
        //调用劫持函数，填入一个function的回调函数
        //回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
        xhr.addEventListener("load", function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.responseURL.indexOf("xd/back/qb/qbTask/startExam") >= 0 || xhr.responseURL.indexOf("xd/back/qb/qbTask/otherPageDetail") >= 0) { // url中包含固定字符串
                    // hook xhr请求成功
                    console.log(xhr.responseURL)
                    var paper = format_paper(xhr.responseText)
                    var code = md5(paper.title.trim())
                    if(!md5s.has(code)){
                        md5s.add(code)
                        papers.push(paper)
                        response[papers.indexOf(paper)] = paper.title.trim()
                        GM_setValue("response", response)
                        GM_setValue("papers", papers)
                    }
                }
            }
        })
    })
})()