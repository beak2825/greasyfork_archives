// ==UserScript==
// @name         云学堂快捷学习
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       You
// @match        *://*.yunxuetang.cn/kng/course/package/video/*
// @match        *://*.yunxuetang.cn/kng/view/package/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399395/%E4%BA%91%E5%AD%A6%E5%A0%82%E5%BF%AB%E6%8D%B7%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/399395/%E4%BA%91%E5%AD%A6%E5%A0%82%E5%BF%AB%E6%8D%B7%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // define a new console
    var console=(function(oldCons){
        return {
            log: function(text){
            },
            info: function (text) {
                oldCons.info(text);
                // Your code
            },
            warn: function (text) {
                oldCons.warn(text);
                // Your code
            },
            error: function (text) {
                oldCons.error(text);
                // Your code
            }
        };
    }(window.console));

    window.console = console;

    function removeAlert() {
        if (RemoveWarningHtml) {
            setInterval(function() {
                RemoveWarningHtml();
                console.info("removed warning dialog");
            }, 3000);
        }
    }

    function refreshPage() {
        var els = document.getElementsByClassName('el-plancourselist pl5');
        var el = null;
        if (els.length > 0) {
            el = els[0];
        }

        var xhr = new XMLHttpRequest();
        xhr.open("GET", window.location.href);
        xhr.setRequestHeader('Content-Type', 'text/html');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var html = xhr.responseText;
                let fragment = document.createDocumentFragment();
                var div = document.createElement("div");
                div.innerHTML = html;
                fragment.appendChild(div);
                var newData = fragment.querySelector(".el-plancourselist");
                el.innerHTML = newData.innerHTML;
                console.info("刷新进度咯");
            }
        }
        xhr.send();
    }

    function getUnfinishedTask() {
        var unfinishedUrls = [];
        function getTaskUrls(img) {
            var data = document.getElementsByClassName(img);
            return Array.from(data).map(function(item) {

                var href = (item.nextSibling.nextSibling).querySelector('a').href;
                return href.match(/\/.*\.html/)[0];
            });
        }
        unfinishedUrls.push(...getTaskUrls("picnostart"));
        unfinishedUrls.push(...getTaskUrls("picstudying"));
        return unfinishedUrls;
    }

    var currenUrl = window.location.href;

    if (/view\/package/.test(currenUrl)) {
        var intro = document.getElementById('divIntroduction');

        // create a task
        var openBtn = document.createElement("button");
        openBtn.innerHTML = "一键并发学习";
        openBtn.type = "button";
        openBtn.style = "padding: 0 10px;border-radius: 5px;border: none;height: 20px; font-size: 12px;line-height: 20px; background: red;color: white; margin-left: 10px;";
        openBtn.addEventListener("click", function() {
            var count = 0;
            var MAX_THREAD = 10;
            var urls = getUnfinishedTask();

            for (let i = 0; i < urls.length; i++) {
                if (i > MAX_THREAD) {
                    break;
                }

                count++;
                setTimeout(() => {
                    var ifrm = document.createElement('iframe');
                    ifrm.style.height = '0px';
                    ifrm.style.width = '0px';

                    intro.append(ifrm);
                    ifrm.setAttribute('src', urls[i]);
                }, 1000 * i);
            }

            var tip = document.createElement("span");
            tip.style.color = "orange";
            tip.style.marginRight = "10px";
            tip.innerHTML = "不要刷新本页面！！！ 已开启并发数: " + count + " ";
            intro.append(tip);
        });

        document.querySelector("#courseTitle").append(openBtn);

        // history button
        var historyBtn = document.createElement("button");
        historyBtn.innerHTML = "学习课时";
        historyBtn.type = "button";
        historyBtn.style = "padding: 0 10px;border-radius: 5px;border: none;height: 20px; font-size: 12px;line-height: 20px; background: blue;color: white; margin-left: 10px;";
        historyBtn.addEventListener("click", function() {
            window.open("/study/myperiod.htm");
        });
        document.querySelector("#courseTitle").append(historyBtn);

        // refresh button
        var refreshBtn = document.createElement("button");
        refreshBtn.innerHTML = "刷新进度";
        refreshBtn.type = "button";
        refreshBtn.style = "padding: 0 10px;border-radius: 5px;border: none;height: 20px; font-size: 12px;line-height: 20px; background: green;color: white; margin-left: 10px;";
        refreshBtn.addEventListener("click", function() {
            refreshPage();
        });
        document.querySelector("#courseTitle").append(refreshBtn);

        setInterval(function() {
            refreshPage();
        }, 30 * 1000);

    } else {
        removeAlert();
    }
})();