 // ==UserScript==
    // @name         suki get
    // @namespace    https://www.shemale6.com
    // @version      2
    // @description  测试
    // @author       tuite
    // @match        https://www.shemale6.com/**
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475419/suki%20get.user.js
// @updateURL https://update.greasyfork.org/scripts/475419/suki%20get.meta.js
    // ==/UserScript==
    (function () {
        'use strict';
        let dioibPlay = (ename, time) => {
            setTimeout(() => {
                let el = document.querySelector(ename);
                if (!el) dioibPlay(ename, 500)
                else {
                    if (ename == '.fp-play') {
                        el.click();
                        dioibPlay('.fp-player video', 500)
                    } else if ('.fp-player video' == ename) {
                        let url = el.src.split('/?')[0];
                        let img = document.createElement('img');
                        img.src = 'http://192.168.31.201/suki?url=' + url;
                        img.onload = () => window.close()
                        document.body.appendChild(img)
                    } else if ('#list_videos_common_videos_list_items' == ename) {
                        el.querySelectorAll('a').forEach(a => {
                            a.target = '_blank'
                            a.click()
                        })
                        setTimeout(() => {
                            document.querySelector('.page-current').nextElementSibling.querySelector('a').click()
                            dioibPlay('#list_videos_common_videos_list_items', 30000)
                        }, 3000)
                    }
                }
            }, time)
        }


        let href = window.location.href;
        setTimeout(() => {
            if (href.startsWith('https://www.shemale6.com/videos/')) {
                dioibPlay('.fp-play', 1000)
            } else if (href.startsWith('https://www.shemale6.com/models/')) {
                if (document.querySelector('.page-current span').textContent != 1)
                    document.querySelector('.first a').click()
                setTimeout(() => {
                    dioibPlay('#list_videos_common_videos_list_items', 1500)
                }, 2000)
            }
        }, 1500)

    })();