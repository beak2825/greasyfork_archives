// ==UserScript==
// @name         头条搜索助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  头条搜索 助手
// @author       You
// @match        *://www.toutiao.com/search/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js
// @downloadURL https://update.greasyfork.org/scripts/422454/%E5%A4%B4%E6%9D%A1%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/422454/%E5%A4%B4%E6%9D%A1%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //引入css
    var importCss=document.createElement('link')
    importCss.setAttribute("rel","stylesheet")
    importCss.setAttribute("href", 'https://www.layuicdn.com/layui/css/layui.css')
    document.getElementsByTagName("head")[0].appendChild(importCss)

    //方便在控制台用jq调试
    var jq = document.createElement('script');
    jq.src = "https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(jq);


    //引入layer弹窗css
    $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css" rel="stylesheet">`)


    $(function () {

         //创建触发按钮
        function addTouchBtn() {
            var newBtn = $('<buttom></buttom>').addClass('layui-btn  addTouchBtn').css({ 'top': '150px', 'position': 'fixed' }).text('触发');
            $('body').append(newBtn);
            newBtn = null;//及时解除不再使用的变量引用,即将其赋值为 null;
        }
        addTouchBtn();

        //复制操作
        //创建复制链接按钮
        function addShowUrlBtn(obj) {
            //参数obj传递过来是DOM对象
            var str = $(obj).prev().attr('href');
            //console.log(str);
            var url = "https://www.ixigua.com/" + str.slice(7, 26)
            //console.log(url);
            var newBtn = $('<buttom></buttom>').addClass('layui-btn layui-btn-xs showItemsUrl').css('margin-left','10px').text('复制链接').attr('title', url);
            $(obj).append(newBtn);
            newBtn = null;//及时解除不再使用的变量引用,即将其赋值为 null;
        }
        //创建复制标题按钮
        function addShowTitleBtn(obj) {
            //参数obj传递过来是DOM对象
            var str = $(obj).parents('.rbox-inner').find('.J_title').text();
            //console.log(str);
            var newBtn = $('<buttom></buttom>').addClass('layui-btn layui-btn-xs showItemsTitle').css('margin-left','10px').text('复制标题').attr('title', str);
            $(obj).append(newBtn);
            newBtn = null;//及时解除不再使用的变量引用,即将其赋值为 null;
        }

        function find(url) {
            console.log("copy: " + url);
            var oInput = document.createElement('input');
            oInput.value = url;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = 'oInput';
            oInput.style.display = 'none';
            layer.msg('复制成功', { icon: 1 });
        }

        function showItems() {
            var obj = $("div.y-box.footer > div > span")
            for (var i = 0; i < obj.length; ++i) {
                addShowUrlBtn(obj[i]);
                addShowTitleBtn(obj[i])
            }
            //给复制链接按钮绑定事件
            $(".showItemsUrl").click(function () {
                find(this.title);
            });
            //给复制标题按钮绑定事件
            $(".showItemsTitle").click(function () {
                find(this.title);
            });
        }

        function deltemsUrl() {
            var obj = document.querySelectorAll("div.y-box.footer > div > span")
            for (var i = 0; i < obj.length; ++i) {
                //先删复制标题按钮
                if ($(obj[i].lastChild).hasClass("showItemsTitle")) {
                    obj[i].removeChild(obj[i].lastChild);
                }
                if ($(obj[i].lastChild).hasClass("showItemsUrl")) {
                    obj[i].removeChild(obj[i].lastChild);
                }
            }
        }

        //给筛选按钮绑定事件
        $(".addTouchBtn").click(function () {
            deltemsUrl();
            showItems();
        });

    });//$(function...

})();