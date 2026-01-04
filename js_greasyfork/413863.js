// ==UserScript==
// @name         网站净化
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  对一部分的网站进行净化修改
// @author       RO
// @match        *://juejin.im/*
// @match        *://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413863/%E7%BD%91%E7%AB%99%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/413863/%E7%BD%91%E7%AB%99%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    //'use strict';

    // 首先获取到这个网站的地址，以便判断是啥网站
    var url = window.location.href;
    var domain = document.domain;

    // 屏蔽掘金网站的下方浏览器推荐
    if(domain == 'juejin.im'){
        var juejinbrower = document.getElementsByClassName('extension')[0];
        juejinbrower.style.display = 'none';
    }

    // 屏蔽CSDN网站右上方浏览器缩放提示
    // 以及导航栏上方的什么鬼研讨会
    // 还有什么强迫性的博主关注
    if(domain == 'csdn.net'){
        $(function(){
            $('div.leftPop').hide();
            $('#csdn-toolbar').find('.toolbar-advert').hide();
            $('.left-toolbox .toolbox-list .tool-item').find('p#health-companies').next().hide();
        });
    }
})();