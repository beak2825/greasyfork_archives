// ==UserScript==
// @name 圣豆
// @version 0.01
// @license MIT
// @description 圣豆泥位监测改大字
// @namespace Violentmonkey Scripts
// @match http://hanzhong.sundaytek.com/control.html*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/509902/%E5%9C%A3%E8%B1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/509902/%E5%9C%A3%E8%B1%86.meta.js
// ==/UserScript==
$('head').append(`<style>
#pool_1, #pool_2, #pool_3, #pool_4{
    width:195px;
    height:165px;
    margin:10px 0.2em
}

.pools_list li span{
    font-size:4em!important;
    font-weight:bold;
}

.chart_3{
    width:69%!important; 
}

.main .right .chart_4{
    width:30%!important; 
}
</style>`)
