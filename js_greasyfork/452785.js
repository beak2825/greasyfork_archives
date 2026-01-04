// ==UserScript==
// @name         湖南开放大学自动刷课
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  学习视频
// @author       hui
// @match        *.hnsydwpx.cn/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452785/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/452785/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    let hre = location.href;
    setInterval(() => {
        var class_login=document.querySelector("body > div > div > div.LftDBox > ul > li.LwxtsBox-title")
        if (class_login){
            document.querySelector("#closeWin").click()
            window.open("https://hnxxpt.zgzjzj.net/","_parent")}},1000)

    if(hre.match("www.hnsydwpx.cn/center.html")
      ) {
        setTimeout(() => {
            console.log('go to my course')
            document.querySelector('.center-main').childNodes[3].childNodes[5].childNodes[1].click()
        }, 2000)

        setTimeout(() => {
            try {
                if (document.getElementsByClassName('iframe')[0].contentWindow.document.getElementById('LearnInCompleteCount').innerHTML != '0') {
                    document.getElementsByClassName('iframe')[0].contentWindow.document.getElementById('LearnInCompleteCount').click()
                    document.getElementsByClassName('iframe')[0].contentWindow.document.getElementById('LearnInCompleteArr').childNodes.item(0).getElementsByTagName('button')[0].click()
                }
            } catch(err) {
                window.location.reload();
            }
        }, 5000)
    }

    if (hre.match("www.hnsydwpx.cn/play.html")) {
        setTimeout(() => {
            document.getElementById('courseCatalogue').childNodes.item(3).getElementsByTagName('div')[1].getElementsByTagName('a')[0].click()
        }, 5000)
    }

    if (hre.match("www.hnsydwpx.cn/getcourseDetails.html")) {
        setInterval(() => {
            var cource_list = document.getElementById('courseCatalogue').querySelector('.list-item').querySelectorAll('.item-list')
            var finished = true
            for(var i = 0; i < cource_list.length; i ++) {
                if (cource_list[i].querySelector('.item-list-progress').innerHTML != '100%') {
                    finished = false
                    break
                }
            }

            if (finished == true) {
                console.log("back home page")
                window.location.replace('https://www.hnsydwpx.cn/center.html')
            }
        }, 5000);
    }
})();