// ==UserScript==
// @name         spotify ads mute
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  player mute when ads
// @author       bestcondition
// @match        *://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?domain=spotify.com
// @grant        none
// @license      Apache License
// @downloadURL https://update.greasyfork.org/scripts/436983/spotify%20ads%20mute.user.js
// @updateURL https://update.greasyfork.org/scripts/436983/spotify%20ads%20mute.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let interval_time = 100
    let status = {open:new Object(),close:new Object()}
    //获取当前状态
    function get_status(){
        let volume_dom = document.querySelector("#main > div > div.Root__top-container > div.Root__now-playing-bar > footer > div > div.bDlFk88ZkAqtN2qFU9sA > div > div.volume-bar > div > label > input[type=range]")
        if(volume_dom){
            let volume = volume_dom.value
            return volume === '0'?status.close:status.open
        }
        return status.open
    }
    function get_trumpet_dom(){
        return document.querySelector("#main > div > div.Root__top-container > div.Root__now-playing-bar > footer > div > div.bDlFk88ZkAqtN2qFU9sA > div > div.volume-bar > button")
    }
    function close(){
        if( get_status() === status.open){
            get_trumpet_dom().click()
            console.log('close!')
        }
    }
    function open(){
        if(get_status()===status.close){
            get_trumpet_dom().click()
            console.log('open!')
        }
    }
    function interval_func(){
        if(document.title.startsWith('Spotify')){
            close()
        }else{
            open()
        }
    }
    let my_interval = setInterval(interval_func,interval_time)
    // Your code here...
})();