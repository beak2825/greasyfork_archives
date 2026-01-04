// ==UserScript==
// @name         豆瓣咔黑护盾
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  干活带盾更抗伤
// @author       碎冰冰
// @match        *://www.douban.com/group/topic/*
// @match        *://www.douyin.com/video/*
// @match        *://weibo.com/*
// @match        *://m.weibo.cn/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/484802/%E8%B1%86%E7%93%A3%E5%92%94%E9%BB%91%E6%8A%A4%E7%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/484802/%E8%B1%86%E7%93%A3%E5%92%94%E9%BB%91%E6%8A%A4%E7%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // const event = document.createEvent('Events');
    // event.initEvent( 'click', true, true );
    const event = new Event('click', {
        bubbles: true,
        cancelable: true
        });
    let href = document.location.href;

    if(href.includes("://www.douban.com/group/topic/")){
        alert("douban_PC")
        let ka_douban = document.querySelector("#link-report_group > span");
        let comments=document.getElementById("comments");
        let popular_comments=document.getElementById("popular-comments");
        let link_report=document.getElementById("link-report");
        let h1 = document.querySelector("#content > div > div.article > h1")
        //var groups = {"花渣聚集地":"","豆瓣句号小组":"","收视明灯组":""};
        let in_group=document.querySelector("#g-side-info-member > div > div > div.info > div.title > a");
        let notin_group=document.querySelector("#g-side-info > div.bd > div > div.info > div > a");
        let groupname = in_group ? in_group : notin_group;
        if(link_report!=null && comments!=null && groupname.innerText != "密谋霸占华晨宇基地"){
            link_report.style.display="none";
            h1.style.display="none";
            comments.style.display="none";
            popular_comments.style.display="none";
            ka_douban.dispatchEvent(event);
        }
    }else if(href.includes("://www.douyin.com/video/")){
        alert("douyin_PC")
        let ka_douyin = document.getElementsByClassName("aryhJWD7");
        //let video=document.querySelector("#douyin-right-container > div:nth-child(2) > div > div.leftContainer.gkVJg5wr > div.zS59Q2nW.CwuzSMFj.video-detail-container.newVideoPlayer.isDanmuPlayer.detailNotFullScreen > div > xg-video-container > video")//null选不中
        //let video = document.getElementsByTagName("xg-video-container"); //null选不中
        let video = document.getElementsByClassName("T8KOH9z5");
        let h1_douyin = document.getElementsByClassName("x_vgJ3yL");
        //let h1_douyin = document.querySelector(".hE8dATZQ");//null选不中
        let comments_douyin = document.getElementsByClassName("HV3aiR5J");
        //let related_douyin = document.getElementsByClassName("fhcniom_"); //选中关不掉
        //
        //alert(targetElement); //突然变undefine？不应该是HTML div element吗
        setTimeout(function () {
            if(video[0] != null && h1_douyin[0] != null && comments_douyin[0] != null){
                video[0].style.display="none";
                h1_douyin[0].style.display="none";
                comments_douyin[0].style.display="none";
                //related_douyin[0].style.display="none"; //关不掉
            }
            ka_douyin[0].dispatchEvent(event);
        }, 2000);
    }else if(href.includes("://weibo.com/")){
        window.onload = function() {
            let comments_wbpc_list=document.querySelectorAll('div.item1>div.item1in div.text>span')
                comments_wbpc_list.forEach(comments_wbpc => {
                    console.log(comments_wbpc.innerText);
                    comments_wbpc.style.display="none";
            });
            //image
            let image_wbpc_list=document.querySelectorAll('div.woo-picture-main')
                image_wbpc_list.forEach(image_wbpc => {
                    image_wbpc.style.display="none";
            });
        };
        // let likes=document.getElementByClassName("lite-iconf-like");
    }else if(href.includes("://m.weibo.cn/detail/")){
        alert("//weibo_tele")
        window.onload = function() {
            let comments_wbm_list=document.querySelectorAll('div.m-text-box>h3')
                comments_wbm_list.forEach(comments_wbm => {
                    console.log(comments_wbm.innerText);
                    comments_wbm.style.display="none";
            });
            //image
            let image_wbm_list=document.querySelectorAll('span.comment-con-img')
                image_wbm_list.forEach(image_wbm => {
                    console.log(image_wbm.innerHTML);
                    image_wbm.style.display="none";
            });
        }
    }
})();