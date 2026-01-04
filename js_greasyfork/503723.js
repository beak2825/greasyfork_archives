
        // ==UserScript==

// @name         bev审核
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  研思科技脚本
// @author       ErikPan
// @match        http://192.168.68.12/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503723/bev%E5%AE%A1%E6%A0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/503723/bev%E5%AE%A1%E6%A0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function click_all(){

        setTimeout(()=>{
            var frame_list=document.getElementsByClassName("frame-item")
            for(let j =0;j<frame_list.length;j++){
            setTimeout(()=>{
            frame_list[j].click()
            setTimeout(()=>{
                let item_list=document.getElementsByClassName("annotation-tabs__content")[0].children[0].getElementsByClassName("annotation-tree-node")
                for(var i =0;i<item_list.length;i++){
                    item_list[i].click()
                }},500)

        },1000*j)


        }
        },10000)

    }
    click_all()
    setTimeout(()=>{
        document.getElementsByClassName("annotation-button")[28].click()
        setTimeout(()=>{
            document.getElementsByClassName("annotation-button--primary")[17].click()
        },1000)
        },20000)

  })();


