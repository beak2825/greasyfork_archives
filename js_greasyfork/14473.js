// ==UserScript==
// @name         flvcd硕鼠视频网站前置广告系统去除
// @namespace    http://weibo.com/qiangtoutou
// @version      2015年12月3日21时07分38秒
// @description  flvcd硕鼠视频网站前置广告系统去除.
// @author       qiangtou
// @match        http://www.flvcd.com/parse.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14473/flvcd%E7%A1%95%E9%BC%A0%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E5%89%8D%E7%BD%AE%E5%B9%BF%E5%91%8A%E7%B3%BB%E7%BB%9F%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/14473/flvcd%E7%A1%95%E9%BC%A0%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E5%89%8D%E7%BD%AE%E5%B9%BF%E5%91%8A%E7%B3%BB%E7%BB%9F%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';


//playOverCallback函数里面会有调TSPopup.closeDiv(),这里直接赋空function
TSPopup.closeDiv=$.noop

//正则取得playOverCallback的函数名，这个名字是硕鼠后台动态生成的，每次都不一样
var playOverCallback=avdPlay.toString().match(/playOverCallback:"(\w+)"/)[1]

//把定时器里面的500ms换成100,加快执行
var newFun=window[playOverCallback].toString().replace(/\d+/g,'100')

//eval一下,生成新的function
eval(newFun)

//执行去广告回调
window[playOverCallback]()