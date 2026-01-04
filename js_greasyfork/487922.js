// ==UserScript==
// @name 绅士漫画聚图功能
// @namespace http://tampermonkey.net/
// @version 1.0
// @description 把其他页面的图片放在本页显示
// @author me
// @match https://www.wnacg.com/photos-view-id-*
// @match https://www.wnacg.com/?ctl=photos&act=view&id=*
// @icon https://www.wnacg.com/favicon.ico
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487922/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E8%81%9A%E5%9B%BE%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/487922/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E8%81%9A%E5%9B%BE%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    var add = 0;
    var maxnum = goToLastPage();
    function goToLastPage() {
        var selectElement = document.querySelector('.pageselect'); // 获取<select>元素
        var options = selectElement.getElementsByTagName('option'); // 获取所有<option>元素
        var max = options.length;
        return max;
    }


    function num(){
        if(add <= maxnum){
            let imgElement = document.querySelector('#picarea');
            let imgUrl = imgElement.getAttribute('src');
            console.log('imgUr:'+ imgUrl);

            // 从 URL 中提取图片 ID
            let regex = /\/(\d+)\.(jpg|png)$/i;
            let filename = imgUrl.match(regex)?.[1];
            console.log('filename:'+ filename);
            let incrementedStr = String(parseInt(filename) + add).padStart(filename.length, '0');
            add++;

            let replacedUrl = imgUrl.replace(filename + '.jpg', incrementedStr + '.jpg');
            let url = 'https:' + replacedUrl;
            showImg(url);
        }else{
            clearInterval();
        }
    }
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

    setInterval(num,1000);
})();