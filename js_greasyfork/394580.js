// ==UserScript==
// @name         FJUT教务系统优化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  2020-1-3更新。解除第一次进入时的五秒阅读限制；去除离开教务系统时的离开提醒
// @author       Liquor
// @supportURL   https://greasyfork.org/zh-CN/scripts/394580-fjut%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96/feedback
// @match        https://jwxt.fjut.edu.cn/jwglxt/xtgl/index_initMenu.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394580/FJUT%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/394580/FJUT%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
$("#btn_yd").prop("disabled",false).addClass("btn-primary").unbind().click(function(){
						window.location.href = _path+'/xtgl/login_loginIndex.html';

					});
    flag=false;
})();