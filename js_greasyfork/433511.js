// ==UserScript==
// @name         芯参数查看
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  芯参数查看zy
// @author       mfk
// @require https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @match        https://www.xincanshu.com/*
// @downloadURL https://update.greasyfork.org/scripts/433511/%E8%8A%AF%E5%8F%82%E6%95%B0%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/433511/%E8%8A%AF%E5%8F%82%E6%95%B0%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //setInterval(function(){

        $($(".vip_denglukejian div")[3]).html('<style>.cack_jt_box {display: block;}</style>');
        $.cookie('cackxinyuemima', mima,{path:'/'});

       // },1000)
})();