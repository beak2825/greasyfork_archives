// ==UserScript==
// @name         bilibili直播回放弹幕过滤
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  过滤并收集【直播回放】的同传翻译的弹幕，方便理解录播内容
// @author       Chatinfer
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452527/bilibili%E7%9B%B4%E6%92%AD%E5%9B%9E%E6%94%BE%E5%BC%B9%E5%B9%95%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/452527/bilibili%E7%9B%B4%E6%92%AD%E5%9B%9E%E6%94%BE%E5%BC%B9%E5%B9%95%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    var timer = null

    var dmk = new Array()
    var dmk_r = { }
    var dmk_i = 0
    var dmk_d = 0

    document.body.insertAdjacentHTML('afterbegin', "<textarea id='chatinfer-dmk-a'></textarea>")
    var dmk_a = document.getElementById("chatinfer-dmk-a")



    dmk_a.innerHTML = dmk_a.innerHTML + ""

    function dmk_push(e) {

        if (typeof(dmk_r[e]) == 'undefined') {

            dmk.push(e)
            dmk_r[e] = dmk_i
            dmk_i = dmk_i + 1
        }
    }

    function dmk_pop() {

        let p = dmk.pop()
        dmk_d = dmk_r[p]

        delete(dmk_r[p])
    }

    function dm_filter() {

        //console.warn("danmaku filting.")

        if (-1 ==("" + document.body.getElementsByClassName("title-text")[0].innerHTML).indexOf("【直播回放】")) {
            clearInterval(timer)
            dmk_a.remove()
            return
        }

        let k = document.body.getElementsByClassName('b-danmaku')

        //console.warn("let k = ...")

        if (k == null) {

            //console.warn("k == null")
            return
        }

        if (k.length == 0) {

            //console.warn("k.length == 0")
            return
        }

        var r = ""
        var ls = new Array()


        for (var i = 0; i < k.length; i++) {

            var e = k[i].innerHTML + ""

            //console.warn(e)

            if (e.indexOf("[") >= 0 || e.indexOf("【") >= 0) {

                //console.warn(e)
                ls.push(e)
                dmk_push(e)
            }
            //r = r + e.innerHTML + "\n"
        }

        for (var j = 0; j < ls.length; j++) {

            r = r + ls[j] + "\n"
        }


        //console.warn(r + "count:" + k.length)


        var r2 = ""

        for (var x = 0; x <dmk.length; x++) {

            r2 = dmk[x] + "\n" + r2
        }

        if(r2.length != dmk_a.innerHTML.length) {
            dmk_a.innerHTML = r2
        }

        console.warn(dmk_a.innerHTML)

    }

    setTimeout(() => {

        setTimeout(() => {

            dmk_a.style.position = "fixed"
            dmk_a.style.bottom = "80px"
            dmk_a.style.left = "0px"
            dmk_a.style.height = "200px"
            dmk_a.style.width = "600px"
            dmk_a.style.zIndex = 1000000
            dmk_a.style.fontSize = "20px"
            dmk_a.style.color = "white"
            dmk_a.style.background = "black"
            dmk_a.style.opacity = 0.5
        }, 1000)

        timer = setInterval(dm_filter, 1000)
    }, 1000)
    // Your code here...
})();