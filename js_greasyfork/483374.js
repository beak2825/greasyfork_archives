// ==UserScript==
// @name         抖音用户主页抓取
// @namespace    http://tampermonkey.net/
// @version      0.1.20231229
// @description  采集抖音用户列表页数据
// @author       塞北的雪
// @match        https://www.douyin.com/user/*
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/483374/%E6%8A%96%E9%9F%B3%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/483374/%E6%8A%96%E9%9F%B3%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var isFirst = true;
    var aweme_list = [];
    var nickname = "";

    function extractDataFromScript() {
        var scriptTag = document.getElementById('RENDER_DATA');
        if (!scriptTag) return;

        var encodedContent = scriptTag.innerHTML;
        var decodedContent = decodeURIComponent(encodedContent);
        var json = JSON.parse(decodedContent);

        for (var prop in json) {
            if (json.hasOwnProperty(prop) && prop !== "_location" && prop !== "app") {
                var user = json[prop];
                nickname = user.user.user.nickname;
                var post = user.post;
                if(post!=null){
                    var data = post.data;
                    aweme_list = aweme_list.concat(data);
                }
            }
        }
    }

    function createButton() {
        const button = document.createElement('button');
        button.textContent = '点击我';
        button.style.position = 'fixed';
        button.style.right = '20px';
        button.style.bottom = '30%';
        button.addEventListener('click', buttonClick);
        document.body.appendChild(button);
    }

    function buttonClick() {
        console.log(aweme_list);
        const files = [];
        aweme_list.forEach((item) => {
            if (item.aweme_type === 0 || item.awemeType === 0 || item.aweme_type === 61 || item.awemeType === 61) {
                try {
                    files.push({ name: item.desc, url: item.video.play_addr.url_list[0] });
                } catch (error) {
                    files.push({ name: item.desc, url: item.video.playAddr[0].src });
                }
            } else if (item.aweme_type === 68 || item.awemeType === 68) {
                var urlList = item.images.map(img => {
                    try {
                        return img.url_list[0];
                    } catch (error) {
                        return img.urlList[0];
                    }
                });
                files.push({ name: item.desc, urlList: urlList });
            }
        });

        var data = { nickname: nickname, aweme_list: files };
        console.log(data);
    }

    function interceptResponse() {
        var originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            var self = this;
            this.onreadystatechange = function() {
                if (self.readyState === 4) {
                    if (self._url.indexOf("/aweme/v1/web/aweme/post") > -1) {
                        var json = JSON.parse(self.response);
                        var data = json.aweme_list;
                        aweme_list = aweme_list.concat(data);
                    }
                }
            };
            originalSend.apply(this, arguments);
        };
    }
    function scrollPageToBottom() {
        const SCROLL_DELAY = 1000; // Adjust the delay between each scroll action (in milliseconds)
        let scrollInterval;

        function getScrollPosition() {
            return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        }

        function scrollToBottom() {
            window.scrollTo(0, document.body.scrollHeight);
        }

        function hasReachedBottom() {
            return getScrollPosition() >= (document.body.scrollHeight - window.innerHeight);
        }

        function scrollLoop() {
            if (!hasReachedBottom()) {
                scrollToBottom();
            } else {
                console.log("Reached the bottom of the page!");
                clearInterval(scrollInterval);
                // You can perform additional actions here after reaching the bottom of the page.
            }
        }

        function startScrolling() {
            scrollInterval = setInterval(scrollLoop, SCROLL_DELAY);
        }

        function createButton() {
            const button = document.createElement('button');
            button.textContent = '点击开始下拉';
            button.style.position = 'fixed';
            button.style.right = '20px';
            button.style.bottom = '35%';
            button.addEventListener('click', startScrolling);
            document.body.appendChild(button);
        }

        createButton();
    }

    // To start scrolling, call the function:
    scrollPageToBottom();


    if (isFirst) {
        console.log("首次加载");
        isFirst = false;
        setTimeout(function() {
            extractDataFromScript();
            createButton();
        }, 5000); // 延迟时间为5000毫秒（即5秒）
    }

    interceptResponse();

})();