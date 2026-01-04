// ==UserScript==
// @name         21tb.com-重庆人社配合软件专用-全自动2023
// @version      0.1
// @description  (自动完成视频|需配合软件|给老板开发的私人作品，大家勿下，免费的在这里：https://greasyfork.org/zh-CN/scripts/466569)
// @author       vx(shuake345)
// @match        *.21tb.com/els/html/*
// @match        https://cqrl.21tb.com/nms-frontend/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/1072479
// @downloadURL https://update.greasyfork.org/scripts/466570/21tbcom-%E9%87%8D%E5%BA%86%E4%BA%BA%E7%A4%BE%E9%85%8D%E5%90%88%E8%BD%AF%E4%BB%B6%E4%B8%93%E7%94%A8-%E5%85%A8%E8%87%AA%E5%8A%A82023.user.js
// @updateURL https://update.greasyfork.org/scripts/466570/21tbcom-%E9%87%8D%E5%BA%86%E4%BA%BA%E7%A4%BE%E9%85%8D%E5%90%88%E8%BD%AF%E4%BB%B6%E4%B8%93%E7%94%A8-%E5%85%A8%E8%87%AA%E5%8A%A82023.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState == "visible") {
            if (document.URL.search('nms-frontend') > 2) {
                setTimeout(dianji, 1254)
            }
        }
    });

    function gb() {
        window.close()
    }

    function sx() {
        window.location.reload()
    }

    function dianji() {
        if(localStorage.getItem('KCkey')==null){
            localStorage.setItem('KCkey', 0)
        }
        var Lookeds = localStorage.getItem('KCkey')
        var Timu = document.querySelectorAll('.text-item.cursor>img')
        if(Lookeds<8){
            Timu[Lookeds].click()
            Lookeds++
            localStorage.setItem('KCkey', Lookeds)
        }else{ //本页都看过了
            Lookeds=0
            document.getElementsByClassName('el-icon el-icon-arrow-right')[0].click()
            setTimeout(dianji, 3424)
        }
    }


    function enterCourse() { //点击没学的
        if (document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item.finish').length !== document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item').length) {
            document.querySelector('iframe').contentWindow.document.querySelector('[class="section-item"]').click();
        } else { //都学完了，关闭了
            document.getElementsByClassName('cl-go-link')[1].click()
            setTimeout(function() {
                document.getElementsByClassName('layui-layer-btn1')[0].click()
            }, 700)
            setTimeout(gb, 3201)

        }
    }

    function duibi() {
        if (Number(sessionStorage.getItem('key')) !== document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item.finish').length) {
            sessionStorage.setItem('key', document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item.finish').length)
            document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item')[document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item.finish').length].click();
        }
    }

    function qdandgb() {
        if (document.getElementsByClassName('only-one-btn elpui-layer-btn0').length > 0) {
            if (document.getElementsByClassName('only-one-btn elpui-layer-btn0')[0].click()) {
                document.getElementsByClassName('cl-go-link')[0].click()
                setTimeout(function() { //退出课程
                    document.getElementsByClassName('layui-layer-btn1')[0].click()
                }, 500)
                setTimeout(gb,3201)
            }
        }
    }

    function shixiaoduibi() {//第一步，读取看完的课程数量，16秒后读取第二次
        sessionStorage.setItem('shixiaokey', document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item.finish').length)
        setTimeout(shixiaoduibi2step,16450)
    }

    function shixiaoduibi2step() {//第2步，读取看完的课程数量，对比,关闭。或者返回第一步
        if (sessionStorage.getItem('shixiaokey') == document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item.finish').length) { //没进度，关了算了
            document.getElementsByClassName('cl-go-link')[1].click()
            setTimeout(function() {
                document.getElementsByClassName('layui-layer-btn1')[0].click()
            }, 700)
            setTimeout(gb, 3201)
        }
        setTimeout(shixiaoduibi,2454)
    }

    function Pd() {
        if (document.URL.search('courseStudyItem') > 2) {
            setTimeout(shixiaoduibi, 2254)
            setInterval(qdandgb, 5000)
            setInterval(duibi, 1000);
            setInterval(enterCourse, 5000);
        } else if (document.URL.search('nms-frontend') > 2) {
            setTimeout(dianji, 154)
        }
    }
    setTimeout(Pd, 2254)

})();