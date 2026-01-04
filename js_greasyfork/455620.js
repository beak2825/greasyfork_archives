// ==UserScript==
// @name         湖南开放大学
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  给女朋友做的，进入个人中心之后就会开始自动学习。
// @author       羊羊羊
// @match        *://www.hnsydwpx.cn/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455620/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/455620/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6.meta.js
// ==/UserScript==

(function () {
    let url = location.href;
    if (url.match("www.hnsydwpx.cn/center.html")) {
        setTimeout(() => {
            document.querySelector('.center-main').childNodes[3].childNodes[5].childNodes[1].click()
        }, 2000)
        setTimeout(() => {
            try {
                if (document.getElementsByClassName('iframe')[0].contentWindow.document.getElementById('LearnInCompleteCount').innerHTML != '0') {
                    document.getElementsByClassName('iframe')[0].contentWindow.document.getElementById('LearnInCompleteCount').click();
                    let classes = document.getElementsByClassName('iframe')[0].contentWindow.document.getElementsByClassName('classItem');
                    console.log("课程列表:",classes);
                    for (let i = 0; i < classes.length; i++) {
                        let item = classes.item(i).childNodes[1].childNodes[2].childNodes[1].childNodes[1].innerText.slice(0,-1);
                        console.log("单个课程:", item);
                        if(item != 100){
                            let button = classes.item(i).childNodes[2];
                            button.click();
                        }
                    }

                }
            } catch(err) {
                window.location.reload();
            }
        }, 5000)
    }

    if (url.match("www.hnsydwpx.cn/play.html")) {
        setTimeout(() => {
            let classes = document.getElementsByClassName('classItem');
            console.log("课程列表:",classes);
            for (let i = 0; i < classes.length; i++) {
                let item = classes.item(i).childNodes[2].innerText.slice(0,-1);
                console.log("单个课程:", item);
                if(item != 100){
                    let button = classes.item(i).childNodes[3];
                    console.log("按钮:", button);
                    button.click();
                }
            }
        }, 5000)
    }

    if (url.match("www.hnsydwpx.cn/getcourseDetails.html")) {
        setInterval(() => {
            let classes = document.getElementById('courseCatalogue').querySelector('.list-item').querySelectorAll('.item-list')
            let flag = true
            for(let i = 0; i < classes.length; i ++) {
                if (classes[i].querySelector('.item-list-progress').innerHTML != '100%') {
                    flag = false
                    break
                }
            }
            if (flag == true) {
                window.location.replace('https://www.hnsydwpx.cn/center.html')
            }
        }, 5000);
    }
})();