// ==UserScript==
// @name         请求过滤器（控制台版）
// @namespace    http://tampermonkey.net/
// @version      2025-1-17
// @license      版权所有© [安徽华章信息技术有限公司]，保留所有权利。
// @license      本作品仅供使用，不得修改、二次创作或以任何形式重新发布。未经许可，不得用于任何未经授权的用途。
// @description  欢迎华章公司人员使用
// @author       不染伤痕
// @match        http://localhost:**/ie/**
// @match        http://localhost:**/IE/**
// @match        http://localhost:**/ID/**
// @match        http://localhost:**/id/**
// @match        http://localhost:**/IM/**
// @match        http://localhost:**/im/**
// @match        http://localhost:**/IPA/**
// @match        http://localhost:**/ipa/**
// @match        http://localhost:**/IB/**
// @match        http://localhost:**/ib/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523884/%E8%AF%B7%E6%B1%82%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88%E6%8E%A7%E5%88%B6%E5%8F%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/523884/%E8%AF%B7%E6%B1%82%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88%E6%8E%A7%E5%88%B6%E5%8F%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
(function () {
    // 保存原始的 submit 方法
    const originalSubmit = HTMLFormElement.prototype.submit;

    // 重写 submit 方法
    HTMLFormElement.prototype.submit = function() {

        let actionUrl = this.action;

        // 可选：获取表单数据
        const formData = new FormData(this);
        let isflag = false;
        formData.forEach((value, key) => {
            if(key === '__RequestVerificationToken') {
                isflag = true
            }
        });
        if(isflag){
            // 移除指定参数（如 '__RequestVerificationToken'）
            if (formData.has('__RequestVerificationToken')) {
                formData.delete('__RequestVerificationToken'); // 移除参数
                // console.log("已移除参数 '__RequestVerificationToken'");
            }

            // 使用 fetch 模拟提交表单，并获取返回值
            fetch(this.action, {
                method: this.method || 'POST', // 使用表单的 method 属性（默认为 POST）
                body: formData, // 发送修改后的表单数据
            })
                .then(async response => {
                if (response.ok) {
                    const result = await response.text(); // 获取服务器返回的文本内容
                    if(JSON.parse(result).message === '所需的防伪表单字段“__RequestVerificationToken”不存在。'){
                        console.log('已经配置了防伪验证：', actionUrl);
                    }else {
                        console.log('此接口未配置防伪验证：', actionUrl);
                    }
                } else {
                    console.error("提交失败，状态码：", response.status);
                }
            })
                .catch(error => {
                console.error("提交过程中发生错误：", error);
            });
        }
        // 阻止默认提交，或者继续执行原始行为
        // 如果想阻止提交，可以注释掉下面这行
        originalSubmit.apply(this, arguments);
    };
})();
