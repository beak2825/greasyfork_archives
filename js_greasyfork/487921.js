// ==UserScript==
// @name 秀人聚图功能
// @namespace http://tampermonkey.net/
// @version 1.1
// @description 把其他页面的图片放在本页显示
// @author me
// @match https://www.xr05.vip/*
// @icon 
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487921/%E7%A7%80%E4%BA%BA%E8%81%9A%E5%9B%BE%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/487921/%E7%A7%80%E4%BA%BA%E8%81%9A%E5%9B%BE%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    var add = 0;
 var url = document.baseURI;
    // 找到下页网址
    function goToLastPage() {

        if (url.includes('_')) {
            let matchResult = url.match(/_(\d+).html/)[1];
            var replacedString = url.replace(/_(\d+).html/, `_${Number(matchResult)+add}.html`);

        } else {
            replacedString = url;
            url = url.replace('.html', '_1.html');
        }

        add++;
        console.log('replacedString:'+replacedString);
        getImagesFromPage(replacedString);
    }


    // 给页面添加图片
    function showImg(url) {

        let img = document.createElement('img');
        img.id = 'tampermonkey-img';
        img.style.display = "block";
        img.style.margin = "0 auto";
        img.style.objectFit = "contain";
        img.src = url;
        console.log('url:'+ url);
        document.body.appendChild(img);
    }

    //页图片地址
    function getImagesFromPage(url) {
        // 给定地址中获取图片并显示
        fetch(url)
            .then(response => response.text())
            .then(html => {
            let tempContainer = document.createElement('div');
            tempContainer.innerHTML = html;
            let imgElements = tempContainer.querySelectorAll('.content img');

            for (let i = 0; i < imgElements.length; i++) {
                let imgElement = imgElements[i];
                showImg(imgElement.src);
            }
        })
            .catch(error => console.log(error));
    }
    setInterval(goToLastPage,1000);

})();