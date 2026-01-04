// ==UserScript==
// @name        云开大学
// @namespace   Violentmonkey Scriptsa
// @match       *://*/*
// @grant       none
// @version     1.0.2
// @author      yy
// @require      https://cdn.staticfile.org/jquery/3.6.3/jquery.min.js
// @run-at       document-start
// @license MIT
// @description 2023/8/2 下午5:16:56
// @downloadURL https://update.greasyfork.org/scripts/474611/%E4%BA%91%E5%BC%80%E5%A4%A7%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/474611/%E4%BA%91%E5%BC%80%E5%A4%A7%E5%AD%A6.meta.js
// ==/UserScript==


// 保存原始的alert函数
var originalAlert = window.alert;

// 重写alert函数
window.alert = function (message) {
    // 在调用原始alert函数之前，可以在这里执行您希望的操作
    console.log("Alert message:", message);

    // 调用原始alert函数
    // originalAlert(message);
};


(function ($) {
    'use strict';

    // 监听Ajax请求
    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (data) {
        var self = this;

        // 检查是否是需要拦截的请求
        if (self._url.includes('eduCourseBaseinfo/getStuCouseInfo.action')) {  // 替换为目标Ajax请求的URL或关键字
            // debugger
            // 修改分页参数
            var modifiedData = data.replace('limit=6', 'limit=60');  // 替换为您想要的分页参数

            // 重新发起请求
            originalSend.call(self, modifiedData);
        } else {
            originalSend.call(self, data);
        }

        // 在请求完成后拦截响应
        self.addEventListener('load', function () {
            if (self.responseURL.includes('viewReport.action')) {
                // 获取响应结果
                // const responseText = self.responseText;
                // debugger
                // // 在这里处理响应结果，例如打印到控制台
                // console.log('Response:', JSON.parse(responseText));
                let next = $(".selected.cur_p").parent().next();
                if (next.length === 0) {
                    next = $(".selected").parent()
                }
                if (!next[0]) {
                    // next = parent.next()
                    let parent = $(".selected").parent();
                    // 加载下一大目录课程
                    let next1 = parent.parent().parent().next();
                    next1.children("span").click()
                    // debugger
                    // 等待1000毫秒
                    setTimeout(() => {
                        next1.children("ul").children("li").eq(0).children("a").click()
                    }, 1000)
                    // next1.children("ul").children("li").eq(0).children("a").click()
                } else {
                    if(next.next().length === 0){
                        // next = parent.next()
                        let parent = $(".selected").parent();
                        // 加载下一大目录课程
                        let next1 = parent.parent().parent().next();
                        next1.children("span").click()
                        // debugger
                        // 等待1000毫秒
                        setTimeout(() => {
                            next1.children("ul").children("li").eq(0).children("a").click()
                        }, 1000)
                    }else {
                        next.children()[1].click()
                    }

                }
            }
        });

        // 调用原始的XMLHttpRequest.prototype.send函数
        // originalSend.call(self, data);
    };

    // 拦截open方法，记录请求URL
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async) {
        this._url = url;
        // 检查是否是需要拦截的请求
        if (url.includes('viewReport.action')) {  // 替换为目标Ajax请求的URL或关键字
            // 解析参数
            var queryString = url.split('?')[1];
            var params = queryString.split('&');
            var updatedParams = [];
            var lenVal = params[2].split('=')[1]
            // 更新 viewLen 参数的值
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                if (param[0] === 'viewLen') {
                    updatedParams.push('viewLen=' + lenVal);
                } else {
                    updatedParams.push(params[i]);
                }
            }
            // 构建新的 URI
            var newUri = '/play/viewReport.action?' + updatedParams.join('&');

            this._url = newUri
            // 重新发起请求
            originalOpen.call(this, method, newUri, async);
        } else {
            originalOpen.call(this, method, url, async);
        }
        // originalOpen.call(this, method, url, async);
    };
    setTimeout(() => {
        $(".icon-plus-sign").click()
        window.clearInterval("timeHandler")
    }, 1000)

    // 定时调用网页函数
    function callWebpageFunction() {
        // 调用网页中的函数
        if (typeof window.timeHandler === 'function') {
            window.timeHandler();  // 替换为您要调用的网页函数的名称
        }
    }

    // 启动定时任务
    setInterval(callWebpageFunction, 5000);

    setInterval(() => {
      // 移除word、pdf
      $(".ic-pdf").parent().remove()
      $(".ic-pdfx").parent().remove()
      $(".ic-swf").parent().remove()
      $(".ic-doc").parent().remove()
      $(".ic-docx").parent().remove()
      $(".ic-ppt").parent().remove()
      $(".ic-pptx").parent().remove()
      $(".ic-xls").parent().remove()
      $(".ic-xlsx").parent().remove()

    },200)
})(jQuery.noConflict(true));