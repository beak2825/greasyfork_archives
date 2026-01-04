// ==UserScript==
// @name         nginx画廊
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  nginx画廊 new
// @author       You
// @match        http://127.0.0.1/res/%E6%AF%8F%E6%97%A5%E4%B8%80%E5%8F%A5/picture/
// @match        http://127.0.0.1/res/%E6%AF%8F%E6%97%A5%E4%B8%80%E5%8F%A5/wallpaper/
// @match  http://127.0.0.1/res/banana_pic/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458007/nginx%E7%94%BB%E5%BB%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/458007/nginx%E7%94%BB%E5%BB%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const loadingImg = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F079631e90e8871989842d35305b636f46761d4a5fe5-YizIOH_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1627726169&t=6de518bc2437fb39d6d30d7b4cfb1682';
    let t = document.title.substring(0, document.title.length - 1);
    let i = t.lastIndexOf("/");
    document.title = t.substring(i + 1);
    let all = document.querySelectorAll("#list > tbody > tr > td > a");
    let tbody = document.querySelector("#list > tbody");
    tbody.innerHTML = '';
    let a = document.createElement("a");
    a.setAttribute("href", "../");
    a.setAttribute("one-link-mark", "yes");
    a.innerText = "上一层";
    tbody.appendChild(a);
    tbody.appendChild(document.createElement("br"));
    let fragment = document.createDocumentFragment();
    let limit = 2;
    let imgElements = [];
    for (let i = 1; i < all.length; i++) {
        let e_img = document.createElement('img');
        if (i < limit) {
            e_img.setAttribute('src', all[i].href);
            e_img.setAttribute('data-lazy-Src', all[i].href);
        } else {
            // e_img.setAttribute('src', loadingImg);
            e_img.setAttribute('data-lazy-Src', all[i].href);
            e_img.setAttribute('referrer',"no-referrer|origin|unsafe-url");
        }
        fragment.appendChild(e_img);
        imgElements.push(e_img);
    }
    tbody.appendChild(fragment);

    function lazyLoad(delay = 500) {
        let imgLoad = (img, i) => {
                init();
                img.onload = null
            },
            // imgDoms = document.querySelectorAll('img'),
            imgDoms = imgElements,
            /**
             todo：
             当前图片初始化是从第一个开始，若滚动后刷新，任然是从第一个开始，不是从可视区域的第一个开始显示。
             考虑缓存和仅优化首次加载并不需要完善。
             完善思路，判断不仅判断offsetTop,同时判断bottom
             */
            init = () => {
                let H = document.documentElement.clientHeight,//获取可视区域高度
                    S = document.documentElement.scrollTop || document.body.scrollTop;
                for (let i = 0, v = imgDoms[i]; i < imgDoms.length; i++ , v = imgDoms[i]) {
                    let dataSrc = v.getAttribute('data-lazy-Src'),
                        isloaded = v.getAttribute('data-loaded'); // delay 导致 dataSrc !== v.currentSrc 判断加载状态延迟，滚动重复触发，isloaded提前标记状态
                    if (!isloaded && H + S > v.offsetTop) {
                        // 未加载且在显示区范围初始化
                        v.setAttribute('data-loaded', true);
                        setTimeout(() => {
                            v.src = dataSrc;
                            v.onload = imgLoad.bind(null, v, i) // 下一个初始化，init放在img onload保证图片显示后高度已经变化，下一项offsetTop准确
                        }, delay);
                        break;
                    } else if (!isloaded) {
                        // 未加载不在显示区范围，退出初始话，开始监听滚动
                        scrollLoad();
                        break;
                    }
                }
            },
            scrollLoad = () => {
                window.onload = window.onscroll = function () { //onscroll()在滚动条滚动的时候触发
                    loadone();
                }
            },
            loadone = (isInit = false) => {
                let H = document.documentElement.clientHeight;//获取可视区域高度
                let S = document.documentElement.scrollTop || document.body.scrollTop;
                for (let i = 0, v = imgDoms[i]; i < imgDoms.length; i++ , v = imgDoms[i]) {
                    let dataSrc = v.getAttribute('data-lazy-Src'),
                        isloaded = v.getAttribute('data-loaded'); // delay 导致 dataSrc !== v.currentSrc 判断加载状态延迟，滚动重复触发，isloaded提前标记状态
                    if (!isloaded && H + S > v.offsetTop) {
                        v.setAttribute('data-loaded', true);
                        setTimeout(() => {
                            v.src = dataSrc
                        }, delay);
                        break;
                    }
                }
            };
        init()
    }

    lazyLoad()

})();
