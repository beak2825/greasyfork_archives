// ==UserScript==
// @name        阿里云批量下载 - aliyundrive.com
// @namespace   Violentmonkey Scripts
// @match       https://www.aliyundrive.com/drive/folder/*
// @grant       none
// @version     1.1
// @author      菜饼不菜
// @description 2021/5/4上午1:18:39 - 使用前需要将 Chrome 设置为无需询问下载地址
// @require     http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/425896/%E9%98%BF%E9%87%8C%E4%BA%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%20-%20aliyundrivecom.user.js
// @updateURL https://update.greasyfork.org/scripts/425896/%E9%98%BF%E9%87%8C%E4%BA%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%20-%20aliyundrivecom.meta.js
// ==/UserScript==



(function () {
    'use strict';
    console.log('启动脚本....');
    $(document).ready(function () {
        console.log('ready...');

        // 引入 jQuery CSS 正则获取
        jQuery.expr[':'].regex = function (elem, index, match) {
            var matchParams = match[3].split(','),
                validLabels = /^(data|css):/,
                attr = {
                    method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
                    property: matchParams.shift().replace(validLabels, '')
                },
                regexFlags = 'ig',
                regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
            return regex.test(jQuery(elem)[attr.method](attr.property));
        };


        let scriptStr = `
            <script>
              function clickDownload() {
                var childs = $('div:regex(class,tbody*)').children();
                for (let i = 0; i < childs.length; i++) {
                    const element = childs[i];
                    setTimeout(() => {
                        let child = $(element).find("div:regex(class,action-wrapper*)")[0]
                        $(child).children()[0].click()
                        var nodes = $('div:regex(class,dropdown-menu*)');

                        nodes.each((index, element) => {
                            let list = Array.prototype.slice.call(element.classList)
                            if (list.indexOf("ant-dropdown-hidden") === -1) {
                                // 下载
                                $(element).find("div:regex(class,menu-wrapper*)")[0].click()
                                // 隐藏前面打开的样式
                                setTimeout(() => {
                                    $(element).addClass("ant-dropdown-hidden")
                                }, 200);
                            }
                        });
                    }, i * 1000);
                }
              };
            </script>
          `;
        $(scriptStr).appendTo("body");

        // --------------------------
        // test
        // var childs = $('div:regex(class,tbody*)').children();
        // var child = $(childs[0]).find("div:regex(class,action-wrapper*)")[0]
        // $(child).children()[0].click()
        // var nodes = $('div:regex(class,dropdown-menu*)');
        // nodes.each((index, element) => {
        //     let list = Array.prototype.slice.call(element.classList)
        //     if (list.indexOf("ant-dropdown-hidden") === -1) {
        //         // 下载
        //         $(element).find("[data-spm-anchor-id]")[0].click()
        //         // 隐藏前面打开的样式
        //         setTimeout(() => {
        //             $(element).addClass("ant-dropdown-hidden")
        //         }, 200);
        //     }
        // });
        // test
        // --------------------------

        setTimeout(function () {
            $("<button type='button' onclick='clickDownload()'>批量下载</button>").appendTo($(".nav-menu--1wQUw")[0]);
        }, 500)
        console.log('finish...')
    });

})();



