// ==UserScript==
// @name          vol.moe 显示分级信息
// @description   在 vol.moe 的列表页显示分级信息
// @version       0.2
// @author        ichiogo, Hueizhi
// @match         https://vol.moe/*
// @match         https://mox.moe/*
// @match         https://volmoe.com/*
// @match         https://kox.moe/*
// @match         https://kxo.moe/*
// @match         https://koz.moe/*
// @match         https://comic.im/*
// @grant         GM.getValue
// @grant         GM.setValue
// @grant         GM_addStyle
// @run-at        document-end
// @license       MIT
// @namespace https://greasyfork.org/users/243639
// @downloadURL https://update.greasyfork.org/scripts/538866/volmoe%20%E6%98%BE%E7%A4%BA%E5%88%86%E7%BA%A7%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/538866/volmoe%20%E6%98%BE%E7%A4%BA%E5%88%86%E7%BA%A7%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* 在以下路径运行：
        /
        /l/*
        /list.php
        /myfollow.php

        /m/
        /m/l/*
        /m/list.php
        /m/myfollow.php

        /k/
        /k/l/*
        /k/list.php
    */
    if (!/^(?:\/|\/l\/.*|\/list\.php|\/myfollow\.php|\/(?:k|m)\/?(?:l\/.*|list\.php)?|\/m\/myfollow\.php)$/.test(location.pathname)) return

    GM_addStyle(`
        .rating-r18,
        .rating-r15,
        .rating-gen,
        .rating-failed {
            font-weight: bold;
            font-size: 83%;
            position: relative;
            top: -0.5px;
            font-family: auto;
        }

        .rating-r18 {
            color: red;
        }
        .rating-r15 {
            color: orange;
        }
        .rating-general {
            color: green;
        }
        .rating-failed {
            color: purple;
        }
    `)

    function getContent(cid) {
        return fetch(`${location.origin}/c/${cid}.htm`).then(r => r.text());
    }

    const cidRE = /c\/(\w+)\.htm$/;
    const r18RE = /var is_r18  = parseInt\( "(\d)" \);/;

    const R18 = 'r18';
    const R15 = 'r15';
    const OTHER = 'rall';
    const FAILED = 'failed'

    function getRating(cid) {
        return GM.getValue(cid, null).then((value) => {
            if (value) {
                return value;
            }
            return getContent(cid).then(content => {
                const rv = r18RE.exec(content);
                if (rv && rv[1]) {
                    let flag = OTHER;
                    switch (rv[1]) {
                        case '2':
                            flag = R18;
                            break;
                        case '1':
                            flag = R15;
                            break;
                    }
                    GM.setValue(cid, flag);
                    return flag;
                } else {
                    console.error(`未能在 CID ${cid} 的页面中找到分级信息。`);
                    return FAILED;
                }
            }).catch(error => {
                console.error(`获取 CID ${cid} 内容失败:`, error);
                return FAILED;
            });

        }).catch(error => {
            console.error(`从 GM.getValue 获取 CID ${cid} 失败:`, error);
            return FAILED;
        });
    }

    function init() {
        let anchors;
        if (location.pathname.endsWith("m/myfollow.php")) {
            anchors = document.querySelectorAll("a.weui-cell");
        } else if (location.pathname.endsWith("myfollow.php")) {
            anchors = document.querySelectorAll("table > tbody > tr:nth-child(n+4) > td > a");
        } else if (location.pathname.startsWith("/m") || location.pathname.startsWith("/k")) {
            anchors = document.querySelectorAll(".listbg0 > td > div > a");
        } else {
            // anchors = document.querySelectorAll('td[id^="div_info_"] > div > a');
            anchors = document.querySelectorAll('td > div > a');
        }

        if (anchors.length === 0) {
            console.log("未找到匹配的漫画链接。");
            return;
        }

        anchors.forEach(anchor => {
            const match = cidRE.exec(anchor.href);
            if (!match || !match[1]) {
                console.warn('无法从链接获取 CID:', anchor.href);
                return;
            }
            const cid = match[1];

            getRating(cid).then(rating => {
                let ratingHtml = '';
                if (rating === R18) {
                    ratingHtml = '<span class="rating-r18">R18</span>';
                } else if (rating === R15) {
                    ratingHtml = '<span class="rating-r15">R15</span>';
                } else if (rating === FAILED) {
                    ratingHtml = '<span class="rating-failed">FAILED</span>';
                } else if (rating === OTHER) {
                    // 全年龄标签
                    // ratingHtml = '<span class="rating-general">GEN</span>';
                }

                if (ratingHtml) {
                    anchor.insertAdjacentHTML('afterbegin', ratingHtml);
                }
            }).catch(error => {
                console.error(`处理链接 ${anchor.href} 失败:`, error);
            });
        });
    }


    init();
})();