// ==UserScript==
// @name         学达云新版-支持自动换课程
// @namespace    http://t.cn/A6ccQOZr
// @version      17
// @description  自动提交和播放下一节，支持换课程，全自动学习
// @author       tuziang
// @match        *://*.ok99ok99.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/445147/%E5%AD%A6%E8%BE%BE%E4%BA%91%E6%96%B0%E7%89%88-%E6%94%AF%E6%8C%81%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/445147/%E5%AD%A6%E8%BE%BE%E4%BA%91%E6%96%B0%E7%89%88-%E6%94%AF%E6%8C%81%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if(location.href.indexOf("/stu/cls_courselist.aspx")!=-1) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src="https://cdn.jsdmirror.com/gh/MCCRNFC-SNLoong/LayuiCdn/layui-v2.6.8/layui.js";
        document.body.appendChild(script);

        window.yijianxuexi=function(){
            GM_setValue("runningClassPage",location.href)
            nextCourse()
        }

        // 添加一键学习按钮
        setTimeout(function(){
            var xuankeBtn = document.querySelector("body div.m_container div.l_left.fl  div  a")
            const newLink = document.createElement('a');
            newLink.innerHTML='<a href="javascript:" class="linkG" style="display: inline-block;width: 177px;margin-left: 10px;">一键学习（脚本功能）</a>'
            newLink.onclick=window.yijianxuexi
            xuankeBtn.parentNode.insertBefore(newLink, xuankeBtn.nextSibling);
            document.querySelector("body div.m_container.fr div.clearfix div.l_left.fl a").style.float='left'
        },500)

        var runningClassPage=GM_getValue("runningClassPage")
        if(runningClassPage != undefined) {
            if(runningClassPage == location.href) {
                let isSk = true
                let index
                setTimeout(function(){
                    index = layer.confirm('3秒后将开始自动刷课，如需取消请点击取消按钮', {
                        icon: 3
                    }, function() {
                        layer.msg('确定');
                        layer.close(index);
                    }, function() {
                        layer.msg('取消');
                        isSk=false
                    });
                },100)
                setTimeout(function(){
                    layer.close(index);
                    if(isSk){
                        nextCourse()
                    }
                },3000)
            }
        }
    }

    function nextCourse(){
        let completedClassAndCourseId = GM_getValue("completedClassAndCourseId")
        let trLength = document.querySelectorAll("body div.m_container.fr > div > div.jl > table > tbody > tr ").length
        for(let i = 0;i<trLength;i++){
            let trItem = document.querySelectorAll("body div.m_container.fr > div > div.jl > table > tbody > tr ")[i]
            if(trItem && trItem.innerText.indexOf("已完成")!=-1) {
                continue
            }
            let aLength = trItem.querySelectorAll("a").length
            for (let j = 0;j<aLength;j++) {
                let aItem = trItem.querySelectorAll("a")[j]
                if(aItem && aItem.innerText.indexOf("学习")!=-1) {
                    location.href = aItem.href
                    break
                }
            }
            break
        }
    }


    if (window.location.href.indexOf("stu/study") != -1) {
        setTimeout(function(){
            // 创建一个新的文本节点
            const textNode = document.createTextNode("脚本自动学习中...");
            // 创建一个容器元素（例如div），用于包裹文本节点
            const container = document.createElement("div");
            container.appendChild(textNode);
            // 添加样式
            container.style.position = "fixed"; // 固定位置
            container.style.top = "8%"; // 垂直居中
            container.style.left = "30%"; // 水平居中
            container.style.transform = "translate(-50%, -50%)"; // 偏移自身尺寸的50%以确保中心对齐
            container.style.color = "red"; // 字体颜色为红色
            container.style.fontWeight = "bold"; // 字体加粗
            container.style.zIndex = "1000"; // 确保在最上层
            container.style.padding = "10px"; // 添加一些内边距
            container.style.background = "white"; // 背景颜色
            container.style.border = "1px solid #ddd"; // 边框
            container.style.borderRadius = "5px"; // 边框圆角
            container.style.textAlign = "center"; // 文本居中
            container.style.fontSize = "20px"; // 字体大小
            container.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.1)"; // 添加阴影效果
            // 将容器元素插入到<body>标签的最前面
            document.body.insertBefore(container, document.body.firstChild);
        },3000)

        setTimeout(function(){
            console.log("判断")
            console.log(window.location.href)

            if (document.getElementsByClassName("flex align_content justify_between font18 study_time").length == 1 ) {
                if (!is_in_study) {
                    is_in_study = true
                }

                setInterval(function(){
                    // 确认学习新章节
                    var btn0 = document.querySelector("a.layui-layer-btn0")
                    if(btn0 && btn0.innerText.indexOf("新章节")!=-1) {
                        btn0.click()
                    }
                },3*1000)

                if (document.getElementsByClassName("layui-layer-move").length != 0 && document.getElementById("TB_window") != null) {
                    if (document.getElementById("TB_window").getElementsByClassName("btn close_camera_standard") != null && document.getElementById("TB_window").getElementsByClassName("btn close_camera_standard").length != 0) {
                        document.getElementById("TB_window").getElementsByClassName("btn close_camera_standard")[0].click()
                    }

                }


                console.log("新版")
                setInterval(function () {
                    var btn_disable = document.getElementsByClassName("btn submit_btn")[0].disabled
                    console.log("btn_disable  " + btn_disable)
                    if(btn_disable == false){
                        document.getElementsByClassName("btn submit_btn")[0].click()
                        setTimeout(function(){
                            location.reload()
                        },5*1000)
                    }
                    if (!is_in_study) {
                        is_in_study = true
                    }

                    if(isCourseEnd()) {
                        location.href=GM_getValue("runningClassPage")
                    }
                },5000)


            } else {
                console.log("旧版")
                if (document.getElementById("rightiframe") == null) {
                    return
                }
                var right = document.getElementById("rightiframe").contentWindow.document

                if(right.getElementById("TB_ajaxWindowTitle") && right.getElementsByClassName("btn_Dora_b").length == 0){
                    console.log(right.getElementById("TB_ajaxWindowTitle").disabled)
                } else {
                    if(right.getElementById("curtime").innerText=="00:00:00"){
                        location.reload()
                    }
                }
                setInterval(function () {
                    if(right.getElementById("SaveStudyRecord").disabled != true){
                        right.getElementById("SaveStudyRecord").click()
                        setTimeout(function(){
                            location.reload()
                        },3000)
                    }
                },5000)
            }
        },10000)
    }

    function isCourseEnd(){
        if( document.querySelector("div.carry_prompt.text_center") && document.querySelector("div.carry_prompt.text_center").style.display!='none'){
            return true
        }
        if(document.querySelector("label.plan_time")==null) {
            return true
        }
        if(document.querySelector("label.plan_time") && document.querySelector("label.plan_time").style.display=='none') {
            return true
        }
        return false

    }

    function extractCourseIdFromUrl(url, param) {
        // 使用URLSearchParams解析URL中的查询参数
        const urlParams = new URLSearchParams(new URL(url).search);
        // 获取courseid参数的值
        const courseId = urlParams.get(param);
        return courseId;
    }

})();