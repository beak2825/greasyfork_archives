// ==UserScript==
// @name              谷歌搜索后增加百度搜索
// @name:en           Add Baidu search after Google search
// @namespace         http://www.wangmutan.com/
// @version           0.1
// @description       描述:谷歌搜索后增加百度搜索
// @description:en    desc:Add Baidu search after Google search
// @author            wangmutan
// @create            2018-07-22
// @lastmodified      2018-08-08
// @match             http*://www.google.com.hk/*
// @match             http*://www.google.com/*
// @grant             none
// @require           http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/383110/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%90%8E%E5%A2%9E%E5%8A%A0%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/383110/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%90%8E%E5%A2%9E%E5%8A%A0%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var baiduBtn = document.createElement('span'); // Google 搜索按钮
    baiduBtn.innerHTML = "<input value='百度一下' aria-label='百度一下' name='btnBD' type='submit' jsaction='sf.chk'>";
    $(".FPdoLc center").append(baiduBtn);//获取 谷歌button 的位置，并追加 百度 button
    baiduBtn.addEventListener('click', function () {
        var input = $(".gLFyf"); // 谷歌输入框
        var keyword = input.val().replace(/(^\s*)|(\s*$)/g, ""); // 搜索关键字（去空格）
        if (keyword != "") {
            return googleSearch(keyword);
        }
    })

    document.onkeyup = function (e) {//按键信息对象以函数参数的形式传递进来了，就是那个e
    var code = e.charCode || e.keyCode;//取出按键信息中的按键代码(大部分浏览器通过keyCode属性获取按键代码，但少部分浏览器使用的却是charCode)
    if (code == 13 && e.ctrlKey) {
        //此处编写用户敲回车后的代码
        var input = $(".gLFyf"); // 谷歌输入框
        var keyword = input.val().replace(/(^\s*)|(\s*$)/g, ""); // 搜索关键字（去空格）
        if (keyword != "") {
            return googleSearch(keyword);
        }
    }
    }

    function googleSearch(keyword){ // Google 搜索
        var link = "https://www.baidu.com/s?wd=" + encodeURIComponent(keyword);
        // window.location.href = link; //当前窗口打开链接
        window.open(link); //新窗口打开链接
    }
})();
