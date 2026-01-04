// ==UserScript==
// @license      MIT
// @name         imgur图片镜像换源
// @namespace    http://tampermonkey.net/
// @version      2024-03-05
// @description  imgur图片镜像换源,通过镜像服务器换源预览
// @author       snow win
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492194/imgur%E5%9B%BE%E7%89%87%E9%95%9C%E5%83%8F%E6%8D%A2%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/492194/imgur%E5%9B%BE%E7%89%87%E9%95%9C%E5%83%8F%E6%8D%A2%E6%BA%90.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...


    var is_add = false;
    var prefix_img = "https://img.noobzone.ru/getimg.php?url=";
    var images = document.getElementsByTagName("img");
    for (var i = 0; i < images.length; i++) {
        var img_src = images[i].src;

        if(img_src.indexOf("imgur")>-1){
            if(!is_add){
                // 创建meta标签
                var meta = document.createElement('meta');

                // 设置meta标签的属性
                meta.setAttribute('name', 'referrer');
                meta.setAttribute('content', 'no-referrer');

                // 将meta标签添加到head中
                document.getElementsByTagName('head')[0].appendChild(meta);
                is_add = true;
            }
            img_src = prefix_img + img_src;
            images[i].src = img_src;
            var aElement = images[i].parentNode;
            if(null != aElement){
                aElement.href = prefix_img + aElement.href;
            }
        }
    }
})();