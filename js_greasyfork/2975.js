// ==UserScript==
// @name       贴吧手机版跳转
// @namespace   tiebamb2tiebapc
// @description    百度贴吧手机版自动跳转为电脑版
// @include     http://tieba.baidu.com/mo/m*
// @include     https://tieba.baidu.com/mo/m*
// @version     14.09.02.1
// @author     17yard
// @grant       none
// @icon        http://ww3.sinaimg.cn/large/5cf8ff8dgw1ehu56yclmpj20280283yb.jpg
// @namespace https://greasyfork.org/scripts/2975

// @downloadURL https://update.greasyfork.org/scripts/2975/%E8%B4%B4%E5%90%A7%E6%89%8B%E6%9C%BA%E7%89%88%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/2975/%E8%B4%B4%E5%90%A7%E6%89%8B%E6%9C%BA%E7%89%88%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

//若不想跳转时禁用此脚本即可

location.replace(
	location.href.replace('://tieba.baidu.com/mo/m', '://tieba.baidu.com/f')
)