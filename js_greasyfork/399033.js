// ==UserScript==
// @name        百度结果筛选-去除包含不想看到网站的结果
// @namespace   Kem monkey Scripts
// @match       https://www.baidu.com/baidu*
// @match       https://www.baidu.com/s?*
// @grant       none
// @version     1.1
// @author      -
// @description 2020/3/30 下午4:21:38
// @downloadURL https://update.greasyfork.org/scripts/399033/%E7%99%BE%E5%BA%A6%E7%BB%93%E6%9E%9C%E7%AD%9B%E9%80%89-%E5%8E%BB%E9%99%A4%E5%8C%85%E5%90%AB%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E7%BD%91%E7%AB%99%E7%9A%84%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/399033/%E7%99%BE%E5%BA%A6%E7%BB%93%E6%9E%9C%E7%AD%9B%E9%80%89-%E5%8E%BB%E9%99%A4%E5%8C%85%E5%90%AB%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E7%BD%91%E7%AB%99%E7%9A%84%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==
$(document).ready(function () {
    //数组中添加要屏蔽网站的关键词
    var arrBlackList = [
        "腾讯云计算",
        "xici.net",
      "maiche.com",
      "wodingche.com"
    ];
    console.log(arrBlackList);
  len = arrBlackList.length;  
  var items = document.getElementsByClassName('f13'); //获取网页中所有的p元素
    for (var i = items.length-1; i >=0 ; i--) { //由于获取的是数组对象,因此需要把它循环出来
        var txt = items[i].innerText;
        
      for (j = 0; j < len; j++) {
            if (txt.indexOf(arrBlackList[j]) != -1) {
                console.log(items[i].innerText);
                items[i].parentNode.remove();
                break;
            }
        }
    }
});