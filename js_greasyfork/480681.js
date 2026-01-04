// ==UserScript==
// @name         电影天堂优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  列表页：对评分进行红色强调
// @description  列表页：对评分大于7.5的条目红色强调
// @description  列表页，菜单可以只显示高分电影
// @description  详情页，点击标题可以跳到豆瓣
// @author       zqbinary
// @match        https://www.dy2018.com/html/gndy/jddyy/index*
// @match        https://dytt8.com/html/gndy/dyzz/*
// @match        https://www.dytt8.com/html/gndy/dyzz/*
// @match        https://www.dydytt.net/html/gndy/dyzz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dy2018.com
// @grant       GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480681/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/480681/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let reg2=/豆瓣评分[　| ](\d\.\d)\/10 /
    let reg1=/IMDb评分(\d\.\d)\/10/
    let onlyShowHigh=GM_getValue('onlyShowHigh',false)
    function hanleList() {

        let list = [...document.querySelectorAll('.co_content8>ul>table>tbody>tr:last-child')]

        for(let item of list){

            let res = reg2.exec(item.innerText)

            if(!res || !res.length) {
                res = reg1.exec(item.innerText)
                if(!res || !res.length) {
                    if(onlyShowHigh) {
                        hideItem(item)
                    }
                    continue
                }
            }
            let score = res[1]
            item.innerHTML=item.innerHTML.replace(score,'<span style="color:red">'+score+'</span>')
            if(score>=7.5){
                item.parentNode.parentNode.querySelector('tr:nth-child(2) a').style.color="red"
            } else {
                hideItem(item)

            }
        }
    }

    function hideItem(item) {
        item.parentNode.parentNode.style.display=onlyShowHigh ? "none":"block"
    }

    function handleOnlyHigh(){
        if(onlyShowHigh) {
            GM_setValue('onlyShowHigh',false)
            onlyShowHigh=false
        } else {
            GM_setValue('onlyShowHigh',true)
            onlyShowHigh=true
        }
        hanleList()

    }
    function showDoubanUrl(){

        let titleDom = document.querySelector("#header > div > div.bd2 > div.bd3 > div.bd3l > div.co_area2 > div.title_all > h1")
        if (titleDom) {

            let reg = /《(.*?)》/
            const match = titleDom.innerText.match(reg)
            if(match && match.length) {
                let url = `<a href="https://www.douban.com/search?cat=1002&q=${match[1]}" target="_blank">${titleDom.innerText}</>`
        titleDom.innerHTML=url
            }
        }


    }
    hanleList()
    setTimeout(showDoubanUrl,100)

    GM_registerMenuCommand(`【只要高分】`, handleOnlyHigh)
})();