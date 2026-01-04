// ==UserScript==
// @name         漫客栈台自动去除付费弹窗与阅读屏蔽
// @namespace    https://greasyfork.org/
// @iconURL      https://static.mkzcdn.com/common/favicon.ico
// @version      1.0
// @description  漫客栈自动去除付费弹窗与阅读屏蔽插件
// @author       DreamFly
// @match        http://*.mkzhan.com/*
// @match        https://*.mkzhan.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401835/%E6%BC%AB%E5%AE%A2%E6%A0%88%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%E4%BB%98%E8%B4%B9%E5%BC%B9%E7%AA%97%E4%B8%8E%E9%98%85%E8%AF%BB%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/401835/%E6%BC%AB%E5%AE%A2%E6%A0%88%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%E4%BB%98%E8%B4%B9%E5%BC%B9%E7%AA%97%E4%B8%8E%E9%98%85%E8%AF%BB%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var search_id = function(id){
        if (id.search('^layui-layer') >= 0)
        {
            return true
        }

        return false
    };

    var search_class = function(className){
        if (className.search('^rd-article__pic') >= 0){
            return true
        }

        return false
    };


    var loop = function () {
        //当显示付费弹框时再做处理

        let element_ids = [ ]
        let div_ids = document.getElementsByTagName('div')
        if (div_ids){
            for (let i = 0; i < div_ids.length; i++){
                let element = div_ids[i]
                if (element.id){
                    if (search_id(element.id)){
                        element_ids.push(element.id)
                    }
                }
            }
        }

        for (let j in element_ids) {
            let shade = document.getElementById(element_ids[j]);
            if (shade && shade.style.display != 'none') {
                shade.style.display = 'none';
            }
        }

        //处理
        let class_names = []
        let div_classs = document.getElementsByTagName('div')
        if (div_classs){
            for (let i = 0; i < div_classs.length; i++){
                let element = div_classs[i]
                if (element.className){
                    if (search_class(element.className)){
                        class_names.push(element.className)
                    }
                }
            }
        }

        for (let m in class_names) {
            let shades = document.getElementsByClassName(class_names[m]);
            if (shades) {
                for (let i = 0; i < shades.length; i++){
                    let shade = shades[i]
                    if (shade.style.display != 'block') {
                        shade.style.display = 'block';
                    }

                    let image = shade.firstElementChild
                    if (image){
                        if (image.src.search('lazyload_img.png') >= 0) {
                            image.src = image.dataset.src + '-x'
                            image.style.display ='inline-block'
                        }
                    }
                }
            }
        }

    };

    //开启滚动条
    document.body.style.overflow = 'unset';

    //循环执行
    setInterval(loop, 15);
})();
