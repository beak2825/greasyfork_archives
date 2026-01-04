// ==UserScript==
// @name luguDEl
// @version      0.2
// @description  云剪贴板一键删除
// @match        *://www.luogu.com.cn/paste
// @namespace https://greasyfork.org/users/1255677
// @downloadURL https://update.greasyfork.org/scripts/486148/luguDEl.user.js
// @updateURL https://update.greasyfork.org/scripts/486148/luguDEl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load', function() {
        var paragraphs = document.querySelectorAll('p[data-v-6f148d90][data-v-f9624136]');
        var uid = document.querySelector('img[data-v-258e49ac]').src.split('/').pop();
        var name = document.querySelector('img[data-v-258e49ac]').alt;
        paragraphs.forEach(function(paragraph) {
            var button = document.createElement('button');
            button.innerText = '删除';
            button.addEventListener('click', function() {
                var link = paragraph.querySelector('a[data-v-0640126c][data-v-6f148d90]').href.split('/').pop();
                if (confirm('你确定要删除吗？')) {
                    fetch('https://www.luogu.com.cn/paste/delete/' + link, {
                        method: 'POST',
                        headers: {
                            'authority': 'www.luogu.com.cn',
                            'method': 'POST',
                            'path': '/paste/delete/' + link,
                            'scheme': 'https',
                            'accept': 'application/json, text/plain, */*',
                            'accept-encoding': 'gzip, deflate, br',
                            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                            'origin': 'https://www.luogu.com.cn',
                            'referer': 'https://www.luogu.com.cn/paste/' + link,
                            'sec-ch-ua': '"Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121"',
                            'sec-ch-ua-mobile': '?0',
                            'sec-ch-ua-platform': '"Windows"',
                            'sec-fetch-dest': 'empty',
                            'sec-fetch-mode': 'cors',
                            'sec-fetch-site': 'same-origin',
                            'x-csrf-token': '1706691488:udHXIJFgk0n9A92DALw8P1atj5MBEu43UGaeSAW8ySI=',
                            'x-requested-with': 'XMLHttpRequest'
                        },
                        body: JSON.stringify({
                            'data': 'FMODBi9KZW6FV0Tudr56k',
                            'id': 'mumanble',
                            'user': {
                                'uid': uid,
                                'name': name,
                                'slogan': '$([char]36893)$([char]27700)$([char]27969)$([char]24180)$([char]36731)$([char]26579)$([char]23576)',
                                'badge': null,
                                'isAdmin': false,
                                'isBanned': false,
                                'color': 'Red',
                                'ccfLevel': 3,
                                'background': 'https://cdn.luogu.com.cn/upload/image_hosting/1ae0j80t.png'
                            },
                            'time': 1691583527,
                            'public': true
                        })
                    }).then(function(response) {
                        if (!response.ok) {
                            throw new Error('HTTP error, status = ' + response.status);
                        }
                        alert('删除成功!');
                    }).catch(function(error) {
                        alert('删除失败: ' + error.message);
                    });
                }
            });
            paragraph.appendChild(button);
        });
    }, false);
})();