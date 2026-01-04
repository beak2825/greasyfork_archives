// ==UserScript==
// @name         哔哩哔哩动态批量删除
// @namespace    https://github.com/zqrren/deleteBilibiliDynamic
// @version      0.1
// @description  try to take over the world!
// @author       zqrren
// @match        https://*.bilibili.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/412073/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A8%E6%80%81%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/412073/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A8%E6%80%81%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==
jQuery(document).ready(function ($) {
    'use strict';
    let a = document.querySelector("body > div.custom-navbar.shadow.blur.dark > ul").children;
    for(let b of a){let c=b.querySelector("a");if(c && c.text==="会员购"){console.log(":asdas");c.outerHTML = '<a href="javascript:void(0);" onclick="main()" >清除动态</a>'}}
    function getAttr(str,regex) {
        let m;
        if ((m = regex.exec(str)) !== null) {
            return m[1];
        }
        return null;
    }
    function del(id,csrf){
        let data = "dynamic_id="+id+"&csrf_token="+csrf+"&csrf="+csrf;
        $.ajax({
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            url: "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/rm_dynamic",
            data: data,
            success: function(){
                console.log(id);
            }
        })
    }
    function allDel(cookie){
        let csrf = getAttr(cookie,/bili_jct=([^;]+)/gm);
        for (let i = 0; i < Dids.length; i++) {
            const id = Dids[i];
            del(id,csrf);
        }
        location.reload()
    }
    function load(id,Did,cookie){
        $.ajax({
            type: "GET",
            xhrFields: {
                withCredentials: true
            },
            url: "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?visitor_uid="+id+"&host_uid="+id+"&offset_dynamic_id="+Did+"&need_top=1",
            success: function(data){
                let cards = data["data"]["cards"];
                if(!data["data"]["has_more"]){
                    allDel(cookie);
                    return;
                }
                for (let i = 0; i < cards.length; i++) {
                    const card = cards[i];
                    Dids.push(card["desc"]["dynamic_id_str"]);
                }
                load(id,Dids[Dids.length-1],cookie)
            }
        })
    }
    let Dids = [];
    main = function(){
        let cookie = document.cookie;
        let id = getAttr(cookie,/DedeUserID=([^;]+)/gm);
        load(id, 0, cookie);
    }
});
