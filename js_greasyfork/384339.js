// ==UserScript==
// @name         详情主图获取
// @namespace    Fzz
// @version      0.5
// @description  适用于京东商品详情页主图获取，天猫商品详情页主图获取，酷家乐模型主图获取，1688网站商品详情主图获取
// @author       Fzz
// @match        https://item.jd.com/*
// @match        https://detail.tmall.com/*
// @match        https://www.kujiale.com/model/*
// @match        https://detail.1688.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
// @grant        unsafeWindow
// @imgSize 800
// @downloadURL https://update.greasyfork.org/scripts/384339/%E8%AF%A6%E6%83%85%E4%B8%BB%E5%9B%BE%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/384339/%E8%AF%A6%E6%83%85%E4%B8%BB%E5%9B%BE%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let winHref = window.location.href,
        reJd = /item.jd.com/i,
        reTmall = /detail.tmall.com/i,
        reKuJiaLe = /kujiale.com\/model/i,
        re1688 = /detail.1688.com/i,
        getImgOptions;

    GM_addStyle('.Fzz-getImg__toggle {position: fixed;top: 56%;left: 20px;width:20px;height:20px;display:flex;justify-content:center;align-items:center;transform:translateY(-50%);padding:10px;color: #fff;border: 1px solid red;border-radius: 50%;background: #fff;z-index: 9999;}.Fzz-getImg__body {position: fixed;top: 0;left: 0;z-index: 999;width: 100%;height: 100%;display: none;background: rgba(0, 0, 0, 0.9);overflow-y: auto;}.Fzz-getImg__body li {width: calc(100% / 5 - 22px);height: 280px;padding: 2px;float: left;border: 1px solid #fff;border-radius: 5px;overflow: hidden;}.Fzz-getImg__body li img{width:100%;height:100%;}.Fzz-getImg__body li:not(:nth-of-type(1)) {margin-left: 20px;margin-bottom: 20px;}.Fzz-getImg__body li:nth-of-type(5n + 1) {margin-left: 0;}');

    $(document).ready(function () {
        let options = {
            // 通用图片地址参数替换-默认天猫
            replaceSearch: /_60x60q90.jpg/g,
            replaceVal: '',
            label: 'Tmall',
            imgEle: 'img',
        };
        // 匹配京东-设置参数
        if (reJd.test(winHref)) {
            options.label = 'Jd';
            getImgOptions = {
                webLabel: Jd,
                iconImg: 'https://www.jd.com/favicon.ico',
                imgAttr: 'data-url'
            }
            // 匹配天猫-设置参数 
        } else if (reTmall.test(winHref)) {
            getImgOptions = {
                webLabel: Tmall,
                iconImg: 'https://img.alicdn.com/tfs/TB1XlF3RpXXXXc6XXXXXXXXXXXX-16-16.png',
                imgAttr: 'src'
            }
            // 匹配酷家乐-设置参数
        } else if (reKuJiaLe.test(winHref)) {
            options.replaceSearch = '@!400x400';
            options.imgEle = 'div';
            getImgOptions = {
                webLabel: KuJiaLe,
                iconImg: 'http://qhstaticssl.kujiale.com/static/images/favicon.ico?t=1',
                imgAttr: 'style'
            }
            // 匹配1688-设置参数
        } else if(re1688.test(winHref)) {
            options.replaceSearch = '.60x60';
            getImgOptions = {
                webLabel: A1688,
                iconImg: 'https://img.alicdn.com/tfs/TB1uh..zbj1gK0jSZFuXXcrHpXa-16-16.ico',
                imgAttr: 'src'
            }
        };

        let section = document.createElement('section');
        section.id = 'Fzz';
        section.innerHTML = `
            <a href="javaScript:;" class="Fzz-getImg__toggle js-toggle" imgAttr="${getImgOptions.imgAttr}" title="获取商品主图">
                <img style="width:20px;height:20px;" src="${getImgOptions.iconImg}">
            </a>
            <ul class="Fzz-getImg__body">
            </ul>
        `;
        document.body.append(section);
        let getImgBody = $('.Fzz-getImg__body');


        function Jd(imgAttr) {
            let Jd_imgUrl = 'http://img14.360buyimg.com/n1/s800x800_';
            imgMap('body', imgAttr, Jd_imgUrl, options);
        };

        function Tmall(imgAttr) {
            imgMap('#J_UlThumb', imgAttr, '', options);
        };

        function KuJiaLe(imgAttr) {
            imgMap('.move-wp.J_move', imgAttr, '', options);
        };

        function A1688(imgAttr){
            imgMap('.tab-content-container', imgAttr, '', options)
        }

        /** 
         * @imgAttr - 带有图片链接地址的属性值
         * @imgUrl - 图片服务器地址
         * @options - 不定参数
         */
        function imgMap(parent, imgAttr, imgUrl, options) {
            // 京东图片地址拼接属性参数
            if (options.label === 'Jd') {
                $(`${parent} ${options.imgEle}[${imgAttr}]`).map(function () {
                    let $this = $(this),
                        $thisUrl = $this.attr(imgAttr);
                    if ($thisUrl === undefined) return;
                    let li = `
                            <li>
                                <img src="${imgUrl}${$thisUrl}">
                            </li>
                        `;
                    getImgBody.append(li);
                });
                // 天猫图片地址参数替换
            } else {
                $(`${parent} ${options.imgEle}[${imgAttr}]`).map(function () {
                    let $this = $(this),
                        li,
                        $thisUrl;

                    if (options.imgEle === 'img') {
                        $thisUrl = $this.attr(imgAttr).replace(options.replaceSearch, options.replaceVal);
                        if ($thisUrl === undefined) return;
                        li = `
                            <li>
                                <img src="${imgUrl}${$thisUrl}">
                            </li>
                        `;
                    } else if (options.imgEle === 'div') {
                        $thisUrl = $this.css('background-image').split("\"")[1].replace(options.replaceSearch, options.replaceVal);
                        if ($thisUrl === undefined) return;
                        li = `
                            <li>
                                <img src="${$thisUrl}">
                            </li>
                        `;
                    };
                    getImgBody.append(li);
                });
            }
        };

        $('.js-toggle').click(function () {
            let $this = $(this),
                $thisAttr = $this.attr('imgAttr');
            if (!$this.hasClass('js-active')) {
                $this.addClass('js-active');
                getImgBody.fadeIn();
                getImgOptions.webLabel($thisAttr);
            } else {
                $this.removeClass('js-active');
                getImgBody.fadeOut().html('');
            }
        });
    });
    // Your code here...
})();