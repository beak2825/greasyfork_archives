// ==UserScript==
// @name         广东政务服务网申办指南页面_在线办理链接显示
// @namespace    https://www.gdzwfw.gov.cn
// @version      0.1
// @description  广东政务服务网服务可用性测试：获取办理链接方便调试
// @author       Vdo_Li
// @match        *://www.gdzwfw.gov.cn/portal/v2/guide/*
// @icon         https://www.gdzwfw.gov.cn/portal/assets/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460484/%E5%B9%BF%E4%B8%9C%E6%94%BF%E5%8A%A1%E6%9C%8D%E5%8A%A1%E7%BD%91%E7%94%B3%E5%8A%9E%E6%8C%87%E5%8D%97%E9%A1%B5%E9%9D%A2_%E5%9C%A8%E7%BA%BF%E5%8A%9E%E7%90%86%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/460484/%E5%B9%BF%E4%B8%9C%E6%94%BF%E5%8A%A1%E6%9C%8D%E5%8A%A1%E7%BD%91%E7%94%B3%E5%8A%9E%E6%8C%87%E5%8D%97%E9%A1%B5%E9%9D%A2_%E5%9C%A8%E7%BA%BF%E5%8A%9E%E7%90%86%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //网站匹配判断
    console.log('当前页面链接：' + window.location.href)

    //等待加载完成
    window.onload=function(){
        //定位在线办理元素
        let xPath = '//div[@class="matters-head-action-wrapper"]//a[contains(text(),"在线办理")] | //div[@class="matters-affix"]//a[contains(text(),"在线办理")]'
        let href_element = document.evaluate(xPath,document).iterateNext()
        console.log(href_element)

        //获取办理链接
        let url = href_element.getAttribute('href')

        //获取当前页面标题
        let title = document.title

        console.log(title + '：' + url)

        //定位办理按钮
        xPath = '//div[@class="matters-head-action-wrapper"] |  //div[@class="matters-affix-inner"]'
        let btn = document.evaluate(xPath,document).iterateNext()

        //在办理按钮中显示办理链接
        var divHtml = '<input style="width: 55%;" value="' + url + '" />'
        divHtml += '<button id="copy" class="btn-primary">复制办理链接</button>'
        divHtml = '<div style="margin: 20px 10px 5px 10px;">' + divHtml + '</div>'
        btn.innerHTML += divHtml

        //在办理按钮中显示标题
        divHtml = ''
        divHtml += '<input style="width: 55%;" value="' + title + '" />'
        divHtml += '<button id="title" class="btn-primary">复制标题</button>'
        divHtml = '<div style="margin: 10px 10px 20px 10px;">' + divHtml + '</div>'
        btn.innerHTML += divHtml

        //点击复制链接
        xPath = '//button[@id="copy"]'
        btn = document.evaluate(xPath,document).iterateNext()
        btn.onclick = function(){
            xPath = '(//input)[1]'
            var text = document.evaluate(xPath,document).iterateNext()
            text.select()
            document.execCommand('copy');
            console.log('复制成功')

            //成功提示
            btn.innerText = '复制成功'
            btn.style.background="#00DD00";
            setTimeout(() => {
                btn.innerText = '复制办理链接'
                btn.style.background="";
            }, 1000);
        }

        //点击复制标题
        xPath = '//button[@id="title"]'
        var title_btn = document.evaluate(xPath,document).iterateNext()
        title_btn.onclick = function(){
            xPath = '(//input)[2]'
            var text = document.evaluate(xPath,document).iterateNext()
            text.select()
            document.execCommand('copy');
            console.log('复制成功')

            //成功提示
            title_btn.innerText = '复制成功'
            title_btn.style.background="#00DD00";
            setTimeout(() => {
                title_btn.innerText = '复制标题'
                title_btn.style.background="";
            }, 1000);
        }

    }


})();