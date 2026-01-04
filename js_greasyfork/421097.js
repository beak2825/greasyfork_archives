// ==UserScript==
// @icon         http://9.url.cn/edu/lego_modules/edu-ui/0.0.1/img/nohash/logo_pc_rich.png
// @name         腾讯课堂-倍速观看，稳稳地
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  支持倍速修改，每次增加0.2倍速，或者减少0.2倍速，第一次写，由于有个兄弟写的脚本失效了，所以研究研究，找到关键的地方，进行修改，所以他的大部分代码我都略去了，现在代码量很小，而且我也只是在腾讯课堂学习，所以别的网站的我都删掉了，学习的Bamboo兄弟的代码，我也不知道怎么联系你，第一次写，谢谢你的思路
// @author       woniu
// @match        *://ke.qq.com/webcourse/*
// @run-at       document-end
// @note 2021-02-03 拥有自定义修改播放倍速的功能，由于我前端的东西掌的不多，所以比较丑陋，不过功能实现了，开箱即用
// @include      /^http(s?)://ke.qq.com/(.*)$/
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/421097/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82-%E5%80%8D%E9%80%9F%E8%A7%82%E7%9C%8B%EF%BC%8C%E7%A8%B3%E7%A8%B3%E5%9C%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/421097/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82-%E5%80%8D%E9%80%9F%E8%A7%82%E7%9C%8B%EF%BC%8C%E7%A8%B3%E7%A8%B3%E5%9C%B0.meta.js
// ==/UserScript==

// ==UserScript==
// @icon         http://9.url.cn/edu/lego_modules/edu-ui/0.0.1/img/nohash/logo_pc_rich.png
// @name         腾讯课堂-倍速观看，稳稳地
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  支持倍速修改，每次增加0.2倍速，或者减少0.2倍速，第一次写，由于有个兄弟写的脚本失效了，所以研究研究，找到关键的地方，进行修改，所以他的大部分代码我都略去了，现在代码量很小，而且我也只是在腾讯课堂学习，所以别的网站的我都删掉了，学习的Bamboo兄弟的代码，我也不知道怎么联系你，第一次写，谢谢你的思路
// @author       woniu
// @match        *://ke.qq.com/webcourse/*
// @run-at       document-end
// @note 2021-02-03 拥有自定义修改播放倍速的功能，由于我前端的东西掌的不多，所以比较丑陋，不过功能实现了，开箱即用
// @include      /^http(s?)://ke.qq.com/(.*)$/
// @run-at       document-end
// ==/UserScript==

(function(){
    var li1 = document.createElement("li")
    var li2 = document.createElement("li")
    var li3 = document.createElement("li")

    var delay = function(){
        var comm = document.querySelector("#main-video")
        //console.log(comm)
        comm.playbackRate=1
        li1.textContent = "提速 0.2"
        li2.textContent = "降速 0.2"
        li3.textContent = "当前速度为" + String(comm.playbackRate).slice(0,3)
        var pos = document.querySelectorAll(".loki-menu-container .loki-menu-list")[1]
//        for(let i=0; i<pos.childElementCount; i++){
  //          pos.remove(pos.children[i])
    //    }
        pos.appendChild(li1)
        pos.appendChild(li2)
        pos.appendChild(li3)

        li1.addEventListener("click", function(){comm.playbackRate+=0.2
                                                  li3.textContent = "当前速度为" + String(comm.playbackRate).slice(0,3)
                                                }, false)
        li2.addEventListener("click", function(){comm.playbackRate-=0.2
                                                 li3.textContent = "当前速度为" + String(comm.playbackRate).slice(0,3)
                                                }, false)
        // 清除水印，用的最low的方法，等我学点js之后在改，
        // 因为生成水印的函数是通过id找到其父元素的，那直接修改他父元素的id，让创建水印的函数失效就可以了，当然
        // 让水印失效有无数的方法，大家可以自己多尝试，多玩玩，就会了，我最近在学linux，会的地方希望能快点看完
        // 又不想快进，所以就慢慢研究，然后写了此脚本，今天突然发现水印也很烦，所以，需求才会引起创作，相信大家一定也可以的，奥利给
        // 祝大家新年快乐，万事如意！
        let video = document.querySelector("#loki-player")
        video.id = "change name"
        video.childNodes[video.childElementCount-1].remove()
    }
    setTimeout(delay, 3000)
}
)()