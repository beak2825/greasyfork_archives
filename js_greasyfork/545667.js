// ==UserScript==
// @name        谷歌百度搜索双向跳转增强版
// @namespace  http://www.linnnnnnnn.end
// @version     2.0.1
// @description 在百度/Google搜索结果页添加互跳按钮，优化性能和兼容性
// @icon        https://resource01.ulifestyle.com.hk/res/v3/image/content/2130000/2132767/20180807_googlebaidu_03_1024.jpg
// @include     /^https?:\/\/(www|ipv4|ipv6)\.google\.(com|com\.hk)\/.*/
// @include     /^https?:\/\/www\.baidu\.com\/.*/
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @grant       GM_addStyle
// @author    End
// @copyright      2025+, End
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/545667/%E8%B0%B7%E6%AD%8C%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8F%8C%E5%90%91%E8%B7%B3%E8%BD%AC%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/545667/%E8%B0%B7%E6%AD%8C%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8F%8C%E5%90%91%E8%B7%B3%E8%BD%AC%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 通用样式注入
    GM_addStyle(`
        .search-jump-btn {
            width: 45px;
            height: 35px;
			margin-top: 7px;
			margin-right: 10px;
            cursor: pointer;
            border: none;
            background: transparent;
        }
        #ggyx img, #bdyx img {
            height: 100%;
        }
    `);

    // 百度页添加Google按钮
    function addGoogleBtn() {
        const $searchBox = $('.s_form_wrapper');
        console.info(11112)
        if ($searchBox.length && !$('#ggyx').length) {
            const $btn = $(`
                <span id="ggyx" style="width:45px;height:35px;margin-left:8px;cursor:pointer;border:none;background:transparent;" title="用Google搜索">
                    <img style="height:35px;" src="data:image/jpeg;base64,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">
                </span>
            `);
            $(".right-tools-wrapper").after($btn);
            $btn.on('click', () => {
                const keyword = $('#kw').val().trim();
                if (keyword) {
                    window.open(`https://www.google.com/search?hl=zh-CN&q=${encodeURIComponent(keyword)}`);
                }
            });
        }
    }

    // Google页添加百度按钮
    function addBaiduBtn() {
        const $searchBox = $('[role="search"], .search-form');
        if ($searchBox.length && !$('#bdyx').length) {
            const $btn = $(`
                <button id="bdyx" class="search-jump-btn" title="用百度搜索" >
                    <img src="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4gsaBjEzoiyM1QAABrxJREFUaN7Vm39wXFUVxz/nbd4mlk4lZUIdqQziWIqIDvYHaXbTEui0pRZ/jhXBURgZRxloscMM3U2jj2mzaVFgsFpsR2HqoIwtjFI6qR3/iGR3k1QiWIqdWmdQ0Fag1LRBNM3bfcc/kpHG7tu97+1uszn/ZGbffee+z3v3nvO9594I1bD7MpdSxwPAUiAP/JgTDQ475rtMstVV3OOG9AqU3cD0s35N0jQyC7jD2E+itwmxbkOYA7KXzpY9IFru40lFYRPZRVjaA9QXuKpAC53xgdIvrfczqPUY0Pju3fIIqdg95T6iVTFYZ3Aalj7hAzv+cuX2kn6SmdWo9fQEWADRtSQzd9QOsDtyJ3B58UYaLz5C0nMQHvd9LmEjTk9DDQCrAGsMGs4u/jSyFZhWpMX7cKPLJx+4vX8B8IGyYkZ7phlYVtqFd30NfGFvhWHDN4tc+5phnP1QLczhZsN2h4tMic8Z+rBrAXiu4VQ/UDgNDcwFZhr2NVQLwBcZtYp4ewu/iPzHAvT1h1oANlFsh9jYerDwtJSZxj2p7K0F4DcN2jzoD6HDhv38llTs5VoAPlAiGfVz9PgT/kHee9Ggj1EsLVta+udF549R3FN3gd6I6lwseRXlV9juj3Da/jVRDvYtR7xf+3j6G5JfwqYlfymey7PPgq7yGwPA7XTGd1ZHWn5hVwR36BnQB4GliMxGiQHfxbVfIdEbm9A+1bIflUcKzM3nyOt1JWEB8t5XENIFUI+jfLISsP5fuD1zD/BwkftOYcsVOLGJc7cju4C8txgRweMAXfF0YIm6IXMDKgtRIoi8xIn67kquo88FdtRiNPMqIrNL3LuZzniCKWbnppN85hoDWIBVwOQDJ7MfRfReYAWQA36JS5IH4m+bAavVMhYjStoVY5Kw/CpEuPX3wAzc3DbQL/1fLLoLm0U4PdedE1wLBy1daKxp794XnRzYngtxc2ngVp/AOw/X3mgWpZXLDLt9h60rz0wKsGv/HCglR+/EGZhtkpZMI+KhSZqzNwM3GrSMksvfZPCF5aXzoWlDV1ZEO8yba8wgaPELhLUlXP2T6Oj2QM+aSM8hYsXwvIuxrGE8PULUTeO05cx9ZOPARwL02lQauCvWT3vmZ+MBoaDyRfkyTttbRl12pD+OylaUVlRBhLG/wKh9nA3ZzdS1/BBHvNK6UFcFqyxrxExaunwTZHeBK8dQbxmp+D6zWlfmq3jSj9LqI3vej+r3cbP7uHf/BQYe5wWTVXLMbB07lrRX056ZDyxFVREOY8/cj3PVqCHsrcDjmH2SZdRf0M3XB5cWl5FGgujs6Xko2MK9Mz4IDAaOLYnsItDHCDb+FtP0n03AfUUIvEAuPa+7Wuvhs0XBdCx2AiFEiawj0VskKMmRAM4G6Fp8uPrAbt1DoB8Ore0ta1ORrLQnwHD+djUrHuNDOdMKUu7+z2fHpkQBe/v0k8BRg5GyjVT8N9UFvru7Hku3U4kdSUs7C/6+deUZVD4PnCwCu5vh0+uqXdOC985oB7myQt7afHcKU7GXQeah7AHOzt1vIKzDbrm5mMavzP5wR3YBnmbCBSpfG0G9GKnFL/jr6oFZaG4O4p0metERk5RZPnCitwnLOgB8sAri+Riet6xQtK1sEc/UNqRXYFkHqwQLcAmW9ZxvEKtITcvE1qcbibBlPCIL1bccyGbsCzcaK72KAScztyA8BMw6/8tD+TPo/dixJ40WG2UBr++/jEj+0fFi2WTbUWAndt1PcZr/Xnng9swXgR3ADGrLRoAfYLv3FyrYhQBWIdn3MKJrqWnT3+FFV9J17ckyorQK7dlttQ8LIAuJ5J7GUSs8cLIvCXyDqWKqS3Aznw4HvD59OaLfYaqZym3hgC1rDWUeHpmckc31pYa1z4k3333aWrfpjAxcGgz4W33voeQRwho2WxuDATdEpp0nuVgly3vBgOv//Q6G24e1yWu/HgzYaRtB+ccUxf0rqeY3QgStEqdyajdM94dLS0r31OTVp8IBR+t2AcNTDPcV/nT8mXDATvMwyuappbLoYvfqfHgt/VbD90D7pghuN6nYT0wa+gPvmO/iRT8FvFjjsIPkGm4xPVxTfDnVde1J7IY4ynYm1oDLsTOM/fNWJVZIT2E3LGHL/NOVrXgAdPRdjeetAW7CrJ41BPwe4XlUn8eSo+Ts1/+3SHd66jgTacSKXIl414B8AuUG4BID3ydAHTrjjwY9NhVOQib65iL5hYhcDDQiUo96pxCGUF4jJwfZEn8tlO+OzFV4shylFdGrefek/BCqLwDPEs3twmkbCeP+v8UeKLAXusZdAAAAAElFTkSuQmCC">
                </button>
            `);
            const $inputContainer = $searchBox.find('.RNNXgb');
            $inputContainer.append($btn);
            $('#bdyx').off('click').on({
                    click: function() {
                        window.open("https://www.baidu.com/s?wd=" + encodeURIComponent($("[name='q']")[0].value));
                        return false;
                    }
                });
        }
    }

    // 智能检测页面类型
    function init() {
        if (window.location.host.includes('baidu.com')) {
            // 百度页防抖处理
            let timer;
            $(document).on('input', '#kw', () => {
                clearTimeout(timer);
                timer = setTimeout(addGoogleBtn, 300);
            });
            addGoogleBtn();
            if (!document.getElementById("ggyx")) {
                console.info("初始状态：元素不存在");
            }

            // 监听DOM变化
            const observer = new MutationObserver(() => {
                if (!document.getElementById("ggyx")) {
                    addGoogleBtn();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
    });
        } else if (window.location.host.includes('google.')) {
            // Google页直接注入
            addBaiduBtn();
            // 动态内容监听
            const observer = new MutationObserver(addBaiduBtn);
            observer.observe(document.body, { subtree: true, childList: true });
        }
    }

    // 安全启动
    $(document).ready(() => {
        try {
            init();
        } catch (e) {
            console.error('脚本执行错误:', e);
        }
    });
})();