// ==UserScript==
// @name         Banner测试工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键替换页面Banner图片进行测试
// @author       诸葛
// @match        https://baijiahao.baidu.com/builder/rc/playletDistribution/home
// @grant        GM_addStyle
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/543957/Banner%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/543957/Banner%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 样式
    GM_addStyle(`
        #bannerTestBtn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4285f4;
            color: white;
            padding: 6px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            z-index: 9999;
        }
        #bannerTestBtn:hover {
            background: #3367d6;
        }
    `);

    // 创建按钮
    const btn = document.createElement('button');
    btn.id = 'bannerTestBtn';
    btn.textContent = '测试';
    document.body.appendChild(btn);

    // 动态选择器（随时抓取当前Banner）
    const bannerSelector = "#layout-main-content > div.mp-main.mp-main-gray > div > div.FHkElxJloZgyC5fFJ4mA > div.rdEej5gChDiOzg554f54 > div > div > div > div > div.slick-slide.slick-active.slick-current > div > div > a > img";

    // 点击按钮触发上传
    btn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (ev) {
                    const imgBase64 = ev.target.result;
                    const bannerImg = document.querySelector(bannerSelector);
                    if (bannerImg) {
                        bannerImg.src = imgBase64;
                        console.log('Banner替换成功:', bannerImg.src);
                    } else {
                        alert('未找到Banner元素');
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });

})();
