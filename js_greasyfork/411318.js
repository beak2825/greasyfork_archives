// ==UserScript==
// @name         拼多多登录助手
// @description  显示账号对应店铺
// @namespace    https://greasyfork.org/zh-CN/scripts/411318-%E6%8B%BC%E5%A4%9A%E5%A4%9A%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B
// @author       laoame
// @copyright    laoame
// @match        *://mms.pinduoduo.com/login*

// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @version      1.5
// @downloadURL https://update.greasyfork.org/scripts/411318/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/411318/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var cur_url = window.location.href; //获取往前网页链接
    $(document).ready(function() {
        //页面加载完毕之后插入元素
        if (cur_url.indexOf("login") != -1) {
            //编辑宝贝
            $('body').append('<div style="position: absolute;top:90px;left:50%;margin-left:230px;background-color: #fff;font-size: 14px;">	<table width="320" border="1" style="border-collapse:collapse;" >	<TR>		<td align="center" width="150">小丁美妆</td>		<td align="center">pdd2619999647</td>	</TR>	<TR>		<td align="center">爱美丽</td>		<td align="center">pdd74302795625</td>	</TR>	<TR>		<td align="center">玉之颜</td>		<td align="center">pdd20388122530</td>	</TR>	<TR>		<td align="center">俏美丽</td>		<td align="center">17326906474</td>	</TR>	<TR>		<td align="center">小美美妆</td>		<td align="center">17319431592</td>	</TR>	<TR>		<td align="center">连俏</td>		<td align="center">15313727293</td>	</TR></table></div>');
            $('body').append('<div style="position: absolute;top:552px;left:50%;margin-left:230px;background-color: #fff;font-size: 14px;"><table width="320" border="1" style="border-collapse:collapse;" >	<TR>		<td align="center" width="150">东方之美6号店</td>		<td align="center">17701204746</td>	</TR>	<TR>		<td align="center">淼淼家de店</td>		<td align="center">19910384020</td>	</TR>	<TR>		<td align="center">诚实守信美妆店</td>		<td align="center">17326849244</td>	</TR>	<TR>		<td align="center">小精灵</td>		<td align="center">17718536404</td>	</TR></table></div>');
        }
    });
})();