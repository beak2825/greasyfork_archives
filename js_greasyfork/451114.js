// ==UserScript==
// @name         让b站播放器摇起来
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  开启后会让b站播放器像摇篮一样摇起来
// @author       邻桌男孩
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      GPL v3.0
// @match        https://www.bilibili.com/video/*
// @downloadURL https://update.greasyfork.org/scripts/451114/%E8%AE%A9b%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%91%87%E8%B5%B7%E6%9D%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/451114/%E8%AE%A9b%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%91%87%E8%B5%B7%E6%9D%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sleep(delay){
        return new Promise(resolve => setTimeout(resolve, delay))
    }

    class lock{
        status = false
        acquire(){
            while(this.status){} // bad written pattern
            this.status = true
        }
        release(){
            this.status = false
        }
    }
    let rotater = {}
    rotater.lock = new lock()
    rotater.rotate_delays = new Map()
    rotater.EVENT_ROTATED = 'rotated'
    rotater.rotate_element_single = function (element, delay, degree) {
        return sleep(delay).then(()=>{
            element.style = `transform:rotate(${Math.floor(3 * Math.sin(degree / 30))}deg)`
            const event = new CustomEvent(rotater.EVENT_ROTATED, {bubbles: false, detail: {degree : degree}})
            element.dispatchEvent(event)
        })
    }
    rotater.rotate_event_handler = (evt) => {
        let degree = evt.detail.degree + 1
        let element = evt.target
        rotater.lock.acquire()
        if(rotater.rotate_delays.get(element)) {
            rotater.rotate_element_single(element, rotater.rotate_delays[element], degree)
        }
        rotater.lock.release()
    }
    rotater.rotate_element = function(element, initial, delay){
        rotater.lock.acquire()
        rotater.rotate_delays.set(element, delay)
        rotater.lock.release()
        element.removeEventListener(rotater.EVENT_ROTATED, rotater.rotate_event_handler)
        element.addEventListener(rotater.EVENT_ROTATED, rotater.rotate_event_handler)
        rotater.rotate_element_single(element, delay, initial)
    }
    rotater.delay_modify = function (element, delay){
        rotater.lock.acquire()
        rotater.rotate_delays.set(element, delay)
        rotater.lock.release()
    }
    let page_loaded = false

    function sleep_and_check(){
        sleep(300).then( async () => {
            page_loaded = document.querySelector("#playerWrap")
            if(page_loaded)
                sleep_and_exec()
            else
                sleep_and_check()
        })
    }

    function sleep_and_exec(){
        sleep(50).then( async () => {
            let player = document.querySelector("#playerWrap")
            rotater.rotate_element(player, 0, 100)
        })
    }

    // main
    sleep_and_check()

})();