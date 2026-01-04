// ==UserScript==
// @name         置顶每日乱弹
// @namespace    https://hi.cellmean.com/
// @version      0.1
// @description  May the Tweets Daily always on the Top without this script.
// @author       Falcon
// @match        https://www.oschina.net/tweets
// @match        https://my.oschina.net/*
// @icon         https://static.oschina.net/new-osc/img/favicon.ico
// @run-at       document-end
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/422279/%E7%BD%AE%E9%A1%B6%E6%AF%8F%E6%97%A5%E4%B9%B1%E5%BC%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/422279/%E7%BD%AE%E9%A1%B6%E6%AF%8F%E6%97%A5%E4%B9%B1%E5%BC%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.querySelector('.web-tweet-common') || document.querySelector('.tweet-detail-page') ){


        fetch('https://wwwosc.cellmean.com/daily-tweets?scope=entity&p=1&type=ajax',{
            method: 'GET',
            headers:{
                "Content-Type": "text/html"
            },
            mode: 'cors'
        })
        .then(res=> {
            if(res.ok) { // 此处加入响应状态码判断
                return res.text()
            }else{
                console.log('Fail:', JSON.stringify(res))
            }

        })
        .then(html=>{
            const parser=new DOMParser()
            const htmlDoc=parser.parseFromString(html, "text/html")
            const tweetItem = htmlDoc.querySelector('.tweet-item')
            const feed = document.querySelector('.sidebar .feed')
            feed.prepend(tweetItem)

        })
        .catch(error=>console.log('Error:',error))
    }
})();