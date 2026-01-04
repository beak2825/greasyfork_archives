// ==UserScript==
// @name         juejinBackgroundImage
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  修改掘金背景图，设置自己喜欢的背景图！
// @author       wjh
// @match        https://juejin.cn
// @match        https://juejin.cn/*
// @icon         https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/849e3902e63a42cea93abb448cb0bb0f~tplv-k3u1fbpfcp-watermark.image
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469705/juejinBackgroundImage.user.js
// @updateURL https://update.greasyfork.org/scripts/469705/juejinBackgroundImage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        // 图片路径
        let imgUrl = window.localStorage.getItem('imgUrl') || 'https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d58e69aaefa4aa59fdd61f1a58ede84~tplv-k3u1fbpfcp-watermark.image'
        let uploadBox = "<div id='uploadBox' style='position:fixed;top:80px;right:20px;background:rgba(255,255,255,0.5);padding: 10px;'><input style='width:66px;' type='file' name='' id='files'></div>"

        $('#juejin').css('backgroundImage',`url(${imgUrl})`);
        $('#juejin').css('backgroundSize',`100%`);

        $('body').append(uploadBox);


        $("#files").change(function(e) {
            readFileAsDataURL($('#files')[0].files[0]).then(dataURL => {
                window.localStorage.setItem('imgUrl',dataURL)
                $('#juejin').css('backgroundImage',`url(${dataURL})`);
            });
        })
    })


    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = function(event) {
                resolve(event.target.result);
            };

            reader.onerror = function(event) {
                reject(new Error("File could not be read! Code " + event.target.error.code));
            };

            reader.readAsDataURL(file);
        });
    }



    // Your code here...
})();