// ==UserScript==
// @name         湖南开放大学自动刷课
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  学习视频
// @author       Aether
// @match        *://www.hnsydwpx.cn/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455283/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/455283/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
// (document.getElementsByClassName('iframe')[0].contentWindow.document.getElementById('LearnInCompleteArr').childNodes.item(0).getElementsByTagName('button')[0].innerHTML != '0')
(function () {
    let hre = location.href;
    if (
      hre.match("www.hnsydwpx.cn/center.html")
    ) {
        setTimeout(() => {
            console.log('go to my course')
            document.querySelector('.center-main').childNodes[3].childNodes[5].childNodes[1].click()
        }, 2000)

        setTimeout(() => {
            try {
                if (document.getElementsByClassName('iframe')[0].contentWindow.document.getElementById('LearnInCompleteCount').innerHTML != '0') {
                    document.getElementsByClassName('iframe')[0].contentWindow.document.getElementById('LearnInCompleteCount').click()
                }
                if (document.getElementsByClassName('iframe')[0].contentWindow.document.getElementById('LearnInCompleteArr').childNodes.item(1).getElementsByTagName('button')[0] > '0'){
                    document.getElementsByClassName('iframe')[0].contentWindow.document.getElementById('LearnInCompleteArr').childNodes.item(1).getElementsByTagName('button')[0].click()
                }
                else {
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
            document.querySelector("body > div.container > div > div > div.topic-list > div.list-header > button").click()
            //window.location.replace('https://www.hnsydwpx.cn/center.html')
        }
        if(document.getElementsByClassName('xgplayer xgplayer-pc xgplayer-skin-default xgplayer-playing xgplayer-volume-large xgplayer-pause') != "0"){document.getElementsByClassName("xgplayer-icon-play")[1].click()}
      }, 5000);
    }
  })();