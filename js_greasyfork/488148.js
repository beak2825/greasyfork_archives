// ==UserScript==
// @name         从B站提取音频
// @namespace    https://home.cnblogs.com/u/thetheOrange
// @version      2024-02-16
// @description  js is so difficult to code!!!qwq
// @author       thetheOrange
// @match        https://www.bilibili.com/video/*
// @license      GPL2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488148/%E4%BB%8EB%E7%AB%99%E6%8F%90%E5%8F%96%E9%9F%B3%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/488148/%E4%BB%8EB%E7%AB%99%E6%8F%90%E5%8F%96%E9%9F%B3%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    // 交互下载的超链接
    const download_a = document.createElement("a");
    const body = document.querySelector("body");
    download_a.setAttribute("style", `
        background-color: #00aeec;
        text-decoration: none;
        padding: 0 10px;
        font-size: 20px;
        color: white;
        border-radius: 5px;
        position: absolute;
        top: 16px;
        left: 10px;
        z-index: 9999;
    `)
    download_a.textContent = "下载音频";
    body.insertAdjacentElement("afterbegin", download_a);

    function wrapState(action) {
        // 获取原始定义
        let raw = history[action];
        return function () {
            // 经过包装的pushState或replaceState
            let wrapper = raw.apply(this, arguments);
            // 定义名为action的事件
            let e = new Event(action);
            // 将调用pushState或replaceState时的参数作为stateInfo属性放到事件参数event上
            e.stateInfo = { ...arguments };
            // 调用pushState或replaceState时触发该事件
            window.dispatchEvent(e);
            return wrapper;
        }
    }

    //修改原始定义
    history.pushState = wrapState("pushState");
    history.replaceState = wrapState("replaceState");

    function get_audio() {
        // 1 获取cid
        // 1.1 通过window.location.href 获取基础的url
        const base_url = window.location.href;
        // 1.2 用正则表达式提取bv号
        const re = /(BV.*)\//;
        let bv = re.exec(base_url)[1];
        // 1.3 调用https://api.bilibili.com/x/web-interface/view?bvid= 获取cid
        fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bv}`, {
            method: "get"
        }).then(response => {
            return response.json();
        }).then(response => {
            // 2 获取音频下载地址
            // 2.1 调用playurl接口获取音频地址
            let cid = response.data.cid;
            fetch(`https://api.bilibili.com/x/player/wbi/playurl?bvid=${bv}&cid=${cid}&qn=80&fnver=0&fnval=4048&fourk=1`, {
                method: "get",
                headers: {
                    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.203",
                    "Referer": base_url
                }
            }).then(response => {
                return response.json();
            }).then(response => {
                // 2.2 提取出音视频URL，并让超链接指向
                let audio_url = response.data.dash.audio[0].baseUrl;
                if (audio_url) {
                    download_a.href = audio_url;
                }
            })
        })
    }
    get_audio();
    window.addEventListener("pushState", function (){
        get_audio();
    })
    window.addEventListener("replaceState", function (){
        get_audio();
    })

})();