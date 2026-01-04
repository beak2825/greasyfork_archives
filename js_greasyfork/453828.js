// ==UserScript==
// @name         GreenStemstar
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take kids off games and videos!
// @author       younglet
// @match        https://code.stemstar.com/*
// @match        https://www.bilibili.com/*
// @match        https://search.bilibili.com/*
// @match        https://haokan.baidu.com/*
// @match        https://www.douyin.com/*
// @match        https://www.baidu.com/*
// @match        http://www.onlyscratch.com/*
// @match        https://www.scratch5.com/*
// @match        https://www.ixigua.com/*
// @license MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stemstar.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453828/GreenStemstar.user.js
// @updateURL https://update.greasyfork.org/scripts/453828/GreenStemstar.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var blackList = [
        'haokan.baidu.com',
        'bilibili.com',
        'onlyscratch',
        'scratch5',
        'member/favorite',
        'ixigua.com',
        '游戏',
        '%E6%B8%B8%E6%88%8F',//游戏
        '%E8%A7%86%E9%A2%91',//视频
        '%E5%8A%A8%E7%94%BB',//动画
        'ikun',
        '%E8%94%A1%E5%BE%90%E5%9D%A4',//蔡徐坤
        '%E5%9D%A4%E5%9D%A4',//坤坤
        '%E5%B0%8F%E9%BB%91%E5%AD%90',//小黑子
        '%E9%B8%A1%E4%BD%A0%E5%A4%AA%E7%BE%8E',//鸡你太美
        '%E5%8F%AA%E5%9B%A0',//只因
        '%E9%B8%A1',//鸡


    ]


    if(document.location.href  == 'https://code.stemstar.com/'){

    $(`a[href="/discovery/project"]`).parent().remove()

    var mainBody = $(`#app > section > main`)
    var btn = $(`#app > section > main > div > div > div.excellence > div.content > div.ex-right > div.ex-more > button`)

    $(`#app > section > main > div`).css( 'margin','20px')
    btn.css( 'margin','60px')
    }

    function handle(){
        blackList.forEach((host,i)=>{if( document.location.href.indexOf(host) >0 ){
            $('a').each((i,e)=>{e.href = 'https://code.stemstar.com'})
        }})


        if( document.location.href.indexOf('douyin.com') >0 ){
            $('div').each((i,e)=>{e.remove()})
        }
        if( document.location.href.indexOf('ixigua.com') >0 ){
            $('div').each((i,e)=>{e.remove()})
        }
        if( document.location.href.indexOf('member/favorite') >0 ){
            $(' div.member-favorite-wrap > div.member-project-page > div.common-blank').remove()
        }





         $(`a[href="/discovery/project"]`).parent().remove()


        if(document.location.href  == 'https://code.stemstar.com/'){
        console.log('hello')
            $(`a[href="/discovery/project"]`).remove()
            $(`a[href="/discovery/project"]`).parent().remove()
            $(`#app > section > main > div > div > div:nth-child(2)`).remove()
            console.log()
            if($(`#app > section > main > div > div`).children().length >=3 ){
                $(`#app > section > main > div > div > div:nth-child(2)`).remove()
                $(`#app > section > main > div > div`).append(btn)
            }

        }
        if(document.location.href  == 'https://code.stemstar.com/discovery/project'){
        console.log('hello')
            $(`#app > section > main > div`).remove()

        }
    }

    setInterval(handle,10)



})();