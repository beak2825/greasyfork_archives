// ==UserScript==
// @name         通辽教育公共服务云《模拟真人自动刷课》
// @namespace    bug反馈或者有其他合作请加qq群：2159025656
// @version      0.5
// @description  进入到课程列表，点击右上角的开始模拟真人刷课按钮即可实现全自动挂机刷课。bug反馈或者有其他合作请加qq群：2159025656
// @author       ZhaCai
// @match        https://peixun.tlsjyy.com.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518210/%E9%80%9A%E8%BE%BD%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E4%BA%91%E3%80%8A%E6%A8%A1%E6%8B%9F%E7%9C%9F%E4%BA%BA%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E3%80%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/518210/%E9%80%9A%E8%BE%BD%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E4%BA%91%E3%80%8A%E6%A8%A1%E6%8B%9F%E7%9C%9F%E4%BA%BA%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E3%80%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var checkIntervalcc = null;
    var isXuanXiu = false
    // 创建一个按钮元素
    var button = document.createElement('button');
    button.textContent = '开始模拟真人刷课';
    button.style.position = 'fixed'; // 固定位置
    button.style.top = '10px'; // 距离顶部10px
    button.style.right = '10px'; // 距离右侧10px
    button.style.zIndex = 1000; // 确保按钮在最上层

    // 将按钮添加到页面上（通常是body的末尾）
    document.body.appendChild(button);
    var curIndex = -1;
    // 添加点击事件监听器
    button.addEventListener('click', function () {
        if (button.textContent == '自动模拟刷课中...') {
            alert("已在刷课中！！")
            return
        }
        checkIntervalcc = setInterval(function () {
            var okButton = document.querySelector('button.el-button.el-button--primary')
            if (okButton) {
                okButton.click()
            }
        }, 3000)

        curIndex = -1
        button.textContent = '自动模拟刷课中...';
        selFun()
    });

    function selFun() {

        if(isXuanXiu){
            let curClassName = document.querySelector('div.tab.tab_hover');
            if(curClassName.textContent != "选修课程"){
                let tabs = document.querySelectorAll('div.tab');
                for (let i = 0; i < tabs.length; i++) {
                    if(tabs[i].textContent == "选修课程"){
                        tabs[i].click()
                        setTimeout(function(){
                            selFun()
                        },1000)
                        return
                    }
                }
            }
        }
        
        //获取所有课程目录
        let list = document.querySelectorAll('li.course_li');
        if (list && list.length > 0) {
            curIndex++
            if (curIndex >= list.length) {
                if(isXuanXiu != true){
                    curIndex = -1
                    isXuanXiu = true
                    selFun()
                    return
                }
                if (checkIntervalcc) {
                    clearInterval(checkIntervalcc);
                    checkIntervalcc = null;
                }
                alert("已完成全部刷课")
                button.textContent = '开始模拟真人刷课';
                return
            }
            list[curIndex].addEventListener('click', function () {
                var checkInterval = setInterval(function () {
                    let list1 = document.querySelectorAll('div.el-progress__text');
                    console.log('文本内容:', list1.length);
                    if (list1.length > 0) {
                        clearInterval(checkInterval);
                        for (let i = 0; i < list1.length; i++) {
                            if (list1[i].textContent != "100%") {
                                let btn = document.querySelectorAll('div.el-space__item')[i].querySelector('li.section').querySelector('div.tit')
                                btn.addEventListener('click', function () {
                                    selFun1()
                                })
                                btn.click()
                                return
                            }
                        }
                        selFun()
                    }
                }, 500);
            })
            list[curIndex].click()
        } else {
            console.log("未找到数据，重新执行中...")
            setTimeout(function () {
                selFun()
            }, 1000)
        }
    }

    //检测视频
    function selFun1() {
        // var checkIntervalcc = setInterval(function () {
            // let playButton = document.querySelector('i.custom-icon.custom-icon-play-.icon')
            // if (playButton) {
                // console.log('开始播放')
                // clearInterval(checkIntervalcc);
                // playButton.click()
            // }
        // }, 3000)
        var checkIntervaldd = setInterval(function () {
            let video = document.querySelector('video')
            if (video) {
                console.log("找到视频")
                clearInterval(checkIntervaldd);
                if(document.querySelector('div.oper_box').textContent.includes("已学习")){
                    clearInterval(checkIntervalcc);
                    clearInterval(checkInterval11);
                    history.back();
                    setTimeout(function () {
                        curIndex = -1
                        selFun()
                    }, 5000)
                    return
                }
                video.addEventListener('ended', function () {
                    let endBtn = document.querySelector('div.button_box.button_box2')
                    console.log('结束播放')
                    endBtn.addEventListener('click', function () {
                        var checkInterval11 = setInterval(function () {
                            if (document.readyState === 'complete') {
                                // clearInterval(checkIntervalcc);
                                clearInterval(checkInterval11);
                                history.back();
                                setTimeout(function () {
                                    curIndex = -1
                                    selFun()
                                }, 5000)

                            }
                        }, 500)

                    })
                    endBtn.click()
                })
                video.play()
            } else {
                console.log("未找到视频")
            }
        }, 3000)
    }
})();