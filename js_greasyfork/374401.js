// ==UserScript==
// @name         baiduIndex
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度首页简化
// @author       HeYuhua
// @match        https://www.baidu.com/
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/374401/baiduIndex.user.js
// @updateURL https://update.greasyfork.org/scripts/374401/baiduIndex.meta.js
// ==/UserScript==
// 登陆百度账号后，再开启此脚本
(function() {
    'use strict';
    var data = {
    	//都是通过querySelectorAll获取到元素
        str: [
            //'head', //最外层
            '#s_top_wrap', //头部的底色元素
            '#s_upfunc_menus', //左边的消息、换肤，的父元素
            '#u_sp', //右边的元素
            '#s_lg_img', //搜素框上，百度的图片
            '#bottom_container', //页脚
            '#result_logo', //下拉后左上角出现的百度图片
            '#s_mancard_main .s-menu-container', //我的关注
            '#s_xmancard_mine .tips-manager-area', //自定义
        ],
        remove:[
			// '#s_mancard_main div.s-more-bar',//滑动查看更多
        ]
    };
    //获取ele
    function getEle(str) {
        console.log(document.querySelectorAll(str)[0]);
        return document.querySelectorAll(str)[0];
    }
    //隐藏元素
    function hiddenEle(ele) {
        ele.style.display = 'none';
        ele.style.visibility = 'hidden';
    }
    //移除元素
    function removeEle(ele){
		ele.remove();
    }
    //隐藏
    for (var i = 0; i < data.str.length; i++) {
    	hiddenEle(getEle(data.str[i]));
    }
    //移除
    for (var j = 0; j < data.remove.length; j++) {
    	removeEle(getEle(data.remove[j]));
    }

})();