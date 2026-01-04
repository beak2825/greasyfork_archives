// ==UserScript==
// @name         雪球7*24新闻
// @namespace    http://iimondo.xueqiu.net/
// @version      0.1
// @description  拉取雪球新闻
// @author       iimondo
// @match        https://*/*
// @icon         https://xqdoc.imedao.com/17aebcfb84a145d33fc18679.ico
// @require      https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js
// @resource css https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466635/%E9%9B%AA%E7%90%837%2A24%E6%96%B0%E9%97%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/466635/%E9%9B%AA%E7%90%837%2A24%E6%96%B0%E9%97%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 加载外部css资源
    GM_addStyle(GM_getResourceText("css"));

    const notyf = new Notyf({
        duration: 1000 * 30,
        position: {
            x: 'right',
            y: 'top'
        },
        types: [
            {
                type: 'info',
                background: '#3dc763',
                icon: false
            }
        ]
    });


    let unread_news = GM_getValue("localNews");
    if(unread_news != undefined || unread_news != null){
        unread_news = JSON.parse(unread_news);
        read(unread_news);
        console.log(unread_news);

    } else {
        GM_xmlhttpRequest({
            method: "get",
            url: 'https://xueqiu.com/statuses/livenews/list.json?since_id=-1&max_id=-1&count=10',
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(r) {
                console.log(r);
                GM_setValue("localNews",JSON.stringify(JSON.parse(r.response).items)); // .reverse()
                // var intervalID = setInterval(myCallback, 500, 'Parameter 1', 'Parameter 2');
            }
        });
    }


    function notyfNews(news, index){
        if(index == 0){
            GM_deleteValue("localNews");

        } else {
            unread_news = unread_news.splice(index);
            GM_setValue("localNews", JSON.stringify(unread_news));
        }

        notyf.open({
            type: 'info',
            message: `<span style="cursor: pointer;">${news.created_at} · ${news.title}</span>`,
            dismissible: true,
            icon: false
        }).on('click', ({target, event}) => window.open(news.target));
    }


    function read(items){
        items.map(item => {
            let title = item.text.substring(item.text.indexOf("【") + 1, item.text.indexOf("】"));
            title = title !== "" ? title : item.text;
            return {
                "target": item.target,
                "created_at": new Date(item.created_at).toTimeString().substr(0, 5),
                "title": title,
                "origin": item.text
            }
        }).forEach((item, index) => {
            setTimeout(() => notyfNews(item, index), index * notyf.options.duration)
        });
    }


    document.addEventListener("visibilitychange",function(){
        if(document.visibilityState == "visible"){
            console.log("进入前台");
        }

        if(document.visibilityState == "hidden"){
            console.log("切换到后台")
        }
    });

})();