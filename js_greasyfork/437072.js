// ==UserScript==
// @name         linewellistudy
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  linewellistudy-yyds
// @author       ncatkins
// @match        http://linewelle-learning.yunxuetang.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437072/linewellistudy.user.js
// @updateURL https://update.greasyfork.org/scripts/437072/linewellistudy.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //判断市在列表页还是详情页
    var href = window.location.href
    //列表页面
    console.log(href)
    if (/\.cn\/plan\/.*\.html/.test(href) || /cn\/kng\/plan\/package\//.test(href)) {
        console.log("列表页面")
        openStudy();
        return
    }
    if (/cn\/kng\/plan\//.test(href) || /cn\/kng\/course\//.test(href)) {
        console.log("播放页面")
        setTimeout(function(){
            study();
        }, 2000)
        return
    }

})();
//打开学习页面
function openStudy() {
    var data = getData()
    if (data == null) {
        alert("已经全部学完啦")
    } else {
        console.log('学习', data)
        if (data.type && data.type === 'open') {
            window.open(data.url)
        } else {
            jQuery("#aJump").attr('href', data.url);
            document.getElementById("aJump").click();
        }
        setTimeout(function () {
            window.close();
        }, 10000)
    }
}
//学习
function study() {
    // 继续学习与完成学习
    console.log("开始校验继续学习与完成学习")
    setInterval(function () {
        reStudy()
        if (checkFinish()) {
            setTimeout(function () {
                $("#divGoBack").click();
            }, 3000)
        }
    }, 2000)
    // 判断是否音视频
    console.log("开始校验音视频暂停")
    if (/cn\/kng\/.*\/video/.test(window.location.href)) {
        // 判断是否是音频
        var isVoice = document.getElementById("divDefaultImg") !== null
        console.log("音频： ", isVoice)
        var time = $("#playervideocontainer > div.jw-controls.jw-reset > div.jw-controlbar.jw-background-color.jw-reset > div.jw-group.jw-controlbar-left-group.jw-reset > span.jw-text.jw-reset.jw-text-elapsed").text()
        setInterval(function () {
            var a = $("#playervideocontainer > div.jw-controls.jw-reset > div.jw-controlbar.jw-background-color.jw-reset > div.jw-group.jw-controlbar-left-group.jw-reset > span.jw-text.jw-reset.jw-text-elapsed").text()
            if (time == a) {
                var myVideo;
                if (isVoice) {
                    //$("#divDefaultImg").click()
                    myVideo = document.querySelector("#playeraudiocontainer > div.jw-media.jw-reset > video").play();
                } else {
                    myVideo = document.getElementById("vjs_video_3_html5_api");
                }
                if (myVideo.paused) {
                    myVideo.muted = "muted";
                    myVideo.play();
                }
            }
            time = a
        }, 3000)
    }
}
//获取所有未学完的文档
function getData() {
    // 普通列表页
    let videos = $("tr.hand");
    let data = null;
    let length = videos.length;
    // var reg = /return StudyRowClick('(.*?)',/;
    for (let i = 0; i < length; i++) {
        let dom = videos.eq(i);
        if (dom.find(".pull-right .mt9 > span:nth-child(3)").text() !== '100%') {
            // var min = dom.find(".pull-left  span.times").text().split('/')[1].split('分钟')[0]
            let name = dom.find(".text-left span:last-child").text();
            let action = dom[0].attributes.onclick.nodeValue;
            let url = /return StudyRowClick\('(.*?)\'/.exec(action)[1].trim()
            return {
                url: url,
                name: name
            }
        }
    }
    // 二级列表页
    videos = $('#divcourselist > div.el-plancourselist.pl5 > div.el-plancourselist > div')
    for (let i = 0; i < videos.length; i++) {
        let dom = videos.eq(i);
        let text = dom.find("div.process > table > tbody > tr > td.fontnumber.study-schedule").text()
        // 是否考试
        if (!text) {
            continue
        }
        if (text.indexOf('100') === -1) {
            let href = dom.find("div.name.ellipsis > a")
            // var min = dom.find(".pull-left  span.times").text().split('/')[1].split('分钟')[0]
            let name = href.text();
            let url = /StudyRowClick\('(.*?)\'/.exec(href.attr('href'))[1].trim()
            return {
                url: url,
                name: name,
                text: text,
                type: 'open'
            }
        }
    }
    return data
}

// 校验是否完成学习
function checkFinish() {
    return $("#ScheduleText").text().indexOf('100') !== -1
}

//校验继续学习
function reStudy() {
    var node = document.getElementById("dvWarningView")
    if(node) {
        node.remove();
    }
}