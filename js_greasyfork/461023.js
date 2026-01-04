// ==UserScript==
// @name         BOSS直聘过滤未沟通，并且一键打开所有岗位脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BOSS直聘过滤已谈过的boss，并且支持打开所有未沟通的职位，方便点击沟通。
// @author       岁月如故
// @copyright       2023-2023, AC
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @match        https://www.zhipin.com/web/geek/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/461023/BOSS%E7%9B%B4%E8%81%98%E8%BF%87%E6%BB%A4%E6%9C%AA%E6%B2%9F%E9%80%9A%EF%BC%8C%E5%B9%B6%E4%B8%94%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E5%B2%97%E4%BD%8D%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/461023/BOSS%E7%9B%B4%E8%81%98%E8%BF%87%E6%BB%A4%E6%9C%AA%E6%B2%9F%E9%80%9A%EF%BC%8C%E5%B9%B6%E4%B8%94%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E5%B2%97%E4%BD%8D%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



// 火狐浏览器需要去设置-隐私和安全-阻止弹出式窗口-添加BOSS网址
(function() {
    'use strict';


    // 测试
    var toTopBtn = document.createElement('button')
    toTopBtn.innerHTML = "过滤已沟通职位"
    toTopBtn.className = "a-b-c-d-toTop"
    toTopBtn.onclick = function (e) {
        filter(false)
        
    }
    var body = document.body
    var style = document.createElement('style')
    style.id = "a-b-c-d-style"
    var css = `.a-b-c-d-toTop{
    position: fixed;
    bottom: 20%;
    right: 5%;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    font-size: 15px;
    z-index: 999;
    cursor: pointer;
    font-size: 12px;
    overflow: hidden;
    }`
    if (style.styleSheet) {
    style.styleSheet.cssText = css;
    } else {
    style.appendChild(document.createTextNode(css));
    }
    body.appendChild(toTopBtn)
    body.appendChild(style)


    // 测试
    var toTopBtn1 = document.createElement('button')
    toTopBtn1.innerHTML = "过滤已沟通并打开所有职位"
    toTopBtn1.className = "aa-b-c-d-toTop"
    toTopBtn1.onclick = function (e) {
        filter(true)
        
    }
    var body1 = document.body
    var style1 = document.createElement('style')
    style1.id = "aa-b-c-d-style"
    var css1 = `.aa-b-c-d-toTop{
    position: fixed;
    bottom: 10%;
    right: 5%;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    font-size: 15px;
    z-index: 999;
    cursor: pointer;
    font-size: 12px;
    overflow: hidden;
    }`
    if (style1.styleSheet) {
    style1.styleSheet.cssText = css1;
    } else {
    style1.appendChild(document.createTextNode(css1));
    }
    body1.appendChild(toTopBtn1)
    body1.appendChild(style1)



    // 过滤
    function filter(isShow = false) {
        var liList = $(".job-list-wrapper ul li.job-card-wrapper");
        

        if(liList.length > 0) {

            console.log(liList)
            console.log(liList.length)

            for(var i = 0; i < liList.length; i++) {
                var item = $(liList[i])
                var f = item.find("a.start-chat-btn")
                if(f.text() == "继续沟通") {
                    item.css("display", "none")

                }else {
                    // 弹窗
                    if(isShow) {
                        item.find("div.job-card-body")[0].click()
                    }
                }
            }

            clearInterval(interval); 
        }
    }

    // 筛选已沟通过的职位
    // var interval =  setInterval(function(){//开启一个计时器，在这里面写所有页面渲染完成之后，要执行的代码
    //     filter()

    // }, 500);


    // window.onload = showNew
    // Your code here...
})();




