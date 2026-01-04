// ==UserScript==
// @name         csdn自动评论插件
// @namespace    https://blog.iotlearn.cn/
// @version      0.2
// @license MIT
// @description  打开csdn文章会自动进行评论，前提是你得登录
// @author       AaronDoge
// @match        https://**.csdn.net/**/article/details/**
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/447459/csdn%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/447459/csdn%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 版本信息
    let packageInfo = {
        "name":"csdn自动评论插件",
        "description":"csdn打开文章自动评论",
        "version":"0.1",
        "dateTime":"2022-7-5"
    }
         // 在console中显示信息
    let copyright = function(packageInfo) {
        /* 样式代码 */
        const projectNameStyle = 'font-size: 20px;font-weight: 600;color: rgb(244,167,89);';
        const descriptionStyle = 'font-style: oblique;font-size:14px;color: rgb(244,167,89);font-weight: 400;';
        const versionStyle = 'color: rgb(30,152,255);padding:8px 0 2px;';
        const dateTimeStyle = 'color: rgb(30,152,255);padding:0 0 5px;';
        /* 内容代码 */
        const projectName = packageInfo.name || '';
        const description = packageInfo.description || '';
        const version = `版 本 号：${packageInfo.version}`;
        const dateTime = `编译日期：${packageInfo.dateTime}`;
        // 空格有意义，不要格式化
        console.log(`%c${projectName} %c${description}
        %c${version}
%c${dateTime}`, projectNameStyle, descriptionStyle, versionStyle, dateTimeStyle);
    }
    // 评论模板列表
    let comment_list = [
        "技术水平炉火纯青，膜拜了~,期待大佬回访",
        "文章图文并茂，内容特别详细，是难得一见的好文,期待大佬回访",
        "内容很详细，文章易懂，不愧是大佬，支持,期待大大回访呀",
        "优秀，好文必须支持,期待大佬回访",
        "大佬写得很好，收获满满，学到了很多东西，支持一下,期待大大回访呀",
        "好文，来学习了，期待大大回访呀",
        "很详细的文章呀，支持了，加油，期待回访呀",
        "大佬文章很有深度，内容很丰富，看完了收获很多，必须支持,期待回访呀",
        "大佬好文，内容充实总结到位，三连支持大佬,求回访指点！",
        "优质文章，三连支持,期待大佬回访",
        "大佬文章通俗易懂，看到就是学到了，点赞、收藏，三连鼎力支持,求回访指点！",
        "写的真的好详细，好文，期待回访",
        "优质好文，内容丰富，讲解严谨，必须支持,求回访指点！",
        "大佬就是大佬 可望不可及 已三连，欢迎回访哦~",
        "文章很棒，支持博主，欢迎大佬指导",
        "很有深度的一篇文章，博主用心啦，期待博主来我文章指点二三哇",
        "写得很详细 看完受益匪浅 支持博主😍😍，向大佬学习，大佬也能来指点一下我吗！！！",
        "优质文章必须支持，期待大佬来我的文章指点一二",
        "优质好文点赞收藏不迷路，期待回访"
    ]
    let getTimeKey = function(){
        let time = new Date()
        let year = time.getFullYear()
        let month = time.getMonth()+1
        let day = time.getDay()
        return `${year}-${month}-${day}`
    }
    let getCount = function(){
        let time_key = getTimeKey()
        let counter = null
        counter = localStorage.getItem(time_key)
        if(null == counter || undefined == counter) counter=0
        return counter
    }
    let setCount = function(val){
        let time_key = getTimeKey()
        return localStorage.setItem(time_key, val)
    }
    // 生成模板字符串，（替换%name%）
    let GenComment = function(tmp, name){
        return tmp.replace("%name%", name)
    }
    // 生成随机评论
    let getRandomComment = function(){
        let index = parseInt(Math.random()*comment_list.length)
        return comment_list[index]
    }
    // 以下内容为主程序逻辑
    copyright(packageInfo)
    let counter = getCount()
    if(counter < 50){
        $('#comment_content').val(getRandomComment())
        $('#commentform').submit()
        // 计数器加一
        // getCount(parseInt(getCount)+1)
    }
})();