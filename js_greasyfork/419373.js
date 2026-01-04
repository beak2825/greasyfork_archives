// ==UserScript==
// @name        百度主页净化
// @namespace   Violentmonkey Scripts
// @match       https://www.baidu.com/
// @grant       none
// @version     2.2
// @author      HCDH820
// @description 2020/12/30 上午10:42:49
// @downloadURL https://update.greasyfork.org/scripts/419373/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/419373/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

function FuckAD(PID) {
    var object = document.getElementById(PID); //通过id获取器获取对应元素
    if (object != null){
        object.parentNode.removeChild(object);     //删除对应的元素信息
    }
}

FuckAD('s_lg_img');
FuckAD('s_main');
FuckAD('s_top_wrap');
FuckAD('u1');
FuckAD('s-top-left');
FuckAD('s-hotsearch-wrapper');
FuckAD('bottom_layer');
FuckAD('s_side_wrapper');


