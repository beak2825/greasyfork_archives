// ==UserScript==
// @name         微博视频保存
// @namespace    https://yffjglcms.com/
// @version      20241007
// @description  支持微博视频、图片保存
// @author       yffjglcms
// @match        *://s.weibo.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503431/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/503431/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // card-act
    // thumbnail

    // 如果存在则执行
    function ifExist(selector, func, timeout){
        console.log('check ifExist ...' + selector)
        if(!timeout){
            timeout = 5000
        }

        if(document.querySelector(selector)==null)
        {
            setTimeout( function(){ifExist(selector, func);}, timeout);
        }
        else
        {
            func()
        }
    }

    function closest(selector, element) {
        // 检查当前元素是否匹使用选择器
        if (element.matches(selector)) {
            return element;
        }

        // 如果当前元素不匹配，则查找父元素
        var parent = element.parentNode;

        // 如果没有父元素，则已到达文档的顶部，返回null
        if (!parent) {
            return null;
        }

        // 在父元素的子节点中查找匹配的元素
        var closestElement = parent.querySelector(selector);

        // 如果找到了，则返回该元素
        if (closestElement) {
            return closestElement;
        }

        // 否则递归调用closest函数
        return closest(selector, parent);
    }

    function renderDownload(){
        // $('.card .card-act ul').append(`<li><a title="">下载</a></li>`)
        var ulElements = document.querySelectorAll('.card .card-act ul');
        console.log("uls:::", ulElements)
        ulElements.forEach(function(ul) {


            var cardFeed =  closest('.card-feed', ul);
            if (!cardFeed) return

            var newLi = document.createElement('li');
            var newA = document.createElement('a');
            newA.title = '';
            newA.textContent = '下载视频';

            // 在这里，cardFeed就是<ul>元素最近的具有'card-feed'类的祖先元素
            // console.log(cardFeed);
            var cardVideoSrc = cardFeed.querySelector('video')?.src
            if(cardVideoSrc){
                // console.log(cardVideoSrc);
                newA.href=cardVideoSrc
                newLi.appendChild(newA);
                ul.appendChild(newLi);
            }
        })
    }

    function renderDownloadImg(){
        // $('.card .card-act ul').append(`<li><a title="">下载</a></li>`)
        var ulElements = document.querySelectorAll('.card .card-act ul');
        console.log("uls:::", ulElements)
        ulElements.forEach(function(ul) {


            var cardFeed = closest('.card-feed', ul);
            if (!cardFeed) return

            var newLi = document.createElement('li');
            var newA = document.createElement('a');
            newA.title = '';
            newA.textContent = '下载图片';

            // 在这里，cardFeed就是<ul>元素最近的具有'card-feed'类的祖先元素
            // console.log(cardFeed);

            var imgSrc = [...cardFeed.querySelectorAll('img')].filter(x=>x.src.indexOf('thumb150') > 0).map(x => x.src.replaceAll('thumb150', 'large'));
            if(imgSrc && imgSrc.length > 0){
                console.log("imgSrc:::", imgSrc);
                newA.href='javascript:void(0);'
                newLi.appendChild(newA);


                newA.addEventListener('click', async () => {
                    const imageUrls = imgSrc;
                    console.log("imageUrls:::", imageUrls);
                    const zip = new JSZip();
                    const promises = imageUrls.map(async (url, index) => {
                        const resp = await fetch(url);
                        if (!resp.ok) {
                            throw new Error(`Failed to fetch ${url}`);
                        }
                        const blob = await resp.blob();
                        zip.file(`image${index + 1}.${url.split('.').pop()}`, blob);
                    });

                    try {
                        await Promise.all(promises);
                        const content = await zip.generateAsync({ type: 'blob' });
                        saveAs(content, 'images.zip');
                    } catch (error) {
                        console.error('Error downloading images or creating ZIP:', error);
                    }
                });
                ul.appendChild(newLi);
            }
        });
    }

    ifExist(".thumbnail", renderDownload, 100)
    ifExist(".media", renderDownloadImg, 100)
})();