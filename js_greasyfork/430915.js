// ==UserScript==
// @name         age动漫视频播放器扩展
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  替换原有播放器，新增：自上次观看位置继续播放，播放结束自动跳转下一集，播放历史跳转到具体集数。后续考虑扩展到其他视频网站：检测iframe和video标签进行替换
// @author       林抱瓜
// @match        http://www.agefans.top/*
// @icon         https://www.google.com/s2/favicons?domain=agefans.top
// @grant        none
// @require https://cdn.bootcdn.net/ajax/libs/dplayer/1.25.0/DPlayer.min.js
// @require https://cdn.bootcdn.net/ajax/libs/js-cookie/latest/js.cookie.min.js

// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/430915/age%E5%8A%A8%E6%BC%AB%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/430915/age%E5%8A%A8%E6%BC%AB%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    review_history()
    add_zhougen()

    if(location.href.indexOf('acg') != -1){
        handle_cata();
    }
    if(location.href.indexOf('.html') != -1){
        set_history();
        handle_video();
        hide_info()
    }

})();
function hide_info(){
    document.querySelector("body > div.wrap > div:nth-child(3)").style.display = 'none'
    document.querySelector("body > div.wrap > div.playding.mb.clearfix").style.display = 'none'
}
function add_zhougen(){
    let father = document.querySelector("body > div.topall > div > ul.ls")
    let li = document.createElement('li')
    let a = document.createElement('a')
    a.className = 'ls1'
    a.innerText = '周更'
    a.href = 'http://www.agefans.top/zhougen/'
    li.appendChild(a)
    li.className = 'js1'
    father.appendChild(li)
}
function review_history(){
    let history_view = document.querySelector("body > div.topall > div > ul.ls > li > div")
    history_view.style.width = '400px'
    //历史记录更改到具体集数
    let btn = document.querySelector("body > div.topall > div > ul.ls > li > a")
    btn.onmouseover = function(){
        //每次会重新从cookie中加载，所以这里重新定义事件
        let his = document.querySelector("body > div.topall > div > ul.ls > li > div")
        his.style.display = 'block'
    }
    let video_history = document.querySelectorAll("#mh-ul > ul > li > a")
    for(let i=0; i< video_history.length; i++){
        let item = video_history[i]

        let super_url_start = item.href.lastIndexOf('acg')
        let super_url_end = item.href.lastIndexOf('/')
        let super_url = item.href.slice(super_url_start, super_url_end)

        let now_url = localStorage.getItem(super_url)
        if(now_url)
            item.href = now_url
    }

}
function set_history(){
    let super_url_start = location.href.lastIndexOf('acg')
    let super_url_end = location.href.lastIndexOf('/')
    let super_url = location.href.slice(super_url_start, super_url_end)
    localStorage.setItem(super_url,location.href)
}
function handle_cata(){

    //获取动漫的目录列表元素
    let list = document.querySelectorAll("#stab_1_71  ul > li > a");
    //下一集按钮
    let ul = document.querySelector("body > div.wrap > div.taba-down.mb.clearfix > div.pfromd.tab0.clearfix > ul")
    let li = document.createElement('li')
    ul.appendChild(li)
    li.innerText = '下一集'
    li.onclick = () => {
        let index;
        for(let i=0; i< list.length; i++){
            //定位当前正在播放的是哪一个
            if(location.href == list[i].href){
                index = i;
                break;
            }
        }
        console.log("集数" + index)
        if(index<1){
            return;
        }
        list[index - 1].click()
        console.log("集数" + index)
    }
    /*     //修改播放历史，记录当前播放集
    let cookie = document.cookie

        console.log(typeof( HISTORY));
    let super_url_index = location.href.lastIndexOf('/')
    let super_url = location.href.slice(0, super_url_index)
    let start_index = cookie.indexOf(super_url)
    console.log(start_index)
    let end_index = cookie.indexOf('\"',start_index)
    let now_cookie = cookie.slice(0,start_index) + location.href + cookie.slice(end_index)
    document.cookie = now_cookie
    console.log(document.cookie); */

    for(let i=0; i< list.length; i++){
        let item = list[i]
        item.parentNode.style.width = 'auto'
        item.parentNode.style['min-width'] = '90px'
        let text = item.innerText;
        let url = item.href;
        let now_time = localStorage.getItem(url)
        if(now_time)
            item.innerText = text + '(已看' + Math.round( now_time/60) + '分钟)'

        /*         //去除全部备用
        if(text.indexOf('备用')!=-1){
            list.splice(i,1);
            continue
        } */
        //点击时存储到历史记录
        /*         list[i].onclick = function(){
            let start_index = cookie.indexOf(super_url)
            console.log(start_index)
            if(start_index != -1){
                let end_index = cookie.indexOf('\"',start_index)
                let now_cookie = cookie.slice(0,start_index) + url + cookie.slice(end_index)
                document.cookie = now_cookie
            }
        } */
    }
}
function handle_video(){
    //获取动漫的目录列表元素
    let list = document.querySelectorAll("#stab_1_71  ul > li > a");

    let test = document.querySelector("#playiframe")
    console.log(test)
    let video_src = decodeURIComponent(test.src)
    let start = video_src.search('vid=') + 4
    let end = video_src.indexOf('&')
    let src = video_src.slice(start,end)
    console.log(src)
    /*     if(src.indexOf('.mp4') == -1){
        return
    } */

    //注入video标签

    //引入script及css       1.9.1的最新版有问题，不断跳出错误
    /*     let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = "https://cdn.bootcdn.net/ajax/libs/dplayer/1.25.0/DPlayer.min.js";
    document.documentElement.appendChild(script); */

    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.href = "https://cdn.bootcdn.net/ajax/libs/dplayer/1.25.0/DPlayer.min.css";
    document.documentElement.appendChild(link);

    let video_ele = document.createElement('div')
    video_ele.style.height = '100%'
    video_ele.style.width = 'auto'
    video_ele.id = 'lin_player'

    //视频播放器
    let player = document.querySelector("#player")
    player.appendChild(video_ele)
    test.remove()

    //注入播放器
    let dp = new DPlayer({
        container: document.getElementById('lin_player'),
        autoplay: true,
        video: {
            url: src,
        },
    });
    //如果视频播放失败，还原
    dp.on("error", () => {
        player.appendChild(test)
        video_ele.remove()
    })

    //跳转到历史位置
    let to_time = localStorage.getItem(location.href)
    dp.seek(to_time)

    //播放结束后自动下一个
    dp.on("ended",() => {
        console.log('video end')
        let index;
        for(let i=0; i< list.length; i++){
            //定位当前正在播放的是哪一个
            if(location.href == list[i].href){
                index = i;
                break;
            }
        }
        if(index<1){
            return;
        }

        dp.notice('即将播放下一集',3000)
        //倒计时
        let timeout = setTimeout(function(){
            clearTimeout(timeout)
            list[index--].click()
            //             location.assign(list[index-1].href)
        },3000)
        })

    //记录播放进度
    dp.on("timeupdate", () => {
        let current = dp.video.currentTime
        //         console.log(current,location.href)
        localStorage.setItem(location.href,current)
    })
    /*     setInterval(function(){
        let current = dp.video.currentTime
        console.log(current,location.href)
        localStorage.setItem(location.href,current)
    }, 5000) */

};