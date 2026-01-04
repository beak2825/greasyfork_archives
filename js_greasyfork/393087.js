// ==UserScript==
// @name         500px 图片下载
// @namespace    https://www.yffjglcms.com/
// @version      0.4.3.20240623
// @description  提供 500px 图片保存功能
// @author       yffjglcms
// @match        *500px.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/393087/500px%20%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/393087/500px%20%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code h ere...

    // 图片选择器
    const jqUrl = "https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js"
    let imgSelector = ".photo-show__img"
    const corsApi = "https://cors.yffjglcms.workers.dev/?url="


    // 如果存在则执行
    function ifExist(selector, func, timeout){
        console.log('check ifExist ...' + selector)
        if(!timeout){
            timeout = 5000
        }

        if($(selector)[0]==null)
        {
            setTimeout( function(){ifExist(selector, func);}, timeout);
        }
        else
        {
            func()
        }
    }

    // 添加导出按钮
    function addBtn() {

        matchThen(className=> className.startsWith("Element__StyledImg"), items=> {
            imgSelector = items

            // 下载按钮，导出按钮
            $(imgSelector).before(`<div style="display:inline;z-index:999;position: absolute;left: 5px; top:5px;">
                <button class='Elements__Button-tze21g-2 dgFUjF Elements__StyledFollowButton-sc-12ull8w-0 hytWHw' style="display: block; margin: 1px auto;" id="saveImg">下载图片</button>
                <button class='Elements__Button-tze21g-2 dgFUjF Elements__StyledFollowButton-sc-12ull8w-0 hytWHw' style="display: block;" id="openInNewTab">新窗打开</button>
        </div>`)


            $("body").on("click", "#saveImg", ()=>{
                let imgSrc = $(imgSelector).attr("src")
                let title = $(imgSelector).attr("alt")
                // console.log(imgSrc)
                downloadImg(corsApi + encodeURIComponent(imgSrc) + '&filename='+ encodeURIComponent(title))


            })

            $("body").on("click", "#openInNewTab", ()=>{
                let imgSrc = $(imgSelector).attr("src")
                // console.log(imgSrc)
                window.open(imgSrc)
            })
        })


    }


    // 下载图片
    function downloadImg(src){
        var a=document.createElement('a');
        a.href=src
        a.download="file";
        a.click();
    }

    function loadScript(url){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        document.body.appendChild(script);
    }

    function matchThen(classNameMatcherFunc, func){
        var findItems = $("*").filter(function() {
            var classes = $(this).attr('class'); // 获取 class 属性
            if (classes) { // 确保 classes 不是 undefined 或 null
                var classNames = classes.split(/\s+/); // 分割 class 属性为数组
                return classNames.some(function(className) {
                    // 检查类
                    return classNameMatcherFunc(className)
                    // return className.startsWith("Elements__ModalContainer"); // 检查是否有以指定字符串开头的类
                });
            }
            return false; // 如果没有 class 属性，则返回 false
        })

        // 对匹配的class元素进行操作
        func(findItems)
    }

    function removeLogin(){

        matchThen(className=> className.startsWith("Elements__ModalContainer"), items=> items.css("display", "none"))

    }



    // 加载脚本
    loadScript(jqUrl)
    // 执行
    ifExist("#signup-modal", removeLogin, 100)
    ifExist("#photoContainer", addBtn)



})();