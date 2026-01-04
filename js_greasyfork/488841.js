// ==UserScript==
// @name         免权限 看课程回放
// @namespace    https://greasyfork.org/zh-CN/users/1269309/h1t52_crack
// @version      2025-10-05
// @description  内网视频回放专用，支持按钮跳转VLC播放器（安卓）
// @author       okok
// @match        *://219.223.238.14:88/*
// @match        *://jxypt.hitsz.edu.cn/*
// @icon         https://dxcdp.hitsz.edu.cn/portal/bg_32X32.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488841/%E5%85%8D%E6%9D%83%E9%99%90%20%E7%9C%8B%E8%AF%BE%E7%A8%8B%E5%9B%9E%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/488841/%E5%85%8D%E6%9D%83%E9%99%90%20%E7%9C%8B%E8%AF%BE%E7%A8%8B%E5%9B%9E%E6%94%BE.meta.js
// ==/UserScript==

//课程列表页面，直接跳转到视频
if (window.location.href.indexOf("getStudyCourseLiveList") != -1) {
    window.getStuControlType = function(rpId,courseId,courseNum,fzId){
        // 1 是教室监控
        // 2 是黑板正面
        // 3 是电脑画面
        // 逗号分隔就是同时显示
        var publicRpType = '1,2,3';
        var url = "../../../back/rp/common/rpIndex.shtml?method=studyCourseDeatil&courseId="+courseId+"&dataSource=1&courseNum="+courseNum+"&fzId="+fzId+"&rpId="+rpId+"&publicRpType="+publicRpType;
        window.open(url);
    }
}

//播放视频页面，按下按钮跳转到vlc://
if (window.location.href.indexOf("studyCourseDeatil") != -1) {
    // 检测页面加载完成
    var id = setInterval(() => {
        // 获取链接
        var ele = document.querySelector("body > script:nth-child(34)")
        if (ele == null) return

        var lines = ele.textContent.split('\n');
        var dict = {
            "var teaStreamHlsUrl = ": {
                name: "教师画面",
                url: ''
            },
            "var stuStreamHlsUrl = ": {
                name: "学生画面",
                url: ''
            },
            "var vgaStreamHlsUrl = ": {
                name: "电脑画面",
                url: ''
            },
        }

        var index = 0
        var count = 0
        // Iterate over each line

        for (let i in lines) {
            for (let key in dict) {
                if ((index = lines[i].indexOf(key)) != -1) {
                    console.log("已获取到元素" + key)
                    dict[key].url = lines[i].substring(index + key.length + 1, lines[i].length - 2)
                    count++
                }
            }
            if (count == 3) break
        }

        // 添加元素
        var header = document.querySelector("body > div.classcenter.clearfix > div.classright > div.righttop > p")
        
        let span=document.createElement("span");
        span.innerHTML="使用vlc播放> "
        header.appendChild(span)

        for (let key in dict) {
            let btn=document.createElement("button");
            btn.innerHTML=dict[key].name;
            btn.onclick=function(){
                window.open("vlc://" + dict[key].url)
            }
            header.appendChild(btn);
        }

        clearInterval(id)
    }, 1000);
}