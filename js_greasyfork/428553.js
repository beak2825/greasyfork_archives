// ==UserScript==
// @name         哔哩哔哩推荐-
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  哔哩哔哩推荐模块
// @author       You
// @match        https://*.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428553/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8E%A8%E8%8D%90-.user.js
// @updateURL https://update.greasyfork.org/scripts/428553/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8E%A8%E8%8D%90-.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /**
     * 秒 转 可阅读的时长
     * @param secondDuration
     */
    function utilSecond2StrChinese(secondDuration = 0) {
        let day = Math.floor(secondDuration / (60 * 60 * 24));
        secondDuration -= day * (60 * 60 * 24);
        let hour = Math.floor(secondDuration / (60 * 60));
        secondDuration -= hour * (60 * 60);
        let minute = Math.floor(secondDuration / (60));
        secondDuration -= minute * (60);
        return (day ? day + '天' : '')
            + (hour ? hour + '时' : '')
            + (minute ? minute + '分' : '')
            + (secondDuration ? secondDuration + '秒' : '');
    }
    /**
     * 播放量 转 几万播放量
     * @param secondDuration
     */
    function utilPlayTimes2TenThousands(playTimes = 0) {
        if (playTimes < 10000) {
            return playTimes;
        }
        return (playTimes / 10000).toFixed(1) + '万';
    }
    /*时间(今年的没年份)*/
    function utilDate2Str(date) {
        let curDate = new Date();
        return !date ? ''
            : (date.getFullYear() === curDate.getFullYear() ? '' : date.getFullYear() + '年')
            + (date.getMonth() + 1) + '月'
            + date.getDate() + '日';
    }

    let html = `
<a class="btn contact-help" id="open-my-recommend" onclick="document.getElementById('my-bilibili-recommend').style.display='block'">推荐页</a>
<div id="my-bilibili-recommend" style="display:none;">
    <a class="btn out-btn-my-recommend" id="close-my-recommend">返回</a>
    <a class="btn out-btn-my-recommend" id="refresh-my-recommend" style="top:40px">刷新</a>
    <a class="btn out-btn-my-recommend" id="top-my-recommend" style="top:80px">顶部</a>
    <div class="recommend-content" style="text-align: center;">
    </div>
</div>
    `;
    let style = `
    <style>
        .out-btn-my-recommend {
            position: fixed;
            left: 0;
            width: 20px;
            padding: 3px;
            background: #fff;
            line-height: 17px;
            cursor: pointer;
        }

        #open-my-recommend {
            height: 60px;
            top: calc(50% - 100px);

            -webkit-text-size-adjust: 100%;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            font: 12px -apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif;
            -webkit-font-smoothing: antialiased;
            box-sizing: border-box;
            margin: 0;
            outline: none;
            cursor: pointer;
            touch-action: manipulation;
            text-decoration: none;
            position: fixed;
            z-index: 101;
            left: 0;
            margin-top: -36px;
            width: 28px;
            transition: all .3s;
            font-size: 12px;
            color: #505050;
            background: #fff;
            border: 1px solid #e7e7e7;
            box-shadow: 0 6px 10px 0 #e7e7e7;
            border-radius: 0 2px 2px 0;
            padding: 8px 7px;
            line-height: 14px;
            height: 60px;
            top: calc(50% - 100px);
        }

        div#my-bilibili-recommend {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            background: #FFF;
            z-index: 10000;
            overflow: auto;
        }

        #my-bilibili-recommend .recommend-content {
            width: calc(100% - 20px);
            float: right;
        }

        #my-bilibili-recommend .recommend-video {
            width: 450px;
            height: 170px;
            overflow: hidden;
            position: relative;
            padding: 5px 5px 5px 0;
            /*display: inline-block;*/
            float:left;
            text-align: left;
        }

        #my-bilibili-recommend .recommend-video .recommend-video-img {
            width: calc(100% - 150px);
            overflow: hidden;
            height: 100%;
            float: left;
        }

        #my-bilibili-recommend .recommend-video img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        #my-bilibili-recommend a.recommend-video-info {
            display: block;
            float: left;
            width: 150px;
            height: 100%;
            position: relative;
            font-size: 14px;
        }

        #my-bilibili-recommend a.recommend-video-info > div {
            padding: 0 5px;
        }

        #my-bilibili-recommend .recommend-video-user {
            position: absolute;
            bottom: 0;
            left: 0;
        }

        #my-bilibili-recommend .recommend-video-time {
            position: absolute;
            bottom: 0;
            right: 0;
        }

        #my-bilibili-recommend .recommend-video-play-times {
            position: absolute;
            bottom: 17px;
        }

        #my-bilibili-recommend .recommend-video-duration {
            position: absolute;
            bottom: 34px;
        }

        #my-bilibili-recommend .recommend-video-play-tags {
            position: absolute;
            bottom: 17px;
            right: 0;
        }


        #page-follows > div > div.follow-sidenav > div.nav-container.follow-container > div.be-scrollbar.follow-list-container.ps {
            max-height: unset !important;
        }
        #page-fav > div.col-full.clearfix.master > div.fav-sidenav > div:nth-child(1) > div:nth-child(2) #fav-createdList-container {
            max-height: unset !important;
        }
    </style>
    `
    let div = document.createElement('div');
    document.body.append(div);
    div.innerHTML += html + style;
    function getVideoHtml(video) {
        if (document.querySelector('.recommend-video[videoId="'+video.id+'"]') != null) {
            return ``;
        }
        return `
        <div class="recommend-video" title="${video.title}" videoId="${video.id}">
            <div class="recommend-video-img"><a href="${video.uri}" target="_blank"><img src="${video.pic}"></a></div>
            <a class="recommend-video-info" href="${video.uri}" target="_blank">
                <div class="recommend-video-title">${video.title.substring(0, 40)}</div>
                <div class="recommend-video-play-times">${utilPlayTimes2TenThousands(video.stat.view)}</div>
                <div class="recommend-video-user">${video.owner.name}</div>
                <div class="recommend-video-duration">${utilSecond2StrChinese(video.duration)}</div>
            </a>
        </div>
        `
    }
    function eleCommendContent() {
        return document.querySelector('#my-bilibili-recommend .recommend-content');
    }

    document.getElementById('open-my-recommend').onclick = document.getElementById('close-my-recommend').onclick = function () {
        let recommend = document.getElementById('my-bilibili-recommend');
        if (recommend.style.display === 'none') {
            recommend.style.display = 'block';
            document.documentElement.style.overflow = 'hidden';
            if (containerTooLess()) {
                RestGetVideoList();
            }
        } else {
            recommend.style.display = 'none';
            document.documentElement.style.overflow = 'auto';
        }
    };
    document.getElementById('refresh-my-recommend').onclick = function () {
        eleCommendContent().innerHTML = '';
        RestGetVideoList();
    };
    document.getElementById('top-my-recommend').onclick = function () {
        document.querySelector("#my-bilibili-recommend").scrollTop = 0;
    };

    // RestGetVideoList();
    function RestGetVideoList() {
        // let request = new XMLHttpRequest();
        // request.open('GET', 'https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3&fresh=' + Math.random());
        // request.setRequestHeader("If-Modified-Since","0"); // 清除缓存
        // request.setRequestHeader('Content-Type', 'application/json');
        // request.withCredentials = true;
        // // request.setRequestHeader('cookie', document.cookie);
        // request.addEventListener('load', function () {
        //     let newHtml = '';
        //     if (JSON.parse(this.responseText).code != 0) {
        //         alert(JSON.parse(this.responseText).message);
        //         return;
        //     }
        //     for (let video of JSON.parse(this.responseText).data.item) {
        //         newHtml += getVideoHtml(video);
        //     }
        //     eleCommendContent().innerHTML += newHtml;
        //     if (containerTooLess()) {
        //         RestGetVideoList()
        //     }
        // })
        // request.send();

        fetch("https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3&version=1&ps=10&fresh_idx=5&fresh_idx_1h=5&homepage_ver=1", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://www.bilibili.com/?spm_id_from=333.155.b_696e7465726e6174696f6e616c486561646572.1",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(response => {
            response.json().then(res => {
                let newHtml = '';
                for (let video of res.data.item) {
                    newHtml += getVideoHtml(video);
                }
                eleCommendContent().innerHTML += newHtml;
                if (containerTooLess()) {
                    RestGetVideoList()
                }
            })
        });
    }

    document.getElementById('my-bilibili-recommend').onscroll = function (event) {
        if (containerTooLess()) {
            RestGetVideoList();
        }
    };

    function containerTooLess() {
        let scrollTop = document.getElementById('my-bilibili-recommend').scrollTop;
        let height = document.getElementById('my-bilibili-recommend').clientHeight;
        let contentHeight = eleCommendContent().clientHeight;
        if (scrollTop + height + 50 >= contentHeight) {
            return true;
        }
        return false;
    }

    let scrollbarWidth = (function getScrollbarWidth() {
        var scrollDiv = document.createElement("div");
        scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
        document.body.appendChild(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    })();

    // 适应宽度
    function myResize() {
        //let contentWidth = document.querySelector("#my-bilibili-recommend .recommend-content").offsetWidth - scrollbarWidth;
        let maxWidth = 600;
        let contentWidth = window.innerWidth - 20 - scrollbarWidth;
        let width = contentWidth <= maxWidth ? maxWidth : contentWidth / Math.ceil(contentWidth / maxWidth) - 5;
        let height = width * 0.4;

        let newStyle = `
        <style>
            #my-bilibili-recommend .recommend-video {
                width: ${width}px;
                height: ${height}px;
            }
        </style>
        `
        let div = document.createElement('div');
        div.innerHTML += newStyle;
        document.body.append(div);
    }
    myResize();
    window.onresize = myResize;

    // Your code here...
})();