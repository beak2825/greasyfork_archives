// ==UserScript==
// @name         bilibili comment portal
// @name:zh-CN   B站评论部署传送门
// @namespace    https://greasyfork.org/users/1001518
// @version      0.1
// @description  在B站视频及动态评论区添加评论传送门。
// @author       DianaBlessU
// @match        https://*.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        unsafeWindow
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/457057/bilibili%20comment%20portal.user.js
// @updateURL https://update.greasyfork.org/scripts/457057/bilibili%20comment%20portal.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const tag_tmp = '<a href="https://www.bilibili.com/h5/comment/sub?oid={oid}&pageType={type}&root={id}" target="_blank" class="portal">{text}</a>'
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

    const format_map = (string, map) => {
        let result = string
        for (var key in map) {
            if(map[key] !== undefined){
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, map[key]);
            }
        }
        return result
    }

    const get_comment_containers = () => {
        if (is_new) {
            if (unsafeWindow.__INITIAL_STATE__ && unsafeWindow.__INITIAL_STATE__.aid){
                return document.querySelectorAll(".reply-list");
            }else{
                return new Set()
            }
        } else {
            return document.querySelectorAll(".comment-list");
        }
    }

    const get_comment_conf = (cc) => {
        if (is_new) {
            return {oid:unsafeWindow.__INITIAL_STATE__.aid, type:1}
        }else{
            let conf = null;
            let c = cc.querySelector(".list-item")
            if (c){
                let dstr = c.getAttribute("mr-show");
                if (dstr) {
                    conf = JSON.parse(dstr).msg
                }
            }
            return {oid:conf.oid, type:conf.type}
        }
    }

    const get_comment_list = (cc) => {
        if (is_new) {
            return cc.querySelectorAll(".root-reply-container")
        }else{
            return cc.querySelectorAll(".list-item, .reply-item")
        }
    }

    const add_comment_portal = (c, conf) => {
        if (is_new) {
            conf.id = c.querySelector(".root-reply-avatar").dataset.rootReplyId;
            let el_rinfo = c.querySelector(".reply-info");
            if (el_rinfo.getElementsByClassName("portal").length == 0){
                let el_rtime = el_rinfo.querySelector(".reply-time");
                conf.text = el_rtime.textContent;
                el_rtime.innerHTML = format_map(tag_tmp, conf)
            }
        }else{
            conf.id = c.dataset.id;
            let el_rinfo = c.querySelector(".info");
            if (el_rinfo.getElementsByClassName("portal").length == 0){
                let el_rtime = el_rinfo.querySelector(".reply-time");
                conf.text = el_rtime.textContent;
                el_rtime.innerHTML = format_map(tag_tmp, conf)
            }
        }
    }


    let patrol = setInterval(()=>{
        let cclist = get_comment_containers()
        if (cclist.length != 0){
            // clearInterval(patrol)
            cclist.forEach(cc => {
                let conf = get_comment_conf(cc)
                let clist = get_comment_list(cc)
                if (clist.length != 0){
                    clist.forEach(c => {
                        add_comment_portal(c, conf);
                    })
                }
            });
        }
    }, 4000)
})();