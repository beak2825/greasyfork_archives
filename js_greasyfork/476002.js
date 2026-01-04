// ==UserScript==
// @name         NGA 干净版面
// @namespace    none
// @version      2023.09.24
// @description  隐藏广告，自动跳转广告页面，隐藏帖子列表中板块，调整页面
// @match        *://bbs.nga.cn/thread.php*
// @match        *://bbs.nga.cn/misc*

// @match        *://nga.178.com/thread.php*
// @match        *://nga.178.com/misc*
// @license MIT
// @grant window.onurlchange
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/476002/NGA%20%E5%B9%B2%E5%87%80%E7%89%88%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/476002/NGA%20%E5%B9%B2%E5%87%80%E7%89%88%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let real
    // 自动跳转离开NGA广告页面
    let currentURL = window.location.href;
    if (/https?:\/\/bbs.nga.cn\/misc/.exec(currentURL)) {
        real = /https?:\/\/bbs\.nga\.cn\/(?:r|thr)ead.*$/.exec(currentURL)
        if (real){
            //alert('准备跳页面')
            window.location.href = real[0];
        }
    } else if (/https?:\/\/nga.178.com\/misc/.exec(currentURL)) {
        real = /https?:\/\/nga\.178\.com\/(?:r|thr)ead.*$/.exec(currentURL)
        if (real){
            //alert('准备跳页面')
            window.location.href = real[0];
        }
    }


    class Utils {
        getEl(str) {
            try {
                return document.querySelectorAll(str)
            }catch (e) {
                console.log('页面没加载完,getEl')
            }
        }
        delEl(el) {
            try {
                el.parentNode.removeChild(el)
            }catch (e) {
                console.log('页面没加载完,delEl')
            }
        }
        creEl(elType) {
            return document.createElement(elType);
        }
    }
    let Util = new Utils()
    // 要删除的元素
    let strs = [
        '#b_nav', // 底部面包屑导航
        '#custombg', // 顶部下方的背景图片
        '#footer', // 底部的网页备案信息
        '#fast_post_c', // 底部的？？
        '#m_threads .w100 > span:nth-last-of-type(2)', // 顶部广告
        '#m_posts_c>span', // 帖子里，中间广告
        '#m_posts_c td.null', // 帖子里，右边广告
    ]
    // 删除页面元素
    var delEls = function () {
        try {
            // 删除帖子列表中的版面镜像
            Util.getEl('td span input[type=checkbox]').forEach(
                function(e) {
                    let delTarget = e.parentNode.parentNode.parentNode.parentNode
                    delTarget.parentNode.removeChild(delTarget)
                }
            )
        } catch(e){
            console.log('页面还没加载完')
        }
        for (let i of strs) {
            let els = Util.getEl(i)
            for (let j of els) {
                Util.delEl(j)
            }
        }
    }

    // 改变字体颜色
    function changeColor() {
        if (Util.getEl('html>style[mystyle]')[0] != undefined){
            return
        }
        let elStyle = Util.creEl('style')
        elStyle.type = 'text/css'
        elStyle.setAttribute('mystyle', 114514)
        let now = new Date();
        let hour = now.getHours();
         let styleText = ''
        if (hour > 6 && hour < 18) { // 6-18点 标题用原色。其他时间，标题改橙色
            styleText = 'body{color: rgba(255, 140, 0, 0.7)}'
        } else {
            styleText = 'body{color: rgba(255, 140, 0, 0.7)}'

            //styleText = 'body{color: rgba(255, 140, 0, 0.7)} a.topic{color: rgba(255, 140, 0, 0.8)} '
        }
        elStyle.innerText = styleText
        Util.getEl('html')[0].appendChild(elStyle)
    }

    // 隐藏版头 添加显示按钮
    function hidtoptopics () {
        try {
            // 如果已存在则不执行
            if (document.querySelectorAll('#toptopics')[0] && document.querySelectorAll('#toptopics')[0].style.display != '') {
                return
            } else if (Util.getEl('#hidtoptopics')[0] == undefined) {
                // 添加显示、隐藏按钮
                let _right = Util.getEl('#mainmenu div.right')[0]
                let _div = Util.creEl("div")
                _div.className = 'td'
                _div.id = 'hidtoptopics'
                _div.innerHTML = '<a class="mmdefault " title="" href="#" style="white-space: nowrap;">显示</a>'
                _right.prepend(_div)

            }
            // 隐藏版头
            let toptopics = Util.getEl('#toptopics')[0]
            toptopics.style = 'display: none;'

            let h = false
            // 切换按钮效果
            Util.getEl('#hidtoptopics')[0].addEventListener('click', function () {
                h = !h
                document.querySelectorAll('#hidtoptopics a.mmdefault')[0].innerHTML = (h ? '隐藏' : '显示')
                toptopics.style = `display: ${h ? 'block': 'none'};`
            })
        } catch(e) {
            console.log('隐藏版头 添加显示按钮')
        }

    }

    // 隐藏子版面 添加显示按钮
    function hidforum () {
        try {
            // 如果已存在则不执行
            if (Util.getEl('#hidforum')[0] != undefined) {
                return
            }
            // 隐藏子版面
            let forum = Util.getEl('#sub_forums_c')[0]
            forum.style = 'display: flex;height: 0;'
            // 添加显示、隐藏按钮
            let _tbody = Util.getEl('#m_pbtntop tbody tr')[0]
            let _td = Util.creEl("td")
            let h = false
            _td.id = 'hidforum'
            _td.innerHTML = '<a href="#" class=" cell rep txtbtnx nobr silver"><span style="font-size:1.23em">显示</span></a>'
            _tbody.prepend(_td)
            // 切换按钮效果
            _td.addEventListener('click', function () {
                h = !h
                document.querySelectorAll('#hidforum span')[0].innerHTML = (h ? '隐藏' : '显示')
                forum.style = `display: flex;height: ${h ? 'auto': 0};`
            })
        } catch(e) {
            console.log('子版面未出现')
        }
    }

    // 位置变化
    var moveEl = function (){
        let mm = Util.getEl('#mainmenu')[0]
        mm.style.margin = '0 0 -64px 0'
        let tds = Util.getEl('#mainmenu .innerbg>div')
        tds.forEach(el => {
            el.style.display = 'none'
            if (!!el.className && el.className.indexOf('right') != -1) {
               // 去除上面赋值的none
               el.style.display = 'block'
               el.style.position = 'relative'
               el.style.zIndex = '100'
            }
        })
    }

    // 在循环前执行一次，免去等待的时间，感官更好
    delEls()



    setInterval(function() {
        delEls()
        if (document.location.pathname.indexOf('/thread') == -1) {
            return
        }

        moveEl()
        hidforum()
        hidtoptopics()
        // changeColor()
    }, 1000)

    var _body = document.querySelectorAll('body')[0]
    try{
        _body.style = 'overflow-y:hidden;'
    } catch (e) {
        console.log('页面还没加载好')
    }

})();