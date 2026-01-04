// ==UserScript==
// @name         Shared Zhile GPT4 Pre Filter
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  筛选出gpt4账号, 这是个跑批脚本，需要自己查看控制台的error日志，会打印gpt4账号信息，可以辅助另一个gpt脚本的编写
// @author       ZGR
// @match        https://*.zhile.io/shared.html*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470273/Shared%20Zhile%20GPT4%20Pre%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/470273/Shared%20Zhile%20GPT4%20Pre%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function setCookie1(name, value) {
        let date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        let expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + value + expires + "; path=/";
    }


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // main方法 from, to
    function main(links, from, to, intervalSeconds) {
        var len = links.length;
        var end = to > len ? len : to;
        var start = from > end ? end : from;
        console.warn("start: gpt记录总条数： " + len + "; 开始条数: " + start + "; 结束条数: " + end + ".")
        for (var jj = start; jj < end; jj++) {
            var link = links[jj];
            var markNo = link.innerText
            var token = link.getAttribute("data-token");
            login1(token, markNo, jj, start, intervalSeconds);
        }
    }

    async function login1(token_key, markNo, idx, skipCount, intervalSeconds) {
        var waitSeconds = (idx - skipCount) * intervalSeconds;
        await sleep(waitSeconds * 1000)
        // console.log("sleep " + waitSeconds + " s")
        let sessionPassword = "Abbb2222";
        setCookie1('session_password', sessionPassword)

        fetch('/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'token_key=' + encodeURIComponent(token_key) + '&session_password=' + encodeURIComponent(sessionPassword)
        }).then(response => response.json()).then(data => {
            if (0 === data.code) {
                fetch('/?v=2')
                    .then(ddd => {
                        fetch('/api/models?history_and_training_disabled=false')
                            .then(response => response.json())
                            .then(data => {
                                    //console.log(data)
                                    if (data.categories.length > 1) {
                                        console.error("这是总第" + (idx + 1) + "个: >>>>>>>>>>>>>>>>>>>>>>>>>>>>gpt4.0, a标签的标号为:" + markNo)
                                    } else {
                                        console.log("这是总第" + (idx + 1) + "个: >>>>>>>>>>>>>>>>>>>>>>>>>>>>gpt3.5, a标签的标号为:" + markNo)
                                    }
                                }
                            )
                    }
                )
            } else {
                console.error("login error")
            }
        }).catch(error => console.error(error))
    }

    var links = document.querySelectorAll('ul li a');

    main(links, 0, links.length, 2);
})();