// ==UserScript==
// @name         VIP会员漫画自动去除付费弹窗与阅读屏蔽
// @namespace    https://greasyfork.org/zh-CN/users/505018
// @iconURL      http://resource.mhxk.com/manhuatai_pc/static/images/favicon.ico
// @version      1.4
// @description  漫画台、神漫画、爱优漫、知音漫画等自动去除付费弹窗与阅读屏蔽插件
// @author       DreamFly
// @match        http*://*.manhuatai.com/*
// @match        http*://*.taomanhua.com/*
// @match        http*://*.iyouman.com/*
// @match        http*://*.kaimanhua.com/*
// @match        http*://*.isamanhua.com/*
// @match        http*://*.kanman.com/*
// @match        http*://*.zymk.cn/*
// @match        http*://*.kuman5.com/*
// @match        http*://*.kanman.com/*
// @match        http*://www.migudm.cn/comic/*
// @match        http*://qiximh.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402354/VIP%E4%BC%9A%E5%91%98%E6%BC%AB%E7%94%BB%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%E4%BB%98%E8%B4%B9%E5%BC%B9%E7%AA%97%E4%B8%8E%E9%98%85%E8%AF%BB%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/402354/VIP%E4%BC%9A%E5%91%98%E6%BC%AB%E7%94%BB%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%E4%BB%98%E8%B4%B9%E5%BC%B9%E7%AA%97%E4%B8%8E%E9%98%85%E8%AF%BB%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var search_id = function(id){
        if (id.search('^layui-layer') >= 0)
        {
            return true
        }

        return false
    };

    var search_class = function(className){
        if (className.search('^trans_scroll_page') >= 0){
            return true
        }

        return false
    };

    //知音漫画
    var zymkHandler = function() {
        //当显示付费弹框时再做处理
        if (document.getElementById('payCharpterLayer')) {
            let class_names = ['layui-layer-shade', 'layui-layer-page'];
            for (let i = 0; i < class_names.length; i++) {
                let shade = document.getElementsByClassName(class_names[i])[0];
                if (shade && shade.style.display != 'none') {
                    shade.style.display = 'none';
                }
            }

            //开启滚动条
            document.body.style.overflow = 'unset';
        }
    }

    //酷漫5
    var kuman5Handler = function(){
        let class_names = ['xxtop', 'list3_1 similar clearfix mt10'];
        for (let i = 0; i < class_names.length; i++) {
            let shade = document.getElementsByClassName(class_names[i])[0];
            if (shade && shade.style.display != 'none') {
                shade.style.display = 'none';
            }
        }

        if (location.hostname === 'kuman5.com')
        {
            let bodyTag = document.getElementsByTagName('body')[0]
            if (bodyTag){
                bodyTag.style.width = '65%';
                bodyTag.style.margin = '0 auto';
            }
        }
    }

    //漫画台、神漫画等
    var otherHandler = function() {
        //处理
        let element_ids = [ ]
        let div_ids = document.getElementsByTagName('div')
        if (div_ids){
            for (let i = 0; i < div_ids.length; i++){
                let element = div_ids[i]
                if (element.id){
                    if (search_id(element.id)){
                        element_ids.push(element.id)
                    }
                }
            }
        }

        for (let j in element_ids) {
            let shade = document.getElementById(element_ids[j]);
            if (shade && shade.style.display != 'none') {
                shade.style.display = 'none';
            }
        }

        //处理
        let class_names = []
        let div_classs = document.getElementsByTagName('div')
        if (div_classs){
            for (let i = 0; i < div_classs.length; i++){
                let element = div_classs[i]
                if (element.className){
                    if (search_class(element.className)){
                        class_names.push(element.className)
                    }
                }
            }
        }

        for (let m in class_names) {
            let shades = document.getElementsByClassName(class_names[m]);
            if (shades) {
                for (let i = 0; i < shades.length; i++){
                    let shade = shades[i]
                    shade.className = shade.className.replace('lock','')
                    let child = shade.firstChild
                    if (child.length >= 3){
                        let img_bg = child.childNodes[1]
                        if (img_bg.style.display == 'none' || img_bg.style.display == '') {
                            img_bg.style.display = 'block';
                        }
                    }
                }
            }
        }
    }

    //执行函数
    var loop = function () {
        var websites = [{ url:/zymk.cn/i, func: zymkHandler}, { url:/kuman5.com/i, func: kuman5Handler}]

        for (let i in websites) {
            if (websites[i].url.test(location.href)){
                websites[i].func();
                return;
            }
        }

        otherHandler();
    };

    //开启滚动条
    document.body.style.overflow = 'unset';

    //循环执行
    setInterval(loop, 15);
})();
